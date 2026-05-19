# Core — Schema 매핑 표준

> **상태**: **v1.0** (구현 명세 안정판)
> **작성일**: 2026-05-14 (v0.10 → v1.0 — § 2.2 룰 레벨 열 추가·안정판 격상)
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 7
> **목적**: 솔루션이 사이트 빌드 시 출력하는 JSON-LD 구조화 데이터의 표준을 정의한다. 각 페이지 타입별 schema 그래프, 데이터 계약 ↔ schema 필드 매핑, 공통 룰, 금지·주의 schema, 빌드 검증을 단독 구현 가능한 수준으로 명시한다.
> **외부 공유 시 주의**: 상위 문서와 동일. 의료 분야 표현 리스크 어휘 회피.
> **연관 문서**:
> - 페이지 타입 정의 → `core/PAGE_TYPES.md`
> - 데이터 계약 → `core/DATA_MODEL.md`
> - 메타 태그·robots·sitemap → `core/SEARCH_STANDARDIZATION.md`
> - 위험도 등급·표현 가이드 → `compliance/RISK_LEVELS.md`

---

## 0. 한 페이지 요약

- 모든 페이지는 **하나의 JSON-LD 그래프**(@graph 형태)로 통합 출력. 페이지 타입별 graph 구성 표준화.
- 핵심 schema: `Organization`·`MedicalClinic`·`Physician`·`MedicalProcedure`·`MedicalCondition`·`Article`·`FAQPage`·`BreadcrumbList`·`WebSite`. (`MedicalClinic`은 LocalBusiness sub-class이므로 별도 `LocalBusiness` 타입 출력 안 함)
- 단지점·다지점은 **`MedicalClinic` 지점 entity가 LocationProfile 1:1 매핑**. ClinicProfile은 `Organization`(상위 entity), 본원 LocationProfile은 본원 `MedicalClinic`(`#clinic`)으로 표현.
- **금지 schema** — `Review`·`AggregateRating`·`Offer`·`HealthAndBeautyBusiness`·`MedicalIndication` 단정형·`MedicalRiskFactor` 등은 **빌드 실패 (fail)** — § 8 참조.
- `C-15 SchemaInput` 인터페이스를 본 문서 § 6에서 정식 정의 (DATA_MODEL.md placeholder 해소).
- **공통 entity별 페이지 출력 정책은 § 2.5가 단일 SoT** — 페이지별 graph 구성(§ 3·§ 4)이 본 표를 따른다.
- **빌드 검증**: **자체 JSON schema/rule checker**가 빌드 게이트 (필수 필드·풀 entity 누락·금지 schema 사용 시 빌드 실패). schema.org official validator·Google Rich Results Test는 **운영 모니터링·수동 QA** (§ 7.2).

---

## 1. 일반 규약

### 1.1 JSON-LD 컨텍스트·통합 그래프

**Core가 출력하는 JSON-LD는 페이지당 단일 `<script type="application/ld+json">` 블록**으로 통합 그래프 출력. (외부 통합 — 네이버 예약 위젯·카카오톡 등 — 이 자체 schema를 삽입할 수 있으나 Core 책임 외. Core graph와 충돌 시 entity @id 중복 검출은 빌드 시 경고.)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": "...", ... },
    { "@type": "MedicalClinic", "@id": "...", ... },
    { "@type": "BreadcrumbList", "itemListElement": [...] },
    { "@type": "Article", "@id": "...", ... }
  ]
}
</script>
```

- 페이지 타입별 graph 구성 표준은 § 3·§ 4.
- 통합 그래프 사용 이유: entity cross-reference(@id 참조)가 깔끔, validator·검색 엔진의 entity 해석 명확.

### 1.2 `@id` 네이밍 규약

| Entity | `@id` 패턴 | 예시 |
|---|---|---|
| `Organization` (ClinicProfile) | `https://{domain}/#organization` | `https://example.com/#organization` |
| `MedicalClinic` 본원 (LocationProfile main) | `https://{domain}/#clinic` | `https://example.com/#clinic` |
| `MedicalClinic` 지점 (LocationProfile main 외) | `https://{domain}/locations/{slug}#clinic` | `https://example.com/locations/gangnam#clinic` |
| `Physician` (DoctorProfile) | `https://{domain}/doctors/{slug}#physician` | |
| `MedicalProcedure` (TreatmentPage) | `https://{domain}/treatments/{slug}#procedure` | |
| `MedicalCondition` (MedicalConditionPage) | `https://{domain}/conditions/{slug}#condition` | |
| `Article` | `https://{domain}/insights/{category}/{slug}#article` | |
| `WebSite` | `https://{domain}/#website` | |
| `WebPage` | `https://{domain}{path}#webpage` | 본문 페이지 entity |

> `@id`는 dereferenceable URL + fragment 형식. 같은 entity는 항상 같은 `@id`를 사용해 페이지 간 일관성 확보.

#### v0.1 path-based `@id` 임시 패턴 (PSR-CASCADE-02 · PUBLIC_SITE_RENDER_PLAN v0.x)

`PUBLIC_SITE_RENDER_PLAN.md` v0.x § 5.4 PSR-SEO-12 의 SSR + path-based routing 단계 (Phase 0) 에서는 도메인 매핑 (subdomain/custom domain) 합류 전이므로 **임시로 instanceSlug 가 path 에 들어간 `@id` 패턴** 을 사용한다:

| Entity | v0.1 path-based 임시 패턴 | M0 v1.0 도메인 매핑 후 (SoT 표 위) |
|---|---|---|
| `Organization` | `https://<host>/<instanceSlug>/#organization` | `https://<customDomain>/#organization` |
| `MedicalClinic` (`#clinic` 본원) | `https://<host>/<instanceSlug>/#clinic` | `https://<customDomain>/#clinic` |
| `Physician` | `https://<host>/<instanceSlug>/doctors/<slug>#physician` | `https://<customDomain>/doctors/<slug>#physician` |
| `MedicalProcedure` | `https://<host>/<instanceSlug>/treatments/<slug>#procedure` | `https://<customDomain>/treatments/<slug>#procedure` |
| `Article` | `https://<host>/<instanceSlug>/insights/<category>/<slug>#article` | `https://<customDomain>/insights/<category>/<slug>#article` |
| `WebSite` | `https://<host>/<instanceSlug>/#website` | `https://<customDomain>/#website` |
| `WebPage` | `https://<host>/<instanceSlug><path>#webpage` | `https://<customDomain><path>#webpage` |

**Entity continuity 전환 룰 (M0 v1.0 도메인 매핑 합류 시점)**:
- 도메인 매핑 후 entity `@id` 가 변경된다. 검색 엔진의 entity 연속성 (knowledge graph 등) 을 위해:
  - **HTTP 301 redirect**: v0.1 path-based URL → M0 도메인 매핑 URL (운영 트래픽 영향)
  - **`sameAs` 보조 marker**: M0 단계 Organization/MedicalClinic 의 `sameAs` 배열 에 v0.1 path-based URL 을 한시 (3~6 개월) 포함하여 entity identity 연속성 신호 제공
  - **sitemap 의 lastmod** 갱신 — 전환 시 모든 페이지 lastmod 1회 갱신해 재크롤 유도
- 본 전환 작업은 M0 v1.0 본 구현 cascade (PSR-DEFER-02 도메인 매핑) 와 동반.

### 1.3 entity Cross-reference

다른 entity 참조는 `@id`만 사용:

```json
{
  "@type": "Article",
  "@id": "https://example.com/insights/diet/yoyo#article",
  "author": { "@id": "https://example.com/doctors/hong#physician" },
  "publisher": { "@id": "https://example.com/#organization" }
}
```

전체 entity 정의는 페이지 그래프 안에 한 번만. 다른 위치는 `@id`만으로 참조.

### 1.4 단지점 vs 다지점 (SM-05 해소)

본원은 항상 단일 entity `#clinic`로 통일. 다지점의 비본원 지점만 별도 entity. **alias 사용 안 함** (entity identity 명확성).

| 인스턴스 형태 | Organization | MedicalClinic |
|---|---|---|
| **단지점** | `Organization`(`#organization`) 1개 | **`MedicalClinic`(`#clinic`) 1개** — LocationProfile(slug=`main`)에 매핑. P-014 페이지(URL `/locations/main`)의 mainEntity도 같은 `#clinic` (URL ≠ entity @id) |
| **다지점** | `Organization`(`#organization`) 1개 | **본원: `MedicalClinic`(`#clinic`)** — LocationProfile(slug=`main`). **비본원 지점들: `MedicalClinic`(`/locations/{slug}#clinic`)** 각각 별도 entity. 모두 `parentOrganization` = Organization |

> P-014 페이지가 단지점 main을 다룰 때도 entity @id는 `#clinic` 유지 — URL은 `/locations/main`이지만 mainEntity 참조는 `#clinic`. 다지점 비본원 지점 P-014만 `/locations/{slug}#clinic` entity 사용.

