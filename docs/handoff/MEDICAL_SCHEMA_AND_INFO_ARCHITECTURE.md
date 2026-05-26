# 의료기관 인증 스키마 + 정보계층 구조 (구현 스냅샷)

> **목적**: Glitzy 의료기관 웹사이트 노출 솔루션의 (1) JSON-LD 의료기관 인증 스키마, (2) 사이트맵·페이지 계층, (3) 위키형 정보계층 (카테고리·cross-link·TOC) 설계, (4) 실 페이지 HTML 마크업 샘플을 외부 공유·운영 인계용으로 정리한 **현재 구현 스냅샷** 문서.
>
> **작성일**: 2026-05-26
> **대상**: 외부 클라이언트
> **상위 SoT**:
> - 스키마 명세 → `docs/core/SCHEMA_MAPPING.md` (v1.0 안정판)
> - 페이지 타입 명세 → `docs/core/PAGE_TYPES.md`
> - 데이터 모델 → `docs/core/DATA_MODEL.md`
> - 검색 표준화 → `docs/core/SEARCH_STANDARDIZATION.md`
>
> **첫 적용 인스턴스**: `demo` (다이트한의원 인천 부평점)

---

## 0. 한 페이지 요약

- 모든 페이지는 **단일 `<script type="application/ld+json">` 블록 안 `@graph` 통합 출력**. 페이지 타입별 graph 구성 표준화.
- 의료기관 인증 = `Organization`(법인) + `MedicalClinic`(지점 — 단지점은 `#clinic` 본원 1개) + `Physician`(의료진) + `Physician.hasCredential[]`(5종 자격) + `medicalSpecialty[]` (전문분야).
- 사이트는 P-001~P-014 의 **14 필수 페이지 타입** + 7 선택 + E-A-T 확장 4 (`/publications`·`/media-appearances`·`/community`·`/insights/{category}`). Phase B (2026-05-26) 부터 P-007/P-008 Conditions (`/conditions` · `/conditions/{slug}` — 의료 검색 유입 페이지) 합류.
- 위키형 정보계층 4축: **계층(Pillar/Spoke · ArticleCategory parent self-FK)** + **인용 그래프(content_entity_link polymorphic 3 관계유형)** + **본문 내 anchor TOC(h2/h3/h4 auto-id · FloatingTOC)** + **inverse 자동 노출(이 글의 근거 · 관련 글 · 관련 FAQ)**.
- 금지 schema (의료광고법 정합): `Review` · `AggregateRating` · `Offer` · `HealthAndBeautyBusiness` · 단정형 `MedicalIndication`·`MedicalRiskFactor` 등 — entity builder 안 출력 경로가 없어 site SSR 안 절대 생성 안 됨 (runtime denylist guard 는 § 7.4 참조).

---

## 1. 의료기관 인증 관련 스키마 (JSON-LD)

### 1.1 출력 entity 10종

| Entity | 출처 (DB) | 사용 페이지 | 구현 코드 |
|---|---|---|---|
| `Organization` | `clinic_profile` | 모든 페이지 | `apps/web/src/lib/json-ld/entities.ts:22` |
| `MedicalClinic` | `location_profile` (main) | Home · About · Contact · Treatment Detail · Location | `:53` |
| `Physician` | `doctor_profile` | Doctor list (참조) · Doctor Detail · Article author | `:99` |
| `MedicalProcedure` | `treatment_page` | Treatment list (ItemList) · Treatment Detail · Condition Detail (possibleTreatment ref) | `:112` |
| `MedicalCondition` (Phase B) | `medical_condition_page` | Conditions list (ItemList) · Condition Detail | `:medicalConditionEntity` |
| `Article` | `article` | Article Detail · Doctor Detail (참조) | `:128` |
| `ScholarlyArticle` | `publication` | Doctor Detail · About · Treatment Detail (citation) · Article Detail (citation) | `:240` |
| `VideoObject` | `media_appearance` | Doctor Detail · About · Treatment Detail (citation) · Article Detail (citation) | `:271` |
| `FAQPage` (+ `Question` + `Answer`) | `faq` | FAQ 페이지 | `:290` |
| `WebSite` · `WebPage` · `BreadcrumbList` · `ItemList` · `ContactPoint` | 페이지 단위 | 모든 페이지 | `:43, :176, :188, :199, :217` |

### 1.2 `@id` 네이밍 (v0.1 path-based · 도메인 매핑 합류 후 `<customDomain>/...` 으로 전환)

| Entity | `@id` 패턴 |
|---|---|
| `Organization` | `https://<host>/<instanceSlug>/#organization` |
| `MedicalClinic` | `https://<host>/<instanceSlug>/#clinic` |
| `Physician` | `https://<host>/<instanceSlug>/doctors/<slug>#physician` |
| `MedicalProcedure` | `https://<host>/<instanceSlug>/treatments/<slug>#procedure` |
| `MedicalCondition` (Phase B) | `https://<host>/<instanceSlug>/conditions/<slug>#condition` |
| `Article` | `https://<host>/<instanceSlug>/insights/<category>/<slug>#article` |
| `ScholarlyArticle` | `<pageBaseUrl>#publication-<slug>` (fragment-scoped — Doctor/About/Treatment/Article page 별 inline) |
| `VideoObject` | `<pageBaseUrl>#video-<slug>` |
| `BreadcrumbList` | `<page>#breadcrumb` |
| `FAQPage` | `<page>#faqpage` |

전체 entity 정의는 한 페이지 graph 안 1회만, 다른 위치는 `@id` cross-reference. SCHEMA_MAPPING § 1.3 참조.

### 1.3 `Physician.hasCredential` 매핑

운영자가 어드민 의료진 form 안 입력한 자격·인증 → `doctor_profile.metadata.credentials[]` JSONB 저장 → site SSR 안 schema.org `EducationalOccupationalCredential` 배열로 출력.

#### 입력 필드 (어드민 form)

| 필드 | DB 키 | 필수 | 운영 입력 가이드 | 현재 server-side 검증 |
|---|---|---|---|---|
| 구분 | `type` | ✅ | 5종 enum 중 1 | enum 미일치 row 는 silent drop (`parseCredentials`) |
| 인증·자격명 | `name` | ✅ | 1~200자 | 빈값/200자 초과 차단 (`actions.ts:118-123`) |
| 발급 기관 | `issuer` | | 자유 입력 | 검증 없음 (trim 만) |
| 발급 연도/일자 | `issuedAt` | | **권장**: `YYYY` 또는 `YYYY-MM-DD` | **포맷 검증 미구현** — 자유 string 그대로 저장 + JSON-LD `dateCreated` 로 출력 (Google 안 invalid date 인식 가능) |
| 자격번호 | `identifier` | | 자유 입력 | 검증 없음 |
| 검증 URL | `url` | | http/https URL | http/https prefix 만 검증, 도메인·도달성 검증 없음 (`actions.ts:125`) |

