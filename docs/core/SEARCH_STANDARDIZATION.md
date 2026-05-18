# Core — 검색 표준화 (메타·robots·sitemap·canonical·성능)

> **상태**: **v1.1** (DESIGN_TOKENS v1.0 cascade)
> **작성일**: 2026-05-14 (v0.10 → v1.0 — 미세 보강·안정판 격상)
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 4 (검색 표준화 영역)
> **목적**: Core가 빌드 시 출력하는 검색 표준 산출물 — 메타 태그·robots.txt·sitemap.xml·canonical 처리·성능 기준 — 의 단독 구현 가능한 명세.
> **외부 공유 시 주의**: 상위 문서와 동일.
> **연관 문서**:
> - 페이지 타입 정의 → `core/PAGE_TYPES.md`
> - 데이터 계약 (`PageMeta` C-06, `BrandTokens`, `InstanceManifest` 등) → `core/DATA_MODEL.md`
> - JSON-LD Schema → `core/SCHEMA_MAPPING.md`
> - 콘텐츠 작성 표준 → `core/CONTENT_STANDARDS.md`

---

## 0. 한 페이지 요약

- Core가 빌드 시 자동 생성하는 **5개 표준 산출물**: head 메타 태그·robots.txt·sitemap.xml·canonical URL·성능 budget.
- **resolved canonical URL** — `PageMeta.canonical` → `SchemaInput.canonicalUrl` → 도메인/라우트 자동 생성 순서. **3단계 모두 resolve 불가 시 빌드 실패** (SCHEMA_MAPPING § 7.1 정합).
- robots.txt는 **AI 크롤러 정책을 인스턴스 단위로 명시적 결정 — `aiCrawlerPolicy` required (미설정 시 빌드 fail)**. enum: `allow | disallowTraining | disallowAll | custom`. **`allow`는 법무 승인 플래그 `aiCrawlerLegalApproved: true` 필수 (fail-gate)**, 다른 정책은 승인 기록 권장. starter template은 `disallowTraining` 제안 — 검색·답변 노출 유지하면서 학습 데이터 사용 차단.
- sitemap.xml은 **InstanceManifest·콘텐츠 파일 트리**로부터 자동 생성. 모든 발행 페이지 포함, 미발행 드래프트 제외.
- 성능은 **빌드 게이트(lab metric: Lighthouse budget)** + **운영 모니터링(field metric: CrUX·RUM)** 분리.
- 외부 분석 도구(네이버 서치어드바이저·Google Search Console·GA4) 실제 연동은 **`analytics-reporting` Feature Module**. 본 Core는 측정 이벤트·리포트 인터페이스만.

---

## 1. 일반 규약

### 1.1 Core 책임 범위 vs Add-on

| 항목 | Core 책임 | Add-on (Feature Module) |
|---|---|---|
| 메타 태그 자동 생성 | ✅ | |
| robots.txt 자동 생성 | ✅ | |
| sitemap.xml 자동 생성 | ✅ | |
| canonical URL 처리 | ✅ | |
| 성능 budget 검증 (빌드 lab) | ✅ | |
| 운영 field metric 모니터링 | 측정 이벤트 표준만 | ✅ `analytics-reporting` 모듈 |
| 외부 도구 연동 (서치어드바이저·GSC·GA4) | 인터페이스만 | ✅ `analytics-reporting` 모듈 |
| 키워드 모니터링 | | ✅ `keyword-monitoring` 모듈 |
| 사이트 가시성 추적 | | ✅ `search-visibility` 모듈 |

### 1.2 출력 형식 안정성

- **head 메타 태그**: HTML 표준 `<meta>`·`<link>` — 페이지 타입·PageMeta 기반 자동 생성
- **robots.txt**: 플레인 텍스트 — 사이트 루트 (`/robots.txt`)
- **sitemap.xml**: 표준 sitemap XML 0.9 — 사이트 루트 (`/sitemap.xml`)
- **canonical URL**: 절대 URL, `https://{domain}{path}`

### 1.3 변경 정책

본 표준은 빌드 생성기의 인터페이스. 변경 시 영향:

| 변경 종류 | 분류 |
|---|---|
| 새 메타 태그 필드 추가 | MINOR |
| 메타 태그 필수 → 선택 | PATCH |
| 메타 태그 선택 → 필수 | MAJOR |
| robots 룰 변경 | MINOR (정책 변경은 운영 결정) |
| 성능 budget 임계값 강화 | MAJOR (기존 인스턴스 빌드 실패 가능성) |
| 성능 budget 완화 | PATCH |

---

## 2. 메타 태그 표준

### 2.1 페이지별 출력 메타 (단일 SoT)

> 페이지별 head 메타 태그 출력의 단일 진실 원본. 페이지 타입(PAGE_TYPES § 1.1)별 + PageMeta(DATA_MODEL C-06) 입력 기반.

**Allowed (항상 출력) / Conditional (조건부) / Blocked (출력 안 함)** 분류:

