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
session id: 019e3b62-6d8f-7a32-af4b-a7c62ed15aef
--------
user
Review **LL-WORKFLOW-INTEGRATION** code 통합 — **cycle 1**. compliance-assistant M0 + 4 entity workflow integration 직후 LegalDocument 5종 통합. clinic-profile 화면 안 5 LegalDocument workflow 동시 다룸.

## SoT
- `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v1.0 § 5.2 CA-UI-02 / § 6 CA-ACTION
- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — 3계약 통합 form 안 5 LegalDocument 동시 처리
- `apps/web/src/components/forms/WorkflowActionButtons.tsx` (재사용)

## 변경 파일

### apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile/page.tsx
- `LegalWorkflowRow` 타입 신설 + legalWorkflowRows 조회 (slug · status 추가)
- `legalWorkflow` state 추출 (initial vs legalWorkflow 분리 return)
- ClinicProfileForm 하단에 **별도 section** — 5 LegalDocument 의 WorkflowActionButtons 5개 mount
- 정렬: privacy → terms → non-covered → refund → complaint (alpha 또는 LOCATION_LEGAL § 5 SoT 순서)
- 각 row: label (개인정보처리방침 · 이용약관 · 비급여 진료 안내 · 환불 정책 · 고충처리 방침) + slug + WorkflowActionButtons (contentType="LegalDocument")

### apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile/actions.ts
- `legalAfter` RETURNING 안 `status::text AS current_status` 추가
- `auditEntries.push({ ..., status: legal.current_status })` — hard-coded "draft" → DB current status (form 변조 회피 · CAMC-12 정합)

## What to check (cycle 1)

### Plan SoT 합치
- CA-UI-03 액션 버튼 노출 — 5 LegalDocument 각각 WorkflowActionButtons + 정렬 / label 정합
- LegalDocument upsert 시 INSERT 'draft' hard-coded + UPDATE 안 status 미수정 (workflow action 만 status 전이)
- CAMC-12 audit current status — INSERT 시 'draft' 보장 · UPDATE 시 DB current status 사용

### 정합성 / 보안 / 원자성
- WorkflowActionButtons 5개 mount — contentType="LegalDocument" · contentRef = template.slug (privacy/terms/...)
- saveClinicProfile 안 5 LegalDocument upsert 동안 alpha sort lock 순서 유지 (race 안전)
- ClinicProfileForm 안 LegalDocument 본문 필드 (effectiveDate override 만) — status 입력 부재 (어차피 LegalDocument 본문은 auto-generated)
- 5 LegalDocument의 partial UNIQUE (instance_id, document_type) 정합 — 동일 type 의 second row 없음
- LegalDocument 의 slug ↔ template.slug 정합 (privacy → privacy · terms → terms · ...)

### 사용자 흐름
- clinic-profile 화면 진입 시 5 LegalDocument row 없으면 workflow section 안 보임 (legalWorkflow=[])
- 운영자가 ClinicProfile 첫 저장 시 5 LegalDocument 자동 INSERT (status='draft') → page reload 후 workflow section 표시
- 각 LegalDocument 별 검수 요청 → /review-queue 큐 진입 → 검수자 approve (legal role · LegalCounsel slot 채움)
- legal slot 채움 + AND 게이트 충족 → publishable → 운영자 publish → published

### docs cascade · LL-DEFER-01 부분 해소
- LL-DEFER-01 (LegalDocument 발행 게이트 · ComplianceRecord legalCounsel/legalCounselAt required): ✅ 해소
- NotificationEvent envelope: CA-DEFER-14 잔재 (별 cycle)

## Output (한국어 · 간결)

```
# LEGALDOC_WORKFLOW_INTEGRATION code v1.0 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세 추적: (이전 cycle 없음 — 본 cycle 이 첫)

## blocking
## major
## minor