> **현재 한계**: `issuedAt` 의 `YYYY`/`YYYY-MM-DD` 포맷 검증은 운영 가이드 수준이며, server 안 강제되지 않음. 잘못된 포맷 입력 시 schema.org `dateCreated` 안 invalid string 그대로 출력. 향후 운영 합류 시점에 zod schema 검증 추가 권장.

#### 5종 type → schema.org credentialCategory 매핑

| 입력 type | schema.org `credentialCategory` | 운영 의미 |
|---|---|---|
| `license` | `"license"` | 의료인 면허 (한의사·의사 면허 등) |
| `board` | `"specialty"` | 전문의·세부전문의 (대한비만학회 인정의 등) |
| `certification` | `"certification"` | 학회·협회 인증 (수료 과정 등) |
| `membership` | `"membership"` | 학회 회원 |
| `education` | `"degree"` | 학력 (대학교 졸업 등) |

매핑 코드: `entities.ts:90-100` (`CREDENTIAL_CATEGORY_MAP`).

#### 출력 JSON-LD 구조 (entity 단위)

```json
{
  "@type": "EducationalOccupationalCredential",
  "credentialCategory": "license",
  "name": "한의사 면허",
  "recognizedBy": { "@type": "Organization", "name": "보건복지부" },
  "dateCreated": "2010",
  "identifier": "12345",
  "url": "https://..."           // optional
}
```

#### Site 안 노출 (P-004 Doctor Profile)

`CredentialsSection` 컴포넌트 (`apps/web/src/components/site/CredentialsSection.tsx`) 가 약력 본문 아래에:
- 전문분야 chip 배열 (`medicalSpecialty[]`)
- 5그룹 dl: 면허 / 전문의·세부전문의 / 학회·협회 인증 / 학회 회원 / 학력

### 1.4 `Physician.medicalSpecialty` (이번 cycle 신설)

- 입력: 어드민 form 안 comma-separated text (예: `비만의학, 한방재활의학`)
- DB: `doctor_profile.metadata.medicalSpecialties[]` (string[])
- 출력: `medicalSpecialty: ["비만의학", "한방재활의학"]` (배열 1 항목이면 string)
- fallback (미입력 시): `medicalSpecialty: "MedicalSpecialty"` (placeholder)

### 1.5 페이지별 graph 구성 (M0 11 페이지)

| Page | Entities (풀 entity / 참조) | Builder |
|---|---|---|
| P-001 Home | Organization · MedicalClinic · WebSite · WebPage | `builders.ts:homeGraph` |
| P-002 About | Organization · MedicalClinic · WebPage · BreadcrumbList · ScholarlyArticle[] · VideoObject[] | `aboutGraph` |
| P-003 Doctors List | Organization · WebPage · BreadcrumbList · ItemList(Physician refs) | `doctorsListGraph` |
| P-004 Doctor Profile | Organization · Physician (+ hasCredential[] · medicalSpecialty[] · 입력된 경우만 출력) · WebPage · BreadcrumbList · ScholarlyArticle[] · VideoObject[] | `doctorProfileGraph` |
| P-005 Treatments List | Organization · WebPage · BreadcrumbList · ItemList(MedicalProcedure refs) | `treatmentsListGraph` |
| P-006 Treatment Detail | Organization · MedicalClinic · MedicalProcedure(citation: Publication/Media) · WebPage · BreadcrumbList | `treatmentDetailGraph` |
| P-007 Conditions List (Phase B) | Organization · WebPage · BreadcrumbList · ItemList(MedicalCondition refs) | `conditionsListGraph` |
| P-008 Condition Detail (Phase B) | Organization · MedicalCondition(possibleTreatment ref) · WebPage · BreadcrumbList | `conditionDetailGraph` |
| P-010 Article Detail | Organization · Article(author=Physician · citation · mentions) · WebPage · BreadcrumbList | `articleDetailGraph` |
| P-011 FAQ | Organization · WebPage · BreadcrumbList · FAQPage(mainEntity: Question/Answer) | `faqPageGraph` |
| P-012 Contact | Organization · MedicalClinic · WebPage · BreadcrumbList | `contactGraph` |
| P-013 Legal | (legal_document 본문은 schema 출력 없음 · status published 차단) | — |
| P-014 Location | Organization · MedicalClinic · WebPage · BreadcrumbList | `locationDetailGraph` |

### 1.6 빌드 검증

| 검증 | 실제 검사 항목 | 위치 |
|---|---|---|
| 자체 rule checker (vitest) | (1) JSON parse + `@context`/`@graph` shape · (2) `@id` 유일성 · (3) cross-reference 무결성 + cross-page ref allowlist (`#organization`/`#website`/`#clinic`) · (4) 페이지별 expected entity 존재 | `apps/web/src/lib/json-ld/__tests__/validate.ts` + `validate.test.ts` + `eat-validate.test.ts` |
| schema.org 공식 validator | JSON-LD 구문 + schema vocabulary 준수 (수동 QA) | https://validator.schema.org/ |
| Google Rich Results Test | rich snippet 자격 검사 (수동 QA · 검색 결과 영향) | https://search.google.com/test/rich-results |

> **금지 schema 차단 메커니즘**: 현재 rule checker 안 denylist 검사 로직은 **미구현**. 대신 **생성기 (`entities.ts`) 안 Review/AggregateRating/Offer/HealthAndBeautyBusiness 등의 출력 경로 자체가 존재하지 않음** — "기능적 차단". 운영자가 어드민에서 별 표현으로 입력해도 site SSR 안 해당 schema 가 만들어지지 않는다. 향후 denylist runtime guard 가 필요한 시점에 validator 안 추가 권장.

### 1.7 의료광고법 정합 — 금지 schema (생성기 차단)

`Review` · `AggregateRating` · `Offer` · `HealthAndBeautyBusiness` · 단정형 `MedicalIndication`·`MedicalRiskFactor` · `Discount` 등은 entity builder 안 출력 경로가 없어 **site SSR 안 절대 생성되지 않음**. SCHEMA_MAPPING § 8 SoT 정합. validator 단계의 denylist runtime guard 는 § 8 "현재 구현 제한" 참조.

