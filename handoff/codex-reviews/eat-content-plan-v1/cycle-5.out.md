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
session id: 019e39de-0800-7dc3-be43-43b0ec5cedd7
--------
user
Review `docs/decisions/EAT_CONTENT_PLAN.md` v0.5 cycle 5.

## Cycle 4 patch (2 findings)

| # | severity | title | patch |
|---|---|---|---|
| ECP-34 | major | ARCH § 3.8 표 "10 페이지" | ARCH § 3.8 표 "11 페이지" + P-011 FAQ row 추가 + P-002/P-004 EAT v0.x marker + 어드민 화면 수 6→7 |
| ECP-35 | minor | PAGE_TYPES "어드민 화면 수 6개 유지" 잔재 | P-013/P-014 상세에서 "P-013/P-014 자체 화면 없음" 으로 정정 + § 6 어드민 7개 reference |

## Task

cycle 4 의 2건 검증 + 새 finding 확인. 짧게.

## Output (한국어 · 간결)

```
# EAT_CONTENT_PLAN v0.5 — cycle 5 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴: cycle1=22 → cycle2=8 → cycle3=3 → cycle4=2 → cycle5=N

## cycle 4 patch 검증
- ECP-34: PASS/FAIL + 한 줄
- ECP-35: PASS/FAIL

## new findings (있을 경우)

## acceptance 판정
- closeableAfterPatch=true 면 plan v1.0 acceptance commit 진행 권고
- 누계 35 findings 합산
```

cycle 4 의 2건 모두 PASS + 새 blocking/major 0 이면 closeableAfterPatch=true 확정.

codex
요청이 리뷰이므로 문서의 실제 현재 상태를 기준으로 검증하겠습니다. 먼저 관련 파일과 cycle 4 항목 주변만 빠르게 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"3\\.8|10 페이지|11 페이지|P-011|P-002|P-004|어드민 화면|6개|7개|P-013|P-014|PAGE_TYPES|EAT v0\" docs/decisions/EAT_CONTENT_PLAN.md" in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/decisions/EAT_CONTENT_PLAN.md -TotalCount 80' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'git status --short' in C:\Users\assag\solution\website-exposure\apps\web
2026-05-18T06:55:22.696670Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.6 seconds
Output:
rg: docs/decisions/EAT_CONTENT_PLAN.md: IO error for operation on docs/decisions/EAT_CONTENT_PLAN.md: 지정된 경로를 찾을 수 없습니다. (os error 3)

 exited 1 in 623ms:
rg: docs/decisions/EAT_CONTENT_PLAN.md: IO error for operation on docs/decisions/EAT_CONTENT_PLAN.md: 지정된 경로를 찾을 수 없습니다. (os error 3)

 succeeded in 646ms:
 M ../spike-a/package.json
 M ../spike-a/pgbouncer/userlist.txt
 M .env.example
 M package.json
 D src/app/(admin)/[instanceSlug]/articles/[slug]/page.tsx
 D src/app/(admin)/[instanceSlug]/articles/actions.ts
 D src/app/(admin)/[instanceSlug]/articles/new/page.tsx
 D src/app/(admin)/[instanceSlug]/articles/page.tsx
 D src/app/(admin)/[instanceSlug]/doctors/[slug]/page.tsx
 D src/app/(admin)/[instanceSlug]/doctors/actions.ts
 D src/app/(admin)/[instanceSlug]/doctors/new/page.tsx
 D src/app/(admin)/[instanceSlug]/doctors/page.tsx
 D src/app/(admin)/[instanceSlug]/page.tsx
 D src/app/(admin)/[instanceSlug]/treatments/[slug]/page.tsx
 D src/app/(admin)/[instanceSlug]/treatments/actions.ts
 D src/app/(admin)/[instanceSlug]/treatments/new/page.tsx
 D src/app/(admin)/[instanceSlug]/treatments/page.tsx
 M src/app/layout.tsx
 M src/app/page.tsx
 M src/app/sign-in/consume/route.ts
 M src/lib/env.ts
 M src/styles/globals.css
 M tailwind.config.ts
 M ../../docs/core/DATA_MODEL.md
 M ../../docs/core/PAGE_TYPES.md
 M ../../docs/core/SCHEMA_MAPPING.md
 M ../../docs/decisions/M0_BUILD_EXPORT_PLAN.md
 M ../../pnpm-lock.yaml
?? scripts/admin-qa-token.ts
?? scripts/seed-fixture.sql
?? scripts/site-scenarios.md
?? src/app/(admin)/admin/
?? src/app/(site)/
?? src/components/forms/ClinicProfileForm.tsx
?? src/components/site/
?? src/lib/db-projection.test.ts
?? src/lib/db-projection.ts
?? src/lib/errors.ts
?? src/lib/json-ld/
?? src/lib/markdown.test.ts
?? src/lib/markdown.ts
?? src/lib/public-db.ts
?? src/lib/public-tenant.ts
?? src/lib/site-initial.ts
?? src/lib/site-metadata.test.ts
?? src/lib/site-metadata.ts
?? src/lib/site-url.ts
?? vitest.config.ts
?? ../../docs/admin/ARCHITECTURE.md
?? ../../docs/core/CONTENT_STANDARDS.md
?? ../../docs/decisions/ADMIN_UI_SKELETON_PLAN.md
?? ../../docs/decisions/EAT_CONTENT_PLAN.md
?? ../../docs/decisions/LOCATION_LEGAL_PLAN.md
?? ../../docs/decisions/PUBLIC_SITE_RENDER_PLAN.md
?? ../../handoff/PROJECT_OVERVIEW.md
?? ../../handoff/codex-reviews/
?? ../../packages/core-content/migrations/C0002_location_profile.sql
?? ../../packages/core-content/migrations/C0006_legal_document.sql
?? ../../packages/core-content/migrations/C0008_location_profile_parent_clinic.sql
?? ../../packages/core-content/package.json
?? ../../packages/core-content/src/schema.ts
?? ../../packages/db/migrations/D0011_public_reader.sql
?? ../../packages/migrations-runner/src/

