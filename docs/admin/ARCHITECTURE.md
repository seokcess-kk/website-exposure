# Glitzy 어드민 (Control Plane) — 아키텍처

> **상태**: Draft v0.7
> **작성일**: 2026-05-14 (v0.6 → v0.7 — 피드백 정정: § 3.2 사이트 기본 정보 화면 입력/출력 SoT 정합)
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 10
> **목적**: 솔루션 운영 Control Plane(어드민)의 위상·원칙·Vertical Slice 명세·Phase 로드맵·기능 영역·데이터 모델·통합 흐름을 정의한다.
> **외부 공유 시 주의**: 상위 문서와 동일.

---

## 0. 한 페이지 요약

- 어드민은 **솔루션의 운영 Control Plane**이다. 무엇이·어떤 상태로·누가 승인해서 발행되는지 결정하는 운영 중심축이다.
- 사이트는 어드민이 관리한 Instance 데이터와 `FeatureModuleConfig`를 기반으로 생성된다. 단 최종 렌더링·배포는 Data Plane(Git + 빌드 파이프라인 + 정적 호스팅)이 담당한다.
- **사이트 빌드 입력은 파일**(Git)로, **운영 상태·권한·감사·승인·알림 이력은 어드민 DB**가 원본이다.
- 어드민이 일시 중단되어도 이미 빌드된 사이트는 작동한다 (Plane 격리).
- 개발 접근법은 **Admin-first** — UI를 처음부터 워크벤치로 잡고, 데이터 구조와 운영 흐름을 먼저 고정한다.
- 구축은 **Vertical Slice (M0) → Phase Alpha (M1) → Beta (M2) → GA (M3)** 순으로 점진. Slice가 처음부터 끝까지 동작하면 1호 클라이언트 출시 가능.

---

## 1. 위치 — 전체 흐름

```
┌──────────────────────────────────────────────────────────────────────┐
│                  Control Plane — Glitzy 어드민                         │
│                                                                        │
│  운영자 입력 · 검수 · 승인 · 발행 결정                                   │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ 6개 핵심 화면 (Vertical Slice — § 3)                              │  │
│  │ ① 클라이언트 인스턴스 대시보드                                     │  │
│  │ ② 사이트 기본 정보 (ClinicProfile)                                │  │
│  │ ③ 의료진 관리 (DoctorProfile)                                     │  │
│  │ ④ 시술/진료 페이지 (TreatmentPage)                                │  │
│  │ ⑤ 콘텐츠 작성/검수 (Article — Markdown 에디터)                    │  │
│  │ ⑥ 미리보기/발행 (Preview + 발행 + 발행 이력)                     │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  어드민 DB 원본: 권한·승인 로그·감사·알림 이력·드래프트·운영 메타        │
└──────────────────────────────────────────────────────────────────────┘
                            │
                            │ 발행 트리거 → 파일 산출 (Markdown/JSON) + Git 커밋·push
                            ▼
┌──────────────────────────────────────────────────────────────────────┐
│                  Data Plane                                            │
│                                                                        │
│   Git 저장소 (콘텐츠·메타·매니페스트 원본)                              │
│      │                                                                 │
│      │ push → CI/CD                                                    │
│      ▼                                                                 │
│   빌드 파이프라인 (Core · Preset · Instance · Feature Modules)         │
│      │                                                                 │
│      │ 정적 사이트 산출                                                 │
│      ▼                                                                 │
│   클라이언트 도메인 (정적 호스팅 — Vercel / Cloudflare 등)             │
└──────────────────────────────────────────────────────────────────────┘
                            │
                            │ 운영 단계 field metric·모니터링 데이터
                            ▼
                  Control Plane 대시보드로 회수
                  (analytics-reporting · keyword-monitoring ·
                   search-visibility · notifications)
```

---

## 2. 핵심 원칙