| 메타 태그 | 출력 결정 | 출처 |
|---|---|---|
| `<title>` | **Allowed** (모든 페이지 필수) | `PageMeta.title` (10~70자) |
| `<meta name="description">` | **Allowed** (모든 페이지 필수) | `PageMeta.description` (80~160자) |
| `<link rel="canonical">` | **Allowed** (모든 페이지 필수) | `PageMeta.canonical` 또는 빌드 시 자동 resolve (§ 5) |
| `<meta name="robots">` | **Allowed** (모든 페이지) | `PageMeta.robots` (기본 `"index, follow, max-snippet:-1, max-image-preview:large"`) |
| `<meta name="viewport">` | **Allowed** | 고정 `"width=device-width, initial-scale=1"` |
| `<meta charset>` | **Allowed** | 고정 `"utf-8"` |
| `<html lang>` | **Allowed** | **저장값 `ko-KR`을 그대로 `<html lang>`에 출력** (BCP 47 유효, 지역 정보 보존 — hreflang·og:locale·SchemaInput과 단일 일관). og:locale은 `ko_KR` (underscore) 형식으로만 변환 |
| `<meta property="og:type">` | **Allowed** | 페이지 타입에 따라 자동 — `P-004`는 `profile`, `P-006/P-008/P-010`은 `article`, 나머지는 `website` (§ 2.2 매핑 참조) |
| `<meta property="og:title">` | **Allowed** | `PageMeta.ogTitle` 또는 `title` |
| `<meta property="og:description">` | **Allowed** | `PageMeta.ogDescription` 또는 `description` |
| `<meta property="og:url">` | **Allowed** | resolved canonical URL |
| `<meta property="og:site_name">` | **Allowed** | `ClinicProfile.name` |
| `<meta property="og:image">` | **Allowed** | `PageMeta.ogImageUrl` 또는 `ClinicProfile.ogImageUrl` |
| `<meta property="og:locale">` | **Allowed** | `inLanguage` (`ko-KR`)에서 OG locale 형식으로 변환: `ko_KR` (underscore) |
| `<meta name="twitter:card">` | **Allowed** | `PageMeta.twitterCard` (기본 `summary_large_image`) |
| `<meta name="twitter:title">` | Conditional (twitterCard 존재 시) | `ogTitle` 재사용 |
| `<meta name="twitter:description">` | Conditional | `ogDescription` 재사용 |
| `<meta name="twitter:image">` | Conditional | `ogImageUrl` 재사용 |
| `<meta property="article:published_time">` | **Conditional — P-010 전용** | `Article.datePublished`. P-006/P-008은 `@createdAt`을 공개 발행일로 보기 어려우므로 **미출력** (공개 발행 개념이 의료 정보 페이지에 직접 매핑되지 않음) |
| `<meta property="article:modified_time">` | Conditional (P-006·P-008·P-010) | P-010: `Article.dateModified` (누락 fail) / **P-006·P-008: § 2.3 fallback** — 명시 `dateModified` 부재 시 공통 `@updatedAt` (fallback 사용은 정상 silent) |
| `<meta property="article:author">` | Conditional | **P-010: `Article.author.name`** (fail) / P-006·P-008: `reviewedBy.name` (있을 때만, optional) |
| `<meta property="article:section">` | **Conditional — P-010 전용** | `ArticleCategory.name`. P-006/P-008은 ArticleCategory 개념 없으므로 미출력 |
| `<link rel="alternate" hreflang>` | Conditional | `InternationalSupport.internationalLanguagePages[]` 활성화 시 |
| `<meta name="theme-color">` | **Allowed (의무)** | light·dark 두 값 모두 출력 — `BrandTokens.colors.light.primary` + `BrandTokens.colors.dark.primary` (media 쿼리 별도). `DESIGN_TOKENS.md` § 9.4.1 SoT |
| `<meta name="referrer">` | **Blocked** (Core 기본 미설정) — 필요 시 인스턴스 결정 | |
| `<meta name="format-detection">` | Conditional (모바일 전화번호 표시 정책) | 기본 `telephone=no` 또는 인스턴스 결정 |

### 2.2 페이지 타입별 og:type 매핑

| 페이지 타입 | og:type |
|---|---|
| P-001 Home | `website` |
| P-002 About | `website` |
| P-003 Doctors List | `website` |
| P-004 Doctor Profile | `profile` |
| P-005 Treatments List | `website` |
| P-006 Treatment Detail | `article` (의료 정보 콘텐츠) |
| P-007 Conditions List | `website` |
| P-008 Condition Detail | `article` |
| P-009 Articles List | `website` |
| P-010 Article Detail | `article` |
| P-011 FAQ | `website` |
| P-012 Contact | `website` |
| P-013 Legal | `website` |
| P-014 Location Detail | `website` |
| P-101 ~ P-106 | `website` |

> **의도적 예외**: P-006·P-008은 `og:type=article`이지만 `article:*` 부가 메타는 **제한 출력** — `article:modified_time`·`article:author`만 (P-010은 모든 부가 메타 출력). P-006/P-008은 `article:published_time`·`article:section` 미출력 (의료 정보 페이지에 공개 발행일·ArticleCategory 매핑 부자연스러움). § 2.1 표 참조.

### 2.3 메타 태그 빌드 검증 (룰 checker)

**`PageMeta.robots` vs `PageMeta.noIndex` 우선순위 룰**:
- `noIndex: true`가 **항상 우선**. `robots` 필드의 `index`/`noindex` 지시어는 noIndex에 의해 자동 override됨
- 충돌 입력 (`noIndex: true` + `robots: "index, follow"`) 감지 시 **warning** + 빌드 시 noIndex 우선 적용
- `noIndex: true`인 페이지는 sitemap 자동 제외 + `<meta name="robots" content="noindex, follow">` 출력 + robots.txt 차단 안 함 (§ 3.3.1 noIndex 원칙 정합)

