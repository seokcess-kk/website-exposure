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
session id: 019e39d5-f18b-7481-856b-74954be46d93
--------
user
Review `docs/decisions/EAT_CONTENT_PLAN.md` v0.3 cycle 3.

## Context

Cycle 2 had 8 findings — all patched in v0.3 by **applying docs cascade in plan acceptance commit** (LOCATION_LEGAL/PUBLIC_SITE_RENDER pattern):

Files patched:
- `docs/decisions/EAT_CONTENT_PLAN.md` v0.3 — plan v1.0 acceptance vs code v1.0 cycle 분리 marker + 변경 이력
- `docs/core/DATA_MODEL.md` — § 1.1 인벤토리 25 contracts · § 4 C-10 enum +2 · C-12 풀명세 + C-22 marker + C-24/25 신규 풀명세
- `docs/core/PAGE_TYPES.md` — § 1.1 P-011 M0 ✅ · § 6 11페이지
- `docs/core/SCHEMA_MAPPING.md` — § 2 ScholarlyArticle/VideoObject 카탈로그
- `docs/core/CONTENT_STANDARDS.md` — § 7.1.1.2 ContentType 예외 표
- `docs/admin/ARCHITECTURE.md` — § 3.11 11페이지
- `docs/decisions/M0_BUILD_EXPORT_PLAN.md` — § 2.2 EAT 4 entity 변환 표
- `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` — § 9.3 PSR-DEFER-11/15 ✅ 해소
- `packages/migrations-runner/src/manifest.ts` — orderedMigrations 16 entry

ECP-26 (Article detail SQL JOIN) 는 **EAT_CONTENT code v1.0 cycle 분리** — plan acceptance commit 외.

## Task

cycle 2 의 8개 patch 각각 검증 + 새 finding 발견. 짧게 line 단위 인용.

## Output (한국어 · 간결)

```
# EAT_CONTENT_PLAN v0.3 — cycle 3 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴: cycle1=22 → cycle2=8 → cycle3=N

## cycle 2 patch 검증
- ECP-23 / 24 / 25 / 26 (code v1.0 cycle 분리) / 27 / 28 / 29 / 30 각각 PASS/FAIL/PARTIAL + 한 줄 근거

## new findings (있을 경우 ECP-31+)

## acceptance 판정
- plan v1.0 acceptance commit 진행 가능 여부
```

cycle 2 의 8건이 모두 PASS 이고 새 blocking/major 0 이면 closeableAfterPatch=true. minor 만 잔존이면 다음 cycle 짧게.

codex
요청하신 형식으로 문서 리뷰를 진행하겠습니다. 먼저 관련 파일의 현재 내용을 line 번호와 함께 읽어 cycle 2 패치 반영 여부를 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/core/PAGE_TYPES.md | ForEach-Object { $i++; '"'{0,5}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/decisions/EAT_CONTENT_PLAN.md | ForEach-Object { $i++; '"'{0,5}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/core/DATA_MODEL.md | ForEach-Object { $i++; '"'{0,5}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure\apps\web
2026-05-18T06:46:32.762145Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m $i=0; [36;1mGet-Content docs/decisions/EAT_CONTENT_PLAN.md[0m | ForEach-Object …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot find path 'C:\Users\assag\solution\website-exposure\apps\web\docs\decisions\EAT_CONTENT_PLAN.md' because it does not exist.[0m

 exited 1 in 833ms:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m $i=0; [36;1mGet-Content docs/decisions/EAT_CONTENT_PLAN.md[0m | ForEach-Object …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot find path 'C:\Users\assag\solution\website-exposure\apps\web\docs\decisions\EAT_CONTENT_PLAN.md' because it does not exist.[0m

2026-05-18T06:46:32.778669Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.9 seconds
Output:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m $i=0; [36;1mGet-Content docs/core/PAGE_TYPES.md[0m | ForEach-Object { $i++; '{ …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot find path 'C:\Users\assag\solution\website-exposure\apps\web\docs\core\PAGE_TYPES.md' because it does not exist.[0m

 exited 1 in 852ms:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m $i=0; [36;1mGet-Content docs/core/PAGE_TYPES.md[0m | ForEach-Object { $i++; '{ …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot find path 'C:\Users\assag\solution\website-exposure\apps\web\docs\core\PAGE_TYPES.md' because it does not exist.[0m

 exited 1 in 857ms:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m $i=0; [36;1mGet-Content docs/core/DATA_MODEL.md[0m | ForEach-Object { $i++; '{ …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot find path 'C:\Users\assag\solution\website-exposure\apps\web\docs\core\DATA_MODEL.md' because it does not exist.[0m

2026-05-18T06:46:32.783148Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.9 seconds
Output:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m $i=0; [36;1mGet-Content docs/core/DATA_MODEL.md[0m | ForEach-Object { $i++; '{ …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot find path 'C:\Users\assag\solution\website-exposure\apps\web\docs\core\DATA_MODEL.md' because it does not exist.[0m

codex
현재 작업 디렉터리 기준에는 `docs/`가 없습니다. 상위 루트에 문서가 있는 구조로 보이니, 저장소 루트와 파일 위치를 먼저 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg --files -g EAT_CONTENT_PLAN.md -g DATA_MODEL.md -g PAGE_TYPES.md -g SCHEMA_MAPPING.md -g CONTENT_STANDARDS.md -g ARCHITECTURE.md -g M0_BUILD_EXPORT_PLAN.md -g PUBLIC_SITE_RENDER_PLAN.md -g manifest.ts' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'git rev-parse --show-toplevel' in C:\Users\assag\solution\website-exposure\apps\web
2026-05-18T06:46:38.725881Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.7 seconds
Output:

 exited 1 in 676ms:
 succeeded in 666ms:
C:/Users/assag/solution/website-exposure

codex
저장소 루트는 `C:\Users\assag\solution\website-exposure`입니다. 해당 루트 기준으로 문서를 읽어 패치별 근거를 대조하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/decisions/EAT_CONTENT_PLAN.md | ForEach-Object { $i++; '"'{0,5}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/core/DATA_MODEL.md | ForEach-Object { $i++; '"'{0,5}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/core/PAGE_TYPES.md | ForEach-Object { $i++; '"'{0,5}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
 succeeded in 722ms:
    1: # E-A-T Content 확장 plan (v0.3·draft·2026-05-18)
    2: 
    3: > **상태**: **v0.3 (draft)** — Codex 자동 비평 cycle 1 (22) + cycle 2 (8) 누계 **30 findings 전건 수용 patch**. PUBLIC_SITE_RENDER code v1.0 acceptance 직후 진입하는 첫 신규 콘텐츠 타입 plan. Lovable 사이트 (다이트한의원 부평점) 의 콘텐츠 종류 매핑에서 우리 명세에 누락된 부분 (논문·미디어·FAQ 풀명세 + ArticleCategory 실 운영) 을 Core 계약으로 확정한다.
    4: 
    5: > **plan v1.0 acceptance commit vs EAT_CONTENT code v1.0 cycle 분리 (cycle 2 ECP-23~30 정정 — LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합)**:
    6: > - **plan acceptance commit 안 cascade (docs only · acceptance precondition)**: 본 plan + DATA_MODEL § 1.1 인벤토리 25 + § 4 C-10 enum +2 + C-12 풀명세 + C-22 marker + C-24/25 신규 풀명세 + PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 11페이지 + SCHEMA_MAPPING § 2 ScholarlyArticle/VideoObject 카탈로그 + CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 + ARCH § 3.11 11 페이지 + M0_BUILD_EXPORT § 2.2 4 entity 변환 표 + PUBLIC_SITE_RENDER PSR-DEFER-11/15 해소 marker + manifest.ts orderedMigrations 16 entry (spec only — runner 코드는 LL-DEFER-20).
    7: > - **EAT_CONTENT code v1.0 cycle 안 cascade (별 사이클 분리 · 실 코드)**: migrations 6 (C0009/10/11/12/13 + D0014) · Drizzle schema v0.4 · zod schema · 어드민 폼 4종 + route 4종 + dashboard · JSON-LD entities/builders 확장 · P-011 FAQ public page · Doctor/About graph 확장 · Article detail SQL JOIN article_category · sitemap.xml 확장 · seed.ts default category · renderMarkdownToPlainText helper · vitest scenario 24~36.
    8: 
    9: 본 plan 의 목적: **E-A-T (Expertise·Authoritativeness·Trustworthiness)** 시그널을 검색·AI 답변에 보내기 위해 Core 콘텐츠 모델을 다음과 같이 확장한다:
   10: 
   11: | Entity | 신규 vs 합류 | DATA_MODEL ID |
   12: |---|---|---|
   13: | Publication | **신규** | C-24 (현 인벤토리 빈 슬롯) |
   14: | MediaAppearance | **신규** | C-25 (인벤토리 추가) |
   15: | Faq | **C-12 풀명세 합류 + M0 합류** (기존 간략 명세 → 풀명세) | C-12 (기존) |
   16: | ArticleCategory | **C-22 실 운영 합류 + M0 합류** (기존 풀명세 — v0.1 단계 flat 1-level minimal, parentCategory/pillar 등 optional 컬럼은 DB 추가하되 어드민 UI/공개 렌더는 v0.1 미사용) | C-22 (기존) |
   17: 
   18: 모든 entity 는 schema.org JSON-LD 로 출력되어 P-004 Doctor Profile · P-002 About · P-011 FAQ 페이지에 합류한다.
   19: 
   20: > **scope limit (EC-INTRO-01)** — 본 plan 은 다음만 다룬다: (1) C-24 Publication · C-25 MediaAppearance 신규 + C-12 Faq · C-22 ArticleCategory 합류. (2) DATA_MODEL C-10 `contentType` enum cascade (+Publication +MediaAppearance). (3) PSR-DEFER-11(부분: FAQ P-011) · PSR-DEFER-15 (Article category required) 해소. (4) PUBLIC_SITE_RENDER code v1.0 의 D0011 GRANT cascade (D0014). **본 plan 외**: Inquiry (1:1 상담 게시판 — PIPA 큰 결정), Reviews/Pricing High-risk commercial, Publication/MediaAppearance 별도 페이지 (모두 EC-DEFER).
   21: 
   22: ## SoT
   23: 
   24: - `docs/core/DATA_MODEL.md` v0.9 — § 1.1 인벤토리 (23 → 25 contracts) · § 4 C-12 / C-22 풀명세 + C-24 Publication · C-25 MediaAppearance 신규 (EC-CASCADE-01) · § 4 C-10 `contentType` enum 확장 (+ Publication +MediaAppearance) · § 4 C-04 Article `category` required 정합
   25: - `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ — M0 미합류 → 본 plan 합류 (EC-CASCADE-08)
   26: - `docs/core/SCHEMA_MAPPING.md` § 1.2 `@id` 패턴 · § 2 entity 카탈로그 (+ ScholarlyArticle, VideoObject) · § 3 P-011 FAQ graph (EC-CASCADE-02)
   27: - `docs/core/SEARCH_STANDARDIZATION.md` § 4.3 sitemap P-011 monthly 0.5
   28: - `docs/core/CONTENT_STANDARDS.md` v1.3 § 7.1.1.x — Publication/MediaAppearance 외부 인용 면제 · FAQ Q/A 광고 표현 검수 적용 (EC-CASCADE-03)
   29: - `docs/compliance/RISK_LEVELS.md` v1.1 § 2 — FAQ 자동 추론 대상 (의료 질문 = Medium/High 후보), Publication/MediaAppearance Low fixed
   30: - `docs/admin/ARCHITECTURE.md` § 3 — Vertical Slice 안 P-011 FAQ 페이지 합류 marker (EC-CASCADE-09)
   31: - `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v1.0 § 1.3 PSR-DEFER-11 (FAQ 부분 해소) + PSR-DEFER-15 (Article category 해소) (EC-CASCADE-07)
   32: - `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — LegalDocument 패턴 (status='draft' 단계 + RLS published only) 재사용
   33: - `docs/decisions/M0_BUILD_EXPORT_PLAN.md` v0.1 § 2.1 — 신규 entity Git 출력 cascade (EC-CASCADE-04)
   34: - `packages/db/migrations/D0011_public_reader.sql` — D0014 cascade target (EC-CASCADE-05)
   35: - `packages/migrations-runner/src/manifest.ts` — 16 단계 (현 10 + C0009/10/11/12/13 + D0014) (EC-CASCADE-06)
   36: - 기존 packages 실 시그니처:
   37:   - `packages/core-content/src/schema.ts` v0.3 (Drizzle SoT)
   38:   - `apps/web/src/components/forms/{DoctorProfileForm, TreatmentPageForm, ArticleForm}.tsx` (3 entity 폼 패턴)
   39:   - `apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts` (server action 패턴)
   40:   - `apps/web/src/lib/json-ld/{entities, builders}.ts` (JSON-LD generator)
   41:   - `apps/web/src/lib/json-ld/__tests__/validate.ts` (cross-page allowlist + tenant base path)
   42:   - `apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx` (현재 fallback `general` 만 — 본 plan 합류 후 DB join)
   43: 
   44: ## 1. 목적과 범위
   45: 
   46: ### 1.1 목적
   47: 
   48: - **E-A-T 시그널 강화** — Doctor Profile 의 학술 권위(Publication) 와 미디어 권위(MediaAppearance) 가 schema.org `ScholarlyArticle` / `VideoObject` 로 표현되어 검색 entity recognition 강화.
   49: - **AEO 직접 매핑** — FAQ 의 `FAQPage` JSON-LD 는 네이버 스마트블록 · AI Overview · 답변 봇에 직접 인용 가능.
   50: - **운영자 입력 UX 표준화** — M0 3-entity (Doctor/Treatment/Article) 폼 패턴 재사용.
   51: - **Article category 필수화 (PSR-DEFER-15 해소)** — C-04 Article `category Ref<C-22>` required SoT 정합 — DB NOT NULL 전환 + URL `[category]` 실 DB join.
   52: 
   53: ### 1.2 범위 (포함) — cycle 1 ECP-01·02·03·04·07 정정
   54: 
   55: | 항목 | 비고 |
   56: |---|---|
   57: | C-24 Publication 신규 entity | 외부 학술 자료 인용 · authors[]·journal·publishedDate·doi/pubmedId·url·summary·authorDoctorId(optional FK to doctor_profile). DATA_MODEL § 1.1 인벤토리 25 contracts (cycle 1 ECP-01 정정) |
   58: | C-25 MediaAppearance 신규 entity | 미디어 출연 · channelName·channelType·publishedDate·durationSeconds·url·thumbnailUrl·summary·authorDoctorId(optional). 모든 channel_type 을 schema.org `VideoObject` 로 단일화 v0.1 (cycle 1 ECP-05 정합) — BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 신설 (M1 cascade) |
   59: | C-12 Faq 풀명세 합류 | DATA_MODEL § 5 간략 명세를 풀명세로 (EC-CASCADE-01) + M0 합류 |
   60: | C-22 ArticleCategory 실 운영 합류 (PSR-DEFER-15 해소) | DATA_MODEL § 4 기존 풀명세 (parentCategory·pillar·coverImageUrl·seoMeta·articleTypeDefault) — DB 컬럼은 모두 추가 (optional · v0.1 nullable). 어드민 UI/공개 렌더는 v0.1 minimal (slug·name·displayOrder만 노출 · 나머지 EC-DEFER-10 M1) |
   61: | C-04 Article.category required (PSR-DEFER-15 해소 · cycle 1 ECP-03 정정) | `article.category_id` NOT NULL — staged migration: (1) ADD COLUMN nullable (2) seed default `general` (3) backfill (4) SET NOT NULL. 단일 migration 안 4 step |
   62: | C-10 contentType enum cascade (cycle 1 ECP-07 정정) | 기존 enum 15종 + `Publication` + `MediaAppearance` = 17종. FAQ · ArticleCategory · LegalDocument · Feature 는 이미 enum 안 (토큰 그대로 사용 — `FAQ` 대문자) |
   63: | 마이그레이션 5건 + D0014 | C0009 article_category · C0010 publication · C0011 media_appearance · C0012 faq · C0013 article_category_fk + backfill + SET NOT NULL · D0014 public_reader_eat |
   64: | D0014 GRANT + per-table policy (cycle 1 ECP-16 정정) | D0011 패턴 정합 — publication/media_appearance/faq 는 published only · article_category 는 instance_id only (taxonomy public 의도 명시 — 분류 자체는 RLS instance scope · status 없음) |
   65: | 어드민 폼 4종 (CRUD) | PublicationForm · MediaAppearanceForm · FaqForm · ArticleCategoryForm. 패턴 = M0 3-entity 폼 + REVIEW_WORKFLOW status 9-state |
   66: | status zod enum subset (cycle 1 ECP-10·11 정정) | v0.1 단계 status zod = `z.enum(['draft'])` 만 — compliance-assistant 합류 (EC-DEFER-05) 전까지 모든 4 entity 어드민 폼에서 published 차단. **FAQ 도 published 차단** (위험도 자동 추론 합류 전 Medium/High 자동 발행 회피). LegalDocument 패턴 정합 |
   67: | 공개 페이지 P-011 FAQ 신설 (cycle 1 ECP-12 정정 — PAGE_TYPES M0 합류 EC-CASCADE-08 acceptance precondition 격상) | `/<slug>/faq` route — FaqList + FAQPage JSON-LD |
   68: | Doctor Profile (P-004) 확장 | Publications + MediaAppearances **graph 안 풀 entity 출력** (cycle 1 ECP-06·13 정정 — cross-page ref + allowlist 옵션 폐기). `@id` = fragment-scoped: `${doctorProfileUrl}#publication-{slug}` · `${doctorProfileUrl}#video-{slug}` |
   69: | About (P-002) 확장 | Doctor 외 author_doctor_id IS NULL 인 clinic-level Publications + MediaAppearances. graph 안 풀 entity. `@id` = `${aboutUrl}#publication-{slug}` · `${aboutUrl}#video-{slug}` |
   70: | MedicalClinic.subjectOf 통일 (cycle 1 ECP-15 정정) | About P-002 의 publication/media reference 는 `MedicalClinic.subjectOf` array (Organization 미사용 단일 결정) |
   71: | Article URL category 실 join (PSR-DEFER-15 해소 · cycle 1 ECP-17 정정) | `insights/[category]/[slug]/page.tsx` 의 SQL 을 `article JOIN article_category ON article.category_id = article_category.id WHERE article_category.slug = ${params.category}` 로 patch |
   72: | JSON-LD generator 추가 | ScholarlyArticle · VideoObject (모든 channel_type) · FAQPage · Question · Answer + graph 안 풀 entity 출력 |
   73: | sitemap.xml 확장 | P-011 FAQ entry (changefreq monthly · priority 0.5 · lastmod `MAX(faq.updated_at)`) — published row 0건이어도 페이지 포함 (cycle 1 ECP-21 정정) |
   74: | FAQ helper 2 종 (cycle 1 ECP-19 정정) | `renderMarkdownToHtml` (public HTML rendering · 기존) + 신규 `renderMarkdownToPlainText` (JSON-LD Answer text · strip + sanitize) |
   75: | Markdown sanitize rel 통일 (cycle 1 ECP-20 정정) | 외부 링크 `nofollow noopener noreferrer` (PSR-20 정합 — Publication/Media external link 도 동일) |
   76: | PSR-CASCADE-04 D0011 GRANT cascade | publication · media_appearance · faq · article_category 4 table — D0014 신규 migration |
   77: | CONTENT_STANDARDS § 7.1.1.x 확장 | Publication/MediaAppearance 외부 인용 면제 · FAQ Q/A 광고 표현 검수 적용 |
   78: | DOI validation 통일 (cycle 1 ECP-08 정정) | DB CHECK regex `^10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$` 와 zod schema 동일 anchored regex |
   79: | authors DEFAULT 제거 (cycle 1 ECP-18 정정) | `authors JSONB NOT NULL` (DEFAULT `[]` 삭제) + min 1 CHECK + 어드민 폼에서 required |
   80: 
   81: ### 1.3 비범위 (defer)
   82: 
   83: | 항목 | Defer to | marker |
   84: |---|---|---|
   85: | Inquiry (1:1 상담 게시판) 신규 entity | 별 cycle — 회원 가입 / 익명 처리 / PIPA 보관 정책 큰 결정 | EC-DEFER-01 |
   86: | Publication / MediaAppearance 별도 페이지 (P-Publications · P-MediaAppearances) | M1 Phase Alpha — 학술 인용·미디어 출연 페이지 자체 색인 가치 평가 후 | EC-DEFER-02 |
   87: | Publication PDF / DOI 자동 메타데이터 fetch (CrossRef API) | M1 Phase Alpha — 외부 API provider gate | EC-DEFER-03 |
   88: | MediaAppearance 동영상 embed (YouTube iframe 등) | M1 Phase Alpha — CSP 결정 | EC-DEFER-04 |
   89: | FAQ 자동 검수 (compliance-assistant + RiskRule + RiskInference) 완전 통합 | compliance-assistant Feature 본 구현 cascade | EC-DEFER-05 |
   90: | FAQ 다국어 (`inLanguage`) | M3 다국어 cascade | EC-DEFER-06 |
   91: | Publication / MediaAppearance 검수 워크플로우 (status='review-queued' 전이 + ComplianceRecord pre-publish) | LL-DEFER-01 patterns 동일 — compliance-assistant + ComplianceRecord 합류 | EC-DEFER-07 |
   92: | Reviews (P-101 후기) · Pricing (P-102) High-risk commercial 페이지 | M1+ 별 plan — MEDICAL_AD_COMPLIANCE_COMMON 검토 후 | EC-DEFER-08 |
   93: | FAQ.metadata.featuredOnHome — Home 안 inline 표시 | M1 Phase Alpha | EC-DEFER-09 |
   94: | ArticleCategory 트리/계층 (parentCategory) · 메타 컬럼 (pillar · coverImageUrl · seoMeta · articleTypeDefault) 어드민 UI/공개 렌더 사용 | M1 Phase Alpha — v0.1 DB 컬럼은 추가하되 UI/렌더 미사용 | EC-DEFER-10 |
   95: | MediaAppearance channel_type 별 schema.org `@type` 분기 (broadcast → BroadcastEvent · press → NewsArticle) | M1 Phase Alpha — v0.1 모두 VideoObject 단일화 | EC-DEFER-11 |
   96: | 4 entity 어드민 published 발행 (status='published' 전이) | EC-DEFER-05 와 동일 시점 — compliance-assistant 합류 + Faq risk_level 자동 추론 후 | EC-DEFER-12 |
   97: 
   98: ## 2. 데이터 모델 결정
   99: 
  100: ### 2.1 C-22 ArticleCategory 실 DB 구현 (EC-SCHEMA-01) — cycle 1 ECP-02 정정
  101: 
  102: DATA_MODEL § 4 C-22 풀명세 전체 컬럼을 DB 에 추가 (v0.1 단계 어드민 UI 는 minimal — slug·name·displayOrder 만 노출 · 나머지 EC-DEFER-10):
  103: 
  104: ```sql
  105: -- packages/core-content/migrations/C0009_article_category.sql
  106: 
  107: CREATE TABLE article_category (
  108:   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  109:   instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  110:   slug TEXT NOT NULL,
  111:   name TEXT NOT NULL,
  112:   description TEXT,
  113:   pillar TEXT,                                  -- DATA_MODEL C-22 풀명세 · v0.1 nullable (EC-DEFER-10)
  114:   parent_category_id UUID,                       -- 계층 구조 · v0.1 nullable (EC-DEFER-10) · same-tenant composite FK
  115:   cover_image_url TEXT,                          -- v0.1 nullable
  116:   seo_meta JSONB,                                -- C-06 PageMeta · v0.1 nullable
  117:   display_order INTEGER NOT NULL DEFAULT 0,
  118:   article_type_default TEXT,                     -- v0.1 nullable
  119:   metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  120:   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  121:   updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  122:   CONSTRAINT article_category_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
  123:   CONSTRAINT article_category_name_length CHECK (length(name) BETWEEN 1 AND 50),  -- C-22 SoT 1~50
  124:   CONSTRAINT article_category_description_length CHECK (description IS NULL OR length(description) BETWEEN 80 AND 200),
  125:   CONSTRAINT article_category_cover_image_url_format CHECK (cover_image_url IS NULL OR cover_image_url ~ '^https?://'),
  126:   CONSTRAINT article_category_instance_slug_unique UNIQUE (instance_id, slug),
  127:   CONSTRAINT article_category_instance_id_unique UNIQUE (instance_id, id),
  128:   CONSTRAINT article_category_parent_fk FOREIGN KEY (instance_id, parent_category_id)
  129:     REFERENCES article_category (instance_id, id) ON DELETE NO ACTION
  130: );
  131: 
  132: CREATE INDEX article_category_instance_idx ON article_category (instance_id);
  133: CREATE INDEX article_category_order_idx ON article_category (instance_id, display_order, id);
  134: CREATE INDEX article_category_parent_idx ON article_category (instance_id, parent_category_id)
  135:   WHERE parent_category_id IS NOT NULL;
  136: 
  137: ALTER TABLE article_category ENABLE ROW LEVEL SECURITY;
  138: ALTER TABLE article_category FORCE ROW LEVEL SECURITY;
  139: CREATE POLICY tenant_isolation ON article_category FOR ALL TO app_tenant_user
  140:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  141:   WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
  142: GRANT SELECT, INSERT, UPDATE, DELETE ON article_category TO app_tenant_user;
  143: ```
  144: 
  145: **결정**:
  146: - (EC-SCHEMA-02) C-22 풀명세 전체 컬럼 추가. v0.1 어드민 UI minimal — slug·name·displayOrder 만 노출. parentCategory·pillar·coverImageUrl·seoMeta·articleTypeDefault 는 DB 컬럼만 존재 + EC-DEFER-10 marker.
  147: - (EC-SCHEMA-03 · cycle 1 ECP-09 정정) **default `general` ArticleCategory seed 위치 = `apps/web/src/seed.ts`** — instance 생성 시 자동 INSERT (`{slug: 'general', name: '일반', display_order: 0}`). 기존 instance 가 있을 때는 backfill 마이그레이션 (C0013 안에서 INSERT IF NOT EXISTS) 으로 보장. C0013 dependsOn = article_category + article.
  148: - (EC-SCHEMA-04) flat 1-level 운영 v0.1 — `parent_category_id IS NULL` 인 row 만 어드민 UI 노출 (DB 자체는 self-referencing FK 허용).
  149: 
  150: ### 2.2 C-04 Article.category_id required — PSR-DEFER-15 해소 (EC-SCHEMA-05) — cycle 1 ECP-03 정정
  151: 
  152: ```sql
  153: -- packages/core-content/migrations/C0013_article_category_fk.sql
  154: 
  155: -- (1) ADD COLUMN nullable
  156: ALTER TABLE article ADD COLUMN category_id UUID;
  157: 
  158: -- (2) instance 별 default `general` ArticleCategory row INSERT (기존 instance backfill — idempotent)
  159: INSERT INTO article_category (instance_id, slug, name, display_order)
  160: SELECT i.id, 'general', '일반', 0
  161: FROM instance i
  162: WHERE NOT EXISTS (
  163:   SELECT 1 FROM article_category ac
  164:   WHERE ac.instance_id = i.id AND ac.slug = 'general'
  165: );
  166: 
  167: -- (3) 기존 article row 의 category_id backfill (`general` ArticleCategory row 의 id)
  168: UPDATE article a
  169: SET category_id = ac.id
  170: FROM article_category ac
  171: WHERE a.instance_id = ac.instance_id
  172:   AND ac.slug = 'general'
  173:   AND a.category_id IS NULL;
  174: 
  175: -- (4) SET NOT NULL
  176: ALTER TABLE article ALTER COLUMN category_id SET NOT NULL;
  177: 
  178: -- (5) composite FK (same-tenant)
  179: ALTER TABLE article ADD CONSTRAINT article_category_fk
  180:   FOREIGN KEY (instance_id, category_id)
  181:   REFERENCES article_category (instance_id, id)
  182:   ON DELETE NO ACTION;
  183: 
  184: CREATE INDEX article_category_idx ON article (instance_id, category_id);
  185: ```
  186: 
  187: **결정**:
  188: - (EC-SCHEMA-06) staged migration 안 4 단계 모두 단일 migration 으로 처리. acceptance commit 안 backfill 완성.
  189: - (EC-SCHEMA-07) C-04 Article SoT `category Ref<C-22>` required 정합.
  190: 
  191: ### 2.3 C-24 `publication` 신규 table (EC-SCHEMA-08)
  192: 
  193: ```sql
  194: -- packages/core-content/migrations/C0010_publication.sql
  195: 
  196: CREATE TABLE publication (
  197:   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  198:   instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  199:   slug TEXT NOT NULL,
  200:   title TEXT NOT NULL,
  201:   authors JSONB NOT NULL,                       -- cycle 1 ECP-18 정정: DEFAULT 제거. authors min 1 CHECK 와 정합
  202:   journal TEXT,
  203:   published_date DATE NOT NULL,                  -- 학술지 게재일
  204:   doi TEXT,
  205:   pubmed_id TEXT,
  206:   url TEXT NOT NULL,
  207:   thumbnail_url TEXT,
  208:   summary TEXT NOT NULL,
  209:   author_doctor_id UUID,
  210:   status content_publication_status NOT NULL DEFAULT 'draft',
  211:   risk_level risk_level NOT NULL DEFAULT 'Low',
  212:   published_at TIMESTAMPTZ,
  213:   metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  214:   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  215:   updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  216:   CONSTRAINT publication_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,99}$'),
  217:   CONSTRAINT publication_title_length CHECK (length(title) BETWEEN 1 AND 300),
  218:   CONSTRAINT publication_summary_length CHECK (length(summary) BETWEEN 50 AND 300),
  219:   CONSTRAINT publication_url_format CHECK (url ~ '^https?://'),
  220:   CONSTRAINT publication_doi_format CHECK (doi IS NULL OR doi ~ '^10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$'),
  221:   CONSTRAINT publication_pubmed_id_format CHECK (pubmed_id IS NULL OR pubmed_id ~ '^[0-9]{1,9}$'),
  222:   CONSTRAINT publication_authors_array CHECK (jsonb_typeof(authors) = 'array' AND jsonb_array_length(authors) >= 1),
  223:   CONSTRAINT publication_risk_level_low_only CHECK (risk_level = 'Low'),
  224:   CONSTRAINT publication_published_requires_at CHECK (status <> 'published' OR published_at IS NOT NULL),
  225:   CONSTRAINT publication_instance_slug_unique UNIQUE (instance_id, slug),
  226:   CONSTRAINT publication_instance_id_unique UNIQUE (instance_id, id),
  227:   CONSTRAINT publication_author_doctor_fk FOREIGN KEY (instance_id, author_doctor_id)
  228:     REFERENCES doctor_profile (instance_id, id) ON DELETE NO ACTION
  229: );
  230: 
  231: CREATE INDEX publication_instance_idx ON publication (instance_id);
  232: CREATE INDEX publication_status_idx ON publication (instance_id, status);
  233: CREATE INDEX publication_published_idx ON publication (instance_id, published_at)
  234:   WHERE status = 'published' AND published_at IS NOT NULL;
  235: CREATE INDEX publication_author_idx ON publication (instance_id, author_doctor_id)
  236:   WHERE author_doctor_id IS NOT NULL;
  237: 
  238: ALTER TABLE publication ENABLE ROW LEVEL SECURITY;
  239: ALTER TABLE publication FORCE ROW LEVEL SECURITY;
  240: CREATE POLICY tenant_isolation ON publication FOR ALL TO app_tenant_user
  241:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  242:   WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
  243: GRANT SELECT, INSERT, UPDATE, DELETE ON publication TO app_tenant_user;
  244: ```
  245: 
  246: **결정**:
  247: - (EC-SCHEMA-09 · cycle 1 ECP-18 정정) `authors JSONB NOT NULL` (DEFAULT 제거) — `authors[]` min 1 CHECK 정합. INSERT 시 필수.
  248: - (EC-SCHEMA-10) `risk_level='Low'` CHECK 고정 — Publication 외부 인용 entity, Low 외 등급 불필요. EC-DEFER-07 까지.
  249: 
  250: ### 2.4 C-25 `media_appearance` 신규 table (EC-SCHEMA-11) — cycle 1 ECP-05 정합
  251: 
  252: ```sql
  253: -- packages/core-content/migrations/C0011_media_appearance.sql
  254: 
  255: CREATE TYPE media_channel_type AS ENUM ('broadcast', 'youtube', 'podcast', 'press');
  256: 
  257: CREATE TABLE media_appearance (
  258:   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  259:   instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  260:   slug TEXT NOT NULL,
  261:   title TEXT NOT NULL,
  262:   channel_name TEXT NOT NULL,
  263:   channel_type media_channel_type NOT NULL,
  264:   published_date DATE NOT NULL,
  265:   duration_seconds INTEGER,
  266:   url TEXT NOT NULL,
  267:   thumbnail_url TEXT,
  268:   summary TEXT NOT NULL,
  269:   author_doctor_id UUID,
  270:   status content_publication_status NOT NULL DEFAULT 'draft',
  271:   risk_level risk_level NOT NULL DEFAULT 'Low',
  272:   published_at TIMESTAMPTZ,
  273:   metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  274:   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  275:   updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  276:   CONSTRAINT media_appearance_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,99}$'),
  277:   CONSTRAINT media_appearance_title_length CHECK (length(title) BETWEEN 1 AND 300),
  278:   CONSTRAINT media_appearance_summary_length CHECK (length(summary) BETWEEN 50 AND 300),
  279:   CONSTRAINT media_appearance_url_format CHECK (url ~ '^https?://'),
  280:   CONSTRAINT media_appearance_duration_positive CHECK (duration_seconds IS NULL OR duration_seconds > 0),
  281:   CONSTRAINT media_appearance_risk_level_low_only CHECK (risk_level = 'Low'),
  282:   CONSTRAINT media_appearance_published_requires_at CHECK (status <> 'published' OR published_at IS NOT NULL),
  283:   CONSTRAINT media_appearance_instance_slug_unique UNIQUE (instance_id, slug),
  284:   CONSTRAINT media_appearance_instance_id_unique UNIQUE (instance_id, id),
  285:   CONSTRAINT media_appearance_author_doctor_fk FOREIGN KEY (instance_id, author_doctor_id)
  286:     REFERENCES doctor_profile (instance_id, id) ON DELETE NO ACTION
  287: );
  288: 
  289: CREATE INDEX media_appearance_instance_idx ON media_appearance (instance_id);
  290: CREATE INDEX media_appearance_status_idx ON media_appearance (instance_id, status);
  291: CREATE INDEX media_appearance_published_idx ON media_appearance (instance_id, published_at)
  292:   WHERE status = 'published' AND published_at IS NOT NULL;
  293: CREATE INDEX media_appearance_author_idx ON media_appearance (instance_id, author_doctor_id)
  294:   WHERE author_doctor_id IS NOT NULL;
  295: 
  296: ALTER TABLE media_appearance ENABLE ROW LEVEL SECURITY;
  297: ALTER TABLE media_appearance FORCE ROW LEVEL SECURITY;
  298: CREATE POLICY tenant_isolation ON media_appearance FOR ALL TO app_tenant_user
  299:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  300:   WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
  301: GRANT SELECT, INSERT, UPDATE, DELETE ON media_appearance TO app_tenant_user;
  302: ```
  303: 
  304: **결정**:
  305: - (EC-SCHEMA-12 · cycle 1 ECP-05 정합) `media_channel_type` enum 4종 (broadcast/youtube/podcast/press) — DB column 자체는 4종 모두 허용. **JSON-LD `@type` 매핑은 v0.1 단계 모든 4종 → `VideoObject` 단일화**. fragment 도 `#video-{slug}` 단일. BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1 cascade).
  306: 
  307: ### 2.5 C-12 `faq` 풀명세 합류 신규 table (EC-SCHEMA-13)
  308: 
  309: ```sql
  310: -- packages/core-content/migrations/C0012_faq.sql
  311: 
  312: CREATE TABLE faq (
  313:   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  314:   instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  315:   slug TEXT NOT NULL,
  316:   question TEXT NOT NULL,
  317:   answer TEXT NOT NULL,
  318:   display_order INTEGER NOT NULL DEFAULT 0,
  319:   category_id UUID,
  320:   related_treatment_id UUID,                    -- C-12 SoT 풀명세 · v0.1 nullable (EC-DEFER-09 와 함께 다음 cycle)
  321:   related_condition_id UUID,                     -- v0.1 nullable
  322:   author_doctor_id UUID,
  323:   status content_publication_status NOT NULL DEFAULT 'draft',
  324:   risk_level risk_level NOT NULL DEFAULT 'Low',
  325:   compliance_record_id UUID,                     -- compliance-assistant 합류 시 ref (EC-DEFER-05)
  326:   published_at TIMESTAMPTZ,
  327:   metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  328:   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  329:   updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  330:   CONSTRAINT faq_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,99}$'),
  331:   CONSTRAINT faq_question_length CHECK (length(question) BETWEEN 10 AND 200),
  332:   CONSTRAINT faq_answer_length CHECK (length(answer) BETWEEN 50 AND 2000),
  333:   CONSTRAINT faq_status_v01_limit CHECK (status = 'draft'),  -- cycle 1 ECP-10·11 정정: v0.1 published 차단
  334:   CONSTRAINT faq_published_at_null_v01 CHECK (published_at IS NULL),  -- v0.1 published 자체 차단
  335:   CONSTRAINT faq_instance_slug_unique UNIQUE (instance_id, slug),
  336:   CONSTRAINT faq_instance_id_unique UNIQUE (instance_id, id),
  337:   CONSTRAINT faq_category_fk FOREIGN KEY (instance_id, category_id)
  338:     REFERENCES article_category (instance_id, id) ON DELETE NO ACTION,
  339:   CONSTRAINT faq_author_doctor_fk FOREIGN KEY (instance_id, author_doctor_id)
  340:     REFERENCES doctor_profile (instance_id, id) ON DELETE NO ACTION,
  341:   CONSTRAINT faq_related_treatment_fk FOREIGN KEY (instance_id, related_treatment_id)
  342:     REFERENCES treatment_page (instance_id, id) ON DELETE NO ACTION
  343:   -- related_condition_id 의 medical_condition_page FK 는 C-11 합류 후 (M0 외 cascade)
  344: );
  345: 
  346: CREATE INDEX faq_instance_idx ON faq (instance_id);
  347: CREATE INDEX faq_status_idx ON faq (instance_id, status);
  348: CREATE INDEX faq_published_idx ON faq (instance_id, published_at, display_order)
  349:   WHERE status = 'published' AND published_at IS NOT NULL;
  350: CREATE INDEX faq_category_idx ON faq (instance_id, category_id)
  351:   WHERE category_id IS NOT NULL;
  352: 
  353: ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
  354: ALTER TABLE faq FORCE ROW LEVEL SECURITY;
  355: CREATE POLICY tenant_isolation ON faq FOR ALL TO app_tenant_user
  356:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  357:   WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
  358: GRANT SELECT, INSERT, UPDATE, DELETE ON faq TO app_tenant_user;
  359: ```
  360: 
  361: **결정**:
  362: - (EC-SCHEMA-14 · cycle 1 ECP-10·11 정정) v0.1 단계 `status='draft'` + `published_at IS NULL` CHECK 강제 — **published 자체 차단**. compliance-assistant + risk_level 자동 추론 합류 (EC-DEFER-05) 까지. LegalDocument LL-SCHEMA-03·LL-SCHEMA-04 패턴 정합.
  363: - (EC-SCHEMA-15) C-12 SoT 의 `relatedTreatment` · `relatedCondition` 필드 — DB nullable column 추가. v0.1 어드민 UI 미노출 (EC-DEFER-09 와 함께 다음 cycle).
  364: 
  365: ### 2.6 D0014 GRANT 확장 (EC-SCHEMA-16) — cycle 1 ECP-16 정정
  366: 
  367: ```sql
  368: -- packages/db/migrations/D0014_public_reader_eat.sql (EC-CASCADE-05)
  369: 
  370: -- article_category: taxonomy public 의도 — instance_id only USING (status 없음).
  371: --   분류 자체는 instance scope 안 모든 row public. 카테고리 자체에 published 개념 없음 (분류 메타).
  372: --   D0011 의 published-only 패턴과 다른 의도 — 본 plan 의 명시적 결정.
  373: GRANT SELECT ON article_category, publication, media_appearance, faq TO app_public_reader;
  374: 
  375: CREATE POLICY public_reader_article_category_select
  376:   ON article_category FOR SELECT TO app_public_reader
  377:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
  378: 
  379: CREATE POLICY public_reader_publication_select
  380:   ON publication FOR SELECT TO app_public_reader
  381:   USING (
  382:     instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
  383:     AND status = 'published'
  384:     AND published_at IS NOT NULL
  385:     AND published_at <= now()
  386:   );
  387: 
  388: CREATE POLICY public_reader_media_appearance_select
  389:   ON media_appearance FOR SELECT TO app_public_reader
  390:   USING (
  391:     instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
  392:     AND status = 'published'
  393:     AND published_at IS NOT NULL
  394:     AND published_at <= now()
  395:   );
  396: 
  397: -- FAQ: v0.1 단계 DB CHECK 가 status='draft' 만 허용. RLS published 만 SELECT → 자동 0 row → /faq 빈 페이지.
  398: --   LegalDocument 패턴 정합 (LOCATION_LEGAL § 3.2 PSR-DATA-07).
  399: CREATE POLICY public_reader_faq_select
  400:   ON faq FOR SELECT TO app_public_reader
  401:   USING (
  402:     instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
  403:     AND status = 'published'
  404:   );
  405: ```
  406: 
  407: **결정**:
  408: - (EC-SCHEMA-17) ArticleCategory taxonomy public — instance_id only RLS. 분류 자체는 status 없음. 운영 중 추가한 카테고리는 즉시 public_reader 에 노출. **본 결정의 정당성**: 카테고리는 콘텐츠 카탈로그 (Article/Faq 의 분류) — 자체 콘텐츠 게시는 아님. URL `/<slug>/insights/<category>/...` 가 작동하려면 모든 카테고리가 lookup 가능해야. status 게이트는 분류 미사용 단계에서도 article URL routing 차단 → 운영 부담. EC-DEFER-10 phase 의 어드민 UI 합류 시 `active` flag 추가 cascade.
  409: 
  410: ## 3. C-10 contentType enum cascade (EC-CASCADE-01 일부) — cycle 1 ECP-07 정정
  411: 
  412: DATA_MODEL § 4 C-10 `contentType` enum 확장:
  413: 
  414: | 현 v0.5 (15종) | v0.6 신규 (+2종 = 17종) |
  415: |---|---|
  416: | `ClinicProfile` · `DoctorProfile` · `TreatmentPage` · `MedicalConditionPage` · `Article` · `FAQ` · `ReviewPolicy` · `PricingPage` · `FacilitiesPage` · `NewsItem` · `ReservationPage` · `LocationProfile` · `ArticleCategory` · `LegalDocument` · `Feature` | + `Publication` + `MediaAppearance` |
  417: 
  418: **결정**:
  419: - (EC-CONTENT-04 · cycle 1 ECP-07 정정) audit emit `content-saved` payload 의 `contentType` 토큰 = SoT enum 그대로. FAQ 는 대문자 `FAQ`. Publication/MediaAppearance 는 PascalCase. ArticleCategory 도 PascalCase 기존.
  420: - (EC-CONTENT-05) ComplianceRecord (C-10) 의 `contentType` enum 확장 cascade.
  421: 
  422: ## 4. 어드민 폼 결정
  423: 
  424: ### 4.1 4 entity CRUD 구조 (EC-FORM-01)
  425: 
  426: | Entity | route prefix |
  427: |---|---|
  428: | ArticleCategory | `/admin/<slug>/categories` |
  429: | Publication | `/admin/<slug>/publications` |
  430: | MediaAppearance | `/admin/<slug>/media-appearances` |
  431: | Faq | `/admin/<slug>/faqs` |
  432: 
  433: ### 4.2 status zod enum subset — cycle 1 ECP-10·11 정정 (EC-FORM-02)
  434: 
  435: v0.1 단계 4 entity 어드민 폼 schema 에 명시:
  436: ```typescript
  437: const statusSchema = z.enum(['draft']);  // EC-DEFER-12 까지 — compliance-assistant + risk 자동 추론 합류 시점
  438: ```
  439: - form select 드롭다운 미노출 (단일 상태). server action 에서도 `status: 'draft'` 강제.
  440: - mapDbErrorToResult 안 `faq_status_v01_limit` · `faq_published_at_null_v01` 매핑 — formError "FAQ 발행은 compliance-assistant + 위험도 자동 추론 합류 후 가능합니다 (EC-DEFER-05·12)".
  441: - Publication / MediaAppearance 도 v0.1 단계 `status='draft'` 만 (DB CHECK 없이 form schema 만 — 향후 운영자가 직접 published 가능 marker EC-DEFER-12). 두 entity 의 외부 인용 자체는 risk Low fixed 이지만 v0.1 단계 통일 정책.
  442: 
  443: ### 4.3 zod schema 통합 SoT (EC-FORM-03)
  444: 
  445: `apps/web/src/lib/eat-content-schema.ts` 신설:
  446: - **Publication**: title (1~300) · authors (string[] min 1) · journal · publishedDate ISO · doi (DB 와 동일 anchored regex `^10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$`) · pubmedId (`^[0-9]{1,9}$`) · url (http(s)://) · summary (50~300) · authorDoctorId UUID (optional) · status `z.enum(['draft'])`
  447: - **MediaAppearance**: title · channelName · channelType enum 4종 · publishedDate · durationSeconds (positive int · optional) · url · summary · authorDoctorId · status `z.enum(['draft'])`
  448: - **Faq**: question (10~200) · answer (50~2000) · displayOrder int · categoryId UUID? · authorDoctorId? · relatedTreatmentId? · status `z.enum(['draft'])`
  449: - **ArticleCategory**: slug regex · name (1~50 — C-22 SoT) · description (80~200 optional) · displayOrder int. v0.1 미노출 컬럼 (pillar·parent_category_id·cover_image_url·seo_meta·article_type_default) 는 form schema 에 미포함.
  450: 
  451: ### 4.4 server action 패턴 (EC-FORM-04)
  452: 
  453: 각 entity 별 `actions.ts`:
  454: - `saveX(instanceSlug, _prev, formData)` — withSkeletonTx · zod parse · INSERT/UPSERT · audit emit (eventType `content-saved` · payload `{contentType: 'Publication'|'MediaAppearance'|'FAQ'|'ArticleCategory', slug, mode, status, originalSlug}`).
  455: - `deleteX(instanceSlug, slug)` — `content-deleted`.
  456: - isNextControlFlowError rethrow · mapDbErrorToResult · revalidatePath 패턴.
  457: 
  458: ### 4.5 dashboard cascade (EC-FORM-05)
  459: 
  460: `/admin/<slug>/page.tsx` 안 4 신규 entity card 추가 (count + new link). 기존 4 card (Clinic·Doctors·Treatments·Articles) + 4 신규 (Categories·Publications·Media·FAQs) = 총 8 card.
  461: 
  462: ## 5. 공개 페이지 렌더 결정 — cycle 1 ECP-06·13·15·17 정정
  463: 
  464: ### 5.1 P-011 FAQ 신규 페이지 (EC-RENDER-01) — PSR-DEFER-11 부분 해소
  465: 
  466: `apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx` 신설:
  467: - 데이터: `faq` published row (RLS 자동 — v0.1 단계 0 row 가능 · cycle 1 ECP-21 정정)
  468: - 표시: Q&A 카드 list. ORDER BY display_order ASC, id ASC. `<details>` collapsible.
  469: - **빈 페이지 처리 (cycle 1 ECP-21)**: 0 row 인 경우도 페이지 200 (404 아님) — sitemap.xml 포함 유지. 빈 상태 UI 표시 ("자주 묻는 질문이 아직 등록되지 않았습니다").
  470: - JSON-LD: schema.org `FAQPage` + `Question`/`Answer` array (cycle 1 ECP-19 정정 — `renderMarkdownToPlainText` helper 사용). 0 row 면 `mainEntity: []` 빈 array 출력.
  471: - Breadcrumb 추가.
  472: - Next metadata title: "자주 묻는 질문 | <clinic.name>".
  473: 
  474: ### 5.2 Doctor Profile (P-004) 확장 — graph 안 풀 entity 출력 (EC-RENDER-02) — cycle 1 ECP-06·13 정정
  475: 
  476: Doctor Profile 페이지 안 inline section:
  477: - **Publications** — `author_doctor_id = doctor.id` AND `status='published'` row. 카드 list — title · journal · publishedDate · authors[] · external link.
  478: - **MediaAppearances** — `author_doctor_id = doctor.id` AND `status='published'` row. 카드 list — title · channelName · channelType badge · publishedDate · thumbnailUrl · duration (HH:MM 형식) · external link.
  479: 
  480: **JSON-LD graph 결정 (cycle 1 ECP-06·13 정정)**:
  481: - Doctor Profile 페이지 graph 안에 Publication 풀 entity (ScholarlyArticle) 와 MediaAppearance 풀 entity (VideoObject) 출력 — graph self-contained.
  482: - **fragment-scoped `@id`**:
  483:   - Publication: `${siteBaseUrl}/doctors/${doctor.slug}#publication-${publication.slug}`
  484:   - MediaAppearance: `${siteBaseUrl}/doctors/${doctor.slug}#video-${media.slug}`
  485: - Physician.subjectOf 에 fragment ref array 출력 (graph 안 entity 들과 cross-ref).
  486: - cross-page allowlist 미사용 — 모든 ref 가 graph 안 entity 또는 외부 dereferenceable URL (publication.url / media.url).
  487: 
  488: ### 5.3 About (P-002) 확장 — MedicalClinic.subjectOf 단일 결정 (EC-RENDER-03) — cycle 1 ECP-15 정정
  489: 
  490: About 페이지 안 inline section:
  491: - **All Publications** — published row (author_doctor_id 무관). 모두 표시. 카드 list 동일.
  492: - **All MediaAppearances** — published row (author_doctor_id 무관). 모두 표시.
  493: 
  494: **JSON-LD graph 결정 (cycle 1 ECP-15 정정)**:
  495: - About 페이지 graph 안에 풀 entity 출력 — `MedicalClinic.subjectOf` array (publication·media). Organization.subjectOf 미사용 (단일 결정).
  496: - fragment-scoped `@id`:
  497:   - Publication: `${siteBaseUrl}/about#publication-${publication.slug}`
  498:   - MediaAppearance: `${siteBaseUrl}/about#video-${media.slug}`
  499: 
  500: ### 5.4 Article URL `[category]` 실 DB join — PSR-DEFER-15 해소 (EC-RENDER-04) — cycle 1 ECP-17 정정
  501: 
  502: `apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx` patch:
  503: - 현재 SQL: `SELECT ... FROM article WHERE slug = ${params.slug}` + `params.category !== "general"` 시 notFound
  504: - patch 후 SQL: 
  505:   ```sql
  506:   SELECT a.*, ac.slug AS category_slug
  507:     FROM article a
  508:     JOIN article_category ac ON a.category_id = ac.id AND a.instance_id = ac.instance_id
  509:    WHERE a.slug = ${params.slug}
  510:      AND ac.slug = ${params.category}
  511:    LIMIT 1
  512:   ```
  513: - 매칭 0 행 → notFound. params.category 가 article 의 실 category 와 일치해야 200.
  514: - sitemap.xml 안 article URL 생성 시 article + article_category join → `/insights/${category.slug}/${article.slug}` 출력 (현 `general` 하드코딩 → 실 category slug).
  515: 
  516: ### 5.5 Markdown helper 2 종 (EC-RENDER-05) — cycle 1 ECP-19 정정
  517: 
  518: `apps/web/src/lib/markdown.ts` 확장:
  519: - `renderMarkdownToHtml(markdown, hostOrigin)` — 기존 (sanitize-html · PSR-COMP-09 정합).
  520: - **신규 `renderMarkdownToPlainText(markdown)`** — Markdown → plain text strip (heading `#` 제거 · `*bold*` `_italic_` 제거 · link `[text](url)` → `text` · code/blockquote/list literal). JSON-LD `Answer.text` 용.
  521: - FAQ rendering 분기:
  522:   - public page (HTML): `renderMarkdownToHtml(answer, hostOrigin)`
  523:   - JSON-LD `FAQPage.mainEntity.Question.acceptedAnswer.text`: `renderMarkdownToPlainText(answer)`
  524: 
  525: ### 5.6 sitemap.xml 확장 (EC-RENDER-06) — cycle 1 ECP-21 정정
  526: 
  527: - P-011 `/<slug>/faq` 추가 — changefreq `monthly` · priority `0.5` (SEARCH_STANDARDIZATION § 4.3 정합).
  528: - lastmod: published faq 가 있으면 `MAX(faq.updated_at)`. 0 row 이면 `clinic.updated_at` fallback.
  529: - Publication / MediaAppearance 별도 페이지 없음 — sitemap 미추가 (EC-DEFER-02).
  530: - Article URL: 실 category slug 사용 (EC-RENDER-04 정합).
  531: 
  532: ### 5.7 외부 링크 rel 통일 (EC-RENDER-07) — cycle 1 ECP-20 정정
  533: 
  534: Publication / MediaAppearance 카드의 external `<a>` — `rel="nofollow noopener noreferrer"` + `target="_blank"` 통일 (PSR-20 정합).
  535: 
  536: ## 6. SCHEMA_MAPPING 결정 — cycle 1 ECP-05·06·13·14·15 정정 (EC-CASCADE-02)
  537: 
  538: ### 6.1 ScholarlyArticle entity (Publication)
  539: 
  540: ```json
  541: {
  542:   "@type": "ScholarlyArticle",
  543:   "@id": "{pageBaseUrl}#publication-{slug}",      // fragment-scoped (Doctor/About page 안)
  544:   "headline": "<title>",
  545:   "author": [{ "@type": "Person", "name": "<author>" }, ...],
  546:   "datePublished": "<publishedDate>",
  547:   "isPartOf": { "@type": "Periodical", "name": "<journal>" },
  548:   "identifier": [
  549:     { "@type": "PropertyValue", "propertyID": "DOI", "value": "<doi>" },
  550:     { "@type": "PropertyValue", "propertyID": "PubMedID", "value": "<pubmedId>" }
  551:   ],
  552:   "url": "<url>",                                 // 외부 URL (dereferenceable)
  553:   "description": "<summary>",
  554:   "image": "<thumbnailUrl>",
  555:   "publisher": { "@id": "{siteBaseUrl}/#organization" }
  556: }
  557: ```
  558: 
  559: ### 6.2 VideoObject entity (MediaAppearance — 4 channel_type 모두) — cycle 1 ECP-05·14 정정 (단일화)
  560: 
  561: ```json
  562: {
  563:   "@type": "VideoObject",
  564:   "@id": "{pageBaseUrl}#video-{slug}",            // fragment-scoped · 모든 channel_type 동일
  565:   "name": "<title>",
  566:   "description": "<summary>",
  567:   "uploadDate": "<publishedDate>",
  568:   "duration": "PT<durationSeconds>S",
  569:   "thumbnailUrl": "<thumbnailUrl>",
  570:   "contentUrl": "<url>",
  571:   "publisher": { "@type": "Organization", "name": "<channelName>" }
  572: }
  573: ```
  574: 
  575: **결정 (cycle 1 ECP-05·14 정정)**: 모든 4 channel_type (broadcast/youtube/podcast/press) → `VideoObject` 단일. fragment `#video-{slug}` 일관. allowlist 미사용 (모든 entity graph 안). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1 cascade).
  576: 
  577: ### 6.3 FAQPage (P-011) — cycle 1 ECP-19 정합
  578: 
  579: ```json
  580: {
  581:   "@type": "FAQPage",
  582:   "@id": "{siteBaseUrl}/faq#faqpage",
  583:   "inLanguage": "ko-KR",
  584:   "mainEntity": [
  585:     {
  586:       "@type": "Question",
  587:       "name": "<faq.question>",
  588:       "acceptedAnswer": {
  589:         "@type": "Answer",
  590:         "text": "<renderMarkdownToPlainText(faq.answer)>"
  591:       }
  592:     },
  593:     ...
  594:   ]
  595: }
  596: ```
  597: 
  598: ### 6.4 페이지별 graph 매트릭스 (EC-SEO-01)
  599: 
  600: | 페이지 | graph entities (cycle 1 ECP-06·13·15 정정 — graph self-contained · cross-page allowlist 미사용) |
  601: |---|---|
  602: | P-002 About | `[풀] Organization` · `[풀] MedicalClinic` · `[풀] WebPage` (with `MedicalClinic.subjectOf` array) · `[풀] BreadcrumbList` · `[풀] ScholarlyArticle[]` (all clinic publications) · `[풀] VideoObject[]` (all clinic media) |
  603: | P-004 Doctor Profile | `[풀] Organization` · `[풀] Physician` (with `subjectOf` array) · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] ScholarlyArticle[]` (author=doctor publications) · `[풀] VideoObject[]` (author=doctor media) |
  604: | P-011 FAQ | `[풀] Organization` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] FAQPage` (with Question[] inline `mainEntity`) |
  605: 
  606: **결정**:
  607: - (EC-SEO-02 · cycle 1 ECP-06 정정) 모든 page 의 graph 가 self-contained — Publication/Media 가 표시되는 페이지에 풀 entity 출력. cross-page allowlist 사용 안 함.
  608: - (EC-SEO-03 · cycle 1 ECP-13 정정) `@id` 패턴 — fragment-scoped (page URL + fragment). v0.1 단계 별도 페이지 미생성이지만 `@id` 가 페이지 URL 안 anchor 로 dereferenceable (browser 가 page fragment scroll 처리).
  609: - (EC-SEO-04 · cycle 1 ECP-15 정정) About 페이지의 publication/media reference 는 단일 결정 — `MedicalClinic.subjectOf`. Organization 미사용.
  610: 
  611: ## 7. CONTENT_STANDARDS 결정 — cycle 1 ECP-07 정합 (EC-CASCADE-03)
  612: 
  613: `docs/core/CONTENT_STANDARDS.md` § 7.1.1.x ContentType 예외 표 확장 (DATA_MODEL C-10 contentType enum cascade 정합):
  614: 
  615: | ContentType | answer-first AST | 표현 검사 | RiskRule | RiskInference |
  616: |---|---|---|---|---|
  617: | `Publication` | **면제** (외부 학술 인용 · clinic 자체 표현 아님) | **면제** | **면제** (DB CHECK Low fixed) | **면제** |
  618: | `MediaAppearance` | **면제** | **면제** | **면제** (DB CHECK Low fixed) | **면제** |
  619: | `FAQ` Q | **적용** | **적용** (의료법 광고 표현 검수) | **적용** (compliance-assistant 합류 시 · EC-DEFER-05) | **적용** (Medium/High 자동 추론) |
  620: | `FAQ` A | **적용** | **적용** | **적용** | **적용** |
  621: | `ArticleCategory` | (콘텐츠 자체 없음 · 분류 메타) | — | — | — |
  622: 
  623: **결정**:
  624: - (EC-CONTENT-01) Publication/MediaAppearance 면제 — 외부 인용. 클리닉 자체 권고 아님.
  625: - (EC-CONTENT-02) FAQ 적용 — 클리닉 자체 답변 → 의료법 광고 표현 검수. RiskInference Medium/High 자동 (RISK_LEVELS § 2 정합).
  626: - (EC-CONTENT-03) ArticleCategory taxonomy — 룰 없음.
  627: 
  628: ## 8. 환경·precondition
  629: 
  630: - `packages/db/migrations/D0014_public_reader_eat.sql` (신규 · EC-CASCADE-05)
  631: - `packages/core-content/migrations/C0009_article_category.sql` (신규)
  632: - `packages/core-content/migrations/C0010_publication.sql` (신규)
  633: - `packages/core-content/migrations/C0011_media_appearance.sql` (신규)
  634: - `packages/core-content/migrations/C0012_faq.sql` (신규)
  635: - `packages/core-content/migrations/C0013_article_category_fk.sql` (신규 · staged migration 4 step · cycle 1 ECP-03·09 정합)
  636: - `apps/web/src/seed.ts` patch — instance 생성 시 default `general` ArticleCategory row 자동 INSERT (EC-SCHEMA-03)
  637: - `packages/migrations-runner/src/manifest.ts` patch — **16 단계 (현 10 + 6 신규)** — cycle 1 ECP-04 정정:
  638:   - 10 (현재): D0010 instance · C0001~C0008 (article 등 8) · D0011 public_reader
  639:   - 11~16 (신규): C0009 article_category → C0010 publication → C0011 media_appearance → C0012 faq → C0013 article_category_fk (article ALTER + backfill + SET NOT NULL) → D0014 public_reader_eat
  640:   - dependsOn 정합: C0010/C0011/C0012 dependsOn = `instance` + `doctor_profile` (authorDoctorId FK) + `content_publication_status` + `risk_level`. C0013 dependsOn = `article` + `article_category`. D0014 dependsOn = `article_category` + `publication` + `media_appearance` + `faq` + `app_public_reader` (D0011 의 role · creates).
  641: 
  642: ## 9. § 8.1 시나리오 cascade (PUBLIC_SITE_RENDER v1.0 § 7 + 본 plan 신규)
  643: 
  644: | # | 시나리오 | 통과 기준 |
  645: |---|---|---|
  646: | 24 | publication published 1행 (author_doctor_id 매칭) → Doctor Profile 안 인용 카드 1건 | external link `rel="nofollow noopener noreferrer"` (cycle 1 ECP-20 정합) |
  647: | 25 | media_appearance youtube 1행 → Doctor Profile thumbnail + ISO duration `PT{seconds}S` | duration_seconds=3720 → `PT3720S` (cycle 1 ECP-30 정합) |
  648: | 26 | FAQ — v0.1 단계 published 차단 검증 | `INSERT ... status='published'` 시도 → CHECK `faq_status_v01_limit` 위반 (cycle 1 ECP-10·11 정합) |
  649: | 27 | FAQPage graph 안 `mainEntity` 0건 (v0.1 published 차단 → 0 row) | self-rule-checker PASS · 빈 array OK |
  650: | 28 | article.category_id = `general` ArticleCategory.id · URL `/<slug>/insights/general/<article-slug>` → 200 (DB join) | PSR-DEFER-15 해소 (cycle 1 ECP-17 정합) |
  651: | 29 | article.category_id 다른 카테고리 row · URL `/insights/wrong-category/<slug>` → 404 | category.slug 매칭 검증 |
  652: | 30 | Publication risk_level='Medium' 시도 → DB CHECK 위반 | `publication_risk_level_low_only` |
  653: | 31 | ScholarlyArticle JSON-LD `identifier` array — doi + pubmedId 둘 다 출력 | 2 PropertyValue (DOI · PubMedID) |
  654: | 32 | VideoObject `duration` ISO 8601 (PT<seconds>S) — 모든 4 channel_type | broadcast/youtube/podcast/press 모두 `#video-{slug}` |
  655: | 33 | Article 의 SQL JOIN article_category — category 미존재 (instance 안 row 없음) → 404 | category lookup 0 row → notFound |
  656: | 34 | FAQ Markdown answer 안 `<script>` payload → JSON-LD `Answer.text` 평문 strip | renderMarkdownToPlainText 정합 |
  657: | 35 | Doctor Profile graph self-contained — ScholarlyArticle/VideoObject 모두 fragment-scoped `@id` | rule checker PASS — cross-page allowlist 미사용 |
  658: | 36 | ArticleCategory 운영 중 신규 INSERT → public_reader 즉시 SELECT (status 게이트 없음) | EC-SCHEMA-17 결정 정합 |
  659: 
  660: ## 10. 작업 단위
  661: 
  662: | # | 작업 | 산출물 |
  663: |---|---|---|
  664: | 1 | C0009 article_category migration (C-22 풀명세 컬럼 전체) | packages/core-content/migrations/C0009_article_category.sql |
  665: | 2 | C0010 publication migration (cycle 1 ECP-18 — DEFAULT 제거) | C0010_publication.sql |
  666: | 3 | C0011 media_appearance migration | C0011_media_appearance.sql |
  667: | 4 | C0012 faq migration (cycle 1 ECP-10·11 — status='draft' CHECK + published_at IS NULL CHECK) | C0012_faq.sql |
  668: | 5 | C0013 article.category_id staged migration 4 step (cycle 1 ECP-03·09) | C0013_article_category_fk.sql (ADD COLUMN nullable + default category seed + backfill + SET NOT NULL + FK) |
  669: | 6 | D0014 public_reader_eat GRANT + per-table policy (cycle 1 ECP-16) | packages/db/migrations/D0014_public_reader_eat.sql |
  670: | 7 | Drizzle schema 확장 — packages/core-content/src/schema.ts v0.4 | 4 신규 table + article.category_id |
  671: | 8 | zod schema 통합 SoT (cycle 1 ECP-08 — DOI regex DB 동일 anchored · ECP-11 — status enum subset) | apps/web/src/lib/eat-content-schema.ts |
  672: | 9 | 4 admin form (Publication·MediaAppearance·Faq·ArticleCategory) | apps/web/src/components/forms/{Publication,MediaAppearance,Faq,ArticleCategory}Form.tsx |
  673: | 10 | 4 admin route group + actions.ts | apps/web/src/app/(admin)/admin/[instanceSlug]/{publications,media-appearances,faqs,categories}/{page,new/page,[slug]/page,actions}.tsx |
  674: | 11 | mapDbErrorToResult constraint 매핑 추가 | apps/web/src/lib/errors.ts (publication_* · media_appearance_* · faq_* · article_category_*) |
  675: | 12 | DB → projection 확장 | apps/web/src/lib/db-projection.ts (normalizePublication · normalizeMediaAppearance · normalizeFaq · normalizeArticleCategory) |
  676: | 13 | JSON-LD entity 추가 (cycle 1 ECP-05·06·13·14·15 정합) | apps/web/src/lib/json-ld/entities.ts (scholarlyArticleEntity · videoObjectEntity · faqPageEntity · questionEntity) |
  677: | 14 | JSON-LD builders 확장 (graph self-contained · fragment-scoped `@id`) | apps/web/src/lib/json-ld/builders.ts (faqPageGraph 신규 · doctorProfileGraph · aboutGraph patch — ScholarlyArticle/VideoObject 풀 entity inline) |
  678: | 15 | (rule checker 변경 없음 — graph self-contained · allowlist 확장 불필요 · cycle 1 ECP-06·14 정정 결과) | (validate.ts 변경 없음) |
  679: | 16 | P-011 FAQ public page (cycle 1 ECP-21 — 빈 페이지도 200) | apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx + metadata + JsonLdScript |
  680: | 17 | Doctor Profile (P-004) 확장 — Publications + MediaAppearances inline + graph self-contained | doctors/[slug]/page.tsx |
  681: | 18 | About (P-002) 확장 — MedicalClinic.subjectOf 단일 결정 | about/page.tsx |
  682: | 19 | Article URL `[category]` 실 DB join (cycle 1 ECP-17 — PSR-DEFER-15 해소) | insights/[category]/[slug]/page.tsx — SQL JOIN article_category |
  683: | 20 | sitemap.xml 확장 — P-011 FAQ entry + article URL 실 category slug | (site)/[instanceSlug]/sitemap.xml/route.ts |
  684: | 21 | dashboard cascade — 8 card | (admin)/admin/[instanceSlug]/page.tsx |
  685: | 22 | seed 안 default `general` article_category row 자동 INSERT (cycle 1 ECP-09) | apps/web/src/seed.ts |
  686: | 23 | manifest **16 단계** patch (cycle 1 ECP-04 정정) | packages/migrations-runner/src/manifest.ts |
  687: | 24 | Markdown plain text helper 신규 (cycle 1 ECP-19) | apps/web/src/lib/markdown.ts (`renderMarkdownToPlainText`) |
  688: | 25 | vitest scenario 24~36 추가 (자동 검증 가능 부분) | apps/web/src/lib/json-ld/__tests__/validate.test.ts + db-projection.test.ts + markdown.test.ts |
  689: | 26 | docs cascade — DATA_MODEL § 1.1 인벤토리 25 contracts · § 4 C-10 enum +2 · C-12 풀명세 · C-22 풀명세 컬럼 정합 · C-24 Publication · C-25 MediaAppearance 풀명세 (EC-CASCADE-01) · SCHEMA_MAPPING § 2 entity 카탈로그 · § 3 P-011 (EC-CASCADE-02) · CONTENT_STANDARDS § 7.1.1.x (EC-CASCADE-03) · PSR-DEFER-11/15 해소 marker (EC-CASCADE-07) · M0_BUILD_EXPORT § 2.1 (EC-CASCADE-04) · PAGE_TYPES § 1.1 P-011 M0 ✅ + § 3 본문 (EC-CASCADE-08 acceptance precondition — cycle 1 ECP-12 격상) · ARCH § 3 Vertical Slice 정합 (EC-CASCADE-09 — 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ) | doc patches |
  690: 
  691: ## 11. M0 v1.0 cascade markers (defer 정리)
  692: 
  693: ### 11.1 별 cycle 합류
  694: - `EC-DEFER-01`: Inquiry (1:1 상담 게시판) — PIPA + 회원 인증 결정.
  695: - `EC-DEFER-08`: Reviews/Pricing High-risk commercial 페이지.
  696: 
  697: ### 11.2 M1 Phase Alpha 합류
  698: - `EC-DEFER-02`: Publication / MediaAppearance 별도 페이지.
  699: - `EC-DEFER-03`: DOI 자동 메타데이터 fetch (CrossRef API).
  700: - `EC-DEFER-04`: 동영상 embed (YouTube iframe + CSP).
  701: - `EC-DEFER-06`: FAQ 다국어.
  702: - `EC-DEFER-09`: FAQ.metadata.featuredOnHome + related Treatment/Condition UI.
  703: - `EC-DEFER-10`: ArticleCategory 풀명세 column (parentCategory/pillar/coverImageUrl/seoMeta/articleTypeDefault) 어드민 UI/공개 렌더.
  704: - `EC-DEFER-11` (cycle 1 ECP-05 정정): MediaAppearance channel_type 별 schema.org `@type` 분기 (broadcast → BroadcastEvent · press → NewsArticle).
  705: 
  706: ### 11.3 compliance-assistant Feature 합류
  707: - `EC-DEFER-05`: FAQ 자동 검수 (compliance-assistant + RiskRule + RiskInference).
  708: - `EC-DEFER-07`: 4 entity status='review-queued' 전이 + ComplianceRecord pre-publish.
  709: - `EC-DEFER-12` (cycle 1 ECP-10·11 정정): 4 entity 어드민 published 발행 — EC-DEFER-05 합류 시점.
  710: 
  711: ## 12. Cascade markers (다른 SoT 문서로 전파)
  712: 
  713: - `EC-CASCADE-01`: `docs/core/DATA_MODEL.md` patches:
  714:   - § 1.1 인벤토리 25 contracts (+ C-24 Publication, C-25 MediaAppearance) · C-12 FAQ M0 ✅ · C-22 ArticleCategory M0 ✅ · C-24/25 row 추가.
  715:   - § 4 C-10 `contentType` enum +2 (Publication, MediaAppearance) v0.6.
  716:   - § 4 C-12 FAQ 간략 명세 → 풀명세 (question 10~200, answer 50~2000 Markdown · category Ref<C-22> optional · relatedTreatment optional · authorDoctor optional · status content_publication_status · riskLevel C-05 default Low).
  717:   - § 4 C-22 ArticleCategory — v0.1 DB 컬럼 정합 marker (parentCategory · pillar · coverImageUrl · seoMeta · articleTypeDefault 모두 optional · v0.1 UI 미사용 EC-DEFER-10).
  718:   - § 4 C-24 Publication 풀명세 신규.
  719:   - § 4 C-25 MediaAppearance 풀명세 신규.
  720:   - § 4 C-04 Article `category` required SoT 정합 — DB NOT NULL 전환 marker.
  721: - `EC-CASCADE-02`: `docs/core/SCHEMA_MAPPING.md` patches:
  722:   - § 1.2 `@id` 패턴 (ScholarlyArticle · VideoObject — fragment-scoped 운영) v0.1.
  723:   - § 2 entity 카탈로그 — ScholarlyArticle · VideoObject (모든 channel_type) · FAQPage · Question · Answer 추가.
  724:   - § 3 P-011 FAQ graph + P-002/P-004 graph 확장 (ScholarlyArticle/VideoObject 풀 entity).
  725: - `EC-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7.1.1.x ContentType 예외 표 — Publication/MediaAppearance 면제 · FAQ Q/A 적용.
  726: - `EC-CASCADE-04`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2.1 SSR 재사용 표 — 신규 4 entity (article_category · publication · media_appearance · faq) Git output 변환 marker.
  727: - `EC-CASCADE-05`: `packages/db/migrations/D0014_public_reader_eat.sql` 신규 — D0011 per-table GRANT/policy 패턴 정합.
  728: - `EC-CASCADE-06`: `packages/migrations-runner/src/manifest.ts` — 16 단계 (cycle 1 ECP-04 정정) + 각 entry 의 dependsOn 명시.
  729: - `EC-CASCADE-07`: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` — PSR-DEFER-11 부분 (FAQ) + PSR-DEFER-15 (Article category) 해소 marker.
  730: - `EC-CASCADE-08` (cycle 1 ECP-12 정정 — acceptance precondition 격상): `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ M0 ✅ + § 3 P-011 본문 작성 (질문 위계 + AEO 친화).
  731: - `EC-CASCADE-09` (cycle 1 ECP-22 정정): `docs/admin/ARCHITECTURE.md` § 3 Slice 페이지 합계 = **11페이지** (기존 9 + P-010 1샘플 + P-011 FAQ). ArticleCategory 는 어드민 운영 routing 추가지만 공개 페이지 count 에는 포함 안 됨 (Article URL prefix 만 변경).
  732: 
  733: ## 변경 이력
  734: 
  735: | 일자 | 버전 | 변경 |
  736: |---|---|---|
  737: | 2026-05-18 | v0.1 | 초안 작성. Codex 자동 비평 사이클 진입 전 base. |
  738: | 2026-05-18 | v0.3 | **Codex 비평 cycle 2 8 findings (4 blocking + 4 major + 0 minor) 전건 수용 patch — docs cascade 실 patch 진입**: (ECP-23·24·25·26 blocking 4건 + ECP-27·28·29·30 major 4건) plan 본문 명시한 docs cascade 가 실 patch 안 됨 — plan acceptance commit 안 docs cascade 동시 적용 결정 (LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합). 본 patch 사이클에서 다음 실 적용: (1) DATA_MODEL § 1.1 인벤토리 23 → 25 contracts + C-24 Publication · C-25 MediaAppearance row 추가 + C-12 FAQ M0 ✅ + C-04 Article category required 명시. (2) DATA_MODEL § 4 C-10 contentType enum v0.6 — +Publication +MediaAppearance (17종). (3) DATA_MODEL § 4 C-22 ArticleCategory marker (DB 실 운영 합류 marker + EC-DEFER-10). (4) DATA_MODEL § 4 C-12 FAQ 풀명세 (question 10~200 · answer Markdown 50~2000 · v0.1 DB CHECK draft 만). (5) DATA_MODEL § 4 C-24 Publication 풀명세 (외부 학술 인용 · risk Low fixed). (6) DATA_MODEL § 4 C-25 MediaAppearance 풀명세 (모든 channel_type → VideoObject 단일화 v0.1). (7) PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 페이지 합계 11. (8) SCHEMA_MAPPING § 2 entity 카탈로그 — ScholarlyArticle 추가 · VideoObject MediaAppearance 매핑 추가 · FAQPage EAT v0.x M0 합류 + Answer.text helper marker. (9) CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 — Publication/MediaAppearance 면제 + FAQ Q/A 적용. (10) ARCH § 3.11 게이트 #1 — 11 페이지 + P-011 FAQ 합류. (11) M0_BUILD_EXPORT § 2.2 EAT 4 entity 변환 표. (12) PUBLIC_SITE_RENDER § 9.3 PSR-DEFER-11/15 해소 marker. (13) packages/migrations-runner/src/manifest.ts orderedMigrations 16 entry (C0009/10/11/12/13 + D0014). 코드 cascade (migrations 실 SQL · 어드민 폼 · Article detail SQL JOIN 등) 는 별도 EAT_CONTENT code v1.0 cycle. 누계 cycle 1+2 = 30 findings 전건 수용. |
  739: | 2026-05-18 | v0.2 | **Codex 비평 cycle 1 22 findings (7 blocking + 10 major + 5 minor) 전건 수용 patch**: (ECP-01) C-24/25 Publication/MediaAppearance · C-12 FAQ 풀명세 합류 · C-22 ArticleCategory 실 운영 합류 — DATA_MODEL 인벤토리 25 contracts. (ECP-02) C-22 풀명세 컬럼 전체 DB 추가 (v0.1 UI minimal · EC-DEFER-10). (ECP-03) Article.category_id staged 4-step migration (ADD nullable + seed + backfill + SET NOT NULL). (ECP-04) manifest 16단계 + 각 dependsOn 명시. (ECP-05·14) MediaAppearance 모든 channel_type → VideoObject 단일화 · fragment `#video-{slug}` 단일 · BroadcastEvent/NewsArticle 분기는 EC-DEFER-11. (ECP-06) Doctor/About graph self-contained — Publication/Media 풀 entity 출력. cross-page allowlist 미사용. (ECP-07) C-10 contentType enum +Publication +MediaAppearance v0.6 cascade. FAQ 토큰 대문자 통일. (ECP-08) DOI regex DB·zod 동일 anchored. (ECP-09) default `general` ArticleCategory seed = seed.ts + C0013 마이그레이션 backfill. (ECP-10·11) v0.1 단계 4 entity 어드민 status='draft' 강제 — FAQ DB CHECK + zod enum subset. EC-DEFER-12 신설. (ECP-12) PAGE_TYPES P-011 M0 ✅ — EC-CASCADE-08 acceptance precondition 격상. (ECP-13) Publication/Media `@id` fragment-scoped (Doctor/About page URL + fragment). (ECP-15) About publication/media reference 는 MedicalClinic.subjectOf 단일 결정. (ECP-16) ArticleCategory taxonomy public 의도 명시 — status 게이트 없음 + EC-DEFER-10. (ECP-17) Article detail SQL JOIN article_category · category.slug 매칭 작업 명시. (ECP-18) `authors` DEFAULT 제거. (ECP-19) `renderMarkdownToPlainText` helper 신규 — JSON-LD Answer.text. (ECP-20) external link rel `nofollow noopener noreferrer` 통일. (ECP-21) FAQ 빈 페이지 200 + sitemap 포함 + lastmod fallback. (ECP-22) Slice 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ. |

 succeeded in 682ms:
    1: # Core — 페이지 타입 표준
    2: 
    3: > **상태**: Draft v0.8
    4: > **작성일**: 2026-05-14 (v0.7 → v0.8 — § 6 M0 표 P-013 비고 SoT 정합 / 잔존 버전 표기 정리)
    5: > **소유자**: Glitzy
    6: > **상위 문서**: `docs/ARCHITECTURE.md` § 7
    7: > **목적**: 솔루션이 표준화하는 의료기관 웹사이트 페이지 타입을 단독 구현 가능한 수준으로 정의한다.
    8: > **외부 공유 시 주의**: 표현 리스크 어휘 회피.
    9: > **연관 문서**:
   10: > - 데이터 계약·공통 타입 → `core/DATA_MODEL.md`
   11: > - JSON-LD Schema graph → `core/SCHEMA_MAPPING.md`
   12: > - 메타 태그 → `core/SEARCH_STANDARDIZATION.md`
   13: > - 콘텐츠 작성 표준 → `core/CONTENT_STANDARDS.md`
   14: > - 디자인 토큰 → `core/DESIGN_TOKENS.md`
   15: > - 위험도 등급 → `compliance/RISK_LEVELS.md`
   16: > - 레퍼런스 분석 → `research/REFERENCE_ANALYSIS_2026-05.md`, `research/REFERENCE_DEEP_DIVE_2026-05.md`
   17: 
   18: ---
   19: 
   20: ## 0. 한 페이지 요약
   21: 
   22: - 필수 14종 + 선택 7종 = **21종 페이지 타입**.
   23: - M0 Slice: **10종 + Article 1샘플 = 11개 페이지** (P-001·P-002·P-003·P-004·P-005·P-006·P-011 FAQ·P-012·P-013·P-014 + P-010 1샘플) — EAT v0.x EC-CASCADE-08 patch (P-011 FAQ M0 합류).
   24: - **P-014 LocationProfile(main)·P-013 LegalDocument는 어드민 화면 추가 없이 ClinicProfile 화면의 기관 정체성 + 본원 위치·연락·시간 입력 + Core 표준 템플릿으로 자동 생성** (SoT: 위치·시간·연락은 LocationProfile이 마스터). 단지점·다지점 통일 처리.
   25: - High-risk commercial pages (P-101 Reviews · P-102 Pricing · P-104 News/Event 이벤트)는 Add-on 정책 기반 활성화.
   26: - P-106 Self-test는 **Feature-backed optional page** — 페이지 타입은 정의하되 Feature Module이 콘텐츠·로직을 제공.
   27: 
   28: ---
   29: 
   30: ## 1. 페이지 타입 분류
   31: 
   32: ### 1.1 필수 타입 (Core 표준 14종)
   33: 
   34: | ID | 페이지 타입 | URL 패턴 | 주 데이터 계약 | M0 |
   35: |---|---|---|---|:---:|
   36: | P-001 | Home | `/` | `ClinicProfile` (요약) | ✅ |
   37: | P-002 | About | `/about` | `ClinicProfile` (전체) | ✅ |
   38: | P-003 | Doctors List | `/doctors` | `DoctorProfile[]` | ✅ |
   39: | P-004 | Doctor Profile | `/doctors/{slug}` | `DoctorProfile` | ✅ |
   40: | P-005 | Treatments List | `/treatments` | `TreatmentPage[]` | ✅ |
   41: | P-006 | Treatment Detail | `/treatments/{slug}` | `TreatmentPage` | ✅ |
   42: | P-007 | Conditions List | `/conditions` | `MedicalConditionPage[]` | |
   43: | P-008 | Condition Detail | `/conditions/{slug}` | `MedicalConditionPage` | |
   44: | P-009 | Articles List | `/insights` 또는 `/blog` | `Article[]` | |
   45: | P-010 | Article Detail | `/insights/{cat}/{slug}` | `Article` | ✅ (1샘플) |
   46: | P-011 | FAQ | `/faq` | `FAQ[]` | ✅ (EAT v0.x EC-CASCADE-08) |
   47: | P-012 | Contact / Visit (Conversion Hub) | `/contact` | `ClinicProfile` + `LocationProfile[]` | ✅ |
   48: | P-013 | Legal / Policy | `/privacy`, `/terms` 등 | `LegalDocument` | ✅ (자동 생성) |
   49: | P-014 | Location / Branch Detail | `/locations/{slug}` | `LocationProfile` | ✅ (main 자동) |
   50: 
   51: ### 1.2 선택 타입 (7종)
   52: 
   53: | ID | 페이지 타입 | URL 패턴 | 활성화 방식 | 비고 |
   54: |---|---|---|---|---|
   55: | P-101 | Reviews (후기) | `/reviews` | Add-on + ReviewPolicy | **High-risk commercial** |
   56: | P-102 | Pricing (가격 안내) | `/pricing` | Add-on | **High-risk commercial** |
   57: | P-103 | Facilities / Equipment | `/facilities` | Instance 결정 | 시설 신뢰도 |
   58: | P-104 | News / Event | `/news` | Instance 결정 (이벤트 카테고리는 Add-on) | 이벤트 카테고리 High-risk |
   59: | P-105 | Reservation | `/reservation` | Instance 결정 (Contact 통합 가능) | 전환 추적 단위 |
   60: | P-106 | Self-test / Quiz | `/self-test/{slug}` | **Feature Module(`compliance-assistant` 또는 신규 `self-test-module`)이 콘텐츠·로직 제공** | Feature-backed optional page |
   61: | P-107 | (예약됨) | | | 미래 확장용 |
   62: 
   63: ---
   64: 
   65: ## 2. 공통 룰 (모든 페이지 타입 적용)
   66: 
   67: ### 2.1 헤딩 위계
   68: - H1은 페이지당 1개. 페이지의 주제·정체성.
   69: - H2는 페이지 내 주요 섹션. 명사형 또는 질문형.
   70: - H3은 H2 하위 세부 단위.
   71: - H4 이하 자제 (AI 스니펫 추출 난이도 ↑).
   72: 
   73: ### 2.2 시맨틱 마크업
   74: - `<header>` / `<main>` / `<article>` / `<section>` / `<nav>` / `<footer>` 의미적 사용.
   75: - 콘텐츠 본문은 `<article>`. 보조 섹션은 `<aside>` 또는 `<section>`.
   76: - BreadcrumbList는 `<nav aria-label="breadcrumb">`.
   77: 
   78: ### 2.3 메타 태그·robots·sitemap·canonical
   79: - 모든 페이지에 title·description·canonical·og:*·twitter:* 필요.
   80: - 상세는 `core/SEARCH_STANDARDIZATION.md`.
   81: 
   82: ### 2.4 BreadcrumbList
   83: - Home 제외 모든 페이지에 JSON-LD BreadcrumbList 포함.
   84: 
   85: ### 2.5 내부 링크 원칙
   86: - 의미 있는 anchor text. 콘텐츠 클러스터.
   87: 
   88: ### 2.6 AEO·AI 스니펫 친화
   89: - 핵심 답변 문단 시작 1~2문장.
   90: - Q&A 블록·리스트·표 의도적 혼합.
   91: - H2 질문형 권장.
   92: 
   93: ---
   94: 
   95: ## 3. 필수 페이지 타입 상세
   96: 
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
  111: 
  112: **헤딩 위계**: H1 핵심 메시지 / H2 "진료 영역", "의료진 소개", "최근 인사이트", "방문 안내"
  113: **필수 블록**: 히어로 / 시술 요약 / 의료진 요약 / 연락 요약
  114: **선택 블록**: 최신 글 / 인증·미디어 / 후기 요약 (위험도 High)
  115: **레이아웃 변형**: 히어로(풀블리드/분할/미니멀), 시술 요약(카드 그리드/가로 스크롤/리스트)
  116: **위험도 기본값**: Low
  117: **컴플라이언스 주의**: 후기 요약 노출 시 `ReviewPolicy` 준수.
  118: **내부 링크 권장**: → About / Doctors List / Treatments List / Contact (P-009 미합류 시 Article 샘플 직접 링크)
  119: 
  120: ### P-002. About (병원 소개)
  121: 
  122: **목적**: 의료기관 정체성·연혁·철학·시설·인증·연구·미디어를 상세히 노출. AI 사이트 브리핑의 핵심 원천.
  123: **URL**: `/about`
  124: **주 데이터 계약**: `ClinicProfile` (전체)
  125: **Schema 요약**: `Organization` + `MedicalClinic` (with founder, foundingDate, award, member) + BreadcrumbList.
  126: 
  127: **정보 슬롯**:
  128: 1. 정식 명칭·영문명·법인명
  129: 2. 슬로건·핵심 가치
  130: 3. 설립일·연혁 타임라인
  131: 4. 진료 철학·차별점
  132: 5. 대표/원장 인사말·스토리 (`founderStory`)
  133: 6. 위치 — `LocationProfile` main 참조 (지도)
  134: 7. 사업자등록번호·통신판매업 신고번호
  135: 8. 인증·수상 (Award 단위 풍부)
  136: 9. 소속 학회·연구 협력
  137: 10. 연구·논문·특허 (`TrustMetric[]` 노출)
  138: 11. 미디어 노출·언론보도
  139: 12. 팀 요약 (Doctors List 진입)
  140: 13. (선택) 사회공헌·후원
  141: 
  142: **헤딩 위계**: H1 "{ClinicName} 소개" / H2 "연혁", "진료 철학", "대표 인사말", "인증·수상", "소속·연구", "미디어", "사회공헌"
  143: **필수 블록**: 연혁 / 진료 철학 / 위치 / 인증·소속
  144: **선택 블록**: 인사말 / 미디어 / 연구·논문 / 사회공헌 / 시설 사진
  145: **레이아웃 변형**: 연혁(타임라인/리스트/텍스트), 인증(배지 그리드/카드/리스트)
  146: **위험도 기본값**: Low
  147: **컴플라이언스 주의**: 최상급·효과 단정 금지. 인증·수상·연구는 사실·증빙 가능한 것만. `TrustMetric`은 사실 안내형 표현.
  148: **내부 링크 권장**: → Doctors List / Treatments List / Contact / Articles
  149: 
  150: ### P-003. Doctors List
  151: 
  152: **목적**: 의료진 전체 목록 + 프로필 상세 진입.
  153: **URL**: `/doctors`
  154: **주 데이터 계약**: `DoctorProfile[]`
  155: **Schema 요약**: BreadcrumbList + ItemList.
  156: 
  157: **정보 슬롯**: 의료진 카드(이름·진료분야·간략 약력·사진) / 진료분야 필터·그룹(선택)
  158: **헤딩 위계**: H1 "의료진 소개" / H2 진료분야 그룹명(있을 시)
  159: **필수 블록**: 의료진 카드 그리드
  160: **선택 블록**: 분야 필터 / 대표 의료진 인사말
  161: **레이아웃 변형**: 카드 그리드 / 매거진 리스트 / 인터랙티브
  162: **위험도 기본값**: Low
  163: **컴플라이언스 주의**: 자격·학회·논문은 검증 가능한 범위.
  164: **내부 링크 권장**: → 각 Doctor Profile / Treatments List
  165: 
  166: ### P-004. Doctor Profile
  167: 
  168: **목적**: 개별 의료진 권위·전문성·E-E-A-T 노출. 저자 프로필.
  169: **URL**: `/doctors/{slug}`
  170: **주 데이터 계약**: `DoctorProfile`
  171: **Schema 요약**: `Physician` (with medicalSpecialty, affiliation, alumniOf) + BreadcrumbList.
  172: 
  173: **정보 슬롯**:
  174: 1. 이름·직책·진료 분야·사진
  175: 2. 자격·면허
  176: 3. 학력·전공
  177: 4. 소속·경력
  178: 5. 학회·연구
  179: 6. 개인 스토리 (`personalStory`)
  180: 7. 논문·기고
  181: 8. 미디어 노출
  182: 9. 진료 철학·인사말
  183: 10. 작성한 인사이트 (Articles 백링크)
  184: 11. 예약·문의 CTA (해당 시)
  185: 
  186: **헤딩 위계**: H1 "{Doctor Name} {직책}" / H2 "자격", "경력", "스토리", "학회·연구", "논문", "미디어", "인사이트"
  187: **필수 블록**: 자격 / 경력 / 진료 분야
  188: **선택 블록**: 개인 스토리 / 논문 / 미디어 / 작성한 글 / 인사말
  189: **레이아웃 변형**: 좌사진·우본문 / 풀폭 헤더+본문 / 매거진형
  190: **위험도 기본값**: Low
  191: **컴플라이언스 주의**: 검증 가능한 자격·논문. 최상급 표현 금지. 개인 스토리에 효과 단정 금지.
  192: **내부 링크 권장**: → Doctors List / Treatments (분야 일치) / 작성한 Articles
  193: 
  194: ### P-005. Treatments List
  195: 
  196: **목적**: 시술·진료 영역 전체 노출.
  197: **URL**: `/treatments`
  198: **주 데이터 계약**: `TreatmentPage[]`
  199: **Schema 요약**: BreadcrumbList + ItemList.
  200: 
  201: **정보 슬롯**: 시술 카드(이름·간략 설명·대상) / 진료 분야 그룹(선택)
  202: **헤딩 위계**: H1 "진료 안내" / H2 분야 그룹명
  203: **필수 블록**: 시술 카드 그리드
  204: **선택 블록**: 분야 필터
  205: **레이아웃 변형**: 카드 / 탭 / 아코디언 / 풀스크린 스크롤
  206: **위험도 기본값**: Low
  207: **컴플라이언스 주의**: 시술명·간략 설명에 효과 단정·최상급 금지.
  208: **내부 링크 권장**: → 각 Treatment Detail / Conditions
  209: 
  210: ### P-006. Treatment Detail
  211: 
  212: **목적**: 개별 시술의 구조화 정보. AEO 핵심 페이지. 다이어트 한의원에는 가장 중요한 페이지.
  213: **URL**: `/treatments/{slug}`
  214: **주 데이터 계약**: `TreatmentPage`
  215: **Schema 요약**: `MedicalProcedure` + BreadcrumbList + (FAQ 블록 시) `FAQPage`.
  216: 
  217: **정보 슬롯**:
  218: 1. 시술명·요약 (1~2문장 핵심 답변)
  219: 2. 개요 (정의·목적)
  220: 3. 원리 (어떻게 작동)
  221: 4. 대상 (`recommendedFor[]` — 누구에게 적합) ⭐
  222: 5. **구성 요소** (`treatmentComponents[]`) — 한약·약침·고주파·체성분 검사·식단 관리 등 ⭐
  223: 6. **방문 흐름** (`visitFlow[]`) — 검사 → 상담 → 처방 → 관리 ⭐
  224: 7. 과정 (단계별)
  225: 8. **프로그램 변형** (`programVariants[]`) — 1개월/3개월/유지 등 ⭐
  226: 9. 소요 시간·횟수
  227: 10. **비대면 진료 가능 여부** (`remoteCareAvailable`) ⭐
  228: 11. 주의사항·금기증
  229: 12. 시술 후 관리
  230: 13. **유지·요요 방지 계획** (`maintenancePlan`) ⭐
  231: 14. **근거·논문 노트** (`evidenceNotes[]`) — 외부 검증 가능 자료 ⭐
  232: 15. 자주 묻는 질문
  233: 16. 담당 의료진 (백링크)
  234: 17. 관련 질환 (백링크)
  235: 18. 예약·문의 CTA
  236: 
  237: > ⭐ = v0.5 신규 슬롯 (DATA_MODEL v0.4 TreatmentPage 신규 필드 연동)
  238: 
  239: **헤딩 위계**: H1 시술명 / H2 "개요", "원리", "대상", "구성", "과정", "프로그램 안내", "주의사항", "시술 후 관리", "유지·관리", "자주 묻는 질문", "관련 의료진"
  240: **필수 블록**: 개요 / 원리 / 대상 / 구성 / 과정 / 주의사항
  241: **선택 블록**: 프로그램 변형 / 소요 시간 / 시술 후 관리 / 유지 계획 / 근거 노트 / FAQ / 관련 의료진 / 관련 질환
  242: 
  243: **레이아웃 변형**: 단일 페이지 / 챕터 분할 / 비교형(프로그램 변형 시 권장)
  244: 
  245: **위험도 기본값**: **Medium**
  246: 
  247: **슬롯별 위험도 격상 조건**:
  248: 
  249: | 슬롯 | 기본 | 격상 조건 |
  250: |---|---|---|
  251: | 개요·원리·과정·주의사항 | Medium | — |
  252: | 대상 (`recommendedFor`) | Medium | "이런 분은 꼭 필요" 권유형 → High |
  253: | 구성 (`treatmentComponents`) | Medium | 구성별 효과 단정 → High |
  254: | 방문 흐름 (`visitFlow`) | Medium | — |
  255: | 프로그램 변형 (`programVariants`) | Medium | 가격·기간·횟수 약속 결합 → High |
  256: | 소요·횟수 | Medium | 감량 수치·기간 약속 → High |
  257: | 유지 계획 (`maintenancePlan`) | Medium | "100% 요요 방지" 등 → High |
  258: | 근거 노트 (`evidenceNotes`) | Low | 인용·링크는 사실 안내. 단 효과 단정 결합 시 → High |
  259: | FAQ | 답변별 가변 | 효과·결과 답변 → High |
  260: | 후기·전후사진 (포함 시) | — | **자동 High** |
  261: | 가격·이벤트 (포함 시) | — | **자동 High** |
  262: | CTA | Low~Medium | 할인·이벤트 결합 → High |
  263: 
  264: **컴플라이언스 주의**: 슬롯별 격상은 가이드. 실제 적용은 `compliance-assistant` 자동 보조 + 운영자 최종 결정. 의료진 검토 필수.
  265: 
  266: **내부 링크 권장**: → 담당 의료진 / 관련 질환 / 관련 시술 / FAQ
  267: 
  268: ### P-007. Conditions List
  269: 
  270: **목적**: 질환·증상 정보 페이지 진입로. 다이어트 한의원은 증상 기반 쿼리 비중 큼 (Phase Alpha 우선 합류 권장).
  271: **URL**: `/conditions`
  272: **주 데이터 계약**: `MedicalConditionPage[]`
  273: **Schema 요약**: BreadcrumbList + ItemList.
  274: 
  275: **정보 슬롯**: 질환·증상 카드 / 분류 그룹(선택)
  276: **헤딩 위계**: H1 "질환·증상 정보" / H2 분류 그룹명
  277: **필수 블록**: 카드 그리드
  278: **선택 블록**: 분류 필터
  279: **레이아웃 변형**: P-005 동일
  280: **위험도 기본값**: Low
  281: **컴플라이언스 주의**: 질환명·간략 설명에 진단 단정·효과 표현 금지.
  282: **내부 링크 권장**: → 각 Condition Detail / 관련 Treatments
  283: 
  284: ### P-008. Condition Detail
  285: 
  286: **목적**: 특정 질환·증상 정보 콘텐츠. 검색 의도 "OO증상이 뭐예요" 충족.
  287: **URL**: `/conditions/{slug}`
  288: **주 데이터 계약**: `MedicalConditionPage`
  289: **Schema 요약**: `MedicalCondition` (signOrSymptom, riskFactor, possibleTreatment) + BreadcrumbList + (해당 시) FAQPage.
  290: 
  291: **정보 슬롯**:
  292: 1. 정의·핵심 답변 (1~2문장)
  293: 2. 주요 증상
  294: 3. 원인·위험 요인
  295: 4. 진단 방법 (일반론)
  296: 5. 치료 옵션 개요 (Treatment Detail로 링크)
  297: 6. 예방·관리
  298: 7. 자주 묻는 질문
  299: 8. 관련 시술 (백링크)
  300: 9. 관련 의료진
  301: 
  302: **헤딩 위계**: H1 질환명 / H2 "주요 증상", "원인", "진단", "치료", "예방·관리", "자주 묻는 질문"
  303: **필수 블록**: 정의 / 주요 증상 / 원인 / 치료 옵션 / 예방
  304: **선택 블록**: 진단 / FAQ / 관련 시술 / 관련 의료진
  305: **레이아웃 변형**: P-006 동일
  306: **위험도 기본값**: Medium
  307: **컴플라이언스 주의**: 진단·치료 단정 금지. 자가 진단 유도 금지. 일반 의학 정보로 한정.
  308: **내부 링크 권장**: → 관련 Treatments / 관련 Articles / FAQ
  309: 
  310: ### P-009. Articles List
  311: 
  312: **목적**: 인사이트·정보 콘텐츠 목록.
  313: **URL**: `/insights` 또는 `/blog`
  314: **주 데이터 계약**: `Article[]`
  315: **Schema 요약**: BreadcrumbList + ItemList 또는 Blog.
  316: 
  317: **정보 슬롯**: Article 카드(제목·요약·저자·발행일·읽기 시간·카테고리·콘텐츠 형식 배지) / 카테고리 필터·페이지네이션·검색
  318: **헤딩 위계**: H1 "인사이트" / H2 Pillar 그룹
  319: **필수 블록**: Article 카드 목록
  320: **선택 블록**: 카테고리 필터 / 검색 / RSS / 콘텐츠 형식 필터
  321: **레이아웃 변형**: 카드 그리드 / 매거진 리스트 / 잡지형
  322: **위험도 기본값**: Low
  323: **컴플라이언스 주의**: 발췌 요약에 의학적 단정 금지.
  324: **내부 링크 권장**: → 각 Article Detail / 카테고리 페이지
  325: 
  326: > v0.5 비고: Article에 `contentFormat`(article·video·column) 필드. P-009는 분할하지 않고 형식 배지·필터로 분류.
  327: 
  328: ### P-010. Article Detail
  329: 
  330: **목적**: 단일 인사이트·정보 콘텐츠. AI 스니펫 인용 핵심 단위.
  331: **URL**: `/insights/{category}/{slug}` 또는 `/blog/{slug}`
  332: **주 데이터 계약**: `Article`
  333: **Schema 요약**: `Article` (headline, datePublished, dateModified, author=Physician/Person, publisher, mainEntityOfPage, articleSection, wordCount, inLanguage) + BreadcrumbList + (Q&A 블록 시) FAQPage + (video 시) VideoObject.
  334: 
  335: **정보 슬롯**:
  336: 1. 제목 + 핵심 요약 (1~2문장)
  337: 2. 메타 (저자·발행일·수정일·읽기 시간·카테고리·콘텐츠 형식 배지)
  338: 3. 본문 (의도적 구조 — 헤딩·리스트·표·Q&A)
  339: 4. 임베디드 미디어 (`embeddedMedia[]`) — YouTube·외부 인용
  340: 5. **검수 정보** (`reviewedBy`) ⭐ — 의료진 검수자
  341: 6. **출처·재게재** (`contentSource`·`externalUrl`) ⭐ — 자체 작성 / 외부 인용 / 재게재 명시
  342: 7. 저자 프로필 카드 (DoctorProfile 백링크)
  343: 8. 관련 글 (같은 Pillar 3개)
  344: 9. 관련 시술·질환
  345: 10. CTA
  346: 
  347: > ⭐ = v0.5 신규 슬롯 (DATA_MODEL v0.4 Article 신규 필드)
  348: 
  349: **헤딩 위계**: H1 글 제목 / H2 본문 섹션 (질문형 권장)
  350: **필수 블록**: 제목 / 메타 / 본문 / 저자 카드
  351: **선택 블록**: 임베디드 미디어 / 검수 정보 / 관련 글 / 관련 시술 / FAQ / CTA
  352: 
  353: **ArticleType별 위험도 분류**:
  354: 
  355: | ArticleType | 기본 위험도 |
  356: |---|:---:|
  357: | `notice` | Low |
  358: | `general-medical-info` | Medium |
  359: | `treatment-explainer` | Medium |
  360: | `condition-explainer` | Medium |
  361: | `effect-result-related` | **High** |
  362: | `review-case` | **High** |
  363: | `event-price` | **High** |
  364: 
  365: **레이아웃 변형**: 좌본문·우사이드바 / 풀폭 본문 / 매거진형
  366: 
  367: **컴플라이언스 주의**: 수정 시 `dateModified` 갱신. 의료진 검토 필수 (Medium/High). Embedded video도 ArticleType·RiskLevel 적용. `contentSource: republished` 시 원본 권한·출처 표시 의무. `reviewedBy`는 의료진(DoctorProfile) 참조.
  368: 
  369: **내부 링크 권장**: → 저자 프로필 / 관련 Articles / 관련 Treatments / 관련 Conditions
  370: 
  371: ### P-011. FAQ
  372: 
  373: **목적**: 자주 묻는 질문. AI 스니펫·사이트 브리핑 직접 인용 후보.
  374: **URL**: `/faq`
  375: **주 데이터 계약**: `FAQ[]`
  376: **Schema 요약**: `FAQPage` (mainEntity = Question[]) + BreadcrumbList.
  377: 
  378: **정보 슬롯**: 카테고리 그룹별 Q&A 쌍
  379: **헤딩 위계**: H1 "자주 묻는 질문" / H2 카테고리명 / H3 각 질문(또는 아코디언)
  380: **필수 블록**: Q&A 쌍 모음
  381: **선택 블록**: 카테고리 필터 / 검색
  382: **레이아웃 변형**: 아코디언 / 평면 리스트 / 카드 / 탭
  383: 
  384: **위험도 — 답변 단위 분류**:
  385: 
  386: | 답변 주제 | 등급 |
  387: |---|---|
  388: | 진료·예약·위치·시간 | Low |
  389: | 시술·치료 일반론 | Medium |
  390: | 치료 효과·결과·후기 | High |
  391: | 가격·이벤트 | High |
  392: 
  393: **컴플라이언스 주의**: 효과 단정·"100% 안전" 금지.
  394: **내부 링크 권장**: → 관련 Treatment / Article / Condition
  395: 
  396: ### P-012. Contact / Visit — Conversion Hub
  397: 
  398: **목적**: 위치·진료시간·예약·상담 채널의 통합 전환 허브. 단순 안내 페이지가 아닌 **다중 CTA 채널 집결지**. M0 필수.
  399: **URL**: `/contact` 또는 `/visit`
  400: **주 데이터 계약**: `ClinicProfile` (요약) + `LocationProfile[]` (1개 이상) + `CTAConfig[]`
  401: **Schema 요약**: 단지점은 `MedicalClinic`/`LocalBusiness`. 다지점은 본원 + 각 지점 별도 LocalBusiness. BreadcrumbList.
  402: 
  403: **정보 슬롯**:
  404: 1. **예약·상담 채널 집결** — 전화·네이버예약·네이버톡톡·카카오톡·온라인폼·비대면진료·외부 예약 (모두 `CTAConfig[]`)
  405: 2. 주소·지도 (단지점 main 또는 다지점 목록)
  406: 3. 진료시간·접수시간·점심·휴진 (`BusinessHours`)
  407: 4. 대중교통·주차 안내
  408: 5. 다지점인 경우 — 지점 목록 + 각 P-014 Location Detail 링크
  409: 6. 응급·긴급 대응 (해당 시)
  410: 7. 진료 전 준비 사항 (해당 시)
  411: 
  412: **헤딩 위계**: H1 "방문 안내" 또는 "예약·상담" / H2 "예약 채널", "위치", "진료시간", "오시는 길", "다른 지점"
  413: **필수 블록**: 예약·상담 채널(다중) / 주소 / 진료시간 / 연락처
  414: **선택 블록**: 지도 / 대중교통 / 주차 / 다지점 목록 / 응급 안내
  415: **레이아웃 변형**: 분할 / 풀폭 지도+CTA 카드 / 채널 카드 그리드 + 위치 분리
  416: **위험도 기본값**: Low
  417: **컴플라이언스 주의**: 표시 정보(주소·전화·시간) 정확성 유지. 변경 시 즉시 갱신. 이벤트·할인과 결합 시 High 격상.
  418: **내부 링크 권장**: → Home / About / Doctors List / Reservation(있을 시) / 각 Location Detail(다지점)
  419: 
  420: ### P-013. Legal / Policy — **M0 출시 게이트** ⭐ v0.5 격상
  421: 
  422: **목적**: 개인정보처리방침·이용약관·비급여 진료 등 정책 페이지. **법적·규제 의무**. 폼·예약·분석 스크립트 운영 시 사실상 필수 (개인정보보호법·정통망법). M0 출시 게이트.
  423: **URL**: `/privacy`, `/terms`, `/non-covered` 등
  424: **주 데이터 계약**: `LegalDocument`
  425: **Schema 요약**: 일반적으로 `WebPage`. 검색 노출 우선순위 낮음.
  426: 
  427: **M0 자동 생성 규칙** (v0.5 신규, v0.6 SoT 정정):
  428: - Core가 **표준 템플릿** 보유: 개인정보처리방침·이용약관·비급여 진료 안내·환불·민원 처리 등 1차 템플릿.
  429: - 빌드 시 `LegalDocument` 인스턴스 데이터 + **ClinicProfile 변수** (`{{clinic.name}}`·`{{clinic.legalEntityName}}`·`{{clinic.businessRegistrationNumber}}`·`{{clinic.founder}}`) + **LocationProfile(main) 변수** (`{{location.main.address}}`·`{{location.main.telephone}}`·`{{location.main.email}}`) — 출처 SoT 준수.
  430: - **어드민 화면 추가 없음** — M0 어드민 화면 수 6개 유지. 운영자는 ClinicProfile 입력 시 정책 변수(개인정보 보호 책임자·시행일 등)만 추가 입력하거나, LegalDocument 파일을 Git에 수동 보강.
  431: - 1호 출시 전 **법무 검토 필수** (ComplianceRecord.legalCounsel·legalCounselAt 필드 — DATA_MODEL.md C-10 위험도 Low 예외 룰 참조).
  432: 
  433: **정보 슬롯**:
  434: 1. 정책 종류·제목
  435: 2. 시행일·최종 개정일
  436: 3. 본문 (조항·항목 위계)
  437: 4. 개정 이력 (필요 시)
  438: 5. 문의처 (개인정보 보호 책임자 등)
  439: 
  440: **헤딩 위계**: H1 정책 제목 / H2 조항·항목명
  441: **필수 블록**: 시행일 / 본문 / 문의처
  442: **선택 블록**: 개정 이력
  443: **레이아웃 변형**: 평면 본문 / TOC 사이드바
  444: **위험도 기본값**: Low (사실 안내. 법적 정확성 확인 필수)
  445: **컴플라이언스 주의**:
  446: - 법적 의무 — **법무 검토 필수** (ComplianceRecord.contentType=LegalDocument로 추적).
  447: - 의료법·개인정보보호법·정통망법·표시광고법 준수.
  448: - 표준 템플릿 그대로 사용 시에도 클라이언트 사업자번호·연락처·시행일·법인명 등 변수 정확성 확인.
  449: 
  450: **내부 링크 권장**: 푸터 전체 접근. 본문 내부 링크는 일반적으로 없음.
  451: 
  452: ### P-014. Location / Branch Detail
  453: 
  454: **목적**: 단지점·다지점 의료기관의 개별 지점 상세. 단일 지점도 main location으로 모델링.
  455: **URL**: `/locations/{slug}` (단일이면 `main`)
  456: **주 데이터 계약**: `LocationProfile`
  457: **Schema 요약**: `MedicalClinic`/`LocalBusiness` (지점 단위 별도 entity) + BreadcrumbList. 본원·지점 각자.
  458: 
  459: **정보 슬롯**:
  460: 1. 지점명·간략 소개
  461: 2. 주소·지도 임베드 (지점 좌표)
  462: 3. 진료시간·접수시간·점심·휴진 (`BusinessHours`) — 지점별
  463: 4. 예약·상담 채널 (`CTAConfig[]`) — 지점 직통
  464: 5. 대중교통·주차 안내 (지점 특화)
  465: 6. 지점 의료진
  466: 7. 지점 시술 (전체 또는 지점 특화)
  467: 8. 지점 사진·시설
  468: 9. 다른 지점 안내 (Locations List 또는 형제 지점)
  469: 
  470: **헤딩 위계**: H1 "{ClinicName} {지점명}점" / H2 "위치", "진료시간", "예약·상담", "의료진", "오시는 길"
  471: **필수 블록**: 주소 / 진료시간 / 연락처·예약 채널 / 지점 의료진
  472: **선택 블록**: 지도 / 대중교통 / 주차 / 시설 사진 / 다른 지점
  473: **레이아웃 변형**: 분할 / 풀폭 / 매거진형
  474: **위험도 기본값**: Low
  475: **격상 조건**: 지점별 이벤트·할인·후기·전후사진 → High
  476: **컴플라이언스 주의**: 지점 정보 정확성·즉시 갱신. 비교·최상급 금지.
  477: **내부 링크 권장**: → Home / Contact / 다른 Location Detail / 해당 지점 Doctors
  478: 
  479: **🔧 단지점 인스턴스의 자동 생성 규칙 (v0.6 정합)**:
  480: 
  481: > 어드민 § 3.8.1의 매핑 표가 단일 진실 원본. 본 문서는 요약.
  482: 
  483: - 운영자가 어드민의 **ClinicProfile 화면 두 섹션**(기관 정체성 + 본원 위치·연락·시간)을 입력하면, 어드민이 두 파일을 동시 출력:
  484:   - **`ClinicProfile`** — 기관 정체성 섹션 입력값
  485:   - **`LocationProfile`**(slug=`main`) — 본원 위치·연락·시간 섹션 입력값 (LocationProfile이 위치·시간·연락 SoT)
  486: - LocationProfile main 자동 매핑 핵심:
  487:   - `name` = ClinicProfile의 `name` (또는 "본원")
  488:   - `parentClinic` = ClinicProfile의 `@id`
  489:   - `address`·`telephone`·`email`·`businessHours` = 본원 위치·연락·시간 섹션 입력값
  490:   - `representativeDoctors`·`doctorsAtLocation`·`availableTreatments` = 기본 전체 (운영자가 별도 지정 가능)
  491:   - **`reservationChannels`** = ClinicProfile의 `primaryCtas[]` 상속 (지점 직통 채널 별도 지정 가능)
  492:   - **`featuredChannelId`** (선택) — 강조할 채널이 있을 때만 `reservationChannels[]`의 `@id` 명시
  493: - **어드민 별도 LocationProfile 입력 화면 추가 불필요** (M0 어드민 화면 수 6개 유지).
  494: - 다지점 확장 시 별도 LocationProfile 추가 화면 도입 (Phase Beta+).
  495: 
  496: **다지점 인스턴스의 처리**: `LocationProfile` N개. P-012 Contact는 통합 안내 + 각 P-014 페이지로 링크.
  497: 
  498: ---
  499: 
  500: ## 4. 선택 페이지 타입 상세
  501: 
  502: ### P-101. Reviews — High-risk commercial
  503: 
  504: **목적**: 환자 후기 노출. 솔루션의 가장 위험한 영역.
  505: **URL**: `/reviews`
  506: **주 데이터 계약**: `ReviewPolicy` (필수) + 후기 콘텐츠
  507: **Schema 요약**: `Review` 사용 신중. BreadcrumbList만 권장.
  508: **활성화**: Add-on + 법무·외부 자문 + compliance-assistant 자동 검수
  509: **정보 슬롯**: ReviewPolicy에 따라 결정 — 일반적으로 후기 카드 / 정책 안내 / (등록 안내)
  510: **헤딩 위계**: H1 "환자 후기" / H2 분류·정렬
  511: **필수 블록**: 정책 안내 / 후기 카드
  512: **레이아웃 변형**: 카드 그리드 / 리스트 / 슬라이더(주의)
  513: **위험도 기본값**: **High**
  514: **컴플라이언스 주의**: 의료법 제56조·제57조 위반 소지. 효과 단정 후기 금지. 전후사진은 의료광고심의 대상. "환자 주관적 경험" 명시 + 의학적 효과 분리. 법무 자문 권장.
  515: 
  516: ### P-102. Pricing — High-risk commercial
  517: 
  518: **목적**: 진료·시술 비용 정보.
  519: **URL**: `/pricing`
  520: **주 데이터 계약**: `PricingPage`
  521: **Schema 요약**: 신중. `Offer` 부적합. `WebPage`만 권장.
  522: **활성화**: Add-on + compliance-assistant
  523: **정보 슬롯**: 진료 항목·간략 설명 / 가격(범위) / 비급여 명시 / 적용 조건 / 결제·환불 정책 / 문의
  524: **헤딩 위계**: H1 "가격 안내" / H2 진료 카테고리
  525: **필수 블록**: 진료 항목 / 가격 / 적용 조건
  526: **레이아웃 변형**: 표 / 카드 / 리스트
  527: **위험도 기본값**: **High**
  528: **컴플라이언스 주의**: 가격 광고 제한. "최저가·할인·특가" 금지. 비급여 명시. 이벤트·할인 결합 신중.
  529: 
  530: ### P-103. Facilities / Equipment
  531: 
  532: **목적**: 시설·장비 소개.
  533: **URL**: `/facilities`
  534: **주 데이터 계약**: `FacilitiesPage`
  535: **Schema 요약**: 일반적으로 `WebPage`.
  536: **활성화**: Instance 결정
  537: **정보 슬롯**: 진료 환경 개요 / 시설 카테고리 / 각 시설 사진·설명 / (해당 시) 장비 도입 사실·기본 사양 / 위생·관리 안내
  538: **헤딩 위계**: H1 "시설 안내" / H2 시설 카테고리
  539: **필수 블록**: 시설 개요 / 시설 사진·설명
  540: **레이아웃 변형**: 갤러리 / 카드 / 타임라인
  541: **위험도 기본값**: Medium
  542: **컴플라이언스 주의**: 시설·장비 효과·우월성 단정 금지. "국내 유일·최첨단·최고급" 등 금지.
  543: 
  544: ### P-104. News / Event (소식·이벤트)
  545: 
  546: **목적**: 의료기관 소식·이벤트 안내.
  547: **URL**: `/news`
  548: **주 데이터 계약**: `NewsItem[]` (또는 `Article[]` ArticleType 활용)
  549: **Schema 요약**: 일반 소식은 `Article` 또는 `NewsArticle`. 이벤트 콘텐츠는 schema 신중.
  550: **활성화**: 일반 소식 Instance 결정 / 이벤트 카테고리는 Add-on
  551: **정보 슬롯**: 소식 목록 카드(제목·날짜·요약) / 카테고리(일반·이벤트·휴진)
  552: **헤딩 위계**: H1 "소식" / H2 카테고리
  553: **필수 블록**: 소식 카드 목록
  554: **레이아웃 변형**: 카드 / 타임라인 / 잡지형
  555: **위험도 기본값 — 카테고리별 가변**:
  556: 
  557: | 카테고리 | 등급 |
  558: |---|---|
  559: | 일반 소식·휴진·이전 | Low |
  560: | 이벤트·할인 | **High** (commercial) |
  561: 
  562: **컴플라이언스 주의**: 이벤트·할인은 의료광고법 가장 엄격. 사전심의 필요성 신중. 환자 유인 표현 금지. 노출 자동 만료 권장.
  563: 
  564: ### P-105. Reservation
  565: 
  566: **목적**: 예약 안내·전환. 외부 예약 시스템 통합. 전환 추적 단위.
  567: **URL**: `/reservation`
  568: **주 데이터 계약**: `ReservationPage` (ClinicProfile 필드 참조)
  569: **Schema 요약**: `MedicalClinic`/`LocalBusiness`의 `potentialAction` ReserveAction. BreadcrumbList.
  570: **활성화**: Instance 결정 (Contact 통합 가능)
  571: **정보 슬롯**: 예약 채널 안내 / 예약 가능 시간 / 진료 전 준비 / 변경·취소 / 응급 진료
  572: **헤딩 위계**: H1 "예약 안내" / H2 채널·절차·주의사항
  573: **필수 블록**: 예약 채널 / 가능 시간 / 변경·취소
  574: **레이아웃 변형**: 채널 카드 / 단계형 가이드 / 분할
  575: **위험도 기본값**: Low
  576: **컴플라이언스 주의**: 사실 안내. 이벤트·할인 결합 시 High 격상.
  577: 
  578: ### P-106. Self-test / Quiz — Feature-backed optional page
  579: 
  580: **목적**: 사용자 셀프 진단·자가 테스트. 리드 생성·콘텐츠 차별화. 자생한방병원 사례 참조.
  581: **URL**: `/self-test/{slug}`
  582: **주 데이터 계약**: `SelfTest` (DM-06 후속 풀명세 예정)
  583: **Schema 요약**: `WebPage` 또는 `MedicalWebPage` + `FAQPage` 일부.
  584: **활성화**: **Feature Module이 콘텐츠·로직 제공** — Self-test가 단순 정적 페이지가 아니라 동적 입력·결과 해석을 포함하므로 별도 Feature Module이 자연스러움. 후보 모듈명: `self-test-module` 또는 `compliance-assistant` 확장. (PT-12 해소 — Feature-backed 결정)
  585: 
  586: **정보 슬롯**: 테스트 제목·목적 / 설계자 의료진 / 고지문 / 문항 / 결과 안내 / 결과 → 상담 CTA / 관련 콘텐츠
  587: **헤딩 위계**: H1 테스트명 / H2 "테스트 안내", "결과 해석", "전문 상담 안내"
  588: **필수 블록**: 고지문 / 문항 / 결과 안내 / 상담 CTA
  589: **선택 블록**: 설계자 의료진 / 점수 산정 / 관련 콘텐츠
  590: **레이아웃 변형**: 단계형 / 일괄형 / 카드형
  591: **위험도 기본값**: Medium
  592: **격상 조건**: 결과에서 진단·치료 단정 → High. 특정 시술 권유 결합 → High.
  593: **컴플라이언스 주의**: 진단 단정 금지. 결과는 "참고용·의료진 상담 권장". 설계자 의료진 검토 필수.
  594: **내부 링크 권장**: → 관련 Treatment / Condition / Article / Reservation
  595: 
  596: > **1호 클라이언트 적용 후보**: 다이어트 유형 체크, 요요 위험도 체크, 체질 기반 사전문진. **M0 외 — Phase Alpha~Beta 도입 검토**.
  597: 
  598: ---
  599: 
  600: ## 5. 페이지 타입 매트릭스 (전체 한눈에)
  601: 
  602: | ID | 이름 | URL | 주 데이터 계약 | 주 Schema | 위험도 기본 | High-risk | M0 |
  603: |---|---|---|---|---|:---:|:---:|:---:|
  604: | P-001 | Home | `/` | ClinicProfile | Organization + MedicalClinic + WebSite | Low | | ✅ |
  605: | P-002 | About | `/about` | ClinicProfile | Organization + MedicalClinic | Low | | ✅ |
  606: | P-003 | Doctors List | `/doctors` | DoctorProfile[] | ItemList | Low | | ✅ |
  607: | P-004 | Doctor Profile | `/doctors/{slug}` | DoctorProfile | Physician | Low | | ✅ |
  608: | P-005 | Treatments List | `/treatments` | TreatmentPage[] | ItemList | Low | | ✅ |
  609: | P-006 | Treatment Detail | `/treatments/{slug}` | TreatmentPage | MedicalProcedure | Medium | | ✅ |
  610: | P-007 | Conditions List | `/conditions` | MedicalConditionPage[] | ItemList | Low | | |
  611: | P-008 | Condition Detail | `/conditions/{slug}` | MedicalConditionPage | MedicalCondition | Medium | | |
  612: | P-009 | Articles List | `/insights` | Article[] | ItemList/Blog | Low | | |
  613: | P-010 | Article Detail | `/insights/{cat}/{slug}` | Article | Article (+VideoObject) | ArticleType 가변 | | ✅ (1) |
  614: | P-011 | FAQ | `/faq` | FAQ[] | FAQPage | 답변 가변 | | |
  615: | P-012 | Contact / Visit (Conversion Hub) | `/contact` | ClinicProfile + LocationProfile[] | MedicalClinic/LocalBusiness | Low | | ✅ |
  616: | P-013 | Legal / Policy | `/privacy` 등 | LegalDocument | WebPage | Low | | ✅ (자동) |
  617: | P-014 | Location / Branch Detail | `/locations/{slug}` | LocationProfile | MedicalClinic/LocalBusiness (지점) | Low | | ✅ (main) |
  618: | P-101 | Reviews | `/reviews` | ReviewPolicy + 후기 | (신중) | High | ✅ | |
  619: | P-102 | Pricing | `/pricing` | PricingPage | (신중) | High | ✅ | |
  620: | P-103 | Facilities / Equipment | `/facilities` | FacilitiesPage | WebPage | Medium | | |
  621: | P-104 | News / Event | `/news` | NewsItem[]/Article[] | NewsArticle/Article | 가변 | ✅ (이벤트) | |
  622: | P-105 | Reservation | `/reservation` | ReservationPage | LocalBusiness + ReserveAction | Low | | |
  623: | P-106 | Self-test / Quiz | `/self-test/{slug}` | SelfTest (Feature-backed) | WebPage / MedicalWebPage | Medium | | |
  624: 
  625: ---
  626: 
  627: ## 6. Vertical Slice (M0) 페이지 타입 — 11개 페이지 (EAT v0.x EC-CASCADE-08: P-011 FAQ M0 합류)
  628: 
  629: | 순서 | 페이지 타입 | 비고 |
  630: |---|---|---|
  631: | 1 | P-001 Home | 메인 |
  632: | 2 | P-002 About | ClinicProfile 노출 |
  633: | 3 | P-003 Doctors List | DoctorProfile 1명 이상 |
  634: | 4 | P-004 Doctor Profile | 1개 이상 |
  635: | 5 | P-005 Treatments List | TreatmentPage 1개 이상 |
  636: | 6 | P-006 Treatment Detail | 1개 이상 |
  637: | 7 | P-012 Contact (Conversion Hub) | ClinicProfile + LocationProfile[] |
  638: | 8 | P-014 Location Detail (main 자동) | 어드민 화면 추가 없이 자동 생성 (§ 3 P-014 규칙) |
  639: | **9** | **P-013 Legal / Policy (자동 생성)** | Core 표준 템플릿 + ClinicProfile · LocationProfile(main) 변수 치환 자동 생성. 어드민 화면 추가 없음. **출시 게이트** (법무 검토 필수 — ComplianceRecord.legalCounsel/legalCounselAt required) |
  640: | (샘플) | P-010 Article Detail | 1개 샘플 (Home에서 직접 링크 — 고립 회피) |
  641: 
  642: **M0 어드민 화면 수: 6개 유지** (대시보드 / ClinicProfile / DoctorProfile / TreatmentPage / Article / 미리보기·발행). P-012·P-014·P-013은 모두 ClinicProfile·LocationProfile 입력값과 Core 표준 템플릿으로 자동 생성되므로 별도 화면 불필요.
  643: 
  644: **M0 미합류 합류 우선순위**:
  645: 1. P-009 Articles List
  646: 2. P-011 FAQ
  647: 3. P-007/P-008 Conditions (다이어트 한의원 증상 기반 쿼리)
  648: 
  649: ---
  650: 
  651: ## 7. 페이지 타입 추가·변경 정책
  652: 
  653: - 새 페이지 타입 추가 = Core MAJOR 변경. 데이터 계약·Schema·디자인 영향. `release/VERSIONING_POLICY.md` 적용.
  654: - 선택 페이지 타입 채택 = Preset/Instance 결정.
  655: - 업종 특화 페이지 = Preset 추가 정의 (예: 한의원의 "체질 분석").
  656: 
  657: ---
  658: 
  659: ## 8. 미결정 사항
  660: 
  661: | ID | 항목 | 비고 |
  662: |---|---|---|
  663: | PT-01 | Articles vs Blog 명명 | Preset/Instance |
  664: | PT-02 | Category 페이지 별도 타입 | 콘텐츠 누적 후 |
  665: | PT-03 | Search 페이지 별도 타입 | Phase Beta+ |
  666: | PT-04 | ~~다지점 페이지 타입~~ | 해소 — P-014 |
  667: | PT-05 | 한의원 특화 페이지 (체질 분석) | Preset 신설 시 |
  668: | PT-06 | ~~정책 페이지 표준화~~ | 해소 — P-013 |
  669: | PT-07 | P-105 Reservation vs Contact 통합 | Instance 결정 |
  670: | PT-08 | ArticleType 7종 충분성 | RISK_LEVELS.md |
  671: | PT-09 | FAQ 답변 단위 위험도 UI | admin |
  672: | PT-10 | ~~Self-test 도입~~ | 해소 — P-106 |
  673: | PT-11 | Article video contentFormat의 VideoObject schema 깊이 | SCHEMA_MAPPING.md |
  674: | PT-12 | ~~P-106 Feature Module vs Core 페이지~~ | **v0.5 해소 — Feature-backed optional page로 결정** |
  675: | PT-13 | High-risk commercial pages Add-on 정책 구체화 | compliance/admin |
  676: | PT-14 | LocationProfile main 자동 생성 규칙의 어드민 구현 세부 | admin/ARCHITECTURE.md |
  677: 
  678: ---
  679: 
  680: ## 9. 변경 이력
  681: 
  682: | 일자 | 버전 | 변경 |
  683: |---|---|---|
  684: | 2026-05-13 | v0.1 | 최초 — 필수 12 + 선택 4 |
  685: | 2026-05-13 | v0.2 | P-013 격상, P-105 신설, P-103 명칭 확장, 위험도 격상 조건표, M0 Contact 추가 |
  686: | 2026-05-13 | v0.3 | 레퍼런스 분석 반영 — P-106 Location 신설(선택), About 슬롯 보강, programVariants, contentFormat |
  687: | 2026-05-13 | v0.4 | DEEP_DIVE 통합 1단계 — 번호 체계 재정렬(P-014 Location 필수, P-106 Self-test), Contact Conversion Hub, High-risk 묶음, M0 8+1=9 |
  688: | 2026-05-14 | v0.5 | **피드백 적용**: (1) **전체 본문 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, 단독 구현 명세화, (2) **P-014 LocationProfile main 자동 생성 규칙 명시** (어드민 화면 추가 없음), (3) **P-006 TreatmentPage 정보 슬롯에 treatmentComponents·recommendedFor·visitFlow·remoteCareAvailable·maintenancePlan·evidenceNotes 즉시 통합**, (4) **P-010 Article 정보 슬롯에 reviewedBy·contentSource·externalUrl 즉시 통합**, (5) **P-106 Self-test를 "Feature-backed optional page"로 표현 변경** (PT-12 해소), (6) PT-14 LocationProfile 자동 생성 규칙 어드민 구현 세부 신규, (7) **v0.5.1 추가 정정**: **P-013 Legal/Policy를 M0 출시 게이트로 격상** — Core 표준 템플릿 + ClinicProfile 변수 자동 치환 생성. M0 페이지 수 9 → **10**. 어드민 화면 수 6개 그대로 (자동 생성). 법무 검토 필수 (ComplianceRecord 추적) |
  689: | 2026-05-14 | v0.6 | **피드백 정정**: P-013 자동 생성 규칙의 **변수 출처 SoT 정합화** — ClinicProfile 변수(`{{clinic.*}}`) + LocationProfile(main) 변수(`{{location.main.*}}`) 분리 명시. SoT 원칙 준수 |
  690: | 2026-05-14 | v0.7 | **피드백 정정**: (1) § 0 요약 SoT 정합 표현 정정 — "ClinicProfile 입력" → "ClinicProfile 화면의 기관 정체성 + 본원 위치·연락·시간 입력", (2) **§ 3 P-014 자동 생성 규칙 정합 갱신** — `reservationChannels = primaryCtas 상속` 및 `featuredChannelId` (선택, v0.6 신규) 흐름 명시. admin § 3.8.1과 동기화 |
  691: | 2026-05-14 | v0.8 | **피드백 정정**: § 6 M0 표 P-013 비고를 SoT 정합으로 정정 — "v0.5 격상 — ClinicProfile 변수 치환" → "ClinicProfile · LocationProfile(main) 변수 치환, 출시 게이트, 법무 검토 필수". 잔존 버전 표기(§ 6 제목 "(v0.5 갱신)" 등) 제거 |

 succeeded in 765ms:
    1: # Core — 데이터 계약 명세
    2: 
    3: > **상태**: Draft v0.24
    4: > **작성일**: 2026-05-15 (v0.24 — Spike 결정 SPIKE2-03 cascade: C-23 AdminUser.instanceMemberships에 `active`·`deactivatedAt`·`deactivatedBy` 필드 추가. resolveTenantContext 매 요청 검증 강제)
    5: > **소유자**: Glitzy
    6: > **상위 문서**: `docs/ARCHITECTURE.md` § 2.4, § 7
    7: > **연관 문서**:
    8: > - 페이지 타입 → `core/PAGE_TYPES.md`
    9: > - Schema 매핑 → `core/SCHEMA_MAPPING.md`
   10: > - 위험도 → `compliance/RISK_LEVELS.md`
   11: > - 디자인 토큰 → `core/DESIGN_TOKENS.md`
   12: > - 어드민 데이터 모델 → `admin/DATA_MODEL.md`
   13: > - 레퍼런스 분석 → `research/REFERENCE_ANALYSIS_2026-05.md`, `research/REFERENCE_DEEP_DIVE_2026-05.md`
   14: 
   15: ---
   16: 
   17: ## 0. 한 페이지 요약
   18: 
   19: - **23개 계약 (C-01~C-23) + 3개 공통 타입 (CT-01~CT-03)**.
   20: - v0.13: `features/notifications.md` cascade — C-08 확장(`adminBaseUrl`·`timezone`·`NotificationChannelsConfig`) + **C-23 `AdminUser` 신설** (어드민 사용자·자격·알림 선호 SoT).
   21: - 모든 계약은 공통 메타필드(`@id`, `@createdAt`, `@updatedAt`).
   22: - 빌드 입력 계약(Git 원본)과 운영 메타 계약(어드민 DB 원본) 구분.
   23: - **SoT 원칙**: `ClinicProfile`은 브랜드·기관 정체성·메타 통계만, **위치·전화·시간은 `LocationProfile`이 마스터**.
   24: - **RiskLevel은 enum 직접 사용** (`Ref<C-05>` 표기 제거).
   25: - v0.4: TreatmentPage·Article 컨텍스트 필드 즉시 통합 (1호 다이어트 한의원 직결).
   26: 
   27: ---
   28: 
   29: ## 1. 계약 인벤토리
   30: 
   31: ### 1.1 데이터 계약 (25개) — EC-CASCADE-01 patch (v0.10·EAT_CONTENT_PLAN v0.x acceptance commit)
   32: 
   33: | ID | 계약 이름 | 책임 | 소속 | 마스터 | M0 | 관련 페이지 타입 |
   34: |---|---|---|:---:|:---:|:---:|---|
   35: | C-01 | `ClinicProfile` | 의료기관 정체성 (브랜드·메타) | L3 | Git | ✅ | P-001, P-002 |
   36: | C-02 | `DoctorProfile` | 의료진 권위·전문성 | L3 | Git | ✅ | P-003, P-004 |
   37: | C-03 | `TreatmentPage` | 시술·치료 구조화 콘텐츠 | L3 | Git | ✅ | P-005, P-006 |
   38: | C-04 | `Article` | 인사이트·블로그 글 (category Ref<C-22> required) | L3 | Git | ✅ | P-009, P-010 |
   39: | C-05 | `RiskLevel` | 위험도 등급 (enum) | L1/L3 | Git+DB | ✅ | 전체 |
   40: | C-06 | `PageMeta` | 페이지별 메타 데이터 | L1/L3 | Git | ✅ | 전체 |
   41: | C-07 | `BrandTokens` | 디자인 토큰 최종값 | L3 | Git | ✅ | UI |
   42: | C-08 | `InstanceManifest` | 버전 고정 명세 | L3 | Git | ✅ | 빌드 |
   43: | C-09 | `FeatureModuleConfig` | Feature Module 설정 | L3 | Git | ✅ | 모듈 |
   44: | C-10 | `ComplianceRecord` | 컴플라이언스 게이트 통과 기록 | L1/L3 | DB+Git | ✅ | 발행 |
   45: | C-11 | `MedicalConditionPage` | 증상·질환 정보 | L3 | Git | | P-007, P-008 |
   46: | C-12 | `FAQ` | 질문-답변 묶음 (EAT v0.x 풀명세 합류 — § 4 C-12 본문 참조) | L3 | Git | ✅ | P-011 |
   47: | C-13 | `ReviewPolicy` | 후기 노출 정책 | L2+L3 | Git | | P-101 |
   48: | C-14 | `MedicalSpecialty` | 의료 전문 분야 | L2 | Git | | C-01,02 참조 |
   49: | C-15 | `SchemaInput` | JSON-LD 생성기 입력 | L1/L3 | 런타임 | ✅ | 전체 |
   50: | C-16 | `LegalDocument` | 정책·약관 (Core 표준 템플릿 + 변수 자동 치환) | L3 | Git | ✅ (auto) | P-013 |
   51: | C-17 | `PricingPage` | 가격 안내 | L3 | Git | | P-102 |
   52: | C-18 | `FacilitiesPage` | 시설·장비 | L3 | Git | | P-103 |
   53: | C-19 | `NewsItem` | 소식·이벤트 | L3 | Git | | P-104 |
   54: | C-20 | `ReservationPage` | 예약 안내 | L3 | Git | | P-105 |
   55: | C-21 | `LocationProfile` | 지점 정체성 (위치·시간·연락 마스터) | L3 | Git | ✅ | P-012, P-014 |
   56: | C-22 | `ArticleCategory` | Article Pillar/Category 정의 (EAT v0.x DB 실 운영 합류 — v0.1 어드민 UI minimal · parentCategory/pillar/coverImageUrl/seoMeta/articleTypeDefault 컬럼은 DB nullable + EC-DEFER-10) | L2+L3 | Git+DB | ✅ | P-009, P-010 |
   57: | C-23 | `AdminUser` | 어드민 사용자 (권한·자격·알림 선호 SoT) | L3 | DB | ✅ (admin) | 어드민 전용 |
   58: | C-24 | `Publication` | 학술 논문 외부 인용 (E-A-T 전문성 시그널 — schema.org `ScholarlyArticle`) — EAT v0.x 신규 | L3 | DB+Git | ✅ | P-002 About, P-004 Doctor Profile inline |
   59: | C-25 | `MediaAppearance` | 미디어 출연 (방송·유튜브·팟캐스트·언론 — schema.org `VideoObject`) — EAT v0.x 신규 | L3 | DB+Git | ✅ | P-002 About, P-004 Doctor Profile inline |
   60: 
   61: ### 1.2 공통 타입 (CT — Cross-cutting Type, 3개)
   62: 
   63: | ID | 공통 타입 | 책임 | 소속 | 사용처 |
   64: |---|---|---|:---:|---|
   65: | CT-01 | `TrustMetric` | 신뢰도·통계 지표 (기준·증빙 포함) | L1 정의 / L3 값 | ClinicProfile, LocationProfile, DoctorProfile |
   66: | CT-02 | `BusinessHours` | 진료시간·접수시간·점심·휴진 | L1 정의 / L3 값 | LocationProfile |
   67: | CT-03 | `CTAConfig` | 전환 채널 설정 | L1 정의 / L3 값 | ClinicProfile, LocationProfile, TreatmentPage |
   68: 
   69: ---
   70: 
   71: ## 2. 공통 룰
   72: 
   73: ### 2.1 타입 표기법
   74: 
   75: | 표기 | 의미 |
   76: |---|---|
   77: | `string`/`number`/`boolean` | 기본 |
   78: | `Date` | ISO 8601 |
   79: | `URL`/`Email`/`Phone`/`Slug` | 형식 제한 문자열 |
   80: | `Markdown` | Markdown 본문 |
   81: | `T[]` | 배열 |
   82: | `T \| U` | 합 타입 |
   83: | `enum {A, B, C}` | 열거형 |
   84: | `Ref<C-NN>` | 다른 계약의 `@id` 참조 |
   85: | `?` (필드 뒤) | optional |
   86: 
   87: ### 2.2 공통 메타 필드 (모든 계약)
   88: 
   89: | 필드 | 타입 | required | 설명 |
   90: |---|---|:---:|---|
   91: | `@id` | `Slug` | ✅ | 인스턴스 내 고유 식별자 |
   92: | `@createdAt` | `Date` | ✅ | 최초 생성 시각 |
   93: | `@updatedAt` | `Date` | ✅ | 최종 수정 시각 |
   94: | `@version` | `number` | optional | 계약 스키마 버전 |
   95: | `@provenanceAssetId` | `string` | optional | (v0.18 +) `features/asset-ingestion.md`이 생성한 경우 source IngestedAsset id. 어드민 manual hand-off 시에도 어드민 UI가 보존 (AI4-11). asset-ingestion이 자동 promote한 경우는 AssetPromotionRecord.targetContentRef와 cross-link |
   96: 
   97: ### 2.3 식별자(`@id`) 규약
   98: - 인스턴스 내 유일, slug 형식, 3~64자.
   99: - 변경 시 URL 변경 → 301 리다이렉트 매핑 필요 (어드민 책임 — DM-01).
  100: 
  101: ### 2.4 다국어
  102: - M0 한국어 기본. 다국어 시 필드 단위 객체 `{ko, en, ...}` 확장.
  103: 
  104: ### 2.5 SoT 원칙 (v0.4 명시)
  105: - **ClinicProfile**: 브랜드·기관 정체성·메타 통계만 보관 (`name`, `description`, `founderStory`, `awards`, `trustMetrics`, `medicalSpecialty`, `affiliatedInstitutes`, `mediaCoverage`, `socialMedia`, `internationalSupport`, `socialContribution`, `primaryCtas`, `logoUrl`, `ogImageUrl`).
  106: - **LocationProfile**: 위치·전화·이메일·진료시간·예약 채널의 **마스터**. 단지점 인스턴스도 `LocationProfile(slug=main)` 1개 필수.
  107: - ClinicProfile에 `mainAddress`/`mainTelephone`/`mainEmail`/`businessHours` 같은 필드 **없음**. 모든 위치·시간 정보는 LocationProfile 참조.
  108: 
  109: ### 2.6 변경 정책
  110: 
  111: | 변경 종류 | 분류 |
  112: |---|---|
  113: | optional 필드 추가 | MINOR |
  114: | required 필드 추가 | **MAJOR** |
  115: | 필드 타입 변경 (호환) | MINOR |
  116: | 필드 타입 변경 (비호환) | **MAJOR** |
  117: | 필드 제거 | **MAJOR** |
  118: | validation 강화 | 케이스별 |
  119: | validation 완화 | PATCH |
  120: | enum 값 추가 | MINOR |
  121: | enum 값 제거 | **MAJOR** |
  122: | 기본값 변경 | 케이스별 |
  123: 
  124: > 상위 `release/VERSIONING_POLICY.md` 참조.
  125: 
  126: ---
  127: 
  128: ## 3. 공통 타입 풀명세
  129: 
  130: ### CT-01. `TrustMetric` — 신뢰도·통계 지표
  131: 
  132: **목적**: 누적 환자 수·처방 수·논문 수·임상 데이터 등 **모든 수치 주장을 표준화**. 기준 기간·범위·증빙을 의무 또는 권장.
  133: 
  134: | 필드 | 타입 | required | 설명 |
  135: |---|---|:---:|---|
  136: | `@id` | `Slug` | ✅ | 지표 식별자 |
  137: | `label` | `string` | ✅ | 표시 라벨 (예: "누적 진료 환자") |
  138: | `value` | `number \| string` | ✅ | 값 |
  139: | `unit` | `string` | optional | 단위 ("명", "건", "년", "%") |
  140: | `measuredFrom` | `Date` | optional | 측정 시작일 |
  141: | `measuredTo` | `Date` | optional | 측정 종료일 |
  142: | `scope` | `enum {clinic, branch, network, doctor}` | ✅ | 측정 범위 |
  143: | `evidenceUrl` | `URL` | optional | 외부 검증 링크 |
  144: | `evidenceNote` | `string` | optional | 증빙 설명 |
  145: | `displayRiskLevel` | `RiskLevel` | optional | 노출 시 위험도 등급 |
  146: | `displayFormat` | `string` | optional | 노출 형식 템플릿 |
  147: 
  148: **컴플라이언스 룰**:
  149: - `value`만 있고 `measuredFrom`·`scope`·`evidenceUrl/Note` 모두 없으면 **빌드 시 경고**.
  150: - 단정형·과시형 라벨 ("국내 1위", "최대 누적") 시 자동 Medium 격상, 외부 검증 불일치 시 High 검토.
  151: - 사실 안내형 표현 권장 ("누적 N명을 진료해왔습니다").
  152: 
  153: ### CT-02. `BusinessHours` — 진료시간·접수시간·휴진
  154: 
  155: **목적**: 진료시간만으로 부족한 한국 의료기관의 실제 운영 패턴 반영.
  156: 
  157: | 필드 | 타입 | required | 설명 |
  158: |---|---|:---:|---|
  159: | `openingHours` | `OpeningHoursSpec[]` | ✅ | 진료 가능 시간 |
  160: | `receptionHours` | `OpeningHoursSpec[]` | optional | 접수 마감 시간 (초진·재진 다를 수 있음) |
  161: | `lunchBreaks` | `LunchBreak[]` | optional | 점심시간 |
  162: | `holidayPolicy` | `Markdown` | optional | 설·추석·공휴일 운영 |
  163: | `specialClosures` | `SpecialClosure[]` | optional | 특정일 휴진 |
  164: | `emergencyOrAfterHoursNote` | `Markdown` | optional | 야간·응급·콜센터 안내 |
  165: 
  166: **하위 타입**:
  167: 
  168: #### `OpeningHoursSpec`
  169: | 필드 | 타입 | required | 설명 |
  170: |---|---|:---:|---|
  171: | `dayOfWeek` | `enum {Mon, Tue, Wed, Thu, Fri, Sat, Sun, PublicHoliday}[]` | ✅ | 요일 |
  172: | `opens` | `string` | ✅ | `"HH:mm"` |
  173: | `closes` | `string` | ✅ | `"HH:mm"` |
  174: | `appliesTo` | `enum {general, firstVisit, returnVisit}` | optional | 대상 (기본 general) |
  175: | `note` | `string` | optional | |
  176: 
  177: #### `LunchBreak`
  178: | 필드 | 타입 | required | 설명 |
  179: |---|---|:---:|---|
  180: | `dayOfWeek` | `enum {Mon~Sun, PublicHoliday}[]` | ✅ | |
  181: | `from` | `string` | ✅ | |
  182: | `to` | `string` | ✅ | |
  183: 
  184: #### `SpecialClosure`
  185: | 필드 | 타입 | required | 설명 |
  186: |---|---|:---:|---|
  187: | `date` | `Date` | ✅ | |
  188: | `reason` | `string` | optional | |
  189: | `note` | `string` | optional | |
  190: 
  191: ### CT-03. `CTAConfig` — 전환 채널 설정
  192: 
  193: **목적**: 전화·온라인 예약·외부 메신저 등 모든 전환 채널을 일관 모델링.
  194: 
  195: | 필드 | 타입 | required | 설명 |
  196: |---|---|:---:|---|
  197: | `@id` | `Slug` | ✅ | 채널 식별자 |
  198: | `type` | `enum {phone, naver-reservation, naver-talk, kakao-talk, kakao-channel, form, map, external, sms, email, video-consultation}` | ✅ | 채널 종류 |
  199: | `label` | `string` | ✅ | 버튼·링크 텍스트 |
  200: | `targetUrl` | `URL \| string` | ✅ | URL 또는 전화번호 |
  201: | `iconKey` | `string` | optional | 아이콘 식별자 |
  202: | `style` | `enum {primary, secondary, minimal}` | optional | |
  203: | `displayOrder` | `number` | optional | 정렬 |
  204: | `displayContext` | `enum {floating, header, footer, hero, inline, modal, sidebar}[]` | optional | 노출 위치 |
  205: | `availableFor` | `Ref<C-21>[]` | optional | 특정 지점만 사용 |
  206: | `appointmentRequired` | `boolean` | optional | 예약 채널 여부 |
  207: | `consultationType` | `enum {appointment, inquiry, payment, support}` | optional | 채널 의도 |
  208: 
  209: > v0.5에서 추가했던 `isFeatured: boolean` 필드는 **v0.6에서 제거**. CTAConfig가 여러 컨테이너(ClinicProfile.primaryCtas / LocationProfile.reservationChannels / TreatmentPage.cta)에서 재사용될 가능성을 고려할 때, 객체 자체에 컨텍스트 의존 의미(강조 여부)를 두면 재사용 시 의도 누수 위험. 대신 **컨테이너 쪽에 `featuredChannelId: Slug`로 강조 표시** (LocationProfile § 4 참조). CTAConfig 객체는 컨텍스트 무관 데이터로 유지.
  210: 
  211: ---
  212: 
  213: ## 4. 데이터 계약 풀명세 (M0 핵심)
  214: 
  215: ### C-01. `ClinicProfile` — 의료기관 정체성 (브랜드·메타)
  216: 
  217: **v0.4 SoT 변경**: 위치·전화·시간 필드 **제거**. `locations[]` 통해 LocationProfile 참조.
  218: 
  219: | 필드 | 타입 | required | 설명 |
  220: |---|---|:---:|---|
  221: | `@id` | `Slug` | ✅ | 보통 `"clinic"` 단일 |
  222: | `name` | `string` | ✅ | 정식 명칭 (1~100자) |
  223: | `alternateName` | `string` | optional | 영문명 |
  224: | `legalEntityName` | `string` | optional | 법인 정식 명칭 |
  225: | `slogan` | `string` | optional | 한 줄 가치 |
  226: | `description` | `string` | ✅ | 80~300자 |
  227: | `longDescription` | `Markdown` | optional | About 본문 |
  228: | `foundingDate` | `Date` | optional | 설립일 |
  229: | `founder` | `string` | optional | 대표자명 |
  230: | `founderStory` | `Markdown` | optional | 대표 인사말·스토리 |
  231: | `medicalSpecialty` | `Ref<C-14>[]` | ✅ | 진료 전문 분야 |
  232: | `businessRegistrationNumber` | `string` | optional | 사업자등록번호 (`NNN-NN-NNNNN`) |
  233: | `awards` | `Award[]` | optional | 인증·수상 |
  234: | `memberOf` | `Affiliation[]` | optional | 학회·협회 |
  235: | `affiliatedInstitutes` | `ResearchInstitute[]` | optional | 연구 기관 |
  236: | `trustMetrics` | `TrustMetric[]` | optional | 누적 통계·연구 지표 (CT-01) |
  237: | `socialMedia` | `SocialMediaLinks` | optional | SNS·외부 채널 (sameAs) |
  238: | `mediaCoverage` | `MediaItem[]` | optional | 미디어 노출 이력 |
  239: | `internationalSupport` | `InternationalSupport` | optional | 외국인 환자 진료 지원 |
  240: | `socialContribution` | `Markdown` | optional | 사회공헌·후원 |
  241: | `primaryCtas` | `CTAConfig[]` | optional | 사이트 전반 주요 CTA |
  242: | `locations` | `Ref<C-21>[]` | ✅ | 지점 목록. 단지점은 1개(`main`), 다지점은 N개. 반드시 1개 이상 |
  243: | `logoUrl` | `URL` | ✅ | 로고 |
  244: | `ogImageUrl` | `URL` | ✅ | OpenGraph 기본 이미지 |
  245: 
  246: **하위 타입**:
  247: 
  248: #### `Address`
  249: | 필드 | 타입 | required | 설명 |
  250: |---|---|:---:|---|
  251: | `streetAddress` | `string` | ✅ | 도로명 상세 |
  252: | `addressLocality` | `string` | ✅ | 시·군 |
  253: | `addressRegion` | `string` | ✅ | 도·광역시 |
  254: | `postalCode` | `string` | ✅ | 우편번호 |
  255: | `addressCountry` | `string` | ✅ | ISO 3166-1 alpha-2 (예: `"KR"`) |
  256: 
  257: #### `GeoCoordinates`
  258: | 필드 | 타입 | required | 설명 |
  259: |---|---|:---:|---|
  260: | `latitude` | `number` | ✅ | |
  261: | `longitude` | `number` | ✅ | |
  262: 
  263: #### `Award`
  264: | 필드 | 타입 | required | 설명 |
  265: |---|---|:---:|---|
  266: | `name` | `string` | ✅ | 인증·수상명 |
  267: | `awardedBy` | `string` | optional | 수여 기관 |
  268: | `awardedDate` | `Date` | optional | |
  269: | `verificationUrl` | `URL` | optional | 검증 가능 링크 |
  270: 
  271: #### `Affiliation`
  272: | 필드 | 타입 | required | 설명 |
  273: |---|---|:---:|---|
  274: | `name` | `string` | ✅ | 학회·협회명 |
  275: | `role` | `string` | optional | |
  276: | `url` | `URL` | optional | |
  277: | `verified` | `boolean` | optional | |
  278: 
  279: #### `ResearchInstitute`
  280: | 필드 | 타입 | required | 설명 |
  281: |---|---|:---:|---|
  282: | `name` | `string` | ✅ | 연구 기관명 |
  283: | `description` | `string` | optional | |
  284: | `url` | `URL` | optional | |
  285: | `relationship` | `enum {affiliate, partner, owned}` | optional | |
  286: 
  287: #### `SocialMediaLinks`
  288: | 필드 | 타입 | required | 설명 |
  289: |---|---|:---:|---|
  290: | `naverBlog` | `URL` | optional | |
  291: | `instagram` | `URL` | optional | |
  292: | `youtube` | `URL` | optional | |
  293: | `kakao` | `URL` | optional | |
  294: | `facebook` | `URL` | optional | |
  295: | `linkedin` | `URL` | optional | |
  296: | `others` | `{label: string, url: URL}[]` | optional | |
  297: 
  298: #### `MediaItem`
  299: | 필드 | 타입 | required | 설명 |
  300: |---|---|:---:|---|
  301: | `outlet` | `string` | ✅ | 매체명 |
  302: | `title` | `string` | ✅ | |
  303: | `date` | `Date` | optional | |
  304: | `url` | `URL` | optional | |
  305: 
  306: #### `InternationalSupport`
  307: | 필드 | 타입 | required | 설명 |
  308: |---|---|:---:|---|
  309: | `languages` | `string[]` | ✅ | ISO 639-1 |
  310: | `interpreterAvailable` | `boolean` | optional | |
  311: | `internationalLanguagePages` | `{lang: string, url: URL}[]` | optional | |
  312: | `targetCountries` | `string[]` | optional | |
  313: 
  314: ### C-02. `DoctorProfile` — 의료진 권위·전문성
  315: 
  316: | 필드 | 타입 | required | 설명 |
  317: |---|---|:---:|---|
  318: | `@id` | `Slug` | ✅ | |
  319: | `name` | `string` | ✅ | 1~50자 |
  320: | `alternateName` | `string` | optional | 영문명 |
  321: | `jobTitle` | `string` | ✅ | 직책 |
  322: | `medicalSpecialty` | `Ref<C-14>[]` | ✅ | 최소 1개 |
  323: | `briefBio` | `string` | ✅ | 50~200자 |
  324: | `philosophy` | `Markdown` | optional | 진료 철학·인사말 |
  325: | `personalStory` | `Markdown` | optional | 의료진 본인 경험·계기 |
  326: | `photoUrl` | `URL` | optional | |
  327: | `credentials` | `Credential[]` | ✅ | 최소 1개 |
  328: | `education` | `Education[]` | optional | |
  329: | `career` | `CareerItem[]` | optional | |
  330: | `affiliations` | `Affiliation[]` | optional | |
  331: | `publications` | `Publication[]` | optional | |
  332: | `media` | `MediaItem[]` | optional | |
  333: | `trustMetrics` | `TrustMetric[]` | optional | 의료진 단위 통계 (논문·임상 등) |
  334: | `email` | `Email` | optional | |
  335: | `socialMedia` | `SocialMediaLinks` | optional | |
  336: | `consultationAvailable` | `boolean` | optional | 기본 `true` |
  337: | `primaryLocation` | `Ref<C-21>` | optional | 주 소속 지점 |
  338: | `additionalLocations` | `Ref<C-21>[]` | optional | 추가 진료 지점 |
  339: 
  340: **하위 타입**:
  341: 
  342: #### `Credential`
  343: | 필드 | 타입 | required | 설명 |
  344: |---|---|:---:|---|
  345: | `type` | `enum {license, certification, board}` | ✅ | |
  346: | `name` | `string` | ✅ | |
  347: | `issuedBy` | `string` | optional | |
  348: | `issuedDate` | `Date` | optional | |
  349: | `expiryDate` | `Date` | optional | |
  350: 
  351: #### `Education`
  352: | 필드 | 타입 | required | 설명 |
  353: |---|---|:---:|---|
  354: | `institution` | `string` | ✅ | |
  355: | `degree` | `string` | ✅ | |
  356: | `period` | `string` | optional | 예: `"2010-2016"` |
  357: 
  358: #### `CareerItem`
  359: | 필드 | 타입 | required | 설명 |
  360: |---|---|:---:|---|
  361: | `organization` | `string` | ✅ | |
  362: | `role` | `string` | ✅ | |
  363: | `period` | `string` | optional | |
  364: 
  365: #### `Publication`
  366: | 필드 | 타입 | required | 설명 |
  367: |---|---|:---:|---|
  368: | `title` | `string` | ✅ | |
  369: | `venue` | `string` | optional | 학회지·매체 |
  370: | `year` | `number` | optional | |
  371: | `url` | `URL` | optional | |
  372: 
  373: ### C-03. `TreatmentPage` — 시술·치료 구조화 콘텐츠 (v0.4 컨텍스트 필드 즉시 통합)
  374: 
  375: | 필드 | 타입 | required | 설명 |
  376: |---|---|:---:|---|
  377: | `@id` | `Slug` | ✅ | |
  378: | `name` | `string` | ✅ | 1~80자 |
  379: | `alternateName` | `string` | optional | |
  380: | `summary` | `string` | ✅ | 50~160자 핵심 답변 |
  381: | `category` | `string` | optional | 시술 카테고리 |
  382: | `medicalSpecialty` | `Ref<C-14>` | optional | |
  383: | `overview` | `Markdown` | ✅ | 개요 |
  384: | `mechanism` | `Markdown` | ✅ | 원리 |
  385: | `targetAudience` | `Markdown` | ✅ | 대상 (일반 설명) |
  386: | `recommendedFor` | `string[]` | optional | **(v0.4)** 추천 대상 리스트 (구체) |
  387: | `treatmentComponents` | `TreatmentComponent[]` | optional | **(v0.4)** 한약·약침·고주파·체성분 검사·식단 관리 등 구성 |
  388: | `visitFlow` | `VisitFlowStep[]` | optional | **(v0.4)** 검사 → 상담 → 처방 → 관리 단계 |
  389: | `process` | `ProcessStep[]` | ✅ | 과정 (단계별) |
  390: | `duration` | `string` | optional | 소요 시간 |
  391: | `sessionCount` | `string` | optional | 권장 횟수 |
  392: | `programVariants` | `ProgramVariant[]` | optional | 프로그램 패키지 변형 |
  393: | `precautions` | `Markdown` | ✅ | 주의사항·금기증 |
  394: | `aftercare` | `Markdown` | optional | 시술 후 관리 |
  395: | `maintenancePlan` | `Markdown` | optional | **(v0.4)** 유지·요요 방지 계획 |
  396: | `remoteCareAvailable` | `boolean` | optional | **(v0.4)** 비대면 진료 가능 여부 |
  397: | `evidenceNotes` | `EvidenceNote[]` | optional | **(v0.4)** 논문·통계·근거 링크 |
  398: | `faqs` | `Ref<C-12>[]` | optional | 관련 FAQ |
  399: | `relatedDoctors` | `Ref<C-02>[]` | optional | 담당 의료진 |
  400: | `relatedConditions` | `Ref<C-11>[]` | optional | 관련 질환 |
  401: | `relatedTreatments` | `Ref<C-03>[]` | optional | 관련 시술 |
  402: | `pageRiskLevel` | `RiskLevel` | ✅ | 페이지 단위 기본 위험도 |
  403: | `slotRiskOverrides` | `SlotRiskOverride[]` | optional | 슬롯별 격상 사례 |
  404: | `heroImageUrl` | `URL` | optional | |
  405: | `ogImageUrl` | `URL` | optional | |
  406: | `cta` | `CTAConfig` | optional | 예약·문의 CTA (CT-03) |
  407: 
  408: **하위 타입**:
  409: 
  410: #### `ProcessStep`
  411: | 필드 | 타입 | required | 설명 |
  412: |---|---|:---:|---|
  413: | `order` | `number` | ✅ | 단계 번호 |
  414: | `name` | `string` | ✅ | 단계명 |
  415: | `description` | `Markdown` | ✅ | |
  416: | `durationMinutes` | `number` | optional | |
  417: 
  418: #### `TreatmentComponent` (v0.4 신규)
  419: | 필드 | 타입 | required | 설명 |
  420: |---|---|:---:|---|
  421: | `@id` | `Slug` | ✅ | |
  422: | `name` | `string` | ✅ | 구성 요소명 (예: "한약", "지방분해 약침") |
  423: | `type` | `enum {herbal-medicine, pharmacopuncture, electrotherapy, body-composition-test, dietary-counseling, exercise-prescription, lifestyle-counseling, other}` | ✅ | 유형 |
  424: | `description` | `Markdown` | optional | |
  425: | `included` | `boolean` | optional | 패키지 포함 여부 (default true) |
  426: 
  427: #### `VisitFlowStep` (v0.4 신규)
  428: | 필드 | 타입 | required | 설명 |
  429: |---|---|:---:|---|
  430: | `order` | `number` | ✅ | |
  431: | `name` | `string` | ✅ | 단계명 (예: "초진 상담", "체성분 검사") |
  432: | `description` | `Markdown` | optional | |
  433: | `durationMinutes` | `number` | optional | |
  434: | `location` | `enum {clinic, remote, both}` | optional | |
  435: 
  436: #### `ProgramVariant`
  437: | 필드 | 타입 | required | 설명 |
  438: |---|---|:---:|---|
  439: | `@id` | `Slug` | ✅ | |
  440: | `name` | `string` | ✅ | 변형명 (예: "1개월 집중") |
  441: | `duration` | `string` | ✅ | 기간 |
  442: | `sessionCount` | `string` | optional | 세션 수 |
  443: | `targetSegment` | `string` | optional | 대상 분류 |
  444: | `briefDescription` | `Markdown` | ✅ | |
  445: | `includes` | `string[]` | optional | 포함 항목 |
  446: | `priceRange` | `string` | optional | 가격 범위 (위험도 High 격상) |
  447: | `riskLevelOverride` | `RiskLevel` | optional | 변형 단위 위험도 |
  448: 
  449: #### `EvidenceNote` (v0.4 신규)
  450: | 필드 | 타입 | required | 설명 |
  451: |---|---|:---:|---|
  452: | `label` | `string` | ✅ | 근거 라벨 (예: "한방비만학회지 2022 임상사례") |
  453: | `summary` | `string` | optional | 간략 요약 |
  454: | `url` | `URL` | optional | 외부 검증 링크 (논문·학회) |
  455: | `publishedYear` | `number` | optional | |
  456: | `verifiedBy` | `string` | optional | 검증자·기관 |
  457: 
  458: #### `SlotRiskOverride`
  459: | 필드 | 타입 | required | 설명 |
  460: |---|---|:---:|---|
  461: | `slot` | `enum {overview, mechanism, targetAudience, recommendedFor, treatmentComponents, visitFlow, process, duration, sessionCount, programVariants, precautions, aftercare, maintenancePlan, evidenceNotes, cta}` | ✅ | |
  462: | `level` | `RiskLevel` | ✅ | 격상 등급 |
  463: | `reason` | `string` | ✅ | 감사 추적용 |
  464: 
  465: ### C-04. `Article` — 인사이트·블로그 글 (v0.4 컨텍스트 필드 즉시 통합)
  466: 
  467: | 필드 | 타입 | required | 설명 |
  468: |---|---|:---:|---|
  469: | `@id` | `Slug` | ✅ | |
  470: | `headline` | `string` | ✅ | 1~120자 |
  471: | `summary` | `string` | ✅ | 80~200자 |
  472: | `body` | `Markdown` | ✅ | 최소 1,000자(공백 제외) 권장 — `CONTENT_STANDARDS.md` § 1.3 SoT |
  473: | `author` | `Ref<C-02>` | ✅ | 저자 |
  474: | `coAuthors` | `Ref<C-02>[]` | optional | |
  475: | `authorType` | `enum {clinician, staff, guest, external}` | optional | **(v0.4)** 저자 유형 (default `clinician`) |
  476: | `reviewedBy` | `Ref<C-02>` | optional | **(v0.4)** 의료진 검수자 (E-E-A-T 신호) |
  477: | `reviewedAt` | `Date` | optional | **(v0.4)** 검수 일자 |
  478: | `contentSource` | `enum {original, syndicated, republished, translated}` | optional | **(v0.4)** 콘텐츠 출처 (default `original`) |
  479: | `externalUrl` | `URL` | optional | **(v0.4)** 외부 인용·재게재 시 원본 URL |
  480: | `datePublished` | `Date` | ✅ | 최초 발행일 |
  481: | `dateModified` | `Date` | ✅ | 최종 수정일 |
  482: | `articleType` | `enum {notice, general-medical-info, treatment-explainer, condition-explainer, effect-result-related, review-case, event-price}` | ✅ | 유형 — 위험도 자동 추론 |
  483: | `contentFormat` | `enum {article, video, column}` | ✅ | 형식 (default `article`) |
  484: | `category` | `Ref<C-22>` | ✅ | ArticleCategory |
  485: | `tags` | `string[]` | optional | |
  486: | `readingTimeMinutes` | `number` | optional | 자동 계산 |
  487: | `wordCount` | `number` | optional | 자동 계산 |
  488: | `coverImageUrl` | `URL` | optional | |
  489: | `ogImageUrl` | `URL` | optional | |
  490: | `embeddedMedia` | `EmbeddedMedia[]` | optional | YouTube·외부 인용 |
  491: | `relatedArticles` | `Ref<C-04>[]` | optional | |
  492: | `relatedTreatments` | `Ref<C-03>[]` | optional | |
  493: | `relatedConditions` | `Ref<C-11>[]` | optional | |
  494: | `pageRiskLevel` | `RiskLevel` | ✅ | articleType 자동 추론, 운영자 오버라이드 가능 |
  495: | `inlineRiskFlags` | `enum {includes-effect-claim, includes-pricing, includes-event, includes-before-after, includes-testimonial}[]` | optional | 본문 위험 요소 플래그 |
  496: 
  497: **ArticleType ↔ 자동 추론 위험도**:
  498: 
  499: | ArticleType | 자동 위험도 | 운영자 오버라이드 |
  500: |---|:---:|:---:|
  501: | `notice` | Low | ✅ |
  502: | `general-medical-info` | Medium | ✅ |
  503: | `treatment-explainer` | Medium | ✅ |
  504: | `condition-explainer` | Medium | ✅ |
  505: | `effect-result-related` | High | ✅ (낮출 수 없음) |
  506: | `review-case` | High | ✅ (낮출 수 없음) |
  507: | `event-price` | High | ✅ (낮출 수 없음) |
  508: 
  509: **하위 타입**:
  510: 
  511: #### `EmbeddedMedia`
  512: | 필드 | 타입 | required | 설명 |
  513: |---|---|:---:|---|
  514: | `type` | `enum {youtube, vimeo, external-video, external-iframe, citation}` | ✅ | |
  515: | `url` | `URL` | ✅ | |
  516: | `title` | `string` | optional | |
  517: | `caption` | `string` | optional | |
  518: | `durationSeconds` | `number` | optional | |
  519: | `transcriptUrl` | `URL` | optional | 자막·스크립트 (E-E-A-T) |
  520: 
  521: **컴플라이언스 주의**:
  522: - `contentSource: republished` 또는 `syndicated` 시 원본 권한·출처 표시 의무.
  523: - `reviewedBy` 노출 시 의료진 검수의 권위 신호로 활용 — 단 의학적 정확성 검증 책임.
  524: - `externalUrl`의 외부 콘텐츠 책임 분리 명시 (DM-13).
  525: 
  526: ### C-05. `RiskLevel` (enum) — 위험도 등급
  527: 
  528: ```ts
  529: type RiskLevel = "Low" | "Medium" | "High";
  530: ```
  531: 
  532: **v0.4 변경**: 모든 계약에서 `Ref<C-05>` 대신 **직접 `RiskLevel` 타입 사용** (enum이라 참조 불필요).
  533: 
  534: > 상세 정의·격상 조건·검수 흐름은 `compliance/RISK_LEVELS.md`.
  535: 
  536: ### C-06. `PageMeta` — 페이지별 메타 데이터
  537: 
  538: | 필드 | 타입 | required | 설명 |
  539: |---|---|:---:|---|
  540: | `title` | `string` | ✅ | 10~70자, `<title>` |
  541: | `description` | `string` | ✅ | 80~160자, `<meta name="description">` |
  542: | `canonical` | `URL` | optional | 미지정 시 자동 생성 |
  543: | `robots` | `string` | optional | 기본 `"index, follow, max-snippet:-1, max-image-preview:large"` |
  544: | `ogType` | `enum {website, article, profile}` | optional | 페이지 타입 자동 (`profile`은 P-004 Doctor Profile 등 인물 페이지 — SEARCH_STANDARDIZATION § 2.2 og:type 매핑 참조) |
  545: | `ogTitle` | `string` | optional | 미지정 시 `title` |
  546: | `ogDescription` | `string` | optional | 미지정 시 `description` |
  547: | `ogImageUrl` | `URL` | optional | 미지정 시 ClinicProfile.ogImageUrl |
  548: | `twitterCard` | `enum {summary, summary_large_image}` | optional | 기본 `summary_large_image` |
  549: | `inLanguage` | `string` | optional | 기본 `"ko-KR"` |
  550: | `noIndex` | `boolean` | optional | 기본 `false` |
  551: 
  552: > 코드 생성은 `core/SEARCH_STANDARDIZATION.md`.
  553: 
  554: ### C-07. `BrandTokens` — 디자인 토큰 최종값
  555: 
  556: | 필드 | 타입 | required | 설명 |
  557: |---|---|:---:|---|
  558: | `personaMode` | `enum {Premium, Wellness, Professional, Friendly}` | ✅ | 브랜드 페르소나 |
  559: | `colors` | `ColorTokens` | ✅ | 색 토큰 |
  560: | `typography` | `TypographyTokens` | ✅ | 타이포그래피 |
  561: | `spacing` | `SpacingDensity` | ✅ | `tight \| standard \| spacious` |
  562: | `radius` | `RadiusScale` | ✅ | |
  563: | `shadow` | `ShadowScale` | ✅ | |
  564: | `layoutVariants` | `LayoutVariantSelection` | ✅ | 페이지 타입별 변형 선택 |
  565: | `componentVariants` | `ComponentVariantSelection` | ✅ | 컴포넌트 변형 |
  566: 
  567: > 토큰 허용 값·기본값·예시는 `core/DESIGN_TOKENS.md`.
  568: 
  569: ### C-08. `InstanceManifest` — 버전 고정 명세
  570: 
  571: | 필드 | 타입 | required | 설명 |
  572: |---|---|:---:|---|
  573: | `instanceId` | `Slug` | ✅ | |
  574: | `core` | `VersionSpec` | ✅ | Core 패키지 버전 |
  575: | `presets` | `{name: string, version: VersionSpec}[]` | ✅ | 사용 Preset |
  576: | `features` | `{name: string, version: VersionSpec, enabled: boolean, config?: object}[]` | optional | (v0.10 +) 활성화 Feature Modules. `config`는 Feature별 설정 객체 — 각 Feature 명세 SoT가 정의 (예: `features/compliance-assistant.md` § 2.3) |
  577: | `environment` | `enum {production, staging, preview, development}` | ✅ | 배포 환경 — robots.txt 환경별 분기에 사용 (SEARCH_STANDARDIZATION § 3.3.1) |
  578: | `aiCrawlerPolicy` | `enum {allow, disallowTraining, disallowAll, custom}` | ✅ | **required** — AI 크롤러 정책. 미설정 시 빌드 fail (SEARCH_STANDARDIZATION § 3.2) |
  579: | `aiCrawlerLegalApproved` | `boolean` | conditional | **`aiCrawlerPolicy: allow` 시 `true` 필수 (fail-gate)**. 다른 정책은 권장 |
  580: | `aiCrawlerApprovedBy` | `string` | conditional | **`aiCrawlerPolicy: allow` 시 required** (감사 추적 게이트). 다른 정책은 optional |
  581: | `aiCrawlerApprovedAt` | `Date` | conditional | **`aiCrawlerPolicy: allow` 시 required**. 다른 정책은 optional |
  582: | `robotsOverrides` | `RobotsOverride[]` | optional | user-agent별 merge/replace 룰 (SEARCH_STANDARDIZATION § 3.4) |
  583: | `experimentalAiBots` | `boolean` | optional | 외부 관측 기반·공식 검증 전 user-agent(예: meta-externalagent) 포함 여부. 기본 `false`. `true` 시 robots.txt에 포함 |
  584: | `performanceBudget` | `PerformanceBudget` | optional | Lighthouse budget 임계값 override + critical URL 목록 (SEARCH_STANDARDIZATION § 6.1) |
  585: | `searchConsoleVerification` | `{google?: string, naver?: string, bing?: string}` | optional | 검색 콘솔 verification 메타 코드 (SEARCH_STANDARDIZATION § 7.1) |
  586: | `notificationChannels` | `NotificationChannelsConfig` | optional | (v0.9 +, v0.13 확장) 어드민 알림 채널 활성화·설정 — `admin/REVIEW_WORKFLOW.md` § 9, `features/notifications.md` § 2.3. v0.13에서 email transport·secretRef·rate limit 영역 추가 |
  587: | `adminBaseUrl` | `URL` | conditional | (v0.13 +) 본 인스턴스의 어드민(Control Plane) base URL — 알림 ctaUrl 합성 기준. `features.notifications` 활성 시 required (`features/notifications.md` § 3.3 ctaUrl 자동 합성) |
  588: | `timezone` | `IANATimezone` (예: `"Asia/Seoul"`) | conditional | (v0.13 +) 인스턴스 운영 기준 timezone — digest 스케줄·SLA 영업일 산정에 사용. `features.notifications`·SLA 운영 인스턴스에서 required. DST 처리는 IANA 기준 따름 |
  589: | `holidayCalendar` | `{region: ISO3166Alpha2, source?: "package-embedded" \| "external-api", externalApiRef?: string}` | conditional | (v0.13 +) 인스턴스 공휴일 캘린더 — CT-02 BusinessHours의 `dayOfWeek="PublicHoliday"` 매칭 시 사용. 한국 인스턴스는 `region: "KR"`. `source` 기본 `package-embedded` (본 Feature 패키지에 한국 공휴일 데이터 embed, 국가별 확장 시 추가). `clientApproverBusinessHoursAware=true`인 인스턴스에서 required (`features/notifications.md` § 8.4) |
  590: | `analyticsConfig` | `AnalyticsConfig` | conditional | (v0.14 +) 외부 분석 도구 자격증명·사이트 식별자 SoT. `features.analytics-reporting` 활성 시 required. **경계 분리**: 본 객체는 source 자격증명·사이트 식별자만, 동작 옵션(스케줄·보존·리포트 템플릿·임계 측정·rate limit)은 `features[name="analytics-reporting"].config`에 둠 (`features/analytics-reporting.md` § 2.3) |
  591: | `analyticsPolicyVersion` | `string` | conditional | (v0.14 +) `features.analytics-reporting` 매트릭스·정책 SoT 버전 (예: `"ar-2026-05-14"`). `features.analytics-reporting` 활성 시 required. notifications의 `notificationPolicyVersion` 패턴 동일 — 패키지가 버전별 병렬 보관 + manifest opt-in (`features/analytics-reporting.md` § 1.1·§ 4.2 동등) |
  592: | `searchVisibilityConfig` | `SearchVisibilityConfig` | conditional | (v0.16 +) 검색 가시성 모니터링 자격증명·식별자 SoT. `features.search-visibility` 활성 시 required. **경계 분리**: 자격증명·식별자만, 동작 옵션은 `features[name="search-visibility"].config` (`features/search-visibility.md` § 2.3) |
  593: | `searchVisibilityPolicyVersion` | `string` | conditional | (v0.16 +) `features.search-visibility` 정책 SoT 버전. analyticsPolicyVersion·notificationPolicyVersion 동일 패턴 |
  594: | `keywordMonitoringConfig` | `KeywordMonitoringConfig` | conditional | (v0.17 +) keyword-monitoring 자격증명·식별자 SoT. `features.keyword-monitoring` 활성 시 required. 동작 옵션은 `features[name="keyword-monitoring"].config` SoT (`features/keyword-monitoring.md` § 2.3) |
  595: | `keywordMonitoringPolicyVersion` | `string` | conditional | (v0.17 +) `features.keyword-monitoring` 정책 SoT 버전. notifications·analytics·search-visibility 동일 패턴 |
  596: | `assetIngestionConfig` | `AssetIngestionConfig` | conditional | (v0.18 +) asset-ingestion 자격증명·식별자 SoT. `features.asset-ingestion` 활성 시 required. 동작 옵션은 `features[name="asset-ingestion"].config` (`features/asset-ingestion.md` § 2.3) |
  597: | `assetIngestionPolicyVersion` | `string` | conditional | (v0.18 +) `features.asset-ingestion` 정책 SoT 버전. 5 Feature policyVersion 동일 패턴 |
  598: | `crmSyncConfig` | `CrmSyncConfig` | conditional | (v0.19 +) CRM·환자관리 시스템 연동 자격증명·DPA·동의 증빙 SoT. `features.crm-sync` 활성 시 required. 동작 옵션은 `features[name="crm-sync"].config` (`features/crm-sync.md` § 2.3) |
  599: | `crmSyncPolicyVersion` | `string` | conditional | (v0.19 +) `features.crm-sync` 정책 SoT 버전. 7 Feature policyVersion 동일 패턴 |
  600: | `contentMigrationConfig` | `ContentMigrationConfig` | conditional | (v0.21 +) 솔루션 내부 콘텐츠 마이그레이션 plan 정의·legal 승인·read-only window 정책 SoT. `features.content-migration` 활성 시 required. 동작 옵션은 `features[name="content-migration"].config` (`features/content-migration.md` § 2.3) |
  601: | `contentMigrationPolicyVersion` | `string` | conditional | (v0.21 +) `features.content-migration` 정책 SoT 버전. 8 Feature policyVersion 동일 패턴 |
  602: | `complianceAssistantExemptApproval` | `{approvedBy: string, approvedAt: Date, exemptionAgreementUrl: URL, reason: string}` | optional | (v0.12 +) compliance-assistant 비활성 예외 승인 기록 — `features/compliance-assistant.md` § 10.3. 본 필드 부재 시 의료기관 인스턴스의 본 Feature 비활성은 빌드 fail |
  603: | `lastReleaseApprovedBy` | `string` | optional | 마지막 승인자 |
  604: | `lastReleaseApprovedAt` | `Date` | optional | |
  605: 
  606: #### `RobotsOverride` (v0.11 신규)
  607: | 필드 | 타입 | required | 설명 |
  608: |---|---|:---:|---|
  609: | `userAgent` | `string` | ✅ | 대상 user-agent (예: `GPTBot`) |
  610: | `action` | `enum {merge, replace}` | ✅ | 기존 Core 룰에 merge할지 replace할지 |
  611: | `allow` | `string[]` | optional | Allow 경로 목록 |
  612: | `disallow` | `string[]` | optional | Disallow 경로 목록 |
  613: | `note` | `string` | optional | 운영자 메모 |
  614: 
  615: #### `PerformanceBudget` (v0.11 신규, v0.12 확장)
  616: | 필드 | 타입 | required | 설명 |
  617: |---|---|:---:|---|
  618: | `criticalUrls` | `string[]` | optional | 매 빌드 측정 critical URL. Home·핵심 시술 페이지 등 |
  619: | `lcpMsOverride` | `number` | optional | LCP budget 강화 override (Core 기본 2500 이하만 허용) |
  620: | `clsOverride` | `number` | optional | CLS budget 강화 override |
  621: | `tbtMsOverride` | `number` | optional | |
  622: | `bundleSizeKbOverride` | `number` | optional | |
  623: | `imageWeightKbOverride` | `number` | optional | (v0.12) Image weight per page (Core 기본 1500) 강화 override |
  624: | `lighthousePerformanceMinOverride` | `number` | optional | Performance score 강화 override |
  625: | `lighthouseSeoMinOverride` | `number` | optional | (v0.12) SEO score 강화 override (Core 기본 90) |
  626: | `lighthouseAccessibilityMinOverride` | `number` | optional | (v0.12) Accessibility score 강화 override (Core 기본 90) |
  627: 
  628: #### `NotificationChannelsConfig` (v0.13 확장)
  629: 
  630: | 필드 | 타입 | required | 설명 |
  631: |---|---|:---:|---|
  632: | `email` | `{enabled: boolean, transport: "smtp" \| "api", provider: "resend" \| "postmark" \| "ses" \| "sendgrid" \| "mailgun", secretRef: string, sender: string, replyTo?: string, rateLimitPerHour?: number}` | optional | (v0.23 — INFRA2-15) **transport·provider 분리**. `transport="api"`는 HTTP API (resend·postmark·sendgrid·mailgun)·`transport="smtp"`는 SMTP relay (ses·smtp 호환 mailgun 등). `secretRef`는 API 키 또는 SMTP 자격 |
  633: | `slack` | `{enabled: boolean, webhookUrlSecretRef: string, rateLimitPerHour?: number}` | optional | Slack Incoming Webhook URL은 항상 secretRef 참조 (직접 URL 금지 — 보안 정책) |
  634: | `inApp` | `{enabled: boolean}` | optional | 어드민 DB 내 NotificationInbox 사용 (`features/notifications.md` § 5.3·§ 14) |
  635: 
  636: > 본 타입은 `features/notifications.md` config(`features[name="notifications"].config`)와 경계 분리: **채널 활성화·트랜스포트 자격은 본 객체**, **digest 스케줄·dedupe 윈도우·retry 정책 등 동작 옵션은 `features.notifications.config`** (notifications.md § 2.3).
  637: 
  638: #### `VersionSpec`
  639: SemVer 형식 (`"1.4.2"`).
  640: 
  641: #### `IANATimezone` (v0.13 신규)
  642: 
  643: IANA Time Zone Database 식별자 (`Asia/Seoul`, `America/Los_Angeles` 등). DST 자동 처리.
  644: 
  645: #### `AnalyticsConfig` (v0.14 신규)
  646: 
  647: | 필드 | 타입 | required | 설명 |
  648: |---|---|:---:|---|
  649: | `sources.gsc` | `{enabled: boolean, serviceAccountSecretRef: string, propertyUrl: string}` | optional | Google Search Console |
  650: | `sources.naverSearchAdvisor` | `{enabled: boolean, apiKeySecretRef: string, siteUrl: URL}` | optional | 네이버 서치어드바이저 |
  651: | `sources.ga4` | `{enabled: boolean, propertyId: string, serviceAccountSecretRef: string}` | optional | Google Analytics 4 |
  652: | `sources.rum` | `{enabled: boolean, endpoint: string}` | optional | 자체 RUM (SEARCH_STANDARDIZATION § 6.3 PerformanceEvent·PageViewEvent·ConversionEvent 수신) |
  653: 
  654: > 동작 옵션(`collectionSchedule`·`retentionDays`·`reportTemplates`·`mediaThresholdMeasurement`·`rateLimit`)은 `features[name="analytics-reporting"].config` SoT (`features/analytics-reporting.md` § 2.3).
  655: 
  656: #### `SearchVisibilityConfig` (v0.16 신규)
  657: 
  658: | 필드 | 타입 | required | 설명 |
  659: |---|---|:---:|---|
  660: | `serpCrawler` | `{enabled: boolean, targetSearchEngines: ("naver"\|"google")[], siteDomain: string, userAgent: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedScope?: SerpCrawlerApprovedScope}` | optional | 자체 SERP 크롤러. `enabled=true` + (`legalApproved !== true` 또는 `legalApprovedBy`·`legalApprovedAt` 누락) → 빌드 fail (SV2-01 정정 — 자동 크롤링 ToS 위험 회피 — `features/search-visibility.md` § 5.2) |
  661: | `backlinkSource` | `{enabled: boolean, provider: "ahrefs"\|"semrush"\|"moz"\|"self-crawl", apiKeySecretRef: string, siteDomain: string}` | optional | 외부 백링크 도구 |
  662: 
  663: > 동작 옵션(`monitoringSchedule`·`signals`·`anomalyHysteresis`·`retentionDays` 등)은 `features[name="search-visibility"].config` SoT.
  664: 
  665: #### `KeywordMonitoringConfig` (v0.17 신규)
  666: 
  667: | 필드 | 타입 | required | 설명 |
  668: |---|---|:---:|---|
  669: | `serpCrawler` | `{enabled: boolean, ...}` | optional | **v1.0: `enabled=true` → 빌드 fail (regardless of legalApproved)** — `features/keyword-monitoring.md` § 5.2 v1.0 미지원 정책 (KM2-01). v1.x 활성화 시 search-visibility SerpCrawlerApprovedScope 게이트 패턴 재사용 (KM-14 후속 결정 후). v1.0 manifest validator는 enabled=true 단독으로 fail 처리, legalApproved/승인자/시각 검증은 v1.x 활성 시점부터 적용 |
  670: 
  671: > 동작 옵션(`monitoringSchedule`·`signals`·`anomalyHysteresis`·`keywordTargetSource`·`retentionDays` 등)은 `features[name="keyword-monitoring"].config` SoT (`features/keyword-monitoring.md` § 2.3).
  672: 
  673: #### `AssetIngestionConfig` (v0.18 신규)
  674: 
  675: | 필드 | 타입 | required | 설명 |
  676: |---|---|:---:|---|
  677: | `sources.webCrawl` | `{enabled: boolean, targetDomains: string[], userAgent: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedScope?: AssetIngestionApprovedScope}` | optional | 외부 웹사이트 크롤링. `enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedScope` 누락) → 빌드 fail (F-11) |
  678: | `sources.snsApi.<platform>` | `{enabled: boolean, apiKeySecretRef: string, blogId/accountId: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedAccountIds: string[], allowedContentTypes: string[], consentEvidenceRef?: string}` | optional | platform=naverBlog·instagram·facebook·youtube. `enabled=true` + 법무 게이트 누락 → 빌드 fail (F-12) |
  679: | `sources.manualUpload` | `{enabled: boolean, maxFileSizeMb: number, allowedMimeTypes: string[]}` | optional | 어드민 UI 업로드 |
  680: | `sources.csvImport` | `{enabled: boolean, maxRowsPerImport: number}` | optional | bulk CSV import |
  681: 
  682: #### `AssetIngestionApprovedScope` (v0.18 신규 — F-10)
  683: 
  684: SerpCrawlerApprovedScope의 SERP 특화 필드(searchEngines·locales·devices·geo)를 제거하고 자산 수집 특화:
  685: 
  686: | 필드 | 타입 | required | 설명 |
  687: |---|---|:---:|---|
  688: | `allowedDomains` | `string[]` | ✅ | 허용 도메인 목록 (빈 배열 → build fail) |
  689: | `allowedPathPrefixes` | `string[]` | optional | path 화이트리스트 |
  690: | `maxPagesPerCrawl` | `integer` | ✅ | 한 번의 크롤링 최대 페이지 수 |
  691: | `maxAssetSizeMb` | `integer` | ✅ | 단일 asset 최대 크기 |
  692: | `artifactRetentionDaysMax` | `integer` | ✅ | retention 상한 |
  693: | `allowLoginState` | `boolean` | optional | 누락 시 false 자동. true 명시는 법무 승인 필요 |
  694: | `allowCaptchaBypass` | `boolean` | optional | 누락 시 false. true는 build fail (운영상 금지) |
  695: 
  696: > 동작 옵션(`mode`·`ingestionSchedule`·`tagging`·`review`·`pii`·`promote`·`retentionDays`·`blobStorage` 등)은 `features[name="asset-ingestion"].config` SoT (`features/asset-ingestion.md` § 2.3).
  697: 
  698: #### `CrmSyncConfig` (v0.19 신규)
  699: 
  700: | 필드 | 타입 | required | 설명 |
  701: |---|---|:---:|---|
  702: | `integrations` | `CrmIntegrationEntry[]` | ✅ | multiple CRM 연동 지원 (예: 본원 Salesforce + 분원 HubSpot) |
  703: 
  704: #### `CrmIntegrationEntry` (v0.19 신규)
  705: 
  706: | 필드 | 타입 | required | 설명 |
  707: |---|---|:---:|---|
  708: | `id` | string | ✅ | integration 식별자 (instance scope unique) |
  709: | `provider` | enum (`salesforce`·`hubspot`·`generic-rest-api`) | ✅ | **v1.0은 3종만**. `korean-emr`은 v1.x patch (CS-13). 해당 enum 값 build fail |
  710: | `apiKeySecretRef` | string | ✅ | provider별 API key/OAuth client credentials |
  711: | `apiUrl` | URL | ✅ | provider endpoint |
  712: | `webhookSecret` | string | conditional | bi-directional 모드 시 required (signature 검증용) |
  713: | `credentialExpiresAt` | Date | optional | OAuth token 등 만료 시각. null = 만료 없음 |
  714: | `legalApproved` | boolean | ✅ | **DPA(Data Processing Agreement) 체결 완료** — true 필수 (CS1-12) |
  715: | `legalApprovedBy` | string | ✅ | |
  716: | `legalApprovedAt` | Date | ✅ | |
  717: | `dpaEvidenceRef` | string | ✅ | DPA 계약 증빙 secretRef. **`patientConsentEvidenceRef`와 분리** (CS1-12) — DPA는 provider·기관 계약 증빙. 환자 단위 동의 증빙은 별도 (v1.0은 record-level 미저장 — CS-07 후속) |
  718: | `genericRestApiAdapter` | `GenericRestApiAdapterConfig` | conditional | (v0.20 +) `provider="generic-rest-api"` 시 ✅. **5필드** (CS3-13·CS5-01): `webhookSignatureHeader`·`webhookTimestampHeader`·`webhookEventIdHeader`·`canonicalStringFormat`·`versionTokenJsonPath`. 누락 시 build fail (`features/crm-sync.md` § 10.1). `versionTokenType: 'epoch-ms'\|'integer'\|'string'` enum도 conditional (CS5-01) |
  719: 
  720: > 동작 옵션(`mode`·`syncSchedule`·`entities`·`fieldMappingPolicyVersion`·`retryQueue`·`credentialRotation`·`pii`·`retentionDays` 등)은 `features[name="crm-sync"].config` SoT (`features/crm-sync.md` § 2.3). **CrmCredentialVersion**(credential rotation 상태 머신·secretVersionId) 등 admin DB entity는 `features/crm-sync.md` § 13 SoT. manifest는 `apiKeySecretRef` 등 secretRef만 보유 — register/rotate 시 admin DB materialization (CS3-13).
  721: 
  722: #### `ContentMigrationConfig` (v0.21 신규 — CM1-03)
  723: 
  724: 솔루션 내부 콘텐츠 마이그레이션 plan 정의·legal 승인·read-only window 정책. 동작 옵션(`execution`·`retry`·`rollback`·`dryRun`·`retentionDays`·`purgeWorker`) 등은 `features[name="content-migration"].config` SoT (`features/content-migration.md` § 2.3).
  725: 
  726: | 필드 | 타입 | required | 설명 |
  727: |---|---|:---:|---|
  728: | `featureLegalApproved` | boolean | ✅ | (CM3-08 — rename from `legalApproved`) content-migration **Feature 자체** legal 승인 — plan-level `ContentMigrationLegalApproval`(admin DB)과 분리 |
  729: | `featureLegalApprovedBy`·`featureLegalApprovedAt` | string·Date | ✅ | |
  730: | `defaultMode` | enum (`dry-run`·`apply`) | ✅ | apply는 expectedDryRunReportId CAS 통과해야 진입 |
  731: | `approvalRequired` | `ContentMigrationApprovalMap` | ✅ | plan kind별 필수 승인자 역할 (super-admin·legal-reviewer 조합) |
  732: | `legalImpactClassifierRef` | string | ✅ | legalImpactClassifier 구현 모듈 ref — 8 class 자동 분류 (PII·LegalDocument·ReviewPolicy·PricingPage·전후사진·후기·priorReviewRequired·cross-entity copy). LLM 분류 v1.0 금지 — deterministic rule SoT (CM2-03) |
  733: | `piiFieldCatalogRef` | string | ✅ | (CM3-05·CM3-18 +) DATA_MODEL Core entity별 PII field catalog 모듈 ref — classifier input SoT |
  734: | `entityFieldProjectionCatalogRef` | string | ✅ | (CM3-05 +) targetEntityTypes·readSet/writeSet projection catalog ref |
  735: 
  736: > ContentMigrationPlan·ContentMigrationRun·ContentMigrationStepResult 등 admin DB entity는 `features/content-migration.md` § 9 SoT.
  737: 
  738: #### `SerpCrawlerApprovedScope` (v0.16 신규 — SV2-02 구조화)
  739: 
  740: 법무가 승인한 SERP 크롤러 권한 범위. crawler 실행 파라미터가 본 범위 밖이면 `skipped-legal-out-of-scope` 처리:
  741: 
  742: | 필드 | 타입 | required | 설명 |
  743: |---|---|:---:|---|
  744: | `searchEngines` | `("naver"\|"google")[]` | ✅ | 허용 검색 엔진 — 본 배열 외 호출 차단 |
  745: | `locales` | `string[]` | ✅ | 예: `["ko-KR"]` — 허용 로케일 |
  746: | `devices` | `("desktop"\|"mobile"\|"tablet")[]` | ✅ | 허용 device |
  747: | `geo` | `string[]` | optional | ISO3166 alpha-2 — 허용 지역 |
  748: | `allowLoginState` | `boolean` | optional | 로그인 상태 크롤링 허용 여부. **누락 시 false로 자동 materialize** (SV3-03 — 안전 기본). 명시 true는 법무 승인 필요 |
  749: | `allowCaptchaBypass` | `boolean` | optional | captcha 우회 허용. 누락 시 false 자동. **명시 true 금지** (build fail — 운영상 captcha 우회는 ToS 위반) |
  750: | `artifactRetentionDaysMax` | `integer` | ✅ | artifact 최대 보존 일수 (config retentionDays.crawlerArtifact가 본 값 초과 시 build fail) |
  751: | `allowedPaths` | `string[]` | optional | 크롤링 허용 path/도메인 패턴 |
  752: 
  753: ### C-09. `FeatureModuleConfig` — Feature Module 설정
  754: 
  755: | 필드 | 타입 | required | 설명 |
  756: |---|---|:---:|---|
  757: | `moduleName` | `string` | ✅ | 모듈 식별자 |
  758: | `enabled` | `boolean` | ✅ | |
  759: | `config` | `object` | optional | 모듈별 설정 스키마 (각 모듈 명세) |
  760: 
  761: ### C-10. `ComplianceRecord` — 컴플라이언스 게이트 통과 기록
  762: 
  763: **마스터**: 어드민 DB 원본 + Git 사본 (가벼운 빌드 참조 메타)
  764: 
  765: #### 어드민 DB 원본 (풀데이터)
  766: 
  767: | 필드 | 타입 | required | 설명 |
  768: |---|---|:---:|---|
  769: | `@id` | `Slug` | ✅ | |
  770: | `instanceId` | `Slug` | ✅ | |
  771: | `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature, Publication, MediaAppearance}` (v0.6+, 17종) | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1). **(v0.6 + EC-CASCADE-01 patch)** `Publication`, `MediaAppearance` 추가 — EAT_CONTENT_PLAN v0.x 의 학술 인용 · 미디어 출연 E-A-T entity. ComplianceRecord 발행 게이트 통과 기록 대상 (Publication/MediaAppearance 는 외부 인용 → CONTENT_STANDARDS § 7.1.1.x 면제 + risk_level Low fixed) |
  772: | `featureContentType` | `string` (`feature:<slug>` 형식, 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$`) | conditional | `contentType="Feature"` 시 required — Feature 콘텐츠 세부 식별. 예: `feature:self-test` |
  773: | `contentRef` | `string` | ✅ | 대상 콘텐츠 `@id` |
  774: | `pageRiskLevel` | `RiskLevel` | ✅ | 최종 등급 |
  775: | `articleType` | `string` | optional | (Article인 경우) |
  776: | `inlineRiskFlags` | `string[]` | optional | |
  777: | `autoCheckResult` | `AutoCheckResult` | ✅ | compliance-assistant 결과 (`features/compliance-assistant.md` § 5.5 SoT) — `ComplianceCheckResult` 본체 + 선택 영역 `llmAssist: { invocations[]: { promptVersion, modelId, requestId, requestedAt, response: LlmAssistResult, costTokens } }` 누적 저장. v0.11 +(CA-08 해소) |
  778: | `peerReviewer` | `string` | ✅ | 동료 검수자 ID |
  779: | `peerReviewedAt` | `Date` | ✅ | |
  780: | `physicianApprover` | `string` | optional (Medium/High required) | 의료진 승인자 |
  781: | `physicianApprovedAt` | `Date` | optional | |
  782: | `clientApprover` | `string` | optional | |
  783: | `clientApprovedAt` | `Date` | optional | |
  784: | `legalCounsel` | `string` | optional (**LegalDocument: required**, High recommended) | LegalDocument 발행 시 필수 — 위험도 Low 예외 룰. 어드민 발행 게이트가 누락 시 차단 |
  785: | `legalCounselAt` | `Date` | optional (**LegalDocument: required**) | LegalDocument 발행 시 필수 |
  786: | `priorReviewRequired` | `boolean` | ✅ | 사전심의 필요 |
  787: | `priorReviewSubmissionId` | `string` | optional | |
  788: | `priorReviewPassed` | `boolean` | optional | 사전심의 통과 여부 (Git 사본과 정합) |
  789: | `attachments` | `Attachment[]` | optional | 증빙 파일 |
  790: | `staleFlags` | `StaleFlags` | optional | (v0.7 +) 역할별 재검수 필요 상태 — `RISK_LEVELS.md` § 4 만료 정책에 따라 갱신. **published 이후에도 갱신 허용** (record 불변성의 예외 영역 — `admin/REVIEW_WORKFLOW.md` § 5.4) |
  791: | `warningAcknowledgements` | `WarningAcknowledgement[]` | optional | (v0.8 +) warning finding 처리 기록 — `admin/REVIEW_WORKFLOW.md` § 3.1.1 |
  792: | `publishedAt` | `Date` | ✅ when `recordPhase="published"`, optional when `recordPhase="pre-publish"` | (v0.8 +) recordPhase별 required 분기 — 발행 전 누적 record는 본 필드 미기록 허용 |
  793: | `publishedBy` | `string` | ✅ when `recordPhase="published"`, optional when `recordPhase="pre-publish"` | (v0.8 +) 위와 동일 |
  794: | `recordPhase` | `enum {pre-publish, published}` | ✅ | (v0.8 +) 발행 생명주기 단계 (`admin/REVIEW_WORKFLOW.md` § 5.2). `pre-publish`는 검수 중 누적 record, `published`는 발행 완료 후 불변 record |
  795: | `recordVersion` | `integer` (1~) | ✅ | (v0.8 +) 동일 contentRef의 record 버전 — 재검수 사이클 후 새 record 생성 시 1 증가. 발행 history 추적 (`admin/REVIEW_WORKFLOW.md` § 5.4) |
  796: | `mediaThresholdAssessment` | `MediaThresholdAssessment` | optional | (v0.14 +) 의료법 일평균 이용자 10만 매체 분류 **법무 확정 판정**. **`calendarPolicy="previous-3-months-calendar"`만 본 슬롯에 저장** (rolling-90 운영값 저장 금지 — v0.15 정정). legal 검수자가 채움. priorReviewRequired 산정 근거 |
  797: | `mediaThresholdOperationalInput` | `MediaThresholdAssessment` | optional | (v0.15 +) `features/analytics-reporting.md`이 제공한 rolling-90 operational snapshot — pre-publish record의 legal 판정 **입력 자료**. legal 검수자 calendar 산정 시 참고용. **published record에는 본 슬롯이 calendar로 대체되지 않고 그대로 보존됨** (감사 추적용) |
  798: 
  799: #### `MediaThresholdAssessment` (v0.14 +)
  800: 
  801: | 필드 | 타입 | required | 설명 |
  802: |---|---|:---:|---|
  803: | `assessmentBasisDate` | `Date` | ✅ | 법정 기준일 (예: 전년도 말 또는 측정 기준일) |
  804: | `windowStart` | `Date` | ✅ | 측정 윈도우 시작 (시행령 제24조 직전 3개월 또는 운영 측정 기간) |
  805: | `windowEnd` | `Date` | ✅ | |
  806: | `rollingAverageDailyUsers` | `number` | ✅ | 윈도우 내 일평균 unique users (analytics-reporting § 8.2 측정값) |
  807: | `thresholdReached` | `boolean` | ✅ | rollingAverage ≥ 10만 (시행령 제24조 기준) |
  808: | `primarySource` | `enum {gsc, naver-search-advisor, ga4, rum, composite}` | ✅ | 측정 출처 — analytics-reporting `config.mediaThresholdMeasurement.primarySource` |
  809: | `sourceCompleteness` | `number` (0~1) | ✅ | 측정 데이터 완성도 (예: 0.95 = 5% 누락) — incomplete date 비율 반영 |
  810: | `timezone` | `IANATimezone` | ✅ | 측정 기준 timezone |
  811: | `calendarPolicy` | `enum {rolling-90-days, previous-3-months-calendar}` | ✅ | rolling은 운영 조기경보, calendar는 법정 산정 |
  812: | `botFilteringPolicy` | `string` | ✅ | bot 필터 정책 식별자 (analytics-reporting 버전 또는 외부 도구 자체 필터) |
  813: | `legalBasisNote` | `Markdown` | optional | 법무 의견서 본문 (법정 산정의 경우 필수 권장 — `legalCounsel`·`legalCounselAt`과 함께) |
  814: 
  815: > `mediaThresholdAssessment`는 운영 측정값(`features/analytics-reporting.md` § 14.5 DailyUserMeasurement)과 별개로 ComplianceRecord에 **확정 판정**을 기록. 운영 측정은 매일 갱신되지만 본 슬롯은 발행 시점·법무 판정 시점에 snapshot으로 고정.
  816: 
  817: #### `WarningAcknowledgement` (v0.8 +)
  818: | 필드 | 타입 | required | 설명 |
  819: |---|---|:---:|---|
  820: | `findingId` | `string` | ✅ | ComplianceCheckResult.findings[].ruleId 참조 |
  821: | `action` | `enum {acknowledged, resolved}` | ✅ | 인정 또는 정정 |
  822: | `operatorId` | `string` | ✅ | operator 사용자 ID |
  823: | `timestamp` | `Date` | ✅ | |
  824: | `note` | `string` | optional | 메모 |
  825: 
  826: #### `StaleFlags`
  827: | 필드 | 타입 | required | 설명 |
  828: |---|---|:---:|---|
  829: | `medical` | `boolean` | optional | `true`면 physicianApprover 재승인 필요 |
  830: | `legal` | `boolean` | optional | `true`면 legalCounsel 재검수 필요 (의료법 개정·고리스크 변경 등) |
  831: | `operator` | `boolean` | optional | `true`면 peerReviewer 재검수 필요 |
  832: | `client` | `boolean` | optional | `true`면 clientApprover 재승인 필요 |
  833: | `triggeredBy` | `string` | optional | stale 유발 원인 (예: `medical-law-revision-2026-Q3`, `content-change`, `pricing-change`) |
  834: | `triggeredAt` | `Date` | optional | |
  835: 
  836: #### Git 사본 (경량 빌드 참조)
  837: 
  838: | 필드 | 타입 | required | 설명 |
  839: |---|---|:---:|---|
  840: | `pageRiskLevel` | `RiskLevel` | ✅ | 렌더링 시 참조 |
  841: | `articleType` | `string` | optional | |
  842: | `priorReviewPassed` | `boolean` | optional | |
  843: | `publishedAt` | `Date` | ✅ | schema datePublished |
  844: | `lastModifiedAt` | `Date` | ✅ | schema dateModified |
  845: 
  846: ### C-16. `LegalDocument` — 정책·약관 (M0 자동 생성)
  847: 
  848: **목적**: 개인정보처리방침·이용약관·비급여 진료 안내 등 법적 정책 문서. **M0 출시 게이트**. Core 표준 템플릿 + ClinicProfile + LocationProfile(main) 변수 자동 치환으로 생성. 법무 검토 필수 (ComplianceRecord.legalCounsel/legalCounselAt required).
  849: 
  850: **참조 페이지 타입**: P-013
  851: **참조 Schema**: 일반 `WebPage` (검색 노출 우선순위 낮음)
  852: 
  853: | 필드 | 타입 | required | 설명 |
  854: |---|---|:---:|---|
  855: | `@id` | `Slug` | ✅ | 정책 종류별 slug (예: `"privacy"`, `"terms"`, `"non-covered"`) |
  856: | `documentType` | `enum {privacy, terms, non-covered, refund, complaint, cookie, other}` | ✅ | 정책 종류 |
  857: | `title` | `string` | ✅ | 정책 제목 (예: "개인정보처리방침") |
  858: | `body` | `Markdown` | ✅ | 본문 — Core 표준 템플릿 기반 + 변수 치환 (`{{clinic.*}}` + `{{location.main.*}}`) 또는 수동 작성 |
  859: | `autoGenerated` | `boolean` | optional | Core 표준 템플릿 사용 여부 (default `true`) |
  860: | `templateVersion` | `string` | optional | Core 템플릿 버전 (autoGenerated=true 시) — `"privacy@1.0.0"` 형태 |
  861: | `effectiveDate` | `Date` | ✅ | 시행일 |
  862: | `lastRevisedDate` | `Date` | optional | 최종 개정일 |
  863: | `revisions` | `LegalDocumentRevision[]` | optional | 개정 이력 |
  864: | `contactPerson` | `string` | optional | 개인정보 보호 책임자 등 |
  865: | `contactEmail` | `Email` | optional | 정책 문의 채널 |
  866: 
  867: **하위 타입**:
  868: 
  869: #### `LegalDocumentRevision`
  870: | 필드 | 타입 | required | 설명 |
  871: |---|---|:---:|---|
  872: | `date` | `Date` | ✅ | 개정일 |
  873: | `summary` | `string` | ✅ | 개정 내용 요약 |
  874: | `previousVersionUrl` | `URL` | optional | 이전 버전 보관 URL |
  875: 
  876: **컴플라이언스 룰**:
  877: - 발행 시 `ComplianceRecord(contentType=LegalDocument, legalCounsel=*, legalCounselAt=*)` 필수 — 위험도 Low 예외 게이트 (§ 4 C-10 참조).
  878: - 표준 템플릿 사용 시에도 클라이언트별 변수 정확성 (사업자번호·연락처·시행일·법인명) 검증.
  879: 
  880: ### C-21. `LocationProfile` — 지점 정체성 (위치·시간·연락 마스터)
  881: 
  882: **SoT**: 모든 위치·전화·이메일·진료시간 정보의 마스터. 단지점은 `slug=main` 1개 인스턴스 필수.
  883: 
  884: | 필드 | 타입 | required | 설명 |
  885: |---|---|:---:|---|
  886: | `@id` | `Slug` | ✅ | `"main"` 또는 지점 식별자 |
  887: | `name` | `string` | ✅ | 단지점은 본원명, 다지점은 지점명 |
  888: | `parentClinic` | `Ref<C-01>` | ✅ | 본원 ClinicProfile |
  889: | `branchDescription` | `string` | optional | 50~200자 |
  890: | `address` | `Address` | ✅ | 지점 주소 |
  891: | `geo` | `GeoCoordinates` | optional | |
  892: | `telephone` | `Phone` | ✅ | 지점 직통 |
  893: | `fax` | `Phone` | optional | |
  894: | `email` | `Email` | optional | 지점 이메일 |
  895: | `businessHours` | `BusinessHours` | ✅ | 진료시간·접수·점심·휴진 (CT-02) |
  896: | `reservationChannels` | `CTAConfig[]` | optional | 지점 예약·상담 채널 (CT-03) |
  897: | `representativeDoctors` | `Ref<C-02>[]` | optional | 대표 원장 (1명 이상 가능) |
  898: | `doctorsAtLocation` | `Ref<C-02>[]` | optional | 지점 소속 의료진 |
  899: | `availableTreatments` | `Ref<C-03>[]` | optional | 지점 제공 시술 |
  900: | `images` | `URL[]` | optional | |
  901: | `transportInfo` | `Markdown` | optional | |
  902: | `parkingInfo` | `Markdown` | optional | |
  903: | `openingDate` | `Date` | optional | 지점 개원일 |
  904: | `medicalLicenseNumber` | `string` | optional | 지점별 별도 |
  905: | `branchCode` | `string` | optional | |
  906: | `featuredChannelId` | `Slug` | optional | **(v0.6)** `reservationChannels[]` 중 강조 채널 1개의 `@id` 참조. 빌드 시 매칭 안 되면 무시 |
  907: 
  908: > v0.4 → v0.6 강조 채널 표기 변천:
  909: > - v0.4 이전: `featuredCta: Ref<CTAConfig>` (표기 규약 위반 — `Ref<C-NN>`은 C 계약만)
  910: > - v0.5: `CTAConfig.isFeatured: boolean` (객체에 컨텍스트 의존 의미 — 재사용 시 누수 위험)
  911: > - **v0.6 (현재)**: `LocationProfile.featuredChannelId: Slug` — **컨테이너에 두기**. CTAConfig는 컨텍스트 무관 데이터로 유지. reservationChannels[] 중 1개 채널의 @id 참조
  912: 
  913: > **단지점 자동 생성 규칙** (PAGE_TYPES.md § 3 P-014 참조): 어드민이 ClinicProfile 입력 단계의 위치·연락·시간 입력값으로부터 `LocationProfile(slug=main)`을 자동 생성. M0에 별도 화면 추가 없음.
  914: 
  915: ### C-22. `ArticleCategory` — Article Pillar 분류
  916: 
  917: | 필드 | 타입 | required | 설명 |
  918: |---|---|:---:|---|
  919: | `@id` | `Slug` | ✅ | |
  920: | `name` | `string` | ✅ | 1~50자 |
  921: | `description` | `string` | optional | 80~200자 |
  922: | `pillar` | `string` | optional | 상위 Pillar |
  923: | `parentCategory` | `Ref<C-22>` | optional | 계층 구조 시 |
  924: | `slug` | `Slug` | ✅ | URL용 (보통 `@id`와 동일) |
  925: | `coverImageUrl` | `URL` | optional | |
  926: | `seoMeta` | `Ref<C-06>` | optional | 카테고리 페이지 PageMeta |
  927: | `displayOrder` | `number` | optional | |
  928: | `articleTypeDefault` | `string` | optional | 기본 ArticleType (작성 시 자동 추천 — EAT v0.x EC-DEFER-10) |
  929: 
  930: > **EAT_CONTENT_PLAN v0.x EC-SCHEMA-01 (DB 실 운영 합류)**: 본 풀명세 전체 컬럼이 `article_category` DB (C0009 migration) 에 모두 존재. v0.1 어드민 UI 와 공개 렌더는 `slug`/`name`/`description`/`displayOrder` 만 노출. 나머지 (`pillar`/`parent_category_id`/`cover_image_url`/`seo_meta`/`article_type_default`) 는 nullable + EC-DEFER-10 (M1 합류). C-04 Article `category` 필드는 required Ref<C-22> — DB `article.category_id` NOT NULL + composite FK (C0013 staged 4-step migration).
  931: 
  932: ### C-24. `Publication` — 학술 논문 외부 인용 (E-A-T 전문성 시그널 · EAT v0.x 신규)
  933: 
  934: > **EAT_CONTENT_PLAN v0.x 신규 (C-24)** — 외부 학술 자료 인용 (clinic 자체 publisher 아님). schema.org `ScholarlyArticle` 매핑. Doctor Profile (P-004) · About (P-002) page 안 fragment-scoped inline 출력 v0.1 (별도 페이지 EC-DEFER-02).
  935: 
  936: | 필드 | 타입 | required | 설명 |
  937: |---|---|:---:|---|
  938: | `@id` | `Slug` | ✅ | 3~99자 |
  939: | `instanceId` | `Slug` | ✅ | |
  940: | `title` | `string` | ✅ | 학술 논문 제목 (1~300자) |
  941: | `authors` | `string[]` | ✅ | 저자 이름 리스트 (min 1) |
  942: | `journal` | `string` | optional | 학술지명 |
  943: | `publishedDate` | `Date` | ✅ | 학술지 게재일 |
  944: | `doi` | `string` | optional | DOI · regex `^10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$` |
  945: | `pubmedId` | `string` | optional | PubMed ID · regex `^[0-9]{1,9}$` |
  946: | `url` | `URL` | ✅ | 외부 dereferenceable URL |
  947: | `thumbnailUrl` | `URL` | optional | |
  948: | `summary` | `string` | ✅ | 운영자 요약 (50~300자) |
  949: | `authorDoctorId` | `Ref<C-02>` | optional | 본 clinic doctor 가 저자일 때 (same-tenant composite FK) |
  950: | `status` | `content_publication_status` | ✅ | v0.1 어드민 UI `draft` 만 (EC-DEFER-12) |
  951: | `riskLevel` | `Ref<C-05>` | ✅ | **DB CHECK Low fixed** — 외부 인용 entity |
  952: | `publishedAt` | `Date` | conditional | status='published' 시 required |
  953: | `metadata` | `Record<string, unknown>` | optional | |
  954: | `createdAt` / `updatedAt` | `Date` | ✅ | |
  955: 
  956: **검수 · 위험도 · Schema**:
  957: - CONTENT_STANDARDS § 7.1.1.x: **answer-first AST · 표현 검사 · RiskRule · RiskInference 모두 면제** (외부 인용)
  958: - RISK_LEVELS § 2: Low fixed
  959: - Schema: `ScholarlyArticle` · `@id` = `${pageBaseUrl}#publication-{slug}` (fragment-scoped — Doctor/About page 안)
  960: 
  961: ### C-25. `MediaAppearance` — 미디어 출연 (E-A-T 권위성 시그널 · EAT v0.x 신규)
  962: 
  963: > **EAT_CONTENT_PLAN v0.x 신규 (C-25)** — clinic doctor 의 미디어 출연 (방송·유튜브·팟캐스트·언론). schema.org `VideoObject` 매핑 v0.1 — 모든 channel_type 단일화. BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1).
  964: 
  965: | 필드 | 타입 | required | 설명 |
  966: |---|---|:---:|---|
  967: | `@id` | `Slug` | ✅ | 3~99자 |
  968: | `instanceId` | `Slug` | ✅ | |
  969: | `title` | `string` | ✅ | 영상/방송 제목 (1~300자) |
  970: | `channelName` | `string` | ✅ | 방송사/유튜브 채널명 |
  971: | `channelType` | `enum {broadcast, youtube, podcast, press}` | ✅ | DB column 4종 모두 허용 · JSON-LD `@type` v0.1 단일 VideoObject |
  972: | `publishedDate` | `Date` | ✅ | 방송/업로드 일자 |
  973: | `durationSeconds` | `number` | optional | JSON-LD `duration: PT<seconds>S` |
  974: | `url` | `URL` | ✅ | 외부 URL |
  975: | `thumbnailUrl` | `URL` | optional | |
  976: | `summary` | `string` | ✅ | 운영자 요약 (50~300자) |
  977: | `authorDoctorId` | `Ref<C-02>` | optional | 출연 doctor (same-tenant composite FK) |
  978: | `status` | `content_publication_status` | ✅ | v0.1 어드민 UI `draft` 만 (EC-DEFER-12) |
  979: | `riskLevel` | `Ref<C-05>` | ✅ | **DB CHECK Low fixed** |
  980: | `publishedAt` | `Date` | conditional | status='published' 시 required |
  981: | `metadata` | `Record<string, unknown>` | optional | |
  982: | `createdAt` / `updatedAt` | `Date` | ✅ | |
  983: 
  984: **검수 · 위험도 · Schema**:
  985: - CONTENT_STANDARDS § 7.1.1.x: **면제** (외부 인용)
  986: - RISK_LEVELS § 2: Low fixed
  987: - Schema: `VideoObject` (모든 channel_type 단일화 v0.1) · `@id` = `${pageBaseUrl}#video-{slug}` (fragment-scoped — Doctor/About page 안). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11.
  988: 
  989: ---
  990: 
  991: ## 5. M0 외 계약 — 간략 명세 (후속 풀명세 예정)
  992: 
  993: ### C-11. `MedicalConditionPage`
  994: 필드: `name`, `definition`, `symptoms[]`, `causes[]`, `diagnosis`, `treatmentOptions`, `prevention`, `relatedTreatments[]`, `relatedDoctors[]`, `pageRiskLevel` (default Medium). Schema: `MedicalCondition`.
  995: 
  996: ### C-12. `FAQ` — EAT v0.x **풀명세 합류 + M0 합류** (§ 4 본문 참조 — 본 § 5 entry 는 historical link)
  997: 
  998: EAT_CONTENT_PLAN v0.x acceptance commit 안 § 4 풀명세로 격상. 본 § 5 row 는 cycle 5 cascade 후 정리.
  999: 
 1000: **풀명세 요약** (§ 4 안 풀명세 SoT 참조):
 1001: | 필드 | 타입 | required | 설명 |
 1002: |---|---|:---:|---|
 1003: | `@id` | `Slug` | ✅ | 3~99자 |
 1004: | `question` | `string` | ✅ | 10~200자 |
 1005: | `answer` | `string` (Markdown) | ✅ | 50~2000자. public HTML render = `renderMarkdownToHtml` · JSON-LD `Answer.text` = `renderMarkdownToPlainText` |
 1006: | `displayOrder` | `number` | ✅ | 어드민 입력 순서 |
 1007: | `categoryId` | `Ref<C-22>` | optional | ArticleCategory |
 1008: | `relatedTreatmentId` | `Ref<C-03>` | optional | EC-DEFER-09 |
 1009: | `relatedConditionId` | `Ref<C-11>` | optional | C-11 합류 후 |
 1010: | `authorDoctorId` | `Ref<C-02>` | optional | 답변 doctor |
 1011: | `status` | `content_publication_status` | ✅ | **v0.1 단계 DB CHECK `status='draft' AND published_at IS NULL` — EC-DEFER-05·12 (compliance-assistant + risk_level 자동 추론 합류 까지 published 차단)** |
 1012: | `riskLevel` | `Ref<C-05>` | ✅ | v0.1 default Low. RiskInference (자동 추론) 합류 시 Medium/High 자동 — RISK_LEVELS § 2 |
 1013: 
 1014: **Schema**: `FAQPage.mainEntity[].Question.acceptedAnswer.Answer`. P-011 graph self-contained (cross-page ref 미사용).
 1015: **검수 · 위험도**: CONTENT_STANDARDS § 7.1.1.x — Q/A 모두 answer-first AST · 표현 검사 · RiskRule · RiskInference 적용 (compliance-assistant 합류).
 1016: 
 1017: ### C-13. `ReviewPolicy`
 1018: 필드: `enabled`, `displayFormat`, `requireAnonymization`, `effectClaimAllowed`, `beforeAfterPhotoAllowed`, `celebrityMentionAllowed`, `disclaimerText`. **의료광고법 신중 필요.**
 1019: 
 1020: ### C-14. `MedicalSpecialty`
 1021: 필드: `@id`, `name`, `description`, `parentSpecialty?`. Preset 1차 정의.
 1022: 
 1023: ### C-15. `SchemaInput`
 1024: JSON-LD 생성기 런타임 인터페이스. 다른 계약들로부터 정규화. 상세 → `SCHEMA_MAPPING.md`.
 1025: 
 1026: ### C-17. `PricingPage`
 1027: 필드: `items[]` (`{name, priceRange, conditions, isNonCovered}`), `paymentPolicy`, `refundPolicy`, `disclaimerText`. **High 위험도.**
 1028: 
 1029: ### C-18. `FacilitiesPage`
 1030: 필드: `categories[]` (`{name, items[], photos[]}`), `hygieneNote`.
 1031: 
 1032: ### C-19. `NewsItem`
 1033: 필드: `headline`, `body`, `category` (enum), `publishedDate`, `expirationDate?`, `riskLevel`. **event-price 카테고리는 High.**
 1034: 
 1035: ### C-20. `ReservationPage`
 1036: 필드: `channels[]` (CTAConfig[]), `bookingHours`, `preparationNotes`, `changeCancellationPolicy`, `emergencyGuidance?`.
 1037: 
 1038: ### C-23. `AdminUser` — 어드민 사용자 (v0.13 신규)
 1039: 
 1040: **마스터**: 어드민 DB 원본 (Git 사본 없음 — Control Plane 전용). `features/notifications.md` 수신자 산정·`admin/REVIEW_WORKFLOW.md` § 11 권한 평가의 SoT.
 1041: 
 1042: | 필드 | 타입 | required | 설명 |
 1043: |---|---|:---:|---|
 1044: | `@id` | `Slug` | ✅ | UUID 또는 인스턴스 고유 식별자 |
 1045: | `email` | `string` | ✅ | 로그인·이메일 알림 발송 주소 |
 1046: | `displayName` | `string` | ✅ | 어드민 UI 표시명 |
 1047: | `role` | `AdminUserRole` (단 `system` 제외) | ✅ | `admin/REVIEW_WORKFLOW.md` § 11.1 enum 6종 중 실제 사용자 역할 5종(`super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver`). **`system`은 audit log actorRole 표기 전용** — AdminUser DB row 미생성, 로그인 불가. C-23.`role` 및 `instanceMemberships[].role`에는 저장 금지 |
 1048: | `approverRoleEligibility` | `ApproverRole[]` | optional | 사용자가 승인할 수 있는 검수 역할(`operator`·`medical`·`legal`·`client`) — § 11.2 자격 검증 통과 결과 누적 |
 1049: | `eligibilityEvidence` | `Array<{role: ApproverRole, doctorProfileRef?: Ref<C-02>, legalCounselRef?: string, clientDelegationRef?: string, verifiedAt: Date, verifiedBy: string}>` | optional | 자격 인증 근거 — medical은 DoctorProfile·credentials[], legal/client는 후속 데이터 모델(RL-04/RL-05) |
 1050: | `slackUserId` | `string` | optional | Slack workspace 사용자 ID (`<@U12345>` 형식 mention용). 미보유 시 Slack 발송은 broadcast만 |
 1051: | `timezone` | `IANATimezone` | optional | 사용자 timezone — **quietHours 기준에만 사용** (digest 발송 시각은 InstanceManifest.timezone 고정 — `features/notifications.md` § 8.1). 미지정 시 InstanceManifest.timezone fallback |
 1052: | `notificationPreferences` | `NotificationPreferences` | optional | 사용자별 채널·digest·quietHours 설정 (§ C-23 하위 타입) |
 1053: | `instanceMemberships` | `Array<{instanceId: Slug, role: AdminUserRole, joinedAt: Date, active: boolean, deactivatedAt?: Date, deactivatedBy?: string}>` | ✅ | (v0.24 — SPIKE2-03) 사용자가 접근 가능한 인스턴스 목록. **`active=true`만 권한 부여**·`active=false` 시 다음 request 즉시 403 (session refresh 없이). `resolveTenantContext`가 매 요청 검증 |
 1054: | `active` | `boolean` | ✅ | 비활성화 시 모든 알림 발송 대상 제외 + 로그인 차단 |
 1055: | `lastLoginAt` | `Date` | optional | |
 1056: | `createdAt` | `Date` | ✅ | |
 1057: 
 1058: #### `NotificationPreferences` (C-23 하위 타입)
 1059: 
 1060: | 필드 | 타입 | required | 설명 |
 1061: |---|---|:---:|---|
 1062: | `channels` | `{email: boolean, slack: boolean, inApp: boolean}` | ✅ | 사용자별 채널 활성화. `mandatory` criticality 이벤트는 본 설정 중 **opt-out만 우회**하고 인스턴스 채널 비활성은 우회하지 않음(`features/notifications.md` § 4.1 필터 순서) |
 1063: | `digestOptOut` | `boolean` | optional | digest 발송 거부 — 즉시 발송만 수신. critical/mandatory 이벤트에는 영향 없음 |
 1064: | `quietHours` | `{start: "HH:MM", end: "HH:MM", timezone?: IANATimezone}` | optional | 보류 시간. `timezone` 우선순위: `quietHours.timezone > AdminUser.timezone > InstanceManifest.timezone`. `critical` 이벤트는 quietHoursPolicy=bypass로 우회 |
 1065: | `suppression` | `{email?: EmailSuppressionState, slack?: ChannelSuppressionState}` | optional | provider 장애·hard bounce 자동 처리 상태 (§ C-23 하위 타입). `active=false` 로그인 차단과 분리 — suppression은 채널별 발송만 차단 |
 1066: 
 1067: #### `EmailSuppressionState`·`ChannelSuppressionState` (C-23 하위 타입)
 1068: 
 1069: | 필드 | 타입 | required | 설명 |
 1070: |---|---|:---:|---|
 1071: | `state` | `enum {active, soft-suppressed, hard-suppressed}` | ✅ | `soft-suppressed`는 transient 누적 임계 도달 시 일시 보류(자동 해제 — autoReleaseAt 도달 시 worker가 active 복귀), `hard-suppressed`는 hard bounce·spam complaint 등 영구 차단(운영자 명시 해제만) |
 1072: | `reason` | `string` | ✅ | provider 응답·내부 정책 사유 |
 1073: | `firstObservedAt` | `Date` | ✅ | |
 1074: | `lastObservedAt` | `Date` | ✅ | atomic update (multi-worker 안전) |
 1075: | `observedCount` | `integer` | ✅ | 누적 발생 횟수 — DB atomic increment. softSuppressionThreshold 도달 판정은 compare-and-set으로 1회만 발생 (`features/notifications.md` § 7.1) |
 1076: | `autoReleaseAt` | `Date` | optional | (soft-suppressed 한정) 자동 active 복귀 예정 시각 — `lastObservedAt + softSuppressionAutoReleaseDays`. worker(`features/notifications.md` § 7.4)가 도달 시 state=active + observedCount=0 복귀 |
 1077: | `unsuppressedBy` | `string` | optional | 수동 해제 시 운영자 |
 1078: | `unsuppressedAt` | `Date` | optional | |
 1079: 
 1080: ---
 1081: 
 1082: ## 6. 관계 다이어그램
 1083: 
 1084: ```
 1085: ClinicProfile (C-01)
 1086:    ├─ trustMetrics → TrustMetric[] (CT-01)
 1087:    ├─ primaryCtas → CTAConfig[] (CT-03)
 1088:    ├─ medicalSpecialty → MedicalSpecialty (C-14)
 1089:    ├─ affiliatedInstitutes → ResearchInstitute
 1090:    └─ locations → LocationProfile[] (C-21)  ⭐ 필수 1개+
 1091: 
 1092: LocationProfile (C-21) — 위치·시간·연락 SoT
 1093:    ├─ businessHours → BusinessHours (CT-02)
 1094:    ├─ reservationChannels → CTAConfig[] (CT-03)
 1095:    ├─ parentClinic → ClinicProfile (C-01)
 1096:    ├─ representativeDoctors → DoctorProfile[]
 1097:    ├─ doctorsAtLocation → DoctorProfile[]
 1098:    └─ availableTreatments → TreatmentPage[]
 1099: 
 1100: DoctorProfile (C-02)
 1101:    ├─ primaryLocation → LocationProfile (C-21)
 1102:    ├─ additionalLocations → LocationProfile[]
 1103:    └─ trustMetrics → TrustMetric[] (CT-01)
 1104: 
 1105: TreatmentPage (C-03)
 1106:    ├─ cta → CTAConfig (CT-03)
 1107:    ├─ recommendedFor / treatmentComponents / visitFlow / programVariants / evidenceNotes (v0.4)
 1108:    ├─ relatedDoctors → DoctorProfile[]
 1109:    ├─ relatedConditions → MedicalConditionPage[]
 1110:    └─ pageRiskLevel → RiskLevel (직접 enum)
 1111: 
 1112: Article (C-04)
 1113:    ├─ author → DoctorProfile (C-02)              ⭐ 단일 참조
 1114:    ├─ coAuthors → DoctorProfile[] (C-02)         ⭐ 배열 (선택)
 1115:    ├─ reviewedBy → DoctorProfile (C-02)          ⭐ 단일 참조 (v0.4 신규)
 1116:    ├─ category → ArticleCategory (C-22)
 1117:    ├─ contentSource / externalUrl (v0.4)
 1118:    ├─ embeddedMedia → EmbeddedMedia[]
 1119:    └─ pageRiskLevel → RiskLevel
 1120: 
 1121: ComplianceRecord (C-10)
 1122:    ├─ contentRef → 발행 콘텐츠 (C-01~C-22)
 1123:    └─ pageRiskLevel → RiskLevel
 1124: ```
 1125: 
 1126: ---
 1127: 
 1128: ## 7. 변경 정책
 1129: 
 1130: (§ 2.6 표 참조 — MAJOR/MINOR/PATCH)
 1131: 
 1132: ---
 1133: 
 1134: ## 8. 미결정 사항
 1135: 
 1136: | ID | 항목 | 비고 |
 1137: |---|---|---|
 1138: | DM-01 | `@id` 충돌 처리 — 다국어·동명이인 | 운영 룰 |
 1139: | DM-02 | `Markdown` 허용 문법 범위 | CONTENT_STANDARDS.md |
 1140: | DM-03 | 미디어 자산 URL 정책 | Phase Alpha |
 1141: | DM-04 | `ComplianceRecord` 첨부 저장소 | A-02 |
 1142: | DM-05 | `Article.inlineRiskFlags` 자동 추출 | compliance-assistant |
 1143: | DM-06 | C-11~C-20 풀명세 시점 | 페이지 합류 시 |
 1144: | DM-07 | cross-reference 빌드 검증 | |
 1145: | DM-08 | `BrandTokens.personaMode` 확장 | DESIGN_TOKENS.md |
 1146: | DM-09 | ~~ArticleCategory~~ | 해소 — C-22 |
 1147: | DM-10 | `TrustMetric` 자동 격상 룰 (단정형 표현 검출) | compliance-assistant |
 1148: | DM-11 | `ProgramVariant.priceRange` 노출 정책 | RISK_LEVELS.md |
 1149: | DM-12 | ~~LocationProfile SoT~~ | **v0.4 해소** — ClinicProfile에 위치·시간·연락 필드 제거. LocationProfile만 마스터 |
 1150: | DM-13 | `EmbeddedMedia`·`externalUrl` 외부 콘텐츠 검수 룰 | 정책 필요 |
 1151: | DM-14 | `CTAConfig.type` 확장 (해외 채널: 라인·왓츠앱 등) | M3 다국어 |
 1152: | DM-15 | `TrustMetric` 빌드 시 검증 룰 — 누락 경고 vs 오류 | Phase Alpha |
 1153: | DM-16 | `BusinessHours.openingHours` vs `receptionHours` UI 표시 규칙 | UI |
 1154: | DM-17 | LocationProfile main 자동 생성의 어드민 입력 단계 | admin/ARCHITECTURE.md |
 1155: | DM-18 | TreatmentComponent의 비대면 처방·배송 가능 여부 표시 | 위험도 정책 |
 1156: | DM-19 | `Article.reviewedBy`의 의료진 책임 범위 | 컴플라이언스 정책 |
 1157: 
 1158: ---
 1159: 
 1160: ## 9. 변경 이력
 1161: 
 1162: | 일자 | 버전 | 변경 |
 1163: |---|---|---|
 1164: | 2026-05-13 | v0.1 | 최초 — 20개 계약 |
 1165: | 2026-05-13 | v0.2 | 레퍼런스 분석 반영 — C-21·C-22, 필드 추가 |
 1166: | 2026-05-13 | v0.3 | DEEP_DIVE 1단계 — CT-01 TrustMetric·CT-02 BusinessHours·CT-03 CTAConfig 신설, AccumulatedStats 흡수 |
 1167: | 2026-05-14 | v0.4 | **피드백 적용**: (1) **전체 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, (2) **SoT 정리** — ClinicProfile에서 mainAddress·mainTelephone·mainEmail·businessHours 제거. LocationProfile만 위치·시간·연락 마스터 (DM-12 해소), (3) **TreatmentPage 컨텍스트 필드 즉시 통합** — recommendedFor·treatmentComponents·visitFlow·programVariants·maintenancePlan·remoteCareAvailable·evidenceNotes (1호 다이어트 한의원 직결), (4) **Article 컨텍스트 필드 즉시 통합** — authorType·reviewedBy·reviewedAt·contentSource·externalUrl (E-E-A-T 강화), (5) **RiskLevel 직접 enum 사용** — `Ref<C-05>` 표기 전면 제거, (6) TreatmentComponent·VisitFlowStep·EvidenceNote 하위 타입 신설, (7) DM-18·DM-19 신규 |
 1168: | 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
 1169: | 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
 1170: | 2026-05-14 | v0.7 | **피드백 정정**: **C-16 LegalDocument를 § 4 M0 핵심으로 이동 + 풀명세** — `documentType` enum, `body` 변수 치환 규약, `autoGenerated`·`templateVersion`, `revisions[]` 하위 타입, 발행 시 법무 검토 룰 명시. § 5 (M0 외 간략 명세)에는 자리 표시만 유지 |
 1171: | 2026-05-14 | v0.8 | **피드백 정정**: § 4 내 C-16 위치를 C-22 뒤 → C-10 다음(C-21 앞)으로 이동, 번호 순 가독성 확보. § 5 자리표시도 한 줄 링크로 간소화 |
 1172: | 2026-05-14 | v0.9 | **피드백 정정**: (1) § 5 (M0 외 간략 명세)에서 C-16 자리표시 행 삭제 — 섹션 제목과 모순되는 잔존 제거. C-16은 § 4 M0 핵심에만 위치, (2) 헤더 작성일 설명 정정 — "번호순 정렬" → "M0 핵심 섹션 안에서 C-10 직후로 위치 이동" (C-11~C-15가 § 5에 있어 엄밀한 번호순은 아님) |
 1173: | 2026-05-14 | v0.10 | **SEARCH_STANDARDIZATION v0.2 cascade**: C-06 PageMeta `ogType` enum 확장 — `{website, article}` → **`{website, article, profile}`**. P-004 Doctor Profile 등 인물 페이지가 `profile` og:type을 사용 (SEARCH_STANDARDIZATION § 2.2 매핑 참조) |
 1174: | 2026-05-14 | v0.11 | **SEARCH_STANDARDIZATION v0.5 cascade — C-08 InstanceManifest 확장**: `environment`·`aiCrawlerPolicy`(required)·`aiCrawlerLegalApproved`·`aiCrawlerApprovedBy/At`·`robotsOverrides`·`experimentalAiBots`·`performanceBudget`·`searchConsoleVerification` 8개 필드 추가. 하위 타입 `RobotsOverride`·`PerformanceBudget` 신설 |
 1175: | 2026-05-14 | v0.12 | **SEARCH_STANDARDIZATION v0.6 cascade**: (1) **`aiCrawlerApprovedBy/At`을 `aiCrawlerPolicy: allow` 시 required로 격상** — 감사 추적 게이트 강화, (2) **`PerformanceBudget` 확장** — `imageWeightKbOverride`·`lighthouseSeoMinOverride`·`lighthouseAccessibilityMinOverride` 추가 (SEARCH_STANDARDIZATION § 6.1 budget 항목 정합) |
 1176: | 2026-05-14 | v0.19 | **`features/crm-sync.md` 1차 사이클 cascade**: (1) **C-08 `crmSyncConfig` 신설** (CrmSyncConfig·CrmIntegrationEntry — provider 3종 한정, dpaEvidenceRef·patientConsentEvidenceRef 분리), (2) **C-08 `crmSyncPolicyVersion`** (7 Feature policyVersion 동일 패턴) |
 1177: | 2026-05-14 | v0.20 | **`features/crm-sync.md` 3차·5차 사이클 cascade (CS3-13·CS5-01)**: (1) CrmIntegrationEntry에 `genericRestApiAdapter` 필드 추가 — provider=generic-rest-api 시 required. **5필드** (webhookSignatureHeader·webhookTimestampHeader·webhookEventIdHeader·canonicalStringFormat·`versionTokenJsonPath`) + `versionTokenType` enum, (2) manifest(secretRef) vs admin DB(`CrmCredentialVersion` — secretVersionId·rotation state) 경계 명시 |
 1178: | 2026-05-15 | v0.21 | **`features/content-migration.md` 1차 사이클 cascade (CM1-03)**: (1) **C-08 `contentMigrationConfig` 신설** (ContentMigrationConfig — legalApproved·defaultMode·approvalRequired·legalImpactClassifierRef), (2) **C-08 `contentMigrationPolicyVersion`** (8 Feature policyVersion 동일 패턴) |
 1179: | 2026-05-15 | v0.22 | **`features/content-migration.md` 3차 사이클 cascade (CM3-05·CM3-08·CM3-18)**: (1) ContentMigrationConfig `legalApproved` → `featureLegalApproved` rename (plan-level `ContentMigrationLegalApproval` admin DB와 명칭 분리), (2) `piiFieldCatalogRef`·`entityFieldProjectionCatalogRef` 추가 — legalImpactClassifier deterministic rule 입력 SoT |
 1180: | 2026-05-15 | v0.23 | **인프라 결정 cascade (INFRA2-15)**: C-08 NotificationChannelsConfig.email field에 `transport`(smtp\|api) 와 `provider`(resend\|postmark\|ses\|sendgrid\|mailgun) 분리 — Resend·기타 HTTP API provider 지원 |
 1181: | 2026-05-15 | v0.24 | **Spike 결정 cascade (SPIKE2-03)**: C-23 AdminUser.instanceMemberships에 `active`·`deactivatedAt`·`deactivatedBy` 필드 추가. `active=false` 시 다음 request 즉시 403·resolveTenantContext 매 요청 검증 강제 |
 1182: | 2026-05-14 | v0.18 | **`features/asset-ingestion.md` 1차 사이클 cascade**: (1) **C-08 `assetIngestionConfig` 신설** (AssetIngestionConfig — sources webCrawl/snsApi/manualUpload/csvImport), (2) **C-08 `assetIngestionPolicyVersion`** (6 Feature policyVersion 동일 패턴), (3) **`AssetIngestionApprovedScope` 신규** — SerpCrawlerApprovedScope의 SERP 특화 필드 제거·자산 수집 특화(allowedDomains·allowedPathPrefixes·maxPagesPerCrawl·maxAssetSizeMb·artifactRetentionDaysMax) |
 1183: | 2026-05-14 | v0.17 | **`features/keyword-monitoring.md` 1차 사이클 cascade**: (1) **C-08 `keywordMonitoringConfig` 신설** (KeywordMonitoringConfig — search-visibility의 SerpCrawlerApprovedScope 게이트 패턴 재사용), (2) **C-08 `keywordMonitoringPolicyVersion`** (top-level, 4 Feature policyVersion 동일 패턴) |
 1184: | 2026-05-14 | v0.16 | **`features/search-visibility.md` 1차 사이클 cascade**: (1) **C-08 `searchVisibilityConfig` 신설** (SearchVisibilityConfig — serpCrawler/backlinkSource, serpCrawler.enabled=true + legalApproved 게이트 fail-gate), (2) **C-08 `searchVisibilityPolicyVersion`** (top-level, notifications·analytics 패턴 동일) |
 1185: | 2026-05-14 | v0.15 | **`features/analytics-reporting.md` 4차 사이클 cascade**: (1) **C-08 `analyticsPolicyVersion` 신설** — notifications policyVersion 패턴 동일 (필수, 패키지 병렬 보관), (2) **C-10 `mediaThresholdOperationalInput` 슬롯 분리** — rolling-90 operational snapshot은 본 슬롯, calendar 확정 판정은 `mediaThresholdAssessment` 슬롯. published record는 calendar 값만 (AR4-08) |
 1186: | 2026-05-14 | v0.14 | **`features/analytics-reporting.md` 1차 사이클 cascade**: (1) **C-08 `analyticsConfig` 신설** — `AnalyticsConfig`(sources.gsc·naverSearchAdvisor·ga4·rum 자격증명·사이트 식별자만, 동작 옵션은 `features.analytics-reporting.config`로 분리), (2) **C-10 `mediaThresholdAssessment` 슬롯** — `MediaThresholdAssessment` 신설(assessmentBasisDate·windowStart/End·rollingAverageDailyUsers·thresholdReached·primarySource·sourceCompleteness·timezone·calendarPolicy·botFilteringPolicy·legalBasisNote). priorReviewRequired 산정 근거. ComplianceRecord 발행 시 snapshot으로 고정 |
 1187: | 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `AdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`eligibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·digestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IANATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |

codex
초기 대조에서 `PAGE_TYPES` 쪽에 새 불일치가 보입니다. 나머지 cascade 파일도 line 근거를 좁혀서 확인한 뒤, PASS/FAIL과 신규 finding을 정리하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "ScholarlyArticle|VideoObject|FAQPage|Question|Answer|P-011" docs/core/SCHEMA_MAPPING.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"Publication|MediaAppearance|FAQ|ArticleCategory|ContentType|7\\.1\\.1\\.2\" docs/core/CONTENT_STANDARDS.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"11|P-011|FAQ|Vertical|3\\.11\" docs/admin/ARCHITECTURE.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"article_category|publication|media_appearance|faq|EAT|2\\.2|변환\" docs/decisions/M0_BUILD_EXPORT_PLAN.md" in C:\Users\assag\solution\website-exposure
 succeeded in 689ms:
20:- 핵심 schema: `Organization`·`MedicalClinic`·`Physician`·`MedicalProcedure`·`MedicalCondition`·`Article`·`FAQPage`·`BreadcrumbList`·`WebSite`. (`MedicalClinic`은 LocalBusiness sub-class이므로 별도 `LocalBusiness` 타입 출력 안 함)
125:| `Article`·`NewsArticle`·`BlogPosting`·`WebPage`·`FAQPage`·`Blog`·`VideoObject`·`ImageObject` 등 CreativeWork 계열 | `Organization`·`MedicalClinic`·`LocalBusiness`·`Physician`·`Person`·`ContactPoint` 등 — Schema.org 표준상 inLanguage 속성 부재 또는 부적합 |
150:| `FAQPage` | P-011 FAQ (EAT v0.x EC-CASCADE-02 M0 합류 — graph self-contained · cross-page allowlist 미사용 · 빈 FAQ 0 row 도 `mainEntity: []` 허용) | FAQ[] (C-12) |
151:| `Question` / `Answer` | FAQPage.mainEntity (EAT v0.x — Answer.text = `renderMarkdownToPlainText(faq.answer)`) | FAQ |
154:| `VideoObject` | (a) Article.embeddedMedia[].type=youtube·video, P-010의 contentFormat=video. (b) **EAT v0.x EC-CASCADE-02 (신규)**: MediaAppearance (C-25) 모든 channel_type 단일화 — fragment `#video-{slug}` (Doctor/About page 안 fragment-scoped inline). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1) | EmbeddedMedia · MediaAppearance (C-25) |
155:| `ScholarlyArticle` | **EAT v0.x EC-CASCADE-02 (신규)**: Publication (C-24) — Doctor Profile (P-004) · About (P-002) page 안 fragment-scoped inline (`@id` = `${pageBaseUrl}#publication-{slug}`). 별도 페이지는 EC-DEFER-02 (M1) | Publication (C-24) |
188:- `FAQPage` (Question/Answer) — FAQ 리치 결과
191:- `VideoObject` — 비디오 캐러셀 (Google Rich Results 최소 필드 충족 시)
227:| `FAQPage` | Conditional | P-011 또는 FAQ 블록 포함 페이지 (P-006·P-008·P-010 등) |
229:| `VideoObject` | Conditional | Article.contentFormat=video 또는 embeddedMedia.type∈{youtube, vimeo, external-video} (최소 필드 충족 시) |
258:| `MedicalClinic` 참조 | **참조만** — 위치 정보가 페이지 본문에 표시되지 않는 페이지 | P-003(Doctors List), P-004(Doctor Profile), **P-005(Treatments List — 시술 카드 목록 위주, 위치 슬롯 없음)**, P-007/8(Conditions), P-009/10(Articles), P-011(FAQ), P-013(Legal), P-101(Reviews), P-102(Pricing), P-103(Facilities), P-104(News), P-106(Self-test) |
262:| `Physician`, `MedicalProcedure`, `MedicalCondition`, `Article`, `FAQPage` | 상세 페이지에서 풀, 다른 페이지(목록·연관 참조)에서 참조 또는 inline 최소 | § 3 참조 |
484:6. (FAQ 블록 포함 시) `FAQPage` — **[풀]** (Conditional)
508:**FAQPage** (해당 시):
512:  "@type": "FAQPage",
515:      "@type": "Question",
517:      "acceptedAnswer": {
518:        "@type": "Answer",
545:6. (FAQ) `FAQPage` — **[풀]** (Conditional)
615:8. (Q&A 블록 포함 시) `FAQPage` — **[풀]** (Conditional)
616:9. (contentFormat=video 또는 embeddedMedia.type∈{youtube,vimeo,external-video} 시) `VideoObject` — **[풀, 최소 필드 충족]** (Conditional)
642:**VideoObject** (contentFormat=video 또는 embeddedMedia에 youtube/vimeo 포함 시) — Google Rich Results 최소 필드 충족:
646:  "@type": "VideoObject",
659:**필수 필드** (누락 시 VideoObject 출력 안 함 — Google Rich Results 기준):
665:### P-011. FAQ
670:3. `FAQPage` (Question/Answer) — **[풀]**
674:**FAQPage**: 위 P-006 FAQPage와 동일 구조. 페이지 전체가 Question 모음일 때 `mainEntity` 배열.
788:| C-04 `Article` | `Article` (또는 `BlogPosting`·`NewsArticle` 변형). VideoObject 동반 가능 | `contentSource` → `isBasedOn` |
796:| C-12 `FAQ` | `FAQPage.mainEntity[].Question/Answer` | |
887:| P-011 FAQ | `faqs: FAQ[]` |
920:| P-011 | `FAQPage` + `mainEntity[]` 최소 1개 |
939:| **warning** | 출력 시 경고 + 어드민 검토 큐로 전달 (빌드는 통과) | 외부 위젯 schema와 `@id` 충돌 / VideoObject 권장 필드 누락 (필수는 충족하나 권장 미충족) / 본문 길이 권장 미달 등 — 비차단 운영 관찰 항목 |
986:| 2026-05-14 | v0.3 | **빌드 가능 규칙화** (피드백 10건): (1) **§ 1.1 Core 출력 범위 한정** — 외부 위젯 schema 충돌 가능성 명시, (2) **§ 1.4 본원 @id 일관성 (SM-05 해소)** — `/#clinic` 단일 entity, 다지점 비본원만 `/locations/{slug}#clinic`, alias 금지, (3) **§ 2.1 WebSite Home 전용** — 다른 페이지는 `isPartOf` 참조만, (4) **§ 2.1 Person M0 외 후속** — authorType != clinician은 데이터 모델 확장 후, (5) **§ 2.4 신규 — Allowed/Conditional/Blocked 3단계 분류**, (6) **§ 3 P-010 graph 구성 [풀]/[참조+inline]/[참조만] 표기 명확화** + VideoObject Google Rich Results 최소 필드 (name·description·thumbnailUrl·uploadDate·contentUrl/embedUrl), (7) **§ 5.1 dayOfWeek enum 변환표** + specialClosures 기본 미출력 정책, (8) **§ 7.2 빌드 게이트 vs 운영 모니터링 분리** — 공식 validator는 모니터링·수동 QA로, (9) **§ 7.3 룰 레벨 분류 (fail/warning/content-gate)** + **§ 8 표에 룰 레벨 명시** |
988:| 2026-05-14 | v0.5 | **미세 잔재 해소·룰 단순화** (피드백 7건): (1) **P-008 riskFactor → MedicalRiskFactor 행 삭제** — fail 정책 정합. causes[]는 description 보조·본문 표현으로, (2) **P-008 주석 정정** — "신중" → "schema 출력 안 함, 본문은 content-gate", (3) **HealthAndBeautyBusiness fail로 통일** (§ 2.4·§ 8 모두) — 단독·병행 모두 미사용, (4) **MedicalIndication fail로 통일** — Schema 출력 금지, 본문 효능 표현만 content-gate, (5) **HowTo Rich Results A 목록에서 제거** — 미사용. 미래 확장 시 카탈로그·결정표·의료 리스크 룰 추가, (6) **§ 2.4에 Person 두 케이스 분리** — Organization.founder는 Allowed inline / Article.author (non-clinician)는 M0 외 후속, (7) **VideoObject 필수 필드 표현 명확화** — `name·description·thumbnailUrl·uploadDate` 4개 필수 + `contentUrl`/`embedUrl` 중 1개 |
989:| 2026-05-14 | v0.6 | **정책 표 정합화** (피드백 7건): (1) **§ 2.5 신설 — 공통 entity별 페이지 출력 정책 (단일 SoT)** — Organization/WebSite/MedicalClinic의 풀 entity vs 참조 위치 명시. § 7.1 룰 checker가 본 표 기준으로 검증, (2) "풀 entity vs 참조" 용어 정의 — graph[]에 entity 정의 여부 명확, (3) **§ 0 요약 일관화** — "신중하게" → fail로, validator 표현을 § 7.2와 일치 (자체 checker = 빌드, 공식 validator = 모니터링), (4) **LocalBusiness 별도 출력 제거** — § 2.1·§ 5 C-20 정정. `MedicalClinic`이 LocalBusiness sub-class이므로 `@type: "MedicalClinic"`만 사용, LocalBusiness 계열 속성 활용, (5) **SearchAction Conditional** — `/search` 라우트 부재 시 미출력 (M0 미출력, 검색 기능 활성화 시 합류), (6) **§ 7.3 warning 예시 교체** — MedicalIndication·HealthAndBeautyBusiness 제거(둘 다 fail). 비차단 항목(외부 위젯 @id 충돌·VideoObject 권장 필드 누락·본문 길이 미달 등)으로 교체 |
990:| 2026-05-14 | v0.7 | **§ 2.5 SoT 기준 일괄 동기화** (피드백 7건): (1) **§ 2.1 SearchAction Conditional 명시**, **ReserveAction을 LocalBusiness → MedicalClinic.potentialAction**으로 정정, (2) **§ 2.4 MedicalClinic 결정 변경** — "본원 1개 전 페이지" → "§ 2.5 정책에 따라 full 또는 ref", (3) **§ 2.5 P-105 Reservation 풀 entity로 재분류**, P-101~P-106 일괄 ref 거친 표현 세분화, (4) **§ 3·§ 4 페이지별 graph 구성 [풀]/[참조]/[참조+inline] 표기 일괄 적용** — P-003·P-004·P-007·P-008·P-009·P-010·P-011·P-013·P-101~P-106, (5) **§ 7.1 검증 룰 정정** — "PageMeta.canonical 필수" → "**resolved canonical URL 필수** (PageMeta.canonical 또는 SchemaInput.canonicalUrl로 결정)" |

 succeeded in 691ms:
7:> **목적**: 솔루션 운영 Control Plane(어드민)의 위상·원칙·Vertical Slice 명세·Phase 로드맵·기능 영역·데이터 모델·통합 흐름을 정의한다.
19:- 구축은 **Vertical Slice (M0) → Phase Alpha (M1) → Beta (M2) → GA (M3)** 순으로 점진. Slice가 처음부터 끝까지 동작하면 1호 클라이언트 출시 가능.
32:│  │ 6개 핵심 화면 (Vertical Slice — § 3)                              │  │
86:## 3. Vertical Slice (M0) — 처음부터 끝까지 관통하는 한 줄
232:**Body 변수 화이트리스트 reference (LL-CASCADE-01 · LOCATION_LEGAL_PLAN v1.0 § 5 SoT)** — 본문 `body` 에 허용된 11개 변수. 등록되지 않은 키는 `renderTemplate` 이 `TemplateRenderError("unknown-variable")` 으로 거부한다.
261:- BreadcrumbList, FAQPage (필요 시)
269:### 3.11 Slice 완료 게이트 (6항목)
273:| 1 | 사이트 측 페이지 타입 10종 + Article 1샘플 빌드 (총 11 페이지) | Home·About·Doctors List·Doctor Profile·Treatments List·Treatment Detail·**Contact**·**Location Detail (main 자동)**·**Legal/Policy (자동, 법무 검토)**·**FAQ (EAT v0.x EC-CASCADE-08)**·Article Detail 1개 — 정적 빌드 가능. 상세는 PAGE_TYPES.md § 6 |
295:### 4.1 M0 — Vertical Slice (§ 3 참조)
367:- `MedicalConditionPage`·`FAQ` 폼 — 해당 페이지 타입 합류 시 (Phase Alpha 우선)
507:## 11. 변경 이력
512:| 2026-05-13 | v0.2 | **주요 갱신** (피드백 3차): (1) Control Plane 위상 도입, (2) Admin-first 원칙 명시, (3) **Vertical Slice (M0) 6개 화면 명세 신설** (§ 3) — Article 포함, (4) Phase 명칭 M0/M1/M2/M3 + Alpha/Beta/GA 병기, (5) Git 원본 vs DB 원본 데이터 분리 명확화 (§ 6), (6) Feature Modules 통합 원칙 명시, (7) ComplianceRecord 두 영역 교차 정책 (§ 6.3) | Glitzy (Claude 페어링) |
513:| 2026-05-13 | v0.3 | **PAGE_TYPES.md v0.2 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 5종 → **7종 + Article 1샘플 = 8개 페이지** (Contact 추가), (2) § 3.11 완료 게이트 #1 7종 빌드로 수정, (3) 단일 진실 원본은 `core/PAGE_TYPES.md`로 명시 (중복 회피). 어드민 화면 수 6개는 유지(Contact는 ClinicProfile 자동 생성) | Glitzy (Claude 페어링) |
514:| 2026-05-14 | v0.4 | **PAGE_TYPES v0.5 + DATA_MODEL v0.4 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 7종+1샘플 → **8종+1샘플=9개 페이지** (P-014 Location Detail 추가), (2) **§ 3.8.1 LocationProfile(main) 자동 생성 규칙 명시** — 어드민 화면 추가 없이 ClinicProfile 입력으로 자동 생성, (3) § 3.11 완료 게이트 #1 8종 빌드로 수정. 어드민 화면 수 6개는 그대로 유지 | Glitzy (Claude 페어링) |
515:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **§ 3.8.1 표현 정리** — 계약 필드(파일 출력)와 어드민 폼 입력 필드(UI 수집)의 구분 명시. ClinicProfile 폼은 두 섹션(기관 정체성 + 본원 위치·연락·시간)으로 출력은 ClinicProfile + LocationProfile main 두 파일, (2) **§ 3.8.2 LegalDocument 자동 생성 규칙 신규** — Core 표준 템플릿 + ClinicProfile 변수 치환, ComplianceRecord 추적, (3) **§ 3.8 Slice 9종+1샘플 → 10종+1샘플=10페이지** (P-013 격상 추가), (4) § 3.11 완료 게이트 #1 10종, (5) **§ 5.2 데이터 입력 영역** — 어드민 화면별 입력·출력 매핑 표 추가로 1:1이 아님 명시 | Glitzy (Claude 페어링) |

 succeeded in 686ms:
5:본 문서는 어드민 DB → Git output 변환의 build/export 책임 plan 의 placeholder 다. M0 v1.0 본 구현 시점에 풀명세 합류. 본 v0.1 은 다른 plan/cascade marker 의 reference target 역할.
18:- 어드민 DB (`clinic_profile` · `location_profile` · `doctor_profile` · `treatment_page` · `article` · `legal_document` · 등) → Git output (Markdown frontmatter + YAML/JSON content file) 변환.
19:- 변환 시점 = 운영자 "발행" 액션 (compliance-assistant 게이트 통과 후) + apps/worker job.
24:| 변환 | DB source | Git output |
32:| primary_ctas / reservationChannels element key | DB `id` | Git `@id` (alias 변환) |
38:- DoctorProfile · TreatmentPage · Article 의 schema.org JSON-LD 변환.
47:- DB → Git output 변환 함수 (entity 별 + JSON-LD generator).
48:- CI pipeline 통합 (변환 결과 commit → 사이트 빌드 trigger).
55:| 영역 | v0.x SSR 위치 | M0 v1.0 본 구현 변환 |
57:| 페이지 컴포넌트 | `apps/web/src/app/(site)/[instanceSlug]/...` server component | `next export` + `generateStaticParams` 또는 별도 Astro/Next static 변환 |
67:### 2.2 EAT_CONTENT_PLAN v0.x 4 신규 entity 변환 (EC-CASCADE-04)
69:EAT_CONTENT_PLAN v0.x acceptance commit 안 cascade — apps/worker 의 build/export 시점에 다음 4 entity Git 출력:
73:| `ArticleCategory` (C-22 실 운영 합류) | `article_category` (C0009) | `<instanceSlug>/article-categories/<slug>.yaml` | v0.1 어드민 UI minimal — slug/name/displayOrder/description. parentCategory/pillar 등은 EC-DEFER-10 |
74:| `Publication` (C-24 신규) | `publication` (C0010) | `<instanceSlug>/publications/<slug>.yaml` (또는 inline content) | Doctor Profile · About page 안 fragment-scoped inline · ScholarlyArticle JSON-LD |
75:| `MediaAppearance` (C-25 신규) | `media_appearance` (C0011) | `<instanceSlug>/media-appearances/<slug>.yaml` | VideoObject JSON-LD (모든 channel_type 단일화 v0.1) |
76:| `FAQ` (C-12 풀명세 합류) | `faq` (C0012) | `<instanceSlug>/faqs/<slug>.yaml` (또는 inline FAQPage) | v0.1 DB CHECK `status='draft'` 만 — published 게이트 EC-DEFER-05·12 |
80:PUBLIC_SITE_RENDER SSR 컴포넌트는 본 EAT v0.x acceptance commit 안 함께 합류 (Doctor/About graph 확장 + P-011 FAQ 신규 페이지 + Article detail SQL JOIN — EAT_CONTENT code v1.0 cycle).

 succeeded in 713ms:
57:| FAQ.answer | 50~300자 권장 (Q&A 블록은 답변 우선 1~2문장) |
102:6. P-011 FAQ의 경우 각 Q&A 블록 단위로 동일 알고리즘 — `<dl>/<dt>` 다음 `<dd>` 또는 H3 다음 paragraph
129:| Q&A 블록 | `<dl>` 또는 FAQPage schema | FAQ 리치 결과 |
154:- JSON-LD schema — 본문 Q&A 블록을 추출하여 별도 FAQPage 그래프 출력 (`SCHEMA_MAPPING` § 3 P-011 FAQPage 매핑). 렌더링 마크업과 schema 출력은 독립
309:### 5.5 P-011 FAQ — 답변 단위 위험도
366:  contentType: ContentType;           // DATA_MODEL C-10 ComplianceRecord.contentType enum (Core 닫힌 enum 유지)
367:  featureContentType?: FeatureContentTypeId;  // Feature-backed 콘텐츠 시 사용 — § 7.1.1
381:// - Core 콘텐츠: contentType 사용, featureContentType 미지정
382:// - Feature 콘텐츠: contentType="Feature"(C-10 enum cascade 1개 추가) + featureContentType 지정
385:#### 7.1.1 Feature contentType 식별 — `FeatureContentTypeId`
387:DATA_MODEL C-10 `ComplianceRecord.contentType` enum은 닫힌 enum으로 유지하되, Feature-backed 콘텐츠 식별을 위해 enum에 `Feature` 하나만 추가(cascade)하고 실제 구분은 별도 `featureContentType` 필드로 한다.
390:type FeatureContentTypeId = `feature:${FeatureSlug}`;  // kebab-case slug
394:| 영역 | contentType 값 | featureContentType 값 | 예시 |
397:| Feature | `"Feature"` (C-10 cascade 1개) | `feature:<slug>` | `contentType="Feature"` + `featureContentType="feature:self-test"` (P-106) |
401:#### 7.1.1.1 ContentType 예외 — LegalDocument 면제 (LL-CASCADE-03 · LOCATION_LEGAL_PLAN v1.0 § 5)
416:#### 7.1.1.2 ContentType 예외 — Publication / MediaAppearance / FAQ (EC-CASCADE-03 · EAT_CONTENT_PLAN v0.x)
418:EAT_CONTENT_PLAN v0.x (C-24 Publication · C-25 MediaAppearance 신규 · C-12 FAQ 풀명세 합류) 의 검수 룰 적용 매트릭스:
420:| ContentType | answer-first AST | 표현 검사 | RiskRule | RiskInference | 비고 |
422:| `Publication` | **면제** | **면제** | **면제** (DB CHECK `risk_level='Low'` 고정) | **면제** | 외부 학술 인용 — clinic 자체 권고/표현 아님. 검수 input 자체가 외부 자료 (학술지) 라 불가 |
423:| `MediaAppearance` | **면제** | **면제** | **면제** (DB CHECK Low fixed) | **면제** | 외부 미디어 출연 인용 — 동일 사유 |
424:| `FAQ` Q | **적용** | **적용** (의료법 광고 표현 검수 · MEDICAL_AD_COMPLIANCE_COMMON 정합) | **적용** (compliance-assistant 합류 시 — EC-DEFER-05) | **적용** (RISK_LEVELS § 2 자동 추론 — 의료 진단/처방 질문 = Medium/High 후보) | 클리닉 자체 답변 |
425:| `FAQ` A | **적용** | **적용** | **적용** | **적용** | 동일 |
426:| `ArticleCategory` | (콘텐츠 자체 없음 · 분류 메타) | — | — | — | EAT v0.x C-22 실 운영 합류 — 룰 미적용 |
428:**v0.1 단계 운영 결정 (EAT v0.x EC-DEFER-12)**: 4 신규 entity (Publication·MediaAppearance·FAQ·ArticleCategory) 모두 어드민 폼 `status='draft'` 만 허용. compliance-assistant + risk_level 자동 추론 합류 (EC-DEFER-05) 까지 published 발행 차단. FAQ 는 DB CHECK 로 강제 (`faq_status_v01_limit`), Publication/MediaAppearance 는 zod schema 만 (DB CHECK 없음 — 외부 인용 entity 의 published 자체는 안전).
590:  | { type: "feature"; featureContentType: FeatureContentTypeId }  // P-106 등 Feature-backed 콘텐츠 전용 룰 (예: featureContentType="feature:self-test")
659:| ~~CS-C~~ | Feature-backed 콘텐츠 contentType cascade | v0.5 — DATA_MODEL C-10 enum에 `Feature` 토큰 1개 cascade 추가 + `featureContentType: feature:<slug>` 별도 필드로 세부 식별 (§ 7.1.1). Core enum의 기존 콘텐츠 토큰은 변경 없이 유지 |
669:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1) § 0 SoT 참조 § 5→§ 4 정정, (2) § 1.3 본문 길이 산정 기준 "1,000자(공백 제외)" + Markdown 정규화 알고리즘 명시 → CS-A 미결정 신설, (3) § 3.1 Q&A 렌더링(HTML `<dl>`)과 JSON-LD FAQPage schema 책임 분리, (4) § 3.1 Q&A 룰 fail/content-gate 분리 적용 (§ 4.1 직접 참조), (5)·(6) § 4.1 보장 표현 통합 fail + 수치/기간 단정(보장어 미포함) content-gate 분리, 유인성 표현(시간·수량 압박)과 할인·이벤트 사실 안내(법무 판정 영역) 분리, (7) § 4.2 "100% 효과" 대체 표현 — 효과 진술을 인용·통계 출처 동반으로만 한정 (치료경험담 위험 제거), (8) § 4.3·§ 5.6 환자 후기 — 의료법 제56조 직접 인용, 사전심의(제57조) 단정 표현 제거, 매체·방식별 법무 판정 명시, (9) § 4.3·§ 5.6 전후사진 — ReviewPolicy.beforeAfterPhotoAllowed 의미를 "법무 승인 후 예외적 허용 플래그"로 명확화, 승인자·일자 필수 기록 (CS-B 신설), (10) § 7.1 ContentType을 DATA_MODEL C-10 ComplianceRecord.contentType과 동일 enum 명시, (11) § 7.2 ComplianceCheckResult 인터페이스 확장 — buildBlocked/gateRequired/publishable/requiredApproverRole 분리, (12) § 7.4 RiskRule 스키마 신설 (id/category/pattern/patternType/severity/scope/requiredApproverRole/suggestion/rationale/exceptions/version) + ContentScope 5종 + CS-01 해소 |
673:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 잔재 정리 마감 (7개 지적 전건 수용)**: (1) **DATA_MODEL C-10 cascade 누락 정정** — `contentType` enum에 `Feature` 토큰 추가. `featureContentType` 필드도 함께 추가 (`feature:<slug>` 정규식 명시), (2) ApproverRole 중복 정의 제거 — ComplianceCheckResult 코드 블록의 중복 type 삭제. 단일 SoT는 § 7.1.3, (3) SimpleRiskRule `requiredApproverRole` 단수 잔재 → `requiredApproverRoles?: ApproverRole[]` 배열로 통일 (§ 7.2와 정합), (4) § 6 effect-result-related 표 — 기본 승인 역할 `["medical"]` 명시. 후기·사례·금액 결합 시 `legal` 추가 (§ 7.1.2 override와 정합), (5) ContentScope union에 `feature` 변형 추가 — Feature-backed 콘텐츠 전용 RiskRule 적용 가능, (6) § 0 한 페이지 요약 content-gate 정의 — § 8·SCHEMA_MAPPING § 7.3과 동일 통일 정의로 갱신 (schema 출력 승인 게이트 포함), (7) § 9.1 CS-C 해소 설명 정정 — DATA_MODEL C-10 enum `Feature` 토큰 cascade 정확히 기술. **다음 단계**: compliance/RISK_LEVELS.md 후속 + 자체 룰 checker 실제 구현 (CS-A·CS-D 영역) + admin 검수 워크플로 명세 + 그 발견을 본 문서에 되먹이기 |
674:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (12개 지적 전건 수용)**: (A) § 7.1 `featureContentType` 별도 필드 도입 — C-10 enum은 `Feature` 토큰 1개만 cascade 추가, 실제 구분은 namespace 필드로. (B) § 7.1.1 Feature 예시를 P-106 self-test로 정정 — P-105 ReservationPage는 Core C-20임을 명시. slug kebab-case 정규식(`^[a-z][a-z0-9-]*[a-z0-9]$`) 확정. (C) § 7.2 `findingsBySeverity` 키를 severity enum과 동일(`"content-gate"`)로 통일. (D) ApproverRole enum에 `client` 포함. (E) `requiredApproverRole` → `requiredApproverRoles: ApproverRole[]` 배열로. `review-case`는 `["medical", "legal"]` 기본값. 어드민 워크플로는 AND 조건으로 발행 게이트. (F) CompositeRiskRule `logic` enum 정밀화 — `AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR` 3종. (G) § 7.4.3 composite severity 4종 모두 허용으로 운영 규칙 정정. (H) ContentScope에 `featureContentType` 검증 흐름 (Feature contentType 입력 시) — 추후 검증기 구현. (9) § 3.5 인용 면제는 § 3.5 content-gate에만 적용 — § 4.1 fail 룰은 절대 완화 안 됨 명시. (10) § 4.3 가격·할인·이벤트 — P-102·P-104·P-010(`articleType=event-price`) cross-reference 명시. (11) **DATA_MODEL cascade — C-04 Article.body 권장 길이 "최소 300단어" → "최소 1,000자(공백 제외). CONTENT_STANDARDS § 1.3 SoT"** 정정. (12) § 8 content-gate 정의를 SCHEMA_MAPPING § 7.3과 통일 — schema 출력 승인 게이트 포함 |
675:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "PSR-DEFER-11|PSR-DEFER-15|FAQ|Article category|EAT" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "C0009|C0010|C0011|C0012|C0013|D0014|orderedMigrations|16" packages/migrations-runner/src/manifest.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "contentType|Publication|MediaAppearance|C-12|C-22|C-24|C-25|ArticleCategory|FAQ|category Ref" docs/core/DATA_MODEL.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "P-011|FAQ|11개|11 페이지|M0" docs/core/PAGE_TYPES.md' in C:\Users\assag\solution\website-exposure
 succeeded in 652ms:
8:// orderedMigrations 의 순서를 runner 가 그대로 따른다. orderIndex 가 강한 결정성 (이름 정렬 불가 — 다른
23: * orderedMigrations — LOCATION_LEGAL_PLAN v1.1 § 6 의존성 9단계 + PUBLIC_SITE_RENDER_PLAN v0.x § 8/§ 10 의 D0011 (10단계 — PSR-25/PSR-CASCADE-04 patch)
24: * + EAT_CONTENT_PLAN v0.x § 8/§ 12 EC-CASCADE-06 의 16단계 (C0009 article_category + C0010 publication + C0011 media_appearance + C0012 faq + C0013 article_category_fk staged + D0014 public_reader_eat).
27:export const orderedMigrations: ReadonlyArray<MigrationDescriptor> = [
130:    file: "packages/core-content/migrations/C0009_article_category.sql",
137:    file: "packages/core-content/migrations/C0010_publication.sql",
144:    file: "packages/core-content/migrations/C0011_media_appearance.sql",
151:    file: "packages/core-content/migrations/C0012_faq.sql",
159:    file: "packages/core-content/migrations/C0013_article_category_fk.sql",
168:  // (16) D0014 public_reader_eat — 4 신규 table GRANT/policy (EAT_CONTENT EC-CASCADE-05)
170:    file: "packages/db/migrations/D0014_public_reader_eat.sql",
196:  for (const [i, m] of orderedMigrations.entries()) {

 succeeded in 657ms:
4:> **작성일**: 2026-05-14 (v0.7 → v0.8 — § 6 M0 표 P-013 비고 SoT 정합 / 잔존 버전 표기 정리)
23:- M0 Slice: **10종 + Article 1샘플 = 11개 페이지** (P-001·P-002·P-003·P-004·P-005·P-006·P-011 FAQ·P-012·P-013·P-014 + P-010 1샘플) — EAT v0.x EC-CASCADE-08 patch (P-011 FAQ M0 합류).
34:| ID | 페이지 타입 | URL 패턴 | 주 데이터 계약 | M0 |
46:| P-011 | FAQ | `/faq` | `FAQ[]` | ✅ (EAT v0.x EC-CASCADE-08) |
108:4. 최신 인사이트 (M0에서 P-009 미합류 시 P-010 샘플로 직접 링크)
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
398:**목적**: 위치·진료시간·예약·상담 채널의 통합 전환 허브. 단순 안내 페이지가 아닌 **다중 CTA 채널 집결지**. M0 필수.
420:### P-013. Legal / Policy — **M0 출시 게이트** ⭐ v0.5 격상
422:**목적**: 개인정보처리방침·이용약관·비급여 진료 등 정책 페이지. **법적·규제 의무**. 폼·예약·분석 스크립트 운영 시 사실상 필수 (개인정보보호법·정통망법). M0 출시 게이트.
427:**M0 자동 생성 규칙** (v0.5 신규, v0.6 SoT 정정):
430:- **어드민 화면 추가 없음** — M0 어드민 화면 수 6개 유지. 운영자는 ClinicProfile 입력 시 정책 변수(개인정보 보호 책임자·시행일 등)만 추가 입력하거나, LegalDocument 파일을 Git에 수동 보강.
493:- **어드민 별도 LocationProfile 입력 화면 추가 불필요** (M0 어드민 화면 수 6개 유지).
583:**Schema 요약**: `WebPage` 또는 `MedicalWebPage` + `FAQPage` 일부.
596:> **1호 클라이언트 적용 후보**: 다이어트 유형 체크, 요요 위험도 체크, 체질 기반 사전문진. **M0 외 — Phase Alpha~Beta 도입 검토**.
602:| ID | 이름 | URL | 주 데이터 계약 | 주 Schema | 위험도 기본 | High-risk | M0 |
614:| P-011 | FAQ | `/faq` | FAQ[] | FAQPage | 답변 가변 | | |
627:## 6. Vertical Slice (M0) 페이지 타입 — 11개 페이지 (EAT v0.x EC-CASCADE-08: P-011 FAQ M0 합류)
642:**M0 어드민 화면 수: 6개 유지** (대시보드 / ClinicProfile / DoctorProfile / TreatmentPage / Article / 미리보기·발행). P-012·P-014·P-013은 모두 ClinicProfile·LocationProfile 입력값과 Core 표준 템플릿으로 자동 생성되므로 별도 화면 불필요.
644:**M0 미합류 합류 우선순위**:
646:2. P-011 FAQ
671:| PT-09 | FAQ 답변 단위 위험도 UI | admin |
685:| 2026-05-13 | v0.2 | P-013 격상, P-105 신설, P-103 명칭 확장, 위험도 격상 조건표, M0 Contact 추가 |
687:| 2026-05-13 | v0.4 | DEEP_DIVE 통합 1단계 — 번호 체계 재정렬(P-014 Location 필수, P-106 Self-test), Contact Conversion Hub, High-risk 묶음, M0 8+1=9 |
688:| 2026-05-14 | v0.5 | **피드백 적용**: (1) **전체 본문 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, 단독 구현 명세화, (2) **P-014 LocationProfile main 자동 생성 규칙 명시** (어드민 화면 추가 없음), (3) **P-006 TreatmentPage 정보 슬롯에 treatmentComponents·recommendedFor·visitFlow·remoteCareAvailable·maintenancePlan·evidenceNotes 즉시 통합**, (4) **P-010 Article 정보 슬롯에 reviewedBy·contentSource·externalUrl 즉시 통합**, (5) **P-106 Self-test를 "Feature-backed optional page"로 표현 변경** (PT-12 해소), (6) PT-14 LocationProfile 자동 생성 규칙 어드민 구현 세부 신규, (7) **v0.5.1 추가 정정**: **P-013 Legal/Policy를 M0 출시 게이트로 격상** — Core 표준 템플릿 + ClinicProfile 변수 자동 치환 생성. M0 페이지 수 9 → **10**. 어드민 화면 수 6개 그대로 (자동 생성). 법무 검토 필수 (ComplianceRecord 추적) |
691:| 2026-05-14 | v0.8 | **피드백 정정**: § 6 M0 표 P-013 비고를 SoT 정합으로 정정 — "v0.5 격상 — ClinicProfile 변수 치환" → "ClinicProfile · LocationProfile(main) 변수 치환, 출시 게이트, 법무 검토 필수". 잔존 버전 표기(§ 6 제목 "(v0.5 갱신)" 등) 제거 |

 succeeded in 684ms:
47:| **P-009 Articles List · P-011 FAQ · P-007/008 Conditions** | M0 미합류 — 별 plan (FAQ 는 EAT_CONTENT plan v0.1) |
74:| P-009 Articles List · P-011 FAQ · P-007/008 Conditions | 별 plan (EAT_CONTENT plan v0.1 안 FAQ · 별도 plan Conditions) | PSR-DEFER-11 |
78:| Article URL `/insights/[category]/[slug]` 의 category 운영 추가 (현재 C-04 article.category 없음) | EAT_CONTENT plan v0.1 또는 Article schema cascade · v0.1 은 단일 fallback category `"general"` | PSR-DEFER-15 |
140:CREATE ROLE app_public_reader LOGIN;
149:CREATE POLICY public_reader_instance_select
163:CREATE POLICY public_reader_clinic_profile_select
167:CREATE POLICY public_reader_location_profile_select
171:CREATE POLICY public_reader_doctor_profile_select
178:CREATE POLICY public_reader_treatment_page_select
187:CREATE POLICY public_reader_article_select
200:CREATE POLICY public_reader_legal_document_select
340:  - v0.1 결정: `sanitize-html` (단순함). 향후 EAT_CONTENT plan 안 FAQ 도 같은 컴포넌트 재사용 시 `rehype-sanitize` 로 전환 marker (PSR-DEFER-17).
561:- (PSR-SEO-13) `inLanguage` 명시 정책: SCHEMA_MAPPING § 1.5 정합 — CreativeWork 계열 (Article · WebPage · FAQPage 등) 만 명시. Organization · MedicalClinic · Physician 등은 미명시.
663:- `PSR-DEFER-17` (cycle1 PSR-19): Markdown sanitizer 를 `sanitize-html` → `rehype-sanitize` (unified pipeline) 전환 — EAT_CONTENT plan v0.1 안 FAQ 합류 시.
665:### 9.3 EAT_CONTENT plan v0.1 합류 — **해소 marker (EAT_CONTENT_PLAN v0.x EC-CASCADE-07)**
667:- `PSR-DEFER-11(부분)`: ✅ **해소** — FAQ (P-011) 추가 — schema.org `FAQPage` JSON-LD. EAT v0.x acceptance commit 안 합류. C-12 풀명세 + faq DB table (C0012) + P-011 공개 페이지.
668:- `PSR-DEFER-15` (cycle1 PSR-11): ✅ **해소** — Article `category` required 실 DB join · C-22 ArticleCategory 실 운영 합류 (C0009) · article.category_id staged 4-step migration (C0013) · Article detail SQL JOIN.
695:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |

 succeeded in 674ms:
38:| C-04 | `Article` | 인사이트·블로그 글 (category Ref<C-22> required) | L3 | Git | ✅ | P-009, P-010 |
46:| C-12 | `FAQ` | 질문-답변 묶음 (EAT v0.x 풀명세 합류 — § 4 C-12 본문 참조) | L3 | Git | ✅ | P-011 |
56:| C-22 | `ArticleCategory` | Article Pillar/Category 정의 (EAT v0.x DB 실 운영 합류 — v0.1 어드민 UI minimal · parentCategory/pillar/coverImageUrl/seoMeta/articleTypeDefault 컬럼은 DB nullable + EC-DEFER-10) | L2+L3 | Git+DB | ✅ | P-009, P-010 |
58:| C-24 | `Publication` | 학술 논문 외부 인용 (E-A-T 전문성 시그널 — schema.org `ScholarlyArticle`) — EAT v0.x 신규 | L3 | DB+Git | ✅ | P-002 About, P-004 Doctor Profile inline |
59:| C-25 | `MediaAppearance` | 미디어 출연 (방송·유튜브·팟캐스트·언론 — schema.org `VideoObject`) — EAT v0.x 신규 | L3 | DB+Git | ✅ | P-002 About, P-004 Doctor Profile inline |
331:| `publications` | `Publication[]` | optional | |
365:#### `Publication`
398:| `faqs` | `Ref<C-12>[]` | optional | 관련 FAQ |
484:| `category` | `Ref<C-22>` | ✅ | ArticleCategory |
771:| `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature, Publication, MediaAppearance}` (v0.6+, 17종) | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1). **(v0.6 + EC-CASCADE-01 patch)** `Publication`, `MediaAppearance` 추가 — EAT_CONTENT_PLAN v0.x 의 학술 인용 · 미디어 출연 E-A-T entity. ComplianceRecord 발행 게이트 통과 기록 대상 (Publication/MediaAppearance 는 외부 인용 → CONTENT_STANDARDS § 7.1.1.x 면제 + risk_level Low fixed) |
772:| `featureContentType` | `string` (`feature:<slug>` 형식, 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$`) | conditional | `contentType="Feature"` 시 required — Feature 콘텐츠 세부 식별. 예: `feature:self-test` |
877:- 발행 시 `ComplianceRecord(contentType=LegalDocument, legalCounsel=*, legalCounselAt=*)` 필수 — 위험도 Low 예외 게이트 (§ 4 C-10 참조).
915:### C-22. `ArticleCategory` — Article Pillar 분류
923:| `parentCategory` | `Ref<C-22>` | optional | 계층 구조 시 |
930:> **EAT_CONTENT_PLAN v0.x EC-SCHEMA-01 (DB 실 운영 합류)**: 본 풀명세 전체 컬럼이 `article_category` DB (C0009 migration) 에 모두 존재. v0.1 어드민 UI 와 공개 렌더는 `slug`/`name`/`description`/`displayOrder` 만 노출. 나머지 (`pillar`/`parent_category_id`/`cover_image_url`/`seo_meta`/`article_type_default`) 는 nullable + EC-DEFER-10 (M1 합류). C-04 Article `category` 필드는 required Ref<C-22> — DB `article.category_id` NOT NULL + composite FK (C0013 staged 4-step migration).
932:### C-24. `Publication` — 학술 논문 외부 인용 (E-A-T 전문성 시그널 · EAT v0.x 신규)
934:> **EAT_CONTENT_PLAN v0.x 신규 (C-24)** — 외부 학술 자료 인용 (clinic 자체 publisher 아님). schema.org `ScholarlyArticle` 매핑. Doctor Profile (P-004) · About (P-002) page 안 fragment-scoped inline 출력 v0.1 (별도 페이지 EC-DEFER-02).
961:### C-25. `MediaAppearance` — 미디어 출연 (E-A-T 권위성 시그널 · EAT v0.x 신규)
963:> **EAT_CONTENT_PLAN v0.x 신규 (C-25)** — clinic doctor 의 미디어 출연 (방송·유튜브·팟캐스트·언론). schema.org `VideoObject` 매핑 v0.1 — 모든 channel_type 단일화. BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1).
996:### C-12. `FAQ` — EAT v0.x **풀명세 합류 + M0 합류** (§ 4 본문 참조 — 본 § 5 entry 는 historical link)
1007:| `categoryId` | `Ref<C-22>` | optional | ArticleCategory |
1014:**Schema**: `FAQPage.mainEntity[].Question.acceptedAnswer.Answer`. P-011 graph self-contained (cross-page ref 미사용).
1116:   ├─ category → ArticleCategory (C-22)
1122:   ├─ contentRef → 발행 콘텐츠 (C-01~C-22)
1146:| DM-09 | ~~ArticleCategory~~ | 해소 — C-22 |
1165:| 2026-05-13 | v0.2 | 레퍼런스 분석 반영 — C-21·C-22, 필드 추가 |
1168:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
1169:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
1171:| 2026-05-14 | v0.8 | **피드백 정정**: § 4 내 C-16 위치를 C-22 뒤 → C-10 다음(C-21 앞)으로 이동, 번호 순 가독성 확보. § 5 자리표시도 한 줄 링크로 간소화 |

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content packages/migrations-runner/src/manifest.ts | ForEach-Object { $i++; if ($i -ge 120 -and $i -le 176) { '"'{0,5}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/core/PAGE_TYPES.md | ForEach-Object { $i++; if (($i -ge 600 -and $i -le 648) -or ($i -ge 20 -and $i -le 48)) { '"'{0,5}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/core/DATA_MODEL.md | ForEach-Object { $i++; if ($i -le 60 -or ($i -ge 1118 -and $i -le 1124)) { '"'{0,5}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 675ms:
   20: ## 0. 한 페이지 요약
   21: 
   22: - 필수 14종 + 선택 7종 = **21종 페이지 타입**.
   23: - M0 Slice: **10종 + Article 1샘플 = 11개 페이지** (P-001·P-002·P-003·P-004·P-005·P-006·P-011 FAQ·P-012·P-013·P-014 + P-010 1샘플) — EAT v0.x EC-CASCADE-08 patch (P-011 FAQ M0 합류).
   24: - **P-014 LocationProfile(main)·P-013 LegalDocument는 어드민 화면 추가 없이 ClinicProfile 화면의 기관 정체성 + 본원 위치·연락·시간 입력 + Core 표준 템플릿으로 자동 생성** (SoT: 위치·시간·연락은 LocationProfile이 마스터). 단지점·다지점 통일 처리.
   25: - High-risk commercial pages (P-101 Reviews · P-102 Pricing · P-104 News/Event 이벤트)는 Add-on 정책 기반 활성화.
   26: - P-106 Self-test는 **Feature-backed optional page** — 페이지 타입은 정의하되 Feature Module이 콘텐츠·로직을 제공.
   27: 
   28: ---
   29: 
   30: ## 1. 페이지 타입 분류
   31: 
   32: ### 1.1 필수 타입 (Core 표준 14종)
   33: 
   34: | ID | 페이지 타입 | URL 패턴 | 주 데이터 계약 | M0 |
   35: |---|---|---|---|:---:|
   36: | P-001 | Home | `/` | `ClinicProfile` (요약) | ✅ |
   37: | P-002 | About | `/about` | `ClinicProfile` (전체) | ✅ |
   38: | P-003 | Doctors List | `/doctors` | `DoctorProfile[]` | ✅ |
   39: | P-004 | Doctor Profile | `/doctors/{slug}` | `DoctorProfile` | ✅ |
   40: | P-005 | Treatments List | `/treatments` | `TreatmentPage[]` | ✅ |
   41: | P-006 | Treatment Detail | `/treatments/{slug}` | `TreatmentPage` | ✅ |
   42: | P-007 | Conditions List | `/conditions` | `MedicalConditionPage[]` | |
   43: | P-008 | Condition Detail | `/conditions/{slug}` | `MedicalConditionPage` | |
   44: | P-009 | Articles List | `/insights` 또는 `/blog` | `Article[]` | |
   45: | P-010 | Article Detail | `/insights/{cat}/{slug}` | `Article` | ✅ (1샘플) |
   46: | P-011 | FAQ | `/faq` | `FAQ[]` | ✅ (EAT v0.x EC-CASCADE-08) |
   47: | P-012 | Contact / Visit (Conversion Hub) | `/contact` | `ClinicProfile` + `LocationProfile[]` | ✅ |
   48: | P-013 | Legal / Policy | `/privacy`, `/terms` 등 | `LegalDocument` | ✅ (자동 생성) |
  600: ## 5. 페이지 타입 매트릭스 (전체 한눈에)
  601: 
  602: | ID | 이름 | URL | 주 데이터 계약 | 주 Schema | 위험도 기본 | High-risk | M0 |
  603: |---|---|---|---|---|:---:|:---:|:---:|
  604: | P-001 | Home | `/` | ClinicProfile | Organization + MedicalClinic + WebSite | Low | | ✅ |
  605: | P-002 | About | `/about` | ClinicProfile | Organization + MedicalClinic | Low | | ✅ |
  606: | P-003 | Doctors List | `/doctors` | DoctorProfile[] | ItemList | Low | | ✅ |
  607: | P-004 | Doctor Profile | `/doctors/{slug}` | DoctorProfile | Physician | Low | | ✅ |
  608: | P-005 | Treatments List | `/treatments` | TreatmentPage[] | ItemList | Low | | ✅ |
  609: | P-006 | Treatment Detail | `/treatments/{slug}` | TreatmentPage | MedicalProcedure | Medium | | ✅ |
  610: | P-007 | Conditions List | `/conditions` | MedicalConditionPage[] | ItemList | Low | | |
  611: | P-008 | Condition Detail | `/conditions/{slug}` | MedicalConditionPage | MedicalCondition | Medium | | |
  612: | P-009 | Articles List | `/insights` | Article[] | ItemList/Blog | Low | | |
  613: | P-010 | Article Detail | `/insights/{cat}/{slug}` | Article | Article (+VideoObject) | ArticleType 가변 | | ✅ (1) |
  614: | P-011 | FAQ | `/faq` | FAQ[] | FAQPage | 답변 가변 | | |
  615: | P-012 | Contact / Visit (Conversion Hub) | `/contact` | ClinicProfile + LocationProfile[] | MedicalClinic/LocalBusiness | Low | | ✅ |
  616: | P-013 | Legal / Policy | `/privacy` 등 | LegalDocument | WebPage | Low | | ✅ (자동) |
  617: | P-014 | Location / Branch Detail | `/locations/{slug}` | LocationProfile | MedicalClinic/LocalBusiness (지점) | Low | | ✅ (main) |
  618: | P-101 | Reviews | `/reviews` | ReviewPolicy + 후기 | (신중) | High | ✅ | |
  619: | P-102 | Pricing | `/pricing` | PricingPage | (신중) | High | ✅ | |
  620: | P-103 | Facilities / Equipment | `/facilities` | FacilitiesPage | WebPage | Medium | | |
  621: | P-104 | News / Event | `/news` | NewsItem[]/Article[] | NewsArticle/Article | 가변 | ✅ (이벤트) | |
  622: | P-105 | Reservation | `/reservation` | ReservationPage | LocalBusiness + ReserveAction | Low | | |
  623: | P-106 | Self-test / Quiz | `/self-test/{slug}` | SelfTest (Feature-backed) | WebPage / MedicalWebPage | Medium | | |
  624: 
  625: ---
  626: 
  627: ## 6. Vertical Slice (M0) 페이지 타입 — 11개 페이지 (EAT v0.x EC-CASCADE-08: P-011 FAQ M0 합류)
  628: 
  629: | 순서 | 페이지 타입 | 비고 |
  630: |---|---|---|
  631: | 1 | P-001 Home | 메인 |
  632: | 2 | P-002 About | ClinicProfile 노출 |
  633: | 3 | P-003 Doctors List | DoctorProfile 1명 이상 |
  634: | 4 | P-004 Doctor Profile | 1개 이상 |
  635: | 5 | P-005 Treatments List | TreatmentPage 1개 이상 |
  636: | 6 | P-006 Treatment Detail | 1개 이상 |
  637: | 7 | P-012 Contact (Conversion Hub) | ClinicProfile + LocationProfile[] |
  638: | 8 | P-014 Location Detail (main 자동) | 어드민 화면 추가 없이 자동 생성 (§ 3 P-014 규칙) |
  639: | **9** | **P-013 Legal / Policy (자동 생성)** | Core 표준 템플릿 + ClinicProfile · LocationProfile(main) 변수 치환 자동 생성. 어드민 화면 추가 없음. **출시 게이트** (법무 검토 필수 — ComplianceRecord.legalCounsel/legalCounselAt required) |
  640: | (샘플) | P-010 Article Detail | 1개 샘플 (Home에서 직접 링크 — 고립 회피) |
  641: 
  642: **M0 어드민 화면 수: 6개 유지** (대시보드 / ClinicProfile / DoctorProfile / TreatmentPage / Article / 미리보기·발행). P-012·P-014·P-013은 모두 ClinicProfile·LocationProfile 입력값과 Core 표준 템플릿으로 자동 생성되므로 별도 화면 불필요.
  643: 
  644: **M0 미합류 합류 우선순위**:
  645: 1. P-009 Articles List
  646: 2. P-011 FAQ
  647: 3. P-007/P-008 Conditions (다이어트 한의원 증상 기반 쿼리)
  648: 

 succeeded in 681ms:
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

 succeeded in 669ms:
    1: # Core — 데이터 계약 명세
    2: 
    3: > **상태**: Draft v0.24
    4: > **작성일**: 2026-05-15 (v0.24 — Spike 결정 SPIKE2-03 cascade: C-23 AdminUser.instanceMemberships에 `active`·`deactivatedAt`·`deactivatedBy` 필드 추가. resolveTenantContext 매 요청 검증 강제)
    5: > **소유자**: Glitzy
    6: > **상위 문서**: `docs/ARCHITECTURE.md` § 2.4, § 7
    7: > **연관 문서**:
    8: > - 페이지 타입 → `core/PAGE_TYPES.md`
    9: > - Schema 매핑 → `core/SCHEMA_MAPPING.md`
   10: > - 위험도 → `compliance/RISK_LEVELS.md`
   11: > - 디자인 토큰 → `core/DESIGN_TOKENS.md`
   12: > - 어드민 데이터 모델 → `admin/DATA_MODEL.md`
   13: > - 레퍼런스 분석 → `research/REFERENCE_ANALYSIS_2026-05.md`, `research/REFERENCE_DEEP_DIVE_2026-05.md`
   14: 
   15: ---
   16: 
   17: ## 0. 한 페이지 요약
   18: 
   19: - **23개 계약 (C-01~C-23) + 3개 공통 타입 (CT-01~CT-03)**.
   20: - v0.13: `features/notifications.md` cascade — C-08 확장(`adminBaseUrl`·`timezone`·`NotificationChannelsConfig`) + **C-23 `AdminUser` 신설** (어드민 사용자·자격·알림 선호 SoT).
   21: - 모든 계약은 공통 메타필드(`@id`, `@createdAt`, `@updatedAt`).
   22: - 빌드 입력 계약(Git 원본)과 운영 메타 계약(어드민 DB 원본) 구분.
   23: - **SoT 원칙**: `ClinicProfile`은 브랜드·기관 정체성·메타 통계만, **위치·전화·시간은 `LocationProfile`이 마스터**.
   24: - **RiskLevel은 enum 직접 사용** (`Ref<C-05>` 표기 제거).
   25: - v0.4: TreatmentPage·Article 컨텍스트 필드 즉시 통합 (1호 다이어트 한의원 직결).
   26: 
   27: ---
   28: 
   29: ## 1. 계약 인벤토리
   30: 
   31: ### 1.1 데이터 계약 (25개) — EC-CASCADE-01 patch (v0.10·EAT_CONTENT_PLAN v0.x acceptance commit)
   32: 
   33: | ID | 계약 이름 | 책임 | 소속 | 마스터 | M0 | 관련 페이지 타입 |
   34: |---|---|---|:---:|:---:|:---:|---|
   35: | C-01 | `ClinicProfile` | 의료기관 정체성 (브랜드·메타) | L3 | Git | ✅ | P-001, P-002 |
   36: | C-02 | `DoctorProfile` | 의료진 권위·전문성 | L3 | Git | ✅ | P-003, P-004 |
   37: | C-03 | `TreatmentPage` | 시술·치료 구조화 콘텐츠 | L3 | Git | ✅ | P-005, P-006 |
   38: | C-04 | `Article` | 인사이트·블로그 글 (category Ref<C-22> required) | L3 | Git | ✅ | P-009, P-010 |
   39: | C-05 | `RiskLevel` | 위험도 등급 (enum) | L1/L3 | Git+DB | ✅ | 전체 |
   40: | C-06 | `PageMeta` | 페이지별 메타 데이터 | L1/L3 | Git | ✅ | 전체 |
   41: | C-07 | `BrandTokens` | 디자인 토큰 최종값 | L3 | Git | ✅ | UI |
   42: | C-08 | `InstanceManifest` | 버전 고정 명세 | L3 | Git | ✅ | 빌드 |
   43: | C-09 | `FeatureModuleConfig` | Feature Module 설정 | L3 | Git | ✅ | 모듈 |
   44: | C-10 | `ComplianceRecord` | 컴플라이언스 게이트 통과 기록 | L1/L3 | DB+Git | ✅ | 발행 |
   45: | C-11 | `MedicalConditionPage` | 증상·질환 정보 | L3 | Git | | P-007, P-008 |
   46: | C-12 | `FAQ` | 질문-답변 묶음 (EAT v0.x 풀명세 합류 — § 4 C-12 본문 참조) | L3 | Git | ✅ | P-011 |
   47: | C-13 | `ReviewPolicy` | 후기 노출 정책 | L2+L3 | Git | | P-101 |
   48: | C-14 | `MedicalSpecialty` | 의료 전문 분야 | L2 | Git | | C-01,02 참조 |
   49: | C-15 | `SchemaInput` | JSON-LD 생성기 입력 | L1/L3 | 런타임 | ✅ | 전체 |
   50: | C-16 | `LegalDocument` | 정책·약관 (Core 표준 템플릿 + 변수 자동 치환) | L3 | Git | ✅ (auto) | P-013 |
   51: | C-17 | `PricingPage` | 가격 안내 | L3 | Git | | P-102 |
   52: | C-18 | `FacilitiesPage` | 시설·장비 | L3 | Git | | P-103 |
   53: | C-19 | `NewsItem` | 소식·이벤트 | L3 | Git | | P-104 |
   54: | C-20 | `ReservationPage` | 예약 안내 | L3 | Git | | P-105 |
   55: | C-21 | `LocationProfile` | 지점 정체성 (위치·시간·연락 마스터) | L3 | Git | ✅ | P-012, P-014 |
   56: | C-22 | `ArticleCategory` | Article Pillar/Category 정의 (EAT v0.x DB 실 운영 합류 — v0.1 어드민 UI minimal · parentCategory/pillar/coverImageUrl/seoMeta/articleTypeDefault 컬럼은 DB nullable + EC-DEFER-10) | L2+L3 | Git+DB | ✅ | P-009, P-010 |
   57: | C-23 | `AdminUser` | 어드민 사용자 (권한·자격·알림 선호 SoT) | L3 | DB | ✅ (admin) | 어드민 전용 |
   58: | C-24 | `Publication` | 학술 논문 외부 인용 (E-A-T 전문성 시그널 — schema.org `ScholarlyArticle`) — EAT v0.x 신규 | L3 | DB+Git | ✅ | P-002 About, P-004 Doctor Profile inline |
   59: | C-25 | `MediaAppearance` | 미디어 출연 (방송·유튜브·팟캐스트·언론 — schema.org `VideoObject`) — EAT v0.x 신규 | L3 | DB+Git | ✅ | P-002 About, P-004 Doctor Profile inline |
   60: 
 1118:    ├─ embeddedMedia → EmbeddedMedia[]
 1119:    └─ pageRiskLevel → RiskLevel
 1120: 
 1121: ComplianceRecord (C-10)
 1122:    ├─ contentRef → 발행 콘텐츠 (C-01~C-22)
 1123:    └─ pageRiskLevel → RiskLevel
 1124: ```

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/core/DATA_MODEL.md | ForEach-Object { $i++; if (($i -ge 760 -and $i -le 773) -or ($i -ge 915 -and $i -le 1015)) { '"'{0,5}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/decisions/EAT_CONTENT_PLAN.md | ForEach-Object { $i++; if (($i -ge 1 -and $i -le 7) -or ($i -ge 733 -and $i -le 739)) { '"'{0,5}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/core/SCHEMA_MAPPING.md | ForEach-Object { $i++; if (($i -ge 148 -and $i -le 156) -or ($i -ge 665 -and $i -le 675)) { '"'{0,5}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 625ms:
    1: # E-A-T Content 확장 plan (v0.3·draft·2026-05-18)
    2: 
    3: > **상태**: **v0.3 (draft)** — Codex 자동 비평 cycle 1 (22) + cycle 2 (8) 누계 **30 findings 전건 수용 patch**. PUBLIC_SITE_RENDER code v1.0 acceptance 직후 진입하는 첫 신규 콘텐츠 타입 plan. Lovable 사이트 (다이트한의원 부평점) 의 콘텐츠 종류 매핑에서 우리 명세에 누락된 부분 (논문·미디어·FAQ 풀명세 + ArticleCategory 실 운영) 을 Core 계약으로 확정한다.
    4: 
    5: > **plan v1.0 acceptance commit vs EAT_CONTENT code v1.0 cycle 분리 (cycle 2 ECP-23~30 정정 — LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합)**:
    6: > - **plan acceptance commit 안 cascade (docs only · acceptance precondition)**: 본 plan + DATA_MODEL § 1.1 인벤토리 25 + § 4 C-10 enum +2 + C-12 풀명세 + C-22 marker + C-24/25 신규 풀명세 + PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 11페이지 + SCHEMA_MAPPING § 2 ScholarlyArticle/VideoObject 카탈로그 + CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 + ARCH § 3.11 11 페이지 + M0_BUILD_EXPORT § 2.2 4 entity 변환 표 + PUBLIC_SITE_RENDER PSR-DEFER-11/15 해소 marker + manifest.ts orderedMigrations 16 entry (spec only — runner 코드는 LL-DEFER-20).
    7: > - **EAT_CONTENT code v1.0 cycle 안 cascade (별 사이클 분리 · 실 코드)**: migrations 6 (C0009/10/11/12/13 + D0014) · Drizzle schema v0.4 · zod schema · 어드민 폼 4종 + route 4종 + dashboard · JSON-LD entities/builders 확장 · P-011 FAQ public page · Doctor/About graph 확장 · Article detail SQL JOIN article_category · sitemap.xml 확장 · seed.ts default category · renderMarkdownToPlainText helper · vitest scenario 24~36.
  733: ## 변경 이력
  734: 
  735: | 일자 | 버전 | 변경 |
  736: |---|---|---|
  737: | 2026-05-18 | v0.1 | 초안 작성. Codex 자동 비평 사이클 진입 전 base. |
  738: | 2026-05-18 | v0.3 | **Codex 비평 cycle 2 8 findings (4 blocking + 4 major + 0 minor) 전건 수용 patch — docs cascade 실 patch 진입**: (ECP-23·24·25·26 blocking 4건 + ECP-27·28·29·30 major 4건) plan 본문 명시한 docs cascade 가 실 patch 안 됨 — plan acceptance commit 안 docs cascade 동시 적용 결정 (LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합). 본 patch 사이클에서 다음 실 적용: (1) DATA_MODEL § 1.1 인벤토리 23 → 25 contracts + C-24 Publication · C-25 MediaAppearance row 추가 + C-12 FAQ M0 ✅ + C-04 Article category required 명시. (2) DATA_MODEL § 4 C-10 contentType enum v0.6 — +Publication +MediaAppearance (17종). (3) DATA_MODEL § 4 C-22 ArticleCategory marker (DB 실 운영 합류 marker + EC-DEFER-10). (4) DATA_MODEL § 4 C-12 FAQ 풀명세 (question 10~200 · answer Markdown 50~2000 · v0.1 DB CHECK draft 만). (5) DATA_MODEL § 4 C-24 Publication 풀명세 (외부 학술 인용 · risk Low fixed). (6) DATA_MODEL § 4 C-25 MediaAppearance 풀명세 (모든 channel_type → VideoObject 단일화 v0.1). (7) PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 페이지 합계 11. (8) SCHEMA_MAPPING § 2 entity 카탈로그 — ScholarlyArticle 추가 · VideoObject MediaAppearance 매핑 추가 · FAQPage EAT v0.x M0 합류 + Answer.text helper marker. (9) CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 — Publication/MediaAppearance 면제 + FAQ Q/A 적용. (10) ARCH § 3.11 게이트 #1 — 11 페이지 + P-011 FAQ 합류. (11) M0_BUILD_EXPORT § 2.2 EAT 4 entity 변환 표. (12) PUBLIC_SITE_RENDER § 9.3 PSR-DEFER-11/15 해소 marker. (13) packages/migrations-runner/src/manifest.ts orderedMigrations 16 entry (C0009/10/11/12/13 + D0014). 코드 cascade (migrations 실 SQL · 어드민 폼 · Article detail SQL JOIN 등) 는 별도 EAT_CONTENT code v1.0 cycle. 누계 cycle 1+2 = 30 findings 전건 수용. |
  739: | 2026-05-18 | v0.2 | **Codex 비평 cycle 1 22 findings (7 blocking + 10 major + 5 minor) 전건 수용 patch**: (ECP-01) C-24/25 Publication/MediaAppearance · C-12 FAQ 풀명세 합류 · C-22 ArticleCategory 실 운영 합류 — DATA_MODEL 인벤토리 25 contracts. (ECP-02) C-22 풀명세 컬럼 전체 DB 추가 (v0.1 UI minimal · EC-DEFER-10). (ECP-03) Article.category_id staged 4-step migration (ADD nullable + seed + backfill + SET NOT NULL). (ECP-04) manifest 16단계 + 각 dependsOn 명시. (ECP-05·14) MediaAppearance 모든 channel_type → VideoObject 단일화 · fragment `#video-{slug}` 단일 · BroadcastEvent/NewsArticle 분기는 EC-DEFER-11. (ECP-06) Doctor/About graph self-contained — Publication/Media 풀 entity 출력. cross-page allowlist 미사용. (ECP-07) C-10 contentType enum +Publication +MediaAppearance v0.6 cascade. FAQ 토큰 대문자 통일. (ECP-08) DOI regex DB·zod 동일 anchored. (ECP-09) default `general` ArticleCategory seed = seed.ts + C0013 마이그레이션 backfill. (ECP-10·11) v0.1 단계 4 entity 어드민 status='draft' 강제 — FAQ DB CHECK + zod enum subset. EC-DEFER-12 신설. (ECP-12) PAGE_TYPES P-011 M0 ✅ — EC-CASCADE-08 acceptance precondition 격상. (ECP-13) Publication/Media `@id` fragment-scoped (Doctor/About page URL + fragment). (ECP-15) About publication/media reference 는 MedicalClinic.subjectOf 단일 결정. (ECP-16) ArticleCategory taxonomy public 의도 명시 — status 게이트 없음 + EC-DEFER-10. (ECP-17) Article detail SQL JOIN article_category · category.slug 매칭 작업 명시. (ECP-18) `authors` DEFAULT 제거. (ECP-19) `renderMarkdownToPlainText` helper 신규 — JSON-LD Answer.text. (ECP-20) external link rel `nofollow noopener noreferrer` 통일. (ECP-21) FAQ 빈 페이지 200 + sitemap 포함 + lastmod fallback. (ECP-22) Slice 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ. |

 succeeded in 627ms:
  148: | `Article` | P-010 Article Detail | Article (C-04) |
  149: | `NewsArticle` | (대체 — News 카테고리) | NewsItem (C-19) |
  150: | `FAQPage` | P-011 FAQ (EAT v0.x EC-CASCADE-02 M0 합류 — graph self-contained · cross-page allowlist 미사용 · 빈 FAQ 0 row 도 `mainEntity: []` 허용) | FAQ[] (C-12) |
  151: | `Question` / `Answer` | FAQPage.mainEntity (EAT v0.x — Answer.text = `renderMarkdownToPlainText(faq.answer)`) | FAQ |
  152: | `ItemList` | List 페이지 (P-003·P-005·P-007·P-009·...) | (생성기 자동) |
  153: | `Blog` | P-009 대체 (콘텐츠 운영 명확 시) | (선택) |
  154: | `VideoObject` | (a) Article.embeddedMedia[].type=youtube·video, P-010의 contentFormat=video. (b) **EAT v0.x EC-CASCADE-02 (신규)**: MediaAppearance (C-25) 모든 channel_type 단일화 — fragment `#video-{slug}` (Doctor/About page 안 fragment-scoped inline). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1) | EmbeddedMedia · MediaAppearance (C-25) |
  155: | `ScholarlyArticle` | **EAT v0.x EC-CASCADE-02 (신규)**: Publication (C-24) — Doctor Profile (P-004) · About (P-002) page 안 fragment-scoped inline (`@id` = `${pageBaseUrl}#publication-{slug}`). 별도 페이지는 EC-DEFER-02 (M1) | Publication (C-24) |
  156: | `ImageObject` | 이미지 자산 (사진·로고·OG 등) | (생성기 자동) |
  665: ### P-011. FAQ
  666: 
  667: **Graph 구성**:
  668: 1. `Organization` — **[풀]**
  669: 2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
  670: 3. `FAQPage` (Question/Answer) — **[풀]**
  671: 4. `BreadcrumbList` — **[풀]**
  672: 5. `WebPage` — **[풀]**, `isPartOf: #website`
  673: 
  674: **FAQPage**: 위 P-006 FAQPage와 동일 구조. 페이지 전체가 Question 모음일 때 `mainEntity` 배열.
  675: 

 succeeded in 639ms:
  760: 
  761: ### C-10. `ComplianceRecord` — 컴플라이언스 게이트 통과 기록
  762: 
  763: **마스터**: 어드민 DB 원본 + Git 사본 (가벼운 빌드 참조 메타)
  764: 
  765: #### 어드민 DB 원본 (풀데이터)
  766: 
  767: | 필드 | 타입 | required | 설명 |
  768: |---|---|:---:|---|
  769: | `@id` | `Slug` | ✅ | |
  770: | `instanceId` | `Slug` | ✅ | |
  771: | `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature, Publication, MediaAppearance}` (v0.6+, 17종) | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1). **(v0.6 + EC-CASCADE-01 patch)** `Publication`, `MediaAppearance` 추가 — EAT_CONTENT_PLAN v0.x 의 학술 인용 · 미디어 출연 E-A-T entity. ComplianceRecord 발행 게이트 통과 기록 대상 (Publication/MediaAppearance 는 외부 인용 → CONTENT_STANDARDS § 7.1.1.x 면제 + risk_level Low fixed) |
  772: | `featureContentType` | `string` (`feature:<slug>` 형식, 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$`) | conditional | `contentType="Feature"` 시 required — Feature 콘텐츠 세부 식별. 예: `feature:self-test` |
  773: | `contentRef` | `string` | ✅ | 대상 콘텐츠 `@id` |
  915: ### C-22. `ArticleCategory` — Article Pillar 분류
  916: 
  917: | 필드 | 타입 | required | 설명 |
  918: |---|---|:---:|---|
  919: | `@id` | `Slug` | ✅ | |
  920: | `name` | `string` | ✅ | 1~50자 |
  921: | `description` | `string` | optional | 80~200자 |
  922: | `pillar` | `string` | optional | 상위 Pillar |
  923: | `parentCategory` | `Ref<C-22>` | optional | 계층 구조 시 |
  924: | `slug` | `Slug` | ✅ | URL용 (보통 `@id`와 동일) |
  925: | `coverImageUrl` | `URL` | optional | |
  926: | `seoMeta` | `Ref<C-06>` | optional | 카테고리 페이지 PageMeta |
  927: | `displayOrder` | `number` | optional | |
  928: | `articleTypeDefault` | `string` | optional | 기본 ArticleType (작성 시 자동 추천 — EAT v0.x EC-DEFER-10) |
  929: 
  930: > **EAT_CONTENT_PLAN v0.x EC-SCHEMA-01 (DB 실 운영 합류)**: 본 풀명세 전체 컬럼이 `article_category` DB (C0009 migration) 에 모두 존재. v0.1 어드민 UI 와 공개 렌더는 `slug`/`name`/`description`/`displayOrder` 만 노출. 나머지 (`pillar`/`parent_category_id`/`cover_image_url`/`seo_meta`/`article_type_default`) 는 nullable + EC-DEFER-10 (M1 합류). C-04 Article `category` 필드는 required Ref<C-22> — DB `article.category_id` NOT NULL + composite FK (C0013 staged 4-step migration).
  931: 
  932: ### C-24. `Publication` — 학술 논문 외부 인용 (E-A-T 전문성 시그널 · EAT v0.x 신규)
  933: 
  934: > **EAT_CONTENT_PLAN v0.x 신규 (C-24)** — 외부 학술 자료 인용 (clinic 자체 publisher 아님). schema.org `ScholarlyArticle` 매핑. Doctor Profile (P-004) · About (P-002) page 안 fragment-scoped inline 출력 v0.1 (별도 페이지 EC-DEFER-02).
  935: 
  936: | 필드 | 타입 | required | 설명 |
  937: |---|---|:---:|---|
  938: | `@id` | `Slug` | ✅ | 3~99자 |
  939: | `instanceId` | `Slug` | ✅ | |
  940: | `title` | `string` | ✅ | 학술 논문 제목 (1~300자) |
  941: | `authors` | `string[]` | ✅ | 저자 이름 리스트 (min 1) |
  942: | `journal` | `string` | optional | 학술지명 |
  943: | `publishedDate` | `Date` | ✅ | 학술지 게재일 |
  944: | `doi` | `string` | optional | DOI · regex `^10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$` |
  945: | `pubmedId` | `string` | optional | PubMed ID · regex `^[0-9]{1,9}$` |
  946: | `url` | `URL` | ✅ | 외부 dereferenceable URL |
  947: | `thumbnailUrl` | `URL` | optional | |
  948: | `summary` | `string` | ✅ | 운영자 요약 (50~300자) |
  949: | `authorDoctorId` | `Ref<C-02>` | optional | 본 clinic doctor 가 저자일 때 (same-tenant composite FK) |
  950: | `status` | `content_publication_status` | ✅ | v0.1 어드민 UI `draft` 만 (EC-DEFER-12) |
  951: | `riskLevel` | `Ref<C-05>` | ✅ | **DB CHECK Low fixed** — 외부 인용 entity |
  952: | `publishedAt` | `Date` | conditional | status='published' 시 required |
  953: | `metadata` | `Record<string, unknown>` | optional | |
  954: | `createdAt` / `updatedAt` | `Date` | ✅ | |
  955: 
  956: **검수 · 위험도 · Schema**:
  957: - CONTENT_STANDARDS § 7.1.1.x: **answer-first AST · 표현 검사 · RiskRule · RiskInference 모두 면제** (외부 인용)
  958: - RISK_LEVELS § 2: Low fixed
  959: - Schema: `ScholarlyArticle` · `@id` = `${pageBaseUrl}#publication-{slug}` (fragment-scoped — Doctor/About page 안)
  960: 
  961: ### C-25. `MediaAppearance` — 미디어 출연 (E-A-T 권위성 시그널 · EAT v0.x 신규)
  962: 
  963: > **EAT_CONTENT_PLAN v0.x 신규 (C-25)** — clinic doctor 의 미디어 출연 (방송·유튜브·팟캐스트·언론). schema.org `VideoObject` 매핑 v0.1 — 모든 channel_type 단일화. BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1).
  964: 
  965: | 필드 | 타입 | required | 설명 |
  966: |---|---|:---:|---|
  967: | `@id` | `Slug` | ✅ | 3~99자 |
  968: | `instanceId` | `Slug` | ✅ | |
  969: | `title` | `string` | ✅ | 영상/방송 제목 (1~300자) |
  970: | `channelName` | `string` | ✅ | 방송사/유튜브 채널명 |
  971: | `channelType` | `enum {broadcast, youtube, podcast, press}` | ✅ | DB column 4종 모두 허용 · JSON-LD `@type` v0.1 단일 VideoObject |
  972: | `publishedDate` | `Date` | ✅ | 방송/업로드 일자 |
  973: | `durationSeconds` | `number` | optional | JSON-LD `duration: PT<seconds>S` |
  974: | `url` | `URL` | ✅ | 외부 URL |
  975: | `thumbnailUrl` | `URL` | optional | |
  976: | `summary` | `string` | ✅ | 운영자 요약 (50~300자) |
  977: | `authorDoctorId` | `Ref<C-02>` | optional | 출연 doctor (same-tenant composite FK) |
  978: | `status` | `content_publication_status` | ✅ | v0.1 어드민 UI `draft` 만 (EC-DEFER-12) |
  979: | `riskLevel` | `Ref<C-05>` | ✅ | **DB CHECK Low fixed** |
  980: | `publishedAt` | `Date` | conditional | status='published' 시 required |
  981: | `metadata` | `Record<string, unknown>` | optional | |
  982: | `createdAt` / `updatedAt` | `Date` | ✅ | |
  983: 
  984: **검수 · 위험도 · Schema**:
  985: - CONTENT_STANDARDS § 7.1.1.x: **면제** (외부 인용)
  986: - RISK_LEVELS § 2: Low fixed
  987: - Schema: `VideoObject` (모든 channel_type 단일화 v0.1) · `@id` = `${pageBaseUrl}#video-{slug}` (fragment-scoped — Doctor/About page 안). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11.
  988: 
  989: ---
  990: 
  991: ## 5. M0 외 계약 — 간략 명세 (후속 풀명세 예정)
  992: 
  993: ### C-11. `MedicalConditionPage`
  994: 필드: `name`, `definition`, `symptoms[]`, `causes[]`, `diagnosis`, `treatmentOptions`, `prevention`, `relatedTreatments[]`, `relatedDoctors[]`, `pageRiskLevel` (default Medium). Schema: `MedicalCondition`.
  995: 
  996: ### C-12. `FAQ` — EAT v0.x **풀명세 합류 + M0 합류** (§ 4 본문 참조 — 본 § 5 entry 는 historical link)
  997: 
  998: EAT_CONTENT_PLAN v0.x acceptance commit 안 § 4 풀명세로 격상. 본 § 5 row 는 cycle 5 cascade 후 정리.
  999: 
 1000: **풀명세 요약** (§ 4 안 풀명세 SoT 참조):
 1001: | 필드 | 타입 | required | 설명 |
 1002: |---|---|:---:|---|
 1003: | `@id` | `Slug` | ✅ | 3~99자 |
 1004: | `question` | `string` | ✅ | 10~200자 |
 1005: | `answer` | `string` (Markdown) | ✅ | 50~2000자. public HTML render = `renderMarkdownToHtml` · JSON-LD `Answer.text` = `renderMarkdownToPlainText` |
 1006: | `displayOrder` | `number` | ✅ | 어드민 입력 순서 |
 1007: | `categoryId` | `Ref<C-22>` | optional | ArticleCategory |
 1008: | `relatedTreatmentId` | `Ref<C-03>` | optional | EC-DEFER-09 |
 1009: | `relatedConditionId` | `Ref<C-11>` | optional | C-11 합류 후 |
 1010: | `authorDoctorId` | `Ref<C-02>` | optional | 답변 doctor |
 1011: | `status` | `content_publication_status` | ✅ | **v0.1 단계 DB CHECK `status='draft' AND published_at IS NULL` — EC-DEFER-05·12 (compliance-assistant + risk_level 자동 추론 합류 까지 published 차단)** |
 1012: | `riskLevel` | `Ref<C-05>` | ✅ | v0.1 default Low. RiskInference (자동 추론) 합류 시 Medium/High 자동 — RISK_LEVELS § 2 |
 1013: 
 1014: **Schema**: `FAQPage.mainEntity[].Question.acceptedAnswer.Answer`. P-011 graph self-contained (cross-page ref 미사용).
 1015: **검수 · 위험도**: CONTENT_STANDARDS § 7.1.1.x — Q/A 모두 answer-first AST · 표현 검사 · RiskRule · RiskInference 적용 (compliance-assistant 합류).

codex
# EAT_CONTENT_PLAN v0.3 — cycle 3 review

## summary
- 본 cycle 지적 수: blocking=0 major=1 minor=2 (총 3)
- closeableAfterPatch: false
- 수렴: cycle1=22 → cycle2=8 → cycle3=3

## cycle 2 patch 검증
- ECP-23: PASS — plan/code cycle 분리 명시됨: `plan acceptance commit 안 cascade` / `EAT_CONTENT code v1.0 cycle 안 cascade` (`EAT_CONTENT_PLAN.md:6-7`)
- ECP-24: PASS — DATA_MODEL 인벤토리 25 + C-24/25 추가 확인: `데이터 계약 (25개)` (`DATA_MODEL.md:31`), C-24/25 rows (`DATA_MODEL.md:58-59`)
- ECP-25: PARTIAL — §1.1 P-011은 M0 ✅ (`PAGE_TYPES.md:46`)이나, §5 matrix는 M0 blank (`PAGE_TYPES.md:614`)이고 §6 목록에도 FAQ row 누락 (`PAGE_TYPES.md:631-640`)
- ECP-26 (code v1.0 cycle 분리): PASS — Article detail SQL JOIN은 code cycle로 분리됨: `Article detail SQL JOIN article_category` (`EAT_CONTENT_PLAN.md:7`)
- ECP-27: PASS — SCHEMA_MAPPING 카탈로그 반영: `FAQPage` (`SCHEMA_MAPPING.md:150`), `VideoObject` (`SCHEMA_MAPPING.md:154`), `ScholarlyArticle` (`SCHEMA_MAPPING.md:155`)
- ECP-28: PASS — CONTENT_STANDARDS 예외 표 반영: `Publication`, `MediaAppearance`, `FAQ Q/A`, `ArticleCategory` (`CONTENT_STANDARDS.md:420-426`)
- ECP-29: PASS — ARCH/M0_BUILD_EXPORT/PSR cascade 확인: ARCH 11페이지 (`ARCHITECTURE.md:273`), 4 entity 변환 표 (`M0_BUILD_EXPORT_PLAN.md:73-76`), PSR-DEFER-11/15 해소 (`PUBLIC_SITE_RENDER_PLAN.md:667-668`)
- ECP-30: PASS — manifest 16 entry 반영: C0009~C0013 + D0014 (`manifest.ts:128-170`)

## new findings
- ECP-31 major — PAGE_TYPES 내부 M0 SoT 불일치. 상단과 §1.1은 P-011 M0 합류라 하지만, matrix와 §6/우선순위는 아직 미합류 상태.
  - `P-011 | FAQ ... | ✅` (`PAGE_TYPES.md:46`)
  - `P-011 | FAQ ... | | |` (`PAGE_TYPES.md:614`)
  - `M0 미합류 합류 우선순위 ... P-011 FAQ` (`PAGE_TYPES.md:644-646`)

- ECP-32 minor — DATA_MODEL 한 페이지 요약이 23개 계약으로 남아 §1.1 25개와 충돌.
  - `23개 계약 (C-01~C-23)` (`DATA_MODEL.md:19`)
  - `데이터 계약 (25개)` (`DATA_MODEL.md:31`)

- ECP-33 minor — DATA_MODEL 관계 다이어그램의 ComplianceRecord 대상 범위가 C-01~C-22로 남아 C-24/25 발행 게이트와 충돌.
  - `contentType ... Publication, MediaAppearance` (`DATA_MODEL.md:771`)
  - `contentRef → 발행 콘텐츠 (C-01~C-22)` (`DATA_MODEL.md:1122`)

## acceptance 판정
- plan v1.0 acceptance commit 진행 불가.
- ECP-31은 PAGE_TYPES cascade 핵심 잔재라 acceptance 전 patch 필요. ECP-32/33은 minor지만 같은 문서 cascade에서 함께 정리 권장.
tokens used
82,075
# EAT_CONTENT_PLAN v0.3 — cycle 3 review

## summary
- 본 cycle 지적 수: blocking=0 major=1 minor=2 (총 3)
- closeableAfterPatch: false
- 수렴: cycle1=22 → cycle2=8 → cycle3=3

## cycle 2 patch 검증
- ECP-23: PASS — plan/code cycle 분리 명시됨: `plan acceptance commit 안 cascade` / `EAT_CONTENT code v1.0 cycle 안 cascade` (`EAT_CONTENT_PLAN.md:6-7`)
- ECP-24: PASS — DATA_MODEL 인벤토리 25 + C-24/25 추가 확인: `데이터 계약 (25개)` (`DATA_MODEL.md:31`), C-24/25 rows (`DATA_MODEL.md:58-59`)
- ECP-25: PARTIAL — §1.1 P-011은 M0 ✅ (`PAGE_TYPES.md:46`)이나, §5 matrix는 M0 blank (`PAGE_TYPES.md:614`)이고 §6 목록에도 FAQ row 누락 (`PAGE_TYPES.md:631-640`)
- ECP-26 (code v1.0 cycle 분리): PASS — Article detail SQL JOIN은 code cycle로 분리됨: `Article detail SQL JOIN article_category` (`EAT_CONTENT_PLAN.md:7`)
- ECP-27: PASS — SCHEMA_MAPPING 카탈로그 반영: `FAQPage` (`SCHEMA_MAPPING.md:150`), `VideoObject` (`SCHEMA_MAPPING.md:154`), `ScholarlyArticle` (`SCHEMA_MAPPING.md:155`)
- ECP-28: PASS — CONTENT_STANDARDS 예외 표 반영: `Publication`, `MediaAppearance`, `FAQ Q/A`, `ArticleCategory` (`CONTENT_STANDARDS.md:420-426`)
- ECP-29: PASS — ARCH/M0_BUILD_EXPORT/PSR cascade 확인: ARCH 11페이지 (`ARCHITECTURE.md:273`), 4 entity 변환 표 (`M0_BUILD_EXPORT_PLAN.md:73-76`), PSR-DEFER-11/15 해소 (`PUBLIC_SITE_RENDER_PLAN.md:667-668`)
- ECP-30: PASS — manifest 16 entry 반영: C0009~C0013 + D0014 (`manifest.ts:128-170`)

## new findings
- ECP-31 major — PAGE_TYPES 내부 M0 SoT 불일치. 상단과 §1.1은 P-011 M0 합류라 하지만, matrix와 §6/우선순위는 아직 미합류 상태.
  - `P-011 | FAQ ... | ✅` (`PAGE_TYPES.md:46`)
  - `P-011 | FAQ ... | | |` (`PAGE_TYPES.md:614`)
  - `M0 미합류 합류 우선순위 ... P-011 FAQ` (`PAGE_TYPES.md:644-646`)

- ECP-32 minor — DATA_MODEL 한 페이지 요약이 23개 계약으로 남아 §1.1 25개와 충돌.
  - `23개 계약 (C-01~C-23)` (`DATA_MODEL.md:19`)
  - `데이터 계약 (25개)` (`DATA_MODEL.md:31`)

- ECP-33 minor — DATA_MODEL 관계 다이어그램의 ComplianceRecord 대상 범위가 C-01~C-22로 남아 C-24/25 발행 게이트와 충돌.
  - `contentType ... Publication, MediaAppearance` (`DATA_MODEL.md:771`)
  - `contentRef → 발행 콘텐츠 (C-01~C-22)` (`DATA_MODEL.md:1122`)

## acceptance 판정
- plan v1.0 acceptance commit 진행 불가.
- ECP-31은 PAGE_TYPES cascade 핵심 잔재라 acceptance 전 patch 필요. ECP-32/33은 minor지만 같은 문서 cascade에서 함께 정리 권장.