| # | 원칙 | 설명 |
|---|---|---|
| 1 | **Control Plane** | 어드민은 운영 중심축. 무엇이·어떻게·누가 승인해서 발행되는지 결정. 단순 입력 도구 이상 |
| 2 | **Data Plane 분리** | 최종 사이트 렌더링·배포는 Data Plane(Git + 빌드 + 호스팅)이 담당. 어드민이 빌드 파이프라인을 대체하지 않는다 |
| 3 | **빌드 입력은 파일** | 사이트 빌드 입력은 모두 버전 관리 가능한 파일(Markdown/JSON 등)로 Git에 남긴다. DB에 가두지 않는다 |
| 4 | **운영 메타는 DB 원본** | 운영 상태·권한·승인·감사·알림 이력은 어드민 DB가 진실의 원본 |
| 5 | **Plane 격리** | Control Plane(어드민)이 일시 중단되어도 Data Plane(이미 빌드된 사이트)은 작동 |
| 6 | **컴플라이언스 강제** | 상위 § 9 게이트를 UI 레벨에서 우회 불가하게 강제 |
| 7 | **Git 친화** | 발행은 Git 커밋·PR로 이어진다. 수정 이력·롤백은 Git이 자동 제공. 운영자가 직접 파일 수정도 가능 (양방향 친화) |
| 8 | **Admin-first 개발** | UI를 처음부터 워크벤치로 잡되, 모든 기능을 한 번에 만들지 않는다. 핵심 워크플로우를 처음부터 끝까지 관통시킨다 |
| 9 | **데이터·흐름 우선, 자동화 후순위** | 어떤 데이터·상태·승인자·산출물·Preview를 먼저 못 박는다. 자동화·LLM 보조·대시보드 풍부화는 그 후 |
| 10 | **Feature Modules 통합** | 모듈을 직접 구현하지 않고 표준 인터페이스를 통해 통합 (대시보드·설정·UI) |

---

## 3. Vertical Slice (M0) — 처음부터 끝까지 관통하는 한 줄

> 본 절은 솔루션의 **첫 동작 가능 범위**를 정의한다. 이 한 줄이 처음부터 끝까지 동작하면 1호 클라이언트(다이어트 한의원) 출시 가능. 이후 기능은 모두 이 흐름에 붙는다.

### 3.1 Slice 흐름

```
[Admin UI 진입]
   ↓
[클라이언트 인스턴스 생성/선택]
   ↓
[사이트 기본 정보 입력] → ClinicProfile 폼
   ↓
[의료진 정보 입력] → DoctorProfile 폼 (1명 이상)
   ↓
[시술/진료 페이지 작성] → TreatmentPage 폼 (1개 이상)
   ↓
[콘텐츠 작성] → Article 작성 (Markdown 에디터, 1개 이상)
   ↓
[위험도 분류 + 자동 검수] → Low/Medium/High 수동 분류, 룰 기반 표현 검수
   ↓
[발행 트리거]
   ↓
[파일 산출: Markdown/JSON] → Git 커밋·push (자동)
   ↓
[CI/CD 빌드] → 정적 사이트 산출
   ↓
[Preview URL 확인] → 호스팅 자동 Preview deployment
   ↓
[정식 배포] → 클라이언트 도메인에 게시
   ↓
[ComplianceRecord 보관] → 어드민 DB (감사 증빙)
```

### 3.2 Slice 포함 범위 — 6개 핵심 화면

