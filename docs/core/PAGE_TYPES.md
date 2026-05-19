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
| 가격·이벤트 (포함 시) | — | **자동 High** |
| CTA | Low~Medium | 할인·이벤트 결합 → High |

**컴플라이언스 주의**: 슬롯별 격상은 가이드. 실제 적용은 `compliance-assistant` 자동 보조 + 운영자 최종 결정. 의료진 검토 필수.

**내부 링크 권장**: → 담당 의료진 / 관련 질환 / 관련 시술 / FAQ

### P-007. Conditions List

**목적**: 질환·증상 정보 페이지 진입로. 다이어트 한의원은 증상 기반 쿼리 비중 큼 (Phase Alpha 우선 합류 권장).
**URL**: `/conditions`
**주 데이터 계약**: `MedicalConditionPage[]`
**Schema 요약**: BreadcrumbList + ItemList.

**정보 슬롯**: 질환·증상 카드 / 분류 그룹(선택)
**헤딩 위계**: H1 "질환·증상 정보" / H2 분류 그룹명
**필수 블록**: 카드 그리드
**선택 블록**: 분류 필터
**레이아웃 변형**: P-005 동일
**위험도 기본값**: Low
**컴플라이언스 주의**: 질환명·간략 설명에 진단 단정·효과 표현 금지.
**내부 링크 권장**: → 각 Condition Detail / 관련 Treatments

### P-008. Condition Detail

**목적**: 특정 질환·증상 정보 콘텐츠. 검색 의도 "OO증상이 뭐예요" 충족.
**URL**: `/conditions/{slug}`
**주 데이터 계약**: `MedicalConditionPage`
**Schema 요약**: `MedicalCondition` (signOrSymptom, riskFactor, possibleTreatment) + BreadcrumbList + (해당 시) FAQPage.

**정보 슬롯**:
1. 정의·핵심 답변 (1~2문장)
2. 주요 증상
3. 원인·위험 요인
4. 진단 방법 (일반론)
5. 치료 옵션 개요 (Treatment Detail로 링크)
6. 예방·관리
7. 자주 묻는 질문
8. 관련 시술 (백링크)
9. 관련 의료진

**헤딩 위계**: H1 질환명 / H2 "주요 증상", "원인", "진단", "치료", "예방·관리", "자주 묻는 질문"
**필수 블록**: 정의 / 주요 증상 / 원인 / 치료 옵션 / 예방
**선택 블록**: 진단 / FAQ / 관련 시술 / 관련 의료진
**레이아웃 변형**: P-006 동일
**위험도 기본값**: Medium
**컴플라이언스 주의**: 진단·치료 단정 금지. 자가 진단 유도 금지. 일반 의학 정보로 한정.
**내부 링크 권장**: → 관련 Treatments / 관련 Articles / FAQ

### P-009. Articles List

**목적**: 인사이트·정보 콘텐츠 목록.
**URL**: `/insights` 또는 `/blog`
**주 데이터 계약**: `Article[]`
**Schema 요약**: BreadcrumbList + ItemList 또는 Blog.

**정보 슬롯**: Article 카드(제목·요약·저자·발행일·읽기 시간·카테고리·콘텐츠 형식 배지) / 카테고리 필터·페이지네이션·검색
**헤딩 위계**: H1 "인사이트" / H2 Pillar 그룹
**필수 블록**: Article 카드 목록
**선택 블록**: 카테고리 필터 / 검색 / RSS / 콘텐츠 형식 필터
**레이아웃 변형**: 카드 그리드 / 매거진 리스트 / 잡지형
**위험도 기본값**: Low
**컴플라이언스 주의**: 발췌 요약에 의학적 단정 금지.
**내부 링크 권장**: → 각 Article Detail / 카테고리 페이지

> v0.5 비고: Article에 `contentFormat`(article·video·column) 필드. P-009는 분할하지 않고 형식 배지·필터로 분류.

### P-010. Article Detail

**목적**: 단일 인사이트·정보 콘텐츠. AI 스니펫 인용 핵심 단위.
**URL**: `/insights/{category}/{slug}` 또는 `/blog/{slug}`
**주 데이터 계약**: `Article`
**Schema 요약**: `Article` (headline, datePublished, dateModified, author=Physician/Person, publisher, mainEntityOfPage, articleSection, wordCount, inLanguage) + BreadcrumbList + (Q&A 블록 시) FAQPage + (video 시) VideoObject.

