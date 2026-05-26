# 키워드 → URL → 검색 의도 → Funnel Stage 매핑 SoT

> **목적**: Glitzy 의료기관 웹사이트 노출 솔루션의 키워드 전략 단일 SoT. 어떤 검색어를 어느 URL 패턴이 잡고, 어떤 검색 의도·funnel stage 에 매핑하며, 어떤 전환·콘텐츠 깊이를 기대하는지 정리.
>
> **작성일**: 2026-05-26 (EXPOSURE_READINESS Phase C — 외부 비평 흡수)
> **대상**: 외부 SEO 컨설턴트 · 운영자 (KeywordTarget 등록 가이드) · 콘텐츠 기획자
> **상위 SoT**:
> - 페이지 타입 → `docs/core/PAGE_TYPES.md`
> - KeywordTarget DB schema → `packages/core-content/migrations/C0031_keyword_target.sql`
> - 어드민 keywords UI → `apps/web/src/app/(admin)/admin/[instanceSlug]/keywords/`
> - 핸드오프 통합 → `docs/handoff/MEDICAL_SCHEMA_AND_INFO_ARCHITECTURE.md`
>
> **첫 적용 인스턴스**: `demo` (다이트한의원 인천 부평점)

---

## 0. 핵심 매핑 한 페이지

```
[검색 의도 / Funnel Stage]            [URL 패턴]                     [페이지 타입]      [기대 전환]
────────────────────────────────────────────────────────────────────────────────────────────────
informational (인지)                   /conditions/{slug}              P-008 Condition    안내·신뢰
                                       /insights/{cluster}/{slug}      P-010 Article      안내·신뢰
                                       /insights/{cluster}             P-009 Category     발견
                                       /faq                            P-011 FAQ          질의 해결

comparison (고려)                      /treatments/{slug}              P-006 Treatment    비교 검토
                                       /insights/{cluster}/{slug}      P-010 Article      비교
                                       /doctors/{slug}                 P-004 Doctor       권위 확인

pre-booking (전환)                     /contact                        P-012 Contact      예약 직전
                                       /treatments/{slug} CTA          P-006 Treatment    예약 CTA
                                       /conditions/{slug} CTA          P-008 Condition    "관련 진료" CTA

local (지역)                           / (Home)                        P-001 Home         지역 + 클리닉 신뢰
                                       /locations/{slug}               P-014 Location     영업·예약·길찾기
                                       /contact                        P-012 Contact      예약·지도
```

**Funnel stage = `KeywordTarget.intent` 4종 의 의미적 동의어**:
| KeywordTarget.intent | Funnel stage 의미 | 페이지 매핑 우선순위 |
|---|---|---|
| `informational` | 인지 (Awareness) | Conditions · Article · FAQ |
| `comparison` | 고려 (Consideration) | Treatment · Article · Doctor |
| `pre-booking` | 전환 (Decision) | Contact · Treatment/Condition CTA |
| `local` | 지역 (Local Intent) | Home · Location · Contact |

---

## 1. KeywordTarget entity 운영 안내

### 1.1 schema 요약 (DB SoT — C0031 migration)

| 필드 | 타입 + CHECK | 운영 의미 |
|---|---|---|
| `label` | TEXT 1~100자 | 검색어 그대로 (예: "산후 다이어트 한약", "복부비만 한방") |
| `slug` | TEXT regex 한국어 허용 | URL-safe (어드민 안 keyword 페이지 식별) |
| `keyword_type` | `primary` \| `secondary` | primary = 페이지의 1차 표적, secondary = 보조 |
| `parent_id` | self-FK | secondary 가 primary 의 자식 — 동의어/변형 군집화 |
| `intent` | `informational` \| `comparison` \| `pre-booking` \| `local` | 4종 (funnel stage 의미적 동의어) |
| `priority` | `P0` \| `P1` \| `P2` | P0 = 핵심 (top 10 안), P1 = 중요 (top 30), P2 = 보조 |
| `difficulty` | INT 0~100 | SERP 경쟁도 (운영자 추정) |
| `status` | `active` \| `paused` \| `won` \| `dropped` | active 만 readiness 카운팅, won = 목표 달성 (top 3 안 안정), dropped = 운영 포기 |