| # | 화면 | 책임 | 입력 데이터 | 출력 |
|---|---|---|---|---|
| ① | 클라이언트 인스턴스 대시보드 | 단일 인스턴스 표시·전환 | (Slice는 단일 인스턴스) | 인스턴스 상태·배포 상태·컴플라이언스 상태 |
| ② | 사이트 기본 정보 | 의료기관 정체성 + 본원 위치·연락·시간 + 정책 변수 입력 (3 섹션) | `ClinicProfile` + `LocationProfile`(main) + `LegalDocument`(privacy·terms 등) | 3 계약 동시 출력 — § 3.8.1 / § 3.8.2 자동 생성 규칙 적용 |
| ③ | 의료진 관리 | 의료진 권위 정보 입력 | `DoctorProfile` (N명) | Physician schema + 저자 프로필 |
| ④ | 시술/진료 페이지 | 시술 구조화 콘텐츠 | `TreatmentPage` (N개) | MedicalProcedure schema |
| ⑤ | 콘텐츠 작성/검수 | Article 작성 + 표현 검수 | `Article` + `RiskLevel` | Article schema + 컴플라이언스 통과 |
| ⑥ | 미리보기/발행 | 발행 트리거·Preview URL·발행 이력 | (앞 화면의 변경사항) | Git 커밋·CI 빌드 트리거 |

### 3.3 Slice 포함 데이터 계약 (최소 필드)

> § 3.8.1과 정합: 어드민 폼 한 화면이 두 계약을 분리 출력하는 경우 명시.

| 계약 | 필수 필드 (Slice 최소) | 자동 생성 | 어드민 폼 위치 |
|---|---|:---:|---|
| `ClinicProfile` (C-01) | 기관명·전문분야·간략 소개·로고·기관 메타 (브랜드·정체성만 — 위치·시간·연락은 LocationProfile이 SoT) | | ClinicProfile 화면 (기관 정체성 섹션) |
| `LocationProfile`(slug=`main`) (C-21) | 본원 주소·전화·이메일·진료시간(`BusinessHours`)·예약 채널(`CTAConfig[]`) | ✅ (ClinicProfile 폼의 "본원 위치·연락·시간" 섹션에서 자동) | ClinicProfile 화면 (본원 위치 섹션) — § 3.8.1 |
| `LegalDocument` (C-16) | `documentType`·`title`·`effectiveDate`·`contactPerson` (`body`는 Core 표준 템플릿 + 변수 자동 치환) | ✅ (Core 표준 템플릿 + ClinicProfile + LocationProfile 변수) | ClinicProfile 화면 (정책 변수 보조 섹션) — § 3.8.2 |
| `DoctorProfile` (C-02) | 이름·자격·전문분야·약력. (사진 선택) | | DoctorProfile 화면 |
| `TreatmentPage` (C-03) | 제목·개요·원리·대상·과정·주의사항 (M0 추가 필드 — `recommendedFor`·`treatmentComponents`·`visitFlow` 등은 선택) | | TreatmentPage 화면 |
| `Article` (C-04) | 제목·요약·본문·저자·발행일·카테고리·`articleType` | | Article 작성 화면 |
| `RiskLevel` (C-05 enum) | Low / Medium / High 수동 분류 | | (모든 폼 안에서 부여) |
| `ComplianceRecord` (C-10) | 위험도·자동 검수 결과·검수자·일자·발행자·발행일 (LegalDocument는 `legalCounsel`·`legalCounselAt` 필수 — § 3.8.2) | ✅ (어드민이 발행 시 기록) | 미리보기·발행 화면 |

### 3.4 Slice 컴플라이언스 게이트 깊이

- 룰 기반 자동 검수 (금지 표현 패턴 1차 5~10종 시작)
- Low/Medium/High 수동 분류 (자동 분류·LLM 보조는 Slice 외 — Beta)
- 발행 시 `ComplianceRecord` 자동 생성 (필수 필드)
- 등급별 승인 흐름 단순화: Low는 자동 통과, Medium/High는 발행 시 의료진/클라이언트 승인 확인 체크박스 + 승인자 신원·일자 기록

### 3.5 Slice Git 통합 깊이

- 발행 시 Markdown/JSON 파일 자동 출력
- 자동 git commit & push (Direct push, PR 워크플로우는 Beta)
- 빌드 트리거는 push 시 CI/CD 자동
- 롤백은 Git revert 또는 이전 커밋 체크아웃 (UI는 단순)

### 3.6 Slice Preview·배포

