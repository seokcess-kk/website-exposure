Reading prompt from stdin...
OpenAI Codex v0.130.0
--------
workdir: C:\Users\assag\solution\website-exposure
model: gpt-5.5
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, C:\Users\assag\.codex\memories]
reasoning effort: none
reasoning summaries: none
session id: 019e390a-acb2-7920-9463-fa4a7d446214
--------
user
You are reviewing the **code implementation** of `docs/decisions/LOCATION_LEGAL_PLAN.md v1.0`. This is **cycle 2** — cycle 1 had 14 findings (blocking=4, major=8, minor=2). All findings were patched. Verify convergence and surface remaining issues.

## Cycle 1 findings recap

| # | severity | title | patch summary |
|---|---|---|---|
| LLC-01 | blocking | ARCH § 3.8.2 변수 화이트리스트 11개 cascade | ARCH § 3.8.2 body 행 + 별도 화이트리스트 표 추가 (clinic 4 + location 3 + policy 4) |
| LLC-02 | blocking | ADMIN_UI § 5.5 audit matrix cascade | LocationProfile/LegalDocument/content-saved-partial/content-saved-failed 4 row 추가 |
| LLC-03 | blocking | CONTENT_STANDARDS § 7 LegalDocument 면제 | § 7.1.1.1 신설 — answer-first AST · 표현 검사 · RiskRule · RiskInference 면제 표 + 변수 화이트리스트 별도 룰 |
| LLC-04 | blocking | migrations-runner manifest spec | `packages/migrations-runner/src/manifest.ts` 신설 — 9-step ordered migrations (D0010 → C0001 → C0002 → C0003 → C0004 → C0005 → C0006 → C0007 → C0008) + dependsOn + validateManifest |
| LLC-05 | major | effectiveDate override 가 body 에 미반영 | `actions.ts` 의 docType 루프 안에서 override 적용 후 doc 별 renderCtx 생성 → renderTemplate 호출 |
| LLC-06 | major | LegalDocument upsert ON CONFLICT slug 만 | `ON CONFLICT (instance_id, document_type) WHERE document_type IN (5종) DO UPDATE` 로 변경 |
| LLC-07 | major | build-time template 검증 build gate 미연결 | `packages/core-content/package.json` build script 끝에 `node dist/templates/__tests__.js` 체이닝 |
| LLC-08 | major | businessHours/details a11y | businessHours row 의 휴진 checkbox `aria-controls`/`aria-expanded`, input `aria-describedby`, 에러 메시지 `role="alert"`. LegalDocument details summary `aria-controls`, 본문 group `role="group"` + `aria-labelledby` |
| LLC-09 | major | fallback audit payload reason 누락 | `failedDetails[]` 와 `reason` (첫 실패 code/name) 추가 |
| LLC-10 | major | LocationProfile.phone DB CHECK 없음 | C0002 에 `location_profile_phone_format` CHECK + drizzle schema + errors.ts 매핑 |
| LLC-11 | major | effective_date DB default Asia/Seoul | C0006 에 `DEFAULT ((CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Seoul')::date)` + drizzle schema 주석 |
| LLC-12 | major | tenant B 403 보장 불명확 | 명시적 `ForbiddenAccessPage` 컴포넌트 분리 + Next 14 한계 + LL-DEFER-21 marker (Next 15 unauthorized()/forbidden() cascade) |
| LLC-13 | minor | C0008 backfill preflight 명시 | C0008 주석에 preflight UPDATE 쿼리 + fail-fast 의도 명시 |
| LLC-14 | minor | Drizzle FK deferrable marker | `schema.ts` 의 clinicFk 주석 강화 (Drizzle 미지원 + raw SQL SoT + migrations-runner 책임) |

## Re-review scope

다음 파일과 docs 를 다시 읽고 cycle 1 patch 가 제대로 적용됐는지 + 새 finding 이 생기지 않았는지 검증하라.

### Code
1. `packages/core-content/migrations/C0002_location_profile.sql`
2. `packages/core-content/migrations/C0006_legal_document.sql`
3. `packages/core-content/migrations/C0008_location_profile_parent_clinic.sql`
4. `packages/core-content/src/schema.ts`
5. `packages/core-content/src/templates/{index.ts, render.ts, bodies.ts, __tests__.ts}`
6. `packages/core-content/package.json`
7. `packages/migrations-runner/src/index.ts`
8. `packages/migrations-runner/src/manifest.ts` (신규)
9. `apps/web/src/lib/clinic-profile-schema.ts`
10. `apps/web/src/lib/errors.ts`
11. `apps/web/src/components/forms/ClinicProfileForm.tsx`
12. `apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/page.tsx`
13. `apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts`

### Docs
14. `docs/admin/ARCHITECTURE.md` § 3.8.2 (LL-CASCADE-01)
15. `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` § 5.5 (LL-CASCADE-02)
16. `docs/core/CONTENT_STANDARDS.md` § 7.1.1.1 (LL-CASCADE-03)
17. `docs/decisions/M0_BUILD_EXPORT_PLAN.md` (LL-CASCADE-04 — cycle 1 통과)
18. `docs/decisions/LOCATION_LEGAL_PLAN.md` (plan v1.0 SoT — patch 가 본 plan 의 결정과 충돌하지 않는지)

## What to check (cycle 2)

1. **cycle 1 patch 가 plan SoT 와 일관**한지 — 특히:
   - LLC-05 patch: doc 별 renderCtx 분리 후 `policy.effectiveDate` 값이 DB `effective_date` 와 정확히 일치
   - LLC-06 patch: `ON CONFLICT (instance_id, document_type) WHERE ...` 의 partial UNIQUE constraint syntax 가 Postgres syntax 정확성
   - LLC-08 patch: 새로 추가한 ARIA 속성이 WCAG 2.1 / WAI-ARIA 표준 정합
   - LLC-09 patch: `failedDetails[]` 구조가 추후 Sentry breadcrumb 으로 직렬화 가능
   - LLC-11 patch: DB default 의 `(CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Seoul')::date` syntax 가 Postgres 13+ 호환
   - LLC-12 patch: `LL-DEFER-21` 신설은 plan 변경이지만 plan 자체 patch 가 안 된 상태 — 새 finding 가능
   - LLC-04 manifest: `validateManifest` 가 dependsOn 검증 sound 한지, C0003 추가가 plan § 6 (8단계) 와 어긋나는 의도가 있는지

2. **회귀 (regression)**:
   - LLC-05 patch 후 `RenderContext` 타입 호환 (policy.effectiveDate 가 doc 별 dynamic 으로 변경됨)
   - form a11y patch 후 기존 시각적 레이아웃 깨짐 가능성
   - LLC-12 의 ForbiddenAccessPage 가 server component 안 호출 OK 한지

3. **새 cascade 결정 (LL-DEFER-21)**:
   - LLC-12 patch 의 LL-DEFER-21 marker 가 plan 본문에 반영 안 됨 — plan v1.0 patch 가 acceptance commit 안에 동반되어야 하는지 (cycle 7 patch?)

4. **plan acceptance precondition cascade (LL-CASCADE-01~05)** 전수 점검:
   - LL-CASCADE-01: docs/admin/ARCHITECTURE.md § 3.8.2 — patch 후 11개 변수 화이트리스트 보존?
   - LL-CASCADE-02: docs/decisions/ADMIN_UI_SKELETON_PLAN.md § 5.5 — 4 row 추가 보존?
   - LL-CASCADE-03: docs/core/CONTENT_STANDARDS.md — § 7.1.1.1 새로 신설된 위치가 적절한가?
   - LL-CASCADE-04: docs/decisions/M0_BUILD_EXPORT_PLAN.md — 통과 (cycle 1)
   - LL-CASCADE-05: packages/migrations-runner — manifest 작성 완료. validateManifest call site 가 있는가? 없으면 spec 만으로 acceptance 충분한가 (LL-DEFER-20 cascade)?

## Output format

```
# LOCATION_LEGAL code v1.0 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세 추적: cycle1=14 (4+8+2) → cycle2=N (B+M+m)

## cycle 1 patch 검증
- LLC-01 ~ LLC-14 각각 PASS / FAIL / PARTIAL 판정 + 근거 한 줄

## new blocking / major / minor
(있을 경우 LLC-15+ 부터 번호 부여)

## acceptance precondition (LL-CASCADE-01~05) 재점검
- LL-CASCADE-01: <PASS|FAIL>
- LL-CASCADE-02: <PASS|FAIL>
- LL-CASCADE-03: <PASS|FAIL>
- LL-CASCADE-04: <PASS|FAIL>
- LL-CASCADE-05: <PASS|FAIL>
```

cycle 1 의 14 findings 가 모두 PASS 이고 새 blocking/major 0 이면 closeableAfterPatch=true. minor 만 잔존하면 다음 cycle 에서 마무리.

가능한 한 광범위하게 보고, 추측이 아니라 파일을 실제로 읽고 line 단위로 인용하라. 한국어로 응답.

codex
요청 범위가 코드 리뷰라서 실제 파일 기준으로 확인하겠습니다. 먼저 관련 파일의 현재 상태와 라인 번호를 뽑아 cycle 1 패치 적용 여부부터 검증하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"LocationProfile|LegalDocument|content-saved-partial|content-saved-failed|LL-CASCADE|LL-DEFER|effectiveDate|effective_date|ON CONFLICT|validateManifest|dependsOn|ForbiddenAccessPage|aria-controls|aria-expanded|aria-describedby|role=\\\"alert\\\"|role=\\\"group\\\"|phone_format|CURRENT_TIMESTAMP AT TIME ZONE|deferrable|D0010|C0001|C0002|C0003|C0004|C0005|C0006|C0007|C0008\" docs packages apps -g \"*.md\" -g \"*.ts\" -g \"*.tsx\" -g \"*.sql\" -g \"package.json\"" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg --files packages/core-content apps/web/src docs packages/migrations-runner | rg \"(C0002_location_profile\\.sql|C0006_legal_document\\.sql|C0008_location_profile_parent_clinic\\.sql|schema\\.ts|templates/(index|render|bodies|__tests__)\\.ts|package\\.json|migrations-runner/src/(index|manifest)\\.ts|clinic-profile-schema\\.ts|errors\\.ts|ClinicProfileForm\\.tsx|clinic-profile/(page|actions)\\.tsx|ARCHITECTURE\\.md|ADMIN_UI_SKELETON_PLAN\\.md|CONTENT_STANDARDS\\.md|M0_BUILD_EXPORT_PLAN\\.md|LOCATION_LEGAL_PLAN\\.md)"'$"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'git status --short' in C:\Users\assag\solution\website-exposure
2026-05-18T03:04:36.142560Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.6 seconds
Output:
rg: regex parse error:
    (?:LocationProfile|LegalDocument|content-saved-partial|content-saved-failed|LL-CASCADE|LL-DEFER|effectiveDate|effective_date|ON CONFLICT|validateManifest|dependsOn|ForbiddenAccessPage|aria-controls|aria-expanded|aria-describedby|role=\)
    ^
error: unclosed group

 exited 1 in 578ms:
rg: regex parse error:
    (?:LocationProfile|LegalDocument|content-saved-partial|content-saved-failed|LL-CASCADE|LL-DEFER|effectiveDate|effective_date|ON CONFLICT|validateManifest|dependsOn|ForbiddenAccessPage|aria-controls|aria-expanded|aria-describedby|role=\)
    ^
error: unclosed group

 exited 1 in 583ms:
fatal: not a git repository (or any of the parent directories): .git

 succeeded in 591ms:
packages/migrations-runner\package.json
docs\ARCHITECTURE.md
docs\admin\ARCHITECTURE.md
docs\core\CONTENT_STANDARDS.md
packages/core-content\migrations\C0008_location_profile_parent_clinic.sql
packages/core-content\migrations\C0006_legal_document.sql
packages/core-content\migrations\C0002_location_profile.sql
packages/core-content\package.json
packages/core-content\src\schema.ts
docs\decisions\M0_BUILD_EXPORT_PLAN.md
docs\decisions\LOCATION_LEGAL_PLAN.md
docs\decisions\ADMIN_UI_SKELETON_PLAN.md
apps/web/src\lib\errors.ts
apps/web/src\lib\clinic-profile-schema.ts
apps/web/src\components\forms\ClinicProfileForm.tsx

2026-05-18T03:04:36.145082Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.6 seconds
Output:
fatal: not a git repository (or any of the parent directories): .git

codex
첫 검색에서 따옴표 이스케이프가 깨졌고, 현재 디렉터리는 git 루트로 인식되지 않습니다. 리뷰에는 영향 없으니 PowerShell의 라인 번호 출력으로 필요한 파일을 직접 읽겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$files=@('"'packages/core-content/migrations/C0002_location_profile.sql','packages/core-content/migrations/C0006_legal_document.sql','packages/core-content/migrations/C0008_location_profile_parent_clinic.sql','packages/core-content/src/schema.ts','packages/core-content/src/templates/index.ts','packages/core-content/src/templates/render.ts','packages/core-content/src/templates/bodies.ts','packages/core-content/src/templates/__tests__.ts','packages/core-content/package.json','packages/migrations-runner/src/index.ts','packages/migrations-runner/src/manifest.ts'); foreach("'$f in $files){ if(Test-Path $f){ Write-Output "### $f"; $i=1; Get-Content $f | ForEach-Object { '"'{0,5}: {1}' -f "'$i++, $_ } } else { Write-Output "### MISSING $f" } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$files=@('"'apps/web/src/lib/clinic-profile-schema.ts','apps/web/src/lib/errors.ts','apps/web/src/components/forms/ClinicProfileForm.tsx','apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/page.tsx','apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts'); foreach("'$f in $files){ if(Test-Path -LiteralPath $f){ Write-Output "### $f"; $i=1; Get-Content -LiteralPath $f | ForEach-Object { '"'{0,5}: {1}' -f "'$i++, $_ } } else { Write-Output "### MISSING $f" } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$files=@('"'docs/admin/ARCHITECTURE.md','docs/decisions/ADMIN_UI_SKELETON_PLAN.md','docs/core/CONTENT_STANDARDS.md','docs/decisions/M0_BUILD_EXPORT_PLAN.md','docs/decisions/LOCATION_LEGAL_PLAN.md'); foreach("'$f in $files){ if(Test-Path $f){ Write-Output "### $f"; $i=1; Get-Content $f | ForEach-Object { if($_ -match '"'3\\.8\\.2|LL-CASCADE|LL-DEFER|LocationProfile|LegalDocument|content-saved-partial|content-saved-failed|7\\.1\\.1\\.1|effectiveDate|effective_date|C0003|C0008|migrations-runner|manifest|8-step|8단계|9-step|9단계|D0010|C0001|C0002|C0004|C0005|C0006|C0007'){ '{0,5}: {1}' -f "'$i, $_ }; $i++ } } else { Write-Output "### MISSING $f" } }' in C:\Users\assag\solution\website-exposure
 succeeded in 716ms:
### docs/admin/ARCHITECTURE.md
  125: | ② | 사이트 기본 정보 | 의료기관 정체성 + 본원 위치·연락·시간 + 정책 변수 입력 (3 섹션) | `ClinicProfile` + `LocationProfile`(main) + `LegalDocument`(privacy·terms 등) | 3 계약 동시 출력 — § 3.8.1 / § 3.8.2 자동 생성 규칙 적용 |
  137: | `ClinicProfile` (C-01) | 기관명·전문분야·간략 소개·로고·기관 메타 (브랜드·정체성만 — 위치·시간·연락은 LocationProfile이 SoT) | | ClinicProfile 화면 (기관 정체성 섹션) |
  138: | `LocationProfile`(slug=`main`) (C-21) | 본원 주소·전화·이메일·진료시간(`BusinessHours`)·예약 채널(`CTAConfig[]`) | ✅ (ClinicProfile 폼의 "본원 위치·연락·시간" 섹션에서 자동) | ClinicProfile 화면 (본원 위치 섹션) — § 3.8.1 |
  139: | `LegalDocument` (C-16) | `documentType`·`title`·`effectiveDate`·`contactPerson` (`body`는 Core 표준 템플릿 + 변수 자동 치환) | ✅ (Core 표준 템플릿 + ClinicProfile + LocationProfile 변수) | ClinicProfile 화면 (정책 변수 보조 섹션) — § 3.8.2 |
  144: | `ComplianceRecord` (C-10) | 위험도·자동 검수 결과·검수자·일자·발행자·발행일 (LegalDocument는 `legalCounsel`·`legalCounselAt` 필수 — § 3.8.2) | ✅ (어드민이 발행 시 기록) | 미리보기·발행 화면 |
  183: | 7 | **P-012 Contact (Conversion Hub)** | ClinicProfile + LocationProfile[] 참조. 다중 CTA 채널 노출 |
  184: | 8 | **P-014 Location Detail (main 자동)** | LocationProfile(slug=`main`) 1개 자동 생성. 어드민 화면 추가 없음 (§ 3.8.1 규칙) |
  185: | **9** | **P-013 Legal / Policy (자동 생성)** | **출시 게이트** — Core 표준 템플릿 + ClinicProfile 변수 치환. 법무 검토 필수 (§ 3.8.2 규칙) |
  190: ### 3.8.1 LocationProfile(main) 자동 생성 규칙
  193: > - **계약 필드 (Git 출력)**: `core/DATA_MODEL.md` C-01 ClinicProfile (브랜드·메타만) + C-21 LocationProfile (위치·시간·연락 마스터) — SoT는 LocationProfile.
  194: > - **어드민 폼 입력 필드 (UI 수집)**: 어드민의 "ClinicProfile 입력" 화면은 **두 섹션**으로 구성된다 — (a) 기관 정체성 섹션 (ClinicProfile 계약 필드) + (b) 본원 위치·연락·시간 섹션 (LocationProfile main 생성용 입력). 폼 한 화면, 출력은 **두 개 파일** (ClinicProfile + LocationProfile main).
  200: **(2) `LocationProfile`(slug=`main`) 파일** — 다음 규칙으로 자동 생성:
  202: | LocationProfile 필드 | 자동 생성 값 (어드민 폼의 "본원 위치·연락·시간" 섹션 입력값) |
  215: **다지점 확장 시 (Phase Beta+)**: 별도 LocationProfile 추가 입력 화면 도입. M0에서는 단일 main만 지원.
  217: **구현 책임**: 어드민이 ClinicProfile 폼 발행 트리거 시점에 두 파일(ClinicProfile + LocationProfile main)을 동시 출력해 Git에 함께 커밋. 운영자는 두 파일을 직접 편집해서 override 가능.
  219: ### 3.8.2 LegalDocument 자동 생성 규칙
  223: | LegalDocument 필드 | 자동 생성 값 |
  228: | `body` | Core 표준 템플릿 본문 + **ClinicProfile 변수** (`{{clinic.name}}`·`{{clinic.legalEntityName}}`·`{{clinic.businessRegistrationNumber}}`·`{{clinic.founder}}`) + **LocationProfile(main) 변수** (`{{location.main.email}}`·`{{location.main.address}}`·`{{location.main.telephone}}`) + **Policy 변수** (`{{policy.contactPerson}}`·`{{policy.contactEmail}}`·`{{policy.contactPhone}}`·`{{policy.effectiveDate}}`) — 출처 SoT 준수 |
  229: | `effectiveDate` | 클라이언트 첫 발행 시 명시 입력 또는 발행 일자 |
  232: **Body 변수 화이트리스트 reference (LL-CASCADE-01 · LOCATION_LEGAL_PLAN v1.0 § 5 SoT)** — 본문 `body` 에 허용된 11개 변수. 등록되지 않은 키는 `renderTemplate` 이 `TemplateRenderError("unknown-variable")` 으로 거부한다.
  240: | location | `{{location.main.address}}` | LocationProfile(main).streetAddress 등 결합 |
  241: | location | `{{location.main.telephone}}` | LocationProfile(main).phone |
  242: | location | `{{location.main.email}}` | LocationProfile(main).email |
  243: | policy | `{{policy.contactPerson}}` | ClinicProfile.policyContactPerson — § 3.8.2 "정책 변수" 보조 섹션 입력 |
  246: | policy | `{{policy.effectiveDate}}` | ClinicProfile.policyEffectiveDate (LegalDocument 별 override 우선) |
  251: - LegalDocument는 위험도 기본 Low이지만, **법무 검토 필수**. 표준 위험도 룰(High일 때만 권장)과 별도 예외 게이트.
  253:   - `contentType` = `LegalDocument`
  348: | ClinicProfile 화면 | (a) 기관 정체성 / (b) 본원 위치·연락·시간 / (c) 정책 변수 (보조) | `ClinicProfile` + `LocationProfile`(main) + `LegalDocument`(privacy·terms 등 자동 생성) |
  371: - 인스턴스 manifest 버전 표시
  414: | `InstanceManifest` | YAML 또는 JSON |
  503: | 2026-05-14 | v0.4 | **PAGE_TYPES v0.5 + DATA_MODEL v0.4 연동 갱신**: (1) § 3.8 Slice 사이트 측 페이지 타입 7종+1샘플 → **8종+1샘플=9개 페이지** (P-014 Location Detail 추가), (2) **§ 3.8.1 LocationProfile(main) 자동 생성 규칙 명시** — 어드민 화면 추가 없이 ClinicProfile 입력으로 자동 생성, (3) § 3.11 완료 게이트 #1 8종 빌드로 수정. 어드민 화면 수 6개는 그대로 유지 | Glitzy (Claude 페어링) |
  504: | 2026-05-14 | v0.5 | **피드백 정정**: (1) **§ 3.8.1 표현 정리** — 계약 필드(파일 출력)와 어드민 폼 입력 필드(UI 수집)의 구분 명시. ClinicProfile 폼은 두 섹션(기관 정체성 + 본원 위치·연락·시간)으로 출력은 ClinicProfile + LocationProfile main 두 파일, (2) **§ 3.8.2 LegalDocument 자동 생성 규칙 신규** — Core 표준 템플릿 + ClinicProfile 변수 치환, ComplianceRecord 추적, (3) **§ 3.8 Slice 9종+1샘플 → 10종+1샘플=10페이지** (P-013 격상 추가), (4) § 3.11 완료 게이트 #1 10종, (5) **§ 5.2 데이터 입력 영역** — 어드민 화면별 입력·출력 매핑 표 추가로 1:1이 아님 명시 | Glitzy (Claude 페어링) |
  505: | 2026-05-14 | v0.6 | **피드백 정정**: (1) **§ 3.3 ClinicProfile 행 분리** — 이전 v0.3 잔존 표현(ClinicProfile에 주소·전화·시간)을 SoT 정합으로 정정. ClinicProfile/LocationProfile(main)/LegalDocument 3개 계약 행 + 자동 생성 표시, (2) **§ 3.8.2 LegalDocument body 변수 출처 정정** — ClinicProfile + LocationProfile(main) 두 SoT 명시 (`{{clinic.*}}`·`{{location.main.*}}` 네임스페이스), (3) **§ 3.8.2 법무 검토 강제 룰** — LegalDocument는 위험도 Low이지만 ComplianceRecord.legalCounsel·legalCounselAt 필수 (어드민 발행 게이트 차단) | Glitzy (Claude 페어링) |
  506: | 2026-05-14 | v0.7 | **피드백 정정**: § 3.2 Slice 6개 화면 표 — ② 사이트 기본 정보의 입력 데이터 `ClinicProfile`만 → **`ClinicProfile` + `LocationProfile`(main) + `LegalDocument`** 3 계약 동시 출력로 정정. § 3.8.1/§ 3.8.2와 정합 | Glitzy (Claude 페어링) |
### docs/decisions/ADMIN_UI_SKELETON_PLAN.md
    7: > **본 skeleton의 위상 명시**: 이 walking skeleton의 ClinicProfile 폼은 admin/ARCHITECTURE § 3.2 화면 ②의 **완성이 아닌 auth/RLS/form wiring proof**다. 화면 ② 완성은 ClinicProfile + LocationProfile(main) + LegalDocument 3계약 동시 출력을 요구하며 M0 v1.0 본 구현에서 합류한다 (ADMIN-UI-15).
   17: - `docs/admin/ARCHITECTURE.md` v0.7 (§ 3 Vertical Slice · § 3.2 화면 ② 3계약 동시 출력 · § 3.8.1/3.8.2 자동 생성 규칙 · § 7 인증·권한 · § 10 미결정) — admin 위상 SoT
   32:   - `packages/core-content/migrations/C0001_clinic_profile.sql` `GRANT SELECT,INSERT,UPDATE,DELETE ON clinic_profile TO app_tenant_user` + `USING/WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)` (cycle8 정정 ADMIN-UI-102 — NULLIF 패턴은 unset context 의 silent deny 를 보장하며 § 8.1 시나리오의 fail-closed 전제)
   53: > **M0 화면 ② 축소판 marker (ADMIN-UI-15)**: skeleton의 ClinicProfile 폼은 single contract(ClinicProfile DB row) 만 저장하며, admin/ARCHITECTURE § 3.2의 "ClinicProfile + LocationProfile(main) + LegalDocument 3계약 동시 출력" 은 M0 v1.0 본 구현에서 합류한다.
   59: | LocationProfile(main) 자동 생성 (admin/ARCH § 3.8.1) | M0 v1.0 |
   60: | LegalDocument 자동 생성 (admin/ARCH § 3.8.2) — **skeleton 은 발행/출시 판단 없음**: P-013 Legal/Policy 는 admin/ARCH 의 출시 게이트지만 skeleton 에는 발행 자체가 없으므로 release readiness 의미 없음 (ADMIN-UI-62) | M0 v1.0 |
  274:   // instance table 은 control-plane scope RLS (D0010_instance.sql) — admin role 로 직접 SELECT 가능
  373: | `content-saved` (contentType=`LocationProfile`·`LegalDocument`) — LL-CASCADE-02 patch | audit_event | apps/web 의 ClinicProfile save 액션 (LOCATION_LEGAL_PLAN v1.0) — 3계약 동시 저장 시 LocationProfile 1 row + LegalDocument 5 row (closed 5종) 별도 emit. LocationProfile payload `{contentType:"LocationProfile", slug:"main", mode, status:null, originalSlug:"main", updatedAtBefore/After}`. LegalDocument payload `{contentType:"LegalDocument", slug, mode, status:"draft", originalSlug, documentType, templateVersion}` |
  374: | `content-saved-partial` (LL-CASCADE-02 patch) | audit_event | apps/web ClinicProfile save 액션 — 7 row sequential emit 중 일부 실패 시 fallback. payload `{outcome:"partial", emitted:[], failed:[], reason, failedDetails:[{target, code, name, message}]}` (LL-ACTION-18) |
  375: | `content-saved-failed` (LL-CASCADE-02 patch) | audit_event | apps/web ClinicProfile save 액션 — 7 row 모두 실패 시 fallback. payload `{outcome:"failed", emitted:[], failed:[], reason, failedDetails:[{target, code, name, message}]}` |
  603: | `instance` | `packages/db/migrations/D0010_instance.sql` | M0_SCHEMA v0.1 |
  604: | `clinic_profile` · `location_profile` · `doctor_profile` · `treatment_page` · `article` | `packages/core-content/migrations/C0001~C0005.sql` | M0_SCHEMA v0.1 |
  706: | 2026-05-15 | v0.4 | **cycle3 patch (18 findings · major 12 · minor 6 · nit 0 전건 처리)**: (1) ADMIN-UI-45 § 5.4 audit reason taxonomy vs UI deny reason 분리 명시 — packages/auth audit internal reason 4종(user-not-found · super-admin-not-switched · super-admin-selected-mismatch · membership-not-found-or-inactive) 별도 마커, packages/auth v0.3 normalize cascade, (2) ADMIN-UI-46 peekSessionUserId → getActiveSession 사용으로 § 6.2 정정, (3) ADMIN-UI-47 admin_user upsert 를 withServiceRole(adminUserUpsert) 안에서 수행하도록 § 5.5 matrix 정정, (4) ADMIN-UI-48·58 seed audit_log direct INSERT 제거 → audit_event 사용 (audit_log 의 instance_id NOT NULL 회피) + § 7.1 migration precondition 표 정정, (5) ADMIN-UI-49 § 5.5 audit_log query ORDER BY occurred_at, (6) ADMIN-UI-50 § 5.1 cookie fixed window + DB session sliding window asymmetric refresh 보안 모델 명시, (7) ADMIN-UI-51 § 3.2 sign-out 흐름 getActiveSession → revokeSession → emit + tampered cookie 분기 (session-revoked-anonymous), (8) ADMIN-UI-52 § 12 shared-types cascade 중복 제거 — 선행 precondition 단일화, (9) ADMIN-UI-53 § 7 DATABASE_URL 권한을 'SET ROLE postgres 가능한 admin role' 로 좁힘, (10) ADMIN-UI-54 slug-lookup-not-found 를 audit_event 별도 emit 으로 명시 (slugResolver 책임), (11) ADMIN-UI-55 § 5.4 SignInReason union 별도 정의 (AuthDenyReason + no-active-membership + magic-link-rejected), (12) ADMIN-UI-56 redirect('/404') → notFound(), (13) ADMIN-UI-57 content-saved audit best-effort try/catch + gate happy-path 명시 + transactional outbox cascade marker, (14) ADMIN-UI-59 § 10 W-01~W-07 최종 결정 한 줄씩, (15) ADMIN-UI-60 PACKAGES_STRUCTURE cascade 'verify only' 로 정정, (16) ADMIN-UI-61 § 9 게이트 precondition 명시, (17) ADMIN-UI-62 deferred 표 LegalDocument 행에 'skeleton 은 발행/출시 판단 없음' 안전 문구 추가 |
### docs/core/CONTENT_STANDARDS.md
  401: #### 7.1.1.1 ContentType 예외 — LegalDocument 면제 (LL-CASCADE-03 · LOCATION_LEGAL_PLAN v1.0 § 5)
  403: LegalDocument(C-16)는 Core 표준 템플릿 + 변수 치환으로 자동 생성되는 정책 문서이므로 일반 콘텐츠 검증 룰이 부합하지 않는다. 다음 영역은 명시적으로 면제한다.
  405: | 검증 영역 | LegalDocument 면제 사유 | 대체 보장 |
  412: **변수 화이트리스트 검증은 별도 룰**: LegalDocument body 안 `{{...}}` 변수는 Core 측 `renderTemplate` 가 strict whitelist (11개 변수)로 검증하며 (LL-ACTION-12), unknown key 는 build-time test (`packages/core-content/src/templates/__tests__.ts`) 와 server action runtime 양쪽에서 차단한다. compliance-assistant Feature 의 검증 input 으로 LegalDocument 를 보내지 않는 것이 본 면제의 운영적 결정이며, compliance-assistant 의 `check()` 진입 자체를 운영 단계에서 차단한다.
  414: **ComplianceRecord 발행 게이트는 면제 아님**: LegalDocument 도 발행 단계에서 ComplianceRecord (`legalCounsel`/`legalCounselAt` 필수 · admin/ARCHITECTURE § 3.8.2) 가 별도로 요구된다. 본 절은 자동 검수 룰의 면제일 뿐 법무 검토 게이트는 그대로 유지.
### docs/decisions/M0_BUILD_EXPORT_PLAN.md
    3: > **상태**: **v0.1 (placeholder)** — `LOCATION_LEGAL_PLAN.md` v1.0 acceptance 의 LL-CASCADE-04 precondition 으로 신설. 실 plan content 는 M0 v1.0 본 구현 (`apps/worker` build/export 함수) 진입 시점에 합류.
    9: - `docs/admin/ARCHITECTURE.md` v0.7 § 3 Vertical Slice · § 3.8.1·3.8.2 자동 생성 규칙 · § 3.11 완료 게이트 #1
   11: - `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.0 — LL-CASCADE-04 책임 명시 (본 문서 의 cascade target)
   22: ### 1.2 LL-CASCADE-04 책임 (LOCATION_LEGAL_PLAN v1.0 cascade)
   27: | ClinicProfile `locations[]` | `SELECT id FROM location_profile WHERE clinic_profile_id = ? ORDER BY slug` | `locations: [<ref to LocationProfile.@id>]` (1개 이상 — main 필수) |
   28: | LocationProfile `@id` | `location_profile.slug` (보통 `main`) | `@id: main` |
   29: | LocationProfile `parentClinic` | `clinic_profile.slug` (composite FK target) | `parentClinic: clinic` |
   30: | LocationProfile `reservationChannels` | `clinic_profile.primary_ctas` deep clone (main 자동 상속 · cycle1 LL-02 SoT) | `reservationChannels: [...]` |
   31: | LocationProfile `businessHours` | `location_profile.metadata.businessHours` (CT-02 SoT 형식 그대로) | `businessHours: {...}` |
   33: | LegalDocument body | `legal_document.body` (rendered Markdown · 변수 치환 완료) | `<documentType>.md` 본문 |
   34: | LegalDocument metadata | documentType · title · effective_date · template_version · contact_person · contact_email | frontmatter YAML |
   36: ### 1.3 LL-CASCADE-04 외 (M0 v1.0 합류 시점에 확장)
   40: - InstanceManifest · BrandTokens · FeatureModuleConfig.
   61: | 2026-05-16 | v0.1 | LOCATION_LEGAL_PLAN v1.0 acceptance precondition 으로 placeholder 신설. LL-CASCADE-04 책임 명시 (ClinicProfile.locations / LocationProfile.parentClinic·reservationChannels / primary_ctas `id` → `@id` alias). |
### docs/decisions/LOCATION_LEGAL_PLAN.md
    1: # LocationProfile(main) + LegalDocument 자동 생성 plan (v1.0·acceptance·2026-05-16)
    5: > **acceptance commit 구성 (cycle2 LL-33 · cycle5 LL-56 acceptance precondition)**: 본 commit 에 다음 5 cascade 동시 포함 — (1) LOCATION_LEGAL_PLAN.md v1.0 (본 문서), (2) LL-CASCADE-01 docs/admin/ARCHITECTURE.md § 3.8.2 patch, (3) LL-CASCADE-02 docs/decisions/ADMIN_UI_SKELETON_PLAN.md § 5.5 patch, (4) LL-CASCADE-03 docs/core/CONTENT_STANDARDS.md § 7 patch, (5) LL-CASCADE-04 docs/decisions/M0_BUILD_EXPORT_PLAN.md v0.1 placeholder (작성 완료). LL-CASCADE-05 (packages/migrations-runner manifest spec) 은 manifest 파일 신설 정도 — 실 runner 코드 acceptance 는 LL-DEFER-20 (M0 v1.0 본 구현).
    7: 본 문서는 `docs/admin/ARCHITECTURE.md` v0.7 § 3.8.1 (LocationProfile(main) 자동 생성 규칙) · § 3.8.2 (LegalDocument 자동 생성 규칙) 을 M0 어드민에서 구현하기 위한 plan이다. ClinicProfile 화면 한 화면에서 **3계약 동시 출력** (`ClinicProfile` + `LocationProfile`(slug=`main`) + `LegalDocument`(5종)) 을 단일 server action transaction 안에서 수행한다.
   11: > **scope limit (LL-INTRO-01)** — cycle1 LL-03·LL-04 patch: 본 plan 은 LegalDocument **draft 저장만** 다룬다. `review-queued` 도 차단 — 그 전이는 ComplianceRecord pre-publish row + NotificationEvent envelope (REVIEW_WORKFLOW § 5.2 / § 3.1) 발송이 함께 작동해야 한다. 이 둘은 모두 compliance-assistant Feature + ComplianceRecord UI cascade 까지 defer. 본 plan 의 LegalDocument 는 `status='draft'` 강제 (CHECK). 발행 게이트 자체는 LL-DEFER-01.
   15: - `docs/admin/ARCHITECTURE.md` v0.7 § 3.2 화면 ② · § 3.8.1 · § 3.8.2 — 자동 생성 규칙 SoT
   16: - `docs/core/DATA_MODEL.md` v0.9 — C-01 ClinicProfile · C-16 LegalDocument · C-21 LocationProfile · CT-02 BusinessHours · CT-03 CTAConfig
   18: - `docs/core/CONTENT_STANDARDS.md` v1.3 — cycle1 LL-13 patch: 경로 정정 (admin/CONTENT_STANDARDS 아님). Markdown 본문 검증 (answer-first AST · 표현 검사) 의 LegalDocument 면제 규약 (§ 7 ContentType 예외 표 — LegalDocument 면제 marker).
   19: - `docs/compliance/RISK_LEVELS.md` v1.1 · `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0 — `LegalDocument: legalCounsel/legalCounselAt required` 의 위험도 Low 예외 게이트 (RL § 4.3)
   23:   - `packages/core-content/migrations/C0001_clinic_profile.sql` · `C0002_location_profile.sql` (location_profile 은 instance_id 만 FK · clinic_profile 직접 FK 없음 — cycle1 LL-01 patch 대상)
   34: - ClinicProfile 화면을 § 3.2/§ 3.8.1/§ 3.8.2 정합으로 진화 — 한 화면, **3계약 동시 출력**.
   43: | `legal_document` 테이블 신설 (C-16 minimal) | packages/core-content C0006 migration · RLS · 5종 documentType partial UNIQUE (cycle1 LL-08) |
   44: | `clinic_profile` 정책 변수 + primaryCtas 컬럼 추가 | `policy_contact_person` · `policy_contact_email` · `policy_contact_phone` · `policy_effective_date` · `primary_ctas` (JSONB · cycle1 LL-02 patch) |
   46: | `saveClinicProfile` actions 확장 | 단일 tx 안 ClinicProfile + LocationProfile(main) + 5종 LegalDocument upsert · 변수 치환 · audit 7 row 별도 emit (cycle1 LL-17 patch) |
   50: | 5종 LegalDocument 별 effective_date input | cycle1 LL-15 patch — LL-DEFER-08 reversal. 5 record 별 individual input · default = policy_effective_date |
   57: | LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제) · `review-queued` 전이 + ComplianceRecord pre-publish + NotificationEvent | compliance-assistant Feature + ComplianceRecord UI cascade | LL-INTRO-01 / LL-DEFER-01 |
   58: | LegalDocument `status=published` 발행 자체 | apps/worker + Git commit cascade | LL-DEFER-01 |
   59: | ClinicProfile 화면의 미리보기 (3계약 합쳐 본 미리보기 페이지) | M0 v1.0 미리보기 화면 | LL-DEFER-01 |
   60: | 다지점 (slug ≠ main) LocationProfile UI | Phase Beta (M2+) | DATA_MODEL DM-17 |
   61: | 정책 개정 이력 (`revisions[]`) UI | M1 Phase Alpha | LL-DEFER-02 |
   62: | LegalDocument 수동 작성 모드 (autoGenerated=false) | M1 Phase Alpha — Markdown 에디터 합류 시점 | LL-DEFER-03 |
   63: | reservationChannels 풀세트 (LocationProfile 별도 입력 폼) | M0 v1.0 본 구현 — LocationProfile 편집 화면 합류 시점 (cycle1 LL-02 patch — v0.1/v0.2 는 primaryCtas 상속만) | LL-DEFER-04 |
   64: | `representativeDoctors` · `doctorsAtLocation` · `availableTreatments` ref 입력 | M0 v1.0 다지점 입력 화면 또는 LocationProfile 편집 화면 | LL-DEFER-05 |
   65: | LegalDocument body 직접 수동 override | M1 Phase Alpha | LL-DEFER-06 |
   66: | `latitude`/`longitude` 지도 pinpoint UI | M1 Phase Alpha | LL-DEFER-07 |
   67: | ~~5종 LegalDocument 각각의 effective_date individual override~~ | cycle1 LL-15 patch — **v0.2 에서 합류** (form 에서 5 record 별 input) | (closed) |
   68: | `ClinicProfileBundle` audit contentType 권한 분리 | cycle1 LL-17 patch — audit shape 자체를 7 row 별도 emit 으로 변경 → `Bundle` outer 자체 제거. RBAC cascade 는 LL-DEFER-09 | LL-DEFER-09 |
   69: | 템플릿 major 버전 변경 시 운영자 수동 확인 | M1 Phase Alpha | LL-DEFER-10 |
   70: | LegalDocument body 검증 (CONTENT_STANDARDS § 7 ContentType 예외 marker 명시 + 면제 범위 cascade) | cycle1 LL-13 patch — CONTENT_STANDARDS § 7 의 LegalDocument 면제 marker 가 plan SoT cascade. 본 plan 에서 추가 검증 룰 미정의 | LL-DEFER-11 |
   71: | `cookie` / `other` documentType 자동 생성 | cycle1 LL-08·LL-09 patch — partial UNIQUE 로 5종만 SoT 자동 생성. cookie/other 는 운영자 manual 입력 (단, v0.2 도 UI 미제공 — M1 Phase Alpha) | LL-DEFER-12 |
   72: | custom (`documentType=other`) template_version namespace 규약 | cycle1 LL-22 patch — `other` 는 templateVersion null (autoGenerated=false). custom semver 는 M1 cascade | LL-DEFER-13 |
   79: -- packages/core-content/migrations/C0006_legal_document.sql
   94:   effective_date DATE NOT NULL,
  123:   -- cycle1 LL-08 patch: partial UNIQUE — closed 5종만 instance 당 1개 강제. cookie/other 는 미강제 (LL-DEFER-12)
  145: - (LL-SCHEMA-02 · cycle1 LL-08·LL-09 patch) **partial UNIQUE** — closed 5종 (`privacy`/`terms`/`non-covered`/`refund`/`complaint`) per instance UNIQUE. `cookie`/`other` 는 instance 당 N개 허용 (skeleton v0.2 UI 미제공 — LL-DEFER-12).
  146: - (LL-SCHEMA-03 · cycle1 LL-03 patch) `status` CHECK `= 'draft'` — skeleton 단계 단일 상태만. `review-queued` 전이는 ComplianceRecord pre-publish row + NotificationEvent 발송과 함께만 작동 (compliance-assistant cascade — LL-DEFER-01).
  147: - (LL-SCHEMA-04) `published_at` CHECK NULL — 발행 자체가 LL-DEFER-01.
  150: - (LL-SCHEMA-07) `revisions[]` 은 v0.2 column 미추가 (LL-DEFER-02). `metadata JSONB` 확장 여지만 남김.
  155: -- packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql
  161:   ADD COLUMN policy_effective_date DATE,
  201:     -- DB key = 'id' (Git 출력 시 '@id' alias 변환은 LL-CASCADE-04 build/export 책임)
  230: - (LL-SCHEMA-09) 별도 column (metadata JSONB 가 아닌) — 폼 schema 검증 + LegalDocument 변수 치환의 필수 입력값.
  232: - (LL-SCHEMA-11 · cycle1 LL-15 patch) `policy_effective_date` 는 form 안 5 LegalDocument record 의 default 만. 운영자가 각 record 별 override 가능 (LL-DEFER-08 closed).
  236:   - UI subset 외 type (sms/form/map/external 등) 은 M1 Phase Alpha cascade (LL-DEFER-19 · cycle5 LL-57 + cycle6 LL-59 단일화).
  237:   - **DB 검증 = trigger** (CHECK subquery 불가 · cycle3 LL-38 patch) + form zod (UI subset 3종 enum) 양쪽. LocationProfile 자동 생성 시 **build-time reference (deep clone)** — DB metadata 복사 없음 (LL-SCHEMA-18 통일).
  242: -- packages/core-content/migrations/C0008_location_profile_parent_clinic.sql
  255: -- 기존 row 가 있을 경우 backfill 후 NOT NULL — skeleton 단계 row 없음 가정. data migration 부담 marker LL-DEFER-14.
  261: -- cycle2 LL-29 patch: ClinicProfile.locations[] >= 1 DB invariant — clinic_profile 마다 main slug LocationProfile 최소 1 row 강제.
  262: -- partial unique 가 아니라 EXISTS 보장. trigger 또는 매 INSERT 시 SELECT FOR UPDATE + COUNT 검증 — server action 단일 tx 안에서 처리 (LL-ACTION-04 의 ClinicProfile → LocationProfile main 동시 upsert + assertHasMainLocationAfterTx).
  263: -- DB constraint 자체는 후속 trigger cascade (LL-DEFER-15).
  269: - (LL-SCHEMA-15 · cycle2 LL-29 patch) ClinicProfile.locations[] (DATA_MODEL C-01 required ≥1) 는 **DB 컬럼 추가 없음** — Git 출력 빌드 시점 `SELECT id FROM location_profile WHERE clinic_profile_id = ?` 으로 동적 구성. cardinality 보장은 server action 안 단일 tx atomic upsert + `assertHasMainLocationAfterTx` 안전망 (LL-ACTION-21). DB trigger cascade 는 LL-DEFER-15.
  294:   // v0.2 미입력 — LL-DEFER-05
  301: - (LL-SCHEMA-17 · cycle1 LL-05 + cycle2 LL-30 patch) form (b) 의 7요일 입력은 server action 안에서 SoT 형식으로 변환 후 저장 (LL-ACTION-09). 입력 UX 는 7요일 단순 행. **receptionHours · specialClosures 는 v0.3 form 입력 필드 없음 → 빈 배열로 저장** (CT-02 optional). round-trip (저장 후 form 재로딩) 시 빈 배열은 form (b) 의 미입력 상태로 표시. M1 cascade 에서 form (b) 에 receptionHours 단축 입력 + specialClosures (공휴일/임시 휴진) UI 추가 합류 (LL-DEFER-16).
  302: - (LL-SCHEMA-18 · cycle1 LL-02 + cycle2 LL-27 patch) `reservationChannels` 는 별도 입력 없음 — LocationProfile 자동 생성 시 ClinicProfile.primary_ctas 그대로 상속. **C-21 Git 출력 시점 구성 규칙**: build 시 `LocationProfile.reservationChannels = clinic_profile.primary_ctas` 의 직접 reference (C-21 출력 필드 값 = ClinicProfile primary_ctas의 deep clone). `metadata.reservationChannelsInheritedFrom` marker 는 DB 안 의도 명시용 — Git 출력에서는 사용 안 함. M0 v1.0 다지점 합류 시 hybrid (지점 override + 본원 상속 default) cascade (LL-DEFER-04).
  303: - (LL-SCHEMA-19 · cycle1 LL-11 patch) `representativeDoctors`/`doctorsAtLocation`/`availableTreatments` 는 v0.3 빈 배열 — admin/ARCH § 3.8.1 자동 생성 표의 "ClinicProfile 등록 대표/전체 의료진/전체 시술" 매핑은 LocationProfile 편집 화면 합류 시점 (LL-DEFER-05). 빈 배열 의미는 SoT (DATA_MODEL C-21 optional).
  308: ### 3.1 ClinicProfileForm 3 섹션 + 5 LegalDocument record (LL-FORM-01)
  313: | **(b) 본원 위치·연락·시간** (신규) | streetAddress · addressLocality · addressRegion · postalCode · addressCountry · telephone · email · businessHours (7 요일 + 점심) · primaryCtas (3종 minimal · CT-03 SoT token: `phone`/`kakao-talk`/`naver-reservation` · cycle4 LL-51 patch) · featuredChannelId | `ClinicProfile.primary_ctas` + `LocationProfile`(slug=`main`) |
  314: | **(c) 정책 변수** (신규 보조 details) | policyContactPerson · policyContactEmail · policyContactPhone · policyEffectiveDate (5종 default) | `ClinicProfile.policy_*` |
  315: | **(d) 5종 LegalDocument** (신규 보조 details — cycle1 LL-15 patch) | 5 record 별 effectiveDate override (optional · 미입력 시 policyEffectiveDate default) | `LegalDocument` × 5 |
  318: - (LL-FORM-02) 한 화면 한 폼 (single `<form action>`) — server action 한 번 호출로 3계약 + 5 LegalDocument 동시 출력. 부분 저장 (섹션별 저장) 안 함.
  320: - (LL-FORM-04 · cycle1 LL-14 patch) 섹션 (c) 는 LegalDocument 생성에 필수 — policyContactPerson · policyContactEmail · policyContactPhone · policyEffectiveDate **4 필드 모두 required**. (한국 PIPA 의 개인정보 보호책임자 필수 고지 항목 — 소속/부서 같은 추가 필드는 LL-DEFER 또는 자유 입력 textarea 로 처리. v0.2 는 4 필드만 minimal.)
  323: - (LL-FORM-07 · cycle1 LL-23 + cycle2 LL-35 patch) businessHours UI: 7 요일 행. 각 행: `[휴진 ☐]` + `오픈 [HH:mm] 마감 [HH:mm]` + `[점심 ☐]` + `점심 시작 [HH:mm] 종료 [HH:mm]`. 휴진 checked 시 다른 입력 disabled. **a11y 요구**: 각 row 에 `aria-labelledby` (요일 헤더 link) + 각 input `aria-describedby` (요일 에러 메시지 id) + 휴진 toggle 의 `aria-controls` (해당 row 의 input group id). **5 LegalDocument override details a11y (LL-FORM-14)**: `<details>` `<summary>` 는 기본적으로 keyboard interaction (Space/Enter toggle) + `aria-expanded` 자동. 추가로 `<summary>` 안에 정책 이름 + `(시행일: <date>)` 시각 표시 + `aria-controls` (override 입력 group id) + override 입력에 `aria-labelledby` (summary id) 명시.
  324: - (LL-FORM-08 · cycle1 LL-02 + cycle4 LL-51 patch) primaryCtas UI: **CT-03 SoT token 3종** (`phone` · `kakao-talk` · `naver-reservation`) 각각 1개씩 입력 행. 미입력 = 해당 채널 제외. 각 채널 row 입력 = `targetUrl` (필수: `tel:+82-2-1234-5678` · `https://pf.kakao.com/...` · `https://booking.naver.com/...`) + `label` (필수: 운영자 자유 입력) + `id` (자동 생성: `<type>-<n>`). featuredChannelId 는 입력한 채널 중 select. **단, 이는 ClinicProfile.primary_ctas 의 입력** — LocationProfile.reservationChannels 는 자동 상속 (LL-SCHEMA-18 build-time).
  332: - (LL-FORM-13 · cycle1 LL-15 + cycle2 LL-31 + cycle3 LL-39 patch) form (d) 5 record effectiveDate FormData naming **고정 규약 + parser helper**:
  333:   - Field name (form 안 flat key) = `legalDocEffective_<documentType>` (5종: `legalDocEffective_privacy` · `legalDocEffective_terms` · `legalDocEffective_non-covered` · `legalDocEffective_refund` · `legalDocEffective_complaint`). cycle3 LL-39 patch: dotted key (`legalDoc.privacy.effectiveDate`) 회귀 — `Object.fromEntries(formData)` 가 nested object 자동 생성하지 않으므로 flat underscore key 로 변경.
  336:   - 미입력 (빈 string 또는 missing) = policyEffectiveDate fallback (server action 안 default 결정). 일부만 override 케이스 정상 — 입력된 record 만 override.
  337:   - DB CHECK `effective_date NOT NULL` 정합 — server action 안 fallback 적용 후 DB INSERT 시점 항상 값 존재.
  348:   // cycle1 LL-18 patch: LegalDocument 편집은 skeleton 단계 status=draft + risk_level=Low 의 CHECK 로 제한.
  349:   // 별도 ActionType (operator-edit-legal) 분리는 LL-DEFER-09 (RBAC cascade).
  360: - (LL-ACTION-02) 3계약 + 5 LegalDocument 모두 같은 tx — RLS 정합 + atomic 출력. 하나 실패 = 전체 rollback.
  361: - (LL-ACTION-03 · cycle1 LL-17 patch) audit `content-saved` 는 tx commit 후 **7 row 별도 emit** — ClinicProfile 1 + LocationProfile 1 + LegalDocument 5. 각 row 의 payload 는 기존 통일 shape `{contentType, slug, mode, status, originalSlug}`. `ClinicProfileBundle` outer 폐기. analytics/test 호환 보존.
  364: - (LL-ACTION-06 · cycle1 LL-16 + cycle3 LL-46 patch) **자동 재렌더링 분기 제거** — v0.4 는 LegalDocument 본문 수동 편집 차단 (LL-DEFER-06) 이므로 모든 row 가 templateVersion=current. 매 저장 시 모든 LegalDocument body 재렌더링. **운영자 알림 marker (LL-FORM-15 · 폼 (d) 상단 안내문)**: "본원 정보(기관명·법인명·사업자번호·설립자·본원 주소·전화·이메일) 또는 정책 변수(담당자·이메일·전화·시행일)를 수정하면 5종 정책 문서 본문이 자동으로 다시 생성됩니다. 본문 직접 수정은 추후 단계에서 합류합니다." 향후 수동 override 도입 시 별도 `body_source` enum (`auto`/`manual`) 컬럼 cascade.
  365: - (LL-ACTION-07 · cycle1 LL-21 patch) `effective_date` default — DB `CURRENT_DATE AT TIME ZONE 'Asia/Seoul'` (Postgres) 사용. server `new Date()` 사용 금지. form 입력 시 ISO 형식 그대로.
  366: - (LL-ACTION-08 · cycle1 LL-02 + cycle3 LL-45 patch — LL-SCHEMA-12·LL-SCHEMA-18 통일) LocationProfile 자동 상속 = **build-time reference (deep clone)**. server action 안 DB 저장은 `metadata.reservationChannelsInheritedFrom = "clinic_profile.primary_ctas"` marker 만 (의도 명시용). 실제 출력 시점은 apps/worker · M0 v1.0 build/export 의 책임 (LL-CASCADE-04 marker 신설).
  368: - (LL-ACTION-21 · cycle2 LL-29 + cycle3 LL-44 patch) **assertHasMainLocationAfterTx 안전망**: tx 안 마지막 단계에서 `SELECT 1 FROM location_profile WHERE instance_id=? AND clinic_profile_id=? AND slug='main'` — 0행이면 **`MainLocationMissingError` (apps/web/src/lib/errors.ts 신설 named Error class) throw** → tx rollback. server action outer catch 에서 `MainLocationMissingError` 별도 분기: `return { ok: false, fieldErrors: {}, formError: "본원 정보 저장에 실패했습니다. 페이지를 새로고침하고 다시 시도하세요." }`. mapDbErrorToResult 와는 별개 (DB error 가 아닌 application-level invariant). 정상 흐름에서는 LocationProfile main upsert 가 항상 수행되므로 trip 안 됨. DB trigger 합류 (LL-DEFER-15) 까지 임시 보호.
  389:   policy: {                  // cycle1 LL-06 patch: admin/ARCH § 3.8.2 의 contactPerson 입력 섹션 = policy.* 변수 출처. SoT 정당화.
  393:     effectiveDate: string;   // YYYY-MM-DD (LegalDocument 별 override 결과)
  406: - (LL-ACTION-16 · cycle1 LL-06 + cycle2 LL-33 patch) `policy.*` 변수 정당화 — admin/ARCH § 3.8.2 의 `contactPerson` 필드 + § 3.8.2 결정 ("ClinicProfile 폼 '정책 변수' 보조 섹션") 이 SoT 출처. ARCH 본문에 `policy.*` 변수가 명시되지 않은 것은 ARCH 의 변수 사용 sample 일 뿐. **acceptance 전 순서 정합 (cycle2 LL-33)**: 본 plan v1.0 acceptance **와 동시 또는 직전에** ARCH § 3.8.2 patch (LL-CASCADE-01) 적용 — plan acceptance commit 안에 ARCH 패치 포함. plan 단독 acceptance 시 ARCH SoT 충돌 잔존하므로 cascade 가 acceptance precondition.
  416: { "eventType": "content-saved", "payload": { "contentType": "LocationProfile", "slug": "main",   "mode": "...", "status": null,    "originalSlug": "main" } }
  417: // row 3~7 (5종 LegalDocument)
  418: { "eventType": "content-saved", "payload": { "contentType": "LegalDocument",   "slug": "privacy", "mode": "...", "status": "draft", "originalSlug": "privacy",
  426:   - 실패 row 발생 시 끝에 단일 `content-saved-partial` audit row INSERT — payload `{outcome: "partial", emitted: [<contentTypes>], failed: [<contentTypes>], reason: <error.code>}`. 운영 포렌식 안전망.
  427:   - 모든 7 row 실패 시 `content-saved-failed` audit row 1건.
  429:     - **v0.5 단계 (Sentry SDK 미통합 · LL-DEFER-18 합류 전)**: (1) per-row try/catch + console.error → server stdout (Vercel logs / Cloud Run logs). (2) partial/failed row INSERT 시도 → 실패해도 server stdout. (3) partial/failed row INSERT 자체 실패 시 server stdout만 (Sentry 미통합 상태 명시). 사용자 return state 는 `{ ok: true }` 유지 (save 성공이 우선 · audit 누락만 운영 팀 stdout 추적).
  430:     - **M0 v1.0 (LL-DEFER-18 합류 후)**: (3) Sentry capture (INFRA INFR-PROV `Sentry` Provider 통합) + breadcrumb 으로 (1)/(2) 단계의 console.error 도 함께 캡처. 사용자 return state 동일.
  434: - (LL-ACTION-19 · cycle1 LL-17 patch) ADMIN_UI_SKELETON_PLAN § 5.5 audit matrix cascade — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed 별도 row 추가 marker (LL-CASCADE-02). 기존 ClinicProfile row 와 동일 통일 shape.
  469: export type LegalDocumentType =
  473:   documentType: LegalDocumentType;
  484: - (LL-TEMPLATE-02) v0.2 는 5종 (`cookie`/`other` 제외) — M1 manual 입력 cascade (LL-DEFER-12).
  487: - (LL-TEMPLATE-05 · cycle1 LL-06 patch) 변수 화이트리스트 (admin/ARCH § 3.8.2 SoT cascade marker LL-CASCADE-01 — ARCH 본문에 본 표 reference 추가):
  490:   - `{{policy.contactPerson}}` · `{{policy.contactEmail}}` · `{{policy.contactPhone}}` · `{{policy.effectiveDate}}`
  491: - (LL-TEMPLATE-06) 템플릿 versioning — semver `major.minor.patch`. minor 이상 업그레이드 시 자동 재렌더링 (LL-ACTION-06 — v0.2 매 저장 시 무조건 재렌더링이므로 minor/major 분기 불필요). major 변경 시 운영자 수동 확인은 LL-DEFER-10.
  492: - (LL-TEMPLATE-07 · cycle1 LL-13 patch) **LegalDocument body 검증 면제 명시** — `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표에 LegalDocument 추가 (cascade marker LL-CASCADE-03). 면제 범위: (1) answer-first AST 미적용 (정책 문서는 첫 문장 답 제시 구조 아님) (2) 표현 검사 (recommend/best 등 광고 표현) 미적용 (3) 변수 화이트리스트 검증은 별도 룰 (LL-ACTION-12).
  498:   1. `packages/db/migrations/D0010_instance.sql` (instance table) — precondition
  499:   2. `packages/core-content/migrations/C0001_clinic_profile.sql` (clinic_profile) — precondition
  500:   3. `packages/core-content/migrations/C0002_location_profile.sql` (location_profile) — precondition
  501:   4. `packages/core-content/migrations/C0004_treatment_page.sql` (content_publication_status enum 생성) — **C0006 의 precondition**
  502:   5. `packages/core-content/migrations/C0005_article.sql` (risk_level enum 생성) — **C0006 의 precondition**
  503:   6. `packages/core-content/migrations/C0006_legal_document.sql` — legal_document table (status::content_publication_status + risk_level::risk_level FK)
  504:   7. `packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql` — clinic_profile ALTER (policy_* + primary_ctas)
  505:   8. `packages/core-content/migrations/C0008_location_profile_parent_clinic.sql` — location_profile ALTER (clinic_profile_id composite FK)
  506: - 부분 적용 환경에서 C0006 을 C0004/C0005 보다 먼저 시도하면 enum 없음 에러 — migration runner 가 sequential apply 보장.
  518: | 16 | LegalDocument 행을 `app_tenant_user` 가 `status='published'` 로 UPDATE 시도 | CHECK 위반 → formError ("정책 문서는 현재 단계에서 발행 상태로 변경할 수 없습니다") — cycle1 LL-19 patch |
  519: | 17 | LegalDocument 같은 documentType (closed 5종) 두 번 INSERT | partial UNIQUE 위반 (LL-SCHEMA-02) |
  523: | 21 | LegalDocument risk_level='High' UPDATE 시도 | CHECK 위반 (LL-SCHEMA-06) → formError |
  530: | 1 | C0006 legal_document migration | packages/core-content/migrations/C0006_legal_document.sql |
  531: | 2 | C0007 clinic_profile policy + primaryCtas migration | packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql |
  532: | 3 | C0008 location_profile clinic_profile_id migration | packages/core-content/migrations/C0008_location_profile_parent_clinic.sql |
  534: | 5 | zod schema (businessHours · primaryCtas · policy vars · 5 LegalDocument override) | apps/web/src/lib/clinic-profile-schema.ts |
  535: | 6 | ClinicProfileForm 3 섹션 + 5 LegalDocument record 재구성 (a11y marker 적용) | apps/web/src/components/forms/ClinicProfileForm.tsx |
  538: | 9 | content-saved audit matrix row 추가 (LocationProfile · LegalDocument) | ADMIN_UI_SKELETON_PLAN § 5.5 cascade marker (LL-CASCADE-02) |
  539: | 10 | admin/ARCHITECTURE.md § 3.8.2 변수 화이트리스트 reference 추가 | LL-CASCADE-01 |
  540: | 11 | docs/core/CONTENT_STANDARDS.md § 7 LegalDocument 예외 marker 추가 | LL-CASCADE-03 |
  547: - `LL-DEFER-01`: LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제 · review-queued 전이 + ComplianceRecord pre-publish + NotificationEvent envelope · status=published). compliance-assistant Feature + ComplianceRecord UI cascade.
  548: - `LL-DEFER-09`: LegalDocument 편집 권한 분리 (operator-edit-legal ActionType — REVIEW_WORKFLOW 14 ActionType cascade).
  549: - `LL-DEFER-11`: LegalDocument body 검증 — CONTENT_STANDARDS § 7 ContentType 예외 marker cascade (LL-CASCADE-03). 추가 검증 룰은 compliance-assistant Feature.
  550: - `LL-DEFER-15` (cycle2 LL-29 patch): location_profile 의 main slug 1 row 강제 DB trigger 또는 partial unique with `clinic_profile_id` 기반 cascade — v0.4 은 server action assertHasMainLocationAfterTx 안전망. M0 v1.0 본 구현에서 DB-level invariant 합류.
  551: - `LL-DEFER-18` (cycle3 LL-43 + cycle5 LL-58 patch): Sentry SDK 통합 (INFRA INFR-PROV `Sentry` Provider). audit partial/failed row INSERT 실패 시 capture 채널. **SDK 초기화 위치 및 wrapping 책임 = `apps/web/src/lib/observability.ts` (Sentry init + `captureException` / `addBreadcrumb` helper)** — server action / route handler 가 console.error 대신 observability helper 호출. M0 v1.0 본 구현 (provider 통합 시점).
  552: - `LL-DEFER-20` (cycle4 LL-53 patch): packages/migrations-runner 실 runner 코드 — manifest spec 작성 (plan v1.0 acceptance precondition) 후 sequential apply + fail-fast 구현. M0 v1.0 본 구현.
  556: - `LL-DEFER-02`: 정책 개정 이력 (`revisions[]`) UI.
  557: - `LL-DEFER-03`: LegalDocument 수동 작성 모드 (autoGenerated=false · Markdown 에디터).
  558: - `LL-DEFER-06`: LegalDocument body 수동 override · `body_source` enum cascade.
  559: - `LL-DEFER-07`: latitude/longitude 지도 pinpoint.
  560: - `LL-DEFER-10`: 템플릿 major 버전 변경 시 운영자 수동 확인.
  561: - `LL-DEFER-12`: `cookie`/`other` documentType UI (manual 입력 + custom template).
  562: - `LL-DEFER-13`: custom (`documentType=other`) template_version namespace 규약.
  563: - `LL-DEFER-16` (cycle2 LL-30 patch): form (b) 에 receptionHours + specialClosures (공휴일/임시 휴진) UI 추가.
  564: - `LL-DEFER-19` (cycle4 LL-50 + cycle5 LL-57 patch — phase 단일화): primaryCtas UI subset 확장 — CT-03 11종 중 phone/kakao-talk/naver-reservation 외 8종 (`email`/`sms`/`kakao-channel`/`naver-talk`/`form`/`map`/`external`/`video-consultation`) 의 UI 입력. M0 v0.5 의 3종 subset 으로 1호 클라이언트 출시 가능 — 추가 8종은 M1.
  566: ### 9.3 M0 v1.0 본 구현 합류 (LocationProfile 편집 화면 cascade · cycle4 LL-52 patch)
  568: > **§1.3 비범위 vs §9.3 phase 정합 정정 (cycle4 LL-52)**: LL-DEFER-04/05 의 합류 시점은 LocationProfile 편집 화면 (M0 v1.0 본 구현). M2 Phase Beta 합류로 표시했던 v0.4 까지의 표기는 §1.3 비범위 표 ("LocationProfile 편집 화면 합류 시점") 와 충돌. v0.5 에서 통일.
  570: - `LL-DEFER-04`: reservationChannels 풀세트 (LocationProfile 편집 화면 + 지점별 override). **M0 v1.0 본 구현 합류**.
  571: - `LL-DEFER-05`: representativeDoctors · doctorsAtLocation · availableTreatments ref 입력 UI (다지점 합류 시점). **M0 v1.0 본 구현 합류** (단지점도 LocationProfile 편집 화면에서 입력).
  579: - `LL-DEFER-14` (cycle2 LL-28 patch): location_profile.clinic_profile_id NOT NULL data migration — 기존 row 존재 시 backfill 정책. v0.4 skeleton 가정은 row 없음.
  580: - `LL-DEFER-17` (cycle2 LL-36 patch): cookie/other 가 closed type 으로 승격 시 partial unique index DROP + 새 7종 partial unique CREATE — migration cascade marker.
  584: - ~~`LL-DEFER-08`~~: cycle1 LL-15 patch — 5종 LegalDocument 별 effectiveDate override 합류 완료 (v0.2 acceptance).
  588: > **acceptance 순서 정합 (cycle2 LL-33)**: LL-CASCADE-01 은 plan v1.0 acceptance 와 **동시 또는 직전** 에 ARCH patch 적용 (plan acceptance commit 안 포함). LL-CASCADE-02 · LL-CASCADE-03 · LL-CASCADE-04 도 동일 정책. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
  590: - `LL-CASCADE-01`: `docs/admin/ARCHITECTURE.md` § 3.8.2 표 — body 변수 화이트리스트 11개 (clinic 4 + location 3 + policy 4) reference 추가. ARCH v0.8 patch. **acceptance precondition**.
  591: - `LL-CASCADE-02`: `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` § 5.5 audit matrix — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed row 추가. **acceptance precondition**.
  592: - `LL-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표 — LegalDocument 면제 marker 추가 (answer-first AST · 표현 검사 면제 · 변수 화이트리스트 별도 룰). **acceptance precondition**.
  593: - `LL-CASCADE-04` (cycle3 LL-41 + cycle4 LL-49 + **cycle5 LL-56 patch — placeholder 실 파일 작성 완료**): **cascade target 정정** — ADMIN_UI_SKELETON_PLAN § 6 은 walking skeleton 의 actions 영역으로 build/export 부재 → **`docs/decisions/M0_BUILD_EXPORT_PLAN.md` (v0.1 placeholder · 2026-05-16 작성 완료)** + 본 plan 의 LL-CASCADE-04 marker reference. apps/worker · M0 v1.0 Git export 책임: LocationProfile.reservationChannels Git 출력 시 `clinic_profile.primary_ctas` deep clone, LocationProfile.@id = `"main"`, LocationProfile.parentClinic = ClinicProfile.@id reference, ClinicProfile.locations[] = SELECT 결과, primary_ctas DB key `id` → Git output `@id` alias 변환. **acceptance 강도 = placeholder 작성 완료** (`docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 1.2 LL-CASCADE-04 책임 표 명시). 실 구현은 M0 v1.0 본 구현.
  594: - `LL-CASCADE-05` (cycle3 LL-42 + cycle4 LL-53 patch): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장. **acceptance 강도 명시** — plan v1.0 acceptance 는 **manifest spec 작성까지만 차단** (manifest 파일 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` 의 spec 작성 + 본 plan 의 8단계 의존성 표 cascade). 실 runner 코드 구현은 M0 v1.0 cascade (LL-DEFER-20 신설). 즉 plan v1.0 acceptance ≠ runner 코드 acceptance.
  601: | 2026-05-16 | v0.2 | **Codex 비평 cycle1 25 findings (7 blocking + 12 major + 6 minor) 전건 수용 patch**: (LL-01) location_profile 에 clinic_profile_id composite FK + main row CHECK, ClinicProfile.locations[] Git 출력 빌드 시점 동적 구성. (LL-02) ClinicProfile.primary_ctas 컬럼 + LocationProfile.reservationChannels = primary_ctas 자동 상속 marker. (LL-03·04) status='draft' 만 허용 (review-queued 도 차단) — ComplianceRecord pre-publish + NotificationEvent 합류 시점까지 defer. (LL-05) businessHours SoT CT-02 형식 (openingHours[]·receptionHours[]·lunchBreaks[]·specialClosures[]) 변환 + server action 안 convertToOpeningHoursSpec 명시. (LL-06) policy.* 변수 정당화 + LL-CASCADE-01 cascade marker. (LL-07) 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha. (LL-08·09) partial UNIQUE — closed 5종만. cookie/other LL-DEFER-12. (LL-10) C-21 출력 매핑표 명시. (LL-11) representativeDoctors v0.2 빈 배열. (LL-12) risk_level NOT NULL + CHECK 'Low' 만. (LL-13) SoT 경로 정정 (docs/core/CONTENT_STANDARDS.md) + LL-CASCADE-03. (LL-14) policyContactPhone form 단계 required. (LL-15) effective_date individual override 합류 (LL-DEFER-08 closed). (LL-16) 자동 재렌더링 분기 제거 (모든 row 매 저장 시 재렌더링). (LL-17) audit 7 row 별도 emit (Bundle outer 폐기). (LL-18) RBAC 분리 marker LL-DEFER-09 명시. (LL-19) published CHECK 위반 시 운영자 메시지 + errors.ts 매핑. (LL-20) phone regex 한국 + 국제 표기 명시. (LL-21) effective_date timezone Asia/Seoul. (LL-22) template_version naming autoGenerated=true 일 때만 필수. (LL-23) businessHours a11y marker. (LL-24) detection 시점 server action runtime + build-time test cascade. (LL-25) LL-DEFER-08~10 본문 §1 비범위 표 반영. |
  602: | 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
  603: | 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
  604: | 2026-05-16 | v0.5 | **Codex 비평 cycle4 8 findings (2 blocking + 4 major + 2 minor) 전건 수용 patch**: (LL-48) trigger RAISE EXCEPTION USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' 추가 — errors.ts mapDbErrorToResult 가 SQLSTATE 23514 + constraint name 으로 분기 가능. (LL-49) LL-CASCADE-04 target 정정 — ADMIN_UI_SKELETON_PLAN § 6 은 actions 영역으로 build/export 부재. 신규 `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 신설 + LL-CASCADE-04 책임 row 1건 cascade. acceptance 강도 = placeholder 작성. (LL-50) CT-03 enum SoT 정렬 — DB trigger 허용 11종 (phone/email/sms/kakao-talk/kakao-channel/naver-reservation/naver-talk/form/map/external/video-consultation) + UI subset 3종 분리. LL-DEFER-19 8종 UI 합류. (LL-51) form (b) UI copy 정정 — kakao → kakao-talk · naver-booking → naver-reservation 토큰. (LL-52) LL-DEFER-04/05 phase 충돌 정정 — §9.3 → M0 v1.0 본 구현 (LocationProfile 편집 화면) 으로 통일. M2 Phase Beta 표기 제거 (현재 비어 있음 — 외부 사용자 RBAC 가 M2). (LL-53) LL-CASCADE-05 강도 명시 — plan v1.0 acceptance = manifest spec 작성만 차단, 실 runner 코드는 LL-DEFER-20 (M0 v1.0). (LL-54) trigger function IMMUTABLE 마킹 제거 — VOLATILE 기본 (NEW 읽기 + row-specific RAISE 정합). (LL-55) Sentry pre-integration fallback 명시 — v0.5 단계 console/server stdout only, M0 v1.0 LL-DEFER-18 합류 후 Sentry capture. **누계 55 findings 전건 수용**. |
  605: | 2026-05-16 | v0.6 | **Codex 비평 cycle5 3 findings (1 blocking + 0 major + 2 minor) 전건 수용 patch**: (LL-56) `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 실 파일 작성 완료 (v0.1 — §1.2 LL-CASCADE-04 책임 표 포함). (LL-57) LL-DEFER-19 phase 단일화 — §9.1 M0 v1.0 그룹 → §9.2 M1 Phase Alpha 그룹 으로 이동 ("M0 v1.0 또는 M1" 모호 표현 정정). M0 v0.5 의 3종 subset 으로 1호 클라이언트 출시 가능 명시. (LL-58) Sentry SDK 초기화 위치 = `apps/web/src/lib/observability.ts` (init + captureException + addBreadcrumb helper) 한 줄 명시 — LL-DEFER-18 내. **누계 58 findings 전건 수용**. |
  606: | 2026-05-16 | **v1.0** | **Codex 비평 cycle6 1 minor finding (LL-59) 수용 + closeableAfterPatch=true 확정 acceptance**: (LL-59) §2.2 본문 "M0 v1.0 또는 M1 cascade" → "M1 Phase Alpha cascade" 단일화 (LL-DEFER-19 § 9.2 위치와 정합). **수렴 추세 25→12→10→8→3→1 · blocking 0 · major 0 · minor 0 잔존**. cycle6 결과 acceptance commit 5 cascade (LL-CASCADE-01~05) 동시 포함 결정. **누계 59 findings 전건 처리 완료**. |

 succeeded in 801ms:
### packages/core-content/migrations/C0002_location_profile.sql
    1: -- @glitzy/core-content — C0002 LocationProfile (DATA_MODEL C-21·minimal v0.1)
    2: 
    3: CREATE TABLE location_profile (
    4:   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    5:   instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
    6:   slug TEXT NOT NULL,  -- 단지점은 'main'·다지점은 'gangnam' 등
    7:   name TEXT NOT NULL,
    8:   -- Address
    9:   street_address TEXT NOT NULL,
   10:   address_locality TEXT NOT NULL,  -- 시·군
   11:   address_region TEXT NOT NULL,     -- 도·광역시
   12:   postal_code TEXT NOT NULL,
   13:   address_country TEXT NOT NULL DEFAULT 'KR',  -- ISO 3166-1 alpha-2
   14:   -- GeoCoordinates (optional)
   15:   latitude NUMERIC(10, 7),
   16:   longitude NUMERIC(10, 7),
   17:   -- Contact
   18:   phone TEXT,
   19:   email TEXT,
   20:   metadata JSONB NOT NULL DEFAULT '{}'::jsonb,  -- v0.2+ hours·directions·parking 등
   21:   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
   22:   updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
   23:   CONSTRAINT location_profile_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
   24:   -- M0-18 cycle2: ISO 3166-1 alpha-2 대문자 강제
   25:   CONSTRAINT location_profile_country_iso CHECK (address_country ~ '^[A-Z]{2}$'),
   26:   CONSTRAINT location_profile_lat_range CHECK (latitude IS NULL OR (latitude BETWEEN -90 AND 90)),
   27:   CONSTRAINT location_profile_lng_range CHECK (longitude IS NULL OR (longitude BETWEEN -180 AND 180)),
   28:   CONSTRAINT location_profile_email_regex CHECK (email IS NULL OR email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
   29:   -- LLC-10 patch (cycle 1 code review): 본원 전화 형식 정합 (한국 02-1234-5678 · 010-1234-5678 · +82-2-1234-5678) — form regex 와 DB CHECK 일치
   30:   CONSTRAINT location_profile_phone_format CHECK (
   31:     phone IS NULL
   32:     OR phone ~ '^(\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}$'
   33:   ),
   34:   CONSTRAINT location_profile_instance_slug_unique UNIQUE (instance_id, slug),
   35:   CONSTRAINT location_profile_instance_id_unique UNIQUE (instance_id, id)
   36: );
   37: 
   38: CREATE INDEX location_profile_instance_idx ON location_profile (instance_id);
   39: 
   40: ALTER TABLE location_profile ENABLE ROW LEVEL SECURITY;
   41: ALTER TABLE location_profile FORCE ROW LEVEL SECURITY;
   42: 
   43: CREATE POLICY tenant_isolation ON location_profile
   44:   FOR ALL TO app_tenant_user
   45:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
   46:   WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
   47: 
   48: GRANT SELECT, INSERT, UPDATE, DELETE ON location_profile TO app_tenant_user;
### packages/core-content/migrations/C0006_legal_document.sql
    1: -- @glitzy/core-content — C0006 LegalDocument (DATA_MODEL C-16·LOCATION_LEGAL_PLAN v1.0)
    2: -- Precondition: D0010 instance · C0004 content_publication_status enum · C0005 risk_level enum
    3: 
    4: -- LL-SCHEMA-01: documentType enum (DATA_MODEL C-16 SoT 7종)
    5: CREATE TYPE legal_document_type AS ENUM (
    6:   'privacy', 'terms', 'non-covered', 'refund', 'complaint', 'cookie', 'other'
    7: );
    8: 
    9: CREATE TABLE legal_document (
   10:   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   11:   instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
   12:   slug TEXT NOT NULL,
   13:   document_type legal_document_type NOT NULL,
   14:   title TEXT NOT NULL,
   15:   body TEXT NOT NULL,
   16:   auto_generated BOOLEAN NOT NULL DEFAULT true,
   17:   template_version TEXT,
   18:   -- LLC-11 patch (LL-ACTION-07): default 시점 = 'Asia/Seoul' 의 오늘. server new Date() 사용 금지.
   19:   -- form/action 이 항상 값을 넣지만 (zod required) DB default 는 직접 SQL 경로 안전망.
   20:   effective_date DATE NOT NULL DEFAULT ((CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Seoul')::date),
   21:   last_revised_date DATE,
   22:   contact_person TEXT,
   23:   contact_email TEXT,
   24:   status content_publication_status NOT NULL DEFAULT 'draft',
   25:   risk_level risk_level NOT NULL DEFAULT 'Low',
   26:   published_at TIMESTAMPTZ,
   27:   metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
   28:   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
   29:   updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
   30:   CONSTRAINT legal_document_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
   31:   CONSTRAINT legal_document_title_length CHECK (length(title) BETWEEN 1 AND 100),
   32:   CONSTRAINT legal_document_body_length CHECK (length(body) BETWEEN 1 AND 200000),
   33:   CONSTRAINT legal_document_email_regex CHECK (
   34:     contact_email IS NULL OR contact_email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
   35:   ),
   36:   -- LL-SCHEMA-05 + cycle1 LL-22: autoGenerated=true 시 templateVersion 필수
   37:   CONSTRAINT legal_document_template_version_format CHECK (
   38:     template_version IS NULL OR template_version ~ '^[a-z0-9-]+@[0-9]+\.[0-9]+\.[0-9]+$'
   39:   ),
   40:   CONSTRAINT legal_document_auto_generated_template_ver CHECK (
   41:     (auto_generated = false) OR (template_version IS NOT NULL)
   42:   ),
   43:   -- LL-SCHEMA-03 + cycle1 LL-03·LL-19: skeleton 단계 status='draft' 만
   44:   CONSTRAINT legal_document_status_skeleton_limit CHECK (status = 'draft'),
   45:   -- LL-SCHEMA-04: 발행 자체 차단
   46:   CONSTRAINT legal_document_published_at_null CHECK (published_at IS NULL),
   47:   -- LL-SCHEMA-06 + cycle1 LL-12: risk_level 'Low' 만
   48:   CONSTRAINT legal_document_risk_level_skeleton_limit CHECK (risk_level = 'Low'),
   49:   CONSTRAINT legal_document_instance_slug_unique UNIQUE (instance_id, slug),
   50:   CONSTRAINT legal_document_instance_id_unique UNIQUE (instance_id, id)
   51: );
   52: 
   53: -- LL-SCHEMA-02 + cycle1 LL-08·09: closed 5종 partial UNIQUE (cookie/other 미강제 — LL-DEFER-12)
   54: CREATE UNIQUE INDEX legal_document_instance_5type_unique
   55:   ON legal_document (instance_id, document_type)
   56:   WHERE document_type IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint');
   57: 
   58: CREATE INDEX legal_document_instance_idx ON legal_document (instance_id);
   59: 
   60: ALTER TABLE legal_document ENABLE ROW LEVEL SECURITY;
   61: ALTER TABLE legal_document FORCE ROW LEVEL SECURITY;
   62: 
   63: CREATE POLICY tenant_isolation ON legal_document
   64:   FOR ALL TO app_tenant_user
   65:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
   66:   WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
   67: 
   68: GRANT SELECT, INSERT, UPDATE, DELETE ON legal_document TO app_tenant_user;
### packages/core-content/migrations/C0008_location_profile_parent_clinic.sql
    1: -- @glitzy/core-content — C0008 LocationProfile parentClinic (LOCATION_LEGAL_PLAN v1.0)
    2: -- Precondition: C0001 clinic_profile + clinic_profile_instance_id_unique · C0002 location_profile
    3: 
    4: -- LL-SCHEMA-13~15 + cycle1 LL-01 + cycle2 LL-28 patch:
    5: --   parentClinic (C-21 required) 관계 모델. same-tenant composite FK 보장.
    6: --   모든 row clinic_profile_id NOT NULL (skeleton 가정: row 없음. backfill 부담은 LL-DEFER-14).
    7: 
    8: -- LLC-13 patch (cycle 1 code review): preflight 정책 명시.
    9: --   본 migration 은 nullable column 추가 후 즉시 SET NOT NULL 을 수행한다.
   10: --   skeleton 단계에는 location_profile row 가 없으므로 안전. row 가 이미 존재하는 환경에서는
   11: --   다음 backfill 을 본 migration 전에 수행해야 한다 (LL-DEFER-14 cascade — M0 v1.0 본 구현):
   12: --     UPDATE location_profile l SET clinic_profile_id = c.id
   13: --       FROM clinic_profile c
   14: --      WHERE l.clinic_profile_id IS NULL
   15: --        AND c.instance_id = l.instance_id
   16: --        AND c.slug = 'clinic';
   17: --   row 가 남아있는데 backfill 매핑이 없는 경우 SET NOT NULL 단계에서 23502(not_null_violation)
   18: --   가 발생하며 의도된 fail-fast 다.
   19: ALTER TABLE location_profile
   20:   ADD COLUMN clinic_profile_id UUID,
   21:   ADD CONSTRAINT location_profile_clinic_fk
   22:     FOREIGN KEY (instance_id, clinic_profile_id)
   23:     REFERENCES clinic_profile (instance_id, id)
   24:     ON DELETE CASCADE
   25:     DEFERRABLE INITIALLY DEFERRED;
   26: 
   27: -- LL-SCHEMA-14: 전 row NOT NULL (C-21 parentClinic SoT 정합)
   28: ALTER TABLE location_profile
   29:   ALTER COLUMN clinic_profile_id SET NOT NULL;
   30: 
   31: CREATE INDEX location_profile_clinic_idx ON location_profile (instance_id, clinic_profile_id);
   32: 
   33: -- cycle2 LL-29 + cycle3 LL-44: main slug 1 row 강제는 server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15.
   34: -- 본 migration 은 composite FK 만 추가. DB trigger 합류는 M0 v1.0 본 구현 cascade.
### packages/core-content/src/schema.ts
    1: // @glitzy/core-content — Drizzle schema (v0.3·LOCATION_LEGAL_PLAN v1.0 patch)
    2: // M0-02·03·05·06·15·16·17·18 정합·SoT: REVIEW_WORKFLOW 9 states·RISK_LEVELS 3 levels·DATA_MODEL @id 3~64자
    3: // v0.3: + legal_document (C-16) + clinic_profile policy/primary_ctas (C0007) + location_profile.clinic_profile_id (C0008)
    4: 
    5: import { sql } from "drizzle-orm";
    6: import {
    7:   pgTable, uuid, text, boolean, integer, timestamp, jsonb, date, numeric,
    8:   pgEnum, index, foreignKey, check, unique, uniqueIndex,
    9: } from "drizzle-orm/pg-core";
   10: 
   11: // === Instance (db D0010·M0-15 RLS·M0-16 slug 3~64·M0-06 slugActiveIdx) ===
   12: 
   13: export const instance = pgTable(
   14:   "instance",
   15:   {
   16:     id: uuid("id").primaryKey().defaultRandom(),
   17:     slug: text("slug").notNull().unique(),
   18:     displayName: text("display_name").notNull(),
   19:     active: boolean("active").notNull().default(true),
   20:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
   21:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
   22:   },
   23:   (t) => ({
   24:     slugRegex: check("instance_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
   25:     displayNameLen: check("instance_display_name_length", sql`length(${t.displayName}) BETWEEN 1 AND 200`),
   26:     activeIdx: index("instance_active_idx").on(t.active).where(sql`${t.active} = true`),
   27:     slugActiveIdx: index("instance_slug_active_idx").on(t.slug).where(sql`${t.active} = true`),
   28:   }),
   29: );
   30: 
   31: // === Shared enums (C-03·C-04) ===
   32: export const contentPublicationStatusEnum = pgEnum("content_publication_status", [
   33:   "draft", "review-queued", "in-review", "approved", "publishable",
   34:   "published", "blocked", "rejected", "stale",
   35: ]);
   36: 
   37: export const riskLevelEnum = pgEnum("risk_level", ["Low", "Medium", "High"]);
   38: 
   39: // LL-SCHEMA-01: legal_document_type (DATA_MODEL C-16 SoT 7종)
   40: export const legalDocumentTypeEnum = pgEnum("legal_document_type", [
   41:   "privacy", "terms", "non-covered", "refund", "complaint", "cookie", "other",
   42: ]);
   43: 
   44: // === ClinicProfile (C-01) ===
   45: 
   46: export const clinicProfile = pgTable(
   47:   "clinic_profile",
   48:   {
   49:     id: uuid("id").primaryKey().defaultRandom(),
   50:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
   51:     slug: text("slug").notNull().default("clinic"),
   52:     name: text("name").notNull(),
   53:     alternateName: text("alternate_name"),
   54:     legalEntityName: text("legal_entity_name"),
   55:     slogan: text("slogan"),
   56:     description: text("description").notNull(),
   57:     longDescription: text("long_description"),
   58:     foundingDate: date("founding_date"),
   59:     founder: text("founder"),
   60:     logoUrl: text("logo_url").notNull(),
   61:     ogImageUrl: text("og_image_url").notNull(),
   62:     businessRegistrationNumber: text("business_registration_number"),
   63:     // LL-SCHEMA-07~10 + cycle1 LL-14·20: policy 변수 4 column
   64:     policyContactPerson: text("policy_contact_person"),
   65:     policyContactEmail: text("policy_contact_email"),
   66:     policyContactPhone: text("policy_contact_phone"),
   67:     policyEffectiveDate: date("policy_effective_date"),
   68:     // LL-SCHEMA-12 + cycle1 LL-02 + cycle3·4 LL-38·48·50: primary_ctas JSONB array (CT-03 SoT)
   69:     primaryCtas: jsonb("primary_ctas").notNull().default(sql`'[]'::jsonb`),
   70:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
   71:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
   72:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
   73:   },
   74:   (t) => ({
   75:     nameLen: check("clinic_profile_name_length", sql`length(${t.name}) BETWEEN 1 AND 100`),
   76:     descLen: check("clinic_profile_description_length", sql`length(${t.description}) BETWEEN 80 AND 300`),
   77:     slugRegex: check("clinic_profile_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
   78:     brnRegex: check("clinic_profile_brn_regex", sql`${t.businessRegistrationNumber} IS NULL OR ${t.businessRegistrationNumber} ~ '^[0-9]{3}-[0-9]{2}-[0-9]{5}$'`),
   79:     // LL-SCHEMA-08 + cycle1 LL-20: policy_contact_email regex + phone format (한국 + 국제 +82)
   80:     policyEmailRegex: check("clinic_profile_policy_email_regex", sql`${t.policyContactEmail} IS NULL OR ${t.policyContactEmail} ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'`),
   81:     policyPhoneFormat: check("clinic_profile_policy_phone_format", sql`${t.policyContactPhone} IS NULL OR ${t.policyContactPhone} ~ '^(\\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}$'`),
   82:     primaryCtasArray: check("clinic_profile_primary_ctas_array", sql`jsonb_typeof(${t.primaryCtas}) = 'array'`),
   83:     // shape 검증 (CT-03 SoT 11종) 은 raw SQL trigger 로 (C0007 migration). Drizzle schema 안 표현 불가.
   84:     instanceSlugUnique: unique("clinic_profile_instance_slug_unique").on(t.instanceId, t.slug),
   85:     instanceIdUnique: unique("clinic_profile_instance_id_unique").on(t.instanceId, t.id),
   86:     instanceIdx: index("clinic_profile_instance_idx").on(t.instanceId),
   87:   }),
   88: );
   89: 
   90: // === LocationProfile (C-21·M0-18 country regex) ===
   91: 
   92: export const locationProfile = pgTable(
   93:   "location_profile",
   94:   {
   95:     id: uuid("id").primaryKey().defaultRandom(),
   96:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
   97:     slug: text("slug").notNull(),
   98:     name: text("name").notNull(),
   99:     streetAddress: text("street_address").notNull(),
  100:     addressLocality: text("address_locality").notNull(),
  101:     addressRegion: text("address_region").notNull(),
  102:     postalCode: text("postal_code").notNull(),
  103:     addressCountry: text("address_country").notNull().default("KR"),
  104:     latitude: numeric("latitude", { precision: 10, scale: 7 }),
  105:     longitude: numeric("longitude", { precision: 10, scale: 7 }),
  106:     phone: text("phone"),
  107:     email: text("email"),
  108:     // LL-SCHEMA-13~14 + cycle1 LL-01 + cycle2 LL-28: parentClinic (C-21 required) composite FK · 전 row NOT NULL
  109:     clinicProfileId: uuid("clinic_profile_id").notNull(),
  110:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
  111:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  112:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  113:   },
  114:   (t) => ({
  115:     slugRegex: check("location_profile_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
  116:     countryIso: check("location_profile_country_iso", sql`${t.addressCountry} ~ '^[A-Z]{2}$'`),
  117:     latRange: check("location_profile_lat_range", sql`${t.latitude} IS NULL OR (${t.latitude} BETWEEN -90 AND 90)`),
  118:     lngRange: check("location_profile_lng_range", sql`${t.longitude} IS NULL OR (${t.longitude} BETWEEN -180 AND 180)`),
  119:     emailRegex: check("location_profile_email_regex", sql`${t.email} IS NULL OR ${t.email} ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'`),
  120:     // LLC-10 patch: phone regex (한국 + 국제 +82) — form/DB 일치
  121:     phoneFormat: check("location_profile_phone_format", sql`${t.phone} IS NULL OR ${t.phone} ~ '^(\\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}$'`),
  122:     // LL-SCHEMA-14: composite FK — 실 migration 은 raw SQL 에서 DEFERRABLE INITIALLY DEFERRED 적용 (LLC-14 marker).
  123:     // Drizzle ORM 자체는 deferrable 옵션 미지원이므로 schema 생성 시 raw constraint 와 충돌 회피 책임은 migrations-runner 측에 있음 (LL-CASCADE-05).
  124:     clinicFk: foreignKey({
  125:       columns: [t.instanceId, t.clinicProfileId],
  126:       foreignColumns: [clinicProfile.instanceId, clinicProfile.id],
  127:       name: "location_profile_clinic_fk",
  128:     }).onDelete("cascade"),
  129:     instanceSlugUnique: unique("location_profile_instance_slug_unique").on(t.instanceId, t.slug),
  130:     instanceIdUnique: unique("location_profile_instance_id_unique").on(t.instanceId, t.id),
  131:     instanceIdx: index("location_profile_instance_idx").on(t.instanceId),
  132:     clinicIdx: index("location_profile_clinic_idx").on(t.instanceId, t.clinicProfileId),
  133:   }),
  134: );
  135: 
  136: // === DoctorProfile (C-02) ===
  137: 
  138: export const doctorProfile = pgTable(
  139:   "doctor_profile",
  140:   {
  141:     id: uuid("id").primaryKey().defaultRandom(),
  142:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
  143:     slug: text("slug").notNull(),
  144:     name: text("name").notNull(),
  145:     title: text("title"),
  146:     jobTitle: text("job_title"),
  147:     honorific: text("honorific"),
  148:     bio: text("bio"),
  149:     photoUrl: text("photo_url"),
  150:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
  151:     displayOrder: integer("display_order").notNull().default(0),
  152:     active: boolean("active").notNull().default(true),
  153:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  154:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  155:   },
  156:   (t) => ({
  157:     slugRegex: check("doctor_profile_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
  158:     nameLen: check("doctor_profile_name_length", sql`length(${t.name}) BETWEEN 1 AND 100`),
  159:     instanceSlugUnique: unique("doctor_profile_instance_slug_unique").on(t.instanceId, t.slug),
  160:     instanceIdUnique: unique("doctor_profile_instance_id_unique").on(t.instanceId, t.id),
  161:     instanceIdx: index("doctor_profile_instance_idx").on(t.instanceId),
  162:     activeOrderIdx: index("doctor_profile_active_order_idx")
  163:       .on(t.instanceId, t.active, t.displayOrder)
  164:       .where(sql`${t.active} = true`),
  165:   }),
  166: );
  167: 
  168: // === TreatmentPage (C-03·M0-02 9-state·M0-03 risk enum·M0-17 summary 50~160) ===
  169: 
  170: export const treatmentPage = pgTable(
  171:   "treatment_page",
  172:   {
  173:     id: uuid("id").primaryKey().defaultRandom(),
  174:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
  175:     slug: text("slug").notNull(),
  176:     title: text("title").notNull(),
  177:     summary: text("summary").notNull(),
  178:     bodyMarkdown: text("body_markdown").notNull(),
  179:     status: contentPublicationStatusEnum("status").notNull().default("draft"),
  180:     riskLevel: riskLevelEnum("risk_level"),
  181:     complianceRecordId: uuid("compliance_record_id"),
  182:     heroImageUrl: text("hero_image_url"),
  183:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
  184:     publishedAt: timestamp("published_at", { withTimezone: true }),
  185:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  186:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  187:   },
  188:   (t) => ({
  189:     slugRegex: check("treatment_page_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
  190:     titleLen: check("treatment_page_title_length", sql`length(${t.title}) BETWEEN 1 AND 200`),
  191:     summaryLen: check("treatment_page_summary_length", sql`length(${t.summary}) BETWEEN 50 AND 160`),
  192:     publishedRequiresAt: check("treatment_page_published_requires_at", sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`),
  193:     instanceSlugUnique: unique("treatment_page_instance_slug_unique").on(t.instanceId, t.slug),
  194:     instanceIdUnique: unique("treatment_page_instance_id_unique").on(t.instanceId, t.id),
  195:     instanceIdx: index("treatment_page_instance_idx").on(t.instanceId),
  196:     statusIdx: index("treatment_page_status_idx").on(t.instanceId, t.status),
  197:     publishedIdx: index("treatment_page_published_idx")
  198:       .on(t.instanceId, t.publishedAt)
  199:       .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
  200:   }),
  201: );
  202: 
  203: // === Article (C-04·M0-05 ON DELETE NO ACTION) ===
  204: 
  205: export const article = pgTable(
  206:   "article",
  207:   {
  208:     id: uuid("id").primaryKey().defaultRandom(),
  209:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
  210:     slug: text("slug").notNull(),
  211:     title: text("title").notNull(),
  212:     summary: text("summary").notNull(),
  213:     bodyMarkdown: text("body_markdown").notNull(),
  214:     status: contentPublicationStatusEnum("status").notNull().default("draft"),
  215:     riskLevel: riskLevelEnum("risk_level"),
  216:     complianceRecordId: uuid("compliance_record_id"),
  217:     heroImageUrl: text("hero_image_url"),
  218:     authorDoctorId: uuid("author_doctor_id"),
  219:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
  220:     publishedAt: timestamp("published_at", { withTimezone: true }),
  221:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  222:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  223:   },
  224:   (t) => ({
  225:     slugRegex: check("article_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
  226:     titleLen: check("article_title_length", sql`length(${t.title}) BETWEEN 1 AND 200`),
  227:     summaryLen: check("article_summary_length", sql`length(${t.summary}) BETWEEN 80 AND 200`),
  228:     publishedRequiresAt: check("article_published_requires_at", sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`),
  229:     instanceSlugUnique: unique("article_instance_slug_unique").on(t.instanceId, t.slug),
  230:     instanceIdUnique: unique("article_instance_id_unique").on(t.instanceId, t.id),
  231:     instanceIdx: index("article_instance_idx").on(t.instanceId),
  232:     statusIdx: index("article_status_idx").on(t.instanceId, t.status),
  233:     publishedIdx: index("article_published_idx")
  234:       .on(t.instanceId, t.publishedAt)
  235:       .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
  236:     authorIdx: index("article_author_idx")
  237:       .on(t.instanceId, t.authorDoctorId)
  238:       .where(sql`${t.authorDoctorId} IS NOT NULL`),
  239:     // M0-05 cycle2: ON DELETE NO ACTION (Drizzle 기본·onDelete 미명시)
  240:     authorFk: foreignKey({
  241:       columns: [t.instanceId, t.authorDoctorId],
  242:       foreignColumns: [doctorProfile.instanceId, doctorProfile.id],
  243:       name: "article_author_fk",
  244:     }),
  245:   }),
  246: );
  247: 
  248: // === LegalDocument (C-16·LOCATION_LEGAL_PLAN v1.0 § 2.1) ===
  249: 
  250: export const legalDocument = pgTable(
  251:   "legal_document",
  252:   {
  253:     id: uuid("id").primaryKey().defaultRandom(),
  254:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
  255:     slug: text("slug").notNull(),
  256:     documentType: legalDocumentTypeEnum("document_type").notNull(),
  257:     title: text("title").notNull(),
  258:     body: text("body").notNull(),
  259:     autoGenerated: boolean("auto_generated").notNull().default(true),
  260:     templateVersion: text("template_version"),
  261:     // LLC-11 patch: DB DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Seoul')::date — raw SQL 에서 적용. Drizzle 은 default 표현 불가 → migration SoT.
  262:     effectiveDate: date("effective_date").notNull(),
  263:     lastRevisedDate: date("last_revised_date"),
  264:     contactPerson: text("contact_person"),
  265:     contactEmail: text("contact_email"),
  266:     status: contentPublicationStatusEnum("status").notNull().default("draft"),
  267:     riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
  268:     publishedAt: timestamp("published_at", { withTimezone: true }),
  269:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
  270:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  271:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  272:   },
  273:   (t) => ({
  274:     slugRegex: check("legal_document_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
  275:     titleLen: check("legal_document_title_length", sql`length(${t.title}) BETWEEN 1 AND 100`),
  276:     bodyLen: check("legal_document_body_length", sql`length(${t.body}) BETWEEN 1 AND 200000`),
  277:     emailRegex: check("legal_document_email_regex", sql`${t.contactEmail} IS NULL OR ${t.contactEmail} ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'`),
  278:     // LL-SCHEMA-05 + cycle1 LL-22
  279:     templateVersionFormat: check("legal_document_template_version_format", sql`${t.templateVersion} IS NULL OR ${t.templateVersion} ~ '^[a-z0-9-]+@[0-9]+\\.[0-9]+\\.[0-9]+$'`),
  280:     autoGenTemplateVer: check("legal_document_auto_generated_template_ver", sql`(${t.autoGenerated} = false) OR (${t.templateVersion} IS NOT NULL)`),
  281:     // LL-SCHEMA-03 + cycle1 LL-03·19: skeleton 단계 status='draft' 만
  282:     statusSkeletonLimit: check("legal_document_status_skeleton_limit", sql`${t.status} = 'draft'`),
  283:     publishedAtNull: check("legal_document_published_at_null", sql`${t.publishedAt} IS NULL`),
  284:     // LL-SCHEMA-06 + cycle1 LL-12: risk_level 'Low' 만
  285:     riskLevelSkeletonLimit: check("legal_document_risk_level_skeleton_limit", sql`${t.riskLevel} = 'Low'`),
  286:     instanceSlugUnique: unique("legal_document_instance_slug_unique").on(t.instanceId, t.slug),
  287:     instanceIdUnique: unique("legal_document_instance_id_unique").on(t.instanceId, t.id),
  288:     // LL-SCHEMA-02 + cycle1 LL-08·09: closed 5종 partial UNIQUE (cookie/other 미강제)
  289:     type5Unique: uniqueIndex("legal_document_instance_5type_unique")
  290:       .on(t.instanceId, t.documentType)
  291:       .where(sql`${t.documentType} IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint')`),
  292:     instanceIdx: index("legal_document_instance_idx").on(t.instanceId),
  293:   }),
  294: );
### packages/core-content/src/templates/index.ts
    1: // @glitzy/core-content/templates — LOCATION_LEGAL_PLAN v1.0 § 5
    2: //
    3: // LL-TEMPLATE-04 marker: 본 5종 표준 템플릿 본문은 본 plan 의 검토 범위 외.
    4: // 법무 검토 필수 — 별도 cascade 로 법무 검토 받은 본문으로 교체.
    5: 
    6: import {
    7:   PRIVACY_BODY,
    8:   TERMS_BODY,
    9:   NON_COVERED_BODY,
   10:   REFUND_BODY,
   11:   COMPLAINT_BODY,
   12: } from "./bodies.js";
   13: 
   14: export type ClosedLegalDocumentType =
   15:   | "privacy"
   16:   | "terms"
   17:   | "non-covered"
   18:   | "refund"
   19:   | "complaint";
   20: 
   21: export type LegalDocumentType = ClosedLegalDocumentType | "cookie" | "other";
   22: 
   23: export type Template = {
   24:   readonly documentType: ClosedLegalDocumentType;
   25:   readonly slug: string;
   26:   readonly title: string;
   27:   readonly version: string;
   28:   readonly body: string;
   29: };
   30: 
   31: export const TEMPLATES: Record<ClosedLegalDocumentType, Template> = {
   32:   privacy: {
   33:     documentType: "privacy",
   34:     slug: "privacy",
   35:     title: "개인정보처리방침",
   36:     version: "privacy@1.0.0",
   37:     body: PRIVACY_BODY,
   38:   },
   39:   terms: {
   40:     documentType: "terms",
   41:     slug: "terms",
   42:     title: "이용약관",
   43:     version: "terms@1.0.0",
   44:     body: TERMS_BODY,
   45:   },
   46:   "non-covered": {
   47:     documentType: "non-covered",
   48:     slug: "non-covered",
   49:     title: "비급여 진료비 안내",
   50:     version: "non-covered@1.0.0",
   51:     body: NON_COVERED_BODY,
   52:   },
   53:   refund: {
   54:     documentType: "refund",
   55:     slug: "refund",
   56:     title: "환불 규정",
   57:     version: "refund@1.0.0",
   58:     body: REFUND_BODY,
   59:   },
   60:   complaint: {
   61:     documentType: "complaint",
   62:     slug: "complaint",
   63:     title: "민원 처리 안내",
   64:     version: "complaint@1.0.0",
   65:     body: COMPLAINT_BODY,
   66:   },
   67: };
   68: 
   69: export const CLOSED_DOCUMENT_TYPES: readonly ClosedLegalDocumentType[] = [
   70:   "privacy",
   71:   "terms",
   72:   "non-covered",
   73:   "refund",
   74:   "complaint",
   75: ];
   76: 
   77: // LL-ACTION-04 patch: alpha sort (deadlock 회피 순서) — server action 안 잠금 순서와 동일.
   78: export const CLOSED_DOCUMENT_TYPES_ALPHA: readonly ClosedLegalDocumentType[] = [
   79:   "complaint",
   80:   "non-covered",
   81:   "privacy",
   82:   "refund",
   83:   "terms",
   84: ];
   85: 
   86: export { renderTemplate, listTemplateVariables, TemplateRenderError } from "./render.js";
   87: export type { RenderContext } from "./render.js";
### packages/core-content/src/templates/render.ts
    1: // @glitzy/core-content/templates/render — LOCATION_LEGAL_PLAN v1.0 § 4.2
    2: //
    3: // 변수 치환 엔진. 화이트리스트 strict — 등록되지 않은 키는 throw.
    4: //
    5: // cycle1 LL-06 + cycle2 LL-33 + cycle3 LL-45 patch:
    6: //   policy.* 변수 정당화 (admin/ARCH § 3.8.2 contactPerson 입력 섹션 SoT).
    7: //
    8: // cycle3 LL-24 + cycle4 LL-55 patch:
    9: //   검출 시점 = server action runtime (renderTemplate throw → formError).
   10: //   build-time test 도 packages/core-content test runner 에서 cascade.
   11: 
   12: export type RenderContext = {
   13:   clinic: {
   14:     name: string;
   15:     legalEntityName: string | null;
   16:     businessRegistrationNumber: string | null;
   17:     founder: string | null;
   18:   };
   19:   location: {
   20:     main: {
   21:       address: string;
   22:       telephone: string;
   23:       email: string | null;
   24:     };
   25:   };
   26:   policy: {
   27:     contactPerson: string;
   28:     contactEmail: string;
   29:     contactPhone: string;
   30:     effectiveDate: string;
   31:   };
   32: };
   33: 
   34: const VARIABLE_WHITELIST = new Set<string>([
   35:   "clinic.name",
   36:   "clinic.legalEntityName",
   37:   "clinic.businessRegistrationNumber",
   38:   "clinic.founder",
   39:   "location.main.address",
   40:   "location.main.telephone",
   41:   "location.main.email",
   42:   "policy.contactPerson",
   43:   "policy.contactEmail",
   44:   "policy.contactPhone",
   45:   "policy.effectiveDate",
   46: ]);
   47: 
   48: export class TemplateRenderError extends Error {
   49:   override readonly name = "TemplateRenderError";
   50:   constructor(
   51:     public readonly reason: "unknown-variable" | "missing-required-value",
   52:     public readonly variableKey: string,
   53:     message: string,
   54:   ) {
   55:     super(message);
   56:   }
   57: }
   58: 
   59: function resolveVariable(key: string, ctx: RenderContext): string | null {
   60:   switch (key) {
   61:     case "clinic.name": return ctx.clinic.name;
   62:     case "clinic.legalEntityName": return ctx.clinic.legalEntityName;
   63:     case "clinic.businessRegistrationNumber": return ctx.clinic.businessRegistrationNumber;
   64:     case "clinic.founder": return ctx.clinic.founder;
   65:     case "location.main.address": return ctx.location.main.address;
   66:     case "location.main.telephone": return ctx.location.main.telephone;
   67:     case "location.main.email": return ctx.location.main.email;
   68:     case "policy.contactPerson": return ctx.policy.contactPerson;
   69:     case "policy.contactEmail": return ctx.policy.contactEmail;
   70:     case "policy.contactPhone": return ctx.policy.contactPhone;
   71:     case "policy.effectiveDate": return ctx.policy.effectiveDate;
   72:     default:
   73:       throw new TemplateRenderError("unknown-variable", key, `unknown variable: ${key}`);
   74:   }
   75: }
   76: 
   77: // LL-ACTION-13: 단순 fallback `(미기재)` — 옵셔널 변수 NULL 시 표기.
   78: function nullFallback(key: string): string {
   79:   if (key === "clinic.legalEntityName") return "(법인명 미기재)";
   80:   if (key === "clinic.businessRegistrationNumber") return "(사업자등록번호 미기재)";
   81:   if (key === "clinic.founder") return "(대표자 미기재)";
   82:   if (key === "location.main.email") return "(이메일 미기재)";
   83:   return "(미기재)";
   84: }
   85: 
   86: // LL-ACTION-14: 1차 치환만 (no recursive expansion).
   87: const VARIABLE_PATTERN = /\{\{\s*([a-zA-Z][a-zA-Z0-9_.-]*)\s*\}\}/g;
   88: 
   89: export function renderTemplate(template: string, ctx: RenderContext): string {
   90:   return template.replace(VARIABLE_PATTERN, (_, key: string) => {
   91:     // 화이트리스트 검증 (strict)
   92:     if (!VARIABLE_WHITELIST.has(key)) {
   93:       throw new TemplateRenderError("unknown-variable", key, `unknown variable: ${key}`);
   94:     }
   95:     const value = resolveVariable(key, ctx);
   96:     if (value === null) return nullFallback(key);
   97:     return value;
   98:   });
   99: }
  100: 
  101: // build-time unit test cascade — packages/core-content test runner 가 모든 템플릿의 unknown key 부재 검증.
  102: export function listTemplateVariables(template: string): string[] {
  103:   const keys = new Set<string>();
  104:   let match: RegExpExecArray | null;
  105:   const re = new RegExp(VARIABLE_PATTERN.source, "g");
  106:   while ((match = re.exec(template)) !== null) {
  107:     keys.add(match[1]!);
  108:   }
  109:   return [...keys];
  110: }
### packages/core-content/src/templates/bodies.ts
    1: // @glitzy/core-content/templates/bodies — LOCATION_LEGAL_PLAN v1.0 § 5
    2: //
    3: // LL-TEMPLATE-04 marker: 본 5종 표준 템플릿 본문은 본 plan 의 검토 범위 외.
    4: // 법무 검토 필수 — 별도 cascade 로 법무 검토 받은 본문으로 교체.
    5: //
    6: // String.raw 로 backtick/${} escape 부담 회피 (템플릿 안 {{...}} 만 사용 — 충돌 없음).
    7: 
    8: export const PRIVACY_BODY: string = String.raw`# {{clinic.name}} 개인정보처리방침
    9: 
   10: **시행일**: {{policy.effectiveDate}}
   11: 
   12: {{clinic.name}}(이하 "본 기관")은 「개인정보 보호법」 등 관련 법령을 준수하며, 이용자의 개인정보 보호를 위해 다음과 같이 개인정보처리방침을 수립·공개합니다.
   13: 
   14: ## 1. 개인정보의 처리 목적
   15: 
   16: 본 기관은 다음의 목적을 위하여 개인정보를 처리합니다. 처리한 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경될 시에는 사전 동의를 구할 예정입니다.
   17: 
   18: - 진료 예약 및 진료 서비스 제공
   19: - 진료 기록 및 의료 정보 관리
   20: - 의료법 등 관련 법령상 의무 이행
   21: - 민원 처리 및 의견 수렴
   22: 
   23: ## 2. 처리하는 개인정보의 항목
   24: 
   25: 본 기관은 다음의 개인정보 항목을 처리하고 있습니다.
   26: 
   27: - 필수 항목: 성명, 생년월일, 연락처, 진료 관련 정보
   28: - 선택 항목: 이메일 주소, 주소
   29: - 자동 수집 항목: 접속 IP, 쿠키, 서비스 이용 기록
   30: 
   31: ## 3. 개인정보의 보유 및 이용 기간
   32: 
   33: 본 기관은 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용 기간 내에서 개인정보를 처리·보유합니다.
   34: 
   35: - 진료 기록: 「의료법」 제22조 및 시행규칙 제15조에 따라 10년 (진단서 등은 3년)
   36: - 회원 정보: 회원 탈퇴 시까지 (관계 법령에 따른 보존 의무 기간 별도 적용)
   37: 
   38: ## 4. 정보주체와 법정대리인의 권리·의무 및 행사 방법
   39: 
   40: 정보주체는 본 기관에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
   41: 
   42: 1. 개인정보 열람 요구
   43: 2. 오류 등이 있을 경우 정정 요구
   44: 3. 삭제 요구
   45: 4. 처리 정지 요구
   46: 
   47: 권리 행사는 본 기관에 대해 「개인정보 보호법」 시행령 제41조제1항에 따라 서면, 전자우편 등을 통하여 하실 수 있으며, 본 기관은 이에 대해 지체 없이 조치하겠습니다.
   48: 
   49: ## 5. 개인정보 보호책임자
   50: 
   51: 본 기관은 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만 처리 및 피해 구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
   52: 
   53: - 개인정보 보호책임자
   54:   - 성명: {{policy.contactPerson}}
   55:   - 연락처: {{policy.contactPhone}}
   56:   - 이메일: {{policy.contactEmail}}
   57: 
   58: ## 6. 개인정보 처리방침 변경
   59: 
   60: 이 개인정보 처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경 내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 본 기관 홈페이지를 통하여 고지할 것입니다.
   61: 
   62: ---
   63: 
   64: **기관 정보**
   65: - 기관명: {{clinic.name}}
   66: - 법인명: {{clinic.legalEntityName}}
   67: - 사업자등록번호: {{clinic.businessRegistrationNumber}}
   68: - 주소: {{location.main.address}}
   69: - 대표 연락처: {{location.main.telephone}}
   70: - 이메일: {{location.main.email}}
   71: `;
   72: 
   73: export const TERMS_BODY: string = String.raw`# {{clinic.name}} 이용약관
   74: 
   75: **시행일**: {{policy.effectiveDate}}
   76: 
   77: ## 제1조 (목적)
   78: 
   79: 본 약관은 {{clinic.name}}(이하 "본 기관")이 운영하는 웹사이트 및 진료 서비스(이하 "서비스")의 이용 조건 및 절차, 본 기관과 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
   80: 
   81: ## 제2조 (약관의 명시 및 변경)
   82: 
   83: 1. 본 기관은 본 약관의 내용을 이용자가 쉽게 알 수 있도록 본 기관의 웹사이트 초기 화면 또는 별도의 연결화면에 게시합니다.
   84: 2. 본 기관은 「약관의 규제에 관한 법률」, 「전자상거래 등에서의 소비자 보호에 관한 법률」 등 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.
   85: 3. 본 기관이 약관을 개정할 경우 적용일자 및 개정사유를 명시하여 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.
   86: 
   87: ## 제3조 (서비스의 제공 및 변경)
   88: 
   89: 1. 본 기관은 다음과 같은 서비스를 제공합니다.
   90:    - 진료 예약 및 안내
   91:    - 의료 정보 제공
   92:    - 진료 기록 관리
   93:    - 기타 본 기관이 정하는 서비스
   94: 2. 본 기관은 서비스의 내용 및 제공일자를 변경할 경우, 변경될 서비스의 내용 및 제공일자를 명시하여 현재의 서비스 화면에 변경 전 7일 이상 공지합니다.
   95: 
   96: ## 제4조 (서비스 이용시간)
   97: 
   98: 서비스의 이용은 본 기관의 진료 시간을 기준으로 합니다. 다만, 시스템 점검·교체 등 사유로 일시 중단될 수 있으며, 이 경우 본 기관은 사전에 공지합니다.
   99: 
  100: ## 제5조 (이용자의 의무)
  101: 
  102: 1. 이용자는 다음 행위를 하여서는 안 됩니다.
  103:    - 신청 또는 변경 시 허위 내용의 등록
  104:    - 본 기관에 게시된 정보의 변경
  105:    - 본 기관이 정한 정보 이외의 정보(컴퓨터 프로그램 등) 송신 또는 게시
  106:    - 본 기관 및 기타 제3자의 저작권 등 지식재산권에 대한 침해
  107: 
  108: ## 제6조 (책임 제한)
  109: 
  110: 1. 본 기관은 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력의 사유로 서비스를 제공할 수 없는 경우 책임이 면제됩니다.
  111: 2. 본 기관은 이용자의 귀책사유로 인한 서비스 이용 장애에 대하여 책임을 지지 않습니다.
  112: 
  113: ## 제7조 (분쟁 해결)
  114: 
  115: 본 약관에 명시되지 않은 사항 및 본 약관의 해석에 관하여는 「약관의 규제에 관한 법률」, 「전자상거래 등에서의 소비자 보호에 관한 법률」, 「개인정보 보호법」 등 관련 법령에 따릅니다.
  116: 
  117: ## 제8조 (관할 법원)
  118: 
  119: 본 기관과 이용자 간 발생한 분쟁에 관한 소송은 본 기관 소재지의 관할 법원을 합의관할로 합니다.
  120: 
  121: ---
  122: 
  123: **기관 정보**
  124: - 기관명: {{clinic.name}}
  125: - 법인명: {{clinic.legalEntityName}}
  126: - 사업자등록번호: {{clinic.businessRegistrationNumber}}
  127: - 대표자: {{clinic.founder}}
  128: - 주소: {{location.main.address}}
  129: - 대표 연락처: {{location.main.telephone}}
  130: 
  131: **문의처**
  132: - 담당자: {{policy.contactPerson}}
  133: - 이메일: {{policy.contactEmail}}
  134: - 전화: {{policy.contactPhone}}
  135: `;
  136: 
  137: export const NON_COVERED_BODY: string = String.raw`# {{clinic.name}} 비급여 진료비 안내
  138: 
  139: **시행일**: {{policy.effectiveDate}}
  140: 
  141: 본 안내는 「의료법」 제45조 및 같은 법 시행규칙 제42조의2(비급여 진료비용 등의 고지)에 따라 {{clinic.name}}의 비급여 진료비를 안내합니다.
  142: 
  143: ## 1. 비급여 진료비 고지 의무
  144: 
  145: 본 기관은 「의료법」 제45조에 따라 환자가 부담하는 비급여 진료비용을 사전에 환자에게 알리는 의무를 이행합니다.
  146: 
  147: ## 2. 비급여 진료비 항목
  148: 
  149: 본 기관에서 제공하는 비급여 진료 항목 및 비용은 본 기관의 웹사이트(/treatments) 또는 진료실 내 게시판에 별도로 게시합니다.
  150: 
  151: 세부 비급여 항목 및 가격은 환자의 진료 상태, 시술 부위·범위, 사용 재료 등에 따라 달라질 수 있으며, 진료 전 충분한 상담을 통해 안내드립니다.
  152: 
  153: ## 3. 비급여 진료비 변경
  154: 
  155: 비급여 진료비는 의료법 및 본 기관 운영 정책에 따라 변경될 수 있으며, 변경 시 본 기관 웹사이트 및 진료실 내 게시판을 통해 사전 고지합니다.
  156: 
  157: ## 4. 진료비 산정 기준
  158: 
  159: 비급여 진료비는 다음 사항을 종합적으로 고려하여 산정됩니다.
  160: 
  161: - 진료의 종류와 난이도
  162: - 사용되는 의료 재료 및 의약품
  163: - 진료 시간 및 인력
  164: - 진료 환경 및 시설
  165: 
  166: ## 5. 진료비 영수증 발급
  167: 
  168: 본 기관은 환자가 부담하는 모든 진료비에 대해 영수증을 발급하며, 영수증에는 진료 항목 및 금액이 상세히 표기됩니다.
  169: 
  170: ## 6. 진료비 안내 문의
  171: 
  172: 비급여 진료비 안내에 대한 문의는 아래로 연락 주시기 바랍니다.
  173: 
  174: - 담당자: {{policy.contactPerson}}
  175: - 전화: {{policy.contactPhone}}
  176: - 이메일: {{policy.contactEmail}}
  177: 
  178: ## 7. 의료광고 관련 안내
  179: 
  180: 「의료법」 제56조 및 같은 법 시행령 제23조에 따라, 비급여 진료비에 대한 광고 및 안내는 의료광고 사전 심의 대상이 될 수 있으며, 본 기관은 관련 법령을 준수하여 안내드립니다.
  181: 
  182: ---
  183: 
  184: **기관 정보**
  185: - 기관명: {{clinic.name}}
  186: - 사업자등록번호: {{clinic.businessRegistrationNumber}}
  187: - 주소: {{location.main.address}}
  188: - 대표 연락처: {{location.main.telephone}}
  189: `;
  190: 
  191: export const REFUND_BODY: string = String.raw`# {{clinic.name}} 환불 규정
  192: 
  193: **시행일**: {{policy.effectiveDate}}
  194: 
  195: 본 환불 규정은 {{clinic.name}}(이하 "본 기관")에서 발생하는 진료비 환불 절차 및 기준에 관한 사항을 규정합니다.
  196: 
  197: ## 1. 환불 사유
  198: 
  199: 환불은 다음 사유로 신청할 수 있습니다.
  200: 
  201: - 진료 예약 후 본 기관 또는 의료진의 사유로 진료가 이루어지지 않은 경우
  202: - 진료비 과오납이 확인된 경우
  203: - 의료법 등 관련 법령에 따라 환불 의무가 발생한 경우
  204: - 시술 또는 진료 계약 해지 시 (본 기관의 진료 동의서 및 시술 약관에 따름)
  205: 
  206: ## 2. 환불 신청 절차
  207: 
  208: 1. 환불을 신청하는 경우, 신청자(또는 법정대리인)는 본 기관에 다음 서류를 제출해야 합니다.
  209:    - 진료비 영수증 원본 또는 사본
  210:    - 환불 신청서 (본 기관 양식)
  211:    - 본인 확인 서류 (신분증 사본)
  212:    - 환불 입금 계좌 정보 (본인 명의)
  213: 2. 환불 신청은 본 기관 방문, 전화, 이메일을 통해 가능합니다.
  214: 
  215: ## 3. 환불 처리 기간
  216: 
  217: 환불 신청이 접수된 후 **영업일 기준 7일 이내** 환불 처리를 완료합니다. 다만, 환불 사유 확인을 위해 추가 시간이 소요될 수 있으며, 이 경우 신청자에게 사전에 안내합니다.
  218: 
  219: ## 4. 환불 금액 산정
  220: 
  221: 환불 금액은 다음 기준에 따라 산정됩니다.
  222: 
  223: - 진료가 전혀 이루어지지 않은 경우: 납입한 진료비 전액 환불
  224: - 진료가 일부 이루어진 경우: 본 기관의 진료 약관 및 시술별 환불 정책에 따라 산정
  225: - 사용된 의료 재료, 의약품, 시설 비용 등은 환불 대상에서 제외될 수 있습니다.
  226: 
  227: ## 5. 환불이 불가한 경우
  228: 
  229: 다음의 경우에는 환불이 제한될 수 있습니다.
  230: 
  231: - 진료 또는 시술이 정상적으로 완료된 경우 (단, 의료 분쟁 시 별도 검토)
  232: - 환자의 사유로 진료 예약 시간 직전 취소한 경우 (본 기관 취소 규정에 따라 일부 차감)
  233: - 본 기관의 동의 없이 임의로 진료를 중단한 경우
  234: 
  235: ## 6. 분쟁 해결
  236: 
  237: 환불 관련 분쟁이 발생할 경우, 본 기관은 신청자와 협의하여 원만한 해결을 위해 노력합니다. 합의가 이루어지지 않을 경우 한국소비자원, 의료분쟁조정중재원 등 관련 기관의 도움을 받을 수 있습니다.
  238: 
  239: ## 7. 환불 문의처
  240: 
  241: - 담당자: {{policy.contactPerson}}
  242: - 전화: {{policy.contactPhone}}
  243: - 이메일: {{policy.contactEmail}}
  244: 
  245: ---
  246: 
  247: **기관 정보**
  248: - 기관명: {{clinic.name}}
  249: - 법인명: {{clinic.legalEntityName}}
  250: - 대표자: {{clinic.founder}}
  251: - 사업자등록번호: {{clinic.businessRegistrationNumber}}
  252: - 주소: {{location.main.address}}
  253: - 대표 연락처: {{location.main.telephone}}
  254: `;
  255: 
  256: export const COMPLAINT_BODY: string = String.raw`# {{clinic.name}} 민원 처리 안내
  257: 
  258: **시행일**: {{policy.effectiveDate}}
  259: 
  260: {{clinic.name}}(이하 "본 기관")은 환자 및 보호자의 권익 보호와 신속한 민원 처리를 위해 다음과 같이 민원 처리 절차를 운영합니다.
  261: 
  262: ## 1. 민원 접수 방법
  263: 
  264: 본 기관은 다음 방법으로 민원을 접수합니다.
  265: 
  266: - 방문 접수: 본 기관 안내데스크
  267: - 전화 접수: {{policy.contactPhone}}
  268: - 이메일 접수: {{policy.contactEmail}}
  269: - 우편 접수: {{location.main.address}}
  270: 
  271: ## 2. 민원 처리 담당자
  272: 
  273: - 민원 처리 담당자: {{policy.contactPerson}}
  274: - 연락처: {{policy.contactPhone}}
  275: - 이메일: {{policy.contactEmail}}
  276: 
  277: ## 3. 민원 처리 절차
  278: 
  279: 1. **민원 접수**: 접수된 민원은 즉시 담당자에게 전달됩니다.
  280: 2. **사실 확인**: 접수된 민원의 사실관계를 확인하기 위해 관련 자료를 검토하고, 필요 시 신청자와 추가 면담을 진행합니다.
  281: 3. **검토 및 조치**: 민원의 성격에 따라 관련 부서 또는 의료진과 협의하여 조치 방안을 결정합니다.
  282: 4. **결과 통보**: 처리 결과는 접수일로부터 **영업일 기준 14일 이내** 신청자에게 서면 또는 이메일로 통보합니다.
  283: 
  284: ## 4. 민원 처리 기간
  285: 
  286: - 일반 민원: 영업일 기준 7일 이내
  287: - 의료 분쟁 관련 민원: 영업일 기준 14일 이내 (추가 검토 필요 시 30일 이내 연장 가능)
  288: - 기간 연장 시 신청자에게 사전 안내합니다.
  289: 
  290: ## 5. 의료 분쟁 조정
  291: 
  292: 의료 행위와 관련된 분쟁이 발생한 경우, 다음 기관의 도움을 받을 수 있습니다.
  293: 
  294: - **한국의료분쟁조정중재원**: https://www.k-medi.or.kr (전화 1670-2545)
  295: - **한국소비자원**: https://www.kca.go.kr (전화 1372)
  296: - **보건복지부 의료기관 평가인증원** 등 관련 기관
  297: 
  298: ## 6. 환자의 권리
  299: 
  300: 본 기관은 환자의 다음 권리를 존중합니다.
  301: 
  302: - 진료받을 권리
  303: - 알 권리 및 자기결정권
  304: - 비밀을 보호받을 권리
  305: - 상담·조정을 신청할 권리
  306: 
  307: ## 7. 민원인의 의무
  308: 
  309: 민원 신청 시 다음 사항을 준수해 주시기 바랍니다.
  310: 
  311: - 사실에 근거한 민원 제기
  312: - 본 기관 직원에 대한 폭언·폭행·성희롱 금지
  313: - 동일 민원의 반복 제기 자제
  314: 
  315: ## 8. 개인정보 보호
  316: 
  317: 민원 처리 과정에서 수집된 개인정보는 본 기관의 「개인정보처리방침」에 따라 안전하게 관리되며, 민원 처리 외의 목적으로 사용되지 않습니다.
  318: 
  319: ---
  320: 
  321: **기관 정보**
  322: - 기관명: {{clinic.name}}
  323: - 법인명: {{clinic.legalEntityName}}
  324: - 사업자등록번호: {{clinic.businessRegistrationNumber}}
  325: - 주소: {{location.main.address}}
  326: - 대표 연락처: {{location.main.telephone}}
  327: - 대표 이메일: {{location.main.email}}
  328: `;
### packages/core-content/src/templates/__tests__.ts
    1: // @glitzy/core-content/templates/__tests__ — LL-ACTION-12 + cycle3 LL-24 + cycle4 LL-55
    2: //
    3: // build-time unit test cascade — packages/core-content test runner 가
    4: // 모든 표준 템플릿의 unknown variable key 부재 + render round-trip 검증.
    5: //
    6: // 단순 실행: `node dist/templates/__tests__.js` 또는 vitest. 본 파일은 module 로 export 하는 함수만 제공.
    7: // (test runner 추가는 별도 cascade — packages/core-content/package.json 에 test script.)
    8: 
    9: import { TEMPLATES, CLOSED_DOCUMENT_TYPES } from "./index.js";
   10: import { listTemplateVariables, renderTemplate, type RenderContext } from "./render.js";
   11: 
   12: const VARIABLE_WHITELIST: ReadonlySet<string> = new Set([
   13:   "clinic.name",
   14:   "clinic.legalEntityName",
   15:   "clinic.businessRegistrationNumber",
   16:   "clinic.founder",
   17:   "location.main.address",
   18:   "location.main.telephone",
   19:   "location.main.email",
   20:   "policy.contactPerson",
   21:   "policy.contactEmail",
   22:   "policy.contactPhone",
   23:   "policy.effectiveDate",
   24: ]);
   25: 
   26: export type TemplateTestFailure = {
   27:   documentType: string;
   28:   reason: "unknown-variable" | "render-error";
   29:   detail: string;
   30: };
   31: 
   32: export function validateAllTemplates(): TemplateTestFailure[] {
   33:   const failures: TemplateTestFailure[] = [];
   34: 
   35:   for (const docType of CLOSED_DOCUMENT_TYPES) {
   36:     const template = TEMPLATES[docType];
   37:     const variables = listTemplateVariables(template.body);
   38:     for (const v of variables) {
   39:       if (!VARIABLE_WHITELIST.has(v)) {
   40:         failures.push({
   41:           documentType: docType,
   42:           reason: "unknown-variable",
   43:           detail: `template contains unknown variable: ${v}`,
   44:         });
   45:       }
   46:     }
   47:   }
   48: 
   49:   // round-trip render — 모든 변수 채운 ctx 로 5종 렌더링 시도
   50:   const ctx: RenderContext = {
   51:     clinic: {
   52:       name: "테스트 의원",
   53:       legalEntityName: "(주)테스트의료",
   54:       businessRegistrationNumber: "123-45-67890",
   55:       founder: "홍길동",
   56:     },
   57:     location: {
   58:       main: {
   59:         address: "서울특별시 강남구 테스트로 1",
   60:         telephone: "02-1234-5678",
   61:         email: "info@example.test",
   62:       },
   63:     },
   64:     policy: {
   65:       contactPerson: "김보호",
   66:       contactEmail: "privacy@example.test",
   67:       contactPhone: "02-1234-5678",
   68:       effectiveDate: "2026-05-16",
   69:     },
   70:   };
   71: 
   72:   for (const docType of CLOSED_DOCUMENT_TYPES) {
   73:     try {
   74:       const rendered = renderTemplate(TEMPLATES[docType].body, ctx);
   75:       if (rendered.includes("{{") || rendered.includes("}}")) {
   76:         failures.push({
   77:           documentType: docType,
   78:           reason: "render-error",
   79:           detail: "rendered output still contains {{...}} placeholders",
   80:         });
   81:       }
   82:     } catch (err) {
   83:       failures.push({
   84:         documentType: docType,
   85:         reason: "render-error",
   86:         detail: err instanceof Error ? err.message : String(err),
   87:       });
   88:     }
   89:   }
   90: 
   91:   return failures;
   92: }
   93: 
   94: // CLI runner — `node dist/templates/__tests__.js` 직접 실행 시 결과 출력 + exit code.
   95: const isMainModule =
   96:   typeof process !== "undefined" &&
   97:   Array.isArray(process.argv) &&
   98:   process.argv[1] !== undefined &&
   99:   process.argv[1].endsWith("__tests__.js");
  100: 
  101: if (isMainModule) {
  102:   const failures = validateAllTemplates();
  103:   if (failures.length === 0) {
  104:     console.log("[core-content/templates] all 5 templates PASS — 0 failures");
  105:     process.exit(0);
  106:   } else {
  107:     console.error(`[core-content/templates] FAIL — ${failures.length} failure(s):`);
  108:     for (const f of failures) {
  109:       console.error(`  - [${f.documentType}] ${f.reason}: ${f.detail}`);
  110:     }
  111:     process.exit(1);
  112:   }
  113: }
### packages/core-content/package.json
    1: {
    2:   "name": "@glitzy/core-content",
    3:   "version": "0.1.0",
    4:   "private": true,
    5:   "type": "module",
    6:   "main": "./dist/index.js",
    7:   "types": "./dist/index.d.ts",
    8:   "exports": {
    9:     ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" }
   10:   },
   11:   "scripts": {
   12:     "build": "tsc -p tsconfig.json && node dist/templates/__tests__.js",
   13:     "typecheck": "tsc --noEmit -p tsconfig.json",
   14:     "test:templates": "node dist/templates/__tests__.js"
   15:   },
   16:   "dependencies": {
   17:     "@glitzy/db": "workspace:*",
   18:     "@glitzy/shared-errors": "workspace:*",
   19:     "@glitzy/shared-types": "workspace:*",
   20:     "drizzle-orm": "^0.36.4"
   21:   },
   22:   "devDependencies": {
   23:     "@types/node": "^22.10.5",
   24:     "typescript": "^5.7.3"
   25:   }
   26: }
### packages/migrations-runner/src/index.ts
    1: // @glitzy/migrations-runner — Spike D LOCAL_PASS 승격 (placeholder·v0.1) + manifest spec (v0.1 — LL-CASCADE-05)
    2: // SoT: memory/milestone_spike_d_local_pass.md · LOCATION_LEGAL_PLAN v1.0 § 6 · § 10 LL-CASCADE-05
    3: //
    4: // 향후 module:
    5: //   - runner.ts (loadMigrations·runMigrate·migrationsDir·stopAfter·forward-only guard·per-file tx)
    6: //   - deploy.ts (runDeploy·deploy coordinator lock·pending N-1·empty target 11-class guard·pre/post-drift)
    7: //   - drift-check.ts (snapshotSchema·diffSnapshots·checkDriftAgainstShadow — definition-aware)
    8: //   - schema-reset.ts (DROP SCHEMA public CASCADE)
    9: //   - service-role-emit.ts (audit_event 1:1 per migration)
   10: //
   11: // 현재 acceptance 강도:
   12: //   - manifest spec (`manifest.ts`) — plan v1.0 acceptance precondition (작성 완료)
   13: //   - 실 runner 코드 — LL-DEFER-20 (M0 v1.0 본 구현)
   14: 
   15: export { orderedMigrations, validateManifest, type MigrationDescriptor } from "./manifest.js";
### packages/migrations-runner/src/manifest.ts
    1: // @glitzy/migrations-runner — cross-package migrations manifest spec (v0.1)
    2: // SoT cascade: LL-CASCADE-05 · LOCATION_LEGAL_PLAN v1.0 § 6 의존성 표
    3: //
    4: // 본 manifest 는 cross-package migrations 의 sequential apply 순서와 명시적 depends_on 을 SoT 로 보존한다.
    5: // 실 runner 코드 (sequential apply + fail-fast) 합류는 LL-DEFER-20 (M0 v1.0 본 구현). 본 spec 작성까지가
    6: // plan v1.0 acceptance precondition (LL-CASCADE-05 강도).
    7: //
    8: // orderedMigrations 의 순서를 runner 가 그대로 따른다. orderIndex 가 강한 결정성 (이름 정렬 불가 — 다른
    9: // 패키지의 D0010 과 C0001 비교 등은 lexicographic 으로 의도와 충돌).
   10: 
   11: export type MigrationDescriptor = {
   12:   /** 미가공 절대 경로 (repo root 기준 상대) */
   13:   readonly file: string;
   14:   /** 적용 단계 — 동일 패키지 내 마이그레이션은 항상 alphabetic 순서로 시퀀스 됨. cross-package 순서는 본 manifest 가 결정. */
   15:   readonly package: "@glitzy/db" | "@glitzy/core-content" | "@glitzy/auth" | "@glitzy/storage";
   16:   /** 본 마이그레이션이 만드는 핵심 객체 (table·enum·index·function) — depends_on 추적용 */
   17:   readonly creates: ReadonlyArray<string>;
   18:   /** 본 마이그레이션이 의존하는 객체 — apply 전 모두 존재해야 함 */
   19:   readonly dependsOn: ReadonlyArray<string>;
   20: };
   21: 
   22: /**
   23:  * orderedMigrations — LOCATION_LEGAL_PLAN v1.0 § 6 의존성 8단계 + C0003 doctor_profile.
   24:  * runner 는 이 배열 순서대로 sequential apply (fail-fast).
   25:  */
   26: export const orderedMigrations: ReadonlyArray<MigrationDescriptor> = [
   27:   // (1) instance (multi-tenant root)
   28:   {
   29:     file: "packages/db/migrations/D0010_instance.sql",
   30:     package: "@glitzy/db",
   31:     creates: ["instance"],
   32:     dependsOn: [],
   33:   },
   34:   // (2) clinic_profile
   35:   {
   36:     file: "packages/core-content/migrations/C0001_clinic_profile.sql",
   37:     package: "@glitzy/core-content",
   38:     creates: ["clinic_profile"],
   39:     dependsOn: ["instance"],
   40:   },
   41:   // (3) location_profile (base table — clinic_profile_id 미포함 · C0008 에서 ALTER)
   42:   {
   43:     file: "packages/core-content/migrations/C0002_location_profile.sql",
   44:     package: "@glitzy/core-content",
   45:     creates: ["location_profile"],
   46:     dependsOn: ["instance"],
   47:   },
   48:   // (4) doctor_profile — article.author_doctor_id FK 의존성 (plan § 6 미언급 보강)
   49:   {
   50:     file: "packages/core-content/migrations/C0003_doctor_profile.sql",
   51:     package: "@glitzy/core-content",
   52:     creates: ["doctor_profile"],
   53:     dependsOn: ["instance"],
   54:   },
   55:   // (5) treatment_page — content_publication_status enum 생성 (C0006 precondition)
   56:   {
   57:     file: "packages/core-content/migrations/C0004_treatment_page.sql",
   58:     package: "@glitzy/core-content",
   59:     creates: ["treatment_page", "content_publication_status"],
   60:     dependsOn: ["instance"],
   61:   },
   62:   // (6) article — risk_level enum 생성 (C0006 precondition) + doctor_profile FK
   63:   {
   64:     file: "packages/core-content/migrations/C0005_article.sql",
   65:     package: "@glitzy/core-content",
   66:     creates: ["article", "risk_level"],
   67:     dependsOn: ["instance", "doctor_profile", "content_publication_status"],
   68:   },
   69:   // (7) legal_document — content_publication_status + risk_level enum FK
   70:   {
   71:     file: "packages/core-content/migrations/C0006_legal_document.sql",
   72:     package: "@glitzy/core-content",
   73:     creates: ["legal_document", "legal_document_type"],
   74:     dependsOn: ["instance", "content_publication_status", "risk_level"],
   75:   },
   76:   // (8) clinic_profile policy + primary_ctas (ALTER)
   77:   {
   78:     file: "packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql",
   79:     package: "@glitzy/core-content",
   80:     creates: [
   81:       "clinic_profile.policy_contact_person",
   82:       "clinic_profile.policy_contact_email",
   83:       "clinic_profile.policy_contact_phone",
   84:       "clinic_profile.policy_effective_date",
   85:       "clinic_profile.primary_ctas",
   86:       "clinic_profile_primary_ctas_validate",
   87:       "clinic_profile_primary_ctas_trigger",
   88:     ],
   89:     dependsOn: ["clinic_profile"],
   90:   },
   91:   // (9) location_profile parentClinic composite FK (ALTER)
   92:   {
   93:     file: "packages/core-content/migrations/C0008_location_profile_parent_clinic.sql",
   94:     package: "@glitzy/core-content",
   95:     creates: [
   96:       "location_profile.clinic_profile_id",
   97:       "location_profile_clinic_fk",
   98:       "location_profile_clinic_idx",
   99:     ],
  100:     dependsOn: ["clinic_profile", "location_profile"],
  101:   },
  102: ];
  103: 
  104: /**
  105:  * validateManifest — runner 가 sequential apply 직전 호출.
  106:  * 각 entry 의 dependsOn 이 이전 entries 의 creates 안에 모두 존재함을 verify.
  107:  * 실 runner 합류 (LL-DEFER-20) 시점에 적용.
  108:  */
  109: export function validateManifest(): ReadonlyArray<string> {
  110:   const errors: string[] = [];
  111:   const seen = new Set<string>();
  112:   for (const [i, m] of orderedMigrations.entries()) {
  113:     for (const dep of m.dependsOn) {
  114:       if (!seen.has(dep)) {
  115:         errors.push(`[${m.file}] depends on "${dep}" but it is not created by any earlier migration (orderIndex=${i})`);
  116:       }
  117:     }
  118:     for (const c of m.creates) seen.add(c);
  119:   }
  120:   return errors;
  121: }

 succeeded in 774ms:
### apps/web/src/lib/clinic-profile-schema.ts
    1: // @glitzy/web/lib/clinic-profile-schema — LOCATION_LEGAL_PLAN v1.0 § 3.2
    2: //
    3: // ClinicProfile + LocationProfile(main) + 5 LegalDocument override 통합 zod schema SoT.
    4: // form / server action 양쪽 모두 동일 SoT (LL-FORM-09).
    5: //
    6: // 변수 정합성:
    7: //   - businessHours 7요일 + 점심 (LL-FORM-07/10)
    8: //   - primaryCtas 3종 minimal (CT-03 SoT token: phone/kakao-talk/naver-reservation — cycle4 LL-51)
    9: //   - 5종 LegalDocument effectiveDate override (LL-FORM-13 · cycle3 LL-39 flat key + parser helper)
   10: 
   11: import { z } from "zod";
   12: import { CLOSED_DOCUMENT_TYPES, type ClosedLegalDocumentType } from "@glitzy/core-content";
   13: 
   14: // === 공통 helper (apps/web v1.2 패턴 재사용) ===
   15: 
   16: const optionalStr = (max: number) =>
   17:   z
   18:     .string()
   19:     .transform((v) => v.trim())
   20:     .transform((v) => (v === "" ? null : v))
   21:     .nullable()
   22:     .optional()
   23:     .refine((v) => v === null || v === undefined || v.length <= max, {
   24:       message: `최대 ${max}자입니다.`,
   25:     });
   26: 
   27: const requiredTrimmed = (min: number, max: number, label: string) =>
   28:   z
   29:     .string({ required_error: `${label}은(는) 필수입니다.` })
   30:     .transform((v) => v.trim())
   31:     .refine((v) => v.length >= min, { message: `${label}은(는) ${min}자 이상이어야 합니다.` })
   32:     .refine((v) => v.length <= max, { message: `${label}은(는) ${max}자를 넘을 수 없습니다.` });
   33: 
   34: const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
   35: const TIME_REGEX = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
   36: // LL-FORM-12 (cycle1 LL-20): 한국 + 국제 +82 — '.' 구분자 거절
   37: const PHONE_REGEX = /^(\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}$/;
   38: 
   39: const optionalDate = z
   40:   .string()
   41:   .transform((v) => v.trim())
   42:   .transform((v) => (v === "" ? null : v))
   43:   .nullable()
   44:   .optional()
   45:   .refine((v) => v === null || v === undefined || ISO_DATE_REGEX.test(v), {
   46:     message: "날짜는 ISO 형식 (YYYY-MM-DD) 이어야 합니다.",
   47:   })
   48:   .refine(
   49:     (v) => {
   50:       if (v === null || v === undefined) return true;
   51:       const [y, m, d] = v.split("-").map(Number) as [number, number, number];
   52:       const dt = new Date(Date.UTC(y, m - 1, d));
   53:       return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
   54:     },
   55:     { message: "유효한 날짜가 아닙니다." },
   56:   );
   57: 
   58: const requiredDate = z
   59:   .string({ required_error: "날짜는 필수입니다." })
   60:   .transform((v) => v.trim())
   61:   .refine((v) => ISO_DATE_REGEX.test(v), {
   62:     message: "날짜는 ISO 형식 (YYYY-MM-DD) 이어야 합니다.",
   63:   })
   64:   .refine(
   65:     (v) => {
   66:       const [y, m, d] = v.split("-").map(Number) as [number, number, number];
   67:       const dt = new Date(Date.UTC(y, m - 1, d));
   68:       return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
   69:     },
   70:     { message: "유효한 날짜가 아닙니다." },
   71:   );
   72: 
   73: // === BusinessHours (7요일 단순 입력 형식 — form input 단) ===
   74: 
   75: const dayInputSchema = z
   76:   .object({
   77:     closed: z.boolean(),
   78:     open: z.string().optional(),
   79:     close: z.string().optional(),
   80:     lunchEnabled: z.boolean(),
   81:     lunchFrom: z.string().optional(),
   82:     lunchTo: z.string().optional(),
   83:   })
   84:   .superRefine((val, ctx) => {
   85:     if (val.closed) return; // 휴진 — 다른 입력 무시
   86:     if (!val.open || !TIME_REGEX.test(val.open)) {
   87:       ctx.addIssue({ code: z.ZodIssueCode.custom, message: "오픈 시간이 올바르지 않습니다 (HH:mm).", path: ["open"] });
   88:     }
   89:     if (!val.close || !TIME_REGEX.test(val.close)) {
   90:       ctx.addIssue({ code: z.ZodIssueCode.custom, message: "마감 시간이 올바르지 않습니다 (HH:mm).", path: ["close"] });
   91:     }
   92:     if (val.open && val.close && TIME_REGEX.test(val.open) && TIME_REGEX.test(val.close)) {
   93:       if (val.open >= val.close) {
   94:         ctx.addIssue({ code: z.ZodIssueCode.custom, message: "오픈 시간이 마감 시간보다 빨라야 합니다.", path: ["close"] });
   95:       }
   96:     }
   97:     if (val.lunchEnabled) {
   98:       if (!val.lunchFrom || !TIME_REGEX.test(val.lunchFrom)) {
   99:         ctx.addIssue({ code: z.ZodIssueCode.custom, message: "점심 시작 시간이 올바르지 않습니다.", path: ["lunchFrom"] });
  100:       }
  101:       if (!val.lunchTo || !TIME_REGEX.test(val.lunchTo)) {
  102:         ctx.addIssue({ code: z.ZodIssueCode.custom, message: "점심 종료 시간이 올바르지 않습니다.", path: ["lunchTo"] });
  103:       }
  104:       if (
  105:         val.lunchFrom && val.lunchTo &&
  106:         TIME_REGEX.test(val.lunchFrom) && TIME_REGEX.test(val.lunchTo)
  107:       ) {
  108:         if (val.lunchFrom >= val.lunchTo) {
  109:           ctx.addIssue({ code: z.ZodIssueCode.custom, message: "점심 시작이 종료보다 빨라야 합니다.", path: ["lunchTo"] });
  110:         }
  111:         if (val.open && val.close && (val.lunchFrom < val.open || val.lunchTo > val.close)) {
  112:           ctx.addIssue({ code: z.ZodIssueCode.custom, message: "점심 시간이 영업 시간 범위를 벗어났습니다.", path: ["lunchFrom"] });
  113:         }
  114:       }
  115:     }
  116:   });
  117: 
  118: export type DayInput = z.infer<typeof dayInputSchema>;
  119: 
  120: const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
  121: export type DayOfWeek = (typeof DAYS)[number];
  122: 
  123: export const businessHoursSchema = z
  124:   .object({
  125:     monday: dayInputSchema,
  126:     tuesday: dayInputSchema,
  127:     wednesday: dayInputSchema,
  128:     thursday: dayInputSchema,
  129:     friday: dayInputSchema,
  130:     saturday: dayInputSchema,
  131:     sunday: dayInputSchema,
  132:   })
  133:   .superRefine((val, ctx) => {
  134:     // 평일 (mon~fri) 5일 중 1일 이상 영업 필수
  135:     const weekdayOpen = (["monday", "tuesday", "wednesday", "thursday", "friday"] as const).some(
  136:       (d) => !val[d].closed,
  137:     );
  138:     if (!weekdayOpen) {
  139:       ctx.addIssue({
  140:         code: z.ZodIssueCode.custom,
  141:         message: "평일 (월~금) 중 1일 이상은 영업해야 합니다.",
  142:         path: ["monday"],
  143:       });
  144:     }
  145:   });
  146: 
  147: export type BusinessHoursInput = z.infer<typeof businessHoursSchema>;
  148: 
  149: // === PrimaryCTA (CT-03 SoT — UI subset 3종: cycle4 LL-51) ===
  150: 
  151: const primaryCtaTypeEnum = z.enum(["phone", "kakao-talk", "naver-reservation"], {
  152:   errorMap: () => ({ message: "예약 채널 유형이 올바르지 않습니다." }),
  153: });
  154: 
  155: const primaryCtaSchema = z.object({
  156:   id: z.string().min(1).max(64),
  157:   type: primaryCtaTypeEnum,
  158:   label: z.string().min(1).max(100),
  159:   targetUrl: z.string().min(1).max(2048),
  160: });
  161: 
  162: export type PrimaryCtaInput = z.infer<typeof primaryCtaSchema>;
  163: 
  164: export const primaryCtasSchema = z
  165:   .array(primaryCtaSchema)
  166:   .min(1, { message: "최소 1개의 예약 채널이 필요합니다." })
  167:   .max(3, { message: "예약 채널은 최대 3개입니다." });
  168: 
  169: // === Section (a) ClinicProfile 기관 정체성 ===
  170: 
  171: const sectionASchema = z.object({
  172:   name: requiredTrimmed(1, 100, "기관명"),
  173:   description: requiredTrimmed(80, 300, "간략 소개"),
  174:   logoUrl: z
  175:     .string({ required_error: "로고 URL 은 필수입니다." })
  176:     .transform((v) => v.trim())
  177:     .pipe(z.string().url("로고 URL 형식이 올바르지 않습니다.").max(2048)),
  178:   ogImageUrl: z
  179:     .string({ required_error: "OG 이미지 URL 은 필수입니다." })
  180:     .transform((v) => v.trim())
  181:     .pipe(z.string().url("OG 이미지 URL 형식이 올바르지 않습니다.").max(2048)),
  182:   businessRegistrationNumber: z
  183:     .string()
  184:     .transform((v) => (v.trim() === "" ? null : v.trim()))
  185:     .nullable()
  186:     .optional()
  187:     .refine(
  188:       (v) => v === null || v === undefined || /^\d{3}-\d{2}-\d{5}$/.test(v),
  189:       "사업자등록번호 형식이 올바르지 않습니다 (000-00-00000).",
  190:     ),
  191:   alternateName: optionalStr(100),
  192:   legalEntityName: optionalStr(200),
  193:   slogan: optionalStr(200),
  194:   longDescription: optionalStr(2000),
  195:   foundingDate: optionalDate,
  196:   founder: optionalStr(100),
  197: });
  198: 
  199: // === Section (b) LocationProfile main ===
  200: 
  201: const sectionBSchema = z.object({
  202:   streetAddress: requiredTrimmed(1, 200, "도로명 주소"),
  203:   addressLocality: requiredTrimmed(1, 100, "시·군·구"),
  204:   addressRegion: requiredTrimmed(1, 100, "시·도"),
  205:   postalCode: requiredTrimmed(1, 20, "우편번호"),
  206:   addressCountry: z
  207:     .string()
  208:     .default("KR")
  209:     .refine((v) => /^[A-Z]{2}$/.test(v), { message: "국가 코드는 ISO 3166-1 alpha-2 (대문자 2자) 이어야 합니다." }),
  210:   locationTelephone: z
  211:     .string({ required_error: "본원 전화번호는 필수입니다." })
  212:     .transform((v) => v.trim())
  213:     .refine((v) => PHONE_REGEX.test(v), {
  214:       message: "전화번호 형식이 올바르지 않습니다 (예: 02-1234-5678).",
  215:     }),
  216:   locationEmail: z
  217:     .string()
  218:     .transform((v) => v.trim())
  219:     .transform((v) => (v === "" ? null : v))
  220:     .nullable()
  221:     .optional()
  222:     .refine(
  223:       (v) => v === null || v === undefined || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v),
  224:       "이메일 형식이 올바르지 않습니다.",
  225:     ),
  226:   businessHours: businessHoursSchema,
  227:   primaryCtas: primaryCtasSchema,
  228:   featuredChannelId: z.string().min(1).max(64),
  229: });
  230: 
  231: // === Section (c) Policy variables ===
  232: 
  233: const sectionCSchema = z.object({
  234:   policyContactPerson: requiredTrimmed(1, 100, "개인정보 보호책임자"),
  235:   policyContactEmail: z
  236:     .string({ required_error: "개인정보 보호책임자 이메일은 필수입니다." })
  237:     .transform((v) => v.trim())
  238:     .pipe(
  239:       z
  240:         .string()
  241:         .email("이메일 형식이 올바르지 않습니다.")
  242:         .max(200),
  243:     ),
  244:   policyContactPhone: z
  245:     .string({ required_error: "개인정보 보호책임자 전화번호는 필수입니다." })
  246:     .transform((v) => v.trim())
  247:     .refine((v) => PHONE_REGEX.test(v), {
  248:       message: "전화번호 형식이 올바르지 않습니다 (예: 02-1234-5678).",
  249:     }),
  250:   policyEffectiveDate: requiredDate,
  251: });
  252: 
  253: // === Section (d) 5 LegalDocument effectiveDate override (cycle3 LL-39 flat key) ===
  254: 
  255: export const legalDocEffectiveOverrideSchema = z.record(
  256:   z.enum(CLOSED_DOCUMENT_TYPES as unknown as [ClosedLegalDocumentType, ...ClosedLegalDocumentType[]]),
  257:   z
  258:     .string()
  259:     .transform((v) => v.trim())
  260:     .transform((v) => (v === "" ? null : v))
  261:     .nullable()
  262:     .optional()
  263:     .refine((v) => v === null || v === undefined || ISO_DATE_REGEX.test(v), {
  264:       message: "정책 시행일은 ISO 형식 (YYYY-MM-DD) 이어야 합니다.",
  265:     })
  266:     .refine(
  267:       (v) => {
  268:         if (v === null || v === undefined) return true;
  269:         const [y, m, d] = v.split("-").map(Number) as [number, number, number];
  270:         const dt = new Date(Date.UTC(y, m - 1, d));
  271:         return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
  272:       },
  273:       { message: "유효한 날짜가 아닙니다." },
  274:     ),
  275: );
  276: 
  277: // === 통합 Input schema (section a + b + c + d) ===
  278: 
  279: export const clinicProfileBundleInputSchema = sectionASchema
  280:   .merge(sectionBSchema)
  281:   .merge(sectionCSchema)
  282:   .extend({
  283:     legalDocEffectiveOverrides: legalDocEffectiveOverrideSchema,
  284:   })
  285:   .superRefine((val, ctx) => {
  286:     // featuredChannelId 가 primaryCtas[].id 중 하나에 매칭되어야 함
  287:     const ctaIds = new Set(val.primaryCtas.map((c) => c.id));
  288:     if (!ctaIds.has(val.featuredChannelId)) {
  289:       ctx.addIssue({
  290:         code: z.ZodIssueCode.custom,
  291:         message: "강조 채널이 입력된 예약 채널 중 하나여야 합니다.",
  292:         path: ["featuredChannelId"],
  293:       });
  294:     }
  295:   });
  296: 
  297: export type ClinicProfileBundleInput = z.infer<typeof clinicProfileBundleInputSchema>;
  298: 
  299: // === FormData parser helpers (cycle3 LL-39 flat key → nested object) ===
  300: 
  301: /**
  302:  * extractLegalDocEffectiveOverrides — cycle3 LL-39 patch
  303:  * FormData 의 flat key `legalDocEffective_<documentType>` → Record<DocumentType, string|undefined>
  304:  */
  305: export function extractLegalDocEffectiveOverrides(
  306:   formData: FormData,
  307: ): Record<ClosedLegalDocumentType, string | undefined> {
  308:   const result: Partial<Record<ClosedLegalDocumentType, string | undefined>> = {};
  309:   for (const t of CLOSED_DOCUMENT_TYPES) {
  310:     const v = formData.get(`legalDocEffective_${t}`);
  311:     if (typeof v === "string") result[t] = v;
  312:   }
  313:   return result as Record<ClosedLegalDocumentType, string | undefined>;
  314: }
  315: 
  316: /**
  317:  * extractBusinessHours — 7요일 dayInput FormData → BusinessHoursInput
  318:  * FormData key: businessHours_<day>_<field> (예: businessHours_monday_open=09:30)
  319:  */
  320: export function extractBusinessHours(formData: FormData): unknown {
  321:   const result: Record<string, DayInput> = {};
  322:   for (const day of DAYS) {
  323:     result[day] = {
  324:       closed: formData.get(`businessHours_${day}_closed`) === "on",
  325:       open: (formData.get(`businessHours_${day}_open`) as string | null) ?? undefined,
  326:       close: (formData.get(`businessHours_${day}_close`) as string | null) ?? undefined,
  327:       lunchEnabled: formData.get(`businessHours_${day}_lunchEnabled`) === "on",
  328:       lunchFrom: (formData.get(`businessHours_${day}_lunchFrom`) as string | null) ?? undefined,
  329:       lunchTo: (formData.get(`businessHours_${day}_lunchTo`) as string | null) ?? undefined,
  330:     };
  331:   }
  332:   return result;
  333: }
  334: 
  335: /**
  336:  * extractPrimaryCtas — 3종 type 별 입력 FormData → PrimaryCtaInput[]
  337:  * FormData key: cta_<type>_label / cta_<type>_targetUrl (입력 없으면 제외)
  338:  */
  339: export function extractPrimaryCtas(formData: FormData): unknown {
  340:   const TYPES: ReadonlyArray<"phone" | "kakao-talk" | "naver-reservation"> = [
  341:     "phone", "kakao-talk", "naver-reservation",
  342:   ];
  343:   const result: Array<{ id: string; type: string; label: string; targetUrl: string }> = [];
  344:   for (const t of TYPES) {
  345:     const label = formData.get(`cta_${t}_label`);
  346:     const targetUrl = formData.get(`cta_${t}_targetUrl`);
  347:     if (typeof label === "string" && label.trim() !== "" && typeof targetUrl === "string" && targetUrl.trim() !== "") {
  348:       result.push({
  349:         id: `${t}-1`,
  350:         type: t,
  351:         label: label.trim(),
  352:         targetUrl: targetUrl.trim(),
  353:       });
  354:     }
  355:   }
  356:   return result;
  357: }
  358: 
  359: // === BusinessHours → CT-02 SoT 변환 (LL-ACTION-09) ===
  360: 
  361: export type CT02BusinessHours = {
  362:   openingHours: Array<{ dayOfWeek: string[]; opens: string; closes: string }>;
  363:   receptionHours: Array<{ dayOfWeek: string[]; opens: string; closes: string }>;
  364:   lunchBreaks: Array<{ dayOfWeek: string[]; from: string; to: string }>;
  365:   specialClosures: Array<{ date: string; reason?: string }>;
  366: };
  367: 
  368: const DAY_TO_ENUM: Record<DayOfWeek, string> = {
  369:   monday: "Monday",
  370:   tuesday: "Tuesday",
  371:   wednesday: "Wednesday",
  372:   thursday: "Thursday",
  373:   friday: "Friday",
  374:   saturday: "Saturday",
  375:   sunday: "Sunday",
  376: };
  377: 
  378: /**
  379:  * convertToOpeningHoursSpec — LL-ACTION-09 (cycle1 LL-05 + cycle2 LL-30)
  380:  * 7요일 단순 입력 → CT-02 SoT 형식. 동일 (open,close) 행 grouping.
  381:  * receptionHours/specialClosures 는 v0.3 빈 배열 (LL-DEFER-16).
  382:  */
  383: export function convertToOpeningHoursSpec(hours: BusinessHoursInput): CT02BusinessHours {
  384:   // open/close grouping
  385:   const openClose = new Map<string, string[]>();
  386:   const lunchGroup = new Map<string, string[]>();
  387: 
  388:   for (const day of DAYS) {
  389:     const d = hours[day];
  390:     if (d.closed || !d.open || !d.close) continue;
  391:     const key = `${d.open}-${d.close}`;
  392:     const arr = openClose.get(key) ?? [];
  393:     arr.push(DAY_TO_ENUM[day]);
  394:     openClose.set(key, arr);
  395: 
  396:     if (d.lunchEnabled && d.lunchFrom && d.lunchTo) {
  397:       const lkey = `${d.lunchFrom}-${d.lunchTo}`;
  398:       const larr = lunchGroup.get(lkey) ?? [];
  399:       larr.push(DAY_TO_ENUM[day]);
  400:       lunchGroup.set(lkey, larr);
  401:     }
  402:   }
  403: 
  404:   return {
  405:     openingHours: [...openClose.entries()].map(([key, days]) => {
  406:       const [opens, closes] = key.split("-") as [string, string];
  407:       return { dayOfWeek: days, opens, closes };
  408:     }),
  409:     lunchBreaks: [...lunchGroup.entries()].map(([key, days]) => {
  410:       const [from, to] = key.split("-") as [string, string];
  411:       return { dayOfWeek: days, from, to };
  412:     }),
  413:     receptionHours: [],
  414:     specialClosures: [],
  415:   };
  416: }
  417: 
  418: /**
  419:  * 역변환 helper — DB metadata 의 CT-02 형식 → form (b) 의 7요일 입력 형식 (round-trip).
  420:  */
  421: export function convertFromOpeningHoursSpec(spec: CT02BusinessHours | null): BusinessHoursInput {
  422:   const empty: DayInput = { closed: true, lunchEnabled: false };
  423:   const out: Record<string, DayInput> = {};
  424:   for (const d of DAYS) out[d] = { ...empty };
  425:   if (!spec) return out as BusinessHoursInput;
  426: 
  427:   const enumToDay: Record<string, DayOfWeek> = Object.fromEntries(
  428:     (Object.entries(DAY_TO_ENUM) as Array<[DayOfWeek, string]>).map(([k, v]) => [v, k]),
  429:   );
  430: 
  431:   for (const oh of spec.openingHours) {
  432:     for (const dEnum of oh.dayOfWeek) {
  433:       const d = enumToDay[dEnum];
  434:       if (d) out[d] = { ...out[d]!, closed: false, open: oh.opens, close: oh.closes };
  435:     }
  436:   }
  437:   for (const lb of spec.lunchBreaks) {
  438:     for (const dEnum of lb.dayOfWeek) {
  439:       const d = enumToDay[dEnum];
  440:       if (d) out[d] = { ...out[d]!, lunchEnabled: true, lunchFrom: lb.from, lunchTo: lb.to };
  441:     }
  442:   }
  443:   return out as BusinessHoursInput;
  444: }
### apps/web/src/lib/errors.ts
    1: // @glitzy/web/lib/errors — DB constraint violation → field/form error mapping
    2: // cycle1-3entity WEB-08: ClinicProfile + DoctorProfile + TreatmentPage + Article constraint 추가
    3: // LOCATION_LEGAL_PLAN v1.0 (cycle3 LL-44 + cycle4 LL-48): LegalDocument + LocationProfile + clinic_profile policy/primary_ctas + MainLocationMissingError
    4: 
    5: /**
    6:  * LL-ACTION-21 (cycle3 LL-44 patch): assertHasMainLocationAfterTx 안전망 throw class.
    7:  * mapDbErrorToResult 와는 별개 (DB error 가 아닌 application-level invariant).
    8:  */
    9: export class MainLocationMissingError extends Error {
   10:   override readonly name = "MainLocationMissingError";
   11:   constructor(message = "본원 정보 저장에 실패했습니다. 페이지를 새로고침하고 다시 시도하세요.") {
   12:     super(message);
   13:   }
   14: }
   15: 
   16: export type FieldErrors = Record<string, string[]>;
   17: 
   18: type Mapping = { field: string | null; message: string };
   19: 
   20: // constraint_name → field + 한국어 메시지
   21: const CONSTRAINT_MAP: Record<string, Mapping> = {
   22:   // ClinicProfile (C0001)
   23:   clinic_profile_name_length: { field: "name", message: "기관명은 1~100자여야 합니다." },
   24:   clinic_profile_description_length: { field: "description", message: "간략 소개는 80~300자여야 합니다." },
   25:   clinic_profile_slug_regex: { field: "slug", message: "slug 형식이 올바르지 않습니다." },
   26:   clinic_profile_brn_regex: { field: "businessRegistrationNumber", message: "사업자등록번호 형식이 올바르지 않습니다 (000-00-00000)." },
   27:   clinic_profile_instance_slug_unique: { field: "slug", message: "이미 사용 중인 slug 입니다." },
   28: 
   29:   // DoctorProfile (C0003)
   30:   doctor_profile_slug_regex: { field: "slug", message: "slug 형식이 올바르지 않습니다. (3~64자, 소문자/숫자/하이픈)" },
   31:   doctor_profile_name_length: { field: "name", message: "이름은 1~100자여야 합니다." },
   32:   doctor_profile_instance_slug_unique: { field: "slug", message: "이미 사용 중인 slug 입니다." },
   33: 
   34:   // TreatmentPage (C0004)
   35:   treatment_page_slug_regex: { field: "slug", message: "slug 형식이 올바르지 않습니다. (3~100자)" },
   36:   treatment_page_title_length: { field: "title", message: "제목은 1~200자여야 합니다." },
   37:   treatment_page_summary_length: { field: "summary", message: "요약은 50~160자여야 합니다." },
   38:   treatment_page_published_requires_at: { field: null, message: "발행 상태일 때 발행일이 필요합니다." },
   39:   treatment_page_instance_slug_unique: { field: "slug", message: "이미 사용 중인 slug 입니다." },
   40: 
   41:   // Article (C0005)
   42:   article_slug_regex: { field: "slug", message: "slug 형식이 올바르지 않습니다. (3~100자)" },
   43:   article_title_length: { field: "title", message: "제목은 1~200자여야 합니다." },
   44:   article_summary_length: { field: "summary", message: "요약은 80~200자여야 합니다." },
   45:   article_published_requires_at: { field: null, message: "발행 상태일 때 발행일이 필요합니다." },
   46:   article_instance_slug_unique: { field: "slug", message: "이미 사용 중인 slug 입니다." },
   47:   article_author_fk: { field: "authorDoctorId", message: "해당 의료진을 찾을 수 없습니다." },
   48: 
   49:   // ClinicProfile policy + primary_ctas (C0007 · LOCATION_LEGAL_PLAN v1.0)
   50:   clinic_profile_policy_email_regex: { field: "policyContactEmail", message: "개인정보 보호책임자 이메일 형식이 올바르지 않습니다." },
   51:   clinic_profile_policy_phone_format: { field: "policyContactPhone", message: "전화번호 형식이 올바르지 않습니다 (예: 02-1234-5678, 010-1234-5678, +82-2-1234-5678)." },
   52:   clinic_profile_primary_ctas_array: { field: "primaryCtas", message: "예약 채널 입력값이 올바르지 않습니다." },
   53:   clinic_profile_primary_ctas_shape: { field: "primaryCtas", message: "예약 채널 항목의 형식이 올바르지 않습니다 (id · type · label · targetUrl 필수)." },
   54: 
   55:   // LocationProfile parentClinic (C0008 · LL-SCHEMA-14)
   56:   location_profile_clinic_fk: { field: null, message: "본원과 위치 정보가 일치하지 않습니다. 페이지를 새로고침하고 다시 시도하세요." },
   57:   // LLC-10 patch: LocationProfile phone CHECK (C0002)
   58:   location_profile_phone_format: { field: "locationTelephone", message: "본원 전화번호 형식이 올바르지 않습니다 (예: 02-1234-5678, 010-1234-5678, +82-2-1234-5678)." },
   59: 
   60:   // LegalDocument (C0006 · LOCATION_LEGAL_PLAN v1.0)
   61:   legal_document_instance_5type_unique: { field: null, message: "동일 정책 문서가 이미 존재합니다. 잠시 후 다시 시도하세요." },
   62:   legal_document_status_skeleton_limit: { field: null, message: "정책 문서 상태 변경(검수 진입·발행)은 후속 단계입니다. 본 화면에서는 draft 만 저장 가능하며, 검수 진입은 compliance-assistant Feature 합류(M0 v1.0 본 구현 완료 시점) 후 검수 큐 화면에서 가능합니다." },
   63:   legal_document_published_at_null: { field: null, message: "정책 문서 발행은 후속 단계입니다. 발행 게이트(compliance-assistant + ComplianceRecord UI) 합류 후 발행 화면에서 가능합니다." },
   64:   legal_document_risk_level_skeleton_limit: { field: null, message: "정책 문서 위험도는 현재 단계에서 Low 만 허용됩니다. 위험도 수동 분류는 위험도 분류 UI(M0 v1.0) 합류 후 가능합니다." },
   65:   legal_document_title_length: { field: null, message: "정책 문서 제목은 1~100자여야 합니다." },
   66:   legal_document_body_length: { field: null, message: "정책 문서 본문 길이가 허용 범위(1~200000자)를 벗어났습니다." },
   67:   legal_document_email_regex: { field: null, message: "정책 문서의 연락처 이메일 형식이 올바르지 않습니다." },
   68:   legal_document_slug_regex: { field: null, message: "정책 문서 slug 형식이 올바르지 않습니다." },
   69:   legal_document_instance_slug_unique: { field: null, message: "동일 slug 의 정책 문서가 이미 존재합니다." },
   70:   legal_document_template_version_format: { field: null, message: "정책 문서 템플릿 버전 형식이 올바르지 않습니다." },
   71:   legal_document_auto_generated_template_ver: { field: null, message: "자동 생성 정책 문서에는 템플릿 버전이 필요합니다." },
   72: };
   73: 
   74: export type DbErrorResult =
   75:   | { kind: "field"; errors: FieldErrors }
   76:   | { kind: "form"; message: string };
   77: 
   78: /**
   79:  * postgres-js error 의 `code` (SQLSTATE) 와 `constraint_name` 으로 field/form 매핑.
   80:  * 23514 = check_violation, 23505 = unique_violation, 23503 = foreign_key_violation
   81:  */
   82: export function mapDbErrorToResult(err: unknown): DbErrorResult | null {
   83:   if (typeof err !== "object" || err === null) return null;
   84:   const e = err as { code?: string; constraint_name?: string; constraint?: string };
   85:   const code = e.code;
   86:   const constraint = e.constraint_name ?? e.constraint;
   87:   if (!code || !constraint) return null;
   88:   if (code !== "23514" && code !== "23505" && code !== "23503") return null;
   89: 
   90:   const mapping = CONSTRAINT_MAP[constraint];
   91:   if (mapping) {
   92:     if (mapping.field === null) return { kind: "form", message: mapping.message };
   93:     return { kind: "field", errors: { [mapping.field]: [mapping.message] } };
   94:   }
   95: 
   96:   // unknown constraint — generic
   97:   if (code === "23505") return { kind: "form", message: "중복된 값이 있어 저장하지 못했습니다." };
   98:   if (code === "23503") return { kind: "form", message: "참조 무결성 오류 — 연결된 데이터가 없거나 삭제되었습니다." };
   99:   if (code === "23514") return { kind: "form", message: "입력값이 데이터 제약을 만족하지 못합니다." };
  100:   return null;
  101: }
  102: 
  103: /** 기존 호출처 호환 — FieldErrors 만 반환 (form 메시지는 null) */
  104: export function mapDbErrorToFieldErrors(err: unknown): FieldErrors | null {
  105:   const result = mapDbErrorToResult(err);
  106:   if (result === null) return null;
  107:   if (result.kind === "field") return result.errors;
  108:   return null;
  109: }
### apps/web/src/components/forms/ClinicProfileForm.tsx
    1: // @glitzy/web/components/forms/ClinicProfileForm — LOCATION_LEGAL_PLAN v1.0 § 3
    2: // 3 섹션 + 5 LegalDocument override 재구성.
    3: //
    4: // (a) 기관 정체성 (기존 v1.1 URL scrape prefill)
    5: // (b) 본원 위치·연락·시간 (신규 · LL-FORM-03·07·08·12)
    6: // (c) 정책 변수 보조 (신규 · LL-FORM-04)
    7: // (d) 5 LegalDocument override 보조 (신규 · LL-FORM-13)
    8: 
    9: "use client";
   10: 
   11: import { useState } from "react";
   12: import { useFormState, useFormStatus } from "react-dom";
   13: import { Field } from "@/components/forms/Field";
   14: import type { SaveResult } from "@/app/(admin)/[instanceSlug]/clinic-profile/actions";
   15: import type {
   16:   BusinessHoursInput,
   17:   PrimaryCtaInput,
   18: } from "@/lib/clinic-profile-schema";
   19: 
   20: const CLOSED_DOC_TYPES = ["privacy", "terms", "non-covered", "refund", "complaint"] as const;
   21: type ClosedDocType = (typeof CLOSED_DOC_TYPES)[number];
   22: 
   23: const DOC_TYPE_LABEL: Record<ClosedDocType, string> = {
   24:   privacy: "개인정보처리방침",
   25:   terms: "이용약관",
   26:   "non-covered": "비급여 진료비 안내",
   27:   refund: "환불 규정",
   28:   complaint: "민원 처리 안내",
   29: };
   30: 
   31: const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
   32: type DayOfWeek = (typeof DAYS)[number];
   33: 
   34: const DAY_LABEL: Record<DayOfWeek, string> = {
   35:   monday: "월요일",
   36:   tuesday: "화요일",
   37:   wednesday: "수요일",
   38:   thursday: "목요일",
   39:   friday: "금요일",
   40:   saturday: "토요일",
   41:   sunday: "일요일",
   42: };
   43: 
   44: export type ClinicProfileInitial = {
   45:   // (a) 기관 정체성
   46:   name: string;
   47:   description: string;
   48:   logoUrl: string;
   49:   ogImageUrl: string;
   50:   businessRegistrationNumber: string;
   51:   alternateName: string;
   52:   legalEntityName: string;
   53:   slogan: string;
   54:   longDescription: string;
   55:   foundingDate: string;
   56:   founder: string;
   57:   // (b) 본원 위치·연락·시간
   58:   streetAddress: string;
   59:   addressLocality: string;
   60:   addressRegion: string;
   61:   postalCode: string;
   62:   addressCountry: string;
   63:   locationTelephone: string;
   64:   locationEmail: string;
   65:   businessHours: BusinessHoursInput;
   66:   primaryCtas: PrimaryCtaInput[];
   67:   featuredChannelId: string;
   68:   // (c) 정책 변수
   69:   policyContactPerson: string;
   70:   policyContactEmail: string;
   71:   policyContactPhone: string;
   72:   policyEffectiveDate: string;
   73:   // (d) 5 LegalDocument effective date override
   74:   legalDocEffectiveOverrides: Record<ClosedDocType, string>;
   75: };
   76: 
   77: const emptyDay = { closed: true as const, lunchEnabled: false as const };
   78: 
   79: const emptyBusinessHours: BusinessHoursInput = {
   80:   monday: { ...emptyDay },
   81:   tuesday: { ...emptyDay },
   82:   wednesday: { ...emptyDay },
   83:   thursday: { ...emptyDay },
   84:   friday: { ...emptyDay },
   85:   saturday: { ...emptyDay },
   86:   sunday: { ...emptyDay },
   87: };
   88: 
   89: export const emptyInitial: ClinicProfileInitial = {
   90:   name: "",
   91:   description: "",
   92:   logoUrl: "",
   93:   ogImageUrl: "",
   94:   businessRegistrationNumber: "",
   95:   alternateName: "",
   96:   legalEntityName: "",
   97:   slogan: "",
   98:   longDescription: "",
   99:   foundingDate: "",
  100:   founder: "",
  101:   streetAddress: "",
  102:   addressLocality: "",
  103:   addressRegion: "",
  104:   postalCode: "",
  105:   addressCountry: "KR",
  106:   locationTelephone: "",
  107:   locationEmail: "",
  108:   businessHours: emptyBusinessHours,
  109:   primaryCtas: [],
  110:   featuredChannelId: "",
  111:   policyContactPerson: "",
  112:   policyContactEmail: "",
  113:   policyContactPhone: "",
  114:   policyEffectiveDate: "",
  115:   legalDocEffectiveOverrides: {
  116:     privacy: "",
  117:     terms: "",
  118:     "non-covered": "",
  119:     refund: "",
  120:     complaint: "",
  121:   },
  122: };
  123: 
  124: type SiteMeta = {
  125:   name: string | null;
  126:   description: string | null;
  127:   logoUrl: string | null;
  128:   ogImageUrl: string | null;
  129:   themeColor: string | null;
  130:   resolvedUrl: string;
  131: };
  132: 
  133: export function ClinicProfileForm({
  134:   action,
  135:   initial,
  136:   instanceSlug,
  137: }: {
  138:   action: (prev: SaveResult | null, formData: FormData) => Promise<SaveResult>;
  139:   initial: ClinicProfileInitial | null;
  140:   instanceSlug: string;
  141: }) {
  142:   const [state, formAction] = useFormState<SaveResult | null, FormData>(action, null);
  143:   const [values, setValues] = useState<ClinicProfileInitial>(initial ?? emptyInitial);
  144:   const [siteUrl, setSiteUrl] = useState("");
  145:   const [analyzing, setAnalyzing] = useState(false);
  146:   const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  147:   const [appliedFields, setAppliedFields] = useState<string[]>([]);
  148:   const [ctaPhoneEnabled, setCtaPhoneEnabled] = useState(values.primaryCtas.some((c) => c.type === "phone"));
  149:   const [ctaKakaoEnabled, setCtaKakaoEnabled] = useState(values.primaryCtas.some((c) => c.type === "kakao-talk"));
  150:   const [ctaNaverEnabled, setCtaNaverEnabled] = useState(values.primaryCtas.some((c) => c.type === "naver-reservation"));
  151:   const [ctaPhoneLabel, setCtaPhoneLabel] = useState(values.primaryCtas.find((c) => c.type === "phone")?.label ?? "전화 예약");
  152:   const [ctaPhoneUrl, setCtaPhoneUrl] = useState(values.primaryCtas.find((c) => c.type === "phone")?.targetUrl ?? "");
  153:   const [ctaKakaoLabel, setCtaKakaoLabel] = useState(values.primaryCtas.find((c) => c.type === "kakao-talk")?.label ?? "카카오톡 상담");
  154:   const [ctaKakaoUrl, setCtaKakaoUrl] = useState(values.primaryCtas.find((c) => c.type === "kakao-talk")?.targetUrl ?? "");
  155:   const [ctaNaverLabel, setCtaNaverLabel] = useState(values.primaryCtas.find((c) => c.type === "naver-reservation")?.label ?? "네이버 예약");
  156:   const [ctaNaverUrl, setCtaNaverUrl] = useState(values.primaryCtas.find((c) => c.type === "naver-reservation")?.targetUrl ?? "");
  157: 
  158:   const fieldErrors = state && state.ok === false ? state.fieldErrors : {};
  159:   const formError = state && state.ok === false ? state.formError ?? null : null;
  160: 
  161:   const setField = <K extends keyof ClinicProfileInitial>(key: K, v: ClinicProfileInitial[K]) =>
  162:     setValues((prev) => ({ ...prev, [key]: v }));
  163: 
  164:   const setDay = (day: DayOfWeek, patch: Partial<BusinessHoursInput[DayOfWeek]>) =>
  165:     setValues((prev) => ({
  166:       ...prev,
  167:       businessHours: { ...prev.businessHours, [day]: { ...prev.businessHours[day], ...patch } },
  168:     }));
  169: 
  170:   const setLegalDocOverride = (t: ClosedDocType, v: string) =>
  171:     setValues((prev) => ({
  172:       ...prev,
  173:       legalDocEffectiveOverrides: { ...prev.legalDocEffectiveOverrides, [t]: v },
  174:     }));
  175: 
  176:   async function handleAnalyze(): Promise<void> {
  177:     setAnalyzeError(null);
  178:     setAppliedFields([]);
  179:     if (siteUrl.trim() === "") {
  180:       setAnalyzeError("URL 을 입력해주세요.");
  181:       return;
  182:     }
  183:     setAnalyzing(true);
  184:     try {
  185:       const res = await fetch("/api/site-meta-fetch", {
  186:         method: "POST",
  187:         headers: { "content-type": "application/json" },
  188:         body: JSON.stringify({ url: siteUrl.trim(), instanceSlug }),
  189:       });
  190:       const body = (await res.json()) as { ok: boolean; meta?: SiteMeta; error?: string };
  191:       if (!body.ok || !body.meta) {
  192:         setAnalyzeError(body.error ?? "분석에 실패했습니다.");
  193:         return;
  194:       }
  195:       const m = body.meta;
  196:       const applied: string[] = [];
  197:       const safeUrl = (v: string | null): string | null => {
  198:         if (!v) return null;
  199:         if (v.length > 2048) return null;
  200:         try {
  201:           const u = new URL(v);
  202:           if (u.protocol !== "http:" && u.protocol !== "https:") return null;
  203:         } catch {
  204:           return null;
  205:         }
  206:         return v;
  207:       };
  208:       setValues((prev) => {
  209:         const next = { ...prev };
  210:         if (m.name && next.name === "") { next.name = m.name.slice(0, 100); applied.push("기관명"); }
  211:         if (m.description && next.description === "") { next.description = m.description.slice(0, 300); applied.push("간략 소개"); }
  212:         const safeLogo = safeUrl(m.logoUrl);
  213:         if (safeLogo && next.logoUrl === "") { next.logoUrl = safeLogo; applied.push("로고 URL"); }
  214:         const safeOg = safeUrl(m.ogImageUrl);
  215:         if (safeOg && next.ogImageUrl === "") { next.ogImageUrl = safeOg; applied.push("OG 이미지 URL"); }
  216:         return next;
  217:       });
  218:       setAppliedFields(applied);
  219:     } catch (err) {
  220:       console.error("[site-meta-fetch] client fetch error", err);
  221:       setAnalyzeError("네트워크 오류가 발생했습니다.");
  222:     } finally {
  223:       setAnalyzing(false);
  224:     }
  225:   }
  226: 
  227:   // featuredChannelId 의 가능한 option 리스트
  228:   const ctaOptions: Array<{ value: string; label: string }> = [];
  229:   if (ctaPhoneEnabled && ctaPhoneUrl.trim() !== "") ctaOptions.push({ value: "phone-1", label: `전화 (${ctaPhoneLabel})` });
  230:   if (ctaKakaoEnabled && ctaKakaoUrl.trim() !== "") ctaOptions.push({ value: "kakao-talk-1", label: `카카오톡 (${ctaKakaoLabel})` });
  231:   if (ctaNaverEnabled && ctaNaverUrl.trim() !== "") ctaOptions.push({ value: "naver-reservation-1", label: `네이버 예약 (${ctaNaverLabel})` });
  232: 
  233:   return (
  234:     <div className="flex flex-col gap-5">
  235:       <section className="rounded-md border border-blue-200 bg-blue-50 p-4 text-sm">
  236:         <h2 className="mb-2 text-base font-medium text-blue-900">사이트 URL 자동 분석 (onboarding)</h2>
  237:         <p className="mb-3 text-xs text-blue-800">
  238:           기존 의료기관 웹사이트 URL 을 입력하면 og 이미지·favicon·메타 정보를 비어 있는 필드에 채워줍니다.
  239:         </p>
  240:         <div className="flex gap-2">
  241:           <input
  242:             type="url"
  243:             value={siteUrl}
  244:             onChange={(e) => setSiteUrl(e.target.value)}
  245:             placeholder="https://example-clinic.com"
  246:             className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
  247:           />
  248:           <button
  249:             type="button"
  250:             onClick={handleAnalyze}
  251:             disabled={analyzing}
  252:             className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-60"
  253:           >
  254:             {analyzing ? "분석 중…" : "분석"}
  255:           </button>
  256:         </div>
  257:         {analyzeError && <div className="mt-2 text-xs text-rose-700">{analyzeError}</div>}
  258:         {appliedFields.length > 0 && (
  259:           <div className="mt-2 text-xs text-emerald-800">
  260:             적용된 필드: {appliedFields.join(", ")} (이미 입력된 필드는 보존됩니다)
  261:           </div>
  262:         )}
  263:       </section>
  264: 
  265:       <form action={formAction} className="flex flex-col gap-6">
  266:         {state?.ok === true && (
  267:           <div className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
  268:             저장되었습니다. (ClinicProfile + 본원 위치 + 정책 문서 5종)
  269:           </div>
  270:         )}
  271:         {formError && (
  272:           <div className="rounded-md border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-900">{formError}</div>
  273:         )}
  274: 
  275:         {/* (a) 기관 정체성 */}
  276:         <fieldset className="flex flex-col gap-4 rounded-md border border-slate-200 p-4">
  277:           <legend className="px-1 text-sm font-medium text-slate-900">기관 정체성</legend>
  278:           <Field name="name" label="기관명" required value={values.name} onChange={(v) => setField("name", v)} errors={fieldErrors.name} maxLength={100} />
  279:           <Field name="description" label="간략 소개" required value={values.description} onChange={(v) => setField("description", v)} errors={fieldErrors.description} textarea minLength={80} maxLength={300} hint="80~300자" />
  280:           <Field name="logoUrl" label="로고 URL" required type="url" value={values.logoUrl} onChange={(v) => setField("logoUrl", v)} errors={fieldErrors.logoUrl} maxLength={2048} />
  281:           <Field name="ogImageUrl" label="OG 이미지 URL" required type="url" value={values.ogImageUrl} onChange={(v) => setField("ogImageUrl", v)} errors={fieldErrors.ogImageUrl} maxLength={2048} />
  282:           <Field name="businessRegistrationNumber" label="사업자등록번호" value={values.businessRegistrationNumber} onChange={(v) => setField("businessRegistrationNumber", v)} errors={fieldErrors.businessRegistrationNumber} placeholder="000-00-00000" />
  283:           <details className="rounded-md border border-slate-200 bg-white p-3 text-sm">
  284:             <summary className="cursor-pointer">선택 필드</summary>
  285:             <div className="mt-3 flex flex-col gap-4">
  286:               <Field name="alternateName" label="대체명" value={values.alternateName} onChange={(v) => setField("alternateName", v)} errors={fieldErrors.alternateName} maxLength={100} />
  287:               <Field name="legalEntityName" label="법인명" value={values.legalEntityName} onChange={(v) => setField("legalEntityName", v)} errors={fieldErrors.legalEntityName} maxLength={200} />
  288:               <Field name="slogan" label="슬로건" value={values.slogan} onChange={(v) => setField("slogan", v)} errors={fieldErrors.slogan} maxLength={200} />
  289:               <Field name="longDescription" label="상세 설명" value={values.longDescription} onChange={(v) => setField("longDescription", v)} errors={fieldErrors.longDescription} textarea maxLength={2000} />
  290:               <Field name="foundingDate" label="설립일" type="date" value={values.foundingDate} onChange={(v) => setField("foundingDate", v)} errors={fieldErrors.foundingDate} placeholder="2024-01-01" />
  291:               <Field name="founder" label="설립자" value={values.founder} onChange={(v) => setField("founder", v)} errors={fieldErrors.founder} maxLength={100} />
  292:             </div>
  293:           </details>
  294:         </fieldset>
  295: 
  296:         {/* (b) 본원 위치·연락·시간 */}
  297:         <fieldset className="flex flex-col gap-4 rounded-md border border-slate-200 p-4">
  298:           <legend className="px-1 text-sm font-medium text-slate-900">본원 위치 · 연락 · 시간</legend>
  299:           <p className="text-xs text-slate-600">이 정보로 LocationProfile(main) 이 자동 생성되며, 5종 정책 문서의 변수에도 사용됩니다.</p>
  300:           <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
  301:             <Field name="addressRegion" label="시·도" required value={values.addressRegion} onChange={(v) => setField("addressRegion", v)} errors={fieldErrors.addressRegion} maxLength={100} placeholder="서울특별시" />
  302:             <Field name="addressLocality" label="시·군·구" required value={values.addressLocality} onChange={(v) => setField("addressLocality", v)} errors={fieldErrors.addressLocality} maxLength={100} placeholder="강남구" />
  303:           </div>
  304:           <Field name="streetAddress" label="도로명 주소" required value={values.streetAddress} onChange={(v) => setField("streetAddress", v)} errors={fieldErrors.streetAddress} maxLength={200} placeholder="테스트로 1" />
  305:           <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
  306:             <Field name="postalCode" label="우편번호" required value={values.postalCode} onChange={(v) => setField("postalCode", v)} errors={fieldErrors.postalCode} maxLength={20} placeholder="06000" />
  307:             <Field name="addressCountry" label="국가 코드 (ISO 3166-1 alpha-2)" required value={values.addressCountry} onChange={(v) => setField("addressCountry", v.toUpperCase())} errors={fieldErrors.addressCountry} maxLength={2} hint="대문자 2자" />
  308:           </div>
  309:           <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
  310:             <Field name="locationTelephone" label="본원 전화" required value={values.locationTelephone} onChange={(v) => setField("locationTelephone", v)} errors={fieldErrors.locationTelephone} placeholder="02-1234-5678" />
  311:             <Field name="locationEmail" label="본원 이메일" type="email" value={values.locationEmail} onChange={(v) => setField("locationEmail", v)} errors={fieldErrors.locationEmail} placeholder="info@example.com" />
  312:           </div>
  313: 
  314:           <div className="flex flex-col gap-2">
  315:             <label className="text-sm font-medium">진료 시간</label>
  316:             {fieldErrors.businessHours && <span className="text-xs text-rose-700">{fieldErrors.businessHours.join(", ")}</span>}
  317:             <div className="flex flex-col gap-2 rounded-md border border-slate-200 p-3">
  318:               {DAYS.map((day) => {
  319:                 const d = values.businessHours[day];
  320:                 const dayHeaderId = `bh-header-${day}`;
  321:                 const dayInputsId = `bh-inputs-${day}`;
  322:                 const dayErrorId = `bh-error-${day}`;
  323:                 const dayErrorKeys = (Object.keys(fieldErrors) as Array<keyof typeof fieldErrors>).filter((k) => typeof k === "string" && k.startsWith(`businessHours.${day}`));
  324:                 const dayErrorMessages = dayErrorKeys.flatMap((k) => fieldErrors[k] ?? []);
  325:                 return (
  326:                   <div key={day} role="group" aria-labelledby={dayHeaderId} className="flex flex-col gap-1 border-b border-slate-100 pb-2 last:border-0">
  327:                     <div className="flex items-center gap-3">
  328:                       <span id={dayHeaderId} className="w-16 text-sm">{DAY_LABEL[day]}</span>
  329:                       {/* LLC-08 patch: 휴진 toggle 의 aria-controls — 해당 row 의 input group id 지목 */}
  330:                       <label className="flex items-center gap-1 text-xs">
  331:                         <input
  332:                           type="checkbox"
  333:                           name={`businessHours_${day}_closed`}
  334:                           checked={d.closed}
  335:                           onChange={(e) => setDay(day, { closed: e.target.checked })}
  336:                           aria-controls={dayInputsId}
  337:                           aria-expanded={!d.closed}
  338:                         />
  339:                         휴진
  340:                       </label>
  341:                       {!d.closed && (
  342:                         <span id={dayInputsId} className="flex items-center gap-3">
  343:                           <input
  344:                             type="time"
  345:                             name={`businessHours_${day}_open`}
  346:                             value={d.open ?? ""}
  347:                             onChange={(e) => setDay(day, { open: e.target.value })}
  348:                             className="rounded-md border border-slate-300 px-2 py-1 text-xs"
  349:                             aria-label={`${DAY_LABEL[day]} 오픈 시간`}
  350:                             aria-describedby={dayErrorMessages.length > 0 ? dayErrorId : undefined}
  351:                           />
  352:                           <span className="text-xs">~</span>
  353:                           <input
  354:                             type="time"
  355:                             name={`businessHours_${day}_close`}
  356:                             value={d.close ?? ""}
  357:                             onChange={(e) => setDay(day, { close: e.target.value })}
  358:                             className="rounded-md border border-slate-300 px-2 py-1 text-xs"
  359:                             aria-label={`${DAY_LABEL[day]} 마감 시간`}
  360:                             aria-describedby={dayErrorMessages.length > 0 ? dayErrorId : undefined}
  361:                           />
  362:                           <label className="ml-2 flex items-center gap-1 text-xs">
  363:                             <input
  364:                               type="checkbox"
  365:                               name={`businessHours_${day}_lunchEnabled`}
  366:                               checked={d.lunchEnabled}
  367:                               onChange={(e) => setDay(day, { lunchEnabled: e.target.checked })}
  368:                               aria-expanded={d.lunchEnabled}
  369:                             />
  370:                             점심
  371:                           </label>
  372:                           {d.lunchEnabled && (
  373:                             <>
  374:                               <input
  375:                                 type="time"
  376:                                 name={`businessHours_${day}_lunchFrom`}
  377:                                 value={d.lunchFrom ?? ""}
  378:                                 onChange={(e) => setDay(day, { lunchFrom: e.target.value })}
  379:                                 className="rounded-md border border-slate-300 px-2 py-1 text-xs"
  380:                                 aria-label={`${DAY_LABEL[day]} 점심 시작`}
  381:                                 aria-describedby={dayErrorMessages.length > 0 ? dayErrorId : undefined}
  382:                               />
  383:                               <span className="text-xs">~</span>
  384:                               <input
  385:                                 type="time"
  386:                                 name={`businessHours_${day}_lunchTo`}
  387:                                 value={d.lunchTo ?? ""}
  388:                                 onChange={(e) => setDay(day, { lunchTo: e.target.value })}
  389:                                 className="rounded-md border border-slate-300 px-2 py-1 text-xs"
  390:                                 aria-label={`${DAY_LABEL[day]} 점심 종료`}
  391:                                 aria-describedby={dayErrorMessages.length > 0 ? dayErrorId : undefined}
  392:                               />
  393:                             </>
  394:                           )}
  395:                         </span>
  396:                       )}
  397:                     </div>
  398:                     {dayErrorMessages.length > 0 && (
  399:                       <p id={dayErrorId} role="alert" className="text-xs text-rose-700">{dayErrorMessages.join(", ")}</p>
  400:                     )}
  401:                   </div>
  402:                 );
  403:               })}
  404:             </div>
  405:           </div>
  406: 
  407:           <div className="flex flex-col gap-2">
  408:             <label className="text-sm font-medium">예약 채널 (최소 1개)</label>
  409:             {fieldErrors.primaryCtas && <span className="text-xs text-rose-700">{fieldErrors.primaryCtas.join(", ")}</span>}
  410:             <div className="flex flex-col gap-3 rounded-md border border-slate-200 p-3">
  411:               <CtaRow type="phone" label="전화 예약" enabled={ctaPhoneEnabled} setEnabled={setCtaPhoneEnabled} labelVal={ctaPhoneLabel} setLabelVal={setCtaPhoneLabel} urlVal={ctaPhoneUrl} setUrlVal={setCtaPhoneUrl} urlPlaceholder="tel:+82-2-1234-5678" />
  412:               <CtaRow type="kakao-talk" label="카카오톡 상담" enabled={ctaKakaoEnabled} setEnabled={setCtaKakaoEnabled} labelVal={ctaKakaoLabel} setLabelVal={setCtaKakaoLabel} urlVal={ctaKakaoUrl} setUrlVal={setCtaKakaoUrl} urlPlaceholder="https://pf.kakao.com/_..." />
  413:               <CtaRow type="naver-reservation" label="네이버 예약" enabled={ctaNaverEnabled} setEnabled={setCtaNaverEnabled} labelVal={ctaNaverLabel} setLabelVal={setCtaNaverLabel} urlVal={ctaNaverUrl} setUrlVal={setCtaNaverUrl} urlPlaceholder="https://booking.naver.com/booking/..." />
  414:             </div>
  415:           </div>
  416: 
  417:           {ctaOptions.length > 0 && (
  418:             <label className="flex flex-col gap-1 text-sm">
  419:               <span>강조 채널 <span className="ml-1 text-rose-600">*</span></span>
  420:               <select
  421:                 name="featuredChannelId"
  422:                 value={values.featuredChannelId}
  423:                 onChange={(e) => setField("featuredChannelId", e.target.value)}
  424:                 required
  425:                 className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
  426:               >
  427:                 <option value="">— 선택 —</option>
  428:                 {ctaOptions.map((o) => (
  429:                   <option key={o.value} value={o.value}>{o.label}</option>
  430:                 ))}
  431:               </select>
  432:               {fieldErrors.featuredChannelId && <span className="text-xs text-rose-700">{fieldErrors.featuredChannelId.join(", ")}</span>}
  433:             </label>
  434:           )}
  435:         </fieldset>
  436: 
  437:         {/* (c) 정책 변수 */}
  438:         <fieldset className="flex flex-col gap-4 rounded-md border border-slate-200 p-4">
  439:           <legend className="px-1 text-sm font-medium text-slate-900">정책 변수 (개인정보 보호책임자 등)</legend>
  440:           <p className="text-xs text-slate-600">5종 정책 문서(개인정보처리방침·이용약관·비급여·환불·민원)의 변수에 사용됩니다.</p>
  441:           <Field name="policyContactPerson" label="개인정보 보호책임자" required value={values.policyContactPerson} onChange={(v) => setField("policyContactPerson", v)} errors={fieldErrors.policyContactPerson} maxLength={100} />
  442:           <Field name="policyContactEmail" label="보호책임자 이메일" required type="email" value={values.policyContactEmail} onChange={(v) => setField("policyContactEmail", v)} errors={fieldErrors.policyContactEmail} maxLength={200} />
  443:           <Field name="policyContactPhone" label="보호책임자 전화" required value={values.policyContactPhone} onChange={(v) => setField("policyContactPhone", v)} errors={fieldErrors.policyContactPhone} placeholder="02-1234-5678" />
  444:           <Field name="policyEffectiveDate" label="기본 시행일 (5종 정책 공통 default)" required type="date" value={values.policyEffectiveDate} onChange={(v) => setField("policyEffectiveDate", v)} errors={fieldErrors.policyEffectiveDate} />
  445:         </fieldset>
  446: 
  447:         {/* (d) 5 LegalDocument effective date override */}
  448:         <fieldset className="flex flex-col gap-3 rounded-md border border-slate-200 p-4">
  449:           <legend className="px-1 text-sm font-medium text-slate-900">정책 문서 시행일 (선택 · 미입력 시 기본 시행일 사용)</legend>
  450:           <p className="text-xs text-amber-800">
  451:             본원 정보(기관명·법인명·사업자번호·설립자·본원 주소·전화·이메일) 또는 정책 변수(담당자·이메일·전화·시행일)를 수정하면 5종 정책 문서 본문이 자동으로 다시 생성됩니다. 본문 직접 수정은 추후 단계에서 합류합니다.
  452:           </p>
  453:           <div className="flex flex-col gap-2">
  454:             {CLOSED_DOC_TYPES.map((t) => {
  455:               const headerId = `legal-override-${t}`;
  456:               const bodyId = `legal-override-body-${t}`;
  457:               // LLC-08 patch: summary 의 aria-controls 로 본문 group 을 가리키고, 입력 group 에는 aria-labelledby 로 summary 연결
  458:               return (
  459:                 <details key={t} className="rounded-md border border-slate-200 bg-white p-2">
  460:                   <summary id={headerId} aria-controls={bodyId} className="cursor-pointer text-sm">
  461:                     {DOC_TYPE_LABEL[t]} <span className="text-xs text-slate-500">(현재: {values.legalDocEffectiveOverrides[t] || values.policyEffectiveDate || "—"})</span>
  462:                   </summary>
  463:                   <div id={bodyId} role="group" aria-labelledby={headerId} className="mt-2">
  464:                     <Field
  465:                       name={`legalDocEffective_${t}`}
  466:                       label={`${DOC_TYPE_LABEL[t]} 시행일 override`}
  467:                       type="date"
  468:                       value={values.legalDocEffectiveOverrides[t]}
  469:                       onChange={(v) => setLegalDocOverride(t, v)}
  470:                       errors={fieldErrors[`legalDocEffectiveOverrides.${t}`]}
  471:                     />
  472:                   </div>
  473:                 </details>
  474:               );
  475:             })}
  476:           </div>
  477:         </fieldset>
  478: 
  479:         <SubmitButton />
  480:       </form>
  481:     </div>
  482:   );
  483: }
  484: 
  485: function CtaRow({
  486:   type,
  487:   label,
  488:   enabled,
  489:   setEnabled,
  490:   labelVal,
  491:   setLabelVal,
  492:   urlVal,
  493:   setUrlVal,
  494:   urlPlaceholder,
  495: }: {
  496:   type: "phone" | "kakao-talk" | "naver-reservation";
  497:   label: string;
  498:   enabled: boolean;
  499:   setEnabled: (v: boolean) => void;
  500:   labelVal: string;
  501:   setLabelVal: (v: string) => void;
  502:   urlVal: string;
  503:   setUrlVal: (v: string) => void;
  504:   urlPlaceholder: string;
  505: }) {
  506:   return (
  507:     <div className="flex flex-col gap-2 border-b border-slate-100 pb-2 last:border-0">
  508:       <label className="flex items-center gap-2 text-sm">
  509:         <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
  510:         {label}
  511:       </label>
  512:       {enabled && (
  513:         <div className="grid grid-cols-1 gap-2 pl-6 md:grid-cols-2">
  514:           <input
  515:             type="text"
  516:             name={`cta_${type}_label`}
  517:             value={labelVal}
  518:             onChange={(e) => setLabelVal(e.target.value)}
  519:             placeholder="표시 라벨"
  520:             className="rounded-md border border-slate-300 px-2 py-1 text-xs"
  521:           />
  522:           <input
  523:             type="text"
  524:             name={`cta_${type}_targetUrl`}
  525:             value={urlVal}
  526:             onChange={(e) => setUrlVal(e.target.value)}
  527:             placeholder={urlPlaceholder}
  528:             className="rounded-md border border-slate-300 px-2 py-1 text-xs"
  529:           />
  530:         </div>
  531:       )}
  532:     </div>
  533:   );
  534: }
  535: 
  536: function SubmitButton() {
  537:   const { pending } = useFormStatus();
  538:   return (
  539:     <button
  540:       type="submit"
  541:       disabled={pending}
  542:       className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
  543:     >
  544:       {pending ? "저장 중…" : "저장 (ClinicProfile + 본원 위치 + 정책 문서 5종)"}
  545:     </button>
  546:   );
  547: }
### apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/page.tsx
    1: // @glitzy/web/(admin)/[instanceSlug]/clinic-profile — LOCATION_LEGAL_PLAN v1.0 (M0 v0.5)
    2: // 3계약 동시 출력 (ClinicProfile + LocationProfile(main) + LegalDocument × 5)
    3: 
    4: import { notFound, redirect } from "next/navigation";
    5: import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";
    6: 
    7: import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
    8: import { requirePageContext } from "@/lib/page-context";
    9: import { withSkeletonTx } from "@/lib/tenant";
   10: import {
   11:   ClinicProfileForm,
   12:   emptyInitial,
   13:   type ClinicProfileInitial,
   14: } from "@/components/forms/ClinicProfileForm";
   15: import {
   16:   convertFromOpeningHoursSpec,
   17:   type CT02BusinessHours,
   18:   type PrimaryCtaInput,
   19: } from "@/lib/clinic-profile-schema";
   20: 
   21: import { saveClinicProfile } from "./actions";
   22: 
   23: type ClinicRow = {
   24:   name: string;
   25:   description: string;
   26:   logo_url: string;
   27:   og_image_url: string;
   28:   business_registration_number: string | null;
   29:   alternate_name: string | null;
   30:   legal_entity_name: string | null;
   31:   slogan: string | null;
   32:   long_description: string | null;
   33:   founding_date: string | null;
   34:   founder: string | null;
   35:   policy_contact_person: string | null;
   36:   policy_contact_email: string | null;
   37:   policy_contact_phone: string | null;
   38:   policy_effective_date: string | null;
   39:   primary_ctas: unknown;
   40: };
   41: 
   42: type LocationRow = {
   43:   street_address: string;
   44:   address_locality: string;
   45:   address_region: string;
   46:   postal_code: string;
   47:   address_country: string;
   48:   phone: string | null;
   49:   email: string | null;
   50:   metadata: unknown;
   51: };
   52: 
   53: type LegalRow = { document_type: string; effective_date: string };
   54: 
   55: function pickString(v: unknown): string | null {
   56:   return typeof v === "string" ? v : null;
   57: }
   58: 
   59: function parsePrimaryCtas(raw: unknown): PrimaryCtaInput[] {
   60:   if (!Array.isArray(raw)) return [];
   61:   const out: PrimaryCtaInput[] = [];
   62:   for (const elem of raw) {
   63:     if (typeof elem !== "object" || elem === null) continue;
   64:     const e = elem as Record<string, unknown>;
   65:     const id = pickString(e.id);
   66:     const type = pickString(e.type);
   67:     const label = pickString(e.label);
   68:     const targetUrl = pickString(e.targetUrl);
   69:     if (!id || !type || !label || !targetUrl) continue;
   70:     if (type !== "phone" && type !== "kakao-talk" && type !== "naver-reservation") continue;
   71:     out.push({ id, type, label, targetUrl });
   72:   }
   73:   return out;
   74: }
   75: 
   76: function parseBusinessHoursMetadata(raw: unknown): CT02BusinessHours | null {
   77:   if (typeof raw !== "object" || raw === null) return null;
   78:   const r = raw as Record<string, unknown>;
   79:   const bh = r.businessHours;
   80:   if (typeof bh !== "object" || bh === null) return null;
   81:   const b = bh as Record<string, unknown>;
   82:   const openingHours = Array.isArray(b.openingHours) ? b.openingHours : [];
   83:   const receptionHours = Array.isArray(b.receptionHours) ? b.receptionHours : [];
   84:   const lunchBreaks = Array.isArray(b.lunchBreaks) ? b.lunchBreaks : [];
   85:   const specialClosures = Array.isArray(b.specialClosures) ? b.specialClosures : [];
   86:   return {
   87:     openingHours: openingHours.filter((x): x is { dayOfWeek: string[]; opens: string; closes: string } => {
   88:       if (typeof x !== "object" || x === null) return false;
   89:       const o = x as Record<string, unknown>;
   90:       return Array.isArray(o.dayOfWeek) && typeof o.opens === "string" && typeof o.closes === "string";
   91:     }),
   92:     receptionHours: receptionHours.filter((x): x is { dayOfWeek: string[]; opens: string; closes: string } => {
   93:       if (typeof x !== "object" || x === null) return false;
   94:       const o = x as Record<string, unknown>;
   95:       return Array.isArray(o.dayOfWeek) && typeof o.opens === "string" && typeof o.closes === "string";
   96:     }),
   97:     lunchBreaks: lunchBreaks.filter((x): x is { dayOfWeek: string[]; from: string; to: string } => {
   98:       if (typeof x !== "object" || x === null) return false;
   99:       const o = x as Record<string, unknown>;
  100:       return Array.isArray(o.dayOfWeek) && typeof o.from === "string" && typeof o.to === "string";
  101:     }),
  102:     specialClosures: specialClosures.filter((x): x is { date: string; reason?: string } => {
  103:       if (typeof x !== "object" || x === null) return false;
  104:       const o = x as Record<string, unknown>;
  105:       return typeof o.date === "string";
  106:     }),
  107:   };
  108: }
  109: 
  110: function parseFeaturedChannelId(raw: unknown): string {
  111:   if (typeof raw !== "object" || raw === null) return "";
  112:   const r = raw as Record<string, unknown>;
  113:   const fc = r.featuredChannelId;
  114:   return typeof fc === "string" ? fc : "";
  115: }
  116: 
  117: /**
  118:  * LLC-12 patch (cycle 1 code review):
  119:  *   plan § 7 시나리오 15 의 "403" 은 다음 두 가지로 보장한다:
  120:  *     1) 운영자에게 명확한 "접근 거부" UI 렌더 (본 컴포넌트 · role="main" · aria-labelledby)
  121:  *     2) tenant resolver 단의 RLS app.current_instance_id 미설정 시 0 row 응답 → notFound() (404)
  122:  *   Next.js 14 의 server component 는 직접 HTTP status code 를 설정할 수 없어 정확한 403 status 는
  123:  *   Next 15 `unauthorized()/forbidden()` 합류 시점 cascade (LL-DEFER-21).
  124:  *   감사 로그 emit 은 본 단계에서 미수행 — `assertActionEligibility` 가 throw 하기 전에 진입했으므로
  125:  *   eligibility 단계 audit cascade marker 는 REVIEW_WORKFLOW v1.1 cascade (LL-CASCADE-06 후보).
  126:  */
  127: function ForbiddenAccessPage({ message }: { message: string }) {
  128:   return (
  129:     <main role="main" aria-labelledby="forbidden-title" className="flex flex-col gap-4 p-6">
  130:       <h1 id="forbidden-title" className="text-2xl font-semibold">접근 거부</h1>
  131:       <p className="text-sm text-slate-700">{message}</p>
  132:     </main>
  133:   );
  134: }
  135: 
  136: export default async function ClinicProfilePage({
  137:   params,
  138: }: {
  139:   params: { instanceSlug: string };
  140: }) {
  141:   let pageCtx;
  142:   try {
  143:     pageCtx = await requirePageContext(params.instanceSlug);
  144:   } catch (err) {
  145:     if (err instanceof TenantResolveError) {
  146:       const a = mapAuthDenyReasonToUi(err.reason);
  147:       if (a.kind === "forbidden" || a.kind === "info") {
  148:         return <ForbiddenAccessPage message={a.message} />;
  149:       }
  150:     }
  151:     throw err;
  152:   }
  153: 
  154:   let initial: ClinicProfileInitial | null = null;
  155:   try {
  156:     initial = await withSkeletonTx({ signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId }, async (tx, ctx) => {
  157:       assertActionEligibility(ctx, "operator-edit-content");
  158: 
  159:       const clinicRows = await tx<ClinicRow[]>`
  160:         SELECT name, description, logo_url, og_image_url,
  161:                business_registration_number, alternate_name, legal_entity_name,
  162:                slogan, long_description,
  163:                to_char(founding_date, 'YYYY-MM-DD') AS founding_date,
  164:                founder,
  165:                policy_contact_person, policy_contact_email, policy_contact_phone,
  166:                to_char(policy_effective_date, 'YYYY-MM-DD') AS policy_effective_date,
  167:                primary_ctas
  168:           FROM clinic_profile
  169:          WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'clinic'
  170:          LIMIT 1
  171:       `;
  172:       const clinic = clinicRows[0];
  173:       if (!clinic) return null;
  174: 
  175:       const locationRows = await tx<LocationRow[]>`
  176:         SELECT street_address, address_locality, address_region, postal_code, address_country,
  177:                phone, email, metadata
  178:           FROM location_profile
  179:          WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'main'
  180:          LIMIT 1
  181:       `;
  182:       const location = locationRows[0] ?? null;
  183: 
  184:       const legalRows = await tx<LegalRow[]>`
  185:         SELECT document_type::text AS document_type,
  186:                to_char(effective_date, 'YYYY-MM-DD') AS effective_date
  187:           FROM legal_document
  188:          WHERE instance_id = ${ctx.instanceId}::uuid
  189:            AND document_type IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint')
  190:       `;
  191: 
  192:       const overrides: Record<"privacy" | "terms" | "non-covered" | "refund" | "complaint", string> = {
  193:         privacy: "",
  194:         terms: "",
  195:         "non-covered": "",
  196:         refund: "",
  197:         complaint: "",
  198:       };
  199:       const fallback = clinic.policy_effective_date ?? "";
  200:       for (const row of legalRows) {
  201:         const t = row.document_type as keyof typeof overrides;
  202:         if (overrides[t] !== undefined && row.effective_date !== fallback) {
  203:           overrides[t] = row.effective_date;
  204:         }
  205:       }
  206: 
  207:       const businessHoursSpec = location ? parseBusinessHoursMetadata(location.metadata) : null;
  208:       const primaryCtas = parsePrimaryCtas(clinic.primary_ctas);
  209:       const featuredChannelId = location ? parseFeaturedChannelId(location.metadata) : "";
  210: 
  211:       return {
  212:         ...emptyInitial,
  213:         name: clinic.name,
  214:         description: clinic.description,
  215:         logoUrl: clinic.logo_url,
  216:         ogImageUrl: clinic.og_image_url,
  217:         businessRegistrationNumber: clinic.business_registration_number ?? "",
  218:         alternateName: clinic.alternate_name ?? "",
  219:         legalEntityName: clinic.legal_entity_name ?? "",
  220:         slogan: clinic.slogan ?? "",
  221:         longDescription: clinic.long_description ?? "",
  222:         foundingDate: clinic.founding_date ?? "",
  223:         founder: clinic.founder ?? "",
  224:         streetAddress: location?.street_address ?? "",
  225:         addressLocality: location?.address_locality ?? "",
  226:         addressRegion: location?.address_region ?? "",
  227:         postalCode: location?.postal_code ?? "",
  228:         addressCountry: location?.address_country ?? "KR",
  229:         locationTelephone: location?.phone ?? "",
  230:         locationEmail: location?.email ?? "",
  231:         businessHours: convertFromOpeningHoursSpec(businessHoursSpec),
  232:         primaryCtas,
  233:         featuredChannelId,
  234:         policyContactPerson: clinic.policy_contact_person ?? "",
  235:         policyContactEmail: clinic.policy_contact_email ?? "",
  236:         policyContactPhone: clinic.policy_contact_phone ?? "",
  237:         policyEffectiveDate: clinic.policy_effective_date ?? "",
  238:         legalDocEffectiveOverrides: overrides,
  239:       };
  240:     });
  241:   } catch (err) {
  242:     if (err instanceof TenantResolveError) {
  243:       const action = mapAuthDenyReasonToUi(err.reason);
  244:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
  245:       if (action.kind === "not-found") notFound();
  246:       if (action.kind === "forbidden") {
  247:         return <ForbiddenAccessPage message={action.message} />;
  248:       }
  249:     }
  250:     throw err;
  251:   }
  252: 
  253:   const boundSave = saveClinicProfile.bind(null, params.instanceSlug);
  254: 
  255:   return (
  256:     <main className="flex flex-col gap-6">
  257:       <h1 className="text-2xl font-semibold">사이트 기본 정보</h1>
  258:       <p className="text-sm text-slate-500">
  259:         한 화면에서 3계약(ClinicProfile + LocationProfile main + 5종 LegalDocument)을 동시 저장합니다. 5종 정책 문서 본문은 변수 치환으로 자동 생성됩니다.
  260:       </p>
  261:       <ClinicProfileForm action={boundSave} initial={initial} instanceSlug={params.instanceSlug} />
  262:     </main>
  263:   );
  264: }
### apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts
    1: // @glitzy/web/(admin)/[instanceSlug]/clinic-profile/actions — LOCATION_LEGAL_PLAN v1.0 § 4
    2: // 3계약 동시 출력: ClinicProfile + LocationProfile(slug=main) + 5종 LegalDocument
    3: //
    4: // 핵심 결정:
    5: //   LL-ACTION-04 (cycle1 LL-07): 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha (complaint→non-covered→privacy→refund→terms)
    6: //   LL-ACTION-06 (cycle1 LL-16 + cycle3 LL-46): 매 저장 시 5종 LegalDocument body 재렌더링 (수동 편집 차단)
    7: //   LL-ACTION-07 (cycle1 LL-21): effective_date 는 Asia/Seoul 기준 — DB CURRENT_DATE AT TIME ZONE
    8: //   LL-ACTION-08 (cycle1 LL-02 + cycle3 LL-45): LocationProfile = build-time reference. DB metadata 는 marker 만
    9: //   LL-ACTION-09 (cycle1 LL-05 + cycle2 LL-30): businessHours CT-02 SoT 변환
   10: //   LL-ACTION-18 (cycle2 LL-32 + cycle3 LL-43): 7 audit row sequential + per-row try/catch + partial/failed fallback + 3단계 안전망
   11: //   LL-ACTION-21 (cycle3 LL-44): assertHasMainLocationAfterTx + MainLocationMissingError
   12: 
   13: "use server";
   14: 
   15: import { revalidatePath } from "next/cache";
   16: import { notFound, redirect } from "next/navigation";
   17: import {
   18:   AuthDeniedError,
   19:   assertActionEligibility,
   20:   emitAuditEvent,
   21:   getActiveSession,
   22:   TenantResolveError,
   23: } from "@glitzy/auth";
   24: import { asUuidV4, type AdminUserId } from "@glitzy/shared-types";
   25: import {
   26:   CLOSED_DOCUMENT_TYPES_ALPHA,
   27:   TEMPLATES,
   28:   renderTemplate,
   29:   TemplateRenderError,
   30:   type RenderContext,
   31: } from "@glitzy/core-content";
   32: 
   33: import { getSqlBase } from "@/lib/db";
   34: import { getAuthCfg } from "@/lib/env";
   35: import { readSessionCookie } from "@/lib/session-cookie";
   36: import { slugResolver } from "@/lib/slug-resolver";
   37: import { withSkeletonTx } from "@/lib/tenant";
   38: import {
   39:   mapDbErrorToResult,
   40:   MainLocationMissingError,
   41:   type FieldErrors,
   42: } from "@/lib/errors";
   43: import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
   44: import { isNextControlFlowError } from "@/lib/action-context";
   45: import {
   46:   clinicProfileBundleInputSchema,
   47:   convertToOpeningHoursSpec,
   48:   extractBusinessHours,
   49:   extractLegalDocEffectiveOverrides,
   50:   extractPrimaryCtas,
   51: } from "@/lib/clinic-profile-schema";
   52: 
   53: export type SaveResult =
   54:   | { ok: true }
   55:   | { ok: false; fieldErrors: FieldErrors; formError?: string };
   56: 
   57: type ContractMode = "insert" | "update";
   58: 
   59: type AuditEntry = {
   60:   contentType: "ClinicProfile" | "LocationProfile" | "LegalDocument";
   61:   slug: string;
   62:   mode: ContractMode;
   63:   status: string | null;
   64:   originalSlug: string;
   65:   documentType?: string;
   66:   templateVersion?: string;
   67:   updatedAtBefore?: Date | null;
   68:   updatedAtAfter?: Date | null;
   69: };
   70: 
   71: export async function saveClinicProfile(
   72:   instanceSlug: string,
   73:   _prev: SaveResult | null,
   74:   formData: FormData,
   75: ): Promise<SaveResult> {
   76:   // 1. parse + zod 검증
   77:   const rawSimple = Object.fromEntries(formData);
   78:   const parsed = clinicProfileBundleInputSchema.safeParse({
   79:     ...rawSimple,
   80:     businessHours: extractBusinessHours(formData),
   81:     primaryCtas: extractPrimaryCtas(formData),
   82:     legalDocEffectiveOverrides: extractLegalDocEffectiveOverrides(formData),
   83:   });
   84:   if (!parsed.success) {
   85:     const fieldErrors: FieldErrors = {};
   86:     for (const issue of parsed.error.issues) {
   87:       const field = issue.path.join(".") || "_";
   88:       fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
   89:     }
   90:     return { ok: false, fieldErrors };
   91:   }
   92:   const data = parsed.data;
   93: 
   94:   // 2. session + tenant resolve
   95:   const signedToken = readSessionCookie();
   96:   if (!signedToken) redirect("/sign-in");
   97: 
   98:   const sqlBase = getSqlBase();
   99:   const cfg = getAuthCfg();
  100: 
  101:   let session;
  102:   try {
  103:     session = await getActiveSession(sqlBase, cfg, signedToken);
  104:   } catch (err) {
  105:     const reason = err instanceof AuthDeniedError ? err.reason : "session-not-found";
  106:     redirect(`/sign-in/cleanup?reason=${reason}`);
  107:   }
  108: 
  109:   let userId: AdminUserId;
  110:   try {
  111:     userId = asUuidV4(session.userId) as AdminUserId;
  112:   } catch {
  113:     redirect("/sign-in/cleanup?reason=session-not-found");
  114:   }
  115:   const instanceId = await slugResolver(sqlBase, instanceSlug, userId);
  116:   if (instanceId === null) notFound();
  117: 
  118:   try {
  119:     // 3. tx 안 3계약 + 5 LegalDocument upsert
  120:     const txResult = await withSkeletonTx(
  121:       { signedToken, instanceId },
  122:       async (tx, ctx) => {
  123:         assertActionEligibility(ctx, "operator-edit-content");
  124: 
  125:         const auditEntries: AuditEntry[] = [];
  126: 
  127:         // === (a) ClinicProfile UPSERT ===
  128:         const clinicBefore = await tx<{ updated_at: Date }[]>`
  129:           SELECT updated_at FROM clinic_profile
  130:            WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'clinic'
  131:            FOR UPDATE
  132:         `;
  133:         const beforeClinic = clinicBefore[0] ?? null;
  134: 
  135:         const clinicAfter = await tx<{ id: string; updated_at: Date; inserted: boolean }[]>`
  136:           INSERT INTO clinic_profile (
  137:             instance_id, slug, name, description, logo_url, og_image_url,
  138:             business_registration_number, alternate_name, legal_entity_name,
  139:             slogan, long_description, founding_date, founder,
  140:             policy_contact_person, policy_contact_email, policy_contact_phone, policy_effective_date,
  141:             primary_ctas
  142:           ) VALUES (
  143:             ${ctx.instanceId}::uuid, 'clinic',
  144:             ${data.name},
  145:             ${data.description},
  146:             ${data.logoUrl},
  147:             ${data.ogImageUrl},
  148:             ${data.businessRegistrationNumber ?? null},
  149:             ${data.alternateName ?? null},
  150:             ${data.legalEntityName ?? null},
  151:             ${data.slogan ?? null},
  152:             ${data.longDescription ?? null},
  153:             ${data.foundingDate ?? null},
  154:             ${data.founder ?? null},
  155:             ${data.policyContactPerson},
  156:             ${data.policyContactEmail},
  157:             ${data.policyContactPhone},
  158:             ${data.policyEffectiveDate},
  159:             ${JSON.stringify(data.primaryCtas)}::jsonb
  160:           )
  161:           ON CONFLICT (instance_id, slug) DO UPDATE
  162:              SET name = EXCLUDED.name,
  163:                  description = EXCLUDED.description,
  164:                  logo_url = EXCLUDED.logo_url,
  165:                  og_image_url = EXCLUDED.og_image_url,
  166:                  business_registration_number = EXCLUDED.business_registration_number,
  167:                  alternate_name = EXCLUDED.alternate_name,
  168:                  legal_entity_name = EXCLUDED.legal_entity_name,
  169:                  slogan = EXCLUDED.slogan,
  170:                  long_description = EXCLUDED.long_description,
  171:                  founding_date = EXCLUDED.founding_date,
  172:                  founder = EXCLUDED.founder,
  173:                  policy_contact_person = EXCLUDED.policy_contact_person,
  174:                  policy_contact_email = EXCLUDED.policy_contact_email,
  175:                  policy_contact_phone = EXCLUDED.policy_contact_phone,
  176:                  policy_effective_date = EXCLUDED.policy_effective_date,
  177:                  primary_ctas = EXCLUDED.primary_ctas,
  178:                  updated_at = now()
  179:           RETURNING id, updated_at, (xmax = 0) AS inserted
  180:         `;
  181:         const clinic = clinicAfter[0]!;
  182: 
  183:         auditEntries.push({
  184:           contentType: "ClinicProfile",
  185:           slug: "clinic",
  186:           mode: clinic.inserted ? "insert" : "update",
  187:           status: null,
  188:           originalSlug: "clinic",
  189:           updatedAtBefore: beforeClinic?.updated_at ?? null,
  190:           updatedAtAfter: clinic.updated_at,
  191:         });
  192: 
  193:         // === (b) LocationProfile(main) UPSERT ===
  194:         const businessHoursSpec = convertToOpeningHoursSpec(data.businessHours);
  195:         const locationMetadata = {
  196:           businessHours: businessHoursSpec,
  197:           reservationChannelsInheritedFrom: "clinic_profile.primary_ctas",
  198:           representativeDoctors: [],
  199:           featuredChannelId: data.featuredChannelId,
  200:         };
  201: 
  202:         const locationBefore = await tx<{ updated_at: Date }[]>`
  203:           SELECT updated_at FROM location_profile
  204:            WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'main'
  205:            FOR UPDATE
  206:         `;
  207:         const beforeLocation = locationBefore[0] ?? null;
  208: 
  209:         const locationAfter = await tx<{ id: string; updated_at: Date; inserted: boolean }[]>`
  210:           INSERT INTO location_profile (
  211:             instance_id, slug, name, clinic_profile_id,
  212:             street_address, address_locality, address_region, postal_code, address_country,
  213:             phone, email, metadata
  214:           ) VALUES (
  215:             ${ctx.instanceId}::uuid, 'main',
  216:             ${data.name},
  217:             ${clinic.id}::uuid,
  218:             ${data.streetAddress},
  219:             ${data.addressLocality},
  220:             ${data.addressRegion},
  221:             ${data.postalCode},
  222:             ${data.addressCountry},
  223:             ${data.locationTelephone},
  224:             ${data.locationEmail ?? null},
  225:             ${JSON.stringify(locationMetadata)}::jsonb
  226:           )
  227:           ON CONFLICT (instance_id, slug) DO UPDATE
  228:              SET name = EXCLUDED.name,
  229:                  clinic_profile_id = EXCLUDED.clinic_profile_id,
  230:                  street_address = EXCLUDED.street_address,
  231:                  address_locality = EXCLUDED.address_locality,
  232:                  address_region = EXCLUDED.address_region,
  233:                  postal_code = EXCLUDED.postal_code,
  234:                  address_country = EXCLUDED.address_country,
  235:                  phone = EXCLUDED.phone,
  236:                  email = EXCLUDED.email,
  237:                  metadata = EXCLUDED.metadata,
  238:                  updated_at = now()
  239:           RETURNING id, updated_at, (xmax = 0) AS inserted
  240:         `;
  241:         const location = locationAfter[0]!;
  242: 
  243:         auditEntries.push({
  244:           contentType: "LocationProfile",
  245:           slug: "main",
  246:           mode: location.inserted ? "insert" : "update",
  247:           status: null,
  248:           originalSlug: "main",
  249:           updatedAtBefore: beforeLocation?.updated_at ?? null,
  250:           updatedAtAfter: location.updated_at,
  251:         });
  252: 
  253:         // === (c) 5종 LegalDocument UPSERT (변수 치환 + alpha sort 잠금 순서) ===
  254:         // LLC-05 patch: doc 별 effectiveDate override 를 renderCtx 안 policy.effectiveDate 에도 반영
  255:         // → DB effective_date 와 body 안 `{{policy.effectiveDate}}` 가 일치
  256:         const baseRenderCtx = {
  257:           clinic: {
  258:             name: data.name,
  259:             legalEntityName: data.legalEntityName ?? null,
  260:             businessRegistrationNumber: data.businessRegistrationNumber ?? null,
  261:             founder: data.founder ?? null,
  262:           },
  263:           location: {
  264:             main: {
  265:               address: `${data.addressRegion} ${data.addressLocality} ${data.streetAddress} (${data.postalCode})`,
  266:               telephone: data.locationTelephone,
  267:               email: data.locationEmail ?? null,
  268:             },
  269:           },
  270:           policy: {
  271:             contactPerson: data.policyContactPerson,
  272:             contactEmail: data.policyContactEmail,
  273:             contactPhone: data.policyContactPhone,
  274:           },
  275:         } as const;
  276: 
  277:         for (const docType of CLOSED_DOCUMENT_TYPES_ALPHA) {
  278:           const template = TEMPLATES[docType];
  279:           const overrideValue = data.legalDocEffectiveOverrides[docType];
  280:           const effectiveDate = overrideValue && overrideValue !== ""
  281:             ? overrideValue
  282:             : data.policyEffectiveDate;
  283:           const docRenderCtx: RenderContext = {
  284:             ...baseRenderCtx,
  285:             policy: { ...baseRenderCtx.policy, effectiveDate },
  286:           };
  287:           const renderedBody = renderTemplate(template.body, docRenderCtx);
  288: 
  289:           // LLC-06 patch: closed 5종 partial UNIQUE 는 (instance_id, document_type) WHERE document_type IN (5종).
  290:           // 같은 document_type 이 다른 slug 로 이미 존재할 수 있으므로 conflict target 을 document_type 으로 사용.
  291:           const legalAfter = await tx<{ id: string; inserted: boolean }[]>`
  292:             INSERT INTO legal_document (
  293:               instance_id, slug, document_type, title, body,
  294:               auto_generated, template_version, effective_date,
  295:               contact_person, contact_email, status, risk_level
  296:             ) VALUES (
  297:               ${ctx.instanceId}::uuid,
  298:               ${template.slug},
  299:               ${docType}::legal_document_type,
  300:               ${template.title},
  301:               ${renderedBody},
  302:               true,
  303:               ${template.version},
  304:               ${effectiveDate},
  305:               ${data.policyContactPerson},
  306:               ${data.policyContactEmail},
  307:               'draft'::content_publication_status,
  308:               'Low'::risk_level
  309:             )
  310:             ON CONFLICT (instance_id, document_type)
  311:               WHERE document_type IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint')
  312:               DO UPDATE
  313:                SET slug = EXCLUDED.slug,
  314:                    title = EXCLUDED.title,
  315:                    body = EXCLUDED.body,
  316:                    auto_generated = EXCLUDED.auto_generated,
  317:                    template_version = EXCLUDED.template_version,
  318:                    effective_date = EXCLUDED.effective_date,
  319:                    contact_person = EXCLUDED.contact_person,
  320:                    contact_email = EXCLUDED.contact_email,
  321:                    updated_at = now()
  322:             RETURNING id, (xmax = 0) AS inserted
  323:           `;
  324:           const legal = legalAfter[0]!;
  325: 
  326:           auditEntries.push({
  327:             contentType: "LegalDocument",
  328:             slug: template.slug,
  329:             mode: legal.inserted ? "insert" : "update",
  330:             status: "draft",
  331:             originalSlug: template.slug,
  332:             documentType: docType,
  333:             templateVersion: template.version,
  334:           });
  335:         }
  336: 
  337:         // === (d) assertHasMainLocationAfterTx 안전망 (cycle3 LL-44) ===
  338:         const mainCheck = await tx<{ exists: boolean }[]>`
  339:           SELECT EXISTS (
  340:             SELECT 1 FROM location_profile
  341:              WHERE instance_id = ${ctx.instanceId}::uuid
  342:                AND clinic_profile_id = ${clinic.id}::uuid
  343:                AND slug = 'main'
  344:           ) AS exists
  345:         `;
  346:         if (!mainCheck[0]?.exists) {
  347:           throw new MainLocationMissingError();
  348:         }
  349: 
  350:         return { ctx, auditEntries };
  351:       },
  352:     );
  353: 
  354:     // 4. audit 7 row sequential emit + 3단계 안전망 (LL-ACTION-18 + cycle3 LL-43)
  355:     const emitted: string[] = [];
  356:     const failed: string[] = [];
  357:     // LLC-09 patch: per-row 실패 원인 보존 — fallback payload 에 reason/code/name 정규화 포함
  358:     const failedDetails: Array<{ target: string; code: string | null; name: string | null; message: string }> = [];
  359:     for (const entry of txResult.auditEntries) {
  360:       try {
  361:         await emitAuditEvent(sqlBase, {
  362:           eventType: "content-saved",
  363:           actorUserId: txResult.ctx.userId,
  364:           targetUserId: txResult.ctx.userId,
  365:           toInstanceId: txResult.ctx.instanceId,
  366:           payload: {
  367:             contentType: entry.contentType,
  368:             slug: entry.slug,
  369:             mode: entry.mode,
  370:             status: entry.status,
  371:             originalSlug: entry.originalSlug,
  372:             ...(entry.documentType !== undefined ? { documentType: entry.documentType } : {}),
  373:             ...(entry.templateVersion !== undefined ? { templateVersion: entry.templateVersion } : {}),
  374:             ...(entry.updatedAtBefore !== undefined ? { updatedAtBefore: entry.updatedAtBefore } : {}),
  375:             ...(entry.updatedAtAfter !== undefined ? { updatedAtAfter: entry.updatedAtAfter } : {}),
  376:           },
  377:         });
  378:         emitted.push(`${entry.contentType}:${entry.slug}`);
  379:       } catch (auditErr) {
  380:         const target = `${entry.contentType}:${entry.slug}`;
  381:         failed.push(target);
  382:         const eObj = typeof auditErr === "object" && auditErr !== null ? (auditErr as { code?: unknown; name?: unknown; message?: unknown }) : null;
  383:         failedDetails.push({
  384:           target,
  385:           code: typeof eObj?.code === "string" ? eObj.code : null,
  386:           name: typeof eObj?.name === "string" ? eObj.name : (auditErr instanceof Error ? auditErr.name : null),
  387:           message: auditErr instanceof Error ? auditErr.message : String(auditErr),
  388:         });
  389:         console.error("[saveClinicProfile] audit row emit failed", {
  390:           contentType: entry.contentType,
  391:           slug: entry.slug,
  392:           error: auditErr,
  393:         });
  394:       }
  395:     }
  396: 
  397:     if (failed.length > 0) {
  398:       const eventType = emitted.length > 0 ? "content-saved-partial" : "content-saved-failed";
  399:       // LL-ACTION-18 reason payload: 첫 실패의 code 를 reason 으로 그대로 노출 (운영 포렌식)
  400:       const primaryReason = failedDetails[0]?.code ?? failedDetails[0]?.name ?? "unknown";
  401:       try {
  402:         await emitAuditEvent(sqlBase, {
  403:           eventType,
  404:           actorUserId: txResult.ctx.userId,
  405:           targetUserId: txResult.ctx.userId,
  406:           toInstanceId: txResult.ctx.instanceId,
  407:           payload: {
  408:             outcome: emitted.length > 0 ? "partial" : "failed",
  409:             emitted,
  410:             failed,
  411:             reason: primaryReason,
  412:             failedDetails,
  413:           },
  414:         });
  415:       } catch (fallbackErr) {
  416:         // 3단계 안전망 의 최종: server stdout (v0.5 — Sentry SDK 미통합 · LL-DEFER-18 까지)
  417:         console.error("[saveClinicProfile] fallback audit emit failed", {
  418:           eventType,
  419:           emitted,
  420:           failed,
  421:           error: fallbackErr,
  422:         });
  423:       }
  424:     }
  425: 
  426:     revalidatePath(`/${instanceSlug}/clinic-profile`);
  427:     revalidatePath(`/${instanceSlug}`);
  428:     return { ok: true };
  429:   } catch (err) {
  430:     if (isNextControlFlowError(err)) throw err;
  431: 
  432:     // MainLocationMissingError (LL-ACTION-21)
  433:     if (err instanceof MainLocationMissingError) {
  434:       return { ok: false, fieldErrors: {}, formError: err.message };
  435:     }
  436: 
  437:     // TemplateRenderError (LL-ACTION-12 — 변수 화이트리스트 외 키)
  438:     if (err instanceof TemplateRenderError) {
  439:       return {
  440:         ok: false,
  441:         fieldErrors: {},
  442:         formError: `정책 문서 본문 생성 중 오류가 발생했습니다 (${err.reason}: ${err.variableKey}).`,
  443:       };
  444:     }
  445: 
  446:     // DB constraint violation
  447:     const mapped = mapDbErrorToResult(err);
  448:     if (mapped !== null) {
  449:       if (mapped.kind === "field") return { ok: false, fieldErrors: mapped.errors };
  450:       return { ok: false, fieldErrors: {}, formError: mapped.message };
  451:     }
  452: 
  453:     if (err instanceof TenantResolveError) {
  454:       const action = mapAuthDenyReasonToUi(err.reason);
  455:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
  456:       if (action.kind === "not-found") notFound();
  457:       if (action.kind === "forbidden") return { ok: false, fieldErrors: {}, formError: action.message };
  458:       if (action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
  459:     }
  460: 
  461:     console.error("[saveClinicProfile] unexpected error", err);
  462:     return { ok: false, fieldErrors: {}, formError: "저장 중 알 수 없는 오류가 발생했습니다." };
  463:   }
  464: }

codex
큰 파일 출력이 중간에서 잘렸습니다. 이제 finding 후보가 생길 수 있는 지점만 좁혀서 라인 단위로 확인하겠습니다: server action의 upsert/audit, form ARIA, forbidden page, 오류 매핑, template 타입입니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$f='"'apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts'; "'$i=1; Get-Content -LiteralPath $f | ForEach-Object { if($i -le 40 -or ($i -ge 250 -and $i -le 425) -or ($i -ge 445 -and $i -le 465)){ '"'{0,5}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$f='"'apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/page.tsx'; "'$i=1; Get-Content -LiteralPath $f | ForEach-Object { '"'{0,5}: {1}' -f "'$i, $_; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$f='"'apps/web/src/components/forms/ClinicProfileForm.tsx'; "'$i=1; Get-Content $f | ForEach-Object { if(($i -le 80) -or ($i -ge 170 -and $i -le 360) -or ($i -ge 430 -and $i -le 540)){ '"'{0,5}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$files=@('"'apps/web/src/lib/errors.ts','packages/core-content/src/templates/index.ts','packages/core-content/src/templates/render.ts'); foreach("'$f in $files){ Write-Output "### $f"; $i=1; Get-Content $f | ForEach-Object { '"'{0,5}: {1}' -f "'$i++, $_ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 657ms:
    1: // @glitzy/web/(admin)/[instanceSlug]/clinic-profile/actions — LOCATION_LEGAL_PLAN v1.0 § 4
    2: // 3계약 동시 출력: ClinicProfile + LocationProfile(slug=main) + 5종 LegalDocument
    3: //
    4: // 핵심 결정:
    5: //   LL-ACTION-04 (cycle1 LL-07): 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha (complaint→non-covered→privacy→refund→terms)
    6: //   LL-ACTION-06 (cycle1 LL-16 + cycle3 LL-46): 매 저장 시 5종 LegalDocument body 재렌더링 (수동 편집 차단)
    7: //   LL-ACTION-07 (cycle1 LL-21): effective_date 는 Asia/Seoul 기준 — DB CURRENT_DATE AT TIME ZONE
    8: //   LL-ACTION-08 (cycle1 LL-02 + cycle3 LL-45): LocationProfile = build-time reference. DB metadata 는 marker 만
    9: //   LL-ACTION-09 (cycle1 LL-05 + cycle2 LL-30): businessHours CT-02 SoT 변환
   10: //   LL-ACTION-18 (cycle2 LL-32 + cycle3 LL-43): 7 audit row sequential + per-row try/catch + partial/failed fallback + 3단계 안전망
   11: //   LL-ACTION-21 (cycle3 LL-44): assertHasMainLocationAfterTx + MainLocationMissingError
   12: 
   13: "use server";
   14: 
   15: import { revalidatePath } from "next/cache";
   16: import { notFound, redirect } from "next/navigation";
   17: import {
   18:   AuthDeniedError,
   19:   assertActionEligibility,
   20:   emitAuditEvent,
   21:   getActiveSession,
   22:   TenantResolveError,
   23: } from "@glitzy/auth";
   24: import { asUuidV4, type AdminUserId } from "@glitzy/shared-types";
   25: import {
   26:   CLOSED_DOCUMENT_TYPES_ALPHA,
   27:   TEMPLATES,
   28:   renderTemplate,
   29:   TemplateRenderError,
   30:   type RenderContext,
   31: } from "@glitzy/core-content";
   32: 
   33: import { getSqlBase } from "@/lib/db";
   34: import { getAuthCfg } from "@/lib/env";
   35: import { readSessionCookie } from "@/lib/session-cookie";
   36: import { slugResolver } from "@/lib/slug-resolver";
   37: import { withSkeletonTx } from "@/lib/tenant";
   38: import {
   39:   mapDbErrorToResult,
   40:   MainLocationMissingError,
  250:           updatedAtAfter: location.updated_at,
  251:         });
  252: 
  253:         // === (c) 5종 LegalDocument UPSERT (변수 치환 + alpha sort 잠금 순서) ===
  254:         // LLC-05 patch: doc 별 effectiveDate override 를 renderCtx 안 policy.effectiveDate 에도 반영
  255:         // → DB effective_date 와 body 안 `{{policy.effectiveDate}}` 가 일치
  256:         const baseRenderCtx = {
  257:           clinic: {
  258:             name: data.name,
  259:             legalEntityName: data.legalEntityName ?? null,
  260:             businessRegistrationNumber: data.businessRegistrationNumber ?? null,
  261:             founder: data.founder ?? null,
  262:           },
  263:           location: {
  264:             main: {
  265:               address: `${data.addressRegion} ${data.addressLocality} ${data.streetAddress} (${data.postalCode})`,
  266:               telephone: data.locationTelephone,
  267:               email: data.locationEmail ?? null,
  268:             },
  269:           },
  270:           policy: {
  271:             contactPerson: data.policyContactPerson,
  272:             contactEmail: data.policyContactEmail,
  273:             contactPhone: data.policyContactPhone,
  274:           },
  275:         } as const;
  276: 
  277:         for (const docType of CLOSED_DOCUMENT_TYPES_ALPHA) {
  278:           const template = TEMPLATES[docType];
  279:           const overrideValue = data.legalDocEffectiveOverrides[docType];
  280:           const effectiveDate = overrideValue && overrideValue !== ""
  281:             ? overrideValue
  282:             : data.policyEffectiveDate;
  283:           const docRenderCtx: RenderContext = {
  284:             ...baseRenderCtx,
  285:             policy: { ...baseRenderCtx.policy, effectiveDate },
  286:           };
  287:           const renderedBody = renderTemplate(template.body, docRenderCtx);
  288: 
  289:           // LLC-06 patch: closed 5종 partial UNIQUE 는 (instance_id, document_type) WHERE document_type IN (5종).
  290:           // 같은 document_type 이 다른 slug 로 이미 존재할 수 있으므로 conflict target 을 document_type 으로 사용.
  291:           const legalAfter = await tx<{ id: string; inserted: boolean }[]>`
  292:             INSERT INTO legal_document (
  293:               instance_id, slug, document_type, title, body,
  294:               auto_generated, template_version, effective_date,
  295:               contact_person, contact_email, status, risk_level
  296:             ) VALUES (
  297:               ${ctx.instanceId}::uuid,
  298:               ${template.slug},
  299:               ${docType}::legal_document_type,
  300:               ${template.title},
  301:               ${renderedBody},
  302:               true,
  303:               ${template.version},
  304:               ${effectiveDate},
  305:               ${data.policyContactPerson},
  306:               ${data.policyContactEmail},
  307:               'draft'::content_publication_status,
  308:               'Low'::risk_level
  309:             )
  310:             ON CONFLICT (instance_id, document_type)
  311:               WHERE document_type IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint')
  312:               DO UPDATE
  313:                SET slug = EXCLUDED.slug,
  314:                    title = EXCLUDED.title,
  315:                    body = EXCLUDED.body,
  316:                    auto_generated = EXCLUDED.auto_generated,
  317:                    template_version = EXCLUDED.template_version,
  318:                    effective_date = EXCLUDED.effective_date,
  319:                    contact_person = EXCLUDED.contact_person,
  320:                    contact_email = EXCLUDED.contact_email,
  321:                    updated_at = now()
  322:             RETURNING id, (xmax = 0) AS inserted
  323:           `;
  324:           const legal = legalAfter[0]!;
  325: 
  326:           auditEntries.push({
  327:             contentType: "LegalDocument",
  328:             slug: template.slug,
  329:             mode: legal.inserted ? "insert" : "update",
  330:             status: "draft",
  331:             originalSlug: template.slug,
  332:             documentType: docType,
  333:             templateVersion: template.version,
  334:           });
  335:         }
  336: 
  337:         // === (d) assertHasMainLocationAfterTx 안전망 (cycle3 LL-44) ===
  338:         const mainCheck = await tx<{ exists: boolean }[]>`
  339:           SELECT EXISTS (
  340:             SELECT 1 FROM location_profile
  341:              WHERE instance_id = ${ctx.instanceId}::uuid
  342:                AND clinic_profile_id = ${clinic.id}::uuid
  343:                AND slug = 'main'
  344:           ) AS exists
  345:         `;
  346:         if (!mainCheck[0]?.exists) {
  347:           throw new MainLocationMissingError();
  348:         }
  349: 
  350:         return { ctx, auditEntries };
  351:       },
  352:     );
  353: 
  354:     // 4. audit 7 row sequential emit + 3단계 안전망 (LL-ACTION-18 + cycle3 LL-43)
  355:     const emitted: string[] = [];
  356:     const failed: string[] = [];
  357:     // LLC-09 patch: per-row 실패 원인 보존 — fallback payload 에 reason/code/name 정규화 포함
  358:     const failedDetails: Array<{ target: string; code: string | null; name: string | null; message: string }> = [];
  359:     for (const entry of txResult.auditEntries) {
  360:       try {
  361:         await emitAuditEvent(sqlBase, {
  362:           eventType: "content-saved",
  363:           actorUserId: txResult.ctx.userId,
  364:           targetUserId: txResult.ctx.userId,
  365:           toInstanceId: txResult.ctx.instanceId,
  366:           payload: {
  367:             contentType: entry.contentType,
  368:             slug: entry.slug,
  369:             mode: entry.mode,
  370:             status: entry.status,
  371:             originalSlug: entry.originalSlug,
  372:             ...(entry.documentType !== undefined ? { documentType: entry.documentType } : {}),
  373:             ...(entry.templateVersion !== undefined ? { templateVersion: entry.templateVersion } : {}),
  374:             ...(entry.updatedAtBefore !== undefined ? { updatedAtBefore: entry.updatedAtBefore } : {}),
  375:             ...(entry.updatedAtAfter !== undefined ? { updatedAtAfter: entry.updatedAtAfter } : {}),
  376:           },
  377:         });
  378:         emitted.push(`${entry.contentType}:${entry.slug}`);
  379:       } catch (auditErr) {
  380:         const target = `${entry.contentType}:${entry.slug}`;
  381:         failed.push(target);
  382:         const eObj = typeof auditErr === "object" && auditErr !== null ? (auditErr as { code?: unknown; name?: unknown; message?: unknown }) : null;
  383:         failedDetails.push({
  384:           target,
  385:           code: typeof eObj?.code === "string" ? eObj.code : null,
  386:           name: typeof eObj?.name === "string" ? eObj.name : (auditErr instanceof Error ? auditErr.name : null),
  387:           message: auditErr instanceof Error ? auditErr.message : String(auditErr),
  388:         });
  389:         console.error("[saveClinicProfile] audit row emit failed", {
  390:           contentType: entry.contentType,
  391:           slug: entry.slug,
  392:           error: auditErr,
  393:         });
  394:       }
  395:     }
  396: 
  397:     if (failed.length > 0) {
  398:       const eventType = emitted.length > 0 ? "content-saved-partial" : "content-saved-failed";
  399:       // LL-ACTION-18 reason payload: 첫 실패의 code 를 reason 으로 그대로 노출 (운영 포렌식)
  400:       const primaryReason = failedDetails[0]?.code ?? failedDetails[0]?.name ?? "unknown";
  401:       try {
  402:         await emitAuditEvent(sqlBase, {
  403:           eventType,
  404:           actorUserId: txResult.ctx.userId,
  405:           targetUserId: txResult.ctx.userId,
  406:           toInstanceId: txResult.ctx.instanceId,
  407:           payload: {
  408:             outcome: emitted.length > 0 ? "partial" : "failed",
  409:             emitted,
  410:             failed,
  411:             reason: primaryReason,
  412:             failedDetails,
  413:           },
  414:         });
  415:       } catch (fallbackErr) {
  416:         // 3단계 안전망 의 최종: server stdout (v0.5 — Sentry SDK 미통합 · LL-DEFER-18 까지)
  417:         console.error("[saveClinicProfile] fallback audit emit failed", {
  418:           eventType,
  419:           emitted,
  420:           failed,
  421:           error: fallbackErr,
  422:         });
  423:       }
  424:     }
  425: 
  445: 
  446:     // DB constraint violation
  447:     const mapped = mapDbErrorToResult(err);
  448:     if (mapped !== null) {
  449:       if (mapped.kind === "field") return { ok: false, fieldErrors: mapped.errors };
  450:       return { ok: false, fieldErrors: {}, formError: mapped.message };
  451:     }
  452: 
  453:     if (err instanceof TenantResolveError) {
  454:       const action = mapAuthDenyReasonToUi(err.reason);
  455:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
  456:       if (action.kind === "not-found") notFound();
  457:       if (action.kind === "forbidden") return { ok: false, fieldErrors: {}, formError: action.message };
  458:       if (action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
  459:     }
  460: 
  461:     console.error("[saveClinicProfile] unexpected error", err);
  462:     return { ok: false, fieldErrors: {}, formError: "저장 중 알 수 없는 오류가 발생했습니다." };
  463:   }
  464: }

 succeeded in 685ms:
    1: // @glitzy/web/(admin)/[instanceSlug]/clinic-profile — LOCATION_LEGAL_PLAN v1.0 (M0 v0.5)
    2: // 3계약 동시 출력 (ClinicProfile + LocationProfile(main) + LegalDocument × 5)
    3: 
    4: import { notFound, redirect } from "next/navigation";
    5: import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";
    6: 
    7: import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
    8: import { requirePageContext } from "@/lib/page-context";
    9: import { withSkeletonTx } from "@/lib/tenant";
   10: import {
   11:   ClinicProfileForm,
   12:   emptyInitial,
   13:   type ClinicProfileInitial,
   14: } from "@/components/forms/ClinicProfileForm";
   15: import {
   16:   convertFromOpeningHoursSpec,
   17:   type CT02BusinessHours,
   18:   type PrimaryCtaInput,
   19: } from "@/lib/clinic-profile-schema";
   20: 
   21: import { saveClinicProfile } from "./actions";
   22: 
   23: type ClinicRow = {
   24:   name: string;
   25:   description: string;
   26:   logo_url: string;
   27:   og_image_url: string;
   28:   business_registration_number: string | null;
   29:   alternate_name: string | null;
   30:   legal_entity_name: string | null;
   31:   slogan: string | null;
   32:   long_description: string | null;
   33:   founding_date: string | null;
   34:   founder: string | null;
   35:   policy_contact_person: string | null;
   36:   policy_contact_email: string | null;
   37:   policy_contact_phone: string | null;
   38:   policy_effective_date: string | null;
   39:   primary_ctas: unknown;
   40: };
   41: 
   42: type LocationRow = {
   43:   street_address: string;
   44:   address_locality: string;
   45:   address_region: string;
   46:   postal_code: string;
   47:   address_country: string;
   48:   phone: string | null;
   49:   email: string | null;
   50:   metadata: unknown;
   51: };
   52: 
   53: type LegalRow = { document_type: string; effective_date: string };
   54: 
   55: function pickString(v: unknown): string | null {
   56:   return typeof v === "string" ? v : null;
   57: }
   58: 
   59: function parsePrimaryCtas(raw: unknown): PrimaryCtaInput[] {
   60:   if (!Array.isArray(raw)) return [];
   61:   const out: PrimaryCtaInput[] = [];
   62:   for (const elem of raw) {
   63:     if (typeof elem !== "object" || elem === null) continue;
   64:     const e = elem as Record<string, unknown>;
   65:     const id = pickString(e.id);
   66:     const type = pickString(e.type);
   67:     const label = pickString(e.label);
   68:     const targetUrl = pickString(e.targetUrl);
   69:     if (!id || !type || !label || !targetUrl) continue;
   70:     if (type !== "phone" && type !== "kakao-talk" && type !== "naver-reservation") continue;
   71:     out.push({ id, type, label, targetUrl });
   72:   }
   73:   return out;
   74: }
   75: 
   76: function parseBusinessHoursMetadata(raw: unknown): CT02BusinessHours | null {
   77:   if (typeof raw !== "object" || raw === null) return null;
   78:   const r = raw as Record<string, unknown>;
   79:   const bh = r.businessHours;
   80:   if (typeof bh !== "object" || bh === null) return null;
   81:   const b = bh as Record<string, unknown>;
   82:   const openingHours = Array.isArray(b.openingHours) ? b.openingHours : [];
   83:   const receptionHours = Array.isArray(b.receptionHours) ? b.receptionHours : [];
   84:   const lunchBreaks = Array.isArray(b.lunchBreaks) ? b.lunchBreaks : [];
   85:   const specialClosures = Array.isArray(b.specialClosures) ? b.specialClosures : [];
   86:   return {
   87:     openingHours: openingHours.filter((x): x is { dayOfWeek: string[]; opens: string; closes: string } => {
   88:       if (typeof x !== "object" || x === null) return false;
   89:       const o = x as Record<string, unknown>;
   90:       return Array.isArray(o.dayOfWeek) && typeof o.opens === "string" && typeof o.closes === "string";
   91:     }),
   92:     receptionHours: receptionHours.filter((x): x is { dayOfWeek: string[]; opens: string; closes: string } => {
   93:       if (typeof x !== "object" || x === null) return false;
   94:       const o = x as Record<string, unknown>;
   95:       return Array.isArray(o.dayOfWeek) && typeof o.opens === "string" && typeof o.closes === "string";
   96:     }),
   97:     lunchBreaks: lunchBreaks.filter((x): x is { dayOfWeek: string[]; from: string; to: string } => {
   98:       if (typeof x !== "object" || x === null) return false;
   99:       const o = x as Record<string, unknown>;
  100:       return Array.isArray(o.dayOfWeek) && typeof o.from === "string" && typeof o.to === "string";
  101:     }),
  102:     specialClosures: specialClosures.filter((x): x is { date: string; reason?: string } => {
  103:       if (typeof x !== "object" || x === null) return false;
  104:       const o = x as Record<string, unknown>;
  105:       return typeof o.date === "string";
  106:     }),
  107:   };
  108: }
  109: 
  110: function parseFeaturedChannelId(raw: unknown): string {
  111:   if (typeof raw !== "object" || raw === null) return "";
  112:   const r = raw as Record<string, unknown>;
  113:   const fc = r.featuredChannelId;
  114:   return typeof fc === "string" ? fc : "";
  115: }
  116: 
  117: /**
  118:  * LLC-12 patch (cycle 1 code review):
  119:  *   plan § 7 시나리오 15 의 "403" 은 다음 두 가지로 보장한다:
  120:  *     1) 운영자에게 명확한 "접근 거부" UI 렌더 (본 컴포넌트 · role="main" · aria-labelledby)
  121:  *     2) tenant resolver 단의 RLS app.current_instance_id 미설정 시 0 row 응답 → notFound() (404)
  122:  *   Next.js 14 의 server component 는 직접 HTTP status code 를 설정할 수 없어 정확한 403 status 는
  123:  *   Next 15 `unauthorized()/forbidden()` 합류 시점 cascade (LL-DEFER-21).
  124:  *   감사 로그 emit 은 본 단계에서 미수행 — `assertActionEligibility` 가 throw 하기 전에 진입했으므로
  125:  *   eligibility 단계 audit cascade marker 는 REVIEW_WORKFLOW v1.1 cascade (LL-CASCADE-06 후보).
  126:  */
  127: function ForbiddenAccessPage({ message }: { message: string }) {
  128:   return (
  129:     <main role="main" aria-labelledby="forbidden-title" className="flex flex-col gap-4 p-6">
  130:       <h1 id="forbidden-title" className="text-2xl font-semibold">접근 거부</h1>
  131:       <p className="text-sm text-slate-700">{message}</p>
  132:     </main>
  133:   );
  134: }
  135: 
  136: export default async function ClinicProfilePage({
  137:   params,
  138: }: {
  139:   params: { instanceSlug: string };
  140: }) {
  141:   let pageCtx;
  142:   try {
  143:     pageCtx = await requirePageContext(params.instanceSlug);
  144:   } catch (err) {
  145:     if (err instanceof TenantResolveError) {
  146:       const a = mapAuthDenyReasonToUi(err.reason);
  147:       if (a.kind === "forbidden" || a.kind === "info") {
  148:         return <ForbiddenAccessPage message={a.message} />;
  149:       }
  150:     }
  151:     throw err;
  152:   }
  153: 
  154:   let initial: ClinicProfileInitial | null = null;
  155:   try {
  156:     initial = await withSkeletonTx({ signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId }, async (tx, ctx) => {
  157:       assertActionEligibility(ctx, "operator-edit-content");
  158: 
  159:       const clinicRows = await tx<ClinicRow[]>`
  160:         SELECT name, description, logo_url, og_image_url,
  161:                business_registration_number, alternate_name, legal_entity_name,
  162:                slogan, long_description,
  163:                to_char(founding_date, 'YYYY-MM-DD') AS founding_date,
  164:                founder,
  165:                policy_contact_person, policy_contact_email, policy_contact_phone,
  166:                to_char(policy_effective_date, 'YYYY-MM-DD') AS policy_effective_date,
  167:                primary_ctas
  168:           FROM clinic_profile
  169:          WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'clinic'
  170:          LIMIT 1
  171:       `;
  172:       const clinic = clinicRows[0];
  173:       if (!clinic) return null;
  174: 
  175:       const locationRows = await tx<LocationRow[]>`
  176:         SELECT street_address, address_locality, address_region, postal_code, address_country,
  177:                phone, email, metadata
  178:           FROM location_profile
  179:          WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'main'
  180:          LIMIT 1
  181:       `;
  182:       const location = locationRows[0] ?? null;
  183: 
  184:       const legalRows = await tx<LegalRow[]>`
  185:         SELECT document_type::text AS document_type,
  186:                to_char(effective_date, 'YYYY-MM-DD') AS effective_date
  187:           FROM legal_document
  188:          WHERE instance_id = ${ctx.instanceId}::uuid
  189:            AND document_type IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint')
  190:       `;
  191: 
  192:       const overrides: Record<"privacy" | "terms" | "non-covered" | "refund" | "complaint", string> = {
  193:         privacy: "",
  194:         terms: "",
  195:         "non-covered": "",
  196:         refund: "",
  197:         complaint: "",
  198:       };
  199:       const fallback = clinic.policy_effective_date ?? "";
  200:       for (const row of legalRows) {
  201:         const t = row.document_type as keyof typeof overrides;
  202:         if (overrides[t] !== undefined && row.effective_date !== fallback) {
  203:           overrides[t] = row.effective_date;
  204:         }
  205:       }
  206: 
  207:       const businessHoursSpec = location ? parseBusinessHoursMetadata(location.metadata) : null;
  208:       const primaryCtas = parsePrimaryCtas(clinic.primary_ctas);
  209:       const featuredChannelId = location ? parseFeaturedChannelId(location.metadata) : "";
  210: 
  211:       return {
  212:         ...emptyInitial,
  213:         name: clinic.name,
  214:         description: clinic.description,
  215:         logoUrl: clinic.logo_url,
  216:         ogImageUrl: clinic.og_image_url,
  217:         businessRegistrationNumber: clinic.business_registration_number ?? "",
  218:         alternateName: clinic.alternate_name ?? "",
  219:         legalEntityName: clinic.legal_entity_name ?? "",
  220:         slogan: clinic.slogan ?? "",
  221:         longDescription: clinic.long_description ?? "",
  222:         foundingDate: clinic.founding_date ?? "",
  223:         founder: clinic.founder ?? "",
  224:         streetAddress: location?.street_address ?? "",
  225:         addressLocality: location?.address_locality ?? "",
  226:         addressRegion: location?.address_region ?? "",
  227:         postalCode: location?.postal_code ?? "",
  228:         addressCountry: location?.address_country ?? "KR",
  229:         locationTelephone: location?.phone ?? "",
  230:         locationEmail: location?.email ?? "",
  231:         businessHours: convertFromOpeningHoursSpec(businessHoursSpec),
  232:         primaryCtas,
  233:         featuredChannelId,
  234:         policyContactPerson: clinic.policy_contact_person ?? "",
  235:         policyContactEmail: clinic.policy_contact_email ?? "",
  236:         policyContactPhone: clinic.policy_contact_phone ?? "",
  237:         policyEffectiveDate: clinic.policy_effective_date ?? "",
  238:         legalDocEffectiveOverrides: overrides,
  239:       };
  240:     });
  241:   } catch (err) {
  242:     if (err instanceof TenantResolveError) {
  243:       const action = mapAuthDenyReasonToUi(err.reason);
  244:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
  245:       if (action.kind === "not-found") notFound();
  246:       if (action.kind === "forbidden") {
  247:         return <ForbiddenAccessPage message={action.message} />;
  248:       }
  249:     }
  250:     throw err;
  251:   }
  252: 
  253:   const boundSave = saveClinicProfile.bind(null, params.instanceSlug);
  254: 
  255:   return (
  256:     <main className="flex flex-col gap-6">
  257:       <h1 className="text-2xl font-semibold">사이트 기본 정보</h1>
  258:       <p className="text-sm text-slate-500">
  259:         한 화면에서 3계약(ClinicProfile + LocationProfile main + 5종 LegalDocument)을 동시 저장합니다. 5종 정책 문서 본문은 변수 치환으로 자동 생성됩니다.
  260:       </p>
  261:       <ClinicProfileForm action={boundSave} initial={initial} instanceSlug={params.instanceSlug} />
  262:     </main>
  263:   );
  264: }

 succeeded in 659ms:
    1: // @glitzy/web/components/forms/ClinicProfileForm — LOCATION_LEGAL_PLAN v1.0 § 3
    2: // 3 섹션 + 5 LegalDocument override 재구성.
    3: //
    4: // (a) 기관 정체성 (기존 v1.1 URL scrape prefill)
    5: // (b) 본원 위치·연락·시간 (신규 · LL-FORM-03·07·08·12)
    6: // (c) 정책 변수 보조 (신규 · LL-FORM-04)
    7: // (d) 5 LegalDocument override 보조 (신규 · LL-FORM-13)
    8: 
    9: "use client";
   10: 
   11: import { useState } from "react";
   12: import { useFormState, useFormStatus } from "react-dom";
   13: import { Field } from "@/components/forms/Field";
   14: import type { SaveResult } from "@/app/(admin)/[instanceSlug]/clinic-profile/actions";
   15: import type {
   16:   BusinessHoursInput,
   17:   PrimaryCtaInput,
   18: } from "@/lib/clinic-profile-schema";
   19: 
   20: const CLOSED_DOC_TYPES = ["privacy", "terms", "non-covered", "refund", "complaint"] as const;
   21: type ClosedDocType = (typeof CLOSED_DOC_TYPES)[number];
   22: 
   23: const DOC_TYPE_LABEL: Record<ClosedDocType, string> = {
   24:   privacy: "개인정보처리방침",
   25:   terms: "이용약관",
   26:   "non-covered": "비급여 진료비 안내",
   27:   refund: "환불 규정",
   28:   complaint: "민원 처리 안내",
   29: };
   30: 
   31: const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
   32: type DayOfWeek = (typeof DAYS)[number];
   33: 
   34: const DAY_LABEL: Record<DayOfWeek, string> = {
   35:   monday: "월요일",
   36:   tuesday: "화요일",
   37:   wednesday: "수요일",
   38:   thursday: "목요일",
   39:   friday: "금요일",
   40:   saturday: "토요일",
   41:   sunday: "일요일",
   42: };
   43: 
   44: export type ClinicProfileInitial = {
   45:   // (a) 기관 정체성
   46:   name: string;
   47:   description: string;
   48:   logoUrl: string;
   49:   ogImageUrl: string;
   50:   businessRegistrationNumber: string;
   51:   alternateName: string;
   52:   legalEntityName: string;
   53:   slogan: string;
   54:   longDescription: string;
   55:   foundingDate: string;
   56:   founder: string;
   57:   // (b) 본원 위치·연락·시간
   58:   streetAddress: string;
   59:   addressLocality: string;
   60:   addressRegion: string;
   61:   postalCode: string;
   62:   addressCountry: string;
   63:   locationTelephone: string;
   64:   locationEmail: string;
   65:   businessHours: BusinessHoursInput;
   66:   primaryCtas: PrimaryCtaInput[];
   67:   featuredChannelId: string;
   68:   // (c) 정책 변수
   69:   policyContactPerson: string;
   70:   policyContactEmail: string;
   71:   policyContactPhone: string;
   72:   policyEffectiveDate: string;
   73:   // (d) 5 LegalDocument effective date override
   74:   legalDocEffectiveOverrides: Record<ClosedDocType, string>;
   75: };
   76: 
   77: const emptyDay = { closed: true as const, lunchEnabled: false as const };
   78: 
   79: const emptyBusinessHours: BusinessHoursInput = {
   80:   monday: { ...emptyDay },
  170:   const setLegalDocOverride = (t: ClosedDocType, v: string) =>
  171:     setValues((prev) => ({
  172:       ...prev,
  173:       legalDocEffectiveOverrides: { ...prev.legalDocEffectiveOverrides, [t]: v },
  174:     }));
  175: 
  176:   async function handleAnalyze(): Promise<void> {
  177:     setAnalyzeError(null);
  178:     setAppliedFields([]);
  179:     if (siteUrl.trim() === "") {
  180:       setAnalyzeError("URL 을 입력해주세요.");
  181:       return;
  182:     }
  183:     setAnalyzing(true);
  184:     try {
  185:       const res = await fetch("/api/site-meta-fetch", {
  186:         method: "POST",
  187:         headers: { "content-type": "application/json" },
  188:         body: JSON.stringify({ url: siteUrl.trim(), instanceSlug }),
  189:       });
  190:       const body = (await res.json()) as { ok: boolean; meta?: SiteMeta; error?: string };
  191:       if (!body.ok || !body.meta) {
  192:         setAnalyzeError(body.error ?? "분석에 실패했습니다.");
  193:         return;
  194:       }
  195:       const m = body.meta;
  196:       const applied: string[] = [];
  197:       const safeUrl = (v: string | null): string | null => {
  198:         if (!v) return null;
  199:         if (v.length > 2048) return null;
  200:         try {
  201:           const u = new URL(v);
  202:           if (u.protocol !== "http:" && u.protocol !== "https:") return null;
  203:         } catch {
  204:           return null;
  205:         }
  206:         return v;
  207:       };
  208:       setValues((prev) => {
  209:         const next = { ...prev };
  210:         if (m.name && next.name === "") { next.name = m.name.slice(0, 100); applied.push("기관명"); }
  211:         if (m.description && next.description === "") { next.description = m.description.slice(0, 300); applied.push("간략 소개"); }
  212:         const safeLogo = safeUrl(m.logoUrl);
  213:         if (safeLogo && next.logoUrl === "") { next.logoUrl = safeLogo; applied.push("로고 URL"); }
  214:         const safeOg = safeUrl(m.ogImageUrl);
  215:         if (safeOg && next.ogImageUrl === "") { next.ogImageUrl = safeOg; applied.push("OG 이미지 URL"); }
  216:         return next;
  217:       });
  218:       setAppliedFields(applied);
  219:     } catch (err) {
  220:       console.error("[site-meta-fetch] client fetch error", err);
  221:       setAnalyzeError("네트워크 오류가 발생했습니다.");
  222:     } finally {
  223:       setAnalyzing(false);
  224:     }
  225:   }
  226: 
  227:   // featuredChannelId 의 가능한 option 리스트
  228:   const ctaOptions: Array<{ value: string; label: string }> = [];
  229:   if (ctaPhoneEnabled && ctaPhoneUrl.trim() !== "") ctaOptions.push({ value: "phone-1", label: `전화 (${ctaPhoneLabel})` });
  230:   if (ctaKakaoEnabled && ctaKakaoUrl.trim() !== "") ctaOptions.push({ value: "kakao-talk-1", label: `카카오톡 (${ctaKakaoLabel})` });
  231:   if (ctaNaverEnabled && ctaNaverUrl.trim() !== "") ctaOptions.push({ value: "naver-reservation-1", label: `네이버 예약 (${ctaNaverLabel})` });
  232: 
  233:   return (
  234:     <div className="flex flex-col gap-5">
  235:       <section className="rounded-md border border-blue-200 bg-blue-50 p-4 text-sm">
  236:         <h2 className="mb-2 text-base font-medium text-blue-900">사이트 URL 자동 분석 (onboarding)</h2>
  237:         <p className="mb-3 text-xs text-blue-800">
  238:           기존 의료기관 웹사이트 URL 을 입력하면 og 이미지·favicon·메타 정보를 비어 있는 필드에 채워줍니다.
  239:         </p>
  240:         <div className="flex gap-2">
  241:           <input
  242:             type="url"
  243:             value={siteUrl}
  244:             onChange={(e) => setSiteUrl(e.target.value)}
  245:             placeholder="https://example-clinic.com"
  246:             className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
  247:           />
  248:           <button
  249:             type="button"
  250:             onClick={handleAnalyze}
  251:             disabled={analyzing}
  252:             className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-60"
  253:           >
  254:             {analyzing ? "분석 중…" : "분석"}
  255:           </button>
  256:         </div>
  257:         {analyzeError && <div className="mt-2 text-xs text-rose-700">{analyzeError}</div>}
  258:         {appliedFields.length > 0 && (
  259:           <div className="mt-2 text-xs text-emerald-800">
  260:             적용된 필드: {appliedFields.join(", ")} (이미 입력된 필드는 보존됩니다)
  261:           </div>
  262:         )}
  263:       </section>
  264: 
  265:       <form action={formAction} className="flex flex-col gap-6">
  266:         {state?.ok === true && (
  267:           <div className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
  268:             저장되었습니다. (ClinicProfile + 본원 위치 + 정책 문서 5종)
  269:           </div>
  270:         )}
  271:         {formError && (
  272:           <div className="rounded-md border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-900">{formError}</div>
  273:         )}
  274: 
  275:         {/* (a) 기관 정체성 */}
  276:         <fieldset className="flex flex-col gap-4 rounded-md border border-slate-200 p-4">
  277:           <legend className="px-1 text-sm font-medium text-slate-900">기관 정체성</legend>
  278:           <Field name="name" label="기관명" required value={values.name} onChange={(v) => setField("name", v)} errors={fieldErrors.name} maxLength={100} />
  279:           <Field name="description" label="간략 소개" required value={values.description} onChange={(v) => setField("description", v)} errors={fieldErrors.description} textarea minLength={80} maxLength={300} hint="80~300자" />
  280:           <Field name="logoUrl" label="로고 URL" required type="url" value={values.logoUrl} onChange={(v) => setField("logoUrl", v)} errors={fieldErrors.logoUrl} maxLength={2048} />
  281:           <Field name="ogImageUrl" label="OG 이미지 URL" required type="url" value={values.ogImageUrl} onChange={(v) => setField("ogImageUrl", v)} errors={fieldErrors.ogImageUrl} maxLength={2048} />
  282:           <Field name="businessRegistrationNumber" label="사업자등록번호" value={values.businessRegistrationNumber} onChange={(v) => setField("businessRegistrationNumber", v)} errors={fieldErrors.businessRegistrationNumber} placeholder="000-00-00000" />
  283:           <details className="rounded-md border border-slate-200 bg-white p-3 text-sm">
  284:             <summary className="cursor-pointer">선택 필드</summary>
  285:             <div className="mt-3 flex flex-col gap-4">
  286:               <Field name="alternateName" label="대체명" value={values.alternateName} onChange={(v) => setField("alternateName", v)} errors={fieldErrors.alternateName} maxLength={100} />
  287:               <Field name="legalEntityName" label="법인명" value={values.legalEntityName} onChange={(v) => setField("legalEntityName", v)} errors={fieldErrors.legalEntityName} maxLength={200} />
  288:               <Field name="slogan" label="슬로건" value={values.slogan} onChange={(v) => setField("slogan", v)} errors={fieldErrors.slogan} maxLength={200} />
  289:               <Field name="longDescription" label="상세 설명" value={values.longDescription} onChange={(v) => setField("longDescription", v)} errors={fieldErrors.longDescription} textarea maxLength={2000} />
  290:               <Field name="foundingDate" label="설립일" type="date" value={values.foundingDate} onChange={(v) => setField("foundingDate", v)} errors={fieldErrors.foundingDate} placeholder="2024-01-01" />
  291:               <Field name="founder" label="설립자" value={values.founder} onChange={(v) => setField("founder", v)} errors={fieldErrors.founder} maxLength={100} />
  292:             </div>
  293:           </details>
  294:         </fieldset>
  295: 
  296:         {/* (b) 본원 위치·연락·시간 */}
  297:         <fieldset className="flex flex-col gap-4 rounded-md border border-slate-200 p-4">
  298:           <legend className="px-1 text-sm font-medium text-slate-900">본원 위치 · 연락 · 시간</legend>
  299:           <p className="text-xs text-slate-600">이 정보로 LocationProfile(main) 이 자동 생성되며, 5종 정책 문서의 변수에도 사용됩니다.</p>
  300:           <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
  301:             <Field name="addressRegion" label="시·도" required value={values.addressRegion} onChange={(v) => setField("addressRegion", v)} errors={fieldErrors.addressRegion} maxLength={100} placeholder="서울특별시" />
  302:             <Field name="addressLocality" label="시·군·구" required value={values.addressLocality} onChange={(v) => setField("addressLocality", v)} errors={fieldErrors.addressLocality} maxLength={100} placeholder="강남구" />
  303:           </div>
  304:           <Field name="streetAddress" label="도로명 주소" required value={values.streetAddress} onChange={(v) => setField("streetAddress", v)} errors={fieldErrors.streetAddress} maxLength={200} placeholder="테스트로 1" />
  305:           <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
  306:             <Field name="postalCode" label="우편번호" required value={values.postalCode} onChange={(v) => setField("postalCode", v)} errors={fieldErrors.postalCode} maxLength={20} placeholder="06000" />
  307:             <Field name="addressCountry" label="국가 코드 (ISO 3166-1 alpha-2)" required value={values.addressCountry} onChange={(v) => setField("addressCountry", v.toUpperCase())} errors={fieldErrors.addressCountry} maxLength={2} hint="대문자 2자" />
  308:           </div>
  309:           <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
  310:             <Field name="locationTelephone" label="본원 전화" required value={values.locationTelephone} onChange={(v) => setField("locationTelephone", v)} errors={fieldErrors.locationTelephone} placeholder="02-1234-5678" />
  311:             <Field name="locationEmail" label="본원 이메일" type="email" value={values.locationEmail} onChange={(v) => setField("locationEmail", v)} errors={fieldErrors.locationEmail} placeholder="info@example.com" />
  312:           </div>
  313: 
  314:           <div className="flex flex-col gap-2">
  315:             <label className="text-sm font-medium">진료 시간</label>
  316:             {fieldErrors.businessHours && <span className="text-xs text-rose-700">{fieldErrors.businessHours.join(", ")}</span>}
  317:             <div className="flex flex-col gap-2 rounded-md border border-slate-200 p-3">
  318:               {DAYS.map((day) => {
  319:                 const d = values.businessHours[day];
  320:                 const dayHeaderId = `bh-header-${day}`;
  321:                 const dayInputsId = `bh-inputs-${day}`;
  322:                 const dayErrorId = `bh-error-${day}`;
  323:                 const dayErrorKeys = (Object.keys(fieldErrors) as Array<keyof typeof fieldErrors>).filter((k) => typeof k === "string" && k.startsWith(`businessHours.${day}`));
  324:                 const dayErrorMessages = dayErrorKeys.flatMap((k) => fieldErrors[k] ?? []);
  325:                 return (
  326:                   <div key={day} role="group" aria-labelledby={dayHeaderId} className="flex flex-col gap-1 border-b border-slate-100 pb-2 last:border-0">
  327:                     <div className="flex items-center gap-3">
  328:                       <span id={dayHeaderId} className="w-16 text-sm">{DAY_LABEL[day]}</span>
  329:                       {/* LLC-08 patch: 휴진 toggle 의 aria-controls — 해당 row 의 input group id 지목 */}
  330:                       <label className="flex items-center gap-1 text-xs">
  331:                         <input
  332:                           type="checkbox"
  333:                           name={`businessHours_${day}_closed`}
  334:                           checked={d.closed}
  335:                           onChange={(e) => setDay(day, { closed: e.target.checked })}
  336:                           aria-controls={dayInputsId}
  337:                           aria-expanded={!d.closed}
  338:                         />
  339:                         휴진
  340:                       </label>
  341:                       {!d.closed && (
  342:                         <span id={dayInputsId} className="flex items-center gap-3">
  343:                           <input
  344:                             type="time"
  345:                             name={`businessHours_${day}_open`}
  346:                             value={d.open ?? ""}
  347:                             onChange={(e) => setDay(day, { open: e.target.value })}
  348:                             className="rounded-md border border-slate-300 px-2 py-1 text-xs"
  349:                             aria-label={`${DAY_LABEL[day]} 오픈 시간`}
  350:                             aria-describedby={dayErrorMessages.length > 0 ? dayErrorId : undefined}
  351:                           />
  352:                           <span className="text-xs">~</span>
  353:                           <input
  354:                             type="time"
  355:                             name={`businessHours_${day}_close`}
  356:                             value={d.close ?? ""}
  357:                             onChange={(e) => setDay(day, { close: e.target.value })}
  358:                             className="rounded-md border border-slate-300 px-2 py-1 text-xs"
  359:                             aria-label={`${DAY_LABEL[day]} 마감 시간`}
  360:                             aria-describedby={dayErrorMessages.length > 0 ? dayErrorId : undefined}
  430:                 ))}
  431:               </select>
  432:               {fieldErrors.featuredChannelId && <span className="text-xs text-rose-700">{fieldErrors.featuredChannelId.join(", ")}</span>}
  433:             </label>
  434:           )}
  435:         </fieldset>
  436: 
  437:         {/* (c) 정책 변수 */}
  438:         <fieldset className="flex flex-col gap-4 rounded-md border border-slate-200 p-4">
  439:           <legend className="px-1 text-sm font-medium text-slate-900">정책 변수 (개인정보 보호책임자 등)</legend>
  440:           <p className="text-xs text-slate-600">5종 정책 문서(개인정보처리방침·이용약관·비급여·환불·민원)의 변수에 사용됩니다.</p>
  441:           <Field name="policyContactPerson" label="개인정보 보호책임자" required value={values.policyContactPerson} onChange={(v) => setField("policyContactPerson", v)} errors={fieldErrors.policyContactPerson} maxLength={100} />
  442:           <Field name="policyContactEmail" label="보호책임자 이메일" required type="email" value={values.policyContactEmail} onChange={(v) => setField("policyContactEmail", v)} errors={fieldErrors.policyContactEmail} maxLength={200} />
  443:           <Field name="policyContactPhone" label="보호책임자 전화" required value={values.policyContactPhone} onChange={(v) => setField("policyContactPhone", v)} errors={fieldErrors.policyContactPhone} placeholder="02-1234-5678" />
  444:           <Field name="policyEffectiveDate" label="기본 시행일 (5종 정책 공통 default)" required type="date" value={values.policyEffectiveDate} onChange={(v) => setField("policyEffectiveDate", v)} errors={fieldErrors.policyEffectiveDate} />
  445:         </fieldset>
  446: 
  447:         {/* (d) 5 LegalDocument effective date override */}
  448:         <fieldset className="flex flex-col gap-3 rounded-md border border-slate-200 p-4">
  449:           <legend className="px-1 text-sm font-medium text-slate-900">정책 문서 시행일 (선택 · 미입력 시 기본 시행일 사용)</legend>
  450:           <p className="text-xs text-amber-800">
  451:             본원 정보(기관명·법인명·사업자번호·설립자·본원 주소·전화·이메일) 또는 정책 변수(담당자·이메일·전화·시행일)를 수정하면 5종 정책 문서 본문이 자동으로 다시 생성됩니다. 본문 직접 수정은 추후 단계에서 합류합니다.
  452:           </p>
  453:           <div className="flex flex-col gap-2">
  454:             {CLOSED_DOC_TYPES.map((t) => {
  455:               const headerId = `legal-override-${t}`;
  456:               const bodyId = `legal-override-body-${t}`;
  457:               // LLC-08 patch: summary 의 aria-controls 로 본문 group 을 가리키고, 입력 group 에는 aria-labelledby 로 summary 연결
  458:               return (
  459:                 <details key={t} className="rounded-md border border-slate-200 bg-white p-2">
  460:                   <summary id={headerId} aria-controls={bodyId} className="cursor-pointer text-sm">
  461:                     {DOC_TYPE_LABEL[t]} <span className="text-xs text-slate-500">(현재: {values.legalDocEffectiveOverrides[t] || values.policyEffectiveDate || "—"})</span>
  462:                   </summary>
  463:                   <div id={bodyId} role="group" aria-labelledby={headerId} className="mt-2">
  464:                     <Field
  465:                       name={`legalDocEffective_${t}`}
  466:                       label={`${DOC_TYPE_LABEL[t]} 시행일 override`}
  467:                       type="date"
  468:                       value={values.legalDocEffectiveOverrides[t]}
  469:                       onChange={(v) => setLegalDocOverride(t, v)}
  470:                       errors={fieldErrors[`legalDocEffectiveOverrides.${t}`]}
  471:                     />
  472:                   </div>
  473:                 </details>
  474:               );
  475:             })}
  476:           </div>
  477:         </fieldset>
  478: 
  479:         <SubmitButton />
  480:       </form>
  481:     </div>
  482:   );
  483: }
  484: 
  485: function CtaRow({
  486:   type,
  487:   label,
  488:   enabled,
  489:   setEnabled,
  490:   labelVal,
  491:   setLabelVal,
  492:   urlVal,
  493:   setUrlVal,
  494:   urlPlaceholder,
  495: }: {
  496:   type: "phone" | "kakao-talk" | "naver-reservation";
  497:   label: string;
  498:   enabled: boolean;
  499:   setEnabled: (v: boolean) => void;
  500:   labelVal: string;
  501:   setLabelVal: (v: string) => void;
  502:   urlVal: string;
  503:   setUrlVal: (v: string) => void;
  504:   urlPlaceholder: string;
  505: }) {
  506:   return (
  507:     <div className="flex flex-col gap-2 border-b border-slate-100 pb-2 last:border-0">
  508:       <label className="flex items-center gap-2 text-sm">
  509:         <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
  510:         {label}
  511:       </label>
  512:       {enabled && (
  513:         <div className="grid grid-cols-1 gap-2 pl-6 md:grid-cols-2">
  514:           <input
  515:             type="text"
  516:             name={`cta_${type}_label`}
  517:             value={labelVal}
  518:             onChange={(e) => setLabelVal(e.target.value)}
  519:             placeholder="표시 라벨"
  520:             className="rounded-md border border-slate-300 px-2 py-1 text-xs"
  521:           />
  522:           <input
  523:             type="text"
  524:             name={`cta_${type}_targetUrl`}
  525:             value={urlVal}
  526:             onChange={(e) => setUrlVal(e.target.value)}
  527:             placeholder={urlPlaceholder}
  528:             className="rounded-md border border-slate-300 px-2 py-1 text-xs"
  529:           />
  530:         </div>
  531:       )}
  532:     </div>
  533:   );
  534: }
  535: 
  536: function SubmitButton() {
  537:   const { pending } = useFormStatus();
  538:   return (
  539:     <button
  540:       type="submit"

 succeeded in 677ms:
### apps/web/src/lib/errors.ts
    1: // @glitzy/web/lib/errors — DB constraint violation → field/form error mapping
    2: // cycle1-3entity WEB-08: ClinicProfile + DoctorProfile + TreatmentPage + Article constraint 추가
    3: // LOCATION_LEGAL_PLAN v1.0 (cycle3 LL-44 + cycle4 LL-48): LegalDocument + LocationProfile + clinic_profile policy/primary_ctas + MainLocationMissingError
    4: 
    5: /**
    6:  * LL-ACTION-21 (cycle3 LL-44 patch): assertHasMainLocationAfterTx 안전망 throw class.
    7:  * mapDbErrorToResult 와는 별개 (DB error 가 아닌 application-level invariant).
    8:  */
    9: export class MainLocationMissingError extends Error {
   10:   override readonly name = "MainLocationMissingError";
   11:   constructor(message = "본원 정보 저장에 실패했습니다. 페이지를 새로고침하고 다시 시도하세요.") {
   12:     super(message);
   13:   }
   14: }
   15: 
   16: export type FieldErrors = Record<string, string[]>;
   17: 
   18: type Mapping = { field: string | null; message: string };
   19: 
   20: // constraint_name → field + 한국어 메시지
   21: const CONSTRAINT_MAP: Record<string, Mapping> = {
   22:   // ClinicProfile (C0001)
   23:   clinic_profile_name_length: { field: "name", message: "기관명은 1~100자여야 합니다." },
   24:   clinic_profile_description_length: { field: "description", message: "간략 소개는 80~300자여야 합니다." },
   25:   clinic_profile_slug_regex: { field: "slug", message: "slug 형식이 올바르지 않습니다." },
   26:   clinic_profile_brn_regex: { field: "businessRegistrationNumber", message: "사업자등록번호 형식이 올바르지 않습니다 (000-00-00000)." },
   27:   clinic_profile_instance_slug_unique: { field: "slug", message: "이미 사용 중인 slug 입니다." },
   28: 
   29:   // DoctorProfile (C0003)
   30:   doctor_profile_slug_regex: { field: "slug", message: "slug 형식이 올바르지 않습니다. (3~64자, 소문자/숫자/하이픈)" },
   31:   doctor_profile_name_length: { field: "name", message: "이름은 1~100자여야 합니다." },
   32:   doctor_profile_instance_slug_unique: { field: "slug", message: "이미 사용 중인 slug 입니다." },
   33: 
   34:   // TreatmentPage (C0004)
   35:   treatment_page_slug_regex: { field: "slug", message: "slug 형식이 올바르지 않습니다. (3~100자)" },
   36:   treatment_page_title_length: { field: "title", message: "제목은 1~200자여야 합니다." },
   37:   treatment_page_summary_length: { field: "summary", message: "요약은 50~160자여야 합니다." },
   38:   treatment_page_published_requires_at: { field: null, message: "발행 상태일 때 발행일이 필요합니다." },
   39:   treatment_page_instance_slug_unique: { field: "slug", message: "이미 사용 중인 slug 입니다." },
   40: 
   41:   // Article (C0005)
   42:   article_slug_regex: { field: "slug", message: "slug 형식이 올바르지 않습니다. (3~100자)" },
   43:   article_title_length: { field: "title", message: "제목은 1~200자여야 합니다." },
   44:   article_summary_length: { field: "summary", message: "요약은 80~200자여야 합니다." },
   45:   article_published_requires_at: { field: null, message: "발행 상태일 때 발행일이 필요합니다." },
   46:   article_instance_slug_unique: { field: "slug", message: "이미 사용 중인 slug 입니다." },
   47:   article_author_fk: { field: "authorDoctorId", message: "해당 의료진을 찾을 수 없습니다." },
   48: 
   49:   // ClinicProfile policy + primary_ctas (C0007 · LOCATION_LEGAL_PLAN v1.0)
   50:   clinic_profile_policy_email_regex: { field: "policyContactEmail", message: "개인정보 보호책임자 이메일 형식이 올바르지 않습니다." },
   51:   clinic_profile_policy_phone_format: { field: "policyContactPhone", message: "전화번호 형식이 올바르지 않습니다 (예: 02-1234-5678, 010-1234-5678, +82-2-1234-5678)." },
   52:   clinic_profile_primary_ctas_array: { field: "primaryCtas", message: "예약 채널 입력값이 올바르지 않습니다." },
   53:   clinic_profile_primary_ctas_shape: { field: "primaryCtas", message: "예약 채널 항목의 형식이 올바르지 않습니다 (id · type · label · targetUrl 필수)." },
   54: 
   55:   // LocationProfile parentClinic (C0008 · LL-SCHEMA-14)
   56:   location_profile_clinic_fk: { field: null, message: "본원과 위치 정보가 일치하지 않습니다. 페이지를 새로고침하고 다시 시도하세요." },
   57:   // LLC-10 patch: LocationProfile phone CHECK (C0002)
   58:   location_profile_phone_format: { field: "locationTelephone", message: "본원 전화번호 형식이 올바르지 않습니다 (예: 02-1234-5678, 010-1234-5678, +82-2-1234-5678)." },
   59: 
   60:   // LegalDocument (C0006 · LOCATION_LEGAL_PLAN v1.0)
   61:   legal_document_instance_5type_unique: { field: null, message: "동일 정책 문서가 이미 존재합니다. 잠시 후 다시 시도하세요." },
   62:   legal_document_status_skeleton_limit: { field: null, message: "정책 문서 상태 변경(검수 진입·발행)은 후속 단계입니다. 본 화면에서는 draft 만 저장 가능하며, 검수 진입은 compliance-assistant Feature 합류(M0 v1.0 본 구현 완료 시점) 후 검수 큐 화면에서 가능합니다." },
   63:   legal_document_published_at_null: { field: null, message: "정책 문서 발행은 후속 단계입니다. 발행 게이트(compliance-assistant + ComplianceRecord UI) 합류 후 발행 화면에서 가능합니다." },
   64:   legal_document_risk_level_skeleton_limit: { field: null, message: "정책 문서 위험도는 현재 단계에서 Low 만 허용됩니다. 위험도 수동 분류는 위험도 분류 UI(M0 v1.0) 합류 후 가능합니다." },
   65:   legal_document_title_length: { field: null, message: "정책 문서 제목은 1~100자여야 합니다." },
   66:   legal_document_body_length: { field: null, message: "정책 문서 본문 길이가 허용 범위(1~200000자)를 벗어났습니다." },
   67:   legal_document_email_regex: { field: null, message: "정책 문서의 연락처 이메일 형식이 올바르지 않습니다." },
   68:   legal_document_slug_regex: { field: null, message: "정책 문서 slug 형식이 올바르지 않습니다." },
   69:   legal_document_instance_slug_unique: { field: null, message: "동일 slug 의 정책 문서가 이미 존재합니다." },
   70:   legal_document_template_version_format: { field: null, message: "정책 문서 템플릿 버전 형식이 올바르지 않습니다." },
   71:   legal_document_auto_generated_template_ver: { field: null, message: "자동 생성 정책 문서에는 템플릿 버전이 필요합니다." },
   72: };
   73: 
   74: export type DbErrorResult =
   75:   | { kind: "field"; errors: FieldErrors }
   76:   | { kind: "form"; message: string };
   77: 
   78: /**
   79:  * postgres-js error 의 `code` (SQLSTATE) 와 `constraint_name` 으로 field/form 매핑.
   80:  * 23514 = check_violation, 23505 = unique_violation, 23503 = foreign_key_violation
   81:  */
   82: export function mapDbErrorToResult(err: unknown): DbErrorResult | null {
   83:   if (typeof err !== "object" || err === null) return null;
   84:   const e = err as { code?: string; constraint_name?: string; constraint?: string };
   85:   const code = e.code;
   86:   const constraint = e.constraint_name ?? e.constraint;
   87:   if (!code || !constraint) return null;
   88:   if (code !== "23514" && code !== "23505" && code !== "23503") return null;
   89: 
   90:   const mapping = CONSTRAINT_MAP[constraint];
   91:   if (mapping) {
   92:     if (mapping.field === null) return { kind: "form", message: mapping.message };
   93:     return { kind: "field", errors: { [mapping.field]: [mapping.message] } };
   94:   }
   95: 
   96:   // unknown constraint — generic
   97:   if (code === "23505") return { kind: "form", message: "중복된 값이 있어 저장하지 못했습니다." };
   98:   if (code === "23503") return { kind: "form", message: "참조 무결성 오류 — 연결된 데이터가 없거나 삭제되었습니다." };
   99:   if (code === "23514") return { kind: "form", message: "입력값이 데이터 제약을 만족하지 못합니다." };
  100:   return null;
  101: }
  102: 
  103: /** 기존 호출처 호환 — FieldErrors 만 반환 (form 메시지는 null) */
  104: export function mapDbErrorToFieldErrors(err: unknown): FieldErrors | null {
  105:   const result = mapDbErrorToResult(err);
  106:   if (result === null) return null;
  107:   if (result.kind === "field") return result.errors;
  108:   return null;
  109: }
### packages/core-content/src/templates/index.ts
    1: // @glitzy/core-content/templates — LOCATION_LEGAL_PLAN v1.0 § 5
    2: //
    3: // LL-TEMPLATE-04 marker: 본 5종 표준 템플릿 본문은 본 plan 의 검토 범위 외.
    4: // 법무 검토 필수 — 별도 cascade 로 법무 검토 받은 본문으로 교체.
    5: 
    6: import {
    7:   PRIVACY_BODY,
    8:   TERMS_BODY,
    9:   NON_COVERED_BODY,
   10:   REFUND_BODY,
   11:   COMPLAINT_BODY,
   12: } from "./bodies.js";
   13: 
   14: export type ClosedLegalDocumentType =
   15:   | "privacy"
   16:   | "terms"
   17:   | "non-covered"
   18:   | "refund"
   19:   | "complaint";
   20: 
   21: export type LegalDocumentType = ClosedLegalDocumentType | "cookie" | "other";
   22: 
   23: export type Template = {
   24:   readonly documentType: ClosedLegalDocumentType;
   25:   readonly slug: string;
   26:   readonly title: string;
   27:   readonly version: string;
   28:   readonly body: string;
   29: };
   30: 
   31: export const TEMPLATES: Record<ClosedLegalDocumentType, Template> = {
   32:   privacy: {
   33:     documentType: "privacy",
   34:     slug: "privacy",
   35:     title: "개인정보처리방침",
   36:     version: "privacy@1.0.0",
   37:     body: PRIVACY_BODY,
   38:   },
   39:   terms: {
   40:     documentType: "terms",
   41:     slug: "terms",
   42:     title: "이용약관",
   43:     version: "terms@1.0.0",
   44:     body: TERMS_BODY,
   45:   },
   46:   "non-covered": {
   47:     documentType: "non-covered",
   48:     slug: "non-covered",
   49:     title: "비급여 진료비 안내",
   50:     version: "non-covered@1.0.0",
   51:     body: NON_COVERED_BODY,
   52:   },
   53:   refund: {
   54:     documentType: "refund",
   55:     slug: "refund",
   56:     title: "환불 규정",
   57:     version: "refund@1.0.0",
   58:     body: REFUND_BODY,
   59:   },
   60:   complaint: {
   61:     documentType: "complaint",
   62:     slug: "complaint",
   63:     title: "민원 처리 안내",
   64:     version: "complaint@1.0.0",
   65:     body: COMPLAINT_BODY,
   66:   },
   67: };
   68: 
   69: export const CLOSED_DOCUMENT_TYPES: readonly ClosedLegalDocumentType[] = [
   70:   "privacy",
   71:   "terms",
   72:   "non-covered",
   73:   "refund",
   74:   "complaint",
   75: ];
   76: 
   77: // LL-ACTION-04 patch: alpha sort (deadlock 회피 순서) — server action 안 잠금 순서와 동일.
   78: export const CLOSED_DOCUMENT_TYPES_ALPHA: readonly ClosedLegalDocumentType[] = [
   79:   "complaint",
   80:   "non-covered",
   81:   "privacy",
   82:   "refund",
   83:   "terms",
   84: ];
   85: 
   86: export { renderTemplate, listTemplateVariables, TemplateRenderError } from "./render.js";
   87: export type { RenderContext } from "./render.js";
### packages/core-content/src/templates/render.ts
    1: // @glitzy/core-content/templates/render — LOCATION_LEGAL_PLAN v1.0 § 4.2
    2: //
    3: // 변수 치환 엔진. 화이트리스트 strict — 등록되지 않은 키는 throw.
    4: //
    5: // cycle1 LL-06 + cycle2 LL-33 + cycle3 LL-45 patch:
    6: //   policy.* 변수 정당화 (admin/ARCH § 3.8.2 contactPerson 입력 섹션 SoT).
    7: //
    8: // cycle3 LL-24 + cycle4 LL-55 patch:
    9: //   검출 시점 = server action runtime (renderTemplate throw → formError).
   10: //   build-time test 도 packages/core-content test runner 에서 cascade.
   11: 
   12: export type RenderContext = {
   13:   clinic: {
   14:     name: string;
   15:     legalEntityName: string | null;
   16:     businessRegistrationNumber: string | null;
   17:     founder: string | null;
   18:   };
   19:   location: {
   20:     main: {
   21:       address: string;
   22:       telephone: string;
   23:       email: string | null;
   24:     };
   25:   };
   26:   policy: {
   27:     contactPerson: string;
   28:     contactEmail: string;
   29:     contactPhone: string;
   30:     effectiveDate: string;
   31:   };
   32: };
   33: 
   34: const VARIABLE_WHITELIST = new Set<string>([
   35:   "clinic.name",
   36:   "clinic.legalEntityName",
   37:   "clinic.businessRegistrationNumber",
   38:   "clinic.founder",
   39:   "location.main.address",
   40:   "location.main.telephone",
   41:   "location.main.email",
   42:   "policy.contactPerson",
   43:   "policy.contactEmail",
   44:   "policy.contactPhone",
   45:   "policy.effectiveDate",
   46: ]);
   47: 
   48: export class TemplateRenderError extends Error {
   49:   override readonly name = "TemplateRenderError";
   50:   constructor(
   51:     public readonly reason: "unknown-variable" | "missing-required-value",
   52:     public readonly variableKey: string,
   53:     message: string,
   54:   ) {
   55:     super(message);
   56:   }
   57: }
   58: 
   59: function resolveVariable(key: string, ctx: RenderContext): string | null {
   60:   switch (key) {
   61:     case "clinic.name": return ctx.clinic.name;
   62:     case "clinic.legalEntityName": return ctx.clinic.legalEntityName;
   63:     case "clinic.businessRegistrationNumber": return ctx.clinic.businessRegistrationNumber;
   64:     case "clinic.founder": return ctx.clinic.founder;
   65:     case "location.main.address": return ctx.location.main.address;
   66:     case "location.main.telephone": return ctx.location.main.telephone;
   67:     case "location.main.email": return ctx.location.main.email;
   68:     case "policy.contactPerson": return ctx.policy.contactPerson;
   69:     case "policy.contactEmail": return ctx.policy.contactEmail;
   70:     case "policy.contactPhone": return ctx.policy.contactPhone;
   71:     case "policy.effectiveDate": return ctx.policy.effectiveDate;
   72:     default:
   73:       throw new TemplateRenderError("unknown-variable", key, `unknown variable: ${key}`);
   74:   }
   75: }
   76: 
   77: // LL-ACTION-13: 단순 fallback `(미기재)` — 옵셔널 변수 NULL 시 표기.
   78: function nullFallback(key: string): string {
   79:   if (key === "clinic.legalEntityName") return "(법인명 미기재)";
   80:   if (key === "clinic.businessRegistrationNumber") return "(사업자등록번호 미기재)";
   81:   if (key === "clinic.founder") return "(대표자 미기재)";
   82:   if (key === "location.main.email") return "(이메일 미기재)";
   83:   return "(미기재)";
   84: }
   85: 
   86: // LL-ACTION-14: 1차 치환만 (no recursive expansion).
   87: const VARIABLE_PATTERN = /\{\{\s*([a-zA-Z][a-zA-Z0-9_.-]*)\s*\}\}/g;
   88: 
   89: export function renderTemplate(template: string, ctx: RenderContext): string {
   90:   return template.replace(VARIABLE_PATTERN, (_, key: string) => {
   91:     // 화이트리스트 검증 (strict)
   92:     if (!VARIABLE_WHITELIST.has(key)) {
   93:       throw new TemplateRenderError("unknown-variable", key, `unknown variable: ${key}`);
   94:     }
   95:     const value = resolveVariable(key, ctx);
   96:     if (value === null) return nullFallback(key);
   97:     return value;
   98:   });
   99: }
  100: 
  101: // build-time unit test cascade — packages/core-content test runner 가 모든 템플릿의 unknown key 부재 검증.
  102: export function listTemplateVariables(template: string): string[] {
  103:   const keys = new Set<string>();
  104:   let match: RegExpExecArray | null;
  105:   const re = new RegExp(VARIABLE_PATTERN.source, "g");
  106:   while ((match = re.exec(template)) !== null) {
  107:     keys.add(match[1]!);
  108:   }
  109:   return [...keys];
  110: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$f='"'apps/web/src/components/forms/ClinicProfileForm.tsx'; "'$i=1; Get-Content $f | ForEach-Object { if($i -ge 360 -and $i -le 429){ '"'{0,5}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$f='"'packages/core-content/src/schema.ts'; "'$i=1; Get-Content $f | ForEach-Object { if(($i -ge 90 -and $i -le 135) -or ($i -ge 355 -and $i -le 430)){ '"'{0,5}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$f='"'packages/core-content/src/templates/bodies.ts'; "'$i=1; Get-Content $f | ForEach-Object { if($_ -match '"'\\{\\{'){ '{0,5}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$files=@('"'docs/admin/ARCHITECTURE.md','docs/core/CONTENT_STANDARDS.md','docs/decisions/LOCATION_LEGAL_PLAN.md'); foreach("'$f in $files){ Write-Output "### $f"; $i=1; Get-Content $f | ForEach-Object { if(($f -like '"'*ARCHITECTURE.md' -and "'$i -ge 219 -and $i -le 254) -or ($f -like '"'*CONTENT_STANDARDS.md' -and "'$i -ge 395 -and $i -le 415) -or ($f -like '"'*LOCATION_LEGAL_PLAN.md' -and (("'$i -ge 420 -and $i -le 430) -or ($i -ge 494 -and $i -le 506) -or ($i -ge 547 -and $i -le 594)))){ '"'{0,5}: {1}' -f "'$i, $_ }; $i++ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 679ms:
   90: // === LocationProfile (C-21·M0-18 country regex) ===
   91: 
   92: export const locationProfile = pgTable(
   93:   "location_profile",
   94:   {
   95:     id: uuid("id").primaryKey().defaultRandom(),
   96:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
   97:     slug: text("slug").notNull(),
   98:     name: text("name").notNull(),
   99:     streetAddress: text("street_address").notNull(),
  100:     addressLocality: text("address_locality").notNull(),
  101:     addressRegion: text("address_region").notNull(),
  102:     postalCode: text("postal_code").notNull(),
  103:     addressCountry: text("address_country").notNull().default("KR"),
  104:     latitude: numeric("latitude", { precision: 10, scale: 7 }),
  105:     longitude: numeric("longitude", { precision: 10, scale: 7 }),
  106:     phone: text("phone"),
  107:     email: text("email"),
  108:     // LL-SCHEMA-13~14 + cycle1 LL-01 + cycle2 LL-28: parentClinic (C-21 required) composite FK · 전 row NOT NULL
  109:     clinicProfileId: uuid("clinic_profile_id").notNull(),
  110:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
  111:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  112:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  113:   },
  114:   (t) => ({
  115:     slugRegex: check("location_profile_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
  116:     countryIso: check("location_profile_country_iso", sql`${t.addressCountry} ~ '^[A-Z]{2}$'`),
  117:     latRange: check("location_profile_lat_range", sql`${t.latitude} IS NULL OR (${t.latitude} BETWEEN -90 AND 90)`),
  118:     lngRange: check("location_profile_lng_range", sql`${t.longitude} IS NULL OR (${t.longitude} BETWEEN -180 AND 180)`),
  119:     emailRegex: check("location_profile_email_regex", sql`${t.email} IS NULL OR ${t.email} ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'`),
  120:     // LLC-10 patch: phone regex (한국 + 국제 +82) — form/DB 일치
  121:     phoneFormat: check("location_profile_phone_format", sql`${t.phone} IS NULL OR ${t.phone} ~ '^(\\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}$'`),
  122:     // LL-SCHEMA-14: composite FK — 실 migration 은 raw SQL 에서 DEFERRABLE INITIALLY DEFERRED 적용 (LLC-14 marker).
  123:     // Drizzle ORM 자체는 deferrable 옵션 미지원이므로 schema 생성 시 raw constraint 와 충돌 회피 책임은 migrations-runner 측에 있음 (LL-CASCADE-05).
  124:     clinicFk: foreignKey({
  125:       columns: [t.instanceId, t.clinicProfileId],
  126:       foreignColumns: [clinicProfile.instanceId, clinicProfile.id],
  127:       name: "location_profile_clinic_fk",
  128:     }).onDelete("cascade"),
  129:     instanceSlugUnique: unique("location_profile_instance_slug_unique").on(t.instanceId, t.slug),
  130:     instanceIdUnique: unique("location_profile_instance_id_unique").on(t.instanceId, t.id),
  131:     instanceIdx: index("location_profile_instance_idx").on(t.instanceId),
  132:     clinicIdx: index("location_profile_clinic_idx").on(t.instanceId, t.clinicProfileId),
  133:   }),
  134: );
  135: 

 succeeded in 689ms:
  360:                             aria-describedby={dayErrorMessages.length > 0 ? dayErrorId : undefined}
  361:                           />
  362:                           <label className="ml-2 flex items-center gap-1 text-xs">
  363:                             <input
  364:                               type="checkbox"
  365:                               name={`businessHours_${day}_lunchEnabled`}
  366:                               checked={d.lunchEnabled}
  367:                               onChange={(e) => setDay(day, { lunchEnabled: e.target.checked })}
  368:                               aria-expanded={d.lunchEnabled}
  369:                             />
  370:                             점심
  371:                           </label>
  372:                           {d.lunchEnabled && (
  373:                             <>
  374:                               <input
  375:                                 type="time"
  376:                                 name={`businessHours_${day}_lunchFrom`}
  377:                                 value={d.lunchFrom ?? ""}
  378:                                 onChange={(e) => setDay(day, { lunchFrom: e.target.value })}
  379:                                 className="rounded-md border border-slate-300 px-2 py-1 text-xs"
  380:                                 aria-label={`${DAY_LABEL[day]} 점심 시작`}
  381:                                 aria-describedby={dayErrorMessages.length > 0 ? dayErrorId : undefined}
  382:                               />
  383:                               <span className="text-xs">~</span>
  384:                               <input
  385:                                 type="time"
  386:                                 name={`businessHours_${day}_lunchTo`}
  387:                                 value={d.lunchTo ?? ""}
  388:                                 onChange={(e) => setDay(day, { lunchTo: e.target.value })}
  389:                                 className="rounded-md border border-slate-300 px-2 py-1 text-xs"
  390:                                 aria-label={`${DAY_LABEL[day]} 점심 종료`}
  391:                                 aria-describedby={dayErrorMessages.length > 0 ? dayErrorId : undefined}
  392:                               />
  393:                             </>
  394:                           )}
  395:                         </span>
  396:                       )}
  397:                     </div>
  398:                     {dayErrorMessages.length > 0 && (
  399:                       <p id={dayErrorId} role="alert" className="text-xs text-rose-700">{dayErrorMessages.join(", ")}</p>
  400:                     )}
  401:                   </div>
  402:                 );
  403:               })}
  404:             </div>
  405:           </div>
  406: 
  407:           <div className="flex flex-col gap-2">
  408:             <label className="text-sm font-medium">예약 채널 (최소 1개)</label>
  409:             {fieldErrors.primaryCtas && <span className="text-xs text-rose-700">{fieldErrors.primaryCtas.join(", ")}</span>}
  410:             <div className="flex flex-col gap-3 rounded-md border border-slate-200 p-3">
  411:               <CtaRow type="phone" label="전화 예약" enabled={ctaPhoneEnabled} setEnabled={setCtaPhoneEnabled} labelVal={ctaPhoneLabel} setLabelVal={setCtaPhoneLabel} urlVal={ctaPhoneUrl} setUrlVal={setCtaPhoneUrl} urlPlaceholder="tel:+82-2-1234-5678" />
  412:               <CtaRow type="kakao-talk" label="카카오톡 상담" enabled={ctaKakaoEnabled} setEnabled={setCtaKakaoEnabled} labelVal={ctaKakaoLabel} setLabelVal={setCtaKakaoLabel} urlVal={ctaKakaoUrl} setUrlVal={setCtaKakaoUrl} urlPlaceholder="https://pf.kakao.com/_..." />
  413:               <CtaRow type="naver-reservation" label="네이버 예약" enabled={ctaNaverEnabled} setEnabled={setCtaNaverEnabled} labelVal={ctaNaverLabel} setLabelVal={setCtaNaverLabel} urlVal={ctaNaverUrl} setUrlVal={setCtaNaverUrl} urlPlaceholder="https://booking.naver.com/booking/..." />
  414:             </div>
  415:           </div>
  416: 
  417:           {ctaOptions.length > 0 && (
  418:             <label className="flex flex-col gap-1 text-sm">
  419:               <span>강조 채널 <span className="ml-1 text-rose-600">*</span></span>
  420:               <select
  421:                 name="featuredChannelId"
  422:                 value={values.featuredChannelId}
  423:                 onChange={(e) => setField("featuredChannelId", e.target.value)}
  424:                 required
  425:                 className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
  426:               >
  427:                 <option value="">— 선택 —</option>
  428:                 {ctaOptions.map((o) => (
  429:                   <option key={o.value} value={o.value}>{o.label}</option>

 succeeded in 695ms:
    6: // String.raw 로 backtick/${} escape 부담 회피 (템플릿 안 {{...}} 만 사용 — 충돌 없음).
    8: export const PRIVACY_BODY: string = String.raw`# {{clinic.name}} 개인정보처리방침
   10: **시행일**: {{policy.effectiveDate}}
   12: {{clinic.name}}(이하 "본 기관")은 「개인정보 보호법」 등 관련 법령을 준수하며, 이용자의 개인정보 보호를 위해 다음과 같이 개인정보처리방침을 수립·공개합니다.
   54:   - 성명: {{policy.contactPerson}}
   55:   - 연락처: {{policy.contactPhone}}
   56:   - 이메일: {{policy.contactEmail}}
   65: - 기관명: {{clinic.name}}
   66: - 법인명: {{clinic.legalEntityName}}
   67: - 사업자등록번호: {{clinic.businessRegistrationNumber}}
   68: - 주소: {{location.main.address}}
   69: - 대표 연락처: {{location.main.telephone}}
   70: - 이메일: {{location.main.email}}
   73: export const TERMS_BODY: string = String.raw`# {{clinic.name}} 이용약관
   75: **시행일**: {{policy.effectiveDate}}
   79: 본 약관은 {{clinic.name}}(이하 "본 기관")이 운영하는 웹사이트 및 진료 서비스(이하 "서비스")의 이용 조건 및 절차, 본 기관과 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
  124: - 기관명: {{clinic.name}}
  125: - 법인명: {{clinic.legalEntityName}}
  126: - 사업자등록번호: {{clinic.businessRegistrationNumber}}
  127: - 대표자: {{clinic.founder}}
  128: - 주소: {{location.main.address}}
  129: - 대표 연락처: {{location.main.telephone}}
  132: - 담당자: {{policy.contactPerson}}
  133: - 이메일: {{policy.contactEmail}}
  134: - 전화: {{policy.contactPhone}}
  137: export const NON_COVERED_BODY: string = String.raw`# {{clinic.name}} 비급여 진료비 안내
  139: **시행일**: {{policy.effectiveDate}}
  141: 본 안내는 「의료법」 제45조 및 같은 법 시행규칙 제42조의2(비급여 진료비용 등의 고지)에 따라 {{clinic.name}}의 비급여 진료비를 안내합니다.
  174: - 담당자: {{policy.contactPerson}}
  175: - 전화: {{policy.contactPhone}}
  176: - 이메일: {{policy.contactEmail}}
  185: - 기관명: {{clinic.name}}
  186: - 사업자등록번호: {{clinic.businessRegistrationNumber}}
  187: - 주소: {{location.main.address}}
  188: - 대표 연락처: {{location.main.telephone}}
  191: export const REFUND_BODY: string = String.raw`# {{clinic.name}} 환불 규정
  193: **시행일**: {{policy.effectiveDate}}
  195: 본 환불 규정은 {{clinic.name}}(이하 "본 기관")에서 발생하는 진료비 환불 절차 및 기준에 관한 사항을 규정합니다.
  241: - 담당자: {{policy.contactPerson}}
  242: - 전화: {{policy.contactPhone}}
  243: - 이메일: {{policy.contactEmail}}
  248: - 기관명: {{clinic.name}}
  249: - 법인명: {{clinic.legalEntityName}}
  250: - 대표자: {{clinic.founder}}
  251: - 사업자등록번호: {{clinic.businessRegistrationNumber}}
  252: - 주소: {{location.main.address}}
  253: - 대표 연락처: {{location.main.telephone}}
  256: export const COMPLAINT_BODY: string = String.raw`# {{clinic.name}} 민원 처리 안내
  258: **시행일**: {{policy.effectiveDate}}
  260: {{clinic.name}}(이하 "본 기관")은 환자 및 보호자의 권익 보호와 신속한 민원 처리를 위해 다음과 같이 민원 처리 절차를 운영합니다.
  267: - 전화 접수: {{policy.contactPhone}}
  268: - 이메일 접수: {{policy.contactEmail}}
  269: - 우편 접수: {{location.main.address}}
  273: - 민원 처리 담당자: {{policy.contactPerson}}
  274: - 연락처: {{policy.contactPhone}}
  275: - 이메일: {{policy.contactEmail}}
  322: - 기관명: {{clinic.name}}
  323: - 법인명: {{clinic.legalEntityName}}
  324: - 사업자등록번호: {{clinic.businessRegistrationNumber}}
  325: - 주소: {{location.main.address}}
  326: - 대표 연락처: {{location.main.telephone}}
  327: - 대표 이메일: {{location.main.email}}

 succeeded in 734ms:
### docs/admin/ARCHITECTURE.md
  219: ### 3.8.2 LegalDocument 자동 생성 규칙
  220: 
  221: P-013 Legal/Policy는 출시 게이트이며 Core가 **표준 템플릿**(개인정보처리방침·이용약관·비급여 안내·환불·민원 처리)을 제공한다.
  222: 
  223: | LegalDocument 필드 | 자동 생성 값 |
  224: |---|---|
  225: | `@id` | 정책 종류별 slug (예: `"privacy"`, `"terms"`) |
  226: | `documentType` | enum 매칭 |
  227: | `title` | 표준 (예: "개인정보처리방침") |
  228: | `body` | Core 표준 템플릿 본문 + **ClinicProfile 변수** (`{{clinic.name}}`·`{{clinic.legalEntityName}}`·`{{clinic.businessRegistrationNumber}}`·`{{clinic.founder}}`) + **LocationProfile(main) 변수** (`{{location.main.email}}`·`{{location.main.address}}`·`{{location.main.telephone}}`) + **Policy 변수** (`{{policy.contactPerson}}`·`{{policy.contactEmail}}`·`{{policy.contactPhone}}`·`{{policy.effectiveDate}}`) — 출처 SoT 준수 |
  229: | `effectiveDate` | 클라이언트 첫 발행 시 명시 입력 또는 발행 일자 |
  230: | `contactPerson` | 개인정보 보호 책임자 등 — 어드민에서 ClinicProfile 폼의 "정책 변수" 보조 섹션에 입력 |
  231: 
  232: **Body 변수 화이트리스트 reference (LL-CASCADE-01 · LOCATION_LEGAL_PLAN v1.0 § 5 SoT)** — 본문 `body` 에 허용된 11개 변수. 등록되지 않은 키는 `renderTemplate` 이 `TemplateRenderError("unknown-variable")` 으로 거부한다.
  233: 
  234: | 영역 | 변수 키 | 출처 |
  235: |---|---|---|
  236: | clinic | `{{clinic.name}}` | ClinicProfile.name |
  237: | clinic | `{{clinic.legalEntityName}}` | ClinicProfile.legalEntityName |
  238: | clinic | `{{clinic.businessRegistrationNumber}}` | ClinicProfile.businessRegistrationNumber |
  239: | clinic | `{{clinic.founder}}` | ClinicProfile.founder |
  240: | location | `{{location.main.address}}` | LocationProfile(main).streetAddress 등 결합 |
  241: | location | `{{location.main.telephone}}` | LocationProfile(main).phone |
  242: | location | `{{location.main.email}}` | LocationProfile(main).email |
  243: | policy | `{{policy.contactPerson}}` | ClinicProfile.policyContactPerson — § 3.8.2 "정책 변수" 보조 섹션 입력 |
  244: | policy | `{{policy.contactEmail}}` | ClinicProfile.policyContactEmail |
  245: | policy | `{{policy.contactPhone}}` | ClinicProfile.policyContactPhone |
  246: | policy | `{{policy.effectiveDate}}` | ClinicProfile.policyEffectiveDate (LegalDocument 별 override 우선) |
  247: 
  248: **어드민 폼 처리**: ClinicProfile 폼에 "정책 변수" 보조 섹션 추가 (개인정보 보호 책임자명·연락처·정책 효력 발생일 등 입력). 별도 화면 추가 아닌 보조 섹션이므로 어드민 화면 수 6개 유지.
  249: 
  250: **법무 검토 (위험도 Low 예외 룰)**:
  251: - LegalDocument는 위험도 기본 Low이지만, **법무 검토 필수**. 표준 위험도 룰(High일 때만 권장)과 별도 예외 게이트.
  252: - 발행 시 ComplianceRecord에 다음을 **모두 기록 필수** (어드민 발행 게이트가 강제):
  253:   - `contentType` = `LegalDocument`
  254:   - `legalCounsel` = 법무 자문자 신원 (필수)
### docs/core/CONTENT_STANDARDS.md
  395: |---|---|---|---|
  396: | Core | C-10 토큰 | — (미지정) | `contentType="Article"` |
  397: | Feature | `"Feature"` (C-10 cascade 1개) | `feature:<slug>` | `contentType="Feature"` + `featureContentType="feature:self-test"` (P-106) |
  398: 
  399: > P-105 ReservationPage는 Core 계약 C-20 — Feature namespace 아님. 본 namespace는 Core 계약 ID 미존재인 Feature 전용.
  400: 
  401: #### 7.1.1.1 ContentType 예외 — LegalDocument 면제 (LL-CASCADE-03 · LOCATION_LEGAL_PLAN v1.0 § 5)
  402: 
  403: LegalDocument(C-16)는 Core 표준 템플릿 + 변수 치환으로 자동 생성되는 정책 문서이므로 일반 콘텐츠 검증 룰이 부합하지 않는다. 다음 영역은 명시적으로 면제한다.
  404: 
  405: | 검증 영역 | LegalDocument 면제 사유 | 대체 보장 |
  406: |---|---|---|
  407: | answer-first AST | 정책 문서는 첫 문장 답 제시 구조가 아니라 조문·항목 구조 | 본문 자체는 법무 검토를 거친 Core 표준 템플릿 (LL-TEMPLATE-04) |
  408: | 표현 검사 (recommend/best 등 광고 표현) | 정책 문서에는 광고 의도가 없음 | 동일 — Core 표준 템플릿 본문 |
  409: | RiskRule 적용 (`riskRules: RiskRule[]`) | 정책 문서는 위험도 자동 추론 대상이 아님 | `risk_level='Low'` CHECK + 법무 검토 별도 게이트 (RISK_LEVELS § 4.3 의료법 광고 룰 우회) |
  410: | RiskInference (`inferredRiskLevel`) | 위와 동일 | DB CHECK `risk_level='Low'` 강제 (LL-SCHEMA-06) |
  411: 
  412: **변수 화이트리스트 검증은 별도 룰**: LegalDocument body 안 `{{...}}` 변수는 Core 측 `renderTemplate` 가 strict whitelist (11개 변수)로 검증하며 (LL-ACTION-12), unknown key 는 build-time test (`packages/core-content/src/templates/__tests__.ts`) 와 server action runtime 양쪽에서 차단한다. compliance-assistant Feature 의 검증 input 으로 LegalDocument 를 보내지 않는 것이 본 면제의 운영적 결정이며, compliance-assistant 의 `check()` 진입 자체를 운영 단계에서 차단한다.
  413: 
  414: **ComplianceRecord 발행 게이트는 면제 아님**: LegalDocument 도 발행 단계에서 ComplianceRecord (`legalCounsel`/`legalCounselAt` 필수 · admin/ARCHITECTURE § 3.8.2) 가 별도로 요구된다. 본 절은 자동 검수 룰의 면제일 뿐 법무 검토 게이트는 그대로 유지.
  415: 
### docs/decisions/LOCATION_LEGAL_PLAN.md
  420: // ... terms, non-covered, refund, complaint
  421: ```
  422: 
  423: **결정**:
  424: - (LL-ACTION-18 · cycle2 LL-32 + cycle3 LL-43 patch) tx commit 후 7 row **순차 emit + per-row try/catch + 누락 시 fallback audit emit + 최종 안전망 3단계**:
  425:   - 정상: 7 row 차례로 INSERT (Promise.all 아닌 sequential — 1 row 실패 시 stop 아님). 각 row try/catch.
  426:   - 실패 row 발생 시 끝에 단일 `content-saved-partial` audit row INSERT — payload `{outcome: "partial", emitted: [<contentTypes>], failed: [<contentTypes>], reason: <error.code>}`. 운영 포렌식 안전망.
  427:   - 모든 7 row 실패 시 `content-saved-failed` audit row 1건.
  428:   - **3단계 안전망 (cycle3 LL-43 + cycle4 LL-55 patch — Sentry pre-integration fallback 명시)**:
  429:     - **v0.5 단계 (Sentry SDK 미통합 · LL-DEFER-18 합류 전)**: (1) per-row try/catch + console.error → server stdout (Vercel logs / Cloud Run logs). (2) partial/failed row INSERT 시도 → 실패해도 server stdout. (3) partial/failed row INSERT 자체 실패 시 server stdout만 (Sentry 미통합 상태 명시). 사용자 return state 는 `{ ok: true }` 유지 (save 성공이 우선 · audit 누락만 운영 팀 stdout 추적).
  430:     - **M0 v1.0 (LL-DEFER-18 합류 후)**: (3) Sentry capture (INFRA INFR-PROV `Sentry` Provider 통합) + breadcrumb 으로 (1)/(2) 단계의 console.error 도 함께 캡처. 사용자 return state 동일.
  494: ## 6. 환경·precondition
  495: 
  496: - `WEB_DATABASE_URL` · `SEED_DATABASE_URL` 변경 없음.
  497: - **Migration 의존성 순서 (cycle2 LL-37 patch)**:
  498:   1. `packages/db/migrations/D0010_instance.sql` (instance table) — precondition
  499:   2. `packages/core-content/migrations/C0001_clinic_profile.sql` (clinic_profile) — precondition
  500:   3. `packages/core-content/migrations/C0002_location_profile.sql` (location_profile) — precondition
  501:   4. `packages/core-content/migrations/C0004_treatment_page.sql` (content_publication_status enum 생성) — **C0006 의 precondition**
  502:   5. `packages/core-content/migrations/C0005_article.sql` (risk_level enum 생성) — **C0006 의 precondition**
  503:   6. `packages/core-content/migrations/C0006_legal_document.sql` — legal_document table (status::content_publication_status + risk_level::risk_level FK)
  504:   7. `packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql` — clinic_profile ALTER (policy_* + primary_ctas)
  505:   8. `packages/core-content/migrations/C0008_location_profile_parent_clinic.sql` — location_profile ALTER (clinic_profile_id composite FK)
  506: - 부분 적용 환경에서 C0006 을 C0004/C0005 보다 먼저 시도하면 enum 없음 에러 — migration runner 가 sequential apply 보장.
  547: - `LL-DEFER-01`: LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제 · review-queued 전이 + ComplianceRecord pre-publish + NotificationEvent envelope · status=published). compliance-assistant Feature + ComplianceRecord UI cascade.
  548: - `LL-DEFER-09`: LegalDocument 편집 권한 분리 (operator-edit-legal ActionType — REVIEW_WORKFLOW 14 ActionType cascade).
  549: - `LL-DEFER-11`: LegalDocument body 검증 — CONTENT_STANDARDS § 7 ContentType 예외 marker cascade (LL-CASCADE-03). 추가 검증 룰은 compliance-assistant Feature.
  550: - `LL-DEFER-15` (cycle2 LL-29 patch): location_profile 의 main slug 1 row 강제 DB trigger 또는 partial unique with `clinic_profile_id` 기반 cascade — v0.4 은 server action assertHasMainLocationAfterTx 안전망. M0 v1.0 본 구현에서 DB-level invariant 합류.
  551: - `LL-DEFER-18` (cycle3 LL-43 + cycle5 LL-58 patch): Sentry SDK 통합 (INFRA INFR-PROV `Sentry` Provider). audit partial/failed row INSERT 실패 시 capture 채널. **SDK 초기화 위치 및 wrapping 책임 = `apps/web/src/lib/observability.ts` (Sentry init + `captureException` / `addBreadcrumb` helper)** — server action / route handler 가 console.error 대신 observability helper 호출. M0 v1.0 본 구현 (provider 통합 시점).
  552: - `LL-DEFER-20` (cycle4 LL-53 patch): packages/migrations-runner 실 runner 코드 — manifest spec 작성 (plan v1.0 acceptance precondition) 후 sequential apply + fail-fast 구현. M0 v1.0 본 구현.
  553: 
  554: ### 9.2 M1 Phase Alpha 합류
  555: 
  556: - `LL-DEFER-02`: 정책 개정 이력 (`revisions[]`) UI.
  557: - `LL-DEFER-03`: LegalDocument 수동 작성 모드 (autoGenerated=false · Markdown 에디터).
  558: - `LL-DEFER-06`: LegalDocument body 수동 override · `body_source` enum cascade.
  559: - `LL-DEFER-07`: latitude/longitude 지도 pinpoint.
  560: - `LL-DEFER-10`: 템플릿 major 버전 변경 시 운영자 수동 확인.
  561: - `LL-DEFER-12`: `cookie`/`other` documentType UI (manual 입력 + custom template).
  562: - `LL-DEFER-13`: custom (`documentType=other`) template_version namespace 규약.
  563: - `LL-DEFER-16` (cycle2 LL-30 patch): form (b) 에 receptionHours + specialClosures (공휴일/임시 휴진) UI 추가.
  564: - `LL-DEFER-19` (cycle4 LL-50 + cycle5 LL-57 patch — phase 단일화): primaryCtas UI subset 확장 — CT-03 11종 중 phone/kakao-talk/naver-reservation 외 8종 (`email`/`sms`/`kakao-channel`/`naver-talk`/`form`/`map`/`external`/`video-consultation`) 의 UI 입력. M0 v0.5 의 3종 subset 으로 1호 클라이언트 출시 가능 — 추가 8종은 M1.
  565: 
  566: ### 9.3 M0 v1.0 본 구현 합류 (LocationProfile 편집 화면 cascade · cycle4 LL-52 patch)
  567: 
  568: > **§1.3 비범위 vs §9.3 phase 정합 정정 (cycle4 LL-52)**: LL-DEFER-04/05 의 합류 시점은 LocationProfile 편집 화면 (M0 v1.0 본 구현). M2 Phase Beta 합류로 표시했던 v0.4 까지의 표기는 §1.3 비범위 표 ("LocationProfile 편집 화면 합류 시점") 와 충돌. v0.5 에서 통일.
  569: 
  570: - `LL-DEFER-04`: reservationChannels 풀세트 (LocationProfile 편집 화면 + 지점별 override). **M0 v1.0 본 구현 합류**.
  571: - `LL-DEFER-05`: representativeDoctors · doctorsAtLocation · availableTreatments ref 입력 UI (다지점 합류 시점). **M0 v1.0 본 구현 합류** (단지점도 LocationProfile 편집 화면에서 입력).
  572: 
  573: ### 9.3.1 M2 Phase Beta 합류 (다지점 + 외부 사용자 RBAC)
  574: 
  575: - (현재 비어 있음 — 다지점 UI 자체는 M0 v1.0 본 구현. M2 Phase Beta 는 외부 사용자 RBAC · 풀 권한 모델.)
  576: 
  577: ### 9.4 Migration / 운영 cascade (시점 무관 · 조건부)
  578: 
  579: - `LL-DEFER-14` (cycle2 LL-28 patch): location_profile.clinic_profile_id NOT NULL data migration — 기존 row 존재 시 backfill 정책. v0.4 skeleton 가정은 row 없음.
  580: - `LL-DEFER-17` (cycle2 LL-36 patch): cookie/other 가 closed type 으로 승격 시 partial unique index DROP + 새 7종 partial unique CREATE — migration cascade marker.
  581: 
  582: ### 9.5 Closed (이전 cycle 에서 합류 완료)
  583: 
  584: - ~~`LL-DEFER-08`~~: cycle1 LL-15 patch — 5종 LegalDocument 별 effectiveDate override 합류 완료 (v0.2 acceptance).
  585: 
  586: ## 10. Cascade marker (다른 SoT 문서로 전파)
  587: 
  588: > **acceptance 순서 정합 (cycle2 LL-33)**: LL-CASCADE-01 은 plan v1.0 acceptance 와 **동시 또는 직전** 에 ARCH patch 적용 (plan acceptance commit 안 포함). LL-CASCADE-02 · LL-CASCADE-03 · LL-CASCADE-04 도 동일 정책. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
  589: 
  590: - `LL-CASCADE-01`: `docs/admin/ARCHITECTURE.md` § 3.8.2 표 — body 변수 화이트리스트 11개 (clinic 4 + location 3 + policy 4) reference 추가. ARCH v0.8 patch. **acceptance precondition**.
  591: - `LL-CASCADE-02`: `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` § 5.5 audit matrix — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed row 추가. **acceptance precondition**.
  592: - `LL-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표 — LegalDocument 면제 marker 추가 (answer-first AST · 표현 검사 면제 · 변수 화이트리스트 별도 룰). **acceptance precondition**.
  593: - `LL-CASCADE-04` (cycle3 LL-41 + cycle4 LL-49 + **cycle5 LL-56 patch — placeholder 실 파일 작성 완료**): **cascade target 정정** — ADMIN_UI_SKELETON_PLAN § 6 은 walking skeleton 의 actions 영역으로 build/export 부재 → **`docs/decisions/M0_BUILD_EXPORT_PLAN.md` (v0.1 placeholder · 2026-05-16 작성 완료)** + 본 plan 의 LL-CASCADE-04 marker reference. apps/worker · M0 v1.0 Git export 책임: LocationProfile.reservationChannels Git 출력 시 `clinic_profile.primary_ctas` deep clone, LocationProfile.@id = `"main"`, LocationProfile.parentClinic = ClinicProfile.@id reference, ClinicProfile.locations[] = SELECT 결과, primary_ctas DB key `id` → Git output `@id` alias 변환. **acceptance 강도 = placeholder 작성 완료** (`docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 1.2 LL-CASCADE-04 책임 표 명시). 실 구현은 M0 v1.0 본 구현.
  594: - `LL-CASCADE-05` (cycle3 LL-42 + cycle4 LL-53 patch): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장. **acceptance 강도 명시** — plan v1.0 acceptance 는 **manifest spec 작성까지만 차단** (manifest 파일 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` 의 spec 작성 + 본 plan 의 8단계 의존성 표 cascade). 실 runner 코드 구현은 M0 v1.0 cascade (LL-DEFER-20 신설). 즉 plan v1.0 acceptance ≠ runner 코드 acceptance.

codex
검증 결과, cycle 1 코드 패치 자체는 대부분 수렴했습니다. 다만 두 군데는 “패치가 코드에는 들어갔지만 plan SoT가 따라오지 않은” 문서/manifest 정합성 이슈로 보입니다. 최종 답변에는 severity와 라인 근거를 분리해 적겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-ChildItem -Force | Select-Object Name,Mode; if(Test-Path package.json){ Get-Content package.json }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$files=@('"'packages/migrations-runner/package.json','apps/web/package.json'); foreach("'$f in $files){ if(Test-Path $f){ Write-Output "### $f"; Get-Content $f }}' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$f='"'docs/decisions/LOCATION_LEGAL_PLAN.md'; "'$i=1; Get-Content $f | ForEach-Object { if($_ -match '"'LL-DEFER-21|Forbidden|forbidden|403|unauthorized'){ '{0,5}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
 succeeded in 604ms:
  517: | 15 | Tenant B 세션이 `/A/clinic-profile` 접근 | 403 (membership 부재) |

 succeeded in 616ms:
### packages/migrations-runner/package.json
{
  "name": "@glitzy/migrations-runner",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" }
  },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc --noEmit -p tsconfig.json"
  },
  "dependencies": {
    "@glitzy/db": "workspace:*",
    "@glitzy/shared-errors": "workspace:*",
    "@glitzy/shared-types": "workspace:*",
    "postgres": "^3.4.5"
  },
  "devDependencies": {
    "typescript": "^5.7.3"
  }
}
### apps/web/package.json
{
  "name": "@glitzy/web",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit -p tsconfig.json",
    "seed": "tsx --env-file=.env src/seed.ts"
  },
  "dependencies": {
    "@glitzy/auth": "workspace:*",
    "@glitzy/core-content": "workspace:*",
    "@glitzy/db": "workspace:*",
    "@glitzy/shared-errors": "workspace:*",
    "@glitzy/shared-types": "workspace:*",
    "drizzle-orm": "^0.36.4",
    "next": "^14.2.0",
    "postgres": "^3.4.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "cheerio": "^1.0.0",
    "ipaddr.js": "^2.2.0",
    "undici": "^6.21.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^22.10.5",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "tsx": "^4.19.2",
    "typescript": "^5.7.3"
  }
}

 succeeded in 625ms:

[32;1mName                        [0m[32;1m Mode[0m
[32;1m----                        [0m [32;1m----[0m
.agents                      d----
.claude                      d----
.codex-reviews               d----
.pnpm-store                  d----
apps                         d----
docs                         d----
handoff                      d----
node_modules                 d----
packages                     d----
.codex-critic-prompt-code.md -a---
.codex-critic-prompt.md      -a---
.gitignore                   -a---
.npmrc                       -a---
package.json                 -a---
pnpm-lock.yaml               -a---
pnpm-workspace.yaml          -a---
skills-lock.json             -a---
tsconfig.base.json           -a---
{
  "name": "website-exposure",
  "version": "0.1.0",
  "private": true,
  "description": "Glitzy 의료기관 웹사이트 노출 솔루션 — monorepo root",
  "engines": {
    "node": ">=20.10.0",
    "pnpm": ">=10.0.0"
  },
  "scripts": {
    "pkg:build": "pnpm --filter @glitzy/shared-types build && pnpm --filter @glitzy/shared-errors build && pnpm --filter @glitzy/db build && pnpm --filter @glitzy/auth build && pnpm --filter @glitzy/storage build && pnpm --filter @glitzy/notifications-outbox build && pnpm --filter @glitzy/migrations-runner build && pnpm --filter @glitzy/core-content build",
    "pkg:typecheck": "pnpm pkg:build && pnpm --filter @glitzy/shared-types typecheck && pnpm --filter @glitzy/shared-errors typecheck && pnpm --filter @glitzy/db typecheck && pnpm --filter @glitzy/auth typecheck && pnpm --filter @glitzy/storage typecheck && pnpm --filter @glitzy/notifications-outbox typecheck && pnpm --filter @glitzy/migrations-runner typecheck && pnpm --filter @glitzy/core-content typecheck",
    "web:dev": "pnpm --filter @glitzy/web dev",
    "web:build": "pnpm --filter @glitzy/web build",
    "web:seed": "pnpm --filter @glitzy/web seed",
    "typecheck:all": "pnpm pkg:typecheck && pnpm --filter @glitzy/web typecheck",
    "build:all": "pnpm pkg:build && pnpm --filter @glitzy/web build",
    "spike-a": "pnpm --filter @glitzy/spike-a",
    "spike-a:up": "pnpm --filter @glitzy/spike-a up",
    "spike-a:down": "pnpm --filter @glitzy/spike-a down",
    "spike-a:migrate": "pnpm --filter @glitzy/spike-a migrate",
    "spike-a:seed": "pnpm --filter @glitzy/spike-a seed",
    "spike-a:all": "pnpm --filter @glitzy/spike-a scenario:all",
    "spike-b": "pnpm --filter @glitzy/spike-b",
    "spike-b:up": "pnpm --filter @glitzy/spike-b up",
    "spike-b:down": "pnpm --filter @glitzy/spike-b down",
    "spike-b:migrate": "pnpm --filter @glitzy/spike-b migrate",
    "spike-b:seed": "pnpm --filter @glitzy/spike-b seed",
    "spike-b:all": "pnpm --filter @glitzy/spike-b scenario:all",
    "spike-c": "pnpm --filter @glitzy/spike-c-local",
    "spike-c:up": "pnpm --filter @glitzy/spike-c-local up",
    "spike-c:down": "pnpm --filter @glitzy/spike-c-local down",
    "spike-c:seed": "pnpm --filter @glitzy/spike-c-local seed",
    "spike-c:all": "pnpm --filter @glitzy/spike-c-local scenario:all",
    "spike-d": "pnpm --filter @glitzy/spike-d",
    "spike-d:up": "pnpm --filter @glitzy/spike-d up",
    "spike-d:down": "pnpm --filter @glitzy/spike-d down",
    "spike-d:migrate": "pnpm --filter @glitzy/spike-d migrate:dev",
    "spike-d:all": "pnpm --filter @glitzy/spike-d scenario:all",
    "spike-e": "pnpm --filter @glitzy/spike-e",
    "spike-e:up": "pnpm --filter @glitzy/spike-e up",
    "spike-e:down": "pnpm --filter @glitzy/spike-e down",
    "spike-e:migrate": "pnpm --filter @glitzy/spike-e migrate",
    "spike-e:seed": "pnpm --filter @glitzy/spike-e seed",
    "spike-e:all": "pnpm --filter @glitzy/spike-e scenario:all"
  },
  "packageManager": "pnpm@10.28.2"
}


exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$files=@('"'packages/core-content/src/index.ts','packages/core-content/tsconfig.json','apps/web/tsconfig.json'); foreach("'$f in $files){ if(Test-Path $f){ Write-Output "### $f"; $i=1; Get-Content $f | ForEach-Object { '"'{0,5}: {1}' -f "'$i++, $_ } }}' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$f='"'docs/decisions/ADMIN_UI_SKELETON_PLAN.md'; "'$i=1; Get-Content $f | ForEach-Object { if($i -ge 365 -and $i -le 377){ '"'{0,5}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$f='"'docs/decisions/M0_BUILD_EXPORT_PLAN.md'; "'$i=1; Get-Content $f | ForEach-Object { if($i -ge 20 -and $i -le 35){ '"'{0,5}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
 succeeded in 602ms:
  365: | eventType | 테이블 | emit 위치 |
  366: |---|---|---|
  367: | `magic-link-issued` | audit_event | apps/web /sign-in Server Action |
  368: | `magic-link-consumed` · `magic-link-rejected` | audit_event | apps/web /sign-in/consume Route Handler |
  369: | `session-created` · `session-revoked` | audit_event | /sign-in/consume · /sign-out Route Handler |
  370: | `session-revoked-anonymous` (cycle3 ADMIN-UI-51 · cycle6 matrix 추가 ADMIN-UI-90) | audit_event | /sign-out — tampered/expired cookie 분기 (getActiveSession throw 시) · payload.reason = `AuthDenyReason` (`session-signature-invalid` · `session-expired` · `session-not-found`) · actorUserId NULL |
  371: | `tenant-resolved` · `tenant-resolve-denied` · `inactive-user-rejected` | audit_event | packages/auth.resolveTenantContext 자동 |
  372: | `content-saved` | audit_event | apps/web 의 save 액션 (ClinicProfile + 3 entity — tx commit 후 best-effort) · payload shape `{contentType, slug, mode, status, originalSlug}` 통일 (cycle2-3entity WEB-28) · ClinicProfile 한정 추가 필드 `updatedAtBefore/After` (single-row 동시 저장 race 분석용 · 3-entity N-row 추가는 M0 v1.0 cascade marker · cycle4-3entity WEB-47) |
  373: | `content-saved` (contentType=`LocationProfile`·`LegalDocument`) — LL-CASCADE-02 patch | audit_event | apps/web 의 ClinicProfile save 액션 (LOCATION_LEGAL_PLAN v1.0) — 3계약 동시 저장 시 LocationProfile 1 row + LegalDocument 5 row (closed 5종) 별도 emit. LocationProfile payload `{contentType:"LocationProfile", slug:"main", mode, status:null, originalSlug:"main", updatedAtBefore/After}`. LegalDocument payload `{contentType:"LegalDocument", slug, mode, status:"draft", originalSlug, documentType, templateVersion}` |
  374: | `content-saved-partial` (LL-CASCADE-02 patch) | audit_event | apps/web ClinicProfile save 액션 — 7 row sequential emit 중 일부 실패 시 fallback. payload `{outcome:"partial", emitted:[], failed:[], reason, failedDetails:[{target, code, name, message}]}` (LL-ACTION-18) |
  375: | `content-saved-failed` (LL-CASCADE-02 patch) | audit_event | apps/web ClinicProfile save 액션 — 7 row 모두 실패 시 fallback. payload `{outcome:"failed", emitted:[], failed:[], reason, failedDetails:[{target, code, name, message}]}` |
  376: | `content-deleted` (cycle3-3entity WEB-43 추가) | audit_event | apps/web 의 delete 액션 (DoctorProfile · TreatmentPage · Article — tx commit 후 best-effort) · payload `{contentType, slug}` |
  377: | `session-cookie-cleared` (cycle2-3entity WEB-30 신규) | audit_event | `/sign-in/cleanup` route — cookie 존재 시에만 emit · payload.reason = `AuthDenyReason` |

 succeeded in 599ms:
   20: - `instance_id` 별 별도 git working tree (또는 단일 git repo 안 `instances/<instanceSlug>/` subtree).
   21: 
   22: ### 1.2 LL-CASCADE-04 책임 (LOCATION_LEGAL_PLAN v1.0 cascade)
   23: 
   24: | 변환 | DB source | Git output |
   25: |---|---|---|
   26: | ClinicProfile `@id` | `clinic_profile.slug` (보통 `clinic`) | `@id: clinic` |
   27: | ClinicProfile `locations[]` | `SELECT id FROM location_profile WHERE clinic_profile_id = ? ORDER BY slug` | `locations: [<ref to LocationProfile.@id>]` (1개 이상 — main 필수) |
   28: | LocationProfile `@id` | `location_profile.slug` (보통 `main`) | `@id: main` |
   29: | LocationProfile `parentClinic` | `clinic_profile.slug` (composite FK target) | `parentClinic: clinic` |
   30: | LocationProfile `reservationChannels` | `clinic_profile.primary_ctas` deep clone (main 자동 상속 · cycle1 LL-02 SoT) | `reservationChannels: [...]` |
   31: | LocationProfile `businessHours` | `location_profile.metadata.businessHours` (CT-02 SoT 형식 그대로) | `businessHours: {...}` |
   32: | primary_ctas / reservationChannels element key | DB `id` | Git `@id` (alias 변환) |
   33: | LegalDocument body | `legal_document.body` (rendered Markdown · 변수 치환 완료) | `<documentType>.md` 본문 |
   34: | LegalDocument metadata | documentType · title · effective_date · template_version · contact_person · contact_email | frontmatter YAML |
   35: 

 succeeded in 622ms:
### packages/core-content/src/index.ts
    1: // @glitzy/core-content — M0 vertical slice schema + templates (v0.3·LOCATION_LEGAL_PLAN v1.0)
    2: 
    3: export {
    4:   instance,
    5:   contentPublicationStatusEnum,
    6:   riskLevelEnum,
    7:   legalDocumentTypeEnum,
    8:   clinicProfile,
    9:   locationProfile,
   10:   doctorProfile,
   11:   treatmentPage,
   12:   article,
   13:   legalDocument,
   14: } from "./schema.js";
   15: 
   16: export {
   17:   TEMPLATES,
   18:   CLOSED_DOCUMENT_TYPES,
   19:   CLOSED_DOCUMENT_TYPES_ALPHA,
   20:   renderTemplate,
   21:   listTemplateVariables,
   22:   TemplateRenderError,
   23: } from "./templates/index.js";
   24: 
   25: export type {
   26:   ClosedLegalDocumentType,
   27:   LegalDocumentType,
   28:   Template,
   29:   RenderContext,
   30: } from "./templates/index.js";
### packages/core-content/tsconfig.json
    1: {
    2:   "extends": "../../tsconfig.base.json",
    3:   "compilerOptions": {
    4:     "outDir": "dist",
    5:     "rootDir": "src",
    6:     "composite": true
    7:   },
    8:   "include": ["src/**/*.ts"],
    9:   "references": [
   10:     { "path": "../shared-errors" },
   11:     { "path": "../shared-types" },
   12:     { "path": "../db" }
   13:   ]
   14: }
### apps/web/tsconfig.json
    1: {
    2:   "extends": "../../tsconfig.base.json",
    3:   "compilerOptions": {
    4:     "lib": ["ES2022", "DOM", "DOM.Iterable"],
    5:     "jsx": "preserve",
    6:     "allowJs": false,
    7:     "noEmit": true,
    8:     "incremental": true,
    9:     "plugins": [{ "name": "next" }],
   10:     "paths": {
   11:       "@/*": ["./src/*"]
   12:     }
   13:   },
   14:   "include": ["next-env.d.ts", "src/**/*.ts", "src/**/*.tsx", ".next/types/**/*.ts"],
   15:   "exclude": ["node_modules", ".next"]
   16: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$f='"'packages/core-content/src/schema.ts'; "'$i=1; Get-Content $f | ForEach-Object { if($i -ge 300 -and $i -le 356){ '"'{0,5}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
 succeeded in 571ms:
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "legalDocument|effectiveDate|effective_date|legal_document_instance_5type_unique|CURRENT_TIMESTAMP|legal_document" packages/core-content/src/schema.ts' in C:\Users\assag\solution\website-exposure
 succeeded in 518ms:
3:// v0.3: + legal_document (C-16) + clinic_profile policy/primary_ctas (C0007) + location_profile.clinic_profile_id (C0008)
39:// LL-SCHEMA-01: legal_document_type (DATA_MODEL C-16 SoT 7종)
40:export const legalDocumentTypeEnum = pgEnum("legal_document_type", [
67:    policyEffectiveDate: date("policy_effective_date"),
250:export const legalDocument = pgTable(
251:  "legal_document",
256:    documentType: legalDocumentTypeEnum("document_type").notNull(),
261:    // LLC-11 patch: DB DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Seoul')::date — raw SQL 에서 적용. Drizzle 은 default 표현 불가 → migration SoT.
262:    effectiveDate: date("effective_date").notNull(),
274:    slugRegex: check("legal_document_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
275:    titleLen: check("legal_document_title_length", sql`length(${t.title}) BETWEEN 1 AND 100`),
276:    bodyLen: check("legal_document_body_length", sql`length(${t.body}) BETWEEN 1 AND 200000`),
277:    emailRegex: check("legal_document_email_regex", sql`${t.contactEmail} IS NULL OR ${t.contactEmail} ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'`),
279:    templateVersionFormat: check("legal_document_template_version_format", sql`${t.templateVersion} IS NULL OR ${t.templateVersion} ~ '^[a-z0-9-]+@[0-9]+\\.[0-9]+\\.[0-9]+$'`),
280:    autoGenTemplateVer: check("legal_document_auto_generated_template_ver", sql`(${t.autoGenerated} = false) OR (${t.templateVersion} IS NOT NULL)`),
282:    statusSkeletonLimit: check("legal_document_status_skeleton_limit", sql`${t.status} = 'draft'`),
283:    publishedAtNull: check("legal_document_published_at_null", sql`${t.publishedAt} IS NULL`),
285:    riskLevelSkeletonLimit: check("legal_document_risk_level_skeleton_limit", sql`${t.riskLevel} = 'Low'`),
286:    instanceSlugUnique: unique("legal_document_instance_slug_unique").on(t.instanceId, t.slug),
287:    instanceIdUnique: unique("legal_document_instance_id_unique").on(t.instanceId, t.id),
289:    type5Unique: uniqueIndex("legal_document_instance_5type_unique")
292:    instanceIdx: index("legal_document_instance_idx").on(t.instanceId),

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$f='"'packages/core-content/src/schema.ts'; "'$i=1; Get-Content $f | ForEach-Object { if($i -ge 250 -and $i -le 293){ '"'{0,5}: {1}' -f "'$i, $_ }; $i++ }' in C:\Users\assag\solution\website-exposure
 succeeded in 526ms:
  250: export const legalDocument = pgTable(
  251:   "legal_document",
  252:   {
  253:     id: uuid("id").primaryKey().defaultRandom(),
  254:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
  255:     slug: text("slug").notNull(),
  256:     documentType: legalDocumentTypeEnum("document_type").notNull(),
  257:     title: text("title").notNull(),
  258:     body: text("body").notNull(),
  259:     autoGenerated: boolean("auto_generated").notNull().default(true),
  260:     templateVersion: text("template_version"),
  261:     // LLC-11 patch: DB DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Seoul')::date — raw SQL 에서 적용. Drizzle 은 default 표현 불가 → migration SoT.
  262:     effectiveDate: date("effective_date").notNull(),
  263:     lastRevisedDate: date("last_revised_date"),
  264:     contactPerson: text("contact_person"),
  265:     contactEmail: text("contact_email"),
  266:     status: contentPublicationStatusEnum("status").notNull().default("draft"),
  267:     riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
  268:     publishedAt: timestamp("published_at", { withTimezone: true }),
  269:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
  270:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  271:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  272:   },
  273:   (t) => ({
  274:     slugRegex: check("legal_document_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
  275:     titleLen: check("legal_document_title_length", sql`length(${t.title}) BETWEEN 1 AND 100`),
  276:     bodyLen: check("legal_document_body_length", sql`length(${t.body}) BETWEEN 1 AND 200000`),
  277:     emailRegex: check("legal_document_email_regex", sql`${t.contactEmail} IS NULL OR ${t.contactEmail} ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'`),
  278:     // LL-SCHEMA-05 + cycle1 LL-22
  279:     templateVersionFormat: check("legal_document_template_version_format", sql`${t.templateVersion} IS NULL OR ${t.templateVersion} ~ '^[a-z0-9-]+@[0-9]+\\.[0-9]+\\.[0-9]+$'`),
  280:     autoGenTemplateVer: check("legal_document_auto_generated_template_ver", sql`(${t.autoGenerated} = false) OR (${t.templateVersion} IS NOT NULL)`),
  281:     // LL-SCHEMA-03 + cycle1 LL-03·19: skeleton 단계 status='draft' 만
  282:     statusSkeletonLimit: check("legal_document_status_skeleton_limit", sql`${t.status} = 'draft'`),
  283:     publishedAtNull: check("legal_document_published_at_null", sql`${t.publishedAt} IS NULL`),
  284:     // LL-SCHEMA-06 + cycle1 LL-12: risk_level 'Low' 만
  285:     riskLevelSkeletonLimit: check("legal_document_risk_level_skeleton_limit", sql`${t.riskLevel} = 'Low'`),
  286:     instanceSlugUnique: unique("legal_document_instance_slug_unique").on(t.instanceId, t.slug),
  287:     instanceIdUnique: unique("legal_document_instance_id_unique").on(t.instanceId, t.id),
  288:     // LL-SCHEMA-02 + cycle1 LL-08·09: closed 5종 partial UNIQUE (cookie/other 미강제)
  289:     type5Unique: uniqueIndex("legal_document_instance_5type_unique")
  290:       .on(t.instanceId, t.documentType)
  291:       .where(sql`${t.documentType} IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint')`),
  292:     instanceIdx: index("legal_document_instance_idx").on(t.instanceId),
  293:   }),

codex
마지막으로 컴파일 관점에서 새 타입 회귀가 있는지 확인하겠습니다. 전체 빌드는 비용이 커서 우선 변경 영향이 큰 `core-content`, `migrations-runner`, `web` typecheck를 순서대로 실행합니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'pnpm --filter @glitzy/core-content typecheck' in C:\Users\assag\solution\website-exposure
 succeeded in 1932ms:

> @glitzy/core-content@0.1.0 typecheck C:\Users\assag\solution\website-exposure\packages\core-content
> tsc --noEmit -p tsconfig.json


exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'pnpm --filter @glitzy/migrations-runner typecheck' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'pnpm --filter @glitzy/web typecheck' in C:\Users\assag\solution\website-exposure
 succeeded in 1160ms:

> @glitzy/migrations-runner@0.1.0 typecheck C:\Users\assag\solution\website-exposure\packages\migrations-runner
> tsc --noEmit -p tsconfig.json


 succeeded in 2729ms:

> @glitzy/web@0.1.0 typecheck C:\Users\assag\solution\website-exposure\apps\web
> tsc --noEmit -p tsconfig.json


codex
# LOCATION_LEGAL code v1.0 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=0 major=2 minor=1 (총 3)
- closeableAfterPatch: false
- 수렴 추세 추적: cycle1=14 (4+8+2) → cycle2=3 (0+2+1)

## cycle 1 patch 검증
- LLC-01: PASS — ARCH §3.8.2에 11개 변수 화이트리스트 보존됨: [docs/admin/ARCHITECTURE.md:232](C:/Users/assag/solution/website-exposure/docs/admin/ARCHITECTURE.md:232), [docs/admin/ARCHITECTURE.md:236](C:/Users/assag/solution/website-exposure/docs/admin/ARCHITECTURE.md:236)-[246].
- LLC-02: PASS — audit matrix 4 row 추가 보존: [docs/decisions/ADMIN_UI_SKELETON_PLAN.md:373](C:/Users/assag/solution/website-exposure/docs/decisions/ADMIN_UI_SKELETON_PLAN.md:373)-[375].
- LLC-03: PASS — CONTENT_STANDARDS §7.1.1.1 LegalDocument 면제 표가 적절한 위치에 있음: [docs/core/CONTENT_STANDARDS.md:401](C:/Users/assag/solution/website-exposure/docs/core/CONTENT_STANDARDS.md:401)-[414].
- LLC-04: PASS with caveat — `manifest.ts`는 생성됐고 `validateManifest()`는 이전 `creates` 기준 dependsOn 검증을 수행함: [packages/migrations-runner/src/manifest.ts:26](C:/Users/assag/solution/website-exposure/packages/migrations-runner/src/manifest.ts:26)-[121]. 다만 plan §6 8단계와 manifest 9단계 불일치는 새 finding LLC-15.
- LLC-05: PASS — doc별 `effectiveDate` 산출 후 같은 값으로 body render와 DB insert를 수행함: [actions.ts:279](C:/Users/assag/solution/website-exposure/apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts:279)-[287], [actions.ts:303](C:/Users/assag/solution/website-exposure/apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts:303)-[304].
- LLC-06: PASS — Postgres partial unique conflict target 문법은 `ON CONFLICT (instance_id, document_type) WHERE ... DO UPDATE`로 정확함: [actions.ts:310](C:/Users/assag/solution/website-exposure/apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts:310)-[312]. 대응 index도 동일 predicate: [C0006_legal_document.sql:53](C:/Users/assag/solution/website-exposure/packages/core-content/migrations/C0006_legal_document.sql:53)-[56].
- LLC-07: PASS — build script에 template test gate 연결됨: [packages/core-content/package.json:12](C:/Users/assag/solution/website-exposure/packages/core-content/package.json:12).
- LLC-08: PASS — businessHours `aria-controls`/`aria-expanded`/`aria-describedby`/`role="alert"`와 LegalDocument details group 적용됨: [ClinicProfileForm.tsx:326](C:/Users/assag/solution/website-exposure/apps/web/src/components/forms/ClinicProfileForm.tsx:326)-[350], [ClinicProfileForm.tsx:398](C:/Users/assag/solution/website-exposure/apps/web/src/components/forms/ClinicProfileForm.tsx:398)-[399], [ClinicProfileForm.tsx:460](C:/Users/assag/solution/website-exposure/apps/web/src/components/forms/ClinicProfileForm.tsx:460)-[463].
- LLC-09: PASS — `failedDetails[]`와 `reason`이 JSON 직렬화 가능한 string/null scalar 구조로 보존됨: [actions.ts:357](C:/Users/assag/solution/website-exposure/apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts:357)-[388], [actions.ts:407](C:/Users/assag/solution/website-exposure/apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts:407)-[413].
- LLC-10: PASS — DB CHECK, Drizzle, errors.ts 매핑 모두 존재: [C0002_location_profile.sql:29](C:/Users/assag/solution/website-exposure/packages/core-content/migrations/C0002_location_profile.sql:29)-[33], [schema.ts:120](C:/Users/assag/solution/website-exposure/packages/core-content/src/schema.ts:120)-[121], [errors.ts:57](C:/Users/assag/solution/website-exposure/apps/web/src/lib/errors.ts:57)-[58].
- LLC-11: PASS — Postgres 13+ 호환 `DEFAULT ((CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Seoul')::date)` 적용됨: [C0006_legal_document.sql:18](C:/Users/assag/solution/website-exposure/packages/core-content/migrations/C0006_legal_document.sql:18)-[20]. Drizzle에는 raw SQL SoT 주석 있음: [schema.ts:261](C:/Users/assag/solution/website-exposure/packages/core-content/src/schema.ts:261)-[262].
- LLC-12: PARTIAL — `ForbiddenAccessPage` server component 렌더 자체는 OK: [page.tsx:127](C:/Users/assag/solution/website-exposure/apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/page.tsx:127)-[148]. 그러나 plan은 여전히 시나리오 15를 HTTP `403`으로 요구하고, 코드 주석의 `LL-DEFER-21`은 plan에 없음. 새 finding LLC-16.
- LLC-13: PASS — C0008 preflight/backfill/fail-fast 주석 보존: [C0008_location_profile_parent_clinic.sql:8](C:/Users/assag/solution/website-exposure/packages/core-content/migrations/C0008_location_profile_parent_clinic.sql:8)-[18].
- LLC-14: PASS — Drizzle deferrable 미지원 및 raw SQL SoT 책임 marker 보존: [schema.ts:122](C:/Users/assag/solution/website-exposure/packages/core-content/src/schema.ts:122)-[128].

## new blocking / major / minor
### LLC-15 — major — plan §6 8단계와 manifest 9단계가 SoT 불일치
`manifest.ts`는 C0003 doctor_profile을 명시적으로 추가해 9-step 순서를 구성합니다: [packages/migrations-runner/src/manifest.ts:22](C:/Users/assag/solution/website-exposure/packages/migrations-runner/src/manifest.ts:22)-[24], [manifest.ts:48](C:/Users/assag/solution/website-exposure/packages/migrations-runner/src/manifest.ts:48)-[68]. 이 자체는 `C0005_article`의 `doctor_profile` FK 의존성 때문에 타당합니다.

하지만 plan §6은 여전히 8단계로 C0003을 생략합니다: [docs/decisions/LOCATION_LEGAL_PLAN.md:497](C:/Users/assag/solution/website-exposure/docs/decisions/LOCATION_LEGAL_PLAN.md:497)-[505]. 또한 LL-CASCADE-05도 “본 plan 의 8단계 의존성 표 cascade”라고 못박고 있습니다: [LOCATION_LEGAL_PLAN.md:594](C:/Users/assag/solution/website-exposure/docs/decisions/LOCATION_LEGAL_PLAN.md:594). plan SoT를 9단계로 갱신하거나, C0003 보강이 manifest-only 의도임을 plan에 명시해야 합니다.

### LLC-16 — major — LL-DEFER-21이 코드에만 있고 plan SoT에 없음; 403 acceptance도 불일치
`page.tsx`는 Next 14에서 정확한 HTTP 403 status를 설정할 수 없어 Next 15 `unauthorized()/forbidden()`으로 defer한다고 주석화했습니다: [page.tsx:117](C:/Users/assag/solution/website-exposure/apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/page.tsx:117)-[125]. 실제 구현은 forbidden UI를 반환합니다: [page.tsx:145](C:/Users/assag/solution/website-exposure/apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/page.tsx:145)-[148], [page.tsx:242](C:/Users/assag/solution/website-exposure/apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/page.tsx:242)-[248].

반면 plan acceptance 시나리오는 여전히 Tenant B 접근을 `403`으로 요구합니다: [LOCATION_LEGAL_PLAN.md:517](C:/Users/assag/solution/website-exposure/docs/decisions/LOCATION_LEGAL_PLAN.md:517). `LL-DEFER-21`은 plan 본문 검색상 존재하지 않습니다. plan에 “v1.0은 forbidden UI/deny UX, 정확한 HTTP 403은 LL-DEFER-21”로 반영하거나, 코드가 실제 403을 보장하는 경로로 바뀌어야 합니다.

### LLC-17 — minor — plan의 fallback audit payload 설명이 `failedDetails[]`를 반영하지 않음
코드는 fallback payload에 `reason`과 `failedDetails`를 모두 넣습니다: [actions.ts:397](C:/Users/assag/solution/website-exposure/apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts:397)-[413]. ADMIN_UI matrix도 이를 반영합니다: [ADMIN_UI_SKELETON_PLAN.md:374](C:/Users/assag/solution/website-exposure/docs/decisions/ADMIN_UI_SKELETON_PLAN.md:374)-[375].

하지만 LOCATION_LEGAL_PLAN §4.4는 아직 payload를 `{outcome, emitted, failed, reason}`까지만 설명합니다: [LOCATION_LEGAL_PLAN.md:423](C:/Users/assag/solution/website-exposure/docs/decisions/LOCATION_LEGAL_PLAN.md:423)-[430]. plan SoT에도 `failedDetails:[{target, code, name, message}]`를 반영하는 문서 패치가 필요합니다.

## acceptance precondition (LL-CASCADE-01~05) 재점검
- LL-CASCADE-01: PASS
- LL-CASCADE-02: PASS
- LL-CASCADE-03: PASS
- LL-CASCADE-04: PASS
- LL-CASCADE-05: PARTIAL — manifest spec은 있음. 다만 plan 8단계 vs manifest 9단계 불일치 때문에 LLC-15 패치 전 close 불가.

검증 실행:
- `pnpm --filter @glitzy/core-content typecheck` PASS
- `pnpm --filter @glitzy/migrations-runner typecheck` PASS
- `pnpm --filter @glitzy/web typecheck` PASS
tokens used
88,405
# LOCATION_LEGAL code v1.0 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=0 major=2 minor=1 (총 3)
- closeableAfterPatch: false
- 수렴 추세 추적: cycle1=14 (4+8+2) → cycle2=3 (0+2+1)

## cycle 1 patch 검증
- LLC-01: PASS — ARCH §3.8.2에 11개 변수 화이트리스트 보존됨: [docs/admin/ARCHITECTURE.md:232](C:/Users/assag/solution/website-exposure/docs/admin/ARCHITECTURE.md:232), [docs/admin/ARCHITECTURE.md:236](C:/Users/assag/solution/website-exposure/docs/admin/ARCHITECTURE.md:236)-[246].
- LLC-02: PASS — audit matrix 4 row 추가 보존: [docs/decisions/ADMIN_UI_SKELETON_PLAN.md:373](C:/Users/assag/solution/website-exposure/docs/decisions/ADMIN_UI_SKELETON_PLAN.md:373)-[375].
- LLC-03: PASS — CONTENT_STANDARDS §7.1.1.1 LegalDocument 면제 표가 적절한 위치에 있음: [docs/core/CONTENT_STANDARDS.md:401](C:/Users/assag/solution/website-exposure/docs/core/CONTENT_STANDARDS.md:401)-[414].
- LLC-04: PASS with caveat — `manifest.ts`는 생성됐고 `validateManifest()`는 이전 `creates` 기준 dependsOn 검증을 수행함: [packages/migrations-runner/src/manifest.ts:26](C:/Users/assag/solution/website-exposure/packages/migrations-runner/src/manifest.ts:26)-[121]. 다만 plan §6 8단계와 manifest 9단계 불일치는 새 finding LLC-15.
- LLC-05: PASS — doc별 `effectiveDate` 산출 후 같은 값으로 body render와 DB insert를 수행함: [actions.ts:279](C:/Users/assag/solution/website-exposure/apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts:279)-[287], [actions.ts:303](C:/Users/assag/solution/website-exposure/apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts:303)-[304].
- LLC-06: PASS — Postgres partial unique conflict target 문법은 `ON CONFLICT (instance_id, document_type) WHERE ... DO UPDATE`로 정확함: [actions.ts:310](C:/Users/assag/solution/website-exposure/apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts:310)-[312]. 대응 index도 동일 predicate: [C0006_legal_document.sql:53](C:/Users/assag/solution/website-exposure/packages/core-content/migrations/C0006_legal_document.sql:53)-[56].
- LLC-07: PASS — build script에 template test gate 연결됨: [packages/core-content/package.json:12](C:/Users/assag/solution/website-exposure/packages/core-content/package.json:12).
- LLC-08: PASS — businessHours `aria-controls`/`aria-expanded`/`aria-describedby`/`role="alert"`와 LegalDocument details group 적용됨: [ClinicProfileForm.tsx:326](C:/Users/assag/solution/website-exposure/apps/web/src/components/forms/ClinicProfileForm.tsx:326)-[350], [ClinicProfileForm.tsx:398](C:/Users/assag/solution/website-exposure/apps/web/src/components/forms/ClinicProfileForm.tsx:398)-[399], [ClinicProfileForm.tsx:460](C:/Users/assag/solution/website-exposure/apps/web/src/components/forms/ClinicProfileForm.tsx:460)-[463].
- LLC-09: PASS — `failedDetails[]`와 `reason`이 JSON 직렬화 가능한 string/null scalar 구조로 보존됨: [actions.ts:357](C:/Users/assag/solution/website-exposure/apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts:357)-[388], [actions.ts:407](C:/Users/assag/solution/website-exposure/apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts:407)-[413].
- LLC-10: PASS — DB CHECK, Drizzle, errors.ts 매핑 모두 존재: [C0002_location_profile.sql:29](C:/Users/assag/solution/website-exposure/packages/core-content/migrations/C0002_location_profile.sql:29)-[33], [schema.ts:120](C:/Users/assag/solution/website-exposure/packages/core-content/src/schema.ts:120)-[121], [errors.ts:57](C:/Users/assag/solution/website-exposure/apps/web/src/lib/errors.ts:57)-[58].
- LLC-11: PASS — Postgres 13+ 호환 `DEFAULT ((CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Seoul')::date)` 적용됨: [C0006_legal_document.sql:18](C:/Users/assag/solution/website-exposure/packages/core-content/migrations/C0006_legal_document.sql:18)-[20]. Drizzle에는 raw SQL SoT 주석 있음: [schema.ts:261](C:/Users/assag/solution/website-exposure/packages/core-content/src/schema.ts:261)-[262].
- LLC-12: PARTIAL — `ForbiddenAccessPage` server component 렌더 자체는 OK: [page.tsx:127](C:/Users/assag/solution/website-exposure/apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/page.tsx:127)-[148]. 그러나 plan은 여전히 시나리오 15를 HTTP `403`으로 요구하고, 코드 주석의 `LL-DEFER-21`은 plan에 없음. 새 finding LLC-16.
- LLC-13: PASS — C0008 preflight/backfill/fail-fast 주석 보존: [C0008_location_profile_parent_clinic.sql:8](C:/Users/assag/solution/website-exposure/packages/core-content/migrations/C0008_location_profile_parent_clinic.sql:8)-[18].
- LLC-14: PASS — Drizzle deferrable 미지원 및 raw SQL SoT 책임 marker 보존: [schema.ts:122](C:/Users/assag/solution/website-exposure/packages/core-content/src/schema.ts:122)-[128].

## new blocking / major / minor
### LLC-15 — major — plan §6 8단계와 manifest 9단계가 SoT 불일치
`manifest.ts`는 C0003 doctor_profile을 명시적으로 추가해 9-step 순서를 구성합니다: [packages/migrations-runner/src/manifest.ts:22](C:/Users/assag/solution/website-exposure/packages/migrations-runner/src/manifest.ts:22)-[24], [manifest.ts:48](C:/Users/assag/solution/website-exposure/packages/migrations-runner/src/manifest.ts:48)-[68]. 이 자체는 `C0005_article`의 `doctor_profile` FK 의존성 때문에 타당합니다.

하지만 plan §6은 여전히 8단계로 C0003을 생략합니다: [docs/decisions/LOCATION_LEGAL_PLAN.md:497](C:/Users/assag/solution/website-exposure/docs/decisions/LOCATION_LEGAL_PLAN.md:497)-[505]. 또한 LL-CASCADE-05도 “본 plan 의 8단계 의존성 표 cascade”라고 못박고 있습니다: [LOCATION_LEGAL_PLAN.md:594](C:/Users/assag/solution/website-exposure/docs/decisions/LOCATION_LEGAL_PLAN.md:594). plan SoT를 9단계로 갱신하거나, C0003 보강이 manifest-only 의도임을 plan에 명시해야 합니다.

### LLC-16 — major — LL-DEFER-21이 코드에만 있고 plan SoT에 없음; 403 acceptance도 불일치
`page.tsx`는 Next 14에서 정확한 HTTP 403 status를 설정할 수 없어 Next 15 `unauthorized()/forbidden()`으로 defer한다고 주석화했습니다: [page.tsx:117](C:/Users/assag/solution/website-exposure/apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/page.tsx:117)-[125]. 실제 구현은 forbidden UI를 반환합니다: [page.tsx:145](C:/Users/assag/solution/website-exposure/apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/page.tsx:145)-[148], [page.tsx:242](C:/Users/assag/solution/website-exposure/apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/page.tsx:242)-[248].

반면 plan acceptance 시나리오는 여전히 Tenant B 접근을 `403`으로 요구합니다: [LOCATION_LEGAL_PLAN.md:517](C:/Users/assag/solution/website-exposure/docs/decisions/LOCATION_LEGAL_PLAN.md:517). `LL-DEFER-21`은 plan 본문 검색상 존재하지 않습니다. plan에 “v1.0은 forbidden UI/deny UX, 정확한 HTTP 403은 LL-DEFER-21”로 반영하거나, 코드가 실제 403을 보장하는 경로로 바뀌어야 합니다.

### LLC-17 — minor — plan의 fallback audit payload 설명이 `failedDetails[]`를 반영하지 않음
코드는 fallback payload에 `reason`과 `failedDetails`를 모두 넣습니다: [actions.ts:397](C:/Users/assag/solution/website-exposure/apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts:397)-[413]. ADMIN_UI matrix도 이를 반영합니다: [ADMIN_UI_SKELETON_PLAN.md:374](C:/Users/assag/solution/website-exposure/docs/decisions/ADMIN_UI_SKELETON_PLAN.md:374)-[375].

하지만 LOCATION_LEGAL_PLAN §4.4는 아직 payload를 `{outcome, emitted, failed, reason}`까지만 설명합니다: [LOCATION_LEGAL_PLAN.md:423](C:/Users/assag/solution/website-exposure/docs/decisions/LOCATION_LEGAL_PLAN.md:423)-[430]. plan SoT에도 `failedDetails:[{target, code, name, message}]`를 반영하는 문서 패치가 필요합니다.

## acceptance precondition (LL-CASCADE-01~05) 재점검
- LL-CASCADE-01: PASS
- LL-CASCADE-02: PASS
- LL-CASCADE-03: PASS
- LL-CASCADE-04: PASS
- LL-CASCADE-05: PARTIAL — manifest spec은 있음. 다만 plan 8단계 vs manifest 9단계 불일치 때문에 LLC-15 패치 전 close 불가.

검증 실행:
- `pnpm --filter @glitzy/core-content typecheck` PASS
- `pnpm --filter @glitzy/migrations-runner typecheck` PASS
- `pnpm --filter @glitzy/web typecheck` PASS
