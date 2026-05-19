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
session id: 019e3a0d-3067-7412-92ae-a9665e0495e4
--------
user
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

codex
검토 범위가 넓어서 먼저 SoT와 구현 파일의 실제 상태를 나란히 확인하겠습니다. 이후에는 finding만 추려서 심각도별로 정리하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg --files packages/core-content packages/db packages/migrations-runner apps/web/src | rg "(C0009|C0010|C0011|C0012|C0013|D0014|schema.ts|index.ts|eat-content-schema|errors|db-projection|ArticleCategoryForm|PublicationForm|MediaAppearanceForm|FaqForm|ArticleForm|admin|markdown|json-ld|faq/page|doctors/.*/page|about/page|insights/.*/page|sitemap.xml|seed|eat-validate|markdown.test)"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "EC-SCHEMA|EC-FORM|EC-RENDER|EC-CONTENT|EC-SEO|EC-DEFER|EC-CASCADE|ECP-|§|P-011|PSR-DEFER|scenario|24|36" docs/decisions/EAT_CONTENT_PLAN.md docs/core/DATA_MODEL.md docs/core/SCHEMA_MAPPING.md docs/core/CONTENT_STANDARDS.md docs/core/PAGE_TYPES.md docs/admin/ARCHITECTURE.md docs/decisions/PUBLIC_SITE_RENDER_PLAN.md' in C:\Users\assag\solution\website-exposure
 succeeded in 613ms:
docs/admin/ARCHITECTURE.md:4:> **작성일**: 2026-05-14 (v0.6 → v0.7 — 피드백 정정: § 3.2 사이트 기본 정보 화면 입력/출력 SoT 정합)
docs/admin/ARCHITECTURE.md:6:> **상위 문서**: `docs/ARCHITECTURE.md` § 10
docs/admin/ARCHITECTURE.md:32:│  │ 6개 핵심 화면 (Vertical Slice — § 3)                              │  │
docs/admin/ARCHITECTURE.md:78:| 6 | **컴플라이언스 강제** | 상위 § 9 게이트를 UI 레벨에서 우회 불가하게 강제 |
docs/admin/ARCHITECTURE.md:125:| ② | 사이트 기본 정보 | 의료기관 정체성 + 본원 위치·연락·시간 + 정책 변수 입력 (3 섹션) | `ClinicProfile` + `LocationProfile`(main) + `LegalDocument`(privacy·terms 등) | 3 계약 동시 출력 — § 3.8.1 / § 3.8.2 자동 생성 규칙 적용 |
docs/admin/ARCHITECTURE.md:133:> § 3.8.1과 정합: 어드민 폼 한 화면이 두 계약을 분리 출력하는 경우 명시.
docs/admin/ARCHITECTURE.md:138:| `LocationProfile`(slug=`main`) (C-21) | 본원 주소·전화·이메일·진료시간(`BusinessHours`)·예약 채널(`CTAConfig[]`) | ✅ (ClinicProfile 폼의 "본원 위치·연락·시간" 섹션에서 자동) | ClinicProfile 화면 (본원 위치 섹션) — § 3.8.1 |
docs/admin/ARCHITECTURE.md:139:| `LegalDocument` (C-16) | `documentType`·`title`·`effectiveDate`·`contactPerson` (`body`는 Core 표준 템플릿 + 변수 자동 치환) | ✅ (Core 표준 템플릿 + ClinicProfile + LocationProfile 변수) | ClinicProfile 화면 (정책 변수 보조 섹션) — § 3.8.2 |
docs/admin/ARCHITECTURE.md:144:| `ComplianceRecord` (C-10) | 위험도·자동 검수 결과·검수자·일자·발행자·발행일 (LegalDocument는 `legalCounsel`·`legalCounselAt` 필수 — § 3.8.2) | ✅ (어드민이 발행 시 기록) | 미리보기·발행 화면 |
docs/admin/ARCHITECTURE.md:171:### 3.8 Slice 사이트 측 페이지 타입 (Data Plane이 빌드) — 10종 + Article 1샘플 = 11개 페이지 (EAT v0.x EC-CASCADE-08·09)
docs/admin/ARCHITECTURE.md:173:> 상세는 `core/PAGE_TYPES.md` § 6 (단일 진실 원본).
docs/admin/ARCHITECTURE.md:184:| 8 | **P-014 Location Detail (main 자동)** | LocationProfile(slug=`main`) 1개 자동 생성. 어드민 화면 추가 없음 (§ 3.8.1 규칙) |
docs/admin/ARCHITECTURE.md:185:| **9** | **P-013 Legal / Policy (자동 생성)** | **출시 게이트** — Core 표준 템플릿 + ClinicProfile 변수 치환. 법무 검토 필수 (§ 3.8.2 규칙) |
docs/admin/ARCHITECTURE.md:186:| **10** | **P-011 FAQ (EAT v0.x EC-CASCADE-08 합류)** | FAQPage JSON-LD · 어드민 Faq 폼 신규 · `/<slug>/faq` 공개 페이지 |
docs/admin/ARCHITECTURE.md:233:**Body 변수 화이트리스트 reference (LL-CASCADE-01 · LOCATION_LEGAL_PLAN v1.0 § 5 SoT)** — 본문 `body` 에 허용된 11개 변수. 등록되지 않은 키는 `renderTemplate` 이 `TemplateRenderError("unknown-variable")` 으로 거부한다.
docs/admin/ARCHITECTURE.md:244:| policy | `{{policy.contactPerson}}` | ClinicProfile.policyContactPerson — § 3.8.2 "정책 변수" 보조 섹션 입력 |
docs/admin/ARCHITECTURE.md:274:| 1 | 사이트 측 페이지 타입 10종 + Article 1샘플 빌드 (총 11 페이지) | Home·About·Doctors List·Doctor Profile·Treatments List·Treatment Detail·**Contact**·**Location Detail (main 자동)**·**Legal/Policy (자동, 법무 검토)**·**FAQ (EAT v0.x EC-CASCADE-08)**·Article Detail 1개 — 정적 빌드 가능. 상세는 PAGE_TYPES.md § 6 |
docs/admin/ARCHITECTURE.md:283:Phase 0 단계 `apps/web` 안 어드민 + 공개 사이트 두 영역을 같은 Next.js 앱 안 route group 으로 분리한다. PUBLIC_SITE_RENDER_PLAN v0.x § 2.1 의 acceptance precondition cascade.
docs/admin/ARCHITECTURE.md:290:**격상 의도**: 어드민 `/<slug>` 와 공개 `/<slug>` 가 같은 path namespace 를 공유하면 충돌. 본 격상으로 `(admin)` 은 `/admin/<slug>` · `(site)` 는 `/<slug>` 로 분리. M0 v1.0 도메인 매핑 (PSR-DEFER-02) 합류 시 어드민 도메인 (`app.glitzy.co`) 분리 가능 — 그 시점에 `/admin` prefix 유지 또는 제거 결정.
docs/admin/ARCHITECTURE.md:296:### 4.1 M0 — Vertical Slice (§ 3 참조)
docs/admin/ARCHITECTURE.md:298:위 § 3 명세. 1호 클라이언트 출시 가능 시점.
docs/admin/ARCHITECTURE.md:319:| 컴플라이언스 게이트 전체 (상위 § 9 5단계) | UI 강제 |
docs/admin/ARCHITECTURE.md:348:- 구조 블록 삽입 (Q&A·리스트·표 — 상위 § 4.1)
docs/admin/ARCHITECTURE.md:354:> **계약 필드 vs 폼 입력 필드의 구분** (§ 3.8.1 참조): 어드민 UI 한 화면이 여러 계약 필드를 분리해 출력하는 케이스가 있다. 화면 수와 계약 수는 1:1이 아니다.
docs/admin/ARCHITECTURE.md:388:- 성능 field metric 추세 (상위 § 4.3)
docs/admin/ARCHITECTURE.md:434:`ComplianceRecord`는 상위 § 9.4 정책을 따른다 — 감사·법무 증빙 풀데이터는 DB가 원본, 사이트 빌드 참조용 가벼운 메타는 Git에 사본.
docs/admin/ARCHITECTURE.md:513:| 2026-05-13 | v0.2 | **주요 갱신** (피드백 3차): (1) Control Plane 위상 도입, (2) Admin-first 원칙 명시, (3) **Vertical Slice (M0) 6개 화면 명세 신설** (§ 3) — Article 포함, (4) Phase 명칭 M0/M1/M2/M3 + Alpha/Beta/GA 병기, (5) Git 원본 vs DB 원본 데이터 분리 명확화 (§ 6), (6) Feature Modules 통합 원칙 명시, (7) ComplianceRecord 두 영역 교차 정책 (§ 6.3) | Glitzy (Claude 페어링) |
docs/admin/ARCHITECTURE.md:514:| 2026-05-13 | v0.3 | **PAGE_TYPES.md v0.2 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 5종 → **7종 + Article 1샘플 = 8개 페이지** (Contact 추가), (2) § 3.11 완료 게이트 #1 7종 빌드로 수정, (3) 단일 진실 원본은 `core/PAGE_TYPES.md`로 명시 (중복 회피). 어드민 화면 수 6개는 유지(Contact는 ClinicProfile 자동 생성) | Glitzy (Claude 페어링) |
docs/admin/ARCHITECTURE.md:515:| 2026-05-14 | v0.4 | **PAGE_TYPES v0.5 + DATA_MODEL v0.4 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 7종+1샘플 → **8종+1샘플=9개 페이지** (P-014 Location Detail 추가), (2) **§ 3.8.1 LocationProfile(main) 자동 생성 규칙 명시** — 어드민 화면 추가 없이 ClinicProfile 입력으로 자동 생성, (3) § 3.11 완료 게이트 #1 8종 빌드로 수정. 어드민 화면 수 6개는 그대로 유지 | Glitzy (Claude 페어링) |
docs/admin/ARCHITECTURE.md:516:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **§ 3.8.1 표현 정리** — 계약 필드(파일 출력)와 어드민 폼 입력 필드(UI 수집)의 구분 명시. ClinicProfile 폼은 두 섹션(기관 정체성 + 본원 위치·연락·시간)으로 출력은 ClinicProfile + LocationProfile main 두 파일, (2) **§ 3.8.2 LegalDocument 자동 생성 규칙 신규** — Core 표준 템플릿 + ClinicProfile 변수 치환, ComplianceRecord 추적, (3) **§ 3.8 Slice 9종+1샘플 → 10종+1샘플=10페이지** (P-013 격상 추가), (4) § 3.11 완료 게이트 #1 10종, (5) **§ 5.2 데이터 입력 영역** — 어드민 화면별 입력·출력 매핑 표 추가로 1:1이 아님 명시 | Glitzy (Claude 페어링) |
docs/admin/ARCHITECTURE.md:517:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **§ 3.3 ClinicProfile 행 분리** — 이전 v0.3 잔존 표현(ClinicProfile에 주소·전화·시간)을 SoT 정합으로 정정. ClinicProfile/LocationProfile(main)/LegalDocument 3개 계약 행 + 자동 생성 표시, (2) **§ 3.8.2 LegalDocument body 변수 출처 정정** — ClinicProfile + LocationProfile(main) 두 SoT 명시 (`{{clinic.*}}`·`{{location.main.*}}` 네임스페이스), (3) **§ 3.8.2 법무 검토 강제 룰** — LegalDocument는 위험도 Low이지만 ComplianceRecord.legalCounsel·legalCounselAt 필수 (어드민 발행 게이트 차단) | Glitzy (Claude 페어링) |
docs/admin/ARCHITECTURE.md:518:| 2026-05-14 | v0.7 | **피드백 정정**: § 3.2 Slice 6개 화면 표 — ② 사이트 기본 정보의 입력 데이터 `ClinicProfile`만 → **`ClinicProfile` + `LocationProfile`(main) + `LegalDocument`** 3 계약 동시 출력로 정정. § 3.8.1/§ 3.8.2와 정합 | Glitzy (Claude 페어링) |
docs/core/CONTENT_STANDARDS.md:6:> **상위 문서**: `docs/ARCHITECTURE.md` § 4, § 9
docs/core/CONTENT_STANDARDS.md:22:- **단일 SoT**: § 4 의료광고 표현 룰 (금지·대체·content-gate)이 본 문서의 진실의 원본. compliance-assistant 모듈이 본 표를 기준으로 자동 검수.
docs/core/CONTENT_STANDARDS.md:24:- **content-gate**: 빌드는 통과(자동 차단 X) + 사람 검수 큐 진입 — 본문 표현 검수 + schema 출력 승인 + 위험 콘텐츠 발행 전 인간 결재의 일반 의미 (`SCHEMA_MAPPING.md` § 7.3, § 8 일관 적용).
docs/core/CONTENT_STANDARDS.md:44:- 기본 `ko-KR` (SEARCH_STANDARDIZATION § 2.1 정합)
docs/core/CONTENT_STANDARDS.md:51:| PageMeta.description | 80~160자 (SEARCH_STANDARDIZATION § 2.1 정합) |
docs/core/CONTENT_STANDARDS.md:61:- 표현 룰(§ 4) 추가·완화: MINOR (기존 콘텐츠 영향 없음)
docs/core/CONTENT_STANDARDS.md:76:| 본문 시작 1~2문장 내에 핵심 답변 배치 (§ 2.1.1 AST 정의) | warning (검색 노출 약화) | P-006·P-008·P-010·P-011 답변 단위·블록 본문 |
docs/core/CONTENT_STANDARDS.md:102:6. P-011 FAQ의 경우 각 Q&A 블록 단위로 동일 알고리즘 — `<dl>/<dt>` 다음 `<dd>` 또는 H3 다음 paragraph
docs/core/CONTENT_STANDARDS.md:106:### 2.2 헤딩 위계 (`PAGE_TYPES.md` § 2.1 정합)
docs/core/CONTENT_STANDARDS.md:154:- JSON-LD schema — 본문 Q&A 블록을 추출하여 별도 FAQPage 그래프 출력 (`SCHEMA_MAPPING` § 3 P-011 FAQPage 매핑). 렌더링 마크업과 schema 출력은 독립
docs/core/CONTENT_STANDARDS.md:160:| 답변에 § 4.1 **fail 카테고리** 표현 (완치·100%·반드시·보장 등) 포함 | **fail** (§ 4.1 직접 적용) |
docs/core/CONTENT_STANDARDS.md:161:| 답변에 § 4.1 **content-gate 카테고리** 표현 (수치·기간 단정·체질 맞춤 등) 포함 | **content-gate** (§ 4.1 적용) |
docs/core/CONTENT_STANDARDS.md:183:- 효과 수치·기간 비교표는 **content-gate** (§ 4 적용)
docs/core/CONTENT_STANDARDS.md:184:- 가격 비교표는 **High 위험** (§ 4 + P-102 정책)
docs/core/CONTENT_STANDARDS.md:206:- "효과·통계 주장" 판정 — § 4.1의 "전문성 단정 (효과·결과·보장 결합)" composite 룰 매칭 텍스트, 또는 본문 내 수치(`%`, `kg`, `cm`, `주`, `일`, `회` 등 단위 동반 숫자) + 효과 어휘(효과·결과·개선·호전·변화) 동시 등장
docs/core/CONTENT_STANDARDS.md:207:- 위 판정 텍스트가 포함된 문단·블록에 다음 중 1개라도 동일/인접 단락(2단락 이내) 존재 시 본 § 3.5 룰의 **content-gate finding 미발생** — 인용 인정. **§ 4.1 fail 룰(완치·100%·보장 등)은 인용 존재 여부와 무관하게 항상 적용** (인용 면제 대상 아님):
docs/core/CONTENT_STANDARDS.md:210:  - 외부 URL 링크 + 학술·정부 도메인 **화이트리스트** (`compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` § 8이 SoT — 와일드카드 자동 인정 없음, 검색 서비스 URL 불인정)
docs/core/CONTENT_STANDARDS.md:219:- VideoObject schema 최소 필드 출력 (SCHEMA_MAPPING § 3 P-010)
docs/core/CONTENT_STANDARDS.md:241:| **전문성 단정 (효과·결과·보장 결합)** | "100% 효과·반드시 효과·절대 안전·확실한 결과·반드시 호전" (단독 어휘 + 효과/결과/보장어 결합) | **fail** (룰 우선순위 — § 7.4.3) |
docs/core/CONTENT_STANDARDS.md:253:| "100% 효과" | "효과 인지 시점·정도는 환자 개인의 체질·생활 습관에 따라 다를 수 있습니다" (구체 효과 수치·사례 묘사는 본문 직접 진술 금지. § 3.5 인용·근거 또는 검증된 통계 출처 인용 형식으로만 기술) |
docs/core/CONTENT_STANDARDS.md:264:| 환자 후기 (치료경험담) | P-101 Reviews (선택) + ReviewPolicy(C-13) | 의료법 제56조에 따른 치료경험담 광고 금지 항목 — **본문 직접 인용 원칙 금지**. 사이트 게재가 의료광고에 해당하는지·의료법 제57조 사전심의 대상인지 여부는 매체·방식별 법무 판정 필요. 본문 효과 단정 표현은 분리하여 § 4.1 룰 적용 |
docs/core/CONTENT_STANDARDS.md:266:| 가격·할인·이벤트 안내 | P-102 Pricing / P-104 News·Event 카테고리=event / P-010 Article(`articleType=event-price`) | 본 페이지 타입·ArticleType 외 다른 페이지의 본문에는 가격·할인·이벤트 안내 텍스트 출현 시 content-gate. 압박형 유인 표현은 어디서나 fail (§ 4.1) |
docs/core/CONTENT_STANDARDS.md:272:다음 안전·주의·행정 문맥은 § 4.1 단독 어휘 룰의 예외로 처리. RiskRule의 `contextExceptions[]`에 등록.
docs/core/CONTENT_STANDARDS.md:301:- 슬롯별 위험도 격상 조건 (`PAGE_TYPES.md` § 3 P-006)
docs/core/CONTENT_STANDARDS.md:307:### 5.4 P-010 Article Detail — ArticleType별 차등 (§ 6)
docs/core/CONTENT_STANDARDS.md:309:### 5.5 P-011 FAQ — 답변 단위 위험도
docs/core/CONTENT_STANDARDS.md:311:- 답변마다 위험도 등급 부여 (`PAGE_TYPES.md` § 3 P-011)
docs/core/CONTENT_STANDARDS.md:317:- 후기 텍스트의 § 4.1 fail 표현은 자동 fail. content-gate 표현은 검수 큐 진입
docs/core/CONTENT_STANDARDS.md:322:- § 4.1 룰 일관 적용 — "최저가"·압박형 유인 표현(지금만·특가·한정·선착순)은 fail
docs/core/CONTENT_STANDARDS.md:338:RiskLevel(축 1)과 룰 severity(축 2)는 **별도 축**이며 본 표는 ArticleType의 **기본 위험도**를 정의한다. 본문 표현은 § 4.1 룰로 별도 평가된다. 위험도 High = 어드민 검수 큐 강제 진입(자동 content-gate 검수 트리거).
docs/core/CONTENT_STANDARDS.md:346:| `effect-result-related` | **High** | 치료 효과·결과 관련 — 검수 큐 강제 진입. 기본 승인 역할 `["medical"]` (§ 7.1.2). 본문에 후기·사례·금액 표현 결합 시 § 4.1·§ 4.3 룰로 인해 `legal` 추가. 사례 묘사 시 "개인차 명시" |
docs/core/CONTENT_STANDARDS.md:347:| `review-case` | **High** | 환자 치료경험담 — 의료법 제56조 광고 금지 적용. 매체·방식별 법무 판정 필요 (§ 4.3·§ 5.6 정합). ReviewPolicy(C-13) 적용 |
docs/core/CONTENT_STANDARDS.md:348:| `event-price` | **High** | 이벤트·할인·가격 안내 — 의료광고법 환자 유인 금지 적용. § 5.7·§ 5.8 정합 |
docs/core/CONTENT_STANDARDS.md:367:  featureContentType?: FeatureContentTypeId;  // Feature-backed 콘텐츠 시 사용 — § 7.1.1
docs/core/CONTENT_STANDARDS.md:375:    inferredRiskLevel?: RiskLevel;    // `RISK_LEVELS.md` § 2 자동 추론 결과 (운영 단계에서 compliance-assistant 호출 전 RiskInference로 산출). § 7.1.2 가상 finding 트리거 입력
docs/core/CONTENT_STANDARDS.md:377:  riskRules: RiskRule[];              // § 7.4 RiskRule 스키마
docs/core/CONTENT_STANDARDS.md:401:#### 7.1.1.1 ContentType 예외 — LegalDocument 면제 (LL-CASCADE-03 · LOCATION_LEGAL_PLAN v1.0 § 5)
docs/core/CONTENT_STANDARDS.md:409:| RiskRule 적용 (`riskRules: RiskRule[]`) | 정책 문서는 위험도 자동 추론 대상이 아님 | `risk_level='Low'` CHECK + 법무 검토 별도 게이트 (RISK_LEVELS § 4.3 의료법 광고 룰 우회) |
docs/core/CONTENT_STANDARDS.md:414:**ComplianceRecord 발행 게이트는 면제 아님**: LegalDocument 도 발행 단계에서 ComplianceRecord (`legalCounsel`/`legalCounselAt` 필수 · admin/ARCHITECTURE § 3.8.2) 가 별도로 요구된다. 본 절은 자동 검수 룰의 면제일 뿐 법무 검토 게이트는 그대로 유지.
docs/core/CONTENT_STANDARDS.md:416:#### 7.1.1.2 ContentType 예외 — Publication / MediaAppearance / FAQ (EC-CASCADE-03 · EAT_CONTENT_PLAN v0.x)
docs/core/CONTENT_STANDARDS.md:418:EAT_CONTENT_PLAN v0.x (C-24 Publication · C-25 MediaAppearance 신규 · C-12 FAQ 풀명세 합류) 의 검수 룰 적용 매트릭스:
docs/core/CONTENT_STANDARDS.md:424:| `FAQ` Q | **적용** | **적용** (의료법 광고 표현 검수 · MEDICAL_AD_COMPLIANCE_COMMON 정합) | **적용** (compliance-assistant 합류 시 — EC-DEFER-05) | **적용** (RISK_LEVELS § 2 자동 추론 — 의료 진단/처방 질문 = Medium/High 후보) | 클리닉 자체 답변 |
docs/core/CONTENT_STANDARDS.md:428:**v0.1 단계 운영 결정 (EAT v0.x EC-DEFER-12)**: 4 신규 entity (Publication·MediaAppearance·FAQ·ArticleCategory) 모두 어드민 폼 `status='draft'` 만 허용. compliance-assistant + risk_level 자동 추론 합류 (EC-DEFER-05) 까지 published 발행 차단. FAQ 는 DB CHECK 로 강제 (`faq_status_v01_limit`), Publication/MediaAppearance 는 zod schema 만 (DB CHECK 없음 — 외부 인용 entity 의 published 자체는 안전).
docs/core/CONTENT_STANDARDS.md:441:  requiredApproverRoles: ["medical"]  // 기본값. ArticleType별 override (§ 7.1.3)
docs/core/CONTENT_STANDARDS.md:448:- ArticleType별 기본 approver roles override — **High ArticleType만 적용** (Medium ArticleType은 본 § 7.1.2 가상 finding 미발생):
docs/core/CONTENT_STANDARDS.md:453:- Medium ArticleType(`general-medical-info`·`condition-explainer`·`treatment-explainer`)은 본 가상 finding 미발생. `physicianApprover` 등급 기본 요구는 별도 흐름(`RISK_LEVELS.md` § 6 매트릭스)으로 처리
docs/core/CONTENT_STANDARDS.md:490:  // 검수자 역할 요구 (gateRequired=true 시) — 매칭 룰의 requiredApproverRole 합집합. ArticleType High 트리거의 기본값(§ 7.1.2)과 룰 단위 요구를 union
docs/core/CONTENT_STANDARDS.md:507:// ApproverRole 정의는 § 7.1.3 참조 (medical | legal | operator | client)
docs/core/CONTENT_STANDARDS.md:510:  ruleId: string;             // § 7.4 RiskRule.id (예: "supremacy-001"). High 가상 finding은 "risk-level-high-gate", LLM 제안은 "llm-suggestion-<UUID>"
docs/core/CONTENT_STANDARDS.md:511:  category: string;           // § 7.4 RiskRule.category (예: "최상급")
docs/core/CONTENT_STANDARDS.md:515:  suggestion?: string;        // 대체 표현 (§ 4.2 참조)
docs/core/CONTENT_STANDARDS.md:517:  // (v1.3 +) 출처 추적 메타 — features/compliance-assistant.md § 4.6
docs/core/CONTENT_STANDARDS.md:527:| 빌드 게이트 (CI) | 자체 룰 checker (§ 7.4 RiskRule 스키마 기반 정규식·키워드 매칭) | `buildBlocked=true` 시 빌드 차단 |
docs/core/CONTENT_STANDARDS.md:532:§ 4.1 의료광고 표현 룰의 컴퓨팅 표현. 자체 룰 checker·compliance-assistant 모두 본 스키마를 입력으로 받는다.
docs/core/CONTENT_STANDARDS.md:538:  category: string;            // § 4.1 카테고리
docs/core/CONTENT_STANDARDS.md:542:  scope: ContentScope[];       // 적용 범위 — § 7.4.1
docs/core/CONTENT_STANDARDS.md:543:  requiredApproverRoles?: ApproverRole[];  // severity="content-gate" 시 1개 이상 필수 (배열 — § 7.1.3과 정합)
docs/core/CONTENT_STANDARDS.md:546:  legalBasis?: string[];       // 법령 조문 인용 식별자 (예: "medical-law-art56-para2-no8"). canonical RiskRule 1개에 복수 조문 매핑. `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` § 3.0 패턴
docs/core/CONTENT_STANDARDS.md:548:  contextExceptions?: ContextException[];  // 안전·주의·행정 문맥 예외 — § 4.4
docs/core/CONTENT_STANDARDS.md:554:// 복합 룰 — § 7.4.3 문맥 결합 (composite)
docs/core/CONTENT_STANDARDS.md:593:// 문맥 예외 — § 4.4 안전·주의·행정 문맥
docs/core/CONTENT_STANDARDS.md:621:- CompositeRiskRule의 `severity`는 4종(`info`/`warning`/`fail`/`content-gate`) 모두 허용 — § 4.1의 결합 의미 룰은 일반적으로 fail이나, 운영 정책에 따라 content-gate composite도 가능
docs/core/CONTENT_STANDARDS.md:626:- 룰 데이터의 원본은 본 문서 § 4.1 — 사람이 읽는 SoT
docs/core/CONTENT_STANDARDS.md:628:- 룰 변경은 § 1.4 변경 정책 적용 — 강화는 MAJOR
docs/core/CONTENT_STANDARDS.md:632:## 8. 빌드 검증 — 룰 레벨 (SCHEMA_MAPPING § 7.3·SEARCH_STANDARDIZATION § 8 정합)
docs/core/CONTENT_STANDARDS.md:636:| **fail** | 빌드 실패 | § 4.1 fail 표현 검출, H1 누락 등 |
docs/core/CONTENT_STANDARDS.md:638:| **content-gate** | **빌드는 통과(자동 차단 X) + 사람 검수 큐 진입** — 본문 표현 검수 + schema 출력 승인 + 위험 콘텐츠 발행 전 인간 결재의 일반 의미 (`SCHEMA_MAPPING.md` § 7.3 동일 의미) | § 4.1 content-gate 표현, ArticleType=High 케이스, 한의 특유 표현, SCHEMA_MAPPING의 SpecialAnnouncement 등 schema 발행 결재 |
docs/core/CONTENT_STANDARDS.md:650:| CS-A | § 1.3 본문 글자 수 산정의 정확한 정규식 — Markdown 코드 블록·링크 URL·이미지 마크업·HTML 태그·공백·문장부호 제거 패턴 + § 2.1.1 answer-first AST 파서 라이브러리 선택 | 자체 룰 checker 구현 시 |
docs/core/CONTENT_STANDARDS.md:651:| CS-D | § 3.5 인용 가능 외부 도메인 화이트리스트 (학회·정부 도메인 카탈로그) | `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` 후속 |
docs/core/CONTENT_STANDARDS.md:657:| ~~CS-01~~ | § 4.1 금지 표현 룰의 정규식·패턴 데이터 형식 | v0.2 — § 7.4 RiskRule 스키마로 확정. 데이터 파일 위치·포맷은 RISK_LEVELS.md 후속에서 결정 (CS-02 영역) |
docs/core/CONTENT_STANDARDS.md:659:| ~~CS-C~~ | Feature-backed 콘텐츠 contentType cascade | v0.5 — DATA_MODEL C-10 enum에 `Feature` 토큰 1개 cascade 추가 + `featureContentType: feature:<slug>` 별도 필드로 세부 식별 (§ 7.1.1). Core enum의 기존 콘텐츠 토큰은 변경 없이 유지 |
docs/core/CONTENT_STANDARDS.md:660:| ~~CS-02~~ | content-gate 통과 기준 — 의료진 검수자만 vs 법무 자문도 포함 | v1.0 — `compliance/RISK_LEVELS.md` § 4 ApproverRole 통과 기준 4종(medical·legal·operator·client) + § 4.5 multi-role AND 발행 게이트로 확정 |
docs/core/CONTENT_STANDARDS.md:669:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1) § 0 SoT 참조 § 5→§ 4 정정, (2) § 1.3 본문 길이 산정 기준 "1,000자(공백 제외)" + Markdown 정규화 알고리즘 명시 → CS-A 미결정 신설, (3) § 3.1 Q&A 렌더링(HTML `<dl>`)과 JSON-LD FAQPage schema 책임 분리, (4) § 3.1 Q&A 룰 fail/content-gate 분리 적용 (§ 4.1 직접 참조), (5)·(6) § 4.1 보장 표현 통합 fail + 수치/기간 단정(보장어 미포함) content-gate 분리, 유인성 표현(시간·수량 압박)과 할인·이벤트 사실 안내(법무 판정 영역) 분리, (7) § 4.2 "100% 효과" 대체 표현 — 효과 진술을 인용·통계 출처 동반으로만 한정 (치료경험담 위험 제거), (8) § 4.3·§ 5.6 환자 후기 — 의료법 제56조 직접 인용, 사전심의(제57조) 단정 표현 제거, 매체·방식별 법무 판정 명시, (9) § 4.3·§ 5.6 전후사진 — ReviewPolicy.beforeAfterPhotoAllowed 의미를 "법무 승인 후 예외적 허용 플래그"로 명확화, 승인자·일자 필수 기록 (CS-B 신설), (10) § 7.1 ContentType을 DATA_MODEL C-10 ComplianceRecord.contentType과 동일 enum 명시, (11) § 7.2 ComplianceCheckResult 인터페이스 확장 — buildBlocked/gateRequired/publishable/requiredApproverRole 분리, (12) § 7.4 RiskRule 스키마 신설 (id/category/pattern/patternType/severity/scope/requiredApproverRole/suggestion/rationale/exceptions/version) + ContentScope 5종 + CS-01 해소 |
docs/core/CONTENT_STANDARDS.md:670:| 2026-05-14 | **v1.3** | **compliance-assistant v1.0 cascade**: § 7.2 Finding 타입에 `triggeredBy: "static-rule"\|"inferred"\|"explicit"\|"llm-assist"` 메타 + `llmAssistMeta` 필드 신설 — 출처·LLM 모델·신뢰도 추적. ruleId 규약 명시(High 가상=`risk-level-high-gate`, LLM 제안=`llm-suggestion-<hash>-<seq>`) |
docs/core/CONTENT_STANDARDS.md:671:| 2026-05-14 | **v1.2** | **MEDICAL_AD_COMPLIANCE_COMMON v1.0 cascade**: (1) § 7.4 SimpleRiskRule·CompositeRiskRule에 **`legalBasis?: string[]` 필드** 신설 — canonical RiskRule + 복수 법령 조문 인용 (MEDICAL_AD § 3.0 패턴), (2) § 3.5 citation 화이트리스트 cascade — `scholar.google.com`·`*.go.kr`·`*.or.kr` 예시 제거. `MEDICAL_AD_COMPLIANCE_COMMON.md § 8` SoT 참조 |
docs/core/CONTENT_STANDARDS.md:672:| 2026-05-14 | **v1.1** | **RISK_LEVELS v1.0 cascade**: (1) § 7.1 ComplianceCheckInput.metadata에 `inferredRiskLevel` 필드 신설 — `RISK_LEVELS § 2` 자동 추론 결과 입력. `explicitRiskLevel`은 어드민 명시 override 입력만, 자동 추론과 의미 분리, (2) § 7.1.2 가상 finding 트리거 조건 명시 — `inferredRiskLevel===High` ∨ `explicitRiskLevel===High`. `triggeredBy: "inferred"|"explicit"` 메타로 출처 추적, (3) § 7.1.2 ArticleType override 목록을 High ArticleType 전용으로 정리 — Medium ArticleType(`general-medical-info`·`condition-explainer`·`treatment-explainer`)은 가상 finding 미발생. Medium 등급 기본 요구는 RISK_LEVELS § 6 매트릭스로 처리. (4) § 9 CS-02 미결정 해소 — content-gate 통과 기준은 RISK_LEVELS § 4·§ 4.5가 SoT |
docs/core/CONTENT_STANDARDS.md:673:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 잔재 정리 마감 (7개 지적 전건 수용)**: (1) **DATA_MODEL C-10 cascade 누락 정정** — `contentType` enum에 `Feature` 토큰 추가. `featureContentType` 필드도 함께 추가 (`feature:<slug>` 정규식 명시), (2) ApproverRole 중복 정의 제거 — ComplianceCheckResult 코드 블록의 중복 type 삭제. 단일 SoT는 § 7.1.3, (3) SimpleRiskRule `requiredApproverRole` 단수 잔재 → `requiredApproverRoles?: ApproverRole[]` 배열로 통일 (§ 7.2와 정합), (4) § 6 effect-result-related 표 — 기본 승인 역할 `["medical"]` 명시. 후기·사례·금액 결합 시 `legal` 추가 (§ 7.1.2 override와 정합), (5) ContentScope union에 `feature` 변형 추가 — Feature-backed 콘텐츠 전용 RiskRule 적용 가능, (6) § 0 한 페이지 요약 content-gate 정의 — § 8·SCHEMA_MAPPING § 7.3과 동일 통일 정의로 갱신 (schema 출력 승인 게이트 포함), (7) § 9.1 CS-C 해소 설명 정정 — DATA_MODEL C-10 enum `Feature` 토큰 cascade 정확히 기술. **다음 단계**: compliance/RISK_LEVELS.md 후속 + 자체 룰 checker 실제 구현 (CS-A·CS-D 영역) + admin 검수 워크플로 명세 + 그 발견을 본 문서에 되먹이기 |
docs/core/CONTENT_STANDARDS.md:674:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (12개 지적 전건 수용)**: (A) § 7.1 `featureContentType` 별도 필드 도입 — C-10 enum은 `Feature` 토큰 1개만 cascade 추가, 실제 구분은 namespace 필드로. (B) § 7.1.1 Feature 예시를 P-106 self-test로 정정 — P-105 ReservationPage는 Core C-20임을 명시. slug kebab-case 정규식(`^[a-z][a-z0-9-]*[a-z0-9]$`) 확정. (C) § 7.2 `findingsBySeverity` 키를 severity enum과 동일(`"content-gate"`)로 통일. (D) ApproverRole enum에 `client` 포함. (E) `requiredApproverRole` → `requiredApproverRoles: ApproverRole[]` 배열로. `review-case`는 `["medical", "legal"]` 기본값. 어드민 워크플로는 AND 조건으로 발행 게이트. (F) CompositeRiskRule `logic` enum 정밀화 — `AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR` 3종. (G) § 7.4.3 composite severity 4종 모두 허용으로 운영 규칙 정정. (H) ContentScope에 `featureContentType` 검증 흐름 (Feature contentType 입력 시) — 추후 검증기 구현. (9) § 3.5 인용 면제는 § 3.5 content-gate에만 적용 — § 4.1 fail 룰은 절대 완화 안 됨 명시. (10) § 4.3 가격·할인·이벤트 — P-102·P-104·P-010(`articleType=event-price`) cross-reference 명시. (11) **DATA_MODEL cascade — C-04 Article.body 권장 길이 "최소 300단어" → "최소 1,000자(공백 제외). CONTENT_STANDARDS § 1.3 SoT"** 정정. (12) § 8 content-gate 정의를 SCHEMA_MAPPING § 7.3과 통일 — schema 출력 승인 게이트 포함 |
docs/core/CONTENT_STANDARDS.md:675:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
docs/core/CONTENT_STANDARDS.md:676:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (8개 지적 전건 수용)**: (A) § 5.7 P-102 룰 일관화 — 압박형 유인 표현 fail / 단순 할인·이벤트 사실 안내 content-gate, (B) § 4.1 전문성 단정 룰 분리 — 단독 어휘는 content-gate / 효과·결과·보장 결합은 fail. § 7.4.2 severity 우선순위 (fail > content-gate > warning > info) + § 7.4.3 문맥 결합 룰(composite) 신설, (C) § 4.3 전후사진 법무 승인 기록 — ReviewPolicy 별도 필드 대신 ComplianceRecord(C-10) 단일 SoT 책임 이관 (CS-B 해소), (D) § 6 ArticleType 표 — RiskLevel과 룰 severity 별도 축 명시. High = 어드민 검수 큐 강제 진입 트리거, (E) § 6 review-case "사전심의 대상" 단정 제거 — 의료법 제56조 + 매체·방식별 법무 판정 (§ 4.3·§ 5.6 정합), (F) § 7.2 ComplianceCheckResult — `publishable` 제거. 자동 검수는 `automatedDecision`(block/gate/warn/pass)·buildBlocked·gateRequired·hasWarnings·findingsBySeverity까지만 책임. 최종 발행 가능 여부는 어드민 워크플로 + ComplianceRecord(C-10) 결합 판정, (G) § 7.2 warning 검토 큐 표현 — hasWarnings·findingsBySeverity 추가, (H) § 7.1 contentType enum에 SelfTest 등 Feature-backed 콘텐츠 cascade 필요성 명시 (CS-C 신설) |
docs/core/DATA_MODEL.md:3:> **상태**: Draft v0.24
docs/core/DATA_MODEL.md:4:> **작성일**: 2026-05-15 (v0.24 — Spike 결정 SPIKE2-03 cascade: C-23 AdminUser.instanceMemberships에 `active`·`deactivatedAt`·`deactivatedBy` 필드 추가. resolveTenantContext 매 요청 검증 강제)
docs/core/DATA_MODEL.md:6:> **상위 문서**: `docs/ARCHITECTURE.md` § 2.4, § 7
docs/core/DATA_MODEL.md:19:- **25개 계약 (C-01~C-25) + 3개 공통 타입 (CT-01~CT-03)** — v0.10 EC-CASCADE-01 patch (C-24 Publication · C-25 MediaAppearance 신규 — EAT_CONTENT_PLAN v0.x).
docs/core/DATA_MODEL.md:31:### 1.1 데이터 계약 (25개) — EC-CASCADE-01 patch (v0.10·EAT_CONTENT_PLAN v0.x acceptance commit)
docs/core/DATA_MODEL.md:46:| C-12 | `FAQ` | 질문-답변 묶음 (EAT v0.x 풀명세 합류 — § 4 C-12 본문 참조) | L3 | Git | ✅ | P-011 |
docs/core/DATA_MODEL.md:56:| C-22 | `ArticleCategory` | Article Pillar/Category 정의 (EAT v0.x DB 실 운영 합류 — v0.1 어드민 UI minimal · parentCategory/pillar/coverImageUrl/seoMeta/articleTypeDefault 컬럼은 DB nullable + EC-DEFER-10) | L2+L3 | Git+DB | ✅ | P-009, P-010 |
docs/core/DATA_MODEL.md:58:| C-24 | `Publication` | 학술 논문 외부 인용 (E-A-T 전문성 시그널 — schema.org `ScholarlyArticle`) — EAT v0.x 신규 | L3 | DB+Git | ✅ | P-002 About, P-004 Doctor Profile inline |
docs/core/DATA_MODEL.md:209:> v0.5에서 추가했던 `isFeatured: boolean` 필드는 **v0.6에서 제거**. CTAConfig가 여러 컨테이너(ClinicProfile.primaryCtas / LocationProfile.reservationChannels / TreatmentPage.cta)에서 재사용될 가능성을 고려할 때, 객체 자체에 컨텍스트 의존 의미(강조 여부)를 두면 재사용 시 의도 누수 위험. 대신 **컨테이너 쪽에 `featuredChannelId: Slug`로 강조 표시** (LocationProfile § 4 참조). CTAConfig 객체는 컨텍스트 무관 데이터로 유지.
docs/core/DATA_MODEL.md:472:| `body` | `Markdown` | ✅ | 최소 1,000자(공백 제외) 권장 — `CONTENT_STANDARDS.md` § 1.3 SoT |
docs/core/DATA_MODEL.md:544:| `ogType` | `enum {website, article, profile}` | optional | 페이지 타입 자동 (`profile`은 P-004 Doctor Profile 등 인물 페이지 — SEARCH_STANDARDIZATION § 2.2 og:type 매핑 참조) |
docs/core/DATA_MODEL.md:576:| `features` | `{name: string, version: VersionSpec, enabled: boolean, config?: object}[]` | optional | (v0.10 +) 활성화 Feature Modules. `config`는 Feature별 설정 객체 — 각 Feature 명세 SoT가 정의 (예: `features/compliance-assistant.md` § 2.3) |
docs/core/DATA_MODEL.md:577:| `environment` | `enum {production, staging, preview, development}` | ✅ | 배포 환경 — robots.txt 환경별 분기에 사용 (SEARCH_STANDARDIZATION § 3.3.1) |
docs/core/DATA_MODEL.md:578:| `aiCrawlerPolicy` | `enum {allow, disallowTraining, disallowAll, custom}` | ✅ | **required** — AI 크롤러 정책. 미설정 시 빌드 fail (SEARCH_STANDARDIZATION § 3.2) |
docs/core/DATA_MODEL.md:582:| `robotsOverrides` | `RobotsOverride[]` | optional | user-agent별 merge/replace 룰 (SEARCH_STANDARDIZATION § 3.4) |
docs/core/DATA_MODEL.md:584:| `performanceBudget` | `PerformanceBudget` | optional | Lighthouse budget 임계값 override + critical URL 목록 (SEARCH_STANDARDIZATION § 6.1) |
docs/core/DATA_MODEL.md:585:| `searchConsoleVerification` | `{google?: string, naver?: string, bing?: string}` | optional | 검색 콘솔 verification 메타 코드 (SEARCH_STANDARDIZATION § 7.1) |
docs/core/DATA_MODEL.md:586:| `notificationChannels` | `NotificationChannelsConfig` | optional | (v0.9 +, v0.13 확장) 어드민 알림 채널 활성화·설정 — `admin/REVIEW_WORKFLOW.md` § 9, `features/notifications.md` § 2.3. v0.13에서 email transport·secretRef·rate limit 영역 추가 |
docs/core/DATA_MODEL.md:587:| `adminBaseUrl` | `URL` | conditional | (v0.13 +) 본 인스턴스의 어드민(Control Plane) base URL — 알림 ctaUrl 합성 기준. `features.notifications` 활성 시 required (`features/notifications.md` § 3.3 ctaUrl 자동 합성) |
docs/core/DATA_MODEL.md:589:| `holidayCalendar` | `{region: ISO3166Alpha2, source?: "package-embedded" \| "external-api", externalApiRef?: string}` | conditional | (v0.13 +) 인스턴스 공휴일 캘린더 — CT-02 BusinessHours의 `dayOfWeek="PublicHoliday"` 매칭 시 사용. 한국 인스턴스는 `region: "KR"`. `source` 기본 `package-embedded` (본 Feature 패키지에 한국 공휴일 데이터 embed, 국가별 확장 시 추가). `clientApproverBusinessHoursAware=true`인 인스턴스에서 required (`features/notifications.md` § 8.4) |
docs/core/DATA_MODEL.md:590:| `analyticsConfig` | `AnalyticsConfig` | conditional | (v0.14 +) 외부 분석 도구 자격증명·사이트 식별자 SoT. `features.analytics-reporting` 활성 시 required. **경계 분리**: 본 객체는 source 자격증명·사이트 식별자만, 동작 옵션(스케줄·보존·리포트 템플릿·임계 측정·rate limit)은 `features[name="analytics-reporting"].config`에 둠 (`features/analytics-reporting.md` § 2.3) |
docs/core/DATA_MODEL.md:591:| `analyticsPolicyVersion` | `string` | conditional | (v0.14 +) `features.analytics-reporting` 매트릭스·정책 SoT 버전 (예: `"ar-2026-05-14"`). `features.analytics-reporting` 활성 시 required. notifications의 `notificationPolicyVersion` 패턴 동일 — 패키지가 버전별 병렬 보관 + manifest opt-in (`features/analytics-reporting.md` § 1.1·§ 4.2 동등) |
docs/core/DATA_MODEL.md:592:| `searchVisibilityConfig` | `SearchVisibilityConfig` | conditional | (v0.16 +) 검색 가시성 모니터링 자격증명·식별자 SoT. `features.search-visibility` 활성 시 required. **경계 분리**: 자격증명·식별자만, 동작 옵션은 `features[name="search-visibility"].config` (`features/search-visibility.md` § 2.3) |
docs/core/DATA_MODEL.md:594:| `keywordMonitoringConfig` | `KeywordMonitoringConfig` | conditional | (v0.17 +) keyword-monitoring 자격증명·식별자 SoT. `features.keyword-monitoring` 활성 시 required. 동작 옵션은 `features[name="keyword-monitoring"].config` SoT (`features/keyword-monitoring.md` § 2.3) |
docs/core/DATA_MODEL.md:596:| `assetIngestionConfig` | `AssetIngestionConfig` | conditional | (v0.18 +) asset-ingestion 자격증명·식별자 SoT. `features.asset-ingestion` 활성 시 required. 동작 옵션은 `features[name="asset-ingestion"].config` (`features/asset-ingestion.md` § 2.3) |
docs/core/DATA_MODEL.md:598:| `crmSyncConfig` | `CrmSyncConfig` | conditional | (v0.19 +) CRM·환자관리 시스템 연동 자격증명·DPA·동의 증빙 SoT. `features.crm-sync` 활성 시 required. 동작 옵션은 `features[name="crm-sync"].config` (`features/crm-sync.md` § 2.3) |
docs/core/DATA_MODEL.md:600:| `contentMigrationConfig` | `ContentMigrationConfig` | conditional | (v0.21 +) 솔루션 내부 콘텐츠 마이그레이션 plan 정의·legal 승인·read-only window 정책 SoT. `features.content-migration` 활성 시 required. 동작 옵션은 `features[name="content-migration"].config` (`features/content-migration.md` § 2.3) |
docs/core/DATA_MODEL.md:602:| `complianceAssistantExemptApproval` | `{approvedBy: string, approvedAt: Date, exemptionAgreementUrl: URL, reason: string}` | optional | (v0.12 +) compliance-assistant 비활성 예외 승인 기록 — `features/compliance-assistant.md` § 10.3. 본 필드 부재 시 의료기관 인스턴스의 본 Feature 비활성은 빌드 fail |
docs/core/DATA_MODEL.md:634:| `inApp` | `{enabled: boolean}` | optional | 어드민 DB 내 NotificationInbox 사용 (`features/notifications.md` § 5.3·§ 14) |
docs/core/DATA_MODEL.md:636:> 본 타입은 `features/notifications.md` config(`features[name="notifications"].config`)와 경계 분리: **채널 활성화·트랜스포트 자격은 본 객체**, **digest 스케줄·dedupe 윈도우·retry 정책 등 동작 옵션은 `features.notifications.config`** (notifications.md § 2.3).
docs/core/DATA_MODEL.md:652:| `sources.rum` | `{enabled: boolean, endpoint: string}` | optional | 자체 RUM (SEARCH_STANDARDIZATION § 6.3 PerformanceEvent·PageViewEvent·ConversionEvent 수신) |
docs/core/DATA_MODEL.md:654:> 동작 옵션(`collectionSchedule`·`retentionDays`·`reportTemplates`·`mediaThresholdMeasurement`·`rateLimit`)은 `features[name="analytics-reporting"].config` SoT (`features/analytics-reporting.md` § 2.3).
docs/core/DATA_MODEL.md:660:| `serpCrawler` | `{enabled: boolean, targetSearchEngines: ("naver"\|"google")[], siteDomain: string, userAgent: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedScope?: SerpCrawlerApprovedScope}` | optional | 자체 SERP 크롤러. `enabled=true` + (`legalApproved !== true` 또는 `legalApprovedBy`·`legalApprovedAt` 누락) → 빌드 fail (SV2-01 정정 — 자동 크롤링 ToS 위험 회피 — `features/search-visibility.md` § 5.2) |
docs/core/DATA_MODEL.md:669:| `serpCrawler` | `{enabled: boolean, ...}` | optional | **v1.0: `enabled=true` → 빌드 fail (regardless of legalApproved)** — `features/keyword-monitoring.md` § 5.2 v1.0 미지원 정책 (KM2-01). v1.x 활성화 시 search-visibility SerpCrawlerApprovedScope 게이트 패턴 재사용 (KM-14 후속 결정 후). v1.0 manifest validator는 enabled=true 단독으로 fail 처리, legalApproved/승인자/시각 검증은 v1.x 활성 시점부터 적용 |
docs/core/DATA_MODEL.md:671:> 동작 옵션(`monitoringSchedule`·`signals`·`anomalyHysteresis`·`keywordTargetSource`·`retentionDays` 등)은 `features[name="keyword-monitoring"].config` SoT (`features/keyword-monitoring.md` § 2.3).
docs/core/DATA_MODEL.md:696:> 동작 옵션(`mode`·`ingestionSchedule`·`tagging`·`review`·`pii`·`promote`·`retentionDays`·`blobStorage` 등)은 `features[name="asset-ingestion"].config` SoT (`features/asset-ingestion.md` § 2.3).
docs/core/DATA_MODEL.md:718:| `genericRestApiAdapter` | `GenericRestApiAdapterConfig` | conditional | (v0.20 +) `provider="generic-rest-api"` 시 ✅. **5필드** (CS3-13·CS5-01): `webhookSignatureHeader`·`webhookTimestampHeader`·`webhookEventIdHeader`·`canonicalStringFormat`·`versionTokenJsonPath`. 누락 시 build fail (`features/crm-sync.md` § 10.1). `versionTokenType: 'epoch-ms'\|'integer'\|'string'` enum도 conditional (CS5-01) |
docs/core/DATA_MODEL.md:720:> 동작 옵션(`mode`·`syncSchedule`·`entities`·`fieldMappingPolicyVersion`·`retryQueue`·`credentialRotation`·`pii`·`retentionDays` 등)은 `features[name="crm-sync"].config` SoT (`features/crm-sync.md` § 2.3). **CrmCredentialVersion**(credential rotation 상태 머신·secretVersionId) 등 admin DB entity는 `features/crm-sync.md` § 13 SoT. manifest는 `apiKeySecretRef` 등 secretRef만 보유 — register/rotate 시 admin DB materialization (CS3-13).
docs/core/DATA_MODEL.md:724:솔루션 내부 콘텐츠 마이그레이션 plan 정의·legal 승인·read-only window 정책. 동작 옵션(`execution`·`retry`·`rollback`·`dryRun`·`retentionDays`·`purgeWorker`) 등은 `features[name="content-migration"].config` SoT (`features/content-migration.md` § 2.3).
docs/core/DATA_MODEL.md:736:> ContentMigrationPlan·ContentMigrationRun·ContentMigrationStepResult 등 admin DB entity는 `features/content-migration.md` § 9 SoT.
docs/core/DATA_MODEL.md:771:| `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature, Publication, MediaAppearance}` (v0.6+, 17종) | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1). **(v0.6 + EC-CASCADE-01 patch)** `Publication`, `MediaAppearance` 추가 — EAT_CONTENT_PLAN v0.x 의 학술 인용 · 미디어 출연 E-A-T entity. ComplianceRecord 발행 게이트 통과 기록 대상 (Publication/MediaAppearance 는 외부 인용 → CONTENT_STANDARDS § 7.1.1.x 면제 + risk_level Low fixed) |
docs/core/DATA_MODEL.md:777:| `autoCheckResult` | `AutoCheckResult` | ✅ | compliance-assistant 결과 (`features/compliance-assistant.md` § 5.5 SoT) — `ComplianceCheckResult` 본체 + 선택 영역 `llmAssist: { invocations[]: { promptVersion, modelId, requestId, requestedAt, response: LlmAssistResult, costTokens } }` 누적 저장. v0.11 +(CA-08 해소) |
docs/core/DATA_MODEL.md:790:| `staleFlags` | `StaleFlags` | optional | (v0.7 +) 역할별 재검수 필요 상태 — `RISK_LEVELS.md` § 4 만료 정책에 따라 갱신. **published 이후에도 갱신 허용** (record 불변성의 예외 영역 — `admin/REVIEW_WORKFLOW.md` § 5.4) |
docs/core/DATA_MODEL.md:791:| `warningAcknowledgements` | `WarningAcknowledgement[]` | optional | (v0.8 +) warning finding 처리 기록 — `admin/REVIEW_WORKFLOW.md` § 3.1.1 |
docs/core/DATA_MODEL.md:794:| `recordPhase` | `enum {pre-publish, published}` | ✅ | (v0.8 +) 발행 생명주기 단계 (`admin/REVIEW_WORKFLOW.md` § 5.2). `pre-publish`는 검수 중 누적 record, `published`는 발행 완료 후 불변 record |
docs/core/DATA_MODEL.md:795:| `recordVersion` | `integer` (1~) | ✅ | (v0.8 +) 동일 contentRef의 record 버전 — 재검수 사이클 후 새 record 생성 시 1 증가. 발행 history 추적 (`admin/REVIEW_WORKFLOW.md` § 5.4) |
docs/core/DATA_MODEL.md:804:| `windowStart` | `Date` | ✅ | 측정 윈도우 시작 (시행령 제24조 직전 3개월 또는 운영 측정 기간) |
docs/core/DATA_MODEL.md:806:| `rollingAverageDailyUsers` | `number` | ✅ | 윈도우 내 일평균 unique users (analytics-reporting § 8.2 측정값) |
docs/core/DATA_MODEL.md:807:| `thresholdReached` | `boolean` | ✅ | rollingAverage ≥ 10만 (시행령 제24조 기준) |
docs/core/DATA_MODEL.md:815:> `mediaThresholdAssessment`는 운영 측정값(`features/analytics-reporting.md` § 14.5 DailyUserMeasurement)과 별개로 ComplianceRecord에 **확정 판정**을 기록. 운영 측정은 매일 갱신되지만 본 슬롯은 발행 시점·법무 판정 시점에 snapshot으로 고정.
docs/core/DATA_MODEL.md:877:- 발행 시 `ComplianceRecord(contentType=LegalDocument, legalCounsel=*, legalCounselAt=*)` 필수 — 위험도 Low 예외 게이트 (§ 4 C-10 참조).
docs/core/DATA_MODEL.md:913:> **단지점 자동 생성 규칙** (PAGE_TYPES.md § 3 P-014 참조): 어드민이 ClinicProfile 입력 단계의 위치·연락·시간 입력값으로부터 `LocationProfile(slug=main)`을 자동 생성. M0에 별도 화면 추가 없음.
docs/core/DATA_MODEL.md:928:| `articleTypeDefault` | `string` | optional | 기본 ArticleType (작성 시 자동 추천 — EAT v0.x EC-DEFER-10) |
docs/core/DATA_MODEL.md:930:> **EAT_CONTENT_PLAN v0.x EC-SCHEMA-01 (DB 실 운영 합류)**: 본 풀명세 전체 컬럼이 `article_category` DB (C0009 migration) 에 모두 존재. v0.1 어드민 UI 와 공개 렌더는 `slug`/`name`/`description`/`displayOrder` 만 노출. 나머지 (`pillar`/`parent_category_id`/`cover_image_url`/`seo_meta`/`article_type_default`) 는 nullable + EC-DEFER-10 (M1 합류). C-04 Article `category` 필드는 required Ref<C-22> — DB `article.category_id` NOT NULL + composite FK (C0013 staged 4-step migration).
docs/core/DATA_MODEL.md:932:### C-24. `Publication` — 학술 논문 외부 인용 (E-A-T 전문성 시그널 · EAT v0.x 신규)
docs/core/DATA_MODEL.md:934:> **EAT_CONTENT_PLAN v0.x 신규 (C-24)** — 외부 학술 자료 인용 (clinic 자체 publisher 아님). schema.org `ScholarlyArticle` 매핑. Doctor Profile (P-004) · About (P-002) page 안 fragment-scoped inline 출력 v0.1 (별도 페이지 EC-DEFER-02).
docs/core/DATA_MODEL.md:950:| `status` | `content_publication_status` | ✅ | v0.1 어드민 UI `draft` 만 (EC-DEFER-12) |
docs/core/DATA_MODEL.md:957:- CONTENT_STANDARDS § 7.1.1.x: **answer-first AST · 표현 검사 · RiskRule · RiskInference 모두 면제** (외부 인용)
docs/core/DATA_MODEL.md:958:- RISK_LEVELS § 2: Low fixed
docs/core/DATA_MODEL.md:963:> **EAT_CONTENT_PLAN v0.x 신규 (C-25)** — clinic doctor 의 미디어 출연 (방송·유튜브·팟캐스트·언론). schema.org `VideoObject` 매핑 v0.1 — 모든 channel_type 단일화. BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1).
docs/core/DATA_MODEL.md:978:| `status` | `content_publication_status` | ✅ | v0.1 어드민 UI `draft` 만 (EC-DEFER-12) |
docs/core/DATA_MODEL.md:985:- CONTENT_STANDARDS § 7.1.1.x: **면제** (외부 인용)
docs/core/DATA_MODEL.md:986:- RISK_LEVELS § 2: Low fixed
docs/core/DATA_MODEL.md:987:- Schema: `VideoObject` (모든 channel_type 단일화 v0.1) · `@id` = `${pageBaseUrl}#video-{slug}` (fragment-scoped — Doctor/About page 안). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11.
docs/core/DATA_MODEL.md:996:### C-12. `FAQ` — EAT v0.x **풀명세 합류 + M0 합류** (§ 4 본문 참조 — 본 § 5 entry 는 historical link)
docs/core/DATA_MODEL.md:998:EAT_CONTENT_PLAN v0.x acceptance commit 안 § 4 풀명세로 격상. 본 § 5 row 는 cycle 5 cascade 후 정리.
docs/core/DATA_MODEL.md:1000:**풀명세 요약** (§ 4 안 풀명세 SoT 참조):
docs/core/DATA_MODEL.md:1008:| `relatedTreatmentId` | `Ref<C-03>` | optional | EC-DEFER-09 |
docs/core/DATA_MODEL.md:1011:| `status` | `content_publication_status` | ✅ | **v0.1 단계 DB CHECK `status='draft' AND published_at IS NULL` — EC-DEFER-05·12 (compliance-assistant + risk_level 자동 추론 합류 까지 published 차단)** |
docs/core/DATA_MODEL.md:1012:| `riskLevel` | `Ref<C-05>` | ✅ | v0.1 default Low. RiskInference (자동 추론) 합류 시 Medium/High 자동 — RISK_LEVELS § 2 |
docs/core/DATA_MODEL.md:1014:**Schema**: `FAQPage.mainEntity[].Question.acceptedAnswer.Answer`. P-011 graph self-contained (cross-page ref 미사용).
docs/core/DATA_MODEL.md:1015:**검수 · 위험도**: CONTENT_STANDARDS § 7.1.1.x — Q/A 모두 answer-first AST · 표현 검사 · RiskRule · RiskInference 적용 (compliance-assistant 합류).
docs/core/DATA_MODEL.md:1040:**마스터**: 어드민 DB 원본 (Git 사본 없음 — Control Plane 전용). `features/notifications.md` 수신자 산정·`admin/REVIEW_WORKFLOW.md` § 11 권한 평가의 SoT.
docs/core/DATA_MODEL.md:1047:| `role` | `AdminUserRole` (단 `system` 제외) | ✅ | `admin/REVIEW_WORKFLOW.md` § 11.1 enum 6종 중 실제 사용자 역할 5종(`super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver`). **`system`은 audit log actorRole 표기 전용** — AdminUser DB row 미생성, 로그인 불가. C-23.`role` 및 `instanceMemberships[].role`에는 저장 금지 |
docs/core/DATA_MODEL.md:1048:| `approverRoleEligibility` | `ApproverRole[]` | optional | 사용자가 승인할 수 있는 검수 역할(`operator`·`medical`·`legal`·`client`) — § 11.2 자격 검증 통과 결과 누적 |
docs/core/DATA_MODEL.md:1051:| `timezone` | `IANATimezone` | optional | 사용자 timezone — **quietHours 기준에만 사용** (digest 발송 시각은 InstanceManifest.timezone 고정 — `features/notifications.md` § 8.1). 미지정 시 InstanceManifest.timezone fallback |
docs/core/DATA_MODEL.md:1052:| `notificationPreferences` | `NotificationPreferences` | optional | 사용자별 채널·digest·quietHours 설정 (§ C-23 하위 타입) |
docs/core/DATA_MODEL.md:1053:| `instanceMemberships` | `Array<{instanceId: Slug, role: AdminUserRole, joinedAt: Date, active: boolean, deactivatedAt?: Date, deactivatedBy?: string}>` | ✅ | (v0.24 — SPIKE2-03) 사용자가 접근 가능한 인스턴스 목록. **`active=true`만 권한 부여**·`active=false` 시 다음 request 즉시 403 (session refresh 없이). `resolveTenantContext`가 매 요청 검증 |
docs/core/DATA_MODEL.md:1062:| `channels` | `{email: boolean, slack: boolean, inApp: boolean}` | ✅ | 사용자별 채널 활성화. `mandatory` criticality 이벤트는 본 설정 중 **opt-out만 우회**하고 인스턴스 채널 비활성은 우회하지 않음(`features/notifications.md` § 4.1 필터 순서) |
docs/core/DATA_MODEL.md:1065:| `suppression` | `{email?: EmailSuppressionState, slack?: ChannelSuppressionState}` | optional | provider 장애·hard bounce 자동 처리 상태 (§ C-23 하위 타입). `active=false` 로그인 차단과 분리 — suppression은 채널별 발송만 차단 |
docs/core/DATA_MODEL.md:1075:| `observedCount` | `integer` | ✅ | 누적 발생 횟수 — DB atomic increment. softSuppressionThreshold 도달 판정은 compare-and-set으로 1회만 발생 (`features/notifications.md` § 7.1) |
docs/core/DATA_MODEL.md:1076:| `autoReleaseAt` | `Date` | optional | (soft-suppressed 한정) 자동 active 복귀 예정 시각 — `lastObservedAt + softSuppressionAutoReleaseDays`. worker(`features/notifications.md` § 7.4)가 도달 시 state=active + observedCount=0 복귀 |
docs/core/DATA_MODEL.md:1122:   ├─ contentRef → 발행 콘텐츠 (C-01~C-25 · EAT v0.x C-24 Publication · C-25 MediaAppearance 포함)
docs/core/DATA_MODEL.md:1130:(§ 2.6 표 참조 — MAJOR/MINOR/PATCH)
docs/core/DATA_MODEL.md:1168:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
docs/core/DATA_MODEL.md:1170:| 2026-05-14 | v0.7 | **피드백 정정**: **C-16 LegalDocument를 § 4 M0 핵심으로 이동 + 풀명세** — `documentType` enum, `body` 변수 치환 규약, `autoGenerated`·`templateVersion`, `revisions[]` 하위 타입, 발행 시 법무 검토 룰 명시. § 5 (M0 외 간략 명세)에는 자리 표시만 유지 |
docs/core/DATA_MODEL.md:1171:| 2026-05-14 | v0.8 | **피드백 정정**: § 4 내 C-16 위치를 C-22 뒤 → C-10 다음(C-21 앞)으로 이동, 번호 순 가독성 확보. § 5 자리표시도 한 줄 링크로 간소화 |
docs/core/DATA_MODEL.md:1172:| 2026-05-14 | v0.9 | **피드백 정정**: (1) § 5 (M0 외 간략 명세)에서 C-16 자리표시 행 삭제 — 섹션 제목과 모순되는 잔존 제거. C-16은 § 4 M0 핵심에만 위치, (2) 헤더 작성일 설명 정정 — "번호순 정렬" → "M0 핵심 섹션 안에서 C-10 직후로 위치 이동" (C-11~C-15가 § 5에 있어 엄밀한 번호순은 아님) |
docs/core/DATA_MODEL.md:1173:| 2026-05-14 | v0.10 | **SEARCH_STANDARDIZATION v0.2 cascade**: C-06 PageMeta `ogType` enum 확장 — `{website, article}` → **`{website, article, profile}`**. P-004 Doctor Profile 등 인물 페이지가 `profile` og:type을 사용 (SEARCH_STANDARDIZATION § 2.2 매핑 참조) |
docs/core/DATA_MODEL.md:1175:| 2026-05-14 | v0.12 | **SEARCH_STANDARDIZATION v0.6 cascade**: (1) **`aiCrawlerApprovedBy/At`을 `aiCrawlerPolicy: allow` 시 required로 격상** — 감사 추적 게이트 강화, (2) **`PerformanceBudget` 확장** — `imageWeightKbOverride`·`lighthouseSeoMinOverride`·`lighthouseAccessibilityMinOverride` 추가 (SEARCH_STANDARDIZATION § 6.1 budget 항목 정합) |
docs/core/DATA_MODEL.md:1181:| 2026-05-15 | v0.24 | **Spike 결정 cascade (SPIKE2-03)**: C-23 AdminUser.instanceMemberships에 `active`·`deactivatedAt`·`deactivatedBy` 필드 추가. `active=false` 시 다음 request 즉시 403·resolveTenantContext 매 요청 검증 강제 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:3:> **상태**: **v1.0 (acceptance)** — Codex 자동 비평 cycle 5 회 closeableAfterPatch=true 확정. 누계 31 findings 전건 수용 · 수렴 추세 **21 → 7 → 2 → 1 → 0**. 5 PSR-CASCADE 모두 PASS (01a docs · 02 SCHEMA_MAPPING § 1.2 · 03 M0_BUILD_EXPORT_PLAN § 2.1 · 04 manifest D0011 · 05 pgbouncer userlist). 01b (apps/web 디렉토리 이동 + redirect/revalidate 변경) 는 별 **PUBLIC_SITE_RENDER code v1.0** cycle 분리 (LOCATION_LEGAL plan/code 분리 패턴 정합). ADMIN_UI_SKELETON code v1.0 + LOCATION_LEGAL code v1.0 acceptance 직후 진입하는 첫 공개 사이트 plan.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:5:> **acceptance commit 구성 (LL-33 패턴 정합)**: 본 commit 에 다음 cascade 동시 포함 — (1) PUBLIC_SITE_RENDER_PLAN.md v1.0 (본 문서) (2) PSR-CASCADE-01a docs/admin/ARCHITECTURE.md § 3.12 patch (3) PSR-CASCADE-02 docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based 표 + entity continuity 전환 룰 (4) PSR-CASCADE-03 docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 SSR 재사용 표 (5) PSR-CASCADE-04 packages/migrations-runner/src/manifest.ts D0011 entry (6) PSR-CASCADE-05 apps/spike-a/pgbouncer/userlist.txt 안 `app_public_reader` 추가. PSR-CASCADE-01b 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 의 acceptance commit 에서 별도 진행.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:16:- `docs/core/SCHEMA_MAPPING.md` — 페이지별 graph 구성 (§ 2.5 공통 entity 출력 정책 + § 3 페이지 그래프 + § 1.2 `@id` 네이밍 규약).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:17:- `docs/core/SEARCH_STANDARDIZATION.md` — § 2 메타 태그 표준 (theme-color · og:type 매핑) · § 3 robots.txt (aiCrawlerPolicy + 4계열 user-agent + disallowTraining starter) · § 4.3 sitemap changefreq/priority · § 5 canonical resolve.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:18:- `docs/core/CONTENT_STANDARDS.md` v1.3 — answer-first AST · § 7.1.1.1 LegalDocument 면제.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:20:- `docs/core/DESIGN_TOKENS.md` v1.0 — 3-tier 토큰 (primitive·semantic·component) · § 3.2 light/dark semantic 22 · § 3.3 `data-theme="light"|"dark"` 분기 · semantic naming SoT (`color.surface.background` 등).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:21:- `docs/admin/ARCHITECTURE.md` v0.7 § 3.11 완료 게이트 #1 — "사이트 측 페이지 타입 9종 + Article 1샘플 빌드 (총 10 페이지)".
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:47:| **P-009 Articles List · P-011 FAQ · P-007/008 Conditions** | M0 미합류 — 별 plan (FAQ 는 EAT_CONTENT plan v0.1) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:51:| JSON-LD 통합 graph + 자체 rule checker (cycle1 PSR-07·17 정정) | SCHEMA_MAPPING § 2.5 + § 3 정합. 페이지당 단일 `<script>`. 자체 JSON parse + 필수 entity 검증 (Google validator 는 manual QA marker) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:53:| sitemap.xml · robots.txt (cycle1 PSR-04·09 정정) | per-instance · SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` required + § 4.3 changefreq/priority SoT 정합 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:64:| static export to Git (build-time) | M0 v1.0 본 구현 — apps/worker + Git client | PSR-DEFER-01 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:65:| 도메인 매핑 (subdomain `<slug>.glitzy.co` 또는 custom domain) | M0 v1.0 본 구현 | PSR-DEFER-02 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:66:| dark mode UI toggle | M1 Phase Alpha — CSS vars 는 v0.1 부터 두 테마 출력 (DESIGN_TOKENS § 3.3) · PSR-14 정합 | PSR-DEFER-03 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:67:| CDN cache 정책 (Cloudflare/Vercel ISR fine-tune) | M0 v1.0 본 구현 | PSR-DEFER-04 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:68:| 검색 콘솔 sitemap submission 자동화 | M1 Phase Alpha | PSR-DEFER-05 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:69:| 다국어 (`/<lang>/<instanceSlug>/...`) | M3 다국어 cascade | PSR-DEFER-06 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:70:| 사용자 댓글·리뷰·공유 (인터랙티브 기능) | 별 plan (Inquiry · Review) | PSR-DEFER-07 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:71:| draft preview token (어드민 세션 외 비공개 미리보기) | M1 Phase Alpha | PSR-DEFER-08 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:72:| 페이지별 OG 이미지 동적 자동 생성 | M1 Phase Alpha | PSR-DEFER-09 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:73:| AI 크롤러 인증 (Cloudflare AI Audit · access log per-crawler) | M0 v1.0 본 구현 (provider gate) | PSR-DEFER-10 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:74:| P-009 Articles List · P-011 FAQ · P-007/008 Conditions | 별 plan (EAT_CONTENT plan v0.1 안 FAQ · 별도 plan Conditions) | PSR-DEFER-11 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:75:| 선택 7종 (P-101~P-107) | 별 plan · Add-on Feature | PSR-DEFER-12 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:76:| LegalDocument 공개 노출 (status=published) | LL-DEFER-01 (compliance-assistant + ComplianceRecord legalCounsel 합류) | PSR-DEFER-13 (LL-DEFER-01 alias) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:77:| Google Rich Results Test / schema.org validator 자동 게이트 | manual QA marker · LOCAL_PASS 는 자체 rule checker (cycle1 PSR-17) | PSR-DEFER-14 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:78:| Article URL `/insights/[category]/[slug]` 의 category 운영 추가 (현재 C-04 article.category 없음) | EAT_CONTENT plan v0.1 또는 Article schema cascade · v0.1 은 단일 fallback category `"general"` | PSR-DEFER-15 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:128:- (PSR-ROUTE-04) path-based routing 결정 — v0.1 단계 `/<instanceSlug>/<page>`. 도메인 매핑 합류 시 (PSR-DEFER-02) middleware 가 host header → instanceSlug rewrite.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:209:- (PSR-DATA-02 · cycle1 PSR-05) `app_public_reader` LOGIN — v0.1 단순화. production 단 NOLOGIN + MEMBERSHIP 분리 marker (PSR-DEFER-16 신설).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:215:- (PSR-DATA-04) `app_public_reader` 는 audit_event INSERT 권한 없음 — 공개 페이지 access log 는 별도 (CDN / Vercel analytics · PSR-DEFER-10).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:225:DB-level RLS policy 가 row-level filter 를 강제 (§ 3.1). application 단 SELECT 는 추가 WHERE 없음 — RLS 가 자동 처리.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:240:- 어드민 세션 보유 시 (별 별 helper, app_tenant_user) `?preview=true` query 로 draft 미리보기 가능 — v0.1 SCOPE 외, PSR-DEFER-08 합류.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:241:- LegalDocument 공개 노출은 **LL-DEFER-01 (compliance-assistant + ComplianceRecord legalCounsel 합류) 시점** 까지 차단. PSR-DEFER-13 = LL-DEFER-01 alias.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:257:- **cycle2 PSR-28 patch (acceptance precondition · plan acceptance commit 동반)**: 현 root layout 의 `<body className="bg-slate-50 text-slate-900">` 임시 토큰 → DESIGN_TOKENS v1.0 semantic alias (`bg-canvas` · `text-fg-default`) 로 전환. § 8 작업 #14 Tailwind v0.2 patch + globals.css 안 CSS vars 적용 + root layout className 변경 모두 acceptance 직전 동시 적용.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:277:- (PSR-COMP-03 · cycle2 PSR-26 정정) Header: ClinicProfile.name + 네비 (Home · About · Doctors · Treatments · Contact · Locations · CTA primaryCtas[0]). Footer: 주소·전화·진료시간. **법적 페이지 5종 링크는 v0.1 단계 숨김** — LegalDocument 공개 노출이 PSR-DEFER-13 (= LL-DEFER-01 alias) 합류 시점까지 404 이므로 broken link 회피. 합류 후 Footer 에 동적 추가 (LegalDocument 가 published 상태 row 가 존재할 때만 렌더).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:340:  - v0.1 결정: `sanitize-html` (단순함). 향후 EAT_CONTENT plan 안 FAQ 도 같은 컴포넌트 재사용 시 `rehype-sanitize` 로 전환 marker (PSR-DEFER-17).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:344:- LegalDocument 본문 (CONTENT_STANDARDS § 7.1.1.1 면제) 도 동일 컴포넌트 사용 — answer-first AST · 표현 검사 미적용은 어드민 저장 단계의 결정이지 렌더 단계와 무관.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:348:`apps/web/tailwind.config.ts` v0.2 patch — DESIGN_TOKENS v1.0 § 3.2 semantic 22 정합 alias 표:
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:393:  - root layout 안 `<html data-theme="light">` 고정 v0.1. UI toggle 만 defer (PSR-DEFER-03).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:394:  - DESIGN_TOKENS § 3.4 의 30 쌍 접근성 대비 검증은 build-time test cascade (별 plan).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:400:각 페이지 안 `export async function generateMetadata({ params })` 정의. 출력 SoT (SEARCH_STANDARDIZATION § 2 정합):
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:421:    { media: "(prefers-color-scheme: light)", color: "<BrandTokens.colors.light.primary>" },  // 평면화 결과 (DESIGN_TOKENS § 6 BrandTokens · `color.brand.primary` light)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:428:- (PSR-SEO-02 · cycle1 PSR-10 + cycle2 PSR-23 정정) `themeColor` 2값 출처 — DESIGN_TOKENS § 6 `BrandTokens.colors.light.primary` / `BrandTokens.colors.dark.primary` (= `color.brand.primary` 의 light/dark 평면화 결과). 인스턴스별 brandTokens 미주입 단계 (v0.1) 는 DESIGN_TOKENS § 3.2 default `color.brand.primary` light = `blue.600` (#2563eb) / dark = `blue.400` (#60a5fa) fallback. SEARCH_STANDARDIZATION § 2.1 정합.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:437:- 응답: SEARCH_STANDARDIZATION § 4.2 형식 + § 4.3 changefreq/priority + § 4.4 lastmod SoT 정합.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:438:- **changefreq · priority (SEARCH_STANDARDIZATION § 4.3 그대로)**:
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:453:- **lastmod (SEARCH_STANDARDIZATION § 4.4 그대로)**:
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:456:  - ClinicProfile/Location: `updated_at` (DATA_MODEL § 2.2 `@updatedAt`).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:463:- SEARCH_STANDARDIZATION § 3 SoT 정합:
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:464:  - § 3.1: AI 크롤러 분류 4계열 — **A. 일반 검색 색인** (Googlebot · Yeti · Bingbot) · **B. AI 검색 인덱싱·답변용** (OAI-SearchBot · PerplexityBot · Claude-SearchBot) · **C. User-triggered fetch** (ChatGPT-User · Perplexity-User · Claude-User) · **D. AI 학습·모델 개선용** (GPTBot · ClaudeBot · Google-Extended · CCBot · anthropic-ai · meta-externalagent).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:465:  - § 3.2: `aiCrawlerPolicy` enum **required** — `allow | disallowTraining | disallowAll | custom` (4종). 미설정 시 빌드 fail.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:466:  - § 3.3: 정책별 출력 예시 + `allow` 시 `aiCrawlerLegalApproved: true` 필수 (fail-gate).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:468:**결정 (v0.1 starter template)** — cycle2 PSR-22 정정 (SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로):
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:469:- (PSR-SEO-09 · cycle1 PSR-04 + cycle2 PSR-22) v0.1 단계 ClinicProfile.metadata.aiCrawlerPolicy 컬럼 부재 — InstanceManifest 합류 (M0 v1.0 cascade · PSR-DEFER-10) 전까지는 fixed `disallowTraining` starter (enum 값 = `disallowTraining` · SoT 4종 `allow / disallowTraining / disallowAll / custom`):
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:472:# robots.txt — 자동 생성 by Glitzy Core (SEARCH_STANDARDIZATION § 3)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:532:> v0.1 단계 `{domain}` = `<host>/<instanceSlug>` path-based. M0 v1.0 도메인 매핑 합류 시 (PSR-DEFER-02) `<customDomain>` 으로 평면화. SEARCH_STANDARDIZATION § 3.3 footnote 의 `experimentalAiBots` flag 도 동일 cascade.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:534:- (PSR-SEO-10) M0 v1.0 InstanceManifest.aiCrawlerPolicy 합류 시 (PSR-DEFER-10) row-driven 출력:
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:537:  - `custom`: § 3.4 merge/replace 룰
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:538:  - SEARCH_STANDARDIZATION § 3.3.1 룰 적용 (`/admin/`·`/auth/`·`/api/` 공통 차단 · `noIndex: true` 페이지는 robots 차단 X · `environment` 별 결정)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:543:- 구조: `{ "@context": "https://schema.org", "@graph": [...] }` (SCHEMA_MAPPING § 1.1 정합).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:544:- **페이지별 graph 구성 (SCHEMA_MAPPING § 2.5 + § 3 SoT 그대로 — `[풀]` vs `[참조]`)**:
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:557:| P-014 Location Detail | `[풀] Organization` · `[풀] MedicalClinic`(`#clinic` 단지점 main 의 entity @id 그대로 — SCHEMA_MAPPING § 1.4 정합) · `[풀] WebPage` · `[풀] BreadcrumbList` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:560:- (PSR-SEO-12 · cycle1 PSR-08) v0.1 `@id` path-based 패턴 — `https://<host>/<instanceSlug>/#organization` · `/<instanceSlug>/#clinic` · `/<instanceSlug>/doctors/<slug>#physician` 등. SCHEMA_MAPPING § 1.2 SoT 의 `https://{domain}/#organization` 패턴은 도메인 매핑 후 (M0 v1.0) 적용. v0.1 path-based 변형의 entity continuity 가 중요 — M0 도메인 전환 시 redirect / 301 cascade 가 entity @id 까지 cascade 되도록 SCHEMA_MAPPING § 1.2 patch (PSR-CASCADE-02).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:561:- (PSR-SEO-13) `inLanguage` 명시 정책: SCHEMA_MAPPING § 1.5 정합 — CreativeWork 계열 (Article · WebPage · FAQPage 등) 만 명시. Organization · MedicalClinic · Physician 등은 미명시.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:562:- (PSR-SEO-14 · cycle1 PSR-17) **자체 JSON-LD rule checker** (LOCAL_PASS 게이트): JSON parse + 필수 entity 존재 + `@id` 유일 + cross-reference 무결성 검증. Google Rich Results Test / schema.org validator 는 manual QA marker (PSR-DEFER-14) — CI 게이트 X.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:570:- v0.1 단계 동적 OG 이미지 생성 미지원 (PSR-DEFER-09).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:571:- `og:type` 매핑 — § 5.1 PSR-SEO-03 SoT.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:584:| 6 | role membership / NOLOGIN 분리 production marker | PSR-DEFER-16 (M0 v1.0 본 구현 합류) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:590:| 12 | apps/web seed scenario 도 admin URL 변경 정합 (`apps/web/src/seed.ts`) | acceptance precondition |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:592:## 7. § 8.1 시나리오 (LOCAL_PASS 검증) — cycle1 PSR-17·18 정정
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:605:| 10 | 모든 페이지 `<script type="application/ld+json">` 단일 출력 | `@graph` 안 P-001~P-014 별 entity 풀/참조 정합 (§ 5.4 PSR-SEO-11 표) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:606:| 11 | `/<instanceSlug>/sitemap.xml` 응답 | XML sitemap (P-013 제외 9페이지 + 동적 slug) + SEARCH_STANDARDIZATION § 4.3 changefreq/priority 정확 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:607:| 12 | `/<instanceSlug>/robots.txt` 응답 | SEARCH_STANDARDIZATION § 3 v0.1 starter `disallowTraining` 정합 (학습 봇 Disallow + 답변 봇 Allow + Naver Yeti Allow) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:613:| 18 | **자체 JSON-LD rule checker** 통과 (cycle1 PSR-17 정정) | JSON parse + 필수 entity 존재 + `@id` 유일 + cross-reference 무결성 — Google 외부 validator 는 manual QA marker (PSR-DEFER-14) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:639:| 16 | docs/admin/ARCHITECTURE.md § 3 patch — `(site)` 신설 + `/admin` prefix (PSR-CASCADE-01) | doc |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:640:| 17 | docs/core/SCHEMA_MAPPING.md § 1.2 patch — v0.1 path-based `@id` marker + entity continuity note (PSR-CASCADE-02) | doc |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:641:| 18 | docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2 patch — apps/worker 가 본 plan SSR 컴포넌트 재사용 marker (PSR-CASCADE-03) | doc |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:644:| 21 | 시나리오 1~23 LOCAL_PASS 검증 | apps/web/scripts/site-scenarios.ts |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:650:- `PSR-DEFER-01`: static export to Git — apps/worker + isomorphic-git/simple-git. v0.1 SSR 의 컴포넌트 트리 재사용 + `generateStaticParams` + `next export`.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:651:- `PSR-DEFER-02`: 도메인 매핑 — subdomain `<slug>.glitzy.co` + custom domain CNAME. Vercel/Cloud Run middleware host header → instanceSlug rewrite.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:652:- `PSR-DEFER-04`: CDN cache 정책 — Cloudflare · Vercel ISR fine-tune.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:653:- `PSR-DEFER-10`: AI 크롤러 인증 + InstanceManifest.aiCrawlerPolicy row-driven 출력 + 법무 승인 필드 3종 verify (SEARCH_STANDARDIZATION § 3.3.1 룰).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:654:- `PSR-DEFER-13` (= LL-DEFER-01 alias · cycle1 PSR-06): LegalDocument 공개 노출 — compliance-assistant + ComplianceRecord legalCounsel/legalCounselAt 합류 시점.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:655:- `PSR-DEFER-16` (cycle1 PSR-05): `app_public_reader` NOLOGIN + MEMBERSHIP 분리 production 패턴.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:659:- `PSR-DEFER-03`: dark mode UI toggle (CSS vars 는 v0.1 부터 두 테마 출력 — DESIGN_TOKENS § 3.3 정합).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:660:- `PSR-DEFER-05`: 검색 콘솔 sitemap submission 자동화.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:661:- `PSR-DEFER-08`: draft preview token (어드민 외).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:662:- `PSR-DEFER-09`: 페이지별 OG 이미지 동적 생성 (`@vercel/og`).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:663:- `PSR-DEFER-17` (cycle1 PSR-19): Markdown sanitizer 를 `sanitize-html` → `rehype-sanitize` (unified pipeline) 전환 — EAT_CONTENT plan v0.1 안 FAQ 합류 시.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:665:### 9.3 EAT_CONTENT plan v0.1 합류 — **해소 marker (EAT_CONTENT_PLAN v0.x EC-CASCADE-07)**
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:667:- `PSR-DEFER-11(부분)`: ✅ **해소** — FAQ (P-011) 추가 — schema.org `FAQPage` JSON-LD. EAT v0.x acceptance commit 안 합류. C-12 풀명세 + faq DB table (C0012) + P-011 공개 페이지.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:668:- `PSR-DEFER-15` (cycle1 PSR-11): ✅ **해소** — Article `category` required 실 DB join · C-22 ArticleCategory 실 운영 합류 (C0009) · article.category_id staged 4-step migration (C0013) · Article detail SQL JOIN.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:672:- `PSR-DEFER-14` (cycle1 PSR-17): Google Rich Results Test / schema.org validator 자동 게이트 — manual QA marker. CI 게이트 X.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:676:- `PSR-DEFER-06`: `/<lang>/<instanceSlug>/...` routing 변경.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:682:- `PSR-CASCADE-01` (cycle1 PSR-02 격상 + cycle2 PSR-24 a/b 분리):
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:683:  - **PSR-CASCADE-01a (docs · plan acceptance commit 안 동반)**: `docs/admin/ARCHITECTURE.md` § 3 patch — `(site)` 신설 + `/admin` prefix 격상 marker.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:685:- `PSR-CASCADE-02` (cycle1 PSR-08 보강): `docs/core/SCHEMA_MAPPING.md` § 1.2 patch — v0.1 임시 path-based `@id` 패턴 + 도메인 매핑 후 (M0 v1.0) entity @id 전환 시 redirect/301/`sameAs` 처리 룰 추가 marker.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:686:- `PSR-CASCADE-03`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2 patch — apps/worker 의 build/export 시점에 본 plan SSR 컴포넌트 + JSON-LD 생성기 + sitemap/robots route handler 재사용 marker.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:695:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:697:| 2026-05-18 | v0.5 | **Codex 비평 cycle 4 1 minor finding 전건 수용 patch**: (PSR-31) § 5.3 SoT 요약 3줄 stale 정정 — § 3.1 4계열 명시 (A 일반검색 / B AI 검색 / C User-triggered / D 학습), § 3.2 enum `allow / disallowTraining / disallowAll / custom`, § 3.3 `allow` 시 `aiCrawlerLegalApproved: true` fail-gate. 5 PSR-CASCADE 모두 PASS. closeableAfterPatch=true 신호 + plan v1.0 acceptance commit 권고. 누계 cycle 1+2+3+4 = 31 findings 전건 수용. |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:698:| 2026-05-18 | v0.4 | **Codex 비평 cycle 3 2 findings (0 blocking + 1 major + 1 minor) 전건 수용 patch**: (PSR-29) acceptance scenario #21 themeColor 기대값 stale 정정 — `BrandTokens.colors.light.primary` default `#2563eb` (light) / `#60a5fa` (dark). (PSR-30) robots.txt starter SoT line-by-line 정합 — 헤더/일반 룰/C 계열/meta-externalagent 코멘트 + Sitemap placeholder `{domain}` 통일 (SEARCH_STANDARDIZATION § 3.3 그대로). 추가 cascade 실 적용: docs/admin/ARCHITECTURE.md § 3.12 신설 (PSR-CASCADE-01a — apps/web route group `(admin)` + `(site)` 분리). apps/spike-a/pgbouncer/userlist.txt 에 `app_public_reader` 추가 (PSR-CASCADE-05). 누계 cycle 1+2+3 = 30 findings 전건 수용. 5 cascade 중 4 PASS, 01b 는 별 code v1.0 cycle. |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:699:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |
docs/core/PAGE_TYPES.md:4:> **작성일**: 2026-05-14 (v0.7 → v0.8 — § 6 M0 표 P-013 비고 SoT 정합 / 잔존 버전 표기 정리)
docs/core/PAGE_TYPES.md:6:> **상위 문서**: `docs/ARCHITECTURE.md` § 7
docs/core/PAGE_TYPES.md:23:- M0 Slice: **10종 + Article 1샘플 = 11개 페이지** (P-001·P-002·P-003·P-004·P-005·P-006·P-011 FAQ·P-012·P-013·P-014 + P-010 1샘플) — EAT v0.x EC-CASCADE-08 patch (P-011 FAQ M0 합류).
docs/core/PAGE_TYPES.md:46:| P-011 | FAQ | `/faq` | `FAQ[]` | ✅ (EAT v0.x EC-CASCADE-08) |
docs/core/PAGE_TYPES.md:371:### P-011. FAQ
docs/core/PAGE_TYPES.md:430:- **어드민 화면 추가 없음** (P-013 자체) — LegalDocument 는 ClinicProfile 입력 시 정책 변수만 추가 입력하거나, Git 에 수동 보강. M0 어드민 화면 수는 EAT v0.x cascade 로 7개 (Faq 신규 폼 합류 — § 6 참조).
docs/core/PAGE_TYPES.md:481:> 어드민 § 3.8.1의 매핑 표가 단일 진실 원본. 본 문서는 요약.
docs/core/PAGE_TYPES.md:493:- **어드민 별도 LocationProfile 입력 화면 추가 불필요** (P-014 자체 화면 없음 — § 6 어드민 화면 수 7 = ClinicProfile 등 6 + Faq 신규).
docs/core/PAGE_TYPES.md:614:| P-011 | FAQ | `/faq` | FAQ[] | FAQPage | 답변 가변 | | ✅ (EAT v0.x EC-CASCADE-08) |
docs/core/PAGE_TYPES.md:627:## 6. Vertical Slice (M0) 페이지 타입 — 11개 페이지 (EAT v0.x EC-CASCADE-08: P-011 FAQ M0 합류)
docs/core/PAGE_TYPES.md:638:| 8 | P-014 Location Detail (main 자동) | 어드민 화면 추가 없이 자동 생성 (§ 3 P-014 규칙) |
docs/core/PAGE_TYPES.md:640:| **10** | **P-011 FAQ (EAT v0.x EC-CASCADE-08 합류)** | FAQ[] · FAQPage JSON-LD · 어드민 폼 신규 (Faq) · 공개 페이지 `/<slug>/faq` |
docs/core/PAGE_TYPES.md:647:2. ~~P-011 FAQ~~ ✅ M0 합류 (EAT v0.x)
docs/core/PAGE_TYPES.md:691:| 2026-05-14 | v0.7 | **피드백 정정**: (1) § 0 요약 SoT 정합 표현 정정 — "ClinicProfile 입력" → "ClinicProfile 화면의 기관 정체성 + 본원 위치·연락·시간 입력", (2) **§ 3 P-014 자동 생성 규칙 정합 갱신** — `reservationChannels = primaryCtas 상속` 및 `featuredChannelId` (선택, v0.6 신규) 흐름 명시. admin § 3.8.1과 동기화 |
docs/core/PAGE_TYPES.md:692:| 2026-05-14 | v0.8 | **피드백 정정**: § 6 M0 표 P-013 비고를 SoT 정합으로 정정 — "v0.5 격상 — ClinicProfile 변수 치환" → "ClinicProfile · LocationProfile(main) 변수 치환, 출시 게이트, 법무 검토 필수". 잔존 버전 표기(§ 6 제목 "(v0.5 갱신)" 등) 제거 |
docs/core/SCHEMA_MAPPING.md:4:> **작성일**: 2026-05-14 (v0.10 → v1.0 — § 2.2 룰 레벨 열 추가·안정판 격상)
docs/core/SCHEMA_MAPPING.md:6:> **상위 문서**: `docs/ARCHITECTURE.md` § 7
docs/core/SCHEMA_MAPPING.md:22:- **금지 schema** — `Review`·`AggregateRating`·`Offer`·`HealthAndBeautyBusiness`·`MedicalIndication` 단정형·`MedicalRiskFactor` 등은 **빌드 실패 (fail)** — § 8 참조.
docs/core/SCHEMA_MAPPING.md:23:- `C-15 SchemaInput` 인터페이스를 본 문서 § 6에서 정식 정의 (DATA_MODEL.md placeholder 해소).
docs/core/SCHEMA_MAPPING.md:24:- **공통 entity별 페이지 출력 정책은 § 2.5가 단일 SoT** — 페이지별 graph 구성(§ 3·§ 4)이 본 표를 따른다.
docs/core/SCHEMA_MAPPING.md:25:- **빌드 검증**: **자체 JSON schema/rule checker**가 빌드 게이트 (필수 필드·풀 entity 누락·금지 schema 사용 시 빌드 실패). schema.org official validator·Google Rich Results Test는 **운영 모니터링·수동 QA** (§ 7.2).
docs/core/SCHEMA_MAPPING.md:49:- 페이지 타입별 graph 구성 표준은 § 3·§ 4.
docs/core/SCHEMA_MAPPING.md:70:`PUBLIC_SITE_RENDER_PLAN.md` v0.x § 5.4 PSR-SEO-12 의 SSR + path-based routing 단계 (Phase 0) 에서는 도메인 매핑 (subdomain/custom domain) 합류 전이므로 **임시로 instanceSlug 가 path 에 들어간 `@id` 패턴** 을 사용한다:
docs/core/SCHEMA_MAPPING.md:87:- 본 전환 작업은 M0 v1.0 본 구현 cascade (PSR-DEFER-02 도메인 매핑) 와 동반.
docs/core/SCHEMA_MAPPING.md:127:> Organization·MedicalClinic·Physician 같은 entity에 inLanguage를 박으면 validator 노이즈. 보조 메타로 헤더의 `<html lang="ko-KR">`·meta inLanguage가 이미 표시함 (SEARCH_STANDARDIZATION § 2.1 정합).
docs/core/SCHEMA_MAPPING.md:143:| `MedicalClinic` | 본원(`#clinic`) — § 2.5 정책에 따라 페이지별 풀/참조. 다지점 비본원 지점은 P-012·P-014에서 N개 entity | LocationProfile (C-21) |
docs/core/SCHEMA_MAPPING.md:150:| `FAQPage` | P-011 FAQ (EAT v0.x EC-CASCADE-02 M0 합류 — graph self-contained · cross-page allowlist 미사용 · 빈 FAQ 0 row 도 `mainEntity: []` 허용) | FAQ[] (C-12) |
docs/core/SCHEMA_MAPPING.md:154:| `VideoObject` | (a) Article.embeddedMedia[].type=youtube·video, P-010의 contentFormat=video. (b) **EAT v0.x EC-CASCADE-02 (신규)**: MediaAppearance (C-25) 모든 channel_type 단일화 — fragment `#video-{slug}` (Doctor/About page 안 fragment-scoped inline). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1) | EmbeddedMedia · MediaAppearance (C-25) |
docs/core/SCHEMA_MAPPING.md:155:| `ScholarlyArticle` | **EAT v0.x EC-CASCADE-02 (신규)**: Publication (C-24) — Doctor Profile (P-004) · About (P-002) page 안 fragment-scoped inline (`@id` = `${pageBaseUrl}#publication-{slug}`). 별도 페이지는 EC-DEFER-02 (M1) | Publication (C-24) |
docs/core/SCHEMA_MAPPING.md:166:### 2.2 금지·주의 Schema — 요약 (상세는 § 8)
docs/core/SCHEMA_MAPPING.md:181:> 본 요약은 § 8 상세표와 일치한다. § 7.3에 룰 레벨 정의 (fail/warning/content-gate).
docs/core/SCHEMA_MAPPING.md:215:| **Blocked** | 출력 금지 — 빌드 시 검출하면 fail (§ 8) |
docs/core/SCHEMA_MAPPING.md:222:| `MedicalClinic` | **§ 2.5 정책에 따라 full 또는 ref** | 본원(`#clinic`) 풀/참조 위치는 § 2.5 SoT. 다지점 비본원 지점은 P-012·P-014에 풀 |
docs/core/SCHEMA_MAPPING.md:227:| `FAQPage` | Conditional | P-011 또는 FAQ 블록 포함 페이지 (P-006·P-008·P-010 등) |
docs/core/SCHEMA_MAPPING.md:231:| `Review` | **Blocked** | 의료광고법 (§ 8) |
docs/core/SCHEMA_MAPPING.md:232:| `AggregateRating` | **Blocked** | 의료광고법 (§ 8) |
docs/core/SCHEMA_MAPPING.md:234:| `MedicalRiskFactor`·`MedicalRiskEstimator` (schema 출력) | **Blocked (fail)** | 진단 단정 위험 (§ 8). 본문 원인·위험요인 표현은 별도 content-gate (compliance-assistant) — schema 출력과 분리 |
docs/core/SCHEMA_MAPPING.md:246:> 페이지별 graph 구성(§ 3·§ 4)의 단일 진실 원본. 같은 정책이 다른 섹션에서 다르게 표현되면 본 표가 우선.
docs/core/SCHEMA_MAPPING.md:258:| `MedicalClinic` 참조 | **참조만** — 위치 정보가 페이지 본문에 표시되지 않는 페이지 | P-003(Doctors List), P-004(Doctor Profile), **P-005(Treatments List — 시술 카드 목록 위주, 위치 슬롯 없음)**, P-007/8(Conditions), P-009/10(Articles), P-011(FAQ), P-013(Legal), P-101(Reviews), P-102(Pricing), P-103(Facilities), P-104(News), P-106(Self-test) |
docs/core/SCHEMA_MAPPING.md:262:| `Physician`, `MedicalProcedure`, `MedicalCondition`, `Article`, `FAQPage` | 상세 페이지에서 풀, 다른 페이지(목록·연관 참조)에서 참조 또는 inline 최소 | § 3 참조 |
docs/core/SCHEMA_MAPPING.md:264:> § 7.1 빌드 룰 checker는 본 표를 기준으로 페이지별 필수 풀 entity 존재 여부를 검증한다.
docs/core/SCHEMA_MAPPING.md:316:| `potentialAction` | `reservationChannels[]` 중 예약 채널 **또는 페이지/시술 CTA가 예약 채널**일 때 → `ReserveAction` (Conditional, § 2.1·§ 2.4 참조) |
docs/core/SCHEMA_MAPPING.md:318:**WebSite 필드 (Home에서만 풀 엔티티 출력 — § 2.5)**:
docs/core/SCHEMA_MAPPING.md:383:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
docs/core/SCHEMA_MAPPING.md:417:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
docs/core/SCHEMA_MAPPING.md:450:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5 — 시술 카드 목록 위주, 위치 정보 슬롯 없음)
docs/core/SCHEMA_MAPPING.md:480:2. `MedicalClinic` (본원) — **[풀]** (§ 2.5 — 예약 CTA·담당 의료진 연계로 풀 entity 필요)
docs/core/SCHEMA_MAPPING.md:532:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
docs/core/SCHEMA_MAPPING.md:541:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
docs/core/SCHEMA_MAPPING.md:558:> `MedicalRiskFactor` schema는 **출력하지 않음** (§ 2.4·§ 8 fail). `causes[]`는 본문 표현으로만 노출. 본문의 원인·위험요인 표현은 content-gate(compliance-assistant)가 검수 — schema 룰과 본문 룰 분리.
docs/core/SCHEMA_MAPPING.md:564:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
docs/core/SCHEMA_MAPPING.md:608:1. `Organization` — **[풀]** (§ 2.5: 모든 페이지 풀)
docs/core/SCHEMA_MAPPING.md:609:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
docs/core/SCHEMA_MAPPING.md:665:### P-011. FAQ
docs/core/SCHEMA_MAPPING.md:669:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
docs/core/SCHEMA_MAPPING.md:680:2. `MedicalClinic` (본원 `#clinic`) — **[풀]** (§ 2.5 — Conversion Hub 핵심 entity)
docs/core/SCHEMA_MAPPING.md:725:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
docs/core/SCHEMA_MAPPING.md:758:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀].
docs/core/SCHEMA_MAPPING.md:759:**주의**: `Review`/`AggregateRating` 사용 **금지** (의료광고법 — § 8 참조). 후기 페이지는 schema 빈약하더라도 의도된 선택.
docs/core/SCHEMA_MAPPING.md:762:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀].
docs/core/SCHEMA_MAPPING.md:766:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀]. 사진은 본문 갤러리 또는 `WebPage.image: ImageObject[]`로 표현 (`ImageGallery`는 사용 안 함 — 카탈로그·결정표 미등재).
docs/core/SCHEMA_MAPPING.md:769:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀] + (개별 News 항목) `NewsArticle` 또는 `Article`[풀].
docs/core/SCHEMA_MAPPING.md:773:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[**풀**, § 2.5 — 예약 action 풀 entity 필요] + `WebPage`[풀] + `BreadcrumbList`[풀].
docs/core/SCHEMA_MAPPING.md:777:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage` 또는 `MedicalWebPage`[풀] + `BreadcrumbList`[풀]. **`Quiz`·`MedicalDiagnosis`·`MedicalRiskEstimator`는 fail** (§ 2.4·§ 8). 일반 정보 형태의 `MedicalWebPage` 또는 단순 `WebPage`만.
docs/core/SCHEMA_MAPPING.md:799:| C-15 `SchemaInput` | **(인터페이스 — § 6에서 정식 정의)** | |
docs/core/SCHEMA_MAPPING.md:887:| P-011 FAQ | `faqs: FAQ[]` |
docs/core/SCHEMA_MAPPING.md:902:생성기는 페이지 타입별 § 3·§ 4의 graph 구성 표준에 따라 entity 배열을 출력.
docs/core/SCHEMA_MAPPING.md:912:| **공통 일반 룰 (§ 2.5 정합)** | **§ 2.5에서 "풀"로 지정된 entity는 해당 페이지 graph에 풀필드 출력 필수**. 누락 시 빌드 실패. **선택 페이지(P-101~P-106)는 인스턴스에서 활성화된 경우에만 검증** (`FeatureModuleConfig`·`InstanceManifest`·라우트 설정 기준 — P-103·P-104·P-105는 Instance 결정, P-106은 Feature Module 기반 등 활성화 경로가 페이지별로 다를 수 있음) |
docs/core/SCHEMA_MAPPING.md:915:| P-001·P-002·P-006·P-012·P-014 (필수) / P-105 (활성화 시) | **`MedicalClinic` 풀** (§ 2.5 풀 지정) + `name`·`address`·`telephone`·`openingHoursSpecification` |
docs/core/SCHEMA_MAPPING.md:920:| P-011 | `FAQPage` + `mainEntity[]` 최소 1개 |
docs/core/SCHEMA_MAPPING.md:934:### 7.3 룰 레벨 분류 (§ 8 금지·주의 schema 처리)
docs/core/SCHEMA_MAPPING.md:938:| **fail** | 출력 시 빌드 실패 | Review·AggregateRating·Offer·**MedicalRiskFactor**·MedicalGuideline·HealthInsurancePlan·MedicalDiagnosis 등 — § 8 표 참조 |
docs/core/SCHEMA_MAPPING.md:971:| SM-03 | `BusinessHours.receptionHours`·`lunchBreaks`·`specialClosures` schema 출력 포맷 세부 확정 — § 5.1 정책은 정의됨(receptionHours 보조 OpeningHoursSpecification, lunchBreaks 미출력, specialClosures 기본 미출력). 남은 결정은 receptionHours의 `description` 텍스트 형식·자동 변환 룰 | 빌드 구현 단계에서 확정 |
docs/core/SCHEMA_MAPPING.md:973:| SM-05 | ~~다지점 시 본원 `@id` alias 처리~~ | **v0.3 해소** — `/#clinic` 단일 entity로 고정. alias 사용 안 함 (§ 1.4) |
docs/core/SCHEMA_MAPPING.md:974:| SM-06 | P-106 Self-test의 `MedicalWebPage` 세부 필드 정책 — `medicalAudience`·`lastReviewed`·`reviewedBy` 등 활용 범위. (Quiz는 fail로 확정됨 — § 2.4·§ 8) | P-106 도입 시 |
docs/core/SCHEMA_MAPPING.md:975:| SM-07 | ~~Schema validator 도구 선정~~ | **v0.3 해소** — 빌드 게이트는 **자체 JSON schema/rule checker** (§ 7.2). 공식 validator·Google Rich Results Test는 운영 모니터링·수동 QA로 분리 |
docs/core/SCHEMA_MAPPING.md:985:| 2026-05-14 | v0.2 | **피드백 정합 정정**: (1) **C-15/CT-15 혼동 → C-15로 통일** (SchemaInput은 데이터 계약, CT 아님), (2) **inLanguage 정책 좁힘** — CreativeWork·페이지 entity에만, (3) **MedicalClinic 사용처 정합** — § 2.1 카탈로그 "전 페이지 본원 1개 포함" 명시 (그래프 정의와 일치), (4) **P-002 About 정정** — address 매핑 제거(LocationProfile SoT), mediaCoverage는 sameAs 또는 CreativeWork 보조로, (5) **ItemList inline 필드 추가** — P-003/P-005/P-007/P-009에 name·url·image·기타 최소 필드 + @id 참조 병행, (6) **List 페이지 그래프에 WebPage 추가** — § 7.1 검증 룰과 정합 (이전 누락), (7) **evidenceNotes 매핑 보수화** — `MedicalStudy` → `citation`/`CreativeWork` (EvidenceNote 필드로 MedicalStudy 구성 부족), (8) **§ 2.3 신규** — Schema Rich Results 실효 vs Entity 의미 전달 분류 |
docs/core/SCHEMA_MAPPING.md:986:| 2026-05-14 | v0.3 | **빌드 가능 규칙화** (피드백 10건): (1) **§ 1.1 Core 출력 범위 한정** — 외부 위젯 schema 충돌 가능성 명시, (2) **§ 1.4 본원 @id 일관성 (SM-05 해소)** — `/#clinic` 단일 entity, 다지점 비본원만 `/locations/{slug}#clinic`, alias 금지, (3) **§ 2.1 WebSite Home 전용** — 다른 페이지는 `isPartOf` 참조만, (4) **§ 2.1 Person M0 외 후속** — authorType != clinician은 데이터 모델 확장 후, (5) **§ 2.4 신규 — Allowed/Conditional/Blocked 3단계 분류**, (6) **§ 3 P-010 graph 구성 [풀]/[참조+inline]/[참조만] 표기 명확화** + VideoObject Google Rich Results 최소 필드 (name·description·thumbnailUrl·uploadDate·contentUrl/embedUrl), (7) **§ 5.1 dayOfWeek enum 변환표** + specialClosures 기본 미출력 정책, (8) **§ 7.2 빌드 게이트 vs 운영 모니터링 분리** — 공식 validator는 모니터링·수동 QA로, (9) **§ 7.3 룰 레벨 분류 (fail/warning/content-gate)** + **§ 8 표에 룰 레벨 명시** |
docs/core/SCHEMA_MAPPING.md:987:| 2026-05-14 | v0.4 | **잔재 정리·룰 충돌 해소** (피드백 8건): (1) **§ 2.3 A/B 카테고리 풀명세 재펼침** ("이전과 동일" 잔재 제거), (2) **inLanguage 잔재 4곳 제거** — Organization·MedicalClinic·Physician·MedicalProcedure 매핑 표, (3) **MedicalRiskFactor 룰 충돌 해소** — schema 출력은 **fail로 통일**, 본문 표현(원인·위험요인)은 별도 content-gate 분리, (4) **§ 9 미결정 정리** — SM-05·SM-07 "해소" 표시, (5) **P-106 Quiz 제거** — `WebPage`/`MedicalWebPage`만, (6) **P-103 ImageGallery 제거** — 본문 갤러리 또는 `WebPage.image: ImageObject[]`, (7) **§ 5 C-02 Person 후속** 명시 (M0 외), (8) **§ 7.3 warning 예시에서 MedicalRiskFactor 제거** (fail로 통일) — `MedicalIndication` 단정형·`HealthAndBeautyBusiness` 단독 사용 등으로 교체 |
docs/core/SCHEMA_MAPPING.md:988:| 2026-05-14 | v0.5 | **미세 잔재 해소·룰 단순화** (피드백 7건): (1) **P-008 riskFactor → MedicalRiskFactor 행 삭제** — fail 정책 정합. causes[]는 description 보조·본문 표현으로, (2) **P-008 주석 정정** — "신중" → "schema 출력 안 함, 본문은 content-gate", (3) **HealthAndBeautyBusiness fail로 통일** (§ 2.4·§ 8 모두) — 단독·병행 모두 미사용, (4) **MedicalIndication fail로 통일** — Schema 출력 금지, 본문 효능 표현만 content-gate, (5) **HowTo Rich Results A 목록에서 제거** — 미사용. 미래 확장 시 카탈로그·결정표·의료 리스크 룰 추가, (6) **§ 2.4에 Person 두 케이스 분리** — Organization.founder는 Allowed inline / Article.author (non-clinician)는 M0 외 후속, (7) **VideoObject 필수 필드 표현 명확화** — `name·description·thumbnailUrl·uploadDate` 4개 필수 + `contentUrl`/`embedUrl` 중 1개 |
docs/core/SCHEMA_MAPPING.md:989:| 2026-05-14 | v0.6 | **정책 표 정합화** (피드백 7건): (1) **§ 2.5 신설 — 공통 entity별 페이지 출력 정책 (단일 SoT)** — Organization/WebSite/MedicalClinic의 풀 entity vs 참조 위치 명시. § 7.1 룰 checker가 본 표 기준으로 검증, (2) "풀 entity vs 참조" 용어 정의 — graph[]에 entity 정의 여부 명확, (3) **§ 0 요약 일관화** — "신중하게" → fail로, validator 표현을 § 7.2와 일치 (자체 checker = 빌드, 공식 validator = 모니터링), (4) **LocalBusiness 별도 출력 제거** — § 2.1·§ 5 C-20 정정. `MedicalClinic`이 LocalBusiness sub-class이므로 `@type: "MedicalClinic"`만 사용, LocalBusiness 계열 속성 활용, (5) **SearchAction Conditional** — `/search` 라우트 부재 시 미출력 (M0 미출력, 검색 기능 활성화 시 합류), (6) **§ 7.3 warning 예시 교체** — MedicalIndication·HealthAndBeautyBusiness 제거(둘 다 fail). 비차단 항목(외부 위젯 @id 충돌·VideoObject 권장 필드 누락·본문 길이 미달 등)으로 교체 |
docs/core/SCHEMA_MAPPING.md:990:| 2026-05-14 | v0.7 | **§ 2.5 SoT 기준 일괄 동기화** (피드백 7건): (1) **§ 2.1 SearchAction Conditional 명시**, **ReserveAction을 LocalBusiness → MedicalClinic.potentialAction**으로 정정, (2) **§ 2.4 MedicalClinic 결정 변경** — "본원 1개 전 페이지" → "§ 2.5 정책에 따라 full 또는 ref", (3) **§ 2.5 P-105 Reservation 풀 entity로 재분류**, P-101~P-106 일괄 ref 거친 표현 세분화, (4) **§ 3·§ 4 페이지별 graph 구성 [풀]/[참조]/[참조+inline] 표기 일괄 적용** — P-003·P-004·P-007·P-008·P-009·P-010·P-011·P-013·P-101~P-106, (5) **§ 7.1 검증 룰 정정** — "PageMeta.canonical 필수" → "**resolved canonical URL 필수** (PageMeta.canonical 또는 SchemaInput.canonicalUrl로 결정)" |
docs/core/SCHEMA_MAPPING.md:991:| 2026-05-14 | v0.8 | **§ 2.5 cascade 마무리** (피드백 6건): (1) **P-005 MedicalClinic [참조만]로 변경** — PAGE_TYPES § 3 P-005에 위치 정보 슬롯 없음. § 2.5 풀 지정 페이지에서 제거, (2) **P-005·P-006·P-012·P-014 [풀]/[참조] 표기 적용** — v0.7 일괄 적용 시 누락된 페이지 보완, (3) **P-014 @id 분기 명시** — 단지점 main = `#clinic` (본원 entity와 동일), 다지점 비본원 = `/locations/{slug}#clinic` (별도 entity), (4) **§ 7.1 일반 검증 룰 추가** — "§ 2.5에서 풀로 지정된 entity는 해당 페이지 필수" (룰 checker의 일반 룰. 페이지별 명시는 보조), (5) **§ 7.1 MedicalClinic 풀 페이지 목록 확장** — P-001·P-002·P-006·P-012·P-014·P-105 (이전 P-012·P-014만), (6) **§ 2.1 ReserveAction Conditional 명확화** — "reservationChannels 또는 페이지 예약 CTA가 실제 있을 때만" |
docs/core/SCHEMA_MAPPING.md:992:| 2026-05-14 | v0.9 | **Conditional·미결정 다듬기** (피드백 5건): (1) **ReserveAction 조건 § 2.1·§ 2.4 통일** — `(a) #clinic 풀 entity 페이지 + (b) reservationChannels 예약 채널 존재 또는 페이지/시술 CTA가 예약 채널`, (2) **§ 7.1 선택 페이지 검증 단서** — "선택 페이지(P-101~P-106)는 인스턴스에서 활성화된 경우에만 검증" (FeatureModuleConfig·라우트 설정 기준). P-105 등 풀 필수 페이지 목록에 "활성화 시" 명시, (3) **SM-03 수준 낮춤** — 완전 미결정 → "출력 포맷 세부 확정 필요" (정책은 § 5.1에 정의됨), (4) **SM-06 이름 정정** — "Quiz·Self-test schema 모범" → "P-106 Self-test의 `MedicalWebPage` 세부 필드 정책" (Quiz는 fail로 확정) |
docs/core/SCHEMA_MAPPING.md:993:| 2026-05-14 | v0.10 | **미세 표현 정합** (피드백 4건): (1) § 3 P-001 MedicalClinic potentialAction 행에 "페이지/시술 CTA가 예약 채널일 때"도 포함 명시, (2) § 4 P-105 — "ReserveAction 풀필드" → "**상세 필드 포함** (독립 entity 아닌 MedicalClinic.potentialAction 중첩 구조)", (3) § 7.1 선택 페이지 검증 기준에 **InstanceManifest 추가** — P-103·P-104·P-105는 Instance 결정·P-106은 Feature Module 기반 등 활성화 경로 다양화, (4) **§ 2.2 제목에 "룰 레벨 상세는 § 8" 명시** — fail/warning/content-gate 기조와 정합 |
docs/core/SCHEMA_MAPPING.md:994:| 2026-05-14 | **v1.0** | **구현 명세 안정판 격상**: (1) **§ 2.2 표에 룰 레벨 열 추가** — § 8 상세표와 일치하는 요약. § 8 이동 없이 한눈에 파악 가능, (2) **v0.10 → v1.0 격상** — 사용자 메타-피드백 "다음 안정판을 v1.0으로" 채택. 핵심 정책·표 정합·룰 일관성 완성. 다음 단계는 SchemaGenerator/rule checker 실제 구현 + 그 과정의 발견 사항을 문서에 되먹이기 |
docs/decisions/EAT_CONTENT_PLAN.md:3:> **상태**: **v1.0 (acceptance)** — Codex 자동 비평 **6 cycle 36 findings 전건 수용** · cycle 6 closeableAfterPatch=true 확정. 수렴 추세 **22 → 8 → 3 → 2 → 1 → 0**. PUBLIC_SITE_RENDER code v1.0 acceptance 직후 진입하는 첫 신규 콘텐츠 타입 plan. Lovable 사이트 (다이트한의원 부평점) 의 콘텐츠 종류 매핑에서 누락된 부분 (논문·미디어·FAQ 풀명세 + ArticleCategory 실 운영) 을 Core 계약으로 확정한다.
docs/decisions/EAT_CONTENT_PLAN.md:5:> **acceptance commit 구성 (LL-33 / PSR-CASCADE-01 패턴 정합)** — 본 commit 안 docs cascade 동시 포함: (1) EAT_CONTENT_PLAN.md v1.0 · (2) EC-CASCADE-01 DATA_MODEL § 0/§ 1.1/§ 4 (25 contracts + C-10 enum +2 + C-12 풀명세 + C-22 marker + C-24/25 신규 + ComplianceRecord 다이어그램) · (3) EC-CASCADE-02 SCHEMA_MAPPING § 2 (ScholarlyArticle/VideoObject) · (4) EC-CASCADE-03 CONTENT_STANDARDS § 7.1.1.2 · (5) EC-CASCADE-04 M0_BUILD_EXPORT § 2.2 · (6) EC-CASCADE-06 manifest.ts 16 entry (spec) · (7) EC-CASCADE-07 PUBLIC_SITE_RENDER § 9.3 PSR-DEFER-11/15 ✅ · (8) EC-CASCADE-08 PAGE_TYPES § 1.1/§ 5/§ 6 · (9) EC-CASCADE-09 ARCH § 3.8/§ 3.8.2/§ 3.11 11페이지 + 어드민 7개.
docs/decisions/EAT_CONTENT_PLAN.md:7:> **plan v1.0 acceptance commit vs EAT_CONTENT code v1.0 cycle 분리 (cycle 2 ECP-23~30 정정 — LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합)**:
docs/decisions/EAT_CONTENT_PLAN.md:8:> - **plan acceptance commit 안 cascade (docs only · acceptance precondition)**: 본 plan + DATA_MODEL § 1.1 인벤토리 25 + § 4 C-10 enum +2 + C-12 풀명세 + C-22 marker + C-24/25 신규 풀명세 + PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 11페이지 + SCHEMA_MAPPING § 2 ScholarlyArticle/VideoObject 카탈로그 + CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 + ARCH § 3.11 11 페이지 + M0_BUILD_EXPORT § 2.2 4 entity 변환 표 + PUBLIC_SITE_RENDER PSR-DEFER-11/15 해소 marker + manifest.ts orderedMigrations 16 entry (spec only — runner 코드는 LL-DEFER-20).
docs/decisions/EAT_CONTENT_PLAN.md:9:> - **EAT_CONTENT code v1.0 cycle 안 cascade (별 사이클 분리 · 실 코드)**: migrations 6 (C0009/10/11/12/13 + D0014) · Drizzle schema v0.4 · zod schema · 어드민 폼 4종 + route 4종 + dashboard · JSON-LD entities/builders 확장 · P-011 FAQ public page · Doctor/About graph 확장 · Article detail SQL JOIN article_category · sitemap.xml 확장 · seed.ts default category · renderMarkdownToPlainText helper · vitest scenario 24~36.
docs/decisions/EAT_CONTENT_PLAN.md:15:| Publication | **신규** | C-24 (현 인벤토리 빈 슬롯) |
docs/decisions/EAT_CONTENT_PLAN.md:20:모든 entity 는 schema.org JSON-LD 로 출력되어 P-004 Doctor Profile · P-002 About · P-011 FAQ 페이지에 합류한다.
docs/decisions/EAT_CONTENT_PLAN.md:22:> **scope limit (EC-INTRO-01)** — 본 plan 은 다음만 다룬다: (1) C-24 Publication · C-25 MediaAppearance 신규 + C-12 Faq · C-22 ArticleCategory 합류. (2) DATA_MODEL C-10 `contentType` enum cascade (+Publication +MediaAppearance). (3) PSR-DEFER-11(부분: FAQ P-011) · PSR-DEFER-15 (Article category required) 해소. (4) PUBLIC_SITE_RENDER code v1.0 의 D0011 GRANT cascade (D0014). **본 plan 외**: Inquiry (1:1 상담 게시판 — PIPA 큰 결정), Reviews/Pricing High-risk commercial, Publication/MediaAppearance 별도 페이지 (모두 EC-DEFER).
docs/decisions/EAT_CONTENT_PLAN.md:26:- `docs/core/DATA_MODEL.md` v0.9 — § 1.1 인벤토리 (23 → 25 contracts) · § 4 C-12 / C-22 풀명세 + C-24 Publication · C-25 MediaAppearance 신규 (EC-CASCADE-01) · § 4 C-10 `contentType` enum 확장 (+ Publication +MediaAppearance) · § 4 C-04 Article `category` required 정합
docs/decisions/EAT_CONTENT_PLAN.md:27:- `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ — M0 미합류 → 본 plan 합류 (EC-CASCADE-08)
docs/decisions/EAT_CONTENT_PLAN.md:28:- `docs/core/SCHEMA_MAPPING.md` § 1.2 `@id` 패턴 · § 2 entity 카탈로그 (+ ScholarlyArticle, VideoObject) · § 3 P-011 FAQ graph (EC-CASCADE-02)
docs/decisions/EAT_CONTENT_PLAN.md:29:- `docs/core/SEARCH_STANDARDIZATION.md` § 4.3 sitemap P-011 monthly 0.5
docs/decisions/EAT_CONTENT_PLAN.md:30:- `docs/core/CONTENT_STANDARDS.md` v1.3 § 7.1.1.x — Publication/MediaAppearance 외부 인용 면제 · FAQ Q/A 광고 표현 검수 적용 (EC-CASCADE-03)
docs/decisions/EAT_CONTENT_PLAN.md:31:- `docs/compliance/RISK_LEVELS.md` v1.1 § 2 — FAQ 자동 추론 대상 (의료 질문 = Medium/High 후보), Publication/MediaAppearance Low fixed
docs/decisions/EAT_CONTENT_PLAN.md:32:- `docs/admin/ARCHITECTURE.md` § 3 — Vertical Slice 안 P-011 FAQ 페이지 합류 marker (EC-CASCADE-09)
docs/decisions/EAT_CONTENT_PLAN.md:33:- `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v1.0 § 1.3 PSR-DEFER-11 (FAQ 부분 해소) + PSR-DEFER-15 (Article category 해소) (EC-CASCADE-07)
docs/decisions/EAT_CONTENT_PLAN.md:35:- `docs/decisions/M0_BUILD_EXPORT_PLAN.md` v0.1 § 2.1 — 신규 entity Git 출력 cascade (EC-CASCADE-04)
docs/decisions/EAT_CONTENT_PLAN.md:36:- `packages/db/migrations/D0011_public_reader.sql` — D0014 cascade target (EC-CASCADE-05)
docs/decisions/EAT_CONTENT_PLAN.md:37:- `packages/migrations-runner/src/manifest.ts` — 16 단계 (현 10 + C0009/10/11/12/13 + D0014) (EC-CASCADE-06)
docs/decisions/EAT_CONTENT_PLAN.md:53:- **Article category 필수화 (PSR-DEFER-15 해소)** — C-04 Article `category Ref<C-22>` required SoT 정합 — DB NOT NULL 전환 + URL `[category]` 실 DB join.
docs/decisions/EAT_CONTENT_PLAN.md:55:### 1.2 범위 (포함) — cycle 1 ECP-01·02·03·04·07 정정
docs/decisions/EAT_CONTENT_PLAN.md:59:| C-24 Publication 신규 entity | 외부 학술 자료 인용 · authors[]·journal·publishedDate·doi/pubmedId·url·summary·authorDoctorId(optional FK to doctor_profile). DATA_MODEL § 1.1 인벤토리 25 contracts (cycle 1 ECP-01 정정) |
docs/decisions/EAT_CONTENT_PLAN.md:60:| C-25 MediaAppearance 신규 entity | 미디어 출연 · channelName·channelType·publishedDate·durationSeconds·url·thumbnailUrl·summary·authorDoctorId(optional). 모든 channel_type 을 schema.org `VideoObject` 로 단일화 v0.1 (cycle 1 ECP-05 정합) — BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 신설 (M1 cascade) |
docs/decisions/EAT_CONTENT_PLAN.md:61:| C-12 Faq 풀명세 합류 | DATA_MODEL § 5 간략 명세를 풀명세로 (EC-CASCADE-01) + M0 합류 |
docs/decisions/EAT_CONTENT_PLAN.md:62:| C-22 ArticleCategory 실 운영 합류 (PSR-DEFER-15 해소) | DATA_MODEL § 4 기존 풀명세 (parentCategory·pillar·coverImageUrl·seoMeta·articleTypeDefault) — DB 컬럼은 모두 추가 (optional · v0.1 nullable). 어드민 UI/공개 렌더는 v0.1 minimal (slug·name·displayOrder만 노출 · 나머지 EC-DEFER-10 M1) |
docs/decisions/EAT_CONTENT_PLAN.md:63:| C-04 Article.category required (PSR-DEFER-15 해소 · cycle 1 ECP-03 정정) | `article.category_id` NOT NULL — staged migration: (1) ADD COLUMN nullable (2) seed default `general` (3) backfill (4) SET NOT NULL. 단일 migration 안 4 step |
docs/decisions/EAT_CONTENT_PLAN.md:64:| C-10 contentType enum cascade (cycle 1 ECP-07 정정) | 기존 enum 15종 + `Publication` + `MediaAppearance` = 17종. FAQ · ArticleCategory · LegalDocument · Feature 는 이미 enum 안 (토큰 그대로 사용 — `FAQ` 대문자) |
docs/decisions/EAT_CONTENT_PLAN.md:66:| D0014 GRANT + per-table policy (cycle 1 ECP-16 정정) | D0011 패턴 정합 — publication/media_appearance/faq 는 published only · article_category 는 instance_id only (taxonomy public 의도 명시 — 분류 자체는 RLS instance scope · status 없음) |
docs/decisions/EAT_CONTENT_PLAN.md:68:| status zod enum subset (cycle 1 ECP-10·11 정정) | v0.1 단계 status zod = `z.enum(['draft'])` 만 — compliance-assistant 합류 (EC-DEFER-05) 전까지 모든 4 entity 어드민 폼에서 published 차단. **FAQ 도 published 차단** (위험도 자동 추론 합류 전 Medium/High 자동 발행 회피). LegalDocument 패턴 정합 |
docs/decisions/EAT_CONTENT_PLAN.md:69:| 공개 페이지 P-011 FAQ 신설 (cycle 1 ECP-12 정정 — PAGE_TYPES M0 합류 EC-CASCADE-08 acceptance precondition 격상) | `/<slug>/faq` route — FaqList + FAQPage JSON-LD |
docs/decisions/EAT_CONTENT_PLAN.md:70:| Doctor Profile (P-004) 확장 | Publications + MediaAppearances **graph 안 풀 entity 출력** (cycle 1 ECP-06·13 정정 — cross-page ref + allowlist 옵션 폐기). `@id` = fragment-scoped: `${doctorProfileUrl}#publication-{slug}` · `${doctorProfileUrl}#video-{slug}` |
docs/decisions/EAT_CONTENT_PLAN.md:72:| MedicalClinic.subjectOf 통일 (cycle 1 ECP-15 정정) | About P-002 의 publication/media reference 는 `MedicalClinic.subjectOf` array (Organization 미사용 단일 결정) |
docs/decisions/EAT_CONTENT_PLAN.md:73:| Article URL category 실 join (PSR-DEFER-15 해소 · cycle 1 ECP-17 정정) | `insights/[category]/[slug]/page.tsx` 의 SQL 을 `article JOIN article_category ON article.category_id = article_category.id WHERE article_category.slug = ${params.category}` 로 patch |
docs/decisions/EAT_CONTENT_PLAN.md:75:| sitemap.xml 확장 | P-011 FAQ entry (changefreq monthly · priority 0.5 · lastmod `MAX(faq.updated_at)`) — published row 0건이어도 페이지 포함 (cycle 1 ECP-21 정정) |
docs/decisions/EAT_CONTENT_PLAN.md:76:| FAQ helper 2 종 (cycle 1 ECP-19 정정) | `renderMarkdownToHtml` (public HTML rendering · 기존) + 신규 `renderMarkdownToPlainText` (JSON-LD Answer text · strip + sanitize) |
docs/decisions/EAT_CONTENT_PLAN.md:77:| Markdown sanitize rel 통일 (cycle 1 ECP-20 정정) | 외부 링크 `nofollow noopener noreferrer` (PSR-20 정합 — Publication/Media external link 도 동일) |
docs/decisions/EAT_CONTENT_PLAN.md:79:| CONTENT_STANDARDS § 7.1.1.x 확장 | Publication/MediaAppearance 외부 인용 면제 · FAQ Q/A 광고 표현 검수 적용 |
docs/decisions/EAT_CONTENT_PLAN.md:80:| DOI validation 통일 (cycle 1 ECP-08 정정) | DB CHECK regex `^10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$` 와 zod schema 동일 anchored regex |
docs/decisions/EAT_CONTENT_PLAN.md:81:| authors DEFAULT 제거 (cycle 1 ECP-18 정정) | `authors JSONB NOT NULL` (DEFAULT `[]` 삭제) + min 1 CHECK + 어드민 폼에서 required |
docs/decisions/EAT_CONTENT_PLAN.md:87:| Inquiry (1:1 상담 게시판) 신규 entity | 별 cycle — 회원 가입 / 익명 처리 / PIPA 보관 정책 큰 결정 | EC-DEFER-01 |
docs/decisions/EAT_CONTENT_PLAN.md:88:| Publication / MediaAppearance 별도 페이지 (P-Publications · P-MediaAppearances) | M1 Phase Alpha — 학술 인용·미디어 출연 페이지 자체 색인 가치 평가 후 | EC-DEFER-02 |
docs/decisions/EAT_CONTENT_PLAN.md:89:| Publication PDF / DOI 자동 메타데이터 fetch (CrossRef API) | M1 Phase Alpha — 외부 API provider gate | EC-DEFER-03 |
docs/decisions/EAT_CONTENT_PLAN.md:90:| MediaAppearance 동영상 embed (YouTube iframe 등) | M1 Phase Alpha — CSP 결정 | EC-DEFER-04 |
docs/decisions/EAT_CONTENT_PLAN.md:91:| FAQ 자동 검수 (compliance-assistant + RiskRule + RiskInference) 완전 통합 | compliance-assistant Feature 본 구현 cascade | EC-DEFER-05 |
docs/decisions/EAT_CONTENT_PLAN.md:92:| FAQ 다국어 (`inLanguage`) | M3 다국어 cascade | EC-DEFER-06 |
docs/decisions/EAT_CONTENT_PLAN.md:93:| Publication / MediaAppearance 검수 워크플로우 (status='review-queued' 전이 + ComplianceRecord pre-publish) | LL-DEFER-01 patterns 동일 — compliance-assistant + ComplianceRecord 합류 | EC-DEFER-07 |
docs/decisions/EAT_CONTENT_PLAN.md:94:| Reviews (P-101 후기) · Pricing (P-102) High-risk commercial 페이지 | M1+ 별 plan — MEDICAL_AD_COMPLIANCE_COMMON 검토 후 | EC-DEFER-08 |
docs/decisions/EAT_CONTENT_PLAN.md:95:| FAQ.metadata.featuredOnHome — Home 안 inline 표시 | M1 Phase Alpha | EC-DEFER-09 |
docs/decisions/EAT_CONTENT_PLAN.md:96:| ArticleCategory 트리/계층 (parentCategory) · 메타 컬럼 (pillar · coverImageUrl · seoMeta · articleTypeDefault) 어드민 UI/공개 렌더 사용 | M1 Phase Alpha — v0.1 DB 컬럼은 추가하되 UI/렌더 미사용 | EC-DEFER-10 |
docs/decisions/EAT_CONTENT_PLAN.md:97:| MediaAppearance channel_type 별 schema.org `@type` 분기 (broadcast → BroadcastEvent · press → NewsArticle) | M1 Phase Alpha — v0.1 모두 VideoObject 단일화 | EC-DEFER-11 |
docs/decisions/EAT_CONTENT_PLAN.md:98:| 4 entity 어드민 published 발행 (status='published' 전이) | EC-DEFER-05 와 동일 시점 — compliance-assistant 합류 + Faq risk_level 자동 추론 후 | EC-DEFER-12 |
docs/decisions/EAT_CONTENT_PLAN.md:102:### 2.1 C-22 ArticleCategory 실 DB 구현 (EC-SCHEMA-01) — cycle 1 ECP-02 정정
docs/decisions/EAT_CONTENT_PLAN.md:104:DATA_MODEL § 4 C-22 풀명세 전체 컬럼을 DB 에 추가 (v0.1 단계 어드민 UI 는 minimal — slug·name·displayOrder 만 노출 · 나머지 EC-DEFER-10):
docs/decisions/EAT_CONTENT_PLAN.md:115:  pillar TEXT,                                  -- DATA_MODEL C-22 풀명세 · v0.1 nullable (EC-DEFER-10)
docs/decisions/EAT_CONTENT_PLAN.md:116:  parent_category_id UUID,                       -- 계층 구조 · v0.1 nullable (EC-DEFER-10) · same-tenant composite FK
docs/decisions/EAT_CONTENT_PLAN.md:148:- (EC-SCHEMA-02) C-22 풀명세 전체 컬럼 추가. v0.1 어드민 UI minimal — slug·name·displayOrder 만 노출. parentCategory·pillar·coverImageUrl·seoMeta·articleTypeDefault 는 DB 컬럼만 존재 + EC-DEFER-10 marker.
docs/decisions/EAT_CONTENT_PLAN.md:149:- (EC-SCHEMA-03 · cycle 1 ECP-09 정정) **default `general` ArticleCategory seed 위치 = `apps/web/src/seed.ts`** — instance 생성 시 자동 INSERT (`{slug: 'general', name: '일반', display_order: 0}`). 기존 instance 가 있을 때는 backfill 마이그레이션 (C0013 안에서 INSERT IF NOT EXISTS) 으로 보장. C0013 dependsOn = article_category + article.
docs/decisions/EAT_CONTENT_PLAN.md:150:- (EC-SCHEMA-04) flat 1-level 운영 v0.1 — `parent_category_id IS NULL` 인 row 만 어드민 UI 노출 (DB 자체는 self-referencing FK 허용).
docs/decisions/EAT_CONTENT_PLAN.md:152:### 2.2 C-04 Article.category_id required — PSR-DEFER-15 해소 (EC-SCHEMA-05) — cycle 1 ECP-03 정정
docs/decisions/EAT_CONTENT_PLAN.md:190:- (EC-SCHEMA-06) staged migration 안 4 단계 모두 단일 migration 으로 처리. acceptance commit 안 backfill 완성.
docs/decisions/EAT_CONTENT_PLAN.md:191:- (EC-SCHEMA-07) C-04 Article SoT `category Ref<C-22>` required 정합.
docs/decisions/EAT_CONTENT_PLAN.md:193:### 2.3 C-24 `publication` 신규 table (EC-SCHEMA-08)
docs/decisions/EAT_CONTENT_PLAN.md:203:  authors JSONB NOT NULL,                       -- cycle 1 ECP-18 정정: DEFAULT 제거. authors min 1 CHECK 와 정합
docs/decisions/EAT_CONTENT_PLAN.md:249:- (EC-SCHEMA-09 · cycle 1 ECP-18 정정) `authors JSONB NOT NULL` (DEFAULT 제거) — `authors[]` min 1 CHECK 정합. INSERT 시 필수.
docs/decisions/EAT_CONTENT_PLAN.md:250:- (EC-SCHEMA-10) `risk_level='Low'` CHECK 고정 — Publication 외부 인용 entity, Low 외 등급 불필요. EC-DEFER-07 까지.
docs/decisions/EAT_CONTENT_PLAN.md:252:### 2.4 C-25 `media_appearance` 신규 table (EC-SCHEMA-11) — cycle 1 ECP-05 정합
docs/decisions/EAT_CONTENT_PLAN.md:307:- (EC-SCHEMA-12 · cycle 1 ECP-05 정합) `media_channel_type` enum 4종 (broadcast/youtube/podcast/press) — DB column 자체는 4종 모두 허용. **JSON-LD `@type` 매핑은 v0.1 단계 모든 4종 → `VideoObject` 단일화**. fragment 도 `#video-{slug}` 단일. BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1 cascade).
docs/decisions/EAT_CONTENT_PLAN.md:309:### 2.5 C-12 `faq` 풀명세 합류 신규 table (EC-SCHEMA-13)
docs/decisions/EAT_CONTENT_PLAN.md:322:  related_treatment_id UUID,                    -- C-12 SoT 풀명세 · v0.1 nullable (EC-DEFER-09 와 함께 다음 cycle)
docs/decisions/EAT_CONTENT_PLAN.md:327:  compliance_record_id UUID,                     -- compliance-assistant 합류 시 ref (EC-DEFER-05)
docs/decisions/EAT_CONTENT_PLAN.md:335:  CONSTRAINT faq_status_v01_limit CHECK (status = 'draft'),  -- cycle 1 ECP-10·11 정정: v0.1 published 차단
docs/decisions/EAT_CONTENT_PLAN.md:364:- (EC-SCHEMA-14 · cycle 1 ECP-10·11 정정) v0.1 단계 `status='draft'` + `published_at IS NULL` CHECK 강제 — **published 자체 차단**. compliance-assistant + risk_level 자동 추론 합류 (EC-DEFER-05) 까지. LegalDocument LL-SCHEMA-03·LL-SCHEMA-04 패턴 정합.
docs/decisions/EAT_CONTENT_PLAN.md:365:- (EC-SCHEMA-15) C-12 SoT 의 `relatedTreatment` · `relatedCondition` 필드 — DB nullable column 추가. v0.1 어드민 UI 미노출 (EC-DEFER-09 와 함께 다음 cycle).
docs/decisions/EAT_CONTENT_PLAN.md:367:### 2.6 D0014 GRANT 확장 (EC-SCHEMA-16) — cycle 1 ECP-16 정정
docs/decisions/EAT_CONTENT_PLAN.md:370:-- packages/db/migrations/D0014_public_reader_eat.sql (EC-CASCADE-05)
docs/decisions/EAT_CONTENT_PLAN.md:400:--   LegalDocument 패턴 정합 (LOCATION_LEGAL § 3.2 PSR-DATA-07).
docs/decisions/EAT_CONTENT_PLAN.md:410:- (EC-SCHEMA-17) ArticleCategory taxonomy public — instance_id only RLS. 분류 자체는 status 없음. 운영 중 추가한 카테고리는 즉시 public_reader 에 노출. **본 결정의 정당성**: 카테고리는 콘텐츠 카탈로그 (Article/Faq 의 분류) — 자체 콘텐츠 게시는 아님. URL `/<slug>/insights/<category>/...` 가 작동하려면 모든 카테고리가 lookup 가능해야. status 게이트는 분류 미사용 단계에서도 article URL routing 차단 → 운영 부담. EC-DEFER-10 phase 의 어드민 UI 합류 시 `active` flag 추가 cascade.
docs/decisions/EAT_CONTENT_PLAN.md:412:## 3. C-10 contentType enum cascade (EC-CASCADE-01 일부) — cycle 1 ECP-07 정정
docs/decisions/EAT_CONTENT_PLAN.md:414:DATA_MODEL § 4 C-10 `contentType` enum 확장:
docs/decisions/EAT_CONTENT_PLAN.md:421:- (EC-CONTENT-04 · cycle 1 ECP-07 정정) audit emit `content-saved` payload 의 `contentType` 토큰 = SoT enum 그대로. FAQ 는 대문자 `FAQ`. Publication/MediaAppearance 는 PascalCase. ArticleCategory 도 PascalCase 기존.
docs/decisions/EAT_CONTENT_PLAN.md:422:- (EC-CONTENT-05) ComplianceRecord (C-10) 의 `contentType` enum 확장 cascade.
docs/decisions/EAT_CONTENT_PLAN.md:426:### 4.1 4 entity CRUD 구조 (EC-FORM-01)
docs/decisions/EAT_CONTENT_PLAN.md:435:### 4.2 status zod enum subset — cycle 1 ECP-10·11 정정 (EC-FORM-02)
docs/decisions/EAT_CONTENT_PLAN.md:439:const statusSchema = z.enum(['draft']);  // EC-DEFER-12 까지 — compliance-assistant + risk 자동 추론 합류 시점
docs/decisions/EAT_CONTENT_PLAN.md:442:- mapDbErrorToResult 안 `faq_status_v01_limit` · `faq_published_at_null_v01` 매핑 — formError "FAQ 발행은 compliance-assistant + 위험도 자동 추론 합류 후 가능합니다 (EC-DEFER-05·12)".
docs/decisions/EAT_CONTENT_PLAN.md:443:- Publication / MediaAppearance 도 v0.1 단계 `status='draft'` 만 (DB CHECK 없이 form schema 만 — 향후 운영자가 직접 published 가능 marker EC-DEFER-12). 두 entity 의 외부 인용 자체는 risk Low fixed 이지만 v0.1 단계 통일 정책.
docs/decisions/EAT_CONTENT_PLAN.md:445:### 4.3 zod schema 통합 SoT (EC-FORM-03)
docs/decisions/EAT_CONTENT_PLAN.md:453:### 4.4 server action 패턴 (EC-FORM-04)
docs/decisions/EAT_CONTENT_PLAN.md:460:### 4.5 dashboard cascade (EC-FORM-05)
docs/decisions/EAT_CONTENT_PLAN.md:464:## 5. 공개 페이지 렌더 결정 — cycle 1 ECP-06·13·15·17 정정
docs/decisions/EAT_CONTENT_PLAN.md:466:### 5.1 P-011 FAQ 신규 페이지 (EC-RENDER-01) — PSR-DEFER-11 부분 해소
docs/decisions/EAT_CONTENT_PLAN.md:469:- 데이터: `faq` published row (RLS 자동 — v0.1 단계 0 row 가능 · cycle 1 ECP-21 정정)
docs/decisions/EAT_CONTENT_PLAN.md:471:- **빈 페이지 처리 (cycle 1 ECP-21)**: 0 row 인 경우도 페이지 200 (404 아님) — sitemap.xml 포함 유지. 빈 상태 UI 표시 ("자주 묻는 질문이 아직 등록되지 않았습니다").
docs/decisions/EAT_CONTENT_PLAN.md:472:- JSON-LD: schema.org `FAQPage` + `Question`/`Answer` array (cycle 1 ECP-19 정정 — `renderMarkdownToPlainText` helper 사용). 0 row 면 `mainEntity: []` 빈 array 출력.
docs/decisions/EAT_CONTENT_PLAN.md:476:### 5.2 Doctor Profile (P-004) 확장 — graph 안 풀 entity 출력 (EC-RENDER-02) — cycle 1 ECP-06·13 정정
docs/decisions/EAT_CONTENT_PLAN.md:482:**JSON-LD graph 결정 (cycle 1 ECP-06·13 정정)**:
docs/decisions/EAT_CONTENT_PLAN.md:490:### 5.3 About (P-002) 확장 — MedicalClinic.subjectOf 단일 결정 (EC-RENDER-03) — cycle 1 ECP-15 정정
docs/decisions/EAT_CONTENT_PLAN.md:496:**JSON-LD graph 결정 (cycle 1 ECP-15 정정)**:
docs/decisions/EAT_CONTENT_PLAN.md:502:### 5.4 Article URL `[category]` 실 DB join — PSR-DEFER-15 해소 (EC-RENDER-04) — cycle 1 ECP-17 정정
docs/decisions/EAT_CONTENT_PLAN.md:518:### 5.5 Markdown helper 2 종 (EC-RENDER-05) — cycle 1 ECP-19 정정
docs/decisions/EAT_CONTENT_PLAN.md:527:### 5.6 sitemap.xml 확장 (EC-RENDER-06) — cycle 1 ECP-21 정정
docs/decisions/EAT_CONTENT_PLAN.md:529:- P-011 `/<slug>/faq` 추가 — changefreq `monthly` · priority `0.5` (SEARCH_STANDARDIZATION § 4.3 정합).
docs/decisions/EAT_CONTENT_PLAN.md:531:- Publication / MediaAppearance 별도 페이지 없음 — sitemap 미추가 (EC-DEFER-02).
docs/decisions/EAT_CONTENT_PLAN.md:532:- Article URL: 실 category slug 사용 (EC-RENDER-04 정합).
docs/decisions/EAT_CONTENT_PLAN.md:534:### 5.7 외부 링크 rel 통일 (EC-RENDER-07) — cycle 1 ECP-20 정정
docs/decisions/EAT_CONTENT_PLAN.md:538:## 6. SCHEMA_MAPPING 결정 — cycle 1 ECP-05·06·13·14·15 정정 (EC-CASCADE-02)
docs/decisions/EAT_CONTENT_PLAN.md:561:### 6.2 VideoObject entity (MediaAppearance — 4 channel_type 모두) — cycle 1 ECP-05·14 정정 (단일화)
docs/decisions/EAT_CONTENT_PLAN.md:577:**결정 (cycle 1 ECP-05·14 정정)**: 모든 4 channel_type (broadcast/youtube/podcast/press) → `VideoObject` 단일. fragment `#video-{slug}` 일관. allowlist 미사용 (모든 entity graph 안). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1 cascade).
docs/decisions/EAT_CONTENT_PLAN.md:579:### 6.3 FAQPage (P-011) — cycle 1 ECP-19 정합
docs/decisions/EAT_CONTENT_PLAN.md:600:### 6.4 페이지별 graph 매트릭스 (EC-SEO-01)
docs/decisions/EAT_CONTENT_PLAN.md:602:| 페이지 | graph entities (cycle 1 ECP-06·13·15 정정 — graph self-contained · cross-page allowlist 미사용) |
docs/decisions/EAT_CONTENT_PLAN.md:606:| P-011 FAQ | `[풀] Organization` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] FAQPage` (with Question[] inline `mainEntity`) |
docs/decisions/EAT_CONTENT_PLAN.md:609:- (EC-SEO-02 · cycle 1 ECP-06 정정) 모든 page 의 graph 가 self-contained — Publication/Media 가 표시되는 페이지에 풀 entity 출력. cross-page allowlist 사용 안 함.
docs/decisions/EAT_CONTENT_PLAN.md:610:- (EC-SEO-03 · cycle 1 ECP-13 정정) `@id` 패턴 — fragment-scoped (page URL + fragment). v0.1 단계 별도 페이지 미생성이지만 `@id` 가 페이지 URL 안 anchor 로 dereferenceable (browser 가 page fragment scroll 처리).
docs/decisions/EAT_CONTENT_PLAN.md:611:- (EC-SEO-04 · cycle 1 ECP-15 정정) About 페이지의 publication/media reference 는 단일 결정 — `MedicalClinic.subjectOf`. Organization 미사용.
docs/decisions/EAT_CONTENT_PLAN.md:613:## 7. CONTENT_STANDARDS 결정 — cycle 1 ECP-07 정합 (EC-CASCADE-03)
docs/decisions/EAT_CONTENT_PLAN.md:615:`docs/core/CONTENT_STANDARDS.md` § 7.1.1.x ContentType 예외 표 확장 (DATA_MODEL C-10 contentType enum cascade 정합):
docs/decisions/EAT_CONTENT_PLAN.md:621:| `FAQ` Q | **적용** | **적용** (의료법 광고 표현 검수) | **적용** (compliance-assistant 합류 시 · EC-DEFER-05) | **적용** (Medium/High 자동 추론) |
docs/decisions/EAT_CONTENT_PLAN.md:626:- (EC-CONTENT-01) Publication/MediaAppearance 면제 — 외부 인용. 클리닉 자체 권고 아님.
docs/decisions/EAT_CONTENT_PLAN.md:627:- (EC-CONTENT-02) FAQ 적용 — 클리닉 자체 답변 → 의료법 광고 표현 검수. RiskInference Medium/High 자동 (RISK_LEVELS § 2 정합).
docs/decisions/EAT_CONTENT_PLAN.md:628:- (EC-CONTENT-03) ArticleCategory taxonomy — 룰 없음.
docs/decisions/EAT_CONTENT_PLAN.md:632:- `packages/db/migrations/D0014_public_reader_eat.sql` (신규 · EC-CASCADE-05)
docs/decisions/EAT_CONTENT_PLAN.md:637:- `packages/core-content/migrations/C0013_article_category_fk.sql` (신규 · staged migration 4 step · cycle 1 ECP-03·09 정합)
docs/decisions/EAT_CONTENT_PLAN.md:638:- `apps/web/src/seed.ts` patch — instance 생성 시 default `general` ArticleCategory row 자동 INSERT (EC-SCHEMA-03)
docs/decisions/EAT_CONTENT_PLAN.md:639:- `packages/migrations-runner/src/manifest.ts` patch — **16 단계 (현 10 + 6 신규)** — cycle 1 ECP-04 정정:
docs/decisions/EAT_CONTENT_PLAN.md:644:## 9. § 8.1 시나리오 cascade (PUBLIC_SITE_RENDER v1.0 § 7 + 본 plan 신규)
docs/decisions/EAT_CONTENT_PLAN.md:648:| 24 | publication published 1행 (author_doctor_id 매칭) → Doctor Profile 안 인용 카드 1건 | external link `rel="nofollow noopener noreferrer"` (cycle 1 ECP-20 정합) |
docs/decisions/EAT_CONTENT_PLAN.md:649:| 25 | media_appearance youtube 1행 → Doctor Profile thumbnail + ISO duration `PT{seconds}S` | duration_seconds=3720 → `PT3720S` (cycle 1 ECP-30 정합) |
docs/decisions/EAT_CONTENT_PLAN.md:650:| 26 | FAQ — v0.1 단계 published 차단 검증 | `INSERT ... status='published'` 시도 → CHECK `faq_status_v01_limit` 위반 (cycle 1 ECP-10·11 정합) |
docs/decisions/EAT_CONTENT_PLAN.md:652:| 28 | article.category_id = `general` ArticleCategory.id · URL `/<slug>/insights/general/<article-slug>` → 200 (DB join) | PSR-DEFER-15 해소 (cycle 1 ECP-17 정합) |
docs/decisions/EAT_CONTENT_PLAN.md:660:| 36 | ArticleCategory 운영 중 신규 INSERT → public_reader 즉시 SELECT (status 게이트 없음) | EC-SCHEMA-17 결정 정합 |
docs/decisions/EAT_CONTENT_PLAN.md:667:| 2 | C0010 publication migration (cycle 1 ECP-18 — DEFAULT 제거) | C0010_publication.sql |
docs/decisions/EAT_CONTENT_PLAN.md:669:| 4 | C0012 faq migration (cycle 1 ECP-10·11 — status='draft' CHECK + published_at IS NULL CHECK) | C0012_faq.sql |
docs/decisions/EAT_CONTENT_PLAN.md:670:| 5 | C0013 article.category_id staged migration 4 step (cycle 1 ECP-03·09) | C0013_article_category_fk.sql (ADD COLUMN nullable + default category seed + backfill + SET NOT NULL + FK) |
docs/decisions/EAT_CONTENT_PLAN.md:671:| 6 | D0014 public_reader_eat GRANT + per-table policy (cycle 1 ECP-16) | packages/db/migrations/D0014_public_reader_eat.sql |
docs/decisions/EAT_CONTENT_PLAN.md:673:| 8 | zod schema 통합 SoT (cycle 1 ECP-08 — DOI regex DB 동일 anchored · ECP-11 — status enum subset) | apps/web/src/lib/eat-content-schema.ts |
docs/decisions/EAT_CONTENT_PLAN.md:678:| 13 | JSON-LD entity 추가 (cycle 1 ECP-05·06·13·14·15 정합) | apps/web/src/lib/json-ld/entities.ts (scholarlyArticleEntity · videoObjectEntity · faqPageEntity · questionEntity) |
docs/decisions/EAT_CONTENT_PLAN.md:680:| 15 | (rule checker 변경 없음 — graph self-contained · allowlist 확장 불필요 · cycle 1 ECP-06·14 정정 결과) | (validate.ts 변경 없음) |
docs/decisions/EAT_CONTENT_PLAN.md:681:| 16 | P-011 FAQ public page (cycle 1 ECP-21 — 빈 페이지도 200) | apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx + metadata + JsonLdScript |
docs/decisions/EAT_CONTENT_PLAN.md:684:| 19 | Article URL `[category]` 실 DB join (cycle 1 ECP-17 — PSR-DEFER-15 해소) | insights/[category]/[slug]/page.tsx — SQL JOIN article_category |
docs/decisions/EAT_CONTENT_PLAN.md:685:| 20 | sitemap.xml 확장 — P-011 FAQ entry + article URL 실 category slug | (site)/[instanceSlug]/sitemap.xml/route.ts |
docs/decisions/EAT_CONTENT_PLAN.md:687:| 22 | seed 안 default `general` article_category row 자동 INSERT (cycle 1 ECP-09) | apps/web/src/seed.ts |
docs/decisions/EAT_CONTENT_PLAN.md:688:| 23 | manifest **16 단계** patch (cycle 1 ECP-04 정정) | packages/migrations-runner/src/manifest.ts |
docs/decisions/EAT_CONTENT_PLAN.md:689:| 24 | Markdown plain text helper 신규 (cycle 1 ECP-19) | apps/web/src/lib/markdown.ts (`renderMarkdownToPlainText`) |
docs/decisions/EAT_CONTENT_PLAN.md:690:| 25 | vitest scenario 24~36 추가 (자동 검증 가능 부분) | apps/web/src/lib/json-ld/__tests__/validate.test.ts + db-projection.test.ts + markdown.test.ts |
docs/decisions/EAT_CONTENT_PLAN.md:691:| 26 | docs cascade — DATA_MODEL § 1.1 인벤토리 25 contracts · § 4 C-10 enum +2 · C-12 풀명세 · C-22 풀명세 컬럼 정합 · C-24 Publication · C-25 MediaAppearance 풀명세 (EC-CASCADE-01) · SCHEMA_MAPPING § 2 entity 카탈로그 · § 3 P-011 (EC-CASCADE-02) · CONTENT_STANDARDS § 7.1.1.x (EC-CASCADE-03) · PSR-DEFER-11/15 해소 marker (EC-CASCADE-07) · M0_BUILD_EXPORT § 2.1 (EC-CASCADE-04) · PAGE_TYPES § 1.1 P-011 M0 ✅ + § 3 본문 (EC-CASCADE-08 acceptance precondition — cycle 1 ECP-12 격상) · ARCH § 3 Vertical Slice 정합 (EC-CASCADE-09 — 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ) | doc patches |
docs/decisions/EAT_CONTENT_PLAN.md:696:- `EC-DEFER-01`: Inquiry (1:1 상담 게시판) — PIPA + 회원 인증 결정.
docs/decisions/EAT_CONTENT_PLAN.md:697:- `EC-DEFER-08`: Reviews/Pricing High-risk commercial 페이지.
docs/decisions/EAT_CONTENT_PLAN.md:700:- `EC-DEFER-02`: Publication / MediaAppearance 별도 페이지.
docs/decisions/EAT_CONTENT_PLAN.md:701:- `EC-DEFER-03`: DOI 자동 메타데이터 fetch (CrossRef API).
docs/decisions/EAT_CONTENT_PLAN.md:702:- `EC-DEFER-04`: 동영상 embed (YouTube iframe + CSP).
docs/decisions/EAT_CONTENT_PLAN.md:703:- `EC-DEFER-06`: FAQ 다국어.
docs/decisions/EAT_CONTENT_PLAN.md:704:- `EC-DEFER-09`: FAQ.metadata.featuredOnHome + related Treatment/Condition UI.
docs/decisions/EAT_CONTENT_PLAN.md:705:- `EC-DEFER-10`: ArticleCategory 풀명세 column (parentCategory/pillar/coverImageUrl/seoMeta/articleTypeDefault) 어드민 UI/공개 렌더.
docs/decisions/EAT_CONTENT_PLAN.md:706:- `EC-DEFER-11` (cycle 1 ECP-05 정정): MediaAppearance channel_type 별 schema.org `@type` 분기 (broadcast → BroadcastEvent · press → NewsArticle).
docs/decisions/EAT_CONTENT_PLAN.md:709:- `EC-DEFER-05`: FAQ 자동 검수 (compliance-assistant + RiskRule + RiskInference).
docs/decisions/EAT_CONTENT_PLAN.md:710:- `EC-DEFER-07`: 4 entity status='review-queued' 전이 + ComplianceRecord pre-publish.
docs/decisions/EAT_CONTENT_PLAN.md:711:- `EC-DEFER-12` (cycle 1 ECP-10·11 정정): 4 entity 어드민 published 발행 — EC-DEFER-05 합류 시점.
docs/decisions/EAT_CONTENT_PLAN.md:715:- `EC-CASCADE-01`: `docs/core/DATA_MODEL.md` patches:
docs/decisions/EAT_CONTENT_PLAN.md:716:  - § 1.1 인벤토리 25 contracts (+ C-24 Publication, C-25 MediaAppearance) · C-12 FAQ M0 ✅ · C-22 ArticleCategory M0 ✅ · C-24/25 row 추가.
docs/decisions/EAT_CONTENT_PLAN.md:717:  - § 4 C-10 `contentType` enum +2 (Publication, MediaAppearance) v0.6.
docs/decisions/EAT_CONTENT_PLAN.md:718:  - § 4 C-12 FAQ 간략 명세 → 풀명세 (question 10~200, answer 50~2000 Markdown · category Ref<C-22> optional · relatedTreatment optional · authorDoctor optional · status content_publication_status · riskLevel C-05 default Low).
docs/decisions/EAT_CONTENT_PLAN.md:719:  - § 4 C-22 ArticleCategory — v0.1 DB 컬럼 정합 marker (parentCategory · pillar · coverImageUrl · seoMeta · articleTypeDefault 모두 optional · v0.1 UI 미사용 EC-DEFER-10).
docs/decisions/EAT_CONTENT_PLAN.md:720:  - § 4 C-24 Publication 풀명세 신규.
docs/decisions/EAT_CONTENT_PLAN.md:721:  - § 4 C-25 MediaAppearance 풀명세 신규.
docs/decisions/EAT_CONTENT_PLAN.md:722:  - § 4 C-04 Article `category` required SoT 정합 — DB NOT NULL 전환 marker.
docs/decisions/EAT_CONTENT_PLAN.md:723:- `EC-CASCADE-02`: `docs/core/SCHEMA_MAPPING.md` patches:
docs/decisions/EAT_CONTENT_PLAN.md:724:  - § 1.2 `@id` 패턴 (ScholarlyArticle · VideoObject — fragment-scoped 운영) v0.1.
docs/decisions/EAT_CONTENT_PLAN.md:725:  - § 2 entity 카탈로그 — ScholarlyArticle · VideoObject (모든 channel_type) · FAQPage · Question · Answer 추가.
docs/decisions/EAT_CONTENT_PLAN.md:726:  - § 3 P-011 FAQ graph + P-002/P-004 graph 확장 (ScholarlyArticle/VideoObject 풀 entity).
docs/decisions/EAT_CONTENT_PLAN.md:727:- `EC-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7.1.1.x ContentType 예외 표 — Publication/MediaAppearance 면제 · FAQ Q/A 적용.
docs/decisions/EAT_CONTENT_PLAN.md:728:- `EC-CASCADE-04`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2.1 SSR 재사용 표 — 신규 4 entity (article_category · publication · media_appearance · faq) Git output 변환 marker.
docs/decisions/EAT_CONTENT_PLAN.md:729:- `EC-CASCADE-05`: `packages/db/migrations/D0014_public_reader_eat.sql` 신규 — D0011 per-table GRANT/policy 패턴 정합.
docs/decisions/EAT_CONTENT_PLAN.md:730:- `EC-CASCADE-06`: `packages/migrations-runner/src/manifest.ts` — 16 단계 (cycle 1 ECP-04 정정) + 각 entry 의 dependsOn 명시.
docs/decisions/EAT_CONTENT_PLAN.md:731:- `EC-CASCADE-07`: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` — PSR-DEFER-11 부분 (FAQ) + PSR-DEFER-15 (Article category) 해소 marker.
docs/decisions/EAT_CONTENT_PLAN.md:732:- `EC-CASCADE-08` (cycle 1 ECP-12 정정 — acceptance precondition 격상): `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ M0 ✅ + § 3 P-011 본문 작성 (질문 위계 + AEO 친화).
docs/decisions/EAT_CONTENT_PLAN.md:733:- `EC-CASCADE-09` (cycle 1 ECP-22 정정): `docs/admin/ARCHITECTURE.md` § 3 Slice 페이지 합계 = **11페이지** (기존 9 + P-010 1샘플 + P-011 FAQ). ArticleCategory 는 어드민 운영 routing 추가지만 공개 페이지 count 에는 포함 안 됨 (Article URL prefix 만 변경).
docs/decisions/EAT_CONTENT_PLAN.md:740:| 2026-05-18 | **v1.0** | **Codex 비평 cycle 6 0 findings 확정 acceptance** — closeableAfterPatch=true. 수렴 추세 22 → 8 → 3 → 2 → 1 → 0. blocking 0 · major 0 · minor 0 잔존. 누계 6 cycle 36 findings 전건 수용. acceptance commit 9 cascade docs 동시 포함 (EC-CASCADE-01·02·03·04·06·07·08·09 + plan 본문). EC-CASCADE-05 (D0014 마이그레이션 실 SQL) 는 EAT_CONTENT code v1.0 cycle 분리. |
docs/decisions/EAT_CONTENT_PLAN.md:741:| 2026-05-18 | v0.6 | **Codex 비평 cycle 5 1 major finding 전건 수용 patch — ARCH § 3.8.2 cascade**: (ECP-36) ARCH § 3.8.2 LegalDocument 자동 생성 규칙 "어드민 폼 처리" 안 "어드민 화면 수 6개 유지" 잔재 → "P-013 자체 화면 없음 + M0 어드민 7개 (EAT v0.x cascade)". 누계 cycle 1~5 = 36 findings 전건 수용. closeableAfterPatch=true 신호 (cycle 6 acceptance 신호 검증). |
docs/decisions/EAT_CONTENT_PLAN.md:742:| 2026-05-18 | v0.5 | **Codex 비평 cycle 4 2 findings (0 blocking + 1 major + 1 minor) 전건 수용 patch — ARCH § 3.8 cascade**: (ECP-34 major) ARCH § 3.8 표 "9종 + Article 1샘플 = 10개 페이지" → "10종 + Article 1샘플 = 11개 페이지" — P-011 FAQ row 추가 + P-002 About / P-004 Doctor Profile EAT v0.x Publication/MediaAppearance inline marker + 어드민 화면 수 6→7. (ECP-35 minor) PAGE_TYPES P-013/P-014 상세 "M0 어드민 화면 수 6개 유지" → "P-013/P-014 자체 화면 없음 (§ 6 어드민 7개 = 기존 6 + Faq 신규)". 누계 cycle 1+2+3+4 = 35 findings 전건 수용. closeableAfterPatch=true 신호 (다음 cycle 5 acceptance 신호 검증). |
docs/decisions/EAT_CONTENT_PLAN.md:743:| 2026-05-18 | v0.4 | **Codex 비평 cycle 3 3 findings (0 blocking + 1 major + 2 minor) 전건 수용 patch — PAGE_TYPES 내부 SoT 통일 + DATA_MODEL 한 페이지 요약 cascade**: (ECP-31 major) PAGE_TYPES § 5 matrix + § 6 목록 + 합류 우선순위 — P-011 FAQ M0 ✅ 일관 (§ 5 matrix 행 patch · § 6 페이지 #10 추가 + 어드민 화면 수 6→7 · 우선순위 P-011 strike-through). (ECP-32 minor) DATA_MODEL § 0 한 페이지 요약 "23개 계약 (C-01~C-23)" → "25개 계약 (C-01~C-25)". (ECP-33 minor) DATA_MODEL § 관계 다이어그램 ComplianceRecord contentRef 대상 범위 "C-01~C-22" → "C-01~C-25" — C-24 Publication · C-25 MediaAppearance 포함. 누계 cycle 1+2+3 = 33 findings 전건 수용. closeableAfterPatch=true 신호 (다음 cycle 4 acceptance 신호 검증). |
docs/decisions/EAT_CONTENT_PLAN.md:744:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 8 findings (4 blocking + 4 major + 0 minor) 전건 수용 patch — docs cascade 실 patch 진입**: (ECP-23·24·25·26 blocking 4건 + ECP-27·28·29·30 major 4건) plan 본문 명시한 docs cascade 가 실 patch 안 됨 — plan acceptance commit 안 docs cascade 동시 적용 결정 (LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합). 본 patch 사이클에서 다음 실 적용: (1) DATA_MODEL § 1.1 인벤토리 23 → 25 contracts + C-24 Publication · C-25 MediaAppearance row 추가 + C-12 FAQ M0 ✅ + C-04 Article category required 명시. (2) DATA_MODEL § 4 C-10 contentType enum v0.6 — +Publication +MediaAppearance (17종). (3) DATA_MODEL § 4 C-22 ArticleCategory marker (DB 실 운영 합류 marker + EC-DEFER-10). (4) DATA_MODEL § 4 C-12 FAQ 풀명세 (question 10~200 · answer Markdown 50~2000 · v0.1 DB CHECK draft 만). (5) DATA_MODEL § 4 C-24 Publication 풀명세 (외부 학술 인용 · risk Low fixed). (6) DATA_MODEL § 4 C-25 MediaAppearance 풀명세 (모든 channel_type → VideoObject 단일화 v0.1). (7) PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 페이지 합계 11. (8) SCHEMA_MAPPING § 2 entity 카탈로그 — ScholarlyArticle 추가 · VideoObject MediaAppearance 매핑 추가 · FAQPage EAT v0.x M0 합류 + Answer.text helper marker. (9) CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 — Publication/MediaAppearance 면제 + FAQ Q/A 적용. (10) ARCH § 3.11 게이트 #1 — 11 페이지 + P-011 FAQ 합류. (11) M0_BUILD_EXPORT § 2.2 EAT 4 entity 변환 표. (12) PUBLIC_SITE_RENDER § 9.3 PSR-DEFER-11/15 해소 marker. (13) packages/migrations-runner/src/manifest.ts orderedMigrations 16 entry (C0009/10/11/12/13 + D0014). 코드 cascade (migrations 실 SQL · 어드민 폼 · Article detail SQL JOIN 등) 는 별도 EAT_CONTENT code v1.0 cycle. 누계 cycle 1+2 = 30 findings 전건 수용. |
docs/decisions/EAT_CONTENT_PLAN.md:745:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 22 findings (7 blocking + 10 major + 5 minor) 전건 수용 patch**: (ECP-01) C-24/25 Publication/MediaAppearance · C-12 FAQ 풀명세 합류 · C-22 ArticleCategory 실 운영 합류 — DATA_MODEL 인벤토리 25 contracts. (ECP-02) C-22 풀명세 컬럼 전체 DB 추가 (v0.1 UI minimal · EC-DEFER-10). (ECP-03) Article.category_id staged 4-step migration (ADD nullable + seed + backfill + SET NOT NULL). (ECP-04) manifest 16단계 + 각 dependsOn 명시. (ECP-05·14) MediaAppearance 모든 channel_type → VideoObject 단일화 · fragment `#video-{slug}` 단일 · BroadcastEvent/NewsArticle 분기는 EC-DEFER-11. (ECP-06) Doctor/About graph self-contained — Publication/Media 풀 entity 출력. cross-page allowlist 미사용. (ECP-07) C-10 contentType enum +Publication +MediaAppearance v0.6 cascade. FAQ 토큰 대문자 통일. (ECP-08) DOI regex DB·zod 동일 anchored. (ECP-09) default `general` ArticleCategory seed = seed.ts + C0013 마이그레이션 backfill. (ECP-10·11) v0.1 단계 4 entity 어드민 status='draft' 강제 — FAQ DB CHECK + zod enum subset. EC-DEFER-12 신설. (ECP-12) PAGE_TYPES P-011 M0 ✅ — EC-CASCADE-08 acceptance precondition 격상. (ECP-13) Publication/Media `@id` fragment-scoped (Doctor/About page URL + fragment). (ECP-15) About publication/media reference 는 MedicalClinic.subjectOf 단일 결정. (ECP-16) ArticleCategory taxonomy public 의도 명시 — status 게이트 없음 + EC-DEFER-10. (ECP-17) Article detail SQL JOIN article_category · category.slug 매칭 작업 명시. (ECP-18) `authors` DEFAULT 제거. (ECP-19) `renderMarkdownToPlainText` helper 신규 — JSON-LD Answer.text. (ECP-20) external link rel `nofollow noopener noreferrer` 통일. (ECP-21) FAQ 빈 페이지 200 + sitemap 포함 + lastmod fallback. (ECP-22) Slice 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ. |

 succeeded in 626ms:
apps/web/src\seed.ts
packages/core-content\src\index.ts
packages/core-content\src\schema.ts
packages/db\src\index.ts
packages/db\src\errors.ts
packages/migrations-runner\src\index.ts
packages/db\migrations\D0014_public_reader_eat.sql
apps/web/src\lib\markdown.ts
apps/web/src\lib\markdown.test.ts
packages/core-content\migrations\C0013_article_category_fk.sql
packages/core-content\migrations\C0012_faq.sql
packages/core-content\migrations\C0011_media_appearance.sql
packages/core-content\migrations\C0010_publication.sql
packages/core-content\migrations\C0009_article_category.sql
packages/core-content\src\templates\index.ts
apps/web/src\lib\db-projection.ts
apps/web/src\lib\db-projection.test.ts
apps/web/src\lib\clinic-profile-schema.ts
apps/web/src\lib\eat-content-schema.ts
apps/web/src\lib\errors.ts
apps/web/src\components\forms\ArticleForm.tsx
apps/web/src\components\forms\ArticleCategoryForm.tsx
apps/web/src\components\forms\MediaAppearanceForm.tsx
apps/web/src\components\forms\FaqForm.tsx
apps/web/src\components\forms\PublicationForm.tsx
apps/web/src\lib\json-ld\JsonLdScript.tsx
apps/web/src\lib\json-ld\entities.ts
apps/web/src\lib\json-ld\builders.ts
apps/web/src\lib\json-ld\types.ts
apps/web/src\app\(admin)\layout.tsx
apps/web/src\lib\json-ld\__tests__\eat-validate.test.ts
apps/web/src\lib\json-ld\__tests__\validate.test.ts
apps/web/src\lib\json-ld\__tests__\validate.ts
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\page.tsx
apps/web/src\app\(admin)\admin\[instanceSlug]\clinic-profile\actions.ts
apps/web/src\app\(admin)\admin\[instanceSlug]\categories\actions.ts
apps/web/src\app\(admin)\admin\[instanceSlug]\categories\page.tsx
apps/web/src\app\(site)\[instanceSlug]\sitemap.xml\route.ts
apps/web/src\app\(admin)\admin\[instanceSlug]\media-appearances\actions.ts
apps/web/src\app\(admin)\admin\[instanceSlug]\media-appearances\page.tsx
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\[slug]\page.tsx
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\page.tsx
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\actions.ts
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\[slug]\page.tsx
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\page.tsx
apps/web/src\app\(admin)\admin\[instanceSlug]\categories\new\page.tsx
apps/web/src\app\(admin)\admin\[instanceSlug]\categories\[slug]\page.tsx
apps/web/src\app\(admin)\admin\[instanceSlug]\page.tsx
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\actions.ts
apps/web/src\app\(admin)\admin\[instanceSlug]\media-appearances\new\page.tsx
apps/web/src\app\(admin)\admin\[instanceSlug]\faqs\actions.ts
apps/web/src\app\(admin)\admin\[instanceSlug]\faqs\page.tsx
apps/web/src\app\(admin)\admin\[instanceSlug]\doctors\new\page.tsx
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\page.tsx
apps/web/src\app\(admin)\admin\[instanceSlug]\media-appearances\[slug]\page.tsx
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\actions.ts
apps/web/src\app\(admin)\admin\[instanceSlug]\treatments\new\page.tsx
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx
apps/web/src\app\(admin)\admin\[instanceSlug]\publications\actions.ts
apps/web/src\app\(admin)\admin\[instanceSlug]\faqs\[slug]\page.tsx
apps/web/src\app\(admin)\admin\[instanceSlug]\publications\page.tsx
apps/web/src\app\(admin)\admin\[instanceSlug]\faqs\new\page.tsx
apps/web/src\app\(admin)\admin\[instanceSlug]\articles\new\page.tsx
apps/web/src\app\(admin)\admin\[instanceSlug]\publications\[slug]\page.tsx
apps/web/src\app\(admin)\admin\[instanceSlug]\publications\new\page.tsx

codex
SoT 상으로 핵심은 “draft-only 신규 엔티티”, “FAQ public page는 빈 상태 200”, “JSON-LD self-contained”, “article category는 DB join”입니다. 이제 SQL과 actions 쪽에서 원자성/정책이 실제로 맞는지 먼저 좁혀 보겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content packages/core-content/migrations/C0009_article_category.sql | Select-Object -First 240' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content packages/core-content/migrations/C0010_publication.sql | Select-Object -First 260' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content packages/core-content/migrations/C0011_media_appearance.sql | Select-Object -First 260' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content packages/core-content/migrations/C0012_faq.sql | Select-Object -First 260' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content packages/core-content/migrations/C0013_article_category_fk.sql | Select-Object -First 240' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content packages/db/migrations/D0014_public_reader_eat.sql | Select-Object -First 260' in C:\Users\assag\solution\website-exposure
 succeeded in 866ms:
-- @glitzy/core-content — C0009 ArticleCategory (DATA_MODEL C-22·EAT_CONTENT_PLAN v1.0 § 2.1)
-- EC-SCHEMA-01·02·04·17: C-22 풀명세 컬럼 전체 추가. v0.1 어드민 UI minimal — slug·name·displayOrder 만 노출.
-- parentCategory·pillar·coverImageUrl·seoMeta·articleTypeDefault 는 DB 컬럼만 존재 + EC-DEFER-10 marker.
-- Precondition: D0010 instance

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
  CONSTRAINT article_category_name_length CHECK (length(name) BETWEEN 1 AND 50),
  CONSTRAINT article_category_description_length CHECK (
    description IS NULL OR length(description) BETWEEN 80 AND 200
  ),
  CONSTRAINT article_category_cover_image_url_format CHECK (
    cover_image_url IS NULL OR cover_image_url ~ '^https?://'
  ),
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

CREATE POLICY tenant_isolation ON article_category
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON article_category TO app_tenant_user;

 succeeded in 829ms:
-- @glitzy/core-content — C0010 Publication (DATA_MODEL C-24·EAT_CONTENT_PLAN v1.0 § 2.3)
-- EC-SCHEMA-08·09·10: 외부 학술 인용 entity · authors[] min 1 NOT NULL (DEFAULT 제거) · risk_level Low fixed CHECK.
-- DOI regex 는 zod schema 와 동일 anchored (cycle 1 ECP-08 정합).
-- Precondition: D0010 instance · C0003 doctor_profile · C0004 content_publication_status · C0005 risk_level

CREATE TABLE publication (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  authors JSONB NOT NULL,                       -- cycle 1 ECP-18: DEFAULT 제거. authors min 1 CHECK 정합
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
  CONSTRAINT publication_thumbnail_url_format CHECK (
    thumbnail_url IS NULL OR thumbnail_url ~ '^https?://'
  ),
  CONSTRAINT publication_doi_format CHECK (
    doi IS NULL OR doi ~ '^10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$'
  ),
  CONSTRAINT publication_pubmed_id_format CHECK (
    pubmed_id IS NULL OR pubmed_id ~ '^[0-9]{1,9}$'
  ),
  CONSTRAINT publication_authors_array CHECK (
    jsonb_typeof(authors) = 'array' AND jsonb_array_length(authors) >= 1
  ),
  CONSTRAINT publication_risk_level_low_only CHECK (risk_level = 'Low'),
  CONSTRAINT publication_published_requires_at CHECK (
    status <> 'published' OR published_at IS NOT NULL
  ),
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

CREATE POLICY tenant_isolation ON publication
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON publication TO app_tenant_user;

 succeeded in 822ms:
-- @glitzy/db — D0014 app_public_reader EAT 4 table GRANT + per-table SELECT policy
-- SoT: EAT_CONTENT_PLAN v1.0 § 2.6 EC-SCHEMA-16·17 · EC-CASCADE-05
--
-- D0011 패턴 정합. publication / media_appearance 는 published only (D0011 article 패턴).
-- faq 는 published only — v0.1 단계 DB CHECK 가 status='draft' 만 허용 → 자동 0 row.
-- article_category 는 taxonomy public 의도 — instance_id only (status 없음, EC-SCHEMA-17 결정).
--
-- Precondition: D0011 (app_public_reader) · C0009 article_category · C0010 publication · C0011 media_appearance · C0012 faq

GRANT SELECT ON article_category, publication, media_appearance, faq TO app_public_reader;

-- ===== article_category: taxonomy public — instance_id only =====
-- 분류 자체는 instance scope 안 모든 row public. status 없음 (분류 메타).
-- 본 결정은 D0011 published-only 패턴과 다른 의도 — EC-SCHEMA-17.
CREATE POLICY public_reader_article_category_select
  ON article_category FOR SELECT TO app_public_reader
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

-- ===== publication: published + 미래 발행 제외 (D0011 article 패턴 정합) =====
CREATE POLICY public_reader_publication_select
  ON publication FOR SELECT TO app_public_reader
  USING (
    instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
    AND status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= now()
  );

-- ===== media_appearance: published + 미래 발행 제외 =====
CREATE POLICY public_reader_media_appearance_select
  ON media_appearance FOR SELECT TO app_public_reader
  USING (
    instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
    AND status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= now()
  );

-- ===== faq: published only =====
-- v0.1 단계 DB CHECK 가 status='draft' 만 허용 → 자동 0 row → /faq 페이지 빈 페이지 200.
-- LegalDocument 패턴 정합 (LOCATION_LEGAL § 3.2 PSR-DATA-07).
CREATE POLICY public_reader_faq_select
  ON faq FOR SELECT TO app_public_reader
  USING (
    instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
    AND status = 'published'
  );

 succeeded in 847ms:
-- @glitzy/core-content — C0011 MediaAppearance (DATA_MODEL C-25·EAT_CONTENT_PLAN v1.0 § 2.4)
-- EC-SCHEMA-11·12: media_channel_type enum 4종. v0.1 단계 JSON-LD `@type` = VideoObject 단일화.
-- BroadcastEvent/NewsArticle 분기 EC-DEFER-11 (M1 cascade).
-- Precondition: D0010 instance · C0003 doctor_profile · C0004 content_publication_status · C0005 risk_level

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
  CONSTRAINT media_appearance_channel_name_length CHECK (length(channel_name) BETWEEN 1 AND 100),
  CONSTRAINT media_appearance_url_format CHECK (url ~ '^https?://'),
  CONSTRAINT media_appearance_thumbnail_url_format CHECK (
    thumbnail_url IS NULL OR thumbnail_url ~ '^https?://'
  ),
  CONSTRAINT media_appearance_duration_positive CHECK (
    duration_seconds IS NULL OR duration_seconds > 0
  ),
  CONSTRAINT media_appearance_risk_level_low_only CHECK (risk_level = 'Low'),
  CONSTRAINT media_appearance_published_requires_at CHECK (
    status <> 'published' OR published_at IS NOT NULL
  ),
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

CREATE POLICY tenant_isolation ON media_appearance
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON media_appearance TO app_tenant_user;

 succeeded in 838ms:
-- @glitzy/core-content — C0013 Article.category_id staged migration
-- EC-SCHEMA-05·06·07 · cycle 1 ECP-03·09 정합: PSR-DEFER-15 해소.
-- staged 4 step (단일 migration 안):
--   (1) ADD COLUMN nullable
--   (2) default `general` ArticleCategory 행 backfill (instance 별 idempotent INSERT)
--   (3) 기존 article row 의 category_id 를 default category 로 backfill
--   (4) SET NOT NULL + composite FK
-- Precondition: C0005 article · C0009 article_category

-- (1) ADD COLUMN nullable
ALTER TABLE article ADD COLUMN category_id UUID;

-- (2) instance 별 default `general` ArticleCategory 행 INSERT (idempotent)
--   기존 instance backfill — seed.ts 가 신규 instance 에서 자동 INSERT 책임 (EC-SCHEMA-03)
INSERT INTO article_category (instance_id, slug, name, display_order)
SELECT i.id, 'general', '일반', 0
FROM instance i
WHERE NOT EXISTS (
  SELECT 1 FROM article_category ac
  WHERE ac.instance_id = i.id AND ac.slug = 'general'
);

-- (3) 기존 article row 의 category_id 를 default category 로 backfill
UPDATE article a
SET category_id = ac.id
FROM article_category ac
WHERE a.instance_id = ac.instance_id
  AND ac.slug = 'general'
  AND a.category_id IS NULL;

-- (4) SET NOT NULL + composite FK (same-tenant)
ALTER TABLE article ALTER COLUMN category_id SET NOT NULL;

ALTER TABLE article ADD CONSTRAINT article_category_fk
  FOREIGN KEY (instance_id, category_id)
  REFERENCES article_category (instance_id, id)
  ON DELETE NO ACTION;

CREATE INDEX article_category_idx ON article (instance_id, category_id);

 succeeded in 846ms:
-- @glitzy/core-content — C0012 FAQ (DATA_MODEL C-12·EAT_CONTENT_PLAN v1.0 § 2.5)
-- EC-SCHEMA-13·14·15: 풀명세 합류. v0.1 단계 status='draft' + published_at IS NULL CHECK 강제.
-- compliance-assistant + risk_level 자동 추론 합류 (EC-DEFER-05·12) 까지 published 자체 차단.
-- LegalDocument LL-SCHEMA-03·04 패턴 정합.
-- Precondition: D0010 instance · C0003 doctor_profile · C0004 treatment_page · C0009 article_category · C0004 content_publication_status · C0005 risk_level

CREATE TABLE faq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  category_id UUID,
  related_treatment_id UUID,                    -- C-12 SoT · v0.1 nullable (EC-DEFER-09)
  related_condition_id UUID,                     -- v0.1 nullable (medical_condition_page FK 는 C-11 합류 후)
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
  -- EC-SCHEMA-14 · cycle 1 ECP-10·11: v0.1 published 차단 (LegalDocument 패턴)
  CONSTRAINT faq_status_v01_limit CHECK (status = 'draft'),
  CONSTRAINT faq_published_at_null_v01 CHECK (published_at IS NULL),
  CONSTRAINT faq_instance_slug_unique UNIQUE (instance_id, slug),
  CONSTRAINT faq_instance_id_unique UNIQUE (instance_id, id),
  CONSTRAINT faq_category_fk FOREIGN KEY (instance_id, category_id)
    REFERENCES article_category (instance_id, id) ON DELETE NO ACTION,
  CONSTRAINT faq_author_doctor_fk FOREIGN KEY (instance_id, author_doctor_id)
    REFERENCES doctor_profile (instance_id, id) ON DELETE NO ACTION,
  CONSTRAINT faq_related_treatment_fk FOREIGN KEY (instance_id, related_treatment_id)
    REFERENCES treatment_page (instance_id, id) ON DELETE NO ACTION
  -- related_condition_id 의 medical_condition_page FK 는 C-11 합류 후 cascade (M0 외)
);

CREATE INDEX faq_instance_idx ON faq (instance_id);
CREATE INDEX faq_status_idx ON faq (instance_id, status);
CREATE INDEX faq_published_idx ON faq (instance_id, published_at, display_order)
  WHERE status = 'published' AND published_at IS NOT NULL;
CREATE INDEX faq_category_idx ON faq (instance_id, category_id)
  WHERE category_id IS NOT NULL;
CREATE INDEX faq_order_idx ON faq (instance_id, display_order, id);

ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON faq
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON faq TO app_tenant_user;

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "articleCategory|publication|mediaAppearance|faq|categoryId|relations|foreignKey|article_category" packages/core-content/src/schema.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "EatStatusSchema|doi|Publication|MediaAppearance|Faq|ArticleCategory|contentType|riskLevel|status" apps/web/src/lib/eat-content-schema.ts apps/web/src/lib/errors.ts apps/web/src/lib/db-projection.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "FOR UPDATE|audit|emit|revalidatePath|redirect|resolveTenant|TenantResolveError|mapTenantResolveError|status|contentType|Publication|MediaAppearance|FAQ|ArticleCategory|delete|general|count|categoryId|transaction" apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts' in C:\Users\assag\solution\website-exposure
 succeeded in 633ms:
apps/web/src/lib/db-projection.ts:338:export type ArticleCategoryRow = {
apps/web/src/lib/db-projection.ts:347:export type ArticleCategoryProjection = {
apps/web/src/lib/db-projection.ts:356:export function normalizeArticleCategory(row: ArticleCategoryRow): ArticleCategoryProjection {
apps/web/src/lib/db-projection.ts:367:export type PublicationRow = {
apps/web/src/lib/db-projection.ts:373:  doi: string | null;
apps/web/src/lib/db-projection.ts:383:export type PublicationProjection = {
apps/web/src/lib/db-projection.ts:389:  doi: string | null;
apps/web/src/lib/db-projection.ts:408:export function normalizePublication(row: PublicationRow): PublicationProjection {
apps/web/src/lib/db-projection.ts:415:    doi: row.doi,
apps/web/src/lib/db-projection.ts:426:export type MediaAppearanceRow = {
apps/web/src/lib/db-projection.ts:441:export type MediaAppearanceProjection = {
apps/web/src/lib/db-projection.ts:456:export function normalizeMediaAppearance(row: MediaAppearanceRow): MediaAppearanceProjection {
apps/web/src/lib/db-projection.ts:473:export type FaqRow = {
apps/web/src/lib/db-projection.ts:485:export type FaqProjection = {
apps/web/src/lib/db-projection.ts:497:export function normalizeFaq(row: FaqRow): FaqProjection {
apps/web/src/lib/errors.ts:62:  legal_document_status_skeleton_limit: { field: null, message: "정책 문서 상태 변경(검수 진입·발행)은 후속 단계입니다. 본 화면에서는 draft 만 저장 가능하며, 검수 진입은 compliance-assistant Feature 합류(M0 v1.0 본 구현 완료 시점) 후 검수 큐 화면에서 가능합니다." },
apps/web/src/lib/errors.ts:75:  // ArticleCategory (C0009)
apps/web/src/lib/errors.ts:86:  // Publication (C0010)
apps/web/src/lib/errors.ts:92:  publication_doi_format: { field: "doi", message: "DOI 형식이 올바르지 않습니다 (예: 10.1000/xyz123)." },
apps/web/src/lib/errors.ts:95:  publication_risk_level_low_only: { field: null, message: "Publication 위험도는 Low 만 허용됩니다 (외부 학술 인용)." },
apps/web/src/lib/errors.ts:100:  // MediaAppearance (C0011)
apps/web/src/lib/errors.ts:108:  media_appearance_risk_level_low_only: { field: null, message: "MediaAppearance 위험도는 Low 만 허용됩니다." },
apps/web/src/lib/errors.ts:117:  faq_status_v01_limit: { field: null, message: "FAQ 발행은 compliance-assistant + 위험도 자동 추론 합류 후 가능합니다 (EC-DEFER-05·12). 현재 단계에서는 draft 만 저장 가능합니다." },
apps/web/src/lib/eat-content-schema.ts:3:// Publication · MediaAppearance · Faq · ArticleCategory 어드민 폼 통합 zod SoT.
apps/web/src/lib/eat-content-schema.ts:4:// DB CHECK 정합 — DOI anchored regex (cycle 1 ECP-08) · status enum subset (cycle 1 ECP-10·11).
apps/web/src/lib/eat-content-schema.ts:6:// v0.1 단계 status zod = z.enum(['draft']) 만. EC-DEFER-12 까지 — compliance-assistant + risk 자동 추론 합류 시점.
apps/web/src/lib/eat-content-schema.ts:104:// EC-FORM-02: v0.1 단계 status enum subset
apps/web/src/lib/eat-content-schema.ts:105:export const EatStatusSchema = z.enum(["draft"], {
apps/web/src/lib/eat-content-schema.ts:115:// === ArticleCategory ===
apps/web/src/lib/eat-content-schema.ts:117:export const ArticleCategoryInputSchema = z.object({
apps/web/src/lib/eat-content-schema.ts:129:export type ArticleCategoryInput = z.infer<typeof ArticleCategoryInputSchema>;
apps/web/src/lib/eat-content-schema.ts:131:// === Publication ===
apps/web/src/lib/eat-content-schema.ts:145:export const PublicationInputSchema = z.object({
apps/web/src/lib/eat-content-schema.ts:153:  doi: z
apps/web/src/lib/eat-content-schema.ts:175:  status: EatStatusSchema,
apps/web/src/lib/eat-content-schema.ts:178:export type PublicationInput = z.infer<typeof PublicationInputSchema>;
apps/web/src/lib/eat-content-schema.ts:180:// === MediaAppearance ===
apps/web/src/lib/eat-content-schema.ts:184:export const MediaAppearanceInputSchema = z.object({
apps/web/src/lib/eat-content-schema.ts:199:  status: EatStatusSchema,
apps/web/src/lib/eat-content-schema.ts:202:export type MediaAppearanceInput = z.infer<typeof MediaAppearanceInputSchema>;
apps/web/src/lib/eat-content-schema.ts:206:export const FaqInputSchema = z.object({
apps/web/src/lib/eat-content-schema.ts:216:  status: EatStatusSchema,
apps/web/src/lib/eat-content-schema.ts:219:export type FaqInput = z.infer<typeof FaqInputSchema>;

 succeeded in 635ms:
4:// v0.4: + article_category (C-22) + publication (C-24) + media_appearance (C-25) + faq (C-12 풀명세) + article.category_id NOT NULL FK (C-04 PSR-DEFER-15 해소)
9:  pgEnum, index, foreignKey, check, unique, uniqueIndex,
33:export const contentPublicationStatusEnum = pgEnum("content_publication_status", [
125:    clinicFk: foreignKey({
222:    categoryId: uuid("category_id").notNull(),
243:    categoryIdx: index("article_category_idx").on(t.instanceId, t.categoryId),
245:    authorFk: foreignKey({
250:    // v0.4 (EC-SCHEMA-07): same-tenant composite FK to article_category — raw SQL C0013 안 ADD CONSTRAINT.
314:export const articleCategory = pgTable(
315:  "article_category",
333:    slugRegex: check("article_category_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
334:    nameLen: check("article_category_name_length", sql`length(${t.name}) BETWEEN 1 AND 50`),
335:    descLen: check("article_category_description_length",
337:    coverImageUrlFormat: check("article_category_cover_image_url_format",
339:    instanceSlugUnique: unique("article_category_instance_slug_unique").on(t.instanceId, t.slug),
340:    instanceIdUnique: unique("article_category_instance_id_unique").on(t.instanceId, t.id),
341:    instanceIdx: index("article_category_instance_idx").on(t.instanceId),
342:    orderIdx: index("article_category_order_idx").on(t.instanceId, t.displayOrder, t.id),
343:    parentIdx: index("article_category_parent_idx")
348:    parentFk: foreignKey({
351:      name: "article_category_parent_fk",
359:export const publication = pgTable(
360:  "publication",
383:    slugRegex: check("publication_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
384:    titleLen: check("publication_title_length", sql`length(${t.title}) BETWEEN 1 AND 300`),
385:    summaryLen: check("publication_summary_length", sql`length(${t.summary}) BETWEEN 50 AND 300`),
386:    urlFormat: check("publication_url_format", sql`${t.url} ~ '^https?://'`),
387:    thumbnailUrlFormat: check("publication_thumbnail_url_format",
389:    doiFormat: check("publication_doi_format",
391:    pubmedIdFormat: check("publication_pubmed_id_format",
393:    authorsArray: check("publication_authors_array",
395:    riskLevelLowOnly: check("publication_risk_level_low_only", sql`${t.riskLevel} = 'Low'`),
396:    publishedRequiresAt: check("publication_published_requires_at",
398:    instanceSlugUnique: unique("publication_instance_slug_unique").on(t.instanceId, t.slug),
399:    instanceIdUnique: unique("publication_instance_id_unique").on(t.instanceId, t.id),
400:    instanceIdx: index("publication_instance_idx").on(t.instanceId),
401:    statusIdx: index("publication_status_idx").on(t.instanceId, t.status),
402:    publishedIdx: index("publication_published_idx")
405:    authorIdx: index("publication_author_idx")
408:    authorDoctorFk: foreignKey({
411:      name: "publication_author_doctor_fk",
418:export const mediaAppearance = pgTable(
463:    authorDoctorFk: foreignKey({
474:export const faq = pgTable(
475:  "faq",
483:    categoryId: uuid("category_id"),
496:    slugRegex: check("faq_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
497:    questionLen: check("faq_question_length", sql`length(${t.question}) BETWEEN 10 AND 200`),
498:    answerLen: check("faq_answer_length", sql`length(${t.answer}) BETWEEN 50 AND 2000`),
500:    statusV01Limit: check("faq_status_v01_limit", sql`${t.status} = 'draft'`),
501:    publishedAtNullV01: check("faq_published_at_null_v01", sql`${t.publishedAt} IS NULL`),
502:    instanceSlugUnique: unique("faq_instance_slug_unique").on(t.instanceId, t.slug),
503:    instanceIdUnique: unique("faq_instance_id_unique").on(t.instanceId, t.id),
504:    instanceIdx: index("faq_instance_idx").on(t.instanceId),
505:    statusIdx: index("faq_status_idx").on(t.instanceId, t.status),
506:    publishedIdx: index("faq_published_idx")
509:    categoryIdx: index("faq_category_idx")
510:      .on(t.instanceId, t.categoryId)
511:      .where(sql`${t.categoryId} IS NOT NULL`),
512:    orderIdx: index("faq_order_idx").on(t.instanceId, t.displayOrder, t.id),
513:    categoryFk: foreignKey({
514:      columns: [t.instanceId, t.categoryId],
515:      foreignColumns: [articleCategory.instanceId, articleCategory.id],
516:      name: "faq_category_fk",
518:    authorDoctorFk: foreignKey({
521:      name: "faq_author_doctor_fk",
523:    relatedTreatmentFk: foreignKey({
526:      name: "faq_related_treatment_fk",

2026-05-18T07:47:16.785436Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
[31;1madmin: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … general|count|categoryId|transaction" apps/web/src/app/([36;1madmin[0m)/admin/ …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                           ~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'admin' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

 exited 1 in 750ms:
[31;1madmin: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … general|count|categoryId|transaction" apps/web/src/app/([36;1madmin[0m)/admin/ …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                           ~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'admin' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"FOR UPDATE|audit|emit|revalidatePath|redirect|resolveTenant|TenantResolveError|mapTenantResolveError|status|contentType|Publication|MediaAppearance|FAQ|ArticleCategory|delete|general|count|categoryId|transaction\" 'apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content packages/core-content/src/schema.ts | Select-Object -Skip 300 -First 240' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/web/src/lib/eat-content-schema.ts | Select-Object -First 260' in C:\Users\assag\solution\website-exposure
 succeeded in 597ms:
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:6:import { revalidatePath } from "next/cache";
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:7:import { notFound, redirect } from "next/navigation";
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:9:import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:45:  status: z.enum(PUBLICATION_STATUSES, { errorMap: () => ({ message: "잘못된 발행 상태입니다." }) }),
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:74:  //   form 은 selected category UUID. action 안 비어 있으면 instance 의 default `general` 으로 fallback.
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:75:  categoryId: z
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:113:      const isPublished = parsed.data.status === "published";
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:115:      // cycle5-3entity WEB-49: edit path 는 article row 를 먼저 FOR UPDATE 로 잠근 뒤 currentAuthorId 추출
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:123:           FOR UPDATE
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:131:      // EAT_CONTENT v1.0 (EC-SCHEMA-05): categoryId resolve — form 값 없으면 default `general` ArticleCategory.
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:133:      if (parsed.data.categoryId) {
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:134:        resolvedCategoryId = parsed.data.categoryId;
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:140:           WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'general'
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:173:                 status = ${parsed.data.status}::content_publication_status,
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:187:          instance_id, slug, title, summary, body_markdown, status, risk_level, hero_image_url, author_doctor_id, category_id, published_at
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:194:          ${parsed.data.status}::content_publication_status,
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:219:        await emitAuditEvent(sqlBase, {
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:224:          payload: { contentType: "Article", slug: txResult.slug, mode: txResult.mode, status: parsed.data.status, originalSlug },
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:226:      } catch (auditErr) {
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:227:        console.error("[saveArticle] audit emit failed", auditErr);
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:229:      revalidatePath(`/admin/${instanceSlug}/articles`);
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:230:      revalidatePath(`/admin/${instanceSlug}/articles/${txResult.slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:232:        revalidatePath(`/admin/${instanceSlug}/articles/${originalSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:234:      revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:236:        redirect(`/admin/${instanceSlug}/articles/${txResult.slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:248:    if (err instanceof TenantResolveError) {
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:250:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:261:export async function deleteArticle(instanceSlug: string, slug: string): Promise<DeleteResult> {
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:268:      const deleted = await tx<{ id: string }[]>`
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:273:      return { deleted: deleted.length };
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:276:    if (result.deleted === 0) {
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:281:      await emitAuditEvent(sqlBase, {
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:282:        eventType: "content-deleted",
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:286:        payload: { contentType: "Article", slug },
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:289:      console.error("[deleteArticle] audit emit failed", err);
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:292:    revalidatePath(`/admin/${instanceSlug}/articles`);
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:293:    revalidatePath(`/admin/${instanceSlug}/articles/${slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:294:    revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:295:    redirect(`/admin/${instanceSlug}/articles`);
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:298:    if (err instanceof TenantResolveError) {
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:300:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:303:      // cycle5-3entity WEB-52: info branch 처리 (delete path)
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:308:    console.error("[deleteArticle] unexpected", err);
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:5:import { revalidatePath } from "next/cache";
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:6:import { notFound, redirect } from "next/navigation";
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:7:import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:14:import { MediaAppearanceInputSchema } from "@/lib/eat-content-schema";
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:19:export async function saveMediaAppearance(
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:25:  const parsed = MediaAppearanceInputSchema.safeParse(Object.fromEntries(formData));
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:49:             FOR UPDATE
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:65:                   status = ${parsed.data.status}::content_publication_status,
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:76:            author_doctor_id, status
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:89:            ${parsed.data.status}::content_publication_status
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:99:        await emitAuditEvent(sqlBase, {
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:104:          payload: { contentType: "MediaAppearance", slug: txResult.slug, mode: txResult.mode, status: parsed.data.status, originalSlug },
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:106:      } catch (auditErr) {
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:107:        console.error("[saveMediaAppearance] audit emit failed", auditErr);
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:109:      revalidatePath(`/admin/${instanceSlug}/media-appearances`);
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:110:      revalidatePath(`/admin/${instanceSlug}/media-appearances/${txResult.slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:112:        revalidatePath(`/admin/${instanceSlug}/media-appearances/${originalSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:114:      revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:116:        redirect(`/admin/${instanceSlug}/media-appearances/${txResult.slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:128:    if (err instanceof TenantResolveError) {
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:130:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:134:    console.error("[saveMediaAppearance] unexpected", err);
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:139:export async function deleteMediaAppearance(instanceSlug: string, slug: string): Promise<DeleteResult> {
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:148:        const deleted = await tx<{ id: string }[]>`
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:153:        return { deleted: deleted.length };
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:157:    if (result.deleted === 0) return { ok: false, formError: "해당 media appearance 가 이미 삭제되었습니다." };
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:160:      await emitAuditEvent(sqlBase, {
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:161:        eventType: "content-deleted",
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:165:        payload: { contentType: "MediaAppearance", slug },
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:168:      console.error("[deleteMediaAppearance] audit emit failed", err);
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:171:    revalidatePath(`/admin/${instanceSlug}/media-appearances`);
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:172:    revalidatePath(`/admin/${instanceSlug}/media-appearances/${slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:173:    revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:174:    redirect(`/admin/${instanceSlug}/media-appearances`);
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:177:    if (err instanceof TenantResolveError) {
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:179:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:185:    console.error("[deleteMediaAppearance] unexpected", err);
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:5:import { revalidatePath } from "next/cache";
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:6:import { notFound, redirect } from "next/navigation";
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:7:import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:14:import { ArticleCategoryInputSchema } from "@/lib/eat-content-schema";
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:25:  const parsed = ArticleCategoryInputSchema.safeParse(Object.fromEntries(formData));
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:48:             FOR UPDATE
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:81:        await emitAuditEvent(sqlBase, {
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:86:          payload: { contentType: "ArticleCategory", slug: txResult.slug, mode: txResult.mode, originalSlug },
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:88:      } catch (auditErr) {
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:89:        console.error("[saveCategory] audit emit failed", auditErr);
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:91:      revalidatePath(`/admin/${instanceSlug}/categories`);
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:92:      revalidatePath(`/admin/${instanceSlug}/categories/${txResult.slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:94:        revalidatePath(`/admin/${instanceSlug}/categories/${originalSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:96:      revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:98:        redirect(`/admin/${instanceSlug}/categories/${txResult.slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:110:    if (err instanceof TenantResolveError) {
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:112:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:121:export async function deleteCategory(instanceSlug: string, slug: string): Promise<DeleteResult> {
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:130:        // default `general` 카테고리는 삭제 차단 — Article.category_id NOT NULL FK 무결성.
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:136:        if (targetRows.length === 0) return { deleted: 0 };
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:137:        if (targetRows[0]!.slug === "general") {
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:138:          return { deleted: 0, action: "default-protected" as const };
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:145:          return { deleted: 0, action: "in-use" as const };
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:147:        const deleted = await tx<{ id: string }[]>`
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:152:        return { deleted: deleted.length };
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:157:      return { ok: false, formError: "기본 카테고리(general)는 삭제할 수 없습니다." };
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:162:    if (result.deleted === 0) {
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:167:      await emitAuditEvent(sqlBase, {
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:168:        eventType: "content-deleted",
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:172:        payload: { contentType: "ArticleCategory", slug },
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:175:      console.error("[deleteCategory] audit emit failed", err);
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:178:    revalidatePath(`/admin/${instanceSlug}/categories`);
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:179:    revalidatePath(`/admin/${instanceSlug}/categories/${slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:180:    revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:181:    redirect(`/admin/${instanceSlug}/categories`);
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:184:    if (err instanceof TenantResolveError) {
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:186:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:192:    console.error("[deleteCategory] unexpected", err);
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:5:import { revalidatePath } from "next/cache";
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:6:import { notFound, redirect } from "next/navigation";
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:7:import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:14:import { PublicationInputSchema } from "@/lib/eat-content-schema";
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:19:export async function savePublication(
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:25:  const parsed = PublicationInputSchema.safeParse(Object.fromEntries(formData));
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:48:             FOR UPDATE
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:65:                   status = ${parsed.data.status}::content_publication_status,
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:76:            author_doctor_id, status
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:90:            ${parsed.data.status}::content_publication_status
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:100:        await emitAuditEvent(sqlBase, {
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:105:          payload: { contentType: "Publication", slug: txResult.slug, mode: txResult.mode, status: parsed.data.status, originalSlug },
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:107:      } catch (auditErr) {
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:108:        console.error("[savePublication] audit emit failed", auditErr);
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:110:      revalidatePath(`/admin/${instanceSlug}/publications`);
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:111:      revalidatePath(`/admin/${instanceSlug}/publications/${txResult.slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:113:        revalidatePath(`/admin/${instanceSlug}/publications/${originalSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:115:      revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:117:        redirect(`/admin/${instanceSlug}/publications/${txResult.slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:129:    if (err instanceof TenantResolveError) {
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:131:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:135:    console.error("[savePublication] unexpected", err);
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:140:export async function deletePublication(instanceSlug: string, slug: string): Promise<DeleteResult> {
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:149:        const deleted = await tx<{ id: string }[]>`
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:154:        return { deleted: deleted.length };
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:158:    if (result.deleted === 0) return { ok: false, formError: "해당 publication 이 이미 삭제되었습니다." };
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:161:      await emitAuditEvent(sqlBase, {
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:162:        eventType: "content-deleted",
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:166:        payload: { contentType: "Publication", slug },
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:169:      console.error("[deletePublication] audit emit failed", err);
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:172:    revalidatePath(`/admin/${instanceSlug}/publications`);
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:173:    revalidatePath(`/admin/${instanceSlug}/publications/${slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:174:    revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:175:    redirect(`/admin/${instanceSlug}/publications`);
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:178:    if (err instanceof TenantResolveError) {
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:180:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:186:    console.error("[deletePublication] unexpected", err);
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:2://   v0.1 단계 status='draft' DB CHECK 강제. server action 안 status='draft' 강제 (form 도 동일).
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:6:import { revalidatePath } from "next/cache";
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:7:import { notFound, redirect } from "next/navigation";
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:8:import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:49:             FOR UPDATE
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:59:                   category_id = ${parsed.data.categoryId ?? null}::uuid,
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:62:                   status = ${parsed.data.status}::content_publication_status,
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:72:            category_id, author_doctor_id, related_treatment_id, status
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:79:            ${parsed.data.categoryId ?? null}::uuid,
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:82:            ${parsed.data.status}::content_publication_status
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:92:        await emitAuditEvent(sqlBase, {
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:97:          payload: { contentType: "FAQ", slug: txResult.slug, mode: txResult.mode, status: parsed.data.status, originalSlug },
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:99:      } catch (auditErr) {
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:100:        console.error("[saveFaq] audit emit failed", auditErr);
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:102:      revalidatePath(`/admin/${instanceSlug}/faqs`);
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:103:      revalidatePath(`/admin/${instanceSlug}/faqs/${txResult.slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:105:        revalidatePath(`/admin/${instanceSlug}/faqs/${originalSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:107:      revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:109:        redirect(`/admin/${instanceSlug}/faqs/${txResult.slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:121:    if (err instanceof TenantResolveError) {
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:123:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:132:export async function deleteFaq(instanceSlug: string, slug: string): Promise<DeleteResult> {
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:141:        const deleted = await tx<{ id: string }[]>`
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:146:        return { deleted: deleted.length };
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:150:    if (result.deleted === 0) return { ok: false, formError: "해당 FAQ 가 이미 삭제되었습니다." };
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:153:      await emitAuditEvent(sqlBase, {
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:154:        eventType: "content-deleted",
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:158:        payload: { contentType: "FAQ", slug },
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:161:      console.error("[deleteFaq] audit emit failed", err);
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:164:    revalidatePath(`/admin/${instanceSlug}/faqs`);
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:165:    revalidatePath(`/admin/${instanceSlug}/faqs/${slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:166:    revalidatePath(`/admin/${instanceSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:167:    redirect(`/admin/${instanceSlug}/faqs`);
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:170:    if (err instanceof TenantResolveError) {
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:172:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:178:    console.error("[deleteFaq] unexpected", err);

 succeeded in 649ms:
);

// === EAT_CONTENT v1.0 v0.4 cascade — 4 신규 entity ===

// EC-SCHEMA-12 (C-25 SoT) — media_channel_type enum 4종.
//   JSON-LD `@type` 매핑은 v0.1 단계 모두 VideoObject 단일화. EC-DEFER-11 (M1) BroadcastEvent/NewsArticle 분기.
export const mediaChannelTypeEnum = pgEnum("media_channel_type", [
  "broadcast", "youtube", "podcast", "press",
]);

// === ArticleCategory (C-22·EC-SCHEMA-01) ===
//   v0.1 풀명세 컬럼 모두 추가 — 어드민 UI minimal (slug·name·displayOrder 만 노출).
//   parent_category_id·pillar·cover_image_url·seo_meta·article_type_default 는 EC-DEFER-10 (M1 UI).
export const articleCategory = pgTable(
  "article_category",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    pillar: text("pillar"),
    parentCategoryId: uuid("parent_category_id"),
    coverImageUrl: text("cover_image_url"),
    seoMeta: jsonb("seo_meta"),
    displayOrder: integer("display_order").notNull().default(0),
    articleTypeDefault: text("article_type_default"),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("article_category_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
    nameLen: check("article_category_name_length", sql`length(${t.name}) BETWEEN 1 AND 50`),
    descLen: check("article_category_description_length",
      sql`${t.description} IS NULL OR length(${t.description}) BETWEEN 80 AND 200`),
    coverImageUrlFormat: check("article_category_cover_image_url_format",
      sql`${t.coverImageUrl} IS NULL OR ${t.coverImageUrl} ~ '^https?://'`),
    instanceSlugUnique: unique("article_category_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("article_category_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("article_category_instance_idx").on(t.instanceId),
    orderIdx: index("article_category_order_idx").on(t.instanceId, t.displayOrder, t.id),
    parentIdx: index("article_category_parent_idx")
      .on(t.instanceId, t.parentCategoryId)
      .where(sql`${t.parentCategoryId} IS NOT NULL`),
    // self-referencing composite FK (same-tenant) — DB ADD CONSTRAINT C0009 raw SQL SoT.
    //   parent_category_id 가 nullable 이므로 Drizzle 도 표현 가능.
    parentFk: foreignKey({
      columns: [t.instanceId, t.parentCategoryId],
      foreignColumns: [t.instanceId, t.id],
      name: "article_category_parent_fk",
    }),
  }),
);

// === Publication (C-24·EC-SCHEMA-08) ===
//   외부 학술 인용 entity. authors[] min 1 NOT NULL (DEFAULT 제거). risk_level Low fixed.
//   DOI regex 는 zod schema 와 동일 anchored (cycle 1 ECP-08 정합).
export const publication = pgTable(
  "publication",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    authors: jsonb("authors").notNull(),
    journal: text("journal"),
    publishedDate: date("published_date").notNull(),
    doi: text("doi"),
    pubmedId: text("pubmed_id"),
    url: text("url").notNull(),
    thumbnailUrl: text("thumbnail_url"),
    summary: text("summary").notNull(),
    authorDoctorId: uuid("author_doctor_id"),
    status: contentPublicationStatusEnum("status").notNull().default("draft"),
    riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("publication_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
    titleLen: check("publication_title_length", sql`length(${t.title}) BETWEEN 1 AND 300`),
    summaryLen: check("publication_summary_length", sql`length(${t.summary}) BETWEEN 50 AND 300`),
    urlFormat: check("publication_url_format", sql`${t.url} ~ '^https?://'`),
    thumbnailUrlFormat: check("publication_thumbnail_url_format",
      sql`${t.thumbnailUrl} IS NULL OR ${t.thumbnailUrl} ~ '^https?://'`),
    doiFormat: check("publication_doi_format",
      sql`${t.doi} IS NULL OR ${t.doi} ~ '^10\\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$'`),
    pubmedIdFormat: check("publication_pubmed_id_format",
      sql`${t.pubmedId} IS NULL OR ${t.pubmedId} ~ '^[0-9]{1,9}$'`),
    authorsArray: check("publication_authors_array",
      sql`jsonb_typeof(${t.authors}) = 'array' AND jsonb_array_length(${t.authors}) >= 1`),
    riskLevelLowOnly: check("publication_risk_level_low_only", sql`${t.riskLevel} = 'Low'`),
    publishedRequiresAt: check("publication_published_requires_at",
      sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`),
    instanceSlugUnique: unique("publication_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("publication_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("publication_instance_idx").on(t.instanceId),
    statusIdx: index("publication_status_idx").on(t.instanceId, t.status),
    publishedIdx: index("publication_published_idx")
      .on(t.instanceId, t.publishedAt)
      .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
    authorIdx: index("publication_author_idx")
      .on(t.instanceId, t.authorDoctorId)
      .where(sql`${t.authorDoctorId} IS NOT NULL`),
    authorDoctorFk: foreignKey({
      columns: [t.instanceId, t.authorDoctorId],
      foreignColumns: [doctorProfile.instanceId, doctorProfile.id],
      name: "publication_author_doctor_fk",
    }),
  }),
);

// === MediaAppearance (C-25·EC-SCHEMA-11) ===
//   미디어 출연. v0.1 단계 JSON-LD `@type` = VideoObject 단일화 (모든 channel_type).
export const mediaAppearance = pgTable(
  "media_appearance",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    channelName: text("channel_name").notNull(),
    channelType: mediaChannelTypeEnum("channel_type").notNull(),
    publishedDate: date("published_date").notNull(),
    durationSeconds: integer("duration_seconds"),
    url: text("url").notNull(),
    thumbnailUrl: text("thumbnail_url"),
    summary: text("summary").notNull(),
    authorDoctorId: uuid("author_doctor_id"),
    status: contentPublicationStatusEnum("status").notNull().default("draft"),
    riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("media_appearance_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
    titleLen: check("media_appearance_title_length", sql`length(${t.title}) BETWEEN 1 AND 300`),
    summaryLen: check("media_appearance_summary_length", sql`length(${t.summary}) BETWEEN 50 AND 300`),
    channelNameLen: check("media_appearance_channel_name_length", sql`length(${t.channelName}) BETWEEN 1 AND 100`),
    urlFormat: check("media_appearance_url_format", sql`${t.url} ~ '^https?://'`),
    thumbnailUrlFormat: check("media_appearance_thumbnail_url_format",
      sql`${t.thumbnailUrl} IS NULL OR ${t.thumbnailUrl} ~ '^https?://'`),
    durationPositive: check("media_appearance_duration_positive",
      sql`${t.durationSeconds} IS NULL OR ${t.durationSeconds} > 0`),
    riskLevelLowOnly: check("media_appearance_risk_level_low_only", sql`${t.riskLevel} = 'Low'`),
    publishedRequiresAt: check("media_appearance_published_requires_at",
      sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`),
    instanceSlugUnique: unique("media_appearance_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("media_appearance_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("media_appearance_instance_idx").on(t.instanceId),
    statusIdx: index("media_appearance_status_idx").on(t.instanceId, t.status),
    publishedIdx: index("media_appearance_published_idx")
      .on(t.instanceId, t.publishedAt)
      .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
    authorIdx: index("media_appearance_author_idx")
      .on(t.instanceId, t.authorDoctorId)
      .where(sql`${t.authorDoctorId} IS NOT NULL`),
    authorDoctorFk: foreignKey({
      columns: [t.instanceId, t.authorDoctorId],
      foreignColumns: [doctorProfile.instanceId, doctorProfile.id],
      name: "media_appearance_author_doctor_fk",
    }),
  }),
);

// === FAQ (C-12·EC-SCHEMA-13) ===
//   v0.1 단계 status='draft' + published_at IS NULL CHECK 강제. compliance-assistant 합류 (EC-DEFER-05·12) 까지.
//   LegalDocument LL-SCHEMA-03·04 패턴 정합.
export const faq = pgTable(
  "faq",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    displayOrder: integer("display_order").notNull().default(0),
    categoryId: uuid("category_id"),
    relatedTreatmentId: uuid("related_treatment_id"),
    relatedConditionId: uuid("related_condition_id"),
    authorDoctorId: uuid("author_doctor_id"),
    status: contentPublicationStatusEnum("status").notNull().default("draft"),
    riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
    complianceRecordId: uuid("compliance_record_id"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("faq_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
    questionLen: check("faq_question_length", sql`length(${t.question}) BETWEEN 10 AND 200`),
    answerLen: check("faq_answer_length", sql`length(${t.answer}) BETWEEN 50 AND 2000`),
    // EC-SCHEMA-14 cycle 1 ECP-10·11: v0.1 published 차단
    statusV01Limit: check("faq_status_v01_limit", sql`${t.status} = 'draft'`),
    publishedAtNullV01: check("faq_published_at_null_v01", sql`${t.publishedAt} IS NULL`),
    instanceSlugUnique: unique("faq_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("faq_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("faq_instance_idx").on(t.instanceId),
    statusIdx: index("faq_status_idx").on(t.instanceId, t.status),
    publishedIdx: index("faq_published_idx")
      .on(t.instanceId, t.publishedAt, t.displayOrder)
      .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
    categoryIdx: index("faq_category_idx")
      .on(t.instanceId, t.categoryId)
      .where(sql`${t.categoryId} IS NOT NULL`),
    orderIdx: index("faq_order_idx").on(t.instanceId, t.displayOrder, t.id),
    categoryFk: foreignKey({
      columns: [t.instanceId, t.categoryId],
      foreignColumns: [articleCategory.instanceId, articleCategory.id],
      name: "faq_category_fk",
    }),
    authorDoctorFk: foreignKey({
      columns: [t.instanceId, t.authorDoctorId],
      foreignColumns: [doctorProfile.instanceId, doctorProfile.id],
      name: "faq_author_doctor_fk",
    }),
    relatedTreatmentFk: foreignKey({
      columns: [t.instanceId, t.relatedTreatmentId],
      foreignColumns: [treatmentPage.instanceId, treatmentPage.id],
      name: "faq_related_treatment_fk",
    }),
    // related_condition_id 의 medical_condition_page FK 는 C-11 합류 후 cascade (M0 외).
  }),
);

 succeeded in 664ms:
// @glitzy/web/lib/eat-content-schema — EAT_CONTENT_PLAN v1.0 § 4.3 EC-FORM-03
//
// Publication · MediaAppearance · Faq · ArticleCategory 어드민 폼 통합 zod SoT.
// DB CHECK 정합 — DOI anchored regex (cycle 1 ECP-08) · status enum subset (cycle 1 ECP-10·11).
//
// v0.1 단계 status zod = z.enum(['draft']) 만. EC-DEFER-12 까지 — compliance-assistant + risk 자동 추론 합류 시점.

import { z } from "zod";
import { UUID_V4_REGEX } from "@glitzy/shared-types";

// === 공통 helper ===

const requiredTrimmed = (min: number, max: number, label: string) =>
  z
    .string({ required_error: `${label}은(는) 필수입니다.` })
    .transform((v) => v.trim())
    .refine((v) => v.length >= min, { message: `${label}은(는) ${min}자 이상이어야 합니다.` })
    .refine((v) => v.length <= max, { message: `${label}은(는) ${max}자를 넘을 수 없습니다.` });

const optionalTrimmed = (max: number) =>
  z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || v.length <= max, {
      message: `최대 ${max}자입니다.`,
    });

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const isoDateRequired = (label: string) =>
  z
    .string({ required_error: `${label}은(는) 필수입니다.` })
    .transform((v) => v.trim())
    .refine((v) => ISO_DATE_REGEX.test(v), { message: `${label}은(는) ISO 형식 (YYYY-MM-DD)` })
    .refine(
      (v) => {
        const m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (m === null) return false;
        const y = Number(m[1]);
        const mo = Number(m[2]);
        const d = Number(m[3]);
        const dt = new Date(Date.UTC(y, mo - 1, d));
        return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d;
      },
      { message: `${label}은(는) 실제 존재하는 날짜여야 합니다.` },
    );

const httpUrlRequired = (label: string) =>
  z
    .string({ required_error: `${label}은(는) 필수입니다.` })
    .transform((v) => v.trim())
    .refine((v) => /^https?:\/\//.test(v), { message: `${label}은(는) http:// 또는 https:// 로 시작해야 합니다.` })
    .refine((v) => v.length <= 2048, { message: `${label}은(는) 2048자를 넘을 수 없습니다.` });

const httpUrlOptional = () =>
  z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || (/^https?:\/\//.test(v) && v.length <= 2048), {
      message: "URL 은 http/https · 2048자",
    });

const uuidOptional = (label: string) =>
  z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || UUID_V4_REGEX.test(v), {
      message: `${label}은(는) UUID 형식이어야 합니다.`,
    });

const intOptional = (min: number, label: string) =>
  z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || /^[0-9]+$/.test(v), {
      message: `${label}은(는) 양의 정수`,
    })
    .refine((v) => v === null || v === undefined || Number(v) >= min, {
      message: `${label}은(는) ${min} 이상`,
    });

const intRequired = (min: number, max: number, label: string) =>
  z
    .string({ required_error: `${label}은(는) 필수입니다.` })
    .transform((v) => v.trim())
    .refine((v) => /^[0-9]+$/.test(v), { message: `${label}은(는) 양의 정수` })
    .refine((v) => {
      const n = Number(v);
      return n >= min && n <= max;
    }, { message: `${label}은(는) ${min}~${max}` });

// EC-FORM-02: v0.1 단계 status enum subset
export const EatStatusSchema = z.enum(["draft"], {
  errorMap: () => ({ message: "v0.1 단계 발행 상태는 draft 만 허용됩니다 (EC-DEFER-12)" }),
});

// EC-FORM-03 (DOI anchored — DB CHECK 와 동일)
export const DOI_REGEX = /^10\.[0-9]{4,9}\/[-._;()/:A-Z0-9a-z]+$/;
export const PUBMED_ID_REGEX = /^[0-9]{1,9}$/;
export const SLUG_REGEX_LONG = /^[a-z0-9][a-z0-9-]{2,99}$/;
export const SLUG_REGEX_SHORT = /^[a-z0-9][a-z0-9-]{2,63}$/;

// === ArticleCategory ===

export const ArticleCategoryInputSchema = z.object({
  slug: requiredTrimmed(3, 64, "slug").refine((v) => SLUG_REGEX_SHORT.test(v), {
    message: "slug 는 소문자/숫자/하이픈 (3~64자)",
  }),
  name: requiredTrimmed(1, 50, "이름"),
  description: optionalTrimmed(200).refine(
    (v) => v === null || v === undefined || v.length >= 80,
    { message: "설명은 입력 시 80~200자" },
  ),
  displayOrder: intRequired(0, 9999, "표시 순서"),
});

export type ArticleCategoryInput = z.infer<typeof ArticleCategoryInputSchema>;

// === Publication ===

const authorsSchema = z
  .string({ required_error: "저자는 필수입니다." })
  .transform((v) => v.trim())
  .transform((v) =>
    v
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0),
  )
  .refine((arr) => arr.length >= 1, { message: "저자는 1명 이상" })
  .refine((arr) => arr.every((s) => s.length <= 100), { message: "저자명은 100자 이내" });

export const PublicationInputSchema = z.object({
  slug: requiredTrimmed(3, 100, "slug").refine((v) => SLUG_REGEX_LONG.test(v), {
    message: "slug 는 소문자/숫자/하이픈 (3~100자)",
  }),
  title: requiredTrimmed(1, 300, "제목"),
  authors: authorsSchema,
  journal: optionalTrimmed(200),
  publishedDate: isoDateRequired("게재일"),
  doi: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || DOI_REGEX.test(v), {
      message: "DOI 형식 오류 (예: 10.1000/xyz123)",
    }),
  pubmedId: z
    .string()
    .transform((v) => v.trim())
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .refine((v) => v === null || v === undefined || PUBMED_ID_REGEX.test(v), {
      message: "PubMed ID 는 1~9 자리 숫자",
    }),
  url: httpUrlRequired("URL"),
  thumbnailUrl: httpUrlOptional(),
  summary: requiredTrimmed(50, 300, "요약"),
  authorDoctorId: uuidOptional("저자(의료진)"),
  status: EatStatusSchema,
});

export type PublicationInput = z.infer<typeof PublicationInputSchema>;

// === MediaAppearance ===

export const MEDIA_CHANNEL_TYPES = ["broadcast", "youtube", "podcast", "press"] as const;

export const MediaAppearanceInputSchema = z.object({
  slug: requiredTrimmed(3, 100, "slug").refine((v) => SLUG_REGEX_LONG.test(v), {
    message: "slug 는 소문자/숫자/하이픈 (3~100자)",
  }),
  title: requiredTrimmed(1, 300, "제목"),
  channelName: requiredTrimmed(1, 100, "채널명"),
  channelType: z.enum(MEDIA_CHANNEL_TYPES, {
    errorMap: () => ({ message: "채널 종류는 broadcast/youtube/podcast/press 중 하나" }),
  }),
  publishedDate: isoDateRequired("게재일"),
  durationSeconds: intOptional(1, "길이(초)"),
  url: httpUrlRequired("URL"),
  thumbnailUrl: httpUrlOptional(),
  summary: requiredTrimmed(50, 300, "요약"),
  authorDoctorId: uuidOptional("출연 의료진"),
  status: EatStatusSchema,
});

export type MediaAppearanceInput = z.infer<typeof MediaAppearanceInputSchema>;

// === FAQ ===

export const FaqInputSchema = z.object({
  slug: requiredTrimmed(3, 100, "slug").refine((v) => SLUG_REGEX_LONG.test(v), {
    message: "slug 는 소문자/숫자/하이픈 (3~100자)",
  }),
  question: requiredTrimmed(10, 200, "질문"),
  answer: requiredTrimmed(50, 2000, "답변"),
  displayOrder: intRequired(0, 9999, "표시 순서"),
  categoryId: uuidOptional("카테고리"),
  authorDoctorId: uuidOptional("작성자(의료진)"),
  relatedTreatmentId: uuidOptional("관련 진료 페이지"),
  status: EatStatusSchema,
});

export type FaqInput = z.infer<typeof FaqInputSchema>;

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content '"'apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts' | ForEach-Object { "'$i++; if($i -ge 120 -and $i -le 155){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content '"'apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts' | ForEach-Object { "'$i++; if($i -ge 105 -and $i -le 165){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content '"'packages/core-content/migrations/C0013_article_category_fk.sql' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content '"'packages/db/migrations/D0014_public_reader_eat.sql' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
 succeeded in 657ms:
   1: -- @glitzy/core-content — C0013 Article.category_id staged migration
   2: -- EC-SCHEMA-05·06·07 · cycle 1 ECP-03·09 정합: PSR-DEFER-15 해소.
   3: -- staged 4 step (단일 migration 안):
   4: --   (1) ADD COLUMN nullable
   5: --   (2) default `general` ArticleCategory 행 backfill (instance 별 idempotent INSERT)
   6: --   (3) 기존 article row 의 category_id 를 default category 로 backfill
   7: --   (4) SET NOT NULL + composite FK
   8: -- Precondition: C0005 article · C0009 article_category
   9: 
  10: -- (1) ADD COLUMN nullable
  11: ALTER TABLE article ADD COLUMN category_id UUID;
  12: 
  13: -- (2) instance 별 default `general` ArticleCategory 행 INSERT (idempotent)
  14: --   기존 instance backfill — seed.ts 가 신규 instance 에서 자동 INSERT 책임 (EC-SCHEMA-03)
  15: INSERT INTO article_category (instance_id, slug, name, display_order)
  16: SELECT i.id, 'general', '일반', 0
  17: FROM instance i
  18: WHERE NOT EXISTS (
  19:   SELECT 1 FROM article_category ac
  20:   WHERE ac.instance_id = i.id AND ac.slug = 'general'
  21: );
  22: 
  23: -- (3) 기존 article row 의 category_id 를 default category 로 backfill
  24: UPDATE article a
  25: SET category_id = ac.id
  26: FROM article_category ac
  27: WHERE a.instance_id = ac.instance_id
  28:   AND ac.slug = 'general'
  29:   AND a.category_id IS NULL;
  30: 
  31: -- (4) SET NOT NULL + composite FK (same-tenant)
  32: ALTER TABLE article ALTER COLUMN category_id SET NOT NULL;
  33: 
  34: ALTER TABLE article ADD CONSTRAINT article_category_fk
  35:   FOREIGN KEY (instance_id, category_id)
  36:   REFERENCES article_category (instance_id, id)
  37:   ON DELETE NO ACTION;
  38: 
  39: CREATE INDEX article_category_idx ON article (instance_id, category_id);

 succeeded in 666ms:
   1: -- @glitzy/db — D0014 app_public_reader EAT 4 table GRANT + per-table SELECT policy
   2: -- SoT: EAT_CONTENT_PLAN v1.0 § 2.6 EC-SCHEMA-16·17 · EC-CASCADE-05
   3: --
   4: -- D0011 패턴 정합. publication / media_appearance 는 published only (D0011 article 패턴).
   5: -- faq 는 published only — v0.1 단계 DB CHECK 가 status='draft' 만 허용 → 자동 0 row.
   6: -- article_category 는 taxonomy public 의도 — instance_id only (status 없음, EC-SCHEMA-17 결정).
   7: --
   8: -- Precondition: D0011 (app_public_reader) · C0009 article_category · C0010 publication · C0011 media_appearance · C0012 faq
   9: 
  10: GRANT SELECT ON article_category, publication, media_appearance, faq TO app_public_reader;
  11: 
  12: -- ===== article_category: taxonomy public — instance_id only =====
  13: -- 분류 자체는 instance scope 안 모든 row public. status 없음 (분류 메타).
  14: -- 본 결정은 D0011 published-only 패턴과 다른 의도 — EC-SCHEMA-17.
  15: CREATE POLICY public_reader_article_category_select
  16:   ON article_category FOR SELECT TO app_public_reader
  17:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
  18: 
  19: -- ===== publication: published + 미래 발행 제외 (D0011 article 패턴 정합) =====
  20: CREATE POLICY public_reader_publication_select
  21:   ON publication FOR SELECT TO app_public_reader
  22:   USING (
  23:     instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
  24:     AND status = 'published'
  25:     AND published_at IS NOT NULL
  26:     AND published_at <= now()
  27:   );
  28: 
  29: -- ===== media_appearance: published + 미래 발행 제외 =====
  30: CREATE POLICY public_reader_media_appearance_select
  31:   ON media_appearance FOR SELECT TO app_public_reader
  32:   USING (
  33:     instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
  34:     AND status = 'published'
  35:     AND published_at IS NOT NULL
  36:     AND published_at <= now()
  37:   );
  38: 
  39: -- ===== faq: published only =====
  40: -- v0.1 단계 DB CHECK 가 status='draft' 만 허용 → 자동 0 row → /faq 페이지 빈 페이지 200.
  41: -- LegalDocument 패턴 정합 (LOCATION_LEGAL § 3.2 PSR-DATA-07).
  42: CREATE POLICY public_reader_faq_select
  43:   ON faq FOR SELECT TO app_public_reader
  44:   USING (
  45:     instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
  46:     AND status = 'published'
  47:   );

2026-05-18T07:47:35.021633Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m $i=0; [36;1mGet-Content 'apps/web/src/app/(admin)/admin/[instanceSlug]/cate[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

 exited 1 in 797ms:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m $i=0; [36;1mGet-Content 'apps/web/src/app/(admin)/admin/[instanceSlug]/arti[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

 exited 1 in 797ms:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m $i=0; [36;1mGet-Content 'apps/web/src/app/(admin)/admin/[instanceSlug]/cate[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

2026-05-18T07:47:35.021942Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m $i=0; [36;1mGet-Content 'apps/web/src/app/(admin)/admin/[instanceSlug]/arti[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts' | ForEach-Object { "'$i++; if($i -ge 120 -and $i -le 155){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts' | ForEach-Object { "'$i++; if($i -ge 105 -and $i -le 165){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts' | ForEach-Object { "'$i++; if($i -ge 165 -and $i -le 205){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts' | ForEach-Object { "'$i++; if($i -ge 24 -and $i -le 75){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
 succeeded in 659ms:
 120: 
 121: export async function deleteCategory(instanceSlug: string, slug: string): Promise<DeleteResult> {
 122:   const aCtx = await resolveActionContext(instanceSlug);
 123:   const sqlBase = getSqlBase();
 124: 
 125:   try {
 126:     const result = await withSkeletonTx(
 127:       { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
 128:       async (tx, ctx) => {
 129:         assertActionEligibility(ctx, "operator-edit-content");
 130:         // default `general` 카테고리는 삭제 차단 — Article.category_id NOT NULL FK 무결성.
 131:         const targetRows = await tx<{ id: string; slug: string }[]>`
 132:           SELECT id, slug FROM article_category
 133:            WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${slug}
 134:            LIMIT 1
 135:         `;
 136:         if (targetRows.length === 0) return { deleted: 0 };
 137:         if (targetRows[0]!.slug === "general") {
 138:           return { deleted: 0, action: "default-protected" as const };
 139:         }
 140:         const refCount = await tx<{ cnt: number }[]>`
 141:           SELECT COUNT(*)::int AS cnt FROM article
 142:            WHERE instance_id = ${ctx.instanceId}::uuid AND category_id = ${targetRows[0]!.id}::uuid
 143:         `;
 144:         if ((refCount[0]?.cnt ?? 0) > 0) {
 145:           return { deleted: 0, action: "in-use" as const };
 146:         }
 147:         const deleted = await tx<{ id: string }[]>`
 148:           DELETE FROM article_category
 149:            WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${slug}
 150:            RETURNING id
 151:         `;
 152:         return { deleted: deleted.length };
 153:       },
 154:     );
 155: 

 succeeded in 650ms:
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
  52:           await tx`
  53:             UPDATE article_category
  54:                SET slug = ${parsed.data.slug},
  55:                    name = ${parsed.data.name},
  56:                    description = ${parsed.data.description ?? null},
  57:                    display_order = ${Number(parsed.data.displayOrder)},
  58:                    updated_at = now()
  59:              WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
  60:           `;
  61:           return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const };
  62:         }
  63: 
  64:         await tx`
  65:           INSERT INTO article_category (instance_id, slug, name, description, display_order)
  66:           VALUES (
  67:             ${ctx.instanceId}::uuid,
  68:             ${parsed.data.slug},
  69:             ${parsed.data.name},
  70:             ${parsed.data.description ?? null},
  71:             ${Number(parsed.data.displayOrder)}
  72:           )
  73:         `;
  74:         return { ok: true as const, ctx, slug: parsed.data.slug, mode: "insert" as const };
  75:       },

 succeeded in 664ms:
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
 131:       // EAT_CONTENT v1.0 (EC-SCHEMA-05): categoryId resolve — form 값 없으면 default `general` ArticleCategory.
 132:       let resolvedCategoryId: string;
 133:       if (parsed.data.categoryId) {
 134:         resolvedCategoryId = parsed.data.categoryId;
 135:       } else if (currentCategoryId !== null) {
 136:         resolvedCategoryId = currentCategoryId;
 137:       } else {
 138:         const defaultCategoryRows = await tx<{ id: string }[]>`
 139:           SELECT id FROM article_category
 140:            WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'general'
 141:            LIMIT 1
 142:         `;
 143:         if (defaultCategoryRows.length === 0) {
 144:           return { ok: false as const, action: "default-category-missing" as const };
 145:         }
 146:         resolvedCategoryId = defaultCategoryRows[0]!.id;
 147:       }
 148: 
 149:       // cycle2-3entity WEB-19 + cycle5 WEB-49: authorDoctorId 검증 (locked row 의 currentAuthorId 기준)
 150:       if (parsed.data.authorDoctorId) {
 151:         const doctorRows = await tx<{ id: string; active: boolean }[]>`
 152:           SELECT id, active FROM doctor_profile
 153:            WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${parsed.data.authorDoctorId}::uuid
 154:            LIMIT 1
 155:         `;
 156:         if (doctorRows.length === 0) {
 157:           return { ok: false as const, action: "author-not-found" as const };
 158:         }
 159:         const d = doctorRows[0]!;
 160:         if (!d.active && d.id !== currentAuthorId) {
 161:           return { ok: false as const, action: "author-inactive" as const };
 162:         }
 163:       }
 164: 
 165:       if (originalSlug !== null) {

 succeeded in 673ms:
 165:       if (originalSlug !== null) {
 166:         const newPublishedAt = isPublished ? (beforePublishedAt ?? new Date()) : null;
 167:         await tx`
 168:           UPDATE article
 169:              SET slug = ${parsed.data.slug},
 170:                  title = ${parsed.data.title},
 171:                  summary = ${parsed.data.summary},
 172:                  body_markdown = ${parsed.data.bodyMarkdown},
 173:                  status = ${parsed.data.status}::content_publication_status,
 174:                  risk_level = ${parsed.data.riskLevel ? parsed.data.riskLevel : null}::risk_level,
 175:                  hero_image_url = ${parsed.data.heroImageUrl ?? null},
 176:                  author_doctor_id = ${parsed.data.authorDoctorId ?? null}::uuid,
 177:                  category_id = ${resolvedCategoryId}::uuid,
 178:                  published_at = ${newPublishedAt},
 179:                  updated_at = now()
 180:            WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
 181:         `;
 182:         return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const };
 183:       }
 184: 
 185:       await tx`
 186:         INSERT INTO article (
 187:           instance_id, slug, title, summary, body_markdown, status, risk_level, hero_image_url, author_doctor_id, category_id, published_at
 188:         ) VALUES (
 189:           ${ctx.instanceId}::uuid,
 190:           ${parsed.data.slug},
 191:           ${parsed.data.title},
 192:           ${parsed.data.summary},
 193:           ${parsed.data.bodyMarkdown},
 194:           ${parsed.data.status}::content_publication_status,
 195:           ${parsed.data.riskLevel ? parsed.data.riskLevel : null}::risk_level,
 196:           ${parsed.data.heroImageUrl ?? null},
 197:           ${parsed.data.authorDoctorId ?? null}::uuid,
 198:           ${resolvedCategoryId}::uuid,
 199:           ${isPublished ? new Date() : null}
 200:         )
 201:       `;
 202:       return { ok: true as const, ctx, slug: parsed.data.slug, mode: "insert" as const };
 203:     });
 204: 
 205:     if (txResult.ok === false) {

codex
SQL은 대체로 SoT를 따라가지만, C0013은 “idempotent”로 보기 어렵고 category 관리/Article 저장 쪽에 무결성 경계가 있습니다. 렌더링 계층에서는 FAQ 공개 페이지와 JSON-LD 생성이 실제 데이터 게이트와 충돌하지 않는지 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "ScholarlyArticle|VideoObject|FAQPage|Question|Answer|articleEntity|categorySlug|renderMarkdownToPlainText|@id|subjectOf|mainEntity|allowlist|BroadcastEvent|NewsArticle" apps/web/src/lib/json-ld/entities.ts apps/web/src/lib/json-ld/builders.ts apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts apps/web/src/lib/markdown.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"publication|media_appearance|faq|article_category|category_slug|JOIN|LEFT JOIN|rel=|nofollow|noopener|noreferrer|details|summary|JsonLdScript|faqPageGraph|doctorProfileGraph|aboutGraph|sitemap|lastmod|published\" 'apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx' 'apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx' 'apps/web/src/app/(site)/[instanceSlug]/about/page.tsx' 'apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx' 'apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"href=|rel=|target=|nofollow|noopener|noreferrer|publication.url|media.url|external\" 'apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx' 'apps/web/src/app/(site)/[instanceSlug]/about/page.tsx'" in C:\Users\assag\solution\website-exposure
 succeeded in 598ms:
apps/web/src/lib/markdown.ts:141: *   Markdown → plain text strip — JSON-LD `Answer.text` 용.
apps/web/src/lib/markdown.ts:144:export function renderMarkdownToPlainText(input: string): string {
apps/web/src/lib/json-ld/builders.ts:3:// v0.4 EAT_CONTENT v1.0: Doctor/About graph self-contained 확장 (ScholarlyArticle/VideoObject 풀 entity)
apps/web/src/lib/json-ld/builders.ts:41://   v0.4 EC-RENDER-03: MedicalClinic.subjectOf 단일 결정 (Organization 미사용).
apps/web/src/lib/json-ld/builders.ts:42://   Publication/Media 풀 entity 출력 — fragment-scoped @id (`/about#publication-{slug}` · `/about#video-{slug}`).
apps/web/src/lib/json-ld/builders.ts:56:  // MedicalClinic.subjectOf array (fragment ref) — graph 안 entity 모두 self-contained 이므로 ref 만.
apps/web/src/lib/json-ld/builders.ts:57:  const subjectOfRefs: Array<{ "@id": string }> = [];
apps/web/src/lib/json-ld/builders.ts:58:  for (const p of publications) subjectOfRefs.push({ "@id": `${aboutBaseUrl}#publication-${p.slug}` });
apps/web/src/lib/json-ld/builders.ts:59:  for (const m of media) subjectOfRefs.push({ "@id": `${aboutBaseUrl}#video-${m.slug}` });
apps/web/src/lib/json-ld/builders.ts:62:  if (clinicEntity !== null && subjectOfRefs.length > 0) {
apps/web/src/lib/json-ld/builders.ts:63:    clinicEntity = { ...clinicEntity, subjectOf: subjectOfRefs };
apps/web/src/lib/json-ld/builders.ts:79://   rule checker 의 cross-page allowlist 로 통과 (PSRC-16 patch).
apps/web/src/lib/json-ld/builders.ts:100://   fragment-scoped @id (`/doctors/{slug}#publication-{...}` · `#video-{...}`).
apps/web/src/lib/json-ld/builders.ts:101://   Physician.subjectOf array (fragment ref) — graph 안 cross-ref.
apps/web/src/lib/json-ld/builders.ts:114:  const subjectOfRefs: Array<{ "@id": string }> = [];
apps/web/src/lib/json-ld/builders.ts:115:  for (const p of publications) subjectOfRefs.push({ "@id": `${doctorBaseUrl}#publication-${p.slug}` });
apps/web/src/lib/json-ld/builders.ts:116:  for (const m of media) subjectOfRefs.push({ "@id": `${doctorBaseUrl}#video-${m.slug}` });
apps/web/src/lib/json-ld/builders.ts:119:  if (subjectOfRefs.length > 0) {
apps/web/src/lib/json-ld/builders.ts:120:    physicianEntity = { ...physicianEntity, subjectOf: subjectOfRefs };
apps/web/src/lib/json-ld/builders.ts:180:// v0.4 EC-RENDER-04: article.categorySlug 직접 사용 — category 인자 제거.
apps/web/src/lib/json-ld/builders.ts:189:    E.articleEntity(ctx, article, author),
apps/web/src/lib/json-ld/builders.ts:215://   SCHEMA_MAPPING § 6.3. FAQPage + Question[] mainEntity inline.
apps/web/src/lib/json-ld/builders.ts:216://   v0.1 단계 published 차단 (DB CHECK status='draft' 만) → faqs 0 row 가능, 빈 mainEntity [].
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:118:    expect(validateExpectedEntities(graph, ["Organization", "Physician", "WebPage", "BreadcrumbList", "ScholarlyArticle"])).toEqual({ ok: true });
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:121:  // # 25 — VideoObject duration ISO 8601
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:122:  it("MediaAppearance VideoObject duration PT{seconds}S", () => {
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:125:    expect(entity["@type"]).toBe("VideoObject");
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:126:    expect(entity["@id"]).toBe(`${SITE_BASE_URL}/doctors/hong#video-${MEDIA.slug}`);
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:139:  // # 27 — FAQPage graph 안 mainEntity 0건 (v0.1 published 차단 → 0 row)
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:140:  it("FAQPage empty mainEntity OK", () => {
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:144:    const faqEntity = graph["@graph"].find((e) => e["@type"] === "FAQPage");
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:146:    expect((faqEntity!["mainEntity"] as unknown[]).length).toBe(0);
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:149:  // # 31 — ScholarlyArticle identifier array (DOI + PubMedID)
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:150:  it("ScholarlyArticle identifier — 2 PropertyValue", () => {
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:163:  // # 32 — 모든 4 channel_type → VideoObject (단일화 v0.1)
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:164:  it("VideoObject — 모든 channel_type 동일 @type 단일화", () => {
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:170:      expect(entity["@type"]).toBe("VideoObject");
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:171:      expect(entity["@id"]).toBe(`${SITE_BASE_URL}/about#video-t-${channelType}`);
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:176:  //   대신 articleDetailGraph 의 @id 가 categorySlug 사용함을 검증 (이미 validate.test.ts 에서 통과).
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:178:  // # 34 — FAQ markdown answer 안 <script> payload → JSON-LD Answer.text 평문 strip
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:179:  it("FAQ Markdown <script> payload — JSON-LD Answer.text strip", async () => {
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:182:    const plain = mod.renderMarkdownToPlainText(dangerous);
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:187:  // # 35 — Doctor Profile graph self-contained — 풀 entity 모두 fragment-scoped @id
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:188:  it("Doctor Profile graph self-contained — fragment-scoped @id", () => {
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:193:    const pubEntity = graph["@graph"].find((e) => e["@type"] === "ScholarlyArticle");
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:194:    const mediaEntity = graph["@graph"].find((e) => e["@type"] === "VideoObject");
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:195:    expect(pubEntity!["@id"]).toBe(`${SITE_BASE_URL}/doctors/hong#publication-${PUB.slug}`);
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:196:    expect(mediaEntity!["@id"]).toBe(`${SITE_BASE_URL}/doctors/hong#video-${MEDIA.slug}`);
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:213:  // About — graph self-contained · MedicalClinic.subjectOf array (cycle 1 ECP-15 정정 — Organization 미사용)
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:214:  it("About graph — MedicalClinic.subjectOf array (Organization 미사용)", () => {
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:221:    expect(orgEntity!["subjectOf"]).toBeUndefined();
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:222:    expect(clinicEntity!["subjectOf"]).toBeDefined();
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:223:    expect((clinicEntity!["subjectOf"] as Array<{ "@id": string }>).length).toBe(2);
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:226:  // FAQPage helper — Markdown → plain text
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:227:  it("faqPageEntity — Answer.text plain text (sanitize)", () => {
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:230:    const mainEntity = entity["mainEntity"] as Array<{ acceptedAnswer: { text: string } }>;
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:231:    expect(mainEntity.length).toBe(1);
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:232:    expect(mainEntity[0]!.acceptedAnswer.text).not.toContain("**");
apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts:233:    expect(mainEntity[0]!.acceptedAnswer.text).toContain("개인차가 있으나");
apps/web/src/lib/json-ld/entities.ts:3:// v0.4 EAT_CONTENT v1.0 cascade: ScholarlyArticle · VideoObject · FAQPage · Question/Answer
apps/web/src/lib/json-ld/entities.ts:17:import { renderMarkdownToPlainText } from "@/lib/markdown";
apps/web/src/lib/json-ld/entities.ts:29:    "@id": id,
apps/web/src/lib/json-ld/entities.ts:42:// PSRC-14 patch: ContactPoint @id 를 absolute pattern (`${siteBaseUrl}/#contact-...`) 으로 통일
apps/web/src/lib/json-ld/entities.ts:47:    "@id": `${ctx.siteBaseUrl}/#contact-${cta.id}`,
apps/web/src/lib/json-ld/entities.ts:60:    "@id": `${ctx.siteBaseUrl}/#clinic`,
apps/web/src/lib/json-ld/entities.ts:62:    parentOrganization: { "@id": `${ctx.siteBaseUrl}/#organization` },
apps/web/src/lib/json-ld/entities.ts:92:  return { "@type": "Reference", "@id": `${ctx.siteBaseUrl}/#clinic` };
apps/web/src/lib/json-ld/entities.ts:96:  return { "@type": "Reference", "@id": `${ctx.siteBaseUrl}/#organization` };
apps/web/src/lib/json-ld/entities.ts:102:    "@id": `${ctx.siteBaseUrl}/doctors/${doctor.slug}#physician`,
apps/web/src/lib/json-ld/entities.ts:107:    worksFor: { "@id": `${ctx.siteBaseUrl}/#organization` },
apps/web/src/lib/json-ld/entities.ts:115:    "@id": `${ctx.siteBaseUrl}/treatments/${treatment.slug}#procedure`,
apps/web/src/lib/json-ld/entities.ts:122:export function articleEntity(
apps/web/src/lib/json-ld/entities.ts:131:      "@id": `${ctx.siteBaseUrl}/doctors/${author.slug}#physician`,
apps/web/src/lib/json-ld/entities.ts:139:    // v0.4 EC-RENDER-04 (PSR-DEFER-15 해소): article.categorySlug 직접 사용 — 호출자 별 category 인자 제거.
apps/web/src/lib/json-ld/entities.ts:140:    "@id": `${ctx.siteBaseUrl}/insights/${article.categorySlug}/${article.slug}#article`,
apps/web/src/lib/json-ld/entities.ts:146:    publisher: { "@id": `${ctx.siteBaseUrl}/#organization` },
apps/web/src/lib/json-ld/entities.ts:152://   `isPartOf` 의 WebSite 참조는 cross-page reference allowlist 대상 (PSRC-16 patch).
apps/web/src/lib/json-ld/entities.ts:156:    "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#webpage`,
apps/web/src/lib/json-ld/entities.ts:161:    isPartOf: { "@id": `${ctx.siteBaseUrl}/#website` },
apps/web/src/lib/json-ld/entities.ts:168:    "@id": `${ctx.siteBaseUrl}/#website`,
apps/web/src/lib/json-ld/entities.ts:172:    publisher: { "@id": `${ctx.siteBaseUrl}/#organization` },
apps/web/src/lib/json-ld/entities.ts:182:    "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#breadcrumb`,
apps/web/src/lib/json-ld/entities.ts:201:    "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#${listId}`,
apps/web/src/lib/json-ld/entities.ts:205:      item: { "@type": it.itemType, "@id": it.itemId, name: it.name },
apps/web/src/lib/json-ld/entities.ts:214:// === EAT_CONTENT v1.0 — ScholarlyArticle (C-24 Publication) ===
apps/web/src/lib/json-ld/entities.ts:215://   SCHEMA_MAPPING § 6.1. fragment-scoped @id (Doctor/About page 안 inline).
apps/web/src/lib/json-ld/entities.ts:222:  // PropertyValue 는 inline value object (`@id` 없음 — JSON-LD 사양상 허용).
apps/web/src/lib/json-ld/entities.ts:223:  //   JsonLdEntity 의 `@id` 는 graph top-level entity 에만 요구되므로 inline 은 unknown 으로 expose.
apps/web/src/lib/json-ld/entities.ts:232:    "@type": "ScholarlyArticle",
apps/web/src/lib/json-ld/entities.ts:233:    "@id": `${pageBaseUrl}#publication-${pub.slug}`,
apps/web/src/lib/json-ld/entities.ts:242:    publisher: { "@id": `${ctx.siteBaseUrl}/#organization` },
apps/web/src/lib/json-ld/entities.ts:246:// === EAT_CONTENT v1.0 — VideoObject (C-25 MediaAppearance) ===
apps/web/src/lib/json-ld/entities.ts:247://   SCHEMA_MAPPING § 6.2. v0.1 단계 모든 channel_type → VideoObject 단일화 (EC-DEFER-11 까지).
apps/web/src/lib/json-ld/entities.ts:253:    "@type": "VideoObject",
apps/web/src/lib/json-ld/entities.ts:254:    "@id": `${pageBaseUrl}#video-${media.slug}`,
apps/web/src/lib/json-ld/entities.ts:265:// === EAT_CONTENT v1.0 — FAQPage / Question / Answer (C-12 FAQ) ===
apps/web/src/lib/json-ld/entities.ts:271:  const mainEntity = faqs.map((f) => ({
apps/web/src/lib/json-ld/entities.ts:272:    "@type": "Question",
apps/web/src/lib/json-ld/entities.ts:274:    acceptedAnswer: {
apps/web/src/lib/json-ld/entities.ts:275:      "@type": "Answer",
apps/web/src/lib/json-ld/entities.ts:276:      text: renderMarkdownToPlainText(f.answer),
apps/web/src/lib/json-ld/entities.ts:280:    "@type": "FAQPage",
apps/web/src/lib/json-ld/entities.ts:281:    "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#faqpage`,
apps/web/src/lib/json-ld/entities.ts:283:    mainEntity,

 succeeded in 594ms:
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:1:// @glitzy/web/(site)/[instanceSlug]/sitemap.xml — per-instance sitemap
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:2:// SoT: SEARCH_STANDARDIZATION § 4.2 형식 + § 4.3 changefreq/priority + § 4.4 lastmod
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:3://      PUBLIC_SITE_RENDER_PLAN v1.0 § 5.2 PSR-SEO-07 (P-013 sitemap 제외)
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:11:  lastmod: string; // ISO 8601
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:31:    // PSRC-07 patch: lastmod aggregate — list 페이지는 max(updated_at) 사용
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:35:    const treatmentRows = await tx<{ slug: string; published_at: Date | null; updated_at: Date }[]>`
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:36:      SELECT slug, published_at, updated_at FROM treatment_page ORDER BY published_at DESC NULLS LAST
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:41:    // v0.4 EC-RENDER-06 (cycle 1 ECP-17): article sitemap URL — 실 category slug 사용 (JOIN article_category).
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:42:    const articleRows = await tx<{ slug: string; category_slug: string; published_at: Date | null; updated_at: Date }[]>`
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:43:      SELECT a.slug, ac.slug AS category_slug, a.published_at, a.updated_at
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:45:        JOIN article_category ac
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:47:       ORDER BY a.published_at DESC NULLS LAST
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:49:    // v0.4 EC-RENDER-06 (cycle 1 ECP-21): faq sitemap entry — published row 0건이어도 페이지 포함.
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:50:    //   lastmod fallback: clinic.updated_at.
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:51:    const faqAggRows = await tx<{ latest: Date | null }[]>`
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:52:      SELECT MAX(updated_at) AS latest FROM faq
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:62:      faqLastmod: faqAggRows[0]?.latest?.toISOString() ?? clinicRows[0]?.updated_at.toISOString() ?? new Date().toISOString(),
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:69:  entries.push({ loc: `${base}`, lastmod: data.clinicLastmod, changefreq: "weekly", priority: "1.0" });
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:71:  entries.push({ loc: `${base}/about`, lastmod: data.clinicLastmod, changefreq: "monthly", priority: "0.8" });
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:73:  entries.push({ loc: `${base}/doctors`, lastmod: data.doctorListLastmod, changefreq: "monthly", priority: "0.7" });
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:76:    entries.push({ loc: `${base}/doctors/${d.slug}`, lastmod: d.updated_at.toISOString(), changefreq: "monthly", priority: "0.7" });
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:79:  entries.push({ loc: `${base}/treatments`, lastmod: data.treatmentListLastmod, changefreq: "monthly", priority: "0.8" });
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:84:      lastmod: (t.published_at ?? t.updated_at).toISOString(),
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:92:      loc: `${base}/insights/${a.category_slug}/${a.slug}`,
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:93:      lastmod: (a.published_at ?? a.updated_at).toISOString(),
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:98:  // P-011 FAQ — v0.4 EC-RENDER-06 (cycle 1 ECP-21): published row 0건이어도 페이지 포함.
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:99:  entries.push({ loc: `${base}/faq`, lastmod: data.faqLastmod, changefreq: "monthly", priority: "0.5" });
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:101:  entries.push({ loc: `${base}/contact`, lastmod: data.clinicLastmod, changefreq: "yearly", priority: "0.6" });
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:106:      lastmod: data.locationMain.updated_at.toISOString(),
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:111:  // P-013 Legal — v0.1 단계 sitemap 제외 (noindex · PSR-SEO-07)
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:123:    <lastmod>${e.lastmod}</lastmod>
apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts:128:<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx:3://   article JOIN article_category ON ... — category.slug 일치 검증 (mismatch → 404).
apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx:13:import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx:24:      SELECT a.slug, a.title, a.summary, a.body_markdown, a.hero_image_url,
apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx:25:             a.published_at, a.author_doctor_id, a.category_id,
apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx:26:             ac.slug AS category_slug, a.updated_at
apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx:28:        JOIN article_category ac
apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx:39:    description: a.summary,
apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx:56:      SELECT a.slug, a.title, a.summary, a.body_markdown, a.hero_image_url,
apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx:57:             a.published_at, a.author_doctor_id, a.category_id,
apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx:58:             ac.slug AS category_slug, a.updated_at
apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx:60:        JOIN article_category ac
apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx:93:      <JsonLdScript graph={graph} />
apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx:105:        <p className="mt-2 text-base text-fg-muted">{data.article.summary}</p>
apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx:107:          {data.article.publishedAt ? (
apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx:108:            <time dateTime={data.article.publishedAt.toISOString()}>
apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx:109:              {data.article.publishedAt.toISOString().slice(0, 10)}
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:18:import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:19:import { aboutGraph } from "@/lib/json-ld/builders";
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:43:    const publicationRows = await tx<PublicationRow[]>`
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:45:             to_char(published_date, 'YYYY-MM-DD') AS published_date,
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:46:             doi, pubmed_id, url, thumbnail_url, summary, author_doctor_id,
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:47:             published_at, updated_at
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:48:        FROM publication
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:49:       ORDER BY published_date DESC
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:54:             to_char(published_date, 'YYYY-MM-DD') AS published_date,
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:55:             duration_seconds, url, thumbnail_url, summary, author_doctor_id,
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:56:             published_at, updated_at
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:57:        FROM media_appearance
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:58:       ORDER BY published_date DESC
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:61:      publications: publicationRows.map(normalizePublication),
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:66:  const publications = eatData?.publications ?? [];
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:69:  const graph = aboutGraph(
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:75:    publications,
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:89:      <JsonLdScript graph={graph} />
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:111:        {publications.length > 0 ? (
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:115:              {publications.map((p) => (
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:120:                    {p.journal ? ` · ${p.journal}` : ""} · {p.publishedDate}
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:122:                  <p className="mt-2 text-sm text-fg-default">{p.summary}</p>
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:125:                    rel="nofollow noopener noreferrer"
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:154:                        {m.channelName} · {m.publishedDate}
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:157:                      <p className="mt-2 text-sm text-fg-default">{m.summary}</p>
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:160:                        rel="nofollow noopener noreferrer"
apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx:1:// @glitzy/web/(site)/[instanceSlug]/faq — P-011 FAQ public page
apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx:3://   - 데이터: faq published row (RLS 자동 — v0.1 단계 0 row 가능 · cycle 1 ECP-21).
apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx:4://   - 표시: Q&A 카드 list (display_order asc, id asc) — <details> collapsible.
apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx:15:import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx:16:import { faqPageGraph } from "@/lib/json-ld/builders";
apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx:28:    canonicalPath: "/faq",
apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx:37:  const faqsOrNull = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx:40:             author_doctor_id, published_at, updated_at
apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx:41:        FROM faq
apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx:47:  const faqs = faqsOrNull ?? [];
apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx:52:  const graph = faqPageGraph(
apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx:53:    { siteBaseUrl: hostOrigin, pagePath: "/faq" },
apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx:55:    faqs,
apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx:61:      <JsonLdScript graph={graph} />
apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx:67:        {faqs.length === 0 ? (
apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx:73:            {faqs.map((f) => (
apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx:75:                <details className="group">
apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx:76:                  <summary className="cursor-pointer list-none px-4 py-3 text-base font-medium text-fg-default">
apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx:79:                  </summary>
apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx:85:                </details>
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:22:import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:23:import { doctorProfileGraph } from "@/lib/json-ld/builders";
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:67:      SELECT a.slug, a.title, a.summary, a.body_markdown, a.hero_image_url,
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:68:             a.published_at, a.author_doctor_id, a.category_id,
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:69:             ac.slug AS category_slug, a.updated_at
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:71:        JOIN article_category ac
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:74:       ORDER BY a.published_at DESC NULLS LAST
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:77:    const publicationRows = await tx<PublicationRow[]>`
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:79:             to_char(published_date, 'YYYY-MM-DD') AS published_date,
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:80:             doi, pubmed_id, url, thumbnail_url, summary, author_doctor_id,
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:81:             published_at, updated_at
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:82:        FROM publication
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:84:       ORDER BY published_date DESC
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:89:             to_char(published_date, 'YYYY-MM-DD') AS published_date,
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:90:             duration_seconds, url, thumbnail_url, summary, author_doctor_id,
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:91:             published_at, updated_at
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:92:        FROM media_appearance
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:94:       ORDER BY published_date DESC
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:99:      publications: publicationRows.map(normalizePublication),
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:107:  const graph = doctorProfileGraph(
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:112:    data.publications,
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:126:      <JsonLdScript graph={graph} />
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:154:                  <p className="mt-1 text-sm text-fg-muted">{a.summary}</p>
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:161:        {data.publications.length > 0 ? (
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:165:              {data.publications.map((p) => (
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:170:                    {p.journal ? ` · ${p.journal}` : ""} · {p.publishedDate}
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:172:                  <p className="mt-2 text-sm text-fg-default">{p.summary}</p>
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:175:                    rel="nofollow noopener noreferrer"
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:204:                        {m.channelName} · {m.publishedDate}
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:207:                      <p className="mt-2 text-sm text-fg-default">{m.summary}</p>
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:210:                        rel="nofollow noopener noreferrer"

 succeeded in 570ms:
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:151:                  <Link href={`${base}/insights/${a.categorySlug}/${a.slug}`} className="font-medium text-brand-primary hover:text-brand-primary-hover">
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:174:                    href={p.url}
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:175:                    rel="nofollow noopener noreferrer"
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:176:                    target="_blank"
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:209:                        href={m.url}
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:210:                        rel="nofollow noopener noreferrer"
apps/web/src/app/(site)/[instanceSlug]/doctors/[slug]/page.tsx:211:                        target="_blank"
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:124:                    href={p.url}
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:125:                    rel="nofollow noopener noreferrer"
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:126:                    target="_blank"
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:159:                        href={m.url}
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:160:                        rel="nofollow noopener noreferrer"
apps/web/src/app/(site)/[instanceSlug]/about/page.tsx:161:                        target="_blank"

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content apps/web/src/lib/markdown.ts | ForEach-Object { $i++; if($i -ge 130 -and $i -le 180){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content apps/web/src/lib/json-ld/entities.ts | ForEach-Object { $i++; if($i -ge 214 -and $i -le 286){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content apps/web/src/lib/json-ld/builders.ts | ForEach-Object { $i++; if($i -ge 35 -and $i -le 130){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
 succeeded in 689ms:
  35:     E.webPageEntity(ctx, clinic.name, clinic.description),
  36:   ];
  37:   return graph(entities);
  38: }
  39: 
  40: // === P-002 About ===
  41: //   v0.4 EC-RENDER-03: MedicalClinic.subjectOf 단일 결정 (Organization 미사용).
  42: //   Publication/Media 풀 entity 출력 — fragment-scoped @id (`/about#publication-{slug}` · `/about#video-{slug}`).
  43: export function aboutGraph(
  44:   ctx: GraphBuilderContext,
  45:   clinic: ClinicProjection,
  46:   location: LocationProjection | null,
  47:   title: string,
  48:   description: string,
  49:   publications: ReadonlyArray<PublicationProjection> = [],
  50:   media: ReadonlyArray<MediaAppearanceProjection> = [],
  51: ): JsonLdGraph {
  52:   const aboutBaseUrl = `${ctx.siteBaseUrl}/about`;
  53:   const publicationEntities = publications.map((p) => E.scholarlyArticleEntity(ctx, p, aboutBaseUrl));
  54:   const mediaEntities = media.map((m) => E.videoObjectEntity(m, aboutBaseUrl));
  55: 
  56:   // MedicalClinic.subjectOf array (fragment ref) — graph 안 entity 모두 self-contained 이므로 ref 만.
  57:   const subjectOfRefs: Array<{ "@id": string }> = [];
  58:   for (const p of publications) subjectOfRefs.push({ "@id": `${aboutBaseUrl}#publication-${p.slug}` });
  59:   for (const m of media) subjectOfRefs.push({ "@id": `${aboutBaseUrl}#video-${m.slug}` });
  60: 
  61:   let clinicEntity = location ? E.medicalClinicEntity(ctx, clinic, location) : null;
  62:   if (clinicEntity !== null && subjectOfRefs.length > 0) {
  63:     clinicEntity = { ...clinicEntity, subjectOf: subjectOfRefs };
  64:   }
  65: 
  66:   return graph([
  67:     E.organizationEntity(ctx, clinic),
  68:     ...(clinicEntity ? [clinicEntity] : []),
  69:     E.webPageEntity(ctx, title, description),
  70:     E.breadcrumbListEntity(ctx, [{ name: "홈", path: "/" }, { name: "소개", path: null }]),
  71:     ...publicationEntities,
  72:     ...mediaEntities,
  73:   ]);
  74: }
  75: 
  76: // === P-003 Doctors List ===
  77: // PSRC-17 patch: plan SoT (SCHEMA_MAPPING § 2.5 + PUBLIC_SITE_RENDER § 5.4) 정합 — `[참조] MedicalClinic` only.
  78: //   풀 entity 출력 안 함. cross-page reference (`${siteBaseUrl}/#clinic` · `#organization` · `#website`) 는
  79: //   rule checker 의 cross-page allowlist 로 통과 (PSRC-16 patch).
  80: export function doctorsListGraph(
  81:   ctx: GraphBuilderContext,
  82:   clinic: ClinicProjection,
  83:   doctors: DoctorProjection[],
  84:   description: string,
  85: ): JsonLdGraph {
  86:   return graph([
  87:     E.organizationEntity(ctx, clinic),
  88:     E.webPageEntity(ctx, "의료진", description),
  89:     E.breadcrumbListEntity(ctx, [{ name: "홈", path: "/" }, { name: "의료진", path: null }]),
  90:     E.itemListEntity(
  91:       ctx,
  92:       doctors.map((d) => ({ name: d.name, itemId: `${ctx.siteBaseUrl}/doctors/${d.slug}#physician`, itemType: "Physician" as const })),
  93:       "doctors",
  94:     ),
  95:   ]);
  96: }
  97: 
  98: // === P-004 Doctor Profile ===
  99: //   v0.4 EC-RENDER-02: graph self-contained — Publication/Media 풀 entity 출력.
 100: //   fragment-scoped @id (`/doctors/{slug}#publication-{...}` · `#video-{...}`).
 101: //   Physician.subjectOf array (fragment ref) — graph 안 cross-ref.
 102: export function doctorProfileGraph(
 103:   ctx: GraphBuilderContext,
 104:   clinic: ClinicProjection,
 105:   doctor: DoctorProjection,
 106:   description: string,
 107:   publications: ReadonlyArray<PublicationProjection> = [],
 108:   media: ReadonlyArray<MediaAppearanceProjection> = [],
 109: ): JsonLdGraph {
 110:   const doctorBaseUrl = `${ctx.siteBaseUrl}/doctors/${doctor.slug}`;
 111:   const publicationEntities = publications.map((p) => E.scholarlyArticleEntity(ctx, p, doctorBaseUrl));
 112:   const mediaEntities = media.map((m) => E.videoObjectEntity(m, doctorBaseUrl));
 113: 
 114:   const subjectOfRefs: Array<{ "@id": string }> = [];
 115:   for (const p of publications) subjectOfRefs.push({ "@id": `${doctorBaseUrl}#publication-${p.slug}` });
 116:   for (const m of media) subjectOfRefs.push({ "@id": `${doctorBaseUrl}#video-${m.slug}` });
 117: 
 118:   let physicianEntity = E.physicianEntity(ctx, doctor);
 119:   if (subjectOfRefs.length > 0) {
 120:     physicianEntity = { ...physicianEntity, subjectOf: subjectOfRefs };
 121:   }
 122: 
 123:   return graph([
 124:     E.organizationEntity(ctx, clinic),
 125:     physicianEntity,
 126:     E.webPageEntity(ctx, doctor.name, description),
 127:     E.breadcrumbListEntity(ctx, [
 128:       { name: "홈", path: "/" },
 129:       { name: "의료진", path: "/doctors" },
 130:       { name: doctor.name, path: null },

 succeeded in 711ms:
 214: // === EAT_CONTENT v1.0 — ScholarlyArticle (C-24 Publication) ===
 215: //   SCHEMA_MAPPING § 6.1. fragment-scoped @id (Doctor/About page 안 inline).
 216: //   pageBaseUrl 은 Publication 이 출력되는 page URL (예: `${siteBaseUrl}/doctors/${doctor.slug}` 또는 `${siteBaseUrl}/about`).
 217: export function scholarlyArticleEntity(
 218:   ctx: GraphBuilderContext,
 219:   pub: PublicationProjection,
 220:   pageBaseUrl: string,
 221: ): JsonLdEntity {
 222:   // PropertyValue 는 inline value object (`@id` 없음 — JSON-LD 사양상 허용).
 223:   //   JsonLdEntity 의 `@id` 는 graph top-level entity 에만 요구되므로 inline 은 unknown 으로 expose.
 224:   const identifiers: Array<{ "@type": "PropertyValue"; propertyID: string; value: string }> = [];
 225:   if (pub.doi) {
 226:     identifiers.push({ "@type": "PropertyValue", propertyID: "DOI", value: pub.doi });
 227:   }
 228:   if (pub.pubmedId) {
 229:     identifiers.push({ "@type": "PropertyValue", propertyID: "PubMedID", value: pub.pubmedId });
 230:   }
 231:   return {
 232:     "@type": "ScholarlyArticle",
 233:     "@id": `${pageBaseUrl}#publication-${pub.slug}`,
 234:     headline: pub.title,
 235:     author: pub.authors.map((name) => ({ "@type": "Person", name })),
 236:     datePublished: pub.publishedDate,
 237:     ...(pub.journal ? { isPartOf: { "@type": "Periodical", name: pub.journal } } : {}),
 238:     ...(identifiers.length > 0 ? { identifier: identifiers } : {}),
 239:     url: pub.url,
 240:     description: pub.summary,
 241:     ...(pub.thumbnailUrl ? { image: pub.thumbnailUrl } : {}),
 242:     publisher: { "@id": `${ctx.siteBaseUrl}/#organization` },
 243:   };
 244: }
 245: 
 246: // === EAT_CONTENT v1.0 — VideoObject (C-25 MediaAppearance) ===
 247: //   SCHEMA_MAPPING § 6.2. v0.1 단계 모든 channel_type → VideoObject 단일화 (EC-DEFER-11 까지).
 248: export function videoObjectEntity(
 249:   media: MediaAppearanceProjection,
 250:   pageBaseUrl: string,
 251: ): JsonLdEntity {
 252:   return {
 253:     "@type": "VideoObject",
 254:     "@id": `${pageBaseUrl}#video-${media.slug}`,
 255:     name: media.title,
 256:     description: media.summary,
 257:     uploadDate: media.publishedDate,
 258:     ...(media.durationSeconds !== null ? { duration: `PT${media.durationSeconds}S` } : {}),
 259:     ...(media.thumbnailUrl ? { thumbnailUrl: media.thumbnailUrl } : {}),
 260:     contentUrl: media.url,
 261:     publisher: { "@type": "Organization", name: media.channelName },
 262:   };
 263: }
 264: 
 265: // === EAT_CONTENT v1.0 — FAQPage / Question / Answer (C-12 FAQ) ===
 266: //   SCHEMA_MAPPING § 6.3. P-011 `/<slug>/faq` page.
 267: export function faqPageEntity(
 268:   ctx: GraphBuilderContext,
 269:   faqs: ReadonlyArray<FaqProjection>,
 270: ): JsonLdEntity {
 271:   const mainEntity = faqs.map((f) => ({
 272:     "@type": "Question",
 273:     name: f.question,
 274:     acceptedAnswer: {
 275:       "@type": "Answer",
 276:       text: renderMarkdownToPlainText(f.answer),
 277:     },
 278:   }));
 279:   return {
 280:     "@type": "FAQPage",
 281:     "@id": `${ctx.siteBaseUrl}${ctx.pagePath}#faqpage`,
 282:     inLanguage: "ko-KR",
 283:     mainEntity,
 284:   };
 285: }

 succeeded in 722ms:
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
 155:   // link [text](url) → text
 156:   out = out.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
 157:   // image ![alt](url) → alt
 158:   out = out.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1");
 159:   // heading (#, ##, ###, ####) — 마커 strip
 160:   out = out.replace(/^\s*#{1,6}\s+/gm, "");
 161:   // blockquote (>)
 162:   out = out.replace(/^\s*>\s?/gm, "");
 163:   // list bullets — '- ' / '* ' / '+ ' / 'n. ' → 평문
 164:   out = out.replace(/^\s*[-*+]\s+/gm, "");
 165:   out = out.replace(/^\s*\d+\.\s+/gm, "");
 166:   // hr (--- / *** / ___)
 167:   out = out.replace(/^\s*[-_*]{3,}\s*$/gm, "");
 168:   // HTML tags — strip (sanitize-html 사용 안 함 — 평문이므로 simple strip)
 169:   out = out.replace(/<[^>]+>/g, "");
 170:   // multi blank line collapse + trim
 171:   out = out.replace(/[ \t]+/g, " ");
 172:   out = out.replace(/\n{3,}/g, "\n\n");
 173:   return out.trim();
 174: }
 175: 
 176: function isExternalLink(href: string, hostOrigin: string): boolean {
 177:   // PSRC-12 patch: protocol-relative `//evil.example/...` 도 외부 URL 로 분류 — single slash path 만 내부.
 178:   if (href.startsWith("//")) return true;
 179:   if (href.startsWith("/") || href.startsWith("#")) return false;
 180:   try {

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx' | ForEach-Object { "'$i++; if($i -ge 35 -and $i -le 90){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content apps/web/src/lib/json-ld/__tests__/eat-validate.test.ts | ForEach-Object { $i++; if($i -ge 176 -and $i -le 190){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "function renderMarkdown|dangerouslySetInnerHTML|renderMarkdownToHtml|renderMarkdown" apps/web/src/lib/markdown.ts apps/web/src/app/(site) apps/web/src/components' in C:\Users\assag\solution\website-exposure
 succeeded in 689ms:
 176:   //   대신 articleDetailGraph 의 @id 가 categorySlug 사용함을 검증 (이미 validate.test.ts 에서 통과).
 177: 
 178:   // # 34 — FAQ markdown answer 안 <script> payload → JSON-LD Answer.text 평문 strip
 179:   it("FAQ Markdown <script> payload — JSON-LD Answer.text strip", async () => {
 180:     const mod = await import("@/lib/markdown");
 181:     const dangerous = "정상 답변 텍스트 50자 이상으로 작성. <script>alert(1)</script> 본 보안 검증 입니다.";
 182:     const plain = mod.renderMarkdownToPlainText(dangerous);
 183:     expect(plain).not.toContain("<script>");
 184:     expect(plain).not.toContain("</script>");
 185:   });
 186: 
 187:   // # 35 — Doctor Profile graph self-contained — 풀 entity 모두 fragment-scoped @id
 188:   it("Doctor Profile graph self-contained — fragment-scoped @id", () => {
 189:     const ctx: GraphBuilderContext = { siteBaseUrl: SITE_BASE_URL, pagePath: "/doctors/hong" };
 190:     const graph = doctorProfileGraph(ctx, CLINIC, DOCTOR, "원장 소개", [PUB], [MEDIA]);

 succeeded in 697ms:
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
  75:                 <details className="group">
  76:                   <summary className="cursor-pointer list-none px-4 py-3 text-base font-medium text-fg-default">
  77:                     <span className="mr-2 text-blue-700">Q.</span>
  78:                     {f.question}
  79:                   </summary>
  80:                   <div
  81:                     className="prose prose-sm max-w-none px-4 pb-4 pt-1 text-fg-default"
  82:                     // sanitize-html SSR 정합 — XSS 안전.
  83:                     dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(f.answer, hostOrigin) }}
  84:                   />
  85:                 </details>
  86:               </li>
  87:             ))}
  88:           </ul>
  89:         )}
  90:       </section>

2026-05-18T07:48:20.766649Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
[31;1msite: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Markdown" apps/web/src/lib/markdown.ts apps/web/src/app/([36;1msite[0m) apps/w …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                            ~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'site' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

 exited 1 in 819ms:
[31;1msite: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Markdown" apps/web/src/lib/markdown.ts apps/web/src/app/([36;1msite[0m) apps/w …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                            ~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'site' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"sanitize|renderMarkdownToHtml|dangerouslySetInnerHTML|isExternalLink|nofollow\" apps/web/src/lib/markdown.ts 'apps/web/src/app/(site)' apps/web/src/components" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content apps/web/src/lib/markdown.ts | ForEach-Object { $i++; if($i -ge 1 -and $i -le 130){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
 succeeded in 591ms:
apps/web/src/lib/markdown.ts:4:// 채택: sanitize-html (SSR 호환 · 의존성 작음). PSR-DEFER-17: rehype-sanitize 전환은 FAQ 합류 시.
apps/web/src/lib/markdown.ts:5:// 외부 링크: rel="nofollow noopener noreferrer" 자동.
apps/web/src/lib/markdown.ts:8:import sanitizeHtml from "sanitize-html";
apps/web/src/lib/markdown.ts:31: * Markdown 또는 raw HTML → sanitized HTML.
apps/web/src/lib/markdown.ts:32: * v0.1 단계는 raw HTML 만 sanitize. 진짜 Markdown parsing (marked/remark) 은 next iteration.
apps/web/src/lib/markdown.ts:33: * 어드민 저장 단계의 bodyMarkdown 은 raw Markdown 인데, v0.1 SSR 단계에서는 단순 escape + 줄바꿈 처리 → sanitize.
apps/web/src/lib/markdown.ts:39:export function renderMarkdownToHtml(input: string, hostOrigin: string): string {
apps/web/src/lib/markdown.ts:43:  // 2) sanitize
apps/web/src/lib/markdown.ts:44:  const sanitized = sanitizeHtml(html, {
apps/web/src/lib/markdown.ts:52:        const isExternal = isExternalLink(href, hostOrigin);
apps/web/src/lib/markdown.ts:57:            ...(isExternal ? { rel: "nofollow noopener noreferrer", target: "_blank" } : {}),
apps/web/src/lib/markdown.ts:63:  return sanitized;
apps/web/src/lib/markdown.ts:72:  // raw HTML 그대로 있을 수도 있고 markdown 일 수도. sanitize 가 어차피 escape 하므로 안전.
apps/web/src/lib/markdown.ts:168:  // HTML tags — strip (sanitize-html 사용 안 함 — 평문이므로 simple strip)
apps/web/src/lib/markdown.ts:176:function isExternalLink(href: string, hostOrigin: string): boolean {
apps/web/src/components\site\ArticleBody.tsx:1:// @glitzy/web/components/site/ArticleBody — Markdown body 렌더 (sanitize-html)
apps/web/src/components\site\ArticleBody.tsx:4:import { renderMarkdownToHtml } from "@/lib/markdown";
apps/web/src/components\site\ArticleBody.tsx:7:  const html = renderMarkdownToHtml(markdown, hostOrigin);
apps/web/src/components\site\ArticleBody.tsx:9:    <article className="prose-site max-w-3xl text-fg-default" dangerouslySetInnerHTML={{ __html: html }} />
apps/web/src/app/(site)\[instanceSlug]\about\page.tsx:125:                    rel="nofollow noopener noreferrer"
apps/web/src/app/(site)\[instanceSlug]\about\page.tsx:160:                        rel="nofollow noopener noreferrer"
apps/web/src/app/(site)\[instanceSlug]\faq\page.tsx:18:import { renderMarkdownToHtml } from "@/lib/markdown";
apps/web/src/app/(site)\[instanceSlug]\faq\page.tsx:82:                    // sanitize-html SSR 정합 — XSS 안전.
apps/web/src/app/(site)\[instanceSlug]\faq\page.tsx:83:                    dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(f.answer, hostOrigin) }}
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:175:                    rel="nofollow noopener noreferrer"
apps/web/src/app/(site)\[instanceSlug]\doctors\[slug]\page.tsx:210:                        rel="nofollow noopener noreferrer"

 succeeded in 613ms:
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

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content packages/migrations-runner/src/manifest.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content apps/web/src/seed.ts | ForEach-Object { $i++; if($i -ge 1 -and $i -le 220){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"category|publication|media|faq|8|card\" 'apps/web/src/app/(admin)/admin/[instanceSlug]/page.tsx' 'apps/web/src/components/forms/ArticleForm.tsx' 'apps/web/src/components/forms/ArticleCategoryForm.tsx' 'apps/web/src/components/forms/PublicationForm.tsx' 'apps/web/src/components/forms/MediaAppearanceForm.tsx' 'apps/web/src/components/forms/FaqForm.tsx'" in C:\Users\assag\solution\website-exposure
 succeeded in 630ms:
apps/web/src/components/forms/FaqForm.tsx:15:  categoryId: string;
apps/web/src/components/forms/FaqForm.tsx:26:  categoryId: "",
apps/web/src/components/forms/FaqForm.tsx:38:  categoryOptions,
apps/web/src/components/forms/FaqForm.tsx:45:  categoryOptions: ReadonlyArray<{ value: string; label: string }>;
apps/web/src/components/forms/FaqForm.tsx:74:      <SelectField name="categoryId" label="카테고리 (선택)" value={v.categoryId} onChange={(x) => set("categoryId", x)} options={categoryOptions} errors={fieldErrors.categoryId} />
apps/web/src/components/forms/FaqForm.tsx:90:      className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
apps/web/src/app/(admin)/admin/[instanceSlug]/page.tsx:44:        publications: string;
apps/web/src/app/(admin)/admin/[instanceSlug]/page.tsx:45:        media: string;
apps/web/src/app/(admin)/admin/[instanceSlug]/page.tsx:46:        faqs: string;
apps/web/src/app/(admin)/admin/[instanceSlug]/page.tsx:52:          (SELECT count(*) FROM article_category WHERE instance_id = ${ctx.instanceId}::uuid) AS categories,
apps/web/src/app/(admin)/admin/[instanceSlug]/page.tsx:53:          (SELECT count(*) FROM publication WHERE instance_id = ${ctx.instanceId}::uuid) AS publications,
apps/web/src/app/(admin)/admin/[instanceSlug]/page.tsx:54:          (SELECT count(*) FROM media_appearance WHERE instance_id = ${ctx.instanceId}::uuid) AS media,
apps/web/src/app/(admin)/admin/[instanceSlug]/page.tsx:55:          (SELECT count(*) FROM faq WHERE instance_id = ${ctx.instanceId}::uuid) AS faqs
apps/web/src/app/(admin)/admin/[instanceSlug]/page.tsx:88:                className="rounded-md bg-slate-900 px-3 py-1 text-xs text-white hover:bg-slate-800"
apps/web/src/app/(admin)/admin/[instanceSlug]/page.tsx:98:                className="rounded-md bg-slate-900 px-3 py-1 text-xs text-white hover:bg-slate-800"
apps/web/src/app/(admin)/admin/[instanceSlug]/page.tsx:132:            href={`/admin/${params.instanceSlug}/publications`}
apps/web/src/app/(admin)/admin/[instanceSlug]/page.tsx:134:            count={Number(data.counts.publications)}
apps/web/src/app/(admin)/admin/[instanceSlug]/page.tsx:138:            href={`/admin/${params.instanceSlug}/media-appearances`}
apps/web/src/app/(admin)/admin/[instanceSlug]/page.tsx:140:            count={Number(data.counts.media)}
apps/web/src/app/(admin)/admin/[instanceSlug]/page.tsx:144:            href={`/admin/${params.instanceSlug}/faqs`}
apps/web/src/app/(admin)/admin/[instanceSlug]/page.tsx:146:            count={Number(data.counts.faqs)}
apps/web/src/components/forms/PublicationForm.tsx:77:      <Field name="url" label="원문 URL" type="url" required value={v.url} onChange={(x) => set("url", x)} errors={fieldErrors.url} maxLength={2048} />
apps/web/src/components/forms/PublicationForm.tsx:78:      <Field name="thumbnailUrl" label="썸네일 URL" type="url" value={v.thumbnailUrl} onChange={(x) => set("thumbnailUrl", x)} errors={fieldErrors.thumbnailUrl} maxLength={2048} />
apps/web/src/components/forms/PublicationForm.tsx:102:      className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
apps/web/src/components/forms/MediaAppearanceForm.tsx:80:      <Field name="url" label="원문 URL" type="url" required value={v.url} onChange={(x) => set("url", x)} errors={fieldErrors.url} maxLength={2048} />
apps/web/src/components/forms/MediaAppearanceForm.tsx:81:      <Field name="thumbnailUrl" label="썸네일 URL" type="url" value={v.thumbnailUrl} onChange={(x) => set("thumbnailUrl", x)} errors={fieldErrors.thumbnailUrl} maxLength={2048} />
apps/web/src/components/forms/MediaAppearanceForm.tsx:104:      className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
apps/web/src/components/forms/ArticleCategoryForm.tsx:52:      <Field name="description" label="설명" textarea rows={3} value={v.description} onChange={(x) => set("description", x)} errors={fieldErrors.description} maxLength={200} hint="입력 시 80~200자 (선택)" />
apps/web/src/components/forms/ArticleCategoryForm.tsx:66:      className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
apps/web/src/components/forms/ArticleForm.tsx:18:  categoryId: string;
apps/web/src/components/forms/ArticleForm.tsx:30:  categoryId: "",
apps/web/src/components/forms/ArticleForm.tsx:56:  categoryOptions,
apps/web/src/components/forms/ArticleForm.tsx:62:  categoryOptions: ReadonlyArray<{ value: string; label: string }>;
apps/web/src/components/forms/ArticleForm.tsx:83:      <Field name="summary" label="요약" required textarea rows={3} value={v.summary} onChange={(x) => set("summary", x)} errors={fieldErrors.summary} minLength={80} maxLength={200} hint="80~200자" />
apps/web/src/components/forms/ArticleForm.tsx:84:      <Field name="bodyMarkdown" label="본문 (Markdown)" required textarea rows={18} value={v.bodyMarkdown} onChange={(x) => set("bodyMarkdown", x)} errors={fieldErrors.bodyMarkdown} maxLength={100000} />
apps/web/src/components/forms/ArticleForm.tsx:85:      <Field name="heroImageUrl" label="hero 이미지 URL" type="url" value={v.heroImageUrl} onChange={(x) => set("heroImageUrl", x)} errors={fieldErrors.heroImageUrl} maxLength={2048} />
apps/web/src/components/forms/ArticleForm.tsx:98:        name="categoryId"
apps/web/src/components/forms/ArticleForm.tsx:100:        value={v.categoryId}
apps/web/src/components/forms/ArticleForm.tsx:101:        onChange={(x) => set("categoryId", x)}
apps/web/src/components/forms/ArticleForm.tsx:102:        options={categoryOptions}
apps/web/src/components/forms/ArticleForm.tsx:103:        errors={fieldErrors.categoryId}
apps/web/src/components/forms/ArticleForm.tsx:118:      className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"

 succeeded in 653ms:
// @glitzy/migrations-runner — cross-package migrations manifest spec (v0.1)
// SoT cascade: LL-CASCADE-05 · LOCATION_LEGAL_PLAN v1.0 § 6 의존성 표
//
// 본 manifest 는 cross-package migrations 의 sequential apply 순서와 명시적 depends_on 을 SoT 로 보존한다.
// 실 runner 코드 (sequential apply + fail-fast) 합류는 LL-DEFER-20 (M0 v1.0 본 구현). 본 spec 작성까지가
// plan v1.0 acceptance precondition (LL-CASCADE-05 강도).
//
// orderedMigrations 의 순서를 runner 가 그대로 따른다. orderIndex 가 강한 결정성 (이름 정렬 불가 — 다른
// 패키지의 D0010 과 C0001 비교 등은 lexicographic 으로 의도와 충돌).

export type MigrationDescriptor = {
  /** 미가공 절대 경로 (repo root 기준 상대) */
  readonly file: string;
  /** 적용 단계 — 동일 패키지 내 마이그레이션은 항상 alphabetic 순서로 시퀀스 됨. cross-package 순서는 본 manifest 가 결정. */
  readonly package: "@glitzy/db" | "@glitzy/core-content" | "@glitzy/auth" | "@glitzy/storage";
  /** 본 마이그레이션이 만드는 핵심 객체 (table·enum·index·function) — depends_on 추적용 */
  readonly creates: ReadonlyArray<string>;
  /** 본 마이그레이션이 의존하는 객체 — apply 전 모두 존재해야 함 */
  readonly dependsOn: ReadonlyArray<string>;
};

/**
 * orderedMigrations — LOCATION_LEGAL_PLAN v1.1 § 6 의존성 9단계 + PUBLIC_SITE_RENDER_PLAN v0.x § 8/§ 10 의 D0011 (10단계 — PSR-25/PSR-CASCADE-04 patch)
 * + EAT_CONTENT_PLAN v0.x § 8/§ 12 EC-CASCADE-06 의 16단계 (C0009 article_category + C0010 publication + C0011 media_appearance + C0012 faq + C0013 article_category_fk staged + D0014 public_reader_eat).
 * runner 는 이 배열 순서대로 sequential apply (fail-fast).
 */
export const orderedMigrations: ReadonlyArray<MigrationDescriptor> = [
  // (1) instance (multi-tenant root)
  {
    file: "packages/db/migrations/D0010_instance.sql",
    package: "@glitzy/db",
    creates: ["instance"],
    dependsOn: [],
  },
  // (2) clinic_profile
  {
    file: "packages/core-content/migrations/C0001_clinic_profile.sql",
    package: "@glitzy/core-content",
    creates: ["clinic_profile"],
    dependsOn: ["instance"],
  },
  // (3) location_profile (base table — clinic_profile_id 미포함 · C0008 에서 ALTER)
  {
    file: "packages/core-content/migrations/C0002_location_profile.sql",
    package: "@glitzy/core-content",
    creates: ["location_profile"],
    dependsOn: ["instance"],
  },
  // (4) doctor_profile — article.author_doctor_id FK 의존성 (plan § 6 미언급 보강)
  {
    file: "packages/core-content/migrations/C0003_doctor_profile.sql",
    package: "@glitzy/core-content",
    creates: ["doctor_profile"],
    dependsOn: ["instance"],
  },
  // (5) treatment_page — content_publication_status enum 생성 (C0006 precondition)
  {
    file: "packages/core-content/migrations/C0004_treatment_page.sql",
    package: "@glitzy/core-content",
    creates: ["treatment_page", "content_publication_status"],
    dependsOn: ["instance"],
  },
  // (6) article — risk_level enum 생성 (C0006 precondition) + doctor_profile FK
  {
    file: "packages/core-content/migrations/C0005_article.sql",
    package: "@glitzy/core-content",
    creates: ["article", "risk_level"],
    dependsOn: ["instance", "doctor_profile", "content_publication_status"],
  },
  // (7) legal_document — content_publication_status + risk_level enum FK
  {
    file: "packages/core-content/migrations/C0006_legal_document.sql",
    package: "@glitzy/core-content",
    creates: ["legal_document", "legal_document_type"],
    dependsOn: ["instance", "content_publication_status", "risk_level"],
  },
  // (8) clinic_profile policy + primary_ctas (ALTER)
  {
    file: "packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql",
    package: "@glitzy/core-content",
    creates: [
      "clinic_profile.policy_contact_person",
      "clinic_profile.policy_contact_email",
      "clinic_profile.policy_contact_phone",
      "clinic_profile.policy_effective_date",
      "clinic_profile.primary_ctas",
      "clinic_profile_primary_ctas_validate",
      "clinic_profile_primary_ctas_trigger",
    ],
    dependsOn: ["clinic_profile"],
  },
  // (9) location_profile parentClinic composite FK (ALTER)
  {
    file: "packages/core-content/migrations/C0008_location_profile_parent_clinic.sql",
    package: "@glitzy/core-content",
    creates: [
      "location_profile.clinic_profile_id",
      "location_profile_clinic_fk",
      "location_profile_clinic_idx",
    ],
    dependsOn: ["clinic_profile", "location_profile"],
  },
  // (10) app_public_reader role + per-table SELECT policy 7개 (PUBLIC_SITE_RENDER_PLAN v0.x · PSR-25 / PSR-CASCADE-04 patch)
  // depends_on = instance + 6 content table 모두. policy 가 모든 table 에 걸리므로 manifest 마지막.
  {
    file: "packages/db/migrations/D0011_public_reader.sql",
    package: "@glitzy/db",
    creates: [
      "app_public_reader",
      "public_reader_instance_select",
      "public_reader_clinic_profile_select",
      "public_reader_location_profile_select",
      "public_reader_doctor_profile_select",
      "public_reader_treatment_page_select",
      "public_reader_article_select",
      "public_reader_legal_document_select",
    ],
    dependsOn: [
      "instance",
      "clinic_profile",
      "location_profile",
      "doctor_profile",
      "treatment_page",
      "article",
      "legal_document",
    ],
  },
  // (11) article_category (EAT_CONTENT_PLAN v0.x · EC-SCHEMA-01 / EC-CASCADE-06)
  {
    file: "packages/core-content/migrations/C0009_article_category.sql",
    package: "@glitzy/core-content",
    creates: ["article_category"],
    dependsOn: ["instance"],
  },
  // (12) publication
  {
    file: "packages/core-content/migrations/C0010_publication.sql",
    package: "@glitzy/core-content",
    creates: ["publication"],
    dependsOn: ["instance", "doctor_profile", "content_publication_status", "risk_level"],
  },
  // (13) media_appearance
  {
    file: "packages/core-content/migrations/C0011_media_appearance.sql",
    package: "@glitzy/core-content",
    creates: ["media_appearance", "media_channel_type"],
    dependsOn: ["instance", "doctor_profile", "content_publication_status", "risk_level"],
  },
  // (14) faq
  {
    file: "packages/core-content/migrations/C0012_faq.sql",
    package: "@glitzy/core-content",
    creates: ["faq"],
    dependsOn: ["instance", "doctor_profile", "treatment_page", "article_category", "content_publication_status", "risk_level"],
  },
  // (15) article_category_fk — staged 4-step: ADD nullable + default `general` seed + backfill + SET NOT NULL + FK
  //   EC-SCHEMA-05 / cycle 1 ECP-03 정합
  {
    file: "packages/core-content/migrations/C0013_article_category_fk.sql",
    package: "@glitzy/core-content",
    creates: [
      "article.category_id",
      "article_category_fk",
      "article_category_idx",
    ],
    dependsOn: ["article", "article_category"],
  },
  // (16) D0014 public_reader_eat — 4 신규 table GRANT/policy (EAT_CONTENT EC-CASCADE-05)
  {
    file: "packages/db/migrations/D0014_public_reader_eat.sql",
    package: "@glitzy/db",
    creates: [
      "public_reader_article_category_select",
      "public_reader_publication_select",
      "public_reader_media_appearance_select",
      "public_reader_faq_select",
    ],
    dependsOn: [
      "app_public_reader",
      "article_category",
      "publication",
      "media_appearance",
      "faq",
    ],
  },
];

/**
 * validateManifest — runner 가 sequential apply 직전 호출.
 * 각 entry 의 dependsOn 이 이전 entries 의 creates 안에 모두 존재함을 verify.
 * 실 runner 합류 (LL-DEFER-20) 시점에 적용.
 */
export function validateManifest(): ReadonlyArray<string> {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const [i, m] of orderedMigrations.entries()) {
    for (const dep of m.dependsOn) {
      if (!seen.has(dep)) {
        errors.push(`[${m.file}] depends on "${dep}" but it is not created by any earlier migration (orderIndex=${i})`);
      }
    }
    for (const c of m.creates) seen.add(c);
  }
  return errors;
}

 succeeded in 673ms:
   1: // @glitzy/web/seed — operator + instance + membership bootstrap (Plan v1.0 § 7.1)
   2: // cycle1-2-code:
   3: //   - WEB-03 snake_case columns
   4: //   - WEB-04 SEED_DATABASE_URL fallback 제거
   5: //   - WEB-13 normalizeIdentifier
   6: //   - WEB-20 instance_membership active/inactive 분기 lookup
   7: //   - WEB-21 SYSTEM_ACTOR DO UPDATE (재실행 수렴)
   8: //   - WEB-35 전체 bootstrap 단일 transaction
   9: 
  10: import postgres from "postgres";
  11: import { normalizeIdentifier } from "@glitzy/auth";
  12: 
  13: const SYSTEM_ACTOR_ID = "00000000-0000-4000-8000-000000000001";
  14: 
  15: type Args = {
  16:   email: string;
  17:   displayName: string;
  18:   instanceSlug: string;
  19:   instanceName: string;
  20: };
  21: 
  22: function parseArgs(argv: ReadonlyArray<string>): Args {
  23:   const map = new Map<string, string>();
  24:   for (const a of argv) {
  25:     const m = a.match(/^--([^=]+)=(.*)$/);
  26:     if (m) map.set(m[1]!, m[2]!);
  27:   }
  28:   const email = map.get("email");
  29:   const displayName = map.get("display-name");
  30:   const instanceSlug = map.get("instance-slug");
  31:   const instanceName = map.get("instance-name");
  32:   if (!email || !displayName || !instanceSlug || !instanceName) {
  33:     console.error(
  34:       "usage: pnpm --filter @glitzy/web seed --email=<email> --display-name=<name> --instance-slug=<slug> --instance-name=<name>",
  35:     );
  36:     process.exit(1);
  37:   }
  38:   // cycle4-code WEB-59: instanceSlug regex + displayName 길이 사전 검증 (한국어 메시지)
  39:   if (!/^[a-z0-9][a-z0-9-]{2,63}$/.test(instanceSlug)) {
  40:     console.error("[seed] instance-slug 형식 오류: 3~64자, 소문자/숫자/하이픈 (^[a-z0-9][a-z0-9-]{2,63}$)");
  41:     process.exit(1);
  42:   }
  43:   if (displayName.trim().length === 0 || displayName.length > 200) {
  44:     console.error("[seed] display-name 길이 오류: 1~200자");
  45:     process.exit(1);
  46:   }
  47:   if (instanceName.trim().length === 0 || instanceName.length > 200) {
  48:     console.error("[seed] instance-name 길이 오류: 1~200자");
  49:     process.exit(1);
  50:   }
  51:   return { email, displayName, instanceSlug, instanceName };
  52: }
  53: 
  54: async function main(): Promise<void> {
  55:   const args = parseArgs(process.argv.slice(2));
  56:   const url = process.env.SEED_DATABASE_URL;
  57:   if (!url) {
  58:     console.error("SEED_DATABASE_URL 환경 변수 필요 (WEB_DATABASE_URL fallback 미허용 — Plan § 7.1)");
  59:     process.exit(1);
  60:   }
  61:   const normalizedEmail = normalizeIdentifier(args.email);
  62:   const sql = postgres(url, { max: 1, onnotice: () => {} });
  63: 
  64:   try {
  65:     // cycle2-code WEB-35: 전체 bootstrap 을 단일 transaction 으로 — partial state 회피
  66:     // cycle3-code WEB-49: pg_advisory_xact_lock 으로 동시 seed 실행 직렬화
  67:     // postgres library template parameter 는 number/string 만 — bigint 대신 정수 사용
  68:     const SEED_LOCK_KEY = 1431655765; // arbitrary unique int for advisory lock
  69:     const result = await sql.begin(async (tx) => {
  70:       await tx`SELECT pg_advisory_xact_lock(${SEED_LOCK_KEY})`;
  71:       // 1) system actor — cycle2-code WEB-21: DO UPDATE 로 재실행 수렴 보장
  72:       await tx`
  73:         INSERT INTO admin_user (
  74:           id, email, display_name, active, is_super_admin,
  75:           legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible
  76:         ) VALUES (
  77:           ${SYSTEM_ACTOR_ID}::uuid, 'system@glitzy.internal', 'System', false, false,
  78:           false, false, false
  79:         )
  80:         ON CONFLICT (id) DO UPDATE
  81:           SET email = EXCLUDED.email,
  82:               display_name = EXCLUDED.display_name,
  83:               active = false,
  84:               is_super_admin = false,
  85:               legal_reviewer_eligible = false,
  86:               physician_reviewer_eligible = false,
  87:               client_approver_eligible = false
  88:       `;
  89: 
  90:       // 2) instance upsert
  91:       const instanceRows = await tx<{ id: string }[]>`
  92:         INSERT INTO instance (slug, display_name, active)
  93:           VALUES (${args.instanceSlug}, ${args.instanceName}, true)
  94:         ON CONFLICT (slug) DO UPDATE
  95:           SET display_name = EXCLUDED.display_name,
  96:               active = true
  97:         RETURNING id
  98:       `;
  99:       const iRow = instanceRows[0];
 100:       if (!iRow) throw new Error("instance upsert returned no row");
 101: 
 102:       // 3) admin_user(operator) upsert — cycle4-code WEB-53: 모든 flag reset (재실행 결정성)
 103:       const userRows = await tx<{ id: string }[]>`
 104:         INSERT INTO admin_user (
 105:           email, display_name, active, is_super_admin,
 106:           legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible
 107:         ) VALUES (
 108:           ${normalizedEmail}, ${args.displayName}, true, false,
 109:           false, false, false
 110:         )
 111:         ON CONFLICT (email) DO UPDATE
 112:           SET display_name = EXCLUDED.display_name,
 113:               active = EXCLUDED.active,
 114:               is_super_admin = EXCLUDED.is_super_admin,
 115:               legal_reviewer_eligible = EXCLUDED.legal_reviewer_eligible,
 116:               physician_reviewer_eligible = EXCLUDED.physician_reviewer_eligible,
 117:               client_approver_eligible = EXCLUDED.client_approver_eligible,
 118:               updated_at = now()
 119:         RETURNING id
 120:       `;
 121:       const uRow = userRows[0];
 122:       if (!uRow) throw new Error("admin_user upsert returned no row");
 123: 
 124:       // 4) instance_membership — cycle2-code WEB-20: active 우선 분기 lookup
 125:       //    (a) active row 존재 → UPDATE role only
 126:       //    (b) inactive row 만 존재 → reactivate (deactivated_* NULL 복귀 · WEB-87)
 127:       //    (c) 없으면 INSERT
 128:       await tx`
 129:         WITH existing_active AS (
 130:           SELECT id FROM instance_membership
 131:            WHERE user_id = ${uRow.id}::uuid AND instance_id = ${iRow.id}::uuid AND active = true
 132:            LIMIT 1
 133:         ), existing_inactive AS (
 134:           SELECT id FROM instance_membership
 135:            WHERE user_id = ${uRow.id}::uuid AND instance_id = ${iRow.id}::uuid AND active = false
 136:              AND NOT EXISTS (SELECT 1 FROM existing_active)
 137:            LIMIT 1
 138:         ), update_active AS (
 139:           UPDATE instance_membership
 140:              SET role = 'operator', updated_at = now()
 141:            WHERE id = (SELECT id FROM existing_active)
 142:            RETURNING id
 143:         ), reactivate AS (
 144:           UPDATE instance_membership
 145:              SET role = 'operator',
 146:                  active = true,
 147:                  deactivated_at = NULL,
 148:                  deactivated_by_user_id = NULL,
 149:                  updated_at = now()
 150:            WHERE id = (SELECT id FROM existing_inactive)
 151:            RETURNING id
 152:         ), insert_new AS (
 153:           INSERT INTO instance_membership (user_id, instance_id, role, active)
 154:           SELECT ${uRow.id}::uuid, ${iRow.id}::uuid, 'operator', true
 155:            WHERE NOT EXISTS (SELECT 1 FROM existing_active)
 156:              AND NOT EXISTS (SELECT 1 FROM existing_inactive)
 157:            RETURNING id
 158:         )
 159:         SELECT id FROM update_active
 160:         UNION ALL SELECT id FROM reactivate
 161:         UNION ALL SELECT id FROM insert_new
 162:       `;
 163: 
 164:       // 4.5) default `general` article_category — EAT_CONTENT v1.0 EC-SCHEMA-03 (cycle 1 ECP-09)
 165:       //   instance 별 idempotent INSERT. C0013 staged migration 안 backfill 과 동일 row 보장.
 166:       await tx`
 167:         INSERT INTO article_category (instance_id, slug, name, display_order)
 168:         VALUES (${iRow.id}::uuid, 'general', '일반', 0)
 169:         ON CONFLICT (instance_id, slug) DO NOTHING
 170:       `;
 171: 
 172:       // 5) seed audit — audit_event (audit_log 는 instance_id NOT NULL)
 173:       await tx`
 174:         INSERT INTO audit_event (event_type, actor_user_id, to_instance_id, payload)
 175:         VALUES (
 176:           'seed-completed',
 177:           ${SYSTEM_ACTOR_ID}::uuid,
 178:           ${iRow.id}::uuid,
 179:           ${tx.json({ slug: args.instanceSlug, email: normalizedEmail, displayName: args.displayName })}::jsonb
 180:         )
 181:       `;
 182: 
 183:       return { instanceId: iRow.id, userId: uRow.id };
 184:     });
 185: 
 186:     console.log(
 187:       JSON.stringify(
 188:         {
 189:           ok: true,
 190:           systemActorId: SYSTEM_ACTOR_ID,
 191:           userId: result.userId,
 192:           instanceId: result.instanceId,
 193:           instanceSlug: args.instanceSlug,
 194:           email: normalizedEmail,
 195:           next: `magic-link 발급 후 /sign-in/consume?identifier=${encodeURIComponent(normalizedEmail)}&token=… 클릭`,
 196:         },
 197:         null,
 198:         2,
 199:       ),
 200:     );
 201:   } finally {
 202:     await sql.end({ timeout: 5 });
 203:   }
 204: }
 205: 
 206: main().catch((err) => {
 207:   console.error("[seed] failed", err);
 208:   process.exit(1);
 209: });

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"SELECT .*article_category|categoryOptions|general|default|category_id|category_slug|ArticleForm|FaqForm\" 'apps/web/src/app/(admin)/admin/[instanceSlug]/articles/new/page.tsx' 'apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx' 'apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/new/page.tsx' 'apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/articles/new/page.tsx' | ForEach-Object { "'$i++; if($i -ge 1 -and $i -le 120){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx' | ForEach-Object { "'$i++; if($i -ge 1 -and $i -le 140){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
 succeeded in 615ms:
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:8:import { FaqForm, type FaqInitial } from "@/components/forms/FaqForm";
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:12:export default async function FaqEditPage({ params }: { params: { instanceSlug: string; slug: string } }) {
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:28:    categoryOptions: ReadonlyArray<{ value: string; label: string }>;
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:42:          category_id: string | null;
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:47:          SELECT slug, question, answer, display_order, category_id, author_doctor_id, related_treatment_id,
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:56:          SELECT id, name FROM article_category
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:77:            categoryId: r.category_id ?? "",
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:82:          categoryOptions: categoryRows.map((c) => ({ value: c.id, label: c.name })),
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:113:      <FaqForm
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/[slug]/page.tsx:117:        categoryOptions={bundle.categoryOptions}
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/new/page.tsx:8:import { FaqForm } from "@/components/forms/FaqForm";
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/new/page.tsx:11:export default async function FaqNewPage({ params }: { params: { instanceSlug: string } }) {
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/new/page.tsx:26:    categoryOptions: ReadonlyArray<{ value: string; label: string }>;
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/new/page.tsx:36:          SELECT id, name FROM article_category
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/new/page.tsx:51:          categoryOptions: categoryRows.map((r) => ({ value: r.id, label: r.name })),
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/new/page.tsx:76:      <FaqForm
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/new/page.tsx:80:        categoryOptions={bundle.categoryOptions}
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/new/page.tsx:12:import { ArticleForm } from "@/components/forms/ArticleForm";
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/new/page.tsx:15:export default async function ArticleNewPage({ params }: { params: { instanceSlug: string } }) {
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/new/page.tsx:30:  let categoryOptions: ReadonlyArray<{ value: string; label: string }> = [];
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/new/page.tsx:41:        SELECT id, name FROM article_category
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/new/page.tsx:51:    categoryOptions = result.categories;
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/new/page.tsx:71:      <ArticleForm action={bound} initial={null} isNew doctorOptions={doctorOptions} categoryOptions={categoryOptions} />
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:10:import { ArticleForm, type ArticleInitial } from "@/components/forms/ArticleForm";
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:14:export default async function ArticleEditPage({ params }: { params: { instanceSlug: string; slug: string } }) {
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:32:    categoryOptions: ReadonlyArray<{ value: string; label: string }>;
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:40:      categoryOptions: ReadonlyArray<{ value: string; label: string }>;
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:52:        category_id: string;
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:59:               category_id
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:74:        SELECT id, name FROM article_category
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:88:          categoryId: r.category_id,
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:94:        categoryOptions: categoryRows.map((c) => ({ value: c.id, label: c.name })),
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:121:      <ArticleForm
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/[slug]/page.tsx:126:        categoryOptions={bundle.categoryOptions}

 succeeded in 640ms:
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

 succeeded in 659ms:
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

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content apps/web/src/components/forms/ArticleForm.tsx | ForEach-Object { $i++; if($i -ge 90 -and $i -le 110){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/categories/[slug]/page.tsx' | ForEach-Object { "'$i++; if($i -ge 35 -and $i -le 95){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content apps/web/src/components/forms/ArticleCategoryForm.tsx | ForEach-Object { $i++; if($i -ge 1 -and $i -le 80){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
 succeeded in 684ms:
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

 succeeded in 680ms:
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
  75:       <ArticleCategoryForm action={boundSave} initial={initial} isNew={false} />
  76:       {initial.slug !== "general" && (
  77:         <DeleteForm action={boundDelete} confirmMessage="정말 이 카테고리를 삭제하시겠습니까? 카테고리를 사용 중인 아티클이 있으면 삭제가 차단됩니다." />
  78:       )}
  79:     </main>
  80:   );
  81: }

 succeeded in 654ms:
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
  28: }: {
  29:   action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
  30:   initial: ArticleCategoryInitial | null;
  31:   isNew: boolean;
  32: }) {
  33:   const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
  34:   const [v, setV] = useState<ArticleCategoryInitial>(initial ?? empty);
  35:   const fieldErrors = state && state.ok === false ? state.fieldErrors : {};
  36:   const formError = state && state.ok === false ? state.formError ?? null : null;
  37:   const set = (k: keyof ArticleCategoryInitial, val: string) => setV((p) => ({ ...p, [k]: val }));
  38: 
  39:   return (
  40:     <form action={formAction} className="flex flex-col gap-5">
  41:       {state?.ok === true && (
  42:         <div className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
  43:           저장되었습니다.
  44:         </div>
  45:       )}
  46:       {formError && (
  47:         <div className="rounded-md border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-900">{formError}</div>
  48:       )}
  49: 
  50:       <Field name="slug" label="slug" required value={v.slug} onChange={(x) => set("slug", x)} errors={fieldErrors.slug} maxLength={64} hint="3~64자 · 소문자/숫자/하이픈" />
  51:       <Field name="name" label="이름" required value={v.name} onChange={(x) => set("name", x)} errors={fieldErrors.name} maxLength={50} />
  52:       <Field name="description" label="설명" textarea rows={3} value={v.description} onChange={(x) => set("description", x)} errors={fieldErrors.description} maxLength={200} hint="입력 시 80~200자 (선택)" />
  53:       <Field name="displayOrder" label="표시 순서" required value={v.displayOrder} onChange={(x) => set("displayOrder", x)} errors={fieldErrors.displayOrder} hint="0 ~ 9999" />
  54: 
  55:       <SubmitButton isNew={isNew} />
  56:     </form>
  57:   );
  58: }
  59: 
  60: function SubmitButton({ isNew }: { isNew: boolean }) {
  61:   const { pending } = useFormStatus();
  62:   return (
  63:     <button
  64:       type="submit"
  65:       disabled={pending}
  66:       className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
  67:     >
  68:       {pending ? "저장 중…" : isNew ? "추가" : "저장"}
  69:     </button>
  70:   );
  71: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content apps/web/src/lib/errors.ts | ForEach-Object { $i++; if($i -ge 70 -and $i -le 122){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts' | ForEach-Object { "'$i++; if($i -ge 120 -and $i -le 190){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts' | ForEach-Object { "'$i++; if($i -ge 115 -and $i -le 180){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
 succeeded in 643ms:
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

 succeeded in 658ms:
 120:     }
 121:     return { ok: false, fieldErrors: {}, formError: "저장에 실패했습니다." };
 122:   } catch (err) {
 123:     if (isNextControlFlowError(err)) throw err;
 124:     const mapped = mapDbErrorToResult(err);
 125:     if (mapped !== null) {
 126:       if (mapped.kind === "field") return { ok: false, fieldErrors: mapped.errors };
 127:       return { ok: false, fieldErrors: {}, formError: mapped.message };
 128:     }
 129:     if (err instanceof TenantResolveError) {
 130:       const action = mapAuthDenyReasonToUi(err.reason);
 131:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
 132:       if (action.kind === "not-found") notFound();
 133:       if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
 134:     }
 135:     console.error("[savePublication] unexpected", err);
 136:     return { ok: false, fieldErrors: {}, formError: "저장 중 알 수 없는 오류가 발생했습니다." };
 137:   }
 138: }
 139: 
 140: export async function deletePublication(instanceSlug: string, slug: string): Promise<DeleteResult> {
 141:   const aCtx = await resolveActionContext(instanceSlug);
 142:   const sqlBase = getSqlBase();
 143: 
 144:   try {
 145:     const result = await withSkeletonTx(
 146:       { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
 147:       async (tx, ctx) => {
 148:         assertActionEligibility(ctx, "operator-edit-content");
 149:         const deleted = await tx<{ id: string }[]>`
 150:           DELETE FROM publication
 151:            WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${slug}
 152:            RETURNING id
 153:         `;
 154:         return { deleted: deleted.length };
 155:       },
 156:     );
 157: 
 158:     if (result.deleted === 0) return { ok: false, formError: "해당 publication 이 이미 삭제되었습니다." };
 159: 
 160:     try {
 161:       await emitAuditEvent(sqlBase, {
 162:         eventType: "content-deleted",
 163:         actorUserId: aCtx.userId,
 164:         targetUserId: aCtx.userId,
 165:         toInstanceId: aCtx.instanceId,
 166:         payload: { contentType: "Publication", slug },
 167:       });
 168:     } catch (err) {
 169:       console.error("[deletePublication] audit emit failed", err);
 170:     }
 171: 
 172:     revalidatePath(`/admin/${instanceSlug}/publications`);
 173:     revalidatePath(`/admin/${instanceSlug}/publications/${slug}`);
 174:     revalidatePath(`/admin/${instanceSlug}`);
 175:     redirect(`/admin/${instanceSlug}/publications`);
 176:   } catch (err) {
 177:     if (isNextControlFlowError(err)) throw err;
 178:     if (err instanceof TenantResolveError) {
 179:       const action = mapAuthDenyReasonToUi(err.reason);
 180:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
 181:       if (action.kind === "not-found") notFound();
 182:       if (action.kind === "forbidden" || action.kind === "info") return { ok: false, formError: action.message };
 183:     }
 184:     const mapped = mapDbErrorToResult(err);
 185:     if (mapped !== null && mapped.kind === "form") return { ok: false, formError: mapped.message };
 186:     console.error("[deletePublication] unexpected", err);
 187:     return { ok: false, formError: "삭제 중 오류가 발생했습니다." };
 188:   }
 189: }

 succeeded in 611ms:
 115:     if (isNextControlFlowError(err)) throw err;
 116:     const mapped = mapDbErrorToResult(err);
 117:     if (mapped !== null) {
 118:       if (mapped.kind === "field") return { ok: false, fieldErrors: mapped.errors };
 119:       return { ok: false, fieldErrors: {}, formError: mapped.message };
 120:     }
 121:     if (err instanceof TenantResolveError) {
 122:       const action = mapAuthDenyReasonToUi(err.reason);
 123:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
 124:       if (action.kind === "not-found") notFound();
 125:       if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
 126:     }
 127:     console.error("[saveFaq] unexpected", err);
 128:     return { ok: false, fieldErrors: {}, formError: "저장 중 알 수 없는 오류가 발생했습니다." };
 129:   }
 130: }
 131: 
 132: export async function deleteFaq(instanceSlug: string, slug: string): Promise<DeleteResult> {
 133:   const aCtx = await resolveActionContext(instanceSlug);
 134:   const sqlBase = getSqlBase();
 135: 
 136:   try {
 137:     const result = await withSkeletonTx(
 138:       { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
 139:       async (tx, ctx) => {
 140:         assertActionEligibility(ctx, "operator-edit-content");
 141:         const deleted = await tx<{ id: string }[]>`
 142:           DELETE FROM faq
 143:            WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${slug}
 144:            RETURNING id
 145:         `;
 146:         return { deleted: deleted.length };
 147:       },
 148:     );
 149: 
 150:     if (result.deleted === 0) return { ok: false, formError: "해당 FAQ 가 이미 삭제되었습니다." };
 151: 
 152:     try {
 153:       await emitAuditEvent(sqlBase, {
 154:         eventType: "content-deleted",
 155:         actorUserId: aCtx.userId,
 156:         targetUserId: aCtx.userId,
 157:         toInstanceId: aCtx.instanceId,
 158:         payload: { contentType: "FAQ", slug },
 159:       });
 160:     } catch (err) {
 161:       console.error("[deleteFaq] audit emit failed", err);
 162:     }
 163: 
 164:     revalidatePath(`/admin/${instanceSlug}/faqs`);
 165:     revalidatePath(`/admin/${instanceSlug}/faqs/${slug}`);
 166:     revalidatePath(`/admin/${instanceSlug}`);
 167:     redirect(`/admin/${instanceSlug}/faqs`);
 168:   } catch (err) {
 169:     if (isNextControlFlowError(err)) throw err;
 170:     if (err instanceof TenantResolveError) {
 171:       const action = mapAuthDenyReasonToUi(err.reason);
 172:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
 173:       if (action.kind === "not-found") notFound();
 174:       if (action.kind === "forbidden" || action.kind === "info") return { ok: false, formError: action.message };
 175:     }
 176:     const mapped = mapDbErrorToResult(err);
 177:     if (mapped !== null && mapped.kind === "form") return { ok: false, formError: mapped.message };
 178:     console.error("[deleteFaq] unexpected", err);
 179:     return { ok: false, formError: "삭제 중 오류가 발생했습니다." };
 180:   }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "function resolveActionContext|export async function resolveActionContext|class TenantResolveError|throw new TenantResolveError" apps/web/src packages -g "*.ts"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts' | ForEach-Object { "'$i++; if($i -ge 19 -and $i -le 35){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts' | ForEach-Object { "'$i++; if($i -ge 35 -and $i -le 40){ '"'{0,4}: {1}' -f "'$i, $_ }; if($i -ge 121 -and $i -le 126){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
 succeeded in 659ms:
packages\auth\src\errors.ts:34:export class TenantResolveError extends AppError {
packages\auth\src\resolve-tenant-context.ts:36:  if (typeof value !== "string") throw new TenantResolveError("invalid-instance-id", "requestedInstanceId not string");
packages\auth\src\resolve-tenant-context.ts:37:  if (value.length !== 36) throw new TenantResolveError("invalid-instance-id", `UUID length must be 36, got ${value.length}`);
packages\auth\src\resolve-tenant-context.ts:38:  if (!UUID_V4_REGEX.test(value)) throw new TenantResolveError("invalid-instance-id", `malformed UUID`);
packages\auth\src\resolve-tenant-context.ts:73:      throw new TenantResolveError(err.reason, err.message);
packages\auth\src\resolve-tenant-context.ts:75:    throw new TenantResolveError("session-not-found", "session invalid");
packages\auth\src\resolve-tenant-context.ts:84:    throw new TenantResolveError("session-not-found", "user not found");
packages\auth\src\resolve-tenant-context.ts:89:    throw new TenantResolveError("user-inactive", "user inactive");
packages\auth\src\resolve-tenant-context.ts:103:      throw new TenantResolveError("super-admin-required", "super-admin must switch instance first");
packages\auth\src\resolve-tenant-context.ts:113:      throw new TenantResolveError("instance-mismatch", "super-admin selected != requested");
packages\auth\src\resolve-tenant-context.ts:129:      throw new TenantResolveError("membership-not-found", "no active membership");
packages\auth\src\resolve-tenant-context.ts:136:      throw new TenantResolveError("legal-reviewer-ineligible", "legal-reviewer role requires eligibility flag");
packages\auth\src\resolve-tenant-context.ts:140:      throw new TenantResolveError("physician-reviewer-ineligible", "physician-reviewer role requires eligibility flag");
packages\auth\src\resolve-tenant-context.ts:144:      throw new TenantResolveError("client-approver-ineligible", "client-approver role requires eligibility flag");
packages\auth\src\resolve-tenant-context.ts:206:      if (!ctx.user.legal_reviewer_eligible) throw new TenantResolveError("legal-reviewer-ineligible", `${action} requires legal_reviewer_eligible`);
packages\auth\src\resolve-tenant-context.ts:212:      if (!ctx.user.physician_reviewer_eligible) throw new TenantResolveError("physician-reviewer-ineligible", `${action} requires physician_reviewer_eligible`);
packages\auth\src\resolve-tenant-context.ts:217:      if (!ctx.user.client_approver_eligible) throw new TenantResolveError("client-approver-ineligible", `${action} requires client_approver_eligible`);
packages\auth\src\resolve-tenant-context.ts:223:      throw new TenantResolveError("operator-role-required", `${action} requires operator/super-admin role`);
apps/web/src\lib\action-context.ts:30:export async function resolveActionContext(instanceSlug: string): Promise<ActionContext> {

 succeeded in 703ms:
  19: export async function savePublication(
  20:   instanceSlug: string,
  21:   originalSlug: string | null,
  22:   _prev: SaveResult | null,
  23:   formData: FormData,
  24: ): Promise<SaveResult> {
  25:   const parsed = PublicationInputSchema.safeParse(Object.fromEntries(formData));
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

 succeeded in 703ms:
  35:   const aCtx = await resolveActionContext(instanceSlug);
  36:   const sqlBase = getSqlBase();
  37: 
  38:   try {
  39:     const txResult = await withSkeletonTx(
  40:       { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
 121: export async function deleteCategory(instanceSlug: string, slug: string): Promise<DeleteResult> {
 122:   const aCtx = await resolveActionContext(instanceSlug);
 123:   const sqlBase = getSqlBase();
 124: 
 125:   try {
 126:     const result = await withSkeletonTx(

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content apps/web/src/lib/action-context.ts | ForEach-Object { $i++; if($i -ge 1 -and $i -le 70){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"const aCtx = await resolveActionContext\" 'apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts'" in C:\Users\assag\solution\website-exposure
 succeeded in 563ms:
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:36:  const aCtx = await resolveActionContext(instanceSlug);
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:133:  const aCtx = await resolveActionContext(instanceSlug);
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:35:  const aCtx = await resolveActionContext(instanceSlug);
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:141:  const aCtx = await resolveActionContext(instanceSlug);
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:106:  const aCtx = await resolveActionContext(instanceSlug);
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:262:  const aCtx = await resolveActionContext(instanceSlug);
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:35:  const aCtx = await resolveActionContext(instanceSlug);
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:140:  const aCtx = await resolveActionContext(instanceSlug);
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:35:  const aCtx = await resolveActionContext(instanceSlug);
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:122:  const aCtx = await resolveActionContext(instanceSlug);

 succeeded in 587ms:
   1: // @glitzy/web/lib/action-context — Server Action 공통 ctx resolve helper
   2: // ClinicProfile/Doctor/Treatment/Article actions 가 같은 패턴 사용
   3: 
   4: import { redirect } from "next/navigation";
   5: import { notFound } from "next/navigation";
   6: import {
   7:   AuthDeniedError,
   8:   assertActionEligibility,
   9:   getActiveSession,
  10:   type ActionType,
  11: } from "@glitzy/auth";
  12: import { asUuidV4, type AdminUserId, type InstanceId } from "@glitzy/shared-types";
  13: 
  14: import { getSqlBase } from "./db";
  15: import { getAuthCfg } from "./env";
  16: import { readSessionCookie } from "./session-cookie";
  17: import { slugResolver } from "./slug-resolver";
  18: 
  19: export type ActionContext = {
  20:   signedToken: string;
  21:   userId: AdminUserId;
  22:   instanceId: InstanceId;
  23: };
  24: 
  25: /**
  26:  * Server Action 진입 공통 (auth + slug resolve).
  27:  * 실패 시 redirect/notFound throw — caller 는 try 후 정상 흐름만 처리.
  28:  * action 인자가 주어지면 추가로 assertActionEligibility 까지 검증 (resolveTenantContext 는 withSkeletonTx 안에서 별도 수행).
  29:  */
  30: export async function resolveActionContext(instanceSlug: string): Promise<ActionContext> {
  31:   const signedToken = readSessionCookie();
  32:   if (!signedToken) redirect("/sign-in");
  33: 
  34:   const sqlBase = getSqlBase();
  35:   const cfg = getAuthCfg();
  36: 
  37:   let session;
  38:   try {
  39:     session = await getActiveSession(sqlBase, cfg, signedToken);
  40:   } catch (err) {
  41:     const reason = err instanceof AuthDeniedError ? err.reason : "session-not-found";
  42:     redirect(`/sign-in/cleanup?reason=${reason}`);
  43:   }
  44: 
  45:   // cycle2-3entity WEB-26: branded UUID narrow
  46:   let userId: AdminUserId;
  47:   try {
  48:     userId = asUuidV4(session.userId) as AdminUserId;
  49:   } catch {
  50:     redirect("/sign-in/cleanup?reason=session-not-found");
  51:   }
  52:   const instanceId = await slugResolver(sqlBase, instanceSlug, userId);
  53:   if (instanceId === null) notFound();
  54: 
  55:   return { signedToken, userId, instanceId };
  56: }
  57: 
  58: /**
  59:  * Next.js App Router 의 redirect()/notFound() 가 throw 하는 control-flow error 판별.
  60:  * try/catch 가 일반 error 로 swallow 하지 않도록 outer catch 에서 rethrow 용도.
  61:  * cycle1-3entity WEB-01.
  62:  */
  63: export function isNextControlFlowError(err: unknown): boolean {
  64:   if (typeof err !== "object" || err === null) return false;
  65:   const digest = (err as { digest?: unknown }).digest;
  66:   if (typeof digest !== "string") return false;
  67:   // cycle5-3entity WEB-48: Next 14+ notFound() 는 NEXT_HTTP_ERROR_FALLBACK;404 패턴 사용
  68:   return (
  69:     digest.startsWith("NEXT_REDIRECT") ||
  70:     digest === "NEXT_NOT_FOUND" ||

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content apps/web/src/lib/json-ld/builders.ts | ForEach-Object { $i++; if($i -ge 208 -and $i -le 240){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content apps/web/src/lib/db-projection.ts | ForEach-Object { $i++; if($i -ge 1 -and $i -le 80){ '"'{0,4}: {1}' -f "'$i, $_ }; if($i -ge 367 -and $i -le 510){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx' | ForEach-Object { "'$i++; if($i -ge 20 -and $i -le 72){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
 succeeded in 636ms:
 208:     E.medicalClinicEntity(ctx, clinic, location),
 209:     E.webPageEntity(ctx, "연락처", description),
 210:     E.breadcrumbListEntity(ctx, [{ name: "홈", path: "/" }, { name: "연락처", path: null }]),
 211:   ]);
 212: }
 213: 
 214: // === P-011 FAQ (EAT_CONTENT v1.0) ===
 215: //   SCHEMA_MAPPING § 6.3. FAQPage + Question[] mainEntity inline.
 216: //   v0.1 단계 published 차단 (DB CHECK status='draft' 만) → faqs 0 row 가능, 빈 mainEntity [].
 217: export function faqPageGraph(
 218:   ctx: GraphBuilderContext,
 219:   clinic: ClinicProjection,
 220:   faqs: ReadonlyArray<FaqProjection>,
 221:   description: string,
 222: ): JsonLdGraph {
 223:   return graph([
 224:     E.organizationEntity(ctx, clinic),
 225:     E.webPageEntity(ctx, "자주 묻는 질문", description),
 226:     E.breadcrumbListEntity(ctx, [{ name: "홈", path: "/" }, { name: "자주 묻는 질문", path: null }]),
 227:     E.faqPageEntity(ctx, faqs),
 228:   ]);
 229: }
 230: 
 231: // === P-014 Location Detail ===
 232: export function locationDetailGraph(
 233:   ctx: GraphBuilderContext,
 234:   clinic: ClinicProjection,
 235:   location: LocationProjection,
 236:   description: string,
 237: ): JsonLdGraph {
 238:   return graph([
 239:     E.organizationEntity(ctx, clinic),
 240:     E.medicalClinicEntity(ctx, clinic, location),

 succeeded in 652ms:
  20:   const initial = await loadSiteInitial(params.instanceSlug);
  21:   if (!initial) return {};
  22:   const a = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
  23:     const rows = await tx<ArticleRow[]>`
  24:       SELECT a.slug, a.title, a.summary, a.body_markdown, a.hero_image_url,
  25:              a.published_at, a.author_doctor_id, a.category_id,
  26:              ac.slug AS category_slug, a.updated_at
  27:         FROM article a
  28:         JOIN article_category ac
  29:           ON a.category_id = ac.id AND a.instance_id = ac.instance_id
  30:        WHERE a.slug = ${params.slug}
  31:          AND ac.slug = ${params.category}
  32:        LIMIT 1
  33:     `;
  34:     return rows.length > 0 ? normalizeArticle(rows[0]!) : null;
  35:   });
  36:   if (!a) return {};
  37:   return buildPageMetadata(initial.clinic, params.instanceSlug, {
  38:     pageTitle: a.headline,
  39:     description: a.summary,
  40:     canonicalPath: `/insights/${a.categorySlug}/${a.slug}`,
  41:     ogType: "article",
  42:     imageUrl: a.heroImageUrl ?? undefined,
  43:   });
  44: }
  45: 
  46: export default async function ArticleDetailPage({
  47:   params,
  48: }: {
  49:   params: { instanceSlug: string; category: string; slug: string };
  50: }) {
  51:   const initial = await loadSiteInitial(params.instanceSlug);
  52:   if (!initial) notFound();
  53: 
  54:   const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
  55:     const rows = await tx<ArticleRow[]>`
  56:       SELECT a.slug, a.title, a.summary, a.body_markdown, a.hero_image_url,
  57:              a.published_at, a.author_doctor_id, a.category_id,
  58:              ac.slug AS category_slug, a.updated_at
  59:         FROM article a
  60:         JOIN article_category ac
  61:           ON a.category_id = ac.id AND a.instance_id = ac.instance_id
  62:        WHERE a.slug = ${params.slug}
  63:          AND ac.slug = ${params.category}
  64:        LIMIT 1
  65:     `;
  66:     if (rows.length === 0) return null;
  67:     const article = normalizeArticle(rows[0]!);
  68:     let author = null;
  69:     if (article.authorDoctorId) {
  70:       const doctorRows = await tx<DoctorProfileRow[]>`
  71:         SELECT slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
  72:           FROM doctor_profile

 succeeded in 668ms:
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
  72:   category_id: string;        // v0.4 EC-SCHEMA-05: NOT NULL after C0013 staged migration
  73:   category_slug: string;      // v0.4 EC-RENDER-04: SQL JOIN article_category ON ... — render layer 사용
  74:   updated_at: Date;
  75: };
  76: 
  77: export type LegalDocumentRow = {
  78:   slug: string;
  79:   document_type: string;
  80:   title: string;
 367: export type PublicationRow = {
 368:   slug: string;
 369:   title: string;
 370:   authors: unknown; // JSONB array of string
 371:   journal: string | null;
 372:   published_date: string;
 373:   doi: string | null;
 374:   pubmed_id: string | null;
 375:   url: string;
 376:   thumbnail_url: string | null;
 377:   summary: string;
 378:   author_doctor_id: string | null;
 379:   published_at: Date | null;
 380:   updated_at: Date;
 381: };
 382: 
 383: export type PublicationProjection = {
 384:   slug: string;
 385:   title: string;
 386:   authors: string[];
 387:   journal: string | null;
 388:   publishedDate: string;
 389:   doi: string | null;
 390:   pubmedId: string | null;
 391:   url: string;
 392:   thumbnailUrl: string | null;
 393:   summary: string;
 394:   authorDoctorId: string | null;
 395:   publishedAt: Date | null;
 396:   updatedAt: Date;
 397: };
 398: 
 399: function parseAuthors(raw: unknown): string[] {
 400:   if (!Array.isArray(raw)) return [];
 401:   const out: string[] = [];
 402:   for (const a of raw) {
 403:     if (typeof a === "string" && a.trim().length > 0) out.push(a.trim());
 404:   }
 405:   return out;
 406: }
 407: 
 408: export function normalizePublication(row: PublicationRow): PublicationProjection {
 409:   return {
 410:     slug: row.slug,
 411:     title: row.title,
 412:     authors: parseAuthors(row.authors),
 413:     journal: row.journal,
 414:     publishedDate: row.published_date,
 415:     doi: row.doi,
 416:     pubmedId: row.pubmed_id,
 417:     url: row.url,
 418:     thumbnailUrl: row.thumbnail_url,
 419:     summary: row.summary,
 420:     authorDoctorId: row.author_doctor_id,
 421:     publishedAt: row.published_at,
 422:     updatedAt: row.updated_at,
 423:   };
 424: }
 425: 
 426: export type MediaAppearanceRow = {
 427:   slug: string;
 428:   title: string;
 429:   channel_name: string;
 430:   channel_type: "broadcast" | "youtube" | "podcast" | "press";
 431:   published_date: string;
 432:   duration_seconds: number | null;
 433:   url: string;
 434:   thumbnail_url: string | null;
 435:   summary: string;
 436:   author_doctor_id: string | null;
 437:   published_at: Date | null;
 438:   updated_at: Date;
 439: };
 440: 
 441: export type MediaAppearanceProjection = {
 442:   slug: string;
 443:   title: string;
 444:   channelName: string;
 445:   channelType: "broadcast" | "youtube" | "podcast" | "press";
 446:   publishedDate: string;
 447:   durationSeconds: number | null;
 448:   url: string;
 449:   thumbnailUrl: string | null;
 450:   summary: string;
 451:   authorDoctorId: string | null;
 452:   publishedAt: Date | null;
 453:   updatedAt: Date;
 454: };
 455: 
 456: export function normalizeMediaAppearance(row: MediaAppearanceRow): MediaAppearanceProjection {
 457:   return {
 458:     slug: row.slug,
 459:     title: row.title,
 460:     channelName: row.channel_name,
 461:     channelType: row.channel_type,
 462:     publishedDate: row.published_date,
 463:     durationSeconds: row.duration_seconds,
 464:     url: row.url,
 465:     thumbnailUrl: row.thumbnail_url,
 466:     summary: row.summary,
 467:     authorDoctorId: row.author_doctor_id,
 468:     publishedAt: row.published_at,
 469:     updatedAt: row.updated_at,
 470:   };
 471: }
 472: 
 473: export type FaqRow = {
 474:   slug: string;
 475:   question: string;
 476:   answer: string;
 477:   display_order: number;
 478:   category_id: string | null;
 479:   related_treatment_id: string | null;
 480:   author_doctor_id: string | null;
 481:   published_at: Date | null;
 482:   updated_at: Date;
 483: };
 484: 
 485: export type FaqProjection = {
 486:   slug: string;
 487:   question: string;
 488:   answer: string;
 489:   displayOrder: number;
 490:   categoryId: string | null;
 491:   relatedTreatmentId: string | null;
 492:   authorDoctorId: string | null;
 493:   publishedAt: Date | null;
 494:   updatedAt: Date;
 495: };
 496: 
 497: export function normalizeFaq(row: FaqRow): FaqProjection {
 498:   return {
 499:     slug: row.slug,
 500:     question: row.question,
 501:     answer: row.answer,
 502:     displayOrder: row.display_order,
 503:     categoryId: row.category_id,
 504:     relatedTreatmentId: row.related_treatment_id,
 505:     authorDoctorId: row.author_doctor_id,
 506:     publishedAt: row.published_at,
 507:     updatedAt: row.updated_at,
 508:   };
 509: }
 510: 

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts' | ForEach-Object { "'$i++; if($i -ge 155 -and $i -le 195){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "mapDbErrorToResult|constraint|23503|foreign" apps/web/src/lib/errors.ts' in C:\Users\assag\solution\website-exposure
 succeeded in 619ms:
1:// @glitzy/web/lib/errors — DB constraint violation → field/form error mapping
2:// cycle1-3entity WEB-08: ClinicProfile + DoctorProfile + TreatmentPage + Article constraint 추가
7: * mapDbErrorToResult 와는 별개 (DB error 가 아닌 application-level invariant).
20:// constraint_name → field + 한국어 메시지
130: * postgres-js error 의 `code` (SQLSTATE) 와 `constraint_name` 으로 field/form 매핑.
131: * 23514 = check_violation, 23505 = unique_violation, 23503 = foreign_key_violation
133:export function mapDbErrorToResult(err: unknown): DbErrorResult | null {
135:  const e = err as { code?: string; constraint_name?: string; constraint?: string };
137:  const constraint = e.constraint_name ?? e.constraint;
138:  if (!code || !constraint) return null;
139:  if (code !== "23514" && code !== "23505" && code !== "23503") return null;
141:  const mapping = CONSTRAINT_MAP[constraint];
147:  // unknown constraint — generic
149:  if (code === "23503") return { kind: "form", message: "참조 무결성 오류 — 연결된 데이터가 없거나 삭제되었습니다." };
156:  const result = mapDbErrorToResult(err);

 succeeded in 650ms:
 155: 
 156:     if ("action" in result && result.action === "default-protected") {
 157:       return { ok: false, formError: "기본 카테고리(general)는 삭제할 수 없습니다." };
 158:     }
 159:     if ("action" in result && result.action === "in-use") {
 160:       return { ok: false, formError: "해당 카테고리를 사용 중인 아티클이 있어 삭제할 수 없습니다." };
 161:     }
 162:     if (result.deleted === 0) {
 163:       return { ok: false, formError: "해당 카테고리가 이미 삭제되었습니다." };
 164:     }
 165: 
 166:     try {
 167:       await emitAuditEvent(sqlBase, {
 168:         eventType: "content-deleted",
 169:         actorUserId: aCtx.userId,
 170:         targetUserId: aCtx.userId,
 171:         toInstanceId: aCtx.instanceId,
 172:         payload: { contentType: "ArticleCategory", slug },
 173:       });
 174:     } catch (err) {
 175:       console.error("[deleteCategory] audit emit failed", err);
 176:     }
 177: 
 178:     revalidatePath(`/admin/${instanceSlug}/categories`);
 179:     revalidatePath(`/admin/${instanceSlug}/categories/${slug}`);
 180:     revalidatePath(`/admin/${instanceSlug}`);
 181:     redirect(`/admin/${instanceSlug}/categories`);
 182:   } catch (err) {
 183:     if (isNextControlFlowError(err)) throw err;
 184:     if (err instanceof TenantResolveError) {
 185:       const action = mapAuthDenyReasonToUi(err.reason);
 186:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
 187:       if (action.kind === "not-found") notFound();
 188:       if (action.kind === "forbidden" || action.kind === "info") return { ok: false, formError: action.message };
 189:     }
 190:     const mapped = mapDbErrorToResult(err);
 191:     if (mapped !== null && mapped.kind === "form") return { ok: false, formError: mapped.message };
 192:     console.error("[deleteCategory] unexpected", err);
 193:     return { ok: false, formError: "삭제 중 오류가 발생했습니다." };
 194:   }
 195: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"revalidatePath\\("'`/'"\\"'$'"\\{instanceSlug\\}|revalidatePath\\("'`/admin|export const dynamic|cache|unstable" '"'apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts' 'apps/web/src/app/(site)'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"revalidatePath\\("'`/'"\\"'$'"\\{instanceSlug\\}|contact|about|doctors|treatments|insights\" 'apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/doctors/actions.ts' 'apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts'" in C:\Users\assag\solution\website-exposure
 succeeded in 627ms:
apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:6:import { revalidatePath } from "next/cache";
apps/web/src/app/(admin)/admin/[instanceSlug]/media-appearances/actions.ts:5:import { revalidatePath } from "next/cache";
apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts:5:import { revalidatePath } from "next/cache";
apps/web/src/app/(admin)/admin/[instanceSlug]/faqs/actions.ts:6:import { revalidatePath } from "next/cache";
apps/web/src/app/(admin)/admin/[instanceSlug]/publications/actions.ts:5:import { revalidatePath } from "next/cache";

 succeeded in 589ms:
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts:1:// @glitzy/web/(admin)/[instanceSlug]/treatments/actions
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts:156:      revalidatePath(`/admin/${instanceSlug}/treatments`);
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts:157:      revalidatePath(`/admin/${instanceSlug}/treatments/${txResult.slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts:159:        revalidatePath(`/admin/${instanceSlug}/treatments/${originalSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts:163:        redirect(`/admin/${instanceSlug}/treatments/${txResult.slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts:221:    revalidatePath(`/admin/${instanceSlug}/treatments`);
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts:222:    revalidatePath(`/admin/${instanceSlug}/treatments/${slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/treatments/actions.ts:224:    redirect(`/admin/${instanceSlug}/treatments`);
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile/actions.ts:140:            policy_contact_person, policy_contact_email, policy_contact_phone, policy_effective_date,
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile/actions.ts:173:                 policy_contact_person = EXCLUDED.policy_contact_person,
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile/actions.ts:174:                 policy_contact_email = EXCLUDED.policy_contact_email,
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile/actions.ts:175:                 policy_contact_phone = EXCLUDED.policy_contact_phone,
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile/actions.ts:271:            contactPerson: data.policyContactPerson,
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile/actions.ts:272:            contactEmail: data.policyContactEmail,
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile/actions.ts:273:            contactPhone: data.policyContactPhone,
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile/actions.ts:295:              contact_person, contact_email, status, risk_level
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile/actions.ts:319:                   contact_person = EXCLUDED.contact_person,
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile/actions.ts:320:                   contact_email = EXCLUDED.contact_email,
apps/web/src/app/(admin)/admin/[instanceSlug]/doctors/actions.ts:1:// @glitzy/web/(admin)/[instanceSlug]/doctors/actions
apps/web/src/app/(admin)/admin/[instanceSlug]/doctors/actions.ts:158:      revalidatePath(`/admin/${instanceSlug}/doctors`);
apps/web/src/app/(admin)/admin/[instanceSlug]/doctors/actions.ts:159:      revalidatePath(`/admin/${instanceSlug}/doctors/${txResult.slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/doctors/actions.ts:162:        revalidatePath(`/admin/${instanceSlug}/doctors/${originalSlug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/doctors/actions.ts:166:        redirect(`/admin/${instanceSlug}/doctors/${txResult.slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/doctors/actions.ts:254:    revalidatePath(`/admin/${instanceSlug}/doctors`);
apps/web/src/app/(admin)/admin/[instanceSlug]/doctors/actions.ts:255:    revalidatePath(`/admin/${instanceSlug}/doctors/${slug}`);
apps/web/src/app/(admin)/admin/[instanceSlug]/doctors/actions.ts:257:    redirect(`/admin/${instanceSlug}/doctors`);

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"noStore|unstable_noStore|headers\\(|cookies\\(|cache|dynamic\" apps/web/src/lib apps/web/src/app/'(site)'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "function withPublicTenantTransaction|export async function withPublicTenantTransaction|SET ROLE|app_public_reader|current_instance" apps/web/src/lib packages -g "*.ts"' in C:\Users\assag\solution\website-exposure
 succeeded in 598ms:
packages\migrations-runner\src\manifest.ts:103:  // (10) app_public_reader role + per-table SELECT policy 7개 (PUBLIC_SITE_RENDER_PLAN v0.x · PSR-25 / PSR-CASCADE-04 patch)
packages\migrations-runner\src\manifest.ts:109:      "app_public_reader",
packages\migrations-runner\src\manifest.ts:179:      "app_public_reader",
apps/web/src/lib\env.ts:9:  // PUBLIC_SITE_RENDER_PLAN v1.0 § 6 — 공개 사이트 SSR 용 app_public_reader connection
packages\db\src\tenant.ts:34: *   3. SELECT set_config('app.current_instance_id', <instanceId>, true)
packages\db\src\tenant.ts:46:    await tx`SELECT set_config('app.current_instance_id', ${opts.instanceId}, true)`;
packages\auth\src\resolve-tenant-context.ts:174: * withResolvedTenantTransaction — resolveTenantContext + SET LOCAL app.current_instance_id
packages\auth\src\resolve-tenant-context.ts:185:    await tx`SELECT set_config('app.current_instance_id', ${ctx.instanceId}, true)`;
apps/web/src/lib\public-db.ts:1:// @glitzy/web/lib/public-db — postgres.Sql singleton for app_public_reader
apps/web/src/lib\public-db.ts:5:// app_public_reader role 은 SELECT only · RLS USING instance_id 정합.
apps/web/src/lib\public-tenant.ts:7://   2. SELECT set_config('app.current_instance_id', <id>, true) — transaction-scoped
apps/web/src/lib\public-tenant.ts:26:export async function withPublicTenantTransaction<T>(
apps/web/src/lib\public-tenant.ts:42:    await tx`SELECT set_config('app.current_instance_id', ${instanceId}, true)`;
apps/web/src/lib\tenant.ts:14: *   2) withTenantTransaction (SET LOCAL ROLE app_tenant_user + SET LOCAL app.current_instance_id)

 succeeded in 603ms:
apps/web/src/lib\env.ts:24:let cachedEnv: Env | null = null;
apps/web/src/lib\env.ts:25:let cachedAuthCfg: AuthConfig | null = null;
apps/web/src/lib\env.ts:28:  if (cachedEnv !== null) return cachedEnv;
apps/web/src/lib\env.ts:34:  cachedEnv = parsed.data;
apps/web/src/lib\env.ts:35:  return cachedEnv;
apps/web/src/lib\env.ts:39:  if (cachedAuthCfg !== null) return cachedAuthCfg;
apps/web/src/lib\env.ts:50:  cachedAuthCfg = cfg;
apps/web/src/lib\env.ts:51:  return cachedAuthCfg;
apps/web/src/lib\session-cookie.ts:11:  const store = cookies();
apps/web/src/lib\session-cookie.ts:19:  cookies().set(COOKIE_NAME, signedToken, {
apps/web/src/lib\session-cookie.ts:29:  cookies().delete(COOKIE_NAME);
apps/web/src/lib\site-initial.ts:7:// PSRC-10 patch: React `cache()` 로 render pass 안 중복 SELECT 회피.
apps/web/src/lib\site-initial.ts:10:import { cache } from "react";
apps/web/src/lib\site-initial.ts:28:export const loadSiteInitial = cache(async (instanceSlug: string): Promise<SiteInitial | null> => {
apps/web/src/lib\site-metadata.test.ts:7:// site-url.ts 의 headers() (Next request scope) 를 mock — vitest node env
apps/web/src/lib\site-url.ts:23:  const h = headers();
apps/web/src/lib\site-url.ts:37:  const h = headers();

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content apps/web/src/lib/public-tenant.ts | ForEach-Object { $i++; if($i -ge 1 -and $i -le 80){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content apps/web/src/lib/site-url.ts | ForEach-Object { $i++; if($i -ge 1 -and $i -le 55){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
 succeeded in 692ms:
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
  11: import type { Sql, TransactionSql } from "postgres";
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
  28:   fn: (tx: TransactionSql, ctx: PublicTenantContext) => Promise<T>,
  29: ): Promise<T | null> {
  30:   const sql: Sql = getSqlPublic();
  31:   // PSRC-03 patch: postgres-js begin() 안 callback 의 첫 인자 = TransactionSql.
  32:   // null 도 fn 반환과 함께 union 으로 사용 가능하도록 generic 명시.
  33:   return sql.begin<T | null>(async (tx: TransactionSql) => {
  34:     // 1) instance lookup — RLS public_reader_instance_select policy USING active=true
  35:     const rows = await tx<{ id: string }[]>`
  36:       SELECT id FROM instance WHERE slug = ${instanceSlug} LIMIT 1
  37:     `;
  38:     if (rows.length === 0) return null;
  39:     const instanceId = rows[0]!.id;
  40: 
  41:     // 2) transaction-scoped instance scope
  42:     await tx`SELECT set_config('app.current_instance_id', ${instanceId}, true)`;
  43: 
  44:     // 3) callback
  45:     return fn(tx, { instanceId, instanceSlug });
  46:   }) as Promise<T | null>;
  47: }

 succeeded in 714ms:
   1: // @glitzy/web/lib/site-url — request-aware site base URL helper
   2: // SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4 PSR-SEO-12 (v0.1 path-based · M0 도메인 매핑 PSR-CASCADE-02)
   3: //
   4: // PSRC-08 patch: canonical/OpenGraph URL 은 항상 absolute URL.
   5: // PSRC-09 patch: Host/X-Forwarded headers 의 spoof 회피 — env `PUBLIC_SITE_ORIGIN` (또는 production deployment URL)
   6: // 가 설정되어 있으면 우선. 없으면 request host fallback (dev/staging 한정).
   7: 
   8: import { headers } from "next/headers";
   9: 
  10: /**
  11:  * Compute the v0.1 path-based site base URL for the current request.
  12:  * 예: `https://glitzy.example.com/glitzy-clinic` (production · PUBLIC_SITE_ORIGIN 설정)
  13:  *     `http://localhost:3000/glitzy-clinic` (dev fallback)
  14:  * M0 v1.0 도메인 매핑 cascade 시 (PSR-DEFER-02) middleware rewrite + 본 helper 의 instanceSlug 제거.
  15:  */
  16: export function siteBaseUrl(instanceSlug: string): string {
  17:   // PSRC-09: production trusted origin 우선 — Host header spoof 회피
  18:   const trustedOrigin = process.env.PUBLIC_SITE_ORIGIN;
  19:   if (trustedOrigin && trustedOrigin.length > 0) {
  20:     return `${trustedOrigin.replace(/\/$/, "")}/${instanceSlug}`;
  21:   }
  22:   // dev/staging fallback — request host
  23:   const h = headers();
  24:   const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  25:   const proto = h.get("x-forwarded-proto") ?? "http";
  26:   return `${proto}://${host}/${instanceSlug}`;
  27: }
  28: 
  29: /**
  30:  * Compute origin only (no instanceSlug suffix). For sitemap/robots sitemap URL.
  31:  */
  32: export function siteOrigin(): string {
  33:   const trustedOrigin = process.env.PUBLIC_SITE_ORIGIN;
  34:   if (trustedOrigin && trustedOrigin.length > 0) {
  35:     return trustedOrigin.replace(/\/$/, "");
  36:   }
  37:   const h = headers();
  38:   const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  39:   const proto = h.get("x-forwarded-proto") ?? "http";
  40:   return `${proto}://${host}`;
  41: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"articleEntity\\(\" apps packages" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"scholarlyArticleEntity\\(|videoObjectEntity\\(|faqPageEntity\\(\" apps/web/src" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"status.*published|published_at|status =|status: EatStatusSchema|name=\\\"status\\\"|draft\" apps/web/src/components/forms/PublicationForm.tsx apps/web/src/components/forms/MediaAppearanceForm.tsx apps/web/src/components/forms/FaqForm.tsx" in C:\Users\assag\solution\website-exposure
2026-05-18T07:50:58.853012Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.7 seconds
Output:
rg: regex parse error:
    (?:status.*published|published_at|status =|status: EatStatusSchema|name=\)
    ^
error: unclosed group

 exited 1 in 698ms:
rg: regex parse error:
    (?:status.*published|published_at|status =|status: EatStatusSchema|name=\)
    ^
error: unclosed group

 succeeded in 781ms:
apps\web\src\lib\json-ld\builders.ts:189:    E.articleEntity(ctx, article, author),
apps\web\src\lib\json-ld\entities.ts:122:export function articleEntity(

 succeeded in 797ms:
apps/web/src\lib\json-ld\__tests__\eat-validate.test.ts:123:    const entity = videoObjectEntity(MEDIA, `${SITE_BASE_URL}/doctors/hong`);
apps/web/src\lib\json-ld\__tests__\eat-validate.test.ts:151:    const entity = scholarlyArticleEntity(
apps/web/src\lib\json-ld\__tests__\eat-validate.test.ts:166:      const entity = videoObjectEntity(
apps/web/src\lib\json-ld\__tests__\eat-validate.test.ts:229:    const entity = faqPageEntity(ctx, FAQ_ITEMS);
apps/web/src\lib\json-ld\entities.ts:217:export function scholarlyArticleEntity(
apps/web/src\lib\json-ld\entities.ts:248:export function videoObjectEntity(
apps/web/src\lib\json-ld\entities.ts:267:export function faqPageEntity(
apps/web/src\lib\json-ld\builders.ts:53:  const publicationEntities = publications.map((p) => E.scholarlyArticleEntity(ctx, p, aboutBaseUrl));
apps/web/src\lib\json-ld\builders.ts:54:  const mediaEntities = media.map((m) => E.videoObjectEntity(m, aboutBaseUrl));
apps/web/src\lib\json-ld\builders.ts:111:  const publicationEntities = publications.map((p) => E.scholarlyArticleEntity(ctx, p, doctorBaseUrl));
apps/web/src\lib\json-ld\builders.ts:112:  const mediaEntities = media.map((m) => E.videoObjectEntity(m, doctorBaseUrl));
apps/web/src\lib\json-ld\builders.ts:227:    E.faqPageEntity(ctx, faqs),

codex
# EAT_CONTENT code v1.0 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=1 major=3 minor=2 (총 6)
- closeableAfterPatch: false
- 수렴 추세: 이전 cycle 없음 — 본 cycle 이 첫

## blocking
- **ECC-01**: C0013 staged migration 이 재실행/부분 실패 복구 idempotency 를 만족하지 않음
  - 위치: `packages/core-content/migrations/C0013_article_category_fk.sql`:11, 32, 34, 39
  - 근거(plan SoT): EC-SCHEMA-05/06/07, ECP-03/09; cycle 1 점검 항목 “staged 4-step migration 의 idempotency”
  - 문제: `ADD COLUMN`, `SET NOT NULL`, `ADD CONSTRAINT`, `CREATE INDEX`가 모두 plain DDL이다. 2단계 이후 실패한 뒤 재실행하면 line 11의 `category_id` 중복 컬럼에서 즉시 실패한다. plan이 요구한 “backfill INSERT IF NOT EXISTS / NULL article row 만 UPDATE”는 일부만 충족한다.
  - 권장 patch: `ADD COLUMN IF NOT EXISTS`, constraint/index 존재 여부 guard, `ALTER COLUMN SET NOT NULL` 전 NULL 잔존 검증을 명시한다. constraint는 `DO $$ BEGIN IF NOT EXISTS (...) THEN ALTER TABLE ... ADD CONSTRAINT ...; END IF; END $$;` 패턴으로 감싼다.

## major
- **ECC-02**: `general` 기본 카테고리 보호가 삭제에만 적용되어 rename 으로 깨짐
  - 위치: `apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts`:52-60, `apps/web/src/app/(admin)/admin/[instanceSlug]/categories/[slug]/page.tsx`:75-77
  - 근거(plan SoT): EC-SCHEMA-03, C0013 default `general` seed/backfill, Article action fallback 흐름
  - 문제: 편집 화면에서 `general` 삭제 버튼은 숨기지만 slug 필드는 그대로 editable이고, action도 `originalSlug === "general"`인 update를 막지 않는다. 운영자가 `general`을 다른 slug로 저장하면 새 Article 저장 시 fallback query가 `slug = 'general'`을 찾지 못해 `default-category-missing`이 된다.
  - 권장 patch: `originalSlug === "general"`이면 slug 변경을 서버에서 거부하거나 slug input을 readOnly 처리한다. 더 안전하게는 기본 카테고리 여부를 slug 문자열이 아니라 DB row/metadata invariant로 보호한다.

- **ECC-03**: Article categoryId 직접 입력값을 사전 resolve/lock 하지 않아 오류 흐름이 FK 의존적임
  - 위치: `apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts`:131-147, 177-199
  - 근거(plan SoT): EC-FORM categoryId resolve 흐름, 정합성/원자성 “form 값 → currentCategoryId → default `general`”
  - 문제: form에서 `categoryId`가 오면 instance-scoped 존재 확인 없이 그대로 UPDATE/INSERT에 사용한다. cross-tenant/삭제된 UUID는 DB FK로 막히지만, action의 resolve 단계가 아니라 DB error fallback으로 흐른다. default `general`만 SELECT하고 명시 선택 category는 검증하지 않는 비대칭이다.
  - 권장 patch: `parsed.data.categoryId`가 있으면 같은 transaction 안에서 `SELECT id FROM article_category WHERE instance_id = ... AND id = ... LIMIT 1`로 resolve하고 없으면 `category-not-found`를 반환한다.

- **ECC-04**: ArticleCategory delete race 시 “in-use” 보장이 DB error generic 으로 붕괴 가능
  - 위치: `apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts`:131-151, 190-193
  - 근거(plan SoT): 원자성 “ArticleCategory delete 의 `general` 보호 + article ref count 검사 (race 안전 — same tx 안 검사)”
  - 문제: ref count 검사 후 DELETE 전 concurrent article insert가 들어오면 FK가 삭제를 막지만, catch는 `mapped.kind === "form"`만 반환한다. `article_category_fk`는 field mapping이라 line 191에서 버려지고 generic “삭제 중 오류”가 된다. 무결성은 보존되지만 plan의 race-safe UX/의도와 다르다.
  - 권장 patch: delete catch에서 FK field mapping도 form-level “사용 중” 메시지로 변환하거나, 대상 category row를 `FOR UPDATE`로 잠그고 FK race 결과를 명시 처리한다.

## minor
- **ECC-05**: Markdown plain-text helper 의 image 처리 순서가 잘못되어 `!alt`가 남음
  - 위치: `apps/web/src/lib/markdown.ts`:155-158
  - 근거(plan SoT): EC-RENDER-05 / ECP-19 Markdown plain text helper
  - 문제: link regex가 image의 `[alt](url)` 부분을 먼저 소비하므로 `![alt](url)`이 `!alt`가 된다. JSON-LD `Answer.text` 품질 이슈다.
  - 권장 patch: image 치환을 link 치환보다 먼저 수행한다.

- **ECC-06**: FAQ `<summary>` disclosure affordance 를 제거함
  - 위치: `apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx`:75-79
  - 근거(plan SoT): P-011 FAQ M0, a11y 점검
  - 문제: native `<details>/<summary>` 자체는 keyboard accessible이지만 `list-none`으로 기본 marker를 없애고 대체 아이콘/상태 표시가 없다. 접힘/펼침 가능성이 시각적으로 약하다.
  - 권장 patch: marker를 유지하거나 `aria-hidden` 아이콘을 추가하고 `details[open]` 상태 스타일을 준다.

## acceptance precondition 점검
- EC-CASCADE-05 (D0014 실 SQL): PASS
- EC-RENDER 4-기둥 (faq · doctor · about · article SQL JOIN): PASS
- EC-SCHEMA 6 마이그레이션 idempotency: FAIL
- 누계 시작점: 144 cycle 1224 (plan acceptance) → 149 cycle 1229 / code review cycle 1 누계 6 findings
tokens used
213,087
# EAT_CONTENT code v1.0 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=1 major=3 minor=2 (총 6)
- closeableAfterPatch: false
- 수렴 추세: 이전 cycle 없음 — 본 cycle 이 첫

## blocking
- **ECC-01**: C0013 staged migration 이 재실행/부분 실패 복구 idempotency 를 만족하지 않음
  - 위치: `packages/core-content/migrations/C0013_article_category_fk.sql`:11, 32, 34, 39
  - 근거(plan SoT): EC-SCHEMA-05/06/07, ECP-03/09; cycle 1 점검 항목 “staged 4-step migration 의 idempotency”
  - 문제: `ADD COLUMN`, `SET NOT NULL`, `ADD CONSTRAINT`, `CREATE INDEX`가 모두 plain DDL이다. 2단계 이후 실패한 뒤 재실행하면 line 11의 `category_id` 중복 컬럼에서 즉시 실패한다. plan이 요구한 “backfill INSERT IF NOT EXISTS / NULL article row 만 UPDATE”는 일부만 충족한다.
  - 권장 patch: `ADD COLUMN IF NOT EXISTS`, constraint/index 존재 여부 guard, `ALTER COLUMN SET NOT NULL` 전 NULL 잔존 검증을 명시한다. constraint는 `DO $$ BEGIN IF NOT EXISTS (...) THEN ALTER TABLE ... ADD CONSTRAINT ...; END IF; END $$;` 패턴으로 감싼다.

## major
- **ECC-02**: `general` 기본 카테고리 보호가 삭제에만 적용되어 rename 으로 깨짐
  - 위치: `apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts`:52-60, `apps/web/src/app/(admin)/admin/[instanceSlug]/categories/[slug]/page.tsx`:75-77
  - 근거(plan SoT): EC-SCHEMA-03, C0013 default `general` seed/backfill, Article action fallback 흐름
  - 문제: 편집 화면에서 `general` 삭제 버튼은 숨기지만 slug 필드는 그대로 editable이고, action도 `originalSlug === "general"`인 update를 막지 않는다. 운영자가 `general`을 다른 slug로 저장하면 새 Article 저장 시 fallback query가 `slug = 'general'`을 찾지 못해 `default-category-missing`이 된다.
  - 권장 patch: `originalSlug === "general"`이면 slug 변경을 서버에서 거부하거나 slug input을 readOnly 처리한다. 더 안전하게는 기본 카테고리 여부를 slug 문자열이 아니라 DB row/metadata invariant로 보호한다.

- **ECC-03**: Article categoryId 직접 입력값을 사전 resolve/lock 하지 않아 오류 흐름이 FK 의존적임
  - 위치: `apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts`:131-147, 177-199
  - 근거(plan SoT): EC-FORM categoryId resolve 흐름, 정합성/원자성 “form 값 → currentCategoryId → default `general`”
  - 문제: form에서 `categoryId`가 오면 instance-scoped 존재 확인 없이 그대로 UPDATE/INSERT에 사용한다. cross-tenant/삭제된 UUID는 DB FK로 막히지만, action의 resolve 단계가 아니라 DB error fallback으로 흐른다. default `general`만 SELECT하고 명시 선택 category는 검증하지 않는 비대칭이다.
  - 권장 patch: `parsed.data.categoryId`가 있으면 같은 transaction 안에서 `SELECT id FROM article_category WHERE instance_id = ... AND id = ... LIMIT 1`로 resolve하고 없으면 `category-not-found`를 반환한다.

- **ECC-04**: ArticleCategory delete race 시 “in-use” 보장이 DB error generic 으로 붕괴 가능
  - 위치: `apps/web/src/app/(admin)/admin/[instanceSlug]/categories/actions.ts`:131-151, 190-193
  - 근거(plan SoT): 원자성 “ArticleCategory delete 의 `general` 보호 + article ref count 검사 (race 안전 — same tx 안 검사)”
  - 문제: ref count 검사 후 DELETE 전 concurrent article insert가 들어오면 FK가 삭제를 막지만, catch는 `mapped.kind === "form"`만 반환한다. `article_category_fk`는 field mapping이라 line 191에서 버려지고 generic “삭제 중 오류”가 된다. 무결성은 보존되지만 plan의 race-safe UX/의도와 다르다.
  - 권장 patch: delete catch에서 FK field mapping도 form-level “사용 중” 메시지로 변환하거나, 대상 category row를 `FOR UPDATE`로 잠그고 FK race 결과를 명시 처리한다.

## minor
- **ECC-05**: Markdown plain-text helper 의 image 처리 순서가 잘못되어 `!alt`가 남음
  - 위치: `apps/web/src/lib/markdown.ts`:155-158
  - 근거(plan SoT): EC-RENDER-05 / ECP-19 Markdown plain text helper
  - 문제: link regex가 image의 `[alt](url)` 부분을 먼저 소비하므로 `![alt](url)`이 `!alt`가 된다. JSON-LD `Answer.text` 품질 이슈다.
  - 권장 patch: image 치환을 link 치환보다 먼저 수행한다.

- **ECC-06**: FAQ `<summary>` disclosure affordance 를 제거함
  - 위치: `apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx`:75-79
  - 근거(plan SoT): P-011 FAQ M0, a11y 점검
  - 문제: native `<details>/<summary>` 자체는 keyboard accessible이지만 `list-none`으로 기본 marker를 없애고 대체 아이콘/상태 표시가 없다. 접힘/펼침 가능성이 시각적으로 약하다.
  - 권장 patch: marker를 유지하거나 `aria-hidden` 아이콘을 추가하고 `details[open]` 상태 스타일을 준다.

## acceptance precondition 점검
- EC-CASCADE-05 (D0014 실 SQL): PASS
- EC-RENDER 4-기둥 (faq · doctor · about · article SQL JOIN): PASS
- EC-SCHEMA 6 마이그레이션 idempotency: FAIL
- 누계 시작점: 144 cycle 1224 (plan acceptance) → 149 cycle 1229 / code review cycle 1 누계 6 findings