---

## 2. 사이트맵 (페이지 계층 구조도)

### 2.1 URL 트리 (M0 + E-A-T 확장 안 현재 dev 서버 동작)

```
/{instanceSlug}/                                       P-001 Home
├── about                                              P-002 About
├── doctors/                                           P-003 Doctors List
│   └── {doctorSlug}                                   P-004 Doctor Profile  ← hasCredential 매핑 출력
├── treatments/                                        P-005 Treatments List
│   └── {treatmentSlug}                                P-006 Treatment Detail  ← FloatingTOC + citation
├── conditions/                                        P-007 Conditions List (Phase B · 의료 유입 경로)
│   └── {conditionSlug}                                P-008 Condition Detail  ← FloatingTOC + possibleTreatment CTA
├── insights/                                          P-009 Articles List (전체)
│   ├── {categorySlug}/                                Category landing
│   │   └── {articleSlug}                              P-010 Article Detail  ← FloatingTOC + 외부 보도 통합
├── faq                                                P-011 FAQ
├── contact                                            P-012 Contact (Conversion Hub)
├── legal/
│   ├── privacy                                        P-013 Privacy
│   ├── terms                                          P-013 Terms
│   ├── non-covered                                    P-013 Non-Covered Fees
│   ├── refund                                         P-013 Refund Policy
│   └── complaint                                      P-013 Complaint Handling
├── locations/{locationSlug}                           P-014 Location Detail
├── publications/                                      E-A-T 확장 — 논문 list
│   └── {publicationSlug}                              E-A-T 확장 — 논문 detail
├── media-appearances/                                 E-A-T 확장 — 미디어 list
│   └── {mediaSlug}                                    E-A-T 확장 — 미디어 detail
├── community                                          Community Hub
├── robots.txt                                         크롤러 정책
└── sitemap.xml                                        XML sitemap (instance scope)
```

### 2.2 14 필수 페이지 (Core 표준 · P-001 ~ P-014)

| ID | 페이지 | URL | 데이터 계약 | M0 |
|---|---|---|---|:---:|
| P-001 | Home | `/` | ClinicProfile (요약) | ✅ |
| P-002 | About | `/about` | ClinicProfile (전체) | ✅ |
| P-003 | Doctors List | `/doctors` | DoctorProfile[] | ✅ |
| P-004 | Doctor Profile | `/doctors/{slug}` | DoctorProfile | ✅ |
| P-005 | Treatments List | `/treatments` | TreatmentPage[] | ✅ |
| P-006 | Treatment Detail | `/treatments/{slug}` | TreatmentPage | ✅ |
| P-007 | Conditions List | `/conditions` | MedicalConditionPage[] | ✅ (Phase B) |
| P-008 | Condition Detail | `/conditions/{slug}` | MedicalConditionPage | ✅ (Phase B) |
| P-009 | Articles List | `/insights` | Article[] | ✅ |
| P-010 | Article Detail | `/insights/{cat}/{slug}` | Article | ✅ |
| P-011 | FAQ | `/faq` | FAQ[] | ✅ |
| P-012 | Contact | `/contact` | ClinicProfile + LocationProfile[] | ✅ |
| P-013 | Legal | `/legal/{type}` | LegalDocument | ✅ (자동 생성) |
| P-014 | Location | `/locations/{slug}` | LocationProfile | ✅ (main 자동) |

### 2.3 7 선택 페이지 (Add-on)

P-101 Reviews (후기·High-risk) · P-102 Pricing (가격·High-risk) · P-103 Facilities · P-104 News/Event · P-105 Reservation · P-106 Self-test · P-107 (예약).

### 2.4 sitemap.xml 동적 생성

`apps/web/src/app/(site)/[instanceSlug]/sitemap.xml/route.ts` 가 instance scope 안 entry 출력. **EXPOSURE_READINESS Phase A (2026-05-26) 적용 후** 매트릭스:

| URL | 포함 여부 | priority / changefreq | 비고 |
|---|---|---|---|
| `/` (P-001 Home) | ✅ | 1.0 weekly | 최우선 |
| `/about` (P-002) | ✅ | 0.8 monthly | |
| `/doctors` (P-003 list) | ✅ | 0.7 monthly | 빈 상태도 항상 포함 (PSRC-07) |
| `/doctors/{slug}` (P-004) | ✅ | 0.7 monthly | active 의료진 각 row |
| `/treatments` (P-005 list) | ✅ | 0.8 monthly | 빈 상태도 항상 포함 |
| `/treatments/{slug}` (P-006) | ✅ | 0.8 monthly | published treatment 각 row |
| `/conditions` (P-007 list · Phase B) | ✅ | 0.8 weekly | 의료 검색 유입 진입점 — 검색 노출 우선 |
| `/conditions/{slug}` (P-008 detail · Phase B) | ✅ | 0.7 monthly | published condition 각 row |
| `/insights` (P-009 list landing) | ✅ (Phase A) | 0.7 weekly | EXPOSURE_READINESS Phase A 신규 합류 |
| `/insights/{category}` (category landing) | ✅ (Phase A) | 0.6 monthly | published article 1개 이상 카테고리만 |
| `/insights/{category}/{slug}` (P-010) | ✅ | 0.5 monthly | published article 각 row · 실 category slug |
| `/faq` (P-011) | ✅ | 0.5 monthly | published row 0건이어도 포함 (ECP-21) |
| `/contact` (P-012) | ✅ | 0.6 yearly | |
| `/legal/{type}` (P-013) | ❌ | — | 의료광고법 법정 문서 — 색인 가치 낮음. noindex meta 와 함께 유지 (PSR-SEO-07) |
| `/locations/{slug}` (P-014) | ✅ | 0.7 monthly | main 만 (다지점 합류 시 자동) |
| `/publications` | ✅ (Phase A) | 0.6 monthly | 논문 list landing |
| `/publications/{slug}` | ✅ (Phase A) | 0.5 yearly | published publication 각 row |
| `/media-appearances` | ✅ (Phase A) | 0.5 monthly | 미디어 list landing |
| `/media-appearances/{slug}` | ✅ (Phase A) | 0.4 yearly | published media 각 row |
| `/community` | ✅ (Phase A) | 0.5 weekly | community hub |

> **정책**: 의료광고법 법정 문서 (`/legal/*`) 외 모든 site 페이지는 sitemap 색인. 검색 노출 우선. E-A-T 확장 4 (publications · media · community · category landing) 은 topical authority 신호 + AI 인용 후보로서 색인 합류.