**`Organization` vs `MedicalClinic`의 책임 분리**:
- `Organization`: 법인 정체성 (ClinicProfile의 `legalEntityName`·`founder`·`foundingDate`·`awards`·`memberOf`·`affiliatedInstitutes`)
- `MedicalClinic`: 지점 단위 의료기관 정체성 (LocationProfile의 `address`·`telephone`·`openingHours`·`geo`·`medicalSpecialty` 등). `parentOrganization`으로 `Organization` 참조.

### 1.5 `inLanguage`

**CreativeWork 계열과 페이지 entity에만** `inLanguage` 명시 (기본 `"ko-KR"`). PageMeta.inLanguage를 따른다.

| 명시 | 명시 안 함 |
|---|---|
| `Article`·`NewsArticle`·`BlogPosting`·`WebPage`·`FAQPage`·`Blog`·`VideoObject`·`ImageObject` 등 CreativeWork 계열 | `Organization`·`MedicalClinic`·`LocalBusiness`·`Physician`·`Person`·`ContactPoint` 등 — Schema.org 표준상 inLanguage 속성 부재 또는 부적합 |

> Organization·MedicalClinic·Physician 같은 entity에 inLanguage를 박으면 validator 노이즈. 보조 메타로 헤더의 `<html lang="ko-KR">`·meta inLanguage가 이미 표시함 (SEARCH_STANDARDIZATION § 2.1 정합).

---

## 2. Schema 모듈 카탈로그

본 솔루션이 사용하는 Schema.org 타입과 사용 책임.

### 2.1 표준 Schema 모듈

| Schema 타입 | 사용처 | 매핑 데이터 계약 |
|---|---|---|
| `Organization` | 모든 페이지 (그래프에 1회) | ClinicProfile (C-01) |
| `WebSite` | **Home만 풀 엔티티 출력**. 나머지 페이지는 WebPage.isPartOf로 `#website` 참조만 (graph 비대화 방지) | (생성기 자동) |
| `WebPage` | 모든 페이지 — 본문 entity | PageMeta (C-06) |
| `BreadcrumbList` | Home 제외 모든 페이지 | (생성기 자동, 경로 기반) |
| `MedicalClinic` | 본원(`#clinic`) — § 2.5 정책에 따라 페이지별 풀/참조. 다지점 비본원 지점은 P-012·P-014에서 N개 entity | LocationProfile (C-21) |
| `LocalBusiness` | **별도 출력 안 함** — `MedicalClinic`이 LocalBusiness sub-class. LocalBusiness 계열 속성(`address`·`openingHoursSpecification`·`geo`·`hasMap`·`potentialAction.ReserveAction`)은 `MedicalClinic` entity 위에서 사용 | (해당 없음 — 데이터는 LocationProfile, 타입은 MedicalClinic) |
| `Physician` | P-004 Doctor Profile, Article의 author·reviewedBy | DoctorProfile (C-02) |
| `MedicalProcedure` | P-006 Treatment Detail | TreatmentPage (C-03) |
| `MedicalCondition` | P-008 Condition Detail | MedicalConditionPage (C-11) |
| `Article` | P-010 Article Detail | Article (C-04) |
| `NewsArticle` | (대체 — News 카테고리) | NewsItem (C-19) |
| `FAQPage` | P-011 FAQ (EAT v0.x EC-CASCADE-02 M0 합류 — graph self-contained · cross-page allowlist 미사용 · 빈 FAQ 0 row 도 `mainEntity: []` 허용) | FAQ[] (C-12) |
| `Question` / `Answer` | FAQPage.mainEntity (EAT v0.x — Answer.text = `renderMarkdownToPlainText(faq.answer)`) | FAQ |
| `ItemList` | List 페이지 (P-003·P-005·P-007·P-009·...) | (생성기 자동) |
| `Blog` | P-009 대체 (콘텐츠 운영 명확 시) | (선택) |
| `VideoObject` | (a) Article.embeddedMedia[].type=youtube·video, P-010의 contentFormat=video. (b) **EAT v0.x EC-CASCADE-02 (신규)**: MediaAppearance (C-25) 모든 channel_type 단일화 — fragment `#video-{slug}` (Doctor/About page 안 fragment-scoped inline). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1) | EmbeddedMedia · MediaAppearance (C-25) |
| `ScholarlyArticle` | **EAT v0.x EC-CASCADE-02 (신규)**: Publication (C-24) — Doctor Profile (P-004) · About (P-002) page 안 fragment-scoped inline (`@id` = `${pageBaseUrl}#publication-{slug}`). 별도 페이지는 EC-DEFER-02 (M1) | Publication (C-24) |
| `ImageObject` | 이미지 자산 (사진·로고·OG 등) | (생성기 자동) |
| `Person` | Author가 Physician이 아닌 경우 (`authorType` ≠ clinician) — **M0 외 후속** (현재 `Article.author: Ref<C-02>` 만 지원. authorType != clinician 케이스는 데이터 모델 확장 시 합류 — DM 추가) | (선택, M0 외) |
| `EducationalOrganization` / `MedicalOrganization` | `affiliatedInstitutes`·`memberOf` 참조 entity | ResearchInstitute, Affiliation |
| `PostalAddress` | Address 하위 | Address |
| `GeoCoordinates` | GeoCoordinates 하위 | GeoCoordinates |
| `OpeningHoursSpecification` | BusinessHours 하위 | OpeningHoursSpec |
| `ContactPoint` | 전화·이메일·CTA | (생성기 자동) |
| `SearchAction` | WebSite.potentialAction **Conditional** — `/search` 라우트가 실제 구현된 경우에만 출력. M0 미출력 | (생성기 자동) |
| `ReserveAction` | **MedicalClinic.potentialAction** — Conditional: **(a) `#clinic` 풀 entity가 출력되는 페이지에서만** + **(b) `LocationProfile.reservationChannels` 중 예약 채널이 실제 존재하거나 페이지/시술 CTA가 예약 채널일 때**. LocalBusiness 별도 미사용 | ReservationPage, LocationProfile.reservationChannels |

### 2.2 금지·주의 Schema — 요약 (상세는 § 8)

| Schema | 룰 레벨 | 이유 |
|---|---|---|
| `Review` (개별 후기) | **fail** | 의료광고법 — 후기·전후사진은 사전심의 대상. P-101 활성화 시에도 schema 미출력 + 법무 자문 |
| `AggregateRating` | **fail** | 의료기관 평점 표시 위반 소지 |
| `Offer`·`DrugCost`·`MedicalCost` | **fail** | 의료 가격 광고 제한 |
| `MedicalRiskFactor`·`MedicalRiskEstimator` | **fail** | 진단 단정형. 본문 표현은 content-gate |
| `MedicalIndication` (단정형 schema) | **fail** | 효능 단정. 본문 효능 표현은 content-gate |
| `MedicalGuideline` (자체 작성) | **fail** | 검증되지 않은 의료 권고 |
| `HealthInsurancePlan` | **fail** | 보험 광고 제한 |
| `MedicalDiagnosis`·`Quiz` | **fail** | 진단 단정 |
| `HealthAndBeautyBusiness` (단독·병행) | **fail** | MedicalClinic만 사용 |
| `SpecialAnnouncement` | content-gate | 평상 휴진 미출력. 중대 공지만 별도 정책 |

> 본 요약은 § 8 상세표와 일치한다. § 7.3에 룰 레벨 정의 (fail/warning/content-gate).

### 2.3 Schema 분류 — Rich Results 실효성 vs Entity 의미 전달

Schema는 두 가지 가치를 갖는다. 솔루션은 양쪽을 의식적으로 분리해 적용한다.

**A. Rich Results 직접 효과 (검색 결과 시각적 노출)**:
- `FAQPage` (Question/Answer) — FAQ 리치 결과
- `Article` / `BlogPosting` / `NewsArticle` — 기사 리치 카드
- `BreadcrumbList` — 빵부스러기 노출
- `VideoObject` — 비디오 캐러셀 (Google Rich Results 최소 필드 충족 시)
- `LocalBusiness` 계열 (`MedicalClinic` 포함) — 로컬 비즈니스 패널 (Google 비즈니스 프로필 연계)
- `Person` / `Physician` — 의료진 카드 (제한적)

> `HowTo`는 미사용 (M0 사용 계획 없음). 미래에 P-006 `visitFlow`·`process`를 HowTo로 매핑할 경우 카탈로그·결정표·의료 리스크 룰을 함께 추가해야 함 (SM 신규 필요).

**B. Entity 의미 전달 (검색 엔진의 entity 그래프 구성)**:
- `Organization` — 법인 identity
- `MedicalClinic` 본원·지점 — 의료기관 entity
- `Physician` — 의료진 entity (Rich Results는 제한적)
- `MedicalProcedure` / `MedicalCondition` — 의료 entity (Rich Results는 의료 분야 제한적)
- `WebPage` — 페이지 entity
- `WebSite` — 사이트 entity + SearchAction (Home에서만 풀)

> **운영 함의**: A 카테고리는 빌드 검증·콘텐츠 패턴 최적화 우선. B 카테고리는 검색 엔진 신뢰도·entity 그래프에 의미 전달. 의료 schema는 유효해도 Google Rich Results 혜택이 제한적이므로 **A 카테고리를 위주로 효율 추구, B 카테고리는 신뢰도 신호로 두는 전략**.

