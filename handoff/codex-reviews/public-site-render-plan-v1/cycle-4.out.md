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
session id: 019e393e-ff8b-7c93-af9f-b720f81bb517
--------
user
You are reviewing **cycle 4** of `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.4. Cycle 3 had 2 findings (0 blocking + 1 major + 1 minor):

| # | severity | title | patch summary |
|---|---|---|---|
| PSR-29 | major | acceptance scenario #21 themeColor stale | `#2563eb` (light) / `#60a5fa` (dark) — BrandTokens.colors.light/dark.primary default |
| PSR-30 | minor | robots.txt SoT line-by-line 정합 | 헤더/일반 룰/C 계열/meta-externalagent 코멘트 + Sitemap `{domain}` placeholder 통일 |

추가 cascade 실 적용:
- `docs/admin/ARCHITECTURE.md` § 3.12 신설 — PSR-CASCADE-01a `apps/web` route group `(admin)` + `(site)` 분리 + `/admin/<slug>` prefix 격상 marker
- `apps/spike-a/pgbouncer/userlist.txt` — `app_public_reader app_public_reader_pw` 추가 (PSR-CASCADE-05)

## Re-review scope (cycle 4)

### Patch 가 적용된 파일
- `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v0.4 (scenario #21 + robots.txt 본문 + 변경 이력 v0.4 entry)
- `docs/admin/ARCHITECTURE.md` § 3.12 (신규)
- `apps/spike-a/pgbouncer/userlist.txt` (1줄 추가)

### 기존 검증 SoT
- `docs/core/SEARCH_STANDARDIZATION.md` § 3.3 (robots.txt 출력 예시 SoT)
- `docs/core/DESIGN_TOKENS.md` § 3.2 + § 6 BrandTokens
- `docs/core/SCHEMA_MAPPING.md` § 1.2 (PSR-CASCADE-02 path-based 표 PASS)
- `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2.1 (PSR-CASCADE-03 SSR 재사용 표 PASS)
- `packages/migrations-runner/src/manifest.ts` (D0011 entry PASS)

## What to check (cycle 4)

1. **cycle 3 patch 완전성**:
   - PSR-29: scenario #21 의 themeColor 기대값 `#2563eb` / `#60a5fa` 가 SoT (DESIGN_TOKENS § 3.2 `color.brand.primary` light=`blue.600` (#2563eb) · dark=`blue.400` (#60a5fa)) 정합
   - PSR-30: PUBLIC_SITE_RENDER_PLAN robots.txt starter 가 SEARCH_STANDARDIZATION § 3.3 출력 예시와 entry-by-entry + comment-by-comment 정합
   - PSR-CASCADE-01a: ARCH § 3.12 신설 → PSR-CASCADE-01a PASS 판정 가능한가
   - PSR-CASCADE-05: userlist.txt 에 `app_public_reader` 항목 추가 → PSR-CASCADE-05 PASS 판정 가능한가

2. **closeableAfterPatch 신호**:
   - 본 cycle blocking=0 + major=0 + minor=0 잔존 → closeableAfterPatch=true (acceptance 신호)
   - minor 1건 잔존 시 다음 cycle 짧게

3. **acceptance precondition (PSR-CASCADE-01~05) 최종**:
   - PSR-CASCADE-01a (docs · plan acceptance commit): 적용?
   - PSR-CASCADE-01b (코드 · 별 code v1.0 cycle): plan acceptance precondition 외 — code v1.0 milestone 의 작업
   - PSR-CASCADE-02 (SCHEMA_MAPPING § 1.2): cycle 3 에서 PASS
   - PSR-CASCADE-03 (M0_BUILD_EXPORT_PLAN § 2.1): cycle 3 에서 PASS
   - PSR-CASCADE-04 (manifest D0011): cycle 3 에서 PASS
   - PSR-CASCADE-05 (pgbouncer userlist): 적용?

4. **새 finding** (있을 경우 PSR-31+ 부터 — 짧게)

## Output format

```
# PUBLIC_SITE_RENDER_PLAN v0.4 — cycle 4 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세 추적: cycle1=21 → cycle2=7 → cycle3=2 → cycle4=N

## cycle 3 patch 검증
- PSR-29: PASS / FAIL / PARTIAL — 근거
- PSR-30: 동일
- PSR-CASCADE-01a (ARCH § 3.12): 동일
- PSR-CASCADE-05 (pgbouncer): 동일

## new blocking / major / minor (PSR-31+)

## acceptance precondition (PSR-CASCADE-01~05) 최종 확정
- 01a: <PASS|FAIL>
- 01b: <plan acceptance 외 — code v1.0 milestone>
- 02: PASS
- 03: PASS
- 04: PASS
- 05: <PASS|FAIL>

## acceptance 판정
- closeableAfterPatch=true: yes/no
- 누계 통계 + plan v1.0 acceptance commit 권고
```

cycle 3 2건 모두 PASS + 새 blocking/major 0 이면 closeableAfterPatch=true. 한국어로 응답.

codex
리뷰 범위가 문서와 설정 파일의 정합성 확인이라, 먼저 관련 파일의 해당 섹션만 읽고 SoT와 줄 단위로 대조하겠습니다. 새 수정은 하지 않고 코드 리뷰 관점으로 findings 여부를 판단합니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"3\\.3|robots\\.txt|Sitemap|ExternalAI|meta-externalagent|OAI-SearchBot|ChatGPT-User|GPTBot|Google-Extended|CCBot\" docs/core/SEARCH_STANDARDIZATION.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "app_public_reader|app_public_reader_pw" apps/spike-a/pgbouncer/userlist.txt' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"3\\.12|PSR-CASCADE-01a|\\(admin\\)|\\(site\\)|/admin/<slug>|route group\" docs/admin/ARCHITECTURE.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"scenario #21|#21|themeColor|robots\\.txt|v0\\.4|PSR-CASCADE-01|PSR-CASCADE-05|PSR-29|PSR-30\" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md" in C:\Users\assag\solution\website-exposure
 succeeded in 679ms:
280:### 3.12 apps/web route group 구조 (PSR-CASCADE-01a · PUBLIC_SITE_RENDER_PLAN v0.x)
282:Phase 0 단계 `apps/web` 안 어드민 + 공개 사이트 두 영역을 같은 Next.js 앱 안 route group 으로 분리한다. PUBLIC_SITE_RENDER_PLAN v0.x § 2.1 의 acceptance precondition cascade.
284:| route group | URL prefix | 책임 | 진입 단계 |
286:| `(admin)` | `/admin/<instanceSlug>/...` | 운영자 어드민 — ClinicProfile · DoctorProfile · TreatmentPage · Article · LegalDocument 입력/편집 | ADMIN_UI_SKELETON code v1.0 합류 (현재 `/<instanceSlug>/...` → `/admin/<instanceSlug>/...` 격상 cascade는 PUBLIC_SITE_RENDER code v1.0 cycle 안 동반 — PSR-CASCADE-01b) |
287:| `(site)` | `/<instanceSlug>/...` | 공개 사이트 — Home · About · Doctors · Treatments · Insights (1샘플) · Contact · Locations · Legal (v0.x 차단) | PUBLIC_SITE_RENDER code v1.0 합류 (M0 게이트 #1 사이트 측 페이지 빌드 가능 단계) |
289:**격상 의도**: 어드민 `/<slug>` 와 공개 `/<slug>` 가 같은 path namespace 를 공유하면 충돌. 본 격상으로 `(admin)` 은 `/admin/<slug>` · `(site)` 는 `/<slug>` 로 분리. M0 v1.0 도메인 매핑 (PSR-DEFER-02) 합류 시 어드민 도메인 (`app.glitzy.co`) 분리 가능 — 그 시점에 `/admin` prefix 유지 또는 제거 결정.

 succeeded in 697ms:
7:> **목적**: Core가 빌드 시 출력하는 검색 표준 산출물 — 메타 태그·robots.txt·sitemap.xml·canonical 처리·성능 기준 — 의 단독 구현 가능한 명세.
19:- Core가 빌드 시 자동 생성하는 **5개 표준 산출물**: head 메타 태그·robots.txt·sitemap.xml·canonical URL·성능 budget.
21:- robots.txt는 **AI 크롤러 정책을 인스턴스 단위로 명시적 결정 — `aiCrawlerPolicy` required (미설정 시 빌드 fail)**. enum: `allow | disallowTraining | disallowAll | custom`. **`allow`는 법무 승인 플래그 `aiCrawlerLegalApproved: true` 필수 (fail-gate)**, 다른 정책은 승인 기록 권장. starter template은 `disallowTraining` 제안 — 검색·답변 노출 유지하면서 학습 데이터 사용 차단.
35:| robots.txt 자동 생성 | ✅ | |
47:- **robots.txt**: 플레인 텍스트 — 사이트 루트 (`/robots.txt`)
130:- `noIndex: true`인 페이지는 sitemap 자동 제외 + `<meta name="robots" content="noindex, follow">` 출력 + robots.txt 차단 안 함 (§ 3.3.1 noIndex 원칙 정합)
151:## 3. robots.txt 표준
160:| **B. AI 검색 인덱싱·답변용** | `OAI-SearchBot` (ChatGPT 검색용) / `PerplexityBot` (Perplexity 검색용) / `Claude-SearchBot` (Anthropic 검색용) | AI 답변·검색에서 사이트를 발견·인용하기 위한 인덱싱 크롤러 | OpenAI publisher FAQ; Perplexity crawlers; Anthropic crawler help |
161:| **C. User-triggered fetch** | `ChatGPT-User` (사용자 GPT 요청 시 fetch) / `Perplexity-User` (사용자 Perplexity 요청 시 fetch) / `Claude-User` (사용자 Claude 요청 시 fetch) | **사용자 직접 요청**에 의해 페이지를 fetch. 제품별 robots.txt 해석·우선순위가 일반 크롤러와 다를 수 있으므로 **차단 보장 수단으로 보지 않음** (각 제품 공식 문서 확인 권장) | 동일 공식 출처 |
162:| **D. AI 학습·모델 개선용** | `GPTBot` (OpenAI 학습) / `ClaudeBot` (Anthropic 학습/모델 개선) / `Google-Extended` (Google Gemini 학습) / `CCBot` (Common Crawl, LLM 학습 데이터) / `anthropic-ai` (Anthropic legacy·alias로 추정) / `meta-externalagent` (Meta — 외부 관측 기반, 공식 문서 재검증 필요) | 모델 학습 데이터 수집 | OpenAI publisher FAQ; Anthropic crawler help; **Google-Extended controls (overview-google-crawlers)**; Common Crawl; (meta-externalagent는 외부 관측 기반) |
170:> - Google robots.txt spec — https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt
171:> - Google-Extended controls — https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers (google-extended 섹션)
185:> **C 계열 (User-triggered fetch) 주의**: 제품별 robots.txt 해석 정책이 일반 검색·학습 크롤러와 다를 수 있음. `disallowAll`을 선택해도 **C 계열에 대한 완전 차단을 보장하는 수단으로 보지 않는다** — 각 제품 공식 문서·고객지원 채널 확인 권장.
188:### 3.3 정책별 출력 예시
193:# robots.txt — 자동 생성 by Glitzy Core (SEARCH_STANDARDIZATION § 3)
213:User-agent: OAI-SearchBot
223:User-agent: ChatGPT-User
233:User-agent: GPTBot
239:User-agent: Google-Extended
242:User-agent: CCBot
248:# meta-externalagent는 experimentalAiBots=true 시에만 추가 (외부 관측 기반·공식 검증 전)
250:Sitemap: https://{domain}/sitemap.xml
253:> `InstanceManifest.experimentalAiBots: true`(default `false`)일 때만 `meta-externalagent` 등 외부 관측 기반 user-agent가 robots.txt에 포함된다. 공식 검증된 user-agent만 기본 출력.
263:### 3.3.1 robots.txt 룰 (Allowed / Blocked / Conditional)
270:| 미발행 드래프트 차단 | (sitemap에서 제외 + 라우트 자체 없음) | robots.txt에서 별도 명시 안 함 |
271:| **`noIndex: true` 페이지를 robots.txt에서 Disallow** | **Blocked** (Core 룰) | **robots.txt로 차단하면 크롤러가 meta noindex를 읽지 못함**. noIndex 페이지는 robots.txt 차단 X + sitemap 제외 + `<meta name="robots" content="noindex, follow">`로 처리 (참고: Google robots.txt intro) |
518:### 7.2 Sitemap 제출
520:- robots.txt에 `Sitemap:` 라인 자동 출력 — 검색 엔진 자동 발견
537:| **fail** | 빌드 실패 | title·description·canonical 누락, robots.txt 전체 차단, sitemap 출력 실패, Lighthouse Performance < 60 등 |
554:| SS-01 | robots.txt 신규 AI 크롤러 갱신 — **주기는 분기 1회로 결정**. 미정인 부분: 재검증 책임자(Glitzy Core 팀 vs 운영자) / 업데이트 PR 흐름(Core 패키지 MINOR 릴리즈 vs 인스턴스 robotsOverrides) | 운영 프로세스 결정 |
574:| 2026-05-14 | v0.1 | 최초 작성 — 메타 태그 표준(28종), robots.txt(AI 크롤러 화이트리스트), sitemap.xml(페이지별 changefreq/priority), canonical resolve 우선순위, 성능 기준(빌드 lab + 운영 field), Core 인터페이스 vs analytics-reporting 모듈 책임 분리, 빌드 검증 룰 레벨 |
576:| 2026-05-14 | v0.3 | **AI 크롤러 정책 정밀화·environment 분기** (피드백 8건): (1) **§ 3.1 AI 크롤러 3계열 분리** — A 검색 색인 / B AI 검색·답변용 / C AI 학습. **OAI-SearchBot·Perplexity-User·Bingbot·meta-externalagent 추가**, (2) **Google-Extended를 C 학습 계열로 정리** (이전 잘못된 A 분류 정정), (3) **§ 3.2 `aiCrawlerPolicy` required, 미설정 시 빌드 fail** — Core 자동 적용 기본값 없음. starter template만 `disallowTraining` 제안, (4) **§ 2.1 `<html lang>` ko-KR 그대로 출력** — normalize 제거. BCP 47 유효, 지역 정보 보존, (5) DATA_MODEL ogType cascade 이미 적용됨(v0.10 — 사용자 시점차), (6) **§ 3.3.1 noIndex vs robots.txt 원칙 명시** — robots.txt 차단 X + sitemap 제외 + meta noindex (참고: Google robots.txt intro), (7) **§ 2.3 publisher 검증 분리** — head meta에는 article:publisher 없음 → JSON-LD `Article.publisher`로 강제(SCHEMA_MAPPING § 3 P-010 책임). § 2.3는 article:published_time/modified_time/author만, (8) **§ 3.3.1 environment 분기** — production은 전체 차단 Blocked, staging/preview는 Allowed (Basic Auth 권장. `InstanceManifest.environment` 기반) |
577:| 2026-05-14 | v0.4 | **AI 봇 분류 정확화** (피드백 8건): (1) **§ 0 요약 정정** — "Core 기본 allow" 잔재 제거, `required·미설정 fail`로 통일, (2) **Anthropic 봇 분류 정정** — `ClaudeBot`을 D 학습 계열로, `Claude-SearchBot`을 B 검색 인덱싱, `Claude-User`를 C user-triggered로. `anthropic-ai`는 legacy/alias 주석, (3) **OpenAI `ChatGPT-User` 추가** — C user-triggered 계열, (4) **3계열 → 4계열 재구성** — A 일반 검색 / B AI 검색 인덱싱 / **C User-triggered fetch** / D AI 학습. C 계열은 robots.txt 무시 가능성 주의, (5) **공식 출처 URL 명시** — 각 user-agent에 OpenAI publisher FAQ·Anthropic crawler help·Perplexity crawlers·Google robots-meta 참조. `meta-externalagent`는 외부 관측 기반 표기. 분기 1회 재검증 책임 명시, (6) **§ 0·§ 2.1 og:type 잔재 정정** — P-004 profile·P-006/P-008/P-010 article·나머지 website, (7) **SCHEMA_MAPPING § 1.5 `<html lang="ko">` → `<html lang="ko-KR">` cascade 정합**, (8) **법무 승인 플래그 룰 완화** — `allow`만 fail-gate, 다른 정책은 승인 기록 권장(warning 수준) |
578:| 2026-05-14 | v0.5 | **C-08 InstanceManifest cascade·미세 정합** (피드백 6건): (1) **DATA_MODEL C-08에 8개 필드 추가** — `environment`·`aiCrawlerPolicy`·`aiCrawlerLegalApproved`·`aiCrawlerApprovedBy/At`·`robotsOverrides`·`experimentalAiBots`·`performanceBudget`·`searchConsoleVerification` + `RobotsOverride`·`PerformanceBudget` 하위 타입 신설. **본 문서가 단독 구현 가능한 명세로 작동**, (2) **§ 2.3 `PageMeta.noIndex` vs `robots` 우선순위 명시** — noIndex 항상 우선, 충돌 시 warning, (3) **§ 2.3 P-006/P-008 modified_time fallback** — `TreatmentPage.dateModified`/`MedicalConditionPage.dateModified` 또는 공통 `@updatedAt`로 fallback, (4) **§ 3.4 custom 예시 정정** — **`aiCrawlerPolicy: allow` 기반** PerplexityBot 일부 경로 차단(`/reviews`·`/pricing`) 예시로 교체, (5) **§ 7.3 analytics-reporting 후속 문서 안내** — `docs/features/` 디렉터리 미생성 명시, (6) **§ 3.3 meta-externalagent를 `experimentalAiBots`로 분리** — 공식 검증 전 user-agent는 별도 플래그 활성화 시에만 robots.txt 포함 |
579:| 2026-05-14 | v0.6 | **룰·게이트·참고 URL 미세 정합** (피드백 5건): (1) **§ 2.3 P-006/P-008 modified_time 룰 정확화** — "명시적 dateModified 부재로 공통 `@updatedAt` fallback 사용" warning. modified_time 출력 자체는 누락 안 됨. C-11 풀명세 시 dateModified 추가 검토 명시, (2) v0.5 변경 이력 정정 — "disallowTraining 기반" → "**`aiCrawlerPolicy: allow` 기반**" PerplexityBot 일부 경로 차단 예시, (3) **DATA_MODEL C-08 cascade — `aiCrawlerApprovedBy/At`을 `aiCrawlerPolicy: allow` 시 required로 격상** (감사 추적 게이트 강화), (4) **DATA_MODEL C-08 PerformanceBudget 확장** — `imageWeightKbOverride`·`lighthouseSeoMinOverride`·`lighthouseAccessibilityMinOverride` 추가 (§ 6.1 budget 항목 모두 override 가능), (5) **§ 3.1 Google 참고 URL 정정** — robots.txt spec + Google-Extended 문서로 교체. robots-meta-tag는 noindex 등 별도 참조로 분리 |
580:| 2026-05-14 | v0.7 | **잔여 문구·표 정합** (피드백 5건): (1) **§ 3.1 표 D 계열 출처 정정** — "Google search-console robots-meta" → "**Google-Extended controls (overview-google-crawlers)**" (Google 봇 분류 근거 정확화), (2) **§ 4.4 sitemap lastmod 출처 분리** — P-010 Article은 `Article.dateModified`, P-006·P-008은 명시 필드 부재 시 `@updatedAt` (§ 2.3 정합), (3) **§ 2.1 메타 태그 출처 칸 세분화** — `article:published_time`·`modified_time`·`author`를 P-006/P-008/P-010별로 분리 명시. P-010 fail/P-006·P-008 conditional fallback 차등, (4) **v0.6 변경 이력 "6건 → 5건" 오기 수정**, (5) **§ 6.1 강화 판정 방향 명시** — max 계열(LCP·CLS·TBT·bundle·image)은 작을수록 강화, min score 계열(Performance·SEO·Accessibility)은 클수록 강화. 반대 방향 입력 시 빌드 실패 |
581:| 2026-05-14 | v0.8 | **OG article 메타 범위 정밀화** (피드백 4건): (1) **§ 2.1 `article:published_time`을 P-010 전용으로 좁힘** — P-006/P-008은 `@createdAt`을 공개 발행일로 매핑하기 부자연스러움. 미출력, (2) **§ 2.1 `article:section`도 P-010 전용** — P-006/P-008은 ArticleCategory 개념 없음. `article:modified_time`·`article:author`만 P-006/P-008에 conditional 적용, (3) **SS-04 미결정 해소 표시** — PerformanceBudget 강화 override 범위는 v0.6/v0.7에서 결정 완료, (4) **§ 3.1·§ 3.2 C 계열 표현 완화** — "robots.txt를 일반 크롤러처럼 따르지 않을 수 있음" → "**제품별 robots.txt 해석·우선순위가 일반 크롤러와 다를 수 있으므로 차단 보장 수단으로 보지 않음**" (법무·운영 문서 톤) |
582:| 2026-05-14 | v0.9 | **잔여 정합·warning 의미 좁힘** (피드백 4건): (1) **§ 3.3 disallowAll C 계열 표현 통일** — "사용자 직접 요청 시 무시 가능성" → "**차단 보장 수단으로 보지 않음**" (§ 3.1·§ 3.2와 톤 일치), (2) **§ 2.3 P-006/P-008 fallback warning 의미 좁힘** — `@updatedAt` fallback 사용 자체는 **정상 동작 (silent)**. warning은 **명시 `dateModified` 필드 도입 후 값 부재**에만 적용 (`@updatedAt` resolve 실패는 fail로 별도), (3) **§ 2.3 P-010 `article:section` 누락 검증 룰 추가** — warning (콘텐츠 분류 신호 약화), (4) **§ 9 미결정 표에서 SS-04 제거** + **§ 9.1 "해소된 미결정" 별도 서브섹션 신설** — 가독성·운영자 혼란 회피 |

 succeeded in 704ms:
1:# 공개 사이트 렌더 minimal plan (v0.4·draft·2026-05-18)
3:> **상태**: **v0.4 (draft)** — Codex 자동 비평 cycle 1+2+3 (30 findings: 8 blocking + 16 major + 6 minor) 전건 수용 patch. 누계 수렴 추세 21 → 7 → 2. 5 LL-CASCADE 중 4 PASS (01a docs 적용 · 02·03·04 적용 · 05 pgbouncer 적용). 01b (코드 cascade) 는 별 code v1.0 cycle 분리. ADMIN_UI_SKELETON code v1.0 + LOCATION_LEGAL code v1.0 acceptance 직후 진입하는 첫 공개 사이트 plan. 본 plan 은 운영자(어드민)가 입력·저장한 콘텐츠를 실 클라이언트가 보는 공개 사이트로 렌더링 하는 minimal 흐름을 정의한다.
13:- `docs/core/SEARCH_STANDARDIZATION.md` — § 2 메타 태그 표준 (theme-color · og:type 매핑) · § 3 robots.txt (aiCrawlerPolicy + 4계열 user-agent + disallowTraining starter) · § 4.3 sitemap changefreq/priority · § 5 canonical resolve.
26:  - `apps/web/src/app/sign-in/...` (consume route — redirect target `/<firstSlug>` → `/admin/<firstSlug>` 로 patch · PSR-CASCADE-01)
41:| **어드민 URL prefix `/admin/<instanceSlug>/...`** (cycle1 PSR-02 격상) | 공개 path namespace 와 분리. acceptance precondition. 코드 cascade (PSR-CASCADE-01) 동시 적용 |
48:| Next metadata API + theme-color + og:type 매핑 (cycle1 PSR-10 정정) | title · description · canonical · OpenGraph · Twitter · robots · `themeColor` 2값 (light/dark) · og:type P-004 `profile`, P-006/P-010 `article`, 기타 `website` |
49:| sitemap.xml · robots.txt (cycle1 PSR-04·09 정정) | per-instance · SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` required + § 4.3 changefreq/priority SoT 정합 |
105:│     ├─ robots.txt/route.ts             -- per-instance robots
107:├─ sign-in/...                           -- (변경: consume redirect target `/admin/<slug>` · PSR-CASCADE-01)
215:  - Spike A pgbouncer userlist 에 `app_public_reader` 추가 (PSR-CASCADE-05)
416:  themeColor: [
424:- (PSR-SEO-02 · cycle1 PSR-10 + cycle2 PSR-23 정정) `themeColor` 2값 출처 — DESIGN_TOKENS § 6 `BrandTokens.colors.light.primary` / `BrandTokens.colors.dark.primary` (= `color.brand.primary` 의 light/dark 평면화 결과). 인스턴스별 brandTokens 미주입 단계 (v0.1) 는 DESIGN_TOKENS § 3.2 default `color.brand.primary` light = `blue.600` (#2563eb) / dark = `blue.400` (#60a5fa) fallback. SEARCH_STANDARDIZATION § 2.1 정합.
456:### 5.3 robots.txt — cycle1 PSR-04 정정 (PSR-SEO-08)
458:- `apps/web/src/app/(site)/[instanceSlug]/robots.txt/route.ts` — Next Route Handler.
468:# robots.txt — 자동 생성 by Glitzy Core (SEARCH_STANDARDIZATION § 3)
579:| 5 | pgbouncer userlist 에 `app_public_reader` 추가 (`apps/spike-a/...userlist.txt`) | PSR-CASCADE-05 acceptance precondition |
584:| 10 | LOCATION_LEGAL code v1.1 cascade — admin URL 변경 (PSR-CASCADE-01) 의 revalidatePath 6 곳 patch | acceptance precondition |
585:| 11 | ADMIN_UI_SKELETON code v1.1 cascade — sign-in/consume redirect `/admin/<slug>` (PSR-CASCADE-01) | acceptance precondition |
603:| 12 | `/<instanceSlug>/robots.txt` 응답 | SEARCH_STANDARDIZATION § 3 v0.1 starter `disallowTraining` 정합 (학습 봇 Disallow + 답변 봇 Allow + Naver Yeti Allow) |
606:| 15 | 어드민 측 도메인 (`/admin/<slug>/...`) 와 공개 도메인 (`/<slug>/...`) 충돌 없음 — PSR-CASCADE-01 정합 | 어드민 prefix `/admin` · 공개 prefix 없음. sign-in consume redirect `/admin/<firstSlug>` |
612:| 21 | Next metadata API `themeColor` 2값 (light + dark) 출력 — cycle1 PSR-10 + cycle3 PSR-29 정정 | `<meta name="theme-color" media="(prefers-color-scheme: light)" content="#2563eb">` (= `BrandTokens.colors.light.primary` default · `color.brand.primary` light) + `<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#60a5fa">` (dark). 인스턴스별 brandTokens 주입 시 override |
631:| 12 | Next metadata API (페이지별 generateMetadata · themeColor · og:type) | 각 page.tsx 안 |
632:| 13 | sitemap.xml + robots.txt route handler (SEARCH_STANDARDIZATION 정합) | apps/web/src/app/(site)/[instanceSlug]/{sitemap.xml,robots.txt}/route.ts |
634:| 15 | **어드민 URL `/admin` prefix 격상 (PSR-CASCADE-01)** | apps/web/src/app/(admin)/admin/[instanceSlug]/ 디렉토리 이동 + revalidatePath 6 곳 + sign-in/consume redirect target + seed.ts |
635:| 16 | docs/admin/ARCHITECTURE.md § 3 patch — `(site)` 신설 + `/admin` prefix (PSR-CASCADE-01) | doc |
639:| 20 | Spike A pgbouncer userlist patch (PSR-CASCADE-05 · cycle2 PSR-27 경로 정정) | apps/spike-a/pgbouncer/userlist.txt |
676:> **acceptance 순서 정합 (LL-33 패턴)**: PSR-CASCADE-01~05 는 plan v1.0 acceptance 와 **동시 또는 직전** 에 적용. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
678:- `PSR-CASCADE-01` (cycle1 PSR-02 격상 + cycle2 PSR-24 a/b 분리):
679:  - **PSR-CASCADE-01a (docs · plan acceptance commit 안 동반)**: `docs/admin/ARCHITECTURE.md` § 3 patch — `(site)` 신설 + `/admin` prefix 격상 marker.
680:  - **PSR-CASCADE-01b (코드 · 별 code v1.0 cycle 로 분리 · LOCATION_LEGAL 패턴 정합)**: `apps/web` 디렉토리 이동 (`(admin)/[instanceSlug]/` → `(admin)/admin/[instanceSlug]/`) + `apps/web/src/app/page.tsx` root redirect target `/<firstSlug>` → `/admin/<firstSlug>` + revalidatePath 6 곳 (clinic-profile · doctors · treatments · articles · ... 각 actions.ts) + `apps/web/src/app/sign-in/consume/route.ts` redirect + `apps/web/src/seed.ts` 안 시드 데이터 정합 + Tailwind v0.2 className 전환 (PSR-28). **acceptance precondition = plan v1.0 acceptance ≠ code v1.0 acceptance** — LOCATION_LEGAL 의 plan v1.0 / code v1.0 분리 패턴과 동일. 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 에서 별도 사이클 진행.
684:- `PSR-CASCADE-05` (cycle2 PSR-27 경로 정정): `apps/spike-a/pgbouncer/userlist.txt` — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade). 본 파일은 `apps/spike-a/docker-compose.yml` 의 pgbouncer 컨테이너에 mount 되는 정확 경로.
691:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
692:| 2026-05-18 | v0.4 | **Codex 비평 cycle 3 2 findings (0 blocking + 1 major + 1 minor) 전건 수용 patch**: (PSR-29) acceptance scenario #21 themeColor 기대값 stale 정정 — `BrandTokens.colors.light.primary` default `#2563eb` (light) / `#60a5fa` (dark). (PSR-30) robots.txt starter SoT line-by-line 정합 — 헤더/일반 룰/C 계열/meta-externalagent 코멘트 + Sitemap placeholder `{domain}` 통일 (SEARCH_STANDARDIZATION § 3.3 그대로). 추가 cascade 실 적용: docs/admin/ARCHITECTURE.md § 3.12 신설 (PSR-CASCADE-01a — apps/web route group `(admin)` + `(site)` 분리). apps/spike-a/pgbouncer/userlist.txt 에 `app_public_reader` 추가 (PSR-CASCADE-05). 누계 cycle 1+2+3 = 30 findings 전건 수용. 5 cascade 중 4 PASS, 01b 는 별 code v1.0 cycle. |
693:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |

 succeeded in 721ms:
3:"app_public_reader" "app_public_reader_pw"

codex
검색 결과상 핵심 표시는 모두 들어가 있습니다. 이제 robots.txt 본문과 SoT 예시를 원문 블록 단위로 비교해서 PSR-30 잔여 차이를 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/PUBLIC_SITE_RENDER_PLAN.md | Select-Object -Skip 410 -First 90' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/core/SEARCH_STANDARDIZATION.md | Select-Object -Skip 188 -First 65' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/core/DESIGN_TOKENS.md | Select-Object -Skip 0 -First 220' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content apps/spike-a/pgbouncer/userlist.txt' in C:\Users\assag\solution\website-exposure
 succeeded in 769ms:

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

 succeeded in 694ms:
"postgres" "postgres"
"app_tenant_user" "app_tenant_pw"
"app_public_reader" "app_public_reader_pw"

 succeeded in 780ms:
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
  - § 3.1: AI 크롤러 분류 4계열 (전통 SEO · 학습 봇 · 답변 봇 · 네이버 AI).
  - § 3.2: `aiCrawlerPolicy` enum **required** (`disallowTraining` / `allowAll` / `allowApprovedOnly` / `custom`) — 미설정 시 빌드 fail.
  - § 3.3: 정책별 출력 예시 + 법무 승인 필드 3종 required (`legalApprovalAt` · `legalApprovedBy` · `legalApprovalNote`) for `allowAll`.

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


 succeeded in 760ms:
# Core — 디자인 토큰

> **상태**: **v1.0 구현 명세 안정판** (codex 자동 비평 5차 사이클 마감)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 4, § 9
> **목적**: Core가 정의하는 디자인 토큰 표준 — 토큰 분류(primitive·semantic·component), 색상·타이포·간격·라운드·그림자·모션·컴포넌트 토큰 카탈로그, 출력 형식(CSS·JSON), Preset/Instance override 인터페이스, 접근성 기준, 빌드 검증을 단독 구현 가능한 명세로 정의.
> **외부 공유 시 주의**: 상위 문서와 동일.
> **연관 문서**:
> - 페이지 타입·헤딩 위계 → `core/PAGE_TYPES.md` § 2.1
> - 콘텐츠 블록 표준(콜아웃·인용·표) → `core/CONTENT_STANDARDS.md` § 3
> - 메타·sitemap → `core/SEARCH_STANDARDIZATION.md`
> - 어드민 화면 토큰 흐름 → `docs/admin/ARCHITECTURE.md` (후속)

---

## 0. 한 페이지 요약

- **3-tier 토큰 구조**: primitive(원시값) → semantic(의미) → component(컴포넌트 매핑). **색상·shadow component**는 semantic 참조 의무(primitive 직접 참조 fail). typography·spacing·radius·motion은 primitive 직접 참조 허용 (§ 2.4 참조 규칙 표)
- **3-레이어 override**: Core(기본 카탈로그) → Preset(업종 카테고리 — 한의·치과·종합병원 등) → Instance(개별 클라이언트)
- **출력 형식 2종**: (a) CSS Custom Properties (`:root`·`[data-theme="dark"]`), (b) `tokens.json` (Style Dictionary 호환 — 빌드 도구 변환 가능)
- **다크모드**: 기본 light + dark 2개 테마. semantic 단계에서 분기, primitive·component는 동일
- **접근성**: WCAG 2.1 AA 명도 대비(텍스트 4.5:1·UI 3:1) + 포커스 표시 의무
- **빌드 검증**: 토큰 미정의(체인 단절)·순환 참조·접근성 위반·**색상/shadow component에서 primitive 직접 참조** 시 fail (typography·spacing·radius·motion의 primitive 직접 참조는 § 2.4 허용)

---

## 1. 일반 규약

### 1.1 변경 정책

| 변경 유형 | 버전 영향 | 비고 |
|---|---|---|
| primitive 값 변경 (색상·크기) | **MAJOR** | semantic·component 전반 영향 — 마이그레이션 가이드 필수 |
| primitive 추가 | MINOR | |
| semantic 토큰 추가 | MINOR | |
| semantic 토큰 값 변경 (primitive 참조 교체) | **MAJOR** | UI 시각 변경 가능 |
| component 토큰 추가·변경 | MINOR | |
| 컴포넌트 → semantic 매핑 변경 | MINOR | |
| 출력 형식·파일 위치 변경 | **MAJOR** | 빌드 도구 정합성 |

### 1.2 SoT 원칙

- 본 문서 = **토큰 카탈로그·매핑 SoT** (사람 가독)
- **기계 처리 SoT — 4파일 구조** (`data/design-tokens/`):
  - `primitive.tokens.json` (테마 무관 원시값)
  - `semantic.light.tokens.json` (semantic — light 테마)
  - `semantic.dark.tokens.json` (semantic — dark 테마)
  - `component.tokens.json` (테마 무관, semantic 참조)