## acceptance precondition 점검
- 5 LegalDocument WorkflowActionButtons mount: <PASS|FAIL>
- LegalDocument INSERT 'draft' + UPDATE 안 status 미수정: <PASS|FAIL>
- audit current status (CAMC-12 정합): <PASS|FAIL>
- LL-DEFER-01 부분 해소 marker: <PASS|FAIL>
```

가능한 한 광범위하게 보고, file:line 인용. 한국어 응답.

codex
리뷰 요청으로 보고 코드 변경분과 SoT 문서를 먼저 대조하겠습니다. `seo-geo`는 검색 최적화 작업이 아니라 이번 턴에는 사용하지 않습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'git status --short' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "LegalWorkflowRow|legalWorkflowRows|WorkflowActionButtons|legalAfter|current_status|LegalDocument|LL-DEFER-01|CA-UI-02|CA-UI-03|CAMC-12|CA-ACTION|LOCATION_LEGAL" apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile docs/decisions apps/web/src/components/forms/WorkflowActionButtons.tsx' in C:\Users\assag\solution\website-exposure
 succeeded in 592ms:
 M .claude/scheduled_tasks.lock
 M apps/spike-a/package.json
 M apps/spike-a/pgbouncer/userlist.txt
 M apps/web/.env.example
 M apps/web/package.json
 D apps/web/src/app/(admin)/[instanceSlug]/articles/[slug]/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/articles/actions.ts
 D apps/web/src/app/(admin)/[instanceSlug]/articles/new/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/articles/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/doctors/[slug]/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/doctors/actions.ts
 D apps/web/src/app/(admin)/[instanceSlug]/doctors/new/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/doctors/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/treatments/[slug]/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/treatments/actions.ts
 D apps/web/src/app/(admin)/[instanceSlug]/treatments/new/page.tsx
 D apps/web/src/app/(admin)/[instanceSlug]/treatments/page.tsx
 M apps/web/src/app/layout.tsx
 M apps/web/src/app/page.tsx
 M apps/web/src/app/sign-in/consume/route.ts
 M apps/web/src/components/forms/ArticleForm.tsx
 M apps/web/src/components/forms/TreatmentPageForm.tsx
 M apps/web/src/lib/env.ts
 M apps/web/src/seed.ts
 M apps/web/src/styles/globals.css
 M apps/web/tailwind.config.ts
 M docs/core/DATA_MODEL.md
 M docs/core/PAGE_TYPES.md
 M docs/core/SCHEMA_MAPPING.md
 M docs/decisions/M0_BUILD_EXPORT_PLAN.md
 M packages/core-content/src/index.ts
 M pnpm-lock.yaml
?? apps/web/scripts/admin-qa-token.ts
?? apps/web/scripts/seed-fixture-eat.sql
?? apps/web/scripts/seed-fixture.sql
?? apps/web/scripts/site-scenarios.md
?? apps/web/src/app/(admin)/admin/
?? apps/web/src/app/(site)/
?? apps/web/src/components/forms/ArticleCategoryForm.tsx
?? apps/web/src/components/forms/ClinicProfileForm.tsx
?? apps/web/src/components/forms/FaqForm.tsx
?? apps/web/src/components/forms/MediaAppearanceForm.tsx
?? apps/web/src/components/forms/PublicationForm.tsx
?? apps/web/src/components/forms/ReviewEntryActionForm.tsx
?? apps/web/src/components/forms/WorkflowActionButtons.tsx
?? apps/web/src/components/site/
?? apps/web/src/lib/compliance/
?? apps/web/src/lib/db-projection.test.ts
?? apps/web/src/lib/db-projection.ts
?? apps/web/src/lib/eat-content-schema.ts
?? apps/web/src/lib/errors.ts
?? apps/web/src/lib/json-ld/
?? apps/web/src/lib/markdown.test.ts
?? apps/web/src/lib/markdown.ts
?? apps/web/src/lib/public-db.ts
?? apps/web/src/lib/public-tenant.ts
?? apps/web/src/lib/site-initial.ts
?? apps/web/src/lib/site-metadata.test.ts
?? apps/web/src/lib/site-metadata.ts
?? apps/web/src/lib/site-url.ts
?? apps/web/vitest.config.ts
?? docs/admin/ARCHITECTURE.md
?? docs/core/CONTENT_STANDARDS.md
?? docs/decisions/ADMIN_UI_SKELETON_PLAN.md
?? docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md
?? docs/decisions/EAT_CONTENT_PLAN.md
?? docs/decisions/LOCATION_LEGAL_PLAN.md
?? docs/decisions/PUBLIC_SITE_RENDER_PLAN.md
?? handoff/PROJECT_OVERVIEW.md
?? handoff/codex-reviews/
?? packages/core-content/migrations/C0002_location_profile.sql
?? packages/core-content/migrations/C0006_legal_document.sql
?? packages/core-content/migrations/C0008_location_profile_parent_clinic.sql
?? packages/core-content/migrations/C0009_article_category.sql
?? packages/core-content/migrations/C0010_publication.sql
?? packages/core-content/migrations/C0011_media_appearance.sql
?? packages/core-content/migrations/C0012_faq.sql
?? packages/core-content/migrations/C0013_article_category_fk.sql
?? packages/core-content/migrations/C0014_compliance_record.sql
?? packages/core-content/migrations/C0015_review_queue_entry.sql
?? packages/core-content/migrations/C0016_status_unlock.sql
?? packages/core-content/package.json
?? packages/core-content/src/schema.ts
?? packages/db/migrations/D0011_public_reader.sql
?? packages/db/migrations/D0014_public_reader_eat.sql
?? packages/migrations-runner/src/

2026-05-18T13:59:38.086613Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.8 seconds
Output:
[31;1madmin: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … -03|CAMC-12|CA-ACTION|LOCATION_LEGAL" apps/web/src/app/([36;1madmin[0m)/admin/ …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                           ~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'admin' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

 exited 1 in 793ms:
[31;1madmin: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … -03|CAMC-12|CA-ACTION|LOCATION_LEGAL" apps/web/src/app/([36;1madmin[0m)/admin/ …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                           ~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'admin' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

codex
작업트리가 이미 넓게 변경된 상태라, 요청하신 두 clinic-profile 파일과 관련 컴포넌트/문서만 범위를 좁혀 보겠습니다. PowerShell에서 괄호 경로가 해석되어 검색 명령을 인용해서 다시 실행합니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"LegalWorkflowRow|legalWorkflowRows|WorkflowActionButtons|legalAfter|current_status|LegalDocument|LL-DEFER-01|CA-UI-02|CA-UI-03|CAMC-12|CA-ACTION|LOCATION_LEGAL\" 'apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile' 'docs/decisions' 'apps/web/src/components/forms/WorkflowActionButtons.tsx'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -LiteralPath 'apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile/page.tsx' | Select-Object -First 260" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -LiteralPath 'apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile/actions.ts' | Select-Object -First 320" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -LiteralPath 'apps/web/src/components/forms/WorkflowActionButtons.tsx' | Select-Object -First 260" in C:\Users\assag\solution\website-exposure
 succeeded in 718ms:
apps/web/src/components/forms/WorkflowActionButtons.tsx:1:// @glitzy/web/components/forms/WorkflowActionButtons — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 5.3 CA-UI-03
apps/web/src/components/forms/WorkflowActionButtons.tsx:9:export function WorkflowActionButtons({
docs/decisions\EAT_CONTENT_PLAN.md:7:> **plan v1.0 acceptance commit vs EAT_CONTENT code v1.0 cycle 분리 (cycle 2 ECP-23~30 정정 — LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합)**:
docs/decisions\EAT_CONTENT_PLAN.md:34:- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — LegalDocument 패턴 (status='draft' 단계 + RLS published only) 재사용
docs/decisions\EAT_CONTENT_PLAN.md:64:| C-10 contentType enum cascade (cycle 1 ECP-07 정정) | 기존 enum 15종 + `Publication` + `MediaAppearance` = 17종. FAQ · ArticleCategory · LegalDocument · Feature 는 이미 enum 안 (토큰 그대로 사용 — `FAQ` 대문자) |
docs/decisions\EAT_CONTENT_PLAN.md:68:| status zod enum subset (cycle 1 ECP-10·11 정정) | v0.1 단계 status zod = `z.enum(['draft'])` 만 — compliance-assistant 합류 (EC-DEFER-05) 전까지 모든 4 entity 어드민 폼에서 published 차단. **FAQ 도 published 차단** (위험도 자동 추론 합류 전 Medium/High 자동 발행 회피). LegalDocument 패턴 정합 |
docs/decisions\EAT_CONTENT_PLAN.md:93:| Publication / MediaAppearance 검수 워크플로우 (status='review-queued' 전이 + ComplianceRecord pre-publish) | LL-DEFER-01 patterns 동일 — compliance-assistant + ComplianceRecord 합류 | EC-DEFER-07 |
docs/decisions\EAT_CONTENT_PLAN.md:364:- (EC-SCHEMA-14 · cycle 1 ECP-10·11 정정) v0.1 단계 `status='draft'` + `published_at IS NULL` CHECK 강제 — **published 자체 차단**. compliance-assistant + risk_level 자동 추론 합류 (EC-DEFER-05) 까지. LegalDocument LL-SCHEMA-03·LL-SCHEMA-04 패턴 정합.
docs/decisions\EAT_CONTENT_PLAN.md:400:--   LegalDocument 패턴 정합 (LOCATION_LEGAL § 3.2 PSR-DATA-07).
docs/decisions\EAT_CONTENT_PLAN.md:418:| `ClinicProfile` · `DoctorProfile` · `TreatmentPage` · `MedicalConditionPage` · `Article` · `FAQ` · `ReviewPolicy` · `PricingPage` · `FacilitiesPage` · `NewsItem` · `ReservationPage` · `LocationProfile` · `ArticleCategory` · `LegalDocument` · `Feature` | + `Publication` + `MediaAppearance` |
docs/decisions\EAT_CONTENT_PLAN.md:741:| 2026-05-18 | v0.6 | **Codex 비평 cycle 5 1 major finding 전건 수용 patch — ARCH § 3.8.2 cascade**: (ECP-36) ARCH § 3.8.2 LegalDocument 자동 생성 규칙 "어드민 폼 처리" 안 "어드민 화면 수 6개 유지" 잔재 → "P-013 자체 화면 없음 + M0 어드민 7개 (EAT v0.x cascade)". 누계 cycle 1~5 = 36 findings 전건 수용. closeableAfterPatch=true 신호 (cycle 6 acceptance 신호 검증). |
docs/decisions\EAT_CONTENT_PLAN.md:744:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 8 findings (4 blocking + 4 major + 0 minor) 전건 수용 patch — docs cascade 실 patch 진입**: (ECP-23·24·25·26 blocking 4건 + ECP-27·28·29·30 major 4건) plan 본문 명시한 docs cascade 가 실 patch 안 됨 — plan acceptance commit 안 docs cascade 동시 적용 결정 (LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합). 본 patch 사이클에서 다음 실 적용: (1) DATA_MODEL § 1.1 인벤토리 23 → 25 contracts + C-24 Publication · C-25 MediaAppearance row 추가 + C-12 FAQ M0 ✅ + C-04 Article category required 명시. (2) DATA_MODEL § 4 C-10 contentType enum v0.6 — +Publication +MediaAppearance (17종). (3) DATA_MODEL § 4 C-22 ArticleCategory marker (DB 실 운영 합류 marker + EC-DEFER-10). (4) DATA_MODEL § 4 C-12 FAQ 풀명세 (question 10~200 · answer Markdown 50~2000 · v0.1 DB CHECK draft 만). (5) DATA_MODEL § 4 C-24 Publication 풀명세 (외부 학술 인용 · risk Low fixed). (6) DATA_MODEL § 4 C-25 MediaAppearance 풀명세 (모든 channel_type → VideoObject 단일화 v0.1). (7) PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 페이지 합계 11. (8) SCHEMA_MAPPING § 2 entity 카탈로그 — ScholarlyArticle 추가 · VideoObject MediaAppearance 매핑 추가 · FAQPage EAT v0.x M0 합류 + Answer.text helper marker. (9) CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 — Publication/MediaAppearance 면제 + FAQ Q/A 적용. (10) ARCH § 3.11 게이트 #1 — 11 페이지 + P-011 FAQ 합류. (11) M0_BUILD_EXPORT § 2.2 EAT 4 entity 변환 표. (12) PUBLIC_SITE_RENDER § 9.3 PSR-DEFER-11/15 해소 marker. (13) packages/migrations-runner/src/manifest.ts orderedMigrations 16 entry (C0009/10/11/12/13 + D0014). 코드 cascade (migrations 실 SQL · 어드민 폼 · Article detail SQL JOIN 등) 는 별도 EAT_CONTENT code v1.0 cycle. 누계 cycle 1+2 = 30 findings 전건 수용. |
docs/decisions\ADMIN_UI_SKELETON_PLAN.md:7:> **본 skeleton의 위상 명시**: 이 walking skeleton의 ClinicProfile 폼은 admin/ARCHITECTURE § 3.2 화면 ②의 **완성이 아닌 auth/RLS/form wiring proof**다. 화면 ② 완성은 ClinicProfile + LocationProfile(main) + LegalDocument 3계약 동시 출력을 요구하며 M0 v1.0 본 구현에서 합류한다 (ADMIN-UI-15).
docs/decisions\ADMIN_UI_SKELETON_PLAN.md:53:> **M0 화면 ② 축소판 marker (ADMIN-UI-15)**: skeleton의 ClinicProfile 폼은 single contract(ClinicProfile DB row) 만 저장하며, admin/ARCHITECTURE § 3.2의 "ClinicProfile + LocationProfile(main) + LegalDocument 3계약 동시 출력" 은 M0 v1.0 본 구현에서 합류한다.
docs/decisions\ADMIN_UI_SKELETON_PLAN.md:60:| LegalDocument 자동 생성 (admin/ARCH § 3.8.2) — **skeleton 은 발행/출시 판단 없음**: P-013 Legal/Policy 는 admin/ARCH 의 출시 게이트지만 skeleton 에는 발행 자체가 없으므로 release readiness 의미 없음 (ADMIN-UI-62) | M0 v1.0 |
docs/decisions\ADMIN_UI_SKELETON_PLAN.md:373:| `content-saved` (contentType=`LocationProfile`·`LegalDocument`) — LL-CASCADE-02 patch | audit_event | apps/web 의 ClinicProfile save 액션 (LOCATION_LEGAL_PLAN v1.0) — 3계약 동시 저장 시 LocationProfile 1 row + LegalDocument 5 row (closed 5종) 별도 emit. LocationProfile payload `{contentType:"LocationProfile", slug:"main", mode, status:null, originalSlug:"main", updatedAtBefore/After}`. LegalDocument payload `{contentType:"LegalDocument", slug, mode, status:"draft", originalSlug, documentType, templateVersion}` |
docs/decisions\ADMIN_UI_SKELETON_PLAN.md:706:| 2026-05-15 | v0.4 | **cycle3 patch (18 findings · major 12 · minor 6 · nit 0 전건 처리)**: (1) ADMIN-UI-45 § 5.4 audit reason taxonomy vs UI deny reason 분리 명시 — packages/auth audit internal reason 4종(user-not-found · super-admin-not-switched · super-admin-selected-mismatch · membership-not-found-or-inactive) 별도 마커, packages/auth v0.3 normalize cascade, (2) ADMIN-UI-46 peekSessionUserId → getActiveSession 사용으로 § 6.2 정정, (3) ADMIN-UI-47 admin_user upsert 를 withServiceRole(adminUserUpsert) 안에서 수행하도록 § 5.5 matrix 정정, (4) ADMIN-UI-48·58 seed audit_log direct INSERT 제거 → audit_event 사용 (audit_log 의 instance_id NOT NULL 회피) + § 7.1 migration precondition 표 정정, (5) ADMIN-UI-49 § 5.5 audit_log query ORDER BY occurred_at, (6) ADMIN-UI-50 § 5.1 cookie fixed window + DB session sliding window asymmetric refresh 보안 모델 명시, (7) ADMIN-UI-51 § 3.2 sign-out 흐름 getActiveSession → revokeSession → emit + tampered cookie 분기 (session-revoked-anonymous), (8) ADMIN-UI-52 § 12 shared-types cascade 중복 제거 — 선행 precondition 단일화, (9) ADMIN-UI-53 § 7 DATABASE_URL 권한을 'SET ROLE postgres 가능한 admin role' 로 좁힘, (10) ADMIN-UI-54 slug-lookup-not-found 를 audit_event 별도 emit 으로 명시 (slugResolver 책임), (11) ADMIN-UI-55 § 5.4 SignInReason union 별도 정의 (AuthDenyReason + no-active-membership + magic-link-rejected), (12) ADMIN-UI-56 redirect('/404') → notFound(), (13) ADMIN-UI-57 content-saved audit best-effort try/catch + gate happy-path 명시 + transactional outbox cascade marker, (14) ADMIN-UI-59 § 10 W-01~W-07 최종 결정 한 줄씩, (15) ADMIN-UI-60 PACKAGES_STRUCTURE cascade 'verify only' 로 정정, (16) ADMIN-UI-61 § 9 게이트 precondition 명시, (17) ADMIN-UI-62 deferred 표 LegalDocument 행에 'skeleton 은 발행/출시 판단 없음' 안전 문구 추가 |
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:5:> **acceptance commit 구성 (LL-33 / PSR-CASCADE-01 / EC-CASCADE-01 패턴 정합)** — 본 commit 안 docs cascade 동시 포함 marker: (1) 본 plan · (2) CA-CASCADE-01 DATA_MODEL § 4 C-10 ComplianceRecord 풀명세 M0 컬럼 marker (CA-DEFER-13 매핑 표 포함) · (3) CA-CASCADE-02 REVIEW_WORKFLOW M0 활성화 marker (**manual-review 큐 1종**·역할 3종 활성화 — operator/medical/legal · client 미합류) · (4) CA-CASCADE-03 EAT_CONTENT_PLAN § 11 EC-DEFER-07/12 부분 해소 marker (EC-DEFER-05 미해소 · CA-DEFER-01·02 동반) · (5) CA-CASCADE-04 LOCATION_LEGAL_PLAN LL-DEFER-01 발행 게이트 부분 해소 marker (NotificationEvent CA-DEFER-14) · (6) CA-CASCADE-05 manifest **19 단계** (16 + C0014/C0015/C0016) · (7) CA-CASCADE-06 ADMIN_UI_SKELETON / REVIEW_WORKFLOW audit matrix cascade (eventType 4종·payload shape·emit 시점·실패 정책). 실 SQL 코드 cascade 는 별 cycle.
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:13:- `docs/core/CONTENT_STANDARDS.md` § 7 — ComplianceCheckInput · Result 풀 타입. § 7.1.1.1 LegalDocument 면제
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:15:- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — LL-DEFER-01 발행 게이트 부분 해소 대상 (NotificationEvent 분리)
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:28:- **EC-DEFER-07 부분 해소**: 6 entity (Article·TreatmentPage·LegalDocument·FAQ·Publication·MediaAppearance) status='review-queued' 전이 + ComplianceRecord pre-publish 활성화.
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:30:- **LL-DEFER-01 부분 해소**: LegalDocument 발행 게이트 (ComplianceRecord.legalCounsel/legalCounselAt required) 활성화. **NotificationEvent envelope** 부분은 CA-DEFER-14 (notifications Feature 합류 까지).
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:33:- **LegalDocument 자동 검수 면제 (CAM-09 정정, CAM4-01 정정)**: CONTENT_STANDARDS § 7.1.1.1 정합 — LegalDocument 는 check() 호출 자체 우회. `auto_check_result` 슬롯에는 SoT 7 필드만 (automatedDecision='pass' · 모든 finding 카운터 0). `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"` 은 `compliance_record.metadata` 슬롯에 저장 (auto_check_result 안 아님).
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:41:| 6 entity status 전이 활성화 (CAM-19 정정) | LegalDocument · FAQ: DB CHECK skeleton-limit/v01-limit 해제 (실 CHECK 변경). Article · TreatmentPage: 이미 9-state 허용 (기존 schema). Publication · MediaAppearance: **DB CHECK 변경 없음 — form/zod unlock + compliance_record_id ADD COLUMN 만**. content_publication_status enum 9-state 활성화 |
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:45:| AND 게이트 평가 함수 (CAM-16 정정) | finalRoles 계산 — operator + (riskLevel ∈ {Medium, High} ? medical : ∅) + (contentType='LegalDocument' ? legal : ∅) + (priorReviewRequired ? legal : ∅) + **`auto_check_result.requiredApproverRoles[] ?? []`** (unknown role은 fail closed). priorReviewRequired는 M0 v0.1 false fixed |
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:46:| check() stub (CAM-03·04·05·09 정정, CAM3-01 정정) | manualReview only · ruleCatalog 미합류 marker. **반환 타입 = `ComplianceCheckEnvelope`** = `{ result: ComplianceCheckResult, meta: {...} }`. **`result` 안은 CONTENT_STANDARDS § 7.2 SoT 7 필드만** — automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (fail/content-gate/warning/info) · requiredApproverRoles? · findings. summary/catalogVersion/catalogHash/exemptReason 은 `meta` 안. **pageRiskLevel = maxRisk(explicitRiskLevel ?? "Low", inferredRiskLevel ?? "Low", "Low")** (격하 금지). **High 입력 시 가상 finding `m0-stub-risk-level-high-gate` 주입 + gateRequired=true + automatedDecision='gate'**. **LegalDocument 는 submitForReview 안 `check()` 호출 우회 — `buildLegalDocumentExemptEnvelope()` 분리 호출 + meta.exemptReason 저장** |
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:71:| **NotificationEvent envelope** (REVIEW_WORKFLOW § 9.1.1 알림 정책 · LL-DEFER-01 의 알림 부분) | notifications Feature 본 구현 (별 cycle) | CA-DEFER-14 |
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:90:  'ReservationPage', 'LocationProfile', 'ArticleCategory', 'LegalDocument',
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:126:    record_phase <> 'published' OR content_type <> 'LegalDocument'
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:155:- (CAM-10 정정) enum 풀 17종 등록 — DATA_MODEL C-10 v0.6 정합. M0 v0.1 submit 가능 6 entity (Article·TreatmentPage·LegalDocument·FAQ·Publication·MediaAppearance) 는 app layer 의 `ALLOWED_SUBMIT_TYPES` allowlist 가 결정 (transition helper 안 검증).
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:157:- DB CHECK 4건 — published 게이트 의무. operator + Medium/High physician + LegalDocument legal + recordPhase=published 시 publishedAt+publishedBy.
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:236:-- (Step 1) LegalDocument · FAQ CHECK 해제
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:301:-- (4-c) LegalDocument — DB CHECK 가 status='draft' 만 허용했었으므로 published row 없음 (effectively no-op). 안전성 유지.
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:406:- (CAM-19) Publication/MediaAppearance — `compliance_record_id` ADD COLUMN 만 (기존 status DB CHECK 없음 · zod schema/form 안 status enum subset 만 차단). LegalDocument · FAQ 만 DB CHECK 해제.
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:441:  if (contentType === "LegalDocument") roles.add("legal");
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:508:  // (5) LegalDocument 시 legalCounsel·legalCounselAt 둘 다 — finalRoles legal 검증으로 동시 충족 (DB CHECK 도 동일)
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:539:    manualReview: boolean;    // M0 stub = true (operator 수동 검수만). LegalDocument 면제 시 false.
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:540:    exemptReason?: string;    // LegalDocument 면제 시 "LegalDocument-CONTENT_STANDARDS-7.1.1.1"
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:544:// LegalDocument 면제 envelope (CAM2-02 정정): check() 호출 자체 우회.
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:545://   submitForReview 안 contentType==='LegalDocument' 시 check() 진입 안 함 + 본 helper 호출.
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:546:export function buildLegalDocumentExemptEnvelope(input: ComplianceCheckInput): ComplianceCheckEnvelope {
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:562:      exemptReason: "LegalDocument-CONTENT_STANDARDS-7.1.1.1",
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:570:**중요 (CAM2-02)**: `check()` 함수는 LegalDocument 입력 시 호출 자체가 운영적 차단 (CONTENT_STANDARDS § 7.1.1.1). 호출자 (`submitForReview`) 가 contentType==='LegalDocument' 분기에서 `check()` 우회 + `buildLegalDocumentExemptEnvelope()` 호출. `check()` 내부 LegalDocument 분기 제거.
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:577:  // LegalDocument 는 호출자 책임으로 진입 차단 (CONTENT_STANDARDS § 7.1.1.1).
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:578:  //   본 함수가 호출되면 LegalDocument 분기 없음 — 호출자 우회 누락 시 즉시 fail.
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:579:  if (input.contentType === "LegalDocument") {
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:581:      "check() must not be invoked for LegalDocument (CONTENT_STANDARDS § 7.1.1.1). " +
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:582:      "Use buildLegalDocumentExemptEnvelope() instead."
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:636:const envelope = contentType === "LegalDocument"
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:637:  ? buildLegalDocumentExemptEnvelope(input)
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:668:### 5.2 6 entity form status select — read-only display (CA-UI-02) — CAM-18 정정
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:676:### 5.3 entity edit page 안 액션 버튼 (CA-UI-03)
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:685:### 6.1 4 server action 시그니처 (CA-ACTION-01)
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:728:### 6.3 advisory lock (CA-ACTION-02) — CAM-27 정정
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:738:### 6.4 status 전이 table (CA-ACTION-06)
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:763:| 3 | LegalDocument draft → submitForReview → finalRoles={operator, legal} (Low 인데도 legal 필수) · `compliance_record.metadata @> '{"exemptReason":"LegalDocument-CONTENT_STANDARDS-7.1.1.1"}'` | submitForReview 안 check() 우회 → buildLegalDocumentExemptEnvelope() · metadata.exemptReason 저장 (auto_check_result 가 아닌 metadata 슬롯) | vitest |
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:767:| 7 | LegalDocument publish 시 record.legal_counsel IS NULL → DB CHECK `compliance_record_legal_doc_requires_legal` 위반 | published 차단 | e2e |
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:773:| 13 | check() 함수에 contentType='LegalDocument' 입력 시도 → `ComplianceConfigError` throw ("must not be invoked for LegalDocument"). 별도로 `buildLegalDocumentExemptEnvelope(input)` 직접 호출 시 envelope.meta.exemptReason='LegalDocument-...' · manualReview=false | LegalDocument check() 진입 차단 (CAM-09 + CAM3-02) | vitest |
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:792:| 11 | **4 entity** form status read-only display + zod schema 정정 (CWI-01 정정 — status field 제거) | ArticleForm · FaqForm · TreatmentPageForm · PublicationForm · MediaAppearanceForm + eat-content-schema. **LegalDocument 는 별 cycle (LL-WORKFLOW-INTEGRATION marker)** — clinic-profile 통합 form 안 5 LegalDocument 동시 다룸 |
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:797:| 16 | docs cascade — DATA_MODEL C-10 M0 컬럼 marker (CA-CASCADE-01) · REVIEW_WORKFLOW M0 활성화 marker (CA-CASCADE-02) · EC-CASCADE 해소 marker · LL-DEFER-01 부분 해소 marker · audit matrix cascade (CA-CASCADE-06) | doc patches |
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:828:- `CA-CASCADE-04`: `docs/decisions/LOCATION_LEGAL_PLAN.md` LL-DEFER-01 발행 게이트 부분 해소 marker (NotificationEvent CA-DEFER-14)
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:838:| 2026-05-18 | v0.5 | **Codex 자동 비평 cycle 4 1 finding (CAM4-01 = CAM3-02 잔재 정정) 전건 수용 patch**: § 1.1 LegalDocument 면제 항목 안 `auto_check_result 슬롯에 envelope 저장` 표현 정정 → result 슬롯은 SoT 7 필드만 · exemptReason 은 `compliance_record.metadata` 슬롯. 누계 cycle 1~4 = 36 findings 전건 수용. |
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:840:| 2026-05-18 | v0.3 | **Codex 자동 비평 cycle 2 5 finding (blocking 3·major 1·minor 1) 전건 수용 patch**: (CAM2-01) ComplianceCheckResult SoT 정확 — 7 필드만 (automatedDecision · buildBlocked · gateRequired · hasWarnings · findingsBySeverity 4키 (info 포함) · requiredApproverRoles? · findings). summary/catalogVersion/catalogHash/exemptReason 은 envelope.meta 분리. (CAM2-02) LegalDocument check() 호출 자체 우회 — submitForReview 안 contentType==='LegalDocument' 시 buildLegalDocumentExemptEnvelope() 분리 호출. check() 내부 LegalDocument 분기는 fail throw (호출자 누락 검출). (CAM2-03) C0016 sentinel backfill 6 entity 모두 명시 (Article · TreatmentPage · LegalDocument · FAQ · Publication · MediaAppearance) + NULL 잔존 검증 6건 + VALIDATE 6건. (CAM2-04) calculateFinalRoles unknown role throw — silently filter 가 아닌 ComplianceConfigError. evaluatePublishable 안 try/catch → configError 반환. (CAM2-05) 상단 acceptance marker "manual-review 큐 1종" 정정 (cycle 1 patch 안 이미 정정 완료). 누계 cycle 1+2 = 33 findings 전건 수용. |
docs/decisions\COMPLIANCE_ASSISTANT_M0_PLAN.md:841:| 2026-05-18 | v0.2 | **Codex 자동 비평 cycle 1 28 finding (blocking 9·major 12·minor 7) 전건 수용 patch**: (CAM-01) EC-DEFER-05 해소 주장 정정 (EC-DEFER-07/12 부분 해소만, EC-DEFER-05 미해소). (CAM-02) `content-gate` → `manual-review` queue type 변경 + content-gate 자동 큐는 CA-DEFER-15. (CAM-03) ComplianceCheckResult CONTENT_STANDARDS § 7.2 SoT 그대로 반환 + ComplianceCheckEnvelope wrapper 신설. (CAM-04) maxRisk MAX 결합 helper — 격하 금지. (CAM-05) High 입력 가상 finding `m0-stub-risk-level-high-gate` 주입. (CAM-06) evaluatePublishable REVIEW_WORKFLOW § 7.1 6조건 모두 평가 (M0 stub fail closed). (CAM-07) C0016 NOT VALID 패턴 + sentinel ComplianceRecord backfill + VALIDATE 단계 분리. (CAM-08) `published_content_compliance_guard` BEFORE trigger 신설 (record_phase + content_type + content_ref + instance_id 매칭). (CAM-09) LegalDocument check() 우회 + 면제 envelope `exemptReason="LegalDocument-CONTENT_STANDARDS-7.1.1.1"`. (CAM-10) compliance_content_type enum 풀 17종 + M0 active 6 entity allowlist 분리 (app layer). (CAM-11) CA-DEFER-16 신설 — Feature contentType + featureContentType. (CAM-12) CA-DEFER-13 에 mediaThresholdOperationalInput 추가. (CAM-13) cancelled 제거 — open/in-progress/resolved 3종. (CAM-14) compliance_record_id NOT NULL (manual-review). (CAM-15) required_roles approver_role[] enum array. (CAM-16) requiredApproverRoles evaluatePublishable 통합 — unknown fail closed. (CAM-17) approveContent 첫 호출 atomic open→in-progress + review-queued→in-review 전이. (CAM-18) form status select read-only display only — workflow actions 통해서만 전이. (CAM-19) Publication/MediaAppearance — form/zod unlock + compliance_record_id ADD COLUMN 만 (DB CHECK 없음). (CAM-20) audit matrix REVIEW_WORKFLOW § 9.1.1 · ADMIN_UI_SKELETON_PLAN cascade. (CAM-21) CA-DEFER-14 신설 — NotificationEvent envelope. (CAM-22) "역할 3종" 정정. (CAM-23) manifest 19단계. (CAM-24) "6 entity" 정정. (CAM-25) C-08 → C-10 정정. (CAM-26) 표기 규칙 한 줄 명시. (CAM-27) hashtextextended advisory lock key. (CAM-28) 시나리오 13 FAQ JSON-LD scope 분리. CA-DEFER 16종으로 확장. |
docs/decisions\LOCATION_LEGAL_PLAN.md:1:# LocationProfile(main) + LegalDocument 자동 생성 plan (v1.0·acceptance·2026-05-16)
docs/decisions\LOCATION_LEGAL_PLAN.md:5:> **acceptance commit 구성 (cycle2 LL-33 · cycle5 LL-56 acceptance precondition)**: 본 commit 에 다음 5 cascade 동시 포함 — (1) LOCATION_LEGAL_PLAN.md v1.0 (본 문서), (2) LL-CASCADE-01 docs/admin/ARCHITECTURE.md § 3.8.2 patch, (3) LL-CASCADE-02 docs/decisions/ADMIN_UI_SKELETON_PLAN.md § 5.5 patch, (4) LL-CASCADE-03 docs/core/CONTENT_STANDARDS.md § 7 patch, (5) LL-CASCADE-04 docs/decisions/M0_BUILD_EXPORT_PLAN.md v0.1 placeholder (작성 완료). LL-CASCADE-05 (packages/migrations-runner manifest spec) 은 manifest 파일 신설 정도 — 실 runner 코드 acceptance 는 LL-DEFER-20 (M0 v1.0 본 구현).
docs/decisions\LOCATION_LEGAL_PLAN.md:7:본 문서는 `docs/admin/ARCHITECTURE.md` v0.7 § 3.8.1 (LocationProfile(main) 자동 생성 규칙) · § 3.8.2 (LegalDocument 자동 생성 규칙) 을 M0 어드민에서 구현하기 위한 plan이다. ClinicProfile 화면 한 화면에서 **3계약 동시 출력** (`ClinicProfile` + `LocationProfile`(slug=`main`) + `LegalDocument`(5종)) 을 단일 server action transaction 안에서 수행한다.
docs/decisions\LOCATION_LEGAL_PLAN.md:11:> **scope limit (LL-INTRO-01)** — cycle1 LL-03·LL-04 patch: 본 plan 은 LegalDocument **draft 저장만** 다룬다. `review-queued` 도 차단 — 그 전이는 ComplianceRecord pre-publish row + NotificationEvent envelope (REVIEW_WORKFLOW § 5.2 / § 3.1) 발송이 함께 작동해야 한다. 이 둘은 모두 compliance-assistant Feature + ComplianceRecord UI cascade 까지 defer. 본 plan 의 LegalDocument 는 `status='draft'` 강제 (CHECK). 발행 게이트 자체는 LL-DEFER-01.
docs/decisions\LOCATION_LEGAL_PLAN.md:16:- `docs/core/DATA_MODEL.md` v0.9 — C-01 ClinicProfile · C-16 LegalDocument · C-21 LocationProfile · CT-02 BusinessHours · CT-03 CTAConfig
docs/decisions\LOCATION_LEGAL_PLAN.md:18:- `docs/core/CONTENT_STANDARDS.md` v1.3 — cycle1 LL-13 patch: 경로 정정 (admin/CONTENT_STANDARDS 아님). Markdown 본문 검증 (answer-first AST · 표현 검사) 의 LegalDocument 면제 규약 (§ 7 ContentType 예외 표 — LegalDocument 면제 marker).
docs/decisions\LOCATION_LEGAL_PLAN.md:19:- `docs/compliance/RISK_LEVELS.md` v1.1 · `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0 — `LegalDocument: legalCounsel/legalCounselAt required` 의 위험도 Low 예외 게이트 (RL § 4.3)
docs/decisions\LOCATION_LEGAL_PLAN.md:46:| `saveClinicProfile` actions 확장 | 단일 tx 안 ClinicProfile + LocationProfile(main) + 5종 LegalDocument upsert · 변수 치환 · audit 7 row 별도 emit (cycle1 LL-17 patch) |
docs/decisions\LOCATION_LEGAL_PLAN.md:50:| 5종 LegalDocument 별 effective_date input | cycle1 LL-15 patch — LL-DEFER-08 reversal. 5 record 별 individual input · default = policy_effective_date |
docs/decisions\LOCATION_LEGAL_PLAN.md:57:| LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제) · `review-queued` 전이 + ComplianceRecord pre-publish + NotificationEvent | compliance-assistant Feature + ComplianceRecord UI cascade | LL-INTRO-01 / LL-DEFER-01 |
docs/decisions\LOCATION_LEGAL_PLAN.md:58:| LegalDocument `status=published` 발행 자체 | apps/worker + Git commit cascade | LL-DEFER-01 |
docs/decisions\LOCATION_LEGAL_PLAN.md:59:| ClinicProfile 화면의 미리보기 (3계약 합쳐 본 미리보기 페이지) | M0 v1.0 미리보기 화면 | LL-DEFER-01 |
docs/decisions\LOCATION_LEGAL_PLAN.md:62:| LegalDocument 수동 작성 모드 (autoGenerated=false) | M1 Phase Alpha — Markdown 에디터 합류 시점 | LL-DEFER-03 |
docs/decisions\LOCATION_LEGAL_PLAN.md:65:| LegalDocument body 직접 수동 override | M1 Phase Alpha | LL-DEFER-06 |
docs/decisions\LOCATION_LEGAL_PLAN.md:67:| ~~5종 LegalDocument 각각의 effective_date individual override~~ | cycle1 LL-15 patch — **v0.2 에서 합류** (form 에서 5 record 별 input) | (closed) |
docs/decisions\LOCATION_LEGAL_PLAN.md:70:| LegalDocument body 검증 (CONTENT_STANDARDS § 7 ContentType 예외 marker 명시 + 면제 범위 cascade) | cycle1 LL-13 patch — CONTENT_STANDARDS § 7 의 LegalDocument 면제 marker 가 plan SoT cascade. 본 plan 에서 추가 검증 룰 미정의 | LL-DEFER-11 |
docs/decisions\LOCATION_LEGAL_PLAN.md:146:- (LL-SCHEMA-03 · cycle1 LL-03 patch) `status` CHECK `= 'draft'` — skeleton 단계 단일 상태만. `review-queued` 전이는 ComplianceRecord pre-publish row + NotificationEvent 발송과 함께만 작동 (compliance-assistant cascade — LL-DEFER-01).
docs/decisions\LOCATION_LEGAL_PLAN.md:147:- (LL-SCHEMA-04) `published_at` CHECK NULL — 발행 자체가 LL-DEFER-01.
docs/decisions\LOCATION_LEGAL_PLAN.md:230:- (LL-SCHEMA-09) 별도 column (metadata JSONB 가 아닌) — 폼 schema 검증 + LegalDocument 변수 치환의 필수 입력값.
docs/decisions\LOCATION_LEGAL_PLAN.md:232:- (LL-SCHEMA-11 · cycle1 LL-15 patch) `policy_effective_date` 는 form 안 5 LegalDocument record 의 default 만. 운영자가 각 record 별 override 가능 (LL-DEFER-08 closed).
docs/decisions\LOCATION_LEGAL_PLAN.md:308:### 3.1 ClinicProfileForm 3 섹션 + 5 LegalDocument record (LL-FORM-01)
docs/decisions\LOCATION_LEGAL_PLAN.md:315:| **(d) 5종 LegalDocument** (신규 보조 details — cycle1 LL-15 patch) | 5 record 별 effectiveDate override (optional · 미입력 시 policyEffectiveDate default) | `LegalDocument` × 5 |
docs/decisions\LOCATION_LEGAL_PLAN.md:318:- (LL-FORM-02) 한 화면 한 폼 (single `<form action>`) — server action 한 번 호출로 3계약 + 5 LegalDocument 동시 출력. 부분 저장 (섹션별 저장) 안 함.
docs/decisions\LOCATION_LEGAL_PLAN.md:320:- (LL-FORM-04 · cycle1 LL-14 patch) 섹션 (c) 는 LegalDocument 생성에 필수 — policyContactPerson · policyContactEmail · policyContactPhone · policyEffectiveDate **4 필드 모두 required**. (한국 PIPA 의 개인정보 보호책임자 필수 고지 항목 — 소속/부서 같은 추가 필드는 LL-DEFER 또는 자유 입력 textarea 로 처리. v0.2 는 4 필드만 minimal.)
docs/decisions\LOCATION_LEGAL_PLAN.md:323:- (LL-FORM-07 · cycle1 LL-23 + cycle2 LL-35 patch) businessHours UI: 7 요일 행. 각 행: `[휴진 ☐]` + `오픈 [HH:mm] 마감 [HH:mm]` + `[점심 ☐]` + `점심 시작 [HH:mm] 종료 [HH:mm]`. 휴진 checked 시 다른 입력 disabled. **a11y 요구**: 각 row 에 `aria-labelledby` (요일 헤더 link) + 각 input `aria-describedby` (요일 에러 메시지 id) + 휴진 toggle 의 `aria-controls` (해당 row 의 input group id). **5 LegalDocument override details a11y (LL-FORM-14)**: `<details>` `<summary>` 는 기본적으로 keyboard interaction (Space/Enter toggle) + `aria-expanded` 자동. 추가로 `<summary>` 안에 정책 이름 + `(시행일: <date>)` 시각 표시 + `aria-controls` (override 입력 group id) + override 입력에 `aria-labelledby` (summary id) 명시.
docs/decisions\LOCATION_LEGAL_PLAN.md:348:  // cycle1 LL-18 patch: LegalDocument 편집은 skeleton 단계 status=draft + risk_level=Low 의 CHECK 로 제한.
docs/decisions\LOCATION_LEGAL_PLAN.md:360:- (LL-ACTION-02) 3계약 + 5 LegalDocument 모두 같은 tx — RLS 정합 + atomic 출력. 하나 실패 = 전체 rollback.
docs/decisions\LOCATION_LEGAL_PLAN.md:361:- (LL-ACTION-03 · cycle1 LL-17 patch) audit `content-saved` 는 tx commit 후 **7 row 별도 emit** — ClinicProfile 1 + LocationProfile 1 + LegalDocument 5. 각 row 의 payload 는 기존 통일 shape `{contentType, slug, mode, status, originalSlug}`. `ClinicProfileBundle` outer 폐기. analytics/test 호환 보존.
docs/decisions\LOCATION_LEGAL_PLAN.md:364:- (LL-ACTION-06 · cycle1 LL-16 + cycle3 LL-46 patch) **자동 재렌더링 분기 제거** — v0.4 는 LegalDocument 본문 수동 편집 차단 (LL-DEFER-06) 이므로 모든 row 가 templateVersion=current. 매 저장 시 모든 LegalDocument body 재렌더링. **운영자 알림 marker (LL-FORM-15 · 폼 (d) 상단 안내문)**: "본원 정보(기관명·법인명·사업자번호·설립자·본원 주소·전화·이메일) 또는 정책 변수(담당자·이메일·전화·시행일)를 수정하면 5종 정책 문서 본문이 자동으로 다시 생성됩니다. 본문 직접 수정은 추후 단계에서 합류합니다." 향후 수동 override 도입 시 별도 `body_source` enum (`auto`/`manual`) 컬럼 cascade.
docs/decisions\LOCATION_LEGAL_PLAN.md:393:    effectiveDate: string;   // YYYY-MM-DD (LegalDocument 별 override 결과)
docs/decisions\LOCATION_LEGAL_PLAN.md:417:// row 3~7 (5종 LegalDocument)
docs/decisions\LOCATION_LEGAL_PLAN.md:418:{ "eventType": "content-saved", "payload": { "contentType": "LegalDocument",   "slug": "privacy", "mode": "...", "status": "draft", "originalSlug": "privacy",
docs/decisions\LOCATION_LEGAL_PLAN.md:434:- (LL-ACTION-19 · cycle1 LL-17 patch) ADMIN_UI_SKELETON_PLAN § 5.5 audit matrix cascade — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed 별도 row 추가 marker (LL-CASCADE-02). 기존 ClinicProfile row 와 동일 통일 shape.
docs/decisions\LOCATION_LEGAL_PLAN.md:469:export type LegalDocumentType =
docs/decisions\LOCATION_LEGAL_PLAN.md:473:  documentType: LegalDocumentType;
docs/decisions\LOCATION_LEGAL_PLAN.md:492:- (LL-TEMPLATE-07 · cycle1 LL-13 patch) **LegalDocument body 검증 면제 명시** — `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표에 LegalDocument 추가 (cascade marker LL-CASCADE-03). 면제 범위: (1) answer-first AST 미적용 (정책 문서는 첫 문장 답 제시 구조 아님) (2) 표현 검사 (recommend/best 등 광고 표현) 미적용 (3) 변수 화이트리스트 검증은 별도 룰 (LL-ACTION-12).
docs/decisions\LOCATION_LEGAL_PLAN.md:519:| 16 | LegalDocument 행을 `app_tenant_user` 가 `status='published'` 로 UPDATE 시도 | CHECK 위반 → formError ("정책 문서는 현재 단계에서 발행 상태로 변경할 수 없습니다") — cycle1 LL-19 patch |
docs/decisions\LOCATION_LEGAL_PLAN.md:520:| 17 | LegalDocument 같은 documentType (closed 5종) 두 번 INSERT | partial UNIQUE 위반 (LL-SCHEMA-02) |
docs/decisions\LOCATION_LEGAL_PLAN.md:524:| 21 | LegalDocument risk_level='High' UPDATE 시도 | CHECK 위반 (LL-SCHEMA-06) → formError |
docs/decisions\LOCATION_LEGAL_PLAN.md:535:| 5 | zod schema (businessHours · primaryCtas · policy vars · 5 LegalDocument override) | apps/web/src/lib/clinic-profile-schema.ts |
docs/decisions\LOCATION_LEGAL_PLAN.md:536:| 6 | ClinicProfileForm 3 섹션 + 5 LegalDocument record 재구성 (a11y marker 적용) | apps/web/src/components/forms/ClinicProfileForm.tsx |
docs/decisions\LOCATION_LEGAL_PLAN.md:539:| 9 | content-saved audit matrix row 추가 (LocationProfile · LegalDocument) | ADMIN_UI_SKELETON_PLAN § 5.5 cascade marker (LL-CASCADE-02) |
docs/decisions\LOCATION_LEGAL_PLAN.md:541:| 11 | docs/core/CONTENT_STANDARDS.md § 7 LegalDocument 예외 marker 추가 | LL-CASCADE-03 |
docs/decisions\LOCATION_LEGAL_PLAN.md:548:- `LL-DEFER-01`: LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제 · review-queued 전이 + ComplianceRecord pre-publish + NotificationEvent envelope · status=published). compliance-assistant Feature + ComplianceRecord UI cascade.
docs/decisions\LOCATION_LEGAL_PLAN.md:549:- `LL-DEFER-09`: LegalDocument 편집 권한 분리 (operator-edit-legal ActionType — REVIEW_WORKFLOW 14 ActionType cascade).
docs/decisions\LOCATION_LEGAL_PLAN.md:550:- `LL-DEFER-11`: LegalDocument body 검증 — CONTENT_STANDARDS § 7 ContentType 예외 marker cascade (LL-CASCADE-03). 추가 검증 룰은 compliance-assistant Feature.
docs/decisions\LOCATION_LEGAL_PLAN.md:559:- `LL-DEFER-03`: LegalDocument 수동 작성 모드 (autoGenerated=false · Markdown 에디터).
docs/decisions\LOCATION_LEGAL_PLAN.md:560:- `LL-DEFER-06`: LegalDocument body 수동 override · `body_source` enum cascade.
docs/decisions\LOCATION_LEGAL_PLAN.md:586:- ~~`LL-DEFER-08`~~: cycle1 LL-15 patch — 5종 LegalDocument 별 effectiveDate override 합류 완료 (v0.2 acceptance).
docs/decisions\LOCATION_LEGAL_PLAN.md:593:- `LL-CASCADE-02`: `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` § 5.5 audit matrix — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed row 추가. **acceptance precondition**.
docs/decisions\LOCATION_LEGAL_PLAN.md:594:- `LL-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표 — LegalDocument 면제 marker 추가 (answer-first AST · 표현 검사 면제 · 변수 화이트리스트 별도 룰). **acceptance precondition**.
docs/decisions\LOCATION_LEGAL_PLAN.md:604:| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
docs/decisions\M0_BUILD_EXPORT_PLAN.md:3:> **상태**: **v0.1 (placeholder)** — `LOCATION_LEGAL_PLAN.md` v1.0 acceptance 의 LL-CASCADE-04 precondition 으로 신설. 실 plan content 는 M0 v1.0 본 구현 (`apps/worker` build/export 함수) 진입 시점에 합류.
docs/decisions\M0_BUILD_EXPORT_PLAN.md:11:- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.0 — LL-CASCADE-04 책임 명시 (본 문서 의 cascade target)
docs/decisions\M0_BUILD_EXPORT_PLAN.md:22:### 1.2 LL-CASCADE-04 책임 (LOCATION_LEGAL_PLAN v1.0 cascade)
docs/decisions\M0_BUILD_EXPORT_PLAN.md:33:| LegalDocument body | `legal_document.body` (rendered Markdown · 변수 치환 완료) | `<documentType>.md` 본문 |
docs/decisions\M0_BUILD_EXPORT_PLAN.md:34:| LegalDocument metadata | documentType · title · effective_date · template_version · contact_person · contact_email | frontmatter YAML |
docs/decisions\M0_BUILD_EXPORT_PLAN.md:92:| 2026-05-16 | v0.1 | LOCATION_LEGAL_PLAN v1.0 acceptance precondition 으로 placeholder 신설. LL-CASCADE-04 책임 명시 (ClinicProfile.locations / LocationProfile.parentClinic·reservationChannels / primary_ctas `id` → `@id` alias). |
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile\actions.ts:1:// @glitzy/web/(admin)/[instanceSlug]/clinic-profile/actions — LOCATION_LEGAL_PLAN v1.0 § 4
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile\actions.ts:2:// 3계약 동시 출력: ClinicProfile + LocationProfile(slug=main) + 5종 LegalDocument
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile\actions.ts:6://   LL-ACTION-06 (cycle1 LL-16 + cycle3 LL-46): 매 저장 시 5종 LegalDocument body 재렌더링 (수동 편집 차단)
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile\actions.ts:60:  contentType: "ClinicProfile" | "LocationProfile" | "LegalDocument";
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile\actions.ts:119:    // 3. tx 안 3계약 + 5 LegalDocument upsert
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile\actions.ts:253:        // === (c) 5종 LegalDocument UPSERT (변수 치환 + alpha sort 잠금 순서) ===
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile\actions.ts:292:          const legalAfter = await tx<{ id: string; inserted: boolean; current_status: string }[]>`
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile\actions.ts:323:            RETURNING id, (xmax = 0) AS inserted, status::text AS current_status
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile\actions.ts:325:          const legal = legalAfter[0]!;
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile\actions.ts:328:            contentType: "LegalDocument",
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile\actions.ts:331:            // LL-WORKFLOW-INTEGRATION (CAMC-12 정합): form/UPSERT 안 status 는 'draft' hard-coded (insert) · 미수정 (update).
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile\actions.ts:333:            status: legal.current_status,
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile\page.tsx:1:// @glitzy/web/(admin)/[instanceSlug]/clinic-profile — LOCATION_LEGAL_PLAN v1.0 (M0 v0.5)
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile\page.tsx:2:// 3계약 동시 출력 (ClinicProfile + LocationProfile(main) + LegalDocument × 5)
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile\page.tsx:21:import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile\page.tsx:55:// LL-WORKFLOW-INTEGRATION — 5 LegalDocument workflow state 표시 + 액션 버튼
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile\page.tsx:56:type LegalWorkflowRow = { document_type: string; slug: string; status: string };
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile\page.tsx:197:      // LL-WORKFLOW-INTEGRATION: 5 LegalDocument 의 slug · status (workflow buttons 용)
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile\page.tsx:198:      const legalWorkflowRows = await tx<LegalWorkflowRow[]>`
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile\page.tsx:256:        legalWorkflow: legalWorkflowRows.map((r) => ({
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile\page.tsx:279:  // LL-WORKFLOW-INTEGRATION: 5 LegalDocument document_type 별 label
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile\page.tsx:294:        한 화면에서 3계약(ClinicProfile + LocationProfile main + 5종 LegalDocument)을 동시 저장합니다. 5종 정책 문서 본문은 변수 치환으로 자동 생성됩니다.
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile\page.tsx:302:            본문 저장은 위 form 에서 자동 처리됩니다. 발행 게이트는 ComplianceRecord legalCounsel 필수 (LL-DEFER-01 부분 해소).
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile\page.tsx:313:                  <WorkflowActionButtons
apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile\page.tsx:315:                    contentType="LegalDocument"
docs/decisions\PUBLIC_SITE_RENDER_PLAN.md:3:> **상태**: **v1.0 (acceptance)** — Codex 자동 비평 cycle 5 회 closeableAfterPatch=true 확정. 누계 31 findings 전건 수용 · 수렴 추세 **21 → 7 → 2 → 1 → 0**. 5 PSR-CASCADE 모두 PASS (01a docs · 02 SCHEMA_MAPPING § 1.2 · 03 M0_BUILD_EXPORT_PLAN § 2.1 · 04 manifest D0011 · 05 pgbouncer userlist). 01b (apps/web 디렉토리 이동 + redirect/revalidate 변경) 는 별 **PUBLIC_SITE_RENDER code v1.0** cycle 분리 (LOCATION_LEGAL plan/code 분리 패턴 정합). ADMIN_UI_SKELETON code v1.0 + LOCATION_LEGAL code v1.0 acceptance 직후 진입하는 첫 공개 사이트 plan.
docs/decisions\PUBLIC_SITE_RENDER_PLAN.md:9:본 문서는 `apps/web` 안에 **`(site)` route group**(공개 사이트)을 신설하고, 어드민 route 도 동시에 **`/admin/<instanceSlug>/...`** prefix 로 격상해 path namespace 충돌을 해소한다. 어드민에서 저장한 6 entity (ClinicProfile · LocationProfile · DoctorProfile · TreatmentPage · Article · LegalDocument)를 minimal 디자인 + 정합 JSON-LD + SEARCH_STANDARDIZATION v1.1 정합 robots/sitemap 과 함께 렌더한다.
docs/decisions\PUBLIC_SITE_RENDER_PLAN.md:18:- `docs/core/CONTENT_STANDARDS.md` v1.3 — answer-first AST · § 7.1.1.1 LegalDocument 면제.
docs/decisions\PUBLIC_SITE_RENDER_PLAN.md:19:- `docs/core/DATA_MODEL.md` v0.9 — C-01 ClinicProfile · C-02 DoctorProfile · C-03 TreatmentPage · C-04 Article · C-16 LegalDocument · C-21 LocationProfile · aiCrawlerPolicy.
docs/decisions\PUBLIC_SITE_RENDER_PLAN.md:22:- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — ClinicProfile 3계약 + LegalDocument 5종 + primaryCtas + businessHours · LegalDocument DB CHECK `status='draft' AND risk_level='Low' AND published_at IS NULL` (LL-SCHEMA-03·06).
docs/decisions\PUBLIC_SITE_RENDER_PLAN.md:55:| status filter (cycle1 PSR-06·16 정정) | TreatmentPage·Article: `status='published' AND published_at <= now()`. **LegalDocument: v0.1 단계 noindex + 어드민 인증 필요 preview 만** (draft 공개 노출 차단 — 법무 게이트 우회 회피) |
docs/decisions\PUBLIC_SITE_RENDER_PLAN.md:76:| LegalDocument 공개 노출 (status=published) | LL-DEFER-01 (compliance-assistant + ComplianceRecord legalCounsel 합류) | PSR-DEFER-13 (LL-DEFER-01 alias) |
docs/decisions\PUBLIC_SITE_RENDER_PLAN.md:123:  - `apps/web/src/components/forms/{ClinicProfileForm, DoctorProfileForm, ...}` 안 `revalidatePath('/${instanceSlug}/...')` 호출 → `'/admin/${instanceSlug}/...'` 로 patch (LOCATION_LEGAL code v1.1 cascade)
docs/decisions\PUBLIC_SITE_RENDER_PLAN.md:196:-- cycle1 PSR-06·16 patch: LegalDocument 는 v0.1 공개 렌더 차단.
docs/decisions\PUBLIC_SITE_RENDER_PLAN.md:237:- (PSR-DATA-07) LegalDocument 의 `/legal/[type]` 라우트 는 v0.1 응답:
docs/decisions\PUBLIC_SITE_RENDER_PLAN.md:241:- LegalDocument 공개 노출은 **LL-DEFER-01 (compliance-assistant + ComplianceRecord legalCounsel 합류) 시점** 까지 차단. PSR-DEFER-13 = LL-DEFER-01 alias.
docs/decisions\PUBLIC_SITE_RENDER_PLAN.md:277:- (PSR-COMP-03 · cycle2 PSR-26 정정) Header: ClinicProfile.name + 네비 (Home · About · Doctors · Treatments · Contact · Locations · CTA primaryCtas[0]). Footer: 주소·전화·진료시간. **법적 페이지 5종 링크는 v0.1 단계 숨김** — LegalDocument 공개 노출이 PSR-DEFER-13 (= LL-DEFER-01 alias) 합류 시점까지 404 이므로 broken link 회피. 합류 후 Footer 에 동적 추가 (LegalDocument 가 published 상태 row 가 존재할 때만 렌더).
docs/decisions\PUBLIC_SITE_RENDER_PLAN.md:312:| LegalDocument | `title` | C-16 `title` | Legal heading (v0.1 단계 노출 X) |
docs/decisions\PUBLIC_SITE_RENDER_PLAN.md:313:| LegalDocument | `body` | C-16 `body` (Markdown rendered) | Legal body |
docs/decisions\PUBLIC_SITE_RENDER_PLAN.md:314:| LegalDocument | `document_type` | C-16 `documentType` | Routing key |
docs/decisions\PUBLIC_SITE_RENDER_PLAN.md:315:| LegalDocument | `effective_date` | C-16 `effectiveDate` | Legal meta |
docs/decisions\PUBLIC_SITE_RENDER_PLAN.md:344:- LegalDocument 본문 (CONTENT_STANDARDS § 7.1.1.1 면제) 도 동일 컴포넌트 사용 — answer-first AST · 표현 검사 미적용은 어드민 저장 단계의 결정이지 렌더 단계와 무관.
docs/decisions\PUBLIC_SITE_RENDER_PLAN.md:588:| 10 | LOCATION_LEGAL code v1.1 cascade — admin URL 변경 (PSR-CASCADE-01) 의 revalidatePath 6 곳 patch | acceptance precondition |
docs/decisions\PUBLIC_SITE_RENDER_PLAN.md:603:| 8 | LegalDocument 5종 draft → `/<instanceSlug>/legal/<type>` 응답 = 404 (v0.1 noindex + DB CHECK draft 만) | Next `notFound()` |
docs/decisions\PUBLIC_SITE_RENDER_PLAN.md:654:- `PSR-DEFER-13` (= LL-DEFER-01 alias · cycle1 PSR-06): LegalDocument 공개 노출 — compliance-assistant + ComplianceRecord legalCounsel/legalCounselAt 합류 시점.
docs/decisions\PUBLIC_SITE_RENDER_PLAN.md:684:  - **PSR-CASCADE-01b (코드 · 별 code v1.0 cycle 로 분리 · LOCATION_LEGAL 패턴 정합)**: `apps/web` 디렉토리 이동 (`(admin)/[instanceSlug]/` → `(admin)/admin/[instanceSlug]/`) + `apps/web/src/app/page.tsx` root redirect target `/<firstSlug>` → `/admin/<firstSlug>` + revalidatePath 6 곳 (clinic-profile · doctors · treatments · articles · ... 각 actions.ts) + `apps/web/src/app/sign-in/consume/route.ts` redirect + `apps/web/src/seed.ts` 안 시드 데이터 정합 + Tailwind v0.2 className 전환 (PSR-28). **acceptance precondition = plan v1.0 acceptance ≠ code v1.0 acceptance** — LOCATION_LEGAL 의 plan v1.0 / code v1.0 분리 패턴과 동일. 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 에서 별도 사이클 진행.
docs/decisions\PUBLIC_SITE_RENDER_PLAN.md:695:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
docs/decisions\PUBLIC_SITE_RENDER_PLAN.md:699:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |

 succeeded in 742ms:
// @glitzy/web/(admin)/[instanceSlug]/clinic-profile — LOCATION_LEGAL_PLAN v1.0 (M0 v0.5)
// 3계약 동시 출력 (ClinicProfile + LocationProfile(main) + LegalDocument × 5)

import { notFound, redirect } from "next/navigation";
import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";
import {
  ClinicProfileForm,
  emptyInitial,
  type ClinicProfileInitial,
} from "@/components/forms/ClinicProfileForm";
import {
  convertFromOpeningHoursSpec,
  type CT02BusinessHours,
  type PrimaryCtaInput,
} from "@/lib/clinic-profile-schema";

import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
import { saveClinicProfile } from "./actions";

type ClinicRow = {
  name: string;
  description: string;
  logo_url: string;
  og_image_url: string;
  business_registration_number: string | null;
  alternate_name: string | null;
  legal_entity_name: string | null;
  slogan: string | null;
  long_description: string | null;
  founding_date: string | null;
  founder: string | null;
  policy_contact_person: string | null;
  policy_contact_email: string | null;
  policy_contact_phone: string | null;
  policy_effective_date: string | null;
  primary_ctas: unknown;
};

type LocationRow = {
  street_address: string;
  address_locality: string;
  address_region: string;
  postal_code: string;
  address_country: string;
  phone: string | null;
  email: string | null;
  metadata: unknown;
};

type LegalRow = { document_type: string; effective_date: string };
// LL-WORKFLOW-INTEGRATION — 5 LegalDocument workflow state 표시 + 액션 버튼
type LegalWorkflowRow = { document_type: string; slug: string; status: string };

function pickString(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

function parsePrimaryCtas(raw: unknown): PrimaryCtaInput[] {
  if (!Array.isArray(raw)) return [];
  const out: PrimaryCtaInput[] = [];
  for (const elem of raw) {
    if (typeof elem !== "object" || elem === null) continue;
    const e = elem as Record<string, unknown>;
    const id = pickString(e.id);
    const type = pickString(e.type);
    const label = pickString(e.label);
    const targetUrl = pickString(e.targetUrl);
    if (!id || !type || !label || !targetUrl) continue;
    if (type !== "phone" && type !== "kakao-talk" && type !== "naver-reservation") continue;
    out.push({ id, type, label, targetUrl });
  }
  return out;
}

function parseBusinessHoursMetadata(raw: unknown): CT02BusinessHours | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const bh = r.businessHours;
  if (typeof bh !== "object" || bh === null) return null;
  const b = bh as Record<string, unknown>;
  const openingHours = Array.isArray(b.openingHours) ? b.openingHours : [];
  const receptionHours = Array.isArray(b.receptionHours) ? b.receptionHours : [];
  const lunchBreaks = Array.isArray(b.lunchBreaks) ? b.lunchBreaks : [];
  const specialClosures = Array.isArray(b.specialClosures) ? b.specialClosures : [];
  return {
    openingHours: openingHours.filter((x): x is { dayOfWeek: string[]; opens: string; closes: string } => {
      if (typeof x !== "object" || x === null) return false;
      const o = x as Record<string, unknown>;
      return Array.isArray(o.dayOfWeek) && typeof o.opens === "string" && typeof o.closes === "string";
    }),
    receptionHours: receptionHours.filter((x): x is { dayOfWeek: string[]; opens: string; closes: string } => {
      if (typeof x !== "object" || x === null) return false;
      const o = x as Record<string, unknown>;
      return Array.isArray(o.dayOfWeek) && typeof o.opens === "string" && typeof o.closes === "string";
    }),
    lunchBreaks: lunchBreaks.filter((x): x is { dayOfWeek: string[]; from: string; to: string } => {
      if (typeof x !== "object" || x === null) return false;
      const o = x as Record<string, unknown>;
      return Array.isArray(o.dayOfWeek) && typeof o.from === "string" && typeof o.to === "string";
    }),
    specialClosures: specialClosures.filter((x): x is { date: string; reason?: string } => {
      if (typeof x !== "object" || x === null) return false;
      const o = x as Record<string, unknown>;
      return typeof o.date === "string";
    }),
  };
}

function parseFeaturedChannelId(raw: unknown): string {
  if (typeof raw !== "object" || raw === null) return "";
  const r = raw as Record<string, unknown>;
  const fc = r.featuredChannelId;
  return typeof fc === "string" ? fc : "";
}

/**
 * LLC-12 patch (cycle 1 code review):
 *   plan § 7 시나리오 15 의 "403" 은 다음 두 가지로 보장한다:
 *     1) 운영자에게 명확한 "접근 거부" UI 렌더 (본 컴포넌트 · role="main" · aria-labelledby)
 *     2) tenant resolver 단의 RLS app.current_instance_id 미설정 시 0 row 응답 → notFound() (404)
 *   Next.js 14 의 server component 는 직접 HTTP status code 를 설정할 수 없어 정확한 403 status 는
 *   Next 15 `unauthorized()/forbidden()` 합류 시점 cascade (LL-DEFER-21).
 *   감사 로그 emit 은 본 단계에서 미수행 — `assertActionEligibility` 가 throw 하기 전에 진입했으므로
 *   eligibility 단계 audit cascade marker 는 REVIEW_WORKFLOW v1.1 cascade (LL-CASCADE-06 후보).
 */
function ForbiddenAccessPage({ message }: { message: string }) {
  return (
    <main role="main" aria-labelledby="forbidden-title" className="flex flex-col gap-4 p-6">
      <h1 id="forbidden-title" className="text-2xl font-semibold">접근 거부</h1>
      <p className="text-sm text-slate-700">{message}</p>
    </main>
  );
}

export default async function ClinicProfilePage({
  params,
}: {
  params: { instanceSlug: string };
}) {
  let pageCtx;
  try {
    pageCtx = await requirePageContext(params.instanceSlug);
  } catch (err) {
    if (err instanceof TenantResolveError) {
      const a = mapAuthDenyReasonToUi(err.reason);
      if (a.kind === "forbidden" || a.kind === "info") {
        return <ForbiddenAccessPage message={a.message} />;
      }
    }
    throw err;
  }

  type LegalWorkflowItem = { documentType: string; slug: string; status: string };
  let initial: ClinicProfileInitial | null = null;
  let legalWorkflow: LegalWorkflowItem[] = [];
  try {
    const result = await withSkeletonTx({ signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId }, async (tx, ctx): Promise<{ initial: ClinicProfileInitial | null; legalWorkflow: LegalWorkflowItem[] }> => {
      assertActionEligibility(ctx, "operator-edit-content");

      const clinicRows = await tx<ClinicRow[]>`
        SELECT name, description, logo_url, og_image_url,
               business_registration_number, alternate_name, legal_entity_name,
               slogan, long_description,
               to_char(founding_date, 'YYYY-MM-DD') AS founding_date,
               founder,
               policy_contact_person, policy_contact_email, policy_contact_phone,
               to_char(policy_effective_date, 'YYYY-MM-DD') AS policy_effective_date,
               primary_ctas
          FROM clinic_profile
         WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'clinic'
         LIMIT 1
      `;
      const clinic = clinicRows[0];
      if (!clinic) return { initial: null, legalWorkflow: [] };

      const locationRows = await tx<LocationRow[]>`
        SELECT street_address, address_locality, address_region, postal_code, address_country,
               phone, email, metadata
          FROM location_profile
         WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'main'
         LIMIT 1
      `;
      const location = locationRows[0] ?? null;

      const legalRows = await tx<LegalRow[]>`
        SELECT document_type::text AS document_type,
               to_char(effective_date, 'YYYY-MM-DD') AS effective_date
          FROM legal_document
         WHERE instance_id = ${ctx.instanceId}::uuid
           AND document_type IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint')
      `;

      // LL-WORKFLOW-INTEGRATION: 5 LegalDocument 의 slug · status (workflow buttons 용)
      const legalWorkflowRows = await tx<LegalWorkflowRow[]>`
        SELECT document_type::text AS document_type, slug, status::text AS status
          FROM legal_document
         WHERE instance_id = ${ctx.instanceId}::uuid
           AND document_type IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint')
      `;

      const overrides: Record<"privacy" | "terms" | "non-covered" | "refund" | "complaint", string> = {
        privacy: "",
        terms: "",
        "non-covered": "",
        refund: "",
        complaint: "",
      };
      const fallback = clinic.policy_effective_date ?? "";
      for (const row of legalRows) {
        const t = row.document_type as keyof typeof overrides;
        if (overrides[t] !== undefined && row.effective_date !== fallback) {
          overrides[t] = row.effective_date;
        }
      }

      const businessHoursSpec = location ? parseBusinessHoursMetadata(location.metadata) : null;
      const primaryCtas = parsePrimaryCtas(clinic.primary_ctas);
      const featuredChannelId = location ? parseFeaturedChannelId(location.metadata) : "";

      const initialBuilt: ClinicProfileInitial = {
        ...emptyInitial,
        name: clinic.name,
        description: clinic.description,
        logoUrl: clinic.logo_url,
        ogImageUrl: clinic.og_image_url,
        businessRegistrationNumber: clinic.business_registration_number ?? "",
        alternateName: clinic.alternate_name ?? "",
        legalEntityName: clinic.legal_entity_name ?? "",
        slogan: clinic.slogan ?? "",
        longDescription: clinic.long_description ?? "",
        foundingDate: clinic.founding_date ?? "",
        founder: clinic.founder ?? "",
        streetAddress: location?.street_address ?? "",
        addressLocality: location?.address_locality ?? "",
        addressRegion: location?.address_region ?? "",
        postalCode: location?.postal_code ?? "",
        addressCountry: location?.address_country ?? "KR",
        locationTelephone: location?.phone ?? "",
        locationEmail: location?.email ?? "",
        businessHours: convertFromOpeningHoursSpec(businessHoursSpec),
        primaryCtas,
        featuredChannelId,
        policyContactPerson: clinic.policy_contact_person ?? "",
        policyContactEmail: clinic.policy_contact_email ?? "",
        policyContactPhone: clinic.policy_contact_phone ?? "",
        policyEffectiveDate: clinic.policy_effective_date ?? "",
        legalDocEffectiveOverrides: overrides,
      };

      return {
        initial: initialBuilt,
        legalWorkflow: legalWorkflowRows.map((r) => ({
          documentType: r.document_type,
          slug: r.slug,
          status: r.status,
        })),

 succeeded in 746ms:
// @glitzy/web/(admin)/[instanceSlug]/clinic-profile/actions — LOCATION_LEGAL_PLAN v1.0 § 4
// 3계약 동시 출력: ClinicProfile + LocationProfile(slug=main) + 5종 LegalDocument
//
// 핵심 결정:
//   LL-ACTION-04 (cycle1 LL-07): 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha (complaint→non-covered→privacy→refund→terms)
//   LL-ACTION-06 (cycle1 LL-16 + cycle3 LL-46): 매 저장 시 5종 LegalDocument body 재렌더링 (수동 편집 차단)
//   LL-ACTION-07 (cycle1 LL-21): effective_date 는 Asia/Seoul 기준 — DB CURRENT_DATE AT TIME ZONE
//   LL-ACTION-08 (cycle1 LL-02 + cycle3 LL-45): LocationProfile = build-time reference. DB metadata 는 marker 만
//   LL-ACTION-09 (cycle1 LL-05 + cycle2 LL-30): businessHours CT-02 SoT 변환
//   LL-ACTION-18 (cycle2 LL-32 + cycle3 LL-43): 7 audit row sequential + per-row try/catch + partial/failed fallback + 3단계 안전망
//   LL-ACTION-21 (cycle3 LL-44): assertHasMainLocationAfterTx + MainLocationMissingError

"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import {
  AuthDeniedError,
  assertActionEligibility,
  emitAuditEvent,
  getActiveSession,
  TenantResolveError,
} from "@glitzy/auth";
import { asUuidV4, type AdminUserId } from "@glitzy/shared-types";
import {
  CLOSED_DOCUMENT_TYPES_ALPHA,
  TEMPLATES,
  renderTemplate,
  TemplateRenderError,
  type RenderContext,
} from "@glitzy/core-content";

import { getSqlBase } from "@/lib/db";
import { getAuthCfg } from "@/lib/env";
import { readSessionCookie } from "@/lib/session-cookie";
import { slugResolver } from "@/lib/slug-resolver";
import { withSkeletonTx } from "@/lib/tenant";
import {
  mapDbErrorToResult,
  MainLocationMissingError,
  type FieldErrors,
} from "@/lib/errors";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { isNextControlFlowError } from "@/lib/action-context";
import {
  clinicProfileBundleInputSchema,
  convertToOpeningHoursSpec,
  extractBusinessHours,
  extractLegalDocEffectiveOverrides,
  extractPrimaryCtas,
} from "@/lib/clinic-profile-schema";

export type SaveResult =
  | { ok: true }
  | { ok: false; fieldErrors: FieldErrors; formError?: string };

type ContractMode = "insert" | "update";

type AuditEntry = {
  contentType: "ClinicProfile" | "LocationProfile" | "LegalDocument";
  slug: string;
  mode: ContractMode;
  status: string | null;
  originalSlug: string;
  documentType?: string;
  templateVersion?: string;
  updatedAtBefore?: Date | null;
  updatedAtAfter?: Date | null;
};

export async function saveClinicProfile(
  instanceSlug: string,
  _prev: SaveResult | null,
  formData: FormData,
): Promise<SaveResult> {
  // 1. parse + zod 검증
  const rawSimple = Object.fromEntries(formData);
  const parsed = clinicProfileBundleInputSchema.safeParse({
    ...rawSimple,
    businessHours: extractBusinessHours(formData),
    primaryCtas: extractPrimaryCtas(formData),
    legalDocEffectiveOverrides: extractLegalDocEffectiveOverrides(formData),
  });
  if (!parsed.success) {
    const fieldErrors: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path.join(".") || "_";
      fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
    }
    return { ok: false, fieldErrors };
  }
  const data = parsed.data;

  // 2. session + tenant resolve
  const signedToken = readSessionCookie();
  if (!signedToken) redirect("/sign-in");

  const sqlBase = getSqlBase();
  const cfg = getAuthCfg();

  let session;
  try {
    session = await getActiveSession(sqlBase, cfg, signedToken);
  } catch (err) {
    const reason = err instanceof AuthDeniedError ? err.reason : "session-not-found";
    redirect(`/sign-in/cleanup?reason=${reason}`);
  }

  let userId: AdminUserId;
  try {
    userId = asUuidV4(session.userId) as AdminUserId;
  } catch {
    redirect("/sign-in/cleanup?reason=session-not-found");
  }
  const instanceId = await slugResolver(sqlBase, instanceSlug, userId);
  if (instanceId === null) notFound();

  try {
    // 3. tx 안 3계약 + 5 LegalDocument upsert
    const txResult = await withSkeletonTx(
      { signedToken, instanceId },
      async (tx, ctx) => {
        assertActionEligibility(ctx, "operator-edit-content");

        const auditEntries: AuditEntry[] = [];

        // === (a) ClinicProfile UPSERT ===
        const clinicBefore = await tx<{ updated_at: Date }[]>`
          SELECT updated_at FROM clinic_profile
           WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'clinic'
           FOR UPDATE
        `;
        const beforeClinic = clinicBefore[0] ?? null;

        const clinicAfter = await tx<{ id: string; updated_at: Date; inserted: boolean }[]>`
          INSERT INTO clinic_profile (
            instance_id, slug, name, description, logo_url, og_image_url,
            business_registration_number, alternate_name, legal_entity_name,
            slogan, long_description, founding_date, founder,
            policy_contact_person, policy_contact_email, policy_contact_phone, policy_effective_date,
            primary_ctas
          ) VALUES (
            ${ctx.instanceId}::uuid, 'clinic',
            ${data.name},
            ${data.description},
            ${data.logoUrl},
            ${data.ogImageUrl},
            ${data.businessRegistrationNumber ?? null},
            ${data.alternateName ?? null},
            ${data.legalEntityName ?? null},
            ${data.slogan ?? null},
            ${data.longDescription ?? null},
            ${data.foundingDate ?? null},
            ${data.founder ?? null},
            ${data.policyContactPerson},
            ${data.policyContactEmail},
            ${data.policyContactPhone},
            ${data.policyEffectiveDate},
            ${JSON.stringify(data.primaryCtas)}::jsonb
          )
          ON CONFLICT (instance_id, slug) DO UPDATE
             SET name = EXCLUDED.name,
                 description = EXCLUDED.description,
                 logo_url = EXCLUDED.logo_url,
                 og_image_url = EXCLUDED.og_image_url,
                 business_registration_number = EXCLUDED.business_registration_number,
                 alternate_name = EXCLUDED.alternate_name,
                 legal_entity_name = EXCLUDED.legal_entity_name,
                 slogan = EXCLUDED.slogan,
                 long_description = EXCLUDED.long_description,
                 founding_date = EXCLUDED.founding_date,
                 founder = EXCLUDED.founder,
                 policy_contact_person = EXCLUDED.policy_contact_person,
                 policy_contact_email = EXCLUDED.policy_contact_email,
                 policy_contact_phone = EXCLUDED.policy_contact_phone,
                 policy_effective_date = EXCLUDED.policy_effective_date,
                 primary_ctas = EXCLUDED.primary_ctas,
                 updated_at = now()
          RETURNING id, updated_at, (xmax = 0) AS inserted
        `;
        const clinic = clinicAfter[0]!;

        auditEntries.push({
          contentType: "ClinicProfile",
          slug: "clinic",
          mode: clinic.inserted ? "insert" : "update",
          status: null,
          originalSlug: "clinic",
          updatedAtBefore: beforeClinic?.updated_at ?? null,
          updatedAtAfter: clinic.updated_at,
        });

        // === (b) LocationProfile(main) UPSERT ===
        const businessHoursSpec = convertToOpeningHoursSpec(data.businessHours);
        const locationMetadata = {
          businessHours: businessHoursSpec,
          reservationChannelsInheritedFrom: "clinic_profile.primary_ctas",
          representativeDoctors: [],
          featuredChannelId: data.featuredChannelId,
        };

        const locationBefore = await tx<{ updated_at: Date }[]>`
          SELECT updated_at FROM location_profile
           WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'main'
           FOR UPDATE
        `;
        const beforeLocation = locationBefore[0] ?? null;

        const locationAfter = await tx<{ id: string; updated_at: Date; inserted: boolean }[]>`
          INSERT INTO location_profile (
            instance_id, slug, name, clinic_profile_id,
            street_address, address_locality, address_region, postal_code, address_country,
            phone, email, metadata
          ) VALUES (
            ${ctx.instanceId}::uuid, 'main',
            ${data.name},
            ${clinic.id}::uuid,
            ${data.streetAddress},
            ${data.addressLocality},
            ${data.addressRegion},
            ${data.postalCode},
            ${data.addressCountry},
            ${data.locationTelephone},
            ${data.locationEmail ?? null},
            ${JSON.stringify(locationMetadata)}::jsonb
          )
          ON CONFLICT (instance_id, slug) DO UPDATE
             SET name = EXCLUDED.name,
                 clinic_profile_id = EXCLUDED.clinic_profile_id,
                 street_address = EXCLUDED.street_address,
                 address_locality = EXCLUDED.address_locality,
                 address_region = EXCLUDED.address_region,
                 postal_code = EXCLUDED.postal_code,
                 address_country = EXCLUDED.address_country,
                 phone = EXCLUDED.phone,
                 email = EXCLUDED.email,
                 metadata = EXCLUDED.metadata,
                 updated_at = now()
          RETURNING id, updated_at, (xmax = 0) AS inserted
        `;
        const location = locationAfter[0]!;

        auditEntries.push({
          contentType: "LocationProfile",
          slug: "main",
          mode: location.inserted ? "insert" : "update",
          status: null,
          originalSlug: "main",
          updatedAtBefore: beforeLocation?.updated_at ?? null,
          updatedAtAfter: location.updated_at,
        });

        // === (c) 5종 LegalDocument UPSERT (변수 치환 + alpha sort 잠금 순서) ===
        // LLC-05 patch: doc 별 effectiveDate override 를 renderCtx 안 policy.effectiveDate 에도 반영
        // → DB effective_date 와 body 안 `{{policy.effectiveDate}}` 가 일치
        const baseRenderCtx = {
          clinic: {
            name: data.name,
            legalEntityName: data.legalEntityName ?? null,
            businessRegistrationNumber: data.businessRegistrationNumber ?? null,
            founder: data.founder ?? null,
          },
          location: {
            main: {
              address: `${data.addressRegion} ${data.addressLocality} ${data.streetAddress} (${data.postalCode})`,
              telephone: data.locationTelephone,
              email: data.locationEmail ?? null,
            },
          },
          policy: {
            contactPerson: data.policyContactPerson,
            contactEmail: data.policyContactEmail,
            contactPhone: data.policyContactPhone,
          },
        } as const;

        for (const docType of CLOSED_DOCUMENT_TYPES_ALPHA) {
          const template = TEMPLATES[docType];
          const overrideValue = data.legalDocEffectiveOverrides[docType];
          const effectiveDate = overrideValue && overrideValue !== ""
            ? overrideValue
            : data.policyEffectiveDate;
          const docRenderCtx: RenderContext = {
            ...baseRenderCtx,
            policy: { ...baseRenderCtx.policy, effectiveDate },
          };
          const renderedBody = renderTemplate(template.body, docRenderCtx);

          // LLC-06 patch: closed 5종 partial UNIQUE 는 (instance_id, document_type) WHERE document_type IN (5종).
          // 같은 document_type 이 다른 slug 로 이미 존재할 수 있으므로 conflict target 을 document_type 으로 사용.
          // LL-WORKFLOW-INTEGRATION: RETURNING 안 current status 도 추출 — audit entry에 form 변조 회피.
          const legalAfter = await tx<{ id: string; inserted: boolean; current_status: string }[]>`
            INSERT INTO legal_document (
              instance_id, slug, document_type, title, body,
              auto_generated, template_version, effective_date,
              contact_person, contact_email, status, risk_level
            ) VALUES (
              ${ctx.instanceId}::uuid,
              ${template.slug},
              ${docType}::legal_document_type,
              ${template.title},
              ${renderedBody},
              true,
              ${template.version},
              ${effectiveDate},
              ${data.policyContactPerson},
              ${data.policyContactEmail},
              'draft'::content_publication_status,
              'Low'::risk_level
            )
            ON CONFLICT (instance_id, document_type)
              WHERE document_type IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint')
              DO UPDATE
               SET slug = EXCLUDED.slug,
                   title = EXCLUDED.title,
                   body = EXCLUDED.body,
                   auto_generated = EXCLUDED.auto_generated,
                   template_version = EXCLUDED.template_version,
                   effective_date = EXCLUDED.effective_date,
                   contact_person = EXCLUDED.contact_person,

 succeeded in 713ms:
// @glitzy/web/components/forms/WorkflowActionButtons — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 5.3 CA-UI-03
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitForReviewAction, publishContentAction } from "@/lib/compliance/entity-actions";
import type { SubmitContentType } from "@/lib/compliance/types";
import type { SaveResult } from "@/lib/save-result";