| 룰 | 레벨 | 조건 |
|---|---|---|
| `title` 누락 | fail | 모든 페이지 |
| `description` 누락 | fail | 모든 페이지 |
| `canonical` resolve 실패 (PageMeta·SchemaInput·도메인+라우트 3단계 모두 부재) | fail | 모든 페이지 |
| `title` 길이 < 10 또는 > 70자 | warning | |
| `description` 길이 < 80 또는 > 160자 | warning | |
| `ogImageUrl` 누락 (페이지·ClinicProfile 둘 다 부재) | warning | |
| `inLanguage` 누락 | fail | 빌드 시 `"ko-KR"` 자동 적용 후 경고 |
| **P-010 Article**: `<meta property="article:published_time">`·`article:modified_time`·`article:author` 누락 | **fail** | head meta 표준 책임. 출처: `Article.datePublished`·`Article.dateModified`·`Article.author.name`. 단 **`publisher`는 JSON-LD `Article.publisher`로 강제** (SCHEMA_MAPPING § 3 P-010 책임 — head meta에는 `article:publisher` 없음) |
| **P-006 Treatment Detail / P-008 Condition Detail**: `article:modified_time` 출처 결정 | **정상 동작** (warning 아님) | og:type=article이지만 entity 자체는 MedicalProcedure/MedicalCondition. **출처 우선순위**: ① 페이지 계약에 명시적 `dateModified` 필드가 있으면 사용 (현재 C-03·C-11 미정의) → ② 공통 `@updatedAt` (DATA_MODEL § 2.2 — 모든 계약 필수)로 fallback. **fallback 사용 자체는 정상 경로 (silent)** |
| P-006/P-008: 페이지 계약에 명시적 `dateModified` 필드가 추가됐는데 값이 없는 경우 | **warning** | C-03·C-11 풀명세 후 명시 필드 도입 시 적용 |
| P-006/P-008: `@updatedAt` resolve 실패 | **fail** | 공통 메타필드 필수 — resolve 실패는 빌드 차단 |
| `<meta property="article:author">` 출처 — P-006/P-008에서 `reviewedBy` 부재 | (선택) optional 미출력 | warning 아님. `reviewedBy` 있을 때만 출력 |
| **P-010 Article**: `Article.category` / `ArticleCategory.name` resolve 실패 (= `article:section` 누락) | **warning** | `Article.category`는 DATA_MODEL에서 required이므로 누락 가능 케이스는 ArticleCategory 참조 resolve 실패. 콘텐츠 분류 신호 약화 (콘텐츠 자체는 출력) |
| `noIndex: true` 페이지에서 `<meta name="robots" content="noindex, follow">` 누락 | fail | sitemap 제외와 함께 robots 메타도 출력 필수 |

---

## 3. robots.txt 표준

### 3.1 AI 크롤러 분류 — 4계열

user-agent의 목적별 분리 (공식 출처는 각 행 참조; 외부 자료 변경 가능성 — 분기 1회 재검증 권장):

| 계열 | user-agent | 목적 | 출처 |
|---|---|---|---|
| **A. 일반 검색 색인** | `Googlebot` / `Yeti` (네이버) / `Bingbot` | 일반 검색 결과 색인 — 의료기관 노출의 1차 채널 | 각 검색 엔진 공식 문서 |
| **B. AI 검색 인덱싱·답변용** | `OAI-SearchBot` (ChatGPT 검색용) / `PerplexityBot` (Perplexity 검색용) / `Claude-SearchBot` (Anthropic 검색용) | AI 답변·검색에서 사이트를 발견·인용하기 위한 인덱싱 크롤러 | OpenAI publisher FAQ; Perplexity crawlers; Anthropic crawler help |
| **C. User-triggered fetch** | `ChatGPT-User` (사용자 GPT 요청 시 fetch) / `Perplexity-User` (사용자 Perplexity 요청 시 fetch) / `Claude-User` (사용자 Claude 요청 시 fetch) | **사용자 직접 요청**에 의해 페이지를 fetch. 제품별 robots.txt 해석·우선순위가 일반 크롤러와 다를 수 있으므로 **차단 보장 수단으로 보지 않음** (각 제품 공식 문서 확인 권장) | 동일 공식 출처 |
| **D. AI 학습·모델 개선용** | `GPTBot` (OpenAI 학습) / `ClaudeBot` (Anthropic 학습/모델 개선) / `Google-Extended` (Google Gemini 학습) / `CCBot` (Common Crawl, LLM 학습 데이터) / `anthropic-ai` (Anthropic legacy·alias로 추정) / `meta-externalagent` (Meta — 외부 관측 기반, 공식 문서 재검증 필요) | 모델 학습 데이터 수집 | OpenAI publisher FAQ; Anthropic crawler help; **Google-Extended controls (overview-google-crawlers)**; Common Crawl; (meta-externalagent는 외부 관측 기반) |

> **분류 갱신 책임**: 본 표는 공식 출처 기반 + 분기 1회 재검증. `anthropic-ai`는 alias·legacy 추정 (Anthropic 공식 표기는 `ClaudeBot`·`Claude-SearchBot`·`Claude-User`).
> 참고 URL:
> - OpenAI publisher FAQ — https://help.openai.com/en/articles/12627856-publishers-and-developers-faq
> - OpenAI ChatGPT search product discovery — https://openai.com/chatgpt/search-product-discovery/
> - Perplexity crawlers — https://docs.perplexity.ai/docs/resources/perplexity-crawlers
> - Anthropic crawler help — https://support.claude.com/en/articles/8896518-does-anthropic-crawl-the-web-and-how-can-site-owners-block-the-crawler
> - Google robots.txt spec — https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt
> - Google-Extended controls — https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers (google-extended 섹션)
> - Google robots-meta (meta tag — noindex 등) — https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag

### 3.2 `aiCrawlerPolicy` enum — **required (미설정 시 빌드 fail)**

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

#### `aiCrawlerPolicy: allow` (학습 포함 전체 허용 — 법무 승인 필수)

위 예시에서 D 계열 모두 `Allow: /`로 변경.

#### `aiCrawlerPolicy: disallowAll` (AI 전체 차단)

