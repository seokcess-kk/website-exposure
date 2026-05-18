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
session id: 019e2f7a-f641-75b2-b8f7-ad5c29323e8c
--------
user
# LOCATION_LEGAL_PLAN v0.5 — codex 자동 비평 cycle 5

당신은 신중한 senior reviewer. v0.4 cycle4 8 findings 가 v0.5 patch 에서 전건 수용되었는지 + 새로 생긴 cascade 결함 + 회귀 여부 + **closeableAfterPatch 도달 가능성** 을 평가하라.

## 검토 대상

- `docs/decisions/LOCATION_LEGAL_PLAN.md` v0.5 (cycle1 25 + cycle2 12 + cycle3 10 + cycle4 8 = **55 findings 누계 전건 수용**)

## SoT

- `docs/admin/ARCHITECTURE.md` v0.7 · `docs/core/DATA_MODEL.md` v0.9 · `docs/admin/REVIEW_WORKFLOW.md` v1.0
- `docs/core/CONTENT_STANDARDS.md` v1.3 · `docs/compliance/RISK_LEVELS.md` v1.1 · `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0
- `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0
- 기존 packages (직접 확인): `packages/core-content/migrations/C0001`/`C0002`/`C0004`/`C0005` · `packages/migrations-runner/src/index.ts` · `apps/web/src/lib/*.ts`

## cycle4 → v0.5 patch 요약