**정보 슬롯**:
1. 제목 + 핵심 요약 (1~2문장)
2. 메타 (저자·발행일·수정일·읽기 시간·카테고리·콘텐츠 형식 배지)
3. 본문 (의도적 구조 — 헤딩·리스트·표·Q&A)
4. 임베디드 미디어 (`embeddedMedia[]`) — YouTube·외부 인용
5. **검수 정보** (`reviewedBy`) ⭐ — 의료진 검수자
6. **출처·재게재** (`contentSource`·`externalUrl`) ⭐ — 자체 작성 / 외부 인용 / 재게재 명시
7. 저자 프로필 카드 (DoctorProfile 백링크)
8. 관련 글 (같은 Pillar 3개)
9. 관련 시술·질환
10. CTA

> ⭐ = v0.5 신규 슬롯 (DATA_MODEL v0.4 Article 신규 필드)

**헤딩 위계**: H1 글 제목 / H2 본문 섹션 (질문형 권장)
**필수 블록**: 제목 / 메타 / 본문 / 저자 카드
**선택 블록**: 임베디드 미디어 / 검수 정보 / 관련 글 / 관련 시술 / FAQ / CTA

**ArticleType별 위험도 분류**:

| ArticleType | 기본 위험도 |
|---|:---:|
| `notice` | Low |
| `general-medical-info` | Medium |
| `treatment-explainer` | Medium |
| `condition-explainer` | Medium |
| `effect-result-related` | **High** |
| `review-case` | **High** |
| `event-price` | **High** |

**레이아웃 변형**: 좌본문·우사이드바 / 풀폭 본문 / 매거진형

**컴플라이언스 주의**: 수정 시 `dateModified` 갱신. 의료진 검토 필수 (Medium/High). Embedded video도 ArticleType·RiskLevel 적용. `contentSource: republished` 시 원본 권한·출처 표시 의무. `reviewedBy`는 의료진(DoctorProfile) 참조.

**내부 링크 권장**: → 저자 프로필 / 관련 Articles / 관련 Treatments / 관련 Conditions

### P-011. FAQ

**목적**: 자주 묻는 질문. AI 스니펫·사이트 브리핑 직접 인용 후보.
**URL**: `/faq`
**주 데이터 계약**: `FAQ[]`
**Schema 요약**: `FAQPage` (mainEntity = Question[]) + BreadcrumbList.

**정보 슬롯**: 카테고리 그룹별 Q&A 쌍
**헤딩 위계**: H1 "자주 묻는 질문" / H2 카테고리명 / H3 각 질문(또는 아코디언)
**필수 블록**: Q&A 쌍 모음
**선택 블록**: 카테고리 필터 / 검색
**레이아웃 변형**: 아코디언 / 평면 리스트 / 카드 / 탭

**위험도 — 답변 단위 분류**:

| 답변 주제 | 등급 |
|---|---|
| 진료·예약·위치·시간 | Low |
| 시술·치료 일반론 | Medium |
| 치료 효과·결과·후기 | High |
| 가격·이벤트 | High |

**컴플라이언스 주의**: 효과 단정·"100% 안전" 금지.
**내부 링크 권장**: → 관련 Treatment / Article / Condition

### P-012. Contact / Visit — Conversion Hub

**목적**: 위치·진료시간·예약·상담 채널의 통합 전환 허브. 단순 안내 페이지가 아닌 **다중 CTA 채널 집결지**. M0 필수.
**URL**: `/contact` 또는 `/visit`
**주 데이터 계약**: `ClinicProfile` (요약) + `LocationProfile[]` (1개 이상) + `CTAConfig[]`
**Schema 요약**: 단지점은 `MedicalClinic`/`LocalBusiness`. 다지점은 본원 + 각 지점 별도 LocalBusiness. BreadcrumbList.

**정보 슬롯**:
1. **예약·상담 채널 집결** — 전화·네이버예약·네이버톡톡·카카오톡·온라인폼·비대면진료·외부 예약 (모두 `CTAConfig[]`)
2. 주소·지도 (단지점 main 또는 다지점 목록)
3. 진료시간·접수시간·점심·휴진 (`BusinessHours`)
4. 대중교통·주차 안내
5. 다지점인 경우 — 지점 목록 + 각 P-014 Location Detail 링크
6. 응급·긴급 대응 (해당 시)
7. 진료 전 준비 사항 (해당 시)