- Preview URL은 호스팅 자체 Preview deployment 활용 (Vercel / Cloudflare 자동 생성 URL)
- 별도 Preview 서버 미구축
- 정식 배포는 메인 브랜치 push 시 자동

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

**어드민 폼 처리**: ClinicProfile 폼에 "정책 변수" 보조 섹션 추가 (개인정보 보호 책임자명·연락처·정책 효력 발생일 등 입력). P-013 자체는 별도 화면 없음 (ClinicProfile 보조 섹션). M0 어드민 화면 수는 EAT v0.x cascade 로 **7개** (기존 6 + Faq 신규).

**법무 검토 (위험도 Low 예외 룰)**:
- LegalDocument는 위험도 기본 Low이지만, **법무 검토 필수**. 표준 위험도 룰(High일 때만 권장)과 별도 예외 게이트.
- 발행 시 ComplianceRecord에 다음을 **모두 기록 필수** (어드민 발행 게이트가 강제):
  - `contentType` = `LegalDocument`
  - `legalCounsel` = 법무 자문자 신원 (필수)
  - `legalCounselAt` = 자문 일자 (필수)
- `legalCounsel`/`legalCounselAt` 누락 시 발행 차단. (DATA_MODEL.md C-10 룰 명세 참조)

### 3.9 Slice JSON-LD Schema (Core 자동 생성)

- Organization, MedicalClinic, Physician, MedicalProcedure, Article
- BreadcrumbList, FAQPage (필요 시)

### 3.10 Slice Feature Modules 깊이

- Slice 단계에서는 **모듈 활성화 UI는 외**
- compliance-assistant의 **룰 기반 부분만 Slice에 포함** (자동 검수)
- 다른 모듈(notifications·analytics-reporting·search-visibility 등)은 Phase Alpha+/Beta로 합류

### 3.11 Slice 완료 게이트 (6항목)

| # | 게이트 항목 | 통과 기준 |
|---|---|---|
| 1 | 사이트 측 페이지 타입 10종 + Article 1샘플 빌드 (총 11 페이지) | Home·About·Doctors List·Doctor Profile·Treatments List·Treatment Detail·**Contact**·**Location Detail (main 자동)**·**Legal/Policy (자동, 법무 검토)**·**FAQ (EAT v0.x EC-CASCADE-08)**·Article Detail 1개 — 정적 빌드 가능. 상세는 PAGE_TYPES.md § 6 |
| 2 | JSON-LD Schema 자동 생성 | schema validator 통과 |
| 3 | 컴플라이언스 자동 검수 | 룰 기반 금지 표현 검수 동작 + Low/Medium/High 수동 분류 동작 |
| 4 | Git 기반 발행·롤백 | 발행 시 커밋 자동 생성, Git revert로 롤백 가능 |
| 5 | Preview URL 제공 | 발행 전 별도 URL로 미리보기 가능 |
| 6 | `ComplianceRecord` 어드민 DB 보관 | 발행 콘텐츠당 위험도·검수자·일자 기록 |

### 3.12 apps/web route group 구조 (PSR-CASCADE-01a · PUBLIC_SITE_RENDER_PLAN v0.x)

Phase 0 단계 `apps/web` 안 어드민 + 공개 사이트 두 영역을 같은 Next.js 앱 안 route group 으로 분리한다. PUBLIC_SITE_RENDER_PLAN v0.x § 2.1 의 acceptance precondition cascade.