- Preset·Instance override 토큰 파일은 동일 4파일 구조를 따른다 (`presets/<presetSlug>/design-tokens/*.json`·`instances/<instanceId>/design-tokens/*.json`)
- 빌드 결과 — `dist/tokens/<theme>.css` + `dist/tokens/<theme>.json`

### 1.3 본 문서가 다루지 않는 영역

- 컴포넌트 시각 디자인 사양 (Figma 등 외부) — 본 문서는 토큰 인터페이스만
- 페이지별 레이아웃 — `core/PAGE_TYPES.md` § 2
- 의료광고법 표현 룰 — `core/CONTENT_STANDARDS.md` § 4

---

## 2. 토큰 분류 (3-tier)

### 2.1 primitive (원시값)

브랜드·시각 의미 없이 색상·크기·간격의 **원시값**만 보관. 다크모드·테마와 무관.

```
color.white·color.black                           (절대값)
color.gray.50    ~ color.gray.900                  (10단계)
color.blue.50    ~ color.blue.900                  (10단계)
color.green.50   ~ color.green.900                 (10단계)
color.amber.50   ~ color.amber.900                 (10단계)
color.red.50     ~ color.red.900                   (10단계)
font.size.12·14·16·18·20·24·30·36·48·60·72         (11단계 — § 4.2 표 SoT)
font.weight.regular·medium·semibold·bold
line.height.tight·normal·loose
letter.spacing.tight·normal·wide
spacing.0·1·2·3·4·6·8·12·16·24·32·48·64           (13단계 — § 5.1 표 SoT)
breakpoint.sm·md·lg·xl·2xl                         (§ 5.2)
radius.0·sm·md·lg·xl·full                          (§ 6.1)
border.width.thin·medium·thick                     (§ 6.3)
duration.fast·normal·slow                          (§ 7.1)
easing.linear·in·out·in-out                        (§ 7.2)
```

> `shadow.*`는 **semantic 단계**에서 정의 (§ 6.2 theme-aware). primitive에 두지 않음.
> `container.*`는 semantic 단계 (§ 5.3) — primitive `breakpoint.*` + `spacing.*` 참조.

### 2.2 semantic (의미)

primitive를 참조하여 **사용 맥락**을 의미화. 다크모드 분기 지점.

```
color.surface.background  → light: color.gray.50,  dark: color.gray.900
color.text.primary        → light: color.gray.900, dark: color.gray.50
color.text.secondary      → light: color.gray.600, dark: color.gray.300
color.brand.primary       → color.blue.600 (Preset/Instance override)
color.status.success      → color.green.600
color.status.warning      → color.amber.500
color.status.error        → color.red.600
color.status.info         → color.blue.500
...
```

### 2.3 component (컴포넌트 매핑)

semantic을 참조하여 **컴포넌트 단위 토큰** 정의. 컴포넌트 구현은 본 토큰만 참조.

```
button.primary.background       → color.brand.primary
button.primary.text             → color.text.inverse
button.primary.hover.background → color.brand.primary.hover
...
card.background                  → color.surface.elevated
card.border                      → color.border.subtle
...
callout.info.background          → color.status.info.subtle
callout.warning.background       → color.status.warning.subtle
callout.disclaimer.background    → color.surface.subtle
```

### 2.4 참조 규칙

토큰 영역별로 의무 강도가 다르다:

| 영역 | component 층 참조 규칙 |
|---|---|
| **색상** (`color.*`) | semantic 의무. primitive 직접 참조 시 빌드 fail (다크모드·테마 분기 보장) |
| **타이포** (`font.*`, `line.height.*`, `letter.spacing.*`) | semantic(예: `typography.body.default`) 또는 primitive 모두 허용 |
| **간격** (`spacing.*`) | primitive 직접 참조 허용 (semantic 간격 토큰 없음) |
| **라운드·테두리** (`radius.*`, `border.width.*`) | primitive 직접 참조 허용 |
| **그림자** (`shadow.*`) | semantic 의무. 다크모드 분기 보장 (§ 6.2 정합) |
| **모션** (`duration.*`, `easing.*`) | primitive 직접 참조 허용 |

- semantic → primitive 또는 다른 semantic 참조
- 순환 참조 fail (DAG 강제)
- component → component 참조 금지 (수평 참조 불가)

---

## 3. 색상 토큰

### 3.1 primitive 색상 팔레트

각 hue는 50·100·200·300·400·500·600·700·800·900 (10단계) + 절대값 2종(`color.white`, `color.black`).

| 토큰 | 용도 |
|---|---|
| `color.white` | 절대값 `#ffffff` — surface.elevated(light) 등에서 사용 |
| `color.black` | 절대값 `#000000` — opacity 베이스 |
| `color.gray.*` (50~900) | neutral 배경·텍스트·경계 |
| `color.blue.*` | 기본 brand 후보 + info |
| `color.green.*` | success |
| `color.amber.*` | warning |
| `color.red.*` | error |
| `color.teal·indigo·pink·*` (확장) | preset/instance 확장 시 |

primitive 색상의 정확한 hex 값은 § 3.4 표 (본 문서가 SoT).

### 3.4 primitive hex 카탈로그 (DT-02 해소)

Tailwind v3 슬레이트·블루·그린·앰버·레드 톤을 base로 채택. 동일 hue 10단계 — 50(가장 밝음) ~ 900(가장 어두움).

| hue / step | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|---|---|---|---|---|---|---|---|---|---|---|
| `gray` | `#f9fafb` | `#f3f4f6` | `#e5e7eb` | `#d1d5db` | `#9ca3af` | `#6b7280` | `#4b5563` | `#374151` | `#1f2937` | `#111827` |
| `blue` | `#eff6ff` | `#dbeafe` | `#bfdbfe` | `#93c5fd` | `#60a5fa` | `#3b82f6` | `#2563eb` | `#1d4ed8` | `#1e40af` | `#1e3a8a` |
| `green` | `#f0fdf4` | `#dcfce7` | `#bbf7d0` | `#86efac` | `#4ade80` | `#22c55e` | `#16a34a` | `#15803d` | `#166534` | `#14532d` |
| `amber` | `#fffbeb` | `#fef3c7` | `#fde68a` | `#fcd34d` | `#fbbf24` | `#f59e0b` | `#d97706` | `#b45309` | `#92400e` | `#78350f` |
| `red` | `#fef2f2` | `#fee2e2` | `#fecaca` | `#fca5a5` | `#f87171` | `#ef4444` | `#dc2626` | `#b91c1c` | `#991b1b` | `#7f1d1d` |

확장 hue(`teal`·`indigo`·`pink` 등)는 preset/instance 시점 도입. 본 v1.0은 위 5개 hue + white·black 카탈로그를 안정 표준으로 둔다.

### 3.2 semantic 색상 (light/dark 분기)

| 토큰 | light | dark |
|---|---|---|
| `color.surface.background` | gray.50 | gray.900 |
| `color.surface.elevated` | color.white | gray.800 |
| `color.surface.subtle` | gray.100 | gray.800 |
| `color.text.primary` | gray.900 | gray.50 |
| `color.text.secondary` | gray.600 | gray.300 |
| `color.text.disabled` | gray.400 | gray.500 |
| `color.text.inverse` | color.white | gray.900 |
| `color.border.default` | gray.200 | gray.700 |
| `color.border.subtle` | gray.100 | gray.800 |
| `color.brand.primary` | blue.600 | blue.400 |
| `color.brand.primary.hover` | blue.700 | blue.300 |
| `color.brand.secondary` | gray.700 | gray.300 |
| `color.status.success` | green.600 | green.400 |
| `color.status.success.subtle` | green.50 | green.900 |
| `color.status.warning` | amber.500 | amber.400 |
| `color.status.warning.subtle` | amber.50 | amber.900 |
| `color.status.error` | red.600 | red.400 |
| `color.status.error.subtle` | red.50 | red.900 |
| `color.status.info` | blue.500 | blue.300 |
| `color.status.info.subtle` | blue.50 | blue.900 |
| `color.focus.ring` | blue.500 | blue.300 |
| `color.overlay.modal` | rgba(0,0,0,0.5) | rgba(0,0,0,0.7) |
| `color.overlay.scrim` | rgba(0,0,0,0.3) | rgba(0,0,0,0.5) |

> **overlay 예외 규칙**: overlay 그룹의 semantic 토큰은 raw `rgba()` 값을 직접 가질 수 있다 — alpha 채널 표현을 위한 명시 예외. primitive `color.black` + opacity 별도 토큰으로 분리하면 alpha 변형마다 토큰이 늘어 운영 부담 큼. raw rgba는 overlay 그룹(`color.overlay.*`)에서만 허용 (다른 semantic 색상은 primitive alias 의무).