- lastmod aggregate: list 페이지는 MAX(updated_at) of published children, detail 은 published_at fallback updated_at
- changefreq/priority 정책: 핵심 콘텐츠 ≥ 0.7, list landing 0.6~0.7, detail 0.4~0.8, legal 제외

확인: http://localhost:3002/demo/sitemap.xml (81 entries · demo 인스턴스 기준)

### 2.5 robots.txt — GEO 정책 (Phase A 결정)

`apps/web/src/app/(site)/[instanceSlug]/robots.txt/route.ts`:

| 그룹 | bot | 정책 |
|---|---|---|
| A. 일반 검색 색인 | Googlebot · Yeti (Naver) · Bingbot | Allow |
| B. AI 검색 인덱싱·답변용 | OAI-SearchBot · PerplexityBot · Claude-SearchBot | Allow |
| C. User-triggered fetch | ChatGPT-User · Perplexity-User · Claude-User | Allow |
| D. AI 학습·모델 개선용 | GPTBot · ClaudeBot · Google-Extended · CCBot · anthropic-ai | **Allow (Phase A 변경)** |
| 시스템 영역 | (모든 bot) | Disallow `/admin/` `/auth/` `/api/` |

**Phase A 정책 결정 (2026-05-26)**: GEO 우선 — AI 학습 bot 도 Allow 로 전환. 장기적 LLM 모델 안 브랜드 기억 형성을 위한 결정. 의료광고법: 웹 공개 자체가 광고이므로 학습 bot 노출이 추가 리스크를 만들지 않음 (의료기관 콘텐츠 기준). 클라이언트별 권리 우선 (재사용·학습 차단) 필요 시 `ClinicProfile.metadata.aiCrawlerPolicy` row-driven 합류 (PSR-DEFER-10).

---

## 3. 위키형 정보 구조 설계 (현재 구현)

### 3.1 4축 정보계층 요약

| 축 | 구현 메커니즘 | 비고 |
|---|---|---|
| **계층 1: Treatment Pillar/Spoke** | `treatment_page.pillar_slug` ↔ `clinic.metadata.treatmentPillars[].slug` 매칭 | 4 Pillar (다이어트 치료·개인맞춤·체형관리·다이트 한약) + 10 Spoke (Spoke 가 pillar_slug NULL 이면 자체가 Pillar) |
| **계층 2: Article Category** | `article_category.parent_category_id` self-FK | 현재 운영은 평면 3 카테고리 (`general` · `diet` · `health`) — 하위 카테고리는 schema 만 준비, M1 합류 시 활성 |
| **Cross-link: polymorphic** | `content_entity_link` (source_type + target_type + relation_type) | 3 관계유형: `cites` · `related-to` · `derived-from` |
| **본문 내 anchor + TOC** | h2/h3/h4 auto-id (한국어 보존 slug) + `FloatingTOC` 데스크탑 좌측 sticky · IntersectionObserver active highlight | 이번 cycle 신설 |
| **Inverse 자동 노출** | site SSR 안 "이 글의 근거" + "관련 콘텐츠" + "관련 FAQ" 3 섹션 | EVIDENCE_LINKING_PLAN Phase A |
| **Breadcrumb** | `BreadcrumbList` JSON-LD + `<Breadcrumb>` 컴포넌트 | 모든 detail 페이지 |
| **Related grid** | 같은 pillar 시술 3개 · 같은 카테고리 글 3개 | TreatmentDetail · ArticleDetail |

### 3.2 카테고리 체계 (현재)

#### Article Category

```
article_category (현재 평면 3 카테고리 · parent_category_id NULL)
├── general (일반)
├── diet (다이어트)
└── health (건강)
```

- DB SoT: `packages/core-content/src/schema.ts:331` (`articleCategory`)
- 필드: id · instance_id · slug · name · description · pillar · parent_category_id (self-FK · M1 활성) · cover_image_url · seo_meta · display_order · article_type_default
- 어드민 CRUD: `/admin/<slug>/categories`

#### Treatment Pillar/Spoke

```
clinic.metadata.treatmentPillars (C 하이브리드 — 어드민 입력 안 비우면 fallback)
└── pillar slug 별로 treatment_page 안 pillar_slug FK 매칭
    예 demo 인스턴스:
    ├── diet-treatment (Pillar) — pillar_slug=NULL · 자체 Pillar
    │   ├── goodbye-diet (Spoke · pillar_slug='diet-treatment')
    │   ├── carb-control
    │   └── three-go-diet
    ├── personalized-diet (Pillar)
    │   └── menopause-diet · postpartum-diet · ...
    └── body-shaping (Pillar)
        └── ...
```

### 3.3 태그 체계

**현재 미구현**. 카테고리 + Pillar/Spoke + content_entity_link 로 분류·연결 욕구 대체. 자유 태그 (`Article.tags[]`) 는 M1 candidates. 추가 시:
- `article.metadata.tags[]` JSONB 또는 별도 `article_tag` 테이블
- 태그 페이지 (`/insights/tag/{tagSlug}`) 또는 query filter
- JSON-LD `Article.keywords` 매핑

### 3.4 Cross-link (polymorphic — `content_entity_link`)

#### DB 컬럼 + CHECK (C0033 migration + C0040 EXPOSURE_READINESS Phase B 확장)

| 컬럼 | 타입 + CHECK | 설명 |
|---|---|---|
| `source_type` | TEXT — `Article` \| `TreatmentPage` \| `MedicalConditionPage` \| `FAQ` | 출발 entity |
| `source_id` | UUID | 출발 row id |
| `target_type` | TEXT — `Publication` \| `MediaAppearance` \| `FAQ` \| `TreatmentPage` \| `MedicalConditionPage` \| `Article` | 도착 entity |
| `target_id` | UUID | 도착 row id |
| `relation_type` | TEXT — `cites` \| `related-to` \| `derived-from` | 관계 유형 |

> **`DoctorProfile` · `ClinicProfile` 은 source/target 모두 불허** (DB CHECK · `packages/core-content/migrations/C0033_content_entity_link.sql:25-31`). 의료진 ↔ 글 직접 link 는 기존 `article.author_doctor_id` FK 가 SoT (SVO-CASCADE-05) — 이중 SoT 회피.

#### 실제 허용 매트릭스 (app-level whitelist · `RELATION_TARGET_MATRIX`)

