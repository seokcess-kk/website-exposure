# Glitzy 의료기관 웹사이트 솔루션 — 아키텍처

> **상태**: Draft v0.10
> **작성일**: 2026-05-14 (v0.9 → v0.10 — § 2.4 주석에서 하위 문서 버전 숫자 추적 제거, 유지보수 단순화)
> **소유자**: Glitzy
> **목적**: 솔루션의 구조·책임 분리·확장 원칙·운영·릴리즈·컴플라이언스·Feature Modules·**Control Plane** 위상을 정의하는 최상위 명세 문서. 어드민 상세·Vertical Slice는 `docs/admin/ARCHITECTURE.md`로 분리.
> **외부 공유 시 주의**: 본 문서는 파트너·클라이언트·법무·심의 측 공유 가능성을 전제로 작성되었다. 표현 리스크가 있는 어휘(회피·보장 등)는 사용하지 않는다.

---

## 0. 한 페이지 요약

- 네이버의 검색 신뢰도 강화 흐름(2025~2026)에 정렬된 의료기관 웹사이트 솔루션을 설계한다.
- 배포 모델은 **고객 도메인 독립 배포**다. 각 병원이 자체 도메인을 보유하고, 솔루션은 그 위에 배포된다.
- 운영 모델은 **Glitzy 전담·함께 운영**이다. 콘텐츠 작성·발행은 Glitzy가 대행하고, 클라이언트가 검토·승인한다.
- 아키텍처는 두 평면으로 분리된다:
  - **Control Plane**: 어드민 — 무엇이·어떤 상태로·누가 승인해서 발행되는지 결정. 운영 상태·권한·감사·승인 이력 보관.
  - **Data Plane**: Git 저장소 + 빌드 파이프라인 + 정적 사이트 — 실제 콘텐츠·렌더링·전달.
- 코드·디자인·콘텐츠 표준은 **3-레이어(Core / Preset / Instance)** 로 분리한다. **코드가 클라이언트 수에 선형 증가하지 않도록** 설계한다.
- 코어의 직각 차원으로 **Feature Modules**(notifications · asset-ingestion · crm-sync · analytics-reporting · keyword-monitoring · **search-visibility** · compliance-assistant · content-migration)를 둔다. Instance가 선택 장착한다.
- 개발 접근법은 **Admin-first**다. 어드민 UI를 처음부터 제품의 작업대(workbench)로 두고, 사이트는 어드민에서 관리한 데이터로 생성된다. 단 풀어드민을 처음부터 만들지 않는다 — **Vertical Slice(M0) → Phase Alpha(M1) → Beta(M2) → GA(M3)** 순으로 점진 구축한다.
- UI 차별화는 "**제약된 자유**" 모델 — 고정 영역(신뢰도 톤 유지)과 가변 영역(브랜드 차별화)을 분리한다.
- 첫 클라이언트(1호 Instance)는 **다이어트 한의원** (실재). 의료광고 표현 리스크가 큰 영역으로, 이를 통과한 표준은 다른 의료기관에도 이식하기 쉬워진다.
- 의료광고 영역은 **준수·대응·표현 리스크 관리** 관점으로 일관되게 다룬다.

---

## 0.5 근거와 가정 — 사실·해석·내부 추론 분리

본 문서의 주장이 모두 같은 확신도로 작성되지 않는다. 다음 표는 핵심 주장의 출처와 확신도를 분리한다.

### 0.5.1 용어 정리

네이버 측 기능 명칭과 외부 보도 표현이 다르다. 본 문서에서는 다음과 같이 통일한다:

| 본 문서 표기 | 네이버 공식 표현 | 외부 보도 표현 | 비고 |
|---|---|---|---|
| **AI 사이트 브리핑(=AI 출처 정보)** | "AI 사이트 브리핑" (F-07) | "AI 출처 정보" / "출처 정보 요약" (F-02) | 같은 기능을 부르는 다른 이름으로 추정. 둘 모두 검색 결과에서 출처 사이트에 대한 자동 생성 설명을 제공하는 기능 |
| **AI 스니펫** | "AI 스니펫" (F-07) | (해당 보도에서는 적은 비중) | 검색 결과 본문 영역의 핵심 정보 자동 분류 노출 |
| **AI 브리핑** | "AI 브리핑" (F-01) | "AI 브리핑" | 검색 결과 상단의 AI 요약 답변 (위 두 가지와 다름) |

### 0.5.2 근거 표