2026-05-18T06:55:22.809564Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.7 seconds
Output:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Path docs/decisions/EAT_CONTENT_PLAN.md -TotalCount 80[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot find path 'C:\Users\assag\solution\website-exposure\apps\web\docs\decisions\EAT_CONTENT_PLAN.md' because it does not exist.[0m

 exited 1 in 736ms:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m [36;1mGet-Content -Path docs/decisions/EAT_CONTENT_PLAN.md -TotalCount 80[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot find path 'C:\Users\assag\solution\website-exposure\apps\web\docs\decisions\EAT_CONTENT_PLAN.md' because it does not exist.[0m

codex
문서는 현재 앱 디렉터리 기준 `../../docs/decisions/EAT_CONTENT_PLAN.md`에 있습니다. 그 경로로 다시 열어 ARCH/PAGE_TYPES 교차 검증까지 진행합니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"3\\.8|10 페이지|11 페이지|P-011|P-002|P-004|어드민 화면|6개|7개|P-013|P-014|PAGE_TYPES|EAT v0|FAQ|faq\" ..\\..\\docs\\decisions\\EAT_CONTENT_PLAN.md" in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"3\\.8|10 페이지|11 페이지|P-011|P-002|P-004|어드민 화면|6개|7개|P-013|P-014|PAGE_TYPES|EAT v0|FAQ|faq\" ..\\..\\docs\\admin\\ARCHITECTURE.md" in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"10 페이지|11 페이지|P-011|P-002|P-004|어드민 화면|6개|7개|P-013|P-014|자체 화면|FAQ|faq\" ..\\..\\docs\\core\\PAGE_TYPES.md" in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 608ms:
32:│  │ 6개 핵심 화면 (Vertical Slice — § 3)                              │  │
120:### 3.2 Slice 포함 범위 — 6개 핵심 화면
125:| ② | 사이트 기본 정보 | 의료기관 정체성 + 본원 위치·연락·시간 + 정책 변수 입력 (3 섹션) | `ClinicProfile` + `LocationProfile`(main) + `LegalDocument`(privacy·terms 등) | 3 계약 동시 출력 — § 3.8.1 / § 3.8.2 자동 생성 규칙 적용 |
133:> § 3.8.1과 정합: 어드민 폼 한 화면이 두 계약을 분리 출력하는 경우 명시.
138:| `LocationProfile`(slug=`main`) (C-21) | 본원 주소·전화·이메일·진료시간(`BusinessHours`)·예약 채널(`CTAConfig[]`) | ✅ (ClinicProfile 폼의 "본원 위치·연락·시간" 섹션에서 자동) | ClinicProfile 화면 (본원 위치 섹션) — § 3.8.1 |
139:| `LegalDocument` (C-16) | `documentType`·`title`·`effectiveDate`·`contactPerson` (`body`는 Core 표준 템플릿 + 변수 자동 치환) | ✅ (Core 표준 템플릿 + ClinicProfile + LocationProfile 변수) | ClinicProfile 화면 (정책 변수 보조 섹션) — § 3.8.2 |
144:| `ComplianceRecord` (C-10) | 위험도·자동 검수 결과·검수자·일자·발행자·발행일 (LegalDocument는 `legalCounsel`·`legalCounselAt` 필수 — § 3.8.2) | ✅ (어드민이 발행 시 기록) | 미리보기·발행 화면 |
171:### 3.8 Slice 사이트 측 페이지 타입 (Data Plane이 빌드) — 10종 + Article 1샘플 = 11개 페이지 (EAT v0.x EC-CASCADE-08·09)
173:> 상세는 `core/PAGE_TYPES.md` § 6 (단일 진실 원본).
178:| 2 | P-002 About | ClinicProfile 노출 + EAT v0.x Publication/MediaAppearance inline (MedicalClinic.subjectOf) |
180:| 4 | P-004 Doctor Profile | 1개 이상 + EAT v0.x Publication/MediaAppearance inline (Physician.subjectOf) |
184:| 8 | **P-014 Location Detail (main 자동)** | LocationProfile(slug=`main`) 1개 자동 생성. 어드민 화면 추가 없음 (§ 3.8.1 규칙) |
185:| **9** | **P-013 Legal / Policy (자동 생성)** | **출시 게이트** — Core 표준 템플릿 + ClinicProfile 변수 치환. 법무 검토 필수 (§ 3.8.2 규칙) |
186:| **10** | **P-011 FAQ (EAT v0.x EC-CASCADE-08 합류)** | FAQPage JSON-LD · 어드민 Faq 폼 신규 · `/<slug>/faq` 공개 페이지 |
189:→ Slice **어드민 화면 수 7개 (EAT v0.x cascade)** — 기존 6개 + Faq 신규. P-012·P-014·P-013은 자동 생성. EAT v0.x 4 신규 entity (Publication·MediaAppearance·Faq·ArticleCategory) 어드민 폼은 코드 cycle에서 별도 합류.
191:### 3.8.1 LocationProfile(main) 자동 생성 규칙
220:### 3.8.2 LegalDocument 자동 생성 규칙
222:P-013 Legal/Policy는 출시 게이트이며 Core가 **표준 템플릿**(개인정보처리방침·이용약관·비급여 안내·환불·민원 처리)을 제공한다.
244:| policy | `{{policy.contactPerson}}` | ClinicProfile.policyContactPerson — § 3.8.2 "정책 변수" 보조 섹션 입력 |
249:**어드민 폼 처리**: ClinicProfile 폼에 "정책 변수" 보조 섹션 추가 (개인정보 보호 책임자명·연락처·정책 효력 발생일 등 입력). 별도 화면 추가 아닌 보조 섹션이므로 어드민 화면 수 6개 유지.
262:- BreadcrumbList, FAQPage (필요 시)
274:| 1 | 사이트 측 페이지 타입 10종 + Article 1샘플 빌드 (총 11 페이지) | Home·About·Doctors List·Doctor Profile·Treatments List·Treatment Detail·**Contact**·**Location Detail (main 자동)**·**Legal/Policy (자동, 법무 검토)**·**FAQ (EAT v0.x EC-CASCADE-08)**·Article Detail 1개 — 정적 빌드 가능. 상세는 PAGE_TYPES.md § 6 |
354:> **계약 필드 vs 폼 입력 필드의 구분** (§ 3.8.1 참조): 어드민 UI 한 화면이 여러 계약 필드를 분리해 출력하는 케이스가 있다. 화면 수와 계약 수는 1:1이 아니다.
356:**M0 어드민 화면별 입력·출력 매핑**:
358:| 어드민 화면 | 폼 섹션 | 출력 계약 파일 |
368:- `MedicalConditionPage`·`FAQ` 폼 — 해당 페이지 타입 합류 시 (Phase Alpha 우선)
513:| 2026-05-13 | v0.2 | **주요 갱신** (피드백 3차): (1) Control Plane 위상 도입, (2) Admin-first 원칙 명시, (3) **Vertical Slice (M0) 6개 화면 명세 신설** (§ 3) — Article 포함, (4) Phase 명칭 M0/M1/M2/M3 + Alpha/Beta/GA 병기, (5) Git 원본 vs DB 원본 데이터 분리 명확화 (§ 6), (6) Feature Modules 통합 원칙 명시, (7) ComplianceRecord 두 영역 교차 정책 (§ 6.3) | Glitzy (Claude 페어링) |
514:| 2026-05-13 | v0.3 | **PAGE_TYPES.md v0.2 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 5종 → **7종 + Article 1샘플 = 8개 페이지** (Contact 추가), (2) § 3.11 완료 게이트 #1 7종 빌드로 수정, (3) 단일 진실 원본은 `core/PAGE_TYPES.md`로 명시 (중복 회피). 어드민 화면 수 6개는 유지(Contact는 ClinicProfile 자동 생성) | Glitzy (Claude 페어링) |
515:| 2026-05-14 | v0.4 | **PAGE_TYPES v0.5 + DATA_MODEL v0.4 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 7종+1샘플 → **8종+1샘플=9개 페이지** (P-014 Location Detail 추가), (2) **§ 3.8.1 LocationProfile(main) 자동 생성 규칙 명시** — 어드민 화면 추가 없이 ClinicProfile 입력으로 자동 생성, (3) § 3.11 완료 게이트 #1 8종 빌드로 수정. 어드민 화면 수 6개는 그대로 유지 | Glitzy (Claude 페어링) |
516:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **§ 3.8.1 표현 정리** — 계약 필드(파일 출력)와 어드민 폼 입력 필드(UI 수집)의 구분 명시. ClinicProfile 폼은 두 섹션(기관 정체성 + 본원 위치·연락·시간)으로 출력은 ClinicProfile + LocationProfile main 두 파일, (2) **§ 3.8.2 LegalDocument 자동 생성 규칙 신규** — Core 표준 템플릿 + ClinicProfile 변수 치환, ComplianceRecord 추적, (3) **§ 3.8 Slice 9종+1샘플 → 10종+1샘플=10페이지** (P-013 격상 추가), (4) § 3.11 완료 게이트 #1 10종, (5) **§ 5.2 데이터 입력 영역** — 어드민 화면별 입력·출력 매핑 표 추가로 1:1이 아님 명시 | Glitzy (Claude 페어링) |
517:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **§ 3.3 ClinicProfile 행 분리** — 이전 v0.3 잔존 표현(ClinicProfile에 주소·전화·시간)을 SoT 정합으로 정정. ClinicProfile/LocationProfile(main)/LegalDocument 3개 계약 행 + 자동 생성 표시, (2) **§ 3.8.2 LegalDocument body 변수 출처 정정** — ClinicProfile + LocationProfile(main) 두 SoT 명시 (`{{clinic.*}}`·`{{location.main.*}}` 네임스페이스), (3) **§ 3.8.2 법무 검토 강제 룰** — LegalDocument는 위험도 Low이지만 ComplianceRecord.legalCounsel·legalCounselAt 필수 (어드민 발행 게이트 차단) | Glitzy (Claude 페어링) |
518:| 2026-05-14 | v0.7 | **피드백 정정**: § 3.2 Slice 6개 화면 표 — ② 사이트 기본 정보의 입력 데이터 `ClinicProfile`만 → **`ClinicProfile` + `LocationProfile`(main) + `LegalDocument`** 3 계약 동시 출력로 정정. § 3.8.1/§ 3.8.2와 정합 | Glitzy (Claude 페어링) |

 succeeded in 668ms:
3:> **상태**: **v0.5 (draft)** — Codex 자동 비평 cycle 1 (22) + cycle 2 (8) + cycle 3 (3) + cycle 4 (2) 누계 **35 findings 전건 수용 patch**. PUBLIC_SITE_RENDER code v1.0 acceptance 직후 진입하는 첫 신규 콘텐츠 타입 plan. Lovable 사이트 (다이트한의원 부평점) 의 콘텐츠 종류 매핑에서 우리 명세에 누락된 부분 (논문·미디어·FAQ 풀명세 + ArticleCategory 실 운영) 을 Core 계약으로 확정한다.
6:> - **plan acceptance commit 안 cascade (docs only · acceptance precondition)**: 본 plan + DATA_MODEL § 1.1 인벤토리 25 + § 4 C-10 enum +2 + C-12 풀명세 + C-22 marker + C-24/25 신규 풀명세 + PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 11페이지 + SCHEMA_MAPPING § 2 ScholarlyArticle/VideoObject 카탈로그 + CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 + ARCH § 3.11 11 페이지 + M0_BUILD_EXPORT § 2.2 4 entity 변환 표 + PUBLIC_SITE_RENDER PSR-DEFER-11/15 해소 marker + manifest.ts orderedMigrations 16 entry (spec only — runner 코드는 LL-DEFER-20).
7:> - **EAT_CONTENT code v1.0 cycle 안 cascade (별 사이클 분리 · 실 코드)**: migrations 6 (C0009/10/11/12/13 + D0014) · Drizzle schema v0.4 · zod schema · 어드민 폼 4종 + route 4종 + dashboard · JSON-LD entities/builders 확장 · P-011 FAQ public page · Doctor/About graph 확장 · Article detail SQL JOIN article_category · sitemap.xml 확장 · seed.ts default category · renderMarkdownToPlainText helper · vitest scenario 24~36.
18:모든 entity 는 schema.org JSON-LD 로 출력되어 P-004 Doctor Profile · P-002 About · P-011 FAQ 페이지에 합류한다.
20:> **scope limit (EC-INTRO-01)** — 본 plan 은 다음만 다룬다: (1) C-24 Publication · C-25 MediaAppearance 신규 + C-12 Faq · C-22 ArticleCategory 합류. (2) DATA_MODEL C-10 `contentType` enum cascade (+Publication +MediaAppearance). (3) PSR-DEFER-11(부분: FAQ P-011) · PSR-DEFER-15 (Article category required) 해소. (4) PUBLIC_SITE_RENDER code v1.0 의 D0011 GRANT cascade (D0014). **본 plan 외**: Inquiry (1:1 상담 게시판 — PIPA 큰 결정), Reviews/Pricing High-risk commercial, Publication/MediaAppearance 별도 페이지 (모두 EC-DEFER).
25:- `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ — M0 미합류 → 본 plan 합류 (EC-CASCADE-08)
26:- `docs/core/SCHEMA_MAPPING.md` § 1.2 `@id` 패턴 · § 2 entity 카탈로그 (+ ScholarlyArticle, VideoObject) · § 3 P-011 FAQ graph (EC-CASCADE-02)
27:- `docs/core/SEARCH_STANDARDIZATION.md` § 4.3 sitemap P-011 monthly 0.5
28:- `docs/core/CONTENT_STANDARDS.md` v1.3 § 7.1.1.x — Publication/MediaAppearance 외부 인용 면제 · FAQ Q/A 광고 표현 검수 적용 (EC-CASCADE-03)
29:- `docs/compliance/RISK_LEVELS.md` v1.1 § 2 — FAQ 자동 추론 대상 (의료 질문 = Medium/High 후보), Publication/MediaAppearance Low fixed
30:- `docs/admin/ARCHITECTURE.md` § 3 — Vertical Slice 안 P-011 FAQ 페이지 합류 marker (EC-CASCADE-09)
31:- `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v1.0 § 1.3 PSR-DEFER-11 (FAQ 부분 해소) + PSR-DEFER-15 (Article category 해소) (EC-CASCADE-07)
49:- **AEO 직접 매핑** — FAQ 의 `FAQPage` JSON-LD 는 네이버 스마트블록 · AI Overview · 답변 봇에 직접 인용 가능.
62:| C-10 contentType enum cascade (cycle 1 ECP-07 정정) | 기존 enum 15종 + `Publication` + `MediaAppearance` = 17종. FAQ · ArticleCategory · LegalDocument · Feature 는 이미 enum 안 (토큰 그대로 사용 — `FAQ` 대문자) |
63:| 마이그레이션 5건 + D0014 | C0009 article_category · C0010 publication · C0011 media_appearance · C0012 faq · C0013 article_category_fk + backfill + SET NOT NULL · D0014 public_reader_eat |
64:| D0014 GRANT + per-table policy (cycle 1 ECP-16 정정) | D0011 패턴 정합 — publication/media_appearance/faq 는 published only · article_category 는 instance_id only (taxonomy public 의도 명시 — 분류 자체는 RLS instance scope · status 없음) |
66:| status zod enum subset (cycle 1 ECP-10·11 정정) | v0.1 단계 status zod = `z.enum(['draft'])` 만 — compliance-assistant 합류 (EC-DEFER-05) 전까지 모든 4 entity 어드민 폼에서 published 차단. **FAQ 도 published 차단** (위험도 자동 추론 합류 전 Medium/High 자동 발행 회피). LegalDocument 패턴 정합 |
67:| 공개 페이지 P-011 FAQ 신설 (cycle 1 ECP-12 정정 — PAGE_TYPES M0 합류 EC-CASCADE-08 acceptance precondition 격상) | `/<slug>/faq` route — FaqList + FAQPage JSON-LD |
68:| Doctor Profile (P-004) 확장 | Publications + MediaAppearances **graph 안 풀 entity 출력** (cycle 1 ECP-06·13 정정 — cross-page ref + allowlist 옵션 폐기). `@id` = fragment-scoped: `${doctorProfileUrl}#publication-{slug}` · `${doctorProfileUrl}#video-{slug}` |
69:| About (P-002) 확장 | Doctor 외 author_doctor_id IS NULL 인 clinic-level Publications + MediaAppearances. graph 안 풀 entity. `@id` = `${aboutUrl}#publication-{slug}` · `${aboutUrl}#video-{slug}` |
70:| MedicalClinic.subjectOf 통일 (cycle 1 ECP-15 정정) | About P-002 의 publication/media reference 는 `MedicalClinic.subjectOf` array (Organization 미사용 단일 결정) |
72:| JSON-LD generator 추가 | ScholarlyArticle · VideoObject (모든 channel_type) · FAQPage · Question · Answer + graph 안 풀 entity 출력 |
73:| sitemap.xml 확장 | P-011 FAQ entry (changefreq monthly · priority 0.5 · lastmod `MAX(faq.updated_at)`) — published row 0건이어도 페이지 포함 (cycle 1 ECP-21 정정) |
74:| FAQ helper 2 종 (cycle 1 ECP-19 정정) | `renderMarkdownToHtml` (public HTML rendering · 기존) + 신규 `renderMarkdownToPlainText` (JSON-LD Answer text · strip + sanitize) |
76:| PSR-CASCADE-04 D0011 GRANT cascade | publication · media_appearance · faq · article_category 4 table — D0014 신규 migration |
77:| CONTENT_STANDARDS § 7.1.1.x 확장 | Publication/MediaAppearance 외부 인용 면제 · FAQ Q/A 광고 표현 검수 적용 |
89:| FAQ 자동 검수 (compliance-assistant + RiskRule + RiskInference) 완전 통합 | compliance-assistant Feature 본 구현 cascade | EC-DEFER-05 |
90:| FAQ 다국어 (`inLanguage`) | M3 다국어 cascade | EC-DEFER-06 |
93:| FAQ.metadata.featuredOnHome — Home 안 inline 표시 | M1 Phase Alpha | EC-DEFER-09 |
307:### 2.5 C-12 `faq` 풀명세 합류 신규 table (EC-SCHEMA-13)
310:-- packages/core-content/migrations/C0012_faq.sql
312:CREATE TABLE faq (
330:  CONSTRAINT faq_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,99}$'),
331:  CONSTRAINT faq_question_length CHECK (length(question) BETWEEN 10 AND 200),
332:  CONSTRAINT faq_answer_length CHECK (length(answer) BETWEEN 50 AND 2000),
333:  CONSTRAINT faq_status_v01_limit CHECK (status = 'draft'),  -- cycle 1 ECP-10·11 정정: v0.1 published 차단
334:  CONSTRAINT faq_published_at_null_v01 CHECK (published_at IS NULL),  -- v0.1 published 자체 차단
335:  CONSTRAINT faq_instance_slug_unique UNIQUE (instance_id, slug),
336:  CONSTRAINT faq_instance_id_unique UNIQUE (instance_id, id),
337:  CONSTRAINT faq_category_fk FOREIGN KEY (instance_id, category_id)
339:  CONSTRAINT faq_author_doctor_fk FOREIGN KEY (instance_id, author_doctor_id)
341:  CONSTRAINT faq_related_treatment_fk FOREIGN KEY (instance_id, related_treatment_id)
346:CREATE INDEX faq_instance_idx ON faq (instance_id);
347:CREATE INDEX faq_status_idx ON faq (instance_id, status);
348:CREATE INDEX faq_published_idx ON faq (instance_id, published_at, display_order)
350:CREATE INDEX faq_category_idx ON faq (instance_id, category_id)
353:ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
354:ALTER TABLE faq FORCE ROW LEVEL SECURITY;
355:CREATE POLICY tenant_isolation ON faq FOR ALL TO app_tenant_user
358:GRANT SELECT, INSERT, UPDATE, DELETE ON faq TO app_tenant_user;
373:GRANT SELECT ON article_category, publication, media_appearance, faq TO app_public_reader;
397:-- FAQ: v0.1 단계 DB CHECK 가 status='draft' 만 허용. RLS published 만 SELECT → 자동 0 row → /faq 빈 페이지.
399:CREATE POLICY public_reader_faq_select
400:  ON faq FOR SELECT TO app_public_reader
416:| `ClinicProfile` · `DoctorProfile` · `TreatmentPage` · `MedicalConditionPage` · `Article` · `FAQ` · `ReviewPolicy` · `PricingPage` · `FacilitiesPage` · `NewsItem` · `ReservationPage` · `LocationProfile` · `ArticleCategory` · `LegalDocument` · `Feature` | + `Publication` + `MediaAppearance` |
419:- (EC-CONTENT-04 · cycle 1 ECP-07 정정) audit emit `content-saved` payload 의 `contentType` 토큰 = SoT enum 그대로. FAQ 는 대문자 `FAQ`. Publication/MediaAppearance 는 PascalCase. ArticleCategory 도 PascalCase 기존.
431:| Faq | `/admin/<slug>/faqs` |
440:- mapDbErrorToResult 안 `faq_status_v01_limit` · `faq_published_at_null_v01` 매핑 — formError "FAQ 발행은 compliance-assistant + 위험도 자동 추론 합류 후 가능합니다 (EC-DEFER-05·12)".
454:- `saveX(instanceSlug, _prev, formData)` — withSkeletonTx · zod parse · INSERT/UPSERT · audit emit (eventType `content-saved` · payload `{contentType: 'Publication'|'MediaAppearance'|'FAQ'|'ArticleCategory', slug, mode, status, originalSlug}`).
460:`/admin/<slug>/page.tsx` 안 4 신규 entity card 추가 (count + new link). 기존 4 card (Clinic·Doctors·Treatments·Articles) + 4 신규 (Categories·Publications·Media·FAQs) = 총 8 card.
464:### 5.1 P-011 FAQ 신규 페이지 (EC-RENDER-01) — PSR-DEFER-11 부분 해소
466:`apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx` 신설:
467:- 데이터: `faq` published row (RLS 자동 — v0.1 단계 0 row 가능 · cycle 1 ECP-21 정정)
470:- JSON-LD: schema.org `FAQPage` + `Question`/`Answer` array (cycle 1 ECP-19 정정 — `renderMarkdownToPlainText` helper 사용). 0 row 면 `mainEntity: []` 빈 array 출력.
474:### 5.2 Doctor Profile (P-004) 확장 — graph 안 풀 entity 출력 (EC-RENDER-02) — cycle 1 ECP-06·13 정정
488:### 5.3 About (P-002) 확장 — MedicalClinic.subjectOf 단일 결정 (EC-RENDER-03) — cycle 1 ECP-15 정정
521:- FAQ rendering 분기:
523:  - JSON-LD `FAQPage.mainEntity.Question.acceptedAnswer.text`: `renderMarkdownToPlainText(answer)`
527:- P-011 `/<slug>/faq` 추가 — changefreq `monthly` · priority `0.5` (SEARCH_STANDARDIZATION § 4.3 정합).
528:- lastmod: published faq 가 있으면 `MAX(faq.updated_at)`. 0 row 이면 `clinic.updated_at` fallback.
577:### 6.3 FAQPage (P-011) — cycle 1 ECP-19 정합
581:  "@type": "FAQPage",
582:  "@id": "{siteBaseUrl}/faq#faqpage",
587:      "name": "<faq.question>",
590:        "text": "<renderMarkdownToPlainText(faq.answer)>"
602:| P-002 About | `[풀] Organization` · `[풀] MedicalClinic` · `[풀] WebPage` (with `MedicalClinic.subjectOf` array) · `[풀] BreadcrumbList` · `[풀] ScholarlyArticle[]` (all clinic publications) · `[풀] VideoObject[]` (all clinic media) |
603:| P-004 Doctor Profile | `[풀] Organization` · `[풀] Physician` (with `subjectOf` array) · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] ScholarlyArticle[]` (author=doctor publications) · `[풀] VideoObject[]` (author=doctor media) |
604:| P-011 FAQ | `[풀] Organization` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] FAQPage` (with Question[] inline `mainEntity`) |
619:| `FAQ` Q | **적용** | **적용** (의료법 광고 표현 검수) | **적용** (compliance-assistant 합류 시 · EC-DEFER-05) | **적용** (Medium/High 자동 추론) |
620:| `FAQ` A | **적용** | **적용** | **적용** | **적용** |
625:- (EC-CONTENT-02) FAQ 적용 — 클리닉 자체 답변 → 의료법 광고 표현 검수. RiskInference Medium/High 자동 (RISK_LEVELS § 2 정합).
634:- `packages/core-content/migrations/C0012_faq.sql` (신규)
639:  - 11~16 (신규): C0009 article_category → C0010 publication → C0011 media_appearance → C0012 faq → C0013 article_category_fk (article ALTER + backfill + SET NOT NULL) → D0014 public_reader_eat
640:  - dependsOn 정합: C0010/C0011/C0012 dependsOn = `instance` + `doctor_profile` (authorDoctorId FK) + `content_publication_status` + `risk_level`. C0013 dependsOn = `article` + `article_category`. D0014 dependsOn = `article_category` + `publication` + `media_appearance` + `faq` + `app_public_reader` (D0011 의 role · creates).
648:| 26 | FAQ — v0.1 단계 published 차단 검증 | `INSERT ... status='published'` 시도 → CHECK `faq_status_v01_limit` 위반 (cycle 1 ECP-10·11 정합) |
649:| 27 | FAQPage graph 안 `mainEntity` 0건 (v0.1 published 차단 → 0 row) | self-rule-checker PASS · 빈 array OK |
656:| 34 | FAQ Markdown answer 안 `<script>` payload → JSON-LD `Answer.text` 평문 strip | renderMarkdownToPlainText 정합 |
667:| 4 | C0012 faq migration (cycle 1 ECP-10·11 — status='draft' CHECK + published_at IS NULL CHECK) | C0012_faq.sql |
673:| 10 | 4 admin route group + actions.ts | apps/web/src/app/(admin)/admin/[instanceSlug]/{publications,media-appearances,faqs,categories}/{page,new/page,[slug]/page,actions}.tsx |
674:| 11 | mapDbErrorToResult constraint 매핑 추가 | apps/web/src/lib/errors.ts (publication_* · media_appearance_* · faq_* · article_category_*) |
676:| 13 | JSON-LD entity 추가 (cycle 1 ECP-05·06·13·14·15 정합) | apps/web/src/lib/json-ld/entities.ts (scholarlyArticleEntity · videoObjectEntity · faqPageEntity · questionEntity) |
677:| 14 | JSON-LD builders 확장 (graph self-contained · fragment-scoped `@id`) | apps/web/src/lib/json-ld/builders.ts (faqPageGraph 신규 · doctorProfileGraph · aboutGraph patch — ScholarlyArticle/VideoObject 풀 entity inline) |
679:| 16 | P-011 FAQ public page (cycle 1 ECP-21 — 빈 페이지도 200) | apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx + metadata + JsonLdScript |
680:| 17 | Doctor Profile (P-004) 확장 — Publications + MediaAppearances inline + graph self-contained | doctors/[slug]/page.tsx |
681:| 18 | About (P-002) 확장 — MedicalClinic.subjectOf 단일 결정 | about/page.tsx |
683:| 20 | sitemap.xml 확장 — P-011 FAQ entry + article URL 실 category slug | (site)/[instanceSlug]/sitemap.xml/route.ts |
689:| 26 | docs cascade — DATA_MODEL § 1.1 인벤토리 25 contracts · § 4 C-10 enum +2 · C-12 풀명세 · C-22 풀명세 컬럼 정합 · C-24 Publication · C-25 MediaAppearance 풀명세 (EC-CASCADE-01) · SCHEMA_MAPPING § 2 entity 카탈로그 · § 3 P-011 (EC-CASCADE-02) · CONTENT_STANDARDS § 7.1.1.x (EC-CASCADE-03) · PSR-DEFER-11/15 해소 marker (EC-CASCADE-07) · M0_BUILD_EXPORT § 2.1 (EC-CASCADE-04) · PAGE_TYPES § 1.1 P-011 M0 ✅ + § 3 본문 (EC-CASCADE-08 acceptance precondition — cycle 1 ECP-12 격상) · ARCH § 3 Vertical Slice 정합 (EC-CASCADE-09 — 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ) | doc patches |
701:- `EC-DEFER-06`: FAQ 다국어.
702:- `EC-DEFER-09`: FAQ.metadata.featuredOnHome + related Treatment/Condition UI.
707:- `EC-DEFER-05`: FAQ 자동 검수 (compliance-assistant + RiskRule + RiskInference).
714:  - § 1.1 인벤토리 25 contracts (+ C-24 Publication, C-25 MediaAppearance) · C-12 FAQ M0 ✅ · C-22 ArticleCategory M0 ✅ · C-24/25 row 추가.
716:  - § 4 C-12 FAQ 간략 명세 → 풀명세 (question 10~200, answer 50~2000 Markdown · category Ref<C-22> optional · relatedTreatment optional · authorDoctor optional · status content_publication_status · riskLevel C-05 default Low).
723:  - § 2 entity 카탈로그 — ScholarlyArticle · VideoObject (모든 channel_type) · FAQPage · Question · Answer 추가.
724:  - § 3 P-011 FAQ graph + P-002/P-004 graph 확장 (ScholarlyArticle/VideoObject 풀 entity).
725:- `EC-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7.1.1.x ContentType 예외 표 — Publication/MediaAppearance 면제 · FAQ Q/A 적용.
726:- `EC-CASCADE-04`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2.1 SSR 재사용 표 — 신규 4 entity (article_category · publication · media_appearance · faq) Git output 변환 marker.
729:- `EC-CASCADE-07`: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` — PSR-DEFER-11 부분 (FAQ) + PSR-DEFER-15 (Article category) 해소 marker.
730:- `EC-CASCADE-08` (cycle 1 ECP-12 정정 — acceptance precondition 격상): `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ M0 ✅ + § 3 P-011 본문 작성 (질문 위계 + AEO 친화).
731:- `EC-CASCADE-09` (cycle 1 ECP-22 정정): `docs/admin/ARCHITECTURE.md` § 3 Slice 페이지 합계 = **11페이지** (기존 9 + P-010 1샘플 + P-011 FAQ). ArticleCategory 는 어드민 운영 routing 추가지만 공개 페이지 count 에는 포함 안 됨 (Article URL prefix 만 변경).
738:| 2026-05-18 | v0.5 | **Codex 비평 cycle 4 2 findings (0 blocking + 1 major + 1 minor) 전건 수용 patch — ARCH § 3.8 cascade**: (ECP-34 major) ARCH § 3.8 표 "9종 + Article 1샘플 = 10개 페이지" → "10종 + Article 1샘플 = 11개 페이지" — P-011 FAQ row 추가 + P-002 About / P-004 Doctor Profile EAT v0.x Publication/MediaAppearance inline marker + 어드민 화면 수 6→7. (ECP-35 minor) PAGE_TYPES P-013/P-014 상세 "M0 어드민 화면 수 6개 유지" → "P-013/P-014 자체 화면 없음 (§ 6 어드민 7개 = 기존 6 + Faq 신규)". 누계 cycle 1+2+3+4 = 35 findings 전건 수용. closeableAfterPatch=true 신호 (다음 cycle 5 acceptance 신호 검증). |
739:| 2026-05-18 | v0.4 | **Codex 비평 cycle 3 3 findings (0 blocking + 1 major + 2 minor) 전건 수용 patch — PAGE_TYPES 내부 SoT 통일 + DATA_MODEL 한 페이지 요약 cascade**: (ECP-31 major) PAGE_TYPES § 5 matrix + § 6 목록 + 합류 우선순위 — P-011 FAQ M0 ✅ 일관 (§ 5 matrix 행 patch · § 6 페이지 #10 추가 + 어드민 화면 수 6→7 · 우선순위 P-011 strike-through). (ECP-32 minor) DATA_MODEL § 0 한 페이지 요약 "23개 계약 (C-01~C-23)" → "25개 계약 (C-01~C-25)". (ECP-33 minor) DATA_MODEL § 관계 다이어그램 ComplianceRecord contentRef 대상 범위 "C-01~C-22" → "C-01~C-25" — C-24 Publication · C-25 MediaAppearance 포함. 누계 cycle 1+2+3 = 33 findings 전건 수용. closeableAfterPatch=true 신호 (다음 cycle 4 acceptance 신호 검증). |
740:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 8 findings (4 blocking + 4 major + 0 minor) 전건 수용 patch — docs cascade 실 patch 진입**: (ECP-23·24·25·26 blocking 4건 + ECP-27·28·29·30 major 4건) plan 본문 명시한 docs cascade 가 실 patch 안 됨 — plan acceptance commit 안 docs cascade 동시 적용 결정 (LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합). 본 patch 사이클에서 다음 실 적용: (1) DATA_MODEL § 1.1 인벤토리 23 → 25 contracts + C-24 Publication · C-25 MediaAppearance row 추가 + C-12 FAQ M0 ✅ + C-04 Article category required 명시. (2) DATA_MODEL § 4 C-10 contentType enum v0.6 — +Publication +MediaAppearance (17종). (3) DATA_MODEL § 4 C-22 ArticleCategory marker (DB 실 운영 합류 marker + EC-DEFER-10). (4) DATA_MODEL § 4 C-12 FAQ 풀명세 (question 10~200 · answer Markdown 50~2000 · v0.1 DB CHECK draft 만). (5) DATA_MODEL § 4 C-24 Publication 풀명세 (외부 학술 인용 · risk Low fixed). (6) DATA_MODEL § 4 C-25 MediaAppearance 풀명세 (모든 channel_type → VideoObject 단일화 v0.1). (7) PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 페이지 합계 11. (8) SCHEMA_MAPPING § 2 entity 카탈로그 — ScholarlyArticle 추가 · VideoObject MediaAppearance 매핑 추가 · FAQPage EAT v0.x M0 합류 + Answer.text helper marker. (9) CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 — Publication/MediaAppearance 면제 + FAQ Q/A 적용. (10) ARCH § 3.11 게이트 #1 — 11 페이지 + P-011 FAQ 합류. (11) M0_BUILD_EXPORT § 2.2 EAT 4 entity 변환 표. (12) PUBLIC_SITE_RENDER § 9.3 PSR-DEFER-11/15 해소 marker. (13) packages/migrations-runner/src/manifest.ts orderedMigrations 16 entry (C0009/10/11/12/13 + D0014). 코드 cascade (migrations 실 SQL · 어드민 폼 · Article detail SQL JOIN 등) 는 별도 EAT_CONTENT code v1.0 cycle. 누계 cycle 1+2 = 30 findings 전건 수용. |
741:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 22 findings (7 blocking + 10 major + 5 minor) 전건 수용 patch**: (ECP-01) C-24/25 Publication/MediaAppearance · C-12 FAQ 풀명세 합류 · C-22 ArticleCategory 실 운영 합류 — DATA_MODEL 인벤토리 25 contracts. (ECP-02) C-22 풀명세 컬럼 전체 DB 추가 (v0.1 UI minimal · EC-DEFER-10). (ECP-03) Article.category_id staged 4-step migration (ADD nullable + seed + backfill + SET NOT NULL). (ECP-04) manifest 16단계 + 각 dependsOn 명시. (ECP-05·14) MediaAppearance 모든 channel_type → VideoObject 단일화 · fragment `#video-{slug}` 단일 · BroadcastEvent/NewsArticle 분기는 EC-DEFER-11. (ECP-06) Doctor/About graph self-contained — Publication/Media 풀 entity 출력. cross-page allowlist 미사용. (ECP-07) C-10 contentType enum +Publication +MediaAppearance v0.6 cascade. FAQ 토큰 대문자 통일. (ECP-08) DOI regex DB·zod 동일 anchored. (ECP-09) default `general` ArticleCategory seed = seed.ts + C0013 마이그레이션 backfill. (ECP-10·11) v0.1 단계 4 entity 어드민 status='draft' 강제 — FAQ DB CHECK + zod enum subset. EC-DEFER-12 신설. (ECP-12) PAGE_TYPES P-011 M0 ✅ — EC-CASCADE-08 acceptance precondition 격상. (ECP-13) Publication/Media `@id` fragment-scoped (Doctor/About page URL + fragment). (ECP-15) About publication/media reference 는 MedicalClinic.subjectOf 단일 결정. (ECP-16) ArticleCategory taxonomy public 의도 명시 — status 게이트 없음 + EC-DEFER-10. (ECP-17) Article detail SQL JOIN article_category · category.slug 매칭 작업 명시. (ECP-18) `authors` DEFAULT 제거. (ECP-19) `renderMarkdownToPlainText` helper 신규 — JSON-LD Answer.text. (ECP-20) external link rel `nofollow noopener noreferrer` 통일. (ECP-21) FAQ 빈 페이지 200 + sitemap 포함 + lastmod fallback. (ECP-22) Slice 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ. |

 succeeded in 619ms:
4:> **작성일**: 2026-05-14 (v0.7 → v0.8 — § 6 M0 표 P-013 비고 SoT 정합 / 잔존 버전 표기 정리)
23:- M0 Slice: **10종 + Article 1샘플 = 11개 페이지** (P-001·P-002·P-003·P-004·P-005·P-006·P-011 FAQ·P-012·P-013·P-014 + P-010 1샘플) — EAT v0.x EC-CASCADE-08 patch (P-011 FAQ M0 합류).
24:- **P-014 LocationProfile(main)·P-013 LegalDocument는 어드민 화면 추가 없이 ClinicProfile 화면의 기관 정체성 + 본원 위치·연락·시간 입력 + Core 표준 템플릿으로 자동 생성** (SoT: 위치·시간·연락은 LocationProfile이 마스터). 단지점·다지점 통일 처리.
37:| P-002 | About | `/about` | `ClinicProfile` (전체) | ✅ |
39:| P-004 | Doctor Profile | `/doctors/{slug}` | `DoctorProfile` | ✅ |
46:| P-011 | FAQ | `/faq` | `FAQ[]` | ✅ (EAT v0.x EC-CASCADE-08) |
48:| P-013 | Legal / Policy | `/privacy`, `/terms` 등 | `LegalDocument` | ✅ (자동 생성) |
49:| P-014 | Location / Branch Detail | `/locations/{slug}` | `LocationProfile` | ✅ (main 자동) |
120:### P-002. About (병원 소개)
166:### P-004. Doctor Profile
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
374:**URL**: `/faq`
375:**주 데이터 계약**: `FAQ[]`
376:**Schema 요약**: `FAQPage` (mainEntity = Question[]) + BreadcrumbList.
408:5. 다지점인 경우 — 지점 목록 + 각 P-014 Location Detail 링크
420:### P-013. Legal / Policy — **M0 출시 게이트** ⭐ v0.5 격상
430:- **어드민 화면 추가 없음** (P-013 자체) — LegalDocument 는 ClinicProfile 입력 시 정책 변수만 추가 입력하거나, Git 에 수동 보강. M0 어드민 화면 수는 EAT v0.x cascade 로 7개 (Faq 신규 폼 합류 — § 6 참조).
452:### P-014. Location / Branch Detail
493:- **어드민 별도 LocationProfile 입력 화면 추가 불필요** (P-014 자체 화면 없음 — § 6 어드민 화면 수 7 = ClinicProfile 등 6 + Faq 신규).
496:**다지점 인스턴스의 처리**: `LocationProfile` N개. P-012 Contact는 통합 안내 + 각 P-014 페이지로 링크.
583:**Schema 요약**: `WebPage` 또는 `MedicalWebPage` + `FAQPage` 일부.
605:| P-002 | About | `/about` | ClinicProfile | Organization + MedicalClinic | Low | | ✅ |
607:| P-004 | Doctor Profile | `/doctors/{slug}` | DoctorProfile | Physician | Low | | ✅ |
614:| P-011 | FAQ | `/faq` | FAQ[] | FAQPage | 답변 가변 | | ✅ (EAT v0.x EC-CASCADE-08) |
616:| P-013 | Legal / Policy | `/privacy` 등 | LegalDocument | WebPage | Low | | ✅ (자동) |
617:| P-014 | Location / Branch Detail | `/locations/{slug}` | LocationProfile | MedicalClinic/LocalBusiness (지점) | Low | | ✅ (main) |
627:## 6. Vertical Slice (M0) 페이지 타입 — 11개 페이지 (EAT v0.x EC-CASCADE-08: P-011 FAQ M0 합류)
632:| 2 | P-002 About | ClinicProfile 노출 |
634:| 4 | P-004 Doctor Profile | 1개 이상 |
638:| 8 | P-014 Location Detail (main 자동) | 어드민 화면 추가 없이 자동 생성 (§ 3 P-014 규칙) |
639:| **9** | **P-013 Legal / Policy (자동 생성)** | Core 표준 템플릿 + ClinicProfile · LocationProfile(main) 변수 치환 자동 생성. 어드민 화면 추가 없음. **출시 게이트** (법무 검토 필수 — ComplianceRecord.legalCounsel/legalCounselAt required) |
640:| **10** | **P-011 FAQ (EAT v0.x EC-CASCADE-08 합류)** | FAQ[] · FAQPage JSON-LD · 어드민 폼 신규 (Faq) · 공개 페이지 `/<slug>/faq` |
643:**M0 어드민 화면 수: 7개 (EAT v0.x cascade)** — 대시보드 / ClinicProfile / DoctorProfile / TreatmentPage / Article / **Faq (EAT v0.x 신규)** / 미리보기·발행. P-012·P-014·P-013은 자동 생성.
647:2. ~~P-011 FAQ~~ ✅ M0 합류 (EAT v0.x)
667:| PT-04 | ~~다지점 페이지 타입~~ | 해소 — P-014 |
669:| PT-06 | ~~정책 페이지 표준화~~ | 해소 — P-013 |
672:| PT-09 | FAQ 답변 단위 위험도 UI | admin |
686:| 2026-05-13 | v0.2 | P-013 격상, P-105 신설, P-103 명칭 확장, 위험도 격상 조건표, M0 Contact 추가 |
688:| 2026-05-13 | v0.4 | DEEP_DIVE 통합 1단계 — 번호 체계 재정렬(P-014 Location 필수, P-106 Self-test), Contact Conversion Hub, High-risk 묶음, M0 8+1=9 |
689:| 2026-05-14 | v0.5 | **피드백 적용**: (1) **전체 본문 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, 단독 구현 명세화, (2) **P-014 LocationProfile main 자동 생성 규칙 명시** (어드민 화면 추가 없음), (3) **P-006 TreatmentPage 정보 슬롯에 treatmentComponents·recommendedFor·visitFlow·remoteCareAvailable·maintenancePlan·evidenceNotes 즉시 통합**, (4) **P-010 Article 정보 슬롯에 reviewedBy·contentSource·externalUrl 즉시 통합**, (5) **P-106 Self-test를 "Feature-backed optional page"로 표현 변경** (PT-12 해소), (6) PT-14 LocationProfile 자동 생성 규칙 어드민 구현 세부 신규, (7) **v0.5.1 추가 정정**: **P-013 Legal/Policy를 M0 출시 게이트로 격상** — Core 표준 템플릿 + ClinicProfile 변수 자동 치환 생성. M0 페이지 수 9 → **10**. 어드민 화면 수 6개 그대로 (자동 생성). 법무 검토 필수 (ComplianceRecord 추적) |
690:| 2026-05-14 | v0.6 | **피드백 정정**: P-013 자동 생성 규칙의 **변수 출처 SoT 정합화** — ClinicProfile 변수(`{{clinic.*}}`) + LocationProfile(main) 변수(`{{location.main.*}}`) 분리 명시. SoT 원칙 준수 |
691:| 2026-05-14 | v0.7 | **피드백 정정**: (1) § 0 요약 SoT 정합 표현 정정 — "ClinicProfile 입력" → "ClinicProfile 화면의 기관 정체성 + 본원 위치·연락·시간 입력", (2) **§ 3 P-014 자동 생성 규칙 정합 갱신** — `reservationChannels = primaryCtas 상속` 및 `featuredChannelId` (선택, v0.6 신규) 흐름 명시. admin § 3.8.1과 동기화 |
692:| 2026-05-14 | v0.8 | **피드백 정정**: § 6 M0 표 P-013 비고를 SoT 정합으로 정정 — "v0.5 격상 — ClinicProfile 변수 치환" → "ClinicProfile · LocationProfile(main) 변수 치환, 출시 게이트, 법무 검토 필수". 잔존 버전 표기(§ 6 제목 "(v0.5 갱신)" 등) 제거 |

codex
주요 패치 지점은 들어가 있지만, ARCH 내부에 같은 카운트의 잔존 문구가 하나 더 보입니다. 이게 cycle 4 항목의 완전성에 영향을 주는지 기준을 나눠 판단하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"어드민 화면 수|6개 유지|7개|Faq|FAQ|Categories|Publications|Media|ArticleCategory|Publication|MediaAppearance\" ..\\..\\docs\\admin\\ARCHITECTURE.md ..\\..\\docs\\core\\PAGE_TYPES.md ..\\..\\docs\\decisions\\EAT_CONTENT_PLAN.md" in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content ..\\..\\docs\\admin\\ARCHITECTURE.md | Select-Object -Skip 165 -First 90" in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content ..\\..\\docs\\core\\PAGE_TYPES.md | Select-Object -Skip 420 -First 80" in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 663ms:
..\..\docs\decisions\EAT_CONTENT_PLAN.md:3:> **상태**: **v0.5 (draft)** — Codex 자동 비평 cycle 1 (22) + cycle 2 (8) + cycle 3 (3) + cycle 4 (2) 누계 **35 findings 전건 수용 patch**. PUBLIC_SITE_RENDER code v1.0 acceptance 직후 진입하는 첫 신규 콘텐츠 타입 plan. Lovable 사이트 (다이트한의원 부평점) 의 콘텐츠 종류 매핑에서 우리 명세에 누락된 부분 (논문·미디어·FAQ 풀명세 + ArticleCategory 실 운영) 을 Core 계약으로 확정한다.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:7:> - **EAT_CONTENT code v1.0 cycle 안 cascade (별 사이클 분리 · 실 코드)**: migrations 6 (C0009/10/11/12/13 + D0014) · Drizzle schema v0.4 · zod schema · 어드민 폼 4종 + route 4종 + dashboard · JSON-LD entities/builders 확장 · P-011 FAQ public page · Doctor/About graph 확장 · Article detail SQL JOIN article_category · sitemap.xml 확장 · seed.ts default category · renderMarkdownToPlainText helper · vitest scenario 24~36.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:13:| Publication | **신규** | C-24 (현 인벤토리 빈 슬롯) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:14:| MediaAppearance | **신규** | C-25 (인벤토리 추가) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:15:| Faq | **C-12 풀명세 합류 + M0 합류** (기존 간략 명세 → 풀명세) | C-12 (기존) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:16:| ArticleCategory | **C-22 실 운영 합류 + M0 합류** (기존 풀명세 — v0.1 단계 flat 1-level minimal, parentCategory/pillar 등 optional 컬럼은 DB 추가하되 어드민 UI/공개 렌더는 v0.1 미사용) | C-22 (기존) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:18:모든 entity 는 schema.org JSON-LD 로 출력되어 P-004 Doctor Profile · P-002 About · P-011 FAQ 페이지에 합류한다.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:20:> **scope limit (EC-INTRO-01)** — 본 plan 은 다음만 다룬다: (1) C-24 Publication · C-25 MediaAppearance 신규 + C-12 Faq · C-22 ArticleCategory 합류. (2) DATA_MODEL C-10 `contentType` enum cascade (+Publication +MediaAppearance). (3) PSR-DEFER-11(부분: FAQ P-011) · PSR-DEFER-15 (Article category required) 해소. (4) PUBLIC_SITE_RENDER code v1.0 의 D0011 GRANT cascade (D0014). **본 plan 외**: Inquiry (1:1 상담 게시판 — PIPA 큰 결정), Reviews/Pricing High-risk commercial, Publication/MediaAppearance 별도 페이지 (모두 EC-DEFER).
..\..\docs\decisions\EAT_CONTENT_PLAN.md:24:- `docs/core/DATA_MODEL.md` v0.9 — § 1.1 인벤토리 (23 → 25 contracts) · § 4 C-12 / C-22 풀명세 + C-24 Publication · C-25 MediaAppearance 신규 (EC-CASCADE-01) · § 4 C-10 `contentType` enum 확장 (+ Publication +MediaAppearance) · § 4 C-04 Article `category` required 정합
..\..\docs\decisions\EAT_CONTENT_PLAN.md:25:- `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ — M0 미합류 → 본 plan 합류 (EC-CASCADE-08)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:26:- `docs/core/SCHEMA_MAPPING.md` § 1.2 `@id` 패턴 · § 2 entity 카탈로그 (+ ScholarlyArticle, VideoObject) · § 3 P-011 FAQ graph (EC-CASCADE-02)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:28:- `docs/core/CONTENT_STANDARDS.md` v1.3 § 7.1.1.x — Publication/MediaAppearance 외부 인용 면제 · FAQ Q/A 광고 표현 검수 적용 (EC-CASCADE-03)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:29:- `docs/compliance/RISK_LEVELS.md` v1.1 § 2 — FAQ 자동 추론 대상 (의료 질문 = Medium/High 후보), Publication/MediaAppearance Low fixed
..\..\docs\decisions\EAT_CONTENT_PLAN.md:30:- `docs/admin/ARCHITECTURE.md` § 3 — Vertical Slice 안 P-011 FAQ 페이지 합류 marker (EC-CASCADE-09)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:31:- `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v1.0 § 1.3 PSR-DEFER-11 (FAQ 부분 해소) + PSR-DEFER-15 (Article category 해소) (EC-CASCADE-07)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:48:- **E-A-T 시그널 강화** — Doctor Profile 의 학술 권위(Publication) 와 미디어 권위(MediaAppearance) 가 schema.org `ScholarlyArticle` / `VideoObject` 로 표현되어 검색 entity recognition 강화.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:49:- **AEO 직접 매핑** — FAQ 의 `FAQPage` JSON-LD 는 네이버 스마트블록 · AI Overview · 답변 봇에 직접 인용 가능.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:57:| C-24 Publication 신규 entity | 외부 학술 자료 인용 · authors[]·journal·publishedDate·doi/pubmedId·url·summary·authorDoctorId(optional FK to doctor_profile). DATA_MODEL § 1.1 인벤토리 25 contracts (cycle 1 ECP-01 정정) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:58:| C-25 MediaAppearance 신규 entity | 미디어 출연 · channelName·channelType·publishedDate·durationSeconds·url·thumbnailUrl·summary·authorDoctorId(optional). 모든 channel_type 을 schema.org `VideoObject` 로 단일화 v0.1 (cycle 1 ECP-05 정합) — BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 신설 (M1 cascade) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:59:| C-12 Faq 풀명세 합류 | DATA_MODEL § 5 간략 명세를 풀명세로 (EC-CASCADE-01) + M0 합류 |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:60:| C-22 ArticleCategory 실 운영 합류 (PSR-DEFER-15 해소) | DATA_MODEL § 4 기존 풀명세 (parentCategory·pillar·coverImageUrl·seoMeta·articleTypeDefault) — DB 컬럼은 모두 추가 (optional · v0.1 nullable). 어드민 UI/공개 렌더는 v0.1 minimal (slug·name·displayOrder만 노출 · 나머지 EC-DEFER-10 M1) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:62:| C-10 contentType enum cascade (cycle 1 ECP-07 정정) | 기존 enum 15종 + `Publication` + `MediaAppearance` = 17종. FAQ · ArticleCategory · LegalDocument · Feature 는 이미 enum 안 (토큰 그대로 사용 — `FAQ` 대문자) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:65:| 어드민 폼 4종 (CRUD) | PublicationForm · MediaAppearanceForm · FaqForm · ArticleCategoryForm. 패턴 = M0 3-entity 폼 + REVIEW_WORKFLOW status 9-state |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:66:| status zod enum subset (cycle 1 ECP-10·11 정정) | v0.1 단계 status zod = `z.enum(['draft'])` 만 — compliance-assistant 합류 (EC-DEFER-05) 전까지 모든 4 entity 어드민 폼에서 published 차단. **FAQ 도 published 차단** (위험도 자동 추론 합류 전 Medium/High 자동 발행 회피). LegalDocument 패턴 정합 |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:67:| 공개 페이지 P-011 FAQ 신설 (cycle 1 ECP-12 정정 — PAGE_TYPES M0 합류 EC-CASCADE-08 acceptance precondition 격상) | `/<slug>/faq` route — FaqList + FAQPage JSON-LD |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:68:| Doctor Profile (P-004) 확장 | Publications + MediaAppearances **graph 안 풀 entity 출력** (cycle 1 ECP-06·13 정정 — cross-page ref + allowlist 옵션 폐기). `@id` = fragment-scoped: `${doctorProfileUrl}#publication-{slug}` · `${doctorProfileUrl}#video-{slug}` |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:69:| About (P-002) 확장 | Doctor 외 author_doctor_id IS NULL 인 clinic-level Publications + MediaAppearances. graph 안 풀 entity. `@id` = `${aboutUrl}#publication-{slug}` · `${aboutUrl}#video-{slug}` |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:72:| JSON-LD generator 추가 | ScholarlyArticle · VideoObject (모든 channel_type) · FAQPage · Question · Answer + graph 안 풀 entity 출력 |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:73:| sitemap.xml 확장 | P-011 FAQ entry (changefreq monthly · priority 0.5 · lastmod `MAX(faq.updated_at)`) — published row 0건이어도 페이지 포함 (cycle 1 ECP-21 정정) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:74:| FAQ helper 2 종 (cycle 1 ECP-19 정정) | `renderMarkdownToHtml` (public HTML rendering · 기존) + 신규 `renderMarkdownToPlainText` (JSON-LD Answer text · strip + sanitize) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:75:| Markdown sanitize rel 통일 (cycle 1 ECP-20 정정) | 외부 링크 `nofollow noopener noreferrer` (PSR-20 정합 — Publication/Media external link 도 동일) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:77:| CONTENT_STANDARDS § 7.1.1.x 확장 | Publication/MediaAppearance 외부 인용 면제 · FAQ Q/A 광고 표현 검수 적용 |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:86:| Publication / MediaAppearance 별도 페이지 (P-Publications · P-MediaAppearances) | M1 Phase Alpha — 학술 인용·미디어 출연 페이지 자체 색인 가치 평가 후 | EC-DEFER-02 |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:87:| Publication PDF / DOI 자동 메타데이터 fetch (CrossRef API) | M1 Phase Alpha — 외부 API provider gate | EC-DEFER-03 |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:88:| MediaAppearance 동영상 embed (YouTube iframe 등) | M1 Phase Alpha — CSP 결정 | EC-DEFER-04 |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:89:| FAQ 자동 검수 (compliance-assistant + RiskRule + RiskInference) 완전 통합 | compliance-assistant Feature 본 구현 cascade | EC-DEFER-05 |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:90:| FAQ 다국어 (`inLanguage`) | M3 다국어 cascade | EC-DEFER-06 |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:91:| Publication / MediaAppearance 검수 워크플로우 (status='review-queued' 전이 + ComplianceRecord pre-publish) | LL-DEFER-01 patterns 동일 — compliance-assistant + ComplianceRecord 합류 | EC-DEFER-07 |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:93:| FAQ.metadata.featuredOnHome — Home 안 inline 표시 | M1 Phase Alpha | EC-DEFER-09 |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:94:| ArticleCategory 트리/계층 (parentCategory) · 메타 컬럼 (pillar · coverImageUrl · seoMeta · articleTypeDefault) 어드민 UI/공개 렌더 사용 | M1 Phase Alpha — v0.1 DB 컬럼은 추가하되 UI/렌더 미사용 | EC-DEFER-10 |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:95:| MediaAppearance channel_type 별 schema.org `@type` 분기 (broadcast → BroadcastEvent · press → NewsArticle) | M1 Phase Alpha — v0.1 모두 VideoObject 단일화 | EC-DEFER-11 |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:96:| 4 entity 어드민 published 발행 (status='published' 전이) | EC-DEFER-05 와 동일 시점 — compliance-assistant 합류 + Faq risk_level 자동 추론 후 | EC-DEFER-12 |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:100:### 2.1 C-22 ArticleCategory 실 DB 구현 (EC-SCHEMA-01) — cycle 1 ECP-02 정정
..\..\docs\decisions\EAT_CONTENT_PLAN.md:147:- (EC-SCHEMA-03 · cycle 1 ECP-09 정정) **default `general` ArticleCategory seed 위치 = `apps/web/src/seed.ts`** — instance 생성 시 자동 INSERT (`{slug: 'general', name: '일반', display_order: 0}`). 기존 instance 가 있을 때는 backfill 마이그레이션 (C0013 안에서 INSERT IF NOT EXISTS) 으로 보장. C0013 dependsOn = article_category + article.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:158:-- (2) instance 별 default `general` ArticleCategory row INSERT (기존 instance backfill — idempotent)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:167:-- (3) 기존 article row 의 category_id backfill (`general` ArticleCategory row 의 id)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:248:- (EC-SCHEMA-10) `risk_level='Low'` CHECK 고정 — Publication 외부 인용 entity, Low 외 등급 불필요. EC-DEFER-07 까지.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:397:-- FAQ: v0.1 단계 DB CHECK 가 status='draft' 만 허용. RLS published 만 SELECT → 자동 0 row → /faq 빈 페이지.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:408:- (EC-SCHEMA-17) ArticleCategory taxonomy public — instance_id only RLS. 분류 자체는 status 없음. 운영 중 추가한 카테고리는 즉시 public_reader 에 노출. **본 결정의 정당성**: 카테고리는 콘텐츠 카탈로그 (Article/Faq 의 분류) — 자체 콘텐츠 게시는 아님. URL `/<slug>/insights/<category>/...` 가 작동하려면 모든 카테고리가 lookup 가능해야. status 게이트는 분류 미사용 단계에서도 article URL routing 차단 → 운영 부담. EC-DEFER-10 phase 의 어드민 UI 합류 시 `active` flag 추가 cascade.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:416:| `ClinicProfile` · `DoctorProfile` · `TreatmentPage` · `MedicalConditionPage` · `Article` · `FAQ` · `ReviewPolicy` · `PricingPage` · `FacilitiesPage` · `NewsItem` · `ReservationPage` · `LocationProfile` · `ArticleCategory` · `LegalDocument` · `Feature` | + `Publication` + `MediaAppearance` |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:419:- (EC-CONTENT-04 · cycle 1 ECP-07 정정) audit emit `content-saved` payload 의 `contentType` 토큰 = SoT enum 그대로. FAQ 는 대문자 `FAQ`. Publication/MediaAppearance 는 PascalCase. ArticleCategory 도 PascalCase 기존.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:428:| ArticleCategory | `/admin/<slug>/categories` |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:429:| Publication | `/admin/<slug>/publications` |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:430:| MediaAppearance | `/admin/<slug>/media-appearances` |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:431:| Faq | `/admin/<slug>/faqs` |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:440:- mapDbErrorToResult 안 `faq_status_v01_limit` · `faq_published_at_null_v01` 매핑 — formError "FAQ 발행은 compliance-assistant + 위험도 자동 추론 합류 후 가능합니다 (EC-DEFER-05·12)".
..\..\docs\decisions\EAT_CONTENT_PLAN.md:441:- Publication / MediaAppearance 도 v0.1 단계 `status='draft'` 만 (DB CHECK 없이 form schema 만 — 향후 운영자가 직접 published 가능 marker EC-DEFER-12). 두 entity 의 외부 인용 자체는 risk Low fixed 이지만 v0.1 단계 통일 정책.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:446:- **Publication**: title (1~300) · authors (string[] min 1) · journal · publishedDate ISO · doi (DB 와 동일 anchored regex `^10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$`) · pubmedId (`^[0-9]{1,9}$`) · url (http(s)://) · summary (50~300) · authorDoctorId UUID (optional) · status `z.enum(['draft'])`
..\..\docs\decisions\EAT_CONTENT_PLAN.md:447:- **MediaAppearance**: title · channelName · channelType enum 4종 · publishedDate · durationSeconds (positive int · optional) · url · summary · authorDoctorId · status `z.enum(['draft'])`
..\..\docs\decisions\EAT_CONTENT_PLAN.md:448:- **Faq**: question (10~200) · answer (50~2000) · displayOrder int · categoryId UUID? · authorDoctorId? · relatedTreatmentId? · status `z.enum(['draft'])`
..\..\docs\decisions\EAT_CONTENT_PLAN.md:449:- **ArticleCategory**: slug regex · name (1~50 — C-22 SoT) · description (80~200 optional) · displayOrder int. v0.1 미노출 컬럼 (pillar·parent_category_id·cover_image_url·seo_meta·article_type_default) 는 form schema 에 미포함.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:454:- `saveX(instanceSlug, _prev, formData)` — withSkeletonTx · zod parse · INSERT/UPSERT · audit emit (eventType `content-saved` · payload `{contentType: 'Publication'|'MediaAppearance'|'FAQ'|'ArticleCategory', slug, mode, status, originalSlug}`).
..\..\docs\decisions\EAT_CONTENT_PLAN.md:460:`/admin/<slug>/page.tsx` 안 4 신규 entity card 추가 (count + new link). 기존 4 card (Clinic·Doctors·Treatments·Articles) + 4 신규 (Categories·Publications·Media·FAQs) = 총 8 card.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:464:### 5.1 P-011 FAQ 신규 페이지 (EC-RENDER-01) — PSR-DEFER-11 부분 해소
..\..\docs\decisions\EAT_CONTENT_PLAN.md:470:- JSON-LD: schema.org `FAQPage` + `Question`/`Answer` array (cycle 1 ECP-19 정정 — `renderMarkdownToPlainText` helper 사용). 0 row 면 `mainEntity: []` 빈 array 출력.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:477:- **Publications** — `author_doctor_id = doctor.id` AND `status='published'` row. 카드 list — title · journal · publishedDate · authors[] · external link.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:478:- **MediaAppearances** — `author_doctor_id = doctor.id` AND `status='published'` row. 카드 list — title · channelName · channelType badge · publishedDate · thumbnailUrl · duration (HH:MM 형식) · external link.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:481:- Doctor Profile 페이지 graph 안에 Publication 풀 entity (ScholarlyArticle) 와 MediaAppearance 풀 entity (VideoObject) 출력 — graph self-contained.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:483:  - Publication: `${siteBaseUrl}/doctors/${doctor.slug}#publication-${publication.slug}`
..\..\docs\decisions\EAT_CONTENT_PLAN.md:484:  - MediaAppearance: `${siteBaseUrl}/doctors/${doctor.slug}#video-${media.slug}`
..\..\docs\decisions\EAT_CONTENT_PLAN.md:491:- **All Publications** — published row (author_doctor_id 무관). 모두 표시. 카드 list 동일.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:492:- **All MediaAppearances** — published row (author_doctor_id 무관). 모두 표시.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:497:  - Publication: `${siteBaseUrl}/about#publication-${publication.slug}`
..\..\docs\decisions\EAT_CONTENT_PLAN.md:498:  - MediaAppearance: `${siteBaseUrl}/about#video-${media.slug}`
..\..\docs\decisions\EAT_CONTENT_PLAN.md:521:- FAQ rendering 분기:
..\..\docs\decisions\EAT_CONTENT_PLAN.md:523:  - JSON-LD `FAQPage.mainEntity.Question.acceptedAnswer.text`: `renderMarkdownToPlainText(answer)`
..\..\docs\decisions\EAT_CONTENT_PLAN.md:529:- Publication / MediaAppearance 별도 페이지 없음 — sitemap 미추가 (EC-DEFER-02).
..\..\docs\decisions\EAT_CONTENT_PLAN.md:534:Publication / MediaAppearance 카드의 external `<a>` — `rel="nofollow noopener noreferrer"` + `target="_blank"` 통일 (PSR-20 정합).
..\..\docs\decisions\EAT_CONTENT_PLAN.md:538:### 6.1 ScholarlyArticle entity (Publication)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:559:### 6.2 VideoObject entity (MediaAppearance — 4 channel_type 모두) — cycle 1 ECP-05·14 정정 (단일화)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:577:### 6.3 FAQPage (P-011) — cycle 1 ECP-19 정합
..\..\docs\decisions\EAT_CONTENT_PLAN.md:581:  "@type": "FAQPage",
..\..\docs\decisions\EAT_CONTENT_PLAN.md:604:| P-011 FAQ | `[풀] Organization` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] FAQPage` (with Question[] inline `mainEntity`) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:607:- (EC-SEO-02 · cycle 1 ECP-06 정정) 모든 page 의 graph 가 self-contained — Publication/Media 가 표시되는 페이지에 풀 entity 출력. cross-page allowlist 사용 안 함.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:617:| `Publication` | **면제** (외부 학술 인용 · clinic 자체 표현 아님) | **면제** | **면제** (DB CHECK Low fixed) | **면제** |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:618:| `MediaAppearance` | **면제** | **면제** | **면제** (DB CHECK Low fixed) | **면제** |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:619:| `FAQ` Q | **적용** | **적용** (의료법 광고 표현 검수) | **적용** (compliance-assistant 합류 시 · EC-DEFER-05) | **적용** (Medium/High 자동 추론) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:620:| `FAQ` A | **적용** | **적용** | **적용** | **적용** |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:621:| `ArticleCategory` | (콘텐츠 자체 없음 · 분류 메타) | — | — | — |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:624:- (EC-CONTENT-01) Publication/MediaAppearance 면제 — 외부 인용. 클리닉 자체 권고 아님.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:625:- (EC-CONTENT-02) FAQ 적용 — 클리닉 자체 답변 → 의료법 광고 표현 검수. RiskInference Medium/High 자동 (RISK_LEVELS § 2 정합).
..\..\docs\decisions\EAT_CONTENT_PLAN.md:626:- (EC-CONTENT-03) ArticleCategory taxonomy — 룰 없음.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:636:- `apps/web/src/seed.ts` patch — instance 생성 시 default `general` ArticleCategory row 자동 INSERT (EC-SCHEMA-03)
..\..\docs\decisions\EAT_CONTENT_PLAN.md:648:| 26 | FAQ — v0.1 단계 published 차단 검증 | `INSERT ... status='published'` 시도 → CHECK `faq_status_v01_limit` 위반 (cycle 1 ECP-10·11 정합) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:649:| 27 | FAQPage graph 안 `mainEntity` 0건 (v0.1 published 차단 → 0 row) | self-rule-checker PASS · 빈 array OK |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:650:| 28 | article.category_id = `general` ArticleCategory.id · URL `/<slug>/insights/general/<article-slug>` → 200 (DB join) | PSR-DEFER-15 해소 (cycle 1 ECP-17 정합) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:652:| 30 | Publication risk_level='Medium' 시도 → DB CHECK 위반 | `publication_risk_level_low_only` |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:656:| 34 | FAQ Markdown answer 안 `<script>` payload → JSON-LD `Answer.text` 평문 strip | renderMarkdownToPlainText 정합 |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:658:| 36 | ArticleCategory 운영 중 신규 INSERT → public_reader 즉시 SELECT (status 게이트 없음) | EC-SCHEMA-17 결정 정합 |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:672:| 9 | 4 admin form (Publication·MediaAppearance·Faq·ArticleCategory) | apps/web/src/components/forms/{Publication,MediaAppearance,Faq,ArticleCategory}Form.tsx |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:675:| 12 | DB → projection 확장 | apps/web/src/lib/db-projection.ts (normalizePublication · normalizeMediaAppearance · normalizeFaq · normalizeArticleCategory) |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:679:| 16 | P-011 FAQ public page (cycle 1 ECP-21 — 빈 페이지도 200) | apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx + metadata + JsonLdScript |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:680:| 17 | Doctor Profile (P-004) 확장 — Publications + MediaAppearances inline + graph self-contained | doctors/[slug]/page.tsx |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:683:| 20 | sitemap.xml 확장 — P-011 FAQ entry + article URL 실 category slug | (site)/[instanceSlug]/sitemap.xml/route.ts |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:689:| 26 | docs cascade — DATA_MODEL § 1.1 인벤토리 25 contracts · § 4 C-10 enum +2 · C-12 풀명세 · C-22 풀명세 컬럼 정합 · C-24 Publication · C-25 MediaAppearance 풀명세 (EC-CASCADE-01) · SCHEMA_MAPPING § 2 entity 카탈로그 · § 3 P-011 (EC-CASCADE-02) · CONTENT_STANDARDS § 7.1.1.x (EC-CASCADE-03) · PSR-DEFER-11/15 해소 marker (EC-CASCADE-07) · M0_BUILD_EXPORT § 2.1 (EC-CASCADE-04) · PAGE_TYPES § 1.1 P-011 M0 ✅ + § 3 본문 (EC-CASCADE-08 acceptance precondition — cycle 1 ECP-12 격상) · ARCH § 3 Vertical Slice 정합 (EC-CASCADE-09 — 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ) | doc patches |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:698:- `EC-DEFER-02`: Publication / MediaAppearance 별도 페이지.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:701:- `EC-DEFER-06`: FAQ 다국어.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:702:- `EC-DEFER-09`: FAQ.metadata.featuredOnHome + related Treatment/Condition UI.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:703:- `EC-DEFER-10`: ArticleCategory 풀명세 column (parentCategory/pillar/coverImageUrl/seoMeta/articleTypeDefault) 어드민 UI/공개 렌더.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:704:- `EC-DEFER-11` (cycle 1 ECP-05 정정): MediaAppearance channel_type 별 schema.org `@type` 분기 (broadcast → BroadcastEvent · press → NewsArticle).
..\..\docs\decisions\EAT_CONTENT_PLAN.md:707:- `EC-DEFER-05`: FAQ 자동 검수 (compliance-assistant + RiskRule + RiskInference).
..\..\docs\decisions\EAT_CONTENT_PLAN.md:714:  - § 1.1 인벤토리 25 contracts (+ C-24 Publication, C-25 MediaAppearance) · C-12 FAQ M0 ✅ · C-22 ArticleCategory M0 ✅ · C-24/25 row 추가.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:715:  - § 4 C-10 `contentType` enum +2 (Publication, MediaAppearance) v0.6.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:716:  - § 4 C-12 FAQ 간략 명세 → 풀명세 (question 10~200, answer 50~2000 Markdown · category Ref<C-22> optional · relatedTreatment optional · authorDoctor optional · status content_publication_status · riskLevel C-05 default Low).
..\..\docs\decisions\EAT_CONTENT_PLAN.md:717:  - § 4 C-22 ArticleCategory — v0.1 DB 컬럼 정합 marker (parentCategory · pillar · coverImageUrl · seoMeta · articleTypeDefault 모두 optional · v0.1 UI 미사용 EC-DEFER-10).
..\..\docs\decisions\EAT_CONTENT_PLAN.md:718:  - § 4 C-24 Publication 풀명세 신규.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:719:  - § 4 C-25 MediaAppearance 풀명세 신규.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:723:  - § 2 entity 카탈로그 — ScholarlyArticle · VideoObject (모든 channel_type) · FAQPage · Question · Answer 추가.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:724:  - § 3 P-011 FAQ graph + P-002/P-004 graph 확장 (ScholarlyArticle/VideoObject 풀 entity).
..\..\docs\decisions\EAT_CONTENT_PLAN.md:725:- `EC-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7.1.1.x ContentType 예외 표 — Publication/MediaAppearance 면제 · FAQ Q/A 적용.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:729:- `EC-CASCADE-07`: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` — PSR-DEFER-11 부분 (FAQ) + PSR-DEFER-15 (Article category) 해소 marker.
..\..\docs\decisions\EAT_CONTENT_PLAN.md:730:- `EC-CASCADE-08` (cycle 1 ECP-12 정정 — acceptance precondition 격상): `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ M0 ✅ + § 3 P-011 본문 작성 (질문 위계 + AEO 친화).
..\..\docs\decisions\EAT_CONTENT_PLAN.md:731:- `EC-CASCADE-09` (cycle 1 ECP-22 정정): `docs/admin/ARCHITECTURE.md` § 3 Slice 페이지 합계 = **11페이지** (기존 9 + P-010 1샘플 + P-011 FAQ). ArticleCategory 는 어드민 운영 routing 추가지만 공개 페이지 count 에는 포함 안 됨 (Article URL prefix 만 변경).
..\..\docs\decisions\EAT_CONTENT_PLAN.md:738:| 2026-05-18 | v0.5 | **Codex 비평 cycle 4 2 findings (0 blocking + 1 major + 1 minor) 전건 수용 patch — ARCH § 3.8 cascade**: (ECP-34 major) ARCH § 3.8 표 "9종 + Article 1샘플 = 10개 페이지" → "10종 + Article 1샘플 = 11개 페이지" — P-011 FAQ row 추가 + P-002 About / P-004 Doctor Profile EAT v0.x Publication/MediaAppearance inline marker + 어드민 화면 수 6→7. (ECP-35 minor) PAGE_TYPES P-013/P-014 상세 "M0 어드민 화면 수 6개 유지" → "P-013/P-014 자체 화면 없음 (§ 6 어드민 7개 = 기존 6 + Faq 신규)". 누계 cycle 1+2+3+4 = 35 findings 전건 수용. closeableAfterPatch=true 신호 (다음 cycle 5 acceptance 신호 검증). |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:739:| 2026-05-18 | v0.4 | **Codex 비평 cycle 3 3 findings (0 blocking + 1 major + 2 minor) 전건 수용 patch — PAGE_TYPES 내부 SoT 통일 + DATA_MODEL 한 페이지 요약 cascade**: (ECP-31 major) PAGE_TYPES § 5 matrix + § 6 목록 + 합류 우선순위 — P-011 FAQ M0 ✅ 일관 (§ 5 matrix 행 patch · § 6 페이지 #10 추가 + 어드민 화면 수 6→7 · 우선순위 P-011 strike-through). (ECP-32 minor) DATA_MODEL § 0 한 페이지 요약 "23개 계약 (C-01~C-23)" → "25개 계약 (C-01~C-25)". (ECP-33 minor) DATA_MODEL § 관계 다이어그램 ComplianceRecord contentRef 대상 범위 "C-01~C-22" → "C-01~C-25" — C-24 Publication · C-25 MediaAppearance 포함. 누계 cycle 1+2+3 = 33 findings 전건 수용. closeableAfterPatch=true 신호 (다음 cycle 4 acceptance 신호 검증). |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:740:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 8 findings (4 blocking + 4 major + 0 minor) 전건 수용 patch — docs cascade 실 patch 진입**: (ECP-23·24·25·26 blocking 4건 + ECP-27·28·29·30 major 4건) plan 본문 명시한 docs cascade 가 실 patch 안 됨 — plan acceptance commit 안 docs cascade 동시 적용 결정 (LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합). 본 patch 사이클에서 다음 실 적용: (1) DATA_MODEL § 1.1 인벤토리 23 → 25 contracts + C-24 Publication · C-25 MediaAppearance row 추가 + C-12 FAQ M0 ✅ + C-04 Article category required 명시. (2) DATA_MODEL § 4 C-10 contentType enum v0.6 — +Publication +MediaAppearance (17종). (3) DATA_MODEL § 4 C-22 ArticleCategory marker (DB 실 운영 합류 marker + EC-DEFER-10). (4) DATA_MODEL § 4 C-12 FAQ 풀명세 (question 10~200 · answer Markdown 50~2000 · v0.1 DB CHECK draft 만). (5) DATA_MODEL § 4 C-24 Publication 풀명세 (외부 학술 인용 · risk Low fixed). (6) DATA_MODEL § 4 C-25 MediaAppearance 풀명세 (모든 channel_type → VideoObject 단일화 v0.1). (7) PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 페이지 합계 11. (8) SCHEMA_MAPPING § 2 entity 카탈로그 — ScholarlyArticle 추가 · VideoObject MediaAppearance 매핑 추가 · FAQPage EAT v0.x M0 합류 + Answer.text helper marker. (9) CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 — Publication/MediaAppearance 면제 + FAQ Q/A 적용. (10) ARCH § 3.11 게이트 #1 — 11 페이지 + P-011 FAQ 합류. (11) M0_BUILD_EXPORT § 2.2 EAT 4 entity 변환 표. (12) PUBLIC_SITE_RENDER § 9.3 PSR-DEFER-11/15 해소 marker. (13) packages/migrations-runner/src/manifest.ts orderedMigrations 16 entry (C0009/10/11/12/13 + D0014). 코드 cascade (migrations 실 SQL · 어드민 폼 · Article detail SQL JOIN 등) 는 별도 EAT_CONTENT code v1.0 cycle. 누계 cycle 1+2 = 30 findings 전건 수용. |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:741:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 22 findings (7 blocking + 10 major + 5 minor) 전건 수용 patch**: (ECP-01) C-24/25 Publication/MediaAppearance · C-12 FAQ 풀명세 합류 · C-22 ArticleCategory 실 운영 합류 — DATA_MODEL 인벤토리 25 contracts. (ECP-02) C-22 풀명세 컬럼 전체 DB 추가 (v0.1 UI minimal · EC-DEFER-10). (ECP-03) Article.category_id staged 4-step migration (ADD nullable + seed + backfill + SET NOT NULL). (ECP-04) manifest 16단계 + 각 dependsOn 명시. (ECP-05·14) MediaAppearance 모든 channel_type → VideoObject 단일화 · fragment `#video-{slug}` 단일 · BroadcastEvent/NewsArticle 분기는 EC-DEFER-11. (ECP-06) Doctor/About graph self-contained — Publication/Media 풀 entity 출력. cross-page allowlist 미사용. (ECP-07) C-10 contentType enum +Publication +MediaAppearance v0.6 cascade. FAQ 토큰 대문자 통일. (ECP-08) DOI regex DB·zod 동일 anchored. (ECP-09) default `general` ArticleCategory seed = seed.ts + C0013 마이그레이션 backfill. (ECP-10·11) v0.1 단계 4 entity 어드민 status='draft' 강제 — FAQ DB CHECK + zod enum subset. EC-DEFER-12 신설. (ECP-12) PAGE_TYPES P-011 M0 ✅ — EC-CASCADE-08 acceptance precondition 격상. (ECP-13) Publication/Media `@id` fragment-scoped (Doctor/About page URL + fragment). (ECP-15) About publication/media reference 는 MedicalClinic.subjectOf 단일 결정. (ECP-16) ArticleCategory taxonomy public 의도 명시 — status 게이트 없음 + EC-DEFER-10. (ECP-17) Article detail SQL JOIN article_category · category.slug 매칭 작업 명시. (ECP-18) `authors` DEFAULT 제거. (ECP-19) `renderMarkdownToPlainText` helper 신규 — JSON-LD Answer.text. (ECP-20) external link rel `nofollow noopener noreferrer` 통일. (ECP-21) FAQ 빈 페이지 200 + sitemap 포함 + lastmod fallback. (ECP-22) Slice 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ. |
..\..\docs\core\PAGE_TYPES.md:23:- M0 Slice: **10종 + Article 1샘플 = 11개 페이지** (P-001·P-002·P-003·P-004·P-005·P-006·P-011 FAQ·P-012·P-013·P-014 + P-010 1샘플) — EAT v0.x EC-CASCADE-08 patch (P-011 FAQ M0 합류).
..\..\docs\core\PAGE_TYPES.md:46:| P-011 | FAQ | `/faq` | `FAQ[]` | ✅ (EAT v0.x EC-CASCADE-08) |
..\..\docs\core\PAGE_TYPES.md:215:**Schema 요약**: `MedicalProcedure` + BreadcrumbList + (FAQ 블록 시) `FAQPage`.
..\..\docs\core\PAGE_TYPES.md:241:**선택 블록**: 프로그램 변형 / 소요 시간 / 시술 후 관리 / 유지 계획 / 근거 노트 / FAQ / 관련 의료진 / 관련 질환
..\..\docs\core\PAGE_TYPES.md:259:| FAQ | 답변별 가변 | 효과·결과 답변 → High |
..\..\docs\core\PAGE_TYPES.md:266:**내부 링크 권장**: → 담당 의료진 / 관련 질환 / 관련 시술 / FAQ
..\..\docs\core\PAGE_TYPES.md:289:**Schema 요약**: `MedicalCondition` (signOrSymptom, riskFactor, possibleTreatment) + BreadcrumbList + (해당 시) FAQPage.
..\..\docs\core\PAGE_TYPES.md:304:**선택 블록**: 진단 / FAQ / 관련 시술 / 관련 의료진
..\..\docs\core\PAGE_TYPES.md:308:**내부 링크 권장**: → 관련 Treatments / 관련 Articles / FAQ
..\..\docs\core\PAGE_TYPES.md:333:**Schema 요약**: `Article` (headline, datePublished, dateModified, author=Physician/Person, publisher, mainEntityOfPage, articleSection, wordCount, inLanguage) + BreadcrumbList + (Q&A 블록 시) FAQPage + (video 시) VideoObject.
..\..\docs\core\PAGE_TYPES.md:339:4. 임베디드 미디어 (`embeddedMedia[]`) — YouTube·외부 인용
..\..\docs\core\PAGE_TYPES.md:351:**선택 블록**: 임베디드 미디어 / 검수 정보 / 관련 글 / 관련 시술 / FAQ / CTA
..\..\docs\core\PAGE_TYPES.md:371:### P-011. FAQ
..\..\docs\core\PAGE_TYPES.md:375:**주 데이터 계약**: `FAQ[]`
..\..\docs\core\PAGE_TYPES.md:376:**Schema 요약**: `FAQPage` (mainEntity = Question[]) + BreadcrumbList.
..\..\docs\core\PAGE_TYPES.md:430:- **어드민 화면 추가 없음** (P-013 자체) — LegalDocument 는 ClinicProfile 입력 시 정책 변수만 추가 입력하거나, Git 에 수동 보강. M0 어드민 화면 수는 EAT v0.x cascade 로 7개 (Faq 신규 폼 합류 — § 6 참조).
..\..\docs\core\PAGE_TYPES.md:493:- **어드민 별도 LocationProfile 입력 화면 추가 불필요** (P-014 자체 화면 없음 — § 6 어드민 화면 수 7 = ClinicProfile 등 6 + Faq 신규).
..\..\docs\core\PAGE_TYPES.md:583:**Schema 요약**: `WebPage` 또는 `MedicalWebPage` + `FAQPage` 일부.
..\..\docs\core\PAGE_TYPES.md:614:| P-011 | FAQ | `/faq` | FAQ[] | FAQPage | 답변 가변 | | ✅ (EAT v0.x EC-CASCADE-08) |
..\..\docs\core\PAGE_TYPES.md:627:## 6. Vertical Slice (M0) 페이지 타입 — 11개 페이지 (EAT v0.x EC-CASCADE-08: P-011 FAQ M0 합류)
..\..\docs\core\PAGE_TYPES.md:640:| **10** | **P-011 FAQ (EAT v0.x EC-CASCADE-08 합류)** | FAQ[] · FAQPage JSON-LD · 어드민 폼 신규 (Faq) · 공개 페이지 `/<slug>/faq` |
..\..\docs\core\PAGE_TYPES.md:643:**M0 어드민 화면 수: 7개 (EAT v0.x cascade)** — 대시보드 / ClinicProfile / DoctorProfile / TreatmentPage / Article / **Faq (EAT v0.x 신규)** / 미리보기·발행. P-012·P-014·P-013은 자동 생성.
..\..\docs\core\PAGE_TYPES.md:647:2. ~~P-011 FAQ~~ ✅ M0 합류 (EAT v0.x)
..\..\docs\core\PAGE_TYPES.md:672:| PT-09 | FAQ 답변 단위 위험도 UI | admin |
..\..\docs\core\PAGE_TYPES.md:689:| 2026-05-14 | v0.5 | **피드백 적용**: (1) **전체 본문 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, 단독 구현 명세화, (2) **P-014 LocationProfile main 자동 생성 규칙 명시** (어드민 화면 추가 없음), (3) **P-006 TreatmentPage 정보 슬롯에 treatmentComponents·recommendedFor·visitFlow·remoteCareAvailable·maintenancePlan·evidenceNotes 즉시 통합**, (4) **P-010 Article 정보 슬롯에 reviewedBy·contentSource·externalUrl 즉시 통합**, (5) **P-106 Self-test를 "Feature-backed optional page"로 표현 변경** (PT-12 해소), (6) PT-14 LocationProfile 자동 생성 규칙 어드민 구현 세부 신규, (7) **v0.5.1 추가 정정**: **P-013 Legal/Policy를 M0 출시 게이트로 격상** — Core 표준 템플릿 + ClinicProfile 변수 자동 치환 생성. M0 페이지 수 9 → **10**. 어드민 화면 수 6개 그대로 (자동 생성). 법무 검토 필수 (ComplianceRecord 추적) |
..\..\docs\admin\ARCHITECTURE.md:178:| 2 | P-002 About | ClinicProfile 노출 + EAT v0.x Publication/MediaAppearance inline (MedicalClinic.subjectOf) |
..\..\docs\admin\ARCHITECTURE.md:180:| 4 | P-004 Doctor Profile | 1개 이상 + EAT v0.x Publication/MediaAppearance inline (Physician.subjectOf) |
..\..\docs\admin\ARCHITECTURE.md:186:| **10** | **P-011 FAQ (EAT v0.x EC-CASCADE-08 합류)** | FAQPage JSON-LD · 어드민 Faq 폼 신규 · `/<slug>/faq` 공개 페이지 |
..\..\docs\admin\ARCHITECTURE.md:189:→ Slice **어드민 화면 수 7개 (EAT v0.x cascade)** — 기존 6개 + Faq 신규. P-012·P-014·P-013은 자동 생성. EAT v0.x 4 신규 entity (Publication·MediaAppearance·Faq·ArticleCategory) 어드민 폼은 코드 cycle에서 별도 합류.
..\..\docs\admin\ARCHITECTURE.md:249:**어드민 폼 처리**: ClinicProfile 폼에 "정책 변수" 보조 섹션 추가 (개인정보 보호 책임자명·연락처·정책 효력 발생일 등 입력). 별도 화면 추가 아닌 보조 섹션이므로 어드민 화면 수 6개 유지.
..\..\docs\admin\ARCHITECTURE.md:262:- BreadcrumbList, FAQPage (필요 시)
..\..\docs\admin\ARCHITECTURE.md:274:| 1 | 사이트 측 페이지 타입 10종 + Article 1샘플 빌드 (총 11 페이지) | Home·About·Doctors List·Doctor Profile·Treatments List·Treatment Detail·**Contact**·**Location Detail (main 자동)**·**Legal/Policy (자동, 법무 검토)**·**FAQ (EAT v0.x EC-CASCADE-08)**·Article Detail 1개 — 정적 빌드 가능. 상세는 PAGE_TYPES.md § 6 |
..\..\docs\admin\ARCHITECTURE.md:368:- `MedicalConditionPage`·`FAQ` 폼 — 해당 페이지 타입 합류 시 (Phase Alpha 우선)
..\..\docs\admin\ARCHITECTURE.md:514:| 2026-05-13 | v0.3 | **PAGE_TYPES.md v0.2 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 5종 → **7종 + Article 1샘플 = 8개 페이지** (Contact 추가), (2) § 3.11 완료 게이트 #1 7종 빌드로 수정, (3) 단일 진실 원본은 `core/PAGE_TYPES.md`로 명시 (중복 회피). 어드민 화면 수 6개는 유지(Contact는 ClinicProfile 자동 생성) | Glitzy (Claude 페어링) |
..\..\docs\admin\ARCHITECTURE.md:515:| 2026-05-14 | v0.4 | **PAGE_TYPES v0.5 + DATA_MODEL v0.4 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 7종+1샘플 → **8종+1샘플=9개 페이지** (P-014 Location Detail 추가), (2) **§ 3.8.1 LocationProfile(main) 자동 생성 규칙 명시** — 어드민 화면 추가 없이 ClinicProfile 입력으로 자동 생성, (3) § 3.11 완료 게이트 #1 8종 빌드로 수정. 어드민 화면 수 6개는 그대로 유지 | Glitzy (Claude 페어링) |

 succeeded in 707ms:
### 3.7 Slice 인증·권한

- 단일 Glitzy 운영자 계정 (단순 인증)
- 외부 사용자 초대·RBAC는 Beta

### 3.8 Slice 사이트 측 페이지 타입 (Data Plane이 빌드) — 10종 + Article 1샘플 = 11개 페이지 (EAT v0.x EC-CASCADE-08·09)

> 상세는 `core/PAGE_TYPES.md` § 6 (단일 진실 원본).

| 순서 | 페이지 타입 | 비고 |
|---|---|---|
| 1 | P-001 Home | 메인. Articles List 미합류 상태에서 Article 샘플로 **직접 링크**해 고립 회피 |
| 2 | P-002 About | ClinicProfile 노출 + EAT v0.x Publication/MediaAppearance inline (MedicalClinic.subjectOf) |
| 3 | P-003 Doctors List | DoctorProfile 1명 이상 |
| 4 | P-004 Doctor Profile | 1개 이상 + EAT v0.x Publication/MediaAppearance inline (Physician.subjectOf) |
| 5 | P-005 Treatments List | TreatmentPage 1개 이상 |
| 6 | P-006 Treatment Detail | 1개 이상 |
| 7 | **P-012 Contact (Conversion Hub)** | ClinicProfile + LocationProfile[] 참조. 다중 CTA 채널 노출 |
| 8 | **P-014 Location Detail (main 자동)** | LocationProfile(slug=`main`) 1개 자동 생성. 어드민 화면 추가 없음 (§ 3.8.1 규칙) |
| **9** | **P-013 Legal / Policy (자동 생성)** | **출시 게이트** — Core 표준 템플릿 + ClinicProfile 변수 치환. 법무 검토 필수 (§ 3.8.2 규칙) |
| **10** | **P-011 FAQ (EAT v0.x EC-CASCADE-08 합류)** | FAQPage JSON-LD · 어드민 Faq 폼 신규 · `/<slug>/faq` 공개 페이지 |
| (샘플) | P-010 Article Detail | 1개 샘플. Home에서 직접 링크 |

→ Slice **어드민 화면 수 7개 (EAT v0.x cascade)** — 기존 6개 + Faq 신규. P-012·P-014·P-013은 자동 생성. EAT v0.x 4 신규 entity (Publication·MediaAppearance·Faq·ArticleCategory) 어드민 폼은 코드 cycle에서 별도 합류.

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

 succeeded in 659ms:

**목적**: 개인정보처리방침·이용약관·비급여 진료 등 정책 페이지. **법적·규제 의무**. 폼·예약·분석 스크립트 운영 시 사실상 필수 (개인정보보호법·정통망법). M0 출시 게이트.
**URL**: `/privacy`, `/terms`, `/non-covered` 등
**주 데이터 계약**: `LegalDocument`
**Schema 요약**: 일반적으로 `WebPage`. 검색 노출 우선순위 낮음.

**M0 자동 생성 규칙** (v0.5 신규, v0.6 SoT 정정):
- Core가 **표준 템플릿** 보유: 개인정보처리방침·이용약관·비급여 진료 안내·환불·민원 처리 등 1차 템플릿.
- 빌드 시 `LegalDocument` 인스턴스 데이터 + **ClinicProfile 변수** (`{{clinic.name}}`·`{{clinic.legalEntityName}}`·`{{clinic.businessRegistrationNumber}}`·`{{clinic.founder}}`) + **LocationProfile(main) 변수** (`{{location.main.address}}`·`{{location.main.telephone}}`·`{{location.main.email}}`) — 출처 SoT 준수.
- **어드민 화면 추가 없음** (P-013 자체) — LegalDocument 는 ClinicProfile 입력 시 정책 변수만 추가 입력하거나, Git 에 수동 보강. M0 어드민 화면 수는 EAT v0.x cascade 로 7개 (Faq 신규 폼 합류 — § 6 참조).
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
- **어드민 별도 LocationProfile 입력 화면 추가 불필요** (P-014 자체 화면 없음 — § 6 어드민 화면 수 7 = ClinicProfile 등 6 + Faq 신규).
- 다지점 확장 시 별도 LocationProfile 추가 화면 도입 (Phase Beta+).

**다지점 인스턴스의 처리**: `LocationProfile` N개. P-012 Contact는 통합 안내 + 각 P-014 페이지로 링크.

---

## 4. 선택 페이지 타입 상세

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$PWD.Path' in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 375ms:
C:\Users\assag\solution\website-exposure\apps\web

codex
# EAT_CONTENT_PLAN v0.5 — cycle 5 review

## summary
- 본 cycle 지적 수: blocking=0 major=1 minor=0 (총 1)
- closeableAfterPatch: false
- 수렴: cycle1=22 → cycle2=8 → cycle3=3 → cycle4=2 → cycle5=1

## cycle 4 patch 검증
- ECP-34: FAIL — ARCH § 3.8 표/P-011/P-002/P-004/7개 문구는 반영됐지만, [ARCHITECTURE.md](C:/Users/assag/solution/website-exposure/docs/admin/ARCHITECTURE.md:249)에 “어드민 화면 수 6개 유지” 잔재가 남음.
- ECP-35: PASS — PAGE_TYPES P-013/P-014는 자체 화면 없음 + § 6 어드민 7개 reference로 정정됨.

## new findings
- ECP-36 major — ARCH § 3.8.2 LegalDocument 자동 생성 규칙의 “어드민 화면 수 6개 유지”가 현재 SoT인 7개와 충돌. `6개 유지` → `P-013 자체 화면 없음. M0 어드민 화면 수는 EAT v0.x cascade로 7개`로 정정 필요.

## acceptance 판정
- closeableAfterPatch=false
- plan v1.0 acceptance commit 보류 권고
- 누계 35 findings 중 ECP-34가 부분 미해소 상태, ECP-36 patch 후 재검증 필요.
tokens used
46,627
# EAT_CONTENT_PLAN v0.5 — cycle 5 review

## summary
- 본 cycle 지적 수: blocking=0 major=1 minor=0 (총 1)
- closeableAfterPatch: false
- 수렴: cycle1=22 → cycle2=8 → cycle3=3 → cycle4=2 → cycle5=1

## cycle 4 patch 검증
- ECP-34: FAIL — ARCH § 3.8 표/P-011/P-002/P-004/7개 문구는 반영됐지만, [ARCHITECTURE.md](C:/Users/assag/solution/website-exposure/docs/admin/ARCHITECTURE.md:249)에 “어드민 화면 수 6개 유지” 잔재가 남음.
- ECP-35: PASS — PAGE_TYPES P-013/P-014는 자체 화면 없음 + § 6 어드민 7개 reference로 정정됨.

## new findings
- ECP-36 major — ARCH § 3.8.2 LegalDocument 자동 생성 규칙의 “어드민 화면 수 6개 유지”가 현재 SoT인 7개와 충돌. `6개 유지` → `P-013 자체 화면 없음. M0 어드민 화면 수는 EAT v0.x cascade로 7개`로 정정 필요.

## acceptance 판정
- closeableAfterPatch=false
- plan v1.0 acceptance commit 보류 권고
- 누계 35 findings 중 ECP-34가 부분 미해소 상태, ECP-36 patch 후 재검증 필요.