| source\relation | `cites` | `related-to` | `derived-from` |
|---|---|---|---|
| `Article` | Publication · MediaAppearance | Article · TreatmentPage · MedicalConditionPage · FAQ | — |
| `TreatmentPage` | Publication · MediaAppearance | TreatmentPage · MedicalConditionPage · FAQ · Article | Publication |
| `MedicalConditionPage` (Phase B) | Publication · MediaAppearance | Article · TreatmentPage · MedicalConditionPage · FAQ | — |
| `FAQ` | — | Article · MedicalConditionPage · FAQ (TreatmentPage 제외 — `relatedTreatmentId` FK SoT) | — |

> **Conditions FK SoT**: 증상 → 1차 진료 매칭은 `medical_condition_page.primary_treatment_id` FK 가 SoT. 추가 진료 또는 다른 증상·글·FAQ 연결은 위 매트릭스 사용 (이중 SoT 회피 · § 1차 매칭 vs 보조 link 분리).

코드: `apps/web/src/lib/admin/content-entity-link.ts:45` (`RELATION_TARGET_MATRIX`).

#### 관계 유형별 site 동작

| relation_type | site SSR 안 노출 | JSON-LD 매핑 |
|---|---|---|
| `cites` | "이 글의 근거" 섹션 (Article/Treatment Detail) | `Article.citation[]` · `MedicalProcedure.citation[]` (각각 ScholarlyArticle · VideoObject inline) |
| `related-to` | "관련 콘텐츠" 섹션 | `Article.mentions[]` (간소화된 WebPage object — name + url) |
| `derived-from` | "이 글의 근거" 섹션 (cites 보다 우선 정렬) | Treatment 안 `MedicalProcedure.citation[]` 안 우선 배치 |

코드: `apps/web/src/lib/site-evidence-links.ts` (cards) + `site-evidence-jsonld.ts` (JSON-LD enrichment).

### 3.5 본문 내 anchor + TOC (이번 cycle 신설)

#### Heading id auto-generation

`apps/web/src/lib/markdown.ts:slugifyHeading`

