Reading prompt from stdin...
OpenAI Codex v0.130.0
--------
workdir: C:\Users\assag\solution\website-exposure\apps\web
model: gpt-5.5
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, C:\Users\assag\.codex\memories]
reasoning effort: none
reasoning summaries: none
session id: 019e39e0-b9ae-7ff0-a6f4-0cd3e2f38770
--------
user
Review `docs/decisions/EAT_CONTENT_PLAN.md` v0.6 cycle 6.

## Cycle 5 patch (1 major)

| # | severity | title | patch |
|---|---|---|---|
| ECP-36 | major | ARCH § 3.8.2 "어드민 화면 수 6개 유지" 잔재 | "P-013 자체 화면 없음 + M0 어드민 7개 (EAT v0.x cascade)" 로 정정 |

## Task

cycle 5 의 1건 검증. acceptance 신호 확인.

## Output (한국어 · 간결)

```
# EAT_CONTENT_PLAN v0.6 — cycle 6 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴: cycle1=22 → cycle2=8 → cycle3=3 → cycle4=2 → cycle5=1 → cycle6=N

## cycle 5 patch 검증
- ECP-36: PASS/FAIL + 한 줄

## new findings (있을 경우)

## acceptance 판정
- closeableAfterPatch=true 면 plan v1.0 acceptance commit 진행 권고
- 누계 36 findings
```

cycle 5 PASS + 새 finding 0 이면 closeableAfterPatch=true 확정.

codex
`seo-geo` skill은 이번 요청이 코드/문서 리뷰 검증이라 적용하지 않습니다. 문서의 해당 결정 항목과 주변 참조만 읽어서 cycle 5 패치가 실제로 반영됐는지 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"3\\.8\\.2|어드민 화면 수|P-013|M0 어드민|EAT v0|6개|7개\" docs/decisions/EAT_CONTENT_PLAN.md" in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'git status --short' in C:\Users\assag\solution\website-exposure\apps\web
2026-05-18T06:58:17.032043Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.6 seconds
Output:
rg: docs/decisions/EAT_CONTENT_PLAN.md: IO error for operation on docs/decisions/EAT_CONTENT_PLAN.md: 지정된 경로를 찾을 수 없습니다. (os error 3)

 exited 1 in 646ms:
rg: docs/decisions/EAT_CONTENT_PLAN.md: IO error for operation on docs/decisions/EAT_CONTENT_PLAN.md: 지정된 경로를 찾을 수 없습니다. (os error 3)

 succeeded in 653ms:
 M ../spike-a/package.json
 M ../spike-a/pgbouncer/userlist.txt
 M .env.example
 M package.json
 D src/app/(admin)/[instanceSlug]/articles/[slug]/page.tsx
 D src/app/(admin)/[instanceSlug]/articles/actions.ts
 D src/app/(admin)/[instanceSlug]/articles/new/page.tsx
 D src/app/(admin)/[instanceSlug]/articles/page.tsx
 D src/app/(admin)/[instanceSlug]/doctors/[slug]/page.tsx
 D src/app/(admin)/[instanceSlug]/doctors/actions.ts
 D src/app/(admin)/[instanceSlug]/doctors/new/page.tsx
 D src/app/(admin)/[instanceSlug]/doctors/page.tsx
 D src/app/(admin)/[instanceSlug]/page.tsx
 D src/app/(admin)/[instanceSlug]/treatments/[slug]/page.tsx
 D src/app/(admin)/[instanceSlug]/treatments/actions.ts
 D src/app/(admin)/[instanceSlug]/treatments/new/page.tsx
 D src/app/(admin)/[instanceSlug]/treatments/page.tsx
 M src/app/layout.tsx
 M src/app/page.tsx
 M src/app/sign-in/consume/route.ts
 M src/lib/env.ts
 M src/styles/globals.css
 M tailwind.config.ts
 M ../../docs/core/DATA_MODEL.md
 M ../../docs/core/PAGE_TYPES.md
 M ../../docs/core/SCHEMA_MAPPING.md
 M ../../docs/decisions/M0_BUILD_EXPORT_PLAN.md
 M ../../pnpm-lock.yaml