### 1.2 어드민 입력 가이드

`/admin/<slug>/keywords` 안:
1. **새 키워드 추가**: label · slug 입력 → intent · priority · difficulty 선택
2. **매핑 — 콘텐츠 연결**: keyword 편집 페이지 안 "관련 콘텐츠" 섹션 → 5종 entity (Article · TreatmentPage · MedicalConditionPage · FAQ · Publication · MediaAppearance) row 선택 + 1차 (`is_primary=true`) 지정
3. **부모 (parent_id)**: primary 키워드 1개에 secondary 키워드 N개 묶기 → 동의어 군집화

### 1.3 KeywordCoverageCard (어드민 대시보드)

`/admin/<slug>` 안 노출:
- **활성 키워드 수** (status=active 만 분모)
- **콘텐츠 매핑 완료 비율** (1개 이상 entity link 있는 키워드 / 전체)
- **won 키워드 수** (목표 달성 — top 3 안 안정 진입) — 별도 footer

코드: `apps/web/src/lib/admin/dashboard-data.ts` 안 `loadKeywordCoverage`.

---

## 2. 클러스터 ↔ URL 매핑 (Article 7 cluster · Phase C 신설)

### 2.1 신규 7 cluster (article_category)

| slug | name | URL | 대표 keyword 예 | intent |
|---|---|---|---|---|
| `weight-loss-science` | 체중감량 원리 | `/insights/weight-loss-science` | "다이어트 원리", "기초대사량 회복", "지방 vs 근육 차이" | informational |
| `lifecycle-diet` | 생애주기 다이어트 | `/insights/lifecycle-diet` | "산후 다이어트", "갱년기 살빼기", "사춘기 비만" | informational |
| `herbal-prescription` | 한약·처방 | `/insights/herbal-prescription` | "다이어트 한약 종류", "약침 효과", "한약 성분" | comparison |
| `yoyo-maintenance` | 요요·유지관리 | `/insights/yoyo-maintenance` | "요요 방지", "다이어트 유지 방법", "감량 후 관리" | informational |
| `body-shape` | 체형·부분비만 | `/insights/body-shape` | "복부비만", "하체 비만", "팔뚝 살" | informational |
| `lifestyle-diet` | 생활습관·식단 | `/insights/lifestyle-diet` | "다이어트 식단", "운동 없이 살빼기", "수면과 체중" | informational |
| `precautions` | 부작용·주의사항 | `/insights/precautions` | "다이어트 한약 부작용", "임신 중 한약 가능", "한약 금기" | informational |

### 2.2 기존 3 cluster (유지 · display_order 100 이상으로 후순위)

| slug | name | 현 운영 의미 |
|---|---|---|
| `general` | 일반 | 7 cluster 중 어디에도 안 맞는 글 / 운영 초기 일반 글 |
| `diet` | 다이어트 | 기존 일반 다이어트 글 — 운영자가 7 cluster 중 어디로 재분류할지 결정 |
| `health` | 건강 | 기존 건강 일반 글 |

> 운영자가 어드민 안 article 편집 페이지에서 category 를 7 신규 cluster 중 1개로 단계별 이동. 모든 article 이 7 cluster 안 들어가면 기존 3 카테고리 삭제 가능.

### 2.3 cluster ↔ Pillar/Treatment 매핑 (외부 SEO 권장)

- `weight-loss-science` ↔ Pillar/Treatment ↔ `diet-treatment` (전체 시술 wrapper)
- `lifecycle-diet` ↔ Conditions (P-008) `postpartum-weight-gain` · `menopause-weight-gain` · `adolescent-obesity` + Treatments `postpartum-diet` · `menopause-diet`
- `herbal-prescription` ↔ Pillar `herbal-medicine` · Treatments `goodbye-diet` · `lipolysis-pharmacopuncture`
- `yoyo-maintenance` ↔ Conditions `yoyo-cycle` + Treatments `yoyo-prevention`
- `body-shape` ↔ Pillar `body-shaping` · Conditions `abdominal-obesity`
- `lifestyle-diet` ↔ Treatments `three-go-diet` · Publications · MediaAppearance
- `precautions` ↔ FAQ + LegalDocument (`non-covered`) 보조