| route group | URL prefix | 책임 | 진입 단계 |
|---|---|---|---|
| `(admin)` | `/admin/<instanceSlug>/...` | 운영자 어드민 — ClinicProfile · DoctorProfile · TreatmentPage · Article · LegalDocument 입력/편집 | ADMIN_UI_SKELETON code v1.0 합류 (현재 `/<instanceSlug>/...` → `/admin/<instanceSlug>/...` 격상 cascade는 PUBLIC_SITE_RENDER code v1.0 cycle 안 동반 — PSR-CASCADE-01b) |
| `(site)` | `/<instanceSlug>/...` | 공개 사이트 — Home · About · Doctors · Treatments · Insights (1샘플) · Contact · Locations · Legal (v0.x 차단) | PUBLIC_SITE_RENDER code v1.0 합류 (M0 게이트 #1 사이트 측 페이지 빌드 가능 단계) |

**격상 의도**: 어드민 `/<slug>` 와 공개 `/<slug>` 가 같은 path namespace 를 공유하면 충돌. 본 격상으로 `(admin)` 은 `/admin/<slug>` · `(site)` 는 `/<slug>` 로 분리. M0 v1.0 도메인 매핑 (PSR-DEFER-02) 합류 시 어드민 도메인 (`app.glitzy.co`) 분리 가능 — 그 시점에 `/admin` prefix 유지 또는 제거 결정.

---

## 4. Phase 로드맵 — M0 → M1 → M2 → M3

### 4.1 M0 — Vertical Slice (§ 3 참조)

위 § 3 명세. 1호 클라이언트 출시 가능 시점.

### 4.2 M1 — Phase Alpha (Slice 직후 합류 기능)

Slice를 끝낸 후 1호 운영 안정화를 위해 합류시킬 기능들:

| 기능 | 비고 |
|---|---|
| Feature Modules 설정 UI (7번째 화면) | 어떤 모듈 활성화·설정 |
| notifications 모듈 통합 | 발행·검수 알림 |
| 발행 이력 풍부화 | 시각화 + 필터 |
| 빌드 상태 표시 | CI 상태 연동 |
| ComplianceRecord 풀필드 | 첨부·심의 증빙 보관 강화 |
| 단일 인스턴스 멀티 사용자 (운영자·검수자 2개 역할) | 단순 RBAC |

### 4.3 M2 — Phase Beta (2~5호 클라이언트 동시 운영)

| 기능 | 비고 |
|---|---|
| 멀티 클라이언트 대시보드 | 인스턴스 목록·상태 |
| 풀 RBAC | 운영자·검수자·클라이언트 승인자·외부 자문 |
| 컴플라이언스 게이트 전체 (상위 § 9 5단계) | UI 강제 |
| 의료진/클라이언트 외부 검토 채널 | 초대·검토·승인 |
| 발행 예약 | 시간 지정 |
| 수정 이력 UI | Git history 시각화 |
| compliance-assistant LLM 보조 | 자동 위험도 분류·LLM 검수 |
| analytics-reporting 통합 | 외부 분석 도구 연동 + 자동 리포트 |
| keyword-monitoring · search-visibility 통합 | 모니터링 대시보드 |
| PR 워크플로우 | Direct push 외 PR 기반 옵션 |

### 4.4 M3 — Phase GA (제품화 완성)

| 기능 | 비고 |
|---|---|
| 비주얼 디자인 토큰 에디터 | 시각적 |
| 콘텐츠 캘린더 | 발행 일정 |
| 성과 인사이트 | 콘텐츠별 노출·전환 분석 |
| asset-ingestion · content-migration 통합 | 신규 클라이언트 온보딩 자동화 |
| crm-sync 통합 | CRM 양방향 |
| Audit log 풀필드 | 모든 운영 행위 감사 |
| 외부 자문 협업 UI | 법무·심의 자문 채널 |
| 다국어 지원 (선택) | 영문 페이지 등 |

---

## 5. 기능 영역 상세

### 5.1 콘텐츠 작성 영역
- Markdown 에디터 + Frontmatter 폼 (페이지 타입별 동적 폼)
- 실시간 미리보기
- 구조 블록 삽입 (Q&A·리스트·표 — 상위 § 4.1)
- 자동 표현 검수 하이라이트 (compliance-assistant)
- 저장·발행 시 위험도 분류 강제

### 5.2 데이터 입력 영역

> **계약 필드 vs 폼 입력 필드의 구분** (§ 3.8.1 참조): 어드민 UI 한 화면이 여러 계약 필드를 분리해 출력하는 케이스가 있다. 화면 수와 계약 수는 1:1이 아니다.

**M0 어드민 화면별 입력·출력 매핑**:

| 어드민 화면 | 폼 섹션 | 출력 계약 파일 |
|---|---|---|
| ClinicProfile 화면 | (a) 기관 정체성 / (b) 본원 위치·연락·시간 / (c) 정책 변수 (보조) | `ClinicProfile` + `LocationProfile`(main) + `LegalDocument`(privacy·terms 등 자동 생성) |
| DoctorProfile 화면 | 의료진 1인 입력 | `DoctorProfile`(N개) |
| TreatmentPage 화면 | 시술 1건 입력 | `TreatmentPage`(N개) |
| Article 화면 | Article 작성 (Markdown 에디터) | `Article`(N개) |
| 대시보드 화면 | 인스턴스 상태·전환 | (출력 없음) |
| 미리보기·발행 화면 | 발행 트리거 | Git 커밋·CI 빌드 |

**M0 이후 추가 계약**:
- `MedicalConditionPage`·`FAQ` 폼 — 해당 페이지 타입 합류 시 (Phase Alpha 우선)
- `BrandTokens` 입력 (M0 form, M3 비주얼 에디터)
- `ReviewPolicy` 설정 (P-101 활성화 시) — 업종 기본값 → 인스턴스별 조정

### 5.3 컴플라이언스 게이트 영역
- 위험도 분류 (M0 수동, M2 자동 보조)
- 자동 표현 검수 결과 표시
- 동료·의료진·클라이언트 승인 요청·기록
- 사전심의 필요성 판단·기록
- `ComplianceRecord` 자동 생성·보관

### 5.4 멀티 클라이언트 관리 (M2+)
- 인스턴스 목록·상태·전환
- 인스턴스별 Feature Module 활성화·설정
- 권한·접근 제어
- 인스턴스 manifest 버전 표시

### 5.5 모니터링 대시보드 (M2+)
- analytics-reporting 데이터 표시
- keyword-monitoring · search-visibility 결과
- 성능 field metric 추세 (상위 § 4.3)
- 컴플라이언스 통계
- 발행 캘린더

### 5.6 발행·롤백 영역
- 발행 트리거 (Git 커밋·push 자동)
- Preview URL 자동 생성
- 발행 이력 (Git history 연동)
- 롤백 (Git revert / 이전 커밋 체크아웃)
- 빌드 상태 표시

---

## 6. 데이터 모델

> 상세 필드는 `docs/admin/DATA_MODEL.md`.

### 6.1 어드민 DB가 원본인 데이터

| 데이터 | 비고 |
|---|---|
| 운영자·승인자 계정·권한 | RBAC |
| 클라이언트 인스턴스 메타 (이름·도메인·상태·활성 모듈) | |
| 콘텐츠 임시 드래프트 | 발행 시 파일로 출력·Git 커밋 |
| `ComplianceRecord` 풀필드 | 감사·증빙 |
| Audit log | 모든 운영 행위 |
| 알림 발송 이력 | notifications 모듈 |
| 외부 분석 통합 캐시 | analytics-reporting 모듈 |
| 사전심의 제출·증빙 첨부 파일 | |
| 외부 자문 회신·기록 | |

### 6.2 Git이 원본인 데이터 (빌드 입력)

| 데이터 | 형식 |
|---|---|
| 콘텐츠 본문 (Article·페이지) | Markdown |
| 콘텐츠 Frontmatter (메타) | YAML |
| 페이지 데이터 (`ClinicProfile`·`DoctorProfile`·`TreatmentPage` 등) | JSON 또는 YAML |
| `InstanceManifest` | YAML 또는 JSON |
| `BrandTokens` | JSON 또는 YAML |
| `FeatureModuleConfig` | JSON 또는 YAML |
| `ComplianceRecord` 빌드 참조 메타 (위험도·심의 통과·발행일) — DB 사본 | JSON |
| 미디어 자산 (이미지·동영상) | 바이너리 (LFS 검토) |

### 6.3 두 영역 교차 데이터

`ComplianceRecord`는 상위 § 9.4 정책을 따른다 — 감사·법무 증빙 풀데이터는 DB가 원본, 사이트 빌드 참조용 가벼운 메타는 Git에 사본.

---

## 7. 인증·권한 모델

### 7.1 단계별 도입

| 단계 | 인증·권한 |
|---|---|
| M0 (Slice) | 단일 운영자 계정. 단순 인증 |
| M1 | 운영자 + 검수자 2개 역할. 단순 RBAC |
| M2 | 풀 RBAC. 외부 사용자(의료진·클라이언트 승인자·외부 자문) 초대 |
| M3 | SSO 검토. 외부 자문 협업 채널 |

### 7.2 역할 (M2+)

| 역할 | 권한 |
|---|---|
| **Glitzy Admin** | 모든 인스턴스·Module·설정 |
| **Glitzy Editor** | 콘텐츠 작성·발행. 시스템 설정 제외 |
| **Glitzy Reviewer** | 동료 검수 |
| **Client Physician** | 의학적 정확성 검토·승인 (Medium/High) |
| **Client Approver** | 클라이언트 최종 발행 동의 |
| **External Counsel** | High 자문 (법무·심의) |
| **Read-only Auditor** | 감사 읽기 |

---

## 8. 외부 시스템 연동

| 시스템 | 통합 방식 | 단계 |
|---|---|---|
| Git 호스팅 (GitHub/GitLab) | 빌드 트리거·커밋·PR API | M0 |
| CI/CD | 웹훅·상태 표시 | M0 |
| 정적 호스팅 (Vercel·Cloudflare) | Preview URL·배포 상태 | M0 |
| 네이버 서치어드바이저 | analytics-reporting | M2 |
| Google Search Console | analytics-reporting | M2 |
| GA4 | analytics-reporting | M2 |
| 이메일·슬랙·SMS | notifications | M1/M2 |
| 클라이언트 CRM | crm-sync | M2+ |
| LLM (Claude/GPT) | compliance-assistant | M2 |
| 외부 자문 협업 도구 | 검토 채널 | M3 |

---

## 9. Feature Modules 통합

어드민은 Feature Module을 **직접 구현하지 않는다**. 모듈의 표준 인터페이스를 통해:

1. 모듈 활성화·비활성화 UI (`FeatureModuleConfig` 편집)
2. 모듈별 설정 UI (모듈 명세의 설정 스키마 기반 동적 폼)
3. 모듈 출력 표시 (알림·리포트·키워드 모니터링·search-visibility 결과)
4. 모듈 이벤트 구독·표시

각 모듈은 어드민이 통합 가능한 표준 인터페이스(설정 스키마, 이벤트, 대시보드 위젯)를 제공해야 한다.

---

## 10. 미결정 사항 (어드민 한정)

| ID | 항목 | 상태 |
|---|---|---|
| A-01 | 어드민 기술 스택 | 미결정 |
| A-02 | 어드민 DB (PostgreSQL / SQLite / 기타) | 미결정 |
| A-03 | 인증 시스템 (자체 / Auth0 / Clerk / 기타) | 미결정 |
| A-04 | Preview URL 발급 방식 | 호스팅 의존 추정 |
| A-05 | Git 워크플로우 | M0 Direct push, M2+ PR 옵션 |
| A-06 | 에디터 구현 (Tiptap / Lexical / CodeMirror / native MD) | 미결정 |
| A-07 | 다국어 지원 필요 시점 | M3 검토 |
| A-08 | Slice 화면 ⑤(Article 작성) 에디터 우선 기능 (블록 vs Markdown native) | 미결정 |

---

## 11. 변경 이력

| 일자 | 버전 | 변경 | 작성자 |
|---|---|---|---|
| 2026-05-13 | v0.1 | 최초 작성 (ARCHITECTURE.md v0.3에서 분리) | Glitzy (Claude 페어링) |
| 2026-05-13 | v0.2 | **주요 갱신** (피드백 3차): (1) Control Plane 위상 도입, (2) Admin-first 원칙 명시, (3) **Vertical Slice (M0) 6개 화면 명세 신설** (§ 3) — Article 포함, (4) Phase 명칭 M0/M1/M2/M3 + Alpha/Beta/GA 병기, (5) Git 원본 vs DB 원본 데이터 분리 명확화 (§ 6), (6) Feature Modules 통합 원칙 명시, (7) ComplianceRecord 두 영역 교차 정책 (§ 6.3) | Glitzy (Claude 페어링) |
| 2026-05-13 | v0.3 | **PAGE_TYPES.md v0.2 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 5종 → **7종 + Article 1샘플 = 8개 페이지** (Contact 추가), (2) § 3.11 완료 게이트 #1 7종 빌드로 수정, (3) 단일 진실 원본은 `core/PAGE_TYPES.md`로 명시 (중복 회피). 어드민 화면 수 6개는 유지(Contact는 ClinicProfile 자동 생성) | Glitzy (Claude 페어링) |
| 2026-05-14 | v0.4 | **PAGE_TYPES v0.5 + DATA_MODEL v0.4 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 7종+1샘플 → **8종+1샘플=9개 페이지** (P-014 Location Detail 추가), (2) **§ 3.8.1 LocationProfile(main) 자동 생성 규칙 명시** — 어드민 화면 추가 없이 ClinicProfile 입력으로 자동 생성, (3) § 3.11 완료 게이트 #1 8종 빌드로 수정. 어드민 화면 수 6개는 그대로 유지 | Glitzy (Claude 페어링) |
| 2026-05-14 | v0.5 | **피드백 정정**: (1) **§ 3.8.1 표현 정리** — 계약 필드(파일 출력)와 어드민 폼 입력 필드(UI 수집)의 구분 명시. ClinicProfile 폼은 두 섹션(기관 정체성 + 본원 위치·연락·시간)으로 출력은 ClinicProfile + LocationProfile main 두 파일, (2) **§ 3.8.2 LegalDocument 자동 생성 규칙 신규** — Core 표준 템플릿 + ClinicProfile 변수 치환, ComplianceRecord 추적, (3) **§ 3.8 Slice 9종+1샘플 → 10종+1샘플=10페이지** (P-013 격상 추가), (4) § 3.11 완료 게이트 #1 10종, (5) **§ 5.2 데이터 입력 영역** — 어드민 화면별 입력·출력 매핑 표 추가로 1:1이 아님 명시 | Glitzy (Claude 페어링) |
| 2026-05-14 | v0.6 | **피드백 정정**: (1) **§ 3.3 ClinicProfile 행 분리** — 이전 v0.3 잔존 표현(ClinicProfile에 주소·전화·시간)을 SoT 정합으로 정정. ClinicProfile/LocationProfile(main)/LegalDocument 3개 계약 행 + 자동 생성 표시, (2) **§ 3.8.2 LegalDocument body 변수 출처 정정** — ClinicProfile + LocationProfile(main) 두 SoT 명시 (`{{clinic.*}}`·`{{location.main.*}}` 네임스페이스), (3) **§ 3.8.2 법무 검토 강제 룰** — LegalDocument는 위험도 Low이지만 ComplianceRecord.legalCounsel·legalCounselAt 필수 (어드민 발행 게이트 차단) | Glitzy (Claude 페어링) |
| 2026-05-14 | v0.7 | **피드백 정정**: § 3.2 Slice 6개 화면 표 — ② 사이트 기본 정보의 입력 데이터 `ClinicProfile`만 → **`ClinicProfile` + `LocationProfile`(main) + `LegalDocument`** 3 계약 동시 출력로 정정. § 3.8.1/§ 3.8.2와 정합 | Glitzy (Claude 페어링) |