export function WorkflowActionButtons({
  instanceSlug,
  contentType,
  contentRef,
  currentStatus,
}: {
  instanceSlug: string;
  contentType: SubmitContentType;
  contentRef: string;
  currentStatus: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3 text-sm">
        <span className="text-slate-500">현재 상태:</span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium">{currentStatus}</span>
      </div>
      {(currentStatus === "draft" || currentStatus === "rejected") && (
        <SubmitForReviewForm instanceSlug={instanceSlug} contentType={contentType} contentRef={contentRef} />
      )}
      {currentStatus === "publishable" && (
        <PublishForm instanceSlug={instanceSlug} contentType={contentType} contentRef={contentRef} />
      )}
      {currentStatus === "review-queued" || currentStatus === "in-review" ? (
        <p className="text-xs text-slate-500">검수 중입니다. 검수자 액션은 <a href={`/admin/${instanceSlug}/review-queue`} className="underline">검수 큐</a> 에서.</p>
      ) : null}
      {currentStatus === "approved" ? (
        <p className="text-xs text-amber-700">approved 상태 — publishable 으로 자동 전이 후 발행 버튼 활성화.</p>
      ) : null}
    </div>
  );
}

function SubmitForReviewForm({
  instanceSlug,
  contentType,
  contentRef,
}: {
  instanceSlug: string;
  contentType: SubmitContentType;
  contentRef: string;
}) {
  const bound = submitForReviewAction.bind(null, instanceSlug, contentType, contentRef);
  const [state, formAction] = useFormState<SaveResult | null, FormData>(bound, null);
  const err = state && state.ok === false ? state.formError : null;
  return (
    <form action={formAction} className="flex flex-col gap-2">
      {err && <div className="rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-900">{err}</div>}
      <SubmitButton label="검수 요청" pendingLabel="요청 중…" color="bg-blue-700 hover:bg-blue-800" />
    </form>
  );
}