### 2.4 Schema 출력 결정 — Allowed / Conditional / Blocked

각 schema 타입에 대해 빌드 생성기가 결정 가능한 3단계 룰을 명시한다. 구현자가 "주의·신중·해당 시" 같은 모호한 표현으로 흔들리지 않도록.

| 결정 | 의미 |
|---|---|
| **Allowed** | 항상 출력 (해당 페이지 타입·계약 데이터 존재 시) |
| **Conditional** | 조건 충족 시 출력 — 조건은 schema별 명시 |
| **Blocked** | 출력 금지 — 빌드 시 검출하면 fail (§ 8) |

**Schema별 결정 (요약)**:

| Schema | 결정 | 조건/이유 |
|---|---|---|
| `Organization`·`WebSite` (Home)·`WebPage`·`BreadcrumbList` (Home 제외) | Allowed | |
| `MedicalClinic` | **§ 2.5 정책에 따라 full 또는 ref** | 본원(`#clinic`) 풀/참조 위치는 § 2.5 SoT. 다지점 비본원 지점은 P-012·P-014에 풀 |
| `Physician` 풀 엔티티 | Conditional | P-004 상세 페이지에서만 풀, 다른 페이지는 참조 |
| `MedicalProcedure` 풀 엔티티 | Conditional | P-006 상세 페이지에서만 풀 |
| `MedicalCondition` 풀 엔티티 | Conditional | P-008 상세 페이지에서만 풀 |
| `Article` 풀 엔티티 | Conditional | P-010 상세 페이지에서만 풀 |
| `FAQPage` | Conditional | P-011 또는 FAQ 블록 포함 페이지 (P-006·P-008·P-010 등) |
| `ItemList` | Conditional | List 페이지 (P-003·P-005·P-007·P-009) |
| `VideoObject` | Conditional | Article.contentFormat=video 또는 embeddedMedia.type∈{youtube, vimeo, external-video} (최소 필드 충족 시) |
| `ReserveAction` | Conditional | **(a) `#clinic` 풀 entity가 출력되는 페이지** + **(b) `LocationProfile.reservationChannels` 중 예약 채널(type∈{naver-reservation, video-consultation, external}) 있거나 페이지/시술 CTA가 예약 채널일 때** — 두 조건 모두 충족 시 `MedicalClinic.potentialAction`으로 출력 |
| `Review` | **Blocked** | 의료광고법 (§ 8) |
| `AggregateRating` | **Blocked** | 의료광고법 (§ 8) |
| `Offer`·`DrugCost`·`MedicalCost` | **Blocked** | 의료 가격 광고 제한 |
| `MedicalRiskFactor`·`MedicalRiskEstimator` (schema 출력) | **Blocked (fail)** | 진단 단정 위험 (§ 8). 본문 원인·위험요인 표현은 별도 content-gate (compliance-assistant) — schema 출력과 분리 |
| `MedicalIndication` (단정형 schema) | **Blocked (fail)** | 효능 단정 위험. Schema 출력 금지. 본문 효능 표현은 별도 content-gate (compliance-assistant) |
| `MedicalGuideline` | **Blocked** | 자체 작성 의료 권고 위반 소지 |
| `HealthInsurancePlan` | **Blocked** | 보험 광고 제한 |
| `HealthAndBeautyBusiness` | **Blocked (fail)** | 의료기관 사이트는 `MedicalClinic`만 사용. 단독·병행 모두 미사용 |
| `SpecialAnnouncement` | Conditional → 사실상 미출력 | 평상 휴진은 본문/메타. 중대 공지(예: 보건 위기 대응)만 별도 정책 |
| `Quiz` (비표준)·`MedicalDiagnosis` | **Blocked** | P-106 Self-test는 `WebPage`·`MedicalWebPage`로 |
| `Person` — Organization.founder | Allowed (inline) | 항상 허용 — Organization 내부에서 founder를 Person으로 inline 표현 |
| `Person` — Article.author (authorType != clinician) | M0 외 후속 | M0는 Physician만 지원. 데이터 모델 확장 시 합류 |

### 2.5 공통 entity별 페이지 출력 정책 (단일 SoT)

> 페이지별 graph 구성(§ 3·§ 4)의 단일 진실 원본. 같은 정책이 다른 섹션에서 다르게 표현되면 본 표가 우선.

**용어 정의**:
- **풀 entity (Full)**: graph[]에 entity 정의 — `@type`, `@id`, 필드 모두 출력
- **참조 (Ref)**: graph[]에 entity 정의 없음. 다른 entity의 속성에 `{"@id": "..."}` 참조만 (예: `Article.publisher = {"@id": "#organization"}`)

| Entity | 정책 | 페이지 |
|---|---|---|
| `Organization` (`#organization`) | **모든 페이지에 풀 entity 1회 포함** | P-001 ~ P-014, P-101 ~ P-106 |
| `WebSite` (`#website`) | **Home만 풀 entity** | P-001 |
| `WebSite` 참조 | **Home 외 모든 페이지 WebPage.isPartOf로 참조** | P-002 ~ |
| `MedicalClinic` (`#clinic` 본원) | **풀 entity 출력** — 위치·시간·연락이 본문에 의미 있게 표시되거나 예약 action이 풀 entity로 필요한 페이지 | P-001(Home), P-002(About), P-006(Treatment Detail — 예약 CTA·담당 의료진 연계), P-012(Contact), P-014(Location main), P-105(Reservation — 예약 action 풀 필요) |
| `MedicalClinic` 참조 | **참조만** — 위치 정보가 페이지 본문에 표시되지 않는 페이지 | P-003(Doctors List), P-004(Doctor Profile), **P-005(Treatments List — 시술 카드 목록 위주, 위치 슬롯 없음)**, P-007/8(Conditions), P-009/10(Articles), P-011(FAQ), P-013(Legal), P-101(Reviews), P-102(Pricing), P-103(Facilities), P-104(News), P-106(Self-test) |
| `MedicalClinic` 지점 (`/locations/{slug}#clinic`) | 다지점만, P-012·P-014에 풀 entity | 다지점 P-012·P-014 |
| `BreadcrumbList` | **Home 제외 모든 페이지 풀** | P-002 ~ |
| `WebPage` | **모든 페이지 풀** (각 페이지의 본문 entity) | 전 페이지 |
| `Physician`, `MedicalProcedure`, `MedicalCondition`, `Article`, `FAQPage` | 상세 페이지에서 풀, 다른 페이지(목록·연관 참조)에서 참조 또는 inline 최소 | § 3 참조 |

> § 7.1 빌드 룰 checker는 본 표를 기준으로 페이지별 필수 풀 entity 존재 여부를 검증한다.

---

## 3. 페이지 타입별 Schema 그래프 (M0 필수 14종)

각 페이지 타입의 graph 구성 + 핵심 필드 + 매핑 출처.

### P-001. Home

**Graph 구성**:
1. `Organization` (ClinicProfile)
2. `MedicalClinic` (LocationProfile main) — 본원
3. `WebSite` (SearchAction 포함)
4. `WebPage` (Home의 본문 entity)

**Organization 필드 매핑**:

| Schema 필드 | 출처 (ClinicProfile) |
|---|---|
| `@type` | `"Organization"` |
| `@id` | `https://{domain}/#organization` |
| `name` | `name` |
| `alternateName` | `alternateName` |
| `legalName` | `legalEntityName` |
| `description` | `description` |
| `slogan` | `slogan` |
| `url` | `https://{domain}` |
| `logo` | `logoUrl` → `ImageObject` |
| `founder` | `founder` → `Person` |
| `foundingDate` | `foundingDate` |
| `award` | `awards[].name` |
| `memberOf` | `memberOf[]` → `Organization`(학회) |
| `subOrganization` | `affiliatedInstitutes[]` → `Organization`(연구소) |
| `sameAs` | `socialMedia.*` 배열로 변환 |
| `knowsAbout` | `medicalSpecialty[]` (보조) |
| `contactPoint` | `primaryCtas[]` 중 phone·email → `ContactPoint` |

**MedicalClinic 필드 매핑 (본원, LocationProfile main)**:

| Schema 필드 | 출처 (LocationProfile main) |
|---|---|
| `@type` | `"MedicalClinic"` |
| `@id` | `https://{domain}/#clinic` |
| `name` | `name` |
| `parentOrganization` | `{"@id": "https://{domain}/#organization"}` |
| `address` | `address` → `PostalAddress` |
| `telephone` | `telephone` |
| `email` | `email` |
| `openingHoursSpecification` | `businessHours.openingHours[]` → `OpeningHoursSpecification[]` |
| `geo` | `geo` → `GeoCoordinates` |
| `medicalSpecialty` | ClinicProfile.medicalSpecialty 또는 LocationProfile 특화 |
| `potentialAction` | `reservationChannels[]` 중 예약 채널 **또는 페이지/시술 CTA가 예약 채널**일 때 → `ReserveAction` (Conditional, § 2.1·§ 2.4 참조) |

