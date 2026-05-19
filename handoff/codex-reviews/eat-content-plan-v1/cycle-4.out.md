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
session id: 019e39d9-fab2-7cd1-b70b-a1821bc316ff
--------
user
Review `docs/decisions/EAT_CONTENT_PLAN.md` v0.4 cycle 4.

## Cycle 3 patch (3 findings)

| # | severity | title | patch |
|---|---|---|---|
| ECP-31 | major | PAGE_TYPES § 5 matrix + § 6 P-011 M0 미합류 | § 5 matrix row P-011 ✅ + § 6 페이지 #10 P-011 추가 + 어드민 화면 수 6→7 + 우선순위 P-011 strike-through |
| ECP-32 | minor | DATA_MODEL § 0 "23개 계약" 충돌 | "25개 계약 (C-01~C-25)" |
| ECP-33 | minor | DATA_MODEL ComplianceRecord 대상 범위 | "C-01~C-22" → "C-01~C-25" |

## Task

cycle 3 의 3 patch 각각 검증 + 새 finding. 짧게.

## Output (한국어 · 간결)

```
# EAT_CONTENT_PLAN v0.4 — cycle 4 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴: cycle1=22 → cycle2=8 → cycle3=3 → cycle4=N

## cycle 3 patch 검증
- ECP-31: PASS/FAIL + 한 줄
- ECP-32: PASS/FAIL
- ECP-33: PASS/FAIL

## new findings (있을 경우)

## acceptance 판정
- closeableAfterPatch=true 면 plan v1.0 acceptance commit 진행 권고
```

cycle 3 의 3건 모두 PASS + 새 blocking/major 0 이면 closeableAfterPatch=true 확정.

codex
문서의 해당 섹션과 이전 패치 반영 지점을 확인해서, 기존 3건은 증거 기준으로 PASS/FAIL만 판단하고 새 이슈는 blocking/major 위주로 보겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "P-011|23개 계약|25개 계약|ComplianceRecord|C-01~C-22|C-01~C-25|어드민|admin|PAGE_TYPES|matrix|M0|우선순위" docs/decisions/EAT_CONTENT_PLAN.md' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/decisions/EAT_CONTENT_PLAN.md -TotalCount 260' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-ChildItem -Path docs/decisions | Select-Object Name,Length,LastWriteTime' in C:\Users\assag\solution\website-exposure\apps\web
2026-05-18T06:50:56.999914Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.6 seconds
Output:
rg: docs/decisions/EAT_CONTENT_PLAN.md: IO error for operation on docs/decisions/EAT_CONTENT_PLAN.md: 지정된 경로를 찾을 수 없습니다. (os error 3)

 exited 1 in 608ms:
rg: docs/decisions/EAT_CONTENT_PLAN.md: IO error for operation on docs/decisions/EAT_CONTENT_PLAN.md: 지정된 경로를 찾을 수 없습니다. (os error 3)