### 3.3 다크모드 활성화

- HTML 속성 `data-theme="light" | "dark"`로 분기
- `prefers-color-scheme` 자동 감지 + 사용자 명시 override (localStorage)
- 기본값 — `light`

---

## 4. 타이포그래피

### 4.1 폰트 패밀리 (primitive)

한국어 본문 가독성 우선 — Pretendard를 fallback 체인 앞에 배치.

| 토큰 | 값 |
|---|---|
| `font.family.sans` | "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Noto Sans KR", sans-serif |

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/PUBLIC_SITE_RENDER_PLAN.md | Select-Object -Skip 468 -First 55' in C:\Users\assag\solution\website-exposure
 succeeded in 585ms:

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

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content docs/decisions/PUBLIC_SITE_RENDER_PLAN.md | Select-Object -Skip 523 -First 20' in C:\Users\assag\solution\website-exposure
 succeeded in 559ms:

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

codex
robots.txt 코드 블록 자체는 SoT 예시와 일치합니다. 다만 같은 § 5.3의 코드 블록 직전 설명에 오래된 enum/승인 필드 표현이 남아 있어, 구현자가 그 줄을 기준으로 삼으면 § 3.2 SoT와 충돌할 수 있는지까지 확인하고 있습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "allowAll|allowApprovedOnly|legalApprovalAt|legalApprovedBy|legalApprovalNote|전통 SEO|네이버 AI|AI 크롤러 분류" docs/decisions/PUBLIC_SITE_RENDER_PLAN.md docs/core/SEARCH_STANDARDIZATION.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"aiCrawlerPolicy|aiCrawlerLegalApproved|disallowAll|allow \\| disallowTraining\" docs/core/SEARCH_STANDARDIZATION.md docs/decisions/PUBLIC_SITE_RENDER_PLAN.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "PSR-CASCADE-02|PSR-CASCADE-03|D0011|public_site|app_public_reader" docs/core/SCHEMA_MAPPING.md docs/decisions/M0_BUILD_EXPORT_PLAN.md packages/migrations-runner/src/manifest.ts apps/spike-a/pgbouncer/userlist.txt' in C:\Users\assag\solution\website-exposure
 succeeded in 744ms:
docs/core/SEARCH_STANDARDIZATION.md:21:- robots.txt는 **AI 크롤러 정책을 인스턴스 단위로 명시적 결정 — `aiCrawlerPolicy` required (미설정 시 빌드 fail)**. enum: `allow | disallowTraining | disallowAll | custom`. **`allow`는 법무 승인 플래그 `aiCrawlerLegalApproved: true` 필수 (fail-gate)**, 다른 정책은 승인 기록 권장. starter template은 `disallowTraining` 제안 — 검색·답변 노출 유지하면서 학습 데이터 사용 차단.
docs/core/SEARCH_STANDARDIZATION.md:153:### 3.1 AI 크롤러 분류 — 4계열
docs/core/SEARCH_STANDARDIZATION.md:182:| `disallowAll` | Allow | **Disallow** | **Disallow** | **Disallow** | 승인 기록 권장 |
docs/core/SEARCH_STANDARDIZATION.md:185:> **C 계열 (User-triggered fetch) 주의**: 제품별 robots.txt 해석 정책이 일반 검색·학습 크롤러와 다를 수 있음. `disallowAll`을 선택해도 **C 계열에 대한 완전 차단을 보장하는 수단으로 보지 않는다** — 각 제품 공식 문서·고객지원 채널 확인 권장.
docs/core/SEARCH_STANDARDIZATION.md:259:#### `aiCrawlerPolicy: disallowAll` (AI 전체 차단)
docs/core/SEARCH_STANDARDIZATION.md:575:| 2026-05-14 | v0.2 | **상위 문서 정합·정책 보강** (피드백 7건): (1) **canonical resolve § 0 요약 정정** — 3단계 부재 시 fail 명시, (2) **inLanguage 정책 통일** — 저장 `ko-KR`, `<html lang>` 출력 시 `ko` normalize, og:locale은 `ko_KR`, (3) **robots merge/replace 룰 명시** — append 방식 폐기, user-agent 단위 replace/merge로 변경. 충돌 시 빌드 실패, (4) **AI 크롤러 정책 `aiCrawlerPolicy` enum 도입** — `allow/disallowTraining/disallowAll/custom` 4종 + 법무 승인 플래그 `aiCrawlerLegalApproved` 필수, (5) **og:type `profile` 사용** — DATA_MODEL의 `ogType` enum 확장 필요(`{website, article, profile}`) — cascade DATA_MODEL 갱신, (6) **P-006·P-008 Article 메타 검증 분리** — P-010만 strict fail, P-006/P-008은 dateModified warning + author optional(reviewedBy 매핑), (7) **§ 6.1 성능 게이트 샘플링 정책** — 페이지 타입별 대표 URL + Critical URL + 변경 페이지 샘플링. CPU/network throttling, cold/warm run, 재시도 룰. 전체 페이지 측정은 별도 Job. (8) **noIndex 시 `<meta name="robots" content="noindex, follow">` 출력 룰 추가** (fail) |
docs/core/SEARCH_STANDARDIZATION.md:582:| 2026-05-14 | v0.9 | **잔여 정합·warning 의미 좁힘** (피드백 4건): (1) **§ 3.3 disallowAll C 계열 표현 통일** — "사용자 직접 요청 시 무시 가능성" → "**차단 보장 수단으로 보지 않음**" (§ 3.1·§ 3.2와 톤 일치), (2) **§ 2.3 P-006/P-008 fallback warning 의미 좁힘** — `@updatedAt` fallback 사용 자체는 **정상 동작 (silent)**. warning은 **명시 `dateModified` 필드 도입 후 값 부재**에만 적용 (`@updatedAt` resolve 실패는 fail로 별도), (3) **§ 2.3 P-010 `article:section` 누락 검증 룰 추가** — warning (콘텐츠 분류 신호 약화), (4) **§ 9 미결정 표에서 SS-04 제거** + **§ 9.1 "해소된 미결정" 별도 서브섹션 신설** — 가독성·운영자 혼란 회피 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:460:  - § 3.1: AI 크롤러 분류 4계열 (전통 SEO · 학습 봇 · 답변 봇 · 네이버 AI).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:461:  - § 3.2: `aiCrawlerPolicy` enum **required** (`disallowTraining` / `allowAll` / `allowApprovedOnly` / `custom`) — 미설정 시 빌드 fail.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:462:  - § 3.3: 정책별 출력 예시 + 법무 승인 필드 3종 required (`legalApprovalAt` · `legalApprovedBy` · `legalApprovalNote`) for `allowAll`.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:465:- (PSR-SEO-09 · cycle1 PSR-04 + cycle2 PSR-22) v0.1 단계 ClinicProfile.metadata.aiCrawlerPolicy 컬럼 부재 — InstanceManifest 합류 (M0 v1.0 cascade · PSR-DEFER-10) 전까지는 fixed `disallowTraining` starter (enum 값 = `disallowTraining` · SoT 4종 `allow / disallowTraining / disallowAll / custom`):
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:532:  - `disallowAll`: B·C·D 계열 모두 Disallow (A 만 Allow)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:693:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |

 succeeded in 736ms:
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:13:- `docs/core/SEARCH_STANDARDIZATION.md` — § 2 메타 태그 표준 (theme-color · og:type 매핑) · § 3 robots.txt (aiCrawlerPolicy + 4계열 user-agent + disallowTraining starter) · § 4.3 sitemap changefreq/priority · § 5 canonical resolve.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:15:- `docs/core/DATA_MODEL.md` v0.9 — C-01 ClinicProfile · C-02 DoctorProfile · C-03 TreatmentPage · C-04 Article · C-16 LegalDocument · C-21 LocationProfile · aiCrawlerPolicy.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:49:| sitemap.xml · robots.txt (cycle1 PSR-04·09 정정) | per-instance · SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` required + § 4.3 changefreq/priority SoT 정합 |
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:461:  - § 3.2: `aiCrawlerPolicy` enum **required** (`disallowTraining` / `allowAll` / `allowApprovedOnly` / `custom`) — 미설정 시 빌드 fail.
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:465:- (PSR-SEO-09 · cycle1 PSR-04 + cycle2 PSR-22) v0.1 단계 ClinicProfile.metadata.aiCrawlerPolicy 컬럼 부재 — InstanceManifest 합류 (M0 v1.0 cascade · PSR-DEFER-10) 전까지는 fixed `disallowTraining` starter (enum 값 = `disallowTraining` · SoT 4종 `allow / disallowTraining / disallowAll / custom`):
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:530:- (PSR-SEO-10) M0 v1.0 InstanceManifest.aiCrawlerPolicy 합류 시 (PSR-DEFER-10) row-driven 출력:
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:531:  - `allow` (= 학습 포함 전체 허용): D 계열 모두 Allow + `aiCrawlerLegalApproved: true` 필수 (fail-gate)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:532:  - `disallowAll`: B·C·D 계열 모두 Disallow (A 만 Allow)
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:649:- `PSR-DEFER-10`: AI 크롤러 인증 + InstanceManifest.aiCrawlerPolicy row-driven 출력 + 법무 승인 필드 3종 verify (SEARCH_STANDARDIZATION § 3.3.1 룰).
docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:691:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
docs/core/SEARCH_STANDARDIZATION.md:21:- robots.txt는 **AI 크롤러 정책을 인스턴스 단위로 명시적 결정 — `aiCrawlerPolicy` required (미설정 시 빌드 fail)**. enum: `allow | disallowTraining | disallowAll | custom`. **`allow`는 법무 승인 플래그 `aiCrawlerLegalApproved: true` 필수 (fail-gate)**, 다른 정책은 승인 기록 권장. starter template은 `disallowTraining` 제안 — 검색·답변 노출 유지하면서 학습 데이터 사용 차단.
docs/core/SEARCH_STANDARDIZATION.md:174:### 3.2 `aiCrawlerPolicy` enum — **required (미설정 시 빌드 fail)**
docs/core/SEARCH_STANDARDIZATION.md:176:`InstanceManifest.aiCrawlerPolicy`로 인스턴스별 명시 결정. **Core 자동 적용 기본값 없음**. 빌드 시 미설정이면 fail.
docs/core/SEARCH_STANDARDIZATION.md:180:| `allow` | Allow | Allow | Allow | Allow | **`aiCrawlerLegalApproved: true` 필수 (fail-gate)** |
docs/core/SEARCH_STANDARDIZATION.md:182:| `disallowAll` | Allow | **Disallow** | **Disallow** | **Disallow** | 승인 기록 권장 |
docs/core/SEARCH_STANDARDIZATION.md:185:> **C 계열 (User-triggered fetch) 주의**: 제품별 robots.txt 해석 정책이 일반 검색·학습 크롤러와 다를 수 있음. `disallowAll`을 선택해도 **C 계열에 대한 완전 차단을 보장하는 수단으로 보지 않는다** — 각 제품 공식 문서·고객지원 채널 확인 권장.
docs/core/SEARCH_STANDARDIZATION.md:190:#### `aiCrawlerPolicy: disallowTraining` (권장 기본)
docs/core/SEARCH_STANDARDIZATION.md:255:#### `aiCrawlerPolicy: allow` (학습 포함 전체 허용 — 법무 승인 필수)
docs/core/SEARCH_STANDARDIZATION.md:259:#### `aiCrawlerPolicy: disallowAll` (AI 전체 차단)
docs/core/SEARCH_STANDARDIZATION.md:267:| AI 크롤러 허용/차단 | **`aiCrawlerPolicy` 정책에 따라 § 3.2 매트릭스 적용** | required, 미설정 fail |
docs/core/SEARCH_STANDARDIZATION.md:284:**예시 — `aiCrawlerPolicy: allow` (기본 모두 허용)에서 PerplexityBot 일부 경로만 차단**:
docs/core/SEARCH_STANDARDIZATION.md:575:| 2026-05-14 | v0.2 | **상위 문서 정합·정책 보강** (피드백 7건): (1) **canonical resolve § 0 요약 정정** — 3단계 부재 시 fail 명시, (2) **inLanguage 정책 통일** — 저장 `ko-KR`, `<html lang>` 출력 시 `ko` normalize, og:locale은 `ko_KR`, (3) **robots merge/replace 룰 명시** — append 방식 폐기, user-agent 단위 replace/merge로 변경. 충돌 시 빌드 실패, (4) **AI 크롤러 정책 `aiCrawlerPolicy` enum 도입** — `allow/disallowTraining/disallowAll/custom` 4종 + 법무 승인 플래그 `aiCrawlerLegalApproved` 필수, (5) **og:type `profile` 사용** — DATA_MODEL의 `ogType` enum 확장 필요(`{website, article, profile}`) — cascade DATA_MODEL 갱신, (6) **P-006·P-008 Article 메타 검증 분리** — P-010만 strict fail, P-006/P-008은 dateModified warning + author optional(reviewedBy 매핑), (7) **§ 6.1 성능 게이트 샘플링 정책** — 페이지 타입별 대표 URL + Critical URL + 변경 페이지 샘플링. CPU/network throttling, cold/warm run, 재시도 룰. 전체 페이지 측정은 별도 Job. (8) **noIndex 시 `<meta name="robots" content="noindex, follow">` 출력 룰 추가** (fail) |
docs/core/SEARCH_STANDARDIZATION.md:576:| 2026-05-14 | v0.3 | **AI 크롤러 정책 정밀화·environment 분기** (피드백 8건): (1) **§ 3.1 AI 크롤러 3계열 분리** — A 검색 색인 / B AI 검색·답변용 / C AI 학습. **OAI-SearchBot·Perplexity-User·Bingbot·meta-externalagent 추가**, (2) **Google-Extended를 C 학습 계열로 정리** (이전 잘못된 A 분류 정정), (3) **§ 3.2 `aiCrawlerPolicy` required, 미설정 시 빌드 fail** — Core 자동 적용 기본값 없음. starter template만 `disallowTraining` 제안, (4) **§ 2.1 `<html lang>` ko-KR 그대로 출력** — normalize 제거. BCP 47 유효, 지역 정보 보존, (5) DATA_MODEL ogType cascade 이미 적용됨(v0.10 — 사용자 시점차), (6) **§ 3.3.1 noIndex vs robots.txt 원칙 명시** — robots.txt 차단 X + sitemap 제외 + meta noindex (참고: Google robots.txt intro), (7) **§ 2.3 publisher 검증 분리** — head meta에는 article:publisher 없음 → JSON-LD `Article.publisher`로 강제(SCHEMA_MAPPING § 3 P-010 책임). § 2.3는 article:published_time/modified_time/author만, (8) **§ 3.3.1 environment 분기** — production은 전체 차단 Blocked, staging/preview는 Allowed (Basic Auth 권장. `InstanceManifest.environment` 기반) |
docs/core/SEARCH_STANDARDIZATION.md:578:| 2026-05-14 | v0.5 | **C-08 InstanceManifest cascade·미세 정합** (피드백 6건): (1) **DATA_MODEL C-08에 8개 필드 추가** — `environment`·`aiCrawlerPolicy`·`aiCrawlerLegalApproved`·`aiCrawlerApprovedBy/At`·`robotsOverrides`·`experimentalAiBots`·`performanceBudget`·`searchConsoleVerification` + `RobotsOverride`·`PerformanceBudget` 하위 타입 신설. **본 문서가 단독 구현 가능한 명세로 작동**, (2) **§ 2.3 `PageMeta.noIndex` vs `robots` 우선순위 명시** — noIndex 항상 우선, 충돌 시 warning, (3) **§ 2.3 P-006/P-008 modified_time fallback** — `TreatmentPage.dateModified`/`MedicalConditionPage.dateModified` 또는 공통 `@updatedAt`로 fallback, (4) **§ 3.4 custom 예시 정정** — **`aiCrawlerPolicy: allow` 기반** PerplexityBot 일부 경로 차단(`/reviews`·`/pricing`) 예시로 교체, (5) **§ 7.3 analytics-reporting 후속 문서 안내** — `docs/features/` 디렉터리 미생성 명시, (6) **§ 3.3 meta-externalagent를 `experimentalAiBots`로 분리** — 공식 검증 전 user-agent는 별도 플래그 활성화 시에만 robots.txt 포함 |
docs/core/SEARCH_STANDARDIZATION.md:579:| 2026-05-14 | v0.6 | **룰·게이트·참고 URL 미세 정합** (피드백 5건): (1) **§ 2.3 P-006/P-008 modified_time 룰 정확화** — "명시적 dateModified 부재로 공통 `@updatedAt` fallback 사용" warning. modified_time 출력 자체는 누락 안 됨. C-11 풀명세 시 dateModified 추가 검토 명시, (2) v0.5 변경 이력 정정 — "disallowTraining 기반" → "**`aiCrawlerPolicy: allow` 기반**" PerplexityBot 일부 경로 차단 예시, (3) **DATA_MODEL C-08 cascade — `aiCrawlerApprovedBy/At`을 `aiCrawlerPolicy: allow` 시 required로 격상** (감사 추적 게이트 강화), (4) **DATA_MODEL C-08 PerformanceBudget 확장** — `imageWeightKbOverride`·`lighthouseSeoMinOverride`·`lighthouseAccessibilityMinOverride` 추가 (§ 6.1 budget 항목 모두 override 가능), (5) **§ 3.1 Google 참고 URL 정정** — robots.txt spec + Google-Extended 문서로 교체. robots-meta-tag는 noindex 등 별도 참조로 분리 |
docs/core/SEARCH_STANDARDIZATION.md:582:| 2026-05-14 | v0.9 | **잔여 정합·warning 의미 좁힘** (피드백 4건): (1) **§ 3.3 disallowAll C 계열 표현 통일** — "사용자 직접 요청 시 무시 가능성" → "**차단 보장 수단으로 보지 않음**" (§ 3.1·§ 3.2와 톤 일치), (2) **§ 2.3 P-006/P-008 fallback warning 의미 좁힘** — `@updatedAt` fallback 사용 자체는 **정상 동작 (silent)**. warning은 **명시 `dateModified` 필드 도입 후 값 부재**에만 적용 (`@updatedAt` resolve 실패는 fail로 별도), (3) **§ 2.3 P-010 `article:section` 누락 검증 룰 추가** — warning (콘텐츠 분류 신호 약화), (4) **§ 9 미결정 표에서 SS-04 제거** + **§ 9.1 "해소된 미결정" 별도 서브섹션 신설** — 가독성·운영자 혼란 회피 |

 succeeded in 730ms:
apps/spike-a/pgbouncer/userlist.txt:3:"app_public_reader" "app_public_reader_pw"
docs/decisions/M0_BUILD_EXPORT_PLAN.md:51:### 2.1 PUBLIC_SITE_RENDER_PLAN SSR 컴포넌트 재사용 (PSR-CASCADE-03)
docs/decisions/M0_BUILD_EXPORT_PLAN.md:65:본 § 2.1 은 `PUBLIC_SITE_RENDER_PLAN` 의 acceptance precondition cascade (PSR-CASCADE-03) — apps/worker 구현 시 별도 컴포넌트 작성 부담 없음. 본 plan v1.0 합류 시 § 2.1 상세화.
packages/migrations-runner/src/manifest.ts:23: * orderedMigrations — LOCATION_LEGAL_PLAN v1.1 § 6 의존성 9단계 + PUBLIC_SITE_RENDER_PLAN v0.x § 8/§ 10 의 D0011 (10단계 — PSR-25/PSR-CASCADE-04 patch).
packages/migrations-runner/src/manifest.ts:102:  // (10) app_public_reader role + per-table SELECT policy 7개 (PUBLIC_SITE_RENDER_PLAN v0.x · PSR-25 / PSR-CASCADE-04 patch)
packages/migrations-runner/src/manifest.ts:105:    file: "packages/db/migrations/D0011_public_reader.sql",
packages/migrations-runner/src/manifest.ts:108:      "app_public_reader",
docs/core/SCHEMA_MAPPING.md:68:#### v0.1 path-based `@id` 임시 패턴 (PSR-CASCADE-02 · PUBLIC_SITE_RENDER_PLAN v0.x)

codex
# PUBLIC_SITE_RENDER_PLAN v0.4 — cycle 4 review

## summary
- 본 cycle 지적 수: blocking=0 major=0 minor=1 (총 1)
- closeableAfterPatch: false
- 수렴 추세 추적: cycle1=21 → cycle2=7 → cycle3=2 → cycle4=1

## cycle 3 patch 검증
- PSR-29: PASS — scenario #21 기대값이 `#2563eb` light / `#60a5fa` dark로 정정됨. `DESIGN_TOKENS.md` § 3.2 `color.brand.primary` light=`blue.600`, dark=`blue.400` 및 § 3.4 hex와 정합.
- PSR-30: PASS — `PUBLIC_SITE_RENDER_PLAN.md` robots.txt starter 본문은 `SEARCH_STANDARDIZATION.md` § 3.3 예시와 header, 일반 룰, A/B/C/D 계열, `meta-externalagent` 코멘트, `Sitemap: https://{domain}/sitemap.xml`까지 entry-by-entry 정합.
- PSR-CASCADE-01a (ARCH § 3.12): PASS — `docs/admin/ARCHITECTURE.md` § 3.12에 `(admin)` `/admin/<instanceSlug>/...`와 `(site)` `/<instanceSlug>/...` 분리 및 PSR-CASCADE-01b 코드 격상 marker가 들어감.
- PSR-CASCADE-05 (pgbouncer): PASS — `apps/spike-a/pgbouncer/userlist.txt`에 `"app_public_reader" "app_public_reader_pw"` 추가됨.