**WebSite 필드 (Home에서만 풀 엔티티 출력 — § 2.5)**:

```json
{
  "@type": "WebSite",
  "@id": "https://{domain}/#website",
  "url": "https://{domain}",
  "name": "{ClinicProfile.name}",
  "publisher": { "@id": "https://{domain}/#organization" },
  "inLanguage": "ko-KR"
}
```

**`potentialAction.SearchAction` 추가 조건 (Conditional)** — 사이트 내 검색 기능이 실제 구현되고 `/search` 라우트가 존재할 때만:

```json
"potentialAction": {
  "@type": "SearchAction",
  "target": "https://{domain}/search?q={search_term_string}",
  "query-input": "required name=search_term_string"
}
```

> PAGE_TYPES.md PT-03(Search 페이지)이 Phase Beta+ 미결정 상태이므로 M0에서는 SearchAction 미출력. 검색 기능 활성화 시 빌드 트리거.

**다른 페이지의 WebSite 참조**: WebPage 엔티티에 `isPartOf: { "@id": "https://{domain}/#website" }` 참조만. 풀 엔티티 미출력.

**WebPage 필드**: PageMeta 매핑 (title·description·canonical·image) + `isPartOf: {@id: "#website"}` (Home 외).

**BreadcrumbList**: Home에는 미적용.

---

### P-002. About

**Graph 구성**:
1. `Organization` (법인 identity 풀필드)
2. `MedicalClinic` (본원 — 주소·시간·연락 SoT)
3. `BreadcrumbList`
4. `WebPage` (about page)

**Organization**: P-001과 동일하되 **풀필드 노출** (about에서 가장 풍부) — `legalName`·`founder`·`foundingDate`·`award`·`memberOf`·`subOrganization`·`sameAs` 모두 포함. **`address`는 매핑하지 않음** — LocationProfile/MedicalClinic이 SoT.

**mediaCoverage 처리**: Schema.org `Organization`에 `mediaCoverage` 표준 속성이 없으므로 직접 매핑 안 함. 대신:
- 외부 미디어 링크 (인터뷰·기고 URL)는 `sameAs` 배열 끝에 보조 추가 또는
- 본문에 별도 `CreativeWork[]` 또는 `Article[]` entity로 표현 (외부 매체 기사의 경우 `isBasedOn`/`citation`)
- 단순 본문 콘텐츠 표시가 가장 안전

**BreadcrumbList**:
```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://{domain}/" },
    { "@type": "ListItem", "position": 2, "name": "About", "item": "https://{domain}/about" }
  ]
}
```

---

### P-003. Doctors List

**Graph 구성**:
1. `Organization` — **[풀]**
2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
3. `WebPage` (list page) — **[풀]**, `isPartOf: #website`
4. `BreadcrumbList` — **[풀]**
5. `ItemList` (의료진 목록) — **[풀]** — `itemListElement[]`에 최소 inline 필드 + `@id` 참조

```json
{
  "@type": "ItemList",
  "@id": "https://{domain}/doctors#itemlist",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Physician",
        "@id": "https://{domain}/doctors/hong#physician",
        "name": "{DoctorProfile.name}",
        "url": "https://{domain}/doctors/hong",
        "image": "{DoctorProfile.photoUrl}",
        "jobTitle": "{DoctorProfile.jobTitle}"
      }
    }
  ]
}
```

> 정책 변경 (피드백 반영): 목록에는 `name`·`url`·`image`·`jobTitle` 등 **최소 inline 필드** 포함 (검색 엔진이 외부 fragment를 따라가지 않는 경우 대응). 각 Physician 풀필드는 P-004 상세 페이지의 그래프에서 정의.

---

### P-004. Doctor Profile

**Graph 구성**:
1. `Organization` — **[풀]**
2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
3. `Physician` (DoctorProfile 풀필드) — **[풀]**
4. `BreadcrumbList` — **[풀]**
5. `WebPage` — **[풀]**, `isPartOf: #website`

**Physician 필드 매핑**:

| Schema 필드 | 출처 (DoctorProfile) |
|---|---|
| `@type` | `"Physician"` |
| `@id` | `https://{domain}/doctors/{slug}#physician` |
| `name` | `name` |
| `alternateName` | `alternateName` |
| `jobTitle` | `jobTitle` |
| `description` | `briefBio` |
| `image` | `photoUrl` → `ImageObject` |
| `medicalSpecialty` | `medicalSpecialty[]` |
| `hasCredential` | `credentials[]` → `EducationalOccupationalCredential` |
| `alumniOf` | `education[]` → `EducationalOrganization` |
| `worksFor` | `{"@id": "https://{domain}/#organization"}` |
| `affiliation` | `affiliations[]` → `Organization` |
| `memberOf` | `affiliations[]` (보조) |
| `email` | `email` |
| `sameAs` | `socialMedia.*` 배열 |

**Note**: `personalStory`·`philosophy`는 본문에 표시되지만 schema에는 비매핑 (의료 schema에 적절한 표현 없음 — `description`에 일부 흡수 가능).

---

### P-005. Treatments List

**Graph 구성**:
1. `Organization` — **[풀]**
2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5 — 시술 카드 목록 위주, 위치 정보 슬롯 없음)
3. `WebPage` — **[풀]**, `isPartOf: #website`
4. `BreadcrumbList` — **[풀]**
5. `ItemList` — **[풀]** — 최소 inline + `@id` 참조 (P-003과 동일 패턴)

```json
{
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "MedicalProcedure",
        "@id": "https://{domain}/treatments/{slug}#procedure",
        "name": "{TreatmentPage.name}",
        "url": "https://{domain}/treatments/{slug}",
        "description": "{TreatmentPage.summary}"
      }
    }
  ]
}
```

---

### P-006. Treatment Detail

**Graph 구성**:
1. `Organization` — **[풀]**
2. `MedicalClinic` (본원) — **[풀]** (§ 2.5 — 예약 CTA·담당 의료진 연계로 풀 entity 필요)
3. `MedicalProcedure` (TreatmentPage 풀필드) — **[풀]**
4. `BreadcrumbList` — **[풀]**
5. `WebPage` — **[풀]**, `isPartOf: #website`
6. (FAQ 블록 포함 시) `FAQPage` — **[풀]** (Conditional)

**MedicalProcedure 필드 매핑**:

| Schema 필드 | 출처 (TreatmentPage) |
|---|---|
| `@type` | `"MedicalProcedure"` |
| `@id` | `https://{domain}/treatments/{slug}#procedure` |
| `name` | `name` |
| `alternateName` | `alternateName` |
| `description` | `summary` (또는 `overview` 단축) |
| `procedureType` | `category` (해당 시) |
| `howPerformed` | `mechanism` (Markdown → 평문) |
| `preparation` | `process[]` 중 사전 준비 단계 + 본 시술 전 단계 |
| `followup` | `aftercare` + `maintenancePlan` (요약) |
| `bodyLocation` | (해당 시 — 다이어트 한의원은 일반적으로 없음) |
| `medicalSpecialty` | `medicalSpecialty` |
| `citation` | `evidenceNotes[]` → `CreativeWork[]` 또는 단순 URL 배열 (`MedicalStudy`는 EvidenceNote 필드로 구성 부족하므로 사용 안 함) |

**주의**:
- `targetAudience`·`recommendedFor` 필드는 schema.org에 직접 매핑 없음 → `description` 보조 또는 `audience` (broad)
- `programVariants`는 schema 미매핑 — 본문 콘텐츠로만
- 위험도 격상 조건이 적용된 슬롯은 schema 출력 자체에서 단정형 표현 회피

**FAQPage** (해당 시):

```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "{faq.question}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{faq.answer (Markdown → 평문)}"
      }
    }
  ]
}
```

---

### P-007. Conditions List

**Graph 구성**:
1. `Organization` — **[풀]**
2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
3. `WebPage` — **[풀]**, `isPartOf: #website`
4. `BreadcrumbList` — **[풀]**
5. `ItemList` — **[풀]** — 최소 inline (`name`·`url`·`description`) + `MedicalCondition` `@id` 참조 (P-003·P-005 패턴 동일)

### P-008. Condition Detail

**Graph 구성**:
1. `Organization` — **[풀]**
2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
3. `MedicalCondition` (풀필드) — **[풀]**
4. `BreadcrumbList` — **[풀]**
5. `WebPage` — **[풀]**, `isPartOf: #website`
6. (FAQ) `FAQPage` — **[풀]** (Conditional)

**MedicalCondition 필드**:

| Schema 필드 | 출처 (MedicalConditionPage) |
|---|---|
| `@type` | `"MedicalCondition"` |
| `@id` | `https://{domain}/conditions/{slug}#condition` |
| `name` | `name` |
| `description` | `definition` (+ `causes[]` 일부 일반론을 description 보조 텍스트로 흡수 가능) |
| `signOrSymptom` | `symptoms[]` → `MedicalSignOrSymptom` |
| `possibleTreatment` | `treatmentOptions[]` → MedicalProcedure 참조 |