?? scripts/admin-qa-token.ts
?? scripts/seed-fixture.sql
?? scripts/site-scenarios.md
?? src/app/(admin)/admin/
?? src/app/(site)/
?? src/components/forms/ClinicProfileForm.tsx
?? src/components/site/
?? src/lib/db-projection.test.ts
?? src/lib/db-projection.ts
?? src/lib/errors.ts
?? src/lib/json-ld/
?? src/lib/markdown.test.ts
?? src/lib/markdown.ts
?? src/lib/public-db.ts
?? src/lib/public-tenant.ts
?? src/lib/site-initial.ts
?? src/lib/site-metadata.test.ts
?? src/lib/site-metadata.ts
?? src/lib/site-url.ts
?? vitest.config.ts
?? ../../docs/admin/ARCHITECTURE.md
?? ../../docs/core/CONTENT_STANDARDS.md
?? ../../docs/decisions/ADMIN_UI_SKELETON_PLAN.md
?? ../../docs/decisions/EAT_CONTENT_PLAN.md
?? ../../docs/decisions/LOCATION_LEGAL_PLAN.md
?? ../../docs/decisions/PUBLIC_SITE_RENDER_PLAN.md
?? ../../handoff/PROJECT_OVERVIEW.md
?? ../../handoff/codex-reviews/
?? ../../packages/core-content/migrations/C0002_location_profile.sql
?? ../../packages/core-content/migrations/C0006_legal_document.sql
?? ../../packages/core-content/migrations/C0008_location_profile_parent_clinic.sql
?? ../../packages/core-content/package.json
?? ../../packages/core-content/src/schema.ts
?? ../../packages/db/migrations/D0011_public_reader.sql
?? ../../packages/migrations-runner/src/