function PublishForm({
  instanceSlug,
  contentType,
  contentRef,
}: {
  instanceSlug: string;
  contentType: SubmitContentType;
  contentRef: string;
}) {
  const bound = publishContentAction.bind(null, instanceSlug, contentType, contentRef);
  const [state, formAction] = useFormState<SaveResult | null, FormData>(bound, null);
  const err = state && state.ok === false ? state.formError : null;
  return (
    <form action={formAction} className="flex flex-col gap-2">
      {err && <div className="rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-900">{err}</div>}
      <SubmitButton label="발행" pendingLabel="발행 중…" color="bg-emerald-700 hover:bg-emerald-800" />
    </form>
  );
}

function SubmitButton({ label, pendingLabel, color }: { label: string; pendingLabel: string; color: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`self-start rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-60 ${color}`}
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

codex
핵심 변경점은 확인됐습니다. 이제 line number가 필요한 부분을 `Select-String`/번호 출력으로 찍고, workflow action 서버 쪽이 contentRef를 slug로 해석하는지도 함께 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile/page.tsx' | ForEach-Object { "'$i++; if ($i -ge 185 -and $i -le 325) { '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile/actions.ts' | ForEach-Object { "'$i++; if ($i -ge 250 -and $i -le 345) { '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/lib/compliance/entity-actions.ts' | ForEach-Object { "'$i++; if ($i -le 260) { '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'packages/core-content/src/index.ts' | ForEach-Object { "'$i++; if ($_ -match '"'CLOSED_DOCUMENT_TYPES_ALPHA|slug|privacy|terms|non-covered|refund|complaint') { '{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 688ms:
 185:          LIMIT 1
 186:       `;
 187:       const location = locationRows[0] ?? null;
 188: 
 189:       const legalRows = await tx<LegalRow[]>`
 190:         SELECT document_type::text AS document_type,
 191:                to_char(effective_date, 'YYYY-MM-DD') AS effective_date
 192:           FROM legal_document
 193:          WHERE instance_id = ${ctx.instanceId}::uuid
 194:            AND document_type IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint')
 195:       `;
 196: 
 197:       // LL-WORKFLOW-INTEGRATION: 5 LegalDocument 의 slug · status (workflow buttons 용)
 198:       const legalWorkflowRows = await tx<LegalWorkflowRow[]>`
 199:         SELECT document_type::text AS document_type, slug, status::text AS status
 200:           FROM legal_document
 201:          WHERE instance_id = ${ctx.instanceId}::uuid
 202:            AND document_type IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint')
 203:       `;
 204: 
 205:       const overrides: Record<"privacy" | "terms" | "non-covered" | "refund" | "complaint", string> = {
 206:         privacy: "",
 207:         terms: "",
 208:         "non-covered": "",
 209:         refund: "",
 210:         complaint: "",
 211:       };
 212:       const fallback = clinic.policy_effective_date ?? "";
 213:       for (const row of legalRows) {
 214:         const t = row.document_type as keyof typeof overrides;
 215:         if (overrides[t] !== undefined && row.effective_date !== fallback) {
 216:           overrides[t] = row.effective_date;
 217:         }
 218:       }
 219: 
 220:       const businessHoursSpec = location ? parseBusinessHoursMetadata(location.metadata) : null;
 221:       const primaryCtas = parsePrimaryCtas(clinic.primary_ctas);
 222:       const featuredChannelId = location ? parseFeaturedChannelId(location.metadata) : "";
 223: 
 224:       const initialBuilt: ClinicProfileInitial = {
 225:         ...emptyInitial,
 226:         name: clinic.name,
 227:         description: clinic.description,
 228:         logoUrl: clinic.logo_url,
 229:         ogImageUrl: clinic.og_image_url,
 230:         businessRegistrationNumber: clinic.business_registration_number ?? "",
 231:         alternateName: clinic.alternate_name ?? "",
 232:         legalEntityName: clinic.legal_entity_name ?? "",
 233:         slogan: clinic.slogan ?? "",
 234:         longDescription: clinic.long_description ?? "",
 235:         foundingDate: clinic.founding_date ?? "",
 236:         founder: clinic.founder ?? "",
 237:         streetAddress: location?.street_address ?? "",
 238:         addressLocality: location?.address_locality ?? "",
 239:         addressRegion: location?.address_region ?? "",
 240:         postalCode: location?.postal_code ?? "",
 241:         addressCountry: location?.address_country ?? "KR",
 242:         locationTelephone: location?.phone ?? "",
 243:         locationEmail: location?.email ?? "",
 244:         businessHours: convertFromOpeningHoursSpec(businessHoursSpec),
 245:         primaryCtas,
 246:         featuredChannelId,
 247:         policyContactPerson: clinic.policy_contact_person ?? "",
 248:         policyContactEmail: clinic.policy_contact_email ?? "",
 249:         policyContactPhone: clinic.policy_contact_phone ?? "",
 250:         policyEffectiveDate: clinic.policy_effective_date ?? "",
 251:         legalDocEffectiveOverrides: overrides,
 252:       };
 253: 
 254:       return {
 255:         initial: initialBuilt,
 256:         legalWorkflow: legalWorkflowRows.map((r) => ({
 257:           documentType: r.document_type,
 258:           slug: r.slug,
 259:           status: r.status,
 260:         })),
 261:       };
 262:     });
 263:     initial = result.initial;
 264:     legalWorkflow = result.legalWorkflow;
 265:   } catch (err) {
 266:     if (err instanceof TenantResolveError) {
 267:       const action = mapAuthDenyReasonToUi(err.reason);
 268:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
 269:       if (action.kind === "not-found") notFound();
 270:       if (action.kind === "forbidden") {
 271:         return <ForbiddenAccessPage message={action.message} />;
 272:       }
 273:     }
 274:     throw err;
 275:   }
 276: 
 277:   const boundSave = saveClinicProfile.bind(null, params.instanceSlug);
 278: 
 279:   // LL-WORKFLOW-INTEGRATION: 5 LegalDocument document_type 별 label
 280:   const DOC_TYPE_LABEL: Record<string, string> = {
 281:     privacy: "개인정보처리방침",
 282:     terms: "이용약관",
 283:     "non-covered": "비급여 진료 안내",
 284:     refund: "환불 정책",
 285:     complaint: "고충처리 방침",
 286:   };
 287:   const orderedTypes = ["privacy", "terms", "non-covered", "refund", "complaint"] as const;
 288:   const workflowByType = new Map(legalWorkflow.map((w) => [w.documentType, w]));
 289: 
 290:   return (
 291:     <main className="flex flex-col gap-6">
 292:       <h1 className="text-2xl font-semibold">사이트 기본 정보</h1>
 293:       <p className="text-sm text-slate-500">
 294:         한 화면에서 3계약(ClinicProfile + LocationProfile main + 5종 LegalDocument)을 동시 저장합니다. 5종 정책 문서 본문은 변수 치환으로 자동 생성됩니다.
 295:       </p>
 296:       <ClinicProfileForm action={boundSave} initial={initial} instanceSlug={params.instanceSlug} />
 297: 
 298:       {legalWorkflow.length > 0 && (
 299:         <section className="rounded-md border border-slate-200 bg-white p-4">
 300:           <h2 className="mb-3 text-base font-medium">5종 정책 문서 검수·발행 (LL-WORKFLOW-INTEGRATION)</h2>
 301:           <p className="mb-3 text-xs text-slate-500">
 302:             본문 저장은 위 form 에서 자동 처리됩니다. 발행 게이트는 ComplianceRecord legalCounsel 필수 (LL-DEFER-01 부분 해소).
 303:           </p>
 304:           <div className="flex flex-col gap-4">
 305:             {orderedTypes.map((docType) => {
 306:               const w = workflowByType.get(docType);
 307:               if (!w) return null;
 308:               return (
 309:                 <div key={docType}>
 310:                   <div className="mb-2 text-sm font-medium text-fg-default">
 311:                     {DOC_TYPE_LABEL[docType]} <span className="text-xs text-slate-500">· slug: {w.slug}</span>
 312:                   </div>
 313:                   <WorkflowActionButtons
 314:                     instanceSlug={params.instanceSlug}
 315:                     contentType="LegalDocument"
 316:                     contentRef={w.slug}
 317:                     currentStatus={w.status}
 318:                   />
 319:                 </div>
 320:               );
 321:             })}
 322:           </div>
 323:         </section>
 324:       )}
 325:     </main>

 succeeded in 688ms:
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
 291:           // LL-WORKFLOW-INTEGRATION: RETURNING 안 current status 도 추출 — audit entry에 form 변조 회피.
 292:           const legalAfter = await tx<{ id: string; inserted: boolean; current_status: string }[]>`
 293:             INSERT INTO legal_document (
 294:               instance_id, slug, document_type, title, body,
 295:               auto_generated, template_version, effective_date,
 296:               contact_person, contact_email, status, risk_level
 297:             ) VALUES (
 298:               ${ctx.instanceId}::uuid,
 299:               ${template.slug},
 300:               ${docType}::legal_document_type,
 301:               ${template.title},
 302:               ${renderedBody},
 303:               true,
 304:               ${template.version},
 305:               ${effectiveDate},
 306:               ${data.policyContactPerson},
 307:               ${data.policyContactEmail},
 308:               'draft'::content_publication_status,
 309:               'Low'::risk_level
 310:             )
 311:             ON CONFLICT (instance_id, document_type)
 312:               WHERE document_type IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint')
 313:               DO UPDATE
 314:                SET slug = EXCLUDED.slug,
 315:                    title = EXCLUDED.title,
 316:                    body = EXCLUDED.body,
 317:                    auto_generated = EXCLUDED.auto_generated,
 318:                    template_version = EXCLUDED.template_version,
 319:                    effective_date = EXCLUDED.effective_date,
 320:                    contact_person = EXCLUDED.contact_person,
 321:                    contact_email = EXCLUDED.contact_email,
 322:                    updated_at = now()
 323:             RETURNING id, (xmax = 0) AS inserted, status::text AS current_status
 324:           `;
 325:           const legal = legalAfter[0]!;
 326: 
 327:           auditEntries.push({
 328:             contentType: "LegalDocument",
 329:             slug: template.slug,
 330:             mode: legal.inserted ? "insert" : "update",
 331:             // LL-WORKFLOW-INTEGRATION (CAMC-12 정합): form/UPSERT 안 status 는 'draft' hard-coded (insert) · 미수정 (update).
 332:             //   audit 에는 DB current status 사용 — workflow action 으로 전이된 status (review-queued 등) 정확 기록.
 333:             status: legal.current_status,
 334:             originalSlug: template.slug,
 335:             documentType: docType,
 336:             templateVersion: template.version,
 337:           });
 338:         }
 339: 
 340:         // === (d) assertHasMainLocationAfterTx 안전망 (cycle3 LL-44) ===
 341:         const mainCheck = await tx<{ exists: boolean }[]>`
 342:           SELECT EXISTS (
 343:             SELECT 1 FROM location_profile
 344:              WHERE instance_id = ${ctx.instanceId}::uuid
 345:                AND clinic_profile_id = ${clinic.id}::uuid

 succeeded in 644ms:
  32:   CLOSED_DOCUMENT_TYPES_ALPHA,

 succeeded in 703ms:
   1: // @glitzy/web/lib/compliance/entity-actions — entity별 server action thin wrapper
   2: // COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 6 — submitForReview · publishContent.
   3: // 모든 6 entity edit page 가 사용.
   4: 
   5: "use server";
   6: 
   7: import { revalidatePath } from "next/cache";
   8: import { notFound, redirect } from "next/navigation";
   9: import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
  10: 
  11: import { getSqlBase } from "@/lib/db";
  12: import { isNextControlFlowError, resolveActionContext } from "@/lib/action-context";
  13: import { withSkeletonTx } from "@/lib/tenant";
  14: import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
  15: import { submitForReview, publishContent } from "./server-actions";
  16: import {
  17:   ComplianceConfigError,
  18:   ComplianceTransitionError,
  19:   ReviewerEligibilityError,
  20:   type SubmitContentType,
  21: } from "./types";
  22: import type { SaveResult } from "@/lib/save-result";
  23: 
  24: const ENTITY_TABLES: Record<SubmitContentType, "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance"> = {
  25:   Article: "article",
  26:   TreatmentPage: "treatment_page",
  27:   LegalDocument: "legal_document",
  28:   FAQ: "faq",
  29:   Publication: "publication",
  30:   MediaAppearance: "media_appearance",
  31: };
  32: 
  33: const ENTITY_ROUTES: Record<SubmitContentType, string> = {
  34:   Article: "articles",
  35:   TreatmentPage: "treatments",
  36:   LegalDocument: "legal-documents",
  37:   FAQ: "faqs",
  38:   Publication: "publications",
  39:   MediaAppearance: "media-appearances",
  40: };
  41: 
  42: export async function submitForReviewAction(
  43:   instanceSlug: string,
  44:   contentType: SubmitContentType,
  45:   contentRef: string,
  46:   _prev: SaveResult | null,
  47:   _formData: FormData,
  48: ): Promise<SaveResult> {
  49:   const aCtx = await resolveActionContext(instanceSlug);
  50:   const sqlBase = getSqlBase();
  51:   try {
  52:     const result = await withSkeletonTx(
  53:       { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
  54:       async (tx, ctx) => {
  55:         const table = ENTITY_TABLES[contentType];
  56:         // CAMC-04 정정: FOR UPDATE 로 잠금 + draft/rejected status assert.
  57:         const rows = await tx.unsafe<{ status: string; risk_level: string | null }[]>(`
  58:           SELECT status::text AS status,
  59:                  ${contentType === "FAQ" || contentType === "LegalDocument" || contentType === "Publication" || contentType === "MediaAppearance" ? "NULL::text" : "risk_level::text"} AS risk_level
  60:             FROM ${table}
  61:            WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${contentRef.replace(/'/g, "''")}'
  62:            FOR UPDATE
  63:         `);
  64:         if (rows.length === 0) return { ok: false as const, action: "notfound" as const };
  65:         const out = await submitForReview(tx, ctx, {
  66:           contentType,
  67:           contentRef,
  68:           contentRow: { status: rows[0]!.status, risk_level: rows[0]!.risk_level },
  69:         });
  70:         // entity status draft → review-queued
  71:         await tx.unsafe(`
  72:           UPDATE ${table}
  73:              SET status = 'review-queued'::content_publication_status, updated_at = now()
  74:            WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${contentRef.replace(/'/g, "''")}'
  75:         `);
  76:         return { ok: true as const, ctx, out };
  77:       },
  78:     );
  79: 
  80:     if (result.ok === false && result.action === "notfound") notFound();
  81:     if (result.ok === true) {
  82:       try {
  83:         await emitAuditEvent(sqlBase, {
  84:           eventType: "content-submitted-for-review",
  85:           actorUserId: result.ctx.userId,
  86:           targetUserId: result.ctx.userId,
  87:           toInstanceId: result.ctx.instanceId,
  88:           // CAMC-07/10 정정: finalRoles · pageRiskLevel 포함
  89:           payload: {
  90:             contentType,
  91:             contentRef,
  92:             recordId: result.out.recordId,
  93:             entryId: result.out.entryId,
  94:             finalRoles: result.out.finalRoles,
  95:             pageRiskLevel: result.out.pageRiskLevel,
  96:           },
  97:         });
  98:       } catch (err) {
  99:         console.error("[submitForReviewAction] audit emit failed", err);
 100:       }
 101:       revalidatePath(`/admin/${instanceSlug}/${ENTITY_ROUTES[contentType]}/${contentRef}`);
 102:       revalidatePath(`/admin/${instanceSlug}/review-queue`);
 103:       revalidatePath(`/admin/${instanceSlug}`);
 104:       return { ok: true, slug: contentRef };
 105:     }
 106:     return { ok: false, fieldErrors: {}, formError: "검수 요청에 실패했습니다." };
 107:   } catch (err) {
 108:     if (isNextControlFlowError(err)) throw err;
 109:     if (err instanceof ReviewerEligibilityError) return { ok: false, fieldErrors: {}, formError: err.message };
 110:     if (err instanceof ComplianceTransitionError || err instanceof ComplianceConfigError) {
 111:       return { ok: false, fieldErrors: {}, formError: err.message };
 112:     }
 113:     if (err instanceof TenantResolveError) {
 114:       const action = mapAuthDenyReasonToUi(err.reason);
 115:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
 116:       if (action.kind === "not-found") notFound();
 117:       if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
 118:     }
 119:     console.error("[submitForReviewAction] unexpected", err);
 120:     return { ok: false, fieldErrors: {}, formError: "검수 요청 중 오류가 발생했습니다." };
 121:   }
 122: }
 123: 
 124: export async function publishContentAction(
 125:   instanceSlug: string,
 126:   contentType: SubmitContentType,
 127:   contentRef: string,
 128:   _prev: SaveResult | null,
 129:   _formData: FormData,
 130: ): Promise<SaveResult> {
 131:   const aCtx = await resolveActionContext(instanceSlug);
 132:   const sqlBase = getSqlBase();
 133:   try {
 134:     const result = await withSkeletonTx(
 135:       { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
 136:       async (tx, ctx) => {
 137:         const table = ENTITY_TABLES[contentType];
 138:         // CAMC-01 정정: entity.compliance_record_id 선행 요구 제거 — publishContent() 가 본 함수 안 채움.
 139:         //   현재 row status 만 FOR UPDATE 잠금 + 검증 후 latest pre-publish record 사용.
 140:         const rows = await tx.unsafe<{ status: string }[]>(`
 141:           SELECT status::text AS status FROM ${table}
 142:            WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${contentRef.replace(/'/g, "''")}'
 143:            FOR UPDATE
 144:         `);
 145:         if (rows.length === 0) return { ok: false as const, action: "notfound" as const };
 146:         const row = rows[0]!;
 147:         if (row.status !== "publishable") {
 148:           return { ok: false as const, action: "not-publishable" as const, message: `현재 상태(${row.status})에서 발행할 수 없습니다 — publishable 상태 필요.` };
 149:         }
 150:         // 동일 contentRef 의 pre-publish ComplianceRecord 가져오기 (CAMC-11 — recordVersion 함께)
 151:         const recRows = await tx<{ id: string; record_version: number }[]>`
 152:           SELECT id, record_version FROM compliance_record
 153:            WHERE instance_id = ${ctx.instanceId}::uuid
 154:              AND content_type = ${contentType}::compliance_content_type
 155:              AND content_ref = ${contentRef}
 156:              AND record_phase = 'pre-publish'::compliance_record_phase
 157:            ORDER BY record_version DESC
 158:            LIMIT 1
 159:         `;
 160:         if (recRows.length === 0) return { ok: false as const, action: "no-record" as const };
 161:         await publishContent(tx, ctx, {
 162:           contentType, contentRef, recordId: recRows[0]!.id, contentTable: table,
 163:         });
 164:         return { ok: true as const, ctx, recordId: recRows[0]!.id, recordVersion: recRows[0]!.record_version };
 165:       },
 166:     );
 167: 
 168:     if (result.ok === false && result.action === "notfound") notFound();
 169:     if (result.ok === false && result.action === "no-record") {
 170:       return { ok: false, fieldErrors: {}, formError: "발행 가능한 ComplianceRecord 가 없습니다." };
 171:     }
 172:     if (result.ok === false && result.action === "not-publishable") {
 173:       return { ok: false, fieldErrors: {}, formError: result.message };
 174:     }
 175:     if (result.ok === true) {
 176:       try {
 177:         await emitAuditEvent(sqlBase, {
 178:           eventType: "content-published",
 179:           actorUserId: result.ctx.userId,
 180:           targetUserId: result.ctx.userId,
 181:           toInstanceId: result.ctx.instanceId,
 182:           // CAMC-11 정정: recordVersion 포함
 183:           payload: { contentType, contentRef, recordId: result.recordId, recordVersion: result.recordVersion },
 184:         });
 185:       } catch (err) {
 186:         console.error("[publishContentAction] audit emit failed", err);
 187:       }
 188:       revalidatePath(`/admin/${instanceSlug}/${ENTITY_ROUTES[contentType]}/${contentRef}`);
 189:       revalidatePath(`/admin/${instanceSlug}`);
 190:       return { ok: true, slug: contentRef };
 191:     }
 192:     return { ok: false, fieldErrors: {}, formError: "발행에 실패했습니다." };
 193:   } catch (err) {
 194:     if (isNextControlFlowError(err)) throw err;
 195:     if (err instanceof ReviewerEligibilityError) return { ok: false, fieldErrors: {}, formError: err.message };
 196:     if (err instanceof ComplianceTransitionError || err instanceof ComplianceConfigError) {
 197:       return { ok: false, fieldErrors: {}, formError: err.message };
 198:     }
 199:     if (err instanceof TenantResolveError) {
 200:       const action = mapAuthDenyReasonToUi(err.reason);
 201:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
 202:       if (action.kind === "not-found") notFound();
 203:       if (action.kind === "forbidden" || action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
 204:     }
 205:     console.error("[publishContentAction] unexpected", err);
 206:     return { ok: false, fieldErrors: {}, formError: "발행 중 오류가 발생했습니다." };
 207:   }
 208: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "CLOSED_DOCUMENT_TYPES_ALPHA|TEMPLATES|privacy|non-covered|complaint|refund|terms" packages/core-content/src packages/core-content/migrations/C0006_legal_document.sql packages/core-content/src/schema.ts apps/web/src/lib/clinic-profile-schema.ts apps/web/src/components/forms/ClinicProfileForm.tsx' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/lib/clinic-profile-schema.ts' | ForEach-Object { "'$i++; if ($i -le 260) { '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/components/forms/ClinicProfileForm.tsx' | ForEach-Object { "'$i++; if ($i -le 340) { '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'packages/core-content/migrations/C0006_legal_document.sql' | ForEach-Object { "'$i++; if ($i -le 220) { '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 691ms:
packages/core-content/migrations/C0006_legal_document.sql:6:  'privacy', 'terms', 'non-covered', 'refund', 'complaint', 'cookie', 'other'
packages/core-content/migrations/C0006_legal_document.sql:56:  WHERE document_type IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint');
packages/core-content/src/schema.ts:43:  "privacy", "terms", "non-covered", "refund", "complaint", "cookie", "other",
packages/core-content/src/schema.ts:311:      .where(sql`${t.documentType} IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint')`),
apps/web/src/components/forms/ClinicProfileForm.tsx:20:const CLOSED_DOC_TYPES = ["privacy", "terms", "non-covered", "refund", "complaint"] as const;
apps/web/src/components/forms/ClinicProfileForm.tsx:24:  privacy: "개인정보처리방침",
apps/web/src/components/forms/ClinicProfileForm.tsx:25:  terms: "이용약관",
apps/web/src/components/forms/ClinicProfileForm.tsx:26:  "non-covered": "비급여 진료비 안내",
apps/web/src/components/forms/ClinicProfileForm.tsx:27:  refund: "환불 규정",
apps/web/src/components/forms/ClinicProfileForm.tsx:28:  complaint: "민원 처리 안내",
apps/web/src/components/forms/ClinicProfileForm.tsx:116:    privacy: "",
apps/web/src/components/forms/ClinicProfileForm.tsx:117:    terms: "",
apps/web/src/components/forms/ClinicProfileForm.tsx:118:    "non-covered": "",
apps/web/src/components/forms/ClinicProfileForm.tsx:119:    refund: "",
apps/web/src/components/forms/ClinicProfileForm.tsx:120:    complaint: "",
packages/core-content/src\index.ts:30:  TEMPLATES,
packages/core-content/src\index.ts:32:  CLOSED_DOCUMENT_TYPES_ALPHA,
packages/core-content/src\schema.ts:43:  "privacy", "terms", "non-covered", "refund", "complaint", "cookie", "other",
packages/core-content/src\schema.ts:311:      .where(sql`${t.documentType} IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint')`),
packages/core-content/src\templates\index.ts:15:  | "privacy"
packages/core-content/src\templates\index.ts:16:  | "terms"
packages/core-content/src\templates\index.ts:17:  | "non-covered"
packages/core-content/src\templates\index.ts:18:  | "refund"
packages/core-content/src\templates\index.ts:19:  | "complaint";
packages/core-content/src\templates\index.ts:31:export const TEMPLATES: Record<ClosedLegalDocumentType, Template> = {
packages/core-content/src\templates\index.ts:32:  privacy: {
packages/core-content/src\templates\index.ts:33:    documentType: "privacy",
packages/core-content/src\templates\index.ts:34:    slug: "privacy",
packages/core-content/src\templates\index.ts:36:    version: "privacy@1.0.0",
packages/core-content/src\templates\index.ts:39:  terms: {
packages/core-content/src\templates\index.ts:40:    documentType: "terms",
packages/core-content/src\templates\index.ts:41:    slug: "terms",
packages/core-content/src\templates\index.ts:43:    version: "terms@1.0.0",
packages/core-content/src\templates\index.ts:46:  "non-covered": {
packages/core-content/src\templates\index.ts:47:    documentType: "non-covered",
packages/core-content/src\templates\index.ts:48:    slug: "non-covered",
packages/core-content/src\templates\index.ts:50:    version: "non-covered@1.0.0",
packages/core-content/src\templates\index.ts:53:  refund: {
packages/core-content/src\templates\index.ts:54:    documentType: "refund",
packages/core-content/src\templates\index.ts:55:    slug: "refund",
packages/core-content/src\templates\index.ts:57:    version: "refund@1.0.0",
packages/core-content/src\templates\index.ts:60:  complaint: {
packages/core-content/src\templates\index.ts:61:    documentType: "complaint",
packages/core-content/src\templates\index.ts:62:    slug: "complaint",
packages/core-content/src\templates\index.ts:64:    version: "complaint@1.0.0",
packages/core-content/src\templates\index.ts:70:  "privacy",
packages/core-content/src\templates\index.ts:71:  "terms",
packages/core-content/src\templates\index.ts:72:  "non-covered",
packages/core-content/src\templates\index.ts:73:  "refund",
packages/core-content/src\templates\index.ts:74:  "complaint",
packages/core-content/src\templates\index.ts:78:export const CLOSED_DOCUMENT_TYPES_ALPHA: readonly ClosedLegalDocumentType[] = [
packages/core-content/src\templates\index.ts:79:  "complaint",
packages/core-content/src\templates\index.ts:80:  "non-covered",
packages/core-content/src\templates\index.ts:81:  "privacy",
packages/core-content/src\templates\index.ts:82:  "refund",
packages/core-content/src\templates\index.ts:83:  "terms",
packages/core-content/src\templates\__tests__.ts:9:import { TEMPLATES, CLOSED_DOCUMENT_TYPES } from "./index.js";
packages/core-content/src\templates\__tests__.ts:36:    const template = TEMPLATES[docType];
packages/core-content/src\templates\__tests__.ts:66:      contactEmail: "privacy@example.test",
packages/core-content/src\templates\__tests__.ts:74:      const rendered = renderTemplate(TEMPLATES[docType].body, ctx);

 succeeded in 691ms:
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

 succeeded in 735ms:
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
  14: import type { SaveResult } from "@/app/(admin)/admin/[instanceSlug]/clinic-profile/actions";
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

 succeeded in 751ms:
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

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'packages/core-content/migrations/C0016_status_unlock.sql' | ForEach-Object { "'$i++; if ($i -le 260) { '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/lib/compliance/server-actions.ts' | ForEach-Object { "'$i++; if ($i -le 360) { '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/lib/compliance/types.ts' | ForEach-Object { "'$i++; if ($i -le 240) { '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'packages/core-content/src/templates/index.ts' | ForEach-Object { "'$i++; if ($i -le 100) { '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 656ms:
   1: // @glitzy/web/lib/compliance/types — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 4.1
   2: // SoT: CONTENT_STANDARDS § 7 ComplianceCheckInput · Result
   3: 
   4: export type RiskLevel = "Low" | "Medium" | "High";
   5: 
   6: export type ApproverRole = "operator" | "medical" | "legal";  // M0 v0.1 client 제외 (CA-DEFER-10)
   7: 
   8: // 6 entity M0 active — submit 가능 contentType. compliance_content_type enum (17종) 안 subset.
   9: export const ALLOWED_SUBMIT_TYPES = [
  10:   "Article", "TreatmentPage", "LegalDocument",
  11:   "FAQ", "Publication", "MediaAppearance",
  12: ] as const;
  13: export type SubmitContentType = (typeof ALLOWED_SUBMIT_TYPES)[number];
  14: 
  15: export type ContentType = SubmitContentType | "ClinicProfile" | "DoctorProfile" | "LocationProfile" | "ArticleCategory" | "MedicalConditionPage" | "ReviewPolicy" | "PricingPage" | "FacilitiesPage" | "NewsItem" | "ReservationPage" | "Feature";
  16: 
  17: // CONTENT_STANDARDS § 7.1 ComplianceCheckInput — M0 v0.1 subset
  18: export type ComplianceCheckInput = {
  19:   contentType: ContentType;
  20:   contentRef: string;
  21:   body: string;  // Markdown
  22:   metadata: {
  23:     pageTypeId?: string;
  24:     articleType?: string;
  25:     explicitRiskLevel?: RiskLevel;
  26:     inferredRiskLevel?: RiskLevel;
  27:   };
  28:   riskRules?: unknown[];  // M0 stub — 미사용
  29: };
  30: 
  31: // CONTENT_STANDARDS § 7.2 Finding shape
  32: export type Finding = {
  33:   ruleId: string;
  34:   category: string;
  35:   pattern: string;
  36:   severity: "info" | "warning" | "fail" | "content-gate";
  37:   location: { start: number; end: number };
  38:   suggestion?: string;
  39:   requiredApproverRoles?: ApproverRole[];
  40:   triggeredBy?: "static-rule" | "inferred" | "explicit" | "llm-assist";
  41:   llmAssistMeta?: { modelId: string; promptVersion: string; confidence: number };
  42: };
  43: 
  44: // CONTENT_STANDARDS § 7.2 ComplianceCheckResult — SoT 7 필드만 (CAM2-01 정정)
  45: export type ComplianceCheckResult = {
  46:   automatedDecision: "block" | "gate" | "warn" | "pass";
  47:   buildBlocked: boolean;
  48:   gateRequired: boolean;
  49:   hasWarnings: boolean;
  50:   findingsBySeverity: {
  51:     fail: number;
  52:     "content-gate": number;
  53:     warning: number;
  54:     info: number;
  55:   };
  56:   requiredApproverRoles?: ApproverRole[];
  57:   findings: Finding[];
  58: };
  59: 
  60: // M0 wrapper — meta 안 분리. exemptReason 은 LegalDocument 면제 시 (compliance_record.metadata 슬롯에 저장).
  61: export type ComplianceCheckEnvelope = {
  62:   result: ComplianceCheckResult;
  63:   meta: {
  64:     pageRiskLevel: RiskLevel;
  65:     catalogVersion: string;
  66:     catalogHash: string;
  67:     manualReview: boolean;
  68:     exemptReason?: string;
  69:   };
  70: };
  71: 
  72: // 에러 type — fail closed
  73: export class ComplianceConfigError extends Error {
  74:   override readonly name = "ComplianceConfigError";
  75: }
  76: export class ComplianceTransitionError extends Error {
  77:   override readonly name = "ComplianceTransitionError";
  78: }
  79: export class ReviewerEligibilityError extends Error {
  80:   override readonly name = "ReviewerEligibilityError";
  81: }

 succeeded in 669ms:
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

 succeeded in 687ms:
   1: // @glitzy/web/lib/compliance/server-actions — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 6 CA-ACTION-01~07
   2: // 4 server action helper — submitForReview · approveContent · rejectContent · publishContent.
   3: // 모든 action 은 entity별 actions.ts 안 thin wrapper 가 호출.
   4: 
   5: import type { ScopedTx } from "@glitzy/db";
   6: import type { TenantContext } from "@glitzy/auth";
   7: 
   8: import type {
   9:   ApproverRole,
  10:   ComplianceCheckEnvelope,
  11:   ContentType,
  12:   SubmitContentType,
  13: } from "./types";
  14: import { ALLOWED_SUBMIT_TYPES, ComplianceTransitionError } from "./types";
  15: import { assertTransitionAllowed, type ContentWorkflowState } from "./transitions";
  16: import { check, buildLegalDocumentExemptEnvelope } from "./check";
  17: import { calculateFinalRoles, isRoleSatisfied, type ComplianceRecordRow } from "./final-roles";
  18: import { evaluatePublishable } from "./publishable-check";
  19: import { assertReviewerEligibility } from "./eligibility";
  20: 
  21: const SLA_DUE_HOURS: Record<"P0" | "P1" | "P2", number> = { P0: 72, P1: 168, P2: 336 };
  22: 
  23: /**
  24:  * advisory lock key — UUID v4 → 64-bit int (CAM-27 정정).
  25:  *   hashtextextended('compliance:' || uuid, 0) 으로 충돌 확률 낮춤.
  26:  */
  27: async function acquireRecordLock(tx: ScopedTx, recordId: string): Promise<void> {
  28:   await tx`SELECT pg_advisory_xact_lock(hashtextextended(${"compliance:" + recordId}, 0))`;
  29: }
  30: 
  31: function isAllowedSubmitType(t: string): t is SubmitContentType {
  32:   return (ALLOWED_SUBMIT_TYPES as readonly string[]).includes(t);
  33: }
  34: 
  35: export type SubmitForReviewArgs = {
  36:   contentType: SubmitContentType;
  37:   contentRef: string;
  38:   contentRow: { status: string; risk_level?: string | null; body?: string };
  39: };
  40: 
  41: export type SubmitForReviewResult = {
  42:   recordId: string;
  43:   entryId: string;
  44:   finalRoles: ApproverRole[];   // CAMC-07/10
  45:   pageRiskLevel: "Low" | "Medium" | "High";
  46: };
  47: 
  48: /**
  49:  * draft → review-queued 전이 + ComplianceRecord(pre-publish) + ReviewQueueEntry(open).
  50:  */
  51: export async function submitForReview(
  52:   tx: ScopedTx,
  53:   ctx: TenantContext,
  54:   args: SubmitForReviewArgs,
  55: ): Promise<SubmitForReviewResult> {
  56:   if (!isAllowedSubmitType(args.contentType)) {
  57:     throw new ComplianceTransitionError(`Unsupported contentType: ${args.contentType}`);
  58:   }
  59:   assertTransitionAllowed(args.contentRow.status as ContentWorkflowState, "review-queued");
  60: 
  61:   const checkInput = {
  62:     contentType: args.contentType,
  63:     contentRef: args.contentRef,
  64:     body: args.contentRow.body ?? "",
  65:     metadata: {
  66:       explicitRiskLevel: (args.contentRow.risk_level as "Low" | "Medium" | "High" | undefined) ?? undefined,
  67:     },
  68:   };
  69:   const envelope: ComplianceCheckEnvelope = args.contentType === "LegalDocument"
  70:     ? buildLegalDocumentExemptEnvelope(checkInput)
  71:     : await check(checkInput);
  72: 
  73:   const requiredApproverRoles = envelope.result.requiredApproverRoles ?? [];
  74:   const finalRoles = calculateFinalRoles(args.contentType, envelope.meta.pageRiskLevel, false, requiredApproverRoles);
  75: 
  76:   // ComplianceRecord INSERT (pre-publish)
  77:   const slaHours = SLA_DUE_HOURS.P0;
  78:   const recordRows = await tx<{ id: string }[]>`
  79:     INSERT INTO compliance_record (
  80:       instance_id, content_type, content_ref, page_risk_level, auto_check_result,
  81:       record_phase, record_version, metadata
  82:     ) VALUES (
  83:       ${ctx.instanceId}::uuid,
  84:       ${args.contentType}::compliance_content_type,
  85:       ${args.contentRef},
  86:       ${envelope.meta.pageRiskLevel}::risk_level,
  87:       ${JSON.stringify(envelope.result)}::jsonb,
  88:       'pre-publish'::compliance_record_phase,
  89:       1,
  90:       ${JSON.stringify({
  91:         manualReview: envelope.meta.manualReview,
  92:         catalogVersion: envelope.meta.catalogVersion,
  93:         catalogHash: envelope.meta.catalogHash,
  94:         ...(envelope.meta.exemptReason ? { exemptReason: envelope.meta.exemptReason } : {}),
  95:       })}::jsonb
  96:     )
  97:     RETURNING id
  98:   `;
  99:   const recordId = recordRows[0]!.id;
 100: 
 101:   // ReviewQueueEntry INSERT (open)
 102:   const entryRows = await tx<{ id: string }[]>`
 103:     INSERT INTO review_queue_entry (
 104:       instance_id, queue_type, content_type, content_ref, compliance_record_id,
 105:       status, priority, required_roles, sla_due_at
 106:     ) VALUES (
 107:       ${ctx.instanceId}::uuid,
 108:       'manual-review'::review_queue_type,
 109:       ${args.contentType}::compliance_content_type,
 110:       ${args.contentRef},
 111:       ${recordId}::uuid,
 112:       'open'::review_queue_status,
 113:       'P0'::review_queue_priority,
 114:       ${finalRoles}::approver_role[],
 115:       ${new Date(Date.now() + slaHours * 60 * 60 * 1000).toISOString()}::timestamptz
 116:     )
 117:     RETURNING id
 118:   `;
 119:   const entryId = entryRows[0]!.id;
 120: 
 121:   return { recordId, entryId, finalRoles, pageRiskLevel: envelope.meta.pageRiskLevel };
 122: }
 123: 
 124: export type ApproveContentArgs = {
 125:   recordId: string;
 126:   role: ApproverRole;
 127:   contentTable: "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance";
 128:   contentRef: string;
 129: };
 130: 
 131: export type ApproveContentResult = { allApproved: boolean; entryStatus: "in-progress" | "resolved" };
 132: 
 133: /**
 134:  * approve 액션 — 첫 호출 atomic (open→in-progress + review-queued→in-review · CAM-17).
 135:  * AND 게이트 충족 시 in-review → approved 자동 전이.
 136:  */
 137: export async function approveContent(
 138:   tx: ScopedTx,
 139:   ctx: TenantContext,
 140:   args: ApproveContentArgs,
 141: ): Promise<ApproveContentResult> {
 142:   assertReviewerEligibility(ctx, args.role);
 143:   await acquireRecordLock(tx, args.recordId);
 144: 
 145:   // entry + record FOR UPDATE
 146:   // CAMC-03 정정: entry.required_roles 도 함께 잠금 + 본인 역할이 포함되는지 검증.
 147:   // CAMC3-01 정정: queue entry 의 content_type / content_ref 와 호출자 args 정합 검증 (drift 오염 차단).
 148:   const entryRows = await tx<{ id: string; status: string; assigned_to: string | null; required_roles: string[]; content_type: string; content_ref: string }[]>`
 149:     SELECT id, status::text AS status, assigned_to, required_roles::text[] AS required_roles,
 150:            content_type::text AS content_type, content_ref
 151:       FROM review_queue_entry
 152:      WHERE instance_id = ${ctx.instanceId}::uuid AND compliance_record_id = ${args.recordId}::uuid
 153:        AND status IN ('open', 'in-progress')
 154:      FOR UPDATE
 155:   `;
 156:   if (entryRows.length === 0) throw new ComplianceTransitionError("No open queue entry for record");
 157:   const entry = entryRows[0]!;
 158:   if (!entry.required_roles.includes(args.role)) {
 159:     throw new ComplianceTransitionError(
 160:       `Role "${args.role}" is not required for this entry (required: ${entry.required_roles.join(", ")})`,
 161:     );
 162:   }
 163:   // CAMC3-01: entry vs args 정합 — drift 차단
 164:   const expectedContentType = args.contentTable === "article" ? "Article"
 165:     : args.contentTable === "treatment_page" ? "TreatmentPage"
 166:     : args.contentTable === "legal_document" ? "LegalDocument"
 167:     : args.contentTable === "faq" ? "FAQ"
 168:     : args.contentTable === "publication" ? "Publication"
 169:     : "MediaAppearance";
 170:   if (entry.content_type !== expectedContentType || entry.content_ref !== args.contentRef) {
 171:     throw new ComplianceTransitionError(
 172:       `Queue entry content mismatch: expected ${expectedContentType}/${args.contentRef}, got ${entry.content_type}/${entry.content_ref}`,
 173:     );
 174:   }
 175: 
 176:   const recordRows = await tx<(ComplianceRecordRow & { id: string; content_type: string; content_ref: string })[]>`
 177:     SELECT id, content_type::text AS content_type, content_ref,
 178:            page_risk_level::text AS page_risk_level,
 179:            peer_reviewer, peer_reviewed_at, physician_approver, physician_approved_at,
 180:            legal_counsel, legal_counsel_at, prior_review_required, prior_review_passed,
 181:            auto_check_result
 182:       FROM compliance_record
 183:      WHERE id = ${args.recordId}::uuid AND instance_id = ${ctx.instanceId}::uuid
 184:      FOR UPDATE
 185:   `;
 186:   if (recordRows.length === 0) throw new ComplianceTransitionError("Compliance record not found");
 187:   const record = recordRows[0]!;
 188:   // CAMC4-01 정정: record vs entry vs args 모두 정합 검증 (drift 차단).
 189:   if (record.content_type !== entry.content_type || record.content_ref !== entry.content_ref) {
 190:     throw new ComplianceTransitionError(
 191:       `Record vs entry content mismatch: record=${record.content_type}/${record.content_ref}, entry=${entry.content_type}/${entry.content_ref}`,
 192:     );
 193:   }
 194:   if (record.content_type !== expectedContentType || record.content_ref !== args.contentRef) {
 195:     throw new ComplianceTransitionError(
 196:       `Record vs args content mismatch: record=${record.content_type}/${record.content_ref}, args=${expectedContentType}/${args.contentRef}`,
 197:     );
 198:   }
 199: 
 200:   // 중복 approve idempotent
 201:   if (isRoleSatisfied(record, args.role)) {
 202:     return { allApproved: isAllApprovedNow(record, args.role, ctx.userId), entryStatus: entry.status as "in-progress" | "resolved" };
 203:   }
 204: 
 205:   // 슬롯 채움 + entity 전이
 206:   const now = new Date();
 207:   if (args.role === "operator") {
 208:     await tx`UPDATE compliance_record SET peer_reviewer = ${ctx.userId}::uuid, peer_reviewed_at = ${now.toISOString()}::timestamptz, updated_at = now() WHERE id = ${args.recordId}::uuid`;
 209:     record.peer_reviewer = ctx.userId; record.peer_reviewed_at = now;
 210:   } else if (args.role === "medical") {
 211:     await tx`UPDATE compliance_record SET physician_approver = ${ctx.userId}::uuid, physician_approved_at = ${now.toISOString()}::timestamptz, updated_at = now() WHERE id = ${args.recordId}::uuid`;
 212:     record.physician_approver = ctx.userId; record.physician_approved_at = now;
 213:   } else if (args.role === "legal") {
 214:     await tx`UPDATE compliance_record SET legal_counsel = ${ctx.userId}::uuid, legal_counsel_at = ${now.toISOString()}::timestamptz, updated_at = now() WHERE id = ${args.recordId}::uuid`;
 215:     record.legal_counsel = ctx.userId; record.legal_counsel_at = now;
 216:   }
 217: 
 218:   // entry status: open → in-progress (첫 approve · assign_to·assigned_at 채움)
 219:   if (entry.status === "open") {
 220:     await tx`
 221:       UPDATE review_queue_entry
 222:          SET status = 'in-progress'::review_queue_status,
 223:              assigned_to = ${ctx.userId}::uuid,
 224:              assigned_at = ${now.toISOString()}::timestamptz,
 225:              updated_at = now()
 226:        WHERE id = ${entry.id}::uuid
 227:     `;
 228:   }
 229: 
 230:   // entity status 전이 review-queued → in-review (첫 approve)
 231:   await tx.unsafe(`
 232:     UPDATE ${args.contentTable}
 233:        SET status = CASE
 234:          WHEN status = 'review-queued' THEN 'in-review'::content_publication_status
 235:          ELSE status
 236:        END,
 237:        updated_at = now()
 238:      WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
 239:   `);
 240: 
 241:   // AND 게이트 평가
 242:   const required = (record.auto_check_result as { requiredApproverRoles?: string[] } | null)?.requiredApproverRoles ?? [];
 243:   const finalRoles = calculateFinalRoles(record.content_type as ContentType, record.page_risk_level, record.prior_review_required, required);
 244:   const allApproved = finalRoles.every((r) => isRoleSatisfied(record, r));
 245: 
 246:   let entryStatus: "in-progress" | "resolved" = "in-progress";
 247:   if (allApproved) {
 248:     // entity in-review → approved → publishable (publishable evaluator pass 시)
 249:     const publishable = evaluatePublishable(record, record.content_type as ContentType);
 250:     const targetStatus = publishable.publishable ? "publishable" : "approved";
 251:     await tx.unsafe(`
 252:       UPDATE ${args.contentTable}
 253:          SET status = '${targetStatus}'::content_publication_status,
 254:              updated_at = now()
 255:        WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
 256:     `);
 257:     // entry resolved
 258:     await tx`
 259:       UPDATE review_queue_entry
 260:          SET status = 'resolved'::review_queue_status,
 261:              resolved_at = ${now.toISOString()}::timestamptz,
 262:              resolved_by = ${ctx.userId}::uuid,
 263:              resolution_type = 'approved',
 264:              updated_at = now()
 265:        WHERE id = ${entry.id}::uuid
 266:     `;
 267:     entryStatus = "resolved";
 268:   }
 269: 
 270:   return { allApproved, entryStatus };
 271: }
 272: 
 273: function isAllApprovedNow(record: ComplianceRecordRow & { content_type: string }, _role: ApproverRole, _userId: string): boolean {
 274:   const required = (record.auto_check_result as { requiredApproverRoles?: string[] } | null)?.requiredApproverRoles ?? [];
 275:   const finalRoles = calculateFinalRoles(record.content_type as ContentType, record.page_risk_level, record.prior_review_required, required);
 276:   return finalRoles.every((r) => isRoleSatisfied(record, r));
 277: }
 278: 
 279: export type RejectContentArgs = {
 280:   recordId: string;
 281:   reason: string;
 282:   role: ApproverRole;
 283:   contentTable: "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance";
 284:   contentRef: string;
 285: };
 286: 
 287: /**
 288:  * reject 액션 — entity → rejected · entry → resolved (resolution_type='rejected').
 289:  */
 290: export async function rejectContent(
 291:   tx: ScopedTx,
 292:   ctx: TenantContext,
 293:   args: RejectContentArgs,
 294: ): Promise<void> {
 295:   assertReviewerEligibility(ctx, args.role);
 296:   if (args.reason.trim().length < 50) {
 297:     throw new ComplianceTransitionError("Reject reason must be 50+ characters (REVIEW_WORKFLOW § 4.3)");
 298:   }
 299:   await acquireRecordLock(tx, args.recordId);
 300: 
 301:   // CAMC2-02 정정: rejectContent 도 required_roles 검증 + FOR UPDATE.
 302:   // CAMC3-01 정정: content_type/content_ref drift 검증.
 303:   const entryRows = await tx<{ id: string; required_roles: string[]; content_type: string; content_ref: string }[]>`
 304:     SELECT id, required_roles::text[] AS required_roles,
 305:            content_type::text AS content_type, content_ref
 306:       FROM review_queue_entry
 307:      WHERE instance_id = ${ctx.instanceId}::uuid AND compliance_record_id = ${args.recordId}::uuid
 308:        AND status IN ('open', 'in-progress')
 309:      FOR UPDATE
 310:   `;
 311:   if (entryRows.length === 0) throw new ComplianceTransitionError("No open queue entry for record");
 312:   const rejEntry = entryRows[0]!;
 313:   if (!rejEntry.required_roles.includes(args.role)) {
 314:     throw new ComplianceTransitionError(
 315:       `Role "${args.role}" is not required for this entry (required: ${rejEntry.required_roles.join(", ")})`,
 316:     );
 317:   }
 318:   const expectedRejContentType = args.contentTable === "article" ? "Article"
 319:     : args.contentTable === "treatment_page" ? "TreatmentPage"
 320:     : args.contentTable === "legal_document" ? "LegalDocument"
 321:     : args.contentTable === "faq" ? "FAQ"
 322:     : args.contentTable === "publication" ? "Publication"
 323:     : "MediaAppearance";
 324:   if (rejEntry.content_type !== expectedRejContentType || rejEntry.content_ref !== args.contentRef) {
 325:     throw new ComplianceTransitionError(
 326:       `Queue entry content mismatch: expected ${expectedRejContentType}/${args.contentRef}, got ${rejEntry.content_type}/${rejEntry.content_ref}`,
 327:     );
 328:   }
 329:   // CAMC4-01 정정: record vs entry vs args 정합 추가 검증.
 330:   const recRejRows = await tx<{ content_type: string; content_ref: string }[]>`
 331:     SELECT content_type::text AS content_type, content_ref FROM compliance_record
 332:      WHERE id = ${args.recordId}::uuid AND instance_id = ${ctx.instanceId}::uuid
 333:   `;
 334:   if (recRejRows.length === 0) throw new ComplianceTransitionError("Compliance record not found");
 335:   if (recRejRows[0]!.content_type !== expectedRejContentType || recRejRows[0]!.content_ref !== args.contentRef) {
 336:     throw new ComplianceTransitionError(
 337:       `Record vs args content mismatch: record=${recRejRows[0]!.content_type}/${recRejRows[0]!.content_ref}, args=${expectedRejContentType}/${args.contentRef}`,
 338:     );
 339:   }
 340: 
 341:   const now = new Date();
 342:   await tx`
 343:     UPDATE review_queue_entry
 344:        SET status = 'resolved'::review_queue_status,
 345:            resolved_at = ${now.toISOString()}::timestamptz,
 346:            resolved_by = ${ctx.userId}::uuid,
 347:            resolution_type = 'rejected',
 348:            metadata = metadata || ${JSON.stringify({ rejectReason: args.reason, rejectedBy: ctx.userId, rejectedRole: args.role })}::jsonb,
 349:            updated_at = now()
 350:      WHERE id = ${rejEntry.id}::uuid
 351:   `;
 352:   await tx.unsafe(`
 353:     UPDATE ${args.contentTable}
 354:        SET status = 'rejected'::content_publication_status,
 355:            updated_at = now()
 356:      WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
 357:   `);
 358: }
 359: 
 360: export type PublishContentArgs = {

 succeeded in 706ms:
   1: -- @glitzy/core-content — C0016 6 entity status unlock + compliance_record_id FK + sentinel backfill + guard trigger
   2: -- SoT: COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 2.3 CA-SCHEMA-07~10
   3: -- CAM2-03 정정: 6 entity 모두 sentinel backfill + NULL 검증 + VALIDATE.
   4: -- CAM-08 정정: published_content_compliance_guard BEFORE trigger — record_phase + content_type + content_ref + instance_id 매칭.
   5: 
   6: -- (Step 1) LegalDocument · FAQ CHECK 해제 (Article/TreatmentPage 는 이미 9-state 허용)
   7: ALTER TABLE legal_document DROP CONSTRAINT IF EXISTS legal_document_status_skeleton_limit;
   8: ALTER TABLE legal_document DROP CONSTRAINT IF EXISTS legal_document_published_at_null;
   9: ALTER TABLE legal_document DROP CONSTRAINT IF EXISTS legal_document_risk_level_skeleton_limit;
  10: ALTER TABLE faq DROP CONSTRAINT IF EXISTS faq_status_v01_limit;
  11: ALTER TABLE faq DROP CONSTRAINT IF EXISTS faq_published_at_null_v01;
  12: 
  13: -- (Step 2) Publication / MediaAppearance / LegalDocument compliance_record_id 컬럼 ADD
  14: ALTER TABLE publication ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
  15: ALTER TABLE media_appearance ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
  16: ALTER TABLE legal_document ADD COLUMN IF NOT EXISTS compliance_record_id UUID;
  17: 
  18: -- (Step 3) 6 entity FK constraint — 존재 guard (idempotent)
  19: DO $$ BEGIN
  20:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'article_compliance_fk' AND conrelid = 'article'::regclass) THEN
  21:     ALTER TABLE article ADD CONSTRAINT article_compliance_fk
  22:       FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
  23:   END IF;
  24:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'treatment_page_compliance_fk' AND conrelid = 'treatment_page'::regclass) THEN
  25:     ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_compliance_fk
  26:       FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
  27:   END IF;
  28:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'legal_document_compliance_fk' AND conrelid = 'legal_document'::regclass) THEN
  29:     ALTER TABLE legal_document ADD CONSTRAINT legal_document_compliance_fk
  30:       FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
  31:   END IF;
  32:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'faq_compliance_fk' AND conrelid = 'faq'::regclass) THEN
  33:     ALTER TABLE faq ADD CONSTRAINT faq_compliance_fk
  34:       FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
  35:   END IF;
  36:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'publication_compliance_fk' AND conrelid = 'publication'::regclass) THEN
  37:     ALTER TABLE publication ADD CONSTRAINT publication_compliance_fk
  38:       FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
  39:   END IF;
  40:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'media_appearance_compliance_fk' AND conrelid = 'media_appearance'::regclass) THEN
  41:     ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_compliance_fk
  42:       FOREIGN KEY (instance_id, compliance_record_id) REFERENCES compliance_record (instance_id, id) ON DELETE NO ACTION;
  43:   END IF;
  44: END $$;
  45: 
  46: -- (Step 4) Sentinel ComplianceRecord backfill — 6 entity.
  47: --   sentinel.peer_reviewer = system actor (00000000-0000-4000-8000-000000000001).
  48: --   기존 published row 사전 마이그레이션 회피용.
  49: 
  50: -- Article
  51: INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  52:   auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  53:   record_phase, record_version, metadata)
  54: SELECT DISTINCT a.instance_id, 'Article'::compliance_content_type, a.slug,
  55:   'Low'::risk_level,  -- CAMC2-01 정정: sentinel page_risk_level Low fixed — Medium/High row 도 physician_approver CHECK 위반 회피 (감사 추적용 metadata.originalRiskLevel 보존)
  56:   '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  57:   '00000000-0000-4000-8000-000000000001'::uuid, a.published_at,
  58:   a.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  59:   'published'::compliance_record_phase, 1,
  60:   '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
  61: FROM article a
  62: WHERE a.status = 'published' AND a.compliance_record_id IS NULL  -- CAMC2-01: originalRiskLevel sentinel metadata 안 보존 — 미래 republish 흐름 가이드
  63:   AND NOT EXISTS (
  64:     SELECT 1 FROM compliance_record cr
  65:     WHERE cr.instance_id = a.instance_id
  66:       AND cr.content_type = 'Article'::compliance_content_type
  67:       AND cr.content_ref = a.slug
  68:       AND cr.metadata @> '{"sentinel":true}'::jsonb
  69:   );
  70: 
  71: UPDATE article a SET compliance_record_id = cr.id FROM compliance_record cr
  72: WHERE a.instance_id = cr.instance_id
  73:   AND cr.content_type = 'Article'::compliance_content_type
  74:   AND cr.content_ref = a.slug
  75:   AND cr.metadata @> '{"sentinel":true}'::jsonb
  76:   AND a.status = 'published' AND a.compliance_record_id IS NULL;
  77: 
  78: -- TreatmentPage
  79: INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
  80:   auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
  81:   record_phase, record_version, metadata)
  82: SELECT DISTINCT t.instance_id, 'TreatmentPage'::compliance_content_type, t.slug,
  83:   'Low'::risk_level,  -- CAMC2-01 정정: sentinel page_risk_level Low fixed
  84:   '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
  85:   '00000000-0000-4000-8000-000000000001'::uuid, t.published_at,
  86:   t.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
  87:   'published'::compliance_record_phase, 1,
  88:   '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
  89: FROM treatment_page t
  90: WHERE t.status = 'published' AND t.compliance_record_id IS NULL
  91:   AND NOT EXISTS (
  92:     SELECT 1 FROM compliance_record cr
  93:     WHERE cr.instance_id = t.instance_id
  94:       AND cr.content_type = 'TreatmentPage'::compliance_content_type
  95:       AND cr.content_ref = t.slug
  96:       AND cr.metadata @> '{"sentinel":true}'::jsonb
  97:   );
  98: 
  99: UPDATE treatment_page t SET compliance_record_id = cr.id FROM compliance_record cr
 100: WHERE t.instance_id = cr.instance_id
 101:   AND cr.content_type = 'TreatmentPage'::compliance_content_type
 102:   AND cr.content_ref = t.slug
 103:   AND cr.metadata @> '{"sentinel":true}'::jsonb
 104:   AND t.status = 'published' AND t.compliance_record_id IS NULL;
 105: 
 106: -- LegalDocument — 기존 DB CHECK가 status='draft' 만 허용했었으므로 published row 0건 예상. 안전 backfill 추가 (CAMC-02 정정).
 107: INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
 108:   auto_check_result, peer_reviewer, peer_reviewed_at, legal_counsel, legal_counsel_at,
 109:   published_at, published_by, record_phase, record_version, metadata)
 110: SELECT DISTINCT l.instance_id, 'LegalDocument'::compliance_content_type, l.slug, 'Low'::risk_level,
 111:   '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
 112:   '00000000-0000-4000-8000-000000000001'::uuid, l.published_at,
 113:   '00000000-0000-4000-8000-000000000001'::uuid, l.published_at,
 114:   l.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
 115:   'published'::compliance_record_phase, 1,
 116:   '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"LegalDocument-CONTENT_STANDARDS-7.1.1.1-sentinel"}'::jsonb
 117: FROM legal_document l
 118: WHERE l.status = 'published' AND l.compliance_record_id IS NULL
 119:   AND NOT EXISTS (
 120:     SELECT 1 FROM compliance_record cr
 121:     WHERE cr.instance_id = l.instance_id
 122:       AND cr.content_type = 'LegalDocument'::compliance_content_type
 123:       AND cr.content_ref = l.slug
 124:       AND cr.metadata @> '{"sentinel":true}'::jsonb
 125:   );
 126: 
 127: UPDATE legal_document l SET compliance_record_id = cr.id FROM compliance_record cr
 128: WHERE l.instance_id = cr.instance_id
 129:   AND cr.content_type = 'LegalDocument'::compliance_content_type
 130:   AND cr.content_ref = l.slug
 131:   AND cr.metadata @> '{"sentinel":true}'::jsonb
 132:   AND l.status = 'published' AND l.compliance_record_id IS NULL;
 133: 
 134: -- FAQ — 기존 DB CHECK가 status='draft' 만 허용했었으므로 published row 0건 예상.
 135: INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
 136:   auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
 137:   record_phase, record_version, metadata)
 138: SELECT DISTINCT f.instance_id, 'FAQ'::compliance_content_type, f.slug, 'Low'::risk_level,  -- CAMC2-01 정정: sentinel Low fixed
 139:   '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
 140:   '00000000-0000-4000-8000-000000000001'::uuid, f.published_at,
 141:   f.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
 142:   'published'::compliance_record_phase, 1,
 143:   '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
 144: FROM faq f
 145: WHERE f.status = 'published' AND f.compliance_record_id IS NULL
 146:   AND NOT EXISTS (
 147:     SELECT 1 FROM compliance_record cr
 148:     WHERE cr.instance_id = f.instance_id
 149:       AND cr.content_type = 'FAQ'::compliance_content_type
 150:       AND cr.content_ref = f.slug
 151:       AND cr.metadata @> '{"sentinel":true}'::jsonb
 152:   );
 153: 
 154: UPDATE faq f SET compliance_record_id = cr.id FROM compliance_record cr
 155: WHERE f.instance_id = cr.instance_id
 156:   AND cr.content_type = 'FAQ'::compliance_content_type
 157:   AND cr.content_ref = f.slug
 158:   AND cr.metadata @> '{"sentinel":true}'::jsonb
 159:   AND f.status = 'published' AND f.compliance_record_id IS NULL;
 160: 
 161: -- Publication · MediaAppearance — risk_level 'Low' fixed
 162: INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
 163:   auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
 164:   record_phase, record_version, metadata)
 165: SELECT DISTINCT p.instance_id, 'Publication'::compliance_content_type, p.slug, 'Low'::risk_level,
 166:   '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
 167:   '00000000-0000-4000-8000-000000000001'::uuid, p.published_at,
 168:   p.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
 169:   'published'::compliance_record_phase, 1,
 170:   '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
 171: FROM publication p
 172: WHERE p.status = 'published' AND p.compliance_record_id IS NULL
 173:   AND NOT EXISTS (
 174:     SELECT 1 FROM compliance_record cr
 175:     WHERE cr.instance_id = p.instance_id
 176:       AND cr.content_type = 'Publication'::compliance_content_type
 177:       AND cr.content_ref = p.slug
 178:       AND cr.metadata @> '{"sentinel":true}'::jsonb
 179:   );
 180: 
 181: UPDATE publication p SET compliance_record_id = cr.id FROM compliance_record cr
 182: WHERE p.instance_id = cr.instance_id
 183:   AND cr.content_type = 'Publication'::compliance_content_type
 184:   AND cr.content_ref = p.slug
 185:   AND cr.metadata @> '{"sentinel":true}'::jsonb
 186:   AND p.status = 'published' AND p.compliance_record_id IS NULL;
 187: 
 188: INSERT INTO compliance_record (instance_id, content_type, content_ref, page_risk_level,
 189:   auto_check_result, peer_reviewer, peer_reviewed_at, published_at, published_by,
 190:   record_phase, record_version, metadata)
 191: SELECT DISTINCT m.instance_id, 'MediaAppearance'::compliance_content_type, m.slug, 'Low'::risk_level,
 192:   '{"automatedDecision":"pass","buildBlocked":false,"gateRequired":false,"hasWarnings":false,"findingsBySeverity":{"fail":0,"content-gate":0,"warning":0,"info":0},"findings":[]}'::jsonb,
 193:   '00000000-0000-4000-8000-000000000001'::uuid, m.published_at,
 194:   m.published_at, '00000000-0000-4000-8000-000000000001'::uuid,
 195:   'published'::compliance_record_phase, 1,
 196:   '{"sentinel":true,"manualReview":true,"catalogVersion":"m0-stub-v0.1","exemptReason":"sentinel-pre-existing-published"}'::jsonb
 197: FROM media_appearance m
 198: WHERE m.status = 'published' AND m.compliance_record_id IS NULL
 199:   AND NOT EXISTS (
 200:     SELECT 1 FROM compliance_record cr
 201:     WHERE cr.instance_id = m.instance_id
 202:       AND cr.content_type = 'MediaAppearance'::compliance_content_type
 203:       AND cr.content_ref = m.slug
 204:       AND cr.metadata @> '{"sentinel":true}'::jsonb
 205:   );
 206: 
 207: UPDATE media_appearance m SET compliance_record_id = cr.id FROM compliance_record cr
 208: WHERE m.instance_id = cr.instance_id
 209:   AND cr.content_type = 'MediaAppearance'::compliance_content_type
 210:   AND cr.content_ref = m.slug
 211:   AND cr.metadata @> '{"sentinel":true}'::jsonb
 212:   AND m.status = 'published' AND m.compliance_record_id IS NULL;
 213: 
 214: -- (Step 5) NULL 잔존 검증 — 6 entity
 215: DO $$
 216: DECLARE null_count INTEGER;
 217: BEGIN
 218:   SELECT COUNT(*) INTO null_count FROM article WHERE status='published' AND compliance_record_id IS NULL;
 219:   IF null_count > 0 THEN RAISE EXCEPTION 'C0016: article.compliance_record_id NULL published row=%', null_count; END IF;
 220:   SELECT COUNT(*) INTO null_count FROM treatment_page WHERE status='published' AND compliance_record_id IS NULL;
 221:   IF null_count > 0 THEN RAISE EXCEPTION 'C0016: treatment_page.compliance_record_id NULL published row=%', null_count; END IF;
 222:   SELECT COUNT(*) INTO null_count FROM legal_document WHERE status='published' AND compliance_record_id IS NULL;
 223:   IF null_count > 0 THEN RAISE EXCEPTION 'C0016: legal_document.compliance_record_id NULL published row=%', null_count; END IF;
 224:   SELECT COUNT(*) INTO null_count FROM faq WHERE status='published' AND compliance_record_id IS NULL;
 225:   IF null_count > 0 THEN RAISE EXCEPTION 'C0016: faq.compliance_record_id NULL published row=%', null_count; END IF;
 226:   SELECT COUNT(*) INTO null_count FROM publication WHERE status='published' AND compliance_record_id IS NULL;
 227:   IF null_count > 0 THEN RAISE EXCEPTION 'C0016: publication.compliance_record_id NULL published row=%', null_count; END IF;
 228:   SELECT COUNT(*) INTO null_count FROM media_appearance WHERE status='published' AND compliance_record_id IS NULL;
 229:   IF null_count > 0 THEN RAISE EXCEPTION 'C0016: media_appearance.compliance_record_id NULL published row=%', null_count; END IF;
 230: END $$;
 231: 
 232: -- (Step 6) NOT VALID + VALIDATE — 6 entity. 존재 guard.
 233: DO $$ BEGIN
 234:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'article_published_requires_record' AND conrelid = 'article'::regclass) THEN
 235:     ALTER TABLE article ADD CONSTRAINT article_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
 236:     ALTER TABLE article VALIDATE CONSTRAINT article_published_requires_record;
 237:   END IF;
 238:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'treatment_page_published_requires_record' AND conrelid = 'treatment_page'::regclass) THEN
 239:     ALTER TABLE treatment_page ADD CONSTRAINT treatment_page_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
 240:     ALTER TABLE treatment_page VALIDATE CONSTRAINT treatment_page_published_requires_record;
 241:   END IF;
 242:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'legal_document_published_requires_record' AND conrelid = 'legal_document'::regclass) THEN
 243:     ALTER TABLE legal_document ADD CONSTRAINT legal_document_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
 244:     ALTER TABLE legal_document VALIDATE CONSTRAINT legal_document_published_requires_record;
 245:   END IF;
 246:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'faq_published_requires_record' AND conrelid = 'faq'::regclass) THEN
 247:     ALTER TABLE faq ADD CONSTRAINT faq_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
 248:     ALTER TABLE faq VALIDATE CONSTRAINT faq_published_requires_record;
 249:   END IF;
 250:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'publication_published_requires_record' AND conrelid = 'publication'::regclass) THEN
 251:     ALTER TABLE publication ADD CONSTRAINT publication_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
 252:     ALTER TABLE publication VALIDATE CONSTRAINT publication_published_requires_record;
 253:   END IF;
 254:   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'media_appearance_published_requires_record' AND conrelid = 'media_appearance'::regclass) THEN
 255:     ALTER TABLE media_appearance ADD CONSTRAINT media_appearance_published_requires_record CHECK (status <> 'published' OR compliance_record_id IS NOT NULL) NOT VALID;
 256:     ALTER TABLE media_appearance VALIDATE CONSTRAINT media_appearance_published_requires_record;
 257:   END IF;
 258: END $$;
 259: 
 260: -- (Step 7) published_content_compliance_guard trigger — DB level 발행 게이트 무결성.

codex
첫 번째 실질 리스크는 저장 액션이 workflow 상태와 독립적으로 LegalDocument 본문을 갱신한다는 점입니다. 관련해서 action 이후 현재 clinic-profile 경로 재검증 여부까지 이어서 확인하고 있습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"<WorkflowActionButtons|WorkflowActionButtons\" apps/web/src/app apps/web/src/components -g '*.tsx'" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/lib/compliance/server-actions.ts' | ForEach-Object { "'$i++; if ($i -ge 360 -and $i -le 460) { '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'packages/core-content/migrations/C0016_status_unlock.sql' | ForEach-Object { "'$i++; if ($i -ge 260 -and $i -le 380) { '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/lib/compliance/publishable-check.ts' | ForEach-Object { "'$i++; if ($i -le 180) { '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 632ms:
apps/web/src/components\forms\WorkflowActionButtons.tsx:1:// @glitzy/web/components/forms/WorkflowActionButtons — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 5.3 CA-UI-03
apps/web/src/components\forms\WorkflowActionButtons.tsx:9:export function WorkflowActionButtons({
apps/web/src/app\(admin)\admin\[instanceSlug]\clinic-profile\page.tsx:21:import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
apps/web/src/app\(admin)\admin\[instanceSlug]\clinic-profile\page.tsx:313:                  <WorkflowActionButtons
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx:12:import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
apps/web/src/app\(admin)\admin\[instanceSlug]\articles\[slug]\page.tsx:122:      <WorkflowActionButtons
apps/web/src/app\(admin)\admin\[instanceSlug]\faqs\[slug]\page.tsx:10:import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
apps/web/src/app\(admin)\admin\[instanceSlug]\faqs\[slug]\page.tsx:114:      <WorkflowActionButtons
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\[slug]\page.tsx:12:import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
apps/web/src/app\(admin)\admin\[instanceSlug]\treatments\[slug]\page.tsx:89:      <WorkflowActionButtons
apps/web/src/app\(admin)\admin\[instanceSlug]\media-appearances\[slug]\page.tsx:10:import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
apps/web/src/app\(admin)\admin\[instanceSlug]\media-appearances\[slug]\page.tsx:109:      <WorkflowActionButtons
apps/web/src/app\(admin)\admin\[instanceSlug]\publications\[slug]\page.tsx:10:import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
apps/web/src/app\(admin)\admin\[instanceSlug]\publications\[slug]\page.tsx:111:      <WorkflowActionButtons

 succeeded in 667ms:
 360: export type PublishContentArgs = {
 361:   contentType: SubmitContentType;
 362:   contentRef: string;
 363:   recordId: string;
 364:   contentTable: "article" | "treatment_page" | "legal_document" | "faq" | "publication" | "media_appearance";
 365: };
 366: 
 367: export type PublishContentResult = { recordVersion: number };
 368: 
 369: /**
 370:  * publish 액션 — record_phase pre-publish → published (record ID 보존 · REVIEW_WORKFLOW § 5.2).
 371:  *   entity.status → published + published_at 채움.
 372:  *   publishable evaluator 통과 검증.
 373:  */
 374: export async function publishContent(
 375:   tx: ScopedTx,
 376:   ctx: TenantContext,
 377:   args: PublishContentArgs,
 378: ): Promise<PublishContentResult> {
 379:   assertReviewerEligibility(ctx, "operator");
 380:   await acquireRecordLock(tx, args.recordId);
 381: 
 382:   // record FOR UPDATE
 383:   const recordRows = await tx<(ComplianceRecordRow & { id: string; content_type: string; content_ref: string; record_phase: string; record_version: number })[]>`
 384:     SELECT id, content_type::text AS content_type, content_ref,
 385:            page_risk_level::text AS page_risk_level,
 386:            record_phase::text AS record_phase, record_version,
 387:            peer_reviewer, peer_reviewed_at, physician_approver, physician_approved_at,
 388:            legal_counsel, legal_counsel_at, prior_review_required, prior_review_passed,
 389:            auto_check_result
 390:       FROM compliance_record
 391:      WHERE id = ${args.recordId}::uuid AND instance_id = ${ctx.instanceId}::uuid
 392:      FOR UPDATE
 393:   `;
 394:   if (recordRows.length === 0) throw new ComplianceTransitionError("Compliance record not found");
 395:   const record = recordRows[0]!;
 396:   if (record.record_phase === "published") throw new ComplianceTransitionError("Record already published");
 397:   // CAMC4-01 정정: record vs args 정합 검증
 398:   if (record.content_type !== args.contentType || record.content_ref !== args.contentRef) {
 399:     throw new ComplianceTransitionError(
 400:       `Record vs args content mismatch: record=${record.content_type}/${record.content_ref}, args=${args.contentType}/${args.contentRef}`,
 401:     );
 402:   }
 403: 
 404:   const publishable = evaluatePublishable(record, args.contentType);
 405:   if (!publishable.publishable) {
 406:     throw new ComplianceTransitionError(`Not publishable: ${publishable.reasons.join("; ")}`);
 407:   }
 408: 
 409:   // CAMC-06 정정: entity 현 status='publishable' assert
 410:   const entityStatusRows = await tx.unsafe<{ status: string }[]>(`
 411:     SELECT status::text AS status FROM ${args.contentTable}
 412:      WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
 413:      FOR UPDATE
 414:   `);
 415:   if (entityStatusRows.length === 0) throw new ComplianceTransitionError("Entity row not found");
 416:   assertTransitionAllowed(entityStatusRows[0]!.status as ContentWorkflowState, "published");
 417: 
 418:   const now = new Date();
 419:   // (1) compliance_record record_phase 전환 (record ID 보존)
 420:   await tx`
 421:     UPDATE compliance_record
 422:        SET record_phase = 'published'::compliance_record_phase,
 423:            published_at = ${now.toISOString()}::timestamptz,
 424:            published_by = ${ctx.userId}::uuid,
 425:            updated_at = now()
 426:      WHERE id = ${args.recordId}::uuid
 427:   `;
 428:   // (2) entity status → published + published_at + compliance_record_id 채움.
 429:   //   CAMC-05 정정: row count 검증 — current status='publishable' AND_clause.
 430:   const updated = await tx.unsafe<{ id: string }[]>(`
 431:     UPDATE ${args.contentTable}
 432:        SET status = 'published'::content_publication_status,
 433:            published_at = '${now.toISOString()}'::timestamptz,
 434:            compliance_record_id = '${args.recordId}',
 435:            updated_at = now()
 436:      WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${args.contentRef.replace(/'/g, "''")}'
 437:        AND status = 'publishable'::content_publication_status
 438:      RETURNING id
 439:   `);
 440:   if (updated.length !== 1) {
 441:     throw new ComplianceTransitionError(`publish UPDATE affected ${updated.length} rows (expected 1)`);
 442:   }
 443:   return { recordVersion: record.record_version };
 444: }

 succeeded in 675ms:
 260: -- (Step 7) published_content_compliance_guard trigger — DB level 발행 게이트 무결성.
 261: --   entity.status='published' 시 referenced compliance_record 의 record_phase + content_type + content_ref + instance_id 매칭 검증.
 262: CREATE OR REPLACE FUNCTION published_content_compliance_guard()
 263: RETURNS TRIGGER LANGUAGE plpgsql AS $$
 264: DECLARE
 265:   record_row compliance_record%ROWTYPE;
 266:   expected_content_type compliance_content_type;
 267: BEGIN
 268:   IF NEW.status <> 'published' THEN RETURN NEW; END IF;
 269:   IF NEW.compliance_record_id IS NULL THEN
 270:     RAISE EXCEPTION 'published_content_compliance_guard: compliance_record_id required (entity=%)', TG_TABLE_NAME;
 271:   END IF;
 272:   SELECT * INTO record_row FROM compliance_record
 273:    WHERE id = NEW.compliance_record_id AND instance_id = NEW.instance_id;
 274:   IF NOT FOUND THEN
 275:     RAISE EXCEPTION 'published_content_compliance_guard: compliance_record not found (entity=% id=%)', TG_TABLE_NAME, NEW.compliance_record_id;
 276:   END IF;
 277:   IF record_row.record_phase <> 'published' THEN
 278:     RAISE EXCEPTION 'published_content_compliance_guard: compliance_record.record_phase=% must be published', record_row.record_phase;
 279:   END IF;
 280:   -- content_type 일치 (TG_TABLE_NAME → enum 매핑)
 281:   expected_content_type := CASE TG_TABLE_NAME
 282:     WHEN 'article' THEN 'Article'
 283:     WHEN 'treatment_page' THEN 'TreatmentPage'
 284:     WHEN 'legal_document' THEN 'LegalDocument'
 285:     WHEN 'faq' THEN 'FAQ'
 286:     WHEN 'publication' THEN 'Publication'
 287:     WHEN 'media_appearance' THEN 'MediaAppearance'
 288:     ELSE NULL
 289:   END;
 290:   IF expected_content_type IS NULL THEN
 291:     RAISE EXCEPTION 'published_content_compliance_guard: unknown TG_TABLE_NAME=%', TG_TABLE_NAME;
 292:   END IF;
 293:   IF record_row.content_type <> expected_content_type THEN
 294:     RAISE EXCEPTION 'published_content_compliance_guard: content_type mismatch (entity=% vs record=%)', expected_content_type, record_row.content_type;
 295:   END IF;
 296:   -- content_ref 일치 (slug)
 297:   IF record_row.content_ref <> NEW.slug THEN
 298:     RAISE EXCEPTION 'published_content_compliance_guard: content_ref mismatch (entity.slug=% vs record.content_ref=%)', NEW.slug, record_row.content_ref;
 299:   END IF;
 300:   RETURN NEW;
 301: END;
 302: $$;
 303: 
 304: DROP TRIGGER IF EXISTS article_published_guard ON article;
 305: CREATE TRIGGER article_published_guard BEFORE INSERT OR UPDATE ON article
 306:   FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
 307: DROP TRIGGER IF EXISTS treatment_page_published_guard ON treatment_page;
 308: CREATE TRIGGER treatment_page_published_guard BEFORE INSERT OR UPDATE ON treatment_page
 309:   FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
 310: DROP TRIGGER IF EXISTS legal_document_published_guard ON legal_document;
 311: CREATE TRIGGER legal_document_published_guard BEFORE INSERT OR UPDATE ON legal_document
 312:   FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
 313: DROP TRIGGER IF EXISTS faq_published_guard ON faq;
 314: CREATE TRIGGER faq_published_guard BEFORE INSERT OR UPDATE ON faq
 315:   FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
 316: DROP TRIGGER IF EXISTS publication_published_guard ON publication;
 317: CREATE TRIGGER publication_published_guard BEFORE INSERT OR UPDATE ON publication
 318:   FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();
 319: DROP TRIGGER IF EXISTS media_appearance_published_guard ON media_appearance;
 320: CREATE TRIGGER media_appearance_published_guard BEFORE INSERT OR UPDATE ON media_appearance
 321:   FOR EACH ROW EXECUTE FUNCTION published_content_compliance_guard();

 succeeded in 649ms:
   1: // @glitzy/web/lib/compliance/publishable-check — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 3.3 CA-GATE-03 (CAM-06·16, CAM2-04)
   2: // REVIEW_WORKFLOW § 7.1 publishable 6조건 평가.
   3: 
   4: import type { ApproverRole, ContentType } from "./types";
   5: import { ComplianceConfigError } from "./types";
   6: import { calculateFinalRoles, isRoleSatisfied, type ComplianceRecordRow } from "./final-roles";
   7: 
   8: export type PublishableResult =
   9:   | { publishable: true; finalRoles: ApproverRole[] }
  10:   | { publishable: false; reasons: string[]; finalRoles: ApproverRole[]; missingRoles: ApproverRole[]; configError?: undefined }
  11:   | { publishable: false; reasons: string[]; configError: string; finalRoles?: undefined; missingRoles?: undefined };
  12: 
  13: export function evaluatePublishable(
  14:   record: ComplianceRecordRow,
  15:   contentType: ContentType,
  16: ): PublishableResult {
  17:   const autoCheck = record.auto_check_result as { automatedDecision?: string; requiredApproverRoles?: string[] } | null;
  18:   const required = autoCheck?.requiredApproverRoles ?? [];
  19: 
  20:   let finalRoles: ApproverRole[];
  21:   try {
  22:     finalRoles = calculateFinalRoles(contentType, record.page_risk_level, record.prior_review_required, required);
  23:   } catch (err) {
  24:     if (err instanceof ComplianceConfigError) {
  25:       return { publishable: false, reasons: [err.message], configError: err.message };
  26:     }
  27:     throw err;
  28:   }
  29: 
  30:   const reasons: string[] = [];
  31:   const missingRoles: ApproverRole[] = [];
  32: 
  33:   // (1) automatedDecision !== "block"
  34:   if (autoCheck?.automatedDecision === "block") {
  35:     reasons.push("자동 검수 차단 (block) 상태 — 본문 정정 필요");
  36:   }
  37:   // (2) finalRoles 슬롯 모두 기록
  38:   for (const role of finalRoles) {
  39:     if (!isRoleSatisfied(record, role)) {
  40:       missingRoles.push(role);
  41:       reasons.push(`다음 역할의 승인이 필요합니다: ${role}`);
  42:     }
  43:   }
  44:   // (3) priorReview 결과 정합 — M0 stub: priorReviewRequired=false 시 항상 정합 (CA-DEFER-08)
  45:   if (record.prior_review_required && record.prior_review_passed !== true) {
  46:     reasons.push("사전심의 통과 기록이 없습니다 (priorReview).");
  47:   }
  48:   // (4) staleFlags clear — M0 stub: staleFlags 미구현 (CA-DEFER-06 · 항상 clear 가정)
  49:   // (5) LegalDocument legal 슬롯 — finalRoles 검증으로 동시 충족
  50:   // (6) warning 정책 — M0 stub: 항상 충족 (CA-DEFER-05)
  51: 
  52:   if (reasons.length > 0) return { publishable: false, reasons, finalRoles, missingRoles };
  53:   return { publishable: true, finalRoles };
  54: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/lib/compliance/final-roles.ts' | ForEach-Object { "'$i++; if ($i -le 180) { '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md' | ForEach-Object { "'$i++; if (($i -ge 24 -and $i -le 32) -or ($i -ge 668 -and $i -le 686)) { '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'docs/decisions/LOCATION_LEGAL_PLAN.md' | ForEach-Object { "'$i++; if (($i -ge 548 -and $i -le 550) -or ($i -ge 300 -and $i -le 330)) { '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/components/forms/WorkflowActionButtons.tsx' | ForEach-Object { "'$i++; if ($i -le 90) { '"'{0,4}: {1}' -f "'$i, $_ } }' in C:\Users\assag\solution\website-exposure
 succeeded in 694ms:
   1: // @glitzy/web/lib/compliance/final-roles — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 3.1 CA-GATE-01 (CAM-16, CAM2-04)
   2: // REVIEW_WORKFLOW § 4.1 SoT.
   3: 
   4: import type { ApproverRole, ContentType, RiskLevel } from "./types";
   5: import { ComplianceConfigError } from "./types";
   6: 
   7: const KNOWN_ROLES: ReadonlySet<string> = new Set(["operator", "medical", "legal"]);
   8: 
   9: /**
  10:  * unknown role fail closed (CAM-16 + CAM2-04 정정):
  11:  *   auto_check_result.requiredApproverRoles 는 미신뢰 입력 — silently drop 하지 않고 throw.
  12:  *   server action 안 try/catch 로 form-level error 변환.
  13:  */
  14: export function calculateFinalRoles(
  15:   contentType: ContentType,
  16:   pageRiskLevel: RiskLevel,
  17:   priorReviewRequired: boolean = false,
  18:   requiredApproverRoles: readonly string[] = [],
  19: ): ApproverRole[] {
  20:   for (const r of requiredApproverRoles) {
  21:     if (r === "client") {
  22:       throw new ComplianceConfigError(`Client approver not yet supported (CA-DEFER-10)`);
  23:     }
  24:     if (!KNOWN_ROLES.has(r)) {
  25:       throw new ComplianceConfigError(`Unknown ApproverRole: "${r}" (fail closed)`);
  26:     }
  27:   }
  28:   const roles = new Set<ApproverRole>(["operator"]);
  29:   if (pageRiskLevel === "Medium" || pageRiskLevel === "High") roles.add("medical");
  30:   if (contentType === "LegalDocument") roles.add("legal");
  31:   if (priorReviewRequired) roles.add("legal");
  32:   for (const r of requiredApproverRoles) {
  33:     roles.add(r as ApproverRole);
  34:   }
  35:   return Array.from(roles).sort();
  36: }
  37: 
  38: export type ComplianceRecordRow = {
  39:   peer_reviewer: string | null;
  40:   peer_reviewed_at: Date | null;
  41:   physician_approver: string | null;
  42:   physician_approved_at: Date | null;
  43:   legal_counsel: string | null;
  44:   legal_counsel_at: Date | null;
  45:   page_risk_level: RiskLevel;
  46:   prior_review_required: boolean;
  47:   prior_review_passed: boolean | null;
  48:   auto_check_result: unknown;
  49: };
  50: 
  51: export function isRoleSatisfied(record: ComplianceRecordRow, role: ApproverRole): boolean {
  52:   if (role === "operator") return record.peer_reviewer !== null && record.peer_reviewed_at !== null;
  53:   if (role === "medical") return record.physician_approver !== null && record.physician_approved_at !== null;
  54:   if (role === "legal") return record.legal_counsel !== null && record.legal_counsel_at !== null;
  55:   return false;
  56: }

 succeeded in 711ms:
  24: ## 1. 목적과 범위
  25: 
  26: ### 1.1 목적 — cycle 1 CAM-01·09·21 정정
  27: 
  28: - **EC-DEFER-07 부분 해소**: 6 entity (Article·TreatmentPage·LegalDocument·FAQ·Publication·MediaAppearance) status='review-queued' 전이 + ComplianceRecord pre-publish 활성화.
  29: - **EC-DEFER-12 부분 해소**: 6 entity published 발행 unlock — **수동 검수 게이트 통과 시 만**. EC-DEFER-05 (FAQ 자동 검수 + RiskRule + RiskInference 통합) 는 **미해소** — CA-DEFER-01/02 동반 합류 시. M0 stub 의 manualReview 기반 발행은 자동 룰 검수 부재 risk 인지.
  30: - **LL-DEFER-01 부분 해소**: LegalDocument 발행 게이트 (ComplianceRecord.legalCounsel/legalCounselAt required) 활성화. **NotificationEvent envelope** 부분은 CA-DEFER-14 (notifications Feature 합류 까지).
  31: - **인간 검수 워크플로 M0**: /admin/{slug}/review-queue 화면 + manual-review queue 활성화 + multi-role AND 게이트 (operator·medical·legal — client 미합류 CA-DEFER-10).
  32: - **자동 검수(룰) 미합류 marker**: check() stub — 항상 manualReview 결과 반환 (findings=[]·gateRequired=false·automatedDecision=pass · 단 High 입력 시 가상 finding). 실 ruleCatalog/composite/LLM은 CA-DEFER-01·02·03.
 668: ### 5.2 6 entity form status select — read-only display (CA-UI-02) — CAM-18 정정
 669: 
 670: form 안 `status` field 는:
 671: - 현재 row 의 status 표시 만 (read-only badge — `<span>` 또는 disabled `<select>`)
 672: - 사용자 직접 status 변경 불가 — 모든 status 전이는 workflow action 버튼 통해서만
 673: - 기존 save action (`saveArticle` 등) 안 status field 무시 — 서버 측에서 current row.status 보존 (form FormData 안 status 값 무시)
 674: - assertTransitionAllowed 검증은 workflow action 안 수행
 675: 
 676: ### 5.3 entity edit page 안 액션 버튼 (CA-UI-03)
 677: 
 678: 각 edit page 안 추가 버튼:
 679: - "검수 요청" — status=draft|rejected 시 노출 → submitForReview() 호출
 680: - "발행" — status=publishable 시 + 본인이 operator role 시 노출 → publishContent() 호출
 681: - "검수 큐 진입" 후에는 form 자체 read-only — 검수자 액션은 /review-queue/{entryId} 에서
 682: 
 683: ## 6. server action 결정 — CAM-17·20 정정
 684: 
 685: ### 6.1 4 server action 시그니처 (CA-ACTION-01)
 686: 

 succeeded in 697ms:
   1: // @glitzy/web/components/forms/WorkflowActionButtons — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 5.3 CA-UI-03
   2: "use client";
   3: 
   4: import { useFormState, useFormStatus } from "react-dom";
   5: import { submitForReviewAction, publishContentAction } from "@/lib/compliance/entity-actions";
   6: import type { SubmitContentType } from "@/lib/compliance/types";
   7: import type { SaveResult } from "@/lib/save-result";
   8: 
   9: export function WorkflowActionButtons({
  10:   instanceSlug,
  11:   contentType,
  12:   contentRef,
  13:   currentStatus,
  14: }: {
  15:   instanceSlug: string;
  16:   contentType: SubmitContentType;
  17:   contentRef: string;
  18:   currentStatus: string;
  19: }) {
  20:   return (
  21:     <div className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4">
  22:       <div className="flex items-center gap-3 text-sm">
  23:         <span className="text-slate-500">현재 상태:</span>
  24:         <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium">{currentStatus}</span>
  25:       </div>
  26:       {(currentStatus === "draft" || currentStatus === "rejected") && (
  27:         <SubmitForReviewForm instanceSlug={instanceSlug} contentType={contentType} contentRef={contentRef} />
  28:       )}
  29:       {currentStatus === "publishable" && (
  30:         <PublishForm instanceSlug={instanceSlug} contentType={contentType} contentRef={contentRef} />
  31:       )}
  32:       {currentStatus === "review-queued" || currentStatus === "in-review" ? (
  33:         <p className="text-xs text-slate-500">검수 중입니다. 검수자 액션은 <a href={`/admin/${instanceSlug}/review-queue`} className="underline">검수 큐</a> 에서.</p>
  34:       ) : null}
  35:       {currentStatus === "approved" ? (
  36:         <p className="text-xs text-amber-700">approved 상태 — publishable 으로 자동 전이 후 발행 버튼 활성화.</p>
  37:       ) : null}
  38:     </div>
  39:   );
  40: }
  41: 
  42: function SubmitForReviewForm({
  43:   instanceSlug,
  44:   contentType,
  45:   contentRef,
  46: }: {
  47:   instanceSlug: string;
  48:   contentType: SubmitContentType;
  49:   contentRef: string;
  50: }) {
  51:   const bound = submitForReviewAction.bind(null, instanceSlug, contentType, contentRef);
  52:   const [state, formAction] = useFormState<SaveResult | null, FormData>(bound, null);
  53:   const err = state && state.ok === false ? state.formError : null;
  54:   return (
  55:     <form action={formAction} className="flex flex-col gap-2">
  56:       {err && <div className="rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-900">{err}</div>}
  57:       <SubmitButton label="검수 요청" pendingLabel="요청 중…" color="bg-blue-700 hover:bg-blue-800" />
  58:     </form>
  59:   );
  60: }
  61: 
  62: function PublishForm({
  63:   instanceSlug,
  64:   contentType,
  65:   contentRef,
  66: }: {
  67:   instanceSlug: string;
  68:   contentType: SubmitContentType;
  69:   contentRef: string;
  70: }) {
  71:   const bound = publishContentAction.bind(null, instanceSlug, contentType, contentRef);
  72:   const [state, formAction] = useFormState<SaveResult | null, FormData>(bound, null);
  73:   const err = state && state.ok === false ? state.formError : null;
  74:   return (
  75:     <form action={formAction} className="flex flex-col gap-2">
  76:       {err && <div className="rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-900">{err}</div>}
  77:       <SubmitButton label="발행" pendingLabel="발행 중…" color="bg-emerald-700 hover:bg-emerald-800" />
  78:     </form>
  79:   );
  80: }
  81: 
  82: function SubmitButton({ label, pendingLabel, color }: { label: string; pendingLabel: string; color: string }) {
  83:   const { pending } = useFormStatus();
  84:   return (
  85:     <button
  86:       type="submit"
  87:       disabled={pending}
  88:       className={`self-start rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-60 ${color}`}
  89:     >
  90:       {pending ? pendingLabel : label}

 succeeded in 715ms:
 300: **결정**:
 301: - (LL-SCHEMA-17 · cycle1 LL-05 + cycle2 LL-30 patch) form (b) 의 7요일 입력은 server action 안에서 SoT 형식으로 변환 후 저장 (LL-ACTION-09). 입력 UX 는 7요일 단순 행. **receptionHours · specialClosures 는 v0.3 form 입력 필드 없음 → 빈 배열로 저장** (CT-02 optional). round-trip (저장 후 form 재로딩) 시 빈 배열은 form (b) 의 미입력 상태로 표시. M1 cascade 에서 form (b) 에 receptionHours 단축 입력 + specialClosures (공휴일/임시 휴진) UI 추가 합류 (LL-DEFER-16).
 302: - (LL-SCHEMA-18 · cycle1 LL-02 + cycle2 LL-27 patch) `reservationChannels` 는 별도 입력 없음 — LocationProfile 자동 생성 시 ClinicProfile.primary_ctas 그대로 상속. **C-21 Git 출력 시점 구성 규칙**: build 시 `LocationProfile.reservationChannels = clinic_profile.primary_ctas` 의 직접 reference (C-21 출력 필드 값 = ClinicProfile primary_ctas의 deep clone). `metadata.reservationChannelsInheritedFrom` marker 는 DB 안 의도 명시용 — Git 출력에서는 사용 안 함. M0 v1.0 다지점 합류 시 hybrid (지점 override + 본원 상속 default) cascade (LL-DEFER-04).
 303: - (LL-SCHEMA-19 · cycle1 LL-11 patch) `representativeDoctors`/`doctorsAtLocation`/`availableTreatments` 는 v0.3 빈 배열 — admin/ARCH § 3.8.1 자동 생성 표의 "ClinicProfile 등록 대표/전체 의료진/전체 시술" 매핑은 LocationProfile 편집 화면 합류 시점 (LL-DEFER-05). 빈 배열 의미는 SoT (DATA_MODEL C-21 optional).
 304: - (LL-SCHEMA-20) 본원 주소: 기존 column (street_address/address_locality/address_region/postal_code/address_country) 직접 사용 (metadata 가 아님).
 305: 
 306: ## 3. Form UI 재구성
 307: 
 308: ### 3.1 ClinicProfileForm 3 섹션 + 5 LegalDocument record (LL-FORM-01)
 309: 
 310: | 섹션 | 입력 필드 | 출력 계약 |
 311: |---|---|---|
 312: | **(a) 기관 정체성** (기존) | name · description · logoUrl · ogImageUrl · businessRegistrationNumber + 선택 필드 (alternateName · legalEntityName · slogan · longDescription · foundingDate · founder) | `ClinicProfile` (기존 column) |
 313: | **(b) 본원 위치·연락·시간** (신규) | streetAddress · addressLocality · addressRegion · postalCode · addressCountry · telephone · email · businessHours (7 요일 + 점심) · primaryCtas (3종 minimal · CT-03 SoT token: `phone`/`kakao-talk`/`naver-reservation` · cycle4 LL-51 patch) · featuredChannelId | `ClinicProfile.primary_ctas` + `LocationProfile`(slug=`main`) |
 314: | **(c) 정책 변수** (신규 보조 details) | policyContactPerson · policyContactEmail · policyContactPhone · policyEffectiveDate (5종 default) | `ClinicProfile.policy_*` |
 315: | **(d) 5종 LegalDocument** (신규 보조 details — cycle1 LL-15 patch) | 5 record 별 effectiveDate override (optional · 미입력 시 policyEffectiveDate default) | `LegalDocument` × 5 |
 316: 
 317: **결정**:
 318: - (LL-FORM-02) 한 화면 한 폼 (single `<form action>`) — server action 한 번 호출로 3계약 + 5 LegalDocument 동시 출력. 부분 저장 (섹션별 저장) 안 함.
 319: - (LL-FORM-03) 섹션 (b) 는 본원 위치 SoT 이므로 **모든 필드 required** (street/locality/region/postal/telephone). email 은 optional. businessHours 는 평일 (mon~fri) 5일 중 1일 이상 필수. primaryCtas 는 1건 이상 필수.
 320: - (LL-FORM-04 · cycle1 LL-14 patch) 섹션 (c) 는 LegalDocument 생성에 필수 — policyContactPerson · policyContactEmail · policyContactPhone · policyEffectiveDate **4 필드 모두 required**. (한국 PIPA 의 개인정보 보호책임자 필수 고지 항목 — 소속/부서 같은 추가 필드는 LL-DEFER 또는 자유 입력 textarea 로 처리. v0.2 는 4 필드만 minimal.)
 321: - (LL-FORM-05) URL scrape (v1.1) 는 (a) 만 prefill — (b)/(c)/(d) 는 외부 사이트 scrape 으로 추정 불가 / 부정확.
 322: - (LL-FORM-06) UX: 모든 섹션 펼친 상태 default. 선택 필드 (a 의 details) 은 그대로 접힘. (d) 5 record 도 default 접힘 (override 가 일반 케이스 아님).
 323: - (LL-FORM-07 · cycle1 LL-23 + cycle2 LL-35 patch) businessHours UI: 7 요일 행. 각 행: `[휴진 ☐]` + `오픈 [HH:mm] 마감 [HH:mm]` + `[점심 ☐]` + `점심 시작 [HH:mm] 종료 [HH:mm]`. 휴진 checked 시 다른 입력 disabled. **a11y 요구**: 각 row 에 `aria-labelledby` (요일 헤더 link) + 각 input `aria-describedby` (요일 에러 메시지 id) + 휴진 toggle 의 `aria-controls` (해당 row 의 input group id). **5 LegalDocument override details a11y (LL-FORM-14)**: `<details>` `<summary>` 는 기본적으로 keyboard interaction (Space/Enter toggle) + `aria-expanded` 자동. 추가로 `<summary>` 안에 정책 이름 + `(시행일: <date>)` 시각 표시 + `aria-controls` (override 입력 group id) + override 입력에 `aria-labelledby` (summary id) 명시.
 324: - (LL-FORM-08 · cycle1 LL-02 + cycle4 LL-51 patch) primaryCtas UI: **CT-03 SoT token 3종** (`phone` · `kakao-talk` · `naver-reservation`) 각각 1개씩 입력 행. 미입력 = 해당 채널 제외. 각 채널 row 입력 = `targetUrl` (필수: `tel:+82-2-1234-5678` · `https://pf.kakao.com/...` · `https://booking.naver.com/...`) + `label` (필수: 운영자 자유 입력) + `id` (자동 생성: `<type>-<n>`). featuredChannelId 는 입력한 채널 중 select. **단, 이는 ClinicProfile.primary_ctas 의 입력** — LocationProfile.reservationChannels 는 자동 상속 (LL-SCHEMA-18 build-time).
 325: 
 326: ### 3.2 검증
 327: 
 328: - (LL-FORM-09) zod schema 는 server action / form 양쪽 모두 동일 SoT — `apps/web/src/lib/clinic-profile-schema.ts` 신설.
 329: - (LL-FORM-10) businessHours 시간 정합 검증: open < close · lunch.from < lunch.to · lunch ∈ [open, close]. 위배 시 `(field=businessHours.monday.lunch, message=...)` 에러.
 330: - (LL-FORM-11) ISO 형식 검증: `addressCountry ^[A-Z]{2}$` · 시간 `^([01][0-9]|2[0-3]):[0-5][0-9]$` · email/phone regex.
 548: - `LL-DEFER-01`: LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제 · review-queued 전이 + ComplianceRecord pre-publish + NotificationEvent envelope · status=published). compliance-assistant Feature + ComplianceRecord UI cascade.
 549: - `LL-DEFER-09`: LegalDocument 편집 권한 분리 (operator-edit-legal ActionType — REVIEW_WORKFLOW 14 ActionType cascade).
 550: - `LL-DEFER-11`: LegalDocument body 검증 — CONTENT_STANDARDS § 7 ContentType 예외 marker cascade (LL-CASCADE-03). 추가 검증 룰은 compliance-assistant Feature.

codex
# LEGALDOC_WORKFLOW_INTEGRATION code v1.0 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=1 major=1 minor=1 (총 3)
- closeableAfterPatch: false
- 수렴 추세 추적: 이전 cycle 없음 — 본 cycle 이 첫

## blocking
- `LegalDocument`가 검수/발행 상태여도 ClinicProfile 저장으로 본문이 다시 쓰입니다. `ClinicProfileForm`은 항상 활성 상태로 렌더되고(`apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile/page.tsx:296`), 저장 액션은 5종 전부에 대해 `body`, `template_version`, `effective_date`, `contact_*`를 `DO UPDATE`로 갱신합니다(`apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile/actions.ts:277`, `:313-322`). 반면 status는 보존되어 `review-queued`, `publishable`, `published` 그대로 남습니다(`:323`, `:333`). SoT는 “검수 큐 진입 후 form 자체 read-only”를 요구합니다(`docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:681`). 현재는 legal 승인/발행 후 ClinicProfile 정책 변수 수정만으로 승인된 LegalDocument 본문을 바꿀 수 있고, DB guard도 `content_ref`/record phase만 확인해 본문 drift를 막지 않습니다(`packages/core-content/migrations/C0016_status_unlock.sql:260-299`). 최소한 LegalDocument가 `draft|rejected`가 아닐 때 해당 문서 본문 갱신을 차단하거나, 변경 시 status/compliance record를 새 draft 흐름으로 되돌리는 정책이 필요합니다.

## major
- workflow 버튼 action 후 clinic-profile 경로가 재검증되지 않습니다. 버튼은 clinic-profile 안에서 `contentType="LegalDocument"` / `contentRef={w.slug}`로 mount됩니다(`apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile/page.tsx:313-318`). 그런데 공용 action은 LegalDocument에 대해 `/admin/${slug}/legal-documents/${contentRef}`와 `/admin/${slug}`만 revalidate합니다(`apps/web/src/lib/compliance/entity-actions.ts:101`, `:188`). 현재 repo에서 `legal-documents` edit route도 보이지 않습니다. 결과적으로 검수 요청/발행 후 clinic-profile 화면의 상태 badge와 버튼이 stale 상태로 남을 수 있습니다. `/admin/${instanceSlug}/clinic-profile` revalidate가 필요합니다.

## minor
- workflow section은 `legalWorkflow.length > 0`이면 렌더되지만(`apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile/page.tsx:298`), 5종 중 일부가 없으면 `return null`로 조용히 빠집니다(`:305-307`). 정상 저장 경로는 5종을 한 트랜잭션에서 넣지만, 운영 DB drift/수동 복구 상황에서는 “5개 mount” invariant가 화면에서 깨집니다. `length === 5` 검증 또는 누락 row 경고가 더 안전합니다.

## acceptance precondition 점검
- 5 LegalDocument WorkflowActionButtons mount: PASS
- LegalDocument INSERT 'draft' + UPDATE 안 status 미수정: PASS
- audit current status (CAMC-12 정합): PASS
- LL-DEFER-01 부분 해소 marker: PASS
tokens used
78,953
# LEGALDOC_WORKFLOW_INTEGRATION code v1.0 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=1 major=1 minor=1 (총 3)
- closeableAfterPatch: false
- 수렴 추세 추적: 이전 cycle 없음 — 본 cycle 이 첫

## blocking
- `LegalDocument`가 검수/발행 상태여도 ClinicProfile 저장으로 본문이 다시 쓰입니다. `ClinicProfileForm`은 항상 활성 상태로 렌더되고(`apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile/page.tsx:296`), 저장 액션은 5종 전부에 대해 `body`, `template_version`, `effective_date`, `contact_*`를 `DO UPDATE`로 갱신합니다(`apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile/actions.ts:277`, `:313-322`). 반면 status는 보존되어 `review-queued`, `publishable`, `published` 그대로 남습니다(`:323`, `:333`). SoT는 “검수 큐 진입 후 form 자체 read-only”를 요구합니다(`docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md:681`). 현재는 legal 승인/발행 후 ClinicProfile 정책 변수 수정만으로 승인된 LegalDocument 본문을 바꿀 수 있고, DB guard도 `content_ref`/record phase만 확인해 본문 drift를 막지 않습니다(`packages/core-content/migrations/C0016_status_unlock.sql:260-299`). 최소한 LegalDocument가 `draft|rejected`가 아닐 때 해당 문서 본문 갱신을 차단하거나, 변경 시 status/compliance record를 새 draft 흐름으로 되돌리는 정책이 필요합니다.

## major
- workflow 버튼 action 후 clinic-profile 경로가 재검증되지 않습니다. 버튼은 clinic-profile 안에서 `contentType="LegalDocument"` / `contentRef={w.slug}`로 mount됩니다(`apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile/page.tsx:313-318`). 그런데 공용 action은 LegalDocument에 대해 `/admin/${slug}/legal-documents/${contentRef}`와 `/admin/${slug}`만 revalidate합니다(`apps/web/src/lib/compliance/entity-actions.ts:101`, `:188`). 현재 repo에서 `legal-documents` edit route도 보이지 않습니다. 결과적으로 검수 요청/발행 후 clinic-profile 화면의 상태 badge와 버튼이 stale 상태로 남을 수 있습니다. `/admin/${instanceSlug}/clinic-profile` revalidate가 필요합니다.

## minor
- workflow section은 `legalWorkflow.length > 0`이면 렌더되지만(`apps/web/src/app/(admin)/admin/[instanceSlug]/clinic-profile/page.tsx:298`), 5종 중 일부가 없으면 `return null`로 조용히 빠집니다(`:305-307`). 정상 저장 경로는 5종을 한 트랜잭션에서 넣지만, 운영 DB drift/수동 복구 상황에서는 “5개 mount” invariant가 화면에서 깨집니다. `length === 5` 검증 또는 누락 row 경고가 더 안전합니다.

## acceptance precondition 점검
- 5 LegalDocument WorkflowActionButtons mount: PASS
- LegalDocument INSERT 'draft' + UPDATE 안 status 미수정: PASS
- audit current status (CAMC-12 정합): PASS
- LL-DEFER-01 부분 해소 marker: PASS