> `MedicalRiskFactor` schema는 **출력하지 않음** (§ 2.4·§ 8 fail). `causes[]`는 본문 표현으로만 노출. 본문의 원인·위험요인 표현은 content-gate(compliance-assistant)가 검수 — schema 룰과 본문 룰 분리.

### P-009. Articles List

**Graph 구성**:
1. `Organization` — **[풀]**
2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
3. `WebPage` — **[풀]**, `isPartOf: #website`
4. `BreadcrumbList` — **[풀]**
5. `ItemList` 또는 `Blog` — **[풀]**

`ItemList` 사용 (권장 — Rich Results A 카테고리 대상):
```json
{
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Article",
        "@id": "https://{domain}/insights/{cat}/{slug}#article",
        "headline": "{Article.headline}",
        "url": "https://{domain}/insights/{cat}/{slug}",
        "image": "{Article.coverImageUrl}",
        "datePublished": "{Article.datePublished}",
        "author": { "@id": "https://{domain}/doctors/{author.slug}#physician" }
      }
    }
  ]
}
```

`Blog` 사용 시 (콘텐츠 운영 명확 표시):
```json
{
  "@type": "Blog",
  "@id": "https://{domain}/insights#blog",
  "name": "{Articles List title}",
  "publisher": { "@id": "https://{domain}/#organization" },
  "blogPost": [
    { "@id": "https://{domain}/insights/{cat}/{slug}#article" }
  ],
  "inLanguage": "ko-KR"
}
```

### P-010. Article Detail

**Graph 구성** (entity별 [풀]/[참조+inline 최소]/[참조만] 표기):
1. `Organization` — **[풀]** (§ 2.5: 모든 페이지 풀)
2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
3. `Article` — **[풀]**
4. `Physician` (author) — **[참조 + inline 최소: name·image·jobTitle]** (실효성 위해 인라인)
5. `Physician` (reviewedBy, 해당 시) — **[참조 + inline 최소]**
6. `BreadcrumbList` — **[풀]**
7. `WebPage` — **[풀]**, `isPartOf: #website`
8. (Q&A 블록 포함 시) `FAQPage` — **[풀]** (Conditional)
9. (contentFormat=video 또는 embeddedMedia.type∈{youtube,vimeo,external-video} 시) `VideoObject` — **[풀, 최소 필드 충족]** (Conditional)

**Article 필드 매핑**:

| Schema 필드 | 출처 (Article) |
|---|---|
| `@type` | `"Article"` (또는 `"BlogPosting"`·`"NewsArticle"` 변형) |
| `@id` | `https://{domain}/insights/{cat}/{slug}#article` |
| `headline` | `headline` |
| `description` | `summary` |
| `articleBody` | `body` (Markdown → 평문 권장, schema validator 호환) |
| `articleSection` | ArticleCategory.name |
| `datePublished` | `datePublished` |
| `dateModified` | `dateModified` |
| `author` | `{"@id": "https://{domain}/doctors/{author.slug}#physician"}` |
| `editor` | `reviewedBy` (해당 시) → Physician @id |
| `publisher` | `{"@id": "https://{domain}/#organization"}` |
| `mainEntityOfPage` | `{"@id": "https://{domain}{path}#webpage"}` |
| `image` | `coverImageUrl`·`ogImageUrl` → `ImageObject` |
| `wordCount` | `wordCount` |
| `keywords` | `tags[]` (해당 시) |
| `isAccessibleForFree` | `true` |
| `inLanguage` | `"ko-KR"` |
| `about` | 관련 시술·질환 entity (`relatedTreatments`·`relatedConditions`) @id |
| `citation` | `embeddedMedia[].url` 중 `type=citation`·`external-video` 항목 |

**VideoObject** (contentFormat=video 또는 embeddedMedia에 youtube/vimeo 포함 시) — Google Rich Results 최소 필드 충족:

```json
{
  "@type": "VideoObject",
  "name": "{EmbeddedMedia.title 또는 Article.headline}",
  "description": "{EmbeddedMedia.caption 또는 Article.summary}",
  "thumbnailUrl": "{Article.coverImageUrl 또는 EmbeddedMedia 추출 썸네일}",
  "uploadDate": "{Article.datePublished}",
  "contentUrl": "{EmbeddedMedia.url}",
  "embedUrl": "{EmbeddedMedia.url}",
  "duration": "PT{durationSeconds}S",
  "transcript": "{EmbeddedMedia.transcriptUrl}",
  "inLanguage": "ko-KR"
}
```

**필수 필드** (누락 시 VideoObject 출력 안 함 — Google Rich Results 기준):
- `name`, `description`, `thumbnailUrl`, `uploadDate` (4개 모두 필수)
- 그리고 `contentUrl` 또는 `embedUrl` **중 최소 1개**

**Note**: Article의 `contentSource` (original/syndicated/republished)와 `externalUrl`은 schema 직접 매핑 X. `republished`·`syndicated`인 경우 `isBasedOn`: `externalUrl`로 표현.

### P-011. FAQ

**Graph 구성**:
1. `Organization` — **[풀]**
2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
3. `FAQPage` (Question/Answer) — **[풀]**
4. `BreadcrumbList` — **[풀]**
5. `WebPage` — **[풀]**, `isPartOf: #website`

**FAQPage**: 위 P-006 FAQPage와 동일 구조. 페이지 전체가 Question 모음일 때 `mainEntity` 배열.

### P-012. Contact / Visit (Conversion Hub)

**Graph 구성**:
1. `Organization` — **[풀]**
2. `MedicalClinic` (본원 `#clinic`) — **[풀]** (§ 2.5 — Conversion Hub 핵심 entity)
3. (다지점 시) `MedicalClinic` (비본원 지점 `/locations/{slug}#clinic`) — **[풀]** 각각
4. `BreadcrumbList` — **[풀]**
5. `WebPage` — **[풀]**, `isPartOf: #website`
6. (다지점) `ItemList` — **[풀]** → 각 지점 `MedicalClinic` @id 참조

**다지점 처리**:

```json
{
  "@graph": [
    { "@type": "Organization", "@id": "https://{domain}/#organization", ... },
    { "@type": "MedicalClinic", "@id": "https://{domain}/#clinic", ... },      // 본원
    { "@type": "MedicalClinic", "@id": "https://{domain}/locations/gangnam#clinic", ... },
    { "@type": "MedicalClinic", "@id": "https://{domain}/locations/bundang#clinic", ... },
    { "@type": "ItemList", "itemListElement": [...] }
  ]
}
```

**예약·상담 채널 표현** (`reservationChannels: CTAConfig[]`):

각 CTAConfig는 `MedicalClinic.potentialAction` 또는 `contactPoint`로 변환.

```json
"potentialAction": [
  {
    "@type": "ReserveAction",
    "target": "https://booking.naver.com/...",
    "name": "네이버 예약"
  }
],
"contactPoint": [
  {
    "@type": "ContactPoint",
    "telephone": "+82-2-1234-5678",
    "contactType": "reservation"
  }
]
```

### P-013. Legal / Policy

**Graph 구성**:
1. `Organization` — **[풀]**
2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
3. `WebPage` — **[풀]**, `isPartOf: #website`
4. `BreadcrumbList` — **[풀]**

**Note**: 정책 페이지는 검색 노출 우선순위 낮음. `MedicalSchema`·`Article` 적용 안 함. 단순 `WebPage`로 표현.

### P-014. Location / Branch Detail

**Graph 구성**:
1. `Organization` — **[풀]**
2. `MedicalClinic` (해당 지점 풀필드) — **[풀]** — `parentOrganization` Organization 참조
   - **단지점 main**: `@id` = `https://{domain}/#clinic` (URL은 `/locations/main`이지만 entity는 본원 `#clinic`과 동일)
   - **다지점 비본원**: `@id` = `https://{domain}/locations/{slug}#clinic` (별도 entity)
3. `BreadcrumbList` — **[풀]**
4. `WebPage` — **[풀]**, `isPartOf: #website`

**MedicalClinic 필드 매핑 (지점 LocationProfile)**:

P-001의 본원 `MedicalClinic`과 동일 구조 + 다음:

| Schema 필드 | 출처 |
|---|---|
| `branchOf` | `{"@id": "https://{domain}/#organization"}` |
| `parentOrganization` | 동일 |
| `image` | `images[]` → `ImageObject[]` |

> 본원(`@id: #clinic`)과 지점(`@id: /locations/{slug}#clinic`)은 다른 entity. `branchOf`는 Schema.org의 LocalBusiness 계열에서 더 적합 (MedicalClinic은 `parentOrganization`을 우선).

---

## 4. 페이지 타입별 Schema 매핑 (선택 7종 — 간략)

### P-101. Reviews
**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀].
**주의**: `Review`/`AggregateRating` 사용 **금지** (의료광고법 — § 8 참조). 후기 페이지는 schema 빈약하더라도 의도된 선택.

### P-102. Pricing
**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀].
**주의**: `Offer` schema **사용 안 함** (의료 가격 광고 제한). 본문 정보만 표시.

### P-103. Facilities / Equipment
**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀]. 사진은 본문 갤러리 또는 `WebPage.image: ImageObject[]`로 표현 (`ImageGallery`는 사용 안 함 — 카탈로그·결정표 미등재).