- 영문: 소문자화 + 공백/특수문자 → 하이픈 (예: `"Hello World"` → `hello-world`)
- 한국어: 그대로 유지 + 공백 → 하이픈 (예: `"자가진단 체크리스트"` → `자가진단-체크리스트`)
- 중복 heading: `-2` · `-3` suffix
- h2 / h3 / h4 만 적용 (h1 은 페이지 제목 역할 — anchor 부착 안 함)
- markdown inline marker (`**`, `*`, `` ` ``) strip

#### TOC 추출 + 렌더

- `extractTocHeadings(md)` 가 h2 (level 1) + h3 (level 2) 만 item 으로 추출. h4 는 id counter 만 진행 (renderer 동기)
- `FloatingTOC` 컴포넌트 (`components/site/FloatingTOC.tsx`) — 데스크탑(`lg+`) 좌측 sticky · 모바일 비표시 · IntersectionObserver active highlight
- mount 대상: Article Detail · Treatment Detail (각각 `extractTocHeadings(article.body|treatment.body)` 입력)
- CSS: `.prose-site h2/h3/h4 { scroll-margin-top: 6rem }` (sticky header offset)

### 3.6 내부 링크 규칙

| 규칙 | 정책 |
|---|---|
| 외부 매체 보도 article | **internal detail 페이지로 통일** (이번 cycle 변경). 외부 URL 은 detail 페이지 안 "원문 보기" 버튼 + `target="_blank" rel="nofollow noopener noreferrer"` |
| BreadcrumbList | 모든 detail 페이지 — JSON-LD `@id` = `<page>#breadcrumb` · position 1~N · 최상위 "홈" 부터 |
| Related entity grid | 같은 pillar 시술 3개 (Treatment Detail) · 같은 카테고리 글 3개 (Article Detail · 같은 카테고리 안 다른 글) |
| Author cross-link | Article author = Physician (`@id` cross-reference) · `Article.author` inline minimal 객체 (name · jobTitle · image) |
| Evidence cards | "이 글의 근거" · "관련 콘텐츠" · "관련 FAQ" 3 섹션 자동 노출 (link 가 1개 이상일 때만) |
| Cross-page reference allowlist | `#organization` · `#website` · `#clinic` 만 허용 (다른 페이지의 entity 참조 시 빌드 fail 아님) |
| sitemap.xml | instance scope 안 모든 published URL + lastmod aggregate |

### 3.7 미구현 (다음 cycle 후보)

| 항목 | 비고 |
|---|---|
| 태그 체계 | 자유 태그 + 태그 페이지 + `Article.keywords` JSON-LD |
| `[[wiki-link]]` 본문 inline | markdown body 안 `[[페이지명]]` 자동 internal link |
| "함께 본 글" (세션 기반) | 사용자 이력·view tracking |
| 의료진 ↔ 글 ↔ 시술 3자 inverse 통합 위젯 | 한 페이지에서 3 entity 양방향 navigation |
| 검색 (사이트 내) | 인덱싱·UI |
| Article category 하위 분류 UI | parent_category_id self-FK 활성 |

---

## 4. HTML 마크업 샘플 (부록 — 실 페이지 발췌)

### 4.1 P-004 Doctor Profile — 의료기관 인증 스키마 적용 부분

**URL**: http://localhost:3002/demo/doctors/shin-soo-yong (인스턴스 `demo` · 의료진 `신수용`)

**JSON-LD `<script type="application/ld+json">` 안 Physician entity 발췌**:

```json
{
  "@type": "Physician",
  "@id": "http://localhost:3002/demo/doctors/shin-soo-yong#physician",
  "name": "신수용",
  "jobTitle": "대표원장",
  "description": "약력 - 동국대학교 한의과대학 졸업 - 前 다이트한의원 본점 수석원장 ...",
  "image": "https://yqippqpkqhdcuugjyoeu.supabase.co/storage/v1/object/public/website-exposure-uploads/admin/demo/doctor-photo/....jpg",
  "worksFor": { "@id": "http://localhost:3002/demo/#organization" },
  "medicalSpecialty": ["비만의학", "한방재활의학"],
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "license",
      "name": "한의사 면허",
      "recognizedBy": { "@type": "Organization", "name": "보건복지부" },
      "dateCreated": "2010",
      "identifier": "12345"
    },
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "specialty",
      "name": "대한비만학회 인정의",
      "recognizedBy": { "@type": "Organization", "name": "대한비만학회" },
      "dateCreated": "2018",
      "identifier": "54321"
    }
  ],
  "subjectOf": [
    { "@id": "http://localhost:3002/demo/doctors/shin-soo-yong#publication-kwon-2026-taeeumin-obesity-multicenter" },
    { "@id": "http://localhost:3002/demo/doctors/shin-soo-yong#publication-bang-2026-herbal-prescription-patterns" }
  ]
}
```

**HTML body 안 CredentialsSection 발췌**:

```html
<section id="credentials" class="mt-12 scroll-mt-24">
  <h2 class="mb-4 text-xl font-semibold text-fg-default">자격·인증</h2>

  <div class="mb-6 flex flex-wrap gap-2">
    <span class="rounded-full border border-brand-primary/30 bg-brand-primary-soft px-3 py-1 text-xs font-medium text-brand-primary">비만의학</span>
    <span class="rounded-full border border-brand-primary/30 bg-brand-primary-soft px-3 py-1 text-xs font-medium text-brand-primary">한방재활의학</span>
  </div>

  <dl class="flex flex-col gap-4">
    <div class="grid gap-2 border-b border-border pb-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
      <dt class="text-sm font-semibold uppercase tracking-wider text-fg-muted">면허</dt>
      <dd>
        <ul class="flex flex-col gap-2">
          <li class="text-sm text-fg-default">
            <span class="font-medium">한의사 면허</span>
            <span class="text-fg-muted"> · 보건복지부</span>
            <span class="text-fg-muted"> · 2010</span>
            <span class="ml-2 rounded bg-elevated px-1.5 py-0.5 font-mono text-[10px] text-fg-muted">12345</span>
          </li>
        </ul>
      </dd>
    </div>
    <div class="grid gap-2 border-b border-border pb-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
      <dt class="text-sm font-semibold uppercase tracking-wider text-fg-muted">전문의·세부전문의</dt>
      <dd>
        <ul class="flex flex-col gap-2">
          <li class="text-sm text-fg-default">
            <span class="font-medium">대한비만학회 인정의</span>
            <span class="text-fg-muted"> · 대한비만학회</span>
            <span class="text-fg-muted"> · 2018</span>
            <span class="ml-2 rounded bg-elevated px-1.5 py-0.5 font-mono text-[10px] text-fg-muted">54321</span>
          </li>
        </ul>
      </dd>
    </div>
  </dl>
</section>
```

### 4.2 P-001 Home — Organization + MedicalClinic + WebSite + WebPage

**URL**: http://localhost:3002/demo

**Organization entity 발췌**:

```json
{
  "@type": "Organization",
  "@id": "http://localhost:3002/demo/#organization",
  "name": "다이트한의원 인천 부평점",
  "legalName": "의료법인 다이트",
  "description": "다이트한의원은 단순한 체중 감량이 아닌 건강한 몸의 회복을 목표로 합니다. ...",
  "slogan": "Hello, new me\n새로운 나를 만나다",
  "url": "http://localhost:3002/demo",
  "logo": "https://incheon.daeatdiet.com/theme/daeat/common/images/logo_new.png",
  "founder": { "@type": "Person", "name": "신수용" },
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "@id": "http://localhost:3002/demo/#contact-phone-1",
      "contactType": "reservations",
      "telephone": "1533-8191"
    },
    {
      "@type": "ContactPoint",
      "@id": "http://localhost:3002/demo/#contact-kakao-talk-1",
      "contactType": "카카오 상담",
      "url": "https://pf.kakao.com/_EqUxaxj/chat"
    },
    {
      "@type": "ContactPoint",
      "@id": "http://localhost:3002/demo/#contact-naver-reservation-1",
      "contactType": "네이버 예약",
      "url": "https://naver.me/xsYuWmvD"
    }
  ]
}
```

### 4.3 P-006 Treatment Detail — MedicalProcedure + citation (위키형 정보계층)

**URL**: http://localhost:3002/demo/treatments/goodbye-diet

**MedicalProcedure entity (citation 포함 발췌)**:

```json
{
  "@type": "MedicalProcedure",
  "@id": "http://localhost:3002/demo/treatments/goodbye-diet#procedure",
  "name": "굿바이 다이어트",
  "description": "...",
  "image": "...",
  "citation": [
    {
      "@type": "ScholarlyArticle",
      "@id": "http://localhost:3002/demo/treatments/goodbye-diet#publication-kwon-2026-taeeumin-obesity-multicenter",
      "headline": "...",
      "author": [{ "@type": "Person", "name": "권..." }],
      "datePublished": "2026-...",
      "isPartOf": { "@type": "Periodical", "name": "..." },
      "identifier": [{ "@type": "PropertyValue", "propertyID": "DOI", "value": "10..." }],
      "url": "...",
      "publisher": { "@id": "http://localhost:3002/demo/#organization" }
    }
  ]
}
```

**HTML 좌측 FloatingTOC 발췌** (데스크탑 `lg+`):

```html
<aside aria-label="목차" class="pointer-events-none fixed left-4 z-30 hidden w-52 lg:block 2xl:left-10 2xl:w-64" style="top: 220px">
  <nav class="pointer-events-auto rounded-xl border border-border/50 bg-elevated/90 p-3 shadow-supanova backdrop-blur">
    <div class="mb-3 border-b border-border/60 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-fg-muted">목차</div>
    <ol class="flex flex-col gap-1.5">
      <li>
        <a href="#program-overview" class="grid grid-cols-[1.55rem_minmax(0,1fr)] items-baseline gap-1 rounded-md px-2 py-1 text-xs leading-snug bg-brand-primary-soft font-semibold text-brand-primary">
          <span class="font-mono text-[10px] tabular-nums opacity-70">1</span>
          <span>프로그램 개요</span>
        </a>
      </li>
      <li class="ml-2">
        <a href="#개인-맞춤-진단" class="grid grid-cols-[1.55rem_minmax(0,1fr)] items-baseline gap-1 rounded-md px-2 py-1 text-xs leading-snug text-fg-muted hover:bg-subtle">
          <span class="font-mono text-[10px] tabular-nums opacity-70">1.1</span>
          <span>개인 맞춤 진단</span>
        </a>
      </li>
      ...
    </ol>
  </nav>
</aside>
```

**본문 안 heading anchor 발췌**:

```html
<article class="prose-site max-w-3xl text-fg-default">
  <h2 id="program-overview">프로그램 개요</h2>
  <p>...</p>
  <h3 id="개인-맞춤-진단">개인 맞춤 진단</h3>
  <p>...</p>
  <h2 id="program-overview-2">12주 프로세스</h2>
  <p>...</p>
</article>
```

### 4.4 P-010 Article Detail — Article + citation + mentions + 외부 보도 배지

**URL** (외부 보도 사례): http://localhost:3002/demo/insights/diet/news-eroun-68936

**HTML Hero 안 배지 + 원문 보기 버튼**:

```html
<div class="flex flex-wrap items-center gap-2">
  <span class="text-eyebrow">다이어트</span>
  <span class="inline-flex items-center gap-1 rounded-full bg-brand-primary-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-primary">
    <iconify-icon icon="solar:arrow-right-up-bold" width="11"></iconify-icon>
    언론 보도
  </span>
</div>
<h1 class="mt-5 font-serif-display text-4xl tracking-tightest text-ink-strong md:text-5xl lg:text-6xl">{기사 제목}</h1>
<p class="mt-6 text-lg leading-[1.7] text-fg-muted md:text-xl">{summary}</p>
<a
  href="https://www.eroun.net/news/articleView.html?idxno=68936"
  target="_blank"
  rel="nofollow noopener noreferrer"
  class="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-fg-inverse hover:bg-brand-primary-hover"
>
  원문 보기
  <iconify-icon icon="solar:arrow-right-up-bold" width="16"></iconify-icon>
</a>
```

**body 가 비어있고 externalUrl 만 있을 때 fallback 안내 박스**:

```html
<article class="min-w-0">
  <div class="rounded-2xl border border-border bg-elevated p-6 text-sm leading-relaxed text-fg-muted">
    본 글은 외부 매체에 게재된 보도 자료입니다. 본문은 원문 매체에서 확인해 주세요.
    <div class="mt-4">
      <a href="https://www.eroun.net/..." target="_blank" rel="nofollow noopener noreferrer"
         class="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-primary-hover">
        원문 보기
        <iconify-icon icon="solar:arrow-right-up-bold" width="14"></iconify-icon>
      </a>
    </div>
  </div>
</article>
```

### 4.5 P-011 FAQ — FAQPage + Question + Answer

**URL**: http://localhost:3002/demo/faq

**JSON-LD FAQPage entity 발췌** (published FAQ 1건 이상):

```json
{
  "@type": "FAQPage",
  "@id": "http://localhost:3002/demo/faq#faqpage",
  "inLanguage": "ko-KR",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "굿바이 다이어트 프로그램은 얼마나 걸리나요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "기본 12주 (3개월) 진행이며, 사후 관리 12주를 포함하면 총 24주 (6개월) 의 여정입니다. ..."
      }
    }
  ]
}
```

> **published FAQ 0건일 때 (현 v0.1 단계 기본값)**: `mainEntity: []` 로 빈 배열 출력 — schema.org 안 허용 + rule checker 통과 (`builders.ts:254-266` + `eat-validate.test.ts:143`). compliance-assistant 본 구현 합류 시 published 차단 해제 예정 (LL-DEFER-01). Google Rich Results 안 FAQPage rich snippet 자격은 Q&A 1쌍 이상 있어야 부여됨.

---

## 5. 운영자 안내 — 데이터 입력 시점

| 항목 | 입력 위치 (어드민) | 노출 페이지 |
|---|---|---|
| 의료진 자격·인증 | `/admin/<slug>/doctors/<doctorSlug>` — "자격·인증 · 전문분야" fieldset | Doctor Profile (`/doctors/<doctorSlug>`) — `hasCredential` JSON-LD + CredentialsSection |
| 전문분야 (medicalSpecialty) | 동일 fieldset — 쉼표 구분 입력 | Doctor Profile — `medicalSpecialty` JSON-LD + chip |
| Pillar | `/admin/<slug>/clinic-profile` — metadata.treatmentPillars | Home · Treatments List · Treatment Detail breadcrumb |
| 카테고리 | `/admin/<slug>/categories` | Articles List · Article Detail (URL slug) |
| 인용 (cites) | 각 entity 편집 페이지 안 EvidenceLinkPanel | Article/Treatment Detail "이 글의 근거" + JSON-LD citation |
| 외부 보도 글 | `/admin/<slug>/articles/<articleSlug>` — `external_url` 필드 | Article Detail — "언론 보도" 배지 + "원문 보기" 버튼 |
| 증상 안내 (Phase B) | `/admin/<slug>/conditions/new` 또는 기존 row 편집 | `/conditions/<slug>` 상세 + `/conditions` list + sitemap + JSON-LD `MedicalCondition` |
| 증상 ↔ 진료 매칭 (Phase B) | conditions form 안 "관련 진료 (Primary Treatment)" select | Condition Detail Hero CTA + sticky aside · JSON-LD `possibleTreatment` cross-reference |

---

## 6. 외부 검증 도구

| 도구 | URL | 용도 |
|---|---|---|
| schema.org Validator | https://validator.schema.org/ | JSON-LD 구문 + 필수 필드 확인 |
| Google Rich Results Test | https://search.google.com/test/rich-results | 검색 결과 안 rich snippet 노출 가능성 확인 |
| 자체 rule checker (CI) | `pnpm --filter @glitzy/web exec vitest run src/lib/json-ld/__tests__/` | entity required-field · cross-page ref allowlist · 금지 schema 차단 |

검수 명령 (URL 1개에 대한 모든 entity validate):

```bash
# dev 서버 띄운 상태에서
curl -s http://localhost:3000/demo/doctors/shin-soo-yong \
  | python3 -c "import sys, re, json; html=sys.stdin.read(); m=re.search(r'<script[^>]*application/ld\\+json[^>]*>(.+?)</script>', html, re.DOTALL); print(json.dumps(json.loads(m.group(1)), ensure_ascii=False, indent=2))" \
  | tee /tmp/ldjson.json
# 결과 JSON 을 https://validator.schema.org/ 에 붙여넣어 검증
```

---

## 7. 현재 구현 제한 (운영·외부 공유 시 명시 필요)

본 cycle 의 구현 스냅샷 안에서 명세 (SoT 문서) 와 실제 코드가 일치하지 않거나, 의도적 단순화로 인해 운영자·외부 SEO 검수자에게 사전 안내가 필요한 항목들:

### 7.1 sitemap 포함/제외

§ 2.4 표 참조. **EXPOSURE_READINESS Phase A 적용 후 (2026-05-26)**: `/legal/{type}` 만 명시적 제외 — 의료광고법 법정 문서 색인 가치 낮음. 나머지 모든 site 페이지 색인.

### 7.2 content_entity_link 실제 허용 매트릭스

§ 3.4 참조. **`DoctorProfile` · `ClinicProfile` 은 source/target 모두 불허** (DB CHECK). 의료진 ↔ 글 직접 link 는 `article.author_doctor_id` FK 가 SoT — 이중 SoT 회피. 운영자가 evidence-link panel 에서 doctor 를 선택할 수 없는 것은 의도된 제약.

### 7.3 FAQ `mainEntity: []` 빈 배열 동작

§ 4.5 참조. published FAQ 0건일 때 빈 배열 출력 — schema 통과하나 Google FAQPage rich snippet 자격은 없음. v0.1 단계 기본값 (compliance-assistant 본 구현 합류 전).

### 7.4 금지 schema denylist runtime guard 미구현

§ 1.6 참조. `Review` · `AggregateRating` · `Offer` 등 금지 schema 는 **생성기 안 출력 경로 자체가 없어 site SSR 안 절대 생성되지 않음** ("기능적 차단"). 다만 rule checker 안 명시적 denylist 검사 로직은 없음. 향후 외부 통합 (예: 카카오톡 위젯) 안 자체 schema 삽입 incident 대비, validator runtime guard 추가 권장.

### 7.5 credential 입력 검증 수준

§ 1.3 참조. 현재 server-side 검증은 `name`(빈값/200자) + `url`(http/https prefix) 만. **`issuedAt` 의 `YYYY`/`YYYY-MM-DD` 포맷 검증은 운영 가이드 수준** — server 안 강제되지 않음. 잘못된 포맷 입력 시 JSON-LD `dateCreated` 안 invalid string 그대로 출력 (Google parse 실패 가능). 향후 zod schema 검증 추가 권장.

### 7.6 Schema 통과 ≠ Google Rich Results 자격

`schema.org Validator` 통과와 `Google Rich Results Test` 통과는 별개 기준이다. 현재 구현 안 알려진 gap:

| Entity | 명세 (SoT) 안 필수 | 현재 코드 안 동작 | Rich Results 영향 |
|---|---|---|---|
| `VideoObject` | `thumbnailUrl` (SCHEMA_MAPPING § 6.2) | `media.thumbnailUrl ? ... : {}` — optional (`entities.ts:307`) | 누락 시 Google Video rich result 자격 미부여 — 운영자가 입력 시 권장 |
| `Article` | `image` (rich result 필수) | `article.heroImageUrl ? ... : {}` — optional | hero 미입력 시 article rich snippet 자격 미부여 |
| `Physician` | `medicalSpecialty` 필수 | 미입력 시 fallback `"MedicalSpecialty"` placeholder | placeholder 는 schema 통과하나 Google 안 의미 없는 값 — 운영자가 실 specialty 입력 권장 |
| `MedicalClinic` | `geo` · `openingHoursSpecification` | location 안 입력 시만 출력 | 누락 시 Local Pack 노출 감소 가능 |

> **운영 인계 시**: schema.org 통과 = 구문 OK / Rich Results 자격 = 검색 결과 안 rich snippet 노출 가능. 두 기준을 분리해 안내 필요.

### 7.7 기타 알려진 제약

- 의료기관 인증 입력 (`credentials`) 은 어드민 안 최소 1개 강제 안 함 — `credentials.length === 0` 도 정상. 운영자가 입력 안 한 의료진 페이지는 `hasCredential` JSON-LD 미출력 + CredentialsSection 미렌더 (전문분야도 없으면 `null` return).
- E-A-T 확장 4 페이지 (`/publications` · `/media-appearances` · `/community` · `/insights/{category}`) 는 site SSR 동작하나 sitemap 미포함 — § 7.1.
- 다지점 (`/locations/{slug}` 비본원) 합류 시 sitemap 자동 포함되나, 현재 demo 인스턴스는 main 단지점만 있어 sitemap 안 1 row.

---

## 8. 변경 이력

- **2026-05-26 (v1.3)**: EXPOSURE_READINESS Phase B 적용 — P-007/P-008 Conditions 격상 (의료 검색 유입 페이지). C0040 migration (`medical_condition_page` + RLS + public_reader + published_compliance_guard trigger 합류 + `content_entity_link` CHECK 안 `MedicalConditionPage` 합류). drizzle schema + db-projection + JSON-LD `MedicalCondition` entity + `conditionsListGraph`/`conditionDetailGraph` builders. site SSR list (`/conditions`) + detail (`/conditions/{slug}` — FloatingTOC + primary_treatment CTA + 관련 증상 grid). admin CRUD (`/admin/<slug>/conditions/...` + `MedicalConditionForm` + NavMenu 합류). sitemap 8 entries 추가 (1 list + 5 detail · demo 인스턴스). RELATION_TARGET_MATRIX 확장 (Article·Treatment·FAQ·Condition 모두 양방향). demo seed 5건 (산후/갱년기/복부/요요/사춘기 비만). § 1.5 페이지 graph 표 · § 2.1 URL 트리 · § 2.2 14 필수 · § 2.4 sitemap · § 3.4 cross-link · § 5 운영자 안내 모두 갱신.
- **2026-05-26 (v1.2)**: EXPOSURE_READINESS Phase A 적용 — robots.txt 안 AI 학습 bot 5종 (GPTBot · ClaudeBot · Google-Extended · CCBot · anthropic-ai) Disallow → Allow 로 전환 (GEO 우선 정책). sitemap 안 `/insights` list · category landing · `/publications` (+detail) · `/media-appearances` (+detail) · `/community` 5종 페이지 색인 합류. legal 만 제외 유지. 변경 후 demo 인스턴스 sitemap 81 entries.
- **2026-05-26 (v1.1)**: 외부 비평 7건 흡수 — § 1.3 issuedAt 검증 수준 분리 · § 1.5 hasCredential optional 명시 · § 1.6/§ 1.7 denylist 차단 메커니즘 (생성기 vs runtime guard) 분리 · § 2.4 sitemap 실 포함/제외 매트릭스 · § 3.4 content_entity_link 실 매트릭스 (DoctorProfile/ClinicProfile 불허) · § 4.5 FAQ 빈 배열 동작 · § 7 "현재 구현 제한" 신규 섹션 (sitemap · cross-link · denylist · credential 검증 · Rich Results gap).
- **2026-05-26 (v1.0)**: 최초 작성. Phase 5.2 cycle (의료기관 인증 스키마 + 위키형 정보계층 + RLS 안전망 + 외부 보도 article 통합) 산출물 정리.