codex
문서는 앱 디렉터리 밖의 `../../docs/decisions`에 있습니다. 같은 검증을 실제 경로 기준으로 다시 수행하고, 잔재 표현이 남았는지 함께 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"3\\.8\\.2|어드민 화면 수|P-013|M0 어드민|EAT v0|6개|7개\" ..\\..\\docs\\decisions\\EAT_CONTENT_PLAN.md" in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"자체 화면 없음|어드민 6|어드민 7|admin.*6|admin.*7|6 screens|7 screens\" ..\\..\\docs\\decisions\\EAT_CONTENT_PLAN.md" in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 660ms:
738:| 2026-05-18 | v0.6 | **Codex 비평 cycle 5 1 major finding 전건 수용 patch — ARCH § 3.8.2 cascade**: (ECP-36) ARCH § 3.8.2 LegalDocument 자동 생성 규칙 "어드민 폼 처리" 안 "어드민 화면 수 6개 유지" 잔재 → "P-013 자체 화면 없음 + M0 어드민 7개 (EAT v0.x cascade)". 누계 cycle 1~5 = 36 findings 전건 수용. closeableAfterPatch=true 신호 (cycle 6 acceptance 신호 검증). |
739:| 2026-05-18 | v0.5 | **Codex 비평 cycle 4 2 findings (0 blocking + 1 major + 1 minor) 전건 수용 patch — ARCH § 3.8 cascade**: (ECP-34 major) ARCH § 3.8 표 "9종 + Article 1샘플 = 10개 페이지" → "10종 + Article 1샘플 = 11개 페이지" — P-011 FAQ row 추가 + P-002 About / P-004 Doctor Profile EAT v0.x Publication/MediaAppearance inline marker + 어드민 화면 수 6→7. (ECP-35 minor) PAGE_TYPES P-013/P-014 상세 "M0 어드민 화면 수 6개 유지" → "P-013/P-014 자체 화면 없음 (§ 6 어드민 7개 = 기존 6 + Faq 신규)". 누계 cycle 1+2+3+4 = 35 findings 전건 수용. closeableAfterPatch=true 신호 (다음 cycle 5 acceptance 신호 검증). |
740:| 2026-05-18 | v0.4 | **Codex 비평 cycle 3 3 findings (0 blocking + 1 major + 2 minor) 전건 수용 patch — PAGE_TYPES 내부 SoT 통일 + DATA_MODEL 한 페이지 요약 cascade**: (ECP-31 major) PAGE_TYPES § 5 matrix + § 6 목록 + 합류 우선순위 — P-011 FAQ M0 ✅ 일관 (§ 5 matrix 행 patch · § 6 페이지 #10 추가 + 어드민 화면 수 6→7 · 우선순위 P-011 strike-through). (ECP-32 minor) DATA_MODEL § 0 한 페이지 요약 "23개 계약 (C-01~C-23)" → "25개 계약 (C-01~C-25)". (ECP-33 minor) DATA_MODEL § 관계 다이어그램 ComplianceRecord contentRef 대상 범위 "C-01~C-22" → "C-01~C-25" — C-24 Publication · C-25 MediaAppearance 포함. 누계 cycle 1+2+3 = 33 findings 전건 수용. closeableAfterPatch=true 신호 (다음 cycle 4 acceptance 신호 검증). |
741:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 8 findings (4 blocking + 4 major + 0 minor) 전건 수용 patch — docs cascade 실 patch 진입**: (ECP-23·24·25·26 blocking 4건 + ECP-27·28·29·30 major 4건) plan 본문 명시한 docs cascade 가 실 patch 안 됨 — plan acceptance commit 안 docs cascade 동시 적용 결정 (LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합). 본 patch 사이클에서 다음 실 적용: (1) DATA_MODEL § 1.1 인벤토리 23 → 25 contracts + C-24 Publication · C-25 MediaAppearance row 추가 + C-12 FAQ M0 ✅ + C-04 Article category required 명시. (2) DATA_MODEL § 4 C-10 contentType enum v0.6 — +Publication +MediaAppearance (17종). (3) DATA_MODEL § 4 C-22 ArticleCategory marker (DB 실 운영 합류 marker + EC-DEFER-10). (4) DATA_MODEL § 4 C-12 FAQ 풀명세 (question 10~200 · answer Markdown 50~2000 · v0.1 DB CHECK draft 만). (5) DATA_MODEL § 4 C-24 Publication 풀명세 (외부 학술 인용 · risk Low fixed). (6) DATA_MODEL § 4 C-25 MediaAppearance 풀명세 (모든 channel_type → VideoObject 단일화 v0.1). (7) PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 페이지 합계 11. (8) SCHEMA_MAPPING § 2 entity 카탈로그 — ScholarlyArticle 추가 · VideoObject MediaAppearance 매핑 추가 · FAQPage EAT v0.x M0 합류 + Answer.text helper marker. (9) CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 — Publication/MediaAppearance 면제 + FAQ Q/A 적용. (10) ARCH § 3.11 게이트 #1 — 11 페이지 + P-011 FAQ 합류. (11) M0_BUILD_EXPORT § 2.2 EAT 4 entity 변환 표. (12) PUBLIC_SITE_RENDER § 9.3 PSR-DEFER-11/15 해소 marker. (13) packages/migrations-runner/src/manifest.ts orderedMigrations 16 entry (C0009/10/11/12/13 + D0014). 코드 cascade (migrations 실 SQL · 어드민 폼 · Article detail SQL JOIN 등) 는 별도 EAT_CONTENT code v1.0 cycle. 누계 cycle 1+2 = 30 findings 전건 수용. |

 succeeded in 694ms:
738:| 2026-05-18 | v0.6 | **Codex 비평 cycle 5 1 major finding 전건 수용 patch — ARCH § 3.8.2 cascade**: (ECP-36) ARCH § 3.8.2 LegalDocument 자동 생성 규칙 "어드민 폼 처리" 안 "어드민 화면 수 6개 유지" 잔재 → "P-013 자체 화면 없음 + M0 어드민 7개 (EAT v0.x cascade)". 누계 cycle 1~5 = 36 findings 전건 수용. closeableAfterPatch=true 신호 (cycle 6 acceptance 신호 검증). |
739:| 2026-05-18 | v0.5 | **Codex 비평 cycle 4 2 findings (0 blocking + 1 major + 1 minor) 전건 수용 patch — ARCH § 3.8 cascade**: (ECP-34 major) ARCH § 3.8 표 "9종 + Article 1샘플 = 10개 페이지" → "10종 + Article 1샘플 = 11개 페이지" — P-011 FAQ row 추가 + P-002 About / P-004 Doctor Profile EAT v0.x Publication/MediaAppearance inline marker + 어드민 화면 수 6→7. (ECP-35 minor) PAGE_TYPES P-013/P-014 상세 "M0 어드민 화면 수 6개 유지" → "P-013/P-014 자체 화면 없음 (§ 6 어드민 7개 = 기존 6 + Faq 신규)". 누계 cycle 1+2+3+4 = 35 findings 전건 수용. closeableAfterPatch=true 신호 (다음 cycle 5 acceptance 신호 검증). |

codex
`EAT_CONTENT_PLAN.md`의 v0.6 변경 이력에는 ECP-36 수용 기록이 있습니다. 실제 패치 대상인 `ARCHITECTURE.md` §3.8.2도 확인해서 acceptance 신호가 기록만이 아니라 본문에 반영됐는지 검증합니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"3\\.8\\.2|LegalDocument|어드민 화면 수 6개 유지|P-013 자체 화면 없음|M0 어드민 7개|EAT v0\\.x cascade\" ..\\..\\docs\\admin\\ARCHITECTURE.md" in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"어드민 화면 수 6개 유지|M0 어드민 화면 수 6개|어드민 6개 유지|6개 유지\" ..\\..\\docs" in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 604ms:
125:| ② | 사이트 기본 정보 | 의료기관 정체성 + 본원 위치·연락·시간 + 정책 변수 입력 (3 섹션) | `ClinicProfile` + `LocationProfile`(main) + `LegalDocument`(privacy·terms 등) | 3 계약 동시 출력 — § 3.8.1 / § 3.8.2 자동 생성 규칙 적용 |
139:| `LegalDocument` (C-16) | `documentType`·`title`·`effectiveDate`·`contactPerson` (`body`는 Core 표준 템플릿 + 변수 자동 치환) | ✅ (Core 표준 템플릿 + ClinicProfile + LocationProfile 변수) | ClinicProfile 화면 (정책 변수 보조 섹션) — § 3.8.2 |
144:| `ComplianceRecord` (C-10) | 위험도·자동 검수 결과·검수자·일자·발행자·발행일 (LegalDocument는 `legalCounsel`·`legalCounselAt` 필수 — § 3.8.2) | ✅ (어드민이 발행 시 기록) | 미리보기·발행 화면 |
185:| **9** | **P-013 Legal / Policy (자동 생성)** | **출시 게이트** — Core 표준 템플릿 + ClinicProfile 변수 치환. 법무 검토 필수 (§ 3.8.2 규칙) |
189:→ Slice **어드민 화면 수 7개 (EAT v0.x cascade)** — 기존 6개 + Faq 신규. P-012·P-014·P-013은 자동 생성. EAT v0.x 4 신규 entity (Publication·MediaAppearance·Faq·ArticleCategory) 어드민 폼은 코드 cycle에서 별도 합류.
220:### 3.8.2 LegalDocument 자동 생성 규칙
224:| LegalDocument 필드 | 자동 생성 값 |
244:| policy | `{{policy.contactPerson}}` | ClinicProfile.policyContactPerson — § 3.8.2 "정책 변수" 보조 섹션 입력 |
247:| policy | `{{policy.effectiveDate}}` | ClinicProfile.policyEffectiveDate (LegalDocument 별 override 우선) |
249:**어드민 폼 처리**: ClinicProfile 폼에 "정책 변수" 보조 섹션 추가 (개인정보 보호 책임자명·연락처·정책 효력 발생일 등 입력). P-013 자체는 별도 화면 없음 (ClinicProfile 보조 섹션). M0 어드민 화면 수는 EAT v0.x cascade 로 **7개** (기존 6 + Faq 신규).
252:- LegalDocument는 위험도 기본 Low이지만, **법무 검토 필수**. 표준 위험도 룰(High일 때만 권장)과 별도 예외 게이트.
254:  - `contentType` = `LegalDocument`
287:| `(admin)` | `/admin/<instanceSlug>/...` | 운영자 어드민 — ClinicProfile · DoctorProfile · TreatmentPage · Article · LegalDocument 입력/편집 | ADMIN_UI_SKELETON code v1.0 합류 (현재 `/<instanceSlug>/...` → `/admin/<instanceSlug>/...` 격상 cascade는 PUBLIC_SITE_RENDER code v1.0 cycle 안 동반 — PSR-CASCADE-01b) |
360:| ClinicProfile 화면 | (a) 기관 정체성 / (b) 본원 위치·연락·시간 / (c) 정책 변수 (보조) | `ClinicProfile` + `LocationProfile`(main) + `LegalDocument`(privacy·terms 등 자동 생성) |
516:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **§ 3.8.1 표현 정리** — 계약 필드(파일 출력)와 어드민 폼 입력 필드(UI 수집)의 구분 명시. ClinicProfile 폼은 두 섹션(기관 정체성 + 본원 위치·연락·시간)으로 출력은 ClinicProfile + LocationProfile main 두 파일, (2) **§ 3.8.2 LegalDocument 자동 생성 규칙 신규** — Core 표준 템플릿 + ClinicProfile 변수 치환, ComplianceRecord 추적, (3) **§ 3.8 Slice 9종+1샘플 → 10종+1샘플=10페이지** (P-013 격상 추가), (4) § 3.11 완료 게이트 #1 10종, (5) **§ 5.2 데이터 입력 영역** — 어드민 화면별 입력·출력 매핑 표 추가로 1:1이 아님 명시 | Glitzy (Claude 페어링) |
517:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **§ 3.3 ClinicProfile 행 분리** — 이전 v0.3 잔존 표현(ClinicProfile에 주소·전화·시간)을 SoT 정합으로 정정. ClinicProfile/LocationProfile(main)/LegalDocument 3개 계약 행 + 자동 생성 표시, (2) **§ 3.8.2 LegalDocument body 변수 출처 정정** — ClinicProfile + LocationProfile(main) 두 SoT 명시 (`{{clinic.*}}`·`{{location.main.*}}` 네임스페이스), (3) **§ 3.8.2 법무 검토 강제 룰** — LegalDocument는 위험도 Low이지만 ComplianceRecord.legalCounsel·legalCounselAt 필수 (어드민 발행 게이트 차단) | Glitzy (Claude 페어링) |
518:| 2026-05-14 | v0.7 | **피드백 정정**: § 3.2 Slice 6개 화면 표 — ② 사이트 기본 정보의 입력 데이터 `ClinicProfile`만 → **`ClinicProfile` + `LocationProfile`(main) + `LegalDocument`** 3 계약 동시 출력로 정정. § 3.8.1/§ 3.8.2와 정합 | Glitzy (Claude 페어링) |

 succeeded in 634ms:
..\..\docs\decisions\EAT_CONTENT_PLAN.md:738:| 2026-05-18 | v0.6 | **Codex 비평 cycle 5 1 major finding 전건 수용 patch — ARCH § 3.8.2 cascade**: (ECP-36) ARCH § 3.8.2 LegalDocument 자동 생성 규칙 "어드민 폼 처리" 안 "어드민 화면 수 6개 유지" 잔재 → "P-013 자체 화면 없음 + M0 어드민 7개 (EAT v0.x cascade)". 누계 cycle 1~5 = 36 findings 전건 수용. closeableAfterPatch=true 신호 (cycle 6 acceptance 신호 검증). |
..\..\docs\decisions\EAT_CONTENT_PLAN.md:739:| 2026-05-18 | v0.5 | **Codex 비평 cycle 4 2 findings (0 blocking + 1 major + 1 minor) 전건 수용 patch — ARCH § 3.8 cascade**: (ECP-34 major) ARCH § 3.8 표 "9종 + Article 1샘플 = 10개 페이지" → "10종 + Article 1샘플 = 11개 페이지" — P-011 FAQ row 추가 + P-002 About / P-004 Doctor Profile EAT v0.x Publication/MediaAppearance inline marker + 어드민 화면 수 6→7. (ECP-35 minor) PAGE_TYPES P-013/P-014 상세 "M0 어드민 화면 수 6개 유지" → "P-013/P-014 자체 화면 없음 (§ 6 어드민 7개 = 기존 6 + Faq 신규)". 누계 cycle 1+2+3+4 = 35 findings 전건 수용. closeableAfterPatch=true 신호 (다음 cycle 5 acceptance 신호 검증). |

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content ..\\..\\docs\\admin\\ARCHITECTURE.md | Select-Object -Skip 180 -First 75" in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content ..\\..\\docs\\decisions\\EAT_CONTENT_PLAN.md | Select-Object -Skip 720 -First 24" in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 643ms:
- `EC-CASCADE-02`: `docs/core/SCHEMA_MAPPING.md` patches:
  - § 1.2 `@id` 패턴 (ScholarlyArticle · VideoObject — fragment-scoped 운영) v0.1.
  - § 2 entity 카탈로그 — ScholarlyArticle · VideoObject (모든 channel_type) · FAQPage · Question · Answer 추가.
  - § 3 P-011 FAQ graph + P-002/P-004 graph 확장 (ScholarlyArticle/VideoObject 풀 entity).
- `EC-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7.1.1.x ContentType 예외 표 — Publication/MediaAppearance 면제 · FAQ Q/A 적용.
- `EC-CASCADE-04`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2.1 SSR 재사용 표 — 신규 4 entity (article_category · publication · media_appearance · faq) Git output 변환 marker.
- `EC-CASCADE-05`: `packages/db/migrations/D0014_public_reader_eat.sql` 신규 — D0011 per-table GRANT/policy 패턴 정합.
- `EC-CASCADE-06`: `packages/migrations-runner/src/manifest.ts` — 16 단계 (cycle 1 ECP-04 정정) + 각 entry 의 dependsOn 명시.
- `EC-CASCADE-07`: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` — PSR-DEFER-11 부분 (FAQ) + PSR-DEFER-15 (Article category) 해소 marker.
- `EC-CASCADE-08` (cycle 1 ECP-12 정정 — acceptance precondition 격상): `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ M0 ✅ + § 3 P-011 본문 작성 (질문 위계 + AEO 친화).
- `EC-CASCADE-09` (cycle 1 ECP-22 정정): `docs/admin/ARCHITECTURE.md` § 3 Slice 페이지 합계 = **11페이지** (기존 9 + P-010 1샘플 + P-011 FAQ). ArticleCategory 는 어드민 운영 routing 추가지만 공개 페이지 count 에는 포함 안 됨 (Article URL prefix 만 변경).

## 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-18 | v0.1 | 초안 작성. Codex 자동 비평 사이클 진입 전 base. |
| 2026-05-18 | v0.6 | **Codex 비평 cycle 5 1 major finding 전건 수용 patch — ARCH § 3.8.2 cascade**: (ECP-36) ARCH § 3.8.2 LegalDocument 자동 생성 규칙 "어드민 폼 처리" 안 "어드민 화면 수 6개 유지" 잔재 → "P-013 자체 화면 없음 + M0 어드민 7개 (EAT v0.x cascade)". 누계 cycle 1~5 = 36 findings 전건 수용. closeableAfterPatch=true 신호 (cycle 6 acceptance 신호 검증). |
| 2026-05-18 | v0.5 | **Codex 비평 cycle 4 2 findings (0 blocking + 1 major + 1 minor) 전건 수용 patch — ARCH § 3.8 cascade**: (ECP-34 major) ARCH § 3.8 표 "9종 + Article 1샘플 = 10개 페이지" → "10종 + Article 1샘플 = 11개 페이지" — P-011 FAQ row 추가 + P-002 About / P-004 Doctor Profile EAT v0.x Publication/MediaAppearance inline marker + 어드민 화면 수 6→7. (ECP-35 minor) PAGE_TYPES P-013/P-014 상세 "M0 어드민 화면 수 6개 유지" → "P-013/P-014 자체 화면 없음 (§ 6 어드민 7개 = 기존 6 + Faq 신규)". 누계 cycle 1+2+3+4 = 35 findings 전건 수용. closeableAfterPatch=true 신호 (다음 cycle 5 acceptance 신호 검증). |
| 2026-05-18 | v0.4 | **Codex 비평 cycle 3 3 findings (0 blocking + 1 major + 2 minor) 전건 수용 patch — PAGE_TYPES 내부 SoT 통일 + DATA_MODEL 한 페이지 요약 cascade**: (ECP-31 major) PAGE_TYPES § 5 matrix + § 6 목록 + 합류 우선순위 — P-011 FAQ M0 ✅ 일관 (§ 5 matrix 행 patch · § 6 페이지 #10 추가 + 어드민 화면 수 6→7 · 우선순위 P-011 strike-through). (ECP-32 minor) DATA_MODEL § 0 한 페이지 요약 "23개 계약 (C-01~C-23)" → "25개 계약 (C-01~C-25)". (ECP-33 minor) DATA_MODEL § 관계 다이어그램 ComplianceRecord contentRef 대상 범위 "C-01~C-22" → "C-01~C-25" — C-24 Publication · C-25 MediaAppearance 포함. 누계 cycle 1+2+3 = 33 findings 전건 수용. closeableAfterPatch=true 신호 (다음 cycle 4 acceptance 신호 검증). |
| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 8 findings (4 blocking + 4 major + 0 minor) 전건 수용 patch — docs cascade 실 patch 진입**: (ECP-23·24·25·26 blocking 4건 + ECP-27·28·29·30 major 4건) plan 본문 명시한 docs cascade 가 실 patch 안 됨 — plan acceptance commit 안 docs cascade 동시 적용 결정 (LOCATION_LEGAL/PUBLIC_SITE_RENDER 패턴 정합). 본 patch 사이클에서 다음 실 적용: (1) DATA_MODEL § 1.1 인벤토리 23 → 25 contracts + C-24 Publication · C-25 MediaAppearance row 추가 + C-12 FAQ M0 ✅ + C-04 Article category required 명시. (2) DATA_MODEL § 4 C-10 contentType enum v0.6 — +Publication +MediaAppearance (17종). (3) DATA_MODEL § 4 C-22 ArticleCategory marker (DB 실 운영 합류 marker + EC-DEFER-10). (4) DATA_MODEL § 4 C-12 FAQ 풀명세 (question 10~200 · answer Markdown 50~2000 · v0.1 DB CHECK draft 만). (5) DATA_MODEL § 4 C-24 Publication 풀명세 (외부 학술 인용 · risk Low fixed). (6) DATA_MODEL § 4 C-25 MediaAppearance 풀명세 (모든 channel_type → VideoObject 단일화 v0.1). (7) PAGE_TYPES § 1.1 P-011 M0 ✅ + § 6 페이지 합계 11. (8) SCHEMA_MAPPING § 2 entity 카탈로그 — ScholarlyArticle 추가 · VideoObject MediaAppearance 매핑 추가 · FAQPage EAT v0.x M0 합류 + Answer.text helper marker. (9) CONTENT_STANDARDS § 7.1.1.2 ContentType 예외 표 — Publication/MediaAppearance 면제 + FAQ Q/A 적용. (10) ARCH § 3.11 게이트 #1 — 11 페이지 + P-011 FAQ 합류. (11) M0_BUILD_EXPORT § 2.2 EAT 4 entity 변환 표. (12) PUBLIC_SITE_RENDER § 9.3 PSR-DEFER-11/15 해소 marker. (13) packages/migrations-runner/src/manifest.ts orderedMigrations 16 entry (C0009/10/11/12/13 + D0014). 코드 cascade (migrations 실 SQL · 어드민 폼 · Article detail SQL JOIN 등) 는 별도 EAT_CONTENT code v1.0 cycle. 누계 cycle 1+2 = 30 findings 전건 수용. |
| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 22 findings (7 blocking + 10 major + 5 minor) 전건 수용 patch**: (ECP-01) C-24/25 Publication/MediaAppearance · C-12 FAQ 풀명세 합류 · C-22 ArticleCategory 실 운영 합류 — DATA_MODEL 인벤토리 25 contracts. (ECP-02) C-22 풀명세 컬럼 전체 DB 추가 (v0.1 UI minimal · EC-DEFER-10). (ECP-03) Article.category_id staged 4-step migration (ADD nullable + seed + backfill + SET NOT NULL). (ECP-04) manifest 16단계 + 각 dependsOn 명시. (ECP-05·14) MediaAppearance 모든 channel_type → VideoObject 단일화 · fragment `#video-{slug}` 단일 · BroadcastEvent/NewsArticle 분기는 EC-DEFER-11. (ECP-06) Doctor/About graph self-contained — Publication/Media 풀 entity 출력. cross-page allowlist 미사용. (ECP-07) C-10 contentType enum +Publication +MediaAppearance v0.6 cascade. FAQ 토큰 대문자 통일. (ECP-08) DOI regex DB·zod 동일 anchored. (ECP-09) default `general` ArticleCategory seed = seed.ts + C0013 마이그레이션 backfill. (ECP-10·11) v0.1 단계 4 entity 어드민 status='draft' 강제 — FAQ DB CHECK + zod enum subset. EC-DEFER-12 신설. (ECP-12) PAGE_TYPES P-011 M0 ✅ — EC-CASCADE-08 acceptance precondition 격상. (ECP-13) Publication/Media `@id` fragment-scoped (Doctor/About page URL + fragment). (ECP-15) About publication/media reference 는 MedicalClinic.subjectOf 단일 결정. (ECP-16) ArticleCategory taxonomy public 의도 명시 — status 게이트 없음 + EC-DEFER-10. (ECP-17) Article detail SQL JOIN article_category · category.slug 매칭 작업 명시. (ECP-18) `authors` DEFAULT 제거. (ECP-19) `renderMarkdownToPlainText` helper 신규 — JSON-LD Answer.text. (ECP-20) external link rel `nofollow noopener noreferrer` 통일. (ECP-21) FAQ 빈 페이지 200 + sitemap 포함 + lastmod fallback. (ECP-22) Slice 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ. |

 succeeded in 648ms:
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

codex
# EAT_CONTENT_PLAN v0.6 — cycle 6 review

## summary
- 본 cycle 지적 수: blocking=0 major=0 minor=0 (총 0)
- closeableAfterPatch: true
- 수렴: cycle1=22 → cycle2=8 → cycle3=3 → cycle4=2 → cycle5=1 → cycle6=0

## cycle 5 patch 검증
- ECP-36: PASS — ARCH § 3.8.2 본문이 `P-013 자체는 별도 화면 없음` + `M0 어드민 화면 수 ... 7개`로 정정됐고, 문제 표현 잔재는 변경 이력 외 본문에서 미검출.

## acceptance 판정
- closeableAfterPatch=true 이므로 plan v1.0 acceptance commit 진행 권고
- 누계 36 findings
tokens used
15,820
# EAT_CONTENT_PLAN v0.6 — cycle 6 review

## summary
- 본 cycle 지적 수: blocking=0 major=0 minor=0 (총 0)
- closeableAfterPatch: true
- 수렴: cycle1=22 → cycle2=8 → cycle3=3 → cycle4=2 → cycle5=1 → cycle6=0

## cycle 5 patch 검증
- ECP-36: PASS — ARCH § 3.8.2 본문이 `P-013 자체는 별도 화면 없음` + `M0 어드민 화면 수 ... 7개`로 정정됐고, 문제 표현 잔재는 변경 이력 외 본문에서 미검출.

## acceptance 판정
- closeableAfterPatch=true 이므로 plan v1.0 acceptance commit 진행 권고
- 누계 36 findings