cluster 마다 1개 이상 글이 게시되고, 같은 cluster 안 다른 글 3개가 "관련 글" grid 로 inverse 노출 — **topical authority 강화**.

---

## 3. 페이지 타입별 검색 의도 모델

### 3.1 P-008 Condition Detail (의료 검색 유입 · Phase B 합류)

- **타깃 intent**: `informational` (인지) — "산후 다이어트 한약 가능한가요?" 같은 검색
- **URL 패턴**: `/conditions/{slug}` (예: `/conditions/postpartum-weight-gain`)
- **콘텐츠 깊이**:
  - 증상의 특징 + 일반 다이어트와 차이
  - 한방 접근 단계별 가이드 (체질 진단 · 처방 · 사후 관리)
  - 자주 묻는 질문 인라인 (Q&A)
  - "관련 진료" CTA (primary_treatment_id → Treatment 페이지로 funnel 연결)
- **전환**: Condition → Treatment → Contact (예약).

### 3.2 P-006 Treatment Detail (전환 페이지)

- **타깃 intent**: `comparison` (고려) — "굿바이 다이어트 프로그램", "디톡스 한약" 같은 비교 검색
- **URL 패턴**: `/treatments/{slug}` (예: `/treatments/goodbye-diet`)
- **콘텐츠 깊이**:
  - 프로그램 개요 + 12주 프로세스
  - KEY_EFFECTS 3-step (체질 진단 · 맞춤 처방 · 사후 관리)
  - 같은 pillar 의 다른 시술 3개 (cross-link)
  - Evidence (Publication/MediaAppearance citation)
- **전환**: Treatment → Contact (예약 CTA).

### 3.3 P-010 Article Detail (인지/고려 양다리)

- **타깃 intent**: `informational` · `comparison` 둘 다 (글 성격에 따라)
- **URL 패턴**: `/insights/{cluster}/{slug}`
- **콘텐츠 깊이**:
  - h2/h3 heading 안 좌측 TOC 자동 노출 (위키형 정보계층)
  - 저자 (Physician @id cross-reference) — E-A-T 신호
  - "이 글의 근거" + "관련 콘텐츠" + "관련 FAQ" 3 inverse 섹션
  - "같은 카테고리 다른 글 3개" grid
- **전환**: Article → 관련 Treatment / Condition / Contact.

### 3.4 P-011 FAQ (질의 해결)

- **타깃 intent**: `informational` — "다이어트 한약 가능한가요?", "비용은 얼마인가요?" 같은 짧은 질문형
- **URL 패턴**: `/faq` + anchor `#faq-{slug}`
- **콘텐츠 깊이**: Q&A 짧은 답변. FAQPage JSON-LD `mainEntity` 배열 — Google rich snippet 자격.

### 3.5 P-001 Home / P-014 Location (지역)

- **타깃 intent**: `local` — "부평 다이어트 한의원", "인천 한방 비만 클리닉" 같은 지역 modifier 검색
- **URL 패턴**: `/` · `/locations/{slug}`
- **콘텐츠 깊이**:
  - 의료기관 정체성 (Organization + MedicalClinic JSON-LD)
  - 영업 시간 (openingHoursSpecification)
  - 지도 (geo coordinates)
  - 예약 CTA (ContactPoint 안 phone/카카오/네이버 예약)
- **전환**: Home/Location → Contact (예약 직행).

---

## 4. 키워드 등록 전략 (운영자 가이드)

### 4.1 우선순위 P0 키워드 등록 (10개 안 내)