B·C·D 계열 모두 `Disallow: /`. A 계열만 Allow. (**C 계열은 차단 보장 수단으로 보지 않음** — § 3.1·§ 3.2 주의)

### 3.3.1 robots.txt 룰 (Allowed / Blocked / Conditional)

| 룰 | 결정 | 비고 |
|---|---|---|
| AI 크롤러 허용/차단 | **`aiCrawlerPolicy` 정책에 따라 § 3.2 매트릭스 적용** | required, 미설정 fail |
| `/admin/`·`/auth/`·`/api/` 차단 | **Allowed** (Core 기본 — 모든 정책에 공통) | |
| 검색 결과 페이지(`/search`) 차단 | Conditional (검색 라우트 활성화 시) | 검색 결과 페이지가 색인되면 중복 콘텐츠 위험 |
| 미발행 드래프트 차단 | (sitemap에서 제외 + 라우트 자체 없음) | robots.txt에서 별도 명시 안 함 |
| **`noIndex: true` 페이지를 robots.txt에서 Disallow** | **Blocked** (Core 룰) | **robots.txt로 차단하면 크롤러가 meta noindex를 읽지 못함**. noIndex 페이지는 robots.txt 차단 X + sitemap 제외 + `<meta name="robots" content="noindex, follow">`로 처리 (참고: Google robots.txt intro) |
| `User-agent: *  Disallow: /` (전체 차단) | **environment별 결정** | `environment=production`에서는 **Blocked** (의료기관 사이트 노출 필수). `environment=staging`·`preview`에서는 **Allowed** (또는 Basic Auth 권장 — `InstanceManifest.environment` 기반) |

### 3.4 인스턴스별 robots 오버라이드 — user-agent별 merge/replace

**Append 방식 금지** (같은 user-agent에 Allow/Disallow 중복 시 크롤러별 해석 차이·longest-match 문제 발생). 대신 user-agent 단위 merge·replace:

| 오버라이드 결정 | 룰 |
|---|---|
| 새 user-agent 추가 | 인스턴스 룰을 그대로 append (해당 user-agent의 새 블록) |
| 기존 user-agent 룰 **변경** | 인스턴스 룰이 Core 기본 룰을 **replace** (해당 user-agent 블록 전체 교체) |
| 기존 user-agent 룰 **부분 추가** | 인스턴스가 명시한 Allow/Disallow 라인을 해당 user-agent 블록에 merge — 단 같은 path에 Allow와 Disallow가 동시에 나오면 빌드 실패 (충돌) |

**예시 — `aiCrawlerPolicy: allow` (기본 모두 허용)에서 PerplexityBot 일부 경로만 차단**:

```
# Core 기본 (allow 정책, PerplexityBot 블록)
User-agent: PerplexityBot
Allow: /

# 인스턴스 오버라이드 (merge, /reviews·/pricing 경로 차단)
robotsOverrides:
  - userAgent: PerplexityBot
    action: merge
    disallow: ["/reviews", "/pricing"]
    note: "후기·가격 페이지는 AI 검색 인덱싱 제외"

# 최종 출력
User-agent: PerplexityBot
Disallow: /reviews
Disallow: /pricing
Allow: /
```

> `InstanceManifest.robotsOverrides`(DATA_MODEL C-08·`RobotsOverride` 하위 타입)에 user-agent별 룰 명시. 빌드 시 Core 기본 + 오버라이드를 merge하고 같은 path에 Allow/Disallow 충돌 시 빌드 실패.

---

## 4. sitemap.xml 표준

### 4.1 자동 생성 룰

빌드 시 다음 페이지를 sitemap에 포함:

| 페이지 | 포함 결정 |
|---|---|
| 필수 페이지 타입 (P-001 ~ P-014) | **Allowed** — 인스턴스에서 활성화된 페이지 |
| 선택 페이지 타입 (P-101 ~ P-106) | Conditional — `FeatureModuleConfig`/`InstanceManifest`/라우트 설정에서 활성화 시 |
| 인스턴스 콘텐츠 (Articles·Treatments·Doctors·Conditions·FAQ·Locations) | **Allowed** — 발행된 모든 콘텐츠 |
| 미발행 드래프트 | **Blocked** |
| `noIndex: true` 페이지 | **Blocked** |
| 외부 리다이렉트 | **Blocked** |

### 4.2 sitemap.xml 형식

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://{domain}/</loc>
    <lastmod>2026-05-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://{domain}/about</loc>
    <lastmod>2026-05-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- ... -->
</urlset>
```

### 4.3 페이지별 changefreq·priority 기본값

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

- 단일 sitemap.xml의 URL 50,000개 또는 50MB 초과 시 sitemap index 형식 자동 분할
- M0 단일 클라이언트 인스턴스는 일반적으로 단일 sitemap.xml로 충분

---

## 5. canonical URL 처리 (resolve)

### 5.1 resolve 우선순위

```
1. PageMeta.canonical (운영자 명시 입력)
   ↓ 없으면
2. SchemaInput.canonicalUrl (어드민 발행 시 자동 계산)
   ↓ 없으면
3. 페이지 라우트 + 도메인으로 자동 생성
   예: ClinicProfile.domain + path = "https://example.com/about"