### P-104. News / Event
**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀] + (개별 News 항목) `NewsArticle` 또는 `Article`[풀].
**주의**: 이벤트 카테고리는 `Offer`·할인 schema 안 함.

### P-105. Reservation
**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[**풀**, § 2.5 — 예약 action 풀 entity 필요] + `WebPage`[풀] + `BreadcrumbList`[풀].
`MedicalClinic.potentialAction`에 `ReserveAction` 상세 필드 포함 (P-012와 유사하되 예약 안내 페이지답게 채널·시간·절차 등 상세 명시). ReserveAction은 독립 풀 entity가 아닌 `MedicalClinic.potentialAction`에 중첩되는 구조.

### P-106. Self-test / Quiz
**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage` 또는 `MedicalWebPage`[풀] + `BreadcrumbList`[풀]. **`Quiz`·`MedicalDiagnosis`·`MedicalRiskEstimator`는 fail** (§ 2.4·§ 8). 일반 정보 형태의 `MedicalWebPage` 또는 단순 `WebPage`만.

---

## 5. 데이터 계약 ↔ Schema 필드 매핑 (참조 인덱스)

| 데이터 계약 | 매핑 Schema | 비고 |
|---|---|---|
| C-01 `ClinicProfile` | `Organization` | 브랜드·법인 identity. 위치·시간·연락은 LocationProfile로 위임 |
| C-02 `DoctorProfile` | `Physician` | M0는 `Article.author: Ref<C-02>`만 지원. 비의료인 author(`authorType` != `clinician`) → `Person` 매핑은 데이터 모델 확장 후 합류 (M0 외) |
| C-03 `TreatmentPage` | `MedicalProcedure` | `programVariants`·`recommendedFor`·`visitFlow`는 비매핑 (본문) |
| C-04 `Article` | `Article` (또는 `BlogPosting`·`NewsArticle` 변형). VideoObject 동반 가능 | `contentSource` → `isBasedOn` |
| C-05 `RiskLevel` | (비매핑) | 운영 메타. 빌드 참조용. schema 출력 시 표현 신중성에만 영향 |
| C-06 `PageMeta` | `WebPage` 필드 일부 + head meta tag | 상세는 `SEARCH_STANDARDIZATION.md` |
| C-07 `BrandTokens` | (비매핑) | UI 렌더링 |
| C-08 `InstanceManifest` | (비매핑) | 빌드 메타 |
| C-09 `FeatureModuleConfig` | (비매핑) | |
| C-10 `ComplianceRecord` | (비매핑 — 운영 메타) | Git 사본의 `publishedAt`·`lastModifiedAt`은 Article.datePublished/dateModified로 사용됨 |
| C-11 `MedicalConditionPage` | `MedicalCondition` | |
| C-12 `FAQ` | `FAQPage.mainEntity[].Question/Answer` | |
| C-13 `ReviewPolicy` | (비매핑) | P-101 활성화 시 schema 정책 결정 |
| C-14 `MedicalSpecialty` | enum 문자열로 매핑 (Schema.org `MedicalSpecialty` enum 값) | |
| C-15 `SchemaInput` | **(인터페이스 — § 6에서 정식 정의)** | |
| C-16 `LegalDocument` | `WebPage`만 (정책 페이지는 검색 노출 우선순위 낮음) | |
| C-17 `PricingPage` | (Schema 비사용) | `Offer` 부적합 |
| C-18 `FacilitiesPage` | `WebPage` + 사진 갤러리 | |
| C-19 `NewsItem` | `Article` 또는 `NewsArticle` | event-price 카테고리는 schema 신중 |
| C-20 `ReservationPage` | `MedicalClinic.potentialAction.ReserveAction` (LocalBusiness 별도 출력 안 함) | |
| C-21 `LocationProfile` | `MedicalClinic` (지점 단위 별도 entity. LocalBusiness sub-class) | 본원·지점 각각 |
| C-22 `ArticleCategory` | (비매핑) — Article.articleSection 문자열 | |

| 공통 타입 (CT) | 매핑 Schema |
|---|---|
| CT-01 `TrustMetric` | (비매핑) — 본문 콘텐츠로만. schema는 사실 안내형 description 보조 |
| CT-02 `BusinessHours` | `OpeningHoursSpecification[]` (receptionHours·lunchBreaks·specialClosures는 별도 매핑 룰 — 아래) |
| CT-03 `CTAConfig` | `ContactPoint` / `potentialAction` (ReserveAction·CommunicateAction) |

### 5.1 BusinessHours 매핑 상세

| BusinessHours 필드 | Schema 출력 | 결정 |
|---|---|---|
| `openingHours[]` | `OpeningHoursSpecification[]` (dayOfWeek·opens·closes) | Allowed |
| `receptionHours[]` | `OpeningHoursSpecification[]` (별도 항목, `description: "접수 시간"` 보조) — Schema.org 직접 매핑 부재 | Conditional (출력 시 description 명시) |
| `lunchBreaks[]` | 본문·메타 표시 우선. schema는 `description` 보조만 | Conditional → 사실상 미출력 |
| `specialClosures[]` | **schema 기본 미출력**. 중대 공지(보건 위기 등)만 `SpecialAnnouncement` 별도 정책. 평상 휴진은 본문/메타/Google Business Profile 활용 | Blocked (default) → 별도 정책 시만 Conditional |
| `holidayPolicy` | `description` 보조 | Conditional |

#### dayOfWeek enum 변환표 (내부 ↔ Schema.org)

| 내부 (BusinessHours) | Schema.org `DayOfWeek` 표준 값 |
|---|---|
| `Mon` | `https://schema.org/Monday` 또는 `Monday` |
| `Tue` | `https://schema.org/Tuesday` |
| `Wed` | `https://schema.org/Wednesday` |
| `Thu` | `https://schema.org/Thursday` |
| `Fri` | `https://schema.org/Friday` |
| `Sat` | `https://schema.org/Saturday` |
| `Sun` | `https://schema.org/Sunday` |
| `PublicHoliday` | `https://schema.org/PublicHolidays` |

> 빌드 생성기는 OpeningHoursSpecification 출력 시 내부 enum을 Schema.org 표준 값으로 자동 변환.

### 5.2 CTAConfig 매핑 상세

| CTAConfig.type | Schema 표현 |
|---|---|
| `phone` | `ContactPoint{contactType: "reservation"·"customer service", telephone}` |
| `naver-reservation` | `ReserveAction{target: targetUrl, name: "네이버 예약"}` |
| `naver-talk`·`kakao-talk`·`kakao-channel` | `ContactPoint{contactType: "customer service", url}` 또는 `CommunicateAction` |
| `form` | (schema 미적용 — 본문 폼) |
| `map` | `MedicalClinic.hasMap`: targetUrl |
| `external` | `potentialAction` 일반 또는 schema 미적용 |
| `sms`·`email` | `ContactPoint` |
| `video-consultation` | `ReserveAction` 또는 `CommunicateAction` |

---

## 6. SchemaInput 인터페이스 (C-15 정식 정의)

`SchemaInput`은 페이지 빌드 시 schema 생성기에 입력되는 정규화된 데이터 묶음. 페이지 타입별로 다른 형태이지만 공통 부분 존재.

### 6.1 공통 SchemaInput

```ts
type SchemaInput = {
  pageType: PageType;         // P-001 ~ P-014, P-101 ~ P-106
  pageMeta: PageMeta;          // C-06
  canonicalUrl: URL;
  inLanguage: string;          // 기본 "ko-KR"
  clinic: ClinicProfile;       // C-01 — 전 페이지 공통
  mainLocation: LocationProfile;  // C-21 main — 전 페이지 공통 (Organization 외 본원 entity)
  allLocations: LocationProfile[]; // 다지점 시. P-012·P-014 등에서 사용
  breadcrumbItems: BreadcrumbItem[]; // (Home 제외) BreadcrumbList 생성용
};

type BreadcrumbItem = {
  position: number;
  name: string;
  url: URL;
};
```

### 6.2 페이지 타입별 추가 입력

| 페이지 타입 | 추가 입력 필드 |
|---|---|
| P-004 Doctor Profile | `doctor: DoctorProfile` |
| P-006 Treatment Detail | `treatment: TreatmentPage`, `relatedDoctors: DoctorProfile[]`, `relatedConditions: MedicalConditionPage[]`, `faqs: FAQ[]` |
| P-008 Condition Detail | `condition: MedicalConditionPage`, `relatedTreatments: TreatmentPage[]`, `faqs: FAQ[]` |
| P-010 Article Detail | `article: Article`, `author: DoctorProfile`, `reviewer?: DoctorProfile`, `relatedArticles: Article[]`, `relatedTreatments: TreatmentPage[]` |
| P-011 FAQ | `faqs: FAQ[]` |
| P-014 Location Detail | `location: LocationProfile`, `doctorsAtLocation: DoctorProfile[]`, `treatmentsAvailable: TreatmentPage[]` |
| List 페이지 (P-003·P-005·P-007·P-009) | `items: T[]` (해당 entity 메타) |

