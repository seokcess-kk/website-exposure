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
session id: 019e25eb-7539-7b02-96a8-bf35ec670553
--------
user
# 자동 비평 의뢰 — `docs/features/crm-sync.md` v0.4 (4차 사이클)

## 컨텍스트

3차 비평(17 지적: blocking 6 + major 9 + minor 2) 전건 수용 + REVIEW_WORKFLOW·DATA_MODEL cascade. v0.4 핵심 변경:
- DB 인벤토리 **15 tables** 정정 (CrmChangeIdentityLedger·CrmConsentWithdrawalLedger 신설)
- CrmCredentialVersion·CrmIntegration state invariant 표 + rotating-revoked 잔재 제거
- NonceLedger key deliveryKind별 3분기 partial unique (exactly-once / at-least-once+eventId / at-least-once-no-eventId·best-effort)
- InboundProcessingContext + providerVersionToken + provider별 expectedCrmVersion 산정 표
- outbound CAS WHERE도 crm_version 포함
- CrmChangeIdentityLedger 신설 — webhook + polling idempotency 통합
- CrmConsentWithdrawalLedger + applyConsentWithdrawal command + AuditAction
- non-PII operational hints entity별 column 분리 (CrmRecord.operationalHints*)
- DB CHECK PostgreSQL dialect 명시 + 행정구역 allowlist는 application validator
- § 4.7 unregister 정책 표 + FK ON DELETE 정책
- purge worker SoT § 10.4 — cadence·batch·legal hold·failure reconcile + 테이블별 액션
- REVIEW_WORKFLOW § 10.2.1: 7종 AuditAction (RRN 2종 + consent 1종 추가)
- DATA_MODEL C-08 v0.20: genericRestApiAdapter + CredentialVersion 경계
- retry queue worker SQL 9단계 풀 전개
- § 1.1 변경 정책 + 7행 추가 (displayHints column·state enum·table 추가)
- § 8.2 acceptance test 49 cases + traceability 표
- § 11.4 잔여 리스크

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\crm-sync.md` v0.4를 이전과 동일한 강도로 엄정하게 비평하라:

1. **3차 지적 재발 여부**: 17개가 실제로 정정됐는가?
2. **v0.4 신규 도입 메커니즘 모순**:
   - CrmChangeIdentityLedger와 CrmWebhookNonceLedger의 책임 분리 — 같은 inbound webhook이 두 ledger를 모두 통과해야 하는가? 중복인가?
   - CrmConsentWithdrawalLedger 매칭 키(piiHash·crmExternalIdHash) — webhook payload에는 raw PII가 있으므로 piiHash 산정 가능, 그러나 polling/outbound 시 piiHash가 있는가?
   - InboundProcessingContext가 verifier→parser→validator→CAS 전 단계로 전달되지만 polling 경로에서는 verifier가 없는데 동일 context로 처리되는가?
   - CrmCredentialVersion `state=active` row 1개·`rotating-target` row 1개 application invariant — DB로 강제 불가능. 동시 rotate 호출 race 어떻게 막는가?
   - operational hints column이 PII 아니라고 했지만 desiredVisitDate·guardianInvolved 등은 일부 환경에서 식별성 위험 — 의료법 시점에서 안전한가?
   - § 10.4 purge worker 테이블별 액션과 § 4.7 unregister 정책 표의 액션이 충돌하지 않는가?
   - § 8.2 49 acceptance test 중 일부 (AT-35 migration backward-compatible)는 v0.3→v0.4 운영 데이터 부재 전제와 모순되지 않는가?
3. **DB schema 정합**:
   - § 13.1-§ 13.15가 정확히 15개 테이블인지
   - § 0과 § 13 헤더와 최하단 표가 모두 15로 정합한지
   - FK·UNIQUE·INDEX·partial unique·CHECK가 새 ledger 2개에 충분히 정의됐는지
4. **state machine 정합**:
   - CrmIntegration.credentialState 5상태와 CrmCredentialVersion.state 6상태 invariant 표가 모든 transition을 커버하는가?
   - reverted → stable의 "운영자 명시적 reset"이 운영 command로 정의됐는가?
5. **운영 사용성**:
   - 49 acceptance test로 v1.0 회귀 충분한가?
   - applyConsentWithdrawal·recoverRrnFalsePositive의 입력 형식이 OpenAPI/admin UI 관점에서 명확한가?
   - operational hints가 의료기관 운영자가 실제 화면에서 채울 정보 출처와 정합한가?
6. **cascade 무결성**:
   - REVIEW_WORKFLOW § 10.2.1에 3종 AuditAction (`crm-rrn-false-positive-recovered`·`crm-rrn-rejection-finalized`·`crm-consent-withdrawal-applied`)이 추가됐는가?
   - DATA_MODEL C-08 CrmIntegrationEntry에 genericRestApiAdapter가 추가됐는가? CrmCredentialVersion 경계 문구가 적절한가?
7. **문서 정합성**:
   - § 1.1 변경 정책 표에 새 메커니즘(ChangeIdentityLedger·ConsentWithdrawalLedger·operational hints) 추가가 SemVer 룰로 명확한가?
   - § 11 미결정 분류와 § 11.4 잔여 리스크의 경계가 명확한가?
   - 잔재 표현(예: "v0.3 § X 동일"이 너무 많아 본 문서가 v1.0 안정판으로 stand-alone하기 어려운지)이 있는가?

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `CS4-`.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\crm-sync.md` (대상 v0.4)
- `C:\Users\assag\solution\website-exposure\.codex-reviews\cs_cycle3_response.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md`
- `C:\Users\assag\solution\website-exposure\docs\features\search-visibility.md`
- `C:\Users\assag\solution\website-exposure\docs\features\asset-ingestion.md`
codex
요청 범위가 문서 리뷰라서 먼저 대상 문서와 cycle3 응답, cascade 문서를 나눠 읽고 정합성 체크리스트를 만들겠습니다. 이후 발견 사항만 JSON으로 정리하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw docs\\features\\crm-sync.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw docs\\core\\DATA_MODEL.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw docs\\admin\\REVIEW_WORKFLOW.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw .codex-reviews\\cs_cycle3_response.md" in C:\Users\assag\solution\website-exposure
 succeeded in 668ms:
# Core — 데이터 계약 명세

> **상태**: Draft v0.19
> **작성일**: 2026-05-14 (v0.19 → v0.20 — `features/crm-sync.md` 3차 사이클 cascade: C-08 CrmIntegrationEntry에 `genericRestApiAdapter` 추가 + manifest vs CrmCredentialVersion(admin DB) 경계 명시 — CS3-13)
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
| `genericRestApiAdapter` | `GenericRestApiAdapterConfig` | conditional | (v0.20 +) `provider="generic-rest-api"` 시 ✅. `webhookSignatureHeader`·`webhookTimestampHeader`·`webhookEventIdHeader`·`canonicalStringFormat` 4필드 (CS3-13). 누락 시 build fail (`features/crm-sync.md` § 10.1) |

> 동작 옵션(`mode`·`syncSchedule`·`entities`·`fieldMappingPolicyVersion`·`retryQueue`·`credentialRotation`·`pii`·`retentionDays` 등)은 `features[name="crm-sync"].config` SoT (`features/crm-sync.md` § 2.3). **CrmCredentialVersion**(credential rotation 상태 머신·secretVersionId) 등 admin DB entity는 `features/crm-sync.md` § 13 SoT. manifest는 `apiKeySecretRef` 등 secretRef만 보유 — register/rotate 시 admin DB materialization (CS3-13).

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
| 2026-05-14 | v0.20 | **`features/crm-sync.md` 3차 사이클 cascade (CS3-13)**: (1) CrmIntegrationEntry에 `genericRestApiAdapter` 필드 추가 — provider=generic-rest-api 시 required (webhookSignatureHeader·webhookTimestampHeader·webhookEventIdHeader·canonicalStringFormat 4필드), (2) manifest(secretRef) vs admin DB(`CrmCredentialVersion` — secretVersionId·rotation state) 경계 명시 |
| 2026-05-14 | v0.18 | **`features/asset-ingestion.md` 1차 사이클 cascade**: (1) **C-08 `assetIngestionConfig` 신설** (AssetIngestionConfig — sources webCrawl/snsApi/manualUpload/csvImport), (2) **C-08 `assetIngestionPolicyVersion`** (6 Feature policyVersion 동일 패턴), (3) **`AssetIngestionApprovedScope` 신규** — SerpCrawlerApprovedScope의 SERP 특화 필드 제거·자산 수집 특화(allowedDomains·allowedPathPrefixes·maxPagesPerCrawl·maxAssetSizeMb·artifactRetentionDaysMax) |
| 2026-05-14 | v0.17 | **`features/keyword-monitoring.md` 1차 사이클 cascade**: (1) **C-08 `keywordMonitoringConfig` 신설** (KeywordMonitoringConfig — search-visibility의 SerpCrawlerApprovedScope 게이트 패턴 재사용), (2) **C-08 `keywordMonitoringPolicyVersion`** (top-level, 4 Feature policyVersion 동일 패턴) |
| 2026-05-14 | v0.16 | **`features/search-visibility.md` 1차 사이클 cascade**: (1) **C-08 `searchVisibilityConfig` 신설** (SearchVisibilityConfig — serpCrawler/backlinkSource, serpCrawler.enabled=true + legalApproved 게이트 fail-gate), (2) **C-08 `searchVisibilityPolicyVersion`** (top-level, notifications·analytics 패턴 동일) |
| 2026-05-14 | v0.15 | **`features/analytics-reporting.md` 4차 사이클 cascade**: (1) **C-08 `analyticsPolicyVersion` 신설** — notifications policyVersion 패턴 동일 (필수, 패키지 병렬 보관), (2) **C-10 `mediaThresholdOperationalInput` 슬롯 분리** — rolling-90 operational snapshot은 본 슬롯, calendar 확정 판정은 `mediaThresholdAssessment` 슬롯. published record는 calendar 값만 (AR4-08) |
| 2026-05-14 | v0.14 | **`features/analytics-reporting.md` 1차 사이클 cascade**: (1) **C-08 `analyticsConfig` 신설** — `AnalyticsConfig`(sources.gsc·naverSearchAdvisor·ga4·rum 자격증명·사이트 식별자만, 동작 옵션은 `features.analytics-reporting.config`로 분리), (2) **C-10 `mediaThresholdAssessment` 슬롯** — `MediaThresholdAssessment` 신설(assessmentBasisDate·windowStart/End·rollingAverageDailyUsers·thresholdReached·primarySource·sourceCompleteness·timezone·calendarPolicy·botFilteringPolicy·legalBasisNote). priorReviewRequired 산정 근거. ComplianceRecord 발행 시 snapshot으로 고정 |
| 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `AdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`eligibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·digestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IANATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |


 succeeded in 668ms:
# Feature — crm-sync

> **상태**: Draft v0.4 (codex 자동 비평 3차 반영 — 17개 지적 전건 수용)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 11.1
> **목적**: 클라이언트 의료기관 CRM과 솔루션 사이의 양방향 데이터 동기화. solution DB는 **raw PII 저장 금지** (closed-schema displayHints + non-PII operational columns만). webhook(실시간) + polling(배치).
> **연관 문서**:
> - 알림·audit → notifications + REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (cascade 완료 — 4종 NotificationEventType·7종 AuditAction)
> - 자격증명·식별자·policyVersion → DATA_MODEL C-08 v0.20 (`crmSyncConfig`·`crmSyncPolicyVersion`·`genericRestApiAdapter` — CS3-13)
> - RRN checksum 알고리즘 재사용 → `features/asset-ingestion.md` § 9.1
> - retry queue·outbox worker SQL 재사용 → `features/search-visibility.md` § 13.5·§ 13.10

---

## 0. 한 페이지 요약

- **Feature 식별자**: `crm-sync`
- **핵심 책임**: (a) 외부 CRM 양방향 sync, (b) field-level mapping + record-level CAS 충돌 해결, (c) webhook(실시간) + polling(배치), (d) **solution DB raw PII 저장 금지** (closed-schema displayHints + non-PII operational hints), (e) DPA·credential rotation·만료 알림, (f) 환자 동의 철회 tombstone (CS3-05)
- **vs ReservationPage(C-20)**: C-20은 콘텐츠 페이지. 본 Feature는 ReservationSubmission·Inquiry·ConversionEvent·Contact 운영 이벤트 sync
- **provider 3종 (v1.0)**: `salesforce`·`hubspot`·`generic-rest-api`. `korean-emr` v1.x (CS-13)
- **운영 모드 2종**: `bi-directional`·`outbound-only`
- **sync entity 4종 (v1.0)**: `reservation`·`contact`·`inquiry`·`conversion-event`. `appointment` v1.x (CS-12)
- **PII 정책**: raw PII 저장 금지. liveRead v1.x (CS-14). v1.0 화면은 displayHints + non-PII operational hints
- **RRN deny**: v1.0 강제. asset-ingestion § 9.1 checksum 재사용. false positive 복구 + audit cascade (CS3-11)
- **DB 인벤토리 (CS3-06 정정)**: **15 tables** (§ 13.1 ~ § 13.15)

---

## 1. 일반 규약

### 1.1 변경 정책 (CS3-14 보강)

| 변경 유형 | 패키지 SemVer | policyVersion | 동반 cascade |
|---|---|---|---|
| 입력/출력 인터페이스 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9·§ 10 |
| provider type 추가 | MINOR | 별개 | DATA_MODEL C-08·adapter contract·webhook verifier·build validation |
| provider type 제거 | **MAJOR** | 별개 | |
| sync entity 추가 | MINOR | 별개 | CrmFieldMapping·v1.0 canonical schema 본 문서 § 3.2 |
| sync entity 제거 | **MAJOR** | 별개 | |
| field mapping schema 변경 | **MAJOR** | policyVersion 신규 | |
| 충돌 해결 알고리즘 변경 | **MAJOR** | policyVersion 신규 | |
| 알림 매트릭스 변경 | **MAJOR** | policyVersion 신규 | |
| 운영 모드 추가 | **MAJOR** | 별개 | |
| build/runtime/migration fail 룰 추가·강화 | **MAJOR** | 별개 | |
| runtime invariant·reconcile 룰 추가·강화 | MINOR | 별개 | |
| warning → fail 승격 | **MAJOR** | 별개 | |
| warning·지표·acceptance test 추가 | PATCH | 별개 | |
| **displayHints column 추가** (CS3-14) | **MINOR** | 별개 | read API output schema 변경. backward-compatible — 기본 nullable |
| **displayHints column 제거·타입 변경** (CS3-14) | **MAJOR** | policyVersion 신규 | DB migration 필수 |
| **non-PII operational column 추가** (CS3-14) | **MINOR** | 별개 | column nullable + 운영자 화면 점진 노출 |
| **CrmCredentialVersion.state enum 추가** (CS3-14) | **MINOR** | 별개 | 신규 상태는 backward-compatible transition rule + 기존 worker 무영향 |
| **CredentialVersion.state enum 제거·이름 변경** | **MAJOR** | policyVersion 신규 | migration |
| **DB table 추가** (CS3-14) | **MINOR** | 별개 | migration + invariant 표 추가. 기존 invariant 무영향 |
| **DB table 제거·rename** | **MAJOR** | policyVersion 신규 | migration |

### 1.2 SoT 원칙

- 알림 발송·audit canonical SoT → notifications + REVIEW_WORKFLOW § 9.1.1·§ 10.2.1
- 자격증명·DPA·policyVersion SoT → DATA_MODEL C-08 v0.20
- RRN checksum SoT → `features/asset-ingestion.md` § 9.1
- retry queue·outbox worker SQL SoT → `features/search-visibility.md` § 13.5·§ 13.10
- 본 문서 = sync 파이프라인·field mapping·CAS·PII closed schema·credential rotation 상태·v1.0 entity canonical schema·consent withdrawal tombstone SoT

### 1.2.1 공통 retry taxonomy

| 큐 | maxAttempts | backoff |
|---|---|---|
| CrmSyncRetryQueue | config(기본 5)·configurable | [60, 300, 1800, 7200, 21600]s |
| CrmSyncNotificationOutbox | 상수 5 | search-visibility § 7.3 SQL 동일 |

### 1.3 본 문서가 다루지 않는 영역

- 알림 채널·재시도 → notifications
- 외부 CRM 운영·계약 → 클라이언트·CRM provider
- Core 콘텐츠 변환 → asset-ingestion. CRM→Core auto promote는 v1.x (CS-11)
- 의료 진료 기록 보관 → CRM·EMR
- raw PII 실시간 조회 → v1.x (CS-14)

---

## 2. Feature 정의

### 2.1 기본 메타

```yaml
name: "crm-sync"
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
| REVIEW_WORKFLOW § 10.2.1 | 7종 AuditAction (CS3-11 RRN 2종 + CS3-05 동의 철회 1종 추가) |
| DATA_MODEL C-08 v0.20 | `crmSyncConfig`·`crmSyncPolicyVersion`·`genericRestApiAdapter` |
| DATA_MODEL CT-03·C-20 | 참조만 |
| asset-ingestion § 9.1 | RRN checksum 재사용 |
| search-visibility § 13.5·§ 13.10 | retry queue·outbox SQL 패턴 |

### 2.3 InstanceManifest 통합

```yaml
crmSyncConfig:
  integrations:
    - id: "main-crm"
      provider: "salesforce"
      apiKeySecretRef: "secretRef://CRM_SALESFORCE_OAUTH"
      apiUrl: "https://example.my.salesforce.com"
      webhookSecret: "secretRef://CRM_SALESFORCE_WEBHOOK_SECRET"
      credentialExpiresAt: "2027-01-01T00:00:00Z"
      legalApproved: true
      legalApprovedBy: "legal@glitzy.kr"
      legalApprovedAt: "2026-05-10T00:00:00Z"
      dpaEvidenceRef: "secretRef://CRM_DPA_CONTRACT_REF"
      genericRestApiAdapter:                            # provider=generic-rest-api 시 required
        webhookSignatureHeader: "X-Webhook-Signature"
        webhookTimestampHeader: "X-Webhook-Timestamp"
        webhookEventIdHeader: "X-Webhook-Event-Id"
        canonicalStringFormat: "timestamp.method.path.bodySha256"

crmSyncPolicyVersion: "cs-2026-05-14"

features:
  - name: "crm-sync"
    version: "0.4.0"
    enabled: true
    requiresFeature: [notifications]
    config:
      mode: "bi-directional"
      syncSchedule:
        pollIntervalMinutes: 15
        timezonePolicy: { missedRunCarryOverMaxDays: 7, dstNonexistentLocalTime: "next-valid", dstAmbiguousLocalTime: "first" }
      entities:
        reservation: { enabled: true, conflictResolution: "last-write-wins-by-timestamp" }
        contact: { enabled: true, conflictResolution: "crm-authoritative" }
        inquiry: { enabled: true, conflictResolution: "solution-authoritative" }
        conversionEvent: { enabled: true, conflictResolution: "outbound-only-no-conflict" }
      fieldMappingPolicyVersion: "cs-fm-2026-05-14"
      webhookEndpoint:
        path: "/api/crm-sync/webhook/{integrationId}"
        timestampToleranceSeconds: 300
      retryQueue:
        maxAttempts: 5
        backoffSeconds: [60, 300, 1800, 7200, 21600]
        workerPollIntervalSeconds: 30
      credentialRotation:
        warnDaysBeforeExpiry: 14
        autoNotifyEnabled: true
        rotationGracePeriodMinutes: 30
      rateLimit:
        bucketBackend: "redis-token-bucket"
        salesforce: { tokensPerHour: 1000, burst: 200 }
        hubspot: { tokensPer10sec: 100, burst: 20 }
        genericRestApi: { tokensPerHour: 500, burst: 100 }
        retryAfterRespected: true
      pii:
        rawPiiStorageAllowed: false
        displayHintsRetentionDays: 30
        ssnRrnHandling: "deny"
        liveReadEnabled: false
      retentionDays:
        syncLog: 730
        sourceAttempt: 730
        changeLog: 1095
        conflictRecord: 1095
        retryQueueCompleted: 30
        notificationOutbox: 30
        consentWithdrawalLedger: 1095                   # CS3-05
      webhookNonceLedgerRetentionMinutes: 360
      purgeWorker:                                       # CS3-10
        cadenceMinutes: 60
        batchSize: 500
        legalHoldOverride: false
      externalMonitoringSink: { provider: "sentry", dsnSecretRef: "secretRef://MONITORING_DSN" }
```

---

## 3. 입력·출력

### 3.1 엔트리포인트 + read API + 운영 command + mode matrix

| 종류 | 함수 | 책임 | 권한 | bi-directional | outbound-only |
|---|---|---|---|---|---|
| 실행 | `runSync(input)` | sync cycle | operator·super-admin | 허용 | direction="outbound"만. inbound/both → runtime fail |
| 실행 | `processInboundWebhook` | webhook 수신 | system | 허용 | endpoint 미등록 (HTTP 404). direct invocation → runtime fail |
| 실행 | `pushOutbound(entity, recordId, operation)` | 즉시 push | operator·super-admin·system | 허용 | 허용 |
| 실행 | `resolveConflict` | 충돌 해결 | operator·super-admin | 허용 | 호출 불가 |
| 실행 | `recoverRrnFalsePositive(ledgerId, action)` | RRN 복구 | super-admin | 허용 | 허용 |
| 실행 | `applyConsentWithdrawal(piiHash \| crmExternalId, scope)` | 환자 동의 철회 (CS3-05) | super-admin | 허용 | 허용 |
| read | `queryCrmRecords` | displayHints + non-PII operational hints | operator·super-admin·legal-reviewer | 허용 | 허용 |
| read | `queryConflicts` | 충돌 큐 | operator·super-admin | 허용 | 빈 결과 |
| 운영 | `registerIntegration` | | super-admin | 허용 | 허용 |
| 운영 | `unregisterIntegration` | § 4.7 unregister 정책 | super-admin | 허용 | 허용 |
| 운영 | `rotateCredential` | rotation § 4.5 | super-admin | 허용 | 허용 |

**v1.0 미제공**: `liveReadCrmDetail` (CS-14 v1.x).

### 3.1.1 audit log contract (CS3-11 — 3종 cascade 추가)

| AuditAction | contentRef | metadata | 권한 |
|---|---|---|---|
| `crm-integration-registered` | `"crm-integration:" + integrationId` | provider·apiUrl·legalApprovedBy·dpaEvidenceRefHash | super-admin |
| `crm-integration-unregistered` | `"crm-integration:" + integrationId` | activeBefore·activeAfter·unregisteredBy·unregisterPolicySnapshot (§ 4.7) | super-admin |
| `crm-sync-conflict-resolved` | `"crm-conflict:" + conflictId` | resolution·winningSide·resolvedBy·entityType·fieldPath·appliedFieldVersion | operator·super-admin |
| `crm-credential-rotated` | `"crm-integration:" + integrationId` | rotatedBy·priorCredentialFingerprint·newCredentialFingerprint·rotationAttemptId | super-admin |
| **`crm-rrn-false-positive-recovered`** | `"crm-ledger:" + ledgerId` | priorStatus·finalStatus·rrnFingerprint[0:4]·actorRole·crmExternalId (있을 시) | super-admin |
| **`crm-rrn-rejection-finalized`** | `"crm-ledger:" + ledgerId` | priorStatus·finalStatus="rejected-rrn-final"·actorRole | super-admin |
| **`crm-consent-withdrawal-applied`** | `"crm-consent:" + withdrawalLedgerId` | scope·piiHash[0:8]·crmExternalIdHash·displayHintsNulled·tombstoneCreated·integrationId | super-admin |

**credential fingerprint**: `HMAC-SHA256(auditPepperSecretRef, integrationId + ":" + secretVersionId)` 16 hex prefix.

### 3.2 v1.0 운영 이벤트 canonical schema

```ts
type ReservationSubmission = {
  submissionId: string;
  reservationPageRef: Ref<C-20>;
  ctaConfigRef?: Ref<CT-03>;
  source?: string; campaign?: string;
  submittedAt: Date;
  status: "pending" | "synced-to-crm" | "synced-failed";
  piiHash: string;
  displayHints: ContactDisplayHints;
  operationalHints: ReservationOperationalHints;        // CS3-07
  crmExternalId?: string;
};

type Inquiry = {
  inquiryId: string; source?: string;
  inquiryType: "general" | "appointment-related" | "billing" | "other";
  submittedAt: Date;
  status: "pending" | "synced-to-crm" | "responded-on-crm";
  piiHash: string;
  displayHints: ContactDisplayHints;
  operationalHints: InquiryOperationalHints;
  crmExternalId?: string;
};

type ConversionEvent = {
  conversionEventId: string;
  eventType: "form-submit" | "phone-click" | "page-view-threshold" | "cta-click";
  occurredAt: Date;
  pageRef?: string;                                      // Ref union 또는 string ref (CS3-17 — `Ref<C-anything>` 정정)
  attributionSource?: string;
};

type Contact = {
  contactId: string;
  crmExternalId: string;
  displayHints: ContactDisplayHints;
  operationalHints: ContactOperationalHints;
  lastSyncedAt: Date;
  consentWithdrawn: boolean;                             // CS3-05 — 동의 철회 적용 여부
};
```

#### 3.2.1 ContactDisplayHints — **closed schema 6 column**

| 필드 | 타입 | CHECK / validator |
|---|---|---|
| `nameInitial` | varchar(8) | DB CHECK: `length≤8` + `~ '^[가-힣A-Za-z]'` (CS3-08 — 환경 의존적 `\p{L}` 회피). application validator: 정규식 `^[\p{L}](O\*?)?$` canonical |
| `phoneLast4` | char(4) | DB CHECK `~ '^[0-9]{4}$'` |
| `emailDomain` | varchar(64) | DB CHECK `~ '^@[a-z0-9.-]+$'` |
| `cityName` | varchar(32) | DB CHECK: 길이 + 한글/공백 문자 클래스만. **행정구역 allowlist는 application validator + lookup table (`CrmAdminRegionAllowlist` v1.x — CS3-08)** |
| `genderHint` | enum(`male`·`female`·`other`·`unknown`) | enum |
| `ageBand` | enum(`teen`·`20s`·`30s`·`40s`·`50s`·`60+`·`unknown`) | enum |

**Note (CS3-08)**: DB CHECK는 길이·문자 클래스·금지 문자에 한정. application validator가 canonical (PostgreSQL regex dialect 명시. 다른 DB 이식 시 dialect 재정의).

#### 3.2.2 non-PII operational hints (CS3-07 — 신규)

운영자 화면이 raw PII 없이도 충돌·재시도·문의 대응을 판단할 수 있도록 entity별 non-PII column 분리:

**ReservationOperationalHints**:
| 필드 | 타입 |
|---|---|
| `entityStatus` | enum (해당 ReservationSubmission.status) |
| `departmentHint` | varchar(32) — 진료과 hint (PII 아님) |
| `locationKey` | varchar(32) — 지점·분원 식별자 |
| `channelType` | enum (`web-form`·`phone-callback`·`partner-referral`) |
| `desiredVisitDate` | Date — 환자 입력 희망 방문일 (PII 아님 — date만) |
| `guardianInvolved` | boolean — 보호자 동반 여부 |

**InquiryOperationalHints**:
| 필드 | 타입 |
|---|---|
| `entityStatus` | enum |
| `inquiryType` | enum |
| `departmentHint` | varchar(32) |
| `locationKey` | varchar(32) |
| `channelType` | enum |

**ContactOperationalHints**:
| 필드 | 타입 |
|---|---|
| `relationToInstitution` | enum (`new-prospect`·`existing-patient`·`partner`·`unknown`) |
| `preferredChannelType` | enum |
| `locationKey` | varchar(32) |

이들은 PII 아니므로 자유롭게 운영자 화면에 노출. 위 enum·string 외 자유 JSON 금지.

**raw PII 필요 시 CRM 콘솔 접근 경로 (CS3-07)**:
- SSO: 의료기관·Glitzy 계정 분리. solution 운영자가 CRM 직접 접근하려면 별도 CRM SSO 필요
- role mapping: solution super-admin이라고 CRM admin 자동 부여 안 됨. CRM 측 권한은 의료기관 책임
- deep link: queryCrmRecords 결과의 `crmExternalId`로 CRM 콘솔 deep link 생성 가능 (config `crmConsoleBaseUrl` 별도 — v1.x)
- audit: CRM 콘솔 접근은 CRM provider 측 audit log 책임. solution audit 범위 외

### 3.3 RunSyncInput·Result

```ts
type RunSyncInput = { /* v0.3 § 3.3 동일 */ };
type RunSyncResult = { /* v0.3 § 3.3 동일 */ };
```

### 3.4 webhook 처리

```ts
async function processInboundWebhook(
  integrationId: string,
  headers: Record<string,string>,
  rawBody: Buffer,
  fullUrl: string,
  method: string
): Promise<{
  status: "accepted" | "rejected-signature" | "rejected-replay" | "rejected-stale-timestamp"
        | "rejected-credential-expired" | "rejected-rrn-detected" | "rejected-mode-disallowed"
        | "rejected-consent-withdrawn" | "queued" | "deduped";
  recordsProcessed: number; conflicts: number;
  ledgerStatus?: "new" | "duplicate-eventid" | "duplicate-eventid-bucket" | "duplicate-digest" | "rejected-final";
}>;
```

#### 3.4.1 ProviderWebhookVerifier — VerifierResult (CS2-03)

```ts
interface ProviderWebhookVerifier {
  verify(input: { rawBody: Buffer; headers: Record<string,string>; fullUrl: string; method: string }): VerifierResult;
}

type VerifierResult = {
  signatureValid: boolean;
  providerEventId: string | null;
  providerTimestamp: Date | null;
  canonicalDigest: string;
  deliveryKind: "at-least-once" | "exactly-once" | "best-effort";
  retrySemantics: "provider-retries" | "no-retry";
  providerVersionToken?: string;                        // CS3-03 — provider별 record-level version 식별자 (replayId·etag·lastModified)
  errorReason?: "signature-mismatch" | "missing-headers" | "malformed-payload";
};
```

#### 3.4.2 provider별 adapter contract

| Provider | payload | signature | timestamp | eventId | canonical string | providerVersionToken (CS3-03) |
|---|---|---|---|---|---|---|
| Salesforce Outbound Messages | XML SOAP | HMAC-SHA256(secret, rawBody) | `Sforce-Send-Time` | XML `Id` | `timestamp + "." + bodySha256` | XML `SystemModstamp` |
| Salesforce Platform Events | JSON CometD | HMAC-SHA256 (orgId 기반) | `OrganizationId+ReplayId` | `replayId` | 동일 | `replayId` |
| HubSpot | JSON | HMAC-SHA256(secret, `method + url + body + timestamp`) | `X-HubSpot-Request-Timestamp` | header 또는 body `eventId` | provider 정의 | `propertyChange.versionTimestamp` 또는 `updatedAt` |
| generic-rest-api | JSON | HMAC-SHA256(secret, canonicalString) | config | config | config | config (`versionTokenJsonPath`) |

#### 3.4.3 InboundProcessingContext (CS3-03 — 신규)

verifier 결과부터 CAS 단계까지 전달되는 명시 context:

```ts
type InboundProcessingContext = {
  integrationId: string;
  verifierResult: VerifierResult;
  rawBody: Buffer;
  parsedPayload: ParsedCrmPayload;                      // adapter별 정의
  source: "webhook" | "polling";                        // CS3-04 — webhook과 polling 동일 idempotency
  receivedAt: Date;
  ledgerId: string | null;                              // webhook 경로만 (polling은 null)
  // CRM 측 record version (provider별)
  providerVersionToken: string | null;
  // CAS expected version 도출
  expectedCrmVersion: number;                           // 산정 규칙은 § 4.3.5
};
```

**polling 경로의 idempotency (CS3-04)**:
- polling이 가져온 record도 동일 `parsedPayload.crmExternalId + providerVersionToken` 기반의 `CrmChangeIdentityLedger`(§ 13.13)에 unique 키로 통과 — webhook과 polling이 같은 변경을 중복 처리하지 않음

### 3.4.4 CRM 측 changeIdentityKey 산정

```
changeIdentityKey = HMAC-SHA256(secret-static, integrationId + ":" + entity + ":" + crmExternalId + ":" + providerVersionToken)
```

`providerVersionToken`이 null인 provider는 changeIdentity 사용 불가 → polling 단독 동작. webhook과 충돌 가능성은 nonceLedger로 차단.

---

## 4. sync 파이프라인

### 4.1 outbound (CS3-04 강화 — CAS WHERE crm_version 포함)

```
1. pushOutbound(entity, recordId, operation)
2. solution record load → CrmFieldMapping(direction includes "outbound")로 변환
3. PII Redaction Validator (closed-schema + operational hints 통과 검증)
4. RRN 검사 — 검출 시 push 차단 + 운영자 alert + ledger
5. **consent withdrawal 체크** (CS3-05) — `CrmConsentWithdrawalLedger`에서 piiHash 또는 crmExternalId 매칭 → push 차단
6. credential state 검사 (§ 4.5.3 사용 matrix)
7. rate limit token 획득
8. CRM API call (idempotency-key)
9. CrmRecord 갱신 — **CAS WHERE 양방향 version 모두 검사 (CS3-04)**:
   `WHERE id=? AND solution_version=? AND crm_version=?`
   → 0 rows affected → race detected → CrmConflictRecord 생성
10. CrmRecordChangeLog insert (closed-schema)
```

### 4.2 inbound (CS3-02·03·04 강화)

```
1. CRM webhook → endpoint POST → processInboundWebhook (mode="outbound-only" → 404)
2. ProviderWebhookVerifier.verify(rawBody, headers, fullUrl, method) → VerifierResult
   - signatureValid=false → HTTP 401. ledger 미기록
3. providerTimestamp 검증 (있으면) → rejected-stale-timestamp
4. **CrmWebhookNonceLedger insert — deliveryKind별 partial unique (CS3-02)**:
   - `exactly-once` (providerEventId 보장): key=`(integrationId, providerEventId)`. 중복 → `duplicate-eventid` → HTTP 200 deduped
   - `at-least-once` + providerEventId 있음: key=`(integrationId, providerEventId, receivedBucket)`. 같은 bucket 내 중복 → `duplicate-eventid-bucket`
   - `at-least-once` + providerEventId 없음 또는 `best-effort`: key=`(integrationId, canonicalDigest, receivedBucket)`. 중복 → `duplicate-digest`
   - status enum: `accepted-pending` | `accepted-processed` | `rejected-rrn-recoverable` | `rejected-rrn-final` | `rejected-parse-recoverable`
5. **RRN 검사** (asset-ingestion § 9.1 checksum) — 검출 시 ledger `rejected-rrn-recoverable` (복구 가능) 또는 `rejected-rrn-final`
6. payload 파싱 + CrmFieldMapping(direction includes "inbound") 역변환
7. **InboundProcessingContext 생성** (CS3-03 § 3.4.3)
8. **consent withdrawal 체크** (CS3-05) — 매칭 시 ledger `accepted-processed` 대신 → status="rejected-consent-withdrawn" + displayHints nulling 유지
9. **closed-schema validator** — 위반 시 ledger `rejected-parse-recoverable` 후 reject
10. **changeIdentityKey 생성 후 CrmChangeIdentityLedger insert** (CS3-04) — UNIQUE 충돌 시 duplicate → 즉시 종료 (polling과의 idempotency)
11. CrmRecord field-level CAS 갱신 (§ 4.3)
12. ledger `accepted-processed` 갱신 → HTTP 200 accepted
```

#### 4.2.1 RRN false positive 복구

```
recoverRrnFalsePositive(ledgerId, action: "override-and-fetch" | "abandon"):
1. ledger row 조회 — status="rejected-rrn-recoverable"만 허용 (다른 status → runtime fail)
2. action="override-and-fetch":
   - CRM live pull → RRN 재검사 → 통과 시 inbound 처리. ledger → "accepted-processed"
   - 재검출 시 → "rejected-rrn-final"
   - audit `crm-rrn-false-positive-recovered`
3. action="abandon": ledger → "rejected-rrn-final". audit `crm-rrn-rejection-finalized`
```

### 4.3 field-level 충돌 해결 + CAS (CS3-04)

#### 4.3.1 FieldAuthority — v0.3 § 4.3.1 동일

#### 4.3.2 CAS WHERE 조건 (CS3-04 강화)

```sql
-- inbound: 양방향 version 모두 검사
UPDATE crm_record
SET display_hints_name_initial=$1, /* ... */,
    operational_hints_department_hint=$N, /* CS3-07 */,
    crm_version=$newCrmVersion, last_synced_at=$now
WHERE id=$recordId AND crm_version=$expectedCrmVersion AND solution_version=$expectedSolutionVersion;

-- outbound: 양방향 version 모두 검사
UPDATE crm_record
SET solution_version=solution_version+1, crm_external_id=$crmId, last_synced_at=$now
WHERE id=$recordId AND solution_version=$expectedSolutionVersion AND crm_version=$expectedCrmVersion;
```

0 rows affected → ConflictRecord. field-level은 SELECT FOR UPDATE.

#### 4.3.3 ConflictRecord — v0.3 § 4.3.3 동일

#### 4.3.4 manual escalate 결정표 — v0.3 § 4.3.4 동일

#### 4.3.5 expectedCrmVersion 산정 (CS3-03 — 신규)

| provider | providerVersionToken 출처 | expectedCrmVersion 산정 |
|---|---|---|
| Salesforce Outbound Messages | XML `SystemModstamp` ISO8601 | epoch ms로 변환 |
| Salesforce Platform Events | `replayId` integer | 직접 사용 |
| HubSpot | `propertyChange.versionTimestamp` | epoch ms |
| generic-rest-api | config `versionTokenJsonPath` 추출 후 type config | epoch ms 또는 integer (config) |
| polling | provider별 list API의 `lastModified` 등 | 동일 |

`providerVersionToken=null`인 provider는 expectedCrmVersion=현재 row.crm_version+1로 fallback. 이 경우 lost update 검출 못함 — provider별 운영 위험 명시.

### 4.4 retry queue (CS3-12 — search-visibility § 13.5 풀 SQL 전개)

§ 13.4 schema + § 13.4.1 worker contract 풀 전개:
1. RetryQueue claim (SKIP LOCKED)
2. **per-integration advisory lock** (provider rate-limit 직렬화)
3. **SourceAttempt insert** (transaction 내) — `(syncLogId, integrationId, entity, direction, attemptNumber)` UNIQUE
4. provider call
5. **attempt finalization** — SourceAttempt status update
6. **SyncLog.envelopeState 재계산** — `recalcEnvelope(syncLogId)` 트랜잭션 후
7. **stale reclaim** — lockedAt > 10분 → status='pending' 복귀
8. **exhausted 전이** — attemptNumber ≥ maxAttempts → status='exhausted' + sink alert
9. **permanent 전이** — lastErrorClass='permanent' → status='failed-permanent' 즉시 + sink alert

transaction 순서·advisory lock ordering 풀 SQL은 § 13.4.1.

### 4.5 credential rotation 상태 머신 (CS3-01 강화)

#### 4.5.1 CrmCredentialVersion entity — § 13.11

#### 4.5.2 두 enum의 invariant 표 (CS3-01)

**CrmIntegration.credentialState** 5상태: `stable`·`rotating`·`committed`·`grace-expired`·`reverted`.
**CrmCredentialVersion.state** 6상태: `active`·`rotating-target`·`committed`·`grace-expired`·`reverted`·`revoked`.

| Integration state | CredentialVersion rows (per integration) | 의미 |
|---|---|---|
| `stable` | 1 row `state=active` (others `revoked`) | 정상. outbound/inbound 모두 active 사용 |
| `rotating` | 1 row `state=active` (이전) + 1 row `state=rotating-target` (신규) | rotation 진행 중. outbound new 우선·old fallback. inbound verifier active + rotating-target 병행 |
| `committed` | 1 row `state=committed` (이전·graceUntil 설정) + 1 row `state=active` (신규) | rotation 성공. outbound active만. inbound active + committed 병행 (graceUntil까지) |
| `grace-expired` | 1 row `state=active` (others `revoked` 또는 `grace-expired`) | committed의 graceUntil 도래. outbound/inbound 모두 active만 |
| `reverted` | 1 row `state=active` (원래) + 1 row `state=reverted` (신규 실패) | rotation 실패. outbound/inbound active만 |

전이:
- `stable → rotating`: `rotateCredential` 호출. 새 CredentialVersion(state=rotating-target) insert. Integration.state="rotating"
- `rotating → committed`: health check 성공. 신규 row state=active·이전 row state=committed·graceUntil 설정. Integration.state="committed"·currentCredentialVersionId 갱신
- `rotating → reverted`: health check 실패. 신규 row state=reverted. Integration.state="reverted". 사용자 알림
- `committed → grace-expired`: graceUntil 도래 (background worker). 이전 row state=revoked. Integration.state="grace-expired"
- `grace-expired → stable`: 다음 stable cycle (즉시 transition. 운영상 같은 의미)
- `reverted → stable`: 운영자 확인 후 명시적 reset

**rotating-revoked 잔재 제거** (CS3-01): § 4.1 step 6의 `≠ "rotating-revoked"` 표현은 폐기. **§ 4.5.3 사용 matrix가 SoT**.

#### 4.5.3 outbound/inbound 사용 matrix

| Integration state | outbound 사용 credential | inbound verifier 허용 credential |
|---|---|---|
| stable | active | active만 |
| rotating | new(rotating-target) 우선·old(active) fallback | active + rotating-target 병행 |
| committed | active(신규) only | active + committed(이전) 병행 (graceUntil까지) |
| grace-expired | active(신규) only | active만 |
| reverted | active(원래) | active만 |

### 4.6 outbox — search-visibility § 7.2·§ 7.3 SQL 동일

### 4.7 unregister 정책 표 (CS3-09 신규)

`unregisterIntegration(integrationId, options)`:

| 대상 | 즉시 액션 | 보존 | FK ON DELETE |
|---|---|---|---|
| CrmIntegration | `active=false` (soft delete) | tombstone 보존 (legal hold) | — |
| CrmCredentialVersion (모든 row) | state="revoked" | 보존 | RESTRICT |
| CrmRecord.displayHints* | 즉시 nulling (option `keepDisplayHints=false` 기본) | row 유지 | — |
| CrmRecord.operationalHints* | row 유지 | row 유지 | — |
| CrmRecordChangeLog | row 유지 (감사 보존) | retentionDays.changeLog | RESTRICT |
| CrmConflictRecord (open) | resolution="manual-rejected" | retentionDays.conflictRecord | RESTRICT |
| CrmSyncRetryQueue (pending/processing) | status="failed-permanent" | retentionDays.retryQueueCompleted | RESTRICT |
| CrmSyncNotificationOutbox (pending) | status="permanent" | retentionDays.notificationOutbox | RESTRICT |
| CrmWebhookNonceLedger | row 유지 | webhookNonceLedgerRetentionMinutes | RESTRICT |
| CrmChangeIdentityLedger | row 유지 | retentionDays.changeLog 동일 | RESTRICT |
| CrmConsentWithdrawalLedger | row 유지 (legal hold) | retentionDays.consentWithdrawalLedger | RESTRICT |
| webhook endpoint | 즉시 미등록 (HTTP 404) | — | — |
| inbound polling | 즉시 중단 | — | — |

audit metadata에 `unregisterPolicySnapshot` (options) 포함.

### 4.8 consent withdrawal (CS3-05 신규)

`applyConsentWithdrawal(piiHash | crmExternalId, scope: "all" | "marketing-only")`:

```
1. CrmConsentWithdrawalLedger insert — piiHash·crmExternalIdHash·scope·integrationId·appliedAt
2. CrmRecord(s) 매칭 → displayHints* 모두 nulling. operationalHints는 보존. consentWithdrawn=true 설정
3. CrmRecordChangeLog tombstone insert (changedFields = {tombstone: true})
4. 향후 inbound webhook/polling — § 4.2 step 8에서 매칭 → "rejected-consent-withdrawn" 처리
5. 향후 outbound push — § 4.1 step 5에서 차단
6. audit `crm-consent-withdrawal-applied`
```

v1.x에서 patientConsentEvidenceRef 도입 시 record-level evidence 연결 (CS-07).

---

## 5. provider 어댑터 (v1.0 — 3종)

§ 3.4.2 adapter contract 참조. korean-emr v1.x (CS-13).

### 5.1 rate limit (CrmRateLimitState — § 13.10)

provider별 redis token bucket. retry-after respect.

---

## 6. 알림 (CS2-11)

### 6.1 NotificationEventType — v0.3 동일

### 6.2 outbox — search-visibility § 7.2 SQL 동일

### 6.3 NotificationEvent 매핑 — v0.3 동일 (sourceId에 credentialVersionId)

---

## 7. PII 처리

### 7.1 closed schema + operational hints (CS3-07)

- displayHints: 6 column closed schema (§ 3.2.1)
- operationalHints: entity별 non-PII column (§ 3.2.2)
- changedFields/snapshot: allowlisted field token + masked value/enum
- DB CHECK (길이·문자 클래스) + application validator (canonical) 양층

### 7.2 RRN deny — v0.3 동일 + recoverRrnFalsePositive audit cascade (CS3-11)

### 7.3 raw PII 실시간 조회 — v1.x (CS-14)

### 7.4 DPA vs patient consent

- DPA: `dpaEvidenceRef` 필수
- consent withdrawal: § 4.8 + CrmConsentWithdrawalLedger (CS3-05 — v1.0 최소 범위)
- patientConsentEvidenceRef record-level evidence: v1.x (CS-07)

### 7.5 displayHints expiry 처리 (CS3-07)

`piiRetentionExpiresAt` 도래 시:
- displayHints 6 column 즉시 nulling (delete 아님 — row 유지)
- operationalHints 보존
- ChangeLog tombstone insert

운영자 화면은 nulling 이후 "expired — CRM 콘솔 조회" 안내.

---

## 8. 운영 지표 + acceptance test traceability (CS3-15)

### 8.1 핵심 지표 — v0.3 동일

### 8.2 acceptance test traceability 표 (CS3-15)

§ 10 build/runtime/migration/invariant fail 룰과 1:1 매핑:

| AT ID | 영역 | 케이스 | 매핑 룰 |
|---|---|---|---|
| AT-01 | manifest | legalApproved=false | § 10.1 |
| AT-02 | manifest | korean-emr provider | § 10.1 |
| AT-03 | manifest | appointment enabled | § 10.1 |
| AT-04 | manifest | rawPiiStorageAllowed=true | § 10.1 |
| AT-05 | manifest | ssnRrnHandling≠"deny" | § 10.1 |
| AT-06 | manifest | dpaEvidenceRef 누락 | § 10.1 |
| AT-07 | manifest | outbound-only + 비정상 conflictResolution | § 10.1 |
| AT-08 | manifest | generic-rest-api + genericRestApiAdapter 누락 | § 10.1 |
| AT-09 | manifest | liveReadEnabled=true | § 10.1 |
| AT-10 | manifest | fieldMappingPolicyVersion 누락 | § 10.1 |
| AT-11 | webhook verifier | provider별 signature 검증 | § 10.2 |
| AT-12 | ledger dedupe | exactly-once → duplicate-eventid | § 4.2 step 4 |
| AT-13 | ledger dedupe | at-least-once + eventId → duplicate-eventid-bucket | § 4.2 step 4 |
| AT-14 | ledger dedupe | at-least-once no-eventId → duplicate-digest | § 4.2 step 4 |
| AT-15 | ledger dedupe | best-effort → duplicate-digest | § 4.2 step 4 |
| AT-16 | RRN deny | regex+checksum 통과 RRN | § 7.2 |
| AT-17 | RRN false positive | recoverRrnFalsePositive(override-and-fetch) | § 4.2.1 |
| AT-18 | RRN false positive | recoverRrnFalsePositive(abandon) | § 4.2.1 |
| AT-19 | RRN false positive | invalid status → runtime fail | § 10.2 |
| AT-20 | outbound-only | processInboundWebhook direct → runtime fail | § 10.2 |
| AT-21 | outbound-only | runSync direction=inbound → runtime fail | § 10.2 |
| AT-22 | outbound-only | webhook endpoint → 404 | § 10.2 |
| AT-23 | retry exhausted | maxAttempts 도달 | § 4.4 step 8 |
| AT-24 | retry permanent | permanent error class | § 4.4 step 9 |
| AT-25 | credential rotation | stable→rotating→committed | § 4.5 |
| AT-26 | credential rotation | stable→rotating→reverted | § 4.5 |
| AT-27 | credential rotation | committed→grace-expired (worker) | § 4.5 |
| AT-28 | credential rotation | grace-expired worker failure reconcile | § 10.4 |
| AT-29 | rotation 동시성 | rotating 중 outbound + inbound | § 4.5.3 |
| AT-30 | CAS | 동시 inbound + outbound → 1 ConflictRecord | § 4.3 |
| AT-31 | CAS field-level | manual resolve 후 재충돌 차단 | § 4.3.3 |
| AT-32 | webhook + polling 동시 | CrmChangeIdentityLedger 통과 | § 3.4.4·§ 4.2 step 10 |
| AT-33 | displayHints closed schema | 자유 JSON → DB CHECK reject | § 7.1 |
| AT-34 | displayHints closed schema | 정규식 위반 → application validator reject | § 7.1 |
| AT-35 | displayHints migration | v0.3 → v0.4 column 추가 backward-compatible | § 10.3 |
| AT-36 | outbox idempotency | credential rotation 후 새 credentialVersion 만료 | § 6.3 |
| AT-37 | consent withdrawal | applyConsentWithdrawal + displayHints nulling | § 4.8 |
| AT-38 | consent withdrawal | inbound 매칭 → rejected-consent-withdrawn | § 4.2 step 8 |
| AT-39 | consent withdrawal | outbound 매칭 → push 차단 | § 4.1 step 5 |
| AT-40 | unregister | displayHints nulling·queue cancel·ledger 보존 | § 4.7 |
| AT-41 | purge worker | retentionDays.changeLog | § 10.4 |
| AT-42 | purge worker | retentionDays.syncLog | § 10.4 |
| AT-43 | purge worker | retentionDays.conflictRecord | § 10.4 |
| AT-44 | purge worker | webhookNonceLedgerRetentionMinutes | § 10.4 |
| AT-45 | purge worker | piiRetentionExpiresAt → displayHints nulling | § 7.5 |
| AT-46 | purge worker | consentWithdrawalLedger legal hold skip | § 10.4 |
| AT-47 | audit cascade | 7종 AuditAction insert 성공 | § 3.1.1 |
| AT-48 | notification cascade | 4종 NotificationEventType emit | § 6.1 |
| AT-49 | DATA_MODEL cascade | genericRestApiAdapter 동기화 | § 2.3 |

---

## 9. 설치·설정 — DB 15 tables 마이그레이션 (§ 13)

---

## 10. 빌드·런타임·migration·invariant 검증

### 10.1 build-time fail

v0.3 § 10.1 + 추가:
- `provider="generic-rest-api"` + `genericRestApiAdapter` 4필드 중 누락
- `pii.liveReadEnabled=true`
- mode="outbound-only" + 어느 entity `conflictResolution ≠ "outbound-only-no-conflict"`
- mode="outbound-only" + CrmFieldMapping `direction IN (inbound, both)` 존재
- `fieldMappingPolicyVersion` 누락
- `retentionDays.consentWithdrawalLedger` 누락 (CS3-05)
- `purgeWorker.cadenceMinutes` 누락 (CS3-10)

### 10.2 runtime validation fail

v0.3 § 10.2 + 추가:
- **CAS WHERE 0 rows affected** (outbound·inbound 모두 양방향 version 검사 — CS3-04)
- **CrmChangeIdentityLedger UNIQUE 충돌** (webhook + polling 중복) → 정상 dedupe (fail 아님 — 정보 로그)
- **applyConsentWithdrawal** 시 매칭 record 0건 → 정보 알림 (fail 아님)
- **recoverRrnFalsePositive** invalid status (rejected-rrn-recoverable 아님) → runtime fail
- **CrmCredentialVersion invariant 위반** (CS3-01 § 4.5.2 표) — 예: rotating 중 active+rotating-target 외 row 존재 → runtime fail + 운영자 alert

### 10.3 migration-time validation

- v0.4 cascade 신규:
  - CrmRecord에 operationalHints* column 추가 (nullable)
  - CrmChangeIdentityLedger 신설 (§ 13.13)
  - CrmConsentWithdrawalLedger 신설 (§ 13.14)
  - displayHintsCityName CHECK 정규식 정리

### 10.4 runtime invariant·reconcile (CS3-10 강화)

- CrmSyncRetryQueue stale processing (lockedAt > 10분) → reconcile
- CrmConflictRecord open + slaDeadline 초과 → SLA 미달 알림
- credential expiry 임박 → expiring-soon
- credential 만료 → expired + integration 자동 비활성화
- PII drift 감지 (CHECK 미적용 historical row) → sink alert
- **CrmCredentialVersion grace-expired worker**: cadence 10분. graceUntil 도래 → state=revoked·integration.state="grace-expired". 실패 시 sink alert + 다음 cycle 재시도 (3회 실패 시 super-admin 수동 개입 필요)
- CrmWebhookNonceLedger `rejected-rrn-recoverable` 24h 무처리 → 운영자 alert
- **purge worker SoT** (CS3-10) — Feature 내부 책임:
  - cadence: `purgeWorker.cadenceMinutes` (기본 60분)
  - batch size: `purgeWorker.batchSize` (기본 500)
  - 대상 테이블·액션:
    | 테이블 | action | legal hold |
    |---|---|---|
    | CrmSyncLog | delete row | × |
    | CrmSyncSourceAttempt | delete row | × |
    | CrmSyncRetryQueue (status=completed) | delete row | × |
    | CrmRecordChangeLog | delete row | tombstone(=consent withdrawal) keep |
    | CrmConflictRecord (status≠open) | delete row | × |
    | CrmCredentialAuditLog | keep (7년 — REVIEW_WORKFLOW § 10.3 audit retention 따름) | hold |
    | CrmWebhookNonceLedger | delete row | × |
    | CrmChangeIdentityLedger | delete row (changeLog와 동일 retention) | × |
    | CrmConsentWithdrawalLedger | **delete row만 만료 시 — legal hold default true** (CS3-09·10) | hold |
    | CrmRecord.displayHints* | nulling (row 유지) | × |
    | CrmSyncNotificationOutbox (status=sent/permanent) | delete row | × |
  - failure reconcile: row delete 실패 → sink alert·다음 cycle 재시도

### 10.5 warning

v0.3 § 10.5 + 추가:
- `providerVersionToken=null`인 provider 운영 — CAS 정확도 저하 경고
- outbound-only + webhookSecret 설정됨 — config 정리 권고

---

## 11. 미결정 사항 (CS3-16)

### 11.1 open

| ID | 항목 | 비고 |
|---|---|---|
| CS-02 | 양방향 sync 충돌 SLA·escalation | 운영 |
| CS-03 | 다중 CRM 통합 우선순위 | 운영 |
| CS-04 | webhook endpoint 보안 (IP allowlist) | 인프라 |
| CS-05 | OAuth refresh token rotation 자동화 | 인프라 |
| CS-06 | provider별 quota 운영 가이드 | M2+ |
| CS-08 | LLM 기반 field auto-mapping | v1.x |
| CS-09 | CrmFieldMapping bulk import/export | M2+ |
| CS-10 | webhook 실패 시 polling fallback 자동 격상 | 운영 |
| CS-15 | CONTENT_STANDARDS submission/event cascade | v1.0은 § 3.2 canonical로 대체 |
| CS-18 | `@provenanceCrmRecordId` 공통 메타 | v1.x |
| CS-19 | CrmAdminRegionAllowlist 행정구역 lookup table | v1.x (CS3-08) |
| CS-20 | `crmConsoleBaseUrl` config + deep link | v1.x (CS3-07) |

### 11.2 deferred-v1.x

| ID | 항목 | v1.0 영향 |
|---|---|---|
| CS-07 | patientConsentEvidenceRef record-level evidence | v1.0은 § 4.8 + CrmConsentWithdrawalLedger 최소 범위 (CS3-05) |
| CS-11 | CRM → Core 자동 promote | 수동 |
| CS-12 | appointment entity | build fail로 차단 |
| CS-13 | korean-emr provider | build fail로 차단 |
| CS-14 | crm-live-read audit + liveReadCrmDetail | v1.0 미지원 |

### 11.3 resolved-in-v1.0

| ID | 해소 |
|---|---|
| ~~CS-01~~ | RRN deny — v0.2 + asset-ingestion checksum |
| ~~CS-14 v1.0 cascade~~ | liveRead v1.x로 내림 |

### 11.4 v0.4 잔여 리스크 (CS3-16 — 실측 기반)

| 영역 | 상태 | 비고 |
|---|---|---|
| CONTENT_STANDARDS cascade | open (CS-15) | § 3.2 canonical로 대체 |
| `@provenanceCrmRecordId` | open (CS-18) | crmExternalId·integrationId로 출처 추적 |
| provider별 quota 가이드 | open (CS-06) | rate limit config |
| 행정구역 allowlist table | open (CS-19) | application validator + future lookup |
| CRM 콘솔 deep link | open (CS-20) | v1.x |
| providerVersionToken=null provider lost update | known limitation | § 4.3.5 운영 경고 |

---

## 12. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 |
| 2026-05-14 | v0.2 | codex 1차 비평 21 지적 반영 |
| 2026-05-14 | v0.3 | codex 2차 비평 17 지적 반영 |
| 2026-05-14 | **v0.4** | **codex 3차 비평 17 지적 전건 수용 + REVIEW_WORKFLOW·DATA_MODEL cascade**: (1) **DB 인벤토리 15 tables로 정정** — CrmChangeIdentityLedger·CrmConsentWithdrawalLedger 신설 (CS3-06), (2) **CredentialVersion·Integration state invariant 표** + rotating-revoked 잔재 제거 (CS3-01), (3) **NonceLedger key deliveryKind별 partial unique** — exactly-once / at-least-once+eventId / at-least-once-no-eventId·best-effort 3분기 (CS3-02), (4) **InboundProcessingContext + providerVersionToken** + provider별 expectedCrmVersion 산정 표 (CS3-03), (5) **CAS WHERE outbound도 crm_version 포함** + CrmChangeIdentityLedger 신설 (webhook + polling idempotency) (CS3-04), (6) **CrmConsentWithdrawalLedger + applyConsentWithdrawal command** + `crm-consent-withdrawal-applied` AuditAction (CS3-05), (7) **non-PII operational hints** entity별 column (CS3-07), (8) **DB CHECK dialect 명시** (PostgreSQL canonical · `\p{L}` 회피 · 행정구역 allowlist application validator) (CS3-08), (9) **§ 4.7 unregister 정책 표** 12행 + FK ON DELETE 정책 (CS3-09), (10) **purge worker SoT § 10.4** — cadence·batch·legal hold·failure reconcile + 테이블별 액션 (CS3-10), (11) **REVIEW_WORKFLOW § 10.2.1 cascade — RRN 2종 + consent withdrawal 1종 AuditAction 추가** (CS3-11), (12) **retry queue worker SQL search-visibility § 13.5 풀 전개** — claim·SourceAttempt insert·envelope recalc·stale reclaim·exhausted·permanent 9단계 (CS3-12), (13) **DATA_MODEL C-08 v0.20 cascade — genericRestApiAdapter + CrmCredentialVersion 경계** (CS3-13), (14) **§ 1.1 변경 정책 — displayHints column·state enum·table 추가 SemVer 룰** 7행 추가 (CS3-14), (15) **§ 8.2 acceptance test 49 cases + § 10 traceability 표** (CS3-15), (16) **§ 11.4 잔여 리스크 실측 기반 정리** (CS3-16), (17) **`Ref<C-anything>`·rotating-revoked·중복 line·잘못된 테이블 수 문장 정정** (CS3-17) |

---

## 13. 본 Feature 내부 데이터 구조 (admin DB **15 tables** — CS3-06 정정)

### 13.1 `CrmIntegration` — v0.3 동일 + `mode` 명시

### 13.2 `CrmSyncLog` — v0.3 동일

### 13.3 `CrmSyncSourceAttempt` — v0.3 동일

### 13.4 `CrmSyncRetryQueue` — v0.3 동일

#### 13.4.1 worker SoT 풀 SQL (CS3-12 — search-visibility § 13.5 패턴 9단계)

```sql
-- 1. claim
WITH next AS (
  SELECT id FROM crm_sync_retry_queue
  WHERE status='pending' AND next_attempt_at <= now()
    AND (locked_at IS NULL OR locked_at < now() - interval '10 minutes')
  ORDER BY next_attempt_at
  FOR UPDATE SKIP LOCKED LIMIT 1
)
UPDATE crm_sync_retry_queue q
SET status='processing', locked_at=now(), locked_by=$worker, attempt_number=attempt_number+1
FROM next WHERE q.id=next.id RETURNING q.*;

-- 2. per-integration advisory lock (provider rate-limit 직렬화)
SELECT pg_advisory_xact_lock(hashtext('crm-sync:' || $integration_id));

-- 3. SourceAttempt insert (transaction 내)
INSERT INTO crm_sync_source_attempt (sync_log_id, integration_id, entity, direction, attempt_number, status, started_at, expires_at)
VALUES ($sync_log_id, $integration_id, $entity, $direction, $attempt_number, 'processing', now(), now() + $retention.sourceAttempt);
-- UNIQUE(syncLogId, integrationId, entity, direction, attemptNumber) — 중복 시 conflict → race detected

-- 4. provider call (외부, transaction 밖에서 호출 권장 — long-running)

-- 5. attempt finalization
UPDATE crm_sync_source_attempt
SET status=$status, completed_at=now(), error=$error, error_class=$error_class,
    records_inbound=$ri, records_outbound=$ro, conflicts_detected=$cd
WHERE sync_log_id=$sync_log_id AND integration_id=$integration_id AND entity=$entity AND direction=$direction AND attempt_number=$attempt_number;

-- 6. SyncLog.envelopeState 재계산
WITH agg AS (
  SELECT
    bool_and(status='success') AS all_success,
    bool_or(status IN ('failed-permanent','failed-credential','failed-quota')) AS any_failed,
    bool_or(status='in-retry-queue') AS any_retry
  FROM crm_sync_source_attempt WHERE sync_log_id=$sync_log_id
)
UPDATE crm_sync_log SET envelope_state=CASE
  WHEN (SELECT all_success FROM agg) THEN 'succeeded'
  WHEN (SELECT any_retry FROM agg) THEN 'retried'
  WHEN (SELECT any_failed FROM agg) THEN 'failed'
  ELSE 'partial'
END, completed_at=now()
WHERE id=$sync_log_id;

-- 7. retry queue 완료 또는 retry 등록
UPDATE crm_sync_retry_queue SET status=$result, locked_at=null, locked_by=null
WHERE id=$queue_id;
-- 또는 다음 attempt 등록 (재시도 backoff)

-- 8. stale reclaim (별도 worker — cadence 1분)
UPDATE crm_sync_retry_queue SET status='pending', locked_at=null, locked_by=null
WHERE status='processing' AND locked_at < now() - interval '10 minutes';

-- 9. exhausted/permanent 전이
UPDATE crm_sync_retry_queue SET status='exhausted'
WHERE id=$id AND attempt_number >= max_attempts;
UPDATE crm_sync_retry_queue SET status='failed-permanent'
WHERE id=$id AND last_error_class='permanent';
-- 둘 다 sink alert + outbox 'crm-sync-batch-failed' emit
```

advisory lock ordering: integration → record (충돌 회피 위해 outbound는 record-level이지만 retry queue는 integration-level).

### 13.5 `CrmRecord` (CS3-07 — operational hints 추가)

v0.3 § 13.5 column + 추가:

| 필드 | 타입 | required |
|---|---|:---:|
| (v0.3 column 모두) | | |
| **`operationalHintsEntityStatus`** | varchar(32) | optional |
| **`operationalHintsDepartmentHint`** | varchar(32) | optional |
| **`operationalHintsLocationKey`** | varchar(32) | optional |
| **`operationalHintsChannelType`** | varchar(32) | optional |
| **`operationalHintsInquiryType`** | varchar(32) | optional |
| **`operationalHintsDesiredVisitDate`** | Date | optional |
| **`operationalHintsGuardianInvolved`** | boolean | optional |
| **`operationalHintsRelationToInstitution`** | varchar(32) | optional |
| **`operationalHintsPreferredChannelType`** | varchar(32) | optional |
| **`consentWithdrawn`** | boolean | ✅ default false |

**Index 추가**: `(consentWithdrawn) WHERE consentWithdrawn=true` (partial).

### 13.6 `CrmRecordChangeLog` — v0.3 동일 + tombstone 케이스(consent withdrawal)는 changedFields에 `{tombstone: true}` 허용

### 13.7 `CrmFieldMapping` — v0.3 동일

### 13.8 `CrmConflictRecord` — v0.3 동일

### 13.9 `CrmCredentialAuditLog` — v0.3 동일

### 13.10 `CrmRateLimitState` — v0.3 동일

### 13.11 `CrmCredentialVersion` — v0.3 동일

### 13.12 `CrmWebhookNonceLedger` (CS3-02 — deliveryKind별 partial unique 재설계)

v0.3 schema + Constraints 재정의:

**Constraints**:
- `UNIQUE(integrationId, providerEventId) WHERE providerEventId IS NOT NULL AND deliveryKind='exactly-once'`
- `UNIQUE(integrationId, providerEventId, receivedBucket) WHERE providerEventId IS NOT NULL AND deliveryKind='at-least-once'`
- `UNIQUE(integrationId, canonicalDigest, receivedBucket) WHERE providerEventId IS NULL OR deliveryKind='best-effort'`

### 13.13 `CrmChangeIdentityLedger` (CS3-04 신규)

webhook + polling 동일 변경 idempotency 보장.

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `integrationId` | UUID | ✅ — FK |
| `entity` | enum | ✅ |
| `crmExternalId` | string | ✅ |
| `providerVersionToken` | string | optional (null인 provider는 본 ledger 미사용) |
| `changeIdentityKey` | char(64) | ✅ — § 3.4.4 HMAC |
| `source` | enum (`webhook`·`polling`) | ✅ |
| `receivedAt` | Date | ✅ |
| `processedSyncLogId` | UUID | optional |
| `expiresAt` | Date | ✅ — retentionDays.changeLog 동일 |

**Constraints**: `UNIQUE(changeIdentityKey)`. `FK integrationId`.
**Index**: `(integrationId, entity, crmExternalId, receivedAt DESC)`, `(expiresAt)`.

`providerVersionToken=null`인 provider는 본 ledger insert skip → webhook/polling 중복 처리 가능 (운영 경고 § 10.5).

### 13.14 `CrmConsentWithdrawalLedger` (CS3-05 신규)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `integrationId` | UUID | ✅ — FK |
| `piiHash` | char(64) | optional (matching key 둘 중 하나 ✅) |
| `crmExternalIdHash` | char(64) | optional (matching key 둘 중 하나 ✅) |
| `scope` | enum (`all`·`marketing-only`) | ✅ |
| `appliedBy` | string | ✅ — super-admin |
| `appliedAt` | Date | ✅ |
| `displayHintsNulled` | boolean | ✅ |
| `tombstoneChangeLogId` | UUID | optional |
| `legalHold` | boolean | ✅ default true (CS3-09 — unregister 시 보존) |
| `expiresAt` | Date | optional — legalHold=true 시 null |

**Constraints**: `FK integrationId`. 응용 단위 unique: `(integrationId, piiHash | crmExternalIdHash, scope)` 중복 시 정보 알림.
**Index**: `(integrationId, piiHash) WHERE piiHash IS NOT NULL`, `(integrationId, crmExternalIdHash) WHERE crmExternalIdHash IS NOT NULL`, `(expiresAt) WHERE legalHold=false`.

### 13.15 `CrmSyncNotificationOutbox` — v0.3 § 13.13 동일

---

**총 15개 admin DB 테이블** — 각 절 = 1 테이블:

| § | 테이블 | retention 정책 |
|---|---|---|
| 13.1 | `CrmIntegration` | active=false soft delete + legal hold |
| 13.2 | `CrmSyncLog` | retentionDays.syncLog |
| 13.3 | `CrmSyncSourceAttempt` | retentionDays.sourceAttempt |
| 13.4 | `CrmSyncRetryQueue` | retentionDays.retryQueueCompleted |
| 13.5 | `CrmRecord` | displayHintsRetentionDays (nulling) |
| 13.6 | `CrmRecordChangeLog` | retentionDays.changeLog (tombstone 예외) |
| 13.7 | `CrmFieldMapping` | active=false soft delete |
| 13.8 | `CrmConflictRecord` | retentionDays.conflictRecord (non-open만) |
| 13.9 | `CrmCredentialAuditLog` | audit retention 7년 (REVIEW_WORKFLOW § 10.3) |
| 13.10 | `CrmRateLimitState` | 운영 데이터 (즉시 갱신) |
| 13.11 | `CrmCredentialVersion` | state=revoked 후 audit retention |
| 13.12 | `CrmWebhookNonceLedger` | webhookNonceLedgerRetentionMinutes |
| 13.13 | `CrmChangeIdentityLedger` | retentionDays.changeLog 동일 |
| 13.14 | `CrmConsentWithdrawalLedger` | legal hold default — retentionDays.consentWithdrawalLedger (legalHold=false 시) |
| 13.15 | `CrmSyncNotificationOutbox` | retentionDays.notificationOutbox |


 succeeded in 706ms:
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
  | "crm-sync-credential-expiring-soon";      // 만료 14일 전
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
  | "crm-consent-withdrawal-applied";         // 환자 동의 철회 적용 (displayHints nulling + sync skip) — CS3-05
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


 succeeded in 740ms:
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
session id: 019e25e2-3990-76c3-ad5d-bc6c894f73ce
--------
user
# 자동 비평 의뢰 — `docs/features/crm-sync.md` v0.3 (3차 사이클)

## 컨텍스트

2차 비평(17 지적: blocking 7 + major 8 + minor 2) 전건 수용. v0.3 핵심 변경:
- DB 인벤토리 12 tables 정정 + 모든 테이블 풀 schema (FK·UNIQUE·INDEX·partial unique·CHECK·expiresAt)
- liveReadCrmDetail을 v1.x로 내림 — v1.0 raw PII 실시간 조회 미제공
- ProviderWebhookVerifier 결과 타입 고정 (VerifierResult shape + deliveryKind·retrySemantics)
- provider별 adapter contract 표 (Salesforce SOAP/Platform Events·HubSpot v3·generic-rest-api)
- nonce ledger key 정책 deliveryKind 분기 + retention SoT 단일화 (webhookNonceLedgerRetentionMinutes)
- displayHints **6 column closed schema** + DB CHECK + application validator
- outbound-only mode matrix 별도 + CrmFieldMapping direction inbound build fail
- CrmRecord CAS WHERE 조건 + ConflictRecord field-level (fieldPath·baseVersion·appliedFieldVersion)
- manual escalate 결정표
- CrmCredentialVersion entity 신설 + 5상태 머신 + outbound/inbound 사용 matrix
- RRN false positive 복구 command (recoverRrnFalsePositive) + ledger recoverable/final
- outbox sourceId에 credentialVersionId 포함 (lifecycle 반복 안전)
- retry queue worker SQL search-visibility § 13.5 복제
- credential fingerprint HMAC-SHA256(auditPepper, integrationId:secretVersionId)
- v1.0 운영 이벤트 canonical schema 본 문서 § 3.2 정의 (CONTENT_STANDARDS cascade 회피)
- acceptance test 27 cases
- § 11.4 잔여 리스크 분리

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\crm-sync.md` v0.3을 이전과 동일한 강도로 엄정하게 비평하라:

1. **2차 지적 재발 여부**: 17개 지적이 실제로 정정됐는가? 표면만 바뀌고 본질이 남아있지 않은가?

2. **v0.3 신규 메커니즘의 모순**:
   - CrmCredentialVersion state(active·rotating-target·committed·grace-expired·reverted·revoked) 6개 vs § 4.5 상태 머신 5상태(stable·rotating·committed·grace-expired·reverted) — CrmIntegration.credentialState와 CrmCredentialVersion.state의 다른 enum 사용이 일관적인가
   - ProviderWebhookVerifier가 verifier 단계에서 providerEventId/Timestamp를 반환하지만 CrmFieldMapping의 inbound 처리 시점에는 verifier 결과가 어떻게 전달되는가
   - displayHints 6 column 분리 후 향후 column 추가가 MAJOR vs MINOR인지 § 1.1에 명확한 룰이 있는가
   - CAS WHERE 조건은 inbound CRM과 outbound solution 양방향에서 어떻게 race를 보장하는가 — 더 정밀하게는 CRM webhook과 polling이 동시에 발생할 때 nonce ledger와 CAS가 어떻게 협력하는가
   - § 13.13이 § 13.12 다음 절인데 인벤토리는 12 tables(§ 13.1-§ 13.13에서 § 13.10이 1개 테이블만)이고 마지막 문장은 "12개 admin DB 테이블"이라 함 — 실제 테이블 수와 절 번호 매핑이 정합한가
   - acceptance test 27개에서 ledger dedupe `duplicate-digest` 적용은 best-effort/at-least-once 케이스 둘 다 가능한데 케이스 분리가 됐는가

3. **PII closed schema 운영성**:
   - 6 column이 한국 의료기관 실제 운영자 화면에 충분한 정보를 제공하는가
   - ageBand·genderHint enum이 의료기관 표시 요구(예: 보호자 정보·진료과 hint 등)에 부족하지 않은가
   - 운영자가 raw PII 필요 시 "CRM 콘솔 직접 접근"이 v1.0 실제 운영 가능한 경로인가 — 권한 매핑·SSO 어떻게 되는가
   - displayHints의 piiRetentionExpiresAt 30일이 도래해도 CRM 자체는 raw PII 보유. solution 측 displayHints만 nulling vs delete로 처리해야 하는가

4. **legal·DPA·동의 차단 충분성**:
   - DPA만으로 record-level 처리가 v1.0에서 legally sound한가
   - patientConsentEvidenceRef·right to erasure가 v1.x인데, v1.0 운영 중 환자 동의 철회 요청 발생 시 어떻게 대응하는가
   - integration unregister 시 기존 CrmRecord·displayHints는 어떻게 처리되는가 (purge/orphan)

5. **운영 SLA·worker·purge**:
   - 27개 acceptance test로 v1.0 회귀가 충분한가
   - purge worker가 12개 테이블 중 어디 책임이고 어떤 cadence로 실행되는가 — 본 Feature 내부인가 공통 인프라인가
   - § 4.5.2 grace-expired worker 동작 cadence·실패 시 reconcile 명시됐는가

6. **이전 Feature와 패턴 정합성 / cascade 무결성**:
   - search-visibility § 13.5 SQL 복제는 정합한가 — 실제 SQL이 본 문서에 있으니 cross-check
   - DATA_MODEL C-08 v0.19가 CrmIntegrationEntry 3종 provider로 정의됐는데 본 문서 v0.3과 동기화됐는가
   - REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 cascade 4종이 본 문서 표와 정합한가
   - CredentialVersion entity 추가가 DATA_MODEL이나 다른 Feature cascade 영향 없는가

7. **문서 정합성**:
   - § 0 한 페이지 요약 ↔ § 13 인벤토리 12 tables 일관성
   - § 1.1 변경 정책 표가 v0.3 신규 도입(CredentialVersion·closed schema 등)을 모두 다루는가
   - § 11 미결정 사항 분류와 § 11.4 잔여 리스크의 경계가 명확한가
   - § 13.5 CrmRecord의 `displayHintsCityName` CHECK가 "시·도·구·군 명만"이라 추상적 — DB CHECK로 구현 가능한가
   - acceptance test fixture와 § 10 build/runtime/migration fail이 대응되는가

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `CS3-`.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\crm-sync.md` (대상 v0.3)
- `C:\Users\assag\solution\website-exposure\.codex-reviews\cs_cycle2_response.md` (2차 지적)
- `C:\Users\assag\solution\website-exposure\docs\features\asset-ingestion.md`
- `C:\Users\assag\solution\website-exposure\docs\features\search-visibility.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md`
codex
seo-geo 스킬 범위와 직접 겹치지는 않아서 일반 문서 리뷰로 진행합니다. 먼저 대상 문서와 2차 응답, 관련 SoT를 병렬로 읽어 재발 여부와 cross-feature 불일치를 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw -LiteralPath 'docs/features/crm-sync.md'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw -LiteralPath 'docs/core/DATA_MODEL.md'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw -LiteralPath 'docs/features/search-visibility.md'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw -LiteralPath '.codex-reviews/cs_cycle2_response.md'" in C:\Users\assag\solution\website-exposure
 succeeded in 644ms:
# Feature — crm-sync

> **상태**: Draft v0.3 (codex 자동 비평 2차 반영 — 17개 지적 전건 수용)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 11.1
> **목적**: 클라이언트 의료기관 CRM과 솔루션 사이의 양방향 데이터 동기화. solution DB는 **raw PII 저장 금지** (closed-schema displayHints만). webhook(실시간) + polling(배치).
> **연관 문서**:
> - 알림·audit → notifications + REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (cascade 완료 — 4종 NotificationEventType·4종 AuditAction)
> - 자격증명·식별자·policyVersion → DATA_MODEL C-08 v0.19 `crmSyncConfig`·`crmSyncPolicyVersion`
> - RRN checksum 알고리즘 재사용 → `features/asset-ingestion.md` § 9.1
> - retry queue·outbox SQL 재사용 → `features/search-visibility.md` § 13.5·§ 13.10

---

## 0. 한 페이지 요약

- **Feature 식별자**: `crm-sync`
- **핵심 책임**: (a) 외부 CRM 양방향 sync(예약 신청·문의·전환 이벤트·고객 컨택트), (b) field-level mapping + CAS 충돌 해결, (c) webhook(실시간) + polling(배치), (d) **solution DB raw PII 저장 금지** (closed-schema displayHints만), (e) DPA·credential rotation·만료 알림
- **vs ReservationPage(C-20)** (CS1-02): C-20은 **예약 안내 콘텐츠 페이지**. 본 Feature는 **ReservationSubmission·Inquiry·ConversionEvent·Contact 운영 이벤트** sync
- **provider 3종 (v1.0)**: `salesforce`·`hubspot`·`generic-rest-api`. `korean-emr` v1.x deferred (CS-13)
- **운영 모드 2종**: `bi-directional`·`outbound-only`
- **sync entity 4종 (v1.0)**: `reservation`·`contact`·`inquiry`·`conversion-event`. `appointment` v1.x deferred (CS-12)
- **PII 정책 (CS2-02·05·07 강화)**: solution DB raw PII 저장 금지. `liveReadCrmDetail` v1.x deferred (CS-14). v1.0 운영자 화면은 **displayHints만**
- **RRN deny**: v1.0 강제 (CS-01 resolved). asset-ingestion § 9.1 checksum 재사용. false positive 복구 경로 §4.2.1 명시
- **DB 인벤토리 (CS2-01 정정)**: **12 tables** (§13 풀 전개)

---

## 1. 일반 규약

### 1.1 변경 정책

| 변경 유형 | 패키지 SemVer | policyVersion | 동반 cascade |
|---|---|---|---|
| 입력/출력 인터페이스 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9·§ 10 |
| provider type 추가 | MINOR | 별개 | DATA_MODEL C-08·adapter contract·webhook verifier·build validation |
| provider type 제거 | **MAJOR** | 별개 | |
| sync entity 추가 | MINOR | 별개 | CrmFieldMapping·v1.0 canonical schema 본 문서 § 3.2 |
| sync entity 제거 | **MAJOR** | 별개 | |
| field mapping schema 변경 | **MAJOR** | policyVersion 신규 | |
| 충돌 해결 알고리즘 변경 | **MAJOR** | policyVersion 신규 | |
| 알림 매트릭스 변경 | **MAJOR** | policyVersion 신규 | |
| 운영 모드 추가 | **MAJOR** | 별개 | |
| build/runtime/migration fail 룰 추가·강화 | **MAJOR** | 별개 | |
| runtime invariant·reconcile 룰 추가·강화 | MINOR | 별개 | |
| warning → fail 승격 | **MAJOR** | 별개 | |
| warning·지표·acceptance test 추가 | PATCH | 별개 | |

### 1.2 SoT 원칙

- 알림 발송·audit canonical SoT → notifications + REVIEW_WORKFLOW § 9.1.1·§ 10.2.1
- 자격증명·DPA·policyVersion SoT → DATA_MODEL C-08 v0.19
- RRN checksum SoT → `features/asset-ingestion.md` § 9.1
- retry queue·outbox worker SQL SoT → `features/search-visibility.md` § 13.5·§ 13.10 (본 문서 § 13.4·§ 13.12에서 복제 적용)
- 본 문서 = sync 파이프라인·field mapping·CAS 충돌 해결·PII closed schema·credential rotation 상태 머신·v1.0 entity canonical schema SoT

### 1.2.1 공통 retry taxonomy

| 큐 | maxAttempts | backoff |
|---|---|---|
| CrmSyncRetryQueue | config(기본 5)·configurable | [60, 300, 1800, 7200, 21600]s |
| CrmSyncNotificationOutbox | 상수 5 | search-visibility § 13.10 동일 |

### 1.3 본 문서가 다루지 않는 영역

- 알림 채널·재시도 → notifications
- 외부 CRM 운영·계약 → 클라이언트·CRM provider
- Core 콘텐츠 변환 → asset-ingestion. CRM→Core auto promote는 v1.x (CS-11 deferred)
- 의료 진료 기록 보관 → CRM·EMR (RRN 솔루션 통과 금지)
- **raw PII 실시간 조회** → v1.0 미지원. v1.x liveReadCrmDetail (CS-14)

---

## 2. Feature 정의

### 2.1 기본 메타

```yaml
name: "crm-sync"
specVersion: "0.3"
coreRequiresMin: "1.0.0"
implementationKind: "node-module"
activation: { scope: "instance", default: false }
```

### 2.2 의존성

| 영역 | 의존 |
|---|---|
| notifications | notify() 필수 |
| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 4종 NotificationEventType cascade 완료 |
| REVIEW_WORKFLOW § 10.2.1 | 4종 AuditAction cascade 완료 |
| DATA_MODEL C-08 v0.19 | `crmSyncConfig`·`crmSyncPolicyVersion` |
| DATA_MODEL CT-03·C-20 | 참조만 (콘텐츠 페이지·CTA) |
| asset-ingestion § 9.1 | RRN checksum 재사용 |
| search-visibility § 13.5·§ 13.10 | retry queue·outbox worker SQL 패턴 복제 |

### 2.3 InstanceManifest 통합

```yaml
crmSyncConfig:                                          # DATA_MODEL C-08 v0.19
  integrations:
    - id: "main-crm"
      provider: "salesforce"                            # v1.0: salesforce·hubspot·generic-rest-api만
      apiKeySecretRef: "secretRef://CRM_SALESFORCE_OAUTH"
      apiUrl: "https://example.my.salesforce.com"
      webhookSecret: "secretRef://CRM_SALESFORCE_WEBHOOK_SECRET"
      credentialExpiresAt: "2027-01-01T00:00:00Z"
      legalApproved: true
      legalApprovedBy: "legal@glitzy.kr"
      legalApprovedAt: "2026-05-10T00:00:00Z"
      dpaEvidenceRef: "secretRef://CRM_DPA_CONTRACT_REF"
      genericRestApiAdapter:                            # CS2-03 — generic-rest-api 어댑터 config
        webhookSignatureHeader: "X-Webhook-Signature"
        webhookTimestampHeader: "X-Webhook-Timestamp"
        webhookEventIdHeader: "X-Webhook-Event-Id"
        canonicalStringFormat: "timestamp.method.path.bodySha256"

crmSyncPolicyVersion: "cs-2026-05-14"

features:
  - name: "crm-sync"
    version: "0.3.0"
    enabled: true
    requiresFeature: [notifications]
    config:
      mode: "bi-directional"                            # bi-directional | outbound-only
      syncSchedule:
        pollIntervalMinutes: 15
        timezonePolicy: { missedRunCarryOverMaxDays: 7, dstNonexistentLocalTime: "next-valid", dstAmbiguousLocalTime: "first" }
      entities:
        reservation: { enabled: true, conflictResolution: "last-write-wins-by-timestamp" }
        contact: { enabled: true, conflictResolution: "crm-authoritative" }
        inquiry: { enabled: true, conflictResolution: "solution-authoritative" }
        conversionEvent: { enabled: true, conflictResolution: "outbound-only-no-conflict" }
        # appointment v1.x — enabled=true 시 build fail
      fieldMappingPolicyVersion: "cs-fm-2026-05-14"
      webhookEndpoint:
        path: "/api/crm-sync/webhook/{integrationId}"
        timestampToleranceSeconds: 300                  # 5분
      retryQueue:
        maxAttempts: 5
        backoffSeconds: [60, 300, 1800, 7200, 21600]
        workerPollIntervalSeconds: 30
      credentialRotation:
        warnDaysBeforeExpiry: 14
        autoNotifyEnabled: true
        rotationGracePeriodMinutes: 30                  # CS2-09 — old credential 병행 허용 시간
      rateLimit:
        bucketBackend: "redis-token-bucket"
        salesforce: { tokensPerHour: 1000, burst: 200 }
        hubspot: { tokensPer10sec: 100, burst: 20 }
        genericRestApi: { tokensPerHour: 500, burst: 100 }
        retryAfterRespected: true
      pii:                                               # CS2-05 강화
        rawPiiStorageAllowed: false                     # v1.0 강제 false
        displayHintsRetentionDays: 30
        ssnRrnHandling: "deny"                          # v1.0 강제 deny
        liveReadEnabled: false                          # CS2-02·07 — v1.0 강제 false (v1.x: CS-14)
      retentionDays:
        syncLog: 730
        sourceAttempt: 730
        changeLog: 1095
        conflictRecord: 1095
        retryQueueCompleted: 30
        notificationOutbox: 30                          # CS2-13
      webhookNonceLedgerRetentionMinutes: 360           # CS2-04 — SoT 통일
      externalMonitoringSink: { provider: "sentry", dsnSecretRef: "secretRef://MONITORING_DSN" }
```

---

## 3. 입력·출력

### 3.1 엔트리포인트 + read API + 운영 command + mode matrix (CS2-06 강화)

| 종류 | 함수 | 책임 | 권한 | bi-directional | outbound-only |
|---|---|---|---|---|---|
| 실행 | `runSync(input)` | sync cycle | operator·super-admin | 허용 | direction="outbound"만. inbound/both → **runtime fail** |
| 실행 | `processInboundWebhook` | webhook 수신 | system (HTTP endpoint) | 허용 | endpoint **미등록** (HTTP 404). direct invocation → **runtime fail** |
| 실행 | `pushOutbound(entity, recordId, operation)` | 즉시 push | operator·super-admin·system | 허용 | 허용 |
| 실행 | `resolveConflict` | 충돌 해결 | operator·super-admin | 허용 | 호출 불가 (모든 entity outbound-only-no-conflict) |
| 실행 | `recoverRrnFalsePositive(ledgerId, action)` | RRN false positive 복구 | super-admin | 허용 | 허용 |
| read | `queryCrmRecords` | **displayHints만 반환** | operator·super-admin·legal-reviewer | 허용 | 허용 |
| read | `queryConflicts` | 충돌 큐 | operator·super-admin | 허용 | 빈 결과 |
| 운영 | `registerIntegration` | | super-admin | 허용 | 허용 |
| 운영 | `unregisterIntegration` | soft delete | super-admin | 허용 | 허용 |
| 운영 | `rotateCredential` | rotation 상태 머신 § 4.5 | super-admin | 허용 | 허용 |

**v1.0 미제공 (CS2-02·07 해결)**:
- `liveReadCrmDetail` — v1.x deferred (CS-14). v1.0 raw PII 실시간 조회 불가
- 운영자는 raw detail 필요 시 CRM 콘솔에서 직접 조회

### 3.1.1 audit log contract

| AuditAction | contentRef | metadata | 권한 |
|---|---|---|---|
| `crm-integration-registered` | `"crm-integration:" + integrationId` | provider·apiUrl·legalApprovedBy·dpaEvidenceRefHash | super-admin |
| `crm-integration-unregistered` | `"crm-integration:" + integrationId` | activeBefore·activeAfter·unregisteredBy | super-admin |
| `crm-sync-conflict-resolved` | `"crm-conflict:" + conflictId` | resolution·winningSide·resolvedBy·entityType·fieldPath·appliedFieldVersion | operator·super-admin |
| `crm-credential-rotated` | `"crm-integration:" + integrationId` | rotatedBy·priorCredentialFingerprint·newCredentialFingerprint·rotationAttemptId | super-admin |

**credential fingerprint (CS2-14 정정)**: `HMAC-SHA256(auditPepperSecretRef, integrationId + ":" + secretVersionId)` 8자(16 hex) prefix. secret manager immutable version id 포함 — 실제 rotation 식별 가능.

### 3.2 v1.0 운영 이벤트 canonical schema (CS2-15 — 본 문서 내 정의)

CONTENT_STANDARDS submission/event 인터페이스 cascade는 CS-15로 deferred. v1.0 운영을 위해 **본 Feature가 canonical schema를 직접 정의**:

```ts
type ReservationSubmission = {
  submissionId: string;
  reservationPageRef: Ref<C-20>;
  ctaConfigRef?: Ref<CT-03>;
  source?: string; campaign?: string;
  submittedAt: Date;
  status: "pending" | "synced-to-crm" | "synced-failed";
  piiHash: string;                       // SHA-256. solution DB에 raw 미저장
  displayHints: ContactDisplayHints;
  crmExternalId?: string;
};

type Inquiry = {
  inquiryId: string; source?: string;
  inquiryType: "general" | "appointment-related" | "billing" | "other";
  submittedAt: Date;
  status: "pending" | "synced-to-crm" | "responded-on-crm";
  piiHash: string; displayHints: ContactDisplayHints;
  crmExternalId?: string;
};

type ConversionEvent = {                 // outbound-only entity. PII 없음
  conversionEventId: string;
  eventType: "form-submit" | "phone-click" | "page-view-threshold" | "cta-click";
  occurredAt: Date;
  pageRef?: Ref<C-anything>;
  attributionSource?: string;
};

type Contact = {
  contactId: string;
  crmExternalId: string;
  displayHints: ContactDisplayHints;
  lastSyncedAt: Date;
};
```

#### 3.2.1 ContactDisplayHints — **closed schema** (CS2-05)

raw PII 저장 금지의 핵심 invariant. **JSON 자유 필드 금지. allowlisted 6개 필드만 column으로 분리**:

| 필드 | 타입 | DB CHECK / application validator |
|---|---|---|
| `nameInitial` | varchar(8) | 정규식 `^[\p{L}](O\*?)?$` (한·영 1자 + "O*") |
| `phoneLast4` | char(4) | `^\d{4}$` |
| `emailDomain` | varchar(64) | `^@[a-z0-9.-]+$` |
| `cityName` | varchar(32) | 시·도·구·군 명만 |
| `genderHint` | enum(`male`,`female`,`other`,`unknown`) | enum |
| `ageBand` | enum(`teen`,`20s`,`30s`,`40s`,`50s`,`60+`,`unknown`) | enum |

**금지**: 위 외 임의 필드, 임의 길이 문자열, 자유 JSON, raw 이름·전화번호·이메일·주소·RRN·birthDate. 위반 시 DB CHECK + application validator 양층으로 **insert reject**.

### 3.3 RunSyncInput·Result

```ts
type RunSyncInput = {
  instanceId: string;
  manifestVersion: string;
  direction: "inbound" | "outbound" | "both";  // outbound-only mode는 "outbound" 강제
  mode: "scheduled" | "on-demand";
  idempotencyKey: string;
  windowStart?: Date; windowEnd?: Date;
  forceRefresh?: boolean; refreshIntentId?: string;
};

type RunSyncResult = {
  syncLogId: string;
  envelopeState: "succeeded" | "partial" | "failed" | "retried";
  perEntity: Array<{ entity: SyncEntity; direction: string; result: SourceAttemptStatus; counts: Record<string, number> }>;
};
```

### 3.4 webhook 처리 (CS2-03·04 강화)

```ts
async function processInboundWebhook(
  integrationId: string,
  headers: Record<string,string>,
  rawBody: Buffer,
  fullUrl: string,
  method: string
): Promise<{
  status: "accepted" | "rejected-signature" | "rejected-replay" | "rejected-stale-timestamp"
        | "rejected-credential-expired" | "rejected-rrn-detected" | "rejected-mode-disallowed"
        | "queued" | "deduped";
  recordsProcessed: number;
  conflicts: number;
  ledgerStatus?: "new" | "duplicate-eventid" | "duplicate-digest" | "rejected-final";
}>;
```

#### 3.4.1 ProviderWebhookVerifier 결과 타입 (CS2-03 — 고정 shape)

```ts
interface ProviderWebhookVerifier {
  verify(input: { rawBody: Buffer; headers: Record<string,string>; fullUrl: string; method: string }): VerifierResult;
}

type VerifierResult = {
  signatureValid: boolean;
  providerEventId: string | null;
  providerTimestamp: Date | null;
  canonicalDigest: string;                  // SHA-256
  deliveryKind: "at-least-once" | "exactly-once" | "best-effort";
  retrySemantics: "provider-retries" | "no-retry";
  errorReason?: "signature-mismatch" | "missing-headers" | "malformed-payload";
};
```

#### 3.4.2 provider별 adapter contract (CS2-03)

| Provider | payload | signature | timestamp header | eventId | canonical string |
|---|---|---|---|---|---|
| Salesforce (Outbound Messages) | XML SOAP | HMAC-SHA256(webhookSecret, rawBody) | `Sforce-Send-Time` | XML `Id` | `timestamp + "." + bodySha256` |
| Salesforce (Platform Events) | JSON (CometD) | HMAC-SHA256 (organizationId 기반) | `OrganizationId+ReplayId` | `replayId` | 동일 |
| HubSpot | JSON | HMAC-SHA256(webhookSecret, `httpMethod + url + bodyString + timestamp`) | `X-HubSpot-Request-Timestamp` | header 또는 body `eventId` | provider 정의 |
| generic-rest-api | JSON | HMAC-SHA256(webhookSecret, canonicalString) | config `webhookTimestampHeader` | config `webhookEventIdHeader` | config `canonicalStringFormat` |

`deliveryKind=exactly-once`이면 providerEventId 강제 unique. 누락 시 `errorReason=missing-headers`로 거부.

---

## 4. sync 파이프라인

### 4.1 outbound (솔루션 → CRM)

```
1. pushOutbound(entity, recordId, operation)
2. solution record load → CrmFieldMapping(direction includes "outbound")로 변환
3. PII Redaction Validator 통과 (raw PII는 CRM API 호출 시점에만 transient. solution DB 캐싱 금지)
4. RRN 검사 — 검출 시 push 차단 + 운영자 alert + ledger 기록 (recoverable=false)
5. credential state ≠ "rotating-revoked" 확인 → outbound는 new 우선·old fallback (§ 4.5)
6. rate limit token 획득 — 부족 시 retry queue 등록
7. CRM API call (idempotency-key 헤더 포함). crmExternalId 갱신
8. solution CrmRecord 갱신 — **CAS WHERE** (CS2-08): `WHERE id=? AND solution_version=?`
   → 0 rows affected → race detected → CrmConflictRecord 생성
9. CrmRecordChangeLog insert (closed-schema changedFields)
```

### 4.2 inbound (CRM → 솔루션)

```
1. CRM webhook → endpoint POST → processInboundWebhook
2. mode="outbound-only"이면 endpoint 미등록 (HTTP 404)
3. ProviderWebhookVerifier.verify(...) → VerifierResult
   - signatureValid=false → HTTP 401 rejected-signature. ledger 미기록
4. providerTimestamp 검증 — 있으면 `now ± timestampToleranceSeconds` 검사 → rejected-stale-timestamp
5. **CrmWebhookNonceLedger insert** (CS2-04):
   - deliveryKind별 key:
     - `exactly-once`: key=`(integrationId, providerEventId)`. 중복 → `duplicate-eventid` → HTTP 200 deduped
     - `at-least-once`: key=`(integrationId, providerEventId OR canonicalDigest, receivedBucket)`. receivedBucket=`floor(epoch/60)`
     - `best-effort`: key=`(integrationId, canonicalDigest, receivedBucket)`
   - status enum: `accepted-pending` | `accepted-processed` | `rejected-rrn-recoverable` | `rejected-rrn-final` | `rejected-parse-recoverable`
6. **RRN 검사** (asset-ingestion § 9.1 checksum 재사용)
   - 검출 시 payload 폐기. ledger `rejected-rrn-recoverable` (복구 가능) 또는 `rejected-rrn-final` (확정 final)
   - rrnFingerprint = HMAC-SHA256(rrnAuditPepper, rrnNormalized) 16 hex
7. payload 파싱 + CrmFieldMapping(direction includes "inbound") 역변환
8. **closed-schema PII Redaction Validator** — 위반 시 ledger `rejected-parse-recoverable` 후 reject
9. CrmRecord field-level CAS 갱신 (§ 4.3)
10. ledger `accepted-processed` 갱신 → HTTP 200 accepted
```

#### 4.2.1 RRN false positive 복구 (CS2-10)

```
recoverRrnFalsePositive(ledgerId, action: "override-and-fetch" | "abandon"):
1. ledger row 조회 — status="rejected-rrn-recoverable"만 허용. 다른 상태 → runtime fail
2. action="override-and-fetch":
   - CRM live pull (providerEventId 또는 last-known crmExternalId 기반)
   - RRN 검사 재실행 → 통과 시 정상 inbound 처리. ledger → "accepted-processed"
   - 재차 RRN 검출 시 ledger → "rejected-rrn-final"
3. action="abandon": ledger → "rejected-rrn-final". 동일 providerEventId 재처리 거부
4. 모든 경로 audit log 기록 (super-admin 필수)
```

### 4.3 field-level 충돌 해결 + CAS (CS2-08)

#### 4.3.1 FieldAuthority

```ts
type FieldAuthority =
  | "crm-authoritative"
  | "solution-authoritative"
  | "last-write-wins-timestamp"
  | "last-write-wins-version";
```

#### 4.3.2 CrmRecord 갱신 — **CAS WHERE 조건**

```sql
-- inbound: CRM 갱신
UPDATE crm_record
SET display_hints_name_initial=$1, display_hints_phone_last4=$2, /* ... */
    crm_version=$newCrmVersion, last_synced_at=$now
WHERE id=$recordId
  AND crm_version=$expectedCrmVersion
  AND solution_version=$expectedSolutionVersion;
-- 0 rows affected → race → CrmConflictRecord 생성

-- outbound: solution 갱신
UPDATE crm_record
SET solution_version=solution_version+1, last_synced_at=$now, crm_external_id=$crmId
WHERE id=$recordId AND solution_version=$expectedSolutionVersion;
```

field-level 복잡 경로는 `SELECT FOR UPDATE` + per-field ConflictRecord.

#### 4.3.3 ConflictRecord field-level

| 필드 | 의미 |
|---|---|
| `fieldPath` | "displayHints.phoneLast4" 등 |
| `baseVersion` | 충돌 직전 record-level 버전 |
| `winningVersion` | resolve 시 적용된 버전 |
| `appliedFieldVersion` | resolve 후 record-level 버전. 동일 fieldPath·동일 appliedFieldVersion 이하 재갱신 차단 |
| `winningSide` | "crm" \| "solution" \| "manual" |

#### 4.3.4 manual escalate 결정표

| 조건 | escalate? |
|---|---|
| FieldAuthority=last-write-wins-timestamp + provider timestamp 차이 ≤ 5s + version tie | ✅ |
| FieldAuthority=last-write-wins-version + version tie | ✅ |
| FieldAuthority=last-write-wins-timestamp + provider timestamp 누락 | ✅ |
| 동일 fieldPath·동일 appliedFieldVersion 이하 재충돌 | ✅ |
| FieldAuthority=crm/solution-authoritative | ❌ |

### 4.4 retry queue (CS2-12 — search-visibility § 13.5 worker SQL 복제)

§ 13.4 풀 schema + worker SoT SQL 명시.

### 4.5 credential rotation 상태 머신 (CS2-09)

#### 4.5.1 CrmCredentialVersion entity — § 13.11 schema

#### 4.5.2 상태 머신 + outbound/inbound 사용 matrix

```
stable → rotating → committed → grace-expired → stable
                  ↘ reverted → stable
```

| 상태 | activeSecretRef | previousSecretRef | graceUntil | outbound 사용 | inbound verifier 허용 |
|---|---|---|---|---|---|
| stable | new | null | null | active | active만 |
| rotating | new | old | now + 30min | **new 우선·old fallback** | **old + new 병행** |
| committed | new | old | graceUntil (rotating에서 받음) | new only | old + new 병행 (graceUntil까지) |
| grace-expired | new | null (revoked) | null | new only | new only |
| reverted | old | null | null | old | old |

`rotationAttemptId` UUID — audit cascade·운영자 추적.

`rotateCredential(integrationId, newSecretRef)`:
1. CrmCredentialVersion(state="rotating-target") insert. integration.state="rotating"
2. health check (new credential로 CRM API 호출)
3. 성공 → state="active" / 이전 active row → state="committed"·graceUntil 설정. integration.state="committed"
4. 실패 → 신규 row state="reverted". integration.state="reverted" → grace 후 stable
5. graceUntil 도래 → grace-expired worker가 이전 row revoke. integration.state="stable"

### 4.6 outbox — search-visibility § 7.2 SQL 동일

---

## 5. provider 어댑터 (v1.0 — 3종)

§ 3.4.2 adapter contract 참조. korean-emr v1.x deferred (CS-13).

### 5.1 rate limit (CrmRateLimitState — § 13.10)

provider별 redis token bucket. retry-after 헤더 respect.

---

## 6. 알림 (CS2-11)

### 6.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT)

| eventType | criticality | 채널 | recipients |
|---|---|---|---|
| `crm-sync-batch-failed` | high | email + inApp | operator |
| `crm-sync-conflict-detected` | high | email + inApp | operator |
| `crm-sync-credential-expired` | **critical** | email + inApp | operator + super-admin |
| `crm-sync-credential-expiring-soon` | high | email + inApp | operator + super-admin |

### 6.2 outbox — search-visibility § 7.2 SQL 동일

### 6.3 NotificationEvent 매핑 (CS2-11 — credentialVersion 포함)

| eventType | sourceKind | sourceId | contentRef |
|---|---|---|---|
| `crm-sync-batch-failed` | `sync-log` | syncLogId | `"sync-log:" + syncLogId` |
| `crm-sync-conflict-detected` | `conflict` | conflictId | `"crm-conflict:" + conflictId` |
| `crm-sync-credential-expired` | `credential-version` | **`integrationId:credentialVersionId`** | `"crm-integration:" + integrationId` |
| `crm-sync-credential-expiring-soon` | `credential-version` | **`integrationId:credentialVersionId`** | 동일 |

`sourceEventId = hash("crm-sync:" + sourceKind + ":" + sourceId + ":" + eventType)`. credentialVersion 갱신 시 새 row 허용 — lifecycle 반복 안전.

---

## 7. PII 처리 (CS2-02·05·07)

### 7.1 raw PII 저장 금지 — closed schema

- `pii.rawPiiStorageAllowed=false` 강제 (true 시 build fail)
- **displayHints는 6 column closed schema** (§ 3.2.1) — JSON 자유 필드 금지
- DB CHECK + application validator 양층 — insert 자체 reject
- `changedFields`·`snapshot`도 **allowlisted field token + masked value만**:
  - field token allowlist: `nameInitial`·`phoneLast4`·`emailDomain`·`cityName`·`genderHint`·`ageBand`·`statusEnum`·`crmExternalId`·`occurredAt`·`source`·`campaign`
  - value: § 3.2.1 정규식 또는 enum
- drift 감지(§ 10.4)는 **사후 보조 invariant**

### 7.2 RRN deny

- `pii.ssnRrnHandling="deny"` 강제
- asset-ingestion § 9.1 RRN checksum 재사용
- 검출 시: payload 폐기·ledger 보존(recoverable/final)·복구 § 4.2.1

### 7.3 raw PII 실시간 조회 — v1.x deferred (CS2-02·07)

**v1.0 미제공**. `liveReadCrmDetail`은 CS-14로 deferred. 운영자는 v1.0에서 CRM 콘솔로 직접 접근.

차단 이유:
- record-level consent/withdrawal 상태 확인 contract 미정 (CS-07)
- audit cascade `crm-live-read` 미완 (CS-14)
- DPA만으로 record-level 적법성 대체 불가

v1.x에서 두 cascade 완료 후 활성화.

### 7.4 DPA vs patient consent 분리

- `dpaEvidenceRef` 필수: 의료기관 ↔ Glitzy 데이터 처리 위탁 계약 증빙
- `patientConsentEvidenceRef` v1.x (CS-07): 환자 단위 동의·right to erasure
- v1.0: DPA 게이트 + raw PII는 CRM 측 책임

---

## 8. 운영 지표 + acceptance test (CS2-16)

### 8.1 핵심 지표

| 지표 | 정의 | 목표 |
|---|---|---|
| sync 성공율 | success / 전체 | > 99% |
| outbound push 지연 p95 | < 5초 | |
| inbound webhook 지연 p95 | < 10초 | |
| 충돌 발생율 | < 1% (baseline 후) | |
| credential 만료 알림 SLA | 7일 내 처리 | > 95% |
| RRN deny 발생율 | baseline | |
| RRN false positive 복구 처리 SLA | 24시간 | > 90% |
| webhook signature reject율 | < 0.1% | |
| ledger dedupe 적중률 | baseline | |
| outbox 발송 성공율 | > 99% | |
| CAS lost-update 감지율 | baseline. 운영자 검토 | |

### 8.2 acceptance test fixture (CS2-16 — 27 cases)

| ID | 영역 | 케이스 |
|---|---|---|
| AT-01 | manifest | legalApproved=false → build fail |
| AT-02 | manifest | korean-emr → build fail |
| AT-03 | manifest | appointment enabled → build fail |
| AT-04 | manifest | rawPiiStorageAllowed=true → build fail |
| AT-05 | manifest | ssnRrnHandling≠"deny" → build fail |
| AT-06 | manifest | dpaEvidenceRef 누락 → build fail |
| AT-07 | manifest | outbound-only + conflictResolution≠outbound-only-no-conflict → build fail |
| AT-08 | webhook verifier | provider별 valid/invalid signature·rawBody integrity·timestamp window |
| AT-09 | ledger dedupe | exactly-once 재전송 → `duplicate-eventid` |
| AT-10 | ledger dedupe | at-least-once 재전송 → `duplicate-digest` |
| AT-11 | RRN deny | regex+checksum 통과 RRN → 폐기 + ledger recoverable |
| AT-12 | RRN false positive 복구 | recoverRrnFalsePositive(override-and-fetch) → accepted-processed |
| AT-13 | outbound-only | processInboundWebhook direct invocation → runtime fail |
| AT-14 | outbound-only | runSync direction="inbound" → runtime fail |
| AT-15 | outbound-only | webhook endpoint HTTP request → 404 |
| AT-16 | retry exhausted | maxAttempts 도달 → failed-permanent + sink alert |
| AT-17 | credential rotation | stable→rotating→committed (성공) |
| AT-18 | credential rotation | stable→rotating→reverted (실패) |
| AT-19 | credential rotation 동시성 | rotating 중 outbound + inbound 동시 → 모두 성공 |
| AT-20 | CAS lost-update | 동시 inbound + outbound 같은 record → 1 성공 + 1 ConflictRecord |
| AT-21 | CAS field-level resolve | manual resolve 후 동일 fieldPath·동일 version 이하 재충돌 차단 |
| AT-22 | displayHints closed schema | 자유 JSON insert → DB CHECK reject |
| AT-23 | displayHints closed schema | raw 이름·전화 패턴 위반 → validator reject |
| AT-24 | outbox idempotency | credential rotation 후 새 credentialVersion 만료 임박 → 새 outbox row |
| AT-25 | purge worker | retentionDays.changeLog 도달 → purge |
| AT-26 | audit cascade | 4종 AuditAction insert 성공 |
| AT-27 | notification cascade | 4종 NotificationEventType emit 성공 |

---

## 9. 설치·설정 — DB 12 tables 마이그레이션 (§ 13)

---

## 10. 빌드·런타임·migration·invariant 검증

### 10.1 build-time fail

- `enabled=true` + `crmSyncConfig` 또는 `integrations[]` 빈 배열
- `crmSyncPolicyVersion` 누락 또는 패키지 보관 버전 불일치
- integration `legalApproved !== true` 또는 승인자/시각 누락
- integration `dpaEvidenceRef` 누락
- integration `apiKeySecretRef`·`apiUrl` 누락
- bi-directional + `webhookSecret` 누락
- integration `provider` ∉ {salesforce, hubspot, generic-rest-api}
- `provider="generic-rest-api"` + `genericRestApiAdapter` config 누락 (CS2-03)
- `requiresFeature: notifications` 충족 안 됨
- **`pii.rawPiiStorageAllowed=true`** (CS2-05)
- **`pii.ssnRrnHandling !== "deny"`**
- **`pii.liveReadEnabled=true`** (CS2-02·07)
- `entities.*` 모두 disabled
- `entities.appointment.enabled=true`
- **outbound-only mode** + 어느 entity `conflictResolution ≠ "outbound-only-no-conflict"` (CS2-06)
- **outbound-only mode** + CrmFieldMapping에 `direction IN (inbound, both)` 존재 (CS2-06)
- `fieldMappingPolicyVersion` 누락

### 10.2 runtime validation fail

- `forceRefresh=true` + `refreshIntentId` 누락
- webhook signature 검증 실패 → HTTP 401
- replay window 초과 → rejected-stale-timestamp
- credential 만료 후 sync 시도 → skipped-credential-expired
- inbound payload RRN 검출 → 폐기 + sink alert + ledger
- outbound push payload RRN 검출 → 차단 + 운영자 alert
- `resolveConflict` 시 conflictId 이미 resolved
- **outbound-only + processInboundWebhook direct invocation** → runtime fail
- **outbound-only + runSync inbound/both** → runtime fail
- **CAS WHERE 0 rows affected** → ConflictRecord 생성 + 운영자 alert
- **displayHints closed schema 위반 insert** → DB CHECK reject + validator alert
- `recoverRrnFalsePositive` 시 ledger status가 rejected-rrn-recoverable 아님

### 10.3 migration-time validation

- v0.3 cascade 신규 (v0.1·v0.2 운영 데이터 부재 전제)
- displayHints column 분리: 6 column. v0.2 운영 데이터 없으므로 backfill 불필요

### 10.4 runtime invariant·reconcile

- CrmSyncRetryQueue stale processing (lockedAt > 10분) → reconcile
- CrmConflictRecord open + slaDeadline 초과 → SLA 미달 추가 알림
- credential expiry 임박 → expiring-soon
- credential 만료 → expired + integration 자동 비활성화
- **PII drift 감지** — CHECK 미적용 historical row 등 → sink alert + 운영자 수동 정리 (사후 보조)
- CredentialVersion grace-expired 전이 worker
- CrmWebhookNonceLedger `rejected-rrn-recoverable` 24h 무처리 → 운영자 alert (CS2-10)

### 10.5 warning

- integration `credentialExpiresAt` null
- `pollIntervalMinutes` > 60
- conflict open ≥ 5건 누적
- ledger `duplicate-digest` 비율 > 5% (provider eventId 누락 의심)

---

## 11. 미결정 사항 — 3분류 + 잔여 리스크 (CS2-17)

### 11.1 open (v1.x·M2+ 후속)

| ID | 항목 | 비고 |
|---|---|---|
| CS-02 | 양방향 sync 충돌 SLA·escalation 운영 정책 | 운영 |
| CS-03 | 다중 CRM 통합 시 우선순위 | 운영 |
| CS-04 | webhook endpoint 보안 (IP allowlist) | 인프라 |
| CS-05 | OAuth refresh token rotation 자동화 정밀화 | 인프라 |
| CS-06 | provider별 quota 운영 가이드 | M2+ |
| CS-08 | LLM 기반 field auto-mapping | v1.x |
| CS-09 | CrmFieldMapping bulk import/export | M2+ |
| CS-10 | webhook 실패 시 polling fallback 자동 격상 | 운영 |
| CS-15 | CONTENT_STANDARDS submission/event 인터페이스 cascade | v1.0은 본 문서 § 3.2 canonical로 대체 |
| CS-18 | `@provenanceCrmRecordId` 공통 메타 cascade | v1.x (CRM→Core promote 시 필요) |

### 11.2 deferred-v1.x

| ID | 항목 | v1.0 영향 |
|---|---|---|
| CS-07 | patientConsentEvidenceRef·right to erasure | liveRead v1.0 미지원으로 차단 회피 |
| CS-11 | CRM → Core 자동 promote | 운영자 수동 promote |
| CS-12 | `appointment` entity | build fail로 차단 |
| CS-13 | `korean-emr` provider | build fail로 차단 |
| CS-14 | `crm-live-read` audit + liveReadCrmDetail | liveRead v1.x로 내림 (CS2-02) |

### 11.3 resolved-in-v1.0

| ID | 해소 |
|---|---|
| ~~CS-01~~ | RRN deny — v0.2 + asset-ingestion checksum 재사용 |
| ~~CS-14 v1.0 cascade~~ | liveRead를 v1.x로 내려 audit cascade 부담 제거 |

### 11.4 v0.3 잔여 리스크 (CS2-17)

| 영역 | 상태 | 비고 |
|---|---|---|
| CONTENT_STANDARDS cascade | open | § 3.2 canonical schema가 v1.0 운영을 충족. v1.x에서 CONTENT_STANDARDS로 흡수 |
| `@provenanceCrmRecordId` | open | CS-18. v1.0은 crmExternalId·integrationId로 출처 추적 |
| provider별 quota 운영 가이드 | open | CS-06. v1.0은 rate limit config |

---

## 12. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 |
| 2026-05-14 | v0.2 | codex 1차 비평 21 지적 반영 |
| 2026-05-14 | **v0.3** | **codex 2차 비평 17 지적 전건 수용**: (1) DB 인벤토리 **12 tables**로 정정 + 모든 테이블 풀 schema (CS2-01·13), (2) **liveReadCrmDetail v1.x로 내림** — CS-14 deferred. raw PII 실시간 조회 v1.0 미제공 (CS2-02·07), (3) **ProviderWebhookVerifier 결과 타입 고정** — VerifierResult shape + deliveryKind·retrySemantics + provider별 adapter contract 표 (CS2-03), (4) **nonce ledger key 정책 정합** — deliveryKind별 key 결정. retention SoT 단일화. ledger status 5종 enum (CS2-04), (5) **displayHints closed schema** — 6 column 분리·DB CHECK·정규식·application validator (CS2-05), (6) **outbound-only mode matrix 별도** — CrmFieldMapping direction inbound build fail (CS2-06), (7) **CAS WHERE 조건 + ConflictRecord field-level + manual escalate 결정표** (CS2-08), (8) **CrmCredentialVersion entity 신설 + 5상태 머신 + outbound/inbound 사용 matrix** (CS2-09), (9) **RRN false positive 복구 command** `recoverRrnFalsePositive` + ledger recoverable/final (CS2-10), (10) **outbox sourceId에 credentialVersionId 포함** — lifecycle 반복 안전 (CS2-11), (11) **retry queue worker SQL search-visibility § 13.5 복제** (CS2-12), (12) **retention purge SoT** 각 테이블별 expiresAt + worker 책임 (CS2-13), (13) **credential fingerprint에 secretVersionId 포함** — non-reversible + 식별 가능 (CS2-14), (14) **v1.0 운영 이벤트 canonical schema 본 문서 § 3.2 정의** — ReservationSubmission·Inquiry·ConversionEvent·Contact (CS2-15·CS-15), (15) **acceptance test 27 cases로 확대** (CS2-16), (16) **§ 11.4 잔여 리스크 분리** (CS2-17) |

---

## 13. 본 Feature 내부 데이터 구조 (admin DB **12 tables**)

### 13.1 `CrmIntegration`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `integrationKey` | string | ✅ |
| `provider` | enum (salesforce·hubspot·generic-rest-api) | ✅ |
| `apiKeySecretRef` | secretRef | ✅ |
| `apiUrl` | string | ✅ |
| `webhookSecret` | secretRef | optional |
| `credentialExpiresAt` | Date | optional |
| `currentCredentialVersionId` | UUID | ✅ — FK § 13.11 |
| `credentialState` | enum (stable·rotating·committed·grace-expired·reverted) | ✅ |
| `legalApproved` | boolean | ✅ |
| `legalApprovedBy`·`legalApprovedAt` | string·Date | ✅ |
| `dpaEvidenceRef` | secretRef | ✅ |
| `genericRestApiAdapter` | JSON | optional (provider=generic-rest-api 시 ✅) |
| `mode` | enum | ✅ |
| `active` | boolean | ✅ |
| `createdAt`·`updatedAt` | Date | ✅ |

**Constraints**: `UNIQUE(instanceId, integrationKey) WHERE active=true`. `FK currentCredentialVersionId → CrmCredentialVersion.id`.
**Index**: `(instanceId, active)`, `(credentialExpiresAt)`.

### 13.2 `CrmSyncLog`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `idempotencyKey` | string | ✅ |
| `instanceId` | Slug | ✅ |
| `mode` | enum (scheduled·on-demand) | ✅ |
| `direction` | enum (inbound·outbound·both) | ✅ |
| `manifestVersion` | string | ✅ |
| `forceRefresh` | boolean | ✅ |
| `refreshIntentId` | string | optional |
| `windowStart`·`windowEnd` | Date | optional |
| `startedAt`·`completedAt` | Date | ✅·optional |
| `envelopeState` | enum (running·succeeded·partial·failed·retried) | ✅ |
| `expiresAt` | Date | ✅ — retentionDays.syncLog |

**Constraints**: `UNIQUE(instanceId, idempotencyKey)`.
**Index**: `(expiresAt)`, `(instanceId, startedAt DESC)`.

### 13.3 `CrmSyncSourceAttempt`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `syncLogId` | UUID | ✅ — FK ON DELETE RESTRICT |
| `integrationId` | UUID | ✅ — FK |
| `entity` | enum (reservation·contact·inquiry·conversion-event) | ✅ |
| `direction` | enum | ✅ |
| `attemptNumber` | integer | ✅ |
| `status` | enum (processing·success·partial·failed-credential·failed-quota·failed-transient·failed-permanent·skipped-disabled·skipped-rate-limit·skipped-credential-expired·in-retry-queue) | ✅ |
| `recordsInbound`·`recordsOutbound`·`conflictsDetected` | integer | ✅ |
| `error`·`errorClass` | string | optional |
| `startedAt`·`completedAt` | Date | ✅·optional |
| `expiresAt` | Date | ✅ — retentionDays.sourceAttempt |

**Constraints**: `UNIQUE(syncLogId, integrationId, entity, direction, attemptNumber)`.
**Index**: `(expiresAt)`, `(integrationId, status)`.

### 13.4 `CrmSyncRetryQueue` (CS2-12 — worker SQL 복제)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `idempotencyKey` | string | ✅ — `(integrationId, entity, recordId, operation)` hash |
| `syncLogId` | UUID | ✅ — FK |
| `integrationId`·`entity`·`direction` | various | ✅ |
| `attemptNumber`·`maxAttempts` | integer | ✅ |
| `status` | enum (pending·processing·completed·exhausted·failed-permanent) | ✅ |
| `nextAttemptAt` | Date | ✅ |
| `lockedAt`·`lockedBy` | Date·string | optional |
| `lastError`·`lastErrorClass` | string·enum (retryable·permanent) | optional |
| `payloadSnapshot` | JSON (closed-schema field tokens만) | optional |
| `expiresAt` | Date | ✅ — retentionDays.retryQueueCompleted |

**Constraints**: `UNIQUE(idempotencyKey) WHERE status IN (pending, processing)`.
**Index**: `(status, nextAttemptAt, lockedAt) WHERE status IN (pending, processing)`.

**worker SoT SQL** (search-visibility § 13.5 패턴 복제):

```sql
-- claim
WITH next AS (
  SELECT id FROM crm_sync_retry_queue
  WHERE status='pending'
    AND next_attempt_at <= now()
    AND (locked_at IS NULL OR locked_at < now() - interval '10 minutes')
  ORDER BY next_attempt_at
  FOR UPDATE SKIP LOCKED
  LIMIT 1
)
UPDATE crm_sync_retry_queue q
SET status='processing', locked_at=now(), locked_by=$worker_id, attempt_number=attempt_number+1
FROM next WHERE q.id=next.id RETURNING q.*;

-- per-integration advisory lock (provider rate-limit 직렬화)
SELECT pg_advisory_xact_lock(hashtext('crm-sync:' || $integration_id));

-- exhausted 전이
UPDATE crm_sync_retry_queue
SET status='exhausted', locked_at=null, locked_by=null
WHERE id=$id AND attempt_number >= max_attempts;
```

permanent error class → status='failed-permanent' 즉시 + sink alert.

### 13.5 `CrmRecord` (closed-schema displayHints — CS2-05)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `integrationId` | UUID | ✅ — FK |
| `entity` | enum | ✅ |
| `crmExternalId` | string | optional |
| `solutionRecordRef` | string | optional |
| `solutionVersion` | integer | ✅ — CAS |
| `crmVersion` | integer | ✅ — CAS |
| `lastAppliedConflictVersion` | integer | optional |
| `lastSyncedAt` | Date | ✅ |
| `piiHash` | char(64) | optional |
| `displayHintsNameInitial` | varchar(8) | optional — CHECK regex |
| `displayHintsPhoneLast4` | char(4) | optional — CHECK `^\d{4}$` |
| `displayHintsEmailDomain` | varchar(64) | optional — CHECK regex |
| `displayHintsCityName` | varchar(32) | optional |
| `displayHintsGenderHint` | enum | optional |
| `displayHintsAgeBand` | enum | optional |
| `piiRetentionExpiresAt` | Date | optional |

**Constraints**: `UNIQUE(instanceId, integrationId, entity, crmExternalId) WHERE crmExternalId IS NOT NULL`.
**CHECK**: 각 displayHints* column에 정규식·enum 강제.
**Index**: `(instanceId, entity, lastSyncedAt DESC)`, `(piiRetentionExpiresAt) WHERE piiRetentionExpiresAt IS NOT NULL`.

### 13.6 `CrmRecordChangeLog` (closed-schema)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `crmRecordId` | UUID | ✅ — FK |
| `direction` | enum | ✅ |
| `changedFields` | JSON — allowlisted field token + masked value | ✅ |
| `priorSnapshot`·`newSnapshot` | JSON — 동일 제약 | optional |
| `appliedAt` | Date | ✅ |
| `appliedBy` | string | ✅ |
| `expiresAt` | Date | ✅ — retentionDays.changeLog |

**application validator**: changedFields/snapshot의 모든 key가 § 7.1 allowlist에 속해야 함. 위반 시 insert reject.
**Index**: `(crmRecordId, appliedAt DESC)`, `(expiresAt)`.

### 13.7 `CrmFieldMapping`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `entity` | enum | ✅ |
| `solutionFieldPath` | string | ✅ |
| `crmFieldPath` | string | ✅ |
| `direction` | enum (inbound·outbound·both) | ✅ |
| `authority` | FieldAuthority | ✅ |
| `transformerRef` | string | optional |
| `policyVersion` | string | ✅ |
| `active` | boolean | ✅ |

**Constraints**: `UNIQUE(instanceId, entity, solutionFieldPath, direction) WHERE active=true`.
**build-time**: instance mode="outbound-only" + 본 테이블에 `direction IN (inbound, both)` 존재 시 build fail (CS2-06).

### 13.8 `CrmConflictRecord` (field-level — CS2-08)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `crmRecordId` | UUID | ✅ — FK |
| `fieldPath` | string | ✅ |
| `baseVersion` | integer | ✅ |
| `observedCrmVersion`·`observedSolutionVersion` | integer | ✅ |
| `crmProposedValue`·`solutionProposedValue` | masked field token + value | ✅ — closed schema |
| `resolution` | enum (open·crm-wins·solution-wins·manual-resolved·manual-rejected) | ✅ |
| `winningVersion` | integer | optional |
| `appliedFieldVersion` | integer | optional |
| `resolvedBy`·`resolvedAt` | string·Date | optional |
| `slaDeadline` | Date | ✅ — open 기준 7일 |
| `expiresAt` | Date | ✅ — retentionDays.conflictRecord |

**Constraints**: `FK crmRecordId ON DELETE RESTRICT`.
**Index**: `(crmRecordId, fieldPath, appliedFieldVersion)`, `(resolution, slaDeadline) WHERE resolution='open'`, `(expiresAt)`.

### 13.9 `CrmCredentialAuditLog`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `integrationId` | UUID | ✅ — FK |
| `event` | enum (rotated·rotation-failed·grace-expired·expired·expiring-soon) | ✅ |
| `rotationAttemptId` | UUID | optional |
| `priorCredentialFingerprint`·`newCredentialFingerprint` | char(16) | optional |
| `actor` | string | ✅ |
| `occurredAt` | Date | ✅ |

**Index**: `(integrationId, occurredAt DESC)`.

### 13.10 `CrmRateLimitState`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `bucketKey` | string | ✅ — `crm:quota:{integrationId}:{provider}` |
| `tokensRemaining` | number | ✅ |
| `quotaResetAt` | Date | ✅ |
| `nextAllowedAt` | Date | optional |
| `updatedAt` | Date | ✅ |

**Constraints**: `UNIQUE(bucketKey)`.

### 13.11 `CrmCredentialVersion` (CS2-09 신설)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `integrationId` | UUID | ✅ — FK |
| `secretRef` | secretRef | ✅ |
| `secretVersionId` | string | ✅ — secret manager의 immutable version id |
| `webhookSecretRef`·`webhookSecretVersionId` | secretRef·string | optional |
| `credentialFingerprint` | char(16) | ✅ — § 3.1.1 |
| `state` | enum (active·rotating-target·committed·grace-expired·reverted·revoked) | ✅ |
| `activatedAt` | Date | ✅ |
| `graceUntil` | Date | optional |
| `revokedAt` | Date | optional |
| `expiresAt` | Date | optional — credential 자체의 expiry |

**Constraints**: `FK integrationId`. `UNIQUE(integrationId, secretVersionId)`. application invariant: 동시에 `state='active'`인 row 0 또는 1개·`state='rotating-target'`인 row 0 또는 1개.
**Index**: `(integrationId, state)`, `(expiresAt)`.

### 13.12 `CrmWebhookNonceLedger` (CS2-04)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `integrationId` | UUID | ✅ — FK |
| `providerEventId` | string | optional |
| `canonicalDigest` | char(64) | ✅ — SHA-256 |
| `receivedBucket` | bigint | ✅ — `floor(epoch/60)` |
| `signatureDigest` | char(64) | ✅ |
| `deliveryKind` | enum | ✅ |
| `receivedAt` | Date | ✅ |
| `status` | enum (accepted-pending·accepted-processed·rejected-rrn-recoverable·rejected-rrn-final·rejected-parse-recoverable) | ✅ |
| `rrnFingerprint` | char(16) | optional — HMAC non-reversible |
| `expiresAt` | Date | ✅ — webhookNonceLedgerRetentionMinutes |

**Constraints**:
- `UNIQUE(integrationId, providerEventId) WHERE providerEventId IS NOT NULL` (partial — exactly-once provider)
- `UNIQUE(integrationId, canonicalDigest, receivedBucket) WHERE providerEventId IS NULL` (best-effort)

**Index**: `(expiresAt)`, `(integrationId, status, receivedAt DESC)`, `(status, receivedAt) WHERE status='rejected-rrn-recoverable'`.

### 13.13 `CrmSyncNotificationOutbox` (search-visibility § 13.10 패턴 — CS2-12)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `sourceKind` | enum (sync-log·conflict·credential-version) | ✅ |
| `sourceId` | string | ✅ — credential-version는 `integrationId:credentialVersionId` (CS2-11) |
| `eventType` | enum (NotificationEventType 4종) | ✅ |
| `sourceEventId` | char(64) | ✅ — hash |
| `payload` | JSON | ✅ |
| `status` | enum (pending·processing·sent·failed·permanent) | ✅ |
| `attempts` | integer | ✅ |
| `lockedAt`·`lockedBy` | Date·string | optional |
| `lastError` | string | optional |
| `createdAt`·`sentAt` | Date | ✅·optional |
| `expiresAt` | Date | ✅ — retentionDays.notificationOutbox |

**Constraints**: `UNIQUE(sourceKind, sourceId, eventType)`. credential lifecycle 반복 시 credentialVersionId가 sourceId에 포함되어 새 row 허용.
**Index**: `(status, createdAt) WHERE status='pending'`, `(expiresAt)`.

---

**총 13개 절·12개 admin DB 테이블** (§ 13.1 ~ § 13.13 — § 13.10 RateLimitState와 § 13.12 NonceLedger는 별개 테이블).


 succeeded in 661ms:
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
session id: 019e25d7-24a9-7720-9b32-8131966aa664
--------
user
# 자동 비평 의뢰 — `docs/features/crm-sync.md` v0.2 (2차 사이클)

## 컨텍스트

1차 사이클(21개 지적) 전건 수용 후 v0.2로 전면 재작성. 주요 cascade:
- REVIEW_WORKFLOW § 9.1·§ 9.1.1·§ 10.2.1: 4종 NotificationEventType + 4종 AuditAction 완료
- DATA_MODEL C-08 v0.19: CrmSyncConfig·CrmIntegrationEntry 신설·crmSyncPolicyVersion 추가
- ReservationPage/CTAConfig 경계 정리: 콘텐츠 페이지는 참조만. sync 대상은 ReservationSubmission·Inquiry·ConversionEvent (CONTENT_STANDARDS 후속 cascade — CS-15 신규)
- provider 3종 한정 (salesforce·hubspot·generic-rest-api). korean-emr build fail
- entity 4종 (appointment v1.x — CS-12 deferred)
- raw PII 저장 금지 강제 (rawPiiStorageAllowed=false build fail) — displayHints만
- RRN deny v1.0 강제 + asset-ingestion § 9.1 checksum 재사용
- ProviderWebhookVerifier 인터페이스 + CrmWebhookNonceLedger (replay 방지)
- field-level FieldAuthority enum + CAS·clock skew·tie-breaker·appliedVersion
- credential rotation 상태 머신 (stable·rotating·committed·reverted + grace period)
- DPA vs patient consent 분리 (dpaEvidenceRef·patientConsentEvidenceRef)
- 미결정 3분류 (open/deferred-v1.x/resolved-in-v1.0)
- audit log contract + credential fingerprint (HMAC non-reversible)
- DB 10 tables (Integration·SyncLog·SourceAttempt·RetryQueue·Record·RecordChangeLog·FieldMapping·ConflictRecord·CredentialAuditLog·RateLimitState·WebhookNonceLedger·NotificationOutbox)
- acceptance test fixture (CS1-21)

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\crm-sync.md` v0.2를 이전과 동일한 강도로 엄정하게 비평하라:

1. **1차 지적 재발 여부**: 21개 지적이 실제로 정정됐는가? 표면만 바뀌고 본질은 남아있지 않은가?

2. **신규 도입 메커니즘의 모순·미진함**:
   - ProviderWebhookVerifier 인터페이스 — provider별 차이(Salesforce Outbound Messages SOAP/XML vs HubSpot v3 vs generic) 추상화 누수
   - CrmWebhookNonceLedger replay 윈도우와 timestampTolerance·retention의 정합성
   - field-level FieldAuthority + CAS의 race condition·tie-breaker manual escalate 트리거 정확성
   - credential rotation 상태 머신 grace period 동시성 (rotating 중 outbound·inbound 동작)
   - rawPiiStorageAllowed=false 강제 시 PII Redaction Validator 구현 가능성·drift 감지 신뢰성
   - liveReadCrmDetail의 audit cascade가 v1.x deferred(CS-14)인데 v1.0에서 운영 가능한가
   - RRN deny — payload 폐기·fingerprint 보존 — 잘못된 false positive 시 운영자 복구 경로

3. **mode 분리 (outbound-only) 일관성**:
   - 모든 command/event/error matrix에서 outbound-only가 제대로 차단되는가
   - conflictResolution=outbound-only-no-conflict 외 값 build fail 정확성
   - inbound runSync/processInboundWebhook 차단의 HTTP 404 vs runtime error 일관성

4. **DB 10 tables 완결성**:
   - 모든 FK·UNIQUE·INDEX·partial unique 누락 없는가
   - retention 필드(expiresAt) cascade 일관성 — purge worker SoT가 본 Feature와 다른 Feature(notifications·analytics-reporting)와 충돌하지 않는가
   - CrmRecord.displayHints만으로 운영자 화면이 충분한 정보를 제공하는가 (UX trade-off)

5. **이전 Feature와의 패턴 정합성**:
   - asset-ingestion AssetPromotionRecord 4-state machine과 본 Feature credential rotation state machine 패턴 일관성
   - search-visibility/keyword-monitoring outbox SQL 재사용 정확성
   - DATA_MODEL § 2.2 `@provenanceAssetId` 같은 공통 메타가 CS-18에서 v1.x deferred로 처리됐는데, 본 Feature inbound CrmRecord에 `@provenanceCrmRecordId` 같은 필드가 v1.0에 필요한가

6. **운영 SLA·acceptance test fixture**:
   - § 8.2 acceptance test 6항목으로 v1.0 회귀 방지가 충분한가
   - § 4.5 credential rotation의 rotationGracePeriodMinutes(30분) 기본값이 운영 현실에 맞는가
   - § 11 미결정 3분류의 v1.x deferred 항목들이 v1.0 운영 차단 요인 아닌가

7. **명세 자체의 정합성**:
   - § 0 한 페이지 요약 ↔ § 13 인벤토리 10 tables 일관성
   - § 6.1 NotificationEventType 4종 ↔ § 13.11 outbox `UNIQUE(sourceKind, sourceId, eventType)` 정합
   - § 7.1 PII Redaction Validator·§ 13.5 CrmRecord PII 필드 금지 cross-check
   - § 3.1.1 audit log contract 4행 ↔ REVIEW_WORKFLOW § 10.2.1 cascade 정합

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `CS2-`.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\crm-sync.md` (대상 v0.2)
- `C:\Users\assag\solution\website-exposure\.codex-reviews\cs_cycle1_response.md` (1차 지적)
- `C:\Users\assag\solution\website-exposure\docs\features\asset-ingestion.md`
- `C:\Users\assag\solution\website-exposure\docs\features\search-visibility.md`
- `C:\Users\assag\solution\website-exposure\docs\features\keyword-monitoring.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md`
codex
`seo-geo` 스킬이 이 문서 검토 범주와 일부 겹치지만, 이번 요청은 SEO 개선이 아니라 CRM sync 명세의 설계 리뷰라서 일반 코드/문서 리뷰 방식으로 진행하겠습니다. 먼저 대상 문서와 1차 응답, 관련 SoT를 병렬로 읽어 상호 참조부터 잡겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw -LiteralPath 'docs/features/crm-sync.md'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw -LiteralPath '.codex-reviews/cs_cycle1_response.md'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw -LiteralPath 'docs/core/DATA_MODEL.md'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Raw -LiteralPath 'docs/admin/REVIEW_WORKFLOW.md'" in C:\Users\assag\solution\website-exposure
 succeeded in 699ms:
{
  "feature": "crm-sync",
  "version_reviewed": "v0.1",
  "cycle": 1,
  "verdict": "needs_major_revision",
  "summary": {
    "overall": "v0.1은 큰 방향은 맞지만 SoT cascade가 실제로 완료되지 않았고, 외부 CRM/EMR 연동·PII·webhook 보안·충돌 해결의 운영 계약이 아직 추상 선언 수준이다. 현재 상태로는 v1.0 안정판 기준에 미달한다.",
    "blocking_count": 9,
    "major_count": 8,
    "minor_count": 4
  },
  "findings": [
    {
      "id": "CS1-01",
      "severity": "blocking",
      "category": "SoT 정합",
      "location": "docs/features/crm-sync.md:10-12, 87-91, 328-335; docs/admin/REVIEW_WORKFLOW.md:464-541; docs/core/DATA_MODEL.md:588-595",
      "issue": "crm-sync는 REVIEW_WORKFLOW NotificationEventType 4종, AuditAction 4종, DATA_MODEL C-08 v0.19 cascade가 필요하다고 선언하지만 실제 SoT에는 반영되어 있지 않다. DATA_MODEL은 현재 v0.18이며 crmSyncConfig/crmSyncPolicyVersion 필드가 없다.",
      "impact": "notify() 호출·audit insert·manifest validation이 런타임에서 실패하거나 문서 간 단일 진실 원본이 깨진다.",
      "recommendation": "REVIEW_WORKFLOW §9.1 enum/§9.1.1 매트릭스에 4종 이벤트를 추가하고, §10.2.1 AuditAction에 4종을 추가하라. DATA_MODEL C-08에 CrmSyncConfig와 crmSyncPolicyVersion을 v0.19로 cascade하고 변경 이력도 갱신하라."
    },
    {
      "id": "CS1-02",
      "severity": "blocking",
      "category": "SoT 정합",
      "location": "docs/features/crm-sync.md:91, 254-258, 498, 535; docs/core/DATA_MODEL.md:189-207, 912-913",
      "issue": "ReservationPage/CTAConfig를 sync 대상 Core 객체로 둔 설명이 DATA_MODEL과 맞지 않는다. C-20 ReservationPage는 예약 안내 콘텐츠이며 contact.email 같은 submission 필드가 없다.",
      "impact": "CrmFieldMapping.solutionFieldPath 예시가 존재하지 않는 Core 경로를 가리키므로 실제 구현자가 콘텐츠 계약과 사용자 제출 데이터 계약을 혼동한다.",
      "recommendation": "v1.0에서는 ReservationPage 자체가 아니라 별도 ReservationSubmission/Inquiry/ConversionEvent 운영 이벤트를 sync 대상으로 정의하라. C-20은 채널 설정 참조만 가능하다고 명확히 하고, CONTENT_STANDARDS cascade가 필요한 이벤트 인터페이스를 별도 SoT로 분리하라."
    },
    {
      "id": "CS1-03",
      "severity": "blocking",
      "category": "외부 시스템 연동 안정성",
      "location": "docs/features/crm-sync.md:21-23, 128, 320-322, 421, 472",
      "issue": "provider 4종·entity 5종 지원을 요약과 변경 이력에서 선언하지만, korean-emr와 appointment는 각각 v1.x/미지원으로 되어 있다. build-time fail은 appointment만 막고 korean-emr provider 활성화는 막지 않는다.",
      "impact": "v1.0 지원 범위가 불명확해진다. korean-emr를 선택한 인스턴스가 generic-rest-api fallback 없이 build-pass할 수 있다.",
      "recommendation": "v1.0 지원 provider를 salesforce/hubspot/generic-rest-api 3종으로 좁히거나 korean-emr 어댑터 계약을 실제로 완성하라. 미지원이면 `provider='korean-emr'` build fail을 추가하고 §0/§12의 4종 표현을 정정하라."
    },
    {
      "id": "CS1-04",
      "severity": "blocking",
      "category": "webhook 보안",
      "location": "docs/features/crm-sync.md:236-249, 305-318, 584-589",
      "issue": "webhook replay 방지가 timestamp tolerance만으로 정의되어 있고 provider event id/nonce ledger, raw body 서명 검증, canonical string 구성, 중복 delivery idempotency가 없다. HubSpot v3와 Salesforce Outbound Messages/Platform Events의 검증 방식 차이도 HMAC-SHA256 한 줄로 축약되어 부정확하다.",
      "impact": "동일 timestamp 범위 내 replay, JSON 재직렬화로 인한 signature mismatch, provider별 검증 오구현 위험이 크다.",
      "recommendation": "ProviderWebhookVerifier 인터페이스를 만들고 `rawBody`, headers, method, full URL, timestamp, provider event id를 입력으로 받게 하라. `CrmWebhookDeliveryLedger` 또는 기존 테이블에 `(integrationId, providerEventId/signatureDigest)` unique를 두어 replay/dedupe를 보장하라."
    },
    {
      "id": "CS1-05",
      "severity": "blocking",
      "category": "PII·의료법",
      "location": "docs/features/crm-sync.md:141-145, 353-370, 491-504, 519, 552-553",
      "issue": "raw PII 저장 금지와 `retentionDaysSolutionSide=30` 이후 마스킹이 서로 충돌한다. CrmRecordChangeLog.changedFields, CrmConflictRecord.solutionSnapshot/crmSnapshot에는 PII 마스킹 규칙이 일부만 있고 원천적으로 raw PII 저장을 막는 schema/validator가 없다.",
      "impact": "개인정보 최소 저장 원칙이 명세상 강제되지 않는다. 충돌 큐와 변경 로그가 실질적인 PII 저장소가 될 수 있다.",
      "recommendation": "v1.0 원칙을 '솔루션 DB raw PII 저장 금지'로 고정하고 retentionDaysSolutionSide는 displayHints/derived hints 보존 기간으로 재정의하라. 모든 snapshot/change log/outbox metadata에 PII redaction validator를 강제하고, raw detail 조회는 CRM live read + 권한 + audit + no-cache로 제한하라."
    },
    {
      "id": "CS1-06",
      "severity": "blocking",
      "category": "RRN deny",
      "location": "docs/features/crm-sync.md:361-365, 418, 429, 452; docs/features/asset-ingestion.md:397-402",
      "issue": "RRN deny는 v1.0 build/runtime fail로 이미 결정되어 있는데 CS-01 미결정으로 남아 있다. 또한 asset-ingestion checksum 재사용만 말하고 생년월일 유효성·checksum 공식·탐지 결과 처리·payload 폐기 절차가 없다.",
      "impact": "미결정 표가 정책 결정을 되돌리는 것처럼 보이며, RRN 발견 시 어떤 데이터가 저장되는지 불명확하다.",
      "recommendation": "CS-01을 '해소됨'으로 이동하고 v1.0 deny를 확정하라. asset-ingestion §9.1의 후보 추출, 생년월일 검증, checksum 공식 재사용을 명시하고, RRN 발견 payload는 저장하지 않으며 event/count/hashed fingerprint만 남기는 정책을 추가하라."
    },
    {
      "id": "CS1-07",
      "severity": "blocking",
      "category": "충돌 해결",
      "location": "docs/features/crm-sync.md:123-129, 281-291, 546-559",
      "issue": "field-level `solutionSideAuthoritative`가 config에만 있고 CrmFieldMapping/CrmConflictRecord schema에는 반영되지 않는다. last-write-wins도 clock skew, provider timestamp 신뢰도, CAS/version 비교 규칙이 없다.",
      "impact": "양방향 sync에서 필드 단위 병합 결과가 재현 불가능하고, manual conflict 해결 후 동일 충돌이 반복될 수 있다.",
      "recommendation": "CrmFieldMapping에 `authority` 또는 entity policy reference를 추가하고, conflict detection에 crmVersion/solutionVersion/CAS를 포함하라. last-write-wins는 provider timestamp 신뢰 조건과 tie-breaker를 정의하고 manual resolution 후 appliedVersion을 저장하라."
    },
    {
      "id": "CS1-08",
      "severity": "blocking",
      "category": "운영 안정성",
      "location": "docs/features/crm-sync.md:55-60, 295-301, 485-489, 578-582",
      "issue": "CrmSyncRetryQueue와 CrmSyncNotificationOutbox를 search-visibility 패턴 동일이라고만 하고 실제 schema, status enum, lockedAt/claimedAt 구분, nextAttemptAt 계산, exhausted 전이, advisory lock invariant를 전개하지 않았다.",
      "impact": "가장 장애 가능성이 큰 외부 연동 Feature인데 retry 동작이 구현 가능한 수준으로 고정되어 있지 않다.",
      "recommendation": "search-visibility처럼 worker SQL 또는 동등한 claim 계약을 복제하라. `attempts`, `maxAttempts`, `nextAttemptAt`, `lockedAt`, `lastErrorClass`, `status=pending|processing|retryable|exhausted` 등을 명시하고 1m→5m→30m→2h→6h backoff와 permanent 전이를 고정하라."
    },
    {
      "id": "CS1-09",
      "severity": "blocking",
      "category": "운영 모드",
      "location": "docs/features/crm-sync.md:118, 123-129, 199-209, 401-405, 423-431",
      "issue": "outbound-only 모드는 webhook endpoint 비활성만 말하고 `runSync(direction='inbound'|'both')`, inbound field mapping, entity conflictResolution과의 build/runtime 차단 규칙이 없다.",
      "impact": "outbound-only 인스턴스에서도 inbound sync가 명시 호출로 실행될 수 있다.",
      "recommendation": "mode별 허용 command matrix를 추가하라. outbound-only에서는 inbound/both runSync, processInboundWebhook, inbound/both CrmFieldMapping을 build/runtime fail로 막고, entity conflictResolution도 outbound-only-no-conflict 또는 outbound mapping만 허용하라."
    },
    {
      "id": "CS1-10",
      "severity": "major",
      "category": "OAuth·credential rotation",
      "location": "docs/features/crm-sync.md:101-112, 130-133, 170-179, 305-318, 456",
      "issue": "Salesforce refresh token rotation과 API key 갱신이 핵심 요구사항인데 CS-05 미결정으로 남아 있고, token family/version, atomic secret swap, old credential grace, refresh 실패 처리 정책이 없다.",
      "impact": "credential 만료/rotation 중 sync 중단 또는 잘못된 secretRef 사용 가능성이 높다.",
      "recommendation": "CrmIntegrationCredentialVersion 또는 secret version 필드를 도입하고 rotateCredential의 상태 머신을 정의하라. Salesforce는 refresh token rotation 성공 시 새 secretRef commit과 이전 버전 revoke 순서를 명시하라."
    },
    {
      "id": "CS1-11",
      "severity": "major",
      "category": "rate limit·quota",
      "location": "docs/features/crm-sync.md:224, 295-301, 305-318, 457",
      "issue": "provider별 rate limit이 '어댑터 처리'로만 되어 있고 quota bucket, resetAt, retry-after 반영, per integration concurrency 제한이 없다.",
      "impact": "Salesforce daily quota 또는 HubSpot burst limit 도달 시 전체 sync가 실패하거나 provider ban 위험이 있다.",
      "recommendation": "ProviderRateLimitState 테이블 또는 CrmIntegration 상태 필드를 추가하고 `failed-quota`, `skipped-rate-limit`, `nextAllowedAt`, `quotaResetAt` 전이를 정의하라."
    },
    {
      "id": "CS1-12",
      "severity": "major",
      "category": "DPA·동의",
      "location": "docs/features/crm-sync.md:105-108, 189-192, 367-370, 573",
      "issue": "`consentEvidenceRef`가 DPA와 환자 동의 증빙을 한 필드에 섞고 있다. DPA는 provider/기관 계약 증빙이고 환자 동의는 record/entity 단위 증빙일 수 있다.",
      "impact": "법무 승인 게이트가 계약 승인과 데이터 주체 동의 철회를 구분하지 못한다.",
      "recommendation": "`dpaEvidenceRef`와 `patientConsentEvidenceRef`를 분리하라. v1.0에서 환자 단위 동의를 저장하지 않을 경우, inbound PII live read 가능 조건과 동의 철회 처리(CS-07)를 build/runtime gate로 명확히 하라."
    },
    {
      "id": "CS1-13",
      "severity": "major",
      "category": "명세 정합성",
      "location": "docs/features/crm-sync.md:24, 476-582",
      "issue": "§0은 DB 10 tables를 선언하지만 §13에서는 CrmSyncLog·CrmSyncSourceAttempt·CrmSyncRetryQueue와 CrmSyncNotificationOutbox를 '패턴 동일'로만 두어 실제 테이블 인벤토리와 schema가 검증 불가하다.",
      "impact": "이전 Feature의 v1.0 패턴과 달리 구현자에게 필요한 migration 계약이 부족하다.",
      "recommendation": "10개 테이블 모두 최소 필드, required, constraints, indexes, retention/expiresAt을 전개하라."
    },
    {
      "id": "CS1-14",
      "severity": "major",
      "category": "보존 정책",
      "location": "docs/features/crm-sync.md:146-150, 511-523",
      "issue": "syncLog 730일, changeLog 1095일 retention이 config에 있지만 CrmSyncLog/SourceAttempt schema가 없고 CrmRecordChangeLog만 expiresAt이 있다. ConflictRecord 1095일도 expiresAt 필드가 없다.",
      "impact": "운영 보존 정책이 실제 purge worker와 연결되지 않는다.",
      "recommendation": "각 retention 대상 테이블에 `expiresAt` 또는 partition policy를 추가하고 purge worker·legal hold 예외를 정의하라."
    },
    {
      "id": "CS1-15",
      "severity": "major",
      "category": "Notification outbox",
      "location": "docs/features/crm-sync.md:328-347",
      "issue": "§6.1은 REVIEW_WORKFLOW cascade 필요라고 쓰면서 자체 매트릭스를 병렬 정의한다. §6.3은 credential-expired와 credential-expiring-soon을 한 행으로 합쳐 sourceKind/eventType unique와 metadata shape가 느슨하다.",
      "impact": "canonical SoT와 feature-local 표가 갈라질 수 있고 notification idempotency 테스트가 불명확하다.",
      "recommendation": "§6.1은 canonical REVIEW_WORKFLOW 행의 복사본이 아니라 '요청 cascade' 또는 'expected rows'로 명확히 표시하라. 4개 eventType 각각 별도 mapping row를 두고 recipients 산정도 명시하라."
    },
    {
      "id": "CS1-16",
      "severity": "major",
      "category": "Audit log",
      "location": "docs/features/crm-sync.md:172-179; docs/admin/REVIEW_WORKFLOW.md:634-659",
      "issue": "crm AuditAction 4종은 feature 문서에만 있고 REVIEW_WORKFLOW §10.2.1 enum에는 없다. `priorCredentialHash(부분 SHA-256)`도 secret fingerprint 방식이 애매하다.",
      "impact": "audit insert 실패와 credential metadata 유출 위험이 있다.",
      "recommendation": "AuditAction enum cascade를 완료하고 credential hash는 raw secret 유추가 불가능한 secret-manager fingerprint 또는 HMAC 기반 non-reversible fingerprint로 제한하라."
    },
    {
      "id": "CS1-17",
      "severity": "major",
      "category": "미결정 분류",
      "location": "docs/features/crm-sync.md:452-464",
      "issue": "CS-01, CS-02, CS-12, CS-13은 본문에서 이미 v1.0 fail 또는 v1.x로 결정된 항목인데 미결정으로 남아 있다.",
      "impact": "비평 사이클 이후 수용/해소 추적이 어렵고, 구현 범위가 흔들린다.",
      "recommendation": "미결정 표를 `open`, `deferred-v1.x`, `resolved-in-v1.0`로 분리하라. CS-01/12/13은 resolved 또는 deferred로 이동하고 CS-02는 SLA 7일 확정 여부를 본문과 일치시켜라."
    },
    {
      "id": "CS1-18",
      "severity": "minor",
      "category": "공통 메타",
      "location": "docs/core/DATA_MODEL.md:93; docs/features/crm-sync.md:462, 498-499",
      "issue": "asset-ingestion의 `@provenanceAssetId` 같은 Core provenance 메타를 crm-sync에 바로 적용할지 여부가 정리되지 않았다. v1.0에서 CRM→Core 자동 promote는 CS-11 v1.x라 즉시 필수는 아니지만, 미래 cascade 경계는 명시해야 한다.",
      "impact": "v1.x에서 CRM-origin Core row가 생길 때 provenance 필드 설계가 뒤늦게 흔들릴 수 있다.",
      "recommendation": "v1.0은 Core row 생성 없음으로 명시하고, CS-11에서 `@provenanceCrmRecordId` 또는 공통 provenance union 도입 필요성을 후속 결정으로 추가하라."
    },
    {
      "id": "CS1-19",
      "severity": "minor",
      "category": "문서 품질",
      "location": "docs/features/crm-sync.md:1, 20, 59, 105, 472",
      "issue": "문서 출력에 `?`로 보이는 깨진 구분자가 다수 존재한다.",
      "impact": "의미 해석에는 큰 문제는 없지만 안정판 문서 품질 기준에는 맞지 않는다.",
      "recommendation": "인코딩/문자 치환을 정리하고 모든 `?` 잔재를 `—`, `→`, 또는 문장부호로 복구하라."
    },
    {
      "id": "CS1-20",
      "severity": "minor",
      "category": "권한 모델",
      "location": "docs/features/crm-sync.md:166-170, 176-179, 355-359",
      "issue": "raw PII detail live read, conflict resolution, integration registration 권한은 언급되지만 read API별 row-level access와 legal reviewer 접근 조건이 없다.",
      "impact": "운영자 UI에서 CRM live detail 조회가 과도하게 열릴 수 있다.",
      "recommendation": "queryCrmRecords/queryConflicts/detail live read별 권한과 audit action을 추가하라. PII live read는 최소 operator+super-admin 또는 별도 legal gate로 제한하라."
    },
    {
      "id": "CS1-21",
      "severity": "minor",
      "category": "테스트 가능성",
      "location": "docs/features/crm-sync.md:410-431",
      "issue": "build/runtime validation fail은 나열되어 있으나 fixture 기반 acceptance test 항목이 없다.",
      "impact": "v1.0 안정판에서 validator·webhook verifier·RRN deny 회귀를 자동 확인하기 어렵다.",
      "recommendation": "manifest validator, webhook signature/replay, RRN checksum deny, outbound-only command matrix, retry exhausted 전이에 대한 필수 테스트 케이스를 추가하라."
    }
  ],
  "required_next_actions": [
    "REVIEW_WORKFLOW와 DATA_MODEL cascade를 실제로 반영하거나, v0.1 문서에서 'cascade 필요' 상태를 명확히 blocker로 유지한다.",
    "v1.0 지원 범위를 provider 3종/entity 4종으로 좁히거나 korean-emr/appointment 계약을 완성한다.",
    "PII 원칙을 raw PII 저장 금지로 재정의하고 모든 로그·snapshot·outbox metadata에 redaction validator를 건다.",
    "webhook verifier/replay ledger, retry queue schema, rate-limit state, credential rotation state machine을 전개한다.",
    "ReservationPage/CTAConfig와 submission/event sync 대상의 경계를 다시 쓴다."
  ],
  "stability_assessment": {
    "SoT_alignment": "fail",
    "external_integration_reliability": "fail",
    "PII_medical_law_domain": "fail",
    "conflict_resolution": "partial",
    "operational_reliability": "partial",
    "spec_internal_consistency": "partial",
    "previous_feature_pattern_alignment": "partial"
  }
}

 succeeded in 740ms:
# Feature — crm-sync

> **상태**: Draft v0.2 (codex 자동 비평 1차 반영 — 21개 지적 전건 수용)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 11.1
> **목적**: 클라이언트 의료기관 CRM과 솔루션 사이의 양방향 데이터 동기화 — 예약 신청·문의·전환 이벤트·고객 컨택트. 솔루션 측은 **raw PII 저장 금지** (displayHints 마스킹만). webhook(실시간) + polling(배치).
> **연관 문서**:
> - 알림·audit → notifications + REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (cascade 완료 — 4종 NotificationEventType·4종 AuditAction)
> - 자격증명·식별자·policyVersion → DATA_MODEL C-08 v0.19 `crmSyncConfig`·`crmSyncPolicyVersion`
> - RRN checksum 알고리즘 재사용 → `features/asset-ingestion.md` § 9.1

---

## 0. 한 페이지 요약

- **Feature 식별자**: `crm-sync`
- **핵심 책임**: (a) 외부 CRM 양방향 sync(예약 신청·문의·전환 이벤트·고객 컨택트), (b) field-level mapping + authority, (c) webhook(실시간) + polling(배치), (d) 충돌 해결 (field-level CAS), (e) **raw PII 저장 금지** — 솔루션 DB에는 displayHints/derived hints만, (f) DPA·credential rotation·만료 알림
- **vs ReservationPage(C-20)** (CS1-02): C-20은 **예약 안내 콘텐츠 페이지**. 본 Feature는 **예약 신청(ReservationSubmission)·문의(Inquiry)·전환(ConversionEvent)** 운영 이벤트 sync. C-20 자체는 sync 대상 아님 (참조만)
- **provider 3종 (v1.0 한정 — CS1-03)**: `salesforce`·`hubspot`·`generic-rest-api`. `korean-emr`은 v1.x (CS-13 deferred)
- **운영 모드 2종**: `bi-directional`(양방향·기본)·`outbound-only`(솔루션→CRM 일방향)
- **sync entity 4종 (v1.0 — appointment v1.x)**: `reservation`(예약 신청)·`contact`(고객 컨택트)·`inquiry`(문의)·`conversion-event`(전환 이벤트)
- **PII 정책**: 솔루션 DB raw PII 저장 금지. minimalRetention=true 강제(v1.0). displayHints만 저장. raw detail은 CRM live read (no-cache)
- **RRN**: 솔루션 측 deny 강제 (v1.0 — CS1-06 resolved). asset-ingestion § 9.1 checksum 알고리즘 재사용
- **DB 인벤토리**: **10 tables** (모든 schema § 13 전개)

---

## 1. 일반 규약

### 1.1 변경 정책

| 변경 유형 | 패키지 SemVer | policyVersion | 동반 cascade |
|---|---|---|---|
| 입력/출력 인터페이스 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9·§ 10 |
| provider type 추가 | MINOR | 별개 | DATA_MODEL C-08 CrmSyncConfig enum + adapter contract + build validation |
| provider type 제거 | **MAJOR** | 별개 | |
| sync entity 추가 | MINOR | 별개 | CrmFieldMapping schema 영향 |
| sync entity 제거 | **MAJOR** | 별개 | |
| field mapping schema 변경 | **MAJOR** | policyVersion 신규 | 데이터 정합 영향 |
| 충돌 해결 알고리즘 변경 | **MAJOR** | policyVersion 신규 | |
| 알림 매트릭스 변경 | **MAJOR** | policyVersion 신규 | |
| 운영 모드 추가 | **MAJOR** | 별개 | |
| build/runtime/migration fail 룰 추가·강화 | **MAJOR** | 별개 | |
| runtime invariant·reconcile 룰 추가·강화 | MINOR | 별개 | |
| warning → fail 승격 | **MAJOR** | 별개 | |
| warning 룰 추가 | MINOR / PATCH | 별개 | |
| 지표 추가 | PATCH | 별개 | |

### 1.2 SoT 원칙

- 알림 발송·audit SoT는 notifications + REVIEW_WORKFLOW § 9.1.1·§ 10.2.1
- 자격증명·DPA·policyVersion SoT는 DATA_MODEL C-08 v0.19
- RRN checksum SoT는 `features/asset-ingestion.md` § 9.1 (재사용)
- 본 문서 = sync 파이프라인·field mapping·충돌 해결·PII·credential rotation·audit SoT + 내부 데이터 구조 SoT (§ 13)

### 1.2.1 공통 retry taxonomy

| 큐 | maxAttempts |
|---|---|
| CrmSyncRetryQueue | config(기본 5)·configurable |
| CrmSyncNotificationOutbox | 상수 5 |

### 1.3 본 문서가 다루지 않는 영역

- 알림 채널·재시도 — notifications
- 외부 CRM 운영·계약 — 클라이언트·CRM provider 책임
- Core 콘텐츠 변환 — asset-ingestion (CRM→Core auto promote는 v1.x — CS-11 deferred)
- 의료 진료 기록 보관 — CRM·EMR 측 책임 (RRN 등 솔루션 측 통과 금지)

---

## 2. Feature 정의

### 2.1 기본 메타

```yaml
name: "crm-sync"
specVersion: "0.2"
coreRequiresMin: "1.0.0"
implementationKind: "node-module"
activation: { scope: "instance", default: false }
```

### 2.2 의존성

| 영역 | 의존 |
|---|---|
| notifications | notify() 필수 |
| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 4종 NotificationEventType cascade 완료 |
| REVIEW_WORKFLOW § 10.2.1 | 4종 AuditAction cascade 완료 |
| DATA_MODEL C-08 v0.19 | `crmSyncConfig`·`crmSyncPolicyVersion` |
| DATA_MODEL CT-03·C-20 | CTAConfig·ReservationPage **참조만** (콘텐츠 페이지) |
| asset-ingestion § 9.1 | RRN checksum 알고리즘 재사용 |

### 2.3 InstanceManifest 통합

```yaml
crmSyncConfig:                                          # DATA_MODEL C-08 v0.19
  integrations:
    - id: "main-crm"
      provider: "salesforce"                            # CS1-03 — v1.0: salesforce·hubspot·generic-rest-api만
      apiKeySecretRef: "secretRef://CRM_SALESFORCE_OAUTH"
      apiUrl: "https://example.my.salesforce.com"
      webhookSecret: "secretRef://CRM_SALESFORCE_WEBHOOK_SECRET"
      credentialExpiresAt: "2027-01-01T00:00:00Z"
      legalApproved: true
      legalApprovedBy: "legal@glitzy.kr"
      legalApprovedAt: "2026-05-10T00:00:00Z"
      dpaEvidenceRef: "secretRef://CRM_DPA_CONTRACT_REF"  # CS1-12 — DPA 계약 증빙

crmSyncPolicyVersion: "cs-2026-05-14"

features:
  - name: "crm-sync"
    version: "0.2.0"
    enabled: true
    requiresFeature: [notifications]
    config:
      mode: "bi-directional"                            # bi-directional | outbound-only
      syncSchedule:
        pollIntervalMinutes: 15
        timezonePolicy: { missedRunCarryOverMaxDays: 7, dstNonexistentLocalTime: "next-valid", dstAmbiguousLocalTime: "first" }
      entities:                                          # CS1-09 — outbound-only 모드는 conflictResolution="outbound-only-no-conflict"만 허용
        reservation: { enabled: true, conflictResolution: "last-write-wins-by-timestamp" }
        contact: { enabled: true, conflictResolution: "crm-authoritative" }
        inquiry: { enabled: true, conflictResolution: "solution-authoritative" }
        conversionEvent: { enabled: true, conflictResolution: "outbound-only-no-conflict" }
        # appointment는 v1.x (CS-12 deferred). enabled=true 시 build fail
      fieldMappingPolicyVersion: "cs-fm-2026-05-14"
      webhookEndpoint:                                   # CS1-04 — verifier 인터페이스 § 4.2
        path: "/api/crm-sync/webhook/{integrationId}"
        timestampToleranceSeconds: 300
        nonceLedgerRetentionMinutes: 60                 # nonce/eventId ledger 보존
      retryQueue:
        maxAttempts: 5
        backoffSeconds: [60, 300, 1800, 7200, 21600]
        workerPollIntervalSeconds: 30
      credentialRotation:                                # CS1-10
        warnDaysBeforeExpiry: 14
        autoNotifyEnabled: true
        rotationGracePeriodMinutes: 30                  # 이전 credential 병행 허용 시간
      rateLimit:                                         # CS1-11
        bucketBackend: "redis-token-bucket"
        salesforce: { tokensPerHour: 1000, burst: 200 }
        hubspot: { tokensPer10sec: 100, burst: 20 }
        genericRestApi: { tokensPerHour: 500, burst: 100 }
        retryAfterRespected: true
      pii:                                               # CS1-05 강화
        rawPiiStorageAllowed: false                     # v1.0 강제 false (raw PII 저장 금지)
        displayHintsRetentionDays: 30                   # displayHints 보존 (마스킹된 표시값)
        ssnRrnHandling: "deny"                          # CS1-06 — v1.0 강제 deny
        liveReadRequiresAudit: true                     # raw detail 조회 시 audit 필수
      retentionDays:
        syncLog: 730
        changeLog: 1095
        conflictRecord: 1095
        webhookNonceLedger: 1                           # 1일 (timestampToleranceSeconds + 여유)
      externalMonitoringSink: { provider: "sentry", dsnSecretRef: "secretRef://MONITORING_DSN" }
```

---

## 3. 입력·출력

### 3.1 엔트리포인트 + read API + 운영 command (CS1-09·20 권한 명시)

| 종류 | 함수 | 책임 | 권한 | mode 제약 |
|---|---|---|---|---|
| 실행 command | `runSync(input)` | sync cycle | operator·super-admin | outbound-only 모드는 direction="outbound"만 허용 |
| 실행 command | `processInboundWebhook` | webhook 수신 | system (HTTP endpoint) | outbound-only 모드는 endpoint 비활성 (HTTP 404) |
| 실행 command | `pushOutbound(entity, recordId, operation)` | 솔루션 → CRM 즉시 push | operator·super-admin (system 자동 호출 가능 — 폼 제출 시) | 모든 mode 가능 |
| 실행 command | `resolveConflict(conflictId, resolution)` | 충돌 해결 | operator·super-admin. legal 검수자 read-only | outbound-only 모드는 충돌 없음 — 호출 불가 |
| 실행 command | `liveReadCrmDetail(crmRecordId)` | CRM live PII detail 조회 (no-cache·audit 기록) | **operator·super-admin·legal-reviewer** (CS1-20). audit `crm-live-read` 자동 기록 (v1.x audit cascade — CS-14 신규) |
| read API | `queryCrmRecords` | 어드민 — **displayHints만** | operator·super-admin·legal-reviewer (raw PII 미반환) |
| read API | `queryConflicts` | 충돌 큐 | operator·super-admin |
| 운영 command | `registerIntegration` | super-admin | |
| 운영 command | `unregisterIntegration` | soft delete | super-admin | |
| 운영 command | `rotateCredential` | 자격증명 rotation 상태 머신 (§ 4.5) | super-admin | |

### 3.1.1 audit log contract

| AuditAction | contentRef | metadata | 권한 |
|---|---|---|---|
| `crm-integration-registered` | `"crm-integration:" + integrationId` | provider·apiUrl·legalApprovedBy·dpaEvidenceRefHash(SHA-256 8자) | super-admin |
| `crm-integration-unregistered` | `"crm-integration:" + integrationId` | activeBefore·activeAfter·unregisteredBy | super-admin |
| `crm-sync-conflict-resolved` | `"crm-conflict:" + conflictId` | resolution·winningSide·resolvedBy·entityType·appliedVersion | operator·super-admin |
| `crm-credential-rotated` | `"crm-integration:" + integrationId` | rotatedBy·priorCredentialFingerprint·newCredentialFingerprint | super-admin |

**credential fingerprint** (CS1-16): `HMAC-SHA256(secret-manager-key-id, "crm-credential-fingerprint")` 8자 prefix — raw secret 유추 불가능한 non-reversible fingerprint

### 3.2 sync entity 정의 (CS1-02 — 콘텐츠 vs 운영 이벤트 분리)

본 Feature가 다루는 **운영 이벤트**(CONTENT_STANDARDS 후속 cascade 영역 — CS-15 신규):

```ts
type ReservationSubmission = {
  submissionId: string;          // 솔루션 측 식별자
  reservationPageRef: Ref<C-20>; // 어떤 ReservationPage(콘텐츠)에서 제출됐는지
  ctaConfigRef?: Ref<CT-03>;     // 어떤 CTAConfig 채널
  source?: string;               // 마케팅 출처
  campaign?: string;
  submittedAt: Date;
  piiHash?: string;              // 솔루션 측 저장은 hash·displayHints만 (raw PII는 CRM)
  displayHints: { nameInitial?: string; phoneLast4?: string; emailDomain?: string };
  crmExternalId?: string;        // sync 완료 후 채움
};

type Contact = { /* CRM 측 식별자만 보유. displayHints */ };
type Inquiry = { /* 동일 */ };
type ConversionEvent = { /* CRM 일방향 push. PII 없음 */ };
```

### 3.3 RunSyncInput·Result

v0.1 § 3.3 유지 + outbound-only mode 시 `direction="outbound"` 강제 (CS1-09).

### 3.4 webhook 처리 (CS1-04 강화)

```ts
async function processInboundWebhook(integrationId: string, headers: Record<string,string>, rawBody: Buffer): Promise<{
  status: "accepted" | "rejected-signature" | "rejected-replay" | "rejected-credential-expired" | "rejected-rrn-detected" | "queued";
  recordsProcessed: number;
  conflicts: number;
}>;
```

- **rawBody 그대로 verifier 호출** — JSON 재직렬화 금지 (signature mismatch 회피)
- **ProviderWebhookVerifier 인터페이스**: provider별 어댑터가 (rawBody, headers, fullUrl, method, timestamp, providerEventId) → 검증 결과
- **nonce ledger** (CS1-04): `CrmWebhookNonceLedger` 테이블 — `(integrationId, providerEventId)` UNIQUE. 동일 eventId 재발신은 deduped 처리 (HTTP 200 + "already-processed")

---

## 4. sync 파이프라인

### 4.1 outbound (솔루션 → CRM)

v0.1 § 4.1 유지 + 추가:
- `pushOutbound` 입력 payload에 raw PII가 포함되어 있으면 즉시 hash → solution DB는 displayHints만 저장. CRM API 호출 페이로드에 raw PII 직접 전달 (cache 없이 transient)
- conversionEvent는 PII 없음 — raw PII 검사 skip

### 4.2 inbound (CRM → 솔루션) + ProviderWebhookVerifier (CS1-04)

```
1. CRM이 endpoint POST → processInboundWebhook
2. rawBody 그대로 ProviderWebhookVerifier.verify(rawBody, headers, fullUrl, method) 호출
   - provider별 구현 (Salesforce HMAC-SHA256·HubSpot v3 signature·generic-rest-api custom)
   - 실패 → HTTP 401 + status="rejected-signature"
3. timestamp tolerance 검증 — `headers.timestamp ∈ now ± timestampToleranceSeconds` 아니면 rejected-replay
4. **CrmWebhookNonceLedger insert** — `(integrationId, providerEventId)` UNIQUE
   - 중복 → HTTP 200 + status="queued" (idempotent. 이미 처리됨)
5. **RRN 검사 (CS1-06)**: rawBody 전체에 asset-ingestion § 9.1 RRN checksum 알고리즘 적용
   - RRN 검출 시 → **payload 폐기** (CrmRecord 미생성). CrmWebhookNonceLedger에 `rrnDetected=true` 마킹 + hashed fingerprint(non-reversible)만 보존 + 외부 sink alert + status="rejected-rrn-detected"
6. payload 파싱 + CrmFieldMapping 역방향 적용 (raw PII는 hash + displayHints로 변환)
7. **field-level 충돌 감지** (§ 4.3)
8. 충돌 없음 → CrmRecord update + CrmRecordChangeLog (PII 마스킹된 changedFields)
9. 충돌 있음 → CrmConflictRecord 생성 → operator 큐
```

### 4.3 field-level 충돌 해결 (CS1-07 강화)

각 CrmFieldMapping에 `authority` 필드:

```ts
type FieldAuthority =
  | "crm-authoritative"           // 항상 CRM 측 우선
  | "solution-authoritative"      // 항상 솔루션 측 우선
  | "last-write-wins-timestamp"   // provider timestamp 기반
  | "last-write-wins-version";    // CAS 기반 version 비교
```

**last-write-wins-timestamp** 정확화:
- provider timestamp 신뢰성 검증: webhook payload timestamp는 provider 측 시각. 솔루션 측 update는 신뢰 가능한 wall-clock
- clock skew tolerance: ±5초. 5초 이내 동일 timestamp는 tie → tie-breaker로 `crmVersion·solutionVersion` 비교
- 모든 비교 실패 시 → `manual` 정책으로 escalate (CrmConflictRecord)

**last-write-wins-version (CAS)**:
- CrmRecord.crmVersion·solutionVersion 비교. 더 높은 version 승리
- version mismatch (예: 솔루션 측 update가 CrmRecord.solutionVersion 갱신 전 발생) → manual

**manual 해결 후**: `resolveConflict(conflictId, resolution)` 시 `appliedVersion` 저장 — 동일 충돌 재발 방지 (CrmRecord.lastAppliedConflictVersion 갱신)

### 4.4 retry queue·rate limit (CS1-08·11 schema 전개)

§ 13.4 CrmSyncRetryQueue·§ 13.10 CrmRateLimitState 풀 schema. worker SoT SQL은 search-visibility § 13.5 패턴 동일.

### 4.5 credential rotation 상태 머신 (CS1-10)

```
state: stable → rotating → committed (성공) → stable
       stable → rotating → reverted (실패) → stable

rotateCredential(integrationId, newSecretRef):
1. rotating 상태 진입 — old credential은 rotationGracePeriodMinutes(기본 30분) 동안 fallback으로 유지
2. 새 credential로 health check API 호출
3. 성공 → committed: CrmCredentialAuditLog `rotated` 기록. old credential은 secret manager에서 revoke (또는 grace 후 자동)
4. 실패 → reverted: 새 secretRef 폐기. CrmCredentialAuditLog `rotation-failed` 기록 + sink alert. 운영자 재시도 필요
```

---

## 5. provider 어댑터 (v1.0 — 3종)

### 5.1 Salesforce
- OAuth 2.0 + Web Server Flow. refresh token rotation 자동
- webhook: Outbound Messages (XML SOAP) 또는 Platform Events (CometD/Streaming API)
- 서명: HMAC-SHA256 (configurable webhook secret)

### 5.2 HubSpot
- Private App Token (long-lived)
- webhook: X-HubSpot-Signature-v3 (HMAC-SHA256 with secret + timestamp + body)
- rate limit: 100 requests/10s per account

### 5.3 generic-rest-api
- 인증: Bearer Token / API Key (config로 선택)
- webhook: 사용자 지정 endpoint·서명 알고리즘 (config로 정의)

### 5.4 korean-emr (v1.x — CS-13 deferred)
- v1.0 build fail (`provider="korean-emr"` 사용 시)

---

## 6. 알림 (outbox 패턴 — CS1-15 정렬)

### 6.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 cascade 완료 — 4종)

**canonical SoT는 REVIEW_WORKFLOW § 9.1.1**. 본 절은 매트릭스 행 인용·매핑만:

| eventType | criticality | 즉시 채널 | recipients |
|---|---|---|---|
| `crm-sync-batch-failed` | high | email + inApp | operator |
| `crm-sync-conflict-detected` | high | email + inApp | operator |
| `crm-sync-credential-expired` | **critical** | email + inApp | operator + super-admin |
| `crm-sync-credential-expiring-soon` | high | email + inApp | operator + super-admin |

### 6.2 outbox 패턴 — search-visibility § 7.2 SQL 동일

### 6.3 NotificationEvent 매핑

| eventType | sourceKind | sourceId | contentRef | contentTitle |
|---|---|---|---|---|
| `crm-sync-batch-failed` | `sync-log` | syncLogId | `"sync-log:" + syncLogId` | `"CRM sync 실패 — ${integrationId}"` |
| `crm-sync-conflict-detected` | `conflict` | conflictId | `"crm-conflict:" + conflictId` | `"CRM 충돌 — ${entity}/${crmExternalId}"` |
| `crm-sync-credential-expired` | `integration` | integrationId | `"crm-integration:" + integrationId` | `"자격증명 만료 — ${integrationId}"` |
| `crm-sync-credential-expiring-soon` | `integration` | integrationId | 동일 | `"만료 임박 — ${expiresAt}"` |

`sourceEventId = hash("crm-sync:" + sourceKind + ":" + sourceId + ":" + eventType)`.

---

## 7. PII 처리 (CS1-05·06 강화 — 의료법·개인정보보호법)

### 7.1 raw PII 저장 금지 (v1.0 강제)

- `pii.rawPiiStorageAllowed=false` 강제 (v1.0 build fail if true)
- **솔루션 DB에는 displayHints/derived hints만**:
  - 이름 → `nameInitial` (예: "홍O동")
  - 전화 → `phoneLast4` (예: "1234")
  - email → `emailDomain` (예: "@example.com")
  - 주소 → `cityName` 만
- **CrmRecord·CrmRecordChangeLog·CrmConflictRecord 모든 snapshot/changedFields에 raw PII 저장 금지** — PII Redaction Validator가 schema 검증 시 강제
- raw detail 조회 — `liveReadCrmDetail(crmRecordId)`로 CRM API 실시간 호출 (no-cache·audit)

### 7.2 RRN deny (CS-01 resolved — v1.0 강제)

- `pii.ssnRrnHandling="deny"` 강제 (build fail if other value)
- asset-ingestion § 9.1 RRN checksum 알고리즘 재사용:
  - 후보 추출: `\b\d{6}-?[1-8]\d{6}\b`
  - 생년월일·성별 코드 유효성
  - checksum: 가중치 `[2,3,4,5,6,7,8,9,2,3,4,5]` + `(11-(sum%11))%10`
- 검증 통과 RRN 감지 시:
  - inbound webhook → payload 폐기. CrmRecord 미생성. status="rejected-rrn-detected"
  - outbound push → push 차단. solution 측 입력 거부
  - CrmWebhookNonceLedger 또는 CrmRecordChangeLog에 `rrnDetected=true` + `rrnFingerprint`(non-reversible HMAC) 보존 — 운영 감사용·raw RRN 보존 금지

### 7.3 DPA vs patient consent 분리 (CS1-12)

- `dpaEvidenceRef` (DATA_MODEL C-08 — required): 의료기관 ↔ Glitzy 데이터 처리 위탁 계약 증빙
- `patientConsentEvidenceRef` (v1.x — CS-07 deferred): 환자 단위 동의 증빙. v1.0은 record-level 미저장
- v1.0 운영: DPA 게이트 통과 + raw PII는 CRM 측 책임 (Glitzy 솔루션은 통과 안 함)

---

## 8. 운영 지표 (CS1-21 acceptance test 추가)

### 8.1 핵심 지표

| 지표 | 정의 | 목표 |
|---|---|---|
| sync 성공율 | success / 전체 | > 99% |
| outbound push 지연 | < 5초 (p95) | |
| inbound webhook 지연 | < 10초 (p95) | |
| 충돌 발생율 | < 1% (baseline 후) | |
| credential 만료 알림 SLA | 7일 내 처리 | > 95% |
| RRN deny 발생율 | (baseline) | (운영 누적) |
| webhook signature reject율 | (보안 감사) | < 0.1% |
| nonce ledger dedupe 적중률 | (재전송 빈도 추적) | baseline |
| outbox 발송 성공율 | > 99% | |

### 8.2 acceptance test fixture (CS1-21)

v1.0 안정판 회귀 방지용 필수 테스트 케이스:
- manifest validator: legalApproved=false build fail, korean-emr build fail, appointment enabled build fail
- webhook verifier: provider별 valid/invalid signature·rawBody integrity·replay window
- RRN deny: regex+checksum+payload 폐기·fingerprint 보존
- outbound-only mode: inbound runSync/processInboundWebhook 차단
- retry exhausted: maxAttempts 도달 → failed-permanent + sink alert
- credential rotation: rotating → committed/reverted 두 경로

---

## 9. 설치·설정 — v0.1 § 9 유지 + DB 10 tables

---

## 10. 빌드·런타임·migration·invariant 검증

### 10.1 build-time fail

- `enabled=true` + `crmSyncConfig` 또는 `integrations[]` 빈 배열
- `crmSyncPolicyVersion` 누락 또는 패키지 보관 버전 불일치
- integration `legalApproved !== true` 또는 승인자/시각 누락
- **integration `dpaEvidenceRef` 누락** (CS1-12)
- integration `apiKeySecretRef`·`apiUrl` 누락
- bi-directional mode + integration `webhookSecret` 누락
- **integration `provider="korean-emr"` 또는 `provider="salesforce"·"hubspot"·"generic-rest-api"` 외** (CS1-03)
- `requiresFeature: notifications` 충족 안 됨
- **`pii.rawPiiStorageAllowed=true`** (CS1-05 — v1.0 강제 false)
- **`pii.ssnRrnHandling !== "deny"`** (CS1-06 — v1.0 강제 deny)
- `entities.*` 모두 disabled
- `entities.appointment.enabled=true` (CS-12 deferred — v1.0 미지원)
- `entities.<other>.conflictResolution`이 **`mode="outbound-only"` + `outbound-only-no-conflict` 외**(CS1-09)
- `fieldMappingPolicyVersion` 누락

### 10.2 runtime validation fail

- `forceRefresh=true` + `refreshIntentId` 누락
- webhook signature 검증 실패 → HTTP 401 rejected-signature
- replay window 초과 → rejected-replay
- nonce ledger 중복 (이미 처리됨) → HTTP 200 idempotent (fail 아님)
- credential 만료 후 sync 시도 → skipped-credential-expired
- **inbound payload RRN 검출** (CS1-06) → 폐기 + sink alert
- **outbound push payload RRN 검출** → 차단 + 운영자 alert
- `resolveConflict` 시 conflictId가 이미 resolved
- **mode="outbound-only" + processInboundWebhook 호출** → HTTP 404 (CS1-09)
- **mode="outbound-only" + runSync direction="inbound"/"both"** → runtime fail (CS1-09)

### 10.3 migration-time validation

- 신규 인스턴스 v0.2 적용 — 이전 데이터 없음
- 기존 인스턴스 — v0.2 cascade 신규 (v0.1 운영 데이터 부재 전제)

### 10.4 runtime invariant·reconcile

- CrmSyncRetryQueue stale processing (lockedAt > 10분) → reconcile
- CrmConflictRecord open + slaDeadline 초과 → operator 추가 알림 (SLA 미달)
- credential expiry 도래 (`warnDaysBeforeExpiry` 14일) → `crm-sync-credential-expiring-soon` 자동 발송
- credential 만료 → `crm-sync-credential-expired` + integration 자동 비활성화
- **PII Redaction Validator drift 감지** (raw PII가 schema 미통과로 row insert됨) → 즉시 sink alert + 운영자 수동 정리

### 10.5 warning

- integration `credentialExpiresAt` null
- `pollIntervalMinutes` > 60 (실시간성 저하)
- conflict open ≥ 5건 누적

---

## 11. 미결정 사항 (CS1-17 — 3분류)

### 11.1 open (v1.x·M2+ 후속)

| ID | 항목 | 비고 |
|---|---|---|
| CS-02 | 양방향 sync 충돌 SLA·escalation 운영 정책 | 운영 정책 |
| CS-03 | 다중 CRM 통합 시 우선순위 | 운영 정책 |
| CS-04 | webhook endpoint 보안 (IP allowlist) | 인프라 결정 |
| CS-05 | OAuth refresh token rotation 자동화 정밀화 | 인프라 결정 |
| CS-06 | provider별 quota 운영 가이드 | M2+ |
| CS-08 | LLM 기반 field auto-mapping | v1.x |
| CS-09 | CrmFieldMapping bulk import/export (CSV) | M2+ |
| CS-10 | webhook 실패 시 polling fallback 자동 격상 | 운영 정책 |
| CS-14 | `crm-live-read` audit cascade (raw PII live 조회 추적) | v1.x patch — REVIEW_WORKFLOW § 10.2.1 후속 cascade |
| CS-15 | CONTENT_STANDARDS submission/event 인터페이스 cascade | CONTENT_STANDARDS 후속 |

### 11.2 deferred-v1.x

| ID | 항목 | 비고 |
|---|---|---|
| CS-07 | 환자 동의 철회 처리 (patientConsentEvidenceRef·right to erasure) | v1.x |
| CS-11 | CRM → Core 자동 promote (예: ReservationSubmission → 어드민 콘텐츠) | v1.x. `@provenanceCrmRecordId` 같은 공통 메타 cascade 필요 (CS1-18) |
| CS-12 | `appointment` entity 지원 | v1.x |
| CS-13 | `korean-emr` provider 어댑터 | v1.x |

### 11.3 resolved-in-v1.0

| ID | 항목 | 해소 |
|---|---|---|
| ~~CS-01~~ | RRN deny 정책 | v0.2 — build fail + asset-ingestion checksum 재사용 |

---

## 12. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 |
| 2026-05-14 | **v0.2** | **codex 자동 비평 1차 반영 (21 지적 전건 수용)**: (1) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 4종 NotificationEventType + 매트릭스 4행 (CS1-01), (2) **REVIEW_WORKFLOW § 10.2.1 cascade** — 4종 AuditAction (CS1-01·16), (3) **DATA_MODEL C-08 v0.19 cascade** — CrmSyncConfig·CrmIntegrationEntry 신설·crmSyncPolicyVersion·DPA/consent 분리 (CS1-01·12), (4) **ReservationPage·CTAConfig 경계 정리** — 콘텐츠 페이지는 참조만. sync 대상은 ReservationSubmission·Inquiry·ConversionEvent 운영 이벤트 (CS1-02·15 신규 CONTENT_STANDARDS cascade), (5) **provider 3종 한정** — salesforce·hubspot·generic-rest-api. korean-emr build fail·CS-13 deferred (CS1-03), (6) **webhook ProviderWebhookVerifier 인터페이스 + rawBody·nonce ledger** — CrmWebhookNonceLedger 신설 (CS1-04), (7) **raw PII 저장 금지 강제** — rawPiiStorageAllowed=false build fail. displayHints만. PII Redaction Validator (CS1-05), (8) **RRN deny v1.0 build fail** + asset-ingestion checksum 재사용. CS-01 resolved (CS1-06), (9) **field-level authority + CAS 충돌 해결** — FieldAuthority enum. clock skew·tie-breaker·appliedVersion (CS1-07), (10) **retry queue·outbox schema 풀 전개** § 13 (CS1-08), (11) **outbound-only command matrix** — inbound runSync/processInboundWebhook 차단 (CS1-09), (12) **credential rotation 상태 머신** — stable·rotating·committed·reverted + grace period (CS1-10), (13) **CrmRateLimitState 신설** — provider별 quota·resetAt·nextAllowedAt (CS1-11), (14) **DPA vs patient consent 분리** — dpaEvidenceRef·patientConsentEvidenceRef. v1.0은 record-level 미저장 (CS1-12, CS-07 deferred), (15) **§ 13 모든 10 tables 풀 schema 전개** (CS1-13), (16) **retention expiresAt 필드 추가** — syncLog·conflictRecord 등 (CS1-14), (17) **§ 6.1 매트릭스는 REVIEW_WORKFLOW SoT 행 인용만**으로 표시 (CS1-15), (18) **credential fingerprint non-reversible HMAC-SHA256** (CS1-16), (19) **미결정 3분류** — open/deferred-v1.x/resolved-in-v1.0 (CS1-17), (20) **CS-18 — @provenanceCrmRecordId v1.x 명시** (CS1-18), (21) **`?` 깨진 문자 정정** + read API/live read 권한 매트릭스 + acceptance test fixture (CS1-19·20·21)

---

## 13. 본 Feature 내부 데이터 구조 (admin DB 10 tables)

### 13.1 `CrmIntegration`

§ 3.2 shape. partial unique `(instanceId, provider, configHash) WHERE active=true`.

### 13.2 `CrmSyncLog` (envelope)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `idempotencyKey` | string | ✅ |
| `instanceId` | Slug | ✅ |
| `mode` | enum (scheduled·on-demand) | ✅ |
| `direction` | enum (inbound·outbound·both) | ✅ |
| `manifestVersion` | string | ✅ |
| `forceRefresh` | boolean | ✅ |
| `refreshIntentId` | string | optional |
| `windowStart`·`windowEnd` | Date | optional |
| `startedAt` | Date | ✅ |
| `completedAt` | Date | optional |
| `envelopeState` | enum | ✅ |
| `expiresAt` | Date | ✅ — retentionDays.syncLog |

**Constraints**: `UNIQUE(instanceId, idempotencyKey)`.
**Index**: `(expiresAt)` — purge worker.

### 13.3 `CrmSyncSourceAttempt` (per-integration per-entity 결과)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `syncLogId` | UUID | ✅ — FK |
| `integrationId` | UUID | ✅ |
| `entity` | SyncEntity | ✅ |
| `direction` | enum | ✅ |
| `attemptNumber` | integer | ✅ |
| `status` | enum (processing·success·partial·failed-credential·failed-quota·failed-transient·failed-permanent·skipped-disabled·skipped-rate-limit·skipped-credential-expired·in-retry-queue) | ✅ |
| `recordsInbound`·`recordsOutbound`·`conflictsDetected` | integer | ✅ |
| `error` | string | optional |
| `startedAt`·`completedAt` | Date | ✅·optional |

**Constraints**: `UNIQUE(syncLogId, integrationId, entity, direction, attemptNumber)`. `FK syncLogId ON DELETE RESTRICT`.

### 13.4 `CrmSyncRetryQueue`

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `syncLogId` | UUID | ✅ — FK |
| `integrationId`·`entity`·`direction` | various | ✅ |
| `attemptNumber` | integer | ✅ |
| `status` | enum (pending·processing·completed·exhausted) | ✅ |
| `nextAttemptAt` | Date | ✅ |
| `lockedAt`·`lockedBy` | Date·string | optional |
| `lastError`·`lastErrorClass` | string | optional |

**worker SoT 쿼리**: search-visibility § 13.5 패턴 동일 (SKIP LOCKED·advisory lock·exhausted 전이).

### 13.5 `CrmRecord` (PII 마스킹된 cache·상태 추적)

v0.1 § 13.4 유지 + 다음 추가:
- `solutionVersion`·`crmVersion`·`lastAppliedConflictVersion` integer — CAS 입력 (CS1-07)
- **`displayHints` JSON ✅** — 마스킹된 표시값 (`{nameInitial, phoneLast4, emailDomain, cityName}`)
- raw PII 필드 절대 금지 (PII Redaction Validator 강제 — CS1-05)

**Constraints**: `UNIQUE(instanceId, integrationId, entity, crmExternalId)`.
**Index**: `(instanceId, entity, lastSyncedAt DESC)`, `(piiRetentionExpiresAt)` — masking worker가 displayHints 만료된 row를 어떻게 처리할지는 운영 정책. v1.0은 raw PII 자체가 없으므로 masking 별도 작업 없음 — 정책 review (CS-16 신규 신설 영역)

### 13.6 `CrmRecordChangeLog`

v0.1 § 13.5 유지 + `changedFields`는 PII Redaction Validator 통과 (raw PII 금지). `expiresAt` ✅.

### 13.7 `CrmFieldMapping` (CS1-07 — authority 추가)

v0.1 § 13.6 + `authority: FieldAuthority enum` ✅.

### 13.8 `CrmConflictRecord` (CS1-07·14 — appliedVersion·expiresAt)

v0.1 § 13.7 + `appliedVersion: integer` optional (resolved 시 채움) + `expiresAt` ✅.

### 13.9 `CrmCredentialAuditLog`

v0.1 § 13.8 유지 + `priorCredentialFingerprint`·`newCredentialFingerprint` — HMAC-SHA256 non-reversible (CS1-16).

### 13.10 `CrmRateLimitState` (CS1-11 신설) + `CrmWebhookNonceLedger` (CS1-04 신설)

**`CrmRateLimitState`** (provider별 quota 추적):
| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `bucketKey` | string | ✅ — `crm:quota:{integrationId}:{provider}` |
| `tokensRemaining` | number | ✅ |
| `quotaResetAt` | Date | ✅ |
| `nextAllowedAt` | Date | optional — 429 Retry-After 적용 시 |
| `updatedAt` | Date | ✅ |

**Constraints**: `UNIQUE(bucketKey)`.

**`CrmWebhookNonceLedger`** (replay 방지):
| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `integrationId` | UUID | ✅ — FK |
| `providerEventId` | string | ✅ |
| `signatureDigest` | string | ✅ — payload signature SHA-256 |
| `receivedAt` | Date | ✅ |
| `rrnDetected` | boolean | ✅ |
| `rrnFingerprint` | string | optional — RRN 감지 시 HMAC non-reversible |
| `expiresAt` | Date | ✅ — retentionDays.webhookNonceLedger |

**Constraints**: `UNIQUE(integrationId, providerEventId)`.
**Index**: `(expiresAt)`.

### 13.11 `CrmSyncNotificationOutbox` (CS1-15)

search-visibility § 13.10·keyword-monitoring § 13.7 패턴 동일. `UNIQUE(sourceKind, sourceId, eventType)`.

---


 succeeded in 758ms:
# Core — 데이터 계약 명세

> **상태**: Draft v0.19
> **작성일**: 2026-05-14 (v0.18 → v0.19 — `features/crm-sync.md` 1차 사이클 cascade: C-08 `crmSyncConfig`(CrmSyncConfig·CrmIntegrationEntry 신설 — provider salesforce·hubspot·generic-rest-api 3종 한정·korean-emr build fail·dpaEvidenceRef vs patientConsentEvidenceRef 분리) + `crmSyncPolicyVersion`)
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

> 동작 옵션(`mode`·`syncSchedule`·`entities`·`fieldMappingPolicyVersion`·`retryQueue`·`credentialRotation`·`pii`·`retentionDays` 등)은 `features[name="crm-sync"].config` SoT (`features/crm-sync.md` § 2.3).

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
| 2026-05-14 | v0.18 | **`features/asset-ingestion.md` 1차 사이클 cascade**: (1) **C-08 `assetIngestionConfig` 신설** (AssetIngestionConfig — sources webCrawl/snsApi/manualUpload/csvImport), (2) **C-08 `assetIngestionPolicyVersion`** (6 Feature policyVersion 동일 패턴), (3) **`AssetIngestionApprovedScope` 신규** — SerpCrawlerApprovedScope의 SERP 특화 필드 제거·자산 수집 특화(allowedDomains·allowedPathPrefixes·maxPagesPerCrawl·maxAssetSizeMb·artifactRetentionDaysMax) |
| 2026-05-14 | v0.17 | **`features/keyword-monitoring.md` 1차 사이클 cascade**: (1) **C-08 `keywordMonitoringConfig` 신설** (KeywordMonitoringConfig — search-visibility의 SerpCrawlerApprovedScope 게이트 패턴 재사용), (2) **C-08 `keywordMonitoringPolicyVersion`** (top-level, 4 Feature policyVersion 동일 패턴) |
| 2026-05-14 | v0.16 | **`features/search-visibility.md` 1차 사이클 cascade**: (1) **C-08 `searchVisibilityConfig` 신설** (SearchVisibilityConfig — serpCrawler/backlinkSource, serpCrawler.enabled=true + legalApproved 게이트 fail-gate), (2) **C-08 `searchVisibilityPolicyVersion`** (top-level, notifications·analytics 패턴 동일) |
| 2026-05-14 | v0.15 | **`features/analytics-reporting.md` 4차 사이클 cascade**: (1) **C-08 `analyticsPolicyVersion` 신설** — notifications policyVersion 패턴 동일 (필수, 패키지 병렬 보관), (2) **C-10 `mediaThresholdOperationalInput` 슬롯 분리** — rolling-90 operational snapshot은 본 슬롯, calendar 확정 판정은 `mediaThresholdAssessment` 슬롯. published record는 calendar 값만 (AR4-08) |
| 2026-05-14 | v0.14 | **`features/analytics-reporting.md` 1차 사이클 cascade**: (1) **C-08 `analyticsConfig` 신설** — `AnalyticsConfig`(sources.gsc·naverSearchAdvisor·ga4·rum 자격증명·사이트 식별자만, 동작 옵션은 `features.analytics-reporting.config`로 분리), (2) **C-10 `mediaThresholdAssessment` 슬롯** — `MediaThresholdAssessment` 신설(assessmentBasisDate·windowStart/End·rollingAverageDailyUsers·thresholdReached·primarySource·sourceCompleteness·timezone·calendarPolicy·botFilteringPolicy·legalBasisNote). priorReviewRequired 산정 근거. ComplianceRecord 발행 시 snapshot으로 고정 |
| 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `AdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`eligibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·digestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IANATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |


 succeeded in 774ms:
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
  | "crm-sync-credential-expiring-soon";      // 만료 14일 전
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
  | "crm-credential-rotated";                 // 자격증명 rotation
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


codex
대상 v0.2는 1차 지적 상당수를 문서 표면에는 반영했지만, 몇몇은 SoT 실제 반영 여부와 운영 가능성에서 다시 갈라지는 지점이 보입니다. 이제 asset/search/keyword/medical 쪽 패턴을 확인해 재발·신규 결함을 분리하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"AssetPromotionRecord|state:|RRN|checksum|§ 9\\.1|promotion|promoted|reverted|NotificationOutbox|UNIQUE\\(sourceKind|SKIP LOCKED|expiresAt|@provenance\" docs/features/asset-ingestion.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"outbox|NotificationOutbox|UNIQUE\\(sourceKind|SKIP LOCKED|advisory|expiresAt|sourceEventId|retry\" docs/features/search-visibility.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"outbox|NotificationOutbox|UNIQUE\\(sourceKind|SKIP LOCKED|advisory|expiresAt|sourceEventId|retry\" docs/features/keyword-monitoring.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "RRN|주민|개인정보|PII|consent|동의|audit|live" docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md' in C:\Users\assag\solution\website-exposure
 succeeded in 650ms:
7:> **목적**: 사이트 전체·페이지별 검색 가시성 모니터링 (노출 추세·AI 브리핑 인용·통합 영역 진입·외부 백링크 변동). 신호별 detector + state transition + 이상 감지·outbox 알림. 자체 SERP 크롤링은 법무 승인 게이트(approvedScope 구조화) 필수.
15:- **핵심 책임**: source 3종 모니터링·신호별 detector·state transition·이상 감지·outbox 알림·대시보드 read API
20:- **DB 인벤토리**: **9 tables** — VisibilitySignalSnapshot·MonitoringLog·MonitoringSourceAttempt·**SearchVisibilityCollectionRetryQueue**·AnomalyRecord·VisibilityState·SerpCrawlerArtifact·BacklinkSnapshot·AnomalyNotificationOutbox
48:- 본 문서 = 신호 정의·detector·state·이상 감지·outbox 알림 SoT + 내부 데이터 구조 SoT (§ 13)
50:### 1.2.1 공통 retry taxonomy (SV2-15 신설)
52:본 Feature는 2종 retry 구조 — SearchVisibilityCollectionRetryQueue (source 수집)·AnomalyNotificationOutbox (알림 발송). 공통 의미:
59:| `*-retryable` | attempts < maxAttempts 시 자동 재시도 대상 |
67:| AnomalyNotificationOutbox | **상수 5** — 운영 단순성 |
226:| 실행 command | `detectAnomalies(input)` | 이상 감지 + outbox enqueue (alerting 모드) |
235:- `processing` / `success` / `partial` / `failed-credential` / `failed-quota` / `failed-transient` / `failed-permanent` / `skipped-disabled` / `skipped-rate-limit` / **`skipped-legal-out-of-scope`** (SV2-02 — approvedScope 밖 호출) / **`skipped-baseline-warmup`** (SV2-20) / `skipped-degraded` / `in-retry-queue`
338:- `transitionAlertOnBucketChange=true` 시 detectAnomalies가 outbox enqueue (alerting 모드)
345:| `unknown` → `bucket:*` (첫 관측) | ✅ severity=info | (없음 — info는 outbox 미enqueue) | ❌ (SV4-04 rationale: query별 baseline initialization 성격이라 알림 제외. 첫 모니터링 cycle 다수 query에서 동시 발생 가능해 알림 noise 회피. 대비 — `ai-briefing-citation-first-detected`는 site-level 비즈니스 이벤트라 매트릭스에서 outbox enqueue) |
426:## 7. 알림 (outbox 패턴 + eventType 기반 enqueue)
432:### 7.2 outbox enqueue 조건 — eventType 기반 (SV2-13 정정)
444:### 7.3 발송 흐름 — outbox SQL
446:v0.2 § 7.2 outbox SQL 유지 + analytics-reporting 패턴 동일 (SKIP LOCKED + attempts<5 + permanent 전이).
458:- `sourceEventId = hash("search-visibility:" + anomalyRecordId + eventType)` (anomaly 연관 이벤트). monitoring-failed는 `hash("search-visibility:" + instanceId + "monitoring-failed:" + dateOfFailure)`로 fallback
461:- `createdAt`: detectedAt 또는 outbox enqueue 시각
463:DeliveryResult 처리 — v0.2 § 7.3 outbox claim 매핑 동일.
465:### 7.5 mode 변경 정책 + retroactive outbox command (SV2-14·SV3-06 closure)
467:- 기본: monitor-only → alerting 전환 시 **기존 AnomalyRecord에 retroactive outbox 생성 금지**. 신규 anomaly만 발송
474:- **dryRun=false**: window 내 AnomalyRecord 중 outbox 미존재(AnomalyNotificationOutbox.anomalyRecordId join 없음) + severity 조건 충족만 enqueue. UNIQUE(anomalyRecordId)로 중복 방지
475:- **sourceEventId 산정** (SV4-05 — 정책 버전 변경에도 재발송 금지):
476:  - `sourceEventId = hash("search-visibility:" + anomalyRecordId + eventType)`
478:  - retroactiveBatchId 미포함 — 동일 anomaly에 재호출 시 동일 sourceEventId 유지 (notifications idempotent receipt가 중복 발송 차단)
479:  - `UNIQUE(anomalyRecordId)`로 outbox 측 차단 + sourceEventId hash 안정성으로 양층 보호
484:- **SLA**: window 내 N개 anomaly enqueue 후 N분 내 처리 (notifications outbox worker 의존)
587:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) SV-13 해소된 미결정으로 이동 (SV5-01), (2) **retroactive audit metadata shape 명시** — contentRef="instance:{instanceId}" synthetic·metadata 필수 필드(windowStart·End·severity·dryRun·matchedCount·enqueuedCount·retroactiveBatchId)·actorRole="super-admin" (SV5-02), (3) **unifiedRankingPresence rank nullability** — previousRank/currentRank를 `number | null`로 변경. absent/restored 전이 시 null 규칙 (SV5-03), (4) **NotificationEvent 필드 매핑 표 복원** — eventType별 contentRef/contentTitle/metadata 명시. monitoring-failed는 synthetic contentRef + sourceEventId fallback (SV5-04), (5) 변경 이력 operations 잔재 → super-admin 전용으로 정정 (SV5-05): (1) **retroactive command 권한 super-admin 전용** — operations role 미존재 정정 (SV4-01), (2) **REVIEW_WORKFLOW § 10.2.1 cascade** — `search-visibility-retroactive-enqueue-requested` AuditAction 추가. SV-13 해소 (SV4-02), (3) **§ 3.3 exposureTrend detectorOutput shape § 4.1과 통일** — score·actualPercentile·thresholdPercentile (SV4-03), (4) **first-detected 정책 rationale** — unifiedRankingPresence는 query baseline initialization, AI briefing은 site-level business event (SV4-04), (5) **sourceEventId hash에서 policyVersion 제거** — 정책 변경 시 재발송 금지 의도. § 13.10 정합 (SV4-05), (6) **severity escalation 의도 명시** — warning → critical 상승은 별도 anomaly (SV4-06), (7) **v1.0 blobStorage.provider="s3"만 build-pass** — GCS/Azure는 SV-06b 후속 (SV4-07): (1) **exposureTrend percentile config 반영 + target aggregation SoT** — score 산식·detectorOutput에 actualPercentile/thresholdPercentile (SV3-01·02), (2) **SerpCrawlerApprovedScope boolean 정정** — allowLoginState/allowCaptchaBypass required=false + default=false (DATA_MODEL cascade·SV3-03), (3) **crawlerArtifact retention 평가 순서** — serpCrawler.enabled=false 시 skip (SV3-04), (4) **SearchVisibilityCollectionRetryQueue worker SoT 쿼리 복제** — analytics-reporting § 4.3 패턴(SKIP LOCKED·advisory lock·envelope 재계산·lock ordering invariant) (SV3-05), (5) **retroactive outbox command contract closure** — super-admin 전용 권한(v0.5에서 좁힘)·dryRun·sourceEventId hash·audit cascade SV-13 (SV3-06), (6) **unifiedRankingPresence state transition table** — 6종 전이별 AnomalyRecord·eventType·notify 매핑 (SV3-07), (7) **anomaly suppression ledger** — exposureTrend·backlinkChange state machine 없는 signal용 (SV3-08), (8) **blob isolation IAM 구체화** — canonical object key format·S3 IAM condition 예시·signed URL refresh SV-14 (SV3-09), (9) **SV-10 해소** + SV-06b 부분 분리 (SV3-10), (10) **SV-13·SV-14 신규** |
630:UPDATE search_visibility_collection_retry_queue
633:  SELECT id FROM search_visibility_collection_retry_queue
637:  FOR UPDATE SKIP LOCKED
642:--   1. queue row claim 후 (monitoringLogId, source) advisory lock acquire
718:### 13.10 `AnomalyNotificationOutbox` (SV2-13 enqueue 조건 정합 — eventType 기반)
722:- **sourceEventId** 산식 (SV4-05): `hash("search-visibility:" + anomalyRecordId + eventType)` — policyVersion 미포함 (정책 변경 시 재발송 금지)
723:- `UNIQUE(anomalyRecordId)` 유지 — 동일 anomaly 1 outbox 1건만

 succeeded in 649ms:
348:- 환자 동의서·증빙 첨부 권장 (`ComplianceRecord.attachments`)
375:**축 2. 환자 개인정보·초상권** (필수):
376:- 환자 본인 동의서 첨부 (`attachments[]`)
377:- 개인정보 보호법·초상권 적법성
379:> ⚠️ 환자 동의서는 개인정보·초상권 측면의 필요조건일 뿐 의료광고법 적법성을 보장하지 않음. 동의서 보유 = 발행 가능 아님.
608:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (9개 지적 전건 수용)**: (1) § 3.2 — 시행령 제23조제1항제2호의 **3유형 묶음** 명시 (치료경험담·6개월 이하 임상경력·치료효과 단정). RiskRule.id 별도 추적, (2) § 2.4 "1:1 대응" 표현 완화 — "대체로 대응하나 일부 시행령 호는 의미 확장·혼합". 시행령 제2호 묶음 예시 명시, (3) § 2.2 14호 + § 3.14 — **추천 표시는 예외 아님** 명확화 (가~라목 예외는 인증·보증 표시만), (4) § 3.14 다목 "자격" 제거 — 자격은 제9호 별도 축, (5) § 3.12 외국인환자 — `severity: content-gate` + `requiredApproverRoles: ["legal"]` 명시 + ComplianceRecord 기록 경로, (6) § 4.2 자사 웹사이트 사전심의 — `priorReviewRequired`·`legalCounsel`·`attachments[]` 운영 감사 추적 경로 명시, (7) § 5.2 P-101 — **차단 기준 우선** 명시 (치료 효과 오인은 검수로 치유 안 됨). CONTENT_STANDARDS § 4.3 본문 직접 인용 원칙 정합, (8) § 6.2 전후사진 — **2축 적법성** 분리 (의료광고법 + 환자 개인정보·초상권). 동의서 보유=발행 가능 오해 회피, (9) § 8.3 law.go.kr — 의료법 본문 한정 → 시행령·시행규칙·관련 법령 포함으로 확장 |

 succeeded in 653ms:
7:> **목적**: 사용자 지정 N개 키워드의 검색 순위·노출·CTR·rank bucket transition 모니터링. analytics-reporting의 queryNormalizedMetrics 데이터 기반. 이상 변동 시 outbox 알림.
20:- **핵심 책임**: (a) 사용자 지정 키워드 N개 모니터링, (b) analytics-derived 데이터 기반 순위·노출·CTR 추적, (c) **v1.0에서 serp-crawler 미지원** — `enabled=true` build fail (F-13. v1.x에서 search-visibility SerpCrawlerArtifact 공용 또는 별도 테이블 추가 결정 후 활성), (d) rank bucket transition state·이상 변동 감지, (e) **KeywordAnomalyNotificationOutbox** 패턴, (f) 대시보드 read API
26:- **DB 인벤토리**: **8 tables** — KeywordTrackingTarget·KeywordSignalSnapshot·MonitoringLog·MonitoringSourceAttempt·KeywordMonitoringCollectionRetryQueue·KeywordAnomalyRecord·KeywordRankBucketState·KeywordAnomalyNotificationOutbox
73:### 1.2.1 공통 retry taxonomy
75:search-visibility § 1.2.1 동일 — 2종 retry 구조:
80:| KeywordAnomalyNotificationOutbox | **상수 5** |
196:| 실행 command | `detectAnomalies(input)` | 이상 변동 감지 + outbox enqueue |
268:    notify: boolean;                                   // KMF3-04 — outbox enqueue 대상 여부
279:- `notify=false`: ctr-up direction (anomalyRecord 저장만, outbox 미enqueue) → `notificationSuppressionReason="not-enqueue-eligible"`
280:- `notify=false`: mode="monitor-only" (모든 anomaly outbox 미enqueue) → `notificationSuppressionReason="monitor-only-mode"`
282:- `notify=true`: outbox enqueue 대상. 발송 완료 시 `notificationEventId` 채움
373:## 6. 알림 (outbox 패턴)
377:| eventType | anomalySeverity | notificationCriticality (REVIEW_WORKFLOW § 9.1.1) | outbox enqueue |
388:| `keyword-monitoring-monitoring-failed` | (anomaly 아님 — operational) | high | ✅ (별도 outbox sourceKind="monitoring-log") |
392:### 6.2 발송 흐름 — KeywordAnomalyNotificationOutbox 패턴
395:- **outbox sourceKind/sourceId 일반화** (F-6 + KM2-03 정정):
398:  - sourceKind="rank-bucket-transition" + sourceId=**transitionEventId** (KM2-03 — 각 transition별 고유 ID. KeywordRankBucketState.lastTransitionEventId와 동일 식별자. AnomalyRecord 생성과 별개로 outbox row 생성 가능)
399:- UNIQUE constraint: `UNIQUE(sourceKind, sourceId, eventType)` (단일 source·eventType별 1 outbox 1건. rank-bucket-transition은 transition별 별도 sourceId라 동일 target의 후속 transition도 정상 enqueue)
406:**원자성** (KMF3-02 — state + outbox 단일 transaction):
408:1. **try advisory lock** acquire (hash(keywordTargetId, "rank-bucket")) — non-blocking
409:   - acquire 실패 시 → **idempotent no-op + early exit** (다른 worker가 이미 처리 중). retryable error 아님 (KMF4-04)
416:   b. KeywordAnomalyNotificationOutbox INSERT (sourceKind="rank-bucket-transition", sourceId=transitionEventId)
417:      UNIQUE(sourceKind, sourceId, eventType) 위반 시 → 다른 worker 처리 → abort, idempotent no-op
419:6. advisory lock release
421:- 동시 detector 또는 forceRefresh — advisory lock + compare-and-set + UNIQUE 3중 보호로 중복 enqueue 차단
433:- `sourceEventId = hash("keyword-monitoring:" + sourceKind + ":" + sourceId + ":" + eventType)` — policy 버전 미포함 (search-visibility 동일 정책)
475:- outbox dispatch-failed-permanent 발생
572:- **rank-bucket transition 원자성 invariant**: KeywordRankBucketState.lastTransitionEventId 갱신과 KeywordAnomalyNotificationOutbox(sourceKind="rank-bucket-transition") insert가 단일 transaction 외부에서 발생한 sequence 감지 (예: state만 갱신·outbox row 부재 또는 그 반대) → reconcile job 트리거
573:- **outbox dispatch-failed-permanent 누적** > 임계 → 운영팀 알림
576:  - `KeywordAnomalyNotificationOutbox.claimedAt > 5분` (§ 6.2 outbox SQL 정합) → 재claim
627:1. advisory lock acquire (hash(instanceId, keyword, country, device, searchEngine))
635:4. advisory lock release
659:| `ingestedAt`·`expiresAt` | Date | ✅ |
662:**Index**: `(instanceId, signal, date)`, `(keywordTargetId, signal, date)`, `(expiresAt)`.
674:worker SoT 쿼리·SKIP LOCKED·advisory lock·envelope 재계산·lock ordering invariant — search-visibility § 13.5 SQL 동일.
684:### 13.8 `KeywordAnomalyNotificationOutbox` (F-6 일반화)
692:| `sourceEventId` | string | ✅ — `hash("keyword-monitoring:" + sourceKind + ":" + sourceId + ":" + eventType)` |
693:| `claim` | enum | ✅ — not-claimed·claimed-pending·dispatched·dispatch-failed-retryable·dispatch-failed-permanent |
700:**Constraints**: `UNIQUE(sourceKind, sourceId, eventType)` (F-6 — sourceKind·sourceId·eventType별 1 outbox row).
714:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4 minor 지적 전건 수용)**: (1) § 1.2 "4종" 잔재 → "5종" 정정 (KMF5-01), (2) § 3.1.1 audit log contract 표에 `keyword-tracking-target-migrated-v02-v03` 행 추가 (KMF5-02), (3) **decompositions[] 1:1 lossless 매핑** — `toTargets: Array<{targetId, searchEngine, inheritedOriginalId, activeAfter}>` 구조 변경 (KMF5-03), (4) **§ 11.3·§ 11.4 분류·용어 정정** — migration-time fail 명칭·outbox claimedAt vs retry queue lockedAt 분리 (KMF5-04): (1) **KeywordAnomalyNotificationOutbox sourceKind enum 정정** — `rank-bucket-state` → `rank-bucket-transition`. sourceId 타입 `UUID` → `string` (sourceKind별 typed) (KMF4-01), (2) **migration audit metadata decompositions[] 구조** — lossless 표현 (KMF4-02), (3) **AuditAction 4종 → 5종** 표기 정정 (KMF4-03), (4) **rank-bucket transition try advisory lock + idempotent no-op** semantics 명시 (KMF4-04), (5) **§ 11.4 runtime invariant·reconcile 분리** (§ 11.2와 별도) (KMF4-05), (6) **§ 1.1 migration-time validation·runtime invariant SemVer policy 추가** (KMF4-06): (1) **REVIEW_WORKFLOW § 10.2.1 cascade — `keyword-tracking-target-migrated-v02-v03` AuditAction 추가** + § 10.3 audit contract metadata shape 명시. KM-16 v1.0 cascade 완료 (KMF3-01), (2) **rank-bucket transition 원자성·deterministic transitionEventId** — logical transitionDate(windowEnd) 사용·advisory lock + compare-and-set + UNIQUE 3중 보호 (KMF3-02), (3) **reactivate 동시성 정책** — advisory lock + deterministic order(registeredAt DESC, id ASC). § 11.2 runtime fail 문구 정정 (KMF3-03), (4) **ctr-up read API notify=false contract** — queryKeywordSignals.anomaliesInWindow에 notify boolean·notificationSuppressionReason enum (KMF3-04), (5) **cross-Feature transaction boundary** — correlatedSearchVisibilityAnomalyId READ COMMITTED 별도 transaction (KMF3-05), (6) **canonical 검색엔진 enum SoT + cross-Feature build validation** — 3개 집합(KeywordTrackingTarget.searchEngine·SEARCH_ENGINE_TO_ANALYTICS_SOURCE·SerpCrawlerApprovedScope.searchEngines) drift 검증 (KMF3-06), (7) **§ 11 build/runtime/migration 3분리** — § 11.3 migration-time validation 신설 (KMF3-07): (1) **DATA_MODEL C-08 KeywordMonitoringConfig.serpCrawler v1.0 build fail** 정정 — enabled=true 자체로 fail (legalApproved 무관) (KM2-01), (2) **soft delete + partial unique** — `WHERE active=true` (PostgreSQL) 또는 generated column. `registerKeyword` 시 inactive 재등록은 reactivate로 처리 (KM2-02), (3) **rank-bucket outbox sourceId=transitionEventId** — 각 transition별 고유 ID로 UNIQUE 차단 회피 (KM2-03), (4) **migration v0.2→v0.3 정책 § 10.3** — targetSearchEngines 배열 분해·queryHash 재계산·FK 승계 (KM2-04), (5) **correlatedSearchVisibilityAnomalyId 매핑 정확화** — insert 직전 1회 lookup·다건 매칭 우선순위·실패 시 null·재시도 없음 (KM2-05), (6) **§ 3.1.1 audit log contract** — register/unregister/resolution-updated/retroactive 4종 contentRef·metadata shape 명시 (KM2-06), (7) **zeroBaselinePolicy enum** — first-observed·hold만 허용 (spike 제거) + build fail 추가 (KM2-07), (8) **ctr-up dashboard 표시 규칙** — queryKeywordSignals.anomaliesInWindow 포함·notify=false 시각 구분 (KM2-08), (9) **SEARCH_ENGINE_TO_ANALYTICS_SOURCE 명시 매핑 테이블** + exhaustive build validation (KM2-09): (1) NotificationEventType 8종 cascade 통일 — REVIEW_WORKFLOW § 9.1·§ 9.1.1 8행 추가 (F-1), (2) **DATA_MODEL C-08 v0.17 cascade** — keywordMonitoringConfig·keywordMonitoringPolicyVersion 신설 + SerpCrawlerApprovedScope 재사용 (F-2), (3) **locale/searchEngine dimension → country/source 매핑** — analytics-reporting QueryDimension 정합 (F-3), (4) device dimension/filter 추가 (F-4), (5) **KeywordTrackingTarget.searchEngine 단일 enum + UNIQUE 정규화** (F-5), (6) **outbox sourceKind/sourceId 일반화** — anomaly·monitoring-log·rank-bucket-state 3종 (F-6), (7) rank-bucket 이벤트 매핑 추가 (F-7), (8) **anomalySeverity vs notificationCriticality 컬럼 분리** (F-8), (9) keywordRank algorithm enum moving-average만 + EWMA는 KM-07 후속 (F-9), (10) **zero baseline·CTR direction·minBaselineDays·minVariance** 정확화 (F-10), (11) signal별 dedupe 주체 표 — ledger vs state machine (F-11), (12) **register/unregister 권한·soft delete·audit cascade** — REVIEW_WORKFLOW § 10.2.1 4종 cascade (F-12·F-15), (13) **serp-crawler v1.0 build fail** — KeywordMonitoringSerpArtifact 결정은 v1.x로 분리 (F-13), (14) **maxKeywordsPerInstance drift alert 분리** (F-14), (15) **§ 13 MonitoringSourceAttempt 중복 제거** (F-16), (16) KM-05·KM-06 재정의 (F-17), (17) **search-visibility 중복 정책 § 0.1 명시** — correlatedSearchVisibilityAnomalyId best-effort (F-18), (18) KM-08~KM-13 해소된 미결정으로 이동 |

 succeeded in 675ms:
8:> **연관 문서**: compliance-assistant § 3.3 check(), notifications notify() + REVIEW_WORKFLOW § 9.1·§ 10.2.1 (cascade 완료), DATA_MODEL C-08 v0.18 + AssetIngestionApprovedScope, CONTENT_STANDARDS § 7, MEDICAL_AD_COMPLIANCE_COMMON § 3·§ 4
21:- **DB 인벤토리**: **11 tables** — IngestionSource·IngestionLog·IngestionSourceAttempt·IngestionRetryQueue·IngestedAsset·ExtractedContent·**AssetPiiFinding(신설)**·AssetTag·AssetReviewRecord·AssetPromotionRecord·AssetIngestionNotificationOutbox + Blob storage 1종
55:| AssetIngestionNotificationOutbox | 상수 5 |
83:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 5종 NotificationEventType cascade 완료 |
112:| `asset-ingestion-asset-promoted` | `"asset:" + assetId` | targetContentType·targetContentRef·targetMappingSummary·promotedBy | operator·super-admin |
338:**AssetPromotionRecord status 머신** (AI3-01 정정):
353:1. promote 게이트 사전 검증 (§ 7.2 — 미충족 시 runtime fail, AssetPromotionRecord 미생성)
355:   a. AssetPromotionRecord INSERT (status="checking", checkStartedAt=now())
357:   c. 성공 → AssetPromotionRecord UPDATE status="pending-commit", checkCompletedAt, checkResultVersion
358:   d. 실패 → AssetPromotionRecord UPDATE status="failed", lastError + 외부 sink alert + early exit
360:   a. **AssetPromotionRecord row lock + status CAS** (AI4-02): `SELECT ... FOR UPDATE WHERE id=? AND status='pending-commit'` — 다른 worker가 이미 진입했거나 status 다르면 abort(idempotent duplicate). 성공 시 `UPDATE SET commitStartedAt=now()`
363:      - 게이트 재검증 실패 → transaction abort (Core row 미생성). **3.a의 `commitStartedAt` update도 abort와 함께 rollback** (AI5-02 정합). **별도 짧은 transaction에서 AssetPromotionRecord UPDATE status="failed", lastError="gate-race-failure", failedAt=now() WHERE status='pending-commit'** (WHERE 조건으로 race 방지. commitStartedAt은 채우지 않음 — abort로 rollback된 상태) — AI4-03
364:   d. Core 데이터 계약 row INSERT (status="draft", `@provenanceAssetId`=assetId — AI4-11)
367:   g. **AssetIngestionNotificationOutbox INSERT** (sourceKind="asset", sourceId=assetId, eventType="asset-ingestion-asset-promoted") — AI3-04 atomic
368:   h. AssetPromotionRecord UPDATE status="committed", commitCompletedAt=now(), targetContentRef=Core row @id
371:   - audit log `asset-ingestion-asset-promoted` 기록 — 실패 시 reconcile (audit는 외부 시스템)
400:  - **checksum 검증 (정확 공식)**:
412:- `mask`: RRN 전용 마스킹 `######-*******`. 일반 텍스트는 부분 마스킹
427:### 10.1 NotificationEventType 매트릭스 (REVIEW_WORKFLOW § 9.1.1 cascade 완료 — 5종)
435:| `asset-ingestion-asset-promoted` | normal | inApp | (없음) | (옵션) email 일일 | respect | digestOptOut 허용 |
439:search-visibility § 7.2·keyword-monitoring § 6.2 동일 (SKIP LOCKED·attempts<5·permanent 전이).
449:| `asset-ingestion-asset-promoted` | `asset` | assetId | `"asset:" + assetId` | `"Core 변환 완료 — ${targetContentType}"` | assetId·targetContentType·targetContentRef·assetPromotionRecordId |
453:- UNIQUE(sourceKind, sourceId, eventType) — 동일 asset에 pii-detected 이벤트 1건만 outbox row. asset에 PII가 추가 발견되면 새 outbox 생성 안 함 (기존 finding 수정/추가는 read API로 확인)
471:| promote율 | promoted / approved | baseline |
473:| **RRN candidate count** (AI3-11) | regex 후보 수 / 전체 ingested asset 수 | baseline (운영 30일 누적) |
474:| **RRN checksum pass rate** | checksum 통과 / candidate count | baseline |
545:- **AssetPromotionRecord stale** (AI4-04 join key 명시):
549:      - targetContentRef 존재 시 → `WHERE @provenanceAssetId=assetId AND @id=targetContentRef`
550:      - targetContentRef IS NULL (crash 전 미채움) → `WHERE @provenanceAssetId=assetId` (해당 targetContentType 테이블). 정확히 1건이면 targetContentRef를 backfill 후 committed 후보. 0건 또는 2+건이면 → status="failed", lastError="commit-stalled-targetref-null" + sink alert
552:    - AssetIngestionNotificationOutbox: `WHERE sourceKind='asset' AND sourceId=assetPromotionRecord.assetId AND eventType='asset-ingestion-asset-promoted'`
557:- **AssetIngestionNotificationOutbox dispatch-failed-permanent** 누적 임계 초과 → 운영팀 alert
598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
620:**Index**: `(instanceId, sourceId, sourceCanonicalKey)`, `(expiresAt)`.
646:| `detector` | enum (`regex`·`checksum`·`manual`) | ✅ — **v1.0은 llm detector 미지원** (AI2-07. v1.x에서 LLM 활성화 시 provider allowlist·promptVersion·data minimization·raw PII 외부 전송 금지 또는 명시 승인 예외·audit metadata 정의 — AI-06 cascade) |
707:### 16.10 `AssetPromotionRecord` (AI4-01 — 풀 스키마 전개)
719:| `promotedBy` | string | ✅ | AdminUser @id |
731:### 16.11 `AssetIngestionNotificationOutbox` (F-18 구체화 — keyword-monitoring § 13.8 패턴 동일)
748:**Constraints**: `UNIQUE(sourceKind, sourceId, eventType)`.

codex
관련 문서 패턴을 대조해보니 outbox/retry 쪽은 “패턴 동일”만으로는 부족하다는 이전 지적이 다른 안정판 문서에서는 SQL·락·원자성까지 내려가 해결된 상태입니다. crm-sync v0.2는 그 수준까지 못 내려간 부분이 있어 주요 지적 후보로 잡겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "ProviderWebhookVerifier|nonce|timestampTolerance|outbound-only|liveReadCrmDetail|rawPiiStorageAllowed|PII Redaction|credential rotation|rotationGracePeriod|FieldAuthority|last-write|manual|DB 인벤토리|10 tables|CrmIntegration|CrmRecord|CrmWebhookNonceLedger|CrmSyncNotificationOutbox|AuditAction|crm-live-read|RRN|false" docs/features/crm-sync.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "crm-sync|crm-integration|crm-credential|crm-live|NotificationEventType|crm-sync-batch|crm-sync-conflict|crm-sync-credential" docs/admin/REVIEW_WORKFLOW.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "crmSyncConfig|CrmSyncConfig|CrmIntegrationEntry|crmSyncPolicyVersion|patientConsent|dpaEvidence|korean-emr|salesforce|hubspot|generic" docs/core/DATA_MODEL.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "type NotificationEventType|crm-sync-batch-failed|crm-sync-conflict-detected|crm-sync-credential-expired|crm-sync-credential-expiring" docs/admin/REVIEW_WORKFLOW.md' in C:\Users\assag\solution\website-exposure
 succeeded in 652ms:
464:### 9.1 NotificationEventType enum (canonical SoT)
467:type NotificationEventType =
503:  // `features/crm-sync.md` 1차 cycle cascade (CS1-01)
504:  | "crm-sync-batch-failed"                   // sync cycle 실패
505:  | "crm-sync-conflict-detected"              // 양방향 sync 충돌
506:  | "crm-sync-credential-expired"             // CRM 자격증명 만료
507:  | "crm-sync-credential-expiring-soon";      // 만료 14일 전
547:| `crm-sync-batch-failed` | CRM sync 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
548:| `crm-sync-conflict-detected` | CRM 충돌 감지 | operator | email + inApp | inApp | — | high | respect | mandatory |
549:| `crm-sync-credential-expired` | CRM 자격증명 만료 | operator + super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
550:| `crm-sync-credential-expiring-soon` | 만료 14일 전 | operator + super-admin | email + inApp | inApp | — | high | respect | mandatory |
569:  eventType: NotificationEventType;                    // § 9.1 enum
586:  eventType: NotificationEventType;
669:  // `features/crm-sync.md` 1차 cycle cascade (CS1-01·16)
670:  | "crm-integration-registered"              // CRM 연동 등록
671:  | "crm-integration-unregistered"            // soft delete
672:  | "crm-sync-conflict-resolved"              // 충돌 운영자 해결
673:  | "crm-credential-rotated";                 // 자격증명 rotation

 succeeded in 662ms:
4:> **작성일**: 2026-05-14 (v0.18 → v0.19 — `features/crm-sync.md` 1차 사이클 cascade: C-08 `crmSyncConfig`(CrmSyncConfig·CrmIntegrationEntry 신설 — provider salesforce·hubspot·generic-rest-api 3종 한정·korean-emr build fail·dpaEvidenceRef vs patientConsentEvidenceRef 분리) + `crmSyncPolicyVersion`)
596:| `crmSyncConfig` | `CrmSyncConfig` | conditional | (v0.19 +) CRM·환자관리 시스템 연동 자격증명·DPA·동의 증빙 SoT. `features.crm-sync` 활성 시 required. 동작 옵션은 `features[name="crm-sync"].config` (`features/crm-sync.md` § 2.3) |
597:| `crmSyncPolicyVersion` | `string` | conditional | (v0.19 +) `features.crm-sync` 정책 SoT 버전. 7 Feature policyVersion 동일 패턴 |
694:#### `CrmSyncConfig` (v0.19 신규)
698:| `integrations` | `CrmIntegrationEntry[]` | ✅ | multiple CRM 연동 지원 (예: 본원 Salesforce + 분원 HubSpot) |
700:#### `CrmIntegrationEntry` (v0.19 신규)
705:| `provider` | enum (`salesforce`·`hubspot`·`generic-rest-api`) | ✅ | **v1.0은 3종만**. `korean-emr`은 v1.x patch (CS-13). 해당 enum 값 build fail |
713:| `dpaEvidenceRef` | string | ✅ | DPA 계약 증빙 secretRef. **`patientConsentEvidenceRef`와 분리** (CS1-12) — DPA는 provider·기관 계약 증빙. 환자 단위 동의 증빙은 별도 (v1.0은 record-level 미저장 — CS-07 후속) |
1078:| 2026-05-14 | v0.19 | **`features/crm-sync.md` 1차 사이클 cascade**: (1) **C-08 `crmSyncConfig` 신설** (CrmSyncConfig·CrmIntegrationEntry — provider 3종 한정, dpaEvidenceRef·patientConsentEvidenceRef 분리), (2) **C-08 `crmSyncPolicyVersion`** (7 Feature policyVersion 동일 패턴) |

 succeeded in 675ms:
467:type NotificationEventType =
504:  | "crm-sync-batch-failed"                   // sync cycle 실패
505:  | "crm-sync-conflict-detected"              // 양방향 sync 충돌
506:  | "crm-sync-credential-expired"             // CRM 자격증명 만료
507:  | "crm-sync-credential-expiring-soon";      // 만료 14일 전
547:| `crm-sync-batch-failed` | CRM sync 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
548:| `crm-sync-conflict-detected` | CRM 충돌 감지 | operator | email + inApp | inApp | — | high | respect | mandatory |
549:| `crm-sync-credential-expired` | CRM 자격증명 만료 | operator + super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
550:| `crm-sync-credential-expiring-soon` | 만료 14일 전 | operator + super-admin | email + inApp | inApp | — | high | respect | mandatory |

 succeeded in 717ms:
9:> - 알림·audit → notifications + REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (cascade 완료 — 4종 NotificationEventType·4종 AuditAction)
11:> - RRN checksum 알고리즘 재사용 → `features/asset-ingestion.md` § 9.1
18:- **핵심 책임**: (a) 외부 CRM 양방향 sync(예약 신청·문의·전환 이벤트·고객 컨택트), (b) field-level mapping + authority, (c) webhook(실시간) + polling(배치), (d) 충돌 해결 (field-level CAS), (e) **raw PII 저장 금지** — 솔루션 DB에는 displayHints/derived hints만, (f) DPA·credential rotation·만료 알림
21:- **운영 모드 2종**: `bi-directional`(양방향·기본)·`outbound-only`(솔루션→CRM 일방향)
24:- **RRN**: 솔루션 측 deny 강제 (v1.0 — CS1-06 resolved). asset-ingestion § 9.1 checksum 알고리즘 재사용
25:- **DB 인벤토리**: **10 tables** (모든 schema § 13 전개)
54:- RRN checksum SoT는 `features/asset-ingestion.md` § 9.1 (재사용)
55:- 본 문서 = sync 파이프라인·field mapping·충돌 해결·PII·credential rotation·audit SoT + 내부 데이터 구조 SoT (§ 13)
62:| CrmSyncNotificationOutbox | 상수 5 |
69:- 의료 진료 기록 보관 — CRM·EMR 측 책임 (RRN 등 솔루션 측 통과 금지)
82:activation: { scope: "instance", default: false }
91:| REVIEW_WORKFLOW § 10.2.1 | 4종 AuditAction cascade 완료 |
94:| asset-ingestion § 9.1 | RRN checksum 알고리즘 재사용 |
120:      mode: "bi-directional"                            # bi-directional | outbound-only
124:      entities:                                          # CS1-09 — outbound-only 모드는 conflictResolution="outbound-only-no-conflict"만 허용
125:        reservation: { enabled: true, conflictResolution: "last-write-wins-by-timestamp" }
128:        conversionEvent: { enabled: true, conflictResolution: "outbound-only-no-conflict" }
133:        timestampToleranceSeconds: 300
134:        nonceLedgerRetentionMinutes: 60                 # nonce/eventId ledger 보존
142:        rotationGracePeriodMinutes: 30                  # 이전 credential 병행 허용 시간
150:        rawPiiStorageAllowed: false                     # v1.0 강제 false (raw PII 저장 금지)
158:        webhookNonceLedger: 1                           # 1일 (timestampToleranceSeconds + 여유)
170:| 실행 command | `runSync(input)` | sync cycle | operator·super-admin | outbound-only 모드는 direction="outbound"만 허용 |
171:| 실행 command | `processInboundWebhook` | webhook 수신 | system (HTTP endpoint) | outbound-only 모드는 endpoint 비활성 (HTTP 404) |
173:| 실행 command | `resolveConflict(conflictId, resolution)` | 충돌 해결 | operator·super-admin. legal 검수자 read-only | outbound-only 모드는 충돌 없음 — 호출 불가 |
174:| 실행 command | `liveReadCrmDetail(crmRecordId)` | CRM live PII detail 조회 (no-cache·audit 기록) | **operator·super-admin·legal-reviewer** (CS1-20). audit `crm-live-read` 자동 기록 (v1.x audit cascade — CS-14 신규) |
175:| read API | `queryCrmRecords` | 어드민 — **displayHints만** | operator·super-admin·legal-reviewer (raw PII 미반환) |
183:| AuditAction | contentRef | metadata | 권한 |
216:v0.1 § 3.3 유지 + outbound-only mode 시 `direction="outbound"` 강제 (CS1-09).
229:- **ProviderWebhookVerifier 인터페이스**: provider별 어댑터가 (rawBody, headers, fullUrl, method, timestamp, providerEventId) → 검증 결과
230:- **nonce ledger** (CS1-04): `CrmWebhookNonceLedger` 테이블 — `(integrationId, providerEventId)` UNIQUE. 동일 eventId 재발신은 deduped 처리 (HTTP 200 + "already-processed")
242:### 4.2 inbound (CRM → 솔루션) + ProviderWebhookVerifier (CS1-04)
246:2. rawBody 그대로 ProviderWebhookVerifier.verify(rawBody, headers, fullUrl, method) 호출
249:3. timestamp tolerance 검증 — `headers.timestamp ∈ now ± timestampToleranceSeconds` 아니면 rejected-replay
250:4. **CrmWebhookNonceLedger insert** — `(integrationId, providerEventId)` UNIQUE
252:5. **RRN 검사 (CS1-06)**: rawBody 전체에 asset-ingestion § 9.1 RRN checksum 알고리즘 적용
253:   - RRN 검출 시 → **payload 폐기** (CrmRecord 미생성). CrmWebhookNonceLedger에 `rrnDetected=true` 마킹 + hashed fingerprint(non-reversible)만 보존 + 외부 sink alert + status="rejected-rrn-detected"
256:8. 충돌 없음 → CrmRecord update + CrmRecordChangeLog (PII 마스킹된 changedFields)
265:type FieldAuthority =
268:  | "last-write-wins-timestamp"   // provider timestamp 기반
269:  | "last-write-wins-version";    // CAS 기반 version 비교
272:**last-write-wins-timestamp** 정확화:
275:- 모든 비교 실패 시 → `manual` 정책으로 escalate (CrmConflictRecord)
277:**last-write-wins-version (CAS)**:
278:- CrmRecord.crmVersion·solutionVersion 비교. 더 높은 version 승리
279:- version mismatch (예: 솔루션 측 update가 CrmRecord.solutionVersion 갱신 전 발생) → manual
281:**manual 해결 후**: `resolveConflict(conflictId, resolution)` 시 `appliedVersion` 저장 — 동일 충돌 재발 방지 (CrmRecord.lastAppliedConflictVersion 갱신)
287:### 4.5 credential rotation 상태 머신 (CS1-10)
294:1. rotating 상태 진입 — old credential은 rotationGracePeriodMinutes(기본 30분) 동안 fallback으로 유지
355:- `pii.rawPiiStorageAllowed=false` 강제 (v1.0 build fail if true)
361:- **CrmRecord·CrmRecordChangeLog·CrmConflictRecord 모든 snapshot/changedFields에 raw PII 저장 금지** — PII Redaction Validator가 schema 검증 시 강제
362:- raw detail 조회 — `liveReadCrmDetail(crmRecordId)`로 CRM API 실시간 호출 (no-cache·audit)
364:### 7.2 RRN deny (CS-01 resolved — v1.0 강제)
367:- asset-ingestion § 9.1 RRN checksum 알고리즘 재사용:
371:- 검증 통과 RRN 감지 시:
372:  - inbound webhook → payload 폐기. CrmRecord 미생성. status="rejected-rrn-detected"
374:  - CrmWebhookNonceLedger 또는 CrmRecordChangeLog에 `rrnDetected=true` + `rrnFingerprint`(non-reversible HMAC) 보존 — 운영 감사용·raw RRN 보존 금지
395:| RRN deny 발생율 | (baseline) | (운영 누적) |
397:| nonce ledger dedupe 적중률 | (재전송 빈도 추적) | baseline |
403:- manifest validator: legalApproved=false build fail, korean-emr build fail, appointment enabled build fail
405:- RRN deny: regex+checksum+payload 폐기·fingerprint 보존
406:- outbound-only mode: inbound runSync/processInboundWebhook 차단
408:- credential rotation: rotating → committed/reverted 두 경로
412:## 9. 설치·설정 — v0.1 § 9 유지 + DB 10 tables
428:- **`pii.rawPiiStorageAllowed=true`** (CS1-05 — v1.0 강제 false)
432:- `entities.<other>.conflictResolution`이 **`mode="outbound-only"` + `outbound-only-no-conflict` 외**(CS1-09)
440:- nonce ledger 중복 (이미 처리됨) → HTTP 200 idempotent (fail 아님)
442:- **inbound payload RRN 검출** (CS1-06) → 폐기 + sink alert
443:- **outbound push payload RRN 검출** → 차단 + 운영자 alert
445:- **mode="outbound-only" + processInboundWebhook 호출** → HTTP 404 (CS1-09)
446:- **mode="outbound-only" + runSync direction="inbound"/"both"** → runtime fail (CS1-09)
459:- **PII Redaction Validator drift 감지** (raw PII가 schema 미통과로 row insert됨) → 즉시 sink alert + 운영자 수동 정리
483:| CS-14 | `crm-live-read` audit cascade (raw PII live 조회 추적) | v1.x patch — REVIEW_WORKFLOW § 10.2.1 후속 cascade |
491:| CS-11 | CRM → Core 자동 promote (예: ReservationSubmission → 어드민 콘텐츠) | v1.x. `@provenanceCrmRecordId` 같은 공통 메타 cascade 필요 (CS1-18) |
499:| ~~CS-01~~ | RRN deny 정책 | v0.2 — build fail + asset-ingestion checksum 재사용 |
508:| 2026-05-14 | **v0.2** | **codex 자동 비평 1차 반영 (21 지적 전건 수용)**: (1) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 4종 NotificationEventType + 매트릭스 4행 (CS1-01), (2) **REVIEW_WORKFLOW § 10.2.1 cascade** — 4종 AuditAction (CS1-01·16), (3) **DATA_MODEL C-08 v0.19 cascade** — CrmSyncConfig·CrmIntegrationEntry 신설·crmSyncPolicyVersion·DPA/consent 분리 (CS1-01·12), (4) **ReservationPage·CTAConfig 경계 정리** — 콘텐츠 페이지는 참조만. sync 대상은 ReservationSubmission·Inquiry·ConversionEvent 운영 이벤트 (CS1-02·15 신규 CONTENT_STANDARDS cascade), (5) **provider 3종 한정** — salesforce·hubspot·generic-rest-api. korean-emr build fail·CS-13 deferred (CS1-03), (6) **webhook ProviderWebhookVerifier 인터페이스 + rawBody·nonce ledger** — CrmWebhookNonceLedger 신설 (CS1-04), (7) **raw PII 저장 금지 강제** — rawPiiStorageAllowed=false build fail. displayHints만. PII Redaction Validator (CS1-05), (8) **RRN deny v1.0 build fail** + asset-ingestion checksum 재사용. CS-01 resolved (CS1-06), (9) **field-level authority + CAS 충돌 해결** — FieldAuthority enum. clock skew·tie-breaker·appliedVersion (CS1-07), (10) **retry queue·outbox schema 풀 전개** § 13 (CS1-08), (11) **outbound-only command matrix** — inbound runSync/processInboundWebhook 차단 (CS1-09), (12) **credential rotation 상태 머신** — stable·rotating·committed·reverted + grace period (CS1-10), (13) **CrmRateLimitState 신설** — provider별 quota·resetAt·nextAllowedAt (CS1-11), (14) **DPA vs patient consent 분리** — dpaEvidenceRef·patientConsentEvidenceRef. v1.0은 record-level 미저장 (CS1-12, CS-07 deferred), (15) **§ 13 모든 10 tables 풀 schema 전개** (CS1-13), (16) **retention expiresAt 필드 추가** — syncLog·conflictRecord 등 (CS1-14), (17) **§ 6.1 매트릭스는 REVIEW_WORKFLOW SoT 행 인용만**으로 표시 (CS1-15), (18) **credential fingerprint non-reversible HMAC-SHA256** (CS1-16), (19) **미결정 3분류** — open/deferred-v1.x/resolved-in-v1.0 (CS1-17), (20) **CS-18 — @provenanceCrmRecordId v1.x 명시** (CS1-18), (21) **`?` 깨진 문자 정정** + read API/live read 권한 매트릭스 + acceptance test fixture (CS1-19·20·21)
512:## 13. 본 Feature 내부 데이터 구조 (admin DB 10 tables)
514:### 13.1 `CrmIntegration`
571:### 13.5 `CrmRecord` (PII 마스킹된 cache·상태 추적)
576:- raw PII 필드 절대 금지 (PII Redaction Validator 강제 — CS1-05)
581:### 13.6 `CrmRecordChangeLog`
583:v0.1 § 13.5 유지 + `changedFields`는 PII Redaction Validator 통과 (raw PII 금지). `expiresAt` ✅.
587:v0.1 § 13.6 + `authority: FieldAuthority enum` ✅.
597:### 13.10 `CrmRateLimitState` (CS1-11 신설) + `CrmWebhookNonceLedger` (CS1-04 신설)
611:**`CrmWebhookNonceLedger`** (replay 방지):
620:| `rrnFingerprint` | string | optional — RRN 감지 시 HMAC non-reversible |
626:### 13.11 `CrmSyncNotificationOutbox` (CS1-15)

codex
{
  "feature": "crm-sync",
  "version_reviewed": "v0.2",
  "cycle": 2,
  "verdict": "needs_major_revision",
  "summary": {
    "overall": "v0.2는 1차 21개 지적 중 SoT cascade, provider 범위, ReservationPage 경계, RRN deny, DPA 분리 등은 상당 부분 실제 반영됐다. 그러나 webhook replay, PII 저장 금지의 구현 가능성, liveRead audit, DB 인벤토리, rotation 동시성, field-level CAS는 여전히 구현 가능한 계약 수준에 못 미친다.",
    "blocking_count": 7,
    "major_count": 8,
    "minor_count": 2
  },
  "findings": [
    {
      "id": "CS2-01",
      "severity": "blocking",
      "category": "DB 인벤토리·명세 정합성",
      "location": "docs/features/crm-sync.md:25, 412, 512-626",
      "issue": "문서는 DB 10 tables라고 선언하지만 §13은 CrmRateLimitState와 CrmWebhookNonceLedger를 한 절에 묶어도 실제로는 CrmIntegration, SyncLog, SourceAttempt, RetryQueue, Record, ChangeLog, FieldMapping, ConflictRecord, CredentialAuditLog, RateLimitState, WebhookNonceLedger, NotificationOutbox까지 12개 논리 테이블이다. 또한 CrmIntegration은 '§3.2 shape'라고 되어 있는데 §3.2는 sync entity 정의라 참조가 틀렸고, 여러 테이블은 v0.1 유지로 핵심 필드·FK·INDEX가 생략되어 있다.",
      "impact": "migration 작성자가 실제 테이블 수와 FK/retention 범위를 확정할 수 없다. CS1-13/CS1-14가 표면적으로만 해결된 상태다.",
      "recommendation": "인벤토리 숫자를 실제 테이블 수로 정정하고, 각 테이블을 독립 절로 분리하라. CrmIntegration, CrmRecordChangeLog, FieldMapping, ConflictRecord, CredentialAuditLog, NotificationOutbox까지 최소 필드·FK·UNIQUE·INDEX·expiresAt·partial unique를 전개하라."
    },
    {
      "id": "CS2-02",
      "severity": "blocking",
      "category": "Audit·PII 운영 가능성",
      "location": "docs/features/crm-sync.md:174, 183-190, 361-362, 483; docs/admin/REVIEW_WORKFLOW.md:669-673",
      "issue": "liveReadCrmDetail은 v1.0 운영 API로 정의되어 raw PII detail을 CRM에서 실시간 조회하지만, audit action `crm-live-read`는 CS-14로 v1.x patch deferred다. REVIEW_WORKFLOW §10.2.1에도 해당 AuditAction이 없다.",
      "impact": "raw PII 조회 기능이 감사 로그 없이 v1.0에 열리거나, 구현 시 audit insert가 실패한다. raw PII 저장 금지 정책을 live read로 보완한다는 핵심 운영 경로가 v1.0에서 성립하지 않는다.",
      "recommendation": "`crm-live-read` AuditAction을 v1.0 cascade에 포함하고 audit contract를 정의하라. 포함하지 않을 경우 liveReadCrmDetail 자체를 v1.x로 내리고 v1.0 read API는 displayHints만 허용해야 한다."
    },
    {
      "id": "CS2-03",
      "severity": "blocking",
      "category": "webhook verifier 추상화",
      "location": "docs/features/crm-sync.md:229-230, 242-250, 304-317",
      "issue": "ProviderWebhookVerifier 인터페이스가 provider 차이를 충분히 담지 못한다. §3.4는 timestamp/providerEventId를 verifier 입력처럼 쓰지만 §4.2 실제 호출은 verify(rawBody, headers, fullUrl, method)만 전달한다. Salesforce는 §5.1에서 Outbound Messages XML SOAP와 Platform Events를 모두 허용하면서도 verifier는 HMAC webhook secret 중심으로 설명한다. generic-rest-api의 canonical string, timestamp header명, eventId 추출 규칙도 config schema가 없다.",
      "impact": "Salesforce/HubSpot/generic 구현자가 서로 다른 검증 결과 shape를 임의로 만들게 되고, replay ledger와 timestamp tolerance가 provider별로 일관 적용되지 않는다.",
      "recommendation": "Verifier 결과 타입을 `{signatureValid, providerEventId?, providerTimestamp?, canonicalDigest, deliveryKind, retrySemantics}`처럼 고정하라. provider별 canonical string, 필수 header, eventId fallback, Salesforce SOAP/XML 처리 방식을 별도 adapter contract로 분리하라."
    },
    {
      "id": "CS2-04",
      "severity": "blocking",
      "category": "webhook replay·dedupe",
      "location": "docs/features/crm-sync.md:133-134, 158, 230, 249-253, 611-625",
      "issue": "nonce ledger retention이 config에서는 60분, retentionDays.webhookNonceLedger에서는 1일로 이중 정의된다. UNIQUE(integrationId, providerEventId)는 providerEventId가 없거나 provider 범위에서만 고유한 경우를 처리하지 못하고, signatureDigest는 저장하지만 unique에 포함되지 않는다. RRN rejected 이벤트도 nonce ledger에 기록되어 이후 동일 eventId 재전송이 dedupe 처리될 수 있다.",
      "impact": "replay 방지와 provider 재전송 idempotency가 모두 불안정하다. 특히 false positive RRN 또는 transient parse 실패 후 provider 재전송을 운영자가 복구하기 어렵다.",
      "recommendation": "retention SoT를 하나로 통일하고, ledger key를 provider별 eventId 필수/선택 여부에 따라 `(integrationId, providerEventId)` 또는 `(integrationId, signatureDigest, receivedBucket)`로 명시하라. rejected 상태는 dedupe 차단 대상인지 재처리 가능 대상인지 status enum으로 분리하라."
    },
    {
      "id": "CS2-05",
      "severity": "blocking",
      "category": "PII 저장 금지·validator",
      "location": "docs/features/crm-sync.md:150, 355-362, 459, 571-583",
      "issue": "PII Redaction Validator가 'schema 검증'으로 raw PII 저장을 막는다고 하지만, CrmRecord.displayHints, changedFields, snapshots가 JSON이면 schema만으로 raw 이름·전화·이메일·주소 삽입을 안정적으로 차단할 수 없다. §10.4는 raw PII가 row insert된 뒤 drift 감지한다고 하여 예방과 사후 탐지가 섞여 있다.",
      "impact": "raw PII 저장 금지라는 v1.0 핵심 원칙이 구현 가능한 수준으로 강제되지 않는다. 충돌 snapshot과 change log가 다시 PII 저장소가 될 수 있다.",
      "recommendation": "displayHints를 closed schema로 고정하고 arbitrary JSON을 금지하라. changedFields/snapshot은 allowlisted field token + masked value만 허용하고, DB CHECK 또는 application validator 실패 시 insert 자체를 reject해야 한다. drift 감지는 사후 보조 invariant로만 두라."
    },
    {
      "id": "CS2-06",
      "severity": "blocking",
      "category": "outbound-only mode",
      "location": "docs/features/crm-sync.md:120-128, 170-173, 216, 428-446",
      "issue": "outbound-only 차단은 runSync/processInboundWebhook/conflictResolution 일부에만 있다. CrmFieldMapping에는 direction 또는 inbound mapping 금지 규칙이 없고, bi-directional 전용 webhookSecret required와 outbound-only endpoint 미등록 규칙도 build matrix로 분리되지 않았다. HTTP 404와 runtime fail의 경계도 endpoint 호출은 404, command 호출은 runtime fail로만 암묵적이다.",
      "impact": "outbound-only 인스턴스에서 inbound field mapping이나 conflict queue가 구성될 수 있고, 내부 command 경로로 inbound 처리가 우회될 수 있다.",
      "recommendation": "mode별 command/event/error matrix를 별도로 추가하라. outbound-only에서는 inbound webhook route 미등록, processInboundWebhook direct invocation runtime fail, runSync inbound/both fail, inbound FieldMapping build fail, conflictResolution은 전 entity outbound-only-no-conflict만 허용을 명시하라."
    },
    {
      "id": "CS2-07",
      "severity": "blocking",
      "category": "동의·법적 근거",
      "location": "docs/features/crm-sync.md:174, 242-258, 376-380, 489-491; docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:375-379",
      "issue": "patientConsentEvidenceRef와 동의 철회 처리가 v1.x로 deferred인데, v1.0은 inbound webhook으로 환자 컨택트 displayHints를 만들고 liveReadCrmDetail로 raw PII를 조회할 수 있다. DPA만으로 환자 단위 live read의 적법성·철회 상태 확인을 대체한다고 보기 어렵다.",
      "impact": "솔루션 DB에 raw PII를 저장하지 않더라도, 운영자가 CRM raw detail을 조회하는 순간 record-level 법적 근거와 감사 추적이 필요하다. CS-07/CS-14 deferred가 v1.0 운영 차단 요인이 된다.",
      "recommendation": "v1.0에서 liveRead를 제거하거나, 최소한 CRM record에 대한 consent/withdrawal 상태를 live precheck하는 provider contract와 audit metadata를 추가하라. patientConsentEvidenceRef를 저장하지 않는다면 '조회 전 CRM에서 동의 상태 확인 실패 시 deny' 규칙이 필요하다."
    },
    {
      "id": "CS2-08",
      "severity": "major",
      "category": "field-level conflict·CAS",
      "location": "docs/features/crm-sync.md:263-281, 571-579, 589-593",
      "issue": "FieldAuthority와 CAS 비교 규칙은 추가됐지만 race condition 방지가 없다. CrmRecord row lock, per-field version, transaction boundary, compare-and-set update 조건이 없고, appliedVersion이 record 전체 버전인지 field 버전인지 conflict 버전인지 불명확하다.",
      "impact": "동시 inbound webhook과 outbound push가 같은 CrmRecord를 갱신하면 더 높은 version 비교 후에도 lost update가 발생할 수 있다. manual resolve 후 동일 충돌 재발 방지도 field 단위로 보장되지 않는다.",
      "recommendation": "CrmRecord 갱신은 `WHERE id=? AND solutionVersion=? AND crmVersion=?` CAS 또는 `SELECT FOR UPDATE`로 고정하라. ConflictRecord에는 fieldPath별 baseVersion/winningVersion/appliedVersion을 저장하고, manual escalate 조건을 결정표로 분리하라."
    },
    {
      "id": "CS2-09",
      "severity": "major",
      "category": "credential rotation 동시성",
      "location": "docs/features/crm-sync.md:141-142, 287-299, 594-596",
      "issue": "credential rotation 상태 머신은 문장으로만 있고 CrmIntegration 또는 별도 CredentialVersion schema에 state, activeSecretRef, previousSecretRef, graceUntil, rotationAttemptId가 없다. rotating 중 outbound API 호출과 inbound webhook signature 검증이 old/new credential 중 무엇을 쓰는지도 정의되지 않았다.",
      "impact": "rotation 중 일부 worker는 old credential, 일부 worker는 new credential을 사용해 비결정적 실패가 발생할 수 있다. old credential fallback이 잘못된 inbound signature를 허용하거나, commit/revoke 순서에서 sync 중단이 생길 수 있다.",
      "recommendation": "CredentialVersion 또는 CrmIntegration credential fields를 전개하라. rotating 중 outbound는 new 우선 old fallback인지, inbound verifier는 old+new 병행 허용인지, grace 종료 후 revoke/reconcile을 어떻게 하는지 상태별 matrix로 명시하라."
    },
    {
      "id": "CS2-10",
      "severity": "major",
      "category": "RRN false positive 복구",
      "location": "docs/features/crm-sync.md:252-253, 364-374, 440-443, 611-625",
      "issue": "RRN 검출 시 payload를 폐기하고 fingerprint만 남기지만 false positive 판정 시 운영자 복구 경로가 없다. 특히 ledger에 providerEventId가 이미 들어가면 provider가 동일 eventId로 재전송해도 dedupe 처리될 수 있다.",
      "impact": "정상 예약·문의가 RRN false positive로 영구 유실될 수 있다. raw payload 저장 금지와 운영 복구 요구가 충돌한다.",
      "recommendation": "rejected-rrn-detected ledger 상태는 processed와 분리하고, 운영자 override 후 동일 providerEventId 재처리 허용 또는 CRM live pull by externalId 복구 command를 정의하라. fingerprint만으로 복구 불가하다는 제약도 명시해야 한다."
    },
    {
      "id": "CS2-11",
      "severity": "major",
      "category": "Notification outbox idempotency",
      "location": "docs/features/crm-sync.md:327-346, 626-628",
      "issue": "`crm-sync-credential-expiring-soon`과 `crm-sync-credential-expired`는 sourceKind=integration, sourceId=integrationId, eventType unique라서 credential rotation 후 같은 integration에서 새 credential이 다시 만료 임박해도 새 outbox row 생성이 차단될 수 있다. sourceEventId에도 credentialVersion 또는 expiresAt이 없다.",
      "impact": "credential lifecycle이 반복되는 장기 운영에서 두 번째 이후 만료 임박/만료 알림이 누락될 수 있다.",
      "recommendation": "credential 알림 sourceId를 credentialVersionId 또는 `integrationId:credentialExpiresAt` 기반으로 잡거나, sourceKind/sourceId/eventType unique에 credentialVersion을 포함하라."
    },
    {
      "id": "CS2-12",
      "severity": "major",
      "category": "retry/outbox 패턴 정합성",
      "location": "docs/features/crm-sync.md:283-285, 550-569, 626-628; docs/features/search-visibility.md:630-642; docs/features/keyword-monitoring.md:406-421",
      "issue": "search-visibility/keyword-monitoring 안정판은 SKIP LOCKED, advisory lock, status 전이, 원자성 invariant를 구체화했는데 crm-sync는 '패턴 동일'이라고만 하고 worker SQL과 lock ordering을 복제하지 않았다. RetryQueue에도 maxAttempts, expiresAt, unique idempotency key, permanent 전이 조건이 없다.",
      "impact": "외부 CRM 연동 장애 시 중복 push, stuck processing, exhausted 전이 누락이 발생할 수 있다. CS1-08이 충분히 해결되지 않았다.",
      "recommendation": "SearchVisibilityCollectionRetryQueue 수준의 worker SoT SQL을 crm-sync에 직접 복제하라. pushOutbound idempotency key, retryable/permanent error class, lockedAt 재claim, advisory lock key, exhausted alert 전이를 고정하라."
    },
    {
      "id": "CS2-13",
      "severity": "major",
      "category": "retention·purge worker",
      "location": "docs/features/crm-sync.md:154-158, 571-579, 581-593, 626-628",
      "issue": "retentionDays는 syncLog/changeLog/conflictRecord/webhookNonceLedger만 있고 displayHintsRetentionDays는 CrmRecord의 `piiRetentionExpiresAt` 인덱스 언급과 연결되지만 실제 필드 schema가 없다. NotificationOutbox와 RetryQueue retention도 없다. purge worker SoT가 본 Feature 내부인지 notifications/analytics 패턴 재사용인지 불명확하다.",
      "impact": "보존 기간이 schema와 worker에 연결되지 않아 개인정보 최소 보존과 운영 로그 보존이 동시에 흔들린다.",
      "recommendation": "각 retention 대상 테이블의 expiresAt 산정식을 명시하고 purge worker 책임 범위를 분리하라. CrmRecord displayHints 만료 시 UI degrade 정책과 field nulling 정책을 v1.0에서 결정하라."
    },
    {
      "id": "CS2-14",
      "severity": "major",
      "category": "credential fingerprint",
      "location": "docs/features/crm-sync.md:192-193, 594-596",
      "issue": "credential fingerprint 공식이 `HMAC-SHA256(secret-manager-key-id, \"crm-credential-fingerprint\")`로 되어 있어 credential 값이나 secret version을 입력에 포함하지 않는다. 같은 secret-manager key-id를 쓰는 credential은 동일 fingerprint가 된다.",
      "impact": "rotation audit에서 prior/new credential이 실제로 달라졌는지 검증할 수 없다. non-reversible이라는 목적은 맞지만 식별자로서 기능하지 않는다.",
      "recommendation": "raw secret을 직접 저장하지 않되, secret manager의 immutable version id 또는 provider credential public id를 HMAC message에 포함하라. 예: `HMAC(auditPepper, integrationId + secretVersionId)`."
    },
    {
      "id": "CS2-15",
      "severity": "major",
      "category": "운영 이벤트 SoT",
      "location": "docs/features/crm-sync.md:198-211, 483-491",
      "issue": "ReservationSubmission, Inquiry, ConversionEvent는 v1.0 sync 대상이라고 하지만 CONTENT_STANDARDS submission/event 인터페이스 cascade가 CS-15 open으로 남아 있다. Contact도 placeholder 타입이다.",
      "impact": "ReservationPage 자체를 sync 대상에서 제거한 CS1-02는 해결됐지만, 대체 운영 이벤트의 canonical schema가 없어 FieldMapping과 validator가 실제 경로를 검증할 수 없다.",
      "recommendation": "v1.0에서 필요한 ReservationSubmission/Inquiry/ConversionEvent/Contact 최소 계약을 본 문서 내부에 완전히 정의하거나, CONTENT_STANDARDS cascade를 v1.0 blocker로 올려 완료하라."
    },
    {
      "id": "CS2-16",
      "severity": "minor",
      "category": "acceptance test coverage",
      "location": "docs/features/crm-sync.md:401-408",
      "issue": "acceptance fixture 6개는 1차 회귀 일부만 막는다. liveRead audit, PII validator closed schema, DB constraint inventory, credential rotation 중 inbound/outbound 동시성, CAS lost update, outbox credentialVersion dedupe, purge worker는 테스트 대상이 아니다.",
      "impact": "v1.0 안정판에서 이번 v0.2 신규 메커니즘의 핵심 위험이 자동 회귀 방지되지 않는다.",
      "recommendation": "§8.2에 동시성/DB constraint/PII closed schema/audit cascade/purge/outbox idempotency fixture를 추가하라."
    },
    {
      "id": "CS2-17",
      "severity": "minor",
      "category": "1차 지적 재발 평가",
      "location": "docs/features/crm-sync.md:508; docs/admin/REVIEW_WORKFLOW.md:503-507, 669-673; docs/core/DATA_MODEL.md:596-713",
      "issue": "변경 이력은 21개 전건 수용이라고 하지만 실제 재발 상태는 혼재다. CS1-01, CS1-02, CS1-03, CS1-06, CS1-12, CS1-16은 대체로 정정됐다. 반면 CS1-04, CS1-05, CS1-07, CS1-08, CS1-09, CS1-10, CS1-13, CS1-14, CS1-20, CS1-21은 구현 가능성 또는 테스트 범위에서 부분 재발한다.",
      "impact": "수용 완료 표기가 실제 안정판 readiness를 과대평가한다.",
      "recommendation": "변경 이력에는 '반영' 대신 '검토 필요 잔여 리스크'를 분리하고, 본 2차 지적 중 1차 재발 항목을 별도 resolved checklist로 추적하라."
    }
  ],
  "required_next_actions": [
    "DB 인벤토리와 §13 schema를 실제 테이블 수 기준으로 재작성하고 FK·UNIQUE·INDEX·expiresAt·worker SoT를 모두 전개한다.",
    "`crm-live-read` audit cascade를 v1.0으로 올리거나 liveReadCrmDetail을 v1.x로 내린다.",
    "ProviderWebhookVerifier 결과 타입, provider별 canonicalization, nonce ledger key/retention/rejected 상태를 재설계한다.",
    "PII Redaction Validator를 closed schema + insert-time reject 방식으로 바꾸고 JSON 자유 필드를 제거한다.",
    "outbound-only, credential rotation, CAS conflict resolution을 상태별 matrix와 transaction/CAS 조건으로 고정한다.",
    "ReservationSubmission/Inquiry/ConversionEvent/Contact의 v1.0 canonical schema를 확정하거나 CS-15를 blocker로 승격한다."
  ],
  "stability_assessment": {
    "SoT_alignment": "partial",
    "cycle1_regression_status": "partial_regression",
    "external_integration_reliability": "fail",
    "webhook_security": "fail",
    "PII_medical_law_domain": "fail",
    "conflict_resolution": "partial",
    "credential_rotation": "partial",
    "outbound_only_mode": "partial",
    "db_schema_completeness": "fail",
    "operational_reliability": "partial",
    "acceptance_test_coverage": "partial"
  }
}
tokens used
64,288
{
  "feature": "crm-sync",
  "version_reviewed": "v0.2",
  "cycle": 2,
  "verdict": "needs_major_revision",
  "summary": {
    "overall": "v0.2는 1차 21개 지적 중 SoT cascade, provider 범위, ReservationPage 경계, RRN deny, DPA 분리 등은 상당 부분 실제 반영됐다. 그러나 webhook replay, PII 저장 금지의 구현 가능성, liveRead audit, DB 인벤토리, rotation 동시성, field-level CAS는 여전히 구현 가능한 계약 수준에 못 미친다.",
    "blocking_count": 7,
    "major_count": 8,
    "minor_count": 2
  },
  "findings": [
    {
      "id": "CS2-01",
      "severity": "blocking",
      "category": "DB 인벤토리·명세 정합성",
      "location": "docs/features/crm-sync.md:25, 412, 512-626",
      "issue": "문서는 DB 10 tables라고 선언하지만 §13은 CrmRateLimitState와 CrmWebhookNonceLedger를 한 절에 묶어도 실제로는 CrmIntegration, SyncLog, SourceAttempt, RetryQueue, Record, ChangeLog, FieldMapping, ConflictRecord, CredentialAuditLog, RateLimitState, WebhookNonceLedger, NotificationOutbox까지 12개 논리 테이블이다. 또한 CrmIntegration은 '§3.2 shape'라고 되어 있는데 §3.2는 sync entity 정의라 참조가 틀렸고, 여러 테이블은 v0.1 유지로 핵심 필드·FK·INDEX가 생략되어 있다.",
      "impact": "migration 작성자가 실제 테이블 수와 FK/retention 범위를 확정할 수 없다. CS1-13/CS1-14가 표면적으로만 해결된 상태다.",
      "recommendation": "인벤토리 숫자를 실제 테이블 수로 정정하고, 각 테이블을 독립 절로 분리하라. CrmIntegration, CrmRecordChangeLog, FieldMapping, ConflictRecord, CredentialAuditLog, NotificationOutbox까지 최소 필드·FK·UNIQUE·INDEX·expiresAt·partial unique를 전개하라."
    },
    {
      "id": "CS2-02",
      "severity": "blocking",
      "category": "Audit·PII 운영 가능성",
      "location": "docs/features/crm-sync.md:174, 183-190, 361-362, 483; docs/admin/REVIEW_WORKFLOW.md:669-673",
      "issue": "liveReadCrmDetail은 v1.0 운영 API로 정의되어 raw PII detail을 CRM에서 실시간 조회하지만, audit action `crm-live-read`는 CS-14로 v1.x patch deferred다. REVIEW_WORKFLOW §10.2.1에도 해당 AuditAction이 없다.",
      "impact": "raw PII 조회 기능이 감사 로그 없이 v1.0에 열리거나, 구현 시 audit insert가 실패한다. raw PII 저장 금지 정책을 live read로 보완한다는 핵심 운영 경로가 v1.0에서 성립하지 않는다.",
      "recommendation": "`crm-live-read` AuditAction을 v1.0 cascade에 포함하고 audit contract를 정의하라. 포함하지 않을 경우 liveReadCrmDetail 자체를 v1.x로 내리고 v1.0 read API는 displayHints만 허용해야 한다."
    },
    {
      "id": "CS2-03",
      "severity": "blocking",
      "category": "webhook verifier 추상화",
      "location": "docs/features/crm-sync.md:229-230, 242-250, 304-317",
      "issue": "ProviderWebhookVerifier 인터페이스가 provider 차이를 충분히 담지 못한다. §3.4는 timestamp/providerEventId를 verifier 입력처럼 쓰지만 §4.2 실제 호출은 verify(rawBody, headers, fullUrl, method)만 전달한다. Salesforce는 §5.1에서 Outbound Messages XML SOAP와 Platform Events를 모두 허용하면서도 verifier는 HMAC webhook secret 중심으로 설명한다. generic-rest-api의 canonical string, timestamp header명, eventId 추출 규칙도 config schema가 없다.",
      "impact": "Salesforce/HubSpot/generic 구현자가 서로 다른 검증 결과 shape를 임의로 만들게 되고, replay ledger와 timestamp tolerance가 provider별로 일관 적용되지 않는다.",
      "recommendation": "Verifier 결과 타입을 `{signatureValid, providerEventId?, providerTimestamp?, canonicalDigest, deliveryKind, retrySemantics}`처럼 고정하라. provider별 canonical string, 필수 header, eventId fallback, Salesforce SOAP/XML 처리 방식을 별도 adapter contract로 분리하라."
    },
    {
      "id": "CS2-04",
      "severity": "blocking",
      "category": "webhook replay·dedupe",
      "location": "docs/features/crm-sync.md:133-134, 158, 230, 249-253, 611-625",
      "issue": "nonce ledger retention이 config에서는 60분, retentionDays.webhookNonceLedger에서는 1일로 이중 정의된다. UNIQUE(integrationId, providerEventId)는 providerEventId가 없거나 provider 범위에서만 고유한 경우를 처리하지 못하고, signatureDigest는 저장하지만 unique에 포함되지 않는다. RRN rejected 이벤트도 nonce ledger에 기록되어 이후 동일 eventId 재전송이 dedupe 처리될 수 있다.",
      "impact": "replay 방지와 provider 재전송 idempotency가 모두 불안정하다. 특히 false positive RRN 또는 transient parse 실패 후 provider 재전송을 운영자가 복구하기 어렵다.",
      "recommendation": "retention SoT를 하나로 통일하고, ledger key를 provider별 eventId 필수/선택 여부에 따라 `(integrationId, providerEventId)` 또는 `(integrationId, signatureDigest, receivedBucket)`로 명시하라. rejected 상태는 dedupe 차단 대상인지 재처리 가능 대상인지 status enum으로 분리하라."
    },
    {
      "id": "CS2-05",
      "severity": "blocking",
      "category": "PII 저장 금지·validator",
      "location": "docs/features/crm-sync.md:150, 355-362, 459, 571-583",
      "issue": "PII Redaction Validator가 'schema 검증'으로 raw PII 저장을 막는다고 하지만, CrmRecord.displayHints, changedFields, snapshots가 JSON이면 schema만으로 raw 이름·전화·이메일·주소 삽입을 안정적으로 차단할 수 없다. §10.4는 raw PII가 row insert된 뒤 drift 감지한다고 하여 예방과 사후 탐지가 섞여 있다.",
      "impact": "raw PII 저장 금지라는 v1.0 핵심 원칙이 구현 가능한 수준으로 강제되지 않는다. 충돌 snapshot과 change log가 다시 PII 저장소가 될 수 있다.",
      "recommendation": "displayHints를 closed schema로 고정하고 arbitrary JSON을 금지하라. changedFields/snapshot은 allowlisted field token + masked value만 허용하고, DB CHECK 또는 application validator 실패 시 insert 자체를 reject해야 한다. drift 감지는 사후 보조 invariant로만 두라."
    },
    {
      "id": "CS2-06",
      "severity": "blocking",
      "category": "outbound-only mode",
      "location": "docs/features/crm-sync.md:120-128, 170-173, 216, 428-446",
      "issue": "outbound-only 차단은 runSync/processInboundWebhook/conflictResolution 일부에만 있다. CrmFieldMapping에는 direction 또는 inbound mapping 금지 규칙이 없고, bi-directional 전용 webhookSecret required와 outbound-only endpoint 미등록 규칙도 build matrix로 분리되지 않았다. HTTP 404와 runtime fail의 경계도 endpoint 호출은 404, command 호출은 runtime fail로만 암묵적이다.",
      "impact": "outbound-only 인스턴스에서 inbound field mapping이나 conflict queue가 구성될 수 있고, 내부 command 경로로 inbound 처리가 우회될 수 있다.",
      "recommendation": "mode별 command/event/error matrix를 별도로 추가하라. outbound-only에서는 inbound webhook route 미등록, processInboundWebhook direct invocation runtime fail, runSync inbound/both fail, inbound FieldMapping build fail, conflictResolution은 전 entity outbound-only-no-conflict만 허용을 명시하라."
    },
    {
      "id": "CS2-07",
      "severity": "blocking",
      "category": "동의·법적 근거",
      "location": "docs/features/crm-sync.md:174, 242-258, 376-380, 489-491; docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:375-379",
      "issue": "patientConsentEvidenceRef와 동의 철회 처리가 v1.x로 deferred인데, v1.0은 inbound webhook으로 환자 컨택트 displayHints를 만들고 liveReadCrmDetail로 raw PII를 조회할 수 있다. DPA만으로 환자 단위 live read의 적법성·철회 상태 확인을 대체한다고 보기 어렵다.",
      "impact": "솔루션 DB에 raw PII를 저장하지 않더라도, 운영자가 CRM raw detail을 조회하는 순간 record-level 법적 근거와 감사 추적이 필요하다. CS-07/CS-14 deferred가 v1.0 운영 차단 요인이 된다.",
      "recommendation": "v1.0에서 liveRead를 제거하거나, 최소한 CRM record에 대한 consent/withdrawal 상태를 live precheck하는 provider contract와 audit metadata를 추가하라. patientConsentEvidenceRef를 저장하지 않는다면 '조회 전 CRM에서 동의 상태 확인 실패 시 deny' 규칙이 필요하다."
    },
    {
      "id": "CS2-08",
      "severity": "major",
      "category": "field-level conflict·CAS",
      "location": "docs/features/crm-sync.md:263-281, 571-579, 589-593",
      "issue": "FieldAuthority와 CAS 비교 규칙은 추가됐지만 race condition 방지가 없다. CrmRecord row lock, per-field version, transaction boundary, compare-and-set update 조건이 없고, appliedVersion이 record 전체 버전인지 field 버전인지 conflict 버전인지 불명확하다.",
      "impact": "동시 inbound webhook과 outbound push가 같은 CrmRecord를 갱신하면 더 높은 version 비교 후에도 lost update가 발생할 수 있다. manual resolve 후 동일 충돌 재발 방지도 field 단위로 보장되지 않는다.",
      "recommendation": "CrmRecord 갱신은 `WHERE id=? AND solutionVersion=? AND crmVersion=?` CAS 또는 `SELECT FOR UPDATE`로 고정하라. ConflictRecord에는 fieldPath별 baseVersion/winningVersion/appliedVersion을 저장하고, manual escalate 조건을 결정표로 분리하라."
    },
    {
      "id": "CS2-09",
      "severity": "major",
      "category": "credential rotation 동시성",
      "location": "docs/features/crm-sync.md:141-142, 287-299, 594-596",
      "issue": "credential rotation 상태 머신은 문장으로만 있고 CrmIntegration 또는 별도 CredentialVersion schema에 state, activeSecretRef, previousSecretRef, graceUntil, rotationAttemptId가 없다. rotating 중 outbound API 호출과 inbound webhook signature 검증이 old/new credential 중 무엇을 쓰는지도 정의되지 않았다.",
      "impact": "rotation 중 일부 worker는 old credential, 일부 worker는 new credential을 사용해 비결정적 실패가 발생할 수 있다. old credential fallback이 잘못된 inbound signature를 허용하거나, commit/revoke 순서에서 sync 중단이 생길 수 있다.",
      "recommendation": "CredentialVersion 또는 CrmIntegration credential fields를 전개하라. rotating 중 outbound는 new 우선 old fallback인지, inbound verifier는 old+new 병행 허용인지, grace 종료 후 revoke/reconcile을 어떻게 하는지 상태별 matrix로 명시하라."
    },
    {
      "id": "CS2-10",
      "severity": "major",
      "category": "RRN false positive 복구",
      "location": "docs/features/crm-sync.md:252-253, 364-374, 440-443, 611-625",
      "issue": "RRN 검출 시 payload를 폐기하고 fingerprint만 남기지만 false positive 판정 시 운영자 복구 경로가 없다. 특히 ledger에 providerEventId가 이미 들어가면 provider가 동일 eventId로 재전송해도 dedupe 처리될 수 있다.",
      "impact": "정상 예약·문의가 RRN false positive로 영구 유실될 수 있다. raw payload 저장 금지와 운영 복구 요구가 충돌한다.",
      "recommendation": "rejected-rrn-detected ledger 상태는 processed와 분리하고, 운영자 override 후 동일 providerEventId 재처리 허용 또는 CRM live pull by externalId 복구 command를 정의하라. fingerprint만으로 복구 불가하다는 제약도 명시해야 한다."
    },
    {
      "id": "CS2-11",
      "severity": "major",
      "category": "Notification outbox idempotency",
      "location": "docs/features/crm-sync.md:327-346, 626-628",
      "issue": "`crm-sync-credential-expiring-soon`과 `crm-sync-credential-expired`는 sourceKind=integration, sourceId=integrationId, eventType unique라서 credential rotation 후 같은 integration에서 새 credential이 다시 만료 임박해도 새 outbox row 생성이 차단될 수 있다. sourceEventId에도 credentialVersion 또는 expiresAt이 없다.",
      "impact": "credential lifecycle이 반복되는 장기 운영에서 두 번째 이후 만료 임박/만료 알림이 누락될 수 있다.",
      "recommendation": "credential 알림 sourceId를 credentialVersionId 또는 `integrationId:credentialExpiresAt` 기반으로 잡거나, sourceKind/sourceId/eventType unique에 credentialVersion을 포함하라."
    },
    {
      "id": "CS2-12",
      "severity": "major",
      "category": "retry/outbox 패턴 정합성",
      "location": "docs/features/crm-sync.md:283-285, 550-569, 626-628; docs/features/search-visibility.md:630-642; docs/features/keyword-monitoring.md:406-421",
      "issue": "search-visibility/keyword-monitoring 안정판은 SKIP LOCKED, advisory lock, status 전이, 원자성 invariant를 구체화했는데 crm-sync는 '패턴 동일'이라고만 하고 worker SQL과 lock ordering을 복제하지 않았다. RetryQueue에도 maxAttempts, expiresAt, unique idempotency key, permanent 전이 조건이 없다.",
      "impact": "외부 CRM 연동 장애 시 중복 push, stuck processing, exhausted 전이 누락이 발생할 수 있다. CS1-08이 충분히 해결되지 않았다.",
      "recommendation": "SearchVisibilityCollectionRetryQueue 수준의 worker SoT SQL을 crm-sync에 직접 복제하라. pushOutbound idempotency key, retryable/permanent error class, lockedAt 재claim, advisory lock key, exhausted alert 전이를 고정하라."
    },
    {
      "id": "CS2-13",
      "severity": "major",
      "category": "retention·purge worker",
      "location": "docs/features/crm-sync.md:154-158, 571-579, 581-593, 626-628",
      "issue": "retentionDays는 syncLog/changeLog/conflictRecord/webhookNonceLedger만 있고 displayHintsRetentionDays는 CrmRecord의 `piiRetentionExpiresAt` 인덱스 언급과 연결되지만 실제 필드 schema가 없다. NotificationOutbox와 RetryQueue retention도 없다. purge worker SoT가 본 Feature 내부인지 notifications/analytics 패턴 재사용인지 불명확하다.",
      "impact": "보존 기간이 schema와 worker에 연결되지 않아 개인정보 최소 보존과 운영 로그 보존이 동시에 흔들린다.",
      "recommendation": "각 retention 대상 테이블의 expiresAt 산정식을 명시하고 purge worker 책임 범위를 분리하라. CrmRecord displayHints 만료 시 UI degrade 정책과 field nulling 정책을 v1.0에서 결정하라."
    },
    {
      "id": "CS2-14",
      "severity": "major",
      "category": "credential fingerprint",
      "location": "docs/features/crm-sync.md:192-193, 594-596",
      "issue": "credential fingerprint 공식이 `HMAC-SHA256(secret-manager-key-id, \"crm-credential-fingerprint\")`로 되어 있어 credential 값이나 secret version을 입력에 포함하지 않는다. 같은 secret-manager key-id를 쓰는 credential은 동일 fingerprint가 된다.",
      "impact": "rotation audit에서 prior/new credential이 실제로 달라졌는지 검증할 수 없다. non-reversible이라는 목적은 맞지만 식별자로서 기능하지 않는다.",
      "recommendation": "raw secret을 직접 저장하지 않되, secret manager의 immutable version id 또는 provider credential public id를 HMAC message에 포함하라. 예: `HMAC(auditPepper, integrationId + secretVersionId)`."
    },
    {
      "id": "CS2-15",
      "severity": "major",
      "category": "운영 이벤트 SoT",
      "location": "docs/features/crm-sync.md:198-211, 483-491",
      "issue": "ReservationSubmission, Inquiry, ConversionEvent는 v1.0 sync 대상이라고 하지만 CONTENT_STANDARDS submission/event 인터페이스 cascade가 CS-15 open으로 남아 있다. Contact도 placeholder 타입이다.",
      "impact": "ReservationPage 자체를 sync 대상에서 제거한 CS1-02는 해결됐지만, 대체 운영 이벤트의 canonical schema가 없어 FieldMapping과 validator가 실제 경로를 검증할 수 없다.",
      "recommendation": "v1.0에서 필요한 ReservationSubmission/Inquiry/ConversionEvent/Contact 최소 계약을 본 문서 내부에 완전히 정의하거나, CONTENT_STANDARDS cascade를 v1.0 blocker로 올려 완료하라."
    },
    {
      "id": "CS2-16",
      "severity": "minor",
      "category": "acceptance test coverage",
      "location": "docs/features/crm-sync.md:401-408",
      "issue": "acceptance fixture 6개는 1차 회귀 일부만 막는다. liveRead audit, PII validator closed schema, DB constraint inventory, credential rotation 중 inbound/outbound 동시성, CAS lost update, outbox credentialVersion dedupe, purge worker는 테스트 대상이 아니다.",
      "impact": "v1.0 안정판에서 이번 v0.2 신규 메커니즘의 핵심 위험이 자동 회귀 방지되지 않는다.",
      "recommendation": "§8.2에 동시성/DB constraint/PII closed schema/audit cascade/purge/outbox idempotency fixture를 추가하라."
    },
    {
      "id": "CS2-17",
      "severity": "minor",
      "category": "1차 지적 재발 평가",
      "location": "docs/features/crm-sync.md:508; docs/admin/REVIEW_WORKFLOW.md:503-507, 669-673; docs/core/DATA_MODEL.md:596-713",
      "issue": "변경 이력은 21개 전건 수용이라고 하지만 실제 재발 상태는 혼재다. CS1-01, CS1-02, CS1-03, CS1-06, CS1-12, CS1-16은 대체로 정정됐다. 반면 CS1-04, CS1-05, CS1-07, CS1-08, CS1-09, CS1-10, CS1-13, CS1-14, CS1-20, CS1-21은 구현 가능성 또는 테스트 범위에서 부분 재발한다.",
      "impact": "수용 완료 표기가 실제 안정판 readiness를 과대평가한다.",
      "recommendation": "변경 이력에는 '반영' 대신 '검토 필요 잔여 리스크'를 분리하고, 본 2차 지적 중 1차 재발 항목을 별도 resolved checklist로 추적하라."
    }
  ],
  "required_next_actions": [
    "DB 인벤토리와 §13 schema를 실제 테이블 수 기준으로 재작성하고 FK·UNIQUE·INDEX·expiresAt·worker SoT를 모두 전개한다.",
    "`crm-live-read` audit cascade를 v1.0으로 올리거나 liveReadCrmDetail을 v1.x로 내린다.",
    "ProviderWebhookVerifier 결과 타입, provider별 canonicalization, nonce ledger key/retention/rejected 상태를 재설계한다.",
    "PII Redaction Validator를 closed schema + insert-time reject 방식으로 바꾸고 JSON 자유 필드를 제거한다.",
    "outbound-only, credential rotation, CAS conflict resolution을 상태별 matrix와 transaction/CAS 조건으로 고정한다.",
    "ReservationSubmission/Inquiry/ConversionEvent/Contact의 v1.0 canonical schema를 확정하거나 CS-15를 blocker로 승격한다."
  ],
  "stability_assessment": {
    "SoT_alignment": "partial",
    "cycle1_regression_status": "partial_regression",
    "external_integration_reliability": "fail",
    "webhook_security": "fail",
    "PII_medical_law_domain": "fail",
    "conflict_resolution": "partial",
    "credential_rotation": "partial",
    "outbound_only_mode": "partial",
    "db_schema_completeness": "fail",
    "operational_reliability": "partial",
    "acceptance_test_coverage": "partial"
  }
}


 succeeded in 679ms:
# Core — 데이터 계약 명세

> **상태**: Draft v0.19
> **작성일**: 2026-05-14 (v0.18 → v0.19 — `features/crm-sync.md` 1차 사이클 cascade: C-08 `crmSyncConfig`(CrmSyncConfig·CrmIntegrationEntry 신설 — provider salesforce·hubspot·generic-rest-api 3종 한정·korean-emr build fail·dpaEvidenceRef vs patientConsentEvidenceRef 분리) + `crmSyncPolicyVersion`)
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

> 동작 옵션(`mode`·`syncSchedule`·`entities`·`fieldMappingPolicyVersion`·`retryQueue`·`credentialRotation`·`pii`·`retentionDays` 등)은 `features[name="crm-sync"].config` SoT (`features/crm-sync.md` § 2.3).

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
| 2026-05-14 | v0.18 | **`features/asset-ingestion.md` 1차 사이클 cascade**: (1) **C-08 `assetIngestionConfig` 신설** (AssetIngestionConfig — sources webCrawl/snsApi/manualUpload/csvImport), (2) **C-08 `assetIngestionPolicyVersion`** (6 Feature policyVersion 동일 패턴), (3) **`AssetIngestionApprovedScope` 신규** — SerpCrawlerApprovedScope의 SERP 특화 필드 제거·자산 수집 특화(allowedDomains·allowedPathPrefixes·maxPagesPerCrawl·maxAssetSizeMb·artifactRetentionDaysMax) |
| 2026-05-14 | v0.17 | **`features/keyword-monitoring.md` 1차 사이클 cascade**: (1) **C-08 `keywordMonitoringConfig` 신설** (KeywordMonitoringConfig — search-visibility의 SerpCrawlerApprovedScope 게이트 패턴 재사용), (2) **C-08 `keywordMonitoringPolicyVersion`** (top-level, 4 Feature policyVersion 동일 패턴) |
| 2026-05-14 | v0.16 | **`features/search-visibility.md` 1차 사이클 cascade**: (1) **C-08 `searchVisibilityConfig` 신설** (SearchVisibilityConfig — serpCrawler/backlinkSource, serpCrawler.enabled=true + legalApproved 게이트 fail-gate), (2) **C-08 `searchVisibilityPolicyVersion`** (top-level, notifications·analytics 패턴 동일) |
| 2026-05-14 | v0.15 | **`features/analytics-reporting.md` 4차 사이클 cascade**: (1) **C-08 `analyticsPolicyVersion` 신설** — notifications policyVersion 패턴 동일 (필수, 패키지 병렬 보관), (2) **C-10 `mediaThresholdOperationalInput` 슬롯 분리** — rolling-90 operational snapshot은 본 슬롯, calendar 확정 판정은 `mediaThresholdAssessment` 슬롯. published record는 calendar 값만 (AR4-08) |
| 2026-05-14 | v0.14 | **`features/analytics-reporting.md` 1차 사이클 cascade**: (1) **C-08 `analyticsConfig` 신설** — `AnalyticsConfig`(sources.gsc·naverSearchAdvisor·ga4·rum 자격증명·사이트 식별자만, 동작 옵션은 `features.analytics-reporting.config`로 분리), (2) **C-10 `mediaThresholdAssessment` 슬롯** — `MediaThresholdAssessment` 신설(assessmentBasisDate·windowStart/End·rollingAverageDailyUsers·thresholdReached·primarySource·sourceCompleteness·timezone·calendarPolicy·botFilteringPolicy·legalBasisNote). priorReviewRequired 산정 근거. ComplianceRecord 발행 시 snapshot으로 고정 |
| 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `AdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`eligibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·digestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IANATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |


 succeeded in 699ms:
# Feature — search-visibility

> **상태**: **v1.0 구현 명세 안정판** (codex 자동 비평 5차 사이클 마감 — 5개 지적 전건 수용)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 11.1·§ 11.2 / `docs/features/analytics-reporting.md` v1.0
> **목적**: 사이트 전체·페이지별 검색 가시성 모니터링 (노출 추세·AI 브리핑 인용·통합 영역 진입·외부 백링크 변동). 신호별 detector + state transition + 이상 감지·outbox 알림. 자체 SERP 크롤링은 법무 승인 게이트(approvedScope 구조화) 필수.
> **연관 문서**: analytics-reporting v1.0 § 3.4, notifications v1.0, REVIEW_WORKFLOW § 9 (5종 cascade 완료), DATA_MODEL C-08 v0.16 (SearchVisibilityConfig + SerpCrawlerApprovedScope), SEARCH_STANDARDIZATION § 3·§ 4·§ 5

---

## 0. 한 페이지 요약

- **Feature 식별자**: `search-visibility`
- **핵심 책임**: source 3종 모니터링·신호별 detector·state transition·이상 감지·outbox 알림·대시보드 read API
- **mode 2종**: `alerting`(기본·notifications 필수) / `monitor-only`(notifications 비활성 허용. 알림 미발송)
- **데이터 source 3종**: analytics-derived / serp-crawler(법무 승인 게이트 필수) / backlink-source
- **신호 4종 + detector 분리**: exposureTrend(EWMA·percentile) / aiBriefingCitation(state transition) / unifiedRankingPresence(rank bucket transition) / backlinkChange(weekly delta)
- **query set 자동 산출** (vs keyword-monitoring): analytics-derived(top-N impressions) 또는 sitemap-derived(SEARCH_STANDARDIZATION § 4)
- **DB 인벤토리**: **9 tables** — VisibilitySignalSnapshot·MonitoringLog·MonitoringSourceAttempt·**SearchVisibilityCollectionRetryQueue**·AnomalyRecord·VisibilityState·SerpCrawlerArtifact·BacklinkSnapshot·AnomalyNotificationOutbox

---

## 1. 일반 규약

### 1.1 변경 정책

| 변경 유형 | 패키지 SemVer | policyVersion | 비고 |
|---|---|---|---|
| 입력/출력 인터페이스 변경 | **MAJOR** | 별개 | |
| 데이터 source 추가 | MINOR | 별개 | C-08 cascade |
| 데이터 source 제거 | **MAJOR** | 별개 | |
| 신호별 detector 알고리즘 변경 | **MAJOR** | policyVersion 신규 | |
| signal별 enum (VisibilityState) 변경 | **MAJOR** | policyVersion 신규 | |
| 알림 매트릭스 변경 | **MAJOR** | policyVersion 신규 | |
| 운영 모드 변경 | **MAJOR** | 별개 | |
| build-time fail / runtime fail 룰 추가·강화 | **MAJOR** | 별개 | |
| warning → fail 승격 | **MAJOR** | 별개 | |
| warning 룰 추가 | MINOR / PATCH | 별개 | |
| 지표 추가 | PATCH | 별개 | |

### 1.2 SoT 원칙

- 측정 데이터 read API SoT는 analytics-reporting § 3.4 `queryNormalizedMetrics` (queryDailyUserMeasurements 미사용)
- 알림 발송 SoT는 notifications + REVIEW_WORKFLOW § 9.1.1
- 자격증명·policyVersion·approvedScope SoT는 DATA_MODEL C-08
- sitemap·canonical·robots 입력 SoT는 SEARCH_STANDARDIZATION § 3·§ 4·§ 5
- 본 문서 = 신호 정의·detector·state·이상 감지·outbox 알림 SoT + 내부 데이터 구조 SoT (§ 13)

### 1.2.1 공통 retry taxonomy (SV2-15 신설)

본 Feature는 2종 retry 구조 — SearchVisibilityCollectionRetryQueue (source 수집)·AnomalyNotificationOutbox (알림 발송). 공통 의미:

| 개념 | 의미 |
|---|---|
| `attempts` | 누적 시도 횟수 |
| `maxAttempts` | 자동 재시도 상한 |
| `claimedAt timeout` | worker claim 후 5분 내 commit 없으면 reconcile worker가 재claim |
| `*-retryable` | attempts < maxAttempts 시 자동 재시도 대상 |
| `*-permanent` | maxAttempts 소진 또는 비재시도성 — 수동 replay 필요 |

큐별 maxAttempts:

| 큐 | maxAttempts | 출처 |
|---|---|---|
| SearchVisibilityCollectionRetryQueue | `config.collectionRetryQueue.maxAttempts` (기본 3) — configurable |
| AnomalyNotificationOutbox | **상수 5** — 운영 단순성 |

### 1.3 본 문서가 다루지 않는 영역

- 측정 데이터 수집 자체 — analytics-reporting
- 사용자 지정 키워드 모니터링 — keyword-monitoring (후속)
- 알림 채널·재시도 (notify 발송 자체) — notifications
- 외부 PR·백링크 실행 — `docs/operations/`

### 1.4 SEARCH_STANDARDIZATION 입력 사용

| SEARCH_STANDARDIZATION 영역 | 본 Feature 사용 |
|---|---|
| § 3 robots.txt + aiCrawlerPolicy | aiCrawlerPolicy="disallowAll" 시 `aiBriefingCitation` 신호 자동 `qualityTier=degraded` |
| § 4 sitemap.xml | sitemap-derived universe 입력 (page 단위 target) |
| § 5 canonical URL | page path 정규화 |
| § 7 검색 콘솔 verification | analytics-reporting GSC·naver source 활성 전제 |

---

## 2. Feature 정의

### 2.1 기본 메타

```yaml
name: "search-visibility"
specVersion: "1.0"
coreRequiresMin: "1.0.0"
implementationKind: "node-module"
activation:
  scope: "instance"
  default: false
```

### 2.2 의존성

| 영역 | 의존 |
|---|---|
| analytics-reporting § 3.4 | `queryNormalizedMetrics` (필수) |
| notifications | notify() (mode="alerting" 시) |
| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 5종 NotificationEventType cascade 완료 |
| DATA_MODEL C-08 v0.16 | searchVisibilityConfig + searchVisibilityPolicyVersion + SerpCrawlerApprovedScope |
| DATA_MODEL C-23 | AdminUser |
| SEARCH_STANDARDIZATION § 3·§ 4·§ 5 | robots·sitemap·canonical |
| ARCHITECTURE § 0.5 | AI 브리핑·통합 랭킹 외부 컨텍스트 |

### 2.3 InstanceManifest

```yaml
searchVisibilityConfig:
  serpCrawler:
    enabled: true
    targetSearchEngines: ["naver", "google"]
    siteDomain: "clinic.example.com"
    userAgent: "Glitzy-search-visibility-bot/1.0"
    legalApproved: true
    legalApprovedBy: "legal@glitzy.kr"
    legalApprovedAt: "2026-05-10T00:00:00Z"
    approvedScope:                                       # SV2-02 구조화
      searchEngines: ["naver", "google"]
      locales: ["ko-KR"]
      devices: ["desktop", "mobile"]
      geo: ["KR"]
      allowLoginState: false
      allowCaptchaBypass: false
      artifactRetentionDaysMax: 90
      allowedPaths: []                                    # 빈 배열 = 검색 결과 page 전체
  backlinkSource:
    enabled: true
    provider: "ahrefs"
    apiKeySecretRef: "secretRef://AHREFS_API_KEY"
    siteDomain: "clinic.example.com"

searchVisibilityPolicyVersion: "sv-2026-05-14"

features:
  - name: "search-visibility"
    version: "0.3.0"
    enabled: true
    requiresFeature:
      - analytics-reporting
    config:
      mode: "alerting"
      monitoringSchedule:
        daily: "04:00"
        timezonePolicy: { missedRunCarryOverMaxDays: 7, dstNonexistentLocalTime: "next-valid", dstAmbiguousLocalTime: "first" }
      sources:
        analyticsDerived: { enabled: true }
        serpCrawler: { enabled: true }
        backlinkSource: { enabled: true }
      signals:
        exposureTrend:
          enabled: true
          algorithm: "ewma-percentile"
          ewmaAlpha: 0.1                                  # SV2-08
          baselineWindowDays: 28
          percentileLookbackDays: 5
          percentileInput: "raw"                          # raw | ewmaResidual
          percentileLowCritical: 1
          percentileLowWarning: 5
          minSmoothedObservedDays: 3
        aiBriefingCitation:
          enabled: true
          consecutivePresentDays: 3
          consecutiveMissingDays: 5
          emitRestoredEvent: false                        # SV2-12 — v1.0 기본 false. restored 발송 안 함 (AnomalyRecord 저장만)
        unifiedRankingPresence:
          enabled: true
          rankBuckets: ["1", "2-3", "4-10", "11-30", ">30"]
          rankBucketConfigVersion: "v1"                   # SV2-11
          transitionAlertOnBucketChange: true
        backlinkChange:
          enabled: true
          pollingFrequency: "weekly"
          deltaPercentageWarning: 10
          deltaPercentageCritical: 25
          providerSeriesSeparated: true                    # SV2-20 — provider 변경 시 series 분리 기본
          baselineWarmupPolls: 2                            # SV2-20 — 첫 N회는 anomaly 평가 제외
      querySetSource:
        kind: "analytics-derived"                          # analytics-derived | sitemap-derived
        topN: 50
        clusterBy: "page"
        sitemapSnapshotRefreshPolicy: "per-cycle"          # SV2-05 — per-cycle | weekly | on-publish-event
      anomalyHysteresis:
        exposureTrend: { minSmoothedObservedDays: 3, suppressHours: 24 }
        aiBriefingCitation: { consecutiveMissingDays: 5, suppressHours: 72 }
        unifiedRankingPresence: { bucketChangeMinStreak: 2, suppressHours: 48 }
        backlinkChange: { minConsecutivePolls: 2, suppressHours: 168 }
      crawlerRateLimit:
        requestsPerMinute: 6
        userAgentRespectRobots: true
      collectionRetryQueue:
        maxAttempts: 3
        backoffSeconds: [60, 300, 1800]
        workerPollIntervalSeconds: 30
      retentionDays:
        signalSnapshot: 730
        crawlerArtifact: 90                                 # serpCrawler.approvedScope.artifactRetentionDaysMax 초과 금지
        anomalyRecord: 730
      blobStorage:
        provider: "s3"                                      # v1.0은 "s3"만 build-pass (SV4-07). gcs·azure-blob 변환 정책은 SV-06b 후속 인프라 결정
        bucket: "glitzy-sv-artifacts"
        keyPrefix: "search-visibility/"                    # 인스턴스별 prefix는 worker가 append
        signedUrlTtlSeconds: 600
        encryption: "aes-256-gcm"
      externalMonitoringSink:
        provider: "sentry"
        dsnSecretRef: "secretRef://MONITORING_DSN"
```

---

## 3. 입력·출력

### 3.1 엔트리포인트 2종 + read API

| 종류 | 함수 | 책임 |
|---|---|---|
| 실행 command | `runMonitoring(input)` | 모니터링 cycle |
| 실행 command | `detectAnomalies(input)` | 이상 감지 + outbox enqueue (alerting 모드) |
| read API | `queryVisibilitySignals(input)` | 대시보드·다른 Feature 조회 |
| 운영 command | `enqueueOutboxForExistingAnomalies(window, severity)` | SV2-14 — mode 변경 후 retroactive enqueue (운영자 명시) |

### 3.2 MonitoringInput·Result

`runMonitoring` 호출 패턴은 analytics-reporting `runCollection`과 동일 (canonicalSources canonicalization·forceRefresh·refreshIntentId·manifestSnapshotVersion freeze). `canonicalSignals`도 동일 패턴 추가.

MonitoringSourceAttemptResult.status enum:
- `processing` / `success` / `partial` / `failed-credential` / `failed-quota` / `failed-transient` / `failed-permanent` / `skipped-disabled` / `skipped-rate-limit` / **`skipped-legal-out-of-scope`** (SV2-02 — approvedScope 밖 호출) / **`skipped-baseline-warmup`** (SV2-20) / `skipped-degraded` / `in-retry-queue`

### 3.3 AnomalyDetectionResult.anomalies[] detectorOutput shape (SV2-11)

신호별 detectorOutput JSON 필수 shape:

```ts
// exposureTrend (SV4-03 — § 4.1 산식과 동일 shape)
{ baselineEwma: number, observed: number, score: number, actualPercentile: number, thresholdPercentile: number, percentileInput: "raw"|"ewmaResidual", parserVersion?: string }
//   percentileBand는 derived display field (UI 표시용 — `score ≤ thresholdPercentile(critical)` 비교로 도출, DB 컬럼 아님)

// aiBriefingCitation (transition type만)
{ previousState: string, currentState: string, consecutivePresentDays: number, consecutiveMissingDays: number, parserVersion: string }

// unifiedRankingPresence (SV5-03 — absent/restored 전이 시 rank null 허용)
{ previousBucket: string, currentBucket: string, previousRank: number | null, currentRank: number | null, direction: "up"|"down"|"absent"|"restored", streak: number, rankBucketConfigVersion: string }
//   previousRank=null: previousBucket="absent" 또는 "unknown"인 경우
//   currentRank=null: currentBucket="absent"인 경우 (direction="absent")

// backlinkChange
{ previousValue: number, currentValue: number, deltaPercentage: number, provider: string, providerMetricName: string, consecutivePolls: number }
```

### 3.4 `queryVisibilitySignals` (v0.2 § 3.4 유지 + targetKind/targetId 사용)

---

## 4. 신호 정의 + query set 산출

### 4.0 query set 자동 산출 (SV2-03·04)

**`kind="analytics-derived"`** — 표준 호출:

```ts
queryNormalizedMetrics({
  instanceId,
  dimensions: ["query", "page", "source"],
  metrics: ["impressions", "clicks", "position"],
  windowStart: now() - 28d,
  windowEnd: now() - max(GSC.availabilityLagDays, naver.availabilityLagDays),
  sourceFilter: ["gsc", "naver-search-advisor"],
  joinMode: "row-separated"
})
```

**top-N 선정**:
- 정렬: 1차 SUM(impressions) desc, 2차 SUM(clicks) desc, 3차 weighted avg position asc, 4차 queryHash lexical (tie-break)
- 상위 N개 (`topN` config)

**clusterBy="page" mapping** (SV2-04):
- 동일 query가 여러 page에 노출될 경우 — query별 `impressions 최대 landing page`를 primary page로
- 동률: clicks 최대 → position 최소 → canonicalPagePath lexical 순

**`kind="sitemap-derived"`** (SV2-05):
- sitemapSnapshotRefreshPolicy:
  - `per-cycle` (기본): 매 monitoring cycle 시작 시 sitemap.xml fetch + hash 비교. 변경 시 universe 갱신
  - `weekly`: 매주 1회 갱신
  - `on-publish-event`: 빌드 시 명시적 갱신 트리거
- VisibilitySignalSnapshot.metadata에 `sitemapSnapshotHash` 보존

### 4.1 exposureTrend — EWMA·percentile (SV3-01 산식·config 반영 정정)

**target aggregation SoT** (SV3-02):

- exposureTrend.target = **page** (canonical path 단위). site-overall은 별도 target row(targetKind="site", targetId="overall")
- observed[t]는 page 단위:
  - **page target**: `SUM(impressions) WHERE page=target AND date=t` (analytics-derived universe 전체 — 특정 query 집합 한정 아님 — query universe는 SERP crawler용 monitored set일 뿐)
  - **site-overall target**: `SUM(impressions) WHERE instanceId=this AND date=t` (전체 합산)
- source별 합산: dimensions에 `source` 포함하여 분리 row 받은 후 본 Feature가 source 합산 또는 source별 분리 series 운영 (정책: **source 합산 기본** — `metricSourceMap`은 metadata에만)

**산식** (SV3-01 config 반영):

```
score[t] = percentileInput === "raw" ? observed[t] : observed[t] - baselineEwma[t]
   - baselineEwma[t] = ewmaAlpha * observed[t] + (1 - ewmaAlpha) * baselineEwma[t-1]  (ewmaAlpha 기본 0.1)
scoreSample = 최근 percentileLookbackDays(기본 5) 윈도우의 score[*] 분포
thresholdCritical = percentile(scoreSample, percentileLowCritical)  // 기본 P1
thresholdWarning  = percentile(scoreSample, percentileLowWarning)   // 기본 P5
severity:
  - score[t] <= thresholdCritical → critical (band="P{percentileLowCritical}")
  - score[t] <= thresholdWarning  → warning  (band="P{percentileLowWarning}")
  - 그 외 → normal

전제: 최소 minSmoothedObservedDays(기본 3) 일자 수집 후 평가
```

**detectorOutput.exposureTrend 정정** (§ 3.3 shape 변경):

```ts
{ baselineEwma: number, observed: number, score: number, actualPercentile: number, thresholdPercentile: number, percentileInput: "raw"|"ewmaResidual", parserVersion?: string }
```

actualPercentile/thresholdPercentile 저장으로 P1/P5 hardcode 회피 (config 변경 시 산식이 자연 반영).

### 4.2 aiBriefingCitation — state transition

- 매 cycle SERP 크롤링 후 인용 여부 판정
- state machine: `unknown` → `present` (consecutivePresentDays 충족 시 `first-detected` notify) → `missing` (consecutiveMissingDays 충족 시 `lost` notify) → `present` (재등장 — `emitRestoredEvent=false` 기본이라 AnomalyRecord 저장만, notify 미발송; SV2-12)

### 4.3 unifiedRankingPresence — rank bucket transition (SV3-07 state transition closure)

- 매 cycle 통합 영역 노출 query별 rank 추출 (serp-crawler)
- bucket 매핑 → 직전 bucket과 비교 → transition 발생 시 AnomalyRecord 저장
- `transitionAlertOnBucketChange=true` 시 detectAnomalies가 outbox enqueue (alerting 모드)
- detectorOutput shape (§ 3.3)

**state transition table** (SV3-07):

| 전이 (previous → current) | AnomalyRecord 저장 | eventType | notify |
|---|---|---|---|
| `unknown` → `bucket:*` (첫 관측) | ✅ severity=info | (없음 — info는 outbox 미enqueue) | ❌ (SV4-04 rationale: query별 baseline initialization 성격이라 알림 제외. 첫 모니터링 cycle 다수 query에서 동시 발생 가능해 알림 noise 회피. 대비 — `ai-briefing-citation-first-detected`는 site-level 비즈니스 이벤트라 매트릭스에서 outbox enqueue) |
| `bucket:a` → `bucket:b` (개선·악화) | ✅ severity=warning (b가 a보다 worse) / info (better) | `search-visibility-anomaly-warning` (worse일 때만) | ✅ (worse일 때) |
| `bucket:*` → `absent` (SERP 결과에서 제거) | ✅ severity=critical | `search-visibility-anomaly-critical` | ✅ |
| `absent` → `bucket:*` (복귀) | ✅ severity=info, direction="restored" | (없음) | ❌ |
| crawl `degraded`·`failed` → 상태 hold | ❌ (state 갱신 안 함, suppression ledger 적용) | (없음) | ❌ |
| `unknown` → `absent` (첫 관측이 absent) | ❌ (state unknown → absent 직접 전이 안 함, 첫 bucket 관측 전까지 unknown 유지) | (없음) | ❌ |

### 4.4 backlinkChange — weekly delta

- pollingFrequency=weekly
- 직전 poll 대비 deltaPercentage 계산
- |delta| ≥ deltaPercentageCritical(25%) → critical / ≥ Warning(10%) → warning
- baselineWarmupPolls(기본 2) — provider 변경·신규 polling 시작 첫 N회는 anomaly 평가 제외 (SV2-20)
- providerSeriesSeparated=true → provider 변경 시 새 series로 분리 (baseline reset 동일 효과)

---

## 5. source 어댑터

### 5.1 analytics-derived

- queryNormalizedMetrics 호출 (§ 4.0 표준 패턴 + § 4.1 exposureTrend)
- sourceWatermarks를 VisibilitySignalSnapshot.metadata에 보존
- canonical path는 SEARCH_STANDARDIZATION § 5 resolve 적용

### 5.2 serp-crawler

- **법무 게이트** (DATA_MODEL C-08 v0.16 SerpCrawlerApprovedScope SoT):
  - `enabled=true` + (`legalApproved !== true` 또는 `legalApprovedBy`·`legalApprovedAt` 누락) → build fail
  - crawler 실행 파라미터가 approvedScope 범위 밖이면 → `skipped-legal-out-of-scope` 처리
- rate limit·robots.txt 준수·운영 안정성 — v0.2 유지 (locale·device·geo·blockReason·captchaDetected artifact metadata)
- **parserVersion 변경 정책** (SV2-18):
  - 기본: parserVersion 변경 시 새 lineage (기존 artifact 자동 backfill 안 함)
  - 운영자 명시 backfill job(`reparseArtifacts(parserVersion, range)`)으로만 backfill 가능
  - AnomalyRecord.detectorOutput에 parserVersion 저장 (감사)

### 5.3 backlink-source

- provider별 raw metric + `providerMetricName`(DR/DA/AS) + `providerMetricValue`
- `normalizedAuthorityScore` **optional** (SV2-19 — v1.0 변환 함수 미확정, SV-09 후속)
- detector는 `providerMetricValue`로 작동. normalized 값은 dashboard 비교용 (없을 수도)
- provider 변경 시 `providerSeriesSeparated=true`(기본) → 별도 series. weekly delta는 동일 provider 내에서만 평가

---

## 6. detector + state

### 6.1 detector 매핑 + VisibilityState signal별 enum (SV2-09·10)

| 신호 | detector | VisibilityState 사용? | currentState enum |
|---|---|---|---|
| exposureTrend | ewma-percentile | **❌** (AnomalyRecord만) | N/A |
| aiBriefingCitation | state-transition | ✅ | `unknown` \| `present` \| `missing` \| `degraded` |
| unifiedRankingPresence | rank-bucket-transition | ✅ | `bucket:1` \| `bucket:2-3` \| `bucket:4-10` \| `bucket:11-30` \| `bucket:>30` \| `absent` \| `unknown` |
| backlinkChange | weekly-delta-percentage | ❌ (AnomalyRecord만) | N/A |

> `VisibilityState`는 transition형 signal 전용. exposureTrend·backlinkChange는 시계열 anomaly이므로 별도 state machine 불필요 (SV2-10).

### 6.2 평가 cycle — v0.2 § 6.2 유지

### 6.3 false-positive 완화 + anomaly suppression ledger (SV3-08)

각 신호별 hysteresis(streak·suppressHours) 외에 **AnomalyRecord 기반 suppression ledger** (state machine 미사용 signal에 적용):

- **suppression key**: `hash(instanceId + signal + targetKind + targetId + severity + searchVisibilityPolicyVersion)`
- **suppress 조건**: 동일 key의 AnomalyRecord 중 `resolutionStatus="open"` + `detectedAt > now() - suppressHours`인 row 존재 → 신규 anomaly 생성 skip (재실행·forceRefresh 시 중복 방지)
- **severity escalation 의도** (SV4-06): suppression key에 `severity`가 포함되어 동일 target의 warning → critical 상승 시 별도 anomaly 생성. critical 알림이 warning suppression에 막히지 않도록 한 의도된 동작. false-positive resolve(`resolutionStatus="false-positive"`) 후 재발생도 새 anomaly로 생성됨 (open 조건 미충족)
- 적용 대상: exposureTrend·backlinkChange (state machine 미사용)
- aiBriefingCitation·unifiedRankingPresence는 VisibilityState transition으로 자연 dedupe (별도 ledger 불필요)

기본값 (운영 정책별 override):

| 신호 | minStreak / window | suppressHours |
|---|---|---|
| exposureTrend | minSmoothedObservedDays 3 | 24h |
| aiBriefingCitation lost | consecutiveMissingDays 5 | 72h |
| unifiedRankingPresence | bucketChangeMinStreak 2 | 48h |
| backlinkChange | minConsecutivePolls 2 | 168h (weekly poll 1회 분량) |

---

## 7. 알림 (outbox 패턴 + eventType 기반 enqueue)

### 7.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 — cascade 완료)

5종 매트릭스 그대로 — v0.2 § 7.1 유지.

### 7.2 outbox enqueue 조건 — eventType 기반 (SV2-13 정정)

`shouldNotify(eventType, mode)` 표:

| eventType | severity 매핑 | mode="alerting" | mode="monitor-only" |
|---|---|---|---|
| `search-visibility-anomaly-critical` | severity="critical" anomaly | ✅ enqueue | ❌ |
| `search-visibility-anomaly-warning` | severity="warning" anomaly | ✅ enqueue | ❌ |
| `search-visibility-monitoring-failed` | envelope failed | ✅ enqueue | ❌ |
| `ai-briefing-citation-first-detected` | first-detected state transition | ✅ enqueue (severity=info여도) | ❌ |
| `ai-briefing-citation-lost` | lost state transition | ✅ enqueue | ❌ |

### 7.3 발송 흐름 — outbox SQL

v0.2 § 7.2 outbox SQL 유지 + analytics-reporting 패턴 동일 (SKIP LOCKED + attempts<5 + permanent 전이).

### 7.4 NotificationEvent 필드 매핑 (SV5-04 — eventType별 명시)

| eventType | contentRef | contentTitle | metadata 필수 필드 |
|---|---|---|---|
| `search-visibility-anomaly-critical`·`-warning` | `anomalyRecordId` | `"${signal} ${severity} — ${targetKind}/${targetDisplay}"` | signal·targetKind·targetId·detectedAt·detectorOutput·streakDays·qualityTier |
| `search-visibility-monitoring-failed` | `"instance:" + instanceId` (synthetic — envelope 단위) | `"Search visibility monitoring failed (${date})"` | monitoringLogId·failedSources[]·detectedAt |
| `ai-briefing-citation-first-detected` | `anomalyRecordId` | `"AI 브리핑 인용 첫 등장 — ${targetDisplay}"` | signal=aiBriefingCitation·targetKind·targetId·firstSeenAt·searchEngine |
| `ai-briefing-citation-lost` | `anomalyRecordId` | `"AI 브리핑 인용 상실 — ${targetDisplay}"` | signal=aiBriefingCitation·targetKind·targetId·lastSeenAt·consecutiveMissingDays·searchEngine |

공통 필드:
- `sourceEventId = hash("search-visibility:" + anomalyRecordId + eventType)` (anomaly 연관 이벤트). monitoring-failed는 `hash("search-visibility:" + instanceId + "monitoring-failed:" + dateOfFailure)`로 fallback
- `recipients`: REVIEW_WORKFLOW § 9.1.1 매트릭스 수신자 산정 결과 AdminUser fan-out
- `criticality`: § 9.1.1 매트릭스 값
- `createdAt`: detectedAt 또는 outbox enqueue 시각

DeliveryResult 처리 — v0.2 § 7.3 outbox claim 매핑 동일.

### 7.5 mode 변경 정책 + retroactive outbox command (SV2-14·SV3-06 closure)

- 기본: monitor-only → alerting 전환 시 **기존 AnomalyRecord에 retroactive outbox 생성 금지**. 신규 anomaly만 발송
- 운영자 명시 액션 `enqueueOutboxForExistingAnomalies(window, severity, dryRun)` (§ 3.1):

**Command contract**:
- **권한**: `super-admin` 전용 (REVIEW_WORKFLOW § 11.1 AdminUserRole). operator는 본 액션 호출 불가 — retroactive 발송은 운영 영향 큰 액션이므로 권한 한정
- **입력**: `window: {start, end}`·`severity: ("warning"|"critical")[]`·`dryRun: boolean (default true)`
- **dryRun=true**: 영향받을 AnomalyRecord 목록만 반환 (실제 enqueue 없음). 운영자 검토 후 dryRun=false로 재호출
- **dryRun=false**: window 내 AnomalyRecord 중 outbox 미존재(AnomalyNotificationOutbox.anomalyRecordId join 없음) + severity 조건 충족만 enqueue. UNIQUE(anomalyRecordId)로 중복 방지
- **sourceEventId 산정** (SV4-05 — 정책 버전 변경에도 재발송 금지):
  - `sourceEventId = hash("search-visibility:" + anomalyRecordId + eventType)`
  - `searchVisibilityPolicyVersion` 미포함 — 정책 변경(매트릭스 신규 version) 시에도 동일 anomaly 재발송 금지 의도
  - retroactiveBatchId 미포함 — 동일 anomaly에 재호출 시 동일 sourceEventId 유지 (notifications idempotent receipt가 중복 발송 차단)
  - `UNIQUE(anomalyRecordId)`로 outbox 측 차단 + sourceEventId hash 안정성으로 양층 보호
- **audit log** (SV5-02): action=`search-visibility-retroactive-enqueue-requested` (REVIEW_WORKFLOW § 10.2.1 cascade 완료):
  - `contentRef = "instance:" + instanceId` (synthetic — batch 단위 액션이라 단일 콘텐츠 ref 없음)
  - `metadata = { windowStart, windowEnd, severity: ("warning"|"critical")[], dryRun, matchedCount, enqueuedCount, retroactiveBatchId }`
  - `actorId = AdminUser.@id` (super-admin), `actorRole = "super-admin"`
- **SLA**: window 내 N개 anomaly enqueue 후 N분 내 처리 (notifications outbox worker 의존)

---

## 8. 운영 지표

v0.2 § 8 유지.

---

## 9. AnomalyRecord 운영 흐름 (resolutionStatus)

v0.2 § 9 유지.

---

## 10. 설치·설정·운영 모드

### 10.1 빌드 단계 — v0.2 유지

### 10.2 운영 모드 (SV2-14 정합)

- **alerting** (기본): notifications 필수
- **monitor-only**: notifications 비활성 허용. AnomalyRecord 저장만
- 모드 변경: § 7.5 retroactive 정책 적용

---

## 11. 빌드·런타임 검증

### 11.1 build-time fail (SV2-21 정정 — anomalyDetection 잔재 제거)

- `enabled=true` + `searchVisibilityConfig` 누락
- `searchVisibilityPolicyVersion` 누락 또는 패키지 보관 버전 불일치
- `requiresFeature: analytics-reporting` 충족 안 됨
- `mode="alerting"` + `notifications` 비활성
- **`serpCrawler.enabled=true` + (`legalApproved !== true` 또는 `legalApprovedBy`·`legalApprovedAt` 누락)** (SV2-01 정합)
- **`serpCrawler.enabled=true` + `serpCrawler.approvedScope` 누락** — approvedScope required (SV2-02 구조화 필드)
- **`serpCrawler.enabled=true` + `approvedScope.allowCaptchaBypass === true`** (운영상 금지 — SV3-03)
- **`serpCrawler.enabled=true` + `approvedScope.artifactRetentionDaysMax` 누락** (SV3-03 required 필드)
- `backlinkSource.enabled=true` + `apiKeySecretRef` 누락
- `signals.*` 모두 비활성 (전부 enabled=false)
- `signals.exposureTrend.algorithm` 미지정 또는 `ewmaAlpha`·`baselineWindowDays`·`percentileLookbackDays` 누락
- **`config.blobStorage.provider`·`bucket`·`signedUrlTtlSeconds` 누락** (serpCrawler 활성 시)
- **`config.blobStorage.provider !== "s3"`** (v1.0 SV4-07 — 다른 provider는 SV-06b 후속까지 build fail)

**평가 순서** (SV3-04):
1. `serpCrawler.enabled=true`이면 → approvedScope required 검증·legalApproved 게이트 먼저
2. approvedScope 통과 시 → `config.retentionDays.crawlerArtifact > approvedScope.artifactRetentionDaysMax` 비교. 초과 시 build fail
3. `serpCrawler.enabled=false`이면 → approvedScope·blobStorage·crawlerArtifact retention 검증 skip (해당 항목 fail 룰 비활성)

### 11.2 runtime validation fail

- `forceRefresh=true` + `refreshIntentId` 누락 또는 빈 문자열
- on-demand `detectAnomalies` 호출 시 신호별 minStreak/window 데이터 부족 (scheduled는 hold + warning)
- crawler 실행 파라미터가 `approvedScope` 밖이면 `skipped-legal-out-of-scope`

### 11.3 warning

- `serpCrawler.enabled=true` + `userAgentRespectRobots=false`
- `backlinkSource.provider="self-crawl"`
- `monitoringSchedule.daily`가 analytics-reporting `collectionSchedule.daily` 이전
- `signals.aiBriefingCitation.enabled=true` + SEARCH_STANDARDIZATION `aiCrawlerPolicy="disallowAll"` (자동 degraded)
- backlink-source provider 변경 직후 `baselineWarmupPolls` 미완료 (감사 표시)

---

## 12. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| SV-01 | serp-crawler 법적·ToS — 인스턴스별 법무 책임 | 법무 검토 (v1.0 fail-gate 강제) |
| SV-02 | AI 브리핑 인용 파싱 DOM 변경 대응 | 운영 — parserVersion 추적 |
| SV-03 | backlink provider 선택 | 비용·정확도 |
| SV-04 | 통합 영역 personalization 영향 | 운영 |
| SV-05 | anomaly 알고리즘·threshold 튜닝 baseline | M2+ 누적 |
| SV-06a | crawler network egress·proxy·UA rotation | 인프라 결정 |
| SV-06b | artifact blob storage IAM policy 예시·운영 role 구체화 (provider=s3는 v0.3 결정) | 인프라 결정 (SV3-10 분리) |
| SV-07 | 다국어 SERP | M3+ |
| SV-08 | aiBriefingCitation `restored` 이벤트 (v1.x patch) | v1.x — emitRestoredEvent=false 기본 |
| SV-09 | normalizedAuthorityScore 변환 함수 | v1.x patch (optional 필드) |
| SV-11 | hysteresis 주말·공휴일 보정 | 운영 정책 |
| SV-12 | `anomaly-resolution-updated` audit cascade | REVIEW_WORKFLOW § 10.2.1 후속 |
| SV-14 | signed URL refresh client SDK | 인프라 결정 (SV3-09) |

### 12.1 해소된 미결정

| ID | 항목 | 해소 |
|---|---|---|
| ~~SV-10~~ | backlink provider 변경 baseline reset | v0.3 — `providerSeriesSeparated=true` 기본 + `baselineWarmupPolls=2` 정책. v1.0 마감 시 closure (SV3-10) |
| ~~SV-13~~ | `search-visibility-retroactive-enqueue-requested` audit cascade | v0.5 — REVIEW_WORKFLOW § 10.2.1 AuditAction enum 정식 cascade 완료 (SV4-02) |

---

## 12.2 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 |
| 2026-05-14 | v0.2 | codex 1차 (20 지적) |
| 2026-05-14 | v0.3 | codex 2차 (22 지적) |
| 2026-05-14 | v0.4 | codex 3차 (10 지적 전건 수용)
| 2026-05-14 | v0.5 | codex 4차 (7 지적 전건 수용)
| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) SV-13 해소된 미결정으로 이동 (SV5-01), (2) **retroactive audit metadata shape 명시** — contentRef="instance:{instanceId}" synthetic·metadata 필수 필드(windowStart·End·severity·dryRun·matchedCount·enqueuedCount·retroactiveBatchId)·actorRole="super-admin" (SV5-02), (3) **unifiedRankingPresence rank nullability** — previousRank/currentRank를 `number | null`로 변경. absent/restored 전이 시 null 규칙 (SV5-03), (4) **NotificationEvent 필드 매핑 표 복원** — eventType별 contentRef/contentTitle/metadata 명시. monitoring-failed는 synthetic contentRef + sourceEventId fallback (SV5-04), (5) 변경 이력 operations 잔재 → super-admin 전용으로 정정 (SV5-05): (1) **retroactive command 권한 super-admin 전용** — operations role 미존재 정정 (SV4-01), (2) **REVIEW_WORKFLOW § 10.2.1 cascade** — `search-visibility-retroactive-enqueue-requested` AuditAction 추가. SV-13 해소 (SV4-02), (3) **§ 3.3 exposureTrend detectorOutput shape § 4.1과 통일** — score·actualPercentile·thresholdPercentile (SV4-03), (4) **first-detected 정책 rationale** — unifiedRankingPresence는 query baseline initialization, AI briefing은 site-level business event (SV4-04), (5) **sourceEventId hash에서 policyVersion 제거** — 정책 변경 시 재발송 금지 의도. § 13.10 정합 (SV4-05), (6) **severity escalation 의도 명시** — warning → critical 상승은 별도 anomaly (SV4-06), (7) **v1.0 blobStorage.provider="s3"만 build-pass** — GCS/Azure는 SV-06b 후속 (SV4-07): (1) **exposureTrend percentile config 반영 + target aggregation SoT** — score 산식·detectorOutput에 actualPercentile/thresholdPercentile (SV3-01·02), (2) **SerpCrawlerApprovedScope boolean 정정** — allowLoginState/allowCaptchaBypass required=false + default=false (DATA_MODEL cascade·SV3-03), (3) **crawlerArtifact retention 평가 순서** — serpCrawler.enabled=false 시 skip (SV3-04), (4) **SearchVisibilityCollectionRetryQueue worker SoT 쿼리 복제** — analytics-reporting § 4.3 패턴(SKIP LOCKED·advisory lock·envelope 재계산·lock ordering invariant) (SV3-05), (5) **retroactive outbox command contract closure** — super-admin 전용 권한(v0.5에서 좁힘)·dryRun·sourceEventId hash·audit cascade SV-13 (SV3-06), (6) **unifiedRankingPresence state transition table** — 6종 전이별 AnomalyRecord·eventType·notify 매핑 (SV3-07), (7) **anomaly suppression ledger** — exposureTrend·backlinkChange state machine 없는 signal용 (SV3-08), (8) **blob isolation IAM 구체화** — canonical object key format·S3 IAM condition 예시·signed URL refresh SV-14 (SV3-09), (9) **SV-10 해소** + SV-06b 부분 분리 (SV3-10), (10) **SV-13·SV-14 신규** |

---

## 13. 본 Feature 내부 데이터 구조 (admin DB 9 tables)

### 13.1 공통 원칙 — v0.2 § 13.1 유지

### 13.2 `VisibilitySignalSnapshot` — v0.2 § 13.2 유지 (targetKind/targetId)

### 13.3 `MonitoringLog` (SV2-06 — 풀 스키마)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `idempotencyKey` | string | ✅ |
| `instanceId` | Slug | ✅ |
| `mode` | enum (scheduled·on-demand) | ✅ |
| `canonicalSources` | JSON (string[]) | ✅ |
| `canonicalSignals` | JSON (string[]) | ✅ |
| `sourceConfigSnapshotHash` | string | ✅ |
| `signalConfigSnapshotHash` | string | ✅ |
| `manifestVersion` | string | ✅ |
| `searchVisibilityPolicyVersion` | string | ✅ |
| `forceRefresh` | boolean | ✅ |
| `refreshIntentId` | string | optional |
| `windowStart`·`windowEnd` | Date | ✅ |
| `startedAt` | Date | ✅ |
| `completedAt` | Date | optional |
| `envelopeState` | enum | ✅ — accepted/processing/completed/partial-failed/failed |

**Constraints**: `UNIQUE(instanceId, idempotencyKey)`.

### 13.4 `MonitoringSourceAttempt`

analytics-reporting CollectionSourceAttempt 동일 패턴 + `skipped-legal-out-of-scope`·`skipped-baseline-warmup`·`skipped-degraded` status 추가.

### 13.5 `SearchVisibilityCollectionRetryQueue` (SV2-07 신설 — 9번째 table)

**worker SoT 쿼리** (SV3-05 — analytics-reporting § 4.3 패턴 복제):

```sql
-- worker claim
UPDATE search_visibility_collection_retry_queue
SET status = 'processing', locked_at = now(), locked_by = :workerId
WHERE id IN (
  SELECT id FROM search_visibility_collection_retry_queue
  WHERE status = 'pending' AND scheduled_for <= now()
  ORDER BY scheduled_for
  LIMIT 10
  FOR UPDATE SKIP LOCKED
)
RETURNING *;

-- attemptNumber 동시성 안전 (analytics-reporting AR3-02 패턴):
--   1. queue row claim 후 (monitoringLogId, source) advisory lock acquire
--   2. SELECT MAX(attemptNumber)+1 FROM MonitoringSourceAttempt WHERE monitoringLogId=? AND source=?
--   3. lock 보유 상태에서 새 MonitoringSourceAttempt INSERT (status="processing", attemptNumber=max+1)
--   4. 짧은 transaction commit → lock 자동 해제
--   5. 별도 transaction에서 provider 호출 후 attempt UPDATE
-- stale processing(>10분) — 별도 reconcile worker가 queue status="pending" 복귀
-- maxAttempts 도달 → queue status="exhausted" + MonitoringSourceAttempt.status="failed-permanent" + 외부 sink alert
-- envelope 재계산: attempt 종결 시마다 lock(hash(monitoringLogId, "envelope")) 후 envelopeState 재산정

-- lock ordering invariant (analytics-reporting AR4-03 동일):
-- attempt lock 보유 중 envelope lock 획득 금지. attempt commit 후 별도 transaction에서 envelope lock
```



| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `monitoringLogId` | UUID | ✅ — FK |
| `source` | VisibilitySource | ✅ |
| `attemptNumber` | integer | ✅ |
| `status` | enum (pending·processing·completed·exhausted) | ✅ |
| `scheduledFor` | Date | ✅ |
| `lockedAt`·`lockedBy` | Date·string | optional |
| `lastError` | string | optional |
| `dedupeMode` | enum (normal·resend) | ✅ |

**Constraints**: `FK monitoringLogId ON DELETE RESTRICT`, `UNIQUE(monitoringLogId, source, attemptNumber)`.
**Index**: `(status, scheduledFor)` partial where status='pending'.

### 13.6 `AnomalyRecord`

v0.2 § 13.4 유지 + detectorOutput shape (§ 3.3 — signal별 필수 필드 정의).

### 13.7 `VisibilityState` (SV2-09·10 — signal별 enum 명시)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `instanceId` | Slug | ✅ |
| `signal` | VisibilitySignal | ✅ — **`aiBriefingCitation` 또는 `unifiedRankingPresence`만** (transition형 한정 — SV2-10) |
| `targetKind`·`targetId` | ✅ |
| `currentState` | string | ✅ — § 6.1 표의 signal별 enum |
| `previousState` | string | optional |
| `firstSeenAt`·`lastSeenAt` | Date | optional |
| `consecutivePresentDays`·`consecutiveMissingDays` | integer | ✅ |
| `lastTransitionEventId` | string | optional |
| `lastTransitionAt` | Date | optional |
| `updatedAt` | Date | ✅ |

**Constraints**: `UNIQUE(instanceId, signal, targetKind, targetId)`.

### 13.8 `SerpCrawlerArtifact` (SV2-17·18 보강)

v0.2 § 13.6 유지 + 운영 정책 보강:

- blob isolation **IAM 정책 SoT** (SV2-17·SV3-09 구체화):
  - **canonical object key format**: `{blobStorage.keyPrefix}{instanceId}/{YYYY-MM-DD}/{artifactId}.{ext}` (예: `search-visibility/client-01/2026-05-14/abc123.html`)
  - signed URL 발급 API는 호출자 AdminUser.instanceMemberships에 본 instanceId 포함 여부 검증 (미포함 시 403)
  - **S3 IAM condition 예시**:
    ```json
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::glitzy-sv-artifacts/search-visibility/${aws:PrincipalTag/instanceId}/*",
      "Condition": { "StringEquals": { "aws:PrincipalTag/instanceId": "${...}" } }
    }
    ```
  - **signed URL refresh**: TTL 600초. 대시보드 client는 만료 60초 전 read API 재호출로 fresh URL 발급. 대시보드 장기 열람 중 자동 refresh (요청 응답 client SDK 제공 — 인프라 결정 SV-14 신설)
  - cross-instance access 자동 차단 (IAM PrincipalTag + signed URL 발급 권한 검증 양층)
- parserVersion 변경 (SV2-18): § 5.2 정책 — backfill은 운영자 명시 job만

### 13.9 `BacklinkSnapshot` (SV2-19 — normalizedAuthorityScore optional)

v0.2 § 13.7 유지 + `normalizedAuthorityScore`를 **optional**로 정정 (variant 함수 SV-09 미확정 시 detector는 providerMetricValue로 작동).

### 13.10 `AnomalyNotificationOutbox` (SV2-13 enqueue 조건 정합 — eventType 기반)

v0.2 § 13.8 스키마 유지 + 다음 정정:
- enqueue 조건: § 7.2 shouldNotify 표 적용
- **sourceEventId** 산식 (SV4-05): `hash("search-visibility:" + anomalyRecordId + eventType)` — policyVersion 미포함 (정책 변경 시 재발송 금지)
- `UNIQUE(anomalyRecordId)` 유지 — 동일 anomaly 1 outbox 1건만

---


codex
대상 문서는 꽤 길어서 전체 덤프 대신 쟁점별 절을 좁혀서 다시 보겠습니다. 특히 §4.5, §5, §6-8, §13, 그리고 REVIEW_WORKFLOW/DATA_MODEL cascade 실제 반영 여부를 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "''^(### 4'"\\.5|#### 4\\.5|## 5|## 6|## 7|## 8|## 13|### 13\\.|CrmCredentialVersion|credentialState|ProviderWebhookVerifier|duplicate-digest|purge|grace-expired|unregister|patientConsent|right to erasure|DPA|displayHintsCityName|displayHints|acceptance|AT-)\" docs/features/crm-sync.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "crm-sync|crmSync|crm-integration|crm-sync-|crm-credential|NotificationEventType|AuditAction" docs/admin/REVIEW_WORKFLOW.md docs/core/DATA_MODEL.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"13\\.5|SearchVisibilityCollectionRetryQueue|worker claim|FOR UPDATE SKIP LOCKED|advisory|exhausted|locked_at\" docs/features/search-visibility.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "RRN|resident|checksum|주민|PII|개인정보|동의|erasure|DPA|third party|위탁|수탁" docs/features/asset-ingestion.md docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md' in C:\Users\assag\solution\website-exposure
 succeeded in 634ms:
20:- **DB 인벤토리**: **9 tables** — VisibilitySignalSnapshot·MonitoringLog·MonitoringSourceAttempt·**SearchVisibilityCollectionRetryQueue**·AnomalyRecord·VisibilityState·SerpCrawlerArtifact·BacklinkSnapshot·AnomalyNotificationOutbox
52:본 Feature는 2종 retry 구조 — SearchVisibilityCollectionRetryQueue (source 수집)·AnomalyNotificationOutbox (알림 발송). 공통 의미:
58:| `claimedAt timeout` | worker claim 후 5분 내 commit 없으면 reconcile worker가 재claim |
66:| SearchVisibilityCollectionRetryQueue | `config.collectionRetryQueue.maxAttempts` (기본 3) — configurable |
587:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) SV-13 해소된 미결정으로 이동 (SV5-01), (2) **retroactive audit metadata shape 명시** — contentRef="instance:{instanceId}" synthetic·metadata 필수 필드(windowStart·End·severity·dryRun·matchedCount·enqueuedCount·retroactiveBatchId)·actorRole="super-admin" (SV5-02), (3) **unifiedRankingPresence rank nullability** — previousRank/currentRank를 `number | null`로 변경. absent/restored 전이 시 null 규칙 (SV5-03), (4) **NotificationEvent 필드 매핑 표 복원** — eventType별 contentRef/contentTitle/metadata 명시. monitoring-failed는 synthetic contentRef + sourceEventId fallback (SV5-04), (5) 변경 이력 operations 잔재 → super-admin 전용으로 정정 (SV5-05): (1) **retroactive command 권한 super-admin 전용** — operations role 미존재 정정 (SV4-01), (2) **REVIEW_WORKFLOW § 10.2.1 cascade** — `search-visibility-retroactive-enqueue-requested` AuditAction 추가. SV-13 해소 (SV4-02), (3) **§ 3.3 exposureTrend detectorOutput shape § 4.1과 통일** — score·actualPercentile·thresholdPercentile (SV4-03), (4) **first-detected 정책 rationale** — unifiedRankingPresence는 query baseline initialization, AI briefing은 site-level business event (SV4-04), (5) **sourceEventId hash에서 policyVersion 제거** — 정책 변경 시 재발송 금지 의도. § 13.10 정합 (SV4-05), (6) **severity escalation 의도 명시** — warning → critical 상승은 별도 anomaly (SV4-06), (7) **v1.0 blobStorage.provider="s3"만 build-pass** — GCS/Azure는 SV-06b 후속 (SV4-07): (1) **exposureTrend percentile config 반영 + target aggregation SoT** — score 산식·detectorOutput에 actualPercentile/thresholdPercentile (SV3-01·02), (2) **SerpCrawlerApprovedScope boolean 정정** — allowLoginState/allowCaptchaBypass required=false + default=false (DATA_MODEL cascade·SV3-03), (3) **crawlerArtifact retention 평가 순서** — serpCrawler.enabled=false 시 skip (SV3-04), (4) **SearchVisibilityCollectionRetryQueue worker SoT 쿼리 복제** — analytics-reporting § 4.3 패턴(SKIP LOCKED·advisory lock·envelope 재계산·lock ordering invariant) (SV3-05), (5) **retroactive outbox command contract closure** — super-admin 전용 권한(v0.5에서 좁힘)·dryRun·sourceEventId hash·audit cascade SV-13 (SV3-06), (6) **unifiedRankingPresence state transition table** — 6종 전이별 AnomalyRecord·eventType·notify 매핑 (SV3-07), (7) **anomaly suppression ledger** — exposureTrend·backlinkChange state machine 없는 signal용 (SV3-08), (8) **blob isolation IAM 구체화** — canonical object key format·S3 IAM condition 예시·signed URL refresh SV-14 (SV3-09), (9) **SV-10 해소** + SV-06b 부분 분리 (SV3-10), (10) **SV-13·SV-14 신규** |
624:### 13.5 `SearchVisibilityCollectionRetryQueue` (SV2-07 신설 — 9번째 table)
629:-- worker claim
631:SET status = 'processing', locked_at = now(), locked_by = :workerId
637:  FOR UPDATE SKIP LOCKED
642:--   1. queue row claim 후 (monitoringLogId, source) advisory lock acquire
648:-- maxAttempts 도달 → queue status="exhausted" + MonitoringSourceAttempt.status="failed-permanent" + 외부 sink alert
663:| `status` | enum (pending·processing·completed·exhausted) | ✅ |

 succeeded in 672ms:
docs/admin/REVIEW_WORKFLOW.md:464:### 9.1 NotificationEventType enum (canonical SoT)
docs/admin/REVIEW_WORKFLOW.md:467:type NotificationEventType =
docs/admin/REVIEW_WORKFLOW.md:503:  // `features/crm-sync.md` 1차 cycle cascade (CS1-01)
docs/admin/REVIEW_WORKFLOW.md:504:  | "crm-sync-batch-failed"                   // sync cycle 실패
docs/admin/REVIEW_WORKFLOW.md:505:  | "crm-sync-conflict-detected"              // 양방향 sync 충돌
docs/admin/REVIEW_WORKFLOW.md:506:  | "crm-sync-credential-expired"             // CRM 자격증명 만료
docs/admin/REVIEW_WORKFLOW.md:507:  | "crm-sync-credential-expiring-soon";      // 만료 14일 전
docs/admin/REVIEW_WORKFLOW.md:547:| `crm-sync-batch-failed` | CRM sync 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
docs/admin/REVIEW_WORKFLOW.md:548:| `crm-sync-conflict-detected` | CRM 충돌 감지 | operator | email + inApp | inApp | — | high | respect | mandatory |
docs/admin/REVIEW_WORKFLOW.md:549:| `crm-sync-credential-expired` | CRM 자격증명 만료 | operator + super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
docs/admin/REVIEW_WORKFLOW.md:550:| `crm-sync-credential-expiring-soon` | 만료 14일 전 | operator + super-admin | email + inApp | inApp | — | high | respect | mandatory |
docs/admin/REVIEW_WORKFLOW.md:569:  eventType: NotificationEventType;                    // § 9.1 enum
docs/admin/REVIEW_WORKFLOW.md:586:  eventType: NotificationEventType;
docs/admin/REVIEW_WORKFLOW.md:635:  action: AuditAction;          // § 10.2.1 enum
docs/admin/REVIEW_WORKFLOW.md:643:#### 10.2.1 AuditAction enum
docs/admin/REVIEW_WORKFLOW.md:646:type AuditAction =
docs/admin/REVIEW_WORKFLOW.md:669:  // `features/crm-sync.md` 1차 cycle cascade (CS1-01·16)
docs/admin/REVIEW_WORKFLOW.md:670:  | "crm-integration-registered"              // CRM 연동 등록
docs/admin/REVIEW_WORKFLOW.md:671:  | "crm-integration-unregistered"            // soft delete
docs/admin/REVIEW_WORKFLOW.md:672:  | "crm-sync-conflict-resolved"              // 충돌 운영자 해결
docs/admin/REVIEW_WORKFLOW.md:673:  | "crm-credential-rotated";                 // 자격증명 rotation
docs/core/DATA_MODEL.md:4:> **작성일**: 2026-05-14 (v0.18 → v0.19 — `features/crm-sync.md` 1차 사이클 cascade: C-08 `crmSyncConfig`(CrmSyncConfig·CrmIntegrationEntry 신설 — provider salesforce·hubspot·generic-rest-api 3종 한정·korean-emr build fail·dpaEvidenceRef vs patientConsentEvidenceRef 분리) + `crmSyncPolicyVersion`)
docs/core/DATA_MODEL.md:596:| `crmSyncConfig` | `CrmSyncConfig` | conditional | (v0.19 +) CRM·환자관리 시스템 연동 자격증명·DPA·동의 증빙 SoT. `features.crm-sync` 활성 시 required. 동작 옵션은 `features[name="crm-sync"].config` (`features/crm-sync.md` § 2.3) |
docs/core/DATA_MODEL.md:597:| `crmSyncPolicyVersion` | `string` | conditional | (v0.19 +) `features.crm-sync` 정책 SoT 버전. 7 Feature policyVersion 동일 패턴 |
docs/core/DATA_MODEL.md:715:> 동작 옵션(`mode`·`syncSchedule`·`entities`·`fieldMappingPolicyVersion`·`retryQueue`·`credentialRotation`·`pii`·`retentionDays` 등)은 `features[name="crm-sync"].config` SoT (`features/crm-sync.md` § 2.3).
docs/core/DATA_MODEL.md:1078:| 2026-05-14 | v0.19 | **`features/crm-sync.md` 1차 사이클 cascade**: (1) **C-08 `crmSyncConfig` 신설** (CrmSyncConfig·CrmIntegrationEntry — provider 3종 한정, dpaEvidenceRef·patientConsentEvidenceRef 분리), (2) **C-08 `crmSyncPolicyVersion`** (7 Feature policyVersion 동일 패턴) |

 succeeded in 681ms:
442:### 4.5 credential rotation 상태 머신 (CS2-09)
444:#### 4.5.1 CrmCredentialVersion entity — § 13.11 schema
446:#### 4.5.2 상태 머신 + outbound/inbound 사용 matrix
474:## 5. provider 어댑터 (v1.0 — 3종)
484:## 6. 알림 (CS2-11)
510:## 7. PII 처리 (CS2-02·05·07)
547:## 8. 운영 지표 + acceptance test (CS2-16)
718:## 13. 본 Feature 내부 데이터 구조 (admin DB **12 tables**)
720:### 13.1 `CrmIntegration`
745:### 13.2 `CrmSyncLog`
765:### 13.3 `CrmSyncSourceAttempt`
784:### 13.4 `CrmSyncRetryQueue` (CS2-12 — worker SQL 복제)
831:### 13.5 `CrmRecord` (closed-schema displayHints — CS2-05)
858:### 13.6 `CrmRecordChangeLog` (closed-schema)
874:### 13.7 `CrmFieldMapping`
892:### 13.8 `CrmConflictRecord` (field-level — CS2-08)
912:### 13.9 `CrmCredentialAuditLog`
926:### 13.10 `CrmRateLimitState`
939:### 13.11 `CrmCredentialVersion` (CS2-09 신설)
958:### 13.12 `CrmWebhookNonceLedger` (CS2-04)
980:### 13.13 `CrmSyncNotificationOutbox` (search-visibility § 13.10 패턴 — CS2-12)

 succeeded in 696ms:
docs/features/asset-ingestion.md:7:> **목적**: 클라이언트 기존 자료(웹사이트·SNS·업로드·CSV)를 수집·파싱·태깅·PII 처리·검수·promote(Core 데이터 계약 변환). 의료기관 신규 인스턴스 onboarding의 첫 단계.
docs/features/asset-ingestion.md:15:- **핵심 책임**: 외부 source 자료 수집 → 파싱 → PII 감지/redaction → 자동 태깅 → 검수 큐 → Core 데이터 계약 변환(promote)
docs/features/asset-ingestion.md:48:- 본 문서 = 수집·파싱·PII·태깅·검수·promote SoT + 내부 데이터 구조 SoT (§ 16)
docs/features/asset-ingestion.md:82:| notifications | **notify() 필수** (본 Feature는 monitor-only 모드 없음 — AI2-09 정정). 검수 큐 진입·PII 감지 등 본 Feature의 핵심 흐름이 알림 의존. notifications 비활성 인스턴스는 본 Feature 활성 불가 |
docs/features/asset-ingestion.md:204:## 7. 검수·promote 게이트 (F-15 의료광고·저작권·SNS 동의)
docs/features/asset-ingestion.md:222:| **PII 처리 완료** (AI4-07 — AssetPiiFinding 기준) | **AssetPiiFinding 0건** 또는 모든 finding이 다음 중 하나: (a) `reviewStatus="false-positive"`, (b) `reviewStatus="true-positive" AND redactionApplied=true` | 미처리 시 차단 (`open` 또는 `true-positive AND redactionApplied=false`는 차단). `piiDetected` boolean은 표시용 denormalized summary만. § 13.4 reconcile invariant — `piiDetected != exists(AssetPiiFinding)` 감지 시 sink alert |
docs/features/asset-ingestion.md:223:| **저작권·동의 증빙** | 외부 출처 자료 시 `AssetReviewRecord.rightsReview.evidenceAttachments[]` 또는 `consentEvidenceRef` 필수 | 미첨부 시 차단 |
docs/features/asset-ingestion.md:388:## 9. PII 처리 (F-13·F-14)
docs/features/asset-ingestion.md:390:### 9.1 PII 자동 감지·redaction
docs/features/asset-ingestion.md:397:- **`rrn` (한국 주민등록번호 — AI2-06 정확 알고리즘)**:
docs/features/asset-ingestion.md:400:  - **checksum 검증 (정확 공식)**:
docs/features/asset-ingestion.md:407:  - 검증 실패: PII 미분류 (regex 우연 일치 false-positive) — confidence=0
docs/features/asset-ingestion.md:408:  - 검증 통과: PII 분류 confidence=1.0
docs/features/asset-ingestion.md:412:- `mask`: RRN 전용 마스킹 `######-*******`. 일반 텍스트는 부분 마스킹
docs/features/asset-ingestion.md:448:| `asset-ingestion-pii-detected` | `asset` | assetId | `"asset:" + assetId` | `"PII 감지 — ${assetTitle}"` | assetId·piiFindingIds[]·detectorSummary·redactionMode |
docs/features/asset-ingestion.md:452:- `asset-ingestion-pii-detected`: asset 단위 1건만 발송 (한 asset에 multiple PII finding 발생해도 sourceId=assetId로 합산). piiFindingIds[] metadata로 상세 전달
docs/features/asset-ingestion.md:453:- UNIQUE(sourceKind, sourceId, eventType) — 동일 asset에 pii-detected 이벤트 1건만 outbox row. asset에 PII가 추가 발견되면 새 outbox 생성 안 함 (기존 finding 수정/추가는 read API로 확인)
docs/features/asset-ingestion.md:470:| PII 감지 적중률 | 운영자 confirmed / 자동 감지 | > 80% (M2+ baseline) |
docs/features/asset-ingestion.md:473:| **RRN candidate count** (AI3-11) | regex 후보 수 / 전체 ingested asset 수 | baseline (운영 30일 누적) |
docs/features/asset-ingestion.md:474:| **RRN checksum pass rate** | checksum 통과 / candidate count | baseline |
docs/features/asset-ingestion.md:475:| **PII true-positive rate** | reviewStatus="true-positive" / 전체 finding | baseline (M2+) |
docs/features/asset-ingestion.md:476:| **PII false-positive rate** | reviewStatus="false-positive" / 전체 finding | < 30% (M2+ baseline) |
docs/features/asset-ingestion.md:518:- **`promoteAsset` 게이트 미충족** (§ 7.2): 검수 미승인·rights 미승인·PII 미처리·증빙 미첨부
docs/features/asset-ingestion.md:570:| AI-03 | SNS 자료 사용 동의 절차 | 클라이언트 사전 협의 |
docs/features/asset-ingestion.md:573:| AI-06 | PII 감지 LLM 기반 정밀도 향상 | M2+ |
docs/features/asset-ingestion.md:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
docs/features/asset-ingestion.md:646:| `detector` | enum (`regex`·`checksum`·`manual`) | ✅ — **v1.0은 llm detector 미지원** (AI2-07. v1.x에서 LLM 활성화 시 provider allowlist·promptVersion·data minimization·raw PII 외부 전송 금지 또는 명시 승인 예외·audit metadata 정의 — AI-06 cascade) |
docs/features/asset-ingestion.md:759:- `raw/` prefix는 legal 검수자·super-admin만 read 가능 (PII·민감 원본 보호)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:348:- 환자 동의서·증빙 첨부 권장 (`ComplianceRecord.attachments`)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:375:**축 2. 환자 개인정보·초상권** (필수):
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:376:- 환자 본인 동의서 첨부 (`attachments[]`)
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:377:- 개인정보 보호법·초상권 적법성
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:379:> ⚠️ 환자 동의서는 개인정보·초상권 측면의 필요조건일 뿐 의료광고법 적법성을 보장하지 않음. 동의서 보유 = 발행 가능 아님.
docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:608:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (9개 지적 전건 수용)**: (1) § 3.2 — 시행령 제23조제1항제2호의 **3유형 묶음** 명시 (치료경험담·6개월 이하 임상경력·치료효과 단정). RiskRule.id 별도 추적, (2) § 2.4 "1:1 대응" 표현 완화 — "대체로 대응하나 일부 시행령 호는 의미 확장·혼합". 시행령 제2호 묶음 예시 명시, (3) § 2.2 14호 + § 3.14 — **추천 표시는 예외 아님** 명확화 (가~라목 예외는 인증·보증 표시만), (4) § 3.14 다목 "자격" 제거 — 자격은 제9호 별도 축, (5) § 3.12 외국인환자 — `severity: content-gate` + `requiredApproverRoles: ["legal"]` 명시 + ComplianceRecord 기록 경로, (6) § 4.2 자사 웹사이트 사전심의 — `priorReviewRequired`·`legalCounsel`·`attachments[]` 운영 감사 추적 경로 명시, (7) § 5.2 P-101 — **차단 기준 우선** 명시 (치료 효과 오인은 검수로 치유 안 됨). CONTENT_STANDARDS § 4.3 본문 직접 인용 원칙 정합, (8) § 6.2 전후사진 — **2축 적법성** 분리 (의료광고법 + 환자 개인정보·초상권). 동의서 보유=발행 가능 오해 회피, (9) § 8.3 law.go.kr — 의료법 본문 한정 → 시행령·시행규칙·관련 법령 포함으로 확장 |

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/features/crm-sync.md'; "'$lines=Get-Content -LiteralPath $p; $ranges=@(@(430,530),@(530,620),@(620,710),@(718,1000)); foreach($r in $ranges){ for($i=$r[0]; $i -le $r[1] -and $i -le $lines.Length; $i++){ '"'{0}: {1}' -f "'$i,$lines[$i-1] } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/core/DATA_MODEL.md'; "'$lines=Get-Content -LiteralPath $p; for($i=580;$i -le 720;$i++){ '"'{0}: {1}' -f "'$i,$lines[$i-1] }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/admin/REVIEW_WORKFLOW.md'; "'$lines=Get-Content -LiteralPath $p; foreach($r in @(@(460,555),@(640,675))){ for($i=$r[0]; $i -le $r[1]; $i++){ '"'{0}: {1}' -f "'$i,$lines[$i-1] } }' in C:\Users\assag\solution\website-exposure
 succeeded in 673ms:
580: | `robotsOverrides` | `RobotsOverride[]` | optional | user-agent별 merge/replace 룰 (SEARCH_STANDARDIZATION § 3.4) |
581: | `experimentalAiBots` | `boolean` | optional | 외부 관측 기반·공식 검증 전 user-agent(예: meta-externalagent) 포함 여부. 기본 `false`. `true` 시 robots.txt에 포함 |
582: | `performanceBudget` | `PerformanceBudget` | optional | Lighthouse budget 임계값 override + critical URL 목록 (SEARCH_STANDARDIZATION § 6.1) |
583: | `searchConsoleVerification` | `{google?: string, naver?: string, bing?: string}` | optional | 검색 콘솔 verification 메타 코드 (SEARCH_STANDARDIZATION § 7.1) |
584: | `notificationChannels` | `NotificationChannelsConfig` | optional | (v0.9 +, v0.13 확장) 어드민 알림 채널 활성화·설정 — `admin/REVIEW_WORKFLOW.md` § 9, `features/notifications.md` § 2.3. v0.13에서 email transport·secretRef·rate limit 영역 추가 |
585: | `adminBaseUrl` | `URL` | conditional | (v0.13 +) 본 인스턴스의 어드민(Control Plane) base URL — 알림 ctaUrl 합성 기준. `features.notifications` 활성 시 required (`features/notifications.md` § 3.3 ctaUrl 자동 합성) |
586: | `timezone` | `IANATimezone` (예: `"Asia/Seoul"`) | conditional | (v0.13 +) 인스턴스 운영 기준 timezone — digest 스케줄·SLA 영업일 산정에 사용. `features.notifications`·SLA 운영 인스턴스에서 required. DST 처리는 IANA 기준 따름 |
587: | `holidayCalendar` | `{region: ISO3166Alpha2, source?: "package-embedded" \| "external-api", externalApiRef?: string}` | conditional | (v0.13 +) 인스턴스 공휴일 캘린더 — CT-02 BusinessHours의 `dayOfWeek="PublicHoliday"` 매칭 시 사용. 한국 인스턴스는 `region: "KR"`. `source` 기본 `package-embedded` (본 Feature 패키지에 한국 공휴일 데이터 embed, 국가별 확장 시 추가). `clientApproverBusinessHoursAware=true`인 인스턴스에서 required (`features/notifications.md` § 8.4) |
588: | `analyticsConfig` | `AnalyticsConfig` | conditional | (v0.14 +) 외부 분석 도구 자격증명·사이트 식별자 SoT. `features.analytics-reporting` 활성 시 required. **경계 분리**: 본 객체는 source 자격증명·사이트 식별자만, 동작 옵션(스케줄·보존·리포트 템플릿·임계 측정·rate limit)은 `features[name="analytics-reporting"].config`에 둠 (`features/analytics-reporting.md` § 2.3) |
589: | `analyticsPolicyVersion` | `string` | conditional | (v0.14 +) `features.analytics-reporting` 매트릭스·정책 SoT 버전 (예: `"ar-2026-05-14"`). `features.analytics-reporting` 활성 시 required. notifications의 `notificationPolicyVersion` 패턴 동일 — 패키지가 버전별 병렬 보관 + manifest opt-in (`features/analytics-reporting.md` § 1.1·§ 4.2 동등) |
590: | `searchVisibilityConfig` | `SearchVisibilityConfig` | conditional | (v0.16 +) 검색 가시성 모니터링 자격증명·식별자 SoT. `features.search-visibility` 활성 시 required. **경계 분리**: 자격증명·식별자만, 동작 옵션은 `features[name="search-visibility"].config` (`features/search-visibility.md` § 2.3) |
591: | `searchVisibilityPolicyVersion` | `string` | conditional | (v0.16 +) `features.search-visibility` 정책 SoT 버전. analyticsPolicyVersion·notificationPolicyVersion 동일 패턴 |
592: | `keywordMonitoringConfig` | `KeywordMonitoringConfig` | conditional | (v0.17 +) keyword-monitoring 자격증명·식별자 SoT. `features.keyword-monitoring` 활성 시 required. 동작 옵션은 `features[name="keyword-monitoring"].config` SoT (`features/keyword-monitoring.md` § 2.3) |
593: | `keywordMonitoringPolicyVersion` | `string` | conditional | (v0.17 +) `features.keyword-monitoring` 정책 SoT 버전. notifications·analytics·search-visibility 동일 패턴 |
594: | `assetIngestionConfig` | `AssetIngestionConfig` | conditional | (v0.18 +) asset-ingestion 자격증명·식별자 SoT. `features.asset-ingestion` 활성 시 required. 동작 옵션은 `features[name="asset-ingestion"].config` (`features/asset-ingestion.md` § 2.3) |
595: | `assetIngestionPolicyVersion` | `string` | conditional | (v0.18 +) `features.asset-ingestion` 정책 SoT 버전. 5 Feature policyVersion 동일 패턴 |
596: | `crmSyncConfig` | `CrmSyncConfig` | conditional | (v0.19 +) CRM·환자관리 시스템 연동 자격증명·DPA·동의 증빙 SoT. `features.crm-sync` 활성 시 required. 동작 옵션은 `features[name="crm-sync"].config` (`features/crm-sync.md` § 2.3) |
597: | `crmSyncPolicyVersion` | `string` | conditional | (v0.19 +) `features.crm-sync` 정책 SoT 버전. 7 Feature policyVersion 동일 패턴 |
598: | `complianceAssistantExemptApproval` | `{approvedBy: string, approvedAt: Date, exemptionAgreementUrl: URL, reason: string}` | optional | (v0.12 +) compliance-assistant 비활성 예외 승인 기록 — `features/compliance-assistant.md` § 10.3. 본 필드 부재 시 의료기관 인스턴스의 본 Feature 비활성은 빌드 fail |
599: | `lastReleaseApprovedBy` | `string` | optional | 마지막 승인자 |
600: | `lastReleaseApprovedAt` | `Date` | optional | |
601: 
602: #### `RobotsOverride` (v0.11 신규)
603: | 필드 | 타입 | required | 설명 |
604: |---|---|:---:|---|
605: | `userAgent` | `string` | ✅ | 대상 user-agent (예: `GPTBot`) |
606: | `action` | `enum {merge, replace}` | ✅ | 기존 Core 룰에 merge할지 replace할지 |
607: | `allow` | `string[]` | optional | Allow 경로 목록 |
608: | `disallow` | `string[]` | optional | Disallow 경로 목록 |
609: | `note` | `string` | optional | 운영자 메모 |
610: 
611: #### `PerformanceBudget` (v0.11 신규, v0.12 확장)
612: | 필드 | 타입 | required | 설명 |
613: |---|---|:---:|---|
614: | `criticalUrls` | `string[]` | optional | 매 빌드 측정 critical URL. Home·핵심 시술 페이지 등 |
615: | `lcpMsOverride` | `number` | optional | LCP budget 강화 override (Core 기본 2500 이하만 허용) |
616: | `clsOverride` | `number` | optional | CLS budget 강화 override |
617: | `tbtMsOverride` | `number` | optional | |
618: | `bundleSizeKbOverride` | `number` | optional | |
619: | `imageWeightKbOverride` | `number` | optional | (v0.12) Image weight per page (Core 기본 1500) 강화 override |
620: | `lighthousePerformanceMinOverride` | `number` | optional | Performance score 강화 override |
621: | `lighthouseSeoMinOverride` | `number` | optional | (v0.12) SEO score 강화 override (Core 기본 90) |
622: | `lighthouseAccessibilityMinOverride` | `number` | optional | (v0.12) Accessibility score 강화 override (Core 기본 90) |
623: 
624: #### `NotificationChannelsConfig` (v0.13 확장)
625: 
626: | 필드 | 타입 | required | 설명 |
627: |---|---|:---:|---|
628: | `email` | `{enabled: boolean, transport: "smtp" \| "ses" \| "mailgun", secretRef: string, sender: string, replyTo?: string, rateLimitPerHour?: number}` | optional | 이메일 활성화·트랜스포트·발신자·시간당 발송 한도. `secretRef`는 API 키 또는 SMTP 자격 (예: `secretRef://EMAIL_TRANSPORT_KEY`) |
629: | `slack` | `{enabled: boolean, webhookUrlSecretRef: string, rateLimitPerHour?: number}` | optional | Slack Incoming Webhook URL은 항상 secretRef 참조 (직접 URL 금지 — 보안 정책) |
630: | `inApp` | `{enabled: boolean}` | optional | 어드민 DB 내 NotificationInbox 사용 (`features/notifications.md` § 5.3·§ 14) |
631: 
632: > 본 타입은 `features/notifications.md` config(`features[name="notifications"].config`)와 경계 분리: **채널 활성화·트랜스포트 자격은 본 객체**, **digest 스케줄·dedupe 윈도우·retry 정책 등 동작 옵션은 `features.notifications.config`** (notifications.md § 2.3).
633: 
634: #### `VersionSpec`
635: SemVer 형식 (`"1.4.2"`).
636: 
637: #### `IANATimezone` (v0.13 신규)
638: 
639: IANA Time Zone Database 식별자 (`Asia/Seoul`, `America/Los_Angeles` 등). DST 자동 처리.
640: 
641: #### `AnalyticsConfig` (v0.14 신규)
642: 
643: | 필드 | 타입 | required | 설명 |
644: |---|---|:---:|---|
645: | `sources.gsc` | `{enabled: boolean, serviceAccountSecretRef: string, propertyUrl: string}` | optional | Google Search Console |
646: | `sources.naverSearchAdvisor` | `{enabled: boolean, apiKeySecretRef: string, siteUrl: URL}` | optional | 네이버 서치어드바이저 |
647: | `sources.ga4` | `{enabled: boolean, propertyId: string, serviceAccountSecretRef: string}` | optional | Google Analytics 4 |
648: | `sources.rum` | `{enabled: boolean, endpoint: string}` | optional | 자체 RUM (SEARCH_STANDARDIZATION § 6.3 PerformanceEvent·PageViewEvent·ConversionEvent 수신) |
649: 
650: > 동작 옵션(`collectionSchedule`·`retentionDays`·`reportTemplates`·`mediaThresholdMeasurement`·`rateLimit`)은 `features[name="analytics-reporting"].config` SoT (`features/analytics-reporting.md` § 2.3).
651: 
652: #### `SearchVisibilityConfig` (v0.16 신규)
653: 
654: | 필드 | 타입 | required | 설명 |
655: |---|---|:---:|---|
656: | `serpCrawler` | `{enabled: boolean, targetSearchEngines: ("naver"\|"google")[], siteDomain: string, userAgent: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedScope?: SerpCrawlerApprovedScope}` | optional | 자체 SERP 크롤러. `enabled=true` + (`legalApproved !== true` 또는 `legalApprovedBy`·`legalApprovedAt` 누락) → 빌드 fail (SV2-01 정정 — 자동 크롤링 ToS 위험 회피 — `features/search-visibility.md` § 5.2) |
657: | `backlinkSource` | `{enabled: boolean, provider: "ahrefs"\|"semrush"\|"moz"\|"self-crawl", apiKeySecretRef: string, siteDomain: string}` | optional | 외부 백링크 도구 |
658: 
659: > 동작 옵션(`monitoringSchedule`·`signals`·`anomalyHysteresis`·`retentionDays` 등)은 `features[name="search-visibility"].config` SoT.
660: 
661: #### `KeywordMonitoringConfig` (v0.17 신규)
662: 
663: | 필드 | 타입 | required | 설명 |
664: |---|---|:---:|---|
665: | `serpCrawler` | `{enabled: boolean, ...}` | optional | **v1.0: `enabled=true` → 빌드 fail (regardless of legalApproved)** — `features/keyword-monitoring.md` § 5.2 v1.0 미지원 정책 (KM2-01). v1.x 활성화 시 search-visibility SerpCrawlerApprovedScope 게이트 패턴 재사용 (KM-14 후속 결정 후). v1.0 manifest validator는 enabled=true 단독으로 fail 처리, legalApproved/승인자/시각 검증은 v1.x 활성 시점부터 적용 |
666: 
667: > 동작 옵션(`monitoringSchedule`·`signals`·`anomalyHysteresis`·`keywordTargetSource`·`retentionDays` 등)은 `features[name="keyword-monitoring"].config` SoT (`features/keyword-monitoring.md` § 2.3).
668: 
669: #### `AssetIngestionConfig` (v0.18 신규)
670: 
671: | 필드 | 타입 | required | 설명 |
672: |---|---|:---:|---|
673: | `sources.webCrawl` | `{enabled: boolean, targetDomains: string[], userAgent: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedScope?: AssetIngestionApprovedScope}` | optional | 외부 웹사이트 크롤링. `enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedScope` 누락) → 빌드 fail (F-11) |
674: | `sources.snsApi.<platform>` | `{enabled: boolean, apiKeySecretRef: string, blogId/accountId: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedAccountIds: string[], allowedContentTypes: string[], consentEvidenceRef?: string}` | optional | platform=naverBlog·instagram·facebook·youtube. `enabled=true` + 법무 게이트 누락 → 빌드 fail (F-12) |
675: | `sources.manualUpload` | `{enabled: boolean, maxFileSizeMb: number, allowedMimeTypes: string[]}` | optional | 어드민 UI 업로드 |
676: | `sources.csvImport` | `{enabled: boolean, maxRowsPerImport: number}` | optional | bulk CSV import |
677: 
678: #### `AssetIngestionApprovedScope` (v0.18 신규 — F-10)
679: 
680: SerpCrawlerApprovedScope의 SERP 특화 필드(searchEngines·locales·devices·geo)를 제거하고 자산 수집 특화:
681: 
682: | 필드 | 타입 | required | 설명 |
683: |---|---|:---:|---|
684: | `allowedDomains` | `string[]` | ✅ | 허용 도메인 목록 (빈 배열 → build fail) |
685: | `allowedPathPrefixes` | `string[]` | optional | path 화이트리스트 |
686: | `maxPagesPerCrawl` | `integer` | ✅ | 한 번의 크롤링 최대 페이지 수 |
687: | `maxAssetSizeMb` | `integer` | ✅ | 단일 asset 최대 크기 |
688: | `artifactRetentionDaysMax` | `integer` | ✅ | retention 상한 |
689: | `allowLoginState` | `boolean` | optional | 누락 시 false 자동. true 명시는 법무 승인 필요 |
690: | `allowCaptchaBypass` | `boolean` | optional | 누락 시 false. true는 build fail (운영상 금지) |
691: 
692: > 동작 옵션(`mode`·`ingestionSchedule`·`tagging`·`review`·`pii`·`promote`·`retentionDays`·`blobStorage` 등)은 `features[name="asset-ingestion"].config` SoT (`features/asset-ingestion.md` § 2.3).
693: 
694: #### `CrmSyncConfig` (v0.19 신규)
695: 
696: | 필드 | 타입 | required | 설명 |
697: |---|---|:---:|---|
698: | `integrations` | `CrmIntegrationEntry[]` | ✅ | multiple CRM 연동 지원 (예: 본원 Salesforce + 분원 HubSpot) |
699: 
700: #### `CrmIntegrationEntry` (v0.19 신규)
701: 
702: | 필드 | 타입 | required | 설명 |
703: |---|---|:---:|---|
704: | `id` | string | ✅ | integration 식별자 (instance scope unique) |
705: | `provider` | enum (`salesforce`·`hubspot`·`generic-rest-api`) | ✅ | **v1.0은 3종만**. `korean-emr`은 v1.x patch (CS-13). 해당 enum 값 build fail |
706: | `apiKeySecretRef` | string | ✅ | provider별 API key/OAuth client credentials |
707: | `apiUrl` | URL | ✅ | provider endpoint |
708: | `webhookSecret` | string | conditional | bi-directional 모드 시 required (signature 검증용) |
709: | `credentialExpiresAt` | Date | optional | OAuth token 등 만료 시각. null = 만료 없음 |
710: | `legalApproved` | boolean | ✅ | **DPA(Data Processing Agreement) 체결 완료** — true 필수 (CS1-12) |
711: | `legalApprovedBy` | string | ✅ | |
712: | `legalApprovedAt` | Date | ✅ | |
713: | `dpaEvidenceRef` | string | ✅ | DPA 계약 증빙 secretRef. **`patientConsentEvidenceRef`와 분리** (CS1-12) — DPA는 provider·기관 계약 증빙. 환자 단위 동의 증빙은 별도 (v1.0은 record-level 미저장 — CS-07 후속) |
714: 
715: > 동작 옵션(`mode`·`syncSchedule`·`entities`·`fieldMappingPolicyVersion`·`retryQueue`·`credentialRotation`·`pii`·`retentionDays` 등)은 `features[name="crm-sync"].config` SoT (`features/crm-sync.md` § 2.3).
716: 
717: #### `SerpCrawlerApprovedScope` (v0.16 신규 — SV2-02 구조화)
718: 
719: 법무가 승인한 SERP 크롤러 권한 범위. crawler 실행 파라미터가 본 범위 밖이면 `skipped-legal-out-of-scope` 처리:
720: 

 succeeded in 678ms:
460: ## 9. 알림 (notifications Feature Module 인터페이스)
461: 
462: 본 문서는 알림 **인터페이스·정책 SoT** — 이벤트 enum·페이로드 타입·이벤트별 채널/우선순위 정책 정의. 실제 발송 구현·재시도·dedupe·digest 큐 등 구현 영역은 `features/notifications.md`.
463: 
464: ### 9.1 NotificationEventType enum (canonical SoT)
465: 
466: ```ts
467: type NotificationEventType =
468:   | "content-gate-queued"           // content-gate 큐 진입
469:   | "blocked-correction-required"   // automatedDecision="block" fail 발생 — 작성자 정정 요청
470:   | "stale-queued"                  // stale 큐 진입
471:   | "warning-queued"                // warning 큐 진입
472:   | "prior-review-result"           // 사전심의 결과 도착
473:   | "reviewer-approved"             // 검수자 approve
474:   | "reviewer-rejected"             // 검수자 reject
475:   | "publish"                       // 발행 완료
476:   | "sla-imminent"                  // SLA 24시간 전
477:   | "sla-overdue"                   // SLA 미달
478:   // `features/analytics-reporting.md` 1차 cycle cascade (F-2)
479:   | "analytics-report-ready"        // 리포트 생성 완료·발송
480:   | "media-threshold-reached"       // 의료법 일평균 이용자 10만 임계 도달 (false → true 전이만)
481:   | "media-threshold-released"      // 임계 해제 (true → false 전이만, hysteresis 적용)
482:   // `features/search-visibility.md` 1차 cycle cascade (F-1)
483:   | "search-visibility-anomaly-critical"     // critical severity anomaly
484:   | "search-visibility-anomaly-warning"      // warning severity anomaly
485:   | "search-visibility-monitoring-failed"    // 모니터링 cycle 실패 (모든 source)
486:   | "ai-briefing-citation-first-detected"    // siteDomain AI 브리핑 인용 첫 등장
487:   | "ai-briefing-citation-lost"               // 기존 AI 브리핑 인용 N일 연속 미노출
488:   // `features/keyword-monitoring.md` 1차 cycle cascade (F-1)
489:   | "keyword-monitoring-rank-improved"        // 사용자 지정 키워드 평균 순위 개선
490:   | "keyword-monitoring-rank-dropped"         // 평균 순위 하락
491:   | "keyword-monitoring-impressions-spike"    // 노출수 급증
492:   | "keyword-monitoring-impressions-drop"     // 노출수 급감
493:   | "keyword-monitoring-ctr-anomaly"          // CTR 이상 변동
494:   | "keyword-monitoring-rank-bucket-improved" // rank bucket 상위 진입
495:   | "keyword-monitoring-rank-bucket-dropped"  // rank bucket 하위 이탈·absent
496:   | "keyword-monitoring-monitoring-failed"    // 모니터링 cycle 실패
497:   // `features/asset-ingestion.md` 1차 cycle cascade (F-2)
498:   | "asset-ingestion-batch-completed"         // 수집 완료
499:   | "asset-ingestion-batch-failed"            // 수집 실패
500:   | "asset-ingestion-review-required"         // 검수 큐 진입
501:   | "asset-ingestion-pii-detected"            // PII 감지 (의료 도메인 critical)
502:   | "asset-ingestion-asset-promoted"          // Core 데이터 계약 변환 완료
503:   // `features/crm-sync.md` 1차 cycle cascade (CS1-01)
504:   | "crm-sync-batch-failed"                   // sync cycle 실패
505:   | "crm-sync-conflict-detected"              // 양방향 sync 충돌
506:   | "crm-sync-credential-expired"             // CRM 자격증명 만료
507:   | "crm-sync-credential-expiring-soon";      // 만료 14일 전
508: ```
509: 
510: ### 9.1.1 이벤트 정책 매트릭스 (canonical SoT)
511: 
512: 이벤트별 수신자·즉시 채널·digest 주기·critical 분류·quietHours·opt-out 정책의 **단일 정의표**. § 3.3 우선순위·SLA의 "권장 알림" 컬럼은 본 표를 따른다.
513: 
514: | eventType | 한국어 이벤트명 | 수신자 산정 | 즉시 채널 | fallback 채널 (hard-suppressed 시) | digest 주기 | criticality | quietHoursPolicy | optOutPolicy |
515: |---|---|---|---|---|---|---|---|---|
516: | `content-gate-queued` | content-gate 큐 진입 | finalRoles[] 매칭 검수자 (operator + 등급 기본 medical + 룰 추가 역할 합집합) | email + slack + inApp | inApp | — | **critical** | bypass (보류 안 함) | mandatory (옵트아웃 불가) |
517: | `blocked-correction-required` | blocked 정정 요청 | 작성자 + operator | email + slack + inApp | inApp | — | **critical** | bypass | mandatory |
518: | `stale-queued` | stale 큐 진입 | `staleFlags.<role>=true` 매칭 검수자 | inApp | (없음 — inApp만) | email — 의료법 개정은 일일, 기타는 주간 | high | respect (사용자 quietHours 보류) | digestOptOut 허용 (단 의료법 개정 stale은 mandatory) |
519: | `warning-queued` | warning 큐 진입 | operator | inApp | (없음) | email 일일 요약 | normal | respect | digestOptOut 허용 |
520: | `prior-review-result` | 사전심의 결과 도착 | 운영자 + legal 검수자 | email + inApp | inApp | — | **critical** | bypass | mandatory |
521: | `reviewer-approved` | 검수자 approve | 작성자 + 운영자 | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
522: | `reviewer-rejected` | 검수자 reject | 작성자 | email + inApp | inApp | — | high | respect | mandatory |
523: | `publish` | 발행 완료 | 운영자 + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
524: | `sla-imminent` | SLA 24시간 전 | 검수자 + 운영팀 | email + inApp | inApp | — | high | respect | mandatory |
525: | `sla-overdue` | SLA 미달 | 운영팀 (에스컬레이션) | email + inApp | inApp | — | **critical** | bypass | mandatory |
526: | `analytics-report-ready` | 분석 리포트 발송 | 템플릿 `recipients[]` 산정(operator·client-approver 등) | email + inApp | inApp | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
527: | `media-threshold-reached` | 일평균 이용자 10만 임계 도달 | operator + legal 검수자 + client-approver | email + inApp | inApp | — | **critical** | bypass | mandatory |
528: | `media-threshold-released` | 임계 해제 | operator + legal 검수자 + client-approver | email + inApp | inApp | — | high | respect | mandatory |
529: | `search-visibility-anomaly-critical` | 검색 가시성 critical anomaly | operator + client-approver | email + inApp | inApp | — | **critical** | bypass | mandatory |
530: | `search-visibility-anomaly-warning` | 검색 가시성 warning anomaly | operator | inApp | (없음) | email 일일 요약 | high | respect | digestOptOut 허용 |
531: | `search-visibility-monitoring-failed` | 모니터링 cycle 실패 (전 source) | operator | email + inApp | inApp | — | high | respect | mandatory |
532: | `ai-briefing-citation-first-detected` | AI 브리핑 인용 첫 등장 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
533: | `ai-briefing-citation-lost` | AI 브리핑 인용 상실 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
534: | `keyword-monitoring-rank-improved` | 키워드 순위 개선 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
535: | `keyword-monitoring-rank-dropped` | 키워드 순위 하락 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
536: | `keyword-monitoring-impressions-spike` | 키워드 노출 급증 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
537: | `keyword-monitoring-impressions-drop` | 키워드 노출 급감 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
538: | `keyword-monitoring-ctr-anomaly` | 키워드 CTR 이상 | operator + client-approver | email + inApp | inApp | — | high | respect | mandatory |
539: | `keyword-monitoring-rank-bucket-improved` | 키워드 rank bucket 상위 진입 | operator + client-approver | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
540: | `keyword-monitoring-rank-bucket-dropped` | 키워드 rank bucket 하위/absent | operator + client-approver | email + inApp | inApp | — | high (critical when bucket→absent) | respect | mandatory |
541: | `keyword-monitoring-monitoring-failed` | 키워드 모니터링 cycle 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
542: | `asset-ingestion-batch-completed` | 수집 완료 | operator | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
543: | `asset-ingestion-batch-failed` | 수집 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
544: | `asset-ingestion-review-required` | 검수 큐 진입 | operator | inApp | (없음) | email 일일 요약 | normal | respect | digestOptOut 허용 |
545: | `asset-ingestion-pii-detected` | PII 감지 | operator + legal 검수자 | email + inApp | inApp | — | **critical** | bypass | mandatory |
546: | `asset-ingestion-asset-promoted` | Core 변환 완료 | operator | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
547: | `crm-sync-batch-failed` | CRM sync 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
548: | `crm-sync-conflict-detected` | CRM 충돌 감지 | operator | email + inApp | inApp | — | high | respect | mandatory |
549: | `crm-sync-credential-expired` | CRM 자격증명 만료 | operator + super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
550: | `crm-sync-credential-expiring-soon` | 만료 14일 전 | operator + super-admin | email + inApp | inApp | — | high | respect | mandatory |
551: 
552: - **fallback 채널 컬럼**: 즉시 채널 중 일부가 `hard-suppressed` 상태일 때 본 컬럼의 채널로 자동 라우팅. **fallback 채널은 본 매트릭스의 정식 SoT** — 즉시 채널 외부의 임의 추가 금지. fallback도 hard-suppressed면 외부 monitoring sink alert만 발생 (recipient 발송 대체 아님, `features/notifications.md` § 7.3)
553: 
554: - **criticality**: `critical` 이벤트는 사용자 quietHours·opt-out·인스턴스 운영시간(LocationProfile.businessHours)을 우회. 단, **inactive 사용자·인스턴스 채널 비활성·idempotency·dedupe는 우회하지 않음** (`features/notifications.md` § 4.1·§ 8.3 필터 순서). `high`는 사용자 quietHours 보류, `normal`은 전체 정책 적용
555: - **수신자 산정 규칙**: `eventType` → eligible AdminUserRole (§ 11.1) → ApproverRole 자격 (§ 11.2 ⚠️ 자격 검증) → 인스턴스 멤버십 → AdminUser.notificationPreferences 필터 (`features/notifications.md` § 4.1)
640: };
641: ```
642: 
643: #### 10.2.1 AuditAction enum
644: 
645: ```ts
646: type AuditAction =
647:   | "approve" | "reject" | "request-changes" | "delegate"
648:   | "publish" | "unpublish"
649:   | "stale-triggered" | "stale-resolved"
650:   | "compliance-record-updated"
651:   | "permission-changed" | "login" | "logout"
652:   | "notification-dispatched"               // 알림 발송 envelope 종료 요약
653:   | "notification-resend-attempted"         // DLQ에서 운영자 수동 재발송 시도 (`features/notifications.md` § 7.2)
654:   | "notification-read"                      // 사용자가 inApp 알림 클릭·읽음 마킹 시 (`features/notifications.md` § 5.3)
655:   | "notification-suppression-unsuppressed"   // 운영자가 hard-suppressed AdminUser 채널을 수동 해제 (`features/notifications.md` § 7.4)
656:   | "search-visibility-retroactive-enqueue-requested"   // 운영자가 search-visibility retroactive outbox enqueue 명시 액션 (`features/search-visibility.md` § 7.5)
657:   // `features/keyword-monitoring.md` 1차 cycle cascade (F-15)
658:   | "keyword-tracking-target-registered"      // 키워드 추적 등록 (operator·super-admin)
659:   | "keyword-tracking-target-unregistered"    // 추적 해제 (soft delete — active=false)
660:   | "keyword-anomaly-resolution-updated"      // KeywordAnomalyRecord.resolutionStatus 갱신
661:   | "keyword-monitoring-retroactive-enqueue-requested"   // 운영자 retroactive outbox enqueue 명시 액션
662:   | "keyword-tracking-target-migrated-v02-v03"           // v0.2→v0.3 데이터 모델 migration (`features/keyword-monitoring.md` § 10.3)
663:   // `features/asset-ingestion.md` 1차 cycle cascade (F-4)
664:   | "asset-ingestion-source-registered"       // IngestionSource 등록
665:   | "asset-ingestion-source-unregistered"     // soft delete
666:   | "asset-ingestion-asset-promoted"          // Core 데이터 계약 변환
667:   | "asset-ingestion-asset-rejected"          // 검수 거부
668:   | "asset-ingestion-pii-redacted"            // PII 자동·수동 redaction
669:   // `features/crm-sync.md` 1차 cycle cascade (CS1-01·16)
670:   | "crm-integration-registered"              // CRM 연동 등록
671:   | "crm-integration-unregistered"            // soft delete
672:   | "crm-sync-conflict-resolved"              // 충돌 운영자 해결
673:   | "crm-credential-rotated";                 // 자격증명 rotation
674: ```
675: 

 succeeded in 732ms:
430: | 조건 | escalate? |
431: |---|---|
432: | FieldAuthority=last-write-wins-timestamp + provider timestamp 차이 ≤ 5s + version tie | ✅ |
433: | FieldAuthority=last-write-wins-version + version tie | ✅ |
434: | FieldAuthority=last-write-wins-timestamp + provider timestamp 누락 | ✅ |
435: | 동일 fieldPath·동일 appliedFieldVersion 이하 재충돌 | ✅ |
436: | FieldAuthority=crm/solution-authoritative | ❌ |
437: 
438: ### 4.4 retry queue (CS2-12 — search-visibility § 13.5 worker SQL 복제)
439: 
440: § 13.4 풀 schema + worker SoT SQL 명시.
441: 
442: ### 4.5 credential rotation 상태 머신 (CS2-09)
443: 
444: #### 4.5.1 CrmCredentialVersion entity — § 13.11 schema
445: 
446: #### 4.5.2 상태 머신 + outbound/inbound 사용 matrix
447: 
448: ```
449: stable → rotating → committed → grace-expired → stable
450:                   ↘ reverted → stable
451: ```
452: 
453: | 상태 | activeSecretRef | previousSecretRef | graceUntil | outbound 사용 | inbound verifier 허용 |
454: |---|---|---|---|---|---|
455: | stable | new | null | null | active | active만 |
456: | rotating | new | old | now + 30min | **new 우선·old fallback** | **old + new 병행** |
457: | committed | new | old | graceUntil (rotating에서 받음) | new only | old + new 병행 (graceUntil까지) |
458: | grace-expired | new | null (revoked) | null | new only | new only |
459: | reverted | old | null | null | old | old |
460: 
461: `rotationAttemptId` UUID — audit cascade·운영자 추적.
462: 
463: `rotateCredential(integrationId, newSecretRef)`:
464: 1. CrmCredentialVersion(state="rotating-target") insert. integration.state="rotating"
465: 2. health check (new credential로 CRM API 호출)
466: 3. 성공 → state="active" / 이전 active row → state="committed"·graceUntil 설정. integration.state="committed"
467: 4. 실패 → 신규 row state="reverted". integration.state="reverted" → grace 후 stable
468: 5. graceUntil 도래 → grace-expired worker가 이전 row revoke. integration.state="stable"
469: 
470: ### 4.6 outbox — search-visibility § 7.2 SQL 동일
471: 
472: ---
473: 
474: ## 5. provider 어댑터 (v1.0 — 3종)
475: 
476: § 3.4.2 adapter contract 참조. korean-emr v1.x deferred (CS-13).
477: 
478: ### 5.1 rate limit (CrmRateLimitState — § 13.10)
479: 
480: provider별 redis token bucket. retry-after 헤더 respect.
481: 
482: ---
483: 
484: ## 6. 알림 (CS2-11)
485: 
486: ### 6.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 SoT)
487: 
488: | eventType | criticality | 채널 | recipients |
489: |---|---|---|---|
490: | `crm-sync-batch-failed` | high | email + inApp | operator |
491: | `crm-sync-conflict-detected` | high | email + inApp | operator |
492: | `crm-sync-credential-expired` | **critical** | email + inApp | operator + super-admin |
493: | `crm-sync-credential-expiring-soon` | high | email + inApp | operator + super-admin |
494: 
495: ### 6.2 outbox — search-visibility § 7.2 SQL 동일
496: 
497: ### 6.3 NotificationEvent 매핑 (CS2-11 — credentialVersion 포함)
498: 
499: | eventType | sourceKind | sourceId | contentRef |
500: |---|---|---|---|
501: | `crm-sync-batch-failed` | `sync-log` | syncLogId | `"sync-log:" + syncLogId` |
502: | `crm-sync-conflict-detected` | `conflict` | conflictId | `"crm-conflict:" + conflictId` |
503: | `crm-sync-credential-expired` | `credential-version` | **`integrationId:credentialVersionId`** | `"crm-integration:" + integrationId` |
504: | `crm-sync-credential-expiring-soon` | `credential-version` | **`integrationId:credentialVersionId`** | 동일 |
505: 
506: `sourceEventId = hash("crm-sync:" + sourceKind + ":" + sourceId + ":" + eventType)`. credentialVersion 갱신 시 새 row 허용 — lifecycle 반복 안전.
507: 
508: ---
509: 
510: ## 7. PII 처리 (CS2-02·05·07)
511: 
512: ### 7.1 raw PII 저장 금지 — closed schema
513: 
514: - `pii.rawPiiStorageAllowed=false` 강제 (true 시 build fail)
515: - **displayHints는 6 column closed schema** (§ 3.2.1) — JSON 자유 필드 금지
516: - DB CHECK + application validator 양층 — insert 자체 reject
517: - `changedFields`·`snapshot`도 **allowlisted field token + masked value만**:
518:   - field token allowlist: `nameInitial`·`phoneLast4`·`emailDomain`·`cityName`·`genderHint`·`ageBand`·`statusEnum`·`crmExternalId`·`occurredAt`·`source`·`campaign`
519:   - value: § 3.2.1 정규식 또는 enum
520: - drift 감지(§ 10.4)는 **사후 보조 invariant**
521: 
522: ### 7.2 RRN deny
523: 
524: - `pii.ssnRrnHandling="deny"` 강제
525: - asset-ingestion § 9.1 RRN checksum 재사용
526: - 검출 시: payload 폐기·ledger 보존(recoverable/final)·복구 § 4.2.1
527: 
528: ### 7.3 raw PII 실시간 조회 — v1.x deferred (CS2-02·07)
529: 
530: **v1.0 미제공**. `liveReadCrmDetail`은 CS-14로 deferred. 운영자는 v1.0에서 CRM 콘솔로 직접 접근.
530: **v1.0 미제공**. `liveReadCrmDetail`은 CS-14로 deferred. 운영자는 v1.0에서 CRM 콘솔로 직접 접근.
531: 
532: 차단 이유:
533: - record-level consent/withdrawal 상태 확인 contract 미정 (CS-07)
534: - audit cascade `crm-live-read` 미완 (CS-14)
535: - DPA만으로 record-level 적법성 대체 불가
536: 
537: v1.x에서 두 cascade 완료 후 활성화.
538: 
539: ### 7.4 DPA vs patient consent 분리
540: 
541: - `dpaEvidenceRef` 필수: 의료기관 ↔ Glitzy 데이터 처리 위탁 계약 증빙
542: - `patientConsentEvidenceRef` v1.x (CS-07): 환자 단위 동의·right to erasure
543: - v1.0: DPA 게이트 + raw PII는 CRM 측 책임
544: 
545: ---
546: 
547: ## 8. 운영 지표 + acceptance test (CS2-16)
548: 
549: ### 8.1 핵심 지표
550: 
551: | 지표 | 정의 | 목표 |
552: |---|---|---|
553: | sync 성공율 | success / 전체 | > 99% |
554: | outbound push 지연 p95 | < 5초 | |
555: | inbound webhook 지연 p95 | < 10초 | |
556: | 충돌 발생율 | < 1% (baseline 후) | |
557: | credential 만료 알림 SLA | 7일 내 처리 | > 95% |
558: | RRN deny 발생율 | baseline | |
559: | RRN false positive 복구 처리 SLA | 24시간 | > 90% |
560: | webhook signature reject율 | < 0.1% | |
561: | ledger dedupe 적중률 | baseline | |
562: | outbox 발송 성공율 | > 99% | |
563: | CAS lost-update 감지율 | baseline. 운영자 검토 | |
564: 
565: ### 8.2 acceptance test fixture (CS2-16 — 27 cases)
566: 
567: | ID | 영역 | 케이스 |
568: |---|---|---|
569: | AT-01 | manifest | legalApproved=false → build fail |
570: | AT-02 | manifest | korean-emr → build fail |
571: | AT-03 | manifest | appointment enabled → build fail |
572: | AT-04 | manifest | rawPiiStorageAllowed=true → build fail |
573: | AT-05 | manifest | ssnRrnHandling≠"deny" → build fail |
574: | AT-06 | manifest | dpaEvidenceRef 누락 → build fail |
575: | AT-07 | manifest | outbound-only + conflictResolution≠outbound-only-no-conflict → build fail |
576: | AT-08 | webhook verifier | provider별 valid/invalid signature·rawBody integrity·timestamp window |
577: | AT-09 | ledger dedupe | exactly-once 재전송 → `duplicate-eventid` |
578: | AT-10 | ledger dedupe | at-least-once 재전송 → `duplicate-digest` |
579: | AT-11 | RRN deny | regex+checksum 통과 RRN → 폐기 + ledger recoverable |
580: | AT-12 | RRN false positive 복구 | recoverRrnFalsePositive(override-and-fetch) → accepted-processed |
581: | AT-13 | outbound-only | processInboundWebhook direct invocation → runtime fail |
582: | AT-14 | outbound-only | runSync direction="inbound" → runtime fail |
583: | AT-15 | outbound-only | webhook endpoint HTTP request → 404 |
584: | AT-16 | retry exhausted | maxAttempts 도달 → failed-permanent + sink alert |
585: | AT-17 | credential rotation | stable→rotating→committed (성공) |
586: | AT-18 | credential rotation | stable→rotating→reverted (실패) |
587: | AT-19 | credential rotation 동시성 | rotating 중 outbound + inbound 동시 → 모두 성공 |
588: | AT-20 | CAS lost-update | 동시 inbound + outbound 같은 record → 1 성공 + 1 ConflictRecord |
589: | AT-21 | CAS field-level resolve | manual resolve 후 동일 fieldPath·동일 version 이하 재충돌 차단 |
590: | AT-22 | displayHints closed schema | 자유 JSON insert → DB CHECK reject |
591: | AT-23 | displayHints closed schema | raw 이름·전화 패턴 위반 → validator reject |
592: | AT-24 | outbox idempotency | credential rotation 후 새 credentialVersion 만료 임박 → 새 outbox row |
593: | AT-25 | purge worker | retentionDays.changeLog 도달 → purge |
594: | AT-26 | audit cascade | 4종 AuditAction insert 성공 |
595: | AT-27 | notification cascade | 4종 NotificationEventType emit 성공 |
596: 
597: ---
598: 
599: ## 9. 설치·설정 — DB 12 tables 마이그레이션 (§ 13)
600: 
601: ---
602: 
603: ## 10. 빌드·런타임·migration·invariant 검증
604: 
605: ### 10.1 build-time fail
606: 
607: - `enabled=true` + `crmSyncConfig` 또는 `integrations[]` 빈 배열
608: - `crmSyncPolicyVersion` 누락 또는 패키지 보관 버전 불일치
609: - integration `legalApproved !== true` 또는 승인자/시각 누락
610: - integration `dpaEvidenceRef` 누락
611: - integration `apiKeySecretRef`·`apiUrl` 누락
612: - bi-directional + `webhookSecret` 누락
613: - integration `provider` ∉ {salesforce, hubspot, generic-rest-api}
614: - `provider="generic-rest-api"` + `genericRestApiAdapter` config 누락 (CS2-03)
615: - `requiresFeature: notifications` 충족 안 됨
616: - **`pii.rawPiiStorageAllowed=true`** (CS2-05)
617: - **`pii.ssnRrnHandling !== "deny"`**
618: - **`pii.liveReadEnabled=true`** (CS2-02·07)
619: - `entities.*` 모두 disabled
620: - `entities.appointment.enabled=true`
620: - `entities.appointment.enabled=true`
621: - **outbound-only mode** + 어느 entity `conflictResolution ≠ "outbound-only-no-conflict"` (CS2-06)
622: - **outbound-only mode** + CrmFieldMapping에 `direction IN (inbound, both)` 존재 (CS2-06)
623: - `fieldMappingPolicyVersion` 누락
624: 
625: ### 10.2 runtime validation fail
626: 
627: - `forceRefresh=true` + `refreshIntentId` 누락
628: - webhook signature 검증 실패 → HTTP 401
629: - replay window 초과 → rejected-stale-timestamp
630: - credential 만료 후 sync 시도 → skipped-credential-expired
631: - inbound payload RRN 검출 → 폐기 + sink alert + ledger
632: - outbound push payload RRN 검출 → 차단 + 운영자 alert
633: - `resolveConflict` 시 conflictId 이미 resolved
634: - **outbound-only + processInboundWebhook direct invocation** → runtime fail
635: - **outbound-only + runSync inbound/both** → runtime fail
636: - **CAS WHERE 0 rows affected** → ConflictRecord 생성 + 운영자 alert
637: - **displayHints closed schema 위반 insert** → DB CHECK reject + validator alert
638: - `recoverRrnFalsePositive` 시 ledger status가 rejected-rrn-recoverable 아님
639: 
640: ### 10.3 migration-time validation
641: 
642: - v0.3 cascade 신규 (v0.1·v0.2 운영 데이터 부재 전제)
643: - displayHints column 분리: 6 column. v0.2 운영 데이터 없으므로 backfill 불필요
644: 
645: ### 10.4 runtime invariant·reconcile
646: 
647: - CrmSyncRetryQueue stale processing (lockedAt > 10분) → reconcile
648: - CrmConflictRecord open + slaDeadline 초과 → SLA 미달 추가 알림
649: - credential expiry 임박 → expiring-soon
650: - credential 만료 → expired + integration 자동 비활성화
651: - **PII drift 감지** — CHECK 미적용 historical row 등 → sink alert + 운영자 수동 정리 (사후 보조)
652: - CredentialVersion grace-expired 전이 worker
653: - CrmWebhookNonceLedger `rejected-rrn-recoverable` 24h 무처리 → 운영자 alert (CS2-10)
654: 
655: ### 10.5 warning
656: 
657: - integration `credentialExpiresAt` null
658: - `pollIntervalMinutes` > 60
659: - conflict open ≥ 5건 누적
660: - ledger `duplicate-digest` 비율 > 5% (provider eventId 누락 의심)
661: 
662: ---
663: 
664: ## 11. 미결정 사항 — 3분류 + 잔여 리스크 (CS2-17)
665: 
666: ### 11.1 open (v1.x·M2+ 후속)
667: 
668: | ID | 항목 | 비고 |
669: |---|---|---|
670: | CS-02 | 양방향 sync 충돌 SLA·escalation 운영 정책 | 운영 |
671: | CS-03 | 다중 CRM 통합 시 우선순위 | 운영 |
672: | CS-04 | webhook endpoint 보안 (IP allowlist) | 인프라 |
673: | CS-05 | OAuth refresh token rotation 자동화 정밀화 | 인프라 |
674: | CS-06 | provider별 quota 운영 가이드 | M2+ |
675: | CS-08 | LLM 기반 field auto-mapping | v1.x |
676: | CS-09 | CrmFieldMapping bulk import/export | M2+ |
677: | CS-10 | webhook 실패 시 polling fallback 자동 격상 | 운영 |
678: | CS-15 | CONTENT_STANDARDS submission/event 인터페이스 cascade | v1.0은 본 문서 § 3.2 canonical로 대체 |
679: | CS-18 | `@provenanceCrmRecordId` 공통 메타 cascade | v1.x (CRM→Core promote 시 필요) |
680: 
681: ### 11.2 deferred-v1.x
682: 
683: | ID | 항목 | v1.0 영향 |
684: |---|---|---|
685: | CS-07 | patientConsentEvidenceRef·right to erasure | liveRead v1.0 미지원으로 차단 회피 |
686: | CS-11 | CRM → Core 자동 promote | 운영자 수동 promote |
687: | CS-12 | `appointment` entity | build fail로 차단 |
688: | CS-13 | `korean-emr` provider | build fail로 차단 |
689: | CS-14 | `crm-live-read` audit + liveReadCrmDetail | liveRead v1.x로 내림 (CS2-02) |
690: 
691: ### 11.3 resolved-in-v1.0
692: 
693: | ID | 해소 |
694: |---|---|
695: | ~~CS-01~~ | RRN deny — v0.2 + asset-ingestion checksum 재사용 |
696: | ~~CS-14 v1.0 cascade~~ | liveRead를 v1.x로 내려 audit cascade 부담 제거 |
697: 
698: ### 11.4 v0.3 잔여 리스크 (CS2-17)
699: 
700: | 영역 | 상태 | 비고 |
701: |---|---|---|
702: | CONTENT_STANDARDS cascade | open | § 3.2 canonical schema가 v1.0 운영을 충족. v1.x에서 CONTENT_STANDARDS로 흡수 |
703: | `@provenanceCrmRecordId` | open | CS-18. v1.0은 crmExternalId·integrationId로 출처 추적 |
704: | provider별 quota 운영 가이드 | open | CS-06. v1.0은 rate limit config |
705: 
706: ---
707: 
708: ## 12. 변경 이력
709: 
710: | 일자 | 버전 | 변경 |
718: ## 13. 본 Feature 내부 데이터 구조 (admin DB **12 tables**)
719: 
720: ### 13.1 `CrmIntegration`
721: 
722: | 필드 | 타입 | required |
723: |---|---|:---:|
724: | `id` | UUID | ✅ |
725: | `instanceId` | Slug | ✅ |
726: | `integrationKey` | string | ✅ |
727: | `provider` | enum (salesforce·hubspot·generic-rest-api) | ✅ |
728: | `apiKeySecretRef` | secretRef | ✅ |
729: | `apiUrl` | string | ✅ |
730: | `webhookSecret` | secretRef | optional |
731: | `credentialExpiresAt` | Date | optional |
732: | `currentCredentialVersionId` | UUID | ✅ — FK § 13.11 |
733: | `credentialState` | enum (stable·rotating·committed·grace-expired·reverted) | ✅ |
734: | `legalApproved` | boolean | ✅ |
735: | `legalApprovedBy`·`legalApprovedAt` | string·Date | ✅ |
736: | `dpaEvidenceRef` | secretRef | ✅ |
737: | `genericRestApiAdapter` | JSON | optional (provider=generic-rest-api 시 ✅) |
738: | `mode` | enum | ✅ |
739: | `active` | boolean | ✅ |
740: | `createdAt`·`updatedAt` | Date | ✅ |
741: 
742: **Constraints**: `UNIQUE(instanceId, integrationKey) WHERE active=true`. `FK currentCredentialVersionId → CrmCredentialVersion.id`.
743: **Index**: `(instanceId, active)`, `(credentialExpiresAt)`.
744: 
745: ### 13.2 `CrmSyncLog`
746: 
747: | 필드 | 타입 | required |
748: |---|---|:---:|
749: | `id` | UUID | ✅ |
750: | `idempotencyKey` | string | ✅ |
751: | `instanceId` | Slug | ✅ |
752: | `mode` | enum (scheduled·on-demand) | ✅ |
753: | `direction` | enum (inbound·outbound·both) | ✅ |
754: | `manifestVersion` | string | ✅ |
755: | `forceRefresh` | boolean | ✅ |
756: | `refreshIntentId` | string | optional |
757: | `windowStart`·`windowEnd` | Date | optional |
758: | `startedAt`·`completedAt` | Date | ✅·optional |
759: | `envelopeState` | enum (running·succeeded·partial·failed·retried) | ✅ |
760: | `expiresAt` | Date | ✅ — retentionDays.syncLog |
761: 
762: **Constraints**: `UNIQUE(instanceId, idempotencyKey)`.
763: **Index**: `(expiresAt)`, `(instanceId, startedAt DESC)`.
764: 
765: ### 13.3 `CrmSyncSourceAttempt`
766: 
767: | 필드 | 타입 | required |
768: |---|---|:---:|
769: | `id` | UUID | ✅ |
770: | `syncLogId` | UUID | ✅ — FK ON DELETE RESTRICT |
771: | `integrationId` | UUID | ✅ — FK |
772: | `entity` | enum (reservation·contact·inquiry·conversion-event) | ✅ |
773: | `direction` | enum | ✅ |
774: | `attemptNumber` | integer | ✅ |
775: | `status` | enum (processing·success·partial·failed-credential·failed-quota·failed-transient·failed-permanent·skipped-disabled·skipped-rate-limit·skipped-credential-expired·in-retry-queue) | ✅ |
776: | `recordsInbound`·`recordsOutbound`·`conflictsDetected` | integer | ✅ |
777: | `error`·`errorClass` | string | optional |
778: | `startedAt`·`completedAt` | Date | ✅·optional |
779: | `expiresAt` | Date | ✅ — retentionDays.sourceAttempt |
780: 
781: **Constraints**: `UNIQUE(syncLogId, integrationId, entity, direction, attemptNumber)`.
782: **Index**: `(expiresAt)`, `(integrationId, status)`.
783: 
784: ### 13.4 `CrmSyncRetryQueue` (CS2-12 — worker SQL 복제)
785: 
786: | 필드 | 타입 | required |
787: |---|---|:---:|
788: | `id` | UUID | ✅ |
789: | `idempotencyKey` | string | ✅ — `(integrationId, entity, recordId, operation)` hash |
790: | `syncLogId` | UUID | ✅ — FK |
791: | `integrationId`·`entity`·`direction` | various | ✅ |
792: | `attemptNumber`·`maxAttempts` | integer | ✅ |
793: | `status` | enum (pending·processing·completed·exhausted·failed-permanent) | ✅ |
794: | `nextAttemptAt` | Date | ✅ |
795: | `lockedAt`·`lockedBy` | Date·string | optional |
796: | `lastError`·`lastErrorClass` | string·enum (retryable·permanent) | optional |
797: | `payloadSnapshot` | JSON (closed-schema field tokens만) | optional |
798: | `expiresAt` | Date | ✅ — retentionDays.retryQueueCompleted |
799: 
800: **Constraints**: `UNIQUE(idempotencyKey) WHERE status IN (pending, processing)`.
801: **Index**: `(status, nextAttemptAt, lockedAt) WHERE status IN (pending, processing)`.
802: 
803: **worker SoT SQL** (search-visibility § 13.5 패턴 복제):
804: 
805: ```sql
806: -- claim
807: WITH next AS (
808:   SELECT id FROM crm_sync_retry_queue
809:   WHERE status='pending'
810:     AND next_attempt_at <= now()
811:     AND (locked_at IS NULL OR locked_at < now() - interval '10 minutes')
812:   ORDER BY next_attempt_at
813:   FOR UPDATE SKIP LOCKED
814:   LIMIT 1
815: )
816: UPDATE crm_sync_retry_queue q
817: SET status='processing', locked_at=now(), locked_by=$worker_id, attempt_number=attempt_number+1
818: FROM next WHERE q.id=next.id RETURNING q.*;
819: 
820: -- per-integration advisory lock (provider rate-limit 직렬화)
821: SELECT pg_advisory_xact_lock(hashtext('crm-sync:' || $integration_id));
822: 
823: -- exhausted 전이
824: UPDATE crm_sync_retry_queue
825: SET status='exhausted', locked_at=null, locked_by=null
826: WHERE id=$id AND attempt_number >= max_attempts;
827: ```
828: 
829: permanent error class → status='failed-permanent' 즉시 + sink alert.
830: 
831: ### 13.5 `CrmRecord` (closed-schema displayHints — CS2-05)
832: 
833: | 필드 | 타입 | required |
834: |---|---|:---:|
835: | `id` | UUID | ✅ |
836: | `instanceId` | Slug | ✅ |
837: | `integrationId` | UUID | ✅ — FK |
838: | `entity` | enum | ✅ |
839: | `crmExternalId` | string | optional |
840: | `solutionRecordRef` | string | optional |
841: | `solutionVersion` | integer | ✅ — CAS |
842: | `crmVersion` | integer | ✅ — CAS |
843: | `lastAppliedConflictVersion` | integer | optional |
844: | `lastSyncedAt` | Date | ✅ |
845: | `piiHash` | char(64) | optional |
846: | `displayHintsNameInitial` | varchar(8) | optional — CHECK regex |
847: | `displayHintsPhoneLast4` | char(4) | optional — CHECK `^\d{4}$` |
848: | `displayHintsEmailDomain` | varchar(64) | optional — CHECK regex |
849: | `displayHintsCityName` | varchar(32) | optional |
850: | `displayHintsGenderHint` | enum | optional |
851: | `displayHintsAgeBand` | enum | optional |
852: | `piiRetentionExpiresAt` | Date | optional |
853: 
854: **Constraints**: `UNIQUE(instanceId, integrationId, entity, crmExternalId) WHERE crmExternalId IS NOT NULL`.
855: **CHECK**: 각 displayHints* column에 정규식·enum 강제.
856: **Index**: `(instanceId, entity, lastSyncedAt DESC)`, `(piiRetentionExpiresAt) WHERE piiRetentionExpiresAt IS NOT NULL`.
857: 
858: ### 13.6 `CrmRecordChangeLog` (closed-schema)
859: 
860: | 필드 | 타입 | required |
861: |---|---|:---:|
862: | `id` | UUID | ✅ |
863: | `crmRecordId` | UUID | ✅ — FK |
864: | `direction` | enum | ✅ |
865: | `changedFields` | JSON — allowlisted field token + masked value | ✅ |
866: | `priorSnapshot`·`newSnapshot` | JSON — 동일 제약 | optional |
867: | `appliedAt` | Date | ✅ |
868: | `appliedBy` | string | ✅ |
869: | `expiresAt` | Date | ✅ — retentionDays.changeLog |
870: 
871: **application validator**: changedFields/snapshot의 모든 key가 § 7.1 allowlist에 속해야 함. 위반 시 insert reject.
872: **Index**: `(crmRecordId, appliedAt DESC)`, `(expiresAt)`.
873: 
874: ### 13.7 `CrmFieldMapping`
875: 
876: | 필드 | 타입 | required |
877: |---|---|:---:|
878: | `id` | UUID | ✅ |
879: | `instanceId` | Slug | ✅ |
880: | `entity` | enum | ✅ |
881: | `solutionFieldPath` | string | ✅ |
882: | `crmFieldPath` | string | ✅ |
883: | `direction` | enum (inbound·outbound·both) | ✅ |
884: | `authority` | FieldAuthority | ✅ |
885: | `transformerRef` | string | optional |
886: | `policyVersion` | string | ✅ |
887: | `active` | boolean | ✅ |
888: 
889: **Constraints**: `UNIQUE(instanceId, entity, solutionFieldPath, direction) WHERE active=true`.
890: **build-time**: instance mode="outbound-only" + 본 테이블에 `direction IN (inbound, both)` 존재 시 build fail (CS2-06).
891: 
892: ### 13.8 `CrmConflictRecord` (field-level — CS2-08)
893: 
894: | 필드 | 타입 | required |
895: |---|---|:---:|
896: | `id` | UUID | ✅ |
897: | `crmRecordId` | UUID | ✅ — FK |
898: | `fieldPath` | string | ✅ |
899: | `baseVersion` | integer | ✅ |
900: | `observedCrmVersion`·`observedSolutionVersion` | integer | ✅ |
901: | `crmProposedValue`·`solutionProposedValue` | masked field token + value | ✅ — closed schema |
902: | `resolution` | enum (open·crm-wins·solution-wins·manual-resolved·manual-rejected) | ✅ |
903: | `winningVersion` | integer | optional |
904: | `appliedFieldVersion` | integer | optional |
905: | `resolvedBy`·`resolvedAt` | string·Date | optional |
906: | `slaDeadline` | Date | ✅ — open 기준 7일 |
907: | `expiresAt` | Date | ✅ — retentionDays.conflictRecord |
908: 
909: **Constraints**: `FK crmRecordId ON DELETE RESTRICT`.
910: **Index**: `(crmRecordId, fieldPath, appliedFieldVersion)`, `(resolution, slaDeadline) WHERE resolution='open'`, `(expiresAt)`.
911: 
912: ### 13.9 `CrmCredentialAuditLog`
913: 
914: | 필드 | 타입 | required |
915: |---|---|:---:|
916: | `id` | UUID | ✅ |
917: | `integrationId` | UUID | ✅ — FK |
918: | `event` | enum (rotated·rotation-failed·grace-expired·expired·expiring-soon) | ✅ |
919: | `rotationAttemptId` | UUID | optional |
920: | `priorCredentialFingerprint`·`newCredentialFingerprint` | char(16) | optional |
921: | `actor` | string | ✅ |
922: | `occurredAt` | Date | ✅ |
923: 
924: **Index**: `(integrationId, occurredAt DESC)`.
925: 
926: ### 13.10 `CrmRateLimitState`
927: 
928: | 필드 | 타입 | required |
929: |---|---|:---:|
930: | `id` | UUID | ✅ |
931: | `bucketKey` | string | ✅ — `crm:quota:{integrationId}:{provider}` |
932: | `tokensRemaining` | number | ✅ |
933: | `quotaResetAt` | Date | ✅ |
934: | `nextAllowedAt` | Date | optional |
935: | `updatedAt` | Date | ✅ |
936: 
937: **Constraints**: `UNIQUE(bucketKey)`.
938: 
939: ### 13.11 `CrmCredentialVersion` (CS2-09 신설)
940: 
941: | 필드 | 타입 | required |
942: |---|---|:---:|
943: | `id` | UUID | ✅ |
944: | `integrationId` | UUID | ✅ — FK |
945: | `secretRef` | secretRef | ✅ |
946: | `secretVersionId` | string | ✅ — secret manager의 immutable version id |
947: | `webhookSecretRef`·`webhookSecretVersionId` | secretRef·string | optional |
948: | `credentialFingerprint` | char(16) | ✅ — § 3.1.1 |
949: | `state` | enum (active·rotating-target·committed·grace-expired·reverted·revoked) | ✅ |
950: | `activatedAt` | Date | ✅ |
951: | `graceUntil` | Date | optional |
952: | `revokedAt` | Date | optional |
953: | `expiresAt` | Date | optional — credential 자체의 expiry |
954: 
955: **Constraints**: `FK integrationId`. `UNIQUE(integrationId, secretVersionId)`. application invariant: 동시에 `state='active'`인 row 0 또는 1개·`state='rotating-target'`인 row 0 또는 1개.
956: **Index**: `(integrationId, state)`, `(expiresAt)`.
957: 
958: ### 13.12 `CrmWebhookNonceLedger` (CS2-04)
959: 
960: | 필드 | 타입 | required |
961: |---|---|:---:|
962: | `id` | UUID | ✅ |
963: | `integrationId` | UUID | ✅ — FK |
964: | `providerEventId` | string | optional |
965: | `canonicalDigest` | char(64) | ✅ — SHA-256 |
966: | `receivedBucket` | bigint | ✅ — `floor(epoch/60)` |
967: | `signatureDigest` | char(64) | ✅ |
968: | `deliveryKind` | enum | ✅ |
969: | `receivedAt` | Date | ✅ |
970: | `status` | enum (accepted-pending·accepted-processed·rejected-rrn-recoverable·rejected-rrn-final·rejected-parse-recoverable) | ✅ |
971: | `rrnFingerprint` | char(16) | optional — HMAC non-reversible |
972: | `expiresAt` | Date | ✅ — webhookNonceLedgerRetentionMinutes |
973: 
974: **Constraints**:
975: - `UNIQUE(integrationId, providerEventId) WHERE providerEventId IS NOT NULL` (partial — exactly-once provider)
976: - `UNIQUE(integrationId, canonicalDigest, receivedBucket) WHERE providerEventId IS NULL` (best-effort)
977: 
978: **Index**: `(expiresAt)`, `(integrationId, status, receivedAt DESC)`, `(status, receivedAt) WHERE status='rejected-rrn-recoverable'`.
979: 
980: ### 13.13 `CrmSyncNotificationOutbox` (search-visibility § 13.10 패턴 — CS2-12)
981: 
982: | 필드 | 타입 | required |
983: |---|---|:---:|
984: | `id` | UUID | ✅ |
985: | `sourceKind` | enum (sync-log·conflict·credential-version) | ✅ |
986: | `sourceId` | string | ✅ — credential-version는 `integrationId:credentialVersionId` (CS2-11) |
987: | `eventType` | enum (NotificationEventType 4종) | ✅ |
988: | `sourceEventId` | char(64) | ✅ — hash |
989: | `payload` | JSON | ✅ |
990: | `status` | enum (pending·processing·sent·failed·permanent) | ✅ |
991: | `attempts` | integer | ✅ |
992: | `lockedAt`·`lockedBy` | Date·string | optional |
993: | `lastError` | string | optional |
994: | `createdAt`·`sentAt` | Date | ✅·optional |
995: | `expiresAt` | Date | ✅ — retentionDays.notificationOutbox |
996: 
997: **Constraints**: `UNIQUE(sourceKind, sourceId, eventType)`. credential lifecycle 반복 시 credentialVersionId가 sourceId에 포함되어 새 row 허용.
998: **Index**: `(status, createdAt) WHERE status='pending'`, `(expiresAt)`.
999: 
1000: ---

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/features/crm-sync.md'; "'$lines=Get-Content -LiteralPath $p; foreach($r in @(@(30,90),@(190,270),@(270,360),@(360,430))){ for($i=$r[0]; $i -le $r[1]; $i++){ '"'{0}: {1}' -f "'$i,$lines[$i-1] } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/features/search-visibility.md'; "'$lines=Get-Content -LiteralPath $p; for($i=624;$i -le 672;$i++){ '"'{0}: {1}' -f "'$i,$lines[$i-1] }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/features/crm-sync.md'; "'$lines=Get-Content -LiteralPath $p; for($i=1000;$i -le $lines.Length;$i++){ '"'{0}: {1}' -f "'$i,$lines[$i-1] }' in C:\Users\assag\solution\website-exposure
 succeeded in 627ms:
624: ### 13.5 `SearchVisibilityCollectionRetryQueue` (SV2-07 신설 — 9번째 table)
625: 
626: **worker SoT 쿼리** (SV3-05 — analytics-reporting § 4.3 패턴 복제):
627: 
628: ```sql
629: -- worker claim
630: UPDATE search_visibility_collection_retry_queue
631: SET status = 'processing', locked_at = now(), locked_by = :workerId
632: WHERE id IN (
633:   SELECT id FROM search_visibility_collection_retry_queue
634:   WHERE status = 'pending' AND scheduled_for <= now()
635:   ORDER BY scheduled_for
636:   LIMIT 10
637:   FOR UPDATE SKIP LOCKED
638: )
639: RETURNING *;
640: 
641: -- attemptNumber 동시성 안전 (analytics-reporting AR3-02 패턴):
642: --   1. queue row claim 후 (monitoringLogId, source) advisory lock acquire
643: --   2. SELECT MAX(attemptNumber)+1 FROM MonitoringSourceAttempt WHERE monitoringLogId=? AND source=?
644: --   3. lock 보유 상태에서 새 MonitoringSourceAttempt INSERT (status="processing", attemptNumber=max+1)
645: --   4. 짧은 transaction commit → lock 자동 해제
646: --   5. 별도 transaction에서 provider 호출 후 attempt UPDATE
647: -- stale processing(>10분) — 별도 reconcile worker가 queue status="pending" 복귀
648: -- maxAttempts 도달 → queue status="exhausted" + MonitoringSourceAttempt.status="failed-permanent" + 외부 sink alert
649: -- envelope 재계산: attempt 종결 시마다 lock(hash(monitoringLogId, "envelope")) 후 envelopeState 재산정
650: 
651: -- lock ordering invariant (analytics-reporting AR4-03 동일):
652: -- attempt lock 보유 중 envelope lock 획득 금지. attempt commit 후 별도 transaction에서 envelope lock
653: ```
654: 
655: 
656: 
657: | 필드 | 타입 | required |
658: |---|---|:---:|
659: | `id` | UUID | ✅ |
660: | `monitoringLogId` | UUID | ✅ — FK |
661: | `source` | VisibilitySource | ✅ |
662: | `attemptNumber` | integer | ✅ |
663: | `status` | enum (pending·processing·completed·exhausted) | ✅ |
664: | `scheduledFor` | Date | ✅ |
665: | `lockedAt`·`lockedBy` | Date·string | optional |
666: | `lastError` | string | optional |
667: | `dedupeMode` | enum (normal·resend) | ✅ |
668: 
669: **Constraints**: `FK monitoringLogId ON DELETE RESTRICT`, `UNIQUE(monitoringLogId, source, attemptNumber)`.
670: **Index**: `(status, scheduledFor)` partial where status='pending'.
671: 
672: ### 13.6 `AnomalyRecord`

 succeeded in 629ms:
1000: ---
1001: 
1002: **총 13개 절·12개 admin DB 테이블** (§ 13.1 ~ § 13.13 — § 13.10 RateLimitState와 § 13.12 NonceLedger는 별개 테이블).

 succeeded in 660ms:
30: ## 1. 일반 규약
31: 
32: ### 1.1 변경 정책
33: 
34: | 변경 유형 | 패키지 SemVer | policyVersion | 동반 cascade |
35: |---|---|---|---|
36: | 입력/출력 인터페이스 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9·§ 10 |
37: | provider type 추가 | MINOR | 별개 | DATA_MODEL C-08·adapter contract·webhook verifier·build validation |
38: | provider type 제거 | **MAJOR** | 별개 | |
39: | sync entity 추가 | MINOR | 별개 | CrmFieldMapping·v1.0 canonical schema 본 문서 § 3.2 |
40: | sync entity 제거 | **MAJOR** | 별개 | |
41: | field mapping schema 변경 | **MAJOR** | policyVersion 신규 | |
42: | 충돌 해결 알고리즘 변경 | **MAJOR** | policyVersion 신규 | |
43: | 알림 매트릭스 변경 | **MAJOR** | policyVersion 신규 | |
44: | 운영 모드 추가 | **MAJOR** | 별개 | |
45: | build/runtime/migration fail 룰 추가·강화 | **MAJOR** | 별개 | |
46: | runtime invariant·reconcile 룰 추가·강화 | MINOR | 별개 | |
47: | warning → fail 승격 | **MAJOR** | 별개 | |
48: | warning·지표·acceptance test 추가 | PATCH | 별개 | |
49: 
50: ### 1.2 SoT 원칙
51: 
52: - 알림 발송·audit canonical SoT → notifications + REVIEW_WORKFLOW § 9.1.1·§ 10.2.1
53: - 자격증명·DPA·policyVersion SoT → DATA_MODEL C-08 v0.19
54: - RRN checksum SoT → `features/asset-ingestion.md` § 9.1
55: - retry queue·outbox worker SQL SoT → `features/search-visibility.md` § 13.5·§ 13.10 (본 문서 § 13.4·§ 13.12에서 복제 적용)
56: - 본 문서 = sync 파이프라인·field mapping·CAS 충돌 해결·PII closed schema·credential rotation 상태 머신·v1.0 entity canonical schema SoT
57: 
58: ### 1.2.1 공통 retry taxonomy
59: 
60: | 큐 | maxAttempts | backoff |
61: |---|---|---|
62: | CrmSyncRetryQueue | config(기본 5)·configurable | [60, 300, 1800, 7200, 21600]s |
63: | CrmSyncNotificationOutbox | 상수 5 | search-visibility § 13.10 동일 |
64: 
65: ### 1.3 본 문서가 다루지 않는 영역
66: 
67: - 알림 채널·재시도 → notifications
68: - 외부 CRM 운영·계약 → 클라이언트·CRM provider
69: - Core 콘텐츠 변환 → asset-ingestion. CRM→Core auto promote는 v1.x (CS-11 deferred)
70: - 의료 진료 기록 보관 → CRM·EMR (RRN 솔루션 통과 금지)
71: - **raw PII 실시간 조회** → v1.0 미지원. v1.x liveReadCrmDetail (CS-14)
72: 
73: ---
74: 
75: ## 2. Feature 정의
76: 
77: ### 2.1 기본 메타
78: 
79: ```yaml
80: name: "crm-sync"
81: specVersion: "0.3"
82: coreRequiresMin: "1.0.0"
83: implementationKind: "node-module"
84: activation: { scope: "instance", default: false }
85: ```
86: 
87: ### 2.2 의존성
88: 
89: | 영역 | 의존 |
90: |---|---|
190: 
191: **v1.0 미제공 (CS2-02·07 해결)**:
192: - `liveReadCrmDetail` — v1.x deferred (CS-14). v1.0 raw PII 실시간 조회 불가
193: - 운영자는 raw detail 필요 시 CRM 콘솔에서 직접 조회
194: 
195: ### 3.1.1 audit log contract
196: 
197: | AuditAction | contentRef | metadata | 권한 |
198: |---|---|---|---|
199: | `crm-integration-registered` | `"crm-integration:" + integrationId` | provider·apiUrl·legalApprovedBy·dpaEvidenceRefHash | super-admin |
200: | `crm-integration-unregistered` | `"crm-integration:" + integrationId` | activeBefore·activeAfter·unregisteredBy | super-admin |
201: | `crm-sync-conflict-resolved` | `"crm-conflict:" + conflictId` | resolution·winningSide·resolvedBy·entityType·fieldPath·appliedFieldVersion | operator·super-admin |
202: | `crm-credential-rotated` | `"crm-integration:" + integrationId` | rotatedBy·priorCredentialFingerprint·newCredentialFingerprint·rotationAttemptId | super-admin |
203: 
204: **credential fingerprint (CS2-14 정정)**: `HMAC-SHA256(auditPepperSecretRef, integrationId + ":" + secretVersionId)` 8자(16 hex) prefix. secret manager immutable version id 포함 — 실제 rotation 식별 가능.
205: 
206: ### 3.2 v1.0 운영 이벤트 canonical schema (CS2-15 — 본 문서 내 정의)
207: 
208: CONTENT_STANDARDS submission/event 인터페이스 cascade는 CS-15로 deferred. v1.0 운영을 위해 **본 Feature가 canonical schema를 직접 정의**:
209: 
210: ```ts
211: type ReservationSubmission = {
212:   submissionId: string;
213:   reservationPageRef: Ref<C-20>;
214:   ctaConfigRef?: Ref<CT-03>;
215:   source?: string; campaign?: string;
216:   submittedAt: Date;
217:   status: "pending" | "synced-to-crm" | "synced-failed";
218:   piiHash: string;                       // SHA-256. solution DB에 raw 미저장
219:   displayHints: ContactDisplayHints;
220:   crmExternalId?: string;
221: };
222: 
223: type Inquiry = {
224:   inquiryId: string; source?: string;
225:   inquiryType: "general" | "appointment-related" | "billing" | "other";
226:   submittedAt: Date;
227:   status: "pending" | "synced-to-crm" | "responded-on-crm";
228:   piiHash: string; displayHints: ContactDisplayHints;
229:   crmExternalId?: string;
230: };
231: 
232: type ConversionEvent = {                 // outbound-only entity. PII 없음
233:   conversionEventId: string;
234:   eventType: "form-submit" | "phone-click" | "page-view-threshold" | "cta-click";
235:   occurredAt: Date;
236:   pageRef?: Ref<C-anything>;
237:   attributionSource?: string;
238: };
239: 
240: type Contact = {
241:   contactId: string;
242:   crmExternalId: string;
243:   displayHints: ContactDisplayHints;
244:   lastSyncedAt: Date;
245: };
246: ```
247: 
248: #### 3.2.1 ContactDisplayHints — **closed schema** (CS2-05)
249: 
250: raw PII 저장 금지의 핵심 invariant. **JSON 자유 필드 금지. allowlisted 6개 필드만 column으로 분리**:
251: 
252: | 필드 | 타입 | DB CHECK / application validator |
253: |---|---|---|
254: | `nameInitial` | varchar(8) | 정규식 `^[\p{L}](O\*?)?$` (한·영 1자 + "O*") |
255: | `phoneLast4` | char(4) | `^\d{4}$` |
256: | `emailDomain` | varchar(64) | `^@[a-z0-9.-]+$` |
257: | `cityName` | varchar(32) | 시·도·구·군 명만 |
258: | `genderHint` | enum(`male`,`female`,`other`,`unknown`) | enum |
259: | `ageBand` | enum(`teen`,`20s`,`30s`,`40s`,`50s`,`60+`,`unknown`) | enum |
260: 
261: **금지**: 위 외 임의 필드, 임의 길이 문자열, 자유 JSON, raw 이름·전화번호·이메일·주소·RRN·birthDate. 위반 시 DB CHECK + application validator 양층으로 **insert reject**.
262: 
263: ### 3.3 RunSyncInput·Result
264: 
265: ```ts
266: type RunSyncInput = {
267:   instanceId: string;
268:   manifestVersion: string;
269:   direction: "inbound" | "outbound" | "both";  // outbound-only mode는 "outbound" 강제
270:   mode: "scheduled" | "on-demand";
270:   mode: "scheduled" | "on-demand";
271:   idempotencyKey: string;
272:   windowStart?: Date; windowEnd?: Date;
273:   forceRefresh?: boolean; refreshIntentId?: string;
274: };
275: 
276: type RunSyncResult = {
277:   syncLogId: string;
278:   envelopeState: "succeeded" | "partial" | "failed" | "retried";
279:   perEntity: Array<{ entity: SyncEntity; direction: string; result: SourceAttemptStatus; counts: Record<string, number> }>;
280: };
281: ```
282: 
283: ### 3.4 webhook 처리 (CS2-03·04 강화)
284: 
285: ```ts
286: async function processInboundWebhook(
287:   integrationId: string,
288:   headers: Record<string,string>,
289:   rawBody: Buffer,
290:   fullUrl: string,
291:   method: string
292: ): Promise<{
293:   status: "accepted" | "rejected-signature" | "rejected-replay" | "rejected-stale-timestamp"
294:         | "rejected-credential-expired" | "rejected-rrn-detected" | "rejected-mode-disallowed"
295:         | "queued" | "deduped";
296:   recordsProcessed: number;
297:   conflicts: number;
298:   ledgerStatus?: "new" | "duplicate-eventid" | "duplicate-digest" | "rejected-final";
299: }>;
300: ```
301: 
302: #### 3.4.1 ProviderWebhookVerifier 결과 타입 (CS2-03 — 고정 shape)
303: 
304: ```ts
305: interface ProviderWebhookVerifier {
306:   verify(input: { rawBody: Buffer; headers: Record<string,string>; fullUrl: string; method: string }): VerifierResult;
307: }
308: 
309: type VerifierResult = {
310:   signatureValid: boolean;
311:   providerEventId: string | null;
312:   providerTimestamp: Date | null;
313:   canonicalDigest: string;                  // SHA-256
314:   deliveryKind: "at-least-once" | "exactly-once" | "best-effort";
315:   retrySemantics: "provider-retries" | "no-retry";
316:   errorReason?: "signature-mismatch" | "missing-headers" | "malformed-payload";
317: };
318: ```
319: 
320: #### 3.4.2 provider별 adapter contract (CS2-03)
321: 
322: | Provider | payload | signature | timestamp header | eventId | canonical string |
323: |---|---|---|---|---|---|
324: | Salesforce (Outbound Messages) | XML SOAP | HMAC-SHA256(webhookSecret, rawBody) | `Sforce-Send-Time` | XML `Id` | `timestamp + "." + bodySha256` |
325: | Salesforce (Platform Events) | JSON (CometD) | HMAC-SHA256 (organizationId 기반) | `OrganizationId+ReplayId` | `replayId` | 동일 |
326: | HubSpot | JSON | HMAC-SHA256(webhookSecret, `httpMethod + url + bodyString + timestamp`) | `X-HubSpot-Request-Timestamp` | header 또는 body `eventId` | provider 정의 |
327: | generic-rest-api | JSON | HMAC-SHA256(webhookSecret, canonicalString) | config `webhookTimestampHeader` | config `webhookEventIdHeader` | config `canonicalStringFormat` |
328: 
329: `deliveryKind=exactly-once`이면 providerEventId 강제 unique. 누락 시 `errorReason=missing-headers`로 거부.
330: 
331: ---
332: 
333: ## 4. sync 파이프라인
334: 
335: ### 4.1 outbound (솔루션 → CRM)
336: 
337: ```
338: 1. pushOutbound(entity, recordId, operation)
339: 2. solution record load → CrmFieldMapping(direction includes "outbound")로 변환
340: 3. PII Redaction Validator 통과 (raw PII는 CRM API 호출 시점에만 transient. solution DB 캐싱 금지)
341: 4. RRN 검사 — 검출 시 push 차단 + 운영자 alert + ledger 기록 (recoverable=false)
342: 5. credential state ≠ "rotating-revoked" 확인 → outbound는 new 우선·old fallback (§ 4.5)
343: 6. rate limit token 획득 — 부족 시 retry queue 등록
344: 7. CRM API call (idempotency-key 헤더 포함). crmExternalId 갱신
345: 8. solution CrmRecord 갱신 — **CAS WHERE** (CS2-08): `WHERE id=? AND solution_version=?`
346:    → 0 rows affected → race detected → CrmConflictRecord 생성
347: 9. CrmRecordChangeLog insert (closed-schema changedFields)
348: ```
349: 
350: ### 4.2 inbound (CRM → 솔루션)
351: 
352: ```
353: 1. CRM webhook → endpoint POST → processInboundWebhook
354: 2. mode="outbound-only"이면 endpoint 미등록 (HTTP 404)
355: 3. ProviderWebhookVerifier.verify(...) → VerifierResult
356:    - signatureValid=false → HTTP 401 rejected-signature. ledger 미기록
357: 4. providerTimestamp 검증 — 있으면 `now ± timestampToleranceSeconds` 검사 → rejected-stale-timestamp
358: 5. **CrmWebhookNonceLedger insert** (CS2-04):
359:    - deliveryKind별 key:
360:      - `exactly-once`: key=`(integrationId, providerEventId)`. 중복 → `duplicate-eventid` → HTTP 200 deduped
360:      - `exactly-once`: key=`(integrationId, providerEventId)`. 중복 → `duplicate-eventid` → HTTP 200 deduped
361:      - `at-least-once`: key=`(integrationId, providerEventId OR canonicalDigest, receivedBucket)`. receivedBucket=`floor(epoch/60)`
362:      - `best-effort`: key=`(integrationId, canonicalDigest, receivedBucket)`
363:    - status enum: `accepted-pending` | `accepted-processed` | `rejected-rrn-recoverable` | `rejected-rrn-final` | `rejected-parse-recoverable`
364: 6. **RRN 검사** (asset-ingestion § 9.1 checksum 재사용)
365:    - 검출 시 payload 폐기. ledger `rejected-rrn-recoverable` (복구 가능) 또는 `rejected-rrn-final` (확정 final)
366:    - rrnFingerprint = HMAC-SHA256(rrnAuditPepper, rrnNormalized) 16 hex
367: 7. payload 파싱 + CrmFieldMapping(direction includes "inbound") 역변환
368: 8. **closed-schema PII Redaction Validator** — 위반 시 ledger `rejected-parse-recoverable` 후 reject
369: 9. CrmRecord field-level CAS 갱신 (§ 4.3)
370: 10. ledger `accepted-processed` 갱신 → HTTP 200 accepted
371: ```
372: 
373: #### 4.2.1 RRN false positive 복구 (CS2-10)
374: 
375: ```
376: recoverRrnFalsePositive(ledgerId, action: "override-and-fetch" | "abandon"):
377: 1. ledger row 조회 — status="rejected-rrn-recoverable"만 허용. 다른 상태 → runtime fail
378: 2. action="override-and-fetch":
379:    - CRM live pull (providerEventId 또는 last-known crmExternalId 기반)
380:    - RRN 검사 재실행 → 통과 시 정상 inbound 처리. ledger → "accepted-processed"
381:    - 재차 RRN 검출 시 ledger → "rejected-rrn-final"
382: 3. action="abandon": ledger → "rejected-rrn-final". 동일 providerEventId 재처리 거부
383: 4. 모든 경로 audit log 기록 (super-admin 필수)
384: ```
385: 
386: ### 4.3 field-level 충돌 해결 + CAS (CS2-08)
387: 
388: #### 4.3.1 FieldAuthority
389: 
390: ```ts
391: type FieldAuthority =
392:   | "crm-authoritative"
393:   | "solution-authoritative"
394:   | "last-write-wins-timestamp"
395:   | "last-write-wins-version";
396: ```
397: 
398: #### 4.3.2 CrmRecord 갱신 — **CAS WHERE 조건**
399: 
400: ```sql
401: -- inbound: CRM 갱신
402: UPDATE crm_record
403: SET display_hints_name_initial=$1, display_hints_phone_last4=$2, /* ... */
404:     crm_version=$newCrmVersion, last_synced_at=$now
405: WHERE id=$recordId
406:   AND crm_version=$expectedCrmVersion
407:   AND solution_version=$expectedSolutionVersion;
408: -- 0 rows affected → race → CrmConflictRecord 생성
409: 
410: -- outbound: solution 갱신
411: UPDATE crm_record
412: SET solution_version=solution_version+1, last_synced_at=$now, crm_external_id=$crmId
413: WHERE id=$recordId AND solution_version=$expectedSolutionVersion;
414: ```
415: 
416: field-level 복잡 경로는 `SELECT FOR UPDATE` + per-field ConflictRecord.
417: 
418: #### 4.3.3 ConflictRecord field-level
419: 
420: | 필드 | 의미 |
421: |---|---|
422: | `fieldPath` | "displayHints.phoneLast4" 등 |
423: | `baseVersion` | 충돌 직전 record-level 버전 |
424: | `winningVersion` | resolve 시 적용된 버전 |
425: | `appliedFieldVersion` | resolve 후 record-level 버전. 동일 fieldPath·동일 appliedFieldVersion 이하 재갱신 차단 |
426: | `winningSide` | "crm" \| "solution" \| "manual" |
427: 
428: #### 4.3.4 manual escalate 결정표
429: 
430: | 조건 | escalate? |

codex
2차 지적 중 다수는 실제로 보강됐지만, 몇몇은 “절/필드 추가” 수준에서 멈추고 transaction key, legal fallback, 운영 경로가 아직 비어 있습니다. 이제 발견 사항을 이전 JSON 스키마에 맞춰 정리하겠습니다.
codex
{
  "feature": "crm-sync",
  "version_reviewed": "v0.3",
  "cycle": 3,
  "verdict": "needs_major_revision",
  "summary": {
    "overall": "v0.3은 2차 지적 17개 중 liveRead 제거, verifier shape, closed displayHints, outbound-only matrix, CredentialVersion 도입, RRN 복구 command, outbox sourceId 개선 등은 실제 반영됐다. 그러나 CredentialVersion 상태 모델, nonce ledger unique key, webhook/polling/CAS 동시성, 법적 철회·unregister·purge, DATA_MODEL cascade, DB 인벤토리 수가 여전히 불일치한다. 특히 '12 tables' 선언은 v0.3 자체 추가로 13 tables가 되어 다시 깨졌다.",
    "blocking_count": 6,
    "major_count": 9,
    "minor_count": 2
  },
  "findings": [
    {
      "id": "CS3-01",
      "severity": "blocking",
      "category": "credential rotation 상태 모델",
      "location": "docs/features/crm-sync.md:442-469, 720-733, 939-955",
      "issue": "CrmIntegration.credentialState는 stable·rotating·committed·grace-expired·reverted 5상태인데 CrmCredentialVersion.state는 active·rotating-target·committed·grace-expired·reverted·revoked 6상태다. 두 enum이 서로 다른 추상 수준일 수는 있지만 매핑 표가 없다. 또한 §4.1은 `credential state ≠ \"rotating-revoked\"`를 검사한다고 쓰는데 해당 상태는 어느 enum에도 없다.",
      "impact": "worker가 integration 상태와 version row 상태 중 무엇을 신뢰해야 하는지 불명확하다. rotation 중 old/new credential 허용, grace 만료, revoke/revert 후 stable 복귀가 구현자별로 달라질 수 있다.",
      "recommendation": "Integration state와 CredentialVersion state를 별도 enum으로 유지하려면 상태별 invariant 표를 추가하라. 예: stable이면 exactly one active row, rotating이면 one active + one rotating-target, committed이면 current active + previous committed with graceUntil. `rotating-revoked` 잔재를 제거하고 revoked 상태 전이·currentCredentialVersionId 갱신 시점을 명시하라."
    },
    {
      "id": "CS3-02",
      "severity": "blocking",
      "category": "webhook nonce ledger·dedupe",
      "location": "docs/features/crm-sync.md:358-363, 565-579, 958-978",
      "issue": "§4.2는 at-least-once key를 `(integrationId, providerEventId OR canonicalDigest, receivedBucket)`로 정의하지만 §13.12 constraints는 `providerEventId IS NOT NULL`이면 무조건 `(integrationId, providerEventId)` unique를 적용한다. 즉 providerEventId가 있는 at-least-once 이벤트는 bucket 없이 exactly-once처럼 영구 dedupe된다. 반대로 AT-10은 at-least-once 재전송을 `duplicate-digest`로 기대해 providerEventId 존재/부재 케이스가 분리되지 않았다.",
      "impact": "provider retry, providerEventId 재사용, best-effort payload replay가 서로 다른 정책으로 처리되지 않는다. 정상 재전송이 과도하게 차단되거나, 반대로 duplicate digest 테스트가 실제 constraint와 맞지 않는다.",
      "recommendation": "ledger key를 deliveryKind별 partial unique로 분리하라. exactly-once: `(integrationId, providerEventId)`. at-least-once with eventId: `(integrationId, providerEventId, receivedBucket)`. at-least-once without eventId 및 best-effort: `(integrationId, canonicalDigest, receivedBucket)`. acceptance test도 at-least-once eventId / digest fallback / best-effort digest를 별도 케이스로 쪼개라."
    },
    {
      "id": "CS3-03",
      "severity": "blocking",
      "category": "webhook verifier 결과 전달",
      "location": "docs/features/crm-sync.md:302-329, 350-370, 398-416",
      "issue": "VerifierResult가 providerEventId와 providerTimestamp를 반환하지만 이후 payload parser, CrmFieldMapping inbound 역변환, CAS expected version 산정으로 어떻게 전달되는지 정의되어 있지 않다. §4.2는 verifier 결과를 nonce ledger와 timestamp check에만 사용하고, §4.3의 `expectedCrmVersion`·`expectedSolutionVersion`은 어디서 온 값인지 비어 있다.",
      "impact": "webhook payload에 CRM version이 없는 provider, timestamp만 있는 provider, polling으로 동일 record를 읽는 경로에서 같은 변경을 동일하게 versioning할 수 없다. 충돌 감지·last-write-wins 판단이 provider adapter 구현 세부에 묻힌다.",
      "recommendation": "InboundProcessingContext 같은 명시적 구조를 정의하고 `providerEventId`, `providerTimestamp`, `canonicalDigest`, `deliveryKind`, provider-specific version/replay id를 mapping/CAS 단계까지 전달하라. provider별로 crmVersion 산정 원천도 표로 고정하라."
    },
    {
      "id": "CS3-04",
      "severity": "blocking",
      "category": "CAS·webhook/polling race",
      "location": "docs/features/crm-sync.md:335-347, 350-370, 398-416",
      "issue": "CAS WHERE는 추가됐지만 양방향 race 보장이 아직 부족하다. §4.1 outbound는 `WHERE id=? AND solution_version=?`만 사용해 inbound가 직전에 crm_version을 바꾼 경우를 감지하지 못한다. §4.3 inbound는 displayHints 전체를 set하고 `crm_version`·`solution_version`을 비교하지만 polling inbound와 webhook inbound가 같은 CRM 변경을 동시에 처리할 때 nonce ledger는 webhook에만 적용된다.",
      "impact": "동일 CRM 변경이 webhook과 polling으로 동시에 들어오면 중복 ChangeLog, 불필요 ConflictRecord, 또는 displayHints overwrite가 발생할 수 있다. outbound도 CRM 측 최신 변경을 모른 채 crmExternalId/lastSyncedAt을 갱신할 수 있다.",
      "recommendation": "outbound CAS도 `crm_version=$expectedCrmVersion`을 포함하라. webhook과 polling 모두 provider change identity를 동일한 idempotency ledger 또는 CrmRecordChangeLog unique key로 통과하게 하고, field-level update는 changed field만 set하도록 transaction boundary를 명시하라."
    },
    {
      "id": "CS3-05",
      "severity": "blocking",
      "category": "법적 근거·동의 철회",
      "location": "docs/features/crm-sync.md:528-543, 681-689; docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:375-379",
      "issue": "v1.0은 patientConsentEvidenceRef와 right to erasure를 v1.x로 미루면서도 inbound webhook으로 환자 contact displayHints를 생성한다. liveRead를 제거해 일부 위험은 줄었지만, 환자 동의 철회 요청이 v1.0 운영 중 발생했을 때 sync 차단, displayHints 삭제, CrmRecord tombstone 처리, CRM 재수집 방지 규칙이 없다.",
      "impact": "DPA는 처리 위탁 계약 증빙이지 record-level 동의 철회 대응을 대체하지 못한다. 철회된 환자 정보가 displayHints 형태로 계속 남거나 다음 webhook/polling에서 재생성될 수 있다.",
      "recommendation": "v1.0 최소 범위로 `consentWithdrawn` 또는 erasure tombstone ledger를 추가하라. 환자 식별은 raw PII 없이 `piiHash`/crmExternalId로 처리하고, 철회 시 displayHints nulling, inbound skip, outbound block, audit action을 정의하라."
    },
    {
      "id": "CS3-06",
      "severity": "blocking",
      "category": "DB 인벤토리 정합성",
      "location": "docs/features/crm-sync.md:23, 599, 718-1002",
      "issue": "문서는 계속 admin DB 12 tables라고 선언하지만 §13에는 CrmIntegration, CrmSyncLog, CrmSyncSourceAttempt, CrmSyncRetryQueue, CrmRecord, CrmRecordChangeLog, CrmFieldMapping, CrmConflictRecord, CrmCredentialAuditLog, CrmRateLimitState, CrmCredentialVersion, CrmWebhookNonceLedger, CrmSyncNotificationOutbox까지 13개 테이블이 있다. v0.3에서 CrmCredentialVersion을 신설하면서 인벤토리 수를 다시 갱신하지 않았다.",
      "impact": "CS2-01이 재발했다. migration checklist, acceptance test, purge 책임 범위가 실제 테이블 수와 맞지 않는다.",
      "recommendation": "인벤토리를 13 tables로 정정하거나 실제로 하나를 embedded/비테이블로 내리라. §0, §9, §13 제목, 마지막 문장, acceptance test의 DB inventory 검증을 모두 같은 숫자로 맞춰라."
    },
    {
      "id": "CS3-07",
      "severity": "major",
      "category": "PII closed schema 운영성",
      "location": "docs/features/crm-sync.md:248-261, 510-543, 831-856",
      "issue": "displayHints 6개 컬럼은 raw PII 저장 금지에는 유리하지만 한국 의료기관 운영 화면에서 필요한 최소 운영 문맥이 부족하다. 예를 들어 진료과/상담유형, 보호자 여부, 예약 희망일/문의 유형, 지점/채널 같은 비식별 operational hint가 CrmRecord에 없다. raw detail은 'CRM 콘솔 직접 접근'으로만 안내하지만 SSO, role mapping, deep link, 감사 로그 경계가 없다.",
      "impact": "운영자는 solution 화면에서 충돌·재시도·문의 대응을 판단하기 어렵고, 결국 CRM 콘솔을 상시 열어 raw PII를 조회하게 된다. 이는 v1.0의 raw PII 최소 접근 원칙을 운영상 약화시킨다.",
      "recommendation": "displayHints와 별개로 non-PII operational columns를 정의하라. 예: entityStatus, inquiryType, departmentHint, locationKey, channelType, submittedAt/occurredAt, guardianInvolved boolean. CRM 콘솔 접근은 SSO/role/deep-link/audit 책임 경계를 명시하라."
    },
    {
      "id": "CS3-08",
      "severity": "major",
      "category": "displayHints DB CHECK 구현 가능성",
      "location": "docs/features/crm-sync.md:252-261, 831-856",
      "issue": "`displayHintsCityName`의 CHECK가 '시·도·구·군 명만'으로만 되어 있어 DB CHECK로 구현 가능한 규칙이 아니다. nameInitial 정규식도 PostgreSQL 등 일반 DB CHECK regex에서 `\\p{L}` 지원 여부가 환경 의존적이다.",
      "impact": "문서가 DB CHECK + application validator 양층 강제를 선언하지만 실제 migration은 불완전하거나 DB별로 달라진다. raw 주소 조각이 cityName에 들어가는 것을 DB가 보장하지 못한다.",
      "recommendation": "DB CHECK는 길이·문자 클래스·금지 문자 정도로 제한하고, 행정구역 allowlist table 또는 application validator를 canonical으로 지정하라. DB portability가 필요하면 정규식 dialect를 명시하라."
    },
    {
      "id": "CS3-09",
      "severity": "major",
      "category": "unregister·purge·orphan 처리",
      "location": "docs/features/crm-sync.md:181-189, 645-653, 720-743, 831-856",
      "issue": "`unregisterIntegration`은 soft delete라고만 되어 있고 기존 CrmRecord, displayHints, ChangeLog, ConflictRecord, NonceLedger, RetryQueue row를 purge할지 orphan으로 보존할지 규칙이 없다. CrmIntegration은 `active=false` partial unique만 있고 FK delete policy도 대부분 생략되어 있다.",
      "impact": "연동 해제 후에도 solution DB에 displayHints와 piiHash가 남을 수 있다. 반대로 FK RESTRICT 때문에 purge가 불가능해질 수 있다.",
      "recommendation": "unregister 정책을 표로 고정하라. 예: integration active=false, inbound/outbound 즉시 차단, pending queue cancel, displayHints 즉시 null 또는 N일 후 purge, audit/change log retention 유지 여부, legal hold 예외, FK ON DELETE 정책."
    },
    {
      "id": "CS3-10",
      "severity": "major",
      "category": "retention·purge worker",
      "location": "docs/features/crm-sync.md:143-159, 593, 645-653, 745-998",
      "issue": "여러 테이블에 expiresAt은 추가됐지만 purge worker의 소유권, cadence, batch size, legal hold, failure reconcile이 없다. AT-25도 `retentionDays.changeLog` 하나만 다루며 syncLog/sourceAttempt/conflictRecord/retryQueue/outbox/nonceLedger/displayHints 만료를 검증하지 않는다.",
      "impact": "CS2-13이 부분 해결에 그친다. 개인정보 최소 보존과 운영 로그 보존 정책이 실제 worker 동작으로 닫히지 않는다.",
      "recommendation": "Feature 내부 purge worker를 정의하거나 공통 purge infra SoT를 참조하라. 테이블별 cadence와 action을 명시하라: delete row, null displayHints, keep tombstone, archive, legal hold skip. acceptance test도 retention 대상별 대표 케이스로 늘려라."
    },
    {
      "id": "CS3-11",
      "severity": "major",
      "category": "RRN 복구 audit cascade",
      "location": "docs/features/crm-sync.md:373-384; docs/admin/REVIEW_WORKFLOW.md:643-673",
      "issue": "recoverRrnFalsePositive는 '모든 경로 audit log 기록'을 요구하지만 REVIEW_WORKFLOW §10.2.1의 AuditAction 4종에는 RRN override/abandon에 해당하는 action이 없다. crm-sync 본문 §3.1.1 audit contract에도 복구 command 행이 없다.",
      "impact": "가장 민감한 super-admin override가 canonical audit enum 없이 구현된다. 구현 시 audit insert가 실패하거나 기존 `crm-credential-rotated` 같은 부적절한 action에 얹힐 위험이 있다.",
      "recommendation": "`crm-rrn-false-positive-recovered`와 `crm-rrn-rejection-finalized` 같은 AuditAction을 REVIEW_WORKFLOW에 cascade하고, metadata에 ledgerId, action, priorStatus, finalStatus, rrnFingerprint prefix, actorRole을 명시하라."
    },
    {
      "id": "CS3-12",
      "severity": "major",
      "category": "retry/outbox SQL 패턴 정합성",
      "location": "docs/features/crm-sync.md:55, 438-470, 784-829; docs/features/search-visibility.md:624-652",
      "issue": "crm-sync는 search-visibility §13.5 SQL 복제를 선언하지만 실제 SQL은 핵심 invariant 일부가 빠졌다. search-visibility는 claim 후 attemptNumber 산정, stale processing reconcile, envelope 재계산, lock ordering invariant를 명시한다. crm-sync §13.4는 claim, advisory lock, exhausted update만 있고 stale row를 pending으로 되돌리는 SQL, envelope 재계산, attempt insert transaction 순서가 없다. 또한 §1.2는 outbox SQL SoT를 search-visibility §13.10이라고 하지만 search-visibility §13.10은 outbox schema 중심이고 SQL은 §7.3 참조 형태다.",
      "impact": "외부 CRM 장애 시 stuck processing, 중복 attemptNumber, envelope 상태 불일치가 발생할 수 있다.",
      "recommendation": "search-visibility 수준의 worker contract를 crm-sync에 직접 전개하라. RetryQueue claim, SourceAttempt insert, provider call, attempt finalization, envelope recalculation, stale reclaim, exhausted transition, permanent transition을 transaction 순서와 advisory lock ordering까지 포함해 고정하라."
    },
    {
      "id": "CS3-13",
      "severity": "major",
      "category": "DATA_MODEL cascade",
      "location": "docs/features/crm-sync.md:112-133, 302-329; docs/core/DATA_MODEL.md:694-715",
      "issue": "DATA_MODEL C-08의 CrmIntegrationEntry가 v0.3 본문과 동기화되지 않았다. 본문 manifest에는 `genericRestApiAdapter`가 있고 build fail에도 provider=generic-rest-api config 누락이 있지만 DATA_MODEL의 CrmIntegrationEntry에는 해당 필드가 없다. CredentialVersion 도입 후 secretVersionId/currentCredentialVersionId 수준의 manifest/DB 경계도 DATA_MODEL에 반영되지 않았다.",
      "impact": "manifest validator가 DATA_MODEL만 따르면 generic-rest-api adapter config를 받을 수 없고, 본문 validator만 따르면 DATA_MODEL SoT와 불일치한다.",
      "recommendation": "DATA_MODEL C-08에 genericRestApiAdapter 하위 필드와 credential version 경계를 반영하라. DB 내부 entity라면 'manifest에는 secretRef만, CredentialVersion은 register/rotate 시 admin DB materialization'처럼 경계를 명시하라."
    },
    {
      "id": "CS3-14",
      "severity": "major",
      "category": "변경 정책",
      "location": "docs/features/crm-sync.md:32-48, 248-261, 939-955",
      "issue": "§1.1 변경 정책이 v0.3 신규 메커니즘을 충분히 다루지 않는다. displayHints closed schema 컬럼 추가/제거가 MAJOR인지 MINOR인지, CrmCredentialVersion state enum 추가/제거가 어떤 SemVer인지, DB table 추가가 어떤 cascade를 요구하는지 명확하지 않다.",
      "impact": "향후 보호자 정보, 진료과 hint 같은 non-PII hint를 추가할 때 호환성 판단이 임의화된다. CredentialVersion 상태 추가도 migration/runtime invariant 변경인데 정책상 위치가 없다.",
      "recommendation": "displayHints column 추가는 read API/output schema 변경이면 MINOR 또는 MAJOR 중 하나로 명확히 정하라. closed schema 제거/타입 변경은 MAJOR, state enum 추가는 MAJOR 또는 MINOR+backward-compatible default 등으로 규칙화하라."
    },
    {
      "id": "CS3-15",
      "severity": "major",
      "category": "acceptance test coverage",
      "location": "docs/features/crm-sync.md:565-595, 605-653",
      "issue": "27개 acceptance test는 늘었지만 §10 fail/invariant와 1:1 대응하지 않는다. genericRestApiAdapter 누락, pii.liveReadEnabled=true, fieldMappingPolicyVersion 누락, displayHints migration validation, recoverRrnFalsePositive invalid status, grace-expired worker failure reconcile, unregister purge, DATA_MODEL/REVIEW_WORKFLOW cascade mismatch는 테스트가 없다.",
      "impact": "v0.3에서 추가된 핵심 위험 중 상당수가 회귀 방지되지 않는다.",
      "recommendation": "§10.1/10.2/10.4 각 fail 또는 invariant에 최소 하나의 fixture를 매핑하는 traceability 표를 추가하라. 특히 duplicate-digest는 deliveryKind별로 분리하고, purge는 모든 retention 대상 중 대표 테이블군을 포함하라."
    },
    {
      "id": "CS3-16",
      "severity": "minor",
      "category": "2차 지적 재발 평가",
      "location": "docs/features/crm-sync.md:708-716",
      "issue": "변경 이력은 CS2 17개 전건 수용이라고 쓰지만 실제 상태는 혼재다. CS2-02, CS2-03의 타입 shape, CS2-05의 displayHints closed schema, CS2-06 outbound-only matrix, CS2-10 복구 command, CS2-11 outbox sourceId, CS2-14 fingerprint, CS2-15 canonical schema는 대체로 반영됐다. 반면 CS2-01 DB 인벤토리, CS2-04 nonce key, CS2-08 CAS, CS2-09 rotation 동시성, CS2-12 worker SQL, CS2-13 purge, CS2-16 acceptance coverage는 부분 재발한다.",
      "impact": "문서 상태가 안정판에 가까운 것처럼 보이지만 구현 가능성 기준으로는 아직 주요 설계 결함이 남아 있다.",
      "recommendation": "변경 이력의 '전건 수용' 표현과 별도로 cycle3 residual checklist를 추가하고, 재발 항목은 명시적으로 open 상태로 추적하라."
    },
    {
      "id": "CS3-17",
      "severity": "minor",
      "category": "명세 표현·잔재",
      "location": "docs/features/crm-sync.md:236, 342, 530, 1002",
      "issue": "`Ref<C-anything>` 같은 비정규 타입 표기, 존재하지 않는 `rotating-revoked` 상태, 중복 출력된 line 530, '13개 절·12개 admin DB 테이블' 문장이 남아 있다.",
      "impact": "작은 편집 문제지만 구현자가 실제 enum/type으로 오해할 수 있다.",
      "recommendation": "`Ref<C-anything>`를 허용 가능한 Ref union 또는 string ref로 바꾸고, 존재하지 않는 상태명과 테이블 수 문장을 정리하라."
    }
  ],
  "required_next_actions": [
    "DB 인벤토리를 13 tables로 정정하고 §0/§9/§13/acceptance fixture를 동기화한다.",
    "CredentialVersion 상태 모델을 Integration state와 Version row state의 invariant 표로 재작성하고 존재하지 않는 상태명을 제거한다.",
    "NonceLedger partial unique를 deliveryKind별로 재설계하고 acceptance tests를 exactly-once/at-least-once/best-effort로 분리한다.",
    "Webhook/polling/outbound CAS를 동일 idempotency/versioning 모델로 묶고 VerifierResult 전달 context를 정의한다.",
    "동의 철회, unregister, displayHints expiry, purge worker를 v1.0 최소 운영 계약으로 닫는다.",
    "RRN false positive 복구 audit action과 DATA_MODEL generic-rest-api/credential boundary cascade를 완료한다."
  ],
  "stability_assessment": {
    "cycle2_regression_status": "partial_regression",
    "SoT_alignment": "partial",
    "db_schema_completeness": "fail",
    "webhook_security": "partial",
    "idempotency_and_dedupe": "fail",
    "conflict_resolution": "fail",
    "credential_rotation": "fail",
    "PII_closed_schema": "partial",
    "legal_consent_erasure": "fail",
    "operational_workers": "partial",
    "acceptance_test_coverage": "partial"
  }
}
tokens used
88,075
{
  "feature": "crm-sync",
  "version_reviewed": "v0.3",
  "cycle": 3,
  "verdict": "needs_major_revision",
  "summary": {
    "overall": "v0.3은 2차 지적 17개 중 liveRead 제거, verifier shape, closed displayHints, outbound-only matrix, CredentialVersion 도입, RRN 복구 command, outbox sourceId 개선 등은 실제 반영됐다. 그러나 CredentialVersion 상태 모델, nonce ledger unique key, webhook/polling/CAS 동시성, 법적 철회·unregister·purge, DATA_MODEL cascade, DB 인벤토리 수가 여전히 불일치한다. 특히 '12 tables' 선언은 v0.3 자체 추가로 13 tables가 되어 다시 깨졌다.",
    "blocking_count": 6,
    "major_count": 9,
    "minor_count": 2
  },
  "findings": [
    {
      "id": "CS3-01",
      "severity": "blocking",
      "category": "credential rotation 상태 모델",
      "location": "docs/features/crm-sync.md:442-469, 720-733, 939-955",
      "issue": "CrmIntegration.credentialState는 stable·rotating·committed·grace-expired·reverted 5상태인데 CrmCredentialVersion.state는 active·rotating-target·committed·grace-expired·reverted·revoked 6상태다. 두 enum이 서로 다른 추상 수준일 수는 있지만 매핑 표가 없다. 또한 §4.1은 `credential state ≠ \"rotating-revoked\"`를 검사한다고 쓰는데 해당 상태는 어느 enum에도 없다.",
      "impact": "worker가 integration 상태와 version row 상태 중 무엇을 신뢰해야 하는지 불명확하다. rotation 중 old/new credential 허용, grace 만료, revoke/revert 후 stable 복귀가 구현자별로 달라질 수 있다.",
      "recommendation": "Integration state와 CredentialVersion state를 별도 enum으로 유지하려면 상태별 invariant 표를 추가하라. 예: stable이면 exactly one active row, rotating이면 one active + one rotating-target, committed이면 current active + previous committed with graceUntil. `rotating-revoked` 잔재를 제거하고 revoked 상태 전이·currentCredentialVersionId 갱신 시점을 명시하라."
    },
    {
      "id": "CS3-02",
      "severity": "blocking",
      "category": "webhook nonce ledger·dedupe",
      "location": "docs/features/crm-sync.md:358-363, 565-579, 958-978",
      "issue": "§4.2는 at-least-once key를 `(integrationId, providerEventId OR canonicalDigest, receivedBucket)`로 정의하지만 §13.12 constraints는 `providerEventId IS NOT NULL`이면 무조건 `(integrationId, providerEventId)` unique를 적용한다. 즉 providerEventId가 있는 at-least-once 이벤트는 bucket 없이 exactly-once처럼 영구 dedupe된다. 반대로 AT-10은 at-least-once 재전송을 `duplicate-digest`로 기대해 providerEventId 존재/부재 케이스가 분리되지 않았다.",
      "impact": "provider retry, providerEventId 재사용, best-effort payload replay가 서로 다른 정책으로 처리되지 않는다. 정상 재전송이 과도하게 차단되거나, 반대로 duplicate digest 테스트가 실제 constraint와 맞지 않는다.",
      "recommendation": "ledger key를 deliveryKind별 partial unique로 분리하라. exactly-once: `(integrationId, providerEventId)`. at-least-once with eventId: `(integrationId, providerEventId, receivedBucket)`. at-least-once without eventId 및 best-effort: `(integrationId, canonicalDigest, receivedBucket)`. acceptance test도 at-least-once eventId / digest fallback / best-effort digest를 별도 케이스로 쪼개라."
    },
    {
      "id": "CS3-03",
      "severity": "blocking",
      "category": "webhook verifier 결과 전달",
      "location": "docs/features/crm-sync.md:302-329, 350-370, 398-416",
      "issue": "VerifierResult가 providerEventId와 providerTimestamp를 반환하지만 이후 payload parser, CrmFieldMapping inbound 역변환, CAS expected version 산정으로 어떻게 전달되는지 정의되어 있지 않다. §4.2는 verifier 결과를 nonce ledger와 timestamp check에만 사용하고, §4.3의 `expectedCrmVersion`·`expectedSolutionVersion`은 어디서 온 값인지 비어 있다.",
      "impact": "webhook payload에 CRM version이 없는 provider, timestamp만 있는 provider, polling으로 동일 record를 읽는 경로에서 같은 변경을 동일하게 versioning할 수 없다. 충돌 감지·last-write-wins 판단이 provider adapter 구현 세부에 묻힌다.",
      "recommendation": "InboundProcessingContext 같은 명시적 구조를 정의하고 `providerEventId`, `providerTimestamp`, `canonicalDigest`, `deliveryKind`, provider-specific version/replay id를 mapping/CAS 단계까지 전달하라. provider별로 crmVersion 산정 원천도 표로 고정하라."
    },
    {
      "id": "CS3-04",
      "severity": "blocking",
      "category": "CAS·webhook/polling race",
      "location": "docs/features/crm-sync.md:335-347, 350-370, 398-416",
      "issue": "CAS WHERE는 추가됐지만 양방향 race 보장이 아직 부족하다. §4.1 outbound는 `WHERE id=? AND solution_version=?`만 사용해 inbound가 직전에 crm_version을 바꾼 경우를 감지하지 못한다. §4.3 inbound는 displayHints 전체를 set하고 `crm_version`·`solution_version`을 비교하지만 polling inbound와 webhook inbound가 같은 CRM 변경을 동시에 처리할 때 nonce ledger는 webhook에만 적용된다.",
      "impact": "동일 CRM 변경이 webhook과 polling으로 동시에 들어오면 중복 ChangeLog, 불필요 ConflictRecord, 또는 displayHints overwrite가 발생할 수 있다. outbound도 CRM 측 최신 변경을 모른 채 crmExternalId/lastSyncedAt을 갱신할 수 있다.",
      "recommendation": "outbound CAS도 `crm_version=$expectedCrmVersion`을 포함하라. webhook과 polling 모두 provider change identity를 동일한 idempotency ledger 또는 CrmRecordChangeLog unique key로 통과하게 하고, field-level update는 changed field만 set하도록 transaction boundary를 명시하라."
    },
    {
      "id": "CS3-05",
      "severity": "blocking",
      "category": "법적 근거·동의 철회",
      "location": "docs/features/crm-sync.md:528-543, 681-689; docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md:375-379",
      "issue": "v1.0은 patientConsentEvidenceRef와 right to erasure를 v1.x로 미루면서도 inbound webhook으로 환자 contact displayHints를 생성한다. liveRead를 제거해 일부 위험은 줄었지만, 환자 동의 철회 요청이 v1.0 운영 중 발생했을 때 sync 차단, displayHints 삭제, CrmRecord tombstone 처리, CRM 재수집 방지 규칙이 없다.",
      "impact": "DPA는 처리 위탁 계약 증빙이지 record-level 동의 철회 대응을 대체하지 못한다. 철회된 환자 정보가 displayHints 형태로 계속 남거나 다음 webhook/polling에서 재생성될 수 있다.",
      "recommendation": "v1.0 최소 범위로 `consentWithdrawn` 또는 erasure tombstone ledger를 추가하라. 환자 식별은 raw PII 없이 `piiHash`/crmExternalId로 처리하고, 철회 시 displayHints nulling, inbound skip, outbound block, audit action을 정의하라."
    },
    {
      "id": "CS3-06",
      "severity": "blocking",
      "category": "DB 인벤토리 정합성",
      "location": "docs/features/crm-sync.md:23, 599, 718-1002",
      "issue": "문서는 계속 admin DB 12 tables라고 선언하지만 §13에는 CrmIntegration, CrmSyncLog, CrmSyncSourceAttempt, CrmSyncRetryQueue, CrmRecord, CrmRecordChangeLog, CrmFieldMapping, CrmConflictRecord, CrmCredentialAuditLog, CrmRateLimitState, CrmCredentialVersion, CrmWebhookNonceLedger, CrmSyncNotificationOutbox까지 13개 테이블이 있다. v0.3에서 CrmCredentialVersion을 신설하면서 인벤토리 수를 다시 갱신하지 않았다.",
      "impact": "CS2-01이 재발했다. migration checklist, acceptance test, purge 책임 범위가 실제 테이블 수와 맞지 않는다.",
      "recommendation": "인벤토리를 13 tables로 정정하거나 실제로 하나를 embedded/비테이블로 내리라. §0, §9, §13 제목, 마지막 문장, acceptance test의 DB inventory 검증을 모두 같은 숫자로 맞춰라."
    },
    {
      "id": "CS3-07",
      "severity": "major",
      "category": "PII closed schema 운영성",
      "location": "docs/features/crm-sync.md:248-261, 510-543, 831-856",
      "issue": "displayHints 6개 컬럼은 raw PII 저장 금지에는 유리하지만 한국 의료기관 운영 화면에서 필요한 최소 운영 문맥이 부족하다. 예를 들어 진료과/상담유형, 보호자 여부, 예약 희망일/문의 유형, 지점/채널 같은 비식별 operational hint가 CrmRecord에 없다. raw detail은 'CRM 콘솔 직접 접근'으로만 안내하지만 SSO, role mapping, deep link, 감사 로그 경계가 없다.",
      "impact": "운영자는 solution 화면에서 충돌·재시도·문의 대응을 판단하기 어렵고, 결국 CRM 콘솔을 상시 열어 raw PII를 조회하게 된다. 이는 v1.0의 raw PII 최소 접근 원칙을 운영상 약화시킨다.",
      "recommendation": "displayHints와 별개로 non-PII operational columns를 정의하라. 예: entityStatus, inquiryType, departmentHint, locationKey, channelType, submittedAt/occurredAt, guardianInvolved boolean. CRM 콘솔 접근은 SSO/role/deep-link/audit 책임 경계를 명시하라."
    },
    {
      "id": "CS3-08",
      "severity": "major",
      "category": "displayHints DB CHECK 구현 가능성",
      "location": "docs/features/crm-sync.md:252-261, 831-856",
      "issue": "`displayHintsCityName`의 CHECK가 '시·도·구·군 명만'으로만 되어 있어 DB CHECK로 구현 가능한 규칙이 아니다. nameInitial 정규식도 PostgreSQL 등 일반 DB CHECK regex에서 `\\p{L}` 지원 여부가 환경 의존적이다.",
      "impact": "문서가 DB CHECK + application validator 양층 강제를 선언하지만 실제 migration은 불완전하거나 DB별로 달라진다. raw 주소 조각이 cityName에 들어가는 것을 DB가 보장하지 못한다.",
      "recommendation": "DB CHECK는 길이·문자 클래스·금지 문자 정도로 제한하고, 행정구역 allowlist table 또는 application validator를 canonical으로 지정하라. DB portability가 필요하면 정규식 dialect를 명시하라."
    },
    {
      "id": "CS3-09",
      "severity": "major",
      "category": "unregister·purge·orphan 처리",
      "location": "docs/features/crm-sync.md:181-189, 645-653, 720-743, 831-856",
      "issue": "`unregisterIntegration`은 soft delete라고만 되어 있고 기존 CrmRecord, displayHints, ChangeLog, ConflictRecord, NonceLedger, RetryQueue row를 purge할지 orphan으로 보존할지 규칙이 없다. CrmIntegration은 `active=false` partial unique만 있고 FK delete policy도 대부분 생략되어 있다.",
      "impact": "연동 해제 후에도 solution DB에 displayHints와 piiHash가 남을 수 있다. 반대로 FK RESTRICT 때문에 purge가 불가능해질 수 있다.",
      "recommendation": "unregister 정책을 표로 고정하라. 예: integration active=false, inbound/outbound 즉시 차단, pending queue cancel, displayHints 즉시 null 또는 N일 후 purge, audit/change log retention 유지 여부, legal hold 예외, FK ON DELETE 정책."
    },
    {
      "id": "CS3-10",
      "severity": "major",
      "category": "retention·purge worker",
      "location": "docs/features/crm-sync.md:143-159, 593, 645-653, 745-998",
      "issue": "여러 테이블에 expiresAt은 추가됐지만 purge worker의 소유권, cadence, batch size, legal hold, failure reconcile이 없다. AT-25도 `retentionDays.changeLog` 하나만 다루며 syncLog/sourceAttempt/conflictRecord/retryQueue/outbox/nonceLedger/displayHints 만료를 검증하지 않는다.",
      "impact": "CS2-13이 부분 해결에 그친다. 개인정보 최소 보존과 운영 로그 보존 정책이 실제 worker 동작으로 닫히지 않는다.",
      "recommendation": "Feature 내부 purge worker를 정의하거나 공통 purge infra SoT를 참조하라. 테이블별 cadence와 action을 명시하라: delete row, null displayHints, keep tombstone, archive, legal hold skip. acceptance test도 retention 대상별 대표 케이스로 늘려라."
    },
    {
      "id": "CS3-11",
      "severity": "major",
      "category": "RRN 복구 audit cascade",
      "location": "docs/features/crm-sync.md:373-384; docs/admin/REVIEW_WORKFLOW.md:643-673",
      "issue": "recoverRrnFalsePositive는 '모든 경로 audit log 기록'을 요구하지만 REVIEW_WORKFLOW §10.2.1의 AuditAction 4종에는 RRN override/abandon에 해당하는 action이 없다. crm-sync 본문 §3.1.1 audit contract에도 복구 command 행이 없다.",
      "impact": "가장 민감한 super-admin override가 canonical audit enum 없이 구현된다. 구현 시 audit insert가 실패하거나 기존 `crm-credential-rotated` 같은 부적절한 action에 얹힐 위험이 있다.",
      "recommendation": "`crm-rrn-false-positive-recovered`와 `crm-rrn-rejection-finalized` 같은 AuditAction을 REVIEW_WORKFLOW에 cascade하고, metadata에 ledgerId, action, priorStatus, finalStatus, rrnFingerprint prefix, actorRole을 명시하라."
    },
    {
      "id": "CS3-12",
      "severity": "major",
      "category": "retry/outbox SQL 패턴 정합성",
      "location": "docs/features/crm-sync.md:55, 438-470, 784-829; docs/features/search-visibility.md:624-652",
      "issue": "crm-sync는 search-visibility §13.5 SQL 복제를 선언하지만 실제 SQL은 핵심 invariant 일부가 빠졌다. search-visibility는 claim 후 attemptNumber 산정, stale processing reconcile, envelope 재계산, lock ordering invariant를 명시한다. crm-sync §13.4는 claim, advisory lock, exhausted update만 있고 stale row를 pending으로 되돌리는 SQL, envelope 재계산, attempt insert transaction 순서가 없다. 또한 §1.2는 outbox SQL SoT를 search-visibility §13.10이라고 하지만 search-visibility §13.10은 outbox schema 중심이고 SQL은 §7.3 참조 형태다.",
      "impact": "외부 CRM 장애 시 stuck processing, 중복 attemptNumber, envelope 상태 불일치가 발생할 수 있다.",
      "recommendation": "search-visibility 수준의 worker contract를 crm-sync에 직접 전개하라. RetryQueue claim, SourceAttempt insert, provider call, attempt finalization, envelope recalculation, stale reclaim, exhausted transition, permanent transition을 transaction 순서와 advisory lock ordering까지 포함해 고정하라."
    },
    {
      "id": "CS3-13",
      "severity": "major",
      "category": "DATA_MODEL cascade",
      "location": "docs/features/crm-sync.md:112-133, 302-329; docs/core/DATA_MODEL.md:694-715",
      "issue": "DATA_MODEL C-08의 CrmIntegrationEntry가 v0.3 본문과 동기화되지 않았다. 본문 manifest에는 `genericRestApiAdapter`가 있고 build fail에도 provider=generic-rest-api config 누락이 있지만 DATA_MODEL의 CrmIntegrationEntry에는 해당 필드가 없다. CredentialVersion 도입 후 secretVersionId/currentCredentialVersionId 수준의 manifest/DB 경계도 DATA_MODEL에 반영되지 않았다.",
      "impact": "manifest validator가 DATA_MODEL만 따르면 generic-rest-api adapter config를 받을 수 없고, 본문 validator만 따르면 DATA_MODEL SoT와 불일치한다.",
      "recommendation": "DATA_MODEL C-08에 genericRestApiAdapter 하위 필드와 credential version 경계를 반영하라. DB 내부 entity라면 'manifest에는 secretRef만, CredentialVersion은 register/rotate 시 admin DB materialization'처럼 경계를 명시하라."
    },
    {
      "id": "CS3-14",
      "severity": "major",
      "category": "변경 정책",
      "location": "docs/features/crm-sync.md:32-48, 248-261, 939-955",
      "issue": "§1.1 변경 정책이 v0.3 신규 메커니즘을 충분히 다루지 않는다. displayHints closed schema 컬럼 추가/제거가 MAJOR인지 MINOR인지, CrmCredentialVersion state enum 추가/제거가 어떤 SemVer인지, DB table 추가가 어떤 cascade를 요구하는지 명확하지 않다.",
      "impact": "향후 보호자 정보, 진료과 hint 같은 non-PII hint를 추가할 때 호환성 판단이 임의화된다. CredentialVersion 상태 추가도 migration/runtime invariant 변경인데 정책상 위치가 없다.",
      "recommendation": "displayHints column 추가는 read API/output schema 변경이면 MINOR 또는 MAJOR 중 하나로 명확히 정하라. closed schema 제거/타입 변경은 MAJOR, state enum 추가는 MAJOR 또는 MINOR+backward-compatible default 등으로 규칙화하라."
    },
    {
      "id": "CS3-15",
      "severity": "major",
      "category": "acceptance test coverage",
      "location": "docs/features/crm-sync.md:565-595, 605-653",
      "issue": "27개 acceptance test는 늘었지만 §10 fail/invariant와 1:1 대응하지 않는다. genericRestApiAdapter 누락, pii.liveReadEnabled=true, fieldMappingPolicyVersion 누락, displayHints migration validation, recoverRrnFalsePositive invalid status, grace-expired worker failure reconcile, unregister purge, DATA_MODEL/REVIEW_WORKFLOW cascade mismatch는 테스트가 없다.",
      "impact": "v0.3에서 추가된 핵심 위험 중 상당수가 회귀 방지되지 않는다.",
      "recommendation": "§10.1/10.2/10.4 각 fail 또는 invariant에 최소 하나의 fixture를 매핑하는 traceability 표를 추가하라. 특히 duplicate-digest는 deliveryKind별로 분리하고, purge는 모든 retention 대상 중 대표 테이블군을 포함하라."
    },
    {
      "id": "CS3-16",
      "severity": "minor",
      "category": "2차 지적 재발 평가",
      "location": "docs/features/crm-sync.md:708-716",
      "issue": "변경 이력은 CS2 17개 전건 수용이라고 쓰지만 실제 상태는 혼재다. CS2-02, CS2-03의 타입 shape, CS2-05의 displayHints closed schema, CS2-06 outbound-only matrix, CS2-10 복구 command, CS2-11 outbox sourceId, CS2-14 fingerprint, CS2-15 canonical schema는 대체로 반영됐다. 반면 CS2-01 DB 인벤토리, CS2-04 nonce key, CS2-08 CAS, CS2-09 rotation 동시성, CS2-12 worker SQL, CS2-13 purge, CS2-16 acceptance coverage는 부분 재발한다.",
      "impact": "문서 상태가 안정판에 가까운 것처럼 보이지만 구현 가능성 기준으로는 아직 주요 설계 결함이 남아 있다.",
      "recommendation": "변경 이력의 '전건 수용' 표현과 별도로 cycle3 residual checklist를 추가하고, 재발 항목은 명시적으로 open 상태로 추적하라."
    },
    {
      "id": "CS3-17",
      "severity": "minor",
      "category": "명세 표현·잔재",
      "location": "docs/features/crm-sync.md:236, 342, 530, 1002",
      "issue": "`Ref<C-anything>` 같은 비정규 타입 표기, 존재하지 않는 `rotating-revoked` 상태, 중복 출력된 line 530, '13개 절·12개 admin DB 테이블' 문장이 남아 있다.",
      "impact": "작은 편집 문제지만 구현자가 실제 enum/type으로 오해할 수 있다.",
      "recommendation": "`Ref<C-anything>`를 허용 가능한 Ref union 또는 string ref로 바꾸고, 존재하지 않는 상태명과 테이블 수 문장을 정리하라."
    }
  ],
  "required_next_actions": [
    "DB 인벤토리를 13 tables로 정정하고 §0/§9/§13/acceptance fixture를 동기화한다.",
    "CredentialVersion 상태 모델을 Integration state와 Version row state의 invariant 표로 재작성하고 존재하지 않는 상태명을 제거한다.",
    "NonceLedger partial unique를 deliveryKind별로 재설계하고 acceptance tests를 exactly-once/at-least-once/best-effort로 분리한다.",
    "Webhook/polling/outbound CAS를 동일 idempotency/versioning 모델로 묶고 VerifierResult 전달 context를 정의한다.",
    "동의 철회, unregister, displayHints expiry, purge worker를 v1.0 최소 운영 계약으로 닫는다.",
    "RRN false positive 복구 audit action과 DATA_MODEL generic-rest-api/credential boundary cascade를 완료한다."
  ],
  "stability_assessment": {
    "cycle2_regression_status": "partial_regression",
    "SoT_alignment": "partial",
    "db_schema_completeness": "fail",
    "webhook_security": "partial",
    "idempotency_and_dedupe": "fail",
    "conflict_resolution": "fail",
    "credential_rotation": "fail",
    "PII_closed_schema": "partial",
    "legal_consent_erasure": "fail",
    "operational_workers": "partial",
    "acceptance_test_coverage": "partial"
  }
}


codex
대상 문서가 길어 첫 출력이 중간 생략됐습니다. 이제 특정 절(4.x, 7.x, 10.x, 13.x)과 관련 SoT의 필요한 부분만 좁혀서 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Select-String -Path docs\\features\\crm-sync.md -Pattern '"'^### 4'"\\.|"'^#### 4'"\\.|"'^## 7'"\\.|"'^### 7'"\\.|"'^## 10'"\\.|"'^### 10'"\\.|"'^## 13'"\\.|"'^### 13'"\\.' -Context 0,35" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Select-String -Path docs\\features\\crm-sync.md -Pattern 'CrmIntegration\\.credentialState|credentialState|CrmCredentialVersion|rotating|reverted|stable|reset|expectedCrmVersion|ChangeIdentityLedger|ConsentWithdrawalLedger|applyConsentWithdrawal|unregister|ON DELETE|FK' -Context 2,4" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Select-String -Path docs\\compliance\\MEDICAL_AD_COMPLIANCE_COMMON.md -Pattern '개인정보|동의|민감|환자|식별|의료법|광고' -Context 2,3" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Select-String -Path docs\\core\\DATA_MODEL.md -Pattern 'CrmIntegrationEntry|genericRestApiAdapter|CrmCredentialVersion|crmSyncConfig' -Context 3,18" in C:\Users\assag\solution\website-exposure
 succeeded in 745ms:

  docs\core\DATA_MODEL.md:1:# Core — 데이터 계약 명세
  docs\core\DATA_MODEL.md:2:
  docs\core\DATA_MODEL.md:3:> **상태**: Draft v0.19
> docs\core\DATA_MODEL.md:4:> **작성일**: 2026-05-14 (v0.19 → v0.20 — `features/crm-sync.md` 3차 사이클 cascade: C-08 [7mC[0m
[7mrmIntegrationEntry[0m에 `genericRestApiAdapter` 추가 + manifest vs CrmCredentialVersion(admin DB) 경계 명시 — CS3-13)[0m
[7m[0m  docs\core\DATA_MODEL.md:5:> **소유자**: Glitzy[0m
[7m[0m  docs\core\DATA_MODEL.md:6:> **상위 문서**: `docs/ARCHITECTURE.md` § 2.4, § 7[0m
[7m[0m  docs\core\DATA_MODEL.md:7:> **연관 문서**:[0m
[7m[0m  docs\core\DATA_MODEL.md:8:> - 페이지 타입 → `core/PAGE_TYPES.md`[0m
[7m[0m  docs\core\DATA_MODEL.md:9:> - Schema 매핑 → `core/SCHEMA_MAPPING.md`[0m
[7m[0m  docs\core\DATA_MODEL.md:10:> - 위험도 → `compliance/RISK_LEVELS.md`[0m
[7m[0m  docs\core\DATA_MODEL.md:11:> - 디자인 토큰 → `core/DESIGN_TOKENS.md`[0m
[7m[0m  docs\core\DATA_MODEL.md:12:> - 어드민 데이터 모델 → `admin/DATA_MODEL.md`[0m
[7m[0m  docs\core\DATA_MODEL.md:13:> - 레퍼런스 분석 → `research/REFERENCE_ANALYSIS_2026-05.md`, `research/REFERENCE_DEEP_DIV[0m
[7m[0mE_2026-05.md`[0m
[7m[0m  docs\core\DATA_MODEL.md:14:[0m
[7m[0m  docs\core\DATA_MODEL.md:15:---[0m
[7m[0m  docs\core\DATA_MODEL.md:16:[0m
[7m[0m  docs\core\DATA_MODEL.md:17:## 0. 한 페이지 요약[0m
[7m[0m  docs\core\DATA_MODEL.md:18:[0m
[7m[0m  docs\core\DATA_MODEL.md:19:- **23개 계약 (C-01~C-23) + 3개 공통 타입 (CT-01~CT-03)**.[0m
[7m[0m  docs\core\DATA_MODEL.md:20:- v0.13: `features/notifications.md` cascade — C-08 확장(`adminBaseUrl`·`timezone`·`Notifi[0m
[7m[0mcationChannelsConfig`) + **C-23 `AdminUser` 신설** (어드민 사용자·자격·알림 선호 SoT).[0m
[7m[0m  docs\core\DATA_MODEL.md:21:- 모든 계약은 공통 메타필드(`@id`, `@createdAt`, `@updatedAt`).[0m
[7m[0m  docs\core\DATA_MODEL.md:22:- 빌드 입력 계약(Git 원본)과 운영 메타 계약(어드민 DB 원본) 구분.[0m
  docs\core\DATA_MODEL.md:593:| `keywordMonitoringPolicyVersion` | `string` | conditional | (v0.17 +) `features.keyword
-monitoring` 정책 SoT 버전. notifications·analytics·search-visibility 동일 패턴 |
  docs\core\DATA_MODEL.md:594:| `assetIngestionConfig` | `AssetIngestionConfig` | conditional | (v0.18 +) asset-ingesti
on 자격증명·식별자 SoT. `features.asset-ingestion` 활성 시 required. 동작 옵션은 `features[name="asset-ingestion"].conf
ig` (`features/asset-ingestion.md` § 2.3) |
  docs\core\DATA_MODEL.md:595:| `assetIngestionPolicyVersion` | `string` | conditional | (v0.18 +) `features.asset-inge
stion` 정책 SoT 버전. 5 Feature policyVersion 동일 패턴 |
> docs\core\DATA_MODEL.md:596:| `[7mcrmSyncConfig[0m` | `CrmSyncConfig` | conditional | (v0.19 +) CRM·환자관리 시스템 연동 자[0m
[7m[0m격증명·DPA·동의 증빙 SoT. `features.crm-sync` 활성 시 required. 동작 옵션은 `features[name="crm-sync"].config` (`featur[0m
[7m[0mes/crm-sync.md` § 2.3) |[0m
[7m[0m  docs\core\DATA_MODEL.md:597:| `crmSyncPolicyVersion` | `string` | conditional | (v0.19 +) `features.crm-sync` 정책 So[0m
[7m[0mT 버전. 7 Feature policyVersion 동일 패턴 |[0m
[7m[0m  docs\core\DATA_MODEL.md:598:| `complianceAssistantExemptApproval` | `{approvedBy: string, approvedAt: Date, exemption[0m
[7m[0mAgreementUrl: URL, reason: string}` | optional | (v0.12 +) compliance-assistant 비활성 예외 승인 기록 — `features/compl[0m
[7m[0miance-assistant.md` § 10.3. 본 필드 부재 시 의료기관 인스턴스의 본 Feature 비활성은 빌드 fail |[0m
[7m[0m  docs\core\DATA_MODEL.md:599:| `lastReleaseApprovedBy` | `string` | optional | 마지막 승인자 |[0m
[7m[0m  docs\core\DATA_MODEL.md:600:| `lastReleaseApprovedAt` | `Date` | optional | |[0m
[7m[0m  docs\core\DATA_MODEL.md:601:[0m
[7m[0m  docs\core\DATA_MODEL.md:602:#### `RobotsOverride` (v0.11 신규)[0m
[7m[0m  docs\core\DATA_MODEL.md:603:| 필드 | 타입 | required | 설명 |[0m
[7m[0m  docs\core\DATA_MODEL.md:604:|---|---|:---:|---|[0m
[7m[0m  docs\core\DATA_MODEL.md:605:| `userAgent` | `string` | ✅ | 대상 user-agent (예: `GPTBot`) |[0m
[7m[0m  docs\core\DATA_MODEL.md:606:| `action` | `enum {merge, replace}` | ✅ | 기존 Core 룰에 merge할지 replace할지 |[0m
[7m[0m  docs\core\DATA_MODEL.md:607:| `allow` | `string[]` | optional | Allow 경로 목록 |[0m
[7m[0m  docs\core\DATA_MODEL.md:608:| `disallow` | `string[]` | optional | Disallow 경로 목록 |[0m
[7m[0m  docs\core\DATA_MODEL.md:609:| `note` | `string` | optional | 운영자 메모 |[0m
[7m[0m  docs\core\DATA_MODEL.md:610:[0m
[7m[0m  docs\core\DATA_MODEL.md:611:#### `PerformanceBudget` (v0.11 신규, v0.12 확장)[0m
[7m[0m  docs\core\DATA_MODEL.md:612:| 필드 | 타입 | required | 설명 |[0m
[7m[0m  docs\core\DATA_MODEL.md:613:|---|---|:---:|---|[0m
[7m[0m  docs\core\DATA_MODEL.md:614:| `criticalUrls` | `string[]` | optional | 매 빌드 측정 critical URL. Home·핵심 시술 페이[0m
[7m[0m지 등 |[0m
  docs\core\DATA_MODEL.md:691:
  docs\core\DATA_MODEL.md:692:> 동작 옵션(`mode`·`ingestionSchedule`·`tagging`·`review`·`pii`·`promote`·`retentionDays`
·`blobStorage` 등)은 `features[name="asset-ingestion"].config` SoT (`features/asset-ingestion.md` § 2.3).
  docs\core\DATA_MODEL.md:693:
> docs\core\DATA_MODEL.md:694:#### `[7mCrmSyncConfig[0m` (v0.19 신규)[0m
[7m[0m  docs\core\DATA_MODEL.md:695:[0m
[7m[0m  docs\core\DATA_MODEL.md:696:| 필드 | 타입 | required | 설명 |[0m
[7m[0m  docs\core\DATA_MODEL.md:697:|---|---|:---:|---|[0m
> docs\core\DATA_MODEL.md:698:| `integrations` | `[7mCrmIntegrationEntry[0m[]` | ✅ | multiple CRM 연동 지원 (예: 본원 Salesfo[0m
[7m[0mrce + 분원 HubSpot) |[0m
[7m[0m  docs\core\DATA_MODEL.md:699:[0m
> docs\core\DATA_MODEL.md:700:#### `[7mCrmIntegrationEntry[0m` (v0.19 신규)[0m
[7m[0m  docs\core\DATA_MODEL.md:701:[0m
[7m[0m  docs\core\DATA_MODEL.md:702:| 필드 | 타입 | required | 설명 |[0m
[7m[0m  docs\core\DATA_MODEL.md:703:|---|---|:---:|---|[0m
[7m[0m  docs\core\DATA_MODEL.md:704:| `id` | string | ✅ | integration 식별자 (instance scope unique) |[0m
[7m[0m  docs\core\DATA_MODEL.md:705:| `provider` | enum (`salesforce`·`hubspot`·`generic-rest-api`) | ✅ | **v1.0은 3종만**. `[0m
[7m[0mkorean-emr`은 v1.x patch (CS-13). 해당 enum 값 build fail |[0m
[7m[0m  docs\core\DATA_MODEL.md:706:| `apiKeySecretRef` | string | ✅ | provider별 API key/OAuth client credentials |[0m
[7m[0m  docs\core\DATA_MODEL.md:707:| `apiUrl` | URL | ✅ | provider endpoint |[0m
[7m[0m  docs\core\DATA_MODEL.md:708:| `webhookSecret` | string | conditional | bi-directional 모드 시 required (signature 검[0m
[7m[0m증용) |[0m
[7m[0m  docs\core\DATA_MODEL.md:709:| `credentialExpiresAt` | Date | optional | OAuth token 등 만료 시각. null = 만료 없음 |[0m
[7m[0m  docs\core\DATA_MODEL.md:710:| `legalApproved` | boolean | ✅ | **DPA(Data Processing Agreement) 체결 완료** — true 필[0m
[7m[0m수 (CS1-12) |[0m
[7m[0m  docs\core\DATA_MODEL.md:711:| `legalApprovedBy` | string | ✅ | |[0m
[7m[0m  docs\core\DATA_MODEL.md:712:| `legalApprovedAt` | Date | ✅ | |[0m
[7m[0m  docs\core\DATA_MODEL.md:713:| `dpaEvidenceRef` | string | ✅ | DPA 계약 증빙 secretRef. **`patientConsentEvidenceRef`[0m
[7m[0m와 분리** (CS1-12) — DPA는 provider·기관 계약 증빙. 환자 단위 동의 증빙은 별도 (v1.0은 record-level 미저장 — CS-07 후속[0m
[7m[0m) |[0m
> docs\core\DATA_MODEL.md:714:| `[7mgenericRestApiAdapter[0m` | `GenericRestApiAdapterConfig` | conditional | (v0.20 +) `prov[0m
[7m[0mider="generic-rest-api"` 시 ✅. `webhookSignatureHeader`·`webhookTimestampHeader`·`webhookEventIdHeader`·`canonicalStrin[0m
[7m[0mgFormat` 4필드 (CS3-13). 누락 시 build fail (`features/crm-sync.md` § 10.1) |[0m
[7m[0m  docs\core\DATA_MODEL.md:715:[0m
> docs\core\DATA_MODEL.md:716:> 동작 옵션(`mode`·`syncSchedule`·`entities`·`fieldMappingPolicyVersion`·`retryQueue`·`cr
edentialRotation`·`pii`·`retentionDays` 등)은 `features[name="crm-sync"].config` SoT (`features/crm-sync.md` § 2.3). **
[7mCrmCredentialVersion[0m**(credential rotation 상태 머신·secretVersionId) 등 admin DB entity는 `features/crm-sync.md` § 13 [0m
[7m[0mSoT. manifest는 `apiKeySecretRef` 등 secretRef만 보유 — register/rotate 시 admin DB materialization (CS3-13).[0m
[7m[0m  docs\core\DATA_MODEL.md:717:[0m
[7m[0m  docs\core\DATA_MODEL.md:718:#### `SerpCrawlerApprovedScope` (v0.16 신규 — SV2-02 구조화)[0m
[7m[0m  docs\core\DATA_MODEL.md:719:[0m
[7m[0m  docs\core\DATA_MODEL.md:720:법무가 승인한 SERP 크롤러 권한 범위. crawler 실행 파라미터가 본 범위 밖이면 `skipped-lega[0m
[7m[0ml-out-of-scope` 처리:[0m
[7m[0m  docs\core\DATA_MODEL.md:721:[0m
[7m[0m  docs\core\DATA_MODEL.md:722:| 필드 | 타입 | required | 설명 |[0m
[7m[0m  docs\core\DATA_MODEL.md:723:|---|---|:---:|---|[0m
[7m[0m  docs\core\DATA_MODEL.md:724:| `searchEngines` | `("naver"\|"google")[]` | ✅ | 허용 검색 엔진 — 본 배열 외 호출 차단 |[0m
[7m[0m  docs\core\DATA_MODEL.md:725:| `locales` | `string[]` | ✅ | 예: `["ko-KR"]` — 허용 로케일 |[0m
[7m[0m  docs\core\DATA_MODEL.md:726:| `devices` | `("desktop"\|"mobile"\|"tablet")[]` | ✅ | 허용 device |[0m
[7m[0m  docs\core\DATA_MODEL.md:727:| `geo` | `string[]` | optional | ISO3166 alpha-2 — 허용 지역 |[0m
[7m[0m  docs\core\DATA_MODEL.md:728:| `allowLoginState` | `boolean` | optional | 로그인 상태 크롤링 허용 여부. **누락 시 fals[0m
[7m[0me로 자동 materialize** (SV3-03 — 안전 기본). 명시 true는 법무 승인 필요 |[0m
[7m[0m  docs\core\DATA_MODEL.md:729:| `allowCaptchaBypass` | `boolean` | optional | captcha 우회 허용. 누락 시 false 자동. **[0m
[7m[0m명시 true 금지** (build fail — 운영상 captcha 우회는 ToS 위반) |[0m
[7m[0m  docs\core\DATA_MODEL.md:730:| `artifactRetentionDaysMax` | `integer` | ✅ | artifact 최대 보존 일수 (config retentionD[0m
[7m[0mays.crawlerArtifact가 본 값 초과 시 build fail) |[0m
[7m[0m  docs\core\DATA_MODEL.md:731:| `allowedPaths` | `string[]` | optional | 크롤링 허용 path/도메인 패턴 |[0m
[7m[0m  docs\core\DATA_MODEL.md:732:[0m
[7m[0m  docs\core\DATA_MODEL.md:733:### C-09. `FeatureModuleConfig` — Feature Module 설정[0m
[7m[0m  docs\core\DATA_MODEL.md:734:[0m
  docs\core\DATA_MODEL.md:1076:| 2026-05-14 | v0.10 | **SEARCH_STANDARDIZATION v0.2 cascade**: C-06 PageMeta `ogType` e
num 확장 — `{website, article}` → **`{website, article, profile}`**. P-004 Doctor Profile 등 인물 페이지가 `profile` og
:type을 사용 (SEARCH_STANDARDIZATION § 2.2 매핑 참조) |
  docs\core\DATA_MODEL.md:1077:| 2026-05-14 | v0.11 | **SEARCH_STANDARDIZATION v0.5 cascade — C-08 InstanceManifest 확
장**: `environment`·`aiCrawlerPolicy`(required)·`aiCrawlerLegalApproved`·`aiCrawlerApprovedBy/At`·`robotsOverrides`·`ex
perimentalAiBots`·`performanceBudget`·`searchConsoleVerification` 8개 필드 추가. 하위 타입 `RobotsOverride`·`Performanc
eBudget` 신설 |
  docs\core\DATA_MODEL.md:1078:| 2026-05-14 | v0.12 | **SEARCH_STANDARDIZATION v0.6 cascade**: (1) **`aiCrawlerApproved
By/At`을 `aiCrawlerPolicy: allow` 시 required로 격상** — 감사 추적 게이트 강화, (2) **`PerformanceBudget` 확장** — `ima
geWeightKbOverride`·`lighthouseSeoMinOverride`·`lighthouseAccessibilityMinOverride` 추가 (SEARCH_STANDARDIZATION § 6.1 
budget 항목 정합) |
> docs\core\DATA_MODEL.md:1079:| 2026-05-14 | v0.19 | **`features/crm-sync.md` 1차 사이클 cascade**: (1) **C-08 `[7mcrmSyn[0m
[7mcConfig[0m` 신설** (CrmSyncConfig·CrmIntegrationEntry — provider 3종 한정, dpaEvidenceRef·patientConsentEvidenceRef 분리),[0m
[7m[0m (2) **C-08 `crmSyncPolicyVersion`** (7 Feature policyVersion 동일 패턴) |[0m
> docs\core\DATA_MODEL.md:1080:| 2026-05-14 | v0.20 | **`features/crm-sync.md` 3차 사이클 cascade (CS3-13)**: (1) [7mCrmIn[0m
[7mtegrationEntry[0m에 `genericRestApiAdapter` 필드 추가 — provider=generic-rest-api 시 required (webhookSignatureHeader·webh[0m
[7m[0mookTimestampHeader·webhookEventIdHeader·canonicalStringFormat 4필드), (2) manifest(secretRef) vs admin DB(`CrmCredentia[0m
[7m[0mlVersion` — secretVersionId·rotation state) 경계 명시 |[0m
[7m[0m  docs\core\DATA_MODEL.md:1081:| 2026-05-14 | v0.18 | **`features/asset-ingestion.md` 1차 사이클 cascade**: (1) **C-08 [0m
[7m[0m`assetIngestionConfig` 신설** (AssetIngestionConfig — sources webCrawl/snsApi/manualUpload/csvImport), (2) **C-08 `asse[0m
[7m[0mtIngestionPolicyVersion`** (6 Feature policyVersion 동일 패턴), (3) **`AssetIngestionApprovedScope` 신규** — SerpCrawle[0m
[7m[0mrApprovedScope의 SERP 특화 필드 제거·자산 수집 특화(allowedDomains·allowedPathPrefixes·maxPagesPerCrawl·maxAssetSizeMb·[0m
[7m[0martifactRetentionDaysMax) |[0m
[7m[0m  docs\core\DATA_MODEL.md:1082:| 2026-05-14 | v0.17 | **`features/keyword-monitoring.md` 1차 사이클 cascade**: (1) **C-[0m
[7m[0m08 `keywordMonitoringConfig` 신설** (KeywordMonitoringConfig — search-visibility의 SerpCrawlerApprovedScope 게이트 패턴[0m
[7m[0m 재사용), (2) **C-08 `keywordMonitoringPolicyVersion`** (top-level, 4 Feature policyVersion 동일 패턴) |[0m
[7m[0m  docs\core\DATA_MODEL.md:1083:| 2026-05-14 | v0.16 | **`features/search-visibility.md` 1차 사이클 cascade**: (1) **C-0[0m
[7m[0m8 `searchVisibilityConfig` 신설** (SearchVisibilityConfig — serpCrawler/backlinkSource, serpCrawler.enabled=true + lega[0m
[7m[0mlApproved 게이트 fail-gate), (2) **C-08 `searchVisibilityPolicyVersion`** (top-level, notifications·analytics 패턴 동일[0m
[7m[0m) |[0m
[7m[0m  docs\core\DATA_MODEL.md:1084:| 2026-05-14 | v0.15 | **`features/analytics-reporting.md` 4차 사이클 cascade**: (1) **C[0m
[7m[0m-08 `analyticsPolicyVersion` 신설** — notifications policyVersion 패턴 동일 (필수, 패키지 병렬 보관), (2) **C-10 `media[0m
[7m[0mThresholdOperationalInput` 슬롯 분리** — rolling-90 operational snapshot은 본 슬롯, calendar 확정 판정은 `mediaThreshol[0m
[7m[0mdAssessment` 슬롯. published record는 calendar 값만 (AR4-08) |[0m
[7m[0m  docs\core\DATA_MODEL.md:1085:| 2026-05-14 | v0.14 | **`features/analytics-reporting.md` 1차 사이클 cascade**: (1) **C[0m
[7m[0m-08 `analyticsConfig` 신설** — `AnalyticsConfig`(sources.gsc·naverSearchAdvisor·ga4·rum 자격증명·사이트 식별자만, 동작 [0m
[7m[0m옵션은 `features.analytics-reporting.config`로 분리), (2) **C-10 `mediaThresholdAssessment` 슬롯** — `MediaThresholdAss[0m
[7m[0messment` 신설(assessmentBasisDate·windowStart/End·rollingAverageDailyUsers·thresholdReached·primarySource·sourceComplet[0m
[7m[0meness·timezone·calendarPolicy·botFilteringPolicy·legalBasisNote). priorReviewRequired 산정 근거. ComplianceRecord 발행 [0m
[7m[0m시 snapshot으로 고정 |[0m
[7m[0m  docs\core\DATA_MODEL.md:1086:| 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1[0m
[7m[0m) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성[0m
[7m[0m 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit[0m
[7m[0m / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `A[0m
[7m[0mdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`el[0m
[7m[0migibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·dig[0m
[7m[0mestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IAN[0m
[7m[0mATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |[0m


 succeeded in 784ms:

> docs\features\crm-sync.md:403:[7m### 4.[0m1 outbound (CS3-04 강화 — CAS WHERE crm_version 포함)[0m
[7m[0m  docs\features\crm-sync.md:404:[0m
[7m[0m  docs\features\crm-sync.md:405:```[0m
[7m[0m  docs\features\crm-sync.md:406:1. pushOutbound(entity, recordId, operation)[0m
[7m[0m  docs\features\crm-sync.md:407:2. solution record load → CrmFieldMapping(direction includes "outbound")로 변환[0m
[7m[0m  docs\features\crm-sync.md:408:3. PII Redaction Validator (closed-schema + operational hints 통과 검증)[0m
[7m[0m  docs\features\crm-sync.md:409:4. RRN 검사 — 검출 시 push 차단 + 운영자 alert + ledger[0m
[7m[0m  docs\features\crm-sync.md:410:5. **consent withdrawal 체크** (CS3-05) — `CrmConsentWithdrawalLedger`에서 piiHash 또는[0m
[7m[0m crmExternalId 매칭 → push 차단[0m
[7m[0m  docs\features\crm-sync.md:411:6. credential state 검사 (§ 4.5.3 사용 matrix)[0m
[7m[0m  docs\features\crm-sync.md:412:7. rate limit token 획득[0m
[7m[0m  docs\features\crm-sync.md:413:8. CRM API call (idempotency-key)[0m
[7m[0m  docs\features\crm-sync.md:414:9. CrmRecord 갱신 — **CAS WHERE 양방향 version 모두 검사 (CS3-04)**:[0m
[7m[0m  docs\features\crm-sync.md:415:   `WHERE id=? AND solution_version=? AND crm_version=?`[0m
[7m[0m  docs\features\crm-sync.md:416:   → 0 rows affected → race detected → CrmConflictRecord 생성[0m
[7m[0m  docs\features\crm-sync.md:417:10. CrmRecordChangeLog insert (closed-schema)[0m
[7m[0m  docs\features\crm-sync.md:418:```[0m
[7m[0m  docs\features\crm-sync.md:419:[0m
> docs\features\crm-sync.md:420:[7m### 4.[0m2 inbound (CS3-02·03·04 강화)[0m
[7m[0m  docs\features\crm-sync.md:421:[0m
[7m[0m  docs\features\crm-sync.md:422:```[0m
[7m[0m  docs\features\crm-sync.md:423:1. CRM webhook → endpoint POST → processInboundWebhook (mode="outbound-only" → 404)[0m
[7m[0m  docs\features\crm-sync.md:424:2. ProviderWebhookVerifier.verify(rawBody, headers, fullUrl, method) → VerifierResult[0m
[7m[0m  docs\features\crm-sync.md:425:   - signatureValid=false → HTTP 401. ledger 미기록[0m
[7m[0m  docs\features\crm-sync.md:426:3. providerTimestamp 검증 (있으면) → rejected-stale-timestamp[0m
[7m[0m  docs\features\crm-sync.md:427:4. **CrmWebhookNonceLedger insert — deliveryKind별 partial unique (CS3-02)**:[0m
[7m[0m  docs\features\crm-sync.md:428:   - `exactly-once` (providerEventId 보장): key=`(integrationId, providerEventId)`. 중[0m
[7m[0m복 → `duplicate-eventid` → HTTP 200 deduped[0m
[7m[0m  docs\features\crm-sync.md:429:   - `at-least-once` + providerEventId 있음: key=`(integrationId, providerEventId, rece[0m
[7m[0mivedBucket)`. 같은 bucket 내 중복 → `duplicate-eventid-bucket`[0m
[7m[0m  docs\features\crm-sync.md:430:   - `at-least-once` + providerEventId 없음 또는 `best-effort`: key=`(integrationId, ca[0m
[7m[0mnonicalDigest, receivedBucket)`. 중복 → `duplicate-digest`[0m
[7m[0m  docs\features\crm-sync.md:431:   - status enum: `accepted-pending` | `accepted-processed` | `rejected-rrn-recoverable[0m
[7m[0m` | `rejected-rrn-final` | `rejected-parse-recoverable`[0m
[7m[0m  docs\features\crm-sync.md:432:5. **RRN 검사** (asset-ingestion § 9.1 checksum) — 검출 시 ledger `rejected-rrn-recover[0m
[7m[0mable` (복구 가능) 또는 `rejected-rrn-final`[0m
[7m[0m  docs\features\crm-sync.md:433:6. payload 파싱 + CrmFieldMapping(direction includes "inbound") 역변환[0m
[7m[0m  docs\features\crm-sync.md:434:7. **InboundProcessingContext 생성** (CS3-03 § 3.4.3)[0m
[7m[0m  docs\features\crm-sync.md:435:8. **consent withdrawal 체크** (CS3-05) — 매칭 시 ledger `accepted-processed` 대신 → st[0m
[7m[0matus="rejected-consent-withdrawn" + displayHints nulling 유지[0m
[7m[0m  docs\features\crm-sync.md:436:9. **closed-schema validator** — 위반 시 ledger `rejected-parse-recoverable` 후 reject[0m
[7m[0m  docs\features\crm-sync.md:437:10. **changeIdentityKey 생성 후 CrmChangeIdentityLedger insert** (CS3-04) — UNIQUE 충돌[0m
[7m[0m 시 duplicate → 즉시 종료 (polling과의 idempotency)[0m
[7m[0m  docs\features\crm-sync.md:438:11. CrmRecord field-level CAS 갱신 (§ 4.3)[0m
[7m[0m  docs\features\crm-sync.md:439:12. ledger `accepted-processed` 갱신 → HTTP 200 accepted[0m
[7m[0m  docs\features\crm-sync.md:440:```[0m
[7m[0m  docs\features\crm-sync.md:441:[0m
> docs\features\crm-sync.md:442:[7m#### 4.[0m2.1 RRN false positive 복구[0m
[7m[0m  docs\features\crm-sync.md:443:[0m
[7m[0m  docs\features\crm-sync.md:444:```[0m
[7m[0m  docs\features\crm-sync.md:445:recoverRrnFalsePositive(ledgerId, action: "override-and-fetch" | "abandon"):[0m
[7m[0m  docs\features\crm-sync.md:446:1. ledger row 조회 — status="rejected-rrn-recoverable"만 허용 (다른 status → runtime fa[0m
[7m[0mil)[0m
[7m[0m  docs\features\crm-sync.md:447:2. action="override-and-fetch":[0m
[7m[0m  docs\features\crm-sync.md:448:   - CRM live pull → RRN 재검사 → 통과 시 inbound 처리. ledger → "accepted-processed"[0m
[7m[0m  docs\features\crm-sync.md:449:   - 재검출 시 → "rejected-rrn-final"[0m
[7m[0m  docs\features\crm-sync.md:450:   - audit `crm-rrn-false-positive-recovered`[0m
[7m[0m  docs\features\crm-sync.md:451:3. action="abandon": ledger → "rejected-rrn-final". audit `crm-rrn-rejection-finalized`[0m
[7m[0m  docs\features\crm-sync.md:452:```[0m
[7m[0m  docs\features\crm-sync.md:453:[0m
> docs\features\crm-sync.md:454:[7m### 4.[0m3 field-level 충돌 해결 + CAS (CS3-04)[0m
[7m[0m  docs\features\crm-sync.md:455:[0m
> docs\features\crm-sync.md:456:[7m#### 4.[0m3.1 FieldAuthority — v0.3 § 4.3.1 동일[0m
[7m[0m  docs\features\crm-sync.md:457:[0m
> docs\features\crm-sync.md:458:[7m#### 4.[0m3.2 CAS WHERE 조건 (CS3-04 강화)[0m
[7m[0m  docs\features\crm-sync.md:459:[0m
[7m[0m  docs\features\crm-sync.md:460:```sql[0m
[7m[0m  docs\features\crm-sync.md:461:-- inbound: 양방향 version 모두 검사[0m
[7m[0m  docs\features\crm-sync.md:462:UPDATE crm_record[0m
[7m[0m  docs\features\crm-sync.md:463:SET display_hints_name_initial=$1, /* ... */,[0m
[7m[0m  docs\features\crm-sync.md:464:    operational_hints_department_hint=$N, /* CS3-07 */,[0m
[7m[0m  docs\features\crm-sync.md:465:    crm_version=$newCrmVersion, last_synced_at=$now[0m
[7m[0m  docs\features\crm-sync.md:466:WHERE id=$recordId AND crm_version=$expectedCrmVersion AND solution_version=$expectedSo[0m
[7m[0mlutionVersion;[0m
[7m[0m  docs\features\crm-sync.md:467:[0m
[7m[0m  docs\features\crm-sync.md:468:-- outbound: 양방향 version 모두 검사[0m
[7m[0m  docs\features\crm-sync.md:469:UPDATE crm_record[0m
[7m[0m  docs\features\crm-sync.md:470:SET solution_version=solution_version+1, crm_external_id=$crmId, last_synced_at=$now[0m
[7m[0m  docs\features\crm-sync.md:471:WHERE id=$recordId AND solution_version=$expectedSolutionVersion AND crm_version=$expec[0m
[7m[0mtedCrmVersion;[0m
[7m[0m  docs\features\crm-sync.md:472:```[0m
[7m[0m  docs\features\crm-sync.md:473:[0m
[7m[0m  docs\features\crm-sync.md:474:0 rows affected → ConflictRecord. field-level은 SELECT FOR UPDATE.[0m
[7m[0m  docs\features\crm-sync.md:475:[0m
> docs\features\crm-sync.md:476:[7m#### 4.[0m3.3 ConflictRecord — v0.3 § 4.3.3 동일[0m
[7m[0m  docs\features\crm-sync.md:477:[0m
> docs\features\crm-sync.md:478:[7m#### 4.[0m3.4 manual escalate 결정표 — v0.3 § 4.3.4 동일[0m
[7m[0m  docs\features\crm-sync.md:479:[0m
> docs\features\crm-sync.md:480:[7m#### 4.[0m3.5 expectedCrmVersion 산정 (CS3-03 — 신규)[0m
[7m[0m  docs\features\crm-sync.md:481:[0m
[7m[0m  docs\features\crm-sync.md:482:| provider | providerVersionToken 출처 | expectedCrmVersion 산정 |[0m
[7m[0m  docs\features\crm-sync.md:483:|---|---|---|[0m
[7m[0m  docs\features\crm-sync.md:484:| Salesforce Outbound Messages | XML `SystemModstamp` ISO8601 | epoch ms로 변환 |[0m
[7m[0m  docs\features\crm-sync.md:485:| Salesforce Platform Events | `replayId` integer | 직접 사용 |[0m
[7m[0m  docs\features\crm-sync.md:486:| HubSpot | `propertyChange.versionTimestamp` | epoch ms |[0m
[7m[0m  docs\features\crm-sync.md:487:| generic-rest-api | config `versionTokenJsonPath` 추출 후 type config | epoch ms 또는 [0m
[7m[0minteger (config) |[0m
[7m[0m  docs\features\crm-sync.md:488:| polling | provider별 list API의 `lastModified` 등 | 동일 |[0m
[7m[0m  docs\features\crm-sync.md:489:[0m
[7m[0m  docs\features\crm-sync.md:490:`providerVersionToken=null`인 provider는 expectedCrmVersion=현재 row.crm_version+1로 fa[0m
[7m[0mllback. 이 경우 lost update 검출 못함 — provider별 운영 위험 명시.[0m
[7m[0m  docs\features\crm-sync.md:491:[0m
> docs\features\crm-sync.md:492:[7m### 4.[0m4 retry queue (CS3-12 — search-visibility § 13.5 풀 SQL 전개)[0m
[7m[0m  docs\features\crm-sync.md:493:[0m
[7m[0m  docs\features\crm-sync.md:494:§ 13.4 schema + § 13.4.1 worker contract 풀 전개:[0m
[7m[0m  docs\features\crm-sync.md:495:1. RetryQueue claim (SKIP LOCKED)[0m
[7m[0m  docs\features\crm-sync.md:496:2. **per-integration advisory lock** (provider rate-limit 직렬화)[0m
[7m[0m  docs\features\crm-sync.md:497:3. **SourceAttempt insert** (transaction 내) — `(syncLogId, integrationId, entity, dire[0m
[7m[0mction, attemptNumber)` UNIQUE[0m
[7m[0m  docs\features\crm-sync.md:498:4. provider call[0m
[7m[0m  docs\features\crm-sync.md:499:5. **attempt finalization** — SourceAttempt status update[0m
[7m[0m  docs\features\crm-sync.md:500:6. **SyncLog.envelopeState 재계산** — `recalcEnvelope(syncLogId)` 트랜잭션 후[0m
[7m[0m  docs\features\crm-sync.md:501:7. **stale reclaim** — lockedAt > 10분 → status='pending' 복귀[0m
[7m[0m  docs\features\crm-sync.md:502:8. **exhausted 전이** — attemptNumber ≥ maxAttempts → status='exhausted' + sink alert[0m
[7m[0m  docs\features\crm-sync.md:503:9. **permanent 전이** — lastErrorClass='permanent' → status='failed-permanent' 즉시 + s[0m
[7m[0mink alert[0m
[7m[0m  docs\features\crm-sync.md:504:[0m
[7m[0m  docs\features\crm-sync.md:505:transaction 순서·advisory lock ordering 풀 SQL은 § 13.4.1.[0m
[7m[0m  docs\features\crm-sync.md:506:[0m
> docs\features\crm-sync.md:507:[7m### 4.[0m5 credential rotation 상태 머신 (CS3-01 강화)[0m
[7m[0m  docs\features\crm-sync.md:508:[0m
> docs\features\crm-sync.md:509:[7m#### 4.[0m5.1 CrmCredentialVersion entity — § 13.11[0m
[7m[0m  docs\features\crm-sync.md:510:[0m
> docs\features\crm-sync.md:511:[7m#### 4.[0m5.2 두 enum의 invariant 표 (CS3-01)[0m
[7m[0m  docs\features\crm-sync.md:512:[0m
[7m[0m  docs\features\crm-sync.md:513:**CrmIntegration.credentialState** 5상태: `stable`·`rotating`·`committed`·`grace-expire[0m
[7m[0md`·`reverted`.[0m
[7m[0m  docs\features\crm-sync.md:514:**CrmCredentialVersion.state** 6상태: `active`·`rotating-target`·`committed`·`grace-exp[0m
[7m[0mired`·`reverted`·`revoked`.[0m
[7m[0m  docs\features\crm-sync.md:515:[0m
[7m[0m  docs\features\crm-sync.md:516:| Integration state | CredentialVersion rows (per integration) | 의미 |[0m
[7m[0m  docs\features\crm-sync.md:517:|---|---|---|[0m
[7m[0m  docs\features\crm-sync.md:518:| `stable` | 1 row `state=active` (others `revoked`) | 정상. outbound/inbound 모두 acti[0m
[7m[0mve 사용 |[0m
[7m[0m  docs\features\crm-sync.md:519:| `rotating` | 1 row `state=active` (이전) + 1 row `state=rotating-target` (신규) | rot[0m
[7m[0mation 진행 중. outbound new 우선·old fallback. inbound verifier active + rotating-target 병행 |[0m
[7m[0m  docs\features\crm-sync.md:520:| `committed` | 1 row `state=committed` (이전·graceUntil 설정) + 1 row `state=active` ([0m
[7m[0m신규) | rotation 성공. outbound active만. inbound active + committed 병행 (graceUntil까지) |[0m
[7m[0m  docs\features\crm-sync.md:521:| `grace-expired` | 1 row `state=active` (others `revoked` 또는 `grace-expired`) | comm[0m
[7m[0mitted의 graceUntil 도래. outbound/inbound 모두 active만 |[0m
[7m[0m  docs\features\crm-sync.md:522:| `reverted` | 1 row `state=active` (원래) + 1 row `state=reverted` (신규 실패) | rotat[0m
[7m[0mion 실패. outbound/inbound active만 |[0m
[7m[0m  docs\features\crm-sync.md:523:[0m
[7m[0m  docs\features\crm-sync.md:524:전이:[0m
[7m[0m  docs\features\crm-sync.md:525:- `stable → rotating`: `rotateCredential` 호출. 새 CredentialVersion(state=rotating-tar[0m
[7m[0mget) insert. Integration.state="rotating"[0m
[7m[0m  docs\features\crm-sync.md:526:- `rotating → committed`: health check 성공. 신규 row state=active·이전 row state=commi[0m
[7m[0mtted·graceUntil 설정. Integration.state="committed"·currentCredentialVersionId 갱신[0m
[7m[0m  docs\features\crm-sync.md:527:- `rotating → reverted`: health check 실패. 신규 row state=reverted. Integration.state=[0m
[7m[0m"reverted". 사용자 알림[0m
[7m[0m  docs\features\crm-sync.md:528:- `committed → grace-expired`: graceUntil 도래 (background worker). 이전 row state=revo[0m
[7m[0mked. Integration.state="grace-expired"[0m
[7m[0m  docs\features\crm-sync.md:529:- `grace-expired → stable`: 다음 stable cycle (즉시 transition. 운영상 같은 의미)[0m
[7m[0m  docs\features\crm-sync.md:530:- `reverted → stable`: 운영자 확인 후 명시적 reset[0m
[7m[0m  docs\features\crm-sync.md:531:[0m
[7m[0m  docs\features\crm-sync.md:532:**rotating-revoked 잔재 제거** (CS3-01): § 4.1 step 6의 `≠ "rotating-revoked"` 표현은 [0m
[7m[0m폐기. **§ 4.5.3 사용 matrix가 SoT**.[0m
[7m[0m  docs\features\crm-sync.md:533:[0m
> docs\features\crm-sync.md:534:[7m#### 4.[0m5.3 outbound/inbound 사용 matrix[0m
[7m[0m  docs\features\crm-sync.md:535:[0m
[7m[0m  docs\features\crm-sync.md:536:| Integration state | outbound 사용 credential | inbound verifier 허용 credential |[0m
[7m[0m  docs\features\crm-sync.md:537:|---|---|---|[0m
[7m[0m  docs\features\crm-sync.md:538:| stable | active | active만 |[0m
[7m[0m  docs\features\crm-sync.md:539:| rotating | new(rotating-target) 우선·old(active) fallback | active + rotating-target [0m
[7m[0m병행 |[0m
[7m[0m  docs\features\crm-sync.md:540:| committed | active(신규) only | active + committed(이전) 병행 (graceUntil까지) |[0m
[7m[0m  docs\features\crm-sync.md:541:| grace-expired | active(신규) only | active만 |[0m
[7m[0m  docs\features\crm-sync.md:542:| reverted | active(원래) | active만 |[0m
[7m[0m  docs\features\crm-sync.md:543:[0m
> docs\features\crm-sync.md:544:[7m### 4.[0m6 outbox — search-visibility § 7.2·§ 7.3 SQL 동일[0m
[7m[0m  docs\features\crm-sync.md:545:[0m
> docs\features\crm-sync.md:546:[7m### 4.[0m7 unregister 정책 표 (CS3-09 신규)[0m
[7m[0m  docs\features\crm-sync.md:547:[0m
[7m[0m  docs\features\crm-sync.md:548:`unregisterIntegration(integrationId, options)`:[0m
[7m[0m  docs\features\crm-sync.md:549:[0m
[7m[0m  docs\features\crm-sync.md:550:| 대상 | 즉시 액션 | 보존 | FK ON DELETE |[0m
[7m[0m  docs\features\crm-sync.md:551:|---|---|---|---|[0m
[7m[0m  docs\features\crm-sync.md:552:| CrmIntegration | `active=false` (soft delete) | tombstone 보존 (legal hold) | — |[0m
[7m[0m  docs\features\crm-sync.md:553:| CrmCredentialVersion (모든 row) | state="revoked" | 보존 | RESTRICT |[0m
[7m[0m  docs\features\crm-sync.md:554:| CrmRecord.displayHints* | 즉시 nulling (option `keepDisplayHints=false` 기본) | row [0m
[7m[0m유지 | — |[0m
[7m[0m  docs\features\crm-sync.md:555:| CrmRecord.operationalHints* | row 유지 | row 유지 | — |[0m
[7m[0m  docs\features\crm-sync.md:556:| CrmRecordChangeLog | row 유지 (감사 보존) | retentionDays.changeLog | RESTRICT |[0m
[7m[0m  docs\features\crm-sync.md:557:| CrmConflictRecord (open) | resolution="manual-rejected" | retentionDays.conflictRecor[0m
[7m[0md | RESTRICT |[0m
[7m[0m  docs\features\crm-sync.md:558:| CrmSyncRetryQueue (pending/processing) | status="failed-permanent" | retentionDays.re[0m
[7m[0mtryQueueCompleted | RESTRICT |[0m
[7m[0m  docs\features\crm-sync.md:559:| CrmSyncNotificationOutbox (pending) | status="permanent" | retentionDays.notification[0m
[7m[0mOutbox | RESTRICT |[0m
[7m[0m  docs\features\crm-sync.md:560:| CrmWebhookNonceLedger | row 유지 | webhookNonceLedgerRetentionMinutes | RESTRICT |[0m
[7m[0m  docs\features\crm-sync.md:561:| CrmChangeIdentityLedger | row 유지 | retentionDays.changeLog 동일 | RESTRICT |[0m
[7m[0m  docs\features\crm-sync.md:562:| CrmConsentWithdrawalLedger | row 유지 (legal hold) | retentionDays.consentWithdrawalL[0m
[7m[0medger | RESTRICT |[0m
[7m[0m  docs\features\crm-sync.md:563:| webhook endpoint | 즉시 미등록 (HTTP 404) | — | — |[0m
[7m[0m  docs\features\crm-sync.md:564:| inbound polling | 즉시 중단 | — | — |[0m
[7m[0m  docs\features\crm-sync.md:565:[0m
[7m[0m  docs\features\crm-sync.md:566:audit metadata에 `unregisterPolicySnapshot` (options) 포함.[0m
[7m[0m  docs\features\crm-sync.md:567:[0m
> docs\features\crm-sync.md:568:[7m### 4.[0m8 consent withdrawal (CS3-05 신규)[0m
[7m[0m  docs\features\crm-sync.md:569:[0m
[7m[0m  docs\features\crm-sync.md:570:`applyConsentWithdrawal(piiHash | crmExternalId, scope: "all" | "marketing-only")`:[0m
[7m[0m  docs\features\crm-sync.md:571:[0m
[7m[0m  docs\features\crm-sync.md:572:```[0m
[7m[0m  docs\features\crm-sync.md:573:1. CrmConsentWithdrawalLedger insert — piiHash·crmExternalIdHash·scope·integrationId·ap[0m
[7m[0mpliedAt[0m
[7m[0m  docs\features\crm-sync.md:574:2. CrmRecord(s) 매칭 → displayHints* 모두 nulling. operationalHints는 보존. consentWith[0m
[7m[0mdrawn=true 설정[0m
[7m[0m  docs\features\crm-sync.md:575:3. CrmRecordChangeLog tombstone insert (changedFields = {tombstone: true})[0m
[7m[0m  docs\features\crm-sync.md:576:4. 향후 inbound webhook/polling — § 4.2 step 8에서 매칭 → "rejected-consent-withdrawn" [0m
[7m[0m처리[0m
[7m[0m  docs\features\crm-sync.md:577:5. 향후 outbound push — § 4.1 step 5에서 차단[0m
[7m[0m  docs\features\crm-sync.md:578:6. audit `crm-consent-withdrawal-applied`[0m
[7m[0m  docs\features\crm-sync.md:579:```[0m
[7m[0m  docs\features\crm-sync.md:580:[0m
[7m[0m  docs\features\crm-sync.md:581:v1.x에서 patientConsentEvidenceRef 도입 시 record-level evidence 연결 (CS-07).[0m
[7m[0m  docs\features\crm-sync.md:582:[0m
[7m[0m  docs\features\crm-sync.md:583:---[0m
[7m[0m  docs\features\crm-sync.md:584:[0m
[7m[0m  docs\features\crm-sync.md:585:## 5. provider 어댑터 (v1.0 — 3종)[0m
[7m[0m  docs\features\crm-sync.md:586:[0m
[7m[0m  docs\features\crm-sync.md:587:§ 3.4.2 adapter contract 참조. korean-emr v1.x (CS-13).[0m
[7m[0m  docs\features\crm-sync.md:588:[0m
[7m[0m  docs\features\crm-sync.md:589:### 5.1 rate limit (CrmRateLimitState — § 13.10)[0m
[7m[0m  docs\features\crm-sync.md:590:[0m
[7m[0m  docs\features\crm-sync.md:591:provider별 redis token bucket. retry-after respect.[0m
[7m[0m  docs\features\crm-sync.md:592:[0m
[7m[0m  docs\features\crm-sync.md:593:---[0m
[7m[0m  docs\features\crm-sync.md:594:[0m
[7m[0m  docs\features\crm-sync.md:595:## 6. 알림 (CS2-11)[0m
[7m[0m  docs\features\crm-sync.md:596:[0m
[7m[0m  docs\features\crm-sync.md:597:### 6.1 NotificationEventType — v0.3 동일[0m
[7m[0m  docs\features\crm-sync.md:598:[0m
[7m[0m  docs\features\crm-sync.md:599:### 6.2 outbox — search-visibility § 7.2 SQL 동일[0m
[7m[0m  docs\features\crm-sync.md:600:[0m
[7m[0m  docs\features\crm-sync.md:601:### 6.3 NotificationEvent 매핑 — v0.3 동일 (sourceId에 credentialVersionId)[0m
[7m[0m  docs\features\crm-sync.md:602:[0m
[7m[0m  docs\features\crm-sync.md:603:---[0m
> docs\features\crm-sync.md:605:[7m## 7.[0m PII 처리[0m
[7m[0m  docs\features\crm-sync.md:606:[0m
> docs\features\crm-sync.md:607:[7m### 7.[0m1 closed schema + operational hints (CS3-07)[0m
[7m[0m  docs\features\crm-sync.md:608:[0m
[7m[0m  docs\features\crm-sync.md:609:- displayHints: 6 column closed schema (§ 3.2.1)[0m
[7m[0m  docs\features\crm-sync.md:610:- operationalHints: entity별 non-PII column (§ 3.2.2)[0m
[7m[0m  docs\features\crm-sync.md:611:- changedFields/snapshot: allowlisted field token + masked value/enum[0m
[7m[0m  docs\features\crm-sync.md:612:- DB CHECK (길이·문자 클래스) + application validator (canonical) 양층[0m
[7m[0m  docs\features\crm-sync.md:613:[0m
> docs\features\crm-sync.md:614:[7m### 7.[0m2 RRN deny — v0.3 동일 + recoverRrnFalsePositive audit cascade (CS3-11)[0m
[7m[0m  docs\features\crm-sync.md:615:[0m
> docs\features\crm-sync.md:616:[7m### 7.[0m3 raw PII 실시간 조회 — v1.x (CS-14)[0m
[7m[0m  docs\features\crm-sync.md:617:[0m
> docs\features\crm-sync.md:618:[7m### 7.[0m4 DPA vs patient consent[0m
[7m[0m  docs\features\crm-sync.md:619:[0m
[7m[0m  docs\features\crm-sync.md:620:- DPA: `dpaEvidenceRef` 필수[0m
[7m[0m  docs\features\crm-sync.md:621:- consent withdrawal: § 4.8 + CrmConsentWithdrawalLedger (CS3-05 — v1.0 최소 범위)[0m
[7m[0m  docs\features\crm-sync.md:622:- patientConsentEvidenceRef record-level evidence: v1.x (CS-07)[0m
[7m[0m  docs\features\crm-sync.md:623:[0m
> docs\features\crm-sync.md:624:[7m### 7.[0m5 displayHints expiry 처리 (CS3-07)[0m
[7m[0m  docs\features\crm-sync.md:625:[0m
[7m[0m  docs\features\crm-sync.md:626:`piiRetentionExpiresAt` 도래 시:[0m
[7m[0m  docs\features\crm-sync.md:627:- displayHints 6 column 즉시 nulling (delete 아님 — row 유지)[0m
[7m[0m  docs\features\crm-sync.md:628:- operationalHints 보존[0m
[7m[0m  docs\features\crm-sync.md:629:- ChangeLog tombstone insert[0m
[7m[0m  docs\features\crm-sync.md:630:[0m
[7m[0m  docs\features\crm-sync.md:631:운영자 화면은 nulling 이후 "expired — CRM 콘솔 조회" 안내.[0m
[7m[0m  docs\features\crm-sync.md:632:[0m
[7m[0m  docs\features\crm-sync.md:633:---[0m
[7m[0m  docs\features\crm-sync.md:634:[0m
[7m[0m  docs\features\crm-sync.md:635:## 8. 운영 지표 + acceptance test traceability (CS3-15)[0m
[7m[0m  docs\features\crm-sync.md:636:[0m
[7m[0m  docs\features\crm-sync.md:637:### 8.1 핵심 지표 — v0.3 동일[0m
[7m[0m  docs\features\crm-sync.md:638:[0m
[7m[0m  docs\features\crm-sync.md:639:### 8.2 acceptance test traceability 표 (CS3-15)[0m
[7m[0m  docs\features\crm-sync.md:640:[0m
[7m[0m  docs\features\crm-sync.md:641:§ 10 build/runtime/migration/invariant fail 룰과 1:1 매핑:[0m
[7m[0m  docs\features\crm-sync.md:642:[0m
[7m[0m  docs\features\crm-sync.md:643:| AT ID | 영역 | 케이스 | 매핑 룰 |[0m
[7m[0m  docs\features\crm-sync.md:644:|---|---|---|---|[0m
[7m[0m  docs\features\crm-sync.md:645:| AT-01 | manifest | legalApproved=false | § 10.1 |[0m
[7m[0m  docs\features\crm-sync.md:646:| AT-02 | manifest | korean-emr provider | § 10.1 |[0m
[7m[0m  docs\features\crm-sync.md:647:| AT-03 | manifest | appointment enabled | § 10.1 |[0m
[7m[0m  docs\features\crm-sync.md:648:| AT-04 | manifest | rawPiiStorageAllowed=true | § 10.1 |[0m
[7m[0m  docs\features\crm-sync.md:649:| AT-05 | manifest | ssnRrnHandling≠"deny" | § 10.1 |[0m
[7m[0m  docs\features\crm-sync.md:650:| AT-06 | manifest | dpaEvidenceRef 누락 | § 10.1 |[0m
[7m[0m  docs\features\crm-sync.md:651:| AT-07 | manifest | outbound-only + 비정상 conflictResolution | § 10.1 |[0m
[7m[0m  docs\features\crm-sync.md:652:| AT-08 | manifest | generic-rest-api + genericRestApiAdapter 누락 | § 10.1 |[0m
[7m[0m  docs\features\crm-sync.md:653:| AT-09 | manifest | liveReadEnabled=true | § 10.1 |[0m
[7m[0m  docs\features\crm-sync.md:654:| AT-10 | manifest | fieldMappingPolicyVersion 누락 | § 10.1 |[0m
[7m[0m  docs\features\crm-sync.md:655:| AT-11 | webhook verifier | provider별 signature 검증 | § 10.2 |[0m
[7m[0m  docs\features\crm-sync.md:656:| AT-12 | ledger dedupe | exactly-once → duplicate-eventid | § 4.2 step 4 |[0m
[7m[0m  docs\features\crm-sync.md:657:| AT-13 | ledger dedupe | at-least-once + eventId → duplicate-eventid-bucket | § 4.2 st[0m
[7m[0mep 4 |[0m
[7m[0m  docs\features\crm-sync.md:658:| AT-14 | ledger dedupe | at-least-once no-eventId → duplicate-digest | § 4.2 step 4 |[0m
[7m[0m  docs\features\crm-sync.md:659:| AT-15 | ledger dedupe | best-effort → duplicate-digest | § 4.2 step 4 |[0m
> docs\features\crm-sync.md:701:[7m## 10.[0m 빌드·런타임·migration·invariant 검증[0m
[7m[0m  docs\features\crm-sync.md:702:[0m
> docs\features\crm-sync.md:703:[7m### 10.[0m1 build-time fail[0m
[7m[0m  docs\features\crm-sync.md:704:[0m
[7m[0m  docs\features\crm-sync.md:705:v0.3 § 10.1 + 추가:[0m
[7m[0m  docs\features\crm-sync.md:706:- `provider="generic-rest-api"` + `genericRestApiAdapter` 4필드 중 누락[0m
[7m[0m  docs\features\crm-sync.md:707:- `pii.liveReadEnabled=true`[0m
[7m[0m  docs\features\crm-sync.md:708:- mode="outbound-only" + 어느 entity `conflictResolution ≠ "outbound-only-no-conflict"`[0m
[7m[0m  docs\features\crm-sync.md:709:- mode="outbound-only" + CrmFieldMapping `direction IN (inbound, both)` 존재[0m
[7m[0m  docs\features\crm-sync.md:710:- `fieldMappingPolicyVersion` 누락[0m
[7m[0m  docs\features\crm-sync.md:711:- `retentionDays.consentWithdrawalLedger` 누락 (CS3-05)[0m
[7m[0m  docs\features\crm-sync.md:712:- `purgeWorker.cadenceMinutes` 누락 (CS3-10)[0m
[7m[0m  docs\features\crm-sync.md:713:[0m
> docs\features\crm-sync.md:714:[7m### 10.[0m2 runtime validation fail[0m
[7m[0m  docs\features\crm-sync.md:715:[0m
[7m[0m  docs\features\crm-sync.md:716:v0.3 § 10.2 + 추가:[0m
[7m[0m  docs\features\crm-sync.md:717:- **CAS WHERE 0 rows affected** (outbound·inbound 모두 양방향 version 검사 — CS3-04)[0m
[7m[0m  docs\features\crm-sync.md:718:- **CrmChangeIdentityLedger UNIQUE 충돌** (webhook + polling 중복) → 정상 dedupe (fail [0m
[7m[0m아님 — 정보 로그)[0m
[7m[0m  docs\features\crm-sync.md:719:- **applyConsentWithdrawal** 시 매칭 record 0건 → 정보 알림 (fail 아님)[0m
[7m[0m  docs\features\crm-sync.md:720:- **recoverRrnFalsePositive** invalid status (rejected-rrn-recoverable 아님) → runtime [0m
[7m[0mfail[0m
[7m[0m  docs\features\crm-sync.md:721:- **CrmCredentialVersion invariant 위반** (CS3-01 § 4.5.2 표) — 예: rotating 중 active+[0m
[7m[0mrotating-target 외 row 존재 → runtime fail + 운영자 alert[0m
[7m[0m  docs\features\crm-sync.md:722:[0m
> docs\features\crm-sync.md:723:[7m### 10.[0m3 migration-time validation[0m
[7m[0m  docs\features\crm-sync.md:724:[0m
[7m[0m  docs\features\crm-sync.md:725:- v0.4 cascade 신규:[0m
[7m[0m  docs\features\crm-sync.md:726:  - CrmRecord에 operationalHints* column 추가 (nullable)[0m
[7m[0m  docs\features\crm-sync.md:727:  - CrmChangeIdentityLedger 신설 (§ 13.13)[0m
[7m[0m  docs\features\crm-sync.md:728:  - CrmConsentWithdrawalLedger 신설 (§ 13.14)[0m
[7m[0m  docs\features\crm-sync.md:729:  - displayHintsCityName CHECK 정규식 정리[0m
[7m[0m  docs\features\crm-sync.md:730:[0m
> docs\features\crm-sync.md:731:[7m### 10.[0m4 runtime invariant·reconcile (CS3-10 강화)[0m
[7m[0m  docs\features\crm-sync.md:732:[0m
[7m[0m  docs\features\crm-sync.md:733:- CrmSyncRetryQueue stale processing (lockedAt > 10분) → reconcile[0m
[7m[0m  docs\features\crm-sync.md:734:- CrmConflictRecord open + slaDeadline 초과 → SLA 미달 알림[0m
[7m[0m  docs\features\crm-sync.md:735:- credential expiry 임박 → expiring-soon[0m
[7m[0m  docs\features\crm-sync.md:736:- credential 만료 → expired + integration 자동 비활성화[0m
[7m[0m  docs\features\crm-sync.md:737:- PII drift 감지 (CHECK 미적용 historical row) → sink alert[0m
[7m[0m  docs\features\crm-sync.md:738:- **CrmCredentialVersion grace-expired worker**: cadence 10분. graceUntil 도래 → state=[0m
[7m[0mrevoked·integration.state="grace-expired". 실패 시 sink alert + 다음 cycle 재시도 (3회 실패 시 super-admin 수동 개입 필[0m
[7m[0m요)[0m
[7m[0m  docs\features\crm-sync.md:739:- CrmWebhookNonceLedger `rejected-rrn-recoverable` 24h 무처리 → 운영자 alert[0m
[7m[0m  docs\features\crm-sync.md:740:- **purge worker SoT** (CS3-10) — Feature 내부 책임:[0m
[7m[0m  docs\features\crm-sync.md:741:  - cadence: `purgeWorker.cadenceMinutes` (기본 60분)[0m
[7m[0m  docs\features\crm-sync.md:742:  - batch size: `purgeWorker.batchSize` (기본 500)[0m
[7m[0m  docs\features\crm-sync.md:743:  - 대상 테이블·액션:[0m
[7m[0m  docs\features\crm-sync.md:744:    | 테이블 | action | legal hold |[0m
[7m[0m  docs\features\crm-sync.md:745:    |---|---|---|[0m
[7m[0m  docs\features\crm-sync.md:746:    | CrmSyncLog | delete row | × |[0m
[7m[0m  docs\features\crm-sync.md:747:    | CrmSyncSourceAttempt | delete row | × |[0m
[7m[0m  docs\features\crm-sync.md:748:    | CrmSyncRetryQueue (status=completed) | delete row | × |[0m
[7m[0m  docs\features\crm-sync.md:749:    | CrmRecordChangeLog | delete row | tombstone(=consent withdrawal) keep |[0m
[7m[0m  docs\features\crm-sync.md:750:    | CrmConflictRecord (status≠open) | delete row | × |[0m
[7m[0m  docs\features\crm-sync.md:751:    | CrmCredentialAuditLog | keep (7년 — REVIEW_WORKFLOW § 10.3 audit retention 따름) [0m
[7m[0m| hold |[0m
[7m[0m  docs\features\crm-sync.md:752:    | CrmWebhookNonceLedger | delete row | × |[0m
[7m[0m  docs\features\crm-sync.md:753:    | CrmChangeIdentityLedger | delete row (changeLog와 동일 retention) | × |[0m
[7m[0m  docs\features\crm-sync.md:754:    | CrmConsentWithdrawalLedger | **delete row만 만료 시 — legal hold default true** ([0m
[7m[0mCS3-09·10) | hold |[0m
[7m[0m  docs\features\crm-sync.md:755:    | CrmRecord.displayHints* | nulling (row 유지) | × |[0m
[7m[0m  docs\features\crm-sync.md:756:    | CrmSyncNotificationOutbox (status=sent/permanent) | delete row | × |[0m
[7m[0m  docs\features\crm-sync.md:757:  - failure reconcile: row delete 실패 → sink alert·다음 cycle 재시도[0m
[7m[0m  docs\features\crm-sync.md:758:[0m
> docs\features\crm-sync.md:759:[7m### 10.[0m5 warning[0m
[7m[0m  docs\features\crm-sync.md:760:[0m
[7m[0m  docs\features\crm-sync.md:761:v0.3 § 10.5 + 추가:[0m
[7m[0m  docs\features\crm-sync.md:762:- `providerVersionToken=null`인 provider 운영 — CAS 정확도 저하 경고[0m
[7m[0m  docs\features\crm-sync.md:763:- outbound-only + webhookSecret 설정됨 — config 정리 권고[0m
[7m[0m  docs\features\crm-sync.md:764:[0m
[7m[0m  docs\features\crm-sync.md:765:---[0m
[7m[0m  docs\features\crm-sync.md:766:[0m
[7m[0m  docs\features\crm-sync.md:767:## 11. 미결정 사항 (CS3-16)[0m
[7m[0m  docs\features\crm-sync.md:768:[0m
[7m[0m  docs\features\crm-sync.md:769:### 11.1 open[0m
[7m[0m  docs\features\crm-sync.md:770:[0m
[7m[0m  docs\features\crm-sync.md:771:| ID | 항목 | 비고 |[0m
[7m[0m  docs\features\crm-sync.md:772:|---|---|---|[0m
[7m[0m  docs\features\crm-sync.md:773:| CS-02 | 양방향 sync 충돌 SLA·escalation | 운영 |[0m
[7m[0m  docs\features\crm-sync.md:774:| CS-03 | 다중 CRM 통합 우선순위 | 운영 |[0m
[7m[0m  docs\features\crm-sync.md:775:| CS-04 | webhook endpoint 보안 (IP allowlist) | 인프라 |[0m
[7m[0m  docs\features\crm-sync.md:776:| CS-05 | OAuth refresh token rotation 자동화 | 인프라 |[0m
[7m[0m  docs\features\crm-sync.md:777:| CS-06 | provider별 quota 운영 가이드 | M2+ |[0m
[7m[0m  docs\features\crm-sync.md:778:| CS-08 | LLM 기반 field auto-mapping | v1.x |[0m
[7m[0m  docs\features\crm-sync.md:779:| CS-09 | CrmFieldMapping bulk import/export | M2+ |[0m
[7m[0m  docs\features\crm-sync.md:780:| CS-10 | webhook 실패 시 polling fallback 자동 격상 | 운영 |[0m
[7m[0m  docs\features\crm-sync.md:781:| CS-15 | CONTENT_STANDARDS submission/event cascade | v1.0은 § 3.2 canonical로 대체 |[0m
[7m[0m  docs\features\crm-sync.md:782:| CS-18 | `@provenanceCrmRecordId` 공통 메타 | v1.x |[0m
[7m[0m  docs\features\crm-sync.md:783:| CS-19 | CrmAdminRegionAllowlist 행정구역 lookup table | v1.x (CS3-08) |[0m
[7m[0m  docs\features\crm-sync.md:784:| CS-20 | `crmConsoleBaseUrl` config + deep link | v1.x (CS3-07) |[0m
[7m[0m  docs\features\crm-sync.md:785:[0m
[7m[0m  docs\features\crm-sync.md:786:### 11.2 deferred-v1.x[0m
[7m[0m  docs\features\crm-sync.md:787:[0m
[7m[0m  docs\features\crm-sync.md:788:| ID | 항목 | v1.0 영향 |[0m
[7m[0m  docs\features\crm-sync.md:789:|---|---|---|[0m
[7m[0m  docs\features\crm-sync.md:790:| CS-07 | patientConsentEvidenceRef record-level evidence | v1.0은 § 4.8 + CrmConsentWi[0m
[7m[0mthdrawalLedger 최소 범위 (CS3-05) |[0m
[7m[0m  docs\features\crm-sync.md:791:| CS-11 | CRM → Core 자동 promote | 수동 |[0m
[7m[0m  docs\features\crm-sync.md:792:| CS-12 | appointment entity | build fail로 차단 |[0m
[7m[0m  docs\features\crm-sync.md:793:| CS-13 | korean-emr provider | build fail로 차단 |[0m
[7m[0m  docs\features\crm-sync.md:794:| CS-14 | crm-live-read audit + liveReadCrmDetail | v1.0 미지원 |[0m
> docs\features\crm-sync.md:827:[7m## 13.[0m 본 Feature 내부 데이터 구조 (admin DB **15 tables** — CS3-06 정정)[0m
[7m[0m  docs\features\crm-sync.md:828:[0m
> docs\features\crm-sync.md:829:[7m### 13.[0m1 `CrmIntegration` — v0.3 동일 + `mode` 명시[0m
[7m[0m  docs\features\crm-sync.md:830:[0m
> docs\features\crm-sync.md:831:[7m### 13.[0m2 `CrmSyncLog` — v0.3 동일[0m
[7m[0m  docs\features\crm-sync.md:832:[0m
> docs\features\crm-sync.md:833:[7m### 13.[0m3 `CrmSyncSourceAttempt` — v0.3 동일[0m
[7m[0m  docs\features\crm-sync.md:834:[0m
> docs\features\crm-sync.md:835:[7m### 13.[0m4 `CrmSyncRetryQueue` — v0.3 동일[0m
[7m[0m  docs\features\crm-sync.md:836:[0m
[7m[0m  docs\features\crm-sync.md:837:#### 13.4.1 worker SoT 풀 SQL (CS3-12 — search-visibility § 13.5 패턴 9단계)[0m
[7m[0m  docs\features\crm-sync.md:838:[0m
[7m[0m  docs\features\crm-sync.md:839:```sql[0m
[7m[0m  docs\features\crm-sync.md:840:-- 1. claim[0m
[7m[0m  docs\features\crm-sync.md:841:WITH next AS ([0m
[7m[0m  docs\features\crm-sync.md:842:  SELECT id FROM crm_sync_retry_queue[0m
[7m[0m  docs\features\crm-sync.md:843:  WHERE status='pending' AND next_attempt_at <= now()[0m
[7m[0m  docs\features\crm-sync.md:844:    AND (locked_at IS NULL OR locked_at < now() - interval '10 minutes')[0m
[7m[0m  docs\features\crm-sync.md:845:  ORDER BY next_attempt_at[0m
[7m[0m  docs\features\crm-sync.md:846:  FOR UPDATE SKIP LOCKED LIMIT 1[0m
[7m[0m  docs\features\crm-sync.md:847:)[0m
[7m[0m  docs\features\crm-sync.md:848:UPDATE crm_sync_retry_queue q[0m
[7m[0m  docs\features\crm-sync.md:849:SET status='processing', locked_at=now(), locked_by=$worker, attempt_number=attempt_num[0m
[7m[0mber+1[0m
[7m[0m  docs\features\crm-sync.md:850:FROM next WHERE q.id=next.id RETURNING q.*;[0m
[7m[0m  docs\features\crm-sync.md:851:[0m
[7m[0m  docs\features\crm-sync.md:852:-- 2. per-integration advisory lock (provider rate-limit 직렬화)[0m
[7m[0m  docs\features\crm-sync.md:853:SELECT pg_advisory_xact_lock(hashtext('crm-sync:' || $integration_id));[0m
[7m[0m  docs\features\crm-sync.md:854:[0m
[7m[0m  docs\features\crm-sync.md:855:-- 3. SourceAttempt insert (transaction 내)[0m
[7m[0m  docs\features\crm-sync.md:856:INSERT INTO crm_sync_source_attempt (sync_log_id, integration_id, entity, direction, at[0m
[7m[0mtempt_number, status, started_at, expires_at)[0m
[7m[0m  docs\features\crm-sync.md:857:VALUES ($sync_log_id, $integration_id, $entity, $direction, $attempt_number, 'processin[0m
[7m[0mg', now(), now() + $retention.sourceAttempt);[0m
[7m[0m  docs\features\crm-sync.md:858:-- UNIQUE(syncLogId, integrationId, entity, direction, attemptNumber) — 중복 시 conflic[0m
[7m[0mt → race detected[0m
[7m[0m  docs\features\crm-sync.md:859:[0m
[7m[0m  docs\features\crm-sync.md:860:-- 4. provider call (외부, transaction 밖에서 호출 권장 — long-running)[0m
[7m[0m  docs\features\crm-sync.md:861:[0m
[7m[0m  docs\features\crm-sync.md:862:-- 5. attempt finalization[0m
[7m[0m  docs\features\crm-sync.md:863:UPDATE crm_sync_source_attempt[0m
[7m[0m  docs\features\crm-sync.md:864:SET status=$status, completed_at=now(), error=$error, error_class=$error_class,[0m
[7m[0m  docs\features\crm-sync.md:865:    records_inbound=$ri, records_outbound=$ro, conflicts_detected=$cd[0m
[7m[0m  docs\features\crm-sync.md:866:WHERE sync_log_id=$sync_log_id AND integration_id=$integration_id AND entity=$entity AN[0m
[7m[0mD direction=$direction AND attempt_number=$attempt_number;[0m
[7m[0m  docs\features\crm-sync.md:867:[0m
[7m[0m  docs\features\crm-sync.md:868:-- 6. SyncLog.envelopeState 재계산[0m
[7m[0m  docs\features\crm-sync.md:869:WITH agg AS ([0m
[7m[0m  docs\features\crm-sync.md:870:  SELECT[0m
> docs\features\crm-sync.md:903:[7m### 13.[0m5 `CrmRecord` (CS3-07 — operational hints 추가)[0m
[7m[0m  docs\features\crm-sync.md:904:[0m
[7m[0m  docs\features\crm-sync.md:905:v0.3 § 13.5 column + 추가:[0m
[7m[0m  docs\features\crm-sync.md:906:[0m
[7m[0m  docs\features\crm-sync.md:907:| 필드 | 타입 | required |[0m
[7m[0m  docs\features\crm-sync.md:908:|---|---|:---:|[0m
[7m[0m  docs\features\crm-sync.md:909:| (v0.3 column 모두) | | |[0m
[7m[0m  docs\features\crm-sync.md:910:| **`operationalHintsEntityStatus`** | varchar(32) | optional |[0m
[7m[0m  docs\features\crm-sync.md:911:| **`operationalHintsDepartmentHint`** | varchar(32) | optional |[0m
[7m[0m  docs\features\crm-sync.md:912:| **`operationalHintsLocationKey`** | varchar(32) | optional |[0m
[7m[0m  docs\features\crm-sync.md:913:| **`operationalHintsChannelType`** | varchar(32) | optional |[0m
[7m[0m  docs\features\crm-sync.md:914:| **`operationalHintsInquiryType`** | varchar(32) | optional |[0m
[7m[0m  docs\features\crm-sync.md:915:| **`operationalHintsDesiredVisitDate`** | Date | optional |[0m
[7m[0m  docs\features\crm-sync.md:916:| **`operationalHintsGuardianInvolved`** | boolean | optional |[0m
[7m[0m  docs\features\crm-sync.md:917:| **`operationalHintsRelationToInstitution`** | varchar(32) | optional |[0m
[7m[0m  docs\features\crm-sync.md:918:| **`operationalHintsPreferredChannelType`** | varchar(32) | optional |[0m
[7m[0m  docs\features\crm-sync.md:919:| **`consentWithdrawn`** | boolean | ✅ default false |[0m
[7m[0m  docs\features\crm-sync.md:920:[0m
[7m[0m  docs\features\crm-sync.md:921:**Index 추가**: `(consentWithdrawn) WHERE consentWithdrawn=true` (partial).[0m
[7m[0m  docs\features\crm-sync.md:922:[0m
> docs\features\crm-sync.md:923:[7m### 13.[0m6 `CrmRecordChangeLog` — v0.3 동일 + tombstone 케이스(consent withdrawal)는 chan[0m
[7m[0mgedFields에 `{tombstone: true}` 허용[0m
[7m[0m  docs\features\crm-sync.md:924:[0m
> docs\features\crm-sync.md:925:[7m### 13.[0m7 `CrmFieldMapping` — v0.3 동일[0m
[7m[0m  docs\features\crm-sync.md:926:[0m
> docs\features\crm-sync.md:927:[7m### 13.[0m8 `CrmConflictRecord` — v0.3 동일[0m
[7m[0m  docs\features\crm-sync.md:928:[0m
> docs\features\crm-sync.md:929:[7m### 13.[0m9 `CrmCredentialAuditLog` — v0.3 동일[0m
[7m[0m  docs\features\crm-sync.md:930:[0m
> docs\features\crm-sync.md:931:[7m### 13.[0m10 `CrmRateLimitState` — v0.3 동일[0m
[7m[0m  docs\features\crm-sync.md:932:[0m
> docs\features\crm-sync.md:933:[7m### 13.[0m11 `CrmCredentialVersion` — v0.3 동일[0m
[7m[0m  docs\features\crm-sync.md:934:[0m
> docs\features\crm-sync.md:935:[7m### 13.[0m12 `CrmWebhookNonceLedger` (CS3-02 — deliveryKind별 partial unique 재설계)[0m
[7m[0m  docs\features\crm-sync.md:936:[0m
[7m[0m  docs\features\crm-sync.md:937:v0.3 schema + Constraints 재정의:[0m
[7m[0m  docs\features\crm-sync.md:938:[0m
[7m[0m  docs\features\crm-sync.md:939:**Constraints**:[0m
[7m[0m  docs\features\crm-sync.md:940:- `UNIQUE(integrationId, providerEventId) WHERE providerEventId IS NOT NULL AND deliver[0m
[7m[0myKind='exactly-once'`[0m
[7m[0m  docs\features\crm-sync.md:941:- `UNIQUE(integrationId, providerEventId, receivedBucket) WHERE providerEventId IS NOT [0m
[7m[0mNULL AND deliveryKind='at-least-once'`[0m
[7m[0m  docs\features\crm-sync.md:942:- `UNIQUE(integrationId, canonicalDigest, receivedBucket) WHERE providerEventId IS NULL[0m
[7m[0m OR deliveryKind='best-effort'`[0m
[7m[0m  docs\features\crm-sync.md:943:[0m
> docs\features\crm-sync.md:944:[7m### 13.[0m13 `CrmChangeIdentityLedger` (CS3-04 신규)[0m
[7m[0m  docs\features\crm-sync.md:945:[0m
[7m[0m  docs\features\crm-sync.md:946:webhook + polling 동일 변경 idempotency 보장.[0m
[7m[0m  docs\features\crm-sync.md:947:[0m
[7m[0m  docs\features\crm-sync.md:948:| 필드 | 타입 | required |[0m
[7m[0m  docs\features\crm-sync.md:949:|---|---|:---:|[0m
[7m[0m  docs\features\crm-sync.md:950:| `id` | UUID | ✅ |[0m
[7m[0m  docs\features\crm-sync.md:951:| `integrationId` | UUID | ✅ — FK |[0m
[7m[0m  docs\features\crm-sync.md:952:| `entity` | enum | ✅ |[0m
[7m[0m  docs\features\crm-sync.md:953:| `crmExternalId` | string | ✅ |[0m
[7m[0m  docs\features\crm-sync.md:954:| `providerVersionToken` | string | optional (null인 provider는 본 ledger 미사용) |[0m
[7m[0m  docs\features\crm-sync.md:955:| `changeIdentityKey` | char(64) | ✅ — § 3.4.4 HMAC |[0m
[7m[0m  docs\features\crm-sync.md:956:| `source` | enum (`webhook`·`polling`) | ✅ |[0m
[7m[0m  docs\features\crm-sync.md:957:| `receivedAt` | Date | ✅ |[0m
[7m[0m  docs\features\crm-sync.md:958:| `processedSyncLogId` | UUID | optional |[0m
[7m[0m  docs\features\crm-sync.md:959:| `expiresAt` | Date | ✅ — retentionDays.changeLog 동일 |[0m
[7m[0m  docs\features\crm-sync.md:960:[0m
[7m[0m  docs\features\crm-sync.md:961:**Constraints**: `UNIQUE(changeIdentityKey)`. `FK integrationId`.[0m
[7m[0m  docs\features\crm-sync.md:962:**Index**: `(integrationId, entity, crmExternalId, receivedAt DESC)`, `(expiresAt)`.[0m
[7m[0m  docs\features\crm-sync.md:963:[0m
[7m[0m  docs\features\crm-sync.md:964:`providerVersionToken=null`인 provider는 본 ledger insert skip → webhook/polling 중복 [0m
[7m[0m처리 가능 (운영 경고 § 10.5).[0m
[7m[0m  docs\features\crm-sync.md:965:[0m
> docs\features\crm-sync.md:966:[7m### 13.[0m14 `CrmConsentWithdrawalLedger` (CS3-05 신규)[0m
[7m[0m  docs\features\crm-sync.md:967:[0m
[7m[0m  docs\features\crm-sync.md:968:| 필드 | 타입 | required |[0m
[7m[0m  docs\features\crm-sync.md:969:|---|---|:---:|[0m
[7m[0m  docs\features\crm-sync.md:970:| `id` | UUID | ✅ |[0m
[7m[0m  docs\features\crm-sync.md:971:| `integrationId` | UUID | ✅ — FK |[0m
[7m[0m  docs\features\crm-sync.md:972:| `piiHash` | char(64) | optional (matching key 둘 중 하나 ✅) |[0m
[7m[0m  docs\features\crm-sync.md:973:| `crmExternalIdHash` | char(64) | optional (matching key 둘 중 하나 ✅) |[0m
[7m[0m  docs\features\crm-sync.md:974:| `scope` | enum (`all`·`marketing-only`) | ✅ |[0m
[7m[0m  docs\features\crm-sync.md:975:| `appliedBy` | string | ✅ — super-admin |[0m
[7m[0m  docs\features\crm-sync.md:976:| `appliedAt` | Date | ✅ |[0m
[7m[0m  docs\features\crm-sync.md:977:| `displayHintsNulled` | boolean | ✅ |[0m
[7m[0m  docs\features\crm-sync.md:978:| `tombstoneChangeLogId` | UUID | optional |[0m
[7m[0m  docs\features\crm-sync.md:979:| `legalHold` | boolean | ✅ default true (CS3-09 — unregister 시 보존) |[0m
[7m[0m  docs\features\crm-sync.md:980:| `expiresAt` | Date | optional — legalHold=true 시 null |[0m
[7m[0m  docs\features\crm-sync.md:981:[0m
[7m[0m  docs\features\crm-sync.md:982:**Constraints**: `FK integrationId`. 응용 단위 unique: `(integrationId, piiHash | crmEx[0m
[7m[0mternalIdHash, scope)` 중복 시 정보 알림.[0m
[7m[0m  docs\features\crm-sync.md:983:**Index**: `(integrationId, piiHash) WHERE piiHash IS NOT NULL`, `(integrationId, crmEx[0m
[7m[0mternalIdHash) WHERE crmExternalIdHash IS NOT NULL`, `(expiresAt) WHERE legalHold=false`.[0m
[7m[0m  docs\features\crm-sync.md:984:[0m
> docs\features\crm-sync.md:985:[7m### 13.[0m15 `CrmSyncNotificationOutbox` — v0.3 § 13.13 동일[0m
[7m[0m  docs\features\crm-sync.md:986:[0m
[7m[0m  docs\features\crm-sync.md:987:---[0m
[7m[0m  docs\features\crm-sync.md:988:[0m
[7m[0m  docs\features\crm-sync.md:989:**총 15개 admin DB 테이블** — 각 절 = 1 테이블:[0m
[7m[0m  docs\features\crm-sync.md:990:[0m
[7m[0m  docs\features\crm-sync.md:991:| § | 테이블 | retention 정책 |[0m
[7m[0m  docs\features\crm-sync.md:992:|---|---|---|[0m
[7m[0m  docs\features\crm-sync.md:993:| 13.1 | `CrmIntegration` | active=false soft delete + legal hold |[0m
[7m[0m  docs\features\crm-sync.md:994:| 13.2 | `CrmSyncLog` | retentionDays.syncLog |[0m
[7m[0m  docs\features\crm-sync.md:995:| 13.3 | `CrmSyncSourceAttempt` | retentionDays.sourceAttempt |[0m
[7m[0m  docs\features\crm-sync.md:996:| 13.4 | `CrmSyncRetryQueue` | retentionDays.retryQueueCompleted |[0m
[7m[0m  docs\features\crm-sync.md:997:| 13.5 | `CrmRecord` | displayHintsRetentionDays (nulling) |[0m
[7m[0m  docs\features\crm-sync.md:998:| 13.6 | `CrmRecordChangeLog` | retentionDays.changeLog (tombstone 예외) |[0m
[7m[0m  docs\features\crm-sync.md:999:| 13.7 | `CrmFieldMapping` | active=false soft delete |[0m
[7m[0m  docs\features\crm-sync.md:1000:| 13.8 | `CrmConflictRecord` | retentionDays.conflictRecord (non-open만) |[0m
[7m[0m  docs\features\crm-sync.md:1001:| 13.9 | `CrmCredentialAuditLog` | audit retention 7년 (REVIEW_WORKFLOW § 10.3) |[0m
[7m[0m  docs\features\crm-sync.md:1002:| 13.10 | `CrmRateLimitState` | 운영 데이터 (즉시 갱신) |[0m
[7m[0m  docs\features\crm-sync.md:1003:| 13.11 | `CrmCredentialVersion` | state=revoked 후 audit retention |[0m
[7m[0m  docs\features\crm-sync.md:1004:| 13.12 | `CrmWebhookNonceLedger` | webhookNonceLedgerRetentionMinutes |[0m
[7m[0m  docs\features\crm-sync.md:1005:| 13.13 | `CrmChangeIdentityLedger` | retentionDays.changeLog 동일 |[0m
[7m[0m  docs\features\crm-sync.md:1006:| 13.14 | `CrmConsentWithdrawalLedger` | legal hold default — retentionDays.consentWit[0m
[7m[0mhdrawalLedger (legalHold=false 시) |[0m
[7m[0m  docs\features\crm-sync.md:1007:| 13.15 | `CrmSyncNotificationOutbox` | retentionDays.notificationOutbox |[0m


 succeeded in 781ms:

  docs\features\crm-sync.md:50:| **displayHints column 제거·타입 변경** (CS3-14) | **MAJOR** | policyVersion 신규 | DB 
migration 필수 |
  docs\features\crm-sync.md:51:| **non-PII operational column 추가** (CS3-14) | **MINOR** | 별개 | column nullable + 운
영자 화면 점진 노출 |
> docs\features\crm-sync.md:52:| **[7mCrmCredentialVersion[0m.state enum 추가** (CS3-14) | **MINOR** | 별개 | 신규 상태는 bac[0m
[7m[0mkward-compatible transition rule + 기존 worker 무영향 |[0m
[7m[0m  docs\features\crm-sync.md:53:| **CredentialVersion.state enum 제거·이름 변경** | **MAJOR** | policyVersion 신규 | mig[0m
[7m[0mration |[0m
[7m[0m  docs\features\crm-sync.md:54:| **DB table 추가** (CS3-14) | **MINOR** | 별개 | migration + invariant 표 추가. 기존 in[0m
[7m[0mvariant 무영향 |[0m
[7m[0m  docs\features\crm-sync.md:55:| **DB table 제거·rename** | **MAJOR** | policyVersion 신규 | migration |[0m
[7m[0m  docs\features\crm-sync.md:56:[0m
  docs\features\crm-sync.md:172:        retryQueueCompleted: 30
  docs\features\crm-sync.md:173:        notificationOutbox: 30
> docs\features\crm-sync.md:174:        [7mconsentWithdrawalLedger[0m: 1095                   # CS3-05[0m
[7m[0m  docs\features\crm-sync.md:175:      webhookNonceLedgerRetentionMinutes: 360[0m
[7m[0m  docs\features\crm-sync.md:176:      purgeWorker:                                       # CS3-10[0m
[7m[0m  docs\features\crm-sync.md:177:        cadenceMinutes: 60[0m
[7m[0m  docs\features\crm-sync.md:178:        batchSize: 500[0m
  docs\features\crm-sync.md:194:| 실행 | `resolveConflict` | 충돌 해결 | operator·super-admin | 허용 | 호출 불가 |
  docs\features\crm-sync.md:195:| 실행 | `recoverRrnFalsePositive(ledgerId, action)` | RRN 복구 | super-admin | 허용 | 
허용 |
> docs\features\crm-sync.md:196:| 실행 | `[7mapplyConsentWithdrawal[0m(piiHash \| crmExternalId, scope)` | 환자 동의 철회 (CS[0m
[7m[0m3-05) | super-admin | 허용 | 허용 |[0m
[7m[0m  docs\features\crm-sync.md:197:| read | `queryCrmRecords` | displayHints + non-PII operational hints | operator·super-[0m
[7m[0madmin·legal-reviewer | 허용 | 허용 |[0m
[7m[0m  docs\features\crm-sync.md:198:| read | `queryConflicts` | 충돌 큐 | operator·super-admin | 허용 | 빈 결과 |[0m
[7m[0m  docs\features\crm-sync.md:199:| 운영 | `registerIntegration` | | super-admin | 허용 | 허용 |[0m
> docs\features\crm-sync.md:200:| 운영 | `[7munregister[0mIntegration` | § 4.7 unregister 정책 | super-admin | 허용 | 허용 |[0m
[7m[0m  docs\features\crm-sync.md:201:| 운영 | `rotateCredential` | rotation § 4.5 | super-admin | 허용 | 허용 |[0m
[7m[0m  docs\features\crm-sync.md:202:[0m
[7m[0m  docs\features\crm-sync.md:203:**v1.0 미제공**: `liveReadCrmDetail` (CS-14 v1.x).[0m
[7m[0m  docs\features\crm-sync.md:204:[0m
  docs\features\crm-sync.md:208:|---|---|---|---|
  docs\features\crm-sync.md:209:| `crm-integration-registered` | `"crm-integration:" + integrationId` | provider·apiUrl
·legalApprovedBy·dpaEvidenceRefHash | super-admin |
> docs\features\crm-sync.md:210:| `crm-integration-[7munregister[0med` | `"crm-integration:" + integrationId` | activeBefore·[0m
[7m[0mactiveAfter·unregisteredBy·unregisterPolicySnapshot (§ 4.7) | super-admin |[0m
[7m[0m  docs\features\crm-sync.md:211:| `crm-sync-conflict-resolved` | `"crm-conflict:" + conflictId` | resolution·winningSid[0m
[7m[0me·resolvedBy·entityType·fieldPath·appliedFieldVersion | operator·super-admin |[0m
[7m[0m  docs\features\crm-sync.md:212:| `crm-credential-rotated` | `"crm-integration:" + integrationId` | rotatedBy·priorCred[0m
[7m[0mentialFingerprint·newCredentialFingerprint·rotationAttemptId | super-admin |[0m
[7m[0m  docs\features\crm-sync.md:213:| **`crm-rrn-false-positive-recovered`** | `"crm-ledger:" + ledgerId` | priorStatus·fin[0m
[7m[0malStatus·rrnFingerprint[0:4]·actorRole·crmExternalId (있을 시) | super-admin |[0m
[7m[0m  docs\features\crm-sync.md:214:| **`crm-rrn-rejection-finalized`** | `"crm-ledger:" + ledgerId` | priorStatus·finalSta[0m
[7m[0mtus="rejected-rrn-final"·actorRole | super-admin |[0m
  docs\features\crm-sync.md:382:  providerVersionToken: string | null;
  docs\features\crm-sync.md:383:  // CAS expected version 도출
> docs\features\crm-sync.md:384:  [7mexpectedCrmVersion[0m: number;                           // 산정 규칙은 § 4.3.5[0m
[7m[0m  docs\features\crm-sync.md:385:};[0m
[7m[0m  docs\features\crm-sync.md:386:```[0m
[7m[0m  docs\features\crm-sync.md:387:[0m
[7m[0m  docs\features\crm-sync.md:388:**polling 경로의 idempotency (CS3-04)**:[0m
> docs\features\crm-sync.md:389:- polling이 가져온 record도 동일 `parsedPayload.crmExternalId + providerVersionToken` 
기반의 `Crm[7mChangeIdentityLedger[0m`(§ 13.13)에 unique 키로 통과 — webhook과 polling이 같은 변경을 중복 처리하지 않음[0m
[7m[0m  docs\features\crm-sync.md:390:[0m
[7m[0m  docs\features\crm-sync.md:391:### 3.4.4 CRM 측 changeIdentityKey 산정[0m
[7m[0m  docs\features\crm-sync.md:392:[0m
[7m[0m  docs\features\crm-sync.md:393:```[0m
  docs\features\crm-sync.md:408:3. PII Redaction Validator (closed-schema + operational hints 통과 검증)
  docs\features\crm-sync.md:409:4. RRN 검사 — 검출 시 push 차단 + 운영자 alert + ledger
> docs\features\crm-sync.md:410:5. **consent withdrawal 체크** (CS3-05) — `Crm[7mConsentWithdrawalLedger[0m`에서 piiHash 또는[0m
[7m[0m crmExternalId 매칭 → push 차단[0m
[7m[0m  docs\features\crm-sync.md:411:6. credential state 검사 (§ 4.5.3 사용 matrix)[0m
[7m[0m  docs\features\crm-sync.md:412:7. rate limit token 획득[0m
[7m[0m  docs\features\crm-sync.md:413:8. CRM API call (idempotency-key)[0m
[7m[0m  docs\features\crm-sync.md:414:9. CrmRecord 갱신 — **CAS WHERE 양방향 version 모두 검사 (CS3-04)**:[0m
  docs\features\crm-sync.md:435:8. **consent withdrawal 체크** (CS3-05) — 매칭 시 ledger `accepted-processed` 대신 → st
atus="rejected-consent-withdrawn" + displayHints nulling 유지
  docs\features\crm-sync.md:436:9. **closed-schema validator** — 위반 시 ledger `rejected-parse-recoverable` 후 reject
> docs\features\crm-sync.md:437:10. **changeIdentityKey 생성 후 Crm[7mChangeIdentityLedger[0m insert** (CS3-04) — UNIQUE 충돌[0m
[7m[0m 시 duplicate → 즉시 종료 (polling과의 idempotency)[0m
[7m[0m  docs\features\crm-sync.md:438:11. CrmRecord field-level CAS 갱신 (§ 4.3)[0m
[7m[0m  docs\features\crm-sync.md:439:12. ledger `accepted-processed` 갱신 → HTTP 200 accepted[0m
[7m[0m  docs\features\crm-sync.md:440:```[0m
[7m[0m  docs\features\crm-sync.md:441:[0m
  docs\features\crm-sync.md:464:    operational_hints_department_hint=$N, /* CS3-07 */,
  docs\features\crm-sync.md:465:    crm_version=$newCrmVersion, last_synced_at=$now
> docs\features\crm-sync.md:466:WHERE id=$recordId AND crm_version=$[7mexpectedCrmVersion[0m AND solution_version=$expectedSo[0m
[7m[0mlutionVersion;[0m
[7m[0m  docs\features\crm-sync.md:467:[0m
[7m[0m  docs\features\crm-sync.md:468:-- outbound: 양방향 version 모두 검사[0m
[7m[0m  docs\features\crm-sync.md:469:UPDATE crm_record[0m
[7m[0m  docs\features\crm-sync.md:470:SET solution_version=solution_version+1, crm_external_id=$crmId, last_synced_at=$now[0m
> docs\features\crm-sync.md:471:WHERE id=$recordId AND solution_version=$expectedSolutionVersion AND crm_version=$[7mexpec[0m
[7mtedCrmVersion[0m;[0m
[7m[0m  docs\features\crm-sync.md:472:```[0m
[7m[0m  docs\features\crm-sync.md:473:[0m
[7m[0m  docs\features\crm-sync.md:474:0 rows affected → ConflictRecord. field-level은 SELECT FOR UPDATE.[0m
[7m[0m  docs\features\crm-sync.md:475:[0m
  docs\features\crm-sync.md:478:#### 4.3.4 manual escalate 결정표 — v0.3 § 4.3.4 동일
  docs\features\crm-sync.md:479:
> docs\features\crm-sync.md:480:#### 4.3.5 [7mexpectedCrmVersion[0m 산정 (CS3-03 — 신규)[0m
[7m[0m  docs\features\crm-sync.md:481:[0m
> docs\features\crm-sync.md:482:| provider | providerVersionToken 출처 | [7mexpectedCrmVersion[0m 산정 |[0m
[7m[0m  docs\features\crm-sync.md:483:|---|---|---|[0m
[7m[0m  docs\features\crm-sync.md:484:| Salesforce Outbound Messages | XML `SystemModstamp` ISO8601 | epoch ms로 변환 |[0m
[7m[0m  docs\features\crm-sync.md:485:| Salesforce Platform Events | `replayId` integer | 직접 사용 |[0m
[7m[0m  docs\features\crm-sync.md:486:| HubSpot | `propertyChange.versionTimestamp` | epoch ms |[0m
  docs\features\crm-sync.md:488:| polling | provider별 list API의 `lastModified` 등 | 동일 |
  docs\features\crm-sync.md:489:
> docs\features\crm-sync.md:490:`providerVersionToken=null`인 provider는 [7mexpectedCrmVersion[0m=현재 row.crm_version+1로 fa[0m
[7m[0mllback. 이 경우 lost update 검출 못함 — provider별 운영 위험 명시.[0m
[7m[0m  docs\features\crm-sync.md:491:[0m
[7m[0m  docs\features\crm-sync.md:492:### 4.4 retry queue (CS3-12 — search-visibility § 13.5 풀 SQL 전개)[0m
[7m[0m  docs\features\crm-sync.md:493:[0m
[7m[0m  docs\features\crm-sync.md:494:§ 13.4 schema + § 13.4.1 worker contract 풀 전개:[0m
  docs\features\crm-sync.md:507:### 4.5 credential rotation 상태 머신 (CS3-01 강화)
  docs\features\crm-sync.md:508:
> docs\features\crm-sync.md:509:#### 4.5.1 [7mCrmCredentialVersion[0m entity — § 13.11[0m
[7m[0m  docs\features\crm-sync.md:510:[0m
[7m[0m  docs\features\crm-sync.md:511:#### 4.5.2 두 enum의 invariant 표 (CS3-01)[0m
[7m[0m  docs\features\crm-sync.md:512:[0m
> docs\features\crm-sync.md:513:**[7mCrmIntegration.credentialState[0m** 5상태: `stable`·`rotating`·`committed`·`grace-expire[0m
[7m[0md`·`reverted`.[0m
> docs\features\crm-sync.md:514:**[7mCrmCredentialVersion[0m.state** 6상태: `active`·`rotating-target`·`committed`·`grace-exp[0m
[7m[0mired`·`reverted`·`revoked`.[0m
[7m[0m  docs\features\crm-sync.md:515:[0m
[7m[0m  docs\features\crm-sync.md:516:| Integration state | CredentialVersion rows (per integration) | 의미 |[0m
[7m[0m  docs\features\crm-sync.md:517:|---|---|---|[0m
> docs\features\crm-sync.md:518:| `[7mstable[0m` | 1 row `state=active` (others `revoked`) | 정상. outbound/inbound 모두 acti[0m
[7m[0mve 사용 |[0m
> docs\features\crm-sync.md:519:| `[7mrotating[0m` | 1 row `state=active` (이전) + 1 row `state=rotating-target` (신규) | rot[0m
[7m[0mation 진행 중. outbound new 우선·old fallback. inbound verifier active + rotating-target 병행 |[0m
[7m[0m  docs\features\crm-sync.md:520:| `committed` | 1 row `state=committed` (이전·graceUntil 설정) + 1 row `state=active` ([0m
[7m[0m신규) | rotation 성공. outbound active만. inbound active + committed 병행 (graceUntil까지) |[0m
[7m[0m  docs\features\crm-sync.md:521:| `grace-expired` | 1 row `state=active` (others `revoked` 또는 `grace-expired`) | comm[0m
[7m[0mitted의 graceUntil 도래. outbound/inbound 모두 active만 |[0m
> docs\features\crm-sync.md:522:| `[7mreverted[0m` | 1 row `state=active` (원래) + 1 row `state=reverted` (신규 실패) | rotat[0m
[7m[0mion 실패. outbound/inbound active만 |[0m
[7m[0m  docs\features\crm-sync.md:523:[0m
[7m[0m  docs\features\crm-sync.md:524:전이:[0m
> docs\features\crm-sync.md:525:- `[7mstable[0m → rotating`: `rotateCredential` 호출. 새 CredentialVersion(state=rotating-tar[0m
[7m[0mget) insert. Integration.state="rotating"[0m
> docs\features\crm-sync.md:526:- `[7mrotating[0m → committed`: health check 성공. 신규 row state=active·이전 row state=commi[0m
[7m[0mtted·graceUntil 설정. Integration.state="committed"·currentCredentialVersionId 갱신[0m
> docs\features\crm-sync.md:527:- `[7mrotating[0m → reverted`: health check 실패. 신규 row state=reverted. Integration.state=[0m
[7m[0m"reverted". 사용자 알림[0m
[7m[0m  docs\features\crm-sync.md:528:- `committed → grace-expired`: graceUntil 도래 (background worker). 이전 row state=revo[0m
[7m[0mked. Integration.state="grace-expired"[0m
> docs\features\crm-sync.md:529:- `grace-expired → [7mstable[0m`: 다음 stable cycle (즉시 transition. 운영상 같은 의미)
> docs\features\crm-sync.md:530:- `[7mreverted[0m → stable`: 운영자 확인 후 명시적 reset[0m
[7m[0m  docs\features\crm-sync.md:531:[0m
> docs\features\crm-sync.md:532:**[7mrotating[0m-revoked 잔재 제거** (CS3-01): § 4.1 step 6의 `≠ "rotating-revoked"` 표현은 [0m
[7m[0m폐기. **§ 4.5.3 사용 matrix가 SoT**.[0m
[7m[0m  docs\features\crm-sync.md:533:[0m
[7m[0m  docs\features\crm-sync.md:534:#### 4.5.3 outbound/inbound 사용 matrix[0m
[7m[0m  docs\features\crm-sync.md:535:[0m
[7m[0m  docs\features\crm-sync.md:536:| Integration state | outbound 사용 credential | inbound verifier 허용 credential |[0m
  docs\features\crm-sync.md:537:|---|---|---|
> docs\features\crm-sync.md:538:| [7mstable[0m | active | active만 |[0m
> docs\features\crm-sync.md:539:| [7mrotating[0m | new(rotating-target) 우선·old(active) fallback | active + rotating-target [0m
[7m[0m병행 |[0m
[7m[0m  docs\features\crm-sync.md:540:| committed | active(신규) only | active + committed(이전) 병행 (graceUntil까지) |[0m
[7m[0m  docs\features\crm-sync.md:541:| grace-expired | active(신규) only | active만 |[0m
> docs\features\crm-sync.md:542:| [7mreverted[0m | active(원래) | active만 |[0m
[7m[0m  docs\features\crm-sync.md:543:[0m
[7m[0m  docs\features\crm-sync.md:544:### 4.6 outbox — search-visibility § 7.2·§ 7.3 SQL 동일[0m
[7m[0m  docs\features\crm-sync.md:545:[0m
> docs\features\crm-sync.md:546:### 4.7 [7munregister[0m 정책 표 (CS3-09 신규)[0m
[7m[0m  docs\features\crm-sync.md:547:[0m
> docs\features\crm-sync.md:548:`[7munregister[0mIntegration(integrationId, options)`:[0m
[7m[0m  docs\features\crm-sync.md:549:[0m
> docs\features\crm-sync.md:550:| 대상 | 즉시 액션 | 보존 | [7mFK[0m ON DELETE |[0m
[7m[0m  docs\features\crm-sync.md:551:|---|---|---|---|[0m
[7m[0m  docs\features\crm-sync.md:552:| CrmIntegration | `active=false` (soft delete) | tombstone 보존 (legal hold) | — |[0m
> docs\features\crm-sync.md:553:| [7mCrmCredentialVersion[0m (모든 row) | state="revoked" | 보존 | RESTRICT |[0m
[7m[0m  docs\features\crm-sync.md:554:| CrmRecord.displayHints* | 즉시 nulling (option `keepDisplayHints=false` 기본) | row [0m
[7m[0m유지 | — |[0m
[7m[0m  docs\features\crm-sync.md:555:| CrmRecord.operationalHints* | row 유지 | row 유지 | — |[0m
[7m[0m  docs\features\crm-sync.md:556:| CrmRecordChangeLog | row 유지 (감사 보존) | retentionDays.changeLog | RESTRICT |[0m
[7m[0m  docs\features\crm-sync.md:557:| CrmConflictRecord (open) | resolution="manual-rejected" | retentionDays.conflictRecor[0m
[7m[0md | RESTRICT |[0m
  docs\features\crm-sync.md:559:| CrmSyncNotificationOutbox (pending) | status="permanent" | retentionDays.notification
Outbox | RESTRICT |
  docs\features\crm-sync.md:560:| CrmWebhookNonceLedger | row 유지 | webhookNonceLedgerRetentionMinutes | RESTRICT |
> docs\features\crm-sync.md:561:| Crm[7mChangeIdentityLedger[0m | row 유지 | retentionDays.changeLog 동일 | RESTRICT |[0m
> docs\features\crm-sync.md:562:| Crm[7mConsentWithdrawalLedger[0m | row 유지 (legal hold) | retentionDays.consentWithdrawalL[0m
[7m[0medger | RESTRICT |[0m
[7m[0m  docs\features\crm-sync.md:563:| webhook endpoint | 즉시 미등록 (HTTP 404) | — | — |[0m
[7m[0m  docs\features\crm-sync.md:564:| inbound polling | 즉시 중단 | — | — |[0m
[7m[0m  docs\features\crm-sync.md:565:[0m
> docs\features\crm-sync.md:566:audit metadata에 `[7munregister[0mPolicySnapshot` (options) 포함.[0m
[7m[0m  docs\features\crm-sync.md:567:[0m
[7m[0m  docs\features\crm-sync.md:568:### 4.8 consent withdrawal (CS3-05 신규)[0m
[7m[0m  docs\features\crm-sync.md:569:[0m
> docs\features\crm-sync.md:570:`[7mapplyConsentWithdrawal[0m(piiHash | crmExternalId, scope: "all" | "marketing-only")`:[0m
[7m[0m  docs\features\crm-sync.md:571:[0m
[7m[0m  docs\features\crm-sync.md:572:```[0m
> docs\features\crm-sync.md:573:1. Crm[7mConsentWithdrawalLedger[0m insert — piiHash·crmExternalIdHash·scope·integrationId·ap[0m
[7m[0mpliedAt[0m
[7m[0m  docs\features\crm-sync.md:574:2. CrmRecord(s) 매칭 → displayHints* 모두 nulling. operationalHints는 보존. consentWith[0m
[7m[0mdrawn=true 설정[0m
[7m[0m  docs\features\crm-sync.md:575:3. CrmRecordChangeLog tombstone insert (changedFields = {tombstone: true})[0m
[7m[0m  docs\features\crm-sync.md:576:4. 향후 inbound webhook/polling — § 4.2 step 8에서 매칭 → "rejected-consent-withdrawn" [0m
[7m[0m처리[0m
[7m[0m  docs\features\crm-sync.md:577:5. 향후 outbound push — § 4.1 step 5에서 차단[0m
  docs\features\crm-sync.md:619:
  docs\features\crm-sync.md:620:- DPA: `dpaEvidenceRef` 필수
> docs\features\crm-sync.md:621:- consent withdrawal: § 4.8 + Crm[7mConsentWithdrawalLedger[0m (CS3-05 — v1.0 최소 범위)[0m
[7m[0m  docs\features\crm-sync.md:622:- patientConsentEvidenceRef record-level evidence: v1.x (CS-07)[0m
[7m[0m  docs\features\crm-sync.md:623:[0m
[7m[0m  docs\features\crm-sync.md:624:### 7.5 displayHints expiry 처리 (CS3-07)[0m
[7m[0m  docs\features\crm-sync.md:625:[0m
  docs\features\crm-sync.md:667:| AT-23 | retry exhausted | maxAttempts 도달 | § 4.4 step 8 |
  docs\features\crm-sync.md:668:| AT-24 | retry permanent | permanent error class | § 4.4 step 9 |
> docs\features\crm-sync.md:669:| AT-25 | credential rotation | [7mstable[0m→rotating→committed | § 4.5 |[0m
> docs\features\crm-sync.md:670:| AT-26 | credential rotation | [7mstable[0m→rotating→reverted | § 4.5 |[0m
[7m[0m  docs\features\crm-sync.md:671:| AT-27 | credential rotation | committed→grace-expired (worker) | § 4.5 |[0m
[7m[0m  docs\features\crm-sync.md:672:| AT-28 | credential rotation | grace-expired worker failure reconcile | § 10.4 |[0m
> docs\features\crm-sync.md:673:| AT-29 | rotation 동시성 | [7mrotating[0m 중 outbound + inbound | § 4.5.3 |[0m
[7m[0m  docs\features\crm-sync.md:674:| AT-30 | CAS | 동시 inbound + outbound → 1 ConflictRecord | § 4.3 |[0m
[7m[0m  docs\features\crm-sync.md:675:| AT-31 | CAS field-level | manual resolve 후 재충돌 차단 | § 4.3.3 |[0m
> docs\features\crm-sync.md:676:| AT-32 | webhook + polling 동시 | Crm[7mChangeIdentityLedger[0m 통과 | § 3.4.4·§ 4.2 step 10[0m
[7m[0m |[0m
[7m[0m  docs\features\crm-sync.md:677:| AT-33 | displayHints closed schema | 자유 JSON → DB CHECK reject | § 7.1 |[0m
[7m[0m  docs\features\crm-sync.md:678:| AT-34 | displayHints closed schema | 정규식 위반 → application validator reject | § 7[0m
[7m[0m.1 |[0m
[7m[0m  docs\features\crm-sync.md:679:| AT-35 | displayHints migration | v0.3 → v0.4 column 추가 backward-compatible | § 10.3[0m
[7m[0m |[0m
[7m[0m  docs\features\crm-sync.md:680:| AT-36 | outbox idempotency | credential rotation 후 새 credentialVersion 만료 | § 6.3[0m
[7m[0m |[0m
> docs\features\crm-sync.md:681:| AT-37 | consent withdrawal | [7mapplyConsentWithdrawal[0m + displayHints nulling | § 4.8 |[0m
[7m[0m  docs\features\crm-sync.md:682:| AT-38 | consent withdrawal | inbound 매칭 → rejected-consent-withdrawn | § 4.2 step 8[0m
[7m[0m |[0m
[7m[0m  docs\features\crm-sync.md:683:| AT-39 | consent withdrawal | outbound 매칭 → push 차단 | § 4.1 step 5 |[0m
> docs\features\crm-sync.md:684:| AT-40 | [7munregister[0m | displayHints nulling·queue cancel·ledger 보존 | § 4.7 |[0m
[7m[0m  docs\features\crm-sync.md:685:| AT-41 | purge worker | retentionDays.changeLog | § 10.4 |[0m
[7m[0m  docs\features\crm-sync.md:686:| AT-42 | purge worker | retentionDays.syncLog | § 10.4 |[0m
[7m[0m  docs\features\crm-sync.md:687:| AT-43 | purge worker | retentionDays.conflictRecord | § 10.4 |[0m
[7m[0m  docs\features\crm-sync.md:688:| AT-44 | purge worker | webhookNonceLedgerRetentionMinutes | § 10.4 |[0m
  docs\features\crm-sync.md:689:| AT-45 | purge worker | piiRetentionExpiresAt → displayHints nulling | § 7.5 |
> docs\features\crm-sync.md:690:| AT-46 | purge worker | [7mconsentWithdrawalLedger[0m legal hold skip | § 10.4 |[0m
[7m[0m  docs\features\crm-sync.md:691:| AT-47 | audit cascade | 7종 AuditAction insert 성공 | § 3.1.1 |[0m
[7m[0m  docs\features\crm-sync.md:692:| AT-48 | notification cascade | 4종 NotificationEventType emit | § 6.1 |[0m
[7m[0m  docs\features\crm-sync.md:693:| AT-49 | DATA_MODEL cascade | genericRestApiAdapter 동기화 | § 2.3 |[0m
[7m[0m  docs\features\crm-sync.md:694:[0m
  docs\features\crm-sync.md:709:- mode="outbound-only" + CrmFieldMapping `direction IN (inbound, both)` 존재
  docs\features\crm-sync.md:710:- `fieldMappingPolicyVersion` 누락
> docs\features\crm-sync.md:711:- `retentionDays.[7mconsentWithdrawalLedger[0m` 누락 (CS3-05)[0m
[7m[0m  docs\features\crm-sync.md:712:- `purgeWorker.cadenceMinutes` 누락 (CS3-10)[0m
[7m[0m  docs\features\crm-sync.md:713:[0m
[7m[0m  docs\features\crm-sync.md:714:### 10.2 runtime validation fail[0m
[7m[0m  docs\features\crm-sync.md:715:[0m
  docs\features\crm-sync.md:716:v0.3 § 10.2 + 추가:
  docs\features\crm-sync.md:717:- **CAS WHERE 0 rows affected** (outbound·inbound 모두 양방향 version 검사 — CS3-04)
> docs\features\crm-sync.md:718:- **Crm[7mChangeIdentityLedger[0m UNIQUE 충돌** (webhook + polling 중복) → 정상 dedupe (fail [0m
[7m[0m아님 — 정보 로그)[0m
> docs\features\crm-sync.md:719:- **[7mapplyConsentWithdrawal[0m** 시 매칭 record 0건 → 정보 알림 (fail 아님)[0m
[7m[0m  docs\features\crm-sync.md:720:- **recoverRrnFalsePositive** invalid status (rejected-rrn-recoverable 아님) → runtime [0m
[7m[0mfail[0m
> docs\features\crm-sync.md:721:- **[7mCrmCredentialVersion[0m invariant 위반** (CS3-01 § 4.5.2 표) — 예: rotating 중 active+[0m
[7m[0mrotating-target 외 row 존재 → runtime fail + 운영자 alert[0m
[7m[0m  docs\features\crm-sync.md:722:[0m
[7m[0m  docs\features\crm-sync.md:723:### 10.3 migration-time validation[0m
[7m[0m  docs\features\crm-sync.md:724:[0m
[7m[0m  docs\features\crm-sync.md:725:- v0.4 cascade 신규:[0m
  docs\features\crm-sync.md:726:  - CrmRecord에 operationalHints* column 추가 (nullable)
> docs\features\crm-sync.md:727:  - Crm[7mChangeIdentityLedger[0m 신설 (§ 13.13)[0m
> docs\features\crm-sync.md:728:  - Crm[7mConsentWithdrawalLedger[0m 신설 (§ 13.14)[0m
[7m[0m  docs\features\crm-sync.md:729:  - displayHintsCityName CHECK 정규식 정리[0m
[7m[0m  docs\features\crm-sync.md:730:[0m
[7m[0m  docs\features\crm-sync.md:731:### 10.4 runtime invariant·reconcile (CS3-10 강화)[0m
[7m[0m  docs\features\crm-sync.md:732:[0m
  docs\features\crm-sync.md:736:- credential 만료 → expired + integration 자동 비활성화
  docs\features\crm-sync.md:737:- PII drift 감지 (CHECK 미적용 historical row) → sink alert
> docs\features\crm-sync.md:738:- **[7mCrmCredentialVersion[0m grace-expired worker**: cadence 10분. graceUntil 도래 → state=[0m
[7m[0mrevoked·integration.state="grace-expired". 실패 시 sink alert + 다음 cycle 재시도 (3회 실패 시 super-admin 수동 개입 필[0m
[7m[0m요)[0m
[7m[0m  docs\features\crm-sync.md:739:- CrmWebhookNonceLedger `rejected-rrn-recoverable` 24h 무처리 → 운영자 alert[0m
[7m[0m  docs\features\crm-sync.md:740:- **purge worker SoT** (CS3-10) — Feature 내부 책임:[0m
[7m[0m  docs\features\crm-sync.md:741:  - cadence: `purgeWorker.cadenceMinutes` (기본 60분)[0m
[7m[0m  docs\features\crm-sync.md:742:  - batch size: `purgeWorker.batchSize` (기본 500)[0m
  docs\features\crm-sync.md:751:    | CrmCredentialAuditLog | keep (7년 — REVIEW_WORKFLOW § 10.3 audit retention 따름) 
| hold |
  docs\features\crm-sync.md:752:    | CrmWebhookNonceLedger | delete row | × |
> docs\features\crm-sync.md:753:    | Crm[7mChangeIdentityLedger[0m | delete row (changeLog와 동일 retention) | × |[0m
> docs\features\crm-sync.md:754:    | Crm[7mConsentWithdrawalLedger[0m | **delete row만 만료 시 — legal hold default true** ([0m
[7m[0mCS3-09·10) | hold |[0m
[7m[0m  docs\features\crm-sync.md:755:    | CrmRecord.displayHints* | nulling (row 유지) | × |[0m
[7m[0m  docs\features\crm-sync.md:756:    | CrmSyncNotificationOutbox (status=sent/permanent) | delete row | × |[0m
[7m[0m  docs\features\crm-sync.md:757:  - failure reconcile: row delete 실패 → sink alert·다음 cycle 재시도[0m
[7m[0m  docs\features\crm-sync.md:758:[0m
  docs\features\crm-sync.md:788:| ID | 항목 | v1.0 영향 |
  docs\features\crm-sync.md:789:|---|---|---|
> docs\features\crm-sync.md:790:| CS-07 | patientConsentEvidenceRef record-level evidence | v1.0은 § 4.8 + Crm[7mConsentWi[0m
[7mthdrawalLedger[0m 최소 범위 (CS3-05) |[0m
[7m[0m  docs\features\crm-sync.md:791:| CS-11 | CRM → Core 자동 promote | 수동 |[0m
[7m[0m  docs\features\crm-sync.md:792:| CS-12 | appointment entity | build fail로 차단 |[0m
[7m[0m  docs\features\crm-sync.md:793:| CS-13 | korean-emr provider | build fail로 차단 |[0m
[7m[0m  docs\features\crm-sync.md:794:| CS-14 | crm-live-read audit + liveReadCrmDetail | v1.0 미지원 |[0m
  docs\features\crm-sync.md:821:| 2026-05-14 | v0.2 | codex 1차 비평 21 지적 반영 |
  docs\features\crm-sync.md:822:| 2026-05-14 | v0.3 | codex 2차 비평 17 지적 반영 |
> docs\features\crm-sync.md:823:| 2026-05-14 | **v0.4** | **codex 3차 비평 17 지적 전건 수용 + REVIEW_WORKFLOW·DATA_MOD
EL cascade**: (1) **DB 인벤토리 15 tables로 정정** — Crm[7mChangeIdentityLedger[0m·CrmConsentWithdrawalLedger 신설 (CS3-06), [0m
[7m[0m(2) **CredentialVersion·Integration state invariant 표** + rotating-revoked 잔재 제거 (CS3-01), (3) **NonceLedger key d[0m
[7m[0meliveryKind별 partial unique** — exactly-once / at-least-once+eventId / at-least-once-no-eventId·best-effort 3분기 (CS3[0m
[7m[0m-02), (4) **InboundProcessingContext + providerVersionToken** + provider별 expectedCrmVersion 산정 표 (CS3-03), (5) **C[0m
[7m[0mAS WHERE outbound도 crm_version 포함** + CrmChangeIdentityLedger 신설 (webhook + polling idempotency) (CS3-04), (6) **C[0m
[7m[0mrmConsentWithdrawalLedger + applyConsentWithdrawal command** + `crm-consent-withdrawal-applied` AuditAction (CS3-05), ([0m
[7m[0m7) **non-PII operational hints** entity별 column (CS3-07), (8) **DB CHECK dialect 명시** (PostgreSQL canonical · `\p{L}[0m
[7m[0m` 회피 · 행정구역 allowlist application validator) (CS3-08), (9) **§ 4.7 unregister 정책 표** 12행 + FK ON DELETE 정책 [0m
[7m[0m(CS3-09), (10) **purge worker SoT § 10.4** — cadence·batch·legal hold·failure reconcile + 테이블별 액션 (CS3-10), (11) [0m
[7m[0m**REVIEW_WORKFLOW § 10.2.1 cascade — RRN 2종 + consent withdrawal 1종 AuditAction 추가** (CS3-11), (12) **retry queue w[0m
[7m[0morker SQL search-visibility § 13.5 풀 전개** — claim·SourceAttempt insert·envelope recalc·stale reclaim·exhausted·perma[0m
[7m[0mnent 9단계 (CS3-12), (13) **DATA_MODEL C-08 v0.20 cascade — genericRestApiAdapter + CrmCredentialVersion 경계** (CS3-13[0m
[7m[0m), (14) **§ 1.1 변경 정책 — displayHints column·state enum·table 추가 SemVer 룰** 7행 추가 (CS3-14), (15) **§ 8.2 accep[0m
[7m[0mtance test 49 cases + § 10 traceability 표** (CS3-15), (16) **§ 11.4 잔여 리스크 실측 기반 정리** (CS3-16), (17) **`Ref[0m
[7m[0m<C-anything>`·rotating-revoked·중복 line·잘못된 테이블 수 문장 정정** (CS3-17) |[0m
[7m[0m  docs\features\crm-sync.md:824:[0m
[7m[0m  docs\features\crm-sync.md:825:---[0m
[7m[0m  docs\features\crm-sync.md:826:[0m
[7m[0m  docs\features\crm-sync.md:827:## 13. 본 Feature 내부 데이터 구조 (admin DB **15 tables** — CS3-06 정정)[0m
  docs\features\crm-sync.md:931:### 13.10 `CrmRateLimitState` — v0.3 동일
  docs\features\crm-sync.md:932:
> docs\features\crm-sync.md:933:### 13.11 `[7mCrmCredentialVersion[0m` — v0.3 동일[0m
[7m[0m  docs\features\crm-sync.md:934:[0m
[7m[0m  docs\features\crm-sync.md:935:### 13.12 `CrmWebhookNonceLedger` (CS3-02 — deliveryKind별 partial unique 재설계)[0m
[7m[0m  docs\features\crm-sync.md:936:[0m
[7m[0m  docs\features\crm-sync.md:937:v0.3 schema + Constraints 재정의:[0m
  docs\features\crm-sync.md:942:- `UNIQUE(integrationId, canonicalDigest, receivedBucket) WHERE providerEventId IS NULL
 OR deliveryKind='best-effort'`
  docs\features\crm-sync.md:943:
> docs\features\crm-sync.md:944:### 13.13 `Crm[7mChangeIdentityLedger[0m` (CS3-04 신규)[0m
[7m[0m  docs\features\crm-sync.md:945:[0m
[7m[0m  docs\features\crm-sync.md:946:webhook + polling 동일 변경 idempotency 보장.[0m
[7m[0m  docs\features\crm-sync.md:947:[0m
[7m[0m  docs\features\crm-sync.md:948:| 필드 | 타입 | required |[0m
  docs\features\crm-sync.md:949:|---|---|:---:|
  docs\features\crm-sync.md:950:| `id` | UUID | ✅ |
> docs\features\crm-sync.md:951:| `integrationId` | UUID | ✅ — [7mFK[0m |[0m
[7m[0m  docs\features\crm-sync.md:952:| `entity` | enum | ✅ |[0m
[7m[0m  docs\features\crm-sync.md:953:| `crmExternalId` | string | ✅ |[0m
[7m[0m  docs\features\crm-sync.md:954:| `providerVersionToken` | string | optional (null인 provider는 본 ledger 미사용) |[0m
[7m[0m  docs\features\crm-sync.md:955:| `changeIdentityKey` | char(64) | ✅ — § 3.4.4 HMAC |[0m
  docs\features\crm-sync.md:959:| `expiresAt` | Date | ✅ — retentionDays.changeLog 동일 |
  docs\features\crm-sync.md:960:
> docs\features\crm-sync.md:961:**Constraints**: `UNIQUE(changeIdentityKey)`. `[7mFK[0m integrationId`.[0m
[7m[0m  docs\features\crm-sync.md:962:**Index**: `(integrationId, entity, crmExternalId, receivedAt DESC)`, `(expiresAt)`.[0m
[7m[0m  docs\features\crm-sync.md:963:[0m
[7m[0m  docs\features\crm-sync.md:964:`providerVersionToken=null`인 provider는 본 ledger insert skip → webhook/polling 중복 [0m
[7m[0m처리 가능 (운영 경고 § 10.5).[0m
[7m[0m  docs\features\crm-sync.md:965:[0m
> docs\features\crm-sync.md:966:### 13.14 `Crm[7mConsentWithdrawalLedger[0m` (CS3-05 신규)[0m
[7m[0m  docs\features\crm-sync.md:967:[0m
[7m[0m  docs\features\crm-sync.md:968:| 필드 | 타입 | required |[0m
[7m[0m  docs\features\crm-sync.md:969:|---|---|:---:|[0m
[7m[0m  docs\features\crm-sync.md:970:| `id` | UUID | ✅ |[0m
> docs\features\crm-sync.md:971:| `integrationId` | UUID | ✅ — [7mFK[0m |[0m
[7m[0m  docs\features\crm-sync.md:972:| `piiHash` | char(64) | optional (matching key 둘 중 하나 ✅) |[0m
[7m[0m  docs\features\crm-sync.md:973:| `crmExternalIdHash` | char(64) | optional (matching key 둘 중 하나 ✅) |[0m
[7m[0m  docs\features\crm-sync.md:974:| `scope` | enum (`all`·`marketing-only`) | ✅ |[0m
[7m[0m  docs\features\crm-sync.md:975:| `appliedBy` | string | ✅ — super-admin |[0m
  docs\features\crm-sync.md:977:| `displayHintsNulled` | boolean | ✅ |
  docs\features\crm-sync.md:978:| `tombstoneChangeLogId` | UUID | optional |
> docs\features\crm-sync.md:979:| `legalHold` | boolean | ✅ default true (CS3-09 — [7munregister[0m 시 보존) |[0m
[7m[0m  docs\features\crm-sync.md:980:| `expiresAt` | Date | optional — legalHold=true 시 null |[0m
[7m[0m  docs\features\crm-sync.md:981:[0m
> docs\features\crm-sync.md:982:**Constraints**: `[7mFK[0m integrationId`. 응용 단위 unique: `(integrationId, piiHash | crmEx[0m
[7m[0mternalIdHash, scope)` 중복 시 정보 알림.[0m
[7m[0m  docs\features\crm-sync.md:983:**Index**: `(integrationId, piiHash) WHERE piiHash IS NOT NULL`, `(integrationId, crmEx[0m
[7m[0mternalIdHash) WHERE crmExternalIdHash IS NOT NULL`, `(expiresAt) WHERE legalHold=false`.[0m
[7m[0m  docs\features\crm-sync.md:984:[0m
[7m[0m  docs\features\crm-sync.md:985:### 13.15 `CrmSyncNotificationOutbox` — v0.3 § 13.13 동일[0m
[7m[0m  docs\features\crm-sync.md:986:[0m
  docs\features\crm-sync.md:1001:| 13.9 | `CrmCredentialAuditLog` | audit retention 7년 (REVIEW_WORKFLOW § 10.3) |
  docs\features\crm-sync.md:1002:| 13.10 | `CrmRateLimitState` | 운영 데이터 (즉시 갱신) |
> docs\features\crm-sync.md:1003:| 13.11 | `[7mCrmCredentialVersion[0m` | state=revoked 후 audit retention |[0m
[7m[0m  docs\features\crm-sync.md:1004:| 13.12 | `CrmWebhookNonceLedger` | webhookNonceLedgerRetentionMinutes |[0m
> docs\features\crm-sync.md:1005:| 13.13 | `Crm[7mChangeIdentityLedger[0m` | retentionDays.changeLog 동일 |
> docs\features\crm-sync.md:1006:| 13.14 | `Crm[7mConsentWithdrawalLedger[0m` | legal hold default — retentionDays.consentWit[0m
[7m[0mhdrawalLedger (legalHold=false 시) |[0m
[7m[0m  docs\features\crm-sync.md:1007:| 13.15 | `CrmSyncNotificationOutbox` | retentionDays.notificationOutbox |[0m


 succeeded in 847ms:

> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:1:# Compliance — 의료[7m광고[0m 준수 공통 가이드[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:2:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:3:> **상태**: **v1.0 구현 명세 안정판** (codex 자동 비평 5차 사이클 [0m
[7m[0m마감)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:4:> **작성일**: 2026-05-14[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:5:> **소유자**: Glitzy
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:6:> **상위 문서**: `docs/ARCHITECTURE.md` § 4, § 9 / `compliance/RISK
_LEVELS.md` § 1.2
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:7:> **목적**: [7m의료법[0m(제56조·제57조)·시행령·의료광고심의 운영규정에 대[0m
[7m[0m한 실무 해석, 금지 항목 카탈로그(RiskRule.id 매핑), 사전심의 대상 판정, 환자 후기·전후사진·가격·한의 회색지대 운영 가이[0m
[7m[0m드, 인용 가능 외부 도메인 화이트리스트의 단일 SoT.[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:8:> **외부 공유 시 주의**: 상위 문서와 동일. **법무 자문 보완 필수** [0m
[7m[0m— 본 문서는 운영 가이드이며 개별 사례의 최종 법적 판정은 법무 자문에 따른다.[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:9:> **연관 문서**:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:10:> - 운영 SoT — RiskLevel 자동 추론·RiskRule 카탈로그·ApproverRole [0m
[7m[0m→ `compliance/RISK_LEVELS.md`[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:17:## 0. 한 페이지 요약
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:18:
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:19:- **본 문서가 단일 SoT**: (1) [7m의료법[0m 조문 인용·해석 (제56조·제57조[0m
[7m[0m·시행령 제23조·제24조), (2) 의료법 금지 항목과 RiskRule.id의 **법령→룰 매핑** (표현 카테고리 원본은 `CONTENT_STANDARDS.[0m
[7m[0mmd` § 4. 본 문서는 법령 조문과 룰 ID의 연결 매핑만), (3) 사전심의 대상·면제 사유 판정 가이드, (4) 환자 후기·전후사진·가[0m
[7m[0m격 운영 가이드, (5) 한의 회색지대 가이드, (6) 인용 가능 외부 도메인 화이트리스트 (CS-D 해소)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:20:- **법무 자문 보완 의무**: 본 문서는 사람이 읽고 판단하는 운영 가[0m
[7m[0m이드. 법적 정확성 책임은 ComplianceRecord(C-10) 법무 기록 — `legalCounsel` 필수는 다음 경우만: **(a) LegalDocument(C-16[0m
[7m[0m) 발행** (DATA_MODEL C-10 required), **(b) 룰별 `requiredApproverRoles[]`에 `legal`이 포함된 경우** (예: `review-case`·[0m
[7m[0m`event-price` ArticleType, 전후사진 노출 콘텐츠). High 등급 자체는 `medical` 기본 요구이며 `legal`은 룰 요구에 따라 추[0m
[7m[0m가[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:21:- **갱신 책임**: 분기 1회 + [7m의료법[0m 개정 즉시[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:22:- **데이터 파일과의 관계**: 본 문서 = 사람 가독 SoT, `data/complia[0m
[7m[0mnce-rules/rules.medical-ad.yaml` = 기계 처리 SoT. 양자는 RiskRule.id로 1:1 또는 1:N 매핑[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:23:- **현재 데이터 파일 상태** (2026-05-14 기준): `data/compliance-ru[0m
[7m[0mles/` 디렉토리 및 YAML 파일은 **아직 미생성** (자체 룰 checker 구현 시 동시 생성). 따라서:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:24:  - 본 문서 § 3의 RiskRule.id는 **권장 ID 형식** — `<category-keyw[0m
[7m[0mord>-<sequence>` (kebab-case) 패턴. 파일 생성 시 본 문서가 ID 명세 SoT로 활성[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:35:| 변경 유형 | 버전 영향 | 비고 |
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:36:|---|---|---|
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:37:| [7m의료법[0m 조문 인용 정정 | PATCH | 본문 명문 정합성 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:38:| 새 금지 항목 추가 (개정 대응) | **MAJOR** | RiskRule cascade 필[0m
[7m[0m수 + `medical-law-tracking.yaml` revision 추가 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:39:| 사전심의 대상 판정 기준 변경 | **MAJOR** | 운영 영향 큼 — 기존 C[0m
[7m[0momplianceRecord stale 처리 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:40:| 인용 가능 도메인 화이트리스트 추가 | MINOR | RiskRule.medical-ad[0m
[7m[0m cascade 권장 |[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:47:|---|---|
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:48:| 표현 카테고리 원본 (효과 단정·보장·비교·유인 등의 카테고리·대체 
표현) | **`core/CONTENT_STANDARDS.md` § 4** |
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:49:| [7m의료법[0m 조문 인용·법령 해석·사람 가독 운영 가이드 | **본 문서** |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:50:| 법령 조문 ↔ RiskRule.id 매핑 | **본 문서 § 3** |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:51:| RiskRule 기계 처리 데이터 | `data/compliance-rules/rules.medical[0m
[7m[0m-ad.yaml` |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:52:| 개정 추적 데이터 | `data/compliance-rules/medical-law-tracking.y[0m
[7m[0maml` |[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:63:---
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:64:
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:65:## 2. [7m의료법[0m 핵심 조문[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:66:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:67:> **법문 인용 원칙**: 본 문서의 조문 인용은 운영자가 빠르게 참조하[0m
[7m[0m는 사람 가독 SoT — 법적 정확성은 ComplianceRecord(C-10) `legalCounsel` 기록 + 국가법령정보센터 원문 조회로 보완. 인용 [0m
[7m[0m조문 개정 시 § 11 추적 갱신 + `rules.medical-ad.yaml` cascade.[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:68:>[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:69:> **확인 출처** (codex 자동 비평 1차 사이클에서 확인된 URL — § 11 
추적 표 참조):
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:70:> - [7m의료법[0m 제56조: https://www.law.go.kr/LSW/lsLawLinkInfo.do?chrC[0m
[7m[0mlsCd=010202&lsJoLnkSeq=1000916681[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:71:> - [7m의료법[0m 제57조: https://www.law.go.kr/lsLawLinkInfo.do?chrClsCd[0m
[7m[0m=010202&lsJoLnkSeq=1000721562[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:72:> - [7m의료법[0m 시행령 제23조: https://www.law.go.kr/lsLawLinkInfo.do?c[0m
[7m[0mhrClsCd=010202&lsJoLnkSeq=1011395655[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:73:> - [7m의료법[0m 시행령 제24조: https://www.law.go.kr/lsLawLinkInfo.do?c[0m
[7m[0mhrClsCd=010202&lsJoLnkSeq=1000945403[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:74:[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:75:### 2.1 [7m의료법[0m 제56조 — 의료광고의 금지 등[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:76:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:77:| 항 | 내용 요약 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:78:|---|---|[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:79:| **제1항** | [7m의료법[0m인·의료기관·의료인이 아닌 자의 의료광고 금지 +[0m
[7m[0m 의료광고의 정의 |[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:80:| **제2항** | **의료[7m광고[0m 금지 유형 15호 각 호 열거** — 본 문서 § 3[0m
[7m[0m이 호별 매핑 |[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:81:| **제3항** | 방송법상 방송을 통한 의료[7m광고[0m 방법 자체 금지 — 매체[0m
[7m[0m별 추가 제한 |[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:82:| **제4항** | [7m광고[0m 의뢰자·매체의 위반 책임 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:83:[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:84:### 2.2 [7m의료법[0m 제56조제2항 — 금지 유형 15호 (운영 기준)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:85:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:86:| 호 | 카테고리 | 본 문서 § |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:87:|---|---|---|[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:88:| 1호 | 평가받지 아니한 신의료기술 [7m광고[0m | § 3.1 |
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:89:| 2호 | [7m환자[0m에 관한 치료경험담 광고 (제3자가 환자의 치료경험을 표[0m
[7m[0m현하는 것 포함) | § 3.2 / § 5 |[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:90:| 3호 | 거짓된 내용을 표시하는 [7m광고[0m | § 3.3 |
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:91:| 4호 | 다른 의료기관·의료인을 비교하는 [7m광고[0m | § 3.4 |
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:92:| 5호 | 다른 의료기관·의료인을 비방하는 [7m광고[0m | § 3.5 |
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:93:| 6호 | 수술 장면 등 직접적 시술 행위를 노출하는 [7m광고[0m (시행령 제23[0m
[7m[0m조제1항제6호와 결합) | § 3.6 / § 6 |[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:94:| 7호 | 의료인 등의 기능·진료방법과 관련하여 심각한 부작용 등 정보
를 누락하는 [7m광고[0m | § 3.7 |[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:95:| 8호 | **객관적인 사실을 과장하는 [7m광고[0m** | § 3.8 |
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:96:| 9호 | **법적 근거가 없는 자격·명칭을 표방하는 [7m광고[0m** | § 3.9 |
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:97:| 10호 | 신문·방송·잡지 등을 이용하여 기사 또는 전문가의 의견 형태
로 표현되는 [7m광고[0m (기사형 광고) | § 3.10 |[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:98:| 11호 | 제57조에 따른 심의를 받지 아니하거나 심의받은 내용과 다른
 [7m광고[0m | § 3.11 / § 4 |[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:99:| 12호 | 외국인[7m환자[0m 유치를 위한 국내광고 (의료법 제27조제3항 위반 [0m
[7m[0m광고) | § 3.12 |[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:100:| 13호 | **비급여 진료비용의 할인·면제 [7m광고[0m로서 소비자를 속이거나[0m
[7m[0m 잘못 알게 할 우려가 있는 방법** | § 3.13 / § 7 |[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:101:| 14호 | **각종 상장·감사장 등을 이용하는 [7m광고[0m 또는 인증·보증·추[0m
[7m[0m천 표현 광고** (원칙 금지, 가~라목 법정 예외는 **인증·보증 표시만** — 의료기관 인증(가목)·공공기관 인증·보증(나목)·다른[0m
[7m[0m 법령 인증·보증(다목)·WHO/ISQua 등 국제 인증(라목). 추천 표시는 예외 범위 아님) | § 3.14 |[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:102:| 15호 | 그 밖에 의료[7m광고[0m의 방법 등이 의료법 시행령으로 정하는 광[0m
[7m[0m고 (시행령 제23조 위임 조항) | § 3.15 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:103:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:104:> ⚠️ **호 번호·법문 보완 의무**: 위 15호의 정확한 법문은 분기 1회[0m
[7m[0m + 개정 즉시 국가법령정보센터 원문으로 검증 (§ 11 추적 + `legalCounsel` 검수).[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:105:[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:106:### 2.3 [7m의료법[0m 제57조 — 의료광고의 심의[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:107:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:108:| 항 | 내용 요약 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:109:|---|---|[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:110:| **제1항** | 사전심의 대상 매체 — 신문·잡지·옥외[7m광고[0m물·인터넷·SN[0m
[7m[0mS 등 (시행령 제24조 위임) |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:111:| **제2항** | 심의 기관 — 자율심의기구 (대한의사협회·대한치과의사[0m
[7m[0m협회·대한한의사협회 등) |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:112:| **제3항** | 사전심의 면제 사항 — 의료기관·의료인의 한정된 사실 [0m
[7m[0m안내 (시행령 제24조제7항 위임) |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:113:| **제4항~** | 심의 결과 통지·이의신청·재심의 등 절차 |[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:114:
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:115:### 2.4 [7m의료법[0m 시행령 제23조 — 의료광고 금지 기준 세부[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:116:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:117:| 항 | 위임 영역 | 본 문서 § |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:118:|---|---|---|[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:119:| **제1항** | 제56조제2항 각 호 금지 [7m광고[0m의 **구체 기준** — 제1호[0m
[7m[0m~**제14호**까지 각 호별 세부 판단 기준. 호 번호는 법 본문 호와 **대체로 대응**하나, 일부 시행령 호는 법 본문 호의 의미[0m
[7m[0m를 확장·혼합 (예: 시행령 제2호는 치료경험담·단기 임상경력·치료효과 단정 3유형 묶음). 세부 요소는 RiskRule.id 단위로 별[0m
[7m[0m도 추적 | § 3 각 절 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:120:| **제2항** | 제56조제2항제14호 라목의 **국제 인증 구체 범위** — [0m
[7m[0mWHO/ISQua 등 시행령이 정하는 국제 인증 | § 3.14 |[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:121:| **제3항** | **의료인등이 자신이 운영하는 인터넷 홈페이지에 게재
하는 [7m광고[0m에 대해 보건복지부장관이 세부 기준을 고시할 수 있음** | § 4.2 자사 홈페이지 판정 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:122:| 후속 항 등 | 개정에 따라 변동 | § 11 추적 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:123:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:124:> ⚠️ 시행령 제23조는 제56조제2항의 단순 위임이 아니라 **각 호의 [0m
[7m[0m구체 기준 명세**. 본 문서 § 3 각 절은 법 본문 호 + 시행령 호의 결합으로 운영.[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:125:
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:126:### 2.5 [7m의료법[0m 시행령 제24조 — 의료광고 심의 대상 매체[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:127:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:128:| 항 | 내용 요약 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:129:|---|---|[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:130:| **제1항** | 사전심의 대상 매체 — 인터넷뉴스서비스, 방송사업자 
홈페이지, 방송프로그램 중심 인터넷 매체, 전년도 말 기준 직전 3개월 일평균 이용자 10만명 이상 정보통신서비스 제공자 운영
 매체 |
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:131:| **제2항** | 일평균 이용자 10만명 이상 SNS [7m광고[0m매체 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:132:| **제3항~제6항** | 자율심의기구 조직 요건·신고·수리·변경신고 등 [0m
[7m[0m(자율심의 체계 운영 규정) |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:133:| **제7항** | 제57조제3항 면제 사항의 추가 항목 — 개설자·개설연도[0m
[7m[0m·홈페이지 주소·진료일·진료시간·전문병원 지정·의료기관 인증·전문의 자격·전문과목 등 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:134:[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:135:---
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:136:
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:137:## 3. 금지 표현 카탈로그 — [7m의료법[0m 조문 → RiskRule.id 매핑[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:138:[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:139:본 § 3은 [7m의료법[0m 제56조제2항 각 호와 `data/compliance-rules/rules.[0m
[7m[0mmedical-ad.yaml`의 RiskRule을 매핑한다. **표현 카테고리 원본은 `CONTENT_STANDARDS.md` § 4가 SoT** — 본 § 3은 법령 조문[0m
[7m[0m과 룰 ID의 **연결 매핑 SoT**.[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:140:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:141:### 3.0 canonical RiskRule + legalBasis[] 패턴[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:142:[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:153:> RiskRule ID는 권장 형식 예시이며, 실제 ID는 `rules.medical-ad.y
aml` 파일 작성 시 확정 (MA-06 참조).
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:154:
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:155:### 3.1 평가받지 아니한 신의료기술 [7m광고[0m (제56조제2항제1호 + 시행[0m
[7m[0m령 제23조제1항제1호)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:156:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:157:- **RiskRule (예시 ID)**: `new-medical-technology-unevaluated-001[0m
[7m[0m`[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:158:- **금지**: 평가받지 아니한 신의료기술 (보건복지부 신의료기술평가
위원회 미평가)을 효과·안전성 측면에서 [7m광고[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:159:- **구분**: 식약처 미승인 의료기기·약품 [7m광고[0m는 별도 규제(약사법·[0m
[7m[0m의료기기법) — 본 호에 직접 매핑하지 않음[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:160:[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:161:### 3.2 [7m환자[0m 치료경험담·단기 임상경력·치료효과 단정 광고 (제56조[0m
[7m[0m제2항제2호 + 시행령 제23조제1항제2호)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:162:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:163:시행령 제23조제1항제2호는 본 호의 구체 기준으로 **3가지 유형**을 [0m
[7m[0m함께 다룬다:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:164:[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:165:- **RiskRule (예시 ID)**: `testimonial-001`, `short-clinical-expe
rience-001`, `treatment-effect-assertion-001`
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:166:- **금지 1 (치료경험담)**: [7m환자[0m 본인 또는 제3자가 환자의 치료경험[0m
[7m[0m을 표현하는 광고[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:167:- **금지 2 (단기 임상경력)**: **6개월 이하의 임상경력**을 [7m광고[0m하[0m
[7m[0m는 행위[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:168:- **금지 3 (치료효과 단정)**: 질병 치료에 **반드시 효과가 있다고 
표현**하는 [7m광고[0m — § 3.8 사실 과장과 의미적으로 연결되지만 시행령 호 번호 추적은 본 호 (제2호)에서 기록[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:169:- **세부 운영**: § 5 참조[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:170:[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:171:### 3.3 거짓된 내용을 표시하는 [7m광고[0m (제56조제2항제3호)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:172:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:173:- **RiskRule (예시 ID)**: `false-statement-001`, `false-credentia[0m
[7m[0ml-001`[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:174:- **금지**: 사실과 다른 효과·자격·실적 표시[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:175:- **검출**: 통계·자격·실적 주장 + 인용 부재 → content-gate (`CONT
ENT_STANDARDS § 3.5`)
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:176:
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:177:### 3.4 비교 [7m광고[0m (제56조제2항제4호 + 시행령 제23조제1항제4호)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:178:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:179:- **RiskRule (예시 ID)**: `comparison-001`[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:180:- **금지**: "타 병원보다·다른 의원보다·기존 ○○보다 우수"[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:182:- **CONTENT_STANDARDS 매핑**: § 4.1 "비교 표현" 카테고리
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:183:
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:184:### 3.5 비방 [7m광고[0m (제56조제2항제5호)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:185:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:186:- **RiskRule (예시 ID)**: `defamation-001`[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:187:- **금지**: 다른 의료기관·의료인을 비방·폄훼하는 표현[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:188:- **허용**: 본원의 진료 방식·차별점의 사실 안내 (타 기관 직접 언
급 회피)
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:189:
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:190:### 3.6 수술 장면·환부 노출 [7m광고[0m (제56조제2항제6호 + 시행령 제23[0m
[7m[0m조제1항제6호)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:191:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:192:- **RiskRule (예시 ID)**: `graphic-procedure-001`, `before-after-[0m
[7m[0mphoto-001`[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:193:- **금지**: 수술 장면·환부 등 혐오감을 일으킬 수 있는 사진·영상[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:195:- **자동 검출**: inlineRiskFlag `includes-before-after` (`RISK_LE
VELS.md` § 2.4)
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:196:
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:197:### 3.7 부작용 등 정보 누락 [7m광고[0m (제56조제2항제7호)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:198:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:199:- **RiskRule (예시 ID)**: `side-effect-missing-001` (warning)[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:200:- **금지**: 의료인 기능·진료방법 [7m광고[0m에서 심각한 부작용 정보 누락[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:201:- **권장**: TreatmentPage·MedicalConditionPage 본문에 부작용·금기[0m
[7m[0m·주의사항 동반 (medical disclaimer)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:202:[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:203:### 3.8 사실 과장 [7m광고[0m (제56조제2항제8호 + 시행령 제23조제1항제8[0m
[7m[0m호)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:204:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:205:- **RiskRule (예시 ID)**: `exaggeration-001`, `effect-claim-001`,[0m
[7m[0m `guarantee-001`, `guarantee-composite-001`, `supremacy-001`[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:206:- **금지**: 객관적인 사실을 과장하는 [7m광고[0m — "완치·100% 효과·반드[0m
[7m[0m시 효과·안전합니다·부작용 없음·효과 보장·결과 보장·최고의·국내 1위"[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:207:- **시행령 결합**: 시행령 제23조제1항제8호의 사실 과장 [7m광고[0m 구체 [0m
[7m[0m기준 (법 본문 호와 시행령 호 1:1 대응)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:208:- **허용**: "효과 인지 시점·정도는 개인의 체질·생활 습관에 따라 [0m
[7m[0m다릅니다" (`CONTENT_STANDARDS § 4.2` 대체 표현)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:209:- **CONTENT_STANDARDS 매핑**: § 4.1 효과 단정·전문성 단정·최상급·[0m
[7m[0m보장 표현·수치/기간 단정 카테고리 다수[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:210:[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:211:### 3.9 법적 근거 없는 자격·명칭 [7m광고[0m (제56조제2항제9호)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:212:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:213:- **RiskRule (예시 ID)**: `false-credential-001`, `false-title-00[0m
[7m[0m1`[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:214:- **금지**: 법적 근거가 없는 자격·명칭을 표방하는 [7m광고[0m — "OOO 명[0m
[7m[0m의·OOO 박사 (학위 미보유)·전문의 자격이 없는데 전문 표방"[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:215:- **허용**: [7m의료법[0m·전문의의 수련 및 자격 인정 등에 관한 규정 등에[0m
[7m[0m 따른 자격·명칭만[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:216:[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:217:### 3.10 기사형 [7m광고[0m (제56조제2항제10호)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:218:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:219:- **RiskRule (예시 ID)**: `editorial-format-ad-001`[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:220:- **금지**: 신문·방송·잡지의 기사 또는 전문가 의견 형태로 표현된 
[7m광고[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:221:- **자체 운영**: P-010 Article은 의료기관 자체 발행 콘텐츠 — 기사
형 [7m광고[0m 형식 모방 금지 (제3자 인용·기자 명시 등 회피)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:222:[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:223:### 3.11 미심의 [7m광고[0m (제56조제2항제11호)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:224:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:225:- **RiskRule (예시 ID)**: `unreviewed-ad-001`[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:226:- **금지**: 제57조 사전심의 대상이면서 심의 미경유 또는 심의받은 
내용과 다른 [7m광고[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:227:- **세부 운영**: § 4 참조 (사전심의 대상 판정 + 발행 차단 게이트)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:228:[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:229:### 3.12 외국인[7m환자[0m 유치 국내광고 (제56조제2항제12호 + 시행령 제2[0m
[7m[0m3조제1항제12호)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:230:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:231:본 호는 금지 유형 — 다음 **2단계 룰**로 분리 적용:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:232:[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:233:| 단계 | RiskRule (예시 ID) | severity | requiredApproverRoles | 
적용 조건 |
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:234:|---|---|---|---|---|
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:235:| 확정 | `foreign-patient-recruit-domestic-confirmed-001` | **fai
l** | (fail이므로 미적용 — § 3.3.1) | 국내[7m광고[0m 해당성이 명백 (예: 한국어로 외국인환자 유치 안내, 한국 내 SNS·전단지) |[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:236:| 불명확 | `foreign-patient-recruit-domestic-uncertain-001` | **c
ontent-gate** | `["legal"]` | 자사 외국어 페이지·다국어 콘텐츠 등 국내[7m광고[0m 해당성이 매체·방식상 모호 — 법무 판단 후 발[0m
[7m[0m행 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:237:[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:238:- **금지**: 외국인[7m환자[0m 유치를 위한 의료광고를 국내 매체에 게재 ([0m
[7m[0m의료법 제27조제3항)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:239:- **운영**: 확정 케이스는 발행 차단(fail). 불명확 케이스만 법무 [0m
[7m[0m검수 — ComplianceRecord(C-10) `legalCounsel` 기록 + 판정 근거를 `attachments[]`로 첨부. `InternationalSupport`의 외국어[0m
[7m[0m 페이지 존재 자체가 회피 근거 아님[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:240:[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:241:### 3.13 비급여 할인·면제 오인 [7m광고[0m (제56조제2항제13호)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:242:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:243:- **RiskRule (예시 ID)**: `non-covered-discount-misleading-001`, [0m
[7m[0m`non-covered-discount-pressure-001`[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:244:- **금지**: 비급여 진료비용의 할인·면제 [7m광고[0m로서 **소비자를 속이[0m
[7m[0m거나 잘못 알게 할 우려가 있는 방법** — 허위·불명확한 금액·대상·기간·범위 표시 (시행령 제23조제1항제13호 결합)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:245:- **분류** (`CONTENT_STANDARDS § 4.1` 정합):[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:246:  - 압박형·유인성 표현(지금만·특가·한정·선착순·기간 한정) → **fai[0m
[7m[0ml**[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:247:  - 허위·불명확한 할인 표현 → **fail**[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:248:  - 명확한 사실 고지("비급여 진료 ○○ 시술 20% 할인, 2026-06-01~06
-30, 신규 내원 [7m환자[0m 대상") → **content-gate** (법무 검수 후 발행)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:249:- **세부 운영**: § 7 참조 (P-102 Pricing·P-104 Event·P-010 articl[0m
[7m[0meType=event-price 페이지 정책)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:250:[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:251:### 3.14 상장·인증·보증·추천 [7m광고[0m (제56조제2항제14호 + 시행령 제2[0m
[7m[0m3조제1항제14호)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:252:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:253:- **RiskRule (예시 ID)**: `award-endorsement-001`, `false-award-0[0m
[7m[0m01`, `false-endorsement-001`[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:254:- **원칙 금지**: 각종 상장·감사장 등을 이용한 [7m광고[0m 또는 인증·보증[0m
[7m[0m·추천 표현 광고 자체가 원칙적으로 금지[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:255:- **법정 예외 (가~라목)** — 본 호 예외로 허용 (인증·보증 표시만 —[0m
[7m[0m 추천·자격 표시는 본 예외 범위 아님):[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:256:  - **가목**. [7m의료법[0m 제58조에 따른 의료기관 인증[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:257:  - **나목**. 정부조직법에 따른 중앙행정기관·지방자치단체 등 공공[0m
[7m[0m기관으로부터 받은 **인증·보증** 표시[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:258:  - **다목**. 다른 법령에 따라 받은 **인증·보증** 표시 (자격 표시[0m
[7m[0m는 별도 — 제56조제2항제9호 적용)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:259:  - **라목**. WHO/ISQua 등 시행령(제23조제2항)이 정하는 국제 인증[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:260:- 가~라목 인증을 [7m광고[0m에 사용할 때도 시행령 제23조제1항제14호의 구[0m
[7m[0m체 표현 기준 준수 필요[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:261:- **허용 표시 시 권장**: 검증 가능 출처(`Award.verificationUrl`) [0m
[7m[0m동반 (`DATA_MODEL` C-01 Award)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:262:[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:263:### 3.15 시행령 위임 — 그 밖의 [7m광고[0m (제56조제2항제15호)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:264:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:265:- **현행 상태 (2026-05-14 기준)**: 시행령 제23조제1항이 제1호~제1[0m
[7m[0m4호까지만 독립 금지 기준을 두므로 본 호에 직접 대응하는 **현행 독립 시행령 기준 없음**[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:266:- 본 § 3.15는 **개정 추적 자리표시** — 시행령 개정으로 신규 금지 [0m
[7m[0m기준 신설 시 본 절 cascade + RiskRule 추가[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:271:## 4. 사전심의 대상 판정 (제57조 + 시행령 제24조)
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:272:
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:273:### 4.1 방송 의료[7m광고[0m — 매체 자체 금지 (제56조제3항)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:274:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:275:| 매체 | 분류 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:276:|---|---|[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:277:| 방송법상 방송 (TV·라디오) | **매체 자체 금지** — 사전심의를 받
더라도 의료[7m광고[0m 방법 자체가 금지. "심의 통과 시 가능"으로 오해 금지 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:278:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:279:### 4.2 사전심의 대상 매체 (제57조제1항 + 시행령 제24조)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:280:[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:281:| 매체 유형 | 출처 |
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:282:|---|---|
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:283:| 신문·인터넷신문·정기간행물 | [7m의료법[0m 제57조제1항 |[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:284:| 옥외[7m광고[0m물 중 현수막·벽보·전단 | 의료법 제57조제1항 |
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:285:| 옥외[7m광고[0m물 중 교통시설·교통수단 표시 광고 | 의료법 제57조제1항 [0m
[7m[0m|[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:286:| 옥외[7m광고[0m물 중 전광판 광고 | 의료법 제57조제1항 (별도 호) |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:287:| 인터넷뉴스서비스 | 시행령 제24조제1항 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:288:| 방송사업자가 운영하는 인터넷 홈페이지 | 시행령 제24조제1항 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:289:| 방송프로그램을 중심으로 운영되는 인터넷 매체 | 시행령 제24조제1[0m
[7m[0m항 |[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:290:| 전년도 말 기준 직전 3개월 일평균 이용자 10만명 이상 정보통신서
비스 제공자 운영 매체 | 시행령 제24조제1항 |
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:291:| 일평균 이용자 10만명 이상 SNS [7m광고[0m매체 | 시행령 제24조제2항 |[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:292:| **자사 웹사이트 — 의료[7m광고[0m 해당성·사전심의 대상 여부** | **법무[0m
[7m[0m 판정** — 매체 분류(시행령 제24조제1항·제2항) + 의료광고 정의(제56조제1항) 결합 판정. **운영 감사 추적**: 판정 결과를 C[0m
[7m[0momplianceRecord(C-10)에 기록 — `priorReviewRequired: boolean` (산정 결과), `legalCounsel` + `legalCounselAt` (법무 판정[0m
[7m[0m 기록), `attachments[]` (판정 근거 의견서). 자사 사이트 일평균 이용자 측정 책임은 운영자 (MA-02) |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:293:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:294:### 4.3 사전심의 절차[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:295:[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:304:법령이 정한 **제한된 항목**만 면제. 일반 학력·경력 전체는 면제 아
님.
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:305:
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:306:**[7m의료법[0m 제57조제3항 본문** (각 호):[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:307:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:308:| 면제 항목 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:309:|---|[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:310:| 의료기관 명칭 |
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:311:| 의료기관 소재지·전화번호 |
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:312:| 진료과목 ([7m의료법[0m 제43조에 따른 진료과목) |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:313:| 의료인의 성명·성별·면허종류 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:314:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:315:**시행령 제24조제7항이 추가하는 항목**:[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:321:| 진료일·진료시간 |
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:322:| 전문병원으로 지정받은 사실 |
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:323:| [7m의료법[0m 제58조에 따른 의료기관 인증 사실 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:324:| 전문의 자격 인정 사실 + 전문과목 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:325:| 그 밖에 시행령이 한정한 항목 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:326:[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:329:---
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:330:
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:331:## 5. [7m환자[0m 후기 (치료경험담) 운영 가이드[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:332:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:333:### 5.1 원칙[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:334:[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:335:- **[7m의료법[0m 제56조제2항제2호 — 환자에 관한 치료경험담 광고 금지**[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:336:- 본문 직접 인용 원칙 금지 (`CONTENT_STANDARDS.md` § 4.3 정합)[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:337:- 매체·방[7m식별[0m 법무 판정 (광고 해당 여부 + § 4 사전심의 대상 여부)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:338:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:339:### 5.2 P-101 Reviews 페이지 운영[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:340:[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:341:P-101 페이지 운영 시 **차단 기준 우선** — 다음에 해당하면 법무 검
수로도 치유되지 않고 발행 차단:
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:342:- 치료경험담 [7m광고[0m 형식의 직접 인용 — 본문에 환자 1인칭 사례·치료 [0m
[7m[0m효과 묘사를 그대로 노출 (CONTENT_STANDARDS § 4.3 "본문 직접 인용 원칙 금지" 정합)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:343:- 치료 효과 오인 우려 — § 3.2 단정 표현(반드시·확실히·100%) 결합[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:344:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:345:위 차단 기준을 통과한 콘텐츠에만 적용되는 운영:[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:346:- 모든 후기 콘텐츠에 ReviewPolicy(C-13) 적용
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:347:- ArticleType=review-case → `["medical", "legal"]` 모두 검수 (`RI
SK_LEVELS.md` § 6.2)
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:348:- [7m환자[0m 동의서·증빙 첨부 권장 (`ComplianceRecord.attachments`)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:349:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:350:### 5.3 P-101 미운영 시[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:351:[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:352:- DoctorProfile·TreatmentPage 본문에 [7m환자[0m 후기 인용 금지[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:353:- TrustMetric(누적 통계)은 후기 아님 — 사실 안내 + 기준 기간·범위[0m
[7m[0m (CT-01)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:354:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:355:---[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:359:### 6.1 원칙
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:360:
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:361:- **[7m의료법[0m 제56조제2항제6호 + 시행령 제23조제1항제6호** — 수술 장[0m
[7m[0m면·환부 등 혐오감을 일으킬 수 있는 사진·영상 광고 금지[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:362:- 전후사진은 본 호의 시행령 결합 영역 (수술 장면·환부 노출에 해당[0m
[7m[0m될 수 있음) + 사실 과장(제8호)·치료경험담(제2호) 결합 리스크[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:363:- 기본 차단 — `ReviewPolicy.beforeAfterPhotoAllowed = false` (`CO[0m
[7m[0mNTENT_STANDARDS.md` § 4.3 정합)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:364:[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:367:전후사진 노출은 다음 **2축의 적법성을 모두** 확보해야 발행 가능 —
 한쪽만으로는 부족:
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:368:
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:369:**축 1. 의료[7m광고[0m법 적법성** (필수):[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:370:- `beforeAfterPhotoAllowed = true` 설정[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:371:- 해당 콘텐츠의 ComplianceRecord(C-10) — `legalCounsel` + `legalC[0m
[7m[0mounselAt` + `attachments[]` (법무 의견서) 필수[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:372:- 시행령 제23조제1항제6호 (수술 장면·환부 등 혐오감 유발 사진·영
상 [7m광고[0m 금지) 위반 부재[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:373:- 시행령 제23조제1항제2호 (치료효과 단정·치료경험담) 위반 부재[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:374:[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:375:**축 2. [7m환자[0m 개인정보·초상권** (필수):
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:376:- [7m환자[0m 본인 동의서 첨부 (`attachments[]`)
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:377:- [7m개인정보[0m 보호법·초상권 적법성[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:378:[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:379:> ⚠️ [7m환자[0m 동의서는 개인정보·초상권 측면의 필요조건일 뿐 의료광고[0m
[7m[0m법 적법성을 보장하지 않음. 동의서 보유 = 발행 가능 아님.[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:380:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:381:### 6.3 자동 검출[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:382:[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:390:### 7.1 원칙
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:391:
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:392:- **[7m의료법[0m 제56조제2항제13호** — 비급여 진료비용의 할인·면제 광고[0m
[7m[0m로서 소비자를 속이거나 잘못 알게 할 우려가 있는 방법 금지 (시행령 제23조제1항제13호 결합)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:393:- 일괄 금지 아님 — 허위·불명확·압박형은 fail, 명확한 사실 고지는 [0m
[7m[0m법무 검수 후 발행 (§ 3.13 정합)[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:394:- 비급여 명시 의무 ([7m의료법[0m 시행규칙)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:395:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:396:### 7.2 분류[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:397:[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:457:| `nih.go.kr` | 국립보건연구원 |
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:458:| `khidi.or.kr` | 한국보건산업진흥원 |
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:459:| `law.go.kr` | 국가법령정보센터 — [7m의료법[0m·시행령·시행규칙·관련 법[0m
[7m[0m령 본문 인용 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:460:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:461:### 8.4 국제 학술·공공기관 — 원문 도메인만[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:462:[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:492:## 9. 한의 특유 표현 회색지대 (CS-04 해소)
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:493:
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:494:한의 진료의 특유 표현 — 의료[7m광고[0m법 위반 가능성과 한의 임상의 표현[0m
[7m[0m 자유 사이 회색지대.[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:495:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:496:### 9.1 회색지대 카테고리[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:497:[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:518:### 10.1 적용 원칙
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:519:
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:520:- [7m의료법[0m은 한국 영토 내 광고에 적용 — 외국어 콘텐츠도 한국 매체 [0m
[7m[0m노출 시 동일 적용[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:521:- 영문·중문·일문 사전 별도 — `data/compliance-rules/rules.medical[0m
[7m[0m-ad.en.yaml` 등[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:522:- 한국어 사전이 SoT — 다국어 사전은 한국어 룰의 의미 매핑[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:523:[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:538:---
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:539:
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:540:## 11. [7m의료법[0m 개정 이력 (사람 가독 SoT)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:541:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:542:본 § 11은 `data/compliance-rules/medical-law-tracking.yaml`의 사[0m
[7m[0m람 가독 사본. 두 SoT는 항상 동시 갱신.[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:543:[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:546:| 추적 항목 | 출처 | 갱신 주기 |
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:547:|---|---|---|
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:548:| [7m의료법[0m 제56조 (의료광고 금지) | 국가법령정보센터 | 분기 1회 + [0m
[7m[0m개정 즉시 |[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:549:| [7m의료법[0m 제57조 (사전심의) | 국가법령정보센터 | 분기 1회 + 개정 [0m
[7m[0m즉시 |[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:550:| [7m의료법[0m 시행령 제23조·24조 | 국가법령정보센터 | 분기 1회 + 개정 [0m
[7m[0m즉시 |[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:551:| [7m의료법[0m 시행규칙 광고 관련 조항 | 국가법령정보센터 | 분기 1회 |
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:552:| 의료[7m광고[0m심의위원회 운영규정 | 의료광고심의위원회 | 분기 1회 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:553:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:554:### 11.2 개정 이력 (실제 추적 — 운영 누적)[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:555:[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:558:| revisionId | lawSource | affectedArticles | revisionEffectiveDa
te | revisionType | sourceUrl | checkedAt | checkedBy | affectedRuleIds | staleScope | summary |
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:559:|---|---|---|---|---|---|---|---|---|---|---|
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:560:| `2026-Q2-medical-law-2026-04-07` | `[7m의료법[0m` | `["제56조 제2항",[0m
[7m[0m "제57조"]` | `2026-04-07` (법령 본문 시행일) | `reaffirmation` | https://www.law.go.kr/LSW/lsLawLinkInfo.do?chrClsCd=0[0m
[7m[0m10202&lsJoLnkSeq=1000916681 | `2026-05-14T00:00:00Z` (본 문서 v0.1 작성 시 본문 확인 일자) | `operator:seokcess@glitzy.[0m
[7m[0mkr` | `[]` (v0.1 시점 RiskRule 미작성) | `{ kind: "all" }` | v0.1 최초 작성 시 의료법 제56조·제57조 본문 [시행 2026. 4.[0m
[7m[0m 7.] 확인. RiskRule 카탈로그는 후속 |[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:561:| `2026-Q1-enforcement-decree-2026-02-10` | `[7m의료법[0m 시행령` | `["[0m
[7m[0m제23조", "제24조"]` | `2026-02-10` (시행령 본문 시행일) | `reaffirmation` | https://www.law.go.kr/lsLawLinkInfo.do?chrC[0m
[7m[0mlsCd=010202&lsJoLnkSeq=1011395655 | `2026-05-14T00:00:00Z` | `operator:seokcess@glitzy.kr` | `[]` | `{ kind: "all" }` |[0m
[7m[0m v0.1 시점 시행령 제23조·제24조 본문 [시행 2026. 2. 10.] 확인 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:562:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:563:> ⚠️ `revisionEffectiveDate`는 **법령 본문 명시 시행일** (예: `[[0m
[7m[0m시행 2026. 4. 7.]`). 본 문서 확인 일자는 `checkedAt` 필드. 둘 분리 운영.[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:564:[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:580:| ID | 항목 | 비고 |
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:581:|---|---|---|
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:582:| MA-03 | 인용 가능 도메인 — 출판사 DOI 페이지·논문 [7m식별[0m 자동 검[0m
[7m[0m증 (sciencedirect 등) | M3+ 운영 누적 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:583:| MA-04 | 다국어 RiskRule 사전 실제 구축 | M3 다국어 단계 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:584:| MA-05 | 한의 회색지대 사례 — 면역력·해독 등 효능 표현 정밀 분류[0m
[7m[0m | 운영 누적 후 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:585:| MA-06 | RiskRule.id 명세 확정 — 본 문서 § 3 예시 ID와 `rules.me[0m
[7m[0mdical-ad.yaml` 실제 ID | 자체 룰 checker 구현 시 |[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:595:| 항목 | 사유 |
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:596:|---|---|
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:597:| [7m의료법[0m 제56조제2항 15호 각 호의 **법문 전문 인용** | 본 문서는 [0m
[7m[0m카테고리·해석·운영 가이드 SoT. 법문 전문은 국가법령정보센터 원문(§ 11.2 sourceUrl) 직접 조회로 보완. 본 문서에 전문 인[0m
[7m[0m용 시 개정 추적 부담 + 갱신 지연 리스크 증가 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:598:| 개별 사례·처분 사례 카탈로그 | 운영 누적 후 별도 부록 — v1.0 범[0m
[7m[0m위 외 |[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:599:[0m
[7m[0m  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:600:---[0m
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:604:| 일자 | 버전 | 변경 |
  docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:605:|---|---|---|
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:606:| 2026-05-14 | v0.1 | 최초 작성 — [7m의료법[0m 제56조·제57조 해석, 금지[0m
[7m[0m 항목 카탈로그 11종(RiskRule.id 매핑), 사전심의 대상 판정, 환자 후기·전후사진·가격 운영 가이드, 인용 가능 외부 도메인 [0m
[7m[0m화이트리스트 3계열(학회·정부·국제 학술), 한의 특유 표현 회색지대, 다국어 표현 가이드, 의료법 개정 이력 추적 표 |[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:607:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 
지적 전건 수용)**: (1) § 3.12 외국인[7m환자[0m 국내광고 — **2단계 룰**(확정 fail / 불명확 content-gate+legal)로 분리. 법무 승[0m
[7m[0m인이 금지 광고를 발행 가능하게 만드는 오해 회피, (2) **MA-02 해소** — 자사 사이트 일평균 이용자 측정 책임을 **운영자(클[0m
[7m[0m라이언트 의료기관)**로 확정. § 12.1 해소 표 신설, (3) § 0 RiskRule.id를 "예시 ID" → "권장 ID 형식" 명문화 + `<category-[0m
[7m[0mkeyword>-<sequence>` kebab-case 패턴 명시. MA-06은 미결정 유지하되 v1.0 안정판 조건과 분리, (4) § 3.0 **canonical RiskR[0m
[7m[0mule + legalBasis[] 패턴** 신설 — 동일 본문 표현이 여러 법령 호와 결합 시 canonical RiskRule 1개 + 복수 조문 인용. **CON[0m
[7m[0mTENT_STANDARDS § 7.4 SimpleRiskRule·CompositeRiskRule에 `legalBasis: string[]` 필드 cascade** + **RISK_LEVELS § 3.3 JSO[0m
[7m[0mN Schema 검증 2종 추가** (형식 위반·tracking 카탈로그 미존재) |[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:608:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (9개 지적 전건 
수용)**: (1) § 3.2 — 시행령 제23조제1항제2호의 **3유형 묶음** 명시 (치료경험담·6개월 이하 임상경력·치료효과 단정). Risk
Rule.id 별도 추적, (2) § 2.4 "1:1 대응" 표현 완화 — "대체로 대응하나 일부 시행령 호는 의미 확장·혼합". 시행령 제2호 묶
음 예시 명시, (3) § 2.2 14호 + § 3.14 — **추천 표시는 예외 아님** 명확화 (가~라목 예외는 인증·보증 표시만), (4) § 3.14 
다목 "자격" 제거 — 자격은 제9호 별도 축, (5) § 3.12 외국인[7m환자[0m — `severity: content-gate` + `requiredApproverRoles: ["l[0m
[7m[0megal"]` 명시 + ComplianceRecord 기록 경로, (6) § 4.2 자사 웹사이트 사전심의 — `priorReviewRequired`·`legalCounsel`·`att[0m
[7m[0machments[]` 운영 감사 추적 경로 명시, (7) § 5.2 P-101 — **차단 기준 우선** 명시 (치료 효과 오인은 검수로 치유 안 됨). C[0m
[7m[0mONTENT_STANDARDS § 4.3 본문 직접 인용 원칙 정합, (8) § 6.2 전후사진 — **2축 적법성** 분리 (의료광고법 + 환자 개인정보·[0m
[7m[0m초상권). 동의서 보유=발행 가능 오해 회피, (9) § 8.3 law.go.kr — 의료법 본문 한정 → 시행령·시행규칙·관련 법령 포함으로 [0m
[7m[0m확장 |[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:609:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (12개 지적 전건 
수용)**: (1) § 0 High 등급 legalCounsel 필수 표현 정정 — LegalDocument 발행 + 룰별 `requiredApproverRoles`에 `legal` 포
함 시만 필수. High 자체는 `medical` 기본 요구, (2) § 2.4 시행령 제23조제1항 1~13호 → **1~14호**까지 명시. 법 본문 호와 
1:1 대응 명시, (3) § 2.4 시행령 제23조제3항 — 자사 홈페이지 [7m광고[0m에 대한 보건복지부장관 고시 근거 명시 (자사 사이트 판정[0m
[7m[0m 직결), (4) § 3.2 치료경험담 + 시행령 제23조제1항제2호 **6개월 이하 임상경력 광고** 결합 추가, (5) § 3.8 시행령 결합 — [0m
[7m[0m제2호가 아닌 **제8호** 1:1 대응으로 정정, (6) § 2.2 14호 + § 3.14 — "자신이 받지 아니한"으로 좁힘 → **원칙 금지 + 가~라[0m
[7m[0m목 예외** 구조로 정정. 가목 의료기관 인증·나목 공공기관·다목 다른 법령·라목 WHO/ISQua 명시, (7) § 3.15 — 시행령 1~14호 [0m
[7m[0m외에 독립 기준 없음을 명시. 개정 추적 자리표시로 상태 명확화, (8) **CONTENT_STANDARDS § 3.5 cascade** — `scholar.google[0m
[7m[0m.com`·`*.go.kr`·`*.or.kr` 예시 제거. 본 문서 § 8을 SoT로 직접 참조, (9) § 8.4 nih.gov·cdc.gov — `www.nih.gov/`·`www.cdc[0m
[7m[0m.gov/` 슬래시 추가 (§ 8.1 path 매칭 정책과 정합), (10) § 11.2 의료법 `revisionEffectiveDate` — `2026-04-07` (법령 본문 [0m
[7m[0m시행일)로 정정, (11) § 11.2 시행령 `revisionEffectiveDate` — `2026-02-10`로 정정. `checkedAt`은 본 문서 확인 일자로 분[0m
[7m[0m리, (12) MA-01 미결정 해소 — § 12.1 "의도적 범위 외" 신설로 법문 전문 인용은 의도적 제외 표시. v1.0 진입 가능 |[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:610:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (14개 지적 전건 
수용 — 호 번호 정확 정렬)**: (1)·(2)·(3)·(4) § 2.2 8~14호 정정 — 8호 사실 과장, 9호 자격·명칭(신설), 10호 기사형, 11호 
미심의, 12호 외국인[7m환자[0m, 13호 비급여 할인·면제 오인, 14호 상장·인증·보증·추천 (가~라목 예외). § 3.8~§ 3.14 카탈로그 호 [0m
[7m[0m번호 전부 재정렬, (5) § 2.4 시행령 제23조 위임 구조 정정 — 제1항은 각 호 구체 기준, 제2항은 14호라목 WHO/ISQua 예외, (6[0m
[7m[0m) § 2.5 시행령 제24조 제3~6항 자율심의기구 신고 체계, 제7항 면제 추가 항목, (7) § 4.2 사전심의 매체 표 — 신문·인터넷신[0m
[7m[0m문·정기간행물, 옥외광고물(현수막·벽보·전단·교통시설·교통수단·전광판) 분리, (8) § 4.4 면제 항목 — 의료법 제57조제3항 본[0m
[7m[0m문 4종 + 시행령 제24조제7항 추가 항목(개설자·개설연도·홈페이지 주소·진료일·진료시간·전문병원 지정·의료기관 인증 등) 분[0m
[7m[0m리 명시, (9) § 5·§ 6·§ 7 조문 인용 정정 — 제56조 1항 → 제2항제N호 (제2호·제6호·제13호), (10) § 3.12 외국인환자 — Intern[0m
[7m[0mationalSupport 회피 근거 표현 삭제, 법무 판단 명시, (11) § 3.13·§ 7 비급여 — "일괄 금지" → "압박형·허위·불명확 fail / [0m
[7m[0m사실 고지 content-gate" 정합, (12) § 8 화이트리스트 — 도메인 매칭·path prefix 매칭 정책 분리. nih.gov·cdc.gov는 www.* p[0m
[7m[0math 매칭으로 좁힘, (13) § 0 legalCounsel 필수 표현 정정 — LegalDocument + High 등급 + requiredApproverRoles=legal 룰에[0m
[7m[0m만, (14) § 0 data/compliance-rules/·medical-law-tracking.yaml 미생성 vs 동시 갱신 충돌 명확화 — checker 활성화 전 검증 [0m
[7m[0m유보, 활성화 후 동시 갱신 |[0m
> docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:611:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (13개 지적 전건 
수용 — [7m의료법[0m 조문 구조 전면 재작성)**: (1) § 2.2 의료법 제56조제2항 **15호 카탈로그**로 재구성 (이전 11종 오류 수정). [0m
[7m[0m비방·수술장면 노출·기사형·미심의·외국인환자 유치 국내광고·비급여 할인면제 오인·인증 부정사용·상장 부정사용 추가, (2) § [0m
[7m[0m2.1 제1항(비의료인 광고 금지·정의)과 제2항(금지 유형) 구조 분리 — 이전 "제1항 금지 항목" 표현 오류 정정, (3) § 3.1 평가[0m
[7m[0m받지 아니한 **신의료기술** 광고로 정정 (미승인 의료기기·약품은 약사법·의료기기법 별도), (4) § 3.4·§ 3.5·§ 3.6 등 호 번[0m
[7m[0m호 정정 (비교 4호·비방 5호·수술장면 6호·과대 8호·기사형 9호·미심의 10호 등), (5) § 3.6 수술 장면·환부 노출(시행령 결합)[0m
[7m[0m과 § 6 전후사진 보수적 운영 정책 구분, (6) § 4.1 제56조제3항 방송 광고 매체 자체 금지 명시 — TV·라디오 "심의 통과 시 가[0m
[7m[0m능" 오해 회피, (7) § 4.2 시행령 제24조제1항 4종 매체 + 제2항 SNS 매체 정확히 분류, (8) § 4.4 사전심의 면제 항목을 시행[0m
[7m[0m령 제24조제7항 한정 항목(성명·성별·면허종류·전문의 자격·전문과목·진료시간·진료과목)으로 좁힘. 일반 학력·경력 과잉 면제 [0m
[7m[0m정정, (9) § 1.2 SoT 분리표 — 표현 카테고리 원본은 `CONTENT_STANDARDS § 4`, 본 문서는 의료법 조문·매핑 SoT로 제한, (10) [0m
[7m[0m§ 8 인용 가능 도메인 화이트리스트 정밀화 — 와일드카드 제거·기관 단위 등록·원문/검색 구분·KoreaMed 등 한국 학술 추가·인[0m
[7m[0m정 않는 카테고리 명시, (11) § 0 data/compliance-rules/ 미생성 명시 — v0.1 시점 파일 부재. ID는 예시, (12) § 10.3 다국어[0m
[7m[0m — `PageMeta.inLanguage` + `InternationalSupport` 결합, 사전 결합 AND→**finding 합집합** 정정, (13) § 11.2 개정 이력 표[0m
[7m[0m를 `medical-law-tracking.yaml`과 동일 11개 컬럼(lawSource·affectedArticles·revisionType·checkedAt/By·affectedRuleIds·st[0m
[7m[0maleScope 등)으로 정합 + 시행령 별도 행 추가. MA-06 미결정 신설 |[0m


codex
3차 지적 대부분은 표면상 반영됐지만, 새로 추가된 ledger·동의철회·rotation 쪽에서 구현자가 바로 코드로 옮기기 어려운 빈칸이 보입니다. 특히 “애플리케이션 invariant”로 남긴 동시성 제어와 동의철회 매칭 키가 가장 위험합니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Select-String -Path docs\\features\\crm-sync.md -Pattern '"'^## 7'"\\.|"'^### 7'"\\.|raw PII|operational hints|PII 아님|displayHints|piiHash|crmExternalIdHash|marketing-only' -Context 1,3" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Select-String -Path docs\\features\\crm-sync.md -Pattern 'v0\\.3 §|동일|v0\\.4|49|AT-35|backward-compatible|CrmRecord에 operationalHints|displayHints migration' -Context 1,2" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Select-String -Path docs\\features\\crm-sync.md -Pattern 'NotificationEventType|AuditAction|sourceId|credentialVersionId|CrmSyncNotificationOutbox' -Context 1,4" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Select-String -Path docs\\features\\search-visibility.md -Pattern '13\\.5|13\\.10|7\\.3|outbox|SKIP LOCKED|stale reclaim' -Context 2,5" in C:\Users\assag\solution\website-exposure
 succeeded in 742ms:

  docs\features\crm-sync.md:2:
> docs\features\crm-sync.md:3:> **상태**: Draft [7mv0.4[0m (codex 자동 비평 3차 반영 — 17개 지적 전건 수용)[0m
[7m[0m  docs\features\crm-sync.md:4:> **작성일**: 2026-05-14[0m
[7m[0m  docs\features\crm-sync.md:5:> **소유자**: Glitzy[0m
  docs\features\crm-sync.md:48:| warning·지표·acceptance test 추가 | PATCH | 별개 | |
> docs\features\crm-sync.md:49:| **displayHints column 추가** (CS3-14) | **MINOR** | 별개 | read API output schema 변경
. [7mbackward-compatible[0m — 기본 nullable |[0m
[7m[0m  docs\features\crm-sync.md:50:| **displayHints column 제거·타입 변경** (CS3-14) | **MAJOR** | policyVersion 신규 | DB [0m
[7m[0mmigration 필수 |[0m
[7m[0m  docs\features\crm-sync.md:51:| **non-PII operational column 추가** (CS3-14) | **MINOR** | 별개 | column nullable + 운[0m
[7m[0m영자 화면 점진 노출 |[0m
> docs\features\crm-sync.md:52:| **CrmCredentialVersion.state enum 추가** (CS3-14) | **MINOR** | 별개 | 신규 상태는 [7mbac[0m
[7mkward-compatible[0m transition rule + 기존 worker 무영향 |[0m
[7m[0m  docs\features\crm-sync.md:53:| **CredentialVersion.state enum 제거·이름 변경** | **MAJOR** | policyVersion 신규 | mig[0m
[7m[0mration |[0m
[7m[0m  docs\features\crm-sync.md:54:| **DB table 추가** (CS3-14) | **MINOR** | 별개 | migration + invariant 표 추가. 기존 in[0m
[7m[0mvariant 무영향 |[0m
  docs\features\crm-sync.md:69:| CrmSyncRetryQueue | config(기본 5)·configurable | [60, 300, 1800, 7200, 21600]s |
> docs\features\crm-sync.md:70:| CrmSyncNotificationOutbox | 상수 5 | search-visibility § 7.3 SQL [7m동일[0m |[0m
[7m[0m  docs\features\crm-sync.md:71:[0m
[7m[0m  docs\features\crm-sync.md:72:### 1.3 본 문서가 다루지 않는 영역[0m
  docs\features\crm-sync.md:317:```ts
> docs\features\crm-sync.md:318:type RunSyncInput = { /* [7mv0.3 §[0m 3.3 동일 */ };[0m
> docs\features\crm-sync.md:319:type RunSyncResult = { /* [7mv0.3 §[0m 3.3 동일 */ };[0m
[7m[0m  docs\features\crm-sync.md:320:```[0m
[7m[0m  docs\features\crm-sync.md:321:[0m
  docs\features\crm-sync.md:363:| Salesforce Outbound Messages | XML SOAP | HMAC-SHA256(secret, rawBody) | `Sforce-Send
-Time` | XML `Id` | `timestamp + "." + bodySha256` | XML `SystemModstamp` |
> docs\features\crm-sync.md:364:| Salesforce Platform Events | JSON CometD | HMAC-SHA256 (orgId 기반) | `OrganizationId
+ReplayId` | `replayId` | [7m동일[0m | `replayId` |[0m
[7m[0m  docs\features\crm-sync.md:365:| HubSpot | JSON | HMAC-SHA256(secret, `method + url + body + timestamp`) | `X-HubSpot-[0m
[7m[0mRequest-Timestamp` | header 또는 body `eventId` | provider 정의 | `propertyChange.versionTimestamp` 또는 `updatedAt` |[0m
[7m[0m  docs\features\crm-sync.md:366:| generic-rest-api | JSON | HMAC-SHA256(secret, canonicalString) | config | config | co[0m
[7m[0mnfig | config (`versionTokenJsonPath`) |[0m
  docs\features\crm-sync.md:377:  parsedPayload: ParsedCrmPayload;                      // adapter별 정의
> docs\features\crm-sync.md:378:  source: "webhook" | "polling";                        // CS3-04 — webhook과 polling 
[7m동일[0m idempotency[0m
[7m[0m  docs\features\crm-sync.md:379:  receivedAt: Date;[0m
[7m[0m  docs\features\crm-sync.md:380:  ledgerId: string | null;                              // webhook 경로만 (polling은 nu[0m
[7m[0mll)[0m
  docs\features\crm-sync.md:388:**polling 경로의 idempotency (CS3-04)**:
> docs\features\crm-sync.md:389:- polling이 가져온 record도 [7m동일[0m `parsedPayload.crmExternalId + providerVersionToken` [0m
[7m[0m기반의 `CrmChangeIdentityLedger`(§ 13.13)에 unique 키로 통과 — webhook과 polling이 같은 변경을 중복 처리하지 않음[0m
[7m[0m  docs\features\crm-sync.md:390:[0m
[7m[0m  docs\features\crm-sync.md:391:### 3.4.4 CRM 측 changeIdentityKey 산정[0m
  docs\features\crm-sync.md:455:
> docs\features\crm-sync.md:456:#### 4.3.1 FieldAuthority — [7mv0.3 §[0m 4.3.1 동일[0m
[7m[0m  docs\features\crm-sync.md:457:[0m
[7m[0m  docs\features\crm-sync.md:458:#### 4.3.2 CAS WHERE 조건 (CS3-04 강화)[0m
  docs\features\crm-sync.md:475:
> docs\features\crm-sync.md:476:#### 4.3.3 ConflictRecord — [7mv0.3 §[0m 4.3.3 동일[0m
[7m[0m  docs\features\crm-sync.md:477:[0m
> docs\features\crm-sync.md:478:#### 4.3.4 manual escalate 결정표 — [7mv0.3 §[0m 4.3.4 동일[0m
[7m[0m  docs\features\crm-sync.md:479:[0m
[7m[0m  docs\features\crm-sync.md:480:#### 4.3.5 expectedCrmVersion 산정 (CS3-03 — 신규)[0m
  docs\features\crm-sync.md:487:| generic-rest-api | config `versionTokenJsonPath` 추출 후 type config | epoch ms 또는 
integer (config) |
> docs\features\crm-sync.md:488:| polling | provider별 list API의 `lastModified` 등 | [7m동일[0m |[0m
[7m[0m  docs\features\crm-sync.md:489:[0m
[7m[0m  docs\features\crm-sync.md:490:`providerVersionToken=null`인 provider는 expectedCrmVersion=현재 row.crm_version+1로 fa[0m
[7m[0mllback. 이 경우 lost update 검출 못함 — provider별 운영 위험 명시.[0m
  docs\features\crm-sync.md:543:
> docs\features\crm-sync.md:544:### 4.6 outbox — search-visibility § 7.2·§ 7.3 SQL [7m동일[0m
[7m[0m  docs\features\crm-sync.md:545:[0m
[7m[0m  docs\features\crm-sync.md:546:### 4.7 unregister 정책 표 (CS3-09 신규)[0m
  docs\features\crm-sync.md:560:| CrmWebhookNonceLedger | row 유지 | webhookNonceLedgerRetentionMinutes | RESTRICT |
> docs\features\crm-sync.md:561:| CrmChangeIdentityLedger | row 유지 | retentionDays.changeLog [7m동일[0m | RESTRICT |[0m
[7m[0m  docs\features\crm-sync.md:562:| CrmConsentWithdrawalLedger | row 유지 (legal hold) | retentionDays.consentWithdrawalL[0m
[7m[0medger | RESTRICT |[0m
[7m[0m  docs\features\crm-sync.md:563:| webhook endpoint | 즉시 미등록 (HTTP 404) | — | — |[0m
  docs\features\crm-sync.md:596:
> docs\features\crm-sync.md:597:### 6.1 NotificationEventType — v0.3 [7m동일[0m
[7m[0m  docs\features\crm-sync.md:598:[0m
> docs\features\crm-sync.md:599:### 6.2 outbox — search-visibility § 7.2 SQL [7m동일[0m
[7m[0m  docs\features\crm-sync.md:600:[0m
> docs\features\crm-sync.md:601:### 6.3 NotificationEvent 매핑 — v0.3 [7m동일[0m (sourceId에 credentialVersionId)[0m
[7m[0m  docs\features\crm-sync.md:602:[0m
[7m[0m  docs\features\crm-sync.md:603:---[0m
  docs\features\crm-sync.md:613:
> docs\features\crm-sync.md:614:### 7.2 RRN deny — v0.3 [7m동일[0m + recoverRrnFalsePositive audit cascade (CS3-11)[0m
[7m[0m  docs\features\crm-sync.md:615:[0m
[7m[0m  docs\features\crm-sync.md:616:### 7.3 raw PII 실시간 조회 — v1.x (CS-14)[0m
  docs\features\crm-sync.md:636:
> docs\features\crm-sync.md:637:### 8.1 핵심 지표 — v0.3 [7m동일[0m
[7m[0m  docs\features\crm-sync.md:638:[0m
[7m[0m  docs\features\crm-sync.md:639:### 8.2 acceptance test traceability 표 (CS3-15)[0m
  docs\features\crm-sync.md:678:| AT-34 | displayHints closed schema | 정규식 위반 → application validator reject | § 7
.1 |
> docs\features\crm-sync.md:679:| [7mAT-35[0m | displayHints migration | v0.3 → v0.4 column 추가 backward-compatible | § 10.3[0m
[7m[0m |[0m
[7m[0m  docs\features\crm-sync.md:680:| AT-36 | outbox idempotency | credential rotation 후 새 credentialVersion 만료 | § 6.3[0m
[7m[0m |[0m
[7m[0m  docs\features\crm-sync.md:681:| AT-37 | consent withdrawal | applyConsentWithdrawal + displayHints nulling | § 4.8 |[0m
  docs\features\crm-sync.md:692:| AT-48 | notification cascade | 4종 NotificationEventType emit | § 6.1 |
> docs\features\crm-sync.md:693:| AT-[7m49[0m | DATA_MODEL cascade | genericRestApiAdapter 동기화 | § 2.3 |[0m
[7m[0m  docs\features\crm-sync.md:694:[0m
[7m[0m  docs\features\crm-sync.md:695:---[0m
  docs\features\crm-sync.md:704:
> docs\features\crm-sync.md:705:[7mv0.3 §[0m 10.1 + 추가:[0m
[7m[0m  docs\features\crm-sync.md:706:- `provider="generic-rest-api"` + `genericRestApiAdapter` 4필드 중 누락[0m
[7m[0m  docs\features\crm-sync.md:707:- `pii.liveReadEnabled=true`[0m
  docs\features\crm-sync.md:715:
> docs\features\crm-sync.md:716:[7mv0.3 §[0m 10.2 + 추가:[0m
[7m[0m  docs\features\crm-sync.md:717:- **CAS WHERE 0 rows affected** (outbound·inbound 모두 양방향 version 검사 — CS3-04)[0m
[7m[0m  docs\features\crm-sync.md:718:- **CrmChangeIdentityLedger UNIQUE 충돌** (webhook + polling 중복) → 정상 dedupe (fail [0m
[7m[0m아님 — 정보 로그)[0m
  docs\features\crm-sync.md:724:
> docs\features\crm-sync.md:725:- [7mv0.4[0m cascade 신규:[0m
> docs\features\crm-sync.md:726:  - [7mCrmRecord에 operationalHints[0m* column 추가 (nullable)[0m
[7m[0m  docs\features\crm-sync.md:727:  - CrmChangeIdentityLedger 신설 (§ 13.13)[0m
[7m[0m  docs\features\crm-sync.md:728:  - CrmConsentWithdrawalLedger 신설 (§ 13.14)[0m
  docs\features\crm-sync.md:752:    | CrmWebhookNonceLedger | delete row | × |
> docs\features\crm-sync.md:753:    | CrmChangeIdentityLedger | delete row (changeLog와 [7m동일[0m retention) | × |[0m
[7m[0m  docs\features\crm-sync.md:754:    | CrmConsentWithdrawalLedger | **delete row만 만료 시 — legal hold default true** ([0m
[7m[0mCS3-09·10) | hold |[0m
[7m[0m  docs\features\crm-sync.md:755:    | CrmRecord.displayHints* | nulling (row 유지) | × |[0m
  docs\features\crm-sync.md:760:
> docs\features\crm-sync.md:761:[7mv0.3 §[0m 10.5 + 추가:[0m
[7m[0m  docs\features\crm-sync.md:762:- `providerVersionToken=null`인 provider 운영 — CAS 정확도 저하 경고[0m
[7m[0m  docs\features\crm-sync.md:763:- outbound-only + webhookSecret 설정됨 — config 정리 권고[0m
  docs\features\crm-sync.md:802:
> docs\features\crm-sync.md:803:### 11.4 [7mv0.4[0m 잔여 리스크 (CS3-16 — 실측 기반)[0m
[7m[0m  docs\features\crm-sync.md:804:[0m
[7m[0m  docs\features\crm-sync.md:805:| 영역 | 상태 | 비고 |[0m
  docs\features\crm-sync.md:822:| 2026-05-14 | v0.3 | codex 2차 비평 17 지적 반영 |
> docs\features\crm-sync.md:823:| 2026-05-14 | **[7mv0.4[0m** | **codex 3차 비평 17 지적 전건 수용 + REVIEW_WORKFLOW·DATA_MOD[0m
[7m[0mEL cascade**: (1) **DB 인벤토리 15 tables로 정정** — CrmChangeIdentityLedger·CrmConsentWithdrawalLedger 신설 (CS3-06), [0m
[7m[0m(2) **CredentialVersion·Integration state invariant 표** + rotating-revoked 잔재 제거 (CS3-01), (3) **NonceLedger key d[0m
[7m[0meliveryKind별 partial unique** — exactly-once / at-least-once+eventId / at-least-once-no-eventId·best-effort 3분기 (CS3[0m
[7m[0m-02), (4) **InboundProcessingContext + providerVersionToken** + provider별 expectedCrmVersion 산정 표 (CS3-03), (5) **C[0m
[7m[0mAS WHERE outbound도 crm_version 포함** + CrmChangeIdentityLedger 신설 (webhook + polling idempotency) (CS3-04), (6) **C[0m
[7m[0mrmConsentWithdrawalLedger + applyConsentWithdrawal command** + `crm-consent-withdrawal-applied` AuditAction (CS3-05), ([0m
[7m[0m7) **non-PII operational hints** entity별 column (CS3-07), (8) **DB CHECK dialect 명시** (PostgreSQL canonical · `\p{L}[0m
[7m[0m` 회피 · 행정구역 allowlist application validator) (CS3-08), (9) **§ 4.7 unregister 정책 표** 12행 + FK ON DELETE 정책 [0m
[7m[0m(CS3-09), (10) **purge worker SoT § 10.4** — cadence·batch·legal hold·failure reconcile + 테이블별 액션 (CS3-10), (11) [0m
[7m[0m**REVIEW_WORKFLOW § 10.2.1 cascade — RRN 2종 + consent withdrawal 1종 AuditAction 추가** (CS3-11), (12) **retry queue w[0m
[7m[0morker SQL search-visibility § 13.5 풀 전개** — claim·SourceAttempt insert·envelope recalc·stale reclaim·exhausted·perma[0m
[7m[0mnent 9단계 (CS3-12), (13) **DATA_MODEL C-08 v0.20 cascade — genericRestApiAdapter + CrmCredentialVersion 경계** (CS3-13[0m
[7m[0m), (14) **§ 1.1 변경 정책 — displayHints column·state enum·table 추가 SemVer 룰** 7행 추가 (CS3-14), (15) **§ 8.2 accep[0m
[7m[0mtance test 49 cases + § 10 traceability 표** (CS3-15), (16) **§ 11.4 잔여 리스크 실측 기반 정리** (CS3-16), (17) **`Ref[0m
[7m[0m<C-anything>`·rotating-revoked·중복 line·잘못된 테이블 수 문장 정정** (CS3-17) |[0m
[7m[0m  docs\features\crm-sync.md:824:[0m
[7m[0m  docs\features\crm-sync.md:825:---[0m
  docs\features\crm-sync.md:828:
> docs\features\crm-sync.md:829:### 13.1 `CrmIntegration` — v0.3 [7m동일[0m + `mode` 명시[0m
[7m[0m  docs\features\crm-sync.md:830:[0m
> docs\features\crm-sync.md:831:### 13.2 `CrmSyncLog` — v0.3 [7m동일[0m
[7m[0m  docs\features\crm-sync.md:832:[0m
> docs\features\crm-sync.md:833:### 13.3 `CrmSyncSourceAttempt` — v0.3 [7m동일[0m
[7m[0m  docs\features\crm-sync.md:834:[0m
> docs\features\crm-sync.md:835:### 13.4 `CrmSyncRetryQueue` — v0.3 [7m동일[0m
[7m[0m  docs\features\crm-sync.md:836:[0m
[7m[0m  docs\features\crm-sync.md:837:#### 13.4.1 worker SoT 풀 SQL (CS3-12 — search-visibility § 13.5 패턴 9단계)[0m
  docs\features\crm-sync.md:904:
> docs\features\crm-sync.md:905:[7mv0.3 §[0m 13.5 column + 추가:[0m
[7m[0m  docs\features\crm-sync.md:906:[0m
[7m[0m  docs\features\crm-sync.md:907:| 필드 | 타입 | required |[0m
  docs\features\crm-sync.md:922:
> docs\features\crm-sync.md:923:### 13.6 `CrmRecordChangeLog` — v0.3 [7m동일[0m + tombstone 케이스(consent withdrawal)는 chan[0m
[7m[0mgedFields에 `{tombstone: true}` 허용[0m
[7m[0m  docs\features\crm-sync.md:924:[0m
> docs\features\crm-sync.md:925:### 13.7 `CrmFieldMapping` — v0.3 [7m동일[0m
[7m[0m  docs\features\crm-sync.md:926:[0m
> docs\features\crm-sync.md:927:### 13.8 `CrmConflictRecord` — v0.3 [7m동일[0m
[7m[0m  docs\features\crm-sync.md:928:[0m
> docs\features\crm-sync.md:929:### 13.9 `CrmCredentialAuditLog` — v0.3 [7m동일[0m
[7m[0m  docs\features\crm-sync.md:930:[0m
> docs\features\crm-sync.md:931:### 13.10 `CrmRateLimitState` — v0.3 [7m동일[0m
[7m[0m  docs\features\crm-sync.md:932:[0m
> docs\features\crm-sync.md:933:### 13.11 `CrmCredentialVersion` — v0.3 [7m동일[0m
[7m[0m  docs\features\crm-sync.md:934:[0m
[7m[0m  docs\features\crm-sync.md:935:### 13.12 `CrmWebhookNonceLedger` (CS3-02 — deliveryKind별 partial unique 재설계)[0m
  docs\features\crm-sync.md:945:
> docs\features\crm-sync.md:946:webhook + polling [7m동일[0m 변경 idempotency 보장.[0m
[7m[0m  docs\features\crm-sync.md:947:[0m
[7m[0m  docs\features\crm-sync.md:948:| 필드 | 타입 | required |[0m
  docs\features\crm-sync.md:958:| `processedSyncLogId` | UUID | optional |
> docs\features\crm-sync.md:959:| `expiresAt` | Date | ✅ — retentionDays.changeLog [7m동일[0m |[0m
[7m[0m  docs\features\crm-sync.md:960:[0m
[7m[0m  docs\features\crm-sync.md:961:**Constraints**: `UNIQUE(changeIdentityKey)`. `FK integrationId`.[0m
  docs\features\crm-sync.md:984:
> docs\features\crm-sync.md:985:### 13.15 `CrmSyncNotificationOutbox` — [7mv0.3 §[0m 13.13 동일[0m
[7m[0m  docs\features\crm-sync.md:986:[0m
[7m[0m  docs\features\crm-sync.md:987:---[0m
  docs\features\crm-sync.md:1004:| 13.12 | `CrmWebhookNonceLedger` | webhookNonceLedgerRetentionMinutes |
> docs\features\crm-sync.md:1005:| 13.13 | `CrmChangeIdentityLedger` | retentionDays.changeLog [7m동일[0m |[0m
[7m[0m  docs\features\crm-sync.md:1006:| 13.14 | `CrmConsentWithdrawalLedger` | legal hold default — retentionDays.consentWit[0m
[7m[0mhdrawalLedger (legalHold=false 시) |[0m
[7m[0m  docs\features\crm-sync.md:1007:| 13.15 | `CrmSyncNotificationOutbox` | retentionDays.notificationOutbox |[0m


 succeeded in 729ms:

  docs\features\search-visibility.md:5:> **소유자**: Glitzy
  docs\features\search-visibility.md:6:> **상위 문서**: `docs/ARCHITECTURE.md` § 11.1·§ 11.2 / `docs/features/analytics
-reporting.md` v1.0
> docs\features\search-visibility.md:7:> **목적**: 사이트 전체·페이지별 검색 가시성 모니터링 (노출 추세·AI 브리핑 인용·
통합 영역 진입·외부 백링크 변동). 신호별 detector + state transition + 이상 감지·[7moutbox[0m 알림. 자체 SERP 크롤링은 법무 [0m
[7m[0m승인 게이트(approvedScope 구조화) 필수.[0m
[7m[0m  docs\features\search-visibility.md:8:> **연관 문서**: analytics-reporting v1.0 § 3.4, notifications v1.0, REVIEW_WORK[0m
[7m[0mFLOW § 9 (5종 cascade 완료), DATA_MODEL C-08 v0.16 (SearchVisibilityConfig + SerpCrawlerApprovedScope), SEARCH_STANDARD[0m
[7m[0mIZATION § 3·§ 4·§ 5[0m
[7m[0m  docs\features\search-visibility.md:9:[0m
[7m[0m  docs\features\search-visibility.md:10:---[0m
[7m[0m  docs\features\search-visibility.md:11:[0m
[7m[0m  docs\features\search-visibility.md:12:## 0. 한 페이지 요약[0m
  docs\features\search-visibility.md:13:
  docs\features\search-visibility.md:14:- **Feature 식별자**: `search-visibility`
> docs\features\search-visibility.md:15:- **핵심 책임**: source 3종 모니터링·신호별 detector·state transition·이상 감지
·[7moutbox[0m 알림·대시보드 read API[0m
[7m[0m  docs\features\search-visibility.md:16:- **mode 2종**: `alerting`(기본·notifications 필수) / `monitor-only`(notificati[0m
[7m[0mons 비활성 허용. 알림 미발송)[0m
[7m[0m  docs\features\search-visibility.md:17:- **데이터 source 3종**: analytics-derived / serp-crawler(법무 승인 게이트 필수[0m
[7m[0m) / backlink-source[0m
[7m[0m  docs\features\search-visibility.md:18:- **신호 4종 + detector 분리**: exposureTrend(EWMA·percentile) / aiBriefingCita[0m
[7m[0mtion(state transition) / unifiedRankingPresence(rank bucket transition) / backlinkChange(weekly delta)[0m
[7m[0m  docs\features\search-visibility.md:19:- **query set 자동 산출** (vs keyword-monitoring): analytics-derived(top-N impr[0m
[7m[0messions) 또는 sitemap-derived(SEARCH_STANDARDIZATION § 4)[0m
> docs\features\search-visibility.md:20:- **DB 인벤토리**: **9 tables** — VisibilitySignalSnapshot·MonitoringLog·Monito
ringSourceAttempt·**SearchVisibilityCollectionRetryQueue**·AnomalyRecord·VisibilityState·SerpCrawlerArtifact·BacklinkSn
apshot·AnomalyNotification[7mOutbox[0m
[7m[0m  docs\features\search-visibility.md:21:[0m
[7m[0m  docs\features\search-visibility.md:22:---[0m
[7m[0m  docs\features\search-visibility.md:23:[0m
[7m[0m  docs\features\search-visibility.md:24:## 1. 일반 규약[0m
[7m[0m  docs\features\search-visibility.md:25:[0m
  docs\features\search-visibility.md:46:- 자격증명·policyVersion·approvedScope SoT는 DATA_MODEL C-08
  docs\features\search-visibility.md:47:- sitemap·canonical·robots 입력 SoT는 SEARCH_STANDARDIZATION § 3·§ 4·§ 5
> docs\features\search-visibility.md:48:- 본 문서 = 신호 정의·detector·state·이상 감지·[7moutbox[0m 알림 SoT + 내부 데이터 구[0m
[7m[0m조 SoT (§ 13)[0m
[7m[0m  docs\features\search-visibility.md:49:[0m
[7m[0m  docs\features\search-visibility.md:50:### 1.2.1 공통 retry taxonomy (SV2-15 신설)[0m
[7m[0m  docs\features\search-visibility.md:51:[0m
> docs\features\search-visibility.md:52:본 Feature는 2종 retry 구조 — SearchVisibilityCollectionRetryQueue (source 수집
)·AnomalyNotification[7mOutbox[0m (알림 발송). 공통 의미:[0m
[7m[0m  docs\features\search-visibility.md:53:[0m
[7m[0m  docs\features\search-visibility.md:54:| 개념 | 의미 |[0m
[7m[0m  docs\features\search-visibility.md:55:|---|---|[0m
[7m[0m  docs\features\search-visibility.md:56:| `attempts` | 누적 시도 횟수 |[0m
[7m[0m  docs\features\search-visibility.md:57:| `maxAttempts` | 자동 재시도 상한 |[0m
  docs\features\search-visibility.md:65:|---|---|---|
  docs\features\search-visibility.md:66:| SearchVisibilityCollectionRetryQueue | `config.collectionRetryQueue.maxAttemp
ts` (기본 3) — configurable |
> docs\features\search-visibility.md:67:| AnomalyNotification[7mOutbox[0m | **상수 5** — 운영 단순성 |[0m
[7m[0m  docs\features\search-visibility.md:68:[0m
[7m[0m  docs\features\search-visibility.md:69:### 1.3 본 문서가 다루지 않는 영역[0m
[7m[0m  docs\features\search-visibility.md:70:[0m
[7m[0m  docs\features\search-visibility.md:71:- 측정 데이터 수집 자체 — analytics-reporting[0m
[7m[0m  docs\features\search-visibility.md:72:- 사용자 지정 키워드 모니터링 — keyword-monitoring (후속)[0m
  docs\features\search-visibility.md:224:|---|---|---|
  docs\features\search-visibility.md:225:| 실행 command | `runMonitoring(input)` | 모니터링 cycle |
> docs\features\search-visibility.md:226:| 실행 command | `detectAnomalies(input)` | 이상 감지 + [7moutbox[0m enqueue (alerti[0m
[7m[0mng 모드) |[0m
[7m[0m  docs\features\search-visibility.md:227:| read API | `queryVisibilitySignals(input)` | 대시보드·다른 Feature 조회 |[0m
> docs\features\search-visibility.md:228:| 운영 command | `enqueue[7mOutbox[0mForExistingAnomalies(window, severity)` | SV2-1[0m
[7m[0m4 — mode 변경 후 retroactive enqueue (운영자 명시) |[0m
[7m[0m  docs\features\search-visibility.md:229:[0m
[7m[0m  docs\features\search-visibility.md:230:### 3.2 MonitoringInput·Result[0m
[7m[0m  docs\features\search-visibility.md:231:[0m
[7m[0m  docs\features\search-visibility.md:232:`runMonitoring` 호출 패턴은 analytics-reporting `runCollection`과 동일 (canoni[0m
[7m[0mcalSources canonicalization·forceRefresh·refreshIntentId·manifestSnapshotVersion freeze). `canonicalSignals`도 동일 패[0m
[7m[0m턴 추가.[0m
[7m[0m  docs\features\search-visibility.md:233:[0m
  docs\features\search-visibility.md:336:- 매 cycle 통합 영역 노출 query별 rank 추출 (serp-crawler)
  docs\features\search-visibility.md:337:- bucket 매핑 → 직전 bucket과 비교 → transition 발생 시 AnomalyRecord 저장
> docs\features\search-visibility.md:338:- `transitionAlertOnBucketChange=true` 시 detectAnomalies가 [7moutbox[0m enqueue (al[0m
[7m[0merting 모드)[0m
[7m[0m  docs\features\search-visibility.md:339:- detectorOutput shape (§ 3.3)[0m
[7m[0m  docs\features\search-visibility.md:340:[0m
[7m[0m  docs\features\search-visibility.md:341:**state transition table** (SV3-07):[0m
[7m[0m  docs\features\search-visibility.md:342:[0m
[7m[0m  docs\features\search-visibility.md:343:| 전이 (previous → current) | AnomalyRecord 저장 | eventType | notify |[0m
  docs\features\search-visibility.md:344:|---|---|---|---|
> docs\features\search-visibility.md:345:| `unknown` → `bucket:*` (첫 관측) | ✅ severity=info | (없음 — info는 [7moutbox[0m [0m
[7m[0m미enqueue) | ❌ (SV4-04 rationale: query별 baseline initialization 성격이라 알림 제외. 첫 모니터링 cycle 다수 query에서 [0m
[7m[0m동시 발생 가능해 알림 noise 회피. 대비 — `ai-briefing-citation-first-detected`는 site-level 비즈니스 이벤트라 매트릭스[0m
[7m[0m에서 outbox enqueue) |[0m
[7m[0m  docs\features\search-visibility.md:346:| `bucket:a` → `bucket:b` (개선·악화) | ✅ severity=warning (b가 a보다 worse) /[0m
[7m[0m info (better) | `search-visibility-anomaly-warning` (worse일 때만) | ✅ (worse일 때) |[0m
[7m[0m  docs\features\search-visibility.md:347:| `bucket:*` → `absent` (SERP 결과에서 제거) | ✅ severity=critical | `search-v[0m
[7m[0misibility-anomaly-critical` | ✅ |[0m
[7m[0m  docs\features\search-visibility.md:348:| `absent` → `bucket:*` (복귀) | ✅ severity=info, direction="restored" | (없음[0m
[7m[0m) | ❌ |[0m
[7m[0m  docs\features\search-visibility.md:349:| crawl `degraded`·`failed` → 상태 hold | ❌ (state 갱신 안 함, suppression led[0m
[7m[0mger 적용) | (없음) | ❌ |[0m
[7m[0m  docs\features\search-visibility.md:350:| `unknown` → `absent` (첫 관측이 absent) | ❌ (state unknown → absent 직접 전[0m
[7m[0m이 안 함, 첫 bucket 관측 전까지 unknown 유지) | (없음) | ❌ |[0m
  docs\features\search-visibility.md:424:---
  docs\features\search-visibility.md:425:
> docs\features\search-visibility.md:426:## 7. 알림 ([7moutbox[0m 패턴 + eventType 기반 enqueue)[0m
[7m[0m  docs\features\search-visibility.md:427:[0m
[7m[0m  docs\features\search-visibility.md:428:### 7.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 — cascade 완료)[0m
[7m[0m  docs\features\search-visibility.md:429:[0m
[7m[0m  docs\features\search-visibility.md:430:5종 매트릭스 그대로 — v0.2 § 7.1 유지.[0m
[7m[0m  docs\features\search-visibility.md:431:[0m
> docs\features\search-visibility.md:432:### 7.2 [7moutbox[0m enqueue 조건 — eventType 기반 (SV2-13 정정)[0m
[7m[0m  docs\features\search-visibility.md:433:[0m
[7m[0m  docs\features\search-visibility.md:434:`shouldNotify(eventType, mode)` 표:[0m
[7m[0m  docs\features\search-visibility.md:435:[0m
[7m[0m  docs\features\search-visibility.md:436:| eventType | severity 매핑 | mode="alerting" | mode="monitor-only" |[0m
[7m[0m  docs\features\search-visibility.md:437:|---|---|---|---|[0m
  docs\features\search-visibility.md:442:| `ai-briefing-citation-lost` | lost state transition | ✅ enqueue | ❌ |
  docs\features\search-visibility.md:443:
> docs\features\search-visibility.md:444:### [7m7.3[0m 발송 흐름 — outbox SQL[0m
[7m[0m  docs\features\search-visibility.md:445:[0m
> docs\features\search-visibility.md:446:v0.2 § 7.2 [7moutbox[0m SQL 유지 + analytics-reporting 패턴 동일 (SKIP LOCKED + atte[0m
[7m[0mmpts<5 + permanent 전이).[0m
[7m[0m  docs\features\search-visibility.md:447:[0m
[7m[0m  docs\features\search-visibility.md:448:### 7.4 NotificationEvent 필드 매핑 (SV5-04 — eventType별 명시)[0m
[7m[0m  docs\features\search-visibility.md:449:[0m
[7m[0m  docs\features\search-visibility.md:450:| eventType | contentRef | contentTitle | metadata 필수 필드 |[0m
[7m[0m  docs\features\search-visibility.md:451:|---|---|---|---|[0m
  docs\features\search-visibility.md:459:- `recipients`: REVIEW_WORKFLOW § 9.1.1 매트릭스 수신자 산정 결과 AdminUser fa
n-out
  docs\features\search-visibility.md:460:- `criticality`: § 9.1.1 매트릭스 값
> docs\features\search-visibility.md:461:- `createdAt`: detectedAt 또는 [7moutbox[0m enqueue 시각[0m
[7m[0m  docs\features\search-visibility.md:462:[0m
> docs\features\search-visibility.md:463:DeliveryResult 처리 — v0.2 § [7m7.3[0m outbox claim 매핑 동일.[0m
[7m[0m  docs\features\search-visibility.md:464:[0m
> docs\features\search-visibility.md:465:### 7.5 mode 변경 정책 + retroactive [7moutbox[0m command (SV2-14·SV3-06 closure)[0m
[7m[0m  docs\features\search-visibility.md:466:[0m
> docs\features\search-visibility.md:467:- 기본: monitor-only → alerting 전환 시 **기존 AnomalyRecord에 retroactive [7mout[0m
[7mbox[0m 생성 금지**. 신규 anomaly만 발송[0m
> docs\features\search-visibility.md:468:- 운영자 명시 액션 `enqueue[7mOutbox[0mForExistingAnomalies(window, severity, dryRun[0m
[7m[0m)` (§ 3.1):[0m
[7m[0m  docs\features\search-visibility.md:469:[0m
[7m[0m  docs\features\search-visibility.md:470:**Command contract**:[0m
[7m[0m  docs\features\search-visibility.md:471:- **권한**: `super-admin` 전용 (REVIEW_WORKFLOW § 11.1 AdminUserRole). operato[0m
[7m[0mr는 본 액션 호출 불가 — retroactive 발송은 운영 영향 큰 액션이므로 권한 한정[0m
[7m[0m  docs\features\search-visibility.md:472:- **입력**: `window: {start, end}`·`severity: ("warning"|"critical")[]`·`dryRu[0m
[7m[0mn: boolean (default true)`[0m
[7m[0m  docs\features\search-visibility.md:473:- **dryRun=true**: 영향받을 AnomalyRecord 목록만 반환 (실제 enqueue 없음). 운[0m
[7m[0m영자 검토 후 dryRun=false로 재호출[0m
> docs\features\search-visibility.md:474:- **dryRun=false**: window 내 AnomalyRecord 중 [7moutbox[0m 미존재(AnomalyNotificati[0m
[7m[0monOutbox.anomalyRecordId join 없음) + severity 조건 충족만 enqueue. UNIQUE(anomalyRecordId)로 중복 방지[0m
[7m[0m  docs\features\search-visibility.md:475:- **sourceEventId 산정** (SV4-05 — 정책 버전 변경에도 재발송 금지):[0m
[7m[0m  docs\features\search-visibility.md:476:  - `sourceEventId = hash("search-visibility:" + anomalyRecordId + eventType)`[0m
[7m[0m  docs\features\search-visibility.md:477:  - `searchVisibilityPolicyVersion` 미포함 — 정책 변경(매트릭스 신규 version) [0m
[7m[0m시에도 동일 anomaly 재발송 금지 의도[0m
[7m[0m  docs\features\search-visibility.md:478:  - retroactiveBatchId 미포함 — 동일 anomaly에 재호출 시 동일 sourceEventId 유[0m
[7m[0m지 (notifications idempotent receipt가 중복 발송 차단)[0m
> docs\features\search-visibility.md:479:  - `UNIQUE(anomalyRecordId)`로 [7moutbox[0m 측 차단 + sourceEventId hash 안정성으로[0m
[7m[0m 양층 보호[0m
[7m[0m  docs\features\search-visibility.md:480:- **audit log** (SV5-02): action=`search-visibility-retroactive-enqueue-reques[0m
[7m[0mted` (REVIEW_WORKFLOW § 10.2.1 cascade 완료):[0m
[7m[0m  docs\features\search-visibility.md:481:  - `contentRef = "instance:" + instanceId` (synthetic — batch 단위 액션이라 [0m
[7m[0m단일 콘텐츠 ref 없음)[0m
[7m[0m  docs\features\search-visibility.md:482:  - `metadata = { windowStart, windowEnd, severity: ("warning"|"critical")[], [0m
[7m[0mdryRun, matchedCount, enqueuedCount, retroactiveBatchId }`[0m
[7m[0m  docs\features\search-visibility.md:483:  - `actorId = AdminUser.@id` (super-admin), `actorRole = "super-admin"`[0m
> docs\features\search-visibility.md:484:- **SLA**: window 내 N개 anomaly enqueue 후 N분 내 처리 (notifications [7moutbox[0m [0m
[7m[0mworker 의존)[0m
[7m[0m  docs\features\search-visibility.md:485:[0m
[7m[0m  docs\features\search-visibility.md:486:---[0m
[7m[0m  docs\features\search-visibility.md:487:[0m
[7m[0m  docs\features\search-visibility.md:488:## 8. 운영 지표[0m
[7m[0m  docs\features\search-visibility.md:489:[0m
  docs\features\search-visibility.md:585:| 2026-05-14 | v0.4 | codex 3차 (10 지적 전건 수용)
  docs\features\search-visibility.md:586:| 2026-05-14 | v0.5 | codex 4차 (7 지적 전건 수용)
> docs\features\search-visibility.md:587:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건
 수용)**: (1) SV-13 해소된 미결정으로 이동 (SV5-01), (2) **retroactive audit metadata shape 명시** — contentRef="instan
ce:{instanceId}" synthetic·metadata 필수 필드(windowStart·End·severity·dryRun·matchedCount·enqueuedCount·retroactiveBat
chId)·actorRole="super-admin" (SV5-02), (3) **unifiedRankingPresence rank nullability** — previousRank/currentRank를 `n
umber | null`로 변경. absent/restored 전이 시 null 규칙 (SV5-03), (4) **NotificationEvent 필드 매핑 표 복원** — eventTy
pe별 contentRef/contentTitle/metadata 명시. monitoring-failed는 synthetic contentRef + sourceEventId fallback (SV5-04),
 (5) 변경 이력 operations 잔재 → super-admin 전용으로 정정 (SV5-05): (1) **retroactive command 권한 super-admin 전용** 
— operations role 미존재 정정 (SV4-01), (2) **REVIEW_WORKFLOW § 10.2.1 cascade** — `search-visibility-retroactive-enque
ue-requested` AuditAction 추가. SV-13 해소 (SV4-02), (3) **§ 3.3 exposureTrend detectorOutput shape § 4.1과 통일** — sc
ore·actualPercentile·thresholdPercentile (SV4-03), (4) **first-detected 정책 rationale** — unifiedRankingPresence는 que
ry baseline initialization, AI briefing은 site-level business event (SV4-04), (5) **sourceEventId hash에서 policyVersio
n 제거** — 정책 변경 시 재발송 금지 의도. § [7m13.10[0m 정합 (SV4-05), (6) **severity escalation 의도 명시** — warning → crit[0m
[7m[0mical 상승은 별도 anomaly (SV4-06), (7) **v1.0 blobStorage.provider="s3"만 build-pass** — GCS/Azure는 SV-06b 후속 (SV4-0[0m
[7m[0m7): (1) **exposureTrend percentile config 반영 + target aggregation SoT** — score 산식·detectorOutput에 actualPercentil[0m
[7m[0me/thresholdPercentile (SV3-01·02), (2) **SerpCrawlerApprovedScope boolean 정정** — allowLoginState/allowCaptchaBypass r[0m
[7m[0mequired=false + default=false (DATA_MODEL cascade·SV3-03), (3) **crawlerArtifact retention 평가 순서** — serpCrawler.en[0m
[7m[0mabled=false 시 skip (SV3-04), (4) **SearchVisibilityCollectionRetryQueue worker SoT 쿼리 복제** — analytics-reporting §[0m
[7m[0m 4.3 패턴(SKIP LOCKED·advisory lock·envelope 재계산·lock ordering invariant) (SV3-05), (5) **retroactive outbox command[0m
[7m[0m contract closure** — super-admin 전용 권한(v0.5에서 좁힘)·dryRun·sourceEventId hash·audit cascade SV-13 (SV3-06), (6) [0m
[7m[0m**unifiedRankingPresence state transition table** — 6종 전이별 AnomalyRecord·eventType·notify 매핑 (SV3-07), (7) **anom[0m
[7m[0maly suppression ledger** — exposureTrend·backlinkChange state machine 없는 signal용 (SV3-08), (8) **blob isolation IAM [0m
[7m[0m구체화** — canonical object key format·S3 IAM condition 예시·signed URL refresh SV-14 (SV3-09), (9) **SV-10 해소** + SV[0m
[7m[0m-06b 부분 분리 (SV3-10), (10) **SV-13·SV-14 신규** |[0m
[7m[0m  docs\features\search-visibility.md:588:[0m
[7m[0m  docs\features\search-visibility.md:589:---[0m
[7m[0m  docs\features\search-visibility.md:590:[0m
[7m[0m  docs\features\search-visibility.md:591:## 13. 본 Feature 내부 데이터 구조 (admin DB 9 tables)[0m
[7m[0m  docs\features\search-visibility.md:592:[0m
  docs\features\search-visibility.md:622:analytics-reporting CollectionSourceAttempt 동일 패턴 + `skipped-legal-out-of-
scope`·`skipped-baseline-warmup`·`skipped-degraded` status 추가.
  docs\features\search-visibility.md:623:
> docs\features\search-visibility.md:624:### [7m13.5[0m `SearchVisibilityCollectionRetryQueue` (SV2-07 신설 — 9번째 table)[0m
[7m[0m  docs\features\search-visibility.md:625:[0m
[7m[0m  docs\features\search-visibility.md:626:**worker SoT 쿼리** (SV3-05 — analytics-reporting § 4.3 패턴 복제):[0m
[7m[0m  docs\features\search-visibility.md:627:[0m
[7m[0m  docs\features\search-visibility.md:628:```sql[0m
[7m[0m  docs\features\search-visibility.md:629:-- worker claim[0m
  docs\features\search-visibility.md:635:  ORDER BY scheduled_for
  docs\features\search-visibility.md:636:  LIMIT 10
> docs\features\search-visibility.md:637:  FOR UPDATE [7mSKIP LOCKED[0m
[7m[0m  docs\features\search-visibility.md:638:)[0m
[7m[0m  docs\features\search-visibility.md:639:RETURNING *;[0m
[7m[0m  docs\features\search-visibility.md:640:[0m
[7m[0m  docs\features\search-visibility.md:641:-- attemptNumber 동시성 안전 (analytics-reporting AR3-02 패턴):[0m
[7m[0m  docs\features\search-visibility.md:642:--   1. queue row claim 후 (monitoringLogId, source) advisory lock acquire[0m
  docs\features\search-visibility.md:716:v0.2 § 13.7 유지 + `normalizedAuthorityScore`를 **optional**로 정정 (variant 
함수 SV-09 미확정 시 detector는 providerMetricValue로 작동).
  docs\features\search-visibility.md:717:
> docs\features\search-visibility.md:718:### [7m13.10[0m `AnomalyNotificationOutbox` (SV2-13 enqueue 조건 정합 — eventType 기[0m
[7m[0m반)[0m
[7m[0m  docs\features\search-visibility.md:719:[0m
[7m[0m  docs\features\search-visibility.md:720:v0.2 § 13.8 스키마 유지 + 다음 정정:[0m
[7m[0m  docs\features\search-visibility.md:721:- enqueue 조건: § 7.2 shouldNotify 표 적용[0m
[7m[0m  docs\features\search-visibility.md:722:- **sourceEventId** 산식 (SV4-05): `hash("search-visibility:" + anomalyRecordI[0m
[7m[0md + eventType)` — policyVersion 미포함 (정책 변경 시 재발송 금지)[0m
> docs\features\search-visibility.md:723:- `UNIQUE(anomalyRecordId)` 유지 — 동일 anomaly 1 [7moutbox[0m 1건만[0m
[7m[0m  docs\features\search-visibility.md:724:[0m
[7m[0m  docs\features\search-visibility.md:725:---[0m


 succeeded in 775ms:

  docs\features\crm-sync.md:6:> **상위 문서**: `docs/ARCHITECTURE.md` § 11.1
> docs\features\crm-sync.md:7:> **목적**: 클라이언트 의료기관 CRM과 솔루션 사이의 양방향 데이터 동기화. solution DB는 *
*[7mraw PII[0m 저장 금지** (closed-schema displayHints + non-PII operational columns만). webhook(실시간) + polling(배치).[0m
[7m[0m  docs\features\crm-sync.md:8:> **연관 문서**:[0m
[7m[0m  docs\features\crm-sync.md:9:> - 알림·audit → notifications + REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (cascade 완료 — 4종 Not[0m
[7m[0mificationEventType·7종 AuditAction)[0m
[7m[0m  docs\features\crm-sync.md:10:> - 자격증명·식별자·policyVersion → DATA_MODEL C-08 v0.20 (`crmSyncConfig`·`crmSyncPolic[0m
[7m[0myVersion`·`genericRestApiAdapter` — CS3-13)[0m
  docs\features\crm-sync.md:18:- **Feature 식별자**: `crm-sync`
> docs\features\crm-sync.md:19:- **핵심 책임**: (a) 외부 CRM 양방향 sync, (b) field-level mapping + record-level CAS 충
돌 해결, (c) webhook(실시간) + polling(배치), (d) **solution DB [7mraw PII[0m 저장 금지** (closed-schema displayHints + non-P[0m
[7m[0mII operational hints), (e) DPA·credential rotation·만료 알림, (f) 환자 동의 철회 tombstone (CS3-05)[0m
[7m[0m  docs\features\crm-sync.md:20:- **vs ReservationPage(C-20)**: C-20은 콘텐츠 페이지. 본 Feature는 ReservationSubmission[0m
[7m[0m·Inquiry·ConversionEvent·Contact 운영 이벤트 sync[0m
[7m[0m  docs\features\crm-sync.md:21:- **provider 3종 (v1.0)**: `salesforce`·`hubspot`·`generic-rest-api`. `korean-emr` v1.x [0m
[7m[0m(CS-13)[0m
[7m[0m  docs\features\crm-sync.md:22:- **운영 모드 2종**: `bi-directional`·`outbound-only`[0m
  docs\features\crm-sync.md:23:- **sync entity 4종 (v1.0)**: `reservation`·`contact`·`inquiry`·`conversion-event`. `app
ointment` v1.x (CS-12)
> docs\features\crm-sync.md:24:- **PII 정책**: [7mraw PII[0m 저장 금지. liveRead v1.x (CS-14). v1.0 화면은 displayHints + non[0m
[7m[0m-PII operational hints[0m
[7m[0m  docs\features\crm-sync.md:25:- **RRN deny**: v1.0 강제. asset-ingestion § 9.1 checksum 재사용. false positive 복구 + [0m
[7m[0maudit cascade (CS3-11)[0m
[7m[0m  docs\features\crm-sync.md:26:- **DB 인벤토리 (CS3-06 정정)**: **15 tables** (§ 13.1 ~ § 13.15)[0m
[7m[0m  docs\features\crm-sync.md:27:[0m
  docs\features\crm-sync.md:48:| warning·지표·acceptance test 추가 | PATCH | 별개 | |
> docs\features\crm-sync.md:49:| **[7mdisplayHints[0m column 추가** (CS3-14) | **MINOR** | 별개 | read API output schema 변경[0m
[7m[0m. backward-compatible — 기본 nullable |[0m
> docs\features\crm-sync.md:50:| **[7mdisplayHints[0m column 제거·타입 변경** (CS3-14) | **MAJOR** | policyVersion 신규 | DB [0m
[7m[0mmigration 필수 |[0m
[7m[0m  docs\features\crm-sync.md:51:| **non-PII operational column 추가** (CS3-14) | **MINOR** | 별개 | column nullable + 운[0m
[7m[0m영자 화면 점진 노출 |[0m
[7m[0m  docs\features\crm-sync.md:52:| **CrmCredentialVersion.state enum 추가** (CS3-14) | **MINOR** | 별개 | 신규 상태는 bac[0m
[7m[0mkward-compatible transition rule + 기존 worker 무영향 |[0m
[7m[0m  docs\features\crm-sync.md:53:| **CredentialVersion.state enum 제거·이름 변경** | **MAJOR** | policyVersion 신규 | mig[0m
[7m[0mration |[0m
  docs\features\crm-sync.md:77:- 의료 진료 기록 보관 → CRM·EMR
> docs\features\crm-sync.md:78:- [7mraw PII[0m 실시간 조회 → v1.x (CS-14)[0m
[7m[0m  docs\features\crm-sync.md:79:[0m
[7m[0m  docs\features\crm-sync.md:80:---[0m
[7m[0m  docs\features\crm-sync.md:81:[0m
  docs\features\crm-sync.md:163:        rawPiiStorageAllowed: false
> docs\features\crm-sync.md:164:        [7mdisplayHints[0mRetentionDays: 30[0m
[7m[0m  docs\features\crm-sync.md:165:        ssnRrnHandling: "deny"[0m
[7m[0m  docs\features\crm-sync.md:166:        liveReadEnabled: false[0m
[7m[0m  docs\features\crm-sync.md:167:      retentionDays:[0m
  docs\features\crm-sync.md:195:| 실행 | `recoverRrnFalsePositive(ledgerId, action)` | RRN 복구 | super-admin | 허용 | 
허용 |
> docs\features\crm-sync.md:196:| 실행 | `applyConsentWithdrawal([7mpiiHash[0m \| crmExternalId, scope)` | 환자 동의 철회 (CS[0m
[7m[0m3-05) | super-admin | 허용 | 허용 |[0m
> docs\features\crm-sync.md:197:| read | `queryCrmRecords` | [7mdisplayHints[0m + non-PII operational hints | operator·super-[0m
[7m[0madmin·legal-reviewer | 허용 | 허용 |[0m
[7m[0m  docs\features\crm-sync.md:198:| read | `queryConflicts` | 충돌 큐 | operator·super-admin | 허용 | 빈 결과 |[0m
[7m[0m  docs\features\crm-sync.md:199:| 운영 | `registerIntegration` | | super-admin | 허용 | 허용 |[0m
[7m[0m  docs\features\crm-sync.md:200:| 운영 | `unregisterIntegration` | § 4.7 unregister 정책 | super-admin | 허용 | 허용 |[0m
  docs\features\crm-sync.md:214:| **`crm-rrn-rejection-finalized`** | `"crm-ledger:" + ledgerId` | priorStatus·finalSta
tus="rejected-rrn-final"·actorRole | super-admin |
> docs\features\crm-sync.md:215:| **`crm-consent-withdrawal-applied`** | `"crm-consent:" + withdrawalLedgerId` | scope·
[7mpiiHash[0m[0:8]·crmExternalIdHash·displayHintsNulled·tombstoneCreated·integrationId | super-admin |[0m
[7m[0m  docs\features\crm-sync.md:216:[0m
[7m[0m  docs\features\crm-sync.md:217:**credential fingerprint**: `HMAC-SHA256(auditPepperSecretRef, integrationId + ":" + se[0m
[7m[0mcretVersionId)` 16 hex prefix.[0m
[7m[0m  docs\features\crm-sync.md:218:[0m
  docs\features\crm-sync.md:228:  status: "pending" | "synced-to-crm" | "synced-failed";
> docs\features\crm-sync.md:229:  [7mpiiHash[0m: string;[0m
> docs\features\crm-sync.md:230:  [7mdisplayHints[0m: ContactDisplayHints;[0m
[7m[0m  docs\features\crm-sync.md:231:  operationalHints: ReservationOperationalHints;        // CS3-07[0m
[7m[0m  docs\features\crm-sync.md:232:  crmExternalId?: string;[0m
[7m[0m  docs\features\crm-sync.md:233:};[0m
  docs\features\crm-sync.md:239:  status: "pending" | "synced-to-crm" | "responded-on-crm";
> docs\features\crm-sync.md:240:  [7mpiiHash[0m: string;[0m
> docs\features\crm-sync.md:241:  [7mdisplayHints[0m: ContactDisplayHints;[0m
[7m[0m  docs\features\crm-sync.md:242:  operationalHints: InquiryOperationalHints;[0m
[7m[0m  docs\features\crm-sync.md:243:  crmExternalId?: string;[0m
[7m[0m  docs\features\crm-sync.md:244:};[0m
  docs\features\crm-sync.md:256:  crmExternalId: string;
> docs\features\crm-sync.md:257:  [7mdisplayHints[0m: ContactDisplayHints;[0m
[7m[0m  docs\features\crm-sync.md:258:  operationalHints: ContactOperationalHints;[0m
[7m[0m  docs\features\crm-sync.md:259:  lastSyncedAt: Date;[0m
[7m[0m  docs\features\crm-sync.md:260:  consentWithdrawn: boolean;                             // CS3-05 — 동의 철회 적용 여[0m
[7m[0m부[0m
  docs\features\crm-sync.md:263:
> docs\features\crm-sync.md:264:#### 3.2.1 Contact[7mDisplayHints[0m — **closed schema 6 column**[0m
[7m[0m  docs\features\crm-sync.md:265:[0m
[7m[0m  docs\features\crm-sync.md:266:| 필드 | 타입 | CHECK / validator |[0m
[7m[0m  docs\features\crm-sync.md:267:|---|---|---|[0m
  docs\features\crm-sync.md:276:
> docs\features\crm-sync.md:277:#### 3.2.2 non-PII [7moperational hints[0m (CS3-07 — 신규)[0m
[7m[0m  docs\features\crm-sync.md:278:[0m
> docs\features\crm-sync.md:279:운영자 화면이 [7mraw PII[0m 없이도 충돌·재시도·문의 대응을 판단할 수 있도록 entity별 non-PII [0m
[7m[0mcolumn 분리:[0m
[7m[0m  docs\features\crm-sync.md:280:[0m
[7m[0m  docs\features\crm-sync.md:281:**ReservationOperationalHints**:[0m
[7m[0m  docs\features\crm-sync.md:282:| 필드 | 타입 |[0m
  docs\features\crm-sync.md:284:| `entityStatus` | enum (해당 ReservationSubmission.status) |
> docs\features\crm-sync.md:285:| `departmentHint` | varchar(32) — 진료과 hint ([7mPII 아님[0m) |[0m
[7m[0m  docs\features\crm-sync.md:286:| `locationKey` | varchar(32) — 지점·분원 식별자 |[0m
[7m[0m  docs\features\crm-sync.md:287:| `channelType` | enum (`web-form`·`phone-callback`·`partner-referral`) |[0m
> docs\features\crm-sync.md:288:| `desiredVisitDate` | Date — 환자 입력 희망 방문일 ([7mPII 아님[0m — date만) |[0m
[7m[0m  docs\features\crm-sync.md:289:| `guardianInvolved` | boolean — 보호자 동반 여부 |[0m
[7m[0m  docs\features\crm-sync.md:290:[0m
[7m[0m  docs\features\crm-sync.md:291:**InquiryOperationalHints**:[0m
  docs\features\crm-sync.md:308:
> docs\features\crm-sync.md:309:**[7mraw PII[0m 필요 시 CRM 콘솔 접근 경로 (CS3-07)**:[0m
[7m[0m  docs\features\crm-sync.md:310:- SSO: 의료기관·Glitzy 계정 분리. solution 운영자가 CRM 직접 접근하려면 별도 CRM SSO 필[0m
[7m[0m요[0m
[7m[0m  docs\features\crm-sync.md:311:- role mapping: solution super-admin이라고 CRM admin 자동 부여 안 됨. CRM 측 권한은 의[0m
[7m[0m료기관 책임[0m
[7m[0m  docs\features\crm-sync.md:312:- deep link: queryCrmRecords 결과의 `crmExternalId`로 CRM 콘솔 deep link 생성 가능 (con[0m
[7m[0mfig `crmConsoleBaseUrl` 별도 — v1.x)[0m
  docs\features\crm-sync.md:407:2. solution record load → CrmFieldMapping(direction includes "outbound")로 변환
> docs\features\crm-sync.md:408:3. PII Redaction Validator (closed-schema + [7moperational hints[0m 통과 검증)[0m
[7m[0m  docs\features\crm-sync.md:409:4. RRN 검사 — 검출 시 push 차단 + 운영자 alert + ledger[0m
> docs\features\crm-sync.md:410:5. **consent withdrawal 체크** (CS3-05) — `CrmConsentWithdrawalLedger`에서 [7mpiiHash[0m 또는[0m
[7m[0m crmExternalId 매칭 → push 차단[0m
[7m[0m  docs\features\crm-sync.md:411:6. credential state 검사 (§ 4.5.3 사용 matrix)[0m
[7m[0m  docs\features\crm-sync.md:412:7. rate limit token 획득[0m
[7m[0m  docs\features\crm-sync.md:413:8. CRM API call (idempotency-key)[0m
  docs\features\crm-sync.md:434:7. **InboundProcessingContext 생성** (CS3-03 § 3.4.3)
> docs\features\crm-sync.md:435:8. **consent withdrawal 체크** (CS3-05) — 매칭 시 ledger `accepted-processed` 대신 → st
atus="rejected-consent-withdrawn" + [7mdisplayHints[0m nulling 유지[0m
[7m[0m  docs\features\crm-sync.md:436:9. **closed-schema validator** — 위반 시 ledger `rejected-parse-recoverable` 후 reject[0m
[7m[0m  docs\features\crm-sync.md:437:10. **changeIdentityKey 생성 후 CrmChangeIdentityLedger insert** (CS3-04) — UNIQUE 충돌[0m
[7m[0m 시 duplicate → 즉시 종료 (polling과의 idempotency)[0m
[7m[0m  docs\features\crm-sync.md:438:11. CrmRecord field-level CAS 갱신 (§ 4.3)[0m
  docs\features\crm-sync.md:553:| CrmCredentialVersion (모든 row) | state="revoked" | 보존 | RESTRICT |
> docs\features\crm-sync.md:554:| CrmRecord.[7mdisplayHints[0m* | 즉시 nulling (option `keepDisplayHints=false` 기본) | row [0m
[7m[0m유지 | — |[0m
[7m[0m  docs\features\crm-sync.md:555:| CrmRecord.operationalHints* | row 유지 | row 유지 | — |[0m
[7m[0m  docs\features\crm-sync.md:556:| CrmRecordChangeLog | row 유지 (감사 보존) | retentionDays.changeLog | RESTRICT |[0m
[7m[0m  docs\features\crm-sync.md:557:| CrmConflictRecord (open) | resolution="manual-rejected" | retentionDays.conflictRecor[0m
[7m[0md | RESTRICT |[0m
  docs\features\crm-sync.md:569:
> docs\features\crm-sync.md:570:`applyConsentWithdrawal([7mpiiHash[0m | crmExternalId, scope: "all" | "marketing-only")`:[0m
[7m[0m  docs\features\crm-sync.md:571:[0m
[7m[0m  docs\features\crm-sync.md:572:```[0m
> docs\features\crm-sync.md:573:1. CrmConsentWithdrawalLedger insert — [7mpiiHash[0m·crmExternalIdHash·scope·integrationId·ap[0m
[7m[0mpliedAt[0m
> docs\features\crm-sync.md:574:2. CrmRecord(s) 매칭 → [7mdisplayHints[0m* 모두 nulling. operationalHints는 보존. consentWith[0m
[7m[0mdrawn=true 설정[0m
[7m[0m  docs\features\crm-sync.md:575:3. CrmRecordChangeLog tombstone insert (changedFields = {tombstone: true})[0m
[7m[0m  docs\features\crm-sync.md:576:4. 향후 inbound webhook/polling — § 4.2 step 8에서 매칭 → "rejected-consent-withdrawn" [0m
[7m[0m처리[0m
[7m[0m  docs\features\crm-sync.md:577:5. 향후 outbound push — § 4.1 step 5에서 차단[0m
  docs\features\crm-sync.md:604:
> docs\features\crm-sync.md:605:[7m## 7.[0m PII 처리[0m
[7m[0m  docs\features\crm-sync.md:606:[0m
> docs\features\crm-sync.md:607:[7m### 7.[0m1 closed schema + operational hints (CS3-07)[0m
[7m[0m  docs\features\crm-sync.md:608:[0m
> docs\features\crm-sync.md:609:- [7mdisplayHints[0m: 6 column closed schema (§ 3.2.1)[0m
[7m[0m  docs\features\crm-sync.md:610:- operationalHints: entity별 non-PII column (§ 3.2.2)[0m
[7m[0m  docs\features\crm-sync.md:611:- changedFields/snapshot: allowlisted field token + masked value/enum[0m
[7m[0m  docs\features\crm-sync.md:612:- DB CHECK (길이·문자 클래스) + application validator (canonical) 양층[0m
  docs\features\crm-sync.md:613:
> docs\features\crm-sync.md:614:[7m### 7.[0m2 RRN deny — v0.3 동일 + recoverRrnFalsePositive audit cascade (CS3-11)[0m
[7m[0m  docs\features\crm-sync.md:615:[0m
> docs\features\crm-sync.md:616:[7m### 7.[0m3 raw PII 실시간 조회 — v1.x (CS-14)[0m
[7m[0m  docs\features\crm-sync.md:617:[0m
> docs\features\crm-sync.md:618:[7m### 7.[0m4 DPA vs patient consent[0m
[7m[0m  docs\features\crm-sync.md:619:[0m
[7m[0m  docs\features\crm-sync.md:620:- DPA: `dpaEvidenceRef` 필수[0m
[7m[0m  docs\features\crm-sync.md:621:- consent withdrawal: § 4.8 + CrmConsentWithdrawalLedger (CS3-05 — v1.0 최소 범위)[0m
  docs\features\crm-sync.md:623:
> docs\features\crm-sync.md:624:[7m### 7.[0m5 displayHints expiry 처리 (CS3-07)[0m
[7m[0m  docs\features\crm-sync.md:625:[0m
[7m[0m  docs\features\crm-sync.md:626:`piiRetentionExpiresAt` 도래 시:[0m
> docs\features\crm-sync.md:627:- [7mdisplayHints[0m 6 column 즉시 nulling (delete 아님 — row 유지)[0m
[7m[0m  docs\features\crm-sync.md:628:- operationalHints 보존[0m
[7m[0m  docs\features\crm-sync.md:629:- ChangeLog tombstone insert[0m
[7m[0m  docs\features\crm-sync.md:630:[0m
  docs\features\crm-sync.md:676:| AT-32 | webhook + polling 동시 | CrmChangeIdentityLedger 통과 | § 3.4.4·§ 4.2 step 10
 |
> docs\features\crm-sync.md:677:| AT-33 | [7mdisplayHints[0m closed schema | 자유 JSON → DB CHECK reject | § 7.1 |[0m
> docs\features\crm-sync.md:678:| AT-34 | [7mdisplayHints[0m closed schema | 정규식 위반 → application validator reject | § 7[0m
[7m[0m.1 |[0m
> docs\features\crm-sync.md:679:| AT-35 | [7mdisplayHints[0m migration | v0.3 → v0.4 column 추가 backward-compatible | § 10.3[0m
[7m[0m |[0m
[7m[0m  docs\features\crm-sync.md:680:| AT-36 | outbox idempotency | credential rotation 후 새 credentialVersion 만료 | § 6.3[0m
[7m[0m |[0m
> docs\features\crm-sync.md:681:| AT-37 | consent withdrawal | applyConsentWithdrawal + [7mdisplayHints[0m nulling | § 4.8 |[0m
[7m[0m  docs\features\crm-sync.md:682:| AT-38 | consent withdrawal | inbound 매칭 → rejected-consent-withdrawn | § 4.2 step 8[0m
[7m[0m |[0m
[7m[0m  docs\features\crm-sync.md:683:| AT-39 | consent withdrawal | outbound 매칭 → push 차단 | § 4.1 step 5 |[0m
> docs\features\crm-sync.md:684:| AT-40 | unregister | [7mdisplayHints[0m nulling·queue cancel·ledger 보존 | § 4.7 |[0m
[7m[0m  docs\features\crm-sync.md:685:| AT-41 | purge worker | retentionDays.changeLog | § 10.4 |[0m
[7m[0m  docs\features\crm-sync.md:686:| AT-42 | purge worker | retentionDays.syncLog | § 10.4 |[0m
[7m[0m  docs\features\crm-sync.md:687:| AT-43 | purge worker | retentionDays.conflictRecord | § 10.4 |[0m
  docs\features\crm-sync.md:688:| AT-44 | purge worker | webhookNonceLedgerRetentionMinutes | § 10.4 |
> docs\features\crm-sync.md:689:| AT-45 | purge worker | piiRetentionExpiresAt → [7mdisplayHints[0m nulling | § 7.5 |[0m
[7m[0m  docs\features\crm-sync.md:690:| AT-46 | purge worker | consentWithdrawalLedger legal hold skip | § 10.4 |[0m
[7m[0m  docs\features\crm-sync.md:691:| AT-47 | audit cascade | 7종 AuditAction insert 성공 | § 3.1.1 |[0m
[7m[0m  docs\features\crm-sync.md:692:| AT-48 | notification cascade | 4종 NotificationEventType emit | § 6.1 |[0m
  docs\features\crm-sync.md:728:  - CrmConsentWithdrawalLedger 신설 (§ 13.14)
> docs\features\crm-sync.md:729:  - [7mdisplayHints[0mCityName CHECK 정규식 정리[0m
[7m[0m  docs\features\crm-sync.md:730:[0m
[7m[0m  docs\features\crm-sync.md:731:### 10.4 runtime invariant·reconcile (CS3-10 강화)[0m
[7m[0m  docs\features\crm-sync.md:732:[0m
  docs\features\crm-sync.md:754:    | CrmConsentWithdrawalLedger | **delete row만 만료 시 — legal hold default true** (
CS3-09·10) | hold |
> docs\features\crm-sync.md:755:    | CrmRecord.[7mdisplayHints[0m* | nulling (row 유지) | × |[0m
[7m[0m  docs\features\crm-sync.md:756:    | CrmSyncNotificationOutbox (status=sent/permanent) | delete row | × |[0m
[7m[0m  docs\features\crm-sync.md:757:  - failure reconcile: row delete 실패 → sink alert·다음 cycle 재시도[0m
[7m[0m  docs\features\crm-sync.md:758:[0m
  docs\features\crm-sync.md:822:| 2026-05-14 | v0.3 | codex 2차 비평 17 지적 반영 |
> docs\features\crm-sync.md:823:| 2026-05-14 | **v0.4** | **codex 3차 비평 17 지적 전건 수용 + REVIEW_WORKFLOW·DATA_MOD
EL cascade**: (1) **DB 인벤토리 15 tables로 정정** — CrmChangeIdentityLedger·CrmConsentWithdrawalLedger 신설 (CS3-06), 
(2) **CredentialVersion·Integration state invariant 표** + rotating-revoked 잔재 제거 (CS3-01), (3) **NonceLedger key d
eliveryKind별 partial unique** — exactly-once / at-least-once+eventId / at-least-once-no-eventId·best-effort 3분기 (CS3
-02), (4) **InboundProcessingContext + providerVersionToken** + provider별 expectedCrmVersion 산정 표 (CS3-03), (5) **C
AS WHERE outbound도 crm_version 포함** + CrmChangeIdentityLedger 신설 (webhook + polling idempotency) (CS3-04), (6) **C
rmConsentWithdrawalLedger + applyConsentWithdrawal command** + `crm-consent-withdrawal-applied` AuditAction (CS3-05), (
7) **non-PII [7moperational hints[0m** entity별 column (CS3-07), (8) **DB CHECK dialect 명시** (PostgreSQL canonical · `\p{L}[0m
[7m[0m` 회피 · 행정구역 allowlist application validator) (CS3-08), (9) **§ 4.7 unregister 정책 표** 12행 + FK ON DELETE 정책 [0m
[7m[0m(CS3-09), (10) **purge worker SoT § 10.4** — cadence·batch·legal hold·failure reconcile + 테이블별 액션 (CS3-10), (11) [0m
[7m[0m**REVIEW_WORKFLOW § 10.2.1 cascade — RRN 2종 + consent withdrawal 1종 AuditAction 추가** (CS3-11), (12) **retry queue w[0m
[7m[0morker SQL search-visibility § 13.5 풀 전개** — claim·SourceAttempt insert·envelope recalc·stale reclaim·exhausted·perma[0m
[7m[0mnent 9단계 (CS3-12), (13) **DATA_MODEL C-08 v0.20 cascade — genericRestApiAdapter + CrmCredentialVersion 경계** (CS3-13[0m
[7m[0m), (14) **§ 1.1 변경 정책 — displayHints column·state enum·table 추가 SemVer 룰** 7행 추가 (CS3-14), (15) **§ 8.2 accep[0m
[7m[0mtance test 49 cases + § 10 traceability 표** (CS3-15), (16) **§ 11.4 잔여 리스크 실측 기반 정리** (CS3-16), (17) **`Ref[0m
[7m[0m<C-anything>`·rotating-revoked·중복 line·잘못된 테이블 수 문장 정정** (CS3-17) |[0m
[7m[0m  docs\features\crm-sync.md:824:[0m
[7m[0m  docs\features\crm-sync.md:825:---[0m
[7m[0m  docs\features\crm-sync.md:826:[0m
  docs\features\crm-sync.md:902:
> docs\features\crm-sync.md:903:### 13.5 `CrmRecord` (CS3-07 — [7moperational hints[0m 추가)[0m
[7m[0m  docs\features\crm-sync.md:904:[0m
[7m[0m  docs\features\crm-sync.md:905:v0.3 § 13.5 column + 추가:[0m
[7m[0m  docs\features\crm-sync.md:906:[0m
  docs\features\crm-sync.md:971:| `integrationId` | UUID | ✅ — FK |
> docs\features\crm-sync.md:972:| `[7mpiiHash[0m` | char(64) | optional (matching key 둘 중 하나 ✅) |[0m
> docs\features\crm-sync.md:973:| `[7mcrmExternalIdHash[0m` | char(64) | optional (matching key 둘 중 하나 ✅) |
> docs\features\crm-sync.md:974:| `scope` | enum (`all`·`[7mmarketing-only[0m`) | ✅ |[0m
[7m[0m  docs\features\crm-sync.md:975:| `appliedBy` | string | ✅ — super-admin |[0m
[7m[0m  docs\features\crm-sync.md:976:| `appliedAt` | Date | ✅ |[0m
> docs\features\crm-sync.md:977:| `[7mdisplayHints[0mNulled` | boolean | ✅ |[0m
[7m[0m  docs\features\crm-sync.md:978:| `tombstoneChangeLogId` | UUID | optional |[0m
[7m[0m  docs\features\crm-sync.md:979:| `legalHold` | boolean | ✅ default true (CS3-09 — unregister 시 보존) |[0m
[7m[0m  docs\features\crm-sync.md:980:| `expiresAt` | Date | optional — legalHold=true 시 null |[0m
  docs\features\crm-sync.md:981:
> docs\features\crm-sync.md:982:**Constraints**: `FK integrationId`. 응용 단위 unique: `(integrationId, [7mpiiHash[0m | crmEx[0m
[7m[0mternalIdHash, scope)` 중복 시 정보 알림.[0m
> docs\features\crm-sync.md:983:**Index**: `(integrationId, [7mpiiHash[0m) WHERE piiHash IS NOT NULL`, `(integrationId, crmEx[0m
[7m[0mternalIdHash) WHERE crmExternalIdHash IS NOT NULL`, `(expiresAt) WHERE legalHold=false`.[0m
[7m[0m  docs\features\crm-sync.md:984:[0m
[7m[0m  docs\features\crm-sync.md:985:### 13.15 `CrmSyncNotificationOutbox` — v0.3 § 13.13 동일[0m
[7m[0m  docs\features\crm-sync.md:986:[0m
  docs\features\crm-sync.md:996:| 13.4 | `CrmSyncRetryQueue` | retentionDays.retryQueueCompleted |
> docs\features\crm-sync.md:997:| 13.5 | `CrmRecord` | [7mdisplayHints[0mRetentionDays (nulling) |[0m
[7m[0m  docs\features\crm-sync.md:998:| 13.6 | `CrmRecordChangeLog` | retentionDays.changeLog (tombstone 예외) |[0m
[7m[0m  docs\features\crm-sync.md:999:| 13.7 | `CrmFieldMapping` | active=false soft delete |[0m
[7m[0m  docs\features\crm-sync.md:1000:| 13.8 | `CrmConflictRecord` | retentionDays.conflictRecord (non-open만) |[0m


 succeeded in 771ms:

  docs\features\crm-sync.md:8:> **연관 문서**:
> docs\features\crm-sync.md:9:> - 알림·audit → notifications + REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (cascade 완료 — 4종 [7mNot[0m
[7mificationEventType[0m·7종 AuditAction)[0m
[7m[0m  docs\features\crm-sync.md:10:> - 자격증명·식별자·policyVersion → DATA_MODEL C-08 v0.20 (`crmSyncConfig`·`crmSyncPolic[0m
[7m[0myVersion`·`genericRestApiAdapter` — CS3-13)[0m
[7m[0m  docs\features\crm-sync.md:11:> - RRN checksum 알고리즘 재사용 → `features/asset-ingestion.md` § 9.1[0m
[7m[0m  docs\features\crm-sync.md:12:> - retry queue·outbox worker SQL 재사용 → `features/search-visibility.md` § 13.5·§ 13.1[0m
[7m[0m0[0m
[7m[0m  docs\features\crm-sync.md:13:[0m
  docs\features\crm-sync.md:69:| CrmSyncRetryQueue | config(기본 5)·configurable | [60, 300, 1800, 7200, 21600]s |
> docs\features\crm-sync.md:70:| [7mCrmSyncNotificationOutbox[0m | 상수 5 | search-visibility § 7.3 SQL 동일 |[0m
[7m[0m  docs\features\crm-sync.md:71:[0m
[7m[0m  docs\features\crm-sync.md:72:### 1.3 본 문서가 다루지 않는 영역[0m
[7m[0m  docs\features\crm-sync.md:73:[0m
[7m[0m  docs\features\crm-sync.md:74:- 알림 채널·재시도 → notifications[0m
  docs\features\crm-sync.md:98:| notifications | notify() 필수 |
> docs\features\crm-sync.md:99:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 4종 [7mNotificationEventType[0m |[0m
> docs\features\crm-sync.md:100:| REVIEW_WORKFLOW § 10.2.1 | 7종 [7mAuditAction[0m (CS3-11 RRN 2종 + CS3-05 동의 철회 1종 추[0m
[7m[0m가) |[0m
[7m[0m  docs\features\crm-sync.md:101:| DATA_MODEL C-08 v0.20 | `crmSyncConfig`·`crmSyncPolicyVersion`·`genericRestApiAdapter[0m
[7m[0m` |[0m
[7m[0m  docs\features\crm-sync.md:102:| DATA_MODEL CT-03·C-20 | 참조만 |[0m
[7m[0m  docs\features\crm-sync.md:103:| asset-ingestion § 9.1 | RRN checksum 재사용 |[0m
[7m[0m  docs\features\crm-sync.md:104:| search-visibility § 13.5·§ 13.10 | retry queue·outbox SQL 패턴 |[0m
  docs\features\crm-sync.md:206:
> docs\features\crm-sync.md:207:| [7mAuditAction[0m | contentRef | metadata | 권한 |[0m
[7m[0m  docs\features\crm-sync.md:208:|---|---|---|---|[0m
[7m[0m  docs\features\crm-sync.md:209:| `crm-integration-registered` | `"crm-integration:" + integrationId` | provider·apiUrl[0m
[7m[0m·legalApprovedBy·dpaEvidenceRefHash | super-admin |[0m
[7m[0m  docs\features\crm-sync.md:210:| `crm-integration-unregistered` | `"crm-integration:" + integrationId` | activeBefore·[0m
[7m[0mactiveAfter·unregisteredBy·unregisterPolicySnapshot (§ 4.7) | super-admin |[0m
[7m[0m  docs\features\crm-sync.md:211:| `crm-sync-conflict-resolved` | `"crm-conflict:" + conflictId` | resolution·winningSid[0m
[7m[0me·resolvedBy·entityType·fieldPath·appliedFieldVersion | operator·super-admin |[0m
  docs\features\crm-sync.md:525:- `stable → rotating`: `rotateCredential` 호출. 새 CredentialVersion(state=rotating-tar
get) insert. Integration.state="rotating"
> docs\features\crm-sync.md:526:- `rotating → committed`: health check 성공. 신규 row state=active·이전 row state=commi
tted·graceUntil 설정. Integration.state="committed"·current[7mCredentialVersionId[0m 갱신[0m
[7m[0m  docs\features\crm-sync.md:527:- `rotating → reverted`: health check 실패. 신규 row state=reverted. Integration.state=[0m
[7m[0m"reverted". 사용자 알림[0m
[7m[0m  docs\features\crm-sync.md:528:- `committed → grace-expired`: graceUntil 도래 (background worker). 이전 row state=revo[0m
[7m[0mked. Integration.state="grace-expired"[0m
[7m[0m  docs\features\crm-sync.md:529:- `grace-expired → stable`: 다음 stable cycle (즉시 transition. 운영상 같은 의미)[0m
[7m[0m  docs\features\crm-sync.md:530:- `reverted → stable`: 운영자 확인 후 명시적 reset[0m
  docs\features\crm-sync.md:558:| CrmSyncRetryQueue (pending/processing) | status="failed-permanent" | retentionDays.re
tryQueueCompleted | RESTRICT |
> docs\features\crm-sync.md:559:| [7mCrmSyncNotificationOutbox[0m (pending) | status="permanent" | retentionDays.notification[0m
[7m[0mOutbox | RESTRICT |[0m
[7m[0m  docs\features\crm-sync.md:560:| CrmWebhookNonceLedger | row 유지 | webhookNonceLedgerRetentionMinutes | RESTRICT |[0m
[7m[0m  docs\features\crm-sync.md:561:| CrmChangeIdentityLedger | row 유지 | retentionDays.changeLog 동일 | RESTRICT |[0m
[7m[0m  docs\features\crm-sync.md:562:| CrmConsentWithdrawalLedger | row 유지 (legal hold) | retentionDays.consentWithdrawalL[0m
[7m[0medger | RESTRICT |[0m
[7m[0m  docs\features\crm-sync.md:563:| webhook endpoint | 즉시 미등록 (HTTP 404) | — | — |[0m
  docs\features\crm-sync.md:596:
> docs\features\crm-sync.md:597:### 6.1 [7mNotificationEventType[0m — v0.3 동일[0m
[7m[0m  docs\features\crm-sync.md:598:[0m
[7m[0m  docs\features\crm-sync.md:599:### 6.2 outbox — search-visibility § 7.2 SQL 동일[0m
[7m[0m  docs\features\crm-sync.md:600:[0m
> docs\features\crm-sync.md:601:### 6.3 NotificationEvent 매핑 — v0.3 동일 ([7msourceId[0m에 credentialVersionId)[0m
[7m[0m  docs\features\crm-sync.md:602:[0m
[7m[0m  docs\features\crm-sync.md:603:---[0m
[7m[0m  docs\features\crm-sync.md:604:[0m
[7m[0m  docs\features\crm-sync.md:605:## 7. PII 처리[0m
  docs\features\crm-sync.md:690:| AT-46 | purge worker | consentWithdrawalLedger legal hold skip | § 10.4 |
> docs\features\crm-sync.md:691:| AT-47 | audit cascade | 7종 [7mAuditAction[0m insert 성공 | § 3.1.1 |[0m
> docs\features\crm-sync.md:692:| AT-48 | notification cascade | 4종 [7mNotificationEventType[0m emit | § 6.1 |[0m
[7m[0m  docs\features\crm-sync.md:693:| AT-49 | DATA_MODEL cascade | genericRestApiAdapter 동기화 | § 2.3 |[0m
[7m[0m  docs\features\crm-sync.md:694:[0m
[7m[0m  docs\features\crm-sync.md:695:---[0m
[7m[0m  docs\features\crm-sync.md:696:[0m
  docs\features\crm-sync.md:755:    | CrmRecord.displayHints* | nulling (row 유지) | × |
> docs\features\crm-sync.md:756:    | [7mCrmSyncNotificationOutbox[0m (status=sent/permanent) | delete row | × |[0m
[7m[0m  docs\features\crm-sync.md:757:  - failure reconcile: row delete 실패 → sink alert·다음 cycle 재시도[0m
[7m[0m  docs\features\crm-sync.md:758:[0m
[7m[0m  docs\features\crm-sync.md:759:### 10.5 warning[0m
[7m[0m  docs\features\crm-sync.md:760:[0m
  docs\features\crm-sync.md:822:| 2026-05-14 | v0.3 | codex 2차 비평 17 지적 반영 |
> docs\features\crm-sync.md:823:| 2026-05-14 | **v0.4** | **codex 3차 비평 17 지적 전건 수용 + REVIEW_WORKFLOW·DATA_MOD
EL cascade**: (1) **DB 인벤토리 15 tables로 정정** — CrmChangeIdentityLedger·CrmConsentWithdrawalLedger 신설 (CS3-06), 
(2) **CredentialVersion·Integration state invariant 표** + rotating-revoked 잔재 제거 (CS3-01), (3) **NonceLedger key d
eliveryKind별 partial unique** — exactly-once / at-least-once+eventId / at-least-once-no-eventId·best-effort 3분기 (CS3
-02), (4) **InboundProcessingContext + providerVersionToken** + provider별 expectedCrmVersion 산정 표 (CS3-03), (5) **C
AS WHERE outbound도 crm_version 포함** + CrmChangeIdentityLedger 신설 (webhook + polling idempotency) (CS3-04), (6) **C
rmConsentWithdrawalLedger + applyConsentWithdrawal command** + `crm-consent-withdrawal-applied` [7mAuditAction[0m (CS3-05), ([0m
[7m[0m7) **non-PII operational hints** entity별 column (CS3-07), (8) **DB CHECK dialect 명시** (PostgreSQL canonical · `\p{L}[0m
[7m[0m` 회피 · 행정구역 allowlist application validator) (CS3-08), (9) **§ 4.7 unregister 정책 표** 12행 + FK ON DELETE 정책 [0m
[7m[0m(CS3-09), (10) **purge worker SoT § 10.4** — cadence·batch·legal hold·failure reconcile + 테이블별 액션 (CS3-10), (11) [0m
[7m[0m**REVIEW_WORKFLOW § 10.2.1 cascade — RRN 2종 + consent withdrawal 1종 AuditAction 추가** (CS3-11), (12) **retry queue w[0m
[7m[0morker SQL search-visibility § 13.5 풀 전개** — claim·SourceAttempt insert·envelope recalc·stale reclaim·exhausted·perma[0m
[7m[0mnent 9단계 (CS3-12), (13) **DATA_MODEL C-08 v0.20 cascade — genericRestApiAdapter + CrmCredentialVersion 경계** (CS3-13[0m
[7m[0m), (14) **§ 1.1 변경 정책 — displayHints column·state enum·table 추가 SemVer 룰** 7행 추가 (CS3-14), (15) **§ 8.2 accep[0m
[7m[0mtance test 49 cases + § 10 traceability 표** (CS3-15), (16) **§ 11.4 잔여 리스크 실측 기반 정리** (CS3-16), (17) **`Ref[0m
[7m[0m<C-anything>`·rotating-revoked·중복 line·잘못된 테이블 수 문장 정정** (CS3-17) |[0m
[7m[0m  docs\features\crm-sync.md:824:[0m
[7m[0m  docs\features\crm-sync.md:825:---[0m
[7m[0m  docs\features\crm-sync.md:826:[0m
[7m[0m  docs\features\crm-sync.md:827:## 13. 본 Feature 내부 데이터 구조 (admin DB **15 tables** — CS3-06 정정)[0m
  docs\features\crm-sync.md:984:
> docs\features\crm-sync.md:985:### 13.15 `[7mCrmSyncNotificationOutbox[0m` — v0.3 § 13.13 동일[0m
[7m[0m  docs\features\crm-sync.md:986:[0m
[7m[0m  docs\features\crm-sync.md:987:---[0m
[7m[0m  docs\features\crm-sync.md:988:[0m
[7m[0m  docs\features\crm-sync.md:989:**총 15개 admin DB 테이블** — 각 절 = 1 테이블:[0m
  docs\features\crm-sync.md:1006:| 13.14 | `CrmConsentWithdrawalLedger` | legal hold default — retentionDays.consentWit
hdrawalLedger (legalHold=false 시) |
> docs\features\crm-sync.md:1007:| 13.15 | `[7mCrmSyncNotificationOutbox[0m` | retentionDays.notificationOutbox |[0m


exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "(Select-String -Path docs\\features\\crm-sync.md -Pattern '"'^### 13'"\\.[0-9]+ ').Count" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Select-String -Path docs\\features\\crm-sync.md -Pattern '15 tables|15개|12 tables|13 tables|12개|13개'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Select-String -Path docs\\admin\\REVIEW_WORKFLOW.md -Pattern 'crm-rrn-false-positive-recovered|crm-rrn-rejection-finalized|crm-consent-withdrawal-applied'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Select-String -Path docs\\features\\crm-sync.md -Pattern 'rotating-revoked|Ref<C-anything>|중복 line|12 tables|13 tables|v0\\.3 §'" in C:\Users\assag\solution\website-exposure
 succeeded in 644ms:
15

 succeeded in 720ms:

docs\features\crm-sync.md:26:- **DB 인벤토리 (CS3-06 정정)**: **[7m15 tables[0m** (§ 13.1 ~ § 13.15)
docs\features\crm-sync.md:697:## 9. 설치·설정 — DB [7m15 tables[0m 마이그레이션 (§ 13)
docs\features\crm-sync.md:823:| 2026-05-14 | **v0.4** | **codex 3차 비평 17 지적 전건 수용 + REVIEW_WORKFLOW·DATA_MODEL
 cascade**: (1) **DB 인벤토리 [7m15 tables[0m로 정정** — CrmChangeIdentityLedger·CrmConsentWithdrawalLedger 신설 (CS3-06), (2[0m
[7m[0m) **CredentialVersion·Integration state invariant 표** + rotating-revoked 잔재 제거 (CS3-01), (3) **NonceLedger key del[0m
[7m[0miveryKind별 partial unique** — exactly-once / at-least-once+eventId / at-least-once-no-eventId·best-effort 3분기 (CS3-0[0m
[7m[0m2), (4) **InboundProcessingContext + providerVersionToken** + provider별 expectedCrmVersion 산정 표 (CS3-03), (5) **CAS[0m
[7m[0m WHERE outbound도 crm_version 포함** + CrmChangeIdentityLedger 신설 (webhook + polling idempotency) (CS3-04), (6) **Crm[0m
[7m[0mConsentWithdrawalLedger + applyConsentWithdrawal command** + `crm-consent-withdrawal-applied` AuditAction (CS3-05), (7)[0m
[7m[0m **non-PII operational hints** entity별 column (CS3-07), (8) **DB CHECK dialect 명시** (PostgreSQL canonical · `\p{L}` [0m
[7m[0m회피 · 행정구역 allowlist application validator) (CS3-08), (9) **§ 4.7 unregister 정책 표** 12행 + FK ON DELETE 정책 (C[0m
[7m[0mS3-09), (10) **purge worker SoT § 10.4** — cadence·batch·legal hold·failure reconcile + 테이블별 액션 (CS3-10), (11) **[0m
[7m[0mREVIEW_WORKFLOW § 10.2.1 cascade — RRN 2종 + consent withdrawal 1종 AuditAction 추가** (CS3-11), (12) **retry queue wor[0m
[7m[0mker SQL search-visibility § 13.5 풀 전개** — claim·SourceAttempt insert·envelope recalc·stale reclaim·exhausted·permane[0m
[7m[0mnt 9단계 (CS3-12), (13) **DATA_MODEL C-08 v0.20 cascade — genericRestApiAdapter + CrmCredentialVersion 경계** (CS3-13),[0m
[7m[0m (14) **§ 1.1 변경 정책 — displayHints column·state enum·table 추가 SemVer 룰** 7행 추가 (CS3-14), (15) **§ 8.2 accepta[0m
[7m[0mnce test 49 cases + § 10 traceability 표** (CS3-15), (16) **§ 11.4 잔여 리스크 실측 기반 정리** (CS3-16), (17) **`Ref<C[0m
[7m[0m-anything>`·rotating-revoked·중복 line·잘못된 테이블 수 문장 정정** (CS3-17) |[0m
docs\features\crm-sync.md:827:## 13. 본 Feature 내부 데이터 구조 (admin DB **[7m15 tables[0m** — CS3-06 정정)
docs\features\crm-sync.md:989:**총 [7m15개[0m admin DB 테이블** — 각 절 = 1 테이블:


 succeeded in 719ms:

docs\admin\REVIEW_WORKFLOW.md:675:  | "[7mcrm-rrn-false-positive-recovered[0m"        // RRN false positive 복구 (recoverRrnF[0m
[7m[0malsePositive override-and-fetch)[0m
docs\admin\REVIEW_WORKFLOW.md:676:  | "[7mcrm-rrn-rejection-finalized[0m"             // RRN 복구 포기·확정 (abandon)
docs\admin\REVIEW_WORKFLOW.md:677:  | "[7mcrm-consent-withdrawal-applied[0m";         // 환자 동의 철회 적용 (displayHints nu[0m
[7m[0mlling + sync skip) — CS3-05[0m


 succeeded in 723ms:

docs\features\crm-sync.md:250:  pageRef?: string;                                      // Ref union 또는 string ref (CS
3-17 — `[7mRef<C-anything>[0m` 정정)[0m
docs\features\crm-sync.md:318:type RunSyncInput = { /* [7mv0.3 §[0m 3.3 동일 */ };
docs\features\crm-sync.md:319:type RunSyncResult = { /* [7mv0.3 §[0m 3.3 동일 */ };
docs\features\crm-sync.md:456:#### 4.3.1 FieldAuthority — [7mv0.3 §[0m 4.3.1 동일
docs\features\crm-sync.md:476:#### 4.3.3 ConflictRecord — [7mv0.3 §[0m 4.3.3 동일
docs\features\crm-sync.md:478:#### 4.3.4 manual escalate 결정표 — [7mv0.3 §[0m 4.3.4 동일
docs\features\crm-sync.md:532:**[7mrotating-revoked[0m 잔재 제거** (CS3-01): § 4.1 step 6의 `≠ "rotating-revoked"` 표현은 폐[0m
[7m[0m기. **§ 4.5.3 사용 matrix가 SoT**.[0m
docs\features\crm-sync.md:705:[7mv0.3 §[0m 10.1 + 추가:
docs\features\crm-sync.md:716:[7mv0.3 §[0m 10.2 + 추가:
docs\features\crm-sync.md:761:[7mv0.3 §[0m 10.5 + 추가:
docs\features\crm-sync.md:823:| 2026-05-14 | **v0.4** | **codex 3차 비평 17 지적 전건 수용 + REVIEW_WORKFLOW·DATA_MODEL
 cascade**: (1) **DB 인벤토리 15 tables로 정정** — CrmChangeIdentityLedger·CrmConsentWithdrawalLedger 신설 (CS3-06), (2
) **CredentialVersion·Integration state invariant 표** + [7mrotating-revoked[0m 잔재 제거 (CS3-01), (3) **NonceLedger key del[0m
[7m[0miveryKind별 partial unique** — exactly-once / at-least-once+eventId / at-least-once-no-eventId·best-effort 3분기 (CS3-0[0m
[7m[0m2), (4) **InboundProcessingContext + providerVersionToken** + provider별 expectedCrmVersion 산정 표 (CS3-03), (5) **CAS[0m
[7m[0m WHERE outbound도 crm_version 포함** + CrmChangeIdentityLedger 신설 (webhook + polling idempotency) (CS3-04), (6) **Crm[0m
[7m[0mConsentWithdrawalLedger + applyConsentWithdrawal command** + `crm-consent-withdrawal-applied` AuditAction (CS3-05), (7)[0m
[7m[0m **non-PII operational hints** entity별 column (CS3-07), (8) **DB CHECK dialect 명시** (PostgreSQL canonical · `\p{L}` [0m
[7m[0m회피 · 행정구역 allowlist application validator) (CS3-08), (9) **§ 4.7 unregister 정책 표** 12행 + FK ON DELETE 정책 (C[0m
[7m[0mS3-09), (10) **purge worker SoT § 10.4** — cadence·batch·legal hold·failure reconcile + 테이블별 액션 (CS3-10), (11) **[0m
[7m[0mREVIEW_WORKFLOW § 10.2.1 cascade — RRN 2종 + consent withdrawal 1종 AuditAction 추가** (CS3-11), (12) **retry queue wor[0m
[7m[0mker SQL search-visibility § 13.5 풀 전개** — claim·SourceAttempt insert·envelope recalc·stale reclaim·exhausted·permane[0m
[7m[0mnt 9단계 (CS3-12), (13) **DATA_MODEL C-08 v0.20 cascade — genericRestApiAdapter + CrmCredentialVersion 경계** (CS3-13),[0m
[7m[0m (14) **§ 1.1 변경 정책 — displayHints column·state enum·table 추가 SemVer 룰** 7행 추가 (CS3-14), (15) **§ 8.2 accepta[0m
[7m[0mnce test 49 cases + § 10 traceability 표** (CS3-15), (16) **§ 11.4 잔여 리스크 실측 기반 정리** (CS3-16), (17) **`Ref<C[0m
[7m[0m-anything>`·rotating-revoked·중복 line·잘못된 테이블 수 문장 정정** (CS3-17) |[0m
docs\features\crm-sync.md:905:[7mv0.3 §[0m 13.5 column + 추가:
docs\features\crm-sync.md:985:### 13.15 `CrmSyncNotificationOutbox` — [7mv0.3 §[0m 13.13 동일


codex
{
  "review_id": "crm-sync-v0.4-cycle4",
  "target": "docs/features/crm-sync.md",
  "summary": {
    "verdict": "major_revision_required",
    "cycle3_regression_status": "mostly_resolved_but_not_closed",
    "blocking_count": 3,
    "major_count": 7,
    "minor_count": 3,
    "notes": "3차 17개 지적은 대부분 문서상 반영됐다. 특히 DB 15 tables, REVIEW_WORKFLOW AuditAction 3종, DATA_MODEL genericRestApiAdapter cascade는 확인됐다. 다만 v0.4에서 새로 도입한 consent withdrawal, change identity, polling context, credential rotation 동시성은 구현 가능한 계약으로 닫히지 않았다."
  },
  "cycle3_regression_check": {
    "CS3-01": "partial: invariant 표는 추가됐으나 rotate race와 reverted reset command가 없음",
    "CS3-02": "resolved: deliveryKind별 partial unique가 문서상 분리됨",
    "CS3-03": "partial: InboundProcessingContext는 추가됐으나 polling 경로와 타입이 충돌",
    "CS3-04": "partial: outbound CAS crm_version 포함은 반영됐으나 providerVersionToken null 경로가 보장과 충돌",
    "CS3-05": "partial: ledger와 command는 추가됐으나 매칭 키·scope 의미가 불명확",
    "CS3-06": "resolved: §0, §9, §13, 최하단 표 모두 15 tables",
    "CS3-07": "partial: operational hints는 추가됐으나 비식별성 선언이 과도함",
    "CS3-08": "resolved: PostgreSQL CHECK와 application validator 분리가 반영됨",
    "CS3-09": "partial: unregister 표는 있으나 purge precedence와 일부 보존 정책 충돌",
    "CS3-10": "partial: purge worker 표는 있으나 legal hold·unregister와 충돌",
    "CS3-11": "resolved: REVIEW_WORKFLOW §10.2.1에 3종 AuditAction 추가 확인",
    "CS3-12": "partial: retry queue SQL은 전개됐으나 outbox 쪽은 여전히 '동일' 참조",
    "CS3-13": "resolved: DATA_MODEL C-08에 genericRestApiAdapter와 CredentialVersion 경계 반영",
    "CS3-14": "partial: SemVer 표는 보강됐으나 consent ledger/key semantics 변경 규칙 없음",
    "CS3-15": "partial: 49개 표는 있으나 핵심 동시성·API 입력 테스트가 빠짐",
    "CS3-16": "partial: 잔여 리스크 표는 있으나 known limitation과 open/deferred 경계가 흐림",
    "CS3-17": "partial: 타입 잔재는 정정됐으나 v0.3 동일 참조가 많음"
  },
  "findings": [
    {
      "id": "CS4-01",
      "severity": "blocking",
      "category": "consent withdrawal matching",
      "location": "docs/features/crm-sync.md:196, 410, 570-578, 972-983",
      "issue": "CrmConsentWithdrawalLedger는 piiHash 또는 crmExternalIdHash를 저장하지만, command와 pipeline은 `crmExternalId` 또는 `piiHash` 매칭이라고 표현한다. raw crmExternalId를 hash로 바꾸는 canonical algorithm, pepper/salt, normalization, 기존 CrmRecord의 저장 키와의 비교 방식이 없다. webhook은 raw PII로 piiHash 산정 가능할 수 있지만 polling payload나 outbound record가 항상 piiHash를 갖는지도 보장되지 않는다.",
      "impact": "동의 철회 tombstone이 일부 경로에서 매칭되지 않아 inbound/polling으로 displayHints가 재생성되거나 outbound push가 차단되지 않을 수 있다.",
      "recommendation": "입력 타입을 `applyConsentWithdrawal({ integrationId, keyType: 'piiHash'|'crmExternalIdHash', key, scope, reason })`처럼 명확히 하고, crmExternalIdHash 산식과 piiHash 산식을 SoT로 고정하라. polling/outbound/webhook 각각 어떤 키로 매칭하는지 표로 분리하라."
    },
    {
      "id": "CS4-02",
      "severity": "blocking",
      "category": "credential rotation concurrency",
      "location": "docs/features/crm-sync.md:513-530, 721, 933",
      "issue": "CrmCredentialVersion invariant는 application invariant로만 선언되어 있고 concurrent `rotateCredential` 호출을 막는 DB 제약 또는 transaction protocol이 없다. stable 상태에서 두 rotate 호출이 동시에 들어오면 rotating-target row가 2개 생길 수 있고, health check commit 순서에 따라 currentCredentialVersionId가 뒤집힐 수 있다.",
      "impact": "자격증명 교체 중 outbound/inbound verifier가 서로 다른 credential set을 신뢰할 수 있다. 운영 중 webhook signature 검증 실패 또는 잘못된 credential revoke가 발생할 수 있다.",
      "recommendation": "rotateCredential 시작 시 integration row `SELECT FOR UPDATE` 또는 per-integration advisory lock을 요구하라. DB에는 partial unique 예시를 명시하라: active 1개, rotating-target 1개, committed grace row 1개 등. transition update는 integration state와 version rows를 단일 transaction으로 묶어야 한다."
    },
    {
      "id": "CS4-03",
      "severity": "blocking",
      "category": "polling context contract",
      "location": "docs/features/crm-sync.md:371-384, 388-390, 480-490",
      "issue": "InboundProcessingContext는 `verifierResult: VerifierResult`와 `rawBody: Buffer`를 required로 둔다. 하지만 polling 경로에는 verifier가 없고 rawBody도 webhook body가 아니다. 문서에는 `source: 'polling'`만 추가되어 있어 polling이 synthetic verifierResult를 만들어야 하는지, null을 허용해야 하는지, parser/CAS가 어느 필드를 신뢰해야 하는지 불명확하다.",
      "impact": "webhook과 polling을 동일 pipeline으로 처리한다고 했지만 타입 수준에서 동일 pipeline이 성립하지 않는다. 구현자가 polling 전용 우회 경로를 만들면 idempotency와 CAS 규칙이 다시 분기된다.",
      "recommendation": "Context를 discriminated union으로 분리하라. 예: `WebhookInboundContext`는 verifierResult·rawBody·nonceLedgerId 필수, `PollingInboundContext`는 pollRunId·providerCursor·providerVersionToken 필수. CAS 단계가 공통으로 보는 필드만 별도 `NormalizedInboundChange`로 추출하라."
    },
    {
      "id": "CS4-04",
      "severity": "major",
      "category": "webhook nonce vs change identity responsibility",
      "location": "docs/features/crm-sync.md:427-438, 388-397, 944-964",
      "issue": "CrmWebhookNonceLedger와 CrmChangeIdentityLedger는 중복은 아니지만 책임 경계가 불완전하다. NonceLedger는 webhook delivery dedupe, ChangeIdentityLedger는 record change dedupe로 보이나, 문서는 'webhook + polling 동일 idempotency 보장'이라고 하면서 providerVersionToken=null이면 ChangeIdentityLedger를 skip하고 중복 처리 가능하다고 적는다.",
      "impact": "보장 문장과 예외 문장이 충돌한다. providerVersionToken이 없는 provider에서는 webhook replay는 막히지만 webhook과 polling의 동일 변경 중복은 막히지 않는다.",
      "recommendation": "두 ledger의 책임을 명시하라. NonceLedger는 transport-level dedupe, ChangeIdentityLedger는 record-level dedupe. providerVersionToken=null provider는 v1.0 지원 불가로 build fail 처리하거나, fallback key `(crmExternalId + payloadDigest + observedLastModifiedBucket)`를 별도 정책으로 정의하라."
    },
    {
      "id": "CS4-05",
      "severity": "major",
      "category": "operational hints privacy classification",
      "location": "docs/features/crm-sync.md:277-307, 607-628, 903-921",
      "issue": "desiredVisitDate, guardianInvolved, relationToInstitution='existing-patient', departmentHint, locationKey 조합은 소규모 의료기관 환경에서 환자 식별 가능성을 높일 수 있다. 그런데 문서는 'PII 아님' 및 '자유롭게 운영자 화면에 노출'이라고 단정한다.",
      "impact": "raw PII는 아니어도 준식별자 또는 민감한 의료 이용 맥락으로 취급해야 한다. displayHints만 nulling하고 operationalHints를 장기 보존하면 개인정보 최소화 원칙과 충돌할 수 있다.",
      "recommendation": "operationalHints를 'non-raw-PII but privacy-sensitive operational metadata'로 재분류하라. 필드별 retention, masking, role access, export 금지, small-cell suppression 기준을 추가하고 displayHints expiry 또는 consent withdrawal 시 어떤 operationalHints를 nulling할지 표로 정하라."
    },
    {
      "id": "CS4-06",
      "severity": "major",
      "category": "unregister vs purge precedence",
      "location": "docs/features/crm-sync.md:550-566, 740-757, 989-1007",
      "issue": "§4.7 unregister는 CrmWebhookNonceLedger·CrmChangeIdentityLedger·CrmConsentWithdrawalLedger를 row 유지로 둔다. §10.4 purge worker는 같은 테이블들을 retention 도래 시 delete한다. 특히 ConsentWithdrawalLedger는 retentionDays가 있으나 legalHold default true면 expiresAt이 null이고 사실상 삭제되지 않는다.",
      "impact": "연동 해제 후 어떤 데이터가 얼마나 오래 남는지 구현자가 판단해야 한다. retentionDays.consentWithdrawalLedger 설정은 대부분의 row에 효과가 없고, unregister 보존과 purge 삭제의 우선순위가 불명확하다.",
      "recommendation": "precedence를 명시하라: legalHold > unregister snapshot > retention purge. ConsentWithdrawalLedger는 legalHold=false 전환 command, expiresAt 산정 시점, 삭제 가능 조건을 정의하라. operationalHints도 unregister 시 보존할지 nulling할지 privacy classification과 연결하라."
    },
    {
      "id": "CS4-07",
      "severity": "major",
      "category": "state machine completeness",
      "location": "docs/features/crm-sync.md:524-530, 534-542, 194-201",
      "issue": "`reverted → stable`은 '운영자 확인 후 명시적 reset'이라고만 되어 있고 entrypoint/admin command에 없다. reset 시 reverted row를 revoked로 바꾸는지 유지하는지, Integration.state만 stable로 바꾸는지, audit action이 무엇인지도 없다.",
      "impact": "rotation 실패 후 운영 복구 경로가 구현자별로 달라진다. reverted 상태가 장기 유지되거나 stable 복귀가 audit 없이 수행될 수 있다.",
      "recommendation": "`resetCredentialRotation(integrationId, revertedVersionId, reason)` 같은 super-admin command를 정의하고 권한, precondition, row transition, audit metadata를 추가하라."
    },
    {
      "id": "CS4-08",
      "severity": "major",
      "category": "DB schema constraints",
      "location": "docs/features/crm-sync.md:944-983",
      "issue": "신규 ledger 2개가 핵심 안전 장치인데 DB 제약이 충분하지 않다. CrmConsentWithdrawalLedger의 'matching key 둘 중 하나'는 CHECK로 표현되지 않았고, unique도 '응용 단위 unique'라고만 되어 있다. CrmChangeIdentityLedger는 processedSyncLogId FK 여부가 불명확하고 FK ON DELETE 정책도 §4.7 표에만 느슨하게 존재한다.",
      "impact": "중복 철회 ledger, key 없는 철회 ledger, orphan processedSyncLogId가 DB에 들어갈 수 있다. 이후 purge/reconcile이 신뢰할 수 없는 데이터를 대상으로 돈다.",
      "recommendation": "DB 제약을 명시하라: `CHECK ((piiHash IS NOT NULL) <> (crmExternalIdHash IS NOT NULL))` 또는 둘 다 허용 여부 명시, partial unique 2개 `(integrationId, piiHash, scope)` 및 `(integrationId, crmExternalIdHash, scope)`, processedSyncLogId FK, all FK ON DELETE RESTRICT/SET NULL 정책."
    },
    {
      "id": "CS4-09",
      "severity": "major",
      "category": "acceptance coverage",
      "location": "docs/features/crm-sync.md:639-693",
      "issue": "49개 acceptance test는 수량은 늘었지만 핵심 신규 리스크를 충분히 닫지 않는다. rotateCredential 동시 호출 race, polling context verifier 부재, consent withdrawal keyType별 matching, legalHold=false 만료 삭제, providerVersionToken=null provider의 중복 처리, resetCredentialRotation 부재가 테스트되지 않는다. AT-35는 'v0.3 → v0.4 column 추가 backward-compatible'만 말하고 실제 운영 데이터 migration fixture가 없다.",
      "impact": "v1.0 회귀 방지 표로 보기에는 핵심 실패 모드가 빠져 있다.",
      "recommendation": "AT를 개수보다 invariant별 fixture로 재편하라. 특히 command-level concurrency test, migration fixture with existing rows, consent key matrix, providerVersionToken null path, purge precedence test를 추가하라."
    },
    {
      "id": "CS4-10",
      "severity": "major",
      "category": "command/API usability",
      "location": "docs/features/crm-sync.md:194-196, 442-451, 568-578",
      "issue": "recoverRrnFalsePositive와 applyConsentWithdrawal의 입력 형식이 admin UI/OpenAPI 관점에서 부족하다. ledgerId 외에 reason, dryRun, actor note, target integration, idempotency key, expected current status 같은 운영 필드가 없다. applyConsentWithdrawal은 `piiHash | crmExternalId` union이 API 스키마로 표현되기 어렵다.",
      "impact": "운영자가 어떤 환자·연동·scope에 대해 무엇을 적용하는지 확인하기 어렵고, 재시도 시 중복 적용 또는 잘못된 환자 적용 위험이 있다.",
      "recommendation": "각 command에 request/response DTO를 추가하라. keyType discriminant, dryRun preview, matchedRecordCount, tombstoneChangeLogIds, idempotencyKey, reason, audit metadata를 명시하라."
    },
    {
      "id": "CS4-11",
      "severity": "minor",
      "category": "DATA_MODEL cascade metadata",
      "location": "docs/core/DATA_MODEL.md:3-4, 694-716, 1079-1080",
      "issue": "DATA_MODEL 본문에는 genericRestApiAdapter와 CrmCredentialVersion 경계가 반영됐지만 문서 헤더 상태는 여전히 Draft v0.19이고 작성일 라인에 v0.19→v0.20 설명을 괄호로 붙인 상태다.",
      "impact": "cascade 완료 여부를 자동 검증하거나 사람이 상단만 볼 때 v0.20 반영 상태를 오해할 수 있다.",
      "recommendation": "DATA_MODEL 헤더 상태/버전을 v0.20으로 올리고 변경 이력 순서를 v0.18, v0.19, v0.20 순으로 정렬하라."
    },
    {
      "id": "CS4-12",
      "severity": "minor",
      "category": "stand-alone document quality",
      "location": "docs/features/crm-sync.md:318-319, 456, 476, 478, 597-601, 705-716, 829-933, 985",
      "issue": "v0.4가 v1.0 안정판 후보라면 `v0.3 § X 동일` 표현이 너무 많다. 특히 RunSyncInput/Result, FieldAuthority, ConflictRecord, NotificationEventType, 다수 DB schema가 이전 버전에 의존한다.",
      "impact": "구현자는 v0.4 단일 문서만 보고 구현할 수 없다. 이전 draft와 diff를 따라가야 해서 SoT로서 약하다.",
      "recommendation": "v1.0 후보 전환 전에는 모든 'v0.3 동일' 절을 실제 schema/type/table로 재전개하라. 변경 이력에는 남겨도 본문 SoT에는 남기지 않는 편이 안전하다."
    },
    {
      "id": "CS4-13",
      "severity": "minor",
      "category": "change policy coverage",
      "location": "docs/features/crm-sync.md:32-55, 568-581, 944-983",
      "issue": "§1.1은 displayHints column, operational column, table, state enum 추가를 다루지만 신규 메커니즘의 의미 변경은 다루지 않는다. 예를 들어 consent scope 추가/변경, withdrawal matching key 변경, ChangeIdentityLedger key 산정 변경, providerVersionToken requirement 강화가 SemVer상 무엇인지 없다.",
      "impact": "향후 privacy/security invariant 변경이 PATCH/MINOR로 처리될 수 있다.",
      "recommendation": "idempotency key algorithm, consent withdrawal scope/key semantics, privacy-sensitive operational hint classification 변경은 MAJOR 또는 policyVersion 신규로 분류하라."
    }
  ],
  "required_next_actions": [
    "ConsentWithdrawalLedger key contract를 discriminated API와 canonical hash algorithm으로 재작성한다.",
    "rotateCredential/resetCredentialRotation을 DB lock + partial unique + single transaction 모델로 닫는다.",
    "Webhook/Polling inbound context를 union type으로 분리하고 공통 normalized change contract를 둔다.",
    "operationalHints를 privacy-sensitive metadata로 재분류하고 retention/access/nulling 정책을 정한다.",
    "§13의 신규 ledger constraints를 DB CHECK/partial unique/FK/ON DELETE까지 구체화한다.",
    "v1.0 후보 전에는 'v0.3 동일' 본문을 모두 펼쳐 stand-alone SoT로 만든다."
  ],
  "stability_assessment": {
    "db_inventory": "pass_15_tables",
    "db_schema_completeness": "partial",
    "state_machine": "partial",
    "idempotency_model": "partial",
    "consent_erasure_model": "fail",
    "privacy_model": "partial",
    "purge_unregister_alignment": "partial",
    "cascade_review_workflow": "pass",
    "cascade_data_model": "pass_with_minor_metadata_issue",
    "acceptance_tests": "partial",
    "standalone_readiness": "fail"
  }
}
tokens used
144,495
{
  "review_id": "crm-sync-v0.4-cycle4",
  "target": "docs/features/crm-sync.md",
  "summary": {
    "verdict": "major_revision_required",
    "cycle3_regression_status": "mostly_resolved_but_not_closed",
    "blocking_count": 3,
    "major_count": 7,
    "minor_count": 3,
    "notes": "3차 17개 지적은 대부분 문서상 반영됐다. 특히 DB 15 tables, REVIEW_WORKFLOW AuditAction 3종, DATA_MODEL genericRestApiAdapter cascade는 확인됐다. 다만 v0.4에서 새로 도입한 consent withdrawal, change identity, polling context, credential rotation 동시성은 구현 가능한 계약으로 닫히지 않았다."
  },
  "cycle3_regression_check": {
    "CS3-01": "partial: invariant 표는 추가됐으나 rotate race와 reverted reset command가 없음",
    "CS3-02": "resolved: deliveryKind별 partial unique가 문서상 분리됨",
    "CS3-03": "partial: InboundProcessingContext는 추가됐으나 polling 경로와 타입이 충돌",
    "CS3-04": "partial: outbound CAS crm_version 포함은 반영됐으나 providerVersionToken null 경로가 보장과 충돌",
    "CS3-05": "partial: ledger와 command는 추가됐으나 매칭 키·scope 의미가 불명확",
    "CS3-06": "resolved: §0, §9, §13, 최하단 표 모두 15 tables",
    "CS3-07": "partial: operational hints는 추가됐으나 비식별성 선언이 과도함",
    "CS3-08": "resolved: PostgreSQL CHECK와 application validator 분리가 반영됨",
    "CS3-09": "partial: unregister 표는 있으나 purge precedence와 일부 보존 정책 충돌",
    "CS3-10": "partial: purge worker 표는 있으나 legal hold·unregister와 충돌",
    "CS3-11": "resolved: REVIEW_WORKFLOW §10.2.1에 3종 AuditAction 추가 확인",
    "CS3-12": "partial: retry queue SQL은 전개됐으나 outbox 쪽은 여전히 '동일' 참조",
    "CS3-13": "resolved: DATA_MODEL C-08에 genericRestApiAdapter와 CredentialVersion 경계 반영",
    "CS3-14": "partial: SemVer 표는 보강됐으나 consent ledger/key semantics 변경 규칙 없음",
    "CS3-15": "partial: 49개 표는 있으나 핵심 동시성·API 입력 테스트가 빠짐",
    "CS3-16": "partial: 잔여 리스크 표는 있으나 known limitation과 open/deferred 경계가 흐림",
    "CS3-17": "partial: 타입 잔재는 정정됐으나 v0.3 동일 참조가 많음"
  },
  "findings": [
    {
      "id": "CS4-01",
      "severity": "blocking",
      "category": "consent withdrawal matching",
      "location": "docs/features/crm-sync.md:196, 410, 570-578, 972-983",
      "issue": "CrmConsentWithdrawalLedger는 piiHash 또는 crmExternalIdHash를 저장하지만, command와 pipeline은 `crmExternalId` 또는 `piiHash` 매칭이라고 표현한다. raw crmExternalId를 hash로 바꾸는 canonical algorithm, pepper/salt, normalization, 기존 CrmRecord의 저장 키와의 비교 방식이 없다. webhook은 raw PII로 piiHash 산정 가능할 수 있지만 polling payload나 outbound record가 항상 piiHash를 갖는지도 보장되지 않는다.",
      "impact": "동의 철회 tombstone이 일부 경로에서 매칭되지 않아 inbound/polling으로 displayHints가 재생성되거나 outbound push가 차단되지 않을 수 있다.",
      "recommendation": "입력 타입을 `applyConsentWithdrawal({ integrationId, keyType: 'piiHash'|'crmExternalIdHash', key, scope, reason })`처럼 명확히 하고, crmExternalIdHash 산식과 piiHash 산식을 SoT로 고정하라. polling/outbound/webhook 각각 어떤 키로 매칭하는지 표로 분리하라."
    },
    {
      "id": "CS4-02",
      "severity": "blocking",
      "category": "credential rotation concurrency",
      "location": "docs/features/crm-sync.md:513-530, 721, 933",
      "issue": "CrmCredentialVersion invariant는 application invariant로만 선언되어 있고 concurrent `rotateCredential` 호출을 막는 DB 제약 또는 transaction protocol이 없다. stable 상태에서 두 rotate 호출이 동시에 들어오면 rotating-target row가 2개 생길 수 있고, health check commit 순서에 따라 currentCredentialVersionId가 뒤집힐 수 있다.",
      "impact": "자격증명 교체 중 outbound/inbound verifier가 서로 다른 credential set을 신뢰할 수 있다. 운영 중 webhook signature 검증 실패 또는 잘못된 credential revoke가 발생할 수 있다.",
      "recommendation": "rotateCredential 시작 시 integration row `SELECT FOR UPDATE` 또는 per-integration advisory lock을 요구하라. DB에는 partial unique 예시를 명시하라: active 1개, rotating-target 1개, committed grace row 1개 등. transition update는 integration state와 version rows를 단일 transaction으로 묶어야 한다."
    },
    {
      "id": "CS4-03",
      "severity": "blocking",
      "category": "polling context contract",
      "location": "docs/features/crm-sync.md:371-384, 388-390, 480-490",
      "issue": "InboundProcessingContext는 `verifierResult: VerifierResult`와 `rawBody: Buffer`를 required로 둔다. 하지만 polling 경로에는 verifier가 없고 rawBody도 webhook body가 아니다. 문서에는 `source: 'polling'`만 추가되어 있어 polling이 synthetic verifierResult를 만들어야 하는지, null을 허용해야 하는지, parser/CAS가 어느 필드를 신뢰해야 하는지 불명확하다.",
      "impact": "webhook과 polling을 동일 pipeline으로 처리한다고 했지만 타입 수준에서 동일 pipeline이 성립하지 않는다. 구현자가 polling 전용 우회 경로를 만들면 idempotency와 CAS 규칙이 다시 분기된다.",
      "recommendation": "Context를 discriminated union으로 분리하라. 예: `WebhookInboundContext`는 verifierResult·rawBody·nonceLedgerId 필수, `PollingInboundContext`는 pollRunId·providerCursor·providerVersionToken 필수. CAS 단계가 공통으로 보는 필드만 별도 `NormalizedInboundChange`로 추출하라."
    },
    {
      "id": "CS4-04",
      "severity": "major",
      "category": "webhook nonce vs change identity responsibility",
      "location": "docs/features/crm-sync.md:427-438, 388-397, 944-964",
      "issue": "CrmWebhookNonceLedger와 CrmChangeIdentityLedger는 중복은 아니지만 책임 경계가 불완전하다. NonceLedger는 webhook delivery dedupe, ChangeIdentityLedger는 record change dedupe로 보이나, 문서는 'webhook + polling 동일 idempotency 보장'이라고 하면서 providerVersionToken=null이면 ChangeIdentityLedger를 skip하고 중복 처리 가능하다고 적는다.",
      "impact": "보장 문장과 예외 문장이 충돌한다. providerVersionToken이 없는 provider에서는 webhook replay는 막히지만 webhook과 polling의 동일 변경 중복은 막히지 않는다.",
      "recommendation": "두 ledger의 책임을 명시하라. NonceLedger는 transport-level dedupe, ChangeIdentityLedger는 record-level dedupe. providerVersionToken=null provider는 v1.0 지원 불가로 build fail 처리하거나, fallback key `(crmExternalId + payloadDigest + observedLastModifiedBucket)`를 별도 정책으로 정의하라."
    },
    {
      "id": "CS4-05",
      "severity": "major",
      "category": "operational hints privacy classification",
      "location": "docs/features/crm-sync.md:277-307, 607-628, 903-921",
      "issue": "desiredVisitDate, guardianInvolved, relationToInstitution='existing-patient', departmentHint, locationKey 조합은 소규모 의료기관 환경에서 환자 식별 가능성을 높일 수 있다. 그런데 문서는 'PII 아님' 및 '자유롭게 운영자 화면에 노출'이라고 단정한다.",
      "impact": "raw PII는 아니어도 준식별자 또는 민감한 의료 이용 맥락으로 취급해야 한다. displayHints만 nulling하고 operationalHints를 장기 보존하면 개인정보 최소화 원칙과 충돌할 수 있다.",
      "recommendation": "operationalHints를 'non-raw-PII but privacy-sensitive operational metadata'로 재분류하라. 필드별 retention, masking, role access, export 금지, small-cell suppression 기준을 추가하고 displayHints expiry 또는 consent withdrawal 시 어떤 operationalHints를 nulling할지 표로 정하라."
    },
    {
      "id": "CS4-06",
      "severity": "major",
      "category": "unregister vs purge precedence",
      "location": "docs/features/crm-sync.md:550-566, 740-757, 989-1007",
      "issue": "§4.7 unregister는 CrmWebhookNonceLedger·CrmChangeIdentityLedger·CrmConsentWithdrawalLedger를 row 유지로 둔다. §10.4 purge worker는 같은 테이블들을 retention 도래 시 delete한다. 특히 ConsentWithdrawalLedger는 retentionDays가 있으나 legalHold default true면 expiresAt이 null이고 사실상 삭제되지 않는다.",
      "impact": "연동 해제 후 어떤 데이터가 얼마나 오래 남는지 구현자가 판단해야 한다. retentionDays.consentWithdrawalLedger 설정은 대부분의 row에 효과가 없고, unregister 보존과 purge 삭제의 우선순위가 불명확하다.",
      "recommendation": "precedence를 명시하라: legalHold > unregister snapshot > retention purge. ConsentWithdrawalLedger는 legalHold=false 전환 command, expiresAt 산정 시점, 삭제 가능 조건을 정의하라. operationalHints도 unregister 시 보존할지 nulling할지 privacy classification과 연결하라."
    },
    {
      "id": "CS4-07",
      "severity": "major",
      "category": "state machine completeness",
      "location": "docs/features/crm-sync.md:524-530, 534-542, 194-201",
      "issue": "`reverted → stable`은 '운영자 확인 후 명시적 reset'이라고만 되어 있고 entrypoint/admin command에 없다. reset 시 reverted row를 revoked로 바꾸는지 유지하는지, Integration.state만 stable로 바꾸는지, audit action이 무엇인지도 없다.",
      "impact": "rotation 실패 후 운영 복구 경로가 구현자별로 달라진다. reverted 상태가 장기 유지되거나 stable 복귀가 audit 없이 수행될 수 있다.",
      "recommendation": "`resetCredentialRotation(integrationId, revertedVersionId, reason)` 같은 super-admin command를 정의하고 권한, precondition, row transition, audit metadata를 추가하라."
    },
    {
      "id": "CS4-08",
      "severity": "major",
      "category": "DB schema constraints",
      "location": "docs/features/crm-sync.md:944-983",
      "issue": "신규 ledger 2개가 핵심 안전 장치인데 DB 제약이 충분하지 않다. CrmConsentWithdrawalLedger의 'matching key 둘 중 하나'는 CHECK로 표현되지 않았고, unique도 '응용 단위 unique'라고만 되어 있다. CrmChangeIdentityLedger는 processedSyncLogId FK 여부가 불명확하고 FK ON DELETE 정책도 §4.7 표에만 느슨하게 존재한다.",
      "impact": "중복 철회 ledger, key 없는 철회 ledger, orphan processedSyncLogId가 DB에 들어갈 수 있다. 이후 purge/reconcile이 신뢰할 수 없는 데이터를 대상으로 돈다.",
      "recommendation": "DB 제약을 명시하라: `CHECK ((piiHash IS NOT NULL) <> (crmExternalIdHash IS NOT NULL))` 또는 둘 다 허용 여부 명시, partial unique 2개 `(integrationId, piiHash, scope)` 및 `(integrationId, crmExternalIdHash, scope)`, processedSyncLogId FK, all FK ON DELETE RESTRICT/SET NULL 정책."
    },
    {
      "id": "CS4-09",
      "severity": "major",
      "category": "acceptance coverage",
      "location": "docs/features/crm-sync.md:639-693",
      "issue": "49개 acceptance test는 수량은 늘었지만 핵심 신규 리스크를 충분히 닫지 않는다. rotateCredential 동시 호출 race, polling context verifier 부재, consent withdrawal keyType별 matching, legalHold=false 만료 삭제, providerVersionToken=null provider의 중복 처리, resetCredentialRotation 부재가 테스트되지 않는다. AT-35는 'v0.3 → v0.4 column 추가 backward-compatible'만 말하고 실제 운영 데이터 migration fixture가 없다.",
      "impact": "v1.0 회귀 방지 표로 보기에는 핵심 실패 모드가 빠져 있다.",
      "recommendation": "AT를 개수보다 invariant별 fixture로 재편하라. 특히 command-level concurrency test, migration fixture with existing rows, consent key matrix, providerVersionToken null path, purge precedence test를 추가하라."
    },
    {
      "id": "CS4-10",
      "severity": "major",
      "category": "command/API usability",
      "location": "docs/features/crm-sync.md:194-196, 442-451, 568-578",
      "issue": "recoverRrnFalsePositive와 applyConsentWithdrawal의 입력 형식이 admin UI/OpenAPI 관점에서 부족하다. ledgerId 외에 reason, dryRun, actor note, target integration, idempotency key, expected current status 같은 운영 필드가 없다. applyConsentWithdrawal은 `piiHash | crmExternalId` union이 API 스키마로 표현되기 어렵다.",
      "impact": "운영자가 어떤 환자·연동·scope에 대해 무엇을 적용하는지 확인하기 어렵고, 재시도 시 중복 적용 또는 잘못된 환자 적용 위험이 있다.",
      "recommendation": "각 command에 request/response DTO를 추가하라. keyType discriminant, dryRun preview, matchedRecordCount, tombstoneChangeLogIds, idempotencyKey, reason, audit metadata를 명시하라."
    },
    {
      "id": "CS4-11",
      "severity": "minor",
      "category": "DATA_MODEL cascade metadata",
      "location": "docs/core/DATA_MODEL.md:3-4, 694-716, 1079-1080",
      "issue": "DATA_MODEL 본문에는 genericRestApiAdapter와 CrmCredentialVersion 경계가 반영됐지만 문서 헤더 상태는 여전히 Draft v0.19이고 작성일 라인에 v0.19→v0.20 설명을 괄호로 붙인 상태다.",
      "impact": "cascade 완료 여부를 자동 검증하거나 사람이 상단만 볼 때 v0.20 반영 상태를 오해할 수 있다.",
      "recommendation": "DATA_MODEL 헤더 상태/버전을 v0.20으로 올리고 변경 이력 순서를 v0.18, v0.19, v0.20 순으로 정렬하라."
    },
    {
      "id": "CS4-12",
      "severity": "minor",
      "category": "stand-alone document quality",
      "location": "docs/features/crm-sync.md:318-319, 456, 476, 478, 597-601, 705-716, 829-933, 985",
      "issue": "v0.4가 v1.0 안정판 후보라면 `v0.3 § X 동일` 표현이 너무 많다. 특히 RunSyncInput/Result, FieldAuthority, ConflictRecord, NotificationEventType, 다수 DB schema가 이전 버전에 의존한다.",
      "impact": "구현자는 v0.4 단일 문서만 보고 구현할 수 없다. 이전 draft와 diff를 따라가야 해서 SoT로서 약하다.",
      "recommendation": "v1.0 후보 전환 전에는 모든 'v0.3 동일' 절을 실제 schema/type/table로 재전개하라. 변경 이력에는 남겨도 본문 SoT에는 남기지 않는 편이 안전하다."
    },
    {
      "id": "CS4-13",
      "severity": "minor",
      "category": "change policy coverage",
      "location": "docs/features/crm-sync.md:32-55, 568-581, 944-983",
      "issue": "§1.1은 displayHints column, operational column, table, state enum 추가를 다루지만 신규 메커니즘의 의미 변경은 다루지 않는다. 예를 들어 consent scope 추가/변경, withdrawal matching key 변경, ChangeIdentityLedger key 산정 변경, providerVersionToken requirement 강화가 SemVer상 무엇인지 없다.",
      "impact": "향후 privacy/security invariant 변경이 PATCH/MINOR로 처리될 수 있다.",
      "recommendation": "idempotency key algorithm, consent withdrawal scope/key semantics, privacy-sensitive operational hint classification 변경은 MAJOR 또는 policyVersion 신규로 분류하라."
    }
  ],
  "required_next_actions": [
    "ConsentWithdrawalLedger key contract를 discriminated API와 canonical hash algorithm으로 재작성한다.",
    "rotateCredential/resetCredentialRotation을 DB lock + partial unique + single transaction 모델로 닫는다.",
    "Webhook/Polling inbound context를 union type으로 분리하고 공통 normalized change contract를 둔다.",
    "operationalHints를 privacy-sensitive metadata로 재분류하고 retention/access/nulling 정책을 정한다.",
    "§13의 신규 ledger constraints를 DB CHECK/partial unique/FK/ON DELETE까지 구체화한다.",
    "v1.0 후보 전에는 'v0.3 동일' 본문을 모두 펼쳐 stand-alone SoT로 만든다."
  ],
  "stability_assessment": {
    "db_inventory": "pass_15_tables",
    "db_schema_completeness": "partial",
    "state_machine": "partial",
    "idempotency_model": "partial",
    "consent_erasure_model": "fail",
    "privacy_model": "partial",
    "purge_unregister_alignment": "partial",
    "cascade_review_workflow": "pass",
    "cascade_data_model": "pass_with_minor_metadata_issue",
    "acceptance_tests": "partial",
    "standalone_readiness": "fail"
  }
}