```

### 5.2 resolve 룰 (룰 checker)

| 룰 | 레벨 |
|---|---|
| 위 3단계 모두 부재 — resolve 실패 | **fail** (빌드 차단) |
| canonical과 페이지 실제 URL 불일치 | warning |
| 외부 도메인 canonical | warning + 운영자 확인 |
| Query string 포함 canonical | warning (정규화 권장) |
| Fragment 포함 canonical | fail (canonical은 fragment 없는 절대 URL) |

### 5.3 hreflang (다국어 시)

- `ClinicProfile.internationalSupport.internationalLanguagePages[]` 존재 시 자동 출력
- 각 언어 페이지의 canonical과 hreflang 쌍방향 매핑
- M0는 단일 언어, M3 GA에서 본격 도입

---

## 6. 성능 기준 — 빌드 lab vs 운영 field

### 6.1 빌드 게이트 (Lab metric) — 샘플링 측정

**전체 페이지 Lighthouse 측정은 비현실적** (CI 환경 변동성·페이지 수 비례 비용). 다음 샘플링 정책 적용:

| 샘플 대상 | 측정 | 비고 |
|---|---|---|
| 페이지 타입별 대표 URL 1개 (P-001·P-002·P-003·P-004·P-005·P-006·P-007·P-008·P-009·P-010·P-011·P-012·P-013·P-014) | 매 빌드 | 14개 — Core 페이지 타입 카탈로그 |
| Critical URL (운영자 지정 — Home·핵심 시술 페이지 등) | 매 빌드 | `InstanceManifest.performanceBudget.criticalUrls` |
| 변경된 페이지 샘플 | 매 빌드 | 변경 셋 N개 중 무작위 샘플 (기본 max 5개) |
| 전체 페이지 측정 | 주간/월간 별도 Job | CI 게이트 아님 — 모니터링 리포트 |

**측정 환경**:
- CPU throttling: 4x
- Network: Slow 4G (Lighthouse 기본 프로파일)
- Cold run (캐시 없음) 1회 + Warm run (캐시 있음) 1회 — 두 결과 모두 budget 충족
- 실패 시 자동 재시도 1회 (재시도도 실패 시 빌드 실패)
- Form factor: mobile 우선, desktop 보조

빌드 시 Lighthouse(또는 동등 도구)로 측정. **빌드 게이트로 작동**.

| 메트릭 | 측정 단위 | 기본 budget | 룰 레벨 |
|---|---|---|---|
| LCP (Largest Contentful Paint) | ms | < 2,500 | fail (> 4,000), warning (2,500~4,000) |
| CLS (Cumulative Layout Shift) | score | < 0.1 | fail (> 0.25), warning (0.1~0.25) |
| TBT (Total Blocking Time) | ms | < 200 | warning (200~600), fail (> 600) |
| Bundle Size (per page JS) | KB | < 200 | warning (200~500), fail (> 500) |
| Image weight per page | KB | < 1,500 | warning (1,500~3,000), fail (> 3,000) |
| Lighthouse Performance Score | 0~100 | > 80 | warning (60~80), fail (< 60) |
| Lighthouse SEO Score | 0~100 | > 90 | warning (80~90), fail (< 80) |
| Lighthouse Accessibility Score | 0~100 | > 90 | warning (80~90), fail (< 80) |

> 임계값은 기본값. 인스턴스가 `InstanceManifest.performanceBudget`에서 override 가능 (강화만 허용, 완화는 솔루션 정책상 제한).
>
> **강화 판정 방향**:
> - **max 계열 (작을수록 강화)**: `lcpMsOverride`·`clsOverride`·`tbtMsOverride`·`bundleSizeKbOverride`·`imageWeightKbOverride` — Core 기본값보다 **작아야** 강화로 허용
> - **min score 계열 (클수록 강화)**: `lighthousePerformanceMinOverride`·`lighthouseSeoMinOverride`·`lighthouseAccessibilityMinOverride` — Core 기본값보다 **커야** 강화로 허용
> - 반대 방향(완화) 입력 시 빌드 실패.

### 6.2 운영 모니터링 (Field metric)

**Real User Monitoring(RUM)** 또는 Chrome User Experience Report(CrUX) 데이터. **빌드 게이트 아님 — 운영 추세 관찰용**.

| 메트릭 | 권장 임계 (모바일 75 percentile) | 알림 조건 |
|---|---|---|
| LCP (field) | < 2,500 ms | 임계 미달 7일 지속 시 알림 |
| INP (Interaction to Next Paint) | < 200 ms | INP는 lab 측정 부정확 — field 전용 |
| CLS (field) | < 0.1 | |
| FCP (First Contentful Paint) | < 1,800 ms | |
| TTFB (Time to First Byte) | < 800 ms | 호스팅·CDN 점검 신호 |

### 6.3 측정 이벤트 표준 (Core 인터페이스)

Core는 측정 이벤트의 표준 인터페이스만 제공. 실제 수집·전송은 `analytics-reporting` Feature Module.

```ts
type PerformanceEvent = {
  metric: "LCP" | "INP" | "CLS" | "FCP" | "TTFB" | "Custom";
  value: number;
  unit: "ms" | "score" | "byte";
  page: string;        // URL 또는 페이지 타입 ID
  timestamp: Date;
  device?: "mobile" | "tablet" | "desktop";
  connection?: string; // navigator.connection.effectiveType 등
};