### 6.3 Schema 생성기 출력

`SchemaGenerator.generate(input: SchemaInput): JsonLdGraph`

```ts
type JsonLdGraph = {
  "@context": "https://schema.org";
  "@graph": SchemaEntity[];
};
```

생성기는 페이지 타입별 § 3·§ 4의 graph 구성 표준에 따라 entity 배열을 출력.

---

## 7. 빌드 시 검증

### 7.1 필수 필드 검증

| 페이지 타입 | 필수 entity / 필드 |
|---|---|
| **공통 일반 룰 (§ 2.5 정합)** | **§ 2.5에서 "풀"로 지정된 entity는 해당 페이지 graph에 풀필드 출력 필수**. 누락 시 빌드 실패. **선택 페이지(P-101~P-106)는 인스턴스에서 활성화된 경우에만 검증** (`FeatureModuleConfig`·`InstanceManifest`·라우트 설정 기준 — P-103·P-104·P-105는 Instance 결정, P-106은 Feature Module 기반 등 활성화 경로가 페이지별로 다를 수 있음) |
| 모든 페이지 | `Organization`·`WebPage`[풀] + PageMeta의 `title`·`description` + **resolved canonical URL** (PageMeta.canonical 또는 SchemaInput.canonicalUrl로 결정. 둘 다 부재 시 빌드 실패) |
| Home 제외 | `BreadcrumbList` |
| P-001·P-002·P-006·P-012·P-014 (필수) / P-105 (활성화 시) | **`MedicalClinic` 풀** (§ 2.5 풀 지정) + `name`·`address`·`telephone`·`openingHoursSpecification` |
| P-004 | `Physician` + `name`·`jobTitle`·`medicalSpecialty`·`hasCredential` |
| P-006 | `MedicalProcedure` + `name`·`description`·`howPerformed` |
| P-008 | `MedicalCondition` + `name`·`description` |
| P-010 | `Article` + `headline`·`description`·`datePublished`·`author`·`publisher` |
| P-011 | `FAQPage` + `mainEntity[]` 최소 1개 |

누락 시 **빌드 실패**.

### 7.2 빌드 게이트 vs 운영 모니터링 분리

| 검증 단계 | 도구 | 실패 시 |
|---|---|---|
| **빌드 게이트 (CI)** | 자체 JSON schema validator + 본 문서 룰 checker (필수 필드·금지 schema·Conditional 조건) | **빌드 실패** |
| **빌드 게이트 (Sanity)** | JSON-LD 파싱 가능 여부·@id uniqueness·@context 유효성 | 빌드 실패 |
| **운영 모니터링 (수동·정기)** | schema.org official validator, Google Rich Results Test, 자체 대시보드 | 경고·이슈 트래커 |

> 공식 validator는 안정적 CLI가 없어 CI 빌드 게이트로 부적합. 빌드 게이트는 자체 룰 checker로 결정 가능한 항목만, 외부 validator는 모니터링·수동 QA 단계로 분리.

### 7.3 룰 레벨 분류 (§ 8 금지·주의 schema 처리)

| 레벨 | 정의 | 조치 |
|---|---|---|
| **fail** | 출력 시 빌드 실패 | Review·AggregateRating·Offer·**MedicalRiskFactor**·MedicalGuideline·HealthInsurancePlan·MedicalDiagnosis 등 — § 8 표 참조 |
| **warning** | 출력 시 경고 + 어드민 검토 큐로 전달 (빌드는 통과) | 외부 위젯 schema와 `@id` 충돌 / VideoObject 권장 필드 누락 (필수는 충족하나 권장 미충족) / 본문 길이 권장 미달 등 — 비차단 운영 관찰 항목 |
| **content-gate** | schema는 통과되지만 본문 표현 위험. compliance-assistant·운영자 검수가 결정 | 본문 내 효과 단정·위험요인 설명·TreatmentPage.evidenceNotes 본문 인용·MedicalRiskFactor 본문 언급 등 |

---

## 8. 금지·주의 Schema (룰 레벨 명시)

| Schema | 룰 레벨 | 이유 |
|---|---|---|
| `Review` (의료 후기) | **fail** | 의료광고법 제56조·제57조 위반 소지. P-101 활성화 시에도 schema는 미출력 |
| `AggregateRating` (의료기관 평점) | **fail** | 동일 |
| `Offer` (의료 시술·진료 가격) | **fail** | 가격 광고 제한 |
| `DrugCost`·`MedicalCost` | **fail** | 동일 |
| `MedicalGuideline` (자체 작성) | **fail** | 검증되지 않은 의료 권고는 위반 소지 |
| `HealthInsurancePlan` | **fail** | 보험 광고 제한 |
| `MedicalDiagnosis` | **fail** | 진단 단정 |
| `MedicalRiskFactor`·`MedicalRiskEstimator` (schema) | **fail** | Schema 출력은 금지. 본문에서 원인·위험요인 표현은 별도 content-gate (compliance-assistant 검수) — schema 룰과 본문 룰 분리 |
| `MedicalIndication` (단정형 schema) | **fail** | Schema 출력 금지. 본문 효능 표현은 별도 content-gate |
| `Quiz` (비표준)·진단형 schema | **fail** | P-106 Self-test는 `WebPage`·`MedicalWebPage`로 |
| `HealthAndBeautyBusiness` (단독·병행) | **fail** | 의료기관 사이트는 MedicalClinic만 |
| `SpecialAnnouncement` | **content-gate** | 평상 휴진 미출력. 중대 공지만 별도 정책 |

> 컴플라이언스 정책의 세부 조건과 표현 가이드는 `compliance/RISK_LEVELS.md` 후속 문서에서 확장. 본 문서는 schema 출력 결정의 룰 레벨만 명시.

---

## 9. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| SM-01 | `Article` vs `BlogPosting` vs `NewsArticle` 변형 선택 정책 — `articleType`별 자동 매핑 | 후속 결정 |
| SM-02 | `MedicalSpecialty` enum 매핑 — Schema.org 표준값과 한국 한의·진료과 명칭 매핑 표 | C-14 풀명세 시 |
| SM-03 | `BusinessHours.receptionHours`·`lunchBreaks`·`specialClosures` schema 출력 포맷 세부 확정 — § 5.1 정책은 정의됨(receptionHours 보조 OpeningHoursSpecification, lunchBreaks 미출력, specialClosures 기본 미출력). 남은 결정은 receptionHours의 `description` 텍스트 형식·자동 변환 룰 | 빌드 구현 단계에서 확정 |
| SM-04 | `TrustMetric` schema 매핑 — `Statistic`·`QuantitativeValue` 적용 가능성 | 후속 검토 |
| SM-05 | ~~다지점 시 본원 `@id` alias 처리~~ | **v0.3 해소** — `/#clinic` 단일 entity로 고정. alias 사용 안 함 (§ 1.4) |
| SM-06 | P-106 Self-test의 `MedicalWebPage` 세부 필드 정책 — `medicalAudience`·`lastReviewed`·`reviewedBy` 등 활용 범위. (Quiz는 fail로 확정됨 — § 2.4·§ 8) | P-106 도입 시 |
| SM-07 | ~~Schema validator 도구 선정~~ | **v0.3 해소** — 빌드 게이트는 **자체 JSON schema/rule checker** (§ 7.2). 공식 validator·Google Rich Results Test는 운영 모니터링·수동 QA로 분리 |
| SM-08 | Article의 `contentSource: republished` 시 `isBasedOn` vs `citation` 사용 정책 | 후속 결정 |

---

