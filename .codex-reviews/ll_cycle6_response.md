Reading additional input from stdin...
OpenAI Codex v0.130.0
--------
workdir: C:\Users\assag\solution\website-exposure
model: gpt-5.5
provider: openai
approval: never
sandbox: read-only
reasoning effort: none
reasoning summaries: none
session id: 019e2f7f-67fb-7f90-9145-669c4d0bbc52
--------
user
# LOCATION_LEGAL_PLAN v0.6 — codex 자동 비평 cycle 6

당신은 신중한 senior reviewer. cycle5 의 단일 blocker LL-56 (M0_BUILD_EXPORT_PLAN placeholder 부재) 해소 + LL-57·58 minor 수용 여부 + **closeableAfterPatch=true 도달 가능성** 평가.

## 검토 대상

- `docs/decisions/LOCATION_LEGAL_PLAN.md` v0.6 (cycle1~5 누계 58 findings 전건 수용)
- `docs/decisions/M0_BUILD_EXPORT_PLAN.md` v0.1 placeholder (신규 · LL-CASCADE-04 cascade target)

## SoT

- `docs/admin/ARCHITECTURE.md` v0.7 · `docs/core/DATA_MODEL.md` v0.9 · `docs/admin/REVIEW_WORKFLOW.md` v1.0
- `docs/core/CONTENT_STANDARDS.md` v1.3 · `docs/compliance/RISK_LEVELS.md` v1.1 · `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0
- `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0
- 기존 packages (직접 확인)

## cycle5 → v0.6 patch 요약

| ID | patch |
|---|---|
| LL-56 (blocking) | `docs/decisions/M0_BUILD_EXPORT_PLAN.md` v0.1 placeholder 실 파일 작성 완료 (§1.2 LL-CASCADE-04 책임 표 포함) |
| LL-57 (minor) | LL-DEFER-19 phase 단일화 — §9.1 M0 v1.0 그룹 → §9.2 M1 Phase Alpha 그룹 이동. M0 v0.5 의 3종 subset 출시 가능 명시 |
| LL-58 (minor) | Sentry SDK 초기화 위치 = `apps/web/src/lib/observability.ts` 한 줄 명시 (LL-DEFER-18) |

## 검토 관점

### 1. cycle5 patch 수용 정합

- LL-56 — `docs/decisions/M0_BUILD_EXPORT_PLAN.md` 실 파일 존재 확인 (Test-Path true).
- 파일 content 가 LL-CASCADE-04 요구사항 충족 — `§ 1.2 LL-CASCADE-04 책임` 표가 LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT · primary_ctas id → @id alias 5 항목 모두 포함.
- LL-57 — LL-DEFER-19 가 §9.1 에서 사라지고 §9.2 M1 Phase Alpha 합류로 이동. phase 단일화.
- LL-58 — `apps/web/src/lib/observability.ts` 책임 위치 한 줄 명시.

### 2. closeableAfterPatch=true 도달 평가

memory/feedback_codex_review_cycle.md 의 4 조건:
1. 지적 수 감소·수렴 추세 (25→12→10→8→3→?) — cycle6 N ≤ 2 기대.
2. cascade 가 다른 SoT 충돌 없음.
3. 잔류 미결정이 모두 운영·인프라·M2+/M3+ 후속으로 분류 가능 (§9 LL-DEFER 20개 phase 분류 완료).
4. 보안·법적 critical 잔존 없음.

### 3. acceptance 후 작업 흐름 정합

- plan v1.0 acceptance commit = LOCATION_LEGAL_PLAN.md (`v1.0`) + LL-CASCADE-01 (ARCH § 3.8.2 patch) + LL-CASCADE-02 (ADMIN_UI_SKELETON_PLAN § 5.5 patch) + LL-CASCADE-03 (CONTENT_STANDARDS § 7 patch) + LL-CASCADE-04 (M0_BUILD_EXPORT_PLAN.md placeholder) + LL-CASCADE-05 (packages/migrations-runner manifest spec) — 5 cascade 동시.
- 그 후 코드 작업 (§ 8 9개 + cascade 마무리 작업) 진입 가능?

### 4. M0_BUILD_EXPORT_PLAN.md 자체 결함

- placeholder v0.1 의 content 가 SoT 정합?
- § 1.2 LL-CASCADE-04 책임 표 5항목 + § 2 작업 단위 (M0 v1.0 합류) + § 3 비범위.
- LocationProfile.businessHours DB metadata 직접 사용 (CT-02 SoT 형식 그대로) 명시 정합?
- placeholder 의 SoT 인용 (LOCATION_LEGAL_PLAN reference · ARCH § 3.8.1·3.8.2 · DATA_MODEL) 충분?

### 5. 잔존 결함

- 본 plan v0.6 안 LL-DEFER 20개 중 phase 분류가 진정 모두 단일?
- LL-CASCADE 5개 acceptance precondition 모두 plan v1.0 acceptance commit 안 동시 patch?

## 평가 형식

응답은 반드시 다음 JSON 형식으로 시작:

```json
{
  "cycle": 6,
  "closeableAfterPatch": true | false,
  "blockingFindings": [...],
  "newMajorFindings": [...],
  "newMinorFindings": [...],
  "convergenceSignal": "...",
  "nextCycleFocus": "..."
}
```

각 finding 객체는 `{ "id": "LL-NN", "finding": "...", "evidence": "<file:line>", "impact": "..." }` 형식.

수렴 추세 25 → 12 → 10 → 8 → 3. cycle6 0~2 findings 예상. closeableAfterPatch=true 도달 후보. blocking 0 + critical/major 0 + minor 0~2 의 경우 close 신호.
codex
`seo-geo`가 이 요청에는 맞지 않아 사용하지 않습니다. 먼저 관련 문서와 라인 번호를 읽어서 cycle5 패치가 실제 파일 내용으로 닫혔는지 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"LL-CASCADE-04|deep clone|@id=\\\"main\\\"|parentClinic|locations\\[\\]|primary_ctas|LL-DEFER-19|LL-DEFER-18|observability\\.ts|LL-DEFER|LL-CASCADE\" docs/decisions/LOCATION_LEGAL_PLAN.md docs/decisions/M0_BUILD_EXPORT_PLAN.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Item docs/decisions/LOCATION_LEGAL_PLAN.md, docs/decisions/M0_BUILD_EXPORT_PLAN.md | Select-Object FullName,Length,LastWriteTime' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"3\\.8\\.1|3\\.8\\.2|LocationProfile|businessHours|primary_ctas|reservationChannels|parentClinic|locations\\[\\]|@id\" docs/admin/ARCHITECTURE.md docs/core/DATA_MODEL.md docs/core/CONTENT_STANDARDS.md docs/decisions/ADMIN_UI_SKELETON_PLAN.md docs/compliance/RISK_LEVELS.md docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md" in C:\Users\assag\solution\website-exposure
 declined in 0ms:
`"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Item docs/decisions/LOCATION_LEGAL_PLAN.md, docs/decisions/M0_BUILD_EXPORT_PLAN.md | Select-Object FullName,Length,LastWriteTime'` rejected: blocked by policy
2026-05-16T06:35:51.595600Z ERROR codex_core::tools::router: error=`"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Item docs/decisions/LOCATION_LEGAL_PLAN.md, docs/decisions/M0_BUILD_EXPORT_PLAN.md | Select-Object FullName,Length,LastWriteTime'` rejected: blocked by policy
 succeeded in 2377ms:
docs/compliance/RISK_LEVELS.md:529:| `LocationProfile` (C-21) `branchDescription`·`transportInfo`·`parkingInfo` 필드 | `includes-event` | 지점 안내·교통·주차 정보에 "이벤트" 어휘가 행사·시설 의미로 등장 가능 |
docs/compliance/RISK_LEVELS.md:715:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) **CONTENT_STANDARDS § 7.1 cascade — `inferredRiskLevel` 입력 필드 신설**. explicitRiskLevel은 어드민 명시 override만, 자동 추론 결과는 별도 필드. § 7.1.2 트리거 조건도 `inferredRiskLevel === High` ∨ `explicitRiskLevel === High` 명시 + `triggeredBy` 메타로 출처 기록, (2) CONTENT_STANDARDS § 7.1.2 ArticleType override 목록을 High 전용으로 정리 — Medium ArticleType은 본 가상 finding 미발생 (RISK_LEVELS § 6 매트릭스로 처리). RISK_LEVELS § 6.2 표와 정합, (3) § 5.1.2 LocationProfile false-positive 완화 — 존재하지 않는 `relocationNotice`·`businessHoursNotice` 제거. DATA_MODEL C-21 실제 필드(`branchDescription`·`transportInfo`·`parkingInfo`)로 교체, (4) preset 파일명 규약 통일 — `rules.preset-<presetSlug>.yaml`. `<presetSlug>`은 `presets/<presetSlug>/` 디렉토리명과 동일 kebab-case. RL-01 해소 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:7:> **본 skeleton의 위상 명시**: 이 walking skeleton의 ClinicProfile 폼은 admin/ARCHITECTURE § 3.2 화면 ②의 **완성이 아닌 auth/RLS/form wiring proof**다. 화면 ② 완성은 ClinicProfile + LocationProfile(main) + LegalDocument 3계약 동시 출력을 요구하며 M0 v1.0 본 구현에서 합류한다 (ADMIN-UI-15).
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:17:- `docs/admin/ARCHITECTURE.md` v0.7 (§ 3 Vertical Slice · § 3.2 화면 ② 3계약 동시 출력 · § 3.8.1/3.8.2 자동 생성 규칙 · § 7 인증·권한 · § 10 미결정) — admin 위상 SoT
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:53:> **M0 화면 ② 축소판 marker (ADMIN-UI-15)**: skeleton의 ClinicProfile 폼은 single contract(ClinicProfile DB row) 만 저장하며, admin/ARCHITECTURE § 3.2의 "ClinicProfile + LocationProfile(main) + LegalDocument 3계약 동시 출력" 은 M0 v1.0 본 구현에서 합류한다.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:59:| LocationProfile(main) 자동 생성 (admin/ARCH § 3.8.1) | M0 v1.0 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:60:| LegalDocument 자동 생성 (admin/ARCH § 3.8.2) — **skeleton 은 발행/출시 판단 없음**: P-013 Legal/Policy 는 admin/ARCH 의 출시 게이트지만 skeleton 에는 발행 자체가 없으므로 release readiness 의미 없음 (ADMIN-UI-62) | M0 v1.0 |
docs/core/DATA_MODEL.md:21:- 모든 계약은 공통 메타필드(`@id`, `@createdAt`, `@updatedAt`).
docs/core/DATA_MODEL.md:23:- **SoT 원칙**: `ClinicProfile`은 브랜드·기관 정체성·메타 통계만, **위치·전화·시간은 `LocationProfile`이 마스터**.
docs/core/DATA_MODEL.md:55:| C-21 | `LocationProfile` | 지점 정체성 (위치·시간·연락 마스터) | L3 | Git | ✅ | P-012, P-014 |
docs/core/DATA_MODEL.md:63:| CT-01 | `TrustMetric` | 신뢰도·통계 지표 (기준·증빙 포함) | L1 정의 / L3 값 | ClinicProfile, LocationProfile, DoctorProfile |
docs/core/DATA_MODEL.md:64:| CT-02 | `BusinessHours` | 진료시간·접수시간·점심·휴진 | L1 정의 / L3 값 | LocationProfile |
docs/core/DATA_MODEL.md:65:| CT-03 | `CTAConfig` | 전환 채널 설정 | L1 정의 / L3 값 | ClinicProfile, LocationProfile, TreatmentPage |
docs/core/DATA_MODEL.md:82:| `Ref<C-NN>` | 다른 계약의 `@id` 참조 |
docs/core/DATA_MODEL.md:89:| `@id` | `Slug` | ✅ | 인스턴스 내 고유 식별자 |
docs/core/DATA_MODEL.md:95:### 2.3 식별자(`@id`) 규약
docs/core/DATA_MODEL.md:104:- **LocationProfile**: 위치·전화·이메일·진료시간·예약 채널의 **마스터**. 단지점 인스턴스도 `LocationProfile(slug=main)` 1개 필수.
docs/core/DATA_MODEL.md:105:- ClinicProfile에 `mainAddress`/`mainTelephone`/`mainEmail`/`businessHours` 같은 필드 **없음**. 모든 위치·시간 정보는 LocationProfile 참조.
docs/core/DATA_MODEL.md:134:| `@id` | `Slug` | ✅ | 지표 식별자 |
docs/core/DATA_MODEL.md:195:| `@id` | `Slug` | ✅ | 채널 식별자 |
docs/core/DATA_MODEL.md:207:> v0.5에서 추가했던 `isFeatured: boolean` 필드는 **v0.6에서 제거**. CTAConfig가 여러 컨테이너(ClinicProfile.primaryCtas / LocationProfile.reservationChannels / TreatmentPage.cta)에서 재사용될 가능성을 고려할 때, 객체 자체에 컨텍스트 의존 의미(강조 여부)를 두면 재사용 시 의도 누수 위험. 대신 **컨테이너 쪽에 `featuredChannelId: Slug`로 강조 표시** (LocationProfile § 4 참조). CTAConfig 객체는 컨텍스트 무관 데이터로 유지.
docs/core/DATA_MODEL.md:215:**v0.4 SoT 변경**: 위치·전화·시간 필드 **제거**. `locations[]` 통해 LocationProfile 참조.
docs/core/DATA_MODEL.md:219:| `@id` | `Slug` | ✅ | 보통 `"clinic"` 단일 |
docs/core/DATA_MODEL.md:316:| `@id` | `Slug` | ✅ | |
docs/core/DATA_MODEL.md:375:| `@id` | `Slug` | ✅ | |
docs/core/DATA_MODEL.md:419:| `@id` | `Slug` | ✅ | |
docs/core/DATA_MODEL.md:437:| `@id` | `Slug` | ✅ | |
docs/core/DATA_MODEL.md:467:| `@id` | `Slug` | ✅ | |
docs/core/DATA_MODEL.md:767:| `@id` | `Slug` | ✅ | |
docs/core/DATA_MODEL.md:769:| `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature}` | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1) |
docs/core/DATA_MODEL.md:771:| `contentRef` | `string` | ✅ | 대상 콘텐츠 `@id` |
docs/core/DATA_MODEL.md:846:**목적**: 개인정보처리방침·이용약관·비급여 진료 안내 등 법적 정책 문서. **M0 출시 게이트**. Core 표준 템플릿 + ClinicProfile + LocationProfile(main) 변수 자동 치환으로 생성. 법무 검토 필수 (ComplianceRecord.legalCounsel/legalCounselAt required).
docs/core/DATA_MODEL.md:853:| `@id` | `Slug` | ✅ | 정책 종류별 slug (예: `"privacy"`, `"terms"`, `"non-covered"`) |
docs/core/DATA_MODEL.md:878:### C-21. `LocationProfile` — 지점 정체성 (위치·시간·연락 마스터)
docs/core/DATA_MODEL.md:884:| `@id` | `Slug` | ✅ | `"main"` 또는 지점 식별자 |
docs/core/DATA_MODEL.md:886:| `parentClinic` | `Ref<C-01>` | ✅ | 본원 ClinicProfile |
docs/core/DATA_MODEL.md:893:| `businessHours` | `BusinessHours` | ✅ | 진료시간·접수·점심·휴진 (CT-02) |
docs/core/DATA_MODEL.md:894:| `reservationChannels` | `CTAConfig[]` | optional | 지점 예약·상담 채널 (CT-03) |
docs/core/DATA_MODEL.md:904:| `featuredChannelId` | `Slug` | optional | **(v0.6)** `reservationChannels[]` 중 강조 채널 1개의 `@id` 참조. 빌드 시 매칭 안 되면 무시 |
docs/core/DATA_MODEL.md:909:> - **v0.6 (현재)**: `LocationProfile.featuredChannelId: Slug` — **컨테이너에 두기**. CTAConfig는 컨텍스트 무관 데이터로 유지. reservationChannels[] 중 1개 채널의 @id 참조
docs/core/DATA_MODEL.md:911:> **단지점 자동 생성 규칙** (PAGE_TYPES.md § 3 P-014 참조): 어드민이 ClinicProfile 입력 단계의 위치·연락·시간 입력값으로부터 `LocationProfile(slug=main)`을 자동 생성. M0에 별도 화면 추가 없음.
docs/core/DATA_MODEL.md:917:| `@id` | `Slug` | ✅ | |
docs/core/DATA_MODEL.md:922:| `slug` | `Slug` | ✅ | URL용 (보통 `@id`와 동일) |
docs/core/DATA_MODEL.md:942:필드: `@id`, `name`, `description`, `parentSpecialty?`. Preset 1차 정의.
docs/core/DATA_MODEL.md:965:| `@id` | `Slug` | ✅ | UUID 또는 인스턴스 고유 식별자 |
docs/core/DATA_MODEL.md:1011:   └─ locations → LocationProfile[] (C-21)  ⭐ 필수 1개+
docs/core/DATA_MODEL.md:1013:LocationProfile (C-21) — 위치·시간·연락 SoT
docs/core/DATA_MODEL.md:1014:   ├─ businessHours → BusinessHours (CT-02)
docs/core/DATA_MODEL.md:1015:   ├─ reservationChannels → CTAConfig[] (CT-03)
docs/core/DATA_MODEL.md:1016:   ├─ parentClinic → ClinicProfile (C-01)
docs/core/DATA_MODEL.md:1022:   ├─ primaryLocation → LocationProfile (C-21)
docs/core/DATA_MODEL.md:1023:   ├─ additionalLocations → LocationProfile[]
docs/core/DATA_MODEL.md:1059:| DM-01 | `@id` 충돌 처리 — 다국어·동명이인 | 운영 룰 |
docs/core/DATA_MODEL.md:1070:| DM-12 | ~~LocationProfile SoT~~ | **v0.4 해소** — ClinicProfile에 위치·시간·연락 필드 제거. LocationProfile만 마스터 |
docs/core/DATA_MODEL.md:1075:| DM-17 | LocationProfile main 자동 생성의 어드민 입력 단계 | admin/ARCHITECTURE.md |
docs/core/DATA_MODEL.md:1088:| 2026-05-14 | v0.4 | **피드백 적용**: (1) **전체 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, (2) **SoT 정리** — ClinicProfile에서 mainAddress·mainTelephone·mainEmail·businessHours 제거. LocationProfile만 위치·시간·연락 마스터 (DM-12 해소), (3) **TreatmentPage 컨텍스트 필드 즉시 통합** — recommendedFor·treatmentComponents·visitFlow·programVariants·maintenancePlan·remoteCareAvailable·evidenceNotes (1호 다이어트 한의원 직결), (4) **Article 컨텍스트 필드 즉시 통합** — authorType·reviewedBy·reviewedAt·contentSource·externalUrl (E-E-A-T 강화), (5) **RiskLevel 직접 enum 사용** — `Ref<C-05>` 표기 전면 제거, (6) TreatmentComponent·VisitFlowStep·EvidenceNote 하위 타입 신설, (7) DM-18·DM-19 신규 |
docs/core/DATA_MODEL.md:1089:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
docs/core/DATA_MODEL.md:1090:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
docs/admin/ARCHITECTURE.md:125:| ② | 사이트 기본 정보 | 의료기관 정체성 + 본원 위치·연락·시간 + 정책 변수 입력 (3 섹션) | `ClinicProfile` + `LocationProfile`(main) + `LegalDocument`(privacy·terms 등) | 3 계약 동시 출력 — § 3.8.1 / § 3.8.2 자동 생성 규칙 적용 |
docs/admin/ARCHITECTURE.md:133:> § 3.8.1과 정합: 어드민 폼 한 화면이 두 계약을 분리 출력하는 경우 명시.
docs/admin/ARCHITECTURE.md:137:| `ClinicProfile` (C-01) | 기관명·전문분야·간략 소개·로고·기관 메타 (브랜드·정체성만 — 위치·시간·연락은 LocationProfile이 SoT) | | ClinicProfile 화면 (기관 정체성 섹션) |
docs/admin/ARCHITECTURE.md:138:| `LocationProfile`(slug=`main`) (C-21) | 본원 주소·전화·이메일·진료시간(`BusinessHours`)·예약 채널(`CTAConfig[]`) | ✅ (ClinicProfile 폼의 "본원 위치·연락·시간" 섹션에서 자동) | ClinicProfile 화면 (본원 위치 섹션) — § 3.8.1 |
docs/admin/ARCHITECTURE.md:139:| `LegalDocument` (C-16) | `documentType`·`title`·`effectiveDate`·`contactPerson` (`body`는 Core 표준 템플릿 + 변수 자동 치환) | ✅ (Core 표준 템플릿 + ClinicProfile + LocationProfile 변수) | ClinicProfile 화면 (정책 변수 보조 섹션) — § 3.8.2 |
docs/admin/ARCHITECTURE.md:144:| `ComplianceRecord` (C-10) | 위험도·자동 검수 결과·검수자·일자·발행자·발행일 (LegalDocument는 `legalCounsel`·`legalCounselAt` 필수 — § 3.8.2) | ✅ (어드민이 발행 시 기록) | 미리보기·발행 화면 |
docs/admin/ARCHITECTURE.md:183:| 7 | **P-012 Contact (Conversion Hub)** | ClinicProfile + LocationProfile[] 참조. 다중 CTA 채널 노출 |
docs/admin/ARCHITECTURE.md:184:| 8 | **P-014 Location Detail (main 자동)** | LocationProfile(slug=`main`) 1개 자동 생성. 어드민 화면 추가 없음 (§ 3.8.1 규칙) |
docs/admin/ARCHITECTURE.md:185:| **9** | **P-013 Legal / Policy (자동 생성)** | **출시 게이트** — Core 표준 템플릿 + ClinicProfile 변수 치환. 법무 검토 필수 (§ 3.8.2 규칙) |
docs/admin/ARCHITECTURE.md:190:### 3.8.1 LocationProfile(main) 자동 생성 규칙
docs/admin/ARCHITECTURE.md:193:> - **계약 필드 (Git 출력)**: `core/DATA_MODEL.md` C-01 ClinicProfile (브랜드·메타만) + C-21 LocationProfile (위치·시간·연락 마스터) — SoT는 LocationProfile.
docs/admin/ARCHITECTURE.md:194:> - **어드민 폼 입력 필드 (UI 수집)**: 어드민의 "ClinicProfile 입력" 화면은 **두 섹션**으로 구성된다 — (a) 기관 정체성 섹션 (ClinicProfile 계약 필드) + (b) 본원 위치·연락·시간 섹션 (LocationProfile main 생성용 입력). 폼 한 화면, 출력은 **두 개 파일** (ClinicProfile + LocationProfile main).
docs/admin/ARCHITECTURE.md:200:**(2) `LocationProfile`(slug=`main`) 파일** — 다음 규칙으로 자동 생성:
docs/admin/ARCHITECTURE.md:202:| LocationProfile 필드 | 자동 생성 값 (어드민 폼의 "본원 위치·연락·시간" 섹션 입력값) |
docs/admin/ARCHITECTURE.md:204:| `@id` | `"main"` |
docs/admin/ARCHITECTURE.md:206:| `parentClinic` | ClinicProfile의 `@id` |
docs/admin/ARCHITECTURE.md:209:| `businessHours` | 폼의 "본원 진료시간·접수시간·점심·휴진" 입력값 |
docs/admin/ARCHITECTURE.md:213:| `reservationChannels` | ClinicProfile의 `primaryCtas` 상속 |
docs/admin/ARCHITECTURE.md:215:**다지점 확장 시 (Phase Beta+)**: 별도 LocationProfile 추가 입력 화면 도입. M0에서는 단일 main만 지원.
docs/admin/ARCHITECTURE.md:217:**구현 책임**: 어드민이 ClinicProfile 폼 발행 트리거 시점에 두 파일(ClinicProfile + LocationProfile main)을 동시 출력해 Git에 함께 커밋. 운영자는 두 파일을 직접 편집해서 override 가능.
docs/admin/ARCHITECTURE.md:219:### 3.8.2 LegalDocument 자동 생성 규칙
docs/admin/ARCHITECTURE.md:225:| `@id` | 정책 종류별 slug (예: `"privacy"`, `"terms"`) |
docs/admin/ARCHITECTURE.md:228:| `body` | Core 표준 템플릿 본문 + **ClinicProfile 변수** (`{{clinic.name}}`·`{{clinic.legalEntityName}}`·`{{clinic.businessRegistrationNumber}}`·`{{clinic.founder}}`) + **LocationProfile(main) 변수** (`{{location.main.email}}`·`{{location.main.address}}`·`{{location.main.telephone}}`) — 출처 SoT 준수 |
docs/admin/ARCHITECTURE.md:326:> **계약 필드 vs 폼 입력 필드의 구분** (§ 3.8.1 참조): 어드민 UI 한 화면이 여러 계약 필드를 분리해 출력하는 케이스가 있다. 화면 수와 계약 수는 1:1이 아니다.
docs/admin/ARCHITECTURE.md:332:| ClinicProfile 화면 | (a) 기관 정체성 / (b) 본원 위치·연락·시간 / (c) 정책 변수 (보조) | `ClinicProfile` + `LocationProfile`(main) + `LegalDocument`(privacy·terms 등 자동 생성) |
docs/admin/ARCHITECTURE.md:487:| 2026-05-14 | v0.4 | **PAGE_TYPES v0.5 + DATA_MODEL v0.4 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 7종+1샘플 → **8종+1샘플=9개 페이지** (P-014 Location Detail 추가), (2) **§ 3.8.1 LocationProfile(main) 자동 생성 규칙 명시** — 어드민 화면 추가 없이 ClinicProfile 입력으로 자동 생성, (3) § 3.11 완료 게이트 #1 8종 빌드로 수정. 어드민 화면 수 6개는 그대로 유지 | Glitzy (Claude 페어링) |
docs/admin/ARCHITECTURE.md:488:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **§ 3.8.1 표현 정리** — 계약 필드(파일 출력)와 어드민 폼 입력 필드(UI 수집)의 구분 명시. ClinicProfile 폼은 두 섹션(기관 정체성 + 본원 위치·연락·시간)으로 출력은 ClinicProfile + LocationProfile main 두 파일, (2) **§ 3.8.2 LegalDocument 자동 생성 규칙 신규** — Core 표준 템플릿 + ClinicProfile 변수 치환, ComplianceRecord 추적, (3) **§ 3.8 Slice 9종+1샘플 → 10종+1샘플=10페이지** (P-013 격상 추가), (4) § 3.11 완료 게이트 #1 10종, (5) **§ 5.2 데이터 입력 영역** — 어드민 화면별 입력·출력 매핑 표 추가로 1:1이 아님 명시 | Glitzy (Claude 페어링) |
docs/admin/ARCHITECTURE.md:489:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **§ 3.3 ClinicProfile 행 분리** — 이전 v0.3 잔존 표현(ClinicProfile에 주소·전화·시간)을 SoT 정합으로 정정. ClinicProfile/LocationProfile(main)/LegalDocument 3개 계약 행 + 자동 생성 표시, (2) **§ 3.8.2 LegalDocument body 변수 출처 정정** — ClinicProfile + LocationProfile(main) 두 SoT 명시 (`{{clinic.*}}`·`{{location.main.*}}` 네임스페이스), (3) **§ 3.8.2 법무 검토 강제 룰** — LegalDocument는 위험도 Low이지만 ComplianceRecord.legalCounsel·legalCounselAt 필수 (어드민 발행 게이트 차단) | Glitzy (Claude 페어링) |
docs/admin/ARCHITECTURE.md:490:| 2026-05-14 | v0.7 | **피드백 정정**: § 3.2 Slice 6개 화면 표 — ② 사이트 기본 정보의 입력 데이터 `ClinicProfile`만 → **`ClinicProfile` + `LocationProfile`(main) + `LegalDocument`** 3 계약 동시 출력로 정정. § 3.8.1/§ 3.8.2와 정합 | Glitzy (Claude 페어링) |
docs/core/CONTENT_STANDARDS.md:368:  contentRef: string;                 // 대상 콘텐츠 @id
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

2026-05-16T06:35:54.042779Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 2.5 seconds
Output:
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m
rg: regex parse error:
    (?:LL-CASCADE-04|deep clone|@id=\)
    ^
error: unclosed group

 exited 1 in 2452ms:
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m
rg: regex parse error:
    (?:LL-CASCADE-04|deep clone|@id=\)
    ^
error: unclosed group

codex
초기 병렬 조회 중 하나는 PowerShell 제한에 걸렸고, 하나는 따옴표가 정규식으로 해석되어 실패했습니다. 파일 읽기는 가능한 상태라서 `rg -n` 중심으로 필요한 구간만 다시 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Test-Path docs/decisions/M0_BUILD_EXPORT_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n -F "LL-CASCADE-04" docs/decisions/LOCATION_LEGAL_PLAN.md docs/decisions/M0_BUILD_EXPORT_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n -F "LL-DEFER-19" docs/decisions/LOCATION_LEGAL_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n -F "observability.ts" docs/decisions/LOCATION_LEGAL_PLAN.md' in C:\Users\assag\solution\website-exposure
 succeeded in 2175ms:
docs/decisions/M0_BUILD_EXPORT_PLAN.md:3:> **상태**: **v0.1 (placeholder)** — `LOCATION_LEGAL_PLAN.md` v1.0 acceptance 의 LL-CASCADE-04 precondition 으로 신설. 실 plan content 는 M0 v1.0 본 구현 (`apps/worker` build/export 함수) 진입 시점에 합류.
docs/decisions/M0_BUILD_EXPORT_PLAN.md:11:- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.0 — LL-CASCADE-04 책임 명시 (본 문서 의 cascade target)
docs/decisions/M0_BUILD_EXPORT_PLAN.md:22:### 1.2 LL-CASCADE-04 책임 (LOCATION_LEGAL_PLAN v1.0 cascade)
docs/decisions/M0_BUILD_EXPORT_PLAN.md:36:### 1.3 LL-CASCADE-04 외 (M0 v1.0 합류 시점에 확장)
docs/decisions/M0_BUILD_EXPORT_PLAN.md:61:| 2026-05-16 | v0.1 | LOCATION_LEGAL_PLAN v1.0 acceptance precondition 으로 placeholder 신설. LL-CASCADE-04 책임 명시 (ClinicProfile.locations / LocationProfile.parentClinic·reservationChannels / primary_ctas `id` → `@id` alias). |
docs/decisions/LOCATION_LEGAL_PLAN.md:199:    -- DB key = 'id' (Git 출력 시 '@id' alias 변환은 LL-CASCADE-04 build/export 책임)
docs/decisions/LOCATION_LEGAL_PLAN.md:364:- (LL-ACTION-08 · cycle1 LL-02 + cycle3 LL-45 patch — LL-SCHEMA-12·LL-SCHEMA-18 통일) LocationProfile 자동 상속 = **build-time reference (deep clone)**. server action 안 DB 저장은 `metadata.reservationChannelsInheritedFrom = "clinic_profile.primary_ctas"` marker 만 (의도 명시용). 실제 출력 시점은 apps/worker · M0 v1.0 build/export 의 책임 (LL-CASCADE-04 marker 신설).
docs/decisions/LOCATION_LEGAL_PLAN.md:586:> **acceptance 순서 정합 (cycle2 LL-33)**: LL-CASCADE-01 은 plan v1.0 acceptance 와 **동시 또는 직전** 에 ARCH patch 적용 (plan acceptance commit 안 포함). LL-CASCADE-02 · LL-CASCADE-03 · LL-CASCADE-04 도 동일 정책. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
docs/decisions/LOCATION_LEGAL_PLAN.md:591:- `LL-CASCADE-04` (cycle3 LL-41 + cycle4 LL-49 + **cycle5 LL-56 patch — placeholder 실 파일 작성 완료**): **cascade target 정정** — ADMIN_UI_SKELETON_PLAN § 6 은 walking skeleton 의 actions 영역으로 build/export 부재 → **`docs/decisions/M0_BUILD_EXPORT_PLAN.md` (v0.1 placeholder · 2026-05-16 작성 완료)** + 본 plan 의 LL-CASCADE-04 marker reference. apps/worker · M0 v1.0 Git export 책임: LocationProfile.reservationChannels Git 출력 시 `clinic_profile.primary_ctas` deep clone, LocationProfile.@id = `"main"`, LocationProfile.parentClinic = ClinicProfile.@id reference, ClinicProfile.locations[] = SELECT 결과, primary_ctas DB key `id` → Git output `@id` alias 변환. **acceptance 강도 = placeholder 작성 완료** (`docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 1.2 LL-CASCADE-04 책임 표 명시). 실 구현은 M0 v1.0 본 구현.
docs/decisions/LOCATION_LEGAL_PLAN.md:601:| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
docs/decisions/LOCATION_LEGAL_PLAN.md:602:| 2026-05-16 | v0.5 | **Codex 비평 cycle4 8 findings (2 blocking + 4 major + 2 minor) 전건 수용 patch**: (LL-48) trigger RAISE EXCEPTION USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' 추가 — errors.ts mapDbErrorToResult 가 SQLSTATE 23514 + constraint name 으로 분기 가능. (LL-49) LL-CASCADE-04 target 정정 — ADMIN_UI_SKELETON_PLAN § 6 은 actions 영역으로 build/export 부재. 신규 `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 신설 + LL-CASCADE-04 책임 row 1건 cascade. acceptance 강도 = placeholder 작성. (LL-50) CT-03 enum SoT 정렬 — DB trigger 허용 11종 (phone/email/sms/kakao-talk/kakao-channel/naver-reservation/naver-talk/form/map/external/video-consultation) + UI subset 3종 분리. LL-DEFER-19 8종 UI 합류. (LL-51) form (b) UI copy 정정 — kakao → kakao-talk · naver-booking → naver-reservation 토큰. (LL-52) LL-DEFER-04/05 phase 충돌 정정 — §9.3 → M0 v1.0 본 구현 (LocationProfile 편집 화면) 으로 통일. M2 Phase Beta 표기 제거 (현재 비어 있음 — 외부 사용자 RBAC 가 M2). (LL-53) LL-CASCADE-05 강도 명시 — plan v1.0 acceptance = manifest spec 작성만 차단, 실 runner 코드는 LL-DEFER-20 (M0 v1.0). (LL-54) trigger function IMMUTABLE 마킹 제거 — VOLATILE 기본 (NEW 읽기 + row-specific RAISE 정합). (LL-55) Sentry pre-integration fallback 명시 — v0.5 단계 console/server stdout only, M0 v1.0 LL-DEFER-18 합류 후 Sentry capture. **누계 55 findings 전건 수용**. |
docs/decisions/LOCATION_LEGAL_PLAN.md:603:| 2026-05-16 | v0.6 | **Codex 비평 cycle5 3 findings (1 blocking + 0 major + 2 minor) 전건 수용 patch**: (LL-56) `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 실 파일 작성 완료 (v0.1 — §1.2 LL-CASCADE-04 책임 표 포함). (LL-57) LL-DEFER-19 phase 단일화 — §9.1 M0 v1.0 그룹 → §9.2 M1 Phase Alpha 그룹 으로 이동 ("M0 v1.0 또는 M1" 모호 표현 정정). M0 v0.5 의 3종 subset 으로 1호 클라이언트 출시 가능 명시. (LL-58) Sentry SDK 초기화 위치 = `apps/web/src/lib/observability.ts` (init + captureException + addBreadcrumb helper) 한 줄 명시 — LL-DEFER-18 내. **누계 58 findings 전건 수용**. |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 2188ms:
234:  - UI subset 외 type (sms/form/map/external 등) 은 M0 v1.0 또는 M1 cascade (LL-DEFER-19).
562:- `LL-DEFER-19` (cycle4 LL-50 + cycle5 LL-57 patch — phase 단일화): primaryCtas UI subset 확장 — CT-03 11종 중 phone/kakao-talk/naver-reservation 외 8종 (`email`/`sms`/`kakao-channel`/`naver-talk`/`form`/`map`/`external`/`video-consultation`) 의 UI 입력. M0 v0.5 의 3종 subset 으로 1호 클라이언트 출시 가능 — 추가 8종은 M1.
602:| 2026-05-16 | v0.5 | **Codex 비평 cycle4 8 findings (2 blocking + 4 major + 2 minor) 전건 수용 patch**: (LL-48) trigger RAISE EXCEPTION USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' 추가 — errors.ts mapDbErrorToResult 가 SQLSTATE 23514 + constraint name 으로 분기 가능. (LL-49) LL-CASCADE-04 target 정정 — ADMIN_UI_SKELETON_PLAN § 6 은 actions 영역으로 build/export 부재. 신규 `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 신설 + LL-CASCADE-04 책임 row 1건 cascade. acceptance 강도 = placeholder 작성. (LL-50) CT-03 enum SoT 정렬 — DB trigger 허용 11종 (phone/email/sms/kakao-talk/kakao-channel/naver-reservation/naver-talk/form/map/external/video-consultation) + UI subset 3종 분리. LL-DEFER-19 8종 UI 합류. (LL-51) form (b) UI copy 정정 — kakao → kakao-talk · naver-booking → naver-reservation 토큰. (LL-52) LL-DEFER-04/05 phase 충돌 정정 — §9.3 → M0 v1.0 본 구현 (LocationProfile 편집 화면) 으로 통일. M2 Phase Beta 표기 제거 (현재 비어 있음 — 외부 사용자 RBAC 가 M2). (LL-53) LL-CASCADE-05 강도 명시 — plan v1.0 acceptance = manifest spec 작성만 차단, 실 runner 코드는 LL-DEFER-20 (M0 v1.0). (LL-54) trigger function IMMUTABLE 마킹 제거 — VOLATILE 기본 (NEW 읽기 + row-specific RAISE 정합). (LL-55) Sentry pre-integration fallback 명시 — v0.5 단계 console/server stdout only, M0 v1.0 LL-DEFER-18 합류 후 Sentry capture. **누계 55 findings 전건 수용**. |
603:| 2026-05-16 | v0.6 | **Codex 비평 cycle5 3 findings (1 blocking + 0 major + 2 minor) 전건 수용 patch**: (LL-56) `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 실 파일 작성 완료 (v0.1 — §1.2 LL-CASCADE-04 책임 표 포함). (LL-57) LL-DEFER-19 phase 단일화 — §9.1 M0 v1.0 그룹 → §9.2 M1 Phase Alpha 그룹 으로 이동 ("M0 v1.0 또는 M1" 모호 표현 정정). M0 v0.5 의 3종 subset 으로 1호 클라이언트 출시 가능 명시. (LL-58) Sentry SDK 초기화 위치 = `apps/web/src/lib/observability.ts` (init + captureException + addBreadcrumb helper) 한 줄 명시 — LL-DEFER-18 내. **누계 58 findings 전건 수용**. |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 2284ms:
True
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 2198ms:
549:- `LL-DEFER-18` (cycle3 LL-43 + cycle5 LL-58 patch): Sentry SDK 통합 (INFRA INFR-PROV `Sentry` Provider). audit partial/failed row INSERT 실패 시 capture 채널. **SDK 초기화 위치 및 wrapping 책임 = `apps/web/src/lib/observability.ts` (Sentry init + `captureException` / `addBreadcrumb` helper)** — server action / route handler 가 console.error 대신 observability helper 호출. M0 v1.0 본 구현 (provider 통합 시점).
603:| 2026-05-16 | v0.6 | **Codex 비평 cycle5 3 findings (1 blocking + 0 major + 2 minor) 전건 수용 patch**: (LL-56) `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 실 파일 작성 완료 (v0.1 — §1.2 LL-CASCADE-04 책임 표 포함). (LL-57) LL-DEFER-19 phase 단일화 — §9.1 M0 v1.0 그룹 → §9.2 M1 Phase Alpha 그룹 으로 이동 ("M0 v1.0 또는 M1" 모호 표현 정정). M0 v0.5 의 3종 subset 으로 1호 클라이언트 출시 가능 명시. (LL-58) Sentry SDK 초기화 위치 = `apps/web/src/lib/observability.ts` (init + captureException + addBreadcrumb helper) 한 줄 명시 — LL-DEFER-18 내. **누계 58 findings 전건 수용**. |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

codex
핵심 증거는 대부분 확인됐습니다. 다만 `LL-DEFER-19`가 이동된 뒤에도 앞쪽 schema 설명에 “M0 v1.0 또는 M1” 표현이 남아 있어, 이것이 단순 설명 잔재인지 실제 phase 충돌인지 주변 문맥을 더 보겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n -C 4 -F "M0 v1.0 또는 M1" docs/decisions/LOCATION_LEGAL_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n -C 8 -F "### 9.1" docs/decisions/LOCATION_LEGAL_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n -C 8 -F "### 9.2" docs/decisions/LOCATION_LEGAL_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n -C 3 -F "### 1.2 LL-CASCADE-04" docs/decisions/M0_BUILD_EXPORT_PLAN.md' in C:\Users\assag\solution\website-exposure
 succeeded in 1645ms:
535-| 8 | mapDbErrorToResult 신규 constraint 매핑 | apps/web/src/lib/errors.ts |
536-| 9 | content-saved audit matrix row 추가 (LocationProfile · LegalDocument) | ADMIN_UI_SKELETON_PLAN § 5.5 cascade marker (LL-CASCADE-02) |
537-| 10 | admin/ARCHITECTURE.md § 3.8.2 변수 화이트리스트 reference 추가 | LL-CASCADE-01 |
538-| 11 | docs/core/CONTENT_STANDARDS.md § 7 LegalDocument 예외 marker 추가 | LL-CASCADE-03 |
539-| 12 | 시나리오 14~22 LOCAL_PASS 검증 | apps/web/README.md 또는 별도 scenario doc |
540-
541-## 9. M0 v1.0 cascade marker (defer 정리 · cycle3 LL-47 patch — phase 별 그룹화)
542-
543:### 9.1 M0 v1.0 본 구현 합류 (Phase 0 Week 4~)
544-
545-- `LL-DEFER-01`: LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제 · review-queued 전이 + ComplianceRecord pre-publish + NotificationEvent envelope · status=published). compliance-assistant Feature + ComplianceRecord UI cascade.
546-- `LL-DEFER-09`: LegalDocument 편집 권한 분리 (operator-edit-legal ActionType — REVIEW_WORKFLOW 14 ActionType cascade).
547-- `LL-DEFER-11`: LegalDocument body 검증 — CONTENT_STANDARDS § 7 ContentType 예외 marker cascade (LL-CASCADE-03). 추가 검증 룰은 compliance-assistant Feature.
548-- `LL-DEFER-15` (cycle2 LL-29 patch): location_profile 의 main slug 1 row 강제 DB trigger 또는 partial unique with `clinic_profile_id` 기반 cascade — v0.4 은 server action assertHasMainLocationAfterTx 안전망. M0 v1.0 본 구현에서 DB-level invariant 합류.
549-- `LL-DEFER-18` (cycle3 LL-43 + cycle5 LL-58 patch): Sentry SDK 통합 (INFRA INFR-PROV `Sentry` Provider). audit partial/failed row INSERT 실패 시 capture 채널. **SDK 초기화 위치 및 wrapping 책임 = `apps/web/src/lib/observability.ts` (Sentry init + `captureException` / `addBreadcrumb` helper)** — server action / route handler 가 console.error 대신 observability helper 호출. M0 v1.0 본 구현 (provider 통합 시점).
550-- `LL-DEFER-20` (cycle4 LL-53 patch): packages/migrations-runner 실 runner 코드 — manifest spec 작성 (plan v1.0 acceptance precondition) 후 sequential apply + fail-fast 구현. M0 v1.0 본 구현.
551-
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 1655ms:
230-- (LL-SCHEMA-11 · cycle1 LL-15 patch) `policy_effective_date` 는 form 안 5 LegalDocument record 의 default 만. 운영자가 각 record 별 override 가능 (LL-DEFER-08 closed).
231-- (LL-SCHEMA-12 · cycle1 LL-02 + cycle2 LL-26 + cycle3 LL-38·LL-40·LL-45 + cycle4 LL-50·LL-51 patch) `primary_ctas` JSONB array — admin/ARCH § 3.8.1 의 `reservationChannels = primaryCtas 상속` SoT 보존. 각 원소는 **CT-03 SoT shape**: `{id: string, type: enum, label: string, targetUrl: string (required)}`. **type enum 정책 = DB trigger 전체 허용 + UI subset 분리** (cycle4 LL-50):
232-  - DB trigger 허용 11종 (CT-03 SoT 전체): `phone` · `email` · `sms` · `kakao-talk` · `kakao-channel` · `naver-reservation` · `naver-talk` · `form` · `map` · `external` · `video-consultation`.
233-  - **M0 v0.5 UI 입력 subset 3종** (LL-FORM-08): `phone` · `kakao-talk` · `naver-reservation`. UI form 의 select 옵션도 SoT 정확 token (cycle4 LL-51 — 기존 `kakao` / `naver-booking` 잘못된 별명 제거).
234:  - UI subset 외 type (sms/form/map/external 등) 은 M0 v1.0 또는 M1 cascade (LL-DEFER-19).
235-  - **DB 검증 = trigger** (CHECK subquery 불가 · cycle3 LL-38 patch) + form zod (UI subset 3종 enum) 양쪽. LocationProfile 자동 생성 시 **build-time reference (deep clone)** — DB metadata 복사 없음 (LL-SCHEMA-18 통일).
236-
237-### 2.3 `location_profile` clinic_profile_id 추가 + businessHours CT-02 SoT 변환 (LL-SCHEMA-13)
238-
--
599-| 2026-05-16 | v0.2 | **Codex 비평 cycle1 25 findings (7 blocking + 12 major + 6 minor) 전건 수용 patch**: (LL-01) location_profile 에 clinic_profile_id composite FK + main row CHECK, ClinicProfile.locations[] Git 출력 빌드 시점 동적 구성. (LL-02) ClinicProfile.primary_ctas 컬럼 + LocationProfile.reservationChannels = primary_ctas 자동 상속 marker. (LL-03·04) status='draft' 만 허용 (review-queued 도 차단) — ComplianceRecord pre-publish + NotificationEvent 합류 시점까지 defer. (LL-05) businessHours SoT CT-02 형식 (openingHours[]·receptionHours[]·lunchBreaks[]·specialClosures[]) 변환 + server action 안 convertToOpeningHoursSpec 명시. (LL-06) policy.* 변수 정당화 + LL-CASCADE-01 cascade marker. (LL-07) 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha. (LL-08·09) partial UNIQUE — closed 5종만. cookie/other LL-DEFER-12. (LL-10) C-21 출력 매핑표 명시. (LL-11) representativeDoctors v0.2 빈 배열. (LL-12) risk_level NOT NULL + CHECK 'Low' 만. (LL-13) SoT 경로 정정 (docs/core/CONTENT_STANDARDS.md) + LL-CASCADE-03. (LL-14) policyContactPhone form 단계 required. (LL-15) effective_date individual override 합류 (LL-DEFER-08 closed). (LL-16) 자동 재렌더링 분기 제거 (모든 row 매 저장 시 재렌더링). (LL-17) audit 7 row 별도 emit (Bundle outer 폐기). (LL-18) RBAC 분리 marker LL-DEFER-09 명시. (LL-19) published CHECK 위반 시 운영자 메시지 + errors.ts 매핑. (LL-20) phone regex 한국 + 국제 표기 명시. (LL-21) effective_date timezone Asia/Seoul. (LL-22) template_version naming autoGenerated=true 일 때만 필수. (LL-23) businessHours a11y marker. (LL-24) detection 시점 server action runtime + build-time test cascade. (LL-25) LL-DEFER-08~10 본문 §1 비범위 표 반영. |
600-| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
601-| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
602-| 2026-05-16 | v0.5 | **Codex 비평 cycle4 8 findings (2 blocking + 4 major + 2 minor) 전건 수용 patch**: (LL-48) trigger RAISE EXCEPTION USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' 추가 — errors.ts mapDbErrorToResult 가 SQLSTATE 23514 + constraint name 으로 분기 가능. (LL-49) LL-CASCADE-04 target 정정 — ADMIN_UI_SKELETON_PLAN § 6 은 actions 영역으로 build/export 부재. 신규 `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 신설 + LL-CASCADE-04 책임 row 1건 cascade. acceptance 강도 = placeholder 작성. (LL-50) CT-03 enum SoT 정렬 — DB trigger 허용 11종 (phone/email/sms/kakao-talk/kakao-channel/naver-reservation/naver-talk/form/map/external/video-consultation) + UI subset 3종 분리. LL-DEFER-19 8종 UI 합류. (LL-51) form (b) UI copy 정정 — kakao → kakao-talk · naver-booking → naver-reservation 토큰. (LL-52) LL-DEFER-04/05 phase 충돌 정정 — §9.3 → M0 v1.0 본 구현 (LocationProfile 편집 화면) 으로 통일. M2 Phase Beta 표기 제거 (현재 비어 있음 — 외부 사용자 RBAC 가 M2). (LL-53) LL-CASCADE-05 강도 명시 — plan v1.0 acceptance = manifest spec 작성만 차단, 실 runner 코드는 LL-DEFER-20 (M0 v1.0). (LL-54) trigger function IMMUTABLE 마킹 제거 — VOLATILE 기본 (NEW 읽기 + row-specific RAISE 정합). (LL-55) Sentry pre-integration fallback 명시 — v0.5 단계 console/server stdout only, M0 v1.0 LL-DEFER-18 합류 후 Sentry capture. **누계 55 findings 전건 수용**. |
603:| 2026-05-16 | v0.6 | **Codex 비평 cycle5 3 findings (1 blocking + 0 major + 2 minor) 전건 수용 patch**: (LL-56) `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 실 파일 작성 완료 (v0.1 — §1.2 LL-CASCADE-04 책임 표 포함). (LL-57) LL-DEFER-19 phase 단일화 — §9.1 M0 v1.0 그룹 → §9.2 M1 Phase Alpha 그룹 으로 이동 ("M0 v1.0 또는 M1" 모호 표현 정정). M0 v0.5 의 3종 subset 으로 1호 클라이언트 출시 가능 명시. (LL-58) Sentry SDK 초기화 위치 = `apps/web/src/lib/observability.ts` (init + captureException + addBreadcrumb helper) 한 줄 명시 — LL-DEFER-18 내. **누계 58 findings 전건 수용**. |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 1705ms:
544-
545-- `LL-DEFER-01`: LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제 · review-queued 전이 + ComplianceRecord pre-publish + NotificationEvent envelope · status=published). compliance-assistant Feature + ComplianceRecord UI cascade.
546-- `LL-DEFER-09`: LegalDocument 편집 권한 분리 (operator-edit-legal ActionType — REVIEW_WORKFLOW 14 ActionType cascade).
547-- `LL-DEFER-11`: LegalDocument body 검증 — CONTENT_STANDARDS § 7 ContentType 예외 marker cascade (LL-CASCADE-03). 추가 검증 룰은 compliance-assistant Feature.
548-- `LL-DEFER-15` (cycle2 LL-29 patch): location_profile 의 main slug 1 row 강제 DB trigger 또는 partial unique with `clinic_profile_id` 기반 cascade — v0.4 은 server action assertHasMainLocationAfterTx 안전망. M0 v1.0 본 구현에서 DB-level invariant 합류.
549-- `LL-DEFER-18` (cycle3 LL-43 + cycle5 LL-58 patch): Sentry SDK 통합 (INFRA INFR-PROV `Sentry` Provider). audit partial/failed row INSERT 실패 시 capture 채널. **SDK 초기화 위치 및 wrapping 책임 = `apps/web/src/lib/observability.ts` (Sentry init + `captureException` / `addBreadcrumb` helper)** — server action / route handler 가 console.error 대신 observability helper 호출. M0 v1.0 본 구현 (provider 통합 시점).
550-- `LL-DEFER-20` (cycle4 LL-53 patch): packages/migrations-runner 실 runner 코드 — manifest spec 작성 (plan v1.0 acceptance precondition) 후 sequential apply + fail-fast 구현. M0 v1.0 본 구현.
551-
552:### 9.2 M1 Phase Alpha 합류
553-
554-- `LL-DEFER-02`: 정책 개정 이력 (`revisions[]`) UI.
555-- `LL-DEFER-03`: LegalDocument 수동 작성 모드 (autoGenerated=false · Markdown 에디터).
556-- `LL-DEFER-06`: LegalDocument body 수동 override · `body_source` enum cascade.
557-- `LL-DEFER-07`: latitude/longitude 지도 pinpoint.
558-- `LL-DEFER-10`: 템플릿 major 버전 변경 시 운영자 수동 확인.
559-- `LL-DEFER-12`: `cookie`/`other` documentType UI (manual 입력 + custom template).
560-- `LL-DEFER-13`: custom (`documentType=other`) template_version namespace 규약.
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 1725ms:
19-- 변환 시점 = 운영자 "발행" 액션 (compliance-assistant 게이트 통과 후) + apps/worker job.
20-- `instance_id` 별 별도 git working tree (또는 단일 git repo 안 `instances/<instanceSlug>/` subtree).
21-
22:### 1.2 LL-CASCADE-04 책임 (LOCATION_LEGAL_PLAN v1.0 cascade)
23-
24-| 변환 | DB source | Git output |
25-|---|---|---|
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n -C 16 -F "primary_ctas" docs/decisions/M0_BUILD_EXPORT_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n -C 5 -F "businessHours" docs/decisions/M0_BUILD_EXPORT_PLAN.md docs/decisions/LOCATION_LEGAL_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n -F "LL-DEFER-" docs/decisions/LOCATION_LEGAL_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n -F "LL-CASCADE-05" docs/decisions/LOCATION_LEGAL_PLAN.md' in C:\Users\assag\solution\website-exposure
 succeeded in 1828ms:
14-## 1. 책임 영역
15-
16-### 1.1 본 plan 의 범위
17-
18-- 어드민 DB (`clinic_profile` · `location_profile` · `doctor_profile` · `treatment_page` · `article` · `legal_document` · 등) → Git output (Markdown frontmatter + YAML/JSON content file) 변환.
19-- 변환 시점 = 운영자 "발행" 액션 (compliance-assistant 게이트 통과 후) + apps/worker job.
20-- `instance_id` 별 별도 git working tree (또는 단일 git repo 안 `instances/<instanceSlug>/` subtree).
21-
22-### 1.2 LL-CASCADE-04 책임 (LOCATION_LEGAL_PLAN v1.0 cascade)
23-
24-| 변환 | DB source | Git output |
25-|---|---|---|
26-| ClinicProfile `@id` | `clinic_profile.slug` (보통 `clinic`) | `@id: clinic` |
27-| ClinicProfile `locations[]` | `SELECT id FROM location_profile WHERE clinic_profile_id = ? ORDER BY slug` | `locations: [<ref to LocationProfile.@id>]` (1개 이상 — main 필수) |
28-| LocationProfile `@id` | `location_profile.slug` (보통 `main`) | `@id: main` |
29-| LocationProfile `parentClinic` | `clinic_profile.slug` (composite FK target) | `parentClinic: clinic` |
30:| LocationProfile `reservationChannels` | `clinic_profile.primary_ctas` deep clone (main 자동 상속 · cycle1 LL-02 SoT) | `reservationChannels: [...]` |
31-| LocationProfile `businessHours` | `location_profile.metadata.businessHours` (CT-02 SoT 형식 그대로) | `businessHours: {...}` |
32:| primary_ctas / reservationChannels element key | DB `id` | Git `@id` (alias 변환) |
33-| LegalDocument body | `legal_document.body` (rendered Markdown · 변수 치환 완료) | `<documentType>.md` 본문 |
34-| LegalDocument metadata | documentType · title · effective_date · template_version · contact_person · contact_email | frontmatter YAML |
35-
36-### 1.3 LL-CASCADE-04 외 (M0 v1.0 합류 시점에 확장)
37-
38-- DoctorProfile · TreatmentPage · Article 의 schema.org JSON-LD 변환.
39-- ComplianceRecord (audit DB · ARCH § 6.3 cross-data) → Git output 사본.
40-- InstanceManifest · BrandTokens · FeatureModuleConfig.
41-- 미디어 자산 (이미지/동영상) — Cloudflare R2 → Git LFS 또는 referenced URL.
42-
43-## 2. 작업 단위 (M0 v1.0 합류 시)
44-
45-- apps/worker 신설 — Next.js 외 Node.js standalone worker (cron-triggered + 발행 트리거).
46-- Git client (isomorphic-git 또는 simple-git) 통합.
47-- DB → Git output 변환 함수 (entity 별 + JSON-LD generator).
48-- CI pipeline 통합 (변환 결과 commit → 사이트 빌드 trigger).
49-- 시나리오 LOCAL_PASS — 발행 트리거 → Git commit → 빌드 성공.
50-
51-## 3. 비범위 (M0 v1.0 외)
52-
53-- PR 워크플로우 (Direct push 외) — M2 Phase Beta.
54-- Git history 시각화 UI — M2 Phase Beta.
55-- 다국어 출력 — M3.
56-
57-## 변경 이력
58-
59-| 일자 | 버전 | 변경 |
60-|---|---|---|
61:| 2026-05-16 | v0.1 | LOCATION_LEGAL_PLAN v1.0 acceptance precondition 으로 placeholder 신설. LL-CASCADE-04 책임 명시 (ClinicProfile.locations / LocationProfile.parentClinic·reservationChannels / primary_ctas `id` → `@id` alias). |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 1861ms:
docs/decisions/M0_BUILD_EXPORT_PLAN.md-26-| ClinicProfile `@id` | `clinic_profile.slug` (보통 `clinic`) | `@id: clinic` |
docs/decisions/M0_BUILD_EXPORT_PLAN.md-27-| ClinicProfile `locations[]` | `SELECT id FROM location_profile WHERE clinic_profile_id = ? ORDER BY slug` | `locations: [<ref to LocationProfile.@id>]` (1개 이상 — main 필수) |
docs/decisions/M0_BUILD_EXPORT_PLAN.md-28-| LocationProfile `@id` | `location_profile.slug` (보통 `main`) | `@id: main` |
docs/decisions/M0_BUILD_EXPORT_PLAN.md-29-| LocationProfile `parentClinic` | `clinic_profile.slug` (composite FK target) | `parentClinic: clinic` |
docs/decisions/M0_BUILD_EXPORT_PLAN.md-30-| LocationProfile `reservationChannels` | `clinic_profile.primary_ctas` deep clone (main 자동 상속 · cycle1 LL-02 SoT) | `reservationChannels: [...]` |
docs/decisions/M0_BUILD_EXPORT_PLAN.md:31:| LocationProfile `businessHours` | `location_profile.metadata.businessHours` (CT-02 SoT 형식 그대로) | `businessHours: {...}` |
docs/decisions/M0_BUILD_EXPORT_PLAN.md-32-| primary_ctas / reservationChannels element key | DB `id` | Git `@id` (alias 변환) |
docs/decisions/M0_BUILD_EXPORT_PLAN.md-33-| LegalDocument body | `legal_document.body` (rendered Markdown · 변수 치환 완료) | `<documentType>.md` 본문 |
docs/decisions/M0_BUILD_EXPORT_PLAN.md-34-| LegalDocument metadata | documentType · title · effective_date · template_version · contact_person · contact_email | frontmatter YAML |
docs/decisions/M0_BUILD_EXPORT_PLAN.md-35-
docs/decisions/M0_BUILD_EXPORT_PLAN.md-36-### 1.3 LL-CASCADE-04 외 (M0 v1.0 합류 시점에 확장)
--
docs/decisions/LOCATION_LEGAL_PLAN.md-42-| `clinic_profile` 정책 변수 + primaryCtas 컬럼 추가 | `policy_contact_person` · `policy_contact_email` · `policy_contact_phone` · `policy_effective_date` · `primary_ctas` (JSONB · cycle1 LL-02 patch) |
docs/decisions/LOCATION_LEGAL_PLAN.md-43-| `location_profile` clinic_profile_id 추가 | composite FK with instance_id — same-tenant parentClinic 보장 (cycle1 LL-01 patch) |
docs/decisions/LOCATION_LEGAL_PLAN.md-44-| `saveClinicProfile` actions 확장 | 단일 tx 안 ClinicProfile + LocationProfile(main) + 5종 LegalDocument upsert · 변수 치환 · audit 7 row 별도 emit (cycle1 LL-17 patch) |
docs/decisions/LOCATION_LEGAL_PLAN.md-45-| Core 표준 템플릿 5종 | packages/core-content/src/templates/ — `privacy.ts` · `terms.ts` · `non-covered.ts` · `refund.ts` · `complaint.ts` |
docs/decisions/LOCATION_LEGAL_PLAN.md-46-| 변수 치환 엔진 | `{{clinic.*}}` · `{{location.main.*}}` · `{{policy.*}}` 화이트리스트 strict — server action runtime 검증 (cycle1 LL-24 patch) |
docs/decisions/LOCATION_LEGAL_PLAN.md:47:| businessHours 입력 검증 + CT-02 SoT 변환 | 7 요일 partial → CT-02 `openingHours[]` · `receptionHours[]` · `lunchBreaks[]` · `specialClosures[]` SoT 형식 변환 후 metadata 저장 (cycle1 LL-05 patch) |
docs/decisions/LOCATION_LEGAL_PLAN.md-48-| 5종 LegalDocument 별 effective_date input | cycle1 LL-15 patch — LL-DEFER-08 reversal. 5 record 별 individual input · default = policy_effective_date |
docs/decisions/LOCATION_LEGAL_PLAN.md-49-| audit payload 통일 shape | cycle1 LL-17 patch — 7 row 별도 emit · 기존 `{contentType, slug, mode, status, originalSlug}` 보존 (Bundle outer 폐기) |
docs/decisions/LOCATION_LEGAL_PLAN.md-50-
docs/decisions/LOCATION_LEGAL_PLAN.md-51-### 1.3 비범위 (defer)
docs/decisions/LOCATION_LEGAL_PLAN.md-52-
--
docs/decisions/LOCATION_LEGAL_PLAN.md-232-  - DB trigger 허용 11종 (CT-03 SoT 전체): `phone` · `email` · `sms` · `kakao-talk` · `kakao-channel` · `naver-reservation` · `naver-talk` · `form` · `map` · `external` · `video-consultation`.
docs/decisions/LOCATION_LEGAL_PLAN.md-233-  - **M0 v0.5 UI 입력 subset 3종** (LL-FORM-08): `phone` · `kakao-talk` · `naver-reservation`. UI form 의 select 옵션도 SoT 정확 token (cycle4 LL-51 — 기존 `kakao` / `naver-booking` 잘못된 별명 제거).
docs/decisions/LOCATION_LEGAL_PLAN.md-234-  - UI subset 외 type (sms/form/map/external 등) 은 M0 v1.0 또는 M1 cascade (LL-DEFER-19).
docs/decisions/LOCATION_LEGAL_PLAN.md-235-  - **DB 검증 = trigger** (CHECK subquery 불가 · cycle3 LL-38 patch) + form zod (UI subset 3종 enum) 양쪽. LocationProfile 자동 생성 시 **build-time reference (deep clone)** — DB metadata 복사 없음 (LL-SCHEMA-18 통일).
docs/decisions/LOCATION_LEGAL_PLAN.md-236-
docs/decisions/LOCATION_LEGAL_PLAN.md:237:### 2.3 `location_profile` clinic_profile_id 추가 + businessHours CT-02 SoT 변환 (LL-SCHEMA-13)
docs/decisions/LOCATION_LEGAL_PLAN.md-238-
docs/decisions/LOCATION_LEGAL_PLAN.md-239-```sql
docs/decisions/LOCATION_LEGAL_PLAN.md-240--- packages/core-content/migrations/C0008_location_profile_parent_clinic.sql
docs/decisions/LOCATION_LEGAL_PLAN.md-241-
docs/decisions/LOCATION_LEGAL_PLAN.md-242--- cycle1 LL-01 + cycle2 LL-28 patch: parentClinic (C-21 required) 관계 모델 — same-tenant composite FK 보장.
--
docs/decisions/LOCATION_LEGAL_PLAN.md-263-```
docs/decisions/LOCATION_LEGAL_PLAN.md-264-
docs/decisions/LOCATION_LEGAL_PLAN.md-265-**결정**:
docs/decisions/LOCATION_LEGAL_PLAN.md-266-- (LL-SCHEMA-14 · cycle1 LL-01 + cycle2 LL-28 patch) `location_profile.clinic_profile_id` composite FK + **모든 row NOT NULL** (C-21 parentClinic required SoT 정합). v0.2 의 'main 만 NOT NULL' 정책 reversal — 다지점 합류 시점에도 정합.
docs/decisions/LOCATION_LEGAL_PLAN.md-267-- (LL-SCHEMA-15 · cycle2 LL-29 patch) ClinicProfile.locations[] (DATA_MODEL C-01 required ≥1) 는 **DB 컬럼 추가 없음** — Git 출력 빌드 시점 `SELECT id FROM location_profile WHERE clinic_profile_id = ?` 으로 동적 구성. cardinality 보장은 server action 안 단일 tx atomic upsert + `assertHasMainLocationAfterTx` 안전망 (LL-ACTION-21). DB trigger cascade 는 LL-DEFER-15.
docs/decisions/LOCATION_LEGAL_PLAN.md:268:- (LL-SCHEMA-16 · cycle1 LL-05 patch) `location_profile.metadata.businessHours` 는 CT-02 SoT 형식 (`openingHours[]` · `receptionHours[]` · `lunchBreaks[]` · `specialClosures[]`) 직접 저장:
docs/decisions/LOCATION_LEGAL_PLAN.md-269-
docs/decisions/LOCATION_LEGAL_PLAN.md-270-```jsonc
docs/decisions/LOCATION_LEGAL_PLAN.md-271-// location_profile.metadata
docs/decisions/LOCATION_LEGAL_PLAN.md-272-{
docs/decisions/LOCATION_LEGAL_PLAN.md:273:  "businessHours": {
docs/decisions/LOCATION_LEGAL_PLAN.md-274-    "openingHours": [
docs/decisions/LOCATION_LEGAL_PLAN.md-275-      // schema.org OpeningHoursSpecification 호환
docs/decisions/LOCATION_LEGAL_PLAN.md-276-      { "dayOfWeek": ["Monday","Tuesday","Wednesday","Friday"], "opens": "09:30", "closes": "18:30" },
docs/decisions/LOCATION_LEGAL_PLAN.md-277-      { "dayOfWeek": ["Thursday"], "opens": "09:30", "closes": "20:30" },
docs/decisions/LOCATION_LEGAL_PLAN.md-278-      { "dayOfWeek": ["Saturday"], "opens": "10:00", "closes": "14:00" }
--
docs/decisions/LOCATION_LEGAL_PLAN.md-306-### 3.1 ClinicProfileForm 3 섹션 + 5 LegalDocument record (LL-FORM-01)
docs/decisions/LOCATION_LEGAL_PLAN.md-307-
docs/decisions/LOCATION_LEGAL_PLAN.md-308-| 섹션 | 입력 필드 | 출력 계약 |
docs/decisions/LOCATION_LEGAL_PLAN.md-309-|---|---|---|
docs/decisions/LOCATION_LEGAL_PLAN.md-310-| **(a) 기관 정체성** (기존) | name · description · logoUrl · ogImageUrl · businessRegistrationNumber + 선택 필드 (alternateName · legalEntityName · slogan · longDescription · foundingDate · founder) | `ClinicProfile` (기존 column) |
docs/decisions/LOCATION_LEGAL_PLAN.md:311:| **(b) 본원 위치·연락·시간** (신규) | streetAddress · addressLocality · addressRegion · postalCode · addressCountry · telephone · email · businessHours (7 요일 + 점심) · primaryCtas (3종 minimal · CT-03 SoT token: `phone`/`kakao-talk`/`naver-reservation` · cycle4 LL-51 patch) · featuredChannelId | `ClinicProfile.primary_ctas` + `LocationProfile`(slug=`main`) |
docs/decisions/LOCATION_LEGAL_PLAN.md-312-| **(c) 정책 변수** (신규 보조 details) | policyContactPerson · policyContactEmail · policyContactPhone · policyEffectiveDate (5종 default) | `ClinicProfile.policy_*` |
docs/decisions/LOCATION_LEGAL_PLAN.md-313-| **(d) 5종 LegalDocument** (신규 보조 details — cycle1 LL-15 patch) | 5 record 별 effectiveDate override (optional · 미입력 시 policyEffectiveDate default) | `LegalDocument` × 5 |
docs/decisions/LOCATION_LEGAL_PLAN.md-314-
docs/decisions/LOCATION_LEGAL_PLAN.md-315-**결정**:
docs/decisions/LOCATION_LEGAL_PLAN.md-316-- (LL-FORM-02) 한 화면 한 폼 (single `<form action>`) — server action 한 번 호출로 3계약 + 5 LegalDocument 동시 출력. 부분 저장 (섹션별 저장) 안 함.
docs/decisions/LOCATION_LEGAL_PLAN.md:317:- (LL-FORM-03) 섹션 (b) 는 본원 위치 SoT 이므로 **모든 필드 required** (street/locality/region/postal/telephone). email 은 optional. businessHours 는 평일 (mon~fri) 5일 중 1일 이상 필수. primaryCtas 는 1건 이상 필수.
docs/decisions/LOCATION_LEGAL_PLAN.md-318-- (LL-FORM-04 · cycle1 LL-14 patch) 섹션 (c) 는 LegalDocument 생성에 필수 — policyContactPerson · policyContactEmail · policyContactPhone · policyEffectiveDate **4 필드 모두 required**. (한국 PIPA 의 개인정보 보호책임자 필수 고지 항목 — 소속/부서 같은 추가 필드는 LL-DEFER 또는 자유 입력 textarea 로 처리. v0.2 는 4 필드만 minimal.)
docs/decisions/LOCATION_LEGAL_PLAN.md-319-- (LL-FORM-05) URL scrape (v1.1) 는 (a) 만 prefill — (b)/(c)/(d) 는 외부 사이트 scrape 으로 추정 불가 / 부정확.
docs/decisions/LOCATION_LEGAL_PLAN.md-320-- (LL-FORM-06) UX: 모든 섹션 펼친 상태 default. 선택 필드 (a 의 details) 은 그대로 접힘. (d) 5 record 도 default 접힘 (override 가 일반 케이스 아님).
docs/decisions/LOCATION_LEGAL_PLAN.md:321:- (LL-FORM-07 · cycle1 LL-23 + cycle2 LL-35 patch) businessHours UI: 7 요일 행. 각 행: `[휴진 ☐]` + `오픈 [HH:mm] 마감 [HH:mm]` + `[점심 ☐]` + `점심 시작 [HH:mm] 종료 [HH:mm]`. 휴진 checked 시 다른 입력 disabled. **a11y 요구**: 각 row 에 `aria-labelledby` (요일 헤더 link) + 각 input `aria-describedby` (요일 에러 메시지 id) + 휴진 toggle 의 `aria-controls` (해당 row 의 input group id). **5 LegalDocument override details a11y (LL-FORM-14)**: `<details>` `<summary>` 는 기본적으로 keyboard interaction (Space/Enter toggle) + `aria-expanded` 자동. 추가로 `<summary>` 안에 정책 이름 + `(시행일: <date>)` 시각 표시 + `aria-controls` (override 입력 group id) + override 입력에 `aria-labelledby` (summary id) 명시.
docs/decisions/LOCATION_LEGAL_PLAN.md-322-- (LL-FORM-08 · cycle1 LL-02 + cycle4 LL-51 patch) primaryCtas UI: **CT-03 SoT token 3종** (`phone` · `kakao-talk` · `naver-reservation`) 각각 1개씩 입력 행. 미입력 = 해당 채널 제외. 각 채널 row 입력 = `targetUrl` (필수: `tel:+82-2-1234-5678` · `https://pf.kakao.com/...` · `https://booking.naver.com/...`) + `label` (필수: 운영자 자유 입력) + `id` (자동 생성: `<type>-<n>`). featuredChannelId 는 입력한 채널 중 select. **단, 이는 ClinicProfile.primary_ctas 의 입력** — LocationProfile.reservationChannels 는 자동 상속 (LL-SCHEMA-18 build-time).
docs/decisions/LOCATION_LEGAL_PLAN.md-323-
docs/decisions/LOCATION_LEGAL_PLAN.md-324-### 3.2 검증
docs/decisions/LOCATION_LEGAL_PLAN.md-325-
docs/decisions/LOCATION_LEGAL_PLAN.md-326-- (LL-FORM-09) zod schema 는 server action / form 양쪽 모두 동일 SoT — `apps/web/src/lib/clinic-profile-schema.ts` 신설.
docs/decisions/LOCATION_LEGAL_PLAN.md:327:- (LL-FORM-10) businessHours 시간 정합 검증: open < close · lunch.from < lunch.to · lunch ∈ [open, close]. 위배 시 `(field=businessHours.monday.lunch, message=...)` 에러.
docs/decisions/LOCATION_LEGAL_PLAN.md-328-- (LL-FORM-11) ISO 형식 검증: `addressCountry ^[A-Z]{2}$` · 시간 `^([01][0-9]|2[0-3]):[0-5][0-9]$` · email/phone regex.
docs/decisions/LOCATION_LEGAL_PLAN.md-329-- (LL-FORM-12 · cycle1 LL-20 patch) phone regex 정책 — 한국 (02-1234-5678 · 010-1234-5678) + 국제 (+82-2-1234-5678). 확장번호 (ext.) · '.' 구분자 (02.1234.5678) 거절. UX 힌트 명시.
docs/decisions/LOCATION_LEGAL_PLAN.md-330-- (LL-FORM-13 · cycle1 LL-15 + cycle2 LL-31 + cycle3 LL-39 patch) form (d) 5 record effectiveDate FormData naming **고정 규약 + parser helper**:
docs/decisions/LOCATION_LEGAL_PLAN.md-331-  - Field name (form 안 flat key) = `legalDocEffective_<documentType>` (5종: `legalDocEffective_privacy` · `legalDocEffective_terms` · `legalDocEffective_non-covered` · `legalDocEffective_refund` · `legalDocEffective_complaint`). cycle3 LL-39 patch: dotted key (`legalDoc.privacy.effectiveDate`) 회귀 — `Object.fromEntries(formData)` 가 nested object 자동 생성하지 않으므로 flat underscore key 로 변경.
docs/decisions/LOCATION_LEGAL_PLAN.md-332-  - server action 안 **parsing helper `extractLegalDocEffectiveOverrides(formData)`** → `Record<DocumentType, string | undefined>` (apps/web/src/lib/clinic-profile-schema.ts 안 정의).
--
docs/decisions/LOCATION_LEGAL_PLAN.md-360-- (LL-ACTION-04 · cycle1 LL-07 patch) 잠금 순서 = (1) clinic_profile → (2) location_profile main → (3) legal_document 5종 (alpha sort: complaint → non-covered → privacy → refund → terms). 결정적 순서로 deadlock 회피.
docs/decisions/LOCATION_LEGAL_PLAN.md-361-- (LL-ACTION-05) ClinicProfile UPSERT 의 `(xmax = 0)` 판별을 모든 entity 에 적용 — 각 audit row 별 `mode: "insert"|"update"`.
docs/decisions/LOCATION_LEGAL_PLAN.md-362-- (LL-ACTION-06 · cycle1 LL-16 + cycle3 LL-46 patch) **자동 재렌더링 분기 제거** — v0.4 는 LegalDocument 본문 수동 편집 차단 (LL-DEFER-06) 이므로 모든 row 가 templateVersion=current. 매 저장 시 모든 LegalDocument body 재렌더링. **운영자 알림 marker (LL-FORM-15 · 폼 (d) 상단 안내문)**: "본원 정보(기관명·법인명·사업자번호·설립자·본원 주소·전화·이메일) 또는 정책 변수(담당자·이메일·전화·시행일)를 수정하면 5종 정책 문서 본문이 자동으로 다시 생성됩니다. 본문 직접 수정은 추후 단계에서 합류합니다." 향후 수동 override 도입 시 별도 `body_source` enum (`auto`/`manual`) 컬럼 cascade.
docs/decisions/LOCATION_LEGAL_PLAN.md-363-- (LL-ACTION-07 · cycle1 LL-21 patch) `effective_date` default — DB `CURRENT_DATE AT TIME ZONE 'Asia/Seoul'` (Postgres) 사용. server `new Date()` 사용 금지. form 입력 시 ISO 형식 그대로.
docs/decisions/LOCATION_LEGAL_PLAN.md-364-- (LL-ACTION-08 · cycle1 LL-02 + cycle3 LL-45 patch — LL-SCHEMA-12·LL-SCHEMA-18 통일) LocationProfile 자동 상속 = **build-time reference (deep clone)**. server action 안 DB 저장은 `metadata.reservationChannelsInheritedFrom = "clinic_profile.primary_ctas"` marker 만 (의도 명시용). 실제 출력 시점은 apps/worker · M0 v1.0 build/export 의 책임 (LL-CASCADE-04 marker 신설).
docs/decisions/LOCATION_LEGAL_PLAN.md:365:- (LL-ACTION-09 · cycle1 LL-05 + cycle2 LL-30 patch) businessHours 변환 — form 의 7요일 단순 입력 → server action 안에서 `convertToOpeningHoursSpec()` 으로 CT-02 SoT 형식 (openingHours[] grouped by 동일 open/close) 변환 후 metadata 저장. `lunchBreaks[]` 도 동일 grouping. `receptionHours[]`/`specialClosures[]` 는 v0.3 빈 배열 + round-trip 시 빈 배열 보존 (form 재로딩 시 미표시 — 입력 필드 자체 없음).
docs/decisions/LOCATION_LEGAL_PLAN.md-366-- (LL-ACTION-21 · cycle2 LL-29 + cycle3 LL-44 patch) **assertHasMainLocationAfterTx 안전망**: tx 안 마지막 단계에서 `SELECT 1 FROM location_profile WHERE instance_id=? AND clinic_profile_id=? AND slug='main'` — 0행이면 **`MainLocationMissingError` (apps/web/src/lib/errors.ts 신설 named Error class) throw** → tx rollback. server action outer catch 에서 `MainLocationMissingError` 별도 분기: `return { ok: false, fieldErrors: {}, formError: "본원 정보 저장에 실패했습니다. 페이지를 새로고침하고 다시 시도하세요." }`. mapDbErrorToResult 와는 별개 (DB error 가 아닌 application-level invariant). 정상 흐름에서는 LocationProfile main upsert 가 항상 수행되므로 trip 안 됨. DB trigger 합류 (LL-DEFER-15) 까지 임시 보호.
docs/decisions/LOCATION_LEGAL_PLAN.md-367-
docs/decisions/LOCATION_LEGAL_PLAN.md-368-### 4.2 변수 치환 엔진 (LL-ACTION-10 · cycle1 LL-06 patch)
docs/decisions/LOCATION_LEGAL_PLAN.md-369-
docs/decisions/LOCATION_LEGAL_PLAN.md-370-```typescript
--
docs/decisions/LOCATION_LEGAL_PLAN.md-441-  - `legal_document_risk_level_skeleton_limit` → formError ("정책 문서 위험도는 현재 단계에서 Low 만 허용됩니다. 위험도 수동 분류는 위험도 분류 UI(M0 v1.0) 합류 후 가능합니다.")
docs/decisions/LOCATION_LEGAL_PLAN.md-442-  - `clinic_profile_policy_email_regex` → fieldErrors.policyContactEmail
docs/decisions/LOCATION_LEGAL_PLAN.md-443-  - `clinic_profile_policy_phone_format` → fieldErrors.policyContactPhone
docs/decisions/LOCATION_LEGAL_PLAN.md-444-  - `clinic_profile_primary_ctas_array` · `clinic_profile_primary_ctas_shape` (trigger RAISE 의 USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' · SQLSTATE 23514 — cycle4 LL-48 patch) → fieldErrors.primaryCtas
docs/decisions/LOCATION_LEGAL_PLAN.md-445-  - `location_profile_clinic_fk` (composite FK 위반) → formError ("본원과 위치 정보가 일치하지 않습니다. 페이지를 새로고침하고 다시 시도하세요.")
docs/decisions/LOCATION_LEGAL_PLAN.md:446:  - businessHours 는 application-level 검증 (DB CHECK 없음)
docs/decisions/LOCATION_LEGAL_PLAN.md-447-
docs/decisions/LOCATION_LEGAL_PLAN.md-448-## 5. Core 표준 템플릿 5종
docs/decisions/LOCATION_LEGAL_PLAN.md-449-
docs/decisions/LOCATION_LEGAL_PLAN.md-450-### 5.1 위치 (LL-TEMPLATE-01)
docs/decisions/LOCATION_LEGAL_PLAN.md-451-
--
docs/decisions/LOCATION_LEGAL_PLAN.md-513-|---|---|---|
docs/decisions/LOCATION_LEGAL_PLAN.md-514-| 14 | Tenant A 가 본원 위치·정책 입력 후 저장 | `location_profile(slug=main, clinic_profile_id=…)` 1행 + `legal_document` 5행 모두 instance_id=A 로 보임 |
docs/decisions/LOCATION_LEGAL_PLAN.md-515-| 15 | Tenant B 세션이 `/A/clinic-profile` 접근 | 403 (membership 부재) |
docs/decisions/LOCATION_LEGAL_PLAN.md-516-| 16 | LegalDocument 행을 `app_tenant_user` 가 `status='published'` 로 UPDATE 시도 | CHECK 위반 → formError ("정책 문서는 현재 단계에서 발행 상태로 변경할 수 없습니다") — cycle1 LL-19 patch |
docs/decisions/LOCATION_LEGAL_PLAN.md-517-| 17 | LegalDocument 같은 documentType (closed 5종) 두 번 INSERT | partial UNIQUE 위반 (LL-SCHEMA-02) |
docs/decisions/LOCATION_LEGAL_PLAN.md:518:| 18 | businessHours JSON 의 monday.open > monday.close | server action zod 위반 (LL-FORM-10) |
docs/decisions/LOCATION_LEGAL_PLAN.md-519-| 19 | 변수 화이트리스트 외 키 (`{{evil.x}}`) 가 포함된 템플릿 build-time test | packages/core-content test 실패 (LL-ACTION-12) |
docs/decisions/LOCATION_LEGAL_PLAN.md-520-| 20 | location_profile main row 의 clinic_profile_id 가 다른 tenant 의 clinic.id 로 변조 | composite FK + RLS WITH CHECK 위반 (LL-SCHEMA-14) |
docs/decisions/LOCATION_LEGAL_PLAN.md-521-| 21 | LegalDocument risk_level='High' UPDATE 시도 | CHECK 위반 (LL-SCHEMA-06) → formError |
docs/decisions/LOCATION_LEGAL_PLAN.md:522:| 22 | businessHours 7요일 → SoT CT-02 형식 변환 round-trip | application-level test (LL-ACTION-09 의 convertToOpeningHoursSpec 정합) |
docs/decisions/LOCATION_LEGAL_PLAN.md-523-
docs/decisions/LOCATION_LEGAL_PLAN.md-524-## 8. 작업 단위
docs/decisions/LOCATION_LEGAL_PLAN.md-525-
docs/decisions/LOCATION_LEGAL_PLAN.md-526-| # | 작업 | 산출물 |
docs/decisions/LOCATION_LEGAL_PLAN.md-527-|---|---|---|
docs/decisions/LOCATION_LEGAL_PLAN.md-528-| 1 | C0006 legal_document migration | packages/core-content/migrations/C0006_legal_document.sql |
docs/decisions/LOCATION_LEGAL_PLAN.md-529-| 2 | C0007 clinic_profile policy + primaryCtas migration | packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql |
docs/decisions/LOCATION_LEGAL_PLAN.md-530-| 3 | C0008 location_profile clinic_profile_id migration | packages/core-content/migrations/C0008_location_profile_parent_clinic.sql |
docs/decisions/LOCATION_LEGAL_PLAN.md-531-| 4 | Core 표준 템플릿 5종 + render 엔진 + build-time unknown key test | packages/core-content/src/templates/* + tests |
docs/decisions/LOCATION_LEGAL_PLAN.md:532:| 5 | zod schema (businessHours · primaryCtas · policy vars · 5 LegalDocument override) | apps/web/src/lib/clinic-profile-schema.ts |
docs/decisions/LOCATION_LEGAL_PLAN.md-533-| 6 | ClinicProfileForm 3 섹션 + 5 LegalDocument record 재구성 (a11y marker 적용) | apps/web/src/components/forms/ClinicProfileForm.tsx |
docs/decisions/LOCATION_LEGAL_PLAN.md-534-| 7 | server action 단일 tx 동시 upsert + 7 audit row emit | apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts |
docs/decisions/LOCATION_LEGAL_PLAN.md-535-| 8 | mapDbErrorToResult 신규 constraint 매핑 | apps/web/src/lib/errors.ts |
docs/decisions/LOCATION_LEGAL_PLAN.md-536-| 9 | content-saved audit matrix row 추가 (LocationProfile · LegalDocument) | ADMIN_UI_SKELETON_PLAN § 5.5 cascade marker (LL-CASCADE-02) |
docs/decisions/LOCATION_LEGAL_PLAN.md-537-| 10 | admin/ARCHITECTURE.md § 3.8.2 변수 화이트리스트 reference 추가 | LL-CASCADE-01 |
--
docs/decisions/LOCATION_LEGAL_PLAN.md-594-## 변경 이력
docs/decisions/LOCATION_LEGAL_PLAN.md-595-
docs/decisions/LOCATION_LEGAL_PLAN.md-596-| 일자 | 버전 | 변경 |
docs/decisions/LOCATION_LEGAL_PLAN.md-597-|---|---|---|
docs/decisions/LOCATION_LEGAL_PLAN.md-598-| 2026-05-16 | v0.1 | 초안 작성. Codex 자동 비평 사이클 진입 전 base. |
docs/decisions/LOCATION_LEGAL_PLAN.md:599:| 2026-05-16 | v0.2 | **Codex 비평 cycle1 25 findings (7 blocking + 12 major + 6 minor) 전건 수용 patch**: (LL-01) location_profile 에 clinic_profile_id composite FK + main row CHECK, ClinicProfile.locations[] Git 출력 빌드 시점 동적 구성. (LL-02) ClinicProfile.primary_ctas 컬럼 + LocationProfile.reservationChannels = primary_ctas 자동 상속 marker. (LL-03·04) status='draft' 만 허용 (review-queued 도 차단) — ComplianceRecord pre-publish + NotificationEvent 합류 시점까지 defer. (LL-05) businessHours SoT CT-02 형식 (openingHours[]·receptionHours[]·lunchBreaks[]·specialClosures[]) 변환 + server action 안 convertToOpeningHoursSpec 명시. (LL-06) policy.* 변수 정당화 + LL-CASCADE-01 cascade marker. (LL-07) 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha. (LL-08·09) partial UNIQUE — closed 5종만. cookie/other LL-DEFER-12. (LL-10) C-21 출력 매핑표 명시. (LL-11) representativeDoctors v0.2 빈 배열. (LL-12) risk_level NOT NULL + CHECK 'Low' 만. (LL-13) SoT 경로 정정 (docs/core/CONTENT_STANDARDS.md) + LL-CASCADE-03. (LL-14) policyContactPhone form 단계 required. (LL-15) effective_date individual override 합류 (LL-DEFER-08 closed). (LL-16) 자동 재렌더링 분기 제거 (모든 row 매 저장 시 재렌더링). (LL-17) audit 7 row 별도 emit (Bundle outer 폐기). (LL-18) RBAC 분리 marker LL-DEFER-09 명시. (LL-19) published CHECK 위반 시 운영자 메시지 + errors.ts 매핑. (LL-20) phone regex 한국 + 국제 표기 명시. (LL-21) effective_date timezone Asia/Seoul. (LL-22) template_version naming autoGenerated=true 일 때만 필수. (LL-23) businessHours a11y marker. (LL-24) detection 시점 server action runtime + build-time test cascade. (LL-25) LL-DEFER-08~10 본문 §1 비범위 표 반영. |
docs/decisions/LOCATION_LEGAL_PLAN.md-600-| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
docs/decisions/LOCATION_LEGAL_PLAN.md-601-| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
docs/decisions/LOCATION_LEGAL_PLAN.md-602-| 2026-05-16 | v0.5 | **Codex 비평 cycle4 8 findings (2 blocking + 4 major + 2 minor) 전건 수용 patch**: (LL-48) trigger RAISE EXCEPTION USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' 추가 — errors.ts mapDbErrorToResult 가 SQLSTATE 23514 + constraint name 으로 분기 가능. (LL-49) LL-CASCADE-04 target 정정 — ADMIN_UI_SKELETON_PLAN § 6 은 actions 영역으로 build/export 부재. 신규 `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 신설 + LL-CASCADE-04 책임 row 1건 cascade. acceptance 강도 = placeholder 작성. (LL-50) CT-03 enum SoT 정렬 — DB trigger 허용 11종 (phone/email/sms/kakao-talk/kakao-channel/naver-reservation/naver-talk/form/map/external/video-consultation) + UI subset 3종 분리. LL-DEFER-19 8종 UI 합류. (LL-51) form (b) UI copy 정정 — kakao → kakao-talk · naver-booking → naver-reservation 토큰. (LL-52) LL-DEFER-04/05 phase 충돌 정정 — §9.3 → M0 v1.0 본 구현 (LocationProfile 편집 화면) 으로 통일. M2 Phase Beta 표기 제거 (현재 비어 있음 — 외부 사용자 RBAC 가 M2). (LL-53) LL-CASCADE-05 강도 명시 — plan v1.0 acceptance = manifest spec 작성만 차단, 실 runner 코드는 LL-DEFER-20 (M0 v1.0). (LL-54) trigger function IMMUTABLE 마킹 제거 — VOLATILE 기본 (NEW 읽기 + row-specific RAISE 정합). (LL-55) Sentry pre-integration fallback 명시 — v0.5 단계 console/server stdout only, M0 v1.0 LL-DEFER-18 합류 후 Sentry capture. **누계 55 findings 전건 수용**. |
docs/decisions/LOCATION_LEGAL_PLAN.md-603-| 2026-05-16 | v0.6 | **Codex 비평 cycle5 3 findings (1 blocking + 0 major + 2 minor) 전건 수용 patch**: (LL-56) `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 실 파일 작성 완료 (v0.1 — §1.2 LL-CASCADE-04 책임 표 포함). (LL-57) LL-DEFER-19 phase 단일화 — §9.1 M0 v1.0 그룹 → §9.2 M1 Phase Alpha 그룹 으로 이동 ("M0 v1.0 또는 M1" 모호 표현 정정). M0 v0.5 의 3종 subset 으로 1호 클라이언트 출시 가능 명시. (LL-58) Sentry SDK 초기화 위치 = `apps/web/src/lib/observability.ts` (init + captureException + addBreadcrumb helper) 한 줄 명시 — LL-DEFER-18 내. **누계 58 findings 전건 수용**. |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 1784ms:
592:- `LL-CASCADE-05` (cycle3 LL-42 + cycle4 LL-53 patch): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장. **acceptance 강도 명시** — plan v1.0 acceptance 는 **manifest spec 작성까지만 차단** (manifest 파일 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` 의 spec 작성 + 본 plan 의 8단계 의존성 표 cascade). 실 runner 코드 구현은 M0 v1.0 cascade (LL-DEFER-20 신설). 즉 plan v1.0 acceptance ≠ runner 코드 acceptance.
601:| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
602:| 2026-05-16 | v0.5 | **Codex 비평 cycle4 8 findings (2 blocking + 4 major + 2 minor) 전건 수용 patch**: (LL-48) trigger RAISE EXCEPTION USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' 추가 — errors.ts mapDbErrorToResult 가 SQLSTATE 23514 + constraint name 으로 분기 가능. (LL-49) LL-CASCADE-04 target 정정 — ADMIN_UI_SKELETON_PLAN § 6 은 actions 영역으로 build/export 부재. 신규 `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 신설 + LL-CASCADE-04 책임 row 1건 cascade. acceptance 강도 = placeholder 작성. (LL-50) CT-03 enum SoT 정렬 — DB trigger 허용 11종 (phone/email/sms/kakao-talk/kakao-channel/naver-reservation/naver-talk/form/map/external/video-consultation) + UI subset 3종 분리. LL-DEFER-19 8종 UI 합류. (LL-51) form (b) UI copy 정정 — kakao → kakao-talk · naver-booking → naver-reservation 토큰. (LL-52) LL-DEFER-04/05 phase 충돌 정정 — §9.3 → M0 v1.0 본 구현 (LocationProfile 편집 화면) 으로 통일. M2 Phase Beta 표기 제거 (현재 비어 있음 — 외부 사용자 RBAC 가 M2). (LL-53) LL-CASCADE-05 강도 명시 — plan v1.0 acceptance = manifest spec 작성만 차단, 실 runner 코드는 LL-DEFER-20 (M0 v1.0). (LL-54) trigger function IMMUTABLE 마킹 제거 — VOLATILE 기본 (NEW 읽기 + row-specific RAISE 정합). (LL-55) Sentry pre-integration fallback 명시 — v0.5 단계 console/server stdout only, M0 v1.0 LL-DEFER-18 합류 후 Sentry capture. **누계 55 findings 전건 수용**. |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 1836ms:
9:> **scope limit (LL-INTRO-01)** — cycle1 LL-03·LL-04 patch: 본 plan 은 LegalDocument **draft 저장만** 다룬다. `review-queued` 도 차단 — 그 전이는 ComplianceRecord pre-publish row + NotificationEvent envelope (REVIEW_WORKFLOW § 5.2 / § 3.1) 발송이 함께 작동해야 한다. 이 둘은 모두 compliance-assistant Feature + ComplianceRecord UI cascade 까지 defer. 본 plan 의 LegalDocument 는 `status='draft'` 강제 (CHECK). 발행 게이트 자체는 LL-DEFER-01.
48:| 5종 LegalDocument 별 effective_date input | cycle1 LL-15 patch — LL-DEFER-08 reversal. 5 record 별 individual input · default = policy_effective_date |
55:| LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제) · `review-queued` 전이 + ComplianceRecord pre-publish + NotificationEvent | compliance-assistant Feature + ComplianceRecord UI cascade | LL-INTRO-01 / LL-DEFER-01 |
56:| LegalDocument `status=published` 발행 자체 | apps/worker + Git commit cascade | LL-DEFER-01 |
57:| ClinicProfile 화면의 미리보기 (3계약 합쳐 본 미리보기 페이지) | M0 v1.0 미리보기 화면 | LL-DEFER-01 |
59:| 정책 개정 이력 (`revisions[]`) UI | M1 Phase Alpha | LL-DEFER-02 |
60:| LegalDocument 수동 작성 모드 (autoGenerated=false) | M1 Phase Alpha — Markdown 에디터 합류 시점 | LL-DEFER-03 |
61:| reservationChannels 풀세트 (LocationProfile 별도 입력 폼) | M0 v1.0 본 구현 — LocationProfile 편집 화면 합류 시점 (cycle1 LL-02 patch — v0.1/v0.2 는 primaryCtas 상속만) | LL-DEFER-04 |
62:| `representativeDoctors` · `doctorsAtLocation` · `availableTreatments` ref 입력 | M0 v1.0 다지점 입력 화면 또는 LocationProfile 편집 화면 | LL-DEFER-05 |
63:| LegalDocument body 직접 수동 override | M1 Phase Alpha | LL-DEFER-06 |
64:| `latitude`/`longitude` 지도 pinpoint UI | M1 Phase Alpha | LL-DEFER-07 |
66:| `ClinicProfileBundle` audit contentType 권한 분리 | cycle1 LL-17 patch — audit shape 자체를 7 row 별도 emit 으로 변경 → `Bundle` outer 자체 제거. RBAC cascade 는 LL-DEFER-09 | LL-DEFER-09 |
67:| 템플릿 major 버전 변경 시 운영자 수동 확인 | M1 Phase Alpha | LL-DEFER-10 |
68:| LegalDocument body 검증 (CONTENT_STANDARDS § 7 ContentType 예외 marker 명시 + 면제 범위 cascade) | cycle1 LL-13 patch — CONTENT_STANDARDS § 7 의 LegalDocument 면제 marker 가 plan SoT cascade. 본 plan 에서 추가 검증 룰 미정의 | LL-DEFER-11 |
69:| `cookie` / `other` documentType 자동 생성 | cycle1 LL-08·LL-09 patch — partial UNIQUE 로 5종만 SoT 자동 생성. cookie/other 는 운영자 manual 입력 (단, v0.2 도 UI 미제공 — M1 Phase Alpha) | LL-DEFER-12 |
70:| custom (`documentType=other`) template_version namespace 규약 | cycle1 LL-22 patch — `other` 는 templateVersion null (autoGenerated=false). custom semver 는 M1 cascade | LL-DEFER-13 |
121:  -- cycle1 LL-08 patch: partial UNIQUE — closed 5종만 instance 당 1개 강제. cookie/other 는 미강제 (LL-DEFER-12)
143:- (LL-SCHEMA-02 · cycle1 LL-08·LL-09 patch) **partial UNIQUE** — closed 5종 (`privacy`/`terms`/`non-covered`/`refund`/`complaint`) per instance UNIQUE. `cookie`/`other` 는 instance 당 N개 허용 (skeleton v0.2 UI 미제공 — LL-DEFER-12).
144:- (LL-SCHEMA-03 · cycle1 LL-03 patch) `status` CHECK `= 'draft'` — skeleton 단계 단일 상태만. `review-queued` 전이는 ComplianceRecord pre-publish row + NotificationEvent 발송과 함께만 작동 (compliance-assistant cascade — LL-DEFER-01).
145:- (LL-SCHEMA-04) `published_at` CHECK NULL — 발행 자체가 LL-DEFER-01.
148:- (LL-SCHEMA-07) `revisions[]` 은 v0.2 column 미추가 (LL-DEFER-02). `metadata JSONB` 확장 여지만 남김.
230:- (LL-SCHEMA-11 · cycle1 LL-15 patch) `policy_effective_date` 는 form 안 5 LegalDocument record 의 default 만. 운영자가 각 record 별 override 가능 (LL-DEFER-08 closed).
234:  - UI subset 외 type (sms/form/map/external 등) 은 M0 v1.0 또는 M1 cascade (LL-DEFER-19).
253:-- 기존 row 가 있을 경우 backfill 후 NOT NULL — skeleton 단계 row 없음 가정. data migration 부담 marker LL-DEFER-14.
261:-- DB constraint 자체는 후속 trigger cascade (LL-DEFER-15).
267:- (LL-SCHEMA-15 · cycle2 LL-29 patch) ClinicProfile.locations[] (DATA_MODEL C-01 required ≥1) 는 **DB 컬럼 추가 없음** — Git 출력 빌드 시점 `SELECT id FROM location_profile WHERE clinic_profile_id = ?` 으로 동적 구성. cardinality 보장은 server action 안 단일 tx atomic upsert + `assertHasMainLocationAfterTx` 안전망 (LL-ACTION-21). DB trigger cascade 는 LL-DEFER-15.
292:  // v0.2 미입력 — LL-DEFER-05
299:- (LL-SCHEMA-17 · cycle1 LL-05 + cycle2 LL-30 patch) form (b) 의 7요일 입력은 server action 안에서 SoT 형식으로 변환 후 저장 (LL-ACTION-09). 입력 UX 는 7요일 단순 행. **receptionHours · specialClosures 는 v0.3 form 입력 필드 없음 → 빈 배열로 저장** (CT-02 optional). round-trip (저장 후 form 재로딩) 시 빈 배열은 form (b) 의 미입력 상태로 표시. M1 cascade 에서 form (b) 에 receptionHours 단축 입력 + specialClosures (공휴일/임시 휴진) UI 추가 합류 (LL-DEFER-16).
300:- (LL-SCHEMA-18 · cycle1 LL-02 + cycle2 LL-27 patch) `reservationChannels` 는 별도 입력 없음 — LocationProfile 자동 생성 시 ClinicProfile.primary_ctas 그대로 상속. **C-21 Git 출력 시점 구성 규칙**: build 시 `LocationProfile.reservationChannels = clinic_profile.primary_ctas` 의 직접 reference (C-21 출력 필드 값 = ClinicProfile primary_ctas의 deep clone). `metadata.reservationChannelsInheritedFrom` marker 는 DB 안 의도 명시용 — Git 출력에서는 사용 안 함. M0 v1.0 다지점 합류 시 hybrid (지점 override + 본원 상속 default) cascade (LL-DEFER-04).
301:- (LL-SCHEMA-19 · cycle1 LL-11 patch) `representativeDoctors`/`doctorsAtLocation`/`availableTreatments` 는 v0.3 빈 배열 — admin/ARCH § 3.8.1 자동 생성 표의 "ClinicProfile 등록 대표/전체 의료진/전체 시술" 매핑은 LocationProfile 편집 화면 합류 시점 (LL-DEFER-05). 빈 배열 의미는 SoT (DATA_MODEL C-21 optional).
347:  // 별도 ActionType (operator-edit-legal) 분리는 LL-DEFER-09 (RBAC cascade).
362:- (LL-ACTION-06 · cycle1 LL-16 + cycle3 LL-46 patch) **자동 재렌더링 분기 제거** — v0.4 는 LegalDocument 본문 수동 편집 차단 (LL-DEFER-06) 이므로 모든 row 가 templateVersion=current. 매 저장 시 모든 LegalDocument body 재렌더링. **운영자 알림 marker (LL-FORM-15 · 폼 (d) 상단 안내문)**: "본원 정보(기관명·법인명·사업자번호·설립자·본원 주소·전화·이메일) 또는 정책 변수(담당자·이메일·전화·시행일)를 수정하면 5종 정책 문서 본문이 자동으로 다시 생성됩니다. 본문 직접 수정은 추후 단계에서 합류합니다." 향후 수동 override 도입 시 별도 `body_source` enum (`auto`/`manual`) 컬럼 cascade.
366:- (LL-ACTION-21 · cycle2 LL-29 + cycle3 LL-44 patch) **assertHasMainLocationAfterTx 안전망**: tx 안 마지막 단계에서 `SELECT 1 FROM location_profile WHERE instance_id=? AND clinic_profile_id=? AND slug='main'` — 0행이면 **`MainLocationMissingError` (apps/web/src/lib/errors.ts 신설 named Error class) throw** → tx rollback. server action outer catch 에서 `MainLocationMissingError` 별도 분기: `return { ok: false, fieldErrors: {}, formError: "본원 정보 저장에 실패했습니다. 페이지를 새로고침하고 다시 시도하세요." }`. mapDbErrorToResult 와는 별개 (DB error 가 아닌 application-level invariant). 정상 흐름에서는 LocationProfile main upsert 가 항상 수행되므로 trip 안 됨. DB trigger 합류 (LL-DEFER-15) 까지 임시 보호.
427:    - **v0.5 단계 (Sentry SDK 미통합 · LL-DEFER-18 합류 전)**: (1) per-row try/catch + console.error → server stdout (Vercel logs / Cloud Run logs). (2) partial/failed row INSERT 시도 → 실패해도 server stdout. (3) partial/failed row INSERT 자체 실패 시 server stdout만 (Sentry 미통합 상태 명시). 사용자 return state 는 `{ ok: true }` 유지 (save 성공이 우선 · audit 누락만 운영 팀 stdout 추적).
428:    - **M0 v1.0 (LL-DEFER-18 합류 후)**: (3) Sentry capture (INFRA INFR-PROV `Sentry` Provider 통합) + breadcrumb 으로 (1)/(2) 단계의 console.error 도 함께 캡처. 사용자 return state 동일.
482:- (LL-TEMPLATE-02) v0.2 는 5종 (`cookie`/`other` 제외) — M1 manual 입력 cascade (LL-DEFER-12).
489:- (LL-TEMPLATE-06) 템플릿 versioning — semver `major.minor.patch`. minor 이상 업그레이드 시 자동 재렌더링 (LL-ACTION-06 — v0.2 매 저장 시 무조건 재렌더링이므로 minor/major 분기 불필요). major 변경 시 운영자 수동 확인은 LL-DEFER-10.
545:- `LL-DEFER-01`: LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제 · review-queued 전이 + ComplianceRecord pre-publish + NotificationEvent envelope · status=published). compliance-assistant Feature + ComplianceRecord UI cascade.
546:- `LL-DEFER-09`: LegalDocument 편집 권한 분리 (operator-edit-legal ActionType — REVIEW_WORKFLOW 14 ActionType cascade).
547:- `LL-DEFER-11`: LegalDocument body 검증 — CONTENT_STANDARDS § 7 ContentType 예외 marker cascade (LL-CASCADE-03). 추가 검증 룰은 compliance-assistant Feature.
548:- `LL-DEFER-15` (cycle2 LL-29 patch): location_profile 의 main slug 1 row 강제 DB trigger 또는 partial unique with `clinic_profile_id` 기반 cascade — v0.4 은 server action assertHasMainLocationAfterTx 안전망. M0 v1.0 본 구현에서 DB-level invariant 합류.
549:- `LL-DEFER-18` (cycle3 LL-43 + cycle5 LL-58 patch): Sentry SDK 통합 (INFRA INFR-PROV `Sentry` Provider). audit partial/failed row INSERT 실패 시 capture 채널. **SDK 초기화 위치 및 wrapping 책임 = `apps/web/src/lib/observability.ts` (Sentry init + `captureException` / `addBreadcrumb` helper)** — server action / route handler 가 console.error 대신 observability helper 호출. M0 v1.0 본 구현 (provider 통합 시점).
550:- `LL-DEFER-20` (cycle4 LL-53 patch): packages/migrations-runner 실 runner 코드 — manifest spec 작성 (plan v1.0 acceptance precondition) 후 sequential apply + fail-fast 구현. M0 v1.0 본 구현.
554:- `LL-DEFER-02`: 정책 개정 이력 (`revisions[]`) UI.
555:- `LL-DEFER-03`: LegalDocument 수동 작성 모드 (autoGenerated=false · Markdown 에디터).
556:- `LL-DEFER-06`: LegalDocument body 수동 override · `body_source` enum cascade.
557:- `LL-DEFER-07`: latitude/longitude 지도 pinpoint.
558:- `LL-DEFER-10`: 템플릿 major 버전 변경 시 운영자 수동 확인.
559:- `LL-DEFER-12`: `cookie`/`other` documentType UI (manual 입력 + custom template).
560:- `LL-DEFER-13`: custom (`documentType=other`) template_version namespace 규약.
561:- `LL-DEFER-16` (cycle2 LL-30 patch): form (b) 에 receptionHours + specialClosures (공휴일/임시 휴진) UI 추가.
562:- `LL-DEFER-19` (cycle4 LL-50 + cycle5 LL-57 patch — phase 단일화): primaryCtas UI subset 확장 — CT-03 11종 중 phone/kakao-talk/naver-reservation 외 8종 (`email`/`sms`/`kakao-channel`/`naver-talk`/`form`/`map`/`external`/`video-consultation`) 의 UI 입력. M0 v0.5 의 3종 subset 으로 1호 클라이언트 출시 가능 — 추가 8종은 M1.
566:> **§1.3 비범위 vs §9.3 phase 정합 정정 (cycle4 LL-52)**: LL-DEFER-04/05 의 합류 시점은 LocationProfile 편집 화면 (M0 v1.0 본 구현). M2 Phase Beta 합류로 표시했던 v0.4 까지의 표기는 §1.3 비범위 표 ("LocationProfile 편집 화면 합류 시점") 와 충돌. v0.5 에서 통일.
568:- `LL-DEFER-04`: reservationChannels 풀세트 (LocationProfile 편집 화면 + 지점별 override). **M0 v1.0 본 구현 합류**.
569:- `LL-DEFER-05`: representativeDoctors · doctorsAtLocation · availableTreatments ref 입력 UI (다지점 합류 시점). **M0 v1.0 본 구현 합류** (단지점도 LocationProfile 편집 화면에서 입력).
577:- `LL-DEFER-14` (cycle2 LL-28 patch): location_profile.clinic_profile_id NOT NULL data migration — 기존 row 존재 시 backfill 정책. v0.4 skeleton 가정은 row 없음.
578:- `LL-DEFER-17` (cycle2 LL-36 patch): cookie/other 가 closed type 으로 승격 시 partial unique index DROP + 새 7종 partial unique CREATE — migration cascade marker.
582:- ~~`LL-DEFER-08`~~: cycle1 LL-15 patch — 5종 LegalDocument 별 effectiveDate override 합류 완료 (v0.2 acceptance).
592:- `LL-CASCADE-05` (cycle3 LL-42 + cycle4 LL-53 patch): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장. **acceptance 강도 명시** — plan v1.0 acceptance 는 **manifest spec 작성까지만 차단** (manifest 파일 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` 의 spec 작성 + 본 plan 의 8단계 의존성 표 cascade). 실 runner 코드 구현은 M0 v1.0 cascade (LL-DEFER-20 신설). 즉 plan v1.0 acceptance ≠ runner 코드 acceptance.
599:| 2026-05-16 | v0.2 | **Codex 비평 cycle1 25 findings (7 blocking + 12 major + 6 minor) 전건 수용 patch**: (LL-01) location_profile 에 clinic_profile_id composite FK + main row CHECK, ClinicProfile.locations[] Git 출력 빌드 시점 동적 구성. (LL-02) ClinicProfile.primary_ctas 컬럼 + LocationProfile.reservationChannels = primary_ctas 자동 상속 marker. (LL-03·04) status='draft' 만 허용 (review-queued 도 차단) — ComplianceRecord pre-publish + NotificationEvent 합류 시점까지 defer. (LL-05) businessHours SoT CT-02 형식 (openingHours[]·receptionHours[]·lunchBreaks[]·specialClosures[]) 변환 + server action 안 convertToOpeningHoursSpec 명시. (LL-06) policy.* 변수 정당화 + LL-CASCADE-01 cascade marker. (LL-07) 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha. (LL-08·09) partial UNIQUE — closed 5종만. cookie/other LL-DEFER-12. (LL-10) C-21 출력 매핑표 명시. (LL-11) representativeDoctors v0.2 빈 배열. (LL-12) risk_level NOT NULL + CHECK 'Low' 만. (LL-13) SoT 경로 정정 (docs/core/CONTENT_STANDARDS.md) + LL-CASCADE-03. (LL-14) policyContactPhone form 단계 required. (LL-15) effective_date individual override 합류 (LL-DEFER-08 closed). (LL-16) 자동 재렌더링 분기 제거 (모든 row 매 저장 시 재렌더링). (LL-17) audit 7 row 별도 emit (Bundle outer 폐기). (LL-18) RBAC 분리 marker LL-DEFER-09 명시. (LL-19) published CHECK 위반 시 운영자 메시지 + errors.ts 매핑. (LL-20) phone regex 한국 + 국제 표기 명시. (LL-21) effective_date timezone Asia/Seoul. (LL-22) template_version naming autoGenerated=true 일 때만 필수. (LL-23) businessHours a11y marker. (LL-24) detection 시점 server action runtime + build-time test cascade. (LL-25) LL-DEFER-08~10 본문 §1 비범위 표 반영. |
600:| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
601:| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
602:| 2026-05-16 | v0.5 | **Codex 비평 cycle4 8 findings (2 blocking + 4 major + 2 minor) 전건 수용 patch**: (LL-48) trigger RAISE EXCEPTION USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' 추가 — errors.ts mapDbErrorToResult 가 SQLSTATE 23514 + constraint name 으로 분기 가능. (LL-49) LL-CASCADE-04 target 정정 — ADMIN_UI_SKELETON_PLAN § 6 은 actions 영역으로 build/export 부재. 신규 `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 신설 + LL-CASCADE-04 책임 row 1건 cascade. acceptance 강도 = placeholder 작성. (LL-50) CT-03 enum SoT 정렬 — DB trigger 허용 11종 (phone/email/sms/kakao-talk/kakao-channel/naver-reservation/naver-talk/form/map/external/video-consultation) + UI subset 3종 분리. LL-DEFER-19 8종 UI 합류. (LL-51) form (b) UI copy 정정 — kakao → kakao-talk · naver-booking → naver-reservation 토큰. (LL-52) LL-DEFER-04/05 phase 충돌 정정 — §9.3 → M0 v1.0 본 구현 (LocationProfile 편집 화면) 으로 통일. M2 Phase Beta 표기 제거 (현재 비어 있음 — 외부 사용자 RBAC 가 M2). (LL-53) LL-CASCADE-05 강도 명시 — plan v1.0 acceptance = manifest spec 작성만 차단, 실 runner 코드는 LL-DEFER-20 (M0 v1.0). (LL-54) trigger function IMMUTABLE 마킹 제거 — VOLATILE 기본 (NEW 읽기 + row-specific RAISE 정합). (LL-55) Sentry pre-integration fallback 명시 — v0.5 단계 console/server stdout only, M0 v1.0 LL-DEFER-18 합류 후 Sentry capture. **누계 55 findings 전건 수용**. |
603:| 2026-05-16 | v0.6 | **Codex 비평 cycle5 3 findings (1 blocking + 0 major + 2 minor) 전건 수용 patch**: (LL-56) `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 실 파일 작성 완료 (v0.1 — §1.2 LL-CASCADE-04 책임 표 포함). (LL-57) LL-DEFER-19 phase 단일화 — §9.1 M0 v1.0 그룹 → §9.2 M1 Phase Alpha 그룹 으로 이동 ("M0 v1.0 또는 M1" 모호 표현 정정). M0 v0.5 의 3종 subset 으로 1호 클라이언트 출시 가능 명시. (LL-58) Sentry SDK 초기화 위치 = `apps/web/src/lib/observability.ts` (init + captureException + addBreadcrumb helper) 한 줄 명시 — LL-DEFER-18 내. **누계 58 findings 전건 수용**. |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

codex
{
  "cycle": 6,
  "closeableAfterPatch": true,
  "blockingFindings": [],
  "newMajorFindings": [],
  "newMinorFindings": [
    {
      "id": "LL-59",
      "finding": "LL-DEFER-19는 §9.2 M1 Phase Alpha로 이동됐지만, §2.2 설명에 여전히 “M0 v1.0 또는 M1 cascade” 표현이 남아 phase 단일화 설명과 불일치한다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:234",
      "impact": "실행 차단은 아니지만 cycle5 LL-57의 목적이었던 phase 단일화가 문서 전역 기준으로는 완전히 닫히지 않는다. 해당 줄을 “M1 cascade”로 정정하면 종료 가능하다."
    }
  ],
  "convergenceSignal": "25 → 12 → 10 → 8 → 3 → 1. blocking/major 0, 신규 minor 1건만 남아 수렴 상태이며 closeableAfterPatch=true 판단 가능.",
  "nextCycleFocus": "LL-59 한 줄 정정 후 final acceptance commit에서 LL-CASCADE-01~05 동시 반영 여부만 확인."
}

LL-56은 수용됐습니다. `docs/decisions/M0_BUILD_EXPORT_PLAN.md`는 실제 존재하고, §1.2 표에 `reservationChannels` deep clone, `@id: main`, `parentClinic`, `locations[]` SELECT, DB `id` → Git `@id` alias가 모두 들어 있습니다. `businessHours`도 `location_profile.metadata.businessHours`를 CT-02 SoT 형식 그대로 출력한다고 명시되어 placeholder로는 충분합니다.

LL-58도 수용됐습니다. `apps/web/src/lib/observability.ts` 초기화 및 helper 책임이 LL-DEFER-18에 명시되어 있습니다.

LL-57은 거의 수용됐지만, 위 LL-59 한 줄 잔재가 있습니다. §9.2의 LL-DEFER-19 본문은 “추가 8종은 M1”로 정리되어 있으므로 의미상 결론은 맞고, 남은 문제는 앞쪽 설명 문구의 정합성입니다.

acceptance 후 작업 흐름은 정합합니다. plan v1.0 acceptance commit은 `LOCATION_LEGAL_PLAN.md` v1.0과 LL-CASCADE-01~05를 같은 커밋에 포함해야 하며, 그 뒤 §8의 9개 코드 작업 및 cascade 마무리 작업으로 진입 가능합니다. 단, LL-CASCADE-05는 현재 계획상 “manifest spec 작성”이 acceptance 차단선이고 runner 구현은 LL-DEFER-20으로 M0 v1.0 본 구현에 남는 구조입니다.
tokens used
35,799
{
  "cycle": 6,
  "closeableAfterPatch": true,
  "blockingFindings": [],
  "newMajorFindings": [],
  "newMinorFindings": [
    {
      "id": "LL-59",
      "finding": "LL-DEFER-19는 §9.2 M1 Phase Alpha로 이동됐지만, §2.2 설명에 여전히 “M0 v1.0 또는 M1 cascade” 표현이 남아 phase 단일화 설명과 불일치한다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:234",
      "impact": "실행 차단은 아니지만 cycle5 LL-57의 목적이었던 phase 단일화가 문서 전역 기준으로는 완전히 닫히지 않는다. 해당 줄을 “M1 cascade”로 정정하면 종료 가능하다."
    }
  ],
  "convergenceSignal": "25 → 12 → 10 → 8 → 3 → 1. blocking/major 0, 신규 minor 1건만 남아 수렴 상태이며 closeableAfterPatch=true 판단 가능.",
  "nextCycleFocus": "LL-59 한 줄 정정 후 final acceptance commit에서 LL-CASCADE-01~05 동시 반영 여부만 확인."
}

LL-56은 수용됐습니다. `docs/decisions/M0_BUILD_EXPORT_PLAN.md`는 실제 존재하고, §1.2 표에 `reservationChannels` deep clone, `@id: main`, `parentClinic`, `locations[]` SELECT, DB `id` → Git `@id` alias가 모두 들어 있습니다. `businessHours`도 `location_profile.metadata.businessHours`를 CT-02 SoT 형식 그대로 출력한다고 명시되어 placeholder로는 충분합니다.

LL-58도 수용됐습니다. `apps/web/src/lib/observability.ts` 초기화 및 helper 책임이 LL-DEFER-18에 명시되어 있습니다.

LL-57은 거의 수용됐지만, 위 LL-59 한 줄 잔재가 있습니다. §9.2의 LL-DEFER-19 본문은 “추가 8종은 M1”로 정리되어 있으므로 의미상 결론은 맞고, 남은 문제는 앞쪽 설명 문구의 정합성입니다.

acceptance 후 작업 흐름은 정합합니다. plan v1.0 acceptance commit은 `LOCATION_LEGAL_PLAN.md` v1.0과 LL-CASCADE-01~05를 같은 커밋에 포함해야 하며, 그 뒤 §8의 9개 코드 작업 및 cascade 마무리 작업으로 진입 가능합니다. 단, LL-CASCADE-05는 현재 계획상 “manifest spec 작성”이 acceptance 차단선이고 runner 구현은 LL-DEFER-20으로 M0 v1.0 본 구현에 남는 구조입니다.