다이트한의원 demo 기준 권장 P0:
1. "부평 다이어트 한의원" (`local`)
2. "산후 다이어트 한약" (`informational` → `/conditions/postpartum-weight-gain` 또는 Treatment `postpartum-diet`)
3. "갱년기 살빼기" (`informational` → `/conditions/menopause-weight-gain`)
4. "복부비만 한방" (`informational` → `/conditions/abdominal-obesity`)
5. "굿바이 다이어트" (`comparison` → `/treatments/goodbye-diet`)
6. "다이어트 한약 부작용" (`informational` → `/insights/precautions/...`)
7. "요요 방지" (`informational` → `/conditions/yoyo-cycle`)
8. "다이어트 한약 비용" (`pre-booking` → `/legal/non-covered`)
9. "신수용 원장" (`comparison` → `/doctors/shin-soo-yong`)
10. "한방 비만 치료" (`comparison` → `/treatments` list)

### 4.2 secondary 키워드 묶음 (parent_id self-FK 활용)

primary "산후 다이어트 한약" 의 secondary 예:
- "출산 후 한약 가능"
- "수유 중 다이어트 한약"
- "산후 비만 한방"
- "산모 한약"

→ 모두 `parent_id` = "산후 다이어트 한약" 의 id 로 묶음. 같은 페이지가 가져가는 query 군집.

### 4.3 difficulty 추정 가이드

- **0~30**: 롱테일 (예: "갱년기 다이어트 한약 부작용 임신 가능") — 운영자 글 1편으로 top 3 가능
- **30~60**: 중간 (예: "산후 다이어트 한약") — 4~6개월 + 다수 cluster 글 + 외부 인용 필요
- **60~100**: 빅 키워드 (예: "다이어트 한의원") — 1년+ 누적 콘텐츠 + 백링크 필수. 단지점 클리닉이 잡기 어려운 영역.

---

## 5. 현재 구현 제한 (운영 시 명시)

### 5.1 KeywordTarget 안 funnel_stage 별도 컬럼 미보유

`intent` 4종이 funnel stage 의미적 동의어 역할 (운영 결정 2026-05-26). retention (유지) 단계는 status=`won` 의 사후 관리로 우회. 향후 retention 분리 필요 시 별도 column 신설 (`KeywordTarget.funnel_stage` 또는 `is_retention`).

### 5.2 keyword_content_link MedicalConditionPage 합류 (Phase C)

`keyword_content_link.entity_type` CHECK 안 `MedicalConditionPage` 추가 (C0040 migration). 어드민 keyword 편집 시 Conditions 도 매핑 대상으로 선택 가능. **단, 어드민 form UI 안 Conditions select 옵션 노출은 다음 cycle** — 현재는 API 레벨만 합류.

### 5.3 자동 keyword → URL 매핑 (KeywordCoverage automated suggest) 미구현

운영자가 수동으로 keyword 와 entity 를 매핑해야 함. 향후 `KeywordCoverageCard` 안 "이 키워드를 어디에 연결할지 추천" 기능 (search-visibility data + 본문 텍스트 매칭) 합류 권장.

### 5.4 Article 재분류 (기존 3 카테고리 → 7 신규 cluster) 수동

Phase C 안 7 신규 cluster 만 추가. 기존 3 카테고리 (general/diet/health) 의 article 들이 자동 재분류 안 됨. 운영자가 어드민 안 article 편집 페이지에서 cluster 이동 필요. 모든 article 이 7 cluster 로 이동한 후 기존 3 카테고리 row 삭제 가능 (단, sitemap `/insights/{category}` landing 안 row 1개 이상 카테고리만 노출 정책 정합 — Phase A).

### 5.5 지역 modifier 콘텐츠 (Local SEO Phase D 후보)

"부평 다이어트 한의원", "인천 산후 다이어트" 같은 지역 + 진료/증상 조합 키워드 대응은 별도 cycle. 현재 LocationProfile + MedicalClinic JSON-LD 는 있지만, Article/Treatment body 안 지역 modifier 자연 삽입 가이드 (운영 작성 표준) 가 없음. 다음 Phase 안 EXPOSURE_READINESS Phase D 후보.

---

## 6. 변경 이력

- **2026-05-26 (v1.0)**: 최초 작성 (EXPOSURE_READINESS Phase C). 외부 비평 #2 keyword mapping + #5 article category cluster 흡수. 7 신규 cluster seed · keyword_content_link 안 Conditions 합류 · SeoKeywordEntityType 확장.