## 10. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 — 통합 graph 표준, M0 필수 14종 풀 graph 매핑, 선택 7종 간략 매핑, 데이터 계약↔schema 필드 매핑 인덱스, SchemaInput 정식 정의 (C-15), 빌드 검증, 금지·주의 schema 8종 |
| 2026-05-14 | v0.2 | **피드백 정합 정정**: (1) **C-15/CT-15 혼동 → C-15로 통일** (SchemaInput은 데이터 계약, CT 아님), (2) **inLanguage 정책 좁힘** — CreativeWork·페이지 entity에만, (3) **MedicalClinic 사용처 정합** — § 2.1 카탈로그 "전 페이지 본원 1개 포함" 명시 (그래프 정의와 일치), (4) **P-002 About 정정** — address 매핑 제거(LocationProfile SoT), mediaCoverage는 sameAs 또는 CreativeWork 보조로, (5) **ItemList inline 필드 추가** — P-003/P-005/P-007/P-009에 name·url·image·기타 최소 필드 + @id 참조 병행, (6) **List 페이지 그래프에 WebPage 추가** — § 7.1 검증 룰과 정합 (이전 누락), (7) **evidenceNotes 매핑 보수화** — `MedicalStudy` → `citation`/`CreativeWork` (EvidenceNote 필드로 MedicalStudy 구성 부족), (8) **§ 2.3 신규** — Schema Rich Results 실효 vs Entity 의미 전달 분류 |
| 2026-05-14 | v0.3 | **빌드 가능 규칙화** (피드백 10건): (1) **§ 1.1 Core 출력 범위 한정** — 외부 위젯 schema 충돌 가능성 명시, (2) **§ 1.4 본원 @id 일관성 (SM-05 해소)** — `/#clinic` 단일 entity, 다지점 비본원만 `/locations/{slug}#clinic`, alias 금지, (3) **§ 2.1 WebSite Home 전용** — 다른 페이지는 `isPartOf` 참조만, (4) **§ 2.1 Person M0 외 후속** — authorType != clinician은 데이터 모델 확장 후, (5) **§ 2.4 신규 — Allowed/Conditional/Blocked 3단계 분류**, (6) **§ 3 P-010 graph 구성 [풀]/[참조+inline]/[참조만] 표기 명확화** + VideoObject Google Rich Results 최소 필드 (name·description·thumbnailUrl·uploadDate·contentUrl/embedUrl), (7) **§ 5.1 dayOfWeek enum 변환표** + specialClosures 기본 미출력 정책, (8) **§ 7.2 빌드 게이트 vs 운영 모니터링 분리** — 공식 validator는 모니터링·수동 QA로, (9) **§ 7.3 룰 레벨 분류 (fail/warning/content-gate)** + **§ 8 표에 룰 레벨 명시** |
| 2026-05-14 | v0.4 | **잔재 정리·룰 충돌 해소** (피드백 8건): (1) **§ 2.3 A/B 카테고리 풀명세 재펼침** ("이전과 동일" 잔재 제거), (2) **inLanguage 잔재 4곳 제거** — Organization·MedicalClinic·Physician·MedicalProcedure 매핑 표, (3) **MedicalRiskFactor 룰 충돌 해소** — schema 출력은 **fail로 통일**, 본문 표현(원인·위험요인)은 별도 content-gate 분리, (4) **§ 9 미결정 정리** — SM-05·SM-07 "해소" 표시, (5) **P-106 Quiz 제거** — `WebPage`/`MedicalWebPage`만, (6) **P-103 ImageGallery 제거** — 본문 갤러리 또는 `WebPage.image: ImageObject[]`, (7) **§ 5 C-02 Person 후속** 명시 (M0 외), (8) **§ 7.3 warning 예시에서 MedicalRiskFactor 제거** (fail로 통일) — `MedicalIndication` 단정형·`HealthAndBeautyBusiness` 단독 사용 등으로 교체 |
| 2026-05-14 | v0.5 | **미세 잔재 해소·룰 단순화** (피드백 7건): (1) **P-008 riskFactor → MedicalRiskFactor 행 삭제** — fail 정책 정합. causes[]는 description 보조·본문 표현으로, (2) **P-008 주석 정정** — "신중" → "schema 출력 안 함, 본문은 content-gate", (3) **HealthAndBeautyBusiness fail로 통일** (§ 2.4·§ 8 모두) — 단독·병행 모두 미사용, (4) **MedicalIndication fail로 통일** — Schema 출력 금지, 본문 효능 표현만 content-gate, (5) **HowTo Rich Results A 목록에서 제거** — 미사용. 미래 확장 시 카탈로그·결정표·의료 리스크 룰 추가, (6) **§ 2.4에 Person 두 케이스 분리** — Organization.founder는 Allowed inline / Article.author (non-clinician)는 M0 외 후속, (7) **VideoObject 필수 필드 표현 명확화** — `name·description·thumbnailUrl·uploadDate` 4개 필수 + `contentUrl`/`embedUrl` 중 1개 |
| 2026-05-14 | v0.6 | **정책 표 정합화** (피드백 7건): (1) **§ 2.5 신설 — 공통 entity별 페이지 출력 정책 (단일 SoT)** — Organization/WebSite/MedicalClinic의 풀 entity vs 참조 위치 명시. § 7.1 룰 checker가 본 표 기준으로 검증, (2) "풀 entity vs 참조" 용어 정의 — graph[]에 entity 정의 여부 명확, (3) **§ 0 요약 일관화** — "신중하게" → fail로, validator 표현을 § 7.2와 일치 (자체 checker = 빌드, 공식 validator = 모니터링), (4) **LocalBusiness 별도 출력 제거** — § 2.1·§ 5 C-20 정정. `MedicalClinic`이 LocalBusiness sub-class이므로 `@type: "MedicalClinic"`만 사용, LocalBusiness 계열 속성 활용, (5) **SearchAction Conditional** — `/search` 라우트 부재 시 미출력 (M0 미출력, 검색 기능 활성화 시 합류), (6) **§ 7.3 warning 예시 교체** — MedicalIndication·HealthAndBeautyBusiness 제거(둘 다 fail). 비차단 항목(외부 위젯 @id 충돌·VideoObject 권장 필드 누락·본문 길이 미달 등)으로 교체 |
| 2026-05-14 | v0.7 | **§ 2.5 SoT 기준 일괄 동기화** (피드백 7건): (1) **§ 2.1 SearchAction Conditional 명시**, **ReserveAction을 LocalBusiness → MedicalClinic.potentialAction**으로 정정, (2) **§ 2.4 MedicalClinic 결정 변경** — "본원 1개 전 페이지" → "§ 2.5 정책에 따라 full 또는 ref", (3) **§ 2.5 P-105 Reservation 풀 entity로 재분류**, P-101~P-106 일괄 ref 거친 표현 세분화, (4) **§ 3·§ 4 페이지별 graph 구성 [풀]/[참조]/[참조+inline] 표기 일괄 적용** — P-003·P-004·P-007·P-008·P-009·P-010·P-011·P-013·P-101~P-106, (5) **§ 7.1 검증 룰 정정** — "PageMeta.canonical 필수" → "**resolved canonical URL 필수** (PageMeta.canonical 또는 SchemaInput.canonicalUrl로 결정)" |
| 2026-05-14 | v0.8 | **§ 2.5 cascade 마무리** (피드백 6건): (1) **P-005 MedicalClinic [참조만]로 변경** — PAGE_TYPES § 3 P-005에 위치 정보 슬롯 없음. § 2.5 풀 지정 페이지에서 제거, (2) **P-005·P-006·P-012·P-014 [풀]/[참조] 표기 적용** — v0.7 일괄 적용 시 누락된 페이지 보완, (3) **P-014 @id 분기 명시** — 단지점 main = `#clinic` (본원 entity와 동일), 다지점 비본원 = `/locations/{slug}#clinic` (별도 entity), (4) **§ 7.1 일반 검증 룰 추가** — "§ 2.5에서 풀로 지정된 entity는 해당 페이지 필수" (룰 checker의 일반 룰. 페이지별 명시는 보조), (5) **§ 7.1 MedicalClinic 풀 페이지 목록 확장** — P-001·P-002·P-006·P-012·P-014·P-105 (이전 P-012·P-014만), (6) **§ 2.1 ReserveAction Conditional 명확화** — "reservationChannels 또는 페이지 예약 CTA가 실제 있을 때만" |
| 2026-05-14 | v0.9 | **Conditional·미결정 다듬기** (피드백 5건): (1) **ReserveAction 조건 § 2.1·§ 2.4 통일** — `(a) #clinic 풀 entity 페이지 + (b) reservationChannels 예약 채널 존재 또는 페이지/시술 CTA가 예약 채널`, (2) **§ 7.1 선택 페이지 검증 단서** — "선택 페이지(P-101~P-106)는 인스턴스에서 활성화된 경우에만 검증" (FeatureModuleConfig·라우트 설정 기준). P-105 등 풀 필수 페이지 목록에 "활성화 시" 명시, (3) **SM-03 수준 낮춤** — 완전 미결정 → "출력 포맷 세부 확정 필요" (정책은 § 5.1에 정의됨), (4) **SM-06 이름 정정** — "Quiz·Self-test schema 모범" → "P-106 Self-test의 `MedicalWebPage` 세부 필드 정책" (Quiz는 fail로 확정) |
| 2026-05-14 | v0.10 | **미세 표현 정합** (피드백 4건): (1) § 3 P-001 MedicalClinic potentialAction 행에 "페이지/시술 CTA가 예약 채널일 때"도 포함 명시, (2) § 4 P-105 — "ReserveAction 풀필드" → "**상세 필드 포함** (독립 entity 아닌 MedicalClinic.potentialAction 중첩 구조)", (3) § 7.1 선택 페이지 검증 기준에 **InstanceManifest 추가** — P-103·P-104·P-105는 Instance 결정·P-106은 Feature Module 기반 등 활성화 경로 다양화, (4) **§ 2.2 제목에 "룰 레벨 상세는 § 8" 명시** — fail/warning/content-gate 기조와 정합 |
| 2026-05-14 | **v1.0** | **구현 명세 안정판 격상**: (1) **§ 2.2 표에 룰 레벨 열 추가** — § 8 상세표와 일치하는 요약. § 8 이동 없이 한눈에 파악 가능, (2) **v0.10 → v1.0 격상** — 사용자 메타-피드백 "다음 안정판을 v1.0으로" 채택. 핵심 정책·표 정합·룰 일관성 완성. 다음 단계는 SchemaGenerator/rule checker 실제 구현 + 그 과정의 발견 사항을 문서에 되먹이기 |
