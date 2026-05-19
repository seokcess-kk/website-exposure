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
session id: 019e3931-f8ad-7a71-962d-65ca5de70ae7
--------
user
You are reviewing **cycle 2** of `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md`. Cycle 1 had **21 findings** (6 blocking + 11 major + 4 minor). All were patched in v0.2. Verify convergence and surface remaining issues.

## Cycle 1 findings recap (PSR-01~21)

| # | severity | title | patch summary |
|---|---|---|---|
| PSR-01 | blocking | M0 페이지 선택 오류 | P-009 미합류 + P-014 합류 + P-010 1샘플. § 1.2/§ 2.1 표 정정 |
| PSR-02 | blocking | admin URL 충돌 | `/admin/<slug>/...` prefix 격상. § 2.1 PSR-ROUTE-02 + § 8 작업 #15 + PSR-CASCADE-01 격상 |
| PSR-03 | blocking | nested `<html>/<body>` 중복 | site layout = fragment only. § 4.1 PSR-COMP-01·02 정정 |
| PSR-04 | blocking | robots.txt aiCrawlerPolicy 미반영 | SEARCH_STANDARDIZATION § 3 `disallowTraining` starter + 학습 봇 Disallow + 답변/검색 봇 Allow + Naver Yeti. § 5.3 PSR-SEO-08·09 |
| PSR-05 | blocking | app_public_reader instance slug resolve 불가 | D0011 안 instance lookup policy + content table per-table policy 7개. LOGIN 결정 + production NOLOGIN marker PSR-DEFER-16 |
| PSR-06 | blocking | LegalDocument draft 공개 노출 | v0.1 단계 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 = LL-DEFER-01 alias. § 3.2 PSR-DATA-07 정정 |
| PSR-07 | major | JSON-LD graph SoT 불일치 | § 5.4 표 SoT 그대로 (P-012 WebPage+MedicalClinic 풀, P-014 합류) |
| PSR-08 | major | @id path-based cascade detail | PSR-CASCADE-02 보강 — entity continuity migration note |
| PSR-09 | major | sitemap changefreq/priority/lastmod | SEARCH_STANDARDIZATION § 4.3·§ 4.4 표 그대로 반영 |
| PSR-10 | major | theme-color + og:type 누락 | themeColor 2값 + P-004 profile · P-006/P-010 article. § 5.1 PSR-SEO-01·02·03 |
| PSR-11 | major | Article URL 패턴 | `/insights/[category]/[slug]` · v0.1 single fallback `general` · PSR-DEFER-15 |
| PSR-12 | major | Drizzle ↔ contract mapping 부재 | § 4.2 PSR-COMP-05 표 추가 (TreatmentPage.title=name, Article.title=headline 등) |
| PSR-13 | major | Tailwind alias semantic 22 매핑 부재 | § 4.5 PSR-COMP-10 표 추가 (round-trip 보장) |
| PSR-14 | major | dark mode "light only" 모순 | CSS vars light + dark 둘 다 출력 · UI toggle 만 PSR-DEFER-03 |
| PSR-15 | major | per-table policy 미명시 | D0011 안 CREATE POLICY 7개 명시 |
| PSR-16 | major | LegalDocument DB CHECK 충돌 | RLS published만 SELECT — DB CHECK draft만 허용과 정합 → 404 자동 |
| PSR-17 | major | 외부 JSON-LD validator 게이트 | 자체 rule checker LOCAL_PASS · 외부 validator manual QA · PSR-DEFER-14 |
| PSR-18 | minor | scenario #1 문구 반대 | "보임" 정정 |
| PSR-19 | minor | DOMPurify SSR 문제 | `sanitize-html` 채택 + `rehype-sanitize` 전환 marker PSR-DEFER-17 |
| PSR-20 | minor | rel noreferrer 결정 | `nofollow noopener noreferrer` |
| PSR-21 | minor | env/pgbouncer/role cascade | § 6 PSR-ENV-01 acceptance checklist 12 항목 |

## Re-review scope (cycle 2)

### Patch 가 적용된 파일
- `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.2 (대규모 재작성)

### Cascade target docs (변경 없음 — 본 plan 의 cascade marker reference)
- `docs/admin/ARCHITECTURE.md` (PSR-CASCADE-01)
- `docs/core/SCHEMA_MAPPING.md` § 1.2 (PSR-CASCADE-02)
- `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2 (PSR-CASCADE-03)
- `packages/migrations-runner/src/manifest.ts` (PSR-CASCADE-04)
- `apps/spike-a/.../userlist.txt` (PSR-CASCADE-05)

### 검증 추가 SoT
- `docs/core/PAGE_TYPES.md` — P-014 추가 정합
- `docs/core/SCHEMA_MAPPING.md` — § 2.5 + § 3 entity 풀/참조 정합
- `docs/core/SEARCH_STANDARDIZATION.md` — § 3 robots + § 4.3 sitemap + § 2.1 메타
- `docs/core/DESIGN_TOKENS.md` — § 3.2 semantic 22 + § 3.3 light/dark
- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — LegalDocument DB CHECK
- `packages/core-content/src/schema.ts` — Drizzle SoT 실 column 명

## What to check (cycle 2)

1. **cycle 1 patch 가 SoT 와 일관**한지:
   - PSR-01 의 10페이지 (P-001/002/003/004/005/006/010/012/013/014) 가 PAGE_TYPES.md M0 column 정합
   - PSR-04 의 robots starter 가 SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시와 entry-by-entry 정합
   - PSR-09 의 sitemap 표가 SEARCH_STANDARDIZATION § 4.3 표와 cell-by-cell 정합
   - PSR-12 의 DB field mapping 표가 schema.ts 실 column 명과 entry-by-entry 정합
   - PSR-13 의 Tailwind alias 표가 DESIGN_TOKENS § 3.2 semantic 22 round-trip
   - PSR-15 의 D0011 per-table policy 가 모든 6 content table + instance 포함 (총 7개)
   - PSR-16 LegalDocument RLS USING `status='published'` 가 LL-SCHEMA-03 의 CHECK `status='draft'` 와 정합 (=400 자동 충돌 없음)

2. **회귀 (regression)**:
   - PSR-02 admin URL 변경의 회귀 영향 — sign-in/sign-out/cleanup/api/seed.ts/forms revalidatePath/dashboard route 모두 패치 영향
   - PSR-03 root layout 은 변경 없음 — site layout fragment 만의 영향이 root layout 의 className conflict 없는지
   - PSR-06 LegalDocument 의 footer 링크 — Footer 가 5종 정책 페이지 링크를 표시하면 404 link 표시 (운영자에 혼란 가능)

3. **새 cascade marker (PSR-DEFER-13~17, PSR-CASCADE-01 격상)**:
   - PSR-DEFER-13 = LL-DEFER-01 alias 의 phase 분류 (§ 9.1 M0 v1.0)
   - PSR-DEFER-14 (외부 validator manual QA) 의 phase (§ 9.4)
   - PSR-DEFER-15 (Article category) 의 phase 합류 시점
   - PSR-DEFER-16 (NOLOGIN/MEMBERSHIP production)
   - PSR-DEFER-17 (sanitize-html → rehype-sanitize 전환)
   - PSR-CASCADE-01 격상 — acceptance precondition 코드 cascade 가 LOCATION_LEGAL code v1.1 + ADMIN_UI_SKELETON code v1.1 patch 동반 필요

4. **acceptance precondition (PSR-CASCADE-01~05)** 최종 점검

5. **새 finding** (만약 있다면 PSR-22+ 부터)

## Output format

```
# PUBLIC_SITE_RENDER_PLAN v0.2 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세 추적: cycle1=21 (6+11+4) → cycle2=N (B+M+m)

## cycle 1 patch 검증
- PSR-01 ~ PSR-21 각각 PASS / FAIL / PARTIAL + 근거 한 줄

## new blocking / major / minor (PSR-22+)

## acceptance precondition (PSR-CASCADE-01~05) 재점검
- PSR-CASCADE-01: <PASS|FAIL|TBD>
- ...
```

cycle 1 21 findings 가 모두 PASS 이고 새 blocking/major 0 이면 closeableAfterPatch=true. minor 잔존이면 다음 cycle 짧게.

가능한 한 광범위하게 보고, 파일을 직접 line 단위로 인용하라. 한국어로 응답.

codex
리뷰 범위가 문서 여러 개와 schema 코드까지 걸려 있어서, 먼저 관련 파일의 현재 라인 단위 근거를 수집한 뒤 PSR-01~21을 하나씩 대조하겠습니다. 변경은 하지 않고 review finding만 정리합니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "''^#|PSR-|P-0|robots|sitemap|LegalDocument|D0011|CREATE POLICY|sanitize|theme|og:type|Tailwind|semantic|ADMIN|admin|NOLOGIN|MEMBERSHIP|Footer|footer|revalidatePath|aiCrawlerPolicy|disallowTraining|@id|Article|TreatmentPage|Location|MedicalClinic|schema|status='"'published'|status = 'published'|published\" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "P-014|M0|P-001|P-002|P-003|P-004|P-005|P-006|P-010|P-012|P-013|P-009" docs/core/PAGE_TYPES.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "robots|sitemap|changefreq|priority|lastmod|aiCrawlerPolicy|disallowTraining|Yeti|theme|og:type|Article|profile|MedicalClinic|JSON-LD|WebPage" docs/core/SEARCH_STANDARDIZATION.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "semantic|Tailwind|alias|light|dark|theme|color|round" docs/core/DESIGN_TOKENS.md' in C:\Users\assag\solution\website-exposure
 succeeded in 875ms:
4:> **작성일**: 2026-05-14 (v0.7 → v0.8 — § 6 M0 표 P-013 비고 SoT 정합 / 잔존 버전 표기 정리)
23:- M0 Slice: **9종 + Article 1샘플 = 10개 페이지** (P-001·P-002·P-003·P-004·P-005·P-006·P-012·P-013·P-014 + P-010 1샘플).
24:- **P-014 LocationProfile(main)·P-013 LegalDocument는 어드민 화면 추가 없이 ClinicProfile 화면의 기관 정체성 + 본원 위치·연락·시간 입력 + Core 표준 템플릿으로 자동 생성** (SoT: 위치·시간·연락은 LocationProfile이 마스터). 단지점·다지점 통일 처리.
34:| ID | 페이지 타입 | URL 패턴 | 주 데이터 계약 | M0 |
36:| P-001 | Home | `/` | `ClinicProfile` (요약) | ✅ |
37:| P-002 | About | `/about` | `ClinicProfile` (전체) | ✅ |
38:| P-003 | Doctors List | `/doctors` | `DoctorProfile[]` | ✅ |
39:| P-004 | Doctor Profile | `/doctors/{slug}` | `DoctorProfile` | ✅ |
40:| P-005 | Treatments List | `/treatments` | `TreatmentPage[]` | ✅ |
41:| P-006 | Treatment Detail | `/treatments/{slug}` | `TreatmentPage` | ✅ |
44:| P-009 | Articles List | `/insights` 또는 `/blog` | `Article[]` | |
45:| P-010 | Article Detail | `/insights/{cat}/{slug}` | `Article` | ✅ (1샘플) |
47:| P-012 | Contact / Visit (Conversion Hub) | `/contact` | `ClinicProfile` + `LocationProfile[]` | ✅ |
48:| P-013 | Legal / Policy | `/privacy`, `/terms` 등 | `LegalDocument` | ✅ (자동 생성) |
49:| P-014 | Location / Branch Detail | `/locations/{slug}` | `LocationProfile` | ✅ (main 자동) |
97:### P-001. Home
108:4. 최신 인사이트 (M0에서 P-009 미합류 시 P-010 샘플로 직접 링크)
118:**내부 링크 권장**: → About / Doctors List / Treatments List / Contact (P-009 미합류 시 Article 샘플 직접 링크)
120:### P-002. About (병원 소개)
150:### P-003. Doctors List
166:### P-004. Doctor Profile
194:### P-005. Treatments List
210:### P-006. Treatment Detail
279:**레이아웃 변형**: P-005 동일
305:**레이아웃 변형**: P-006 동일
310:### P-009. Articles List
326:> v0.5 비고: Article에 `contentFormat`(article·video·column) 필드. P-009는 분할하지 않고 형식 배지·필터로 분류.
328:### P-010. Article Detail
396:### P-012. Contact / Visit — Conversion Hub
398:**목적**: 위치·진료시간·예약·상담 채널의 통합 전환 허브. 단순 안내 페이지가 아닌 **다중 CTA 채널 집결지**. M0 필수.
408:5. 다지점인 경우 — 지점 목록 + 각 P-014 Location Detail 링크
420:### P-013. Legal / Policy — **M0 출시 게이트** ⭐ v0.5 격상
422:**목적**: 개인정보처리방침·이용약관·비급여 진료 등 정책 페이지. **법적·규제 의무**. 폼·예약·분석 스크립트 운영 시 사실상 필수 (개인정보보호법·정통망법). M0 출시 게이트.
427:**M0 자동 생성 규칙** (v0.5 신규, v0.6 SoT 정정):
430:- **어드민 화면 추가 없음** — M0 어드민 화면 수 6개 유지. 운영자는 ClinicProfile 입력 시 정책 변수(개인정보 보호 책임자·시행일 등)만 추가 입력하거나, LegalDocument 파일을 Git에 수동 보강.
452:### P-014. Location / Branch Detail
493:- **어드민 별도 LocationProfile 입력 화면 추가 불필요** (M0 어드민 화면 수 6개 유지).
496:**다지점 인스턴스의 처리**: `LocationProfile` N개. P-012 Contact는 통합 안내 + 각 P-014 페이지로 링크.
596:> **1호 클라이언트 적용 후보**: 다이어트 유형 체크, 요요 위험도 체크, 체질 기반 사전문진. **M0 외 — Phase Alpha~Beta 도입 검토**.
602:| ID | 이름 | URL | 주 데이터 계약 | 주 Schema | 위험도 기본 | High-risk | M0 |
604:| P-001 | Home | `/` | ClinicProfile | Organization + MedicalClinic + WebSite | Low | | ✅ |
605:| P-002 | About | `/about` | ClinicProfile | Organization + MedicalClinic | Low | | ✅ |
606:| P-003 | Doctors List | `/doctors` | DoctorProfile[] | ItemList | Low | | ✅ |
607:| P-004 | Doctor Profile | `/doctors/{slug}` | DoctorProfile | Physician | Low | | ✅ |
608:| P-005 | Treatments List | `/treatments` | TreatmentPage[] | ItemList | Low | | ✅ |
609:| P-006 | Treatment Detail | `/treatments/{slug}` | TreatmentPage | MedicalProcedure | Medium | | ✅ |
612:| P-009 | Articles List | `/insights` | Article[] | ItemList/Blog | Low | | |
613:| P-010 | Article Detail | `/insights/{cat}/{slug}` | Article | Article (+VideoObject) | ArticleType 가변 | | ✅ (1) |
615:| P-012 | Contact / Visit (Conversion Hub) | `/contact` | ClinicProfile + LocationProfile[] | MedicalClinic/LocalBusiness | Low | | ✅ |
616:| P-013 | Legal / Policy | `/privacy` 등 | LegalDocument | WebPage | Low | | ✅ (자동) |
617:| P-014 | Location / Branch Detail | `/locations/{slug}` | LocationProfile | MedicalClinic/LocalBusiness (지점) | Low | | ✅ (main) |
627:## 6. Vertical Slice (M0) 페이지 타입 — 10개 페이지
631:| 1 | P-001 Home | 메인 |
632:| 2 | P-002 About | ClinicProfile 노출 |
633:| 3 | P-003 Doctors List | DoctorProfile 1명 이상 |
634:| 4 | P-004 Doctor Profile | 1개 이상 |
635:| 5 | P-005 Treatments List | TreatmentPage 1개 이상 |
636:| 6 | P-006 Treatment Detail | 1개 이상 |
637:| 7 | P-012 Contact (Conversion Hub) | ClinicProfile + LocationProfile[] |
638:| 8 | P-014 Location Detail (main 자동) | 어드민 화면 추가 없이 자동 생성 (§ 3 P-014 규칙) |
639:| **9** | **P-013 Legal / Policy (자동 생성)** | Core 표준 템플릿 + ClinicProfile · LocationProfile(main) 변수 치환 자동 생성. 어드민 화면 추가 없음. **출시 게이트** (법무 검토 필수 — ComplianceRecord.legalCounsel/legalCounselAt required) |
640:| (샘플) | P-010 Article Detail | 1개 샘플 (Home에서 직접 링크 — 고립 회피) |
642:**M0 어드민 화면 수: 6개 유지** (대시보드 / ClinicProfile / DoctorProfile / TreatmentPage / Article / 미리보기·발행). P-012·P-014·P-013은 모두 ClinicProfile·LocationProfile 입력값과 Core 표준 템플릿으로 자동 생성되므로 별도 화면 불필요.
644:**M0 미합류 합류 우선순위**:
645:1. P-009 Articles List
666:| PT-04 | ~~다지점 페이지 타입~~ | 해소 — P-014 |
668:| PT-06 | ~~정책 페이지 표준화~~ | 해소 — P-013 |
685:| 2026-05-13 | v0.2 | P-013 격상, P-105 신설, P-103 명칭 확장, 위험도 격상 조건표, M0 Contact 추가 |
687:| 2026-05-13 | v0.4 | DEEP_DIVE 통합 1단계 — 번호 체계 재정렬(P-014 Location 필수, P-106 Self-test), Contact Conversion Hub, High-risk 묶음, M0 8+1=9 |
688:| 2026-05-14 | v0.5 | **피드백 적용**: (1) **전체 본문 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, 단독 구현 명세화, (2) **P-014 LocationProfile main 자동 생성 규칙 명시** (어드민 화면 추가 없음), (3) **P-006 TreatmentPage 정보 슬롯에 treatmentComponents·recommendedFor·visitFlow·remoteCareAvailable·maintenancePlan·evidenceNotes 즉시 통합**, (4) **P-010 Article 정보 슬롯에 reviewedBy·contentSource·externalUrl 즉시 통합**, (5) **P-106 Self-test를 "Feature-backed optional page"로 표현 변경** (PT-12 해소), (6) PT-14 LocationProfile 자동 생성 규칙 어드민 구현 세부 신규, (7) **v0.5.1 추가 정정**: **P-013 Legal/Policy를 M0 출시 게이트로 격상** — Core 표준 템플릿 + ClinicProfile 변수 자동 치환 생성. M0 페이지 수 9 → **10**. 어드민 화면 수 6개 그대로 (자동 생성). 법무 검토 필수 (ComplianceRecord 추적) |
689:| 2026-05-14 | v0.6 | **피드백 정정**: P-013 자동 생성 규칙의 **변수 출처 SoT 정합화** — ClinicProfile 변수(`{{clinic.*}}`) + LocationProfile(main) 변수(`{{location.main.*}}`) 분리 명시. SoT 원칙 준수 |
690:| 2026-05-14 | v0.7 | **피드백 정정**: (1) § 0 요약 SoT 정합 표현 정정 — "ClinicProfile 입력" → "ClinicProfile 화면의 기관 정체성 + 본원 위치·연락·시간 입력", (2) **§ 3 P-014 자동 생성 규칙 정합 갱신** — `reservationChannels = primaryCtas 상속` 및 `featuredChannelId` (선택, v0.6 신규) 흐름 명시. admin § 3.8.1과 동기화 |
691:| 2026-05-14 | v0.8 | **피드백 정정**: § 6 M0 표 P-013 비고를 SoT 정합으로 정정 — "v0.5 격상 — ClinicProfile 변수 치환" → "ClinicProfile · LocationProfile(main) 변수 치환, 출시 게이트, 법무 검토 필수". 잔존 버전 표기(§ 6 제목 "(v0.5 갱신)" 등) 제거 |

 succeeded in 874ms:
1:# Core — 검색 표준화 (메타·robots·sitemap·canonical·성능)
7:> **목적**: Core가 빌드 시 출력하는 검색 표준 산출물 — 메타 태그·robots.txt·sitemap.xml·canonical 처리·성능 기준 — 의 단독 구현 가능한 명세.
12:> - JSON-LD Schema → `core/SCHEMA_MAPPING.md`
19:- Core가 빌드 시 자동 생성하는 **5개 표준 산출물**: head 메타 태그·robots.txt·sitemap.xml·canonical URL·성능 budget.
21:- robots.txt는 **AI 크롤러 정책을 인스턴스 단위로 명시적 결정 — `aiCrawlerPolicy` required (미설정 시 빌드 fail)**. enum: `allow | disallowTraining | disallowAll | custom`. **`allow`는 법무 승인 플래그 `aiCrawlerLegalApproved: true` 필수 (fail-gate)**, 다른 정책은 승인 기록 권장. starter template은 `disallowTraining` 제안 — 검색·답변 노출 유지하면서 학습 데이터 사용 차단.
22:- sitemap.xml은 **InstanceManifest·콘텐츠 파일 트리**로부터 자동 생성. 모든 발행 페이지 포함, 미발행 드래프트 제외.
35:| robots.txt 자동 생성 | ✅ | |
36:| sitemap.xml 자동 생성 | ✅ | |
47:- **robots.txt**: 플레인 텍스트 — 사이트 루트 (`/robots.txt`)
48:- **sitemap.xml**: 표준 sitemap XML 0.9 — 사이트 루트 (`/sitemap.xml`)
60:| robots 룰 변경 | MINOR (정책 변경은 운영 결정) |
79:| `<meta name="robots">` | **Allowed** (모든 페이지) | `PageMeta.robots` (기본 `"index, follow, max-snippet:-1, max-image-preview:large"`) |
83:| `<meta property="og:type">` | **Allowed** | 페이지 타입에 따라 자동 — `P-004`는 `profile`, `P-006/P-008/P-010`은 `article`, 나머지는 `website` (§ 2.2 매핑 참조) |
94:| `<meta property="article:published_time">` | **Conditional — P-010 전용** | `Article.datePublished`. P-006/P-008은 `@createdAt`을 공개 발행일로 보기 어려우므로 **미출력** (공개 발행 개념이 의료 정보 페이지에 직접 매핑되지 않음) |
95:| `<meta property="article:modified_time">` | Conditional (P-006·P-008·P-010) | P-010: `Article.dateModified` (누락 fail) / **P-006·P-008: § 2.3 fallback** — 명시 `dateModified` 부재 시 공통 `@updatedAt` (fallback 사용은 정상 silent) |
96:| `<meta property="article:author">` | Conditional | **P-010: `Article.author.name`** (fail) / P-006·P-008: `reviewedBy.name` (있을 때만, optional) |
97:| `<meta property="article:section">` | **Conditional — P-010 전용** | `ArticleCategory.name`. P-006/P-008은 ArticleCategory 개념 없으므로 미출력 |
99:| `<meta name="theme-color">` | **Allowed (의무)** | light·dark 두 값 모두 출력 — `BrandTokens.colors.light.primary` + `BrandTokens.colors.dark.primary` (media 쿼리 별도). `DESIGN_TOKENS.md` § 9.4.1 SoT |
103:### 2.2 페이지 타입별 og:type 매핑
105:| 페이지 타입 | og:type |
110:| P-004 Doctor Profile | `profile` |
115:| P-009 Articles List | `website` |
116:| P-010 Article Detail | `article` |
123:> **의도적 예외**: P-006·P-008은 `og:type=article`이지만 `article:*` 부가 메타는 **제한 출력** — `article:modified_time`·`article:author`만 (P-010은 모든 부가 메타 출력). P-006/P-008은 `article:published_time`·`article:section` 미출력 (의료 정보 페이지에 공개 발행일·ArticleCategory 매핑 부자연스러움). § 2.1 표 참조.
127:**`PageMeta.robots` vs `PageMeta.noIndex` 우선순위 룰**:
128:- `noIndex: true`가 **항상 우선**. `robots` 필드의 `index`/`noindex` 지시어는 noIndex에 의해 자동 override됨
129:- 충돌 입력 (`noIndex: true` + `robots: "index, follow"`) 감지 시 **warning** + 빌드 시 noIndex 우선 적용
130:- `noIndex: true`인 페이지는 sitemap 자동 제외 + `<meta name="robots" content="noindex, follow">` 출력 + robots.txt 차단 안 함 (§ 3.3.1 noIndex 원칙 정합)
141:| **P-010 Article**: `<meta property="article:published_time">`·`article:modified_time`·`article:author` 누락 | **fail** | head meta 표준 책임. 출처: `Article.datePublished`·`Article.dateModified`·`Article.author.name`. 단 **`publisher`는 JSON-LD `Article.publisher`로 강제** (SCHEMA_MAPPING § 3 P-010 책임 — head meta에는 `article:publisher` 없음) |
142:| **P-006 Treatment Detail / P-008 Condition Detail**: `article:modified_time` 출처 결정 | **정상 동작** (warning 아님) | og:type=article이지만 entity 자체는 MedicalProcedure/MedicalCondition. **출처 우선순위**: ① 페이지 계약에 명시적 `dateModified` 필드가 있으면 사용 (현재 C-03·C-11 미정의) → ② 공통 `@updatedAt` (DATA_MODEL § 2.2 — 모든 계약 필수)로 fallback. **fallback 사용 자체는 정상 경로 (silent)** |
146:| **P-010 Article**: `Article.category` / `ArticleCategory.name` resolve 실패 (= `article:section` 누락) | **warning** | `Article.category`는 DATA_MODEL에서 required이므로 누락 가능 케이스는 ArticleCategory 참조 resolve 실패. 콘텐츠 분류 신호 약화 (콘텐츠 자체는 출력) |
147:| `noIndex: true` 페이지에서 `<meta name="robots" content="noindex, follow">` 누락 | fail | sitemap 제외와 함께 robots 메타도 출력 필수 |
151:## 3. robots.txt 표준
159:| **A. 일반 검색 색인** | `Googlebot` / `Yeti` (네이버) / `Bingbot` | 일반 검색 결과 색인 — 의료기관 노출의 1차 채널 | 각 검색 엔진 공식 문서 |
161:| **C. User-triggered fetch** | `ChatGPT-User` (사용자 GPT 요청 시 fetch) / `Perplexity-User` (사용자 Perplexity 요청 시 fetch) / `Claude-User` (사용자 Claude 요청 시 fetch) | **사용자 직접 요청**에 의해 페이지를 fetch. 제품별 robots.txt 해석·우선순위가 일반 크롤러와 다를 수 있으므로 **차단 보장 수단으로 보지 않음** (각 제품 공식 문서 확인 권장) | 동일 공식 출처 |
170:> - Google robots.txt spec — https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt
172:> - Google robots-meta (meta tag — noindex 등) — https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
174:### 3.2 `aiCrawlerPolicy` enum — **required (미설정 시 빌드 fail)**
176:`InstanceManifest.aiCrawlerPolicy`로 인스턴스별 명시 결정. **Core 자동 적용 기본값 없음**. 빌드 시 미설정이면 fail.
181:| `disallowTraining` (**권장 기본**) | Allow | Allow | Allow | **Disallow** | 승인 기록 권장 (warning 수준) |
185:> **C 계열 (User-triggered fetch) 주의**: 제품별 robots.txt 해석 정책이 일반 검색·학습 크롤러와 다를 수 있음. `disallowAll`을 선택해도 **C 계열에 대한 완전 차단을 보장하는 수단으로 보지 않는다** — 각 제품 공식 문서·고객지원 채널 확인 권장.
186:> **starter template**은 `disallowTraining` 제안 — 의료기관 사이트의 환자 후기·전후사진·브랜드 콘텐츠 학습 위험 회피 + 검색·답변 노출 유지.
190:#### `aiCrawlerPolicy: disallowTraining` (권장 기본)
193:# robots.txt — 자동 생성 by Glitzy Core (SEARCH_STANDARDIZATION § 3)
206:User-agent: Yeti
250:Sitemap: https://{domain}/sitemap.xml
253:> `InstanceManifest.experimentalAiBots: true`(default `false`)일 때만 `meta-externalagent` 등 외부 관측 기반 user-agent가 robots.txt에 포함된다. 공식 검증된 user-agent만 기본 출력.
255:#### `aiCrawlerPolicy: allow` (학습 포함 전체 허용 — 법무 승인 필수)
259:#### `aiCrawlerPolicy: disallowAll` (AI 전체 차단)
263:### 3.3.1 robots.txt 룰 (Allowed / Blocked / Conditional)
267:| AI 크롤러 허용/차단 | **`aiCrawlerPolicy` 정책에 따라 § 3.2 매트릭스 적용** | required, 미설정 fail |
270:| 미발행 드래프트 차단 | (sitemap에서 제외 + 라우트 자체 없음) | robots.txt에서 별도 명시 안 함 |
271:| **`noIndex: true` 페이지를 robots.txt에서 Disallow** | **Blocked** (Core 룰) | **robots.txt로 차단하면 크롤러가 meta noindex를 읽지 못함**. noIndex 페이지는 robots.txt 차단 X + sitemap 제외 + `<meta name="robots" content="noindex, follow">`로 처리 (참고: Google robots.txt intro) |
274:### 3.4 인스턴스별 robots 오버라이드 — user-agent별 merge/replace
284:**예시 — `aiCrawlerPolicy: allow` (기본 모두 허용)에서 PerplexityBot 일부 경로만 차단**:
292:robotsOverrides:
305:> `InstanceManifest.robotsOverrides`(DATA_MODEL C-08·`RobotsOverride` 하위 타입)에 user-agent별 룰 명시. 빌드 시 Core 기본 + 오버라이드를 merge하고 같은 path에 Allow/Disallow 충돌 시 빌드 실패.
309:## 4. sitemap.xml 표준
313:빌드 시 다음 페이지를 sitemap에 포함:
319:| 인스턴스 콘텐츠 (Articles·Treatments·Doctors·Conditions·FAQ·Locations) | **Allowed** — 발행된 모든 콘텐츠 |
324:### 4.2 sitemap.xml 형식
328:<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
331:    <lastmod>2026-05-14</lastmod>
332:    <changefreq>weekly</changefreq>
333:    <priority>1.0</priority>
337:    <lastmod>2026-05-13</lastmod>
338:    <changefreq>monthly</changefreq>
339:    <priority>0.8</priority>
345:### 4.3 페이지별 changefreq·priority 기본값
347:| 페이지 타입 | changefreq | priority |
357:| P-009 Articles List | weekly | 0.6 |
358:| P-010 Article Detail | monthly | 0.5 |
365:### 4.4 lastmod 출력
369:- **Article**(P-010)은 `Article.dateModified` 우선
372:### 4.5 sitemap 인덱스 (대규모 시)
374:- 단일 sitemap.xml의 URL 50,000개 또는 50MB 초과 시 sitemap index 형식 자동 분할
375:- M0 단일 클라이언트 인스턴스는 일반적으로 단일 sitemap.xml로 충분
520:- robots.txt에 `Sitemap:` 라인 자동 출력 — 검색 엔진 자동 발견
537:| **fail** | 빌드 실패 | title·description·canonical 누락, robots.txt 전체 차단, sitemap 출력 실패, Lighthouse Performance < 60 등 |
539:| **content-gate** | 본문 표현 검수 | (본 문서는 메타·robots·sitemap 중심이라 content-gate 항목 적음. `CONTENT_STANDARDS.md`에서 다룸) |
554:| SS-01 | robots.txt 신규 AI 크롤러 갱신 — **주기는 분기 1회로 결정**. 미정인 부분: 재검증 책임자(Glitzy Core 팀 vs 운영자) / 업데이트 PR 흐름(Core 패키지 MINOR 릴리즈 vs 인스턴스 robotsOverrides) | 운영 프로세스 결정 |
556:| SS-03 | sitemap.xml 분할 임계 — 50,000 URL이 표준이나 운영 효율은 더 작게? | 인스턴스 규모 누적 후 결정 |
566:| ~~SS-05~~ | `theme-color` 메타 자동 출력 정책 | v1.0 — `DESIGN_TOKENS.md` § 9.4.1 SoT 확정. light·dark 두 값 모두 출력 (`<meta name="theme-color">` + `media="(prefers-color-scheme: dark)"` 별도). 값은 `BrandTokens.colors.primary` 평면화 hex |
574:| 2026-05-14 | v0.1 | 최초 작성 — 메타 태그 표준(28종), robots.txt(AI 크롤러 화이트리스트), sitemap.xml(페이지별 changefreq/priority), canonical resolve 우선순위, 성능 기준(빌드 lab + 운영 field), Core 인터페이스 vs analytics-reporting 모듈 책임 분리, 빌드 검증 룰 레벨 |
575:| 2026-05-14 | v0.2 | **상위 문서 정합·정책 보강** (피드백 7건): (1) **canonical resolve § 0 요약 정정** — 3단계 부재 시 fail 명시, (2) **inLanguage 정책 통일** — 저장 `ko-KR`, `<html lang>` 출력 시 `ko` normalize, og:locale은 `ko_KR`, (3) **robots merge/replace 룰 명시** — append 방식 폐기, user-agent 단위 replace/merge로 변경. 충돌 시 빌드 실패, (4) **AI 크롤러 정책 `aiCrawlerPolicy` enum 도입** — `allow/disallowTraining/disallowAll/custom` 4종 + 법무 승인 플래그 `aiCrawlerLegalApproved` 필수, (5) **og:type `profile` 사용** — DATA_MODEL의 `ogType` enum 확장 필요(`{website, article, profile}`) — cascade DATA_MODEL 갱신, (6) **P-006·P-008 Article 메타 검증 분리** — P-010만 strict fail, P-006/P-008은 dateModified warning + author optional(reviewedBy 매핑), (7) **§ 6.1 성능 게이트 샘플링 정책** — 페이지 타입별 대표 URL + Critical URL + 변경 페이지 샘플링. CPU/network throttling, cold/warm run, 재시도 룰. 전체 페이지 측정은 별도 Job. (8) **noIndex 시 `<meta name="robots" content="noindex, follow">` 출력 룰 추가** (fail) |
576:| 2026-05-14 | v0.3 | **AI 크롤러 정책 정밀화·environment 분기** (피드백 8건): (1) **§ 3.1 AI 크롤러 3계열 분리** — A 검색 색인 / B AI 검색·답변용 / C AI 학습. **OAI-SearchBot·Perplexity-User·Bingbot·meta-externalagent 추가**, (2) **Google-Extended를 C 학습 계열로 정리** (이전 잘못된 A 분류 정정), (3) **§ 3.2 `aiCrawlerPolicy` required, 미설정 시 빌드 fail** — Core 자동 적용 기본값 없음. starter template만 `disallowTraining` 제안, (4) **§ 2.1 `<html lang>` ko-KR 그대로 출력** — normalize 제거. BCP 47 유효, 지역 정보 보존, (5) DATA_MODEL ogType cascade 이미 적용됨(v0.10 — 사용자 시점차), (6) **§ 3.3.1 noIndex vs robots.txt 원칙 명시** — robots.txt 차단 X + sitemap 제외 + meta noindex (참고: Google robots.txt intro), (7) **§ 2.3 publisher 검증 분리** — head meta에는 article:publisher 없음 → JSON-LD `Article.publisher`로 강제(SCHEMA_MAPPING § 3 P-010 책임). § 2.3는 article:published_time/modified_time/author만, (8) **§ 3.3.1 environment 분기** — production은 전체 차단 Blocked, staging/preview는 Allowed (Basic Auth 권장. `InstanceManifest.environment` 기반) |
577:| 2026-05-14 | v0.4 | **AI 봇 분류 정확화** (피드백 8건): (1) **§ 0 요약 정정** — "Core 기본 allow" 잔재 제거, `required·미설정 fail`로 통일, (2) **Anthropic 봇 분류 정정** — `ClaudeBot`을 D 학습 계열로, `Claude-SearchBot`을 B 검색 인덱싱, `Claude-User`를 C user-triggered로. `anthropic-ai`는 legacy/alias 주석, (3) **OpenAI `ChatGPT-User` 추가** — C user-triggered 계열, (4) **3계열 → 4계열 재구성** — A 일반 검색 / B AI 검색 인덱싱 / **C User-triggered fetch** / D AI 학습. C 계열은 robots.txt 무시 가능성 주의, (5) **공식 출처 URL 명시** — 각 user-agent에 OpenAI publisher FAQ·Anthropic crawler help·Perplexity crawlers·Google robots-meta 참조. `meta-externalagent`는 외부 관측 기반 표기. 분기 1회 재검증 책임 명시, (6) **§ 0·§ 2.1 og:type 잔재 정정** — P-004 profile·P-006/P-008/P-010 article·나머지 website, (7) **SCHEMA_MAPPING § 1.5 `<html lang="ko">` → `<html lang="ko-KR">` cascade 정합**, (8) **법무 승인 플래그 룰 완화** — `allow`만 fail-gate, 다른 정책은 승인 기록 권장(warning 수준) |
578:| 2026-05-14 | v0.5 | **C-08 InstanceManifest cascade·미세 정합** (피드백 6건): (1) **DATA_MODEL C-08에 8개 필드 추가** — `environment`·`aiCrawlerPolicy`·`aiCrawlerLegalApproved`·`aiCrawlerApprovedBy/At`·`robotsOverrides`·`experimentalAiBots`·`performanceBudget`·`searchConsoleVerification` + `RobotsOverride`·`PerformanceBudget` 하위 타입 신설. **본 문서가 단독 구현 가능한 명세로 작동**, (2) **§ 2.3 `PageMeta.noIndex` vs `robots` 우선순위 명시** — noIndex 항상 우선, 충돌 시 warning, (3) **§ 2.3 P-006/P-008 modified_time fallback** — `TreatmentPage.dateModified`/`MedicalConditionPage.dateModified` 또는 공통 `@updatedAt`로 fallback, (4) **§ 3.4 custom 예시 정정** — **`aiCrawlerPolicy: allow` 기반** PerplexityBot 일부 경로 차단(`/reviews`·`/pricing`) 예시로 교체, (5) **§ 7.3 analytics-reporting 후속 문서 안내** — `docs/features/` 디렉터리 미생성 명시, (6) **§ 3.3 meta-externalagent를 `experimentalAiBots`로 분리** — 공식 검증 전 user-agent는 별도 플래그 활성화 시에만 robots.txt 포함 |
579:| 2026-05-14 | v0.6 | **룰·게이트·참고 URL 미세 정합** (피드백 5건): (1) **§ 2.3 P-006/P-008 modified_time 룰 정확화** — "명시적 dateModified 부재로 공통 `@updatedAt` fallback 사용" warning. modified_time 출력 자체는 누락 안 됨. C-11 풀명세 시 dateModified 추가 검토 명시, (2) v0.5 변경 이력 정정 — "disallowTraining 기반" → "**`aiCrawlerPolicy: allow` 기반**" PerplexityBot 일부 경로 차단 예시, (3) **DATA_MODEL C-08 cascade — `aiCrawlerApprovedBy/At`을 `aiCrawlerPolicy: allow` 시 required로 격상** (감사 추적 게이트 강화), (4) **DATA_MODEL C-08 PerformanceBudget 확장** — `imageWeightKbOverride`·`lighthouseSeoMinOverride`·`lighthouseAccessibilityMinOverride` 추가 (§ 6.1 budget 항목 모두 override 가능), (5) **§ 3.1 Google 참고 URL 정정** — robots.txt spec + Google-Extended 문서로 교체. robots-meta-tag는 noindex 등 별도 참조로 분리 |
580:| 2026-05-14 | v0.7 | **잔여 문구·표 정합** (피드백 5건): (1) **§ 3.1 표 D 계열 출처 정정** — "Google search-console robots-meta" → "**Google-Extended controls (overview-google-crawlers)**" (Google 봇 분류 근거 정확화), (2) **§ 4.4 sitemap lastmod 출처 분리** — P-010 Article은 `Article.dateModified`, P-006·P-008은 명시 필드 부재 시 `@updatedAt` (§ 2.3 정합), (3) **§ 2.1 메타 태그 출처 칸 세분화** — `article:published_time`·`modified_time`·`author`를 P-006/P-008/P-010별로 분리 명시. P-010 fail/P-006·P-008 conditional fallback 차등, (4) **v0.6 변경 이력 "6건 → 5건" 오기 수정**, (5) **§ 6.1 강화 판정 방향 명시** — max 계열(LCP·CLS·TBT·bundle·image)은 작을수록 강화, min score 계열(Performance·SEO·Accessibility)은 클수록 강화. 반대 방향 입력 시 빌드 실패 |
581:| 2026-05-14 | v0.8 | **OG article 메타 범위 정밀화** (피드백 4건): (1) **§ 2.1 `article:published_time`을 P-010 전용으로 좁힘** — P-006/P-008은 `@createdAt`을 공개 발행일로 매핑하기 부자연스러움. 미출력, (2) **§ 2.1 `article:section`도 P-010 전용** — P-006/P-008은 ArticleCategory 개념 없음. `article:modified_time`·`article:author`만 P-006/P-008에 conditional 적용, (3) **SS-04 미결정 해소 표시** — PerformanceBudget 강화 override 범위는 v0.6/v0.7에서 결정 완료, (4) **§ 3.1·§ 3.2 C 계열 표현 완화** — "robots.txt를 일반 크롤러처럼 따르지 않을 수 있음" → "**제품별 robots.txt 해석·우선순위가 일반 크롤러와 다를 수 있으므로 차단 보장 수단으로 보지 않음**" (법무·운영 문서 톤) |
583:| 2026-05-14 | v0.10 | **잔재 정합 마감** (피드백 3건): (1) **§ 2.1 `article:modified_time` 출처 표** — "warning 수준" 잔재 제거. fallback 사용은 silent로 명시, (2) **v0.9 변경 이력 표현 정정** — warning은 명시 필드 도입 후 값 부재에만 적용. `@updatedAt` resolve 실패는 fail로 분리 (이전 표현이 둘을 warning에 모두 묶어서 모순), (3) **§ 2.3 `article:section` 룰 이름 정확화** — "누락 warning" → "**`Article.category` / `ArticleCategory.name` resolve 실패**" (Article.category는 required, 누락 가능 케이스는 참조 resolve 실패) |
584:| 2026-05-14 | **v1.1** | **DESIGN_TOKENS v1.0 cascade**: § 2.1 메타 표 theme-color Conditional → **Allowed(의무)**로 격상. light·dark 두 값 출력 (`BrandTokens.colors.light.primary` + `colors.dark.primary`). SS-05 해소 |
585:| 2026-05-14 | **v1.0** | **구현 명세 안정판 격상**: (1) **§ 2.2 P-006/P-008 OG `article:*` 제한 출력 주석 추가** — 표 오해 방지, (2) **§ 3.2 매트릭스 C 계열 컬럼명에 `(best-effort)` 명시** — 정책의 한계를 표 자체에 드러냄, (3) **§ 9 SS-01 구체화** — 분기 1회 재검증 주기는 결정. 재검증 책임자·업데이트 PR 흐름이 미정으로 명확화, (4) v0.10 → **v1.0 격상** — 사용자 피드백 "구현 가능한 명세 수준 도달·기능 구현을 막는 수준의 결함 없음" 채택. 다음 단계는 SchemaGenerator 일부 + rule checker + robots/sitemap generator 실제 구현 + 그 발견을 문서에 되먹이기 |

 succeeded in 887ms:
7:> **목적**: Core가 정의하는 디자인 토큰 표준 — 토큰 분류(primitive·semantic·component), 색상·타이포·간격·라운드·그림자·모션·컴포넌트 토큰 카탈로그, 출력 형식(CSS·JSON), Preset/Instance override 인터페이스, 접근성 기준, 빌드 검증을 단독 구현 가능한 명세로 정의.
19:- **3-tier 토큰 구조**: primitive(원시값) → semantic(의미) → component(컴포넌트 매핑). **색상·shadow component**는 semantic 참조 의무(primitive 직접 참조 fail). typography·spacing·radius·motion은 primitive 직접 참조 허용 (§ 2.4 참조 규칙 표)
21:- **출력 형식 2종**: (a) CSS Custom Properties (`:root`·`[data-theme="dark"]`), (b) `tokens.json` (Style Dictionary 호환 — 빌드 도구 변환 가능)
22:- **다크모드**: 기본 light + dark 2개 테마. semantic 단계에서 분기, primitive·component는 동일
34:| primitive 값 변경 (색상·크기) | **MAJOR** | semantic·component 전반 영향 — 마이그레이션 가이드 필수 |
36:| semantic 토큰 추가 | MINOR | |
37:| semantic 토큰 값 변경 (primitive 참조 교체) | **MAJOR** | UI 시각 변경 가능 |
39:| 컴포넌트 → semantic 매핑 변경 | MINOR | |
47:  - `semantic.light.tokens.json` (semantic — light 테마)
48:  - `semantic.dark.tokens.json` (semantic — dark 테마)
49:  - `component.tokens.json` (테마 무관, semantic 참조)
51:- 빌드 결과 — `dist/tokens/<theme>.css` + `dist/tokens/<theme>.json`
68:color.white·color.black                           (절대값)
69:color.gray.50    ~ color.gray.900                  (10단계)
70:color.blue.50    ~ color.blue.900                  (10단계)
71:color.green.50   ~ color.green.900                 (10단계)
72:color.amber.50   ~ color.amber.900                 (10단계)
73:color.red.50     ~ color.red.900                   (10단계)
86:> `shadow.*`는 **semantic 단계**에서 정의 (§ 6.2 theme-aware). primitive에 두지 않음.
87:> `container.*`는 semantic 단계 (§ 5.3) — primitive `breakpoint.*` + `spacing.*` 참조.
89:### 2.2 semantic (의미)
94:color.surface.background  → light: color.gray.50,  dark: color.gray.900
95:color.text.primary        → light: color.gray.900, dark: color.gray.50
96:color.text.secondary      → light: color.gray.600, dark: color.gray.300
97:color.brand.primary       → color.blue.600 (Preset/Instance override)
98:color.status.success      → color.green.600
99:color.status.warning      → color.amber.500
100:color.status.error        → color.red.600
101:color.status.info         → color.blue.500
107:semantic을 참조하여 **컴포넌트 단위 토큰** 정의. 컴포넌트 구현은 본 토큰만 참조.
110:button.primary.background       → color.brand.primary
111:button.primary.text             → color.text.inverse
112:button.primary.hover.background → color.brand.primary.hover
114:card.background                  → color.surface.elevated
115:card.border                      → color.border.subtle
117:callout.info.background          → color.status.info.subtle
118:callout.warning.background       → color.status.warning.subtle
119:callout.disclaimer.background    → color.surface.subtle
128:| **색상** (`color.*`) | semantic 의무. primitive 직접 참조 시 빌드 fail (다크모드·테마 분기 보장) |
129:| **타이포** (`font.*`, `line.height.*`, `letter.spacing.*`) | semantic(예: `typography.body.default`) 또는 primitive 모두 허용 |
130:| **간격** (`spacing.*`) | primitive 직접 참조 허용 (semantic 간격 토큰 없음) |
132:| **그림자** (`shadow.*`) | semantic 의무. 다크모드 분기 보장 (§ 6.2 정합) |
135:- semantic → primitive 또는 다른 semantic 참조
145:각 hue는 50·100·200·300·400·500·600·700·800·900 (10단계) + 절대값 2종(`color.white`, `color.black`).
149:| `color.white` | 절대값 `#ffffff` — surface.elevated(light) 등에서 사용 |
150:| `color.black` | 절대값 `#000000` — opacity 베이스 |
151:| `color.gray.*` (50~900) | neutral 배경·텍스트·경계 |
152:| `color.blue.*` | 기본 brand 후보 + info |
153:| `color.green.*` | success |
154:| `color.amber.*` | warning |
155:| `color.red.*` | error |
156:| `color.teal·indigo·pink·*` (확장) | preset/instance 확장 시 |
162:Tailwind v3 슬레이트·블루·그린·앰버·레드 톤을 base로 채택. 동일 hue 10단계 — 50(가장 밝음) ~ 900(가장 어두움).
174:### 3.2 semantic 색상 (light/dark 분기)
176:| 토큰 | light | dark |
178:| `color.surface.background` | gray.50 | gray.900 |
179:| `color.surface.elevated` | color.white | gray.800 |
180:| `color.surface.subtle` | gray.100 | gray.800 |
181:| `color.text.primary` | gray.900 | gray.50 |
182:| `color.text.secondary` | gray.600 | gray.300 |
183:| `color.text.disabled` | gray.400 | gray.500 |
184:| `color.text.inverse` | color.white | gray.900 |
185:| `color.border.default` | gray.200 | gray.700 |
186:| `color.border.subtle` | gray.100 | gray.800 |
187:| `color.brand.primary` | blue.600 | blue.400 |
188:| `color.brand.primary.hover` | blue.700 | blue.300 |
189:| `color.brand.secondary` | gray.700 | gray.300 |
190:| `color.status.success` | green.600 | green.400 |
191:| `color.status.success.subtle` | green.50 | green.900 |
192:| `color.status.warning` | amber.500 | amber.400 |
193:| `color.status.warning.subtle` | amber.50 | amber.900 |
194:| `color.status.error` | red.600 | red.400 |
195:| `color.status.error.subtle` | red.50 | red.900 |
196:| `color.status.info` | blue.500 | blue.300 |
197:| `color.status.info.subtle` | blue.50 | blue.900 |
198:| `color.focus.ring` | blue.500 | blue.300 |
199:| `color.overlay.modal` | rgba(0,0,0,0.5) | rgba(0,0,0,0.7) |
200:| `color.overlay.scrim` | rgba(0,0,0,0.3) | rgba(0,0,0,0.5) |
202:> **overlay 예외 규칙**: overlay 그룹의 semantic 토큰은 raw `rgba()` 값을 직접 가질 수 있다 — alpha 채널 표현을 위한 명시 예외. primitive `color.black` + opacity 별도 토큰으로 분리하면 alpha 변형마다 토큰이 늘어 운영 부담 큼. raw rgba는 overlay 그룹(`color.overlay.*`)에서만 허용 (다른 semantic 색상은 primitive alias 의무).
206:- HTML 속성 `data-theme="light" | "dark"`로 분기
207:- `prefers-color-scheme` 자동 감지 + 사용자 명시 override (localStorage)
208:- 기본값 — `light`
270:### 4.4 semantic 타이포 (heading scale)
318:### 5.3 컨테이너·그리드 (semantic)
325:| `grid.columns` | 12 (raw integer — 비-색상 semantic) |
344:### 6.2 shadow (semantic — theme-aware)
346:primitive가 아닌 **semantic 단계**에서 정의 (theme 분기) — primitive theme 무관 원칙 보호.
348:| 토큰 | light | dark (opacity 상향 — DT-04 해소) |
368:        "color": "rgba(0, 0, 0, 0.05)"
421:| 토큰 | 값 (semantic) |
423:| `button.primary.background` | color.brand.primary |
424:| `button.primary.text` | color.text.inverse |
425:| `button.primary.hover.background` | color.brand.primary.hover |
426:| `button.secondary.background` | color.surface.subtle |
427:| `button.secondary.text` | color.text.primary |
439:| `card.background` | color.surface.elevated |
440:| `card.border` | color.border.subtle |
449:| `input.background` | color.surface.elevated |
450:| `input.border` | color.border.default |
451:| `input.border.focus` | color.focus.ring |
452:| `input.text` | color.text.primary |
453:| `input.placeholder` | color.text.secondary |
462:| `callout.info.background` | color.status.info.subtle |
463:| `callout.info.border` | color.status.info |
464:| `callout.info.icon.color` | color.status.info |
465:| `callout.warning.background` | color.status.warning.subtle |
466:| `callout.warning.border` | color.status.warning |
467:| `callout.warning.icon.color` | color.status.warning |
468:| `callout.disclaimer.background` | color.surface.subtle |
469:| `callout.disclaimer.border` | color.border.default |
470:| `callout.disclaimer.text` | color.text.secondary |
478:| `badge.background` | color.surface.subtle |
479:| `badge.text` | color.text.primary |
488:| `link.text` | color.brand.primary |
489:| `link.text.hover` | color.brand.primary.hover |
496:| `table.background` | color.surface.elevated |
497:| `table.header.background` | color.surface.subtle |
498:| `table.header.text` | color.text.primary |
499:| `table.row.background.alt` | color.surface.subtle |
500:| `table.border` | color.border.default |
508:| `accordion.item.background` | color.surface.elevated |
509:| `accordion.item.border` | color.border.default |
513:| `accordion.icon.color` | color.text.secondary |
519:| `tabs.background` | color.surface.background |
520:| `tabs.trigger.text` | color.text.secondary |
521:| `tabs.trigger.text.active` | color.text.primary |
522:| `tabs.trigger.border.active` | color.brand.primary |
529:| `nav.background` | color.surface.background |
530:| `nav.border.bottom` | color.border.subtle |
531:| `nav.link.text` | color.text.primary |
532:| `nav.link.text.hover` | color.brand.primary |
534:| `footer.background` | color.surface.subtle |
535:| `footer.text` | color.text.secondary |
542:| `modal.background` | color.surface.elevated |
543:| `modal.overlay` | color.overlay.modal |
547:| `toast.background.info` | color.status.info.subtle |
548:| `toast.background.success` | color.status.success.subtle |
549:| `toast.background.warning` | color.status.warning.subtle |
550:| `toast.background.error` | color.status.error.subtle |
559:| `avatar.background` | color.surface.subtle |
560:| `avatar.text` | color.text.secondary |
565:| `breadcrumb.text` | color.text.secondary |
566:| `breadcrumb.text.current` | color.text.primary |
567:| `breadcrumb.separator.color` | color.text.disabled |
576:| `cta-cluster.background` | color.brand.primary |
577:| `cta-cluster.text` | color.text.inverse |
586:| `timeline.line.color` | color.border.default |
587:| `timeline.node.color` | color.brand.primary |
590:| `map.background` | color.surface.subtle |
591:| `map.border` | color.border.default |
593:| `embed.background` | color.surface.subtle |
606:  --color-gray-50: #f9fafb;
607:  --color-blue-600: #2563eb;
609:  /* semantic */
610:  --color-surface-background: var(--color-gray-50);
611:  --color-text-primary: var(--color-gray-900);
612:  --color-brand-primary: var(--color-blue-600);
614:  --button-primary-background: var(--color-brand-primary);
617:[data-theme="dark"] {
618:  --color-surface-background: var(--color-gray-900);
619:  --color-text-primary: var(--color-gray-50);
632:├── semantic.light.tokens.json  # semantic — light 테마
633:├── semantic.dark.tokens.json   # semantic — dark 테마
634:└── component.tokens.json       # component (테마 무관, semantic 참조)
641:  "color": {
642:    "white": { "value": "#ffffff", "type": "color" },
644:      "50": { "value": "#f9fafb", "type": "color" },
645:      "900": { "value": "#111827", "type": "color" }
648:      "600": { "value": "#2563eb", "type": "color" }
657:**semantic.light.tokens.json 예시**:
661:  "color": {
663:      "background": { "value": "{color.gray.50}", "type": "color" },
664:      "elevated":   { "value": "{color.white}", "type": "color" }
667:      "primary": { "value": "{color.blue.600}", "type": "color", "description": "BrandTokens.colors.light.primary 매핑" }
679:      "background": { "value": "{color.brand.primary}", "type": "color" },
680:      "text":       { "value": "{color.text.inverse}", "type": "color" },
689:- 토큰 ID — JSON path를 `.`로 join (예: `color.surface.background`)
690:- alias — `{ ... }` 구문, 빌드 시 resolve
691:- `type` 필드 — Style Dictionary v3+ 표준 (`value`·`type` 표기, **DTCG draft의 `$value`·`$type`는 미채택**). 타입 값은 DTCG 카테고리 호환 (color·dimension·fontFamily·fontWeight·duration·cubicBezier·shadow 등)
692:- theme 분기 — light/dark용 semantic 파일 별도. 빌드 시 token set으로 결합 (`StyleDictionary.config({ source: [primitive, semantic.light, component] })`)
698:| `dist/tokens/light.css` | light 테마 CSS Custom Properties (:root) |
699:| `dist/tokens/dark.css` | dark 테마 ([data-theme="dark"]) |
701:| `dist/tokens/light.json` | light 테마 평면화 JSON |
702:| `dist/tokens/dark.json` | dark 테마 평면화 JSON |
713:| `colors` | § 3.2 semantic 색상 전체 — `{ light: ColorTokens, dark: ColorTokens }` 양층 구조. 핵심 키 `colors.light.primary`·`colors.dark.primary`는 각 테마의 `color.brand.primary` 평면화 결과 |
714:| `typography` | § 4.4 semantic 타이포 (typography.heading.h1 등) |
717:| `shadow` | § 6.2 shadow semantic (theme별 분기) |
726:// 단일 테마 색상 평면화 — § 3.2 semantic 색상 전체 round-trip
733:  surface_background: string;
760:// BrandTokens.colors는 light·dark 두 ColorTokens 분리 구조
762:  light: ColorTokens;
763:  dark: ColorTokens;
766:// 참조 표기: BrandTokens.colors.light.primary, BrandTokens.colors.dark.primary (colors.<theme>.<token> 순)
773:  // 모든 § 4.4 semantic typography 토큰 평면화 (required)
777:  none: string;  // "0" 또는 "0px" — § 6.1 `radius.0` round-trip
791:  color: string;
801:// BrandTokens.shadow도 light·dark 양층 구조 (colors와 동일 패턴)
803:  light: ShadowTokens;
804:  dark: ShadowTokens;
808:- **평면화 규칙**: dot path를 underscore로 변환 (예: `color.surface.background` → `surface_background`). 어드민·빌드 도구가 본 규칙으로 평면화 결과 출력
811:### 9.4.1 theme-color 메타 (SEARCH_STANDARDIZATION 정합)
813:빌드 시 light·dark 두 meta 모두 출력:
815:- **light**: `<meta name="theme-color" content="<light-hex>">` — 값은 `BrandTokens.colors.light.primary` 평면화 hex
816:- **dark**: `<meta name="theme-color" content="<dark-hex>" media="(prefers-color-scheme: dark)">` — 값은 `BrandTokens.colors.dark.primary` 평면화 hex
818:미디어 쿼리 미지정 meta가 light 기본값을 의미. 양 theme 모두 출력 의무 — **한쪽만 출력 시 fail** (`SEARCH_STANDARDIZATION.md` § 2.1 Allowed 의무와 정합).
825:Core (data/design-tokens/{primitive,semantic.light,semantic.dark,component}.tokens.json)
827:Preset (presets/<presetSlug>/design-tokens/{primitive,semantic.light,semantic.dark,component}.tokens.json)
829:Instance (instances/<instanceId>/design-tokens/{primitive,semantic.light,semantic.dark,component}.tokens.json)
831:dist/tokens/<theme>.css·json
839:- Preset·Instance는 **semantic 또는 component 토큰**만 override 권장
843:  - Core에 없는 semantic 토큰을 Preset/Instance가 신설 → warning
844:  - 단, **preset/instance 전용 토큰**은 합법 — **`private.*` 네임스페이스** 사용. semantic·component 양쪽 layer 모두 허용 (예: `private.hanui-card.background` 컴포넌트, `private.color.brand.tertiary` semantic). 표기 변환: tokens.json은 dot 객체 hierarchy, CSS 변수명은 dot을 `-`로 치환 + `--` prefix (예: `private.hanui-card.background` → `--private-hanui-card-background`). warning 면제
851:   - 스칼라 (color hex·spacing rem·radius px) — 후순위 값으로 교체
852:   - 객체 (`color.surface.*` 그룹) — deep merge (key 별 재귀)
854:3. **theme별 머지**: light·dark token set은 각각 독립 머지. 한쪽만 override 시 다른 쪽 영향 없음
855:4. **alias 재해석 순서**: 머지 완료 후 alias resolve (한 번에). 중간 단계의 alias resolve 금지
858:   - `private.*` 네임스페이스 외의 신규 component/semantic 토큰 → warning
860:6. **접근성 재검증**: 머지·alias resolve 완료 후 § 11 접근성 검증 자동 재실행. Preset/Instance가 brand 색상 변경 후 본문 텍스트 대비가 WCAG AA 미충족 시 fail
861:7. **순환 참조 검출**: alias resolve 시 DAG 위반 발견 시 fail
878:빌드 시 다음 쌍을 light·dark 두 테마 모두 검증. Preset/Instance가 `color.brand.primary` 등을 변경하면 본 검증 자동 재실행.
882:| 본문 텍스트 | `color.text.primary` / `color.surface.background` | 4.5:1 |
883:| 본문 텍스트 — elevated | `color.text.primary` / `color.surface.elevated` | 4.5:1 |
884:| 본문 텍스트 — subtle | `color.text.primary` / `color.surface.subtle` | 4.5:1 |
885:| 보조 텍스트 | `color.text.secondary` / `color.surface.background` | 4.5:1 |
886:| 역색 텍스트 | `color.text.inverse` / `color.brand.primary` | 4.5:1 |
887:| 버튼 primary 텍스트 | `button.primary.text` / `button.primary.background` | 4.5:1 |
888:| 버튼 secondary 텍스트 | `button.secondary.text` / `button.secondary.background` | 4.5:1 |
889:| 링크 | `link.text` / `color.surface.background` | 4.5:1 |
890:| 링크 hover | `link.text.hover` / `color.surface.background` | 4.5:1 |
891:| 포커스 링 | `color.focus.ring` / `color.surface.background` | 3:1 |
892:| 콜아웃 info 텍스트 | `color.text.primary` / `callout.info.background` | 4.5:1 |
893:| 콜아웃 warning 텍스트 | `color.text.primary` / `callout.warning.background` | 4.5:1 |
894:| 콜아웃 disclaimer 텍스트 | `color.text.secondary` / `callout.disclaimer.background` | 4.5:1 |
895:| 입력 placeholder | `input.placeholder` / `input.background` | 3:1 (UI 구성 요소 기준) |
896:| 입력 focus 테두리 | `input.border.focus` / `color.surface.background` | 3:1 |
900:> ⚠️ `color.border.default`처럼 시각 분리 목적의 일반 border는 WCAG 2.1 의 1.4.11(Non-text Contrast) 비대상 — 검증 카탈로그에서 제외. focus ring·input.border.focus 등 의미 boundary만 검증.
904:- 모든 인터랙티브 요소는 `:focus-visible` 시 `color.focus.ring` 표시
918:| **fail** | 토큰 미정의(체인 단절), 순환 참조, **색상·shadow component에서 primitive 직접 참조** (§ 2.4 — typography·spacing·radius·motion은 허용), **`color.overlay.*` 외 semantic 색상이 raw hex·rgb·hsl 값을 보유** (semantic 색상은 primitive alias 의무, overlay 그룹만 예외 — § 3.2), 접근성 명도 대비 위반(본문 4.5:1·UI 3:1), 출력 파일 생성 실패 |
919:| **warning** | semantic 미사용(고아 토큰), Preset/Instance override가 Core에 없는 토큰 신설(MAJOR 의도일 수 있음 — 경고만), reduced-motion 미구현 |
938:| ~~DT-04~~ | 다크모드 그림자 opacity 값 | v0.2 — § 6.2 shadow를 semantic theme-aware로 이동, light·dark 두 값 명시 |
939:| ~~DT-07~~ | private 네임스페이스 컨벤션 | v0.3 — `private.*` dot 형식 확정. semantic·component 양쪽 layer 허용. CSS 변수명 `--private-*`, tokens.json 객체 키 `private` 하위. slug 형식은 kebab-case (정규식 `^[a-z][a-z0-9-]*[a-z0-9]$`, `CONTENT_STANDARDS.md § 7.1.1` 동일 규약 적용) |
947:| 2026-05-14 | v0.1 | 최초 작성 — 3-tier 토큰 구조(primitive·semantic·component), 3-레이어 override(Core·Preset·Instance), 색상 팔레트 + 다크모드 분기, 타이포(Pretendard 기반)·간격·라운드·그림자·모션, 컴포넌트 토큰 6종(button·card·input·callout·badge·link), 출력 형식 2종(CSS·JSON), 접근성 WCAG AA, 빌드 검증 룰 |
948:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (8개 지적 전건 수용)**: (1) § 5.1 spacing.0~96 잔재 → 0~64 (13단계) 정합, (2) § 9.4 BrandTokens.colors 잔재 정정 — `{ light, dark }` 양층 구조 명시. § 9.2 description 예시도 `colors.light.primary`로, (3) § 9.4.0 ShadowScale 양층화 — `{ light: ShadowTokens, dark: ShadowTokens }`. DTCG ShadowValue 객체 타입 신설, (4) § 9.4.0 RadiusScale에 `none` 필드 추가 — § 6.1 `radius.0` round-trip, (5) § 9.4.1 dark theme-color 한쪽만 출력 시 fail로 통일 (SEARCH_STANDARDIZATION § 2.1 Allowed 의무와 정합), (6) § 10.2 private.* CSS 변수명 변환 규칙 명시 — dot → `-` 치환 + `--` prefix, (7) § 9.2 표기 명확화 — Style Dictionary v3+ `value`·`type` 채택, DTCG draft의 `$value`/`$type` 미채택. 타입 값은 DTCG 카테고리 호환, (8) § 2.1 breakpoint 구분자 정리 `xl.2xl` → `xl·2xl` |
949:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (9개 지적 전건 수용)**: (1) § 4.2 font.size 잔재 "10~96" → "12~72 11단계"로 정합, (2) § 2.1 primitive 목록에서 container 제거 (§ 5.3 semantic). § 5.3 container.max-width를 `breakpoint.xl` alias로 정정. raw 1280px 제거. grid.columns는 raw integer 명시, (3) § 12 fail 룰에 "overlay 외 semantic 색상이 raw hex·rgb·hsl 보유 시 fail" 명시, (4) § 6.2.1 DTCG structured shadow 객체 형식 + Style Dictionary shadow/css transform 변환 규칙 명시, (5) § 9.4.0 ColorTokens 22필드로 확장 — text_disabled·border_subtle·status_*_subtle 4종·overlay_modal·overlay_scrim 추가. §3.2 semantic 색상 전체 round-trip 가능, (6) BrandTokens.colors 구조를 `{ light: ColorTokens, dark: ColorTokens }`로 명확화. 참조 표기 `colors.<theme>.<token>` 순서 통일. § 9.4.1 dark theme-color 값 산출도 같은 형식, (7) **SEARCH_STANDARDIZATION § 2.1 메타 표 cascade** — theme-color Conditional → Allowed(의무) light·dark 두 값 출력으로 정합, (8) § 10.2 `private.*` 적용 범위 — semantic·component 양쪽 layer 모두 허용 명시, (9) DT-07 해소 설명 § 7.1.1 참조 정정 — CONTENT_STANDARDS § 7.1.1 명시 |
950:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 0 요약 fail 조건 정밀화 — § 2.4 색상·shadow만 semantic 의무로 일치. typography·spacing·radius·motion 허용 명시, (2) § 2.1 primitive 목록 완전화 — green·amber 색상 추가, breakpoint·container·border.width·font.weight·line.height·letter.spacing 추가. § 4.2·§ 5.1 표 SoT와 정합 (font.size 11단계·spacing 13단계), (3) § 2.1 font.size 범위 12~72로 정합, (4) § 2.1 spacing 범위 0~64로 정합, (5) § 3.2 overlay 그룹 raw rgba 예외 규칙 명시 — `color.overlay.*`만 직접 rgba 허용. 다른 semantic은 primitive alias 의무 유지, (6) § 9.4.0 BrandTokens 세부 타입 정의 — ColorTokens(15필드)·TypographyTokens·RadiusScale·ShadowScale + 평면화 규칙(dot path → underscore), (7) § 9.4.1 dark theme-color 산출 명시 — dark resolve 결과 + media 쿼리 별도. 미디어 미지정이 light 기본값, (8) DT-07 해소 — `private.*` dot 컨벤션 확정. § 13.1 해소 표에 추가 |
951:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 1.2 SoT 4파일 구조 통일 (`primitive`·`semantic.light`·`semantic.dark`·`component` tokens.json) — 단일 core.tokens.json 잔재 제거. § 10.1 흐름도 4파일 머지 명시, (2) § 0·§ 12 fail 조건 좁힘 — 색상·shadow component에서 primitive 직접 참조만 fail. typography·spacing·radius·motion 허용, (3) § 2.1 primitive 목록 shadow 잔재 제거 — shadow는 semantic 단계 명시. font.weight·line.height·letter.spacing·border.width 추가, (4) modal.overlay 직접 hex → semantic `color.overlay.modal` 분리. `color.overlay.scrim`도 신설, (5) § 9.4 personaMode enum 정규화 규칙 명시 — PascalCase → lowercase preset slug, (6) § 9.4 BrandTokens.spacing — primitive scale 배수 override(tight 0.85·standard 1.0·spacious 1.25) + MAJOR 변경 명시, (7) **SEARCH_STANDARDIZATION SS-05 해소 cascade** — § 9.4.1 theme-color light/dark 출력이 SoT임을 SEARCH_STANDARDIZATION § 9.1에 기록, (8) `private:` prefix → `private.*` dot 네임스페이스로 정정 — JSON path·CSS 변수명·tokens.json 모두 동일 형식, (9) § 11.2 검증 색상 쌍에서 `color.border.default` 제거 — WCAG 1.4.11 비대상(일반 시각 분리 border). 30개 쌍으로 정합, (10) § 11.3·§ 11.4 헤딩 번호 중복 정정 |
952:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (10개 지적 전건 수용)**: (1) § 2.4 참조 규칙 정밀화 — color·shadow는 semantic 의무, spacing·radius·font·motion은 primitive 허용. component→component 금지, (2) § 3.1·§ 3.2 `color.white`·`color.black` primitive 절대값 추가. semantic `white` 잔재 정정, (3) § 9.4 DATA_MODEL C-07 BrandTokens 매핑 표 + § 9.4.1 theme-color SEARCH_STANDARDIZATION 정합, (4) § 9.2 Style Dictionary v3+ 표준 포맷으로 재작성 — primitive/semantic.light/semantic.dark/component 파일 분리, DTCG type 필드 명시, (5) § 6.2 shadow를 semantic theme-aware로 이동 — primitive 무관 원칙 보호. light·dark opacity 명시(DT-04 해소), (6) § 10.3 머지 알고리즘 강화 — 타입별 머지·theme별 머지·alias 재해석 순서·unknown key 처리(`private:` prefix)·접근성 재검증·순환 참조 검출, (7) § 11.2 자동 검증 색상 쌍 카탈로그 16개 × 2테마 = 32개 명시. Preset/Instance brand 변경 시 재검증 자동, (8) § 4.1 한국어 폰트 — Pretendard 우선 + § 4.1.1 웹폰트 로딩 정책(font-display: swap·preload·OFL 라이선스 검토 완료) + § 4.1.2 letter-spacing 한국어 본문 적용 제한, (9) § 8.7~§ 8.14 컴포넌트 토큰 카탈로그 확장 8종(table·accordion·tabs·nav/header/footer·modal·toast·avatar/breadcrumb·CTA cluster·timeline/map/embed), (10) § 13 미결정 정리 — § 3.4 primitive hex 카탈로그(DT-02 해소) + § 6.2 dark shadow(DT-04 해소). DT-06·DT-07 신설 |

 succeeded in 916ms:
1:# 공개 사이트 렌더 minimal plan (v0.2·draft·2026-05-18)
3:> **상태**: **v0.2 (draft)** — Codex 자동 비평 cycle 1 (21 findings: 6 blocking + 11 major + 4 minor) 전건 수용 patch. ADMIN_UI_SKELETON code v1.0 + LOCATION_LEGAL code v1.0 acceptance 직후 진입하는 첫 공개 사이트 plan. 본 plan 은 운영자(어드민)가 입력·저장한 콘텐츠를 실 클라이언트가 보는 공개 사이트로 렌더링 하는 minimal 흐름을 정의한다.
5:본 문서는 `apps/web` 안에 **`(site)` route group**(공개 사이트)을 신설하고, 어드민 route 도 동시에 **`/admin/<instanceSlug>/...`** prefix 로 격상해 path namespace 충돌을 해소한다. 어드민에서 저장한 6 entity (ClinicProfile · LocationProfile · DoctorProfile · TreatmentPage · Article · LegalDocument)를 minimal 디자인 + 정합 JSON-LD + SEARCH_STANDARDIZATION v1.1 정합 robots/sitemap 과 함께 렌더한다.
7:> **scope limit (PSR-INTRO-01)**: 본 plan 은 **SSR + Next ISR** 만 다룬다. static export to Git · 도메인 매핑 (subdomain / custom domain) · CDN cache 정책 · Open Graph 이미지 동적 생성 · dark mode UI toggle 등은 M0 v1.0 본 구현 / M1 cascade. v0.1 은 `/<instanceSlug>/...` path-based routing 으로 **개발자가 접근 가능한 단계** 까지.
9:## SoT
11:- `docs/core/PAGE_TYPES.md` — 필수 14종 페이지 (P-001~P-014) · M0 게이트 #1 의 10페이지: **P-001·P-002·P-003·P-004·P-005·P-006·P-012·P-013·P-014 + P-010 1샘플** (cycle1 PSR-01 정정).
12:- `docs/core/SCHEMA_MAPPING.md` — 페이지별 graph 구성 (§ 2.5 공통 entity 출력 정책 + § 3 페이지 그래프 + § 1.2 `@id` 네이밍 규약).
13:- `docs/core/SEARCH_STANDARDIZATION.md` — § 2 메타 태그 표준 (theme-color · og:type 매핑) · § 3 robots.txt (aiCrawlerPolicy + 4계열 user-agent + disallowTraining starter) · § 4.3 sitemap changefreq/priority · § 5 canonical resolve.
14:- `docs/core/CONTENT_STANDARDS.md` v1.3 — answer-first AST · § 7.1.1.1 LegalDocument 면제.
15:- `docs/core/DATA_MODEL.md` v0.9 — C-01 ClinicProfile · C-02 DoctorProfile · C-03 TreatmentPage · C-04 Article · C-16 LegalDocument · C-21 LocationProfile · aiCrawlerPolicy.
16:- `docs/core/DESIGN_TOKENS.md` v1.0 — 3-tier 토큰 (primitive·semantic·component) · § 3.2 light/dark semantic 22 · § 3.3 `data-theme="light"|"dark"` 분기 · semantic naming SoT (`color.surface.background` 등).
17:- `docs/admin/ARCHITECTURE.md` v0.7 § 3.11 완료 게이트 #1 — "사이트 측 페이지 타입 9종 + Article 1샘플 빌드 (총 10 페이지)".
18:- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — ClinicProfile 3계약 + LegalDocument 5종 + primaryCtas + businessHours · LegalDocument DB CHECK `status='draft' AND risk_level='Low' AND published_at IS NULL` (LL-SCHEMA-03·06).
21:  - `apps/web/src/app/(admin)/[instanceSlug]/...` (현 어드민 — cycle1 PSR-02 patch 후 `(admin)/admin/[instanceSlug]/...` 로 prefix 격상)
24:  - `packages/core-content/src/schema.ts` v0.3 (Drizzle SoT — 실 column 명: `title`/`body_markdown`)
26:  - `apps/web/src/app/sign-in/...` (consume route — redirect target `/<firstSlug>` → `/admin/<firstSlug>` 로 patch · PSR-CASCADE-01)
28:## 1. 목적과 범위
30:### 1.1 목적
34:- 노출 의도 일직선: SEARCH_STANDARDIZATION 정합 robots/sitemap/canonical · schema.org JSON-LD · Next.js metadata · theme-color · OpenGraph · 자체 JSON-LD rule checker 같은 검색·AI 인용 신호를 v0.1 단계부터 표준 정합으로 출력.
36:### 1.2 범위 (포함) — cycle1 PSR-01·02·06·11 정정
41:| **어드민 URL prefix `/admin/<instanceSlug>/...`** (cycle1 PSR-02 격상) | 공개 path namespace 와 분리. acceptance precondition. 코드 cascade (PSR-CASCADE-01) 동시 적용 |
42:| **10페이지 minimal** (cycle1 PSR-01 정정) | P-001 `/` · P-002 `/about` · P-003 `/doctors` · P-004 `/doctors/[slug]` · P-005 `/treatments` · P-006 `/treatments/[slug]` · P-010 `/insights/[category]/[slug]` (1샘플) · P-012 `/contact` · P-013 `/legal/[type]` (5종) · P-014 `/locations/[slug]` (main 1건) |
43:| **P-009 Articles List · P-011 FAQ · P-007/008 Conditions** | M0 미합류 — 별 plan (FAQ 는 EAT_CONTENT plan v0.1) |
44:| `app_public_reader` PostgreSQL role + per-table SELECT policy (cycle1 PSR-05·15 정정) | 신규 D0011 migration 안 instance lookup policy + 6 content table policy 명시 |
46:| 페이지 컴포넌트 minimal | Hero · About · DoctorCard · TreatmentCard · ArticleBody · ContactCard · LegalRenderer · LocationCard · Footer · Header · BreadcrumbList |
47:| JSON-LD 통합 graph + 자체 rule checker (cycle1 PSR-07·17 정정) | SCHEMA_MAPPING § 2.5 + § 3 정합. 페이지당 단일 `<script>`. 자체 JSON parse + 필수 entity 검증 (Google validator 는 manual QA marker) |
48:| Next metadata API + theme-color + og:type 매핑 (cycle1 PSR-10 정정) | title · description · canonical · OpenGraph · Twitter · robots · `themeColor` 2값 (light/dark) · og:type P-004 `profile`, P-006/P-010 `article`, 기타 `website` |
49:| sitemap.xml · robots.txt (cycle1 PSR-04·09 정정) | per-instance · SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` required + § 4.3 changefreq/priority SoT 정합 |
50:| 디자인 토큰 통합 + light/dark CSS vars 출력 (cycle1 PSR-13·14 정정) | Tailwind v3.4 + DESIGN_TOKENS v1.0 semantic 22 alias 표. CSS custom property 는 light/dark 둘 다 출력. UI toggle 만 defer |
51:| status filter (cycle1 PSR-06·16 정정) | TreatmentPage·Article: `status='published' AND published_at <= now()`. **LegalDocument: v0.1 단계 noindex + 어드민 인증 필요 preview 만** (draft 공개 노출 차단 — 법무 게이트 우회 회피) |
53:| Markdown sanitizer SSR 정합 (cycle1 PSR-19·20 정정) | `sanitize-html` (SSR 호환) + 외부 링크 `rel="nofollow noopener noreferrer"` |
54:| env / pgbouncer / role membership cascade (cycle1 PSR-21 정정) | `WEB_PUBLIC_DATABASE_URL` env · `.env.example` · pgbouncer userlist · `app_public_reader NOLOGIN MEMBERSHIP` 등 acceptance checklist |
56:### 1.3 비범위 (defer)
60:| static export to Git (build-time) | M0 v1.0 본 구현 — apps/worker + Git client | PSR-DEFER-01 |
61:| 도메인 매핑 (subdomain `<slug>.glitzy.co` 또는 custom domain) | M0 v1.0 본 구현 | PSR-DEFER-02 |
62:| dark mode UI toggle | M1 Phase Alpha — CSS vars 는 v0.1 부터 두 테마 출력 (DESIGN_TOKENS § 3.3) · PSR-14 정합 | PSR-DEFER-03 |
63:| CDN cache 정책 (Cloudflare/Vercel ISR fine-tune) | M0 v1.0 본 구현 | PSR-DEFER-04 |
64:| 검색 콘솔 sitemap submission 자동화 | M1 Phase Alpha | PSR-DEFER-05 |
65:| 다국어 (`/<lang>/<instanceSlug>/...`) | M3 다국어 cascade | PSR-DEFER-06 |
66:| 사용자 댓글·리뷰·공유 (인터랙티브 기능) | 별 plan (Inquiry · Review) | PSR-DEFER-07 |
67:| draft preview token (어드민 세션 외 비공개 미리보기) | M1 Phase Alpha | PSR-DEFER-08 |
68:| 페이지별 OG 이미지 동적 자동 생성 | M1 Phase Alpha | PSR-DEFER-09 |
69:| AI 크롤러 인증 (Cloudflare AI Audit · access log per-crawler) | M0 v1.0 본 구현 (provider gate) | PSR-DEFER-10 |
70:| P-009 Articles List · P-011 FAQ · P-007/008 Conditions | 별 plan (EAT_CONTENT plan v0.1 안 FAQ · 별도 plan Conditions) | PSR-DEFER-11 |
71:| 선택 7종 (P-101~P-107) | 별 plan · Add-on Feature | PSR-DEFER-12 |
72:| LegalDocument 공개 노출 (status=published) | LL-DEFER-01 (compliance-assistant + ComplianceRecord legalCounsel 합류) | PSR-DEFER-13 (LL-DEFER-01 alias) |
73:| Google Rich Results Test / schema.org validator 자동 게이트 | manual QA marker · LOCAL_PASS 는 자체 rule checker (cycle1 PSR-17) | PSR-DEFER-14 |
74:| Article URL `/insights/[category]/[slug]` 의 category 운영 추가 (현재 C-04 article.category 없음) | EAT_CONTENT plan v0.1 또는 Article schema cascade · v0.1 은 단일 fallback category `"general"` | PSR-DEFER-15 |
76:## 2. 라우팅 결정
78:### 2.1 route group 구조 (PSR-ROUTE-01) — cycle1 PSR-02·03 정정
83:├─ (admin)/
84:│  └─ admin/                             -- cycle1 PSR-02 patch: `/admin` prefix 격상
88:│     ├─ layout.tsx                      -- fragment only (NO <html>/<body> · cycle1 PSR-03)
89:│     ├─ page.tsx                        -- P-001 Home
90:│     ├─ about/page.tsx                  -- P-002 About
92:│     │  ├─ page.tsx                     -- P-003 Doctors List
93:│     │  └─ [slug]/page.tsx              -- P-004 Doctor Profile
95:│     │  ├─ page.tsx                     -- P-005 Treatments List
96:│     │  └─ [slug]/page.tsx              -- P-006 Treatment Detail
99:│     │     └─ [slug]/page.tsx           -- P-010 Article Detail (1샘플 · category=general v0.1)
100:│     ├─ contact/page.tsx                -- P-012 Contact
101:│     ├─ legal/[type]/page.tsx           -- P-013 Legal/Policy (5 closed types) · noindex v0.1
103:│     │  └─ [slug]/page.tsx              -- P-014 Location Detail (main 1건 v0.1)
104:│     ├─ sitemap.xml/route.ts            -- per-instance sitemap
105:│     ├─ robots.txt/route.ts             -- per-instance robots
107:├─ sign-in/...                           -- (변경: consume redirect target `/admin/<slug>` · PSR-CASCADE-01)
115:- (PSR-ROUTE-02 · cycle1 PSR-02 patch) 어드민 URL 격상 `/<instanceSlug>/...` → `/admin/<instanceSlug>/...`. ADMIN_UI_SKELETON code v1.0 의 다음 코드가 cascade 영향 (acceptance precondition):
116:  - `apps/web/src/app/(admin)/[instanceSlug]/...` → `apps/web/src/app/(admin)/admin/[instanceSlug]/...` 디렉토리 이동
117:  - `apps/web/src/app/sign-in/consume/route.ts` 의 redirect target `/<firstSlug>` → `/admin/<firstSlug>` (firstActiveMembershipResolver 결과)
119:  - `apps/web/src/components/forms/{ClinicProfileForm, DoctorProfileForm, ...}` 안 `revalidatePath('/${instanceSlug}/...')` 호출 → `'/admin/${instanceSlug}/...'` 로 patch (LOCATION_LEGAL code v1.1 cascade)
120:  - `apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts` 의 `revalidatePath` 2 곳
122:  - 시나리오: 어드민 진입 시 `/admin/<slug>` 로 자동 redirect. 공개 site `/<slug>` 는 별 응답
123:- (PSR-ROUTE-03 · cycle1 PSR-03 patch) site layout 은 fragment 만 — `<html>`/`<body>` 중복 출력 금지. root layout 의 `<html lang="ko-KR">` SoT 유지. site layout 안 클래스/테마 처리는 `<body>` 의 추가 className 으로 root layout 이 segment-aware 분기 — 또는 별 wrapper `<div data-theme="light" data-site>` 구조 채택.
124:- (PSR-ROUTE-04) path-based routing 결정 — v0.1 단계 `/<instanceSlug>/<page>`. 도메인 매핑 합류 시 (PSR-DEFER-02) middleware 가 host header → instanceSlug rewrite.
126:## 3. 데이터 접근 결정
128:### 3.1 D0011 — `app_public_reader` role + per-table policy (PSR-DATA-01) — cycle1 PSR-05·15 정정
131:-- packages/db/migrations/D0011_public_reader.sql (신규)
133:-- cycle1 PSR-05 patch: NOLOGIN 으로 생성 후 별도 application user (예: app_public_user)
134:-- 가 MEMBERSHIP 으로 SET ROLE. login user 자체 는 운영 환경 별 secret cascade.
140:-- cycle1 PSR-05 patch: instance slug resolve 전용 policy.
145:CREATE POLICY public_reader_instance_select
151:-- cycle1 PSR-15 patch: 6 content table 별 per-table policy 명시.
159:CREATE POLICY public_reader_clinic_profile_select
163:CREATE POLICY public_reader_location_profile_select
167:CREATE POLICY public_reader_doctor_profile_select
174:CREATE POLICY public_reader_treatment_page_select
178:    AND status = 'published'
179:    AND published_at IS NOT NULL
180:    AND published_at <= now()
183:CREATE POLICY public_reader_article_select
187:    AND status = 'published'
188:    AND published_at IS NOT NULL
189:    AND published_at <= now()
192:-- cycle1 PSR-06·16 patch: LegalDocument 는 v0.1 공개 렌더 차단.
193:-- DB CHECK 가 status='draft' 만 허용하므로 published row 미존재. SELECT 자체 차단.
195:-- 본 policy 는 application 단 status='published' 만 통과 — DB CHECK 와 정합.
196:CREATE POLICY public_reader_legal_document_select
200:    AND status = 'published'
205:- (PSR-DATA-02 · cycle1 PSR-05) `app_public_reader` LOGIN — v0.1 단순화. production 단 NOLOGIN + MEMBERSHIP 분리 marker (PSR-DEFER-16 신설).
206:- (PSR-DATA-03) 모든 공개 page handler 가 `withPublicTenantTransaction({ instanceSlug })` 헬퍼 사용. 흐름:
211:- (PSR-DATA-04) `app_public_reader` 는 audit_event INSERT 권한 없음 — 공개 페이지 access log 는 별도 (CDN / Vercel analytics · PSR-DEFER-10).
212:- (PSR-DATA-05 · cycle1 PSR-21) env cascade:
215:  - Spike A pgbouncer userlist 에 `app_public_reader` 추가 (PSR-CASCADE-05)
219:### 3.2 status filter — cycle1 PSR-06·16 정정 (PSR-DATA-06)
223:| Entity | RLS USING (D0011) | 의미 |
228:| `treatment_page` | `status = 'published' AND published_at <= now()` | publish 게이트 + 미래 발행 제외 |
230:| `legal_document` | `status = 'published'` | **v0.1 단계 published row 0개 — 공개 렌더 차단** (DB CHECK 가 draft 만 허용 · LL-SCHEMA-03) |
232:**결정 (cycle1 PSR-06)**:
233:- (PSR-DATA-07) LegalDocument 의 `/legal/[type]` 라우트 는 v0.1 응답:
236:- 어드민 세션 보유 시 (별 별 helper, app_tenant_user) `?preview=true` query 로 draft 미리보기 가능 — v0.1 SCOPE 외, PSR-DEFER-08 합류.
237:- LegalDocument 공개 노출은 **LL-DEFER-01 (compliance-assistant + ComplianceRecord legalCounsel 합류) 시점** 까지 차단. PSR-DEFER-13 = LL-DEFER-01 alias.
239:### 3.3 not-found · 빈 페이지 (PSR-DATA-08)
243:- `treatment_page[slug]` 매칭 0행 또는 status != published → `notFound()`
248:## 4. 페이지 컴포넌트 결정
250:### 4.1 root layout 책임 분리 (PSR-COMP-01) — cycle1 PSR-03 정정
252:- `apps/web/src/app/layout.tsx` (root · 변경 없음) — `<html lang="ko-KR" data-theme="light">` + `<body className="bg-canvas text-fg-default">`. **모든 segment 가 root layout 의 html/body 공유**.
264:      <SiteFooter initial={initial} />
271:- (PSR-COMP-02 · cycle1 PSR-03) site layout 의 `<html>`/`<body>` 미반환. root layout 이 SoT. `<html lang="ko-KR">` 는 root layout 안.
272:- (PSR-COMP-03) Header: ClinicProfile.name + 네비 (Home · About · Doctors · Treatments · Contact · Locations · CTA primaryCtas[0]). Footer: 주소·전화·진료시간·법적 페이지 링크.
273:- (PSR-COMP-04) `loadSiteInitial` 가 layout 안에서 한 번 SELECT — Header/Footer 가 같은 데이터 사용. 페이지 안 별도 SELECT 는 entity 별 추가 데이터만.
275:### 4.2 DB → Core contract field mapping (PSR-COMP-05) — cycle1 PSR-12 정정
279:| Entity | Drizzle column (실 DB · packages/core-content/src/schema.ts) | Core contract field (DATA_MODEL) | 사용처 (페이지) |
281:| ClinicProfile | `name` | C-01 `name` | Hero/Header/Footer |
288:| LocationProfile | `street_address` · `address_locality` · `address_region` · `postal_code` | C-21 address 필드 | Contact/Location address |
289:| LocationProfile | `phone` | C-21 `telephone` | Contact/Footer |
290:| LocationProfile | `email` | C-21 `email` | Contact/Footer |
291:| LocationProfile | `metadata.businessHours` (CT-02 SoT) | C-21 `businessHours` | Contact 7요일 표 |
296:| **TreatmentPage** | `title` (DB) | **DATA_MODEL C-03 `name` (contract)** — Drizzle 차이 marker | Treatment heading |
297:| TreatmentPage | `summary` | C-03 `summary` | Card snippet + meta description |
298:| TreatmentPage | `body_markdown` | C-03 `bodyMarkdown` (contract `body`) | ArticleBody render |
299:| TreatmentPage | `hero_image_url` | C-03 `heroImageUrl` | Hero image · OG fallback |
300:| TreatmentPage | `published_at` | C-03 `publishedAt` (== `dateModified` v0.1) | sitemap lastmod · Article meta |
301:| **Article** | `title` (DB) | **DATA_MODEL C-04 `headline` (contract)** — Drizzle 차이 marker | Article heading |
302:| Article | `summary` | C-04 `summary` | Card · meta description |
303:| Article | `body_markdown` | C-04 `bodyMarkdown` (contract `body`) | ArticleBody render |
304:| Article | `hero_image_url` | C-04 `heroImageUrl` | Hero · OG |
305:| Article | `published_at` | C-04 `datePublished` / `dateModified` v0.1 | sitemap lastmod |
306:| Article | `author_doctor_id` | C-04 `author` ref to Doctor | Article hero · JSON-LD |
307:| LegalDocument | `title` | C-16 `title` | Legal heading (v0.1 단계 노출 X) |
308:| LegalDocument | `body` | C-16 `body` (Markdown rendered) | Legal body |
309:| LegalDocument | `document_type` | C-16 `documentType` | Routing key |
310:| LegalDocument | `effective_date` | C-16 `effectiveDate` | Legal meta |
313:- (PSR-COMP-06) public renderer 는 **Drizzle column 명을 직접 사용** + 컴포넌트 prop 으로 넘길 때 contract semantic name 사용 (예: `<TreatmentHero title={row.title}>` 의 prop 명은 `name` 으로 — DATA_MODEL contract 일관). renderer 코드 안에 mapping function `normalizeTreatment(row)` / `normalizeArticle(row)` 두기.
314:- (PSR-COMP-07) `apps/web/src/lib/db-projection.ts` 신규 — entity 별 raw DB row → normalized projection 변환. JSON-LD 생성기 도 normalized projection 사용.
316:### 4.3 페이지별 컴포넌트 (PSR-COMP-08)
320:| P-001 Home | `<Hero>` (slogan/description) · `<DoctorsTeaser>` (3명) · `<TreatmentsTeaser>` (3건) · `<ContactCard>` | ClinicProfile + LocationMain + DoctorProfile (active LIMIT 3 ORDER BY displayOrder ASC) + TreatmentPage (published LIMIT 3 ORDER BY publishedAt DESC) |
321:| P-002 About | `<ArticleBody markdown={clinic.long_description}>` · `<FoundingInfo>` | ClinicProfile |
322:| P-003 Doctors List | `<DoctorCard>` grid | DoctorProfile (active ORDER BY displayOrder ASC, id ASC) |
323:| P-004 Doctor Profile | `<DoctorHero>` · `<ArticleBody markdown={doctor.bio}>` · `<RelatedTreatments>` · `<RelatedArticles>` | DoctorProfile + 본인 author Articles |
324:| P-005 Treatments List | `<TreatmentCard>` grid | TreatmentPage (RLS 자동 published only ORDER BY publishedAt DESC) |
325:| P-006 Treatment Detail | `<TreatmentHero>` · `<ArticleBody markdown={treatment.body_markdown}>` · `<TreatmentSummary>` · `<ContactCta>` | TreatmentPage |
326:| P-010 Article Detail (1샘플) | `<ArticleHero>` (title·summary·publishedAt·author) · `<ArticleBody markdown={article.body_markdown}>` | Article + author Doctor |
327:| P-012 Contact | `<ContactHero>` · `<BusinessHoursTable>` (CT-02 SoT 형식 — 7요일 + 점심 + 특수 휴진) · `<ReservationChannels>` (primaryCtas[]) | LocationMain + ClinicProfile.primary_ctas |
328:| P-013 Legal/Policy `/legal/[type]` | (v0.1 항상 404 — DB CHECK 가 draft 만 허용 + RLS published 만 SELECT) | (none — defer) |
329:| P-014 Location Detail `/locations/[slug]` | `<LocationHero>` · `<LocationAddress>` · `<BusinessHoursTable>` · `<ReservationChannels>` · `<DirectionsAndParking>` (metadata 안 info v0.1 fallback 미입력) | LocationProfile (slug='main' v0.1) |
331:### 4.4 ArticleBody (Markdown → HTML) (PSR-COMP-09) — cycle1 PSR-19·20 정정
333:- `apps/web/src/lib/markdown.ts` 신설 — SSR 호환 sanitizer:
334:  - 채택: **`sanitize-html`** (SSR 호환 · 의존성 작음) 또는 `rehype-sanitize` (unified pipeline · 더 표준)
335:  - v0.1 결정: `sanitize-html` (단순함). 향후 EAT_CONTENT plan 안 FAQ 도 같은 컴포넌트 재사용 시 `rehype-sanitize` 로 전환 marker (PSR-DEFER-17).
339:- LegalDocument 본문 (CONTENT_STANDARDS § 7.1.1.1 면제) 도 동일 컴포넌트 사용 — answer-first AST · 표현 검사 미적용은 어드민 저장 단계의 결정이지 렌더 단계와 무관.
341:### 4.5 디자인 토큰 통합 (PSR-COMP-10) — cycle1 PSR-13·14 정정
343:`apps/web/tailwind.config.ts` v0.2 patch — DESIGN_TOKENS v1.0 § 3.2 semantic 22 정합 alias 표:
345:| Tailwind class | semantic token (DESIGN_TOKENS SoT) | CSS custom property (v0.1 신설) |
372:- (PSR-COMP-11 · cycle1 PSR-13) Tailwind alias 는 semantic 22 round-trip 보장 — `bg-canvas` ↔ `color.surface.background` ↔ `--color-surface-background`. 본 표가 SoT.
373:- (PSR-COMP-12 · cycle1 PSR-14) light/dark CSS vars 둘 다 출력. `apps/web/src/styles/globals.css`:
376::root, [data-theme="light"] {
381:[data-theme="dark"] {
388:  - root layout 안 `<html data-theme="light">` 고정 v0.1. UI toggle 만 defer (PSR-DEFER-03).
391:## 5. SEO / AEO / GEO 결정
393:### 5.1 Next metadata API (PSR-SEO-01) — cycle1 PSR-10 정정
399:  title: "<page-specific> | <clinic.name>",  // P-001 default = `${clinic.name} | ${clinic.slogan ?? clinic.description}`
404:    type: <page-specific>,        // P-001/P-002/P-003/P-005/P-012/P-014 = "website" · P-004 = "profile" · P-006 = "article" · P-010 = "article" · P-013 = "website" (v0.1 미노출)
411:  robots: {
412:    index: <page-specific>,        // P-013 = false (v0.1 차단), 그 외 = true. preview/staging 환경은 전 페이지 false (env `WEB_NOINDEX=true`)
415:  themeColor: [
423:- (PSR-SEO-02 · cycle1 PSR-10) `themeColor` 2값 출력 — DESIGN_TOKENS § 3.2 의 `color.surface.background` 토큰 (light/dark).
424:- (PSR-SEO-03 · cycle1 PSR-10) `og:type` 매핑 — P-004 `profile` · P-006 `article` · P-010 `article` · 그 외 `website`.
425:- (PSR-SEO-04) canonical v0.1: `https://<host>/<instanceSlug><path>` path-based. M0 v1.0 도메인 매핑 합류 시 entity continuity migration (PSR-CASCADE-02 참조).
426:- (PSR-SEO-05) title 패턴: `<page-specific> | <clinic.name>`. P-001 은 fallback `clinic.slogan ?? clinic.description`.
427:- (PSR-SEO-06) description: 페이지 entity 의 `description`/`summary` 우선. 부재 시 clinic.description fallback. 50~160자 강제.
429:### 5.2 sitemap.xml — cycle1 PSR-09 정정 (PSR-SEO-07)
431:- `apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts` — Next Route Handler.
437:| P-001 Home | weekly | 1.0 |
438:| P-002 About | monthly | 0.8 |
439:| P-003 Doctors List | monthly | 0.7 |
440:| P-004 Doctor Profile | monthly | 0.7 |
441:| P-005 Treatments List | monthly | 0.8 |
442:| P-006 Treatment Detail | monthly | 0.8 |
443:| P-010 Article Detail | monthly | 0.5 |
444:| P-012 Contact | yearly | 0.6 |
445:| P-013 Legal | yearly | 0.3 (v0.1 단계 sitemap 에서 제외 — noindex) |
446:| P-014 Location Detail | monthly | 0.7 |
449:  - Article (P-010): `Article.dateModified` 우선. C-04 에 별도 `dateModified` 컬럼 없음 v0.1 — `published_at` 사용 (M1 cascade).
450:  - Treatment (P-006): C-03 명시 `dateModified` 없음 v0.1 — `published_at` fallback.
451:  - ClinicProfile/Location: `updated_at` (DATA_MODEL § 2.2 `@updatedAt`).
453:- M0 v1.0 합류 시 static sitemap.xml 도 export.
455:### 5.3 robots.txt — cycle1 PSR-04 정정 (PSR-SEO-08)
457:- `apps/web/src/app/(site)/[instanceSlug]/robots.txt/route.ts` — Next Route Handler.
460:  - § 3.2: `aiCrawlerPolicy` enum **required** (`disallowTraining` / `allowAll` / `allowApprovedOnly` / `custom`) — 미설정 시 빌드 fail.
464:- (PSR-SEO-09 · cycle1 PSR-04) v0.1 단계 ClinicProfile.metadata.aiCrawlerPolicy 컬럼 부재 — InstanceManifest 합류 (M0 v1.0 cascade · PSR-DEFER-10) 전까지는 fixed `disallowTraining` starter:
470:# Disallow AI training crawlers (DATA_MODEL.md aiCrawlerPolicy=disallowTraining starter)
498:# Allow answer/search crawlers (정책 정합)
511:# Naver
515:Sitemap: https://<host>/<instanceSlug>/sitemap.xml
518:- (PSR-SEO-10) M0 v1.0 InstanceManifest.aiCrawlerPolicy 합류 시 (PSR-DEFER-10) row-driven 출력 — `allowAll` 의 경우 법무 승인 필드 3종 verify after select. SEARCH_STANDARDIZATION § 3.3.1 룰 적용.
520:### 5.4 JSON-LD 통합 graph (PSR-SEO-11) — cycle1 PSR-07·08·17 정정
523:- 구조: `{ "@context": "https://schema.org", "@graph": [...] }` (SCHEMA_MAPPING § 1.1 정합).
526:| 페이지 | graph entities (cycle1 PSR-07 정정) |
528:| P-001 Home | `[풀] Organization` · `[풀] MedicalClinic`(`#clinic` 본원) · `[풀] WebSite` · `[풀] WebPage` |
529:| P-002 About | `[풀] Organization` · `[풀] MedicalClinic`(본원) · `[풀] WebPage` · `[풀] BreadcrumbList` · `WebSite` 참조 (`isPartOf`) |
530:| P-003 Doctors List | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] ItemList`(Physician refs) |
531:| P-004 Doctor Profile | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] Physician` · `[풀] WebPage` · `[풀] BreadcrumbList` |
532:| P-005 Treatments List | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] ItemList`(MedicalProcedure refs) |
533:| P-006 Treatment Detail | `[풀] Organization` · `[풀] MedicalClinic`(본원) · `[풀] MedicalProcedure` · `[풀] WebPage` · `[풀] BreadcrumbList` |
534:| P-010 Article Detail | `[풀] Organization` · `[참조] MedicalClinic` · `[풀] Article` · `[풀] WebPage` · `[풀] BreadcrumbList` |
535:| P-012 Contact | `[풀] Organization` · `[풀] MedicalClinic`(본원) · `[풀] WebPage` · `[풀] BreadcrumbList` (cycle1 PSR-07: ContactPage 삭제 · SoT 는 WebPage + MedicalClinic 풀) |
536:| P-013 Legal/Policy | (v0.1 단계 미노출 — graph 출력 없음) · 정상 노출 시 `[풀] Organization` · `[참조] MedicalClinic` · `[풀] WebPage` · `[풀] BreadcrumbList` |
537:| P-014 Location Detail | `[풀] Organization` · `[풀] MedicalClinic`(`#clinic` 단지점 main 의 entity @id 그대로 — SCHEMA_MAPPING § 1.4 정합) · `[풀] WebPage` · `[풀] BreadcrumbList` |
540:- (PSR-SEO-12 · cycle1 PSR-08) v0.1 `@id` path-based 패턴 — `https://<host>/<instanceSlug>/#organization` · `/<instanceSlug>/#clinic` · `/<instanceSlug>/doctors/<slug>#physician` 등. SCHEMA_MAPPING § 1.2 SoT 의 `https://{domain}/#organization` 패턴은 도메인 매핑 후 (M0 v1.0) 적용. v0.1 path-based 변형의 entity continuity 가 중요 — M0 도메인 전환 시 redirect / 301 cascade 가 entity @id 까지 cascade 되도록 SCHEMA_MAPPING § 1.2 patch (PSR-CASCADE-02).
541:- (PSR-SEO-13) `inLanguage` 명시 정책: SCHEMA_MAPPING § 1.5 정합 — CreativeWork 계열 (Article · WebPage · FAQPage 등) 만 명시. Organization · MedicalClinic · Physician 등은 미명시.
542:- (PSR-SEO-14 · cycle1 PSR-17) **자체 JSON-LD rule checker** (LOCAL_PASS 게이트): JSON parse + 필수 entity 존재 + `@id` 유일 + cross-reference 무결성 검증. Google Rich Results Test / schema.org validator 는 manual QA marker (PSR-DEFER-14) — CI 게이트 X.
547:### 5.5 OpenGraph / Twitter (PSR-SEO-15)
550:- v0.1 단계 동적 OG 이미지 생성 미지원 (PSR-DEFER-09).
551:- `og:type` 매핑 — § 5.1 PSR-SEO-03 SoT.
553:## 6. 환경·precondition (PSR-ENV-01) — cycle1 PSR-21 정정
559:| 1 | `D0011_public_reader.sql` 작성 + per-table policy 7개 (instance + 6 content table) | acceptance precondition |
563:| 5 | pgbouncer userlist 에 `app_public_reader` 추가 (`apps/spike-a/...userlist.txt`) | PSR-CASCADE-05 acceptance precondition |
564:| 6 | role membership / NOLOGIN 분리 production marker | PSR-DEFER-16 (M0 v1.0 본 구현 합류) |
565:| 7 | `packages/migrations-runner/src/manifest.ts` v0.x — D0011 10단계 추가 (PSR-CASCADE-04) | acceptance precondition |
566:| 8 | Tailwind v0.2 patch — DESIGN_TOKENS v1.0 semantic 22 alias + globals.css 안 CSS vars (light + dark 양쪽) | acceptance precondition |
567:| 9 | `sanitize-html` 의존성 추가 (`apps/web/package.json`) | acceptance precondition |
568:| 10 | LOCATION_LEGAL code v1.1 cascade — admin URL 변경 (PSR-CASCADE-01) 의 revalidatePath 6 곳 patch | acceptance precondition |
569:| 11 | ADMIN_UI_SKELETON code v1.1 cascade — sign-in/consume redirect `/admin/<slug>` (PSR-CASCADE-01) | acceptance precondition |
570:| 12 | apps/web seed scenario 도 admin URL 변경 정합 (`apps/web/src/seed.ts`) | acceptance precondition |
572:## 7. § 8.1 시나리오 (LOCAL_PASS 검증) — cycle1 PSR-17·18 정정
576:| 1 | 어드민이 저장한 ClinicProfile 가 `/<instanceSlug>` (P-001 Home) 에 정확히 표시 | name · description · primaryCtas[0].label 가 페이지 안 **보임** (cycle1 PSR-18 정정) |
579:| 4 | TreatmentPage status='draft' → `/<instanceSlug>/treatments` 리스트에 미노출 (RLS 자동 차단) | 0건 |
580:| 5 | TreatmentPage status='published' + publishedAt now() → 노출 | 1건 |
581:| 6 | TreatmentPage `/<instanceSlug>/treatments/<slug>` 진입 시 body_markdown 렌더링 | `<h1>`·`<h2>`·`<p>` 표준 출력 |
582:| 7 | Article published 5건 → `/<instanceSlug>/insights/general/<slug>` 진입 가능 (1샘플) | P-010 단일 페이지 렌더 |
583:| 8 | LegalDocument 5종 draft → `/<instanceSlug>/legal/<type>` 응답 = 404 (v0.1 noindex + DB CHECK draft 만) | Next `notFound()` |
585:| 10 | 모든 페이지 `<script type="application/ld+json">` 단일 출력 | `@graph` 안 P-001~P-014 별 entity 풀/참조 정합 (§ 5.4 PSR-SEO-11 표) |
586:| 11 | `/<instanceSlug>/sitemap.xml` 응답 | XML sitemap (P-013 제외 9페이지 + 동적 slug) + SEARCH_STANDARDIZATION § 4.3 changefreq/priority 정확 |
587:| 12 | `/<instanceSlug>/robots.txt` 응답 | SEARCH_STANDARDIZATION § 3 v0.1 starter `disallowTraining` 정합 (학습 봇 Disallow + 답변 봇 Allow + Naver Yeti Allow) |
588:| 13 | XSS payload `<script>` 가 어드민에 저장된 bodyMarkdown 에 포함 시 렌더 단계에서 escape | `<script>` literal 출력 — execution X (sanitize-html) |
590:| 15 | 어드민 측 도메인 (`/admin/<slug>/...`) 와 공개 도메인 (`/<slug>/...`) 충돌 없음 — PSR-CASCADE-01 정합 | 어드민 prefix `/admin` · 공개 prefix 없음. sign-in consume redirect `/admin/<firstSlug>` |
591:| 16 | dark mode CSS vars 출력 (UI toggle 미지원) | `[data-theme="dark"]` 블록 안 22개 토큰 모두 dark 값 정의 — 자체 rule checker (LOCAL_PASS) · UI toggle 은 marker 만 |
592:| 17 | sitemap.xml 의 lastmod 가 entity updatedAt (Article 은 datePublished/publishedAt) 과 정확히 일치 | ISO 8601 형식 |
593:| 18 | **자체 JSON-LD rule checker** 통과 (cycle1 PSR-17 정정) | JSON parse + 필수 entity 존재 + `@id` 유일 + cross-reference 무결성 — Google 외부 validator 는 manual QA marker (PSR-DEFER-14) |
594:| 19 | LocationProfile.metadata.businessHours (CT-02 SoT) 가 `/<instanceSlug>/contact` + `/<instanceSlug>/locations/main` 에 7요일 표 + 점심 시간 표시 | LL-SCHEMA-16 정합 · 두 페이지 동일 표 출력 |
595:| 20 | Markdown ArticleBody 안 외부 링크 `rel="nofollow noopener noreferrer"` (cycle1 PSR-20) | 내부 링크 (`/<slug>/...`) 는 그대로 |
596:| 21 | Next metadata API `themeColor` 2값 (light + dark) 출력 — cycle1 PSR-10 | `<meta name="theme-color" media="(prefers-color-scheme: light)" content="#f9fafb">` + dark 변형 |
597:| 22 | P-004 OG type = `profile` · P-006 OG type = `article` · P-010 OG type = `article` (cycle1 PSR-10) | meta `property="og:type"` 확인 |
598:| 23 | P-013 Legal route 가 noindex robots meta + sitemap 제외 (cycle1 PSR-06) | `<meta name="robots" content="noindex,follow">` + sitemap.xml 에 없음 |
600:## 8. 작업 단위 (cycle1 PSR-21 cascade 분해)
604:| 1 | D0011 migration — `app_public_reader` LOGIN + 7개 policy (instance + 6 content table) | packages/db/migrations/D0011_public_reader.sql |
609:| 6 | `loadSiteInitial` (layout 안 ClinicProfile + LocationMain + brandTokens 1회 SELECT) | apps/web/src/lib/site-initial.ts |
611:| 8 | 사이트 컴포넌트 (Hero · DoctorCard · TreatmentCard · ArticleBody · ContactCard · LocationCard · BreadcrumbList 등) | apps/web/src/components/site/* |
612:| 9 | Markdown 렌더 (`sanitize-html` + 외부 링크 rel) | apps/web/src/lib/markdown.ts |
615:| 12 | Next metadata API (페이지별 generateMetadata · themeColor · og:type) | 각 page.tsx 안 |
616:| 13 | sitemap.xml + robots.txt route handler (SEARCH_STANDARDIZATION 정합) | apps/web/src/app/(site)/[instanceSlug]/{sitemap.xml,robots.txt}/route.ts |
617:| 14 | Tailwind v0.2 patch — DESIGN_TOKENS v1.0 semantic 22 alias + globals.css light/dark | apps/web/tailwind.config.ts · src/styles/globals.css |
618:| 15 | **어드민 URL `/admin` prefix 격상 (PSR-CASCADE-01)** | apps/web/src/app/(admin)/admin/[instanceSlug]/ 디렉토리 이동 + revalidatePath 6 곳 + sign-in/consume redirect target + seed.ts |
619:| 16 | docs/admin/ARCHITECTURE.md § 3 patch — `(site)` 신설 + `/admin` prefix (PSR-CASCADE-01) | doc |
620:| 17 | docs/core/SCHEMA_MAPPING.md § 1.2 patch — v0.1 path-based `@id` marker + entity continuity note (PSR-CASCADE-02) | doc |
621:| 18 | docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2 patch — apps/worker 가 본 plan SSR 컴포넌트 재사용 marker (PSR-CASCADE-03) | doc |
622:| 19 | packages/migrations-runner manifest 10단계 (D0011 추가 — PSR-CASCADE-04) | manifest.ts |
623:| 20 | Spike A pgbouncer userlist patch (PSR-CASCADE-05) | apps/spike-a/userlist.txt |
626:## 9. M0 v1.0 cascade markers (defer 정리)
628:### 9.1 M0 v1.0 본 구현 합류 (Phase 0 Week 4~)
630:- `PSR-DEFER-01`: static export to Git — apps/worker + isomorphic-git/simple-git. v0.1 SSR 의 컴포넌트 트리 재사용 + `generateStaticParams` + `next export`.
631:- `PSR-DEFER-02`: 도메인 매핑 — subdomain `<slug>.glitzy.co` + custom domain CNAME. Vercel/Cloud Run middleware host header → instanceSlug rewrite.
632:- `PSR-DEFER-04`: CDN cache 정책 — Cloudflare · Vercel ISR fine-tune.
633:- `PSR-DEFER-10`: AI 크롤러 인증 + InstanceManifest.aiCrawlerPolicy row-driven 출력 + 법무 승인 필드 3종 verify (SEARCH_STANDARDIZATION § 3.3.1 룰).
634:- `PSR-DEFER-13` (= LL-DEFER-01 alias · cycle1 PSR-06): LegalDocument 공개 노출 — compliance-assistant + ComplianceRecord legalCounsel/legalCounselAt 합류 시점.
635:- `PSR-DEFER-16` (cycle1 PSR-05): `app_public_reader` NOLOGIN + MEMBERSHIP 분리 production 패턴.
637:### 9.2 M1 Phase Alpha 합류
639:- `PSR-DEFER-03`: dark mode UI toggle (CSS vars 는 v0.1 부터 두 테마 출력 — DESIGN_TOKENS § 3.3 정합).
640:- `PSR-DEFER-05`: 검색 콘솔 sitemap submission 자동화.
641:- `PSR-DEFER-08`: draft preview token (어드민 외).
642:- `PSR-DEFER-09`: 페이지별 OG 이미지 동적 생성 (`@vercel/og`).
643:- `PSR-DEFER-17` (cycle1 PSR-19): Markdown sanitizer 를 `sanitize-html` → `rehype-sanitize` (unified pipeline) 전환 — EAT_CONTENT plan v0.1 안 FAQ 합류 시.
645:### 9.3 EAT_CONTENT plan v0.1 합류
647:- `PSR-DEFER-11(부분)`: FAQ (P-011) 추가 — schema.org `FAQPage` JSON-LD.
648:- `PSR-DEFER-15` (cycle1 PSR-11): Article `category` 컬럼 + URL 패턴 운영 — 현재 C-04 article.category 없음. v0.1 단일 fallback `general`.
650:### 9.4 외부 / manual QA
652:- `PSR-DEFER-14` (cycle1 PSR-17): Google Rich Results Test / schema.org validator 자동 게이트 — manual QA marker. CI 게이트 X.
654:### 9.5 M3 다국어 합류
656:- `PSR-DEFER-06`: `/<lang>/<instanceSlug>/...` routing 변경.
658:## 10. Cascade markers (다른 SoT 문서로 전파)
660:> **acceptance 순서 정합 (LL-33 패턴)**: PSR-CASCADE-01~05 는 plan v1.0 acceptance 와 **동시 또는 직전** 에 적용. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
662:- `PSR-CASCADE-01` (cycle1 PSR-02 격상): `docs/admin/ARCHITECTURE.md` § 3 patch + `apps/web` 디렉토리 구조 변경 (`(admin)/admin/[instanceSlug]/...`) + revalidatePath 6 곳 + sign-in/consume redirect target + seed.ts. **코드 cascade — LOCATION_LEGAL code v1.1 + ADMIN_UI_SKELETON code v1.1 patch acceptance precondition**.
663:- `PSR-CASCADE-02` (cycle1 PSR-08 보강): `docs/core/SCHEMA_MAPPING.md` § 1.2 patch — v0.1 임시 path-based `@id` 패턴 + 도메인 매핑 후 (M0 v1.0) entity @id 전환 시 redirect/301/`sameAs` 처리 룰 추가 marker.
664:- `PSR-CASCADE-03`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2 patch — apps/worker 의 build/export 시점에 본 plan SSR 컴포넌트 + JSON-LD 생성기 + sitemap/robots route handler 재사용 marker.
665:- `PSR-CASCADE-04`: `packages/migrations-runner/src/manifest.ts` — D0011 10단계 추가 (현 9단계 → 10단계).
666:- `PSR-CASCADE-05`: `apps/spike-a` pgbouncer userlist — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade).
668:## 변경 이력
673:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |

codex
초기 대조에서 두 군데가 특히 의심됩니다. `SEARCH_STANDARDIZATION`의 robots enum/테마 컬러 출처와 plan v0.2 표현이 다르고, P-013 Legal은 PAGE_TYPES상 M0 게이트인데 plan은 v0.1 공개 404로 단계화했습니다. 이제 schema 실 컬럼과 cascade 대상까지 확인해 severity를 확정하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "export const|clinicProfile|locationProfile|doctorProfile|treatmentPage|article|legalDocument|body_markdown|bodyMarkdown|hero_image_url|published_at|author_doctor_id|document_type|effective_date|street_address|address_locality|primary_ctas|long_description|display_order|metadata|business" packages/core-content/src/schema.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "LL-SCHEMA-03|LegalDocument|status|draft|published|CHECK|LL-DEFER-01|legalCounsel|ComplianceRecord|privacy|terms|refund|marketing|non" docs/decisions/LOCATION_LEGAL_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "@id|P-001|P-002|P-003|P-004|P-005|P-006|P-010|P-012|P-013|P-014|MedicalClinic|ContactPage|WebPage|Organization|Article|Physician|BreadcrumbList|Location" docs/core/SCHEMA_MAPPING.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "admin|/admin|instanceSlug|sign-in|revalidatePath|seed|dashboard|cleanup|PSR-CASCADE|PUBLIC_SITE" docs/admin/ARCHITECTURE.md docs/decisions/M0_BUILD_EXPORT_PLAN.md packages/migrations-runner/src/manifest.ts apps/spike-a/userlist.txt' in C:\Users\assag\solution\website-exposure
 succeeded in 807ms:
3:// v0.3: + legal_document (C-16) + clinic_profile policy/primary_ctas (C0007) + location_profile.clinic_profile_id (C0008)
13:export const instance = pgTable(
32:export const contentPublicationStatusEnum = pgEnum("content_publication_status", [
37:export const riskLevelEnum = pgEnum("risk_level", ["Low", "Medium", "High"]);
39:// LL-SCHEMA-01: legal_document_type (DATA_MODEL C-16 SoT 7종)
40:export const legalDocumentTypeEnum = pgEnum("legal_document_type", [
46:export const clinicProfile = pgTable(
57:    longDescription: text("long_description"),
62:    businessRegistrationNumber: text("business_registration_number"),
67:    policyEffectiveDate: date("policy_effective_date"),
68:    // LL-SCHEMA-12 + cycle1 LL-02 + cycle3·4 LL-38·48·50: primary_ctas JSONB array (CT-03 SoT)
69:    primaryCtas: jsonb("primary_ctas").notNull().default(sql`'[]'::jsonb`),
70:    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
78:    brnRegex: check("clinic_profile_brn_regex", sql`${t.businessRegistrationNumber} IS NULL OR ${t.businessRegistrationNumber} ~ '^[0-9]{3}-[0-9]{2}-[0-9]{5}$'`),
82:    primaryCtasArray: check("clinic_profile_primary_ctas_array", sql`jsonb_typeof(${t.primaryCtas}) = 'array'`),
92:export const locationProfile = pgTable(
99:    streetAddress: text("street_address").notNull(),
100:    addressLocality: text("address_locality").notNull(),
109:    clinicProfileId: uuid("clinic_profile_id").notNull(),
110:    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
125:      columns: [t.instanceId, t.clinicProfileId],
126:      foreignColumns: [clinicProfile.instanceId, clinicProfile.id],
132:    clinicIdx: index("location_profile_clinic_idx").on(t.instanceId, t.clinicProfileId),
138:export const doctorProfile = pgTable(
150:    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
151:    displayOrder: integer("display_order").notNull().default(0),
170:export const treatmentPage = pgTable(
178:    bodyMarkdown: text("body_markdown").notNull(),
182:    heroImageUrl: text("hero_image_url"),
183:    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
184:    publishedAt: timestamp("published_at", { withTimezone: true }),
205:export const article = pgTable(
206:  "article",
213:    bodyMarkdown: text("body_markdown").notNull(),
217:    heroImageUrl: text("hero_image_url"),
218:    authorDoctorId: uuid("author_doctor_id"),
219:    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
220:    publishedAt: timestamp("published_at", { withTimezone: true }),
225:    slugRegex: check("article_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
226:    titleLen: check("article_title_length", sql`length(${t.title}) BETWEEN 1 AND 200`),
227:    summaryLen: check("article_summary_length", sql`length(${t.summary}) BETWEEN 80 AND 200`),
228:    publishedRequiresAt: check("article_published_requires_at", sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`),
229:    instanceSlugUnique: unique("article_instance_slug_unique").on(t.instanceId, t.slug),
230:    instanceIdUnique: unique("article_instance_id_unique").on(t.instanceId, t.id),
231:    instanceIdx: index("article_instance_idx").on(t.instanceId),
232:    statusIdx: index("article_status_idx").on(t.instanceId, t.status),
233:    publishedIdx: index("article_published_idx")
236:    authorIdx: index("article_author_idx")
242:      foreignColumns: [doctorProfile.instanceId, doctorProfile.id],
243:      name: "article_author_fk",
250:export const legalDocument = pgTable(
256:    documentType: legalDocumentTypeEnum("document_type").notNull(),
262:    effectiveDate: date("effective_date").notNull(),
268:    publishedAt: timestamp("published_at", { withTimezone: true }),
269:    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
283:    publishedAtNull: check("legal_document_published_at_null", sql`${t.publishedAt} IS NULL`),

 succeeded in 804ms:
1:# LocationProfile(main) + LegalDocument 자동 생성 plan (v1.0·acceptance·2026-05-16)
7:본 문서는 `docs/admin/ARCHITECTURE.md` v0.7 § 3.8.1 (LocationProfile(main) 자동 생성 규칙) · § 3.8.2 (LegalDocument 자동 생성 규칙) 을 M0 어드민에서 구현하기 위한 plan이다. ClinicProfile 화면 한 화면에서 **3계약 동시 출력** (`ClinicProfile` + `LocationProfile`(slug=`main`) + `LegalDocument`(5종)) 을 단일 server action transaction 안에서 수행한다.
11:> **scope limit (LL-INTRO-01)** — cycle1 LL-03·LL-04 patch: 본 plan 은 LegalDocument **draft 저장만** 다룬다. `review-queued` 도 차단 — 그 전이는 ComplianceRecord pre-publish row + NotificationEvent envelope (REVIEW_WORKFLOW § 5.2 / § 3.1) 발송이 함께 작동해야 한다. 이 둘은 모두 compliance-assistant Feature + ComplianceRecord UI cascade 까지 defer. 본 plan 의 LegalDocument 는 `status='draft'` 강제 (CHECK). 발행 게이트 자체는 LL-DEFER-01.
16:- `docs/core/DATA_MODEL.md` v0.9 — C-01 ClinicProfile · C-16 LegalDocument · C-21 LocationProfile · CT-02 BusinessHours · CT-03 CTAConfig
17:- `docs/admin/REVIEW_WORKFLOW.md` v1.0 — content_publication_status 9 states · 14 ActionType · ComplianceRecord pre-publish (§ 5.2) · NotificationEvent envelope (§ 9.1)
18:- `docs/core/CONTENT_STANDARDS.md` v1.3 — cycle1 LL-13 patch: 경로 정정 (admin/CONTENT_STANDARDS 아님). Markdown 본문 검증 (answer-first AST · 표현 검사) 의 LegalDocument 면제 규약 (§ 7 ContentType 예외 표 — LegalDocument 면제 marker).
19:- `docs/compliance/RISK_LEVELS.md` v1.1 · `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0 — `LegalDocument: legalCounsel/legalCounselAt required` 의 위험도 Low 예외 게이트 (RL § 4.3)
46:| `saveClinicProfile` actions 확장 | 단일 tx 안 ClinicProfile + LocationProfile(main) + 5종 LegalDocument upsert · 변수 치환 · audit 7 row 별도 emit (cycle1 LL-17 patch) |
47:| Core 표준 템플릿 5종 | packages/core-content/src/templates/ — `privacy.ts` · `terms.ts` · `non-covered.ts` · `refund.ts` · `complaint.ts` |
50:| 5종 LegalDocument 별 effective_date input | cycle1 LL-15 patch — LL-DEFER-08 reversal. 5 record 별 individual input · default = policy_effective_date |
51:| audit payload 통일 shape | cycle1 LL-17 patch — 7 row 별도 emit · 기존 `{contentType, slug, mode, status, originalSlug}` 보존 (Bundle outer 폐기) |
57:| LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제) · `review-queued` 전이 + ComplianceRecord pre-publish + NotificationEvent | compliance-assistant Feature + ComplianceRecord UI cascade | LL-INTRO-01 / LL-DEFER-01 |
58:| LegalDocument `status=published` 발행 자체 | apps/worker + Git commit cascade | LL-DEFER-01 |
59:| ClinicProfile 화면의 미리보기 (3계약 합쳐 본 미리보기 페이지) | M0 v1.0 미리보기 화면 | LL-DEFER-01 |
62:| LegalDocument 수동 작성 모드 (autoGenerated=false) | M1 Phase Alpha — Markdown 에디터 합류 시점 | LL-DEFER-03 |
65:| LegalDocument body 직접 수동 override | M1 Phase Alpha | LL-DEFER-06 |
67:| ~~5종 LegalDocument 각각의 effective_date individual override~~ | cycle1 LL-15 patch — **v0.2 에서 합류** (form 에서 5 record 별 input) | (closed) |
70:| LegalDocument body 검증 (CONTENT_STANDARDS § 7 ContentType 예외 marker 명시 + 면제 범위 cascade) | cycle1 LL-13 patch — CONTENT_STANDARDS § 7 의 LegalDocument 면제 marker 가 plan SoT cascade. 본 plan 에서 추가 검증 룰 미정의 | LL-DEFER-11 |
82:  'privacy', 'terms', 'non-covered', 'refund', 'complaint', 'cookie', 'other'
93:  template_version TEXT,              -- 'privacy@1.0.0' 등 (autoGenerated=true 시 필수)
98:  status content_publication_status NOT NULL DEFAULT 'draft',
100:  published_at TIMESTAMPTZ,
104:  CONSTRAINT legal_document_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
105:  CONSTRAINT legal_document_title_length CHECK (length(title) BETWEEN 1 AND 100),
106:  CONSTRAINT legal_document_body_length CHECK (length(body) BETWEEN 1 AND 200000),
107:  CONSTRAINT legal_document_email_regex CHECK (
111:  CONSTRAINT legal_document_template_version_format CHECK (
114:  CONSTRAINT legal_document_auto_generated_template_ver CHECK (
117:  -- cycle1 LL-03·LL-19 patch: skeleton 단계 status='draft' 만 허용 (review-queued 도 차단)
118:  CONSTRAINT legal_document_status_skeleton_limit CHECK (status = 'draft'),
119:  CONSTRAINT legal_document_published_at_null CHECK (published_at IS NULL),
121:  CONSTRAINT legal_document_risk_level_skeleton_limit CHECK (risk_level = 'Low'),
129:  WHERE document_type IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint');
139:  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
145:- (LL-SCHEMA-02 · cycle1 LL-08·LL-09 patch) **partial UNIQUE** — closed 5종 (`privacy`/`terms`/`non-covered`/`refund`/`complaint`) per instance UNIQUE. `cookie`/`other` 는 instance 당 N개 허용 (skeleton v0.2 UI 미제공 — LL-DEFER-12).
146:- (LL-SCHEMA-03 · cycle1 LL-03 patch) `status` CHECK `= 'draft'` — skeleton 단계 단일 상태만. `review-queued` 전이는 ComplianceRecord pre-publish row + NotificationEvent 발송과 함께만 작동 (compliance-assistant cascade — LL-DEFER-01).
147:- (LL-SCHEMA-04) `published_at` CHECK NULL — 발행 자체가 LL-DEFER-01.
149:- (LL-SCHEMA-06 · cycle1 LL-12 patch) `risk_level` NOT NULL + CHECK `= 'Low'` — skeleton 단계 Low 만 (compliance-assistant 의 RiskLevel 자동 추론 cascade 까지 변경 불가).
166:  ADD CONSTRAINT clinic_profile_policy_email_regex CHECK (
171:  ADD CONSTRAINT clinic_profile_policy_phone_format CHECK (
175:  ADD CONSTRAINT clinic_profile_primary_ctas_array CHECK (
179:-- cycle3 LL-38 patch: PostgreSQL CHECK 는 subquery 미지원 → trigger 가 매 row 검증.
230:- (LL-SCHEMA-09) 별도 column (metadata JSONB 가 아닌) — 폼 schema 검증 + LegalDocument 변수 치환의 필수 입력값.
232:- (LL-SCHEMA-11 · cycle1 LL-15 patch) `policy_effective_date` 는 form 안 5 LegalDocument record 의 default 만. 운영자가 각 record 별 override 가능 (LL-DEFER-08 closed).
237:  - **DB 검증 = trigger** (CHECK subquery 불가 · cycle3 LL-38 patch) + form zod (UI subset 3종 enum) 양쪽. LocationProfile 자동 생성 시 **build-time reference (deep clone)** — DB metadata 복사 없음 (LL-SCHEMA-18 통일).
254:-- cycle2 LL-28 patch: NOT NULL CHECK 전 row 적용 (다지점도 parentClinic required SoT 정합)
308:### 3.1 ClinicProfileForm 3 섹션 + 5 LegalDocument record (LL-FORM-01)
315:| **(d) 5종 LegalDocument** (신규 보조 details — cycle1 LL-15 patch) | 5 record 별 effectiveDate override (optional · 미입력 시 policyEffectiveDate default) | `LegalDocument` × 5 |
318:- (LL-FORM-02) 한 화면 한 폼 (single `<form action>`) — server action 한 번 호출로 3계약 + 5 LegalDocument 동시 출력. 부분 저장 (섹션별 저장) 안 함.
320:- (LL-FORM-04 · cycle1 LL-14 patch) 섹션 (c) 는 LegalDocument 생성에 필수 — policyContactPerson · policyContactEmail · policyContactPhone · policyEffectiveDate **4 필드 모두 required**. (한국 PIPA 의 개인정보 보호책임자 필수 고지 항목 — 소속/부서 같은 추가 필드는 LL-DEFER 또는 자유 입력 textarea 로 처리. v0.2 는 4 필드만 minimal.)
323:- (LL-FORM-07 · cycle1 LL-23 + cycle2 LL-35 patch) businessHours UI: 7 요일 행. 각 행: `[휴진 ☐]` + `오픈 [HH:mm] 마감 [HH:mm]` + `[점심 ☐]` + `점심 시작 [HH:mm] 종료 [HH:mm]`. 휴진 checked 시 다른 입력 disabled. **a11y 요구**: 각 row 에 `aria-labelledby` (요일 헤더 link) + 각 input `aria-describedby` (요일 에러 메시지 id) + 휴진 toggle 의 `aria-controls` (해당 row 의 input group id). **5 LegalDocument override details a11y (LL-FORM-14)**: `<details>` `<summary>` 는 기본적으로 keyboard interaction (Space/Enter toggle) + `aria-expanded` 자동. 추가로 `<summary>` 안에 정책 이름 + `(시행일: <date>)` 시각 표시 + `aria-controls` (override 입력 group id) + override 입력에 `aria-labelledby` (summary id) 명시.
333:  - Field name (form 안 flat key) = `legalDocEffective_<documentType>` (5종: `legalDocEffective_privacy` · `legalDocEffective_terms` · `legalDocEffective_non-covered` · `legalDocEffective_refund` · `legalDocEffective_complaint`). cycle3 LL-39 patch: dotted key (`legalDoc.privacy.effectiveDate`) 회귀 — `Object.fromEntries(formData)` 가 nested object 자동 생성하지 않으므로 flat underscore key 로 변경.
337:  - DB CHECK `effective_date NOT NULL` 정합 — server action 안 fallback 적용 후 DB INSERT 시점 항상 값 존재.
348:  // cycle1 LL-18 patch: LegalDocument 편집은 skeleton 단계 status=draft + risk_level=Low 의 CHECK 로 제한.
354:  // (3) legal_document × 5 — documentType 사전 정렬 (alpha) 순서 UPSERT: complaint → non-covered → privacy → refund → terms
360:- (LL-ACTION-02) 3계약 + 5 LegalDocument 모두 같은 tx — RLS 정합 + atomic 출력. 하나 실패 = 전체 rollback.
361:- (LL-ACTION-03 · cycle1 LL-17 patch) audit `content-saved` 는 tx commit 후 **7 row 별도 emit** — ClinicProfile 1 + LocationProfile 1 + LegalDocument 5. 각 row 의 payload 는 기존 통일 shape `{contentType, slug, mode, status, originalSlug}`. `ClinicProfileBundle` outer 폐기. analytics/test 호환 보존.
362:- (LL-ACTION-04 · cycle1 LL-07 patch) 잠금 순서 = (1) clinic_profile → (2) location_profile main → (3) legal_document 5종 (alpha sort: complaint → non-covered → privacy → refund → terms). 결정적 순서로 deadlock 회피.
364:- (LL-ACTION-06 · cycle1 LL-16 + cycle3 LL-46 patch) **자동 재렌더링 분기 제거** — v0.4 는 LegalDocument 본문 수동 편집 차단 (LL-DEFER-06) 이므로 모든 row 가 templateVersion=current. 매 저장 시 모든 LegalDocument body 재렌더링. **운영자 알림 marker (LL-FORM-15 · 폼 (d) 상단 안내문)**: "본원 정보(기관명·법인명·사업자번호·설립자·본원 주소·전화·이메일) 또는 정책 변수(담당자·이메일·전화·시행일)를 수정하면 5종 정책 문서 본문이 자동으로 다시 생성됩니다. 본문 직접 수정은 추후 단계에서 합류합니다." 향후 수동 override 도입 시 별도 `body_source` enum (`auto`/`manual`) 컬럼 cascade.
393:    effectiveDate: string;   // YYYY-MM-DD (LegalDocument 별 override 결과)
410:7 row 별도 emit. 각 row 는 기존 통일 shape `{contentType, slug, mode, status, originalSlug}`:
414:{ "eventType": "content-saved", "payload": { "contentType": "ClinicProfile",  "slug": "clinic", "mode": "...", "status": null,    "originalSlug": "clinic" } }
416:{ "eventType": "content-saved", "payload": { "contentType": "LocationProfile", "slug": "main",   "mode": "...", "status": null,    "originalSlug": "main" } }
417:// row 3~7 (5종 LegalDocument)
418:{ "eventType": "content-saved", "payload": { "contentType": "LegalDocument",   "slug": "privacy", "mode": "...", "status": "draft", "originalSlug": "privacy",
419:                                              "documentType": "privacy", "templateVersion": "privacy@1.0.0" } }
420:// ... terms, non-covered, refund, complaint
434:- (LL-ACTION-19 · cycle1 LL-17 patch) ADMIN_UI_SKELETON_PLAN § 5.5 audit matrix cascade — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed 별도 row 추가 marker (LL-CASCADE-02). 기존 ClinicProfile row 와 동일 통일 shape.
441:  - `legal_document_status_skeleton_limit` → formError ("정책 문서 상태 변경(검수 진입·발행)은 후속 단계입니다. 본 화면에서는 draft 만 저장 가능하며, 검수 진입은 compliance-assistant Feature 합류(M0 v1.0 본 구현 완료 시점) 후 검수 큐 화면에서 가능합니다.")
442:  - `legal_document_published_at_null` → formError ("정책 문서 발행은 후속 단계입니다. 발행 게이트(compliance-assistant + ComplianceRecord UI) 합류 후 발행 화면에서 가능합니다.")
448:  - businessHours 는 application-level 검증 (DB CHECK 없음)
460:├─ privacy.md            -- 개인정보처리방침 (PIPA 표준)
461:├─ terms.md              -- 이용약관
462:├─ non-covered.md        -- 비급여 진료 안내
463:├─ refund.md             -- 환불 규정
469:export type LegalDocumentType =
470:  | "privacy" | "terms" | "non-covered" | "refund" | "complaint" | "cookie" | "other";
473:  documentType: LegalDocumentType;
476:  version: string;        // "privacy@1.0.0"
480:export const TEMPLATES: Record<"privacy" | "terms" | "non-covered" | "refund" | "complaint", Template>;
492:- (LL-TEMPLATE-07 · cycle1 LL-13 patch) **LegalDocument body 검증 면제 명시** — `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표에 LegalDocument 추가 (cascade marker LL-CASCADE-03). 면제 범위: (1) answer-first AST 미적용 (정책 문서는 첫 문장 답 제시 구조 아님) (2) 표현 검사 (recommend/best 등 광고 표현) 미적용 (3) 변수 화이트리스트 검증은 별도 룰 (LL-ACTION-12).
502:  5. `packages/core-content/migrations/C0004_treatment_page.sql` (content_publication_status enum 생성) — **C0006 의 precondition**
504:  7. `packages/core-content/migrations/C0006_legal_document.sql` — legal_document table (status::content_publication_status + risk_level::risk_level FK)
518:| 15 | Tenant B 세션이 `/A/clinic-profile` 접근 | membership 부재 — `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit (v1.1 LLC-16 patch). 정확한 HTTP 403 status 보장은 Next.js 14 server component 의 한계로 인해 Next 15 `unauthorized()/forbidden()` 합류 시점 cascade (LL-DEFER-21). |
519:| 16 | LegalDocument 행을 `app_tenant_user` 가 `status='published'` 로 UPDATE 시도 | CHECK 위반 → formError ("정책 문서는 현재 단계에서 발행 상태로 변경할 수 없습니다") — cycle1 LL-19 patch |
520:| 17 | LegalDocument 같은 documentType (closed 5종) 두 번 INSERT | partial UNIQUE 위반 (LL-SCHEMA-02) |
523:| 20 | location_profile main row 의 clinic_profile_id 가 다른 tenant 의 clinic.id 로 변조 | composite FK + RLS WITH CHECK 위반 (LL-SCHEMA-14) |
524:| 21 | LegalDocument risk_level='High' UPDATE 시도 | CHECK 위반 (LL-SCHEMA-06) → formError |
535:| 5 | zod schema (businessHours · primaryCtas · policy vars · 5 LegalDocument override) | apps/web/src/lib/clinic-profile-schema.ts |
536:| 6 | ClinicProfileForm 3 섹션 + 5 LegalDocument record 재구성 (a11y marker 적용) | apps/web/src/components/forms/ClinicProfileForm.tsx |
539:| 9 | content-saved audit matrix row 추가 (LocationProfile · LegalDocument) | ADMIN_UI_SKELETON_PLAN § 5.5 cascade marker (LL-CASCADE-02) |
541:| 11 | docs/core/CONTENT_STANDARDS.md § 7 LegalDocument 예외 marker 추가 | LL-CASCADE-03 |
548:- `LL-DEFER-01`: LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제 · review-queued 전이 + ComplianceRecord pre-publish + NotificationEvent envelope · status=published). compliance-assistant Feature + ComplianceRecord UI cascade.
549:- `LL-DEFER-09`: LegalDocument 편집 권한 분리 (operator-edit-legal ActionType — REVIEW_WORKFLOW 14 ActionType cascade).
550:- `LL-DEFER-11`: LegalDocument body 검증 — CONTENT_STANDARDS § 7 ContentType 예외 marker cascade (LL-CASCADE-03). 추가 검증 룰은 compliance-assistant Feature.
554:- `LL-DEFER-21` (**v1.1 LLC-16 patch**): tenant 접근 거부 시 정확한 HTTP 403 status 보장. Next.js 14 server component 는 직접 status code 설정 불가 → Next 15 `unauthorized()/forbidden()` helper 합류 시점 cascade. v1.1 단계는 `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit 으로 보장. **합류 시점 = Next.js 15 업그레이드 cascade (Phase 0 Week 4 cascade 후보)**.
559:- `LL-DEFER-03`: LegalDocument 수동 작성 모드 (autoGenerated=false · Markdown 에디터).
560:- `LL-DEFER-06`: LegalDocument body 수동 override · `body_source` enum cascade.
586:- ~~`LL-DEFER-08`~~: cycle1 LL-15 patch — 5종 LegalDocument 별 effectiveDate override 합류 완료 (v0.2 acceptance).
593:- `LL-CASCADE-02`: `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` § 5.5 audit matrix — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed row 추가. **acceptance precondition**.
594:- `LL-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표 — LegalDocument 면제 marker 추가 (answer-first AST · 표현 검사 면제 · 변수 화이트리스트 별도 룰). **acceptance precondition**.
603:| 2026-05-16 | v0.2 | **Codex 비평 cycle1 25 findings (7 blocking + 12 major + 6 minor) 전건 수용 patch**: (LL-01) location_profile 에 clinic_profile_id composite FK + main row CHECK, ClinicProfile.locations[] Git 출력 빌드 시점 동적 구성. (LL-02) ClinicProfile.primary_ctas 컬럼 + LocationProfile.reservationChannels = primary_ctas 자동 상속 marker. (LL-03·04) status='draft' 만 허용 (review-queued 도 차단) — ComplianceRecord pre-publish + NotificationEvent 합류 시점까지 defer. (LL-05) businessHours SoT CT-02 형식 (openingHours[]·receptionHours[]·lunchBreaks[]·specialClosures[]) 변환 + server action 안 convertToOpeningHoursSpec 명시. (LL-06) policy.* 변수 정당화 + LL-CASCADE-01 cascade marker. (LL-07) 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha. (LL-08·09) partial UNIQUE — closed 5종만. cookie/other LL-DEFER-12. (LL-10) C-21 출력 매핑표 명시. (LL-11) representativeDoctors v0.2 빈 배열. (LL-12) risk_level NOT NULL + CHECK 'Low' 만. (LL-13) SoT 경로 정정 (docs/core/CONTENT_STANDARDS.md) + LL-CASCADE-03. (LL-14) policyContactPhone form 단계 required. (LL-15) effective_date individual override 합류 (LL-DEFER-08 closed). (LL-16) 자동 재렌더링 분기 제거 (모든 row 매 저장 시 재렌더링). (LL-17) audit 7 row 별도 emit (Bundle outer 폐기). (LL-18) RBAC 분리 marker LL-DEFER-09 명시. (LL-19) published CHECK 위반 시 운영자 메시지 + errors.ts 매핑. (LL-20) phone regex 한국 + 국제 표기 명시. (LL-21) effective_date timezone Asia/Seoul. (LL-22) template_version naming autoGenerated=true 일 때만 필수. (LL-23) businessHours a11y marker. (LL-24) detection 시점 server action runtime + build-time test cascade. (LL-25) LL-DEFER-08~10 본문 §1 비범위 표 반영. |
604:| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
605:| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
609:| 2026-05-18 | v1.1 | **Code review (cycle 1~3) 결과 plan SoT 보강 patch — 본 plan 의 코드 구현 cycle 동안 발견된 plan-code 불일치 4건 수용**: (LLC-15) § 6 migration 의존성 표 8단계 → 9단계 (C0003 doctor_profile 추가 — C0005 article.author_doctor_id FK precondition). (LLC-16) § 7 시나리오 15 "403" → `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit 으로 정정. 정확한 HTTP 403 status 보장은 § 9.1 `LL-DEFER-21` 신설 (Next.js 14 server component status code 한계 → Next 15 `unauthorized()/forbidden()` 합류 cascade). (LLC-17) § 4.4 LL-ACTION-18 fallback payload 에 `failedDetails: [{target, code, name, message}]` 추가 명시. (LLC-18) § 10 LL-CASCADE-05 본문 + manifest 주석의 "8단계" stale wording → "9단계"로 정정. 코드 누계 cycle 3 회 (14→3→1) · 누계 18 findings 수용 (cycle 6 plan acceptance 59 + cycle 1·2·3 code review 14+3+1). |

 succeeded in 818ms:
20:- 핵심 schema: `Organization`·`MedicalClinic`·`Physician`·`MedicalProcedure`·`MedicalCondition`·`Article`·`FAQPage`·`BreadcrumbList`·`WebSite`. (`MedicalClinic`은 LocalBusiness sub-class이므로 별도 `LocalBusiness` 타입 출력 안 함)
21:- 단지점·다지점은 **`MedicalClinic` 지점 entity가 LocationProfile 1:1 매핑**. ClinicProfile은 `Organization`(상위 entity), 본원 LocationProfile은 본원 `MedicalClinic`(`#clinic`)으로 표현.
33:**Core가 출력하는 JSON-LD는 페이지당 단일 `<script type="application/ld+json">` 블록**으로 통합 그래프 출력. (외부 통합 — 네이버 예약 위젯·카카오톡 등 — 이 자체 schema를 삽입할 수 있으나 Core 책임 외. Core graph와 충돌 시 entity @id 중복 검출은 빌드 시 경고.)
40:    { "@type": "Organization", "@id": "...", ... },
41:    { "@type": "MedicalClinic", "@id": "...", ... },
42:    { "@type": "BreadcrumbList", "itemListElement": [...] },
43:    { "@type": "Article", "@id": "...", ... }
50:- 통합 그래프 사용 이유: entity cross-reference(@id 참조)가 깔끔, validator·검색 엔진의 entity 해석 명확.
52:### 1.2 `@id` 네이밍 규약
54:| Entity | `@id` 패턴 | 예시 |
56:| `Organization` (ClinicProfile) | `https://{domain}/#organization` | `https://example.com/#organization` |
57:| `MedicalClinic` 본원 (LocationProfile main) | `https://{domain}/#clinic` | `https://example.com/#clinic` |
58:| `MedicalClinic` 지점 (LocationProfile main 외) | `https://{domain}/locations/{slug}#clinic` | `https://example.com/locations/gangnam#clinic` |
59:| `Physician` (DoctorProfile) | `https://{domain}/doctors/{slug}#physician` | |
62:| `Article` | `https://{domain}/insights/{category}/{slug}#article` | |
64:| `WebPage` | `https://{domain}{path}#webpage` | 본문 페이지 entity |
66:> `@id`는 dereferenceable URL + fragment 형식. 같은 entity는 항상 같은 `@id`를 사용해 페이지 간 일관성 확보.
70:다른 entity 참조는 `@id`만 사용:
74:  "@type": "Article",
75:  "@id": "https://example.com/insights/diet/yoyo#article",
76:  "author": { "@id": "https://example.com/doctors/hong#physician" },
77:  "publisher": { "@id": "https://example.com/#organization" }
81:전체 entity 정의는 페이지 그래프 안에 한 번만. 다른 위치는 `@id`만으로 참조.
87:| 인스턴스 형태 | Organization | MedicalClinic |
89:| **단지점** | `Organization`(`#organization`) 1개 | **`MedicalClinic`(`#clinic`) 1개** — LocationProfile(slug=`main`)에 매핑. P-014 페이지(URL `/locations/main`)의 mainEntity도 같은 `#clinic` (URL ≠ entity @id) |
90:| **다지점** | `Organization`(`#organization`) 1개 | **본원: `MedicalClinic`(`#clinic`)** — LocationProfile(slug=`main`). **비본원 지점들: `MedicalClinic`(`/locations/{slug}#clinic`)** 각각 별도 entity. 모두 `parentOrganization` = Organization |
92:> P-014 페이지가 단지점 main을 다룰 때도 entity @id는 `#clinic` 유지 — URL은 `/locations/main`이지만 mainEntity 참조는 `#clinic`. 다지점 비본원 지점 P-014만 `/locations/{slug}#clinic` entity 사용.
94:**`Organization` vs `MedicalClinic`의 책임 분리**:
95:- `Organization`: 법인 정체성 (ClinicProfile의 `legalEntityName`·`founder`·`foundingDate`·`awards`·`memberOf`·`affiliatedInstitutes`)
96:- `MedicalClinic`: 지점 단위 의료기관 정체성 (LocationProfile의 `address`·`telephone`·`openingHours`·`geo`·`medicalSpecialty` 등). `parentOrganization`으로 `Organization` 참조.
104:| `Article`·`NewsArticle`·`BlogPosting`·`WebPage`·`FAQPage`·`Blog`·`VideoObject`·`ImageObject` 등 CreativeWork 계열 | `Organization`·`MedicalClinic`·`LocalBusiness`·`Physician`·`Person`·`ContactPoint` 등 — Schema.org 표준상 inLanguage 속성 부재 또는 부적합 |
106:> Organization·MedicalClinic·Physician 같은 entity에 inLanguage를 박으면 validator 노이즈. 보조 메타로 헤더의 `<html lang="ko-KR">`·meta inLanguage가 이미 표시함 (SEARCH_STANDARDIZATION § 2.1 정합).
118:| `Organization` | 모든 페이지 (그래프에 1회) | ClinicProfile (C-01) |
119:| `WebSite` | **Home만 풀 엔티티 출력**. 나머지 페이지는 WebPage.isPartOf로 `#website` 참조만 (graph 비대화 방지) | (생성기 자동) |
120:| `WebPage` | 모든 페이지 — 본문 entity | PageMeta (C-06) |
121:| `BreadcrumbList` | Home 제외 모든 페이지 | (생성기 자동, 경로 기반) |
122:| `MedicalClinic` | 본원(`#clinic`) — § 2.5 정책에 따라 페이지별 풀/참조. 다지점 비본원 지점은 P-012·P-014에서 N개 entity | LocationProfile (C-21) |
123:| `LocalBusiness` | **별도 출력 안 함** — `MedicalClinic`이 LocalBusiness sub-class. LocalBusiness 계열 속성(`address`·`openingHoursSpecification`·`geo`·`hasMap`·`potentialAction.ReserveAction`)은 `MedicalClinic` entity 위에서 사용 | (해당 없음 — 데이터는 LocationProfile, 타입은 MedicalClinic) |
124:| `Physician` | P-004 Doctor Profile, Article의 author·reviewedBy | DoctorProfile (C-02) |
125:| `MedicalProcedure` | P-006 Treatment Detail | TreatmentPage (C-03) |
127:| `Article` | P-010 Article Detail | Article (C-04) |
128:| `NewsArticle` | (대체 — News 카테고리) | NewsItem (C-19) |
131:| `ItemList` | List 페이지 (P-003·P-005·P-007·P-009·...) | (생성기 자동) |
133:| `VideoObject` | Article.embeddedMedia[].type=youtube·video, P-010의 contentFormat=video | EmbeddedMedia |
135:| `Person` | Author가 Physician이 아닌 경우 (`authorType` ≠ clinician) — **M0 외 후속** (현재 `Article.author: Ref<C-02>` 만 지원. authorType != clinician 케이스는 데이터 모델 확장 시 합류 — DM 추가) | (선택, M0 외) |
136:| `EducationalOrganization` / `MedicalOrganization` | `affiliatedInstitutes`·`memberOf` 참조 entity | ResearchInstitute, Affiliation |
142:| `ReserveAction` | **MedicalClinic.potentialAction** — Conditional: **(a) `#clinic` 풀 entity가 출력되는 페이지에서만** + **(b) `LocationProfile.reservationChannels` 중 예약 채널이 실제 존재하거나 페이지/시술 CTA가 예약 채널일 때**. LocalBusiness 별도 미사용 | ReservationPage, LocationProfile.reservationChannels |
156:| `HealthAndBeautyBusiness` (단독·병행) | **fail** | MedicalClinic만 사용 |
167:- `Article` / `BlogPosting` / `NewsArticle` — 기사 리치 카드
168:- `BreadcrumbList` — 빵부스러기 노출
170:- `LocalBusiness` 계열 (`MedicalClinic` 포함) — 로컬 비즈니스 패널 (Google 비즈니스 프로필 연계)
171:- `Person` / `Physician` — 의료진 카드 (제한적)
173:> `HowTo`는 미사용 (M0 사용 계획 없음). 미래에 P-006 `visitFlow`·`process`를 HowTo로 매핑할 경우 카탈로그·결정표·의료 리스크 룰을 함께 추가해야 함 (SM 신규 필요).
176:- `Organization` — 법인 identity
177:- `MedicalClinic` 본원·지점 — 의료기관 entity
178:- `Physician` — 의료진 entity (Rich Results는 제한적)
180:- `WebPage` — 페이지 entity
199:| `Organization`·`WebSite` (Home)·`WebPage`·`BreadcrumbList` (Home 제외) | Allowed | |
200:| `MedicalClinic` | **§ 2.5 정책에 따라 full 또는 ref** | 본원(`#clinic`) 풀/참조 위치는 § 2.5 SoT. 다지점 비본원 지점은 P-012·P-014에 풀 |
201:| `Physician` 풀 엔티티 | Conditional | P-004 상세 페이지에서만 풀, 다른 페이지는 참조 |
202:| `MedicalProcedure` 풀 엔티티 | Conditional | P-006 상세 페이지에서만 풀 |
204:| `Article` 풀 엔티티 | Conditional | P-010 상세 페이지에서만 풀 |
205:| `FAQPage` | Conditional | P-011 또는 FAQ 블록 포함 페이지 (P-006·P-008·P-010 등) |
206:| `ItemList` | Conditional | List 페이지 (P-003·P-005·P-007·P-009) |
207:| `VideoObject` | Conditional | Article.contentFormat=video 또는 embeddedMedia.type∈{youtube, vimeo, external-video} (최소 필드 충족 시) |
208:| `ReserveAction` | Conditional | **(a) `#clinic` 풀 entity가 출력되는 페이지** + **(b) `LocationProfile.reservationChannels` 중 예약 채널(type∈{naver-reservation, video-consultation, external}) 있거나 페이지/시술 CTA가 예약 채널일 때** — 두 조건 모두 충족 시 `MedicalClinic.potentialAction`으로 출력 |
216:| `HealthAndBeautyBusiness` | **Blocked (fail)** | 의료기관 사이트는 `MedicalClinic`만 사용. 단독·병행 모두 미사용 |
218:| `Quiz` (비표준)·`MedicalDiagnosis` | **Blocked** | P-106 Self-test는 `WebPage`·`MedicalWebPage`로 |
219:| `Person` — Organization.founder | Allowed (inline) | 항상 허용 — Organization 내부에서 founder를 Person으로 inline 표현 |
220:| `Person` — Article.author (authorType != clinician) | M0 외 후속 | M0는 Physician만 지원. 데이터 모델 확장 시 합류 |
227:- **풀 entity (Full)**: graph[]에 entity 정의 — `@type`, `@id`, 필드 모두 출력
228:- **참조 (Ref)**: graph[]에 entity 정의 없음. 다른 entity의 속성에 `{"@id": "..."}` 참조만 (예: `Article.publisher = {"@id": "#organization"}`)
232:| `Organization` (`#organization`) | **모든 페이지에 풀 entity 1회 포함** | P-001 ~ P-014, P-101 ~ P-106 |
233:| `WebSite` (`#website`) | **Home만 풀 entity** | P-001 |
234:| `WebSite` 참조 | **Home 외 모든 페이지 WebPage.isPartOf로 참조** | P-002 ~ |
235:| `MedicalClinic` (`#clinic` 본원) | **풀 entity 출력** — 위치·시간·연락이 본문에 의미 있게 표시되거나 예약 action이 풀 entity로 필요한 페이지 | P-001(Home), P-002(About), P-006(Treatment Detail — 예약 CTA·담당 의료진 연계), P-012(Contact), P-014(Location main), P-105(Reservation — 예약 action 풀 필요) |
236:| `MedicalClinic` 참조 | **참조만** — 위치 정보가 페이지 본문에 표시되지 않는 페이지 | P-003(Doctors List), P-004(Doctor Profile), **P-005(Treatments List — 시술 카드 목록 위주, 위치 슬롯 없음)**, P-007/8(Conditions), P-009/10(Articles), P-011(FAQ), P-013(Legal), P-101(Reviews), P-102(Pricing), P-103(Facilities), P-104(News), P-106(Self-test) |
237:| `MedicalClinic` 지점 (`/locations/{slug}#clinic`) | 다지점만, P-012·P-014에 풀 entity | 다지점 P-012·P-014 |
238:| `BreadcrumbList` | **Home 제외 모든 페이지 풀** | P-002 ~ |
239:| `WebPage` | **모든 페이지 풀** (각 페이지의 본문 entity) | 전 페이지 |
240:| `Physician`, `MedicalProcedure`, `MedicalCondition`, `Article`, `FAQPage` | 상세 페이지에서 풀, 다른 페이지(목록·연관 참조)에서 참조 또는 inline 최소 | § 3 참조 |
250:### P-001. Home
253:1. `Organization` (ClinicProfile)
254:2. `MedicalClinic` (LocationProfile main) — 본원
256:4. `WebPage` (Home의 본문 entity)
258:**Organization 필드 매핑**:
262:| `@type` | `"Organization"` |
263:| `@id` | `https://{domain}/#organization` |
274:| `memberOf` | `memberOf[]` → `Organization`(학회) |
275:| `subOrganization` | `affiliatedInstitutes[]` → `Organization`(연구소) |
280:**MedicalClinic 필드 매핑 (본원, LocationProfile main)**:
282:| Schema 필드 | 출처 (LocationProfile main) |
284:| `@type` | `"MedicalClinic"` |
285:| `@id` | `https://{domain}/#clinic` |
287:| `parentOrganization` | `{"@id": "https://{domain}/#organization"}` |
293:| `medicalSpecialty` | ClinicProfile.medicalSpecialty 또는 LocationProfile 특화 |
301:  "@id": "https://{domain}/#website",
304:  "publisher": { "@id": "https://{domain}/#organization" },
321:**다른 페이지의 WebSite 참조**: WebPage 엔티티에 `isPartOf: { "@id": "https://{domain}/#website" }` 참조만. 풀 엔티티 미출력.
323:**WebPage 필드**: PageMeta 매핑 (title·description·canonical·image) + `isPartOf: {@id: "#website"}` (Home 외).
325:**BreadcrumbList**: Home에는 미적용.
329:### P-002. About
332:1. `Organization` (법인 identity 풀필드)
333:2. `MedicalClinic` (본원 — 주소·시간·연락 SoT)
334:3. `BreadcrumbList`
335:4. `WebPage` (about page)
337:**Organization**: P-001과 동일하되 **풀필드 노출** (about에서 가장 풍부) — `legalName`·`founder`·`foundingDate`·`award`·`memberOf`·`subOrganization`·`sameAs` 모두 포함. **`address`는 매핑하지 않음** — LocationProfile/MedicalClinic이 SoT.
339:**mediaCoverage 처리**: Schema.org `Organization`에 `mediaCoverage` 표준 속성이 없으므로 직접 매핑 안 함. 대신:
341:- 본문에 별도 `CreativeWork[]` 또는 `Article[]` entity로 표현 (외부 매체 기사의 경우 `isBasedOn`/`citation`)
344:**BreadcrumbList**:
347:  "@type": "BreadcrumbList",
357:### P-003. Doctors List
360:1. `Organization` — **[풀]**
361:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
362:3. `WebPage` (list page) — **[풀]**, `isPartOf: #website`
363:4. `BreadcrumbList` — **[풀]**
364:5. `ItemList` (의료진 목록) — **[풀]** — `itemListElement[]`에 최소 inline 필드 + `@id` 참조
369:  "@id": "https://{domain}/doctors#itemlist",
375:        "@type": "Physician",
376:        "@id": "https://{domain}/doctors/hong#physician",
387:> 정책 변경 (피드백 반영): 목록에는 `name`·`url`·`image`·`jobTitle` 등 **최소 inline 필드** 포함 (검색 엔진이 외부 fragment를 따라가지 않는 경우 대응). 각 Physician 풀필드는 P-004 상세 페이지의 그래프에서 정의.
391:### P-004. Doctor Profile
394:1. `Organization` — **[풀]**
395:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
396:3. `Physician` (DoctorProfile 풀필드) — **[풀]**
397:4. `BreadcrumbList` — **[풀]**
398:5. `WebPage` — **[풀]**, `isPartOf: #website`
400:**Physician 필드 매핑**:
404:| `@type` | `"Physician"` |
405:| `@id` | `https://{domain}/doctors/{slug}#physician` |
413:| `alumniOf` | `education[]` → `EducationalOrganization` |
414:| `worksFor` | `{"@id": "https://{domain}/#organization"}` |
415:| `affiliation` | `affiliations[]` → `Organization` |
424:### P-005. Treatments List
427:1. `Organization` — **[풀]**
428:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5 — 시술 카드 목록 위주, 위치 정보 슬롯 없음)
429:3. `WebPage` — **[풀]**, `isPartOf: #website`
430:4. `BreadcrumbList` — **[풀]**
431:5. `ItemList` — **[풀]** — 최소 inline + `@id` 참조 (P-003과 동일 패턴)
442:        "@id": "https://{domain}/treatments/{slug}#procedure",
454:### P-006. Treatment Detail
457:1. `Organization` — **[풀]**
458:2. `MedicalClinic` (본원) — **[풀]** (§ 2.5 — 예약 CTA·담당 의료진 연계로 풀 entity 필요)
460:4. `BreadcrumbList` — **[풀]**
461:5. `WebPage` — **[풀]**, `isPartOf: #website`
469:| `@id` | `https://{domain}/treatments/{slug}#procedure` |
477:| `bodyLocation` | (해당 시 — 다이어트 한의원은 일반적으로 없음) |
509:1. `Organization` — **[풀]**
510:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
511:3. `WebPage` — **[풀]**, `isPartOf: #website`
512:4. `BreadcrumbList` — **[풀]**
513:5. `ItemList` — **[풀]** — 최소 inline (`name`·`url`·`description`) + `MedicalCondition` `@id` 참조 (P-003·P-005 패턴 동일)
518:1. `Organization` — **[풀]**
519:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
521:4. `BreadcrumbList` — **[풀]**
522:5. `WebPage` — **[풀]**, `isPartOf: #website`
530:| `@id` | `https://{domain}/conditions/{slug}#condition` |
538:### P-009. Articles List
541:1. `Organization` — **[풀]**
542:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
543:3. `WebPage` — **[풀]**, `isPartOf: #website`
544:4. `BreadcrumbList` — **[풀]**
556:        "@type": "Article",
557:        "@id": "https://{domain}/insights/{cat}/{slug}#article",
558:        "headline": "{Article.headline}",
560:        "image": "{Article.coverImageUrl}",
561:        "datePublished": "{Article.datePublished}",
562:        "author": { "@id": "https://{domain}/doctors/{author.slug}#physician" }
573:  "@id": "https://{domain}/insights#blog",
574:  "name": "{Articles List title}",
575:  "publisher": { "@id": "https://{domain}/#organization" },
577:    { "@id": "https://{domain}/insights/{cat}/{slug}#article" }
583:### P-010. Article Detail
586:1. `Organization` — **[풀]** (§ 2.5: 모든 페이지 풀)
587:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
588:3. `Article` — **[풀]**
589:4. `Physician` (author) — **[참조 + inline 최소: name·image·jobTitle]** (실효성 위해 인라인)
590:5. `Physician` (reviewedBy, 해당 시) — **[참조 + inline 최소]**
591:6. `BreadcrumbList` — **[풀]**
592:7. `WebPage` — **[풀]**, `isPartOf: #website`
596:**Article 필드 매핑**:
598:| Schema 필드 | 출처 (Article) |
600:| `@type` | `"Article"` (또는 `"BlogPosting"`·`"NewsArticle"` 변형) |
601:| `@id` | `https://{domain}/insights/{cat}/{slug}#article` |
605:| `articleSection` | ArticleCategory.name |
608:| `author` | `{"@id": "https://{domain}/doctors/{author.slug}#physician"}` |
609:| `editor` | `reviewedBy` (해당 시) → Physician @id |
610:| `publisher` | `{"@id": "https://{domain}/#organization"}` |
611:| `mainEntityOfPage` | `{"@id": "https://{domain}{path}#webpage"}` |
617:| `about` | 관련 시술·질환 entity (`relatedTreatments`·`relatedConditions`) @id |
625:  "name": "{EmbeddedMedia.title 또는 Article.headline}",
626:  "description": "{EmbeddedMedia.caption 또는 Article.summary}",
627:  "thumbnailUrl": "{Article.coverImageUrl 또는 EmbeddedMedia 추출 썸네일}",
628:  "uploadDate": "{Article.datePublished}",
641:**Note**: Article의 `contentSource` (original/syndicated/republished)와 `externalUrl`은 schema 직접 매핑 X. `republished`·`syndicated`인 경우 `isBasedOn`: `externalUrl`로 표현.
646:1. `Organization` — **[풀]**
647:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
649:4. `BreadcrumbList` — **[풀]**
650:5. `WebPage` — **[풀]**, `isPartOf: #website`
652:**FAQPage**: 위 P-006 FAQPage와 동일 구조. 페이지 전체가 Question 모음일 때 `mainEntity` 배열.
654:### P-012. Contact / Visit (Conversion Hub)
657:1. `Organization` — **[풀]**
658:2. `MedicalClinic` (본원 `#clinic`) — **[풀]** (§ 2.5 — Conversion Hub 핵심 entity)
659:3. (다지점 시) `MedicalClinic` (비본원 지점 `/locations/{slug}#clinic`) — **[풀]** 각각
660:4. `BreadcrumbList` — **[풀]**
661:5. `WebPage` — **[풀]**, `isPartOf: #website`
662:6. (다지점) `ItemList` — **[풀]** → 각 지점 `MedicalClinic` @id 참조
669:    { "@type": "Organization", "@id": "https://{domain}/#organization", ... },
670:    { "@type": "MedicalClinic", "@id": "https://{domain}/#clinic", ... },      // 본원
671:    { "@type": "MedicalClinic", "@id": "https://{domain}/locations/gangnam#clinic", ... },
672:    { "@type": "MedicalClinic", "@id": "https://{domain}/locations/bundang#clinic", ... },
680:각 CTAConfig는 `MedicalClinic.potentialAction` 또는 `contactPoint`로 변환.
699:### P-013. Legal / Policy
702:1. `Organization` — **[풀]**
703:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
704:3. `WebPage` — **[풀]**, `isPartOf: #website`
705:4. `BreadcrumbList` — **[풀]**
707:**Note**: 정책 페이지는 검색 노출 우선순위 낮음. `MedicalSchema`·`Article` 적용 안 함. 단순 `WebPage`로 표현.
709:### P-014. Location / Branch Detail
712:1. `Organization` — **[풀]**
713:2. `MedicalClinic` (해당 지점 풀필드) — **[풀]** — `parentOrganization` Organization 참조
714:   - **단지점 main**: `@id` = `https://{domain}/#clinic` (URL은 `/locations/main`이지만 entity는 본원 `#clinic`과 동일)
715:   - **다지점 비본원**: `@id` = `https://{domain}/locations/{slug}#clinic` (별도 entity)
716:3. `BreadcrumbList` — **[풀]**
717:4. `WebPage` — **[풀]**, `isPartOf: #website`
719:**MedicalClinic 필드 매핑 (지점 LocationProfile)**:
721:P-001의 본원 `MedicalClinic`과 동일 구조 + 다음:
725:| `branchOf` | `{"@id": "https://{domain}/#organization"}` |
726:| `parentOrganization` | 동일 |
729:> 본원(`@id: #clinic`)과 지점(`@id: /locations/{slug}#clinic`)은 다른 entity. `branchOf`는 Schema.org의 LocalBusiness 계열에서 더 적합 (MedicalClinic은 `parentOrganization`을 우선).
736:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀].
740:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀].
744:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀]. 사진은 본문 갤러리 또는 `WebPage.image: ImageObject[]`로 표현 (`ImageGallery`는 사용 안 함 — 카탈로그·결정표 미등재).
747:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀] + (개별 News 항목) `NewsArticle` 또는 `Article`[풀].
751:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[**풀**, § 2.5 — 예약 action 풀 entity 필요] + `WebPage`[풀] + `BreadcrumbList`[풀].
752:`MedicalClinic.potentialAction`에 `ReserveAction` 상세 필드 포함 (P-012와 유사하되 예약 안내 페이지답게 채널·시간·절차 등 상세 명시). ReserveAction은 독립 풀 entity가 아닌 `MedicalClinic.potentialAction`에 중첩되는 구조.
755:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage` 또는 `MedicalWebPage`[풀] + `BreadcrumbList`[풀]. **`Quiz`·`MedicalDiagnosis`·`MedicalRiskEstimator`는 fail** (§ 2.4·§ 8). 일반 정보 형태의 `MedicalWebPage` 또는 단순 `WebPage`만.
763:| C-01 `ClinicProfile` | `Organization` | 브랜드·법인 identity. 위치·시간·연락은 LocationProfile로 위임 |
764:| C-02 `DoctorProfile` | `Physician` | M0는 `Article.author: Ref<C-02>`만 지원. 비의료인 author(`authorType` != `clinician`) → `Person` 매핑은 데이터 모델 확장 후 합류 (M0 외) |
766:| C-04 `Article` | `Article` (또는 `BlogPosting`·`NewsArticle` 변형). VideoObject 동반 가능 | `contentSource` → `isBasedOn` |
768:| C-06 `PageMeta` | `WebPage` 필드 일부 + head meta tag | 상세는 `SEARCH_STANDARDIZATION.md` |
772:| C-10 `ComplianceRecord` | (비매핑 — 운영 메타) | Git 사본의 `publishedAt`·`lastModifiedAt`은 Article.datePublished/dateModified로 사용됨 |
778:| C-16 `LegalDocument` | `WebPage`만 (정책 페이지는 검색 노출 우선순위 낮음) | |
780:| C-18 `FacilitiesPage` | `WebPage` + 사진 갤러리 | |
781:| C-19 `NewsItem` | `Article` 또는 `NewsArticle` | event-price 카테고리는 schema 신중 |
782:| C-20 `ReservationPage` | `MedicalClinic.potentialAction.ReserveAction` (LocalBusiness 별도 출력 안 함) | |
783:| C-21 `LocationProfile` | `MedicalClinic` (지점 단위 별도 entity. LocalBusiness sub-class) | 본원·지점 각각 |
784:| C-22 `ArticleCategory` | (비매핑) — Article.articleSection 문자열 | |
825:| `map` | `MedicalClinic.hasMap`: targetUrl |
840:  pageType: PageType;         // P-001 ~ P-014, P-101 ~ P-106
845:  mainLocation: LocationProfile;  // C-21 main — 전 페이지 공통 (Organization 외 본원 entity)
846:  allLocations: LocationProfile[]; // 다지점 시. P-012·P-014 등에서 사용
847:  breadcrumbItems: BreadcrumbItem[]; // (Home 제외) BreadcrumbList 생성용
861:| P-004 Doctor Profile | `doctor: DoctorProfile` |
862:| P-006 Treatment Detail | `treatment: TreatmentPage`, `relatedDoctors: DoctorProfile[]`, `relatedConditions: MedicalConditionPage[]`, `faqs: FAQ[]` |
864:| P-010 Article Detail | `article: Article`, `author: DoctorProfile`, `reviewer?: DoctorProfile`, `relatedArticles: Article[]`, `relatedTreatments: TreatmentPage[]` |
866:| P-014 Location Detail | `location: LocationProfile`, `doctorsAtLocation: DoctorProfile[]`, `treatmentsAvailable: TreatmentPage[]` |
867:| List 페이지 (P-003·P-005·P-007·P-009) | `items: T[]` (해당 entity 메타) |
891:| 모든 페이지 | `Organization`·`WebPage`[풀] + PageMeta의 `title`·`description` + **resolved canonical URL** (PageMeta.canonical 또는 SchemaInput.canonicalUrl로 결정. 둘 다 부재 시 빌드 실패) |
892:| Home 제외 | `BreadcrumbList` |
893:| P-001·P-002·P-006·P-012·P-014 (필수) / P-105 (활성화 시) | **`MedicalClinic` 풀** (§ 2.5 풀 지정) + `name`·`address`·`telephone`·`openingHoursSpecification` |
894:| P-004 | `Physician` + `name`·`jobTitle`·`medicalSpecialty`·`hasCredential` |
895:| P-006 | `MedicalProcedure` + `name`·`description`·`howPerformed` |
897:| P-010 | `Article` + `headline`·`description`·`datePublished`·`author`·`publisher` |
907:| **빌드 게이트 (Sanity)** | JSON-LD 파싱 가능 여부·@id uniqueness·@context 유효성 | 빌드 실패 |
917:| **warning** | 출력 시 경고 + 어드민 검토 큐로 전달 (빌드는 통과) | 외부 위젯 schema와 `@id` 충돌 / VideoObject 권장 필드 누락 (필수는 충족하나 권장 미충족) / 본문 길이 권장 미달 등 — 비차단 운영 관찰 항목 |
935:| `Quiz` (비표준)·진단형 schema | **fail** | P-106 Self-test는 `WebPage`·`MedicalWebPage`로 |
936:| `HealthAndBeautyBusiness` (단독·병행) | **fail** | 의료기관 사이트는 MedicalClinic만 |
947:| SM-01 | `Article` vs `BlogPosting` vs `NewsArticle` 변형 선택 정책 — `articleType`별 자동 매핑 | 후속 결정 |
951:| SM-05 | ~~다지점 시 본원 `@id` alias 처리~~ | **v0.3 해소** — `/#clinic` 단일 entity로 고정. alias 사용 안 함 (§ 1.4) |
952:| SM-06 | P-106 Self-test의 `MedicalWebPage` 세부 필드 정책 — `medicalAudience`·`lastReviewed`·`reviewedBy` 등 활용 범위. (Quiz는 fail로 확정됨 — § 2.4·§ 8) | P-106 도입 시 |
954:| SM-08 | Article의 `contentSource: republished` 시 `isBasedOn` vs `citation` 사용 정책 | 후속 결정 |
963:| 2026-05-14 | v0.2 | **피드백 정합 정정**: (1) **C-15/CT-15 혼동 → C-15로 통일** (SchemaInput은 데이터 계약, CT 아님), (2) **inLanguage 정책 좁힘** — CreativeWork·페이지 entity에만, (3) **MedicalClinic 사용처 정합** — § 2.1 카탈로그 "전 페이지 본원 1개 포함" 명시 (그래프 정의와 일치), (4) **P-002 About 정정** — address 매핑 제거(LocationProfile SoT), mediaCoverage는 sameAs 또는 CreativeWork 보조로, (5) **ItemList inline 필드 추가** — P-003/P-005/P-007/P-009에 name·url·image·기타 최소 필드 + @id 참조 병행, (6) **List 페이지 그래프에 WebPage 추가** — § 7.1 검증 룰과 정합 (이전 누락), (7) **evidenceNotes 매핑 보수화** — `MedicalStudy` → `citation`/`CreativeWork` (EvidenceNote 필드로 MedicalStudy 구성 부족), (8) **§ 2.3 신규** — Schema Rich Results 실효 vs Entity 의미 전달 분류 |
964:| 2026-05-14 | v0.3 | **빌드 가능 규칙화** (피드백 10건): (1) **§ 1.1 Core 출력 범위 한정** — 외부 위젯 schema 충돌 가능성 명시, (2) **§ 1.4 본원 @id 일관성 (SM-05 해소)** — `/#clinic` 단일 entity, 다지점 비본원만 `/locations/{slug}#clinic`, alias 금지, (3) **§ 2.1 WebSite Home 전용** — 다른 페이지는 `isPartOf` 참조만, (4) **§ 2.1 Person M0 외 후속** — authorType != clinician은 데이터 모델 확장 후, (5) **§ 2.4 신규 — Allowed/Conditional/Blocked 3단계 분류**, (6) **§ 3 P-010 graph 구성 [풀]/[참조+inline]/[참조만] 표기 명확화** + VideoObject Google Rich Results 최소 필드 (name·description·thumbnailUrl·uploadDate·contentUrl/embedUrl), (7) **§ 5.1 dayOfWeek enum 변환표** + specialClosures 기본 미출력 정책, (8) **§ 7.2 빌드 게이트 vs 운영 모니터링 분리** — 공식 validator는 모니터링·수동 QA로, (9) **§ 7.3 룰 레벨 분류 (fail/warning/content-gate)** + **§ 8 표에 룰 레벨 명시** |
965:| 2026-05-14 | v0.4 | **잔재 정리·룰 충돌 해소** (피드백 8건): (1) **§ 2.3 A/B 카테고리 풀명세 재펼침** ("이전과 동일" 잔재 제거), (2) **inLanguage 잔재 4곳 제거** — Organization·MedicalClinic·Physician·MedicalProcedure 매핑 표, (3) **MedicalRiskFactor 룰 충돌 해소** — schema 출력은 **fail로 통일**, 본문 표현(원인·위험요인)은 별도 content-gate 분리, (4) **§ 9 미결정 정리** — SM-05·SM-07 "해소" 표시, (5) **P-106 Quiz 제거** — `WebPage`/`MedicalWebPage`만, (6) **P-103 ImageGallery 제거** — 본문 갤러리 또는 `WebPage.image: ImageObject[]`, (7) **§ 5 C-02 Person 후속** 명시 (M0 외), (8) **§ 7.3 warning 예시에서 MedicalRiskFactor 제거** (fail로 통일) — `MedicalIndication` 단정형·`HealthAndBeautyBusiness` 단독 사용 등으로 교체 |
966:| 2026-05-14 | v0.5 | **미세 잔재 해소·룰 단순화** (피드백 7건): (1) **P-008 riskFactor → MedicalRiskFactor 행 삭제** — fail 정책 정합. causes[]는 description 보조·본문 표현으로, (2) **P-008 주석 정정** — "신중" → "schema 출력 안 함, 본문은 content-gate", (3) **HealthAndBeautyBusiness fail로 통일** (§ 2.4·§ 8 모두) — 단독·병행 모두 미사용, (4) **MedicalIndication fail로 통일** — Schema 출력 금지, 본문 효능 표현만 content-gate, (5) **HowTo Rich Results A 목록에서 제거** — 미사용. 미래 확장 시 카탈로그·결정표·의료 리스크 룰 추가, (6) **§ 2.4에 Person 두 케이스 분리** — Organization.founder는 Allowed inline / Article.author (non-clinician)는 M0 외 후속, (7) **VideoObject 필수 필드 표현 명확화** — `name·description·thumbnailUrl·uploadDate` 4개 필수 + `contentUrl`/`embedUrl` 중 1개 |
967:| 2026-05-14 | v0.6 | **정책 표 정합화** (피드백 7건): (1) **§ 2.5 신설 — 공통 entity별 페이지 출력 정책 (단일 SoT)** — Organization/WebSite/MedicalClinic의 풀 entity vs 참조 위치 명시. § 7.1 룰 checker가 본 표 기준으로 검증, (2) "풀 entity vs 참조" 용어 정의 — graph[]에 entity 정의 여부 명확, (3) **§ 0 요약 일관화** — "신중하게" → fail로, validator 표현을 § 7.2와 일치 (자체 checker = 빌드, 공식 validator = 모니터링), (4) **LocalBusiness 별도 출력 제거** — § 2.1·§ 5 C-20 정정. `MedicalClinic`이 LocalBusiness sub-class이므로 `@type: "MedicalClinic"`만 사용, LocalBusiness 계열 속성 활용, (5) **SearchAction Conditional** — `/search` 라우트 부재 시 미출력 (M0 미출력, 검색 기능 활성화 시 합류), (6) **§ 7.3 warning 예시 교체** — MedicalIndication·HealthAndBeautyBusiness 제거(둘 다 fail). 비차단 항목(외부 위젯 @id 충돌·VideoObject 권장 필드 누락·본문 길이 미달 등)으로 교체 |
968:| 2026-05-14 | v0.7 | **§ 2.5 SoT 기준 일괄 동기화** (피드백 7건): (1) **§ 2.1 SearchAction Conditional 명시**, **ReserveAction을 LocalBusiness → MedicalClinic.potentialAction**으로 정정, (2) **§ 2.4 MedicalClinic 결정 변경** — "본원 1개 전 페이지" → "§ 2.5 정책에 따라 full 또는 ref", (3) **§ 2.5 P-105 Reservation 풀 entity로 재분류**, P-101~P-106 일괄 ref 거친 표현 세분화, (4) **§ 3·§ 4 페이지별 graph 구성 [풀]/[참조]/[참조+inline] 표기 일괄 적용** — P-003·P-004·P-007·P-008·P-009·P-010·P-011·P-013·P-101~P-106, (5) **§ 7.1 검증 룰 정정** — "PageMeta.canonical 필수" → "**resolved canonical URL 필수** (PageMeta.canonical 또는 SchemaInput.canonicalUrl로 결정)" |
969:| 2026-05-14 | v0.8 | **§ 2.5 cascade 마무리** (피드백 6건): (1) **P-005 MedicalClinic [참조만]로 변경** — PAGE_TYPES § 3 P-005에 위치 정보 슬롯 없음. § 2.5 풀 지정 페이지에서 제거, (2) **P-005·P-006·P-012·P-014 [풀]/[참조] 표기 적용** — v0.7 일괄 적용 시 누락된 페이지 보완, (3) **P-014 @id 분기 명시** — 단지점 main = `#clinic` (본원 entity와 동일), 다지점 비본원 = `/locations/{slug}#clinic` (별도 entity), (4) **§ 7.1 일반 검증 룰 추가** — "§ 2.5에서 풀로 지정된 entity는 해당 페이지 필수" (룰 checker의 일반 룰. 페이지별 명시는 보조), (5) **§ 7.1 MedicalClinic 풀 페이지 목록 확장** — P-001·P-002·P-006·P-012·P-014·P-105 (이전 P-012·P-014만), (6) **§ 2.1 ReserveAction Conditional 명확화** — "reservationChannels 또는 페이지 예약 CTA가 실제 있을 때만" |
970:| 2026-05-14 | v0.9 | **Conditional·미결정 다듬기** (피드백 5건): (1) **ReserveAction 조건 § 2.1·§ 2.4 통일** — `(a) #clinic 풀 entity 페이지 + (b) reservationChannels 예약 채널 존재 또는 페이지/시술 CTA가 예약 채널`, (2) **§ 7.1 선택 페이지 검증 단서** — "선택 페이지(P-101~P-106)는 인스턴스에서 활성화된 경우에만 검증" (FeatureModuleConfig·라우트 설정 기준). P-105 등 풀 필수 페이지 목록에 "활성화 시" 명시, (3) **SM-03 수준 낮춤** — 완전 미결정 → "출력 포맷 세부 확정 필요" (정책은 § 5.1에 정의됨), (4) **SM-06 이름 정정** — "Quiz·Self-test schema 모범" → "P-106 Self-test의 `MedicalWebPage` 세부 필드 정책" (Quiz는 fail로 확정) |
971:| 2026-05-14 | v0.10 | **미세 표현 정합** (피드백 4건): (1) § 3 P-001 MedicalClinic potentialAction 행에 "페이지/시술 CTA가 예약 채널일 때"도 포함 명시, (2) § 4 P-105 — "ReserveAction 풀필드" → "**상세 필드 포함** (독립 entity 아닌 MedicalClinic.potentialAction 중첩 구조)", (3) § 7.1 선택 페이지 검증 기준에 **InstanceManifest 추가** — P-103·P-104·P-105는 Instance 결정·P-106은 Feature Module 기반 등 활성화 경로 다양화, (4) **§ 2.2 제목에 "룰 레벨 상세는 § 8" 명시** — fail/warning/content-gate 기조와 정합 |

2026-05-18T03:47:41.925748Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
docs/decisions/M0_BUILD_EXPORT_PLAN.md:9:- `docs/admin/ARCHITECTURE.md` v0.7 § 3 Vertical Slice · § 3.8.1·3.8.2 자동 생성 규칙 · § 3.11 완료 게이트 #1
docs/decisions/M0_BUILD_EXPORT_PLAN.md:20:- `instance_id` 별 별도 git working tree (또는 단일 git repo 안 `instances/<instanceSlug>/` subtree).
docs/admin/ARCHITECTURE.md:391:> 상세 필드는 `docs/admin/DATA_MODEL.md`.
rg: apps/spike-a/userlist.txt: 지정된 파일을 찾을 수 없습니다. (os error 2)

 exited 1 in 826ms:
docs/decisions/M0_BUILD_EXPORT_PLAN.md:9:- `docs/admin/ARCHITECTURE.md` v0.7 § 3 Vertical Slice · § 3.8.1·3.8.2 자동 생성 규칙 · § 3.11 완료 게이트 #1
docs/decisions/M0_BUILD_EXPORT_PLAN.md:20:- `instance_id` 별 별도 git working tree (또는 단일 git repo 안 `instances/<instanceSlug>/` subtree).
docs/admin/ARCHITECTURE.md:391:> 상세 필드는 `docs/admin/DATA_MODEL.md`.
rg: apps/spike-a/userlist.txt: 지정된 파일을 찾을 수 없습니다. (os error 2)

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content packages/core-content/src/schema.ts | Select-Object -Index 46..285' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/core/SEARCH_STANDARDIZATION.md | Select-Object -Index 174..251' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/core/SEARCH_STANDARDIZATION.md | Select-Object -Index 345..372' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg --files | rg \"(userlist|manifest\\.ts|ARCHITECTURE\\.md|M0_BUILD_EXPORT_PLAN\\.md)"'$"' in C:\Users\assag\solution\website-exposure
 succeeded in 884ms:
docs\admin\ARCHITECTURE.md
packages\migrations-runner\src\manifest.ts
docs\decisions\M0_BUILD_EXPORT_PLAN.md
docs\ARCHITECTURE.md

2026-05-18T03:47:50.237820Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 1.1 seconds
Output:
[31;1mSelect-Object: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … t docs/core/SEARCH_STANDARDIZATION.md | Select-Object -Index [36;1m174..251[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                                ~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot bind parameter 'Index'. Cannot convert value "174..251" to type "System.Int32". Error: "The input string '174..251' was not in a correct format."[0m

 exited 1 in 1065ms:
[31;1mSelect-Object: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … t docs/core/SEARCH_STANDARDIZATION.md | Select-Object -Index [36;1m174..251[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                                ~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot bind parameter 'Index'. Cannot convert value "174..251" to type "System.Int32". Error: "The input string '174..251' was not in a correct format."[0m

 exited 1 in 1056ms:
[31;1mSelect-Object: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … t docs/core/SEARCH_STANDARDIZATION.md | Select-Object -Index [36;1m345..372[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                                ~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot bind parameter 'Index'. Cannot convert value "345..372" to type "System.Int32". Error: "The input string '345..372' was not in a correct format."[0m

 exited 1 in 1083ms:
[31;1mSelect-Object: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … nt packages/core-content/src/schema.ts | Select-Object -Index [36;1m46..285[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                                 ~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot bind parameter 'Index'. Cannot convert value "46..285" to type "System.Int32". Error: "The input string '46..285' was not in a correct format."[0m

2026-05-18T03:47:50.238561Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 1.1 seconds
Output:
[31;1mSelect-Object: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … nt packages/core-content/src/schema.ts | Select-Object -Index [36;1m46..285[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                                 ~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot bind parameter 'Index'. Cannot convert value "46..285" to type "System.Int32". Error: "The input string '46..285' was not in a correct format."[0m

2026-05-18T03:47:50.241112Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 1.1 seconds
Output:
[31;1mSelect-Object: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … t docs/core/SEARCH_STANDARDIZATION.md | Select-Object -Index [36;1m345..372[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                                ~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot bind parameter 'Index'. Cannot convert value "345..372" to type "System.Int32". Error: "The input string '345..372' was not in a correct format."[0m

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content packages/core-content/src/schema.ts | Select-Object -Skip 45 -First 245' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/core/SEARCH_STANDARDIZATION.md | Select-Object -Skip 174 -First 80' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/core/SEARCH_STANDARDIZATION.md | Select-Object -Skip 345 -First 28' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content packages/migrations-runner/src/manifest.ts' in C:\Users\assag\solution\website-exposure
 succeeded in 762ms:

`InstanceManifest.aiCrawlerPolicy`로 인스턴스별 명시 결정. **Core 자동 적용 기본값 없음**. 빌드 시 미설정이면 fail.

| 정책 | A. 일반 검색 | B. AI 검색 인덱싱 | C. User-triggered fetch (best-effort) | D. AI 학습 | 법무 승인 |
|---|:---:|:---:|:---:|:---:|---|
| `allow` | Allow | Allow | Allow | Allow | **`aiCrawlerLegalApproved: true` 필수 (fail-gate)** |
| `disallowTraining` (**권장 기본**) | Allow | Allow | Allow | **Disallow** | 승인 기록 권장 (warning 수준) |
| `disallowAll` | Allow | **Disallow** | **Disallow** | **Disallow** | 승인 기록 권장 |
| `custom` | 인스턴스 정의 (§ 3.4 merge/replace) | | | | 운영자 검토 |

> **C 계열 (User-triggered fetch) 주의**: 제품별 robots.txt 해석 정책이 일반 검색·학습 크롤러와 다를 수 있음. `disallowAll`을 선택해도 **C 계열에 대한 완전 차단을 보장하는 수단으로 보지 않는다** — 각 제품 공식 문서·고객지원 채널 확인 권장.
> **starter template**은 `disallowTraining` 제안 — 의료기관 사이트의 환자 후기·전후사진·브랜드 콘텐츠 학습 위험 회피 + 검색·답변 노출 유지.

### 3.3 정책별 출력 예시

#### `aiCrawlerPolicy: disallowTraining` (권장 기본)

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

> `InstanceManifest.experimentalAiBots: true`(default `false`)일 때만 `meta-externalagent` 등 외부 관측 기반 user-agent가 robots.txt에 포함된다. 공식 검증된 user-agent만 기본 출력.


 succeeded in 766ms:

| 페이지 타입 | changefreq | priority |
|---|---|---|
| P-001 Home | weekly | 1.0 |
| P-002 About | monthly | 0.8 |
| P-003 Doctors List | monthly | 0.7 |
| P-004 Doctor Profile | monthly | 0.7 |
| P-005 Treatments List | monthly | 0.8 |
| P-006 Treatment Detail | monthly | 0.8 |
| P-007 Conditions List | monthly | 0.6 |
| P-008 Condition Detail | monthly | 0.6 |
| P-009 Articles List | weekly | 0.6 |
| P-010 Article Detail | monthly | 0.5 |
| P-011 FAQ | monthly | 0.5 |
| P-012 Contact | yearly | 0.6 |
| P-013 Legal | yearly | 0.3 |
| P-014 Location Detail | monthly | 0.7 |
| P-101 ~ P-106 | yearly | 0.4 |

### 4.4 lastmod 출력

- `ContentEntity.@updatedAt` (DATA_MODEL § 2.2) 기반 ISO 8601 날짜
- ClinicProfile·LocationProfile 등 정적 페이지는 `@updatedAt`
- **Article**(P-010)은 `Article.dateModified` 우선
- **Treatment**(P-006)·**Condition**(P-008)은 페이지 계약에 명시적 `dateModified` 필드가 있으면 사용, 없으면 공통 `@updatedAt`으로 fallback (§ 2.3 정합 — 현재 C-03·C-11에 명시 필드 미정의)

### 4.5 sitemap 인덱스 (대규모 시)


 succeeded in 754ms:
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
 * orderedMigrations — LOCATION_LEGAL_PLAN v1.1 § 6 의존성 9단계 (C0003 doctor_profile 포함 — LLC-15 patch).
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

 succeeded in 783ms:
export const clinicProfile = pgTable(
  "clinic_profile",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull().default("clinic"),
    name: text("name").notNull(),
    alternateName: text("alternate_name"),
    legalEntityName: text("legal_entity_name"),
    slogan: text("slogan"),
    description: text("description").notNull(),
    longDescription: text("long_description"),
    foundingDate: date("founding_date"),
    founder: text("founder"),
    logoUrl: text("logo_url").notNull(),
    ogImageUrl: text("og_image_url").notNull(),
    businessRegistrationNumber: text("business_registration_number"),
    // LL-SCHEMA-07~10 + cycle1 LL-14·20: policy 변수 4 column
    policyContactPerson: text("policy_contact_person"),
    policyContactEmail: text("policy_contact_email"),
    policyContactPhone: text("policy_contact_phone"),
    policyEffectiveDate: date("policy_effective_date"),
    // LL-SCHEMA-12 + cycle1 LL-02 + cycle3·4 LL-38·48·50: primary_ctas JSONB array (CT-03 SoT)
    primaryCtas: jsonb("primary_ctas").notNull().default(sql`'[]'::jsonb`),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    nameLen: check("clinic_profile_name_length", sql`length(${t.name}) BETWEEN 1 AND 100`),
    descLen: check("clinic_profile_description_length", sql`length(${t.description}) BETWEEN 80 AND 300`),
    slugRegex: check("clinic_profile_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
    brnRegex: check("clinic_profile_brn_regex", sql`${t.businessRegistrationNumber} IS NULL OR ${t.businessRegistrationNumber} ~ '^[0-9]{3}-[0-9]{2}-[0-9]{5}$'`),
    // LL-SCHEMA-08 + cycle1 LL-20: policy_contact_email regex + phone format (한국 + 국제 +82)
    policyEmailRegex: check("clinic_profile_policy_email_regex", sql`${t.policyContactEmail} IS NULL OR ${t.policyContactEmail} ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'`),
    policyPhoneFormat: check("clinic_profile_policy_phone_format", sql`${t.policyContactPhone} IS NULL OR ${t.policyContactPhone} ~ '^(\\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}$'`),
    primaryCtasArray: check("clinic_profile_primary_ctas_array", sql`jsonb_typeof(${t.primaryCtas}) = 'array'`),
    // shape 검증 (CT-03 SoT 11종) 은 raw SQL trigger 로 (C0007 migration). Drizzle schema 안 표현 불가.
    instanceSlugUnique: unique("clinic_profile_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("clinic_profile_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("clinic_profile_instance_idx").on(t.instanceId),
  }),
);

// === LocationProfile (C-21·M0-18 country regex) ===

export const locationProfile = pgTable(
  "location_profile",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    streetAddress: text("street_address").notNull(),
    addressLocality: text("address_locality").notNull(),
    addressRegion: text("address_region").notNull(),
    postalCode: text("postal_code").notNull(),
    addressCountry: text("address_country").notNull().default("KR"),
    latitude: numeric("latitude", { precision: 10, scale: 7 }),
    longitude: numeric("longitude", { precision: 10, scale: 7 }),
    phone: text("phone"),
    email: text("email"),
    // LL-SCHEMA-13~14 + cycle1 LL-01 + cycle2 LL-28: parentClinic (C-21 required) composite FK · 전 row NOT NULL
    clinicProfileId: uuid("clinic_profile_id").notNull(),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("location_profile_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
    countryIso: check("location_profile_country_iso", sql`${t.addressCountry} ~ '^[A-Z]{2}$'`),
    latRange: check("location_profile_lat_range", sql`${t.latitude} IS NULL OR (${t.latitude} BETWEEN -90 AND 90)`),
    lngRange: check("location_profile_lng_range", sql`${t.longitude} IS NULL OR (${t.longitude} BETWEEN -180 AND 180)`),
    emailRegex: check("location_profile_email_regex", sql`${t.email} IS NULL OR ${t.email} ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'`),
    // LLC-10 patch: phone regex (한국 + 국제 +82) — form/DB 일치
    phoneFormat: check("location_profile_phone_format", sql`${t.phone} IS NULL OR ${t.phone} ~ '^(\\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}$'`),
    // LL-SCHEMA-14: composite FK — 실 migration 은 raw SQL 에서 DEFERRABLE INITIALLY DEFERRED 적용 (LLC-14 marker).
    // Drizzle ORM 자체는 deferrable 옵션 미지원이므로 schema 생성 시 raw constraint 와 충돌 회피 책임은 migrations-runner 측에 있음 (LL-CASCADE-05).
    clinicFk: foreignKey({
      columns: [t.instanceId, t.clinicProfileId],
      foreignColumns: [clinicProfile.instanceId, clinicProfile.id],
      name: "location_profile_clinic_fk",
    }).onDelete("cascade"),
    instanceSlugUnique: unique("location_profile_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("location_profile_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("location_profile_instance_idx").on(t.instanceId),
    clinicIdx: index("location_profile_clinic_idx").on(t.instanceId, t.clinicProfileId),
  }),
);

// === DoctorProfile (C-02) ===

export const doctorProfile = pgTable(
  "doctor_profile",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    title: text("title"),
    jobTitle: text("job_title"),
    honorific: text("honorific"),
    bio: text("bio"),
    photoUrl: text("photo_url"),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    displayOrder: integer("display_order").notNull().default(0),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("doctor_profile_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
    nameLen: check("doctor_profile_name_length", sql`length(${t.name}) BETWEEN 1 AND 100`),
    instanceSlugUnique: unique("doctor_profile_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("doctor_profile_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("doctor_profile_instance_idx").on(t.instanceId),
    activeOrderIdx: index("doctor_profile_active_order_idx")
      .on(t.instanceId, t.active, t.displayOrder)
      .where(sql`${t.active} = true`),
  }),
);

// === TreatmentPage (C-03·M0-02 9-state·M0-03 risk enum·M0-17 summary 50~160) ===

export const treatmentPage = pgTable(
  "treatment_page",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    bodyMarkdown: text("body_markdown").notNull(),
    status: contentPublicationStatusEnum("status").notNull().default("draft"),
    riskLevel: riskLevelEnum("risk_level"),
    complianceRecordId: uuid("compliance_record_id"),
    heroImageUrl: text("hero_image_url"),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("treatment_page_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
    titleLen: check("treatment_page_title_length", sql`length(${t.title}) BETWEEN 1 AND 200`),
    summaryLen: check("treatment_page_summary_length", sql`length(${t.summary}) BETWEEN 50 AND 160`),
    publishedRequiresAt: check("treatment_page_published_requires_at", sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`),
    instanceSlugUnique: unique("treatment_page_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("treatment_page_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("treatment_page_instance_idx").on(t.instanceId),
    statusIdx: index("treatment_page_status_idx").on(t.instanceId, t.status),
    publishedIdx: index("treatment_page_published_idx")
      .on(t.instanceId, t.publishedAt)
      .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
  }),
);

// === Article (C-04·M0-05 ON DELETE NO ACTION) ===

export const article = pgTable(
  "article",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    bodyMarkdown: text("body_markdown").notNull(),
    status: contentPublicationStatusEnum("status").notNull().default("draft"),
    riskLevel: riskLevelEnum("risk_level"),
    complianceRecordId: uuid("compliance_record_id"),
    heroImageUrl: text("hero_image_url"),
    authorDoctorId: uuid("author_doctor_id"),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("article_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
    titleLen: check("article_title_length", sql`length(${t.title}) BETWEEN 1 AND 200`),
    summaryLen: check("article_summary_length", sql`length(${t.summary}) BETWEEN 80 AND 200`),
    publishedRequiresAt: check("article_published_requires_at", sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`),
    instanceSlugUnique: unique("article_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("article_instance_id_unique").on(t.instanceId, t.id),
    instanceIdx: index("article_instance_idx").on(t.instanceId),
    statusIdx: index("article_status_idx").on(t.instanceId, t.status),
    publishedIdx: index("article_published_idx")
      .on(t.instanceId, t.publishedAt)
      .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
    authorIdx: index("article_author_idx")
      .on(t.instanceId, t.authorDoctorId)
      .where(sql`${t.authorDoctorId} IS NOT NULL`),
    // M0-05 cycle2: ON DELETE NO ACTION (Drizzle 기본·onDelete 미명시)
    authorFk: foreignKey({
      columns: [t.instanceId, t.authorDoctorId],
      foreignColumns: [doctorProfile.instanceId, doctorProfile.id],
      name: "article_author_fk",
    }),
  }),
);

// === LegalDocument (C-16·LOCATION_LEGAL_PLAN v1.0 § 2.1) ===

export const legalDocument = pgTable(
  "legal_document",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    documentType: legalDocumentTypeEnum("document_type").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    autoGenerated: boolean("auto_generated").notNull().default(true),
    templateVersion: text("template_version"),
    // LLC-11 patch: DB DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Seoul')::date — raw SQL 에서 적용. Drizzle 은 default 표현 불가 → migration SoT.
    effectiveDate: date("effective_date").notNull(),
    lastRevisedDate: date("last_revised_date"),
    contactPerson: text("contact_person"),
    contactEmail: text("contact_email"),
    status: contentPublicationStatusEnum("status").notNull().default("draft"),
    riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugRegex: check("legal_document_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
    titleLen: check("legal_document_title_length", sql`length(${t.title}) BETWEEN 1 AND 100`),
    bodyLen: check("legal_document_body_length", sql`length(${t.body}) BETWEEN 1 AND 200000`),
    emailRegex: check("legal_document_email_regex", sql`${t.contactEmail} IS NULL OR ${t.contactEmail} ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'`),
    // LL-SCHEMA-05 + cycle1 LL-22
    templateVersionFormat: check("legal_document_template_version_format", sql`${t.templateVersion} IS NULL OR ${t.templateVersion} ~ '^[a-z0-9-]+@[0-9]+\\.[0-9]+\\.[0-9]+$'`),
    autoGenTemplateVer: check("legal_document_auto_generated_template_ver", sql`(${t.autoGenerated} = false) OR (${t.templateVersion} IS NOT NULL)`),
    // LL-SCHEMA-03 + cycle1 LL-03·19: skeleton 단계 status='draft' 만
    statusSkeletonLimit: check("legal_document_status_skeleton_limit", sql`${t.status} = 'draft'`),
    publishedAtNull: check("legal_document_published_at_null", sql`${t.publishedAt} IS NULL`),
    // LL-SCHEMA-06 + cycle1 LL-12: risk_level 'Low' 만
    riskLevelSkeletonLimit: check("legal_document_risk_level_skeleton_limit", sql`${t.riskLevel} = 'Low'`),
    instanceSlugUnique: unique("legal_document_instance_slug_unique").on(t.instanceId, t.slug),
    instanceIdUnique: unique("legal_document_instance_id_unique").on(t.instanceId, t.id),
    // LL-SCHEMA-02 + cycle1 LL-08·09: closed 5종 partial UNIQUE (cookie/other 미강제)
    type5Unique: uniqueIndex("legal_document_instance_5type_unique")
      .on(t.instanceId, t.documentType)

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"\\| "'`.*` '"\\| "'`color'"\\.|bg-canvas|text-fg|border-|ring-|overlay\" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "User-agent:|GPTBot|ClaudeBot|Google-Extended|CCBot|anthropic-ai|OAI-SearchBot|PerplexityBot|Claude-SearchBot|ChatGPT-User|Perplexity-User|Claude-User|Yeti|Bingbot|Googlebot|meta-externalagent|Sitemap" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md docs/core/SEARCH_STANDARDIZATION.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "themeColor|theme-color|BrandTokens|color.surface.background|brand.primary" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md docs/core/SEARCH_STANDARDIZATION.md docs/core/DESIGN_TOKENS.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "app_public_reader|D0011|10단계|public_reader|NOLOGIN|MEMBERSHIP|manifest|C0008|D0011_public_reader" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md packages/migrations-runner/src/manifest.ts docs/decisions/LOCATION_LEGAL_PLAN.md' in C:\Users\assag\solution\website-exposure
 succeeded in 754ms:
252:- `apps/web/src/app/layout.tsx` (root · 변경 없음) — `<html lang="ko-KR" data-theme="light">` + `<body className="bg-canvas text-fg-default">`. **모든 segment 가 root layout 의 html/body 공유**.
347:| `bg-canvas` · `bg-surface` | `color.surface.background` | `--color-surface-background` |
350:| `text-fg-default` · `text-primary-fg` | `color.text.primary` | `--color-text-primary` |
351:| `text-fg-muted` | `color.text.secondary` | `--color-text-secondary` |
352:| `text-fg-disabled` | `color.text.disabled` | `--color-text-disabled` |
353:| `text-fg-inverse` | `color.text.inverse` | `--color-text-inverse` |
354:| `border-default` | `color.border.default` | `--color-border-default` |
355:| `border-subtle` | `color.border.subtle` | `--color-border-subtle` |
367:| `ring-focus` | `color.focus.ring` | `--color-focus-ring` |
368:| `bg-overlay-modal` | `color.overlay.modal` | `--color-overlay-modal` |
369:| `bg-overlay-scrim` | `color.overlay.scrim` | `--color-overlay-scrim` |
372:- (PSR-COMP-11 · cycle1 PSR-13) Tailwind alias 는 semantic 22 round-trip 보장 — `bg-canvas` ↔ `color.surface.background` ↔ `--color-surface-background`. 본 표가 SoT.

 succeeded in 764ms:
docs/core/SEARCH_STANDARDIZATION.md:159:| **A. 일반 검색 색인** | `Googlebot` / `Yeti` (네이버) / `Bingbot` | 일반 검색 결과 색인 — 의료기관 노출의 1차 채널 | 각 검색 엔진 공식 문서 |
docs/core/SEARCH_STANDARDIZATION.md:160:| **B. AI 검색 인덱싱·답변용** | `OAI-SearchBot` (ChatGPT 검색용) / `PerplexityBot` (Perplexity 검색용) / `Claude-SearchBot` (Anthropic 검색용) | AI 답변·검색에서 사이트를 발견·인용하기 위한 인덱싱 크롤러 | OpenAI publisher FAQ; Perplexity crawlers; Anthropic crawler help |
docs/core/SEARCH_STANDARDIZATION.md:161:| **C. User-triggered fetch** | `ChatGPT-User` (사용자 GPT 요청 시 fetch) / `Perplexity-User` (사용자 Perplexity 요청 시 fetch) / `Claude-User` (사용자 Claude 요청 시 fetch) | **사용자 직접 요청**에 의해 페이지를 fetch. 제품별 robots.txt 해석·우선순위가 일반 크롤러와 다를 수 있으므로 **차단 보장 수단으로 보지 않음** (각 제품 공식 문서 확인 권장) | 동일 공식 출처 |
docs/core/SEARCH_STANDARDIZATION.md:162:| **D. AI 학습·모델 개선용** | `GPTBot` (OpenAI 학습) / `ClaudeBot` (Anthropic 학습/모델 개선) / `Google-Extended` (Google Gemini 학습) / `CCBot` (Common Crawl, LLM 학습 데이터) / `anthropic-ai` (Anthropic legacy·alias로 추정) / `meta-externalagent` (Meta — 외부 관측 기반, 공식 문서 재검증 필요) | 모델 학습 데이터 수집 | OpenAI publisher FAQ; Anthropic crawler help; **Google-Extended controls (overview-google-crawlers)**; Common Crawl; (meta-externalagent는 외부 관측 기반) |
docs/core/SEARCH_STANDARDIZATION.md:164:> **분류 갱신 책임**: 본 표는 공식 출처 기반 + 분기 1회 재검증. `anthropic-ai`는 alias·legacy 추정 (Anthropic 공식 표기는 `ClaudeBot`·`Claude-SearchBot`·`Claude-User`).
docs/core/SEARCH_STANDARDIZATION.md:171:> - Google-Extended controls — https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers (google-extended 섹션)
docs/core/SEARCH_STANDARDIZATION.md:196:User-agent: *
docs/core/SEARCH_STANDARDIZATION.md:203:User-agent: Googlebot
docs/core/SEARCH_STANDARDIZATION.md:206:User-agent: Yeti
docs/core/SEARCH_STANDARDIZATION.md:209:User-agent: Bingbot
docs/core/SEARCH_STANDARDIZATION.md:213:User-agent: OAI-SearchBot
docs/core/SEARCH_STANDARDIZATION.md:216:User-agent: PerplexityBot
docs/core/SEARCH_STANDARDIZATION.md:219:User-agent: Claude-SearchBot
docs/core/SEARCH_STANDARDIZATION.md:223:User-agent: ChatGPT-User
docs/core/SEARCH_STANDARDIZATION.md:226:User-agent: Perplexity-User
docs/core/SEARCH_STANDARDIZATION.md:229:User-agent: Claude-User
docs/core/SEARCH_STANDARDIZATION.md:233:User-agent: GPTBot
docs/core/SEARCH_STANDARDIZATION.md:236:User-agent: ClaudeBot
docs/core/SEARCH_STANDARDIZATION.md:239:User-agent: Google-Extended
docs/core/SEARCH_STANDARDIZATION.md:242:User-agent: CCBot
docs/core/SEARCH_STANDARDIZATION.md:245:User-agent: anthropic-ai
docs/core/SEARCH_STANDARDIZATION.md:248:# meta-externalagent는 experimentalAiBots=true 시에만 추가 (외부 관측 기반·공식 검증 전)
docs/core/SEARCH_STANDARDIZATION.md:250:Sitemap: https://{domain}/sitemap.xml
docs/core/SEARCH_STANDARDIZATION.md:253:> `InstanceManifest.experimentalAiBots: true`(default `false`)일 때만 `meta-externalagent` 등 외부 관측 기반 user-agent가 robots.txt에 포함된다. 공식 검증된 user-agent만 기본 출력.
docs/core/SEARCH_STANDARDIZATION.md:272:| `User-agent: *  Disallow: /` (전체 차단) | **environment별 결정** | `environment=production`에서는 **Blocked** (의료기관 사이트 노출 필수). `environment=staging`·`preview`에서는 **Allowed** (또는 Basic Auth 권장 — `InstanceManifest.environment` 기반) |
docs/core/SEARCH_STANDARDIZATION.md:284:**예시 — `aiCrawlerPolicy: allow` (기본 모두 허용)에서 PerplexityBot 일부 경로만 차단**:
docs/core/SEARCH_STANDARDIZATION.md:287:# Core 기본 (allow 정책, PerplexityBot 블록)
docs/core/SEARCH_STANDARDIZATION.md:288:User-agent: PerplexityBot
docs/core/SEARCH_STANDARDIZATION.md:293:  - userAgent: PerplexityBot
docs/core/SEARCH_STANDARDIZATION.md:299:User-agent: PerplexityBot
docs/core/SEARCH_STANDARDIZATION.md:518:### 7.2 Sitemap 제출
docs/core/SEARCH_STANDARDIZATION.md:520:- robots.txt에 `Sitemap:` 라인 자동 출력 — 검색 엔진 자동 발견
docs/core/SEARCH_STANDARDIZATION.md:576:| 2026-05-14 | v0.3 | **AI 크롤러 정책 정밀화·environment 분기** (피드백 8건): (1) **§ 3.1 AI 크롤러 3계열 분리** — A 검색 색인 / B AI 검색·답변용 / C AI 학습. **OAI-SearchBot·Perplexity-User·Bingbot·meta-externalagent 추가**, (2) **Google-Extended를 C 학습 계열로 정리** (이전 잘못된 A 분류 정정), (3) **§ 3.2 `aiCrawlerPolicy` required, 미설정 시 빌드 fail** — Core 자동 적용 기본값 없음. starter template만 `disallowTraining` 제안, (4) **§ 2.1 `<html lang>` ko-KR 그대로 출력** — normalize 제거. BCP 47 유효, 지역 정보 보존, (5) DATA_MODEL ogType cascade 이미 적용됨(v0.10 — 사용자 시점차), (6) **§ 3.3.1 noIndex vs robots.txt 원칙 명시** — robots.txt 차단 X + sitemap 제외 + meta noindex (참고: Google robots.txt intro), (7) **§ 2.3 publisher 검증 분리** — head meta에는 article:publisher 없음 → JSON-LD `Article.publisher`로 강제(SCHEMA_MAPPING § 3 P-010 책임). § 2.3는 article:published_time/modified_time/author만, (8) **§ 3.3.1 environment 분기** — production은 전체 차단 Blocked, staging/preview는 Allowed (Basic Auth 권장. `InstanceManifest.environment` 기반) |
docs/core/SEARCH_STANDARDIZATION.md:577:| 2026-05-14 | v0.4 | **AI 봇 분류 정확화** (피드백 8건): (1) **§ 0 요약 정정** — "Core 기본 allow" 잔재 제거, `required·미설정 fail`로 통일, (2) **Anthropic 봇 분류 정정** — `ClaudeBot`을 D 학습 계열로, `Claude-SearchBot`을 B 검색 인덱싱, `Claude-User`를 C user-triggered로. `anthropic-ai`는 legacy/alias 주석, (3) **OpenAI `ChatGPT-User` 추가** — C user-triggered 계열, (4) **3계열 → 4계열 재구성** — A 일반 검색 / B AI 검색 인덱싱 / **C User-triggered fetch** / D AI 학습. C 계열은 robots.txt 무시 가능성 주의, (5) **공식 출처 URL 명시** — 각 user-agent에 OpenAI publisher FAQ·Anthropic crawler help·Perplexity crawlers·Google robots-meta 참조. `meta-externalagent`는 외부 관측 기반 표기. 분기 1회 재검증 책임 명시, (6) **§ 0·§ 2.1 og:type 잔재 정정** — P-004 profile·P-006/P-008/P-010 article·나머지 website, (7) **SCHEMA_MAPPING § 1.5 `<html lang="ko">` → `<html lang="ko-KR">` cascade 정합**, (8) **법무 승인 플래그 룰 완화** — `allow`만 fail-gate, 다른 정책은 승인 기록 권장(warning 수준) |
docs/core/SEARCH_STANDARDIZATION.md:578:| 2026-05-14 | v0.5 | **C-08 InstanceManifest cascade·미세 정합** (피드백 6건): (1) **DATA_MODEL C-08에 8개 필드 추가** — `environment`·`aiCrawlerPolicy`·`aiCrawlerLegalApproved`·`aiCrawlerApprovedBy/At`·`robotsOverrides`·`experimentalAiBots`·`performanceBudget`·`searchConsoleVerification` + `RobotsOverride`·`PerformanceBudget` 하위 타입 신설. **본 문서가 단독 구현 가능한 명세로 작동**, (2) **§ 2.3 `PageMeta.noIndex` vs `robots` 우선순위 명시** — noIndex 항상 우선, 충돌 시 warning, (3) **§ 2.3 P-006/P-008 modified_time fallback** — `TreatmentPage.dateModified`/`MedicalConditionPage.dateModified` 또는 공통 `@updatedAt`로 fallback, (4) **§ 3.4 custom 예시 정정** — **`aiCrawlerPolicy: allow` 기반** PerplexityBot 일부 경로 차단(`/reviews`·`/pricing`) 예시로 교체, (5) **§ 7.3 analytics-reporting 후속 문서 안내** — `docs/features/` 디렉터리 미생성 명시, (6) **§ 3.3 meta-externalagent를 `experimentalAiBots`로 분리** — 공식 검증 전 user-agent는 별도 플래그 활성화 시에만 robots.txt 포함 |
docs/core/SEARCH_STANDARDIZATION.md:579:| 2026-05-14 | v0.6 | **룰·게이트·참고 URL 미세 정합** (피드백 5건): (1) **§ 2.3 P-006/P-008 modified_time 룰 정확화** — "명시적 dateModified 부재로 공통 `@updatedAt` fallback 사용" warning. modified_time 출력 자체는 누락 안 됨. C-11 풀명세 시 dateModified 추가 검토 명시, (2) v0.5 변경 이력 정정 — "disallowTraining 기반" → "**`aiCrawlerPolicy: allow` 기반**" PerplexityBot 일부 경로 차단 예시, (3) **DATA_MODEL C-08 cascade — `aiCrawlerApprovedBy/At`을 `aiCrawlerPolicy: allow` 시 required로 격상** (감사 추적 게이트 강화), (4) **DATA_MODEL C-08 PerformanceBudget 확장** — `imageWeightKbOverride`·`lighthouseSeoMinOverride`·`lighthouseAccessibilityMinOverride` 추가 (§ 6.1 budget 항목 모두 override 가능), (5) **§ 3.1 Google 참고 URL 정정** — robots.txt spec + Google-Extended 문서로 교체. robots-meta-tag는 noindex 등 별도 참조로 분리 |
docs/core/SEARCH_STANDARDIZATION.md:580:| 2026-05-14 | v0.7 | **잔여 문구·표 정합** (피드백 5건): (1) **§ 3.1 표 D 계열 출처 정정** — "Google search-console robots-meta" → "**Google-Extended controls (overview-google-crawlers)**" (Google 봇 분류 근거 정확화), (2) **§ 4.4 sitemap lastmod 출처 분리** — P-010 Article은 `Article.dateModified`, P-006·P-008은 명시 필드 부재 시 `@updatedAt` (§ 2.3 정합), (3) **§ 2.1 메타 태그 출처 칸 세분화** — `article:published_time`·`modified_time`·`author`를 P-006/P-008/P-010별로 분리 명시. P-010 fail/P-006·P-008 conditional fallback 차등, (4) **v0.6 변경 이력 "6건 → 5건" 오기 수정**, (5) **§ 6.1 강화 판정 방향 명시** — max 계열(LCP·CLS·TBT·bundle·image)은 작을수록 강화, min score 계열(Performance·SEO·Accessibility)은 클수록 강화. 반대 방향 입력 시 빌드 실패 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:467:User-agent: *
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:471:User-agent: GPTBot
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:474:User-agent: Google-Extended
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:477:User-agent: CCBot
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:480:User-agent: anthropic-ai
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:483:User-agent: ClaudeBot
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:486:User-agent: Bytespider
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:489:User-agent: PerplexityBot
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:492:User-agent: cohere-ai
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:495:User-agent: Diffbot
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:499:User-agent: OAI-SearchBot
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:502:User-agent: ChatGPT-User
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:505:User-agent: Claude-SearchBot
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:508:User-agent: PerplexityBot-User
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:512:User-agent: Yeti
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:515:Sitemap: https://<host>/<instanceSlug>/sitemap.xml
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:587:| 12 | `/<instanceSlug>/robots.txt` 응답 | SEARCH_STANDARDIZATION § 3 v0.1 starter `disallowTraining` 정합 (학습 봇 Disallow + 답변 봇 Allow + Naver Yeti Allow) |

 succeeded in 756ms:
docs/core/SEARCH_STANDARDIZATION.md:11:> - 데이터 계약 (`PageMeta` C-06, `BrandTokens`, `InstanceManifest` 등) → `core/DATA_MODEL.md`
docs/core/SEARCH_STANDARDIZATION.md:99:| `<meta name="theme-color">` | **Allowed (의무)** | light·dark 두 값 모두 출력 — `BrandTokens.colors.light.primary` + `BrandTokens.colors.dark.primary` (media 쿼리 별도). `DESIGN_TOKENS.md` § 9.4.1 SoT |
docs/core/SEARCH_STANDARDIZATION.md:566:| ~~SS-05~~ | `theme-color` 메타 자동 출력 정책 | v1.0 — `DESIGN_TOKENS.md` § 9.4.1 SoT 확정. light·dark 두 값 모두 출력 (`<meta name="theme-color">` + `media="(prefers-color-scheme: dark)"` 별도). 값은 `BrandTokens.colors.primary` 평면화 hex |
docs/core/SEARCH_STANDARDIZATION.md:584:| 2026-05-14 | **v1.1** | **DESIGN_TOKENS v1.0 cascade**: § 2.1 메타 표 theme-color Conditional → **Allowed(의무)**로 격상. light·dark 두 값 출력 (`BrandTokens.colors.light.primary` + `colors.dark.primary`). SS-05 해소 |
docs/core/DESIGN_TOKENS.md:94:color.surface.background  → light: color.gray.50,  dark: color.gray.900
docs/core/DESIGN_TOKENS.md:97:color.brand.primary       → color.blue.600 (Preset/Instance override)
docs/core/DESIGN_TOKENS.md:110:button.primary.background       → color.brand.primary
docs/core/DESIGN_TOKENS.md:112:button.primary.hover.background → color.brand.primary.hover
docs/core/DESIGN_TOKENS.md:178:| `color.surface.background` | gray.50 | gray.900 |
docs/core/DESIGN_TOKENS.md:187:| `color.brand.primary` | blue.600 | blue.400 |
docs/core/DESIGN_TOKENS.md:188:| `color.brand.primary.hover` | blue.700 | blue.300 |
docs/core/DESIGN_TOKENS.md:423:| `button.primary.background` | color.brand.primary |
docs/core/DESIGN_TOKENS.md:425:| `button.primary.hover.background` | color.brand.primary.hover |
docs/core/DESIGN_TOKENS.md:488:| `link.text` | color.brand.primary |
docs/core/DESIGN_TOKENS.md:489:| `link.text.hover` | color.brand.primary.hover |
docs/core/DESIGN_TOKENS.md:519:| `tabs.background` | color.surface.background |
docs/core/DESIGN_TOKENS.md:522:| `tabs.trigger.border.active` | color.brand.primary |
docs/core/DESIGN_TOKENS.md:529:| `nav.background` | color.surface.background |
docs/core/DESIGN_TOKENS.md:532:| `nav.link.text.hover` | color.brand.primary |
docs/core/DESIGN_TOKENS.md:576:| `cta-cluster.background` | color.brand.primary |
docs/core/DESIGN_TOKENS.md:587:| `timeline.node.color` | color.brand.primary |
docs/core/DESIGN_TOKENS.md:610:  --color-surface-background: var(--color-gray-50);
docs/core/DESIGN_TOKENS.md:612:  --color-brand-primary: var(--color-blue-600);
docs/core/DESIGN_TOKENS.md:614:  --button-primary-background: var(--color-brand-primary);
docs/core/DESIGN_TOKENS.md:618:  --color-surface-background: var(--color-gray-900);
docs/core/DESIGN_TOKENS.md:667:      "primary": { "value": "{color.blue.600}", "type": "color", "description": "BrandTokens.colors.light.primary 매핑" }
docs/core/DESIGN_TOKENS.md:679:      "background": { "value": "{color.brand.primary}", "type": "color" },
docs/core/DESIGN_TOKENS.md:689:- 토큰 ID — JSON path를 `.`로 join (예: `color.surface.background`)
docs/core/DESIGN_TOKENS.md:706:## 9.4 DATA_MODEL C-07 BrandTokens 매핑
docs/core/DESIGN_TOKENS.md:708:DATA_MODEL의 C-07 `BrandTokens`는 어드민·인스턴스 단위 브랜드 최종값. 본 문서의 토큰 카탈로그와 다음과 같이 매핑:
docs/core/DESIGN_TOKENS.md:710:| `BrandTokens` 필드 | 본 문서 토큰 매핑 |
docs/core/DESIGN_TOKENS.md:713:| `colors` | § 3.2 semantic 색상 전체 — `{ light: ColorTokens, dark: ColorTokens }` 양층 구조. 핵심 키 `colors.light.primary`·`colors.dark.primary`는 각 테마의 `color.brand.primary` 평면화 결과 |
docs/core/DESIGN_TOKENS.md:721:### 9.4.0 BrandTokens 세부 타입 정의
docs/core/DESIGN_TOKENS.md:760:// BrandTokens.colors는 light·dark 두 ColorTokens 분리 구조
docs/core/DESIGN_TOKENS.md:761:type BrandTokensColors = {
docs/core/DESIGN_TOKENS.md:766:// 참조 표기: BrandTokens.colors.light.primary, BrandTokens.colors.dark.primary (colors.<theme>.<token> 순)
docs/core/DESIGN_TOKENS.md:801:// BrandTokens.shadow도 light·dark 양층 구조 (colors와 동일 패턴)
docs/core/DESIGN_TOKENS.md:808:- **평면화 규칙**: dot path를 underscore로 변환 (예: `color.surface.background` → `surface_background`). 어드민·빌드 도구가 본 규칙으로 평면화 결과 출력
docs/core/DESIGN_TOKENS.md:811:### 9.4.1 theme-color 메타 (SEARCH_STANDARDIZATION 정합)
docs/core/DESIGN_TOKENS.md:815:- **light**: `<meta name="theme-color" content="<light-hex>">` — 값은 `BrandTokens.colors.light.primary` 평면화 hex
docs/core/DESIGN_TOKENS.md:816:- **dark**: `<meta name="theme-color" content="<dark-hex>" media="(prefers-color-scheme: dark)">` — 값은 `BrandTokens.colors.dark.primary` 평면화 hex
docs/core/DESIGN_TOKENS.md:878:빌드 시 다음 쌍을 light·dark 두 테마 모두 검증. Preset/Instance가 `color.brand.primary` 등을 변경하면 본 검증 자동 재실행.
docs/core/DESIGN_TOKENS.md:882:| 본문 텍스트 | `color.text.primary` / `color.surface.background` | 4.5:1 |
docs/core/DESIGN_TOKENS.md:885:| 보조 텍스트 | `color.text.secondary` / `color.surface.background` | 4.5:1 |
docs/core/DESIGN_TOKENS.md:886:| 역색 텍스트 | `color.text.inverse` / `color.brand.primary` | 4.5:1 |
docs/core/DESIGN_TOKENS.md:889:| 링크 | `link.text` / `color.surface.background` | 4.5:1 |
docs/core/DESIGN_TOKENS.md:890:| 링크 hover | `link.text.hover` / `color.surface.background` | 4.5:1 |
docs/core/DESIGN_TOKENS.md:891:| 포커스 링 | `color.focus.ring` / `color.surface.background` | 3:1 |
docs/core/DESIGN_TOKENS.md:896:| 입력 focus 테두리 | `input.border.focus` / `color.surface.background` | 3:1 |
docs/core/DESIGN_TOKENS.md:948:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (8개 지적 전건 수용)**: (1) § 5.1 spacing.0~96 잔재 → 0~64 (13단계) 정합, (2) § 9.4 BrandTokens.colors 잔재 정정 — `{ light, dark }` 양층 구조 명시. § 9.2 description 예시도 `colors.light.primary`로, (3) § 9.4.0 ShadowScale 양층화 — `{ light: ShadowTokens, dark: ShadowTokens }`. DTCG ShadowValue 객체 타입 신설, (4) § 9.4.0 RadiusScale에 `none` 필드 추가 — § 6.1 `radius.0` round-trip, (5) § 9.4.1 dark theme-color 한쪽만 출력 시 fail로 통일 (SEARCH_STANDARDIZATION § 2.1 Allowed 의무와 정합), (6) § 10.2 private.* CSS 변수명 변환 규칙 명시 — dot → `-` 치환 + `--` prefix, (7) § 9.2 표기 명확화 — Style Dictionary v3+ `value`·`type` 채택, DTCG draft의 `$value`/`$type` 미채택. 타입 값은 DTCG 카테고리 호환, (8) § 2.1 breakpoint 구분자 정리 `xl.2xl` → `xl·2xl` |
docs/core/DESIGN_TOKENS.md:949:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (9개 지적 전건 수용)**: (1) § 4.2 font.size 잔재 "10~96" → "12~72 11단계"로 정합, (2) § 2.1 primitive 목록에서 container 제거 (§ 5.3 semantic). § 5.3 container.max-width를 `breakpoint.xl` alias로 정정. raw 1280px 제거. grid.columns는 raw integer 명시, (3) § 12 fail 룰에 "overlay 외 semantic 색상이 raw hex·rgb·hsl 보유 시 fail" 명시, (4) § 6.2.1 DTCG structured shadow 객체 형식 + Style Dictionary shadow/css transform 변환 규칙 명시, (5) § 9.4.0 ColorTokens 22필드로 확장 — text_disabled·border_subtle·status_*_subtle 4종·overlay_modal·overlay_scrim 추가. §3.2 semantic 색상 전체 round-trip 가능, (6) BrandTokens.colors 구조를 `{ light: ColorTokens, dark: ColorTokens }`로 명확화. 참조 표기 `colors.<theme>.<token>` 순서 통일. § 9.4.1 dark theme-color 값 산출도 같은 형식, (7) **SEARCH_STANDARDIZATION § 2.1 메타 표 cascade** — theme-color Conditional → Allowed(의무) light·dark 두 값 출력으로 정합, (8) § 10.2 `private.*` 적용 범위 — semantic·component 양쪽 layer 모두 허용 명시, (9) DT-07 해소 설명 § 7.1.1 참조 정정 — CONTENT_STANDARDS § 7.1.1 명시 |
docs/core/DESIGN_TOKENS.md:950:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 0 요약 fail 조건 정밀화 — § 2.4 색상·shadow만 semantic 의무로 일치. typography·spacing·radius·motion 허용 명시, (2) § 2.1 primitive 목록 완전화 — green·amber 색상 추가, breakpoint·container·border.width·font.weight·line.height·letter.spacing 추가. § 4.2·§ 5.1 표 SoT와 정합 (font.size 11단계·spacing 13단계), (3) § 2.1 font.size 범위 12~72로 정합, (4) § 2.1 spacing 범위 0~64로 정합, (5) § 3.2 overlay 그룹 raw rgba 예외 규칙 명시 — `color.overlay.*`만 직접 rgba 허용. 다른 semantic은 primitive alias 의무 유지, (6) § 9.4.0 BrandTokens 세부 타입 정의 — ColorTokens(15필드)·TypographyTokens·RadiusScale·ShadowScale + 평면화 규칙(dot path → underscore), (7) § 9.4.1 dark theme-color 산출 명시 — dark resolve 결과 + media 쿼리 별도. 미디어 미지정이 light 기본값, (8) DT-07 해소 — `private.*` dot 컨벤션 확정. § 13.1 해소 표에 추가 |
docs/core/DESIGN_TOKENS.md:951:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 1.2 SoT 4파일 구조 통일 (`primitive`·`semantic.light`·`semantic.dark`·`component` tokens.json) — 단일 core.tokens.json 잔재 제거. § 10.1 흐름도 4파일 머지 명시, (2) § 0·§ 12 fail 조건 좁힘 — 색상·shadow component에서 primitive 직접 참조만 fail. typography·spacing·radius·motion 허용, (3) § 2.1 primitive 목록 shadow 잔재 제거 — shadow는 semantic 단계 명시. font.weight·line.height·letter.spacing·border.width 추가, (4) modal.overlay 직접 hex → semantic `color.overlay.modal` 분리. `color.overlay.scrim`도 신설, (5) § 9.4 personaMode enum 정규화 규칙 명시 — PascalCase → lowercase preset slug, (6) § 9.4 BrandTokens.spacing — primitive scale 배수 override(tight 0.85·standard 1.0·spacious 1.25) + MAJOR 변경 명시, (7) **SEARCH_STANDARDIZATION SS-05 해소 cascade** — § 9.4.1 theme-color light/dark 출력이 SoT임을 SEARCH_STANDARDIZATION § 9.1에 기록, (8) `private:` prefix → `private.*` dot 네임스페이스로 정정 — JSON path·CSS 변수명·tokens.json 모두 동일 형식, (9) § 11.2 검증 색상 쌍에서 `color.border.default` 제거 — WCAG 1.4.11 비대상(일반 시각 분리 border). 30개 쌍으로 정합, (10) § 11.3·§ 11.4 헤딩 번호 중복 정정 |
docs/core/DESIGN_TOKENS.md:952:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (10개 지적 전건 수용)**: (1) § 2.4 참조 규칙 정밀화 — color·shadow는 semantic 의무, spacing·radius·font·motion은 primitive 허용. component→component 금지, (2) § 3.1·§ 3.2 `color.white`·`color.black` primitive 절대값 추가. semantic `white` 잔재 정정, (3) § 9.4 DATA_MODEL C-07 BrandTokens 매핑 표 + § 9.4.1 theme-color SEARCH_STANDARDIZATION 정합, (4) § 9.2 Style Dictionary v3+ 표준 포맷으로 재작성 — primitive/semantic.light/semantic.dark/component 파일 분리, DTCG type 필드 명시, (5) § 6.2 shadow를 semantic theme-aware로 이동 — primitive 무관 원칙 보호. light·dark opacity 명시(DT-04 해소), (6) § 10.3 머지 알고리즘 강화 — 타입별 머지·theme별 머지·alias 재해석 순서·unknown key 처리(`private:` prefix)·접근성 재검증·순환 참조 검출, (7) § 11.2 자동 검증 색상 쌍 카탈로그 16개 × 2테마 = 32개 명시. Preset/Instance brand 변경 시 재검증 자동, (8) § 4.1 한국어 폰트 — Pretendard 우선 + § 4.1.1 웹폰트 로딩 정책(font-display: swap·preload·OFL 라이선스 검토 완료) + § 4.1.2 letter-spacing 한국어 본문 적용 제한, (9) § 8.7~§ 8.14 컴포넌트 토큰 카탈로그 확장 8종(table·accordion·tabs·nav/header/footer·modal·toast·avatar/breadcrumb·CTA cluster·timeline/map/embed), (10) § 13 미결정 정리 — § 3.4 primitive hex 카탈로그(DT-02 해소) + § 6.2 dark shadow(DT-04 해소). DT-06·DT-07 신설 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:13:- `docs/core/SEARCH_STANDARDIZATION.md` — § 2 메타 태그 표준 (theme-color · og:type 매핑) · § 3 robots.txt (aiCrawlerPolicy + 4계열 user-agent + disallowTraining starter) · § 4.3 sitemap changefreq/priority · § 5 canonical resolve.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:16:- `docs/core/DESIGN_TOKENS.md` v1.0 — 3-tier 토큰 (primitive·semantic·component) · § 3.2 light/dark semantic 22 · § 3.3 `data-theme="light"|"dark"` 분기 · semantic naming SoT (`color.surface.background` 등).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:34:- 노출 의도 일직선: SEARCH_STANDARDIZATION 정합 robots/sitemap/canonical · schema.org JSON-LD · Next.js metadata · theme-color · OpenGraph · 자체 JSON-LD rule checker 같은 검색·AI 인용 신호를 v0.1 단계부터 표준 정합으로 출력.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:48:| Next metadata API + theme-color + og:type 매핑 (cycle1 PSR-10 정정) | title · description · canonical · OpenGraph · Twitter · robots · `themeColor` 2값 (light/dark) · og:type P-004 `profile`, P-006/P-010 `article`, 기타 `website` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:347:| `bg-canvas` · `bg-surface` | `color.surface.background` | `--color-surface-background` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:356:| `bg-brand` · `text-brand` | `color.brand.primary` | `--color-brand-primary` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:357:| `bg-brand-hover` | `color.brand.primary.hover` | `--color-brand-primary-hover` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:372:- (PSR-COMP-11 · cycle1 PSR-13) Tailwind alias 는 semantic 22 round-trip 보장 — `bg-canvas` ↔ `color.surface.background` ↔ `--color-surface-background`. 본 표가 SoT.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:377:  --color-surface-background: #f9fafb;  /* gray.50 */
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:382:  --color-surface-background: #111827;  /* gray.900 */
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:415:  themeColor: [
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:423:- (PSR-SEO-02 · cycle1 PSR-10) `themeColor` 2값 출력 — DESIGN_TOKENS § 3.2 의 `color.surface.background` 토큰 (light/dark).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:596:| 21 | Next metadata API `themeColor` 2값 (light + dark) 출력 — cycle1 PSR-10 | `<meta name="theme-color" media="(prefers-color-scheme: light)" content="#f9fafb">` + dark 변형 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:615:| 12 | Next metadata API (페이지별 generateMetadata · themeColor · og:type) | 각 page.tsx 안 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:673:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |

 succeeded in 750ms:
docs/decisions/LOCATION_LEGAL_PLAN.md:5:> **acceptance commit 구성 (cycle2 LL-33 · cycle5 LL-56 acceptance precondition)**: 본 commit 에 다음 5 cascade 동시 포함 — (1) LOCATION_LEGAL_PLAN.md v1.0 (본 문서), (2) LL-CASCADE-01 docs/admin/ARCHITECTURE.md § 3.8.2 patch, (3) LL-CASCADE-02 docs/decisions/ADMIN_UI_SKELETON_PLAN.md § 5.5 patch, (4) LL-CASCADE-03 docs/core/CONTENT_STANDARDS.md § 7 patch, (5) LL-CASCADE-04 docs/decisions/M0_BUILD_EXPORT_PLAN.md v0.1 placeholder (작성 완료). LL-CASCADE-05 (packages/migrations-runner manifest spec) 은 manifest 파일 신설 정도 — 실 runner 코드 acceptance 는 LL-DEFER-20 (M0 v1.0 본 구현).
docs/decisions/LOCATION_LEGAL_PLAN.md:242:-- packages/core-content/migrations/C0008_location_profile_parent_clinic.sql
docs/decisions/LOCATION_LEGAL_PLAN.md:506:  9. `packages/core-content/migrations/C0008_location_profile_parent_clinic.sql` — location_profile ALTER (clinic_profile_id composite FK)
docs/decisions/LOCATION_LEGAL_PLAN.md:533:| 3 | C0008 location_profile clinic_profile_id migration | packages/core-content/migrations/C0008_location_profile_parent_clinic.sql |
docs/decisions/LOCATION_LEGAL_PLAN.md:553:- `LL-DEFER-20` (cycle4 LL-53 patch): packages/migrations-runner 실 runner 코드 — manifest spec 작성 (plan v1.0 acceptance precondition) 후 sequential apply + fail-fast 구현. M0 v1.0 본 구현.
docs/decisions/LOCATION_LEGAL_PLAN.md:596:- `LL-CASCADE-05` (cycle3 LL-42 + cycle4 LL-53 patch + **v1.1 LLC-18 patch — "8단계" → "9단계" stale wording 정정**): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장. **acceptance 강도 명시** — plan v1.0 acceptance 는 **manifest spec 작성까지만 차단** (manifest 파일 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` 의 spec 작성 + 본 plan 의 **9단계 의존성 표** cascade · v1.1 LLC-15 patch 로 8→9단계 갱신 정합). 실 runner 코드 구현은 M0 v1.0 cascade (LL-DEFER-20 신설). 즉 plan v1.0 acceptance ≠ runner 코드 acceptance.
docs/decisions/LOCATION_LEGAL_PLAN.md:604:| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
docs/decisions/LOCATION_LEGAL_PLAN.md:605:| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
docs/decisions/LOCATION_LEGAL_PLAN.md:606:| 2026-05-16 | v0.5 | **Codex 비평 cycle4 8 findings (2 blocking + 4 major + 2 minor) 전건 수용 patch**: (LL-48) trigger RAISE EXCEPTION USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' 추가 — errors.ts mapDbErrorToResult 가 SQLSTATE 23514 + constraint name 으로 분기 가능. (LL-49) LL-CASCADE-04 target 정정 — ADMIN_UI_SKELETON_PLAN § 6 은 actions 영역으로 build/export 부재. 신규 `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 신설 + LL-CASCADE-04 책임 row 1건 cascade. acceptance 강도 = placeholder 작성. (LL-50) CT-03 enum SoT 정렬 — DB trigger 허용 11종 (phone/email/sms/kakao-talk/kakao-channel/naver-reservation/naver-talk/form/map/external/video-consultation) + UI subset 3종 분리. LL-DEFER-19 8종 UI 합류. (LL-51) form (b) UI copy 정정 — kakao → kakao-talk · naver-booking → naver-reservation 토큰. (LL-52) LL-DEFER-04/05 phase 충돌 정정 — §9.3 → M0 v1.0 본 구현 (LocationProfile 편집 화면) 으로 통일. M2 Phase Beta 표기 제거 (현재 비어 있음 — 외부 사용자 RBAC 가 M2). (LL-53) LL-CASCADE-05 강도 명시 — plan v1.0 acceptance = manifest spec 작성만 차단, 실 runner 코드는 LL-DEFER-20 (M0 v1.0). (LL-54) trigger function IMMUTABLE 마킹 제거 — VOLATILE 기본 (NEW 읽기 + row-specific RAISE 정합). (LL-55) Sentry pre-integration fallback 명시 — v0.5 단계 console/server stdout only, M0 v1.0 LL-DEFER-18 합류 후 Sentry capture. **누계 55 findings 전건 수용**. |
docs/decisions/LOCATION_LEGAL_PLAN.md:609:| 2026-05-18 | v1.1 | **Code review (cycle 1~3) 결과 plan SoT 보강 patch — 본 plan 의 코드 구현 cycle 동안 발견된 plan-code 불일치 4건 수용**: (LLC-15) § 6 migration 의존성 표 8단계 → 9단계 (C0003 doctor_profile 추가 — C0005 article.author_doctor_id FK precondition). (LLC-16) § 7 시나리오 15 "403" → `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit 으로 정정. 정확한 HTTP 403 status 보장은 § 9.1 `LL-DEFER-21` 신설 (Next.js 14 server component status code 한계 → Next 15 `unauthorized()/forbidden()` 합류 cascade). (LLC-17) § 4.4 LL-ACTION-18 fallback payload 에 `failedDetails: [{target, code, name, message}]` 추가 명시. (LLC-18) § 10 LL-CASCADE-05 본문 + manifest 주석의 "8단계" stale wording → "9단계"로 정정. 코드 누계 cycle 3 회 (14→3→1) · 누계 18 findings 수용 (cycle 6 plan acceptance 59 + cycle 1·2·3 code review 14+3+1). |
packages/migrations-runner/src/manifest.ts:1:// @glitzy/migrations-runner — cross-package migrations manifest spec (v0.1)
packages/migrations-runner/src/manifest.ts:4:// 본 manifest 는 cross-package migrations 의 sequential apply 순서와 명시적 depends_on 을 SoT 로 보존한다.
packages/migrations-runner/src/manifest.ts:14:  /** 적용 단계 — 동일 패키지 내 마이그레이션은 항상 alphabetic 순서로 시퀀스 됨. cross-package 순서는 본 manifest 가 결정. */
packages/migrations-runner/src/manifest.ts:41:  // (3) location_profile (base table — clinic_profile_id 미포함 · C0008 에서 ALTER)
packages/migrations-runner/src/manifest.ts:93:    file: "packages/core-content/migrations/C0008_location_profile_parent_clinic.sql",
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:44:| `app_public_reader` PostgreSQL role + per-table SELECT policy (cycle1 PSR-05·15 정정) | 신규 D0011 migration 안 instance lookup policy + 6 content table policy 명시 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:54:| env / pgbouncer / role membership cascade (cycle1 PSR-21 정정) | `WEB_PUBLIC_DATABASE_URL` env · `.env.example` · pgbouncer userlist · `app_public_reader NOLOGIN MEMBERSHIP` 등 acceptance checklist |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:128:### 3.1 D0011 — `app_public_reader` role + per-table policy (PSR-DATA-01) — cycle1 PSR-05·15 정정
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:131:-- packages/db/migrations/D0011_public_reader.sql (신규)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:133:-- cycle1 PSR-05 patch: NOLOGIN 으로 생성 후 별도 application user (예: app_public_user)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:134:-- 가 MEMBERSHIP 으로 SET ROLE. login user 자체 는 운영 환경 별 secret cascade.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:135:-- v0.1 은 LOGIN role 한 개 (`app_public_reader`) 로 단순화 — production 분리 marker.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:136:CREATE ROLE app_public_reader LOGIN;
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:138:GRANT USAGE ON SCHEMA public TO app_public_reader;
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:143:GRANT SELECT ON instance TO app_public_reader;
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:145:CREATE POLICY public_reader_instance_select
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:148:  TO app_public_reader
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:157:  TO app_public_reader;
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:159:CREATE POLICY public_reader_clinic_profile_select
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:160:  ON clinic_profile FOR SELECT TO app_public_reader
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:163:CREATE POLICY public_reader_location_profile_select
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:164:  ON location_profile FOR SELECT TO app_public_reader
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:167:CREATE POLICY public_reader_doctor_profile_select
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:168:  ON doctor_profile FOR SELECT TO app_public_reader
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:174:CREATE POLICY public_reader_treatment_page_select
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:175:  ON treatment_page FOR SELECT TO app_public_reader
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:183:CREATE POLICY public_reader_article_select
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:184:  ON article FOR SELECT TO app_public_reader
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:196:CREATE POLICY public_reader_legal_document_select
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:197:  ON legal_document FOR SELECT TO app_public_reader
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:205:- (PSR-DATA-02 · cycle1 PSR-05) `app_public_reader` LOGIN — v0.1 단순화. production 단 NOLOGIN + MEMBERSHIP 분리 marker (PSR-DEFER-16 신설).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:211:- (PSR-DATA-04) `app_public_reader` 는 audit_event INSERT 권한 없음 — 공개 페이지 access log 는 별도 (CDN / Vercel analytics · PSR-DEFER-10).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:215:  - Spike A pgbouncer userlist 에 `app_public_reader` 추가 (PSR-CASCADE-05)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:223:| Entity | RLS USING (D0011) | 의미 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:559:| 1 | `D0011_public_reader.sql` 작성 + per-table policy 7개 (instance + 6 content table) | acceptance precondition |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:561:| 3 | `apps/web/src/lib/public-db.ts` 신규 — `app_public_reader` connection helper (singleton) | acceptance precondition |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:563:| 5 | pgbouncer userlist 에 `app_public_reader` 추가 (`apps/spike-a/...userlist.txt`) | PSR-CASCADE-05 acceptance precondition |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:564:| 6 | role membership / NOLOGIN 분리 production marker | PSR-DEFER-16 (M0 v1.0 본 구현 합류) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:565:| 7 | `packages/migrations-runner/src/manifest.ts` v0.x — D0011 10단계 추가 (PSR-CASCADE-04) | acceptance precondition |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:584:| 9 | tenant A 가 `/<tenantB>` 접근 — A 콘텐츠 미노출, B 콘텐츠만 | RLS app_public_reader USING `instance_id` 정합 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:604:| 1 | D0011 migration — `app_public_reader` LOGIN + 7개 policy (instance + 6 content table) | packages/db/migrations/D0011_public_reader.sql |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:622:| 19 | packages/migrations-runner manifest 10단계 (D0011 추가 — PSR-CASCADE-04) | manifest.ts |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:635:- `PSR-DEFER-16` (cycle1 PSR-05): `app_public_reader` NOLOGIN + MEMBERSHIP 분리 production 패턴.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:665:- `PSR-CASCADE-04`: `packages/migrations-runner/src/manifest.ts` — D0011 10단계 추가 (현 9단계 → 10단계).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:666:- `PSR-CASCADE-05`: `apps/spike-a` pgbouncer userlist — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:673:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |

codex
확정된 새 이슈가 몇 개 있습니다. 특히 robots starter는 SoT 예시와 entry-by-entry로 맞지 않고, theme-color 값도 SEARCH/DESIGN SoT의 brand primary가 아니라 surface background를 쓰고 있습니다. 마지막으로 실제 cascade precondition 파일들의 현재 상태를 더 확인해 “문서 marker로 남은 것”과 “acceptance 차단”을 분리하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg --files apps/web/src | rg \"(sign-in|seed|dashboard|cleanup|ClinicProfileForm|DoctorProfileForm|actions\\.ts|route\\.ts|page\\.tsx)"'$"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"revalidatePath\\(|redirect\\(|/admin/|"'`/'"\\"'$'"\\{instanceSlug\\}|/"'${instanceSlug}|firstSlug|cleanup|dashboard|seed" apps/web/src' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"\\(admin\\)|admin/|\\[instanceSlug\\]\" apps/web/src/app -g \"*.tsx\" -g \"*.ts\"" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "legal|privacy|terms|non-covered|refund|complaint|Footer|SiteFooter|legal/" apps/web/src docs/decisions/PUBLIC_SITE_RENDER_PLAN.md' in C:\Users\assag\solution\website-exposure
 succeeded in 936ms:
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:42:| **10페이지 minimal** (cycle1 PSR-01 정정) | P-001 `/` · P-002 `/about` · P-003 `/doctors` · P-004 `/doctors/[slug]` · P-005 `/treatments` · P-006 `/treatments/[slug]` · P-010 `/insights/[category]/[slug]` (1샘플) · P-012 `/contact` · P-013 `/legal/[type]` (5종) · P-014 `/locations/[slug]` (main 1건) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:46:| 페이지 컴포넌트 minimal | Hero · About · DoctorCard · TreatmentCard · ArticleBody · ContactCard · LegalRenderer · LocationCard · Footer · Header · BreadcrumbList |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:72:| LegalDocument 공개 노출 (status=published) | LL-DEFER-01 (compliance-assistant + ComplianceRecord legalCounsel 합류) | PSR-DEFER-13 (LL-DEFER-01 alias) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:101:│     ├─ legal/[type]/page.tsx           -- P-013 Legal/Policy (5 closed types) · noindex v0.1
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:156:                treatment_page, article, legal_document
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:196:CREATE POLICY public_reader_legal_document_select
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:197:  ON legal_document FOR SELECT TO app_public_reader
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:230:| `legal_document` | `status = 'published'` | **v0.1 단계 published row 0개 — 공개 렌더 차단** (DB CHECK 가 draft 만 허용 · LL-SCHEMA-03) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:233:- (PSR-DATA-07) LegalDocument 의 `/legal/[type]` 라우트 는 v0.1 응답:
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:237:- LegalDocument 공개 노출은 **LL-DEFER-01 (compliance-assistant + ComplianceRecord legalCounsel 합류) 시점** 까지 차단. PSR-DEFER-13 = LL-DEFER-01 alias.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:245:- `legal_document[type]` 매칭 0행 (v0.1 단계 항상) → `notFound()`
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:264:      <SiteFooter initial={initial} />
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:272:- (PSR-COMP-03) Header: ClinicProfile.name + 네비 (Home · About · Doctors · Treatments · Contact · Locations · CTA primaryCtas[0]). Footer: 주소·전화·진료시간·법적 페이지 링크.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:273:- (PSR-COMP-04) `loadSiteInitial` 가 layout 안에서 한 번 SELECT — Header/Footer 가 같은 데이터 사용. 페이지 안 별도 SELECT 는 entity 별 추가 데이터만.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:281:| ClinicProfile | `name` | C-01 `name` | Hero/Header/Footer |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:289:| LocationProfile | `phone` | C-21 `telephone` | Contact/Footer |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:290:| LocationProfile | `email` | C-21 `email` | Contact/Footer |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:328:| P-013 Legal/Policy `/legal/[type]` | (v0.1 항상 404 — DB CHECK 가 draft 만 허용 + RLS published 만 SELECT) | (none — defer) |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:461:  - § 3.3: 정책별 출력 예시 + 법무 승인 필드 3종 required (`legalApprovalAt` · `legalApprovedBy` · `legalApprovalNote`) for `allowAll`.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:583:| 8 | LegalDocument 5종 draft → `/<instanceSlug>/legal/<type>` 응답 = 404 (v0.1 noindex + DB CHECK draft 만) | Next `notFound()` |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:634:- `PSR-DEFER-13` (= LL-DEFER-01 alias · cycle1 PSR-06): LegalDocument 공개 노출 — compliance-assistant + ComplianceRecord legalCounsel/legalCounselAt 합류 시점.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:673:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
apps/web/src\seed.ts:75:          legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible
apps/web/src\seed.ts:85:              legal_reviewer_eligible = false,
apps/web/src\seed.ts:106:          legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible
apps/web/src\seed.ts:115:              legal_reviewer_eligible = EXCLUDED.legal_reviewer_eligible,
apps/web/src\lib\clinic-profile-schema.ts:192:  legalEntityName: optionalStr(200),
apps/web/src\lib\clinic-profile-schema.ts:255:export const legalDocEffectiveOverrideSchema = z.record(
apps/web/src\lib\clinic-profile-schema.ts:283:    legalDocEffectiveOverrides: legalDocEffectiveOverrideSchema,
apps/web/src\lib\clinic-profile-schema.ts:303: * FormData 의 flat key `legalDocEffective_<documentType>` → Record<DocumentType, string|undefined>
apps/web/src\lib\clinic-profile-schema.ts:310:    const v = formData.get(`legalDocEffective_${t}`);
apps/web/src\lib\deny-reason-map.ts:23:  "legal-reviewer-ineligible",
apps/web/src\lib\deny-reason-map.ts:71:    case "legal-reviewer-ineligible":
apps/web/src\lib\deny-reason-map.ts:110:    case "legal-reviewer-ineligible":
apps/web/src\lib\errors.ts:61:  legal_document_instance_5type_unique: { field: null, message: "동일 정책 문서가 이미 존재합니다. 잠시 후 다시 시도하세요." },
apps/web/src\lib\errors.ts:62:  legal_document_status_skeleton_limit: { field: null, message: "정책 문서 상태 변경(검수 진입·발행)은 후속 단계입니다. 본 화면에서는 draft 만 저장 가능하며, 검수 진입은 compliance-assistant Feature 합류(M0 v1.0 본 구현 완료 시점) 후 검수 큐 화면에서 가능합니다." },
apps/web/src\lib\errors.ts:63:  legal_document_published_at_null: { field: null, message: "정책 문서 발행은 후속 단계입니다. 발행 게이트(compliance-assistant + ComplianceRecord UI) 합류 후 발행 화면에서 가능합니다." },
apps/web/src\lib\errors.ts:64:  legal_document_risk_level_skeleton_limit: { field: null, message: "정책 문서 위험도는 현재 단계에서 Low 만 허용됩니다. 위험도 수동 분류는 위험도 분류 UI(M0 v1.0) 합류 후 가능합니다." },
apps/web/src\lib\errors.ts:65:  legal_document_title_length: { field: null, message: "정책 문서 제목은 1~100자여야 합니다." },
apps/web/src\lib\errors.ts:66:  legal_document_body_length: { field: null, message: "정책 문서 본문 길이가 허용 범위(1~200000자)를 벗어났습니다." },
apps/web/src\lib\errors.ts:67:  legal_document_email_regex: { field: null, message: "정책 문서의 연락처 이메일 형식이 올바르지 않습니다." },
apps/web/src\lib\errors.ts:68:  legal_document_slug_regex: { field: null, message: "정책 문서 slug 형식이 올바르지 않습니다." },
apps/web/src\lib\errors.ts:69:  legal_document_instance_slug_unique: { field: null, message: "동일 slug 의 정책 문서가 이미 존재합니다." },
apps/web/src\lib\errors.ts:70:  legal_document_template_version_format: { field: null, message: "정책 문서 템플릿 버전 형식이 올바르지 않습니다." },
apps/web/src\lib\errors.ts:71:  legal_document_auto_generated_template_ver: { field: null, message: "자동 생성 정책 문서에는 템플릿 버전이 필요합니다." },
apps/web/src\components\forms\ClinicProfileForm.tsx:20:const CLOSED_DOC_TYPES = ["privacy", "terms", "non-covered", "refund", "complaint"] as const;
apps/web/src\components\forms\ClinicProfileForm.tsx:24:  privacy: "개인정보처리방침",
apps/web/src\components\forms\ClinicProfileForm.tsx:25:  terms: "이용약관",
apps/web/src\components\forms\ClinicProfileForm.tsx:26:  "non-covered": "비급여 진료비 안내",
apps/web/src\components\forms\ClinicProfileForm.tsx:27:  refund: "환불 규정",
apps/web/src\components\forms\ClinicProfileForm.tsx:28:  complaint: "민원 처리 안내",
apps/web/src\components\forms\ClinicProfileForm.tsx:52:  legalEntityName: string;
apps/web/src\components\forms\ClinicProfileForm.tsx:74:  legalDocEffectiveOverrides: Record<ClosedDocType, string>;
apps/web/src\components\forms\ClinicProfileForm.tsx:96:  legalEntityName: "",
apps/web/src\components\forms\ClinicProfileForm.tsx:115:  legalDocEffectiveOverrides: {
apps/web/src\components\forms\ClinicProfileForm.tsx:116:    privacy: "",
apps/web/src\components\forms\ClinicProfileForm.tsx:117:    terms: "",
apps/web/src\components\forms\ClinicProfileForm.tsx:118:    "non-covered": "",
apps/web/src\components\forms\ClinicProfileForm.tsx:119:    refund: "",
apps/web/src\components\forms\ClinicProfileForm.tsx:120:    complaint: "",
apps/web/src\components\forms\ClinicProfileForm.tsx:173:      legalDocEffectiveOverrides: { ...prev.legalDocEffectiveOverrides, [t]: v },
apps/web/src\components\forms\ClinicProfileForm.tsx:287:              <Field name="legalEntityName" label="법인명" value={values.legalEntityName} onChange={(v) => setField("legalEntityName", v)} errors={fieldErrors.legalEntityName} maxLength={200} />
apps/web/src\components\forms\ClinicProfileForm.tsx:455:              const headerId = `legal-override-${t}`;
apps/web/src\components\forms\ClinicProfileForm.tsx:456:              const bodyId = `legal-override-body-${t}`;
apps/web/src\components\forms\ClinicProfileForm.tsx:461:                    {DOC_TYPE_LABEL[t]} <span className="text-xs text-slate-500">(현재: {values.legalDocEffectiveOverrides[t] || values.policyEffectiveDate || "—"})</span>
apps/web/src\components\forms\ClinicProfileForm.tsx:465:                      name={`legalDocEffective_${t}`}
apps/web/src\components\forms\ClinicProfileForm.tsx:468:                      value={values.legalDocEffectiveOverrides[t]}
apps/web/src\components\forms\ClinicProfileForm.tsx:470:                      errors={fieldErrors[`legalDocEffectiveOverrides.${t}`]}
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:5://   LL-ACTION-04 (cycle1 LL-07): 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha (complaint→non-covered→privacy→refund→terms)
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:82:    legalDocEffectiveOverrides: extractLegalDocEffectiveOverrides(formData),
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:138:            business_registration_number, alternate_name, legal_entity_name,
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:150:            ${data.legalEntityName ?? null},
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:168:                 legal_entity_name = EXCLUDED.legal_entity_name,
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:259:            legalEntityName: data.legalEntityName ?? null,
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:279:          const overrideValue = data.legalDocEffectiveOverrides[docType];
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:291:          const legalAfter = await tx<{ id: string; inserted: boolean }[]>`
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:292:            INSERT INTO legal_document (
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:299:              ${docType}::legal_document_type,
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:311:              WHERE document_type IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint')
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:324:          const legal = legalAfter[0]!;
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:329:            mode: legal.inserted ? "insert" : "update",
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:30:  legal_entity_name: string | null;
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:161:               business_registration_number, alternate_name, legal_entity_name,
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:184:      const legalRows = await tx<LegalRow[]>`
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:187:          FROM legal_document
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:189:           AND document_type IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint')
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:192:      const overrides: Record<"privacy" | "terms" | "non-covered" | "refund" | "complaint", string> = {
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:193:        privacy: "",
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:194:        terms: "",
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:195:        "non-covered": "",
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:196:        refund: "",
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:197:        complaint: "",
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:200:      for (const row of legalRows) {
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:219:        legalEntityName: clinic.legal_entity_name ?? "",
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:238:        legalDocEffectiveOverrides: overrides,

 succeeded in 972ms:
apps/web/src\app\page.tsx
apps/web/src\app\sign-out\route.ts
apps/web/src\app\sign-in\page.tsx
apps/web/src\app\sign-in\actions.ts
apps/web/src\app\api\health\route.ts
apps/web/src\app\api\site-meta-fetch\route.ts
apps/web/src\app\sign-in\cleanup\route.ts
apps/web/src\app\sign-in\consume\route.ts
apps/web/src\app\(admin)\[instanceSlug]\page.tsx
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx
apps/web/src\app\(admin)\[instanceSlug]\doctors\[slug]\page.tsx
apps/web/src\app\(admin)\[instanceSlug]\articles\new\page.tsx
apps/web/src\app\(admin)\[instanceSlug]\treatments\[slug]\page.tsx
apps/web/src\app\(admin)\[instanceSlug]\doctors\new\page.tsx
apps/web/src\app\(admin)\[instanceSlug]\treatments\new\page.tsx
apps/web/src\app\(admin)\[instanceSlug]\articles\[slug]\page.tsx

 succeeded in 962ms:
apps/web/src/app\(admin)\layout.tsx:1:// @glitzy/web/(admin) layout — auth guard + sign-out button (Plan v1.0 § 3 ADMIN-UI-74)
apps/web/src/app\(admin)\[instanceSlug]\page.tsx:1:// @glitzy/web/(admin)/[instanceSlug] — 대시보드 (Plan v1.0 § 3.2 step 3)
apps/web/src/app\(admin)\[instanceSlug]\doctors\actions.ts:1:// @glitzy/web/(admin)/[instanceSlug]/doctors/actions
apps/web/src/app\(admin)\[instanceSlug]\clinic-profile\actions.ts:1:// @glitzy/web/(admin)/[instanceSlug]/clinic-profile/actions — LOCATION_LEGAL_PLAN v1.0 § 4
apps/web/src/app\(admin)\[instanceSlug]\articles\actions.ts:1:// @glitzy/web/(admin)/[instanceSlug]/articles/actions
apps/web/src/app\(admin)\[instanceSlug]\clinic-profile\page.tsx:1:// @glitzy/web/(admin)/[instanceSlug]/clinic-profile — LOCATION_LEGAL_PLAN v1.0 (M0 v0.5)
apps/web/src/app\(admin)\[instanceSlug]\articles\page.tsx:1:// @glitzy/web/(admin)/[instanceSlug]/articles — 아티클 목록
apps/web/src/app\(admin)\[instanceSlug]\treatments\actions.ts:1:// @glitzy/web/(admin)/[instanceSlug]/treatments/actions
apps/web/src/app\(admin)\[instanceSlug]\doctors\page.tsx:1:// @glitzy/web/(admin)/[instanceSlug]/doctors — 의료진 목록
apps/web/src/app\(admin)\[instanceSlug]\treatments\page.tsx:1:// @glitzy/web/(admin)/[instanceSlug]/treatments — 시술 페이지 목록
apps/web/src/app\(admin)\[instanceSlug]\articles\new\page.tsx:1:// @glitzy/web/(admin)/[instanceSlug]/articles/new
apps/web/src/app\(admin)\[instanceSlug]\doctors\new\page.tsx:1:// @glitzy/web/(admin)/[instanceSlug]/doctors/new
apps/web/src/app\(admin)\[instanceSlug]\articles\[slug]\page.tsx:1:// @glitzy/web/(admin)/[instanceSlug]/articles/[slug] — 편집
apps/web/src/app\(admin)\[instanceSlug]\doctors\[slug]\page.tsx:1:// @glitzy/web/(admin)/[instanceSlug]/doctors/[slug] — 의료진 편집
apps/web/src/app\(admin)\[instanceSlug]\treatments\new\page.tsx:1:// @glitzy/web/(admin)/[instanceSlug]/treatments/new
apps/web/src/app\(admin)\[instanceSlug]\treatments\[slug]\page.tsx:1:// @glitzy/web/(admin)/[instanceSlug]/treatments/[slug] — 편집

 succeeded in 944ms:
apps/web/src\seed.ts:1:// @glitzy/web/seed — operator + instance + membership bootstrap (Plan v1.0 § 7.1)
apps/web/src\seed.ts:2:// cycle1-2-code:
apps/web/src\seed.ts:3://   - WEB-03 snake_case columns
apps/web/src\seed.ts:4://   - WEB-04 SEED_DATABASE_URL fallback 제거
apps/web/src\seed.ts:5://   - WEB-13 normalizeIdentifier
apps/web/src\seed.ts:6://   - WEB-20 instance_membership active/inactive 분기 lookup
apps/web/src\seed.ts:7://   - WEB-21 SYSTEM_ACTOR DO UPDATE (재실행 수렴)
apps/web/src\seed.ts:8://   - WEB-35 전체 bootstrap 단일 transaction
apps/web/src\seed.ts:11:import { normalizeIdentifier } from "@glitzy/auth";
apps/web/src\seed.ts:25:    const m = a.match(/^--([^=]+)=(.*)$/);
apps/web/src\seed.ts:34:      "usage: pnpm --filter @glitzy/web seed --email=<email> --display-name=<name> --instance-slug=<slug> --instance-name=<name>",
apps/web/src\seed.ts:38:  // cycle4-code WEB-59: instanceSlug regex + displayName 길이 사전 검증 (한국어 메시지)
apps/web/src\seed.ts:39:  if (!/^[a-z0-9][a-z0-9-]{2,63}$/.test(instanceSlug)) {
apps/web/src\seed.ts:40:    console.error("[seed] instance-slug 형식 오류: 3~64자, 소문자/숫자/하이픈 (^[a-z0-9][a-z0-9-]{2,63}$)");
apps/web/src\seed.ts:44:    console.error("[seed] display-name 길이 오류: 1~200자");
apps/web/src\seed.ts:48:    console.error("[seed] instance-name 길이 오류: 1~200자");
apps/web/src\seed.ts:65:    // cycle2-code WEB-35: 전체 bootstrap 을 단일 transaction 으로 — partial state 회피
apps/web/src\seed.ts:66:    // cycle3-code WEB-49: pg_advisory_xact_lock 으로 동시 seed 실행 직렬화
apps/web/src\seed.ts:67:    // postgres library template parameter 는 number/string 만 — bigint 대신 정수 사용
apps/web/src\seed.ts:68:    const SEED_LOCK_KEY = 1431655765; // arbitrary unique int for advisory lock
apps/web/src\seed.ts:71:      // 1) system actor — cycle2-code WEB-21: DO UPDATE 로 재실행 수렴 보장
apps/web/src\seed.ts:90:      // 2) instance upsert
apps/web/src\seed.ts:102:      // 3) admin_user(operator) upsert — cycle4-code WEB-53: 모든 flag reset (재실행 결정성)
apps/web/src\seed.ts:124:      // 4) instance_membership — cycle2-code WEB-20: active 우선 분기 lookup
apps/web/src\seed.ts:125:      //    (a) active row 존재 → UPDATE role only
apps/web/src\seed.ts:126:      //    (b) inactive row 만 존재 → reactivate (deactivated_* NULL 복귀 · WEB-87)
apps/web/src\seed.ts:127:      //    (c) 없으면 INSERT
apps/web/src\seed.ts:164:      // 5) seed audit — audit_event (audit_log 는 instance_id NOT NULL)
apps/web/src\seed.ts:168:          'seed-completed',
apps/web/src\seed.ts:187:          next: `magic-link 발급 후 /sign-in/consume?identifier=${encodeURIComponent(normalizedEmail)}&token=… 클릭`,
apps/web/src\seed.ts:199:  console.error("[seed] failed", err);
apps/web/src\types\react-dom-stable.d.ts:1:// react-dom 18.3.x: useFormState/useFormStatus 는 stable export 지만 @types/react-dom 18.3.7 가
apps/web/src\types\react-dom-stable.d.ts:2:// 이를 canary.d.ts 에만 두고 main index.d.ts 에서 re-export 안 함. ambient module 로 보강.
apps/web/src\types\react-dom-stable.d.ts:5:  // eslint-disable-next-line @typescript-eslint/no-explicit-any
apps/web/src\types\react-dom-stable.d.ts:11:  // eslint-disable-next-line @typescript-eslint/no-explicit-any
apps/web/src\lib\action-context.ts:1:// @glitzy/web/lib/action-context — Server Action 공통 ctx resolve helper
apps/web/src\lib\action-context.ts:2:// ClinicProfile/Doctor/Treatment/Article actions 가 같은 패턴 사용
apps/web/src\lib\action-context.ts:4:import { redirect } from "next/navigation";
apps/web/src\lib\action-context.ts:5:import { notFound } from "next/navigation";
apps/web/src\lib\action-context.ts:11:} from "@glitzy/auth";
apps/web/src\lib\action-context.ts:12:import { asUuidV4, type AdminUserId, type InstanceId } from "@glitzy/shared-types";
apps/web/src\lib\action-context.ts:14:import { getSqlBase } from "./db";
apps/web/src\lib\action-context.ts:15:import { getAuthCfg } from "./env";
apps/web/src\lib\action-context.ts:16:import { readSessionCookie } from "./session-cookie";
apps/web/src\lib\action-context.ts:17:import { slugResolver } from "./slug-resolver";
apps/web/src\lib\action-context.ts:25:/**
apps/web/src\lib\action-context.ts:27: * 실패 시 redirect/notFound throw — caller 는 try 후 정상 흐름만 처리.
apps/web/src\lib\action-context.ts:29: */
apps/web/src\lib\action-context.ts:32:  if (!signedToken) redirect("/sign-in");
apps/web/src\lib\action-context.ts:42:    redirect(`/sign-in/cleanup?reason=${reason}`);
apps/web/src\lib\action-context.ts:45:  // cycle2-3entity WEB-26: branded UUID narrow
apps/web/src\lib\action-context.ts:50:    redirect("/sign-in/cleanup?reason=session-not-found");
apps/web/src\lib\action-context.ts:58:/**
apps/web/src\lib\action-context.ts:59: * Next.js App Router 의 redirect()/notFound() 가 throw 하는 control-flow error 판별.
apps/web/src\lib\action-context.ts:60: * try/catch 가 일반 error 로 swallow 하지 않도록 outer catch 에서 rethrow 용도.
apps/web/src\lib\action-context.ts:62: */
apps/web/src\lib\action-context.ts:67:  // cycle5-3entity WEB-48: Next 14+ notFound() 는 NEXT_HTTP_ERROR_FALLBACK;404 패턴 사용
apps/web/src\lib\action-context.ts:75:/** action eligibility check helper — withSkeletonTx 안에서 ctx 받은 후 호출 */
apps/web/src\lib\clinic-profile-schema.ts:1:// @glitzy/web/lib/clinic-profile-schema — LOCATION_LEGAL_PLAN v1.0 § 3.2
apps/web/src\lib\clinic-profile-schema.ts:2://
apps/web/src\lib\clinic-profile-schema.ts:3:// ClinicProfile + LocationProfile(main) + 5 LegalDocument override 통합 zod schema SoT.
apps/web/src\lib\clinic-profile-schema.ts:4:// form / server action 양쪽 모두 동일 SoT (LL-FORM-09).
apps/web/src\lib\clinic-profile-schema.ts:5://
apps/web/src\lib\clinic-profile-schema.ts:6:// 변수 정합성:
apps/web/src\lib\clinic-profile-schema.ts:7://   - businessHours 7요일 + 점심 (LL-FORM-07/10)
apps/web/src\lib\clinic-profile-schema.ts:8://   - primaryCtas 3종 minimal (CT-03 SoT token: phone/kakao-talk/naver-reservation — cycle4 LL-51)
apps/web/src\lib\clinic-profile-schema.ts:9://   - 5종 LegalDocument effectiveDate override (LL-FORM-13 · cycle3 LL-39 flat key + parser helper)
apps/web/src\lib\clinic-profile-schema.ts:12:import { CLOSED_DOCUMENT_TYPES, type ClosedLegalDocumentType } from "@glitzy/core-content";
apps/web/src\lib\clinic-profile-schema.ts:14:// === 공통 helper (apps/web v1.2 패턴 재사용) ===
apps/web/src\lib\clinic-profile-schema.ts:34:const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
apps/web/src\lib\clinic-profile-schema.ts:35:const TIME_REGEX = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
apps/web/src\lib\clinic-profile-schema.ts:36:// LL-FORM-12 (cycle1 LL-20): 한국 + 국제 +82 — '.' 구분자 거절
apps/web/src\lib\clinic-profile-schema.ts:37:const PHONE_REGEX = /^(\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}$/;
apps/web/src\lib\clinic-profile-schema.ts:73:// === BusinessHours (7요일 단순 입력 형식 — form input 단) ===
apps/web/src\lib\clinic-profile-schema.ts:85:    if (val.closed) return; // 휴진 — 다른 입력 무시
apps/web/src\lib\clinic-profile-schema.ts:134:    // 평일 (mon~fri) 5일 중 1일 이상 영업 필수
apps/web/src\lib\clinic-profile-schema.ts:149:// === PrimaryCTA (CT-03 SoT — UI subset 3종: cycle4 LL-51) ===
apps/web/src\lib\clinic-profile-schema.ts:169:// === Section (a) ClinicProfile 기관 정체성 ===
apps/web/src\lib\clinic-profile-schema.ts:188:      (v) => v === null || v === undefined || /^\d{3}-\d{2}-\d{5}$/.test(v),
apps/web/src\lib\clinic-profile-schema.ts:199:// === Section (b) LocationProfile main ===
apps/web/src\lib\clinic-profile-schema.ts:209:    .refine((v) => /^[A-Z]{2}$/.test(v), { message: "국가 코드는 ISO 3166-1 alpha-2 (대문자 2자) 이어야 합니다." }),
apps/web/src\lib\clinic-profile-schema.ts:223:      (v) => v === null || v === undefined || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v),
apps/web/src\lib\clinic-profile-schema.ts:231:// === Section (c) Policy variables ===
apps/web/src\lib\clinic-profile-schema.ts:253:// === Section (d) 5 LegalDocument effectiveDate override (cycle3 LL-39 flat key) ===
apps/web/src\lib\clinic-profile-schema.ts:277:// === 통합 Input schema (section a + b + c + d) ===
apps/web/src\lib\clinic-profile-schema.ts:286:    // featuredChannelId 가 primaryCtas[].id 중 하나에 매칭되어야 함
apps/web/src\lib\clinic-profile-schema.ts:299:// === FormData parser helpers (cycle3 LL-39 flat key → nested object) ===
apps/web/src\lib\clinic-profile-schema.ts:301:/**
apps/web/src\lib\clinic-profile-schema.ts:304: */
apps/web/src\lib\clinic-profile-schema.ts:316:/**
apps/web/src\lib\clinic-profile-schema.ts:319: */
apps/web/src\lib\clinic-profile-schema.ts:335:/**
apps/web/src\lib\clinic-profile-schema.ts:337: * FormData key: cta_<type>_label / cta_<type>_targetUrl (입력 없으면 제외)
apps/web/src\lib\clinic-profile-schema.ts:338: */
apps/web/src\lib\clinic-profile-schema.ts:359:// === BusinessHours → CT-02 SoT 변환 (LL-ACTION-09) ===
apps/web/src\lib\clinic-profile-schema.ts:378:/**
apps/web/src\lib\clinic-profile-schema.ts:381: * receptionHours/specialClosures 는 v0.3 빈 배열 (LL-DEFER-16).
apps/web/src\lib\clinic-profile-schema.ts:382: */
apps/web/src\lib\clinic-profile-schema.ts:384:  // open/close grouping
apps/web/src\lib\clinic-profile-schema.ts:418:/**
apps/web/src\lib\clinic-profile-schema.ts:420: */
apps/web/src\lib\db.ts:1:// @glitzy/web/lib/db — postgres.Sql singleton (Plan v1.0 § 3 lib/db.ts)
apps/web/src\lib\db.ts:2:// Next.js dev HMR 안전 — globalThis 캐싱
apps/web/src\lib\db.ts:5:import { getEnv } from "./env";
apps/web/src\lib\db.ts:8:  // eslint-disable-next-line no-var
apps/web/src\lib\db.ts:12:// cycle4-code WEB-52: prod/dev 모두 singleton — globalThis 는 dev HMR 안전성용
apps/web/src\lib\db.ts:23:    // Plan § 7: WEB_DATABASE_URL 최소 권한 + GRANT app_tenant_user TO <web_role> (NOINHERIT)
apps/web/src\lib\db.ts:24:    // tenant tx 진입 시 SET LOCAL ROLE app_tenant_user (packages/db.withTenantTransaction)
apps/web/src\lib\deny-reason-map.ts:1:// @glitzy/web/lib/deny-reason-map — AuthDenyReason 17종 + SignInReason exhaustive UI mapping
apps/web/src\lib\deny-reason-map.ts:2:// Plan v1.0 § 5.4 (cycle3·5 정정 ADMIN-UI-34·55)
apps/web/src\lib\deny-reason-map.ts:3:// build-time assertNever exhaustive enforce — union 확장 시 컴파일 fail
apps/web/src\lib\deny-reason-map.ts:5:import type { AuthDenyReason } from "@glitzy/auth";
apps/web/src\lib\deny-reason-map.ts:7:/** Plan § 5.4: sign-in page query reason union — AuthDenyReason 17 + 추가 reason */
apps/web/src\lib\deny-reason-map.ts:8:// cycle4-code WEB-63: user-inactive 는 AuthDenyReason 에 이미 포함 — 중복 제거
apps/web/src\lib\deny-reason-map.ts:14:// cycle3-code WEB-38: 외부 query string narrow — assertNever 까지 임의 값 도달 차단
apps/web/src\lib\deny-reason-map.ts:35:  // user-inactive 는 AuthDenyReason 17 종에 이미 포함되어 위 enumeration 에서 처리됨
apps/web/src\lib\deny-reason-map.ts:65:      // Plan § 5.4 ADMIN-UI-35: 현재 코드 경로에서 unreachable (resolveTenantContext 가 active=true 만 조회)
apps/web/src\lib\deny-reason-map.ts:66:      // future-proof — packages/auth v0.3 cascade 시 분기 추가
apps/web/src\lib\deny-reason-map.ts:87:/** /sign-in 페이지에서 query `reason` 을 사용자 메시지로 변환 — cycle2-code WEB-31: assertNever exhaustive enforce */
apps/web/src\app\layout.tsx:1:// @glitzy/web — root layout (Plan v1.0 § 3)
apps/web/src\app\layout.tsx:3:import "@/styles/globals.css";
apps/web/src\app\layout.tsx:13:      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">{children}</body>
apps/web/src\app\layout.tsx:14:    </html>
apps/web/src\lib\env.ts:1:// @glitzy/web/lib/env — env 검증 + AuthConfig 주입 (Plan v1.0 § 7)
apps/web/src\lib\env.ts:2:// server-side only — NEXT_PUBLIC_* 사용 안 함 (ADMIN-UI-19)
apps/web/src\lib\env.ts:5:import { validateAuthConfig, type AuthConfig } from "@glitzy/auth";
apps/web/src\lib\env.ts:46:  // cycle1-code WEB-12: packages/auth.validateAuthConfig 호출 — refresh interval < session TTL 등 invariant 검증
apps/web/src\lib\env.ts:52:/** Plan § 7 ADMIN-UI-19: server-side 3중 가드 — dev mode + mock + flag 모두 true 일 때만 mailbox UI 노출 */
apps/web/src\app\page.tsx:1:// @glitzy/web — / root page (Plan v1.0 § 3.1 라우트 흐름)
apps/web/src\app\page.tsx:2:// 미인증 → /sign-in · 인증 → firstActiveMembershipSlug
apps/web/src\app\page.tsx:3:// cycle3-3entity WEB-32·33: admin_user.active 검증 + asUuidV4 narrow
apps/web/src\app\page.tsx:5:import { redirect } from "next/navigation";
apps/web/src\app\page.tsx:6:import { getActiveSession } from "@glitzy/auth";
apps/web/src\app\page.tsx:7:import { asUuidV4, type AdminUserId } from "@glitzy/shared-types";
apps/web/src\app\page.tsx:9:import { getAuthCfg } from "@/lib/env";
apps/web/src\app\page.tsx:10:import { getSqlBase } from "@/lib/db";
apps/web/src\app\page.tsx:11:import { readSessionCookie } from "@/lib/session-cookie";
apps/web/src\app\page.tsx:12:import { resolveFirstActiveMembershipSlug } from "@/lib/post-login-redirect";
apps/web/src\app\page.tsx:17:    redirect("/sign-in");
apps/web/src\app\page.tsx:32:    redirect(`/sign-in/cleanup?reason=${reason}`);
apps/web/src\app\page.tsx:35:  // cycle3-3entity WEB-33: branded UUID narrow
apps/web/src\app\page.tsx:40:    redirect("/sign-in/cleanup?reason=session-not-found");
apps/web/src\app\page.tsx:43:  // cycle3-3entity WEB-32: admin_user.active 검증 (membership 만으로는 부족)
apps/web/src\app\page.tsx:48:    redirect("/sign-in/cleanup?reason=user-inactive");
apps/web/src\app\page.tsx:51:  // cycle1-code WEB-14: root redirect 는 read-only — audit emit 안 함 (consume route 만 audit)
apps/web/src\app\page.tsx:54:    redirect("/sign-in?reason=no-active-membership");
apps/web/src\app\page.tsx:56:  redirect(`/${result.slug}`);
apps/web/src\lib\errors.ts:1:// @glitzy/web/lib/errors — DB constraint violation → field/form error mapping
apps/web/src\lib\errors.ts:2:// cycle1-3entity WEB-08: ClinicProfile + DoctorProfile + TreatmentPage + Article constraint 추가
apps/web/src\lib\errors.ts:3:// LOCATION_LEGAL_PLAN v1.0 (cycle3 LL-44 + cycle4 LL-48): LegalDocument + LocationProfile + clinic_profile policy/primary_ctas + MainLocationMissingError
apps/web/src\lib\errors.ts:5:/**
apps/web/src\lib\errors.ts:8: */
apps/web/src\lib\errors.ts:20:// constraint_name → field + 한국어 메시지
apps/web/src\lib\errors.ts:22:  // ClinicProfile (C0001)
apps/web/src\lib\errors.ts:29:  // DoctorProfile (C0003)
apps/web/src\lib\errors.ts:30:  doctor_profile_slug_regex: { field: "slug", message: "slug 형식이 올바르지 않습니다. (3~64자, 소문자/숫자/하이픈)" },
apps/web/src\lib\errors.ts:34:  // TreatmentPage (C0004)
apps/web/src\lib\errors.ts:41:  // Article (C0005)
apps/web/src\lib\errors.ts:49:  // ClinicProfile policy + primary_ctas (C0007 · LOCATION_LEGAL_PLAN v1.0)
apps/web/src\lib\errors.ts:55:  // LocationProfile parentClinic (C0008 · LL-SCHEMA-14)
apps/web/src\lib\errors.ts:57:  // LLC-10 patch: LocationProfile phone CHECK (C0002)
apps/web/src\lib\errors.ts:60:  // LegalDocument (C0006 · LOCATION_LEGAL_PLAN v1.0)
apps/web/src\lib\errors.ts:78:/**
apps/web/src\lib\errors.ts:79: * postgres-js error 의 `code` (SQLSTATE) 와 `constraint_name` 으로 field/form 매핑.
apps/web/src\lib\errors.ts:81: */
apps/web/src\lib\errors.ts:96:  // unknown constraint — generic
apps/web/src\lib\errors.ts:103:/** 기존 호출처 호환 — FieldErrors 만 반환 (form 메시지는 null) */
apps/web/src\components\dev\MockMailbox.tsx:1:// @glitzy/web/components/dev/MockMailbox — server-side 3중 가드 (Plan § 7 ADMIN-UI-19)
apps/web/src\components\dev\MockMailbox.tsx:2:// cycle1-code WEB-16: sign-in/page.tsx 의 inline 블록을 별도 dev component 로 분리 (Plan tree 정합)
apps/web/src\components\dev\MockMailbox.tsx:3:// NODE_ENV !== 'production' && RESEND_MODE === 'mock' && DEV_MOCK_MAILBOX_VIEW === 'true' 모두 통과 시에만 렌더
apps/web/src\components\dev\MockMailbox.tsx:5:import { getMockMailbox } from "@glitzy/auth";
apps/web/src\components\dev\MockMailbox.tsx:6:import { isMockMailboxVisible } from "@/lib/env";
apps/web/src\components\dev\MockMailbox.tsx:14:        <summary>dev mock mailbox (비어있음)</summary>
apps/web/src\components\dev\MockMailbox.tsx:15:      </details>
apps/web/src\components\dev\MockMailbox.tsx:18:  // 최신 항목 먼저 (max 20)
apps/web/src\components\dev\MockMailbox.tsx:22:      <summary>dev mock mailbox (최신 {recent.length}건)</summary>
apps/web/src\components\dev\MockMailbox.tsx:26:            <div className="font-medium">{entry.to}</div>
apps/web/src\components\dev\MockMailbox.tsx:29:              href={`/sign-in/consume?identifier=${encodeURIComponent(entry.to)}&token=${encodeURIComponent(entry.tokenPlain)}`}
apps/web/src\components\dev\MockMailbox.tsx:31:              /sign-in/consume?identifier=…&token={entry.tokenPlain.slice(0, 12)}…
apps/web/src\components\dev\MockMailbox.tsx:32:            </a>
apps/web/src\components\dev\MockMailbox.tsx:33:            <div className="text-slate-500">@ {new Date(entry.at).toISOString()}</div>
apps/web/src\components\dev\MockMailbox.tsx:34:          </li>
apps/web/src\components\dev\MockMailbox.tsx:36:      </ul>
apps/web/src\components\dev\MockMailbox.tsx:37:    </details>
apps/web/src\lib\page-context.ts:1:// @glitzy/web/lib/page-context — admin Page-level 공통 ctx resolve (eligibility 검증 포함)
apps/web/src\lib\page-context.ts:2:// cycle1-3entity WEB-02·03·07: 목록/신규/상세 페이지에서 slug resolve + tenant resolve + eligibility 모두 통과해야 렌더링
apps/web/src\lib\page-context.ts:4:import { notFound, redirect } from "next/navigation";
apps/web/src\lib\page-context.ts:13:} from "@glitzy/auth";
apps/web/src\lib\page-context.ts:14:import { asUuidV4, type AdminUserId, type InstanceId } from "@glitzy/shared-types";
apps/web/src\lib\page-context.ts:16:import { getSqlBase } from "./db";
apps/web/src\lib\page-context.ts:17:import { getAuthCfg } from "./env";
apps/web/src\lib\page-context.ts:18:import { readSessionCookie } from "./session-cookie";
apps/web/src\lib\page-context.ts:19:import { slugResolver } from "./slug-resolver";
apps/web/src\lib\page-context.ts:20:import { mapAuthDenyReasonToUi } from "./deny-reason-map";
apps/web/src\lib\page-context.ts:29:/**
apps/web/src\lib\page-context.ts:32: *   - 세션/slug deny: redirect/notFound (Next.js control-flow throw)
apps/web/src\lib\page-context.ts:33: *   - tenant resolve / eligibility deny: TenantResolveError throw (caller 가 catch 후 forbidden/info 렌더링)
apps/web/src\lib\page-context.ts:35: */
apps/web/src\lib\page-context.ts:41:  if (!signedToken) redirect("/sign-in");
apps/web/src\lib\page-context.ts:51:    redirect(`/sign-in/cleanup?reason=${reason}`);
apps/web/src\lib\page-context.ts:54:  // cycle2-3entity WEB-26: branded UUID narrow — invalid 시 cleanup route 경유
apps/web/src\lib\page-context.ts:59:    redirect("/sign-in/cleanup?reason=session-not-found");
apps/web/src\lib\page-context.ts:70:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src\lib\page-context.ts:72:      // forbidden/info — page 측에서 별도 화면 보여줘야 함 → 예외 throw
apps/web/src\lib\page-context.ts:81:    // operator-role-required / *-ineligible → forbidden 처리
apps/web/src\lib\post-login-redirect.ts:1:// @glitzy/web/lib/post-login-redirect — first active operator membership instance slug (Plan v1.0 § 3.2)
apps/web/src\lib\post-login-redirect.ts:2:// cycle4·5 결정: sqlBase 직접 + audit_event emit (withServiceRole 미사용)
apps/web/src\lib\post-login-redirect.ts:3:// session 발급 전 호출 (ADMIN-UI-76 — 무권한 유효 세션 발급 방지)
apps/web/src\lib\post-login-redirect.ts:6:import { emitAuditEvent } from "@glitzy/auth";
apps/web/src\lib\post-login-redirect.ts:7:import type { AdminUserId } from "@glitzy/shared-types";
apps/web/src\lib\post-login-redirect.ts:13:// cycle1-code WEB-14: emitAudit 옵션 — consume route 는 true, root page 는 false (false positive 방지)
apps/web/src\app\(admin)\layout.tsx:1:// @glitzy/web/(admin) layout — auth guard + sign-out button (Plan v1.0 § 3 ADMIN-UI-74)
apps/web/src\app\(admin)\layout.tsx:2:// middleware 미사용 — cookie read + redirect 모두 server-side layout 에서 수행
apps/web/src\app\(admin)\layout.tsx:4:import { redirect } from "next/navigation";
apps/web/src\app\(admin)\layout.tsx:5:import { AuthDeniedError, getActiveSession } from "@glitzy/auth";
apps/web/src\app\(admin)\layout.tsx:7:import { getAuthCfg } from "@/lib/env";
apps/web/src\app\(admin)\layout.tsx:8:import { getSqlBase } from "@/lib/db";
apps/web/src\app\(admin)\layout.tsx:9:import { readSessionCookie } from "@/lib/session-cookie";
apps/web/src\app\(admin)\layout.tsx:14:    redirect("/sign-in");
apps/web/src\app\(admin)\layout.tsx:17:  // session signature 검증만 — full tenant resolve 는 각 page 가 수행 (§ 3.2 step 3)
apps/web/src\app\(admin)\layout.tsx:18:  // cycle1-code WEB-06: tampered/expired cookie 시 cleanup route 로 redirect → cookie clear + audit
apps/web/src\app\(admin)\layout.tsx:23:    redirect(`/sign-in/cleanup?reason=${reason}`);
apps/web/src\app\(admin)\layout.tsx:30:          <span className="text-sm font-semibold">Glitzy 어드민 (M0 walking skeleton)</span>
apps/web/src\app\(admin)\layout.tsx:31:          <form action="/sign-out" method="post">
apps/web/src\app\(admin)\layout.tsx:37:            </button>
apps/web/src\app\(admin)\layout.tsx:38:          </form>
apps/web/src\app\(admin)\layout.tsx:39:        </div>
apps/web/src\app\(admin)\layout.tsx:40:      </header>
apps/web/src\app\(admin)\layout.tsx:41:      <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
apps/web/src\app\(admin)\layout.tsx:42:    </div>
apps/web/src\components\forms\ArticleForm.tsx:1:// @glitzy/web/components/forms/ArticleForm
apps/web/src\components\forms\ArticleForm.tsx:6:import { Field, SelectField } from "./Field";
apps/web/src\components\forms\ArticleForm.tsx:7:import type { SaveResult } from "@/lib/save-result";
apps/web/src\components\forms\ArticleForm.tsx:71:        </div>
apps/web/src\components\forms\ArticleForm.tsx:74:        <div className="rounded-md border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-900">{formError}</div>
apps/web/src\components\forms\ArticleForm.tsx:77:      <Field name="slug" label="slug" required value={v.slug} onChange={(x) => set("slug", x)} errors={fieldErrors.slug} maxLength={100} />
apps/web/src\components\forms\ArticleForm.tsx:78:      <Field name="title" label="제목" required value={v.title} onChange={(x) => set("title", x)} errors={fieldErrors.title} maxLength={200} />
apps/web/src\components\forms\ArticleForm.tsx:79:      <Field name="summary" label="요약" required textarea rows={3} value={v.summary} onChange={(x) => set("summary", x)} errors={fieldErrors.summary} minLength={80} maxLength={200} hint="80~200자" />
apps/web/src\components\forms\ArticleForm.tsx:80:      <Field name="bodyMarkdown" label="본문 (Markdown)" required textarea rows={18} value={v.bodyMarkdown} onChange={(x) => set("bodyMarkdown", x)} errors={fieldErrors.bodyMarkdown} maxLength={100000} />
apps/web/src\components\forms\ArticleForm.tsx:81:      <Field name="heroImageUrl" label="hero 이미지 URL" type="url" value={v.heroImageUrl} onChange={(x) => set("heroImageUrl", x)} errors={fieldErrors.heroImageUrl} maxLength={2048} />
apps/web/src\components\forms\ArticleForm.tsx:82:      <SelectField name="status" label="발행 상태" required value={v.status} onChange={(x) => set("status", x)} options={STATUS_OPTIONS} errors={fieldErrors.status} />
apps/web/src\components\forms\ArticleForm.tsx:83:      <SelectField name="riskLevel" label="위험도" value={v.riskLevel} onChange={(x) => set("riskLevel", x)} options={RISK_OPTIONS} errors={fieldErrors.riskLevel} />
apps/web/src\components\forms\ArticleForm.tsx:92:      />
apps/web/src\components\forms\ArticleForm.tsx:94:      <SubmitButton isNew={isNew} />
apps/web/src\components\forms\ArticleForm.tsx:95:    </form>
apps/web/src\components\forms\ArticleForm.tsx:108:    </button>
apps/web/src\lib\save-result.ts:1:// @glitzy/web/lib/save-result — Server Action 공통 결과 타입
apps/web/src\lib\save-result.ts:3:import type { FieldErrors } from "./errors";
apps/web/src\components\forms\ClinicProfileForm.tsx:1:// @glitzy/web/components/forms/ClinicProfileForm — LOCATION_LEGAL_PLAN v1.0 § 3
apps/web/src\components\forms\ClinicProfileForm.tsx:2:// 3 섹션 + 5 LegalDocument override 재구성.
apps/web/src\components\forms\ClinicProfileForm.tsx:3://
apps/web/src\components\forms\ClinicProfileForm.tsx:4:// (a) 기관 정체성 (기존 v1.1 URL scrape prefill)
apps/web/src\components\forms\ClinicProfileForm.tsx:5:// (b) 본원 위치·연락·시간 (신규 · LL-FORM-03·07·08·12)
apps/web/src\components\forms\ClinicProfileForm.tsx:6:// (c) 정책 변수 보조 (신규 · LL-FORM-04)
apps/web/src\components\forms\ClinicProfileForm.tsx:7:// (d) 5 LegalDocument override 보조 (신규 · LL-FORM-13)
apps/web/src\components\forms\ClinicProfileForm.tsx:13:import { Field } from "@/components/forms/Field";
apps/web/src\components\forms\ClinicProfileForm.tsx:14:import type { SaveResult } from "@/app/(admin)/[instanceSlug]/clinic-profile/actions";
apps/web/src\components\forms\ClinicProfileForm.tsx:18:} from "@/lib/clinic-profile-schema";
apps/web/src\components\forms\ClinicProfileForm.tsx:45:  // (a) 기관 정체성
apps/web/src\components\forms\ClinicProfileForm.tsx:57:  // (b) 본원 위치·연락·시간
apps/web/src\components\forms\ClinicProfileForm.tsx:68:  // (c) 정책 변수
apps/web/src\components\forms\ClinicProfileForm.tsx:73:  // (d) 5 LegalDocument effective date override
apps/web/src\components\forms\ClinicProfileForm.tsx:185:      const res = await fetch("/api/site-meta-fetch", {
apps/web/src\components\forms\ClinicProfileForm.tsx:187:        headers: { "content-type": "application/json" },
apps/web/src\components\forms\ClinicProfileForm.tsx:227:  // featuredChannelId 의 가능한 option 리스트
apps/web/src\components\forms\ClinicProfileForm.tsx:236:        <h2 className="mb-2 text-base font-medium text-blue-900">사이트 URL 자동 분석 (onboarding)</h2>
apps/web/src\components\forms\ClinicProfileForm.tsx:239:        </p>
apps/web/src\components\forms\ClinicProfileForm.tsx:245:            placeholder="https://example-clinic.com"
apps/web/src\components\forms\ClinicProfileForm.tsx:247:          />
apps/web/src\components\forms\ClinicProfileForm.tsx:255:          </button>
apps/web/src\components\forms\ClinicProfileForm.tsx:256:        </div>
apps/web/src\components\forms\ClinicProfileForm.tsx:257:        {analyzeError && <div className="mt-2 text-xs text-rose-700">{analyzeError}</div>}
apps/web/src\components\forms\ClinicProfileForm.tsx:261:          </div>
apps/web/src\components\forms\ClinicProfileForm.tsx:263:      </section>
apps/web/src\components\forms\ClinicProfileForm.tsx:269:          </div>
apps/web/src\components\forms\ClinicProfileForm.tsx:272:          <div className="rounded-md border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-900">{formError}</div>
apps/web/src\components\forms\ClinicProfileForm.tsx:275:        {/* (a) 기관 정체성 */}
apps/web/src\components\forms\ClinicProfileForm.tsx:277:          <legend className="px-1 text-sm font-medium text-slate-900">기관 정체성</legend>
apps/web/src\components\forms\ClinicProfileForm.tsx:278:          <Field name="name" label="기관명" required value={values.name} onChange={(v) => setField("name", v)} errors={fieldErrors.name} maxLength={100} />
apps/web/src\components\forms\ClinicProfileForm.tsx:279:          <Field name="description" label="간략 소개" required value={values.description} onChange={(v) => setField("description", v)} errors={fieldErrors.description} textarea minLength={80} maxLength={300} hint="80~300자" />
apps/web/src\components\forms\ClinicProfileForm.tsx:280:          <Field name="logoUrl" label="로고 URL" required type="url" value={values.logoUrl} onChange={(v) => setField("logoUrl", v)} errors={fieldErrors.logoUrl} maxLength={2048} />
apps/web/src\components\forms\ClinicProfileForm.tsx:281:          <Field name="ogImageUrl" label="OG 이미지 URL" required type="url" value={values.ogImageUrl} onChange={(v) => setField("ogImageUrl", v)} errors={fieldErrors.ogImageUrl} maxLength={2048} />
apps/web/src\components\forms\ClinicProfileForm.tsx:282:          <Field name="businessRegistrationNumber" label="사업자등록번호" value={values.businessRegistrationNumber} onChange={(v) => setField("businessRegistrationNumber", v)} errors={fieldErrors.businessRegistrationNumber} placeholder="000-00-00000" />
apps/web/src\components\forms\ClinicProfileForm.tsx:284:            <summary className="cursor-pointer">선택 필드</summary>
apps/web/src\components\forms\ClinicProfileForm.tsx:286:              <Field name="alternateName" label="대체명" value={values.alternateName} onChange={(v) => setField("alternateName", v)} errors={fieldErrors.alternateName} maxLength={100} />
apps/web/src\components\forms\ClinicProfileForm.tsx:287:              <Field name="legalEntityName" label="법인명" value={values.legalEntityName} onChange={(v) => setField("legalEntityName", v)} errors={fieldErrors.legalEntityName} maxLength={200} />
apps/web/src\components\forms\ClinicProfileForm.tsx:288:              <Field name="slogan" label="슬로건" value={values.slogan} onChange={(v) => setField("slogan", v)} errors={fieldErrors.slogan} maxLength={200} />
apps/web/src\components\forms\ClinicProfileForm.tsx:289:              <Field name="longDescription" label="상세 설명" value={values.longDescription} onChange={(v) => setField("longDescription", v)} errors={fieldErrors.longDescription} textarea maxLength={2000} />
apps/web/src\components\forms\ClinicProfileForm.tsx:290:              <Field name="foundingDate" label="설립일" type="date" value={values.foundingDate} onChange={(v) => setField("foundingDate", v)} errors={fieldErrors.foundingDate} placeholder="2024-01-01" />
apps/web/src\components\forms\ClinicProfileForm.tsx:291:              <Field name="founder" label="설립자" value={values.founder} onChange={(v) => setField("founder", v)} errors={fieldErrors.founder} maxLength={100} />
apps/web/src\components\forms\ClinicProfileForm.tsx:292:            </div>
apps/web/src\components\forms\ClinicProfileForm.tsx:293:          </details>
apps/web/src\components\forms\ClinicProfileForm.tsx:294:        </fieldset>
apps/web/src\components\forms\ClinicProfileForm.tsx:296:        {/* (b) 본원 위치·연락·시간 */}
apps/web/src\components\forms\ClinicProfileForm.tsx:298:          <legend className="px-1 text-sm font-medium text-slate-900">본원 위치 · 연락 · 시간</legend>
apps/web/src\components\forms\ClinicProfileForm.tsx:299:          <p className="text-xs text-slate-600">이 정보로 LocationProfile(main) 이 자동 생성되며, 5종 정책 문서의 변수에도 사용됩니다.</p>
apps/web/src\components\forms\ClinicProfileForm.tsx:301:            <Field name="addressRegion" label="시·도" required value={values.addressRegion} onChange={(v) => setField("addressRegion", v)} errors={fieldErrors.addressRegion} maxLength={100} placeholder="서울특별시" />
apps/web/src\components\forms\ClinicProfileForm.tsx:302:            <Field name="addressLocality" label="시·군·구" required value={values.addressLocality} onChange={(v) => setField("addressLocality", v)} errors={fieldErrors.addressLocality} maxLength={100} placeholder="강남구" />
apps/web/src\components\forms\ClinicProfileForm.tsx:303:          </div>
apps/web/src\components\forms\ClinicProfileForm.tsx:304:          <Field name="streetAddress" label="도로명 주소" required value={values.streetAddress} onChange={(v) => setField("streetAddress", v)} errors={fieldErrors.streetAddress} maxLength={200} placeholder="테스트로 1" />
apps/web/src\components\forms\ClinicProfileForm.tsx:306:            <Field name="postalCode" label="우편번호" required value={values.postalCode} onChange={(v) => setField("postalCode", v)} errors={fieldErrors.postalCode} maxLength={20} placeholder="06000" />
apps/web/src\components\forms\ClinicProfileForm.tsx:307:            <Field name="addressCountry" label="국가 코드 (ISO 3166-1 alpha-2)" required value={values.addressCountry} onChange={(v) => setField("addressCountry", v.toUpperCase())} errors={fieldErrors.addressCountry} maxLength={2} hint="대문자 2자" />
apps/web/src\components\forms\ClinicProfileForm.tsx:308:          </div>
apps/web/src\components\forms\ClinicProfileForm.tsx:310:            <Field name="locationTelephone" label="본원 전화" required value={values.locationTelephone} onChange={(v) => setField("locationTelephone", v)} errors={fieldErrors.locationTelephone} placeholder="02-1234-5678" />
apps/web/src\components\forms\ClinicProfileForm.tsx:311:            <Field name="locationEmail" label="본원 이메일" type="email" value={values.locationEmail} onChange={(v) => setField("locationEmail", v)} errors={fieldErrors.locationEmail} placeholder="info@example.com" />
apps/web/src\components\forms\ClinicProfileForm.tsx:312:          </div>
apps/web/src\components\forms\ClinicProfileForm.tsx:315:            <label className="text-sm font-medium">진료 시간</label>
apps/web/src\components\forms\ClinicProfileForm.tsx:316:            {fieldErrors.businessHours && <span className="text-xs text-rose-700">{fieldErrors.businessHours.join(", ")}</span>}
apps/web/src\components\forms\ClinicProfileForm.tsx:328:                      <span id={dayHeaderId} className="w-16 text-sm">{DAY_LABEL[day]}</span>
apps/web/src\components\forms\ClinicProfileForm.tsx:329:                      {/* LLC-08 patch: 휴진 toggle 의 aria-controls — 해당 row 의 input group id 지목 */}
apps/web/src\components\forms\ClinicProfileForm.tsx:338:                        />
apps/web/src\components\forms\ClinicProfileForm.tsx:340:                      </label>
apps/web/src\components\forms\ClinicProfileForm.tsx:351:                          />
apps/web/src\components\forms\ClinicProfileForm.tsx:352:                          <span className="text-xs">~</span>
apps/web/src\components\forms\ClinicProfileForm.tsx:361:                          />
apps/web/src\components\forms\ClinicProfileForm.tsx:369:                            />
apps/web/src\components\forms\ClinicProfileForm.tsx:371:                          </label>
apps/web/src\components\forms\ClinicProfileForm.tsx:382:                              />
apps/web/src\components\forms\ClinicProfileForm.tsx:383:                              <span className="text-xs">~</span>
apps/web/src\components\forms\ClinicProfileForm.tsx:392:                              />
apps/web/src\components\forms\ClinicProfileForm.tsx:393:                            </>
apps/web/src\components\forms\ClinicProfileForm.tsx:395:                        </span>
apps/web/src\components\forms\ClinicProfileForm.tsx:397:                    </div>
apps/web/src\components\forms\ClinicProfileForm.tsx:399:                      <p id={dayErrorId} role="alert" className="text-xs text-rose-700">{dayErrorMessages.join(", ")}</p>
apps/web/src\components\forms\ClinicProfileForm.tsx:401:                  </div>
apps/web/src\components\forms\ClinicProfileForm.tsx:404:            </div>
apps/web/src\components\forms\ClinicProfileForm.tsx:405:          </div>
apps/web/src\components\forms\ClinicProfileForm.tsx:408:            <label className="text-sm font-medium">예약 채널 (최소 1개)</label>
apps/web/src\components\forms\ClinicProfileForm.tsx:409:            {fieldErrors.primaryCtas && <span className="text-xs text-rose-700">{fieldErrors.primaryCtas.join(", ")}</span>}
apps/web/src\components\forms\ClinicProfileForm.tsx:411:              <CtaRow type="phone" label="전화 예약" enabled={ctaPhoneEnabled} setEnabled={setCtaPhoneEnabled} labelVal={ctaPhoneLabel} setLabelVal={setCtaPhoneLabel} urlVal={ctaPhoneUrl} setUrlVal={setCtaPhoneUrl} urlPlaceholder="tel:+82-2-1234-5678" />
apps/web/src\components\forms\ClinicProfileForm.tsx:412:              <CtaRow type="kakao-talk" label="카카오톡 상담" enabled={ctaKakaoEnabled} setEnabled={setCtaKakaoEnabled} labelVal={ctaKakaoLabel} setLabelVal={setCtaKakaoLabel} urlVal={ctaKakaoUrl} setUrlVal={setCtaKakaoUrl} urlPlaceholder="https://pf.kakao.com/_..." />
apps/web/src\components\forms\ClinicProfileForm.tsx:413:              <CtaRow type="naver-reservation" label="네이버 예약" enabled={ctaNaverEnabled} setEnabled={setCtaNaverEnabled} labelVal={ctaNaverLabel} setLabelVal={setCtaNaverLabel} urlVal={ctaNaverUrl} setUrlVal={setCtaNaverUrl} urlPlaceholder="https://booking.naver.com/booking/..." />
apps/web/src\components\forms\ClinicProfileForm.tsx:414:            </div>
apps/web/src\components\forms\ClinicProfileForm.tsx:415:          </div>
apps/web/src\components\forms\ClinicProfileForm.tsx:419:              <span>강조 채널 <span className="ml-1 text-rose-600">*</span></span>
apps/web/src\components\forms\ClinicProfileForm.tsx:427:                <option value="">— 선택 —</option>
apps/web/src\components\forms\ClinicProfileForm.tsx:429:                  <option key={o.value} value={o.value}>{o.label}</option>
apps/web/src\components\forms\ClinicProfileForm.tsx:431:              </select>
apps/web/src\components\forms\ClinicProfileForm.tsx:432:              {fieldErrors.featuredChannelId && <span className="text-xs text-rose-700">{fieldErrors.featuredChannelId.join(", ")}</span>}
apps/web/src\components\forms\ClinicProfileForm.tsx:433:            </label>
apps/web/src\components\forms\ClinicProfileForm.tsx:435:        </fieldset>
apps/web/src\components\forms\ClinicProfileForm.tsx:437:        {/* (c) 정책 변수 */}
apps/web/src\components\forms\ClinicProfileForm.tsx:439:          <legend className="px-1 text-sm font-medium text-slate-900">정책 변수 (개인정보 보호책임자 등)</legend>
apps/web/src\components\forms\ClinicProfileForm.tsx:440:          <p className="text-xs text-slate-600">5종 정책 문서(개인정보처리방침·이용약관·비급여·환불·민원)의 변수에 사용됩니다.</p>
apps/web/src\components\forms\ClinicProfileForm.tsx:441:          <Field name="policyContactPerson" label="개인정보 보호책임자" required value={values.policyContactPerson} onChange={(v) => setField("policyContactPerson", v)} errors={fieldErrors.policyContactPerson} maxLength={100} />
apps/web/src\components\forms\ClinicProfileForm.tsx:442:          <Field name="policyContactEmail" label="보호책임자 이메일" required type="email" value={values.policyContactEmail} onChange={(v) => setField("policyContactEmail", v)} errors={fieldErrors.policyContactEmail} maxLength={200} />
apps/web/src\components\forms\ClinicProfileForm.tsx:443:          <Field name="policyContactPhone" label="보호책임자 전화" required value={values.policyContactPhone} onChange={(v) => setField("policyContactPhone", v)} errors={fieldErrors.policyContactPhone} placeholder="02-1234-5678" />
apps/web/src\components\forms\ClinicProfileForm.tsx:444:          <Field name="policyEffectiveDate" label="기본 시행일 (5종 정책 공통 default)" required type="date" value={values.policyEffectiveDate} onChange={(v) => setField("policyEffectiveDate", v)} errors={fieldErrors.policyEffectiveDate} />
apps/web/src\components\forms\ClinicProfileForm.tsx:445:        </fieldset>
apps/web/src\components\forms\ClinicProfileForm.tsx:447:        {/* (d) 5 LegalDocument effective date override */}
apps/web/src\components\forms\ClinicProfileForm.tsx:449:          <legend className="px-1 text-sm font-medium text-slate-900">정책 문서 시행일 (선택 · 미입력 시 기본 시행일 사용)</legend>
apps/web/src\components\forms\ClinicProfileForm.tsx:452:          </p>
apps/web/src\components\forms\ClinicProfileForm.tsx:457:              // LLC-08 patch: summary 의 aria-controls 로 본문 group 을 가리키고, 입력 group 에는 aria-labelledby 로 summary 연결
apps/web/src\components\forms\ClinicProfileForm.tsx:461:                    {DOC_TYPE_LABEL[t]} <span className="text-xs text-slate-500">(현재: {values.legalDocEffectiveOverrides[t] || values.policyEffectiveDate || "—"})</span>
apps/web/src\components\forms\ClinicProfileForm.tsx:462:                  </summary>
apps/web/src\components\forms\ClinicProfileForm.tsx:471:                    />
apps/web/src\components\forms\ClinicProfileForm.tsx:472:                  </div>
apps/web/src\components\forms\ClinicProfileForm.tsx:473:                </details>
apps/web/src\components\forms\ClinicProfileForm.tsx:476:          </div>
apps/web/src\components\forms\ClinicProfileForm.tsx:477:        </fieldset>
apps/web/src\components\forms\ClinicProfileForm.tsx:479:        <SubmitButton />
apps/web/src\components\forms\ClinicProfileForm.tsx:480:      </form>
apps/web/src\components\forms\ClinicProfileForm.tsx:481:    </div>
apps/web/src\components\forms\ClinicProfileForm.tsx:509:        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
apps/web/src\components\forms\ClinicProfileForm.tsx:511:      </label>
apps/web/src\components\forms\ClinicProfileForm.tsx:521:          />
apps/web/src\components\forms\ClinicProfileForm.tsx:529:          />
apps/web/src\components\forms\ClinicProfileForm.tsx:530:        </div>
apps/web/src\components\forms\ClinicProfileForm.tsx:532:    </div>
apps/web/src\components\forms\ClinicProfileForm.tsx:545:    </button>
apps/web/src\lib\session-cookie.ts:1:// @glitzy/web/lib/session-cookie — read/set/clear helper (Plan v1.0 § 5.1)
apps/web/src\lib\session-cookie.ts:2:// Asymmetric refresh: cookie fixed window + DB session sliding window (ADMIN-UI-50·83)
apps/web/src\lib\session-cookie.ts:3:// sliding cookie refresh 는 packages/auth v0.3 sessionRefreshed 반환 후 cascade
apps/web/src\lib\session-cookie.ts:5:import { cookies } from "next/headers";
apps/web/src\lib\session-cookie.ts:6:import { getAuthCfg } from "./env";
apps/web/src\lib\session-cookie.ts:16:/** Route Handler / Server Action 응답에서만 호출 가능 (Server Component render 중 unsafe) */
apps/web/src\lib\session-cookie.ts:23:    path: "/",
apps/web/src\components\forms\DeleteForm.tsx:1:// @glitzy/web/components/forms/DeleteForm — form action 기반 delete (redirect/notFound throw 자연 전파)
apps/web/src\components\forms\DeleteForm.tsx:2:// cycle4-3entity WEB-45: useTransition catch 가 NEXT_REDIRECT 를 일반 error 로 swallow → form action 사용
apps/web/src\components\forms\DeleteForm.tsx:18:  // FormData payload 무시 · 결과만 inline 에러 표시
apps/web/src\components\forms\DeleteForm.tsx:35:        </div>
apps/web/src\components\forms\DeleteForm.tsx:37:      <SubmitButton label={label ?? "삭제"} />
apps/web/src\components\forms\DeleteForm.tsx:38:    </form>
apps/web/src\components\forms\DeleteForm.tsx:51:    </button>
apps/web/src\app\sign-in\actions.ts:1:// @glitzy/web/sign-in/actions — Server Action (Plan v1.0 § 3.2 step 1)
apps/web/src\app\sign-in\actions.ts:2:// cycle5 ADMIN-UI-75: allowlist 체크 (self-provision 방지) + magic-link 발급
apps/web/src\app\sign-in\actions.ts:3:// cycle2-code WEB-36: redirect-only action — useFormState 미사용 (clinic-profile 의 result-return action 과 패턴 분리).
apps/web/src\app\sign-in\actions.ts:4://                     Plan 본문 `(prev, formData)` 표기는 result-return 케이스 SoT 이며, 본 action 은 redirect throw 로 흐름 차단
apps/web/src\app\sign-in\actions.ts:8:import { redirect } from "next/navigation";
apps/web/src\app\sign-in\actions.ts:10:import { AuthDeniedError, emitAuditEvent, issueMagicLink, normalizeIdentifier } from "@glitzy/auth";
apps/web/src\app\sign-in\actions.ts:12:import { getSqlBase } from "@/lib/db";
apps/web/src\app\sign-in\actions.ts:13:import { getAuthCfg } from "@/lib/env";
apps/web/src\app\sign-in\actions.ts:22:    redirect("/sign-in?reason=magic-link-invalid");
apps/web/src\app\sign-in\actions.ts:33:      redirect(`/sign-in?reason=${err.reason}`);
apps/web/src\app\sign-in\actions.ts:38:  // Plan § 3.2 step 1 ADMIN-UI-75: allowlist 체크 (자동 INSERT 없음)
apps/web/src\app\sign-in\actions.ts:45:    // enumeration 방지 — UI 응답은 generic, audit 만 명시 기록 (cycle3-code WEB-46: best-effort)
apps/web/src\app\sign-in\actions.ts:54:    redirect("/sign-in?sent=1");
apps/web/src\app\sign-in\actions.ts:67:  redirect("/sign-in?sent=1");
apps/web/src\app\sign-out\route.ts:1:// @glitzy/web/sign-out — POST Route Handler (Plan v1.0 § 3.2 step 5 ADMIN-UI-51)
apps/web/src\app\sign-out\route.ts:2:// getActiveSession → userId 추출 → revokeSession → audit (tampered cookie 분기)
apps/web/src\app\sign-out\route.ts:3:// cycle2-code WEB-24·25: payload.reason shape + revoke 실패와 audit 실패 분리
apps/web/src\app\sign-out\route.ts:5:import { NextResponse, type NextRequest } from "next/server";
apps/web/src\app\sign-out\route.ts:11:} from "@glitzy/auth";
apps/web/src\app\sign-out\route.ts:13:import { getSqlBase } from "@/lib/db";
apps/web/src\app\sign-out\route.ts:14:import { getAuthCfg } from "@/lib/env";
apps/web/src\app\sign-out\route.ts:17:  // cycle3-3entity WEB-41: Origin 누락도 차단 (mutating POST · CSRF 보수적 처리)
apps/web/src\app\sign-out\route.ts:28:    // cycle3-code WEB-37: getActiveSession 과 revokeSession catch 분리 — revoke 실패는 deny 와 구분
apps/web/src\app\sign-out\route.ts:46:      // cycle5-code WEB-66: session-revoked 단일 event + payload.outcome 으로 Plan matrix 정합 유지
apps/web/src\app\sign-out\route.ts:56:      // cycle4-code WEB-54: revoke 실패 시 cookie clear 안 함 + 503 — DB session row 가 살아있는데 cookie 만 지우면 탈취 가능
apps/web/src\app\sign-out\route.ts:64:      // tampered / expired cookie sign-out — payload.reason shape (WEB-24)
apps/web/src\app\sign-out\route.ts:76:  // cycle5-code WEB-65: POST 후 GET 으로 화면 전환 — 303 See Other (NextResponse.redirect 기본 307 → 405 위험 회피)
apps/web/src\app\sign-out\route.ts:77:  const res = NextResponse.redirect(new URL("/sign-in", req.url), { status: 303 });
apps/web/src\components\forms\DoctorProfileForm.tsx:1:// @glitzy/web/components/forms/DoctorProfileForm
apps/web/src\components\forms\DoctorProfileForm.tsx:6:import { Field } from "./Field";
apps/web/src\components\forms\DoctorProfileForm.tsx:7:import type { SaveResult } from "@/lib/save-result";
apps/web/src\components\forms\DoctorProfileForm.tsx:54:        </div>
apps/web/src\components\forms\DoctorProfileForm.tsx:59:        </div>
apps/web/src\components\forms\DoctorProfileForm.tsx:62:      <Field name="slug" label="slug" required value={values.slug} onChange={(v) => set("slug", v)} errors={fieldErrors.slug} maxLength={64} hint="3~64자 · 소문자/숫자/하이픈" />
apps/web/src\components\forms\DoctorProfileForm.tsx:63:      <Field name="name" label="이름" required value={values.name} onChange={(v) => set("name", v)} errors={fieldErrors.name} maxLength={100} />
apps/web/src\components\forms\DoctorProfileForm.tsx:64:      <Field name="title" label="직함" value={values.title} onChange={(v) => set("title", v)} errors={fieldErrors.title} maxLength={100} placeholder="예: 대표원장" />
apps/web/src\components\forms\DoctorProfileForm.tsx:65:      <Field name="jobTitle" label="직책" value={values.jobTitle} onChange={(v) => set("jobTitle", v)} errors={fieldErrors.jobTitle} maxLength={100} />
apps/web/src\components\forms\DoctorProfileForm.tsx:66:      <Field name="honorific" label="호칭" value={values.honorific} onChange={(v) => set("honorific", v)} errors={fieldErrors.honorific} maxLength={20} placeholder="예: 박사" />
apps/web/src\components\forms\DoctorProfileForm.tsx:67:      <Field name="bio" label="약력" textarea rows={6} value={values.bio} onChange={(v) => set("bio", v)} errors={fieldErrors.bio} maxLength={2000} />
apps/web/src\components\forms\DoctorProfileForm.tsx:68:      <Field name="photoUrl" label="사진 URL" type="url" value={values.photoUrl} onChange={(v) => set("photoUrl", v)} errors={fieldErrors.photoUrl} maxLength={2048} />
apps/web/src\components\forms\DoctorProfileForm.tsx:69:      <Field name="displayOrder" label="표시 순서" value={values.displayOrder} onChange={(v) => set("displayOrder", v)} errors={fieldErrors.displayOrder} hint="작을수록 앞 (정수)" />
apps/web/src\components\forms\DoctorProfileForm.tsx:78:        />
apps/web/src\components\forms\DoctorProfileForm.tsx:79:        <span>활성</span>
apps/web/src\components\forms\DoctorProfileForm.tsx:80:      </label>
apps/web/src\components\forms\DoctorProfileForm.tsx:82:      <SubmitButton isNew={isNew} />
apps/web/src\components\forms\DoctorProfileForm.tsx:83:    </form>
apps/web/src\components\forms\DoctorProfileForm.tsx:96:    </button>
apps/web/src\lib\site-meta-fetch.ts:1:// @glitzy/web/lib/site-meta-fetch — 외부 사이트 URL → meta scrape
apps/web/src\lib\site-meta-fetch.ts:2:// cycle7-8-code (URL scrape patch) v0.3:
apps/web/src\lib\site-meta-fetch.ts:3://   - undici Agent connect.lookup override 로 매 connection lookup 결과 검증 → DNS rebinding TOCTOU 제거 (WEB-108)
apps/web/src\lib\site-meta-fetch.ts:4://   - redirect manual + 매 hop normalizeAndValidateUrl + 5회 strict (off-by-one 제거 · WEB-112)
apps/web/src\lib\site-meta-fetch.ts:5://   - URL userinfo 거부 (WEB-113)
apps/web/src\lib\site-meta-fetch.ts:6://   - 스크랩된 asset URL 도 validateAssetUrl
apps/web/src\lib\site-meta-fetch.ts:7://   - text/html only · 5MB body · 10s timeout
apps/web/src\lib\site-meta-fetch.ts:9:import { lookup as dnsLookup } from "node:dns/promises";
apps/web/src\lib\site-meta-fetch.ts:95:// cycle8 WEB-108: undici Agent connect.lookup override — 매 connection lookup 결과 검증 (TOCTOU 제거)
apps/web/src\lib\site-meta-fetch.ts:96:// Node 의 dns.lookup callback 시그니처 가변(2 또는 3 args) 처리를 위해 unsafe cast 사용 — 안전성은 isBlockedIp 로 보장
apps/web/src\lib\site-meta-fetch.ts:100:  // eslint-disable-next-line @typescript-eslint/no-explicit-any
apps/web/src\lib\site-meta-fetch.ts:117:    // eslint-disable-next-line @typescript-eslint/no-explicit-any
apps/web/src\lib\site-meta-fetch.ts:128:  if (!/^https?:\/\//i.test(withScheme)) {
apps/web/src\lib\site-meta-fetch.ts:129:    withScheme = `https://${withScheme}`;
apps/web/src\lib\site-meta-fetch.ts:138:    throw new SiteMetaFetchError("invalid-url", "http/https URL 만 허용됩니다.");
apps/web/src\lib\site-meta-fetch.ts:140:  // cycle8 WEB-113: URL userinfo 거부 (credentials leak 방지)
apps/web/src\lib\site-meta-fetch.ts:149:  try { await body.cancel(); } catch { /* noop */ }
apps/web/src\lib\site-meta-fetch.ts:157:    // cycle9 WEB-116: timeout 을 header + body read 통합 deadline 으로 적용
apps/web/src\lib\site-meta-fetch.ts:166:          "user-agent": "GlitzyAdmin/0.1 site-meta-fetch",
apps/web/src\lib\site-meta-fetch.ts:167:          accept: "text/html",
apps/web/src\lib\site-meta-fetch.ts:169:        // cycle8 WEB-108: undici Agent — 매 connection lookup 검증 (TOCTOU 제거)
apps/web/src\lib\site-meta-fetch.ts:170:        // @ts-expect-error — Next.js fetch types 에 dispatcher 미정의 (undici 내부 지원)
apps/web/src\lib\site-meta-fetch.ts:178:      if (err instanceof Error && /blocked-host:/.test(err.message)) {
apps/web/src\lib\site-meta-fetch.ts:186:        // cycle8 WEB-112: MAX_REDIRECTS strict — 5회 초과 시 즉시 차단
apps/web/src\lib\site-meta-fetch.ts:211:      // cycle9 WEB-117: 실패 분기에도 body cancel cleanup
apps/web/src\lib\site-meta-fetch.ts:217:      if (!ct.includes("text/html")) {
apps/web/src\lib\site-meta-fetch.ts:227:      // cycle9 WEB-116: body read 도 같은 controller deadline 안에서 실행
apps/web/src\lib\site-meta-fetch.ts:228:      //   AbortController 가 abort 되면 reader.read() 가 reject 되어 try-catch 가 잡음
apps/web/src\lib\site-meta-fetch.ts:319:/** audit payload sanitize — userinfo/query/fragment 제거 (WEB-113·115)
apps/web/src\lib\site-meta-fetch.ts:320: *  cycle9 WEB-115: scheme 없는 입력도 best-effort normalize + parse 실패 fallback 도 credentials/query 제거
apps/web/src\lib\site-meta-fetch.ts:321: */
apps/web/src\lib\site-meta-fetch.ts:324:  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
apps/web/src\lib\site-meta-fetch.ts:333:    // fallback: '@' 앞 userinfo · '?' / '#' 뒤 query/fragment 제거
apps/web/src\lib\site-meta-fetch.ts:334:    const noUserInfo = trimmed.replace(/^[^/]*@/, "");
apps/web/src\lib\slug-resolver.ts:1:// @glitzy/web/lib/slug-resolver — slug → instanceId lookup (Plan v1.0 § 5.2)
apps/web/src\lib\slug-resolver.ts:2:// cycle4·8 결정: sqlBase 직접 SELECT + audit_event emit (withServiceRole 미사용)
apps/web/src\lib\slug-resolver.ts:3:// cycle3-code WEB-44·51: audit best-effort + slug regex 사전 검증
apps/web/src\lib\slug-resolver.ts:6:import { emitAuditEvent } from "@glitzy/auth";
apps/web/src\lib\slug-resolver.ts:7:import { asUuidV4, type AdminUserId, type InstanceId } from "@glitzy/shared-types";
apps/web/src\lib\slug-resolver.ts:9:// D0010_instance.sql instance_slug_regex 정합 — 3~64자
apps/web/src\lib\slug-resolver.ts:10:const INSTANCE_SLUG_REGEX = /^[a-z0-9][a-z0-9-]{2,63}$/;
apps/web/src\lib\slug-resolver.ts:25:  // cycle3-code WEB-51: slug 길이/형식 사전 검증 — bloat / 불필요 lookup 방지
apps/web/src\lib\tenant.ts:1:// @glitzy/web/lib/tenant — withSkeletonTx 2단계 패턴 (Plan v1.0 § 5.3 ADMIN-UI-04·30)
apps/web/src\lib\tenant.ts:2:// packages/auth.withResolvedTenantTransaction 의 RLS role 누락 우회
apps/web/src\lib\tenant.ts:4:import { resolveTenantContext, type TenantContext } from "@glitzy/auth";
apps/web/src\lib\tenant.ts:5:import { withTenantTransaction, type ScopedTx } from "@glitzy/db";
apps/web/src\lib\tenant.ts:6:import { asUuidV4, type InstanceId } from "@glitzy/shared-types";
apps/web/src\lib\tenant.ts:8:import { getSqlBase } from "./db";
apps/web/src\lib\tenant.ts:9:import { getAuthCfg } from "./env";
apps/web/src\lib\tenant.ts:11:/**
apps/web/src\lib\tenant.ts:15: */
apps/web/src\lib\tenant.ts:23:  // ctx.instanceId 는 plain string · branded InstanceId 변환 (ADMIN-UI-30)
apps/web/src\components\forms\Field.tsx:1:// @glitzy/web/components/forms/Field — 공통 input/textarea/select field
apps/web/src\components\forms\Field.tsx:30:        {p.required && <span className="ml-1 text-rose-600">*</span>}
apps/web/src\components\forms\Field.tsx:31:      </span>
apps/web/src\components\forms\Field.tsx:43:        />
apps/web/src\components\forms\Field.tsx:55:        />
apps/web/src\components\forms\Field.tsx:57:      {p.hint && <span className="text-xs text-slate-500">{p.hint}</span>}
apps/web/src\components\forms\Field.tsx:59:        <span className="text-xs text-rose-700">{p.errors.join(", ")}</span>
apps/web/src\components\forms\Field.tsx:61:    </label>
apps/web/src\components\forms\Field.tsx:88:        {required && <span className="ml-1 text-rose-600">*</span>}
apps/web/src\components\forms\Field.tsx:89:      </span>
apps/web/src\components\forms\Field.tsx:97:        {!required && <option value="">— 선택 —</option>}
apps/web/src\components\forms\Field.tsx:99:          <option key={o.value} value={o.value}>{o.label}</option>
apps/web/src\components\forms\Field.tsx:101:      </select>
apps/web/src\components\forms\Field.tsx:102:      {hint && <span className="text-xs text-slate-500">{hint}</span>}
apps/web/src\components\forms\Field.tsx:104:        <span className="text-xs text-rose-700">{errors.join(", ")}</span>
apps/web/src\components\forms\Field.tsx:106:    </label>
apps/web/src\app\api\health\route.ts:1:// @glitzy/web/api/health — DB ping + systemActorPresent (Plan v1.0 § 9 게이트 #8 ADMIN-UI-71)
apps/web/src\app\api\health\route.ts:3:import { NextResponse } from "next/server";
apps/web/src\app\api\health\route.ts:4:import { getSqlBase } from "@/lib/db";
apps/web/src\app\api\health\route.ts:16:    // cycle1-code WEB-15: systemActorPresent=false 면 seed precondition 실패 → 503
apps/web/src\app\api\health\route.ts:18:      // cycle3-code WEB-50: 한국어 메시지 + 루트 script 기준 사용법
apps/web/src\app\api\health\route.ts:23:          error: "시스템 액터 미존재 — 먼저 `pnpm web:seed --email=… --display-name=… --instance-slug=… --instance-name=…` 실행",
apps/web/src\app\api\health\route.ts:30:    // cycle2-code WEB-33: 외부 응답에 DB connection string / role / SQL 상세 누설 방지
apps/web/src\app\api\health\route.ts:31:    console.error("[/api/health] DB error", err);
apps/web/src\app\api\health\route.ts:32:    // cycle3-3entity WEB-44: 한국어 generic 메시지
apps/web/src\app\api\site-meta-fetch\route.ts:1:// @glitzy/web/api/site-meta-fetch — 외부 사이트 URL meta scrape
apps/web/src\app\api\site-meta-fetch\route.ts:2:// cycle7-8-code (URL scrape patch) v0.3:
apps/web/src\app\api\site-meta-fetch\route.ts:3://   - WEB-109: instanceSlug 받아서 slugResolver + resolveTenantContext + assertActionEligibility('operator-edit-content')
apps/web/src\app\api\site-meta-fetch\route.ts:4://   - WEB-110: code 클라이언트 노출 제거 (audit reason 만)
apps/web/src\app\api\site-meta-fetch\route.ts:5://   - WEB-111: body reader 직접 4KB 제한 (chunked 우회 차단)
apps/web/src\app\api\site-meta-fetch\route.ts:6://   - WEB-113: audit payload sanitizeUrlForAudit (userinfo/query 제거)
apps/web/src\app\api\site-meta-fetch\route.ts:8:import { NextResponse, type NextRequest } from "next/server";
apps/web/src\app\api\site-meta-fetch\route.ts:17:} from "@glitzy/auth";
apps/web/src\app\api\site-meta-fetch\route.ts:18:import { asUuidV4, type AdminUserId } from "@glitzy/shared-types";
apps/web/src\app\api\site-meta-fetch\route.ts:20:import { getSqlBase } from "@/lib/db";
apps/web/src\app\api\site-meta-fetch\route.ts:21:import { getAuthCfg } from "@/lib/env";
apps/web/src\app\api\site-meta-fetch\route.ts:22:import { fetchSiteMeta, sanitizeUrlForAudit, SiteMetaFetchError } from "@/lib/site-meta-fetch";
apps/web/src\app\api\site-meta-fetch\route.ts:23:import { slugResolver } from "@/lib/slug-resolver";
apps/web/src\app\api\site-meta-fetch\route.ts:40:// cycle8 WEB-111: body reader 로 4KB strict (chunked content-length 우회 차단)
apps/web/src\app\api\site-meta-fetch\route.ts:60:  // cycle3-3entity WEB-40: Origin 누락도 차단 (브라우저 전용 endpoint)
apps/web/src\app\api\site-meta-fetch\route.ts:76:    // cycle3-3entity WEB-34: branded UUID narrow
apps/web/src\app\api\site-meta-fetch\route.ts:85:    // cycle3-3entity WEB-42: invalid/tampered session — cookie clear 도 함께 (page 경로의 cleanup 과 동등 처리)
apps/web/src\app\api\site-meta-fetch\route.ts:91:  // cycle8 WEB-111: body reader 직접 제한 (chunked content-length 무시 우회 차단)
apps/web/src\app\api\site-meta-fetch\route.ts:107:  // cycle8 WEB-109: slugResolver + resolveTenantContext + assertActionEligibility 재검증
apps/web/src\app\api\site-meta-fetch\route.ts:147:        // cycle8 WEB-113: audit payload sanitize
apps/web/src\app\api\site-meta-fetch\route.ts:162:      // cycle8 WEB-110: code 응답 제거 — generic 메시지만
apps/web/src\components\forms\TreatmentPageForm.tsx:1:// @glitzy/web/components/forms/TreatmentPageForm
apps/web/src\components\forms\TreatmentPageForm.tsx:6:import { Field, SelectField } from "./Field";
apps/web/src\components\forms\TreatmentPageForm.tsx:7:import type { SaveResult } from "@/lib/save-result";
apps/web/src\components\forms\TreatmentPageForm.tsx:67:        </div>
apps/web/src\components\forms\TreatmentPageForm.tsx:70:        <div className="rounded-md border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-900">{formError}</div>
apps/web/src\components\forms\TreatmentPageForm.tsx:73:      <Field name="slug" label="slug" required value={v.slug} onChange={(x) => set("slug", x)} errors={fieldErrors.slug} maxLength={100} hint="3~100자" />
apps/web/src\components\forms\TreatmentPageForm.tsx:74:      <Field name="title" label="제목" required value={v.title} onChange={(x) => set("title", x)} errors={fieldErrors.title} maxLength={200} />
apps/web/src\components\forms\TreatmentPageForm.tsx:75:      <Field name="summary" label="요약" required textarea rows={3} value={v.summary} onChange={(x) => set("summary", x)} errors={fieldErrors.summary} minLength={50} maxLength={160} hint="50~160자 (검색 결과 노출용)" />
apps/web/src\components\forms\TreatmentPageForm.tsx:76:      <Field name="bodyMarkdown" label="본문 (Markdown)" required textarea rows={14} value={v.bodyMarkdown} onChange={(x) => set("bodyMarkdown", x)} errors={fieldErrors.bodyMarkdown} maxLength={50000} hint="Markdown 형식" />
apps/web/src\components\forms\TreatmentPageForm.tsx:77:      <Field name="heroImageUrl" label="hero 이미지 URL" type="url" value={v.heroImageUrl} onChange={(x) => set("heroImageUrl", x)} errors={fieldErrors.heroImageUrl} maxLength={2048} />
apps/web/src\components\forms\TreatmentPageForm.tsx:78:      <SelectField name="status" label="발행 상태" required value={v.status} onChange={(x) => set("status", x)} options={STATUS_OPTIONS} errors={fieldErrors.status} />
apps/web/src\components\forms\TreatmentPageForm.tsx:79:      <SelectField name="riskLevel" label="위험도 (의료광고법)" value={v.riskLevel} onChange={(x) => set("riskLevel", x)} options={RISK_OPTIONS} errors={fieldErrors.riskLevel} hint="설정 시 ComplianceRecord 분류 기반" />
apps/web/src\components\forms\TreatmentPageForm.tsx:81:      <SubmitButton isNew={isNew} />
apps/web/src\components\forms\TreatmentPageForm.tsx:82:    </form>
apps/web/src\components\forms\TreatmentPageForm.tsx:95:    </button>
apps/web/src\app\sign-in\page.tsx:1:// @glitzy/web/sign-in — 이메일 입력 폼 (Plan v1.0 § 3.2 step 1)
apps/web/src\app\sign-in\page.tsx:3:import { signInReasonMessage, isSignInReason } from "@/lib/deny-reason-map";
apps/web/src\app\sign-in\page.tsx:4:import { MockMailbox } from "@/components/dev/MockMailbox";
apps/web/src\app\sign-in\page.tsx:5:import { issueMagicLinkAction } from "./actions";
apps/web/src\app\sign-in\page.tsx:12:  // cycle3-code WEB-38: type guard 로 narrow — 임의 값 → null (generic 메시지)
apps/web/src\app\sign-in\page.tsx:15:  // cycle4-code WEB-58: sent=1 generic banner (enumeration 방지 — allowlisted/미존재 동일 응답)
apps/web/src\app\sign-in\page.tsx:20:      <h1 className="text-2xl font-semibold">Glitzy 어드민 로그인</h1>
apps/web/src\app\sign-in\page.tsx:23:      </p>
apps/web/src\app\sign-in\page.tsx:28:        </div>
apps/web/src\app\sign-in\page.tsx:33:        </div>
apps/web/src\app\sign-in\page.tsx:38:          <span>이메일</span>
apps/web/src\app\sign-in\page.tsx:45:          />
apps/web/src\app\sign-in\page.tsx:46:        </label>
apps/web/src\app\sign-in\page.tsx:52:        </button>
apps/web/src\app\sign-in\page.tsx:53:      </form>
apps/web/src\app\sign-in\page.tsx:55:      {/* Plan § 7 ADMIN-UI-19: server-side 3중 가드 — components/dev/MockMailbox.tsx (cycle1-code WEB-16) */}
apps/web/src\app\sign-in\page.tsx:56:      <MockMailbox />
apps/web/src\app\sign-in\page.tsx:57:    </main>
apps/web/src\app\sign-in\cleanup\route.ts:1:// @glitzy/web/sign-in/cleanup — invalid session cookie cleanup (cycle1-code WEB-06·07·11)
apps/web/src\app\sign-in\cleanup\route.ts:2:// layout/page 는 Server Component 라 cookies().delete() 가 안전하지 않으므로
apps/web/src\app\sign-in\cleanup\route.ts:3:// AuthDeniedError(session-*) 발생 시 이 route 로 redirect → cookie clear + audit emit + sign-in redirect
apps/web/src\app\sign-in\cleanup\route.ts:5:import { NextResponse, type NextRequest } from "next/server";
apps/web/src\app\sign-in\cleanup\route.ts:7:import { emitAuditEvent, type AuthDenyReason } from "@glitzy/auth";
apps/web/src\app\sign-in\cleanup\route.ts:9:import { getSqlBase } from "@/lib/db";
apps/web/src\app\sign-in\cleanup\route.ts:11:// cycle3-code WEB-47 → cycle2-3entity WEB-21: cleanup 은 session-* 외에도 user-inactive 처리 (cookie clear 필요)
apps/web/src\app\sign-in\cleanup\route.ts:25:  // cycle5-code WEB-67: cookie 존재 시에만 audit emit — direct GET 만으로 forensic log 오염 방지
apps/web/src\app\sign-in\cleanup\route.ts:29:      // cycle2-3entity WEB-30: resolveTenantContext 가 이미 tenant-resolve-denied emit 했을 수 있으므로 별도 eventType 으로 분리 (중복 forensic row 방지)
apps/web/src\app\sign-in\cleanup\route.ts:33:        payload: { origin: "sign-in/cleanup" },
apps/web/src\app\sign-in\cleanup\route.ts:36:      console.error("[sign-in/cleanup] audit emit failed", err);
apps/web/src\app\sign-in\cleanup\route.ts:40:  const res = NextResponse.redirect(new URL(`/sign-in?reason=${reason}`, req.url));
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:1:// @glitzy/web/(admin)/[instanceSlug] — 대시보드 (Plan v1.0 § 3.2 step 3)
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:2:// slug resolve → tenant resolve → ClinicProfile 존재 표시
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:4:import Link from "next/link";
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:5:import { notFound, redirect } from "next/navigation";
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:6:import { TenantResolveError } from "@glitzy/auth";
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:8:import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:9:import { requirePageContext } from "@/lib/page-context";
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:10:import { withSkeletonTx } from "@/lib/tenant";
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:17:  // cycle3-3entity WEB-35: requirePageContext 통일 + branded UUID narrow + eligibility 통과
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:25:        return <main className="p-6"><p>{a.message}</p></main>;
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:31:  // tenant resolve + 각 entity 카운트 조회
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:50:        <h1 className="text-2xl font-semibold">대시보드</h1>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:52:          <h2 className="mb-2 text-base font-medium">세션 컨텍스트</h2>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:54:            <dt className="text-slate-500">이메일</dt>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:55:            <dd>{data.ctx.email}</dd>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:56:            <dt className="text-slate-500">역할</dt>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:57:            <dd>{data.ctx.role}</dd>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:58:            <dt className="text-slate-500">인스턴스 ID</dt>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:59:            <dd className="break-all font-mono text-xs">{data.ctx.instanceId}</dd>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:60:            <dt className="text-slate-500">슬러그</dt>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:61:            <dd>{params.instanceSlug}</dd>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:62:            <dt className="text-slate-500">super-admin</dt>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:63:            <dd>{data.ctx.isSuperAdmin ? "true" : "false"}</dd>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:64:          </dl>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:65:        </section>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:68:          <h2 className="mb-2 text-base font-medium">ClinicProfile</h2>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:72:                <strong>{data.clinic.name}</strong> · 마지막 수정 {new Date(data.clinic.updated_at).toISOString()}
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:73:              </span>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:75:                href={`/${params.instanceSlug}/clinic-profile`}
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:79:              </Link>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:80:            </div>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:83:              <span className="text-slate-500">아직 작성되지 않음.</span>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:85:                href={`/${params.instanceSlug}/clinic-profile`}
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:89:              </Link>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:90:            </div>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:92:        </section>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:96:            href={`/${params.instanceSlug}/doctors`}
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:100:          />
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:102:            href={`/${params.instanceSlug}/treatments`}
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:103:            title="시술/진료 페이지"
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:106:          />
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:108:            href={`/${params.instanceSlug}/articles`}
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:112:          />
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:113:        </section>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:114:      </main>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:119:      // cycle2-code WEB-27: session 계열 deny 는 cleanup route 경유 (cookie clear + audit)
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:120:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:123:        return <ForbiddenView message={action.message} />;
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:126:        return <InfoView message={action.message} />;
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:139:      <span className="text-base font-medium">{title}</span>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:140:      <span className="text-3xl font-semibold text-slate-900">{count}</span>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:141:      <span className="text-xs text-slate-500">{description}</span>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:142:    </Link>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:149:      <h1 className="text-2xl font-semibold">접근 거부</h1>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:150:      <p className="text-sm text-slate-700">{message}</p>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:151:    </main>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:158:      <h1 className="text-2xl font-semibold">안내</h1>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:159:      <p className="text-sm text-slate-700">{message}</p>
apps/web/src\app\(admin)\[instanceSlug]\page.tsx:160:    </main>
apps/web/src\app\sign-in\consume\route.ts:1:// @glitzy/web/sign-in/consume — GET Route Handler (Plan v1.0 § 3.2 step 2)
apps/web/src\app\sign-in\consume\route.ts:2:// magic-link 소비 + admin_user lookup (자동 INSERT 없음 · ADMIN-UI-75)
apps/web/src\app\sign-in\consume\route.ts:3:// + first active operator membership 검증 (session 발급 전 · ADMIN-UI-76)
apps/web/src\app\sign-in\consume\route.ts:4:// + createSession + cookie set + redirect
apps/web/src\app\sign-in\consume\route.ts:6:import { NextResponse, type NextRequest } from "next/server";
apps/web/src\app\sign-in\consume\route.ts:15:} from "@glitzy/auth";
apps/web/src\app\sign-in\consume\route.ts:16:import { asUuidV4, type AdminUserId } from "@glitzy/shared-types";
apps/web/src\app\sign-in\consume\route.ts:18:import { getSqlBase } from "@/lib/db";
apps/web/src\app\sign-in\consume\route.ts:19:import { getAuthCfg } from "@/lib/env";
apps/web/src\app\sign-in\consume\route.ts:20:import { resolveFirstActiveMembershipSlug } from "@/lib/post-login-redirect";
apps/web/src\app\sign-in\consume\route.ts:27:/** cycle2-code WEB-26: audit emit best-effort — session row 와 cookie 일관성 유지 */
apps/web/src\app\sign-in\consume\route.ts:32:    console.error(`[sign-in/consume] audit emit failed: ${input.eventType}`, err);
apps/web/src\app\sign-in\consume\route.ts:46:    // cycle4-code WEB-57: malformed query 도 best-effort audit (token 원문 미저장)
apps/web/src\app\sign-in\consume\route.ts:52:    return NextResponse.redirect(new URL("/sign-in?reason=magic-link-invalid", req.url));
apps/web/src\app\sign-in\consume\route.ts:55:  // cycle5-code WEB-64: identifier normalize + admin_user allowlist 검증을 CAS 소비 전에 수행
apps/web/src\app\sign-in\consume\route.ts:56:  //   — 발급 후 비활성화된 사용자가 token 만 소진하는 시나리오 차단
apps/web/src\app\sign-in\consume\route.ts:67:      return NextResponse.redirect(new URL(`/sign-in?reason=${err.reason}`, req.url));
apps/web/src\app\sign-in\consume\route.ts:72:  // 1) admin_user allowlist/active lookup (CAS 소비 전 · cycle5-code WEB-64)
apps/web/src\app\sign-in\consume\route.ts:77:    // token CAS 건드리지 않음 — generic redirect + audit
apps/web/src\app\sign-in\consume\route.ts:82:    return NextResponse.redirect(new URL("/sign-in?reason=user-inactive", req.url));
apps/web/src\app\sign-in\consume\route.ts:84:  // cycle2-3entity WEB-27: DB row id 도 UUID v4 검증 후 branded narrow
apps/web/src\app\sign-in\consume\route.ts:93:    return NextResponse.redirect(new URL("/sign-in?reason=user-inactive", req.url));
apps/web/src\app\sign-in\consume\route.ts:96:  // 2) consume magic-link (allowlist 통과 후에만 CAS 소비)
apps/web/src\app\sign-in\consume\route.ts:100:      // packages/auth.consumeMagicLink 내부 normalizer 결과 — 동일해야 정상
apps/web/src\app\sign-in\consume\route.ts:101:      console.error("[sign-in/consume] normalizer mismatch", { consumed, normalizedIdentifier });
apps/web/src\app\sign-in\consume\route.ts:110:      return NextResponse.redirect(new URL(`/sign-in?reason=${err.reason}`, req.url));
apps/web/src\app\sign-in\consume\route.ts:115:  // 3) cycle2-code WEB-22·23: pure membership lookup (audit emit 없이) · createSession 후에 audit
apps/web/src\app\sign-in\consume\route.ts:118:    // membership 없음 audit — identifier 포함 (WEB-22)
apps/web/src\app\sign-in\consume\route.ts:125:    return NextResponse.redirect(new URL("/sign-in?reason=no-active-membership", req.url));
apps/web/src\app\sign-in\consume\route.ts:128:  // 4) createSession (모든 검증 통과 후에만)
apps/web/src\app\sign-in\consume\route.ts:131:  // 5) cycle4-3entity WEB-46: race recheck 를 session-created emit 전으로 이동
apps/web/src\app\sign-in\consume\route.ts:132:  //   recheck 실패 시 revoke + audit (session-created 미emit · audit stream 정합)
apps/web/src\app\sign-in\consume\route.ts:138:      console.error("[sign-in/consume] race compensation revoke failed", revokeErr);
apps/web/src\app\sign-in\consume\route.ts:146:    return NextResponse.redirect(new URL("/sign-in?reason=no-active-membership", req.url));
apps/web/src\app\sign-in\consume\route.ts:149:  // cycle2-3entity WEB-20: session-created audit 는 mandatory — 실패 시 session revoke + sign-in error
apps/web/src\app\sign-in\consume\route.ts:156:    console.error("[sign-in/consume] session-created audit emit failed — compensating revoke", auditErr);
apps/web/src\app\sign-in\consume\route.ts:160:      console.error("[sign-in/consume] compensating revoke failed", revokeErr);
apps/web/src\app\sign-in\consume\route.ts:162:    return NextResponse.redirect(new URL("/sign-in?reason=session-not-found", req.url));
apps/web/src\app\sign-in\consume\route.ts:177:  // 6) cookie set + redirect
apps/web/src\app\sign-in\consume\route.ts:178:  const res = NextResponse.redirect(new URL(`/${membershipResult.slug}`, req.url));
apps/web/src\app\sign-in\consume\route.ts:183:    path: "/",
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:1:// @glitzy/web/(admin)/[instanceSlug]/articles/actions
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:2:// cycle1-3entity patch: WEB-01·04·06·08·10·15
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:6:import { revalidatePath } from "next/cache";
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:7:import { notFound, redirect } from "next/navigation";
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:9:import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:10:import { UUID_V4_REGEX } from "@glitzy/shared-types";
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:12:import { getSqlBase } from "@/lib/db";
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:13:import { isNextControlFlowError, resolveActionContext, assertActionEligibility } from "@/lib/action-context";
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:14:import { withSkeletonTx } from "@/lib/tenant";
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:15:import { mapDbErrorToResult } from "@/lib/errors";
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:16:import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:17:import type { SaveResult } from "@/lib/save-result";
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:29:    .refine((v) => /^[a-z0-9][a-z0-9-]{2,99}$/.test(v), {
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:30:      message: "slug 는 3~100자 (소문자/숫자/하이픈)",
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:44:  // cycle5-3entity WEB-53: enum value mismatch 한국어 메시지
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:53:      message: "위험도는 Low / Medium / High",
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:61:    .refine((v) => v === null || v === undefined || (/^https?:\/\//.test(v) && v.length <= 2048), {
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:62:      message: "hero 이미지 URL 은 http/https · 2048자",
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:104:      // cycle5-3entity WEB-49: edit path 는 article row 를 먼저 FOR UPDATE 로 잠근 뒤 currentAuthorId 추출
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:118:      // cycle2-3entity WEB-19 + cycle5 WEB-49: authorDoctorId 검증 (locked row 의 currentAuthorId 기준)
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:193:      revalidatePath(`/${instanceSlug}/articles`);
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:194:      revalidatePath(`/${instanceSlug}/articles/${txResult.slug}`);
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:196:        revalidatePath(`/${instanceSlug}/articles/${originalSlug}`);
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:198:      revalidatePath(`/${instanceSlug}`);
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:200:        redirect(`/${instanceSlug}/articles/${txResult.slug}`);
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:214:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:217:      // cycle5-3entity WEB-52: info branch 도 formError 로 처리 (doctor/treatment 와 일관)
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:256:    revalidatePath(`/${instanceSlug}/articles`);
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:257:    revalidatePath(`/${instanceSlug}/articles/${slug}`);
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:258:    revalidatePath(`/${instanceSlug}`);
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:259:    redirect(`/${instanceSlug}/articles`);
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:264:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src\app\(admin)\[instanceSlug]\articles\actions.ts:267:      // cycle5-3entity WEB-52: info branch 처리 (delete path)
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:1:// @glitzy/web/(admin)/[instanceSlug]/clinic-profile/actions — LOCATION_LEGAL_PLAN v1.0 § 4
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:2:// 3계약 동시 출력: ClinicProfile + LocationProfile(slug=main) + 5종 LegalDocument
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:3://
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:4:// 핵심 결정:
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:5://   LL-ACTION-04 (cycle1 LL-07): 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha (complaint→non-covered→privacy→refund→terms)
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:6://   LL-ACTION-06 (cycle1 LL-16 + cycle3 LL-46): 매 저장 시 5종 LegalDocument body 재렌더링 (수동 편집 차단)
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:7://   LL-ACTION-07 (cycle1 LL-21): effective_date 는 Asia/Seoul 기준 — DB CURRENT_DATE AT TIME ZONE
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:8://   LL-ACTION-08 (cycle1 LL-02 + cycle3 LL-45): LocationProfile = build-time reference. DB metadata 는 marker 만
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:9://   LL-ACTION-09 (cycle1 LL-05 + cycle2 LL-30): businessHours CT-02 SoT 변환
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:10://   LL-ACTION-18 (cycle2 LL-32 + cycle3 LL-43): 7 audit row sequential + per-row try/catch + partial/failed fallback + 3단계 안전망
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:11://   LL-ACTION-21 (cycle3 LL-44): assertHasMainLocationAfterTx + MainLocationMissingError
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:15:import { revalidatePath } from "next/cache";
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:16:import { notFound, redirect } from "next/navigation";
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:23:} from "@glitzy/auth";
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:24:import { asUuidV4, type AdminUserId } from "@glitzy/shared-types";
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:31:} from "@glitzy/core-content";
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:33:import { getSqlBase } from "@/lib/db";
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:34:import { getAuthCfg } from "@/lib/env";
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:35:import { readSessionCookie } from "@/lib/session-cookie";
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:36:import { slugResolver } from "@/lib/slug-resolver";
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:37:import { withSkeletonTx } from "@/lib/tenant";
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:42:} from "@/lib/errors";
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:43:import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:44:import { isNextControlFlowError } from "@/lib/action-context";
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:51:} from "@/lib/clinic-profile-schema";
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:76:  // 1. parse + zod 검증
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:94:  // 2. session + tenant resolve
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:96:  if (!signedToken) redirect("/sign-in");
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:106:    redirect(`/sign-in/cleanup?reason=${reason}`);
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:113:    redirect("/sign-in/cleanup?reason=session-not-found");
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:119:    // 3. tx 안 3계약 + 5 LegalDocument upsert
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:127:        // === (a) ClinicProfile UPSERT ===
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:193:        // === (b) LocationProfile(main) UPSERT ===
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:253:        // === (c) 5종 LegalDocument UPSERT (변수 치환 + alpha sort 잠금 순서) ===
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:254:        // LLC-05 patch: doc 별 effectiveDate override 를 renderCtx 안 policy.effectiveDate 에도 반영
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:255:        // → DB effective_date 와 body 안 `{{policy.effectiveDate}}` 가 일치
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:289:          // LLC-06 patch: closed 5종 partial UNIQUE 는 (instance_id, document_type) WHERE document_type IN (5종).
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:290:          // 같은 document_type 이 다른 slug 로 이미 존재할 수 있으므로 conflict target 을 document_type 으로 사용.
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:337:        // === (d) assertHasMainLocationAfterTx 안전망 (cycle3 LL-44) ===
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:354:    // 4. audit 7 row sequential emit + 3단계 안전망 (LL-ACTION-18 + cycle3 LL-43)
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:357:    // LLC-09 patch: per-row 실패 원인 보존 — fallback payload 에 reason/code/name 정규화 포함
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:399:      // LL-ACTION-18 reason payload: 첫 실패의 code 를 reason 으로 그대로 노출 (운영 포렌식)
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:416:        // 3단계 안전망 의 최종: server stdout (v0.5 — Sentry SDK 미통합 · LL-DEFER-18 까지)
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:426:    revalidatePath(`/${instanceSlug}/clinic-profile`);
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:427:    revalidatePath(`/${instanceSlug}`);
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:432:    // MainLocationMissingError (LL-ACTION-21)
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:437:    // TemplateRenderError (LL-ACTION-12 — 변수 화이트리스트 외 키)
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:446:    // DB constraint violation
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:455:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:1:// @glitzy/web/(admin)/[instanceSlug]/clinic-profile — LOCATION_LEGAL_PLAN v1.0 (M0 v0.5)
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:2:// 3계약 동시 출력 (ClinicProfile + LocationProfile(main) + LegalDocument × 5)
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:4:import { notFound, redirect } from "next/navigation";
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:5:import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:7:import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:8:import { requirePageContext } from "@/lib/page-context";
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:9:import { withSkeletonTx } from "@/lib/tenant";
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:14:} from "@/components/forms/ClinicProfileForm";
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:19:} from "@/lib/clinic-profile-schema";
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:21:import { saveClinicProfile } from "./actions";
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:117:/**
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:123: *   Next 15 `unauthorized()/forbidden()` 합류 시점 cascade (LL-DEFER-21).
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:126: */
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:130:      <h1 id="forbidden-title" className="text-2xl font-semibold">접근 거부</h1>
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:131:      <p className="text-sm text-slate-700">{message}</p>
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:132:    </main>
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:148:        return <ForbiddenAccessPage message={a.message} />;
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:244:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:247:        return <ForbiddenAccessPage message={action.message} />;
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:257:      <h1 className="text-2xl font-semibold">사이트 기본 정보</h1>
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:260:      </p>
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:261:      <ClinicProfileForm action={boundSave} initial={initial} instanceSlug={params.instanceSlug} />
apps/web/src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:262:    </main>
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:1:// @glitzy/web/(admin)/[instanceSlug]/articles — 아티클 목록
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:2:// cycle2-3entity WEB-23: requirePageContext 통일
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:3:import Link from "next/link";
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:4:import { notFound, redirect } from "next/navigation";
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:5:import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:7:import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:8:import { requirePageContext } from "@/lib/page-context";
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:9:import { withSkeletonTx } from "@/lib/tenant";
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:21:        return <main className="p-6"><p>{a.message}</p></main>;
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:27:  // cycle5-3entity WEB-51: withSkeletonTx 의 TenantResolveError catch
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:48:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:51:        return <main className="p-6"><p>{a.message}</p></main>;
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:60:        <h1 className="text-2xl font-semibold">아티클</h1>
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:61:        <Link href={`/${params.instanceSlug}/articles/new`} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:63:        </Link>
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:64:      </header>
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:69:        </div>
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:74:              <th className="px-3 py-2">제목</th>
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:75:              <th className="px-3 py-2">slug</th>
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:76:              <th className="px-3 py-2">저자</th>
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:77:              <th className="px-3 py-2">상태</th>
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:78:              <th className="px-3 py-2">위험도</th>
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:79:              <th className="px-3 py-2">발행일</th>
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:80:              <th className="px-3 py-2"></th>
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:81:            </tr>
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:82:          </thead>
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:86:                <td className="px-3 py-2 font-medium">{r.title}</td>
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:87:                <td className="px-3 py-2 font-mono text-xs text-slate-500">{r.slug}</td>
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:88:                <td className="px-3 py-2 text-xs">{r.author_name ?? "—"}</td>
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:89:                <td className="px-3 py-2"><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{r.status}</span></td>
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:90:                <td className="px-3 py-2 text-xs">{r.risk_level ?? "—"}</td>
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:91:                <td className="px-3 py-2 text-xs text-slate-500">{r.published_at ? new Date(r.published_at).toISOString().slice(0, 10) : "—"}</td>
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:93:                  <Link href={`/${params.instanceSlug}/articles/${r.slug}`} className="text-xs text-blue-700 underline">편집</Link>
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:94:                </td>
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:95:              </tr>
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:97:          </tbody>
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:98:        </table>
apps/web/src\app\(admin)\[instanceSlug]\articles\page.tsx:100:    </main>
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:1:// @glitzy/web/(admin)/[instanceSlug]/doctors/actions
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:2:// cycle1-3entity patch:
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:3://   - WEB-01 isNextControlFlowError rethrow
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:4://   - WEB-04 DELETE RETURNING id 확인
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:5://   - WEB-05 Doctor 삭제 시 Article 참조 보호 (ON DELETE NO ACTION)
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:6://   - WEB-06 delete result 통일 (SaveResult-like)
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:7://   - WEB-08 errors.ts entity constraint mapping
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:8://   - WEB-10 slug 변경 시 old path revalidate
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:9://   - WEB-11 displayOrder Postgres integer 범위 사용
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:10://   - WEB-15 content-deleted audit targetUserId 추가
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:14:import { revalidatePath } from "next/cache";
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:15:import { notFound, redirect } from "next/navigation";
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:17:import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:19:import { getSqlBase } from "@/lib/db";
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:20:import { isNextControlFlowError, resolveActionContext, assertActionEligibility } from "@/lib/action-context";
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:21:import { withSkeletonTx } from "@/lib/tenant";
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:22:import { mapDbErrorToResult } from "@/lib/errors";
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:23:import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:24:import type { SaveResult } from "@/lib/save-result";
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:46:    .refine((v) => /^[a-z0-9][a-z0-9-]{2,63}$/.test(v), {
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:47:      message: "slug 는 3~64자 (소문자/숫자/하이픈) 이어야 합니다.",
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:60:    .refine((v) => v === null || v === undefined || (/^https?:\/\//.test(v) && v.length <= 2048), {
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:61:      message: "사진 URL 은 http/https · 2048자 이내",
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:66:    .refine((v) => /^-?\d+$/.test(v), { message: "표시 순서는 정수" })
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:68:    // cycle1-3entity WEB-11: Postgres integer 범위 사용
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:152:          // cycle2-3entity WEB-28: content-saved payload shape 통일 (status 는 Doctor 에 없으므로 null)
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:158:      revalidatePath(`/${instanceSlug}/doctors`);
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:159:      revalidatePath(`/${instanceSlug}/doctors/${txResult.slug}`);
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:160:      // cycle1-3entity WEB-10: slug 변경 시 old path 도 revalidate
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:162:        revalidatePath(`/${instanceSlug}/doctors/${originalSlug}`);
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:164:      revalidatePath(`/${instanceSlug}`);
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:166:        redirect(`/${instanceSlug}/doctors/${txResult.slug}`);
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:172:    // cycle1-3entity WEB-01: redirect/notFound rethrow
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:175:    // cycle1-3entity WEB-08: 통합 mapping
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:183:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:204:      // cycle1-3entity WEB-05: Article 참조 보호 (ON DELETE NO ACTION) — 사전 확인
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:220:      // cycle1-3entity WEB-04: DELETE RETURNING 확인
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:254:    revalidatePath(`/${instanceSlug}/doctors`);
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:255:    revalidatePath(`/${instanceSlug}/doctors/${slug}`);
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:256:    revalidatePath(`/${instanceSlug}`);
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:257:    redirect(`/${instanceSlug}/doctors`);
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:260:    // cycle1-3entity WEB-06: delete error mapping
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:263:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src\app\(admin)\[instanceSlug]\doctors\actions.ts:270:      // cycle2-3entity WEB-24: article_author_fk 같은 field-mapping 도 delete 에서는 formError 로 변환
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:1:// @glitzy/web/(admin)/[instanceSlug]/doctors — 의료진 목록
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:2:// cycle2-3entity WEB-23: requirePageContext 공통 helper 사용
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:3:import Link from "next/link";
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:4:import { notFound, redirect } from "next/navigation";
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:5:import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:7:import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:8:import { requirePageContext } from "@/lib/page-context";
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:9:import { withSkeletonTx } from "@/lib/tenant";
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:21:        return <main className="p-6"><p>{a.message}</p></main>;
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:27:  // cycle5-3entity WEB-51: withSkeletonTx 의 TenantResolveError catch
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:45:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:48:        return <main className="p-6"><p>{a.message}</p></main>;
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:57:        <h1 className="text-2xl font-semibold">의료진 목록</h1>
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:59:          href={`/${params.instanceSlug}/doctors/new`}
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:63:        </Link>
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:64:      </header>
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:69:        </div>
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:74:              <th className="px-3 py-2">순서</th>
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:75:              <th className="px-3 py-2">이름</th>
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:76:              <th className="px-3 py-2">직함</th>
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:77:              <th className="px-3 py-2">slug</th>
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:78:              <th className="px-3 py-2">활성</th>
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:79:              <th className="px-3 py-2">수정일</th>
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:80:              <th className="px-3 py-2"></th>
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:81:            </tr>
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:82:          </thead>
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:86:                <td className="px-3 py-2 font-mono text-xs">{r.display_order}</td>
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:87:                <td className="px-3 py-2">{r.name}</td>
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:88:                <td className="px-3 py-2 text-slate-700">{r.title ?? "—"}</td>
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:89:                <td className="px-3 py-2 font-mono text-xs text-slate-500">{r.slug}</td>
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:90:                <td className="px-3 py-2">{r.active ? "✓" : "—"}</td>
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:91:                <td className="px-3 py-2 text-xs text-slate-500">{new Date(r.updated_at).toISOString().slice(0, 10)}</td>
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:93:                  <Link href={`/${params.instanceSlug}/doctors/${r.slug}`} className="text-xs text-blue-700 underline">
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:95:                  </Link>
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:96:                </td>
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:97:              </tr>
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:99:          </tbody>
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:100:        </table>
apps/web/src\app\(admin)\[instanceSlug]\doctors\page.tsx:102:    </main>
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:1:// @glitzy/web/(admin)/[instanceSlug]/treatments/actions
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:2:// cycle1-3entity patch:
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:3://   - WEB-01·04·06·08·10·15
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:4://   - WEB-12 published_at 정책: unpublish 시 NULL reset (CHECK 정합 · skeleton 기본). last-known timestamp 보존은 M2 cascade (Plan v1.0)
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:8:import { revalidatePath } from "next/cache";
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:9:import { notFound, redirect } from "next/navigation";
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:11:import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:13:import { getSqlBase } from "@/lib/db";
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:14:import { isNextControlFlowError, resolveActionContext, assertActionEligibility } from "@/lib/action-context";
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:15:import { withSkeletonTx } from "@/lib/tenant";
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:16:import { mapDbErrorToResult } from "@/lib/errors";
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:17:import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:18:import type { SaveResult } from "@/lib/save-result";
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:30:    .refine((v) => /^[a-z0-9][a-z0-9-]{2,99}$/.test(v), {
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:31:      message: "slug 는 3~100자 (소문자/숫자/하이픈) 이어야 합니다.",
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:45:  // cycle5-3entity WEB-53: enum value mismatch (FormData 변조) 도 한국어 메시지
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:54:      message: "위험도는 Low / Medium / High",
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:62:    .refine((v) => v === null || v === undefined || (/^https?:\/\//.test(v) && v.length <= 2048), {
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:63:      message: "hero 이미지 URL 은 http/https · 2048자",
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:103:        // cycle1-3entity WEB-12 / cycle2-3entity WEB-22: published 일 때만 timestamp 부여 (기존 published_at 보존)
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:104:        // unpublish 시 NULL reset (CHECK 정합 · skeleton 기본). last-known timestamp 보존은 M2 cascade.
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:156:      revalidatePath(`/${instanceSlug}/treatments`);
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:157:      revalidatePath(`/${instanceSlug}/treatments/${txResult.slug}`);
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:159:        revalidatePath(`/${instanceSlug}/treatments/${originalSlug}`);
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:161:      revalidatePath(`/${instanceSlug}`);
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:163:        redirect(`/${instanceSlug}/treatments/${txResult.slug}`);
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:177:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:221:    revalidatePath(`/${instanceSlug}/treatments`);
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:222:    revalidatePath(`/${instanceSlug}/treatments/${slug}`);
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:223:    revalidatePath(`/${instanceSlug}`);
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:224:    redirect(`/${instanceSlug}/treatments`);
apps/web/src\app\(admin)\[instanceSlug]\treatments\actions.ts:229:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
apps/web/src\app\(admin)\[instanceSlug]\articles\new\page.tsx:1:// @glitzy/web/(admin)/[instanceSlug]/articles/new
apps/web/src\app\(admin)\[instanceSlug]\articles\new\page.tsx:2:// cycle1-3entity WEB-03: page-level eligibility + withSkeletonTx catch
apps/web/src\app\(admin)\[instanceSlug]\articles\new\page.tsx:3:import Link from "next/link";
apps/web/src\app\(admin)\[instanceSlug]\articles\new\page.tsx:4:import { notFound, redirect } from "next/navigation";
apps/web/src\app\(admin)\[instanceSlug]\articles\new\page.tsx:5:import { TenantResolveError } from "@glitzy/auth";
apps/web/src\app\(admin)\[instanceSlug]\articles\new\page.tsx:7:import { assertActionEligibility } from "@glitzy/auth";
apps/web/src\app\(admin)\[instanceSlug]\articles\new\page.tsx:9:import { withSkeletonTx } from "@/lib/tenant";
apps/web/src\app\(admin)\[instanceSlug]\articles\new\page.tsx:10:import { requirePageContext } from "@/lib/page-context";
apps/web/src\app\(admin)\[instanceSlug]\articles\new\page.tsx:11:import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
apps/web/src\app\(admin)\[instanceSlug]\articles\new\page.tsx:12:import { ArticleForm } from "@/components/forms/ArticleForm";
apps/web/src\app\(admin)\[instanceSlug]\articles\new\page.tsx:13:import { saveArticle } from "../actions";
apps/web/src\app\(admin)\[instanceSlug]\articles\new\page.tsx:23:        return <main className="p-6"><p>{a.message}</p></main>;
apps/web/src\app\(admin)\[instanceSlug]\articles\new\page.tsx:32:      // cycle2-3entity WEB-17: withSkeletonTx 안 첫 줄에서도 eligibility 재확인 (role race 보호)
apps/web/src\app\(admin)\[instanceSlug]\articles\new\page.tsx:44:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src\app\(admin)\[instanceSlug]\articles\new\page.tsx:47:        return <main className="p-6"><p>{a.message}</p></main>;
apps/web/src\app\(admin)\[instanceSlug]\articles\new\page.tsx:57:        <h1 className="text-2xl font-semibold">아티클 작성</h1>
apps/web/src\app\(admin)\[instanceSlug]\articles\new\page.tsx:58:        <Link href={`/${params.instanceSlug}/articles`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
apps/web/src\app\(admin)\[instanceSlug]\articles\new\page.tsx:59:      </header>
apps/web/src\app\(admin)\[instanceSlug]\articles\new\page.tsx:60:      <ArticleForm action={bound} initial={null} isNew doctorOptions={doctorOptions} />
apps/web/src\app\(admin)\[instanceSlug]\articles\new\page.tsx:61:    </main>
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:1:// @glitzy/web/(admin)/[instanceSlug]/treatments — 시술 페이지 목록
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:2:// cycle2-3entity WEB-23: requirePageContext 통일
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:3:import Link from "next/link";
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:4:import { notFound, redirect } from "next/navigation";
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:5:import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:7:import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:8:import { requirePageContext } from "@/lib/page-context";
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:9:import { withSkeletonTx } from "@/lib/tenant";
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:21:        return <main className="p-6"><p>{a.message}</p></main>;
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:27:  // cycle5-3entity WEB-51: withSkeletonTx 의 TenantResolveError catch
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:45:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:48:        return <main className="p-6"><p>{a.message}</p></main>;
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:57:        <h1 className="text-2xl font-semibold">시술/진료 페이지</h1>
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:58:        <Link href={`/${params.instanceSlug}/treatments/new`} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:60:        </Link>
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:61:      </header>
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:65:          아직 등록된 시술/진료 페이지가 없습니다.
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:66:        </div>
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:71:              <th className="px-3 py-2">제목</th>
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:72:              <th className="px-3 py-2">slug</th>
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:73:              <th className="px-3 py-2">상태</th>
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:74:              <th className="px-3 py-2">위험도</th>
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:75:              <th className="px-3 py-2">발행일</th>
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:76:              <th className="px-3 py-2">수정일</th>
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:77:              <th className="px-3 py-2"></th>
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:78:            </tr>
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:79:          </thead>
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:83:                <td className="px-3 py-2 font-medium">{r.title}</td>
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:84:                <td className="px-3 py-2 font-mono text-xs text-slate-500">{r.slug}</td>
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:86:                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{r.status}</span>
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:87:                </td>
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:88:                <td className="px-3 py-2 text-xs">{r.risk_level ?? "—"}</td>
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:89:                <td className="px-3 py-2 text-xs text-slate-500">{r.published_at ? new Date(r.published_at).toISOString().slice(0, 10) : "—"}</td>
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:90:                <td className="px-3 py-2 text-xs text-slate-500">{new Date(r.updated_at).toISOString().slice(0, 10)}</td>
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:92:                  <Link href={`/${params.instanceSlug}/treatments/${r.slug}`} className="text-xs text-blue-700 underline">
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:94:                  </Link>
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:95:                </td>
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:96:              </tr>
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:98:          </tbody>
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:99:        </table>
apps/web/src\app\(admin)\[instanceSlug]\treatments\page.tsx:101:    </main>
apps/web/src\app\(admin)\[instanceSlug]\articles\[slug]\page.tsx:1:// @glitzy/web/(admin)/[instanceSlug]/articles/[slug] — 편집
apps/web/src\app\(admin)\[instanceSlug]\articles\[slug]\page.tsx:2:// cycle2-3entity WEB-23: requirePageContext 통일
apps/web/src\app\(admin)\[instanceSlug]\articles\[slug]\page.tsx:3:import Link from "next/link";
apps/web/src\app\(admin)\[instanceSlug]\articles\[slug]\page.tsx:4:import { notFound, redirect } from "next/navigation";
apps/web/src\app\(admin)\[instanceSlug]\articles\[slug]\page.tsx:5:import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";
apps/web/src\app\(admin)\[instanceSlug]\articles\[slug]\page.tsx:7:import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
apps/web/src\app\(admin)\[instanceSlug]\articles\[slug]\page.tsx:8:import { requirePageContext } from "@/lib/page-context";
apps/web/src\app\(admin)\[instanceSlug]\articles\[slug]\page.tsx:9:import { withSkeletonTx } from "@/lib/tenant";
apps/web/src\app\(admin)\[instanceSlug]\articles\[slug]\page.tsx:10:import { ArticleForm, type ArticleInitial } from "@/components/forms/ArticleForm";
apps/web/src\app\(admin)\[instanceSlug]\articles\[slug]\page.tsx:11:import { DeleteForm } from "@/components/forms/DeleteForm";
apps/web/src\app\(admin)\[instanceSlug]\articles\[slug]\page.tsx:12:import { deleteArticle, saveArticle } from "../actions";
apps/web/src\app\(admin)\[instanceSlug]\articles\[slug]\page.tsx:22:        return <main className="p-6"><p>{a.message}</p></main>;
apps/web/src\app\(admin)\[instanceSlug]\articles\[slug]\page.tsx:28:  // cycle5-3entity WEB-51: withSkeletonTx 의 TenantResolveError catch
apps/web/src\app\(admin)\[instanceSlug]\articles\[slug]\page.tsx:56:      // cycle1-3entity WEB-09: 현재 author 가 inactive 여도 option 포함
apps/web/src\app\(admin)\[instanceSlug]\articles\[slug]\page.tsx:84:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src\app\(admin)\[instanceSlug]\articles\[slug]\page.tsx:87:        return <main className="p-6"><p>{a.message}</p></main>;
apps/web/src\app\(admin)\[instanceSlug]\articles\[slug]\page.tsx:100:        <h1 className="text-2xl font-semibold">아티클 편집 · {bundle.initial.title}</h1>
apps/web/src\app\(admin)\[instanceSlug]\articles\[slug]\page.tsx:101:        <Link href={`/${params.instanceSlug}/articles`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
apps/web/src\app\(admin)\[instanceSlug]\articles\[slug]\page.tsx:102:      </header>
apps/web/src\app\(admin)\[instanceSlug]\articles\[slug]\page.tsx:104:      <ArticleForm action={boundSave} initial={bundle.initial} isNew={false} doctorOptions={bundle.doctorOptions} />
apps/web/src\app\(admin)\[instanceSlug]\articles\[slug]\page.tsx:106:      <DeleteForm action={boundDelete} confirmMessage="정말 이 아티클을 삭제하시겠습니까?" />
apps/web/src\app\(admin)\[instanceSlug]\articles\[slug]\page.tsx:107:    </main>
apps/web/src\app\(admin)\[instanceSlug]\doctors\new\page.tsx:1:// @glitzy/web/(admin)/[instanceSlug]/doctors/new
apps/web/src\app\(admin)\[instanceSlug]\doctors\new\page.tsx:2:// cycle1-3entity WEB-02: page entry 에서 session/slug/tenant/eligibility 모두 검증
apps/web/src\app\(admin)\[instanceSlug]\doctors\new\page.tsx:3:import Link from "next/link";
apps/web/src\app\(admin)\[instanceSlug]\doctors\new\page.tsx:4:import { TenantResolveError } from "@glitzy/auth";
apps/web/src\app\(admin)\[instanceSlug]\doctors\new\page.tsx:5:import { DoctorProfileForm } from "@/components/forms/DoctorProfileForm";
apps/web/src\app\(admin)\[instanceSlug]\doctors\new\page.tsx:6:import { requirePageContext } from "@/lib/page-context";
apps/web/src\app\(admin)\[instanceSlug]\doctors\new\page.tsx:7:import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
apps/web/src\app\(admin)\[instanceSlug]\doctors\new\page.tsx:8:import { saveDoctorProfile } from "../actions";
apps/web/src\app\(admin)\[instanceSlug]\doctors\new\page.tsx:17:        return <main className="p-6"><p>{a.message}</p></main>;
apps/web/src\app\(admin)\[instanceSlug]\doctors\new\page.tsx:27:        <h1 className="text-2xl font-semibold">의료진 추가</h1>
apps/web/src\app\(admin)\[instanceSlug]\doctors\new\page.tsx:28:        <Link href={`/${params.instanceSlug}/doctors`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
apps/web/src\app\(admin)\[instanceSlug]\doctors\new\page.tsx:29:      </header>
apps/web/src\app\(admin)\[instanceSlug]\doctors\new\page.tsx:30:      <DoctorProfileForm action={bound} initial={null} isNew />
apps/web/src\app\(admin)\[instanceSlug]\doctors\new\page.tsx:31:    </main>
apps/web/src\app\(admin)\[instanceSlug]\doctors\[slug]\page.tsx:1:// @glitzy/web/(admin)/[instanceSlug]/doctors/[slug] — 의료진 편집
apps/web/src\app\(admin)\[instanceSlug]\doctors\[slug]\page.tsx:2:// cycle2-3entity WEB-23: requirePageContext 통일
apps/web/src\app\(admin)\[instanceSlug]\doctors\[slug]\page.tsx:3:import Link from "next/link";
apps/web/src\app\(admin)\[instanceSlug]\doctors\[slug]\page.tsx:4:import { notFound, redirect } from "next/navigation";
apps/web/src\app\(admin)\[instanceSlug]\doctors\[slug]\page.tsx:5:import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";
apps/web/src\app\(admin)\[instanceSlug]\doctors\[slug]\page.tsx:7:import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
apps/web/src\app\(admin)\[instanceSlug]\doctors\[slug]\page.tsx:8:import { requirePageContext } from "@/lib/page-context";
apps/web/src\app\(admin)\[instanceSlug]\doctors\[slug]\page.tsx:9:import { withSkeletonTx } from "@/lib/tenant";
apps/web/src\app\(admin)\[instanceSlug]\doctors\[slug]\page.tsx:10:import { DoctorProfileForm, type DoctorProfileInitial } from "@/components/forms/DoctorProfileForm";
apps/web/src\app\(admin)\[instanceSlug]\doctors\[slug]\page.tsx:11:import { DeleteForm } from "@/components/forms/DeleteForm";
apps/web/src\app\(admin)\[instanceSlug]\doctors\[slug]\page.tsx:12:import { saveDoctorProfile, deleteDoctorProfile } from "../actions";
apps/web/src\app\(admin)\[instanceSlug]\doctors\[slug]\page.tsx:22:        return <main className="p-6"><p>{a.message}</p></main>;
apps/web/src\app\(admin)\[instanceSlug]\doctors\[slug]\page.tsx:28:  // cycle5-3entity WEB-51: withSkeletonTx 의 TenantResolveError catch
apps/web/src\app\(admin)\[instanceSlug]\doctors\[slug]\page.tsx:69:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src\app\(admin)\[instanceSlug]\doctors\[slug]\page.tsx:72:        return <main className="p-6"><p>{a.message}</p></main>;
apps/web/src\app\(admin)\[instanceSlug]\doctors\[slug]\page.tsx:85:        <h1 className="text-2xl font-semibold">의료진 편집 · {initial.name}</h1>
apps/web/src\app\(admin)\[instanceSlug]\doctors\[slug]\page.tsx:86:        <Link href={`/${params.instanceSlug}/doctors`} className="text-sm text-slate-600 hover:underline">
apps/web/src\app\(admin)\[instanceSlug]\doctors\[slug]\page.tsx:88:        </Link>
apps/web/src\app\(admin)\[instanceSlug]\doctors\[slug]\page.tsx:89:      </header>
apps/web/src\app\(admin)\[instanceSlug]\doctors\[slug]\page.tsx:91:      <DoctorProfileForm action={boundSave} initial={initial} isNew={false} />
apps/web/src\app\(admin)\[instanceSlug]\doctors\[slug]\page.tsx:93:      <DeleteForm action={boundDelete} confirmMessage="정말 이 의료진을 삭제하시겠습니까?" />
apps/web/src\app\(admin)\[instanceSlug]\doctors\[slug]\page.tsx:94:    </main>
apps/web/src\app\(admin)\[instanceSlug]\treatments\new\page.tsx:1:// @glitzy/web/(admin)/[instanceSlug]/treatments/new
apps/web/src\app\(admin)\[instanceSlug]\treatments\new\page.tsx:2:// cycle1-3entity WEB-02: page entry 에서 session/slug/tenant/eligibility 모두 검증
apps/web/src\app\(admin)\[instanceSlug]\treatments\new\page.tsx:3:import Link from "next/link";
apps/web/src\app\(admin)\[instanceSlug]\treatments\new\page.tsx:4:import { TenantResolveError } from "@glitzy/auth";
apps/web/src\app\(admin)\[instanceSlug]\treatments\new\page.tsx:5:import { TreatmentPageForm } from "@/components/forms/TreatmentPageForm";
apps/web/src\app\(admin)\[instanceSlug]\treatments\new\page.tsx:6:import { requirePageContext } from "@/lib/page-context";
apps/web/src\app\(admin)\[instanceSlug]\treatments\new\page.tsx:7:import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
apps/web/src\app\(admin)\[instanceSlug]\treatments\new\page.tsx:8:import { saveTreatmentPage } from "../actions";
apps/web/src\app\(admin)\[instanceSlug]\treatments\new\page.tsx:17:        return <main className="p-6"><p>{a.message}</p></main>;
apps/web/src\app\(admin)\[instanceSlug]\treatments\new\page.tsx:27:        <h1 className="text-2xl font-semibold">시술 페이지 추가</h1>
apps/web/src\app\(admin)\[instanceSlug]\treatments\new\page.tsx:28:        <Link href={`/${params.instanceSlug}/treatments`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
apps/web/src\app\(admin)\[instanceSlug]\treatments\new\page.tsx:29:      </header>
apps/web/src\app\(admin)\[instanceSlug]\treatments\new\page.tsx:30:      <TreatmentPageForm action={bound} initial={null} isNew />
apps/web/src\app\(admin)\[instanceSlug]\treatments\new\page.tsx:31:    </main>
apps/web/src\app\(admin)\[instanceSlug]\treatments\[slug]\page.tsx:1:// @glitzy/web/(admin)/[instanceSlug]/treatments/[slug] — 편집
apps/web/src\app\(admin)\[instanceSlug]\treatments\[slug]\page.tsx:2:// cycle2-3entity WEB-23: requirePageContext 통일
apps/web/src\app\(admin)\[instanceSlug]\treatments\[slug]\page.tsx:3:import Link from "next/link";
apps/web/src\app\(admin)\[instanceSlug]\treatments\[slug]\page.tsx:4:import { notFound, redirect } from "next/navigation";
apps/web/src\app\(admin)\[instanceSlug]\treatments\[slug]\page.tsx:5:import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";
apps/web/src\app\(admin)\[instanceSlug]\treatments\[slug]\page.tsx:7:import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
apps/web/src\app\(admin)\[instanceSlug]\treatments\[slug]\page.tsx:8:import { requirePageContext } from "@/lib/page-context";
apps/web/src\app\(admin)\[instanceSlug]\treatments\[slug]\page.tsx:9:import { withSkeletonTx } from "@/lib/tenant";
apps/web/src\app\(admin)\[instanceSlug]\treatments\[slug]\page.tsx:10:import { TreatmentPageForm, type TreatmentPageInitial } from "@/components/forms/TreatmentPageForm";
apps/web/src\app\(admin)\[instanceSlug]\treatments\[slug]\page.tsx:11:import { DeleteForm } from "@/components/forms/DeleteForm";
apps/web/src\app\(admin)\[instanceSlug]\treatments\[slug]\page.tsx:12:import { deleteTreatmentPage, saveTreatmentPage } from "../actions";
apps/web/src\app\(admin)\[instanceSlug]\treatments\[slug]\page.tsx:22:        return <main className="p-6"><p>{a.message}</p></main>;
apps/web/src\app\(admin)\[instanceSlug]\treatments\[slug]\page.tsx:28:  // cycle5-3entity WEB-51: withSkeletonTx 의 TenantResolveError catch
apps/web/src\app\(admin)\[instanceSlug]\treatments\[slug]\page.tsx:68:      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
apps/web/src\app\(admin)\[instanceSlug]\treatments\[slug]\page.tsx:71:        return <main className="p-6"><p>{a.message}</p></main>;
apps/web/src\app\(admin)\[instanceSlug]\treatments\[slug]\page.tsx:84:        <h1 className="text-2xl font-semibold">시술 페이지 편집 · {initial.title}</h1>
apps/web/src\app\(admin)\[instanceSlug]\treatments\[slug]\page.tsx:85:        <Link href={`/${params.instanceSlug}/treatments`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
apps/web/src\app\(admin)\[instanceSlug]\treatments\[slug]\page.tsx:86:      </header>
apps/web/src\app\(admin)\[instanceSlug]\treatments\[slug]\page.tsx:88:      <TreatmentPageForm action={boundSave} initial={initial} isNew={false} />
apps/web/src\app\(admin)\[instanceSlug]\treatments\[slug]\page.tsx:90:      <DeleteForm action={boundDelete} confirmMessage="정말 이 시술 페이지를 삭제하시겠습니까?" />
apps/web/src\app\(admin)\[instanceSlug]\treatments\[slug]\page.tsx:91:    </main>

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "''^export const orderedMigrations|D0011|public_reader|D0010|C0008|10단계|9단계" packages/migrations-runner/src/manifest.ts' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"redirect\\("'`/'"\\"'$'"\\{|redirect\\("'`/[a-z]|revalidatePath'"\\("'`/'"\\"'$'"\\{|href=\\{"'`/'"\\"'$'"\\{|href=\\{"'`/|returnUrl|firstSlug|result'"\\.slug\" apps/web/src/app apps/web/src/components apps/web/src/lib apps/web/src/seed.ts" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "app_public_reader|userlist|pgbouncer" -S .' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"PUBLIC_SITE|PSR-CASCADE|/admin|\\(site\\)|admin/<|<instanceSlug>|완료 게이트|사이트 측\" docs/admin/ARCHITECTURE.md docs/decisions/M0_BUILD_EXPORT_PLAN.md" in C:\Users\assag\solution\website-exposure
 succeeded in 809ms:
9:// 패키지의 D0010 과 C0001 비교 등은 lexicographic 으로 의도와 충돌).
23: * orderedMigrations — LOCATION_LEGAL_PLAN v1.1 § 6 의존성 9단계 (C0003 doctor_profile 포함 — LLC-15 patch).
26:export const orderedMigrations: ReadonlyArray<MigrationDescriptor> = [
29:    file: "packages/db/migrations/D0010_instance.sql",
41:  // (3) location_profile (base table — clinic_profile_id 미포함 · C0008 에서 ALTER)
93:    file: "packages/core-content/migrations/C0008_location_profile_parent_clinic.sql",

 succeeded in 809ms:
apps/web/src/app\page.tsx:56:  redirect(`/${result.slug}`);

 succeeded in 775ms:
docs/decisions/M0_BUILD_EXPORT_PLAN.md:9:- `docs/admin/ARCHITECTURE.md` v0.7 § 3 Vertical Slice · § 3.8.1·3.8.2 자동 생성 규칙 · § 3.11 완료 게이트 #1
docs/decisions/M0_BUILD_EXPORT_PLAN.md:20:- `instance_id` 별 별도 git working tree (또는 단일 git repo 안 `instances/<instanceSlug>/` subtree).
docs/admin/ARCHITECTURE.md:171:### 3.8 Slice 사이트 측 페이지 타입 (Data Plane이 빌드) — 9종 + Article 1샘플 = 10개 페이지
docs/admin/ARCHITECTURE.md:269:### 3.11 Slice 완료 게이트 (6항목)
docs/admin/ARCHITECTURE.md:273:| 1 | 사이트 측 페이지 타입 9종 + Article 1샘플 빌드 (총 10 페이지) | Home·About·Doctors List·Doctor Profile·Treatments List·Treatment Detail·**Contact**·**Location Detail (main 자동)**·**Legal/Policy (자동, 법무 검토)**·Article Detail 1개 — 정적 빌드 가능. 상세는 PAGE_TYPES.md § 6 |
docs/admin/ARCHITECTURE.md:391:> 상세 필드는 `docs/admin/DATA_MODEL.md`.
docs/admin/ARCHITECTURE.md:502:| 2026-05-13 | v0.3 | **PAGE_TYPES.md v0.2 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 5종 → **7종 + Article 1샘플 = 8개 페이지** (Contact 추가), (2) § 3.11 완료 게이트 #1 7종 빌드로 수정, (3) 단일 진실 원본은 `core/PAGE_TYPES.md`로 명시 (중복 회피). 어드민 화면 수 6개는 유지(Contact는 ClinicProfile 자동 생성) | Glitzy (Claude 페어링) |
docs/admin/ARCHITECTURE.md:503:| 2026-05-14 | v0.4 | **PAGE_TYPES v0.5 + DATA_MODEL v0.4 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 7종+1샘플 → **8종+1샘플=9개 페이지** (P-014 Location Detail 추가), (2) **§ 3.8.1 LocationProfile(main) 자동 생성 규칙 명시** — 어드민 화면 추가 없이 ClinicProfile 입력으로 자동 생성, (3) § 3.11 완료 게이트 #1 8종 빌드로 수정. 어드민 화면 수 6개는 그대로 유지 | Glitzy (Claude 페어링) |
docs/admin/ARCHITECTURE.md:504:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **§ 3.8.1 표현 정리** — 계약 필드(파일 출력)와 어드민 폼 입력 필드(UI 수집)의 구분 명시. ClinicProfile 폼은 두 섹션(기관 정체성 + 본원 위치·연락·시간)으로 출력은 ClinicProfile + LocationProfile main 두 파일, (2) **§ 3.8.2 LegalDocument 자동 생성 규칙 신규** — Core 표준 템플릿 + ClinicProfile 변수 치환, ComplianceRecord 추적, (3) **§ 3.8 Slice 9종+1샘플 → 10종+1샘플=10페이지** (P-013 격상 추가), (4) § 3.11 완료 게이트 #1 10종, (5) **§ 5.2 데이터 입력 영역** — 어드민 화면별 입력·출력 매핑 표 추가로 1:1이 아님 명시 | Glitzy (Claude 페어링) |

 succeeded in 824ms:
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.prompt.md:11:| PSR-05 | blocking | app_public_reader instance slug resolve 불가 | D0011 안 instance lookup policy + content table per-table policy 7개. LOGIN 결정 + production NOLOGIN marker PSR-DEFER-16 |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.prompt.md:27:| PSR-21 | minor | env/pgbouncer/role cascade | § 6 PSR-ENV-01 acceptance checklist 12 항목 |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.prompt.md:39:- `apps/spike-a/.../userlist.txt` (PSR-CASCADE-05)
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:24:| PSR-05 | blocking | app_public_reader instance slug resolve 불가 | D0011 안 instance lookup policy + content table per-table policy 7개. LOGIN 결정 + production NOLOGIN marker PSR-DEFER-16 |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:40:| PSR-21 | minor | env/pgbouncer/role cascade | § 6 PSR-ENV-01 acceptance checklist 12 항목 |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:52:- `apps/spike-a/.../userlist.txt` (PSR-CASCADE-05)
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:568:44:| `app_public_reader` PostgreSQL role + per-table SELECT policy (cycle1 PSR-05·15 정정) | 신규 D0011 migration 안 instance lookup policy + 6 content table policy 명시 |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:576:54:| env / pgbouncer / role membership cascade (cycle1 PSR-21 정정) | `WEB_PUBLIC_DATABASE_URL` env · `.env.example` · pgbouncer userlist · `app_public_reader NOLOGIN MEMBERSHIP` 등 acceptance checklist |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:620:128:### 3.1 D0011 — `app_public_reader` role + per-table policy (PSR-DATA-01) — cycle1 PSR-05·15 정정
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:643:205:- (PSR-DATA-02 · cycle1 PSR-05) `app_public_reader` LOGIN — v0.1 단순화. production 단 NOLOGIN + MEMBERSHIP 분리 marker (PSR-DEFER-16 신설).
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:645:211:- (PSR-DATA-04) `app_public_reader` 는 audit_event INSERT 권한 없음 — 공개 페이지 access log 는 별도 (CDN / Vercel analytics · PSR-DEFER-10).
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:647:215:  - Spike A pgbouncer userlist 에 `app_public_reader` 추가 (PSR-CASCADE-05)
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:771:563:| 5 | pgbouncer userlist 에 `app_public_reader` 추가 (`apps/spike-a/...userlist.txt`) | PSR-CASCADE-05 acceptance precondition |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:800:604:| 1 | D0011 migration — `app_public_reader` LOGIN + 7개 policy (instance + 6 content table) | packages/db/migrations/D0011_public_reader.sql |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:812:623:| 20 | Spike A pgbouncer userlist patch (PSR-CASCADE-05) | apps/spike-a/userlist.txt |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:820:635:- `PSR-DEFER-16` (cycle1 PSR-05): `app_public_reader` NOLOGIN + MEMBERSHIP 분리 production 패턴.
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:840:666:- `PSR-CASCADE-05`: `apps/spike-a` pgbouncer userlist — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade).
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:842:673:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:853:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "admin|/admin|instanceSlug|sign-in|revalidatePath|seed|dashboard|cleanup|PSR-CASCADE|PUBLIC_SITE" docs/admin/ARCHITECTURE.md docs/decisions/M0_BUILD_EXPORT_PLAN.md packages/migrations-runner/src/manifest.ts apps/spike-a/userlist.txt' in C:\Users\assag\solution\website-exposure
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:1308:rg: apps/spike-a/userlist.txt: 지정된 파일을 찾을 수 없습니다. (os error 2)
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:1314:rg: apps/spike-a/userlist.txt: 지정된 파일을 찾을 수 없습니다. (os error 2)
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:1323:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg --files | rg \"(userlist|manifest\\.ts|ARCHITECTURE\\.md|M0_BUILD_EXPORT_PLAN\\.md)"'$"' in C:\Users\assag\solution\website-exposure
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:1875:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "app_public_reader|D0011|10단계|public_reader|NOLOGIN|MEMBERSHIP|manifest|C0008|D0011_public_reader" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md packages/migrations-runner/src/manifest.ts docs/decisions/LOCATION_LEGAL_PLAN.md' in C:\Users\assag\solution\website-exposure
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2015:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:673:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2033:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:44:| `app_public_reader` PostgreSQL role + per-table SELECT policy (cycle1 PSR-05·15 정정) | 신규 D0011 migration 안 instance lookup policy + 6 content table policy 명시 |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2034:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:54:| env / pgbouncer / role membership cascade (cycle1 PSR-21 정정) | `WEB_PUBLIC_DATABASE_URL` env · `.env.example` · pgbouncer userlist · `app_public_reader NOLOGIN MEMBERSHIP` 등 acceptance checklist |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2035:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:128:### 3.1 D0011 — `app_public_reader` role + per-table policy (PSR-DATA-01) — cycle1 PSR-05·15 정정
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2039:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:135:-- v0.1 은 LOGIN role 한 개 (`app_public_reader`) 로 단순화 — production 분리 marker.
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2040:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:136:CREATE ROLE app_public_reader LOGIN;
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2041:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:138:GRANT USAGE ON SCHEMA public TO app_public_reader;
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2042:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:143:GRANT SELECT ON instance TO app_public_reader;
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2044:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:148:  TO app_public_reader
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2045:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:157:  TO app_public_reader;
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2047:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:160:  ON clinic_profile FOR SELECT TO app_public_reader
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2049:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:164:  ON location_profile FOR SELECT TO app_public_reader
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2051:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:168:  ON doctor_profile FOR SELECT TO app_public_reader
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2053:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:175:  ON treatment_page FOR SELECT TO app_public_reader
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2055:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:184:  ON article FOR SELECT TO app_public_reader
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2057:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:197:  ON legal_document FOR SELECT TO app_public_reader
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2058:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:205:- (PSR-DATA-02 · cycle1 PSR-05) `app_public_reader` LOGIN — v0.1 단순화. production 단 NOLOGIN + MEMBERSHIP 분리 marker (PSR-DEFER-16 신설).
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2059:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:211:- (PSR-DATA-04) `app_public_reader` 는 audit_event INSERT 권한 없음 — 공개 페이지 access log 는 별도 (CDN / Vercel analytics · PSR-DEFER-10).
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2060:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:215:  - Spike A pgbouncer userlist 에 `app_public_reader` 추가 (PSR-CASCADE-05)
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2063:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:561:| 3 | `apps/web/src/lib/public-db.ts` 신규 — `app_public_reader` connection helper (singleton) | acceptance precondition |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2064:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:563:| 5 | pgbouncer userlist 에 `app_public_reader` 추가 (`apps/spike-a/...userlist.txt`) | PSR-CASCADE-05 acceptance precondition |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2067:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:584:| 9 | tenant A 가 `/<tenantB>` 접근 — A 콘텐츠 미노출, B 콘텐츠만 | RLS app_public_reader USING `instance_id` 정합 |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2068:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:604:| 1 | D0011 migration — `app_public_reader` LOGIN + 7개 policy (instance + 6 content table) | packages/db/migrations/D0011_public_reader.sql |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2070:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:635:- `PSR-DEFER-16` (cycle1 PSR-05): `app_public_reader` NOLOGIN + MEMBERSHIP 분리 production 패턴.
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2072:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:666:- `PSR-CASCADE-05`: `apps/spike-a` pgbouncer userlist — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade).
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2073:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:673:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2092:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:197:  ON legal_document FOR SELECT TO app_public_reader
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:2107:docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:673:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-2.out.md:3318:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "app_public_reader|userlist|pgbouncer" -S .' in C:\Users\assag\solution\website-exposure
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.prompt.md:34:- 신규 PostgreSQL role `app_public_reader` 의 권한 설계 (RLS USING `instance_id` · GRANT SELECT only)
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.prompt.md:36:- `WEB_PUBLIC_DATABASE_URL` 분리 + pgbouncer userlist cascade
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.prompt.md:63:- `app_public_reader` SQL injection 방어 (parameterized query)
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.prompt.md:75:- PSR-CASCADE-05: pgbouncer userlist
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:47:- 신규 PostgreSQL role `app_public_reader` 의 권한 설계 (RLS USING `instance_id` · GRANT SELECT only)
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:49:- `WEB_PUBLIC_DATABASE_URL` 분리 + pgbouncer userlist cascade
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:76:- `app_public_reader` SQL injection 방어 (parameterized query)
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:88:- PSR-CASCADE-05: pgbouncer userlist
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:283:apps\spike-a\src\scenarios\test-pgbouncer-auth.ts
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:307:apps\spike-a\pgbouncer\userlist.txt
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:308:apps\spike-a\pgbouncer\pgbouncer.ini
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:761:  40: | 공개 SELECT 권한 분리 | 신규 PostgreSQL role `app_public_reader` (SELECT only · publishable/published 콘텐츠 + ClinicProfile/Doctor/Location/LegalDocument). v0.1 단계는 row-level filter `status='published'` (LegalDocument 는 draft 도 본 plan 단계 한정 노출 — published 게이트 LL-DEFER-01 합류 시점까지) |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:770:  49: | RLS 정합 | `app_public_reader` role 에는 RLS USING `instance_id = ...` policy 적용. `app.current_instance_id` setting 으로 tenant scope |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:836: 115: ### 3.1 신규 PostgreSQL role `app_public_reader` (PSR-DATA-01)
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:841: 120: CREATE ROLE app_public_reader;
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:842: 121: GRANT USAGE ON SCHEMA public TO app_public_reader;
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:845: 124:   TO app_public_reader;
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:850: 129: - (PSR-DATA-02) `app_public_reader` 는 SELECT only. RLS 는 instance 단위 USING `instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid` 적용.
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:852: 131: - (PSR-DATA-04) `app_public_reader` 는 audit_event INSERT 권한 없음 — 공개 페이지는 access log 가 별도 (CDN · Vercel analytics · PSR-DEFER-10 cascade).
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:853: 132: - (PSR-DATA-05) connection pool 분리: `WEB_PUBLIC_DATABASE_URL` (신규 env) — pgbouncer userlist 에 `app_public_reader` 별도 등록 (Spike A pgbouncer 정합).
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:1020: 299: - `WEB_PUBLIC_DATABASE_URL` 신규 env — `app_public_reader` role connection string. `apps/web/.env.example` patch.
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:1021: 300: - D0011 migration — `app_public_reader` role 생성. packages/migrations-runner manifest 9단계 → 10단계 (D0011 추가 — PSR-CASCADE-04).
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:1022: 301: - pgbouncer userlist 에 `app_public_reader` 추가 (Spike A v0.x cascade — PSR-CASCADE-05).
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:1038: 317: | 9 | tenant A 가 `/<tenantB>` 접근 — A 콘텐츠 미노출, B 콘텐츠만 | RLS app_public_reader USING `instance_id` 정합 |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:1055: 334: | 1 | D0011 migration — `app_public_reader` role + GRANT | packages/db/migrations/D0011_public_reader.sql |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:1072: 351: | 18 | Spike A pgbouncer userlist 에 `app_public_reader` 추가 marker | PSR-CASCADE-05 |
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:1108: 387: - `PSR-CASCADE-05`: `apps/spike-a` pgbouncer userlist — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade).
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:9969:- **PSR-05**: `app_public_reader`가 instance slug를 RLS 아래에서 resolve할 수 없음
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:9972:  - 문제: helper 흐름은 “instance 조회 → current_instance_id set”인데, public reader가 처음 slug를 조회할 정책이 없다. 또한 `CREATE ROLE app_public_reader;`는 connection URL용 LOGIN 여부도 불명확하다.
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:9973:  - 권장 patch: `app_public_reader LOGIN` 여부, `instance`에 active slug lookup 전용 SELECT policy, 이후 content tables의 `instance_id = current_setting(...)` policy를 분리 명시.
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10033:  - 문제: `app_public_reader`용 policy를 모든 content table에 추가해야 하는데 migration 작업 단위에는 D0011만 있고 각 table policy 이름/USING 조건/GRANT revoke가 없다.
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10034:  - 권장 patch: D0011에 per-table `CREATE POLICY public_reader_select_* FOR SELECT TO app_public_reader`를 명시.
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10064:- **PSR-21**: `WEB_PUBLIC_DATABASE_URL` cascade가 env/example/pgbouncer/app role까지 분해되지 않음
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10066:  - 문제: userlist marker만 있고 `.env.example`, pooling mode, password/user 생성, role membership/NOINHERIT 여부가 없다.
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10067:  - 권장 patch: D0011 + env + pgbouncer userlist + deployment secret 작업을 acceptance checklist로 분리.
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10074:- PSR-CASCADE-05: TBD — pgbouncer userlist 추가 대상은 marker만 있고 실제 Spike A/userlist cascade 범위가 불명확.
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10109:- **PSR-05**: `app_public_reader`가 instance slug를 RLS 아래에서 resolve할 수 없음
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10112:  - 문제: helper 흐름은 “instance 조회 → current_instance_id set”인데, public reader가 처음 slug를 조회할 정책이 없다. 또한 `CREATE ROLE app_public_reader;`는 connection URL용 LOGIN 여부도 불명확하다.
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10113:  - 권장 patch: `app_public_reader LOGIN` 여부, `instance`에 active slug lookup 전용 SELECT policy, 이후 content tables의 `instance_id = current_setting(...)` policy를 분리 명시.
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10173:  - 문제: `app_public_reader`용 policy를 모든 content table에 추가해야 하는데 migration 작업 단위에는 D0011만 있고 각 table policy 이름/USING 조건/GRANT revoke가 없다.
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10174:  - 권장 patch: D0011에 per-table `CREATE POLICY public_reader_select_* FOR SELECT TO app_public_reader`를 명시.
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10204:- **PSR-21**: `WEB_PUBLIC_DATABASE_URL` cascade가 env/example/pgbouncer/app role까지 분해되지 않음
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10206:  - 문제: userlist marker만 있고 `.env.example`, pooling mode, password/user 생성, role membership/NOINHERIT 여부가 없다.
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10207:  - 권장 patch: D0011 + env + pgbouncer userlist + deployment secret 작업을 acceptance checklist로 분리.
.\handoff\codex-reviews\public-site-render-plan-v1\cycle-1.out.md:10214:- PSR-CASCADE-05: TBD — pgbouncer userlist 추가 대상은 marker만 있고 실제 Spike A/userlist cascade 범위가 불명확.
.\apps\spike-a\src\tenant.ts:31: * - rollback 시 SET LOCAL 자동 해제 (pgbouncer transaction pooling 안전)
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:375:apps\spike-a\src\scenarios\test-pgbouncer-auth.ts
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:415:apps\spike-a\pgbouncer\userlist.txt
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:416:apps\spike-a\pgbouncer\pgbouncer.ini
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:839:.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:3486:docs\decisions\INFRA_DECISIONS_DRAFT.md:471:| 2026-05-15 | (v0.3 비고 이전) | **codex 2차 15 지적 전건 수용 + cascade**: (1) **RLS 실행 모델** — withTenantTransaction 헬퍼·SET LOCAL·worker control/tenant plane 분리·pgBouncer transaction pooling·lint·runtime guard (INFRA2-01), (2) **REVIEW_WORKFLOW cascade — service-role-invoked·instance-switched AuditAction 2종 추가** (INFRA2-02·08), (3) **Phase 0 outbox 옵션 A** — P0에 notifications 최소 subset (Receipt·Log·PayloadRecord·DeliveryAttempt) 포함 (INFRA2-03), (4) **composite FK 3등급 분류** — tenant-plane hard FK·control-plane FK·polymorphic ref typed registry (INFRA2-04), (5) **tenant export/import manifest dependency class** — portable·rebind-required·rotate-required·legal-reapproval-required·external-provider-owned·blob-copy-required·audit-chain-preserved (INFRA2-05), (6) **rate limit taxonomy** — Postgres hard quota·Redis soft cache 분리 (INFRA2-06), (7) **Storage ADR — Cloudflare R2 reversal 권장** (INFRA2-07), (8) **resolveTenantContext** — server-side membership/role/legal eligibility 검증·instance-switched audit (INFRA2-08), (9) **Spike A·B·C gate Week 1** (INFRA2-09), (10) **legal-reviewer fixed-scope package → 시간당 → retainer 단계** (INFRA2-10), (11) **internal beta는 workflow technical validation 한정** (INFRA2-11), (12) **customer domain ADR 별도** (INFRA2-12), (13) **사전심의 manual-assisted workflow** — submission packet export·institutionType enum (INFRA2-13), (14) **PIPA + GDPR checklist** Phase 1 gate (INFRA2-14), (15) **DATA_MODEL C-08 v0.23 cascade — email transport/provider 분리** (INFRA2-15) |
.\handoff\codex-reviews\location-legal-code-v1\cycle-5.out.md:892:.\docs\decisions\INFRA_DECISIONS_DRAFT.md:471:| 2026-05-15 | (v0.3 비고 이전) | **codex 2차 15 지적 전건 수용 + cascade**: (1) **RLS 실행 모델** — withTenantTransaction 헬퍼·SET LOCAL·worker control/tenant plane 분리·pgBouncer transaction pooling·lint·runtime guard (INFRA2-01), (2) **REVIEW_WORKFLOW cascade — service-role-invoked·instance-switched AuditAction 2종 추가** (INFRA2-02·08), (3) **Phase 0 outbox 옵션 A** — P0에 notifications 최소 subset (Receipt·Log·PayloadRecord·DeliveryAttempt) 포함 (INFRA2-03), (4) **composite FK 3등급 분류** — tenant-plane hard FK·control-plane FK·polymorphic ref typed registry (INFRA2-04), (5) **tenant export/import manifest dependency class** — portable·rebind-required·rotate-required·legal-reapproval-required·external-provider-owned·blob-copy-required·audit-chain-preserved (INFRA2-05), (6) **rate limit taxonomy** — Postgres hard quota·Redis soft cache 분리 (INFRA2-06), (7) **Storage ADR — Cloudflare R2 reversal 권장** (INFRA2-07), (8) **resolveTenantContext** — server-side membership/role/legal eligibility 검증·instance-switched audit (INFRA2-08), (9) **Spike A·B·C gate Week 1** (INFRA2-09), (10) **legal-reviewer fixed-scope package → 시간당 → retainer 단계** (INFRA2-10), (11) **internal beta는 workflow technical validation 한정** (INFRA2-11), (12) **customer domain ADR 별도** (INFRA2-12), (13) **사전심의 manual-assisted workflow** — submission packet export·institutionType enum (INFRA2-13), (14) **PIPA + GDPR checklist** Phase 1 gate (INFRA2-14), (15) **DATA_MODEL C-08 v0.23 cascade — email transport/provider 분리** (INFRA2-15) |
.\apps\spike-a\src\scenarios\test-pgbouncer-auth.ts:1:// Spike A — Scenario 0 (pre-flight): pgbouncer auth smoke
.\apps\spike-a\src\scenarios\test-pgbouncer-auth.ts:2:// SPIKEA2-005 정정: app_tenant_user가 pgbouncer 경로(6433)로 로그인 가능한지 검증
.\apps\spike-a\src\scenarios\test-pgbouncer-auth.ts:10:  console.log("pgbouncer auth smoke (DATABASE_URL_TENANT)");
.\apps\spike-a\src\scenarios\test-pgbouncer-auth.ts:19:  console.log(`pgbouncer-auth: ${isAppTenant ? "PASS" : "FAIL"}`);
.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:44:| `app_public_reader` PostgreSQL role + per-table SELECT policy (cycle1 PSR-05·15 정정) | 신규 D0011 migration 안 instance lookup policy + 6 content table policy 명시 |
.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:54:| env / pgbouncer / role membership cascade (cycle1 PSR-21 정정) | `WEB_PUBLIC_DATABASE_URL` env · `.env.example` · pgbouncer userlist · `app_public_reader NOLOGIN MEMBERSHIP` 등 acceptance checklist |
.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:128:### 3.1 D0011 — `app_public_reader` role + per-table policy (PSR-DATA-01) — cycle1 PSR-05·15 정정
.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:135:-- v0.1 은 LOGIN role 한 개 (`app_public_reader`) 로 단순화 — production 분리 marker.
.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:136:CREATE ROLE app_public_reader LOGIN;
.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:138:GRANT USAGE ON SCHEMA public TO app_public_reader;
.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:143:GRANT SELECT ON instance TO app_public_reader;
.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:148:  TO app_public_reader
.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:157:  TO app_public_reader;
.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:160:  ON clinic_profile FOR SELECT TO app_public_reader
.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:164:  ON location_profile FOR SELECT TO app_public_reader
.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:168:  ON doctor_profile FOR SELECT TO app_public_reader
.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:175:  ON treatment_page FOR SELECT TO app_public_reader
.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:184:  ON article FOR SELECT TO app_public_reader
.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:197:  ON legal_document FOR SELECT TO app_public_reader
.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:205:- (PSR-DATA-02 · cycle1 PSR-05) `app_public_reader` LOGIN — v0.1 단순화. production 단 NOLOGIN + MEMBERSHIP 분리 marker (PSR-DEFER-16 신설).
.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:211:- (PSR-DATA-04) `app_public_reader` 는 audit_event INSERT 권한 없음 — 공개 페이지 access log 는 별도 (CDN / Vercel analytics · PSR-DEFER-10).
.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:215:  - Spike A pgbouncer userlist 에 `app_public_reader` 추가 (PSR-CASCADE-05)
.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:561:| 3 | `apps/web/src/lib/public-db.ts` 신규 — `app_public_reader` connection helper (singleton) | acceptance precondition |
.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:563:| 5 | pgbouncer userlist 에 `app_public_reader` 추가 (`apps/spike-a/...userlist.txt`) | PSR-CASCADE-05 acceptance precondition |
.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:584:| 9 | tenant A 가 `/<tenantB>` 접근 — A 콘텐츠 미노출, B 콘텐츠만 | RLS app_public_reader USING `instance_id` 정합 |
.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:604:| 1 | D0011 migration — `app_public_reader` LOGIN + 7개 policy (instance + 6 content table) | packages/db/migrations/D0011_public_reader.sql |
.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:623:| 20 | Spike A pgbouncer userlist patch (PSR-CASCADE-05) | apps/spike-a/userlist.txt |
.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:635:- `PSR-DEFER-16` (cycle1 PSR-05): `app_public_reader` NOLOGIN + MEMBERSHIP 분리 production 패턴.
.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:666:- `PSR-CASCADE-05`: `apps/spike-a` pgbouncer userlist — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade).
.\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:673:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
.\handoff\codex-reviews\location-legal-code-v1\cycle-1.out.md:3486:docs\decisions\INFRA_DECISIONS_DRAFT.md:471:| 2026-05-15 | (v0.3 비고 이전) | **codex 2차 15 지적 전건 수용 + cascade**: (1) **RLS 실행 모델** — withTenantTransaction 헬퍼·SET LOCAL·worker control/tenant plane 분리·pgBouncer transaction pooling·lint·runtime guard (INFRA2-01), (2) **REVIEW_WORKFLOW cascade — service-role-invoked·instance-switched AuditAction 2종 추가** (INFRA2-02·08), (3) **Phase 0 outbox 옵션 A** — P0에 notifications 최소 subset (Receipt·Log·PayloadRecord·DeliveryAttempt) 포함 (INFRA2-03), (4) **composite FK 3등급 분류** — tenant-plane hard FK·control-plane FK·polymorphic ref typed registry (INFRA2-04), (5) **tenant export/import manifest dependency class** — portable·rebind-required·rotate-required·legal-reapproval-required·external-provider-owned·blob-copy-required·audit-chain-preserved (INFRA2-05), (6) **rate limit taxonomy** — Postgres hard quota·Redis soft cache 분리 (INFRA2-06), (7) **Storage ADR — Cloudflare R2 reversal 권장** (INFRA2-07), (8) **resolveTenantContext** — server-side membership/role/legal eligibility 검증·instance-switched audit (INFRA2-08), (9) **Spike A·B·C gate Week 1** (INFRA2-09), (10) **legal-reviewer fixed-scope package → 시간당 → retainer 단계** (INFRA2-10), (11) **internal beta는 workflow technical validation 한정** (INFRA2-11), (12) **customer domain ADR 별도** (INFRA2-12), (13) **사전심의 manual-assisted workflow** — submission packet export·institutionType enum (INFRA2-13), (14) **PIPA + GDPR checklist** Phase 1 gate (INFRA2-14), (15) **DATA_MODEL C-08 v0.23 cascade — email transport/provider 분리** (INFRA2-15) |
.\apps\spike-a\src\scenarios\test-perf.ts:2:// SPIKEA2-004 정정: 동일 pgbouncer 경로에서 baseline 분리
.\apps\spike-a\src\scenarios\test-perf.ts:36:  // Baseline 2: dbTenant transaction (pgbouncer 경로·RLS deny) — RLS context 없음. 0 rows 반환
.\docs\decisions\PROVIDER_PASS_PLAN.md:16:| Day 9 | A (Multi-tenant RLS) | Supabase Pooler | withTenantTransaction·service_role audit·advisory lock·pgbouncer transaction mode 동등성·prepare:false·max 5 connection limit |
.\docs\decisions\PROVIDER_PASS_PLAN.md:78:- 부분 FAIL → SoT cascade (예: R2 → R2 Workers binding·next-auth → Lucia·Pooler → 별도 pgbouncer)
.\docs\decisions\PHASE0_WEEK1_SPIKES_DRAFT.md:127:| pgBouncer SET LOCAL leak | Supabase Pooler 사용·direct connection·connection-scoped role | INFRA v1.0 §1.1 RLS 실행 모델 | `packages/db` connection layer | 없음 | +3~5일 | solo |
.\apps\spike-b\PROVIDER_RUNBOOK.md:46:pgBouncer transaction pool에서도 row-level locking은 정상 동작. 그러나 transaction이 짧아야 다른 client에 connection share 가능. worker가 long-running task 처리 시 별도 connection 사용 권장 (transaction mode 비추천·session mode 사용).
.\apps\spike-b\README.md:105:| Spike A pgbouncer pooling | 본 Spike는 direct postgres connection만 사용 — pgbouncer transaction pooling 차이는 Spike A에서 검증 | Spike A·Day 9 |
.\apps\spike-a\PROVIDER_RUNBOOK.md:45:- 옵션 B: Supabase support·또는 별도 self-hosted pgbouncer
.\apps\spike-a\PROVIDER_RUNBOOK.md:94:Supabase Pooler transaction mode (port 6543)는 pgBouncer transaction pool — 같은 connection이 여러 client에 share. prepared statement는 connection-scoped라 충돌 발생. postgres-js의 `prepare: false`로 statement caching 비활성화 필수.
.\apps\spike-a\PROVIDER_RUNBOOK.md:97:pgBouncer transaction mode에서 SET LOCAL은 tx scope·session 외 leak 없음. LOCAL docker postgres에서도 동등 동작.
.\apps\spike-a\src\db.ts:15:  prepare: false, // pgbouncer transaction pooling 호환
.\apps\spike-a\src\db.ts:26:// tenant via pgbouncer (6433 — transaction pooling)
.\docs\decisions\INFRA_DECISIONS_DRAFT.md:37:- pgBouncer/connection pooling: **transaction pooling mode 강제** (session pooling 금지 — SET LOCAL이 session-wide면 다른 transaction에 leak)
.\docs\decisions\INFRA_DECISIONS_DRAFT.md:302:| **A. Drizzle + RLS + tenant scoping** (DB only — auth는 E) | withTenantTransaction·SET LOCAL·pgBouncer transaction pooling·invariant 1000 iter | Day 1-2 local·Day 9 provider | local + provider |
.\docs\decisions\INFRA_DECISIONS_DRAFT.md:471:| 2026-05-15 | (v0.3 비고 이전) | **codex 2차 15 지적 전건 수용 + cascade**: (1) **RLS 실행 모델** — withTenantTransaction 헬퍼·SET LOCAL·worker control/tenant plane 분리·pgBouncer transaction pooling·lint·runtime guard (INFRA2-01), (2) **REVIEW_WORKFLOW cascade — service-role-invoked·instance-switched AuditAction 2종 추가** (INFRA2-02·08), (3) **Phase 0 outbox 옵션 A** — P0에 notifications 최소 subset (Receipt·Log·PayloadRecord·DeliveryAttempt) 포함 (INFRA2-03), (4) **composite FK 3등급 분류** — tenant-plane hard FK·control-plane FK·polymorphic ref typed registry (INFRA2-04), (5) **tenant export/import manifest dependency class** — portable·rebind-required·rotate-required·legal-reapproval-required·external-provider-owned·blob-copy-required·audit-chain-preserved (INFRA2-05), (6) **rate limit taxonomy** — Postgres hard quota·Redis soft cache 분리 (INFRA2-06), (7) **Storage ADR — Cloudflare R2 reversal 권장** (INFRA2-07), (8) **resolveTenantContext** — server-side membership/role/legal eligibility 검증·instance-switched audit (INFRA2-08), (9) **Spike A·B·C gate Week 1** (INFRA2-09), (10) **legal-reviewer fixed-scope package → 시간당 → retainer 단계** (INFRA2-10), (11) **internal beta는 workflow technical validation 한정** (INFRA2-11), (12) **customer domain ADR 별도** (INFRA2-12), (13) **사전심의 manual-assisted workflow** — submission packet export·institutionType enum (INFRA2-13), (14) **PIPA + GDPR checklist** Phase 1 gate (INFRA2-14), (15) **DATA_MODEL C-08 v0.23 cascade — email transport/provider 분리** (INFRA2-15) |
.\apps\spike-a\docker-compose.yml:23:  pgbouncer:
.\apps\spike-a\docker-compose.yml:24:    image: edoburu/pgbouncer:latest
.\apps\spike-a\docker-compose.yml:25:    container_name: spike-a-pgbouncer
.\apps\spike-a\docker-compose.yml:30:      - ./pgbouncer/userlist.txt:/etc/pgbouncer/userlist.txt:ro
.\apps\spike-a\docker-compose.yml:31:      - ./pgbouncer/pgbouncer.ini:/etc/pgbouncer/pgbouncer.ini:ro
.\apps\spike-a\package.json:6:  "description": "Spike A — Drizzle + RLS + tenant scoping. withTenantTransaction·SET LOCAL·pgBouncer transaction pooling·1000 iter invariant",
.\apps\spike-a\package.json:13:    "scenario:pgbouncer-auth": "tsx --env-file=.env src/scenarios/test-pgbouncer-auth.ts",
.\apps\spike-a\package.json:22:    "scenario:all": "pnpm scenario:pgbouncer-auth && pnpm seed && pnpm scenario:read && pnpm seed && pnpm scenario:write && pnpm seed && pnpm scenario:rollback && pnpm seed && pnpm scenario:nested && pnpm seed && pnpm scenario:audit && pnpm seed && pnpm scenario:negative && pnpm seed && pnpm scenario:invariant && pnpm seed && pnpm scenario:perf",
.\apps\spike-a\README.md:35:pnpm dotenv -e .env -- pnpm scenario:pgbouncer-auth
.\apps\spike-a\README.md:69:| test-pgbouncer-auth | (pre-flight) app_tenant_user가 pgbouncer 6433 경로로 로그인 가능 검증 |
.\apps\spike-a\scripts\wait-db.js:1:// docker-compose up 후 postgres + pgbouncer가 ready될 때까지 대기
.\apps\spike-a\pgbouncer\pgbouncer.ini:4:[pgbouncer]
.\apps\spike-a\pgbouncer\pgbouncer.ini:8:auth_file = /etc/pgbouncer/userlist.txt

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/PUBLIC_SITE_RENDER_PLAN.md | Select-Object -Skip 343 -First 28' in C:\Users\assag\solution\website-exposure
 succeeded in 663ms:

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

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/PUBLIC_SITE_RENDER_PLAN.md | Select-Object -Skip 373 -First 18' in C:\Users\assag\solution\website-exposure
 succeeded in 605ms:

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

codex
# PUBLIC_SITE_RENDER_PLAN v0.2 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=2 major=4 minor=1 (총 7)
- closeableAfterPatch: false
- 수렴 추세 추적: cycle1=21 (6+11+4) → cycle2=7 (2+4+1)

## cycle 1 patch 검증
- PSR-01: PASS — plan의 10페이지는 `PUBLIC_SITE_RENDER_PLAN.md:42`, `PAGE_TYPES.md:23`, `PAGE_TYPES.md:631-640`과 정합. P-009 제외, P-014 포함, P-010 1샘플.
- PSR-02: PARTIAL — plan은 `/admin/<slug>` 격상을 명시하지만(`PUBLIC_SITE_RENDER_PLAN.md:115-123`), 실제 코드는 아직 `apps/web/src/app/(admin)/[instanceSlug]`이고 root redirect도 `/${result.slug}` (`apps/web/src/app/page.tsx:56`).
- PSR-03: PARTIAL — plan은 site layout fragment만 명시(`PUBLIC_SITE_RENDER_PLAN.md:88`, `:123`, `:271`)했으나 실제 root layout class는 plan의 `bg-canvas text-fg-default`가 아니라 `bg-slate-50 text-slate-900` (`apps/web/src/app/layout.tsx:13`).
- PSR-04: FAIL — robots starter가 SEARCH_STANDARDIZATION §3.3과 entry-by-entry 불일치. 상세 PSR-22.
- PSR-05: PASS — instance lookup policy + content table 6개 + legal 포함 총 7 policy가 명시됨(`PUBLIC_SITE_RENDER_PLAN.md:145-200`).
- PSR-06: PASS — LegalDocument 공개 404/noindex 방침은 명시됨(`PUBLIC_SITE_RENDER_PLAN.md:233-237`, `:328`, `:583`).
- PSR-07: PASS — JSON-LD graph는 SCHEMA_MAPPING §2.5/§3와 대체로 정합. 특히 P-012/P-014는 `SCHEMA_MAPPING.md:654-717`과 맞음.
- PSR-08: PASS — path-based `@id`와 continuity cascade marker가 있음(`PUBLIC_SITE_RENDER_PLAN.md:540`, `:663`).
- PSR-09: PASS — sitemap changefreq/priority 표는 SEARCH_STANDARDIZATION §4.3과 M0 대상 cell 정합(`PUBLIC_SITE_RENDER_PLAN.md:437-446`, `SEARCH_STANDARDIZATION.md:347-362`).
- PSR-10: PARTIAL — og:type은 정합(`PUBLIC_SITE_RENDER_PLAN.md:404`, `:424`; `SEARCH_STANDARDIZATION.md:103-123`)이나 themeColor 출처가 SoT와 불일치. 상세 PSR-23.
- PSR-11: PASS — `/insights/[category]/[slug]`, fallback `general`, PSR-DEFER-15가 명시됨(`PUBLIC_SITE_RENDER_PLAN.md:99`, `:647-648`).
- PSR-12: PASS — `schema.ts` 실 컬럼과 mapping 표가 주요 entry에서 정합. 예: Treatment `title/body_markdown/published_at`는 `schema.ts:170-184`, plan은 `PUBLIC_SITE_RENDER_PLAN.md:296-300`.
- PSR-13: PASS — semantic 22 alias 전체가 표에 있음(`PUBLIC_SITE_RENDER_PLAN.md:347-369`) and DESIGN_TOKENS §3.2 22개와 정합(`DESIGN_TOKENS.md:178-199`).
- PSR-14: PASS — light/dark CSS vars 양쪽 출력 방침 있음(`PUBLIC_SITE_RENDER_PLAN.md:373-388`).
- PSR-15: PASS — instance + 6 content table + LegalDocument 총 7 policy 명시(`PUBLIC_SITE_RENDER_PLAN.md:145-200`).
- PSR-16: PASS — `legal_document` RLS `status='published'`와 DB CHECK `status='draft'` 충돌은 의도된 0-row 공개 차단(`PUBLIC_SITE_RENDER_PLAN.md:192-200`; `LOCATION_LEGAL_PLAN.md:117-121`, `:145-149`).
- PSR-17: PASS — 자체 rule checker LOCAL_PASS, 외부 validator manual QA로 분리(`PUBLIC_SITE_RENDER_PLAN.md:542`, `:652`).
- PSR-18: PASS — scenario #1 문구 “보임” 정정됨(`PUBLIC_SITE_RENDER_PLAN.md:576`).
- PSR-19: PASS — `sanitize-html` 채택 및 PSR-DEFER-17 명시(`PUBLIC_SITE_RENDER_PLAN.md:331-335`, `:643`).
- PSR-20: PASS — rel 값 `nofollow noopener noreferrer` 명시(`PUBLIC_SITE_RENDER_PLAN.md:338`, `:595`).
- PSR-21: PARTIAL — checklist는 분해됐지만 PSR-CASCADE-04/05 실 대상 상태가 불완전. 상세 PSR-25/27.

## new blocking / major / minor (PSR-22+)

### blocking
- PSR-22 — robots.txt starter가 SEARCH_STANDARDIZATION §3.3과 불일치.
  - plan은 `PerplexityBot`을 학습 차단 그룹에 넣음(`PUBLIC_SITE_RENDER_PLAN.md:489`)인데 SoT는 B “AI 검색 인덱싱·답변용 — Allow”(`SEARCH_STANDARDIZATION.md:216`).
  - plan은 `PerplexityBot-User`를 출력(`PUBLIC_SITE_RENDER_PLAN.md:508`)하지만 SoT user-triggered UA는 `Perplexity-User`(`SEARCH_STANDARDIZATION.md:226`).
  - plan에는 `Googlebot`/`Bingbot`이 starter 예시에 없음(`SEARCH_STANDARDIZATION.md:203-209`에는 필요).
  - plan에는 `Bytespider`, `cohere-ai`, `Diffbot`이 추가됨(`PUBLIC_SITE_RENDER_PLAN.md:486-495`)이나 SoT starter에는 없음(`SEARCH_STANDARDIZATION.md:233-248`).
  - 추가로 plan은 enum을 `allowAll`로 표현(`PUBLIC_SITE_RENDER_PLAN.md:460`, `:518`)하지만 SoT enum은 `allow / disallowTraining / disallowAll / custom`(`SEARCH_STANDARDIZATION.md:174-183`).

- PSR-24 — `/admin/<slug>` cascade가 acceptance precondition인데 실제 코드가 아직 구 라우팅이다.
  - plan은 `(admin)/admin/[instanceSlug]` 이동과 sign-in redirect patch를 acceptance precondition으로 둠(`PUBLIC_SITE_RENDER_PLAN.md:115-120`, `:662`).
  - 현재 파일은 `apps/web/src/app/(admin)/[instanceSlug]/...` 아래에 존재하고, root redirect는 여전히 `redirect(\`/${result.slug}\`)` (`apps/web/src/app/page.tsx:56`).
  - 이 상태로는 공개 `/<instanceSlug>`와 기존 어드민 `/<instanceSlug>`가 충돌한다.

### major
- PSR-23 — themeColor 값 출처가 SoT와 다름.
  - plan은 `color.surface.background`를 themeColor로 사용한다고 명시(`PUBLIC_SITE_RENDER_PLAN.md:423`)하고 scenario도 `#f9fafb`를 기대함(`PUBLIC_SITE_RENDER_PLAN.md:596`).
  - SoT는 `BrandTokens.colors.light.primary` / `BrandTokens.colors.dark.primary`, 즉 `color.brand.primary` 평면화 결과(`SEARCH_STANDARDIZATION.md:99`, `DESIGN_TOKENS.md:811-816`, `DESIGN_TOKENS.md:713`).

- PSR-25 — PSR-CASCADE-04 manifest precondition 미적용.
  - plan은 D0011을 manifest 10단계에 추가해야 한다고 명시(`PUBLIC_SITE_RENDER_PLAN.md:565`, `:622`, `:665`).
  - 현재 `packages/migrations-runner/src/manifest.ts`는 LOCATION_LEGAL 9단계만 있고 D0011/public_reader가 없음(`manifest.ts:23-26`, `:93`).

- PSR-26 — Footer가 법적 페이지 링크를 표시하면 전부 404로 연결된다.
  - plan은 Footer에 “법적 페이지 링크”를 넣는다고 함(`PUBLIC_SITE_RENDER_PLAN.md:272`).
  - 동시에 P-013은 v0.1 항상 404라고 함(`PUBLIC_SITE_RENDER_PLAN.md:233-237`, `:328`, `:583`).
  - footer 링크는 LegalDocument 공개 합류 전까지 숨기거나 disabled/운영자 preview 전용으로 분리해야 한다.

- PSR-28 — root layout className 전제가 실제 코드와 다르다.
  - plan은 root layout이 `<body className="bg-canvas text-fg-default">`라고 전제(`PUBLIC_SITE_RENDER_PLAN.md:252`).
  - 실제 root layout은 `bg-slate-50 text-slate-900` (`apps/web/src/app/layout.tsx:13`).
  - site layout fragment만으로는 디자인 토큰 alias 적용과 root/body conflict 검증이 수렴하지 않는다.

### minor
- PSR-27 — PSR-CASCADE-05 파일 경로가 stale.
  - plan은 `apps/spike-a/userlist.txt` 또는 `apps/spike-a/...userlist.txt`를 가리킴(`PUBLIC_SITE_RENDER_PLAN.md:563`, `:623`, `:666`).
  - 실제 repo 경로는 `apps/spike-a/pgbouncer/userlist.txt`가 docker-compose에 mount됨(`apps/spike-a/docker-compose.yml:30`).
  - marker 대상 경로를 정확히 고쳐야 한다.

## acceptance precondition (PSR-CASCADE-01~05) 재점검
- PSR-CASCADE-01: FAIL — code route/sign-in/root redirect/revalidate cascade 미적용. 현재 `(admin)/[instanceSlug]` 구조와 `/${slug}` redirect 잔존.
- PSR-CASCADE-02: TBD — plan marker는 있으나 `SCHEMA_MAPPING.md` §1.2 자체는 아직 domain-only SoT(`SCHEMA_MAPPING.md:52-66`).
- PSR-CASCADE-03: TBD — `M0_BUILD_EXPORT_PLAN.md`는 placeholder 수준이고 본 plan SSR component 재사용 marker는 확인되지 않음.
- PSR-CASCADE-04: FAIL — `manifest.ts`에 D0011 10단계 추가 없음.
- PSR-CASCADE-05: FAIL — 대상 경로 stale + `app_public_reader` userlist 추가 확인 안 됨.
tokens used
128,885
# PUBLIC_SITE_RENDER_PLAN v0.2 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=2 major=4 minor=1 (총 7)
- closeableAfterPatch: false
- 수렴 추세 추적: cycle1=21 (6+11+4) → cycle2=7 (2+4+1)

## cycle 1 patch 검증
- PSR-01: PASS — plan의 10페이지는 `PUBLIC_SITE_RENDER_PLAN.md:42`, `PAGE_TYPES.md:23`, `PAGE_TYPES.md:631-640`과 정합. P-009 제외, P-014 포함, P-010 1샘플.
- PSR-02: PARTIAL — plan은 `/admin/<slug>` 격상을 명시하지만(`PUBLIC_SITE_RENDER_PLAN.md:115-123`), 실제 코드는 아직 `apps/web/src/app/(admin)/[instanceSlug]`이고 root redirect도 `/${result.slug}` (`apps/web/src/app/page.tsx:56`).
- PSR-03: PARTIAL — plan은 site layout fragment만 명시(`PUBLIC_SITE_RENDER_PLAN.md:88`, `:123`, `:271`)했으나 실제 root layout class는 plan의 `bg-canvas text-fg-default`가 아니라 `bg-slate-50 text-slate-900` (`apps/web/src/app/layout.tsx:13`).
- PSR-04: FAIL — robots starter가 SEARCH_STANDARDIZATION §3.3과 entry-by-entry 불일치. 상세 PSR-22.
- PSR-05: PASS — instance lookup policy + content table 6개 + legal 포함 총 7 policy가 명시됨(`PUBLIC_SITE_RENDER_PLAN.md:145-200`).
- PSR-06: PASS — LegalDocument 공개 404/noindex 방침은 명시됨(`PUBLIC_SITE_RENDER_PLAN.md:233-237`, `:328`, `:583`).
- PSR-07: PASS — JSON-LD graph는 SCHEMA_MAPPING §2.5/§3와 대체로 정합. 특히 P-012/P-014는 `SCHEMA_MAPPING.md:654-717`과 맞음.
- PSR-08: PASS — path-based `@id`와 continuity cascade marker가 있음(`PUBLIC_SITE_RENDER_PLAN.md:540`, `:663`).
- PSR-09: PASS — sitemap changefreq/priority 표는 SEARCH_STANDARDIZATION §4.3과 M0 대상 cell 정합(`PUBLIC_SITE_RENDER_PLAN.md:437-446`, `SEARCH_STANDARDIZATION.md:347-362`).
- PSR-10: PARTIAL — og:type은 정합(`PUBLIC_SITE_RENDER_PLAN.md:404`, `:424`; `SEARCH_STANDARDIZATION.md:103-123`)이나 themeColor 출처가 SoT와 불일치. 상세 PSR-23.
- PSR-11: PASS — `/insights/[category]/[slug]`, fallback `general`, PSR-DEFER-15가 명시됨(`PUBLIC_SITE_RENDER_PLAN.md:99`, `:647-648`).
- PSR-12: PASS — `schema.ts` 실 컬럼과 mapping 표가 주요 entry에서 정합. 예: Treatment `title/body_markdown/published_at`는 `schema.ts:170-184`, plan은 `PUBLIC_SITE_RENDER_PLAN.md:296-300`.
- PSR-13: PASS — semantic 22 alias 전체가 표에 있음(`PUBLIC_SITE_RENDER_PLAN.md:347-369`) and DESIGN_TOKENS §3.2 22개와 정합(`DESIGN_TOKENS.md:178-199`).
- PSR-14: PASS — light/dark CSS vars 양쪽 출력 방침 있음(`PUBLIC_SITE_RENDER_PLAN.md:373-388`).
- PSR-15: PASS — instance + 6 content table + LegalDocument 총 7 policy 명시(`PUBLIC_SITE_RENDER_PLAN.md:145-200`).
- PSR-16: PASS — `legal_document` RLS `status='published'`와 DB CHECK `status='draft'` 충돌은 의도된 0-row 공개 차단(`PUBLIC_SITE_RENDER_PLAN.md:192-200`; `LOCATION_LEGAL_PLAN.md:117-121`, `:145-149`).
- PSR-17: PASS — 자체 rule checker LOCAL_PASS, 외부 validator manual QA로 분리(`PUBLIC_SITE_RENDER_PLAN.md:542`, `:652`).
- PSR-18: PASS — scenario #1 문구 “보임” 정정됨(`PUBLIC_SITE_RENDER_PLAN.md:576`).
- PSR-19: PASS — `sanitize-html` 채택 및 PSR-DEFER-17 명시(`PUBLIC_SITE_RENDER_PLAN.md:331-335`, `:643`).
- PSR-20: PASS — rel 값 `nofollow noopener noreferrer` 명시(`PUBLIC_SITE_RENDER_PLAN.md:338`, `:595`).
- PSR-21: PARTIAL — checklist는 분해됐지만 PSR-CASCADE-04/05 실 대상 상태가 불완전. 상세 PSR-25/27.

## new blocking / major / minor (PSR-22+)

### blocking
- PSR-22 — robots.txt starter가 SEARCH_STANDARDIZATION §3.3과 불일치.
  - plan은 `PerplexityBot`을 학습 차단 그룹에 넣음(`PUBLIC_SITE_RENDER_PLAN.md:489`)인데 SoT는 B “AI 검색 인덱싱·답변용 — Allow”(`SEARCH_STANDARDIZATION.md:216`).
  - plan은 `PerplexityBot-User`를 출력(`PUBLIC_SITE_RENDER_PLAN.md:508`)하지만 SoT user-triggered UA는 `Perplexity-User`(`SEARCH_STANDARDIZATION.md:226`).
  - plan에는 `Googlebot`/`Bingbot`이 starter 예시에 없음(`SEARCH_STANDARDIZATION.md:203-209`에는 필요).
  - plan에는 `Bytespider`, `cohere-ai`, `Diffbot`이 추가됨(`PUBLIC_SITE_RENDER_PLAN.md:486-495`)이나 SoT starter에는 없음(`SEARCH_STANDARDIZATION.md:233-248`).
  - 추가로 plan은 enum을 `allowAll`로 표현(`PUBLIC_SITE_RENDER_PLAN.md:460`, `:518`)하지만 SoT enum은 `allow / disallowTraining / disallowAll / custom`(`SEARCH_STANDARDIZATION.md:174-183`).

- PSR-24 — `/admin/<slug>` cascade가 acceptance precondition인데 실제 코드가 아직 구 라우팅이다.
  - plan은 `(admin)/admin/[instanceSlug]` 이동과 sign-in redirect patch를 acceptance precondition으로 둠(`PUBLIC_SITE_RENDER_PLAN.md:115-120`, `:662`).
  - 현재 파일은 `apps/web/src/app/(admin)/[instanceSlug]/...` 아래에 존재하고, root redirect는 여전히 `redirect(\`/${result.slug}\`)` (`apps/web/src/app/page.tsx:56`).
  - 이 상태로는 공개 `/<instanceSlug>`와 기존 어드민 `/<instanceSlug>`가 충돌한다.

### major
- PSR-23 — themeColor 값 출처가 SoT와 다름.
  - plan은 `color.surface.background`를 themeColor로 사용한다고 명시(`PUBLIC_SITE_RENDER_PLAN.md:423`)하고 scenario도 `#f9fafb`를 기대함(`PUBLIC_SITE_RENDER_PLAN.md:596`).
  - SoT는 `BrandTokens.colors.light.primary` / `BrandTokens.colors.dark.primary`, 즉 `color.brand.primary` 평면화 결과(`SEARCH_STANDARDIZATION.md:99`, `DESIGN_TOKENS.md:811-816`, `DESIGN_TOKENS.md:713`).

- PSR-25 — PSR-CASCADE-04 manifest precondition 미적용.
  - plan은 D0011을 manifest 10단계에 추가해야 한다고 명시(`PUBLIC_SITE_RENDER_PLAN.md:565`, `:622`, `:665`).
  - 현재 `packages/migrations-runner/src/manifest.ts`는 LOCATION_LEGAL 9단계만 있고 D0011/public_reader가 없음(`manifest.ts:23-26`, `:93`).

- PSR-26 — Footer가 법적 페이지 링크를 표시하면 전부 404로 연결된다.
  - plan은 Footer에 “법적 페이지 링크”를 넣는다고 함(`PUBLIC_SITE_RENDER_PLAN.md:272`).
  - 동시에 P-013은 v0.1 항상 404라고 함(`PUBLIC_SITE_RENDER_PLAN.md:233-237`, `:328`, `:583`).
  - footer 링크는 LegalDocument 공개 합류 전까지 숨기거나 disabled/운영자 preview 전용으로 분리해야 한다.

- PSR-28 — root layout className 전제가 실제 코드와 다르다.
  - plan은 root layout이 `<body className="bg-canvas text-fg-default">`라고 전제(`PUBLIC_SITE_RENDER_PLAN.md:252`).
  - 실제 root layout은 `bg-slate-50 text-slate-900` (`apps/web/src/app/layout.tsx:13`).
  - site layout fragment만으로는 디자인 토큰 alias 적용과 root/body conflict 검증이 수렴하지 않는다.

### minor
- PSR-27 — PSR-CASCADE-05 파일 경로가 stale.
  - plan은 `apps/spike-a/userlist.txt` 또는 `apps/spike-a/...userlist.txt`를 가리킴(`PUBLIC_SITE_RENDER_PLAN.md:563`, `:623`, `:666`).
  - 실제 repo 경로는 `apps/spike-a/pgbouncer/userlist.txt`가 docker-compose에 mount됨(`apps/spike-a/docker-compose.yml:30`).
  - marker 대상 경로를 정확히 고쳐야 한다.

## acceptance precondition (PSR-CASCADE-01~05) 재점검
- PSR-CASCADE-01: FAIL — code route/sign-in/root redirect/revalidate cascade 미적용. 현재 `(admin)/[instanceSlug]` 구조와 `/${slug}` redirect 잔존.
- PSR-CASCADE-02: TBD — plan marker는 있으나 `SCHEMA_MAPPING.md` §1.2 자체는 아직 domain-only SoT(`SCHEMA_MAPPING.md:52-66`).
- PSR-CASCADE-03: TBD — `M0_BUILD_EXPORT_PLAN.md`는 placeholder 수준이고 본 plan SSR component 재사용 marker는 확인되지 않음.
- PSR-CASCADE-04: FAIL — `manifest.ts`에 D0011 10단계 추가 없음.
- PSR-CASCADE-05: FAIL — 대상 경로 stale + `app_public_reader` userlist 추가 확인 안 됨.