**헤딩 위계**: H1 "방문 안내" 또는 "예약·상담" / H2 "예약 채널", "위치", "진료시간", "오시는 길", "다른 지점"
**필수 블록**: 예약·상담 채널(다중) / 주소 / 진료시간 / 연락처
**선택 블록**: 지도 / 대중교통 / 주차 / 다지점 목록 / 응급 안내
**레이아웃 변형**: 분할 / 풀폭 지도+CTA 카드 / 채널 카드 그리드 + 위치 분리
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

### P-101. Reviews — High-risk commercial

**목적**: 환자 후기 노출. 솔루션의 가장 위험한 영역.
**URL**: `/reviews`
**주 데이터 계약**: `ReviewPolicy` (필수) + 후기 콘텐츠
**Schema 요약**: `Review` 사용 신중. BreadcrumbList만 권장.
**활성화**: Add-on + 법무·외부 자문 + compliance-assistant 자동 검수
**정보 슬롯**: ReviewPolicy에 따라 결정 — 일반적으로 후기 카드 / 정책 안내 / (등록 안내)
**헤딩 위계**: H1 "환자 후기" / H2 분류·정렬
**필수 블록**: 정책 안내 / 후기 카드
**레이아웃 변형**: 카드 그리드 / 리스트 / 슬라이더(주의)
**위험도 기본값**: **High**
**컴플라이언스 주의**: 의료법 제56조·제57조 위반 소지. 효과 단정 후기 금지. 전후사진은 의료광고심의 대상. "환자 주관적 경험" 명시 + 의학적 효과 분리. 법무 자문 권장.

### P-102. Pricing — High-risk commercial

**목적**: 진료·시술 비용 정보.
**URL**: `/pricing`
**주 데이터 계약**: `PricingPage`
**Schema 요약**: 신중. `Offer` 부적합. `WebPage`만 권장.
**활성화**: Add-on + compliance-assistant
**정보 슬롯**: 진료 항목·간략 설명 / 가격(범위) / 비급여 명시 / 적용 조건 / 결제·환불 정책 / 문의
**헤딩 위계**: H1 "가격 안내" / H2 진료 카테고리
**필수 블록**: 진료 항목 / 가격 / 적용 조건
**레이아웃 변형**: 표 / 카드 / 리스트
**위험도 기본값**: **High**
**컴플라이언스 주의**: 가격 광고 제한. "최저가·할인·특가" 금지. 비급여 명시. 이벤트·할인 결합 신중.

### P-103. Facilities / Equipment

**목적**: 시설·장비 소개.
**URL**: `/facilities`
**주 데이터 계약**: `FacilitiesPage`
**Schema 요약**: 일반적으로 `WebPage`.
**활성화**: Instance 결정
**정보 슬롯**: 진료 환경 개요 / 시설 카테고리 / 각 시설 사진·설명 / (해당 시) 장비 도입 사실·기본 사양 / 위생·관리 안내
**헤딩 위계**: H1 "시설 안내" / H2 시설 카테고리
**필수 블록**: 시설 개요 / 시설 사진·설명
**레이아웃 변형**: 갤러리 / 카드 / 타임라인
**위험도 기본값**: Medium
**컴플라이언스 주의**: 시설·장비 효과·우월성 단정 금지. "국내 유일·최첨단·최고급" 등 금지.

### P-104. News / Event (소식·이벤트)

**목적**: 의료기관 소식·이벤트 안내.
**URL**: `/news`
**주 데이터 계약**: `NewsItem[]` (또는 `Article[]` ArticleType 활용)
**Schema 요약**: 일반 소식은 `Article` 또는 `NewsArticle`. 이벤트 콘텐츠는 schema 신중.
**활성화**: 일반 소식 Instance 결정 / 이벤트 카테고리는 Add-on
**정보 슬롯**: 소식 목록 카드(제목·날짜·요약) / 카테고리(일반·이벤트·휴진)
**헤딩 위계**: H1 "소식" / H2 카테고리
**필수 블록**: 소식 카드 목록
**레이아웃 변형**: 카드 / 타임라인 / 잡지형
**위험도 기본값 — 카테고리별 가변**:

| 카테고리 | 등급 |
|---|---|
| 일반 소식·휴진·이전 | Low |
| 이벤트·할인 | **High** (commercial) |

**컴플라이언스 주의**: 이벤트·할인은 의료광고법 가장 엄격. 사전심의 필요성 신중. 환자 유인 표현 금지. 노출 자동 만료 권장.

### P-105. Reservation

**목적**: 예약 안내·전환. 외부 예약 시스템 통합. 전환 추적 단위.
**URL**: `/reservation`
**주 데이터 계약**: `ReservationPage` (ClinicProfile 필드 참조)
**Schema 요약**: `MedicalClinic`/`LocalBusiness`의 `potentialAction` ReserveAction. BreadcrumbList.
**활성화**: Instance 결정 (Contact 통합 가능)
**정보 슬롯**: 예약 채널 안내 / 예약 가능 시간 / 진료 전 준비 / 변경·취소 / 응급 진료
**헤딩 위계**: H1 "예약 안내" / H2 채널·절차·주의사항
**필수 블록**: 예약 채널 / 가능 시간 / 변경·취소
**레이아웃 변형**: 채널 카드 / 단계형 가이드 / 분할
**위험도 기본값**: Low
**컴플라이언스 주의**: 사실 안내. 이벤트·할인 결합 시 High 격상.

### P-106. Self-test / Quiz — Feature-backed optional page

**목적**: 사용자 셀프 진단·자가 테스트. 리드 생성·콘텐츠 차별화. 자생한방병원 사례 참조.
**URL**: `/self-test/{slug}`
**주 데이터 계약**: `SelfTest` (DM-06 후속 풀명세 예정)
**Schema 요약**: `WebPage` 또는 `MedicalWebPage` + `FAQPage` 일부.
**활성화**: **Feature Module이 콘텐츠·로직 제공** — Self-test가 단순 정적 페이지가 아니라 동적 입력·결과 해석을 포함하므로 별도 Feature Module이 자연스러움. 후보 모듈명: `self-test-module` 또는 `compliance-assistant` 확장. (PT-12 해소 — Feature-backed 결정)

**정보 슬롯**: 테스트 제목·목적 / 설계자 의료진 / 고지문 / 문항 / 결과 안내 / 결과 → 상담 CTA / 관련 콘텐츠
**헤딩 위계**: H1 테스트명 / H2 "테스트 안내", "결과 해석", "전문 상담 안내"
**필수 블록**: 고지문 / 문항 / 결과 안내 / 상담 CTA
**선택 블록**: 설계자 의료진 / 점수 산정 / 관련 콘텐츠
**레이아웃 변형**: 단계형 / 일괄형 / 카드형
**위험도 기본값**: Medium
**격상 조건**: 결과에서 진단·치료 단정 → High. 특정 시술 권유 결합 → High.
**컴플라이언스 주의**: 진단 단정 금지. 결과는 "참고용·의료진 상담 권장". 설계자 의료진 검토 필수.
**내부 링크 권장**: → 관련 Treatment / Condition / Article / Reservation

> **1호 클라이언트 적용 후보**: 다이어트 유형 체크, 요요 위험도 체크, 체질 기반 사전문진. **M0 외 — Phase Alpha~Beta 도입 검토**.

---

## 5. 페이지 타입 매트릭스 (전체 한눈에)