| ID | 주장 | 출처 유형 | 출처 | 일자 | 확신도 |
|---|---|---|---|---|---|
| F-01 | 네이버가 'AI 브리핑'을 2025-03-27에 출시함 | 외부 보도 | 비즈니스포스트 (https://www.businesspost.co.kr/BP?command=article_view&num=388207) | 보도: 2025-03-24 / 시행: 2025-03-27 | 검증됨 (직접 fetch 확인) |
| F-02 | 네이버가 'AI 사이트 브리핑(=AI 출처 정보)'을 일부 공식 블로그 대상으로 2026-05-14부터 도입 | 외부 보도 | 동아일보, 뉴시스, 다음 등 다수 보도 (2026-05-07~10) | 보도: 2026-05-07 즈음 / 시행: 2026-05-14 | 검증됨 (다수 매체 교차) |
| F-03 | 1차 적용 대상 표현은 보도별로 차이가 있다 | 외부 보도 | 위 보도들 | 2026-05 | **보도별 표현 차이 있음**. 일부는 "공공기관·교육기관 등 공공성 띤 일부 공식 블로그", 일부·네이버 공식 입장은 공공기관·교육기관·병원 우선 적용 언급. 정확한 1차 범위는 시행 결과 확인 필요 |
| F-04 | 네이버 공식 블로그: "신뢰도 중심 통합 랭킹 모델" A/B 테스트, 웹·블로그·카페·지식인·동영상 통합 노출, 2025년 11월 말부터 일부 사용자 순차 제공 | 네이버 공식 블로그 | 사용자 본문 공유. 원본: https://blog.naver.com/naver_search/224083616020 (직접 fetch 차단됨) | 게시: 2025-11 추정 / 시행: 2025-11 말~ | 사용자 공유 본문 기반. 원문 직접 fetch 미검증 |
| F-05 | 네이버 공식 블로그: VLM(시각-언어 모델)으로 사이트의 시각적 요소까지 신뢰도 평가에 반영 | 네이버 공식 블로그 | 사용자 공유 본문. 원본: https://blog.naver.com/naver_search/223996219153 | 게시: 2025 추정 | 사용자 공유 본문 기반. 원문 직접 fetch 미검증. 디자인 시스템 설계에 큰 영향. 추후 원문 재검증 권장 |
| F-06 | 네이버 공식 블로그: 개편 이후 공공기관 출처 클릭 77.2%, 학술·연구 30.7% 증가 | 네이버 공식 블로그 | 사용자 공유 본문 | 게시: 2025 추정 | 네이버 자체 측정치. 외부 검증 불가 |
| F-07 | 네이버 공식 블로그: AI 사이트 브리핑이 출처 사이트 메타 정보 + 위키피디아 등을 활용해 출처 설명 자동 생성. 2025-12 중 제공 예정 | 네이버 공식 블로그 | 사용자 공유 본문. 원본: https://blog.naver.com/naver_search/224105775876 | 게시: 2025 추정 | F-02 외부 보도(2026-05-14 시행)와 일자 차이 — 단계적 확대로 해석 |
| I-01 | 자체 도메인 + 풍부한 메타 + 구조화 데이터 + 깔끔한 시각적 톤은 네이버 신뢰도 평가에 유리 | 내부 추론 | F-04, F-05, F-06 | 2026-05-13 | 합리적 추론. 순위 보장 아님 |
| I-02 | "병원" 도메인은 향후 AI 출처 정보 확대 대상 또는 1차 대상 포함 가능성 있음 | 내부 추론 | F-04 + F-03 | 2026-05-13 | 가능성 — 시행 후 확인 필요 |
| I-03 | AEO·GEO 친화 콘텐츠 구조(Q&A·리스트·표)는 AI 스니펫 채택률에 유리 | 내부 추론 | F-07 + 일반적 검색 엔진 동작 원리 | 2026-05-13 | 합리적 추론. 측정·검증 필요 |

### 0.5.3 운영 원칙

1. **F (Fact)** 항목은 검증 가능한 사실. 출처 갱신 즉시.
2. **I (Inference)** 항목은 내부 해석. 외부 공유 시 "내부 추론" 명시.
3. 외부 보도 정보는 분기 1회 재검증.
4. 사용자(Glitzy) 확보한 네이버 공식 발표 원문은 별도 보관·재확인 채널.

---

## 1. 외부 컨텍스트 — 솔루션이 응답하는 환경 변화

### 1.1 네이버 검색 신뢰도 강화 흐름 (요약)

| 변화 | 내용 | 근거 |
|---|---|---|
| AI 브리핑 출시 | 생성형 AI 기반 검색 답변·출처 제공 | F-01 |
| 통합 랭킹 (A/B) | 웹·블로그·카페·지식인·동영상 한 영역 노출, 신뢰도 정렬 | F-04 |
| VLM 평가 | 시각적 요소까지 신뢰도 판단 | F-05 |
| AI 사이트 브리핑(=AI 출처 정보) | 출처 설명 자동 생성 | F-07, F-02 |
| AI 스니펫 | 문장형·리스트형·표형 자동 분류 노출 | F-07 |
| 측정된 효과 | 공공기관 +77.2%, 학술·연구 +30.7% | F-06 |

### 1.2 솔루션이 표준화해야 할 본질

1. 자체 도메인의 공식성 신호 누적
2. JSON-LD 구조화 데이터로 의미 명시
3. VLM 평가에 부합하는 신뢰도 톤 디자인
4. AI 사이트 브리핑이 인용 가능한 메타 데이터
5. AI 스니펫이 추출하기 쉬운 콘텐츠 구조
6. E-E-A-T 신호 노출
7. 의료광고법·심의 표준 준수

> **표현 주의**: "검색 노출 보장"은 사용하지 않는다. 솔루션은 **기술적·콘텐츠적 준비 상태를 표준화**한다.

---

## 2. 3-레이어 아키텍처 + Control/Data Plane

### 2.1 두 평면 + 3 레이어 + Feature Modules

```
       ┌──────────────────────────────────────────────────────┐
       │            Control Plane (운영 평면)                  │
       │                                                       │
       │   Glitzy 어드민 (Workbench)                           │
       │   ─────────────────────────────────                   │
       │   - 클라이언트·인스턴스 관리                          │
       │   - 데이터 입력 (ClinicProfile, Doctor 등)            │
       │   - 콘텐츠 작성·검수·승인                            │
       │   - 컴플라이언스 게이트 강제 (§ 9)                    │
       │   - 발행·롤백 트리거                                  │
       │   - 운영 모니터링 대시보드                            │
       │                                                       │
       │   ※ 어드민 DB 원본: 권한·감사·승인·알림 이력         │
       └──────────────────────────────────────────────────────┘
                            │
                            │ 파일 산출 + Git 커밋·PR
                            ▼
       ┌──────────────────────────────────────────────────────┐
       │            Data Plane (렌더링·전달 평면)              │
       │                                                       │
       │   Git 저장소 (콘텐츠·메타 원본)                       │
       │      │                                                │
       │      │ push → CI/CD                                   │
       │      ▼                                                │
       │   빌드 파이프라인 + Core(L1) + Preset(L2)              │
       │                    + Instance(L3) + Feature Modules   │
       │      │                                                │
       │      │ 정적 사이트 산출                                │
       │      ▼                                                │
       │   클라이언트 도메인 (정적 호스팅)                    │
       │                                                       │
       │   ※ Git 원본: 콘텐츠 본문·메타·매니페스트·미디어      │
       └──────────────────────────────────────────────────────┘
```

3-레이어와 Feature Modules는 Data Plane 안에 위치:

```
Feature Modules (직각 차원, § 11)
└─ notifications · asset-ingestion · crm-sync · analytics-reporting ·
   keyword-monitoring · search-visibility · compliance-assistant · content-migration

┌──────────────────────────────────────────────────────────────┐
│  L1. Core — 모든 클라이언트 공유 자산                          │
└──────────────────────────────────────────────────────────────┘
                            ▲ import (versioned)
┌──────────────────────────────────────────────────────────────┐
│  L2. Preset — 업종별 모듈 (한의원 · 치과 · ...)               │
└──────────────────────────────────────────────────────────────┘
                            ▲ extend (versioned)
┌──────────────────────────────────────────────────────────────┐
│  L3. Instance — 클라이언트별 데이터 + 선택 장착 Modules        │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 핵심 원칙

1. **단방향 참조**: L3 → L2 → L1 방향으로만 의존.
2. **계약 기반**: 데이터 계약(타입·인터페이스·슬롯)만 노출. 계약 인벤토리 § 2.4.
3. **변경 비용 비대칭**: L1 변경은 모든 사이트 영향(높음), L2 중간, L3 낮음.
4. **추상화는 두 번째 사용에서**: 처음부터 과도 추상화 금지.
5. **버전 명시**: L3 인스턴스는 사용하는 L1·L2·Feature Module의 버전을 **instance manifest**에 명시. 자동 반영 금지.
6. **선형 비증가 원칙**: 클라이언트 수가 늘어도 Core·Preset·Module 코드는 선형으로 증가하지 않는다. 단, 인스턴스 설정·콘텐츠·통합 어댑터·예외 처리는 비례 증가한다.
7. **Plane 분리**: Control Plane(어드민)이 죽어도 Data Plane(이미 빌드된 사이트)은 작동한다. 어드민의 일시 중단이 사이트 서비스 중단을 의미하지 않는다.

### 2.3 책임 분리 매트릭스 — 전체

| 항목 | L1. Core | L2. Preset | L3. Instance | Feature Module | 어드민 (Control Plane) |
|---|:---:|:---:|:---:|:---:|:---:|
| **코드·인프라** | | | | | |
| 빌드·배포 자동화 | ✅ | | | | 트리거 |
| 모노레포 도구·설정 | ✅ | | | | |
| 이벤트·리포트 인터페이스 | ✅ | | | | |
| 외부 도구 실제 연동 (GSC·서치어드바이저·GA4) | | | | ✅ analytics-reporting | 표시 |
| 도메인·DNS 설정 | | | ✅ | | 기록 |
| 릴리즈·버전 정책 | ✅ | ✅ | ✅ 적용 | ✅ | 승인 |
| **UI / 디자인** | | | | | |
| 디자인 토큰 변수 명세 | ✅ | | | | |
| 디자인 토큰 기본값 | | 업종 권장 | ✅ 최종 | | 입력 폼 |
| 정보 위계·시맨틱 구조 룰 | ✅ 강제 | | | | 검증 |
| 페이지 타입 정보 슬롯 | ✅ 강제 | | | | |
| 레이아웃/컴포넌트 변형 카탈로그 | ✅ 옵션 | 업종 선별 | ✅ 선택 | | 선택 UI |
| 브랜드 페르소나 모드 | ✅ 명세 | 업종 모드 | ✅ 선택 | | 선택 UI |
| 광고성 시각 요소 금지 룰 | ✅ 강제 | | | | 검증 |
| 접근성·성능 기준 | ✅ 강제 (§ 4.3) | | | | 모니터링 |
| 실제 사진·이미지 | | | ✅ | (asset-ingestion 보조) | 업로드 |
| **SEO / AEO / GEO** | | | | | |
| 메타 태그·JSON-LD 생성 로직 | ✅ | | | | |
| 의료 schema 모듈 | ✅ | | | | |
| 업종 특화 schema 구성 | | ✅ | | | |
| robots.txt / sitemap.xml | ✅ | | | | |
| 검색 표준화 체크리스트·인터페이스 | ✅ | | | | 체크 UI |
| E-E-A-T 신호 노출 표준 | ✅ | | | | 입력 |
| 외부 PR·백링크·위키 실행 전략 | (별도 운영 플레이북) | | | | 기록 |
| 키워드 모니터링 | | | | ✅ keyword-monitoring | 대시보드 |
| 사이트 전체 검색 가시성 모니터링 | | | | ✅ search-visibility | 대시보드 |
| **콘텐츠** | | | | | |
| 콘텐츠 작성 표준 | ✅ | | | | 작성 UI |
| 페이지 타입 표준 | ✅ | | | | |
| Pillar / Cluster 구조 | | ✅ | | | |
| 실제 콘텐츠(글) | | | ✅ | | 작성·저장 |
| 의료진 프로필 데이터 | | | ✅ | | 입력 폼 |
| 기존 콘텐츠 이관 | | | | ✅ content-migration | 도구 |
| **컴플라이언스** | | | | | |
| 의료광고 준수 공통 가이드라인 | ✅ | | | | 검수 UI |
| 업종 특화 룰 | | ✅ | | | 검수 UI |
| 표현 리스크 검수 보조 | | | | ✅ compliance-assistant | 통합 |
| 표현 리스크 검수 적용 | | | ✅ 적용 | | 게이트 (§ 9) |
| 심의 증빙·기록 보관 | | | | | ✅ 어드민 DB 원본 |
| **연동** | | | | | |
| CRM·환자관리 시스템 연동 | | | | ✅ crm-sync | 설정 |
| 알림 (이메일·슬랙·SMS) | | | | ✅ notifications | 설정 |
| 분석 리포트 자동 생성 | | | | ✅ analytics-reporting | 발송 |

### 2.4 데이터 계약 인벤토리 — 22개 계약 + 3개 공통 타입

> 하위 문서 정합 동기화: `core/PAGE_TYPES.md`, `core/DATA_MODEL.md`, `admin/ARCHITECTURE.md` 기준. SoT 정리(ClinicProfile에서 위치·시간·연락 제거 → LocationProfile이 마스터), 공통 타입 3종 추가, C-21 LocationProfile·C-22 ArticleCategory 정식 등재. C-16 LegalDocument는 M0 자동 생성 대상으로 격상 (DATA_MODEL § 4 풀명세, C-10 다음 위치). CTAConfig 강조 채널은 LocationProfile.featuredChannelId(컨테이너 쪽)로 표현. **하위 문서 버전 숫자는 본 주석에서 추적하지 않는다** — 각 문서의 헤더와 변경 이력이 단일 진실 원본.

**데이터 계약 (22개)**:

| ID | 계약 이름 | 책임 | 소속 | 마스터 |
|---|---|---|:---:|:---:|
| C-01 | `ClinicProfile` | 의료기관 정체성 — 브랜드·메타·통계만. **위치·시간·연락은 LocationProfile이 마스터** | L3 | Git |
| C-02 | `DoctorProfile` | 의료진 권위·전문성 (자격·학회·논문·스토리·소속 지점) | L3 | Git |
| C-03 | `TreatmentPage` | 시술·치료 (개요·원리·구성·과정·프로그램 변형·근거·유지 계획) | L3 | Git |
| C-04 | `Article` | 인사이트·블로그 글 (저자·검수자·콘텐츠 형식·출처·임베디드 미디어) | L3 | Git |
| C-05 | `RiskLevel` | 위험도 등급 enum (Low/Medium/High) — 직접 사용 | L1/L3 | Git+DB |
| C-06 | `PageMeta` | 페이지별 메타 데이터 | L1/L3 | Git |
| C-07 | `BrandTokens` | 디자인 토큰 최종값 | L3 | Git |
| C-08 | `InstanceManifest` | 버전 고정 명세 | L3 | Git |
| C-09 | `FeatureModuleConfig` | Feature Module 설정 | L3 | Git |
| C-10 | `ComplianceRecord` | 컴플라이언스 게이트 통과 기록 | L1/L3 | **DB 원본 + Git 사본 (§ 9.4)** |
| C-11 | `MedicalConditionPage` | 증상·질환 정보 | L3 | Git |
| C-12 | `FAQ` | 질문-답변 묶음 | L3 | Git |
| C-13 | `ReviewPolicy` | 후기·전후사진 노출 정책 | L2+L3 | Git |
| C-14 | `MedicalSpecialty` | 의료 전문 분야 정의 | L2 | Git |
| C-15 | `SchemaInput` | JSON-LD 생성기 입력 정규화 | L1/L3 | 런타임 |
| C-16 | `LegalDocument` | 정책·약관 | L3 | Git |
| C-17 | `PricingPage` | 가격 안내 | L3 | Git |
| C-18 | `FacilitiesPage` | 시설·장비 | L3 | Git |
| C-19 | `NewsItem` | 소식·이벤트 | L3 | Git |
| C-20 | `ReservationPage` | 예약 안내 | L3 | Git |
| **C-21** | **`LocationProfile`** | **지점 정체성 — 위치·시간·연락 마스터. 단지점도 `main` 1개 필수** | L3 | Git |
| **C-22** | **`ArticleCategory`** | **Article Pillar/Category 정의** | L2+L3 | Git |

**공통 타입 (CT — Cross-cutting Type, 3개)**:

| ID | 공통 타입 | 책임 | 사용처 |
|---|---|---|---|
| **CT-01** | **`TrustMetric`** | 신뢰도·통계 지표 (기준 기간·범위·증빙 의무) | ClinicProfile, LocationProfile, DoctorProfile |
| **CT-02** | **`BusinessHours`** | 진료시간·접수시간·점심·휴진·특정일 휴진·응급 안내 | LocationProfile |
| **CT-03** | **`CTAConfig`** | 전환 채널 설정 (전화·네이버예약·카카오 등 통합 모델) | ClinicProfile, LocationProfile, TreatmentPage |

> 상세 필드·예시·하위 타입은 `docs/core/DATA_MODEL.md`.

### 2.5 Git 원본 vs 어드민 DB 원본 — 책임 분리

| 데이터 | 원본 | 사본 | 이유 |
|---|---|---|---|
| 콘텐츠 본문 (Article·페이지) | Git | (어드민 드래프트는 임시) | 사이트 빌드 입력. 버전 관리·롤백 필요 |
| 메타 데이터 (`PageMeta`·Frontmatter) | Git | | 사이트 빌드 입력 |
| 인스턴스 데이터 (`ClinicProfile`·`DoctorProfile` 등) | Git | (어드민 폼 입력값을 파일로 출력) | 사이트 빌드 입력 |
| 미디어 자산 (이미지·동영상) | Git (LFS 검토) | | 사이트 빌드 입력 |
| `InstanceManifest`·`BrandTokens`·`FeatureModuleConfig` | Git | | 사이트 빌드 입력 |
| 콘텐츠 드래프트 (미발행) | 어드민 DB | | 발행 전 임시 보관 |
| 운영자·승인자 신원 정보 | 어드민 DB | | 인증·권한 |
| 검수자·승인자 신원·시각·승인 로그 (`ComplianceRecord` 운영 메타) | **어드민 DB** | | 감사·법무 증빙 진실의 원본 |
| 사전심의 제출·증빙 파일 | **어드민 DB** | | 외부 시스템 연계 가능성, 감사 |
| 외부 자문 회신·기록 | **어드민 DB** | | 감사 |
| Audit log (열람·수정·롤백 행위) | **어드민 DB** | | 감사 |
| 알림 발송 이력 | notifications 모듈 (DB) | | 운영 |
| 분석 통합 캐시 | analytics-reporting 모듈 (DB) | | 운영 |
| `ComplianceRecord`의 빌드 참조 메타 (위험도·심의 통과 플래그·발행일) | 어드민 DB가 마스터 | **Git에 사본** | 사이트 렌더링 시 참조 |

**원칙**:
- 사이트 빌드 입력은 모두 **버전 관리 가능한 파일**(Git)로 남긴다.
- 운영 상태·권한·승인·감사·알림 이력은 **어드민 DB가 원본**이다.
- `ComplianceRecord`는 두 영역에 걸친다: 감사·증빙용 풀데이터는 DB가 마스터, 사이트 렌더링용 가벼운 메타(위험도·통과 플래그·발행일)는 Git에 사본을 남겨 빌드가 참조할 수 있게 한다.

---

## 3. UI 차별화 — "제약된 자유" 모델

### 3.1 두 영역 분리

```
🔒 고정 영역 (Core 유지)                 🎨 가변 영역 (Preset + Instance 자유)
─────────────────────────────             ─────────────────────────────────
정보 위계·시맨틱 구조                       디자인 토큰 (색·폰트·여백)
페이지 타입의 정보 슬롯                     레이아웃 변형 (Layout Variants)
JSON-LD Schema 매핑                       컴포넌트 변형 (Component Variants)
접근성·로딩 속도 기준                       브랜드 페르소나 모드
광고성 시각 요소 금지 룰                    사진·이미지 스타일
```

### 3.2 가변 영역의 5가지 Variant 차원

```
Variant 1. Design Tokens
Variant 2. Layout Variants (페이지 타입별 변형)
Variant 3. Component Variants (CTA·카드·네비 등)
Variant 4. Brand Persona Modes (Premium / Wellness / Professional / Friendly)
Variant 5. Visual Assets Style (사진·일러스트·아이콘 시스템)
```

### 3.3 옷장 비유

L1 Core는 옷장의 골격, L2 Preset은 코디네이트 가이드, L3 Instance는 실제 옷차림.

---

## 4. 검색 표준화 영역 — Core가 다루는 범위와 운영이 다루는 범위의 경계

본 솔루션은 **검색 결과를 보장하지 않는다**. Core는 **기술적 준비 상태를 표준화**할 뿐이다.

### 4.1 Core가 표준화하는 것 (코드·인터페이스)

| 항목 | Core의 역할 |
|---|---|
| 메타 태그 생성 | `PageMeta` 기반 자동 생성 |
| JSON-LD Schema | 페이지 타입별 매핑 + 생성기 |
| robots.txt / sitemap.xml | 자동 생성·갱신 |
| canonical / hreflang | 자동 적용 |
| 콘텐츠 구조 룰 | 헤딩 위계·Q&A 블록·리스트·표 컴포넌트 |
| E-E-A-T 신호 노출 표준 | 저자·인증·연혁 컴포넌트 |
| 측정 이벤트·리포트 인터페이스 | 표준 이벤트 정의, Add-on이 구독 |
| 컴플라이언스 체크리스트 | 표현 리스크 검수 인터페이스 (§ 9) |

### 4.2 운영 플레이북이 다루는 것 (코드 아님)

| 항목 | 운영 영역 |
|---|---|
| 위키피디아 등재 전략 | 인스턴스마다 적절성 다름. 별도 의사결정 |
| 외부 백링크 누적 | PR·기고·학회 협력 |
| 콘텐츠 신선도 사이클 | 정기 리프레시 |
| 도메인 인증·기관 등록 | 클라이언트별 절차 |
| 미디어 노출 자산화 | 인터뷰·기고·수상 |
| 검색 성과 정기 리뷰 | 분기/월간 분석 |

→ 운영 영역은 `docs/operations/` 플레이북. 어드민·Feature Modules(keyword-monitoring·search-visibility·analytics-reporting)는 **기록·추적·자동화 보조**. 실행은 사람의 의사결정.

### 4.3 성능 기준 — 빌드 검증 vs 운영 모니터링 분리

| 시점 | 측정 방식 | 다루는 항목 | 통과 기준 |
|---|---|---|---|
| **빌드/프리뷰** (lab metric) | Lighthouse / Web Vitals lab | LCP, CLS, TBT, Bundle Size, Image weight | Lighthouse budget 게이트 |
| **운영 단계** (field metric) | Real User Monitoring / CrUX | LCP, **INP**, CLS, FCP | 추세 모니터링, 임계 미달 알림 |

> INP는 실제 사용자 상호작용 기반이므로 빌드 lab 측정으로 정확히 검증할 수 없다. 빌드는 lab metric 게이트, 운영은 field metric 모니터링으로 역할 분리.

---

## 5. 확장 시나리오

### 5.1 두 번째 한의원 클라이언트
Core·Preset·Module 변경 0. Instance 추가만.

### 5.2 첫 치과 클라이언트
치과 Preset 신규. Core 변경 0.

### 5.3 네이버 알고리즘 추가 변경
Core 새 버전 릴리즈 → § 8 정책에 따라 Staged Rollout.

### 5.4 단일 클라이언트의 브랜드 리뉴얼
Instance 디자인 토큰·모드·변형만 변경.

### 5.5 Core 패치 — 회귀 시
v1.4.1 hotfix 또는 v1.3.x로 롤백.

### 5.6 Feature Module 추가 — 가격 차등
Instance manifest에 모듈 활성화 추가. 코드 변경 없음.

---

## 6. 모노레포 폴더 구조 — 초안 (기술 스택 미정)

```
website-exposure/
├── docs/
│   ├── ARCHITECTURE.md                ← 이 문서
│   ├── core/ (7 docs)
│   ├── presets/hanui-clinic/ (4 docs)
│   ├── instances/client-01-diet-hanui/ (3 docs)
│   ├── features/ (8 docs — search-visibility 포함)
│   ├── operations/ (5 docs)
│   ├── release/ (3 docs)
│   ├── compliance/ (5 docs)
│   └── admin/ (3+ docs — Vertical Slice 명세 포함)
├── handoff/
└── (코드 단계)
    ├── packages/
    │   ├── core/                      ← L1
    │   ├── medical-schema/
    │   ├── presets-hanui/             ← L2
    │   └── features/ (8 modules)
    ├── sites/
    │   └── client-01-diet-hanui/      ← L3
    └── apps/
        └── admin/                     ← Control Plane
```

---

## 7. 세부 명세 문서 로드맵

| 영역 | 문서 | 내용 |
|---|---|---|
| Core (L1) | `core/*` (7종) | PAGE_TYPES, DATA_MODEL, SCHEMA_MAPPING, DESIGN_TOKENS, CONTENT_STANDARDS, SEARCH_STANDARDIZATION, MEDICAL_AD_COMPLIANCE_COMMON |
| Preset (L2) | `presets/hanui-clinic/*` (4종) | |
| Instance (L3) | `instances/client-01-diet-hanui/*` (3종) | |
| Feature | `features/*` (8종) | notifications, asset-ingestion, crm-sync, analytics-reporting, keyword-monitoring, **search-visibility**, compliance-assistant, content-migration |
| 운영 | `operations/*` (5종) | |
| 릴리즈 | `release/*` (3종) | |
| 컴플라이언스 | `compliance/*` (5종) | RISK_LEVELS 포함 |
| 어드민 | `admin/*` (3종+) | ARCHITECTURE, PHASE_ROADMAP, DATA_MODEL + Vertical Slice 명세 |

---

## 8. 릴리즈·버전 정책

### 8.1 SemVer
Core·Preset·Feature Module은 MAJOR/MINOR/PATCH를 따른다.

### 8.2 Instance Manifest
인스턴스가 사용하는 Core·Preset·Module 버전을 고정 명세에 기록 (기술 중립 표현 — 구현 시 lockfile/yaml/json 등).

### 8.3 Staged Rollout
Glitzy 내부 → 1개 클라이언트 → 점진 확대.

### 8.4 롤백
직전 정상 버전 기록. 24시간 내 hotfix 또는 롤백.

### 8.5 마이그레이션 게이트
MAJOR 시 가이드 작성·영향 분석·Instance별 일정·컴플라이언스 재통과·Staged Rollout.

---

## 9. 컴플라이언스 게이트

### 9.1 위험도 등급 (RiskLevel)

| 등급 | 정의 | 예시 | 자동 검수 | 동료 검수 | 의료진 승인 | 법무 자문 |
|---|---|---|:---:|:---:|:---:|:---:|
| **Low** | 사실 안내, 표현 리스크 매우 낮음 | 진료시간·휴진·소식·찾아오는 길 | ✅ | ✅ | 선택 | 불필요 |
| **Medium** | 의학 정보 일반론, 적정 표현 필요 | 증상·질환 개요·시술 원리·예방법 | ✅ | ✅ | ✅ | 선택 |
| **High** | 치료효과·후기·전후·가격·이벤트 | 치료결과·후기·전후·가격·할인·이벤트 | ✅ | ✅ | ✅ | ✅ 권장/필수 |

> 위험도 상세는 `compliance/RISK_LEVELS.md`. compliance-assistant 모듈이 자동 분류·검수 보조.

### 9.2 게이트 단계

```
[작성] → [위험도 분류] → [자동 검수] → [동료 검수] → [등급별 추가 승인] → [심의 필요성 판단] → [발행]
```

### 9.3 검수 영역
금지 표현 패턴·효과 표현·후기 사진·한의 특유 표현 등 (상세는 별도 문서).

### 9.4 ComplianceRecord 마스터 — 어드민 DB가 원본

`ComplianceRecord`는 두 영역에 걸친 데이터다:

| 데이터 종류 | 마스터 | 비고 |
|---|---|---|
| 검수자·승인자 신원·시각·승인 로그 | **어드민 DB** | 감사·법무 증빙의 진실의 원본 |
| 사전심의 제출/면제 결정·증빙 파일 | **어드민 DB** | 첨부·외부 시스템 연계 |
| 외부 자문 회신·기록 | **어드민 DB** | 감사 |
| Audit log | **어드민 DB** | 감사 |
| 위험도 등급 (Low/Medium/High) | DB 마스터 → Git 사본 | 사이트 렌더링 시 참조 |
| 심의 통과 플래그 | DB 마스터 → Git 사본 | 사이트 빌드 참조 |
| 발행일 (timestamp) | DB 마스터 → Git 사본 | 사이트·schema 노출 |

→ 분쟁·감사 시 진실의 원본은 어드민 DB. 사이트 빌드는 Git 사본을 읽어 렌더링.

### 9.5 승인자 역할
작성자 / 동료 검수자 / 의료진 / 클라이언트 승인자 / 법무·외부 자문.

---

## 10. 어드민 = Control Plane — 원칙 (상세는 별도 문서)

> 어드민의 상세 아키텍처·Vertical Slice 명세·Phase 로드맵·데이터 모델은 `docs/admin/ARCHITECTURE.md`에서 다룬다.

### 10.1 위상

어드민은 **솔루션의 운영 Control Plane**이다. 단순한 보조 도구가 아니라, 무엇이·어떤 상태로·누가 승인해서 발행되는지 결정하는 운영 중심축이다. 사이트는 어드민이 관리한 Instance 데이터와 `FeatureModuleConfig`를 기반으로 생성된다.

### 10.2 원칙

1. **운영 Control Plane**. 단, 최종 사이트 렌더링과 배포는 빌드 파이프라인(Data Plane)이 담당한다.
2. **사이트 빌드 입력은 파일 또는 버전 관리 가능한 데이터 산출물**(Git)로 남긴다.
3. **운영 상태·권한·승인·감사·알림 이력은 어드민 DB가 원본**이다.
4. **Plane 격리**: Control Plane(어드민)이 일시 중단되어도 Data Plane(이미 빌드된 사이트)은 작동한다.
5. **컴플라이언스 게이트(§ 9)는 어드민이 강제**한다.
6. **Admin-first 개발**: UI를 처음부터 워크벤치로 잡되, 모든 기능을 한 번에 만들지 않는다. **Vertical Slice → Phase Alpha → Beta → GA**로 점진 구축.

### 10.3 1호 클라이언트 출시 — Vertical Slice (M0) 요약

Vertical Slice는 어드민 UI를 처음부터 끝까지 한 줄로 관통시키는 가장 작은 동작 가능 범위다. 상세는 `admin/ARCHITECTURE.md`:

```
Admin UI (6개 화면)
  → 클라이언트 인스턴스 대시보드
  → 사이트 기본 정보 (ClinicProfile)
  → 의료진 관리 (DoctorProfile)
  → 시술/진료 페이지 (TreatmentPage)
  → 콘텐츠 작성/검수 (Article — Markdown 에디터)
  → 미리보기/발행 (Preview URL + 발행 트리거)

↓ 발행 트리거

Git 커밋·push → CI/CD 빌드 → 정적 사이트 배포
```

이 한 줄이 처음부터 끝까지 동작하면 1호 출시 가능. 이후 기능은 모두 이 흐름에 붙는다.

---

## 11. Feature Modules / Add-on Modules

Core·Preset·Instance 3-레이어와 **직각인 차원**으로 Feature Modules가 존재. Instance가 선택 장착하며, Core 인터페이스를 사용한다.

### 11.1 모듈 목록과 책임

| 모듈 | 책임 | 주요 인터페이스 의존 | 가격 차등 위치 |
|---|---|---|---|
| **notifications** | 발행·모니터링·컴플라이언스 알림 (이메일·슬랙·SMS) | Core 이벤트 인터페이스 | 채널 수·발송량 |
| **asset-ingestion** | 클라이언트 기존 사이트·SNS·미디어 자료 수집·정리·태깅 | Core 콘텐츠·미디어 저장소 인터페이스 | 수집 범위·자동화 깊이 |
| **crm-sync** | CRM·환자관리 시스템 양방향 데이터 동기화 | Core 폼·전환 이벤트 인터페이스 | 연동 시스템 수·동기화 빈도 |
| **analytics-reporting** | GSC·네이버 서치어드바이저·GA4 등 외부 분석 도구 연동 + 자동 리포트 | Core 측정 이벤트·리포트 인터페이스 | 리포트 주기·연동 도구 수 |
| **keyword-monitoring** | 특정 키워드의 검색 순위·노출·CTR 모니터링·알림 트리거 (좁은 영역) | notifications + analytics-reporting 의존 | 모니터링 키워드 수·주기 |
| **search-visibility** | **사이트 전체 검색 가시성 모니터링** — AI 브리핑 인용 여부, 통합 노출 영역 진입 여부, 페이지별 노출도 추세, 외부 백링크 변동 (넓은 영역) | analytics-reporting 의존 | 모니터링 범위·주기·세분도 |
| **compliance-assistant** | 의료광고법 표현 리스크 자동 검수·위험도 분류 보조 (룰 + LLM) | Core 컴플라이언스 게이트 인터페이스 | 처리량·모델 정밀도 |
| **content-migration** | 기존 사이트·블로그·카페 콘텐츠를 솔루션 데이터 모델로 이관 | Core 콘텐츠 저장소 인터페이스 | 이관 분량·복잡도 |

### 11.2 keyword-monitoring vs search-visibility 책임 경계

| 차원 | keyword-monitoring | search-visibility |
|---|---|---|
| 범위 | 사용자가 지정한 N개 키워드 | 사이트 전체·페이지별 |
| 데이터 | 순위·노출·CTR (키워드 단위) | 노출도 추세·AI 브리핑 인용·통합 영역 진입·외부 백링크 |
| 주 사용자 | 특정 키워드 추적이 필요한 마케터 | 사이트 전반 검색 건강도를 보는 운영자 |
| 알림 빈도 | 키워드 변동 시 즉시 | 추세 변화·이상 감지 |

### 11.3 모듈 설계 원칙

1. **Core 인터페이스 의존**: Core 표준 인터페이스 사용.
2. **Instance 선택 장착**: `InstanceManifest` + `FeatureModuleConfig` 결정.
3. **모듈 간 의존 명시**: 의존 그래프는 모듈 명세에 기록.
4. **SemVer 적용**: § 8 정책 동일.
5. **클라이언트별 커스텀 코드 금지**: 신규 모듈로 추가.
6. **가격 차등의 아키텍처 기반**: 단순 영업 옵션이 아니라 아키텍처 경계.

### 11.4 1호 클라이언트(다이어트 한의원) 모듈 권장 — 가안

| 모듈 | 권장 | 이유 |
|---|---|---|
| compliance-assistant | ✅ 강력 권장 | High 위험도 콘텐츠 비중 높음 |
| notifications | ✅ 권장 | 발행·검수 흐름 알림 |
| analytics-reporting | ✅ 권장 | 통합 리포트 |
| search-visibility | 권장 | 사이트 전체 가시성 추세 — AI 브리핑 인용 여부 추적 |
| keyword-monitoring | 선택 | 운영 안정화 후 |
| asset-ingestion | 검토 | 기존 자산 규모에 따라 |
| crm-sync | 선택 | 환자관리 시스템 보유 여부 |
| content-migration | 검토 | 기존 콘텐츠 이관 규모 |

---

## 12. 미결정·후속 결정 트래커

| ID | 항목 | 상태 |
|---|---|---|
| D-01 | 기술 스택 (Astro / Next.js / WordPress / 기타) | 미결정 |
| D-02 | 모노레포 도구 (pnpm workspaces / Turborepo / Nx) | 미결정 |
| D-03 | 호스팅 (Vercel / Cloudflare / 기타) | 미결정 |
| D-04 | CMS 필요성 | **결정**: 풀 CMS 대신 어드민(Control Plane) + Git |
| D-05 | 디자인 토큰 시스템 | 미결정 |
| D-06 | 외부 분석 도구 연동 → analytics-reporting 모듈 | 결정 |
| D-07 | 도메인 명명 규약 | N/A |
| D-08 | 위키피디아 등재 전략 — 1호 클라이언트 | 추후 |
| D-09 | 어드민 기술 스택 | 미결정 |
| D-10 | **Vertical Slice (M0) 범위** | **결정**: 6개 화면 (Article 포함) — admin/ARCHITECTURE.md |
| D-11 | 인증·권한 모델 | Slice는 단일 운영자, 풀 RBAC는 Beta |
| D-12 | Git 호스팅 | 미결정 |
| D-13 | 클라이언트 검토 채널 | Beta |
| D-14 | 네이버 공식 블로그 본문 원문 직접 재검증 채널 | 추후 |
| D-15 | Feature Module 우선 구현 순서 | § 11.4 가안 — 합의 필요 |
| D-16 | Feature Module 가격 패키지 정의 | 영업 결정 |
| D-17 | compliance-assistant LLM 채택 | 미결정 |
| D-18 | 성능 budget 임계값 | 미결정 |
| D-19 | RiskLevel 자동 분류 알고리즘 | 미결정 |
| D-20 | F-02·F-07 1차 시행 결과 사후 확인 (2026-05-14 이후) | 2026-05-14 후 |
| D-21 | search-visibility 데이터 소스 (네이버·GSC·자체 크롤링 조합) | 미결정 |

---

## 13. 변경 이력

| 일자 | 버전 | 변경 | 작성자 |
|---|---|---|---|
| 2026-05-13 | v0.1 | 최초 작성 | Glitzy (Claude 페어링) |
| 2026-05-13 | v0.2 | 근거·표현·릴리즈·컴플라이언스·어드민 신설 | Glitzy (Claude 페어링) |
| 2026-05-13 | v0.3 | 용어 정리·Phase 통일·Feature Modules 신설·위험도 등급·어드민 분리 | Glitzy (Claude 페어링) |
| 2026-05-13 | v0.4 | **주요 갱신** (피드백 3차): (1) Control Plane / Data Plane 위상 도입 (§ 0, § 2.1, § 10), (2) Admin-first 개발 접근 명시, (3) Vertical Slice (M0) 개념 + 6개 화면 명세 (Article 포함), (4) Git 원본 vs 어드민 DB 원본 데이터 분리 명확화 (§ 2.5), (5) ComplianceRecord 마스터 정리 (§ 9.4), (6) Feature Modules에 **search-visibility** 신규 추가, keyword-monitoring과 책임 경계 명시 (§ 11.2), (7) D-21 추가, D-10 결정 완료 | Glitzy (Claude 페어링) |
| 2026-05-14 | v0.5 | **DEEP_DIVE 통합 정합 동기화**: (1) § 2.4 **데이터 계약 인벤토리 22개 + 공통 타입 3개로 갱신** — C-21 LocationProfile·C-22 ArticleCategory 정식 등재, CT-01 TrustMetric·CT-02 BusinessHours·CT-03 CTAConfig 신설, (2) ClinicProfile 책임 재정의 — 위치·시간·연락은 LocationProfile이 마스터 (SoT 정리), (3) RiskLevel은 직접 enum 사용 (`Ref<C-05>` 표기 제거), (4) PAGE_TYPES v0.5 (필수 14 + 선택 7, M0 8+1=9페이지) 및 admin v0.4 (LocationProfile main 자동 생성 규칙) 정합 동기화. 본 문서의 어드민 화면 수 6개·Control Plane / Data Plane 위상은 그대로 유지 | Glitzy (Claude 페어링) |
| 2026-05-14 | v0.6 | **피드백 정정 — 후속 동기화** (PAGE_TYPES v0.5.1 / DATA_MODEL v0.5 / admin v0.5): (1) **P-013 Legal/Policy를 M0 출시 게이트로 격상** — M0 9 → 10페이지 (Core 표준 템플릿 + ClinicProfile 변수 자동 치환), (2) C-10 ComplianceRecord.contentType enum에 `LegalDocument` 추가, (3) `CTAConfig.isFeatured: boolean` 신규 — LocationProfile.featuredCta `Ref<CTAConfig>` 표기 위반 정정, 필드 제거, (4) 관계 다이어그램 Article.author/reviewedBy 단일 참조 표기 정정. 본 문서 § 2.4 인벤토리는 영향 없음 (LegalDocument는 이미 등재된 C-16) | Glitzy (Claude 페어링) |
| 2026-05-14 | v0.7 | **피드백 정정 — 후속 동기화** (PAGE_TYPES v0.6 / DATA_MODEL v0.6 / admin v0.6): (1) admin § 3.3 ClinicProfile 행 SoT 정합 분리, (2) **LegalDocument 변수 출처** ClinicProfile + LocationProfile(main) 명시, (3) **C-16 LegalDocument M0 ✅ (auto) 표시**, (4) **LegalDocument 법무 검토 강제 룰** — ComplianceRecord.legalCounsel/legalCounselAt required (위험도 Low 예외 게이트), (5) **CTAConfig.isFeatured 회귀 제거** (v0.5 도입 → v0.6 제거) + **LocationProfile.featuredChannelId: Slug 신규** (컨테이너에 두기 — 객체 재사용 시 의도 누수 방지). 본 문서 § 2.4 인벤토리는 영향 없음 | Glitzy (Claude 페어링) |
| 2026-05-14 | v0.8 | **피드백 정정 — 정합성 마무리** (PAGE_TYPES v0.7 / DATA_MODEL v0.7 / admin v0.7): (1) § 2.4 갱신 주석을 v0.7 기준으로 동기화 (이전 v0.5/v0.4 표기 잔존 제거), (2) C-16 LegalDocument를 DATA_MODEL § 4 M0 핵심으로 이동·풀명세화 명시, (3) PAGE_TYPES § 0/§ 3 SoT 표현 정합, admin § 3.2 입력/출력 정합. 본 문서 § 2.4 인벤토리 표 자체는 영향 없음 (주석만 갱신) | Glitzy (Claude 페어링) |
| 2026-05-14 | v0.9 | **피드백 정정**: § 2.4 주석의 DATA_MODEL.md 버전 표기 v0.7 → v0.8 동기화. 헤더 작성일 설명에서 특정 버전 동기화 표현 제거 (일반화). 인벤토리 표 자체는 영향 없음 | Glitzy (Claude 페어링) |
| 2026-05-14 | v0.10 | **피드백 정정 — 유지보수 단순화**: § 2.4 주석에서 하위 문서 버전 숫자 추적 제거. 매 사이클마다 상위 문서 주석을 갱신하는 부담 해소. **각 하위 문서의 헤더·변경 이력이 단일 진실 원본**이라는 원칙 명시 | Glitzy (Claude 페어링) |