2026-05-18T06:50:57.082057Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.7 seconds
Output:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Path docs/decisions/EAT_CONTENT_PLAN.md -TotalCount 260[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot find path 'C:\Users\assag\solution\website-exposure\apps\web\docs\decisions\EAT_CONTENT_PLAN.md' because it does not exist.[0m

 exited 1 in 691ms:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Path docs/decisions/EAT_CONTENT_PLAN.md -TotalCount 260[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot find path 'C:\Users\assag\solution\website-exposure\apps\web\docs\decisions\EAT_CONTENT_PLAN.md' because it does not exist.[0m

2026-05-18T06:50:57.112586Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.7 seconds
Output:
[31;1mGet-ChildItem: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-ChildItem -Path docs/decisions[0m | Select-Object Name,Length,LastWr …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot find path 'C:\Users\assag\solution\website-exposure\apps\web\docs\decisions' because it does not exist.[0m

 exited 1 in 710ms:
[31;1mGet-ChildItem: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-ChildItem -Path docs/decisions[0m | Select-Object Name,Length,LastWr …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot find path 'C:\Users\assag\solution\website-exposure\apps\web\docs\decisions' because it does not exist.[0m

codex
요청 경로는 현재 앱 하위에는 없어서 저장소 안에서 실제 문서 위치를 먼저 찾고 있습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg --files -g "EAT_CONTENT_PLAN.md" -g "*CONTENT_PLAN*"' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg --files -g "EAT_CONTENT_PLAN.md" -g "*CONTENT_PLAN*"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-ChildItem -Path C:\\Users\\assag\\solution\\website-exposure -Directory | Select-Object Name" in C:\Users\assag\solution\website-exposure\apps\web
2026-05-18T06:51:04.289061Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.7 seconds
Output:

 exited 1 in 674ms:
 succeeded in 691ms:
docs\decisions\EAT_CONTENT_PLAN.md

 succeeded in 704ms:

[32;1mName[0m
[32;1m----[0m
.agents
.claude
.codex-reviews
.pnpm-store
apps
docs
handoff
node_modules
packages


exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"P-011|23개 계약|25개 계약|ComplianceRecord|C-01~C-22|C-01~C-25|어드민|admin|PAGE_TYPES|matrix|M0|우선순위|5\\.|6\\.\" docs/decisions/EAT_CONTENT_PLAN.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/decisions/EAT_CONTENT_PLAN.md -TotalCount 360' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'git diff -- docs/decisions/EAT_CONTENT_PLAN.md' in C:\Users\assag\solution\website-exposure
 succeeded in 612ms:
6:> - **plan acceptance commit 안 cascade (docs only · acceptance precondition)**: 본 plan + DATA_MODEL § 1.1 인벤토리 25 + § 4 C-10 enum +2 + C-12 풀명세 + C-22 marker + C-24/25 신규 풀명세 + PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 11페이지 + SCHEMA_MAPPING § 2 ScholarlyArticle/VideoObject 카탈로그 + CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 + ARCH § 3.11 11 페이지 + M0_BUILD_EXPORT § 2.2 4 entity 변환 표 + PUBLIC_SITE_RENDER PSR-DEFER-11/15 해소 marker + manifest.ts orderedMigrations 16 entry (spec only — runner 코드는 LL-DEFER-20).
7:> - **EAT_CONTENT code v1.0 cycle 안 cascade (별 사이클 분리 · 실 코드)**: migrations 6 (C0009/10/11/12/13 + D0014) · Drizzle schema v0.4 · zod schema · 어드민 폼 4종 + route 4종 + dashboard · JSON-LD entities/builders 확장 · P-011 FAQ public page · Doctor/About graph 확장 · Article detail SQL JOIN article_category · sitemap.xml 확장 · seed.ts default category · renderMarkdownToPlainText helper · vitest scenario 24~36.
15:| Faq | **C-12 풀명세 합류 + M0 합류** (기존 간략 명세 → 풀명세) | C-12 (기존) |
16:| ArticleCategory | **C-22 실 운영 합류 + M0 합류** (기존 풀명세 — v0.1 단계 flat 1-level minimal, parentCategory/pillar 등 optional 컬럼은 DB 추가하되 어드민 UI/공개 렌더는 v0.1 미사용) | C-22 (기존) |
18:모든 entity 는 schema.org JSON-LD 로 출력되어 P-004 Doctor Profile · P-002 About · P-011 FAQ 페이지에 합류한다.
20:> **scope limit (EC-INTRO-01)** — 본 plan 은 다음만 다룬다: (1) C-24 Publication · C-25 MediaAppearance 신규 + C-12 Faq · C-22 ArticleCategory 합류. (2) DATA_MODEL C-10 `contentType` enum cascade (+Publication +MediaAppearance). (3) PSR-DEFER-11(부분: FAQ P-011) · PSR-DEFER-15 (Article category required) 해소. (4) PUBLIC_SITE_RENDER code v1.0 의 D0011 GRANT cascade (D0014). **본 plan 외**: Inquiry (1:1 상담 게시판 — PIPA 큰 결정), Reviews/Pricing High-risk commercial, Publication/MediaAppearance 별도 페이지 (모두 EC-DEFER).
25:- `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ — M0 미합류 → 본 plan 합류 (EC-CASCADE-08)
26:- `docs/core/SCHEMA_MAPPING.md` § 1.2 `@id` 패턴 · § 2 entity 카탈로그 (+ ScholarlyArticle, VideoObject) · § 3 P-011 FAQ graph (EC-CASCADE-02)
27:- `docs/core/SEARCH_STANDARDIZATION.md` § 4.3 sitemap P-011 monthly 0.5
30:- `docs/admin/ARCHITECTURE.md` § 3 — Vertical Slice 안 P-011 FAQ 페이지 합류 marker (EC-CASCADE-09)
33:- `docs/decisions/M0_BUILD_EXPORT_PLAN.md` v0.1 § 2.1 — 신규 entity Git 출력 cascade (EC-CASCADE-04)
39:  - `apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts` (server action 패턴)
50:- **운영자 입력 UX 표준화** — M0 3-entity (Doctor/Treatment/Article) 폼 패턴 재사용.
59:| C-12 Faq 풀명세 합류 | DATA_MODEL § 5 간략 명세를 풀명세로 (EC-CASCADE-01) + M0 합류 |
60:| C-22 ArticleCategory 실 운영 합류 (PSR-DEFER-15 해소) | DATA_MODEL § 4 기존 풀명세 (parentCategory·pillar·coverImageUrl·seoMeta·articleTypeDefault) — DB 컬럼은 모두 추가 (optional · v0.1 nullable). 어드민 UI/공개 렌더는 v0.1 minimal (slug·name·displayOrder만 노출 · 나머지 EC-DEFER-10 M1) |
65:| 어드민 폼 4종 (CRUD) | PublicationForm · MediaAppearanceForm · FaqForm · ArticleCategoryForm. 패턴 = M0 3-entity 폼 + REVIEW_WORKFLOW status 9-state |
66:| status zod enum subset (cycle 1 ECP-10·11 정정) | v0.1 단계 status zod = `z.enum(['draft'])` 만 — compliance-assistant 합류 (EC-DEFER-05) 전까지 모든 4 entity 어드민 폼에서 published 차단. **FAQ 도 published 차단** (위험도 자동 추론 합류 전 Medium/High 자동 발행 회피). LegalDocument 패턴 정합 |
67:| 공개 페이지 P-011 FAQ 신설 (cycle 1 ECP-12 정정 — PAGE_TYPES M0 합류 EC-CASCADE-08 acceptance precondition 격상) | `/<slug>/faq` route — FaqList + FAQPage JSON-LD |
73:| sitemap.xml 확장 | P-011 FAQ entry (changefreq monthly · priority 0.5 · lastmod `MAX(faq.updated_at)`) — published row 0건이어도 페이지 포함 (cycle 1 ECP-21 정정) |
79:| authors DEFAULT 제거 (cycle 1 ECP-18 정정) | `authors JSONB NOT NULL` (DEFAULT `[]` 삭제) + min 1 CHECK + 어드민 폼에서 required |
91:| Publication / MediaAppearance 검수 워크플로우 (status='review-queued' 전이 + ComplianceRecord pre-publish) | LL-DEFER-01 patterns 동일 — compliance-assistant + ComplianceRecord 합류 | EC-DEFER-07 |
94:| ArticleCategory 트리/계층 (parentCategory) · 메타 컬럼 (pillar · coverImageUrl · seoMeta · articleTypeDefault) 어드민 UI/공개 렌더 사용 | M1 Phase Alpha — v0.1 DB 컬럼은 추가하되 UI/렌더 미사용 | EC-DEFER-10 |
96:| 4 entity 어드민 published 발행 (status='published' 전이) | EC-DEFER-05 와 동일 시점 — compliance-assistant 합류 + Faq risk_level 자동 추론 후 | EC-DEFER-12 |
102:DATA_MODEL § 4 C-22 풀명세 전체 컬럼을 DB 에 추가 (v0.1 단계 어드민 UI 는 minimal — slug·name·displayOrder 만 노출 · 나머지 EC-DEFER-10):
146:- (EC-SCHEMA-02) C-22 풀명세 전체 컬럼 추가. v0.1 어드민 UI minimal — slug·name·displayOrder 만 노출. parentCategory·pillar·coverImageUrl·seoMeta·articleTypeDefault 는 DB 컬럼만 존재 + EC-DEFER-10 marker.
148:- (EC-SCHEMA-04) flat 1-level 운영 v0.1 — `parent_category_id IS NULL` 인 row 만 어드민 UI 노출 (DB 자체는 self-referencing FK 허용).
343:  -- related_condition_id 의 medical_condition_page FK 는 C-11 합류 후 (M0 외 cascade)
363:- (EC-SCHEMA-15) C-12 SoT 의 `relatedTreatment` · `relatedCondition` 필드 — DB nullable column 추가. v0.1 어드민 UI 미노출 (EC-DEFER-09 와 함께 다음 cycle).
408:- (EC-SCHEMA-17) ArticleCategory taxonomy public — instance_id only RLS. 분류 자체는 status 없음. 운영 중 추가한 카테고리는 즉시 public_reader 에 노출. **본 결정의 정당성**: 카테고리는 콘텐츠 카탈로그 (Article/Faq 의 분류) — 자체 콘텐츠 게시는 아님. URL `/<slug>/insights/<category>/...` 가 작동하려면 모든 카테고리가 lookup 가능해야. status 게이트는 분류 미사용 단계에서도 article URL routing 차단 → 운영 부담. EC-DEFER-10 phase 의 어드민 UI 합류 시 `active` flag 추가 cascade.
420:- (EC-CONTENT-05) ComplianceRecord (C-10) 의 `contentType` enum 확장 cascade.
422:## 4. 어드민 폼 결정
428:| ArticleCategory | `/admin/<slug>/categories` |
429:| Publication | `/admin/<slug>/publications` |
430:| MediaAppearance | `/admin/<slug>/media-appearances` |
431:| Faq | `/admin/<slug>/faqs` |
435:v0.1 단계 4 entity 어드민 폼 schema 에 명시:
460:`/admin/<slug>/page.tsx` 안 4 신규 entity card 추가 (count + new link). 기존 4 card (Clinic·Doctors·Treatments·Articles) + 4 신규 (Categories·Publications·Media·FAQs) = 총 8 card.
462:## 5. 공개 페이지 렌더 결정 — cycle 1 ECP-06·13·15·17 정정
464:### 5.1 P-011 FAQ 신규 페이지 (EC-RENDER-01) — PSR-DEFER-11 부분 해소
474:### 5.2 Doctor Profile (P-004) 확장 — graph 안 풀 entity 출력 (EC-RENDER-02) — cycle 1 ECP-06·13 정정
488:### 5.3 About (P-002) 확장 — MedicalClinic.subjectOf 단일 결정 (EC-RENDER-03) — cycle 1 ECP-15 정정
500:### 5.4 Article URL `[category]` 실 DB join — PSR-DEFER-15 해소 (EC-RENDER-04) — cycle 1 ECP-17 정정
516:### 5.5 Markdown helper 2 종 (EC-RENDER-05) — cycle 1 ECP-19 정정
525:### 5.6 sitemap.xml 확장 (EC-RENDER-06) — cycle 1 ECP-21 정정
527:- P-011 `/<slug>/faq` 추가 — changefreq `monthly` · priority `0.5` (SEARCH_STANDARDIZATION § 4.3 정합).
532:### 5.7 외부 링크 rel 통일 (EC-RENDER-07) — cycle 1 ECP-20 정정
536:## 6. SCHEMA_MAPPING 결정 — cycle 1 ECP-05·06·13·14·15 정정 (EC-CASCADE-02)
538:### 6.1 ScholarlyArticle entity (Publication)
559:### 6.2 VideoObject entity (MediaAppearance — 4 channel_type 모두) — cycle 1 ECP-05·14 정정 (단일화)
577:### 6.3 FAQPage (P-011) — cycle 1 ECP-19 정합
598:### 6.4 페이지별 graph 매트릭스 (EC-SEO-01)
604:| P-011 FAQ | `[풀] Organization` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] FAQPage` (with Question[] inline `mainEntity`) |
672:| 9 | 4 admin form (Publication·MediaAppearance·Faq·ArticleCategory) | apps/web/src/components/forms/{Publication,MediaAppearance,Faq,ArticleCategory}Form.tsx |
673:| 10 | 4 admin route group + actions.ts | apps/web/src/app/(admin)/admin/[instanceSlug]/{publications,media-appearances,faqs,categories}/{page,new/page,[slug]/page,actions}.tsx |
679:| 16 | P-011 FAQ public page (cycle 1 ECP-21 — 빈 페이지도 200) | apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx + metadata + JsonLdScript |
683:| 20 | sitemap.xml 확장 — P-011 FAQ entry + article URL 실 category slug | (site)/[instanceSlug]/sitemap.xml/route.ts |
684:| 21 | dashboard cascade — 8 card | (admin)/admin/[instanceSlug]/page.tsx |
689:| 26 | docs cascade — DATA_MODEL § 1.1 인벤토리 25 contracts · § 4 C-10 enum +2 · C-12 풀명세 · C-22 풀명세 컬럼 정합 · C-24 Publication · C-25 MediaAppearance 풀명세 (EC-CASCADE-01) · SCHEMA_MAPPING § 2 entity 카탈로그 · § 3 P-011 (EC-CASCADE-02) · CONTENT_STANDARDS § 7.1.1.x (EC-CASCADE-03) · PSR-DEFER-11/15 해소 marker (EC-CASCADE-07) · M0_BUILD_EXPORT § 2.1 (EC-CASCADE-04) · PAGE_TYPES § 1.1 P-011 M0 ✅ + § 3 본문 (EC-CASCADE-08 acceptance precondition — cycle 1 ECP-12 격상) · ARCH § 3 Vertical Slice 정합 (EC-CASCADE-09 — 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ) | doc patches |
691:## 11. M0 v1.0 cascade markers (defer 정리)
703:- `EC-DEFER-10`: ArticleCategory 풀명세 column (parentCategory/pillar/coverImageUrl/seoMeta/articleTypeDefault) 어드민 UI/공개 렌더.
708:- `EC-DEFER-07`: 4 entity status='review-queued' 전이 + ComplianceRecord pre-publish.
709:- `EC-DEFER-12` (cycle 1 ECP-10·11 정정): 4 entity 어드민 published 발행 — EC-DEFER-05 합류 시점.
714:  - § 1.1 인벤토리 25 contracts (+ C-24 Publication, C-25 MediaAppearance) · C-12 FAQ M0 ✅ · C-22 ArticleCategory M0 ✅ · C-24/25 row 추가.
715:  - § 4 C-10 `contentType` enum +2 (Publication, MediaAppearance) v0.6.
724:  - § 3 P-011 FAQ graph + P-002/P-004 graph 확장 (ScholarlyArticle/VideoObject 풀 entity).
726:- `EC-CASCADE-04`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2.1 SSR 재사용 표 — 신규 4 entity (article_category · publication · media_appearance · faq) Git output 변환 marker.
730:- `EC-CASCADE-08` (cycle 1 ECP-12 정정 — acceptance precondition 격상): `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ M0 ✅ + § 3 P-011 본문 작성 (질문 위계 + AEO 친화).
731:- `EC-CASCADE-09` (cycle 1 ECP-22 정정): `docs/admin/ARCHITECTURE.md` § 3 Slice 페이지 합계 = **11페이지** (기존 9 + P-010 1샘플 + P-011 FAQ). ArticleCategory 는 어드민 운영 routing 추가지만 공개 페이지 count 에는 포함 안 됨 (Article URL prefix 만 변경).
738:| 2026-05-18 | v0.4 | **Codex 비평 cycle 3 3 findings (0 blocking + 1 major + 2 minor) 전건 수용 patch — PAGE_TYPES 내부 SoT 통일 + DATA_MODEL 한 페이지 요약 cascade**: (ECP-31 major) PAGE_TYPES § 5 matrix + § 6 목록 + 합류 우선순위 — P-011 FAQ M0 ✅ 일관 (§ 5 matrix 행 patch · § 6 페이지 #10 추가 + 어드민 화면 수 6→7 · 우선순위 P-011 strike-through). (ECP-32 minor) DATA_MODEL § 0 한 페이지 요약 "23개 계약 (C-01~C-23)" → "25개 계약 (C-01~C-25)". (ECP-33 minor) DATA_MODEL § 관계 다이어그램 ComplianceRecord contentRef 대상 범위 "C-01~C-22" → "C-01~C-25" — C-24 Publication · C-25 MediaAppearance 포함. 누계 cycle 1+2+3 = 33 findings 전건 수용. closeableAfterPatch=true 신호 (다음 cycle 4 acceptance 신호 검증). |
739:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 8 findings (4 blocking + 4 major + 0 minor) 전건 수용 patch — docs cascade 실 patch 진입**: (ECP-23·24·25·26 blocking 4건 + ECP-27·28·29·30 major 4건) plan 본문 명시한 docs cascade 가 실 patch 안 됨 — plan acceptance commit 안 docs cascade 동시 적용 결정 (LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합). 본 patch 사이클에서 다음 실 적용: (1) DATA_MODEL § 1.1 인벤토리 23 → 25 contracts + C-24 Publication · C-25 MediaAppearance row 추가 + C-12 FAQ M0 ✅ + C-04 Article category required 명시. (2) DATA_MODEL § 4 C-10 contentType enum v0.6 — +Publication +MediaAppearance (17종). (3) DATA_MODEL § 4 C-22 ArticleCategory marker (DB 실 운영 합류 marker + EC-DEFER-10). (4) DATA_MODEL § 4 C-12 FAQ 풀명세 (question 10~200 · answer Markdown 50~2000 · v0.1 DB CHECK draft 만). (5) DATA_MODEL § 4 C-24 Publication 풀명세 (외부 학술 인용 · risk Low fixed). (6) DATA_MODEL § 4 C-25 MediaAppearance 풀명세 (모든 channel_type → VideoObject 단일화 v0.1). (7) PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 페이지 합계 11. (8) SCHEMA_MAPPING § 2 entity 카탈로그 — ScholarlyArticle 추가 · VideoObject MediaAppearance 매핑 추가 · FAQPage EAT v0.x M0 합류 + Answer.text helper marker. (9) CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 — Publication/MediaAppearance 면제 + FAQ Q/A 적용. (10) ARCH § 3.11 게이트 #1 — 11 페이지 + P-011 FAQ 합류. (11) M0_BUILD_EXPORT § 2.2 EAT 4 entity 변환 표. (12) PUBLIC_SITE_RENDER § 9.3 PSR-DEFER-11/15 해소 marker. (13) packages/migrations-runner/src/manifest.ts orderedMigrations 16 entry (C0009/10/11/12/13 + D0014). 코드 cascade (migrations 실 SQL · 어드민 폼 · Article detail SQL JOIN 등) 는 별도 EAT_CONTENT code v1.0 cycle. 누계 cycle 1+2 = 30 findings 전건 수용. |
740:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 22 findings (7 blocking + 10 major + 5 minor) 전건 수용 patch**: (ECP-01) C-24/25 Publication/MediaAppearance · C-12 FAQ 풀명세 합류 · C-22 ArticleCategory 실 운영 합류 — DATA_MODEL 인벤토리 25 contracts. (ECP-02) C-22 풀명세 컬럼 전체 DB 추가 (v0.1 UI minimal · EC-DEFER-10). (ECP-03) Article.category_id staged 4-step migration (ADD nullable + seed + backfill + SET NOT NULL). (ECP-04) manifest 16단계 + 각 dependsOn 명시. (ECP-05·14) MediaAppearance 모든 channel_type → VideoObject 단일화 · fragment `#video-{slug}` 단일 · BroadcastEvent/NewsArticle 분기는 EC-DEFER-11. (ECP-06) Doctor/About graph self-contained — Publication/Media 풀 entity 출력. cross-page allowlist 미사용. (ECP-07) C-10 contentType enum +Publication +MediaAppearance v0.6 cascade. FAQ 토큰 대문자 통일. (ECP-08) DOI regex DB·zod 동일 anchored. (ECP-09) default `general` ArticleCategory seed = seed.ts + C0013 마이그레이션 backfill. (ECP-10·11) v0.1 단계 4 entity 어드민 status='draft' 강제 — FAQ DB CHECK + zod enum subset. EC-DEFER-12 신설. (ECP-12) PAGE_TYPES P-011 M0 ✅ — EC-CASCADE-08 acceptance precondition 격상. (ECP-13) Publication/Media `@id` fragment-scoped (Doctor/About page URL + fragment). (ECP-15) About publication/media reference 는 MedicalClinic.subjectOf 단일 결정. (ECP-16) ArticleCategory taxonomy public 의도 명시 — status 게이트 없음 + EC-DEFER-10. (ECP-17) Article detail SQL JOIN article_category · category.slug 매칭 작업 명시. (ECP-18) `authors` DEFAULT 제거. (ECP-19) `renderMarkdownToPlainText` helper 신규 — JSON-LD Answer.text. (ECP-20) external link rel `nofollow noopener noreferrer` 통일. (ECP-21) FAQ 빈 페이지 200 + sitemap 포함 + lastmod fallback. (ECP-22) Slice 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ. |

 succeeded in 633ms:
 succeeded in 647ms:
# E-A-T Content 확장 plan (v0.4·draft·2026-05-18)

> **상태**: **v0.4 (draft)** — Codex 자동 비평 cycle 1 (22) + cycle 2 (8) + cycle 3 (3) 누계 **33 findings 전건 수용 patch**. PUBLIC_SITE_RENDER code v1.0 acceptance 직후 진입하는 첫 신규 콘텐츠 타입 plan. Lovable 사이트 (다이트한의원 부평점) 의 콘텐츠 종류 매핑에서 우리 명세에 누락된 부분 (논문·미디어·FAQ 풀명세 + ArticleCategory 실 운영) 을 Core 계약으로 확정한다.

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


codex
EAT 계획 본문에는 v0.4 변경 기록이 들어 있습니다. 이제 실제 cascade 대상인 `PAGE_TYPES.md`와 `DATA_MODEL.md`의 반영 여부를 대조합니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "P-011|FAQ|M0|어드민|admin|우선순위|합류|페이지|matrix|매트릭스" docs/core/PAGE_TYPES.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "23개 계약|25개 계약|C-01~C-22|C-01~C-25|ComplianceRecord|contentRef|C-24|C-25|인벤토리" docs/core/DATA_MODEL.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/core/PAGE_TYPES.md -TotalCount 260' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/core/DATA_MODEL.md -TotalCount 180' in C:\Users\assag\solution\website-exposure
 succeeded in 757ms:
1:# Core — 페이지 타입 표준
4:> **작성일**: 2026-05-14 (v0.7 → v0.8 — § 6 M0 표 P-013 비고 SoT 정합 / 잔존 버전 표기 정리)
7:> **목적**: 솔루션이 표준화하는 의료기관 웹사이트 페이지 타입을 단독 구현 가능한 수준으로 정의한다.
20:## 0. 한 페이지 요약
22:- 필수 14종 + 선택 7종 = **21종 페이지 타입**.
23:- M0 Slice: **10종 + Article 1샘플 = 11개 페이지** (P-001·P-002·P-003·P-004·P-005·P-006·P-011 FAQ·P-012·P-013·P-014 + P-010 1샘플) — EAT v0.x EC-CASCADE-08 patch (P-011 FAQ M0 합류).
24:- **P-014 LocationProfile(main)·P-013 LegalDocument는 어드민 화면 추가 없이 ClinicProfile 화면의 기관 정체성 + 본원 위치·연락·시간 입력 + Core 표준 템플릿으로 자동 생성** (SoT: 위치·시간·연락은 LocationProfile이 마스터). 단지점·다지점 통일 처리.
26:- P-106 Self-test는 **Feature-backed optional page** — 페이지 타입은 정의하되 Feature Module이 콘텐츠·로직을 제공.
30:## 1. 페이지 타입 분류
34:| ID | 페이지 타입 | URL 패턴 | 주 데이터 계약 | M0 |
46:| P-011 | FAQ | `/faq` | `FAQ[]` | ✅ (EAT v0.x EC-CASCADE-08) |
53:| ID | 페이지 타입 | URL 패턴 | 활성화 방식 | 비고 |
65:## 2. 공통 룰 (모든 페이지 타입 적용)
68:- H1은 페이지당 1개. 페이지의 주제·정체성.
69:- H2는 페이지 내 주요 섹션. 명사형 또는 질문형.
79:- 모든 페이지에 title·description·canonical·og:*·twitter:* 필요.
83:- Home 제외 모든 페이지에 JSON-LD BreadcrumbList 포함.
95:## 3. 필수 페이지 타입 상세
108:4. 최신 인사이트 (M0에서 P-009 미합류 시 P-010 샘플로 직접 링크)
118:**내부 링크 권장**: → About / Doctors List / Treatments List / Contact (P-009 미합류 시 Article 샘플 직접 링크)
212:**목적**: 개별 시술의 구조화 정보. AEO 핵심 페이지. 다이어트 한의원에는 가장 중요한 페이지.
215:**Schema 요약**: `MedicalProcedure` + BreadcrumbList + (FAQ 블록 시) `FAQPage`.
241:**선택 블록**: 프로그램 변형 / 소요 시간 / 시술 후 관리 / 유지 계획 / 근거 노트 / FAQ / 관련 의료진 / 관련 질환
243:**레이아웃 변형**: 단일 페이지 / 챕터 분할 / 비교형(프로그램 변형 시 권장)
259:| FAQ | 답변별 가변 | 효과·결과 답변 → High |
266:**내부 링크 권장**: → 담당 의료진 / 관련 질환 / 관련 시술 / FAQ
270:**목적**: 질환·증상 정보 페이지 진입로. 다이어트 한의원은 증상 기반 쿼리 비중 큼 (Phase Alpha 우선 합류 권장).
289:**Schema 요약**: `MedicalCondition` (signOrSymptom, riskFactor, possibleTreatment) + BreadcrumbList + (해당 시) FAQPage.
304:**선택 블록**: 진단 / FAQ / 관련 시술 / 관련 의료진
308:**내부 링크 권장**: → 관련 Treatments / 관련 Articles / FAQ
317:**정보 슬롯**: Article 카드(제목·요약·저자·발행일·읽기 시간·카테고리·콘텐츠 형식 배지) / 카테고리 필터·페이지네이션·검색
324:**내부 링크 권장**: → 각 Article Detail / 카테고리 페이지
333:**Schema 요약**: `Article` (headline, datePublished, dateModified, author=Physician/Person, publisher, mainEntityOfPage, articleSection, wordCount, inLanguage) + BreadcrumbList + (Q&A 블록 시) FAQPage + (video 시) VideoObject.
351:**선택 블록**: 임베디드 미디어 / 검수 정보 / 관련 글 / 관련 시술 / FAQ / CTA
371:### P-011. FAQ
375:**주 데이터 계약**: `FAQ[]`
376:**Schema 요약**: `FAQPage` (mainEntity = Question[]) + BreadcrumbList.
398:**목적**: 위치·진료시간·예약·상담 채널의 통합 전환 허브. 단순 안내 페이지가 아닌 **다중 CTA 채널 집결지**. M0 필수.
420:### P-013. Legal / Policy — **M0 출시 게이트** ⭐ v0.5 격상
422:**목적**: 개인정보처리방침·이용약관·비급여 진료 등 정책 페이지. **법적·규제 의무**. 폼·예약·분석 스크립트 운영 시 사실상 필수 (개인정보보호법·정통망법). M0 출시 게이트.
425:**Schema 요약**: 일반적으로 `WebPage`. 검색 노출 우선순위 낮음.
427:**M0 자동 생성 규칙** (v0.5 신규, v0.6 SoT 정정):
430:- **어드민 화면 추가 없음** — M0 어드민 화면 수 6개 유지. 운영자는 ClinicProfile 입력 시 정책 변수(개인정보 보호 책임자·시행일 등)만 추가 입력하거나, LegalDocument 파일을 Git에 수동 보강.
481:> 어드민 § 3.8.1의 매핑 표가 단일 진실 원본. 본 문서는 요약.
483:- 운영자가 어드민의 **ClinicProfile 화면 두 섹션**(기관 정체성 + 본원 위치·연락·시간)을 입력하면, 어드민이 두 파일을 동시 출력:
493:- **어드민 별도 LocationProfile 입력 화면 추가 불필요** (M0 어드민 화면 수 6개 유지).
496:**다지점 인스턴스의 처리**: `LocationProfile` N개. P-012 Contact는 통합 안내 + 각 P-014 페이지로 링크.
500:## 4. 선택 페이지 타입 상세
583:**Schema 요약**: `WebPage` 또는 `MedicalWebPage` + `FAQPage` 일부.
584:**활성화**: **Feature Module이 콘텐츠·로직 제공** — Self-test가 단순 정적 페이지가 아니라 동적 입력·결과 해석을 포함하므로 별도 Feature Module이 자연스러움. 후보 모듈명: `self-test-module` 또는 `compliance-assistant` 확장. (PT-12 해소 — Feature-backed 결정)
596:> **1호 클라이언트 적용 후보**: 다이어트 유형 체크, 요요 위험도 체크, 체질 기반 사전문진. **M0 외 — Phase Alpha~Beta 도입 검토**.
600:## 5. 페이지 타입 매트릭스 (전체 한눈에)
602:| ID | 이름 | URL | 주 데이터 계약 | 주 Schema | 위험도 기본 | High-risk | M0 |
614:| P-011 | FAQ | `/faq` | FAQ[] | FAQPage | 답변 가변 | | ✅ (EAT v0.x EC-CASCADE-08) |
627:## 6. Vertical Slice (M0) 페이지 타입 — 11개 페이지 (EAT v0.x EC-CASCADE-08: P-011 FAQ M0 합류)
629:| 순서 | 페이지 타입 | 비고 |
638:| 8 | P-014 Location Detail (main 자동) | 어드민 화면 추가 없이 자동 생성 (§ 3 P-014 규칙) |
639:| **9** | **P-013 Legal / Policy (자동 생성)** | Core 표준 템플릿 + ClinicProfile · LocationProfile(main) 변수 치환 자동 생성. 어드민 화면 추가 없음. **출시 게이트** (법무 검토 필수 — ComplianceRecord.legalCounsel/legalCounselAt required) |
640:| **10** | **P-011 FAQ (EAT v0.x EC-CASCADE-08 합류)** | FAQ[] · FAQPage JSON-LD · 어드민 폼 신규 (Faq) · 공개 페이지 `/<slug>/faq` |
643:**M0 어드민 화면 수: 7개 (EAT v0.x cascade)** — 대시보드 / ClinicProfile / DoctorProfile / TreatmentPage / Article / **Faq (EAT v0.x 신규)** / 미리보기·발행. P-012·P-014·P-013은 자동 생성.
645:**M0 미합류 합류 우선순위**:
647:2. ~~P-011 FAQ~~ ✅ M0 합류 (EAT v0.x)
652:## 7. 페이지 타입 추가·변경 정책
654:- 새 페이지 타입 추가 = Core MAJOR 변경. 데이터 계약·Schema·디자인 영향. `release/VERSIONING_POLICY.md` 적용.
655:- 선택 페이지 타입 채택 = Preset/Instance 결정.
656:- 업종 특화 페이지 = Preset 추가 정의 (예: 한의원의 "체질 분석").
665:| PT-02 | Category 페이지 별도 타입 | 콘텐츠 누적 후 |
666:| PT-03 | Search 페이지 별도 타입 | Phase Beta+ |
667:| PT-04 | ~~다지점 페이지 타입~~ | 해소 — P-014 |
668:| PT-05 | 한의원 특화 페이지 (체질 분석) | Preset 신설 시 |
669:| PT-06 | ~~정책 페이지 표준화~~ | 해소 — P-013 |
672:| PT-09 | FAQ 답변 단위 위험도 UI | admin |
675:| PT-12 | ~~P-106 Feature Module vs Core 페이지~~ | **v0.5 해소 — Feature-backed optional page로 결정** |
676:| PT-13 | High-risk commercial pages Add-on 정책 구체화 | compliance/admin |
677:| PT-14 | LocationProfile main 자동 생성 규칙의 어드민 구현 세부 | admin/ARCHITECTURE.md |
686:| 2026-05-13 | v0.2 | P-013 격상, P-105 신설, P-103 명칭 확장, 위험도 격상 조건표, M0 Contact 추가 |
688:| 2026-05-13 | v0.4 | DEEP_DIVE 통합 1단계 — 번호 체계 재정렬(P-014 Location 필수, P-106 Self-test), Contact Conversion Hub, High-risk 묶음, M0 8+1=9 |
689:| 2026-05-14 | v0.5 | **피드백 적용**: (1) **전체 본문 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, 단독 구현 명세화, (2) **P-014 LocationProfile main 자동 생성 규칙 명시** (어드민 화면 추가 없음), (3) **P-006 TreatmentPage 정보 슬롯에 treatmentComponents·recommendedFor·visitFlow·remoteCareAvailable·maintenancePlan·evidenceNotes 즉시 통합**, (4) **P-010 Article 정보 슬롯에 reviewedBy·contentSource·externalUrl 즉시 통합**, (5) **P-106 Self-test를 "Feature-backed optional page"로 표현 변경** (PT-12 해소), (6) PT-14 LocationProfile 자동 생성 규칙 어드민 구현 세부 신규, (7) **v0.5.1 추가 정정**: **P-013 Legal/Policy를 M0 출시 게이트로 격상** — Core 표준 템플릿 + ClinicProfile 변수 자동 치환 생성. M0 페이지 수 9 → **10**. 어드민 화면 수 6개 그대로 (자동 생성). 법무 검토 필수 (ComplianceRecord 추적) |
691:| 2026-05-14 | v0.7 | **피드백 정정**: (1) § 0 요약 SoT 정합 표현 정정 — "ClinicProfile 입력" → "ClinicProfile 화면의 기관 정체성 + 본원 위치·연락·시간 입력", (2) **§ 3 P-014 자동 생성 규칙 정합 갱신** — `reservationChannels = primaryCtas 상속` 및 `featuredChannelId` (선택, v0.6 신규) 흐름 명시. admin § 3.8.1과 동기화 |
692:| 2026-05-14 | v0.8 | **피드백 정정**: § 6 M0 표 P-013 비고를 SoT 정합으로 정정 — "v0.5 격상 — ClinicProfile 변수 치환" → "ClinicProfile · LocationProfile(main) 변수 치환, 출시 게이트, 법무 검토 필수". 잔존 버전 표기(§ 6 제목 "(v0.5 갱신)" 등) 제거 |

 succeeded in 737ms:
19:- **25개 계약 (C-01~C-25) + 3개 공통 타입 (CT-01~CT-03)** — v0.10 EC-CASCADE-01 patch (C-24 Publication · C-25 MediaAppearance 신규 — EAT_CONTENT_PLAN v0.x).
29:## 1. 계약 인벤토리
44:| C-10 | `ComplianceRecord` | 컴플라이언스 게이트 통과 기록 | L1/L3 | DB+Git | ✅ | 발행 |
58:| C-24 | `Publication` | 학술 논문 외부 인용 (E-A-T 전문성 시그널 — schema.org `ScholarlyArticle`) — EAT v0.x 신규 | L3 | DB+Git | ✅ | P-002 About, P-004 Doctor Profile inline |
59:| C-25 | `MediaAppearance` | 미디어 출연 (방송·유튜브·팟캐스트·언론 — schema.org `VideoObject`) — EAT v0.x 신규 | L3 | DB+Git | ✅ | P-002 About, P-004 Doctor Profile inline |
761:### C-10. `ComplianceRecord` — 컴플라이언스 게이트 통과 기록
771:| `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature, Publication, MediaAppearance}` (v0.6+, 17종) | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1). **(v0.6 + EC-CASCADE-01 patch)** `Publication`, `MediaAppearance` 추가 — EAT_CONTENT_PLAN v0.x 의 학술 인용 · 미디어 출연 E-A-T entity. ComplianceRecord 발행 게이트 통과 기록 대상 (Publication/MediaAppearance 는 외부 인용 → CONTENT_STANDARDS § 7.1.1.x 면제 + risk_level Low fixed) |
773:| `contentRef` | `string` | ✅ | 대상 콘텐츠 `@id` |
795:| `recordVersion` | `integer` (1~) | ✅ | (v0.8 +) 동일 contentRef의 record 버전 — 재검수 사이클 후 새 record 생성 시 1 증가. 발행 history 추적 (`admin/REVIEW_WORKFLOW.md` § 5.4) |
815:> `mediaThresholdAssessment`는 운영 측정값(`features/analytics-reporting.md` § 14.5 DailyUserMeasurement)과 별개로 ComplianceRecord에 **확정 판정**을 기록. 운영 측정은 매일 갱신되지만 본 슬롯은 발행 시점·법무 판정 시점에 snapshot으로 고정.
848:**목적**: 개인정보처리방침·이용약관·비급여 진료 안내 등 법적 정책 문서. **M0 출시 게이트**. Core 표준 템플릿 + ClinicProfile + LocationProfile(main) 변수 자동 치환으로 생성. 법무 검토 필수 (ComplianceRecord.legalCounsel/legalCounselAt required).
877:- 발행 시 `ComplianceRecord(contentType=LegalDocument, legalCounsel=*, legalCounselAt=*)` 필수 — 위험도 Low 예외 게이트 (§ 4 C-10 참조).
932:### C-24. `Publication` — 학술 논문 외부 인용 (E-A-T 전문성 시그널 · EAT v0.x 신규)
934:> **EAT_CONTENT_PLAN v0.x 신규 (C-24)** — 외부 학술 자료 인용 (clinic 자체 publisher 아님). schema.org `ScholarlyArticle` 매핑. Doctor Profile (P-004) · About (P-002) page 안 fragment-scoped inline 출력 v0.1 (별도 페이지 EC-DEFER-02).
961:### C-25. `MediaAppearance` — 미디어 출연 (E-A-T 권위성 시그널 · EAT v0.x 신규)
963:> **EAT_CONTENT_PLAN v0.x 신규 (C-25)** — clinic doctor 의 미디어 출연 (방송·유튜브·팟캐스트·언론). schema.org `VideoObject` 매핑 v0.1 — 모든 channel_type 단일화. BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1).
1121:ComplianceRecord (C-10)
1122:   ├─ contentRef → 발행 콘텐츠 (C-01~C-25 · EAT v0.x C-24 Publication · C-25 MediaAppearance 포함)
1141:| DM-04 | `ComplianceRecord` 첨부 저장소 | A-02 |
1168:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
1169:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
1186:| 2026-05-14 | v0.14 | **`features/analytics-reporting.md` 1차 사이클 cascade**: (1) **C-08 `analyticsConfig` 신설** — `AnalyticsConfig`(sources.gsc·naverSearchAdvisor·ga4·rum 자격증명·사이트 식별자만, 동작 옵션은 `features.analytics-reporting.config`로 분리), (2) **C-10 `mediaThresholdAssessment` 슬롯** — `MediaThresholdAssessment` 신설(assessmentBasisDate·windowStart/End·rollingAverageDailyUsers·thresholdReached·primarySource·sourceCompleteness·timezone·calendarPolicy·botFilteringPolicy·legalBasisNote). priorReviewRequired 산정 근거. ComplianceRecord 발행 시 snapshot으로 고정 |
1187:| 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `AdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`eligibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·digestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IANATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |

 succeeded in 755ms:
# Core — 데이터 계약 명세

> **상태**: Draft v0.24
> **작성일**: 2026-05-15 (v0.24 — Spike 결정 SPIKE2-03 cascade: C-23 AdminUser.instanceMemberships에 `active`·`deactivatedAt`·`deactivatedBy` 필드 추가. resolveTenantContext 매 요청 검증 강제)
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 2.4, § 7
> **연관 문서**:
> - 페이지 타입 → `core/PAGE_TYPES.md`
> - Schema 매핑 → `core/SCHEMA_MAPPING.md`
> - 위험도 → `compliance/RISK_LEVELS.md`
> - 디자인 토큰 → `core/DESIGN_TOKENS.md`
> - 어드민 데이터 모델 → `admin/DATA_MODEL.md`
> - 레퍼런스 분석 → `research/REFERENCE_ANALYSIS_2026-05.md`, `research/REFERENCE_DEEP_DIVE_2026-05.md`

---

## 0. 한 페이지 요약

- **25개 계약 (C-01~C-25) + 3개 공통 타입 (CT-01~CT-03)** — v0.10 EC-CASCADE-01 patch (C-24 Publication · C-25 MediaAppearance 신규 — EAT_CONTENT_PLAN v0.x).
- v0.13: `features/notifications.md` cascade — C-08 확장(`adminBaseUrl`·`timezone`·`NotificationChannelsConfig`) + **C-23 `AdminUser` 신설** (어드민 사용자·자격·알림 선호 SoT).
- 모든 계약은 공통 메타필드(`@id`, `@createdAt`, `@updatedAt`).
- 빌드 입력 계약(Git 원본)과 운영 메타 계약(어드민 DB 원본) 구분.
- **SoT 원칙**: `ClinicProfile`은 브랜드·기관 정체성·메타 통계만, **위치·전화·시간은 `LocationProfile`이 마스터**.
- **RiskLevel은 enum 직접 사용** (`Ref<C-05>` 표기 제거).
- v0.4: TreatmentPage·Article 컨텍스트 필드 즉시 통합 (1호 다이어트 한의원 직결).

---

## 1. 계약 인벤토리

### 1.1 데이터 계약 (25개) — EC-CASCADE-01 patch (v0.10·EAT_CONTENT_PLAN v0.x acceptance commit)

| ID | 계약 이름 | 책임 | 소속 | 마스터 | M0 | 관련 페이지 타입 |
|---|---|---|:---:|:---:|:---:|---|
| C-01 | `ClinicProfile` | 의료기관 정체성 (브랜드·메타) | L3 | Git | ✅ | P-001, P-002 |
| C-02 | `DoctorProfile` | 의료진 권위·전문성 | L3 | Git | ✅ | P-003, P-004 |
| C-03 | `TreatmentPage` | 시술·치료 구조화 콘텐츠 | L3 | Git | ✅ | P-005, P-006 |
| C-04 | `Article` | 인사이트·블로그 글 (category Ref<C-22> required) | L3 | Git | ✅ | P-009, P-010 |
| C-05 | `RiskLevel` | 위험도 등급 (enum) | L1/L3 | Git+DB | ✅ | 전체 |
| C-06 | `PageMeta` | 페이지별 메타 데이터 | L1/L3 | Git | ✅ | 전체 |
| C-07 | `BrandTokens` | 디자인 토큰 최종값 | L3 | Git | ✅ | UI |
| C-08 | `InstanceManifest` | 버전 고정 명세 | L3 | Git | ✅ | 빌드 |
| C-09 | `FeatureModuleConfig` | Feature Module 설정 | L3 | Git | ✅ | 모듈 |
| C-10 | `ComplianceRecord` | 컴플라이언스 게이트 통과 기록 | L1/L3 | DB+Git | ✅ | 발행 |
| C-11 | `MedicalConditionPage` | 증상·질환 정보 | L3 | Git | | P-007, P-008 |
| C-12 | `FAQ` | 질문-답변 묶음 (EAT v0.x 풀명세 합류 — § 4 C-12 본문 참조) | L3 | Git | ✅ | P-011 |
| C-13 | `ReviewPolicy` | 후기 노출 정책 | L2+L3 | Git | | P-101 |
| C-14 | `MedicalSpecialty` | 의료 전문 분야 | L2 | Git | | C-01,02 참조 |
| C-15 | `SchemaInput` | JSON-LD 생성기 입력 | L1/L3 | 런타임 | ✅ | 전체 |
| C-16 | `LegalDocument` | 정책·약관 (Core 표준 템플릿 + 변수 자동 치환) | L3 | Git | ✅ (auto) | P-013 |
| C-17 | `PricingPage` | 가격 안내 | L3 | Git | | P-102 |
| C-18 | `FacilitiesPage` | 시설·장비 | L3 | Git | | P-103 |
| C-19 | `NewsItem` | 소식·이벤트 | L3 | Git | | P-104 |
| C-20 | `ReservationPage` | 예약 안내 | L3 | Git | | P-105 |
| C-21 | `LocationProfile` | 지점 정체성 (위치·시간·연락 마스터) | L3 | Git | ✅ | P-012, P-014 |
| C-22 | `ArticleCategory` | Article Pillar/Category 정의 (EAT v0.x DB 실 운영 합류 — v0.1 어드민 UI minimal · parentCategory/pillar/coverImageUrl/seoMeta/articleTypeDefault 컬럼은 DB nullable + EC-DEFER-10) | L2+L3 | Git+DB | ✅ | P-009, P-010 |
| C-23 | `AdminUser` | 어드민 사용자 (권한·자격·알림 선호 SoT) | L3 | DB | ✅ (admin) | 어드민 전용 |
| C-24 | `Publication` | 학술 논문 외부 인용 (E-A-T 전문성 시그널 — schema.org `ScholarlyArticle`) — EAT v0.x 신규 | L3 | DB+Git | ✅ | P-002 About, P-004 Doctor Profile inline |
| C-25 | `MediaAppearance` | 미디어 출연 (방송·유튜브·팟캐스트·언론 — schema.org `VideoObject`) — EAT v0.x 신규 | L3 | DB+Git | ✅ | P-002 About, P-004 Doctor Profile inline |

### 1.2 공통 타입 (CT — Cross-cutting Type, 3개)

| ID | 공통 타입 | 책임 | 소속 | 사용처 |
|---|---|---|:---:|---|
| CT-01 | `TrustMetric` | 신뢰도·통계 지표 (기준·증빙 포함) | L1 정의 / L3 값 | ClinicProfile, LocationProfile, DoctorProfile |
| CT-02 | `BusinessHours` | 진료시간·접수시간·점심·휴진 | L1 정의 / L3 값 | LocationProfile |
| CT-03 | `CTAConfig` | 전환 채널 설정 | L1 정의 / L3 값 | ClinicProfile, LocationProfile, TreatmentPage |

---

## 2. 공통 룰

### 2.1 타입 표기법

| 표기 | 의미 |
|---|---|
| `string`/`number`/`boolean` | 기본 |
| `Date` | ISO 8601 |
| `URL`/`Email`/`Phone`/`Slug` | 형식 제한 문자열 |
| `Markdown` | Markdown 본문 |
| `T[]` | 배열 |
| `T \| U` | 합 타입 |
| `enum {A, B, C}` | 열거형 |
| `Ref<C-NN>` | 다른 계약의 `@id` 참조 |
| `?` (필드 뒤) | optional |

### 2.2 공통 메타 필드 (모든 계약)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 인스턴스 내 고유 식별자 |
| `@createdAt` | `Date` | ✅ | 최초 생성 시각 |
| `@updatedAt` | `Date` | ✅ | 최종 수정 시각 |
| `@version` | `number` | optional | 계약 스키마 버전 |
| `@provenanceAssetId` | `string` | optional | (v0.18 +) `features/asset-ingestion.md`이 생성한 경우 source IngestedAsset id. 어드민 manual hand-off 시에도 어드민 UI가 보존 (AI4-11). asset-ingestion이 자동 promote한 경우는 AssetPromotionRecord.targetContentRef와 cross-link |

### 2.3 식별자(`@id`) 규약
- 인스턴스 내 유일, slug 형식, 3~64자.
- 변경 시 URL 변경 → 301 리다이렉트 매핑 필요 (어드민 책임 — DM-01).

### 2.4 다국어
- M0 한국어 기본. 다국어 시 필드 단위 객체 `{ko, en, ...}` 확장.

### 2.5 SoT 원칙 (v0.4 명시)
- **ClinicProfile**: 브랜드·기관 정체성·메타 통계만 보관 (`name`, `description`, `founderStory`, `awards`, `trustMetrics`, `medicalSpecialty`, `affiliatedInstitutes`, `mediaCoverage`, `socialMedia`, `internationalSupport`, `socialContribution`, `primaryCtas`, `logoUrl`, `ogImageUrl`).
- **LocationProfile**: 위치·전화·이메일·진료시간·예약 채널의 **마스터**. 단지점 인스턴스도 `LocationProfile(slug=main)` 1개 필수.
- ClinicProfile에 `mainAddress`/`mainTelephone`/`mainEmail`/`businessHours` 같은 필드 **없음**. 모든 위치·시간 정보는 LocationProfile 참조.

### 2.6 변경 정책

| 변경 종류 | 분류 |
|---|---|
| optional 필드 추가 | MINOR |
| required 필드 추가 | **MAJOR** |
| 필드 타입 변경 (호환) | MINOR |
| 필드 타입 변경 (비호환) | **MAJOR** |
| 필드 제거 | **MAJOR** |
| validation 강화 | 케이스별 |
| validation 완화 | PATCH |
| enum 값 추가 | MINOR |
| enum 값 제거 | **MAJOR** |
| 기본값 변경 | 케이스별 |

> 상위 `release/VERSIONING_POLICY.md` 참조.

---

## 3. 공통 타입 풀명세

### CT-01. `TrustMetric` — 신뢰도·통계 지표

**목적**: 누적 환자 수·처방 수·논문 수·임상 데이터 등 **모든 수치 주장을 표준화**. 기준 기간·범위·증빙을 의무 또는 권장.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 지표 식별자 |
| `label` | `string` | ✅ | 표시 라벨 (예: "누적 진료 환자") |
| `value` | `number \| string` | ✅ | 값 |
| `unit` | `string` | optional | 단위 ("명", "건", "년", "%") |
| `measuredFrom` | `Date` | optional | 측정 시작일 |
| `measuredTo` | `Date` | optional | 측정 종료일 |
| `scope` | `enum {clinic, branch, network, doctor}` | ✅ | 측정 범위 |
| `evidenceUrl` | `URL` | optional | 외부 검증 링크 |
| `evidenceNote` | `string` | optional | 증빙 설명 |
| `displayRiskLevel` | `RiskLevel` | optional | 노출 시 위험도 등급 |
| `displayFormat` | `string` | optional | 노출 형식 템플릿 |

**컴플라이언스 룰**:
- `value`만 있고 `measuredFrom`·`scope`·`evidenceUrl/Note` 모두 없으면 **빌드 시 경고**.
- 단정형·과시형 라벨 ("국내 1위", "최대 누적") 시 자동 Medium 격상, 외부 검증 불일치 시 High 검토.
- 사실 안내형 표현 권장 ("누적 N명을 진료해왔습니다").

### CT-02. `BusinessHours` — 진료시간·접수시간·휴진

**목적**: 진료시간만으로 부족한 한국 의료기관의 실제 운영 패턴 반영.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `openingHours` | `OpeningHoursSpec[]` | ✅ | 진료 가능 시간 |
| `receptionHours` | `OpeningHoursSpec[]` | optional | 접수 마감 시간 (초진·재진 다를 수 있음) |
| `lunchBreaks` | `LunchBreak[]` | optional | 점심시간 |
| `holidayPolicy` | `Markdown` | optional | 설·추석·공휴일 운영 |
| `specialClosures` | `SpecialClosure[]` | optional | 특정일 휴진 |
| `emergencyOrAfterHoursNote` | `Markdown` | optional | 야간·응급·콜센터 안내 |

**하위 타입**:

#### `OpeningHoursSpec`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `dayOfWeek` | `enum {Mon, Tue, Wed, Thu, Fri, Sat, Sun, PublicHoliday}[]` | ✅ | 요일 |
| `opens` | `string` | ✅ | `"HH:mm"` |
| `closes` | `string` | ✅ | `"HH:mm"` |
| `appliesTo` | `enum {general, firstVisit, returnVisit}` | optional | 대상 (기본 general) |
| `note` | `string` | optional | |

#### `LunchBreak`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `dayOfWeek` | `enum {Mon~Sun, PublicHoliday}[]` | ✅ | |

 succeeded in 763ms:
# Core — 페이지 타입 표준

> **상태**: Draft v0.8
> **작성일**: 2026-05-14 (v0.7 → v0.8 — § 6 M0 표 P-013 비고 SoT 정합 / 잔존 버전 표기 정리)
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 7
> **목적**: 솔루션이 표준화하는 의료기관 웹사이트 페이지 타입을 단독 구현 가능한 수준으로 정의한다.
> **외부 공유 시 주의**: 표현 리스크 어휘 회피.
> **연관 문서**:
> - 데이터 계약·공통 타입 → `core/DATA_MODEL.md`
> - JSON-LD Schema graph → `core/SCHEMA_MAPPING.md`
> - 메타 태그 → `core/SEARCH_STANDARDIZATION.md`
> - 콘텐츠 작성 표준 → `core/CONTENT_STANDARDS.md`
> - 디자인 토큰 → `core/DESIGN_TOKENS.md`
> - 위험도 등급 → `compliance/RISK_LEVELS.md`
> - 레퍼런스 분석 → `research/REFERENCE_ANALYSIS_2026-05.md`, `research/REFERENCE_DEEP_DIVE_2026-05.md`

---

## 0. 한 페이지 요약

- 필수 14종 + 선택 7종 = **21종 페이지 타입**.
- M0 Slice: **10종 + Article 1샘플 = 11개 페이지** (P-001·P-002·P-003·P-004·P-005·P-006·P-011 FAQ·P-012·P-013·P-014 + P-010 1샘플) — EAT v0.x EC-CASCADE-08 patch (P-011 FAQ M0 합류).
- **P-014 LocationProfile(main)·P-013 LegalDocument는 어드민 화면 추가 없이 ClinicProfile 화면의 기관 정체성 + 본원 위치·연락·시간 입력 + Core 표준 템플릿으로 자동 생성** (SoT: 위치·시간·연락은 LocationProfile이 마스터). 단지점·다지점 통일 처리.
- High-risk commercial pages (P-101 Reviews · P-102 Pricing · P-104 News/Event 이벤트)는 Add-on 정책 기반 활성화.
- P-106 Self-test는 **Feature-backed optional page** — 페이지 타입은 정의하되 Feature Module이 콘텐츠·로직을 제공.

---

## 1. 페이지 타입 분류

### 1.1 필수 타입 (Core 표준 14종)

| ID | 페이지 타입 | URL 패턴 | 주 데이터 계약 | M0 |
|---|---|---|---|:---:|
| P-001 | Home | `/` | `ClinicProfile` (요약) | ✅ |
| P-002 | About | `/about` | `ClinicProfile` (전체) | ✅ |
| P-003 | Doctors List | `/doctors` | `DoctorProfile[]` | ✅ |
| P-004 | Doctor Profile | `/doctors/{slug}` | `DoctorProfile` | ✅ |
| P-005 | Treatments List | `/treatments` | `TreatmentPage[]` | ✅ |
| P-006 | Treatment Detail | `/treatments/{slug}` | `TreatmentPage` | ✅ |
| P-007 | Conditions List | `/conditions` | `MedicalConditionPage[]` | |
| P-008 | Condition Detail | `/conditions/{slug}` | `MedicalConditionPage` | |
| P-009 | Articles List | `/insights` 또는 `/blog` | `Article[]` | |
| P-010 | Article Detail | `/insights/{cat}/{slug}` | `Article` | ✅ (1샘플) |
| P-011 | FAQ | `/faq` | `FAQ[]` | ✅ (EAT v0.x EC-CASCADE-08) |
| P-012 | Contact / Visit (Conversion Hub) | `/contact` | `ClinicProfile` + `LocationProfile[]` | ✅ |
| P-013 | Legal / Policy | `/privacy`, `/terms` 등 | `LegalDocument` | ✅ (자동 생성) |
| P-014 | Location / Branch Detail | `/locations/{slug}` | `LocationProfile` | ✅ (main 자동) |

### 1.2 선택 타입 (7종)

| ID | 페이지 타입 | URL 패턴 | 활성화 방식 | 비고 |
|---|---|---|---|---|
| P-101 | Reviews (후기) | `/reviews` | Add-on + ReviewPolicy | **High-risk commercial** |
| P-102 | Pricing (가격 안내) | `/pricing` | Add-on | **High-risk commercial** |
| P-103 | Facilities / Equipment | `/facilities` | Instance 결정 | 시설 신뢰도 |
| P-104 | News / Event | `/news` | Instance 결정 (이벤트 카테고리는 Add-on) | 이벤트 카테고리 High-risk |
| P-105 | Reservation | `/reservation` | Instance 결정 (Contact 통합 가능) | 전환 추적 단위 |
| P-106 | Self-test / Quiz | `/self-test/{slug}` | **Feature Module(`compliance-assistant` 또는 신규 `self-test-module`)이 콘텐츠·로직 제공** | Feature-backed optional page |
| P-107 | (예약됨) | | | 미래 확장용 |

---

## 2. 공통 룰 (모든 페이지 타입 적용)

### 2.1 헤딩 위계
- H1은 페이지당 1개. 페이지의 주제·정체성.
- H2는 페이지 내 주요 섹션. 명사형 또는 질문형.
- H3은 H2 하위 세부 단위.
- H4 이하 자제 (AI 스니펫 추출 난이도 ↑).

### 2.2 시맨틱 마크업
- `<header>` / `<main>` / `<article>` / `<section>` / `<nav>` / `<footer>` 의미적 사용.
- 콘텐츠 본문은 `<article>`. 보조 섹션은 `<aside>` 또는 `<section>`.
- BreadcrumbList는 `<nav aria-label="breadcrumb">`.

### 2.3 메타 태그·robots·sitemap·canonical
- 모든 페이지에 title·description·canonical·og:*·twitter:* 필요.
- 상세는 `core/SEARCH_STANDARDIZATION.md`.

### 2.4 BreadcrumbList
- Home 제외 모든 페이지에 JSON-LD BreadcrumbList 포함.

### 2.5 내부 링크 원칙
- 의미 있는 anchor text. 콘텐츠 클러스터.

### 2.6 AEO·AI 스니펫 친화
- 핵심 답변 문단 시작 1~2문장.
- Q&A 블록·리스트·표 의도적 혼합.
- H2 질문형 권장.

---

## 3. 필수 페이지 타입 상세

### P-001. Home

**목적**: 의료기관 정체성·전문 영역·핵심 가치 제안을 첫 시각에 전달.
**URL**: `/`
**주 데이터 계약**: `ClinicProfile` (요약 필드)
**Schema 요약**: `Organization` + `MedicalClinic` + `WebSite` (SearchAction). BreadcrumbList 미적용.

**정보 슬롯**:
1. 히어로 — 기관명·전문 분야·핵심 가치
2. 주요 시술·진료 영역 요약
3. 의료진 요약
4. 최신 인사이트 (M0에서 P-009 미합류 시 P-010 샘플로 직접 링크)
5. 위치·진료시간·연락처 요약 (`LocationProfile` main 참조)
6. (선택) 인증·수상·미디어 노출

**헤딩 위계**: H1 핵심 메시지 / H2 "진료 영역", "의료진 소개", "최근 인사이트", "방문 안내"
**필수 블록**: 히어로 / 시술 요약 / 의료진 요약 / 연락 요약
**선택 블록**: 최신 글 / 인증·미디어 / 후기 요약 (위험도 High)
**레이아웃 변형**: 히어로(풀블리드/분할/미니멀), 시술 요약(카드 그리드/가로 스크롤/리스트)
**위험도 기본값**: Low
**컴플라이언스 주의**: 후기 요약 노출 시 `ReviewPolicy` 준수.
**내부 링크 권장**: → About / Doctors List / Treatments List / Contact (P-009 미합류 시 Article 샘플 직접 링크)

### P-002. About (병원 소개)

**목적**: 의료기관 정체성·연혁·철학·시설·인증·연구·미디어를 상세히 노출. AI 사이트 브리핑의 핵심 원천.
**URL**: `/about`
**주 데이터 계약**: `ClinicProfile` (전체)
**Schema 요약**: `Organization` + `MedicalClinic` (with founder, foundingDate, award, member) + BreadcrumbList.

**정보 슬롯**:
1. 정식 명칭·영문명·법인명
2. 슬로건·핵심 가치
3. 설립일·연혁 타임라인
4. 진료 철학·차별점
5. 대표/원장 인사말·스토리 (`founderStory`)
6. 위치 — `LocationProfile` main 참조 (지도)
7. 사업자등록번호·통신판매업 신고번호
8. 인증·수상 (Award 단위 풍부)
9. 소속 학회·연구 협력
10. 연구·논문·특허 (`TrustMetric[]` 노출)
11. 미디어 노출·언론보도
12. 팀 요약 (Doctors List 진입)
13. (선택) 사회공헌·후원

**헤딩 위계**: H1 "{ClinicName} 소개" / H2 "연혁", "진료 철학", "대표 인사말", "인증·수상", "소속·연구", "미디어", "사회공헌"
**필수 블록**: 연혁 / 진료 철학 / 위치 / 인증·소속
**선택 블록**: 인사말 / 미디어 / 연구·논문 / 사회공헌 / 시설 사진
**레이아웃 변형**: 연혁(타임라인/리스트/텍스트), 인증(배지 그리드/카드/리스트)
**위험도 기본값**: Low
**컴플라이언스 주의**: 최상급·효과 단정 금지. 인증·수상·연구는 사실·증빙 가능한 것만. `TrustMetric`은 사실 안내형 표현.
**내부 링크 권장**: → Doctors List / Treatments List / Contact / Articles

### P-003. Doctors List

**목적**: 의료진 전체 목록 + 프로필 상세 진입.
**URL**: `/doctors`
**주 데이터 계약**: `DoctorProfile[]`
**Schema 요약**: BreadcrumbList + ItemList.

**정보 슬롯**: 의료진 카드(이름·진료분야·간략 약력·사진) / 진료분야 필터·그룹(선택)
**헤딩 위계**: H1 "의료진 소개" / H2 진료분야 그룹명(있을 시)
**필수 블록**: 의료진 카드 그리드
**선택 블록**: 분야 필터 / 대표 의료진 인사말
**레이아웃 변형**: 카드 그리드 / 매거진 리스트 / 인터랙티브
**위험도 기본값**: Low
**컴플라이언스 주의**: 자격·학회·논문은 검증 가능한 범위.
**내부 링크 권장**: → 각 Doctor Profile / Treatments List

### P-004. Doctor Profile

**목적**: 개별 의료진 권위·전문성·E-E-A-T 노출. 저자 프로필.
**URL**: `/doctors/{slug}`
**주 데이터 계약**: `DoctorProfile`
**Schema 요약**: `Physician` (with medicalSpecialty, affiliation, alumniOf) + BreadcrumbList.

**정보 슬롯**:
1. 이름·직책·진료 분야·사진
2. 자격·면허
3. 학력·전공
4. 소속·경력
5. 학회·연구
6. 개인 스토리 (`personalStory`)
7. 논문·기고
8. 미디어 노출
9. 진료 철학·인사말
10. 작성한 인사이트 (Articles 백링크)
11. 예약·문의 CTA (해당 시)

**헤딩 위계**: H1 "{Doctor Name} {직책}" / H2 "자격", "경력", "스토리", "학회·연구", "논문", "미디어", "인사이트"
**필수 블록**: 자격 / 경력 / 진료 분야
**선택 블록**: 개인 스토리 / 논문 / 미디어 / 작성한 글 / 인사말
**레이아웃 변형**: 좌사진·우본문 / 풀폭 헤더+본문 / 매거진형
**위험도 기본값**: Low
**컴플라이언스 주의**: 검증 가능한 자격·논문. 최상급 표현 금지. 개인 스토리에 효과 단정 금지.
**내부 링크 권장**: → Doctors List / Treatments (분야 일치) / 작성한 Articles

### P-005. Treatments List

**목적**: 시술·진료 영역 전체 노출.
**URL**: `/treatments`
**주 데이터 계약**: `TreatmentPage[]`
**Schema 요약**: BreadcrumbList + ItemList.

**정보 슬롯**: 시술 카드(이름·간략 설명·대상) / 진료 분야 그룹(선택)
**헤딩 위계**: H1 "진료 안내" / H2 분야 그룹명
**필수 블록**: 시술 카드 그리드
**선택 블록**: 분야 필터
**레이아웃 변형**: 카드 / 탭 / 아코디언 / 풀스크린 스크롤
**위험도 기본값**: Low
**컴플라이언스 주의**: 시술명·간략 설명에 효과 단정·최상급 금지.
**내부 링크 권장**: → 각 Treatment Detail / Conditions

### P-006. Treatment Detail

**목적**: 개별 시술의 구조화 정보. AEO 핵심 페이지. 다이어트 한의원에는 가장 중요한 페이지.
**URL**: `/treatments/{slug}`
**주 데이터 계약**: `TreatmentPage`
**Schema 요약**: `MedicalProcedure` + BreadcrumbList + (FAQ 블록 시) `FAQPage`.

**정보 슬롯**:
1. 시술명·요약 (1~2문장 핵심 답변)
2. 개요 (정의·목적)
3. 원리 (어떻게 작동)
4. 대상 (`recommendedFor[]` — 누구에게 적합) ⭐
5. **구성 요소** (`treatmentComponents[]`) — 한약·약침·고주파·체성분 검사·식단 관리 등 ⭐
6. **방문 흐름** (`visitFlow[]`) — 검사 → 상담 → 처방 → 관리 ⭐
7. 과정 (단계별)
8. **프로그램 변형** (`programVariants[]`) — 1개월/3개월/유지 등 ⭐
9. 소요 시간·횟수
10. **비대면 진료 가능 여부** (`remoteCareAvailable`) ⭐
11. 주의사항·금기증
12. 시술 후 관리
13. **유지·요요 방지 계획** (`maintenancePlan`) ⭐
14. **근거·논문 노트** (`evidenceNotes[]`) — 외부 검증 가능 자료 ⭐
15. 자주 묻는 질문
16. 담당 의료진 (백링크)
17. 관련 질환 (백링크)
18. 예약·문의 CTA

> ⭐ = v0.5 신규 슬롯 (DATA_MODEL v0.4 TreatmentPage 신규 필드 연동)

**헤딩 위계**: H1 시술명 / H2 "개요", "원리", "대상", "구성", "과정", "프로그램 안내", "주의사항", "시술 후 관리", "유지·관리", "자주 묻는 질문", "관련 의료진"
**필수 블록**: 개요 / 원리 / 대상 / 구성 / 과정 / 주의사항
**선택 블록**: 프로그램 변형 / 소요 시간 / 시술 후 관리 / 유지 계획 / 근거 노트 / FAQ / 관련 의료진 / 관련 질환

**레이아웃 변형**: 단일 페이지 / 챕터 분할 / 비교형(프로그램 변형 시 권장)

**위험도 기본값**: **Medium**

**슬롯별 위험도 격상 조건**:

| 슬롯 | 기본 | 격상 조건 |
|---|---|---|
| 개요·원리·과정·주의사항 | Medium | — |
| 대상 (`recommendedFor`) | Medium | "이런 분은 꼭 필요" 권유형 → High |
| 구성 (`treatmentComponents`) | Medium | 구성별 효과 단정 → High |
| 방문 흐름 (`visitFlow`) | Medium | — |
| 프로그램 변형 (`programVariants`) | Medium | 가격·기간·횟수 약속 결합 → High |
| 소요·횟수 | Medium | 감량 수치·기간 약속 → High |
| 유지 계획 (`maintenancePlan`) | Medium | "100% 요요 방지" 등 → High |
| 근거 노트 (`evidenceNotes`) | Low | 인용·링크는 사실 안내. 단 효과 단정 결합 시 → High |
| FAQ | 답변별 가변 | 효과·결과 답변 → High |
| 후기·전후사진 (포함 시) | — | **자동 High** |

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "6개 유지|7개|어드민 화면 수|FAQ|P-011" docs/core/PAGE_TYPES.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/core/PAGE_TYPES.md | Select-Object -Skip 415 -First 90' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "6개 유지|어드민 화면 수|7개|P-011 FAQ|EAT v0.x" docs -g "*.md"' in C:\Users\assag\solution\website-exposure
 succeeded in 705ms:
23:- M0 Slice: **10종 + Article 1샘플 = 11개 페이지** (P-001·P-002·P-003·P-004·P-005·P-006·P-011 FAQ·P-012·P-013·P-014 + P-010 1샘플) — EAT v0.x EC-CASCADE-08 patch (P-011 FAQ M0 합류).
46:| P-011 | FAQ | `/faq` | `FAQ[]` | ✅ (EAT v0.x EC-CASCADE-08) |
215:**Schema 요약**: `MedicalProcedure` + BreadcrumbList + (FAQ 블록 시) `FAQPage`.
241:**선택 블록**: 프로그램 변형 / 소요 시간 / 시술 후 관리 / 유지 계획 / 근거 노트 / FAQ / 관련 의료진 / 관련 질환
259:| FAQ | 답변별 가변 | 효과·결과 답변 → High |
266:**내부 링크 권장**: → 담당 의료진 / 관련 질환 / 관련 시술 / FAQ
289:**Schema 요약**: `MedicalCondition` (signOrSymptom, riskFactor, possibleTreatment) + BreadcrumbList + (해당 시) FAQPage.
304:**선택 블록**: 진단 / FAQ / 관련 시술 / 관련 의료진
308:**내부 링크 권장**: → 관련 Treatments / 관련 Articles / FAQ
333:**Schema 요약**: `Article` (headline, datePublished, dateModified, author=Physician/Person, publisher, mainEntityOfPage, articleSection, wordCount, inLanguage) + BreadcrumbList + (Q&A 블록 시) FAQPage + (video 시) VideoObject.
351:**선택 블록**: 임베디드 미디어 / 검수 정보 / 관련 글 / 관련 시술 / FAQ / CTA
371:### P-011. FAQ
375:**주 데이터 계약**: `FAQ[]`
376:**Schema 요약**: `FAQPage` (mainEntity = Question[]) + BreadcrumbList.
430:- **어드민 화면 추가 없음** — M0 어드민 화면 수 6개 유지. 운영자는 ClinicProfile 입력 시 정책 변수(개인정보 보호 책임자·시행일 등)만 추가 입력하거나, LegalDocument 파일을 Git에 수동 보강.
493:- **어드민 별도 LocationProfile 입력 화면 추가 불필요** (M0 어드민 화면 수 6개 유지).
583:**Schema 요약**: `WebPage` 또는 `MedicalWebPage` + `FAQPage` 일부.
614:| P-011 | FAQ | `/faq` | FAQ[] | FAQPage | 답변 가변 | | ✅ (EAT v0.x EC-CASCADE-08) |
627:## 6. Vertical Slice (M0) 페이지 타입 — 11개 페이지 (EAT v0.x EC-CASCADE-08: P-011 FAQ M0 합류)
640:| **10** | **P-011 FAQ (EAT v0.x EC-CASCADE-08 합류)** | FAQ[] · FAQPage JSON-LD · 어드민 폼 신규 (Faq) · 공개 페이지 `/<slug>/faq` |
643:**M0 어드민 화면 수: 7개 (EAT v0.x cascade)** — 대시보드 / ClinicProfile / DoctorProfile / TreatmentPage / Article / **Faq (EAT v0.x 신규)** / 미리보기·발행. P-012·P-014·P-013은 자동 생성.
647:2. ~~P-011 FAQ~~ ✅ M0 합류 (EAT v0.x)
672:| PT-09 | FAQ 답변 단위 위험도 UI | admin |
689:| 2026-05-14 | v0.5 | **피드백 적용**: (1) **전체 본문 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, 단독 구현 명세화, (2) **P-014 LocationProfile main 자동 생성 규칙 명시** (어드민 화면 추가 없음), (3) **P-006 TreatmentPage 정보 슬롯에 treatmentComponents·recommendedFor·visitFlow·remoteCareAvailable·maintenancePlan·evidenceNotes 즉시 통합**, (4) **P-010 Article 정보 슬롯에 reviewedBy·contentSource·externalUrl 즉시 통합**, (5) **P-106 Self-test를 "Feature-backed optional page"로 표현 변경** (PT-12 해소), (6) PT-14 LocationProfile 자동 생성 규칙 어드민 구현 세부 신규, (7) **v0.5.1 추가 정정**: **P-013 Legal/Policy를 M0 출시 게이트로 격상** — Core 표준 템플릿 + ClinicProfile 변수 자동 치환 생성. M0 페이지 수 9 → **10**. 어드민 화면 수 6개 그대로 (자동 생성). 법무 검토 필수 (ComplianceRecord 추적) |

 succeeded in 635ms:
docs\ARCHITECTURE.md:602:| 2026-05-14 | v0.5 | **DEEP_DIVE 통합 정합 동기화**: (1) § 2.4 **데이터 계약 인벤토리 22개 + 공통 타입 3개로 갱신** — C-21 LocationProfile·C-22 ArticleCategory 정식 등재, CT-01 TrustMetric·CT-02 BusinessHours·CT-03 CTAConfig 신설, (2) ClinicProfile 책임 재정의 — 위치·시간·연락은 LocationProfile이 마스터 (SoT 정리), (3) RiskLevel은 직접 enum 사용 (`Ref<C-05>` 표기 제거), (4) PAGE_TYPES v0.5 (필수 14 + 선택 7, M0 8+1=9페이지) 및 admin v0.4 (LocationProfile main 자동 생성 규칙) 정합 동기화. 본 문서의 어드민 화면 수 6개·Control Plane / Data Plane 위상은 그대로 유지 | Glitzy (Claude 페어링) |
docs\admin\ARCHITECTURE.md:188:→ Slice **어드민 화면 수는 6개 그대로** 유지. P-012·P-014·P-013은 ClinicProfile 입력값과 Core 표준 템플릿으로 자동 생성되므로 별도 화면 불필요.
docs\admin\ARCHITECTURE.md:248:**어드민 폼 처리**: ClinicProfile 폼에 "정책 변수" 보조 섹션 추가 (개인정보 보호 책임자명·연락처·정책 효력 발생일 등 입력). 별도 화면 추가 아닌 보조 섹션이므로 어드민 화면 수 6개 유지.
docs\admin\ARCHITECTURE.md:273:| 1 | 사이트 측 페이지 타입 10종 + Article 1샘플 빌드 (총 11 페이지) | Home·About·Doctors List·Doctor Profile·Treatments List·Treatment Detail·**Contact**·**Location Detail (main 자동)**·**Legal/Policy (자동, 법무 검토)**·**FAQ (EAT v0.x EC-CASCADE-08)**·Article Detail 1개 — 정적 빌드 가능. 상세는 PAGE_TYPES.md § 6 |
docs\admin\ARCHITECTURE.md:513:| 2026-05-13 | v0.3 | **PAGE_TYPES.md v0.2 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 5종 → **7종 + Article 1샘플 = 8개 페이지** (Contact 추가), (2) § 3.11 완료 게이트 #1 7종 빌드로 수정, (3) 단일 진실 원본은 `core/PAGE_TYPES.md`로 명시 (중복 회피). 어드민 화면 수 6개는 유지(Contact는 ClinicProfile 자동 생성) | Glitzy (Claude 페어링) |
docs\admin\ARCHITECTURE.md:514:| 2026-05-14 | v0.4 | **PAGE_TYPES v0.5 + DATA_MODEL v0.4 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 7종+1샘플 → **8종+1샘플=9개 페이지** (P-014 Location Detail 추가), (2) **§ 3.8.1 LocationProfile(main) 자동 생성 규칙 명시** — 어드민 화면 추가 없이 ClinicProfile 입력으로 자동 생성, (3) § 3.11 완료 게이트 #1 8종 빌드로 수정. 어드민 화면 수 6개는 그대로 유지 | Glitzy (Claude 페어링) |
docs\admin\REVIEW_WORKFLOW.md:809:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (7개 지적 전건 수용)**: (1) § 2.3 `approved → publishable` 전이 조건을 § 7.1 6조건 모두 명시로 정정 — 표만 보고 publishable 과소 판정 회피, (2) warning 큐 진입 조건에서 "content-gate 미발생" 잔재 제거 — § 3.1.2 동시 진입과 정합, (3) § 3.3 SLA 표 분리 — blocked는 큐 아닌 정정 흐름. content-gate P0 일원화, (4) § 0 publishable "automatedDecision pass" → `!== "block"`로 통일 — gate/warn 콘텐츠도 사람 검수·정책 처리로 publishable 가능, (5) § 2.3 `blocked → review-queued` 전이 추가 — 사후 fail 작성자 정정 후 직접 재제출, 의료법 개정 트리거 자동 큐 진입 경로, (6) § 8.1 priorReviewRequired 판정 진입 경로 명시 — 모든 콘텐츠 대상 자동 후보 플래그 + legal 검수자 임시 추가로 매체 판정 → true 시 정식 finalRoles 포함·false 시 제거, (7) § 6.2 stale 해제 평가 기준 명확화 — active(현재 사이클) pre-publish record staleFlags 기준. 이전 published record는 audit 보존 |
docs\compliance\RISK_LEVELS.md:127:| P-001 Home, P-002 About, P-003 Doctors List, P-004 Doctor Profile, P-005 Treatments List, P-007 Conditions List, P-009 Articles List, P-011 FAQ, P-012 Contact, P-013 Legal, P-014 Location, P-105 Reservation | Low |
docs\core\CONTENT_STANDARDS.md:102:6. P-011 FAQ의 경우 각 Q&A 블록 단위로 동일 알고리즘 — `<dl>/<dt>` 다음 `<dd>` 또는 H3 다음 paragraph
docs\core\CONTENT_STANDARDS.md:154:- JSON-LD schema — 본문 Q&A 블록을 추출하여 별도 FAQPage 그래프 출력 (`SCHEMA_MAPPING` § 3 P-011 FAQPage 매핑). 렌더링 마크업과 schema 출력은 독립
docs\core\CONTENT_STANDARDS.md:309:### 5.5 P-011 FAQ — 답변 단위 위험도
docs\core\CONTENT_STANDARDS.md:426:| `ArticleCategory` | (콘텐츠 자체 없음 · 분류 메타) | — | — | — | EAT v0.x C-22 실 운영 합류 — 룰 미적용 |
docs\core\CONTENT_STANDARDS.md:428:**v0.1 단계 운영 결정 (EAT v0.x EC-DEFER-12)**: 4 신규 entity (Publication·MediaAppearance·FAQ·ArticleCategory) 모두 어드민 폼 `status='draft'` 만 허용. compliance-assistant + risk_level 자동 추론 합류 (EC-DEFER-05) 까지 published 발행 차단. FAQ 는 DB CHECK 로 강제 (`faq_status_v01_limit`), Publication/MediaAppearance 는 zod schema 만 (DB CHECK 없음 — 외부 인용 entity 의 published 자체는 안전).
docs\core\CONTENT_STANDARDS.md:673:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 잔재 정리 마감 (7개 지적 전건 수용)**: (1) **DATA_MODEL C-10 cascade 누락 정정** — `contentType` enum에 `Feature` 토큰 추가. `featureContentType` 필드도 함께 추가 (`feature:<slug>` 정규식 명시), (2) ApproverRole 중복 정의 제거 — ComplianceCheckResult 코드 블록의 중복 type 삭제. 단일 SoT는 § 7.1.3, (3) SimpleRiskRule `requiredApproverRole` 단수 잔재 → `requiredApproverRoles?: ApproverRole[]` 배열로 통일 (§ 7.2와 정합), (4) § 6 effect-result-related 표 — 기본 승인 역할 `["medical"]` 명시. 후기·사례·금액 결합 시 `legal` 추가 (§ 7.1.2 override와 정합), (5) ContentScope union에 `feature` 변형 추가 — Feature-backed 콘텐츠 전용 RiskRule 적용 가능, (6) § 0 한 페이지 요약 content-gate 정의 — § 8·SCHEMA_MAPPING § 7.3과 동일 통일 정의로 갱신 (schema 출력 승인 게이트 포함), (7) § 9.1 CS-C 해소 설명 정정 — DATA_MODEL C-10 enum `Feature` 토큰 cascade 정확히 기술. **다음 단계**: compliance/RISK_LEVELS.md 후속 + 자체 룰 checker 실제 구현 (CS-A·CS-D 영역) + admin 검수 워크플로 명세 + 그 발견을 본 문서에 되먹이기 |
docs\decisions\EAT_CONTENT_PLAN.md:7:> - **EAT_CONTENT code v1.0 cycle 안 cascade (별 사이클 분리 · 실 코드)**: migrations 6 (C0009/10/11/12/13 + D0014) · Drizzle schema v0.4 · zod schema · 어드민 폼 4종 + route 4종 + dashboard · JSON-LD entities/builders 확장 · P-011 FAQ public page · Doctor/About graph 확장 · Article detail SQL JOIN article_category · sitemap.xml 확장 · seed.ts default category · renderMarkdownToPlainText helper · vitest scenario 24~36.
docs\decisions\EAT_CONTENT_PLAN.md:18:모든 entity 는 schema.org JSON-LD 로 출력되어 P-004 Doctor Profile · P-002 About · P-011 FAQ 페이지에 합류한다.
docs\decisions\EAT_CONTENT_PLAN.md:25:- `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ — M0 미합류 → 본 plan 합류 (EC-CASCADE-08)
docs\decisions\EAT_CONTENT_PLAN.md:26:- `docs/core/SCHEMA_MAPPING.md` § 1.2 `@id` 패턴 · § 2 entity 카탈로그 (+ ScholarlyArticle, VideoObject) · § 3 P-011 FAQ graph (EC-CASCADE-02)
docs\decisions\EAT_CONTENT_PLAN.md:30:- `docs/admin/ARCHITECTURE.md` § 3 — Vertical Slice 안 P-011 FAQ 페이지 합류 marker (EC-CASCADE-09)
docs\decisions\EAT_CONTENT_PLAN.md:67:| 공개 페이지 P-011 FAQ 신설 (cycle 1 ECP-12 정정 — PAGE_TYPES M0 합류 EC-CASCADE-08 acceptance precondition 격상) | `/<slug>/faq` route — FaqList + FAQPage JSON-LD |
docs\decisions\EAT_CONTENT_PLAN.md:73:| sitemap.xml 확장 | P-011 FAQ entry (changefreq monthly · priority 0.5 · lastmod `MAX(faq.updated_at)`) — published row 0건이어도 페이지 포함 (cycle 1 ECP-21 정정) |
docs\decisions\EAT_CONTENT_PLAN.md:464:### 5.1 P-011 FAQ 신규 페이지 (EC-RENDER-01) — PSR-DEFER-11 부분 해소
docs\decisions\EAT_CONTENT_PLAN.md:604:| P-011 FAQ | `[풀] Organization` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] FAQPage` (with Question[] inline `mainEntity`) |
docs\decisions\EAT_CONTENT_PLAN.md:679:| 16 | P-011 FAQ public page (cycle 1 ECP-21 — 빈 페이지도 200) | apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx + metadata + JsonLdScript |
docs\decisions\EAT_CONTENT_PLAN.md:683:| 20 | sitemap.xml 확장 — P-011 FAQ entry + article URL 실 category slug | (site)/[instanceSlug]/sitemap.xml/route.ts |
docs\decisions\EAT_CONTENT_PLAN.md:689:| 26 | docs cascade — DATA_MODEL § 1.1 인벤토리 25 contracts · § 4 C-10 enum +2 · C-12 풀명세 · C-22 풀명세 컬럼 정합 · C-24 Publication · C-25 MediaAppearance 풀명세 (EC-CASCADE-01) · SCHEMA_MAPPING § 2 entity 카탈로그 · § 3 P-011 (EC-CASCADE-02) · CONTENT_STANDARDS § 7.1.1.x (EC-CASCADE-03) · PSR-DEFER-11/15 해소 marker (EC-CASCADE-07) · M0_BUILD_EXPORT § 2.1 (EC-CASCADE-04) · PAGE_TYPES § 1.1 P-011 M0 ✅ + § 3 본문 (EC-CASCADE-08 acceptance precondition — cycle 1 ECP-12 격상) · ARCH § 3 Vertical Slice 정합 (EC-CASCADE-09 — 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ) | doc patches |
docs\decisions\EAT_CONTENT_PLAN.md:724:  - § 3 P-011 FAQ graph + P-002/P-004 graph 확장 (ScholarlyArticle/VideoObject 풀 entity).
docs\decisions\EAT_CONTENT_PLAN.md:730:- `EC-CASCADE-08` (cycle 1 ECP-12 정정 — acceptance precondition 격상): `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ M0 ✅ + § 3 P-011 본문 작성 (질문 위계 + AEO 친화).
docs\decisions\EAT_CONTENT_PLAN.md:731:- `EC-CASCADE-09` (cycle 1 ECP-22 정정): `docs/admin/ARCHITECTURE.md` § 3 Slice 페이지 합계 = **11페이지** (기존 9 + P-010 1샘플 + P-011 FAQ). ArticleCategory 는 어드민 운영 routing 추가지만 공개 페이지 count 에는 포함 안 됨 (Article URL prefix 만 변경).
docs\decisions\EAT_CONTENT_PLAN.md:738:| 2026-05-18 | v0.4 | **Codex 비평 cycle 3 3 findings (0 blocking + 1 major + 2 minor) 전건 수용 patch — PAGE_TYPES 내부 SoT 통일 + DATA_MODEL 한 페이지 요약 cascade**: (ECP-31 major) PAGE_TYPES § 5 matrix + § 6 목록 + 합류 우선순위 — P-011 FAQ M0 ✅ 일관 (§ 5 matrix 행 patch · § 6 페이지 #10 추가 + 어드민 화면 수 6→7 · 우선순위 P-011 strike-through). (ECP-32 minor) DATA_MODEL § 0 한 페이지 요약 "23개 계약 (C-01~C-23)" → "25개 계약 (C-01~C-25)". (ECP-33 minor) DATA_MODEL § 관계 다이어그램 ComplianceRecord contentRef 대상 범위 "C-01~C-22" → "C-01~C-25" — C-24 Publication · C-25 MediaAppearance 포함. 누계 cycle 1+2+3 = 33 findings 전건 수용. closeableAfterPatch=true 신호 (다음 cycle 4 acceptance 신호 검증). |
docs\decisions\EAT_CONTENT_PLAN.md:739:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 8 findings (4 blocking + 4 major + 0 minor) 전건 수용 patch — docs cascade 실 patch 진입**: (ECP-23·24·25·26 blocking 4건 + ECP-27·28·29·30 major 4건) plan 본문 명시한 docs cascade 가 실 patch 안 됨 — plan acceptance commit 안 docs cascade 동시 적용 결정 (LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합). 본 patch 사이클에서 다음 실 적용: (1) DATA_MODEL § 1.1 인벤토리 23 → 25 contracts + C-24 Publication · C-25 MediaAppearance row 추가 + C-12 FAQ M0 ✅ + C-04 Article category required 명시. (2) DATA_MODEL § 4 C-10 contentType enum v0.6 — +Publication +MediaAppearance (17종). (3) DATA_MODEL § 4 C-22 ArticleCategory marker (DB 실 운영 합류 marker + EC-DEFER-10). (4) DATA_MODEL § 4 C-12 FAQ 풀명세 (question 10~200 · answer Markdown 50~2000 · v0.1 DB CHECK draft 만). (5) DATA_MODEL § 4 C-24 Publication 풀명세 (외부 학술 인용 · risk Low fixed). (6) DATA_MODEL § 4 C-25 MediaAppearance 풀명세 (모든 channel_type → VideoObject 단일화 v0.1). (7) PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 페이지 합계 11. (8) SCHEMA_MAPPING § 2 entity 카탈로그 — ScholarlyArticle 추가 · VideoObject MediaAppearance 매핑 추가 · FAQPage EAT v0.x M0 합류 + Answer.text helper marker. (9) CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 — Publication/MediaAppearance 면제 + FAQ Q/A 적용. (10) ARCH § 3.11 게이트 #1 — 11 페이지 + P-011 FAQ 합류. (11) M0_BUILD_EXPORT § 2.2 EAT 4 entity 변환 표. (12) PUBLIC_SITE_RENDER § 9.3 PSR-DEFER-11/15 해소 marker. (13) packages/migrations-runner/src/manifest.ts orderedMigrations 16 entry (C0009/10/11/12/13 + D0014). 코드 cascade (migrations 실 SQL · 어드민 폼 · Article detail SQL JOIN 등) 는 별도 EAT_CONTENT code v1.0 cycle. 누계 cycle 1+2 = 30 findings 전건 수용. |
docs\decisions\EAT_CONTENT_PLAN.md:740:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 22 findings (7 blocking + 10 major + 5 minor) 전건 수용 patch**: (ECP-01) C-24/25 Publication/MediaAppearance · C-12 FAQ 풀명세 합류 · C-22 ArticleCategory 실 운영 합류 — DATA_MODEL 인벤토리 25 contracts. (ECP-02) C-22 풀명세 컬럼 전체 DB 추가 (v0.1 UI minimal · EC-DEFER-10). (ECP-03) Article.category_id staged 4-step migration (ADD nullable + seed + backfill + SET NOT NULL). (ECP-04) manifest 16단계 + 각 dependsOn 명시. (ECP-05·14) MediaAppearance 모든 channel_type → VideoObject 단일화 · fragment `#video-{slug}` 단일 · BroadcastEvent/NewsArticle 분기는 EC-DEFER-11. (ECP-06) Doctor/About graph self-contained — Publication/Media 풀 entity 출력. cross-page allowlist 미사용. (ECP-07) C-10 contentType enum +Publication +MediaAppearance v0.6 cascade. FAQ 토큰 대문자 통일. (ECP-08) DOI regex DB·zod 동일 anchored. (ECP-09) default `general` ArticleCategory seed = seed.ts + C0013 마이그레이션 backfill. (ECP-10·11) v0.1 단계 4 entity 어드민 status='draft' 강제 — FAQ DB CHECK + zod enum subset. EC-DEFER-12 신설. (ECP-12) PAGE_TYPES P-011 M0 ✅ — EC-CASCADE-08 acceptance precondition 격상. (ECP-13) Publication/Media `@id` fragment-scoped (Doctor/About page URL + fragment). (ECP-15) About publication/media reference 는 MedicalClinic.subjectOf 단일 결정. (ECP-16) ArticleCategory taxonomy public 의도 명시 — status 게이트 없음 + EC-DEFER-10. (ECP-17) Article detail SQL JOIN article_category · category.slug 매칭 작업 명시. (ECP-18) `authors` DEFAULT 제거. (ECP-19) `renderMarkdownToPlainText` helper 신규 — JSON-LD Answer.text. (ECP-20) external link rel `nofollow noopener noreferrer` 통일. (ECP-21) FAQ 빈 페이지 200 + sitemap 포함 + lastmod fallback. (ECP-22) Slice 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ. |
docs\research\REFERENCE_ANALYSIS_2026-05.md:51:**차별화**: 21지점, 7개 언어, 대한체육회 공식협력병원, 자생의료재단·메디바이오센터, 자가테스트 5종
docs\research\REFERENCE_ANALYSIS_2026-05.md:175:| **콘텐츠 IA가 정연·풍부** | 1호도 단순화 적용 가능 — Pillar 6~7개 |
docs\research\REFERENCE_ANALYSIS_2026-05.md:291:- 의료 정보 콘텐츠 IA 단순화 적용 (Pillar 6~7개)
docs\features\compliance-assistant.md:388:**추출 알고리즘** — `includes-effect-claim`은 § 4 RiskRule 매칭 결과의 `category` 집합(7개 카테고리: 효과 단정·전문성 단정 단독·전문성 단정 결합·보장·수치/기간 단정·수치/기간 보장·체질 맞춤) 중 1개 이상 매칭 시 활성. 나머지 4개 flag는 RISK_LEVELS § 5.1 표의 정규식·어휘 매칭. § 4.1 실행 순서 5단계.
docs\features\compliance-assistant.md:609:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (7개 지적 전건 수용)**: (1) § 3.3 입력 보강 계약 — pageTypeId 미지정 시 contentType+pageMeta 유도, 유도 불가 시 fail. articleType은 contentType=Article 시 필수, (2) § 4.1 7단계 High 가상 finding `triggeredBy` 판정 — RiskInferenceResult.steps 기반. explicit 우선, (3) § 4.1 5단계 inlineRiskFlags 추출 정밀화 — flag별 산출 방식 분리. includes-effect-claim만 category 기반, 나머지 4종은 정규식·ReviewPolicy·미디어 입력, (4) § 5.4.1 LLM ruleId seq를 canonical sort 후 순번으로 — LLM 출력 순서 불변, (5) § 8.1 cacheKey에 `reviewPolicyHash`·`mediaAttachmentsHash` 추가, (6) § 10.3 "DATA_MODEL cascade 후속" 잔재 문구 정정 — v0.12 완료 명시, (7) § 10.3 비활성 모드 finalRoles 산정 정의 — 운영자 수동 결정·audit 기록 |
docs\features\compliance-assistant.md:610:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (7개 지적 전건 수용)**: (1) § 3.1 inferredRiskLevel 입력 주석을 "호환 입력 — 내부 재계산" 정합, (2) § 7.1 meta.yaml 우선 로드 정정 (§ 4.1과 일치), (3) § 4.1 High 가상 finding 단독 구현 정보 완전화 — ruleId·severity·requiredApproverRoles override 명시, (4) § 5.4.1 LLM ruleId 충돌 회피 — seq 순번 추가, (5) § 6.2 inlineRiskFlags enum 5종 vs extract category 7종 분리 표현, (6) § 8.1 cacheKey — inferredRiskLevel 제거, slotMatches 포함, (7) **DATA_MODEL C-08 v0.12 cascade** — `complianceAssistantExemptApproval` 필드 신설 (CA-10 해소) |
docs\core\DATA_MODEL.md:46:| C-12 | `FAQ` | 질문-답변 묶음 (EAT v0.x 풀명세 합류 — § 4 C-12 본문 참조) | L3 | Git | ✅ | P-011 |
docs\core\DATA_MODEL.md:56:| C-22 | `ArticleCategory` | Article Pillar/Category 정의 (EAT v0.x DB 실 운영 합류 — v0.1 어드민 UI minimal · parentCategory/pillar/coverImageUrl/seoMeta/articleTypeDefault 컬럼은 DB nullable + EC-DEFER-10) | L2+L3 | Git+DB | ✅ | P-009, P-010 |
docs\core\DATA_MODEL.md:58:| C-24 | `Publication` | 학술 논문 외부 인용 (E-A-T 전문성 시그널 — schema.org `ScholarlyArticle`) — EAT v0.x 신규 | L3 | DB+Git | ✅ | P-002 About, P-004 Doctor Profile inline |
docs\core\DATA_MODEL.md:59:| C-25 | `MediaAppearance` | 미디어 출연 (방송·유튜브·팟캐스트·언론 — schema.org `VideoObject`) — EAT v0.x 신규 | L3 | DB+Git | ✅ | P-002 About, P-004 Doctor Profile inline |
docs\core\DATA_MODEL.md:928:| `articleTypeDefault` | `string` | optional | 기본 ArticleType (작성 시 자동 추천 — EAT v0.x EC-DEFER-10) |
docs\core\DATA_MODEL.md:932:### C-24. `Publication` — 학술 논문 외부 인용 (E-A-T 전문성 시그널 · EAT v0.x 신규)
docs\core\DATA_MODEL.md:961:### C-25. `MediaAppearance` — 미디어 출연 (E-A-T 권위성 시그널 · EAT v0.x 신규)
docs\core\DATA_MODEL.md:996:### C-12. `FAQ` — EAT v0.x **풀명세 합류 + M0 합류** (§ 4 본문 참조 — 본 § 5 entry 는 historical link)
docs\core\DATA_MODEL.md:1122:   ├─ contentRef → 발행 콘텐츠 (C-01~C-25 · EAT v0.x C-24 Publication · C-25 MediaAppearance 포함)
docs\decisions\M0_BUILD_EXPORT_PLAN.md:80:PUBLIC_SITE_RENDER SSR 컴포넌트는 본 EAT v0.x acceptance commit 안 함께 합류 (Doctor/About graph 확장 + P-011 FAQ 신규 페이지 + Article detail SQL JOIN — EAT_CONTENT code v1.0 cycle).
docs\core\PAGE_TYPES.md:23:- M0 Slice: **10종 + Article 1샘플 = 11개 페이지** (P-001·P-002·P-003·P-004·P-005·P-006·P-011 FAQ·P-012·P-013·P-014 + P-010 1샘플) — EAT v0.x EC-CASCADE-08 patch (P-011 FAQ M0 합류).
docs\core\PAGE_TYPES.md:46:| P-011 | FAQ | `/faq` | `FAQ[]` | ✅ (EAT v0.x EC-CASCADE-08) |
docs\core\PAGE_TYPES.md:430:- **어드민 화면 추가 없음** — M0 어드민 화면 수 6개 유지. 운영자는 ClinicProfile 입력 시 정책 변수(개인정보 보호 책임자·시행일 등)만 추가 입력하거나, LegalDocument 파일을 Git에 수동 보강.
docs\core\PAGE_TYPES.md:493:- **어드민 별도 LocationProfile 입력 화면 추가 불필요** (M0 어드민 화면 수 6개 유지).
docs\core\PAGE_TYPES.md:614:| P-011 | FAQ | `/faq` | FAQ[] | FAQPage | 답변 가변 | | ✅ (EAT v0.x EC-CASCADE-08) |
docs\core\PAGE_TYPES.md:627:## 6. Vertical Slice (M0) 페이지 타입 — 11개 페이지 (EAT v0.x EC-CASCADE-08: P-011 FAQ M0 합류)
docs\core\PAGE_TYPES.md:640:| **10** | **P-011 FAQ (EAT v0.x EC-CASCADE-08 합류)** | FAQ[] · FAQPage JSON-LD · 어드민 폼 신규 (Faq) · 공개 페이지 `/<slug>/faq` |
docs\core\PAGE_TYPES.md:643:**M0 어드민 화면 수: 7개 (EAT v0.x cascade)** — 대시보드 / ClinicProfile / DoctorProfile / TreatmentPage / Article / **Faq (EAT v0.x 신규)** / 미리보기·발행. P-012·P-014·P-013은 자동 생성.
docs\core\PAGE_TYPES.md:647:2. ~~P-011 FAQ~~ ✅ M0 합류 (EAT v0.x)
docs\core\PAGE_TYPES.md:689:| 2026-05-14 | v0.5 | **피드백 적용**: (1) **전체 본문 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, 단독 구현 명세화, (2) **P-014 LocationProfile main 자동 생성 규칙 명시** (어드민 화면 추가 없음), (3) **P-006 TreatmentPage 정보 슬롯에 treatmentComponents·recommendedFor·visitFlow·remoteCareAvailable·maintenancePlan·evidenceNotes 즉시 통합**, (4) **P-010 Article 정보 슬롯에 reviewedBy·contentSource·externalUrl 즉시 통합**, (5) **P-106 Self-test를 "Feature-backed optional page"로 표현 변경** (PT-12 해소), (6) PT-14 LocationProfile 자동 생성 규칙 어드민 구현 세부 신규, (7) **v0.5.1 추가 정정**: **P-013 Legal/Policy를 M0 출시 게이트로 격상** — Core 표준 템플릿 + ClinicProfile 변수 자동 치환 생성. M0 페이지 수 9 → **10**. 어드민 화면 수 6개 그대로 (자동 생성). 법무 검토 필수 (ComplianceRecord 추적) |
docs\core\SCHEMA_MAPPING.md:150:| `FAQPage` | P-011 FAQ (EAT v0.x EC-CASCADE-02 M0 합류 — graph self-contained · cross-page allowlist 미사용 · 빈 FAQ 0 row 도 `mainEntity: []` 허용) | FAQ[] (C-12) |
docs\core\SCHEMA_MAPPING.md:151:| `Question` / `Answer` | FAQPage.mainEntity (EAT v0.x — Answer.text = `renderMarkdownToPlainText(faq.answer)`) | FAQ |
docs\core\SCHEMA_MAPPING.md:154:| `VideoObject` | (a) Article.embeddedMedia[].type=youtube·video, P-010의 contentFormat=video. (b) **EAT v0.x EC-CASCADE-02 (신규)**: MediaAppearance (C-25) 모든 channel_type 단일화 — fragment `#video-{slug}` (Doctor/About page 안 fragment-scoped inline). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1) | EmbeddedMedia · MediaAppearance (C-25) |
docs\core\SCHEMA_MAPPING.md:155:| `ScholarlyArticle` | **EAT v0.x EC-CASCADE-02 (신규)**: Publication (C-24) — Doctor Profile (P-004) · About (P-002) page 안 fragment-scoped inline (`@id` = `${pageBaseUrl}#publication-{slug}`). 별도 페이지는 EC-DEFER-02 (M1) | Publication (C-24) |
docs\core\SCHEMA_MAPPING.md:887:| P-011 FAQ | `faqs: FAQ[]` |
docs\core\SEARCH_STANDARDIZATION.md:117:| P-011 FAQ | `website` |
docs\core\SEARCH_STANDARDIZATION.md:359:| P-011 FAQ | monthly | 0.5 |
docs\core\SEARCH_STANDARDIZATION.md:565:| SS-04 | `InstanceManifest.performanceBudget` 강화 override 범위 | v0.6 — DATA_MODEL C-08 `PerformanceBudget` 7개 필드 / v0.7 — § 6.1 강화 판정 방향 |
docs\features\notifications.md:3:> **상태**: **v1.0 구현 명세 안정판** (codex 자동 비평 5차 사이클 마감 — 7개 지적 전건 수용)
docs\features\notifications.md:733:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (7개 지적 전건 수용)**: (1) **REVIEW_WORKFLOW § 9.1.1 매트릭스 정정** — `sla-imminent`·`sla-overdue` 즉시 채널을 `email + inApp`으로 변경. fallback=inApp이 immediateChannels 집합 안에 포함되도록 cascade (N5-01), (2) **§ 4.1 1단계 abort 원인 분기 명시** — unique violation만 idempotent path, 그 외 abort는 retryable internal error 반환. § 3.3과 정합 (N5-02), (3) **DeliveryAttemptStatus 별도 정의** — 내부 attempt-level "processing"을 외부 DeliveryStatus와 분리. `DeliveryAttemptStatus = "processing" | DeliveryStatus` 합 타입 (N5-03), (4) **§ 4.1 흐름에 invalid locationRef 분기 추가** — businessHours 평가 직전 (f-pre)에 `skipped-missing-location` 명시. critical 이벤트도 본 분기는 우회하지 않음 (N5-04), (5) **MySQL generated column unique schema 정정** — `activeKey INT GENERATED AS (CASE WHEN resolvedAt IS NULL THEN 1 ELSE NULL END)` + `UNIQUE(payloadId, failingChannel, activeKey)`. resolved DLQ 이력 다수 허용 (N5-05), (6) **DATA_MODEL C-23 AdminUser.role cascade 정정** — `system` enum 값은 audit log actorRole 표기 전용. C-23 `role` 및 `instanceMemberships[].role`에는 저장 금지 명시 (N5-06), (7) **specVersion 1.0 + 세 버전 의미 차이** — specVersion(명세)·패키지 SemVer·notificationPolicyVersion 구분 한 줄 설명 (N5-07) (1) **트랜잭션 abort 원인 분기** — unique violation만 idempotent path, 그 외 retryable error (N4-01·N4-03), (2) **duplicate caller receiptState별 응답 계약** (N4-02), (3) **DeliveryAttempt advisory lock SoT** — pg_advisory_xact_lock + provider 호출은 lock 밖 (N4-04·N4-06). NT-17, (4) **UNIQUE(payloadId, channel, attemptNumber)** — dedupeMode 제외 (N4-05), (5) **§ 4.1 fallback immediateChannels 제약** 명시 (N4-07), (6) **fallback 실패 두 attempt 기록** + fallbackExhausted 메타 (N4-08), (7) **두 축 분리 정책** — 패키지 SemVer ↔ policyVersion (N4-09), (8) **policyVersion 보관 정책** — 12개월 최소 지원·deprecation·build fail 메시지 (N4-10), (9) **DigestConditionField cascade 규칙** (N4-11), (10) **exists/notExists deep path 평가 규칙** (N4-12), (11) **default policy 유일성 검증** (N4-13), (12) **broadcast PayloadRecord envelope+channel 단위 1건** + broadcast-placeholder는 DB row 아님 + broadcastAttemptId = broadcast DeliveryAttempt.id (N4-14·N4-15·N4-16), (13) **holidayCalendar 갱신·배포 정책** — 연간 minor·임시공휴일 patch·external-api override (N4-17). NT-18, (14) **businessHours 90일 탐색 한계** + failed-permanent (N4-18), (15) **invalid locationRef → `skipped-missing-location`** DeliveryStatus 신규 (N4-19), (16) **운영자 수동 unsuppress command** + REVIEW_WORKFLOW § 10.2.1 `notification-suppression-unsuppressed` cascade (N4-20·N4-21), (17) **soft → hard 전이 정책** (N4-22), (18) **큐 worker 중복 발송 방지 SoT 쿼리** + partial index (N4-23), (19) **inApp 단일 transaction 원자성** (N4-24), (20) **DeadLetterAttempt UNIQUE(attemptId)** — 1 attempt 1 DLQ (N4-25), (21) **MySQL generated column 대체 schema** 구체 명시 (N4-26), (22) **notification-read actorRole = instanceMemberships 현재 instance role** (N4-27), (23) **AdminUserRole `system` 추가** — REVIEW_WORKFLOW § 11.1 cascade (N4-28), (24) **multi-location + main 부재 fail 격상** (N4-29), (25) **NT-16 해소** (N4-30) (20 finding + 3 residual = 23 지적 전건 수용)**: (1) **Receipt-Log 트랜잭션 순서** — 단일 DB 트랜잭션에서 Log insert → Receipt insert. abort 시 양쪽 롤백 (N3-01), (2) **테이블 인벤토리 재산정 — 11 tables + Redis 1** — Receipt·Log·PayloadRecord·DeliveryAttempt·Inbox·DigestBucket·DigestBucketPayload·QuietHoursQueue·BusinessHoursQueue·DeadLetter·**DeadLetterAttempt(신설)** + DedupeCache. `NotificationDelivery` 가상 참조 제거 (N3-02·N3-19), (3) **DeliveryAttempt attemptNumber 동시성** — payloadId+channel 범위 row lock 또는 advisory lock + processing 선점 (N3-03), (4) **PayloadRecord recipient-envelope unit 명확화** — channel 필드 제거, directSentAt/digestSentAt 제거. 채널별 sentAt 추적은 DeliveryAttempt status만 사용 (N3-04), (5) **fallback 채널 매트릭스 SoT** — REVIEW_WORKFLOW § 9.1.1 컬럼 cascade. 임의 활성 채널 라우팅 금지, fallback도 막히면 외부 sink alert만 (N3-05), (6) **dedupe Redis SET NX EX 원자** — 명시 (N3-06), (7) **receipt vs dedupe TTL 관계** — `receiptRetentionDays`(기본 365일) ≫ dedupeWindowSeconds. sourceEventId 재사용 금지 (N3-07), (8) **REVIEW_WORKFLOW § 9.3 cascade** — Slack 2가지 동작 모드·DeliveryResult 소비 규칙 명시 (N3-08), (9) **broadcast envelope 단위 1건** — broadcastAttemptId·sentinel dedupeKey·perRecipient placeholder broadcastAttemptId 참조 (N3-09), (10) **DigestPolicy AST 구조화** — DigestCondition({field, op, value}) + 허용 enum (N3-10), (11) **policyVersion 병렬 보관** — 패키지에 버전별 매트릭스 보관, manifest opt-in, 롤백은 manifest 변경만 (N3-11), (12) **DigestBucketPayload FK 분리** — bucketId CASCADE, payloadId RESTRICT (N3-12), (13) **C-08 holidayCalendar cascade** — region·source. PublicHoliday SoT 정합. CT-02 dayOfWeek enum과 분리 (N3-13), (14) **LocationProfile `@id="main"` 관례 정합** — C-21 SoT 정합 (N3-14), (15) **suppression autoReleaseAt + worker** — § 7.4 1시간 주기. DATA_MODEL C-23 cascade (N3-15), (16) **suppression atomic increment** — DB atomic + compare-and-set threshold 1회 alert (N3-16), (17) **REVIEW_WORKFLOW § 10.2.1 enum cascade** — `notification-resend-attempted`·`notification-read` (N3-17), (18) **DLQ SQL syntax PostgreSQL** — partial unique index 표기 (N3-18), (19) **DATA_MODEL C-23 timezone 설명 정정** — quietHours 한정 (N3-20), (20) **inactive 사용자 historical inbox 정책** — 기본 숨김 + 인스턴스 옵션 (NT-16) (Residual), (21) **cadenceWindow 포맷 명시** — daily `YYYY-MM-DD`, weekly `YYYY-Wnn` (Residual), (22) **instanceMemberships 검증** — recipient AdminUser.instanceMemberships에 본 인스턴스 미포함 시 `skipped-missing-user` (Residual) |
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:47:| **P-009 Articles List · P-011 FAQ · P-007/008 Conditions** | M0 미합류 — 별 plan (FAQ 는 EAT_CONTENT plan v0.1) |
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:74:| P-009 Articles List · P-011 FAQ · P-007/008 Conditions | 별 plan (EAT_CONTENT plan v0.1 안 FAQ · 별도 plan Conditions) | PSR-DEFER-11 |
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:579:| 1 | `D0011_public_reader.sql` 작성 + per-table policy 7개 (instance + 6 content table) | acceptance precondition |
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:624:| 1 | D0011 migration — `app_public_reader` LOGIN + 7개 policy (instance + 6 content table) | packages/db/migrations/D0011_public_reader.sql |
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:667:- `PSR-DEFER-11(부분)`: ✅ **해소** — FAQ (P-011) 추가 — schema.org `FAQPage` JSON-LD. EAT v0.x acceptance commit 안 합류. C-12 풀명세 + faq DB table (C0012) + P-011 공개 페이지.
docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:695:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |

 succeeded in 780ms:
**위험도 기본값**: Low
**컴플라이언스 주의**: 표시 정보(주소·전화·시간) 정확성 유지. 변경 시 즉시 갱신. 이벤트·할인과 결합 시 High 격상.
**내부 링크 권장**: → Home / About / Doctors List / Reservation(있을 시) / 각 Location Detail(다지점)

### P-013. Legal / Policy — **M0 출시 게이트** ⭐ v0.5 격상

**목적**: 개인정보처리방침·이용약관·비급여 진료 등 정책 페이지. **법적·규제 의무**. 폼·예약·분석 스크립트 운영 시 사실상 필수 (개인정보보호법·정통망법). M0 출시 게이트.
**URL**: `/privacy`, `/terms`, `/non-covered` 등
**주 데이터 계약**: `LegalDocument`
**Schema 요약**: 일반적으로 `WebPage`. 검색 노출 우선순위 낮음.

**M0 자동 생성 규칙** (v0.5 신규, v0.6 SoT 정정):
- Core가 **표준 템플릿** 보유: 개인정보처리방침·이용약관·비급여 진료 안내·환불·민원 처리 등 1차 템플릿.
- 빌드 시 `LegalDocument` 인스턴스 데이터 + **ClinicProfile 변수** (`{{clinic.name}}`·`{{clinic.legalEntityName}}`·`{{clinic.businessRegistrationNumber}}`·`{{clinic.founder}}`) + **LocationProfile(main) 변수** (`{{location.main.address}}`·`{{location.main.telephone}}`·`{{location.main.email}}`) — 출처 SoT 준수.
- **어드민 화면 추가 없음** — M0 어드민 화면 수 6개 유지. 운영자는 ClinicProfile 입력 시 정책 변수(개인정보 보호 책임자·시행일 등)만 추가 입력하거나, LegalDocument 파일을 Git에 수동 보강.
- 1호 출시 전 **법무 검토 필수** (ComplianceRecord.legalCounsel·legalCounselAt 필드 — DATA_MODEL.md C-10 위험도 Low 예외 룰 참조).

**정보 슬롯**:
1. 정책 종류·제목
2. 시행일·최종 개정일
3. 본문 (조항·항목 위계)
4. 개정 이력 (필요 시)
5. 문의처 (개인정보 보호 책임자 등)

**헤딩 위계**: H1 정책 제목 / H2 조항·항목명
**필수 블록**: 시행일 / 본문 / 문의처
**선택 블록**: 개정 이력
**레이아웃 변형**: 평면 본문 / TOC 사이드바
**위험도 기본값**: Low (사실 안내. 법적 정확성 확인 필수)
**컴플라이언스 주의**:
- 법적 의무 — **법무 검토 필수** (ComplianceRecord.contentType=LegalDocument로 추적).
- 의료법·개인정보보호법·정통망법·표시광고법 준수.
- 표준 템플릿 그대로 사용 시에도 클라이언트 사업자번호·연락처·시행일·법인명 등 변수 정확성 확인.

**내부 링크 권장**: 푸터 전체 접근. 본문 내부 링크는 일반적으로 없음.

### P-014. Location / Branch Detail

**목적**: 단지점·다지점 의료기관의 개별 지점 상세. 단일 지점도 main location으로 모델링.
**URL**: `/locations/{slug}` (단일이면 `main`)
**주 데이터 계약**: `LocationProfile`
**Schema 요약**: `MedicalClinic`/`LocalBusiness` (지점 단위 별도 entity) + BreadcrumbList. 본원·지점 각자.

**정보 슬롯**:
1. 지점명·간략 소개
2. 주소·지도 임베드 (지점 좌표)
3. 진료시간·접수시간·점심·휴진 (`BusinessHours`) — 지점별
4. 예약·상담 채널 (`CTAConfig[]`) — 지점 직통
5. 대중교통·주차 안내 (지점 특화)
6. 지점 의료진
7. 지점 시술 (전체 또는 지점 특화)
8. 지점 사진·시설
9. 다른 지점 안내 (Locations List 또는 형제 지점)

**헤딩 위계**: H1 "{ClinicName} {지점명}점" / H2 "위치", "진료시간", "예약·상담", "의료진", "오시는 길"
**필수 블록**: 주소 / 진료시간 / 연락처·예약 채널 / 지점 의료진
**선택 블록**: 지도 / 대중교통 / 주차 / 시설 사진 / 다른 지점
**레이아웃 변형**: 분할 / 풀폭 / 매거진형
**위험도 기본값**: Low
**격상 조건**: 지점별 이벤트·할인·후기·전후사진 → High
**컴플라이언스 주의**: 지점 정보 정확성·즉시 갱신. 비교·최상급 금지.
**내부 링크 권장**: → Home / Contact / 다른 Location Detail / 해당 지점 Doctors

**🔧 단지점 인스턴스의 자동 생성 규칙 (v0.6 정합)**:

> 어드민 § 3.8.1의 매핑 표가 단일 진실 원본. 본 문서는 요약.

- 운영자가 어드민의 **ClinicProfile 화면 두 섹션**(기관 정체성 + 본원 위치·연락·시간)을 입력하면, 어드민이 두 파일을 동시 출력:
  - **`ClinicProfile`** — 기관 정체성 섹션 입력값
  - **`LocationProfile`**(slug=`main`) — 본원 위치·연락·시간 섹션 입력값 (LocationProfile이 위치·시간·연락 SoT)
- LocationProfile main 자동 매핑 핵심:
  - `name` = ClinicProfile의 `name` (또는 "본원")
  - `parentClinic` = ClinicProfile의 `@id`
  - `address`·`telephone`·`email`·`businessHours` = 본원 위치·연락·시간 섹션 입력값
  - `representativeDoctors`·`doctorsAtLocation`·`availableTreatments` = 기본 전체 (운영자가 별도 지정 가능)
  - **`reservationChannels`** = ClinicProfile의 `primaryCtas[]` 상속 (지점 직통 채널 별도 지정 가능)
  - **`featuredChannelId`** (선택) — 강조할 채널이 있을 때만 `reservationChannels[]`의 `@id` 명시
- **어드민 별도 LocationProfile 입력 화면 추가 불필요** (M0 어드민 화면 수 6개 유지).
- 다지점 확장 시 별도 LocationProfile 추가 화면 도입 (Phase Beta+).

**다지점 인스턴스의 처리**: `LocationProfile` N개. P-012 Contact는 통합 안내 + 각 P-014 페이지로 링크.

---

## 4. 선택 페이지 타입 상세

### P-101. Reviews — High-risk commercial

**목적**: 환자 후기 노출. 솔루션의 가장 위험한 영역.
**URL**: `/reviews`

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/admin/ARCHITECTURE.md | Select-Object -Skip 170 -First 120' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "어드민 화면 수|Faq|FAQ|faqs|4 신규|dashboard|card|Slice" docs/admin/ARCHITECTURE.md' in C:\Users\assag\solution\website-exposure
 succeeded in 664ms:
7:> **목적**: 솔루션 운영 Control Plane(어드민)의 위상·원칙·Vertical Slice 명세·Phase 로드맵·기능 영역·데이터 모델·통합 흐름을 정의한다.
19:- 구축은 **Vertical Slice (M0) → Phase Alpha (M1) → Beta (M2) → GA (M3)** 순으로 점진. Slice가 처음부터 끝까지 동작하면 1호 클라이언트 출시 가능.
32:│  │ 6개 핵심 화면 (Vertical Slice — § 3)                              │  │
86:## 3. Vertical Slice (M0) — 처음부터 끝까지 관통하는 한 줄
90:### 3.1 Slice 흐름
120:### 3.2 Slice 포함 범위 — 6개 핵심 화면
124:| ① | 클라이언트 인스턴스 대시보드 | 단일 인스턴스 표시·전환 | (Slice는 단일 인스턴스) | 인스턴스 상태·배포 상태·컴플라이언스 상태 |
131:### 3.3 Slice 포함 데이터 계약 (최소 필드)
135:| 계약 | 필수 필드 (Slice 최소) | 자동 생성 | 어드민 폼 위치 |
146:### 3.4 Slice 컴플라이언스 게이트 깊이
149:- Low/Medium/High 수동 분류 (자동 분류·LLM 보조는 Slice 외 — Beta)
153:### 3.5 Slice Git 통합 깊이
160:### 3.6 Slice Preview·배포
166:### 3.7 Slice 인증·권한
171:### 3.8 Slice 사이트 측 페이지 타입 (Data Plane이 빌드) — 9종 + Article 1샘플 = 10개 페이지
188:→ Slice **어드민 화면 수는 6개 그대로** 유지. P-012·P-014·P-013은 ClinicProfile 입력값과 Core 표준 템플릿으로 자동 생성되므로 별도 화면 불필요.
248:**어드민 폼 처리**: ClinicProfile 폼에 "정책 변수" 보조 섹션 추가 (개인정보 보호 책임자명·연락처·정책 효력 발생일 등 입력). 별도 화면 추가 아닌 보조 섹션이므로 어드민 화면 수 6개 유지.
258:### 3.9 Slice JSON-LD Schema (Core 자동 생성)
261:- BreadcrumbList, FAQPage (필요 시)
263:### 3.10 Slice Feature Modules 깊이
265:- Slice 단계에서는 **모듈 활성화 UI는 외**
266:- compliance-assistant의 **룰 기반 부분만 Slice에 포함** (자동 검수)
269:### 3.11 Slice 완료 게이트 (6항목)
273:| 1 | 사이트 측 페이지 타입 10종 + Article 1샘플 빌드 (총 11 페이지) | Home·About·Doctors List·Doctor Profile·Treatments List·Treatment Detail·**Contact**·**Location Detail (main 자동)**·**Legal/Policy (자동, 법무 검토)**·**FAQ (EAT v0.x EC-CASCADE-08)**·Article Detail 1개 — 정적 빌드 가능. 상세는 PAGE_TYPES.md § 6 |
295:### 4.1 M0 — Vertical Slice (§ 3 참조)
299:### 4.2 M1 — Phase Alpha (Slice 직후 합류 기능)
301:Slice를 끝낸 후 1호 운영 안정화를 위해 합류시킬 기능들:
367:- `MedicalConditionPage`·`FAQ` 폼 — 해당 페이지 타입 합류 시 (Phase Alpha 우선)
443:| M0 (Slice) | 단일 운영자 계정. 단순 인증 |
503:| A-08 | Slice 화면 ⑤(Article 작성) 에디터 우선 기능 (블록 vs Markdown native) | 미결정 |
512:| 2026-05-13 | v0.2 | **주요 갱신** (피드백 3차): (1) Control Plane 위상 도입, (2) Admin-first 원칙 명시, (3) **Vertical Slice (M0) 6개 화면 명세 신설** (§ 3) — Article 포함, (4) Phase 명칭 M0/M1/M2/M3 + Alpha/Beta/GA 병기, (5) Git 원본 vs DB 원본 데이터 분리 명확화 (§ 6), (6) Feature Modules 통합 원칙 명시, (7) ComplianceRecord 두 영역 교차 정책 (§ 6.3) | Glitzy (Claude 페어링) |
513:| 2026-05-13 | v0.3 | **PAGE_TYPES.md v0.2 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 5종 → **7종 + Article 1샘플 = 8개 페이지** (Contact 추가), (2) § 3.11 완료 게이트 #1 7종 빌드로 수정, (3) 단일 진실 원본은 `core/PAGE_TYPES.md`로 명시 (중복 회피). 어드민 화면 수 6개는 유지(Contact는 ClinicProfile 자동 생성) | Glitzy (Claude 페어링) |
514:| 2026-05-14 | v0.4 | **PAGE_TYPES v0.5 + DATA_MODEL v0.4 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 7종+1샘플 → **8종+1샘플=9개 페이지** (P-014 Location Detail 추가), (2) **§ 3.8.1 LocationProfile(main) 자동 생성 규칙 명시** — 어드민 화면 추가 없이 ClinicProfile 입력으로 자동 생성, (3) § 3.11 완료 게이트 #1 8종 빌드로 수정. 어드민 화면 수 6개는 그대로 유지 | Glitzy (Claude 페어링) |
515:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **§ 3.8.1 표현 정리** — 계약 필드(파일 출력)와 어드민 폼 입력 필드(UI 수집)의 구분 명시. ClinicProfile 폼은 두 섹션(기관 정체성 + 본원 위치·연락·시간)으로 출력은 ClinicProfile + LocationProfile main 두 파일, (2) **§ 3.8.2 LegalDocument 자동 생성 규칙 신규** — Core 표준 템플릿 + ClinicProfile 변수 치환, ComplianceRecord 추적, (3) **§ 3.8 Slice 9종+1샘플 → 10종+1샘플=10페이지** (P-013 격상 추가), (4) § 3.11 완료 게이트 #1 10종, (5) **§ 5.2 데이터 입력 영역** — 어드민 화면별 입력·출력 매핑 표 추가로 1:1이 아님 명시 | Glitzy (Claude 페어링) |
517:| 2026-05-14 | v0.7 | **피드백 정정**: § 3.2 Slice 6개 화면 표 — ② 사이트 기본 정보의 입력 데이터 `ClinicProfile`만 → **`ClinicProfile` + `LocationProfile`(main) + `LegalDocument`** 3 계약 동시 출력로 정정. § 3.8.1/§ 3.8.2와 정합 | Glitzy (Claude 페어링) |

 succeeded in 741ms:
### 3.8 Slice 사이트 측 페이지 타입 (Data Plane이 빌드) — 9종 + Article 1샘플 = 10개 페이지

> 상세는 `core/PAGE_TYPES.md` § 6 (단일 진실 원본).

| 순서 | 페이지 타입 | 비고 |
|---|---|---|
| 1 | P-001 Home | 메인. Articles List 미합류 상태에서 Article 샘플로 **직접 링크**해 고립 회피 |
| 2 | P-002 About | ClinicProfile 노출 |
| 3 | P-003 Doctors List | DoctorProfile 1명 이상 |
| 4 | P-004 Doctor Profile | 1개 이상 |
| 5 | P-005 Treatments List | TreatmentPage 1개 이상 |
| 6 | P-006 Treatment Detail | 1개 이상 |
| 7 | **P-012 Contact (Conversion Hub)** | ClinicProfile + LocationProfile[] 참조. 다중 CTA 채널 노출 |
| 8 | **P-014 Location Detail (main 자동)** | LocationProfile(slug=`main`) 1개 자동 생성. 어드민 화면 추가 없음 (§ 3.8.1 규칙) |
| **9** | **P-013 Legal / Policy (자동 생성)** | **출시 게이트** — Core 표준 템플릿 + ClinicProfile 변수 치환. 법무 검토 필수 (§ 3.8.2 규칙) |
| (샘플) | P-010 Article Detail | 1개 샘플. Home에서 직접 링크 |

→ Slice **어드민 화면 수는 6개 그대로** 유지. P-012·P-014·P-013은 ClinicProfile 입력값과 Core 표준 템플릿으로 자동 생성되므로 별도 화면 불필요.

### 3.8.1 LocationProfile(main) 자동 생성 규칙

> **계약 필드 vs 어드민 폼 입력 필드의 구분**:
> - **계약 필드 (Git 출력)**: `core/DATA_MODEL.md` C-01 ClinicProfile (브랜드·메타만) + C-21 LocationProfile (위치·시간·연락 마스터) — SoT는 LocationProfile.
> - **어드민 폼 입력 필드 (UI 수집)**: 어드민의 "ClinicProfile 입력" 화면은 **두 섹션**으로 구성된다 — (a) 기관 정체성 섹션 (ClinicProfile 계약 필드) + (b) 본원 위치·연락·시간 섹션 (LocationProfile main 생성용 입력). 폼 한 화면, 출력은 **두 개 파일** (ClinicProfile + LocationProfile main).

운영자가 어드민에서 ClinicProfile 화면을 입력하면, 어드민은 두 섹션의 입력값을 분리해 다음을 생성한다:

**(1) `ClinicProfile` 파일** — DATA_MODEL.md C-01 필드만 (브랜드·메타·통계).

**(2) `LocationProfile`(slug=`main`) 파일** — 다음 규칙으로 자동 생성:

| LocationProfile 필드 | 자동 생성 값 (어드민 폼의 "본원 위치·연락·시간" 섹션 입력값) |
|---|---|
| `@id` | `"main"` |
| `name` | ClinicProfile의 `name` (또는 "본원") |
| `parentClinic` | ClinicProfile의 `@id` |
| `address` | 폼의 "본원 주소" 입력값 |
| `telephone` / `email` | 폼의 "본원 전화 / 이메일" 입력값 |
| `businessHours` | 폼의 "본원 진료시간·접수시간·점심·휴진" 입력값 |
| `representativeDoctors` | ClinicProfile에 등록된 대표 의료진 |
| `doctorsAtLocation` | 전체 의료진 (운영자가 추후 지정 가능) |
| `availableTreatments` | 전체 시술 (운영자가 추후 지정 가능) |
| `reservationChannels` | ClinicProfile의 `primaryCtas` 상속 |

**다지점 확장 시 (Phase Beta+)**: 별도 LocationProfile 추가 입력 화면 도입. M0에서는 단일 main만 지원.

**구현 책임**: 어드민이 ClinicProfile 폼 발행 트리거 시점에 두 파일(ClinicProfile + LocationProfile main)을 동시 출력해 Git에 함께 커밋. 운영자는 두 파일을 직접 편집해서 override 가능.

### 3.8.2 LegalDocument 자동 생성 규칙

P-013 Legal/Policy는 출시 게이트이며 Core가 **표준 템플릿**(개인정보처리방침·이용약관·비급여 안내·환불·민원 처리)을 제공한다.

| LegalDocument 필드 | 자동 생성 값 |
|---|---|
| `@id` | 정책 종류별 slug (예: `"privacy"`, `"terms"`) |
| `documentType` | enum 매칭 |
| `title` | 표준 (예: "개인정보처리방침") |
| `body` | Core 표준 템플릿 본문 + **ClinicProfile 변수** (`{{clinic.name}}`·`{{clinic.legalEntityName}}`·`{{clinic.businessRegistrationNumber}}`·`{{clinic.founder}}`) + **LocationProfile(main) 변수** (`{{location.main.email}}`·`{{location.main.address}}`·`{{location.main.telephone}}`) + **Policy 변수** (`{{policy.contactPerson}}`·`{{policy.contactEmail}}`·`{{policy.contactPhone}}`·`{{policy.effectiveDate}}`) — 출처 SoT 준수 |
| `effectiveDate` | 클라이언트 첫 발행 시 명시 입력 또는 발행 일자 |
| `contactPerson` | 개인정보 보호 책임자 등 — 어드민에서 ClinicProfile 폼의 "정책 변수" 보조 섹션에 입력 |

**Body 변수 화이트리스트 reference (LL-CASCADE-01 · LOCATION_LEGAL_PLAN v1.0 § 5 SoT)** — 본문 `body` 에 허용된 11개 변수. 등록되지 않은 키는 `renderTemplate` 이 `TemplateRenderError("unknown-variable")` 으로 거부한다.

| 영역 | 변수 키 | 출처 |
|---|---|---|
| clinic | `{{clinic.name}}` | ClinicProfile.name |
| clinic | `{{clinic.legalEntityName}}` | ClinicProfile.legalEntityName |
| clinic | `{{clinic.businessRegistrationNumber}}` | ClinicProfile.businessRegistrationNumber |
| clinic | `{{clinic.founder}}` | ClinicProfile.founder |
| location | `{{location.main.address}}` | LocationProfile(main).streetAddress 등 결합 |
| location | `{{location.main.telephone}}` | LocationProfile(main).phone |
| location | `{{location.main.email}}` | LocationProfile(main).email |
| policy | `{{policy.contactPerson}}` | ClinicProfile.policyContactPerson — § 3.8.2 "정책 변수" 보조 섹션 입력 |
| policy | `{{policy.contactEmail}}` | ClinicProfile.policyContactEmail |
| policy | `{{policy.contactPhone}}` | ClinicProfile.policyContactPhone |
| policy | `{{policy.effectiveDate}}` | ClinicProfile.policyEffectiveDate (LegalDocument 별 override 우선) |

**어드민 폼 처리**: ClinicProfile 폼에 "정책 변수" 보조 섹션 추가 (개인정보 보호 책임자명·연락처·정책 효력 발생일 등 입력). 별도 화면 추가 아닌 보조 섹션이므로 어드민 화면 수 6개 유지.

**법무 검토 (위험도 Low 예외 룰)**:
- LegalDocument는 위험도 기본 Low이지만, **법무 검토 필수**. 표준 위험도 룰(High일 때만 권장)과 별도 예외 게이트.
- 발행 시 ComplianceRecord에 다음을 **모두 기록 필수** (어드민 발행 게이트가 강제):
  - `contentType` = `LegalDocument`
  - `legalCounsel` = 법무 자문자 신원 (필수)
  - `legalCounselAt` = 자문 일자 (필수)
- `legalCounsel`/`legalCounselAt` 누락 시 발행 차단. (DATA_MODEL.md C-10 룰 명세 참조)

### 3.9 Slice JSON-LD Schema (Core 자동 생성)

- Organization, MedicalClinic, Physician, MedicalProcedure, Article
- BreadcrumbList, FAQPage (필요 시)

### 3.10 Slice Feature Modules 깊이

- Slice 단계에서는 **모듈 활성화 UI는 외**
- compliance-assistant의 **룰 기반 부분만 Slice에 포함** (자동 검수)
- 다른 모듈(notifications·analytics-reporting·search-visibility 등)은 Phase Alpha+/Beta로 합류

### 3.11 Slice 완료 게이트 (6항목)

| # | 게이트 항목 | 통과 기준 |
|---|---|---|
| 1 | 사이트 측 페이지 타입 10종 + Article 1샘플 빌드 (총 11 페이지) | Home·About·Doctors List·Doctor Profile·Treatments List·Treatment Detail·**Contact**·**Location Detail (main 자동)**·**Legal/Policy (자동, 법무 검토)**·**FAQ (EAT v0.x EC-CASCADE-08)**·Article Detail 1개 — 정적 빌드 가능. 상세는 PAGE_TYPES.md § 6 |
| 2 | JSON-LD Schema 자동 생성 | schema validator 통과 |
| 3 | 컴플라이언스 자동 검수 | 룰 기반 금지 표현 검수 동작 + Low/Medium/High 수동 분류 동작 |
| 4 | Git 기반 발행·롤백 | 발행 시 커밋 자동 생성, Git revert로 롤백 가능 |
| 5 | Preview URL 제공 | 발행 전 별도 URL로 미리보기 가능 |
| 6 | `ComplianceRecord` 어드민 DB 보관 | 발행 콘텐츠당 위험도·검수자·일자 기록 |

### 3.12 apps/web route group 구조 (PSR-CASCADE-01a · PUBLIC_SITE_RENDER_PLAN v0.x)

Phase 0 단계 `apps/web` 안 어드민 + 공개 사이트 두 영역을 같은 Next.js 앱 안 route group 으로 분리한다. PUBLIC_SITE_RENDER_PLAN v0.x § 2.1 의 acceptance precondition cascade.

| route group | URL prefix | 책임 | 진입 단계 |
|---|---|---|---|
| `(admin)` | `/admin/<instanceSlug>/...` | 운영자 어드민 — ClinicProfile · DoctorProfile · TreatmentPage · Article · LegalDocument 입력/편집 | ADMIN_UI_SKELETON code v1.0 합류 (현재 `/<instanceSlug>/...` → `/admin/<instanceSlug>/...` 격상 cascade는 PUBLIC_SITE_RENDER code v1.0 cycle 안 동반 — PSR-CASCADE-01b) |
| `(site)` | `/<instanceSlug>/...` | 공개 사이트 — Home · About · Doctors · Treatments · Insights (1샘플) · Contact · Locations · Legal (v0.x 차단) | PUBLIC_SITE_RENDER code v1.0 합류 (M0 게이트 #1 사이트 측 페이지 빌드 가능 단계) |

**격상 의도**: 어드민 `/<slug>` 와 공개 `/<slug>` 가 같은 path namespace 를 공유하면 충돌. 본 격상으로 `(admin)` 은 `/admin/<slug>` · `(site)` 는 `/<slug>` 로 분리. M0 v1.0 도메인 매핑 (PSR-DEFER-02) 합류 시 어드민 도메인 (`app.glitzy.co`) 분리 가능 — 그 시점에 `/admin` prefix 유지 또는 제거 결정.


codex
# EAT_CONTENT_PLAN v0.4 — cycle 4 review

## summary
- 본 cycle 지적 수: blocking=0 major=1 minor=1 (총 2)
- closeableAfterPatch: false
- 수렴: cycle1=22 → cycle2=8 → cycle3=3 → cycle4=2

## cycle 3 patch 검증
- ECP-31: PASS — `PAGE_TYPES.md` §5 P-011 ✅, §6 #10 P-011 추가, 어드민 7개, 우선순위 strike-through 확인.
- ECP-32: PASS — `DATA_MODEL.md` §0 “25개 계약 (C-01~C-25)” 확인.
- ECP-33: PASS — `ComplianceRecord.contentRef` 범위 “C-01~C-25” 확인.

## new findings
- ECP-34 major — `docs/admin/ARCHITECTURE.md` §3.8이 여전히 “9종 + Article 1샘플 = 10개 페이지”이고 표에 P-011 FAQ가 없음. 같은 문서 §3.11의 11페이지/P-011 합류와 충돌.
- ECP-35 minor — `docs/core/PAGE_TYPES.md` P-013/P-014 상세에 “M0 어드민 화면 수 6개 유지” 잔재가 남아 §6의 7개와 충돌.

## acceptance 판정
- major 1건이 남아 plan v1.0 acceptance commit은 patch 후 재검증 권고.
tokens used
63,750
# EAT_CONTENT_PLAN v0.4 — cycle 4 review

## summary
- 본 cycle 지적 수: blocking=0 major=1 minor=1 (총 2)
- closeableAfterPatch: false
- 수렴: cycle1=22 → cycle2=8 → cycle3=3 → cycle4=2

## cycle 3 patch 검증
- ECP-31: PASS — `PAGE_TYPES.md` §5 P-011 ✅, §6 #10 P-011 추가, 어드민 7개, 우선순위 strike-through 확인.
- ECP-32: PASS — `DATA_MODEL.md` §0 “25개 계약 (C-01~C-25)” 확인.
- ECP-33: PASS — `ComplianceRecord.contentRef` 범위 “C-01~C-25” 확인.

## new findings
- ECP-34 major — `docs/admin/ARCHITECTURE.md` §3.8이 여전히 “9종 + Article 1샘플 = 10개 페이지”이고 표에 P-011 FAQ가 없음. 같은 문서 §3.11의 11페이지/P-011 합류와 충돌.
- ECP-35 minor — `docs/core/PAGE_TYPES.md` P-013/P-014 상세에 “M0 어드민 화면 수 6개 유지” 잔재가 남아 §6의 7개와 충돌.

## acceptance 판정
- major 1건이 남아 plan v1.0 acceptance commit은 patch 후 재검증 권고.