| ID | 이름 | URL | 주 데이터 계약 | 주 Schema | 위험도 기본 | High-risk | M0 |
|---|---|---|---|---|:---:|:---:|:---:|
| P-001 | Home | `/` | ClinicProfile | Organization + MedicalClinic + WebSite | Low | | ✅ |
| P-002 | About | `/about` | ClinicProfile | Organization + MedicalClinic | Low | | ✅ |
| P-003 | Doctors List | `/doctors` | DoctorProfile[] | ItemList | Low | | ✅ |
| P-004 | Doctor Profile | `/doctors/{slug}` | DoctorProfile | Physician | Low | | ✅ |
| P-005 | Treatments List | `/treatments` | TreatmentPage[] | ItemList | Low | | ✅ |
| P-006 | Treatment Detail | `/treatments/{slug}` | TreatmentPage | MedicalProcedure | Medium | | ✅ |
| P-007 | Conditions List | `/conditions` | MedicalConditionPage[] | ItemList | Low | | |
| P-008 | Condition Detail | `/conditions/{slug}` | MedicalConditionPage | MedicalCondition | Medium | | |
| P-009 | Articles List | `/insights` | Article[] | ItemList/Blog | Low | | |
| P-010 | Article Detail | `/insights/{cat}/{slug}` | Article | Article (+VideoObject) | ArticleType 가변 | | ✅ (1) |
| P-011 | FAQ | `/faq` | FAQ[] | FAQPage | 답변 가변 | | ✅ (EAT v0.x EC-CASCADE-08) |
| P-012 | Contact / Visit (Conversion Hub) | `/contact` | ClinicProfile + LocationProfile[] | MedicalClinic/LocalBusiness | Low | | ✅ |
| P-013 | Legal / Policy | `/privacy` 등 | LegalDocument | WebPage | Low | | ✅ (자동) |
| P-014 | Location / Branch Detail | `/locations/{slug}` | LocationProfile | MedicalClinic/LocalBusiness (지점) | Low | | ✅ (main) |
| P-101 | Reviews | `/reviews` | ReviewPolicy + 후기 | (신중) | High | ✅ | |
| P-102 | Pricing | `/pricing` | PricingPage | (신중) | High | ✅ | |
| P-103 | Facilities / Equipment | `/facilities` | FacilitiesPage | WebPage | Medium | | |
| P-104 | News / Event | `/news` | NewsItem[]/Article[] | NewsArticle/Article | 가변 | ✅ (이벤트) | |
| P-105 | Reservation | `/reservation` | ReservationPage | LocalBusiness + ReserveAction | Low | | |
| P-106 | Self-test / Quiz | `/self-test/{slug}` | SelfTest (Feature-backed) | WebPage / MedicalWebPage | Medium | | |

---

## 6. Vertical Slice (M0) 페이지 타입 — 11개 페이지 (EAT v0.x EC-CASCADE-08: P-011 FAQ M0 합류)

| 순서 | 페이지 타입 | 비고 |
|---|---|---|
| 1 | P-001 Home | 메인 |
| 2 | P-002 About | ClinicProfile 노출 |
| 3 | P-003 Doctors List | DoctorProfile 1명 이상 |
| 4 | P-004 Doctor Profile | 1개 이상 |
| 5 | P-005 Treatments List | TreatmentPage 1개 이상 |
| 6 | P-006 Treatment Detail | 1개 이상 |
| 7 | P-012 Contact (Conversion Hub) | ClinicProfile + LocationProfile[] |
| 8 | P-014 Location Detail (main 자동) | 어드민 화면 추가 없이 자동 생성 (§ 3 P-014 규칙) |
| **9** | **P-013 Legal / Policy (자동 생성)** | Core 표준 템플릿 + ClinicProfile · LocationProfile(main) 변수 치환 자동 생성. 어드민 화면 추가 없음. **출시 게이트** (법무 검토 필수 — ComplianceRecord.legalCounsel/legalCounselAt required) |
| **10** | **P-011 FAQ (EAT v0.x EC-CASCADE-08 합류)** | FAQ[] · FAQPage JSON-LD · 어드민 폼 신규 (Faq) · 공개 페이지 `/<slug>/faq` |
| (샘플) | P-010 Article Detail | 1개 샘플 (Home에서 직접 링크 — 고립 회피) |

**M0 어드민 화면 수: 7개 (EAT v0.x cascade)** — 대시보드 / ClinicProfile / DoctorProfile / TreatmentPage / Article / **Faq (EAT v0.x 신규)** / 미리보기·발행. P-012·P-014·P-013은 자동 생성.

**M0 미합류 합류 우선순위**:
1. P-009 Articles List
2. ~~P-011 FAQ~~ ✅ M0 합류 (EAT v0.x)
3. P-007/P-008 Conditions (다이어트 한의원 증상 기반 쿼리)

---

## 7. 페이지 타입 추가·변경 정책

- 새 페이지 타입 추가 = Core MAJOR 변경. 데이터 계약·Schema·디자인 영향. `release/VERSIONING_POLICY.md` 적용.
- 선택 페이지 타입 채택 = Preset/Instance 결정.
- 업종 특화 페이지 = Preset 추가 정의 (예: 한의원의 "체질 분석").

---