// v0.7 cascade — `features/analytics-reporting.md` 1차 사이클 (F-1)
type PageViewEvent = {
  page: string;                       // URL path
  pageTypeId?: string;                // PAGE_TYPES P-001 등
  timestamp: Date;
  device?: "mobile" | "tablet" | "desktop";
  country?: string;                    // ISO3166 alpha-2
  referrer?: string;                   // origin만 (full URL·querystring 금지 — § 6.3.1 PII 처리)
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

type ConversionEvent = {
  eventName: string;                  // "form-submit"·"call-click"·"reservation" 등
  page: string;
  timestamp: Date;
  value?: number;                      // 환산 가치 (선택)
  metadata?: Record<string, string>;   // 비식별 데이터만 — PII 금지
};
```

#### 6.3.1 측정 이벤트 PII 처리 규약 (모든 이벤트 공통)

- `page` 필드는 URL path만 (querystring 제거, fragment 제거)
- `referrer`는 origin만 (full URL·querystring 저장 금지)
- IP·user-id·client-id·email·phone 직접 저장 금지
- user-agent는 device family·browser family로 정규화 후 저장 (raw UA 폐기)
- IP 주소 — 수집 시 IPv4는 마지막 octet 마스킹(`/24`), IPv6는 마지막 80비트 마스킹(`/48`)

Feature Module이 이 이벤트를 구독해 CrUX·GA4·자체 RUM 백엔드 등으로 전송.

---

## 7. 외부 도구 연동 인터페이스 (Core)

### 7.1 네이버 서치어드바이저·Google Search Console 메타 verification

- `<meta name="google-site-verification">`·`<meta name="naver-site-verification">` 출력 — `InstanceManifest.searchConsoleVerification` 기반
- Core는 메타 출력만, 실제 콘솔 등록·데이터 수집은 운영자·`analytics-reporting` 모듈

### 7.2 Sitemap 제출

- robots.txt에 `Sitemap:` 라인 자동 출력 — 검색 엔진 자동 발견
- 수동 제출(서치어드바이저·GSC)은 운영자 책임

### 7.3 측정 이벤트·리포트 인터페이스

- § 6.3 표준 이벤트 3종: `PerformanceEvent` · `PageViewEvent`(v0.7 +) · `ConversionEvent`(v0.7 +)
- PII 처리 규약은 § 6.3.1 SoT (v0.7 +)
- 상세 수집·정규화·캐시·리포트 생성·발송은 `docs/features/analytics-reporting.md` (Feature Module 명세)

---

## 8. 빌드 검증 — 룰 레벨 정합 (SCHEMA_MAPPING § 7.3과 동일 패턴)

### 8.1 룰 레벨

| 레벨 | 정의 | 조치 |
|---|---|---|
| **fail** | 빌드 실패 | title·description·canonical 누락, robots.txt 전체 차단, sitemap 출력 실패, Lighthouse Performance < 60 등 |
| **warning** | 경고 + 어드민 검토 큐 | title/description 길이 미달, ogImageUrl 누락, LCP 2.5~4.0s, Bundle Size 200~500KB 등 |
| **content-gate** | 본문 표현 검수 | (본 문서는 메타·robots·sitemap 중심이라 content-gate 항목 적음. `CONTENT_STANDARDS.md`에서 다룸) |

### 8.2 빌드 게이트 vs 운영 모니터링 분리

| 단계 | 도구 | 실패 시 |
|---|---|---|
| 빌드 게이트 (CI) | 자체 룰 checker + Lighthouse CLI | 빌드 실패 |
| 운영 모니터링 | RUM·CrUX·서치어드바이저·GSC·`analytics-reporting` 모듈 | 경고·이슈 트래커 |

---

## 9. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| SS-01 | robots.txt 신규 AI 크롤러 갱신 — **주기는 분기 1회로 결정**. 미정인 부분: 재검증 책임자(Glitzy Core 팀 vs 운영자) / 업데이트 PR 흐름(Core 패키지 MINOR 릴리즈 vs 인스턴스 robotsOverrides) | 운영 프로세스 결정 |
| SS-02 | hreflang 출력 자동화 깊이 — 단순 lang vs lang+region (예: `ko`·`ko-KR`) | M3 다국어 도입 시 확정 |
| SS-03 | sitemap.xml 분할 임계 — 50,000 URL이 표준이나 운영 효율은 더 작게? | 인스턴스 규모 누적 후 결정 |
| SS-06 | `referrer` 메타 정책 — Core 기본은 미설정, 인스턴스별 결정 | 운영 시 검토 |
| SS-07 | `format-detection: telephone=no` vs 기본 활성화 | 모바일 UX 결정 |
| SS-08 | 외부 도메인 canonical 허용 정책 — warning vs fail | 운영 시 결정 |

### 9.1 해소된 미결정 (변경 이력 참조)

| ID | 항목 | 해소 |
|---|---|---|
| SS-04 | `InstanceManifest.performanceBudget` 강화 override 범위 | v0.6 — DATA_MODEL C-08 `PerformanceBudget` 7개 필드 / v0.7 — § 6.1 강화 판정 방향 |
| ~~SS-05~~ | `theme-color` 메타 자동 출력 정책 | v1.0 — `DESIGN_TOKENS.md` § 9.4.1 SoT 확정. light·dark 두 값 모두 출력 (`<meta name="theme-color">` + `media="(prefers-color-scheme: dark)"` 별도). 값은 `BrandTokens.colors.primary` 평면화 hex |

---

## 10. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 — 메타 태그 표준(28종), robots.txt(AI 크롤러 화이트리스트), sitemap.xml(페이지별 changefreq/priority), canonical resolve 우선순위, 성능 기준(빌드 lab + 운영 field), Core 인터페이스 vs analytics-reporting 모듈 책임 분리, 빌드 검증 룰 레벨 |
| 2026-05-14 | v0.2 | **상위 문서 정합·정책 보강** (피드백 7건): (1) **canonical resolve § 0 요약 정정** — 3단계 부재 시 fail 명시, (2) **inLanguage 정책 통일** — 저장 `ko-KR`, `<html lang>` 출력 시 `ko` normalize, og:locale은 `ko_KR`, (3) **robots merge/replace 룰 명시** — append 방식 폐기, user-agent 단위 replace/merge로 변경. 충돌 시 빌드 실패, (4) **AI 크롤러 정책 `aiCrawlerPolicy` enum 도입** — `allow/disallowTraining/disallowAll/custom` 4종 + 법무 승인 플래그 `aiCrawlerLegalApproved` 필수, (5) **og:type `profile` 사용** — DATA_MODEL의 `ogType` enum 확장 필요(`{website, article, profile}`) — cascade DATA_MODEL 갱신, (6) **P-006·P-008 Article 메타 검증 분리** — P-010만 strict fail, P-006/P-008은 dateModified warning + author optional(reviewedBy 매핑), (7) **§ 6.1 성능 게이트 샘플링 정책** — 페이지 타입별 대표 URL + Critical URL + 변경 페이지 샘플링. CPU/network throttling, cold/warm run, 재시도 룰. 전체 페이지 측정은 별도 Job. (8) **noIndex 시 `<meta name="robots" content="noindex, follow">` 출력 룰 추가** (fail) |
| 2026-05-14 | v0.3 | **AI 크롤러 정책 정밀화·environment 분기** (피드백 8건): (1) **§ 3.1 AI 크롤러 3계열 분리** — A 검색 색인 / B AI 검색·답변용 / C AI 학습. **OAI-SearchBot·Perplexity-User·Bingbot·meta-externalagent 추가**, (2) **Google-Extended를 C 학습 계열로 정리** (이전 잘못된 A 분류 정정), (3) **§ 3.2 `aiCrawlerPolicy` required, 미설정 시 빌드 fail** — Core 자동 적용 기본값 없음. starter template만 `disallowTraining` 제안, (4) **§ 2.1 `<html lang>` ko-KR 그대로 출력** — normalize 제거. BCP 47 유효, 지역 정보 보존, (5) DATA_MODEL ogType cascade 이미 적용됨(v0.10 — 사용자 시점차), (6) **§ 3.3.1 noIndex vs robots.txt 원칙 명시** — robots.txt 차단 X + sitemap 제외 + meta noindex (참고: Google robots.txt intro), (7) **§ 2.3 publisher 검증 분리** — head meta에는 article:publisher 없음 → JSON-LD `Article.publisher`로 강제(SCHEMA_MAPPING § 3 P-010 책임). § 2.3는 article:published_time/modified_time/author만, (8) **§ 3.3.1 environment 분기** — production은 전체 차단 Blocked, staging/preview는 Allowed (Basic Auth 권장. `InstanceManifest.environment` 기반) |
| 2026-05-14 | v0.4 | **AI 봇 분류 정확화** (피드백 8건): (1) **§ 0 요약 정정** — "Core 기본 allow" 잔재 제거, `required·미설정 fail`로 통일, (2) **Anthropic 봇 분류 정정** — `ClaudeBot`을 D 학습 계열로, `Claude-SearchBot`을 B 검색 인덱싱, `Claude-User`를 C user-triggered로. `anthropic-ai`는 legacy/alias 주석, (3) **OpenAI `ChatGPT-User` 추가** — C user-triggered 계열, (4) **3계열 → 4계열 재구성** — A 일반 검색 / B AI 검색 인덱싱 / **C User-triggered fetch** / D AI 학습. C 계열은 robots.txt 무시 가능성 주의, (5) **공식 출처 URL 명시** — 각 user-agent에 OpenAI publisher FAQ·Anthropic crawler help·Perplexity crawlers·Google robots-meta 참조. `meta-externalagent`는 외부 관측 기반 표기. 분기 1회 재검증 책임 명시, (6) **§ 0·§ 2.1 og:type 잔재 정정** — P-004 profile·P-006/P-008/P-010 article·나머지 website, (7) **SCHEMA_MAPPING § 1.5 `<html lang="ko">` → `<html lang="ko-KR">` cascade 정합**, (8) **법무 승인 플래그 룰 완화** — `allow`만 fail-gate, 다른 정책은 승인 기록 권장(warning 수준) |
| 2026-05-14 | v0.5 | **C-08 InstanceManifest cascade·미세 정합** (피드백 6건): (1) **DATA_MODEL C-08에 8개 필드 추가** — `environment`·`aiCrawlerPolicy`·`aiCrawlerLegalApproved`·`aiCrawlerApprovedBy/At`·`robotsOverrides`·`experimentalAiBots`·`performanceBudget`·`searchConsoleVerification` + `RobotsOverride`·`PerformanceBudget` 하위 타입 신설. **본 문서가 단독 구현 가능한 명세로 작동**, (2) **§ 2.3 `PageMeta.noIndex` vs `robots` 우선순위 명시** — noIndex 항상 우선, 충돌 시 warning, (3) **§ 2.3 P-006/P-008 modified_time fallback** — `TreatmentPage.dateModified`/`MedicalConditionPage.dateModified` 또는 공통 `@updatedAt`로 fallback, (4) **§ 3.4 custom 예시 정정** — **`aiCrawlerPolicy: allow` 기반** PerplexityBot 일부 경로 차단(`/reviews`·`/pricing`) 예시로 교체, (5) **§ 7.3 analytics-reporting 후속 문서 안내** — `docs/features/` 디렉터리 미생성 명시, (6) **§ 3.3 meta-externalagent를 `experimentalAiBots`로 분리** — 공식 검증 전 user-agent는 별도 플래그 활성화 시에만 robots.txt 포함 |
| 2026-05-14 | v0.6 | **룰·게이트·참고 URL 미세 정합** (피드백 5건): (1) **§ 2.3 P-006/P-008 modified_time 룰 정확화** — "명시적 dateModified 부재로 공통 `@updatedAt` fallback 사용" warning. modified_time 출력 자체는 누락 안 됨. C-11 풀명세 시 dateModified 추가 검토 명시, (2) v0.5 변경 이력 정정 — "disallowTraining 기반" → "**`aiCrawlerPolicy: allow` 기반**" PerplexityBot 일부 경로 차단 예시, (3) **DATA_MODEL C-08 cascade — `aiCrawlerApprovedBy/At`을 `aiCrawlerPolicy: allow` 시 required로 격상** (감사 추적 게이트 강화), (4) **DATA_MODEL C-08 PerformanceBudget 확장** — `imageWeightKbOverride`·`lighthouseSeoMinOverride`·`lighthouseAccessibilityMinOverride` 추가 (§ 6.1 budget 항목 모두 override 가능), (5) **§ 3.1 Google 참고 URL 정정** — robots.txt spec + Google-Extended 문서로 교체. robots-meta-tag는 noindex 등 별도 참조로 분리 |
| 2026-05-14 | v0.7 | **잔여 문구·표 정합** (피드백 5건): (1) **§ 3.1 표 D 계열 출처 정정** — "Google search-console robots-meta" → "**Google-Extended controls (overview-google-crawlers)**" (Google 봇 분류 근거 정확화), (2) **§ 4.4 sitemap lastmod 출처 분리** — P-010 Article은 `Article.dateModified`, P-006·P-008은 명시 필드 부재 시 `@updatedAt` (§ 2.3 정합), (3) **§ 2.1 메타 태그 출처 칸 세분화** — `article:published_time`·`modified_time`·`author`를 P-006/P-008/P-010별로 분리 명시. P-010 fail/P-006·P-008 conditional fallback 차등, (4) **v0.6 변경 이력 "6건 → 5건" 오기 수정**, (5) **§ 6.1 강화 판정 방향 명시** — max 계열(LCP·CLS·TBT·bundle·image)은 작을수록 강화, min score 계열(Performance·SEO·Accessibility)은 클수록 강화. 반대 방향 입력 시 빌드 실패 |
| 2026-05-14 | v0.8 | **OG article 메타 범위 정밀화** (피드백 4건): (1) **§ 2.1 `article:published_time`을 P-010 전용으로 좁힘** — P-006/P-008은 `@createdAt`을 공개 발행일로 매핑하기 부자연스러움. 미출력, (2) **§ 2.1 `article:section`도 P-010 전용** — P-006/P-008은 ArticleCategory 개념 없음. `article:modified_time`·`article:author`만 P-006/P-008에 conditional 적용, (3) **SS-04 미결정 해소 표시** — PerformanceBudget 강화 override 범위는 v0.6/v0.7에서 결정 완료, (4) **§ 3.1·§ 3.2 C 계열 표현 완화** — "robots.txt를 일반 크롤러처럼 따르지 않을 수 있음" → "**제품별 robots.txt 해석·우선순위가 일반 크롤러와 다를 수 있으므로 차단 보장 수단으로 보지 않음**" (법무·운영 문서 톤) |
| 2026-05-14 | v0.9 | **잔여 정합·warning 의미 좁힘** (피드백 4건): (1) **§ 3.3 disallowAll C 계열 표현 통일** — "사용자 직접 요청 시 무시 가능성" → "**차단 보장 수단으로 보지 않음**" (§ 3.1·§ 3.2와 톤 일치), (2) **§ 2.3 P-006/P-008 fallback warning 의미 좁힘** — `@updatedAt` fallback 사용 자체는 **정상 동작 (silent)**. warning은 **명시 `dateModified` 필드 도입 후 값 부재**에만 적용 (`@updatedAt` resolve 실패는 fail로 별도), (3) **§ 2.3 P-010 `article:section` 누락 검증 룰 추가** — warning (콘텐츠 분류 신호 약화), (4) **§ 9 미결정 표에서 SS-04 제거** + **§ 9.1 "해소된 미결정" 별도 서브섹션 신설** — 가독성·운영자 혼란 회피 |
| 2026-05-14 | v0.10 | **잔재 정합 마감** (피드백 3건): (1) **§ 2.1 `article:modified_time` 출처 표** — "warning 수준" 잔재 제거. fallback 사용은 silent로 명시, (2) **v0.9 변경 이력 표현 정정** — warning은 명시 필드 도입 후 값 부재에만 적용. `@updatedAt` resolve 실패는 fail로 분리 (이전 표현이 둘을 warning에 모두 묶어서 모순), (3) **§ 2.3 `article:section` 룰 이름 정확화** — "누락 warning" → "**`Article.category` / `ArticleCategory.name` resolve 실패**" (Article.category는 required, 누락 가능 케이스는 참조 resolve 실패) |
| 2026-05-14 | **v1.1** | **DESIGN_TOKENS v1.0 cascade**: § 2.1 메타 표 theme-color Conditional → **Allowed(의무)**로 격상. light·dark 두 값 출력 (`BrandTokens.colors.light.primary` + `colors.dark.primary`). SS-05 해소 |
| 2026-05-14 | **v1.0** | **구현 명세 안정판 격상**: (1) **§ 2.2 P-006/P-008 OG `article:*` 제한 출력 주석 추가** — 표 오해 방지, (2) **§ 3.2 매트릭스 C 계열 컬럼명에 `(best-effort)` 명시** — 정책의 한계를 표 자체에 드러냄, (3) **§ 9 SS-01 구체화** — 분기 1회 재검증 주기는 결정. 재검증 책임자·업데이트 PR 흐름이 미정으로 명확화, (4) v0.10 → **v1.0 격상** — 사용자 피드백 "구현 가능한 명세 수준 도달·기능 구현을 막는 수준의 결함 없음" 채택. 다음 단계는 SchemaGenerator 일부 + rule checker + robots/sitemap generator 실제 구현 + 그 발견을 문서에 되먹이기 |