## new blocking / major / minor (PSR-31+)
- PSR-31 / minor — `PUBLIC_SITE_RENDER_PLAN.md` § 5.3 robots.txt SoT 요약 3줄이 stale.
  - 현재 줄은 § 3.1을 “전통 SEO · 학습 봇 · 답변 봇 · 네이버 AI”로 요약하고, § 3.2 enum을 `disallowTraining / allowAll / allowApprovedOnly / custom`, § 3.3 승인 필드를 `legalApprovalAt/legalApprovedBy/legalApprovalNote for allowAll`로 적고 있음.
  - SoT는 `SEARCH_STANDARDIZATION.md` § 3.1 A/B/C/D 4계열, § 3.2 enum `allow | disallowTraining | disallowAll | custom`, `allow` 시 `aiCrawlerLegalApproved: true` fail-gate.
  - starter 코드 블록과 row-driven 항목은 이미 맞으므로 구현 차단은 아니지만, 같은 섹션 안 SoT 요약 충돌이라 짧은 patch 필요.

## acceptance precondition (PSR-CASCADE-01~05) 최종 확정
- 01a: PASS
- 01b: plan acceptance 외 — code v1.0 milestone
- 02: PASS
- 03: PASS
- 04: PASS
- 05: PASS

## acceptance 판정
- closeableAfterPatch=true: no
- 누계 통계: cycle1 21건 → cycle2 7건 → cycle3 2건 → cycle4 1건. cycle 3의 2건과 cascade 실 적용은 PASS지만, PSR-31 minor 1건 때문에 plan v1.0 acceptance commit은 이 stale 요약 3줄 정정 후 권고.
tokens used
32,146
# PUBLIC_SITE_RENDER_PLAN v0.4 — cycle 4 review

## summary
- 본 cycle 지적 수: blocking=0 major=0 minor=1 (총 1)
- closeableAfterPatch: false
- 수렴 추세 추적: cycle1=21 → cycle2=7 → cycle3=2 → cycle4=1

## cycle 3 patch 검증
- PSR-29: PASS — scenario #21 기대값이 `#2563eb` light / `#60a5fa` dark로 정정됨. `DESIGN_TOKENS.md` § 3.2 `color.brand.primary` light=`blue.600`, dark=`blue.400` 및 § 3.4 hex와 정합.
- PSR-30: PASS — `PUBLIC_SITE_RENDER_PLAN.md` robots.txt starter 본문은 `SEARCH_STANDARDIZATION.md` § 3.3 예시와 header, 일반 룰, A/B/C/D 계열, `meta-externalagent` 코멘트, `Sitemap: https://{domain}/sitemap.xml`까지 entry-by-entry 정합.
- PSR-CASCADE-01a (ARCH § 3.12): PASS — `docs/admin/ARCHITECTURE.md` § 3.12에 `(admin)` `/admin/<instanceSlug>/...`와 `(site)` `/<instanceSlug>/...` 분리 및 PSR-CASCADE-01b 코드 격상 marker가 들어감.
- PSR-CASCADE-05 (pgbouncer): PASS — `apps/spike-a/pgbouncer/userlist.txt`에 `"app_public_reader" "app_public_reader_pw"` 추가됨.

## new blocking / major / minor (PSR-31+)
- PSR-31 / minor — `PUBLIC_SITE_RENDER_PLAN.md` § 5.3 robots.txt SoT 요약 3줄이 stale.
  - 현재 줄은 § 3.1을 “전통 SEO · 학습 봇 · 답변 봇 · 네이버 AI”로 요약하고, § 3.2 enum을 `disallowTraining / allowAll / allowApprovedOnly / custom`, § 3.3 승인 필드를 `legalApprovalAt/legalApprovedBy/legalApprovalNote for allowAll`로 적고 있음.
  - SoT는 `SEARCH_STANDARDIZATION.md` § 3.1 A/B/C/D 4계열, § 3.2 enum `allow | disallowTraining | disallowAll | custom`, `allow` 시 `aiCrawlerLegalApproved: true` fail-gate.
  - starter 코드 블록과 row-driven 항목은 이미 맞으므로 구현 차단은 아니지만, 같은 섹션 안 SoT 요약 충돌이라 짧은 patch 필요.

## acceptance precondition (PSR-CASCADE-01~05) 최종 확정
- 01a: PASS
- 01b: plan acceptance 외 — code v1.0 milestone
- 02: PASS
- 03: PASS
- 04: PASS
- 05: PASS

## acceptance 판정
- closeableAfterPatch=true: no
- 누계 통계: cycle1 21건 → cycle2 7건 → cycle3 2건 → cycle4 1건. cycle 3의 2건과 cascade 실 적용은 PASS지만, PSR-31 minor 1건 때문에 plan v1.0 acceptance commit은 이 stale 요약 3줄 정정 후 권고.
