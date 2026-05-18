Reading additional input from stdin...
OpenAI Codex v0.130.0
--------
workdir: C:\Users\assag\solution\website-exposure
model: gpt-5.5
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR, C:\Users\assag\.codex\memories]
reasoning effort: none
reasoning summaries: none
session id: 019e2942-0702-7cc0-9d27-1f8408583151
--------
user
# 자동 비평 의뢰 — `docs/features/content-migration.md` v0.6 (6차 사이클 — v1.0 안정판 최종 검증)

## 컨텍스트

5차 비평(8 지적: blocking 3 + major 4 + minor 1) 전건 수용. v0.6 핵심:
- § 12 인벤토리 **12 tables** — PolicyReevaluateRecord 별도 table 승격 (CM5-01)
- § 4.3.2 3축 invariant DB CHECK tuple 기반 재작성 (CM5-02)
- REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade — run-aborted (critical) + step-compensated (high) NotificationEvent 2종 추가 (CM5-03)
- writeSetScopeDigest 고정 정의 (CM5-04)
- DryRunReport schema에 digestComputationMode·invalidationInputs·cacheSourceRef·generatedAt·writeSetScopeDigest 추가 (CM5-05)
- legalEntityChanged 잔재 제거 → 분해 필드 cascade (CM5-06)
- § 3.4 requestFingerprint 표에 markStepCompensated·abortRun 추가 + skipStep rollbackClass 제거 (CM5-07)
- § 10.3 v0.6 residual risk (CM5-08)

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\content-migration.md` v0.6을 v1.0 안정판으로 최종 검증하라.

ready_for_v1_0=true 판정 기준:
- blocking 0개
- major 0~1개 (잔여 minor 수준)
- SoT cascade 동기화 완료 (REVIEW_WORKFLOW·DATA_MODEL)
- 의료법·개인정보보호법 운영 가능

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `CM6-`. **v1.0 안정판으로 판정하면 verdict="ready_for_v1_0"** 명시.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\content-migration.md` (대상 v0.6)
- `C:\Users\assag\solution\website-exposure\.codex-reviews\cm_cycle5_response.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
codex
검증 대상으로 지정된 문서와 SoT 문서들을 먼저 대조하겠습니다. 이번 요청은 구현이 아니라 리뷰이므로, 변경하지 않고 blocking/major/minor 근거를 파일 위치 기준으로 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw -LiteralPath 'docs/features/content-migration.md'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw -LiteralPath 'docs/admin/REVIEW_WORKFLOW.md'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw -LiteralPath 'docs/core/DATA_MODEL.md'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw -LiteralPath '.codex-reviews/cm_cycle5_response.md'" in C:\Users\assag\solution\website-exposure
 succeeded in 650ms:
# Core — 데이터 계약 명세

> **상태**: Draft v0.22
> **작성일**: 2026-05-15 (v0.22 — `features/content-migration.md` 3차 사이클 cascade: ContentMigrationConfig `legalApproved` → `featureLegalApproved` rename + `piiFieldCatalogRef`·`entityFieldProjectionCatalogRef` 추가 — CM3-08·CM3-05·CM3-18)
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 2.4, § 7
> **연관 문서**:
> - 페이지 타입 → `core/PAGE_TYPES.md`
> - Schema 매핑 → `core/SCHEMA_MAPPING.md`
> - 위험도 → `compliance/RISK_LEVELS.md`
> - 디자인 토큰 → `core/DESIGN_TOKENS.md`
> - 어드민 데이터 모델 → `admin/DATA_MODEL.md`
> - 레퍼런스 분석 → `research/REFERENCE_ANALYSIS_2026-05.md`, `research/REFERENCE_DEEP_DIVE_2026-05.md`

---

## 0. 한 페이지 요약

- **23개 계약 (C-01~C-23) + 3개 공통 타입 (CT-01~CT-03)**.
- v0.13: `features/notifications.md` cascade — C-08 확장(`adminBaseUrl`·`timezone`·`NotificationChannelsConfig`) + **C-23 `AdminUser` 신설** (어드민 사용자·자격·알림 선호 SoT).
- 모든 계약은 공통 메타필드(`@id`, `@createdAt`, `@updatedAt`).
- 빌드 입력 계약(Git 원본)과 운영 메타 계약(어드민 DB 원본) 구분.
- **SoT 원칙**: `ClinicProfile`은 브랜드·기관 정체성·메타 통계만, **위치·전화·시간은 `LocationProfile`이 마스터**.
- **RiskLevel은 enum 직접 사용** (`Ref<C-05>` 표기 제거).
- v0.4: TreatmentPage·Article 컨텍스트 필드 즉시 통합 (1호 다이어트 한의원 직결).

---

## 1. 계약 인벤토리

### 1.1 데이터 계약 (23개)

| ID | 계약 이름 | 책임 | 소속 | 마스터 | M0 | 관련 페이지 타입 |
|---|---|---|:---:|:---:|:---:|---|
| C-01 | `ClinicProfile` | 의료기관 정체성 (브랜드·메타) | L3 | Git | ✅ | P-001, P-002 |
| C-02 | `DoctorProfile` | 의료진 권위·전문성 | L3 | Git | ✅ | P-003, P-004 |
| C-03 | `TreatmentPage` | 시술·치료 구조화 콘텐츠 | L3 | Git | ✅ | P-005, P-006 |
| C-04 | `Article` | 인사이트·블로그 글 | L3 | Git | ✅ | P-009, P-010 |
| C-05 | `RiskLevel` | 위험도 등급 (enum) | L1/L3 | Git+DB | ✅ | 전체 |
| C-06 | `PageMeta` | 페이지별 메타 데이터 | L1/L3 | Git | ✅ | 전체 |
| C-07 | `BrandTokens` | 디자인 토큰 최종값 | L3 | Git | ✅ | UI |
| C-08 | `InstanceManifest` | 버전 고정 명세 | L3 | Git | ✅ | 빌드 |
| C-09 | `FeatureModuleConfig` | Feature Module 설정 | L3 | Git | ✅ | 모듈 |
| C-10 | `ComplianceRecord` | 컴플라이언스 게이트 통과 기록 | L1/L3 | DB+Git | ✅ | 발행 |
| C-11 | `MedicalConditionPage` | 증상·질환 정보 | L3 | Git | | P-007, P-008 |
| C-12 | `FAQ` | 질문-답변 묶음 | L3 | Git | | P-011 |
| C-13 | `ReviewPolicy` | 후기 노출 정책 | L2+L3 | Git | | P-101 |
| C-14 | `MedicalSpecialty` | 의료 전문 분야 | L2 | Git | | C-01,02 참조 |
| C-15 | `SchemaInput` | JSON-LD 생성기 입력 | L1/L3 | 런타임 | ✅ | 전체 |
| C-16 | `LegalDocument` | 정책·약관 (Core 표준 템플릿 + 변수 자동 치환) | L3 | Git | ✅ (auto) | P-013 |
| C-17 | `PricingPage` | 가격 안내 | L3 | Git | | P-102 |
| C-18 | `FacilitiesPage` | 시설·장비 | L3 | Git | | P-103 |
| C-19 | `NewsItem` | 소식·이벤트 | L3 | Git | | P-104 |
| C-20 | `ReservationPage` | 예약 안내 | L3 | Git | | P-105 |
| C-21 | `LocationProfile` | 지점 정체성 (위치·시간·연락 마스터) | L3 | Git | ✅ | P-012, P-014 |
| C-22 | `ArticleCategory` | Article Pillar/Category 정의 | L2+L3 | Git | (사용) | P-009, P-010 |
| C-23 | `AdminUser` | 어드민 사용자 (권한·자격·알림 선호 SoT) | L3 | DB | ✅ (admin) | 어드민 전용 |

### 1.2 공통 타입 (CT — Cross-cutting Type, 3개)

| ID | 공통 타입 | 책임 | 소속 | 사용처 |
|---|---|---|:---:|---|
| CT-01 | `TrustMetric` | 신뢰도·통계 지표 (기준·증빙 포함) | L1 정의 / L3 값 | ClinicProfile, LocationProfile, DoctorProfile |
| CT-02 | `BusinessHours` | 진료시간·접수시간·점심·휴진 | L1 정의 / L3 값 | LocationProfile |
| CT-03 | `CTAConfig` | 전환 채널 설정 | L1 정의 / L3 값 | ClinicProfile, LocationProfile, TreatmentPage |

---

## 2. 공통 룰

### 2.1 타입 표기법

| 표기 | 의미 |
|---|---|
| `string`/`number`/`boolean` | 기본 |
| `Date` | ISO 8601 |
| `URL`/`Email`/`Phone`/`Slug` | 형식 제한 문자열 |
| `Markdown` | Markdown 본문 |
| `T[]` | 배열 |
| `T \| U` | 합 타입 |
| `enum {A, B, C}` | 열거형 |
| `Ref<C-NN>` | 다른 계약의 `@id` 참조 |
| `?` (필드 뒤) | optional |

### 2.2 공통 메타 필드 (모든 계약)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 인스턴스 내 고유 식별자 |
| `@createdAt` | `Date` | ✅ | 최초 생성 시각 |
| `@updatedAt` | `Date` | ✅ | 최종 수정 시각 |
| `@version` | `number` | optional | 계약 스키마 버전 |
| `@provenanceAssetId` | `string` | optional | (v0.18 +) `features/asset-ingestion.md`이 생성한 경우 source IngestedAsset id. 어드민 manual hand-off 시에도 어드민 UI가 보존 (AI4-11). asset-ingestion이 자동 promote한 경우는 AssetPromotionRecord.targetContentRef와 cross-link |

### 2.3 식별자(`@id`) 규약
- 인스턴스 내 유일, slug 형식, 3~64자.
- 변경 시 URL 변경 → 301 리다이렉트 매핑 필요 (어드민 책임 — DM-01).

### 2.4 다국어
- M0 한국어 기본. 다국어 시 필드 단위 객체 `{ko, en, ...}` 확장.

### 2.5 SoT 원칙 (v0.4 명시)
- **ClinicProfile**: 브랜드·기관 정체성·메타 통계만 보관 (`name`, `description`, `founderStory`, `awards`, `trustMetrics`, `medicalSpecialty`, `affiliatedInstitutes`, `mediaCoverage`, `socialMedia`, `internationalSupport`, `socialContribution`, `primaryCtas`, `logoUrl`, `ogImageUrl`).
- **LocationProfile**: 위치·전화·이메일·진료시간·예약 채널의 **마스터**. 단지점 인스턴스도 `LocationProfile(slug=main)` 1개 필수.
- ClinicProfile에 `mainAddress`/`mainTelephone`/`mainEmail`/`businessHours` 같은 필드 **없음**. 모든 위치·시간 정보는 LocationProfile 참조.

### 2.6 변경 정책

| 변경 종류 | 분류 |
|---|---|
| optional 필드 추가 | MINOR |
| required 필드 추가 | **MAJOR** |
| 필드 타입 변경 (호환) | MINOR |
| 필드 타입 변경 (비호환) | **MAJOR** |
| 필드 제거 | **MAJOR** |
| validation 강화 | 케이스별 |
| validation 완화 | PATCH |
| enum 값 추가 | MINOR |
| enum 값 제거 | **MAJOR** |
| 기본값 변경 | 케이스별 |

> 상위 `release/VERSIONING_POLICY.md` 참조.

---

## 3. 공통 타입 풀명세

### CT-01. `TrustMetric` — 신뢰도·통계 지표

**목적**: 누적 환자 수·처방 수·논문 수·임상 데이터 등 **모든 수치 주장을 표준화**. 기준 기간·범위·증빙을 의무 또는 권장.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 지표 식별자 |
| `label` | `string` | ✅ | 표시 라벨 (예: "누적 진료 환자") |
| `value` | `number \| string` | ✅ | 값 |
| `unit` | `string` | optional | 단위 ("명", "건", "년", "%") |
| `measuredFrom` | `Date` | optional | 측정 시작일 |
| `measuredTo` | `Date` | optional | 측정 종료일 |
| `scope` | `enum {clinic, branch, network, doctor}` | ✅ | 측정 범위 |
| `evidenceUrl` | `URL` | optional | 외부 검증 링크 |
| `evidenceNote` | `string` | optional | 증빙 설명 |
| `displayRiskLevel` | `RiskLevel` | optional | 노출 시 위험도 등급 |
| `displayFormat` | `string` | optional | 노출 형식 템플릿 |

**컴플라이언스 룰**:
- `value`만 있고 `measuredFrom`·`scope`·`evidenceUrl/Note` 모두 없으면 **빌드 시 경고**.
- 단정형·과시형 라벨 ("국내 1위", "최대 누적") 시 자동 Medium 격상, 외부 검증 불일치 시 High 검토.
- 사실 안내형 표현 권장 ("누적 N명을 진료해왔습니다").

### CT-02. `BusinessHours` — 진료시간·접수시간·휴진

**목적**: 진료시간만으로 부족한 한국 의료기관의 실제 운영 패턴 반영.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `openingHours` | `OpeningHoursSpec[]` | ✅ | 진료 가능 시간 |
| `receptionHours` | `OpeningHoursSpec[]` | optional | 접수 마감 시간 (초진·재진 다를 수 있음) |
| `lunchBreaks` | `LunchBreak[]` | optional | 점심시간 |
| `holidayPolicy` | `Markdown` | optional | 설·추석·공휴일 운영 |
| `specialClosures` | `SpecialClosure[]` | optional | 특정일 휴진 |
| `emergencyOrAfterHoursNote` | `Markdown` | optional | 야간·응급·콜센터 안내 |

**하위 타입**:

#### `OpeningHoursSpec`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `dayOfWeek` | `enum {Mon, Tue, Wed, Thu, Fri, Sat, Sun, PublicHoliday}[]` | ✅ | 요일 |
| `opens` | `string` | ✅ | `"HH:mm"` |
| `closes` | `string` | ✅ | `"HH:mm"` |
| `appliesTo` | `enum {general, firstVisit, returnVisit}` | optional | 대상 (기본 general) |
| `note` | `string` | optional | |

#### `LunchBreak`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `dayOfWeek` | `enum {Mon~Sun, PublicHoliday}[]` | ✅ | |
| `from` | `string` | ✅ | |
| `to` | `string` | ✅ | |

#### `SpecialClosure`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `date` | `Date` | ✅ | |
| `reason` | `string` | optional | |
| `note` | `string` | optional | |

### CT-03. `CTAConfig` — 전환 채널 설정

**목적**: 전화·온라인 예약·외부 메신저 등 모든 전환 채널을 일관 모델링.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 채널 식별자 |
| `type` | `enum {phone, naver-reservation, naver-talk, kakao-talk, kakao-channel, form, map, external, sms, email, video-consultation}` | ✅ | 채널 종류 |
| `label` | `string` | ✅ | 버튼·링크 텍스트 |
| `targetUrl` | `URL \| string` | ✅ | URL 또는 전화번호 |
| `iconKey` | `string` | optional | 아이콘 식별자 |
| `style` | `enum {primary, secondary, minimal}` | optional | |
| `displayOrder` | `number` | optional | 정렬 |
| `displayContext` | `enum {floating, header, footer, hero, inline, modal, sidebar}[]` | optional | 노출 위치 |
| `availableFor` | `Ref<C-21>[]` | optional | 특정 지점만 사용 |
| `appointmentRequired` | `boolean` | optional | 예약 채널 여부 |
| `consultationType` | `enum {appointment, inquiry, payment, support}` | optional | 채널 의도 |

> v0.5에서 추가했던 `isFeatured: boolean` 필드는 **v0.6에서 제거**. CTAConfig가 여러 컨테이너(ClinicProfile.primaryCtas / LocationProfile.reservationChannels / TreatmentPage.cta)에서 재사용될 가능성을 고려할 때, 객체 자체에 컨텍스트 의존 의미(강조 여부)를 두면 재사용 시 의도 누수 위험. 대신 **컨테이너 쪽에 `featuredChannelId: Slug`로 강조 표시** (LocationProfile § 4 참조). CTAConfig 객체는 컨텍스트 무관 데이터로 유지.

---

## 4. 데이터 계약 풀명세 (M0 핵심)

### C-01. `ClinicProfile` — 의료기관 정체성 (브랜드·메타)

**v0.4 SoT 변경**: 위치·전화·시간 필드 **제거**. `locations[]` 통해 LocationProfile 참조.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 보통 `"clinic"` 단일 |
| `name` | `string` | ✅ | 정식 명칭 (1~100자) |
| `alternateName` | `string` | optional | 영문명 |
| `legalEntityName` | `string` | optional | 법인 정식 명칭 |
| `slogan` | `string` | optional | 한 줄 가치 |
| `description` | `string` | ✅ | 80~300자 |
| `longDescription` | `Markdown` | optional | About 본문 |
| `foundingDate` | `Date` | optional | 설립일 |
| `founder` | `string` | optional | 대표자명 |
| `founderStory` | `Markdown` | optional | 대표 인사말·스토리 |
| `medicalSpecialty` | `Ref<C-14>[]` | ✅ | 진료 전문 분야 |
| `businessRegistrationNumber` | `string` | optional | 사업자등록번호 (`NNN-NN-NNNNN`) |
| `awards` | `Award[]` | optional | 인증·수상 |
| `memberOf` | `Affiliation[]` | optional | 학회·협회 |
| `affiliatedInstitutes` | `ResearchInstitute[]` | optional | 연구 기관 |
| `trustMetrics` | `TrustMetric[]` | optional | 누적 통계·연구 지표 (CT-01) |
| `socialMedia` | `SocialMediaLinks` | optional | SNS·외부 채널 (sameAs) |
| `mediaCoverage` | `MediaItem[]` | optional | 미디어 노출 이력 |
| `internationalSupport` | `InternationalSupport` | optional | 외국인 환자 진료 지원 |
| `socialContribution` | `Markdown` | optional | 사회공헌·후원 |
| `primaryCtas` | `CTAConfig[]` | optional | 사이트 전반 주요 CTA |
| `locations` | `Ref<C-21>[]` | ✅ | 지점 목록. 단지점은 1개(`main`), 다지점은 N개. 반드시 1개 이상 |
| `logoUrl` | `URL` | ✅ | 로고 |
| `ogImageUrl` | `URL` | ✅ | OpenGraph 기본 이미지 |

**하위 타입**:

#### `Address`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `streetAddress` | `string` | ✅ | 도로명 상세 |
| `addressLocality` | `string` | ✅ | 시·군 |
| `addressRegion` | `string` | ✅ | 도·광역시 |
| `postalCode` | `string` | ✅ | 우편번호 |
| `addressCountry` | `string` | ✅ | ISO 3166-1 alpha-2 (예: `"KR"`) |

#### `GeoCoordinates`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `latitude` | `number` | ✅ | |
| `longitude` | `number` | ✅ | |

#### `Award`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `name` | `string` | ✅ | 인증·수상명 |
| `awardedBy` | `string` | optional | 수여 기관 |
| `awardedDate` | `Date` | optional | |
| `verificationUrl` | `URL` | optional | 검증 가능 링크 |

#### `Affiliation`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `name` | `string` | ✅ | 학회·협회명 |
| `role` | `string` | optional | |
| `url` | `URL` | optional | |
| `verified` | `boolean` | optional | |

#### `ResearchInstitute`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `name` | `string` | ✅ | 연구 기관명 |
| `description` | `string` | optional | |
| `url` | `URL` | optional | |
| `relationship` | `enum {affiliate, partner, owned}` | optional | |

#### `SocialMediaLinks`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `naverBlog` | `URL` | optional | |
| `instagram` | `URL` | optional | |
| `youtube` | `URL` | optional | |
| `kakao` | `URL` | optional | |
| `facebook` | `URL` | optional | |
| `linkedin` | `URL` | optional | |
| `others` | `{label: string, url: URL}[]` | optional | |

#### `MediaItem`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `outlet` | `string` | ✅ | 매체명 |
| `title` | `string` | ✅ | |
| `date` | `Date` | optional | |
| `url` | `URL` | optional | |

#### `InternationalSupport`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `languages` | `string[]` | ✅ | ISO 639-1 |
| `interpreterAvailable` | `boolean` | optional | |
| `internationalLanguagePages` | `{lang: string, url: URL}[]` | optional | |
| `targetCountries` | `string[]` | optional | |

### C-02. `DoctorProfile` — 의료진 권위·전문성

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `name` | `string` | ✅ | 1~50자 |
| `alternateName` | `string` | optional | 영문명 |
| `jobTitle` | `string` | ✅ | 직책 |
| `medicalSpecialty` | `Ref<C-14>[]` | ✅ | 최소 1개 |
| `briefBio` | `string` | ✅ | 50~200자 |
| `philosophy` | `Markdown` | optional | 진료 철학·인사말 |
| `personalStory` | `Markdown` | optional | 의료진 본인 경험·계기 |
| `photoUrl` | `URL` | optional | |
| `credentials` | `Credential[]` | ✅ | 최소 1개 |
| `education` | `Education[]` | optional | |
| `career` | `CareerItem[]` | optional | |
| `affiliations` | `Affiliation[]` | optional | |
| `publications` | `Publication[]` | optional | |
| `media` | `MediaItem[]` | optional | |
| `trustMetrics` | `TrustMetric[]` | optional | 의료진 단위 통계 (논문·임상 등) |
| `email` | `Email` | optional | |
| `socialMedia` | `SocialMediaLinks` | optional | |
| `consultationAvailable` | `boolean` | optional | 기본 `true` |
| `primaryLocation` | `Ref<C-21>` | optional | 주 소속 지점 |
| `additionalLocations` | `Ref<C-21>[]` | optional | 추가 진료 지점 |

**하위 타입**:

#### `Credential`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `type` | `enum {license, certification, board}` | ✅ | |
| `name` | `string` | ✅ | |
| `issuedBy` | `string` | optional | |
| `issuedDate` | `Date` | optional | |
| `expiryDate` | `Date` | optional | |

#### `Education`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `institution` | `string` | ✅ | |
| `degree` | `string` | ✅ | |
| `period` | `string` | optional | 예: `"2010-2016"` |

#### `CareerItem`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `organization` | `string` | ✅ | |
| `role` | `string` | ✅ | |
| `period` | `string` | optional | |

#### `Publication`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `title` | `string` | ✅ | |
| `venue` | `string` | optional | 학회지·매체 |
| `year` | `number` | optional | |
| `url` | `URL` | optional | |

### C-03. `TreatmentPage` — 시술·치료 구조화 콘텐츠 (v0.4 컨텍스트 필드 즉시 통합)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `name` | `string` | ✅ | 1~80자 |
| `alternateName` | `string` | optional | |
| `summary` | `string` | ✅ | 50~160자 핵심 답변 |
| `category` | `string` | optional | 시술 카테고리 |
| `medicalSpecialty` | `Ref<C-14>` | optional | |
| `overview` | `Markdown` | ✅ | 개요 |
| `mechanism` | `Markdown` | ✅ | 원리 |
| `targetAudience` | `Markdown` | ✅ | 대상 (일반 설명) |
| `recommendedFor` | `string[]` | optional | **(v0.4)** 추천 대상 리스트 (구체) |
| `treatmentComponents` | `TreatmentComponent[]` | optional | **(v0.4)** 한약·약침·고주파·체성분 검사·식단 관리 등 구성 |
| `visitFlow` | `VisitFlowStep[]` | optional | **(v0.4)** 검사 → 상담 → 처방 → 관리 단계 |
| `process` | `ProcessStep[]` | ✅ | 과정 (단계별) |
| `duration` | `string` | optional | 소요 시간 |
| `sessionCount` | `string` | optional | 권장 횟수 |
| `programVariants` | `ProgramVariant[]` | optional | 프로그램 패키지 변형 |
| `precautions` | `Markdown` | ✅ | 주의사항·금기증 |
| `aftercare` | `Markdown` | optional | 시술 후 관리 |
| `maintenancePlan` | `Markdown` | optional | **(v0.4)** 유지·요요 방지 계획 |
| `remoteCareAvailable` | `boolean` | optional | **(v0.4)** 비대면 진료 가능 여부 |
| `evidenceNotes` | `EvidenceNote[]` | optional | **(v0.4)** 논문·통계·근거 링크 |
| `faqs` | `Ref<C-12>[]` | optional | 관련 FAQ |
| `relatedDoctors` | `Ref<C-02>[]` | optional | 담당 의료진 |
| `relatedConditions` | `Ref<C-11>[]` | optional | 관련 질환 |
| `relatedTreatments` | `Ref<C-03>[]` | optional | 관련 시술 |
| `pageRiskLevel` | `RiskLevel` | ✅ | 페이지 단위 기본 위험도 |
| `slotRiskOverrides` | `SlotRiskOverride[]` | optional | 슬롯별 격상 사례 |
| `heroImageUrl` | `URL` | optional | |
| `ogImageUrl` | `URL` | optional | |
| `cta` | `CTAConfig` | optional | 예약·문의 CTA (CT-03) |

**하위 타입**:

#### `ProcessStep`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `order` | `number` | ✅ | 단계 번호 |
| `name` | `string` | ✅ | 단계명 |
| `description` | `Markdown` | ✅ | |
| `durationMinutes` | `number` | optional | |

#### `TreatmentComponent` (v0.4 신규)
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `name` | `string` | ✅ | 구성 요소명 (예: "한약", "지방분해 약침") |
| `type` | `enum {herbal-medicine, pharmacopuncture, electrotherapy, body-composition-test, dietary-counseling, exercise-prescription, lifestyle-counseling, other}` | ✅ | 유형 |
| `description` | `Markdown` | optional | |
| `included` | `boolean` | optional | 패키지 포함 여부 (default true) |

#### `VisitFlowStep` (v0.4 신규)
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `order` | `number` | ✅ | |
| `name` | `string` | ✅ | 단계명 (예: "초진 상담", "체성분 검사") |
| `description` | `Markdown` | optional | |
| `durationMinutes` | `number` | optional | |
| `location` | `enum {clinic, remote, both}` | optional | |

#### `ProgramVariant`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `name` | `string` | ✅ | 변형명 (예: "1개월 집중") |
| `duration` | `string` | ✅ | 기간 |
| `sessionCount` | `string` | optional | 세션 수 |
| `targetSegment` | `string` | optional | 대상 분류 |
| `briefDescription` | `Markdown` | ✅ | |
| `includes` | `string[]` | optional | 포함 항목 |
| `priceRange` | `string` | optional | 가격 범위 (위험도 High 격상) |
| `riskLevelOverride` | `RiskLevel` | optional | 변형 단위 위험도 |

#### `EvidenceNote` (v0.4 신규)
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `label` | `string` | ✅ | 근거 라벨 (예: "한방비만학회지 2022 임상사례") |
| `summary` | `string` | optional | 간략 요약 |
| `url` | `URL` | optional | 외부 검증 링크 (논문·학회) |
| `publishedYear` | `number` | optional | |
| `verifiedBy` | `string` | optional | 검증자·기관 |

#### `SlotRiskOverride`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `slot` | `enum {overview, mechanism, targetAudience, recommendedFor, treatmentComponents, visitFlow, process, duration, sessionCount, programVariants, precautions, aftercare, maintenancePlan, evidenceNotes, cta}` | ✅ | |
| `level` | `RiskLevel` | ✅ | 격상 등급 |
| `reason` | `string` | ✅ | 감사 추적용 |

### C-04. `Article` — 인사이트·블로그 글 (v0.4 컨텍스트 필드 즉시 통합)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `headline` | `string` | ✅ | 1~120자 |
| `summary` | `string` | ✅ | 80~200자 |
| `body` | `Markdown` | ✅ | 최소 1,000자(공백 제외) 권장 — `CONTENT_STANDARDS.md` § 1.3 SoT |
| `author` | `Ref<C-02>` | ✅ | 저자 |
| `coAuthors` | `Ref<C-02>[]` | optional | |
| `authorType` | `enum {clinician, staff, guest, external}` | optional | **(v0.4)** 저자 유형 (default `clinician`) |
| `reviewedBy` | `Ref<C-02>` | optional | **(v0.4)** 의료진 검수자 (E-E-A-T 신호) |
| `reviewedAt` | `Date` | optional | **(v0.4)** 검수 일자 |
| `contentSource` | `enum {original, syndicated, republished, translated}` | optional | **(v0.4)** 콘텐츠 출처 (default `original`) |
| `externalUrl` | `URL` | optional | **(v0.4)** 외부 인용·재게재 시 원본 URL |
| `datePublished` | `Date` | ✅ | 최초 발행일 |
| `dateModified` | `Date` | ✅ | 최종 수정일 |
| `articleType` | `enum {notice, general-medical-info, treatment-explainer, condition-explainer, effect-result-related, review-case, event-price}` | ✅ | 유형 — 위험도 자동 추론 |
| `contentFormat` | `enum {article, video, column}` | ✅ | 형식 (default `article`) |
| `category` | `Ref<C-22>` | ✅ | ArticleCategory |
| `tags` | `string[]` | optional | |
| `readingTimeMinutes` | `number` | optional | 자동 계산 |
| `wordCount` | `number` | optional | 자동 계산 |
| `coverImageUrl` | `URL` | optional | |
| `ogImageUrl` | `URL` | optional | |
| `embeddedMedia` | `EmbeddedMedia[]` | optional | YouTube·외부 인용 |
| `relatedArticles` | `Ref<C-04>[]` | optional | |
| `relatedTreatments` | `Ref<C-03>[]` | optional | |
| `relatedConditions` | `Ref<C-11>[]` | optional | |
| `pageRiskLevel` | `RiskLevel` | ✅ | articleType 자동 추론, 운영자 오버라이드 가능 |
| `inlineRiskFlags` | `enum {includes-effect-claim, includes-pricing, includes-event, includes-before-after, includes-testimonial}[]` | optional | 본문 위험 요소 플래그 |

**ArticleType ↔ 자동 추론 위험도**:

| ArticleType | 자동 위험도 | 운영자 오버라이드 |
|---|:---:|:---:|
| `notice` | Low | ✅ |
| `general-medical-info` | Medium | ✅ |
| `treatment-explainer` | Medium | ✅ |
| `condition-explainer` | Medium | ✅ |
| `effect-result-related` | High | ✅ (낮출 수 없음) |
| `review-case` | High | ✅ (낮출 수 없음) |
| `event-price` | High | ✅ (낮출 수 없음) |

**하위 타입**:

#### `EmbeddedMedia`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `type` | `enum {youtube, vimeo, external-video, external-iframe, citation}` | ✅ | |
| `url` | `URL` | ✅ | |
| `title` | `string` | optional | |
| `caption` | `string` | optional | |
| `durationSeconds` | `number` | optional | |
| `transcriptUrl` | `URL` | optional | 자막·스크립트 (E-E-A-T) |

**컴플라이언스 주의**:
- `contentSource: republished` 또는 `syndicated` 시 원본 권한·출처 표시 의무.
- `reviewedBy` 노출 시 의료진 검수의 권위 신호로 활용 — 단 의학적 정확성 검증 책임.
- `externalUrl`의 외부 콘텐츠 책임 분리 명시 (DM-13).

### C-05. `RiskLevel` (enum) — 위험도 등급

```ts
type RiskLevel = "Low" | "Medium" | "High";
```

**v0.4 변경**: 모든 계약에서 `Ref<C-05>` 대신 **직접 `RiskLevel` 타입 사용** (enum이라 참조 불필요).

> 상세 정의·격상 조건·검수 흐름은 `compliance/RISK_LEVELS.md`.

### C-06. `PageMeta` — 페이지별 메타 데이터

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `title` | `string` | ✅ | 10~70자, `<title>` |
| `description` | `string` | ✅ | 80~160자, `<meta name="description">` |
| `canonical` | `URL` | optional | 미지정 시 자동 생성 |
| `robots` | `string` | optional | 기본 `"index, follow, max-snippet:-1, max-image-preview:large"` |
| `ogType` | `enum {website, article, profile}` | optional | 페이지 타입 자동 (`profile`은 P-004 Doctor Profile 등 인물 페이지 — SEARCH_STANDARDIZATION § 2.2 og:type 매핑 참조) |
| `ogTitle` | `string` | optional | 미지정 시 `title` |
| `ogDescription` | `string` | optional | 미지정 시 `description` |
| `ogImageUrl` | `URL` | optional | 미지정 시 ClinicProfile.ogImageUrl |
| `twitterCard` | `enum {summary, summary_large_image}` | optional | 기본 `summary_large_image` |
| `inLanguage` | `string` | optional | 기본 `"ko-KR"` |
| `noIndex` | `boolean` | optional | 기본 `false` |

> 코드 생성은 `core/SEARCH_STANDARDIZATION.md`.

### C-07. `BrandTokens` — 디자인 토큰 최종값

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `personaMode` | `enum {Premium, Wellness, Professional, Friendly}` | ✅ | 브랜드 페르소나 |
| `colors` | `ColorTokens` | ✅ | 색 토큰 |
| `typography` | `TypographyTokens` | ✅ | 타이포그래피 |
| `spacing` | `SpacingDensity` | ✅ | `tight \| standard \| spacious` |
| `radius` | `RadiusScale` | ✅ | |
| `shadow` | `ShadowScale` | ✅ | |
| `layoutVariants` | `LayoutVariantSelection` | ✅ | 페이지 타입별 변형 선택 |
| `componentVariants` | `ComponentVariantSelection` | ✅ | 컴포넌트 변형 |

> 토큰 허용 값·기본값·예시는 `core/DESIGN_TOKENS.md`.

### C-08. `InstanceManifest` — 버전 고정 명세

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `instanceId` | `Slug` | ✅ | |
| `core` | `VersionSpec` | ✅ | Core 패키지 버전 |
| `presets` | `{name: string, version: VersionSpec}[]` | ✅ | 사용 Preset |
| `features` | `{name: string, version: VersionSpec, enabled: boolean, config?: object}[]` | optional | (v0.10 +) 활성화 Feature Modules. `config`는 Feature별 설정 객체 — 각 Feature 명세 SoT가 정의 (예: `features/compliance-assistant.md` § 2.3) |
| `environment` | `enum {production, staging, preview, development}` | ✅ | 배포 환경 — robots.txt 환경별 분기에 사용 (SEARCH_STANDARDIZATION § 3.3.1) |
| `aiCrawlerPolicy` | `enum {allow, disallowTraining, disallowAll, custom}` | ✅ | **required** — AI 크롤러 정책. 미설정 시 빌드 fail (SEARCH_STANDARDIZATION § 3.2) |
| `aiCrawlerLegalApproved` | `boolean` | conditional | **`aiCrawlerPolicy: allow` 시 `true` 필수 (fail-gate)**. 다른 정책은 권장 |
| `aiCrawlerApprovedBy` | `string` | conditional | **`aiCrawlerPolicy: allow` 시 required** (감사 추적 게이트). 다른 정책은 optional |
| `aiCrawlerApprovedAt` | `Date` | conditional | **`aiCrawlerPolicy: allow` 시 required**. 다른 정책은 optional |
| `robotsOverrides` | `RobotsOverride[]` | optional | user-agent별 merge/replace 룰 (SEARCH_STANDARDIZATION § 3.4) |
| `experimentalAiBots` | `boolean` | optional | 외부 관측 기반·공식 검증 전 user-agent(예: meta-externalagent) 포함 여부. 기본 `false`. `true` 시 robots.txt에 포함 |
| `performanceBudget` | `PerformanceBudget` | optional | Lighthouse budget 임계값 override + critical URL 목록 (SEARCH_STANDARDIZATION § 6.1) |
| `searchConsoleVerification` | `{google?: string, naver?: string, bing?: string}` | optional | 검색 콘솔 verification 메타 코드 (SEARCH_STANDARDIZATION § 7.1) |
| `notificationChannels` | `NotificationChannelsConfig` | optional | (v0.9 +, v0.13 확장) 어드민 알림 채널 활성화·설정 — `admin/REVIEW_WORKFLOW.md` § 9, `features/notifications.md` § 2.3. v0.13에서 email transport·secretRef·rate limit 영역 추가 |
| `adminBaseUrl` | `URL` | conditional | (v0.13 +) 본 인스턴스의 어드민(Control Plane) base URL — 알림 ctaUrl 합성 기준. `features.notifications` 활성 시 required (`features/notifications.md` § 3.3 ctaUrl 자동 합성) |
| `timezone` | `IANATimezone` (예: `"Asia/Seoul"`) | conditional | (v0.13 +) 인스턴스 운영 기준 timezone — digest 스케줄·SLA 영업일 산정에 사용. `features.notifications`·SLA 운영 인스턴스에서 required. DST 처리는 IANA 기준 따름 |
| `holidayCalendar` | `{region: ISO3166Alpha2, source?: "package-embedded" \| "external-api", externalApiRef?: string}` | conditional | (v0.13 +) 인스턴스 공휴일 캘린더 — CT-02 BusinessHours의 `dayOfWeek="PublicHoliday"` 매칭 시 사용. 한국 인스턴스는 `region: "KR"`. `source` 기본 `package-embedded` (본 Feature 패키지에 한국 공휴일 데이터 embed, 국가별 확장 시 추가). `clientApproverBusinessHoursAware=true`인 인스턴스에서 required (`features/notifications.md` § 8.4) |
| `analyticsConfig` | `AnalyticsConfig` | conditional | (v0.14 +) 외부 분석 도구 자격증명·사이트 식별자 SoT. `features.analytics-reporting` 활성 시 required. **경계 분리**: 본 객체는 source 자격증명·사이트 식별자만, 동작 옵션(스케줄·보존·리포트 템플릿·임계 측정·rate limit)은 `features[name="analytics-reporting"].config`에 둠 (`features/analytics-reporting.md` § 2.3) |
| `analyticsPolicyVersion` | `string` | conditional | (v0.14 +) `features.analytics-reporting` 매트릭스·정책 SoT 버전 (예: `"ar-2026-05-14"`). `features.analytics-reporting` 활성 시 required. notifications의 `notificationPolicyVersion` 패턴 동일 — 패키지가 버전별 병렬 보관 + manifest opt-in (`features/analytics-reporting.md` § 1.1·§ 4.2 동등) |
| `searchVisibilityConfig` | `SearchVisibilityConfig` | conditional | (v0.16 +) 검색 가시성 모니터링 자격증명·식별자 SoT. `features.search-visibility` 활성 시 required. **경계 분리**: 자격증명·식별자만, 동작 옵션은 `features[name="search-visibility"].config` (`features/search-visibility.md` § 2.3) |
| `searchVisibilityPolicyVersion` | `string` | conditional | (v0.16 +) `features.search-visibility` 정책 SoT 버전. analyticsPolicyVersion·notificationPolicyVersion 동일 패턴 |
| `keywordMonitoringConfig` | `KeywordMonitoringConfig` | conditional | (v0.17 +) keyword-monitoring 자격증명·식별자 SoT. `features.keyword-monitoring` 활성 시 required. 동작 옵션은 `features[name="keyword-monitoring"].config` SoT (`features/keyword-monitoring.md` § 2.3) |
| `keywordMonitoringPolicyVersion` | `string` | conditional | (v0.17 +) `features.keyword-monitoring` 정책 SoT 버전. notifications·analytics·search-visibility 동일 패턴 |
| `assetIngestionConfig` | `AssetIngestionConfig` | conditional | (v0.18 +) asset-ingestion 자격증명·식별자 SoT. `features.asset-ingestion` 활성 시 required. 동작 옵션은 `features[name="asset-ingestion"].config` (`features/asset-ingestion.md` § 2.3) |
| `assetIngestionPolicyVersion` | `string` | conditional | (v0.18 +) `features.asset-ingestion` 정책 SoT 버전. 5 Feature policyVersion 동일 패턴 |
| `crmSyncConfig` | `CrmSyncConfig` | conditional | (v0.19 +) CRM·환자관리 시스템 연동 자격증명·DPA·동의 증빙 SoT. `features.crm-sync` 활성 시 required. 동작 옵션은 `features[name="crm-sync"].config` (`features/crm-sync.md` § 2.3) |
| `crmSyncPolicyVersion` | `string` | conditional | (v0.19 +) `features.crm-sync` 정책 SoT 버전. 7 Feature policyVersion 동일 패턴 |
| `contentMigrationConfig` | `ContentMigrationConfig` | conditional | (v0.21 +) 솔루션 내부 콘텐츠 마이그레이션 plan 정의·legal 승인·read-only window 정책 SoT. `features.content-migration` 활성 시 required. 동작 옵션은 `features[name="content-migration"].config` (`features/content-migration.md` § 2.3) |
| `contentMigrationPolicyVersion` | `string` | conditional | (v0.21 +) `features.content-migration` 정책 SoT 버전. 8 Feature policyVersion 동일 패턴 |
| `complianceAssistantExemptApproval` | `{approvedBy: string, approvedAt: Date, exemptionAgreementUrl: URL, reason: string}` | optional | (v0.12 +) compliance-assistant 비활성 예외 승인 기록 — `features/compliance-assistant.md` § 10.3. 본 필드 부재 시 의료기관 인스턴스의 본 Feature 비활성은 빌드 fail |
| `lastReleaseApprovedBy` | `string` | optional | 마지막 승인자 |
| `lastReleaseApprovedAt` | `Date` | optional | |

#### `RobotsOverride` (v0.11 신규)
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `userAgent` | `string` | ✅ | 대상 user-agent (예: `GPTBot`) |
| `action` | `enum {merge, replace}` | ✅ | 기존 Core 룰에 merge할지 replace할지 |
| `allow` | `string[]` | optional | Allow 경로 목록 |
| `disallow` | `string[]` | optional | Disallow 경로 목록 |
| `note` | `string` | optional | 운영자 메모 |

#### `PerformanceBudget` (v0.11 신규, v0.12 확장)
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `criticalUrls` | `string[]` | optional | 매 빌드 측정 critical URL. Home·핵심 시술 페이지 등 |
| `lcpMsOverride` | `number` | optional | LCP budget 강화 override (Core 기본 2500 이하만 허용) |
| `clsOverride` | `number` | optional | CLS budget 강화 override |
| `tbtMsOverride` | `number` | optional | |
| `bundleSizeKbOverride` | `number` | optional | |
| `imageWeightKbOverride` | `number` | optional | (v0.12) Image weight per page (Core 기본 1500) 강화 override |
| `lighthousePerformanceMinOverride` | `number` | optional | Performance score 강화 override |
| `lighthouseSeoMinOverride` | `number` | optional | (v0.12) SEO score 강화 override (Core 기본 90) |
| `lighthouseAccessibilityMinOverride` | `number` | optional | (v0.12) Accessibility score 강화 override (Core 기본 90) |

#### `NotificationChannelsConfig` (v0.13 확장)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `email` | `{enabled: boolean, transport: "smtp" \| "ses" \| "mailgun", secretRef: string, sender: string, replyTo?: string, rateLimitPerHour?: number}` | optional | 이메일 활성화·트랜스포트·발신자·시간당 발송 한도. `secretRef`는 API 키 또는 SMTP 자격 (예: `secretRef://EMAIL_TRANSPORT_KEY`) |
| `slack` | `{enabled: boolean, webhookUrlSecretRef: string, rateLimitPerHour?: number}` | optional | Slack Incoming Webhook URL은 항상 secretRef 참조 (직접 URL 금지 — 보안 정책) |
| `inApp` | `{enabled: boolean}` | optional | 어드민 DB 내 NotificationInbox 사용 (`features/notifications.md` § 5.3·§ 14) |

> 본 타입은 `features/notifications.md` config(`features[name="notifications"].config`)와 경계 분리: **채널 활성화·트랜스포트 자격은 본 객체**, **digest 스케줄·dedupe 윈도우·retry 정책 등 동작 옵션은 `features.notifications.config`** (notifications.md § 2.3).

#### `VersionSpec`
SemVer 형식 (`"1.4.2"`).

#### `IANATimezone` (v0.13 신규)

IANA Time Zone Database 식별자 (`Asia/Seoul`, `America/Los_Angeles` 등). DST 자동 처리.

#### `AnalyticsConfig` (v0.14 신규)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `sources.gsc` | `{enabled: boolean, serviceAccountSecretRef: string, propertyUrl: string}` | optional | Google Search Console |
| `sources.naverSearchAdvisor` | `{enabled: boolean, apiKeySecretRef: string, siteUrl: URL}` | optional | 네이버 서치어드바이저 |
| `sources.ga4` | `{enabled: boolean, propertyId: string, serviceAccountSecretRef: string}` | optional | Google Analytics 4 |
| `sources.rum` | `{enabled: boolean, endpoint: string}` | optional | 자체 RUM (SEARCH_STANDARDIZATION § 6.3 PerformanceEvent·PageViewEvent·ConversionEvent 수신) |

> 동작 옵션(`collectionSchedule`·`retentionDays`·`reportTemplates`·`mediaThresholdMeasurement`·`rateLimit`)은 `features[name="analytics-reporting"].config` SoT (`features/analytics-reporting.md` § 2.3).

#### `SearchVisibilityConfig` (v0.16 신규)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `serpCrawler` | `{enabled: boolean, targetSearchEngines: ("naver"\|"google")[], siteDomain: string, userAgent: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedScope?: SerpCrawlerApprovedScope}` | optional | 자체 SERP 크롤러. `enabled=true` + (`legalApproved !== true` 또는 `legalApprovedBy`·`legalApprovedAt` 누락) → 빌드 fail (SV2-01 정정 — 자동 크롤링 ToS 위험 회피 — `features/search-visibility.md` § 5.2) |
| `backlinkSource` | `{enabled: boolean, provider: "ahrefs"\|"semrush"\|"moz"\|"self-crawl", apiKeySecretRef: string, siteDomain: string}` | optional | 외부 백링크 도구 |

> 동작 옵션(`monitoringSchedule`·`signals`·`anomalyHysteresis`·`retentionDays` 등)은 `features[name="search-visibility"].config` SoT.

#### `KeywordMonitoringConfig` (v0.17 신규)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `serpCrawler` | `{enabled: boolean, ...}` | optional | **v1.0: `enabled=true` → 빌드 fail (regardless of legalApproved)** — `features/keyword-monitoring.md` § 5.2 v1.0 미지원 정책 (KM2-01). v1.x 활성화 시 search-visibility SerpCrawlerApprovedScope 게이트 패턴 재사용 (KM-14 후속 결정 후). v1.0 manifest validator는 enabled=true 단독으로 fail 처리, legalApproved/승인자/시각 검증은 v1.x 활성 시점부터 적용 |

> 동작 옵션(`monitoringSchedule`·`signals`·`anomalyHysteresis`·`keywordTargetSource`·`retentionDays` 등)은 `features[name="keyword-monitoring"].config` SoT (`features/keyword-monitoring.md` § 2.3).

#### `AssetIngestionConfig` (v0.18 신규)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `sources.webCrawl` | `{enabled: boolean, targetDomains: string[], userAgent: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedScope?: AssetIngestionApprovedScope}` | optional | 외부 웹사이트 크롤링. `enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedScope` 누락) → 빌드 fail (F-11) |
| `sources.snsApi.<platform>` | `{enabled: boolean, apiKeySecretRef: string, blogId/accountId: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedAccountIds: string[], allowedContentTypes: string[], consentEvidenceRef?: string}` | optional | platform=naverBlog·instagram·facebook·youtube. `enabled=true` + 법무 게이트 누락 → 빌드 fail (F-12) |
| `sources.manualUpload` | `{enabled: boolean, maxFileSizeMb: number, allowedMimeTypes: string[]}` | optional | 어드민 UI 업로드 |
| `sources.csvImport` | `{enabled: boolean, maxRowsPerImport: number}` | optional | bulk CSV import |

#### `AssetIngestionApprovedScope` (v0.18 신규 — F-10)

SerpCrawlerApprovedScope의 SERP 특화 필드(searchEngines·locales·devices·geo)를 제거하고 자산 수집 특화:

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `allowedDomains` | `string[]` | ✅ | 허용 도메인 목록 (빈 배열 → build fail) |
| `allowedPathPrefixes` | `string[]` | optional | path 화이트리스트 |
| `maxPagesPerCrawl` | `integer` | ✅ | 한 번의 크롤링 최대 페이지 수 |
| `maxAssetSizeMb` | `integer` | ✅ | 단일 asset 최대 크기 |
| `artifactRetentionDaysMax` | `integer` | ✅ | retention 상한 |
| `allowLoginState` | `boolean` | optional | 누락 시 false 자동. true 명시는 법무 승인 필요 |
| `allowCaptchaBypass` | `boolean` | optional | 누락 시 false. true는 build fail (운영상 금지) |

> 동작 옵션(`mode`·`ingestionSchedule`·`tagging`·`review`·`pii`·`promote`·`retentionDays`·`blobStorage` 등)은 `features[name="asset-ingestion"].config` SoT (`features/asset-ingestion.md` § 2.3).

#### `CrmSyncConfig` (v0.19 신규)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `integrations` | `CrmIntegrationEntry[]` | ✅ | multiple CRM 연동 지원 (예: 본원 Salesforce + 분원 HubSpot) |

#### `CrmIntegrationEntry` (v0.19 신규)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `id` | string | ✅ | integration 식별자 (instance scope unique) |
| `provider` | enum (`salesforce`·`hubspot`·`generic-rest-api`) | ✅ | **v1.0은 3종만**. `korean-emr`은 v1.x patch (CS-13). 해당 enum 값 build fail |
| `apiKeySecretRef` | string | ✅ | provider별 API key/OAuth client credentials |
| `apiUrl` | URL | ✅ | provider endpoint |
| `webhookSecret` | string | conditional | bi-directional 모드 시 required (signature 검증용) |
| `credentialExpiresAt` | Date | optional | OAuth token 등 만료 시각. null = 만료 없음 |
| `legalApproved` | boolean | ✅ | **DPA(Data Processing Agreement) 체결 완료** — true 필수 (CS1-12) |
| `legalApprovedBy` | string | ✅ | |
| `legalApprovedAt` | Date | ✅ | |
| `dpaEvidenceRef` | string | ✅ | DPA 계약 증빙 secretRef. **`patientConsentEvidenceRef`와 분리** (CS1-12) — DPA는 provider·기관 계약 증빙. 환자 단위 동의 증빙은 별도 (v1.0은 record-level 미저장 — CS-07 후속) |
| `genericRestApiAdapter` | `GenericRestApiAdapterConfig` | conditional | (v0.20 +) `provider="generic-rest-api"` 시 ✅. **5필드** (CS3-13·CS5-01): `webhookSignatureHeader`·`webhookTimestampHeader`·`webhookEventIdHeader`·`canonicalStringFormat`·`versionTokenJsonPath`. 누락 시 build fail (`features/crm-sync.md` § 10.1). `versionTokenType: 'epoch-ms'\|'integer'\|'string'` enum도 conditional (CS5-01) |

> 동작 옵션(`mode`·`syncSchedule`·`entities`·`fieldMappingPolicyVersion`·`retryQueue`·`credentialRotation`·`pii`·`retentionDays` 등)은 `features[name="crm-sync"].config` SoT (`features/crm-sync.md` § 2.3). **CrmCredentialVersion**(credential rotation 상태 머신·secretVersionId) 등 admin DB entity는 `features/crm-sync.md` § 13 SoT. manifest는 `apiKeySecretRef` 등 secretRef만 보유 — register/rotate 시 admin DB materialization (CS3-13).

#### `ContentMigrationConfig` (v0.21 신규 — CM1-03)

솔루션 내부 콘텐츠 마이그레이션 plan 정의·legal 승인·read-only window 정책. 동작 옵션(`execution`·`retry`·`rollback`·`dryRun`·`retentionDays`·`purgeWorker`) 등은 `features[name="content-migration"].config` SoT (`features/content-migration.md` § 2.3).

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `featureLegalApproved` | boolean | ✅ | (CM3-08 — rename from `legalApproved`) content-migration **Feature 자체** legal 승인 — plan-level `ContentMigrationLegalApproval`(admin DB)과 분리 |
| `featureLegalApprovedBy`·`featureLegalApprovedAt` | string·Date | ✅ | |
| `defaultMode` | enum (`dry-run`·`apply`) | ✅ | apply는 expectedDryRunReportId CAS 통과해야 진입 |
| `approvalRequired` | `ContentMigrationApprovalMap` | ✅ | plan kind별 필수 승인자 역할 (super-admin·legal-reviewer 조합) |
| `legalImpactClassifierRef` | string | ✅ | legalImpactClassifier 구현 모듈 ref — 8 class 자동 분류 (PII·LegalDocument·ReviewPolicy·PricingPage·전후사진·후기·priorReviewRequired·cross-entity copy). LLM 분류 v1.0 금지 — deterministic rule SoT (CM2-03) |
| `piiFieldCatalogRef` | string | ✅ | (CM3-05·CM3-18 +) DATA_MODEL Core entity별 PII field catalog 모듈 ref — classifier input SoT |
| `entityFieldProjectionCatalogRef` | string | ✅ | (CM3-05 +) targetEntityTypes·readSet/writeSet projection catalog ref |

> ContentMigrationPlan·ContentMigrationRun·ContentMigrationStepResult 등 admin DB entity는 `features/content-migration.md` § 9 SoT.

#### `SerpCrawlerApprovedScope` (v0.16 신규 — SV2-02 구조화)

법무가 승인한 SERP 크롤러 권한 범위. crawler 실행 파라미터가 본 범위 밖이면 `skipped-legal-out-of-scope` 처리:

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `searchEngines` | `("naver"\|"google")[]` | ✅ | 허용 검색 엔진 — 본 배열 외 호출 차단 |
| `locales` | `string[]` | ✅ | 예: `["ko-KR"]` — 허용 로케일 |
| `devices` | `("desktop"\|"mobile"\|"tablet")[]` | ✅ | 허용 device |
| `geo` | `string[]` | optional | ISO3166 alpha-2 — 허용 지역 |
| `allowLoginState` | `boolean` | optional | 로그인 상태 크롤링 허용 여부. **누락 시 false로 자동 materialize** (SV3-03 — 안전 기본). 명시 true는 법무 승인 필요 |
| `allowCaptchaBypass` | `boolean` | optional | captcha 우회 허용. 누락 시 false 자동. **명시 true 금지** (build fail — 운영상 captcha 우회는 ToS 위반) |
| `artifactRetentionDaysMax` | `integer` | ✅ | artifact 최대 보존 일수 (config retentionDays.crawlerArtifact가 본 값 초과 시 build fail) |
| `allowedPaths` | `string[]` | optional | 크롤링 허용 path/도메인 패턴 |

### C-09. `FeatureModuleConfig` — Feature Module 설정

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `moduleName` | `string` | ✅ | 모듈 식별자 |
| `enabled` | `boolean` | ✅ | |
| `config` | `object` | optional | 모듈별 설정 스키마 (각 모듈 명세) |

### C-10. `ComplianceRecord` — 컴플라이언스 게이트 통과 기록

**마스터**: 어드민 DB 원본 + Git 사본 (가벼운 빌드 참조 메타)

#### 어드민 DB 원본 (풀데이터)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `instanceId` | `Slug` | ✅ | |
| `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature}` | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1) |
| `featureContentType` | `string` (`feature:<slug>` 형식, 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$`) | conditional | `contentType="Feature"` 시 required — Feature 콘텐츠 세부 식별. 예: `feature:self-test` |
| `contentRef` | `string` | ✅ | 대상 콘텐츠 `@id` |
| `pageRiskLevel` | `RiskLevel` | ✅ | 최종 등급 |
| `articleType` | `string` | optional | (Article인 경우) |
| `inlineRiskFlags` | `string[]` | optional | |
| `autoCheckResult` | `AutoCheckResult` | ✅ | compliance-assistant 결과 (`features/compliance-assistant.md` § 5.5 SoT) — `ComplianceCheckResult` 본체 + 선택 영역 `llmAssist: { invocations[]: { promptVersion, modelId, requestId, requestedAt, response: LlmAssistResult, costTokens } }` 누적 저장. v0.11 +(CA-08 해소) |
| `peerReviewer` | `string` | ✅ | 동료 검수자 ID |
| `peerReviewedAt` | `Date` | ✅ | |
| `physicianApprover` | `string` | optional (Medium/High required) | 의료진 승인자 |
| `physicianApprovedAt` | `Date` | optional | |
| `clientApprover` | `string` | optional | |
| `clientApprovedAt` | `Date` | optional | |
| `legalCounsel` | `string` | optional (**LegalDocument: required**, High recommended) | LegalDocument 발행 시 필수 — 위험도 Low 예외 룰. 어드민 발행 게이트가 누락 시 차단 |
| `legalCounselAt` | `Date` | optional (**LegalDocument: required**) | LegalDocument 발행 시 필수 |
| `priorReviewRequired` | `boolean` | ✅ | 사전심의 필요 |
| `priorReviewSubmissionId` | `string` | optional | |
| `priorReviewPassed` | `boolean` | optional | 사전심의 통과 여부 (Git 사본과 정합) |
| `attachments` | `Attachment[]` | optional | 증빙 파일 |
| `staleFlags` | `StaleFlags` | optional | (v0.7 +) 역할별 재검수 필요 상태 — `RISK_LEVELS.md` § 4 만료 정책에 따라 갱신. **published 이후에도 갱신 허용** (record 불변성의 예외 영역 — `admin/REVIEW_WORKFLOW.md` § 5.4) |
| `warningAcknowledgements` | `WarningAcknowledgement[]` | optional | (v0.8 +) warning finding 처리 기록 — `admin/REVIEW_WORKFLOW.md` § 3.1.1 |
| `publishedAt` | `Date` | ✅ when `recordPhase="published"`, optional when `recordPhase="pre-publish"` | (v0.8 +) recordPhase별 required 분기 — 발행 전 누적 record는 본 필드 미기록 허용 |
| `publishedBy` | `string` | ✅ when `recordPhase="published"`, optional when `recordPhase="pre-publish"` | (v0.8 +) 위와 동일 |
| `recordPhase` | `enum {pre-publish, published}` | ✅ | (v0.8 +) 발행 생명주기 단계 (`admin/REVIEW_WORKFLOW.md` § 5.2). `pre-publish`는 검수 중 누적 record, `published`는 발행 완료 후 불변 record |
| `recordVersion` | `integer` (1~) | ✅ | (v0.8 +) 동일 contentRef의 record 버전 — 재검수 사이클 후 새 record 생성 시 1 증가. 발행 history 추적 (`admin/REVIEW_WORKFLOW.md` § 5.4) |
| `mediaThresholdAssessment` | `MediaThresholdAssessment` | optional | (v0.14 +) 의료법 일평균 이용자 10만 매체 분류 **법무 확정 판정**. **`calendarPolicy="previous-3-months-calendar"`만 본 슬롯에 저장** (rolling-90 운영값 저장 금지 — v0.15 정정). legal 검수자가 채움. priorReviewRequired 산정 근거 |
| `mediaThresholdOperationalInput` | `MediaThresholdAssessment` | optional | (v0.15 +) `features/analytics-reporting.md`이 제공한 rolling-90 operational snapshot — pre-publish record의 legal 판정 **입력 자료**. legal 검수자 calendar 산정 시 참고용. **published record에는 본 슬롯이 calendar로 대체되지 않고 그대로 보존됨** (감사 추적용) |

#### `MediaThresholdAssessment` (v0.14 +)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `assessmentBasisDate` | `Date` | ✅ | 법정 기준일 (예: 전년도 말 또는 측정 기준일) |
| `windowStart` | `Date` | ✅ | 측정 윈도우 시작 (시행령 제24조 직전 3개월 또는 운영 측정 기간) |
| `windowEnd` | `Date` | ✅ | |
| `rollingAverageDailyUsers` | `number` | ✅ | 윈도우 내 일평균 unique users (analytics-reporting § 8.2 측정값) |
| `thresholdReached` | `boolean` | ✅ | rollingAverage ≥ 10만 (시행령 제24조 기준) |
| `primarySource` | `enum {gsc, naver-search-advisor, ga4, rum, composite}` | ✅ | 측정 출처 — analytics-reporting `config.mediaThresholdMeasurement.primarySource` |
| `sourceCompleteness` | `number` (0~1) | ✅ | 측정 데이터 완성도 (예: 0.95 = 5% 누락) — incomplete date 비율 반영 |
| `timezone` | `IANATimezone` | ✅ | 측정 기준 timezone |
| `calendarPolicy` | `enum {rolling-90-days, previous-3-months-calendar}` | ✅ | rolling은 운영 조기경보, calendar는 법정 산정 |
| `botFilteringPolicy` | `string` | ✅ | bot 필터 정책 식별자 (analytics-reporting 버전 또는 외부 도구 자체 필터) |
| `legalBasisNote` | `Markdown` | optional | 법무 의견서 본문 (법정 산정의 경우 필수 권장 — `legalCounsel`·`legalCounselAt`과 함께) |

> `mediaThresholdAssessment`는 운영 측정값(`features/analytics-reporting.md` § 14.5 DailyUserMeasurement)과 별개로 ComplianceRecord에 **확정 판정**을 기록. 운영 측정은 매일 갱신되지만 본 슬롯은 발행 시점·법무 판정 시점에 snapshot으로 고정.

#### `WarningAcknowledgement` (v0.8 +)
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `findingId` | `string` | ✅ | ComplianceCheckResult.findings[].ruleId 참조 |
| `action` | `enum {acknowledged, resolved}` | ✅ | 인정 또는 정정 |
| `operatorId` | `string` | ✅ | operator 사용자 ID |
| `timestamp` | `Date` | ✅ | |
| `note` | `string` | optional | 메모 |

#### `StaleFlags`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `medical` | `boolean` | optional | `true`면 physicianApprover 재승인 필요 |
| `legal` | `boolean` | optional | `true`면 legalCounsel 재검수 필요 (의료법 개정·고리스크 변경 등) |
| `operator` | `boolean` | optional | `true`면 peerReviewer 재검수 필요 |
| `client` | `boolean` | optional | `true`면 clientApprover 재승인 필요 |
| `triggeredBy` | `string` | optional | stale 유발 원인 (예: `medical-law-revision-2026-Q3`, `content-change`, `pricing-change`) |
| `triggeredAt` | `Date` | optional | |

#### Git 사본 (경량 빌드 참조)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `pageRiskLevel` | `RiskLevel` | ✅ | 렌더링 시 참조 |
| `articleType` | `string` | optional | |
| `priorReviewPassed` | `boolean` | optional | |
| `publishedAt` | `Date` | ✅ | schema datePublished |
| `lastModifiedAt` | `Date` | ✅ | schema dateModified |

### C-16. `LegalDocument` — 정책·약관 (M0 자동 생성)

**목적**: 개인정보처리방침·이용약관·비급여 진료 안내 등 법적 정책 문서. **M0 출시 게이트**. Core 표준 템플릿 + ClinicProfile + LocationProfile(main) 변수 자동 치환으로 생성. 법무 검토 필수 (ComplianceRecord.legalCounsel/legalCounselAt required).

**참조 페이지 타입**: P-013
**참조 Schema**: 일반 `WebPage` (검색 노출 우선순위 낮음)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | 정책 종류별 slug (예: `"privacy"`, `"terms"`, `"non-covered"`) |
| `documentType` | `enum {privacy, terms, non-covered, refund, complaint, cookie, other}` | ✅ | 정책 종류 |
| `title` | `string` | ✅ | 정책 제목 (예: "개인정보처리방침") |
| `body` | `Markdown` | ✅ | 본문 — Core 표준 템플릿 기반 + 변수 치환 (`{{clinic.*}}` + `{{location.main.*}}`) 또는 수동 작성 |
| `autoGenerated` | `boolean` | optional | Core 표준 템플릿 사용 여부 (default `true`) |
| `templateVersion` | `string` | optional | Core 템플릿 버전 (autoGenerated=true 시) — `"privacy@1.0.0"` 형태 |
| `effectiveDate` | `Date` | ✅ | 시행일 |
| `lastRevisedDate` | `Date` | optional | 최종 개정일 |
| `revisions` | `LegalDocumentRevision[]` | optional | 개정 이력 |
| `contactPerson` | `string` | optional | 개인정보 보호 책임자 등 |
| `contactEmail` | `Email` | optional | 정책 문의 채널 |

**하위 타입**:

#### `LegalDocumentRevision`
| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `date` | `Date` | ✅ | 개정일 |
| `summary` | `string` | ✅ | 개정 내용 요약 |
| `previousVersionUrl` | `URL` | optional | 이전 버전 보관 URL |

**컴플라이언스 룰**:
- 발행 시 `ComplianceRecord(contentType=LegalDocument, legalCounsel=*, legalCounselAt=*)` 필수 — 위험도 Low 예외 게이트 (§ 4 C-10 참조).
- 표준 템플릿 사용 시에도 클라이언트별 변수 정확성 (사업자번호·연락처·시행일·법인명) 검증.

### C-21. `LocationProfile` — 지점 정체성 (위치·시간·연락 마스터)

**SoT**: 모든 위치·전화·이메일·진료시간 정보의 마스터. 단지점은 `slug=main` 1개 인스턴스 필수.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | `"main"` 또는 지점 식별자 |
| `name` | `string` | ✅ | 단지점은 본원명, 다지점은 지점명 |
| `parentClinic` | `Ref<C-01>` | ✅ | 본원 ClinicProfile |
| `branchDescription` | `string` | optional | 50~200자 |
| `address` | `Address` | ✅ | 지점 주소 |
| `geo` | `GeoCoordinates` | optional | |
| `telephone` | `Phone` | ✅ | 지점 직통 |
| `fax` | `Phone` | optional | |
| `email` | `Email` | optional | 지점 이메일 |
| `businessHours` | `BusinessHours` | ✅ | 진료시간·접수·점심·휴진 (CT-02) |
| `reservationChannels` | `CTAConfig[]` | optional | 지점 예약·상담 채널 (CT-03) |
| `representativeDoctors` | `Ref<C-02>[]` | optional | 대표 원장 (1명 이상 가능) |
| `doctorsAtLocation` | `Ref<C-02>[]` | optional | 지점 소속 의료진 |
| `availableTreatments` | `Ref<C-03>[]` | optional | 지점 제공 시술 |
| `images` | `URL[]` | optional | |
| `transportInfo` | `Markdown` | optional | |
| `parkingInfo` | `Markdown` | optional | |
| `openingDate` | `Date` | optional | 지점 개원일 |
| `medicalLicenseNumber` | `string` | optional | 지점별 별도 |
| `branchCode` | `string` | optional | |
| `featuredChannelId` | `Slug` | optional | **(v0.6)** `reservationChannels[]` 중 강조 채널 1개의 `@id` 참조. 빌드 시 매칭 안 되면 무시 |

> v0.4 → v0.6 강조 채널 표기 변천:
> - v0.4 이전: `featuredCta: Ref<CTAConfig>` (표기 규약 위반 — `Ref<C-NN>`은 C 계약만)
> - v0.5: `CTAConfig.isFeatured: boolean` (객체에 컨텍스트 의존 의미 — 재사용 시 누수 위험)
> - **v0.6 (현재)**: `LocationProfile.featuredChannelId: Slug` — **컨테이너에 두기**. CTAConfig는 컨텍스트 무관 데이터로 유지. reservationChannels[] 중 1개 채널의 @id 참조

> **단지점 자동 생성 규칙** (PAGE_TYPES.md § 3 P-014 참조): 어드민이 ClinicProfile 입력 단계의 위치·연락·시간 입력값으로부터 `LocationProfile(slug=main)`을 자동 생성. M0에 별도 화면 추가 없음.

### C-22. `ArticleCategory` — Article Pillar 분류

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | |
| `name` | `string` | ✅ | 1~50자 |
| `description` | `string` | optional | 80~200자 |
| `pillar` | `string` | optional | 상위 Pillar |
| `parentCategory` | `Ref<C-22>` | optional | 계층 구조 시 |
| `slug` | `Slug` | ✅ | URL용 (보통 `@id`와 동일) |
| `coverImageUrl` | `URL` | optional | |
| `seoMeta` | `Ref<C-06>` | optional | 카테고리 페이지 PageMeta |
| `displayOrder` | `number` | optional | |
| `articleTypeDefault` | `string` | optional | 기본 ArticleType (작성 시 자동 추천) |

---

## 5. M0 외 계약 — 간략 명세 (후속 풀명세 예정)

### C-11. `MedicalConditionPage`
필드: `name`, `definition`, `symptoms[]`, `causes[]`, `diagnosis`, `treatmentOptions`, `prevention`, `relatedTreatments[]`, `relatedDoctors[]`, `pageRiskLevel` (default Medium). Schema: `MedicalCondition`.

### C-12. `FAQ`
필드: `question`, `answer` (Markdown), `category`, `riskLevel` (답변 단위), `relatedTreatment?`, `relatedCondition?`. Schema: `FAQPage.mainEntity.Question`.

### C-13. `ReviewPolicy`
필드: `enabled`, `displayFormat`, `requireAnonymization`, `effectClaimAllowed`, `beforeAfterPhotoAllowed`, `celebrityMentionAllowed`, `disclaimerText`. **의료광고법 신중 필요.**

### C-14. `MedicalSpecialty`
필드: `@id`, `name`, `description`, `parentSpecialty?`. Preset 1차 정의.

### C-15. `SchemaInput`
JSON-LD 생성기 런타임 인터페이스. 다른 계약들로부터 정규화. 상세 → `SCHEMA_MAPPING.md`.

### C-17. `PricingPage`
필드: `items[]` (`{name, priceRange, conditions, isNonCovered}`), `paymentPolicy`, `refundPolicy`, `disclaimerText`. **High 위험도.**

### C-18. `FacilitiesPage`
필드: `categories[]` (`{name, items[], photos[]}`), `hygieneNote`.

### C-19. `NewsItem`
필드: `headline`, `body`, `category` (enum), `publishedDate`, `expirationDate?`, `riskLevel`. **event-price 카테고리는 High.**

### C-20. `ReservationPage`
필드: `channels[]` (CTAConfig[]), `bookingHours`, `preparationNotes`, `changeCancellationPolicy`, `emergencyGuidance?`.

### C-23. `AdminUser` — 어드민 사용자 (v0.13 신규)

**마스터**: 어드민 DB 원본 (Git 사본 없음 — Control Plane 전용). `features/notifications.md` 수신자 산정·`admin/REVIEW_WORKFLOW.md` § 11 권한 평가의 SoT.

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `@id` | `Slug` | ✅ | UUID 또는 인스턴스 고유 식별자 |
| `email` | `string` | ✅ | 로그인·이메일 알림 발송 주소 |
| `displayName` | `string` | ✅ | 어드민 UI 표시명 |
| `role` | `AdminUserRole` (단 `system` 제외) | ✅ | `admin/REVIEW_WORKFLOW.md` § 11.1 enum 6종 중 실제 사용자 역할 5종(`super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver`). **`system`은 audit log actorRole 표기 전용** — AdminUser DB row 미생성, 로그인 불가. C-23.`role` 및 `instanceMemberships[].role`에는 저장 금지 |
| `approverRoleEligibility` | `ApproverRole[]` | optional | 사용자가 승인할 수 있는 검수 역할(`operator`·`medical`·`legal`·`client`) — § 11.2 자격 검증 통과 결과 누적 |
| `eligibilityEvidence` | `Array<{role: ApproverRole, doctorProfileRef?: Ref<C-02>, legalCounselRef?: string, clientDelegationRef?: string, verifiedAt: Date, verifiedBy: string}>` | optional | 자격 인증 근거 — medical은 DoctorProfile·credentials[], legal/client는 후속 데이터 모델(RL-04/RL-05) |
| `slackUserId` | `string` | optional | Slack workspace 사용자 ID (`<@U12345>` 형식 mention용). 미보유 시 Slack 발송은 broadcast만 |
| `timezone` | `IANATimezone` | optional | 사용자 timezone — **quietHours 기준에만 사용** (digest 발송 시각은 InstanceManifest.timezone 고정 — `features/notifications.md` § 8.1). 미지정 시 InstanceManifest.timezone fallback |
| `notificationPreferences` | `NotificationPreferences` | optional | 사용자별 채널·digest·quietHours 설정 (§ C-23 하위 타입) |
| `instanceMemberships` | `Array<{instanceId: Slug, role: AdminUserRole, joinedAt: Date}>` | ✅ | 사용자가 접근 가능한 인스턴스 목록 (multi-tenant) |
| `active` | `boolean` | ✅ | 비활성화 시 모든 알림 발송 대상 제외 + 로그인 차단 |
| `lastLoginAt` | `Date` | optional | |
| `createdAt` | `Date` | ✅ | |

#### `NotificationPreferences` (C-23 하위 타입)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `channels` | `{email: boolean, slack: boolean, inApp: boolean}` | ✅ | 사용자별 채널 활성화. `mandatory` criticality 이벤트는 본 설정 중 **opt-out만 우회**하고 인스턴스 채널 비활성은 우회하지 않음(`features/notifications.md` § 4.1 필터 순서) |
| `digestOptOut` | `boolean` | optional | digest 발송 거부 — 즉시 발송만 수신. critical/mandatory 이벤트에는 영향 없음 |
| `quietHours` | `{start: "HH:MM", end: "HH:MM", timezone?: IANATimezone}` | optional | 보류 시간. `timezone` 우선순위: `quietHours.timezone > AdminUser.timezone > InstanceManifest.timezone`. `critical` 이벤트는 quietHoursPolicy=bypass로 우회 |
| `suppression` | `{email?: EmailSuppressionState, slack?: ChannelSuppressionState}` | optional | provider 장애·hard bounce 자동 처리 상태 (§ C-23 하위 타입). `active=false` 로그인 차단과 분리 — suppression은 채널별 발송만 차단 |

#### `EmailSuppressionState`·`ChannelSuppressionState` (C-23 하위 타입)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `state` | `enum {active, soft-suppressed, hard-suppressed}` | ✅ | `soft-suppressed`는 transient 누적 임계 도달 시 일시 보류(자동 해제 — autoReleaseAt 도달 시 worker가 active 복귀), `hard-suppressed`는 hard bounce·spam complaint 등 영구 차단(운영자 명시 해제만) |
| `reason` | `string` | ✅ | provider 응답·내부 정책 사유 |
| `firstObservedAt` | `Date` | ✅ | |
| `lastObservedAt` | `Date` | ✅ | atomic update (multi-worker 안전) |
| `observedCount` | `integer` | ✅ | 누적 발생 횟수 — DB atomic increment. softSuppressionThreshold 도달 판정은 compare-and-set으로 1회만 발생 (`features/notifications.md` § 7.1) |
| `autoReleaseAt` | `Date` | optional | (soft-suppressed 한정) 자동 active 복귀 예정 시각 — `lastObservedAt + softSuppressionAutoReleaseDays`. worker(`features/notifications.md` § 7.4)가 도달 시 state=active + observedCount=0 복귀 |
| `unsuppressedBy` | `string` | optional | 수동 해제 시 운영자 |
| `unsuppressedAt` | `Date` | optional | |

---

## 6. 관계 다이어그램

```
ClinicProfile (C-01)
   ├─ trustMetrics → TrustMetric[] (CT-01)
   ├─ primaryCtas → CTAConfig[] (CT-03)
   ├─ medicalSpecialty → MedicalSpecialty (C-14)
   ├─ affiliatedInstitutes → ResearchInstitute
   └─ locations → LocationProfile[] (C-21)  ⭐ 필수 1개+

LocationProfile (C-21) — 위치·시간·연락 SoT
   ├─ businessHours → BusinessHours (CT-02)
   ├─ reservationChannels → CTAConfig[] (CT-03)
   ├─ parentClinic → ClinicProfile (C-01)
   ├─ representativeDoctors → DoctorProfile[]
   ├─ doctorsAtLocation → DoctorProfile[]
   └─ availableTreatments → TreatmentPage[]

DoctorProfile (C-02)
   ├─ primaryLocation → LocationProfile (C-21)
   ├─ additionalLocations → LocationProfile[]
   └─ trustMetrics → TrustMetric[] (CT-01)

TreatmentPage (C-03)
   ├─ cta → CTAConfig (CT-03)
   ├─ recommendedFor / treatmentComponents / visitFlow / programVariants / evidenceNotes (v0.4)
   ├─ relatedDoctors → DoctorProfile[]
   ├─ relatedConditions → MedicalConditionPage[]
   └─ pageRiskLevel → RiskLevel (직접 enum)

Article (C-04)
   ├─ author → DoctorProfile (C-02)              ⭐ 단일 참조
   ├─ coAuthors → DoctorProfile[] (C-02)         ⭐ 배열 (선택)
   ├─ reviewedBy → DoctorProfile (C-02)          ⭐ 단일 참조 (v0.4 신규)
   ├─ category → ArticleCategory (C-22)
   ├─ contentSource / externalUrl (v0.4)
   ├─ embeddedMedia → EmbeddedMedia[]
   └─ pageRiskLevel → RiskLevel

ComplianceRecord (C-10)
   ├─ contentRef → 발행 콘텐츠 (C-01~C-22)
   └─ pageRiskLevel → RiskLevel
```

---

## 7. 변경 정책

(§ 2.6 표 참조 — MAJOR/MINOR/PATCH)

---

## 8. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| DM-01 | `@id` 충돌 처리 — 다국어·동명이인 | 운영 룰 |
| DM-02 | `Markdown` 허용 문법 범위 | CONTENT_STANDARDS.md |
| DM-03 | 미디어 자산 URL 정책 | Phase Alpha |
| DM-04 | `ComplianceRecord` 첨부 저장소 | A-02 |
| DM-05 | `Article.inlineRiskFlags` 자동 추출 | compliance-assistant |
| DM-06 | C-11~C-20 풀명세 시점 | 페이지 합류 시 |
| DM-07 | cross-reference 빌드 검증 | |
| DM-08 | `BrandTokens.personaMode` 확장 | DESIGN_TOKENS.md |
| DM-09 | ~~ArticleCategory~~ | 해소 — C-22 |
| DM-10 | `TrustMetric` 자동 격상 룰 (단정형 표현 검출) | compliance-assistant |
| DM-11 | `ProgramVariant.priceRange` 노출 정책 | RISK_LEVELS.md |
| DM-12 | ~~LocationProfile SoT~~ | **v0.4 해소** — ClinicProfile에 위치·시간·연락 필드 제거. LocationProfile만 마스터 |
| DM-13 | `EmbeddedMedia`·`externalUrl` 외부 콘텐츠 검수 룰 | 정책 필요 |
| DM-14 | `CTAConfig.type` 확장 (해외 채널: 라인·왓츠앱 등) | M3 다국어 |
| DM-15 | `TrustMetric` 빌드 시 검증 룰 — 누락 경고 vs 오류 | Phase Alpha |
| DM-16 | `BusinessHours.openingHours` vs `receptionHours` UI 표시 규칙 | UI |
| DM-17 | LocationProfile main 자동 생성의 어드민 입력 단계 | admin/ARCHITECTURE.md |
| DM-18 | TreatmentComponent의 비대면 처방·배송 가능 여부 표시 | 위험도 정책 |
| DM-19 | `Article.reviewedBy`의 의료진 책임 범위 | 컴플라이언스 정책 |

---

## 9. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-13 | v0.1 | 최초 — 20개 계약 |
| 2026-05-13 | v0.2 | 레퍼런스 분석 반영 — C-21·C-22, 필드 추가 |
| 2026-05-13 | v0.3 | DEEP_DIVE 1단계 — CT-01 TrustMetric·CT-02 BusinessHours·CT-03 CTAConfig 신설, AccumulatedStats 흡수 |
| 2026-05-14 | v0.4 | **피드백 적용**: (1) **전체 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, (2) **SoT 정리** — ClinicProfile에서 mainAddress·mainTelephone·mainEmail·businessHours 제거. LocationProfile만 위치·시간·연락 마스터 (DM-12 해소), (3) **TreatmentPage 컨텍스트 필드 즉시 통합** — recommendedFor·treatmentComponents·visitFlow·programVariants·maintenancePlan·remoteCareAvailable·evidenceNotes (1호 다이어트 한의원 직결), (4) **Article 컨텍스트 필드 즉시 통합** — authorType·reviewedBy·reviewedAt·contentSource·externalUrl (E-E-A-T 강화), (5) **RiskLevel 직접 enum 사용** — `Ref<C-05>` 표기 전면 제거, (6) TreatmentComponent·VisitFlowStep·EvidenceNote 하위 타입 신설, (7) DM-18·DM-19 신규 |
| 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
| 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
| 2026-05-14 | v0.7 | **피드백 정정**: **C-16 LegalDocument를 § 4 M0 핵심으로 이동 + 풀명세** — `documentType` enum, `body` 변수 치환 규약, `autoGenerated`·`templateVersion`, `revisions[]` 하위 타입, 발행 시 법무 검토 룰 명시. § 5 (M0 외 간략 명세)에는 자리 표시만 유지 |
| 2026-05-14 | v0.8 | **피드백 정정**: § 4 내 C-16 위치를 C-22 뒤 → C-10 다음(C-21 앞)으로 이동, 번호 순 가독성 확보. § 5 자리표시도 한 줄 링크로 간소화 |
| 2026-05-14 | v0.9 | **피드백 정정**: (1) § 5 (M0 외 간략 명세)에서 C-16 자리표시 행 삭제 — 섹션 제목과 모순되는 잔존 제거. C-16은 § 4 M0 핵심에만 위치, (2) 헤더 작성일 설명 정정 — "번호순 정렬" → "M0 핵심 섹션 안에서 C-10 직후로 위치 이동" (C-11~C-15가 § 5에 있어 엄밀한 번호순은 아님) |
| 2026-05-14 | v0.10 | **SEARCH_STANDARDIZATION v0.2 cascade**: C-06 PageMeta `ogType` enum 확장 — `{website, article}` → **`{website, article, profile}`**. P-004 Doctor Profile 등 인물 페이지가 `profile` og:type을 사용 (SEARCH_STANDARDIZATION § 2.2 매핑 참조) |
| 2026-05-14 | v0.11 | **SEARCH_STANDARDIZATION v0.5 cascade — C-08 InstanceManifest 확장**: `environment`·`aiCrawlerPolicy`(required)·`aiCrawlerLegalApproved`·`aiCrawlerApprovedBy/At`·`robotsOverrides`·`experimentalAiBots`·`performanceBudget`·`searchConsoleVerification` 8개 필드 추가. 하위 타입 `RobotsOverride`·`PerformanceBudget` 신설 |
| 2026-05-14 | v0.12 | **SEARCH_STANDARDIZATION v0.6 cascade**: (1) **`aiCrawlerApprovedBy/At`을 `aiCrawlerPolicy: allow` 시 required로 격상** — 감사 추적 게이트 강화, (2) **`PerformanceBudget` 확장** — `imageWeightKbOverride`·`lighthouseSeoMinOverride`·`lighthouseAccessibilityMinOverride` 추가 (SEARCH_STANDARDIZATION § 6.1 budget 항목 정합) |
| 2026-05-14 | v0.19 | **`features/crm-sync.md` 1차 사이클 cascade**: (1) **C-08 `crmSyncConfig` 신설** (CrmSyncConfig·CrmIntegrationEntry — provider 3종 한정, dpaEvidenceRef·patientConsentEvidenceRef 분리), (2) **C-08 `crmSyncPolicyVersion`** (7 Feature policyVersion 동일 패턴) |
| 2026-05-14 | v0.20 | **`features/crm-sync.md` 3차·5차 사이클 cascade (CS3-13·CS5-01)**: (1) CrmIntegrationEntry에 `genericRestApiAdapter` 필드 추가 — provider=generic-rest-api 시 required. **5필드** (webhookSignatureHeader·webhookTimestampHeader·webhookEventIdHeader·canonicalStringFormat·`versionTokenJsonPath`) + `versionTokenType` enum, (2) manifest(secretRef) vs admin DB(`CrmCredentialVersion` — secretVersionId·rotation state) 경계 명시 |
| 2026-05-15 | v0.21 | **`features/content-migration.md` 1차 사이클 cascade (CM1-03)**: (1) **C-08 `contentMigrationConfig` 신설** (ContentMigrationConfig — legalApproved·defaultMode·approvalRequired·legalImpactClassifierRef), (2) **C-08 `contentMigrationPolicyVersion`** (8 Feature policyVersion 동일 패턴) |
| 2026-05-15 | v0.22 | **`features/content-migration.md` 3차 사이클 cascade (CM3-05·CM3-08·CM3-18)**: (1) ContentMigrationConfig `legalApproved` → `featureLegalApproved` rename (plan-level `ContentMigrationLegalApproval` admin DB와 명칭 분리), (2) `piiFieldCatalogRef`·`entityFieldProjectionCatalogRef` 추가 — legalImpactClassifier deterministic rule 입력 SoT |
| 2026-05-14 | v0.18 | **`features/asset-ingestion.md` 1차 사이클 cascade**: (1) **C-08 `assetIngestionConfig` 신설** (AssetIngestionConfig — sources webCrawl/snsApi/manualUpload/csvImport), (2) **C-08 `assetIngestionPolicyVersion`** (6 Feature policyVersion 동일 패턴), (3) **`AssetIngestionApprovedScope` 신규** — SerpCrawlerApprovedScope의 SERP 특화 필드 제거·자산 수집 특화(allowedDomains·allowedPathPrefixes·maxPagesPerCrawl·maxAssetSizeMb·artifactRetentionDaysMax) |
| 2026-05-14 | v0.17 | **`features/keyword-monitoring.md` 1차 사이클 cascade**: (1) **C-08 `keywordMonitoringConfig` 신설** (KeywordMonitoringConfig — search-visibility의 SerpCrawlerApprovedScope 게이트 패턴 재사용), (2) **C-08 `keywordMonitoringPolicyVersion`** (top-level, 4 Feature policyVersion 동일 패턴) |
| 2026-05-14 | v0.16 | **`features/search-visibility.md` 1차 사이클 cascade**: (1) **C-08 `searchVisibilityConfig` 신설** (SearchVisibilityConfig — serpCrawler/backlinkSource, serpCrawler.enabled=true + legalApproved 게이트 fail-gate), (2) **C-08 `searchVisibilityPolicyVersion`** (top-level, notifications·analytics 패턴 동일) |
| 2026-05-14 | v0.15 | **`features/analytics-reporting.md` 4차 사이클 cascade**: (1) **C-08 `analyticsPolicyVersion` 신설** — notifications policyVersion 패턴 동일 (필수, 패키지 병렬 보관), (2) **C-10 `mediaThresholdOperationalInput` 슬롯 분리** — rolling-90 operational snapshot은 본 슬롯, calendar 확정 판정은 `mediaThresholdAssessment` 슬롯. published record는 calendar 값만 (AR4-08) |
| 2026-05-14 | v0.14 | **`features/analytics-reporting.md` 1차 사이클 cascade**: (1) **C-08 `analyticsConfig` 신설** — `AnalyticsConfig`(sources.gsc·naverSearchAdvisor·ga4·rum 자격증명·사이트 식별자만, 동작 옵션은 `features.analytics-reporting.config`로 분리), (2) **C-10 `mediaThresholdAssessment` 슬롯** — `MediaThresholdAssessment` 신설(assessmentBasisDate·windowStart/End·rollingAverageDailyUsers·thresholdReached·primarySource·sourceCompleteness·timezone·calendarPolicy·botFilteringPolicy·legalBasisNote). priorReviewRequired 산정 근거. ComplianceRecord 발행 시 snapshot으로 고정 |
| 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `AdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`eligibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·digestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IANATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |


 succeeded in 671ms:
# Admin — 검수 워크플로

> **상태**: **v1.0 구현 명세 안정판** (codex 자동 비평 5차 사이클 마감)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 4 / `docs/admin/ARCHITECTURE.md` (v0.7)
> **목적**: 콘텐츠의 작성부터 발행까지 어드민(Control Plane) 검수 워크플로 — 상태 머신, 검수 큐, multi-role AND 게이트, ComplianceRecord 슬롯 채움, StaleFlags 처리, 사전심의 흐름, 알림·감사 로그·권한을 단독 구현 가능한 명세로 정의.
> **외부 공유 시 주의**: 상위 문서와 동일. 사용자별 권한·승인자 식별 정보 노출 주의.
> **연관 문서**:
> - 표현 룰·ComplianceCheckResult → `core/CONTENT_STANDARDS.md` § 7
> - 위험도 자동 추론·ApproverRole 통과 기준·StaleFlags → `compliance/RISK_LEVELS.md`
> - 의료법 운영 가이드·사전심의 → `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md`
> - 데이터 계약 (ComplianceRecord C-10 · LegalDocument C-16) → `core/DATA_MODEL.md`
> - 어드민 화면 구성 → `docs/admin/ARCHITECTURE.md`

---

## 0. 한 페이지 요약

- **상태 머신 9종**: `draft` → `review-queued` → `in-review` → `approved` → `publishable` → `published`. 분기: `blocked` (fail) / `rejected` / `stale`
- **검수 큐 3종**: (a) **content-gate 큐** (`gateRequired=true`) — content-gate finding만 인간 검수 의무 (fail finding은 `blocked` 정정 흐름으로 분리), (b) **warning 큐** (`hasWarnings=true`) — operator 일괄 인정 또는 정정, (c) **stale 큐** (`staleFlags.* = true`) — 재검수 진입
- **multi-role AND 게이트** (`approved` 전이): `operator + (Medium/High 시 medical) + 룰별 requiredApproverRoles[]` 합집합 모두 ComplianceRecord 슬롯 기록 완료 (RISK_LEVELS § 4.5 정합)
- **publishable 조건** (별도 단계): § 7.1 6조건 모두 충족 — automatedDecision !== "block" + finalRoles 슬롯 + priorReview 결과 + staleFlags clear + LegalDocument 필수 필드 + warning 정책별 처리. `approved`와 시점 차이 발생 가능. (content-gate·warn 결과는 사람 검수·정책 처리로 publishable 가능 — block만 영구 차단)
- **사전심의 흐름**: `priorReviewRequired=true` 시 외부 자율심의기구 제출 → `priorReviewSubmissionId`·`priorReviewPassed` 기록 후 발행 허용
- **알림·감사**: notifications Feature Module로 검수자에게 큐 진입 알림. 모든 승인·거부·재검수는 audit log 기록 (immutable)
- **권한 5종**: `super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver` — 역할별 검수 액션 한정

---

## 1. 일반 규약

### 1.1 변경 정책

| 변경 유형 | 버전 영향 | 비고 |
|---|---|---|
| 상태 머신 enum 변경 | **MAJOR** | 진행 중 콘텐츠 영향 |
| 큐 진입 트리거 변경 | **MAJOR** | 미검수 콘텐츠 발생 가능 |
| ApproverRole·권한 enum 변경 | **MAJOR** | RISK_LEVELS § 4.5 cascade |
| 화면·UX 변경 | MINOR | |
| 알림 채널 추가 | MINOR | |
| 감사 로그 필드 추가 | PATCH (append-only) | |

### 1.2 SoT 원칙

- 본 문서 = **검수 워크플로 운영 SoT** — 상태 머신·큐·승인 흐름·권한
- ApproverRole 통과 기준 SoT는 `compliance/RISK_LEVELS.md` § 4 (본 문서는 워크플로 적용)
- ComplianceRecord 데이터 구조 SoT는 `core/DATA_MODEL.md` C-10 (본 문서는 슬롯 채움 흐름)
- ComplianceCheckResult 인터페이스 SoT는 `core/CONTENT_STANDARDS.md` § 7.2 (본 문서는 결과 처리)

### 1.3 본 문서가 다루지 않는 영역

- 데이터 계약 자체 — `DATA_MODEL.md`
- 룰 카탈로그·자동 추론 알고리즘 — `RISK_LEVELS.md`
- UI 시각 디자인 — `DESIGN_TOKENS.md`·`admin/ARCHITECTURE.md`

---

## 2. 워크플로 상태 머신

### 2.1 상태 enum

```ts
type ContentWorkflowState =
  | "draft"           // 작성 중 — 자동 검수 미실행
  | "review-queued"   // 검수 큐 진입 (작성자가 검수 요청 또는 자동 트리거)
  | "in-review"       // 검수자(operator·medical·legal·client)가 검수 진행
  | "approved"        // 필요한 모든 역할의 승인 완료
  | "publishable"     // 발행 가능 — § 7.1 6조건 충족 (automatedDecision !== "block" + finalRoles + priorReview 결과 + staleFlags clear + LegalDocument 필드 + warning 정책별 처리)
  | "published"       // 발행됨 (Git 사본 생성)
  | "blocked"         // automatedDecision=block (fail 룰) — 본문 정정 필요
  | "rejected"        // 검수자가 명시적 거부
  | "stale";          // staleFlags 발생으로 재검수 필요 (publishable 잃음)
```

### 2.2 전이 다이어그램

```
                            ┌──────────────────────┐
                            │       draft          │
                            └──────────┬───────────┘
                                       │ submit-for-review (작성자) 또는 자동 트리거 (§ 3.2)
                                       ▼
                            ┌──────────────────────┐
              ┌────────────►│   review-queued      │
              │             └──────────┬───────────┘
              │                        │ assign (검수자 픽업)
              │                        ▼
              │             ┌──────────────────────┐
              │             │     in-review        │
              │             └──┬──────┬────────────┘
              │                │      │
              │     reject     │      │ approve (해당 역할)
              │   (검수자)     │      ▼
              │                │   ┌─────────────────────────────┐
              │                │   │ AND 게이트 평가 (§ 4.5)     │
              │                │   │  모든 ApproverRole 충족?    │
              │                │   └────┬──────────┬──────────────┘
              │                │       Y           N (다음 역할 검수)
              │                │       ▼           │
              │                │  ┌──────────┐     │
              │                │  │ approved │     ┘
              │                │  └────┬─────┘
              │                │       │ automatedDecision != block 재확인
              │                │       ▼
              │                │  ┌──────────────┐
              │                │  │ publishable  │
              │                │  └────┬─────────┘
              │                │       │ publish (운영자 발행 액션)
              │                │       ▼
              │                │  ┌──────────────┐
              │                │  │  published   │
              │                │  └────┬─────────┘
              │                │       │ staleFlags 발생 (§ 6)
              │                │       ▼
              │                │  ┌──────────┐
              │                │  │  stale   │
              │                │  └────┬─────┘
              │                │       │ 재검수 큐 진입
              │                └────►──┘
              │                ▼
              │       ┌──────────────┐
              │       │   rejected   │
              │       └──────┬───────┘
              │              │ 작성자가 본문 정정 후 재제출
              └──────────────┘

draft / 모든 상태 → blocked: ComplianceCheckResult.automatedDecision === "block" 시 자동 전이
```

### 2.3 전이 트리거

| 전이 | 트리거 | 권한 |
|---|---|---|
| `draft → review-queued` | 작성자 "검수 요청" 액션 또는 자동 트리거(§ 3.2) | 작성자(operator+) |
| `review-queued → in-review` | 검수자 픽업(assign) 또는 자동 라운드로빈 | 검수자(역할별) |
| `in-review → approved` | AND 게이트 충족 — 모든 필요 ApproverRole 슬롯 기록 완료 | (자동) |
| `in-review → rejected` | 검수자 명시 거부 | 검수자 |
| `approved → publishable` | § 7.1 publishable 6조건 모두 충족 — (1) automatedDecision !== "block", (2) finalRoles 슬롯 모두 기록, (3) priorReview 결과 정합, (4) staleFlags clear, (5) LegalDocument 시 legalCounsel·legalCounselAt 둘 다, (6) warning 강제 처리 정책 충족 (운영 정책 시) | (자동) |
| `publishable → published` | 운영자 명시 발행 액션 | operator+ |
| `{draft, review-queued, in-review} → blocked` | ComplianceCheckResult.automatedDecision === "block" (fail 1개 이상) | (자동) |
| `blocked → draft` | 작성자 본문 정정 후 (compliance-assistant 재실행 시 fail 미발생 시) | 작성자 |
| `blocked → review-queued` | 사후 fail(published → blocked)에서 작성자 정정 후 직접 재제출. 또는 룰 강화 의료법 개정으로 인한 fail에서 자동 재검수 큐 진입 (`triggeredBy=medical-law-revision-<id>` 시) | 작성자 또는 자동 |
| `published → stale` | StaleFlags 발생 (§ 6). **blocked 미발생 시에만**. published 상태 유지하면서 stale 큐 진입 — 사용자 노출 콘텐츠는 그대로 유지하되 재검수 필요 | (자동) |
| `stale → review-queued` | StaleFlags 진입 시 자동 큐 진입 | (자동) |
| `in-review → in-review (request-changes)` | 검수자 변경 요청 — 상태 유지하면서 작성자에게 메모 표시 (draft 환원 아님) | 검수자 |
| `rejected → draft` | 작성자 본문 정정 액션 (재제출은 별도 transition) | 작성자 |
| `rejected → review-queued` | 작성자 직접 재제출 (정정 없이) — 거부 사유 응답 메모 권장 | 작성자 |
| `published → blocked` | 발행 후 룰 강화로 인한 사후 fail 검출 — **즉시 unpublish + 사용자 노출 차단 우선** (의료광고 fail 노출 위험 회피). **blocked는 stale보다 항상 우선** — fail과 stale이 동시 발생하면 published → blocked로 즉시 전이 후 unpublish (사용자 노출 제거), 사용자 노출 차단 후 재검수 큐 진입 | (자동) |

---

## 3. 검수 큐 (Review Queues)

### 3.1 큐 종류 3종

| 큐 | 진입 조건 | 우선순위 | 처리자 |
|---|---|---|---|
| **content-gate** | `ComplianceCheckResult.gateRequired=true` (content-gate finding 1+ 또는 RiskLevel=High 가상 finding). **fail finding은 본 큐 진입 아님** — `blocked` 상태로 별도 분리 (작성자 본문 정정 후 재실행) | P0 (발행 비차단이나 인간 검수 의무) | finalRoles 역할별 (§ 4.1) — operator·등급 기본 medical·룰 추가 역할 모두 포함 |
| **warning** | `hasWarnings=true` (content-gate 발생 여부와 무관 — 동시 진입 가능, § 3.1.2) | P2 (발행 비차단) | operator |
| **stale** | `ComplianceRecord.staleFlags.<role>=true` 1개 이상 | P1 (재검수 필요) | stale 발생 role 매칭 |

#### 3.1.1 warning 큐 이탈 조건·기록

- operator가 warning finding 각각을 **acknowledged**(인정) 또는 **resolved**(정정 후 재검수) 액션 — DATA_MODEL C-10의 `warningAcknowledgements[]` 필드(v0.8 cascade)로 기록 (findingId + action + operatorId + timestamp + note)
- 모든 warning finding이 acknowledged 또는 resolved 상태이면 큐 이탈
- 미처리 warning이 있는 채로도 발행 가능 (P2 — 발행 비차단) — 단, publishable 조건 § 7.1 (6)에 운영 정책별 강제 처리 옵션 (instance manifest 설정 — AW-09)

#### 3.1.2 content-gate와 warning 동시 발생 처리

ComplianceCheckResult가 `gateRequired=true` + `hasWarnings=true`인 경우 — 콘텐츠는 **content-gate 큐와 warning 큐 양쪽에 동시 진입**. 각 큐는 독립적으로 처리:
- content-gate 큐: finalRoles 검수자가 § 4.3 액션 수행
- warning 큐: operator가 § 3.1.1 acknowledged/resolved 처리
- publishable 산정 시 — 두 큐의 처리 결과 모두 평가 (content-gate은 § 7.1 (2), warning은 § 7.1 (6) 조건)

### 3.2 자동 큐 진입 트리거

다음 이벤트 발생 시 콘텐츠 상태가 자동으로 `review-queued`로 전이:

- compliance-assistant ComplianceCheckResult — `gateRequired=true` 또는 `hasWarnings=true` 시
- 자동 위험도 추론 결과 — High 등급
- StaleFlags 발생:
  - 의료법 개정 (`medical-law-revision-<id>`)
  - 콘텐츠 본문 RiskRule 매칭 텍스트 변경
  - 가격·ReviewPolicy·전후사진 미디어 변경
  - 의료진 자격·인증 변경
  - 인용 외부 링크 만료
- LegalDocument 발행 의무(C-10 LegalDocument required)
- 운영자 수동 트리거

### 3.3 우선순위·SLA

| 처리 영역 | SLA 목표 | 알림 정책 SoT |
|---|---|---|
| **blocked** 정정 (fail 흐름, 큐 아님) | 24시간 내 작성자 응답 | § 9.1.1 `blocked-correction-required` |
| content-gate 큐 P0 | 영업일 3일 내 처리 | § 9.1.1 `content-gate-queued` |
| stale 큐 P1 | 영업일 7일 내 처리 (의료법 개정은 영업일 5일) | § 9.1.1 `stale-queued` |
| warning 큐 P2 | 영업일 14일 또는 다음 발행 시 일괄 처리 | § 9.1.1 `warning-queued` |

SLA 미달 시 운영팀 에스컬레이션 — § 9.1.1 `sla-overdue` (criticality=critical, quietHours bypass).

> 본 표의 "처리 영역"은 검수 워크플로 SLA 영역이며, 채널·주기 등 알림 정책은 § 9.1.1 매트릭스를 SoT로 따른다.

---

## 4. multi-role AND 게이트

### 4.1 AND 게이트 평가 (RISK_LEVELS § 4.5 정합)

콘텐츠가 `approved` 상태로 전이하기 위해 필요한 검수자 역할 합집합:

```
riskLevel = RiskInference 자동 추론 결과 (RISK_LEVELS § 2.3 — pageType·articleType·slot·inlineRiskFlags·explicitRiskLevel MAX 결합)
            = ComplianceRecord.pageRiskLevel 출력 결과

finalRoles = operator                                                  // 전 콘텐츠 공통 (C-10 peerReviewer required)
           ∪ (riskLevel ∈ {Medium, High} ? medical : ∅)               // 등급 기본 요구
           ∪ requiredApproverRoles[]                                    // ComplianceCheckResult 룰 추가 요구
           ∪ (priorReviewRequired === true ? legal : ∅)                 // 사전심의 대상 시 legal 자동 추가 (사전심의 판정 자체가 legal 검수자의 책임이므로 finalRoles에 포함)
           ∪ (contentType === "LegalDocument" ? legal : ∅)              // LegalDocument 발행 시 legal 자동 추가 (C-10 required)
```

**AND 게이트 평가 알고리즘** (`in-review → approved` 전이 조건):

`finalRoles` 각각에 대해 ComplianceRecord 슬롯 + timestamp 기록 완료 시 `in-review → approved` 전이. **사람 검수 슬롯 충족만 평가** — priorReviewPassed·priorReviewSubmissionId·staleFlags 등은 본 단계에서 평가하지 않음.

> **개념 정리**:
> - `approved` = 사람 검수 합의 완료 (finalRoles 슬롯 모두 충족)
> - `publishable` = 추가 게이트 모두 통과 (automatedDecision !== "block" + priorReview 결과 + staleFlags clear + LegalDocument 필드 + warning 정책 — § 7.1 6조건)
> 둘 사이에 시점 차이 발생 가능 (예: 사람 검수 완료 후 사전심의 결과 대기 중, stale 발생 등). 단계 분리 보장.

### 4.2 검수자별 검수 화면

| 역할 | 검수 화면 책임 |
|---|---|
| **operator** (peerReviewer) | 톤·문체·블록 구조·warning 일괄 인정. 콘텐츠 전반 |
| **medical** (physicianApprover) | 의학 정보 사실성·효과·기간·부작용·금기 표현. 의료진 자격 검증 (RISK_LEVELS § 4.1) |
| **legal** (legalCounsel) | 의료법 제56조·제57조 적용 판단·치료경험담·전후사진·외국인환자 광고 (RISK_LEVELS § 4.2) |
| **client** (clientApprover) | 기관 정체성·로고·의료진 노출·가격 정책 최종 확인 (RISK_LEVELS § 4.4) |

### 4.3 승인 액션

각 검수자는 자신의 역할에 한해 다음 액션 수행:

| 액션 | 결과 |
|---|---|
| **approve** | 해당 역할 ComplianceRecord 슬롯 기록 (§ 5.1). 마지막 필요 역할이면 `approved` 전이 |
| **reject** | `rejected` 상태로 전이. 거부 사유 메모 필수 (50자 이상) |
| **request-changes** | `draft` 상태로 환원하지 않고 작성자에게 변경 요청 (in-review 유지). 검수자 메모 표시 |
| **delegate** | 동일 역할 다른 검수자에게 위임 (예: physician-reviewer A → B). 위임 사유 필수 |

### 4.4 자동 차단

- 검수자가 자신의 역할이 아닌 항목 approve 시도 → 403 Forbidden
- 동일 역할이 이미 approve된 콘텐츠에 재approve 시도 → no-op (idempotent)
- `automatedDecision="block"` 콘텐츠를 approve 시도 → 403 Forbidden (먼저 본문 정정 필요)

---

## 5. ComplianceRecord 슬롯 채움 흐름

### 5.1 역할 → 필드 매핑 (RISK_LEVELS § 4.1.3 정합)

approve 액션 시 ComplianceRecord(C-10)의 슬롯 갱신:

| ApproverRole | 갱신 필드 |
|---|---|
| `operator` | `peerReviewer` (운영자 ID), `peerReviewedAt` (timestamp) |
| `medical` | `physicianApprover` (의료진 ID — DoctorProfile @id), `physicianApprovedAt` |
| `legal` | `legalCounsel` (법무 ID 또는 외부 법무법인 식별자), `legalCounselAt`, `attachments[]` (법무 의견서 — 권장) |
| `client` | `clientApprover` (클라이언트 측 식별자), `clientApprovedAt` |

### 5.2 ComplianceRecord 생명주기 — `recordPhase` 2단계 (DATA_MODEL C-10 v0.8 cascade 정합)

DATA_MODEL C-10에 `recordPhase: "pre-publish" | "published"` 필드를 cascade 추가하여 단일 ComplianceRecord 타입으로 두 단계 처리. PreComplianceRecord 별도 신설 없음.

**(a) pre-publish ComplianceRecord** (`recordPhase="pre-publish"`, mutable):
- 발행 전 검수 단계 누적 — `publishedAt`·`publishedBy` 미기록 (DATA_MODEL C-10에서 `recordPhase="pre-publish"` 시 optional)
- 검수자 approve·reject·priorReview·staleFlags 갱신은 본 단계에서 발생
- 어드민 내부 저장소에만 존재. Git 사본·정적 빌드에 영향 없음

**(b) published ComplianceRecord** (`recordPhase="published"`, 대부분 immutable):
- `publish` 액션 시 **동일 record의 `recordPhase`만 "published"로 전환** + `publishedAt`·`publishedBy` 채움. 별도 새 record 복사 없음 (record ID 보존)
- 발행 후 본 record는 **불변** — 단 `staleFlags` 영역만 예외 (§ 5.4 참조)
- Git 사본·정적 빌드에 반영

### 5.3 갱신 시점

| 시점 | 동작 | 대상 |
|---|---|---|
| 자동 검수(compliance-assistant) 결과 도착 | pre-publish record 생성 또는 `autoCheckResult` 갱신. `pageRiskLevel`·`inlineRiskFlags`·`articleType` 기록 | pre-publish |
| 검수자 approve | 해당 역할 슬롯 + timestamp 기록 | pre-publish |
| 사전심의(§ 8) | `priorReviewRequired`·`priorReviewSubmissionId`·`priorReviewPassed` 기록 | pre-publish |
| 발행(`publish` 액션) | 동일 record의 `recordPhase`만 "published"로 전환. `publishedAt`·`publishedBy` 채움. record ID 보존 | published (동일 record) |
| StaleFlags 발생 (발행 후) | **기존 published ComplianceRecord의 `staleFlags` 필드만 갱신** (record 불변성의 예외 영역). DATA_MODEL C-10 staleFlags 정의 명시 — published 후에도 갱신 허용. 별도 registry 신설 없음 | published 동일 record (staleFlags만) |
| StaleFlags 해제 (재검수 통과 후) | **새 ComplianceRecord(`recordPhase="pre-publish"`) 생성** — 동일 contentRef + 새 record ID + 증가된 record version. 재검수 사이클 진행 후 publish 시 본 새 record의 recordPhase만 "published" 전환. 이전 published record는 audit log + record version history로 보존 | 새 record (새 ID·새 버전) |

### 5.4 ComplianceRecord 불변성·버전 모델

- 발행된 (`recordPhase="published"`) record의 모든 필드 수정 불가 — **단 `staleFlags` 영역은 예외** (mutable, DATA_MODEL C-10 v0.8 cascade 명시)
- staleFlags 갱신은 published record 자체에 직접 — 별도 registry 신설 없음 (SoT 통일)
- **재검수 시 record version 증가**: 새 ComplianceRecord 생성 (동일 contentRef + 새 record ID + `recordVersion: integer` 1 증가). pre-publish → publish 사이클 후 새 published record가 활성
- 즉 동일 contentRef는 발행 1회당 record 1개 — 시간에 따라 record version 1, 2, 3, ... 누적 (이전 record는 audit log + history)
- staleFlags 외 필드 수정 시도 — 빌드/API fail

---

## 6. StaleFlags 처리

### 6.1 발생 트리거 (RISK_LEVELS § 4 정합)

| 트리거 이벤트 | 설정되는 flag |
|---|---|
| 의료법 개정 (`medical-law-tracking.yaml` revision 추가) | `legal=true` |
| 콘텐츠 본문 RiskRule 매칭 텍스트 영역 변경 | `medical=true` |
| TreatmentPage 의학 정보 영역 변경 (treatmentComponents·visitFlow·evidenceNotes 등) | `medical=true` |
| 의료진 자격·인증 변경 (DoctorProfile) | `medical=true` |
| 인용 외부 링크 만료 (404·5xx) | `medical=true` |
| 가격 정보 변경 (PricingPage·CTA 채널) | `legal=true` |
| ReviewPolicy 변경 | `legal=true` |
| 전후사진 미디어 첨부·교체 | `legal=true` |
| 본문 일반 변경 | `operator=true` |
| 기관 정체성 변경 (ClinicProfile name·businessRegistrationNumber 등) | `client=true` |

각 이벤트는 `triggeredBy`·`triggeredAt` 동시 기록.

### 6.2 stale 큐 진입·처리

- staleFlags.<role>=true 발생 시 — **기존 published ComplianceRecord의 `staleFlags`만 갱신** (record 불변성 예외 영역). 콘텐츠 상태 `published → stale` 전이. **published 표면 유지** — 사용자 노출 콘텐츠 그대로. 어드민 화면에서만 stale 배지 표시
- 동시에 `stale → review-queued` 자동 전이. **새 ComplianceRecord** 생성(`recordPhase="pre-publish"` + `recordVersion`이 이전 published version + 1)하여 재검수 시작
- 큐 진입 시 stale 발생 role 매칭 검수자에게 알림
- 검수자가 재검수 후 approve 시 — **새 pre-publish record의 슬롯**에 기록 (이전 published record의 staleFlags는 그대로 두고 새 record로 작업)
- 모든 stale flag clear 조건은 publishable § 7.1 (4)에서 평가 — **active(현재 검수 사이클의) pre-publish record의 staleFlags 기준** (자동 추론 후 발생한 새 flag가 없는 상태). 이전 published record의 staleFlags 값은 audit 기록으로 보존되며 평가에 사용하지 않음 — record version 분리
- 다른 검수 요구사항 충족 시 — 운영자가 **재발행(`publish`) 액션 명시 트리거** 필요. 자동으로 published 복귀하지 않음
- 재발행 시 새 record의 `recordPhase`만 "published" 전환. 이전 published record는 audit log + record version history로 보존 (§ 5.4)
- 재발행 전까지 사용자 노출 콘텐츠는 이전 published 버전 유지 (Git 사본 미갱신)

### 6.3 staleFlags 우선순위

여러 flag가 동시 발생 시 우선순위:

```
legal > medical > client > operator
```

- 우선순위 높은 flag가 먼저 처리되어야 다음 처리 가능 (선택적 정책 — instance 옵션 — MA-07)
- 또는 병렬 처리 허용 (기본값)

---

## 7. 발행 결정

### 7.1 publishable 산정 알고리즘

콘텐츠가 `publishable` 상태가 되기 위한 조건:

```
publishable = (1) automatedDecision !== "block"
           ∧ (2) finalRoles의 모든 역할 ComplianceRecord 슬롯 기록 완료
                  (each role: 매핑 필드 (peerReviewer/physicianApprover/legalCounsel/clientApprover)
                              + 매핑 timestamp 필드 (peerReviewedAt/physicianApprovedAt/legalCounselAt/clientApprovedAt) 둘 다 기록)
           ∧ (3) priorReviewRequired=true 이면 priorReviewPassed=true ∧ priorReviewSubmissionId 기록 ∧ 법무 의견서 attachments[] 첨부
           ∧ (4) staleFlags 모두 false 또는 미설정
           ∧ (5) contentType === "LegalDocument"이면 legalCounsel ∧ legalCounselAt 둘 다 기록 (C-10·C-16 required)
           ∧ (6) hasWarnings=true이면서 instance 운영 정책상 강제 처리 설정 시 — 모든 warning finding acknowledged 또는 resolved (AW-09)
```

위 6조건 중 1개라도 미충족 → `publishable=false` (다른 상태 유지)

### 7.2 publish 액션

- 권한: `super-admin`·`operator` (역할별 운영 정책)
- 입력: 콘텐츠 @id
- 검증: § 7.1 재실행 (auth time-of-use)
- 결과:
  - `published` 상태 전이
  - ComplianceRecord `publishedAt`·`publishedBy` 기록
  - Git 사본 생성 (C-10 Git 사본 — pageRiskLevel·articleType·priorReviewPassed·publishedAt·lastModifiedAt)
  - 빌드 트리거 (정적 사이트 재빌드)

### 7.3 unpublish 액션

- 권한: `super-admin`만
- 결과:
  - `published → draft`로 환원 (또는 별도 unpublished 상태 — MA-08)
  - Git 사본 제거
  - 재발행 시 워크플로 재실행

---

## 8. 사전심의 (priorReview) 흐름

### 8.1 priorReviewRequired 판정

**진입 경로**: 본 판정은 finalRoles의 legal 포함 여부와 **무관하게 모든 콘텐츠**에 적용. 다음 시점에서 자동 판정 단계 트리거:

1. compliance-assistant 자동 검수 직후 — 콘텐츠가 § 3 의료법 카탈로그 카테고리 매칭 시 자동으로 "priorReview 후보" 플래그 설정 → legal 검수자에게 알림
2. legal 검수자가 매체 판정 단계 수행 — finalRoles에 legal이 자동으로 임시 추가 (판정 책임 한정)
3. 판정 결과 `priorReviewRequired=true` 시 — legal이 finalRoles에 정식 포함 + § 8.2 사전심의 절차 진행 + **법무 판정 기록 필수** (`legalCounsel` + `legalCounselAt` + 판정 근거 attachments[])
4. 판정 결과 `priorReviewRequired=false` 시 — finalRoles에 legal 정식 포함되지 않음. 단 **판정 자체가 법무 행위**이므로 ComplianceRecord에 동일하게 `legalCounsel` + `legalCounselAt` + 판정 근거(법무 의견서) attachments[] 기록 필수 (MEDICAL_AD § 4.2 자사 사이트 사전심의 판정 감사 추적 요구사항 정합)

**판정 기준** (MEDICAL_AD_COMPLIANCE_COMMON § 4 정합):
- 매체 분류 (시행령 제24조제1항·제2항)
- 자사 사이트 일평균 이용자 측정 결과 (운영자 책임, MA-02 — 클라이언트 의료기관 책임). **operational rolling 측정 데이터는 `mediaThresholdOperationalInput` 슬롯 참조**(DATA_MODEL C-10 v0.15)·**법적 calendar 산정 확정값은 legal 검수자가 `mediaThresholdAssessment` 슬롯에 기록**(`calendarPolicy="previous-3-months-calendar"`). `features/analytics-reporting.md` § 8.2가 두 산정 모두의 데이터 source 제공
- 의료광고 정의(제56조제1항) 결합 판정

판정 결과 기록 (DATA_MODEL C-10 v0.15 정합):
- `ComplianceRecord.priorReviewRequired=true|false`
- `ComplianceRecord.legalCounsel`·`ComplianceRecord.legalCounselAt` (top-level 필드 — AR5-07)
- `mediaThresholdAssessment` 슬롯 (calendar 확정 판정만, `legalBasisNote` + 첨부 attachments[])
- `mediaThresholdOperationalInput` 슬롯 (rolling operational 입력 자료 — 감사 보존)

#### 8.1.1 일평균 이용자 임계 전이 시 legal 판정 큐 자동 트리거

`features/analytics-reporting.md`는 **명시 command API** `enqueueMediaThresholdReassessment(input)`를 호출하여 본 워크플로에 재평가를 요청한다. `notifications.notify()`는 결과 알림용으로만 사용 (워크플로 트리거 책임 분리 — `features/analytics-reporting.md` AR2-10 정정).

```ts
async function enqueueMediaThresholdReassessment(input: {
  instanceId: Slug;
  transitionEventId: string;             // analytics-reporting의 결정적 sourceEventId — idempotency
  newState: "threshold-reached" | "threshold-released";
  assessmentBasisDate: ISODateString;
  measurementSnapshot: MediaThresholdAssessment;  // DATA_MODEL C-10 v0.14 SoT 타입
}): Promise<{ enqueuedCount: number; reassessmentBatchId: string }>
```

**동작**:
1. `transitionEventId` UNIQUE 검사 — 동일 전이 중복 호출 차단 (멱등)
2. 인스턴스의 **모든 published 콘텐츠**에 대해 priorReview 후보 플래그 재평가 트리거
3. 매체 분류 결과 변경 가능성 있는 콘텐츠는 `staleFlags.legal=true` 갱신 (§ 5.4 stale 흐름)
4. 어드민 "사전심의 재평가 큐"(§ 3.1.1과 별개) 생성 — legal 검수자가 priorReviewRequired 재판정
5. 새 pre-publish ComplianceRecord 생성 (recordPhase="pre-publish", recordVersion 증가). **rolling snapshot 저장 위치 분리 (`features/analytics-reporting.md` AR4-08 정정)**:
   - `mediaThresholdOperationalInput`(C-10 v0.15 cascade — 별도 audit 슬롯): analytics-reporting이 제공한 rolling-90 snapshot 그대로 저장. legal 판정 입력 자료
   - `mediaThresholdAssessment`(C-10 SoT 슬롯): **legal 검수자가 calendar 산정 후 채움**. rolling snapshot은 본 슬롯에 넣지 않음 (calendarPolicy 혼선 방지)
6. 판정 결과는 legal 검수자가 새 record에 `mediaThresholdAssessment.calendarPolicy="previous-3-months-calendar"`·`legalCounsel`·`legalCounselAt`·`legalBasisNote`·attachments 채움 후 publishable 흐름 진입
7. **published record.mediaThresholdAssessment에는 항상 calendar 산정값만**. operational rolling 값은 mediaThresholdOperationalInput 슬롯에서만 보존 (감사용)
8. `analytics-reporting`이 자동 발송하는 `media-threshold-*` 이벤트는 운영 alert 성격 — 법적 판정 자체는 본 워크플로 책임

**priorReviewRequired 산정 기준 분리** (AR2-08):
- 운영 측정(`mediaThresholdAssessment.calendarPolicy="rolling-90-days"`)은 조기경보 입력만. **priorReviewRequired 산정에 직접 사용 금지**
- 법정 산정(`calendarPolicy="previous-3-months-calendar"`)만 priorReviewRequired 판정 입력. legal 검수자가 record에 확정 기록

### 8.2 사전심의 대상인 경우

```
1. legal 검수자 priorReviewRequired=true 기록
2. 운영자가 자율심의기구(대한의사협회·대한치과의사협회·대한한의사협회 등) 제출
3. 제출 ID 기록 — priorReviewSubmissionId
4. 심의 결과 도착 (외부)
5. 통과 — priorReviewPassed=true 기록 + 심의 결과 첨부(attachments[])
6. 거부 — priorReviewPassed=false. 본문 정정 후 재제출 또는 콘텐츠 폐기
7. publishable 조건 § 7.1 (3) 충족
```

### 8.3 priorReview 상태 추적 화면

어드민에 별도 "사전심의 대기" 큐 — 제출 후 결과 도착 전 콘텐츠 표시. `priorReviewSubmissionId` 기준 외부 시스템 추적.

---

## 9. 알림 (notifications Feature Module 인터페이스)

본 문서는 알림 **인터페이스·정책 SoT** — 이벤트 enum·페이로드 타입·이벤트별 채널/우선순위 정책 정의. 실제 발송 구현·재시도·dedupe·digest 큐 등 구현 영역은 `features/notifications.md`.

### 9.1 NotificationEventType enum (canonical SoT)

```ts
type NotificationEventType =
  | "content-gate-queued"           // content-gate 큐 진입
  | "blocked-correction-required"   // automatedDecision="block" fail 발생 — 작성자 정정 요청
  | "stale-queued"                  // stale 큐 진입
  | "warning-queued"                // warning 큐 진입
  | "prior-review-result"           // 사전심의 결과 도착
  | "reviewer-approved"             // 검수자 approve
  | "reviewer-rejected"             // 검수자 reject
  | "publish"                       // 발행 완료
  | "sla-imminent"                  // SLA 24시간 전
  | "sla-overdue"                   // SLA 미달
  // `features/analytics-reporting.md` 1차 cycle cascade (F-2)
  | "analytics-report-ready"        // 리포트 생성 완료·발송
  | "media-threshold-reached"       // 의료법 일평균 이용자 10만 임계 도달 (false → true 전이만)
  | "media-threshold-released"      // 임계 해제 (true → false 전이만, hysteresis 적용)
  // `features/search-visibility.md` 1차 cycle cascade (F-1)
  | "search-visibility-anomaly-critical"     // critical severity anomaly
  | "search-visibility-anomaly-warning"      // warning severity anomaly
  | "search-visibility-monitoring-failed"    // 모니터링 cycle 실패 (모든 source)
  | "ai-briefing-citation-first-detected"    // siteDomain AI 브리핑 인용 첫 등장
  | "ai-briefing-citation-lost"               // 기존 AI 브리핑 인용 N일 연속 미노출
  // `features/keyword-monitoring.md` 1차 cycle cascade (F-1)
  | "keyword-monitoring-rank-improved"        // 사용자 지정 키워드 평균 순위 개선
  | "keyword-monitoring-rank-dropped"         // 평균 순위 하락
  | "keyword-monitoring-impressions-spike"    // 노출수 급증
  | "keyword-monitoring-impressions-drop"     // 노출수 급감
  | "keyword-monitoring-ctr-anomaly"          // CTR 이상 변동
  | "keyword-monitoring-rank-bucket-improved" // rank bucket 상위 진입
  | "keyword-monitoring-rank-bucket-dropped"  // rank bucket 하위 이탈·absent
  | "keyword-monitoring-monitoring-failed"    // 모니터링 cycle 실패
  // `features/asset-ingestion.md` 1차 cycle cascade (F-2)
  | "asset-ingestion-batch-completed"         // 수집 완료
  | "asset-ingestion-batch-failed"            // 수집 실패
  | "asset-ingestion-review-required"         // 검수 큐 진입
  | "asset-ingestion-pii-detected"            // PII 감지 (의료 도메인 critical)
  | "asset-ingestion-asset-promoted"          // Core 데이터 계약 변환 완료
  // `features/crm-sync.md` 1차 cycle cascade (CS1-01)
  | "crm-sync-batch-failed"                   // sync cycle 실패
  | "crm-sync-conflict-detected"              // 양방향 sync 충돌
  | "crm-sync-credential-expired"             // CRM 자격증명 만료
  | "crm-sync-credential-expiring-soon"       // 만료 14일 전
  // `features/content-migration.md` 1차 cycle cascade (CM1-01·10)
  | "content-migration-plan-legal-approved"   // plan legal-reviewer 승인 (의미 분리 — CM1-10)
  | "content-migration-run-completed"
  | "content-migration-run-failed"
  | "content-migration-rollback-triggered"
  | "content-migration-run-aborted"           // CM5-03 — abortRun 강제 종료 (critical)
  | "content-migration-step-compensated";     // CM5-03 — markStepCompensated (high inApp)
```

### 9.1.1 이벤트 정책 매트릭스 (canonical SoT)

이벤트별 수신자·즉시 채널·digest 주기·critical 분류·quietHours·opt-out 정책의 **단일 정의표**. § 3.3 우선순위·SLA의 "권장 알림" 컬럼은 본 표를 따른다.

| eventType | 한국어 이벤트명 | 수신자 산정 | 즉시 채널 | fallback 채널 (hard-suppressed 시) | digest 주기 | criticality | quietHoursPolicy | optOutPolicy |
|---|---|---|---|---|---|---|---|---|
| `content-gate-queued` | content-gate 큐 진입 | finalRoles[] 매칭 검수자 (operator + 등급 기본 medical + 룰 추가 역할 합집합) | email + slack + inApp | inApp | — | **critical** | bypass (보류 안 함) | mandatory (옵트아웃 불가) |
| `blocked-correction-required` | blocked 정정 요청 | 작성자 + operator | email + slack + inApp | inApp | — | **critical** | bypass | mandatory |
| `stale-queued` | stale 큐 진입 | `staleFlags.<role>=true` 매칭 검수자 | inApp | (없음 — inApp만) | email — 의료법 개정은 일일, 기타는 주간 | high | respect (사용자 quietHours 보류) | digestOptOut 허용 (단 의료법 개정 stale은 mandatory) |
| `warning-queued` | warning 큐 진입 | operator | inApp | (없음) | email 일일 요약 | normal | respect | digestOptOut 허용 |
| `prior-review-result` | 사전심의 결과 도착 | 운영자 + legal 검수자 | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `reviewer-approved` | 검수자 approve | 작성자 + 운영자 | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `reviewer-rejected` | 검수자 reject | 작성자 | email + inApp | inApp | — | high | respect | mandatory |
| `publish` | 발행 완료 | 운영자 + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `sla-imminent` | SLA 24시간 전 | 검수자 + 운영팀 | email + inApp | inApp | — | high | respect | mandatory |
| `sla-overdue` | SLA 미달 | 운영팀 (에스컬레이션) | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `analytics-report-ready` | 분석 리포트 발송 | 템플릿 `recipients[]` 산정(operator·client-approver 등) | email + inApp | inApp | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `media-threshold-reached` | 일평균 이용자 10만 임계 도달 | operator + legal 검수자 + client-approver | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `media-threshold-released` | 임계 해제 | operator + legal 검수자 + client-approver | email + inApp | inApp | — | high | respect | mandatory |
| `search-visibility-anomaly-critical` | 검색 가시성 critical anomaly | operator + client-approver | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `search-visibility-anomaly-warning` | 검색 가시성 warning anomaly | operator | inApp | (없음) | email 일일 요약 | high | respect | digestOptOut 허용 |
| `search-visibility-monitoring-failed` | 모니터링 cycle 실패 (전 source) | operator | email + inApp | inApp | — | high | respect | mandatory |
| `ai-briefing-citation-first-detected` | AI 브리핑 인용 첫 등장 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `ai-briefing-citation-lost` | AI 브리핑 인용 상실 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
| `keyword-monitoring-rank-improved` | 키워드 순위 개선 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `keyword-monitoring-rank-dropped` | 키워드 순위 하락 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
| `keyword-monitoring-impressions-spike` | 키워드 노출 급증 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `keyword-monitoring-impressions-drop` | 키워드 노출 급감 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
| `keyword-monitoring-ctr-anomaly` | 키워드 CTR 이상 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
| `keyword-monitoring-rank-bucket-improved` | 키워드 rank bucket 상위 진입 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `keyword-monitoring-rank-bucket-dropped` | 키워드 rank bucket 하위/absent | operator + client-approver | email + inApp | inApp | — | high (critical when bucket→absent) | respect | mandatory |
| `keyword-monitoring-monitoring-failed` | 키워드 모니터링 cycle 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
| `asset-ingestion-batch-completed` | 수집 완료 | operator | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `asset-ingestion-batch-failed` | 수집 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
| `asset-ingestion-review-required` | 검수 큐 진입 | operator | inApp | (없음) | email 일일 요약 | normal | respect | digestOptOut 허용 |
| `asset-ingestion-pii-detected` | PII 감지 | operator + legal 검수자 | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `asset-ingestion-asset-promoted` | Core 변환 완료 | operator | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `crm-sync-batch-failed` | CRM sync 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
| `crm-sync-conflict-detected` | CRM 충돌 감지 | operator | email + inApp | inApp | — | high | respect | mandatory |
| `crm-sync-credential-expired` | CRM 자격증명 만료 | operator + super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `crm-sync-credential-expiring-soon` | 만료 14일 전 | operator + super-admin | email + inApp | inApp | — | high | respect | mandatory |
| `content-migration-plan-legal-approved` | content-migration plan legal 승인 | super-admin | email + inApp | inApp | — | high | respect | mandatory |
| `content-migration-run-completed` | content-migration apply 완료 | super-admin | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `content-migration-run-failed` | content-migration apply 실패 | super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `content-migration-rollback-triggered` | rollback 실행 | super-admin | email + inApp | inApp | — | high | respect | mandatory |
| `content-migration-run-aborted` | run 강제 종료 (abortRun) | super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `content-migration-step-compensated` | manual compensation 적용 (markStepCompensated) | super-admin | inApp | (없음) | (옵션) email 일일 요약 | high | respect | digestOptOut 허용 |

- **fallback 채널 컬럼**: 즉시 채널 중 일부가 `hard-suppressed` 상태일 때 본 컬럼의 채널로 자동 라우팅. **fallback 채널은 본 매트릭스의 정식 SoT** — 즉시 채널 외부의 임의 추가 금지. fallback도 hard-suppressed면 외부 monitoring sink alert만 발생 (recipient 발송 대체 아님, `features/notifications.md` § 7.3)

- **criticality**: `critical` 이벤트는 사용자 quietHours·opt-out·인스턴스 운영시간(LocationProfile.businessHours)을 우회. 단, **inactive 사용자·인스턴스 채널 비활성·idempotency·dedupe는 우회하지 않음** (`features/notifications.md` § 4.1·§ 8.3 필터 순서). `high`는 사용자 quietHours 보류, `normal`은 전체 정책 적용
- **수신자 산정 규칙**: `eventType` → eligible AdminUserRole (§ 11.1) → ApproverRole 자격 (§ 11.2 ⚠️ 자격 검증) → 인스턴스 멤버십 → AdminUser.notificationPreferences 필터 (`features/notifications.md` § 4.1)
- **`recipientRole="author"` 산정 (`blocked-correction-required` 등)**: 콘텐츠의 작성자 AdminUser ID는 워크플로 transition actorId 또는 콘텐츠 `@createdBy`(어드민 DB) 기준. AdminUser가 아닌 외부 작성자(예: 클라이언트 직접 입력 콘텐츠)에는 본 이벤트 발송 금지 — operator로 fallback 후 operator가 작성자에게 별도 전달 (운영 정책)
- **multi-location 인스턴스의 locationRef**: NotificationEvent에 `metadata.locationRef`(LocationProfile @id) 권장. 호출자(REVIEW_WORKFLOW transition)가 콘텐츠 소속 location을 산정·전달. 미해결 시 LocationProfile `main=true` fallback (`features/notifications.md` § 8.4 client-approver businessHours 정책 입력)

### 9.2 알림 페이로드

본 절은 두 단계 타입을 정의:
- **NotificationEvent** — 워크플로 트리거(`features/notifications.md` notify() 입력)에서 발생한 envelope. 1 event → N recipients
- **NotificationPayload** — 본 Feature 내부 fan-out 결과 (per-recipient 발송 단위)

```ts
type NotificationEvent = {
  eventId: string;                                     // UUID — 본 envelope 고유 ID (notify() 생성 또는 호출자 제공)
  sourceEventId: string;                               // 워크플로 transition id 또는 호출자 idempotency key (필수 — § 9.2.1 idempotency 계약)
  eventType: NotificationEventType;                    // § 9.1 enum
  contentRef: string;                                  // 대상 콘텐츠 @id
  contentTitle: string;
  recipients: NotificationRecipient[];                 // 다수 수신자 fan-out
  criticality: "critical" | "high" | "normal";         // § 9.1.1 매트릭스에서 자동 산정 가능. 호출자가 override 가능
  metadata: object;                                    // 이벤트별 추가 데이터 (예: rejectReason·staleTriggeredBy·priorReviewSubmissionId)
  createdAt: ISODateString;
};

type NotificationRecipient = {
  recipientId: string;                                 // AdminUser @id (DATA_MODEL C-23)
  recipientRole: ApproverRole | "author" | "operations";  // 표시·라우팅용 컨텍스트
};

type NotificationPayload = {
  payloadId: string;                                   // UUID — fan-out 단위 ID
  eventId: string;                                     // 상위 NotificationEvent 참조
  eventType: NotificationEventType;
  contentRef: string;
  contentTitle: string;
  recipientId: string;                                 // 단건 수신자
  recipientRole: ApproverRole | "author" | "operations";
  ctaUrl: string;                                      // 어드민 검수 화면 URL (notify()가 채움)
  criticality: "critical" | "high" | "normal";
  metadata: object;
  createdAt: ISODateString;
};
```

#### 9.2.1 idempotency 계약

- `sourceEventId`는 호출자(워크플로 transition·SLA 스케줄러)가 결정적으로 생성. 동일 transition은 항상 동일 ID
- `features/notifications.md` notify()는 동일 `sourceEventId` 재호출 시 기존 DeliveryResult 반환 (재발송 없음, 단 외부 강제 재시도 액션은 § 8 별도 흐름)
- 권장 패턴: `sourceEventId = hash(eventType + contentRef + workflowTransitionTimestamp)` (호출자 책임)

### 9.3 알림 채널·운영

- 채널 활성화는 인스턴스별 (`InstanceManifest.notificationChannels` — DATA_MODEL C-08 v0.9 +)
- 이메일 발송 실패 시 재시도 정책은 `features/notifications.md` § 7.1 채널별 분류표 적용
- in-app 알림은 어드민 종 아이콘에 미확인 카운트 표시 (NotificationInbox — `features/notifications.md` § 5.3·§ 14)
- Slack은 **2가지 동작 모드 분기**:
  - **per-recipient 모드** — AdminUser.slackUserId(DATA_MODEL C-23) 존재 시. mention 포함 발송. recipient 단위 dedupe·opt-out·quietHours·suppression 정상 적용
  - **broadcast 모드** — slackUserId 미보유 시. workspace channel에 envelope 1건 게시 (per-recipient 추적 불가). `criticality=critical` 이벤트만 broadcast 허용. DeliveryResult 소비 규칙: `broadcastDeliveries[]`가 성공/실패 집계 SoT, `perRecipient[].deliveries[].status=skipped-broadcast-only`는 placeholder (성공/실패 집계 대상 아님). 상세: `features/notifications.md` § 5.2·§ 3.2

---

## 10. 감사 로그 (Audit Log)

### 10.1 기록 대상

- 모든 워크플로 상태 전이
- 모든 검수자 액션 (approve·reject·request-changes·delegate)
- ComplianceRecord 슬롯 갱신
- staleFlags 발생·해제
- publish·unpublish
- 권한 변경·로그인·로그아웃
- **알림 발송 결과 요약** — `notification-dispatched`(전체 fan-out 결과 1건). 채널별 상세(attempts·provider response·delivery latency)는 `features/notifications.md` § 9.2 NotificationLog가 SoT. audit log는 비즈니스 액션 추적, NotificationLog는 운영 메트릭 추적

### 10.2 audit log 페이로드

```ts
type AuditLogEntry = {
  id: string;                 // UUID
  timestamp: ISODateString;
  actorId: string;             // 사용자 ID 또는 "system" (자동 트리거)
  actorRole: AdminUserRole;
  action: AuditAction;          // § 10.2.1 enum
  contentRef: string;
  fromState?: ContentWorkflowState;
  toState?: ContentWorkflowState;
  metadata: object;             // 액션별 컨텍스트 (예: rejectReason·legalCounselNote·notificationEventId)
};
```

#### 10.2.1 AuditAction enum

```ts
type AuditAction =
  | "approve" | "reject" | "request-changes" | "delegate"
  | "publish" | "unpublish"
  | "stale-triggered" | "stale-resolved"
  | "compliance-record-updated"
  | "permission-changed" | "login" | "logout"
  | "notification-dispatched"               // 알림 발송 envelope 종료 요약
  | "notification-resend-attempted"         // DLQ에서 운영자 수동 재발송 시도 (`features/notifications.md` § 7.2)
  | "notification-read"                      // 사용자가 inApp 알림 클릭·읽음 마킹 시 (`features/notifications.md` § 5.3)
  | "notification-suppression-unsuppressed"   // 운영자가 hard-suppressed AdminUser 채널을 수동 해제 (`features/notifications.md` § 7.4)
  | "search-visibility-retroactive-enqueue-requested"   // 운영자가 search-visibility retroactive outbox enqueue 명시 액션 (`features/search-visibility.md` § 7.5)
  // `features/keyword-monitoring.md` 1차 cycle cascade (F-15)
  | "keyword-tracking-target-registered"      // 키워드 추적 등록 (operator·super-admin)
  | "keyword-tracking-target-unregistered"    // 추적 해제 (soft delete — active=false)
  | "keyword-anomaly-resolution-updated"      // KeywordAnomalyRecord.resolutionStatus 갱신
  | "keyword-monitoring-retroactive-enqueue-requested"   // 운영자 retroactive outbox enqueue 명시 액션
  | "keyword-tracking-target-migrated-v02-v03"           // v0.2→v0.3 데이터 모델 migration (`features/keyword-monitoring.md` § 10.3)
  // `features/asset-ingestion.md` 1차 cycle cascade (F-4)
  | "asset-ingestion-source-registered"       // IngestionSource 등록
  | "asset-ingestion-source-unregistered"     // soft delete
  | "asset-ingestion-asset-promoted"          // Core 데이터 계약 변환
  | "asset-ingestion-asset-rejected"          // 검수 거부
  | "asset-ingestion-pii-redacted"            // PII 자동·수동 redaction
  // `features/crm-sync.md` 1차 cycle cascade (CS1-01·16)
  | "crm-integration-registered"              // CRM 연동 등록
  | "crm-integration-unregistered"            // soft delete
  | "crm-sync-conflict-resolved"              // 충돌 운영자 해결
  | "crm-credential-rotated"                  // 자격증명 rotation
  // `features/crm-sync.md` 3차 cycle cascade (CS3-11)
  | "crm-rrn-false-positive-recovered"        // RRN false positive 복구 (recoverRrnFalsePositive override-and-fetch)
  | "crm-rrn-rejection-finalized"             // RRN 복구 포기·확정 (abandon)
  | "crm-consent-withdrawal-applied"          // 환자 동의 철회 적용 (displayHints nulling + sync skip) — CS3-05
  // `features/content-migration.md` 1차·3차 cycle cascade (CM1-02·10·CM3-01)
  | "content-migration-plan-defined"          // plan 정의
  | "content-migration-plan-validated"        // plan 검증
  | "content-migration-plan-legal-approved"   // legal-reviewer 승인 게이트
  | "content-migration-dry-run-completed"     // CM3-01 — DryRunReport 완료
  | "content-migration-run-started"           // apply 실행 시작
  | "content-migration-run-paused"            // CM3-01
  | "content-migration-run-resumed"           // CM3-01
  | "content-migration-rollback-triggered"    // CM3-01 — rollback 시작
  | "content-migration-run-completed"
  | "content-migration-run-failed"
  | "content-migration-run-cancelled"
  | "content-migration-rollback-applied"
  | "content-migration-step-skipped"          // irreversible step skip
  | "content-migration-step-compensated"      // CM4-05 — markStepCompensated
  | "content-migration-run-aborted";          // CM4-05 — abortRun
```

> 알림 발송의 channel별 attempt·재시도·DLQ·deduped 이력은 audit log에 누적하지 않는다 (운영 노이즈 회피). `features/notifications.md` § 9.2 NotificationLog가 운영 메트릭 SoT. audit log는 envelope 단위 요약·재발송 액션·읽음 액션만 기록.

### 10.3 불변성·보존

- audit log는 **append-only** — 수정·삭제 불가
- 보존 기간: 최소 7년 (의료법 광고 기록 보관 권장 + 일반 사업 감사 요건)
- 외부 export — JSON·CSV 형식 (운영 정책별)

---

## 11. 권한·역할

### 11.1 AdminUserRole enum

```ts
type AdminUserRole =
  | "super-admin"        // 모든 권한 (Glitzy 운영팀)
  | "operator"            // 일반 운영자 — 작성·검수 큐 처리·발행
  | "physician-reviewer"  // medical 역할 검수만
  | "legal-reviewer"      // legal 역할 검수만
  | "client-approver"     // client 역할 최종 확인만 (클라이언트 의료기관 측)
  | "system";             // 시스템 자동 트리거 (audit log actor) — 사용자 로그인 불가, AdminUser DB row 미생성. actorRole 표기 전용
```

### 11.2 권한 매트릭스

| 액션 | super-admin | operator | physician | legal | client |
|---|:---:|:---:|:---:|:---:|:---:|
| 콘텐츠 작성·편집 | ✅ | ✅ | | | |
| 검수 요청 (draft→review-queued) | ✅ | ✅ | | | |
| operator approve | ✅ | ✅ | | | |
| medical approve | ⚠️ (자격 충족 시) | | ✅ | | |
| legal approve | ⚠️ (자격 충족 시) | | | ✅ | |
| client approve | ⚠️ (자격 충족 시) | | | | ✅ |
| publish | ✅ | ✅ | | | |
| unpublish | ✅ | | | | |
| 권한 관리 | ✅ | | | | |
| audit log 조회 | ✅ | 자신 액션만 | 자신 액션만 | 자신 액션만 | 자신 액션만 |

> ⚠️ **super-admin 자격 우회 금지**: super-admin이라도 medical/legal/client 역할의 approve 시도 시 **해당 역할 자격 검증 필수** — `RISK_LEVELS § 4.1·§ 4.2·§ 4.4`의 자격 요건:
> - medical: DoctorProfile (C-02) 등록 + `credentials[]` 항목으로 의료진 자격 인증 검증
> - legal: 사내 법무 또는 외부 법무법인 식별 (DATA_MODEL 후속 — RISK_LEVELS RL-04)
> - client: 클라이언트 측 위임 권한 (RL-05)
>
> 자격 미충족 시 403 Forbidden. 권한 모델이 승인 자격 모델을 우회하지 않도록 게이트 분리 운영.
>
> **자격 검증 알고리즘 구현 영역**: medical 도메인 자격 매칭(한의 콘텐츠 → 한의사 등) 자동 판정은 RISK_LEVELS RL-03 미결정 영역. v1.0에서는 어드민 운영자가 자격 매칭 수동 검증·기록.

### 11.3 역할 위임

- 동일 역할 내 위임 (delegate)만 허용. 예: physician-reviewer A → B
- 다른 역할로의 위임 금지 — 검수 자격 분리 원칙

---

## 12. 빌드 검증 — 룰 레벨

| 레벨 | 본 문서 영역 |
|---|---|
| **fail** | 권한 enum 위반, 상태 전이 위반(예: blocked → published), 사전심의 필수 콘텐츠가 priorReviewPassed 없이 발행, finalRoles 미충족 publish 시도 |
| **warning** | SLA 임박·미달, audit log 누락, ComplianceRecord 슬롯 비정상 갱신 (timestamp 누락 등) |
| **content-gate** | (본 문서는 워크플로 메타 영역 — content-gate 적용 없음) |

---

## 13. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| AW-01 | 검수자 라운드로빈 알고리즘 (assign 자동화) — FIFO vs 워크로드 기반 | M2+ |
| AW-02 | SLA 미달 자동 에스컬레이션 — 슈퍼 어드민 자동 승계 vs 알림만 | 운영 정책 결정 |
| AW-03 | 외부 법무법인 식별자 데이터 모델 (RISK_LEVELS RL-04와 동일) | DATA_MODEL 후속 |
| AW-04 | client-approver의 위임자 데이터 모델 (RL-05와 동일) | DATA_MODEL 후속 |
| AW-05 | staleFlags 병렬 vs 직렬 처리 정책 (§ 6.3) | 인스턴스 옵션 |
| AW-06 | unpublish 별도 상태 vs draft 환원 (§ 7.3) | UX 결정 |
| AW-08 | 검수자 코멘트·내부 메모 데이터 모델 (audit log 외 별도 저장) | M2+ |
| AW-09 | warning 강제 처리 정책 — instance manifest 옵션 (§ 3.1.1) | 운영 정책 |

---

### 13.1 해소된 미결정

| ID | 항목 | 해소 |
|---|---|---|
| ~~AW-10~~ | PreComplianceRecord vs C-10 publishedAt optional | v0.3 — DATA_MODEL C-10 v0.8 cascade로 `recordPhase: "pre-publish" \| "published"` 필드 신설. `publishedAt`·`publishedBy`는 recordPhase별 required 분기. 별도 PreComplianceRecord 신설 없음 |
| ~~AW-11~~ | StaleFlagsRegistry 데이터 모델 | v0.3 — DATA_MODEL C-10 staleFlags 정의 명시 cascade로 published record 내 staleFlags만 mutable. 별도 registry 신설 없음 |
| ~~AW-07~~ | InstanceManifest.notificationChannels 필드 | v1.0 — DATA_MODEL C-08 v0.9 cascade로 `notificationChannels` 필드 신설 (email·slack.webhookUrl·inApp) |

## 14. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 — 상태 머신 9종(draft·review-queued·in-review·approved·publishable·published·blocked·rejected·stale), 검수 큐 3종(content-gate·warning·stale), multi-role AND 게이트(RISK_LEVELS § 4.5 정합), ComplianceRecord 슬롯 채움 흐름, StaleFlags 처리, publishable 산정 알고리즘, 사전심의 흐름, notifications 인터페이스, 감사 로그(append-only·7년 보존), 권한 매트릭스 5종, 빌드 검증 룰 |
| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) § 2.1·§ 4.1 `automatedDecision pass` 잔재 정정 — `!== "block"`로 통일, (2) **DATA_MODEL C-10 v0.8 cascade** — `warningAcknowledgements: WarningAcknowledgement[]` 필드 + 하위 타입 신설 (findingId·action·operatorId·timestamp·note). § 3.1.1 참조 정정, (3) § 8.1 `priorReviewRequired=false` 판정도 법무 기록 의무 명시 — `legalCounsel`·`legalCounselAt`·근거 attachments[] 모두 필수 (MEDICAL_AD § 4.2 정합), (4) **DATA_MODEL C-08 v0.9 cascade** — `notificationChannels` 필드 신설 (email·slack.webhookUrl·inApp). AW-07 해소 |
| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (7개 지적 전건 수용)**: (1) § 2.3 `approved → publishable` 전이 조건을 § 7.1 6조건 모두 명시로 정정 — 표만 보고 publishable 과소 판정 회피, (2) warning 큐 진입 조건에서 "content-gate 미발생" 잔재 제거 — § 3.1.2 동시 진입과 정합, (3) § 3.3 SLA 표 분리 — blocked는 큐 아닌 정정 흐름. content-gate P0 일원화, (4) § 0 publishable "automatedDecision pass" → `!== "block"`로 통일 — gate/warn 콘텐츠도 사람 검수·정책 처리로 publishable 가능, (5) § 2.3 `blocked → review-queued` 전이 추가 — 사후 fail 작성자 정정 후 직접 재제출, 의료법 개정 트리거 자동 큐 진입 경로, (6) § 8.1 priorReviewRequired 판정 진입 경로 명시 — 모든 콘텐츠 대상 자동 후보 플래그 + legal 검수자 임시 추가로 매체 판정 → true 시 정식 finalRoles 포함·false 시 제거, (7) § 6.2 stale 해제 평가 기준 명확화 — active(현재 사이클) pre-publish record staleFlags 기준. 이전 published record는 audit 보존 |
| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (6개 지적 전건 수용)**: (1) § 0 요약 multi-role AND 게이트(approved 전이) vs publishable 6조건 분리 명시. finalRoles 슬롯 완료만으로 publishable 우회 해석 회피, (2) § 5.2·§ 5.3 ComplianceRecord 생명주기 표현 단일화 — publish 시 동일 record의 `recordPhase`만 전환 (record ID 보존). 복사 없음, (3) **DATA_MODEL C-10 v0.8 cascade — `recordVersion: integer` 필드 신설**. 재검수 시 새 record(ID·version 증가) 생성. § 5.4 record version 모델 명시, (4) § 6.2 StaleFlagsRegistry 잔존 정정 — 기존 published record staleFlags 갱신 + 새 pre-publish record 생성으로 재검수 진행. publishable 산정은 새 record staleFlags 기준, (5) § 2.3 blocked > stale 우선순위 명시 — published → blocked 사후 fail 시 즉시 unpublish 우선 (의료광고 fail 사용자 노출 위험 회피). fail·stale 동시 발생 시 blocked 항상 우선, (6) § 3.1.2 content-gate + warning 동시 발생 처리 — 두 큐 독립 진입·publishable에서 양쪽 평가, (7) **RISK_LEVELS § 4.1 cascade** — `licenseNumber` → `credentials[]`로 정정 (DATA_MODEL 정합) |
| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (6개 지적 전건 수용)**: (1) § 0·§ 3.1 content-gate 큐와 fail finding 분리 명확화 — fail은 `blocked` 정정 흐름, 큐 진입 아님, (2) § 4.1 AND 게이트 알고리즘 정정 — approved는 사람 검수 슬롯만 평가, priorReview·staleFlags 등은 publishable 조건으로 분리. 단계 분리 보장, (3) **DATA_MODEL C-10 v0.8 cascade** — `recordPhase: "pre-publish" \| "published"` 필드 신설. `publishedAt`·`publishedBy` recordPhase별 required 분기. 본 문서 § 5.2 PreComplianceRecord 별도 신설 제거 (AW-10 해소), (4) **DATA_MODEL C-10 staleFlags cascade** — published 후에도 갱신 허용 영역으로 명시. 별도 StaleFlagsRegistry 신설 제거 (AW-11 해소). § 5.4 record 불변성 + staleFlags 예외 명시, (5) § 11.2 super-admin 자격 검증 알고리즘 — DoctorProfile `credentials[]` 사용 명시 (licenseNumber 직접 필드 부재). RL-03·RL-04·RL-05 후속 영역 명시. v1.0에서는 수동 검증·기록, (6) § 3.1 검수 큐 표 구조 정리 — stale 행을 표 안으로 이동 |
| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1)·(2) § 2.3 상태 전이 완전화 — `blocked → draft`·`rejected → draft`/`review-queued` 분리·`request-changes` 전이·`published → blocked` 사후 fail·`published → stale` 우선순위 추가, (3) § 3.1.1 warning 큐 이탈 조건·기록 슬롯 신설 (acknowledged·resolved). § 7.1 (6) publishable 조건 추가, (4) § 4.1 AND 게이트 평가 알고리즘 정밀화 — priorReview·LegalDocument legal 자동 추가 + approved vs publishable 시점 분리 명시, (5) § 4.1 riskLevel 출처 명시 — `ComplianceRecord.pageRiskLevel` (RiskInference MAX 결합 결과), (6) § 7.1 LegalDocument 조건 — `legalCounsel` + `legalCounselAt` 둘 다 필수. 각 역할 매핑 timestamp 필드도 모두 명시, (7) § 5.2 ComplianceRecord 생명주기 2단계 분리 — pre-publish(mutable) vs published(immutable). C-10 required 필드 충돌 해소(AW-10), (8) § 5.4 staleFlags를 별도 `StaleFlagsRegistry` 컬렉션으로 분리 — published record 불변성 보장(AW-11), (9) § 6.2 stale 처리 흐름 명확화 — published 표면 유지·재발행 명시 액션 필요·이전 record audit log 보존, (10) § 4.1·§ 8 사전심의와 publishable 결합 명시 — `priorReviewRequired=true` 시 finalRoles에 legal 자동 추가, (11) § 3.1·§ 9.1 content-gate 큐 처리자·알림 수신자를 `finalRoles[]` 기준으로 정정 — operator·등급 기본 medical 포함, (12) § 11.2 super-admin 자격 우회 금지 — medical/legal/client approve 시 RISK_LEVELS § 4 자격 검증 필수 |


 succeeded in 681ms:
# Feature — content-migration

> **상태**: Draft v0.6 (codex 자동 비평 5차 반영 — 8개 지적 전건 수용. v1.0 안정판 후보)
> **작성일**: 2026-05-15
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 11.1
> **목적**: 솔루션 **내부** 콘텐츠·데이터 마이그레이션. application-level data migration·feature 활성화 backfill·인스턴스 간 복제·콘텐츠 일괄 변환·policy 재평가·routing slug 보존.
> **연관 SoT**:
> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (4종 NotificationEventType + **13종 AuditAction** cascade 완료)
> - 자격증명·식별자·policyVersion → DATA_MODEL C-08 v0.22 (`contentMigrationConfig`·`contentMigrationPolicyVersion`·`featureLegalApproved`·`piiFieldCatalogRef`·`entityFieldProjectionCatalogRef`)
> - 페이지·콘텐츠·ComplianceRecord schema → DATA_MODEL Core
> - compliance-assistant `check()` (policy-version-reevaluate)
> - asset-ingestion handoff → § 1.3
> - retry queue·outbox worker SQL → 본 문서 § 4.6·§ 12.6 자체 전개

---

## 0. 한 페이지 요약

- **Feature 식별자**: `content-migration`
- **핵심 책임**: (a) migration plan 정의·validate·dry-run·legal-gate·apply, (b) rollbackClass 강제 + writeSetManifest strategy별 partial write 감지, (c) read-only window writeClass 7종 세분화, (d) ApplyPreflightToken (8필드 server-side CAS), (e) policy-version-reevaluate risk-based + PolicyReevaluateResult 비교, (f) deterministic legalImpactClassifier + PII·entity field catalog SoT, (g) Run status primaryStatus + substate
- **vs asset-ingestion**: asset-ingestion=외부→솔루션 raw + promote. 본 Feature=promote 이후 정렬·slug/redirect·승계·instance copy·policy 재평가. body MV 직접 수정 금지
- **vs DB DDL**: DDL은 인프라. 본 Feature는 데이터 backfill만
- **migration plan kind 6종**: `application-data-version-upgrade`·`feature-activation-backfill`·`instance-to-instance-copy`·`content-bulk-transform`·`policy-version-reevaluate`·`routing-slug-preservation`
- **rollbackClass 3종**: `reversible`·`compensating`·`irreversible` (자동 skip 금지·blocked-manual-remediation-required)
- **DB 인벤토리 (CM5-01 정정)**: **12 tables** (§ 12.1 ~ § 12.12 — PolicyReevaluateRecord 별도 table 승격·ActiveTargetLock 신설)

---

## 1. 일반 규약

### 1.1 변경 정책 (CM3-18 catalog 추가)

| 변경 유형 | 패키지 SemVer | policyVersion | 동반 cascade |
|---|---|---|---|
| 입력/출력 인터페이스 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9·§ 10 |
| migration plan kind 추가 (legal/read-only/rollback/dry-run output 영향 없을 시) | MINOR | 별개 | step type registry |
| migration plan kind 추가 (영향 동반) | **MAJOR** | policyVersion 신규 | |
| migration plan kind 제거 | **MAJOR** | 별개 | |
| step type 추가 (rollbackClass·reverse-step 정의 통과) | MINOR | 별개 | |
| step type 추가 (dry-run report schema 변경) | **MAJOR** | policyVersion 신규 | |
| 알림 매트릭스 변경 | **MAJOR** | policyVersion 신규 | |
| rollback 알고리즘·rollbackClass enum 변경 | **MAJOR** | policyVersion 신규 | |
| legalImpactClassifier 룰 추가·강화 (fail-closed 강도 증가) | MINOR | 별개 | |
| legalImpactClassifier 룰 완화·class 제거 | **MAJOR** | policyVersion 신규 | 법무 승인 |
| **PII field catalog 변경** (CM3-18) | **MAJOR** | policyVersion 신규 | DATA_MODEL `piiFieldCatalogRef` 갱신 + 영향 plan 재평가 |
| **entity field projection catalog 변경** (CM3-18) | **MAJOR** | policyVersion 신규 | DATA_MODEL `entityFieldProjectionCatalogRef` 갱신 |
| **priorReviewRequired trigger catalog 변경** (CM3-18) | **MAJOR** | policyVersion 신규 | classifierVersion bump |
| CAS digest algorithm·projection 변경 | **MAJOR** | policyVersion 신규 | 기존 DryRunReport 무효 |
| reportingMode default 변경 | **MAJOR** | policyVersion 신규 | |
| read-only window writeClass 세분화·정책 변경 | **MAJOR** | policyVersion 신규 | |
| irreversible skip 정책 변경 | **MAJOR** | policyVersion 신규 | |
| writeSetManifest schema 변경 | **MAJOR** | policyVersion 신규 | |
| Run status enum·substate 변경 | **MAJOR** | policyVersion 신규 | |
| ApplyPreflightToken algorithm 변경 | **MAJOR** | policyVersion 신규 | |
| **writeSetManifest strategy semantic 변경** (isolation·concurrency·watermark 의미 변경 — CM4-14) | **MAJOR** | policyVersion 신규 | |
| **policy-reevaluate reportingMode decision rule 변경** (CM4-14) | **MAJOR** | policyVersion 신규 | |
| **staleFlagsOnlyOverrideConditions 입력 변경** (CM4-14) | **MAJOR** | policyVersion 신규 | |
| **ActiveTargetLock kind enum 추가·writeSetScopeDigest 산정 변경** (CM4-06) | **MAJOR** | policyVersion 신규 | |
| build/runtime/migration fail 룰 추가·강화 | **MAJOR** | 별개 | |
| runtime invariant·reconcile 룰 추가·강화 | MINOR | 별개 | |
| warning·지표·acceptance test 추가 | PATCH | 별개 | |

### 1.2 SoT 원칙

- 알림·audit canonical → notifications + REVIEW_WORKFLOW
- 자격증명·policyVersion·catalog refs → DATA_MODEL C-08 v0.22
- 페이지·콘텐츠·ComplianceRecord → DATA_MODEL Core
- 정책 재평가 → compliance-assistant `check()` (본 문서 § 4.8 batch contract SoT)
- 본 문서 = plan/step/파이프라인·rollbackClass·writeSetManifest·CAS digest·legalImpactClassifier rule·read-only writeClass·step registry 최소 계약·privacy·NotificationEvent mapping SoT

### 1.2.1 retry taxonomy

| 큐 | maxAttempts | backoff |
|---|---|---|
| ContentMigrationStepRetryQueue | config(기본 3) | [60, 600, 3600]s |
| ContentMigrationNotificationOutbox | 상수 5 | § 4.6 자체 SQL — backoff [60, 300, 1800, 7200, 21600]s |

### 1.3 본 문서가 다루지 않는 영역

| 영역 | 책임 |
|---|---|
| 외부 raw 수집·parsing·PII·promote | asset-ingestion |
| promote 이후 Core row 정렬·slug/redirect·검수 이력 승계·instance copy·policy 재평가 | 본 Feature |
| asset-ingestion body materialized view 직접 변경 | **금지** — raw source 또는 approved redaction op 경유만 |
| DB DDL | 인프라 |
| 알림 채널·재시도·digest | notifications |
| 운영자 검수 큐 상태 머신 | REVIEW_WORKFLOW (policy-reevaluate가 ComplianceRecord 재생성 시 새 lifecycle 진입) |
| 페이지·콘텐츠 schema 자체 | DATA_MODEL |

---

## 2. Feature 정의

### 2.1 기본 메타

```yaml
name: "content-migration"
specVersion: "0.6"
coreRequiresMin: "1.0.0"
implementationKind: "node-module"
activation: { scope: "instance", default: false }
```

### 2.2 의존성

| 영역 | 의존 |
|---|---|
| notifications | notify() 필수 |
| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 4종 NotificationEventType |
| REVIEW_WORKFLOW § 10.2.1 | 13종 AuditAction |
| DATA_MODEL C-08 v0.22 | `contentMigrationConfig`·`featureLegalApproved`·`piiFieldCatalogRef`·`entityFieldProjectionCatalogRef`·`contentMigrationPolicyVersion` |
| compliance-assistant § 3.3·§ 8 | check() + cacheKey |
| asset-ingestion | promote handoff + body MV 보호 |

### 2.3 InstanceManifest 통합

```yaml
contentMigrationConfig:                                 # DATA_MODEL C-08 v0.22
  featureLegalApproved: true
  featureLegalApprovedBy: "legal@glitzy.kr"
  featureLegalApprovedAt: "2026-05-10T00:00:00Z"
  defaultMode: "dry-run"
  approvalRequired:
    applicationDataVersionUpgrade: super-admin
    featureActivationBackfill: super-admin
    instanceToInstanceCopy: [super-admin, legal-reviewer]
    contentBulkTransform: super-admin
    policyVersionReevaluate: super-admin
    routingSlugPreservation: super-admin
  legalImpactClassifierRef: "lic-2026-05-15"
  piiFieldCatalogRef: "pii-cat-2026-05-15"              # CM3-05
  entityFieldProjectionCatalogRef: "efp-cat-2026-05-15" # CM3-05

contentMigrationPolicyVersion: "cm-2026-05-15"

features:
  - name: "content-migration"
    version: "0.6.0"
    enabled: true
    requiresFeature: [notifications]
    config:
      execution:
        maxParallelSteps: 5
        stepTimeoutSeconds: 3600
        readOnlyWindow:
          enabled: false
          allowedWriteClasses: ["audit-append", "notification-emit-outbox"]      # CM3-03 — dispatch 제거
          blockedWriteClasses: ["content-mutating", "workflow-state", "feature-operational", "notification-read-receipt", "notification-digest-state"]
          dispatchAllowlist:                            # CM3-03 + CM4-13 — REVIEW_WORKFLOW § 9.1.1 derived rule + hash drift 방지
            # derived rule: criticality ∈ {high, critical} (REVIEW_WORKFLOW § 9.1.1 SoT)
            - "content-migration-run-failed"
            - "content-migration-rollback-triggered"
            - "content-migration-plan-legal-approved"
          dispatchAllowlistPolicySnapshot: "rw-policy-2026-05-15"   # CM4-13 — REVIEW_WORKFLOW snapshot hash. drift 시 build fail
          dispatchOtherEventsQueueUntilWindowEnd: true
      retry:
        maxAttempts: 3
        backoffSeconds: [60, 600, 3600]
      rollback:
        autoRollbackOnFailure: false
        rollbackTimeoutSeconds: 7200
        retryExhaustedAction: "pause"
      dryRun:
        reportRetentionDays: 30
        impactSamplingMode: "deterministic-stratified"
        impactSamplingSize: 100
        criticalClassFullDiff: true
        digest:
          chunkSize: 10000
          maxRowsBeforeSnapshot: 1000000
      policyVersionReevaluate:
        concurrencyLimit: 10
        rateLimitPerSecond: 50
        cacheDedupeEnabled: true
        defaultReportingMode: "risk-based"
        overrideAllowed: ["new-record-version"]         # CM3-15 — stale-flags-only override는 별도 CHECK 통과 시만
        staleFlagsOnlyOverrideConditions:
          maxRiskLevel: "low"
          requiresNoLegalSensitiveEntityChange: true     # CM4-08
          requiresNoLegalEntityIdentityChange: true      # CM4-08
          requiresNoPriorReviewRequiredChange: true
      retentionDays:
        plan: 1095; run: 730; step: 730; dryRunReport: 30
        legalApproval: 2555; rollbackLog: 1095; readOnlyWindow: 730
        stepRetryQueueCompleted: 30; notificationOutbox: 30
        policyReevaluateBatch: 730
      purgeWorker: { cadenceMinutes: 60, batchSize: 500, legalHoldOverride: false }
      hashSecrets:
        planFingerprintPepperRef: "secretRef://CM_PLAN_FINGERPRINT_PEPPER"
        idempotencyPepperRef: "secretRef://CM_IDEMPOTENCY_PEPPER"
        digestPepperRef: "secretRef://CM_DIGEST_PEPPER"
        applyPreflightTokenPepperRef: "secretRef://CM_PREFLIGHT_TOKEN_PEPPER"  # CM3-09
      externalMonitoringSink: { provider: "sentry", dsnSecretRef: "secretRef://MONITORING_DSN" }
```

### 2.4 CAS digest 알고리즘 SoT

| digest | 정의 |
|---|---|
| `planFingerprint` | HMAC-SHA256(planFingerprintPepperRef, canonical(plan body)). char(64) |
| `targetSetDigest` | chunked Merkle (chunkSize=10000) of stable-ordered target primary keys + selector version + tenant scope. 임계 초과 시 snapshot 기반 |
| `contentHashDigest` | step별 read-set field projection canonical JSON → chunked Merkle |
| `sourceSnapshotWatermark` | source table별 MAX(updated_at) + deletion ledger high watermark + version vector. canonical digest |
| `policyVersionSnapshot` | (contentMigrationPolicyVersion + complianceAssistantPolicyVersion + ruleCatalogVersion + ruleFileHashes + REVIEW_WORKFLOW version + piiFieldCatalogRef + entityFieldProjectionCatalogRef) canonical digest |
| `stepRegistryVersion` | step type registry 카탈로그 hash |
| `legalImpactClassificationDigest` | classifierVersion + classes[] canonical digest |
| `requestFingerprint` | command별 (§ 3.4) |
| **`applyPreflightToken`** (CM3-09·CM4-01) | HMAC(applyPreflightTokenPepperRef, planId + dryRunReportId + 8필드 digest bundle). char(64) opaque. **opaque이므로 decode 불가** — client는 token + dryRunReportId 둘 다 전달. server는 `(planId, dryRunReportId)`로 row lookup 후 token 재계산 비교 (CM4-01 정정) |

dry-run/apply preflight 동일 함수. 비용 상한 § 2.3 `digest`.

---

## 3. 입력·출력

### 3.1 엔트리포인트 + read API + 운영 command (CM3-19 metadata 일관화)

| 종류 | 함수 | 책임 | 권한 | AuditAction (canonical) | NotificationEvent |
|---|---|---|---|---|---|
| 실행 | `definePlan` | plan 정의 | super-admin | `content-migration-plan-defined` | — |
| 실행 | `validatePlan` | step·rollbackClass·classifier | super-admin | `content-migration-plan-validated` | — |
| 실행 | `runDryRun` | DryRunReport 생성 | super-admin | `content-migration-dry-run-completed` | — |
| 실행 | `approvePlanLegalGate` | legal-reviewer 게이트 | legal-reviewer | `content-migration-plan-legal-approved` | `content-migration-plan-legal-approved` |
| 실행 | `runApply` (ApplyPreflightToken) | apply | super-admin | `content-migration-run-started` | — |
| 실행 | `pauseRun` | step boundary pause | super-admin | `content-migration-run-paused` | — |
| 실행 | `resumeRun` | resume | super-admin | `content-migration-run-resumed` | — |
| 실행 | `cancelRun` | cooperative cancel | super-admin | `content-migration-run-cancelled` | — |
| 실행 | `rollbackRun` | scope: full/from-step | super-admin | `content-migration-rollback-triggered` (요청)·`content-migration-rollback-applied` (완료) | `content-migration-rollback-triggered` |
| 실행 | `skipStep` | irreversible step skip | super-admin + remediationTicketRef | `content-migration-step-skipped` | — |
| 실행 | `markStepCompensated` (CM4-05) | manual remediation compensation 적용 표시 | super-admin + remediationTicketRef | `content-migration-step-compensated` | **`content-migration-step-compensated`** (CM5-03) |
| 실행 | `abortRun` (CM4-05) | cancellation-timeout 또는 blocked-manual-remediation 강제 종료 | super-admin + remediationTicketRef + 운영 ticket | `content-migration-run-aborted` | **`content-migration-run-aborted`** (CM5-03 — 별도 critical 이벤트) |
| 실행 (system) | run completion | run 완료 시 | system | `content-migration-run-completed` 또는 `content-migration-run-failed` | 동일 |
| read | `queryPlans` (privacy class) | | operator·super-admin·legal-reviewer | — | — |
| read | `queryRuns` (privacy class) | | 동일 | — | — |
| read | `queryStepResults` (closed schema masking) | | 동일 | — | — |

### 3.1.1 AuditAction metadata 표 (CM3-19 — actorId·requestFingerprint·8필드 일관)

**공통 metadata required (모든 AuditAction)**: `actorId`·`actorRole`·`idempotencyKey`·`requestFingerprint`.

| AuditAction (canonical) | 추가 metadata |
|---|---|
| `content-migration-plan-defined` | planKind·targetEntityCount·planFingerprint·classifierVersion |
| `content-migration-plan-validated` | rollbackClassSummary·legalImpactClassification·classifierVersion·warningsCount·stepRegistryVersion·validateFailReasons[] |
| `content-migration-plan-legal-approved` | approvedBy·approvedAt·classificationSnapshot·planFingerprint·legalImpactClassificationDigest·policyVersionSnapshot·dryRunReportId·approvedDigestBundleHash |
| `content-migration-dry-run-completed` | reportId·**8필드 digest** (planFingerprint·targetSetDigest·contentHashDigest·sourceSnapshotWatermark·policyVersionSnapshot·stepRegistryVersion·legalImpactClassificationDigest·classifierVersion)·sampling stats·blockedDriftCount |
| `content-migration-run-started` | mode·planId·expectedDryRunReportId·**applyPreflightToken**·8필드 digest bundle hash·classifierVersion·policySnapshotVersion |
| `content-migration-run-paused` | runId·pausedAtStepKey·reason·pausedBy |
| `content-migration-run-resumed` | runId·resumedBy·pausedDurationSeconds |
| `content-migration-run-completed` | result·changedRecords·failedSteps·rollbackTriggered·skippedIrreversibleStepCount |
| `content-migration-run-failed` | failedStepKey·errorClass·partialWriteDetected·writeSetManifestRef |
| `content-migration-run-cancelled` | cancelledBy·reason·completedSteps·partialCommitRollbackRequired |
| `content-migration-rollback-triggered` | runId·scope·reason·expectedStatus·triggeredBy |
| `content-migration-rollback-applied` | scope·rolledBackSteps·skippedIrreversibleSteps·result (partial 강제 시) |
| `content-migration-step-skipped` | reason·approver·rollbackClass·affectedRowsConfirmation·remediationTicketRef·classifierVersion |

### 3.2 plan kind 6종 (CM3-16 — 풀 전개)

#### 3.2.1 `application-data-version-upgrade`
DATA_MODEL 버전 업그레이드 시 **데이터 backfill·정규화만**. column add/rename DDL은 인프라 책임. 본 plan kind는 column 존재·nullable·default를 read-only 검증 후 데이터만 채움.

#### 3.2.2 `feature-activation-backfill`
신규 Feature 활성화 시 기존 row를 새 schema에 맞춰 변환 (예: notifications 활성화 시 기존 audit row에서 NotificationEvent 파생).

#### 3.2.3 `instance-to-instance-copy`
분원 신설 등 본원 콘텐츠 복제. PII 이동 시 legalImpactClassifier가 legal-reviewer 승인 강제. step type registry가 PII masking 정책 정의.

#### 3.2.4 `content-bulk-transform`
design token 변경·brand 변경 시 콘텐츠 일괄 재생성. **asset-ingestion body MV는 변경 금지** (mutableFieldDenylist).

#### 3.2.5 `policy-version-reevaluate`
CONTENT_STANDARDS·RISK_LEVELS·MEDICAL_AD_COMPLIANCE_COMMON 변경 시 ComplianceRecord 재평가. compliance-assistant `check()` 대량 호출 — § 4.8 batch contract.

#### 3.2.6 `routing-slug-preservation`
asset-ingestion promote 후 또는 인스턴스 이동 시 기존 URL slug·redirect·ComplianceRecord 이력 승계. step 필수: `redirect-map-apply`·`slug-preserve`·`compliance-history-link`.

### 3.3 DTO

```ts
type MigrationPlanKind = /* 6종 */;
type RollbackClass = "reversible" | "compensating" | "irreversible";

type DefinePlanInput = {
  planKind: MigrationPlanKind;
  title: string; description: string;
  targetSelector: TargetSelector;
  steps: MigrationStep[];
  scheduledStart?: Date;
  readOnlyWindowMinutes?: number;
  idempotencyKey: string;
};

type MigrationStep = {
  stepKey: string;
  stepType: string;                                      // step registry 등록
  inputs: Record<string, unknown>;                       // registry inputSchema strict
  rollbackClass: RollbackClass;
  reverseStep?: MigrationStep;                          // rollbackClass=reversible 필수
  compensatingStep?: MigrationStep;                     // rollbackClass=compensating 필수
  blastRadiusCap?: number;                              // irreversible 필수
  backupSnapshotRequired?: boolean;                     // irreversible 필수
  retryable: boolean;
};

type LegalImpactClassification = {
  legalGateRequired: boolean;
  classes: LegalImpactClass[];
  classifierVersion: string;
  unknownClassesEncountered: boolean;                    // true → fail-closed
};

type LegalImpactClass =
  | "pii" | "legal-document" | "review-policy" | "pricing-page"
  | "before-after-media" | "testimonial-review" | "prior-review-required" | "cross-entity-copy";

// CM3-09·CM4-01 — opaque token + dryRunReportId 둘 다 전달
type RunApplyInput = {
  planId: string;
  dryRunReportId: string;                               // CM4-01 — token opaque이므로 explicit lookup key 필요
  applyPreflightToken: string;                          // server에서 dry-run 후 발급 (§ 3.5)
  forceProceedDespiteWarnings?: boolean;                // legal/critical warning에는 적용 안 됨
  idempotencyKey: string;
};

type RunApplyResult = {
  runId: string;
  status: "running";
  digestBundleVerified: { /* 8필드 + 일치 여부 */ };
};

type RollbackInput = {
  runId: string;
  scope: "full" | "from-step";
  fromStepKey?: string;
  reason: string;
  expectedStatus: RunPrimaryStatus;                     // CAS
  idempotencyKey: string;
};

type SkipStepInput = {
  stepResultId: string;                                 // CM4-11 — rollbackClass=irreversible만 허용
  reason: string;
  approver: string;
  remediationTicketRef: string;
  affectedRowsConfirmation: number;
  classifierVersionAtSkip: string;
  idempotencyKey: string;
};

// CM4-05 신규
type MarkStepCompensatedInput = {
  stepResultId: string;
  compensationDescription: string;
  approver: string;
  remediationTicketRef: string;
  affectedRowsConfirmation: number;
  idempotencyKey: string;
};

// CM4-05 신규
type AbortRunInput = {
  runId: string;
  reason: string;
  approver: string;
  operationalTicketRef: string;
  expectedSubstate: { primaryStatus: RunPrimaryStatus; remediationStatus: RunRemediationStatus };  // CAS
  idempotencyKey: string;
};

// CM3-04 + CM4-08 — legalEntityChanged 분해
type PolicyReevaluateResult = {
  complianceRecordId: string;
  previousRiskLevel: "none" | "low" | "medium" | "high" | "critical";
  newRiskLevel: "none" | "low" | "medium" | "high" | "critical";
  riskDelta: "decreased" | "unchanged" | "increased";
  priorReviewRequiredChanged: boolean;
  legalSensitiveEntityChanged: boolean;                  // CM4-08 — LegalDocument·ReviewPolicy·PricingPage·전후사진·후기 contentType class diff
  legalEntityIdentityChanged: boolean;                   // CM4-08 — 법인명·소속·법적 식별자 변경
  fieldProjectionDiff: string[];                         // CM4-08 — diff된 field path 목록 (catalog 통과)
  forcedReportingMode: "stale-flags-only" | "new-record-version";
  forcedReportingModeReason?: string;
};

// CM3-11 — Run status decomposition
type RunPrimaryStatus =
  | "pending" | "running" | "paused"
  | "completed" | "failed" | "cancelled"
  | "rolling-back" | "rolled-back";

type RunRemediationStatus =
  | "none"
  | "blocked-manual-remediation-required"
  | "cancellation-timeout-manual-review";

type RunRollbackOutcome =
  | "none" | "full" | "partial" | "failed";
```

### 3.4 idempotencyKey + requestFingerprint (CM3-19)

| command | scope | requestFingerprint |
|---|---|---|
| `definePlan` | `(instanceId, idempotencyKey)` UNIQUE | HMAC(idempotencyPepperRef, planKind + ":" + canonical(plan)) |
| `runApply` | `(planId, idempotencyKey)` UNIQUE | HMAC(... planId + ":" + applyPreflightToken) — token에 8필드 + classifierVersion 포함 (CM3-09) |
| `rollbackRun` | `(runId, idempotencyKey)` UNIQUE | HMAC(... runId + scope + fromStepKey + expectedStatus + reason hash) |
| `skipStep` | `(stepResultId, idempotencyKey)` UNIQUE | HMAC(... stepResultId + remediationTicketRef + affectedRowsConfirmation) (CM5-07 — rollbackClass 제거) |
| `markStepCompensated` (CM5-07) | `(stepResultId, idempotencyKey)` UNIQUE | HMAC(... stepResultId + compensationDescription + remediationTicketRef + affectedRowsConfirmation) |
| `abortRun` (CM5-07) | `(runId, idempotencyKey)` UNIQUE | HMAC(... runId + reason hash + operationalTicketRef + expectedSubstate) |
| `pauseRun`·`resumeRun`·`cancelRun`·`approvePlanLegalGate` | `(targetId, idempotencyKey)` UNIQUE | HMAC(... targetId + 핵심 input) |

same-request replay → 기존 결과. mismatched → 409 + audit/sink alert.

### 3.5 ApplyPreflightToken (CM3-09 + CM4-01·02 정정)

```
runDryRun(planId) 완료 후 server:
1. DryRunReport row insert — 8필드 digest 포함 + digestComputationMode·invalidationInputs 기록 (CM4-02)
2. applyPreflightToken = HMAC(applyPreflightTokenPepperRef, planId + ":" + dryRunReportId + ":" + 8필드 bundle canonical) char(64) opaque
3. client에 (dryRunReportId, applyPreflightToken) 둘 다 반환

runApply(input) — server:
1. (input.planId, input.dryRunReportId)로 DryRunReport row lookup (CM4-01 — token opaque)
2. token 재계산 비교 — 불일치 시 → 401/CAS fail
3. expiresAt(retentionDays.dryRunReport) 초과 시 → re-dry-run 강제 (CAS fail)
4. **digestComputationMode별 invalidation precheck** (CM4-02):
   - mode="full": 8필드 모두 server-side 재계산 → 비교
   - mode="snapshot": targetSetDigest·contentHashDigest는 snapshot 사용 (재계산 skip). policyVersionSnapshot·classifierVersion·catalog refs만 재계산
   - mode="cache": invalidationInputs(policyVersionSnapshot·classifierVersion·ruleFileHashes·catalogRefs) 변경 감지 → 변경된 경우만 해당 field 재계산
5. 어느 모드든 invalidationInputs change 발견 → CAS fail (token mismatch)
```

### 3.6 step type registry 최소 계약 (CM2-17 + CM3-02·CM3-10)

```ts
type StepTypeContract = {
  stepType: string;
  inputSchema: JsonSchema;                              // strict — additionalProperties=false
  outputSchema: JsonSchema;
  targetEntityTypes: EntityTypeEnum[];                  // CM3-05 — DATA_MODEL entity enum
  readSetProjection: FieldProjection[];                 // entityFieldProjectionCatalogRef 통과
  writeSetProjection: FieldProjection[];                // 동일
  rollbackClassDefault: RollbackClass;
  legalClassHints: LegalImpactClass[];
  cancellationSupport: {
    supportsCooperativeCancellation: boolean;
    cancellationCheckInterval: number;
    maxUninterruptibleSeconds: number;
    transactionBoundary: "per-row" | "per-chunk" | "per-step";
  };
  partialWriteDetector: PartialWriteStrategy;           // CM3-10
  dryRunCostEstimateSecondsPerThousandRows: number;
  mutableFieldAllowlist?: string[];
  mutableFieldDenylist?: string[];                      // asset-ingestion body MV 포함
};

// CM3-10·CM4-03 — strategy 분기 + append-only concurrency 보강
type PartialWriteStrategy =
  | { kind: "small-rowid-merkle"; maxRows: number }
  | { kind: "chunked-returning"; chunkSize: number }
  | { kind: "append-only-watermark";
      watermarkField: string;
      lowerBound: string;                                // CM4-03 — 시작 watermark
      exclusiveUpperBound: string;                       // CM4-03
      sourcePredicateHash: string;                       // CM4-03 — predicate canonical hash
      writerIdField: string;                             // CM4-03 — `migration_run_id` 등 본 run row 식별
      expectedInsertedCount: number;                     // CM4-03
      concurrencyMode: "serializable" | "advisory-lock-range";  // CM4-03 — phantom row 방지
    }
  | { kind: "deterministic-transform"; expectedAfterProjectionFn: string };
```

asset-ingestion `ExtractedContent.body` MV는 default `mutableFieldDenylist`.

### 3.7 writeSetManifest (CM2-06 + CM3-10)

각 step 실행 시 StepResult에 기록:

```ts
type WriteSetManifest = {
  strategy: PartialWriteStrategy["kind"];
  expectedAffectedRows: number;
  actualAffectedRows: number;
  beforeDigest?: string;                                // small-rowid-merkle만 사용
  afterDigest?: string;
  committedRowIds?: string[];                            // small
  chunkIds?: string[];                                   // chunked-returning
  highWatermark?: { before: string; after: string };    // append-only-watermark
  expectedAfterProjectionHash?: string;                  // deterministic-transform
  actualAfterProjectionHash?: string;
  transactionBoundary: "per-row" | "per-chunk" | "per-step";
  compensationStatus: "not-needed" | "pending" | "applied" | "failed";
  invariantQueryResults: Array<{ name: string; passed: boolean }>;
  isolationLevel: "read-committed" | "repeatable-read" | "serializable";
};
```

partial write 감지 트리거 (strategy별):
- `small-rowid-merkle`: beforeDigest + expected → afterDigest 불일치
- `chunked-returning`: actualAffectedRows ≠ expectedAffectedRows 또는 invariantQueryResults에 fail
- `append-only-watermark` (CM4-03):
  - watermark 역행
  - actualInsertedCount ≠ expectedInsertedCount
  - `[lowerBound, exclusiveUpperBound)` 범위에 writerId ≠ 본 run row 발견 (phantom row)
  - concurrencyMode=serializable일 때 isolation level 미적용 → step abort
  - concurrencyMode=advisory-lock-range일 때 `pg_advisory_xact_lock(hashtext('cm:append:' + watermarkField + ':' + lowerBound))` 미획득 → step abort
- `deterministic-transform`: actualAfterProjectionHash ≠ expectedAfterProjectionHash

### 3.8 read API privacy class (CM3-20 — StepResult schema)

```ts
type StepResultRow = {
  id: string;
  runId: string;
  stepKey: string;
  status: StepResultStatus;
  inputSummary: ClosedSchemaSummary;                    // PII 미포함 요약 (필드 token + masked value)
  outputSummary: ClosedSchemaSummary;
  diffDisplayHints: ClosedSchemaSummary;                // crm-sync § 3.2.1 패턴
  rawArtifactRef?: string;                              // S3·blob ref (rawArtifactRef 권한 별도)
  rawArtifactRetentionExpiresAt?: Date;
  privacyClass: "non-pii" | "pii" | "legal-sensitive";
  containsPii: boolean;
  exportAllowed: boolean;                               // PII step은 false 강제
  writeSetManifest: WriteSetManifest;
  startedAt: Date; completedAt?: Date;
};
```

| field | operator | super-admin | legal-reviewer | export |
|---|---|---|---|---|
| inputSummary·outputSummary·diffDisplayHints (non-pii) | 허용 | 허용 | 허용 | 허용 |
| inputSummary·outputSummary·diffDisplayHints (pii·legal-sensitive) | masked | masked | full | export 금지 |
| rawArtifactRef (containsPii=true) | 차단 | 허용 (audit 기록) | 허용 (audit 기록) | export 금지 |
| writeSetManifest.beforeDigest/afterDigest | 허용 (hash) | 허용 | 허용 | 허용 |

---

## 4. 실행 파이프라인

### 4.1 정의 → validate → dry-run → legal 게이트 → apply

```
1. definePlan: ContentMigrationPlan row insert (status=draft·planFingerprint)
2. validatePlan:
   - step type registry 등록 + inputSchema strict
   - rollbackClass별 reverse/compensating/blastRadius 검증
   - cooperativeCancellation 미지원 + transactionBoundary != per-chunk → **validate fail (CM3-02 승격)**
   - maxUninterruptibleSeconds > stepTimeoutSeconds 또는 readOnlyWindowMinutes 초과 → validate fail
   - legalImpactClassifier 실행 (§ 4.7)
   - writeSetProjection·mutableFieldAllowlist를 piiFieldCatalogRef·entityFieldProjectionCatalogRef로 catalog-against validation
   - unknownClassesEncountered=true → fail-closed
   - audit plan-validated
3. runDryRun:
   - 8필드 digest 산정 + sampling (deterministic-stratified, legal/PII full diff)
   - DryRunReport insert
   - applyPreflightToken 발급 (§ 3.5)
   - audit dry-run-completed
4. legalGateRequired=true → approvePlanLegalGate:
   - ContentMigrationLegalApproval insert (dryRunReportId·8필드 snapshot·approvedDigestBundleHash — CM3-13)
   - audit plan-legal-approved + 알림 plan-legal-approved
5. runApply(input):
   - input.applyPreflightToken으로 server-side 8필드 재계산·비교 (§ 3.5)
   - DryRunReport expiresAt CAS
   - legalGateRequired=true 시 expectedLegalApprovalId 필요 — DryRunReport 일치 확인
   - **active run partial unique** (§ 12.4) → 동일 plan 동시 apply 차단 (CM3-12)
   - ContentMigrationRun insert (primaryStatus=running)
   - read-only window 적용 (§ 4.5)
   - step 순차 — writeSetManifest 기록
   - 알림 run-completed/run-failed
```

### 4.2 rollback

```
rollbackRun:
1. expectedStatus CAS
2. audit rollback-triggered + 알림 rollback-triggered
3. step 역순 처리:
   - reversible: reverseStep
   - compensating: compensatingStep
   - irreversible: **blocked-manual-remediation-required** 진입. 운영자 명시적 skipStep 호출 필요
4. 완료 → rollbackOutcome=full (skippedIrreversibleSteps=0) 또는 partial (skipped 있음)
5. rollback 실패 → rollbackOutcome=failed + super-admin alert
6. audit rollback-applied
```

### 4.3 pause / resume / cancel state transition + 3축 transition matrix (CM4-04)

#### 4.3.1 명령별 transition

| 호출 | primaryStatus 전제 | 동작 | 결과 (primary·remediation·rollbackOutcome) |
|---|---|---|---|
| pauseRun | running | step boundary 또는 cancellation point | paused·none·none |
| resumeRun | paused·none·none | 다음 step | running·none·none |
| cancelRun | pending | step 미진행 | cancelled·none·none |
| cancelRun | running·none | cooperative cancellation 요청. 종료 후 partial commit 검사. partial 발견 시 자동 rollback | cancelled·none·none / rolling-back·none·none |
| cancelRun | paused·none·none | 동일 partial commit 검사 | cancelled·none·none / rolling-back·none·none |
| rollbackRun | completed·failed·cancelled·paused (none·none) | reverse 시작 | rolling-back·none·none |
| (rollback 완료) | rolling-back·none | 모든 step reversible → full | rolled-back·none·**full** |
| (rollback 부분 완료) | rolling-back·none | irreversible 만남 | rolling-back·**blocked-manual-remediation-required**·none |
| skipStep | rolling-back·blocked-manual-remediation-required | step skipped 처리 | rolling-back·blocked-manual-remediation-required (skipped step 누적) → 모든 skipped 후 정리 시 rolled-back·none·**partial** |
| markStepCompensated (CM4-05) | rolling-back·blocked-manual-remediation-required | compensation 적용 표시 | rolling-back·blocked-manual-remediation-required → 정리 시 rolled-back·none·**partial** |
| pause + cooperative 미지원 timeout (§ 4.5 stepTimeoutSeconds 초과) | running·none | step row lock 해제 | running·**cancellation-timeout-manual-review**·none |
| abortRun (CM4-05) | running·cancellation-timeout-manual-review 또는 rolling-back·blocked-manual-remediation-required | 강제 종료 + 운영 ticket 필수 | failed·cancellation-timeout-manual-review·**failed** (rollback 시도 실패 또는 timeout) |

#### 4.3.2 3축 invariant DB CHECK — tuple 기반 (CM5-02 정정)

```sql
CHECK (
  (primary_status='pending'      AND remediation_status='none' AND rollback_outcome='none') OR
  (primary_status='running'      AND remediation_status IN ('none','cancellation-timeout-manual-review') AND rollback_outcome='none') OR
  (primary_status='paused'       AND remediation_status='none' AND rollback_outcome='none') OR
  (primary_status='completed'    AND remediation_status='none' AND rollback_outcome='none') OR
  (primary_status='failed'       AND remediation_status IN ('none','cancellation-timeout-manual-review') AND rollback_outcome IN ('none','failed')) OR
  (primary_status='cancelled'    AND remediation_status='none' AND rollback_outcome='none') OR
  (primary_status='rolling-back' AND remediation_status IN ('none','blocked-manual-remediation-required') AND rollback_outcome='none') OR
  (primary_status='rolled-back'  AND remediation_status='none' AND rollback_outcome IN ('full','partial'))
)
```

**partial-rollback은 별도 primaryStatus 아님** — `primaryStatus='rolled-back' + rollbackOutcome='partial'`로 표현.

### 4.4 retry exhausted vs autoRollbackOnFailure 우선순위 (CM3-16 풀 전개)

| 조건 | 동작 |
|---|---|
| step retry exhausted + partial write 감지 | rollback 우선 (autoRollbackOnFailure 무시) → rolling-back |
| step retry exhausted + partial write 없음 + `retryExhaustedAction=pause` | paused + super-admin alert |
| step retry exhausted + partial write 없음 + `retryExhaustedAction=rollback-then-pause` | rolling-back 완료 후 paused |
| step retry exhausted + partial write 없음 + `retryExhaustedAction=rollback` | rolling-back → rolled-back |
| step retry exhausted + partial write 없음 + `autoRollbackOnFailure=true` | rollback 우선 |

### 4.5 read-only window writeClass (CM3-03 dispatch 정정)

| writeClass | 정의 | 정책 |
|---|---|---|
| `content-mutating` | Core 콘텐츠 row 변경 | 차단 |
| `workflow-state` | REVIEW_WORKFLOW 상태 전이 | 큐잉 |
| `feature-operational` | asset promote·crm conflict resolve 등 | 차단 |
| `notification-emit-outbox` | NotificationEvent emit + outbox insert | 허용 |
| `notification-dispatch` | notify() 외부 발송 (email·slack·webhook) | **dispatchAllowlist 이벤트만 즉시 허용** (CM3-03). 다른 이벤트는 nextAttemptAt 밀어 큐잉 |
| `notification-read-receipt` | inApp 읽음 표시 | 큐잉 |
| `notification-digest-state` | digest 집계 | 큐잉 |
| `audit-append` | append-only audit | 허용 |

`dispatchAllowlist` default: `content-migration-run-failed`·`content-migration-rollback-triggered`·`content-migration-plan-legal-approved` (CM3-03).

### 4.6 outbox SQL (CM3-14 — nextAttemptAt + exhausted)

```sql
-- claim
WITH next AS (
  SELECT id FROM content_migration_notification_outbox
  WHERE status='pending' AND next_attempt_at <= now()
    AND (locked_at IS NULL OR locked_at < now() - interval '5 minutes')
  ORDER BY next_attempt_at FOR UPDATE SKIP LOCKED LIMIT 1
)
UPDATE content_migration_notification_outbox o
SET status='processing', locked_at=now(), locked_by=$worker, attempts=attempts+1, last_attempt_at=now()
FROM next WHERE o.id=next.id RETURNING o.*;

-- success
UPDATE content_migration_notification_outbox
SET status='sent', sent_at=now(), locked_at=null
WHERE id=$id;

-- transient fail (backoff 적용)
UPDATE content_migration_notification_outbox
SET status='pending', locked_at=null, last_error=$err,
    next_attempt_at = now() + (interval '1 second' * (CASE attempts
      WHEN 1 THEN 60 WHEN 2 THEN 300 WHEN 3 THEN 1800 WHEN 4 THEN 7200 ELSE 21600 END))
WHERE id=$id;

-- exhausted (attempts >= 5)
UPDATE content_migration_notification_outbox
SET status='permanent', locked_at=null
WHERE id=$id AND attempts >= 5;
-- + sink alert

-- stale reclaim (별도 worker — cadence 1분)
UPDATE content_migration_notification_outbox
SET locked_at=null, locked_by=null
WHERE status='processing' AND locked_at < now() - interval '5 minutes';
```

status enum: `pending`·`processing`·`sent`·`permanent`. (CM3-14 — `failed` 제거)

### 4.7 legalImpactClassifier (CM3-05 — catalog input)

| class | deterministic rule |
|---|---|
| `pii` | step.readSetProjection ∩ piiFieldCatalogRef 또는 writeSetProjection ∩ piiFieldCatalogRef ≠ ∅ |
| `legal-document` | targetEntityTypes에 `LegalDocument` ∈ entityFieldProjectionCatalogRef |
| `review-policy` | targetEntityTypes에 `ReviewPolicy` |
| `pricing-page` | targetEntityTypes에 `PricingPage` 또는 `PricingPolicy` |
| `before-after-media` | readSet/writeSet에 priorReviewRequired trigger catalog의 before/after media field |
| `testimonial-review` | targetEntityTypes에 `Testimonial`·`Review` |
| `prior-review-required` | priorReviewRequired trigger catalog 영향 field |
| `cross-entity-copy` | planKind=instance-to-instance-copy 또는 sourceInstance != targetInstance |

unknown step type 또는 catalog 매칭 실패 → `unknownClassesEncountered=true` → fail-closed.

step의 self-declared `legalClassHints`만 신뢰하지 않음 — `writeSetProjection`·`mutableFieldAllowlist`를 catalog로 cross-validate (CM3-05).

**LLM 분류 금지 (v1.0)**. class enum 변경·catalog 변경 SemVer § 1.1.

retroactive audit — false-negative 발견 시 영향 plan 재평가 절차는 CM-09 v1.x (운영 정책).

### 4.8 policy-version-reevaluate batch (CM3-04·CM3-15)

```
config.defaultReportingMode="risk-based":
1. 대상 ComplianceRecord 조회
2. cacheKey 산정 (compliance-assistant § 8) — durable cache hit:
   - check() 호출 skip
   - cachedResultRef 기록
3. concurrencyLimit·rateLimitPerSecond 적용
4. check() 결과 → PolicyReevaluateResult 생성 (CM3-04 + CM4-08·CM5-06):
   - previousRiskLevel = 기존 ComplianceRecord의 inferredRiskLevel snapshot
   - newRiskLevel = check() result
   - riskDelta·priorReviewRequiredChanged·**legalSensitiveEntityChanged·legalEntityIdentityChanged·fieldProjectionDiff** 산정 (CM4-08·CM5-06 — legalEntityChanged 단일 boolean 폐기)
5. forcedReportingMode 결정 (CM4-08):
   - riskDelta=increased + newRiskLevel ∈ ("high"·"critical") → new-record-version 강제
   - priorReviewRequiredChanged=true → new-record-version 강제
   - **legalSensitiveEntityChanged=true** (LegalDocument·ReviewPolicy·PricingPage·전후사진·후기 contentType class diff) → new-record-version 강제
   - **legalEntityIdentityChanged=true** (법인명·소속·법적 식별자 변경) → new-record-version 강제
   - 그 외 → stale-flags-only 허용
6. override 검사:
   - config.policyVersionReevaluate.overrideAllowed=["new-record-version"]만 default 허용
   - stale-flags-only override는 `staleFlagsOnlyOverrideConditions` (maxRiskLevel=low + no legal entity change + no priorReview change) CHECK 통과 시만 (CM3-15)
7. ContentMigrationPolicyReevaluateBatch row 갱신: checked·cacheHit·skippedNoChange·changed·error 카운트
8. per-record resultRef는 ContentMigrationPolicyReevaluateRecord row에 저장 (§ 12.9.1)
9. sourceEventId = hash("content-migration:policy-reevaluate:" + planId + ":" + complianceRecordId)
```

---

## 5. 알림 (CM3-16 풀 전개)

### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT — 6종)

| eventType | criticality | 채널 | recipients |
|---|---|---|---|
| `content-migration-plan-legal-approved` | high | email + inApp | super-admin |
| `content-migration-run-completed` | normal | inApp | super-admin |
| `content-migration-run-failed` | **critical** | email + inApp | super-admin |
| `content-migration-rollback-triggered` | high | email + inApp | super-admin |
| `content-migration-run-aborted` (CM5-03) | **critical** | email + inApp | super-admin |
| `content-migration-step-compensated` (CM5-03) | high | inApp | super-admin |

### 5.2 outbox — § 4.6 SQL

### 5.3 NotificationEvent 매핑

| eventType | sourceKind | sourceId | sourceEventId |
|---|---|---|---|
| `content-migration-plan-legal-approved` | `plan` | planId | `hash("content-migration:plan:" + planId + ":legal-approved")` |
| `content-migration-run-completed` | `run` | runId | `hash("content-migration:run:" + runId + ":completed")` |
| `content-migration-run-failed` | `run` | runId | `hash("content-migration:run:" + runId + ":failed")` |
| `content-migration-rollback-triggered` | `run` | runId | `hash("content-migration:run:" + runId + ":rollback-triggered")` |
| `content-migration-run-aborted` (CM5-03) | `run` | runId | `hash("content-migration:run:" + runId + ":aborted")` |
| `content-migration-step-compensated` (CM5-03) | `step` | stepResultId | `hash("content-migration:step:" + stepResultId + ":compensated")` |

---

## 6. 운영 지표 + acceptance test invariant

### 6.1 핵심 지표

| 지표 | 정의 | 목표 |
|---|---|---|
| plan 성공율 | success / 전체 | > 99% |
| ApplyPreflightToken mismatch 차단율 | 100% | |
| legalImpactClassifier unknown fail-closed 비율 | baseline | |
| skip irreversible 발생율 | baseline (운영 review) | |
| partial write → rollback 트리거 비율 | baseline | |
| read-only window 차단 write | baseline | |
| policy-reevaluate risk-based new-record-version 비율 | baseline | |
| dry-run targetSetDigest match | 100% | |
| dry-run changedRowCount delta | < 1% | |
| dry-run fieldDiff delta | < 5% | |
| dry-run blockedDriftCount | baseline | |
| rollback 성공율 | > 99% | |
| outbox 발송 성공율 | > 99% | |

### 6.2 invariant ↔ § 9 fail/invariant rule 1:1 traceability (CM3-17)

| Invariant ID | § 9 rule | 영역 |
|---|---|---|
| INV-CAS-PREFLIGHT-TOKEN | § 9.2 ApplyPreflightToken mismatch | dry-run/apply drift |
| INV-CAS-DRYRUN-EXPIRY | § 9.2 DryRunReport expiresAt 초과 | drift |
| INV-LEGAL-UNKNOWN-CLASS | § 9.2 unknownClassesEncountered | legal-classifier |
| INV-LEGAL-OVERRIDE | § 9.2 forceProceedDespiteWarnings legal/critical 시도 | legal override |
| INV-LEGAL-APPROVAL-LINK | § 9.2 expectedLegalApprovalId 누락 (legalGateRequired) | legal-approval |
| INV-ROLLBACK-IRREVERSIBLE | § 9.2 irreversible encountered | rollback |
| INV-ROLLBACK-SKIP | § 9.2 skipStep 필수 metadata | skip |
| INV-PARTIAL-WRITE | § 9.2 writeSetManifest invariant fail | partial-write |
| INV-READONLY-CONTENT | § 9.2 content-mutating 차단 | read-only-window |
| INV-READONLY-DISPATCH | § 9.2 dispatchAllowlist 외 즉시 dispatch 차단 | read-only-window |
| INV-IDEMPOTENCY-REPLAY | § 9.2 same-request replay (no-op) | idempotency |
| INV-IDEMPOTENCY-COLLISION | § 9.2 mismatched 409 | idempotency |
| INV-OUTBOX-SOURCE-EVENT | § 9.2 sourceEventId UNIQUE | outbox |
| INV-OUTBOX-EXHAUSTED | § 9.4 attempts >= 5 → permanent | outbox |
| INV-POLICY-REEVAL-RISK | § 9.2 priorReview·legalEntity·Critical → new-record-version 강제 | policy |
| INV-POLICY-REEVAL-OVERRIDE | § 9.2 stale-flags-only override CHECK | policy |
| INV-COOP-CANCEL-FAIL | § 9.3 cooperativeCancellation 미지원 + non-per-chunk → validate fail | step-registry |
| INV-CANCEL-TIMEOUT | § 9.2 cancellation-timeout-manual-review 진입 | state-machine |
| INV-STEP-REGISTRY | § 9.3 inputSchema strict | step-registry |
| INV-PRIVACY-EXPORT | § 9.2 PII step exportAllowed=false | privacy |
| INV-DDL-BOUNDARY | § 9.3 DDL 실행 금지 | scope |
| INV-BODY-MV | § 9.3 mutableFieldDenylist body MV | asset-ingestion handoff |
| INV-RUN-ACTIVE-UNIQUE | § 9.2 partial unique (planId WHERE active) | concurrency |
| INV-CATALOG-VALIDATION | § 9.3 piiFieldCatalogRef·entityFieldProjectionCatalogRef cross-validate | classifier |
| INV-ACTIVE-TARGET-LOCK (CM4-06·07) | § 9.2 ActiveTargetLock UNIQUE 충돌 | concurrency |
| INV-RUN-STATUS-3AXIS (CM4-04) | § 12.4 CHECK 3축 invariant | state-machine |
| INV-APPEND-ONLY-PHANTOM (CM4-03) | § 9.2 phantom row writerId 검사 | partial-write |
| INV-LEGAL-ENTITY-DISCRIMINATE (CM4-08) | § 9.2 legalSensitive/Identity 분해 | policy |
| INV-DISPATCH-DRIFT (CM4-13) | § 9.1 dispatchAllowlistPolicySnapshot mismatch | notification |

### 6.3 acceptance fixture matrix (CM4-12 — happy + violation 각 INV마다)

| INV ID | happy fixture | violation fixture |
|---|---|---|
| INV-CAS-PREFLIGHT-TOKEN | dry-run 즉시 apply — token 일치 → 200 | targetSet 변경 후 apply — token mismatch → 401/409 |
| INV-CAS-DRYRUN-EXPIRY | retention 내 apply → 200 | expiresAt 이후 apply → CAS fail |
| INV-LEGAL-UNKNOWN-CLASS | 등록 step + catalog 매칭 → classification 완료 | unknown step type → fail-closed (legalGateRequired=true) |
| INV-LEGAL-OVERRIDE | forceProceedDespiteWarnings + low risk warning → 진행 | forceProceedDespiteWarnings + legal-required warning → 거부 |
| INV-LEGAL-APPROVAL-LINK | legalGateRequired=true + 일치 LegalApproval → 200 | 일치 LegalApproval 없음 → fail |
| INV-ROLLBACK-IRREVERSIBLE | 모두 reversible → full rollback | irreversible 포함 → blocked-manual-remediation-required → skipStep + partial |
| INV-ROLLBACK-SKIP | super-admin + remediationTicketRef 제공 → skipped | remediationTicketRef 누락 → runtime fail |
| INV-PARTIAL-WRITE | actualAffectedRows = expected → 정상 | invariantQueryResults에 fail → rollback 우선 |
| INV-READONLY-CONTENT | window 종료 후 write → 정상 | window 중 content-mutating write → rejected |
| INV-READONLY-DISPATCH | allowlist 이벤트 즉시 dispatch → 정상 | 외 이벤트 즉시 dispatch → queued |
| INV-IDEMPOTENCY-REPLAY | 동일 fingerprint 재요청 → 기존 결과 (no-op) | mismatched fingerprint → 409 |
| INV-IDEMPOTENCY-COLLISION | 동일 → ok | 다른 input → 409 |
| INV-OUTBOX-SOURCE-EVENT | 신규 sourceEventId → row insert | 동일 sourceEventId → unique violation |
| INV-OUTBOX-EXHAUSTED | attempts < 5 → retry | attempts ≥ 5 → permanent + sink alert |
| INV-POLICY-REEVAL-RISK | low + no legal/priorReview → stale-flags-only | priorReview true → new-record-version 강제 |
| INV-POLICY-REEVAL-OVERRIDE | low + no legal·priorReview 변화 + stale-flags-only override → 허용 | high risk + stale-flags-only override 시도 → 거부 |
| INV-COOP-CANCEL-FAIL | supportsCooperativeCancellation=true 또는 transactionBoundary=per-chunk → validate ok | supportsCooperativeCancellation=false + non-per-chunk → validate fail |
| INV-CANCEL-TIMEOUT | timeout 이전 cancel → cancelled | timeout 도달 → cancellation-timeout-manual-review |
| INV-STEP-REGISTRY | inputSchema strict 통과 → validate ok | additionalProperties=true → validate fail |
| INV-PRIVACY-EXPORT | non-pii step export → 허용 | pii step + export_allowed=true insert 시도 → DB CHECK reject |
| INV-DDL-BOUNDARY | DDL precondition read-only → 정상 | DDL 실행 시도 → validate fail |
| INV-BODY-MV | mutableFieldDenylist 통과 → 정상 | body MV 변경 시도 → validate fail |
| INV-RUN-ACTIVE-UNIQUE | 동일 plan apply 1회 → 정상 | 동일 plan 동시 apply → 두 번째 409 |
| INV-CATALOG-VALIDATION | piiFieldCatalog cross-validate 통과 → 정상 | catalog 미매칭 step → validate fail |
| **INV-ACTIVE-TARGET-LOCK** (CM4-06·07) | 다른 targetSetDigest plan 동시 apply → 정상 | 동일 targetSetDigest plan 동시 apply → 두 번째 409 |
| **INV-RUN-STATUS-3AXIS** (CM4-04) | primaryStatus=rolled-back + rollbackOutcome=full → 정상 | primaryStatus=rolled-back + rollbackOutcome=none → CHECK reject |
| **INV-APPEND-ONLY-PHANTOM** (CM4-03) | [lowerBound, upperBound) 범위 + 본 writerId만 → 정상 | 다른 writerId row 발견 → step abort |
| **INV-LEGAL-ENTITY-DISCRIMINATE** (CM4-08) | legalSensitiveEntityChanged=false + legalEntityIdentityChanged=false + low risk → stale-flags-only override | legalSensitiveEntityChanged=true → new-record-version 강제 |
| **INV-DISPATCH-DRIFT** (CM4-13) | dispatchAllowlistPolicySnapshot = REVIEW_WORKFLOW 현재 hash → build ok | snapshot mismatch → build fail |

---

## 7. compliance-assistant 예외

ContentMigrationPlan·DryRunReport·StepResult는 `check()` 대상 아님. plan kind 정의가 콘텐츠 아님.

`policy-version-reevaluate` 실행 결과로 ComplianceRecord 재생성 시 새 record는 REVIEW_WORKFLOW § 8 lifecycle 진입 (개별 콘텐츠 contentType 유지). `contentType` 예외 cascade 불필요.

---

## 8. 설치·설정 — DB 10 tables (§ 12)

---

## 9. 빌드·런타임·migration·invariant 검증

### 9.1 build-time fail

- `enabled=true` + `contentMigrationConfig` 누락
- `contentMigrationPolicyVersion` 누락
- **`featureLegalApproved !== true`** + 승인자/시각 누락 (CM3-08)
- `requiresFeature: notifications` 충족 안 됨
- `approvalRequired.*` 6종 모두 누락
- `legalImpactClassifierRef`·**`piiFieldCatalogRef`·`entityFieldProjectionCatalogRef`** 누락 (CM3-05)
- `policyVersionReevaluate.concurrencyLimit` ≤ 0
- `policyVersionReevaluate.defaultReportingMode` ∉ enum
- `policyVersionReevaluate.overrideAllowed` ∉ {`new-record-version`, `stale-flags-only`}
- **`readOnlyWindow.dispatchAllowlistPolicySnapshot` mismatch** — REVIEW_WORKFLOW § 9.1.1 현재 매트릭스 hash와 불일치 (CM4-13)
- `policyVersionReevaluate.staleFlagsOnlyOverrideConditions.maxRiskLevel` ∉ enum
- `hashSecrets.*` 4종 누락 (CM3-09 applyPreflightTokenPepperRef 포함)
- `retentionDays.*` 누락
- `dryRun.digest.chunkSize` ≤ 0
- step registry inputSchema.additionalProperties != false
- step registry cancellationSupport.supportsCooperativeCancellation=false + transactionBoundary != "per-chunk" → **validate fail** (CM3-02)

### 9.2 runtime fail

- runApply `applyPreflightToken` mismatch (server-side 8필드 재계산 불일치) [INV-CAS-PREFLIGHT-TOKEN]
- runApply DryRunReport expiresAt 초과 [INV-CAS-DRYRUN-EXPIRY]
- runApply mismatched idempotency → 409 [INV-IDEMPOTENCY-COLLISION]
- legalGateRequired=true + approvePlanLegalGate 미수행 또는 expectedLegalApprovalId 누락 [INV-LEGAL-APPROVAL-LINK]
- `forceProceedDespiteWarnings`가 legal/critical warning 무시 시도 → 거부 [INV-LEGAL-OVERRIDE]
- classifierVersion mismatch → ApplyPreflightToken mismatch (CAS)
- legalImpactClassifier `unknownClassesEncountered=true` apply 시도 → fail-closed [INV-LEGAL-UNKNOWN-CLASS]
- step timeout 초과 → failed-transient
- rollbackRun expectedStatus CAS 실패
- rollback irreversible encountered → blocked-manual-remediation-required [INV-ROLLBACK-IRREVERSIBLE]
- pauseRun/cancelRun § 4.3 비허용 status → runtime fail
- read-only window 중 content-mutating 시도 → rejected [INV-READONLY-CONTENT]
- read-only window 중 dispatchAllowlist 외 이벤트 즉시 dispatch 시도 → 큐잉으로 변경 (rejected 아님) [INV-READONLY-DISPATCH]
- policy-reevaluate concurrencyLimit 초과 → 대기 큐
- writeSetManifest invariantQueryResults에 `passed=false` → partial write 감지 → rollback 우선 [INV-PARTIAL-WRITE]
- cooperative cancellation 미지원 step + pauseRun + timeout → `cancellation-timeout-manual-review` remediationStatus [INV-CANCEL-TIMEOUT]
- skipStep + rollbackClass ∉ ("irreversible","manual-remediation-required") → runtime fail
- skipStep + (reason·approver·remediationTicketRef·affectedRowsConfirmation 누락) → runtime fail [INV-ROLLBACK-SKIP]
- stale-flags-only override + staleFlagsOnlyOverrideConditions 미충족 → runtime fail [INV-POLICY-REEVAL-OVERRIDE]
- active run (`primaryStatus IN ('pending','running','paused','rolling-back')` + remediationStatus ≠ none) + 동일 plan apply 시도 → 409 [INV-RUN-ACTIVE-UNIQUE]
- outbox UNIQUE(sourceEventId) 충돌 → 정보 로그 [INV-OUTBOX-SOURCE-EVENT]
- **same-request replay** — `requestFingerprint` 일치 시 기존 결과 반환 (no-op) [INV-IDEMPOTENCY-REPLAY] (CM4-12)
- **PII StepResult export 시도** (`contains_pii=true + export_allowed=true`) → DB CHECK reject + audit [INV-PRIVACY-EXPORT] (CM4-12)
- **ActiveTargetLock 충돌** — 동일 (instanceId, targetSetDigest, writeSetScopeDigest) UNIQUE 위반 → 409 (CM4-06·07)

### 9.3 migration-time validation

- targetSelector 0건 → warning
- targetSelector 임계 초과 → warning 또는 fail
- DryRunReport expiresAt 만료 후 apply → fail
- step.rollbackClass=reversible + reverseStep 누락 → validate fail
- step.rollbackClass=compensating + compensatingStep 누락 → validate fail
- step.rollbackClass=irreversible + (blastRadiusCap 누락 또는 backupSnapshotRequired=false) → validate fail
- stale policyVersionSnapshot → CAS fail
- targetSelector row lock 불가 → runtime fail
- orphan Core row → warning
- step type registry 미등록 stepType → validate fail [INV-STEP-REGISTRY]
- step writeSetProjection·mutableFieldAllowlist가 piiFieldCatalogRef·entityFieldProjectionCatalogRef cross-validate 실패 → validate fail [INV-CATALOG-VALIDATION]
- cooperativeCancellation=false + transactionBoundary != "per-chunk" → validate fail (CM3-02) [INV-COOP-CANCEL-FAIL]
- maxUninterruptibleSeconds > stepTimeoutSeconds 또는 readOnlyWindowMinutes → validate fail
- DDL precondition 검증 외 DDL 실행 시도 → validate fail [INV-DDL-BOUNDARY]
- asset-ingestion body MV `mutableFieldDenylist` 위반 → validate fail [INV-BODY-MV]

### 9.4 runtime invariant·reconcile

- 진행 중 run pausedAt > 24h → 운영자 alert
- step retry exhausted → § 4.4
- ContentMigrationRun stale processing (lockedAt > 10분) → reconcile
- DryRunReport expiresAt 도래 → purge
- legalHold > unregister > retention purge precedence
- outbox attempts >= 5 → permanent [INV-OUTBOX-EXHAUSTED]
- purge worker — 테이블별:
  - ContentMigrationLegalApproval: 7년 audit retention. legalHold true
  - ContentMigrationPlan (legalApproved 포함): legalHold true
  - DryRunReport: expiresAt 시 delete
  - Run (status=완료): retentionDays.run
  - StepResult: retentionDays.step
  - StepRetryQueue (status=completed): retentionDays.stepRetryQueueCompleted
  - RollbackLog: retentionDays.rollbackLog
  - ReadOnlyWindow: retentionDays.readOnlyWindow
  - PolicyReevaluateBatch·Record: retentionDays.policyReevaluateBatch
  - NotificationOutbox (sent·permanent): retentionDays.notificationOutbox

### 9.5 warning

- targetSelector row count > 임계
- rollbackClass=irreversible 비율 > 10%
- impactSamplingMode=random + legal/PII step 포함
- cooperativeCancellation 미지원 step 1개 이상 (validate fail 전제이지만 manifest 단계 사전 경고)

---

## 10. 미결정 사항

### 10.1 open (v1.x·M2+ 후속)

| ID | 항목 |
|---|---|
| CM-01 | 외부 cluster cross-region copy |
| CM-02 | partial cutover |
| CM-03 | sampling stratified 알고리즘 (v1.0 deterministic-stratified default·v1.x per-cluster) |
| CM-04 | read-only window 우회 권한 |
| CM-05 | rollback 부분 적용 안전성 |
| CM-09 | legalImpactClassifier false-negative retroactive 절차 (운영 정책) |

### 10.2 resolved-in-v1.0

| ID | 해소 |
|---|---|
| ~~CM-06~~ | policy-reevaluate 부하 — § 4.8 batch contract |
| ~~CM-07~~ | instance-to-instance-copy PII — legalImpactClassifier + legal-reviewer |
| ~~CM-08~~ | DB DDL vs application — § 1.3 |
| ~~CM-10~~ | abortRun command — v1.0 § 3.1·§ 3.3·§ 4.3 (CM4-05) |
| ~~CM-11~~ | markStepCompensated command — 동일 (CM4-05) |

### 10.3 v0.6 잔여 리스크 (CM5-08)

| 영역 | 상태 |
|---|---|
| step type registry 별도 도큐먼트 | open — § 3.6 최소 계약 본문 포함. 구체 step type은 구현체 등록 |
| ~~§ 6.3 fixture violation path~~ | ~~resolved (v0.5 28 INV happy + violation)~~ |
| ~~§ 12 인벤토리·PolicyReevaluateRecord~~ | ~~resolved (v0.6 § 12.9.1 별도 table 승격 — 12 tables)~~ |

---

## 11. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-15 | v0.1 | 최초 작성 |
| 2026-05-15 | v0.2 | codex 1차 24 지적 + cascade |
| 2026-05-15 | v0.3 | codex 2차 23 지적 |
| 2026-05-15 | v0.4 | codex 3차 21 지적 + REVIEW_WORKFLOW·DATA_MODEL cascade |
| 2026-05-15 | **v0.5** | **codex 4차 비평 14 지적 전건 수용**: (1) **ApplyPreflightToken opaque + dryRunReportId explicit lookup** — RunApplyInput에 dryRunReportId 추가 (CM4-01), (2) **digestComputationMode 3종** (full·snapshot·cache) + invalidationInputs cache invalidation 정밀화 (CM4-02), (3) **append-only-watermark concurrency 강화** — lowerBound·exclusiveUpperBound·sourcePredicateHash·writerIdField·expectedInsertedCount·concurrencyMode + phantom row writerId 검사 (CM4-03), (4) **Run status 3축 transition matrix § 4.3.1 + DB CHECK § 4.3.2/§ 12.4** — partial-rollback은 별도 primaryStatus 아님 (CM4-04), (5) **markStepCompensated·abortRun v1.0 정식 command** + CM-10·11 resolved 격상 + REVIEW_WORKFLOW cascade 2종 추가 (CM4-05), (6) **ContentMigrationActiveTargetLock § 12.11 신설** — instanceId+targetSetDigest+writeSetScopeDigest active unique. dry-run·apply 동시성 차단 (CM4-06·07), (7) **legalEntityChanged 분해** → legalSensitiveEntityChanged + legalEntityIdentityChanged. staleFlagsOnlyOverrideConditions 정렬 (CM4-08), (8) **§ 12.9.1 embedded 명시** + 인벤토리 11 tables로 정정 (§ 12.1-§ 12.11) (CM4-09), (9) **PII export DB CHECK SQL canonical** `CHECK (NOT contains_pii OR export_allowed = false)` (CM4-10), (10) **SkipStepInput에서 rollbackClass 제거** — irreversible only. manual-remediation-required는 remediationStatus reason (CM4-11), (11) **§ 6.3 fixture matrix 28 INV × happy + violation 각 1쌍** + § 9.2에 same-request replay·PII export·ActiveTargetLock 충돌 fail rule 추가 (CM4-12), (12) **dispatchAllowlistPolicySnapshot** — REVIEW_WORKFLOW 매트릭스 hash drift 시 build fail (CM4-13), (13) **§ 1.1 SemVer 4행 추가** — writeSetManifest strategy semantic·policy-reevaluate decision rule·staleFlagsOnlyOverrideConditions·ActiveTargetLock 변경 (CM4-14) |
| 2026-05-15 | **v0.6** | **codex 5차 비평 8 지적 전건 수용 — v1.0 안정판 후보**: (1) **§ 12 인벤토리 12 tables로 통일** — PolicyReevaluateRecord 별도 table 승격 (§ 12.10 / 기존 NotificationOutbox·ActiveTargetLock은 12.11·12.12로 이동) (CM5-01), (2) **§ 4.3.2 3축 invariant DB CHECK tuple 기반 재작성** — 8 valid tuple 명시. 잘못된 조합 DB reject (CM5-02), (3) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — content-migration-run-aborted (critical) + step-compensated (high) NotificationEvent 2종 추가 + 본문 § 3.1·§ 5.1·§ 5.3 매핑 (CM5-03), (4) **writeSetScopeDigest 고정 정의** — HMAC(digestPepperRef, stepRegistryVersion + ordered(stepKey + writeSetProjection canonical + targetEntityTypes)). DryRunReport에 저장·ActiveTargetLock에 재사용 (CM5-04), (5) **§ 12.2 DryRunReport schema에 digestComputationMode·invalidationInputs·cacheSourceRef·generatedAt·writeSetScopeDigest 추가** (CM5-05), (6) **§ 4.8·§ 12.10 legalEntityChanged 잔재 제거** — legalSensitiveEntityChanged·legalEntityIdentityChanged·fieldProjectionDiff cascade (CM5-06), (7) **§ 3.4 requestFingerprint 표 갱신** — markStepCompensated·abortRun 추가 + skipStep에서 rollbackClass 제거 (CM5-07), (8) **§ 10.3 v0.6 잔여 리스크로 갱신** (CM5-08) |
| 2026-05-15 | (v0.4 — 이전 비고) | **codex 3차 비평 21 지적 전건 수용** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |

---

## 12. DB 인벤토리 (12 tables — executable schema)

### 12.1 `ContentMigrationPlan`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `idempotencyKey` | string | ✅ |
| `requestFingerprint` | char(64) | ✅ |
| `planKind` | enum (6종) | ✅ |
| `planFingerprint` | char(64) | ✅ |
| `title`·`description` | string | ✅ |
| `targetSelector` | JSON | ✅ |
| `legalImpactClassification` | JSON (closed) | ✅ |
| `classifierVersion` | string | ✅ |
| `status` | enum (draft·validated·dry-run-completed·legal-approved·apply-ready·archived) | ✅ |
| `definedBy`·`definedAt` | string·Date | ✅ |
| `expiresAt` | Date | ✅ — retentionDays.plan |

**Constraints**: `UNIQUE(instanceId, idempotencyKey)`. legalHold true (legalImpactClassification 포함).
**Index**: `(instanceId, status)`, `(expiresAt)`.

### 12.2 `ContentMigrationDryRunReport`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `planId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `planFingerprint`·`targetSetDigest`·`contentHashDigest`·`sourceSnapshotWatermark`·`policyVersionSnapshot`·`stepRegistryVersion`·`legalImpactClassificationDigest`·`classifierVersion` | char(64)/string | ✅ (8필드) |
| `applyPreflightToken` | char(64) | ✅ |
| `samplingStats` | JSON | ✅ |
| `blockedDriftCount` | integer | ✅ |
| `digestComputationMode` (CM5-05) | enum (`full`·`snapshot`·`cache`) | ✅ |
| `invalidationInputs` (CM5-05) | JSONB closed (policyVersionSnapshot·classifierVersion·ruleFileHashes·catalogRefs) | ✅ |
| `cacheSourceRef` (CM5-05) | string | optional (mode=`cache`/`snapshot` 시 ref) |
| `generatedAt` (CM5-05) | Date | ✅ |
| `writeSetScopeDigest` | char(64) | ✅ — § 12.11 lock 산정에 재사용 (CM5-04) |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(planId, applyPreflightToken)`. `UNIQUE(applyPreflightToken)`.
**Index**: `(planId, generatedAt DESC)`, `(expiresAt)`.

### 12.3 `ContentMigrationLegalApproval` (CM3-13)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `planId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `dryRunReportId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `classificationSnapshot` | JSON | ✅ |
| `classificationSnapshotDigest` | char(64) | ✅ |
| `approvedDigestBundleHash` | char(64) | ✅ — 8필드 bundle |
| `policyVersionSnapshot` | string | ✅ |
| `classifierVersion` | string | ✅ |
| `approvedBy`·`approvedAt` | string·Date | ✅ |
| `legalHold` | boolean | ✅ default true |
| `expiresAt` | Date | optional — legalHold=true 시 null |

**Constraints**: `UNIQUE(planId, classificationSnapshotDigest)`. `UNIQUE(planId, dryRunReportId)`.
**Index**: `(planId, approvedAt DESC)`.

### 12.4 `ContentMigrationRun` (CM3-11·CM3-12)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `planId` | UUID | ✅ — FK |
| `dryRunReportId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `expectedLegalApprovalId` | UUID | optional (legalGateRequired=true 시 ✅) — FK |
| `idempotencyKey`·`requestFingerprint` | string·char(64) | ✅ |
| `primaryStatus` | enum (pending·running·paused·completed·failed·cancelled·rolling-back·rolled-back) | ✅ |
| `remediationStatus` | enum (none·blocked-manual-remediation-required·cancellation-timeout-manual-review) | ✅ default none |
| `rollbackOutcome` | enum (none·full·partial·failed) | ✅ default none |
| **CHECK** | § 4.3.2 3축 invariant DB CHECK (CM4-04) | |
| `solutionVersion` | integer | ✅ — CAS |
| `lockedAt`·`lockedBy` | Date·string | optional |
| `mode` | enum (dry-run·apply) | ✅ |
| `startedAt`·`completedAt` | Date | ✅·optional |
| `expiresAt` | Date | ✅ |

**Constraints**:
- `UNIQUE(planId, idempotencyKey)`
- `UNIQUE(planId) WHERE primary_status IN ('pending','running','paused','rolling-back') OR remediation_status != 'none'` (CM3-12)
**Index**: `(primary_status, started_at DESC)`, `(expiresAt)`.

### 12.5 `ContentMigrationStepResult` (CM3-20 closed schema)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `runId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `stepKey` | string | ✅ |
| `stepType` | string | ✅ |
| `status` | enum (pending·processing·success·failed-transient·failed-permanent·skipped·rolled-back) | ✅ |
| `inputSummary` | JSON (closed — § 3.8) | ✅ |
| `outputSummary` | JSON (closed) | optional |
| `diffDisplayHints` | JSON (closed) | optional |
| `rawArtifactRef` | string | optional |
| `rawArtifactRetentionExpiresAt` | Date | optional |
| `privacyClass` | enum (non-pii·pii·legal-sensitive) | ✅ |
| `containsPii` | boolean | ✅ |
| `exportAllowed` | boolean | ✅ |
| `writeSetManifest` | JSON (§ 3.7) | optional |
| `rollbackClass` | enum | ✅ |
| `startedAt`·`completedAt` | Date | ✅·optional |
| `expiresAt` | Date | ✅ |

**Constraints (CM4-10 SQL canonical 정정)**:
- `UNIQUE(runId, stepKey)`
- `CHECK (privacy_class != 'non-pii' OR contains_pii = false)`
- `CHECK (NOT contains_pii OR export_allowed = false)` — PII step export 금지 DB 강제 (CM4-10)
**Index**: `(runId, started_at DESC)`, `(expiresAt)`, `(privacy_class) WHERE privacy_class IN ('pii','legal-sensitive')`.

### 12.6 `ContentMigrationStepRetryQueue` (CM3-07 worker SQL)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `stepResultId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `attempts` | integer | ✅ |
| `maxAttempts` | integer | ✅ |
| `status` | enum (pending·processing·completed·exhausted·failed-permanent) | ✅ |
| `nextAttemptAt` | Date | ✅ |
| `lockedAt`·`lockedBy` | Date·string | optional |
| `lastError`·`lastErrorClass` | string·enum (transient·permanent) | optional |
| `exhaustedAt` | Date | optional |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(stepResultId) WHERE status IN ('pending','processing')`.
**Index**: `(status, next_attempt_at, locked_at) WHERE status IN ('pending','processing')`.

**worker SoT SQL** (CM3-07 자체 전개):

```sql
-- claim
WITH next AS (
  SELECT id FROM content_migration_step_retry_queue
  WHERE status='pending' AND next_attempt_at <= now()
    AND (locked_at IS NULL OR locked_at < now() - interval '10 minutes')
  ORDER BY next_attempt_at FOR UPDATE SKIP LOCKED LIMIT 1
)
UPDATE content_migration_step_retry_queue q
SET status='processing', locked_at=now(), locked_by=$worker, attempts=attempts+1
FROM next WHERE q.id=next.id RETURNING q.*;

-- transient fail (backoff)
UPDATE content_migration_step_retry_queue
SET status='pending', locked_at=null, last_error=$err, last_error_class='transient',
    next_attempt_at = now() + (interval '1 second' * (CASE attempts WHEN 1 THEN 60 WHEN 2 THEN 600 ELSE 3600 END))
WHERE id=$id;

-- permanent
UPDATE content_migration_step_retry_queue
SET status='failed-permanent', locked_at=null, last_error_class='permanent'
WHERE id=$id;

-- success
UPDATE content_migration_step_retry_queue SET status='completed', locked_at=null WHERE id=$id;

-- exhausted
UPDATE content_migration_step_retry_queue
SET status='exhausted', exhausted_at=now(), locked_at=null
WHERE id=$id AND attempts >= max_attempts;
-- + sink alert + run.retryExhaustedAction trigger

-- stale reclaim
UPDATE content_migration_step_retry_queue
SET locked_at=null, locked_by=null
WHERE status='processing' AND locked_at < now() - interval '10 minutes';
```

### 12.7 `ContentMigrationRollbackLog`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `runId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `rolledBackStepKey` | string | ✅ |
| `rollbackClass` | enum | ✅ |
| `scope` | enum (full·from-step) | ✅ |
| `skippedIrreversibleSteps` | JSON ({stepKey, remediationTicketRef}[]) | ✅ |
| `result` | enum (success·partial·failed) | ✅ |
| `executedAt` | Date | ✅ |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(runId, rolledBackStepKey)`.
**Index**: `(runId, executedAt DESC)`.

### 12.8 `ContentMigrationReadOnlyWindow`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `runId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `startedAt`·`endedAt` | Date | ✅·optional |
| `blockedWriteAttempts` | integer | ✅ default 0 |
| `queuedDispatchCount` | integer | ✅ default 0 |
| `active` | boolean | ✅ |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(runId) WHERE active=true`.
**Index**: `(active, started_at DESC)`.

### 12.9 `ContentMigrationPolicyReevaluateBatch`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `runId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `planId` | UUID | ✅ — FK |
| `checked`·`cacheHit`·`skippedNoChange`·`changed`·`error` | integer | ✅ |
| `startedAt`·`completedAt` | Date | ✅·optional |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(runId)`.

### 12.10-pre `ContentMigrationPolicyReevaluateRecord` (CM5-01 — 별도 table 승격)

batch row 1개당 per-ComplianceRecord N row. 별도 물리 table. PolicyReevaluateResult 기록:

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `batchId` | UUID | ✅ — FK § 12.9 |
| `complianceRecordId` | UUID | ✅ |
| `cachedResultRef` | UUID | optional |
| `previousRiskLevel`·`newRiskLevel` | enum | ✅ |
| `riskDelta` | enum (decreased·unchanged·increased) | ✅ |
| `priorReviewRequiredChanged` | boolean | ✅ |
| `legalSensitiveEntityChanged` (CM5-06) | boolean | ✅ |
| `legalEntityIdentityChanged` (CM5-06) | boolean | ✅ |
| `fieldProjectionDiff` (CM5-06) | JSON (string[]) | ✅ |
| `forcedReportingMode` | enum (stale-flags-only·new-record-version) | ✅ |
| `forcedReportingModeReason` | string | optional |
| `newComplianceRecordId` | UUID | optional (new-record-version 적용 시) |

**Constraints**: `UNIQUE(batchId, complianceRecordId)`.

### 12.10 `ContentMigrationNotificationOutbox` (CM3-14)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `sourceKind` | enum (plan·run) | ✅ |
| `sourceId` | string | ✅ |
| `eventType` | enum (NotificationEventType 4종) | ✅ |
| `sourceEventId` | char(64) | ✅ |
| `payload` | JSON | ✅ |
| `status` | enum (pending·processing·sent·permanent) | ✅ |
| `attempts` | integer | ✅ default 0 |
| `nextAttemptAt` | Date | ✅ |
| `lastAttemptAt`·`sentAt` | Date | optional |
| `lockedAt`·`lockedBy` | Date·string | optional |
| `lastError` | string | optional |
| `createdAt` | Date | ✅ |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(sourceEventId)`. `UNIQUE(sourceKind, sourceId, eventType)`.
**Index**: `(status, next_attempt_at) WHERE status='pending'`, `(expiresAt)`.

---

### 12.11 `ContentMigrationActiveTargetLock` (CM4-06·07 신설)

dry-run·apply 동시성 차단 — `(instanceId, targetSetDigest, writeSetScopeDigest)` 단위로 active state lock.

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `targetSetDigest` | char(64) | ✅ |
| `writeSetScopeDigest` | char(64) | ✅ — step writeSetProjection canonical hash |
| `runId` | UUID | optional — apply Run 진행 중일 때 채움. FK § 12.4 |
| `dryRunPlanId` | UUID | optional — dry-run 진행 중일 때 채움. FK § 12.1 |
| `kind` | enum (`apply`·`dry-run`) | ✅ |
| `acquiredAt` | Date | ✅ |
| `expiresAt` | Date | ✅ — heartbeat 갱신. cleanup worker가 stale 회수 |

**Constraints**:
- `UNIQUE(instanceId, targetSetDigest, writeSetScopeDigest)` — 동일 target/write scope에 active lock 1개만
- `CHECK ((kind='apply' AND run_id IS NOT NULL AND dry_run_plan_id IS NULL) OR (kind='dry-run' AND run_id IS NULL AND dry_run_plan_id IS NOT NULL))`
- `FK runId ON DELETE CASCADE`·`FK dryRunPlanId ON DELETE CASCADE`

**Index**: `(expires_at)` — cleanup. `(instance_id, target_set_digest)`.

**획득·해제 protocol**:
- runDryRun·runApply 시작 시 lock 획득 (timeout 60초). 실패 → 409 conflict
- run 완료/cancelled/rolled-back/aborted 또는 dry-run 완료 시 lock 해제
- heartbeat: 진행 중인 worker가 expiresAt을 5분 단위로 갱신
- stale (expiresAt 도래) → cleanup worker가 해제 + sink alert

`writeSetScopeDigest` 산정 (CM5-04 고정 정의): `HMAC(digestPepperRef, stepRegistryVersion + ":" + ordered(stepKey + writeSetProjection canonical + targetEntityTypes))` char(64). DryRunReport에 저장된 동일 digest를 apply lock 획득에도 그대로 사용 — registry drift 시 lock 획득 전 CAS fail로 종료.

---

**총 12개 admin DB 테이블** (CM5-01 정정):

| § | 테이블 |
|---|---|
| 12.1 | `ContentMigrationPlan` |
| 12.2 | `ContentMigrationDryRunReport` |
| 12.3 | `ContentMigrationLegalApproval` |
| 12.4 | `ContentMigrationRun` |
| 12.5 | `ContentMigrationStepResult` |
| 12.6 | `ContentMigrationStepRetryQueue` |
| 12.7 | `ContentMigrationRollbackLog` |
| 12.8 | `ContentMigrationReadOnlyWindow` |
| 12.9 | `ContentMigrationPolicyReevaluateBatch` |
| 12.10 | `ContentMigrationPolicyReevaluateRecord` (CM5-01 — 별도 table) |
| 12.11 | `ContentMigrationNotificationOutbox` |
| 12.12 | `ContentMigrationActiveTargetLock` |


 succeeded in 709ms:
Reading additional input from stdin...
OpenAI Codex v0.130.0
--------
workdir: C:\Users\assag\solution\website-exposure
model: gpt-5.5
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR, C:\Users\assag\.codex\memories]
reasoning effort: none
reasoning summaries: none
session id: 019e293d-27ea-7e20-9f83-d532b6cd07e0
--------
user
# 자동 비평 의뢰 — `docs/features/content-migration.md` v0.5 (5차 사이클)

## 컨텍스트

4차 비평(14 지적) 전건 수용. v0.5 핵심:
- ApplyPreflightToken opaque + dryRunReportId explicit lookup (CM4-01)
- digestComputationMode 3종 (full·snapshot·cache) + invalidationInputs (CM4-02)
- append-only-watermark concurrency 강화 (lowerBound·exclusiveUpperBound·sourcePredicateHash·writerIdField·expectedInsertedCount·concurrencyMode) (CM4-03)
- Run status 3축 transition matrix + DB CHECK invariant (CM4-04). partial-rollback은 별도 primaryStatus 아님
- markStepCompensated·abortRun v1.0 정식 command + REVIEW_WORKFLOW cascade 추가 (CM4-05)
- ContentMigrationActiveTargetLock § 12.11 신설 (CM4-06·07)
- legalEntityChanged 분해 → legalSensitiveEntityChanged + legalEntityIdentityChanged (CM4-08)
- 인벤토리 11 tables (CM4-09)
- PII export DB CHECK SQL canonical (CM4-10)
- SkipStepInput.rollbackClass 제거 (CM4-11)
- § 6.3 fixture matrix 28 INV × happy + violation (CM4-12)
- dispatchAllowlistPolicySnapshot drift 방지 (CM4-13)
- § 1.1 SemVer 4행 추가 (CM4-14)

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\content-migration.md` v0.5를 v1.0 안정판 후보로서 엄정하게 비평하라:

1. **4차 지적 재발 여부**: 14개 지적이 실제로 정정됐는가?
2. **v0.5 신규 메커니즘 모순**:
   - REVIEW_WORKFLOW cascade가 `step-compensated`·`run-aborted` AuditAction 2종 추가됐는데 § 9.1.1 매트릭스에는 NotificationEvent 미정의 — 운영 SLA에서 어떻게 처리?
   - § 4.3.2 3축 invariant DB CHECK 표현이 PostgreSQL CASE 문법인데 모든 transition을 포함하지 못함 (cancelled+failed에 rollbackOutcome IN 허용 등)
   - ActiveTargetLock writeSetScopeDigest 산정 — step별 writeSetProjection canonical hash인데 dry-run 시점과 apply 시점 step 변경 가능성?
   - § 12.9.1 embedded child 명시했지만 § 12.9 PolicyReevaluateBatch row 1개당 N record 어떻게 저장? JSON column 또는 별도 table?
3. **누락 cascade**:
   - REVIEW_WORKFLOW § 9.1·§ 10.2.1에 `step-compensated`·`run-aborted` 추가 확인 (방금 본 cycle에서 cascade는 했음 — 확인)
   - § 9.1.1 매트릭스에 `step-compensated`·`run-aborted` 이벤트 추가 필요?
4. **stand-alone readiness**:
   - § 1.1·§ 2.4·§ 3.x·§ 4.x·§ 6.x·§ 9.x·§ 12.x가 단일 문서 SoT로 v1.0 구현 가능한가?
5. **v1.0 안정판 기준**:
   - blocking 0개?
   - SoT cascade 동기화 완료?
   - 의료법·개인정보보호법 운영 가능?

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `CM5-`. **v1.0 안정판 후보로 판정 가능하면 verdict="ready_for_v1_0"** 명시.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\content-migration.md` (대상 v0.5)
- `C:\Users\assag\solution\website-exposure\.codex-reviews\cm_cycle4_response.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
codex
문서 간 SoT 동기화와 v0.5 자체 모순을 같이 보겠습니다. 먼저 대상 문서와 4차 응답, 관련 REVIEW_WORKFLOW/DATA_MODEL의 해당 섹션을 빠르게 찾아 근거 위치를 잡겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "CM4-|step-compensated|run-aborted|NotificationEvent|AuditAction|transition|rollbackOutcome|ActiveTargetLock|writeSetScopeDigest|PolicyReevaluateBatch|embedded child|digestComputationMode|ApplyPreflightToken|append-only-watermark|dispatchAllowlistPolicySnapshot|SemVer" docs/features/content-migration.md .codex-reviews/cm_cycle4_response.md docs/admin/REVIEW_WORKFLOW.md docs/core/DATA_MODEL.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path .codex-reviews/cm_cycle4_response.md -TotalCount 260' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/features/content-migration.md -TotalCount 260' in C:\Users\assag\solution\website-exposure
 succeeded in 588ms:
docs/core/DATA_MODEL.md:637:SemVer 형식 (`"1.4.2"`).
docs/admin/REVIEW_WORKFLOW.md:146:| `rejected → draft` | 작성자 본문 정정 액션 (재제출은 별도 transition) | 작성자 |
docs/admin/REVIEW_WORKFLOW.md:419:  transitionEventId: string;             // analytics-reporting의 결정적 sourceEventId — idempotency
docs/admin/REVIEW_WORKFLOW.md:427:1. `transitionEventId` UNIQUE 검사 — 동일 전이 중복 호출 차단 (멱등)
docs/admin/REVIEW_WORKFLOW.md:464:### 9.1 NotificationEventType enum (canonical SoT)
docs/admin/REVIEW_WORKFLOW.md:467:type NotificationEventType =
docs/admin/REVIEW_WORKFLOW.md:565:- **`recipientRole="author"` 산정 (`blocked-correction-required` 등)**: 콘텐츠의 작성자 AdminUser ID는 워크플로 transition actorId 또는 콘텐츠 `@createdBy`(어드민 DB) 기준. AdminUser가 아닌 외부 작성자(예: 클라이언트 직접 입력 콘텐츠)에는 본 이벤트 발송 금지 — operator로 fallback 후 operator가 작성자에게 별도 전달 (운영 정책)
docs/admin/REVIEW_WORKFLOW.md:566:- **multi-location 인스턴스의 locationRef**: NotificationEvent에 `metadata.locationRef`(LocationProfile @id) 권장. 호출자(REVIEW_WORKFLOW transition)가 콘텐츠 소속 location을 산정·전달. 미해결 시 LocationProfile `main=true` fallback (`features/notifications.md` § 8.4 client-approver businessHours 정책 입력)
docs/admin/REVIEW_WORKFLOW.md:571:- **NotificationEvent** — 워크플로 트리거(`features/notifications.md` notify() 입력)에서 발생한 envelope. 1 event → N recipients
docs/admin/REVIEW_WORKFLOW.md:575:type NotificationEvent = {
docs/admin/REVIEW_WORKFLOW.md:577:  sourceEventId: string;                               // 워크플로 transition id 또는 호출자 idempotency key (필수 — § 9.2.1 idempotency 계약)
docs/admin/REVIEW_WORKFLOW.md:578:  eventType: NotificationEventType;                    // § 9.1 enum
docs/admin/REVIEW_WORKFLOW.md:594:  eventId: string;                                     // 상위 NotificationEvent 참조
docs/admin/REVIEW_WORKFLOW.md:595:  eventType: NotificationEventType;
docs/admin/REVIEW_WORKFLOW.md:609:- `sourceEventId`는 호출자(워크플로 transition·SLA 스케줄러)가 결정적으로 생성. 동일 transition은 항상 동일 ID
docs/admin/REVIEW_WORKFLOW.md:644:  action: AuditAction;          // § 10.2.1 enum
docs/admin/REVIEW_WORKFLOW.md:652:#### 10.2.1 AuditAction enum
docs/admin/REVIEW_WORKFLOW.md:655:type AuditAction =
docs/admin/REVIEW_WORKFLOW.md:701:  | "content-migration-step-compensated"      // CM4-05 — markStepCompensated
docs/admin/REVIEW_WORKFLOW.md:702:  | "content-migration-run-aborted";          // CM4-05 — abortRun
docs/features/content-migration.md:9:> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (4종 NotificationEventType + **13종 AuditAction** cascade 완료)
docs/features/content-migration.md:21:- **핵심 책임**: (a) migration plan 정의·validate·dry-run·legal-gate·apply, (b) rollbackClass 강제 + writeSetManifest strategy별 partial write 감지, (c) read-only window writeClass 7종 세분화, (d) ApplyPreflightToken (8필드 server-side CAS), (e) policy-version-reevaluate risk-based + PolicyReevaluateResult 비교, (f) deterministic legalImpactClassifier + PII·entity field catalog SoT, (g) Run status primaryStatus + substate
docs/features/content-migration.md:26:- **DB 인벤토리 (CM4-06·07·09 정정)**: **11 tables** (§ 12.1 ~ § 12.11 — 12.9.1은 embedded·12.11 ContentMigrationActiveTargetLock 신설)
docs/features/content-migration.md:34:| 변경 유형 | 패키지 SemVer | policyVersion | 동반 cascade |
docs/features/content-migration.md:55:| ApplyPreflightToken algorithm 변경 | **MAJOR** | policyVersion 신규 | |
docs/features/content-migration.md:56:| **writeSetManifest strategy semantic 변경** (isolation·concurrency·watermark 의미 변경 — CM4-14) | **MAJOR** | policyVersion 신규 | |
docs/features/content-migration.md:57:| **policy-reevaluate reportingMode decision rule 변경** (CM4-14) | **MAJOR** | policyVersion 신규 | |
docs/features/content-migration.md:58:| **staleFlagsOnlyOverrideConditions 입력 변경** (CM4-14) | **MAJOR** | policyVersion 신규 | |
docs/features/content-migration.md:59:| **ActiveTargetLock kind enum 추가·writeSetScopeDigest 산정 변경** (CM4-06) | **MAJOR** | policyVersion 신규 | |
docs/features/content-migration.md:70:- 본 문서 = plan/step/파이프라인·rollbackClass·writeSetManifest·CAS digest·legalImpactClassifier rule·read-only writeClass·step registry 최소 계약·privacy·NotificationEvent mapping SoT
docs/features/content-migration.md:110:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 4종 NotificationEventType |
docs/features/content-migration.md:111:| REVIEW_WORKFLOW § 10.2.1 | 13종 AuditAction |
docs/features/content-migration.md:150:          dispatchAllowlist:                            # CM3-03 + CM4-13 — REVIEW_WORKFLOW § 9.1.1 derived rule + hash drift 방지
docs/features/content-migration.md:155:          dispatchAllowlistPolicySnapshot: "rw-policy-2026-05-15"   # CM4-13 — REVIEW_WORKFLOW snapshot hash. drift 시 build fail
docs/features/content-migration.md:180:          requiresNoLegalSensitiveEntityChange: true     # CM4-08
docs/features/content-migration.md:181:          requiresNoLegalEntityIdentityChange: true      # CM4-08
docs/features/content-migration.md:209:| **`applyPreflightToken`** (CM3-09·CM4-01) | HMAC(applyPreflightTokenPepperRef, planId + dryRunReportId + 8필드 digest bundle). char(64) opaque. **opaque이므로 decode 불가** — client는 token + dryRunReportId 둘 다 전달. server는 `(planId, dryRunReportId)`로 row lookup 후 token 재계산 비교 (CM4-01 정정) |
docs/features/content-migration.md:219:| 종류 | 함수 | 책임 | 권한 | AuditAction (canonical) | NotificationEvent |
docs/features/content-migration.md:225:| 실행 | `runApply` (ApplyPreflightToken) | apply | super-admin | `content-migration-run-started` | — |
docs/features/content-migration.md:231:| 실행 | `markStepCompensated` (CM4-05) | manual remediation compensation 적용 표시 | super-admin + remediationTicketRef | `content-migration-step-compensated` | — |
docs/features/content-migration.md:232:| 실행 | `abortRun` (CM4-05) | cancellation-timeout 또는 blocked-manual-remediation 강제 종료 | super-admin + remediationTicketRef + 운영 ticket | `content-migration-run-aborted` | `content-migration-run-failed` |
docs/features/content-migration.md:238:### 3.1.1 AuditAction metadata 표 (CM3-19 — actorId·requestFingerprint·8필드 일관)
docs/features/content-migration.md:240:**공통 metadata required (모든 AuditAction)**: `actorId`·`actorRole`·`idempotencyKey`·`requestFingerprint`.
docs/features/content-migration.md:242:| AuditAction (canonical) | 추가 metadata |
docs/features/content-migration.md:264:신규 Feature 활성화 시 기존 row를 새 schema에 맞춰 변환 (예: notifications 활성화 시 기존 audit row에서 NotificationEvent 파생).
docs/features/content-migration.md:317:// CM3-09·CM4-01 — opaque token + dryRunReportId 둘 다 전달
docs/features/content-migration.md:320:  dryRunReportId: string;                               // CM4-01 — token opaque이므로 explicit lookup key 필요
docs/features/content-migration.md:342:  stepResultId: string;                                 // CM4-11 — rollbackClass=irreversible만 허용
docs/features/content-migration.md:351:// CM4-05 신규
docs/features/content-migration.md:361:// CM4-05 신규
docs/features/content-migration.md:371:// CM3-04 + CM4-08 — legalEntityChanged 분해
docs/features/content-migration.md:378:  legalSensitiveEntityChanged: boolean;                  // CM4-08 — LegalDocument·ReviewPolicy·PricingPage·전후사진·후기 contentType class diff
docs/features/content-migration.md:379:  legalEntityIdentityChanged: boolean;                   // CM4-08 — 법인명·소속·법적 식별자 변경
docs/features/content-migration.md:380:  fieldProjectionDiff: string[];                         // CM4-08 — diff된 field path 목록 (catalog 통과)
docs/features/content-migration.md:412:### 3.5 ApplyPreflightToken (CM3-09 + CM4-01·02 정정)
docs/features/content-migration.md:416:1. DryRunReport row insert — 8필드 digest 포함 + digestComputationMode·invalidationInputs 기록 (CM4-02)
docs/features/content-migration.md:421:1. (input.planId, input.dryRunReportId)로 DryRunReport row lookup (CM4-01 — token opaque)
docs/features/content-migration.md:424:4. **digestComputationMode별 invalidation precheck** (CM4-02):
docs/features/content-migration.md:455:// CM3-10·CM4-03 — strategy 분기 + append-only concurrency 보강
docs/features/content-migration.md:459:  | { kind: "append-only-watermark";
docs/features/content-migration.md:461:      lowerBound: string;                                // CM4-03 — 시작 watermark
docs/features/content-migration.md:462:      exclusiveUpperBound: string;                       // CM4-03
docs/features/content-migration.md:463:      sourcePredicateHash: string;                       // CM4-03 — predicate canonical hash
docs/features/content-migration.md:464:      writerIdField: string;                             // CM4-03 — `migration_run_id` 등 본 run row 식별
docs/features/content-migration.md:465:      expectedInsertedCount: number;                     // CM4-03
docs/features/content-migration.md:466:      concurrencyMode: "serializable" | "advisory-lock-range";  // CM4-03 — phantom row 방지
docs/features/content-migration.md:486:  highWatermark?: { before: string; after: string };    // append-only-watermark
docs/features/content-migration.md:499:- `append-only-watermark` (CM4-03):
docs/features/content-migration.md:581:4. 완료 → rollbackOutcome=full (skippedIrreversibleSteps=0) 또는 partial (skipped 있음)
docs/features/content-migration.md:582:5. rollback 실패 → rollbackOutcome=failed + super-admin alert
docs/features/content-migration.md:586:### 4.3 pause / resume / cancel state transition + 3축 transition matrix (CM4-04)
docs/features/content-migration.md:588:#### 4.3.1 명령별 transition
docs/features/content-migration.md:590:| 호출 | primaryStatus 전제 | 동작 | 결과 (primary·remediation·rollbackOutcome) |
docs/features/content-migration.md:601:| markStepCompensated (CM4-05) | rolling-back·blocked-manual-remediation-required | compensation 적용 표시 | rolling-back·blocked-manual-remediation-required → 정리 시 rolled-back·none·**partial** |
docs/features/content-migration.md:603:| abortRun (CM4-05) | running·cancellation-timeout-manual-review 또는 rolling-back·blocked-manual-remediation-required | 강제 종료 + 운영 ticket 필수 | failed·cancellation-timeout-manual-review·**failed** (rollback 시도 실패 또는 timeout) |
docs/features/content-migration.md:623:**partial-rollback은 별도 primaryStatus 아님** (CM4-04 정정) — `primaryStatus='rolled-back' + rollbackOutcome='partial'`로 표현.
docs/features/content-migration.md:642:| `notification-emit-outbox` | NotificationEvent emit + outbox insert | 허용 |
docs/features/content-migration.md:707:**LLM 분류 금지 (v1.0)**. class enum 변경·catalog 변경 SemVer § 1.1.
docs/features/content-migration.md:724:5. forcedReportingMode 결정 (CM4-08):
docs/features/content-migration.md:733:7. ContentMigrationPolicyReevaluateBatch row 갱신: checked·cacheHit·skippedNoChange·changed·error 카운트
docs/features/content-migration.md:742:### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT)
docs/features/content-migration.md:753:### 5.3 NotificationEvent 매핑
docs/features/content-migration.md:771:| ApplyPreflightToken mismatch 차단율 | 100% | |
docs/features/content-migration.md:788:| INV-CAS-PREFLIGHT-TOKEN | § 9.2 ApplyPreflightToken mismatch | dry-run/apply drift |
docs/features/content-migration.md:812:| INV-ACTIVE-TARGET-LOCK (CM4-06·07) | § 9.2 ActiveTargetLock UNIQUE 충돌 | concurrency |
docs/features/content-migration.md:813:| INV-RUN-STATUS-3AXIS (CM4-04) | § 12.4 CHECK 3축 invariant | state-machine |
docs/features/content-migration.md:814:| INV-APPEND-ONLY-PHANTOM (CM4-03) | § 9.2 phantom row writerId 검사 | partial-write |
docs/features/content-migration.md:815:| INV-LEGAL-ENTITY-DISCRIMINATE (CM4-08) | § 9.2 legalSensitive/Identity 분해 | policy |
docs/features/content-migration.md:816:| INV-DISPATCH-DRIFT (CM4-13) | § 9.1 dispatchAllowlistPolicySnapshot mismatch | notification |
docs/features/content-migration.md:818:### 6.3 acceptance fixture matrix (CM4-12 — happy + violation 각 INV마다)
docs/features/content-migration.md:846:| **INV-ACTIVE-TARGET-LOCK** (CM4-06·07) | 다른 targetSetDigest plan 동시 apply → 정상 | 동일 targetSetDigest plan 동시 apply → 두 번째 409 |
docs/features/content-migration.md:847:| **INV-RUN-STATUS-3AXIS** (CM4-04) | primaryStatus=rolled-back + rollbackOutcome=full → 정상 | primaryStatus=rolled-back + rollbackOutcome=none → CHECK reject |
docs/features/content-migration.md:848:| **INV-APPEND-ONLY-PHANTOM** (CM4-03) | [lowerBound, upperBound) 범위 + 본 writerId만 → 정상 | 다른 writerId row 발견 → step abort |
docs/features/content-migration.md:849:| **INV-LEGAL-ENTITY-DISCRIMINATE** (CM4-08) | legalSensitiveEntityChanged=false + legalEntityIdentityChanged=false + low risk → stale-flags-only override | legalSensitiveEntityChanged=true → new-record-version 강제 |
docs/features/content-migration.md:850:| **INV-DISPATCH-DRIFT** (CM4-13) | dispatchAllowlistPolicySnapshot = REVIEW_WORKFLOW 현재 hash → build ok | snapshot mismatch → build fail |
docs/features/content-migration.md:879:- **`readOnlyWindow.dispatchAllowlistPolicySnapshot` mismatch** — REVIEW_WORKFLOW § 9.1.1 현재 매트릭스 hash와 불일치 (CM4-13)
docs/features/content-migration.md:894:- classifierVersion mismatch → ApplyPreflightToken mismatch (CAS)
docs/features/content-migration.md:910:- **same-request replay** — `requestFingerprint` 일치 시 기존 결과 반환 (no-op) [INV-IDEMPOTENCY-REPLAY] (CM4-12)
docs/features/content-migration.md:911:- **PII StepResult export 시도** (`contains_pii=true + export_allowed=true`) → DB CHECK reject + audit [INV-PRIVACY-EXPORT] (CM4-12)
docs/features/content-migration.md:912:- **ActiveTargetLock 충돌** — 동일 (instanceId, targetSetDigest, writeSetScopeDigest) UNIQUE 위반 → 409 (CM4-06·07)
docs/features/content-migration.md:949:  - PolicyReevaluateBatch·Record: retentionDays.policyReevaluateBatch
docs/features/content-migration.md:981:| ~~CM-10~~ | abortRun command — v1.0 § 3.1·§ 3.3·§ 4.3 (CM4-05) |
docs/features/content-migration.md:982:| ~~CM-11~~ | markStepCompensated command — 동일 (CM4-05) |
docs/features/content-migration.md:1001:| 2026-05-15 | **v0.5** | **codex 4차 비평 14 지적 전건 수용**: (1) **ApplyPreflightToken opaque + dryRunReportId explicit lookup** — RunApplyInput에 dryRunReportId 추가 (CM4-01), (2) **digestComputationMode 3종** (full·snapshot·cache) + invalidationInputs cache invalidation 정밀화 (CM4-02), (3) **append-only-watermark concurrency 강화** — lowerBound·exclusiveUpperBound·sourcePredicateHash·writerIdField·expectedInsertedCount·concurrencyMode + phantom row writerId 검사 (CM4-03), (4) **Run status 3축 transition matrix § 4.3.1 + DB CHECK § 4.3.2/§ 12.4** — partial-rollback은 별도 primaryStatus 아님 (CM4-04), (5) **markStepCompensated·abortRun v1.0 정식 command** + CM-10·11 resolved 격상 + REVIEW_WORKFLOW cascade 2종 추가 (CM4-05), (6) **ContentMigrationActiveTargetLock § 12.11 신설** — instanceId+targetSetDigest+writeSetScopeDigest active unique. dry-run·apply 동시성 차단 (CM4-06·07), (7) **legalEntityChanged 분해** → legalSensitiveEntityChanged + legalEntityIdentityChanged. staleFlagsOnlyOverrideConditions 정렬 (CM4-08), (8) **§ 12.9.1 embedded 명시** + 인벤토리 11 tables로 정정 (§ 12.1-§ 12.11) (CM4-09), (9) **PII export DB CHECK SQL canonical** `CHECK (NOT contains_pii OR export_allowed = false)` (CM4-10), (10) **SkipStepInput에서 rollbackClass 제거** — irreversible only. manual-remediation-required는 remediationStatus reason (CM4-11), (11) **§ 6.3 fixture matrix 28 INV × happy + violation 각 1쌍** + § 9.2에 same-request replay·PII export·ActiveTargetLock 충돌 fail rule 추가 (CM4-12), (12) **dispatchAllowlistPolicySnapshot** — REVIEW_WORKFLOW 매트릭스 hash drift 시 build fail (CM4-13), (13) **§ 1.1 SemVer 4행 추가** — writeSetManifest strategy semantic·policy-reevaluate decision rule·staleFlagsOnlyOverrideConditions·ActiveTargetLock 변경 (CM4-14) |
docs/features/content-migration.md:1002:| 2026-05-15 | (v0.4 — 이전 비고) | **codex 3차 비평 21 지적 전건 수용** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |
docs/features/content-migration.md:1074:| `rollbackOutcome` | enum (none·full·partial·failed) | ✅ default none |
docs/features/content-migration.md:1075:| **CHECK** | § 4.3.2 3축 invariant DB CHECK (CM4-04) | |
docs/features/content-migration.md:1109:**Constraints (CM4-10 SQL canonical 정정)**:
docs/features/content-migration.md:1112:- `CHECK (NOT contains_pii OR export_allowed = false)` — PII step export 금지 DB 강제 (CM4-10)
docs/features/content-migration.md:1205:### 12.9 `ContentMigrationPolicyReevaluateBatch`
docs/features/content-migration.md:1244:| `eventType` | enum (NotificationEventType 4종) | ✅ |
docs/features/content-migration.md:1261:### 12.11 `ContentMigrationActiveTargetLock` (CM4-06·07 신설)
docs/features/content-migration.md:1263:dry-run·apply 동시성 차단 — `(instanceId, targetSetDigest, writeSetScopeDigest)` 단위로 active state lock.
docs/features/content-migration.md:1270:| `writeSetScopeDigest` | char(64) | ✅ — step writeSetProjection canonical hash |
docs/features/content-migration.md:1278:- `UNIQUE(instanceId, targetSetDigest, writeSetScopeDigest)` — 동일 target/write scope에 active lock 1개만
docs/features/content-migration.md:1290:`writeSetScopeDigest` 산정: step별 `writeSetProjection` canonical JSON merge → SHA-256.
docs/features/content-migration.md:1294:**총 11개 admin DB 테이블** — § 12.1·12.2·12.3·12.4·12.5·12.6·12.7·12.8·12.9·12.10·12.11. § 12.9.1은 § 12.9의 row-per-record embedded child (별도 table count 미포함 — JSON 또는 connecting table 구현 자유).
.codex-reviews/cm_cycle4_response.md:27:- ApplyPreflightToken § 3.5 — server-side 8필드 CAS (ETag 스타일)
.codex-reviews/cm_cycle4_response.md:28:- writeSetManifest strategy 4종 분기 (small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform)
.codex-reviews/cm_cycle4_response.md:29:- Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해
.codex-reviews/cm_cycle4_response.md:36:- § 1.1 SemVer catalog 3행 추가
.codex-reviews/cm_cycle4_response.md:37:- § 3.1.1 AuditAction metadata 공통 required (actorId·actorRole·idempotencyKey·requestFingerprint)
.codex-reviews/cm_cycle4_response.md:46:   - ApplyPreflightToken — 8필드 재계산이 매번 발생하면 apply 시점 비용 우려. 또는 cache로 처리? legalImpactClassificationDigest와 classifierVersion이 변경되면 server에서 어떻게 감지?
.codex-reviews/cm_cycle4_response.md:47:   - writeSetManifest strategy 4종 — append-only-watermark가 watermark 역행 검사로 충분한가? 동시 삽입은?
.codex-reviews/cm_cycle4_response.md:48:   - Run status substate 분해 — primaryStatus·remediationStatus·rollbackOutcome 3축이 모든 transition을 닫는가? § 4.3 표가 모든 조합을 다루지 않음
.codex-reviews/cm_cycle4_response.md:66:   - § 1.1 SemVer가 v0.4 신규 (Run status substate·ApplyPreflightToken·writeSetManifest strategy) 모두 다루는가
.codex-reviews/cm_cycle4_response.md:67:   - § 4.3 state transition 표 + § 12.4 status enum 정합
.codex-reviews/cm_cycle4_response.md:72:이전과 동일 JSON 스키마. 지적 ID 접두사 `CM4-`. v1.0 후보 판정 가능하면 `ready_for_v1_0=true`.
.codex-reviews/cm_cycle4_response.md:108:> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (4종 NotificationEventType + **13종 AuditAction** cascade 완료)
.codex-reviews/cm_cycle4_response.md:120:- **핵심 책임**: (a) migration plan 정의·validate·dry-run·legal-gate·apply, (b) rollbackClass 강제 + writeSetManifest strategy별 partial write 감지, (c) read-only window writeClass 7종 세분화, (d) ApplyPreflightToken (8필드 server-side CAS), (e) policy-version-reevaluate risk-based + PolicyReevaluateResult 비교, (f) deterministic legalImpactClassifier + PII·entity field catalog SoT, (g) Run status primaryStatus + substate
.codex-reviews/cm_cycle4_response.md:133:| 변경 유형 | 패키지 SemVer | policyVersion | 동반 cascade |
.codex-reviews/cm_cycle4_response.md:154:| ApplyPreflightToken algorithm 변경 | **MAJOR** | policyVersion 신규 | |
.codex-reviews/cm_cycle4_response.md:165:- 본 문서 = plan/step/파이프라인·rollbackClass·writeSetManifest·CAS digest·legalImpactClassifier rule·read-only writeClass·step registry 최소 계약·privacy·NotificationEvent mapping SoT
.codex-reviews/cm_cycle4_response.md:205:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 4종 NotificationEventType |
.codex-reviews/cm_cycle4_response.md:206:| REVIEW_WORKFLOW § 10.2.1 | 13종 AuditAction |
.codex-reviews/cm_cycle4_response.md:311:| 종류 | 함수 | 책임 | 권한 | AuditAction (canonical) | NotificationEvent |
.codex-reviews/cm_cycle4_response.md:317:| 실행 | `runApply` (ApplyPreflightToken) | apply | super-admin | `content-migration-run-started` | — |
.codex-reviews/cm_cycle4_response.md:328:### 3.1.1 AuditAction metadata 표 (CM3-19 — actorId·requestFingerprint·8필드 일관)
.codex-reviews/cm_cycle4_response.md:330:**공통 metadata required (모든 AuditAction)**: `actorId`·`actorRole`·`idempotencyKey`·`requestFingerprint`.
.codex-reviews/cm_cycle4_response.md:332:| AuditAction (canonical) | 추가 metadata |
.codex-reviews/cm_cycle4_response.md:354:신규 Feature 활성화 시 기존 row를 새 schema에 맞춰 변환 (예: notifications 활성화 시 기존 audit row에서 NotificationEvent 파생).
.codex-reviews/cm_cycle4_response.md:480:### 3.5 ApplyPreflightToken (CM3-09)
.codex-reviews/cm_cycle4_response.md:524:  | { kind: "append-only-watermark"; watermarkField: string }  // append-only: high watermark
.codex-reviews/cm_cycle4_response.md:543:  highWatermark?: { before: string; after: string };    // append-only-watermark
.codex-reviews/cm_cycle4_response.md:556:- `append-only-watermark`: actualAfterProjectionHash ≠ expectedAfterProjectionHash 또는 watermark 역행
.codex-reviews/cm_cycle4_response.md:633:4. 완료 → rollbackOutcome=full (skippedIrreversibleSteps=0) 또는 partial (skipped 있음)
.codex-reviews/cm_cycle4_response.md:634:5. rollback 실패 → rollbackOutcome=failed + super-admin alert
.codex-reviews/cm_cycle4_response.md:638:### 4.3 pause / resume / cancel state transition
.codex-reviews/cm_cycle4_response.md:672:| `notification-emit-outbox` | NotificationEvent emit + outbox insert | 허용 |
.codex-reviews/cm_cycle4_response.md:737:**LLM 분류 금지 (v1.0)**. class enum 변경·catalog 변경 SemVer § 1.1.
.codex-reviews/cm_cycle4_response.md:762:7. ContentMigrationPolicyReevaluateBatch row 갱신: checked·cacheHit·skippedNoChange·changed·error 카운트
.codex-reviews/cm_cycle4_response.md:771:### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT)
.codex-reviews/cm_cycle4_response.md:782:### 5.3 NotificationEvent 매핑
.codex-reviews/cm_cycle4_response.md:800:| ApplyPreflightToken mismatch 차단율 | 100% | |
.codex-reviews/cm_cycle4_response.md:817:| INV-CAS-PREFLIGHT-TOKEN | § 9.2 ApplyPreflightToken mismatch | dry-run/apply drift |
.codex-reviews/cm_cycle4_response.md:907:- classifierVersion mismatch → ApplyPreflightToken mismatch (CAS)
.codex-reviews/cm_cycle4_response.md:959:  - PolicyReevaluateBatch·Record: retentionDays.policyReevaluateBatch
.codex-reviews/cm_cycle4_response.md:1010:| 2026-05-15 | **v0.4** | **codex 3차 비평 21 지적 전건 수용 + REVIEW_WORKFLOW·DATA_MODEL cascade**: (1) **REVIEW_WORKFLOW § 10.2.1 cascade 4종 추가** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |
.codex-reviews/cm_cycle4_response.md:1082:| `rollbackOutcome` | enum (none·full·partial·failed) | ✅ default none |
.codex-reviews/cm_cycle4_response.md:1209:### 12.9 `ContentMigrationPolicyReevaluateBatch`
.codex-reviews/cm_cycle4_response.md:1248:| `eventType` | enum (NotificationEventType 4종) | ✅ |
.codex-reviews/cm_cycle4_response.md:1414:| `rejected → draft` | 작성자 본문 정정 액션 (재제출은 별도 transition) | 작성자 |
.codex-reviews/cm_cycle4_response.md:1687:  transitionEventId: string;             // analytics-reporting의 결정적 sourceEventId — idempotency
.codex-reviews/cm_cycle4_response.md:1695:1. `transitionEventId` UNIQUE 검사 — 동일 전이 중복 호출 차단 (멱등)
.codex-reviews/cm_cycle4_response.md:1732:### 9.1 NotificationEventType enum (canonical SoT)
.codex-reviews/cm_cycle4_response.md:1735:type NotificationEventType =
.codex-reviews/cm_cycle4_response.md:1833:- **`recipientRole="author"` 산정 (`blocked-correction-required` 등)**: 콘텐츠의 작성자 AdminUser ID는 워크플로 transition actorId 또는 콘텐츠 `@createdBy`(어드민 DB) 기준. AdminUser가 아닌 외부 작성자(예: 클라이언트 직접 입력 콘텐츠)에는 본 이벤트 발송 금지 — operator로 fallback 후 operator가 작성자에게 별도 전달 (운영 정책)
.codex-reviews/cm_cycle4_response.md:1834:- **multi-location 인스턴스의 locationRef**: NotificationEvent에 `metadata.locationRef`(LocationProfile @id) 권장. 호출자(REVIEW_WORKFLOW transition)가 콘텐츠 소속 location을 산정·전달. 미해결 시 LocationProfile `main=true` fallback (`features/notifications.md` § 8.4 client-approver businessHours 정책 입력)
.codex-reviews/cm_cycle4_response.md:1839:- **NotificationEvent** — 워크플로 트리거(`features/notifications.md` notify() 입력)에서 발생한 envelope. 1 event → N recipients
.codex-reviews/cm_cycle4_response.md:1843:type NotificationEvent = {
.codex-reviews/cm_cycle4_response.md:1845:  sourceEventId: string;                               // 워크플로 transition id 또는 호출자 idempotency key (필수 — § 9.2.1 idempotency 계약)
.codex-reviews/cm_cycle4_response.md:1846:  eventType: NotificationEventType;                    // § 9.1 enum
.codex-reviews/cm_cycle4_response.md:1862:  eventId: string;                                     // 상위 NotificationEvent 참조
.codex-reviews/cm_cycle4_response.md:1863:  eventType: NotificationEventType;
.codex-reviews/cm_cycle4_response.md:1877:- `sourceEventId`는 호출자(워크플로 transition·SLA 스케줄러)가 결정적으로 생성. 동일 transition은 항상 동일 ID
.codex-reviews/cm_cycle4_response.md:1912:  action: AuditAction;          // § 10.2.1 enum
.codex-reviews/cm_cycle4_response.md:1920:#### 10.2.1 AuditAction enum
.codex-reviews/cm_cycle4_response.md:1923:type AuditAction =
.codex-reviews/cm_cycle4_response.md:2092:- **핵심 책임**: (a) 호출자(REVIEW_WORKFLOW·SLA 스케줄러 등) NotificationEvent 수신, (b) **단일 DB 트랜잭션에서 NotificationLog 생성 + NotificationEventReceipt 원자 선점**, (c) § 9.1.1 매트릭스(fallback 채널 포함) 라우팅, (d) NotificationPayloadRecord 영속 + 채널 어댑터 호출, (e) 재시도·DLQ·suppression 처리, (f) audit log + NotificationLog/DeliveryAttempt 기록
.codex-reviews/cm_cycle4_response.md:2093:- **idempotency 원자 선점**: 1단계 단일 트랜잭션에서 Log insert → Receipt insert(`unique(instanceId, sourceEventId)`). 트랜잭션 commit 후에야 NotificationEventReceipt 가시화. 동일 sourceEventId 동시 호출은 unique 위반으로 한 쪽만 진입, 다른 쪽은 기존 결과 재구성 반환 (§ 14.2)
.codex-reviews/cm_cycle4_response.md:2105:**두 축 분리**: 본 Feature는 (a) **패키지 SemVer**(코드 호환성)와 (b) **policyVersion**(매트릭스 의미)을 분리 관리.
.codex-reviews/cm_cycle4_response.md:2107:| 변경 유형 | 패키지 SemVer | policyVersion | 비고 |
.codex-reviews/cm_cycle4_response.md:2110:| `NotificationEventType` enum 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9.1 cascade |
.codex-reviews/cm_cycle4_response.md:2153:> **세 버전 의미 차이** (N5-07): `specVersion`(본 문서 v0.x→1.0, 명세 자체) ≠ 패키지 SemVer(코드 호환성, InstanceManifest.features[].version) ≠ `notificationPolicyVersion`(§ 9.1.1 매트릭스 의미, § 1.1·§ 4.2).
.codex-reviews/cm_cycle4_response.md:2159:| `admin/REVIEW_WORKFLOW.md` § 9 | NotificationEventType·NotificationEvent/Payload·정책 매트릭스(fallback 채널 포함) |
.codex-reviews/cm_cycle4_response.md:2160:| `admin/REVIEW_WORKFLOW.md` § 10.2.1 | AuditAction enum (`notification-dispatched`·`notification-resend-attempted`·`notification-read`) |
.codex-reviews/cm_cycle4_response.md:2210:### 3.1 입력 — NotificationEvent
.codex-reviews/cm_cycle4_response.md:2226:  eventType: NotificationEventType;
.codex-reviews/cm_cycle4_response.md:2289:async function notify(event: NotificationEvent): Promise<DeliveryResult>
.codex-reviews/cm_cycle4_response.md:2295:  2. NotificationEventReceipt insert (`unique(instanceId, sourceEventId)` 위반 시 transaction abort)
.codex-reviews/cm_cycle4_response.md:2304:- `sourceEventId` 재사용 금지: NotificationEventReceipt는 `receiptRetentionDays`(기본 365일) 보존. 보존 만료 후 동일 sourceEventId는 새 이벤트로 처리 가능하지만 운영자가 명시적으로 manifest나 호출자 정책에 합치하지 않으면 사용 자제
.codex-reviews/cm_cycle4_response.md:2319:   - NotificationEventReceipt insert (unique(instanceId, sourceEventId))
.codex-reviews/cm_cycle4_response.md:2385:  - 패키지 SemVer와 분리: policyVersion append는 패키지 MINOR. policyVersion semantic 변경(같은 version의 의미 변경)은 금지 — 항상 새 version 부여
.codex-reviews/cm_cycle4_response.md:2413:  - dedupe TTL 만료 후라도 NotificationEventReceipt(§ 14.2)가 unique(instanceId, sourceEventId)로 막음
.codex-reviews/cm_cycle4_response.md:2517:**DigestConditionField 추가 cascade 정책** (N4-11): DigestConditionField에 새 metadata 필드를 추가하려면 (a) REVIEW_WORKFLOW § 9.2 NotificationEvent.metadata 타입에 해당 필드를 명시 cascade, (b) 본 enum 추가, (c) 본 Feature 패키지 새 policyVersion. metadata 필드의 enum 한정이 SoT.
.codex-reviews/cm_cycle4_response.md:2686:  1. NotificationEvent.metadata.locationRef
.codex-reviews/cm_cycle4_response.md:2804:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (7개 지적 전건 수용)**: (1) **REVIEW_WORKFLOW § 9.1.1 매트릭스 정정** — `sla-imminent`·`sla-overdue` 즉시 채널을 `email + inApp`으로 변경. fallback=inApp이 immediateChannels 집합 안에 포함되도록 cascade (N5-01), (2) **§ 4.1 1단계 abort 원인 분기 명시** — unique violation만 idempotent path, 그 외 abort는 retryable internal error 반환. § 3.3과 정합 (N5-02), (3) **DeliveryAttemptStatus 별도 정의** — 내부 attempt-level "processing"을 외부 DeliveryStatus와 분리. `DeliveryAttemptStatus = "processing" | DeliveryStatus` 합 타입 (N5-03), (4) **§ 4.1 흐름에 invalid locationRef 분기 추가** — businessHours 평가 직전 (f-pre)에 `skipped-missing-location` 명시. critical 이벤트도 본 분기는 우회하지 않음 (N5-04), (5) **MySQL generated column unique schema 정정** — `activeKey INT GENERATED AS (CASE WHEN resolvedAt IS NULL THEN 1 ELSE NULL END)` + `UNIQUE(payloadId, failingChannel, activeKey)`. resolved DLQ 이력 다수 허용 (N5-05), (6) **DATA_MODEL C-23 AdminUser.role cascade 정정** — `system` enum 값은 audit log actorRole 표기 전용. C-23 `role` 및 `instanceMemberships[].role`에는 저장 금지 명시 (N5-06), (7) **specVersion 1.0 + 세 버전 의미 차이** — specVersion(명세)·패키지 SemVer·notificationPolicyVersion 구분 한 줄 설명 (N5-07) (1) **트랜잭션 abort 원인 분기** — unique violation만 idempotent path, 그 외 retryable error (N4-01·N4-03), (2) **duplicate caller receiptState별 응답 계약** (N4-02), (3) **DeliveryAttempt advisory lock SoT** — pg_advisory_xact_lock + provider 호출은 lock 밖 (N4-04·N4-06). NT-17, (4) **UNIQUE(payloadId, channel, attemptNumber)** — dedupeMode 제외 (N4-05), (5) **§ 4.1 fallback immediateChannels 제약** 명시 (N4-07), (6) **fallback 실패 두 attempt 기록** + fallbackExhausted 메타 (N4-08), (7) **두 축 분리 정책** — 패키지 SemVer ↔ policyVersion (N4-09), (8) **policyVersion 보관 정책** — 12개월 최소 지원·deprecation·build fail 메시지 (N4-10), (9) **DigestConditionField cascade 규칙** (N4-11), (10) **exists/notExists deep path 평가 규칙** (N4-12), (11) **default policy 유일성 검증** (N4-13), (12) **broadcast PayloadRecord envelope+channel 단위 1건** + broadcast-placeholder는 DB row 아님 + broadcastAttemptId = broadcast DeliveryAttempt.id (N4-14·N4-15·N4-16), (13) **holidayCalendar 갱신·배포 정책** — 연간 minor·임시공휴일 patch·external-api override (N4-17). NT-18, (14) **businessHours 90일 탐색 한계** + failed-permanent (N4-18), (15) **invalid locationRef → `skipped-missing-location`** DeliveryStatus 신규 (N4-19), (16) **운영자 수동 unsuppress command** + REVIEW_WORKFLOW § 10.2.1 `notification-suppression-unsuppressed` cascade (N4-20·N4-21), (17) **soft → hard 전이 정책** (N4-22), (18) **큐 worker 중복 발송 방지 SoT 쿼리** + partial index (N4-23), (19) **inApp 단일 transaction 원자성** (N4-24), (20) **DeadLetterAttempt UNIQUE(attemptId)** — 1 attempt 1 DLQ (N4-25), (21) **MySQL generated column 대체 schema** 구체 명시 (N4-26), (22) **notification-read actorRole = instanceMemberships 현재 instance role** (N4-27), (23) **AdminUserRole `system` 추가** — REVIEW_WORKFLOW § 11.1 cascade (N4-28), (24) **multi-location + main 부재 fail 격상** (N4-29), (25) **NT-16 해소** (N4-30) (20 finding + 3 residual = 23 지적 전건 수용)**: (1) **Receipt-Log 트랜잭션 순서** — 단일 DB 트랜잭션에서 Log insert → Receipt insert. abort 시 양쪽 롤백 (N3-01), (2) **테이블 인벤토리 재산정 — 11 tables + Redis 1** — Receipt·Log·PayloadRecord·DeliveryAttempt·Inbox·DigestBucket·DigestBucketPayload·QuietHoursQueue·BusinessHoursQueue·DeadLetter·**DeadLetterAttempt(신설)** + DedupeCache. `NotificationDelivery` 가상 참조 제거 (N3-02·N3-19), (3) **DeliveryAttempt attemptNumber 동시성** — payloadId+channel 범위 row lock 또는 advisory lock + processing 선점 (N3-03), (4) **PayloadRecord recipient-envelope unit 명확화** — channel 필드 제거, directSentAt/digestSentAt 제거. 채널별 sentAt 추적은 DeliveryAttempt status만 사용 (N3-04), (5) **fallback 채널 매트릭스 SoT** — REVIEW_WORKFLOW § 9.1.1 컬럼 cascade. 임의 활성 채널 라우팅 금지, fallback도 막히면 외부 sink alert만 (N3-05), (6) **dedupe Redis SET NX EX 원자** — 명시 (N3-06), (7) **receipt vs dedupe TTL 관계** — `receiptRetentionDays`(기본 365일) ≫ dedupeWindowSeconds. sourceEventId 재사용 금지 (N3-07), (8) **REVIEW_WORKFLOW § 9.3 cascade** — Slack 2가지 동작 모드·DeliveryResult 소비 규칙 명시 (N3-08), (9) **broadcast envelope 단위 1건** — broadcastAttemptId·sentinel dedupeKey·perRecipient placeholder broadcastAttemptId 참조 (N3-09), (10) **DigestPolicy AST 구조화** — DigestCondition({field, op, value}) + 허용 enum (N3-10), (11) **policyVersion 병렬 보관** — 패키지에 버전별 매트릭스 보관, manifest opt-in, 롤백은 manifest 변경만 (N3-11), (12) **DigestBucketPayload FK 분리** — bucketId CASCADE, payloadId RESTRICT (N3-12), (13) **C-08 holidayCalendar cascade** — region·source. PublicHoliday SoT 정합. CT-02 dayOfWeek enum과 분리 (N3-13), (14) **LocationProfile `@id="main"` 관례 정합** — C-21 SoT 정합 (N3-14), (15) **suppression autoReleaseAt + worker** — § 7.4 1시간 주기. DATA_MODEL C-23 cascade (N3-15), (16) **suppression atomic increment** — DB atomic + compare-and-set threshold 1회 alert (N3-16), (17) **REVIEW_WORKFLOW § 10.2.1 enum cascade** — `notification-resend-attempted`·`notification-read` (N3-17), (18) **DLQ SQL syntax PostgreSQL** — partial unique index 표기 (N3-18), (19) **DATA_MODEL C-23 timezone 설명 정정** — quietHours 한정 (N3-20), (20) **inactive 사용자 historical inbox 정책** — 기본 숨김 + 인스턴스 옵션 (NT-16) (Residual), (21) **cadenceWindow 포맷 명시** — daily `YYYY-MM-DD`, weekly `YYYY-Wnn` (Residual), (22) **instanceMemberships 검증** — recipient AdminUser.instanceMemberships에 본 인스턴스 미포함 시 `skipped-missing-user` (Residual) |
.codex-reviews/cm_cycle4_response.md:2816:### 14.2 `NotificationEventReceipt` (idempotency 선점)
.codex-reviews/cm_cycle4_response.md:2841:| `eventType` | NotificationEventType | ✅ | |
.codex-reviews/cm_cycle4_response.md:2893:| `eventType` | NotificationEventType | ✅ | |
.codex-reviews/cm_cycle4_response.md:2913:| `eventType` | NotificationEventType | ✅ | |
.codex-reviews/cm_cycle4_response.md:3079:| 변경 유형 | 패키지 SemVer | policyVersion | 동반 cascade |
.codex-reviews/cm_cycle4_response.md:3085:| 운영 모드 추가 (`auto-promote` 등) | **MAJOR** | 별개 | Feature SemVer MAJOR + § 11 build fail 룰 갱신 + REVIEW_WORKFLOW 진입 지점 정의 |
.codex-reviews/cm_cycle4_response.md:3133:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 5종 NotificationEventType cascade 완료 |
.codex-reviews/cm_cycle4_response.md:3134:| REVIEW_WORKFLOW § 10.2.1 | 5종 AuditAction cascade 완료 |
.codex-reviews/cm_cycle4_response.md:3158:| AuditAction | contentRef | metadata 필수 필드 | 권한 |
.codex-reviews/cm_cycle4_response.md:3477:### 10.1 NotificationEventType 매트릭스 (REVIEW_WORKFLOW § 9.1.1 cascade 완료 — 5종)
.codex-reviews/cm_cycle4_response.md:3491:### 10.3 NotificationEvent 필드 매핑 (F-2)
.codex-reviews/cm_cycle4_response.md:3591:### 13.4 runtime invariant·reconcile (AI3-02 + AI3-12 SemVer 정책 — 별도 분리)
.codex-reviews/cm_cycle4_response.md:3648:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
.codex-reviews/cm_cycle4_response.md:3788:| `eventType` | NotificationEventType | ✅ |
.codex-reviews/cm_cycle4_response.md:3825:> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (7종 AuditAction)
.codex-reviews/cm_cycle4_response.md:3850:| 변경 유형 | 패키지 SemVer | policyVersion | 동반 cascade |
.codex-reviews/cm_cycle4_response.md:3920:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 4종 NotificationEventType |
.codex-reviews/cm_cycle4_response.md:3921:| REVIEW_WORKFLOW § 10.2.1 | 7종 AuditAction |
.codex-reviews/cm_cycle4_response.md:4028:### 3.1.1 audit log contract (7종 AuditAction)
.codex-reviews/cm_cycle4_response.md:4030:| AuditAction | contentRef | metadata | 권한 |
.codex-reviews/cm_cycle4_response.md:4584:§ 3.3.6 입력. CAS expectedIntegrationState="reverted". transition:
.codex-reviews/cm_cycle4_response.md:4589:#### 4.5.6 graceExpiry worker — committed → grace-expired transition (CS5-03)
.codex-reviews/cm_cycle4_response.md:4623:**enum 사용 명시 (CS5-03)**: CrmCredentialVersion.state="grace-expired"는 위 transition에서 사용. v1.0에서는 grace-expired row를 별도로 보관 (audit·운영자 review). 운영 정책상 revoked로 즉시 통합할지는 CS-22로 deferred.
.codex-reviews/cm_cycle4_response.md:4711:### 6.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT)
.codex-reviews/cm_cycle4_response.md:4896:- 7종 AuditAction insert 성공
.codex-reviews/cm_cycle4_response.md:4897:- 4종 NotificationEventType emit 성공
.codex-reviews/cm_cycle4_response.md:5093:- ContactDisplayHints는 6 column closed schema — 향후 column 추가는 § 1.1 SemVer 표 룰
.codex-reviews/cm_cycle4_response.md:5108:| 2026-05-14 | **v1.0** | **codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정 — v1.0 안정판 도달**. 7 cycle 누계 지적 71건 (21+17+17+13+6+1+0) 전건 수용. blocking 0·major 0·minor 1(차단 외 — CS7-01 revoked_at column 의미는 CS-22 처리 시 검토). SoT cascade 동기화 완료: REVIEW_WORKFLOW (4종 NotificationEventType + 7종 AuditAction), DATA_MODEL v0.20 (genericRestApiAdapter 5필드 + versionTokenType). 의료법·개인정보보호법 운영 가능 |
.codex-reviews/cm_cycle4_response.md:5478:| `eventType` | enum (NotificationEventType 4종) | ✅ |
.codex-reviews/cm_cycle4_response.md:5541:- § 3.1 command-audit-event 매핑 표 + 4종 AuditAction 본문 추가 (dry-run-completed·run-paused·run-resumed·rollback-triggered)
.codex-reviews/cm_cycle4_response.md:5547:- § 3.1.1 AuditAction metadata 표 (actorRole·policy snapshot)
.codex-reviews/cm_cycle4_response.md:5576:   - § 1.1 SemVer 표가 v0.3 신규를 모두 다루는가
.codex-reviews/cm_cycle4_response.md:5578:   - 잔여 "v0.2 동일" 표현 (plan kind 6종·NotificationEventType·NotificationEvent 매핑·retry 우선순위 표)
.codex-reviews/cm_cycle4_response.md:5747:| `rejected → draft` | 작성자 본문 정정 액션 (재제출은 별도 transition) | 작성자 |
.codex-reviews/cm_cycle4_response.md:6020:  transitionEventId: string;             // analytics-reporting의 결정적 sourceEventId — idempotency
.codex-reviews/cm_cycle4_response.md:6028:1. `transitionEventId` UNIQUE 검사 — 동일 전이 중복 호출 차단 (멱등)
.codex-reviews/cm_cycle4_response.md:6065:### 9.1 NotificationEventType enum (canonical SoT)
.codex-reviews/cm_cycle4_response.md:6068:type NotificationEventType =
.codex-reviews/cm_cycle4_response.md:6166:- **`recipientRole="author"` 산정 (`blocked-correction-required` 등)**: 콘텐츠의 작성자 AdminUser ID는 워크플로 transition actorId 또는 콘텐츠 `@createdBy`(어드민 DB) 기준. AdminUser가 아닌 외부 작성자(예: 클라이언트 직접 입력 콘텐츠)에는 본 이벤트 발송 금지 — operator로 fallback 후 operator가 작성자에게 별도 전달 (운영 정책)
.codex-reviews/cm_cycle4_response.md:6167:- **multi-location 인스턴스의 locationRef**: NotificationEvent에 `metadata.locationRef`(LocationProfile @id) 권장. 호출자(REVIEW_WORKFLOW transition)가 콘텐츠 소속 location을 산정·전달. 미해결 시 LocationProfile `main=true` fallback (`features/notifications.md` § 8.4 client-approver businessHours 정책 입력)
.codex-reviews/cm_cycle4_response.md:6172:- **NotificationEvent** — 워크플로 트리거(`features/notifications.md` notify() 입력)에서 발생한 envelope. 1 event → N recipients
.codex-reviews/cm_cycle4_response.md:6176:type NotificationEvent = {
.codex-reviews/cm_cycle4_response.md:6178:  sourceEventId: string;                               // 워크플로 transition id 또는 호출자 idempotency key (필수 — § 9.2.1 idempotency 계약)
.codex-reviews/cm_cycle4_response.md:6179:  eventType: NotificationEventType;                    // § 9.1 enum
.codex-reviews/cm_cycle4_response.md:6195:  eventId: string;                                     // 상위 NotificationEvent 참조
.codex-reviews/cm_cycle4_response.md:6196:  eventType: NotificationEventType;
.codex-reviews/cm_cycle4_response.md:6210:- `sourceEventId`는 호출자(워크플로 transition·SLA 스케줄러)가 결정적으로 생성. 동일 transition은 항상 동일 ID
.codex-reviews/cm_cycle4_response.md:6245:  action: AuditAction;          // § 10.2.1 enum
.codex-reviews/cm_cycle4_response.md:6253:#### 10.2.1 AuditAction enum
.codex-reviews/cm_cycle4_response.md:6256:type AuditAction =
.codex-reviews/cm_cycle4_response.md:6409:> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (4종 NotificationEventType + 9종 AuditAction)
.codex-reviews/cm_cycle4_response.md:6434:| 변경 유형 | 패키지 SemVer | policyVersion | 동반 cascade |
.codex-reviews/cm_cycle4_response.md:6503:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 4종 NotificationEventType |
.codex-reviews/cm_cycle4_response.md:6504:| REVIEW_WORKFLOW § 10.2.1 | 9종 AuditAction |
.codex-reviews/cm_cycle4_response.md:6598:| 종류 | 함수 | 책임 | 권한 | AuditAction | NotificationEvent |
.codex-reviews/cm_cycle4_response.md:6615:**Note**: REVIEW_WORKFLOW § 10.2.1 cascade는 v0.3에서 추가 AuditAction 3종(`dry-run-completed`·`run-paused`·`run-resumed`·`rollback-triggered`) 보완 필요 — 본 v0.3는 본문에 명시 + 다음 cycle cascade 진행 (CM2-12 부분).
.codex-reviews/cm_cycle4_response.md:6617:### 3.1.1 AuditAction metadata (CM2-23)
.codex-reviews/cm_cycle4_response.md:6619:| AuditAction | metadata 필수 | actorRole 필수 |
.codex-reviews/cm_cycle4_response.md:6858:| `notification-emit-outbox` (CM2-10) | NotificationEvent emit + outbox insert | **허용** (운영 알림 유지) |
.codex-reviews/cm_cycle4_response.md:6901:class 추가/삭제 SemVer: § 1.1. retroactive audit — false-negative 발견 시 영향 plan 재평가 필요 → 별도 운영 절차 (CM-09 신규 open).
.codex-reviews/cm_cycle4_response.md:6913:5. ContentMigrationPolicyReevaluateBatch row 갱신: checked·cacheHit·skippedNoChange·changed·error per-record resultRef 카운트
.codex-reviews/cm_cycle4_response.md:6923:### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT) — v0.2 동일
.codex-reviews/cm_cycle4_response.md:6927:### 5.3 NotificationEvent 매핑 — v0.2 § 4.7 동일
.codex-reviews/cm_cycle4_response.md:7046:  - PolicyReevaluateBatch: retentionDays.policyReevaluateBatch
.codex-reviews/cm_cycle4_response.md:7084:| AuditAction 3종(dry-run-completed·run-paused·run-resumed·rollback-triggered) REVIEW_WORKFLOW cascade | open — v0.4 cycle에서 cascade |
.codex-reviews/cm_cycle4_response.md:7095:| 2026-05-15 | **v0.3** | **codex 2차 비평 23 지적 전건 수용**: (1) **CAS digest 알고리즘 SoT § 2.4** — Merkle/chunked·snapshot fallback (CM2-01), (2) **irreversible 자동 skip 금지** — blocked-manual-remediation-required 상태 + 운영자 수동 skipStep (CM2-02), (3) **legalImpactClassifier deterministic rule SoT § 4.7** + LLM v1.0 금지 + fail-closed (CM2-03), (4) **forceProceedDespiteWarnings legal/critical 우회 금지** + expectedLegalImpactClassificationDigest·expectedClassifierVersion CAS 추가 (8필드 — CM2-04), (5) **§ 12 최소 constraints 명시** (풀 SQL은 v0.4 — CM2-05), (6) **writeSetManifest § 3.6** — partial write 감지 alg (CM2-06), (7) **step registry cooperativeCancellation 강제 § 3.5** — 미지원은 isolated chunk만 (CM2-07), (8) **policyReevaluate defaultReportingMode=risk-based** — legal/priorReview/Critical은 new-record-version 강제 (CM2-08), (9) **cacheDedupe = check() skip + cachedResultRef 기록** + batch count column (CM2-09), (10) **§ 4.5 writeClass 세분화** — notification-emit-outbox·dispatch·read-receipt·digest-state (CM2-10), (11) **§ 2.4 sourceSnapshotWatermark·policyVersionSnapshot 정의** (CM2-11), (12) **§ 3.1 command-audit-event 매핑 표** + dry-run-completed·run-paused·run-resumed·rollback-triggered audit 추가 (CM2-12), (13) **crm-sync 잔재 제거 + idempotency unique scope DB constraints** § 3.4 (CM2-13), (14) **step registry mutableFieldDenylist** + asset-ingestion body MV 보호 (CM2-14), (15) **§ 1.1 SemVer 보강** — CAS digest·class enum·reportingMode default·writeClass·skip policy·writeSetManifest schema (CM2-15), (16) **§ 3.7 read API privacy class 표** — closed schema masking (CM2-16), (17) **§ 3.5 step registry 최소 계약 본문** (CM2-17), (18) **§ 6.2 INV-* invariant 매핑 표** (CM2-18), (19) **§0/§8/§12 참조 §12로 통일** (CM2-19), (20) **§ 4.6 outbox SQL 자체 전개** (CM2-20), (21) **featureLegalApproved vs plan-level ContentMigrationLegalApproval 분리** + § 9.1 build fail 정정 (CM2-21), (22) **§ 2.3 impactSamplingMode=deterministic-stratified default + criticalClassFullDiff=true** (CM2-22), (23) **§ 3.1.1 AuditAction metadata 표** + actorRole·policy snapshot (CM2-23) |
.codex-reviews/cm_cycle4_response.md:7157:### 12.9 `ContentMigrationPolicyReevaluateBatch`
.codex-reviews/cm_cycle4_response.md:7192:- REVIEW_WORKFLOW § 9.1·§ 9.1.1: 4종 NotificationEventType cascade 완료
.codex-reviews/cm_cycle4_response.md:7193:- REVIEW_WORKFLOW § 10.2.1: 9종 AuditAction cascade 완료
.codex-reviews/cm_cycle4_response.md:7201:- pause/resume/cancel state transition + cooperative cancellation
.codex-reviews/cm_cycle4_response.md:7235:   - § 3.1 command 11종 ↔ § 3.1.1 audit 9종 ↔ § 4.7 NotificationEvent 매핑 4종 정합
.codex-reviews/cm_cycle4_response.md:7254:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "CrmCredentialVersion|partial unique|CAS|closed schema|displayHints|requestFingerprint|idempotencyKey|WHERE|unique|AuditAction|NotificationEvent|CredentialVersion" docs/features/crm-sync.md' in C:\Users\assag\solution\website-exposure
.codex-reviews/cm_cycle4_response.md:7256:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "state machine|4-state|body materialized|materialized view|asset-ingestion|handoff|DDL|AuditAction|NotificationEvent|retry|outbox|cancel|pause|resume|checksum" docs/features/asset-ingestion.md' in C:\Users\assag\solution\website-exposure
.codex-reviews/cm_cycle4_response.md:7258:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "''^(#|##|###|####)|ContentMigrationConfig|policy-version-reevaluate|application-data-version-upgrade|rollbackClass|planFingerprint|targetSetDigest|sourceSnapshotWatermark|policyVersionSnapshot|stepRegistryVersion|contentHashDigest|legalImpactClassifier|read-only|pause|resume|cancel|retry|autoRollback|idempotencyKey|requestFingerprint|routing-slug|asset-ingestion|DDL|migration-time|ContentMigrationStepRetryQueue|NotificationOutbox|reportingMode|forceProceed|classifierVersion|NotificationEvent|AuditAction|table|unique|CAS|checksum|partial" docs/features/content-migration.md' in C:\Users\assag\solution\website-exposure
.codex-reviews/cm_cycle4_response.md:7267:83:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 5종 NotificationEventType cascade 완료 |
.codex-reviews/cm_cycle4_response.md:7268:84:| REVIEW_WORKFLOW § 10.2.1 | 5종 AuditAction cascade 완료 |
.codex-reviews/cm_cycle4_response.md:7269:108:| AuditAction | contentRef | metadata 필수 필드 | 권한 |
.codex-reviews/cm_cycle4_response.md:7284:427:### 10.1 NotificationEventType 매트릭스 (REVIEW_WORKFLOW § 9.1.1 cascade 완료 — 5종)
.codex-reviews/cm_cycle4_response.md:7291:441:### 10.3 NotificationEvent 필드 매핑 (F-2)
.codex-reviews/cm_cycle4_response.md:7311:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
.codex-reviews/cm_cycle4_response.md:7315:738:| `eventType` | NotificationEventType | ✅ |
.codex-reviews/cm_cycle4_response.md:7323:9:> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (cascade 완료 — 4종 NotificationEventType + 9종 AuditAction)
.codex-reviews/cm_cycle4_response.md:7356:100:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 4종 NotificationEventType cascade 완료 |
.codex-reviews/cm_cycle4_response.md:7357:101:| REVIEW_WORKFLOW § 10.2.1 | 9종 AuditAction cascade 완료 |
.codex-reviews/cm_cycle4_response.md:7379:193:### 3.1.1 audit log contract (9종 AuditAction — REVIEW_WORKFLOW § 10.2.1 cascade 완료)
.codex-reviews/cm_cycle4_response.md:7380:195:| AuditAction | contentRef | metadata |
.codex-reviews/cm_cycle4_response.md:7437:363:### 4.3 pause / resume / cancel (CM1-13 state transition)
.codex-reviews/cm_cycle4_response.md:7453:392:| `notification-operational` | NotificationEvent emit·read receipt·digest 처리 | **허용** (운영 알림 흐름 유지) |
.codex-reviews/cm_cycle4_response.md:7455:410:### 4.7 NotificationEvent 매핑 (CM1-17)
.codex-reviews/cm_cycle4_response.md:7457:423:### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT — cascade 완료)
.codex-reviews/cm_cycle4_response.md:7503:567:| 2026-05-15 | **v0.2** | **codex 1차 비평 24 지적 전건 수용 + REVIEW_WORKFLOW·DATA_MODEL cascade**: (1) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 4종 NotificationEventType 매트릭스 (CM1-01·10), (2) **REVIEW_WORKFLOW § 10.2.1 cascade** — 9종 AuditAction (CM1-02·10·21), (3) **DATA_MODEL C-08 v0.21 cascade** — ContentMigrationConfig 신설·legalImpactClassifierRef (CM1-03), (4) **policy-version-reevaluate batch contract** — concurrencyLimit·rateLimit·cacheDedupe·reportingMode 분기 (CM1-04), (5) **schema-version-upgrade → application-data-version-upgrade로 좁힘** + § 1.3 DDL 책임 분리 (CM1-05), (6) **rollbackClass 3종(reversible·compensating·irreversible) 강제** + irreversible은 blastRadiusCap·backupSnapshotRequired·skipStep 필수 (CM1-06), (7) **dry-run/apply drift 6필드 CAS** — planFingerprint·targetSetDigest·sourceSnapshotWatermark·policyVersionSnapshot·stepRegistryVersion·contentHashDigest (CM1-07), (8) **legalImpactClassifier + 8 class** — PII·LegalDocument·ReviewPolicy·PricingPage·전후사진·후기·priorReviewRequired·cross-entity-copy (CM1-08), (9) **read-only window writeClass 5종 표** — content-mutating·workflow-state·feature-operational·notification-operational·audit-append (CM1-09), (10) **이벤트명 의미 분리** — plan-validated/plan-legal-approved/run-completed/run-failed/rollback-triggered (CM1-10), (11) **routing-slug-preservation plan kind 추가** (CM1-11), (12) **§ 1.3 asset-ingestion handoff boundary 표** (CM1-12), (13) **pause/resume/cancel state transition 표** — cooperative cancellation·partial commit rollback (CM1-13), (14) **retry exhausted vs autoRollbackOnFailure 우선순위 표** — partial write 감지 시 rollback 우선 (CM1-14), (15) **DB 10 tables 풀 schema 예고 — § 9 풀 전개는 v0.3** (CM1-15 부분), (16) **idempotencyKey + requestFingerprint** — crm-sync 패턴 재사용. same-request replay vs mismatched 409 (CM1-16), (17) **NotificationEvent mapping 표** — sourceEventId 결정 규칙 (CM1-17), (18) **legal 승인 = ContentMigrationLegalApproval + AuditAction** (ComplianceRecord lifecycle 아님 — CM1-18), (19) **§ 7 compliance-assistant 예외** — plan 자체는 contentType 대상 아님 (CM1-19), (20) **§ 9 migration-time validation 분리** (CM1-20), (21) **§ 3.1 skipStep command** + irreversible 한정 + remediationTicketRef 필수 (CM1-21), (22) **§ 6 dry-run 정확도 4지표 분리** — targetSetDigest match 100%·changedRowCount delta·fieldDiff delta·blockedDriftCount (CM1-22), (23) **CM-06/07/08 v1.0 resolved로 격상** (CM1-23), (24) **§ 1.1 SemVer 영향 기반 재분류** (CM1-24), (25) **read API privacy class·masking·export 정책** (CM1-25) |
.codex-reviews/cm_cycle4_response.md:7509:583:| 12.9 | `ContentMigrationPolicyReevaluateBatch` | policy-version-reevaluate cache hit·rateLimit (CM1-04) |
.codex-reviews/cm_cycle4_response.md:7521:39:   - REVIEW_WORKFLOW § 10.2.1 AuditAction cascade (6종)
.codex-reviews/cm_cycle4_response.md:7533:86:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"notify\\(|REVIEW_WORKFLOW|AuditAction|contentMigration|contentMigration|policy-version-reevaluate|migration|CM-|outbox|idempot|legal|dry-run|rollback|reverse|read-only|pause|resume|cancel\" docs/features/content-migration.md" in C:\Users\assag\solution\website-exposure
.codex-reviews/cm_cycle4_response.md:7534:90:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"notify\\(|AuditAction|contentMigration|contentMigration|migration|legal|PII|cascade|outbox|idempot|partial unique|CAS|CHECK|closed schema|contentType\" docs/features/asset-ingestion.md docs/features/crm-sync.md docs/features/compliance-assistant.md docs/features/notifications.md docs/admin/REVIEW_WORKFLOW.md docs/core/DATA_MODEL.md docs/ARCHITECTURE.md" in C:\Users\assag\solution\website-exposure
.codex-reviews/cm_cycle4_response.md:7535:93:9:> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (cascade 필요 — 이벤트·AuditAction 신규)
.codex-reviews/cm_cycle4_response.md:7549:114:88:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | NotificationEventType 신규 (cascade 필요) |
.codex-reviews/cm_cycle4_response.md:7550:115:89:| REVIEW_WORKFLOW § 10.2.1 | AuditAction 신규 (cascade 필요) |
.codex-reviews/cm_cycle4_response.md:7582:163:266:### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 cascade 필요)
.codex-reviews/cm_cycle4_response.md:7639:242:docs/features/notifications.md:22:- **idempotency 원자 선점**: 1단계 단일 트랜잭션에서 Log insert → Receipt insert(`unique(instanceId, sourceEventId)`). 트랜잭션 commit 후에야 NotificationEventReceipt 가시화. 동일 sourceEventId 동시 호출은 unique 위반으로 한 쪽만 진입, 다른 쪽은 기존 결과 재구성 반환 (§ 14.2)
.codex-reviews/cm_cycle4_response.md:7642:245:docs/features/notifications.md:39:| `NotificationEventType` enum 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9.1 cascade |
.codex-reviews/cm_cycle4_response.md:7644:247:docs/features/notifications.md:89:| `admin/REVIEW_WORKFLOW.md` § 10.2.1 | AuditAction enum (`notification-dispatched`·`notification-resend-attempted`·`notification-read`) |
.codex-reviews/cm_cycle4_response.md:7649:252:docs/features/notifications.md:218:async function notify(event: NotificationEvent): Promise<DeliveryResult>
.codex-reviews/cm_cycle4_response.md:7658:261:docs/features/notifications.md:446:**DigestConditionField 추가 cascade 정책** (N4-11): DigestConditionField에 새 metadata 필드를 추가하려면 (a) REVIEW_WORKFLOW § 9.2 NotificationEvent.metadata 타입에 해당 필드를 명시 cascade, (b) 본 enum 추가, (c) 본 Feature 패키지 새 policyVersion. metadata 필드의 enum 한정이 SoT.
.codex-reviews/cm_cycle4_response.md:7668:271:docs/features/notifications.md:733:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (7개 지적 전건 수용)**: (1) **REVIEW_WORKFLOW § 9.1.1 매트릭스 정정** — `sla-imminent`·`sla-overdue` 즉시 채널을 `email + inApp`으로 변경. fallback=inApp이 immediateChannels 집합 안에 포함되도록 cascade (N5-01), (2) **§ 4.1 1단계 abort 원인 분기 명시** — unique violation만 idempotent path, 그 외 abort는 retryable internal error 반환. § 3.3과 정합 (N5-02), (3) **DeliveryAttemptStatus 별도 정의** — 내부 attempt-level "processing"을 외부 DeliveryStatus와 분리. `DeliveryAttemptStatus = "processing" | DeliveryStatus` 합 타입 (N5-03), (4) **§ 4.1 흐름에 invalid locationRef 분기 추가** — businessHours 평가 직전 (f-pre)에 `skipped-missing-location` 명시. critical 이벤트도 본 분기는 우회하지 않음 (N5-04), (5) **MySQL generated column unique schema 정정** — `activeKey INT GENERATED AS (CASE WHEN resolvedAt IS NULL THEN 1 ELSE NULL END)` + `UNIQUE(payloadId, failingChannel, activeKey)`. resolved DLQ 이력 다수 허용 (N5-05), (6) **DATA_MODEL C-23 AdminUser.role cascade 정정** — `system` enum 값은 audit log actorRole 표기 전용. C-23 `role` 및 `instanceMemberships[].role`에는 저장 금지 명시 (N5-06), (7) **specVersion 1.0 + 세 버전 의미 차이** — specVersion(명세)·패키지 SemVer·notificationPolicyVersion 구분 한 줄 설명 (N5-07) (1) **트랜잭션 abort 원인 분기** — unique violation만 idempotent path, 그 외 retryable error (N4-01·N4-03), (2) **duplicate caller receiptState별 응답 계약** (N4-02), (3) **DeliveryAttempt advisory lock SoT** — pg_advisory_xact_lock + provider 호출은 lock 밖 (N4-04·N4-06). NT-17, (4) **UNIQUE(payloadId, channel, attemptNumber)** — dedupeMode 제외 (N4-05), (5) **§ 4.1 fallback immediateChannels 제약** 명시 (N4-07), (6) **fallback 실패 두 attempt 기록** + fallbackExhausted 메타 (N4-08), (7) **두 축 분리 정책** — 패키지 SemVer ↔ policyVersion (N4-09), (8) **policyVersion 보관 정책** — 12개월 최소 지원·deprecation·build fail 메시지 (N4-10), (9) **DigestConditionField cascade 규칙** (N4-11), (10) **exists/notExists deep path 평가 규칙** (N4-12), (11) **default policy 유일성 검증** (N4-13), (12) **broadcast PayloadRecord envelope+channel 단위 1건** + broadcast-placeholder는 DB row 아님 + broadcastAttemptId = broadcast DeliveryAttempt.id (N4-14·N4-15·N4-16), (13) **holidayCalendar 갱신·배포 정책** — 연간 minor·임시공휴일 patch·external-api override (N4-17). NT-18, (14) **businessHours 90일 탐색 한계** + failed-permanent (N4-18), (15) **invalid locationRef → `skipped-missing-location`** DeliveryStatus 신규 (N4-19), (16) **운영자 수동 unsuppress command** + REVIEW_WORKFLOW § 10.2.1 `notification-suppression-unsuppressed` cascade (N4-20·N4-21), (17) **soft → hard 전이 정책** (N4-22), (18) **큐 worker 중복 발송 방지 SoT 쿼리** + partial index (N4-23), (19) **inApp 단일 transaction 원자성** (N4-24), (20) **DeadLetterAttempt UNIQUE(attemptId)** — 1 attempt 1 DLQ (N4-25), (21) **MySQL generated column 대체 schema** 구체 명시 (N4-26), (22) **notification-read actorRole = instanceMemberships 현재 instance role** (N4-27), (23) **AdminUserRole `system` 추가** — REVIEW_WORKFLOW § 11.1 cascade (N4-28), (24) **multi-location + main 부재 fail 격상** (N4-29), (25) **NT-16 해소** (N4-30) (20 finding + 3 residual = 23 지적 전건 수용)**: (1) **Receipt-Log 트랜잭션 순서** — 단일 DB 트랜잭션에서 Log insert → Receipt insert. abort 시 양쪽 롤백 (N3-01), (2) **테이블 인벤토리 재산정 — 11 tables + Redis 1** — Receipt·Log·PayloadRecord·DeliveryAttempt·Inbox·DigestBucket·DigestBucketPayload·QuietHoursQueue·BusinessHoursQueue·DeadLetter·**DeadLetterAttempt(신설)** + DedupeCache. `NotificationDelivery` 가상 참조 제거 (N3-02·N3-19), (3) **DeliveryAttempt attemptNumber 동시성** — payloadId+channel 범위 row lock 또는 advisory lock + processing 선점 (N3-03), (4) **PayloadRecord recipient-envelope unit 명확화** — channel 필드 제거, directSentAt/digestSentAt 제거. 채널별 sentAt 추적은 DeliveryAttempt status만 사용 (N3-04), (5) **fallback 채널 매트릭스 SoT** — REVIEW_WORKFLOW § 9.1.1 컬럼 cascade. 임의 활성 채널 라우팅 금지, fallback도 막히면 외부 sink alert만 (N3-05), (6) **dedupe Redis SET NX EX 원자** — 명시 (N3-06), (7) **receipt vs dedupe TTL 관계** — `receiptRetentionDays`(기본 365일) ≫ dedupeWindowSeconds. sourceEventId 재사용 금지 (N3-07), (8) **REVIEW_WORKFLOW § 9.3 cascade** — Slack 2가지 동작 모드·DeliveryResult 소비 규칙 명시 (N3-08), (9) **broadcast envelope 단위 1건** — broadcastAttemptId·sentinel dedupeKey·perRecipient placeholder broadcastAttemptId 참조 (N3-09), (10) **DigestPolicy AST 구조화** — DigestCondition({field, op, value}) + 허용 enum (N3-10), (11) **policyVersion 병렬 보관** — 패키지에 버전별 매트릭스 보관, manifest opt-in, 롤백은 manifest 변경만 (N3-11), (12) **DigestBucketPayload FK 분리** — bucketId CASCADE, payloadId RESTRICT (N3-12), (13) **C-08 holidayCalendar cascade** — region·source. PublicHoliday SoT 정합. CT-02 dayOfWeek enum과 분리 (N3-13), (14) **LocationProfile `@id="main"` 관례 정합** — C-21 SoT 정합 (N3-14), (15) **suppression autoReleaseAt + worker** — § 7.4 1시간 주기. DATA_MODEL C-23 cascade (N3-15), (16) **suppression atomic increment** — DB atomic + compare-and-set threshold 1회 alert (N3-16), (17) **REVIEW_WORKFLOW § 10.2.1 enum cascade** — `notification-resend-attempted`·`notification-read` (N3-17), (18) **DLQ SQL syntax PostgreSQL** — partial unique index 표기 (N3-18), (19) **DATA_MODEL C-23 timezone 설명 정정** — quietHours 한정 (N3-20), (20) **inactive 사용자 historical inbox 정책** — 기본 숨김 + 인스턴스 옵션 (NT-16) (Residual), (21) **cadenceWindow 포맷 명시** — daily `YYYY-MM-DD`, weekly `YYYY-Wnn` (Residual), (22) **instanceMemberships 검증** — recipient AdminUser.instanceMemberships에 본 인스턴스 미포함 시 `skipped-missing-user` (Residual) |
.codex-reviews/cm_cycle4_response.md:7669:272:docs/features/notifications.md:745:### 14.2 `NotificationEventReceipt` (idempotency 선점)
.codex-reviews/cm_cycle4_response.md:7725:345:docs/admin/REVIEW_WORKFLOW.md:419:  transitionEventId: string;             // analytics-reporting의 결정적 sourceEventId — idempotency
.codex-reviews/cm_cycle4_response.md:7744:364:docs/admin/REVIEW_WORKFLOW.md:562:- **NotificationEvent** — 워크플로 트리거(`features/notifications.md` notify() 입력)에서 발생한 envelope. 1 event → N recipients
.codex-reviews/cm_cycle4_response.md:7746:366:docs/admin/REVIEW_WORKFLOW.md:568:  sourceEventId: string;                               // 워크플로 transition id 또는 호출자 idempotency key (필수 — § 9.2.1 idempotency 계약)
.codex-reviews/cm_cycle4_response.md:7750:370:docs/admin/REVIEW_WORKFLOW.md:635:  action: AuditAction;          // § 10.2.1 enum
.codex-reviews/cm_cycle4_response.md:7752:372:docs/admin/REVIEW_WORKFLOW.md:643:#### 10.2.1 AuditAction enum
.codex-reviews/cm_cycle4_response.md:7753:373:docs/admin/REVIEW_WORKFLOW.md:646:type AuditAction =
.codex-reviews/cm_cycle4_response.md:7780:409:docs/features/asset-ingestion.md:83:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 5종 NotificationEventType cascade 완료 |
.codex-reviews/cm_cycle4_response.md:7781:410:docs/features/asset-ingestion.md:84:| REVIEW_WORKFLOW § 10.2.1 | 5종 AuditAction cascade 완료 |
.codex-reviews/cm_cycle4_response.md:7792:438:docs/features/asset-ingestion.md:427:### 10.1 NotificationEventType 매트릭스 (REVIEW_WORKFLOW § 9.1.1 cascade 완료 — 5종)
.codex-reviews/cm_cycle4_response.md:7800:466:docs/features/asset-ingestion.md:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
.codex-reviews/cm_cycle4_response.md:7810:480:docs/features/crm-sync.md:9:> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (7종 AuditAction)
.codex-reviews/cm_cycle4_response.md:7813:494:docs/features/crm-sync.md:105:| REVIEW_WORKFLOW § 10.2.1 | 7종 AuditAction |
.codex-reviews/cm_cycle4_response.md:7817:503:docs/features/crm-sync.md:212:### 3.1.1 audit log contract (7종 AuditAction)
.codex-reviews/cm_cycle4_response.md:7853:620:docs/features/crm-sync.md:1292:| 2026-05-14 | **v1.0** | **codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정 — v1.0 안정판 도달**. 7 cycle 누계 지적 71건 (21+17+17+13+6+1+0) 전건 수용. blocking 0·major 0·minor 1(차단 외 — CS7-01 revoked_at column 의미는 CS-22 처리 시 검토). SoT cascade 동기화 완료: REVIEW_WORKFLOW (4종 NotificationEventType + 7종 AuditAction), DATA_MODEL v0.20 (genericRestApiAdapter 5필드 + versionTokenType). 의료법·개인정보보호법 운영 가능 |
.codex-reviews/cm_cycle4_response.md:7859:662:> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (cascade 필요 — 이벤트·AuditAction 신규)
.codex-reviews/cm_cycle4_response.md:7880:741:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | NotificationEventType 신규 (cascade 필요) |
.codex-reviews/cm_cycle4_response.md:7881:742:| REVIEW_WORKFLOW § 10.2.1 | AuditAction 신규 (cascade 필요) |
.codex-reviews/cm_cycle4_response.md:7909:830:신규 Feature 활성화 시 기존 row를 새 schema에 맞춰 변환 (예: notifications 활성화 시 기존 audit row에서 NotificationEvent 파생).
.codex-reviews/cm_cycle4_response.md:7926:927:### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 cascade 필요)
.codex-reviews/cm_cycle4_response.md:7980:1470:초안은 cascade “필요”라고만 적은 곳과 실제 SoT enum/매트릭스 반영이 갈라져 있습니다. 이제 REVIEW_WORKFLOW의 알림 매트릭스와 AuditAction 표, compliance-assistant check 계약을 좁혀서 확인하겠습니다.
.codex-reviews/cm_cycle4_response.md:7981:1472:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"9\\.1\\.1|NotificationEventType|eventType|content-migration|crm-sync|asset-ingestion|AuditAction|10\\.2\\.1|type AuditAction|notification\" docs\\admin\\REVIEW_WORKFLOW.md" in C:\Users\assag\solution\website-exposure
.codex-reviews/cm_cycle4_response.md:7991:1515:557:- **multi-location 인스턴스의 locationRef**: NotificationEvent에 `metadata.locationRef`(LocationProfile @id) 권장. 호출자(REVIEW_WORKFLOW transition)가 콘텐츠 소속 location을 산정·전달. 미해결 시 LocationProfile `main=true` fallback (`features/notifications.md` § 8.4 client-approver businessHours 정책 입력)
.codex-reviews/cm_cycle4_response.md:7992:1516:562:- **NotificationEvent** — 워크플로 트리거(`features/notifications.md` notify() 입력)에서 발생한 envelope. 1 event → N recipients
.codex-reviews/cm_cycle4_response.md:8016:1595:35:| 운영 모드 추가 (`auto-promote` 등) | **MAJOR** | 별개 | Feature SemVer MAJOR + § 11 build fail 룰 갱신 + REVIEW_WORKFLOW 진입 지점 정의 |
.codex-reviews/cm_cycle4_response.md:8042:1697:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
.codex-reviews/cm_cycle4_response.md:8067:1989:- **multi-location 인스턴스의 locationRef**: NotificationEvent에 `metadata.locationRef`(LocationProfile @id) 권장. 호출자(REVIEW_WORKFLOW transition)가 콘텐츠 소속 location을 산정·전달. 미해결 시 LocationProfile `main=true` fallback (`features/notifications.md` § 8.4 client-approver businessHours 정책 입력)
.codex-reviews/cm_cycle4_response.md:8068:1994:- **NotificationEvent** — 워크플로 트리거(`features/notifications.md` notify() 입력)에서 발생한 envelope. 1 event → N recipients
.codex-reviews/cm_cycle4_response.md:8087:2150:docs\features\asset-ingestion.md:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
.codex-reviews/cm_cycle4_response.md:8119:2230:docs\features\crm-sync.md:1292:| 2026-05-14 | **v1.0** | **codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정 — v1.0 안정판 도달**. 7 cycle 누계 지적 71건 (21+17+17+13+6+1+0) 전건 수용. blocking 0·major 0·minor 1(차단 외 — CS7-01 revoked_at column 의미는 CS-22 처리 시 검토). SoT cascade 동기화 완료: REVIEW_WORKFLOW (4종 NotificationEventType + 7종 AuditAction), DATA_MODEL v0.20 (genericRestApiAdapter 5필드 + versionTokenType). 의료법·개인정보보호법 운영 가능 |
.codex-reviews/cm_cycle4_response.md:8121:2242:docs\features\keyword-monitoring.md:390:> **anomalySeverity vs notificationCriticality 분리** (F-8): anomalySeverity는 AnomalyRecord 내부 severity (info·warning·critical). notificationCriticality는 NotificationEvent.criticality (normal·high·critical — notifications.md SoT). monitoring-failed는 anomaly 없음 — operationalSeverity로 분류
.codex-reviews/cm_cycle4_response.md:8123:2248:docs\features\keyword-monitoring.md:714:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4 minor 지적 전건 수용)**: (1) § 1.2 "4종" 잔재 → "5종" 정정 (KMF5-01), (2) § 3.1.1 audit log contract 표에 `keyword-tracking-target-migrated-v02-v03` 행 추가 (KMF5-02), (3) **decompositions[] 1:1 lossless 매핑** — `toTargets: Array<{targetId, searchEngine, inheritedOriginalId, activeAfter}>` 구조 변경 (KMF5-03), (4) **§ 11.3·§ 11.4 분류·용어 정정** — migration-time fail 명칭·outbox claimedAt vs retry queue lockedAt 분리 (KMF5-04): (1) **KeywordAnomalyNotificationOutbox sourceKind enum 정정** — `rank-bucket-state` → `rank-bucket-transition`. sourceId 타입 `UUID` → `string` (sourceKind별 typed) (KMF4-01), (2) **migration audit metadata decompositions[] 구조** — lossless 표현 (KMF4-02), (3) **AuditAction 4종 → 5종** 표기 정정 (KMF4-03), (4) **rank-bucket transition try advisory lock + idempotent no-op** semantics 명시 (KMF4-04), (5) **§ 11.4 runtime invariant·reconcile 분리** (§ 11.2와 별도) (KMF4-05), (6) **§ 1.1 migration-time validation·runtime invariant SemVer policy 추가** (KMF4-06): (1) **REVIEW_WORKFLOW § 10.2.1 cascade — `keyword-tracking-target-migrated-v02-v03` AuditAction 추가** + § 10.3 audit contract metadata shape 명시. KM-16 v1.0 cascade 완료 (KMF3-01), (2) **rank-bucket transition 원자성·deterministic transitionEventId** — logical transitionDate(windowEnd) 사용·advisory lock + compare-and-set + UNIQUE 3중 보호 (KMF3-02), (3) **reactivate 동시성 정책** — advisory lock + deterministic order(registeredAt DESC, id ASC). § 11.2 runtime fail 문구 정정 (KMF3-03), (4) **ctr-up read API notify=false contract** — queryKeywordSignals.anomaliesInWindow에 notify boolean·notificationSuppressionReason enum (KMF3-04), (5) **cross-Feature transaction boundary** — correlatedSearchVisibilityAnomalyId READ COMMITTED 별도 transaction (KMF3-05), (6) **canonical 검색엔진 enum SoT + cross-Feature build validation** — 3개 집합(KeywordTrackingTarget.searchEngine·SEARCH_ENGINE_TO_ANALYTICS_SOURCE·SerpCrawlerApprovedScope.searchEngines) drift 검증 (KMF3-06), (7) **§ 11 build/runtime/migration 3분리** — § 11.3 migration-time validation 신설 (KMF3-07): (1) **DATA_MODEL C-08 KeywordMonitoringConfig.serpCrawler v1.0 build fail** 정정 — enabled=true 자체로 fail (legalApproved 무관) (KM2-01), (2) **soft delete + partial unique** — `WHERE active=true` (PostgreSQL) 또는 generated column. `registerKeyword` 시 inactive 재등록은 reactivate로 처리 (KM2-02), (3) **rank-bucket outbox sourceId=transitionEventId** — 각 transition별 고유 ID로 UNIQUE 차단 회피 (KM2-03), (4) **migration v0.2→v0.3 정책 § 10.3** — targetSearchEngines 배열 분해·queryHash 재계산·FK 승계 (KM2-04), (5) **correlatedSearchVisibilityAnomalyId 매핑 정확화** — insert 직전 1회 lookup·다건 매칭 우선순위·실패 시 null·재시도 없음 (KM2-05), (6) **§ 3.1.1 audit log contract** — register/unregister/resolution-updated/retroactive 4종 contentRef·metadata shape 명시 (KM2-06), (7) **zeroBaselinePolicy enum** — first-observed·hold만 허용 (spike 제거) + build fail 추가 (KM2-07), (8) **ctr-up dashboard 표시 규칙** — queryKeywordSignals.anomaliesInWindow 포함·notify=false 시각 구분 (KM2-08), (9) **SEARCH_ENGINE_TO_ANALYTICS_SOURCE 명시 매핑 테이블** + exhaustive build validation (KM2-09): (1) NotificationEventType 8종 cascade 통일 — REVIEW_WORKFLOW § 9.1·§ 9.1.1 8행 추가 (F-1), (2) **DATA_MODEL C-08 v0.17 cascade** — keywordMonitoringConfig·keywordMonitoringPolicyVersion 신설 + SerpCrawlerApprovedScope 재사용 (F-2), (3) **locale/searchEngine dimension → country/source 매핑** — analytics-reporting QueryDimension 정합 (F-3), (4) device dimension/filter 추가 (F-4), (5) **KeywordTrackingTarget.searchEngine 단일 enum + UNIQUE 정규화** (F-5), (6) **outbox sourceKind/sourceId 일반화** — anomaly·monitoring-log·rank-bucket-state 3종 (F-6), (7) rank-bucket 이벤트 매핑 추가 (F-7), (8) **anomalySeverity vs notificationCriticality 컬럼 분리** (F-8), (9) keywordRank algorithm enum moving-average만 + EWMA는 KM-07 후속 (F-9), (10) **zero baseline·CTR direction·minBaselineDays·minVariance** 정확화 (F-10), (11) signal별 dedupe 주체 표 — ledger vs state machine (F-11), (12) **register/unregister 권한·soft delete·audit cascade** — REVIEW_WORKFLOW § 10.2.1 4종 cascade (F-12·F-15), (13) **serp-crawler v1.0 build fail** — KeywordMonitoringSerpArtifact 결정은 v1.x로 분리 (F-13), (14) **maxKeywordsPerInstance drift alert 분리** (F-14), (15) **§ 13 MonitoringSourceAttempt 중복 제거** (F-16), (16) KM-05·KM-06 재정의 (F-17), (17) **search-visibility 중복 정책 § 0.1 명시** — correlatedSearchVisibilityAnomalyId best-effort (F-18), (18) KM-08~KM-13 해소된 미결정으로 이동 |
.codex-reviews/cm_cycle4_response.md:8126:2251:docs\features\notifications.md:733:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (7개 지적 전건 수용)**: (1) **REVIEW_WORKFLOW § 9.1.1 매트릭스 정정** — `sla-imminent`·`sla-overdue` 즉시 채널을 `email + inApp`으로 변경. fallback=inApp이 immediateChannels 집합 안에 포함되도록 cascade (N5-01), (2) **§ 4.1 1단계 abort 원인 분기 명시** — unique violation만 idempotent path, 그 외 abort는 retryable internal error 반환. § 3.3과 정합 (N5-02), (3) **DeliveryAttemptStatus 별도 정의** — 내부 attempt-level "processing"을 외부 DeliveryStatus와 분리. `DeliveryAttemptStatus = "processing" | DeliveryStatus` 합 타입 (N5-03), (4) **§ 4.1 흐름에 invalid locationRef 분기 추가** — businessHours 평가 직전 (f-pre)에 `skipped-missing-location` 명시. critical 이벤트도 본 분기는 우회하지 않음 (N5-04), (5) **MySQL generated column unique schema 정정** — `activeKey INT GENERATED AS (CASE WHEN resolvedAt IS NULL THEN 1 ELSE NULL END)` + `UNIQUE(payloadId, failingChannel, activeKey)`. resolved DLQ 이력 다수 허용 (N5-05), (6) **DATA_MODEL C-23 AdminUser.role cascade 정정** — `system` enum 값은 audit log actorRole 표기 전용. C-23 `role` 및 `instanceMemberships[].role`에는 저장 금지 명시 (N5-06), (7) **specVersion 1.0 + 세 버전 의미 차이** — specVersion(명세)·패키지 SemVer·notificationPolicyVersion 구분 한 줄 설명 (N5-07) (1) **트랜잭션 abort 원인 분기** — unique violation만 idempotent path, 그 외 retryable error (N4-01·N4-03), (2) **duplicate caller receiptState별 응답 계약** (N4-02), (3) **DeliveryAttempt advisory lock SoT** — pg_advisory_xact_lock + provider 호출은 lock 밖 (N4-04·N4-06). NT-17, (4) **UNIQUE(payloadId, channel, attemptNumber)** — dedupeMode 제외 (N4-05), (5) **§ 4.1 fallback immediateChannels 제약** 명시 (N4-07), (6) **fallback 실패 두 attempt 기록** + fallbackExhausted 메타 (N4-08), (7) **두 축 분리 정책** — 패키지 SemVer ↔ policyVersion (N4-09), (8) **policyVersion 보관 정책** — 12개월 최소 지원·deprecation·build fail 메시지 (N4-10), (9) **DigestConditionField cascade 규칙** (N4-11), (10) **exists/notExists deep path 평가 규칙** (N4-12), (11) **default policy 유일성 검증** (N4-13), (12) **broadcast PayloadRecord envelope+channel 단위 1건** + broadcast-placeholder는 DB row 아님 + broadcastAttemptId = broadcast DeliveryAttempt.id (N4-14·N4-15·N4-16), (13) **holidayCalendar 갱신·배포 정책** — 연간 minor·임시공휴일 patch·external-api override (N4-17). NT-18, (14) **businessHours 90일 탐색 한계** + failed-permanent (N4-18), (15) **invalid locationRef → `skipped-missing-location`** DeliveryStatus 신규 (N4-19), (16) **운영자 수동 unsuppress command** + REVIEW_WORKFLOW § 10.2.1 `notification-suppression-unsuppressed` cascade (N4-20·N4-21), (17) **soft → hard 전이 정책** (N4-22), (18) **큐 worker 중복 발송 방지 SoT 쿼리** + partial index (N4-23), (19) **inApp 단일 transaction 원자성** (N4-24), (20) **DeadLetterAttempt UNIQUE(attemptId)** — 1 attempt 1 DLQ (N4-25), (21) **MySQL generated column 대체 schema** 구체 명시 (N4-26), (22) **notification-read actorRole = instanceMemberships 현재 instance role** (N4-27), (23) **AdminUserRole `system` 추가** — REVIEW_WORKFLOW § 11.1 cascade (N4-28), (24) **multi-location + main 부재 fail 격상** (N4-29), (25) **NT-16 해소** (N4-30) (20 finding + 3 residual = 23 지적 전건 수용)**: (1) **Receipt-Log 트랜잭션 순서** — 단일 DB 트랜잭션에서 Log insert → Receipt insert. abort 시 양쪽 롤백 (N3-01), (2) **테이블 인벤토리 재산정 — 11 tables + Redis 1** — Receipt·Log·PayloadRecord·DeliveryAttempt·Inbox·DigestBucket·DigestBucketPayload·QuietHoursQueue·BusinessHoursQueue·DeadLetter·**DeadLetterAttempt(신설)** + DedupeCache. `NotificationDelivery` 가상 참조 제거 (N3-02·N3-19), (3) **DeliveryAttempt attemptNumber 동시성** — payloadId+channel 범위 row lock 또는 advisory lock + processing 선점 (N3-03), (4) **PayloadRecord recipient-envelope unit 명확화** — channel 필드 제거, directSentAt/digestSentAt 제거. 채널별 sentAt 추적은 DeliveryAttempt status만 사용 (N3-04), (5) **fallback 채널 매트릭스 SoT** — REVIEW_WORKFLOW § 9.1.1 컬럼 cascade. 임의 활성 채널 라우팅 금지, fallback도 막히면 외부 sink alert만 (N3-05), (6) **dedupe Redis SET NX EX 원자** — 명시 (N3-06), (7) **receipt vs dedupe TTL 관계** — `receiptRetentionDays`(기본 365일) ≫ dedupeWindowSeconds. sourceEventId 재사용 금지 (N3-07), (8) **REVIEW_WORKFLOW § 9.3 cascade** — Slack 2가지 동작 모드·DeliveryResult 소비 규칙 명시 (N3-08), (9) **broadcast envelope 단위 1건** — broadcastAttemptId·sentinel dedupeKey·perRecipient placeholder broadcastAttemptId 참조 (N3-09), (10) **DigestPolicy AST 구조화** — DigestCondition({field, op, value}) + 허용 enum (N3-10), (11) **policyVersion 병렬 보관** — 패키지에 버전별 매트릭스 보관, manifest opt-in, 롤백은 manifest 변경만 (N3-11), (12) **DigestBucketPayload FK 분리** — bucketId CASCADE, payloadId RESTRICT (N3-12), (13) **C-08 holidayCalendar cascade** — region·source. PublicHoliday SoT 정합. CT-02 dayOfWeek enum과 분리 (N3-13), (14) **LocationProfile `@id="main"` 관례 정합** — C-21 SoT 정합 (N3-14), (15) **suppression autoReleaseAt + worker** — § 7.4 1시간 주기. DATA_MODEL C-23 cascade (N3-15), (16) **suppression atomic increment** — DB atomic + compare-and-set threshold 1회 alert (N3-16), (17) **REVIEW_WORKFLOW § 10.2.1 enum cascade** — `notification-resend-attempted`·`notification-read` (N3-17), (18) **DLQ SQL syntax PostgreSQL** — partial unique index 표기 (N3-18), (19) **DATA_MODEL C-23 timezone 설명 정정** — quietHours 한정 (N3-20), (20) **inactive 사용자 historical inbox 정책** — 기본 숨김 + 인스턴스 옵션 (NT-16) (Residual), (21) **cadenceWindow 포맷 명시** — daily `YYYY-MM-DD`, weekly `YYYY-Wnn` (Residual), (22) **instanceMemberships 검증** — recipient AdminUser.instanceMemberships에 본 인스턴스 미포함 시 `skipped-missing-user` (Residual) |
.codex-reviews/cm_cycle4_response.md:8127:2275:docs\features\search-visibility.md:587:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) SV-13 해소된 미결정으로 이동 (SV5-01), (2) **retroactive audit metadata shape 명시** — contentRef="instance:{instanceId}" synthetic·metadata 필수 필드(windowStart·End·severity·dryRun·matchedCount·enqueuedCount·retroactiveBatchId)·actorRole="super-admin" (SV5-02), (3) **unifiedRankingPresence rank nullability** — previousRank/currentRank를 `number | null`로 변경. absent/restored 전이 시 null 규칙 (SV5-03), (4) **NotificationEvent 필드 매핑 표 복원** — eventType별 contentRef/contentTitle/metadata 명시. monitoring-failed는 synthetic contentRef + sourceEventId fallback (SV5-04), (5) 변경 이력 operations 잔재 → super-admin 전용으로 정정 (SV5-05): (1) **retroactive command 권한 super-admin 전용** — operations role 미존재 정정 (SV4-01), (2) **REVIEW_WORKFLOW § 10.2.1 cascade** — `search-visibility-retroactive-enqueue-requested` AuditAction 추가. SV-13 해소 (SV4-02), (3) **§ 3.3 exposureTrend detectorOutput shape § 4.1과 통일** — score·actualPercentile·thresholdPercentile (SV4-03), (4) **first-detected 정책 rationale** — unifiedRankingPresence는 query baseline initialization, AI briefing은 site-level business event (SV4-04), (5) **sourceEventId hash에서 policyVersion 제거** — 정책 변경 시 재발송 금지 의도. § 13.10 정합 (SV4-05), (6) **severity escalation 의도 명시** — warning → critical 상승은 별도 anomaly (SV4-06), (7) **v1.0 blobStorage.provider="s3"만 build-pass** — GCS/Azure는 SV-06b 후속 (SV4-07): (1) **exposureTrend percentile config 반영 + target aggregation SoT** — score 산식·detectorOutput에 actualPercentile/thresholdPercentile (SV3-01·02), (2) **SerpCrawlerApprovedScope boolean 정정** — allowLoginState/allowCaptchaBypass required=false + default=false (DATA_MODEL cascade·SV3-03), (3) **crawlerArtifact retention 평가 순서** — serpCrawler.enabled=false 시 skip (SV3-04), (4) **SearchVisibilityCollectionRetryQueue worker SoT 쿼리 복제** — analytics-reporting § 4.3 패턴(SKIP LOCKED·advisory lock·envelope 재계산·lock ordering invariant) (SV3-05), (5) **retroactive outbox command contract closure** — super-admin 전용 권한(v0.5에서 좁힘)·dryRun·sourceEventId hash·audit cascade SV-13 (SV3-06), (6) **unifiedRankingPresence state transition table** — 6종 전이별 AnomalyRecord·eventType·notify 매핑 (SV3-07), (7) **anomaly suppression ledger** — exposureTrend·backlinkChange state machine 없는 signal용 (SV3-08), (8) **blob isolation IAM 구체화** — canonical object key format·S3 IAM condition 예시·signed URL refresh SV-14 (SV3-09), (9) **SV-10 해소** + SV-06b 부분 분리 (SV3-10), (10) **SV-13·SV-14 신규** |
.codex-reviews/cm_cycle4_response.md:8134:2300:      "title": "NotificationEventType 4종이 REVIEW_WORKFLOW canonical enum/매트릭스에 실제 반영되지 않았다",
.codex-reviews/cm_cycle4_response.md:8141:2312:      "title": "AuditAction 6종이 REVIEW_WORKFLOW §10.2.1 canonical enum에 없다",
.codex-reviews/cm_cycle4_response.md:8142:2315:        "REVIEW_WORKFLOW.md §10.2.1 canonical AuditAction enum은 content-migration 관련 값을 포함하지 않는다."
.codex-reviews/cm_cycle4_response.md:8218:2510:      "recommendation": "plan legal approval은 `ContentMigrationLegalApproval` + AuditAction으로 처리하라. ComplianceRecord lifecycle은 `policy-version-reevaluate`가 개별 콘텐츠 재검수에 진입할 때만 사용하라."
.codex-reviews/cm_cycle4_response.md:8264:2641:      "title": "NotificationEventType 4종이 REVIEW_WORKFLOW canonical enum/매트릭스에 실제 반영되지 않았다",
.codex-reviews/cm_cycle4_response.md:8271:2653:      "title": "AuditAction 6종이 REVIEW_WORKFLOW §10.2.1 canonical enum에 없다",
.codex-reviews/cm_cycle4_response.md:8272:2656:        "REVIEW_WORKFLOW.md §10.2.1 canonical AuditAction enum은 content-migration 관련 값을 포함하지 않는다."
.codex-reviews/cm_cycle4_response.md:8348:2851:      "recommendation": "plan legal approval은 `ContentMigrationLegalApproval` + AuditAction으로 처리하라. ComplianceRecord lifecycle은 `policy-version-reevaluate`가 개별 콘텐츠 재검수에 진입할 때만 사용하라."
.codex-reviews/cm_cycle4_response.md:8390:9:> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (7종 AuditAction)
.codex-reviews/cm_cycle4_response.md:8397:104:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 4종 NotificationEventType |
.codex-reviews/cm_cycle4_response.md:8398:105:| REVIEW_WORKFLOW § 10.2.1 | 7종 AuditAction |
.codex-reviews/cm_cycle4_response.md:8403:212:### 3.1.1 audit log contract (7종 AuditAction)
.codex-reviews/cm_cycle4_response.md:8404:214:| AuditAction | contentRef | metadata | 권한 |
.codex-reviews/cm_cycle4_response.md:8449:768:§ 3.3.6 입력. CAS expectedIntegrationState="reverted". transition:
.codex-reviews/cm_cycle4_response.md:8457:807:**enum 사용 명시 (CS5-03)**: CrmCredentialVersion.state="grace-expired"는 위 transition에서 사용. v1.0에서는 grace-expired row를 별도로 보관 (audit·운영자 review). 운영 정책상 revoked로 즉시 통합할지는 CS-22로 deferred.
.codex-reviews/cm_cycle4_response.md:8474:895:### 6.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT)
.codex-reviews/cm_cycle4_response.md:8491:1080:- 7종 AuditAction insert 성공
.codex-reviews/cm_cycle4_response.md:8492:1081:- 4종 NotificationEventType emit 성공
.codex-reviews/cm_cycle4_response.md:8513:1277:- ContactDisplayHints는 6 column closed schema — 향후 column 추가는 § 1.1 SemVer 표 룰
.codex-reviews/cm_cycle4_response.md:8514:1292:| 2026-05-14 | **v1.0** | **codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정 — v1.0 안정판 도달**. 7 cycle 누계 지적 71건 (21+17+17+13+6+1+0) 전건 수용. blocking 0·major 0·minor 1(차단 외 — CS7-01 revoked_at column 의미는 CS-22 처리 시 검토). SoT cascade 동기화 완료: REVIEW_WORKFLOW (4종 NotificationEventType + 7종 AuditAction), DATA_MODEL v0.20 (genericRestApiAdapter 5필드 + versionTokenType). 의료법·개인정보보호법 운영 가능 |
.codex-reviews/cm_cycle4_response.md:8560:1662:| `eventType` | enum (NotificationEventType 4종) | ✅ |
.codex-reviews/cm_cycle4_response.md:8572:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "content-migration|ContentMigration|NotificationEventType|AuditAction|contentMigrationConfig|contentMigrationPolicyVersion|legalImpactClassifierRef|ContentMigrationConfig|stale-flags-only|new-record-version|cacheKey|durable cache|batch contract|closed schema" docs/admin/REVIEW_WORKFLOW.md docs/core/DATA_MODEL.md docs/features/compliance-assistant.md docs/features/search-visibility.md' in C:\Users\assag\solution\website-exposure
.codex-reviews/cm_cycle4_response.md:8580:docs/features/search-visibility.md:107:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 5종 NotificationEventType cascade 완료 |
.codex-reviews/cm_cycle4_response.md:8581:docs/features/search-visibility.md:428:### 7.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 — cascade 완료)
.codex-reviews/cm_cycle4_response.md:8582:docs/features/search-visibility.md:574:| ~~SV-13~~ | `search-visibility-retroactive-enqueue-requested` audit cascade | v0.5 — REVIEW_WORKFLOW § 10.2.1 AuditAction enum 정식 cascade 완료 (SV4-02) |
.codex-reviews/cm_cycle4_response.md:8583:docs/features/search-visibility.md:587:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) SV-13 해소된 미결정으로 이동 (SV5-01), (2) **retroactive audit metadata shape 명시** — contentRef="instance:{instanceId}" synthetic·metadata 필수 필드(windowStart·End·severity·dryRun·matchedCount·enqueuedCount·retroactiveBatchId)·actorRole="super-admin" (SV5-02), (3) **unifiedRankingPresence rank nullability** — previousRank/currentRank를 `number | null`로 변경. absent/restored 전이 시 null 규칙 (SV5-03), (4) **NotificationEvent 필드 매핑 표 복원** — eventType별 contentRef/contentTitle/metadata 명시. monitoring-failed는 synthetic contentRef + sourceEventId fallback (SV5-04), (5) 변경 이력 operations 잔재 → super-admin 전용으로 정정 (SV5-05): (1) **retroactive command 권한 super-admin 전용** — operations role 미존재 정정 (SV4-01), (2) **REVIEW_WORKFLOW § 10.2.1 cascade** — `search-visibility-retroactive-enqueue-requested` AuditAction 추가. SV-13 해소 (SV4-02), (3) **§ 3.3 exposureTrend detectorOutput shape § 4.1과 통일** — score·actualPercentile·thresholdPercentile (SV4-03), (4) **first-detected 정책 rationale** — unifiedRankingPresence는 query baseline initialization, AI briefing은 site-level business event (SV4-04), (5) **sourceEventId hash에서 policyVersion 제거** — 정책 변경 시 재발송 금지 의도. § 13.10 정합 (SV4-05), (6) **severity escalation 의도 명시** — warning → critical 상승은 별도 anomaly (SV4-06), (7) **v1.0 blobStorage.provider="s3"만 build-pass** — GCS/Azure는 SV-06b 후속 (SV4-07): (1) **exposureTrend percentile config 반영 + target aggregation SoT** — score 산식·detectorOutput에 actualPercentile/thresholdPercentile (SV3-01·02), (2) **SerpCrawlerApprovedScope boolean 정정** — allowLoginState/allowCaptchaBypass required=false + default=false (DATA_MODEL cascade·SV3-03), (3) **crawlerArtifact retention 평가 순서** — serpCrawler.enabled=false 시 skip (SV3-04), (4) **SearchVisibilityCollectionRetryQueue worker SoT 쿼리 복제** — analytics-reporting § 4.3 패턴(SKIP LOCKED·advisory lock·envelope 재계산·lock ordering invariant) (SV3-05), (5) **retroactive outbox command contract closure** — super-admin 전용 권한(v0.5에서 좁힘)·dryRun·sourceEventId hash·audit cascade SV-13 (SV3-06), (6) **unifiedRankingPresence state transition table** — 6종 전이별 AnomalyRecord·eventType·notify 매핑 (SV3-07), (7) **anomaly suppression ledger** — exposureTrend·backlinkChange state machine 없는 signal용 (SV3-08), (8) **blob isolation IAM 구체화** — canonical object key format·S3 IAM condition 예시·signed URL refresh SV-14 (SV3-09), (9) **SV-10 해소** + SV-06b 부분 분리 (SV3-10), (10) **SV-13·SV-14 신규** |
.codex-reviews/cm_cycle4_response.md:8605:docs/admin/REVIEW_WORKFLOW.md:464:### 9.1 NotificationEventType enum (canonical SoT)
.codex-reviews/cm_cycle4_response.md:8606:docs/admin/REVIEW_WORKFLOW.md:467:type NotificationEventType =
.codex-reviews/cm_cycle4_response.md:8616:docs/admin/REVIEW_WORKFLOW.md:578:  eventType: NotificationEventType;                    // § 9.1 enum
.codex-reviews/cm_cycle4_response.md:8617:docs/admin/REVIEW_WORKFLOW.md:595:  eventType: NotificationEventType;
.codex-reviews/cm_cycle4_response.md:8618:docs/admin/REVIEW_WORKFLOW.md:644:  action: AuditAction;          // § 10.2.1 enum
.codex-reviews/cm_cycle4_response.md:8619:docs/admin/REVIEW_WORKFLOW.md:652:#### 10.2.1 AuditAction enum
.codex-reviews/cm_cycle4_response.md:8620:docs/admin/REVIEW_WORKFLOW.md:655:type AuditAction =
.codex-reviews/cm_cycle4_response.md:8634:| REVIEW_WORKFLOW § 10.2.1 | 9종 AuditAction cascade 완료 |
.codex-reviews/cm_cycle4_response.md:8726:### 3.1.1 audit log contract (9종 AuditAction — REVIEW_WORKFLOW § 10.2.1 cascade 완료)
.codex-reviews/cm_cycle4_response.md:8728:| AuditAction | contentRef | metadata |
.codex-reviews/cm_cycle4_response.md:8898:### 4.3 pause / resume / cancel (CM1-13 state transition)
.codex-reviews/cm_cycle4_response.md:8927:| `notification-operational` | NotificationEvent emit·read receipt·digest 처리 | **허용** (운영 알림 흐름 유지) |
.codex-reviews/cm_cycle4_response.md:8945:### 4.7 NotificationEvent 매핑 (CM1-17)
.codex-reviews/cm_cycle4_response.md:8958:### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT — cascade 완료)
.codex-reviews/cm_cycle4_response.md:9102:| 2026-05-15 | **v0.2** | **codex 1차 비평 24 지적 전건 수용 + REVIEW_WORKFLOW·DATA_MODEL cascade**: (1) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 4종 NotificationEventType 매트릭스 (CM1-01·10), (2) **REVIEW_WORKFLOW § 10.2.1 cascade** — 9종 AuditAction (CM1-02·10·21), (3) **DATA_MODEL C-08 v0.21 cascade** — ContentMigrationConfig 신설·legalImpactClassifierRef (CM1-03), (4) **policy-version-reevaluate batch contract** — concurrencyLimit·rateLimit·cacheDedupe·reportingMode 분기 (CM1-04), (5) **schema-version-upgrade → application-data-version-upgrade로 좁힘** + § 1.3 DDL 책임 분리 (CM1-05), (6) **rollbackClass 3종(reversible·compensating·irreversible) 강제** + irreversible은 blastRadiusCap·backupSnapshotRequired·skipStep 필수 (CM1-06), (7) **dry-run/apply drift 6필드 CAS** — planFingerprint·targetSetDigest·sourceSnapshotWatermark·policyVersionSnapshot·stepRegistryVersion·contentHashDigest (CM1-07), (8) **legalImpactClassifier + 8 class** — PII·LegalDocument·ReviewPolicy·PricingPage·전후사진·후기·priorReviewRequired·cross-entity-copy (CM1-08), (9) **read-only window writeClass 5종 표** — content-mutating·workflow-state·feature-operational·notification-operational·audit-append (CM1-09), (10) **이벤트명 의미 분리** — plan-validated/plan-legal-approved/run-completed/run-failed/rollback-triggered (CM1-10), (11) **routing-slug-preservation plan kind 추가** (CM1-11), (12) **§ 1.3 asset-ingestion handoff boundary 표** (CM1-12), (13) **pause/resume/cancel state transition 표** — cooperative cancellation·partial commit rollback (CM1-13), (14) **retry exhausted vs autoRollbackOnFailure 우선순위 표** — partial write 감지 시 rollback 우선 (CM1-14), (15) **DB 10 tables 풀 schema 예고 — § 9 풀 전개는 v0.3** (CM1-15 부분), (16) **idempotencyKey + requestFingerprint** — crm-sync 패턴 재사용. same-request replay vs mismatched 409 (CM1-16), (17) **NotificationEvent mapping 표** — sourceEventId 결정 규칙 (CM1-17), (18) **legal 승인 = ContentMigrationLegalApproval + AuditAction** (ComplianceRecord lifecycle 아님 — CM1-18), (19) **§ 7 compliance-assistant 예외** — plan 자체는 contentType 대상 아님 (CM1-19), (20) **§ 9 migration-time validation 분리** (CM1-20), (21) **§ 3.1 skipStep command** + irreversible 한정 + remediationTicketRef 필수 (CM1-21), (22) **§ 6 dry-run 정확도 4지표 분리** — targetSetDigest match 100%·changedRowCount delta·fieldDiff delta·blockedDriftCount (CM1-22), (23) **CM-06/07/08 v1.0 resolved로 격상** (CM1-23), (24) **§ 1.1 SemVer 영향 기반 재분류** (CM1-24), (25) **read API privacy class·masking·export 정책** (CM1-25) |
.codex-reviews/cm_cycle4_response.md:9118:| 12.9 | `ContentMigrationPolicyReevaluateBatch` | policy-version-reevaluate cache hit·rateLimit (CM1-04) |
.codex-reviews/cm_cycle4_response.md:9208:      "recommendation": "v1.0은 LLM 분류 금지 또는 보조 전용으로 제한하고, deterministic rule 기반 class 산출을 SoT로 둬라. 각 class별 rule input, confidence 미사용 원칙, unknown → legalGateRequired=true fail-closed, classifier class 추가/삭제 SemVer, false-negative 발견 시 retroactive audit/re-evaluate 절차를 명시하라."
.codex-reviews/cm_cycle4_response.md:9285:      "recommendation": "cacheDedupe는 `check() 호출 생략 + cachedResultRef 기록`으로 정의하라. ContentMigrationPolicyReevaluateBatch에 checked/cacheHit/skippedNoChange/changed/error 카운트와 per-record resultRef를 저장하라."
.codex-reviews/cm_cycle4_response.md:9293:        "§4.5는 NotificationEvent emit·read receipt·digest 처리를 모두 notification-operational로 허용한다.",
.codex-reviews/cm_cycle4_response.md:9315:      "title": "command 11종, audit 9종, NotificationEvent 4종의 상호 추적성이 닫히지 않았다",
.codex-reviews/cm_cycle4_response.md:9319:        "§4.1은 run-started/completed emit이라고 하지만 §4.7과 §5.1에는 run-started NotificationEvent가 없다."
.codex-reviews/cm_cycle4_response.md:9321:      "impact": "운영자가 어떤 command가 어떤 audit과 알림을 남기는지 추적할 수 없다. rollback은 high-risk인데 rollback-triggered는 NotificationEvent만 있고 AuditAction은 rollback-applied뿐이라 시작과 결과가 분리된다.",
.codex-reviews/cm_cycle4_response.md:9322:      "recommendation": "command → AuditAction → NotificationEvent → acceptance invariant 매핑 표를 추가하라. 최소 runDryRunCompleted, pauseRequested, resumeRequested, rollbackTriggered audit를 추가하거나 audit 미생성 사유를 명시하라."
.codex-reviews/cm_cycle4_response.md:9455:      "title": "AuditAction metadata에 actorRole·reason·policy snapshot 필드가 부족하다",
.codex-reviews/cm_cycle4_response.md:9461:      "recommendation": "각 AuditAction metadata에 actorRole, actorId, reason, policyVersionSnapshot, classifierVersion, requestFingerprint를 required/optional로 분리해라."
.codex-reviews/cm_cycle4_response.md:9487:      "change": "필요 시 dry-run completed, pause/resume, rollback-triggered AuditAction 추가 또는 content-migration 문서에서 audit 미생성 사유 명시"
.codex-reviews/cm_cycle4_response.md:9590:      "recommendation": "v1.0은 LLM 분류 금지 또는 보조 전용으로 제한하고, deterministic rule 기반 class 산출을 SoT로 둬라. 각 class별 rule input, confidence 미사용 원칙, unknown → legalGateRequired=true fail-closed, classifier class 추가/삭제 SemVer, false-negative 발견 시 retroactive audit/re-evaluate 절차를 명시하라."
.codex-reviews/cm_cycle4_response.md:9667:      "recommendation": "cacheDedupe는 `check() 호출 생략 + cachedResultRef 기록`으로 정의하라. ContentMigrationPolicyReevaluateBatch에 checked/cacheHit/skippedNoChange/changed/error 카운트와 per-record resultRef를 저장하라."
.codex-reviews/cm_cycle4_response.md:9675:        "§4.5는 NotificationEvent emit·read receipt·digest 처리를 모두 notification-operational로 허용한다.",
.codex-reviews/cm_cycle4_response.md:9697:      "title": "command 11종, audit 9종, NotificationEvent 4종의 상호 추적성이 닫히지 않았다",
.codex-reviews/cm_cycle4_response.md:9701:        "§4.1은 run-started/completed emit이라고 하지만 §4.7과 §5.1에는 run-started NotificationEvent가 없다."
.codex-reviews/cm_cycle4_response.md:9703:      "impact": "운영자가 어떤 command가 어떤 audit과 알림을 남기는지 추적할 수 없다. rollback은 high-risk인데 rollback-triggered는 NotificationEvent만 있고 AuditAction은 rollback-applied뿐이라 시작과 결과가 분리된다.",
.codex-reviews/cm_cycle4_response.md:9704:      "recommendation": "command → AuditAction → NotificationEvent → acceptance invariant 매핑 표를 추가하라. 최소 runDryRunCompleted, pauseRequested, resumeRequested, rollbackTriggered audit를 추가하거나 audit 미생성 사유를 명시하라."
.codex-reviews/cm_cycle4_response.md:9837:      "title": "AuditAction metadata에 actorRole·reason·policy snapshot 필드가 부족하다",
.codex-reviews/cm_cycle4_response.md:9843:      "recommendation": "각 AuditAction metadata에 actorRole, actorId, reason, policyVersionSnapshot, classifierVersion, requestFingerprint를 required/optional로 분리해라."
.codex-reviews/cm_cycle4_response.md:9869:      "change": "필요 시 dry-run completed, pause/resume, rollback-triggered AuditAction 추가 또는 content-migration 문서에서 audit 미생성 사유 명시"
.codex-reviews/cm_cycle4_response.md:10007:773:#### 4.5.6 graceExpiry worker — committed → grace-expired transition (CS5-03)
.codex-reviews/cm_cycle4_response.md:10015:807:**enum 사용 명시 (CS5-03)**: CrmCredentialVersion.state="grace-expired"는 위 transition에서 사용. v1.0에서는 grace-expired row를 별도로 보관 (audit·운영자 review). 운영 정책상 revoked로 즉시 통합할지는 CS-22로 deferred.
.codex-reviews/cm_cycle4_response.md:10054:1277:- ContactDisplayHints는 6 column closed schema — 향후 column 추가는 § 1.1 SemVer 표 룰
.codex-reviews/cm_cycle4_response.md:10174:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
.codex-reviews/cm_cycle4_response.md:10207:215:**Note**: REVIEW_WORKFLOW § 10.2.1 cascade는 v0.3에서 추가 AuditAction 3종(`dry-run-completed`·`run-paused`·`run-resumed`·`rollback-triggered`) 보완 필요 — 본 v0.3는 본문에 명시 + 다음 cycle cascade 진행 (CM2-12 부분).
.codex-reviews/cm_cycle4_response.md:10217:501:class 추가/삭제 SemVer: § 1.1. retroactive audit — false-negative 발견 시 영향 plan 재평가 필요 → 별도 운영 절차 (CM-09 신규 open).
.codex-reviews/cm_cycle4_response.md:10222:523:### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT) — v0.2 동일
.codex-reviews/cm_cycle4_response.md:10232:684:| AuditAction 3종(dry-run-completed·run-paused·run-resumed·rollback-triggered) REVIEW_WORKFLOW cascade | open — v0.4 cycle에서 cascade |
.codex-reviews/cm_cycle4_response.md:10234:695:| 2026-05-15 | **v0.3** | **codex 2차 비평 23 지적 전건 수용**: (1) **CAS digest 알고리즘 SoT § 2.4** — Merkle/chunked·snapshot fallback (CM2-01), (2) **irreversible 자동 skip 금지** — blocked-manual-remediation-required 상태 + 운영자 수동 skipStep (CM2-02), (3) **legalImpactClassifier deterministic rule SoT § 4.7** + LLM v1.0 금지 + fail-closed (CM2-03), (4) **forceProceedDespiteWarnings legal/critical 우회 금지** + expectedLegalImpactClassificationDigest·expectedClassifierVersion CAS 추가 (8필드 — CM2-04), (5) **§ 12 최소 constraints 명시** (풀 SQL은 v0.4 — CM2-05), (6) **writeSetManifest § 3.6** — partial write 감지 alg (CM2-06), (7) **step registry cooperativeCancellation 강제 § 3.5** — 미지원은 isolated chunk만 (CM2-07), (8) **policyReevaluate defaultReportingMode=risk-based** — legal/priorReview/Critical은 new-record-version 강제 (CM2-08), (9) **cacheDedupe = check() skip + cachedResultRef 기록** + batch count column (CM2-09), (10) **§ 4.5 writeClass 세분화** — notification-emit-outbox·dispatch·read-receipt·digest-state (CM2-10), (11) **§ 2.4 sourceSnapshotWatermark·policyVersionSnapshot 정의** (CM2-11), (12) **§ 3.1 command-audit-event 매핑 표** + dry-run-completed·run-paused·run-resumed·rollback-triggered audit 추가 (CM2-12), (13) **crm-sync 잔재 제거 + idempotency unique scope DB constraints** § 3.4 (CM2-13), (14) **step registry mutableFieldDenylist** + asset-ingestion body MV 보호 (CM2-14), (15) **§ 1.1 SemVer 보강** — CAS digest·class enum·reportingMode default·writeClass·skip policy·writeSetManifest schema (CM2-15), (16) **§ 3.7 read API privacy class 표** — closed schema masking (CM2-16), (17) **§ 3.5 step registry 최소 계약 본문** (CM2-17), (18) **§ 6.2 INV-* invariant 매핑 표** (CM2-18), (19) **§0/§8/§12 참조 §12로 통일** (CM2-19), (20) **§ 4.6 outbox SQL 자체 전개** (CM2-20), (21) **featureLegalApproved vs plan-level ContentMigrationLegalApproval 분리** + § 9.1 build fail 정정 (CM2-21), (22) **§ 2.3 impactSamplingMode=deterministic-stratified default + criticalClassFullDiff=true** (CM2-22), (23) **§ 3.1.1 AuditAction metadata 표** + actorRole·policy snapshot (CM2-23) |
.codex-reviews/cm_cycle4_response.md:10337:      "title": "REVIEW_WORKFLOW AuditAction cascade가 완료되지 않았는데 v0.3은 CM2-12 전건 수용으로 표시한다",
.codex-reviews/cm_cycle4_response.md:10340:        "content-migration §10.3도 AuditAction cascade를 open으로 둔다.",
.codex-reviews/cm_cycle4_response.md:10425:      "recommendation": "StepRetryQueue에 claim, success, transient fail backoff, exhausted transition, stale processing reclaim SQL을 §12.6에 포함하라. attempts, nextAttemptAt, lockedAt, lockedBy, lastError, exhaustedAt column과 partial unique를 함께 명시하라."
.codex-reviews/cm_cycle4_response.md:10472:      "CM3-01/21 REVIEW_WORKFLOW AuditAction 4종 cascade",
.codex-reviews/cm_cycle4_response.md:10477:      "CM3-19 AuditAction 공통 metadata required 추가"
.codex-reviews/cm_cycle4_response.md:10482:      "CM3-09 ApplyPreflightToken: client 부담은 줄였으나 HMAC decode 및 재계산 비용 문제가 남음",
.codex-reviews/cm_cycle4_response.md:10484:      "CM3-11 Run status: 3축 분해는 했지만 transition matrix/CHECK가 불완전",
.codex-reviews/cm_cycle4_response.md:10493:      "id": "CM4-01",
.codex-reviews/cm_cycle4_response.md:10496:      "title": "ApplyPreflightToken이 opaque HMAC인데 runApply에서 디코딩한다고 되어 있다",
.codex-reviews/cm_cycle4_response.md:10506:      "id": "CM4-02",
.codex-reviews/cm_cycle4_response.md:10519:      "id": "CM4-03",
.codex-reviews/cm_cycle4_response.md:10522:      "title": "append-only-watermark strategy가 동시 삽입과 외부 writer를 구분하지 못한다",
.codex-reviews/cm_cycle4_response.md:10524:        "§3.7 append-only-watermark 감지는 actualAfterProjectionHash 불일치 또는 watermark 역행만 본다.",
.codex-reviews/cm_cycle4_response.md:10531:      "id": "CM4-04",
.codex-reviews/cm_cycle4_response.md:10534:      "title": "Run primaryStatus·remediationStatus·rollbackOutcome 3축 조합이 CHECK와 transition matrix로 닫혀 있지 않다",
.codex-reviews/cm_cycle4_response.md:10537:        "§4.3은 일부 command만 표기하고 completed+blocked-manual-remediation-required, running+rollbackOutcome=full 같은 불가능 조합을 금지하지 않는다.",
.codex-reviews/cm_cycle4_response.md:10541:      "recommendation": "§4.3에 primaryStatus × remediationStatus × rollbackOutcome 유효 조합 표를 추가하고 §12.4 CHECK로 강제하라. 예: rollbackOutcome != none이면 primaryStatus IN ('rolled-back','failed','cancelled'), remediationStatus != none이면 primaryStatus IN ('paused','rolling-back','failed','cancelled') 같은 규칙을 명시하라."
.codex-reviews/cm_cycle4_response.md:10544:      "id": "CM4-05",
.codex-reviews/cm_cycle4_response.md:10551:        "§3.4 requestFingerprint 표와 §3.1.1 AuditAction metadata에도 두 command가 없다.",
.codex-reviews/cm_cycle4_response.md:10558:      "id": "CM4-06",
.codex-reviews/cm_cycle4_response.md:10571:      "id": "CM4-07",
.codex-reviews/cm_cycle4_response.md:10584:      "id": "CM4-08",
.codex-reviews/cm_cycle4_response.md:10598:      "id": "CM4-09",
.codex-reviews/cm_cycle4_response.md:10611:      "id": "CM4-10",
.codex-reviews/cm_cycle4_response.md:10618:        "§9 invariant는 skipped step이 retry queue, rollbackOutcome partial, run completion 조건에 어떻게 반영되는지 설명하지 않는다."
.codex-reviews/cm_cycle4_response.md:10621:      "recommendation": "skipped를 rollbackSkipped/manualSkipped 등으로 의미 분리하거나 statusReason을 required로 둬라. skipStep 후 StepRetryQueue 처리, RollbackLog.skippedIrreversibleSteps, Run.rollbackOutcome=partial 전이를 §4.3과 §9에 연결하라."
.codex-reviews/cm_cycle4_response.md:10624:      "id": "CM4-11",
.codex-reviews/cm_cycle4_response.md:10637:      "id": "CM4-12",
.codex-reviews/cm_cycle4_response.md:10651:      "id": "CM4-13",
.codex-reviews/cm_cycle4_response.md:10671:    "semver": "Run status substate, ApplyPreflightToken, writeSetManifest strategy 행은 추가됐다. 다만 cancellation recovery command 추가/제거와 stale-flags override predicate catalog 변경의 SemVer 영향은 빠져 있다.",
.codex-reviews/cm_cycle4_response.md:10672:    "state_enum_vs_transition": "불일치. §12.4 enum에는 partial-rollback이 없는데 §4.3 결과 status에 partial-rollback 표현이 남아 있다.",
.codex-reviews/cm_cycle4_response.md:10678:      "change": "ApplyPreflightToken을 opaque DB lookup 또는 signed envelope 중 하나로 확정하고 recompute/cache invalidation 계약 추가"
.codex-reviews/cm_cycle4_response.md:10682:      "change": "append-only-watermark 동시 삽입 검출을 run marker/range ledger/lock 정책으로 보강"
.codex-reviews/cm_cycle4_response.md:10708:      "ApplyPreflightToken HMAC decode 모순",
.codex-reviews/cm_cycle4_response.md:10726:      "CM3-01/21 REVIEW_WORKFLOW AuditAction 4종 cascade",
.codex-reviews/cm_cycle4_response.md:10731:      "CM3-19 AuditAction 공통 metadata required 추가"
.codex-reviews/cm_cycle4_response.md:10736:      "CM3-09 ApplyPreflightToken: client 부담은 줄였으나 HMAC decode 및 재계산 비용 문제가 남음",
.codex-reviews/cm_cycle4_response.md:10738:      "CM3-11 Run status: 3축 분해는 했지만 transition matrix/CHECK가 불완전",
.codex-reviews/cm_cycle4_response.md:10747:      "id": "CM4-01",
.codex-reviews/cm_cycle4_response.md:10750:      "title": "ApplyPreflightToken이 opaque HMAC인데 runApply에서 디코딩한다고 되어 있다",
.codex-reviews/cm_cycle4_response.md:10760:      "id": "CM4-02",
.codex-reviews/cm_cycle4_response.md:10773:      "id": "CM4-03",
.codex-reviews/cm_cycle4_response.md:10776:      "title": "append-only-watermark strategy가 동시 삽입과 외부 writer를 구분하지 못한다",
.codex-reviews/cm_cycle4_response.md:10778:        "§3.7 append-only-watermark 감지는 actualAfterProjectionHash 불일치 또는 watermark 역행만 본다.",
.codex-reviews/cm_cycle4_response.md:10785:      "id": "CM4-04",
.codex-reviews/cm_cycle4_response.md:10788:      "title": "Run primaryStatus·remediationStatus·rollbackOutcome 3축 조합이 CHECK와 transition matrix로 닫혀 있지 않다",
.codex-reviews/cm_cycle4_response.md:10791:        "§4.3은 일부 command만 표기하고 completed+blocked-manual-remediation-required, running+rollbackOutcome=full 같은 불가능 조합을 금지하지 않는다.",
.codex-reviews/cm_cycle4_response.md:10795:      "recommendation": "§4.3에 primaryStatus × remediationStatus × rollbackOutcome 유효 조합 표를 추가하고 §12.4 CHECK로 강제하라. 예: rollbackOutcome != none이면 primaryStatus IN ('rolled-back','failed','cancelled'), remediationStatus != none이면 primaryStatus IN ('paused','rolling-back','failed','cancelled') 같은 규칙을 명시하라."
.codex-reviews/cm_cycle4_response.md:10798:      "id": "CM4-05",
.codex-reviews/cm_cycle4_response.md:10805:        "§3.4 requestFingerprint 표와 §3.1.1 AuditAction metadata에도 두 command가 없다.",
.codex-reviews/cm_cycle4_response.md:10812:      "id": "CM4-06",
.codex-reviews/cm_cycle4_response.md:10825:      "id": "CM4-07",
.codex-reviews/cm_cycle4_response.md:10838:      "id": "CM4-08",
.codex-reviews/cm_cycle4_response.md:10852:      "id": "CM4-09",
.codex-reviews/cm_cycle4_response.md:10865:      "id": "CM4-10",
.codex-reviews/cm_cycle4_response.md:10872:        "§9 invariant는 skipped step이 retry queue, rollbackOutcome partial, run completion 조건에 어떻게 반영되는지 설명하지 않는다."
.codex-reviews/cm_cycle4_response.md:10875:      "recommendation": "skipped를 rollbackSkipped/manualSkipped 등으로 의미 분리하거나 statusReason을 required로 둬라. skipStep 후 StepRetryQueue 처리, RollbackLog.skippedIrreversibleSteps, Run.rollbackOutcome=partial 전이를 §4.3과 §9에 연결하라."
.codex-reviews/cm_cycle4_response.md:10878:      "id": "CM4-11",
.codex-reviews/cm_cycle4_response.md:10891:      "id": "CM4-12",
.codex-reviews/cm_cycle4_response.md:10905:      "id": "CM4-13",
.codex-reviews/cm_cycle4_response.md:10925:    "semver": "Run status substate, ApplyPreflightToken, writeSetManifest strategy 행은 추가됐다. 다만 cancellation recovery command 추가/제거와 stale-flags override predicate catalog 변경의 SemVer 영향은 빠져 있다.",
.codex-reviews/cm_cycle4_response.md:10926:    "state_enum_vs_transition": "불일치. §12.4 enum에는 partial-rollback이 없는데 §4.3 결과 status에 partial-rollback 표현이 남아 있다.",
.codex-reviews/cm_cycle4_response.md:10932:      "change": "ApplyPreflightToken을 opaque DB lookup 또는 signed envelope 중 하나로 확정하고 recompute/cache invalidation 계약 추가"
.codex-reviews/cm_cycle4_response.md:10936:      "change": "append-only-watermark 동시 삽입 검출을 run marker/range ledger/lock 정책으로 보강"
.codex-reviews/cm_cycle4_response.md:10962:      "ApplyPreflightToken HMAC decode 모순",
.codex-reviews/cm_cycle4_response.md:10999:      "change": "v0.2 동일 표현 제거 및 NotificationEvent/retry 우선순위 표 재전개"
.codex-reviews/cm_cycle4_response.md:11005:      "REVIEW_WORKFLOW AuditAction cascade incomplete",
.codex-reviews/cm_cycle4_response.md:11655:SemVer 형식 (`"1.4.2"`).
.codex-reviews/cm_cycle4_response.md:12130:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"3\\.5|3\\.7|4\\.3|4\\.8|6\\.2|6\\.3|12\\.4|12\\.5|append-only-watermark|markStepCompensated|abortRun|legalEntityChanged|ApplyPreflightToken|writeSetManifest|active run|stale-flags|v0\\.2|v0\\.3 동일|§ .*동일\" docs\\features\\content-migration.md" in C:\Users\assag\solution\website-exposure
.codex-reviews/cm_cycle4_response.md:12132:"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"content-migration-(dry-run-completed|run-paused|run-resumed|rollback-triggered|run-failed)|NotificationEventType|content-migration\" docs\\admin\\REVIEW_WORKFLOW.md" in C:\Users\assag\solution\website-exposure
.codex-reviews/cm_cycle4_response.md:12152:464:### 9.1 NotificationEventType enum (canonical SoT)
.codex-reviews/cm_cycle4_response.md:12153:467:type NotificationEventType =
.codex-reviews/cm_cycle4_response.md:12163:578:  eventType: NotificationEventType;                    // § 9.1 enum
.codex-reviews/cm_cycle4_response.md:12164:595:  eventType: NotificationEventType;
.codex-reviews/cm_cycle4_response.md:12182:21:- **핵심 책임**: (a) migration plan 정의·validate·dry-run·legal-gate·apply, (b) rollbackClass 강제 + writeSetManifest strategy별 partial write 감지, (c) read-only window writeClass 7종 세분화, (d) ApplyPreflightToken (8필드 server-side CAS), (e) policy-version-reevaluate risk-based + PolicyReevaluateResult 비교, (f) deterministic legalImpactClassifier + PII·entity field catalog SoT, (g) Run status primaryStatus + substate
.codex-reviews/cm_cycle4_response.md:12184:55:| ApplyPreflightToken algorithm 변경 | **MAJOR** | policyVersion 신규 | |
.codex-reviews/cm_cycle4_response.md:12187:66:- 본 문서 = plan/step/파이프라인·rollbackClass·writeSetManifest·CAS digest·legalImpactClassifier rule·read-only writeClass·step registry 최소 계약·privacy·NotificationEvent mapping SoT
.codex-reviews/cm_cycle4_response.md:12191:218:| 실행 | `runApply` (ApplyPreflightToken) | apply | super-admin | `content-migration-run-started` | — |
.codex-reviews/cm_cycle4_response.md:12197:381:### 3.5 ApplyPreflightToken (CM3-09)
.codex-reviews/cm_cycle4_response.md:12198:425:  | { kind: "append-only-watermark"; watermarkField: string }  // append-only: high watermark
.codex-reviews/cm_cycle4_response.md:12200:444:  highWatermark?: { before: string; after: string };    // append-only-watermark
.codex-reviews/cm_cycle4_response.md:12201:457:- `append-only-watermark`: actualAfterProjectionHash ≠ expectedAfterProjectionHash 또는 watermark 역행
.codex-reviews/cm_cycle4_response.md:12208:539:### 4.3 pause / resume / cancel state transition
.codex-reviews/cm_cycle4_response.md:12215:701:| ApplyPreflightToken mismatch 차단율 | 100% | |
.codex-reviews/cm_cycle4_response.md:12217:718:| INV-CAS-PREFLIGHT-TOKEN | § 9.2 ApplyPreflightToken mismatch | dry-run/apply drift |
.codex-reviews/cm_cycle4_response.md:12223:808:- classifierVersion mismatch → ApplyPreflightToken mismatch (CAS)
.codex-reviews/cm_cycle4_response.md:12233:911:| 2026-05-15 | **v0.4** | **codex 3차 비평 21 지적 전건 수용 + REVIEW_WORKFLOW·DATA_MODEL cascade**: (1) **REVIEW_WORKFLOW § 10.2.1 cascade 4종 추가** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |
.codex-reviews/cm_cycle4_response.md:12251:docs\features\content-migration.md:573:| `notification-emit-outbox` | NotificationEvent emit + outbox insert | 허용 |
.codex-reviews/cm_cycle4_response.md:12272:docs\features\content-migration.md:911:| 2026-05-15 | **v0.4** | **codex 3차 비평 21 지적 전건 수용 + REVIEW_WORKFLOW·DATA_MODEL cascade**: (1) **REVIEW_WORKFLOW § 10.2.1 cascade 4종 추가** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |
.codex-reviews/cm_cycle4_response.md:12299:docs\features\asset-ingestion.md:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
.codex-reviews/cm_cycle4_response.md:12315:4. 완료 → rollbackOutcome=full (skippedIrreversibleSteps=0) 또는 partial (skipped 있음)
.codex-reviews/cm_cycle4_response.md:12316:5. rollback 실패 → rollbackOutcome=failed + super-admin alert
.codex-reviews/cm_cycle4_response.md:12320:### 4.3 pause / resume / cancel state transition
.codex-reviews/cm_cycle4_response.md:12354:| `notification-emit-outbox` | NotificationEvent emit + outbox insert | 허용 |
.codex-reviews/cm_cycle4_response.md:12419:**LLM 분류 금지 (v1.0)**. class enum 변경·catalog 변경 SemVer § 1.1.
.codex-reviews/cm_cycle4_response.md:12444:7. ContentMigrationPolicyReevaluateBatch row 갱신: checked·cacheHit·skippedNoChange·changed·error 카운트
.codex-reviews/cm_cycle4_response.md:12453:### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT)
.codex-reviews/cm_cycle4_response.md:12469:### 3.5 ApplyPreflightToken (CM3-09)
.codex-reviews/cm_cycle4_response.md:12513:  | { kind: "append-only-watermark"; watermarkField: string }  // append-only: high watermark
.codex-reviews/cm_cycle4_response.md:12532:  highWatermark?: { before: string; after: string };    // append-only-watermark
.codex-reviews/cm_cycle4_response.md:12545:- `append-only-watermark`: actualAfterProjectionHash ≠ expectedAfterProjectionHash 또는 watermark 역행
.codex-reviews/cm_cycle4_response.md:12576:| ApplyPreflightToken mismatch 차단율 | 100% | |
.codex-reviews/cm_cycle4_response.md:12593:| INV-CAS-PREFLIGHT-TOKEN | § 9.2 ApplyPreflightToken mismatch | dry-run/apply drift |
.codex-reviews/cm_cycle4_response.md:12670:| `rollbackOutcome` | enum (none·full·partial·failed) | ✅ default none |
.codex-reviews/cm_cycle4_response.md:12797:### 12.9 `ContentMigrationPolicyReevaluateBatch`
.codex-reviews/cm_cycle4_response.md:12836:| `eventType` | enum (NotificationEventType 4종) | ✅ |
.codex-reviews/cm_cycle4_response.md:12859:  "finding_prefix": "CM4-",
.codex-reviews/cm_cycle4_response.md:12888:    "summary": "3차 지적 대부분은 문서상 반영됐다. 다만 ApplyPreflightToken, writeSetManifest append-only 전략, run status 3축 전이, active run uniqueness, stale-flags-only override, executable schema/fixture 완결성은 v1.0 후보로 보기 어렵다."
.codex-reviews/cm_cycle4_response.md:12892:      "id": "CM4-01",
.codex-reviews/cm_cycle4_response.md:12895:      "title": "ApplyPreflightToken을 HMAC char(64)로 정의해놓고 runApply에서 디코딩한다고 되어 있어 구현 불가능하다",
.codex-reviews/cm_cycle4_response.md:12905:      "id": "CM4-02",
.codex-reviews/cm_cycle4_response.md:12915:      "recommendation": "DryRunReport에 digestComputationMode(full/snapshot/cache), cacheSourceRef, invalidationInputs(policyVersionSnapshot, classifierVersion, ruleFileHashes, catalogRefs)를 추가하라. runApply는 cheap precheck(policy/catalog version) 후 필요한 digest만 재계산하는 알고리즘을 명시하라."
.codex-reviews/cm_cycle4_response.md:12918:      "id": "CM4-03",
.codex-reviews/cm_cycle4_response.md:12921:      "title": "append-only-watermark 전략이 동시 삽입과 phantom row를 막지 못한다",
.codex-reviews/cm_cycle4_response.md:12923:        "§3.6 PartialWriteStrategy append-only-watermark는 watermarkField만 가진다.",
.codex-reviews/cm_cycle4_response.md:12928:      "recommendation": "append-only-watermark에는 lowerBound, exclusiveUpperBound, sourcePredicateHash, writerId/runId marker, expectedInsertedCount, unique idempotency key를 요구하라. 동시 삽입 허용 시 range predicate + invariant query를 필수화하고, 불허 시 advisory lock/serializable을 요구하라."
.codex-reviews/cm_cycle4_response.md:12931:      "id": "CM4-04",
.codex-reviews/cm_cycle4_response.md:12934:      "title": "primaryStatus·remediationStatus·rollbackOutcome 3축이 transition matrix로 닫히지 않았다",
.codex-reviews/cm_cycle4_response.md:12937:        "§4.3은 cancellation-timeout-manual-review에서 허용 command만 적고 각 command 후 primary/remediation/rollbackOutcome 변화를 정의하지 않는다.",
.codex-reviews/cm_cycle4_response.md:12940:      "impact": "partial rollback은 rollbackOutcome=partial인지 remediationStatus인지 primaryStatus인지 혼재된다. completed + remediationStatus!=none, rolled-back + rollbackOutcome=none 같은 불가능 조합이 DB에서 허용된다.",
.codex-reviews/cm_cycle4_response.md:12941:      "recommendation": "§4.3에 valid transition matrix를 추가하고 §12.4에 조합 CHECK를 둬라. 예: primaryStatus='rolled-back'이면 rollbackOutcome IN ('full','partial'), primaryStatus NOT IN ('rolling-back','rolled-back')이면 rollbackOutcome='none' 등."
.codex-reviews/cm_cycle4_response.md:12944:      "id": "CM4-05",
.codex-reviews/cm_cycle4_response.md:12953:      "impact": "복구 경로를 열었다고 주장하지만 실제 API, DTO, idempotency scope, audit action, 권한, status transition이 없다. v1.0에서 timeout manual review에 진입하면 구현자가 임의 command를 만들 수밖에 없다.",
.codex-reviews/cm_cycle4_response.md:12957:      "id": "CM4-06",
.codex-reviews/cm_cycle4_response.md:12967:      "recommendation": "Run 또는 별도 ActiveTargetLock에 instanceId + targetSetDigest + writeSetScopeDigest를 저장하고 active partial unique를 추가하라. plan 단위 병렬만 금지하려는 정책이면 target overlap risk를 §9 runtime fail로 명시하라."
.codex-reviews/cm_cycle4_response.md:12970:      "id": "CM4-07",
.codex-reviews/cm_cycle4_response.md:12983:      "id": "CM4-08",
.codex-reviews/cm_cycle4_response.md:12996:      "id": "CM4-09",
.codex-reviews/cm_cycle4_response.md:13004:        "CAS는 solutionVersion column만 있고 status transition CAS WHERE 조건은 schema에 없다."
.codex-reviews/cm_cycle4_response.md:13006:      "impact": "executable schema라고 부르지만 구현 가능한 DDL로 변환하려면 추가 해석이 필요하다. 특히 CHECK, FK, partial unique, CAS transition이 application validator인지 DB constraint인지 혼재된다.",
.codex-reviews/cm_cycle4_response.md:13010:      "id": "CM4-10",
.codex-reviews/cm_cycle4_response.md:13023:      "id": "CM4-11",
.codex-reviews/cm_cycle4_response.md:13037:      "id": "CM4-12",
.codex-reviews/cm_cycle4_response.md:13050:      "id": "CM4-13",
.codex-reviews/cm_cycle4_response.md:13063:      "id": "CM4-14",
.codex-reviews/cm_cycle4_response.md:13066:      "title": "§1.1 SemVer 표는 신규 메커니즘 이름은 다루지만 하위 strategy 의미 변경을 충분히 분해하지 않는다",
.codex-reviews/cm_cycle4_response.md:13068:        "§1.1에는 writeSetManifest schema 변경, Run status enum·substate 변경, ApplyPreflightToken algorithm 변경 행이 있다.",
.codex-reviews/cm_cycle4_response.md:13069:        "append-only-watermark strategy의 concurrency/isolation 의미 변경, stale-flags-only override 판정 입력 변경은 별도 행이 없다."
.codex-reviews/cm_cycle4_response.md:13076:    "crm_sync_partial_unique": "부분 정합. ContentMigrationRun은 planId active unique만 있어 crm-sync의 active·rotating-target·committed처럼 대상 자원 자체를 잠그는 패턴에는 미달한다. targetSetDigest/writeSetScopeDigest active unique가 필요하다.",
.codex-reviews/cm_cycle4_response.md:13083:      "change": "ApplyPreflightToken을 opaque lookup 방식 또는 dryRunReportId + token 방식으로 재정의"
.codex-reviews/cm_cycle4_response.md:13087:      "change": "append-only-watermark concurrency/isolation/phantom 방지 조건 추가"
.codex-reviews/cm_cycle4_response.md:13091:      "change": "Run 3축 transition matrix와 DB CHECK 추가, partial-rollback 잔재 제거"
.codex-reviews/cm_cycle4_response.md:13109:      "ApplyPreflightToken HMAC decode 불가능",
.codex-reviews/cm_cycle4_response.md:13110:      "append-only-watermark 동시 삽입/phantom row 방지 미흡",
.codex-reviews/cm_cycle4_response.md:13111:      "Run status 3축 transition matrix 및 DB CHECK 미완성",
.codex-reviews/cm_cycle4_response.md:13127:  "finding_prefix": "CM4-",
.codex-reviews/cm_cycle4_response.md:13156:    "summary": "3차 지적 대부분은 문서상 반영됐다. 다만 ApplyPreflightToken, writeSetManifest append-only 전략, run status 3축 전이, active run uniqueness, stale-flags-only override, executable schema/fixture 완결성은 v1.0 후보로 보기 어렵다."
.codex-reviews/cm_cycle4_response.md:13160:      "id": "CM4-01",
.codex-reviews/cm_cycle4_response.md:13163:      "title": "ApplyPreflightToken을 HMAC char(64)로 정의해놓고 runApply에서 디코딩한다고 되어 있어 구현 불가능하다",
.codex-reviews/cm_cycle4_response.md:13173:      "id": "CM4-02",
.codex-reviews/cm_cycle4_response.md:13183:      "recommendation": "DryRunReport에 digestComputationMode(full/snapshot/cache), cacheSourceRef, invalidationInputs(policyVersionSnapshot, classifierVersion, ruleFileHashes, catalogRefs)를 추가하라. runApply는 cheap precheck(policy/catalog version) 후 필요한 digest만 재계산하는 알고리즘을 명시하라."
.codex-reviews/cm_cycle4_response.md:13186:      "id": "CM4-03",
.codex-reviews/cm_cycle4_response.md:13189:      "title": "append-only-watermark 전략이 동시 삽입과 phantom row를 막지 못한다",
.codex-reviews/cm_cycle4_response.md:13191:        "§3.6 PartialWriteStrategy append-only-watermark는 watermarkField만 가진다.",
.codex-reviews/cm_cycle4_response.md:13196:      "recommendation": "append-only-watermark에는 lowerBound, exclusiveUpperBound, sourcePredicateHash, writerId/runId marker, expectedInsertedCount, unique idempotency key를 요구하라. 동시 삽입 허용 시 range predicate + invariant query를 필수화하고, 불허 시 advisory lock/serializable을 요구하라."
.codex-reviews/cm_cycle4_response.md:13199:      "id": "CM4-04",
.codex-reviews/cm_cycle4_response.md:13202:      "title": "primaryStatus·remediationStatus·rollbackOutcome 3축이 transition matrix로 닫히지 않았다",
.codex-reviews/cm_cycle4_response.md:13205:        "§4.3은 cancellation-timeout-manual-review에서 허용 command만 적고 각 command 후 primary/remediation/rollbackOutcome 변화를 정의하지 않는다.",
.codex-reviews/cm_cycle4_response.md:13208:      "impact": "partial rollback은 rollbackOutcome=partial인지 remediationStatus인지 primaryStatus인지 혼재된다. completed + remediationStatus!=none, rolled-back + rollbackOutcome=none 같은 불가능 조합이 DB에서 허용된다.",
.codex-reviews/cm_cycle4_response.md:13209:      "recommendation": "§4.3에 valid transition matrix를 추가하고 §12.4에 조합 CHECK를 둬라. 예: primaryStatus='rolled-back'이면 rollbackOutcome IN ('full','partial'), primaryStatus NOT IN ('rolling-back','rolled-back')이면 rollbackOutcome='none' 등."
.codex-reviews/cm_cycle4_response.md:13212:      "id": "CM4-05",
.codex-reviews/cm_cycle4_response.md:13221:      "impact": "복구 경로를 열었다고 주장하지만 실제 API, DTO, idempotency scope, audit action, 권한, status transition이 없다. v1.0에서 timeout manual review에 진입하면 구현자가 임의 command를 만들 수밖에 없다.",
.codex-reviews/cm_cycle4_response.md:13225:      "id": "CM4-06",
.codex-reviews/cm_cycle4_response.md:13235:      "recommendation": "Run 또는 별도 ActiveTargetLock에 instanceId + targetSetDigest + writeSetScopeDigest를 저장하고 active partial unique를 추가하라. plan 단위 병렬만 금지하려는 정책이면 target overlap risk를 §9 runtime fail로 명시하라."
.codex-reviews/cm_cycle4_response.md:13238:      "id": "CM4-07",
.codex-reviews/cm_cycle4_response.md:13251:      "id": "CM4-08",
.codex-reviews/cm_cycle4_response.md:13264:      "id": "CM4-09",
.codex-reviews/cm_cycle4_response.md:13272:        "CAS는 solutionVersion column만 있고 status transition CAS WHERE 조건은 schema에 없다."
.codex-reviews/cm_cycle4_response.md:13274:      "impact": "executable schema라고 부르지만 구현 가능한 DDL로 변환하려면 추가 해석이 필요하다. 특히 CHECK, FK, partial unique, CAS transition이 application validator인지 DB constraint인지 혼재된다.",
.codex-reviews/cm_cycle4_response.md:13278:      "id": "CM4-10",
.codex-reviews/cm_cycle4_response.md:13291:      "id": "CM4-11",
.codex-reviews/cm_cycle4_response.md:13305:      "id": "CM4-12",
.codex-reviews/cm_cycle4_response.md:13318:      "id": "CM4-13",
.codex-reviews/cm_cycle4_response.md:13331:      "id": "CM4-14",
.codex-reviews/cm_cycle4_response.md:13334:      "title": "§1.1 SemVer 표는 신규 메커니즘 이름은 다루지만 하위 strategy 의미 변경을 충분히 분해하지 않는다",
.codex-reviews/cm_cycle4_response.md:13336:        "§1.1에는 writeSetManifest schema 변경, Run status enum·substate 변경, ApplyPreflightToken algorithm 변경 행이 있다.",
.codex-reviews/cm_cycle4_response.md:13337:        "append-only-watermark strategy의 concurrency/isolation 의미 변경, stale-flags-only override 판정 입력 변경은 별도 행이 없다."
.codex-reviews/cm_cycle4_response.md:13344:    "crm_sync_partial_unique": "부분 정합. ContentMigrationRun은 planId active unique만 있어 crm-sync의 active·rotating-target·committed처럼 대상 자원 자체를 잠그는 패턴에는 미달한다. targetSetDigest/writeSetScopeDigest active unique가 필요하다.",
.codex-reviews/cm_cycle4_response.md:13351:      "change": "ApplyPreflightToken을 opaque lookup 방식 또는 dryRunReportId + token 방식으로 재정의"
.codex-reviews/cm_cycle4_response.md:13355:      "change": "append-only-watermark concurrency/isolation/phantom 방지 조건 추가"
.codex-reviews/cm_cycle4_response.md:13359:      "change": "Run 3축 transition matrix와 DB CHECK 추가, partial-rollback 잔재 제거"
.codex-reviews/cm_cycle4_response.md:13377:      "ApplyPreflightToken HMAC decode 불가능",
.codex-reviews/cm_cycle4_response.md:13378:      "append-only-watermark 동시 삽입/phantom row 방지 미흡",
.codex-reviews/cm_cycle4_response.md:13379:      "Run status 3축 transition matrix 및 DB CHECK 미완성",

 succeeded in 597ms:
# Feature — content-migration

> **상태**: Draft v0.5 (codex 자동 비평 4차 반영 — 14개 지적 전건 수용)
> **작성일**: 2026-05-15
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 11.1
> **목적**: 솔루션 **내부** 콘텐츠·데이터 마이그레이션. application-level data migration·feature 활성화 backfill·인스턴스 간 복제·콘텐츠 일괄 변환·policy 재평가·routing slug 보존.
> **연관 SoT**:
> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (4종 NotificationEventType + **13종 AuditAction** cascade 완료)
> - 자격증명·식별자·policyVersion → DATA_MODEL C-08 v0.22 (`contentMigrationConfig`·`contentMigrationPolicyVersion`·`featureLegalApproved`·`piiFieldCatalogRef`·`entityFieldProjectionCatalogRef`)
> - 페이지·콘텐츠·ComplianceRecord schema → DATA_MODEL Core
> - compliance-assistant `check()` (policy-version-reevaluate)
> - asset-ingestion handoff → § 1.3
> - retry queue·outbox worker SQL → 본 문서 § 4.6·§ 12.6 자체 전개

---

## 0. 한 페이지 요약

- **Feature 식별자**: `content-migration`
- **핵심 책임**: (a) migration plan 정의·validate·dry-run·legal-gate·apply, (b) rollbackClass 강제 + writeSetManifest strategy별 partial write 감지, (c) read-only window writeClass 7종 세분화, (d) ApplyPreflightToken (8필드 server-side CAS), (e) policy-version-reevaluate risk-based + PolicyReevaluateResult 비교, (f) deterministic legalImpactClassifier + PII·entity field catalog SoT, (g) Run status primaryStatus + substate
- **vs asset-ingestion**: asset-ingestion=외부→솔루션 raw + promote. 본 Feature=promote 이후 정렬·slug/redirect·승계·instance copy·policy 재평가. body MV 직접 수정 금지
- **vs DB DDL**: DDL은 인프라. 본 Feature는 데이터 backfill만
- **migration plan kind 6종**: `application-data-version-upgrade`·`feature-activation-backfill`·`instance-to-instance-copy`·`content-bulk-transform`·`policy-version-reevaluate`·`routing-slug-preservation`
- **rollbackClass 3종**: `reversible`·`compensating`·`irreversible` (자동 skip 금지·blocked-manual-remediation-required)
- **DB 인벤토리 (CM4-06·07·09 정정)**: **11 tables** (§ 12.1 ~ § 12.11 — 12.9.1은 embedded·12.11 ContentMigrationActiveTargetLock 신설)

---

## 1. 일반 규약

### 1.1 변경 정책 (CM3-18 catalog 추가)

| 변경 유형 | 패키지 SemVer | policyVersion | 동반 cascade |
|---|---|---|---|
| 입력/출력 인터페이스 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9·§ 10 |
| migration plan kind 추가 (legal/read-only/rollback/dry-run output 영향 없을 시) | MINOR | 별개 | step type registry |
| migration plan kind 추가 (영향 동반) | **MAJOR** | policyVersion 신규 | |
| migration plan kind 제거 | **MAJOR** | 별개 | |
| step type 추가 (rollbackClass·reverse-step 정의 통과) | MINOR | 별개 | |
| step type 추가 (dry-run report schema 변경) | **MAJOR** | policyVersion 신규 | |
| 알림 매트릭스 변경 | **MAJOR** | policyVersion 신규 | |
| rollback 알고리즘·rollbackClass enum 변경 | **MAJOR** | policyVersion 신규 | |
| legalImpactClassifier 룰 추가·강화 (fail-closed 강도 증가) | MINOR | 별개 | |
| legalImpactClassifier 룰 완화·class 제거 | **MAJOR** | policyVersion 신규 | 법무 승인 |
| **PII field catalog 변경** (CM3-18) | **MAJOR** | policyVersion 신규 | DATA_MODEL `piiFieldCatalogRef` 갱신 + 영향 plan 재평가 |
| **entity field projection catalog 변경** (CM3-18) | **MAJOR** | policyVersion 신규 | DATA_MODEL `entityFieldProjectionCatalogRef` 갱신 |
| **priorReviewRequired trigger catalog 변경** (CM3-18) | **MAJOR** | policyVersion 신규 | classifierVersion bump |
| CAS digest algorithm·projection 변경 | **MAJOR** | policyVersion 신규 | 기존 DryRunReport 무효 |
| reportingMode default 변경 | **MAJOR** | policyVersion 신규 | |
| read-only window writeClass 세분화·정책 변경 | **MAJOR** | policyVersion 신규 | |
| irreversible skip 정책 변경 | **MAJOR** | policyVersion 신규 | |
| writeSetManifest schema 변경 | **MAJOR** | policyVersion 신규 | |
| Run status enum·substate 변경 | **MAJOR** | policyVersion 신규 | |
| ApplyPreflightToken algorithm 변경 | **MAJOR** | policyVersion 신규 | |
| **writeSetManifest strategy semantic 변경** (isolation·concurrency·watermark 의미 변경 — CM4-14) | **MAJOR** | policyVersion 신규 | |
| **policy-reevaluate reportingMode decision rule 변경** (CM4-14) | **MAJOR** | policyVersion 신규 | |
| **staleFlagsOnlyOverrideConditions 입력 변경** (CM4-14) | **MAJOR** | policyVersion 신규 | |
| **ActiveTargetLock kind enum 추가·writeSetScopeDigest 산정 변경** (CM4-06) | **MAJOR** | policyVersion 신규 | |
| build/runtime/migration fail 룰 추가·강화 | **MAJOR** | 별개 | |
| runtime invariant·reconcile 룰 추가·강화 | MINOR | 별개 | |
| warning·지표·acceptance test 추가 | PATCH | 별개 | |

### 1.2 SoT 원칙

- 알림·audit canonical → notifications + REVIEW_WORKFLOW
- 자격증명·policyVersion·catalog refs → DATA_MODEL C-08 v0.22
- 페이지·콘텐츠·ComplianceRecord → DATA_MODEL Core
- 정책 재평가 → compliance-assistant `check()` (본 문서 § 4.8 batch contract SoT)
- 본 문서 = plan/step/파이프라인·rollbackClass·writeSetManifest·CAS digest·legalImpactClassifier rule·read-only writeClass·step registry 최소 계약·privacy·NotificationEvent mapping SoT

### 1.2.1 retry taxonomy

| 큐 | maxAttempts | backoff |
|---|---|---|
| ContentMigrationStepRetryQueue | config(기본 3) | [60, 600, 3600]s |
| ContentMigrationNotificationOutbox | 상수 5 | § 4.6 자체 SQL — backoff [60, 300, 1800, 7200, 21600]s |

### 1.3 본 문서가 다루지 않는 영역

| 영역 | 책임 |
|---|---|
| 외부 raw 수집·parsing·PII·promote | asset-ingestion |
| promote 이후 Core row 정렬·slug/redirect·검수 이력 승계·instance copy·policy 재평가 | 본 Feature |
| asset-ingestion body materialized view 직접 변경 | **금지** — raw source 또는 approved redaction op 경유만 |
| DB DDL | 인프라 |
| 알림 채널·재시도·digest | notifications |
| 운영자 검수 큐 상태 머신 | REVIEW_WORKFLOW (policy-reevaluate가 ComplianceRecord 재생성 시 새 lifecycle 진입) |
| 페이지·콘텐츠 schema 자체 | DATA_MODEL |

---

## 2. Feature 정의

### 2.1 기본 메타

```yaml
name: "content-migration"
specVersion: "0.5"
coreRequiresMin: "1.0.0"
implementationKind: "node-module"
activation: { scope: "instance", default: false }
```

### 2.2 의존성

| 영역 | 의존 |
|---|---|
| notifications | notify() 필수 |
| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 4종 NotificationEventType |
| REVIEW_WORKFLOW § 10.2.1 | 13종 AuditAction |
| DATA_MODEL C-08 v0.22 | `contentMigrationConfig`·`featureLegalApproved`·`piiFieldCatalogRef`·`entityFieldProjectionCatalogRef`·`contentMigrationPolicyVersion` |
| compliance-assistant § 3.3·§ 8 | check() + cacheKey |
| asset-ingestion | promote handoff + body MV 보호 |

### 2.3 InstanceManifest 통합

```yaml
contentMigrationConfig:                                 # DATA_MODEL C-08 v0.22
  featureLegalApproved: true
  featureLegalApprovedBy: "legal@glitzy.kr"
  featureLegalApprovedAt: "2026-05-10T00:00:00Z"
  defaultMode: "dry-run"
  approvalRequired:
    applicationDataVersionUpgrade: super-admin
    featureActivationBackfill: super-admin
    instanceToInstanceCopy: [super-admin, legal-reviewer]
    contentBulkTransform: super-admin
    policyVersionReevaluate: super-admin
    routingSlugPreservation: super-admin
  legalImpactClassifierRef: "lic-2026-05-15"
  piiFieldCatalogRef: "pii-cat-2026-05-15"              # CM3-05
  entityFieldProjectionCatalogRef: "efp-cat-2026-05-15" # CM3-05

contentMigrationPolicyVersion: "cm-2026-05-15"

features:
  - name: "content-migration"
    version: "0.5.0"
    enabled: true
    requiresFeature: [notifications]
    config:
      execution:
        maxParallelSteps: 5
        stepTimeoutSeconds: 3600
        readOnlyWindow:
          enabled: false
          allowedWriteClasses: ["audit-append", "notification-emit-outbox"]      # CM3-03 — dispatch 제거
          blockedWriteClasses: ["content-mutating", "workflow-state", "feature-operational", "notification-read-receipt", "notification-digest-state"]
          dispatchAllowlist:                            # CM3-03 + CM4-13 — REVIEW_WORKFLOW § 9.1.1 derived rule + hash drift 방지
            # derived rule: criticality ∈ {high, critical} (REVIEW_WORKFLOW § 9.1.1 SoT)
            - "content-migration-run-failed"
            - "content-migration-rollback-triggered"
            - "content-migration-plan-legal-approved"
          dispatchAllowlistPolicySnapshot: "rw-policy-2026-05-15"   # CM4-13 — REVIEW_WORKFLOW snapshot hash. drift 시 build fail
          dispatchOtherEventsQueueUntilWindowEnd: true
      retry:
        maxAttempts: 3
        backoffSeconds: [60, 600, 3600]
      rollback:
        autoRollbackOnFailure: false
        rollbackTimeoutSeconds: 7200
        retryExhaustedAction: "pause"
      dryRun:
        reportRetentionDays: 30
        impactSamplingMode: "deterministic-stratified"
        impactSamplingSize: 100
        criticalClassFullDiff: true
        digest:
          chunkSize: 10000
          maxRowsBeforeSnapshot: 1000000
      policyVersionReevaluate:
        concurrencyLimit: 10
        rateLimitPerSecond: 50
        cacheDedupeEnabled: true
        defaultReportingMode: "risk-based"
        overrideAllowed: ["new-record-version"]         # CM3-15 — stale-flags-only override는 별도 CHECK 통과 시만
        staleFlagsOnlyOverrideConditions:
          maxRiskLevel: "low"
          requiresNoLegalSensitiveEntityChange: true     # CM4-08
          requiresNoLegalEntityIdentityChange: true      # CM4-08
          requiresNoPriorReviewRequiredChange: true
      retentionDays:
        plan: 1095; run: 730; step: 730; dryRunReport: 30
        legalApproval: 2555; rollbackLog: 1095; readOnlyWindow: 730
        stepRetryQueueCompleted: 30; notificationOutbox: 30
        policyReevaluateBatch: 730
      purgeWorker: { cadenceMinutes: 60, batchSize: 500, legalHoldOverride: false }
      hashSecrets:
        planFingerprintPepperRef: "secretRef://CM_PLAN_FINGERPRINT_PEPPER"
        idempotencyPepperRef: "secretRef://CM_IDEMPOTENCY_PEPPER"
        digestPepperRef: "secretRef://CM_DIGEST_PEPPER"
        applyPreflightTokenPepperRef: "secretRef://CM_PREFLIGHT_TOKEN_PEPPER"  # CM3-09
      externalMonitoringSink: { provider: "sentry", dsnSecretRef: "secretRef://MONITORING_DSN" }
```

### 2.4 CAS digest 알고리즘 SoT

| digest | 정의 |
|---|---|
| `planFingerprint` | HMAC-SHA256(planFingerprintPepperRef, canonical(plan body)). char(64) |
| `targetSetDigest` | chunked Merkle (chunkSize=10000) of stable-ordered target primary keys + selector version + tenant scope. 임계 초과 시 snapshot 기반 |
| `contentHashDigest` | step별 read-set field projection canonical JSON → chunked Merkle |
| `sourceSnapshotWatermark` | source table별 MAX(updated_at) + deletion ledger high watermark + version vector. canonical digest |
| `policyVersionSnapshot` | (contentMigrationPolicyVersion + complianceAssistantPolicyVersion + ruleCatalogVersion + ruleFileHashes + REVIEW_WORKFLOW version + piiFieldCatalogRef + entityFieldProjectionCatalogRef) canonical digest |
| `stepRegistryVersion` | step type registry 카탈로그 hash |
| `legalImpactClassificationDigest` | classifierVersion + classes[] canonical digest |
| `requestFingerprint` | command별 (§ 3.4) |
| **`applyPreflightToken`** (CM3-09·CM4-01) | HMAC(applyPreflightTokenPepperRef, planId + dryRunReportId + 8필드 digest bundle). char(64) opaque. **opaque이므로 decode 불가** — client는 token + dryRunReportId 둘 다 전달. server는 `(planId, dryRunReportId)`로 row lookup 후 token 재계산 비교 (CM4-01 정정) |

dry-run/apply preflight 동일 함수. 비용 상한 § 2.3 `digest`.

---

## 3. 입력·출력

### 3.1 엔트리포인트 + read API + 운영 command (CM3-19 metadata 일관화)

| 종류 | 함수 | 책임 | 권한 | AuditAction (canonical) | NotificationEvent |
|---|---|---|---|---|---|
| 실행 | `definePlan` | plan 정의 | super-admin | `content-migration-plan-defined` | — |
| 실행 | `validatePlan` | step·rollbackClass·classifier | super-admin | `content-migration-plan-validated` | — |
| 실행 | `runDryRun` | DryRunReport 생성 | super-admin | `content-migration-dry-run-completed` | — |
| 실행 | `approvePlanLegalGate` | legal-reviewer 게이트 | legal-reviewer | `content-migration-plan-legal-approved` | `content-migration-plan-legal-approved` |
| 실행 | `runApply` (ApplyPreflightToken) | apply | super-admin | `content-migration-run-started` | — |
| 실행 | `pauseRun` | step boundary pause | super-admin | `content-migration-run-paused` | — |
| 실행 | `resumeRun` | resume | super-admin | `content-migration-run-resumed` | — |
| 실행 | `cancelRun` | cooperative cancel | super-admin | `content-migration-run-cancelled` | — |
| 실행 | `rollbackRun` | scope: full/from-step | super-admin | `content-migration-rollback-triggered` (요청)·`content-migration-rollback-applied` (완료) | `content-migration-rollback-triggered` |
| 실행 | `skipStep` | irreversible step skip | super-admin + remediationTicketRef | `content-migration-step-skipped` | — |
| 실행 | `markStepCompensated` (CM4-05) | manual remediation compensation 적용 표시 | super-admin + remediationTicketRef | `content-migration-step-compensated` | — |
| 실행 | `abortRun` (CM4-05) | cancellation-timeout 또는 blocked-manual-remediation 강제 종료 | super-admin + remediationTicketRef + 운영 ticket | `content-migration-run-aborted` | `content-migration-run-failed` |
| 실행 (system) | run completion | run 완료 시 | system | `content-migration-run-completed` 또는 `content-migration-run-failed` | 동일 |
| read | `queryPlans` (privacy class) | | operator·super-admin·legal-reviewer | — | — |
| read | `queryRuns` (privacy class) | | 동일 | — | — |
| read | `queryStepResults` (closed schema masking) | | 동일 | — | — |

### 3.1.1 AuditAction metadata 표 (CM3-19 — actorId·requestFingerprint·8필드 일관)

**공통 metadata required (모든 AuditAction)**: `actorId`·`actorRole`·`idempotencyKey`·`requestFingerprint`.

| AuditAction (canonical) | 추가 metadata |
|---|---|
| `content-migration-plan-defined` | planKind·targetEntityCount·planFingerprint·classifierVersion |
| `content-migration-plan-validated` | rollbackClassSummary·legalImpactClassification·classifierVersion·warningsCount·stepRegistryVersion·validateFailReasons[] |
| `content-migration-plan-legal-approved` | approvedBy·approvedAt·classificationSnapshot·planFingerprint·legalImpactClassificationDigest·policyVersionSnapshot·dryRunReportId·approvedDigestBundleHash |
| `content-migration-dry-run-completed` | reportId·**8필드 digest** (planFingerprint·targetSetDigest·contentHashDigest·sourceSnapshotWatermark·policyVersionSnapshot·stepRegistryVersion·legalImpactClassificationDigest·classifierVersion)·sampling stats·blockedDriftCount |
| `content-migration-run-started` | mode·planId·expectedDryRunReportId·**applyPreflightToken**·8필드 digest bundle hash·classifierVersion·policySnapshotVersion |
| `content-migration-run-paused` | runId·pausedAtStepKey·reason·pausedBy |
| `content-migration-run-resumed` | runId·resumedBy·pausedDurationSeconds |
| `content-migration-run-completed` | result·changedRecords·failedSteps·rollbackTriggered·skippedIrreversibleStepCount |
| `content-migration-run-failed` | failedStepKey·errorClass·partialWriteDetected·writeSetManifestRef |
| `content-migration-run-cancelled` | cancelledBy·reason·completedSteps·partialCommitRollbackRequired |
| `content-migration-rollback-triggered` | runId·scope·reason·expectedStatus·triggeredBy |
| `content-migration-rollback-applied` | scope·rolledBackSteps·skippedIrreversibleSteps·result (partial 강제 시) |
| `content-migration-step-skipped` | reason·approver·rollbackClass·affectedRowsConfirmation·remediationTicketRef·classifierVersion |

### 3.2 plan kind 6종 (CM3-16 — 풀 전개)

#### 3.2.1 `application-data-version-upgrade`

 succeeded in 625ms:
Reading additional input from stdin...
OpenAI Codex v0.130.0
--------
workdir: C:\Users\assag\solution\website-exposure
model: gpt-5.5
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR, C:\Users\assag\.codex\memories]
reasoning effort: none
reasoning summaries: none
session id: 019e2935-6255-7b32-9e4a-ee3439ae301e
--------
user
# 자동 비평 의뢰 — `docs/features/content-migration.md` v0.4 (4차 사이클)

## 컨텍스트

3차 비평(21 지적) 전건 수용 + REVIEW_WORKFLOW·DATA_MODEL cascade. v0.4 핵심:
- REVIEW_WORKFLOW § 10.2.1 cascade 4종 추가 (dry-run-completed·run-paused·run-resumed·rollback-triggered) — canonical name
- DATA_MODEL C-08 v0.22: featureLegalApproved rename + piiFieldCatalogRef·entityFieldProjectionCatalogRef
- cooperativeCancellation 미지원 + non-per-chunk → validate fail로 승격
- cancellation-timeout-manual-review 허용 command 표 (rollbackRun·skipStep·markStepCompensated·abortRun)
- read-only window notification-dispatch dispatchAllowlist (high/critical operational만)
- PolicyReevaluateResult 타입 (previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingMode)
- § 12 executable schema 10 tables 풀 schema
- § 12.6 StepRetryQueue worker SQL 자체 전개
- ApplyPreflightToken § 3.5 — server-side 8필드 CAS (ETag 스타일)
- writeSetManifest strategy 4종 분기 (small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform)
- Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해
- active run partial unique
- LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash
- NotificationOutbox SQL nextAttemptAt·attempts·exhausted
- stale-flags-only override CHECK (maxRiskLevel=low + no legal/priorReview change)
- v0.2 동일 잔재 풀 전개
- § 6.2 INV ↔ § 9 fail rule 1:1 traceability + § 6.3 happy path fixture
- § 1.1 SemVer catalog 3행 추가
- § 3.1.1 AuditAction metadata 공통 required (actorId·actorRole·idempotencyKey·requestFingerprint)
- § 3.8 StepResultRow closed schema

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\content-migration.md` v0.4를 이전과 동일한 강도로 엄정하게 비평하라:

1. **3차 지적 재발 여부**: 21개 지적이 실제로 정정됐는가?
2. **v0.4 신규 메커니즘 모순·미진함**:
   - ApplyPreflightToken — 8필드 재계산이 매번 발생하면 apply 시점 비용 우려. 또는 cache로 처리? legalImpactClassificationDigest와 classifierVersion이 변경되면 server에서 어떻게 감지?
   - writeSetManifest strategy 4종 — append-only-watermark가 watermark 역행 검사로 충분한가? 동시 삽입은?
   - Run status substate 분해 — primaryStatus·remediationStatus·rollbackOutcome 3축이 모든 transition을 닫는가? § 4.3 표가 모든 조합을 다루지 않음
   - cancellation-timeout-manual-review 허용 command 4종 중 markStepCompensated·abortRun은 § 3.1 command 목록에 없음
   - § 12.4 active run partial unique가 동시 dry-run + apply 충돌도 막는가? dry-run은 active run 정의에 포함 안 됨
   - § 4.8 stale-flags-only override CHECK 조건 — maxRiskLevel=low + no legal entity change + no priorReview change. 그런데 legalEntityChanged는 어떻게 정의? `LegalDocument·ReviewPolicy·PricingPage 영향`이 정확한가?
   - § 12.5 StepResultRow CHECK `containsPii = true → export_allowed = false` — application validator인지 DB CHECK인지
3. **DB 10 tables executable schema 완결성**:
   - § 12.1-§ 12.10 schema가 모든 FK·CHECK·partial unique·CAS를 다루는가
   - § 12.4 ContentMigrationRun.expectedLegalApprovalId FK는 legalGateRequired=false일 때 null 허용 — 정합한가
   - § 12.5 status enum에 skipped 포함되었지만 § 9 invariant에서 skipped 처리 path 명확한가
4. **traceability**:
   - § 6.2 INV 23종 ↔ § 9 rule 매핑이 빠진 항목 (예: INV-CATALOG-VALIDATION은 § 9.3에 있지만 § 6.2 표에 매핑됨)
   - § 6.3 fixture violation path가 v0.5 미루어진 영역 — v1.0 후보로서 충분한가?
5. **이전 Feature 패턴 정합성**:
   - crm-sync v1.0 partial unique 3종(active·rotating-target·committed) 패턴 — content-migration의 ContentMigrationRun primaryStatus 다중 active 방지가 정확히 같은 패턴인가
   - asset-ingestion body MV denylist 패턴 적용 정확성
   - notifications outbox SQL 패턴 (nextAttemptAt·attempts·exhausted) 일관성
6. **명세 자체의 정합성**:
   - § 0 한 페이지 요약 ↔ § 12 인벤토리 일관성
   - § 1.1 SemVer가 v0.4 신규 (Run status substate·ApplyPreflightToken·writeSetManifest strategy) 모두 다루는가
   - § 4.3 state transition 표 + § 12.4 status enum 정합
   - "v0.3 동일·v0.2 § X 동일" 잔재 (있다면)

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `CM4-`. v1.0 후보 판정 가능하면 `ready_for_v1_0=true`.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\content-migration.md` (대상 v0.4)
- `C:\Users\assag\solution\website-exposure\.codex-reviews\cm_cycle3_response.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\features\crm-sync.md`
- `C:\Users\assag\solution\website-exposure\docs\features\asset-ingestion.md`
- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md`
codex
`seo-geo` skill은 이번 요청과 직접 관련이 없어 사용하지 않습니다. 먼저 대상 문서와 3차 응답, 관련 SoT 문서의 핵심 구간을 병렬로 읽고 재발 여부와 신규 모순을 분리해 점검하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw docs\\admin\\REVIEW_WORKFLOW.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw docs\\features\\crm-sync.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw docs\\features\\asset-ingestion.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw docs\\core\\DATA_MODEL.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw docs\\features\\notifications.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw .codex-reviews\\cm_cycle3_response.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw docs\\features\\content-migration.md" in C:\Users\assag\solution\website-exposure
 succeeded in 1226ms:
# Feature — content-migration

> **상태**: Draft v0.4 (codex 자동 비평 3차 반영 — 21개 지적 전건 수용. stand-alone SoT 강화)
> **작성일**: 2026-05-15
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 11.1
> **목적**: 솔루션 **내부** 콘텐츠·데이터 마이그레이션. application-level data migration·feature 활성화 backfill·인스턴스 간 복제·콘텐츠 일괄 변환·policy 재평가·routing slug 보존.
> **연관 SoT**:
> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (4종 NotificationEventType + **13종 AuditAction** cascade 완료)
> - 자격증명·식별자·policyVersion → DATA_MODEL C-08 v0.22 (`contentMigrationConfig`·`contentMigrationPolicyVersion`·`featureLegalApproved`·`piiFieldCatalogRef`·`entityFieldProjectionCatalogRef`)
> - 페이지·콘텐츠·ComplianceRecord schema → DATA_MODEL Core
> - compliance-assistant `check()` (policy-version-reevaluate)
> - asset-ingestion handoff → § 1.3
> - retry queue·outbox worker SQL → 본 문서 § 4.6·§ 12.6 자체 전개

---

## 0. 한 페이지 요약

- **Feature 식별자**: `content-migration`
- **핵심 책임**: (a) migration plan 정의·validate·dry-run·legal-gate·apply, (b) rollbackClass 강제 + writeSetManifest strategy별 partial write 감지, (c) read-only window writeClass 7종 세분화, (d) ApplyPreflightToken (8필드 server-side CAS), (e) policy-version-reevaluate risk-based + PolicyReevaluateResult 비교, (f) deterministic legalImpactClassifier + PII·entity field catalog SoT, (g) Run status primaryStatus + substate
- **vs asset-ingestion**: asset-ingestion=외부→솔루션 raw + promote. 본 Feature=promote 이후 정렬·slug/redirect·승계·instance copy·policy 재평가. body MV 직접 수정 금지
- **vs DB DDL**: DDL은 인프라. 본 Feature는 데이터 backfill만
- **migration plan kind 6종**: `application-data-version-upgrade`·`feature-activation-backfill`·`instance-to-instance-copy`·`content-bulk-transform`·`policy-version-reevaluate`·`routing-slug-preservation`
- **rollbackClass 3종**: `reversible`·`compensating`·`irreversible` (자동 skip 금지·blocked-manual-remediation-required)
- **DB 인벤토리**: **10 tables** (§ 12 executable schema)

---

## 1. 일반 규약

### 1.1 변경 정책 (CM3-18 catalog 추가)

| 변경 유형 | 패키지 SemVer | policyVersion | 동반 cascade |
|---|---|---|---|
| 입력/출력 인터페이스 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9·§ 10 |
| migration plan kind 추가 (legal/read-only/rollback/dry-run output 영향 없을 시) | MINOR | 별개 | step type registry |
| migration plan kind 추가 (영향 동반) | **MAJOR** | policyVersion 신규 | |
| migration plan kind 제거 | **MAJOR** | 별개 | |
| step type 추가 (rollbackClass·reverse-step 정의 통과) | MINOR | 별개 | |
| step type 추가 (dry-run report schema 변경) | **MAJOR** | policyVersion 신규 | |
| 알림 매트릭스 변경 | **MAJOR** | policyVersion 신규 | |
| rollback 알고리즘·rollbackClass enum 변경 | **MAJOR** | policyVersion 신규 | |
| legalImpactClassifier 룰 추가·강화 (fail-closed 강도 증가) | MINOR | 별개 | |
| legalImpactClassifier 룰 완화·class 제거 | **MAJOR** | policyVersion 신규 | 법무 승인 |
| **PII field catalog 변경** (CM3-18) | **MAJOR** | policyVersion 신규 | DATA_MODEL `piiFieldCatalogRef` 갱신 + 영향 plan 재평가 |
| **entity field projection catalog 변경** (CM3-18) | **MAJOR** | policyVersion 신규 | DATA_MODEL `entityFieldProjectionCatalogRef` 갱신 |
| **priorReviewRequired trigger catalog 변경** (CM3-18) | **MAJOR** | policyVersion 신규 | classifierVersion bump |
| CAS digest algorithm·projection 변경 | **MAJOR** | policyVersion 신규 | 기존 DryRunReport 무효 |
| reportingMode default 변경 | **MAJOR** | policyVersion 신규 | |
| read-only window writeClass 세분화·정책 변경 | **MAJOR** | policyVersion 신규 | |
| irreversible skip 정책 변경 | **MAJOR** | policyVersion 신규 | |
| writeSetManifest schema 변경 | **MAJOR** | policyVersion 신규 | |
| Run status enum·substate 변경 | **MAJOR** | policyVersion 신규 | |
| ApplyPreflightToken algorithm 변경 | **MAJOR** | policyVersion 신규 | |
| build/runtime/migration fail 룰 추가·강화 | **MAJOR** | 별개 | |
| runtime invariant·reconcile 룰 추가·강화 | MINOR | 별개 | |
| warning·지표·acceptance test 추가 | PATCH | 별개 | |

### 1.2 SoT 원칙

- 알림·audit canonical → notifications + REVIEW_WORKFLOW
- 자격증명·policyVersion·catalog refs → DATA_MODEL C-08 v0.22
- 페이지·콘텐츠·ComplianceRecord → DATA_MODEL Core
- 정책 재평가 → compliance-assistant `check()` (본 문서 § 4.8 batch contract SoT)
- 본 문서 = plan/step/파이프라인·rollbackClass·writeSetManifest·CAS digest·legalImpactClassifier rule·read-only writeClass·step registry 최소 계약·privacy·NotificationEvent mapping SoT

### 1.2.1 retry taxonomy

| 큐 | maxAttempts | backoff |
|---|---|---|
| ContentMigrationStepRetryQueue | config(기본 3) | [60, 600, 3600]s |
| ContentMigrationNotificationOutbox | 상수 5 | § 4.6 자체 SQL — backoff [60, 300, 1800, 7200, 21600]s |

### 1.3 본 문서가 다루지 않는 영역

| 영역 | 책임 |
|---|---|
| 외부 raw 수집·parsing·PII·promote | asset-ingestion |
| promote 이후 Core row 정렬·slug/redirect·검수 이력 승계·instance copy·policy 재평가 | 본 Feature |
| asset-ingestion body materialized view 직접 변경 | **금지** — raw source 또는 approved redaction op 경유만 |
| DB DDL | 인프라 |
| 알림 채널·재시도·digest | notifications |
| 운영자 검수 큐 상태 머신 | REVIEW_WORKFLOW (policy-reevaluate가 ComplianceRecord 재생성 시 새 lifecycle 진입) |
| 페이지·콘텐츠 schema 자체 | DATA_MODEL |

---

## 2. Feature 정의

### 2.1 기본 메타

```yaml
name: "content-migration"
specVersion: "0.4"
coreRequiresMin: "1.0.0"
implementationKind: "node-module"
activation: { scope: "instance", default: false }
```

### 2.2 의존성

| 영역 | 의존 |
|---|---|
| notifications | notify() 필수 |
| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 4종 NotificationEventType |
| REVIEW_WORKFLOW § 10.2.1 | 13종 AuditAction |
| DATA_MODEL C-08 v0.22 | `contentMigrationConfig`·`featureLegalApproved`·`piiFieldCatalogRef`·`entityFieldProjectionCatalogRef`·`contentMigrationPolicyVersion` |
| compliance-assistant § 3.3·§ 8 | check() + cacheKey |
| asset-ingestion | promote handoff + body MV 보호 |

### 2.3 InstanceManifest 통합

```yaml
contentMigrationConfig:                                 # DATA_MODEL C-08 v0.22
  featureLegalApproved: true
  featureLegalApprovedBy: "legal@glitzy.kr"
  featureLegalApprovedAt: "2026-05-10T00:00:00Z"
  defaultMode: "dry-run"
  approvalRequired:
    applicationDataVersionUpgrade: super-admin
    featureActivationBackfill: super-admin
    instanceToInstanceCopy: [super-admin, legal-reviewer]
    contentBulkTransform: super-admin
    policyVersionReevaluate: super-admin
    routingSlugPreservation: super-admin
  legalImpactClassifierRef: "lic-2026-05-15"
  piiFieldCatalogRef: "pii-cat-2026-05-15"              # CM3-05
  entityFieldProjectionCatalogRef: "efp-cat-2026-05-15" # CM3-05

contentMigrationPolicyVersion: "cm-2026-05-15"

features:
  - name: "content-migration"
    version: "0.4.0"
    enabled: true
    requiresFeature: [notifications]
    config:
      execution:
        maxParallelSteps: 5
        stepTimeoutSeconds: 3600
        readOnlyWindow:
          enabled: false
          allowedWriteClasses: ["audit-append", "notification-emit-outbox"]      # CM3-03 — dispatch 제거
          blockedWriteClasses: ["content-mutating", "workflow-state", "feature-operational", "notification-read-receipt", "notification-digest-state"]
          dispatchAllowlist:                            # CM3-03 — high/critical operational 이벤트만 즉시 dispatch 허용
            - "content-migration-run-failed"
            - "content-migration-rollback-triggered"
            - "content-migration-plan-legal-approved"
          dispatchOtherEventsQueueUntilWindowEnd: true
      retry:
        maxAttempts: 3
        backoffSeconds: [60, 600, 3600]
      rollback:
        autoRollbackOnFailure: false
        rollbackTimeoutSeconds: 7200
        retryExhaustedAction: "pause"
      dryRun:
        reportRetentionDays: 30
        impactSamplingMode: "deterministic-stratified"
        impactSamplingSize: 100

codex
초기 확인상 v0.5는 4차 지적 상당수를 문서 표면에는 반영했습니다. 이제 문제가 된 신규 메커니즘 네 곳과 DB 스키마 구간을 좁혀서, “반영됨”과 “아직 구현자가 해석해야 하는 부분”을 분리하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/features/content-migration.md'; (Get-Content "'$p)[560..660]' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/features/content-migration.md'; (Get-Content "'$p)[720..770]' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/features/content-migration.md'; (Get-Content "'$p)[1030..1095]' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/features/content-migration.md'; (Get-Content "'$p)[1190..1288]' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/admin/REVIEW_WORKFLOW.md'; (Get-Content "'$p)[455..525]; (Get-Content $p)[645..710]' in C:\Users\assag\solution\website-exposure
 succeeded in 657ms:
   - input.applyPreflightToken으로 server-side 8필드 재계산·비교 (§ 3.5)
   - DryRunReport expiresAt CAS
   - legalGateRequired=true 시 expectedLegalApprovalId 필요 — DryRunReport 일치 확인
   - **active run partial unique** (§ 12.4) → 동일 plan 동시 apply 차단 (CM3-12)
   - ContentMigrationRun insert (primaryStatus=running)
   - read-only window 적용 (§ 4.5)
   - step 순차 — writeSetManifest 기록
   - 알림 run-completed/run-failed
```

### 4.2 rollback

```
rollbackRun:
1. expectedStatus CAS
2. audit rollback-triggered + 알림 rollback-triggered
3. step 역순 처리:
   - reversible: reverseStep
   - compensating: compensatingStep
   - irreversible: **blocked-manual-remediation-required** 진입. 운영자 명시적 skipStep 호출 필요
4. 완료 → rollbackOutcome=full (skippedIrreversibleSteps=0) 또는 partial (skipped 있음)
5. rollback 실패 → rollbackOutcome=failed + super-admin alert
6. audit rollback-applied
```

### 4.3 pause / resume / cancel state transition + 3축 transition matrix (CM4-04)

#### 4.3.1 명령별 transition

| 호출 | primaryStatus 전제 | 동작 | 결과 (primary·remediation·rollbackOutcome) |
|---|---|---|---|
| pauseRun | running | step boundary 또는 cancellation point | paused·none·none |
| resumeRun | paused·none·none | 다음 step | running·none·none |
| cancelRun | pending | step 미진행 | cancelled·none·none |
| cancelRun | running·none | cooperative cancellation 요청. 종료 후 partial commit 검사. partial 발견 시 자동 rollback | cancelled·none·none / rolling-back·none·none |
| cancelRun | paused·none·none | 동일 partial commit 검사 | cancelled·none·none / rolling-back·none·none |
| rollbackRun | completed·failed·cancelled·paused (none·none) | reverse 시작 | rolling-back·none·none |
| (rollback 완료) | rolling-back·none | 모든 step reversible → full | rolled-back·none·**full** |
| (rollback 부분 완료) | rolling-back·none | irreversible 만남 | rolling-back·**blocked-manual-remediation-required**·none |
| skipStep | rolling-back·blocked-manual-remediation-required | step skipped 처리 | rolling-back·blocked-manual-remediation-required (skipped step 누적) → 모든 skipped 후 정리 시 rolled-back·none·**partial** |
| markStepCompensated (CM4-05) | rolling-back·blocked-manual-remediation-required | compensation 적용 표시 | rolling-back·blocked-manual-remediation-required → 정리 시 rolled-back·none·**partial** |
| pause + cooperative 미지원 timeout (§ 4.5 stepTimeoutSeconds 초과) | running·none | step row lock 해제 | running·**cancellation-timeout-manual-review**·none |
| abortRun (CM4-05) | running·cancellation-timeout-manual-review 또는 rolling-back·blocked-manual-remediation-required | 강제 종료 + 운영 ticket 필수 | failed·cancellation-timeout-manual-review·**failed** (rollback 시도 실패 또는 timeout) |

#### 4.3.2 3축 invariant (DB CHECK — § 12.4)

```sql
CHECK (
  CASE primary_status
    WHEN 'pending' THEN remediation_status='none' AND rollback_outcome='none'
    WHEN 'running' THEN rollback_outcome='none'
    WHEN 'paused' THEN remediation_status='none' AND rollback_outcome='none'
    WHEN 'completed' THEN remediation_status='none' AND rollback_outcome='none'
    WHEN 'failed' THEN rollback_outcome IN ('none','failed')
    WHEN 'cancelled' THEN remediation_status='none' AND rollback_outcome='none'
    WHEN 'rolling-back' THEN rollback_outcome='none'
    WHEN 'rolled-back' THEN rollback_outcome IN ('full','partial')
    ELSE FALSE
  END
)
```

**partial-rollback은 별도 primaryStatus 아님** (CM4-04 정정) — `primaryStatus='rolled-back' + rollbackOutcome='partial'`로 표현.

### 4.4 retry exhausted vs autoRollbackOnFailure 우선순위 (CM3-16 풀 전개)

| 조건 | 동작 |
|---|---|
| step retry exhausted + partial write 감지 | rollback 우선 (autoRollbackOnFailure 무시) → rolling-back |
| step retry exhausted + partial write 없음 + `retryExhaustedAction=pause` | paused + super-admin alert |
| step retry exhausted + partial write 없음 + `retryExhaustedAction=rollback-then-pause` | rolling-back 완료 후 paused |
| step retry exhausted + partial write 없음 + `retryExhaustedAction=rollback` | rolling-back → rolled-back |
| step retry exhausted + partial write 없음 + `autoRollbackOnFailure=true` | rollback 우선 |

### 4.5 read-only window writeClass (CM3-03 dispatch 정정)

| writeClass | 정의 | 정책 |
|---|---|---|
| `content-mutating` | Core 콘텐츠 row 변경 | 차단 |
| `workflow-state` | REVIEW_WORKFLOW 상태 전이 | 큐잉 |
| `feature-operational` | asset promote·crm conflict resolve 등 | 차단 |
| `notification-emit-outbox` | NotificationEvent emit + outbox insert | 허용 |
| `notification-dispatch` | notify() 외부 발송 (email·slack·webhook) | **dispatchAllowlist 이벤트만 즉시 허용** (CM3-03). 다른 이벤트는 nextAttemptAt 밀어 큐잉 |
| `notification-read-receipt` | inApp 읽음 표시 | 큐잉 |
| `notification-digest-state` | digest 집계 | 큐잉 |
| `audit-append` | append-only audit | 허용 |

`dispatchAllowlist` default: `content-migration-run-failed`·`content-migration-rollback-triggered`·`content-migration-plan-legal-approved` (CM3-03).

### 4.6 outbox SQL (CM3-14 — nextAttemptAt + exhausted)

```sql
-- claim
WITH next AS (
  SELECT id FROM content_migration_notification_outbox
  WHERE status='pending' AND next_attempt_at <= now()
    AND (locked_at IS NULL OR locked_at < now() - interval '5 minutes')
  ORDER BY next_attempt_at FOR UPDATE SKIP LOCKED LIMIT 1
)
UPDATE content_migration_notification_outbox o
SET status='processing', locked_at=now(), locked_by=$worker, attempts=attempts+1, last_attempt_at=now()

 succeeded in 646ms:
   - previousRiskLevel = 기존 ComplianceRecord의 inferredRiskLevel snapshot
   - newRiskLevel = check() result
   - riskDelta·priorReviewRequiredChanged·legalEntityChanged 산정
5. forcedReportingMode 결정 (CM4-08):
   - riskDelta=increased + newRiskLevel ∈ ("high"·"critical") → new-record-version 강제
   - priorReviewRequiredChanged=true → new-record-version 강제
   - **legalSensitiveEntityChanged=true** (LegalDocument·ReviewPolicy·PricingPage·전후사진·후기 contentType class diff) → new-record-version 강제
   - **legalEntityIdentityChanged=true** (법인명·소속·법적 식별자 변경) → new-record-version 강제
   - 그 외 → stale-flags-only 허용
6. override 검사:
   - config.policyVersionReevaluate.overrideAllowed=["new-record-version"]만 default 허용
   - stale-flags-only override는 `staleFlagsOnlyOverrideConditions` (maxRiskLevel=low + no legal entity change + no priorReview change) CHECK 통과 시만 (CM3-15)
7. ContentMigrationPolicyReevaluateBatch row 갱신: checked·cacheHit·skippedNoChange·changed·error 카운트
8. per-record resultRef는 ContentMigrationPolicyReevaluateRecord row에 저장 (§ 12.9.1)
9. sourceEventId = hash("content-migration:policy-reevaluate:" + planId + ":" + complianceRecordId)
```

---

## 5. 알림 (CM3-16 풀 전개)

### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT)

| eventType | criticality | 채널 | recipients |
|---|---|---|---|
| `content-migration-plan-legal-approved` | high | email + inApp | super-admin |
| `content-migration-run-completed` | normal | inApp | super-admin |
| `content-migration-run-failed` | **critical** | email + inApp | super-admin |
| `content-migration-rollback-triggered` | high | email + inApp | super-admin |

### 5.2 outbox — § 4.6 SQL

### 5.3 NotificationEvent 매핑

| eventType | sourceKind | sourceId | sourceEventId |
|---|---|---|---|
| `content-migration-plan-legal-approved` | `plan` | planId | `hash("content-migration:plan:" + planId + ":legal-approved")` |
| `content-migration-run-completed` | `run` | runId | `hash("content-migration:run:" + runId + ":completed")` |
| `content-migration-run-failed` | `run` | runId | `hash("content-migration:run:" + runId + ":failed")` |
| `content-migration-rollback-triggered` | `run` | runId | `hash("content-migration:run:" + runId + ":rollback-triggered")` |

---

## 6. 운영 지표 + acceptance test invariant

### 6.1 핵심 지표

| 지표 | 정의 | 목표 |
|---|---|---|
| plan 성공율 | success / 전체 | > 99% |
| ApplyPreflightToken mismatch 차단율 | 100% | |

 succeeded in 645ms:

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `runId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `startedAt`·`endedAt` | Date | ✅·optional |
| `blockedWriteAttempts` | integer | ✅ default 0 |
| `queuedDispatchCount` | integer | ✅ default 0 |
| `active` | boolean | ✅ |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(runId) WHERE active=true`.
**Index**: `(active, started_at DESC)`.

### 12.9 `ContentMigrationPolicyReevaluateBatch`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `runId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `planId` | UUID | ✅ — FK |
| `checked`·`cacheHit`·`skippedNoChange`·`changed`·`error` | integer | ✅ |
| `startedAt`·`completedAt` | Date | ✅·optional |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(runId)`.

#### 12.9.1 `ContentMigrationPolicyReevaluateRecord`

(별도 row per ComplianceRecord) — CM3-04 PolicyReevaluateResult 기록:

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `batchId` | UUID | ✅ — FK § 12.9 |
| `complianceRecordId` | UUID | ✅ |
| `cachedResultRef` | UUID | optional |
| `previousRiskLevel`·`newRiskLevel` | enum | ✅ |
| `riskDelta` | enum (decreased·unchanged·increased) | ✅ |
| `priorReviewRequiredChanged`·`legalEntityChanged` | boolean | ✅ |
| `forcedReportingMode` | enum (stale-flags-only·new-record-version) | ✅ |
| `forcedReportingModeReason` | string | optional |
| `newComplianceRecordId` | UUID | optional (new-record-version 적용 시) |

**Constraints**: `UNIQUE(batchId, complianceRecordId)`.

### 12.10 `ContentMigrationNotificationOutbox` (CM3-14)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `sourceKind` | enum (plan·run) | ✅ |
| `sourceId` | string | ✅ |
| `eventType` | enum (NotificationEventType 4종) | ✅ |
| `sourceEventId` | char(64) | ✅ |
| `payload` | JSON | ✅ |
| `status` | enum (pending·processing·sent·permanent) | ✅ |
| `attempts` | integer | ✅ default 0 |
| `nextAttemptAt` | Date | ✅ |
| `lastAttemptAt`·`sentAt` | Date | optional |
| `lockedAt`·`lockedBy` | Date·string | optional |
| `lastError` | string | optional |
| `createdAt` | Date | ✅ |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(sourceEventId)`. `UNIQUE(sourceKind, sourceId, eventType)`.
**Index**: `(status, next_attempt_at) WHERE status='pending'`, `(expiresAt)`.

---

### 12.11 `ContentMigrationActiveTargetLock` (CM4-06·07 신설)

dry-run·apply 동시성 차단 — `(instanceId, targetSetDigest, writeSetScopeDigest)` 단위로 active state lock.

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `targetSetDigest` | char(64) | ✅ |
| `writeSetScopeDigest` | char(64) | ✅ — step writeSetProjection canonical hash |
| `runId` | UUID | optional — apply Run 진행 중일 때 채움. FK § 12.4 |
| `dryRunPlanId` | UUID | optional — dry-run 진행 중일 때 채움. FK § 12.1 |
| `kind` | enum (`apply`·`dry-run`) | ✅ |
| `acquiredAt` | Date | ✅ |
| `expiresAt` | Date | ✅ — heartbeat 갱신. cleanup worker가 stale 회수 |

**Constraints**:
- `UNIQUE(instanceId, targetSetDigest, writeSetScopeDigest)` — 동일 target/write scope에 active lock 1개만
- `CHECK ((kind='apply' AND run_id IS NOT NULL AND dry_run_plan_id IS NULL) OR (kind='dry-run' AND run_id IS NULL AND dry_run_plan_id IS NOT NULL))`
- `FK runId ON DELETE CASCADE`·`FK dryRunPlanId ON DELETE CASCADE`

**Index**: `(expires_at)` — cleanup. `(instance_id, target_set_digest)`.

**획득·해제 protocol**:
- runDryRun·runApply 시작 시 lock 획득 (timeout 60초). 실패 → 409 conflict
- run 완료/cancelled/rolled-back/aborted 또는 dry-run 완료 시 lock 해제
- heartbeat: 진행 중인 worker가 expiresAt을 5분 단위로 갱신
- stale (expiresAt 도래) → cleanup worker가 해제 + sink alert


 succeeded in 651ms:
어드민에 별도 "사전심의 대기" 큐 — 제출 후 결과 도착 전 콘텐츠 표시. `priorReviewSubmissionId` 기준 외부 시스템 추적.

---

## 9. 알림 (notifications Feature Module 인터페이스)

본 문서는 알림 **인터페이스·정책 SoT** — 이벤트 enum·페이로드 타입·이벤트별 채널/우선순위 정책 정의. 실제 발송 구현·재시도·dedupe·digest 큐 등 구현 영역은 `features/notifications.md`.

### 9.1 NotificationEventType enum (canonical SoT)

```ts
type NotificationEventType =
  | "content-gate-queued"           // content-gate 큐 진입
  | "blocked-correction-required"   // automatedDecision="block" fail 발생 — 작성자 정정 요청
  | "stale-queued"                  // stale 큐 진입
  | "warning-queued"                // warning 큐 진입
  | "prior-review-result"           // 사전심의 결과 도착
  | "reviewer-approved"             // 검수자 approve
  | "reviewer-rejected"             // 검수자 reject
  | "publish"                       // 발행 완료
  | "sla-imminent"                  // SLA 24시간 전
  | "sla-overdue"                   // SLA 미달
  // `features/analytics-reporting.md` 1차 cycle cascade (F-2)
  | "analytics-report-ready"        // 리포트 생성 완료·발송
  | "media-threshold-reached"       // 의료법 일평균 이용자 10만 임계 도달 (false → true 전이만)
  | "media-threshold-released"      // 임계 해제 (true → false 전이만, hysteresis 적용)
  // `features/search-visibility.md` 1차 cycle cascade (F-1)
  | "search-visibility-anomaly-critical"     // critical severity anomaly
  | "search-visibility-anomaly-warning"      // warning severity anomaly
  | "search-visibility-monitoring-failed"    // 모니터링 cycle 실패 (모든 source)
  | "ai-briefing-citation-first-detected"    // siteDomain AI 브리핑 인용 첫 등장
  | "ai-briefing-citation-lost"               // 기존 AI 브리핑 인용 N일 연속 미노출
  // `features/keyword-monitoring.md` 1차 cycle cascade (F-1)
  | "keyword-monitoring-rank-improved"        // 사용자 지정 키워드 평균 순위 개선
  | "keyword-monitoring-rank-dropped"         // 평균 순위 하락
  | "keyword-monitoring-impressions-spike"    // 노출수 급증
  | "keyword-monitoring-impressions-drop"     // 노출수 급감
  | "keyword-monitoring-ctr-anomaly"          // CTR 이상 변동
  | "keyword-monitoring-rank-bucket-improved" // rank bucket 상위 진입
  | "keyword-monitoring-rank-bucket-dropped"  // rank bucket 하위 이탈·absent
  | "keyword-monitoring-monitoring-failed"    // 모니터링 cycle 실패
  // `features/asset-ingestion.md` 1차 cycle cascade (F-2)
  | "asset-ingestion-batch-completed"         // 수집 완료
  | "asset-ingestion-batch-failed"            // 수집 실패
  | "asset-ingestion-review-required"         // 검수 큐 진입
  | "asset-ingestion-pii-detected"            // PII 감지 (의료 도메인 critical)
  | "asset-ingestion-asset-promoted"          // Core 데이터 계약 변환 완료
  // `features/crm-sync.md` 1차 cycle cascade (CS1-01)
  | "crm-sync-batch-failed"                   // sync cycle 실패
  | "crm-sync-conflict-detected"              // 양방향 sync 충돌
  | "crm-sync-credential-expired"             // CRM 자격증명 만료
  | "crm-sync-credential-expiring-soon"       // 만료 14일 전
  // `features/content-migration.md` 1차 cycle cascade (CM1-01·10)
  | "content-migration-plan-legal-approved"   // plan legal-reviewer 승인 (의미 분리 — CM1-10)
  | "content-migration-run-completed"
  | "content-migration-run-failed"
  | "content-migration-rollback-triggered";
```

### 9.1.1 이벤트 정책 매트릭스 (canonical SoT)

이벤트별 수신자·즉시 채널·digest 주기·critical 분류·quietHours·opt-out 정책의 **단일 정의표**. § 3.3 우선순위·SLA의 "권장 알림" 컬럼은 본 표를 따른다.

| eventType | 한국어 이벤트명 | 수신자 산정 | 즉시 채널 | fallback 채널 (hard-suppressed 시) | digest 주기 | criticality | quietHoursPolicy | optOutPolicy |
|---|---|---|---|---|---|---|---|---|
| `content-gate-queued` | content-gate 큐 진입 | finalRoles[] 매칭 검수자 (operator + 등급 기본 medical + 룰 추가 역할 합집합) | email + slack + inApp | inApp | — | **critical** | bypass (보류 안 함) | mandatory (옵트아웃 불가) |
| `blocked-correction-required` | blocked 정정 요청 | 작성자 + operator | email + slack + inApp | inApp | — | **critical** | bypass | mandatory |
| `stale-queued` | stale 큐 진입 | `staleFlags.<role>=true` 매칭 검수자 | inApp | (없음 — inApp만) | email — 의료법 개정은 일일, 기타는 주간 | high | respect (사용자 quietHours 보류) | digestOptOut 허용 (단 의료법 개정 stale은 mandatory) |
| `warning-queued` | warning 큐 진입 | operator | inApp | (없음) | email 일일 요약 | normal | respect | digestOptOut 허용 |
| `prior-review-result` | 사전심의 결과 도착 | 운영자 + legal 검수자 | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `reviewer-approved` | 검수자 approve | 작성자 + 운영자 | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
  fromState?: ContentWorkflowState;
  toState?: ContentWorkflowState;
  metadata: object;             // 액션별 컨텍스트 (예: rejectReason·legalCounselNote·notificationEventId)
};
```

#### 10.2.1 AuditAction enum

```ts
type AuditAction =
  | "approve" | "reject" | "request-changes" | "delegate"
  | "publish" | "unpublish"
  | "stale-triggered" | "stale-resolved"
  | "compliance-record-updated"
  | "permission-changed" | "login" | "logout"
  | "notification-dispatched"               // 알림 발송 envelope 종료 요약
  | "notification-resend-attempted"         // DLQ에서 운영자 수동 재발송 시도 (`features/notifications.md` § 7.2)
  | "notification-read"                      // 사용자가 inApp 알림 클릭·읽음 마킹 시 (`features/notifications.md` § 5.3)
  | "notification-suppression-unsuppressed"   // 운영자가 hard-suppressed AdminUser 채널을 수동 해제 (`features/notifications.md` § 7.4)
  | "search-visibility-retroactive-enqueue-requested"   // 운영자가 search-visibility retroactive outbox enqueue 명시 액션 (`features/search-visibility.md` § 7.5)
  // `features/keyword-monitoring.md` 1차 cycle cascade (F-15)
  | "keyword-tracking-target-registered"      // 키워드 추적 등록 (operator·super-admin)
  | "keyword-tracking-target-unregistered"    // 추적 해제 (soft delete — active=false)
  | "keyword-anomaly-resolution-updated"      // KeywordAnomalyRecord.resolutionStatus 갱신
  | "keyword-monitoring-retroactive-enqueue-requested"   // 운영자 retroactive outbox enqueue 명시 액션
  | "keyword-tracking-target-migrated-v02-v03"           // v0.2→v0.3 데이터 모델 migration (`features/keyword-monitoring.md` § 10.3)
  // `features/asset-ingestion.md` 1차 cycle cascade (F-4)
  | "asset-ingestion-source-registered"       // IngestionSource 등록
  | "asset-ingestion-source-unregistered"     // soft delete
  | "asset-ingestion-asset-promoted"          // Core 데이터 계약 변환
  | "asset-ingestion-asset-rejected"          // 검수 거부
  | "asset-ingestion-pii-redacted"            // PII 자동·수동 redaction
  // `features/crm-sync.md` 1차 cycle cascade (CS1-01·16)
  | "crm-integration-registered"              // CRM 연동 등록
  | "crm-integration-unregistered"            // soft delete
  | "crm-sync-conflict-resolved"              // 충돌 운영자 해결
  | "crm-credential-rotated"                  // 자격증명 rotation
  // `features/crm-sync.md` 3차 cycle cascade (CS3-11)
  | "crm-rrn-false-positive-recovered"        // RRN false positive 복구 (recoverRrnFalsePositive override-and-fetch)
  | "crm-rrn-rejection-finalized"             // RRN 복구 포기·확정 (abandon)
  | "crm-consent-withdrawal-applied"          // 환자 동의 철회 적용 (displayHints nulling + sync skip) — CS3-05
  // `features/content-migration.md` 1차·3차 cycle cascade (CM1-02·10·CM3-01)
  | "content-migration-plan-defined"          // plan 정의
  | "content-migration-plan-validated"        // plan 검증
  | "content-migration-plan-legal-approved"   // legal-reviewer 승인 게이트
  | "content-migration-dry-run-completed"     // CM3-01 — DryRunReport 완료
  | "content-migration-run-started"           // apply 실행 시작
  | "content-migration-run-paused"            // CM3-01
  | "content-migration-run-resumed"           // CM3-01
  | "content-migration-rollback-triggered"    // CM3-01 — rollback 시작
  | "content-migration-run-completed"
  | "content-migration-run-failed"
  | "content-migration-run-cancelled"
  | "content-migration-rollback-applied"
  | "content-migration-step-skipped"          // irreversible step skip
  | "content-migration-step-compensated"      // CM4-05 — markStepCompensated
  | "content-migration-run-aborted";          // CM4-05 — abortRun
```

> 알림 발송의 channel별 attempt·재시도·DLQ·deduped 이력은 audit log에 누적하지 않는다 (운영 노이즈 회피). `features/notifications.md` § 9.2 NotificationLog가 운영 메트릭 SoT. audit log는 envelope 단위 요약·재발송 액션·읽음 액션만 기록.

### 10.3 불변성·보존

- audit log는 **append-only** — 수정·삭제 불가
- 보존 기간: 최소 7년 (의료법 광고 기록 보관 권장 + 일반 사업 감사 요건)
- 외부 export — JSON·CSV 형식 (운영 정책별)

 succeeded in 680ms:
| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `planId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `planFingerprint`·`targetSetDigest`·`contentHashDigest`·`sourceSnapshotWatermark`·`policyVersionSnapshot`·`stepRegistryVersion`·`legalImpactClassificationDigest`·`classifierVersion` | char(64)/string | ✅ (8필드) |
| `applyPreflightToken` | char(64) | ✅ |
| `samplingStats` | JSON | ✅ |
| `blockedDriftCount` | integer | ✅ |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(planId, applyPreflightToken)`. `UNIQUE(applyPreflightToken)`.
**Index**: `(planId, generatedAt DESC)`, `(expiresAt)`.

### 12.3 `ContentMigrationLegalApproval` (CM3-13)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `planId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `dryRunReportId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `classificationSnapshot` | JSON | ✅ |
| `classificationSnapshotDigest` | char(64) | ✅ |
| `approvedDigestBundleHash` | char(64) | ✅ — 8필드 bundle |
| `policyVersionSnapshot` | string | ✅ |
| `classifierVersion` | string | ✅ |
| `approvedBy`·`approvedAt` | string·Date | ✅ |
| `legalHold` | boolean | ✅ default true |
| `expiresAt` | Date | optional — legalHold=true 시 null |

**Constraints**: `UNIQUE(planId, classificationSnapshotDigest)`. `UNIQUE(planId, dryRunReportId)`.
**Index**: `(planId, approvedAt DESC)`.

### 12.4 `ContentMigrationRun` (CM3-11·CM3-12)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `planId` | UUID | ✅ — FK |
| `dryRunReportId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `expectedLegalApprovalId` | UUID | optional (legalGateRequired=true 시 ✅) — FK |
| `idempotencyKey`·`requestFingerprint` | string·char(64) | ✅ |
| `primaryStatus` | enum (pending·running·paused·completed·failed·cancelled·rolling-back·rolled-back) | ✅ |
| `remediationStatus` | enum (none·blocked-manual-remediation-required·cancellation-timeout-manual-review) | ✅ default none |
| `rollbackOutcome` | enum (none·full·partial·failed) | ✅ default none |
| **CHECK** | § 4.3.2 3축 invariant DB CHECK (CM4-04) | |
| `solutionVersion` | integer | ✅ — CAS |
| `lockedAt`·`lockedBy` | Date·string | optional |
| `mode` | enum (dry-run·apply) | ✅ |
| `startedAt`·`completedAt` | Date | ✅·optional |
| `expiresAt` | Date | ✅ |

**Constraints**:
- `UNIQUE(planId, idempotencyKey)`
- `UNIQUE(planId) WHERE primary_status IN ('pending','running','paused','rolling-back') OR remediation_status != 'none'` (CM3-12)
**Index**: `(primary_status, started_at DESC)`, `(expiresAt)`.

### 12.5 `ContentMigrationStepResult` (CM3-20 closed schema)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `runId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `stepKey` | string | ✅ |
| `stepType` | string | ✅ |
| `status` | enum (pending·processing·success·failed-transient·failed-permanent·skipped·rolled-back) | ✅ |
| `inputSummary` | JSON (closed — § 3.8) | ✅ |

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "content-migration-plan-legal-approved|content-migration-run-completed|content-migration-run-failed|content-migration-rollback-triggered|content-migration-step-compensated|content-migration-run-aborted" docs/admin/REVIEW_WORKFLOW.md docs/features/content-migration.md docs/features/notifications.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/features/content-migration.md'; (Get-Content "'$p)[405..440]; (Get-Content $p)[455..515]; (Get-Content $p)[840..920]' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/features/content-migration.md'; (Get-Content "'$p)[1110..1190]' in C:\Users\assag\solution\website-exposure
 succeeded in 565ms:
docs/admin/REVIEW_WORKFLOW.md:509:  | "content-migration-plan-legal-approved"   // plan legal-reviewer 승인 (의미 분리 — CM1-10)
docs/admin/REVIEW_WORKFLOW.md:510:  | "content-migration-run-completed"
docs/admin/REVIEW_WORKFLOW.md:511:  | "content-migration-run-failed"
docs/admin/REVIEW_WORKFLOW.md:512:  | "content-migration-rollback-triggered";
docs/admin/REVIEW_WORKFLOW.md:556:| `content-migration-plan-legal-approved` | content-migration plan legal 승인 | super-admin | email + inApp | inApp | — | high | respect | mandatory |
docs/admin/REVIEW_WORKFLOW.md:557:| `content-migration-run-completed` | content-migration apply 완료 | super-admin | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
docs/admin/REVIEW_WORKFLOW.md:558:| `content-migration-run-failed` | content-migration apply 실패 | super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
docs/admin/REVIEW_WORKFLOW.md:559:| `content-migration-rollback-triggered` | rollback 실행 | super-admin | email + inApp | inApp | — | high | respect | mandatory |
docs/admin/REVIEW_WORKFLOW.md:690:  | "content-migration-plan-legal-approved"   // legal-reviewer 승인 게이트
docs/admin/REVIEW_WORKFLOW.md:695:  | "content-migration-rollback-triggered"    // CM3-01 — rollback 시작
docs/admin/REVIEW_WORKFLOW.md:696:  | "content-migration-run-completed"
docs/admin/REVIEW_WORKFLOW.md:697:  | "content-migration-run-failed"
docs/admin/REVIEW_WORKFLOW.md:701:  | "content-migration-step-compensated"      // CM4-05 — markStepCompensated
docs/admin/REVIEW_WORKFLOW.md:702:  | "content-migration-run-aborted";          // CM4-05 — abortRun
docs/features/content-migration.md:152:            - "content-migration-run-failed"
docs/features/content-migration.md:153:            - "content-migration-rollback-triggered"
docs/features/content-migration.md:154:            - "content-migration-plan-legal-approved"
docs/features/content-migration.md:224:| 실행 | `approvePlanLegalGate` | legal-reviewer 게이트 | legal-reviewer | `content-migration-plan-legal-approved` | `content-migration-plan-legal-approved` |
docs/features/content-migration.md:229:| 실행 | `rollbackRun` | scope: full/from-step | super-admin | `content-migration-rollback-triggered` (요청)·`content-migration-rollback-applied` (완료) | `content-migration-rollback-triggered` |
docs/features/content-migration.md:231:| 실행 | `markStepCompensated` (CM4-05) | manual remediation compensation 적용 표시 | super-admin + remediationTicketRef | `content-migration-step-compensated` | — |
docs/features/content-migration.md:232:| 실행 | `abortRun` (CM4-05) | cancellation-timeout 또는 blocked-manual-remediation 강제 종료 | super-admin + remediationTicketRef + 운영 ticket | `content-migration-run-aborted` | `content-migration-run-failed` |
docs/features/content-migration.md:233:| 실행 (system) | run completion | run 완료 시 | system | `content-migration-run-completed` 또는 `content-migration-run-failed` | 동일 |
docs/features/content-migration.md:246:| `content-migration-plan-legal-approved` | approvedBy·approvedAt·classificationSnapshot·planFingerprint·legalImpactClassificationDigest·policyVersionSnapshot·dryRunReportId·approvedDigestBundleHash |
docs/features/content-migration.md:251:| `content-migration-run-completed` | result·changedRecords·failedSteps·rollbackTriggered·skippedIrreversibleStepCount |
docs/features/content-migration.md:252:| `content-migration-run-failed` | failedStepKey·errorClass·partialWriteDetected·writeSetManifestRef |
docs/features/content-migration.md:254:| `content-migration-rollback-triggered` | runId·scope·reason·expectedStatus·triggeredBy |
docs/features/content-migration.md:648:`dispatchAllowlist` default: `content-migration-run-failed`·`content-migration-rollback-triggered`·`content-migration-plan-legal-approved` (CM3-03).
docs/features/content-migration.md:746:| `content-migration-plan-legal-approved` | high | email + inApp | super-admin |
docs/features/content-migration.md:747:| `content-migration-run-completed` | normal | inApp | super-admin |
docs/features/content-migration.md:748:| `content-migration-run-failed` | **critical** | email + inApp | super-admin |
docs/features/content-migration.md:749:| `content-migration-rollback-triggered` | high | email + inApp | super-admin |
docs/features/content-migration.md:757:| `content-migration-plan-legal-approved` | `plan` | planId | `hash("content-migration:plan:" + planId + ":legal-approved")` |
docs/features/content-migration.md:758:| `content-migration-run-completed` | `run` | runId | `hash("content-migration:run:" + runId + ":completed")` |
docs/features/content-migration.md:759:| `content-migration-run-failed` | `run` | runId | `hash("content-migration:run:" + runId + ":failed")` |
docs/features/content-migration.md:760:| `content-migration-rollback-triggered` | `run` | runId | `hash("content-migration:run:" + runId + ":rollback-triggered")` |

 succeeded in 574ms:
| `rollbackRun` | `(runId, idempotencyKey)` UNIQUE | HMAC(... runId + scope + fromStepKey + expectedStatus + reason hash) |
| `skipStep` | `(stepResultId, idempotencyKey)` UNIQUE | HMAC(... stepResultId + rollbackClass + remediationTicketRef + affectedRowsConfirmation) |
| `pauseRun`·`resumeRun`·`cancelRun`·`approvePlanLegalGate` | `(targetId, idempotencyKey)` UNIQUE | HMAC(... targetId + 핵심 input) |

same-request replay → 기존 결과. mismatched → 409 + audit/sink alert.

### 3.5 ApplyPreflightToken (CM3-09 + CM4-01·02 정정)

```
runDryRun(planId) 완료 후 server:
1. DryRunReport row insert — 8필드 digest 포함 + digestComputationMode·invalidationInputs 기록 (CM4-02)
2. applyPreflightToken = HMAC(applyPreflightTokenPepperRef, planId + ":" + dryRunReportId + ":" + 8필드 bundle canonical) char(64) opaque
3. client에 (dryRunReportId, applyPreflightToken) 둘 다 반환

runApply(input) — server:
1. (input.planId, input.dryRunReportId)로 DryRunReport row lookup (CM4-01 — token opaque)
2. token 재계산 비교 — 불일치 시 → 401/CAS fail
3. expiresAt(retentionDays.dryRunReport) 초과 시 → re-dry-run 강제 (CAS fail)
4. **digestComputationMode별 invalidation precheck** (CM4-02):
   - mode="full": 8필드 모두 server-side 재계산 → 비교
   - mode="snapshot": targetSetDigest·contentHashDigest는 snapshot 사용 (재계산 skip). policyVersionSnapshot·classifierVersion·catalog refs만 재계산
   - mode="cache": invalidationInputs(policyVersionSnapshot·classifierVersion·ruleFileHashes·catalogRefs) 변경 감지 → 변경된 경우만 해당 field 재계산
5. 어느 모드든 invalidationInputs change 발견 → CAS fail (token mismatch)
```

### 3.6 step type registry 최소 계약 (CM2-17 + CM3-02·CM3-10)

```ts
type StepTypeContract = {
  stepType: string;
  inputSchema: JsonSchema;                              // strict — additionalProperties=false
  outputSchema: JsonSchema;
  targetEntityTypes: EntityTypeEnum[];                  // CM3-05 — DATA_MODEL entity enum
  readSetProjection: FieldProjection[];                 // entityFieldProjectionCatalogRef 통과
  writeSetProjection: FieldProjection[];                // 동일
  rollbackClassDefault: RollbackClass;
type PartialWriteStrategy =
  | { kind: "small-rowid-merkle"; maxRows: number }
  | { kind: "chunked-returning"; chunkSize: number }
  | { kind: "append-only-watermark";
      watermarkField: string;
      lowerBound: string;                                // CM4-03 — 시작 watermark
      exclusiveUpperBound: string;                       // CM4-03
      sourcePredicateHash: string;                       // CM4-03 — predicate canonical hash
      writerIdField: string;                             // CM4-03 — `migration_run_id` 등 본 run row 식별
      expectedInsertedCount: number;                     // CM4-03
      concurrencyMode: "serializable" | "advisory-lock-range";  // CM4-03 — phantom row 방지
    }
  | { kind: "deterministic-transform"; expectedAfterProjectionFn: string };
```

asset-ingestion `ExtractedContent.body` MV는 default `mutableFieldDenylist`.

### 3.7 writeSetManifest (CM2-06 + CM3-10)

각 step 실행 시 StepResult에 기록:

```ts
type WriteSetManifest = {
  strategy: PartialWriteStrategy["kind"];
  expectedAffectedRows: number;
  actualAffectedRows: number;
  beforeDigest?: string;                                // small-rowid-merkle만 사용
  afterDigest?: string;
  committedRowIds?: string[];                            // small
  chunkIds?: string[];                                   // chunked-returning
  highWatermark?: { before: string; after: string };    // append-only-watermark
  expectedAfterProjectionHash?: string;                  // deterministic-transform
  actualAfterProjectionHash?: string;
  transactionBoundary: "per-row" | "per-chunk" | "per-step";
  compensationStatus: "not-needed" | "pending" | "applied" | "failed";
  invariantQueryResults: Array<{ name: string; passed: boolean }>;
  isolationLevel: "read-committed" | "repeatable-read" | "serializable";
};
```

partial write 감지 트리거 (strategy별):
- `small-rowid-merkle`: beforeDigest + expected → afterDigest 불일치
- `chunked-returning`: actualAffectedRows ≠ expectedAffectedRows 또는 invariantQueryResults에 fail
- `append-only-watermark` (CM4-03):
  - watermark 역행
  - actualInsertedCount ≠ expectedInsertedCount
  - `[lowerBound, exclusiveUpperBound)` 범위에 writerId ≠ 본 run row 발견 (phantom row)
  - concurrencyMode=serializable일 때 isolation level 미적용 → step abort
  - concurrencyMode=advisory-lock-range일 때 `pg_advisory_xact_lock(hashtext('cm:append:' + watermarkField + ':' + lowerBound))` 미획득 → step abort
- `deterministic-transform`: actualAfterProjectionHash ≠ expectedAfterProjectionHash

### 3.8 read API privacy class (CM3-20 — StepResult schema)

```ts
type StepResultRow = {
  id: string;
  runId: string;
  stepKey: string;
  status: StepResultStatus;
  inputSummary: ClosedSchemaSummary;                    // PII 미포함 요약 (필드 token + masked value)
  outputSummary: ClosedSchemaSummary;
| INV-PRIVACY-EXPORT | non-pii step export → 허용 | pii step + export_allowed=true insert 시도 → DB CHECK reject |
| INV-DDL-BOUNDARY | DDL precondition read-only → 정상 | DDL 실행 시도 → validate fail |
| INV-BODY-MV | mutableFieldDenylist 통과 → 정상 | body MV 변경 시도 → validate fail |
| INV-RUN-ACTIVE-UNIQUE | 동일 plan apply 1회 → 정상 | 동일 plan 동시 apply → 두 번째 409 |
| INV-CATALOG-VALIDATION | piiFieldCatalog cross-validate 통과 → 정상 | catalog 미매칭 step → validate fail |
| **INV-ACTIVE-TARGET-LOCK** (CM4-06·07) | 다른 targetSetDigest plan 동시 apply → 정상 | 동일 targetSetDigest plan 동시 apply → 두 번째 409 |
| **INV-RUN-STATUS-3AXIS** (CM4-04) | primaryStatus=rolled-back + rollbackOutcome=full → 정상 | primaryStatus=rolled-back + rollbackOutcome=none → CHECK reject |
| **INV-APPEND-ONLY-PHANTOM** (CM4-03) | [lowerBound, upperBound) 범위 + 본 writerId만 → 정상 | 다른 writerId row 발견 → step abort |
| **INV-LEGAL-ENTITY-DISCRIMINATE** (CM4-08) | legalSensitiveEntityChanged=false + legalEntityIdentityChanged=false + low risk → stale-flags-only override | legalSensitiveEntityChanged=true → new-record-version 강제 |
| **INV-DISPATCH-DRIFT** (CM4-13) | dispatchAllowlistPolicySnapshot = REVIEW_WORKFLOW 현재 hash → build ok | snapshot mismatch → build fail |

---

## 7. compliance-assistant 예외

ContentMigrationPlan·DryRunReport·StepResult는 `check()` 대상 아님. plan kind 정의가 콘텐츠 아님.

`policy-version-reevaluate` 실행 결과로 ComplianceRecord 재생성 시 새 record는 REVIEW_WORKFLOW § 8 lifecycle 진입 (개별 콘텐츠 contentType 유지). `contentType` 예외 cascade 불필요.

---

## 8. 설치·설정 — DB 10 tables (§ 12)

---

## 9. 빌드·런타임·migration·invariant 검증

### 9.1 build-time fail

- `enabled=true` + `contentMigrationConfig` 누락
- `contentMigrationPolicyVersion` 누락
- **`featureLegalApproved !== true`** + 승인자/시각 누락 (CM3-08)
- `requiresFeature: notifications` 충족 안 됨
- `approvalRequired.*` 6종 모두 누락
- `legalImpactClassifierRef`·**`piiFieldCatalogRef`·`entityFieldProjectionCatalogRef`** 누락 (CM3-05)
- `policyVersionReevaluate.concurrencyLimit` ≤ 0
- `policyVersionReevaluate.defaultReportingMode` ∉ enum
- `policyVersionReevaluate.overrideAllowed` ∉ {`new-record-version`, `stale-flags-only`}
- **`readOnlyWindow.dispatchAllowlistPolicySnapshot` mismatch** — REVIEW_WORKFLOW § 9.1.1 현재 매트릭스 hash와 불일치 (CM4-13)
- `policyVersionReevaluate.staleFlagsOnlyOverrideConditions.maxRiskLevel` ∉ enum
- `hashSecrets.*` 4종 누락 (CM3-09 applyPreflightTokenPepperRef 포함)
- `retentionDays.*` 누락
- `dryRun.digest.chunkSize` ≤ 0
- step registry inputSchema.additionalProperties != false
- step registry cancellationSupport.supportsCooperativeCancellation=false + transactionBoundary != "per-chunk" → **validate fail** (CM3-02)

### 9.2 runtime fail

- runApply `applyPreflightToken` mismatch (server-side 8필드 재계산 불일치) [INV-CAS-PREFLIGHT-TOKEN]
- runApply DryRunReport expiresAt 초과 [INV-CAS-DRYRUN-EXPIRY]
- runApply mismatched idempotency → 409 [INV-IDEMPOTENCY-COLLISION]
- legalGateRequired=true + approvePlanLegalGate 미수행 또는 expectedLegalApprovalId 누락 [INV-LEGAL-APPROVAL-LINK]
- `forceProceedDespiteWarnings`가 legal/critical warning 무시 시도 → 거부 [INV-LEGAL-OVERRIDE]
- classifierVersion mismatch → ApplyPreflightToken mismatch (CAS)
- legalImpactClassifier `unknownClassesEncountered=true` apply 시도 → fail-closed [INV-LEGAL-UNKNOWN-CLASS]
- step timeout 초과 → failed-transient
- rollbackRun expectedStatus CAS 실패
- rollback irreversible encountered → blocked-manual-remediation-required [INV-ROLLBACK-IRREVERSIBLE]
- pauseRun/cancelRun § 4.3 비허용 status → runtime fail
- read-only window 중 content-mutating 시도 → rejected [INV-READONLY-CONTENT]
- read-only window 중 dispatchAllowlist 외 이벤트 즉시 dispatch 시도 → 큐잉으로 변경 (rejected 아님) [INV-READONLY-DISPATCH]
- policy-reevaluate concurrencyLimit 초과 → 대기 큐
- writeSetManifest invariantQueryResults에 `passed=false` → partial write 감지 → rollback 우선 [INV-PARTIAL-WRITE]
- cooperative cancellation 미지원 step + pauseRun + timeout → `cancellation-timeout-manual-review` remediationStatus [INV-CANCEL-TIMEOUT]
- skipStep + rollbackClass ∉ ("irreversible","manual-remediation-required") → runtime fail
- skipStep + (reason·approver·remediationTicketRef·affectedRowsConfirmation 누락) → runtime fail [INV-ROLLBACK-SKIP]
- stale-flags-only override + staleFlagsOnlyOverrideConditions 미충족 → runtime fail [INV-POLICY-REEVAL-OVERRIDE]
- active run (`primaryStatus IN ('pending','running','paused','rolling-back')` + remediationStatus ≠ none) + 동일 plan apply 시도 → 409 [INV-RUN-ACTIVE-UNIQUE]
- outbox UNIQUE(sourceEventId) 충돌 → 정보 로그 [INV-OUTBOX-SOURCE-EVENT]
- **same-request replay** — `requestFingerprint` 일치 시 기존 결과 반환 (no-op) [INV-IDEMPOTENCY-REPLAY] (CM4-12)
- **PII StepResult export 시도** (`contains_pii=true + export_allowed=true`) → DB CHECK reject + audit [INV-PRIVACY-EXPORT] (CM4-12)
- **ActiveTargetLock 충돌** — 동일 (instanceId, targetSetDigest, writeSetScopeDigest) UNIQUE 위반 → 409 (CM4-06·07)

### 9.3 migration-time validation

- targetSelector 0건 → warning
- targetSelector 임계 초과 → warning 또는 fail
- DryRunReport expiresAt 만료 후 apply → fail
- step.rollbackClass=reversible + reverseStep 누락 → validate fail
- step.rollbackClass=compensating + compensatingStep 누락 → validate fail
- step.rollbackClass=irreversible + (blastRadiusCap 누락 또는 backupSnapshotRequired=false) → validate fail

 succeeded in 580ms:
- `CHECK (privacy_class != 'non-pii' OR contains_pii = false)`
- `CHECK (NOT contains_pii OR export_allowed = false)` — PII step export 금지 DB 강제 (CM4-10)
**Index**: `(runId, started_at DESC)`, `(expiresAt)`, `(privacy_class) WHERE privacy_class IN ('pii','legal-sensitive')`.

### 12.6 `ContentMigrationStepRetryQueue` (CM3-07 worker SQL)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `stepResultId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `attempts` | integer | ✅ |
| `maxAttempts` | integer | ✅ |
| `status` | enum (pending·processing·completed·exhausted·failed-permanent) | ✅ |
| `nextAttemptAt` | Date | ✅ |
| `lockedAt`·`lockedBy` | Date·string | optional |
| `lastError`·`lastErrorClass` | string·enum (transient·permanent) | optional |
| `exhaustedAt` | Date | optional |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(stepResultId) WHERE status IN ('pending','processing')`.
**Index**: `(status, next_attempt_at, locked_at) WHERE status IN ('pending','processing')`.

**worker SoT SQL** (CM3-07 자체 전개):

```sql
-- claim
WITH next AS (
  SELECT id FROM content_migration_step_retry_queue
  WHERE status='pending' AND next_attempt_at <= now()
    AND (locked_at IS NULL OR locked_at < now() - interval '10 minutes')
  ORDER BY next_attempt_at FOR UPDATE SKIP LOCKED LIMIT 1
)
UPDATE content_migration_step_retry_queue q
SET status='processing', locked_at=now(), locked_by=$worker, attempts=attempts+1
FROM next WHERE q.id=next.id RETURNING q.*;

-- transient fail (backoff)
UPDATE content_migration_step_retry_queue
SET status='pending', locked_at=null, last_error=$err, last_error_class='transient',
    next_attempt_at = now() + (interval '1 second' * (CASE attempts WHEN 1 THEN 60 WHEN 2 THEN 600 ELSE 3600 END))
WHERE id=$id;

-- permanent
UPDATE content_migration_step_retry_queue
SET status='failed-permanent', locked_at=null, last_error_class='permanent'
WHERE id=$id;

-- success
UPDATE content_migration_step_retry_queue SET status='completed', locked_at=null WHERE id=$id;

-- exhausted
UPDATE content_migration_step_retry_queue
SET status='exhausted', exhausted_at=now(), locked_at=null
WHERE id=$id AND attempts >= max_attempts;
-- + sink alert + run.retryExhaustedAction trigger

-- stale reclaim
UPDATE content_migration_step_retry_queue
SET locked_at=null, locked_by=null
WHERE status='processing' AND locked_at < now() - interval '10 minutes';
```

### 12.7 `ContentMigrationRollbackLog`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `runId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `rolledBackStepKey` | string | ✅ |
| `rollbackClass` | enum | ✅ |
| `scope` | enum (full·from-step) | ✅ |
| `skippedIrreversibleSteps` | JSON ({stepKey, remediationTicketRef}[]) | ✅ |
| `result` | enum (success·partial·failed) | ✅ |
| `executedAt` | Date | ✅ |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(runId, rolledBackStepKey)`.
**Index**: `(runId, executedAt DESC)`.

### 12.8 `ContentMigrationReadOnlyWindow`


exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/features/content-migration.md'; (Get-Content "'$p)[1000..1045]' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "digestComputationMode|invalidationInputs|cacheSourceRef|legalSensitiveEntityChanged|legalEntityIdentityChanged|legalEntityChanged" docs/features/content-migration.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "markStepCompensated|abortRun|step-compensated|run-aborted|requestFingerprint" docs/features/content-migration.md' in C:\Users\assag\solution\website-exposure
 succeeded in 556ms:
371:// CM3-04 + CM4-08 — legalEntityChanged 분해
378:  legalSensitiveEntityChanged: boolean;                  // CM4-08 — LegalDocument·ReviewPolicy·PricingPage·전후사진·후기 contentType class diff
379:  legalEntityIdentityChanged: boolean;                   // CM4-08 — 법인명·소속·법적 식별자 변경
416:1. DryRunReport row insert — 8필드 digest 포함 + digestComputationMode·invalidationInputs 기록 (CM4-02)
424:4. **digestComputationMode별 invalidation precheck** (CM4-02):
427:   - mode="cache": invalidationInputs(policyVersionSnapshot·classifierVersion·ruleFileHashes·catalogRefs) 변경 감지 → 변경된 경우만 해당 field 재계산
428:5. 어느 모드든 invalidationInputs change 발견 → CAS fail (token mismatch)
723:   - riskDelta·priorReviewRequiredChanged·legalEntityChanged 산정
727:   - **legalSensitiveEntityChanged=true** (LegalDocument·ReviewPolicy·PricingPage·전후사진·후기 contentType class diff) → new-record-version 강제
728:   - **legalEntityIdentityChanged=true** (법인명·소속·법적 식별자 변경) → new-record-version 강제
849:| **INV-LEGAL-ENTITY-DISCRIMINATE** (CM4-08) | legalSensitiveEntityChanged=false + legalEntityIdentityChanged=false + low risk → stale-flags-only override | legalSensitiveEntityChanged=true → new-record-version 강제 |
1001:| 2026-05-15 | **v0.5** | **codex 4차 비평 14 지적 전건 수용**: (1) **ApplyPreflightToken opaque + dryRunReportId explicit lookup** — RunApplyInput에 dryRunReportId 추가 (CM4-01), (2) **digestComputationMode 3종** (full·snapshot·cache) + invalidationInputs cache invalidation 정밀화 (CM4-02), (3) **append-only-watermark concurrency 강화** — lowerBound·exclusiveUpperBound·sourcePredicateHash·writerIdField·expectedInsertedCount·concurrencyMode + phantom row writerId 검사 (CM4-03), (4) **Run status 3축 transition matrix § 4.3.1 + DB CHECK § 4.3.2/§ 12.4** — partial-rollback은 별도 primaryStatus 아님 (CM4-04), (5) **markStepCompensated·abortRun v1.0 정식 command** + CM-10·11 resolved 격상 + REVIEW_WORKFLOW cascade 2종 추가 (CM4-05), (6) **ContentMigrationActiveTargetLock § 12.11 신설** — instanceId+targetSetDigest+writeSetScopeDigest active unique. dry-run·apply 동시성 차단 (CM4-06·07), (7) **legalEntityChanged 분해** → legalSensitiveEntityChanged + legalEntityIdentityChanged. staleFlagsOnlyOverrideConditions 정렬 (CM4-08), (8) **§ 12.9.1 embedded 명시** + 인벤토리 11 tables로 정정 (§ 12.1-§ 12.11) (CM4-09), (9) **PII export DB CHECK SQL canonical** `CHECK (NOT contains_pii OR export_allowed = false)` (CM4-10), (10) **SkipStepInput에서 rollbackClass 제거** — irreversible only. manual-remediation-required는 remediationStatus reason (CM4-11), (11) **§ 6.3 fixture matrix 28 INV × happy + violation 각 1쌍** + § 9.2에 same-request replay·PII export·ActiveTargetLock 충돌 fail rule 추가 (CM4-12), (12) **dispatchAllowlistPolicySnapshot** — REVIEW_WORKFLOW 매트릭스 hash drift 시 build fail (CM4-13), (13) **§ 1.1 SemVer 4행 추가** — writeSetManifest strategy semantic·policy-reevaluate decision rule·staleFlagsOnlyOverrideConditions·ActiveTargetLock 변경 (CM4-14) |
1002:| 2026-05-15 | (v0.4 — 이전 비고) | **codex 3차 비평 21 지적 전건 수용** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |
1230:| `priorReviewRequiredChanged`·`legalEntityChanged` | boolean | ✅ |

 succeeded in 546ms:
208:| `requestFingerprint` | command별 (§ 3.4) |
231:| 실행 | `markStepCompensated` (CM4-05) | manual remediation compensation 적용 표시 | super-admin + remediationTicketRef | `content-migration-step-compensated` | — |
232:| 실행 | `abortRun` (CM4-05) | cancellation-timeout 또는 blocked-manual-remediation 강제 종료 | super-admin + remediationTicketRef + 운영 ticket | `content-migration-run-aborted` | `content-migration-run-failed` |
238:### 3.1.1 AuditAction metadata 표 (CM3-19 — actorId·requestFingerprint·8필드 일관)
240:**공통 metadata required (모든 AuditAction)**: `actorId`·`actorRole`·`idempotencyKey`·`requestFingerprint`.
400:### 3.4 idempotencyKey + requestFingerprint (CM3-19)
402:| command | scope | requestFingerprint |
601:| markStepCompensated (CM4-05) | rolling-back·blocked-manual-remediation-required | compensation 적용 표시 | rolling-back·blocked-manual-remediation-required → 정리 시 rolled-back·none·**partial** |
603:| abortRun (CM4-05) | running·cancellation-timeout-manual-review 또는 rolling-back·blocked-manual-remediation-required | 강제 종료 + 운영 ticket 필수 | failed·cancellation-timeout-manual-review·**failed** (rollback 시도 실패 또는 timeout) |
910:- **same-request replay** — `requestFingerprint` 일치 시 기존 결과 반환 (no-op) [INV-IDEMPOTENCY-REPLAY] (CM4-12)
981:| ~~CM-10~~ | abortRun command — v1.0 § 3.1·§ 3.3·§ 4.3 (CM4-05) |
982:| ~~CM-11~~ | markStepCompensated command — 동일 (CM4-05) |
1001:| 2026-05-15 | **v0.5** | **codex 4차 비평 14 지적 전건 수용**: (1) **ApplyPreflightToken opaque + dryRunReportId explicit lookup** — RunApplyInput에 dryRunReportId 추가 (CM4-01), (2) **digestComputationMode 3종** (full·snapshot·cache) + invalidationInputs cache invalidation 정밀화 (CM4-02), (3) **append-only-watermark concurrency 강화** — lowerBound·exclusiveUpperBound·sourcePredicateHash·writerIdField·expectedInsertedCount·concurrencyMode + phantom row writerId 검사 (CM4-03), (4) **Run status 3축 transition matrix § 4.3.1 + DB CHECK § 4.3.2/§ 12.4** — partial-rollback은 별도 primaryStatus 아님 (CM4-04), (5) **markStepCompensated·abortRun v1.0 정식 command** + CM-10·11 resolved 격상 + REVIEW_WORKFLOW cascade 2종 추가 (CM4-05), (6) **ContentMigrationActiveTargetLock § 12.11 신설** — instanceId+targetSetDigest+writeSetScopeDigest active unique. dry-run·apply 동시성 차단 (CM4-06·07), (7) **legalEntityChanged 분해** → legalSensitiveEntityChanged + legalEntityIdentityChanged. staleFlagsOnlyOverrideConditions 정렬 (CM4-08), (8) **§ 12.9.1 embedded 명시** + 인벤토리 11 tables로 정정 (§ 12.1-§ 12.11) (CM4-09), (9) **PII export DB CHECK SQL canonical** `CHECK (NOT contains_pii OR export_allowed = false)` (CM4-10), (10) **SkipStepInput에서 rollbackClass 제거** — irreversible only. manual-remediation-required는 remediationStatus reason (CM4-11), (11) **§ 6.3 fixture matrix 28 INV × happy + violation 각 1쌍** + § 9.2에 same-request replay·PII export·ActiveTargetLock 충돌 fail rule 추가 (CM4-12), (12) **dispatchAllowlistPolicySnapshot** — REVIEW_WORKFLOW 매트릭스 hash drift 시 build fail (CM4-13), (13) **§ 1.1 SemVer 4행 추가** — writeSetManifest strategy semantic·policy-reevaluate decision rule·staleFlagsOnlyOverrideConditions·ActiveTargetLock 변경 (CM4-14) |
1002:| 2026-05-15 | (v0.4 — 이전 비고) | **codex 3차 비평 21 지적 전건 수용** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |
1015:| `requestFingerprint` | char(64) | ✅ |
1071:| `idempotencyKey`·`requestFingerprint` | string·char(64) | ✅ |

 succeeded in 579ms:
| 2026-05-15 | **v0.5** | **codex 4차 비평 14 지적 전건 수용**: (1) **ApplyPreflightToken opaque + dryRunReportId explicit lookup** — RunApplyInput에 dryRunReportId 추가 (CM4-01), (2) **digestComputationMode 3종** (full·snapshot·cache) + invalidationInputs cache invalidation 정밀화 (CM4-02), (3) **append-only-watermark concurrency 강화** — lowerBound·exclusiveUpperBound·sourcePredicateHash·writerIdField·expectedInsertedCount·concurrencyMode + phantom row writerId 검사 (CM4-03), (4) **Run status 3축 transition matrix § 4.3.1 + DB CHECK § 4.3.2/§ 12.4** — partial-rollback은 별도 primaryStatus 아님 (CM4-04), (5) **markStepCompensated·abortRun v1.0 정식 command** + CM-10·11 resolved 격상 + REVIEW_WORKFLOW cascade 2종 추가 (CM4-05), (6) **ContentMigrationActiveTargetLock § 12.11 신설** — instanceId+targetSetDigest+writeSetScopeDigest active unique. dry-run·apply 동시성 차단 (CM4-06·07), (7) **legalEntityChanged 분해** → legalSensitiveEntityChanged + legalEntityIdentityChanged. staleFlagsOnlyOverrideConditions 정렬 (CM4-08), (8) **§ 12.9.1 embedded 명시** + 인벤토리 11 tables로 정정 (§ 12.1-§ 12.11) (CM4-09), (9) **PII export DB CHECK SQL canonical** `CHECK (NOT contains_pii OR export_allowed = false)` (CM4-10), (10) **SkipStepInput에서 rollbackClass 제거** — irreversible only. manual-remediation-required는 remediationStatus reason (CM4-11), (11) **§ 6.3 fixture matrix 28 INV × happy + violation 각 1쌍** + § 9.2에 same-request replay·PII export·ActiveTargetLock 충돌 fail rule 추가 (CM4-12), (12) **dispatchAllowlistPolicySnapshot** — REVIEW_WORKFLOW 매트릭스 hash drift 시 build fail (CM4-13), (13) **§ 1.1 SemVer 4행 추가** — writeSetManifest strategy semantic·policy-reevaluate decision rule·staleFlagsOnlyOverrideConditions·ActiveTargetLock 변경 (CM4-14) |
| 2026-05-15 | (v0.4 — 이전 비고) | **codex 3차 비평 21 지적 전건 수용** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |

---

## 12. DB 인벤토리 (10 tables — executable schema)

### 12.1 `ContentMigrationPlan`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `idempotencyKey` | string | ✅ |
| `requestFingerprint` | char(64) | ✅ |
| `planKind` | enum (6종) | ✅ |
| `planFingerprint` | char(64) | ✅ |
| `title`·`description` | string | ✅ |
| `targetSelector` | JSON | ✅ |
| `legalImpactClassification` | JSON (closed) | ✅ |
| `classifierVersion` | string | ✅ |
| `status` | enum (draft·validated·dry-run-completed·legal-approved·apply-ready·archived) | ✅ |
| `definedBy`·`definedAt` | string·Date | ✅ |
| `expiresAt` | Date | ✅ — retentionDays.plan |

**Constraints**: `UNIQUE(instanceId, idempotencyKey)`. legalHold true (legalImpactClassification 포함).
**Index**: `(instanceId, status)`, `(expiresAt)`.

### 12.2 `ContentMigrationDryRunReport`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `planId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `planFingerprint`·`targetSetDigest`·`contentHashDigest`·`sourceSnapshotWatermark`·`policyVersionSnapshot`·`stepRegistryVersion`·`legalImpactClassificationDigest`·`classifierVersion` | char(64)/string | ✅ (8필드) |
| `applyPreflightToken` | char(64) | ✅ |
| `samplingStats` | JSON | ✅ |
| `blockedDriftCount` | integer | ✅ |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(planId, applyPreflightToken)`. `UNIQUE(applyPreflightToken)`.
**Index**: `(planId, generatedAt DESC)`, `(expiresAt)`.

### 12.3 `ContentMigrationLegalApproval` (CM3-13)

| 필드 | 타입 | required |

codex
신규 메커니즘에서 몇 가지 더 뚜렷한 불일치가 보입니다. 특히 § 12 헤더는 아직 “10 tables”로 남아 있고, § 12.9.1은 “embedded”라는 v0.5 설명과 달리 별도 row/table로 쓰여 있으며, legalEntityChanged 분해도 하단 스키마에는 완전히 전파되지 않았습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content .codex-reviews/cm_cycle4_response.md -Tail 140' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/features/content-migration.md'; (Get-Content "'$p)[940..990]; (Get-Content $p)[1218..1238]' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/features/content-migration.md'; (Get-Content "'$p)[330..370]; (Get-Content $p)[390..407]' in C:\Users\assag\solution\website-exposure
 succeeded in 601ms:
  - ContentMigrationLegalApproval: 7년 audit retention. legalHold true
  - ContentMigrationPlan (legalApproved 포함): legalHold true
  - DryRunReport: expiresAt 시 delete
  - Run (status=완료): retentionDays.run
  - StepResult: retentionDays.step
  - StepRetryQueue (status=completed): retentionDays.stepRetryQueueCompleted
  - RollbackLog: retentionDays.rollbackLog
  - ReadOnlyWindow: retentionDays.readOnlyWindow
  - PolicyReevaluateBatch·Record: retentionDays.policyReevaluateBatch
  - NotificationOutbox (sent·permanent): retentionDays.notificationOutbox

### 9.5 warning

- targetSelector row count > 임계
- rollbackClass=irreversible 비율 > 10%
- impactSamplingMode=random + legal/PII step 포함
- cooperativeCancellation 미지원 step 1개 이상 (validate fail 전제이지만 manifest 단계 사전 경고)

---

## 10. 미결정 사항

### 10.1 open (v1.x·M2+ 후속)

| ID | 항목 |
|---|---|
| CM-01 | 외부 cluster cross-region copy |
| CM-02 | partial cutover |
| CM-03 | sampling stratified 알고리즘 (v1.0 deterministic-stratified default·v1.x per-cluster) |
| CM-04 | read-only window 우회 권한 |
| CM-05 | rollback 부분 적용 안전성 |
| CM-09 | legalImpactClassifier false-negative retroactive 절차 (운영 정책) |

### 10.2 resolved-in-v1.0

| ID | 해소 |
|---|---|
| ~~CM-06~~ | policy-reevaluate 부하 — § 4.8 batch contract |
| ~~CM-07~~ | instance-to-instance-copy PII — legalImpactClassifier + legal-reviewer |
| ~~CM-08~~ | DB DDL vs application — § 1.3 |
| ~~CM-10~~ | abortRun command — v1.0 § 3.1·§ 3.3·§ 4.3 (CM4-05) |
| ~~CM-11~~ | markStepCompensated command — 동일 (CM4-05) |

### 10.3 v0.4 잔여 리스크

| 영역 | 상태 |
|---|---|
| § 6.3 acceptance fixture violation path 풀 정의 | open — v0.5 cycle |
| step type registry 별도 도큐먼트 | open — § 3.6 최소 계약 본문 포함. 구체 step type은 구현체 등록 |

---

(별도 row per ComplianceRecord) — CM3-04 PolicyReevaluateResult 기록:

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `batchId` | UUID | ✅ — FK § 12.9 |
| `complianceRecordId` | UUID | ✅ |
| `cachedResultRef` | UUID | optional |
| `previousRiskLevel`·`newRiskLevel` | enum | ✅ |
| `riskDelta` | enum (decreased·unchanged·increased) | ✅ |
| `priorReviewRequiredChanged`·`legalEntityChanged` | boolean | ✅ |
| `forcedReportingMode` | enum (stale-flags-only·new-record-version) | ✅ |
| `forcedReportingModeReason` | string | optional |
| `newComplianceRecordId` | UUID | optional (new-record-version 적용 시) |

**Constraints**: `UNIQUE(batchId, complianceRecordId)`.

### 12.10 `ContentMigrationNotificationOutbox` (CM3-14)

| 필드 | 타입 | required |

 succeeded in 631ms:
    {
      "id": "CM4-08",
      "severity": "major",
      "category": "policy-reevaluate",
      "title": "legalEntityChanged 정의가 모호해 stale-flags-only override CHECK를 신뢰할 수 없다",
      "evidence": [
        "§3.3 PolicyReevaluateResult는 legalEntityChanged boolean만 둔다.",
        "§4.8은 legalEntityChanged=true를 LegalDocument·ReviewPolicy·PricingPage 영향으로 설명한다.",
        "§2.3 staleFlagsOnlyOverrideConditions는 requiresNoLegalEntityChange=true를 요구한다."
      ],
      "impact": "legalEntityChanged가 법인명 변경인지, 법무 검토 대상 엔티티 변경인지, LegalDocument/ReviewPolicy/PricingPage contentType 영향인지 불명확하다. CHECK 조건이 구현마다 달라 stale-flags-only가 과하게 허용될 수 있다.",
      "recommendation": "legalEntityChanged를 rename하거나 분해하라. 예: legalSensitiveEntityChanged, legalEntityIdentityChanged. 산정 입력은 previous/new contentType, fieldProjection diff, LegalDocument/ReviewPolicy/PricingPage class diff, priorReview trigger diff로 명시하라."
    },
    {
      "id": "CM4-09",
      "severity": "major",
      "category": "db-schema",
      "title": "§12 executable schema가 실제 SQL 실행 가능 수준은 아니다",
      "evidence": [
        "§12.4 FK 대상과 ON DELETE 정책이 일부 생략된다.",
        "§12.5 CHECK (contains_pii = true → export_allowed = false)는 SQL 문법이 아니다.",
        "§12.9.1은 별도 id/FK/UNIQUE를 가진 per-record table인데 총 10 tables에서 제외된다.",
        "CAS는 solutionVersion column만 있고 status transition CAS WHERE 조건은 schema에 없다."
      ],
      "impact": "executable schema라고 부르지만 구현 가능한 DDL로 변환하려면 추가 해석이 필요하다. 특히 CHECK, FK, partial unique, CAS transition이 application validator인지 DB constraint인지 혼재된다.",
      "recommendation": "PostgreSQL canonical DDL 또는 최소 SQL-equivalent CHECK 표현을 추가하라. §12.9.1이 물리 테이블이면 인벤토리를 11 tables로 고치고, embedded JSON이면 FK/UNIQUE 표현을 제거하라."
    },
    {
      "id": "CM4-10",
      "severity": "major",
      "category": "privacy",
      "title": "StepResultRow PII export 금지 CHECK가 application validator인지 DB CHECK인지 불명확하다",
      "evidence": [
        "§3.8 exportAllowed: PII step은 false 강제",
        "§12.5 Constraints에 CHECK (contains_pii = true → export_allowed = false)",
        "§6.2 INV-PRIVACY-EXPORT는 §9.2로 매핑하지만 §9.2 runtime fail 목록에는 직접 항목이 없다."
      ],
      "impact": "PII StepResult export 금지가 DB에서 강제되는지, read API validator에서 강제되는지 불명확하다. 잘못 구현하면 PII rawArtifact/export가 열릴 수 있다.",
      "recommendation": "DB CHECK는 `CHECK (NOT contains_pii OR export_allowed = false)`로 명시하고, §9.2에 export 시도 runtime fail rule을 추가하라."
    },
    {
      "id": "CM4-11",
      "severity": "major",
      "category": "step-result",
      "title": "skipped 상태와 skipStep path가 rollbackClass enum과 맞지 않는다",
      "evidence": [
        "§3.3 SkipStepInput.rollbackClass는 'irreversible' | 'manual-remediation-required'이다.",
        "§3.3 RollbackClass는 reversible·compensating·irreversible 3종이다.",
        "§12.5 StepResult.rollbackClass는 enum이라고만 하고 manual-remediation-required 포함 여부가 없다.",
        "§12.5 status에는 skipped가 있지만 §9 invariant는 skipped 후 StepResult/Run 상태 전이를 닫지 않는다."
      ],
      "impact": "manual-remediation-required가 rollbackClass인지 remediation reason인지 혼재된다. skipped step이 rollback log에만 남는지 StepResult.status도 skipped로 바뀌는지, compensationStatus와 어떻게 연결되는지 불명확하다.",
      "recommendation": "manual-remediation-required는 rollbackClass에서 제거하고 remediationStatus/reason으로만 둬라. skipStep 성공 시 StepResult.status='skipped', Run.remediationStatus 해제 조건, RollbackLog.result=partial 조건을 명시하라."
    },
    {
      "id": "CM4-12",
      "severity": "major",
      "category": "traceability",
      "title": "§6.2 traceability는 1:1 표를 만들었지만 §9 쪽 rule coverage가 여전히 불완전하다",
      "evidence": [
        "§6.2에는 INV-IDEMPOTENCY-REPLAY가 있으나 §9.2 runtime fail에는 same-request replay 항목이 없다.",
        "§6.2 INV-PRIVACY-EXPORT는 §9.2로 매핑되지만 §9.2 목록에 PII export fail이 없다.",
        "§6.3은 상세 fixture matrix를 v0.5로 미루고 v0.4는 일부 happy/violation 예시만 둔다."
      ],
      "impact": "표면상 traceability는 생겼지만 일부 invariant는 실제 fail rule과 fixture로 추적되지 않는다. v1.0 후보의 regression 방지 기준으로 부족하다.",
      "recommendation": "§9에 누락 rule을 추가하고, 최소 각 INV마다 happy 1개 + violation 1개 fixture를 v1.0 안에 포함하라. deferred fixture는 v1.0 readiness 차단으로 남겨야 한다."
    },
    {
      "id": "CM4-13",
      "severity": "minor",
      "category": "notification",
      "title": "read-only window dispatchAllowlist와 notifications SoT의 즉시 채널 정책 사이 책임 경계가 약하다",
      "evidence": [
        "§4.5는 notification-dispatch를 dispatchAllowlist 이벤트만 즉시 허용한다고 한다.",
        "REVIEW_WORKFLOW §9.1.1은 같은 이벤트들의 channel/criticality/quietHoursPolicy SoT다.",
        "content-migration §2.3에도 별도 dispatchAllowlist config가 있다."
      ],
      "impact": "REVIEW_WORKFLOW 매트릭스가 변경되었을 때 content-migration dispatchAllowlist와 notificationPolicyVersion이 따로 drift될 수 있다.",
      "recommendation": "dispatchAllowlist는 REVIEW_WORKFLOW event criticality ∈ {high, critical} AND operational=true 같은 derived rule로 두거나, policyVersion/hash를 함께 저장해 drift를 build fail로 막아라."
    },
    {
      "id": "CM4-14",
      "severity": "minor",
      "category": "semver",
      "title": "§1.1 SemVer 표는 신규 메커니즘 이름은 다루지만 하위 strategy 의미 변경을 충분히 분해하지 않는다",
      "evidence": [
        "§1.1에는 writeSetManifest schema 변경, Run status enum·substate 변경, ApplyPreflightToken algorithm 변경 행이 있다.",
        "append-only-watermark strategy의 concurrency/isolation 의미 변경, stale-flags-only override 판정 입력 변경은 별도 행이 없다."
      ],
      "impact": "schema는 그대로지만 안전성 의미가 바뀌는 변경이 PATCH/MINOR로 오판될 수 있다.",
      "recommendation": "writeSetManifest strategy semantic 변경, policy-reevaluate reportingMode decision rule 변경, staleFlagsOnlyOverrideConditions 변경을 MAJOR + policyVersion 신규로 명시하라."
    }
  ],
  "pattern_consistency": {
    "crm_sync_partial_unique": "부분 정합. ContentMigrationRun은 planId active unique만 있어 crm-sync의 active·rotating-target·committed처럼 대상 자원 자체를 잠그는 패턴에는 미달한다. targetSetDigest/writeSetScopeDigest active unique가 필요하다.",
    "asset_ingestion_body_mv_denylist": "대체로 정합. content-migration은 ExtractedContent.body MV 직접 변경 금지를 명시하고 mutableFieldDenylist로 연결했다.",
    "notifications_outbox_sql": "대체로 정합. nextAttemptAt·attempts·permanent 상태는 반영됐다. 다만 read-only window dispatchAllowlist는 REVIEW_WORKFLOW/notifications policyVersion과 drift 방지 장치가 더 필요하다."
  },
  "required_cascade_or_next_changes": [
    {
      "target": "docs/features/content-migration.md §3.3, §3.5, §12.2",
      "change": "ApplyPreflightToken을 opaque lookup 방식 또는 dryRunReportId + token 방식으로 재정의"
    },
    {
      "target": "docs/features/content-migration.md §3.7",
      "change": "append-only-watermark concurrency/isolation/phantom 방지 조건 추가"
    },
    {
      "target": "docs/features/content-migration.md §4.3, §12.4",
      "change": "Run 3축 transition matrix와 DB CHECK 추가, partial-rollback 잔재 제거"
    },
    {
      "target": "docs/features/content-migration.md §3.1, §3.3, §3.4, §4.3",
      "change": "markStepCompensated·abortRun 지원 여부 결정 및 command contract 정합화"
    },
    {
      "target": "docs/features/content-migration.md §12",
      "change": "실제 SQL-equivalent FK/CHECK/partial unique/CAS DDL 수준으로 schema 보강, §12.9.1 table count 정정"
    },
    {
      "target": "docs/features/content-migration.md §6.3",
      "change": "각 INV별 happy/violation fixture matrix를 v1.0 범위에 포함"
    }
  ],
  "v1_0_readiness": {
    "ready_for_v1_0": false,
    "blocking_reasons": [
      "ApplyPreflightToken HMAC decode 불가능",
      "append-only-watermark 동시 삽입/phantom row 방지 미흡",
      "Run status 3축 transition matrix 및 DB CHECK 미완성",
      "cancellation-timeout-manual-review 복구 command contract 누락"
    ],
    "residual_major_reasons": [
      "active unique가 동일 target set의 다른 plan 충돌을 막지 못함",
      "dry-run/apply 동시성 정책 불명확",
      "legalEntityChanged 및 stale-flags-only override 판정 기준 모호",
      "§12 executable schema와 §6.3 fixture가 v1.0 수준으로 완결되지 않음"
    ]
  }
}

 succeeded in 649ms:

type RollbackInput = {
  runId: string;
  scope: "full" | "from-step";
  fromStepKey?: string;
  reason: string;
  expectedStatus: RunPrimaryStatus;                     // CAS
  idempotencyKey: string;
};

type SkipStepInput = {
  stepResultId: string;                                 // CM4-11 — rollbackClass=irreversible만 허용
  reason: string;
  approver: string;
  remediationTicketRef: string;
  affectedRowsConfirmation: number;
  classifierVersionAtSkip: string;
  idempotencyKey: string;
};

// CM4-05 신규
type MarkStepCompensatedInput = {
  stepResultId: string;
  compensationDescription: string;
  approver: string;
  remediationTicketRef: string;
  affectedRowsConfirmation: number;
  idempotencyKey: string;
};

// CM4-05 신규
type AbortRunInput = {
  runId: string;
  reason: string;
  approver: string;
  operationalTicketRef: string;
  expectedSubstate: { primaryStatus: RunPrimaryStatus; remediationStatus: RunRemediationStatus };  // CAS
  idempotencyKey: string;
};

// CM3-04 + CM4-08 — legalEntityChanged 분해
type RunRemediationStatus =
  | "none"
  | "blocked-manual-remediation-required"
  | "cancellation-timeout-manual-review";

type RunRollbackOutcome =
  | "none" | "full" | "partial" | "failed";
```

### 3.4 idempotencyKey + requestFingerprint (CM3-19)

| command | scope | requestFingerprint |
|---|---|---|
| `definePlan` | `(instanceId, idempotencyKey)` UNIQUE | HMAC(idempotencyPepperRef, planKind + ":" + canonical(plan)) |
| `runApply` | `(planId, idempotencyKey)` UNIQUE | HMAC(... planId + ":" + applyPreflightToken) — token에 8필드 + classifierVersion 포함 (CM3-09) |
| `rollbackRun` | `(runId, idempotencyKey)` UNIQUE | HMAC(... runId + scope + fromStepKey + expectedStatus + reason hash) |
| `skipStep` | `(stepResultId, idempotencyKey)` UNIQUE | HMAC(... stepResultId + rollbackClass + remediationTicketRef + affectedRowsConfirmation) |
| `pauseRun`·`resumeRun`·`cancelRun`·`approvePlanLegalGate` | `(targetId, idempotencyKey)` UNIQUE | HMAC(... targetId + 핵심 input) |

codex
{
  "verdict": "not_ready_for_v1_0",
  "ready_for_v1_0": false,
  "finding_prefix": "CM5-",
  "summary": "v0.5는 CM4 14개 지적의 핵심 방향은 대체로 반영했지만, SoT cascade와 DB 스키마가 아직 닫히지 않았다. 특히 §12 인벤토리/PolicyReevaluateRecord/3축 CHECK/NotificationEvent SLA가 v1.0 안정판 차단 요인이다.",
  "cm4_regression_check": {
    "CM4-01": "fixed",
    "CM4-02": "partially_fixed_schema_missing",
    "CM4-03": "fixed_with_residual_scope_question",
    "CM4-04": "partially_fixed_check_incomplete",
    "CM4-05": "partially_fixed_notification_metadata_gap",
    "CM4-06": "partially_fixed_digest_stability_gap",
    "CM4-07": "partially_fixed_digest_stability_gap",
    "CM4-08": "partially_fixed_old_field_remains",
    "CM4-09": "regressed_inventory_contradiction",
    "CM4-10": "fixed",
    "CM4-11": "mostly_fixed_request_fingerprint_stale",
    "CM4-12": "mostly_fixed",
    "CM4-13": "fixed",
    "CM4-14": "fixed"
  },
  "findings": [
    {
      "id": "CM5-01",
      "severity": "blocking",
      "category": "db-schema",
      "title": "§12 인벤토리가 11 tables라고 주장하면서 실제 헤더와 §12.9.1은 10/12개 해석을 동시에 만든다",
      "evidence": [
        "§0은 DB 인벤토리를 11 tables라고 한다.",
        "§12 헤더는 여전히 'DB 인벤토리 (10 tables — executable schema)'로 남아 있다.",
        "§12.9.1은 '(별도 row per ComplianceRecord)' 및 id/FK/UNIQUE를 가진 물리 row처럼 정의한다.",
        "v0.5 changelog는 §12.9.1을 embedded라고 설명한다."
      ],
      "impact": "구현자가 PolicyReevaluateRecord를 JSON embedded child로 저장해야 하는지, 별도 table로 생성해야 하는지 결정할 수 없다. 별도 table이면 인벤토리는 12 tables가 되고, embedded이면 FK/UNIQUE 표현이 성립하지 않는다.",
      "recommendation": "둘 중 하나로 고정하라. 권장: `ContentMigrationPolicyReevaluateRecord`를 별도 table로 승격하고 인벤토리를 12 tables로 정정하거나, Batch.resultRecords JSONB로 embedded 정의 후 FK/UNIQUE를 제거하고 JSON schema/CHECK만 남겨라."
    },
    {
      "id": "CM5-02",
      "severity": "blocking",
      "category": "state-machine",
      "title": "3축 invariant CHECK가 transition matrix를 닫지 못해 불가능 조합을 DB가 허용한다",
      "evidence": [
        "§4.3.2 CHECK에서 `running`은 rollback_outcome='none'만 검사해 `running + blocked-manual-remediation-required`를 허용한다.",
        "`rolled-back`은 rollback_outcome만 검사해 `rolled-back + blocked-manual-remediation-required + partial`을 허용한다.",
        "`failed`는 remediation_status를 제한하지 않아 `failed + blocked-manual-remediation-required + none` 같은 전이 없는 조합을 허용한다.",
        "§4.3.1 abortRun은 `failed + cancellation-timeout-manual-review + failed`만 명시한다."
      ],
      "impact": "DB에 유효하지 않은 run substate가 저장될 수 있고, 운영 worker/SLA/rollback cleanup이 서로 다른 상태 해석을 하게 된다.",
      "recommendation": "primaryStatus별 remediationStatus와 rollbackOutcome의 허용 tuple을 CASE가 아니라 명시적 OR tuple로 닫아라. 예: `(primary='running' AND remediation IN ('none','cancellation-timeout-manual-review') AND rollback='none')`, `(primary='rolled-back' AND remediation='none' AND rollback IN ('full','partial'))`."
    },
    {
      "id": "CM5-03",
      "severity": "blocking",
      "category": "notification",
      "title": "step-compensated/run-aborted AuditAction cascade는 됐지만 NotificationEvent SLA가 닫히지 않았다",
      "evidence": [
        "content-migration §3.1은 `markStepCompensated`의 NotificationEvent를 `—`로 두고, `abortRun`은 `content-migration-run-failed`로 매핑한다.",
        "REVIEW_WORKFLOW §9.1 enum과 §9.1.1 매트릭스는 content-migration NotificationEvent 4종만 포함한다.",
        "REVIEW_WORKFLOW §10.2.1에는 `content-migration-step-compensated`, `content-migration-run-aborted` AuditAction 2종이 추가됐다."
      ],
      "impact": "운영 SLA에서 abort와 일반 run failed를 같은 이벤트로 처리할지, step compensation 완료를 알림 없이 audit만 남길지 불명확하다. 의료/개인정보 관련 수동 보정 작업은 운영자 확인 SLA가 필요하다.",
      "recommendation": "둘 중 하나를 SoT로 명시하라. 권장: `content-migration-run-aborted`는 별도 critical NotificationEvent로 REVIEW_WORKFLOW §9.1/§9.1.1 및 content-migration §5에 추가하고, `step-compensated`는 no-notification + audit-only SLA인지 또는 high inApp 이벤트인지 명시하라."
    },
    {
      "id": "CM5-04",
      "severity": "major",
      "category": "active-target-lock",
      "title": "ActiveTargetLock writeSetScopeDigest가 dry-run/apply 사이 step registry 변경에 안정적인지 정의되지 않았다",
      "evidence": [
        "§12.11은 `writeSetScopeDigest`를 step writeSetProjection canonical hash라고만 정의한다.",
        "§3.5 ApplyPreflightToken은 stepRegistryVersion을 CAS digest에 포함한다.",
        "§12.11 lock protocol은 runDryRun/runApply 시작 시 lock 획득만 말하고, dry-run 시점 projection과 apply 시점 projection의 동일성 검증은 별도 lock key 입력으로 닫지 않는다."
      ],
      "impact": "stepRegistryVersion 변경 시 ApplyPreflightToken은 fail할 수 있지만, lock key 산정이 이전/현재 projection 중 무엇인지 불명확해 dry-run/apply 충돌 방지 semantics가 흔들린다.",
      "recommendation": "`writeSetScopeDigest = HMAC(stepRegistryVersion + ordered stepKey + writeSetProjection canonical + targetEntityTypes)`로 고정하고, DryRunReport에 저장된 digest를 apply lock 획득에도 그대로 사용하라. registry drift 시 lock 획득 전 CAS fail로 종료하라."
    },
    {
      "id": "CM5-05",
      "severity": "major",
      "category": "apply-preflight",
      "title": "digestComputationMode와 invalidationInputs가 알고리즘에는 있지만 DryRunReport schema에는 없다",
      "evidence": [
        "§3.5는 DryRunReport row insert 시 digestComputationMode·invalidationInputs 기록을 요구한다.",
        "§12.2 ContentMigrationDryRunReport 필드에는 `digestComputationMode`, `invalidationInputs`, `cacheSourceRef`가 없다."
      ],
      "impact": "runApply가 snapshot/cache 모드의 invalidation precheck를 재현할 수 없다. CM4-02 비용/캐시 정정이 스키마 SoT에 남지 않아 구현자가 임의 column을 추가해야 한다.",
      "recommendation": "§12.2에 `digestComputationMode enum(full,snapshot,cache)`, `invalidationInputs JSONB closed`, `cacheSourceRef optional`, `generatedAt`을 추가하라."
    },
    {
      "id": "CM5-06",
      "severity": "major",
      "category": "policy-reevaluate",
      "title": "legalEntityChanged 분해가 §12.9.1과 §4.8 중간 단계에 완전히 cascade되지 않았다",
      "evidence": [
        "§3.3 PolicyReevaluateResult는 `legalSensitiveEntityChanged`와 `legalEntityIdentityChanged`를 둔다.",
        "§4.8 step 4는 여전히 `legalEntityChanged` 산정이라고 쓴다.",
        "§12.9.1은 `priorReviewRequiredChanged`·`legalEntityChanged` boolean만 저장한다."
      ],
      "impact": "stale-flags-only override 판단 근거가 runtime result와 DB 기록에서 서로 달라진다. 사후 감사 시 왜 new-record-version이 강제됐는지 재구성하기 어렵다.",
      "recommendation": "§4.8과 §12.9.1에서 `legalEntityChanged`를 제거하고 `legalSensitiveEntityChanged`, `legalEntityIdentityChanged`, `fieldProjectionDiff`를 저장하라."
    },
    {
      "id": "CM5-07",
      "severity": "major",
      "category": "idempotency",
      "title": "markStepCompensated/abortRun은 command로 추가됐지만 §3.4 requestFingerprint 표에 없다",
      "evidence": [
        "§3.1과 §3.3은 `markStepCompensated`, `abortRun` input을 추가했다.",
        "§3.4 idempotencyKey + requestFingerprint 표는 definePlan/runApply/rollbackRun/skipStep/pause/resume/cancel/approve만 포함한다.",
        "§3.4 skipStep fingerprint는 제거된 `rollbackClass`를 아직 포함한다."
      ],
      "impact": "신규 운영 command의 same-request replay와 mismatched idempotency 처리가 구현마다 달라질 수 있다.",
      "recommendation": "§3.4에 두 command를 추가하고, skipStep fingerprint에서 rollbackClass를 제거하라. markStepCompensated는 `(stepResultId,idempotencyKey)`, abortRun은 `(runId,idempotencyKey)` scope로 닫는 것이 자연스럽다."
    },
    {
      "id": "CM5-08",
      "severity": "minor",
      "category": "standalone-readiness",
      "title": "v0.4 잔여 리스크 섹션이 v0.5 반영 후에도 그대로 남아 readiness 판단을 흐린다",
      "evidence": [
        "§10.3 제목이 `v0.4 잔여 리스크`로 남아 있다.",
        "§10.3은 §6.3 acceptance fixture violation path를 open이라고 하지만 v0.5 changelog와 §6.3은 28 INV happy+violation 반영을 주장한다."
      ],
      "impact": "문서 자체가 v1.0 후보인지 v0.5 보정 중인지 모순된다.",
      "recommendation": "§10.3을 v0.5 residual risk로 재작성하고, 이미 해결된 fixture 항목은 resolved로 이동하라."
    }
  ],
  "standalone_readiness": {
    "sections_checked": ["§1.1", "§2.4", "§3.x", "§4.x", "§6.x", "§9.x", "§12.x"],
    "can_implement_as_single_sot": false,
    "blocking_gaps": [
      "§12 table inventory와 PolicyReevaluateRecord 저장 방식 불일치",
      "§4.3.2 DB CHECK invariant 미완성",
      "NotificationEvent/AuditAction SLA cascade 불완전",
      "DryRunReport schema가 digestComputationMode/invalidationInputs를 누락"
    ]
  },
  "legal_privacy_operability": {
    "medical_ad_law_operable": false,
    "privacy_law_operable": "partially",
    "reason": "PII export CHECK 자체는 정정됐지만, 수동 보정/abort 알림 SLA와 policy reevaluate 법적 엔티티 변경 기록이 닫히지 않아 의료법·개인정보보호법 운영 감사 기준으로는 부족하다."
  },
  "required_changes_before_v1_0": [
    "§12 인벤토리와 §12.9.1 저장 모델을 단일 결정으로 정리",
    "§4.3.2를 tuple 기반 DB CHECK로 재작성",
    "REVIEW_WORKFLOW §9.1/§9.1.1 및 content-migration §5에 abort/compensation 알림 정책 명시",
    "§12.2 DryRunReport에 digestComputationMode/invalidationInputs/cacheSourceRef/generatedAt 추가",
    "§12.9.1의 legalEntityChanged 잔재 제거",
    "§3.4 requestFingerprint 표를 신규 command와 SkipStepInput 변경에 맞게 갱신"
  ],
  "v1_0_stability_gate": {
    "blocking_count": 3,
    "sot_cascade_synced": false,
    "ready_if_fixed": "CM5-01, CM5-02, CM5-03은 안정판 차단. CM5-04~CM5-07은 v1.0 전 정합성 보강 필요."
  }
}
tokens used
91,868
{
  "verdict": "not_ready_for_v1_0",
  "ready_for_v1_0": false,
  "finding_prefix": "CM5-",
  "summary": "v0.5는 CM4 14개 지적의 핵심 방향은 대체로 반영했지만, SoT cascade와 DB 스키마가 아직 닫히지 않았다. 특히 §12 인벤토리/PolicyReevaluateRecord/3축 CHECK/NotificationEvent SLA가 v1.0 안정판 차단 요인이다.",
  "cm4_regression_check": {
    "CM4-01": "fixed",
    "CM4-02": "partially_fixed_schema_missing",
    "CM4-03": "fixed_with_residual_scope_question",
    "CM4-04": "partially_fixed_check_incomplete",
    "CM4-05": "partially_fixed_notification_metadata_gap",
    "CM4-06": "partially_fixed_digest_stability_gap",
    "CM4-07": "partially_fixed_digest_stability_gap",
    "CM4-08": "partially_fixed_old_field_remains",
    "CM4-09": "regressed_inventory_contradiction",
    "CM4-10": "fixed",
    "CM4-11": "mostly_fixed_request_fingerprint_stale",
    "CM4-12": "mostly_fixed",
    "CM4-13": "fixed",
    "CM4-14": "fixed"
  },
  "findings": [
    {
      "id": "CM5-01",
      "severity": "blocking",
      "category": "db-schema",
      "title": "§12 인벤토리가 11 tables라고 주장하면서 실제 헤더와 §12.9.1은 10/12개 해석을 동시에 만든다",
      "evidence": [
        "§0은 DB 인벤토리를 11 tables라고 한다.",
        "§12 헤더는 여전히 'DB 인벤토리 (10 tables — executable schema)'로 남아 있다.",
        "§12.9.1은 '(별도 row per ComplianceRecord)' 및 id/FK/UNIQUE를 가진 물리 row처럼 정의한다.",
        "v0.5 changelog는 §12.9.1을 embedded라고 설명한다."
      ],
      "impact": "구현자가 PolicyReevaluateRecord를 JSON embedded child로 저장해야 하는지, 별도 table로 생성해야 하는지 결정할 수 없다. 별도 table이면 인벤토리는 12 tables가 되고, embedded이면 FK/UNIQUE 표현이 성립하지 않는다.",
      "recommendation": "둘 중 하나로 고정하라. 권장: `ContentMigrationPolicyReevaluateRecord`를 별도 table로 승격하고 인벤토리를 12 tables로 정정하거나, Batch.resultRecords JSONB로 embedded 정의 후 FK/UNIQUE를 제거하고 JSON schema/CHECK만 남겨라."
    },
    {
      "id": "CM5-02",
      "severity": "blocking",
      "category": "state-machine",
      "title": "3축 invariant CHECK가 transition matrix를 닫지 못해 불가능 조합을 DB가 허용한다",
      "evidence": [
        "§4.3.2 CHECK에서 `running`은 rollback_outcome='none'만 검사해 `running + blocked-manual-remediation-required`를 허용한다.",
        "`rolled-back`은 rollback_outcome만 검사해 `rolled-back + blocked-manual-remediation-required + partial`을 허용한다.",
        "`failed`는 remediation_status를 제한하지 않아 `failed + blocked-manual-remediation-required + none` 같은 전이 없는 조합을 허용한다.",
        "§4.3.1 abortRun은 `failed + cancellation-timeout-manual-review + failed`만 명시한다."
      ],
      "impact": "DB에 유효하지 않은 run substate가 저장될 수 있고, 운영 worker/SLA/rollback cleanup이 서로 다른 상태 해석을 하게 된다.",
      "recommendation": "primaryStatus별 remediationStatus와 rollbackOutcome의 허용 tuple을 CASE가 아니라 명시적 OR tuple로 닫아라. 예: `(primary='running' AND remediation IN ('none','cancellation-timeout-manual-review') AND rollback='none')`, `(primary='rolled-back' AND remediation='none' AND rollback IN ('full','partial'))`."
    },
    {
      "id": "CM5-03",
      "severity": "blocking",
      "category": "notification",
      "title": "step-compensated/run-aborted AuditAction cascade는 됐지만 NotificationEvent SLA가 닫히지 않았다",
      "evidence": [
        "content-migration §3.1은 `markStepCompensated`의 NotificationEvent를 `—`로 두고, `abortRun`은 `content-migration-run-failed`로 매핑한다.",
        "REVIEW_WORKFLOW §9.1 enum과 §9.1.1 매트릭스는 content-migration NotificationEvent 4종만 포함한다.",
        "REVIEW_WORKFLOW §10.2.1에는 `content-migration-step-compensated`, `content-migration-run-aborted` AuditAction 2종이 추가됐다."
      ],
      "impact": "운영 SLA에서 abort와 일반 run failed를 같은 이벤트로 처리할지, step compensation 완료를 알림 없이 audit만 남길지 불명확하다. 의료/개인정보 관련 수동 보정 작업은 운영자 확인 SLA가 필요하다.",
      "recommendation": "둘 중 하나를 SoT로 명시하라. 권장: `content-migration-run-aborted`는 별도 critical NotificationEvent로 REVIEW_WORKFLOW §9.1/§9.1.1 및 content-migration §5에 추가하고, `step-compensated`는 no-notification + audit-only SLA인지 또는 high inApp 이벤트인지 명시하라."
    },
    {
      "id": "CM5-04",
      "severity": "major",
      "category": "active-target-lock",
      "title": "ActiveTargetLock writeSetScopeDigest가 dry-run/apply 사이 step registry 변경에 안정적인지 정의되지 않았다",
      "evidence": [
        "§12.11은 `writeSetScopeDigest`를 step writeSetProjection canonical hash라고만 정의한다.",
        "§3.5 ApplyPreflightToken은 stepRegistryVersion을 CAS digest에 포함한다.",
        "§12.11 lock protocol은 runDryRun/runApply 시작 시 lock 획득만 말하고, dry-run 시점 projection과 apply 시점 projection의 동일성 검증은 별도 lock key 입력으로 닫지 않는다."
      ],
      "impact": "stepRegistryVersion 변경 시 ApplyPreflightToken은 fail할 수 있지만, lock key 산정이 이전/현재 projection 중 무엇인지 불명확해 dry-run/apply 충돌 방지 semantics가 흔들린다.",
      "recommendation": "`writeSetScopeDigest = HMAC(stepRegistryVersion + ordered stepKey + writeSetProjection canonical + targetEntityTypes)`로 고정하고, DryRunReport에 저장된 digest를 apply lock 획득에도 그대로 사용하라. registry drift 시 lock 획득 전 CAS fail로 종료하라."
    },
    {
      "id": "CM5-05",
      "severity": "major",
      "category": "apply-preflight",
      "title": "digestComputationMode와 invalidationInputs가 알고리즘에는 있지만 DryRunReport schema에는 없다",
      "evidence": [
        "§3.5는 DryRunReport row insert 시 digestComputationMode·invalidationInputs 기록을 요구한다.",
        "§12.2 ContentMigrationDryRunReport 필드에는 `digestComputationMode`, `invalidationInputs`, `cacheSourceRef`가 없다."
      ],
      "impact": "runApply가 snapshot/cache 모드의 invalidation precheck를 재현할 수 없다. CM4-02 비용/캐시 정정이 스키마 SoT에 남지 않아 구현자가 임의 column을 추가해야 한다.",
      "recommendation": "§12.2에 `digestComputationMode enum(full,snapshot,cache)`, `invalidationInputs JSONB closed`, `cacheSourceRef optional`, `generatedAt`을 추가하라."
    },
    {
      "id": "CM5-06",
      "severity": "major",
      "category": "policy-reevaluate",
      "title": "legalEntityChanged 분해가 §12.9.1과 §4.8 중간 단계에 완전히 cascade되지 않았다",
      "evidence": [
        "§3.3 PolicyReevaluateResult는 `legalSensitiveEntityChanged`와 `legalEntityIdentityChanged`를 둔다.",
        "§4.8 step 4는 여전히 `legalEntityChanged` 산정이라고 쓴다.",
        "§12.9.1은 `priorReviewRequiredChanged`·`legalEntityChanged` boolean만 저장한다."
      ],
      "impact": "stale-flags-only override 판단 근거가 runtime result와 DB 기록에서 서로 달라진다. 사후 감사 시 왜 new-record-version이 강제됐는지 재구성하기 어렵다.",
      "recommendation": "§4.8과 §12.9.1에서 `legalEntityChanged`를 제거하고 `legalSensitiveEntityChanged`, `legalEntityIdentityChanged`, `fieldProjectionDiff`를 저장하라."
    },
    {
      "id": "CM5-07",
      "severity": "major",
      "category": "idempotency",
      "title": "markStepCompensated/abortRun은 command로 추가됐지만 §3.4 requestFingerprint 표에 없다",
      "evidence": [
        "§3.1과 §3.3은 `markStepCompensated`, `abortRun` input을 추가했다.",
        "§3.4 idempotencyKey + requestFingerprint 표는 definePlan/runApply/rollbackRun/skipStep/pause/resume/cancel/approve만 포함한다.",
        "§3.4 skipStep fingerprint는 제거된 `rollbackClass`를 아직 포함한다."
      ],
      "impact": "신규 운영 command의 same-request replay와 mismatched idempotency 처리가 구현마다 달라질 수 있다.",
      "recommendation": "§3.4에 두 command를 추가하고, skipStep fingerprint에서 rollbackClass를 제거하라. markStepCompensated는 `(stepResultId,idempotencyKey)`, abortRun은 `(runId,idempotencyKey)` scope로 닫는 것이 자연스럽다."
    },
    {
      "id": "CM5-08",
      "severity": "minor",
      "category": "standalone-readiness",
      "title": "v0.4 잔여 리스크 섹션이 v0.5 반영 후에도 그대로 남아 readiness 판단을 흐린다",
      "evidence": [
        "§10.3 제목이 `v0.4 잔여 리스크`로 남아 있다.",
        "§10.3은 §6.3 acceptance fixture violation path를 open이라고 하지만 v0.5 changelog와 §6.3은 28 INV happy+violation 반영을 주장한다."
      ],
      "impact": "문서 자체가 v1.0 후보인지 v0.5 보정 중인지 모순된다.",
      "recommendation": "§10.3을 v0.5 residual risk로 재작성하고, 이미 해결된 fixture 항목은 resolved로 이동하라."
    }
  ],
  "standalone_readiness": {
    "sections_checked": ["§1.1", "§2.4", "§3.x", "§4.x", "§6.x", "§9.x", "§12.x"],
    "can_implement_as_single_sot": false,
    "blocking_gaps": [
      "§12 table inventory와 PolicyReevaluateRecord 저장 방식 불일치",
      "§4.3.2 DB CHECK invariant 미완성",
      "NotificationEvent/AuditAction SLA cascade 불완전",
      "DryRunReport schema가 digestComputationMode/invalidationInputs를 누락"
    ]
  },
  "legal_privacy_operability": {
    "medical_ad_law_operable": false,
    "privacy_law_operable": "partially",
    "reason": "PII export CHECK 자체는 정정됐지만, 수동 보정/abort 알림 SLA와 policy reevaluate 법적 엔티티 변경 기록이 닫히지 않아 의료법·개인정보보호법 운영 감사 기준으로는 부족하다."
  },
  "required_changes_before_v1_0": [
    "§12 인벤토리와 §12.9.1 저장 모델을 단일 결정으로 정리",
    "§4.3.2를 tuple 기반 DB CHECK로 재작성",
    "REVIEW_WORKFLOW §9.1/§9.1.1 및 content-migration §5에 abort/compensation 알림 정책 명시",
    "§12.2 DryRunReport에 digestComputationMode/invalidationInputs/cacheSourceRef/generatedAt 추가",
    "§12.9.1의 legalEntityChanged 잔재 제거",
    "§3.4 requestFingerprint 표를 신규 command와 SkipStepInput 변경에 맞게 갱신"
  ],
  "v1_0_stability_gate": {
    "blocking_count": 3,
    "sot_cascade_synced": false,
    "ready_if_fixed": "CM5-01, CM5-02, CM5-03은 안정판 차단. CM5-04~CM5-07은 v1.0 전 정합성 보강 필요."
  }
}


codex
초기 대조 결과상 v0.6은 5차 지적 대부분을 반영한 것으로 보입니다. 다만 안정판 판정은 숫자 표기, enum cascade, CHECK tuple, requestFingerprint/DB schema 같은 닫힌 계약을 기준으로 다시 세밀하게 보겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"4종 NotificationEventType|6종 NotificationEventType|NotificationEventType|content-migration-run-aborted|content-migration-step-compensated|eventType.*enum|NotificationEvent 매핑|§ 9\\.1|§ 9\\.1\\.1|13종 AuditAction|15종 AuditAction\" docs/features/content-migration.md docs/admin/REVIEW_WORKFLOW.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"3\\.4|requestFingerprint|markStepCompensated|abortRun|skipStep|rollbackClass\" docs/features/content-migration.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"4\\.3\\.1|4\\.3\\.2|valid tuple|CHECK|primaryStatus|remediationStatus|rollbackOutcome|abortRun\" docs/features/content-migration.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"12\\.10-pre|12\\.10 |12\\.11 |12\\.12|ContentMigrationNotificationOutbox|ContentMigrationActiveTargetLock|총 12개|12 tables|eventType.*4종|NotificationEventType 4종\" docs/features/content-migration.md" in C:\Users\assag\solution\website-exposure
 succeeded in 606ms:
docs/admin/REVIEW_WORKFLOW.md:194:| **blocked** 정정 (fail 흐름, 큐 아님) | 24시간 내 작성자 응답 | § 9.1.1 `blocked-correction-required` |
docs/admin/REVIEW_WORKFLOW.md:195:| content-gate 큐 P0 | 영업일 3일 내 처리 | § 9.1.1 `content-gate-queued` |
docs/admin/REVIEW_WORKFLOW.md:196:| stale 큐 P1 | 영업일 7일 내 처리 (의료법 개정은 영업일 5일) | § 9.1.1 `stale-queued` |
docs/admin/REVIEW_WORKFLOW.md:197:| warning 큐 P2 | 영업일 14일 또는 다음 발행 시 일괄 처리 | § 9.1.1 `warning-queued` |
docs/admin/REVIEW_WORKFLOW.md:199:SLA 미달 시 운영팀 에스컬레이션 — § 9.1.1 `sla-overdue` (criticality=critical, quietHours bypass).
docs/admin/REVIEW_WORKFLOW.md:201:> 본 표의 "처리 영역"은 검수 워크플로 SLA 영역이며, 채널·주기 등 알림 정책은 § 9.1.1 매트릭스를 SoT로 따른다.
docs/admin/REVIEW_WORKFLOW.md:464:### 9.1 NotificationEventType enum (canonical SoT)
docs/admin/REVIEW_WORKFLOW.md:467:type NotificationEventType =
docs/admin/REVIEW_WORKFLOW.md:513:  | "content-migration-run-aborted"           // CM5-03 — abortRun 강제 종료 (critical)
docs/admin/REVIEW_WORKFLOW.md:514:  | "content-migration-step-compensated";     // CM5-03 — markStepCompensated (high inApp)
docs/admin/REVIEW_WORKFLOW.md:562:| `content-migration-run-aborted` | run 강제 종료 (abortRun) | super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
docs/admin/REVIEW_WORKFLOW.md:563:| `content-migration-step-compensated` | manual compensation 적용 (markStepCompensated) | super-admin | inApp | (없음) | (옵션) email 일일 요약 | high | respect | digestOptOut 허용 |
docs/admin/REVIEW_WORKFLOW.md:582:  eventType: NotificationEventType;                    // § 9.1 enum
docs/admin/REVIEW_WORKFLOW.md:586:  criticality: "critical" | "high" | "normal";         // § 9.1.1 매트릭스에서 자동 산정 가능. 호출자가 override 가능
docs/admin/REVIEW_WORKFLOW.md:599:  eventType: NotificationEventType;
docs/admin/REVIEW_WORKFLOW.md:705:  | "content-migration-step-compensated"      // CM4-05 — markStepCompensated
docs/admin/REVIEW_WORKFLOW.md:706:  | "content-migration-run-aborted";          // CM4-05 — abortRun
docs/admin/REVIEW_WORKFLOW.md:806:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1)·(2) § 2.3 상태 전이 완전화 — `blocked → draft`·`rejected → draft`/`review-queued` 분리·`request-changes` 전이·`published → blocked` 사후 fail·`published → stale` 우선순위 추가, (3) § 3.1.1 warning 큐 이탈 조건·기록 슬롯 신설 (acknowledged·resolved). § 7.1 (6) publishable 조건 추가, (4) § 4.1 AND 게이트 평가 알고리즘 정밀화 — priorReview·LegalDocument legal 자동 추가 + approved vs publishable 시점 분리 명시, (5) § 4.1 riskLevel 출처 명시 — `ComplianceRecord.pageRiskLevel` (RiskInference MAX 결합 결과), (6) § 7.1 LegalDocument 조건 — `legalCounsel` + `legalCounselAt` 둘 다 필수. 각 역할 매핑 timestamp 필드도 모두 명시, (7) § 5.2 ComplianceRecord 생명주기 2단계 분리 — pre-publish(mutable) vs published(immutable). C-10 required 필드 충돌 해소(AW-10), (8) § 5.4 staleFlags를 별도 `StaleFlagsRegistry` 컬렉션으로 분리 — published record 불변성 보장(AW-11), (9) § 6.2 stale 처리 흐름 명확화 — published 표면 유지·재발행 명시 액션 필요·이전 record audit log 보존, (10) § 4.1·§ 8 사전심의와 publishable 결합 명시 — `priorReviewRequired=true` 시 finalRoles에 legal 자동 추가, (11) § 3.1·§ 9.1 content-gate 큐 처리자·알림 수신자를 `finalRoles[]` 기준으로 정정 — operator·등급 기본 medical 포함, (12) § 11.2 super-admin 자격 우회 금지 — medical/legal/client approve 시 RISK_LEVELS § 4 자격 검증 필수 |
docs/features/content-migration.md:9:> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (4종 NotificationEventType + **13종 AuditAction** cascade 완료)
docs/features/content-migration.md:110:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 4종 NotificationEventType |
docs/features/content-migration.md:111:| REVIEW_WORKFLOW § 10.2.1 | 13종 AuditAction |
docs/features/content-migration.md:150:          dispatchAllowlist:                            # CM3-03 + CM4-13 — REVIEW_WORKFLOW § 9.1.1 derived rule + hash drift 방지
docs/features/content-migration.md:151:            # derived rule: criticality ∈ {high, critical} (REVIEW_WORKFLOW § 9.1.1 SoT)
docs/features/content-migration.md:231:| 실행 | `markStepCompensated` (CM4-05) | manual remediation compensation 적용 표시 | super-admin + remediationTicketRef | `content-migration-step-compensated` | **`content-migration-step-compensated`** (CM5-03) |
docs/features/content-migration.md:232:| 실행 | `abortRun` (CM4-05) | cancellation-timeout 또는 blocked-manual-remediation 강제 종료 | super-admin + remediationTicketRef + 운영 ticket | `content-migration-run-aborted` | **`content-migration-run-aborted`** (CM5-03 — 별도 critical 이벤트) |
docs/features/content-migration.md:741:### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT — 6종)
docs/features/content-migration.md:749:| `content-migration-run-aborted` (CM5-03) | **critical** | email + inApp | super-admin |
docs/features/content-migration.md:750:| `content-migration-step-compensated` (CM5-03) | high | inApp | super-admin |
docs/features/content-migration.md:754:### 5.3 NotificationEvent 매핑
docs/features/content-migration.md:762:| `content-migration-run-aborted` (CM5-03) | `run` | runId | `hash("content-migration:run:" + runId + ":aborted")` |
docs/features/content-migration.md:763:| `content-migration-step-compensated` (CM5-03) | `step` | stepResultId | `hash("content-migration:step:" + stepResultId + ":compensated")` |
docs/features/content-migration.md:819:| INV-DISPATCH-DRIFT (CM4-13) | § 9.1 dispatchAllowlistPolicySnapshot mismatch | notification |
docs/features/content-migration.md:882:- **`readOnlyWindow.dispatchAllowlistPolicySnapshot` mismatch** — REVIEW_WORKFLOW § 9.1.1 현재 매트릭스 hash와 불일치 (CM4-13)
docs/features/content-migration.md:1006:| 2026-05-15 | **v0.6** | **codex 5차 비평 8 지적 전건 수용 — v1.0 안정판 후보**: (1) **§ 12 인벤토리 12 tables로 통일** — PolicyReevaluateRecord 별도 table 승격 (§ 12.10 / 기존 NotificationOutbox·ActiveTargetLock은 12.11·12.12로 이동) (CM5-01), (2) **§ 4.3.2 3축 invariant DB CHECK tuple 기반 재작성** — 8 valid tuple 명시. 잘못된 조합 DB reject (CM5-02), (3) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — content-migration-run-aborted (critical) + step-compensated (high) NotificationEvent 2종 추가 + 본문 § 3.1·§ 5.1·§ 5.3 매핑 (CM5-03), (4) **writeSetScopeDigest 고정 정의** — HMAC(digestPepperRef, stepRegistryVersion + ordered(stepKey + writeSetProjection canonical + targetEntityTypes)). DryRunReport에 저장·ActiveTargetLock에 재사용 (CM5-04), (5) **§ 12.2 DryRunReport schema에 digestComputationMode·invalidationInputs·cacheSourceRef·generatedAt·writeSetScopeDigest 추가** (CM5-05), (6) **§ 4.8·§ 12.10 legalEntityChanged 잔재 제거** — legalSensitiveEntityChanged·legalEntityIdentityChanged·fieldProjectionDiff cascade (CM5-06), (7) **§ 3.4 requestFingerprint 표 갱신** — markStepCompensated·abortRun 추가 + skipStep에서 rollbackClass 제거 (CM5-07), (8) **§ 10.3 v0.6 잔여 리스크로 갱신** (CM5-08) |
docs/features/content-migration.md:1007:| 2026-05-15 | (v0.4 — 이전 비고) | **codex 3차 비평 21 지적 전건 수용** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |
docs/features/content-migration.md:1257:| `eventType` | enum (NotificationEventType 4종) | ✅ |

 succeeded in 609ms:
21:- **핵심 책임**: (a) migration plan 정의·validate·dry-run·legal-gate·apply, (b) rollbackClass 강제 + writeSetManifest strategy별 partial write 감지, (c) read-only window writeClass 7종 세분화, (d) ApplyPreflightToken (8필드 server-side CAS), (e) policy-version-reevaluate risk-based + PolicyReevaluateResult 비교, (f) deterministic legalImpactClassifier + PII·entity field catalog SoT, (g) Run status primaryStatus + substate
177:        overrideAllowed: ["new-record-version"]         # CM3-15 — stale-flags-only override는 별도 CHECK 통과 시만
232:| 실행 | `abortRun` (CM4-05) | cancellation-timeout 또는 blocked-manual-remediation 강제 종료 | super-admin + remediationTicketRef + 운영 ticket | `content-migration-run-aborted` | **`content-migration-run-aborted`** (CM5-03 — 별도 critical 이벤트) |
367:  expectedSubstate: { primaryStatus: RunPrimaryStatus; remediationStatus: RunRemediationStatus };  // CAS
409:| `abortRun` (CM5-07) | `(runId, idempotencyKey)` UNIQUE | HMAC(... runId + reason hash + operationalTicketRef + expectedSubstate) |
567:   - ContentMigrationRun insert (primaryStatus=running)
583:4. 완료 → rollbackOutcome=full (skippedIrreversibleSteps=0) 또는 partial (skipped 있음)
584:5. rollback 실패 → rollbackOutcome=failed + super-admin alert
590:#### 4.3.1 명령별 transition
592:| 호출 | primaryStatus 전제 | 동작 | 결과 (primary·remediation·rollbackOutcome) |
605:| abortRun (CM4-05) | running·cancellation-timeout-manual-review 또는 rolling-back·blocked-manual-remediation-required | 강제 종료 + 운영 ticket 필수 | failed·cancellation-timeout-manual-review·**failed** (rollback 시도 실패 또는 timeout) |
607:#### 4.3.2 3축 invariant DB CHECK — tuple 기반 (CM5-02 정정)
610:CHECK (
622:**partial-rollback은 별도 primaryStatus 아님** — `primaryStatus='rolled-back' + rollbackOutcome='partial'`로 표현.
731:   - stale-flags-only override는 `staleFlagsOnlyOverrideConditions` (maxRiskLevel=low + no legal entity change + no priorReview change) CHECK 통과 시만 (CM3-15)
806:| INV-POLICY-REEVAL-OVERRIDE | § 9.2 stale-flags-only override CHECK | policy |
816:| INV-RUN-STATUS-3AXIS (CM4-04) | § 12.4 CHECK 3축 invariant | state-machine |
844:| INV-PRIVACY-EXPORT | non-pii step export → 허용 | pii step + export_allowed=true insert 시도 → DB CHECK reject |
850:| **INV-RUN-STATUS-3AXIS** (CM4-04) | primaryStatus=rolled-back + rollbackOutcome=full → 정상 | primaryStatus=rolled-back + rollbackOutcome=none → CHECK reject |
907:- cooperative cancellation 미지원 step + pauseRun + timeout → `cancellation-timeout-manual-review` remediationStatus [INV-CANCEL-TIMEOUT]
911:- active run (`primaryStatus IN ('pending','running','paused','rolling-back')` + remediationStatus ≠ none) + 동일 plan apply 시도 → 409 [INV-RUN-ACTIVE-UNIQUE]
914:- **PII StepResult export 시도** (`contains_pii=true + export_allowed=true`) → DB CHECK reject + audit [INV-PRIVACY-EXPORT] (CM4-12)
984:| ~~CM-10~~ | abortRun command — v1.0 § 3.1·§ 3.3·§ 4.3 (CM4-05) |
1005:| 2026-05-15 | **v0.5** | **codex 4차 비평 14 지적 전건 수용**: (1) **ApplyPreflightToken opaque + dryRunReportId explicit lookup** — RunApplyInput에 dryRunReportId 추가 (CM4-01), (2) **digestComputationMode 3종** (full·snapshot·cache) + invalidationInputs cache invalidation 정밀화 (CM4-02), (3) **append-only-watermark concurrency 강화** — lowerBound·exclusiveUpperBound·sourcePredicateHash·writerIdField·expectedInsertedCount·concurrencyMode + phantom row writerId 검사 (CM4-03), (4) **Run status 3축 transition matrix § 4.3.1 + DB CHECK § 4.3.2/§ 12.4** — partial-rollback은 별도 primaryStatus 아님 (CM4-04), (5) **markStepCompensated·abortRun v1.0 정식 command** + CM-10·11 resolved 격상 + REVIEW_WORKFLOW cascade 2종 추가 (CM4-05), (6) **ContentMigrationActiveTargetLock § 12.11 신설** — instanceId+targetSetDigest+writeSetScopeDigest active unique. dry-run·apply 동시성 차단 (CM4-06·07), (7) **legalEntityChanged 분해** → legalSensitiveEntityChanged + legalEntityIdentityChanged. staleFlagsOnlyOverrideConditions 정렬 (CM4-08), (8) **§ 12.9.1 embedded 명시** + 인벤토리 11 tables로 정정 (§ 12.1-§ 12.11) (CM4-09), (9) **PII export DB CHECK SQL canonical** `CHECK (NOT contains_pii OR export_allowed = false)` (CM4-10), (10) **SkipStepInput에서 rollbackClass 제거** — irreversible only. manual-remediation-required는 remediationStatus reason (CM4-11), (11) **§ 6.3 fixture matrix 28 INV × happy + violation 각 1쌍** + § 9.2에 same-request replay·PII export·ActiveTargetLock 충돌 fail rule 추가 (CM4-12), (12) **dispatchAllowlistPolicySnapshot** — REVIEW_WORKFLOW 매트릭스 hash drift 시 build fail (CM4-13), (13) **§ 1.1 SemVer 4행 추가** — writeSetManifest strategy semantic·policy-reevaluate decision rule·staleFlagsOnlyOverrideConditions·ActiveTargetLock 변경 (CM4-14) |
1006:| 2026-05-15 | **v0.6** | **codex 5차 비평 8 지적 전건 수용 — v1.0 안정판 후보**: (1) **§ 12 인벤토리 12 tables로 통일** — PolicyReevaluateRecord 별도 table 승격 (§ 12.10 / 기존 NotificationOutbox·ActiveTargetLock은 12.11·12.12로 이동) (CM5-01), (2) **§ 4.3.2 3축 invariant DB CHECK tuple 기반 재작성** — 8 valid tuple 명시. 잘못된 조합 DB reject (CM5-02), (3) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — content-migration-run-aborted (critical) + step-compensated (high) NotificationEvent 2종 추가 + 본문 § 3.1·§ 5.1·§ 5.3 매핑 (CM5-03), (4) **writeSetScopeDigest 고정 정의** — HMAC(digestPepperRef, stepRegistryVersion + ordered(stepKey + writeSetProjection canonical + targetEntityTypes)). DryRunReport에 저장·ActiveTargetLock에 재사용 (CM5-04), (5) **§ 12.2 DryRunReport schema에 digestComputationMode·invalidationInputs·cacheSourceRef·generatedAt·writeSetScopeDigest 추가** (CM5-05), (6) **§ 4.8·§ 12.10 legalEntityChanged 잔재 제거** — legalSensitiveEntityChanged·legalEntityIdentityChanged·fieldProjectionDiff cascade (CM5-06), (7) **§ 3.4 requestFingerprint 표 갱신** — markStepCompensated·abortRun 추가 + skipStep에서 rollbackClass 제거 (CM5-07), (8) **§ 10.3 v0.6 잔여 리스크로 갱신** (CM5-08) |
1007:| 2026-05-15 | (v0.4 — 이전 비고) | **codex 3차 비평 21 지적 전건 수용** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |
1082:| `primaryStatus` | enum (pending·running·paused·completed·failed·cancelled·rolling-back·rolled-back) | ✅ |
1083:| `remediationStatus` | enum (none·blocked-manual-remediation-required·cancellation-timeout-manual-review) | ✅ default none |
1084:| `rollbackOutcome` | enum (none·full·partial·failed) | ✅ default none |
1085:| **CHECK** | § 4.3.2 3축 invariant DB CHECK (CM4-04) | |
1121:- `CHECK (privacy_class != 'non-pii' OR contains_pii = false)`
1122:- `CHECK (NOT contains_pii OR export_allowed = false)` — PII step export 금지 DB 강제 (CM4-10)
1292:- `CHECK ((kind='apply' AND run_id IS NOT NULL AND dry_run_plan_id IS NULL) OR (kind='dry-run' AND run_id IS NULL AND dry_run_plan_id IS NOT NULL))`

 succeeded in 629ms:
21:- **핵심 책임**: (a) migration plan 정의·validate·dry-run·legal-gate·apply, (b) rollbackClass 강제 + writeSetManifest strategy별 partial write 감지, (c) read-only window writeClass 7종 세분화, (d) ApplyPreflightToken (8필드 server-side CAS), (e) policy-version-reevaluate risk-based + PolicyReevaluateResult 비교, (f) deterministic legalImpactClassifier + PII·entity field catalog SoT, (g) Run status primaryStatus + substate
25:- **rollbackClass 3종**: `reversible`·`compensating`·`irreversible` (자동 skip 금지·blocked-manual-remediation-required)
40:| step type 추가 (rollbackClass·reverse-step 정의 통과) | MINOR | 별개 | |
43:| rollback 알고리즘·rollbackClass enum 변경 | **MAJOR** | policyVersion 신규 | |
70:- 본 문서 = plan/step/파이프라인·rollbackClass·writeSetManifest·CAS digest·legalImpactClassifier rule·read-only writeClass·step registry 최소 계약·privacy·NotificationEvent mapping SoT
208:| `requestFingerprint` | command별 (§ 3.4) |
222:| 실행 | `validatePlan` | step·rollbackClass·classifier | super-admin | `content-migration-plan-validated` | — |
230:| 실행 | `skipStep` | irreversible step skip | super-admin + remediationTicketRef | `content-migration-step-skipped` | — |
231:| 실행 | `markStepCompensated` (CM4-05) | manual remediation compensation 적용 표시 | super-admin + remediationTicketRef | `content-migration-step-compensated` | **`content-migration-step-compensated`** (CM5-03) |
232:| 실행 | `abortRun` (CM4-05) | cancellation-timeout 또는 blocked-manual-remediation 강제 종료 | super-admin + remediationTicketRef + 운영 ticket | `content-migration-run-aborted` | **`content-migration-run-aborted`** (CM5-03 — 별도 critical 이벤트) |
238:### 3.1.1 AuditAction metadata 표 (CM3-19 — actorId·requestFingerprint·8필드 일관)
240:**공통 metadata required (모든 AuditAction)**: `actorId`·`actorRole`·`idempotencyKey`·`requestFingerprint`.
245:| `content-migration-plan-validated` | rollbackClassSummary·legalImpactClassification·classifierVersion·warningsCount·stepRegistryVersion·validateFailReasons[] |
256:| `content-migration-step-skipped` | reason·approver·rollbackClass·affectedRowsConfirmation·remediationTicketRef·classifierVersion |
298:  rollbackClass: RollbackClass;
299:  reverseStep?: MigrationStep;                          // rollbackClass=reversible 필수
300:  compensatingStep?: MigrationStep;                     // rollbackClass=compensating 필수
342:  stepResultId: string;                                 // CM4-11 — rollbackClass=irreversible만 허용
400:### 3.4 idempotencyKey + requestFingerprint (CM3-19)
402:| command | scope | requestFingerprint |
407:| `skipStep` | `(stepResultId, idempotencyKey)` UNIQUE | HMAC(... stepResultId + remediationTicketRef + affectedRowsConfirmation) (CM5-07 — rollbackClass 제거) |
408:| `markStepCompensated` (CM5-07) | `(stepResultId, idempotencyKey)` UNIQUE | HMAC(... stepResultId + compensationDescription + remediationTicketRef + affectedRowsConfirmation) |
409:| `abortRun` (CM5-07) | `(runId, idempotencyKey)` UNIQUE | HMAC(... runId + reason hash + operationalTicketRef + expectedSubstate) |
443:  rollbackClassDefault: RollbackClass;
547:   - rollbackClass별 reverse/compensating/blastRadius 검증
582:   - irreversible: **blocked-manual-remediation-required** 진입. 운영자 명시적 skipStep 호출 필요
602:| skipStep | rolling-back·blocked-manual-remediation-required | step skipped 처리 | rolling-back·blocked-manual-remediation-required (skipped step 누적) → 모든 skipped 후 정리 시 rolled-back·none·**partial** |
603:| markStepCompensated (CM4-05) | rolling-back·blocked-manual-remediation-required | compensation 적용 표시 | rolling-back·blocked-manual-remediation-required → 정리 시 rolled-back·none·**partial** |
605:| abortRun (CM4-05) | running·cancellation-timeout-manual-review 또는 rolling-back·blocked-manual-remediation-required | 강제 종료 + 운영 ticket 필수 | failed·cancellation-timeout-manual-review·**failed** (rollback 시도 실패 또는 timeout) |
797:| INV-ROLLBACK-SKIP | § 9.2 skipStep 필수 metadata | skip |
830:| INV-ROLLBACK-IRREVERSIBLE | 모두 reversible → full rollback | irreversible 포함 → blocked-manual-remediation-required → skipStep + partial |
908:- skipStep + rollbackClass ∉ ("irreversible","manual-remediation-required") → runtime fail
909:- skipStep + (reason·approver·remediationTicketRef·affectedRowsConfirmation 누락) → runtime fail [INV-ROLLBACK-SKIP]
913:- **same-request replay** — `requestFingerprint` 일치 시 기존 결과 반환 (no-op) [INV-IDEMPOTENCY-REPLAY] (CM4-12)
922:- step.rollbackClass=reversible + reverseStep 누락 → validate fail
923:- step.rollbackClass=compensating + compensatingStep 누락 → validate fail
924:- step.rollbackClass=irreversible + (blastRadiusCap 누락 또는 backupSnapshotRequired=false) → validate fail
958:- rollbackClass=irreversible 비율 > 10%
984:| ~~CM-10~~ | abortRun command — v1.0 § 3.1·§ 3.3·§ 4.3 (CM4-05) |
985:| ~~CM-11~~ | markStepCompensated command — 동일 (CM4-05) |
1005:| 2026-05-15 | **v0.5** | **codex 4차 비평 14 지적 전건 수용**: (1) **ApplyPreflightToken opaque + dryRunReportId explicit lookup** — RunApplyInput에 dryRunReportId 추가 (CM4-01), (2) **digestComputationMode 3종** (full·snapshot·cache) + invalidationInputs cache invalidation 정밀화 (CM4-02), (3) **append-only-watermark concurrency 강화** — lowerBound·exclusiveUpperBound·sourcePredicateHash·writerIdField·expectedInsertedCount·concurrencyMode + phantom row writerId 검사 (CM4-03), (4) **Run status 3축 transition matrix § 4.3.1 + DB CHECK § 4.3.2/§ 12.4** — partial-rollback은 별도 primaryStatus 아님 (CM4-04), (5) **markStepCompensated·abortRun v1.0 정식 command** + CM-10·11 resolved 격상 + REVIEW_WORKFLOW cascade 2종 추가 (CM4-05), (6) **ContentMigrationActiveTargetLock § 12.11 신설** — instanceId+targetSetDigest+writeSetScopeDigest active unique. dry-run·apply 동시성 차단 (CM4-06·07), (7) **legalEntityChanged 분해** → legalSensitiveEntityChanged + legalEntityIdentityChanged. staleFlagsOnlyOverrideConditions 정렬 (CM4-08), (8) **§ 12.9.1 embedded 명시** + 인벤토리 11 tables로 정정 (§ 12.1-§ 12.11) (CM4-09), (9) **PII export DB CHECK SQL canonical** `CHECK (NOT contains_pii OR export_allowed = false)` (CM4-10), (10) **SkipStepInput에서 rollbackClass 제거** — irreversible only. manual-remediation-required는 remediationStatus reason (CM4-11), (11) **§ 6.3 fixture matrix 28 INV × happy + violation 각 1쌍** + § 9.2에 same-request replay·PII export·ActiveTargetLock 충돌 fail rule 추가 (CM4-12), (12) **dispatchAllowlistPolicySnapshot** — REVIEW_WORKFLOW 매트릭스 hash drift 시 build fail (CM4-13), (13) **§ 1.1 SemVer 4행 추가** — writeSetManifest strategy semantic·policy-reevaluate decision rule·staleFlagsOnlyOverrideConditions·ActiveTargetLock 변경 (CM4-14) |
1006:| 2026-05-15 | **v0.6** | **codex 5차 비평 8 지적 전건 수용 — v1.0 안정판 후보**: (1) **§ 12 인벤토리 12 tables로 통일** — PolicyReevaluateRecord 별도 table 승격 (§ 12.10 / 기존 NotificationOutbox·ActiveTargetLock은 12.11·12.12로 이동) (CM5-01), (2) **§ 4.3.2 3축 invariant DB CHECK tuple 기반 재작성** — 8 valid tuple 명시. 잘못된 조합 DB reject (CM5-02), (3) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — content-migration-run-aborted (critical) + step-compensated (high) NotificationEvent 2종 추가 + 본문 § 3.1·§ 5.1·§ 5.3 매핑 (CM5-03), (4) **writeSetScopeDigest 고정 정의** — HMAC(digestPepperRef, stepRegistryVersion + ordered(stepKey + writeSetProjection canonical + targetEntityTypes)). DryRunReport에 저장·ActiveTargetLock에 재사용 (CM5-04), (5) **§ 12.2 DryRunReport schema에 digestComputationMode·invalidationInputs·cacheSourceRef·generatedAt·writeSetScopeDigest 추가** (CM5-05), (6) **§ 4.8·§ 12.10 legalEntityChanged 잔재 제거** — legalSensitiveEntityChanged·legalEntityIdentityChanged·fieldProjectionDiff cascade (CM5-06), (7) **§ 3.4 requestFingerprint 표 갱신** — markStepCompensated·abortRun 추가 + skipStep에서 rollbackClass 제거 (CM5-07), (8) **§ 10.3 v0.6 잔여 리스크로 갱신** (CM5-08) |
1007:| 2026-05-15 | (v0.4 — 이전 비고) | **codex 3차 비평 21 지적 전건 수용** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |
1020:| `requestFingerprint` | char(64) | ✅ |
1081:| `idempotencyKey`·`requestFingerprint` | string·char(64) | ✅ |
1115:| `rollbackClass` | enum | ✅ |
1190:| `rollbackClass` | enum | ✅ |

 succeeded in 621ms:
26:- **DB 인벤토리 (CM5-01 정정)**: **12 tables** (§ 12.1 ~ § 12.12 — PolicyReevaluateRecord 별도 table 승격·ActiveTargetLock 신설)
77:| ContentMigrationNotificationOutbox | 상수 5 | § 4.6 자체 SQL — backoff [60, 300, 1800, 7200, 21600]s |
993:| ~~§ 12 인벤토리·PolicyReevaluateRecord~~ | ~~resolved (v0.6 § 12.9.1 별도 table 승격 — 12 tables)~~ |
1005:| 2026-05-15 | **v0.5** | **codex 4차 비평 14 지적 전건 수용**: (1) **ApplyPreflightToken opaque + dryRunReportId explicit lookup** — RunApplyInput에 dryRunReportId 추가 (CM4-01), (2) **digestComputationMode 3종** (full·snapshot·cache) + invalidationInputs cache invalidation 정밀화 (CM4-02), (3) **append-only-watermark concurrency 강화** — lowerBound·exclusiveUpperBound·sourcePredicateHash·writerIdField·expectedInsertedCount·concurrencyMode + phantom row writerId 검사 (CM4-03), (4) **Run status 3축 transition matrix § 4.3.1 + DB CHECK § 4.3.2/§ 12.4** — partial-rollback은 별도 primaryStatus 아님 (CM4-04), (5) **markStepCompensated·abortRun v1.0 정식 command** + CM-10·11 resolved 격상 + REVIEW_WORKFLOW cascade 2종 추가 (CM4-05), (6) **ContentMigrationActiveTargetLock § 12.11 신설** — instanceId+targetSetDigest+writeSetScopeDigest active unique. dry-run·apply 동시성 차단 (CM4-06·07), (7) **legalEntityChanged 분해** → legalSensitiveEntityChanged + legalEntityIdentityChanged. staleFlagsOnlyOverrideConditions 정렬 (CM4-08), (8) **§ 12.9.1 embedded 명시** + 인벤토리 11 tables로 정정 (§ 12.1-§ 12.11) (CM4-09), (9) **PII export DB CHECK SQL canonical** `CHECK (NOT contains_pii OR export_allowed = false)` (CM4-10), (10) **SkipStepInput에서 rollbackClass 제거** — irreversible only. manual-remediation-required는 remediationStatus reason (CM4-11), (11) **§ 6.3 fixture matrix 28 INV × happy + violation 각 1쌍** + § 9.2에 same-request replay·PII export·ActiveTargetLock 충돌 fail rule 추가 (CM4-12), (12) **dispatchAllowlistPolicySnapshot** — REVIEW_WORKFLOW 매트릭스 hash drift 시 build fail (CM4-13), (13) **§ 1.1 SemVer 4행 추가** — writeSetManifest strategy semantic·policy-reevaluate decision rule·staleFlagsOnlyOverrideConditions·ActiveTargetLock 변경 (CM4-14) |
1006:| 2026-05-15 | **v0.6** | **codex 5차 비평 8 지적 전건 수용 — v1.0 안정판 후보**: (1) **§ 12 인벤토리 12 tables로 통일** — PolicyReevaluateRecord 별도 table 승격 (§ 12.10 / 기존 NotificationOutbox·ActiveTargetLock은 12.11·12.12로 이동) (CM5-01), (2) **§ 4.3.2 3축 invariant DB CHECK tuple 기반 재작성** — 8 valid tuple 명시. 잘못된 조합 DB reject (CM5-02), (3) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — content-migration-run-aborted (critical) + step-compensated (high) NotificationEvent 2종 추가 + 본문 § 3.1·§ 5.1·§ 5.3 매핑 (CM5-03), (4) **writeSetScopeDigest 고정 정의** — HMAC(digestPepperRef, stepRegistryVersion + ordered(stepKey + writeSetProjection canonical + targetEntityTypes)). DryRunReport에 저장·ActiveTargetLock에 재사용 (CM5-04), (5) **§ 12.2 DryRunReport schema에 digestComputationMode·invalidationInputs·cacheSourceRef·generatedAt·writeSetScopeDigest 추가** (CM5-05), (6) **§ 4.8·§ 12.10 legalEntityChanged 잔재 제거** — legalSensitiveEntityChanged·legalEntityIdentityChanged·fieldProjectionDiff cascade (CM5-06), (7) **§ 3.4 requestFingerprint 표 갱신** — markStepCompensated·abortRun 추가 + skipStep에서 rollbackClass 제거 (CM5-07), (8) **§ 10.3 v0.6 잔여 리스크로 갱신** (CM5-08) |
1007:| 2026-05-15 | (v0.4 — 이전 비고) | **codex 3차 비평 21 지적 전건 수용** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |
1011:## 12. DB 인벤토리 (12 tables — executable schema)
1048:| `writeSetScopeDigest` | char(64) | ✅ — § 12.11 lock 산정에 재사용 (CM5-04) |
1228:### 12.10-pre `ContentMigrationPolicyReevaluateRecord` (CM5-01 — 별도 table 승격)
1250:### 12.10 `ContentMigrationNotificationOutbox` (CM3-14)
1257:| `eventType` | enum (NotificationEventType 4종) | ✅ |
1274:### 12.11 `ContentMigrationActiveTargetLock` (CM4-06·07 신설)
1307:**총 12개 admin DB 테이블** (CM5-01 정정):
1320:| 12.10 | `ContentMigrationPolicyReevaluateRecord` (CM5-01 — 별도 table) |
1321:| 12.11 | `ContentMigrationNotificationOutbox` |
1322:| 12.12 | `ContentMigrationActiveTargetLock` |

codex
핵심 차단 수준의 구조 모순은 보이지 않지만, 알림 enum 카운트와 outbox schema에 오래된 “4종” 표기가 남아 있습니다. 이건 단순 요약 오타보다 구현자가 DB enum을 4개로 만들 수 있는 계약 충돌이라, 판정에 반영하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -LiteralPath 'docs/features/content-migration.md' | Select-Object -Skip 600 -First 35" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -LiteralPath 'docs/features/content-migration.md' | Select-Object -Skip 735 -First 35" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -LiteralPath 'docs/features/content-migration.md' | Select-Object -Skip 1245 -First 55" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -LiteralPath 'docs/admin/REVIEW_WORKFLOW.md' | Select-Object -Skip 460 -First 110" in C:\Users\assag\solution\website-exposure
 succeeded in 636ms:
| (rollback 부분 완료) | rolling-back·none | irreversible 만남 | rolling-back·**blocked-manual-remediation-required**·none |
| skipStep | rolling-back·blocked-manual-remediation-required | step skipped 처리 | rolling-back·blocked-manual-remediation-required (skipped step 누적) → 모든 skipped 후 정리 시 rolled-back·none·**partial** |
| markStepCompensated (CM4-05) | rolling-back·blocked-manual-remediation-required | compensation 적용 표시 | rolling-back·blocked-manual-remediation-required → 정리 시 rolled-back·none·**partial** |
| pause + cooperative 미지원 timeout (§ 4.5 stepTimeoutSeconds 초과) | running·none | step row lock 해제 | running·**cancellation-timeout-manual-review**·none |
| abortRun (CM4-05) | running·cancellation-timeout-manual-review 또는 rolling-back·blocked-manual-remediation-required | 강제 종료 + 운영 ticket 필수 | failed·cancellation-timeout-manual-review·**failed** (rollback 시도 실패 또는 timeout) |

#### 4.3.2 3축 invariant DB CHECK — tuple 기반 (CM5-02 정정)

```sql
CHECK (
  (primary_status='pending'      AND remediation_status='none' AND rollback_outcome='none') OR
  (primary_status='running'      AND remediation_status IN ('none','cancellation-timeout-manual-review') AND rollback_outcome='none') OR
  (primary_status='paused'       AND remediation_status='none' AND rollback_outcome='none') OR
  (primary_status='completed'    AND remediation_status='none' AND rollback_outcome='none') OR
  (primary_status='failed'       AND remediation_status IN ('none','cancellation-timeout-manual-review') AND rollback_outcome IN ('none','failed')) OR
  (primary_status='cancelled'    AND remediation_status='none' AND rollback_outcome='none') OR
  (primary_status='rolling-back' AND remediation_status IN ('none','blocked-manual-remediation-required') AND rollback_outcome='none') OR
  (primary_status='rolled-back'  AND remediation_status='none' AND rollback_outcome IN ('full','partial'))
)
```

**partial-rollback은 별도 primaryStatus 아님** — `primaryStatus='rolled-back' + rollbackOutcome='partial'`로 표현.

### 4.4 retry exhausted vs autoRollbackOnFailure 우선순위 (CM3-16 풀 전개)

| 조건 | 동작 |
|---|---|
| step retry exhausted + partial write 감지 | rollback 우선 (autoRollbackOnFailure 무시) → rolling-back |
| step retry exhausted + partial write 없음 + `retryExhaustedAction=pause` | paused + super-admin alert |
| step retry exhausted + partial write 없음 + `retryExhaustedAction=rollback-then-pause` | rolling-back 완료 후 paused |
| step retry exhausted + partial write 없음 + `retryExhaustedAction=rollback` | rolling-back → rolled-back |
| step retry exhausted + partial write 없음 + `autoRollbackOnFailure=true` | rollback 우선 |

### 4.5 read-only window writeClass (CM3-03 dispatch 정정)


 succeeded in 659ms:

---

## 5. 알림 (CM3-16 풀 전개)

### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT — 6종)

| eventType | criticality | 채널 | recipients |
|---|---|---|---|
| `content-migration-plan-legal-approved` | high | email + inApp | super-admin |
| `content-migration-run-completed` | normal | inApp | super-admin |
| `content-migration-run-failed` | **critical** | email + inApp | super-admin |
| `content-migration-rollback-triggered` | high | email + inApp | super-admin |
| `content-migration-run-aborted` (CM5-03) | **critical** | email + inApp | super-admin |
| `content-migration-step-compensated` (CM5-03) | high | inApp | super-admin |

### 5.2 outbox — § 4.6 SQL

### 5.3 NotificationEvent 매핑

| eventType | sourceKind | sourceId | sourceEventId |
|---|---|---|---|
| `content-migration-plan-legal-approved` | `plan` | planId | `hash("content-migration:plan:" + planId + ":legal-approved")` |
| `content-migration-run-completed` | `run` | runId | `hash("content-migration:run:" + runId + ":completed")` |
| `content-migration-run-failed` | `run` | runId | `hash("content-migration:run:" + runId + ":failed")` |
| `content-migration-rollback-triggered` | `run` | runId | `hash("content-migration:run:" + runId + ":rollback-triggered")` |
| `content-migration-run-aborted` (CM5-03) | `run` | runId | `hash("content-migration:run:" + runId + ":aborted")` |
| `content-migration-step-compensated` (CM5-03) | `step` | stepResultId | `hash("content-migration:step:" + stepResultId + ":compensated")` |

---

## 6. 운영 지표 + acceptance test invariant

### 6.1 핵심 지표


 succeeded in 660ms:

본 문서는 알림 **인터페이스·정책 SoT** — 이벤트 enum·페이로드 타입·이벤트별 채널/우선순위 정책 정의. 실제 발송 구현·재시도·dedupe·digest 큐 등 구현 영역은 `features/notifications.md`.

### 9.1 NotificationEventType enum (canonical SoT)

```ts
type NotificationEventType =
  | "content-gate-queued"           // content-gate 큐 진입
  | "blocked-correction-required"   // automatedDecision="block" fail 발생 — 작성자 정정 요청
  | "stale-queued"                  // stale 큐 진입
  | "warning-queued"                // warning 큐 진입
  | "prior-review-result"           // 사전심의 결과 도착
  | "reviewer-approved"             // 검수자 approve
  | "reviewer-rejected"             // 검수자 reject
  | "publish"                       // 발행 완료
  | "sla-imminent"                  // SLA 24시간 전
  | "sla-overdue"                   // SLA 미달
  // `features/analytics-reporting.md` 1차 cycle cascade (F-2)
  | "analytics-report-ready"        // 리포트 생성 완료·발송
  | "media-threshold-reached"       // 의료법 일평균 이용자 10만 임계 도달 (false → true 전이만)
  | "media-threshold-released"      // 임계 해제 (true → false 전이만, hysteresis 적용)
  // `features/search-visibility.md` 1차 cycle cascade (F-1)
  | "search-visibility-anomaly-critical"     // critical severity anomaly
  | "search-visibility-anomaly-warning"      // warning severity anomaly
  | "search-visibility-monitoring-failed"    // 모니터링 cycle 실패 (모든 source)
  | "ai-briefing-citation-first-detected"    // siteDomain AI 브리핑 인용 첫 등장
  | "ai-briefing-citation-lost"               // 기존 AI 브리핑 인용 N일 연속 미노출
  // `features/keyword-monitoring.md` 1차 cycle cascade (F-1)
  | "keyword-monitoring-rank-improved"        // 사용자 지정 키워드 평균 순위 개선
  | "keyword-monitoring-rank-dropped"         // 평균 순위 하락
  | "keyword-monitoring-impressions-spike"    // 노출수 급증
  | "keyword-monitoring-impressions-drop"     // 노출수 급감
  | "keyword-monitoring-ctr-anomaly"          // CTR 이상 변동
  | "keyword-monitoring-rank-bucket-improved" // rank bucket 상위 진입
  | "keyword-monitoring-rank-bucket-dropped"  // rank bucket 하위 이탈·absent
  | "keyword-monitoring-monitoring-failed"    // 모니터링 cycle 실패
  // `features/asset-ingestion.md` 1차 cycle cascade (F-2)
  | "asset-ingestion-batch-completed"         // 수집 완료
  | "asset-ingestion-batch-failed"            // 수집 실패
  | "asset-ingestion-review-required"         // 검수 큐 진입
  | "asset-ingestion-pii-detected"            // PII 감지 (의료 도메인 critical)
  | "asset-ingestion-asset-promoted"          // Core 데이터 계약 변환 완료
  // `features/crm-sync.md` 1차 cycle cascade (CS1-01)
  | "crm-sync-batch-failed"                   // sync cycle 실패
  | "crm-sync-conflict-detected"              // 양방향 sync 충돌
  | "crm-sync-credential-expired"             // CRM 자격증명 만료
  | "crm-sync-credential-expiring-soon"       // 만료 14일 전
  // `features/content-migration.md` 1차 cycle cascade (CM1-01·10)
  | "content-migration-plan-legal-approved"   // plan legal-reviewer 승인 (의미 분리 — CM1-10)
  | "content-migration-run-completed"
  | "content-migration-run-failed"
  | "content-migration-rollback-triggered"
  | "content-migration-run-aborted"           // CM5-03 — abortRun 강제 종료 (critical)
  | "content-migration-step-compensated";     // CM5-03 — markStepCompensated (high inApp)
```

### 9.1.1 이벤트 정책 매트릭스 (canonical SoT)

이벤트별 수신자·즉시 채널·digest 주기·critical 분류·quietHours·opt-out 정책의 **단일 정의표**. § 3.3 우선순위·SLA의 "권장 알림" 컬럼은 본 표를 따른다.

| eventType | 한국어 이벤트명 | 수신자 산정 | 즉시 채널 | fallback 채널 (hard-suppressed 시) | digest 주기 | criticality | quietHoursPolicy | optOutPolicy |
|---|---|---|---|---|---|---|---|---|
| `content-gate-queued` | content-gate 큐 진입 | finalRoles[] 매칭 검수자 (operator + 등급 기본 medical + 룰 추가 역할 합집합) | email + slack + inApp | inApp | — | **critical** | bypass (보류 안 함) | mandatory (옵트아웃 불가) |
| `blocked-correction-required` | blocked 정정 요청 | 작성자 + operator | email + slack + inApp | inApp | — | **critical** | bypass | mandatory |
| `stale-queued` | stale 큐 진입 | `staleFlags.<role>=true` 매칭 검수자 | inApp | (없음 — inApp만) | email — 의료법 개정은 일일, 기타는 주간 | high | respect (사용자 quietHours 보류) | digestOptOut 허용 (단 의료법 개정 stale은 mandatory) |
| `warning-queued` | warning 큐 진입 | operator | inApp | (없음) | email 일일 요약 | normal | respect | digestOptOut 허용 |
| `prior-review-result` | 사전심의 결과 도착 | 운영자 + legal 검수자 | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `reviewer-approved` | 검수자 approve | 작성자 + 운영자 | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `reviewer-rejected` | 검수자 reject | 작성자 | email + inApp | inApp | — | high | respect | mandatory |
| `publish` | 발행 완료 | 운영자 + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `sla-imminent` | SLA 24시간 전 | 검수자 + 운영팀 | email + inApp | inApp | — | high | respect | mandatory |
| `sla-overdue` | SLA 미달 | 운영팀 (에스컬레이션) | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `analytics-report-ready` | 분석 리포트 발송 | 템플릿 `recipients[]` 산정(operator·client-approver 등) | email + inApp | inApp | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `media-threshold-reached` | 일평균 이용자 10만 임계 도달 | operator + legal 검수자 + client-approver | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `media-threshold-released` | 임계 해제 | operator + legal 검수자 + client-approver | email + inApp | inApp | — | high | respect | mandatory |
| `search-visibility-anomaly-critical` | 검색 가시성 critical anomaly | operator + client-approver | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `search-visibility-anomaly-warning` | 검색 가시성 warning anomaly | operator | inApp | (없음) | email 일일 요약 | high | respect | digestOptOut 허용 |
| `search-visibility-monitoring-failed` | 모니터링 cycle 실패 (전 source) | operator | email + inApp | inApp | — | high | respect | mandatory |
| `ai-briefing-citation-first-detected` | AI 브리핑 인용 첫 등장 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `ai-briefing-citation-lost` | AI 브리핑 인용 상실 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
| `keyword-monitoring-rank-improved` | 키워드 순위 개선 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `keyword-monitoring-rank-dropped` | 키워드 순위 하락 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
| `keyword-monitoring-impressions-spike` | 키워드 노출 급증 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `keyword-monitoring-impressions-drop` | 키워드 노출 급감 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
| `keyword-monitoring-ctr-anomaly` | 키워드 CTR 이상 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
| `keyword-monitoring-rank-bucket-improved` | 키워드 rank bucket 상위 진입 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `keyword-monitoring-rank-bucket-dropped` | 키워드 rank bucket 하위/absent | operator + client-approver | email + inApp | inApp | — | high (critical when bucket→absent) | respect | mandatory |
| `keyword-monitoring-monitoring-failed` | 키워드 모니터링 cycle 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
| `asset-ingestion-batch-completed` | 수집 완료 | operator | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `asset-ingestion-batch-failed` | 수집 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
| `asset-ingestion-review-required` | 검수 큐 진입 | operator | inApp | (없음) | email 일일 요약 | normal | respect | digestOptOut 허용 |
| `asset-ingestion-pii-detected` | PII 감지 | operator + legal 검수자 | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `asset-ingestion-asset-promoted` | Core 변환 완료 | operator | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `crm-sync-batch-failed` | CRM sync 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
| `crm-sync-conflict-detected` | CRM 충돌 감지 | operator | email + inApp | inApp | — | high | respect | mandatory |
| `crm-sync-credential-expired` | CRM 자격증명 만료 | operator + super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `crm-sync-credential-expiring-soon` | 만료 14일 전 | operator + super-admin | email + inApp | inApp | — | high | respect | mandatory |
| `content-migration-plan-legal-approved` | content-migration plan legal 승인 | super-admin | email + inApp | inApp | — | high | respect | mandatory |
| `content-migration-run-completed` | content-migration apply 완료 | super-admin | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
| `content-migration-run-failed` | content-migration apply 실패 | super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `content-migration-rollback-triggered` | rollback 실행 | super-admin | email + inApp | inApp | — | high | respect | mandatory |
| `content-migration-run-aborted` | run 강제 종료 (abortRun) | super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
| `content-migration-step-compensated` | manual compensation 적용 (markStepCompensated) | super-admin | inApp | (없음) | (옵션) email 일일 요약 | high | respect | digestOptOut 허용 |

- **fallback 채널 컬럼**: 즉시 채널 중 일부가 `hard-suppressed` 상태일 때 본 컬럼의 채널로 자동 라우팅. **fallback 채널은 본 매트릭스의 정식 SoT** — 즉시 채널 외부의 임의 추가 금지. fallback도 hard-suppressed면 외부 monitoring sink alert만 발생 (recipient 발송 대체 아님, `features/notifications.md` § 7.3)

- **criticality**: `critical` 이벤트는 사용자 quietHours·opt-out·인스턴스 운영시간(LocationProfile.businessHours)을 우회. 단, **inactive 사용자·인스턴스 채널 비활성·idempotency·dedupe는 우회하지 않음** (`features/notifications.md` § 4.1·§ 8.3 필터 순서). `high`는 사용자 quietHours 보류, `normal`은 전체 정책 적용
- **수신자 산정 규칙**: `eventType` → eligible AdminUserRole (§ 11.1) → ApproverRole 자격 (§ 11.2 ⚠️ 자격 검증) → 인스턴스 멤버십 → AdminUser.notificationPreferences 필터 (`features/notifications.md` § 4.1)
- **`recipientRole="author"` 산정 (`blocked-correction-required` 등)**: 콘텐츠의 작성자 AdminUser ID는 워크플로 transition actorId 또는 콘텐츠 `@createdBy`(어드민 DB) 기준. AdminUser가 아닌 외부 작성자(예: 클라이언트 직접 입력 콘텐츠)에는 본 이벤트 발송 금지 — operator로 fallback 후 operator가 작성자에게 별도 전달 (운영 정책)
- **multi-location 인스턴스의 locationRef**: NotificationEvent에 `metadata.locationRef`(LocationProfile @id) 권장. 호출자(REVIEW_WORKFLOW transition)가 콘텐츠 소속 location을 산정·전달. 미해결 시 LocationProfile `main=true` fallback (`features/notifications.md` § 8.4 client-approver businessHours 정책 입력)

 succeeded in 689ms:
| `newComplianceRecordId` | UUID | optional (new-record-version 적용 시) |

**Constraints**: `UNIQUE(batchId, complianceRecordId)`.

### 12.10 `ContentMigrationNotificationOutbox` (CM3-14)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `sourceKind` | enum (plan·run) | ✅ |
| `sourceId` | string | ✅ |
| `eventType` | enum (NotificationEventType 4종) | ✅ |
| `sourceEventId` | char(64) | ✅ |
| `payload` | JSON | ✅ |
| `status` | enum (pending·processing·sent·permanent) | ✅ |
| `attempts` | integer | ✅ default 0 |
| `nextAttemptAt` | Date | ✅ |
| `lastAttemptAt`·`sentAt` | Date | optional |
| `lockedAt`·`lockedBy` | Date·string | optional |
| `lastError` | string | optional |
| `createdAt` | Date | ✅ |
| `expiresAt` | Date | ✅ |

**Constraints**: `UNIQUE(sourceEventId)`. `UNIQUE(sourceKind, sourceId, eventType)`.
**Index**: `(status, next_attempt_at) WHERE status='pending'`, `(expiresAt)`.

---

### 12.11 `ContentMigrationActiveTargetLock` (CM4-06·07 신설)

dry-run·apply 동시성 차단 — `(instanceId, targetSetDigest, writeSetScopeDigest)` 단위로 active state lock.

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `targetSetDigest` | char(64) | ✅ |
| `writeSetScopeDigest` | char(64) | ✅ — step writeSetProjection canonical hash |
| `runId` | UUID | optional — apply Run 진행 중일 때 채움. FK § 12.4 |
| `dryRunPlanId` | UUID | optional — dry-run 진행 중일 때 채움. FK § 12.1 |
| `kind` | enum (`apply`·`dry-run`) | ✅ |
| `acquiredAt` | Date | ✅ |
| `expiresAt` | Date | ✅ — heartbeat 갱신. cleanup worker가 stale 회수 |

**Constraints**:
- `UNIQUE(instanceId, targetSetDigest, writeSetScopeDigest)` — 동일 target/write scope에 active lock 1개만
- `CHECK ((kind='apply' AND run_id IS NOT NULL AND dry_run_plan_id IS NULL) OR (kind='dry-run' AND run_id IS NULL AND dry_run_plan_id IS NOT NULL))`
- `FK runId ON DELETE CASCADE`·`FK dryRunPlanId ON DELETE CASCADE`

**Index**: `(expires_at)` — cleanup. `(instance_id, target_set_digest)`.

**획득·해제 protocol**:
- runDryRun·runApply 시작 시 lock 획득 (timeout 60초). 실패 → 409 conflict
- run 완료/cancelled/rolled-back/aborted 또는 dry-run 완료 시 lock 해제
- heartbeat: 진행 중인 worker가 expiresAt을 5분 단위로 갱신

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "contentMigrationConfig|ContentMigrationConfig|featureLegalApproved|piiFieldCatalogRef|entityFieldProjectionCatalogRef|contentMigrationPolicyVersion" docs/core/DATA_MODEL.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "legalEntityChanged|legalSensitiveEntityChanged|legalEntityIdentityChanged|fieldProjectionDiff|digestComputationMode|invalidationInputs|cacheSourceRef|writeSetScopeDigest" docs/features/content-migration.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"manual-remediation-required|rollbackClass ∉|skipStep \\+ rollbackClass|NotificationEventType 4종|13종 AuditAction|12\\.9\\.1\" docs/features/content-migration.md" in C:\Users\assag\solution\website-exposure
 succeeded in 604ms:
4:> **작성일**: 2026-05-15 (v0.22 — `features/content-migration.md` 3차 사이클 cascade: ContentMigrationConfig `legalApproved` → `featureLegalApproved` rename + `piiFieldCatalogRef`·`entityFieldProjectionCatalogRef` 추가 — CM3-08·CM3-05·CM3-18)
598:| `contentMigrationConfig` | `ContentMigrationConfig` | conditional | (v0.21 +) 솔루션 내부 콘텐츠 마이그레이션 plan 정의·legal 승인·read-only window 정책 SoT. `features.content-migration` 활성 시 required. 동작 옵션은 `features[name="content-migration"].config` (`features/content-migration.md` § 2.3) |
599:| `contentMigrationPolicyVersion` | `string` | conditional | (v0.21 +) `features.content-migration` 정책 SoT 버전. 8 Feature policyVersion 동일 패턴 |
720:#### `ContentMigrationConfig` (v0.21 신규 — CM1-03)
726:| `featureLegalApproved` | boolean | ✅ | (CM3-08 — rename from `legalApproved`) content-migration **Feature 자체** legal 승인 — plan-level `ContentMigrationLegalApproval`(admin DB)과 분리 |
727:| `featureLegalApprovedBy`·`featureLegalApprovedAt` | string·Date | ✅ | |
731:| `piiFieldCatalogRef` | string | ✅ | (CM3-05·CM3-18 +) DATA_MODEL Core entity별 PII field catalog 모듈 ref — classifier input SoT |
732:| `entityFieldProjectionCatalogRef` | string | ✅ | (CM3-05 +) targetEntityTypes·readSet/writeSet projection catalog ref |
1099:| 2026-05-15 | v0.21 | **`features/content-migration.md` 1차 사이클 cascade (CM1-03)**: (1) **C-08 `contentMigrationConfig` 신설** (ContentMigrationConfig — legalApproved·defaultMode·approvalRequired·legalImpactClassifierRef), (2) **C-08 `contentMigrationPolicyVersion`** (8 Feature policyVersion 동일 패턴) |
1100:| 2026-05-15 | v0.22 | **`features/content-migration.md` 3차 사이클 cascade (CM3-05·CM3-08·CM3-18)**: (1) ContentMigrationConfig `legalApproved` → `featureLegalApproved` rename (plan-level `ContentMigrationLegalApproval` admin DB와 명칭 분리), (2) `piiFieldCatalogRef`·`entityFieldProjectionCatalogRef` 추가 — legalImpactClassifier deterministic rule 입력 SoT |

 succeeded in 592ms:
9:> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (4종 NotificationEventType + **13종 AuditAction** cascade 완료)
25:- **rollbackClass 3종**: `reversible`·`compensating`·`irreversible` (자동 skip 금지·blocked-manual-remediation-required)
111:| REVIEW_WORKFLOW § 10.2.1 | 13종 AuditAction |
393:  | "blocked-manual-remediation-required"
582:   - irreversible: **blocked-manual-remediation-required** 진입. 운영자 명시적 skipStep 호출 필요
601:| (rollback 부분 완료) | rolling-back·none | irreversible 만남 | rolling-back·**blocked-manual-remediation-required**·none |
602:| skipStep | rolling-back·blocked-manual-remediation-required | step skipped 처리 | rolling-back·blocked-manual-remediation-required (skipped step 누적) → 모든 skipped 후 정리 시 rolled-back·none·**partial** |
603:| markStepCompensated (CM4-05) | rolling-back·blocked-manual-remediation-required | compensation 적용 표시 | rolling-back·blocked-manual-remediation-required → 정리 시 rolled-back·none·**partial** |
605:| abortRun (CM4-05) | running·cancellation-timeout-manual-review 또는 rolling-back·blocked-manual-remediation-required | 강제 종료 + 운영 ticket 필수 | failed·cancellation-timeout-manual-review·**failed** (rollback 시도 실패 또는 timeout) |
617:  (primary_status='rolling-back' AND remediation_status IN ('none','blocked-manual-remediation-required') AND rollback_outcome='none') OR
733:8. per-record resultRef는 ContentMigrationPolicyReevaluateRecord row에 저장 (§ 12.9.1)
830:| INV-ROLLBACK-IRREVERSIBLE | 모두 reversible → full rollback | irreversible 포함 → blocked-manual-remediation-required → skipStep + partial |
901:- rollback irreversible encountered → blocked-manual-remediation-required [INV-ROLLBACK-IRREVERSIBLE]
908:- skipStep + rollbackClass ∉ ("irreversible","manual-remediation-required") → runtime fail
993:| ~~§ 12 인벤토리·PolicyReevaluateRecord~~ | ~~resolved (v0.6 § 12.9.1 별도 table 승격 — 12 tables)~~ |
1005:| 2026-05-15 | **v0.5** | **codex 4차 비평 14 지적 전건 수용**: (1) **ApplyPreflightToken opaque + dryRunReportId explicit lookup** — RunApplyInput에 dryRunReportId 추가 (CM4-01), (2) **digestComputationMode 3종** (full·snapshot·cache) + invalidationInputs cache invalidation 정밀화 (CM4-02), (3) **append-only-watermark concurrency 강화** — lowerBound·exclusiveUpperBound·sourcePredicateHash·writerIdField·expectedInsertedCount·concurrencyMode + phantom row writerId 검사 (CM4-03), (4) **Run status 3축 transition matrix § 4.3.1 + DB CHECK § 4.3.2/§ 12.4** — partial-rollback은 별도 primaryStatus 아님 (CM4-04), (5) **markStepCompensated·abortRun v1.0 정식 command** + CM-10·11 resolved 격상 + REVIEW_WORKFLOW cascade 2종 추가 (CM4-05), (6) **ContentMigrationActiveTargetLock § 12.11 신설** — instanceId+targetSetDigest+writeSetScopeDigest active unique. dry-run·apply 동시성 차단 (CM4-06·07), (7) **legalEntityChanged 분해** → legalSensitiveEntityChanged + legalEntityIdentityChanged. staleFlagsOnlyOverrideConditions 정렬 (CM4-08), (8) **§ 12.9.1 embedded 명시** + 인벤토리 11 tables로 정정 (§ 12.1-§ 12.11) (CM4-09), (9) **PII export DB CHECK SQL canonical** `CHECK (NOT contains_pii OR export_allowed = false)` (CM4-10), (10) **SkipStepInput에서 rollbackClass 제거** — irreversible only. manual-remediation-required는 remediationStatus reason (CM4-11), (11) **§ 6.3 fixture matrix 28 INV × happy + violation 각 1쌍** + § 9.2에 same-request replay·PII export·ActiveTargetLock 충돌 fail rule 추가 (CM4-12), (12) **dispatchAllowlistPolicySnapshot** — REVIEW_WORKFLOW 매트릭스 hash drift 시 build fail (CM4-13), (13) **§ 1.1 SemVer 4행 추가** — writeSetManifest strategy semantic·policy-reevaluate decision rule·staleFlagsOnlyOverrideConditions·ActiveTargetLock 변경 (CM4-14) |
1007:| 2026-05-15 | (v0.4 — 이전 비고) | **codex 3차 비평 21 지적 전건 수용** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |
1083:| `remediationStatus` | enum (none·blocked-manual-remediation-required·cancellation-timeout-manual-review) | ✅ default none |
1257:| `eventType` | enum (NotificationEventType 4종) | ✅ |

 succeeded in 608ms:
59:| **ActiveTargetLock kind enum 추가·writeSetScopeDigest 산정 변경** (CM4-06) | **MAJOR** | policyVersion 신규 | |
371:// CM3-04 + CM4-08 — legalEntityChanged 분해
378:  legalSensitiveEntityChanged: boolean;                  // CM4-08 — LegalDocument·ReviewPolicy·PricingPage·전후사진·후기 contentType class diff
379:  legalEntityIdentityChanged: boolean;                   // CM4-08 — 법인명·소속·법적 식별자 변경
380:  fieldProjectionDiff: string[];                         // CM4-08 — diff된 field path 목록 (catalog 통과)
418:1. DryRunReport row insert — 8필드 digest 포함 + digestComputationMode·invalidationInputs 기록 (CM4-02)
426:4. **digestComputationMode별 invalidation precheck** (CM4-02):
429:   - mode="cache": invalidationInputs(policyVersionSnapshot·classifierVersion·ruleFileHashes·catalogRefs) 변경 감지 → 변경된 경우만 해당 field 재계산
430:5. 어느 모드든 invalidationInputs change 발견 → CAS fail (token mismatch)
722:   - riskDelta·priorReviewRequiredChanged·**legalSensitiveEntityChanged·legalEntityIdentityChanged·fieldProjectionDiff** 산정 (CM4-08·CM5-06 — legalEntityChanged 단일 boolean 폐기)
726:   - **legalSensitiveEntityChanged=true** (LegalDocument·ReviewPolicy·PricingPage·전후사진·후기 contentType class diff) → new-record-version 강제
727:   - **legalEntityIdentityChanged=true** (법인명·소속·법적 식별자 변경) → new-record-version 강제
852:| **INV-LEGAL-ENTITY-DISCRIMINATE** (CM4-08) | legalSensitiveEntityChanged=false + legalEntityIdentityChanged=false + low risk → stale-flags-only override | legalSensitiveEntityChanged=true → new-record-version 강제 |
915:- **ActiveTargetLock 충돌** — 동일 (instanceId, targetSetDigest, writeSetScopeDigest) UNIQUE 위반 → 409 (CM4-06·07)
1005:| 2026-05-15 | **v0.5** | **codex 4차 비평 14 지적 전건 수용**: (1) **ApplyPreflightToken opaque + dryRunReportId explicit lookup** — RunApplyInput에 dryRunReportId 추가 (CM4-01), (2) **digestComputationMode 3종** (full·snapshot·cache) + invalidationInputs cache invalidation 정밀화 (CM4-02), (3) **append-only-watermark concurrency 강화** — lowerBound·exclusiveUpperBound·sourcePredicateHash·writerIdField·expectedInsertedCount·concurrencyMode + phantom row writerId 검사 (CM4-03), (4) **Run status 3축 transition matrix § 4.3.1 + DB CHECK § 4.3.2/§ 12.4** — partial-rollback은 별도 primaryStatus 아님 (CM4-04), (5) **markStepCompensated·abortRun v1.0 정식 command** + CM-10·11 resolved 격상 + REVIEW_WORKFLOW cascade 2종 추가 (CM4-05), (6) **ContentMigrationActiveTargetLock § 12.11 신설** — instanceId+targetSetDigest+writeSetScopeDigest active unique. dry-run·apply 동시성 차단 (CM4-06·07), (7) **legalEntityChanged 분해** → legalSensitiveEntityChanged + legalEntityIdentityChanged. staleFlagsOnlyOverrideConditions 정렬 (CM4-08), (8) **§ 12.9.1 embedded 명시** + 인벤토리 11 tables로 정정 (§ 12.1-§ 12.11) (CM4-09), (9) **PII export DB CHECK SQL canonical** `CHECK (NOT contains_pii OR export_allowed = false)` (CM4-10), (10) **SkipStepInput에서 rollbackClass 제거** — irreversible only. manual-remediation-required는 remediationStatus reason (CM4-11), (11) **§ 6.3 fixture matrix 28 INV × happy + violation 각 1쌍** + § 9.2에 same-request replay·PII export·ActiveTargetLock 충돌 fail rule 추가 (CM4-12), (12) **dispatchAllowlistPolicySnapshot** — REVIEW_WORKFLOW 매트릭스 hash drift 시 build fail (CM4-13), (13) **§ 1.1 SemVer 4행 추가** — writeSetManifest strategy semantic·policy-reevaluate decision rule·staleFlagsOnlyOverrideConditions·ActiveTargetLock 변경 (CM4-14) |
1006:| 2026-05-15 | **v0.6** | **codex 5차 비평 8 지적 전건 수용 — v1.0 안정판 후보**: (1) **§ 12 인벤토리 12 tables로 통일** — PolicyReevaluateRecord 별도 table 승격 (§ 12.10 / 기존 NotificationOutbox·ActiveTargetLock은 12.11·12.12로 이동) (CM5-01), (2) **§ 4.3.2 3축 invariant DB CHECK tuple 기반 재작성** — 8 valid tuple 명시. 잘못된 조합 DB reject (CM5-02), (3) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — content-migration-run-aborted (critical) + step-compensated (high) NotificationEvent 2종 추가 + 본문 § 3.1·§ 5.1·§ 5.3 매핑 (CM5-03), (4) **writeSetScopeDigest 고정 정의** — HMAC(digestPepperRef, stepRegistryVersion + ordered(stepKey + writeSetProjection canonical + targetEntityTypes)). DryRunReport에 저장·ActiveTargetLock에 재사용 (CM5-04), (5) **§ 12.2 DryRunReport schema에 digestComputationMode·invalidationInputs·cacheSourceRef·generatedAt·writeSetScopeDigest 추가** (CM5-05), (6) **§ 4.8·§ 12.10 legalEntityChanged 잔재 제거** — legalSensitiveEntityChanged·legalEntityIdentityChanged·fieldProjectionDiff cascade (CM5-06), (7) **§ 3.4 requestFingerprint 표 갱신** — markStepCompensated·abortRun 추가 + skipStep에서 rollbackClass 제거 (CM5-07), (8) **§ 10.3 v0.6 잔여 리스크로 갱신** (CM5-08) |
1007:| 2026-05-15 | (v0.4 — 이전 비고) | **codex 3차 비평 21 지적 전건 수용** — dry-run-completed·run-paused·run-resumed·rollback-triggered (canonical name) (CM3-01·21), (2) **cooperativeCancellation 미지원 + non-per-chunk validate fail로 승격** + cancellation-timeout-manual-review 허용 command 표 (CM3-02·CM-10·CM-11 신규), (3) **read-only window notification-dispatch dispatchAllowlist** — high/critical operational만 즉시·다른 이벤트는 큐잉 (CM3-03), (4) **PolicyReevaluateResult 타입** — previousRiskLevel·newRiskLevel·riskDelta·priorReviewRequiredChanged·legalEntityChanged·forcedReportingModeReason (CM3-04), (5) **DATA_MODEL C-08 v0.22 cascade — piiFieldCatalogRef·entityFieldProjectionCatalogRef** + step registry catalog cross-validation (CM3-05), (6) **§ 12 executable schema 풀 전개** (CM3-06), (7) **§ 12.6 StepRetryQueue worker SQL 자체 전개** (CM3-07), (8) **DATA_MODEL featureLegalApproved rename cascade** (CM3-08), (9) **ApplyPreflightToken § 3.5** — server-side 8필드 CAS·ETag 스타일 (CM3-09), (10) **writeSetManifest strategy 분기** — small-rowid-merkle·chunked-returning·append-only-watermark·deterministic-transform (CM3-10), (11) **Run status primaryStatus + remediationStatus + rollbackOutcome substate 분해** (CM3-11), (12) **active run partial unique** § 12.4 (CM3-12), (13) **LegalApproval 8필드 snapshot + dryRunReportId + approvedDigestBundleHash** (CM3-13), (14) **NotificationOutbox SQL nextAttemptAt·attempts·exhausted·stale reclaim** + status enum 정리 (CM3-14), (15) **stale-flags-only override CHECK** — maxRiskLevel=low + no legal/priorReview change (CM3-15), (16) **v0.2 동일 잔재 풀 전개** — plan kind 6종·NotificationEventType 4종·매핑·retry 우선순위 (CM3-16), (17) **§ 6.2 INV ↔ § 9 fail rule 1:1 traceability 표 + § 6.3 happy path fixture** (CM3-17), (18) **§ 1.1 SemVer catalog 변경 3행 추가** (CM3-18), (19) **§ 3.1.1 AuditAction metadata 공통 required** — actorId·actorRole·idempotencyKey·requestFingerprint (CM3-19), (20) **§ 3.8 StepResultRow closed schema** — inputSummary·outputSummary·diffDisplayHints·rawArtifactRef·privacyClass·containsPii·exportAllowed (CM3-20), (21) cascade 4종 정확 표시 (CM3-21) |
1044:| `digestComputationMode` (CM5-05) | enum (`full`·`snapshot`·`cache`) | ✅ |
1045:| `invalidationInputs` (CM5-05) | JSONB closed (policyVersionSnapshot·classifierVersion·ruleFileHashes·catalogRefs) | ✅ |
1046:| `cacheSourceRef` (CM5-05) | string | optional (mode=`cache`/`snapshot` 시 ref) |
1048:| `writeSetScopeDigest` | char(64) | ✅ — § 12.11 lock 산정에 재사용 (CM5-04) |
1241:| `legalSensitiveEntityChanged` (CM5-06) | boolean | ✅ |
1242:| `legalEntityIdentityChanged` (CM5-06) | boolean | ✅ |
1243:| `fieldProjectionDiff` (CM5-06) | JSON (string[]) | ✅ |
1276:dry-run·apply 동시성 차단 — `(instanceId, targetSetDigest, writeSetScopeDigest)` 단위로 active state lock.
1283:| `writeSetScopeDigest` | char(64) | ✅ — step writeSetProjection canonical hash |
1291:- `UNIQUE(instanceId, targetSetDigest, writeSetScopeDigest)` — 동일 target/write scope에 active lock 1개만
1303:`writeSetScopeDigest` 산정 (CM5-04 고정 정의): `HMAC(digestPepperRef, stepRegistryVersion + ":" + ordered(stepKey + writeSetProjection canonical + targetEntityTypes))` char(64). DryRunReport에 저장된 동일 digest를 apply lock 획득에도 그대로 사용 — registry drift 시 lock 획득 전 CAS fail로 종료.

codex
{
  "verdict": "not_ready_for_v1_0",
  "ready_for_v1_0": false,
  "finding_prefix": "CM6-",
  "summary": "v0.6은 CM5의 blocking 3개와 major 대부분을 실질적으로 해소했다. 다만 NotificationEvent cascade가 DB outbox schema와 문서 상단 SoT 카운트까지 닫히지 않았고, §12 table 번호가 물리 테이블 인벤토리와 어긋난다. blocking은 없지만 SoT cascade 완료 기준을 충족하지 못해 v1.0 안정판 판정은 보류한다.",
  "cm5_regression_check": {
    "CM5-01": "mostly_fixed_with_section_numbering_residue",
    "CM5-02": "fixed",
    "CM5-03": "partially_fixed_schema_count_residue",
    "CM5-04": "fixed",
    "CM5-05": "fixed",
    "CM5-06": "fixed",
    "CM5-07": "mostly_fixed_with_runtime_rule_residue",
    "CM5-08": "fixed"
  },
  "findings": [
    {
      "id": "CM6-01",
      "severity": "major",
      "category": "notification-sot-cascade",
      "title": "NotificationEvent 6종 cascade가 DB outbox schema와 상단 SoT 표기에 끝까지 반영되지 않았다",
      "evidence": [
        "docs/features/content-migration.md:9 는 REVIEW_WORKFLOW cascade를 `4종 NotificationEventType + 13종 AuditAction`으로 계속 표기한다.",
        "docs/features/content-migration.md:110-111 도 의존성 표에서 `4종 NotificationEventType`, `13종 AuditAction`으로 남아 있다.",
        "docs/features/content-migration.md:741-763 의 본문 §5.1·§5.3은 `run-aborted`, `step-compensated`를 포함한 6종을 정의한다.",
        "docs/admin/REVIEW_WORKFLOW.md:467-514 및 562-563 은 6종 enum과 정책 매트릭스를 정상 반영했다.",
        "docs/features/content-migration.md:1257 의 `ContentMigrationNotificationOutbox.eventType`은 여전히 `enum (NotificationEventType 4종)`이다."
      ],
      "impact": "구현자가 NotificationOutbox DB enum을 4종으로 만들면 `content-migration-run-aborted` critical 이벤트와 `content-migration-step-compensated` high 이벤트가 outbox insert 단계에서 누락되거나 실패한다. REVIEW_WORKFLOW는 6종을 SoT로 보는데 content-migration DB schema는 4종으로 읽혀 SoT cascade 완료 기준에 미달한다.",
      "recommendation": "상단 연관 SoT와 §2.2 의존성은 `6종 NotificationEventType + 15종 AuditAction`으로 정정하고, §12.10/12.11 NotificationOutbox `eventType` 필드를 `NotificationEventType 6종` 또는 `REVIEW_WORKFLOW §9.1 canonical enum subset`으로 정정하라."
    },
    {
      "id": "CM6-02",
      "severity": "major",
      "category": "db-schema",
      "title": "§12 물리 table 인벤토리 번호가 본문 heading과 맞지 않아 참조가 흔들린다",
      "evidence": [
        "docs/features/content-migration.md:1006 changelog는 PolicyReevaluateRecord를 §12.10으로 승격하고 NotificationOutbox·ActiveTargetLock을 §12.11·§12.12로 이동했다고 설명한다.",
        "docs/features/content-migration.md:1228 은 `### 12.10-pre ContentMigrationPolicyReevaluateRecord`로 되어 있다.",
        "docs/features/content-migration.md:1250 은 `### 12.10 ContentMigrationNotificationOutbox`, 1274는 `### 12.11 ContentMigrationActiveTargetLock`으로 되어 있다.",
        "docs/features/content-migration.md:1307-1322 의 총괄 인벤토리는 PolicyReevaluateRecord=12.10, NotificationOutbox=12.11, ActiveTargetLock=12.12라고 표기한다."
      ],
      "impact": "물리 테이블 12개라는 결정은 명확하지만, 본문 section anchor가 총괄 인벤토리와 달라 구현/리뷰/마이그레이션 DDL 참조가 어긋난다. 특히 `§12.11 lock` 같은 기존 참조가 NotificationOutbox인지 ActiveTargetLock인지 문맥 의존으로 변한다.",
      "recommendation": "본문 heading을 총괄 인벤토리와 일치시켜 `12.10 ContentMigrationPolicyReevaluateRecord`, `12.11 ContentMigrationNotificationOutbox`, `12.12 ContentMigrationActiveTargetLock`으로 재번호 매김하라. `12.10-pre`와 stale §12.9.1 참조도 제거하라."
    },
    {
      "id": "CM6-03",
      "severity": "minor",
      "category": "runtime-fail-rules",
      "title": "skipStep rollbackClass 제거 후에도 §9.2 fail rule에 제거된 입력 필드가 남아 있다",
      "evidence": [
        "docs/features/content-migration.md:342 의 SkipStepInput은 `stepResultId` 기반이고 rollbackClass 입력을 받지 않는다.",
        "docs/features/content-migration.md:407 의 requestFingerprint도 CM5-07에 따라 rollbackClass를 제거했다.",
        "docs/features/content-migration.md:908 은 여전히 `skipStep + rollbackClass ∉ (\"irreversible\",\"manual-remediation-required\")`를 runtime fail rule로 둔다."
      ],
      "impact": "주요 command contract는 이미 정정됐으나, acceptance/runtime rule만 보면 구현자가 제거된 `rollbackClass` input을 다시 요구할 수 있다.",
      "recommendation": "해당 fail rule을 `skipStep 대상 stepResult.rollbackClass != \"irreversible\" → runtime fail`로 바꾸고 `manual-remediation-required`는 rollbackClass가 아니라 remediationStatus reason임을 명시하라."
    }
  ],
  "standalone_readiness": {
    "sections_checked": ["§1.1", "§2.4", "§3.x", "§4.x", "§5.x", "§6.x", "§9.x", "§12.x", "REVIEW_WORKFLOW §9.1/§9.1.1/§10.2.1", "DATA_MODEL C-08"],
    "can_implement_as_single_sot": false,
    "blocking_gaps": [],
    "remaining_major_gaps": [
      "NotificationEvent 6종 cascade가 ContentMigrationNotificationOutbox schema와 상단 SoT 카운트까지 닫히지 않음",
      "§12 table numbering/anchor가 총괄 인벤토리와 불일치"
    ]
  },
  "legal_privacy_operability": {
    "medical_ad_law_operable": "partially",
    "privacy_law_operable": "mostly",
    "reason": "policy-reevaluate의 법적 엔티티 분해, PII export CHECK, legal approval, DryRunReport CAS는 운영 가능 수준으로 정리됐다. 다만 abort/compensation 알림 outbox enum 불일치가 의료광고/개인정보 관련 수동 보정 SLA 추적을 약화시킬 수 있어 최종 안정판 전 정정이 필요하다."
  },
  "required_changes_before_v1_0": [
    "NotificationEvent/AuditAction 카운트와 NotificationOutbox eventType enum을 6종/15종 기준으로 정정",
    "§12 heading 번호를 총괄 인벤토리와 일치시키고 stale §12.9.1/§12.11 참조 정리",
    "§9.2 skipStep fail rule에서 제거된 rollbackClass 입력 참조 삭제"
  ],
  "v1_0_stability_gate": {
    "blocking_count": 0,
    "major_count": 2,
    "minor_count": 1,
    "sot_cascade_synced": false,
    "ready_if_fixed": "CM6-01과 CM6-02를 정정하면 남는 CM6-03은 minor 수준이며, 그 시점에는 ready_for_v1_0 판정 가능성이 높다."
  }
}
tokens used
134,269
{
  "verdict": "not_ready_for_v1_0",
  "ready_for_v1_0": false,
  "finding_prefix": "CM6-",
  "summary": "v0.6은 CM5의 blocking 3개와 major 대부분을 실질적으로 해소했다. 다만 NotificationEvent cascade가 DB outbox schema와 문서 상단 SoT 카운트까지 닫히지 않았고, §12 table 번호가 물리 테이블 인벤토리와 어긋난다. blocking은 없지만 SoT cascade 완료 기준을 충족하지 못해 v1.0 안정판 판정은 보류한다.",
  "cm5_regression_check": {
    "CM5-01": "mostly_fixed_with_section_numbering_residue",
    "CM5-02": "fixed",
    "CM5-03": "partially_fixed_schema_count_residue",
    "CM5-04": "fixed",
    "CM5-05": "fixed",
    "CM5-06": "fixed",
    "CM5-07": "mostly_fixed_with_runtime_rule_residue",
    "CM5-08": "fixed"
  },
  "findings": [
    {
      "id": "CM6-01",
      "severity": "major",
      "category": "notification-sot-cascade",
      "title": "NotificationEvent 6종 cascade가 DB outbox schema와 상단 SoT 표기에 끝까지 반영되지 않았다",
      "evidence": [
        "docs/features/content-migration.md:9 는 REVIEW_WORKFLOW cascade를 `4종 NotificationEventType + 13종 AuditAction`으로 계속 표기한다.",
        "docs/features/content-migration.md:110-111 도 의존성 표에서 `4종 NotificationEventType`, `13종 AuditAction`으로 남아 있다.",
        "docs/features/content-migration.md:741-763 의 본문 §5.1·§5.3은 `run-aborted`, `step-compensated`를 포함한 6종을 정의한다.",
        "docs/admin/REVIEW_WORKFLOW.md:467-514 및 562-563 은 6종 enum과 정책 매트릭스를 정상 반영했다.",
        "docs/features/content-migration.md:1257 의 `ContentMigrationNotificationOutbox.eventType`은 여전히 `enum (NotificationEventType 4종)`이다."
      ],
      "impact": "구현자가 NotificationOutbox DB enum을 4종으로 만들면 `content-migration-run-aborted` critical 이벤트와 `content-migration-step-compensated` high 이벤트가 outbox insert 단계에서 누락되거나 실패한다. REVIEW_WORKFLOW는 6종을 SoT로 보는데 content-migration DB schema는 4종으로 읽혀 SoT cascade 완료 기준에 미달한다.",
      "recommendation": "상단 연관 SoT와 §2.2 의존성은 `6종 NotificationEventType + 15종 AuditAction`으로 정정하고, §12.10/12.11 NotificationOutbox `eventType` 필드를 `NotificationEventType 6종` 또는 `REVIEW_WORKFLOW §9.1 canonical enum subset`으로 정정하라."
    },
    {
      "id": "CM6-02",
      "severity": "major",
      "category": "db-schema",
      "title": "§12 물리 table 인벤토리 번호가 본문 heading과 맞지 않아 참조가 흔들린다",
      "evidence": [
        "docs/features/content-migration.md:1006 changelog는 PolicyReevaluateRecord를 §12.10으로 승격하고 NotificationOutbox·ActiveTargetLock을 §12.11·§12.12로 이동했다고 설명한다.",
        "docs/features/content-migration.md:1228 은 `### 12.10-pre ContentMigrationPolicyReevaluateRecord`로 되어 있다.",
        "docs/features/content-migration.md:1250 은 `### 12.10 ContentMigrationNotificationOutbox`, 1274는 `### 12.11 ContentMigrationActiveTargetLock`으로 되어 있다.",
        "docs/features/content-migration.md:1307-1322 의 총괄 인벤토리는 PolicyReevaluateRecord=12.10, NotificationOutbox=12.11, ActiveTargetLock=12.12라고 표기한다."
      ],
      "impact": "물리 테이블 12개라는 결정은 명확하지만, 본문 section anchor가 총괄 인벤토리와 달라 구현/리뷰/마이그레이션 DDL 참조가 어긋난다. 특히 `§12.11 lock` 같은 기존 참조가 NotificationOutbox인지 ActiveTargetLock인지 문맥 의존으로 변한다.",
      "recommendation": "본문 heading을 총괄 인벤토리와 일치시켜 `12.10 ContentMigrationPolicyReevaluateRecord`, `12.11 ContentMigrationNotificationOutbox`, `12.12 ContentMigrationActiveTargetLock`으로 재번호 매김하라. `12.10-pre`와 stale §12.9.1 참조도 제거하라."
    },
    {
      "id": "CM6-03",
      "severity": "minor",
      "category": "runtime-fail-rules",
      "title": "skipStep rollbackClass 제거 후에도 §9.2 fail rule에 제거된 입력 필드가 남아 있다",
      "evidence": [
        "docs/features/content-migration.md:342 의 SkipStepInput은 `stepResultId` 기반이고 rollbackClass 입력을 받지 않는다.",
        "docs/features/content-migration.md:407 의 requestFingerprint도 CM5-07에 따라 rollbackClass를 제거했다.",
        "docs/features/content-migration.md:908 은 여전히 `skipStep + rollbackClass ∉ (\"irreversible\",\"manual-remediation-required\")`를 runtime fail rule로 둔다."
      ],
      "impact": "주요 command contract는 이미 정정됐으나, acceptance/runtime rule만 보면 구현자가 제거된 `rollbackClass` input을 다시 요구할 수 있다.",
      "recommendation": "해당 fail rule을 `skipStep 대상 stepResult.rollbackClass != \"irreversible\" → runtime fail`로 바꾸고 `manual-remediation-required`는 rollbackClass가 아니라 remediationStatus reason임을 명시하라."
    }
  ],
  "standalone_readiness": {
    "sections_checked": ["§1.1", "§2.4", "§3.x", "§4.x", "§5.x", "§6.x", "§9.x", "§12.x", "REVIEW_WORKFLOW §9.1/§9.1.1/§10.2.1", "DATA_MODEL C-08"],
    "can_implement_as_single_sot": false,
    "blocking_gaps": [],
    "remaining_major_gaps": [
      "NotificationEvent 6종 cascade가 ContentMigrationNotificationOutbox schema와 상단 SoT 카운트까지 닫히지 않음",
      "§12 table numbering/anchor가 총괄 인벤토리와 불일치"
    ]
  },
  "legal_privacy_operability": {
    "medical_ad_law_operable": "partially",
    "privacy_law_operable": "mostly",
    "reason": "policy-reevaluate의 법적 엔티티 분해, PII export CHECK, legal approval, DryRunReport CAS는 운영 가능 수준으로 정리됐다. 다만 abort/compensation 알림 outbox enum 불일치가 의료광고/개인정보 관련 수동 보정 SLA 추적을 약화시킬 수 있어 최종 안정판 전 정정이 필요하다."
  },
  "required_changes_before_v1_0": [
    "NotificationEvent/AuditAction 카운트와 NotificationOutbox eventType enum을 6종/15종 기준으로 정정",
    "§12 heading 번호를 총괄 인벤토리와 일치시키고 stale §12.9.1/§12.11 참조 정리",
    "§9.2 skipStep fail rule에서 제거된 rollbackClass 입력 참조 삭제"
  ],
  "v1_0_stability_gate": {
    "blocking_count": 0,
    "major_count": 2,
    "minor_count": 1,
    "sot_cascade_synced": false,
    "ready_if_fixed": "CM6-01과 CM6-02를 정정하면 남는 CM6-03은 minor 수준이며, 그 시점에는 ready_for_v1_0 판정 가능성이 높다."
  }
}