## 8. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| PT-01 | Articles vs Blog 명명 | Preset/Instance |
| PT-02 | Category 페이지 별도 타입 | 콘텐츠 누적 후 |
| PT-03 | Search 페이지 별도 타입 | Phase Beta+ |
| PT-04 | ~~다지점 페이지 타입~~ | 해소 — P-014 |
| PT-05 | 한의원 특화 페이지 (체질 분석) | Preset 신설 시 |
| PT-06 | ~~정책 페이지 표준화~~ | 해소 — P-013 |
| PT-07 | P-105 Reservation vs Contact 통합 | Instance 결정 |
| PT-08 | ArticleType 7종 충분성 | RISK_LEVELS.md |
| PT-09 | FAQ 답변 단위 위험도 UI | admin |
| PT-10 | ~~Self-test 도입~~ | 해소 — P-106 |
| PT-11 | Article video contentFormat의 VideoObject schema 깊이 | SCHEMA_MAPPING.md |
| PT-12 | ~~P-106 Feature Module vs Core 페이지~~ | **v0.5 해소 — Feature-backed optional page로 결정** |
| PT-13 | High-risk commercial pages Add-on 정책 구체화 | compliance/admin |
| PT-14 | LocationProfile main 자동 생성 규칙의 어드민 구현 세부 | admin/ARCHITECTURE.md |

---

## 9. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-13 | v0.1 | 최초 — 필수 12 + 선택 4 |
| 2026-05-13 | v0.2 | P-013 격상, P-105 신설, P-103 명칭 확장, 위험도 격상 조건표, M0 Contact 추가 |
| 2026-05-13 | v0.3 | 레퍼런스 분석 반영 — P-106 Location 신설(선택), About 슬롯 보강, programVariants, contentFormat |
| 2026-05-13 | v0.4 | DEEP_DIVE 통합 1단계 — 번호 체계 재정렬(P-014 Location 필수, P-106 Self-test), Contact Conversion Hub, High-risk 묶음, M0 8+1=9 |
| 2026-05-14 | v0.5 | **피드백 적용**: (1) **전체 본문 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, 단독 구현 명세화, (2) **P-014 LocationProfile main 자동 생성 규칙 명시** (어드민 화면 추가 없음), (3) **P-006 TreatmentPage 정보 슬롯에 treatmentComponents·recommendedFor·visitFlow·remoteCareAvailable·maintenancePlan·evidenceNotes 즉시 통합**, (4) **P-010 Article 정보 슬롯에 reviewedBy·contentSource·externalUrl 즉시 통합**, (5) **P-106 Self-test를 "Feature-backed optional page"로 표현 변경** (PT-12 해소), (6) PT-14 LocationProfile 자동 생성 규칙 어드민 구현 세부 신규, (7) **v0.5.1 추가 정정**: **P-013 Legal/Policy를 M0 출시 게이트로 격상** — Core 표준 템플릿 + ClinicProfile 변수 자동 치환 생성. M0 페이지 수 9 → **10**. 어드민 화면 수 6개 그대로 (자동 생성). 법무 검토 필수 (ComplianceRecord 추적) |
| 2026-05-14 | v0.6 | **피드백 정정**: P-013 자동 생성 규칙의 **변수 출처 SoT 정합화** — ClinicProfile 변수(`{{clinic.*}}`) + LocationProfile(main) 변수(`{{location.main.*}}`) 분리 명시. SoT 원칙 준수 |
| 2026-05-14 | v0.7 | **피드백 정정**: (1) § 0 요약 SoT 정합 표현 정정 — "ClinicProfile 입력" → "ClinicProfile 화면의 기관 정체성 + 본원 위치·연락·시간 입력", (2) **§ 3 P-014 자동 생성 규칙 정합 갱신** — `reservationChannels = primaryCtas 상속` 및 `featuredChannelId` (선택, v0.6 신규) 흐름 명시. admin § 3.8.1과 동기화 |
| 2026-05-14 | v0.8 | **피드백 정정**: § 6 M0 표 P-013 비고를 SoT 정합으로 정정 — "v0.5 격상 — ClinicProfile 변수 치환" → "ClinicProfile · LocationProfile(main) 변수 치환, 출시 게이트, 법무 검토 필수". 잔존 버전 표기(§ 6 제목 "(v0.5 갱신)" 등) 제거 |