| ID | patch |
|---|---|
| LL-48 | trigger RAISE EXCEPTION USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' — errors.ts 매핑 가능 |
| LL-49 | LL-CASCADE-04 target 정정 — `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 신설 + 책임 row 1건 cascade |
| LL-50 | CT-03 enum SoT 정렬 — DB trigger 11종 + UI subset 3종 + LL-DEFER-19 8종 UI 합류 |
| LL-51 | form (b) UI copy 정정 — `kakao-talk`/`naver-reservation` 토큰 |
| LL-52 | LL-DEFER-04/05 phase 통일 — §9.3 M0 v1.0 본 구현 (LocationProfile 편집 화면) |
| LL-53 | LL-CASCADE-05 강도 명시 — manifest spec 작성만 plan acceptance 차단, 실 runner 는 LL-DEFER-20 |
| LL-54 | trigger function IMMUTABLE 마킹 제거 — VOLATILE 기본 |
| LL-55 | Sentry pre-integration fallback — v0.5 단계 console/server stdout only, M0 v1.0 합류 후 capture |

## 검토 관점

### 1. cycle4 patch 수용 정합

- LL-48~LL-55 각 patch 본문 반영 + 의도된 효과 충족.
- patch 가 cycle1~3 의 결정을 회귀시키지 않았는지.

### 2. closeableAfterPatch 도달 평가

- 본 plan v0.5 가 ready_for_acceptance=true 신호 (closeableAfterPatch: true) 의 4가지 마감 조건 충족 여부 (memory/feedback_codex_review_cycle.md 기준):
  1. 지적 수 감소·수렴 추세 (25→12→10→8→?) — cycle5 N <= 5 기대.
  2. cascade 가 다른 SoT 충돌 없음 (LL-CASCADE-01~05 모두 acceptance precondition 명시).
  3. 잔류 미결정이 모두 운영·인프라·M2+/M3+ 후속으로 분류 가능 (§9 LL-DEFER 20개 모두 phase 분류 완료).
  4. 보안·법적 critical 잔존 없음 (LegalDocument 발행 게이트 LL-DEFER-01 marker 만 — 검수 게이트 합류 시점 명시).

### 3. LL-48 trigger error mapping

- `USING ERRCODE = 'check_violation', CONSTRAINT = '<name>'` syntax — postgres `RAISE EXCEPTION ... USING CONSTRAINT = ...` 의 정확한 옵션 키 (`CONSTRAINT_NAME` 이 아니라 `CONSTRAINT`)?
- errors.ts 의 mapDbErrorToResult 가 `err.constraint_name` 또는 `err.constraint` 중 어느 필드 읽는지 — postgres library (postgres.js v3.x) 의 error object shape 확인 필요.

### 4. LL-49 M0_BUILD_EXPORT_PLAN placeholder

- placeholder 파일 작성 acceptance 강도 — plan v1.0 acceptance commit 안 신규 plan placeholder 1 row + LL-CASCADE-04 책임 명시. 그 placeholder 가 M0 v1.0 본 구현 시 실 plan 으로 진화 — 진화 시점에 본 plan LL-CASCADE-04 marker 가 close (또는 reference 유지)?
- placeholder plan 의 실제 content (목차 · build/export 함수 시그니처 · Git output 형식) 가 어디까지 명시? 본 plan v0.5 acceptance 시 placeholder 의 최소 content?

### 5. LL-50 DB trigger 11종 vs UI 3종

- DB trigger 가 SoT 11종 허용 + UI 가 3종 subset — server action 안 zod 검증은 UI 입력 직후 단계 → 3종만 통과. server action 안에서 raw SQL 로 11종 다른 type 을 INSERT 시도 (코드 경로 외) 시 trigger 가 통과. 이 정책의 의도 (관리자/migration 으로 추가 type 입력 허용) 명시?
- UI 3종 (phone/kakao-talk/naver-reservation) — DATA_MODEL CT-03 의 type enum 안 phone/kakao-talk/naver-reservation 만 minimal subset 으로 SoT 가 권장하는가? 한국 의료기관 운영 표준 정합 확인?

### 6. LL-52 LL-DEFER-04/05 phase 정합

- §9.3 가 "M0 v1.0 본 구현 합류 (LocationProfile 편집 화면 cascade)" 로 변경 — §1.3 비범위 표 ("LocationProfile 편집 화면 합류 시점") 와 정합?
- §9.3.1 가 비어 있음 ("외부 사용자 RBAC · 풀 권한 모델") — 본 plan 범위 외이지만 빈 섹션 의도 명시? 또는 삭제?

### 7. LL-53 LL-CASCADE-05 acceptance 강도

- "plan v1.0 acceptance = manifest spec 작성만 차단" — manifest 파일 위치/형식 명시 (`packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts`). 본 plan v0.5 가 그 manifest 의 schema 까지 정의? 아니면 LL-DEFER-20 안 명시?

### 8. LL-55 Sentry fallback

- v0.5 단계 console.error → server stdout — Vercel logs (production) / Cloud Run logs / 로컬 dev 의 console 모두 호환? 운영 팀이 로그 추적 가능한 채널 명시 (대시보드/CLI grep/외부 log aggregator)?
- M0 v1.0 (LL-DEFER-18) 합류 시점에 console.error → Sentry breadcrumb 으로 자동 wrap 되는 패턴 — Sentry SDK 초기화 위치 명시?

### 9. 새 minor / 잔존

- LL-DEFER 20 개 — LL-DEFER-19/20 추가로 phase 분류 추가 정합?
- LL-CASCADE 5 개 — acceptance precondition 모두 plan v1.0 acceptance commit 안 동시 patch (cycle2 LL-33 결정 유지)?
- v0.5 acceptance 후 작업 단위 (§8) 의 9개 작업 + LL-CASCADE 5개 작업 + M0_BUILD_EXPORT_PLAN placeholder 작성 = ~15 작업. 본 plan acceptance 와 코드 작업 시작 사이 step 명확?

## 평가 형식

응답은 반드시 다음 JSON 형식으로 시작:

```json
{
  "cycle": 5,
  "closeableAfterPatch": true | false,
  "blockingFindings": [...],
  "newMajorFindings": [...],
  "newMinorFindings": [...],
  "convergenceSignal": "...",
  "nextCycleFocus": "..."
}
```

각 finding 객체는 `{ "id": "LL-NN", "finding": "...", "evidence": "<file:line>", "impact": "..." }` 형식.

수렴 추세 25 → 12 → 10 → 8. cycle5 0~5 findings 예상. closeableAfterPatch=true 도달 후보. 단 blocking 1건 이상 잔존 시 false 유지.
codex
`seo-geo` skill은 이번 검토 범위와 맞지 않아 쓰지 않습니다. 먼저 관련 문서와 코드의 실제 라인을 확인해서, patch 요약이 문서에만 적힌 선언인지 코드/SoT와 맞는지 분리해 보겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg --files docs packages apps | rg \"M0_BUILD_EXPORT_PLAN|migrations-manifest|manifest|errors\\.ts|C0001|C0002|C0004|C0005\"" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "mapDbErrorToResult|constraint_name|constraint|postgres|Sql|PostgresError|RAISE EXCEPTION|clinic_profile_primary_ctas_shape|contact|cta|kakao|naver|phone" packages apps -g "*.ts" -g "*.sql"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "LL-48|LL-49|LL-50|LL-51|LL-52|LL-53|LL-54|LL-55|LL-DEFER|LL-CASCADE|clinic_profile_primary_ctas_shape|RAISE EXCEPTION|M0_BUILD_EXPORT|LocationProfile|Sentry|manifest|kakao-talk|naver-reservation|contact|cta" docs/decisions/LOCATION_LEGAL_PLAN.md docs/admin/ARCHITECTURE.md docs/core/DATA_MODEL.md docs/admin/REVIEW_WORKFLOW.md docs/core/CONTENT_STANDARDS.md docs/compliance/RISK_LEVELS.md docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md docs/decisions/ADMIN_UI_SKELETON_PLAN.md' in C:\Users\assag\solution\website-exposure
 succeeded in 2354ms:
docs/compliance/RISK_LEVELS.md:529:| `LocationProfile` (C-21) `branchDescription`·`transportInfo`·`parkingInfo` 필드 | `includes-event` | 지점 안내·교통·주차 정보에 "이벤트" 어휘가 행사·시설 의미로 등장 가능 |
docs/compliance/RISK_LEVELS.md:715:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) **CONTENT_STANDARDS § 7.1 cascade — `inferredRiskLevel` 입력 필드 신설**. explicitRiskLevel은 어드민 명시 override만, 자동 추론 결과는 별도 필드. § 7.1.2 트리거 조건도 `inferredRiskLevel === High` ∨ `explicitRiskLevel === High` 명시 + `triggeredBy` 메타로 출처 기록, (2) CONTENT_STANDARDS § 7.1.2 ArticleType override 목록을 High 전용으로 정리 — Medium ArticleType은 본 가상 finding 미발생 (RISK_LEVELS § 6 매트릭스로 처리). RISK_LEVELS § 6.2 표와 정합, (3) § 5.1.2 LocationProfile false-positive 완화 — 존재하지 않는 `relocationNotice`·`businessHoursNotice` 제거. DATA_MODEL C-21 실제 필드(`branchDescription`·`transportInfo`·`parkingInfo`)로 교체, (4) preset 파일명 규약 통일 — `rules.preset-<presetSlug>.yaml`. `<presetSlug>`은 `presets/<presetSlug>/` 디렉토리명과 동일 kebab-case. RL-01 해소 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:7:> **본 skeleton의 위상 명시**: 이 walking skeleton의 ClinicProfile 폼은 admin/ARCHITECTURE § 3.2 화면 ②의 **완성이 아닌 auth/RLS/form wiring proof**다. 화면 ② 완성은 ClinicProfile + LocationProfile(main) + LegalDocument 3계약 동시 출력을 요구하며 M0 v1.0 본 구현에서 합류한다 (ADMIN-UI-15).
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:53:> **M0 화면 ② 축소판 marker (ADMIN-UI-15)**: skeleton의 ClinicProfile 폼은 single contract(ClinicProfile DB row) 만 저장하며, admin/ARCHITECTURE § 3.2의 "ClinicProfile + LocationProfile(main) + LegalDocument 3계약 동시 출력" 은 M0 v1.0 본 구현에서 합류한다.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:59:| LocationProfile(main) 자동 생성 (admin/ARCH § 3.8.1) | M0 v1.0 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:359:**emitAuditEvent 호출 위치 정책 (ADMIN-UI-36)**: `audit_event` 는 `app_tenant_user` 에 GRANT INSERT 가 없으므로 (`apps/spike-e/migrations/004_audit_event.sql`), **tx 밖 base role connection 에서만 호출**. tx 안 emit 금지. `content-saved` 는 tx commit **후** `emitAuditEvent(sqlBase, ...)`. tx와 audit dual-write race 는 skeleton 허용 — audit 누락 시 best-effort log + Sentry alert (M0 v1.0 cascade marker로 transactional outbox 패턴 검토).
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:400:2. catch 블록에서 `console.error` + Sentry alert (M0 v1.0 Sentry 합류 시)
docs/admin/REVIEW_WORKFLOW.md:166:- 미처리 warning이 있는 채로도 발행 가능 (P2 — 발행 비차단) — 단, publishable 조건 § 7.1 (6)에 운영 정책별 강제 처리 옵션 (instance manifest 설정 — AW-09)
docs/admin/REVIEW_WORKFLOW.md:567:- **criticality**: `critical` 이벤트는 사용자 quietHours·opt-out·인스턴스 운영시간(LocationProfile.businessHours)을 우회. 단, **inactive 사용자·인스턴스 채널 비활성·idempotency·dedupe는 우회하지 않음** (`features/notifications.md` § 4.1·§ 8.3 필터 순서). `high`는 사용자 quietHours 보류, `normal`은 전체 정책 적용
docs/admin/REVIEW_WORKFLOW.md:570:- **multi-location 인스턴스의 locationRef**: NotificationEvent에 `metadata.locationRef`(LocationProfile @id) 권장. 호출자(REVIEW_WORKFLOW transition)가 콘텐츠 소속 location을 산정·전달. 미해결 시 LocationProfile `main=true` fallback (`features/notifications.md` § 8.4 client-approver businessHours 정책 입력)
docs/admin/REVIEW_WORKFLOW.md:604:  ctaUrl: string;                                      // 어드민 검수 화면 URL (notify()가 채움)
docs/admin/REVIEW_WORKFLOW.md:791:| AW-09 | warning 강제 처리 정책 — instance manifest 옵션 (§ 3.1.1) | 운영 정책 |
docs/admin/ARCHITECTURE.md:125:| ② | 사이트 기본 정보 | 의료기관 정체성 + 본원 위치·연락·시간 + 정책 변수 입력 (3 섹션) | `ClinicProfile` + `LocationProfile`(main) + `LegalDocument`(privacy·terms 등) | 3 계약 동시 출력 — § 3.8.1 / § 3.8.2 자동 생성 규칙 적용 |
docs/admin/ARCHITECTURE.md:137:| `ClinicProfile` (C-01) | 기관명·전문분야·간략 소개·로고·기관 메타 (브랜드·정체성만 — 위치·시간·연락은 LocationProfile이 SoT) | | ClinicProfile 화면 (기관 정체성 섹션) |
docs/admin/ARCHITECTURE.md:138:| `LocationProfile`(slug=`main`) (C-21) | 본원 주소·전화·이메일·진료시간(`BusinessHours`)·예약 채널(`CTAConfig[]`) | ✅ (ClinicProfile 폼의 "본원 위치·연락·시간" 섹션에서 자동) | ClinicProfile 화면 (본원 위치 섹션) — § 3.8.1 |
docs/admin/ARCHITECTURE.md:139:| `LegalDocument` (C-16) | `documentType`·`title`·`effectiveDate`·`contactPerson` (`body`는 Core 표준 템플릿 + 변수 자동 치환) | ✅ (Core 표준 템플릿 + ClinicProfile + LocationProfile 변수) | ClinicProfile 화면 (정책 변수 보조 섹션) — § 3.8.2 |
docs/admin/ARCHITECTURE.md:183:| 7 | **P-012 Contact (Conversion Hub)** | ClinicProfile + LocationProfile[] 참조. 다중 CTA 채널 노출 |
docs/admin/ARCHITECTURE.md:184:| 8 | **P-014 Location Detail (main 자동)** | LocationProfile(slug=`main`) 1개 자동 생성. 어드민 화면 추가 없음 (§ 3.8.1 규칙) |
docs/admin/ARCHITECTURE.md:190:### 3.8.1 LocationProfile(main) 자동 생성 규칙
docs/admin/ARCHITECTURE.md:193:> - **계약 필드 (Git 출력)**: `core/DATA_MODEL.md` C-01 ClinicProfile (브랜드·메타만) + C-21 LocationProfile (위치·시간·연락 마스터) — SoT는 LocationProfile.
docs/admin/ARCHITECTURE.md:194:> - **어드민 폼 입력 필드 (UI 수집)**: 어드민의 "ClinicProfile 입력" 화면은 **두 섹션**으로 구성된다 — (a) 기관 정체성 섹션 (ClinicProfile 계약 필드) + (b) 본원 위치·연락·시간 섹션 (LocationProfile main 생성용 입력). 폼 한 화면, 출력은 **두 개 파일** (ClinicProfile + LocationProfile main).
docs/admin/ARCHITECTURE.md:200:**(2) `LocationProfile`(slug=`main`) 파일** — 다음 규칙으로 자동 생성:
docs/admin/ARCHITECTURE.md:202:| LocationProfile 필드 | 자동 생성 값 (어드민 폼의 "본원 위치·연락·시간" 섹션 입력값) |
docs/admin/ARCHITECTURE.md:215:**다지점 확장 시 (Phase Beta+)**: 별도 LocationProfile 추가 입력 화면 도입. M0에서는 단일 main만 지원.
docs/admin/ARCHITECTURE.md:217:**구현 책임**: 어드민이 ClinicProfile 폼 발행 트리거 시점에 두 파일(ClinicProfile + LocationProfile main)을 동시 출력해 Git에 함께 커밋. 운영자는 두 파일을 직접 편집해서 override 가능.
docs/admin/ARCHITECTURE.md:228:| `body` | Core 표준 템플릿 본문 + **ClinicProfile 변수** (`{{clinic.name}}`·`{{clinic.legalEntityName}}`·`{{clinic.businessRegistrationNumber}}`·`{{clinic.founder}}`) + **LocationProfile(main) 변수** (`{{location.main.email}}`·`{{location.main.address}}`·`{{location.main.telephone}}`) — 출처 SoT 준수 |
docs/admin/ARCHITECTURE.md:230:| `contactPerson` | 개인정보 보호 책임자 등 — 어드민에서 ClinicProfile 폼의 "정책 변수" 보조 섹션에 입력 |
docs/admin/ARCHITECTURE.md:332:| ClinicProfile 화면 | (a) 기관 정체성 / (b) 본원 위치·연락·시간 / (c) 정책 변수 (보조) | `ClinicProfile` + `LocationProfile`(main) + `LegalDocument`(privacy·terms 등 자동 생성) |
docs/admin/ARCHITECTURE.md:355:- 인스턴스 manifest 버전 표시
docs/admin/ARCHITECTURE.md:487:| 2026-05-14 | v0.4 | **PAGE_TYPES v0.5 + DATA_MODEL v0.4 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 7종+1샘플 → **8종+1샘플=9개 페이지** (P-014 Location Detail 추가), (2) **§ 3.8.1 LocationProfile(main) 자동 생성 규칙 명시** — 어드민 화면 추가 없이 ClinicProfile 입력으로 자동 생성, (3) § 3.11 완료 게이트 #1 8종 빌드로 수정. 어드민 화면 수 6개는 그대로 유지 | Glitzy (Claude 페어링) |
docs/admin/ARCHITECTURE.md:488:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **§ 3.8.1 표현 정리** — 계약 필드(파일 출력)와 어드민 폼 입력 필드(UI 수집)의 구분 명시. ClinicProfile 폼은 두 섹션(기관 정체성 + 본원 위치·연락·시간)으로 출력은 ClinicProfile + LocationProfile main 두 파일, (2) **§ 3.8.2 LegalDocument 자동 생성 규칙 신규** — Core 표준 템플릿 + ClinicProfile 변수 치환, ComplianceRecord 추적, (3) **§ 3.8 Slice 9종+1샘플 → 10종+1샘플=10페이지** (P-013 격상 추가), (4) § 3.11 완료 게이트 #1 10종, (5) **§ 5.2 데이터 입력 영역** — 어드민 화면별 입력·출력 매핑 표 추가로 1:1이 아님 명시 | Glitzy (Claude 페어링) |
docs/admin/ARCHITECTURE.md:489:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **§ 3.3 ClinicProfile 행 분리** — 이전 v0.3 잔존 표현(ClinicProfile에 주소·전화·시간)을 SoT 정합으로 정정. ClinicProfile/LocationProfile(main)/LegalDocument 3개 계약 행 + 자동 생성 표시, (2) **§ 3.8.2 LegalDocument body 변수 출처 정정** — ClinicProfile + LocationProfile(main) 두 SoT 명시 (`{{clinic.*}}`·`{{location.main.*}}` 네임스페이스), (3) **§ 3.8.2 법무 검토 강제 룰** — LegalDocument는 위험도 Low이지만 ComplianceRecord.legalCounsel·legalCounselAt 필수 (어드민 발행 게이트 차단) | Glitzy (Claude 페어링) |
docs/admin/ARCHITECTURE.md:490:| 2026-05-14 | v0.7 | **피드백 정정**: § 3.2 Slice 6개 화면 표 — ② 사이트 기본 정보의 입력 데이터 `ClinicProfile`만 → **`ClinicProfile` + `LocationProfile`(main) + `LegalDocument`** 3 계약 동시 출력로 정정. § 3.8.1/§ 3.8.2와 정합 | Glitzy (Claude 페어링) |
docs/decisions/LOCATION_LEGAL_PLAN.md:1:# LocationProfile(main) + LegalDocument 자동 생성 plan (v0.5·draft·2026-05-16)
docs/decisions/LOCATION_LEGAL_PLAN.md:5:본 문서는 `docs/admin/ARCHITECTURE.md` v0.7 § 3.8.1 (LocationProfile(main) 자동 생성 규칙) · § 3.8.2 (LegalDocument 자동 생성 규칙) 을 M0 어드민에서 구현하기 위한 plan이다. ClinicProfile 화면 한 화면에서 **3계약 동시 출력** (`ClinicProfile` + `LocationProfile`(slug=`main`) + `LegalDocument`(5종)) 을 단일 server action transaction 안에서 수행한다.
docs/decisions/LOCATION_LEGAL_PLAN.md:9:> **scope limit (LL-INTRO-01)** — cycle1 LL-03·LL-04 patch: 본 plan 은 LegalDocument **draft 저장만** 다룬다. `review-queued` 도 차단 — 그 전이는 ComplianceRecord pre-publish row + NotificationEvent envelope (REVIEW_WORKFLOW § 5.2 / § 3.1) 발송이 함께 작동해야 한다. 이 둘은 모두 compliance-assistant Feature + ComplianceRecord UI cascade 까지 defer. 본 plan 의 LegalDocument 는 `status='draft'` 강제 (CHECK). 발행 게이트 자체는 LL-DEFER-01.
docs/decisions/LOCATION_LEGAL_PLAN.md:14:- `docs/core/DATA_MODEL.md` v0.9 — C-01 ClinicProfile · C-16 LegalDocument · C-21 LocationProfile · CT-02 BusinessHours · CT-03 CTAConfig
docs/decisions/LOCATION_LEGAL_PLAN.md:42:| `clinic_profile` 정책 변수 + primaryCtas 컬럼 추가 | `policy_contact_person` · `policy_contact_email` · `policy_contact_phone` · `policy_effective_date` · `primary_ctas` (JSONB · cycle1 LL-02 patch) |
docs/decisions/LOCATION_LEGAL_PLAN.md:44:| `saveClinicProfile` actions 확장 | 단일 tx 안 ClinicProfile + LocationProfile(main) + 5종 LegalDocument upsert · 변수 치환 · audit 7 row 별도 emit (cycle1 LL-17 patch) |
docs/decisions/LOCATION_LEGAL_PLAN.md:48:| 5종 LegalDocument 별 effective_date input | cycle1 LL-15 patch — LL-DEFER-08 reversal. 5 record 별 individual input · default = policy_effective_date |
docs/decisions/LOCATION_LEGAL_PLAN.md:55:| LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제) · `review-queued` 전이 + ComplianceRecord pre-publish + NotificationEvent | compliance-assistant Feature + ComplianceRecord UI cascade | LL-INTRO-01 / LL-DEFER-01 |
docs/decisions/LOCATION_LEGAL_PLAN.md:56:| LegalDocument `status=published` 발행 자체 | apps/worker + Git commit cascade | LL-DEFER-01 |
docs/decisions/LOCATION_LEGAL_PLAN.md:57:| ClinicProfile 화면의 미리보기 (3계약 합쳐 본 미리보기 페이지) | M0 v1.0 미리보기 화면 | LL-DEFER-01 |
docs/decisions/LOCATION_LEGAL_PLAN.md:58:| 다지점 (slug ≠ main) LocationProfile UI | Phase Beta (M2+) | DATA_MODEL DM-17 |
docs/decisions/LOCATION_LEGAL_PLAN.md:59:| 정책 개정 이력 (`revisions[]`) UI | M1 Phase Alpha | LL-DEFER-02 |
docs/decisions/LOCATION_LEGAL_PLAN.md:60:| LegalDocument 수동 작성 모드 (autoGenerated=false) | M1 Phase Alpha — Markdown 에디터 합류 시점 | LL-DEFER-03 |
docs/decisions/LOCATION_LEGAL_PLAN.md:61:| reservationChannels 풀세트 (LocationProfile 별도 입력 폼) | M0 v1.0 본 구현 — LocationProfile 편집 화면 합류 시점 (cycle1 LL-02 patch — v0.1/v0.2 는 primaryCtas 상속만) | LL-DEFER-04 |
docs/decisions/LOCATION_LEGAL_PLAN.md:62:| `representativeDoctors` · `doctorsAtLocation` · `availableTreatments` ref 입력 | M0 v1.0 다지점 입력 화면 또는 LocationProfile 편집 화면 | LL-DEFER-05 |
docs/decisions/LOCATION_LEGAL_PLAN.md:63:| LegalDocument body 직접 수동 override | M1 Phase Alpha | LL-DEFER-06 |
docs/decisions/LOCATION_LEGAL_PLAN.md:64:| `latitude`/`longitude` 지도 pinpoint UI | M1 Phase Alpha | LL-DEFER-07 |
docs/decisions/LOCATION_LEGAL_PLAN.md:66:| `ClinicProfileBundle` audit contentType 권한 분리 | cycle1 LL-17 patch — audit shape 자체를 7 row 별도 emit 으로 변경 → `Bundle` outer 자체 제거. RBAC cascade 는 LL-DEFER-09 | LL-DEFER-09 |
docs/decisions/LOCATION_LEGAL_PLAN.md:67:| 템플릿 major 버전 변경 시 운영자 수동 확인 | M1 Phase Alpha | LL-DEFER-10 |
docs/decisions/LOCATION_LEGAL_PLAN.md:68:| LegalDocument body 검증 (CONTENT_STANDARDS § 7 ContentType 예외 marker 명시 + 면제 범위 cascade) | cycle1 LL-13 patch — CONTENT_STANDARDS § 7 의 LegalDocument 면제 marker 가 plan SoT cascade. 본 plan 에서 추가 검증 룰 미정의 | LL-DEFER-11 |
docs/decisions/LOCATION_LEGAL_PLAN.md:69:| `cookie` / `other` documentType 자동 생성 | cycle1 LL-08·LL-09 patch — partial UNIQUE 로 5종만 SoT 자동 생성. cookie/other 는 운영자 manual 입력 (단, v0.2 도 UI 미제공 — M1 Phase Alpha) | LL-DEFER-12 |
docs/decisions/LOCATION_LEGAL_PLAN.md:70:| custom (`documentType=other`) template_version namespace 규약 | cycle1 LL-22 patch — `other` 는 templateVersion null (autoGenerated=false). custom semver 는 M1 cascade | LL-DEFER-13 |
docs/decisions/LOCATION_LEGAL_PLAN.md:94:  contact_person TEXT,
docs/decisions/LOCATION_LEGAL_PLAN.md:95:  contact_email TEXT,
docs/decisions/LOCATION_LEGAL_PLAN.md:106:    contact_email IS NULL OR contact_email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
docs/decisions/LOCATION_LEGAL_PLAN.md:121:  -- cycle1 LL-08 patch: partial UNIQUE — closed 5종만 instance 당 1개 강제. cookie/other 는 미강제 (LL-DEFER-12)
docs/decisions/LOCATION_LEGAL_PLAN.md:143:- (LL-SCHEMA-02 · cycle1 LL-08·LL-09 patch) **partial UNIQUE** — closed 5종 (`privacy`/`terms`/`non-covered`/`refund`/`complaint`) per instance UNIQUE. `cookie`/`other` 는 instance 당 N개 허용 (skeleton v0.2 UI 미제공 — LL-DEFER-12).
docs/decisions/LOCATION_LEGAL_PLAN.md:144:- (LL-SCHEMA-03 · cycle1 LL-03 patch) `status` CHECK `= 'draft'` — skeleton 단계 단일 상태만. `review-queued` 전이는 ComplianceRecord pre-publish row + NotificationEvent 발송과 함께만 작동 (compliance-assistant cascade — LL-DEFER-01).
docs/decisions/LOCATION_LEGAL_PLAN.md:145:- (LL-SCHEMA-04) `published_at` CHECK NULL — 발행 자체가 LL-DEFER-01.
docs/decisions/LOCATION_LEGAL_PLAN.md:148:- (LL-SCHEMA-07) `revisions[]` 은 v0.2 column 미추가 (LL-DEFER-02). `metadata JSONB` 확장 여지만 남김.
docs/decisions/LOCATION_LEGAL_PLAN.md:156:  ADD COLUMN policy_contact_person TEXT,
docs/decisions/LOCATION_LEGAL_PLAN.md:157:  ADD COLUMN policy_contact_email TEXT,
docs/decisions/LOCATION_LEGAL_PLAN.md:158:  ADD COLUMN policy_contact_phone TEXT,
docs/decisions/LOCATION_LEGAL_PLAN.md:161:  ADD COLUMN primary_ctas JSONB NOT NULL DEFAULT '[]'::jsonb;
docs/decisions/LOCATION_LEGAL_PLAN.md:165:    policy_contact_email IS NULL
docs/decisions/LOCATION_LEGAL_PLAN.md:166:    OR policy_contact_email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
docs/decisions/LOCATION_LEGAL_PLAN.md:170:    policy_contact_phone IS NULL
docs/decisions/LOCATION_LEGAL_PLAN.md:171:    OR policy_contact_phone ~ '^(\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}$'
docs/decisions/LOCATION_LEGAL_PLAN.md:173:  ADD CONSTRAINT clinic_profile_primary_ctas_array CHECK (
docs/decisions/LOCATION_LEGAL_PLAN.md:174:    jsonb_typeof(primary_ctas) = 'array'
docs/decisions/LOCATION_LEGAL_PLAN.md:178:-- cycle4 LL-54 patch: trigger function 은 NEW 읽고 row-specific RAISE 하므로 VOLATILE (기본). IMMUTABLE 마킹 제거.
docs/decisions/LOCATION_LEGAL_PLAN.md:179:-- cycle3 LL-40 + cycle4 LL-50 patch: CT-03 SoT 정렬 — DB trigger 는 CT-03 enum 11종 전체 허용 (subset 분리 — UI 입력은 phone/kakao-talk/naver-reservation 3종 minimal · LL-FORM-08 정렬).
docs/decisions/LOCATION_LEGAL_PLAN.md:180:-- cycle4 LL-48 patch: RAISE ... USING CONSTRAINT = '<name>' 으로 errors.ts mapDbErrorToResult 가 23514 + constraint name 으로 분기 가능.
docs/decisions/LOCATION_LEGAL_PLAN.md:181:CREATE OR REPLACE FUNCTION clinic_profile_primary_ctas_validate()
docs/decisions/LOCATION_LEGAL_PLAN.md:188:    'kakao-talk', 'kakao-channel',
docs/decisions/LOCATION_LEGAL_PLAN.md:189:    'naver-reservation', 'naver-talk',
docs/decisions/LOCATION_LEGAL_PLAN.md:194:  IF jsonb_typeof(NEW.primary_ctas) <> 'array' THEN
docs/decisions/LOCATION_LEGAL_PLAN.md:195:    RAISE EXCEPTION 'primary_ctas must be a JSON array'
docs/decisions/LOCATION_LEGAL_PLAN.md:196:      USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
docs/decisions/LOCATION_LEGAL_PLAN.md:198:  FOR elem IN SELECT * FROM jsonb_array_elements(NEW.primary_ctas) LOOP
docs/decisions/LOCATION_LEGAL_PLAN.md:199:    -- DB key = 'id' (Git 출력 시 '@id' alias 변환은 LL-CASCADE-04 build/export 책임)
docs/decisions/LOCATION_LEGAL_PLAN.md:201:      RAISE EXCEPTION 'primary_ctas element missing id'
docs/decisions/LOCATION_LEGAL_PLAN.md:202:        USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
docs/decisions/LOCATION_LEGAL_PLAN.md:205:      RAISE EXCEPTION 'primary_ctas element type invalid: %', elem ->> 'type'
docs/decisions/LOCATION_LEGAL_PLAN.md:206:        USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
docs/decisions/LOCATION_LEGAL_PLAN.md:209:      RAISE EXCEPTION 'primary_ctas element missing label'
docs/decisions/LOCATION_LEGAL_PLAN.md:210:        USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
docs/decisions/LOCATION_LEGAL_PLAN.md:213:      RAISE EXCEPTION 'primary_ctas element missing targetUrl'
docs/decisions/LOCATION_LEGAL_PLAN.md:214:        USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
docs/decisions/LOCATION_LEGAL_PLAN.md:220:-- cycle4 LL-54 patch: VOLATILE 기본 (마킹 생략). row-specific RAISE 에 정합.
docs/decisions/LOCATION_LEGAL_PLAN.md:222:CREATE TRIGGER clinic_profile_primary_ctas_trigger
docs/decisions/LOCATION_LEGAL_PLAN.md:223:  BEFORE INSERT OR UPDATE OF primary_ctas ON clinic_profile
docs/decisions/LOCATION_LEGAL_PLAN.md:224:  FOR EACH ROW EXECUTE FUNCTION clinic_profile_primary_ctas_validate();
docs/decisions/LOCATION_LEGAL_PLAN.md:229:- (LL-SCHEMA-10 · cycle1 LL-14 patch) `policy_contact_phone` 도 form 단계 required (DB NULL 허용은 유지 — 향후 cookie/other manual 입력 row 호환).
docs/decisions/LOCATION_LEGAL_PLAN.md:230:- (LL-SCHEMA-11 · cycle1 LL-15 patch) `policy_effective_date` 는 form 안 5 LegalDocument record 의 default 만. 운영자가 각 record 별 override 가능 (LL-DEFER-08 closed).
docs/decisions/LOCATION_LEGAL_PLAN.md:231:- (LL-SCHEMA-12 · cycle1 LL-02 + cycle2 LL-26 + cycle3 LL-38·LL-40·LL-45 + cycle4 LL-50·LL-51 patch) `primary_ctas` JSONB array — admin/ARCH § 3.8.1 의 `reservationChannels = primaryCtas 상속` SoT 보존. 각 원소는 **CT-03 SoT shape**: `{id: string, type: enum, label: string, targetUrl: string (required)}`. **type enum 정책 = DB trigger 전체 허용 + UI subset 분리** (cycle4 LL-50):
docs/decisions/LOCATION_LEGAL_PLAN.md:232:  - DB trigger 허용 11종 (CT-03 SoT 전체): `phone` · `email` · `sms` · `kakao-talk` · `kakao-channel` · `naver-reservation` · `naver-talk` · `form` · `map` · `external` · `video-consultation`.
docs/decisions/LOCATION_LEGAL_PLAN.md:233:  - **M0 v0.5 UI 입력 subset 3종** (LL-FORM-08): `phone` · `kakao-talk` · `naver-reservation`. UI form 의 select 옵션도 SoT 정확 token (cycle4 LL-51 — 기존 `kakao` / `naver-booking` 잘못된 별명 제거).
docs/decisions/LOCATION_LEGAL_PLAN.md:234:  - UI subset 외 type (sms/form/map/external 등) 은 M0 v1.0 또는 M1 cascade (LL-DEFER-19).
docs/decisions/LOCATION_LEGAL_PLAN.md:235:  - **DB 검증 = trigger** (CHECK subquery 불가 · cycle3 LL-38 patch) + form zod (UI subset 3종 enum) 양쪽. LocationProfile 자동 생성 시 **build-time reference (deep clone)** — DB metadata 복사 없음 (LL-SCHEMA-18 통일).
docs/decisions/LOCATION_LEGAL_PLAN.md:253:-- 기존 row 가 있을 경우 backfill 후 NOT NULL — skeleton 단계 row 없음 가정. data migration 부담 marker LL-DEFER-14.
docs/decisions/LOCATION_LEGAL_PLAN.md:259:-- cycle2 LL-29 patch: ClinicProfile.locations[] >= 1 DB invariant — clinic_profile 마다 main slug LocationProfile 최소 1 row 강제.
docs/decisions/LOCATION_LEGAL_PLAN.md:260:-- partial unique 가 아니라 EXISTS 보장. trigger 또는 매 INSERT 시 SELECT FOR UPDATE + COUNT 검증 — server action 단일 tx 안에서 처리 (LL-ACTION-04 의 ClinicProfile → LocationProfile main 동시 upsert + assertHasMainLocationAfterTx).
docs/decisions/LOCATION_LEGAL_PLAN.md:261:-- DB constraint 자체는 후속 trigger cascade (LL-DEFER-15).
docs/decisions/LOCATION_LEGAL_PLAN.md:267:- (LL-SCHEMA-15 · cycle2 LL-29 patch) ClinicProfile.locations[] (DATA_MODEL C-01 required ≥1) 는 **DB 컬럼 추가 없음** — Git 출력 빌드 시점 `SELECT id FROM location_profile WHERE clinic_profile_id = ?` 으로 동적 구성. cardinality 보장은 server action 안 단일 tx atomic upsert + `assertHasMainLocationAfterTx` 안전망 (LL-ACTION-21). DB trigger cascade 는 LL-DEFER-15.
docs/decisions/LOCATION_LEGAL_PLAN.md:291:  "reservationChannelsInheritedFrom": "clinic_profile.primary_ctas",
docs/decisions/LOCATION_LEGAL_PLAN.md:292:  // v0.2 미입력 — LL-DEFER-05
docs/decisions/LOCATION_LEGAL_PLAN.md:299:- (LL-SCHEMA-17 · cycle1 LL-05 + cycle2 LL-30 patch) form (b) 의 7요일 입력은 server action 안에서 SoT 형식으로 변환 후 저장 (LL-ACTION-09). 입력 UX 는 7요일 단순 행. **receptionHours · specialClosures 는 v0.3 form 입력 필드 없음 → 빈 배열로 저장** (CT-02 optional). round-trip (저장 후 form 재로딩) 시 빈 배열은 form (b) 의 미입력 상태로 표시. M1 cascade 에서 form (b) 에 receptionHours 단축 입력 + specialClosures (공휴일/임시 휴진) UI 추가 합류 (LL-DEFER-16).
docs/decisions/LOCATION_LEGAL_PLAN.md:300:- (LL-SCHEMA-18 · cycle1 LL-02 + cycle2 LL-27 patch) `reservationChannels` 는 별도 입력 없음 — LocationProfile 자동 생성 시 ClinicProfile.primary_ctas 그대로 상속. **C-21 Git 출력 시점 구성 규칙**: build 시 `LocationProfile.reservationChannels = clinic_profile.primary_ctas` 의 직접 reference (C-21 출력 필드 값 = ClinicProfile primary_ctas의 deep clone). `metadata.reservationChannelsInheritedFrom` marker 는 DB 안 의도 명시용 — Git 출력에서는 사용 안 함. M0 v1.0 다지점 합류 시 hybrid (지점 override + 본원 상속 default) cascade (LL-DEFER-04).
docs/decisions/LOCATION_LEGAL_PLAN.md:301:- (LL-SCHEMA-19 · cycle1 LL-11 patch) `representativeDoctors`/`doctorsAtLocation`/`availableTreatments` 는 v0.3 빈 배열 — admin/ARCH § 3.8.1 자동 생성 표의 "ClinicProfile 등록 대표/전체 의료진/전체 시술" 매핑은 LocationProfile 편집 화면 합류 시점 (LL-DEFER-05). 빈 배열 의미는 SoT (DATA_MODEL C-21 optional).
docs/decisions/LOCATION_LEGAL_PLAN.md:311:| **(b) 본원 위치·연락·시간** (신규) | streetAddress · addressLocality · addressRegion · postalCode · addressCountry · telephone · email · businessHours (7 요일 + 점심) · primaryCtas (3종 minimal · CT-03 SoT token: `phone`/`kakao-talk`/`naver-reservation` · cycle4 LL-51 patch) · featuredChannelId | `ClinicProfile.primary_ctas` + `LocationProfile`(slug=`main`) |
docs/decisions/LOCATION_LEGAL_PLAN.md:318:- (LL-FORM-04 · cycle1 LL-14 patch) 섹션 (c) 는 LegalDocument 생성에 필수 — policyContactPerson · policyContactEmail · policyContactPhone · policyEffectiveDate **4 필드 모두 required**. (한국 PIPA 의 개인정보 보호책임자 필수 고지 항목 — 소속/부서 같은 추가 필드는 LL-DEFER 또는 자유 입력 textarea 로 처리. v0.2 는 4 필드만 minimal.)
docs/decisions/LOCATION_LEGAL_PLAN.md:322:- (LL-FORM-08 · cycle1 LL-02 + cycle4 LL-51 patch) primaryCtas UI: **CT-03 SoT token 3종** (`phone` · `kakao-talk` · `naver-reservation`) 각각 1개씩 입력 행. 미입력 = 해당 채널 제외. 각 채널 row 입력 = `targetUrl` (필수: `tel:+82-2-1234-5678` · `https://pf.kakao.com/...` · `https://booking.naver.com/...`) + `label` (필수: 운영자 자유 입력) + `id` (자동 생성: `<type>-<n>`). featuredChannelId 는 입력한 채널 중 select. **단, 이는 ClinicProfile.primary_ctas 의 입력** — LocationProfile.reservationChannels 는 자동 상속 (LL-SCHEMA-18 build-time).
docs/decisions/LOCATION_LEGAL_PLAN.md:347:  // 별도 ActionType (operator-edit-legal) 분리는 LL-DEFER-09 (RBAC cascade).
docs/decisions/LOCATION_LEGAL_PLAN.md:359:- (LL-ACTION-03 · cycle1 LL-17 patch) audit `content-saved` 는 tx commit 후 **7 row 별도 emit** — ClinicProfile 1 + LocationProfile 1 + LegalDocument 5. 각 row 의 payload 는 기존 통일 shape `{contentType, slug, mode, status, originalSlug}`. `ClinicProfileBundle` outer 폐기. analytics/test 호환 보존.
docs/decisions/LOCATION_LEGAL_PLAN.md:362:- (LL-ACTION-06 · cycle1 LL-16 + cycle3 LL-46 patch) **자동 재렌더링 분기 제거** — v0.4 는 LegalDocument 본문 수동 편집 차단 (LL-DEFER-06) 이므로 모든 row 가 templateVersion=current. 매 저장 시 모든 LegalDocument body 재렌더링. **운영자 알림 marker (LL-FORM-15 · 폼 (d) 상단 안내문)**: "본원 정보(기관명·법인명·사업자번호·설립자·본원 주소·전화·이메일) 또는 정책 변수(담당자·이메일·전화·시행일)를 수정하면 5종 정책 문서 본문이 자동으로 다시 생성됩니다. 본문 직접 수정은 추후 단계에서 합류합니다." 향후 수동 override 도입 시 별도 `body_source` enum (`auto`/`manual`) 컬럼 cascade.
docs/decisions/LOCATION_LEGAL_PLAN.md:364:- (LL-ACTION-08 · cycle1 LL-02 + cycle3 LL-45 patch — LL-SCHEMA-12·LL-SCHEMA-18 통일) LocationProfile 자동 상속 = **build-time reference (deep clone)**. server action 안 DB 저장은 `metadata.reservationChannelsInheritedFrom = "clinic_profile.primary_ctas"` marker 만 (의도 명시용). 실제 출력 시점은 apps/worker · M0 v1.0 build/export 의 책임 (LL-CASCADE-04 marker 신설).
docs/decisions/LOCATION_LEGAL_PLAN.md:366:- (LL-ACTION-21 · cycle2 LL-29 + cycle3 LL-44 patch) **assertHasMainLocationAfterTx 안전망**: tx 안 마지막 단계에서 `SELECT 1 FROM location_profile WHERE instance_id=? AND clinic_profile_id=? AND slug='main'` — 0행이면 **`MainLocationMissingError` (apps/web/src/lib/errors.ts 신설 named Error class) throw** → tx rollback. server action outer catch 에서 `MainLocationMissingError` 별도 분기: `return { ok: false, fieldErrors: {}, formError: "본원 정보 저장에 실패했습니다. 페이지를 새로고침하고 다시 시도하세요." }`. mapDbErrorToResult 와는 별개 (DB error 가 아닌 application-level invariant). 정상 흐름에서는 LocationProfile main upsert 가 항상 수행되므로 trip 안 됨. DB trigger 합류 (LL-DEFER-15) 까지 임시 보호.
docs/decisions/LOCATION_LEGAL_PLAN.md:387:  policy: {                  // cycle1 LL-06 patch: admin/ARCH § 3.8.2 의 contactPerson 입력 섹션 = policy.* 변수 출처. SoT 정당화.
docs/decisions/LOCATION_LEGAL_PLAN.md:388:    contactPerson: string;
docs/decisions/LOCATION_LEGAL_PLAN.md:389:    contactEmail: string;
docs/decisions/LOCATION_LEGAL_PLAN.md:390:    contactPhone: string;
docs/decisions/LOCATION_LEGAL_PLAN.md:404:- (LL-ACTION-16 · cycle1 LL-06 + cycle2 LL-33 patch) `policy.*` 변수 정당화 — admin/ARCH § 3.8.2 의 `contactPerson` 필드 + § 3.8.2 결정 ("ClinicProfile 폼 '정책 변수' 보조 섹션") 이 SoT 출처. ARCH 본문에 `policy.*` 변수가 명시되지 않은 것은 ARCH 의 변수 사용 sample 일 뿐. **acceptance 전 순서 정합 (cycle2 LL-33)**: 본 plan v1.0 acceptance **와 동시 또는 직전에** ARCH § 3.8.2 patch (LL-CASCADE-01) 적용 — plan acceptance commit 안에 ARCH 패치 포함. plan 단독 acceptance 시 ARCH SoT 충돌 잔존하므로 cascade 가 acceptance precondition.
docs/decisions/LOCATION_LEGAL_PLAN.md:414:{ "eventType": "content-saved", "payload": { "contentType": "LocationProfile", "slug": "main",   "mode": "...", "status": null,    "originalSlug": "main" } }
docs/decisions/LOCATION_LEGAL_PLAN.md:426:  - **3단계 안전망 (cycle3 LL-43 + cycle4 LL-55 patch — Sentry pre-integration fallback 명시)**:
docs/decisions/LOCATION_LEGAL_PLAN.md:427:    - **v0.5 단계 (Sentry SDK 미통합 · LL-DEFER-18 합류 전)**: (1) per-row try/catch + console.error → server stdout (Vercel logs / Cloud Run logs). (2) partial/failed row INSERT 시도 → 실패해도 server stdout. (3) partial/failed row INSERT 자체 실패 시 server stdout만 (Sentry 미통합 상태 명시). 사용자 return state 는 `{ ok: true }` 유지 (save 성공이 우선 · audit 누락만 운영 팀 stdout 추적).
docs/decisions/LOCATION_LEGAL_PLAN.md:428:    - **M0 v1.0 (LL-DEFER-18 합류 후)**: (3) Sentry capture (INFRA INFR-PROV `Sentry` Provider 통합) + breadcrumb 으로 (1)/(2) 단계의 console.error 도 함께 캡처. 사용자 return state 동일.
docs/decisions/LOCATION_LEGAL_PLAN.md:430:  - 운영자 시각 영향 없음 — 저장 자체 성공 시 항상 `ok: true`. audit observability 손실은 운영 팀이 Sentry/로그에서 추적.
docs/decisions/LOCATION_LEGAL_PLAN.md:432:- (LL-ACTION-19 · cycle1 LL-17 patch) ADMIN_UI_SKELETON_PLAN § 5.5 audit matrix cascade — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed 별도 row 추가 marker (LL-CASCADE-02). 기존 ClinicProfile row 와 동일 통일 shape.
docs/decisions/LOCATION_LEGAL_PLAN.md:437:- 새 constraint 매핑 (mapDbErrorToResult cascade · cycle1 LL-19 + cycle2 LL-34 + cycle4 LL-48 patch — 후속 책임/액션/시점 명시):
docs/decisions/LOCATION_LEGAL_PLAN.md:444:  - `clinic_profile_primary_ctas_array` · `clinic_profile_primary_ctas_shape` (trigger RAISE 의 USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' · SQLSTATE 23514 — cycle4 LL-48 patch) → fieldErrors.primaryCtas
docs/decisions/LOCATION_LEGAL_PLAN.md:482:- (LL-TEMPLATE-02) v0.2 는 5종 (`cookie`/`other` 제외) — M1 manual 입력 cascade (LL-DEFER-12).
docs/decisions/LOCATION_LEGAL_PLAN.md:485:- (LL-TEMPLATE-05 · cycle1 LL-06 patch) 변수 화이트리스트 (admin/ARCH § 3.8.2 SoT cascade marker LL-CASCADE-01 — ARCH 본문에 본 표 reference 추가):
docs/decisions/LOCATION_LEGAL_PLAN.md:488:  - `{{policy.contactPerson}}` · `{{policy.contactEmail}}` · `{{policy.contactPhone}}` · `{{policy.effectiveDate}}`
docs/decisions/LOCATION_LEGAL_PLAN.md:489:- (LL-TEMPLATE-06) 템플릿 versioning — semver `major.minor.patch`. minor 이상 업그레이드 시 자동 재렌더링 (LL-ACTION-06 — v0.2 매 저장 시 무조건 재렌더링이므로 minor/major 분기 불필요). major 변경 시 운영자 수동 확인은 LL-DEFER-10.
docs/decisions/LOCATION_LEGAL_PLAN.md:490:- (LL-TEMPLATE-07 · cycle1 LL-13 patch) **LegalDocument body 검증 면제 명시** — `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표에 LegalDocument 추가 (cascade marker LL-CASCADE-03). 면제 범위: (1) answer-first AST 미적용 (정책 문서는 첫 문장 답 제시 구조 아님) (2) 표현 검사 (recommend/best 등 광고 표현) 미적용 (3) 변수 화이트리스트 검증은 별도 룰 (LL-ACTION-12).
docs/decisions/LOCATION_LEGAL_PLAN.md:502:  7. `packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql` — clinic_profile ALTER (policy_* + primary_ctas)
docs/decisions/LOCATION_LEGAL_PLAN.md:536:| 9 | content-saved audit matrix row 추가 (LocationProfile · LegalDocument) | ADMIN_UI_SKELETON_PLAN § 5.5 cascade marker (LL-CASCADE-02) |
docs/decisions/LOCATION_LEGAL_PLAN.md:537:| 10 | admin/ARCHITECTURE.md § 3.8.2 변수 화이트리스트 reference 추가 | LL-CASCADE-01 |
docs/decisions/LOCATION_LEGAL_PLAN.md:538:| 11 | docs/core/CONTENT_STANDARDS.md § 7 LegalDocument 예외 marker 추가 | LL-CASCADE-03 |
docs/decisions/LOCATION_LEGAL_PLAN.md:545:- `LL-DEFER-01`: LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제 · review-queued 전이 + ComplianceRecord pre-publish + NotificationEvent envelope · status=published). compliance-assistant Feature + ComplianceRecord UI cascade.
docs/decisions/LOCATION_LEGAL_PLAN.md:546:- `LL-DEFER-09`: LegalDocument 편집 권한 분리 (operator-edit-legal ActionType — REVIEW_WORKFLOW 14 ActionType cascade).
docs/decisions/LOCATION_LEGAL_PLAN.md:547:- `LL-DEFER-11`: LegalDocument body 검증 — CONTENT_STANDARDS § 7 ContentType 예외 marker cascade (LL-CASCADE-03). 추가 검증 룰은 compliance-assistant Feature.
docs/decisions/LOCATION_LEGAL_PLAN.md:548:- `LL-DEFER-15` (cycle2 LL-29 patch): location_profile 의 main slug 1 row 강제 DB trigger 또는 partial unique with `clinic_profile_id` 기반 cascade — v0.4 은 server action assertHasMainLocationAfterTx 안전망. M0 v1.0 본 구현에서 DB-level invariant 합류.
docs/decisions/LOCATION_LEGAL_PLAN.md:549:- `LL-DEFER-18` (cycle3 LL-43 patch): Sentry SDK 통합 (INFRA INFR-PROV `Sentry` Provider). audit partial/failed row INSERT 실패 시 capture 채널. M0 v1.0 본 구현 (provider 통합 시점).
docs/decisions/LOCATION_LEGAL_PLAN.md:550:- `LL-DEFER-19` (cycle4 LL-50 patch): primaryCtas UI subset 확장 — CT-03 11종 중 phone/kakao-talk/naver-reservation 외 8종 (`email`/`sms`/`kakao-channel`/`naver-talk`/`form`/`map`/`external`/`video-consultation`) 의 UI 입력 합류. M0 v1.0 본 구현 또는 M1 Phase Alpha.
docs/decisions/LOCATION_LEGAL_PLAN.md:551:- `LL-DEFER-20` (cycle4 LL-53 patch): packages/migrations-runner 실 runner 코드 — manifest spec 작성 (plan v1.0 acceptance precondition) 후 sequential apply + fail-fast 구현. M0 v1.0 본 구현.
docs/decisions/LOCATION_LEGAL_PLAN.md:555:- `LL-DEFER-02`: 정책 개정 이력 (`revisions[]`) UI.
docs/decisions/LOCATION_LEGAL_PLAN.md:556:- `LL-DEFER-03`: LegalDocument 수동 작성 모드 (autoGenerated=false · Markdown 에디터).
docs/decisions/LOCATION_LEGAL_PLAN.md:557:- `LL-DEFER-06`: LegalDocument body 수동 override · `body_source` enum cascade.
docs/decisions/LOCATION_LEGAL_PLAN.md:558:- `LL-DEFER-07`: latitude/longitude 지도 pinpoint.
docs/decisions/LOCATION_LEGAL_PLAN.md:559:- `LL-DEFER-10`: 템플릿 major 버전 변경 시 운영자 수동 확인.
docs/decisions/LOCATION_LEGAL_PLAN.md:560:- `LL-DEFER-12`: `cookie`/`other` documentType UI (manual 입력 + custom template).
docs/decisions/LOCATION_LEGAL_PLAN.md:561:- `LL-DEFER-13`: custom (`documentType=other`) template_version namespace 규약.
docs/decisions/LOCATION_LEGAL_PLAN.md:562:- `LL-DEFER-16` (cycle2 LL-30 patch): form (b) 에 receptionHours + specialClosures (공휴일/임시 휴진) UI 추가.
docs/decisions/LOCATION_LEGAL_PLAN.md:564:### 9.3 M0 v1.0 본 구현 합류 (LocationProfile 편집 화면 cascade · cycle4 LL-52 patch)
docs/decisions/LOCATION_LEGAL_PLAN.md:566:> **§1.3 비범위 vs §9.3 phase 정합 정정 (cycle4 LL-52)**: LL-DEFER-04/05 의 합류 시점은 LocationProfile 편집 화면 (M0 v1.0 본 구현). M2 Phase Beta 합류로 표시했던 v0.4 까지의 표기는 §1.3 비범위 표 ("LocationProfile 편집 화면 합류 시점") 와 충돌. v0.5 에서 통일.
docs/decisions/LOCATION_LEGAL_PLAN.md:568:- `LL-DEFER-04`: reservationChannels 풀세트 (LocationProfile 편집 화면 + 지점별 override). **M0 v1.0 본 구현 합류**.
docs/decisions/LOCATION_LEGAL_PLAN.md:569:- `LL-DEFER-05`: representativeDoctors · doctorsAtLocation · availableTreatments ref 입력 UI (다지점 합류 시점). **M0 v1.0 본 구현 합류** (단지점도 LocationProfile 편집 화면에서 입력).
docs/decisions/LOCATION_LEGAL_PLAN.md:577:- `LL-DEFER-14` (cycle2 LL-28 patch): location_profile.clinic_profile_id NOT NULL data migration — 기존 row 존재 시 backfill 정책. v0.4 skeleton 가정은 row 없음.
docs/decisions/LOCATION_LEGAL_PLAN.md:578:- `LL-DEFER-17` (cycle2 LL-36 patch): cookie/other 가 closed type 으로 승격 시 partial unique index DROP + 새 7종 partial unique CREATE — migration cascade marker.
docs/decisions/LOCATION_LEGAL_PLAN.md:582:- ~~`LL-DEFER-08`~~: cycle1 LL-15 patch — 5종 LegalDocument 별 effectiveDate override 합류 완료 (v0.2 acceptance).
docs/decisions/LOCATION_LEGAL_PLAN.md:586:> **acceptance 순서 정합 (cycle2 LL-33)**: LL-CASCADE-01 은 plan v1.0 acceptance 와 **동시 또는 직전** 에 ARCH patch 적용 (plan acceptance commit 안 포함). LL-CASCADE-02 · LL-CASCADE-03 · LL-CASCADE-04 도 동일 정책. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
docs/decisions/LOCATION_LEGAL_PLAN.md:588:- `LL-CASCADE-01`: `docs/admin/ARCHITECTURE.md` § 3.8.2 표 — body 변수 화이트리스트 11개 (clinic 4 + location 3 + policy 4) reference 추가. ARCH v0.8 patch. **acceptance precondition**.
docs/decisions/LOCATION_LEGAL_PLAN.md:589:- `LL-CASCADE-02`: `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` § 5.5 audit matrix — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed row 추가. **acceptance precondition**.
docs/decisions/LOCATION_LEGAL_PLAN.md:590:- `LL-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표 — LegalDocument 면제 marker 추가 (answer-first AST · 표현 검사 면제 · 변수 화이트리스트 별도 룰). **acceptance precondition**.
docs/decisions/LOCATION_LEGAL_PLAN.md:591:- `LL-CASCADE-04` (cycle3 LL-41 + cycle4 LL-49 patch): **cascade target 정정** — ADMIN_UI_SKELETON_PLAN § 6 은 walking skeleton 의 actions 영역으로 build/export 부재 → 본 plan v1.0 acceptance 시 **신규 plan `docs/decisions/M0_BUILD_EXPORT_PLAN.md` (placeholder)** 신설 + 본 plan 의 LL-CASCADE-04 marker reference. apps/worker · M0 v1.0 Git export 책임: LocationProfile.reservationChannels Git 출력 시 `clinic_profile.primary_ctas` deep clone, LocationProfile.@id = `"main"`, LocationProfile.parentClinic = ClinicProfile.@id reference, ClinicProfile.locations[] = SELECT 결과, primary_ctas DB key `id` → Git output `@id` alias 변환. **acceptance 강도 = placeholder 작성** (M0_BUILD_EXPORT_PLAN.md 의 LL-CASCADE-04 책임 명시 row 1건). 실 구현은 M0 v1.0 본 구현.
docs/decisions/LOCATION_LEGAL_PLAN.md:592:- `LL-CASCADE-05` (cycle3 LL-42 + cycle4 LL-53 patch): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장. **acceptance 강도 명시** — plan v1.0 acceptance 는 **manifest spec 작성까지만 차단** (manifest 파일 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` 의 spec 작성 + 본 plan 의 8단계 의존성 표 cascade). 실 runner 코드 구현은 M0 v1.0 cascade (LL-DEFER-20 신설). 즉 plan v1.0 acceptance ≠ runner 코드 acceptance.
docs/decisions/LOCATION_LEGAL_PLAN.md:599:| 2026-05-16 | v0.2 | **Codex 비평 cycle1 25 findings (7 blocking + 12 major + 6 minor) 전건 수용 patch**: (LL-01) location_profile 에 clinic_profile_id composite FK + main row CHECK, ClinicProfile.locations[] Git 출력 빌드 시점 동적 구성. (LL-02) ClinicProfile.primary_ctas 컬럼 + LocationProfile.reservationChannels = primary_ctas 자동 상속 marker. (LL-03·04) status='draft' 만 허용 (review-queued 도 차단) — ComplianceRecord pre-publish + NotificationEvent 합류 시점까지 defer. (LL-05) businessHours SoT CT-02 형식 (openingHours[]·receptionHours[]·lunchBreaks[]·specialClosures[]) 변환 + server action 안 convertToOpeningHoursSpec 명시. (LL-06) policy.* 변수 정당화 + LL-CASCADE-01 cascade marker. (LL-07) 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha. (LL-08·09) partial UNIQUE — closed 5종만. cookie/other LL-DEFER-12. (LL-10) C-21 출력 매핑표 명시. (LL-11) representativeDoctors v0.2 빈 배열. (LL-12) risk_level NOT NULL + CHECK 'Low' 만. (LL-13) SoT 경로 정정 (docs/core/CONTENT_STANDARDS.md) + LL-CASCADE-03. (LL-14) policyContactPhone form 단계 required. (LL-15) effective_date individual override 합류 (LL-DEFER-08 closed). (LL-16) 자동 재렌더링 분기 제거 (모든 row 매 저장 시 재렌더링). (LL-17) audit 7 row 별도 emit (Bundle outer 폐기). (LL-18) RBAC 분리 marker LL-DEFER-09 명시. (LL-19) published CHECK 위반 시 운영자 메시지 + errors.ts 매핑. (LL-20) phone regex 한국 + 국제 표기 명시. (LL-21) effective_date timezone Asia/Seoul. (LL-22) template_version naming autoGenerated=true 일 때만 필수. (LL-23) businessHours a11y marker. (LL-24) detection 시점 server action runtime + build-time test cascade. (LL-25) LL-DEFER-08~10 본문 §1 비범위 표 반영. |
docs/decisions/LOCATION_LEGAL_PLAN.md:600:| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
docs/decisions/LOCATION_LEGAL_PLAN.md:601:| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
docs/decisions/LOCATION_LEGAL_PLAN.md:602:| 2026-05-16 | v0.5 | **Codex 비평 cycle4 8 findings (2 blocking + 4 major + 2 minor) 전건 수용 patch**: (LL-48) trigger RAISE EXCEPTION USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' 추가 — errors.ts mapDbErrorToResult 가 SQLSTATE 23514 + constraint name 으로 분기 가능. (LL-49) LL-CASCADE-04 target 정정 — ADMIN_UI_SKELETON_PLAN § 6 은 actions 영역으로 build/export 부재. 신규 `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 신설 + LL-CASCADE-04 책임 row 1건 cascade. acceptance 강도 = placeholder 작성. (LL-50) CT-03 enum SoT 정렬 — DB trigger 허용 11종 (phone/email/sms/kakao-talk/kakao-channel/naver-reservation/naver-talk/form/map/external/video-consultation) + UI subset 3종 분리. LL-DEFER-19 8종 UI 합류. (LL-51) form (b) UI copy 정정 — kakao → kakao-talk · naver-booking → naver-reservation 토큰. (LL-52) LL-DEFER-04/05 phase 충돌 정정 — §9.3 → M0 v1.0 본 구현 (LocationProfile 편집 화면) 으로 통일. M2 Phase Beta 표기 제거 (현재 비어 있음 — 외부 사용자 RBAC 가 M2). (LL-53) LL-CASCADE-05 강도 명시 — plan v1.0 acceptance = manifest spec 작성만 차단, 실 runner 코드는 LL-DEFER-20 (M0 v1.0). (LL-54) trigger function IMMUTABLE 마킹 제거 — VOLATILE 기본 (NEW 읽기 + row-specific RAISE 정합). (LL-55) Sentry pre-integration fallback 명시 — v0.5 단계 console/server stdout only, M0 v1.0 LL-DEFER-18 합류 후 Sentry capture. **누계 55 findings 전건 수용**. |
docs/core/DATA_MODEL.md:23:- **SoT 원칙**: `ClinicProfile`은 브랜드·기관 정체성·메타 통계만, **위치·전화·시간은 `LocationProfile`이 마스터**.
docs/core/DATA_MODEL.md:55:| C-21 | `LocationProfile` | 지점 정체성 (위치·시간·연락 마스터) | L3 | Git | ✅ | P-012, P-014 |
docs/core/DATA_MODEL.md:63:| CT-01 | `TrustMetric` | 신뢰도·통계 지표 (기준·증빙 포함) | L1 정의 / L3 값 | ClinicProfile, LocationProfile, DoctorProfile |
docs/core/DATA_MODEL.md:64:| CT-02 | `BusinessHours` | 진료시간·접수시간·점심·휴진 | L1 정의 / L3 값 | LocationProfile |
docs/core/DATA_MODEL.md:65:| CT-03 | `CTAConfig` | 전환 채널 설정 | L1 정의 / L3 값 | ClinicProfile, LocationProfile, TreatmentPage |
docs/core/DATA_MODEL.md:104:- **LocationProfile**: 위치·전화·이메일·진료시간·예약 채널의 **마스터**. 단지점 인스턴스도 `LocationProfile(slug=main)` 1개 필수.
docs/core/DATA_MODEL.md:105:- ClinicProfile에 `mainAddress`/`mainTelephone`/`mainEmail`/`businessHours` 같은 필드 **없음**. 모든 위치·시간 정보는 LocationProfile 참조.
docs/core/DATA_MODEL.md:196:| `type` | `enum {phone, naver-reservation, naver-talk, kakao-talk, kakao-channel, form, map, external, sms, email, video-consultation}` | ✅ | 채널 종류 |
docs/core/DATA_MODEL.md:207:> v0.5에서 추가했던 `isFeatured: boolean` 필드는 **v0.6에서 제거**. CTAConfig가 여러 컨테이너(ClinicProfile.primaryCtas / LocationProfile.reservationChannels / TreatmentPage.cta)에서 재사용될 가능성을 고려할 때, 객체 자체에 컨텍스트 의존 의미(강조 여부)를 두면 재사용 시 의도 누수 위험. 대신 **컨테이너 쪽에 `featuredChannelId: Slug`로 강조 표시** (LocationProfile § 4 참조). CTAConfig 객체는 컨텍스트 무관 데이터로 유지.
docs/core/DATA_MODEL.md:215:**v0.4 SoT 변경**: 위치·전화·시간 필드 **제거**. `locations[]` 통해 LocationProfile 참조.
docs/core/DATA_MODEL.md:404:| `cta` | `CTAConfig` | optional | 예약·문의 CTA (CT-03) |
docs/core/DATA_MODEL.md:459:| `slot` | `enum {overview, mechanism, targetAudience, recommendedFor, treatmentComponents, visitFlow, process, duration, sessionCount, programVariants, precautions, aftercare, maintenancePlan, evidenceNotes, cta}` | ✅ | |
docs/core/DATA_MODEL.md:585:| `adminBaseUrl` | `URL` | conditional | (v0.13 +) 본 인스턴스의 어드민(Control Plane) base URL — 알림 ctaUrl 합성 기준. `features.notifications` 활성 시 required (`features/notifications.md` § 3.3 ctaUrl 자동 합성) |
docs/core/DATA_MODEL.md:589:| `analyticsPolicyVersion` | `string` | conditional | (v0.14 +) `features.analytics-reporting` 매트릭스·정책 SoT 버전 (예: `"ar-2026-05-14"`). `features.analytics-reporting` 활성 시 required. notifications의 `notificationPolicyVersion` 패턴 동일 — 패키지가 버전별 병렬 보관 + manifest opt-in (`features/analytics-reporting.md` § 1.1·§ 4.2 동등) |
docs/core/DATA_MODEL.md:667:| `serpCrawler` | `{enabled: boolean, ...}` | optional | **v1.0: `enabled=true` → 빌드 fail (regardless of legalApproved)** — `features/keyword-monitoring.md` § 5.2 v1.0 미지원 정책 (KM2-01). v1.x 활성화 시 search-visibility SerpCrawlerApprovedScope 게이트 패턴 재사용 (KM-14 후속 결정 후). v1.0 manifest validator는 enabled=true 단독으로 fail 처리, legalApproved/승인자/시각 검증은 v1.x 활성 시점부터 적용 |
docs/core/DATA_MODEL.md:718:> 동작 옵션(`mode`·`syncSchedule`·`entities`·`fieldMappingPolicyVersion`·`retryQueue`·`credentialRotation`·`pii`·`retentionDays` 등)은 `features[name="crm-sync"].config` SoT (`features/crm-sync.md` § 2.3). **CrmCredentialVersion**(credential rotation 상태 머신·secretVersionId) 등 admin DB entity는 `features/crm-sync.md` § 13 SoT. manifest는 `apiKeySecretRef` 등 secretRef만 보유 — register/rotate 시 admin DB materialization (CS3-13).
docs/core/DATA_MODEL.md:769:| `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature}` | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1) |
docs/core/DATA_MODEL.md:846:**목적**: 개인정보처리방침·이용약관·비급여 진료 안내 등 법적 정책 문서. **M0 출시 게이트**. Core 표준 템플릿 + ClinicProfile + LocationProfile(main) 변수 자동 치환으로 생성. 법무 검토 필수 (ComplianceRecord.legalCounsel/legalCounselAt required).
docs/core/DATA_MODEL.md:862:| `contactPerson` | `string` | optional | 개인정보 보호 책임자 등 |
docs/core/DATA_MODEL.md:863:| `contactEmail` | `Email` | optional | 정책 문의 채널 |
docs/core/DATA_MODEL.md:878:### C-21. `LocationProfile` — 지점 정체성 (위치·시간·연락 마스터)
docs/core/DATA_MODEL.md:909:> - **v0.6 (현재)**: `LocationProfile.featuredChannelId: Slug` — **컨테이너에 두기**. CTAConfig는 컨텍스트 무관 데이터로 유지. reservationChannels[] 중 1개 채널의 @id 참조
docs/core/DATA_MODEL.md:911:> **단지점 자동 생성 규칙** (PAGE_TYPES.md § 3 P-014 참조): 어드민이 ClinicProfile 입력 단계의 위치·연락·시간 입력값으로부터 `LocationProfile(slug=main)`을 자동 생성. M0에 별도 화면 추가 없음.
docs/core/DATA_MODEL.md:1011:   └─ locations → LocationProfile[] (C-21)  ⭐ 필수 1개+
docs/core/DATA_MODEL.md:1013:LocationProfile (C-21) — 위치·시간·연락 SoT
docs/core/DATA_MODEL.md:1022:   ├─ primaryLocation → LocationProfile (C-21)
docs/core/DATA_MODEL.md:1023:   ├─ additionalLocations → LocationProfile[]
docs/core/DATA_MODEL.md:1027:   ├─ cta → CTAConfig (CT-03)
docs/core/DATA_MODEL.md:1070:| DM-12 | ~~LocationProfile SoT~~ | **v0.4 해소** — ClinicProfile에 위치·시간·연락 필드 제거. LocationProfile만 마스터 |
docs/core/DATA_MODEL.md:1075:| DM-17 | LocationProfile main 자동 생성의 어드민 입력 단계 | admin/ARCHITECTURE.md |
docs/core/DATA_MODEL.md:1088:| 2026-05-14 | v0.4 | **피드백 적용**: (1) **전체 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, (2) **SoT 정리** — ClinicProfile에서 mainAddress·mainTelephone·mainEmail·businessHours 제거. LocationProfile만 위치·시간·연락 마스터 (DM-12 해소), (3) **TreatmentPage 컨텍스트 필드 즉시 통합** — recommendedFor·treatmentComponents·visitFlow·programVariants·maintenancePlan·remoteCareAvailable·evidenceNotes (1호 다이어트 한의원 직결), (4) **Article 컨텍스트 필드 즉시 통합** — authorType·reviewedBy·reviewedAt·contentSource·externalUrl (E-E-A-T 강화), (5) **RiskLevel 직접 enum 사용** — `Ref<C-05>` 표기 전면 제거, (6) TreatmentComponent·VisitFlowStep·EvidenceNote 하위 타입 신설, (7) DM-18·DM-19 신규 |
docs/core/DATA_MODEL.md:1089:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
docs/core/DATA_MODEL.md:1090:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
docs/core/DATA_MODEL.md:1098:| 2026-05-14 | v0.20 | **`features/crm-sync.md` 3차·5차 사이클 cascade (CS3-13·CS5-01)**: (1) CrmIntegrationEntry에 `genericRestApiAdapter` 필드 추가 — provider=generic-rest-api 시 required. **5필드** (webhookSignatureHeader·webhookTimestampHeader·webhookEventIdHeader·canonicalStringFormat·`versionTokenJsonPath`) + `versionTokenType` enum, (2) manifest(secretRef) vs admin DB(`CrmCredentialVersion` — secretVersionId·rotation state) 경계 명시 |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 2437ms:
packages\storage\src\errors.ts
apps\spike-d\src\errors.ts
apps\spike-c-local\src\errors.ts
apps\spike-e\src\errors.ts
apps\spike-a\src\errors.ts
apps\spike-b\src\errors.ts
apps\web\src\lib\errors.ts
packages\notifications-outbox\src\errors.ts
packages\core-content\migrations\C0005_article.sql
packages\core-content\migrations\C0004_treatment_page.sql
packages\core-content\migrations\C0002_location_profile.sql
packages\core-content\migrations\C0001_clinic_profile.sql
packages\db\src\errors.ts
packages\auth\src\errors.ts
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 2484ms:
packages\core-content\src\schema.ts:88:    phone: text("phone"),
packages\auth\src\audit.ts:3:import type postgres from "postgres";
packages\auth\src\audit.ts:16:  sqlOrTx: postgres.Sql | postgres.TransactionSql,
packages\auth\src\session.ts:5:import type postgres from "postgres";
packages\auth\src\session.ts:46:  sql: postgres.Sql,
packages\auth\src\session.ts:62:  sql: postgres.Sql,
packages\auth\src\session.ts:80:export async function refreshSession(sql: postgres.Sql, cfg: AuthConfig, signedToken: string): Promise<void> {
packages\auth\src\session.ts:87:export async function revokeSession(sql: postgres.Sql, cfg: AuthConfig, signedToken: string): Promise<void> {
packages\auth\src\session.ts:95:  sql: postgres.Sql,
apps\spike-a\src\tenant.ts:10:import type { PostgresJsTransaction } from "drizzle-orm/postgres-js";
apps\spike-a\src\service-role.ts:153:// 그러나 service-role connection은 BYPASSRLS=true (postgres super-user) 또는 service-role role
apps\spike-a\src\service-role.ts:154:// 본 prototype은 postgres super-user를 service-role로 사용 — outcome update 허용
packages\auth\src\resolve-tenant-context.ts:4:import type postgres from "postgres";
packages\auth\src\resolve-tenant-context.ts:43:  sql: postgres.Sql,
packages\auth\src\resolve-tenant-context.ts:177:  sql: postgres.Sql,
packages\auth\src\resolve-tenant-context.ts:181:  fn: (tx: postgres.TransactionSql, ctx: TenantContext) => Promise<T>,
packages\db\src\tenant.ts:4:import type postgres from "postgres";
packages\db\src\tenant.ts:14: * postgres-js의 TransactionSql에 runtime symbol property로 brand·외부에서 SET LOCAL 우회 차단.
packages\db\src\tenant.ts:16:export type ScopedTx = postgres.TransactionSql & { [SCOPED_BRAND]: true };
packages\db\src\tenant.ts:40:  sql: postgres.Sql,
apps\spike-b\src\tenant.ts:4:import type { PostgresJsTransaction } from "drizzle-orm/postgres-js";
packages\auth\src\magic-link.ts:5:import type postgres from "postgres";
packages\auth\src\magic-link.ts:40:  sql: postgres.Sql,
packages\auth\src\magic-link.ts:61:export async function consumeMagicLink(sql: postgres.Sql, identifier: string, tokenPlain: string): Promise<string> {
packages\db\src\service-role.ts:6:import type postgres from "postgres";
packages\db\src\service-role.ts:14:export type ServiceRoleTx = postgres.TransactionSql & { [SERVICE_ROLE_BRAND]: true };
packages\db\src\service-role.ts:42: *   3) sql.begin → SET LOCAL ROLE postgres·branded tx → fn(tx)
packages\db\src\service-role.ts:46:  sql: postgres.Sql,
packages\db\src\service-role.ts:78:      await tx`SET LOCAL ROLE postgres`;
packages\db\src\advisory-lock.ts:4:import type postgres from "postgres";
packages\db\src\advisory-lock.ts:8:export async function tryAcquire(sql: postgres.Sql, lockKey: bigint | string): Promise<boolean> {
packages\db\src\advisory-lock.ts:14:export async function release(sql: postgres.Sql, lockKey: bigint | string): Promise<boolean> {
packages\db\src\advisory-lock.ts:26:  sql: postgres.Sql,
packages\auth\src\internal\session-internal.ts:5:import type postgres from "postgres";
packages\auth\src\internal\session-internal.ts:11:export async function refreshSessionByDbToken(sql: postgres.Sql, cfg: AuthConfig, dbSessionToken: string): Promise<void> {
packages\auth\src\internal\session-internal.ts:19:export async function revokeSessionByDbToken(sql: postgres.Sql, dbSessionToken: string): Promise<void> {
packages\auth\src\internal\session-internal.ts:24:  sql: postgres.Sql,
apps\spike-e\src\session.ts:6:import postgres from "postgres";
apps\spike-e\src\session.ts:42:export async function createSession(sql: postgres.Sql, userId: string): Promise<{ signedToken: string; row: SessionRow }> {
apps\spike-e\src\session.ts:54:export async function getActiveSession(sql: postgres.Sql, signedToken: string): Promise<SessionRow> {
apps\spike-e\src\session.ts:68:export async function refreshSession(sql: postgres.Sql, sessionToken: string): Promise<void> {
apps\spike-e\src\session.ts:77:export async function revokeSession(sql: postgres.Sql, sessionToken: string): Promise<void> {
apps\spike-e\src\session.ts:86:  sql: postgres.Sql,
apps\web\src\seed.ts:10:import postgres from "postgres";
apps\web\src\seed.ts:62:  const sql = postgres(url, { max: 1, onnotice: () => {} });
apps\web\src\seed.ts:67:    // postgres library template parameter 는 number/string 만 — bigint 대신 정수 사용
apps\spike-e\src\seed.ts:8:import postgres from "postgres";
apps\spike-e\src\seed.ts:14:  const sql = postgres(env.DATABASE_URL, { max: 1, prepare: false });
apps\spike-d\src\scenarios\test-staging-apply.ts:3:import postgres from "postgres";
apps\spike-d\src\scenarios\test-staging-apply.ts:10:  const sql = postgres(url, { max: 1, prepare: false });
apps\spike-d\src\scenarios\test-staging-apply.ts:34:  // Full snapshot diff (column·constraint·index·policy·view·enum definitions)
apps\spike-d\src\scenarios\test-staging-apply.ts:43:  console.log(`[staging-apply] full snapshot diff: 0 (tables=${devSnap.tables.length}, constraints=${devSnap.constraints.length}, indexes=${devSnap.indexes.length}, policies=${devSnap.policies.length}, views=${devSnap.views.length}, enums=${devSnap.enums.length})`);
packages\db\dist\tenant.d.ts:1:import type postgres from "postgres";
packages\db\dist\tenant.d.ts:6: * postgres-js의 TransactionSql에 runtime symbol property로 brand·외부에서 SET LOCAL 우회 차단.
packages\db\dist\tenant.d.ts:8:export type ScopedTx = postgres.TransactionSql & {
packages\db\dist\tenant.d.ts:29:export declare function withTenantTransaction<T>(sql: postgres.Sql, opts: TenantTxOptions, fn: (tx: ScopedTx) => Promise<T>): Promise<T>;
apps\spike-d\src\scenarios\test-forward-only-hotfix.ts:3:import postgres from "postgres";
apps\spike-d\src\scenarios\test-forward-only-hotfix.ts:34:  const cleanSql = postgres(env.DATABASE_URL_DEV, { max: 1, prepare: false });
apps\spike-d\src\scenarios\test-forward-only-hotfix.ts:36:    await cleanSql`DROP TABLE IF EXISTS migration_ledger, audit_event, audit_log, instance_user, content_test CASCADE`;
apps\spike-d\src\scenarios\test-forward-only-hotfix.ts:37:    await cleanSql`DROP TYPE IF EXISTS content_status CASCADE`;
apps\spike-d\src\scenarios\test-forward-only-hotfix.ts:38:    await cleanSql`DROP VIEW IF EXISTS tenant_audit_log_view CASCADE`;
apps\spike-d\src\scenarios\test-forward-only-hotfix.ts:40:    await cleanSql.end({ timeout: 5 });
apps\spike-d\src\scenarios\test-forward-only-hotfix.ts:45:  const setupSql = postgres(env.DATABASE_URL_DEV, { max: 1, prepare: false });
apps\spike-d\src\scenarios\test-forward-only-hotfix.ts:47:    await setupSql`ALTER TABLE content_test ADD COLUMN IF NOT EXISTS legacy_drop_target TEXT`;
apps\spike-d\src\scenarios\test-forward-only-hotfix.ts:49:    await setupSql.end({ timeout: 5 });
apps\spike-d\src\scenarios\test-forward-only-hotfix.ts:88:    const verifySql = postgres(env.DATABASE_URL_DEV, { max: 1, prepare: false });
apps\spike-d\src\scenarios\test-forward-only-hotfix.ts:90:      const cols = await verifySql<{ column_name: string }[]>`
apps\spike-d\src\scenarios\test-forward-only-hotfix.ts:96:      await verifySql.end({ timeout: 5 });
packages\core-content\migrations\C0002_location_profile.sql:18:  phone TEXT,
packages\db\dist\service-role.d.ts:1:import type postgres from "postgres";
packages\db\dist\service-role.d.ts:4:export type ServiceRoleTx = postgres.TransactionSql & {
packages\db\dist\service-role.d.ts:19: *   3) sql.begin → SET LOCAL ROLE postgres·branded tx → fn(tx)
packages\db\dist\service-role.d.ts:22:export declare function withServiceRole<T>(sql: postgres.Sql, ctx: ServiceRoleContext, allowedFunctions: ReadonlyArray<ServiceRoleFunction>, fn: (tx: ServiceRoleTx) => Promise<T>): Promise<T>;
apps\spike-d\src\scenarios\test-failure-rollback.ts:3:import postgres from "postgres";
apps\spike-d\src\scenarios\test-failure-rollback.ts:16:  const sql = postgres(env.DATABASE_URL_DEV, { max: 1, prepare: false });
apps\spike-d\src\scenarios\test-failure-rollback.ts:58:  const verifySql = postgres(env.DATABASE_URL_DEV, { max: 1, prepare: false });
apps\spike-d\src\scenarios\test-failure-rollback.ts:60:    const tableExists = await verifySql<{ exists: boolean }[]>`
apps\spike-d\src\scenarios\test-failure-rollback.ts:66:    const ledgerHas098 = await verifySql<{ exists: boolean }[]>`
apps\spike-d\src\scenarios\test-failure-rollback.ts:73:    const ledgerCnt = await verifySql<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM migration_ledger`;
apps\spike-d\src\scenarios\test-failure-rollback.ts:78:    const auditHas098 = await verifySql<{ exists: boolean }[]>`
apps\spike-d\src\scenarios\test-failure-rollback.ts:84:    await verifySql.end({ timeout: 5 });
apps\spike-d\src\scenarios\test-failure-rollback.ts:99:  const sql2 = postgres(env.DATABASE_URL_DEV, { max: 1, prepare: false });
apps\spike-d\src\scenarios\test-expand-contract.ts:3:import postgres from "postgres";
apps\spike-d\src\scenarios\test-expand-contract.ts:11:  const sql = postgres(env.DATABASE_URL_DEV, { max: 1, prepare: false });
apps\spike-d\src\scenarios\test-expand-contract.ts:26:  sql: postgres.Sql,
apps\spike-d\src\scenarios\test-expand-contract.ts:28:  fn: (tx: postgres.TransactionSql) => Promise<T>,
apps\spike-d\src\scenarios\test-expand-contract.ts:45:  const sql = postgres(env.DATABASE_URL_DEV, { max: 2, prepare: false });
apps\spike-d\src\scenarios\test-expand-contract.ts:79:    // === Phase 4: 010 CHECK constraint ===
apps\spike-d\src\scenarios\test-drift-check.ts:4:import postgres from "postgres";
apps\spike-d\src\scenarios\test-drift-check.ts:13:  const sql = postgres(url, { max: 1, prepare: false });
apps\spike-d\src\scenarios\test-drift-check.ts:33:  const prodSql = postgres(env.DATABASE_URL_PROD, { max: 1, prepare: false });
apps\spike-d\src\scenarios\test-drift-check.ts:35:    await prodSql`ALTER TABLE content_test ADD COLUMN extra_drift_column TEXT`;
apps\spike-d\src\scenarios\test-drift-check.ts:37:    await prodSql.end({ timeout: 5 });
apps\spike-d\src\scenarios\test-drift-check.ts:57:  const revertSql = postgres(env.DATABASE_URL_PROD, { max: 1, prepare: false });
apps\spike-d\src\scenarios\test-drift-check.ts:59:    await revertSql`ALTER TABLE content_test DROP COLUMN extra_drift_column`;
apps\spike-d\src\scenarios\test-drift-check.ts:61:    await revertSql.end({ timeout: 5 });
apps\spike-d\src\scenarios\test-drift-check.ts:67:  const idxSql = postgres(env.DATABASE_URL_PROD, { max: 1, prepare: false });
apps\spike-d\src\scenarios\test-drift-check.ts:69:    await idxSql`CREATE INDEX content_test_drift_idx ON content_test (title)`;
apps\spike-d\src\scenarios\test-drift-check.ts:71:    await idxSql.end({ timeout: 5 });
apps\spike-d\src\scenarios\test-drift-check.ts:83:  const cleanSql = postgres(env.DATABASE_URL_PROD, { max: 1, prepare: false });
apps\spike-d\src\scenarios\test-drift-check.ts:85:    await cleanSql`DROP INDEX content_test_drift_idx`;
apps\spike-d\src\scenarios\test-drift-check.ts:87:    await cleanSql.end({ timeout: 5 });
apps\spike-d\src\scenarios\test-drift-check.ts:91:  const polSql = postgres(env.DATABASE_URL_PROD, { max: 1, prepare: false });
apps\spike-d\src\scenarios\test-drift-check.ts:93:    await polSql`CREATE POLICY extra_drift_policy ON content_test FOR SELECT TO app_tenant_user USING (true)`;
apps\spike-d\src\scenarios\test-drift-check.ts:95:    await polSql.end({ timeout: 5 });
apps\spike-b\src\scenarios\provider-smoke.ts:4:import postgres from "postgres";
apps\spike-b\src\scenarios\provider-smoke.ts:18:async function seed(sql: postgres.Sql): Promise<void> {
apps\spike-b\src\scenarios\provider-smoke.ts:29:async function worker(sql: postgres.Sql, workerId: number): Promise<{ processed: number; errors: number }> {
apps\spike-b\src\scenarios\provider-smoke.ts:62:  const sup = postgres(SUPER, { max: 2, prepare: false });
apps\spike-b\src\scenarios\provider-smoke.ts:63:  const tenant = postgres(TENANT, { max: MAX_CONN, prepare: PREPARE });
packages\db\dist\advisory-lock.d.ts:1:import type postgres from "postgres";
packages\db\dist\advisory-lock.d.ts:2:export declare function tryAcquire(sql: postgres.Sql, lockKey: bigint | string): Promise<boolean>;
packages\db\dist\advisory-lock.d.ts:3:export declare function release(sql: postgres.Sql, lockKey: bigint | string): Promise<boolean>;
packages\db\dist\advisory-lock.d.ts:9:export declare function withAdvisoryLock<T>(sql: postgres.Sql, lockKey: bigint | string, fn: () => Promise<T>): Promise<T>;
apps\spike-a\src\scenarios\provider-smoke.ts:5:import postgres from "postgres";
apps\spike-a\src\scenarios\provider-smoke.ts:22:async function withTenantTx<T>(sql: postgres.Sql, instanceId: string, fn: (tx: postgres.TransactionSql) => Promise<T>): Promise<T> {
apps\spike-a\src\scenarios\provider-smoke.ts:32:  const tenant = postgres(TENANT, { max: MAX_CONN, prepare: PREPARE });
apps\spike-a\src\scenarios\provider-smoke.ts:33:  const sup = postgres(SUPER, { max: 2, prepare: false });
apps\spike-a\src\scenarios\provider-smoke.ts:77:    const c1 = postgres(SUPER, { max: 1, prepare: false });
apps\spike-a\src\scenarios\provider-smoke.ts:78:    const c2 = postgres(SUPER, { max: 1, prepare: false });
apps\spike-d\src\scenarios\test-dev-apply.ts:4:import postgres from "postgres";
apps\spike-d\src\scenarios\test-dev-apply.ts:11:  const sql = postgres(env.DATABASE_URL_DEV, { max: 1, prepare: false });
apps\spike-b\src\outbox.ts:10:import type { Sql } from "postgres";
apps\spike-a\src\migrate.ts:1:// Spike A — migration runner (raw SQL, postgres super-user)
apps\spike-d\src\scenarios\test-deploy-gate.ts:3:import postgres from "postgres";
apps\spike-d\src\scenarios\test-deploy-gate.ts:10:  const sql = postgres(url, { max: 1, prepare: false });
apps\spike-d\src\scenarios\test-deploy-gate.ts:40:  const driftSql = postgres(env.DATABASE_URL_PROD, { max: 1, prepare: false });
apps\spike-d\src\scenarios\test-deploy-gate.ts:42:    await driftSql`ALTER TABLE content_test ADD COLUMN ext_drift TEXT`;
apps\spike-d\src\scenarios\test-deploy-gate.ts:44:    await driftSql.end({ timeout: 5 });
apps\spike-d\src\scenarios\test-deploy-gate.ts:57:  const revertSql = postgres(env.DATABASE_URL_PROD, { max: 1, prepare: false });
apps\spike-d\src\scenarios\test-deploy-gate.ts:59:    await revertSql`ALTER TABLE content_test DROP COLUMN ext_drift`;
apps\spike-d\src\scenarios\test-deploy-gate.ts:61:    await revertSql.end({ timeout: 5 });
apps\spike-d\src\scenarios\test-deploy-gate.ts:64:  // Case 3: CHECK constraint drift (definition-aware)
apps\spike-d\src\scenarios\test-deploy-gate.ts:65:  const ckSql = postgres(env.DATABASE_URL_PROD, { max: 1, prepare: false });
apps\spike-d\src\scenarios\test-deploy-gate.ts:67:    await ckSql`ALTER TABLE content_test DROP CONSTRAINT content_test_slug_regex`;
apps\spike-d\src\scenarios\test-deploy-gate.ts:68:    await ckSql`ALTER TABLE content_test ADD CONSTRAINT content_test_slug_regex CHECK (slug ~ '^[a-z]')`; // 다른 regex
apps\spike-d\src\scenarios\test-deploy-gate.ts:70:    await ckSql.end({ timeout: 5 });
apps\spike-d\src\scenarios\test-deploy-gate.ts:78:  if (!checkDriftDetected) throw new Error("[deploy-gate] case-3 should detect CHECK constraint definition drift");
apps\spike-d\src\scenarios\test-deploy-gate.ts:79:  console.log("[deploy-gate] case-3 CHECK constraint definition drift → deploy ABORTED (PASS)");
apps\spike-d\src\scenarios\test-deploy-gate.ts:82:  const ckRevert = postgres(env.DATABASE_URL_PROD, { max: 1, prepare: false });
apps\spike-d\src\scenarios\test-deploy-gate.ts:91:  const polSql = postgres(env.DATABASE_URL_PROD, { max: 1, prepare: false });
apps\spike-d\src\scenarios\test-deploy-gate.ts:93:    await polSql`DROP POLICY tenant_isolation ON content_test`;
apps\spike-d\src\scenarios\test-deploy-gate.ts:94:    await polSql`CREATE POLICY tenant_isolation ON content_test FOR ALL TO app_tenant_user USING (true) WITH CHECK (true)`;
apps\spike-d\src\scenarios\test-deploy-gate.ts:96:    await polSql.end({ timeout: 5 });
apps\spike-d\src\scenarios\test-deploy-gate.ts:108:  const polRevert = postgres(env.DATABASE_URL_PROD, { max: 1, prepare: false });
apps\spike-d\src\scenarios\test-deploy-gate.ts:117:  const viewSql = postgres(env.DATABASE_URL_PROD, { max: 1, prepare: false });
apps\spike-d\src\scenarios\test-deploy-gate.ts:119:    await viewSql`DROP VIEW tenant_audit_log_view`;
apps\spike-d\src\scenarios\test-deploy-gate.ts:121:    await viewSql`CREATE VIEW tenant_audit_log_view AS SELECT id, instance_id, actor_id, actor_role, action, content_ref, occurred_at FROM audit_log WHERE instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid`;
apps\spike-d\src\scenarios\test-deploy-gate.ts:122:    await viewSql`GRANT SELECT ON tenant_audit_log_view TO app_tenant_user`;
apps\spike-d\src\scenarios\test-deploy-gate.ts:124:    await viewSql.end({ timeout: 5 });
apps\spike-b\src\db.ts:3:import postgres from "postgres";
apps\spike-b\src\db.ts:4:import { drizzle } from "drizzle-orm/postgres-js";
apps\spike-b\src\db.ts:22:export const sqlSuper = postgres(requireEnv("DATABASE_URL_SUPER"), { max: 8, ...commonOptions });
apps\spike-b\src\db.ts:26:export const sqlTenant = postgres(requireEnv("DATABASE_URL_TENANT"), { max: 30, ...commonOptions });
packages\auth\dist\session.d.ts:1:import type postgres from "postgres";
packages\auth\dist\session.d.ts:10:export declare function createSession(sql: postgres.Sql, cfg: AuthConfig, userId: string): Promise<{
packages\auth\dist\session.d.ts:14:export declare function getActiveSession(sql: postgres.Sql, cfg: AuthConfig, signedToken: string): Promise<SessionRow>;
packages\auth\dist\session.d.ts:16:export declare function refreshSession(sql: postgres.Sql, cfg: AuthConfig, signedToken: string): Promise<void>;
packages\auth\dist\session.d.ts:18:export declare function revokeSession(sql: postgres.Sql, cfg: AuthConfig, signedToken: string): Promise<void>;
packages\auth\dist\session.d.ts:20:export declare function switchSuperAdminInstance(sql: postgres.Sql, cfg: AuthConfig, signedToken: string, actorUserId: string, toInstanceId: string): Promise<{
apps\spike-d\src\scenarios\test-canonical-generation.ts:101:  dialect: "postgresql",
packages\auth\dist\resolve-tenant-context.d.ts:1:import type postgres from "postgres";
packages\auth\dist\resolve-tenant-context.d.ts:22:export declare function resolveTenantContext(sql: postgres.Sql, cfg: AuthConfig, signedToken: string, requestedInstanceId: string): Promise<TenantContext>;
packages\auth\dist\resolve-tenant-context.d.ts:26:export declare function withResolvedTenantTransaction<T>(sql: postgres.Sql, cfg: AuthConfig, signedToken: string, requestedInstanceId: string, fn: (tx: postgres.TransactionSql, ctx: TenantContext) => Promise<T>): Promise<{
apps\web\src\lib\tenant.ts:8:import { getSqlBase } from "./db";
apps\web\src\lib\tenant.ts:20:  const sql = getSqlBase();
apps\spike-a\src\db.ts:3:import postgres from "postgres";
apps\spike-a\src\db.ts:4:import { drizzle } from "drizzle-orm/postgres-js";
apps\spike-a\src\db.ts:23:export const sqlSuper = postgres(requireEnv("DATABASE_URL_SUPER"), { max: 4, ...commonOptions });
apps\spike-a\src\db.ts:27:export const sqlTenant = postgres(requireEnv("DATABASE_URL_TENANT"), { max: 30, ...commonOptions });
apps\spike-a\src\db.ts:30:// service-role (postgres direct, RLS bypass)
apps\spike-a\src\db.ts:31:export const sqlServiceRole = postgres(requireEnv("DATABASE_URL_SERVICE_ROLE"), { max: 4, ...commonOptions });
packages\core-content\dist\schema.d.ts:599:        phone: import("drizzle-orm/pg-core").PgColumn<{
packages\core-content\dist\schema.d.ts:600:            name: "phone";
apps\web\src\lib\slug-resolver.ts:5:import type postgres from "postgres";
apps\web\src\lib\slug-resolver.ts:12:async function emitBestEffort(sqlBase: postgres.Sql, input: Parameters<typeof emitAuditEvent>[1]): Promise<void> {
apps\web\src\lib\slug-resolver.ts:21:  sqlBase: postgres.Sql,
apps\spike-d\src\scenarios\test-audit.ts:3:import postgres from "postgres";
apps\spike-d\src\scenarios\test-audit.ts:10:  const cleanSql = postgres(env.DATABASE_URL_DEV, { max: 1, prepare: false });
apps\spike-d\src\scenarios\test-audit.ts:12:    await cleanSql`DROP TABLE IF EXISTS migration_ledger, audit_event, audit_log, instance_user, content_test CASCADE`;
apps\spike-d\src\scenarios\test-audit.ts:13:    await cleanSql`DROP TYPE IF EXISTS content_status CASCADE`;
apps\spike-d\src\scenarios\test-audit.ts:14:    await cleanSql`DROP VIEW IF EXISTS tenant_audit_log_view CASCADE`;
apps\spike-d\src\scenarios\test-audit.ts:16:    await cleanSql.end({ timeout: 5 });
apps\spike-d\src\scenarios\test-audit.ts:22:  const audSql = postgres(env.DATABASE_URL_DEV, { max: 1, prepare: false });
apps\spike-d\src\scenarios\test-audit.ts:25:    const cnt = await audSql<{ count: number }[]>`
apps\spike-d\src\scenarios\test-audit.ts:35:    const auditRows = await audSql<{ payload: { migrationId: number; filename: string; checksum: string } }[]>`
apps\spike-d\src\scenarios\test-audit.ts:49:    const fns = await audSql<{ service_role_function: string; count: number }[]>`
apps\spike-d\src\scenarios\test-audit.ts:68:    const ledgerCnt = await audSql<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM migration_ledger`;
apps\spike-d\src\scenarios\test-audit.ts:74:    await audSql.end({ timeout: 5 });
apps\spike-e\src\db\client.ts:1:// Spike E — postgres + drizzle client factory
apps\spike-e\src\db\client.ts:3:import postgres from "postgres";
apps\spike-e\src\db\client.ts:4:import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
apps\spike-e\src\db\client.ts:9:  readonly sql: ReturnType<typeof postgres>;
apps\spike-e\src\db\client.ts:15:  const sql = postgres(env.DATABASE_URL, { max: 4, prepare: false });
packages\auth\dist\magic-link.d.ts:1:import type postgres from "postgres";
packages\auth\dist\magic-link.d.ts:15:export declare function issueMagicLink(sql: postgres.Sql, cfg: AuthConfig, identifier: string): Promise<MagicLinkIssued>;
packages\auth\dist\magic-link.d.ts:19:export declare function consumeMagicLink(sql: postgres.Sql, identifier: string, tokenPlain: string): Promise<string>;
apps\spike-d\src\scenarios\test-advisory-lock.ts:3:import postgres from "postgres";
apps\spike-d\src\scenarios\test-advisory-lock.ts:10:  const sql = postgres(env.DATABASE_URL_DEV, { max: 1, prepare: false });
apps\spike-d\src\scenarios\test-advisory-lock.ts:45:  const verifySql = postgres(env.DATABASE_URL_DEV, { max: 1, prepare: false });
apps\spike-d\src\scenarios\test-advisory-lock.ts:47:    const cnt = await verifySql<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM migration_ledger`;
apps\spike-d\src\scenarios\test-advisory-lock.ts:54:    await verifySql.end({ timeout: 5 });
apps\spike-d\src\scenarios\test-advisory-lock.ts:60:  const holder = postgres(env.DATABASE_URL_DEV, { max: 1, prepare: false });
apps\spike-e\src\audit.ts:3:import postgres from "postgres";
apps\spike-e\src\audit.ts:16:  sqlOrTx: postgres.Sql | postgres.TransactionSql,
apps\spike-d\src\migrate.ts:10:import postgres from "postgres";
apps\spike-d\src\migrate.ts:63:async function tryAcquireAdvisoryLock(sql: postgres.Sql): Promise<boolean> {
apps\spike-d\src\migrate.ts:70:async function releaseAdvisoryLock(sql: postgres.Sql): Promise<boolean> {
apps\spike-d\src\migrate.ts:81:async function ensureLedger(sql: postgres.Sql): Promise<void> {
apps\spike-d\src\migrate.ts:101:async function ensureAuditEvent(sql: postgres.Sql): Promise<void> {
apps\spike-d\src\migrate.ts:118:async function getAppliedLedger(sql: postgres.Sql): Promise<Map<number, { filename: string; checksum: string }>> {
apps\spike-d\src\migrate.ts:153:  const sql = postgres(url, { max: 1, prepare: false });
apps\spike-d\src\migrate.ts:236:async function tryAcquireDeployLock(sql: postgres.Sql): Promise<boolean> {
apps\spike-d\src\migrate.ts:243:async function releaseDeployLock(sql: postgres.Sql): Promise<void> {
apps\spike-d\src\migrate.ts:249:  const sql = postgres(url, { max: 1, prepare: false });
apps\spike-d\src\migrate.ts:270:  const sql = postgres(getDatabaseUrl("shadow"), { max: 1, prepare: false });
apps\spike-d\src\migrate.ts:274:    await sql`GRANT ALL ON SCHEMA public TO postgres`;
apps\spike-d\src\migrate.ts:299:  const coordSql = postgres(getDatabaseUrl("shadow"), { max: 1, prepare: false });
apps\spike-d\src\migrate.ts:302:    coordHeld = await tryAcquireDeployLock(coordSql);
apps\spike-d\src\migrate.ts:318:      const tgtSql = postgres(getDatabaseUrl(opts.target), { max: 1, prepare: false });
apps\spike-d\src\migrate.ts:321:        const counts = await tgtSql<{ obj_type: string; count: number }[]>`
apps\spike-d\src\migrate.ts:350:        await tgtSql.end({ timeout: 5 });
apps\spike-d\src\migrate.ts:394:      try { await releaseDeployLock(coordSql); } catch { /* best-effort */ }
apps\spike-d\src\migrate.ts:396:    await coordSql.end({ timeout: 5 });
apps\spike-d\src\migrate.ts:412:      const sql = postgres(url, { max: 1, prepare: false });
apps\spike-e\src\scenarios\test-tenant-resolve-own.ts:2:import postgres from "postgres";
apps\spike-e\src\scenarios\test-tenant-resolve-own.ts:9:  const sql = postgres(env.DATABASE_URL, { max: 1, prepare: false });
apps\spike-e\src\scenarios\test-invalid-instance-id.ts:2:import postgres from "postgres";
apps\spike-e\src\scenarios\test-invalid-instance-id.ts:10:  const sql = postgres(env.DATABASE_URL, { max: 1, prepare: false });
apps\web\src\lib\post-login-redirect.ts:5:import type postgres from "postgres";
apps\web\src\lib\post-login-redirect.ts:15:  sqlBase: postgres.Sql,
apps\spike-e\src\scenarios\test-inactive-user.ts:2:import postgres from "postgres";
apps\spike-e\src\scenarios\test-inactive-user.ts:10:  const sql = postgres(env.DATABASE_URL, { max: 1, prepare: false });
apps\spike-e\src\scenarios\test-tenant-resolve-cross.ts:2:import postgres from "postgres";
apps\spike-e\src\scenarios\test-tenant-resolve-cross.ts:10:  const sql = postgres(env.DATABASE_URL, { max: 1, prepare: false });
apps\web\src\lib\page-context.ts:16:import { getSqlBase } from "./db";
apps\web\src\lib\page-context.ts:43:  const sqlBase = getSqlBase();
apps\spike-e\src\resolve-tenant-context.ts:9:import postgres from "postgres";
apps\spike-e\src\resolve-tenant-context.ts:58:  sql: postgres.Sql,
apps\spike-e\src\resolve-tenant-context.ts:186:  sql: postgres.Sql,
apps\spike-e\src\resolve-tenant-context.ts:189:  fn: (tx: postgres.TransactionSql, ctx: TenantContext) => Promise<T>,
apps\spike-e\src\scenarios\test-super-admin-switch.ts:4:import postgres from "postgres";
apps\spike-e\src\scenarios\test-super-admin-switch.ts:12:  const sql = postgres(env.DATABASE_URL, { max: 1, prepare: false });
apps\spike-e\src\scenarios\test-drizzle-adapter-smoke.ts:7:import postgres from "postgres";
apps\spike-e\src\scenarios\test-drizzle-adapter-smoke.ts:11:  const sql = postgres(env.DATABASE_URL, { max: 1, prepare: false });
apps\spike-e\src\scenarios\test-drizzle-adapter-smoke.ts:56:      FROM pg_constraint con
apps\spike-d\src\drift-check.ts:2:// SPIKED1-004 cycle2: pg_get_constraintdef·pg_get_indexdef·pg_policies.qual/with_check·pg_get_viewdef·enum labels 추가
apps\spike-d\src\drift-check.ts:5:import postgres from "postgres";
apps\spike-d\src\drift-check.ts:15:  readonly constraints: ReadonlyArray<{ table: string; name: string; type: string; definition: string }>;
apps\spike-d\src\drift-check.ts:23:  const sql = postgres(url, { max: 1, prepare: false });
apps\spike-d\src\drift-check.ts:44:    // Constraints with definition (pg_get_constraintdef)
apps\spike-d\src\drift-check.ts:45:    const constraints = await sql<{ table: string; name: string; type: string; definition: string }[]>`
apps\spike-d\src\drift-check.ts:50:        pg_get_constraintdef(con.oid, true) AS definition
apps\spike-d\src\drift-check.ts:51:      FROM pg_constraint con
apps\spike-d\src\drift-check.ts:112:    return { tables, constraints, indexes, policies, views, enums };
apps\spike-d\src\drift-check.ts:146:  const lC = new Map(left.constraints.map((c) => [`${c.table}.${c.name}`, c]));
apps\spike-d\src\drift-check.ts:147:  const rC = new Map(right.constraints.map((c) => [`${c.table}.${c.name}`, c]));
apps\spike-d\src\drift-check.ts:151:    if (!l) diffs.push(`+ constraint ${k}: ${r!.definition}`);
apps\spike-d\src\drift-check.ts:152:    else if (!r) diffs.push(`- constraint ${k}: ${l.definition}`);
apps\spike-d\src\drift-check.ts:153:    else if (l.definition !== r.definition) diffs.push(`~ constraint ${k} definition: ${l.definition} vs ${r.definition}`);
packages\auth\dist\internal\session-internal.d.ts:1:import type postgres from "postgres";
packages\auth\dist\internal\session-internal.d.ts:3:export declare function refreshSessionByDbToken(sql: postgres.Sql, cfg: AuthConfig, dbSessionToken: string): Promise<void>;
packages\auth\dist\internal\session-internal.d.ts:4:export declare function revokeSessionByDbToken(sql: postgres.Sql, dbSessionToken: string): Promise<void>;
packages\auth\dist\internal\session-internal.d.ts:5:export declare function switchSuperAdminInstanceByDbToken(sql: postgres.Sql, dbSessionToken: string, actorUserId: string, toInstanceId: string): Promise<{
apps\spike-e\src\migrate.ts:3:import postgres from "postgres";
apps\spike-e\src\migrate.ts:15:async function ensureLedger(sql: postgres.Sql): Promise<void> {
apps\spike-e\src\migrate.ts:27:  const sql = postgres(env.DATABASE_URL, { max: 1, prepare: false });
apps\web\src\lib\errors.ts:1:// @glitzy/web/lib/errors — DB constraint violation → field/form error mapping
apps\web\src\lib\errors.ts:2:// cycle1-3entity WEB-08: ClinicProfile + DoctorProfile + TreatmentPage + Article constraint 추가
apps\web\src\lib\errors.ts:8:// constraint_name → field + 한국어 메시지
apps\web\src\lib\errors.ts:43: * postgres-js error 의 `code` (SQLSTATE) 와 `constraint_name` 으로 field/form 매핑.
apps\web\src\lib\errors.ts:46:export function mapDbErrorToResult(err: unknown): DbErrorResult | null {
apps\web\src\lib\errors.ts:48:  const e = err as { code?: string; constraint_name?: string; constraint?: string };
apps\web\src\lib\errors.ts:50:  const constraint = e.constraint_name ?? e.constraint;
apps\web\src\lib\errors.ts:51:  if (!code || !constraint) return null;
apps\web\src\lib\errors.ts:54:  const mapping = CONSTRAINT_MAP[constraint];
apps\web\src\lib\errors.ts:60:  // unknown constraint — generic
apps\web\src\lib\errors.ts:69:  const result = mapDbErrorToResult(err);
apps\spike-e\src\scenarios\test-client-tampering.ts:2:import postgres from "postgres";
apps\spike-e\src\scenarios\test-client-tampering.ts:12:  const sql = postgres(env.DATABASE_URL, { max: 1, prepare: false });
apps\spike-e\src\scenarios\test-session-refresh.ts:2:import postgres from "postgres";
apps\spike-e\src\scenarios\test-session-refresh.ts:9:  const sql = postgres(env.DATABASE_URL, { max: 1, prepare: false });
apps\spike-e\src\magic-link.ts:7:import postgres from "postgres";
apps\spike-e\src\magic-link.ts:41:export async function issueMagicLink(sql: postgres.Sql, identifier: string): Promise<MagicLinkIssued> {
apps\spike-e\src\magic-link.ts:60:export async function consumeMagicLink(sql: postgres.Sql, identifier: string, tokenPlain: string): Promise<string> {
apps\spike-e\src\scenarios\test-rls-integration.ts:3:import postgres from "postgres";
apps\spike-e\src\scenarios\test-rls-integration.ts:10:  const sql = postgres(env.DATABASE_URL, { max: 4, prepare: false });
apps\spike-e\src\scenarios\test-action-eligibility.ts:2:import postgres from "postgres";
apps\spike-e\src\scenarios\test-action-eligibility.ts:17:  const sql = postgres(env.DATABASE_URL, { max: 1, prepare: false });
apps\spike-e\src\scenarios\test-membership-removal.ts:3:import postgres from "postgres";
apps\spike-e\src\scenarios\test-membership-removal.ts:11:  const sql = postgres(env.DATABASE_URL, { max: 1, prepare: false });
apps\spike-e\src\scenarios\test-membership-removal.ts:51:    // 5) restore (CHECK constraint 정합: active=true·deactivated_* NULL)
apps\web\src\lib\db.ts:1:// @glitzy/web/lib/db — postgres.Sql singleton (Plan v1.0 § 3 lib/db.ts)
apps\web\src\lib\db.ts:4:import postgres from "postgres";
apps\web\src\lib\db.ts:9:  var __glitzy_sql_base: postgres.Sql | undefined;
apps\web\src\lib\db.ts:13:let moduleSingleton: postgres.Sql | null = null;
apps\web\src\lib\db.ts:15:export function getSqlBase(): postgres.Sql {
apps\web\src\lib\db.ts:22:  const sql = postgres(env.WEB_DATABASE_URL, {
apps\spike-e\src\scenarios\test-magic-link-login.ts:2:import postgres from "postgres";
apps\spike-e\src\scenarios\test-magic-link-login.ts:10:  const sql = postgres(env.DATABASE_URL, { max: 1, prepare: false });
apps\spike-e\src\scenarios\test-invariant.ts:4:import postgres from "postgres";
apps\spike-e\src\scenarios\test-invariant.ts:17:  const sql = postgres(env.DATABASE_URL, { max: 1, prepare: false });
apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts:2:import postgres from "postgres";
apps\spike-e\src\scenarios\test-legal-reviewer-eligibility.ts:10:  const sql = postgres(env.DATABASE_URL, { max: 1, prepare: false });
packages\auth\dist\audit.d.ts:1:import type postgres from "postgres";
packages\auth\dist\audit.d.ts:11:export declare function emitAuditEvent(sqlOrTx: postgres.Sql | postgres.TransactionSql, input: AuditEventInput): Promise<void>;
apps\web\src\lib\action-context.ts:14:import { getSqlBase } from "./db";
apps\web\src\lib\action-context.ts:34:  const sqlBase = getSqlBase();
apps\spike-b\migrations\001_roles.sql:3:-- postgres super-user: control-plane (outbox·external_call_log·invariant_log)
apps\spike-d\src\db\schema.ts:2:// SPIKED1-006 cycle2: metadata JSONB·migration_ledger 전 필드·published_at·partial index·CHECK constraint 모두 반영
apps\spike-d\src\db\client.ts:1:// Spike D — postgres client factory
apps\spike-d\src\db\client.ts:3:import postgres from "postgres";
apps\spike-d\src\db\client.ts:4:import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
apps\spike-d\src\db\client.ts:9:  readonly sql: ReturnType<typeof postgres>;
apps\spike-d\src\db\client.ts:16:  const sql = postgres(url, { max: 4, prepare: false });
apps\web\scripts\local-pass.ts:7:import postgres from "postgres";
apps\web\scripts\local-pass.ts:28:  const sql = postgres(seedUrl, { max: 1, onnotice: () => {} });
apps\spike-d\drizzle.config.ts:5:  dialect: "postgresql",
apps\spike-d\drizzle.config.ts:9:    url: process.env.DATABASE_URL_DEV ?? "postgres://postgres:postgres@localhost:5437/spike_d_dev",
apps\web\src\app\sign-out\route.ts:13:import { getSqlBase } from "@/lib/db";
apps\web\src\app\sign-out\route.ts:24:  const sqlBase = getSqlBase();
packages\notifications-outbox\src\outbox.ts:6:import type postgres from "postgres";
packages\notifications-outbox\src\outbox.ts:34:export async function enqueue(sql: postgres.Sql, input: EnqueueInput): Promise<{ id: string }> {
packages\notifications-outbox\src\outbox.ts:43:    if (err instanceof Error && /outbox_idempotency|unique constraint/i.test(err.message)) {
packages\notifications-outbox\src\outbox.ts:53:export async function claim(sql: postgres.Sql, workerId: string): Promise<OutboxRow | null> {
packages\notifications-outbox\src\outbox.ts:83:export async function markCompleted(sql: postgres.Sql, outboxId: string, workerId: string): Promise<void> {
packages\notifications-outbox\src\outbox.ts:98:  sql: postgres.Sql,
packages\notifications-outbox\src\outbox.ts:121:  sql: postgres.Sql,
packages\notifications-outbox\src\outbox.ts:143:export async function reclaimStale(sql: postgres.Sql, staleAfterMs: number): Promise<number> {
apps\spike-d\migrations\002_content_test.sql:15:  -- CHECK constraints
packages\notifications-outbox\dist\outbox.d.ts:1:import type postgres from "postgres";
packages\notifications-outbox\dist\outbox.d.ts:23:export declare function enqueue(sql: postgres.Sql, input: EnqueueInput): Promise<{
packages\notifications-outbox\dist\outbox.d.ts:29:export declare function claim(sql: postgres.Sql, workerId: string): Promise<OutboxRow | null>;
packages\notifications-outbox\dist\outbox.d.ts:30:export declare function markCompleted(sql: postgres.Sql, outboxId: string, workerId: string): Promise<void>;
packages\notifications-outbox\dist\outbox.d.ts:35:export declare function markRetry(sql: postgres.Sql, outboxId: string, workerId: string, error: string, nextAttemptAt: Date): Promise<{
packages\notifications-outbox\dist\outbox.d.ts:38:export declare function markFailedPermanent(sql: postgres.Sql, outboxId: string, workerId: string, error: string): Promise<void>;
packages\notifications-outbox\dist\outbox.d.ts:43:export declare function reclaimStale(sql: postgres.Sql, staleAfterMs: number): Promise<number>;
apps\web\src\app\sign-in\actions.ts:12:import { getSqlBase } from "@/lib/db";
apps\web\src\app\sign-in\actions.ts:25:  const sqlBase = getSqlBase();
apps\web\src\app\api\health\route.ts:4:import { getSqlBase } from "@/lib/db";
apps\web\src\app\api\health\route.ts:10:    const sql = getSqlBase();
apps\web\src\app\(admin)\[instanceSlug]\articles\actions.ts:12:import { getSqlBase } from "@/lib/db";
apps\web\src\app\(admin)\[instanceSlug]\articles\actions.ts:15:import { mapDbErrorToResult } from "@/lib/errors";
apps\web\src\app\(admin)\[instanceSlug]\articles\actions.ts:96:  const sqlBase = getSqlBase();
apps\web\src\app\(admin)\[instanceSlug]\articles\actions.ts:207:    const mapped = mapDbErrorToResult(err);
apps\web\src\app\(admin)\[instanceSlug]\articles\actions.ts:227:  const sqlBase = getSqlBase();
apps\web\src\app\(admin)\[instanceSlug]\articles\actions.ts:270:    const mapped = mapDbErrorToResult(err);
apps\web\src\app\api\site-meta-fetch\route.ts:20:import { getSqlBase } from "@/lib/db";
apps\web\src\app\api\site-meta-fetch\route.ts:32:async function emitBestEffort(sqlBase: ReturnType<typeof getSqlBase>, input: Parameters<typeof emitAuditEvent>[1]): Promise<void> {
apps\web\src\app\api\site-meta-fetch\route.ts:71:  const sqlBase = getSqlBase();
apps\spike-d\migrations\007_tenant_audit_log_view.sql:4:-- security_invoker=on: caller의 RLS·permission 적용 (postgres 15+)
apps\web\src\app\(admin)\[instanceSlug]\doctors\actions.ts:7://   - WEB-08 errors.ts entity constraint mapping
apps\web\src\app\(admin)\[instanceSlug]\doctors\actions.ts:19:import { getSqlBase } from "@/lib/db";
apps\web\src\app\(admin)\[instanceSlug]\doctors\actions.ts:22:import { mapDbErrorToResult } from "@/lib/errors";
apps\web\src\app\(admin)\[instanceSlug]\doctors\actions.ts:99:  const sqlBase = getSqlBase();
apps\web\src\app\(admin)\[instanceSlug]\doctors\actions.ts:176:    const mapped = mapDbErrorToResult(err);
apps\web\src\app\(admin)\[instanceSlug]\doctors\actions.ts:198:  const sqlBase = getSqlBase();
apps\web\src\app\(admin)\[instanceSlug]\doctors\actions.ts:268:    const mapped = mapDbErrorToResult(err);
apps\web\src\app\(admin)\[instanceSlug]\treatments\actions.ts:13:import { getSqlBase } from "@/lib/db";
apps\web\src\app\(admin)\[instanceSlug]\treatments\actions.ts:16:import { mapDbErrorToResult } from "@/lib/errors";
apps\web\src\app\(admin)\[instanceSlug]\treatments\actions.ts:88:  const sqlBase = getSqlBase();
apps\web\src\app\(admin)\[instanceSlug]\treatments\actions.ts:170:    const mapped = mapDbErrorToResult(err);
apps\web\src\app\(admin)\[instanceSlug]\treatments\actions.ts:192:  const sqlBase = getSqlBase();
apps\web\src\app\(admin)\[instanceSlug]\treatments\actions.ts:234:    const mapped = mapDbErrorToResult(err);
apps\web\src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:18:import { getSqlBase } from "@/lib/db";
apps\web\src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:129:  const sqlBase = getSqlBase();
apps\web\src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:236:    // RLS WITH CHECK 위반 · CHECK constraint · unique violation 등
apps\web\src\app\sign-in\cleanup\route.ts:9:import { getSqlBase } from "@/lib/db";
apps\web\src\app\sign-in\cleanup\route.ts:30:      await emitAuditEvent(getSqlBase(), {
apps\web\src\app\sign-in\consume\route.ts:18:import { getSqlBase } from "@/lib/db";
apps\web\src\app\sign-in\consume\route.ts:28:async function emitBestEffort(sqlBase: ReturnType<typeof getSqlBase>, input: Parameters<typeof emitAuditEvent>[1]): Promise<void> {
apps\web\src\app\sign-in\consume\route.ts:42:  const sqlBase = getSqlBase();
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

codex
핵심 patch marker는 문서에 대체로 들어가 있습니다. 이제 라인 단위로 좁혀서 `errors.ts`, CT-03 SoT, cascade/defer 섹션, 그리고 placeholder 파일 존재 여부를 확인하겠습니다.
2026-05-16T06:31:14.011668Z ERROR codex_core::tools::router: error=`"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/LOCATION_LEGAL_PLAN.md'; "'$lines=Get-Content $p; foreach($i in 170..230){ if($i -le $lines.Length){ '"'{0}:{1}' -f "'$i,$lines[$i-1] } }'` rejected: blocked by policy
2026-05-16T06:31:14.011662Z ERROR codex_core::tools::router: error=`"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/LOCATION_LEGAL_PLAN.md'; "'$lines=Get-Content $p; foreach($i in 430..605){ if($i -le $lines.Length){ '"'{0}:{1}' -f "'$i,$lines[$i-1] } }'` rejected: blocked by policy
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/LOCATION_LEGAL_PLAN.md'; "'$lines=Get-Content $p; foreach($i in 430..605){ if($i -le $lines.Length){ '"'{0}:{1}' -f "'$i,$lines[$i-1] } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/LOCATION_LEGAL_PLAN.md'; "'$lines=Get-Content $p; foreach($i in 170..230){ if($i -le $lines.Length){ '"'{0}:{1}' -f "'$i,$lines[$i-1] } }' in C:\Users\assag\solution\website-exposure
 declined in 0ms:
`"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/LOCATION_LEGAL_PLAN.md'; "'$lines=Get-Content $p; foreach($i in 430..605){ if($i -le $lines.Length){ '"'{0}:{1}' -f "'$i,$lines[$i-1] } }'` rejected: blocked by policy
 declined in 0ms:
`"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/decisions/LOCATION_LEGAL_PLAN.md'; "'$lines=Get-Content $p; foreach($i in 170..230){ if($i -le $lines.Length){ '"'{0}:{1}' -f "'$i,$lines[$i-1] } }'` rejected: blocked by policy
2026-05-16T06:31:14.085369Z ERROR codex_core::tools::router: error=`"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'apps/web/src/lib/errors.ts'; "'$lines=Get-Content $p; foreach($i in 1..90){ if($i -le $lines.Length){ '"'{0}:{1}' -f "'$i,$lines[$i-1] } }'` rejected: blocked by policy
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'apps/web/src/lib/errors.ts'; "'$lines=Get-Content $p; foreach($i in 1..90){ if($i -le $lines.Length){ '"'{0}:{1}' -f "'$i,$lines[$i-1] } }' in C:\Users\assag\solution\website-exposure
 declined in 0ms:
`"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'apps/web/src/lib/errors.ts'; "'$lines=Get-Content $p; foreach($i in 1..90){ if($i -le $lines.Length){ '"'{0}:{1}' -f "'$i,$lines[$i-1] } }'` rejected: blocked by policy
2026-05-16T06:31:14.092147Z ERROR codex_core::tools::router: error=`"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/core/DATA_MODEL.md'; "'$lines=Get-Content $p; foreach($i in 188..205){ if($i -le $lines.Length){ '"'{0}:{1}' -f "'$i,$lines[$i-1] } }'` rejected: blocked by policy
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/core/DATA_MODEL.md'; "'$lines=Get-Content $p; foreach($i in 188..205){ if($i -le $lines.Length){ '"'{0}:{1}' -f "'$i,$lines[$i-1] } }' in C:\Users\assag\solution\website-exposure
 declined in 0ms:
`"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'docs/core/DATA_MODEL.md'; "'$lines=Get-Content $p; foreach($i in 188..205){ if($i -le $lines.Length){ '"'{0}:{1}' -f "'$i,$lines[$i-1] } }'` rejected: blocked by policy
codex
현재 셸 정책이 인라인 PowerShell 범위 출력은 막고 있어 `rg` 기반으로 필요한 라인만 다시 뽑겠습니다. 읽기 전용 검토라 파일 변경은 하지 않습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n -C 4 \"clinic_profile_primary_ctas_validate|CONSTRAINT = 'clinic_profile_primary_ctas_shape'|allowed_types|CREATE TRIGGER\" docs/decisions/LOCATION_LEGAL_PLAN.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n -C 3 "LL-FORM-08|phone|kakao-talk|naver-reservation|UI subset|LL-DEFER-19|LL-DEFER-20|M0 v1.0 본 구현|LL-CASCADE-04|LL-CASCADE-05|console.error|Sentry|stdout|9.3.1" docs/decisions/LOCATION_LEGAL_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n -C 3 \"constraint_name|constraint\\??|CONSTRAINT_MAP|mapDbErrorToResult|clinic_profile_primary\" apps/web/src/lib/errors.ts" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n -C 2 \"enum \\{phone|CTAConfig|targetUrl|value\" docs/core/DATA_MODEL.md" in C:\Users\assag\solution\website-exposure
 succeeded in 1596ms:
4-
5-본 문서는 `docs/admin/ARCHITECTURE.md` v0.7 § 3.8.1 (LocationProfile(main) 자동 생성 규칙) · § 3.8.2 (LegalDocument 자동 생성 규칙) 을 M0 어드민에서 구현하기 위한 plan이다. ClinicProfile 화면 한 화면에서 **3계약 동시 출력** (`ClinicProfile` + `LocationProfile`(slug=`main`) + `LegalDocument`(5종)) 을 단일 server action transaction 안에서 수행한다.
6-
7:> **본 plan 의 위상 명시**: 이 plan 은 ADMIN_UI_SKELETON_PLAN v1.0 의 ADMIN-UI-15 marker (M0 v1.0 본 구현 합류) 를 1차 해소하는 작업이다. walking skeleton 의 의도된 한계 (single contract 출력) 를 풀고 § 3.2 화면 ② 의 완성 형태로 진화시킨다.
8-
9-> **scope limit (LL-INTRO-01)** — cycle1 LL-03·LL-04 patch: 본 plan 은 LegalDocument **draft 저장만** 다룬다. `review-queued` 도 차단 — 그 전이는 ComplianceRecord pre-publish row + NotificationEvent envelope (REVIEW_WORKFLOW § 5.2 / § 3.1) 발송이 함께 작동해야 한다. 이 둘은 모두 compliance-assistant Feature + ComplianceRecord UI cascade 까지 defer. 본 plan 의 LegalDocument 는 `status='draft'` 강제 (CHECK). 발행 게이트 자체는 LL-DEFER-01.
10-
--
39-|---|---|
40-| ClinicProfileForm 3 섹션 재구성 | (a) 기관 정체성 (기존) / (b) 본원 위치·연락·시간 / (c) 정책 변수 (보조) |
41-| `legal_document` 테이블 신설 (C-16 minimal) | packages/core-content C0006 migration · RLS · 5종 documentType partial UNIQUE (cycle1 LL-08) |
42:| `clinic_profile` 정책 변수 + primaryCtas 컬럼 추가 | `policy_contact_person` · `policy_contact_email` · `policy_contact_phone` · `policy_effective_date` · `primary_ctas` (JSONB · cycle1 LL-02 patch) |
43-| `location_profile` clinic_profile_id 추가 | composite FK with instance_id — same-tenant parentClinic 보장 (cycle1 LL-01 patch) |
44-| `saveClinicProfile` actions 확장 | 단일 tx 안 ClinicProfile + LocationProfile(main) + 5종 LegalDocument upsert · 변수 치환 · audit 7 row 별도 emit (cycle1 LL-17 patch) |
45-| Core 표준 템플릿 5종 | packages/core-content/src/templates/ — `privacy.ts` · `terms.ts` · `non-covered.ts` · `refund.ts` · `complaint.ts` |
--
58-| 다지점 (slug ≠ main) LocationProfile UI | Phase Beta (M2+) | DATA_MODEL DM-17 |
59-| 정책 개정 이력 (`revisions[]`) UI | M1 Phase Alpha | LL-DEFER-02 |
60-| LegalDocument 수동 작성 모드 (autoGenerated=false) | M1 Phase Alpha — Markdown 에디터 합류 시점 | LL-DEFER-03 |
61:| reservationChannels 풀세트 (LocationProfile 별도 입력 폼) | M0 v1.0 본 구현 — LocationProfile 편집 화면 합류 시점 (cycle1 LL-02 patch — v0.1/v0.2 는 primaryCtas 상속만) | LL-DEFER-04 |
62-| `representativeDoctors` · `doctorsAtLocation` · `availableTreatments` ref 입력 | M0 v1.0 다지점 입력 화면 또는 LocationProfile 편집 화면 | LL-DEFER-05 |
63-| LegalDocument body 직접 수동 override | M1 Phase Alpha | LL-DEFER-06 |
64-| `latitude`/`longitude` 지도 pinpoint UI | M1 Phase Alpha | LL-DEFER-07 |
--
155-ALTER TABLE clinic_profile
156-  ADD COLUMN policy_contact_person TEXT,
157-  ADD COLUMN policy_contact_email TEXT,
158:  ADD COLUMN policy_contact_phone TEXT,
159-  ADD COLUMN policy_effective_date DATE,
160-  -- cycle1 LL-02 patch: primaryCtas SoT (admin/ARCH § 3.8.1 상속 경로 보존)
161-  ADD COLUMN primary_ctas JSONB NOT NULL DEFAULT '[]'::jsonb;
--
165-    policy_contact_email IS NULL
166-    OR policy_contact_email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
167-  ),
168:  -- cycle1 LL-20 patch: phone regex — 한국 02-1234-5678 · 010-1234-5678 · +82-2-1234-5678 (국제) · '.' 구분 미허용 · 'ext.' 미허용 (LL-FORM-12 명시)
169:  ADD CONSTRAINT clinic_profile_policy_phone_format CHECK (
170:    policy_contact_phone IS NULL
171:    OR policy_contact_phone ~ '^(\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}$'
172-  ),
173-  ADD CONSTRAINT clinic_profile_primary_ctas_array CHECK (
174-    jsonb_typeof(primary_ctas) = 'array'
--
176-
177--- cycle3 LL-38 patch: PostgreSQL CHECK 는 subquery 미지원 → trigger 가 매 row 검증.
178--- cycle4 LL-54 patch: trigger function 은 NEW 읽고 row-specific RAISE 하므로 VOLATILE (기본). IMMUTABLE 마킹 제거.
179:-- cycle3 LL-40 + cycle4 LL-50 patch: CT-03 SoT 정렬 — DB trigger 는 CT-03 enum 11종 전체 허용 (subset 분리 — UI 입력은 phone/kakao-talk/naver-reservation 3종 minimal · LL-FORM-08 정렬).
180--- cycle4 LL-48 patch: RAISE ... USING CONSTRAINT = '<name>' 으로 errors.ts mapDbErrorToResult 가 23514 + constraint name 으로 분기 가능.
181-CREATE OR REPLACE FUNCTION clinic_profile_primary_ctas_validate()
182-RETURNS TRIGGER AS $$
--
184-  elem JSONB;
185-  valid_types CONSTANT TEXT[] := ARRAY[
186-    -- DATA_MODEL CT-03 SoT 11종 (DB trigger 전체 허용)
187:    'phone', 'email', 'sms',
188:    'kakao-talk', 'kakao-channel',
189:    'naver-reservation', 'naver-talk',
190-    'form', 'map', 'external', 'video-consultation'
191-    -- 해외 채널 (line, whatsapp 등) 은 M3 다국어 cascade (DATA_MODEL DM-14)
192-  ];
--
196-      USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
197-  END IF;
198-  FOR elem IN SELECT * FROM jsonb_array_elements(NEW.primary_ctas) LOOP
199:    -- DB key = 'id' (Git 출력 시 '@id' alias 변환은 LL-CASCADE-04 build/export 책임)
200-    IF jsonb_typeof(elem -> 'id') <> 'string' OR length(elem ->> 'id') = 0 THEN
201-      RAISE EXCEPTION 'primary_ctas element missing id'
202-        USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
--
226-
227-**결정**:
228-- (LL-SCHEMA-09) 별도 column (metadata JSONB 가 아닌) — 폼 schema 검증 + LegalDocument 변수 치환의 필수 입력값.
229:- (LL-SCHEMA-10 · cycle1 LL-14 patch) `policy_contact_phone` 도 form 단계 required (DB NULL 허용은 유지 — 향후 cookie/other manual 입력 row 호환).
230-- (LL-SCHEMA-11 · cycle1 LL-15 patch) `policy_effective_date` 는 form 안 5 LegalDocument record 의 default 만. 운영자가 각 record 별 override 가능 (LL-DEFER-08 closed).
231:- (LL-SCHEMA-12 · cycle1 LL-02 + cycle2 LL-26 + cycle3 LL-38·LL-40·LL-45 + cycle4 LL-50·LL-51 patch) `primary_ctas` JSONB array — admin/ARCH § 3.8.1 의 `reservationChannels = primaryCtas 상속` SoT 보존. 각 원소는 **CT-03 SoT shape**: `{id: string, type: enum, label: string, targetUrl: string (required)}`. **type enum 정책 = DB trigger 전체 허용 + UI subset 분리** (cycle4 LL-50):
232:  - DB trigger 허용 11종 (CT-03 SoT 전체): `phone` · `email` · `sms` · `kakao-talk` · `kakao-channel` · `naver-reservation` · `naver-talk` · `form` · `map` · `external` · `video-consultation`.
233:  - **M0 v0.5 UI 입력 subset 3종** (LL-FORM-08): `phone` · `kakao-talk` · `naver-reservation`. UI form 의 select 옵션도 SoT 정확 token (cycle4 LL-51 — 기존 `kakao` / `naver-booking` 잘못된 별명 제거).
234:  - UI subset 외 type (sms/form/map/external 등) 은 M0 v1.0 또는 M1 cascade (LL-DEFER-19).
235:  - **DB 검증 = trigger** (CHECK subquery 불가 · cycle3 LL-38 patch) + form zod (UI subset 3종 enum) 양쪽. LocationProfile 자동 생성 시 **build-time reference (deep clone)** — DB metadata 복사 없음 (LL-SCHEMA-18 통일).
236-
237-### 2.3 `location_profile` clinic_profile_id 추가 + businessHours CT-02 SoT 변환 (LL-SCHEMA-13)
238-
--
308-| 섹션 | 입력 필드 | 출력 계약 |
309-|---|---|---|
310-| **(a) 기관 정체성** (기존) | name · description · logoUrl · ogImageUrl · businessRegistrationNumber + 선택 필드 (alternateName · legalEntityName · slogan · longDescription · foundingDate · founder) | `ClinicProfile` (기존 column) |
311:| **(b) 본원 위치·연락·시간** (신규) | streetAddress · addressLocality · addressRegion · postalCode · addressCountry · telephone · email · businessHours (7 요일 + 점심) · primaryCtas (3종 minimal · CT-03 SoT token: `phone`/`kakao-talk`/`naver-reservation` · cycle4 LL-51 patch) · featuredChannelId | `ClinicProfile.primary_ctas` + `LocationProfile`(slug=`main`) |
312-| **(c) 정책 변수** (신규 보조 details) | policyContactPerson · policyContactEmail · policyContactPhone · policyEffectiveDate (5종 default) | `ClinicProfile.policy_*` |
313-| **(d) 5종 LegalDocument** (신규 보조 details — cycle1 LL-15 patch) | 5 record 별 effectiveDate override (optional · 미입력 시 policyEffectiveDate default) | `LegalDocument` × 5 |
314-
315-**결정**:
316-- (LL-FORM-02) 한 화면 한 폼 (single `<form action>`) — server action 한 번 호출로 3계약 + 5 LegalDocument 동시 출력. 부분 저장 (섹션별 저장) 안 함.
317:- (LL-FORM-03) 섹션 (b) 는 본원 위치 SoT 이므로 **모든 필드 required** (street/locality/region/postal/telephone). email 은 optional. businessHours 는 평일 (mon~fri) 5일 중 1일 이상 필수. primaryCtas 는 1건 이상 필수.
318-- (LL-FORM-04 · cycle1 LL-14 patch) 섹션 (c) 는 LegalDocument 생성에 필수 — policyContactPerson · policyContactEmail · policyContactPhone · policyEffectiveDate **4 필드 모두 required**. (한국 PIPA 의 개인정보 보호책임자 필수 고지 항목 — 소속/부서 같은 추가 필드는 LL-DEFER 또는 자유 입력 textarea 로 처리. v0.2 는 4 필드만 minimal.)
319-- (LL-FORM-05) URL scrape (v1.1) 는 (a) 만 prefill — (b)/(c)/(d) 는 외부 사이트 scrape 으로 추정 불가 / 부정확.
320-- (LL-FORM-06) UX: 모든 섹션 펼친 상태 default. 선택 필드 (a 의 details) 은 그대로 접힘. (d) 5 record 도 default 접힘 (override 가 일반 케이스 아님).
321-- (LL-FORM-07 · cycle1 LL-23 + cycle2 LL-35 patch) businessHours UI: 7 요일 행. 각 행: `[휴진 ☐]` + `오픈 [HH:mm] 마감 [HH:mm]` + `[점심 ☐]` + `점심 시작 [HH:mm] 종료 [HH:mm]`. 휴진 checked 시 다른 입력 disabled. **a11y 요구**: 각 row 에 `aria-labelledby` (요일 헤더 link) + 각 input `aria-describedby` (요일 에러 메시지 id) + 휴진 toggle 의 `aria-controls` (해당 row 의 input group id). **5 LegalDocument override details a11y (LL-FORM-14)**: `<details>` `<summary>` 는 기본적으로 keyboard interaction (Space/Enter toggle) + `aria-expanded` 자동. 추가로 `<summary>` 안에 정책 이름 + `(시행일: <date>)` 시각 표시 + `aria-controls` (override 입력 group id) + override 입력에 `aria-labelledby` (summary id) 명시.
322:- (LL-FORM-08 · cycle1 LL-02 + cycle4 LL-51 patch) primaryCtas UI: **CT-03 SoT token 3종** (`phone` · `kakao-talk` · `naver-reservation`) 각각 1개씩 입력 행. 미입력 = 해당 채널 제외. 각 채널 row 입력 = `targetUrl` (필수: `tel:+82-2-1234-5678` · `https://pf.kakao.com/...` · `https://booking.naver.com/...`) + `label` (필수: 운영자 자유 입력) + `id` (자동 생성: `<type>-<n>`). featuredChannelId 는 입력한 채널 중 select. **단, 이는 ClinicProfile.primary_ctas 의 입력** — LocationProfile.reservationChannels 는 자동 상속 (LL-SCHEMA-18 build-time).
323-
324-### 3.2 검증
325-
326-- (LL-FORM-09) zod schema 는 server action / form 양쪽 모두 동일 SoT — `apps/web/src/lib/clinic-profile-schema.ts` 신설.
327-- (LL-FORM-10) businessHours 시간 정합 검증: open < close · lunch.from < lunch.to · lunch ∈ [open, close]. 위배 시 `(field=businessHours.monday.lunch, message=...)` 에러.
328:- (LL-FORM-11) ISO 형식 검증: `addressCountry ^[A-Z]{2}$` · 시간 `^([01][0-9]|2[0-3]):[0-5][0-9]$` · email/phone regex.
329:- (LL-FORM-12 · cycle1 LL-20 patch) phone regex 정책 — 한국 (02-1234-5678 · 010-1234-5678) + 국제 (+82-2-1234-5678). 확장번호 (ext.) · '.' 구분자 (02.1234.5678) 거절. UX 힌트 명시.
330-- (LL-FORM-13 · cycle1 LL-15 + cycle2 LL-31 + cycle3 LL-39 patch) form (d) 5 record effectiveDate FormData naming **고정 규약 + parser helper**:
331-  - Field name (form 안 flat key) = `legalDocEffective_<documentType>` (5종: `legalDocEffective_privacy` · `legalDocEffective_terms` · `legalDocEffective_non-covered` · `legalDocEffective_refund` · `legalDocEffective_complaint`). cycle3 LL-39 patch: dotted key (`legalDoc.privacy.effectiveDate`) 회귀 — `Object.fromEntries(formData)` 가 nested object 자동 생성하지 않으므로 flat underscore key 로 변경.
332-  - server action 안 **parsing helper `extractLegalDocEffectiveOverrides(formData)`** → `Record<DocumentType, string | undefined>` (apps/web/src/lib/clinic-profile-schema.ts 안 정의).
--
361-- (LL-ACTION-05) ClinicProfile UPSERT 의 `(xmax = 0)` 판별을 모든 entity 에 적용 — 각 audit row 별 `mode: "insert"|"update"`.
362-- (LL-ACTION-06 · cycle1 LL-16 + cycle3 LL-46 patch) **자동 재렌더링 분기 제거** — v0.4 는 LegalDocument 본문 수동 편집 차단 (LL-DEFER-06) 이므로 모든 row 가 templateVersion=current. 매 저장 시 모든 LegalDocument body 재렌더링. **운영자 알림 marker (LL-FORM-15 · 폼 (d) 상단 안내문)**: "본원 정보(기관명·법인명·사업자번호·설립자·본원 주소·전화·이메일) 또는 정책 변수(담당자·이메일·전화·시행일)를 수정하면 5종 정책 문서 본문이 자동으로 다시 생성됩니다. 본문 직접 수정은 추후 단계에서 합류합니다." 향후 수동 override 도입 시 별도 `body_source` enum (`auto`/`manual`) 컬럼 cascade.
363-- (LL-ACTION-07 · cycle1 LL-21 patch) `effective_date` default — DB `CURRENT_DATE AT TIME ZONE 'Asia/Seoul'` (Postgres) 사용. server `new Date()` 사용 금지. form 입력 시 ISO 형식 그대로.
364:- (LL-ACTION-08 · cycle1 LL-02 + cycle3 LL-45 patch — LL-SCHEMA-12·LL-SCHEMA-18 통일) LocationProfile 자동 상속 = **build-time reference (deep clone)**. server action 안 DB 저장은 `metadata.reservationChannelsInheritedFrom = "clinic_profile.primary_ctas"` marker 만 (의도 명시용). 실제 출력 시점은 apps/worker · M0 v1.0 build/export 의 책임 (LL-CASCADE-04 marker 신설).
365-- (LL-ACTION-09 · cycle1 LL-05 + cycle2 LL-30 patch) businessHours 변환 — form 의 7요일 단순 입력 → server action 안에서 `convertToOpeningHoursSpec()` 으로 CT-02 SoT 형식 (openingHours[] grouped by 동일 open/close) 변환 후 metadata 저장. `lunchBreaks[]` 도 동일 grouping. `receptionHours[]`/`specialClosures[]` 는 v0.3 빈 배열 + round-trip 시 빈 배열 보존 (form 재로딩 시 미표시 — 입력 필드 자체 없음).
366-- (LL-ACTION-21 · cycle2 LL-29 + cycle3 LL-44 patch) **assertHasMainLocationAfterTx 안전망**: tx 안 마지막 단계에서 `SELECT 1 FROM location_profile WHERE instance_id=? AND clinic_profile_id=? AND slug='main'` — 0행이면 **`MainLocationMissingError` (apps/web/src/lib/errors.ts 신설 named Error class) throw** → tx rollback. server action outer catch 에서 `MainLocationMissingError` 별도 분기: `return { ok: false, fieldErrors: {}, formError: "본원 정보 저장에 실패했습니다. 페이지를 새로고침하고 다시 시도하세요." }`. mapDbErrorToResult 와는 별개 (DB error 가 아닌 application-level invariant). 정상 흐름에서는 LocationProfile main upsert 가 항상 수행되므로 trip 안 됨. DB trigger 합류 (LL-DEFER-15) 까지 임시 보호.
367-
--
380-  location: {
381-    main: {
382-      address: string;       // street + locality + region + postal 한 줄
383:      telephone: string;
384-      email: string | null;
385-    };
386-  };
--
423-  - 정상: 7 row 차례로 INSERT (Promise.all 아닌 sequential — 1 row 실패 시 stop 아님). 각 row try/catch.
424-  - 실패 row 발생 시 끝에 단일 `content-saved-partial` audit row INSERT — payload `{outcome: "partial", emitted: [<contentTypes>], failed: [<contentTypes>], reason: <error.code>}`. 운영 포렌식 안전망.
425-  - 모든 7 row 실패 시 `content-saved-failed` audit row 1건.
426:  - **3단계 안전망 (cycle3 LL-43 + cycle4 LL-55 patch — Sentry pre-integration fallback 명시)**:
427:    - **v0.5 단계 (Sentry SDK 미통합 · LL-DEFER-18 합류 전)**: (1) per-row try/catch + console.error → server stdout (Vercel logs / Cloud Run logs). (2) partial/failed row INSERT 시도 → 실패해도 server stdout. (3) partial/failed row INSERT 자체 실패 시 server stdout만 (Sentry 미통합 상태 명시). 사용자 return state 는 `{ ok: true }` 유지 (save 성공이 우선 · audit 누락만 운영 팀 stdout 추적).
428:    - **M0 v1.0 (LL-DEFER-18 합류 후)**: (3) Sentry capture (INFRA INFR-PROV `Sentry` Provider 통합) + breadcrumb 으로 (1)/(2) 단계의 console.error 도 함께 캡처. 사용자 return state 동일.
429-    - **notifications Feature 합류 후** (별도 cascade): 운영 팀 slack 알림 채널 추가 marker.
430:  - 운영자 시각 영향 없음 — 저장 자체 성공 시 항상 `ok: true`. audit observability 손실은 운영 팀이 Sentry/로그에서 추적.
431-  - M0 v1.0 transactional outbox cascade 시점에 envelope + at-least-once exactly-once observable 로 전환 (cycle 1 LL-17 marker 갱신).
432-- (LL-ACTION-19 · cycle1 LL-17 patch) ADMIN_UI_SKELETON_PLAN § 5.5 audit matrix cascade — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed 별도 row 추가 marker (LL-CASCADE-02). 기존 ClinicProfile row 와 동일 통일 shape.
433-
--
436-- ClinicProfile actions v1.2 패턴 그대로 유지 — isNextControlFlowError rethrow · TenantResolveError mapAuthDenyReasonToUi · mapDbErrorToResult.
437-- 새 constraint 매핑 (mapDbErrorToResult cascade · cycle1 LL-19 + cycle2 LL-34 + cycle4 LL-48 patch — 후속 책임/액션/시점 명시):
438-  - `legal_document_instance_5type_unique` → formError ("동일 정책 문서가 이미 존재합니다. 잠시 후 다시 시도하세요.")
439:  - `legal_document_status_skeleton_limit` → formError ("정책 문서 상태 변경(검수 진입·발행)은 후속 단계입니다. 본 화면에서는 draft 만 저장 가능하며, 검수 진입은 compliance-assistant Feature 합류(M0 v1.0 본 구현 완료 시점) 후 검수 큐 화면에서 가능합니다.")
440-  - `legal_document_published_at_null` → formError ("정책 문서 발행은 후속 단계입니다. 발행 게이트(compliance-assistant + ComplianceRecord UI) 합류 후 발행 화면에서 가능합니다.")
441-  - `legal_document_risk_level_skeleton_limit` → formError ("정책 문서 위험도는 현재 단계에서 Low 만 허용됩니다. 위험도 수동 분류는 위험도 분류 UI(M0 v1.0) 합류 후 가능합니다.")
442-  - `clinic_profile_policy_email_regex` → fieldErrors.policyContactEmail
443:  - `clinic_profile_policy_phone_format` → fieldErrors.policyContactPhone
444-  - `clinic_profile_primary_ctas_array` · `clinic_profile_primary_ctas_shape` (trigger RAISE 의 USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' · SQLSTATE 23514 — cycle4 LL-48 patch) → fieldErrors.primaryCtas
445-  - `location_profile_clinic_fk` (composite FK 위반) → formError ("본원과 위치 정보가 일치하지 않습니다. 페이지를 새로고침하고 다시 시도하세요.")
446-  - businessHours 는 application-level 검증 (DB CHECK 없음)
--
484-- (LL-TEMPLATE-04) **법무 검토 필수 marker** — README/CHANGELOG 에 명시. Core 표준 템플릿 본문 자체는 본 plan 의 검토 범위 외. 별도 cascade 로 법무 검토 받은 본문으로 교체.
485-- (LL-TEMPLATE-05 · cycle1 LL-06 patch) 변수 화이트리스트 (admin/ARCH § 3.8.2 SoT cascade marker LL-CASCADE-01 — ARCH 본문에 본 표 reference 추가):
486-  - `{{clinic.name}}` · `{{clinic.legalEntityName}}` · `{{clinic.businessRegistrationNumber}}` · `{{clinic.founder}}`
487:  - `{{location.main.address}}` · `{{location.main.telephone}}` · `{{location.main.email}}`
488-  - `{{policy.contactPerson}}` · `{{policy.contactEmail}}` · `{{policy.contactPhone}}` · `{{policy.effectiveDate}}`
489-- (LL-TEMPLATE-06) 템플릿 versioning — semver `major.minor.patch`. minor 이상 업그레이드 시 자동 재렌더링 (LL-ACTION-06 — v0.2 매 저장 시 무조건 재렌더링이므로 minor/major 분기 불필요). major 변경 시 운영자 수동 확인은 LL-DEFER-10.
490-- (LL-TEMPLATE-07 · cycle1 LL-13 patch) **LegalDocument body 검증 면제 명시** — `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표에 LegalDocument 추가 (cascade marker LL-CASCADE-03). 면제 범위: (1) answer-first AST 미적용 (정책 문서는 첫 문장 답 제시 구조 아님) (2) 표현 검사 (recommend/best 등 광고 표현) 미적용 (3) 변수 화이트리스트 검증은 별도 룰 (LL-ACTION-12).
--
540-
541-## 9. M0 v1.0 cascade marker (defer 정리 · cycle3 LL-47 patch — phase 별 그룹화)
542-
543:### 9.1 M0 v1.0 본 구현 합류 (Phase 0 Week 4~)
544-
545-- `LL-DEFER-01`: LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제 · review-queued 전이 + ComplianceRecord pre-publish + NotificationEvent envelope · status=published). compliance-assistant Feature + ComplianceRecord UI cascade.
546-- `LL-DEFER-09`: LegalDocument 편집 권한 분리 (operator-edit-legal ActionType — REVIEW_WORKFLOW 14 ActionType cascade).
547-- `LL-DEFER-11`: LegalDocument body 검증 — CONTENT_STANDARDS § 7 ContentType 예외 marker cascade (LL-CASCADE-03). 추가 검증 룰은 compliance-assistant Feature.
548:- `LL-DEFER-15` (cycle2 LL-29 patch): location_profile 의 main slug 1 row 강제 DB trigger 또는 partial unique with `clinic_profile_id` 기반 cascade — v0.4 은 server action assertHasMainLocationAfterTx 안전망. M0 v1.0 본 구현에서 DB-level invariant 합류.
549:- `LL-DEFER-18` (cycle3 LL-43 patch): Sentry SDK 통합 (INFRA INFR-PROV `Sentry` Provider). audit partial/failed row INSERT 실패 시 capture 채널. M0 v1.0 본 구현 (provider 통합 시점).
550:- `LL-DEFER-19` (cycle4 LL-50 patch): primaryCtas UI subset 확장 — CT-03 11종 중 phone/kakao-talk/naver-reservation 외 8종 (`email`/`sms`/`kakao-channel`/`naver-talk`/`form`/`map`/`external`/`video-consultation`) 의 UI 입력 합류. M0 v1.0 본 구현 또는 M1 Phase Alpha.
551:- `LL-DEFER-20` (cycle4 LL-53 patch): packages/migrations-runner 실 runner 코드 — manifest spec 작성 (plan v1.0 acceptance precondition) 후 sequential apply + fail-fast 구현. M0 v1.0 본 구현.
552-
553-### 9.2 M1 Phase Alpha 합류
554-
--
561-- `LL-DEFER-13`: custom (`documentType=other`) template_version namespace 규약.
562-- `LL-DEFER-16` (cycle2 LL-30 patch): form (b) 에 receptionHours + specialClosures (공휴일/임시 휴진) UI 추가.
563-
564:### 9.3 M0 v1.0 본 구현 합류 (LocationProfile 편집 화면 cascade · cycle4 LL-52 patch)
565-
566:> **§1.3 비범위 vs §9.3 phase 정합 정정 (cycle4 LL-52)**: LL-DEFER-04/05 의 합류 시점은 LocationProfile 편집 화면 (M0 v1.0 본 구현). M2 Phase Beta 합류로 표시했던 v0.4 까지의 표기는 §1.3 비범위 표 ("LocationProfile 편집 화면 합류 시점") 와 충돌. v0.5 에서 통일.
567-
568:- `LL-DEFER-04`: reservationChannels 풀세트 (LocationProfile 편집 화면 + 지점별 override). **M0 v1.0 본 구현 합류**.
569:- `LL-DEFER-05`: representativeDoctors · doctorsAtLocation · availableTreatments ref 입력 UI (다지점 합류 시점). **M0 v1.0 본 구현 합류** (단지점도 LocationProfile 편집 화면에서 입력).
570-
571:### 9.3.1 M2 Phase Beta 합류 (다지점 + 외부 사용자 RBAC)
572-
573:- (현재 비어 있음 — 다지점 UI 자체는 M0 v1.0 본 구현. M2 Phase Beta 는 외부 사용자 RBAC · 풀 권한 모델.)
574-
575-### 9.4 Migration / 운영 cascade (시점 무관 · 조건부)
576-
--
583-
584-## 10. Cascade marker (다른 SoT 문서로 전파)
585-
586:> **acceptance 순서 정합 (cycle2 LL-33)**: LL-CASCADE-01 은 plan v1.0 acceptance 와 **동시 또는 직전** 에 ARCH patch 적용 (plan acceptance commit 안 포함). LL-CASCADE-02 · LL-CASCADE-03 · LL-CASCADE-04 도 동일 정책. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
587-
588-- `LL-CASCADE-01`: `docs/admin/ARCHITECTURE.md` § 3.8.2 표 — body 변수 화이트리스트 11개 (clinic 4 + location 3 + policy 4) reference 추가. ARCH v0.8 patch. **acceptance precondition**.
589-- `LL-CASCADE-02`: `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` § 5.5 audit matrix — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed row 추가. **acceptance precondition**.
590-- `LL-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표 — LegalDocument 면제 marker 추가 (answer-first AST · 표현 검사 면제 · 변수 화이트리스트 별도 룰). **acceptance precondition**.
591:- `LL-CASCADE-04` (cycle3 LL-41 + cycle4 LL-49 patch): **cascade target 정정** — ADMIN_UI_SKELETON_PLAN § 6 은 walking skeleton 의 actions 영역으로 build/export 부재 → 본 plan v1.0 acceptance 시 **신규 plan `docs/decisions/M0_BUILD_EXPORT_PLAN.md` (placeholder)** 신설 + 본 plan 의 LL-CASCADE-04 marker reference. apps/worker · M0 v1.0 Git export 책임: LocationProfile.reservationChannels Git 출력 시 `clinic_profile.primary_ctas` deep clone, LocationProfile.@id = `"main"`, LocationProfile.parentClinic = ClinicProfile.@id reference, ClinicProfile.locations[] = SELECT 결과, primary_ctas DB key `id` → Git output `@id` alias 변환. **acceptance 강도 = placeholder 작성** (M0_BUILD_EXPORT_PLAN.md 의 LL-CASCADE-04 책임 명시 row 1건). 실 구현은 M0 v1.0 본 구현.
592:- `LL-CASCADE-05` (cycle3 LL-42 + cycle4 LL-53 patch): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장. **acceptance 강도 명시** — plan v1.0 acceptance 는 **manifest spec 작성까지만 차단** (manifest 파일 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` 의 spec 작성 + 본 plan 의 8단계 의존성 표 cascade). 실 runner 코드 구현은 M0 v1.0 cascade (LL-DEFER-20 신설). 즉 plan v1.0 acceptance ≠ runner 코드 acceptance.
593-
594-## 변경 이력
595-
596-| 일자 | 버전 | 변경 |
597-|---|---|---|
598-| 2026-05-16 | v0.1 | 초안 작성. Codex 자동 비평 사이클 진입 전 base. |
599:| 2026-05-16 | v0.2 | **Codex 비평 cycle1 25 findings (7 blocking + 12 major + 6 minor) 전건 수용 patch**: (LL-01) location_profile 에 clinic_profile_id composite FK + main row CHECK, ClinicProfile.locations[] Git 출력 빌드 시점 동적 구성. (LL-02) ClinicProfile.primary_ctas 컬럼 + LocationProfile.reservationChannels = primary_ctas 자동 상속 marker. (LL-03·04) status='draft' 만 허용 (review-queued 도 차단) — ComplianceRecord pre-publish + NotificationEvent 합류 시점까지 defer. (LL-05) businessHours SoT CT-02 형식 (openingHours[]·receptionHours[]·lunchBreaks[]·specialClosures[]) 변환 + server action 안 convertToOpeningHoursSpec 명시. (LL-06) policy.* 변수 정당화 + LL-CASCADE-01 cascade marker. (LL-07) 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha. (LL-08·09) partial UNIQUE — closed 5종만. cookie/other LL-DEFER-12. (LL-10) C-21 출력 매핑표 명시. (LL-11) representativeDoctors v0.2 빈 배열. (LL-12) risk_level NOT NULL + CHECK 'Low' 만. (LL-13) SoT 경로 정정 (docs/core/CONTENT_STANDARDS.md) + LL-CASCADE-03. (LL-14) policyContactPhone form 단계 required. (LL-15) effective_date individual override 합류 (LL-DEFER-08 closed). (LL-16) 자동 재렌더링 분기 제거 (모든 row 매 저장 시 재렌더링). (LL-17) audit 7 row 별도 emit (Bundle outer 폐기). (LL-18) RBAC 분리 marker LL-DEFER-09 명시. (LL-19) published CHECK 위반 시 운영자 메시지 + errors.ts 매핑. (LL-20) phone regex 한국 + 국제 표기 명시. (LL-21) effective_date timezone Asia/Seoul. (LL-22) template_version naming autoGenerated=true 일 때만 필수. (LL-23) businessHours a11y marker. (LL-24) detection 시점 server action runtime + build-time test cascade. (LL-25) LL-DEFER-08~10 본문 §1 비범위 표 반영. |
600-| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
601:| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
602:| 2026-05-16 | v0.5 | **Codex 비평 cycle4 8 findings (2 blocking + 4 major + 2 minor) 전건 수용 patch**: (LL-48) trigger RAISE EXCEPTION USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' 추가 — errors.ts mapDbErrorToResult 가 SQLSTATE 23514 + constraint name 으로 분기 가능. (LL-49) LL-CASCADE-04 target 정정 — ADMIN_UI_SKELETON_PLAN § 6 은 actions 영역으로 build/export 부재. 신규 `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 신설 + LL-CASCADE-04 책임 row 1건 cascade. acceptance 강도 = placeholder 작성. (LL-50) CT-03 enum SoT 정렬 — DB trigger 허용 11종 (phone/email/sms/kakao-talk/kakao-channel/naver-reservation/naver-talk/form/map/external/video-consultation) + UI subset 3종 분리. LL-DEFER-19 8종 UI 합류. (LL-51) form (b) UI copy 정정 — kakao → kakao-talk · naver-booking → naver-reservation 토큰. (LL-52) LL-DEFER-04/05 phase 충돌 정정 — §9.3 → M0 v1.0 본 구현 (LocationProfile 편집 화면) 으로 통일. M2 Phase Beta 표기 제거 (현재 비어 있음 — 외부 사용자 RBAC 가 M2). (LL-53) LL-CASCADE-05 강도 명시 — plan v1.0 acceptance = manifest spec 작성만 차단, 실 runner 코드는 LL-DEFER-20 (M0 v1.0). (LL-54) trigger function IMMUTABLE 마킹 제거 — VOLATILE 기본 (NEW 읽기 + row-specific RAISE 정합). (LL-55) Sentry pre-integration fallback 명시 — v0.5 단계 console/server stdout only, M0 v1.0 LL-DEFER-18 합류 후 Sentry capture. **누계 55 findings 전건 수용**. |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 1596ms:
1:// @glitzy/web/lib/errors — DB constraint violation → field/form error mapping
2:// cycle1-3entity WEB-08: ClinicProfile + DoctorProfile + TreatmentPage + Article constraint 추가
3-
4-export type FieldErrors = Record<string, string[]>;
5-
6-type Mapping = { field: string | null; message: string };
7-
8:// constraint_name → field + 한국어 메시지
9:const CONSTRAINT_MAP: Record<string, Mapping> = {
10-  // ClinicProfile (C0001)
11-  clinic_profile_name_length: { field: "name", message: "기관명은 1~100자여야 합니다." },
12-  clinic_profile_description_length: { field: "description", message: "간략 소개는 80~300자여야 합니다." },
--
40-  | { kind: "form"; message: string };
41-
42-/**
43: * postgres-js error 의 `code` (SQLSTATE) 와 `constraint_name` 으로 field/form 매핑.
44- * 23514 = check_violation, 23505 = unique_violation, 23503 = foreign_key_violation
45- */
46:export function mapDbErrorToResult(err: unknown): DbErrorResult | null {
47-  if (typeof err !== "object" || err === null) return null;
48:  const e = err as { code?: string; constraint_name?: string; constraint?: string };
49-  const code = e.code;
50:  const constraint = e.constraint_name ?? e.constraint;
51:  if (!code || !constraint) return null;
52-  if (code !== "23514" && code !== "23505" && code !== "23503") return null;
53-
54:  const mapping = CONSTRAINT_MAP[constraint];
55-  if (mapping) {
56-    if (mapping.field === null) return { kind: "form", message: mapping.message };
57-    return { kind: "field", errors: { [mapping.field]: [mapping.message] } };
58-  }
59-
60:  // unknown constraint — generic
61-  if (code === "23505") return { kind: "form", message: "중복된 값이 있어 저장하지 못했습니다." };
62-  if (code === "23503") return { kind: "form", message: "참조 무결성 오류 — 연결된 데이터가 없거나 삭제되었습니다." };
63-  if (code === "23514") return { kind: "form", message: "입력값이 데이터 제약을 만족하지 못합니다." };
--
66-
67-/** 기존 호출처 호환 — FieldErrors 만 반환 (form 메시지는 null) */
68-export function mapDbErrorToFieldErrors(err: unknown): FieldErrors | null {
69:  const result = mapDbErrorToResult(err);
70-  if (result === null) return null;
71-  if (result.kind === "field") return result.errors;
72-  return null;
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 1609ms:
177--- cycle3 LL-38 patch: PostgreSQL CHECK 는 subquery 미지원 → trigger 가 매 row 검증.
178--- cycle4 LL-54 patch: trigger function 은 NEW 읽고 row-specific RAISE 하므로 VOLATILE (기본). IMMUTABLE 마킹 제거.
179--- cycle3 LL-40 + cycle4 LL-50 patch: CT-03 SoT 정렬 — DB trigger 는 CT-03 enum 11종 전체 허용 (subset 분리 — UI 입력은 phone/kakao-talk/naver-reservation 3종 minimal · LL-FORM-08 정렬).
180--- cycle4 LL-48 patch: RAISE ... USING CONSTRAINT = '<name>' 으로 errors.ts mapDbErrorToResult 가 23514 + constraint name 으로 분기 가능.
181:CREATE OR REPLACE FUNCTION clinic_profile_primary_ctas_validate()
182-RETURNS TRIGGER AS $$
183-DECLARE
184-  elem JSONB;
185-  valid_types CONSTANT TEXT[] := ARRAY[
--
192-  ];
193-BEGIN
194-  IF jsonb_typeof(NEW.primary_ctas) <> 'array' THEN
195-    RAISE EXCEPTION 'primary_ctas must be a JSON array'
196:      USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
197-  END IF;
198-  FOR elem IN SELECT * FROM jsonb_array_elements(NEW.primary_ctas) LOOP
199-    -- DB key = 'id' (Git 출력 시 '@id' alias 변환은 LL-CASCADE-04 build/export 책임)
200-    IF jsonb_typeof(elem -> 'id') <> 'string' OR length(elem ->> 'id') = 0 THEN
201-      RAISE EXCEPTION 'primary_ctas element missing id'
202:        USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
203-    END IF;
204-    IF NOT (elem ->> 'type' = ANY(valid_types)) THEN
205-      RAISE EXCEPTION 'primary_ctas element type invalid: %', elem ->> 'type'
206:        USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
207-    END IF;
208-    IF jsonb_typeof(elem -> 'label') <> 'string' OR length(elem ->> 'label') = 0 THEN
209-      RAISE EXCEPTION 'primary_ctas element missing label'
210:        USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
211-    END IF;
212-    IF jsonb_typeof(elem -> 'targetUrl') <> 'string' OR length(elem ->> 'targetUrl') = 0 THEN
213-      RAISE EXCEPTION 'primary_ctas element missing targetUrl'
214:        USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
215-    END IF;
216-  END LOOP;
217-  RETURN NEW;
218-END;
219-$$ LANGUAGE plpgsql;
220--- cycle4 LL-54 patch: VOLATILE 기본 (마킹 생략). row-specific RAISE 에 정합.
221-
222:CREATE TRIGGER clinic_profile_primary_ctas_trigger
223-  BEFORE INSERT OR UPDATE OF primary_ctas ON clinic_profile
224:  FOR EACH ROW EXECUTE FUNCTION clinic_profile_primary_ctas_validate();
225-```
226-
227-**결정**:
228-- (LL-SCHEMA-09) 별도 column (metadata JSONB 가 아닌) — 폼 schema 검증 + LegalDocument 변수 치환의 필수 입력값.
--
440-  - `legal_document_published_at_null` → formError ("정책 문서 발행은 후속 단계입니다. 발행 게이트(compliance-assistant + ComplianceRecord UI) 합류 후 발행 화면에서 가능합니다.")
441-  - `legal_document_risk_level_skeleton_limit` → formError ("정책 문서 위험도는 현재 단계에서 Low 만 허용됩니다. 위험도 수동 분류는 위험도 분류 UI(M0 v1.0) 합류 후 가능합니다.")
442-  - `clinic_profile_policy_email_regex` → fieldErrors.policyContactEmail
443-  - `clinic_profile_policy_phone_format` → fieldErrors.policyContactPhone
444:  - `clinic_profile_primary_ctas_array` · `clinic_profile_primary_ctas_shape` (trigger RAISE 의 USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' · SQLSTATE 23514 — cycle4 LL-48 patch) → fieldErrors.primaryCtas
445-  - `location_profile_clinic_fk` (composite FK 위반) → formError ("본원과 위치 정보가 일치하지 않습니다. 페이지를 새로고침하고 다시 시도하세요.")
446-  - businessHours 는 application-level 검증 (DB CHECK 없음)
447-
448-## 5. Core 표준 템플릿 5종
--
597-|---|---|---|
598-| 2026-05-16 | v0.1 | 초안 작성. Codex 자동 비평 사이클 진입 전 base. |
599-| 2026-05-16 | v0.2 | **Codex 비평 cycle1 25 findings (7 blocking + 12 major + 6 minor) 전건 수용 patch**: (LL-01) location_profile 에 clinic_profile_id composite FK + main row CHECK, ClinicProfile.locations[] Git 출력 빌드 시점 동적 구성. (LL-02) ClinicProfile.primary_ctas 컬럼 + LocationProfile.reservationChannels = primary_ctas 자동 상속 marker. (LL-03·04) status='draft' 만 허용 (review-queued 도 차단) — ComplianceRecord pre-publish + NotificationEvent 합류 시점까지 defer. (LL-05) businessHours SoT CT-02 형식 (openingHours[]·receptionHours[]·lunchBreaks[]·specialClosures[]) 변환 + server action 안 convertToOpeningHoursSpec 명시. (LL-06) policy.* 변수 정당화 + LL-CASCADE-01 cascade marker. (LL-07) 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha. (LL-08·09) partial UNIQUE — closed 5종만. cookie/other LL-DEFER-12. (LL-10) C-21 출력 매핑표 명시. (LL-11) representativeDoctors v0.2 빈 배열. (LL-12) risk_level NOT NULL + CHECK 'Low' 만. (LL-13) SoT 경로 정정 (docs/core/CONTENT_STANDARDS.md) + LL-CASCADE-03. (LL-14) policyContactPhone form 단계 required. (LL-15) effective_date individual override 합류 (LL-DEFER-08 closed). (LL-16) 자동 재렌더링 분기 제거 (모든 row 매 저장 시 재렌더링). (LL-17) audit 7 row 별도 emit (Bundle outer 폐기). (LL-18) RBAC 분리 marker LL-DEFER-09 명시. (LL-19) published CHECK 위반 시 운영자 메시지 + errors.ts 매핑. (LL-20) phone regex 한국 + 국제 표기 명시. (LL-21) effective_date timezone Asia/Seoul. (LL-22) template_version naming autoGenerated=true 일 때만 필수. (LL-23) businessHours a11y marker. (LL-24) detection 시점 server action runtime + build-time test cascade. (LL-25) LL-DEFER-08~10 본문 §1 비범위 표 반영. |
600-| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
601:| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
602:| 2026-05-16 | v0.5 | **Codex 비평 cycle4 8 findings (2 blocking + 4 major + 2 minor) 전건 수용 patch**: (LL-48) trigger RAISE EXCEPTION USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' 추가 — errors.ts mapDbErrorToResult 가 SQLSTATE 23514 + constraint name 으로 분기 가능. (LL-49) LL-CASCADE-04 target 정정 — ADMIN_UI_SKELETON_PLAN § 6 은 actions 영역으로 build/export 부재. 신규 `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 신설 + LL-CASCADE-04 책임 row 1건 cascade. acceptance 강도 = placeholder 작성. (LL-50) CT-03 enum SoT 정렬 — DB trigger 허용 11종 (phone/email/sms/kakao-talk/kakao-channel/naver-reservation/naver-talk/form/map/external/video-consultation) + UI subset 3종 분리. LL-DEFER-19 8종 UI 합류. (LL-51) form (b) UI copy 정정 — kakao → kakao-talk · naver-booking → naver-reservation 토큰. (LL-52) LL-DEFER-04/05 phase 충돌 정정 — §9.3 → M0 v1.0 본 구현 (LocationProfile 편집 화면) 으로 통일. M2 Phase Beta 표기 제거 (현재 비어 있음 — 외부 사용자 RBAC 가 M2). (LL-53) LL-CASCADE-05 강도 명시 — plan v1.0 acceptance = manifest spec 작성만 차단, 실 runner 코드는 LL-DEFER-20 (M0 v1.0). (LL-54) trigger function IMMUTABLE 마킹 제거 — VOLATILE 기본 (NEW 읽기 + row-specific RAISE 정합). (LL-55) Sentry pre-integration fallback 명시 — v0.5 단계 console/server stdout only, M0 v1.0 LL-DEFER-18 합류 후 Sentry capture. **누계 55 findings 전건 수용**. |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 1585ms:
63-| CT-01 | `TrustMetric` | 신뢰도·통계 지표 (기준·증빙 포함) | L1 정의 / L3 값 | ClinicProfile, LocationProfile, DoctorProfile |
64-| CT-02 | `BusinessHours` | 진료시간·접수시간·점심·휴진 | L1 정의 / L3 값 | LocationProfile |
65:| CT-03 | `CTAConfig` | 전환 채널 설정 | L1 정의 / L3 값 | ClinicProfile, LocationProfile, TreatmentPage |
66-
67----
--
134-| `@id` | `Slug` | ✅ | 지표 식별자 |
135-| `label` | `string` | ✅ | 표시 라벨 (예: "누적 진료 환자") |
136:| `value` | `number \| string` | ✅ | 값 |
137-| `unit` | `string` | optional | 단위 ("명", "건", "년", "%") |
138-| `measuredFrom` | `Date` | optional | 측정 시작일 |
--
145-
146-**컴플라이언스 룰**:
147:- `value`만 있고 `measuredFrom`·`scope`·`evidenceUrl/Note` 모두 없으면 **빌드 시 경고**.
148-- 단정형·과시형 라벨 ("국내 1위", "최대 누적") 시 자동 Medium 격상, 외부 검증 불일치 시 High 검토.
149-- 사실 안내형 표현 권장 ("누적 N명을 진료해왔습니다").
--
187-| `note` | `string` | optional | |
188-
189:### CT-03. `CTAConfig` — 전환 채널 설정
190-
191-**목적**: 전화·온라인 예약·외부 메신저 등 모든 전환 채널을 일관 모델링.
--
194-|---|---|:---:|---|
195-| `@id` | `Slug` | ✅ | 채널 식별자 |
196:| `type` | `enum {phone, naver-reservation, naver-talk, kakao-talk, kakao-channel, form, map, external, sms, email, video-consultation}` | ✅ | 채널 종류 |
197-| `label` | `string` | ✅ | 버튼·링크 텍스트 |
198:| `targetUrl` | `URL \| string` | ✅ | URL 또는 전화번호 |
199-| `iconKey` | `string` | optional | 아이콘 식별자 |
200-| `style` | `enum {primary, secondary, minimal}` | optional | |
--
205-| `consultationType` | `enum {appointment, inquiry, payment, support}` | optional | 채널 의도 |
206-
207:> v0.5에서 추가했던 `isFeatured: boolean` 필드는 **v0.6에서 제거**. CTAConfig가 여러 컨테이너(ClinicProfile.primaryCtas / LocationProfile.reservationChannels / TreatmentPage.cta)에서 재사용될 가능성을 고려할 때, 객체 자체에 컨텍스트 의존 의미(강조 여부)를 두면 재사용 시 의도 누수 위험. 대신 **컨테이너 쪽에 `featuredChannelId: Slug`로 강조 표시** (LocationProfile § 4 참조). CTAConfig 객체는 컨텍스트 무관 데이터로 유지.
208-
209----
--
237-| `internationalSupport` | `InternationalSupport` | optional | 외국인 환자 진료 지원 |
238-| `socialContribution` | `Markdown` | optional | 사회공헌·후원 |
239:| `primaryCtas` | `CTAConfig[]` | optional | 사이트 전반 주요 CTA |
240-| `locations` | `Ref<C-21>[]` | ✅ | 지점 목록. 단지점은 1개(`main`), 다지점은 N개. 반드시 1개 이상 |
241-| `logoUrl` | `URL` | ✅ | 로고 |
--
402-| `heroImageUrl` | `URL` | optional | |
403-| `ogImageUrl` | `URL` | optional | |
404:| `cta` | `CTAConfig` | optional | 예약·문의 CTA (CT-03) |
405-
406-**하위 타입**:
--
892-| `email` | `Email` | optional | 지점 이메일 |
893-| `businessHours` | `BusinessHours` | ✅ | 진료시간·접수·점심·휴진 (CT-02) |
894:| `reservationChannels` | `CTAConfig[]` | optional | 지점 예약·상담 채널 (CT-03) |
895-| `representativeDoctors` | `Ref<C-02>[]` | optional | 대표 원장 (1명 이상 가능) |
896-| `doctorsAtLocation` | `Ref<C-02>[]` | optional | 지점 소속 의료진 |
--
905-
906-> v0.4 → v0.6 강조 채널 표기 변천:
907:> - v0.4 이전: `featuredCta: Ref<CTAConfig>` (표기 규약 위반 — `Ref<C-NN>`은 C 계약만)
908:> - v0.5: `CTAConfig.isFeatured: boolean` (객체에 컨텍스트 의존 의미 — 재사용 시 누수 위험)
909:> - **v0.6 (현재)**: `LocationProfile.featuredChannelId: Slug` — **컨테이너에 두기**. CTAConfig는 컨텍스트 무관 데이터로 유지. reservationChannels[] 중 1개 채널의 @id 참조
910-
911-> **단지점 자동 생성 규칙** (PAGE_TYPES.md § 3 P-014 참조): 어드민이 ClinicProfile 입력 단계의 위치·연락·시간 입력값으로부터 `LocationProfile(slug=main)`을 자동 생성. M0에 별도 화면 추가 없음.
--
955-
956-### C-20. `ReservationPage`
957:필드: `channels[]` (CTAConfig[]), `bookingHours`, `preparationNotes`, `changeCancellationPolicy`, `emergencyGuidance?`.
958-
959-### C-23. `AdminUser` — 어드민 사용자 (v0.13 신규)
--
1006-ClinicProfile (C-01)
1007-   ├─ trustMetrics → TrustMetric[] (CT-01)
1008:   ├─ primaryCtas → CTAConfig[] (CT-03)
1009-   ├─ medicalSpecialty → MedicalSpecialty (C-14)
1010-   ├─ affiliatedInstitutes → ResearchInstitute
--
1013-LocationProfile (C-21) — 위치·시간·연락 SoT
1014-   ├─ businessHours → BusinessHours (CT-02)
1015:   ├─ reservationChannels → CTAConfig[] (CT-03)
1016-   ├─ parentClinic → ClinicProfile (C-01)
1017-   ├─ representativeDoctors → DoctorProfile[]
--
1025-
1026-TreatmentPage (C-03)
1027:   ├─ cta → CTAConfig (CT-03)
1028-   ├─ recommendedFor / treatmentComponents / visitFlow / programVariants / evidenceNotes (v0.4)
1029-   ├─ relatedDoctors → DoctorProfile[]
--
1070-| DM-12 | ~~LocationProfile SoT~~ | **v0.4 해소** — ClinicProfile에 위치·시간·연락 필드 제거. LocationProfile만 마스터 |
1071-| DM-13 | `EmbeddedMedia`·`externalUrl` 외부 콘텐츠 검수 룰 | 정책 필요 |
1072:| DM-14 | `CTAConfig.type` 확장 (해외 채널: 라인·왓츠앱 등) | M3 다국어 |
1073-| DM-15 | `TrustMetric` 빌드 시 검증 룰 — 누락 경고 vs 오류 | Phase Alpha |
1074-| DM-16 | `BusinessHours.openingHours` vs `receptionHours` UI 표시 규칙 | UI |
--
1085-| 2026-05-13 | v0.1 | 최초 — 20개 계약 |
1086-| 2026-05-13 | v0.2 | 레퍼런스 분석 반영 — C-21·C-22, 필드 추가 |
1087:| 2026-05-13 | v0.3 | DEEP_DIVE 1단계 — CT-01 TrustMetric·CT-02 BusinessHours·CT-03 CTAConfig 신설, AccumulatedStats 흡수 |
1088-| 2026-05-14 | v0.4 | **피드백 적용**: (1) **전체 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, (2) **SoT 정리** — ClinicProfile에서 mainAddress·mainTelephone·mainEmail·businessHours 제거. LocationProfile만 위치·시간·연락 마스터 (DM-12 해소), (3) **TreatmentPage 컨텍스트 필드 즉시 통합** — recommendedFor·treatmentComponents·visitFlow·programVariants·maintenancePlan·remoteCareAvailable·evidenceNotes (1호 다이어트 한의원 직결), (4) **Article 컨텍스트 필드 즉시 통합** — authorType·reviewedBy·reviewedAt·contentSource·externalUrl (E-E-A-T 강화), (5) **RiskLevel 직접 enum 사용** — `Ref<C-05>` 표기 전면 제거, (6) TreatmentComponent·VisitFlowStep·EvidenceNote 하위 타입 신설, (7) DM-18·DM-19 신규 |
1089:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
1090:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
1091-| 2026-05-14 | v0.7 | **피드백 정정**: **C-16 LegalDocument를 § 4 M0 핵심으로 이동 + 풀명세** — `documentType` enum, `body` 변수 치환 규약, `autoGenerated`·`templateVersion`, `revisions[]` 하위 타입, 발행 시 법무 검토 룰 명시. § 5 (M0 외 간략 명세)에는 자리 표시만 유지 |
1092-| 2026-05-14 | v0.8 | **피드백 정정**: § 4 내 C-16 위치를 C-22 뒤 → C-10 다음(C-21 앞)으로 이동, 번호 순 가독성 확보. § 5 자리표시도 한 줄 링크로 간소화 |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Test-Path docs/decisions/M0_BUILD_EXPORT_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n -C 4 "LL-CASCADE-04|LocationProfile|reservationChannels|primary_ctas|@id|parentClinic|Git output|signature|export|build" docs/decisions/M0_BUILD_EXPORT_PLAN.md' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n -C 3 \"migrations-manifest|manifest\\.ts|depends_on|sequential|C0001|C0002|C0004|C0005|C0006|C0007|C0008|D0010\" docs/decisions/LOCATION_LEGAL_PLAN.md packages/migrations-runner/src/index.ts package.json packages/migrations-runner/package.json" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg --files packages/migrations-runner | rg "manifest|migrations"' in C:\Users\assag\solution\website-exposure
2026-05-16T06:31:33.546141Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 1.8 seconds
Output:
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m
rg: docs/decisions/M0_BUILD_EXPORT_PLAN.md: IO error for operation on docs/decisions/M0_BUILD_EXPORT_PLAN.md: 지정된 파일을 찾을 수 없습니다. (os error 2)

 exited 1 in 1776ms:
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m
rg: docs/decisions/M0_BUILD_EXPORT_PLAN.md: IO error for operation on docs/decisions/M0_BUILD_EXPORT_PLAN.md: 지정된 파일을 찾을 수 없습니다. (os error 2)

 succeeded in 1797ms:
False
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 1745ms:
docs/decisions/LOCATION_LEGAL_PLAN.md-18-- `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0 (ADMIN-UI-15·62 marker · § 5.5 audit matrix · § 6.2 actions · § 8.1 RLS 시나리오)
docs/decisions/LOCATION_LEGAL_PLAN.md-19-- `docs/decisions/M0_SCHEMA_PLAN.md` v0.1
docs/decisions/LOCATION_LEGAL_PLAN.md-20-- 기존 packages 실 시그니처 (cycle1 직접 확인):
docs/decisions/LOCATION_LEGAL_PLAN.md:21:  - `packages/core-content/migrations/C0001_clinic_profile.sql` · `C0002_location_profile.sql` (location_profile 은 instance_id 만 FK · clinic_profile 직접 FK 없음 — cycle1 LL-01 patch 대상)
docs/decisions/LOCATION_LEGAL_PLAN.md-22-  - `apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts` (현재 단일 ClinicProfile upsert)
docs/decisions/LOCATION_LEGAL_PLAN.md-23-  - `apps/web/src/components/forms/ClinicProfileForm.tsx`
docs/decisions/LOCATION_LEGAL_PLAN.md-24-  - `apps/web/src/lib/{action-context,page-context,errors,tenant,save-result}.ts` (cycle v1.2 acceptance 패턴)
--
docs/decisions/LOCATION_LEGAL_PLAN.md-38-| 항목 | 비고 |
docs/decisions/LOCATION_LEGAL_PLAN.md-39-|---|---|
docs/decisions/LOCATION_LEGAL_PLAN.md-40-| ClinicProfileForm 3 섹션 재구성 | (a) 기관 정체성 (기존) / (b) 본원 위치·연락·시간 / (c) 정책 변수 (보조) |
docs/decisions/LOCATION_LEGAL_PLAN.md:41:| `legal_document` 테이블 신설 (C-16 minimal) | packages/core-content C0006 migration · RLS · 5종 documentType partial UNIQUE (cycle1 LL-08) |
docs/decisions/LOCATION_LEGAL_PLAN.md-42-| `clinic_profile` 정책 변수 + primaryCtas 컬럼 추가 | `policy_contact_person` · `policy_contact_email` · `policy_contact_phone` · `policy_effective_date` · `primary_ctas` (JSONB · cycle1 LL-02 patch) |
docs/decisions/LOCATION_LEGAL_PLAN.md-43-| `location_profile` clinic_profile_id 추가 | composite FK with instance_id — same-tenant parentClinic 보장 (cycle1 LL-01 patch) |
docs/decisions/LOCATION_LEGAL_PLAN.md-44-| `saveClinicProfile` actions 확장 | 단일 tx 안 ClinicProfile + LocationProfile(main) + 5종 LegalDocument upsert · 변수 치환 · audit 7 row 별도 emit (cycle1 LL-17 patch) |
--
docs/decisions/LOCATION_LEGAL_PLAN.md-74-### 2.1 `legal_document` 테이블 신설 (LL-SCHEMA-01)
docs/decisions/LOCATION_LEGAL_PLAN.md-75-
docs/decisions/LOCATION_LEGAL_PLAN.md-76-```sql
docs/decisions/LOCATION_LEGAL_PLAN.md:77:-- packages/core-content/migrations/C0006_legal_document.sql
docs/decisions/LOCATION_LEGAL_PLAN.md-78-
docs/decisions/LOCATION_LEGAL_PLAN.md-79-CREATE TYPE legal_document_type AS ENUM (
docs/decisions/LOCATION_LEGAL_PLAN.md-80-  'privacy', 'terms', 'non-covered', 'refund', 'complaint', 'cookie', 'other'
--
docs/decisions/LOCATION_LEGAL_PLAN.md-150-### 2.2 `clinic_profile` 정책 변수 + primaryCtas 컬럼 (LL-SCHEMA-08)
docs/decisions/LOCATION_LEGAL_PLAN.md-151-
docs/decisions/LOCATION_LEGAL_PLAN.md-152-```sql
docs/decisions/LOCATION_LEGAL_PLAN.md:153:-- packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql
docs/decisions/LOCATION_LEGAL_PLAN.md-154-
docs/decisions/LOCATION_LEGAL_PLAN.md-155-ALTER TABLE clinic_profile
docs/decisions/LOCATION_LEGAL_PLAN.md-156-  ADD COLUMN policy_contact_person TEXT,
--
docs/decisions/LOCATION_LEGAL_PLAN.md-237-### 2.3 `location_profile` clinic_profile_id 추가 + businessHours CT-02 SoT 변환 (LL-SCHEMA-13)
docs/decisions/LOCATION_LEGAL_PLAN.md-238-
docs/decisions/LOCATION_LEGAL_PLAN.md-239-```sql
docs/decisions/LOCATION_LEGAL_PLAN.md:240:-- packages/core-content/migrations/C0008_location_profile_parent_clinic.sql
docs/decisions/LOCATION_LEGAL_PLAN.md-241-
docs/decisions/LOCATION_LEGAL_PLAN.md-242--- cycle1 LL-01 + cycle2 LL-28 patch: parentClinic (C-21 required) 관계 모델 — same-tenant composite FK 보장.
docs/decisions/LOCATION_LEGAL_PLAN.md-243--- 모든 row clinic_profile_id NOT NULL (C-21 SoT). v0.2 의 'main 만 NOT NULL' 정책은 cycle2 LL-28 에서 reversal.
--
docs/decisions/LOCATION_LEGAL_PLAN.md-420-
docs/decisions/LOCATION_LEGAL_PLAN.md-421-**결정**:
docs/decisions/LOCATION_LEGAL_PLAN.md-422-- (LL-ACTION-18 · cycle2 LL-32 + cycle3 LL-43 patch) tx commit 후 7 row **순차 emit + per-row try/catch + 누락 시 fallback audit emit + 최종 안전망 3단계**:
docs/decisions/LOCATION_LEGAL_PLAN.md:423:  - 정상: 7 row 차례로 INSERT (Promise.all 아닌 sequential — 1 row 실패 시 stop 아님). 각 row try/catch.
docs/decisions/LOCATION_LEGAL_PLAN.md-424-  - 실패 row 발생 시 끝에 단일 `content-saved-partial` audit row INSERT — payload `{outcome: "partial", emitted: [<contentTypes>], failed: [<contentTypes>], reason: <error.code>}`. 운영 포렌식 안전망.
docs/decisions/LOCATION_LEGAL_PLAN.md-425-  - 모든 7 row 실패 시 `content-saved-failed` audit row 1건.
docs/decisions/LOCATION_LEGAL_PLAN.md-426-  - **3단계 안전망 (cycle3 LL-43 + cycle4 LL-55 patch — Sentry pre-integration fallback 명시)**:
--
docs/decisions/LOCATION_LEGAL_PLAN.md-493-
docs/decisions/LOCATION_LEGAL_PLAN.md-494-- `WEB_DATABASE_URL` · `SEED_DATABASE_URL` 변경 없음.
docs/decisions/LOCATION_LEGAL_PLAN.md-495-- **Migration 의존성 순서 (cycle2 LL-37 patch)**:
docs/decisions/LOCATION_LEGAL_PLAN.md:496:  1. `packages/db/migrations/D0010_instance.sql` (instance table) — precondition
docs/decisions/LOCATION_LEGAL_PLAN.md:497:  2. `packages/core-content/migrations/C0001_clinic_profile.sql` (clinic_profile) — precondition
docs/decisions/LOCATION_LEGAL_PLAN.md:498:  3. `packages/core-content/migrations/C0002_location_profile.sql` (location_profile) — precondition
docs/decisions/LOCATION_LEGAL_PLAN.md:499:  4. `packages/core-content/migrations/C0004_treatment_page.sql` (content_publication_status enum 생성) — **C0006 의 precondition**
docs/decisions/LOCATION_LEGAL_PLAN.md:500:  5. `packages/core-content/migrations/C0005_article.sql` (risk_level enum 생성) — **C0006 의 precondition**
docs/decisions/LOCATION_LEGAL_PLAN.md:501:  6. `packages/core-content/migrations/C0006_legal_document.sql` — legal_document table (status::content_publication_status + risk_level::risk_level FK)
docs/decisions/LOCATION_LEGAL_PLAN.md:502:  7. `packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql` — clinic_profile ALTER (policy_* + primary_ctas)
docs/decisions/LOCATION_LEGAL_PLAN.md:503:  8. `packages/core-content/migrations/C0008_location_profile_parent_clinic.sql` — location_profile ALTER (clinic_profile_id composite FK)
docs/decisions/LOCATION_LEGAL_PLAN.md:504:- 부분 적용 환경에서 C0006 을 C0004/C0005 보다 먼저 시도하면 enum 없음 에러 — migration runner 가 sequential apply 보장.
docs/decisions/LOCATION_LEGAL_PLAN.md-505-- packages 재빌드 (`pnpm pkg:build`) — `@glitzy/core-content/templates` 신규 export.
docs/decisions/LOCATION_LEGAL_PLAN.md-506-- seed (`pnpm web:seed`) 변경 없음 — instance + admin_user 만 생성.
docs/decisions/LOCATION_LEGAL_PLAN.md-507-
--
docs/decisions/LOCATION_LEGAL_PLAN.md-525-
docs/decisions/LOCATION_LEGAL_PLAN.md-526-| # | 작업 | 산출물 |
docs/decisions/LOCATION_LEGAL_PLAN.md-527-|---|---|---|
docs/decisions/LOCATION_LEGAL_PLAN.md:528:| 1 | C0006 legal_document migration | packages/core-content/migrations/C0006_legal_document.sql |
docs/decisions/LOCATION_LEGAL_PLAN.md:529:| 2 | C0007 clinic_profile policy + primaryCtas migration | packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql |
docs/decisions/LOCATION_LEGAL_PLAN.md:530:| 3 | C0008 location_profile clinic_profile_id migration | packages/core-content/migrations/C0008_location_profile_parent_clinic.sql |
docs/decisions/LOCATION_LEGAL_PLAN.md-531-| 4 | Core 표준 템플릿 5종 + render 엔진 + build-time unknown key test | packages/core-content/src/templates/* + tests |
docs/decisions/LOCATION_LEGAL_PLAN.md-532-| 5 | zod schema (businessHours · primaryCtas · policy vars · 5 LegalDocument override) | apps/web/src/lib/clinic-profile-schema.ts |
docs/decisions/LOCATION_LEGAL_PLAN.md-533-| 6 | ClinicProfileForm 3 섹션 + 5 LegalDocument record 재구성 (a11y marker 적용) | apps/web/src/components/forms/ClinicProfileForm.tsx |
--
docs/decisions/LOCATION_LEGAL_PLAN.md-548-- `LL-DEFER-15` (cycle2 LL-29 patch): location_profile 의 main slug 1 row 강제 DB trigger 또는 partial unique with `clinic_profile_id` 기반 cascade — v0.4 은 server action assertHasMainLocationAfterTx 안전망. M0 v1.0 본 구현에서 DB-level invariant 합류.
docs/decisions/LOCATION_LEGAL_PLAN.md-549-- `LL-DEFER-18` (cycle3 LL-43 patch): Sentry SDK 통합 (INFRA INFR-PROV `Sentry` Provider). audit partial/failed row INSERT 실패 시 capture 채널. M0 v1.0 본 구현 (provider 통합 시점).
docs/decisions/LOCATION_LEGAL_PLAN.md-550-- `LL-DEFER-19` (cycle4 LL-50 patch): primaryCtas UI subset 확장 — CT-03 11종 중 phone/kakao-talk/naver-reservation 외 8종 (`email`/`sms`/`kakao-channel`/`naver-talk`/`form`/`map`/`external`/`video-consultation`) 의 UI 입력 합류. M0 v1.0 본 구현 또는 M1 Phase Alpha.
docs/decisions/LOCATION_LEGAL_PLAN.md:551:- `LL-DEFER-20` (cycle4 LL-53 patch): packages/migrations-runner 실 runner 코드 — manifest spec 작성 (plan v1.0 acceptance precondition) 후 sequential apply + fail-fast 구현. M0 v1.0 본 구현.
docs/decisions/LOCATION_LEGAL_PLAN.md-552-
docs/decisions/LOCATION_LEGAL_PLAN.md-553-### 9.2 M1 Phase Alpha 합류
docs/decisions/LOCATION_LEGAL_PLAN.md-554-
--
docs/decisions/LOCATION_LEGAL_PLAN.md-589-- `LL-CASCADE-02`: `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` § 5.5 audit matrix — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed row 추가. **acceptance precondition**.
docs/decisions/LOCATION_LEGAL_PLAN.md-590-- `LL-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표 — LegalDocument 면제 marker 추가 (answer-first AST · 표현 검사 면제 · 변수 화이트리스트 별도 룰). **acceptance precondition**.
docs/decisions/LOCATION_LEGAL_PLAN.md-591-- `LL-CASCADE-04` (cycle3 LL-41 + cycle4 LL-49 patch): **cascade target 정정** — ADMIN_UI_SKELETON_PLAN § 6 은 walking skeleton 의 actions 영역으로 build/export 부재 → 본 plan v1.0 acceptance 시 **신규 plan `docs/decisions/M0_BUILD_EXPORT_PLAN.md` (placeholder)** 신설 + 본 plan 의 LL-CASCADE-04 marker reference. apps/worker · M0 v1.0 Git export 책임: LocationProfile.reservationChannels Git 출력 시 `clinic_profile.primary_ctas` deep clone, LocationProfile.@id = `"main"`, LocationProfile.parentClinic = ClinicProfile.@id reference, ClinicProfile.locations[] = SELECT 결과, primary_ctas DB key `id` → Git output `@id` alias 변환. **acceptance 강도 = placeholder 작성** (M0_BUILD_EXPORT_PLAN.md 의 LL-CASCADE-04 책임 명시 row 1건). 실 구현은 M0 v1.0 본 구현.
docs/decisions/LOCATION_LEGAL_PLAN.md:592:- `LL-CASCADE-05` (cycle3 LL-42 + cycle4 LL-53 patch): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장. **acceptance 강도 명시** — plan v1.0 acceptance 는 **manifest spec 작성까지만 차단** (manifest 파일 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` 의 spec 작성 + 본 plan 의 8단계 의존성 표 cascade). 실 runner 코드 구현은 M0 v1.0 cascade (LL-DEFER-20 신설). 즉 plan v1.0 acceptance ≠ runner 코드 acceptance.
docs/decisions/LOCATION_LEGAL_PLAN.md-593-
docs/decisions/LOCATION_LEGAL_PLAN.md-594-## 변경 이력
docs/decisions/LOCATION_LEGAL_PLAN.md-595-
--
docs/decisions/LOCATION_LEGAL_PLAN.md-597-|---|---|---|
docs/decisions/LOCATION_LEGAL_PLAN.md-598-| 2026-05-16 | v0.1 | 초안 작성. Codex 자동 비평 사이클 진입 전 base. |
docs/decisions/LOCATION_LEGAL_PLAN.md-599-| 2026-05-16 | v0.2 | **Codex 비평 cycle1 25 findings (7 blocking + 12 major + 6 minor) 전건 수용 patch**: (LL-01) location_profile 에 clinic_profile_id composite FK + main row CHECK, ClinicProfile.locations[] Git 출력 빌드 시점 동적 구성. (LL-02) ClinicProfile.primary_ctas 컬럼 + LocationProfile.reservationChannels = primary_ctas 자동 상속 marker. (LL-03·04) status='draft' 만 허용 (review-queued 도 차단) — ComplianceRecord pre-publish + NotificationEvent 합류 시점까지 defer. (LL-05) businessHours SoT CT-02 형식 (openingHours[]·receptionHours[]·lunchBreaks[]·specialClosures[]) 변환 + server action 안 convertToOpeningHoursSpec 명시. (LL-06) policy.* 변수 정당화 + LL-CASCADE-01 cascade marker. (LL-07) 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha. (LL-08·09) partial UNIQUE — closed 5종만. cookie/other LL-DEFER-12. (LL-10) C-21 출력 매핑표 명시. (LL-11) representativeDoctors v0.2 빈 배열. (LL-12) risk_level NOT NULL + CHECK 'Low' 만. (LL-13) SoT 경로 정정 (docs/core/CONTENT_STANDARDS.md) + LL-CASCADE-03. (LL-14) policyContactPhone form 단계 required. (LL-15) effective_date individual override 합류 (LL-DEFER-08 closed). (LL-16) 자동 재렌더링 분기 제거 (모든 row 매 저장 시 재렌더링). (LL-17) audit 7 row 별도 emit (Bundle outer 폐기). (LL-18) RBAC 분리 marker LL-DEFER-09 명시. (LL-19) published CHECK 위반 시 운영자 메시지 + errors.ts 매핑. (LL-20) phone regex 한국 + 국제 표기 명시. (LL-21) effective_date timezone Asia/Seoul. (LL-22) template_version naming autoGenerated=true 일 때만 필수. (LL-23) businessHours a11y marker. (LL-24) detection 시점 server action runtime + build-time test cascade. (LL-25) LL-DEFER-08~10 본문 §1 비범위 표 반영. |
docs/decisions/LOCATION_LEGAL_PLAN.md:600:| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
docs/decisions/LOCATION_LEGAL_PLAN.md:601:| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
docs/decisions/LOCATION_LEGAL_PLAN.md-602-| 2026-05-16 | v0.5 | **Codex 비평 cycle4 8 findings (2 blocking + 4 major + 2 minor) 전건 수용 patch**: (LL-48) trigger RAISE EXCEPTION USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' 추가 — errors.ts mapDbErrorToResult 가 SQLSTATE 23514 + constraint name 으로 분기 가능. (LL-49) LL-CASCADE-04 target 정정 — ADMIN_UI_SKELETON_PLAN § 6 은 actions 영역으로 build/export 부재. 신규 `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 신설 + LL-CASCADE-04 책임 row 1건 cascade. acceptance 강도 = placeholder 작성. (LL-50) CT-03 enum SoT 정렬 — DB trigger 허용 11종 (phone/email/sms/kakao-talk/kakao-channel/naver-reservation/naver-talk/form/map/external/video-consultation) + UI subset 3종 분리. LL-DEFER-19 8종 UI 합류. (LL-51) form (b) UI copy 정정 — kakao → kakao-talk · naver-booking → naver-reservation 토큰. (LL-52) LL-DEFER-04/05 phase 충돌 정정 — §9.3 → M0 v1.0 본 구현 (LocationProfile 편집 화면) 으로 통일. M2 Phase Beta 표기 제거 (현재 비어 있음 — 외부 사용자 RBAC 가 M2). (LL-53) LL-CASCADE-05 강도 명시 — plan v1.0 acceptance = manifest spec 작성만 차단, 실 runner 코드는 LL-DEFER-20 (M0 v1.0). (LL-54) trigger function IMMUTABLE 마킹 제거 — VOLATILE 기본 (NEW 읽기 + row-specific RAISE 정합). (LL-55) Sentry pre-integration fallback 명시 — v0.5 단계 console/server stdout only, M0 v1.0 LL-DEFER-18 합류 후 Sentry capture. **누계 55 findings 전건 수용**. |
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 succeeded in 1756ms:
packages/migrations-runner\tsconfig.tsbuildinfo
packages/migrations-runner\tsconfig.json
packages/migrations-runner\package.json
packages/migrations-runner\dist\index.d.ts
packages/migrations-runner\dist\index.js.map
packages/migrations-runner\dist\index.js
packages/migrations-runner\dist\index.d.ts.map
packages/migrations-runner\src\index.ts
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "clinic_profile_primary_ctas|legal_document_|clinic_profile_policy" apps/web/src/lib/errors.ts' in C:\Users\assag\solution\website-exposure
2026-05-16T06:31:49.158710Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 1.4 seconds
Output:
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

 exited 1 in 1375ms:
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n '\"postgres\"' package.json pnpm-lock.yaml apps/web/package.json packages/*/package.json" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "constraint_name|PostgresError|PostgresErrorFields|constraint" node_modules/postgres -g "*.d.ts" -g "*.js"' in C:\Users\assag\solution\website-exposure
2026-05-16T06:31:57.903233Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 1.2 seconds
Output:
apps/web/package.json:21:    "postgres": "^3.4.5",
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m
rg: packages/*/package.json: 파일 이름, 디렉터리 이름 또는 볼륨 레이블 구문이 잘못되었습니다. (os error 123)

 exited 1 in 1236ms:
apps/web/package.json:21:    "postgres": "^3.4.5",
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m
rg: packages/*/package.json: 파일 이름, 디렉터리 이름 또는 볼륨 레이블 구문이 잘못되었습니다. (os error 123)

2026-05-16T06:31:57.943694Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 1.3 seconds
Output:
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m
rg: node_modules/postgres: IO error for operation on node_modules/postgres: 지정된 파일을 찾을 수 없습니다. (os error 2)

 exited 1 in 1272ms:
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m
rg: node_modules/postgres: IO error for operation on node_modules/postgres: 지정된 파일을 찾을 수 없습니다. (os error 2)

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "constraint_name|PostgresError|constraint" apps/web/node_modules/postgres -g "*.d.ts" -g "*.js"' in C:\Users\assag\solution\website-exposure
 succeeded in 1073ms:
apps/web/node_modules/postgres\types\index.d.ts:201:  class PostgresError extends Error {
apps/web/node_modules/postgres\types\index.d.ts:202:    name: 'PostgresError';
apps/web/node_modules/postgres\types\index.d.ts:221:    constraint_name?: string | undefined;
apps/web/node_modules/postgres\types\index.d.ts:471:    | PostgresError
apps/web/node_modules/postgres\types\index.d.ts:704:    PostgresError: typeof PostgresError;
apps/web/node_modules/postgres\src\connection.js:46:  110 : 'constraint_name',   // n
apps/web/node_modules/postgres\src\errors.js:1:export class PostgresError extends Error {
apps/web/node_modules/postgres\src\errors.js:31:  const error = new PostgresError(x)
apps/web/node_modules/postgres\src\index.js:24:import { Errors, PostgresError } from './errors.js'
apps/web/node_modules/postgres\src\index.js:29:  PostgresError,
apps/web/node_modules/postgres\src\index.js:75:    PostgresError,
apps/web/node_modules/postgres\src\index.js:272:        throw e instanceof PostgresError && e.code === '25P02' && uncaughtError || e
apps/web/node_modules/postgres\cjs\src\connection.js:46:  110 : 'constraint_name',   // n
apps/web/node_modules/postgres\cjs\src\errors.js:1:const PostgresError = module.exports.PostgresError = class PostgresError extends Error {
apps/web/node_modules/postgres\cjs\src\errors.js:31:  const error = new PostgresError(x)
apps/web/node_modules/postgres\cf\src\connection.js:48:  110 : 'constraint_name',   // n
apps/web/node_modules/postgres\cjs\src\index.js:24:const { Errors, PostgresError } = require('./errors.js')
apps/web/node_modules/postgres\cjs\src\index.js:29:  PostgresError,
apps/web/node_modules/postgres\cjs\src\index.js:75:    PostgresError,
apps/web/node_modules/postgres\cjs\src\index.js:272:        throw e instanceof PostgresError && e.code === '25P02' && uncaughtError || e
apps/web/node_modules/postgres\cf\src\errors.js:1:export class PostgresError extends Error {
apps/web/node_modules/postgres\cf\src\errors.js:31:  const error = new PostgresError(x)
apps/web/node_modules/postgres\cf\src\index.js:25:import { Errors, PostgresError } from './errors.js'
apps/web/node_modules/postgres\cf\src\index.js:30:  PostgresError,
apps/web/node_modules/postgres\cf\src\index.js:76:    PostgresError,
apps/web/node_modules/postgres\cf\src\index.js:273:        throw e instanceof PostgresError && e.code === '25P02' && uncaughtError || e
[31;1mInvalidOperation: [31;1mCannot set property. Property setting is supported only on core types in this language mode.[0m

codex
{
  "cycle": 5,
  "closeableAfterPatch": false,
  "blockingFindings": [
    {
      "id": "LL-56",
      "finding": "LL-CASCADE-04 acceptance precondition인 `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder가 실제 repo에 없다. v0.5 본문은 plan v1.0 acceptance 시 placeholder 작성이 차단 조건이라고 명시하지만, 현재 파일은 `Test-Path` 기준 false다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:591",
      "impact": "plan 단독 acceptance 시 build/export 책임 SoT가 여전히 이 문서 내부 marker에만 남아 cascade closure가 성립하지 않는다. cycle4 LL-49가 전건 수용됐다고 보기 어렵고 closeableAfterPatch=false."
    }
  ],
  "newMajorFindings": [],
  "newMinorFindings": [
    {
      "id": "LL-57",
      "finding": "LL-DEFER-19가 §9.1 M0 v1.0 그룹에 있으면서 본문은 `M0 v1.0 본 구현 또는 M1 Phase Alpha`라고 적어 phase가 단일하게 닫히지 않는다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:550",
      "impact": "잔류 미결정 20개가 모두 phase 분류 완료라는 close 조건을 약하게 만든다. M0 v1.0 또는 M1 중 하나로 고정하거나, 8종을 세분해 phase별로 분리해야 한다."
    },
    {
      "id": "LL-58",
      "finding": "LL-DEFER-18/Sentry 합류 후 `console.error`가 breadcrumb/capture로 감긴다고만 되어 있고 SDK 초기화 위치 또는 wrapping 책임 모듈이 없다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:428",
      "impact": "v0.5 acceptance blocker는 아니지만 M0 v1.0에서 관측성 구현 범위가 다시 흔들릴 수 있다. `apps/web/src/lib/observability.ts` 같은 책임 위치를 LL-DEFER-18에 한 줄로 못박으면 충분하다."
    }
  ],
  "convergenceSignal": "8 → 3 findings로 수렴. LL-48, LL-50~55는 본문 의도 반영이 대체로 성립하고, 보안·법적 critical 잔존은 보이지 않는다. 단 LL-49의 실제 placeholder 부재가 acceptance precondition을 직접 막는다.",
  "nextCycleFocus": "M0_BUILD_EXPORT_PLAN placeholder 실제 파일 추가 + LL-DEFER-19 phase 단일화 + LL-DEFER-18 observability 책임 위치 한 줄 고정만 확인하면 closeableAfterPatch=true 후보."
}

검토 메모:

- LL-48 syntax는 맞습니다. PostgreSQL `RAISE ... USING CONSTRAINT = '...'`가 올바른 키이고, postgres.js v3.4.5는 protocol field `n`을 `constraint_name`으로 매핑합니다. 현재 `apps/web/src/lib/errors.ts`도 `constraint_name ?? constraint`를 읽으므로 방향은 정합합니다.
- LL-50의 DB 11종 / UI 3종 subset 분리는 DATA_MODEL CT-03 11종과 맞습니다. 다만 UI 외 타입을 “관리자/마이그레이션/후속 UI 경로에서 허용”한다는 운영 의도는 현재 문장으로도 대체로 읽힙니다.
- §9.3.1 빈 섹션은 “현재 비어 있음” 설명이 있어 blocker로 보지는 않았습니다.
- cascade 5개는 모두 acceptance precondition 문구가 있으나, LL-CASCADE-04는 요구 파일이 없어 이번 cycle의 유일한 blocker입니다.
tokens used
63,837
{
  "cycle": 5,
  "closeableAfterPatch": false,
  "blockingFindings": [
    {
      "id": "LL-56",
      "finding": "LL-CASCADE-04 acceptance precondition인 `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder가 실제 repo에 없다. v0.5 본문은 plan v1.0 acceptance 시 placeholder 작성이 차단 조건이라고 명시하지만, 현재 파일은 `Test-Path` 기준 false다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:591",
      "impact": "plan 단독 acceptance 시 build/export 책임 SoT가 여전히 이 문서 내부 marker에만 남아 cascade closure가 성립하지 않는다. cycle4 LL-49가 전건 수용됐다고 보기 어렵고 closeableAfterPatch=false."
    }
  ],
  "newMajorFindings": [],
  "newMinorFindings": [
    {
      "id": "LL-57",
      "finding": "LL-DEFER-19가 §9.1 M0 v1.0 그룹에 있으면서 본문은 `M0 v1.0 본 구현 또는 M1 Phase Alpha`라고 적어 phase가 단일하게 닫히지 않는다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:550",
      "impact": "잔류 미결정 20개가 모두 phase 분류 완료라는 close 조건을 약하게 만든다. M0 v1.0 또는 M1 중 하나로 고정하거나, 8종을 세분해 phase별로 분리해야 한다."
    },
    {
      "id": "LL-58",
      "finding": "LL-DEFER-18/Sentry 합류 후 `console.error`가 breadcrumb/capture로 감긴다고만 되어 있고 SDK 초기화 위치 또는 wrapping 책임 모듈이 없다.",
      "evidence": "docs/decisions/LOCATION_LEGAL_PLAN.md:428",
      "impact": "v0.5 acceptance blocker는 아니지만 M0 v1.0에서 관측성 구현 범위가 다시 흔들릴 수 있다. `apps/web/src/lib/observability.ts` 같은 책임 위치를 LL-DEFER-18에 한 줄로 못박으면 충분하다."
    }
  ],
  "convergenceSignal": "8 → 3 findings로 수렴. LL-48, LL-50~55는 본문 의도 반영이 대체로 성립하고, 보안·법적 critical 잔존은 보이지 않는다. 단 LL-49의 실제 placeholder 부재가 acceptance precondition을 직접 막는다.",
  "nextCycleFocus": "M0_BUILD_EXPORT_PLAN placeholder 실제 파일 추가 + LL-DEFER-19 phase 단일화 + LL-DEFER-18 observability 책임 위치 한 줄 고정만 확인하면 closeableAfterPatch=true 후보."
}

검토 메모:

- LL-48 syntax는 맞습니다. PostgreSQL `RAISE ... USING CONSTRAINT = '...'`가 올바른 키이고, postgres.js v3.4.5는 protocol field `n`을 `constraint_name`으로 매핑합니다. 현재 `apps/web/src/lib/errors.ts`도 `constraint_name ?? constraint`를 읽으므로 방향은 정합합니다.
- LL-50의 DB 11종 / UI 3종 subset 분리는 DATA_MODEL CT-03 11종과 맞습니다. 다만 UI 외 타입을 “관리자/마이그레이션/후속 UI 경로에서 허용”한다는 운영 의도는 현재 문장으로도 대체로 읽힙니다.
- §9.3.1 빈 섹션은 “현재 비어 있음” 설명이 있어 blocker로 보지는 않았습니다.
- cascade 5개는 모두 acceptance precondition 문구가 있으나, LL-CASCADE-04는 요구 파일이 없어 이번 cycle의 유일한 blocker입니다.
