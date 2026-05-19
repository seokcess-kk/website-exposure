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
session id: 019e39bf-42f4-7142-88b2-80c271f25567
--------
user
You are reviewing the **plan** `docs/decisions/EAT_CONTENT_PLAN.md` v0.1 (draft). This is the **first** Codex critique cycle. Produce a strict, broad review covering plan SoT cascade, data model, schema.org JSON-LD, admin form patterns, public render integration, scenarios.

## SoT to read first

1. `docs/decisions/EAT_CONTENT_PLAN.md` v0.1 — plan under review (EC-SCHEMA-01~19, EC-FORM-01~08, EC-RENDER-01~10, EC-SEO-01~04, EC-CONTENT-01~03, EC-CASCADE-01~09)
2. `docs/core/DATA_MODEL.md` v0.9 — § 4 C-01~C-22 풀명세 패턴 (C-25/26/27 신설 SoT)
3. `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ + § 3 페이지 본문 (M0 미합류 → 본 plan 합류)
4. `docs/core/SCHEMA_MAPPING.md` § 1.2 @id · § 2 entity 카탈로그 · § 3 P-011 graph
5. `docs/core/SEARCH_STANDARDIZATION.md` § 4.3 sitemap changefreq/priority
6. `docs/core/CONTENT_STANDARDS.md` v1.3 § 7.1.1 ContentType 예외
7. `docs/compliance/RISK_LEVELS.md` v1.1 § 2 자동 추론
8. `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v1.0 § 1.3 PSR-DEFER-11 (FAQ) + PSR-DEFER-15 (Article category)
9. `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — LegalDocument 패턴 (status='draft' + RLS published only) 비교
10. `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2.1 SSR 재사용 표
11. `packages/db/migrations/D0011_public_reader.sql` — D0014 cascade target
12. `packages/migrations-runner/src/manifest.ts` — 14 단계 cascade
13. `packages/core-content/src/schema.ts` v0.3 — Drizzle SoT 패턴
14. `apps/web/src/lib/json-ld/__tests__/validate.ts` — cross-page allowlist 확장 target
15. `apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts` — 어드민 server action 패턴
16. `apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx` — Article category URL `[category]` 매핑

## What to check (cycle 1)

### Plan SoT 합치
- 모든 EC-* 결정이 reference SoT 와 일관
- C-25/26/27 신규 entity ID 번호 — DATA_MODEL § 1.1 인벤토리 정합 (기존 C-23 AdminUser · C-24 미사용 또는 사용 여부 확인)
- C-22 ArticleCategory — 기존 DATA_MODEL § 4 C-22 풀명세와 본 plan EC-SCHEMA-01~04 의 column 정합
- PSR-DEFER-11 (FAQ) · PSR-DEFER-15 (Article category) 해소 — PUBLIC_SITE_RENDER_PLAN cascade 정합
- D0014 cascade — D0011 의 per-table policy 패턴 정확 재현
- migration 의존성 (C0009~C0013 · D0014) 순서 정합

### 데이터 모델 결정
- Publication / MediaAppearance / Faq 의 column 필수성 (`url required` · `summary required` · authors[] min 1)
- DOI 정규식 `10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$` 정확성 (CrossRef 표준)
- PubMed ID 정규식 `^[0-9]{1,9}$` 의 실 운영 범위
- `media_channel_type` enum 4종 (broadcast/youtube/podcast/press) — JSON-LD 분기 (VideoObject vs BroadcastEvent vs NewsArticle) 정합
- composite FK (instance_id, author_doctor_id) → doctor_profile 의 same-tenant 보장
- `risk_level='Low'` CHECK — Publication/Media 강제. Faq 는 자동 추론 대상 (default Low)
- ArticleCategory flat 1-level — parent_id 없음 결정
- article.category_id ALTER + backfill 데이터 마이그레이션 결정 — 기존 row 있을 시 default `general` row 의 id 로 backfill

### JSON-LD / SEO
- ScholarlyArticle 의 `@id` 패턴 — `{base}/publications/{slug}#scholarly` · v0.1 단계 별도 페이지 없으므로 cross-page allowlist 추가 정합
- VideoObject vs BroadcastEvent vs NewsArticle 분기 SoT — channel_type 별 entity type
- FAQPage `mainEntity` Question/Answer array — Markdown 본문을 text 로 strip 변환 결정 (HTML stripped vs Markdown 그대로)
- Doctor Profile P-004 의 Physician.subjectOf / Physician.knownFor — schema.org 표준 vs 운영 단순화
- About P-002 의 MedicalClinic.subjectOf — 모든 published Publication/Media 출력 정합
- cross-page allowlist 확장 (`#faqpage` · `#scholarly` · `#video`) — multi-tenant tenant base path 검사 정합 (PSRC-20 정합)

### 어드민 폼 / server action
- M0 3-entity 폼 패턴 재사용 (zod schema · server action · isNextControlFlowError · mapDbErrorToResult)
- audit emit payload shape `{contentType, slug, mode, status, originalSlug}` 통일 (4 신규 contentType — Publication/MediaAppearance/Faq/ArticleCategory)
- status 9-state 운영 — review-queued 차단 (compliance-assistant 합류 전) marker
- Faq displayOrder · publication/media authorDoctorId dropdown · faq categoryId dropdown — 어드민 UI 정합

### CONTENT_STANDARDS · RISK_LEVELS
- Publication/MediaAppearance 면제 vs Faq 적용 — 외부 인용 vs 클리닉 자체 답변 구분 정합
- Faq Q/A 광고 표현 검수 — MEDICAL_AD_COMPLIANCE_COMMON 정합 (의료법 제56조 광고 표현)
- Faq risk_level 자동 추론 — RISK_LEVELS § 2 의 의료 질문 분류 정합

### 시나리오 24~33
- 통과 기준 정확성 + DB CHECK 정합

### Cascade markers (acceptance precondition)
- EC-CASCADE-01: DATA_MODEL § 4 C-25/26/27 풀명세 추가
- EC-CASCADE-02: SCHEMA_MAPPING § 2/§ 3
- EC-CASCADE-03: CONTENT_STANDARDS § 7.1.1.x
- EC-CASCADE-04: M0_BUILD_EXPORT_PLAN § 2.1
- EC-CASCADE-05: D0014 신규 migration (D0011 cascade)
- EC-CASCADE-06: manifest 14 단계
- EC-CASCADE-07: PUBLIC_SITE_RENDER PSR-DEFER 해소
- EC-CASCADE-08: PAGE_TYPES P-011
- EC-CASCADE-09: ARCH § 3 Vertical Slice

## Output format

```
# EAT_CONTENT_PLAN v0.1 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>

## blocking
- **ECP-01**: <짧은 제목>
  - 위치: <file>:<line> 또는 <doc § ...>
  - 근거(SoT): <인용>
  - 문제: ...
  - 권장 patch: ...

## major
## minor

## cascade marker / acceptance precondition 점검
- EC-CASCADE-01~09: <PASS|FAIL|TBD>
```

가능한 한 광범위하게 보고, 추측이 아니라 SoT 파일을 직접 line 단위로 인용하라. 한국어로 응답.

codex
요청하신 형식대로 plan 자체와 지정 SoT를 먼저 대조하겠습니다. 라인 단위 근거가 필요하니 관련 문서를 좁게 열어 결정문과 충돌 지점을 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "C-2[2-7]|ArticleCategory|Publication|MediaAppearance|Faq|AdminUser|doctor_profile|ContentType|risk_level|authors|doi|pubmed|url|summary" docs/core/DATA_MODEL.md' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "P-011|FAQ|본문|body|Article category|category|PSR-DEFER|subjectOf|knownFor|@id|FAQPage|Question|Answer|ScholarlyArticle|VideoObject|BroadcastEvent|NewsArticle|changefreq|priority|ContentType|자동 추론|Low|public_reader|policy|ALTER|manifest|C001|D0014" docs/core/PAGE_TYPES.md docs/core/SCHEMA_MAPPING.md docs/core/SEARCH_STANDARDIZATION.md docs/core/CONTENT_STANDARDS.md docs/compliance/RISK_LEVELS.md docs/decisions/PUBLIC_SITE_RENDER_PLAN.md docs/decisions/LOCATION_LEGAL_PLAN.md docs/decisions/M0_BUILD_EXPORT_PLAN.md packages/db/migrations/D0011_public_reader.sql packages/migrations-runner/src/manifest.ts packages/core-content/src/schema.ts apps/web/src/lib/json-ld/__tests__/validate.ts apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "''^(#|##|###|EC-|C-|P-|PSR-|D0014|Publication|MediaAppearance|Faq|ArticleCategory|FAQ|ScholarlyArticle|VideoObject|BroadcastEvent|NewsArticle|EC-CASCADE|EC-SCHEMA|EC-FORM|EC-RENDER|EC-SEO|EC-CONTENT)" docs/decisions/EAT_CONTENT_PLAN.md' in C:\Users\assag\solution\website-exposure\apps\web
2026-05-18T06:21:54.395278Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.7 seconds
Output:
rg: docs/decisions/EAT_CONTENT_PLAN.md: IO error for operation on docs/decisions/EAT_CONTENT_PLAN.md: 지정된 경로를 찾을 수 없습니다. (os error 3)

2026-05-18T06:21:54.400850Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.7 seconds
Output:
rg: docs/core/DATA_MODEL.md: IO error for operation on docs/core/DATA_MODEL.md: 지정된 경로를 찾을 수 없습니다. (os error 3)

 exited 1 in 715ms:
rg: docs/core/DATA_MODEL.md: IO error for operation on docs/core/DATA_MODEL.md: 지정된 경로를 찾을 수 없습니다. (os error 3)

 exited 1 in 697ms:
rg: docs/decisions/EAT_CONTENT_PLAN.md: IO error for operation on docs/decisions/EAT_CONTENT_PLAN.md: 지정된 경로를 찾을 수 없습니다. (os error 3)

2026-05-18T06:21:54.557294Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.9 seconds
Output:
[31;1madmin: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … src/lib/json-ld/__tests__/validate.ts apps/web/src/app/([36;1madmin[0m)/admin/ …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                           ~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'admin' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

 exited 1 in 880ms:
[31;1madmin: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … src/lib/json-ld/__tests__/validate.ts apps/web/src/app/([36;1madmin[0m)/admin/ …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                           ~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'admin' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

codex
현재 작업 디렉터리가 `apps/web`라서 문서 경로는 repo 루트 기준 두 단계 위에 있습니다. 경로를 보정하고, PowerShell에서 괄호가 있는 Next.js 라우트 경로는 따옴표로 감싸 다시 조회하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "''^(#|##|###|EC-|C-|P-|PSR-|D0014|Publication|MediaAppearance|Faq|ArticleCategory|FAQ|ScholarlyArticle|VideoObject|BroadcastEvent|NewsArticle|EC-CASCADE|EC-SCHEMA|EC-FORM|EC-RENDER|EC-SEO|EC-CONTENT)" ..'"\\..\\docs\\decisions\\EAT_CONTENT_PLAN.md" in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"C-2[2-7]|ArticleCategory|Publication|MediaAppearance|Faq|AdminUser|doctor_profile|ContentType|risk_level|authors|doi|pubmed|url|summary|parent_id|category_id|general\" ..\\..\\docs\\core\\DATA_MODEL.md" in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"P-011|FAQ|본문|body|Article category|category|PSR-DEFER|subjectOf|knownFor|@id|FAQPage|Question|Answer|ScholarlyArticle|VideoObject|BroadcastEvent|NewsArticle|changefreq|priority|ContentType|자동 추론|Low|public_reader|policy|ALTER|manifest|C001|D0014\" ..\\..\\docs\\core\\PAGE_TYPES.md ..\\..\\docs\\core\\SCHEMA_MAPPING.md ..\\..\\docs\\core\\SEARCH_STANDARDIZATION.md ..\\..\\docs\\core\\CONTENT_STANDARDS.md ..\\..\\docs\\compliance\\RISK_LEVELS.md ..\\..\\docs\\decisions\\PUBLIC_SITE_RENDER_PLAN.md ..\\..\\docs\\decisions\\LOCATION_LEGAL_PLAN.md ..\\..\\docs\\decisions\\M0_BUILD_EXPORT_PLAN.md ..\\..\\packages\\db\\migrations\\D0011_public_reader.sql ..\\..\\packages\\migrations-runner\\src\\manifest.ts ..\\..\\packages\\core-content\\src\\schema.ts \"src\\lib\\json-ld\\__tests__\\validate.ts\" \"src\\app\\(admin)\\admin\\[instanceSlug]\\articles\\actions.ts\" \"src\\app\\(site)\\[instanceSlug]\\insights\\[category]\\[slug]\\page.tsx\"" in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 614ms:
1:# E-A-T Content 확장 plan (v0.1·draft·2026-05-18)
9:## SoT
27:## 1. 목적과 범위
29:### 1.1 목적
36:### 1.2 범위 (포함)
55:### 1.3 비범위 (defer)
70:## 2. 데이터 모델 결정
72:### 2.1 C-22 `article_category` 신규 table (EC-SCHEMA-01) — PSR-DEFER-15 해소
112:### 2.2 C-25 `publication` 신규 table (EC-SCHEMA-05)
174:### 2.3 C-26 `media_appearance` 신규 table (EC-SCHEMA-10)
232:### 2.4 C-27 `faq` 신규 table (EC-SCHEMA-13)
285:### 2.5 article.category_id 추가 — PSR-DEFER-15 해소 (EC-SCHEMA-17)
305:### 2.6 D0011 GRANT 확장 (EC-SCHEMA-18) — PSR-CASCADE-04 cascade
348:## 3. 어드민 폼 결정
350:### 3.1 4 entity CRUD 구조 (EC-FORM-01)
367:### 3.2 폼 validation zod schema (EC-FORM-06)
376:### 3.3 server action 패턴 (EC-FORM-07)
383:### 3.4 dashboard cascade (EC-FORM-08)
387:## 4. 공개 페이지 렌더 결정 (PUBLIC_SITE_RENDER code v1.0 cascade)
389:### 4.1 신규 페이지 P-011 FAQ (EC-RENDER-01) — PSR-DEFER-11 부분 해소
403:### 4.2 Doctor Profile (P-004) 확장 (EC-RENDER-04)
415:### 4.3 About (P-002) 확장 (EC-RENDER-07)
424:### 4.4 sitemap.xml + robots.txt cascade (EC-RENDER-09)
429:### 4.5 ItemList page caching (EC-RENDER-10)
431:P-011 FAQ 페이지 + Doctor Profile 의 inline Publication/MediaAppearance 섹션 — `revalidate = 60` 유지.
433:## 5. SCHEMA_MAPPING 결정 (EC-CASCADE-02)
437:### 5.1 ScholarlyArticle entity (Publication)
455:### 5.2 VideoObject / BroadcastEvent / NewsArticle (MediaAppearance)
471:### 5.3 FAQPage (P-011)
498:## 6. CONTENT_STANDARDS 결정 (EC-CASCADE-03)
515:## 7. 환경·precondition
526:## 8. § 8.1 시나리오 cascade (PUBLIC_SITE_RENDER v1.0 § 7 + 본 plan 신규)
541:## 9. 작업 단위
570:## 10. M0 v1.0 cascade markers (defer 정리)
572:### 10.1 별 cycle 합류
576:### 10.2 M1 Phase Alpha 합류
584:### 10.3 compliance-assistant Feature 합류
588:## 11. Cascade markers (다른 SoT 문서로 전파)
600:## 변경 이력

 succeeded in 590ms:
4:> **작성일**: 2026-05-15 (v0.24 — Spike 결정 SPIKE2-03 cascade: C-23 AdminUser.instanceMemberships에 `active`·`deactivatedAt`·`deactivatedBy` 필드 추가. resolveTenantContext 매 요청 검증 강제)
19:- **23개 계약 (C-01~C-23) + 3개 공통 타입 (CT-01~CT-03)**.
20:- v0.13: `features/notifications.md` cascade — C-08 확장(`adminBaseUrl`·`timezone`·`NotificationChannelsConfig`) + **C-23 `AdminUser` 신설** (어드민 사용자·자격·알림 선호 SoT).
56:| C-22 | `ArticleCategory` | Article Pillar/Category 정의 | L2+L3 | Git | (사용) | P-009, P-010 |
57:| C-23 | `AdminUser` | 어드민 사용자 (권한·자격·알림 선호 SoT) | L3 | DB | ✅ (admin) | 어드민 전용 |
172:| `appliesTo` | `enum {general, firstVisit, returnVisit}` | optional | 대상 (기본 general) |
274:| `url` | `URL` | optional | |
282:| `url` | `URL` | optional | |
294:| `others` | `{label: string, url: URL}[]` | optional | |
302:| `url` | `URL` | optional | |
309:| `internationalLanguagePages` | `{lang: string, url: URL}[]` | optional | |
329:| `publications` | `Publication[]` | optional | |
363:#### `Publication`
369:| `url` | `URL` | optional | |
378:| `summary` | `string` | ✅ | 50~160자 핵심 답변 |
451:| `summary` | `string` | optional | 간략 요약 |
452:| `url` | `URL` | optional | 외부 검증 링크 (논문·학회) |
469:| `summary` | `string` | ✅ | 80~200자 |
480:| `articleType` | `enum {notice, general-medical-info, treatment-explainer, condition-explainer, effect-result-related, review-case, event-price}` | ✅ | 유형 — 위험도 자동 추론 |
482:| `category` | `Ref<C-22>` | ✅ | ArticleCategory |
500:| `general-medical-info` | Medium | ✅ |
513:| `url` | `URL` | ✅ | |
546:| `twitterCard` | `enum {summary, summary_large_image}` | optional | 기본 `summary_large_image` |
676:| `sources.snsApi.<platform>` | `{enabled: boolean, apiKeySecretRef: string, blogId/accountId: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedAccountIds: string[], allowedContentTypes: string[], consentEvidenceRef?: string}` | optional | platform=naverBlog·instagram·facebook·youtube. `enabled=true` + 법무 게이트 누락 → 빌드 fail (F-12) |
769:| `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature}` | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1) |
770:| `featureContentType` | `string` (`feature:<slug>` 형식, 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$`) | conditional | `contentType="Feature"` 시 required — Feature 콘텐츠 세부 식별. 예: `feature:self-test` |
871:| `summary` | `string` | ✅ | 개정 내용 요약 |
913:### C-22. `ArticleCategory` — Article Pillar 분류
921:| `parentCategory` | `Ref<C-22>` | optional | 계층 구조 시 |
959:### C-23. `AdminUser` — 어드민 사용자 (v0.13 신규)
968:| `role` | `AdminUserRole` (단 `system` 제외) | ✅ | `admin/REVIEW_WORKFLOW.md` § 11.1 enum 6종 중 실제 사용자 역할 5종(`super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver`). **`system`은 audit log actorRole 표기 전용** — AdminUser DB row 미생성, 로그인 불가. C-23.`role` 및 `instanceMemberships[].role`에는 저장 금지 |
973:| `notificationPreferences` | `NotificationPreferences` | optional | 사용자별 채널·digest·quietHours 설정 (§ C-23 하위 타입) |
974:| `instanceMemberships` | `Array<{instanceId: Slug, role: AdminUserRole, joinedAt: Date, active: boolean, deactivatedAt?: Date, deactivatedBy?: string}>` | ✅ | (v0.24 — SPIKE2-03) 사용자가 접근 가능한 인스턴스 목록. **`active=true`만 권한 부여**·`active=false` 시 다음 request 즉시 403 (session refresh 없이). `resolveTenantContext`가 매 요청 검증 |
979:#### `NotificationPreferences` (C-23 하위 타입)
985:| `quietHours` | `{start: "HH:MM", end: "HH:MM", timezone?: IANATimezone}` | optional | 보류 시간. `timezone` 우선순위: `quietHours.timezone > AdminUser.timezone > InstanceManifest.timezone`. `critical` 이벤트는 quietHoursPolicy=bypass로 우회 |
986:| `suppression` | `{email?: EmailSuppressionState, slack?: ChannelSuppressionState}` | optional | provider 장애·hard bounce 자동 처리 상태 (§ C-23 하위 타입). `active=false` 로그인 차단과 분리 — suppression은 채널별 발송만 차단 |
988:#### `EmailSuppressionState`·`ChannelSuppressionState` (C-23 하위 타입)
1037:   ├─ category → ArticleCategory (C-22)
1043:   ├─ contentRef → 발행 콘텐츠 (C-01~C-22)
1067:| DM-09 | ~~ArticleCategory~~ | 해소 — C-22 |
1086:| 2026-05-13 | v0.2 | 레퍼런스 분석 반영 — C-21·C-22, 필드 추가 |
1092:| 2026-05-14 | v0.8 | **피드백 정정**: § 4 내 C-16 위치를 C-22 뒤 → C-10 다음(C-21 앞)으로 이동, 번호 순 가독성 확보. § 5 자리표시도 한 줄 링크로 간소화 |
1102:| 2026-05-15 | v0.24 | **Spike 결정 cascade (SPIKE2-03)**: C-23 AdminUser.instanceMemberships에 `active`·`deactivatedAt`·`deactivatedBy` 필드 추가. `active=false` 시 다음 request 즉시 403·resolveTenantContext 매 요청 검증 강제 |
1108:| 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `AdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`eligibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·digestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IANATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |

 succeeded in 587ms:
..\..\packages\migrations-runner\src\manifest.ts:1:// @glitzy/migrations-runner — cross-package migrations manifest spec (v0.1)
..\..\packages\migrations-runner\src\manifest.ts:4:// 본 manifest 는 cross-package migrations 의 sequential apply 순서와 명시적 depends_on 을 SoT 로 보존한다.
..\..\packages\migrations-runner\src\manifest.ts:14:  /** 적용 단계 — 동일 패키지 내 마이그레이션은 항상 alphabetic 순서로 시퀀스 됨. cross-package 순서는 본 manifest 가 결정. */
..\..\packages\migrations-runner\src\manifest.ts:41:  // (3) location_profile (base table — clinic_profile_id 미포함 · C0008 에서 ALTER)
..\..\packages\migrations-runner\src\manifest.ts:76:  // (8) clinic_profile policy + primary_ctas (ALTER)
..\..\packages\migrations-runner\src\manifest.ts:78:    file: "packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql",
..\..\packages\migrations-runner\src\manifest.ts:81:      "clinic_profile.policy_contact_person",
..\..\packages\migrations-runner\src\manifest.ts:82:      "clinic_profile.policy_contact_email",
..\..\packages\migrations-runner\src\manifest.ts:83:      "clinic_profile.policy_contact_phone",
..\..\packages\migrations-runner\src\manifest.ts:84:      "clinic_profile.policy_effective_date",
..\..\packages\migrations-runner\src\manifest.ts:91:  // (9) location_profile parentClinic composite FK (ALTER)
..\..\packages\migrations-runner\src\manifest.ts:102:  // (10) app_public_reader role + per-table SELECT policy 7개 (PUBLIC_SITE_RENDER_PLAN v0.x · PSR-25 / PSR-CASCADE-04 patch)
..\..\packages\migrations-runner\src\manifest.ts:103:  // depends_on = instance + 6 content table 모두. policy 가 모든 table 에 걸리므로 manifest 마지막.
..\..\packages\migrations-runner\src\manifest.ts:105:    file: "packages/db/migrations/D0011_public_reader.sql",
..\..\packages\migrations-runner\src\manifest.ts:108:      "app_public_reader",
..\..\packages\migrations-runner\src\manifest.ts:109:      "public_reader_instance_select",
..\..\packages\migrations-runner\src\manifest.ts:110:      "public_reader_clinic_profile_select",
..\..\packages\migrations-runner\src\manifest.ts:111:      "public_reader_location_profile_select",
..\..\packages\migrations-runner\src\manifest.ts:112:      "public_reader_doctor_profile_select",
..\..\packages\migrations-runner\src\manifest.ts:113:      "public_reader_treatment_page_select",
..\..\packages\migrations-runner\src\manifest.ts:114:      "public_reader_article_select",
..\..\packages\migrations-runner\src\manifest.ts:115:      "public_reader_legal_document_select",
..\..\packages\core-content\src\schema.ts:2:// M0-02·03·05·06·15·16·17·18 정합·SoT: REVIEW_WORKFLOW 9 states·RISK_LEVELS 3 levels·DATA_MODEL @id 3~64자
..\..\packages\core-content\src\schema.ts:3:// v0.3: + legal_document (C-16) + clinic_profile policy/primary_ctas (C0007) + location_profile.clinic_profile_id (C0008)
..\..\packages\core-content\src\schema.ts:37:export const riskLevelEnum = pgEnum("risk_level", ["Low", "Medium", "High"]);
..\..\packages\core-content\src\schema.ts:63:    // LL-SCHEMA-07~10 + cycle1 LL-14·20: policy 변수 4 column
..\..\packages\core-content\src\schema.ts:64:    policyContactPerson: text("policy_contact_person"),
..\..\packages\core-content\src\schema.ts:65:    policyContactEmail: text("policy_contact_email"),
..\..\packages\core-content\src\schema.ts:66:    policyContactPhone: text("policy_contact_phone"),
..\..\packages\core-content\src\schema.ts:67:    policyEffectiveDate: date("policy_effective_date"),
..\..\packages\core-content\src\schema.ts:79:    // LL-SCHEMA-08 + cycle1 LL-20: policy_contact_email regex + phone format (한국 + 국제 +82)
..\..\packages\core-content\src\schema.ts:80:    policyEmailRegex: check("clinic_profile_policy_email_regex", sql`${t.policyContactEmail} IS NULL OR ${t.policyContactEmail} ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'`),
..\..\packages\core-content\src\schema.ts:81:    policyPhoneFormat: check("clinic_profile_policy_phone_format", sql`${t.policyContactPhone} IS NULL OR ${t.policyContactPhone} ~ '^(\\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}$'`),
..\..\packages\core-content\src\schema.ts:178:    bodyMarkdown: text("body_markdown").notNull(),
..\..\packages\core-content\src\schema.ts:213:    bodyMarkdown: text("body_markdown").notNull(),
..\..\packages\core-content\src\schema.ts:258:    body: text("body").notNull(),
..\..\packages\core-content\src\schema.ts:267:    riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
..\..\packages\core-content\src\schema.ts:276:    bodyLen: check("legal_document_body_length", sql`length(${t.body}) BETWEEN 1 AND 200000`),
..\..\packages\core-content\src\schema.ts:284:    // LL-SCHEMA-06 + cycle1 LL-12: risk_level 'Low' 만
..\..\packages\core-content\src\schema.ts:285:    riskLevelSkeletonLimit: check("legal_document_risk_level_skeleton_limit", sql`${t.riskLevel} = 'Low'`),
src\lib\json-ld\__tests__\validate.ts:7://   3. @id 유일 (graph 안 중복 없음)
src\lib\json-ld\__tests__\validate.ts:8://   4. cross-reference 무결성 — `{ "@id": "..." }` 참조가 그래프 안 entity @id 또는 외부 dereferenceable URL
src\lib\json-ld\__tests__\validate.ts:18://   1. inline minimal 객체 (`@id` + `@type` + 추가 필드) 는 self-contained inline 으로 인정 (검사 제외).
src\lib\json-ld\__tests__\validate.ts:19://   2. pure ref (`@id` 만 있는 객체) 는 graph entity 또는 cross-page reference allowlist 또는 외부 origin URL.
src\lib\json-ld\__tests__\validate.ts:74:  // (3) @id 유일
src\lib\json-ld\__tests__\validate.ts:84:    if (typeof e["@id"] !== "string") errors.push(`entity missing @id`);
src\lib\json-ld\__tests__\validate.ts:85:    if (typeof e["@id"] === "string") {
src\lib\json-ld\__tests__\validate.ts:86:      if (ids.has(e["@id"])) errors.push(`duplicate @id: ${e["@id"]}`);
src\lib\json-ld\__tests__\validate.ts:87:      ids.add(e["@id"]);
src\lib\json-ld\__tests__\validate.ts:88:      idMap.set(e["@id"], e as JsonLdEntity);
src\lib\json-ld\__tests__\validate.ts:92:  // (4) cross-reference — pure ref `{ "@id": "..." }` 만 검사 (inline `{@id, @type, ...}` 객체는 self-contained).
src\lib\json-ld\__tests__\validate.ts:102:    const hasId = typeof v["@id"] === "string";
src\lib\json-ld\__tests__\validate.ts:106:      const ref = v["@id"] as string;
src\lib\json-ld\__tests__\validate.ts:124:      if (k === "@type" || k === "@id") continue;
..\..\docs\decisions\M0_BUILD_EXPORT_PLAN.md:26:| ClinicProfile `@id` | `clinic_profile.slug` (보통 `clinic`) | `@id: clinic` |
..\..\docs\decisions\M0_BUILD_EXPORT_PLAN.md:27:| ClinicProfile `locations[]` | `SELECT id FROM location_profile WHERE clinic_profile_id = ? ORDER BY slug` | `locations: [<ref to LocationProfile.@id>]` (1개 이상 — main 필수) |
..\..\docs\decisions\M0_BUILD_EXPORT_PLAN.md:28:| LocationProfile `@id` | `location_profile.slug` (보통 `main`) | `@id: main` |
..\..\docs\decisions\M0_BUILD_EXPORT_PLAN.md:32:| primary_ctas / reservationChannels element key | DB `id` | Git `@id` (alias 변환) |
..\..\docs\decisions\M0_BUILD_EXPORT_PLAN.md:33:| LegalDocument body | `legal_document.body` (rendered Markdown · 변수 치환 완료) | `<documentType>.md` 본문 |
..\..\docs\decisions\M0_BUILD_EXPORT_PLAN.md:62:| 도메인 매핑 | path-based `/<instanceSlug>/...` v0.x | subdomain / custom domain (PSR-DEFER-02) + Vercel/Cloud Run middleware host rewrite |
..\..\docs\decisions\M0_BUILD_EXPORT_PLAN.md:63:| `@id` entity 패턴 | path-based (SCHEMA_MAPPING § 1.2 v0.1 임시 표) | 도메인 매핑 SoT 표 — entity continuity 전환 룰 (301 redirect + `sameAs` 보조 marker) |
..\..\docs\decisions\M0_BUILD_EXPORT_PLAN.md:77:| 2026-05-16 | v0.1 | LOCATION_LEGAL_PLAN v1.0 acceptance precondition 으로 placeholder 신설. LL-CASCADE-04 책임 명시 (ClinicProfile.locations / LocationProfile.parentClinic·reservationChannels / primary_ctas `id` → `@id` alias). |
..\..\docs\core\SCHEMA_MAPPING.md:20:- 핵심 schema: `Organization`·`MedicalClinic`·`Physician`·`MedicalProcedure`·`MedicalCondition`·`Article`·`FAQPage`·`BreadcrumbList`·`WebSite`. (`MedicalClinic`은 LocalBusiness sub-class이므로 별도 `LocalBusiness` 타입 출력 안 함)
..\..\docs\core\SCHEMA_MAPPING.md:33:**Core가 출력하는 JSON-LD는 페이지당 단일 `<script type="application/ld+json">` 블록**으로 통합 그래프 출력. (외부 통합 — 네이버 예약 위젯·카카오톡 등 — 이 자체 schema를 삽입할 수 있으나 Core 책임 외. Core graph와 충돌 시 entity @id 중복 검출은 빌드 시 경고.)
..\..\docs\core\SCHEMA_MAPPING.md:40:    { "@type": "Organization", "@id": "...", ... },
..\..\docs\core\SCHEMA_MAPPING.md:41:    { "@type": "MedicalClinic", "@id": "...", ... },
..\..\docs\core\SCHEMA_MAPPING.md:43:    { "@type": "Article", "@id": "...", ... }
..\..\docs\core\SCHEMA_MAPPING.md:50:- 통합 그래프 사용 이유: entity cross-reference(@id 참조)가 깔끔, validator·검색 엔진의 entity 해석 명확.
..\..\docs\core\SCHEMA_MAPPING.md:52:### 1.2 `@id` 네이밍 규약
..\..\docs\core\SCHEMA_MAPPING.md:54:| Entity | `@id` 패턴 | 예시 |
..\..\docs\core\SCHEMA_MAPPING.md:62:| `Article` | `https://{domain}/insights/{category}/{slug}#article` | |
..\..\docs\core\SCHEMA_MAPPING.md:64:| `WebPage` | `https://{domain}{path}#webpage` | 본문 페이지 entity |
..\..\docs\core\SCHEMA_MAPPING.md:66:> `@id`는 dereferenceable URL + fragment 형식. 같은 entity는 항상 같은 `@id`를 사용해 페이지 간 일관성 확보.
..\..\docs\core\SCHEMA_MAPPING.md:68:#### v0.1 path-based `@id` 임시 패턴 (PSR-CASCADE-02 · PUBLIC_SITE_RENDER_PLAN v0.x)
..\..\docs\core\SCHEMA_MAPPING.md:70:`PUBLIC_SITE_RENDER_PLAN.md` v0.x § 5.4 PSR-SEO-12 의 SSR + path-based routing 단계 (Phase 0) 에서는 도메인 매핑 (subdomain/custom domain) 합류 전이므로 **임시로 instanceSlug 가 path 에 들어간 `@id` 패턴** 을 사용한다:
..\..\docs\core\SCHEMA_MAPPING.md:78:| `Article` | `https://<host>/<instanceSlug>/insights/<category>/<slug>#article` | `https://<customDomain>/insights/<category>/<slug>#article` |
..\..\docs\core\SCHEMA_MAPPING.md:83:- 도메인 매핑 후 entity `@id` 가 변경된다. 검색 엔진의 entity 연속성 (knowledge graph 등) 을 위해:
..\..\docs\core\SCHEMA_MAPPING.md:87:- 본 전환 작업은 M0 v1.0 본 구현 cascade (PSR-DEFER-02 도메인 매핑) 와 동반.
..\..\docs\core\SCHEMA_MAPPING.md:91:다른 entity 참조는 `@id`만 사용:
..\..\docs\core\SCHEMA_MAPPING.md:96:  "@id": "https://example.com/insights/diet/yoyo#article",
..\..\docs\core\SCHEMA_MAPPING.md:97:  "author": { "@id": "https://example.com/doctors/hong#physician" },
..\..\docs\core\SCHEMA_MAPPING.md:98:  "publisher": { "@id": "https://example.com/#organization" }
..\..\docs\core\SCHEMA_MAPPING.md:102:전체 entity 정의는 페이지 그래프 안에 한 번만. 다른 위치는 `@id`만으로 참조.
..\..\docs\core\SCHEMA_MAPPING.md:110:| **단지점** | `Organization`(`#organization`) 1개 | **`MedicalClinic`(`#clinic`) 1개** — LocationProfile(slug=`main`)에 매핑. P-014 페이지(URL `/locations/main`)의 mainEntity도 같은 `#clinic` (URL ≠ entity @id) |
..\..\docs\core\SCHEMA_MAPPING.md:113:> P-014 페이지가 단지점 main을 다룰 때도 entity @id는 `#clinic` 유지 — URL은 `/locations/main`이지만 mainEntity 참조는 `#clinic`. 다지점 비본원 지점 P-014만 `/locations/{slug}#clinic` entity 사용.
..\..\docs\core\SCHEMA_MAPPING.md:125:| `Article`·`NewsArticle`·`BlogPosting`·`WebPage`·`FAQPage`·`Blog`·`VideoObject`·`ImageObject` 등 CreativeWork 계열 | `Organization`·`MedicalClinic`·`LocalBusiness`·`Physician`·`Person`·`ContactPoint` 등 — Schema.org 표준상 inLanguage 속성 부재 또는 부적합 |
..\..\docs\core\SCHEMA_MAPPING.md:141:| `WebPage` | 모든 페이지 — 본문 entity | PageMeta (C-06) |
..\..\docs\core\SCHEMA_MAPPING.md:149:| `NewsArticle` | (대체 — News 카테고리) | NewsItem (C-19) |
..\..\docs\core\SCHEMA_MAPPING.md:150:| `FAQPage` | P-011 FAQ, FAQ 블록 포함 페이지 | FAQ[] (C-12) |
..\..\docs\core\SCHEMA_MAPPING.md:151:| `Question` / `Answer` | FAQPage.mainEntity | FAQ |
..\..\docs\core\SCHEMA_MAPPING.md:154:| `VideoObject` | Article.embeddedMedia[].type=youtube·video, P-010의 contentFormat=video | EmbeddedMedia |
..\..\docs\core\SCHEMA_MAPPING.md:172:| `MedicalRiskFactor`·`MedicalRiskEstimator` | **fail** | 진단 단정형. 본문 표현은 content-gate |
..\..\docs\core\SCHEMA_MAPPING.md:173:| `MedicalIndication` (단정형 schema) | **fail** | 효능 단정. 본문 효능 표현은 content-gate |
..\..\docs\core\SCHEMA_MAPPING.md:187:- `FAQPage` (Question/Answer) — FAQ 리치 결과
..\..\docs\core\SCHEMA_MAPPING.md:188:- `Article` / `BlogPosting` / `NewsArticle` — 기사 리치 카드
..\..\docs\core\SCHEMA_MAPPING.md:190:- `VideoObject` — 비디오 캐러셀 (Google Rich Results 최소 필드 충족 시)
..\..\docs\core\SCHEMA_MAPPING.md:226:| `FAQPage` | Conditional | P-011 또는 FAQ 블록 포함 페이지 (P-006·P-008·P-010 등) |
..\..\docs\core\SCHEMA_MAPPING.md:228:| `VideoObject` | Conditional | Article.contentFormat=video 또는 embeddedMedia.type∈{youtube, vimeo, external-video} (최소 필드 충족 시) |
..\..\docs\core\SCHEMA_MAPPING.md:233:| `MedicalRiskFactor`·`MedicalRiskEstimator` (schema 출력) | **Blocked (fail)** | 진단 단정 위험 (§ 8). 본문 원인·위험요인 표현은 별도 content-gate (compliance-assistant) — schema 출력과 분리 |
..\..\docs\core\SCHEMA_MAPPING.md:234:| `MedicalIndication` (단정형 schema) | **Blocked (fail)** | 효능 단정 위험. Schema 출력 금지. 본문 효능 표현은 별도 content-gate (compliance-assistant) |
..\..\docs\core\SCHEMA_MAPPING.md:238:| `SpecialAnnouncement` | Conditional → 사실상 미출력 | 평상 휴진은 본문/메타. 중대 공지(예: 보건 위기 대응)만 별도 정책 |
..\..\docs\core\SCHEMA_MAPPING.md:248:- **풀 entity (Full)**: graph[]에 entity 정의 — `@type`, `@id`, 필드 모두 출력
..\..\docs\core\SCHEMA_MAPPING.md:249:- **참조 (Ref)**: graph[]에 entity 정의 없음. 다른 entity의 속성에 `{"@id": "..."}` 참조만 (예: `Article.publisher = {"@id": "#organization"}`)
..\..\docs\core\SCHEMA_MAPPING.md:256:| `MedicalClinic` (`#clinic` 본원) | **풀 entity 출력** — 위치·시간·연락이 본문에 의미 있게 표시되거나 예약 action이 풀 entity로 필요한 페이지 | P-001(Home), P-002(About), P-006(Treatment Detail — 예약 CTA·담당 의료진 연계), P-012(Contact), P-014(Location main), P-105(Reservation — 예약 action 풀 필요) |
..\..\docs\core\SCHEMA_MAPPING.md:257:| `MedicalClinic` 참조 | **참조만** — 위치 정보가 페이지 본문에 표시되지 않는 페이지 | P-003(Doctors List), P-004(Doctor Profile), **P-005(Treatments List — 시술 카드 목록 위주, 위치 슬롯 없음)**, P-007/8(Conditions), P-009/10(Articles), P-011(FAQ), P-013(Legal), P-101(Reviews), P-102(Pricing), P-103(Facilities), P-104(News), P-106(Self-test) |
..\..\docs\core\SCHEMA_MAPPING.md:260:| `WebPage` | **모든 페이지 풀** (각 페이지의 본문 entity) | 전 페이지 |
..\..\docs\core\SCHEMA_MAPPING.md:261:| `Physician`, `MedicalProcedure`, `MedicalCondition`, `Article`, `FAQPage` | 상세 페이지에서 풀, 다른 페이지(목록·연관 참조)에서 참조 또는 inline 최소 | § 3 참조 |
..\..\docs\core\SCHEMA_MAPPING.md:277:4. `WebPage` (Home의 본문 entity)
..\..\docs\core\SCHEMA_MAPPING.md:284:| `@id` | `https://{domain}/#organization` |
..\..\docs\core\SCHEMA_MAPPING.md:306:| `@id` | `https://{domain}/#clinic` |
..\..\docs\core\SCHEMA_MAPPING.md:308:| `parentOrganization` | `{"@id": "https://{domain}/#organization"}` |
..\..\docs\core\SCHEMA_MAPPING.md:322:  "@id": "https://{domain}/#website",
..\..\docs\core\SCHEMA_MAPPING.md:325:  "publisher": { "@id": "https://{domain}/#organization" },
..\..\docs\core\SCHEMA_MAPPING.md:342:**다른 페이지의 WebSite 참조**: WebPage 엔티티에 `isPartOf: { "@id": "https://{domain}/#website" }` 참조만. 풀 엔티티 미출력.
..\..\docs\core\SCHEMA_MAPPING.md:344:**WebPage 필드**: PageMeta 매핑 (title·description·canonical·image) + `isPartOf: {@id: "#website"}` (Home 외).
..\..\docs\core\SCHEMA_MAPPING.md:362:- 본문에 별도 `CreativeWork[]` 또는 `Article[]` entity로 표현 (외부 매체 기사의 경우 `isBasedOn`/`citation`)
..\..\docs\core\SCHEMA_MAPPING.md:363:- 단순 본문 콘텐츠 표시가 가장 안전
..\..\docs\core\SCHEMA_MAPPING.md:385:5. `ItemList` (의료진 목록) — **[풀]** — `itemListElement[]`에 최소 inline 필드 + `@id` 참조
..\..\docs\core\SCHEMA_MAPPING.md:390:  "@id": "https://{domain}/doctors#itemlist",
..\..\docs\core\SCHEMA_MAPPING.md:397:        "@id": "https://{domain}/doctors/hong#physician",
..\..\docs\core\SCHEMA_MAPPING.md:426:| `@id` | `https://{domain}/doctors/{slug}#physician` |
..\..\docs\core\SCHEMA_MAPPING.md:435:| `worksFor` | `{"@id": "https://{domain}/#organization"}` |
..\..\docs\core\SCHEMA_MAPPING.md:441:**Note**: `personalStory`·`philosophy`는 본문에 표시되지만 schema에는 비매핑 (의료 schema에 적절한 표현 없음 — `description`에 일부 흡수 가능).
..\..\docs\core\SCHEMA_MAPPING.md:452:5. `ItemList` — **[풀]** — 최소 inline + `@id` 참조 (P-003과 동일 패턴)
..\..\docs\core\SCHEMA_MAPPING.md:463:        "@id": "https://{domain}/treatments/{slug}#procedure",
..\..\docs\core\SCHEMA_MAPPING.md:483:6. (FAQ 블록 포함 시) `FAQPage` — **[풀]** (Conditional)
..\..\docs\core\SCHEMA_MAPPING.md:490:| `@id` | `https://{domain}/treatments/{slug}#procedure` |
..\..\docs\core\SCHEMA_MAPPING.md:494:| `procedureType` | `category` (해당 시) |
..\..\docs\core\SCHEMA_MAPPING.md:498:| `bodyLocation` | (해당 시 — 다이어트 한의원은 일반적으로 없음) |
..\..\docs\core\SCHEMA_MAPPING.md:504:- `programVariants`는 schema 미매핑 — 본문 콘텐츠로만
..\..\docs\core\SCHEMA_MAPPING.md:507:**FAQPage** (해당 시):
..\..\docs\core\SCHEMA_MAPPING.md:511:  "@type": "FAQPage",
..\..\docs\core\SCHEMA_MAPPING.md:514:      "@type": "Question",
..\..\docs\core\SCHEMA_MAPPING.md:516:      "acceptedAnswer": {
..\..\docs\core\SCHEMA_MAPPING.md:517:        "@type": "Answer",
..\..\docs\core\SCHEMA_MAPPING.md:534:5. `ItemList` — **[풀]** — 최소 inline (`name`·`url`·`description`) + `MedicalCondition` `@id` 참조 (P-003·P-005 패턴 동일)
..\..\docs\core\SCHEMA_MAPPING.md:544:6. (FAQ) `FAQPage` — **[풀]** (Conditional)
..\..\docs\core\SCHEMA_MAPPING.md:551:| `@id` | `https://{domain}/conditions/{slug}#condition` |
..\..\docs\core\SCHEMA_MAPPING.md:557:> `MedicalRiskFactor` schema는 **출력하지 않음** (§ 2.4·§ 8 fail). `causes[]`는 본문 표현으로만 노출. 본문의 원인·위험요인 표현은 content-gate(compliance-assistant)가 검수 — schema 룰과 본문 룰 분리.
..\..\docs\core\SCHEMA_MAPPING.md:578:        "@id": "https://{domain}/insights/{cat}/{slug}#article",
..\..\docs\core\SCHEMA_MAPPING.md:583:        "author": { "@id": "https://{domain}/doctors/{author.slug}#physician" }
..\..\docs\core\SCHEMA_MAPPING.md:594:  "@id": "https://{domain}/insights#blog",
..\..\docs\core\SCHEMA_MAPPING.md:596:  "publisher": { "@id": "https://{domain}/#organization" },
..\..\docs\core\SCHEMA_MAPPING.md:598:    { "@id": "https://{domain}/insights/{cat}/{slug}#article" }
..\..\docs\core\SCHEMA_MAPPING.md:614:8. (Q&A 블록 포함 시) `FAQPage` — **[풀]** (Conditional)
..\..\docs\core\SCHEMA_MAPPING.md:615:9. (contentFormat=video 또는 embeddedMedia.type∈{youtube,vimeo,external-video} 시) `VideoObject` — **[풀, 최소 필드 충족]** (Conditional)
..\..\docs\core\SCHEMA_MAPPING.md:621:| `@type` | `"Article"` (또는 `"BlogPosting"`·`"NewsArticle"` 변형) |
..\..\docs\core\SCHEMA_MAPPING.md:622:| `@id` | `https://{domain}/insights/{cat}/{slug}#article` |
..\..\docs\core\SCHEMA_MAPPING.md:625:| `articleBody` | `body` (Markdown → 평문 권장, schema validator 호환) |
..\..\docs\core\SCHEMA_MAPPING.md:629:| `author` | `{"@id": "https://{domain}/doctors/{author.slug}#physician"}` |
..\..\docs\core\SCHEMA_MAPPING.md:630:| `editor` | `reviewedBy` (해당 시) → Physician @id |
..\..\docs\core\SCHEMA_MAPPING.md:631:| `publisher` | `{"@id": "https://{domain}/#organization"}` |
..\..\docs\core\SCHEMA_MAPPING.md:632:| `mainEntityOfPage` | `{"@id": "https://{domain}{path}#webpage"}` |
..\..\docs\core\SCHEMA_MAPPING.md:638:| `about` | 관련 시술·질환 entity (`relatedTreatments`·`relatedConditions`) @id |
..\..\docs\core\SCHEMA_MAPPING.md:641:**VideoObject** (contentFormat=video 또는 embeddedMedia에 youtube/vimeo 포함 시) — Google Rich Results 최소 필드 충족:
..\..\docs\core\SCHEMA_MAPPING.md:645:  "@type": "VideoObject",
..\..\docs\core\SCHEMA_MAPPING.md:658:**필수 필드** (누락 시 VideoObject 출력 안 함 — Google Rich Results 기준):
..\..\docs\core\SCHEMA_MAPPING.md:664:### P-011. FAQ
..\..\docs\core\SCHEMA_MAPPING.md:669:3. `FAQPage` (Question/Answer) — **[풀]**
..\..\docs\core\SCHEMA_MAPPING.md:673:**FAQPage**: 위 P-006 FAQPage와 동일 구조. 페이지 전체가 Question 모음일 때 `mainEntity` 배열.
..\..\docs\core\SCHEMA_MAPPING.md:683:6. (다지점) `ItemList` — **[풀]** → 각 지점 `MedicalClinic` @id 참조
..\..\docs\core\SCHEMA_MAPPING.md:690:    { "@type": "Organization", "@id": "https://{domain}/#organization", ... },
..\..\docs\core\SCHEMA_MAPPING.md:691:    { "@type": "MedicalClinic", "@id": "https://{domain}/#clinic", ... },      // 본원
..\..\docs\core\SCHEMA_MAPPING.md:692:    { "@type": "MedicalClinic", "@id": "https://{domain}/locations/gangnam#clinic", ... },
..\..\docs\core\SCHEMA_MAPPING.md:693:    { "@type": "MedicalClinic", "@id": "https://{domain}/locations/bundang#clinic", ... },
..\..\docs\core\SCHEMA_MAPPING.md:735:   - **단지점 main**: `@id` = `https://{domain}/#clinic` (URL은 `/locations/main`이지만 entity는 본원 `#clinic`과 동일)
..\..\docs\core\SCHEMA_MAPPING.md:736:   - **다지점 비본원**: `@id` = `https://{domain}/locations/{slug}#clinic` (별도 entity)
..\..\docs\core\SCHEMA_MAPPING.md:746:| `branchOf` | `{"@id": "https://{domain}/#organization"}` |
..\..\docs\core\SCHEMA_MAPPING.md:750:> 본원(`@id: #clinic`)과 지점(`@id: /locations/{slug}#clinic`)은 다른 entity. `branchOf`는 Schema.org의 LocalBusiness 계열에서 더 적합 (MedicalClinic은 `parentOrganization`을 우선).
..\..\docs\core\SCHEMA_MAPPING.md:762:**주의**: `Offer` schema **사용 안 함** (의료 가격 광고 제한). 본문 정보만 표시.
..\..\docs\core\SCHEMA_MAPPING.md:765:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀]. 사진은 본문 갤러리 또는 `WebPage.image: ImageObject[]`로 표현 (`ImageGallery`는 사용 안 함 — 카탈로그·결정표 미등재).
..\..\docs\core\SCHEMA_MAPPING.md:768:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀] + (개별 News 항목) `NewsArticle` 또는 `Article`[풀].
..\..\docs\core\SCHEMA_MAPPING.md:786:| C-03 `TreatmentPage` | `MedicalProcedure` | `programVariants`·`recommendedFor`·`visitFlow`는 비매핑 (본문) |
..\..\docs\core\SCHEMA_MAPPING.md:787:| C-04 `Article` | `Article` (또는 `BlogPosting`·`NewsArticle` 변형). VideoObject 동반 가능 | `contentSource` → `isBasedOn` |
..\..\docs\core\SCHEMA_MAPPING.md:795:| C-12 `FAQ` | `FAQPage.mainEntity[].Question/Answer` | |
..\..\docs\core\SCHEMA_MAPPING.md:802:| C-19 `NewsItem` | `Article` 또는 `NewsArticle` | event-price 카테고리는 schema 신중 |
..\..\docs\core\SCHEMA_MAPPING.md:809:| CT-01 `TrustMetric` | (비매핑) — 본문 콘텐츠로만. schema는 사실 안내형 description 보조 |
..\..\docs\core\SCHEMA_MAPPING.md:819:| `lunchBreaks[]` | 본문·메타 표시 우선. schema는 `description` 보조만 | Conditional → 사실상 미출력 |
..\..\docs\core\SCHEMA_MAPPING.md:820:| `specialClosures[]` | **schema 기본 미출력**. 중대 공지(보건 위기 등)만 `SpecialAnnouncement` 별도 정책. 평상 휴진은 본문/메타/Google Business Profile 활용 | Blocked (default) → 별도 정책 시만 Conditional |
..\..\docs\core\SCHEMA_MAPPING.md:845:| `form` | (schema 미적용 — 본문 폼) |
..\..\docs\core\SCHEMA_MAPPING.md:883:| P-006 Treatment Detail | `treatment: TreatmentPage`, `relatedDoctors: DoctorProfile[]`, `relatedConditions: MedicalConditionPage[]`, `faqs: FAQ[]` |
..\..\docs\core\SCHEMA_MAPPING.md:884:| P-008 Condition Detail | `condition: MedicalConditionPage`, `relatedTreatments: TreatmentPage[]`, `faqs: FAQ[]` |
..\..\docs\core\SCHEMA_MAPPING.md:886:| P-011 FAQ | `faqs: FAQ[]` |
..\..\docs\core\SCHEMA_MAPPING.md:919:| P-011 | `FAQPage` + `mainEntity[]` 최소 1개 |
..\..\docs\core\SCHEMA_MAPPING.md:928:| **빌드 게이트 (Sanity)** | JSON-LD 파싱 가능 여부·@id uniqueness·@context 유효성 | 빌드 실패 |
..\..\docs\core\SCHEMA_MAPPING.md:938:| **warning** | 출력 시 경고 + 어드민 검토 큐로 전달 (빌드는 통과) | 외부 위젯 schema와 `@id` 충돌 / VideoObject 권장 필드 누락 (필수는 충족하나 권장 미충족) / 본문 길이 권장 미달 등 — 비차단 운영 관찰 항목 |
..\..\docs\core\SCHEMA_MAPPING.md:939:| **content-gate** | schema는 통과되지만 본문 표현 위험. compliance-assistant·운영자 검수가 결정 | 본문 내 효과 단정·위험요인 설명·TreatmentPage.evidenceNotes 본문 인용·MedicalRiskFactor 본문 언급 등 |
..\..\docs\core\SCHEMA_MAPPING.md:954:| `MedicalRiskFactor`·`MedicalRiskEstimator` (schema) | **fail** | Schema 출력은 금지. 본문에서 원인·위험요인 표현은 별도 content-gate (compliance-assistant 검수) — schema 룰과 본문 룰 분리 |
..\..\docs\core\SCHEMA_MAPPING.md:955:| `MedicalIndication` (단정형 schema) | **fail** | Schema 출력 금지. 본문 효능 표현은 별도 content-gate |
..\..\docs\core\SCHEMA_MAPPING.md:968:| SM-01 | `Article` vs `BlogPosting` vs `NewsArticle` 변형 선택 정책 — `articleType`별 자동 매핑 | 후속 결정 |
..\..\docs\core\SCHEMA_MAPPING.md:972:| SM-05 | ~~다지점 시 본원 `@id` alias 처리~~ | **v0.3 해소** — `/#clinic` 단일 entity로 고정. alias 사용 안 함 (§ 1.4) |
..\..\docs\core\SCHEMA_MAPPING.md:984:| 2026-05-14 | v0.2 | **피드백 정합 정정**: (1) **C-15/CT-15 혼동 → C-15로 통일** (SchemaInput은 데이터 계약, CT 아님), (2) **inLanguage 정책 좁힘** — CreativeWork·페이지 entity에만, (3) **MedicalClinic 사용처 정합** — § 2.1 카탈로그 "전 페이지 본원 1개 포함" 명시 (그래프 정의와 일치), (4) **P-002 About 정정** — address 매핑 제거(LocationProfile SoT), mediaCoverage는 sameAs 또는 CreativeWork 보조로, (5) **ItemList inline 필드 추가** — P-003/P-005/P-007/P-009에 name·url·image·기타 최소 필드 + @id 참조 병행, (6) **List 페이지 그래프에 WebPage 추가** — § 7.1 검증 룰과 정합 (이전 누락), (7) **evidenceNotes 매핑 보수화** — `MedicalStudy` → `citation`/`CreativeWork` (EvidenceNote 필드로 MedicalStudy 구성 부족), (8) **§ 2.3 신규** — Schema Rich Results 실효 vs Entity 의미 전달 분류 |
..\..\docs\core\SCHEMA_MAPPING.md:985:| 2026-05-14 | v0.3 | **빌드 가능 규칙화** (피드백 10건): (1) **§ 1.1 Core 출력 범위 한정** — 외부 위젯 schema 충돌 가능성 명시, (2) **§ 1.4 본원 @id 일관성 (SM-05 해소)** — `/#clinic` 단일 entity, 다지점 비본원만 `/locations/{slug}#clinic`, alias 금지, (3) **§ 2.1 WebSite Home 전용** — 다른 페이지는 `isPartOf` 참조만, (4) **§ 2.1 Person M0 외 후속** — authorType != clinician은 데이터 모델 확장 후, (5) **§ 2.4 신규 — Allowed/Conditional/Blocked 3단계 분류**, (6) **§ 3 P-010 graph 구성 [풀]/[참조+inline]/[참조만] 표기 명확화** + VideoObject Google Rich Results 최소 필드 (name·description·thumbnailUrl·uploadDate·contentUrl/embedUrl), (7) **§ 5.1 dayOfWeek enum 변환표** + specialClosures 기본 미출력 정책, (8) **§ 7.2 빌드 게이트 vs 운영 모니터링 분리** — 공식 validator는 모니터링·수동 QA로, (9) **§ 7.3 룰 레벨 분류 (fail/warning/content-gate)** + **§ 8 표에 룰 레벨 명시** |
..\..\docs\core\SCHEMA_MAPPING.md:986:| 2026-05-14 | v0.4 | **잔재 정리·룰 충돌 해소** (피드백 8건): (1) **§ 2.3 A/B 카테고리 풀명세 재펼침** ("이전과 동일" 잔재 제거), (2) **inLanguage 잔재 4곳 제거** — Organization·MedicalClinic·Physician·MedicalProcedure 매핑 표, (3) **MedicalRiskFactor 룰 충돌 해소** — schema 출력은 **fail로 통일**, 본문 표현(원인·위험요인)은 별도 content-gate 분리, (4) **§ 9 미결정 정리** — SM-05·SM-07 "해소" 표시, (5) **P-106 Quiz 제거** — `WebPage`/`MedicalWebPage`만, (6) **P-103 ImageGallery 제거** — 본문 갤러리 또는 `WebPage.image: ImageObject[]`, (7) **§ 5 C-02 Person 후속** 명시 (M0 외), (8) **§ 7.3 warning 예시에서 MedicalRiskFactor 제거** (fail로 통일) — `MedicalIndication` 단정형·`HealthAndBeautyBusiness` 단독 사용 등으로 교체 |
..\..\docs\core\SCHEMA_MAPPING.md:987:| 2026-05-14 | v0.5 | **미세 잔재 해소·룰 단순화** (피드백 7건): (1) **P-008 riskFactor → MedicalRiskFactor 행 삭제** — fail 정책 정합. causes[]는 description 보조·본문 표현으로, (2) **P-008 주석 정정** — "신중" → "schema 출력 안 함, 본문은 content-gate", (3) **HealthAndBeautyBusiness fail로 통일** (§ 2.4·§ 8 모두) — 단독·병행 모두 미사용, (4) **MedicalIndication fail로 통일** — Schema 출력 금지, 본문 효능 표현만 content-gate, (5) **HowTo Rich Results A 목록에서 제거** — 미사용. 미래 확장 시 카탈로그·결정표·의료 리스크 룰 추가, (6) **§ 2.4에 Person 두 케이스 분리** — Organization.founder는 Allowed inline / Article.author (non-clinician)는 M0 외 후속, (7) **VideoObject 필수 필드 표현 명확화** — `name·description·thumbnailUrl·uploadDate` 4개 필수 + `contentUrl`/`embedUrl` 중 1개 |
..\..\docs\core\SCHEMA_MAPPING.md:988:| 2026-05-14 | v0.6 | **정책 표 정합화** (피드백 7건): (1) **§ 2.5 신설 — 공통 entity별 페이지 출력 정책 (단일 SoT)** — Organization/WebSite/MedicalClinic의 풀 entity vs 참조 위치 명시. § 7.1 룰 checker가 본 표 기준으로 검증, (2) "풀 entity vs 참조" 용어 정의 — graph[]에 entity 정의 여부 명확, (3) **§ 0 요약 일관화** — "신중하게" → fail로, validator 표현을 § 7.2와 일치 (자체 checker = 빌드, 공식 validator = 모니터링), (4) **LocalBusiness 별도 출력 제거** — § 2.1·§ 5 C-20 정정. `MedicalClinic`이 LocalBusiness sub-class이므로 `@type: "MedicalClinic"`만 사용, LocalBusiness 계열 속성 활용, (5) **SearchAction Conditional** — `/search` 라우트 부재 시 미출력 (M0 미출력, 검색 기능 활성화 시 합류), (6) **§ 7.3 warning 예시 교체** — MedicalIndication·HealthAndBeautyBusiness 제거(둘 다 fail). 비차단 항목(외부 위젯 @id 충돌·VideoObject 권장 필드 누락·본문 길이 미달 등)으로 교체 |
..\..\docs\core\SCHEMA_MAPPING.md:989:| 2026-05-14 | v0.7 | **§ 2.5 SoT 기준 일괄 동기화** (피드백 7건): (1) **§ 2.1 SearchAction Conditional 명시**, **ReserveAction을 LocalBusiness → MedicalClinic.potentialAction**으로 정정, (2) **§ 2.4 MedicalClinic 결정 변경** — "본원 1개 전 페이지" → "§ 2.5 정책에 따라 full 또는 ref", (3) **§ 2.5 P-105 Reservation 풀 entity로 재분류**, P-101~P-106 일괄 ref 거친 표현 세분화, (4) **§ 3·§ 4 페이지별 graph 구성 [풀]/[참조]/[참조+inline] 표기 일괄 적용** — P-003·P-004·P-007·P-008·P-009·P-010·P-011·P-013·P-101~P-106, (5) **§ 7.1 검증 룰 정정** — "PageMeta.canonical 필수" → "**resolved canonical URL 필수** (PageMeta.canonical 또는 SchemaInput.canonicalUrl로 결정)" |
..\..\docs\core\SCHEMA_MAPPING.md:990:| 2026-05-14 | v0.8 | **§ 2.5 cascade 마무리** (피드백 6건): (1) **P-005 MedicalClinic [참조만]로 변경** — PAGE_TYPES § 3 P-005에 위치 정보 슬롯 없음. § 2.5 풀 지정 페이지에서 제거, (2) **P-005·P-006·P-012·P-014 [풀]/[참조] 표기 적용** — v0.7 일괄 적용 시 누락된 페이지 보완, (3) **P-014 @id 분기 명시** — 단지점 main = `#clinic` (본원 entity와 동일), 다지점 비본원 = `/locations/{slug}#clinic` (별도 entity), (4) **§ 7.1 일반 검증 룰 추가** — "§ 2.5에서 풀로 지정된 entity는 해당 페이지 필수" (룰 checker의 일반 룰. 페이지별 명시는 보조), (5) **§ 7.1 MedicalClinic 풀 페이지 목록 확장** — P-001·P-002·P-006·P-012·P-014·P-105 (이전 P-012·P-014만), (6) **§ 2.1 ReserveAction Conditional 명확화** — "reservationChannels 또는 페이지 예약 CTA가 실제 있을 때만" |
..\..\docs\core\PAGE_TYPES.md:46:| P-011 | FAQ | `/faq` | `FAQ[]` | |
..\..\docs\core\PAGE_TYPES.md:75:- 콘텐츠 본문은 `<article>`. 보조 섹션은 `<aside>` 또는 `<section>`.
..\..\docs\core\PAGE_TYPES.md:116:**위험도 기본값**: Low
..\..\docs\core\PAGE_TYPES.md:146:**위험도 기본값**: Low
..\..\docs\core\PAGE_TYPES.md:162:**위험도 기본값**: Low
..\..\docs\core\PAGE_TYPES.md:189:**레이아웃 변형**: 좌사진·우본문 / 풀폭 헤더+본문 / 매거진형
..\..\docs\core\PAGE_TYPES.md:190:**위험도 기본값**: Low
..\..\docs\core\PAGE_TYPES.md:206:**위험도 기본값**: Low
..\..\docs\core\PAGE_TYPES.md:215:**Schema 요약**: `MedicalProcedure` + BreadcrumbList + (FAQ 블록 시) `FAQPage`.
..\..\docs\core\PAGE_TYPES.md:241:**선택 블록**: 프로그램 변형 / 소요 시간 / 시술 후 관리 / 유지 계획 / 근거 노트 / FAQ / 관련 의료진 / 관련 질환
..\..\docs\core\PAGE_TYPES.md:258:| 근거 노트 (`evidenceNotes`) | Low | 인용·링크는 사실 안내. 단 효과 단정 결합 시 → High |
..\..\docs\core\PAGE_TYPES.md:259:| FAQ | 답변별 가변 | 효과·결과 답변 → High |
..\..\docs\core\PAGE_TYPES.md:262:| CTA | Low~Medium | 할인·이벤트 결합 → High |
..\..\docs\core\PAGE_TYPES.md:266:**내부 링크 권장**: → 담당 의료진 / 관련 질환 / 관련 시술 / FAQ
..\..\docs\core\PAGE_TYPES.md:280:**위험도 기본값**: Low
..\..\docs\core\PAGE_TYPES.md:289:**Schema 요약**: `MedicalCondition` (signOrSymptom, riskFactor, possibleTreatment) + BreadcrumbList + (해당 시) FAQPage.
..\..\docs\core\PAGE_TYPES.md:304:**선택 블록**: 진단 / FAQ / 관련 시술 / 관련 의료진
..\..\docs\core\PAGE_TYPES.md:308:**내부 링크 권장**: → 관련 Treatments / 관련 Articles / FAQ
..\..\docs\core\PAGE_TYPES.md:322:**위험도 기본값**: Low
..\..\docs\core\PAGE_TYPES.md:331:**URL**: `/insights/{category}/{slug}` 또는 `/blog/{slug}`
..\..\docs\core\PAGE_TYPES.md:333:**Schema 요약**: `Article` (headline, datePublished, dateModified, author=Physician/Person, publisher, mainEntityOfPage, articleSection, wordCount, inLanguage) + BreadcrumbList + (Q&A 블록 시) FAQPage + (video 시) VideoObject.
..\..\docs\core\PAGE_TYPES.md:338:3. 본문 (의도적 구조 — 헤딩·리스트·표·Q&A)
..\..\docs\core\PAGE_TYPES.md:349:**헤딩 위계**: H1 글 제목 / H2 본문 섹션 (질문형 권장)
..\..\docs\core\PAGE_TYPES.md:350:**필수 블록**: 제목 / 메타 / 본문 / 저자 카드
..\..\docs\core\PAGE_TYPES.md:351:**선택 블록**: 임베디드 미디어 / 검수 정보 / 관련 글 / 관련 시술 / FAQ / CTA
..\..\docs\core\PAGE_TYPES.md:357:| `notice` | Low |
..\..\docs\core\PAGE_TYPES.md:365:**레이아웃 변형**: 좌본문·우사이드바 / 풀폭 본문 / 매거진형
..\..\docs\core\PAGE_TYPES.md:371:### P-011. FAQ
..\..\docs\core\PAGE_TYPES.md:375:**주 데이터 계약**: `FAQ[]`
..\..\docs\core\PAGE_TYPES.md:376:**Schema 요약**: `FAQPage` (mainEntity = Question[]) + BreadcrumbList.
..\..\docs\core\PAGE_TYPES.md:388:| 진료·예약·위치·시간 | Low |
..\..\docs\core\PAGE_TYPES.md:416:**위험도 기본값**: Low
..\..\docs\core\PAGE_TYPES.md:431:- 1호 출시 전 **법무 검토 필수** (ComplianceRecord.legalCounsel·legalCounselAt 필드 — DATA_MODEL.md C-10 위험도 Low 예외 룰 참조).
..\..\docs\core\PAGE_TYPES.md:436:3. 본문 (조항·항목 위계)
..\..\docs\core\PAGE_TYPES.md:441:**필수 블록**: 시행일 / 본문 / 문의처
..\..\docs\core\PAGE_TYPES.md:443:**레이아웃 변형**: 평면 본문 / TOC 사이드바
..\..\docs\core\PAGE_TYPES.md:444:**위험도 기본값**: Low (사실 안내. 법적 정확성 확인 필수)
..\..\docs\core\PAGE_TYPES.md:450:**내부 링크 권장**: 푸터 전체 접근. 본문 내부 링크는 일반적으로 없음.
..\..\docs\core\PAGE_TYPES.md:474:**위험도 기본값**: Low
..\..\docs\core\PAGE_TYPES.md:488:  - `parentClinic` = ClinicProfile의 `@id`
..\..\docs\core\PAGE_TYPES.md:492:  - **`featuredChannelId`** (선택) — 강조할 채널이 있을 때만 `reservationChannels[]`의 `@id` 명시
..\..\docs\core\PAGE_TYPES.md:549:**Schema 요약**: 일반 소식은 `Article` 또는 `NewsArticle`. 이벤트 콘텐츠는 schema 신중.
..\..\docs\core\PAGE_TYPES.md:559:| 일반 소식·휴진·이전 | Low |
..\..\docs\core\PAGE_TYPES.md:575:**위험도 기본값**: Low
..\..\docs\core\PAGE_TYPES.md:583:**Schema 요약**: `WebPage` 또는 `MedicalWebPage` + `FAQPage` 일부.
..\..\docs\core\PAGE_TYPES.md:604:| P-001 | Home | `/` | ClinicProfile | Organization + MedicalClinic + WebSite | Low | | ✅ |
..\..\docs\core\PAGE_TYPES.md:605:| P-002 | About | `/about` | ClinicProfile | Organization + MedicalClinic | Low | | ✅ |
..\..\docs\core\PAGE_TYPES.md:606:| P-003 | Doctors List | `/doctors` | DoctorProfile[] | ItemList | Low | | ✅ |
..\..\docs\core\PAGE_TYPES.md:607:| P-004 | Doctor Profile | `/doctors/{slug}` | DoctorProfile | Physician | Low | | ✅ |
..\..\docs\core\PAGE_TYPES.md:608:| P-005 | Treatments List | `/treatments` | TreatmentPage[] | ItemList | Low | | ✅ |
..\..\docs\core\PAGE_TYPES.md:610:| P-007 | Conditions List | `/conditions` | MedicalConditionPage[] | ItemList | Low | | |
..\..\docs\core\PAGE_TYPES.md:612:| P-009 | Articles List | `/insights` | Article[] | ItemList/Blog | Low | | |
..\..\docs\core\PAGE_TYPES.md:613:| P-010 | Article Detail | `/insights/{cat}/{slug}` | Article | Article (+VideoObject) | ArticleType 가변 | | ✅ (1) |
..\..\docs\core\PAGE_TYPES.md:614:| P-011 | FAQ | `/faq` | FAQ[] | FAQPage | 답변 가변 | | |
..\..\docs\core\PAGE_TYPES.md:615:| P-012 | Contact / Visit (Conversion Hub) | `/contact` | ClinicProfile + LocationProfile[] | MedicalClinic/LocalBusiness | Low | | ✅ |
..\..\docs\core\PAGE_TYPES.md:616:| P-013 | Legal / Policy | `/privacy` 등 | LegalDocument | WebPage | Low | | ✅ (자동) |
..\..\docs\core\PAGE_TYPES.md:617:| P-014 | Location / Branch Detail | `/locations/{slug}` | LocationProfile | MedicalClinic/LocalBusiness (지점) | Low | | ✅ (main) |
..\..\docs\core\PAGE_TYPES.md:621:| P-104 | News / Event | `/news` | NewsItem[]/Article[] | NewsArticle/Article | 가변 | ✅ (이벤트) | |
..\..\docs\core\PAGE_TYPES.md:622:| P-105 | Reservation | `/reservation` | ReservationPage | LocalBusiness + ReserveAction | Low | | |
..\..\docs\core\PAGE_TYPES.md:646:2. P-011 FAQ
..\..\docs\core\PAGE_TYPES.md:671:| PT-09 | FAQ 답변 단위 위험도 UI | admin |
..\..\docs\core\PAGE_TYPES.md:673:| PT-11 | Article video contentFormat의 VideoObject schema 깊이 | SCHEMA_MAPPING.md |
..\..\docs\core\PAGE_TYPES.md:688:| 2026-05-14 | v0.5 | **피드백 적용**: (1) **전체 본문 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, 단독 구현 명세화, (2) **P-014 LocationProfile main 자동 생성 규칙 명시** (어드민 화면 추가 없음), (3) **P-006 TreatmentPage 정보 슬롯에 treatmentComponents·recommendedFor·visitFlow·remoteCareAvailable·maintenancePlan·evidenceNotes 즉시 통합**, (4) **P-010 Article 정보 슬롯에 reviewedBy·contentSource·externalUrl 즉시 통합**, (5) **P-106 Self-test를 "Feature-backed optional page"로 표현 변경** (PT-12 해소), (6) PT-14 LocationProfile 자동 생성 규칙 어드민 구현 세부 신규, (7) **v0.5.1 추가 정정**: **P-013 Legal/Policy를 M0 출시 게이트로 격상** — Core 표준 템플릿 + ClinicProfile 변수 자동 치환 생성. M0 페이지 수 9 → **10**. 어드민 화면 수 6개 그대로 (자동 생성). 법무 검토 필수 (ComplianceRecord 추적) |
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:5:> **acceptance commit 구성 (cycle2 LL-33 · cycle5 LL-56 acceptance precondition)**: 본 commit 에 다음 5 cascade 동시 포함 — (1) LOCATION_LEGAL_PLAN.md v1.0 (본 문서), (2) LL-CASCADE-01 docs/admin/ARCHITECTURE.md § 3.8.2 patch, (3) LL-CASCADE-02 docs/decisions/ADMIN_UI_SKELETON_PLAN.md § 5.5 patch, (4) LL-CASCADE-03 docs/core/CONTENT_STANDARDS.md § 7 patch, (5) LL-CASCADE-04 docs/decisions/M0_BUILD_EXPORT_PLAN.md v0.1 placeholder (작성 완료). LL-CASCADE-05 (packages/migrations-runner manifest spec) 은 manifest 파일 신설 정도 — 실 runner 코드 acceptance 는 LL-DEFER-20 (M0 v1.0 본 구현).
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:18:- `docs/core/CONTENT_STANDARDS.md` v1.3 — cycle1 LL-13 patch: 경로 정정 (admin/CONTENT_STANDARDS 아님). Markdown 본문 검증 (answer-first AST · 표현 검사) 의 LegalDocument 면제 규약 (§ 7 ContentType 예외 표 — LegalDocument 면제 marker).
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:19:- `docs/compliance/RISK_LEVELS.md` v1.1 · `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0 — `LegalDocument: legalCounsel/legalCounselAt required` 의 위험도 Low 예외 게이트 (RL § 4.3)
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:44:| `clinic_profile` 정책 변수 + primaryCtas 컬럼 추가 | `policy_contact_person` · `policy_contact_email` · `policy_contact_phone` · `policy_effective_date` · `primary_ctas` (JSONB · cycle1 LL-02 patch) |
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:48:| 변수 치환 엔진 | `{{clinic.*}}` · `{{location.main.*}}` · `{{policy.*}}` 화이트리스트 strict — server action runtime 검증 (cycle1 LL-24 patch) |
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:50:| 5종 LegalDocument 별 effective_date input | cycle1 LL-15 patch — LL-DEFER-08 reversal. 5 record 별 individual input · default = policy_effective_date |
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:65:| LegalDocument body 직접 수동 override | M1 Phase Alpha | LL-DEFER-06 |
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:70:| LegalDocument body 검증 (CONTENT_STANDARDS § 7 ContentType 예외 marker 명시 + 면제 범위 cascade) | cycle1 LL-13 patch — CONTENT_STANDARDS § 7 의 LegalDocument 면제 marker 가 plan SoT cascade. 본 plan 에서 추가 검증 룰 미정의 | LL-DEFER-11 |
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:91:  body TEXT NOT NULL,                 -- Markdown
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:99:  risk_level risk_level NOT NULL DEFAULT 'Low',
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:106:  CONSTRAINT legal_document_body_length CHECK (length(body) BETWEEN 1 AND 200000),
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:120:  -- cycle1 LL-12 patch: risk_level NOT NULL + skeleton 단계 'Low' 만 허용 (compliance-assistant cascade 까지)
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:121:  CONSTRAINT legal_document_risk_level_skeleton_limit CHECK (risk_level = 'Low'),
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:133:ALTER TABLE legal_document ENABLE ROW LEVEL SECURITY;
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:134:ALTER TABLE legal_document FORCE ROW LEVEL SECURITY;
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:149:- (LL-SCHEMA-06 · cycle1 LL-12 patch) `risk_level` NOT NULL + CHECK `= 'Low'` — skeleton 단계 Low 만 (compliance-assistant 의 RiskLevel 자동 추론 cascade 까지 변경 불가).
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:155:-- packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:157:ALTER TABLE clinic_profile
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:158:  ADD COLUMN policy_contact_person TEXT,
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:159:  ADD COLUMN policy_contact_email TEXT,
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:160:  ADD COLUMN policy_contact_phone TEXT,
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:161:  ADD COLUMN policy_effective_date DATE,
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:165:ALTER TABLE clinic_profile
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:166:  ADD CONSTRAINT clinic_profile_policy_email_regex CHECK (
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:167:    policy_contact_email IS NULL
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:168:    OR policy_contact_email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:171:  ADD CONSTRAINT clinic_profile_policy_phone_format CHECK (
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:172:    policy_contact_phone IS NULL
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:173:    OR policy_contact_phone ~ '^(\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}$'
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:201:    -- DB key = 'id' (Git 출력 시 '@id' alias 변환은 LL-CASCADE-04 build/export 책임)
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:231:- (LL-SCHEMA-10 · cycle1 LL-14 patch) `policy_contact_phone` 도 form 단계 required (DB NULL 허용은 유지 — 향후 cookie/other manual 입력 row 호환).
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:232:- (LL-SCHEMA-11 · cycle1 LL-15 patch) `policy_effective_date` 는 form 안 5 LegalDocument record 의 default 만. 운영자가 각 record 별 override 가능 (LL-DEFER-08 closed).
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:246:ALTER TABLE location_profile
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:256:ALTER TABLE location_profile
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:257:  ALTER COLUMN clinic_profile_id SET NOT NULL;
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:314:| **(c) 정책 변수** (신규 보조 details) | policyContactPerson · policyContactEmail · policyContactPhone · policyEffectiveDate (5종 default) | `ClinicProfile.policy_*` |
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:315:| **(d) 5종 LegalDocument** (신규 보조 details — cycle1 LL-15 patch) | 5 record 별 effectiveDate override (optional · 미입력 시 policyEffectiveDate default) | `LegalDocument` × 5 |
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:320:- (LL-FORM-04 · cycle1 LL-14 patch) 섹션 (c) 는 LegalDocument 생성에 필수 — policyContactPerson · policyContactEmail · policyContactPhone · policyEffectiveDate **4 필드 모두 required**. (한국 PIPA 의 개인정보 보호책임자 필수 고지 항목 — 소속/부서 같은 추가 필드는 LL-DEFER 또는 자유 입력 textarea 로 처리. v0.2 는 4 필드만 minimal.)
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:336:  - 미입력 (빈 string 또는 missing) = policyEffectiveDate fallback (server action 안 default 결정). 일부만 override 케이스 정상 — 입력된 record 만 override.
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:348:  // cycle1 LL-18 patch: LegalDocument 편집은 skeleton 단계 status=draft + risk_level=Low 의 CHECK 로 제한.
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:364:- (LL-ACTION-06 · cycle1 LL-16 + cycle3 LL-46 patch) **자동 재렌더링 분기 제거** — v0.4 는 LegalDocument 본문 수동 편집 차단 (LL-DEFER-06) 이므로 모든 row 가 templateVersion=current. 매 저장 시 모든 LegalDocument body 재렌더링. **운영자 알림 marker (LL-FORM-15 · 폼 (d) 상단 안내문)**: "본원 정보(기관명·법인명·사업자번호·설립자·본원 주소·전화·이메일) 또는 정책 변수(담당자·이메일·전화·시행일)를 수정하면 5종 정책 문서 본문이 자동으로 다시 생성됩니다. 본문 직접 수정은 추후 단계에서 합류합니다." 향후 수동 override 도입 시 별도 `body_source` enum (`auto`/`manual`) 컬럼 cascade.
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:389:  policy: {                  // cycle1 LL-06 patch: admin/ARCH § 3.8.2 의 contactPerson 입력 섹션 = policy.* 변수 출처. SoT 정당화.
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:401:- (LL-ACTION-11) 변수 화이트리스트 strict — 등록되지 않은 키 (`{{foo.bar}}`) 는 build error throw (server action 안에서 catch → formError). 운영자 입력 본문이 아니라 Core 표준 템플릿만 처리하므로 XSS 위험 없음.
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:402:- (LL-ACTION-12 · cycle1 LL-24 patch) **검출 시점 = server action runtime** — 매 저장 시 5종 template body 를 renderTemplate 호출 → unknown key throw → formError. build-time unit test 도 cascade (templates 자체 의 unknown key 부재 검증) — `packages/core-content` test runner.
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:405:- (LL-ACTION-15) 출력 형식: Markdown plain text. HTML escape 없음 — DB body 컬럼은 Markdown SoT.
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:406:- (LL-ACTION-16 · cycle1 LL-06 + cycle2 LL-33 patch) `policy.*` 변수 정당화 — admin/ARCH § 3.8.2 의 `contactPerson` 필드 + § 3.8.2 결정 ("ClinicProfile 폼 '정책 변수' 보조 섹션") 이 SoT 출처. ARCH 본문에 `policy.*` 변수가 명시되지 않은 것은 ARCH 의 변수 사용 sample 일 뿐. **acceptance 전 순서 정합 (cycle2 LL-33)**: 본 plan v1.0 acceptance **와 동시 또는 직전에** ARCH § 3.8.2 patch (LL-CASCADE-01) 적용 — plan acceptance commit 안에 ARCH 패치 포함. plan 단독 acceptance 시 ARCH SoT 충돌 잔존하므로 cascade 가 acceptance precondition.
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:443:  - `legal_document_risk_level_skeleton_limit` → formError ("정책 문서 위험도는 현재 단계에서 Low 만 허용됩니다. 위험도 수동 분류는 위험도 분류 UI(M0 v1.0) 합류 후 가능합니다.")
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:444:  - `clinic_profile_policy_email_regex` → fieldErrors.policyContactEmail
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:445:  - `clinic_profile_policy_phone_format` → fieldErrors.policyContactPhone
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:477:  body: string;           // raw Markdown with {{...}} placeholders
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:485:- (LL-TEMPLATE-03) 본문은 Markdown 원본 텍스트로 packages 안 보관. 빌드 시 dist 에 동봉. import 는 ESM `import { TEMPLATES } from "@glitzy/core-content/templates"`.
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:486:- (LL-TEMPLATE-04) **법무 검토 필수 marker** — README/CHANGELOG 에 명시. Core 표준 템플릿 본문 자체는 본 plan 의 검토 범위 외. 별도 cascade 로 법무 검토 받은 본문으로 교체.
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:487:- (LL-TEMPLATE-05 · cycle1 LL-06 patch) 변수 화이트리스트 (admin/ARCH § 3.8.2 SoT cascade marker LL-CASCADE-01 — ARCH 본문에 본 표 reference 추가):
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:490:  - `{{policy.contactPerson}}` · `{{policy.contactEmail}}` · `{{policy.contactPhone}}` · `{{policy.effectiveDate}}`
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:492:- (LL-TEMPLATE-07 · cycle1 LL-13 patch) **LegalDocument body 검증 면제 명시** — `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표에 LegalDocument 추가 (cascade marker LL-CASCADE-03). 면제 범위: (1) answer-first AST 미적용 (정책 문서는 첫 문장 답 제시 구조 아님) (2) 표현 검사 (recommend/best 등 광고 표현) 미적용 (3) 변수 화이트리스트 검증은 별도 룰 (LL-ACTION-12).
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:505:  8. `packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql` — clinic_profile ALTER (policy_* + primary_ctas)
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:506:  9. `packages/core-content/migrations/C0008_location_profile_parent_clinic.sql` — location_profile ALTER (clinic_profile_id composite FK)
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:532:| 2 | C0007 clinic_profile policy + primaryCtas migration | packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql |
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:535:| 5 | zod schema (businessHours · primaryCtas · policy vars · 5 LegalDocument override) | apps/web/src/lib/clinic-profile-schema.ts |
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:550:- `LL-DEFER-11`: LegalDocument body 검증 — CONTENT_STANDARDS § 7 ContentType 예외 marker cascade (LL-CASCADE-03). 추가 검증 룰은 compliance-assistant Feature.
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:553:- `LL-DEFER-20` (cycle4 LL-53 patch): packages/migrations-runner 실 runner 코드 — manifest spec 작성 (plan v1.0 acceptance precondition) 후 sequential apply + fail-fast 구현. M0 v1.0 본 구현.
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:560:- `LL-DEFER-06`: LegalDocument body 수동 override · `body_source` enum cascade.
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:592:- `LL-CASCADE-01`: `docs/admin/ARCHITECTURE.md` § 3.8.2 표 — body 변수 화이트리스트 11개 (clinic 4 + location 3 + policy 4) reference 추가. ARCH v0.8 patch. **acceptance precondition**.
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:594:- `LL-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표 — LegalDocument 면제 marker 추가 (answer-first AST · 표현 검사 면제 · 변수 화이트리스트 별도 룰). **acceptance precondition**.
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:595:- `LL-CASCADE-04` (cycle3 LL-41 + cycle4 LL-49 + **cycle5 LL-56 patch — placeholder 실 파일 작성 완료**): **cascade target 정정** — ADMIN_UI_SKELETON_PLAN § 6 은 walking skeleton 의 actions 영역으로 build/export 부재 → **`docs/decisions/M0_BUILD_EXPORT_PLAN.md` (v0.1 placeholder · 2026-05-16 작성 완료)** + 본 plan 의 LL-CASCADE-04 marker reference. apps/worker · M0 v1.0 Git export 책임: LocationProfile.reservationChannels Git 출력 시 `clinic_profile.primary_ctas` deep clone, LocationProfile.@id = `"main"`, LocationProfile.parentClinic = ClinicProfile.@id reference, ClinicProfile.locations[] = SELECT 결과, primary_ctas DB key `id` → Git output `@id` alias 변환. **acceptance 강도 = placeholder 작성 완료** (`docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 1.2 LL-CASCADE-04 책임 표 명시). 실 구현은 M0 v1.0 본 구현.
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:596:- `LL-CASCADE-05` (cycle3 LL-42 + cycle4 LL-53 patch + **v1.1 LLC-18 patch — "8단계" → "9단계" stale wording 정정**): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장. **acceptance 강도 명시** — plan v1.0 acceptance 는 **manifest spec 작성까지만 차단** (manifest 파일 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` 의 spec 작성 + 본 plan 의 **9단계 의존성 표** cascade · v1.1 LLC-15 patch 로 8→9단계 갱신 정합). 실 runner 코드 구현은 M0 v1.0 cascade (LL-DEFER-20 신설). 즉 plan v1.0 acceptance ≠ runner 코드 acceptance.
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:603:| 2026-05-16 | v0.2 | **Codex 비평 cycle1 25 findings (7 blocking + 12 major + 6 minor) 전건 수용 patch**: (LL-01) location_profile 에 clinic_profile_id composite FK + main row CHECK, ClinicProfile.locations[] Git 출력 빌드 시점 동적 구성. (LL-02) ClinicProfile.primary_ctas 컬럼 + LocationProfile.reservationChannels = primary_ctas 자동 상속 marker. (LL-03·04) status='draft' 만 허용 (review-queued 도 차단) — ComplianceRecord pre-publish + NotificationEvent 합류 시점까지 defer. (LL-05) businessHours SoT CT-02 형식 (openingHours[]·receptionHours[]·lunchBreaks[]·specialClosures[]) 변환 + server action 안 convertToOpeningHoursSpec 명시. (LL-06) policy.* 변수 정당화 + LL-CASCADE-01 cascade marker. (LL-07) 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha. (LL-08·09) partial UNIQUE — closed 5종만. cookie/other LL-DEFER-12. (LL-10) C-21 출력 매핑표 명시. (LL-11) representativeDoctors v0.2 빈 배열. (LL-12) risk_level NOT NULL + CHECK 'Low' 만. (LL-13) SoT 경로 정정 (docs/core/CONTENT_STANDARDS.md) + LL-CASCADE-03. (LL-14) policyContactPhone form 단계 required. (LL-15) effective_date individual override 합류 (LL-DEFER-08 closed). (LL-16) 자동 재렌더링 분기 제거 (모든 row 매 저장 시 재렌더링). (LL-17) audit 7 row 별도 emit (Bundle outer 폐기). (LL-18) RBAC 분리 marker LL-DEFER-09 명시. (LL-19) published CHECK 위반 시 운영자 메시지 + errors.ts 매핑. (LL-20) phone regex 한국 + 국제 표기 명시. (LL-21) effective_date timezone Asia/Seoul. (LL-22) template_version naming autoGenerated=true 일 때만 필수. (LL-23) businessHours a11y marker. (LL-24) detection 시점 server action runtime + build-time test cascade. (LL-25) LL-DEFER-08~10 본문 §1 비범위 표 반영. |
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:605:| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:606:| 2026-05-16 | v0.5 | **Codex 비평 cycle4 8 findings (2 blocking + 4 major + 2 minor) 전건 수용 patch**: (LL-48) trigger RAISE EXCEPTION USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' 추가 — errors.ts mapDbErrorToResult 가 SQLSTATE 23514 + constraint name 으로 분기 가능. (LL-49) LL-CASCADE-04 target 정정 — ADMIN_UI_SKELETON_PLAN § 6 은 actions 영역으로 build/export 부재. 신규 `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 신설 + LL-CASCADE-04 책임 row 1건 cascade. acceptance 강도 = placeholder 작성. (LL-50) CT-03 enum SoT 정렬 — DB trigger 허용 11종 (phone/email/sms/kakao-talk/kakao-channel/naver-reservation/naver-talk/form/map/external/video-consultation) + UI subset 3종 분리. LL-DEFER-19 8종 UI 합류. (LL-51) form (b) UI copy 정정 — kakao → kakao-talk · naver-booking → naver-reservation 토큰. (LL-52) LL-DEFER-04/05 phase 충돌 정정 — §9.3 → M0 v1.0 본 구현 (LocationProfile 편집 화면) 으로 통일. M2 Phase Beta 표기 제거 (현재 비어 있음 — 외부 사용자 RBAC 가 M2). (LL-53) LL-CASCADE-05 강도 명시 — plan v1.0 acceptance = manifest spec 작성만 차단, 실 runner 코드는 LL-DEFER-20 (M0 v1.0). (LL-54) trigger function IMMUTABLE 마킹 제거 — VOLATILE 기본 (NEW 읽기 + row-specific RAISE 정합). (LL-55) Sentry pre-integration fallback 명시 — v0.5 단계 console/server stdout only, M0 v1.0 LL-DEFER-18 합류 후 Sentry capture. **누계 55 findings 전건 수용**. |
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:608:| 2026-05-16 | **v1.0** | **Codex 비평 cycle6 1 minor finding (LL-59) 수용 + closeableAfterPatch=true 확정 acceptance**: (LL-59) §2.2 본문 "M0 v1.0 또는 M1 cascade" → "M1 Phase Alpha cascade" 단일화 (LL-DEFER-19 § 9.2 위치와 정합). **수렴 추세 25→12→10→8→3→1 · blocking 0 · major 0 · minor 0 잔존**. cycle6 결과 acceptance commit 5 cascade (LL-CASCADE-01~05) 동시 포함 결정. **누계 59 findings 전건 처리 완료**. |
..\..\docs\decisions\LOCATION_LEGAL_PLAN.md:609:| 2026-05-18 | v1.1 | **Code review (cycle 1~3) 결과 plan SoT 보강 patch — 본 plan 의 코드 구현 cycle 동안 발견된 plan-code 불일치 4건 수용**: (LLC-15) § 6 migration 의존성 표 8단계 → 9단계 (C0003 doctor_profile 추가 — C0005 article.author_doctor_id FK precondition). (LLC-16) § 7 시나리오 15 "403" → `ForbiddenAccessPage` UI 렌더 + `tenant-resolve-denied` audit emit 으로 정정. 정확한 HTTP 403 status 보장은 § 9.1 `LL-DEFER-21` 신설 (Next.js 14 server component status code 한계 → Next 15 `unauthorized()/forbidden()` 합류 cascade). (LLC-17) § 4.4 LL-ACTION-18 fallback payload 에 `failedDetails: [{target, code, name, message}]` 추가 명시. (LLC-18) § 10 LL-CASCADE-05 본문 + manifest 주석의 "8단계" stale wording → "9단계"로 정정. 코드 누계 cycle 3 회 (14→3→1) · 누계 18 findings 수용 (cycle 6 plan acceptance 59 + cycle 1·2·3 code review 14+3+1). |
..\..\packages\db\migrations\D0011_public_reader.sql:1:-- @glitzy/db — D0011 app_public_reader role + per-table SELECT policy
..\..\packages\db\migrations\D0011_public_reader.sql:5:-- instance lookup + 6 content table 의 per-table SELECT policy 를 명시한다.
..\..\packages\db\migrations\D0011_public_reader.sql:7:-- M0 v1.0 production 단계에는 NOLOGIN + MEMBERSHIP 분리 합류 (PSR-DEFER-16).
..\..\packages\db\migrations\D0011_public_reader.sql:9:-- LOGIN role — v0.1 단순화 (production NOLOGIN/MEMBERSHIP cascade marker PSR-DEFER-16).
..\..\packages\db\migrations\D0011_public_reader.sql:12:-- PSRC-04 patch: migration 안 password 하드코딩 금지. role/권한/policy 만 생성하고
..\..\packages\db\migrations\D0011_public_reader.sql:13:-- password 는 환경별 provision 단계에서 별도 설정 (예: 로컬 dev `ALTER ROLE app_public_reader PASSWORD '...'`,
..\..\packages\db\migrations\D0011_public_reader.sql:15:CREATE ROLE app_public_reader LOGIN;
..\..\packages\db\migrations\D0011_public_reader.sql:17:GRANT USAGE ON SCHEMA public TO app_public_reader;
..\..\packages\db\migrations\D0011_public_reader.sql:19:-- ===== instance lookup policy =====
..\..\packages\db\migrations\D0011_public_reader.sql:21:-- 별도 policy (active=true 만 노출).
..\..\packages\db\migrations\D0011_public_reader.sql:22:GRANT SELECT ON instance TO app_public_reader;
..\..\packages\db\migrations\D0011_public_reader.sql:24:CREATE POLICY public_reader_instance_select
..\..\packages\db\migrations\D0011_public_reader.sql:27:  TO app_public_reader
..\..\packages\db\migrations\D0011_public_reader.sql:30:-- ===== 6 content table per-table policy =====
..\..\packages\db\migrations\D0011_public_reader.sql:31:-- 모든 policy USING `instance_id = current_setting('app.current_instance_id')`
..\..\packages\db\migrations\D0011_public_reader.sql:36:  TO app_public_reader;
..\..\packages\db\migrations\D0011_public_reader.sql:38:CREATE POLICY public_reader_clinic_profile_select
..\..\packages\db\migrations\D0011_public_reader.sql:39:  ON clinic_profile FOR SELECT TO app_public_reader
..\..\packages\db\migrations\D0011_public_reader.sql:42:CREATE POLICY public_reader_location_profile_select
..\..\packages\db\migrations\D0011_public_reader.sql:43:  ON location_profile FOR SELECT TO app_public_reader
..\..\packages\db\migrations\D0011_public_reader.sql:46:CREATE POLICY public_reader_doctor_profile_select
..\..\packages\db\migrations\D0011_public_reader.sql:47:  ON doctor_profile FOR SELECT TO app_public_reader
..\..\packages\db\migrations\D0011_public_reader.sql:54:CREATE POLICY public_reader_treatment_page_select
..\..\packages\db\migrations\D0011_public_reader.sql:55:  ON treatment_page FOR SELECT TO app_public_reader
..\..\packages\db\migrations\D0011_public_reader.sql:63:CREATE POLICY public_reader_article_select
..\..\packages\db\migrations\D0011_public_reader.sql:64:  ON article FOR SELECT TO app_public_reader
..\..\packages\db\migrations\D0011_public_reader.sql:74:CREATE POLICY public_reader_legal_document_select
..\..\packages\db\migrations\D0011_public_reader.sql:75:  ON legal_document FOR SELECT TO app_public_reader
..\..\docs\core\CONTENT_STANDARDS.md:14:> - 위험도 등급·자동 추론 → `compliance/RISK_LEVELS.md` (후속)
..\..\docs\core\CONTENT_STANDARDS.md:24:- **content-gate**: 빌드는 통과(자동 차단 X) + 사람 검수 큐 진입 — 본문 표현 검수 + schema 출력 승인 + 위험 콘텐츠 발행 전 인간 결재의 일반 의미 (`SCHEMA_MAPPING.md` § 7.3, § 8 일관 적용).
..\..\docs\core\CONTENT_STANDARDS.md:39:| 의문문 | H2 헤딩으로만 사용 (AEO 친화), 본문에 빈번한 의문문 자제 |
..\..\docs\core\CONTENT_STANDARDS.md:55:| Article.body (P-010) | **최소 1,000자(공백 제외)** 권장 (warning 임계 — 미달 시 AI 스니펫·검색 노출 약화). 빌드 checker는 Markdown 원문에서 코드/링크/이미지 마크업·HTML 태그·공백·문장부호를 제거한 후 글자 수를 산정 (구현 알고리즘 [CS-A]) |
..\..\docs\core\CONTENT_STANDARDS.md:57:| FAQ.answer | 50~300자 권장 (Q&A 블록은 답변 우선 1~2문장) |
..\..\docs\core\CONTENT_STANDARDS.md:72:### 2.1 답변 우선 배치 (Answer-First)
..\..\docs\core\CONTENT_STANDARDS.md:76:| 본문 시작 1~2문장 내에 핵심 답변 배치 (§ 2.1.1 AST 정의) | warning (검색 노출 약화) | P-006·P-008·P-010·P-011 답변 단위·블록 본문 |
..\..\docs\core\CONTENT_STANDARDS.md:80:**예시 (P-006 Treatment Detail 본문 시작)**:
..\..\docs\core\CONTENT_STANDARDS.md:94:빌드 checker가 "본문 시작"을 판정하는 정확한 알고리즘:
..\..\docs\core\CONTENT_STANDARDS.md:100:4. 첫 번째 **본문 텍스트 블록**(Markdown AST에서 `paragraph` 또는 `<p>` 노드)을 "본문 시작"으로 채택
..\..\docs\core\CONTENT_STANDARDS.md:102:6. P-011 FAQ의 경우 각 Q&A 블록 단위로 동일 알고리즘 — `<dl>/<dt>` 다음 `<dd>` 또는 H3 다음 paragraph
..\..\docs\core\CONTENT_STANDARDS.md:121:본문에 다음을 의도적으로 섞어 배치하면 AI 스니펫 채택률 ↑:
..\..\docs\core\CONTENT_STANDARDS.md:129:| Q&A 블록 | `<dl>` 또는 FAQPage schema | FAQ 리치 결과 |
..\..\docs\core\CONTENT_STANDARDS.md:134:| P-006·P-008·P-010 본문에 구조화 블록 0개 (장문 산문만) | warning (AI 스니펫 추출 약화) |
..\..\docs\core\CONTENT_STANDARDS.md:153:- 본문 렌더링 — HTML `<dl><dt>질문</dt><dd>답변</dd></dl>` (또는 H3 질문 + 본문 답변 패턴)
..\..\docs\core\CONTENT_STANDARDS.md:154:- JSON-LD schema — 본문 Q&A 블록을 추출하여 별도 FAQPage 그래프 출력 (`SCHEMA_MAPPING` § 3 P-011 FAQPage 매핑). 렌더링 마크업과 schema 출력은 독립
..\..\docs\core\CONTENT_STANDARDS.md:175:**구조**: `<table>` + `<thead>` + `<tbody>`. 첫 행은 헤더.
..\..\docs\core\CONTENT_STANDARDS.md:189:- `info` — 일반 안내 (Low 위험)
..\..\docs\core\CONTENT_STANDARDS.md:203:- `Article.embeddedMedia[type: citation]` 또는 본문 `<blockquote>` + 출처
..\..\docs\core\CONTENT_STANDARDS.md:206:- "효과·통계 주장" 판정 — § 4.1의 "전문성 단정 (효과·결과·보장 결합)" composite 룰 매칭 텍스트, 또는 본문 내 수치(`%`, `kg`, `cm`, `주`, `일`, `회` 등 단위 동반 숫자) + 효과 어휘(효과·결과·개선·호전·변화) 동시 등장
..\..\docs\core\CONTENT_STANDARDS.md:215:### 3.6 임베디드 미디어 (VideoObject 등)
..\..\docs\core\CONTENT_STANDARDS.md:219:- VideoObject schema 최소 필드 출력 (SCHEMA_MAPPING § 3 P-010)
..\..\docs\core\CONTENT_STANDARDS.md:253:| "100% 효과" | "효과 인지 시점·정도는 환자 개인의 체질·생활 습관에 따라 다를 수 있습니다" (구체 효과 수치·사례 묘사는 본문 직접 진술 금지. § 3.5 인용·근거 또는 검증된 통계 출처 인용 형식으로만 기술) |
..\..\docs\core\CONTENT_STANDARDS.md:264:| 환자 후기 (치료경험담) | P-101 Reviews (선택) + ReviewPolicy(C-13) | 의료법 제56조에 따른 치료경험담 광고 금지 항목 — **본문 직접 인용 원칙 금지**. 사이트 게재가 의료광고에 해당하는지·의료법 제57조 사전심의 대상인지 여부는 매체·방식별 법무 판정 필요. 본문 효과 단정 표현은 분리하여 § 4.1 룰 적용 |
..\..\docs\core\CONTENT_STANDARDS.md:266:| 가격·할인·이벤트 안내 | P-102 Pricing / P-104 News·Event 카테고리=event / P-010 Article(`articleType=event-price`) | 본 페이지 타입·ArticleType 외 다른 페이지의 본문에는 가격·할인·이벤트 안내 텍스트 출현 시 content-gate. 압박형 유인 표현은 어디서나 fail (§ 4.1) |
..\..\docs\core\CONTENT_STANDARDS.md:309:### 5.5 P-011 FAQ — 답변 단위 위험도
..\..\docs\core\CONTENT_STANDARDS.md:311:- 답변마다 위험도 등급 부여 (`PAGE_TYPES.md` § 3 P-011)
..\..\docs\core\CONTENT_STANDARDS.md:329:- 일반 소식(휴진·이전·인사) Low
..\..\docs\core\CONTENT_STANDARDS.md:338:RiskLevel(축 1)과 룰 severity(축 2)는 **별도 축**이며 본 표는 ArticleType의 **기본 위험도**를 정의한다. 본문 표현은 § 4.1 룰로 별도 평가된다. 위험도 High = 어드민 검수 큐 강제 진입(자동 content-gate 검수 트리거).
..\..\docs\core\CONTENT_STANDARDS.md:342:| `notice` | Low | 휴진·이전·인사 — 사실 안내 |
..\..\docs\core\CONTENT_STANDARDS.md:346:| `effect-result-related` | **High** | 치료 효과·결과 관련 — 검수 큐 강제 진입. 기본 승인 역할 `["medical"]` (§ 7.1.2). 본문에 후기·사례·금액 표현 결합 시 § 4.1·§ 4.3 룰로 인해 `legal` 추가. 사례 묘사 시 "개인차 명시" |
..\..\docs\core\CONTENT_STANDARDS.md:353:- compliance-assistant 모듈이 본문 분석 후 추천 분류 (M2+)
..\..\docs\core\CONTENT_STANDARDS.md:354:- `Article.inlineRiskFlags`로 본문 위험 요소 플래그 (`includes-effect-claim`·`includes-pricing`·`includes-event`·`includes-before-after`·`includes-testimonial`)
..\..\docs\core\CONTENT_STANDARDS.md:366:  contentType: ContentType;           // DATA_MODEL C-10 ComplianceRecord.contentType enum (Core 닫힌 enum 유지)
..\..\docs\core\CONTENT_STANDARDS.md:367:  featureContentType?: FeatureContentTypeId;  // Feature-backed 콘텐츠 시 사용 — § 7.1.1
..\..\docs\core\CONTENT_STANDARDS.md:368:  contentRef: string;                 // 대상 콘텐츠 @id
..\..\docs\core\CONTENT_STANDARDS.md:369:  body: Markdown;
..\..\docs\core\CONTENT_STANDARDS.md:374:    explicitRiskLevel?: RiskLevel;    // DATA_MODEL C-05. 어드민이 명시한 위험도 override (입력값 — 자동 추론 결과를 본 필드에 쓰지 않음)
..\..\docs\core\CONTENT_STANDARDS.md:375:    inferredRiskLevel?: RiskLevel;    // `RISK_LEVELS.md` § 2 자동 추론 결과 (운영 단계에서 compliance-assistant 호출 전 RiskInference로 산출). § 7.1.2 가상 finding 트리거 입력
..\..\docs\core\CONTENT_STANDARDS.md:381:// - Core 콘텐츠: contentType 사용, featureContentType 미지정
..\..\docs\core\CONTENT_STANDARDS.md:382:// - Feature 콘텐츠: contentType="Feature"(C-10 enum cascade 1개 추가) + featureContentType 지정
..\..\docs\core\CONTENT_STANDARDS.md:385:#### 7.1.1 Feature contentType 식별 — `FeatureContentTypeId`
..\..\docs\core\CONTENT_STANDARDS.md:387:DATA_MODEL C-10 `ComplianceRecord.contentType` enum은 닫힌 enum으로 유지하되, Feature-backed 콘텐츠 식별을 위해 enum에 `Feature` 하나만 추가(cascade)하고 실제 구분은 별도 `featureContentType` 필드로 한다.
..\..\docs\core\CONTENT_STANDARDS.md:390:type FeatureContentTypeId = `feature:${FeatureSlug}`;  // kebab-case slug
..\..\docs\core\CONTENT_STANDARDS.md:394:| 영역 | contentType 값 | featureContentType 값 | 예시 |
..\..\docs\core\CONTENT_STANDARDS.md:397:| Feature | `"Feature"` (C-10 cascade 1개) | `feature:<slug>` | `contentType="Feature"` + `featureContentType="feature:self-test"` (P-106) |
..\..\docs\core\CONTENT_STANDARDS.md:401:#### 7.1.1.1 ContentType 예외 — LegalDocument 면제 (LL-CASCADE-03 · LOCATION_LEGAL_PLAN v1.0 § 5)
..\..\docs\core\CONTENT_STANDARDS.md:407:| answer-first AST | 정책 문서는 첫 문장 답 제시 구조가 아니라 조문·항목 구조 | 본문 자체는 법무 검토를 거친 Core 표준 템플릿 (LL-TEMPLATE-04) |
..\..\docs\core\CONTENT_STANDARDS.md:408:| 표현 검사 (recommend/best 등 광고 표현) | 정책 문서에는 광고 의도가 없음 | 동일 — Core 표준 템플릿 본문 |
..\..\docs\core\CONTENT_STANDARDS.md:409:| RiskRule 적용 (`riskRules: RiskRule[]`) | 정책 문서는 위험도 자동 추론 대상이 아님 | `risk_level='Low'` CHECK + 법무 검토 별도 게이트 (RISK_LEVELS § 4.3 의료법 광고 룰 우회) |
..\..\docs\core\CONTENT_STANDARDS.md:410:| RiskInference (`inferredRiskLevel`) | 위와 동일 | DB CHECK `risk_level='Low'` 강제 (LL-SCHEMA-06) |
..\..\docs\core\CONTENT_STANDARDS.md:412:**변수 화이트리스트 검증은 별도 룰**: LegalDocument body 안 `{{...}}` 변수는 Core 측 `renderTemplate` 가 strict whitelist (11개 변수)로 검증하며 (LL-ACTION-12), unknown key 는 build-time test (`packages/core-content/src/templates/__tests__.ts`) 와 server action runtime 양쪽에서 차단한다. compliance-assistant Feature 의 검증 input 으로 LegalDocument 를 보내지 않는 것이 본 면제의 운영적 결정이며, compliance-assistant 의 `check()` 진입 자체를 운영 단계에서 차단한다.
..\..\docs\core\CONTENT_STANDARDS.md:423:  category: "위험도 강제 검수",
..\..\docs\core\CONTENT_STANDARDS.md:497:  category: string;           // § 7.4 RiskRule.category (예: "최상급")
..\..\docs\core\CONTENT_STANDARDS.md:500:  location: { start: number; end: number };  // 본문 내 위치 (오프셋). LLM 제안에서 오프셋 산정 실패 시 { start: 0, end: 0 } (메타 의미)
..\..\docs\core\CONTENT_STANDARDS.md:524:  category: string;            // § 4.1 카테고리
..\..\docs\core\CONTENT_STANDARDS.md:543:  category: string;
..\..\docs\core\CONTENT_STANDARDS.md:576:  | { type: "feature"; featureContentType: FeatureContentTypeId }  // P-106 등 Feature-backed 콘텐츠 전용 룰 (예: featureContentType="feature:self-test")
..\..\docs\core\CONTENT_STANDARDS.md:608:- composite 룰 `category`는 결합 의미(예: "보장 결합 강조")로 명시
..\..\docs\core\CONTENT_STANDARDS.md:624:| **content-gate** | **빌드는 통과(자동 차단 X) + 사람 검수 큐 진입** — 본문 표현 검수 + schema 출력 승인 + 위험 콘텐츠 발행 전 인간 결재의 일반 의미 (`SCHEMA_MAPPING.md` § 7.3 동일 의미) | § 4.1 content-gate 표현, ArticleType=High 케이스, 한의 특유 표현, SCHEMA_MAPPING의 SpecialAnnouncement 등 schema 발행 결재 |
..\..\docs\core\CONTENT_STANDARDS.md:636:| CS-A | § 1.3 본문 글자 수 산정의 정확한 정규식 — Markdown 코드 블록·링크 URL·이미지 마크업·HTML 태그·공백·문장부호 제거 패턴 + § 2.1.1 answer-first AST 파서 라이브러리 선택 | 자체 룰 checker 구현 시 |
..\..\docs\core\CONTENT_STANDARDS.md:645:| ~~CS-C~~ | Feature-backed 콘텐츠 contentType cascade | v0.5 — DATA_MODEL C-10 enum에 `Feature` 토큰 1개 cascade 추가 + `featureContentType: feature:<slug>` 별도 필드로 세부 식별 (§ 7.1.1). Core enum의 기존 콘텐츠 토큰은 변경 없이 유지 |
..\..\docs\core\CONTENT_STANDARDS.md:655:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1) § 0 SoT 참조 § 5→§ 4 정정, (2) § 1.3 본문 길이 산정 기준 "1,000자(공백 제외)" + Markdown 정규화 알고리즘 명시 → CS-A 미결정 신설, (3) § 3.1 Q&A 렌더링(HTML `<dl>`)과 JSON-LD FAQPage schema 책임 분리, (4) § 3.1 Q&A 룰 fail/content-gate 분리 적용 (§ 4.1 직접 참조), (5)·(6) § 4.1 보장 표현 통합 fail + 수치/기간 단정(보장어 미포함) content-gate 분리, 유인성 표현(시간·수량 압박)과 할인·이벤트 사실 안내(법무 판정 영역) 분리, (7) § 4.2 "100% 효과" 대체 표현 — 효과 진술을 인용·통계 출처 동반으로만 한정 (치료경험담 위험 제거), (8) § 4.3·§ 5.6 환자 후기 — 의료법 제56조 직접 인용, 사전심의(제57조) 단정 표현 제거, 매체·방식별 법무 판정 명시, (9) § 4.3·§ 5.6 전후사진 — ReviewPolicy.beforeAfterPhotoAllowed 의미를 "법무 승인 후 예외적 허용 플래그"로 명확화, 승인자·일자 필수 기록 (CS-B 신설), (10) § 7.1 ContentType을 DATA_MODEL C-10 ComplianceRecord.contentType과 동일 enum 명시, (11) § 7.2 ComplianceCheckResult 인터페이스 확장 — buildBlocked/gateRequired/publishable/requiredApproverRole 분리, (12) § 7.4 RiskRule 스키마 신설 (id/category/pattern/patternType/severity/scope/requiredApproverRole/suggestion/rationale/exceptions/version) + ContentScope 5종 + CS-01 해소 |
..\..\docs\core\CONTENT_STANDARDS.md:658:| 2026-05-14 | **v1.1** | **RISK_LEVELS v1.0 cascade**: (1) § 7.1 ComplianceCheckInput.metadata에 `inferredRiskLevel` 필드 신설 — `RISK_LEVELS § 2` 자동 추론 결과 입력. `explicitRiskLevel`은 어드민 명시 override 입력만, 자동 추론과 의미 분리, (2) § 7.1.2 가상 finding 트리거 조건 명시 — `inferredRiskLevel===High` ∨ `explicitRiskLevel===High`. `triggeredBy: "inferred"|"explicit"` 메타로 출처 추적, (3) § 7.1.2 ArticleType override 목록을 High ArticleType 전용으로 정리 — Medium ArticleType(`general-medical-info`·`condition-explainer`·`treatment-explainer`)은 가상 finding 미발생. Medium 등급 기본 요구는 RISK_LEVELS § 6 매트릭스로 처리. (4) § 9 CS-02 미결정 해소 — content-gate 통과 기준은 RISK_LEVELS § 4·§ 4.5가 SoT |
..\..\docs\core\CONTENT_STANDARDS.md:659:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 잔재 정리 마감 (7개 지적 전건 수용)**: (1) **DATA_MODEL C-10 cascade 누락 정정** — `contentType` enum에 `Feature` 토큰 추가. `featureContentType` 필드도 함께 추가 (`feature:<slug>` 정규식 명시), (2) ApproverRole 중복 정의 제거 — ComplianceCheckResult 코드 블록의 중복 type 삭제. 단일 SoT는 § 7.1.3, (3) SimpleRiskRule `requiredApproverRole` 단수 잔재 → `requiredApproverRoles?: ApproverRole[]` 배열로 통일 (§ 7.2와 정합), (4) § 6 effect-result-related 표 — 기본 승인 역할 `["medical"]` 명시. 후기·사례·금액 결합 시 `legal` 추가 (§ 7.1.2 override와 정합), (5) ContentScope union에 `feature` 변형 추가 — Feature-backed 콘텐츠 전용 RiskRule 적용 가능, (6) § 0 한 페이지 요약 content-gate 정의 — § 8·SCHEMA_MAPPING § 7.3과 동일 통일 정의로 갱신 (schema 출력 승인 게이트 포함), (7) § 9.1 CS-C 해소 설명 정정 — DATA_MODEL C-10 enum `Feature` 토큰 cascade 정확히 기술. **다음 단계**: compliance/RISK_LEVELS.md 후속 + 자체 룰 checker 실제 구현 (CS-A·CS-D 영역) + admin 검수 워크플로 명세 + 그 발견을 본 문서에 되먹이기 |
..\..\docs\core\CONTENT_STANDARDS.md:660:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (12개 지적 전건 수용)**: (A) § 7.1 `featureContentType` 별도 필드 도입 — C-10 enum은 `Feature` 토큰 1개만 cascade 추가, 실제 구분은 namespace 필드로. (B) § 7.1.1 Feature 예시를 P-106 self-test로 정정 — P-105 ReservationPage는 Core C-20임을 명시. slug kebab-case 정규식(`^[a-z][a-z0-9-]*[a-z0-9]$`) 확정. (C) § 7.2 `findingsBySeverity` 키를 severity enum과 동일(`"content-gate"`)로 통일. (D) ApproverRole enum에 `client` 포함. (E) `requiredApproverRole` → `requiredApproverRoles: ApproverRole[]` 배열로. `review-case`는 `["medical", "legal"]` 기본값. 어드민 워크플로는 AND 조건으로 발행 게이트. (F) CompositeRiskRule `logic` enum 정밀화 — `AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR` 3종. (G) § 7.4.3 composite severity 4종 모두 허용으로 운영 규칙 정정. (H) ContentScope에 `featureContentType` 검증 흐름 (Feature contentType 입력 시) — 추후 검증기 구현. (9) § 3.5 인용 면제는 § 3.5 content-gate에만 적용 — § 4.1 fail 룰은 절대 완화 안 됨 명시. (10) § 4.3 가격·할인·이벤트 — P-102·P-104·P-010(`articleType=event-price`) cross-reference 명시. (11) **DATA_MODEL cascade — C-04 Article.body 권장 길이 "최소 300단어" → "최소 1,000자(공백 제외). CONTENT_STANDARDS § 1.3 SoT"** 정정. (12) § 8 content-gate 정의를 SCHEMA_MAPPING § 7.3과 통일 — schema 출력 승인 게이트 포함 |
..\..\docs\core\CONTENT_STANDARDS.md:661:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
..\..\docs\compliance\RISK_LEVELS.md:7:> **목적**: RiskLevel(Low/Medium/High) 자동 추론 알고리즘, RiskRule 데이터 파일 위치·포맷·버전 관리, ApproverRole(medical/legal/operator/client) 통과 기준, inlineRiskFlags 자동 추출, 위험도 자동 동작 매트릭스를 단독 구현 가능한 명세로 정의.
..\..\docs\compliance\RISK_LEVELS.md:20:- **본 문서가 단일 SoT**: (1) RiskLevel 자동 추론 알고리즘, (2) RiskRule 데이터 파일 포맷, (3) ApproverRole 통과 기준(content-gate 발행 조건), (4) inlineRiskFlags 자동 추출 규칙
..\..\docs\compliance\RISK_LEVELS.md:21:- **RiskLevel 3종**: `Low` / `Medium` / `High` — DATA_MODEL C-05 enum 그대로 사용
..\..\docs\compliance\RISK_LEVELS.md:22:- **자동 추론 = MAX 결합**: 페이지 타입 기본 + ArticleType 기본 + 슬롯 격상 + inlineRiskFlags 격상 + explicitRiskLevel override의 **최대값**으로 최종 등급 결정
..\..\docs\compliance\RISK_LEVELS.md:36:| 자동 추론 알고리즘 변경 (강화) | **MAJOR** | 기존 콘텐츠의 위험도 격상 가능 — 마이그레이션 가이드 필수 |
..\..\docs\compliance\RISK_LEVELS.md:37:| 자동 추론 완화 | MINOR | 기존 콘텐츠 영향 없음 |
..\..\docs\compliance\RISK_LEVELS.md:52:## 2. RiskLevel — 정의·자동 추론
..\..\docs\compliance\RISK_LEVELS.md:56:`Low | Medium | High` — DATA_MODEL C-05 정의. 본 문서는 등급간 비교를 위해 정수 사상을 사용:
..\..\docs\compliance\RISK_LEVELS.md:59:const RISK_ORDER = { Low: 0, Medium: 1, High: 2 } as const;
..\..\docs\compliance\RISK_LEVELS.md:63:### 2.2 자동 추론 입력
..\..\docs\compliance\RISK_LEVELS.md:69:  inlineRiskFlags: InlineRiskFlag[];  // 본문에서 자동 추출 (§ 5)
..\..\docs\compliance\RISK_LEVELS.md:71:  explicitRiskLevel?: RiskLevel;      // CONTENT_STANDARDS § 7.1 ComplianceCheckInput.metadata.explicitRiskLevel — 어드민이 본 입력 슬롯에 명시한 override. 자동 추론 결과(ComplianceRecord.pageRiskLevel 출력)를 다시 본 입력으로 받지 않음 (순환 금지). 저장 SoT는 어드민의 입력 메타데이터 슬롯이며, 자동 추론 출력은 별도 (§ 6)
..\..\docs\compliance\RISK_LEVELS.md:81:### 2.3 자동 추론 알고리즘
..\..\docs\compliance\RISK_LEVELS.md:115:| `includes-effect-claim` | **High** | 본문에 § 4.1 fail/content-gate 효과 단정 표현 검출 |
..\..\docs\compliance\RISK_LEVELS.md:116:| `includes-pricing` | **High** | 본문에 가격 정보(통화·숫자+원·달러 등) 검출 — 의료광고법 비급여 명시 의무 |
..\..\docs\compliance\RISK_LEVELS.md:117:| `includes-event` | **High** | 본문에 할인·이벤트·기간 한정 어휘 검출 |
..\..\docs\compliance\RISK_LEVELS.md:118:| `includes-before-after` | **High** | 본문에 전후사진 또는 "전후"·"비포어 애프터" 어휘 검출 |
..\..\docs\compliance\RISK_LEVELS.md:119:| `includes-testimonial` | **High** | 본문에 환자 후기 인용·치료경험담 검출 |
..\..\docs\compliance\RISK_LEVELS.md:121:> 단일 flag 발생만으로 High 격상. 페이지 타입 기본이 Low여도 본문이 위 항목 1개라도 포함하면 페이지 전체 High → 검수 큐 강제 진입(`CONTENT_STANDARDS.md` § 7.1.2).
..\..\docs\compliance\RISK_LEVELS.md:127:| P-001 Home, P-002 About, P-003 Doctors List, P-004 Doctor Profile, P-005 Treatments List, P-007 Conditions List, P-009 Articles List, P-011 FAQ, P-012 Contact, P-013 Legal, P-014 Location, P-105 Reservation | Low |
..\..\docs\compliance\RISK_LEVELS.md:129:| P-010 Article Detail | ArticleType별 (§ 6 CONTENT_STANDARDS — Low~High) |
..\..\docs\compliance\RISK_LEVELS.md:166:    category: "최상급"
..\..\docs\compliance\RISK_LEVELS.md:178:    category: "보장 결합 강조"
..\..\docs\compliance\RISK_LEVELS.md:205:| `category` 비어 있음 | **fail** |
..\..\docs\compliance\RISK_LEVELS.md:232:| `scope[].featureContentType` 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$` 위반 | **fail** |
..\..\docs\compliance\RISK_LEVELS.md:233:| `scope[].featureContentType` 존재 + `scope[].type != "feature"` | **fail** |
..\..\docs\compliance\RISK_LEVELS.md:234:| `scope[].type = "feature"` + `featureContentType` 누락 | **fail** |
..\..\docs\compliance\RISK_LEVELS.md:353:   - 스칼라 필드(`severity`·`category`·`pattern`·`logic` 등) — patch 값으로 교체
..\..\docs\compliance\RISK_LEVELS.md:378:      categories: ["전문성 단정 (단독 어휘)"]   # RiskRule.category 매칭 (1개 이상)
..\..\docs\compliance\RISK_LEVELS.md:415:- 콘텐츠 본문이 RiskRule 매칭 텍스트(`category` ∈ {`효과 단정`·`전문성 단정`·`보장 표현`·`수치·기간 단정`·`체질·맞춤 과대 표현`}) 영역에서 변경
..\..\docs\compliance\RISK_LEVELS.md:439:- 콘텐츠 본문에서 § 4.1 카테고리 추가 매칭 발생
..\..\docs\compliance\RISK_LEVELS.md:456:**만료**: 별도 만료 없음. 운영자 검수는 본문 변경 시 자동 재진입.
..\..\docs\compliance\RISK_LEVELS.md:477:- `physicianApprover` — DATA_MODEL C-10에서 Medium/High required. 자동 추론 등급이 Medium/High이면 기본 요구
..\..\docs\compliance\RISK_LEVELS.md:490:| 기타 High 등급 (자동 추론) | `["medical"]` |
..\..\docs\compliance\RISK_LEVELS.md:496:콘텐츠 본문에서 자동 추출하는 본문 위험 신호.
..\..\docs\compliance\RISK_LEVELS.md:500:- 그 외 모든 콘텐츠 (ClinicProfile·DoctorProfile·TreatmentPage·MedicalConditionPage·FAQ·ReviewPolicy 등) — `ComplianceRecord(C-10).inlineRiskFlags`에만 보관. Git 원본 데이터에는 inlineRiskFlags 필드 없음
..\..\docs\compliance\RISK_LEVELS.md:503:### 5.1 추출 알고리즘 (RiskRule category 기반)
..\..\docs\compliance\RISK_LEVELS.md:505:각 flag는 RiskRule 매칭 결과의 `category` 집합 기준으로 추출 — 의미적 risk(semantic risk)가 아닌 카테고리 문자열 매칭으로 구현자가 결정 가능.
..\..\docs\compliance\RISK_LEVELS.md:509:| `includes-effect-claim` | RiskRule 매칭 결과 중 `category` ∈ {`"효과 단정"`, `"전문성 단정 (단독 어휘)"`, `"전문성 단정 (효과·결과·보장 결합)"`, `"보장 표현"`, `"수치·기간 단정 (보장어 없음)"`, `"수치·기간 보장"`, `"체질·맞춤 과대 표현"`} 1개 이상 |
..\..\docs\compliance\RISK_LEVELS.md:510:| `includes-pricing` | 본문 정규식 매칭 — (`[₩$￥]\s*\d`) 또는 (`\d{2,}\s*(원|만원|달러)`) 또는 어휘 (`가격`·`비용`·`수가`·`비급여`·`총 비용`) |
..\..\docs\compliance\RISK_LEVELS.md:511:| `includes-event` | 본문 어휘 매칭 — (`이벤트`·`할인`·`세일`·`프로모션`·`기간 한정`·`선착순`·`특가`·`프로모`) |
..\..\docs\compliance\RISK_LEVELS.md:512:| `includes-before-after` | (a) 본문 어휘 매칭 (`전후`·`비포어 애프터`·`before\s*/?\s*after`·`B/A`), 또는 (b) `ReviewPolicy.beforeAfterPhotoAllowed=true` + 후기 콘텐츠에 미디어 첨부 |
..\..\docs\compliance\RISK_LEVELS.md:517:위 표의 모든 `category` 값은 `core/CONTENT_STANDARDS.md` § 4.1 표의 카테고리 칸과 일치해야 한다. 신규 카테고리 추가 시 본 § 5.1 매트릭스 동시 cascade.
..\..\docs\compliance\RISK_LEVELS.md:525:| `LegalDocument` (C-16) `documentType ∈ {privacy, terms, non-covered, refund, complaint, cookie}` + `body` 필드 | `includes-pricing` | 비급여 안내·환불 정책·약관·민원 안내에 가격 어휘 합법적 등장 |
..\..\docs\compliance\RISK_LEVELS.md:526:| `LegalDocument` (C-16) `documentType ∈ {refund, terms}` + `body` 필드 | `includes-event` | 환불 정책·약관에 "이벤트" 어휘가 약관 의미로 등장 |
..\..\docs\compliance\RISK_LEVELS.md:530:| `Article` (C-04) `articleType=notice` + `body` 필드 | `includes-event` | 일반 소식·휴진 안내 카테고리 |
..\..\docs\compliance\RISK_LEVELS.md:534:- 정책 페이지의 본문에 실제 프로모션성 문구가 섞이는 경우는 § 4.1 룰 매칭(category 기반)으로 별도 검출. 본 § 5.1.2는 inlineRiskFlag → RiskLevel 격상만 완화
..\..\docs\compliance\RISK_LEVELS.md:547:- 어드민 검수 UI는 `evidence`를 사용해 본문 위치를 하이라이트
..\..\docs\compliance\RISK_LEVELS.md:562:| Low | (특별 동작 없음) |
..\..\docs\compliance\RISK_LEVELS.md:566:- 자동 추론된 RiskLevel은 ComplianceRecord(C-10) `pageRiskLevel`에 기록
..\..\docs\compliance\RISK_LEVELS.md:567:- High 자동 추론 + 인간 검수 미완료 = 발행 차단 (어드민 워크플로 게이트)
..\..\docs\compliance\RISK_LEVELS.md:573:본 문서 § 2.3의 RiskInferenceInput에서 자동 추론된 최종 등급이 High이면 compliance-assistant가 High 가상 finding을 주입한다. 자동 추론은 다음 모든 입력으로부터 High가 될 수 있다:
..\..\docs\compliance\RISK_LEVELS.md:580:**흐름**: RiskInference(자동 추론) → 결과 등급을 `ComplianceCheckInput.metadata.inferredRiskLevel`에 전달 (CONTENT_STANDARDS § 7.1 입력 슬롯). 어드민 명시 override는 `explicitRiskLevel`에 별도 전달. compliance-assistant는 둘 중 하나라도 High이면 가상 finding 주입. 트리거 출처(`inferred` 또는 `explicit`)는 finding 메타에 기록 — 감사·운영 추적성 보존. `explicitRiskLevel`에 자동 추론 결과를 다시 쓰지 않음 (입력 슬롯 의미 보호).
..\..\docs\compliance\RISK_LEVELS.md:587:  category: "위험도 강제 검수",
..\..\docs\compliance\RISK_LEVELS.md:610:- **등급 격하 일괄 금지** — `explicitRiskLevel`은 MAX 결합으로만 동작 (격상만 허용). 운영자도 자동 추론보다 낮은 등급으로 격하 불가. ArticleType High 격하 금지 (DATA_MODEL C-04 정합)
..\..\docs\compliance\RISK_LEVELS.md:651:1. `MEDICAL_AD_COMPLIANCE_COMMON.md` 본문 갱신
..\..\docs\compliance\RISK_LEVELS.md:685:| **content-gate** | (본 문서는 메타 정의 영역이라 content-gate 직접 적용 없음. 실제 본문 검수 룰은 RiskRule이 발산) |
..\..\docs\compliance\RISK_LEVELS.md:712:| 2026-05-14 | v0.1 | 최초 작성 — RiskLevel 자동 추론(MAX 결합), RiskRule 데이터 파일(YAML+JSON Schema·로드 순서·버전), ApproverRole 통과 기준 4종(medical·legal·operator·client·multi-role AND), inlineRiskFlags 자동 추출 5종, 위험도 자동 동작 매트릭스, 운영 거버넌스(의료법 개정 대응·룰 충돌·변경 워크플로), 빌드 검증 룰 레벨 |
..\..\docs\compliance\RISK_LEVELS.md:715:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) **CONTENT_STANDARDS § 7.1 cascade — `inferredRiskLevel` 입력 필드 신설**. explicitRiskLevel은 어드민 명시 override만, 자동 추론 결과는 별도 필드. § 7.1.2 트리거 조건도 `inferredRiskLevel === High` ∨ `explicitRiskLevel === High` 명시 + `triggeredBy` 메타로 출처 기록, (2) CONTENT_STANDARDS § 7.1.2 ArticleType override 목록을 High 전용으로 정리 — Medium ArticleType은 본 가상 finding 미발생 (RISK_LEVELS § 6 매트릭스로 처리). RISK_LEVELS § 6.2 표와 정합, (3) § 5.1.2 LocationProfile false-positive 완화 — 존재하지 않는 `relocationNotice`·`businessHoursNotice` 제거. DATA_MODEL C-21 실제 필드(`branchDescription`·`transportInfo`·`parkingInfo`)로 교체, (4) preset 파일명 규약 통일 — `rules.preset-<presetSlug>.yaml`. `<presetSlug>`은 `presets/<presetSlug>/` 디렉토리명과 동일 kebab-case. RL-01 해소 |
..\..\docs\compliance\RISK_LEVELS.md:716:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (6개 지적 전건 수용)**: (1) **CONTENT_STANDARDS CS-02 해소 cascade** — CS-02를 § 9.1 해소된 미결정으로 이동. RISK_LEVELS § 4가 SoT임을 명시, (2) § 6.1 High 가상 finding 트리거 범위 명시 — RiskInference 자동 추론 단계(pageType·slot·inlineRiskFlags 포함)와 ComplianceCheckInput 인터페이스 단계의 흐름 연결. 본 문서 = 운영 SoT, CONTENT_STANDARDS § 7.1.2 = 인터페이스 SoT, (3) § 3.3 context-exceptions.yaml 검증 완전화 — patternType·version·createdAt·updatedAt·rationale·id kebab-case 6종 추가, (4) § 3.3 scope 검증 강화 — featureContentType은 type="feature"와만 결합. 각 type별 필수 필드 검증 추가, (5) § 3.4.1 meta.yaml loadOrder 확장 — rules/contextExceptions/tracking 카테고리별 명시. context-exceptions·medical-law-tracking 포함, (6) § 5.1.2 LegalDocument `other` documentType의 의도적 제외 명시 — 보수적으로 일반 격상 정책 적용 |
..\..\docs\compliance\RISK_LEVELS.md:718:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 2.2 `explicitRiskLevel` 입력 출처 명확화 — 어드민 메타데이터 입력. 자동 추론 결과 순환 입력 금지, (2) § 0 발행 조건 = AND 3종(operator + 등급 기본 + 룰 추가) 완전 표기, (3) § 6.2 ArticleType override가 "룰 추가 요구"임을 명시 — 총 발행 요구 = 합집합 표 추가, (4) § 4.5 LegalDocument 기본 역할 `["legal"]`만 — client는 운영 정책 시만, (5) § 3.3 scope 검증에 `fieldPath`·`blockType` 정합 검증 추가, (6) § 3.4.2 overrides 중복 정책 통일 — 최대 1개 강제, 중복 시 fail (last-wins 표현 제거), (7) § 4.2 법무 의견서 만료 자동 판정을 RL-07 해소 후로 명시. v1.0에서는 수동 갱신 큐로 대체, (8) § 5 inlineRiskFlags 저장 위치 분리 — Article은 양쪽, 비 Article은 ComplianceRecord만, (9) § 5.1.2 컨텍스트별 false-positive 완화를 페이지 단위 → LegalDocument.documentType + 필드 단위로 정밀화. 정책 페이지 false-negative 위험 회피, (10) § 3.1 디렉토리에 `medical-law-tracking.yaml` 추가 + § 3.3에 해당 파일 검증 7종 추가 |
..\..\docs\compliance\RISK_LEVELS.md:719:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (14개 지적 전건 수용)**: (1) § 2.5 P-105 Reservation 기본 등급 PAGE_TYPES SoT Low로 정정, (2) § 6 explicitRiskLevel 격하 일괄 금지 명시 — DATA_MODEL C-04 ArticleType High 격하 금지와 정합, (3) **DATA_MODEL C-10 cascade — `StaleFlags` 하위 타입 + `priorReviewPassed` 필드 추가**. § 4 만료 정책에서 `staleFlags.medical/legal/operator/client` 일반화 사용, (4) § 4.5 multi-role 분리 — operator 전 콘텐츠 공통 필수(C-10 required) + physicianApprover Medium/High 기본 요구 + `requiredApproverRoles[]` 추가 요구를 모두 AND, (5) § 5.1 includes-effect-claim 카테고리 7종으로 확장 (수치·기간 단정·체질 맞춤 포함), (6) § 5.1 모든 flag를 RiskRule category 기반으로 정밀화 + § 5.1.1 카테고리 SoT cascade 규칙, (7) § 3.3 JSON Schema 검증 항목 완전화 — Simple/Composite 구분·operands·logic·window·ISO date·contextException kind·roles enum·overrides·meta.yaml 검증, (8) § 3.4.2 overrides 머지 규칙 + § 3.4.1 meta.yaml 구조 명세 (RL-02 해소), (9) § 3.3.1 severity별 requiredApproverRoles 처리 정책 — content-gate만 필수 명시, (10) § 4.2 legal 통과 조건에 `priorReviewRequired`·`priorReviewSubmissionId`·`priorReviewPassed` 연계 + 발행 차단 조건 명시, (11) § 7.1 의료법 개정 추적 데이터 모델 신설 — revisionId·시행일·sourceUrl·checkedAt/By·affectedRuleIds·staleScope, (12) § 6.1 High 가상 finding 본 문서에 동기화 SoT + § 6.2 ArticleType override 표, (13) § 5.1.2 페이지 컨텍스트별 false-positive 완화 — P-013·P-014·P-104 notice 제외 규칙. inlineRiskFlags 출력은 보존(감사용), (14) § 4.1·§ 4.2 만료 정책 확장 — 가격·ReviewPolicy·전후사진 미디어·법무 의견서 만료·근거 링크 만료 이벤트 추가 |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:3:> **상태**: **v1.0 (acceptance)** — Codex 자동 비평 cycle 5 회 closeableAfterPatch=true 확정. 누계 31 findings 전건 수용 · 수렴 추세 **21 → 7 → 2 → 1 → 0**. 5 PSR-CASCADE 모두 PASS (01a docs · 02 SCHEMA_MAPPING § 1.2 · 03 M0_BUILD_EXPORT_PLAN § 2.1 · 04 manifest D0011 · 05 pgbouncer userlist). 01b (apps/web 디렉토리 이동 + redirect/revalidate 변경) 는 별 **PUBLIC_SITE_RENDER code v1.0** cycle 분리 (LOCATION_LEGAL plan/code 분리 패턴 정합). ADMIN_UI_SKELETON code v1.0 + LOCATION_LEGAL code v1.0 acceptance 직후 진입하는 첫 공개 사이트 plan.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:5:> **acceptance commit 구성 (LL-33 패턴 정합)**: 본 commit 에 다음 cascade 동시 포함 — (1) PUBLIC_SITE_RENDER_PLAN.md v1.0 (본 문서) (2) PSR-CASCADE-01a docs/admin/ARCHITECTURE.md § 3.12 patch (3) PSR-CASCADE-02 docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based 표 + entity continuity 전환 룰 (4) PSR-CASCADE-03 docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 SSR 재사용 표 (5) PSR-CASCADE-04 packages/migrations-runner/src/manifest.ts D0011 entry (6) PSR-CASCADE-05 apps/spike-a/pgbouncer/userlist.txt 안 `app_public_reader` 추가. PSR-CASCADE-01b 코드 cascade 는 PUBLIC_SITE_RENDER code v1.0 cycle 의 acceptance commit 에서 별도 진행.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:16:- `docs/core/SCHEMA_MAPPING.md` — 페이지별 graph 구성 (§ 2.5 공통 entity 출력 정책 + § 3 페이지 그래프 + § 1.2 `@id` 네이밍 규약).
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:17:- `docs/core/SEARCH_STANDARDIZATION.md` — § 2 메타 태그 표준 (theme-color · og:type 매핑) · § 3 robots.txt (aiCrawlerPolicy + 4계열 user-agent + disallowTraining starter) · § 4.3 sitemap changefreq/priority · § 5 canonical resolve.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:22:- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 — ClinicProfile 3계약 + LegalDocument 5종 + primaryCtas + businessHours · LegalDocument DB CHECK `status='draft' AND risk_level='Low' AND published_at IS NULL` (LL-SCHEMA-03·06).
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:26:  - `apps/web/src/app/layout.tsx` (root layout · `<html><body>` SoT — site layout 은 fragment 만)
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:28:  - `packages/core-content/src/schema.ts` v0.3 (Drizzle SoT — 실 column 명: `title`/`body_markdown`)
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:46:| **10페이지 minimal** (cycle1 PSR-01 정정) | P-001 `/` · P-002 `/about` · P-003 `/doctors` · P-004 `/doctors/[slug]` · P-005 `/treatments` · P-006 `/treatments/[slug]` · P-010 `/insights/[category]/[slug]` (1샘플) · P-012 `/contact` · P-013 `/legal/[type]` (5종) · P-014 `/locations/[slug]` (main 1건) |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:47:| **P-009 Articles List · P-011 FAQ · P-007/008 Conditions** | M0 미합류 — 별 plan (FAQ 는 EAT_CONTENT plan v0.1) |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:48:| `app_public_reader` PostgreSQL role + per-table SELECT policy (cycle1 PSR-05·15 정정) | 신규 D0011 migration 안 instance lookup policy + 6 content table policy 명시 |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:53:| sitemap.xml · robots.txt (cycle1 PSR-04·09 정정) | per-instance · SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` required + § 4.3 changefreq/priority SoT 정합 |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:58:| env / pgbouncer / role membership cascade (cycle1 PSR-21 정정) | `WEB_PUBLIC_DATABASE_URL` env · `.env.example` · pgbouncer userlist · `app_public_reader NOLOGIN MEMBERSHIP` 등 acceptance checklist |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:64:| static export to Git (build-time) | M0 v1.0 본 구현 — apps/worker + Git client | PSR-DEFER-01 |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:65:| 도메인 매핑 (subdomain `<slug>.glitzy.co` 또는 custom domain) | M0 v1.0 본 구현 | PSR-DEFER-02 |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:66:| dark mode UI toggle | M1 Phase Alpha — CSS vars 는 v0.1 부터 두 테마 출력 (DESIGN_TOKENS § 3.3) · PSR-14 정합 | PSR-DEFER-03 |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:67:| CDN cache 정책 (Cloudflare/Vercel ISR fine-tune) | M0 v1.0 본 구현 | PSR-DEFER-04 |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:68:| 검색 콘솔 sitemap submission 자동화 | M1 Phase Alpha | PSR-DEFER-05 |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:69:| 다국어 (`/<lang>/<instanceSlug>/...`) | M3 다국어 cascade | PSR-DEFER-06 |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:70:| 사용자 댓글·리뷰·공유 (인터랙티브 기능) | 별 plan (Inquiry · Review) | PSR-DEFER-07 |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:71:| draft preview token (어드민 세션 외 비공개 미리보기) | M1 Phase Alpha | PSR-DEFER-08 |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:72:| 페이지별 OG 이미지 동적 자동 생성 | M1 Phase Alpha | PSR-DEFER-09 |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:73:| AI 크롤러 인증 (Cloudflare AI Audit · access log per-crawler) | M0 v1.0 본 구현 (provider gate) | PSR-DEFER-10 |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:74:| P-009 Articles List · P-011 FAQ · P-007/008 Conditions | 별 plan (EAT_CONTENT plan v0.1 안 FAQ · 별도 plan Conditions) | PSR-DEFER-11 |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:75:| 선택 7종 (P-101~P-107) | 별 plan · Add-on Feature | PSR-DEFER-12 |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:76:| LegalDocument 공개 노출 (status=published) | LL-DEFER-01 (compliance-assistant + ComplianceRecord legalCounsel 합류) | PSR-DEFER-13 (LL-DEFER-01 alias) |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:77:| Google Rich Results Test / schema.org validator 자동 게이트 | manual QA marker · LOCAL_PASS 는 자체 rule checker (cycle1 PSR-17) | PSR-DEFER-14 |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:78:| Article URL `/insights/[category]/[slug]` 의 category 운영 추가 (현재 C-04 article.category 없음) | EAT_CONTENT plan v0.1 또는 Article schema cascade · v0.1 은 단일 fallback category `"general"` | PSR-DEFER-15 |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:92:│     ├─ layout.tsx                      -- fragment only (NO <html>/<body> · cycle1 PSR-03)
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:102:│     │  └─ [category]/
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:103:│     │     └─ [slug]/page.tsx           -- P-010 Article Detail (1샘플 · category=general v0.1)
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:127:- (PSR-ROUTE-03 · cycle1 PSR-03 patch) site layout 은 fragment 만 — `<html>`/`<body>` 중복 출력 금지. root layout 의 `<html lang="ko-KR">` SoT 유지. site layout 안 클래스/테마 처리는 `<body>` 의 추가 className 으로 root layout 이 segment-aware 분기 — 또는 별 wrapper `<div data-theme="light" data-site>` 구조 채택.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:128:- (PSR-ROUTE-04) path-based routing 결정 — v0.1 단계 `/<instanceSlug>/<page>`. 도메인 매핑 합류 시 (PSR-DEFER-02) middleware 가 host header → instanceSlug rewrite.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:132:### 3.1 D0011 — `app_public_reader` role + per-table policy (PSR-DATA-01) — cycle1 PSR-05·15 정정
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:135:-- packages/db/migrations/D0011_public_reader.sql (신규)
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:139:-- v0.1 은 LOGIN role 한 개 (`app_public_reader`) 로 단순화 — production 분리 marker.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:140:CREATE ROLE app_public_reader LOGIN;
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:142:GRANT USAGE ON SCHEMA public TO app_public_reader;
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:144:-- cycle1 PSR-05 patch: instance slug resolve 전용 policy.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:146:-- 따라서 instance 테이블 에는 별도 policy (active=true 만 노출).
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:147:GRANT SELECT ON instance TO app_public_reader;
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:149:CREATE POLICY public_reader_instance_select
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:152:  TO app_public_reader
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:155:-- cycle1 PSR-15 patch: 6 content table 별 per-table policy 명시.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:156:-- 모든 policy 는 USING `instance_id = current_setting('app.current_instance_id')` 정합.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:161:  TO app_public_reader;
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:163:CREATE POLICY public_reader_clinic_profile_select
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:164:  ON clinic_profile FOR SELECT TO app_public_reader
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:167:CREATE POLICY public_reader_location_profile_select
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:168:  ON location_profile FOR SELECT TO app_public_reader
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:171:CREATE POLICY public_reader_doctor_profile_select
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:172:  ON doctor_profile FOR SELECT TO app_public_reader
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:178:CREATE POLICY public_reader_treatment_page_select
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:179:  ON treatment_page FOR SELECT TO app_public_reader
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:187:CREATE POLICY public_reader_article_select
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:188:  ON article FOR SELECT TO app_public_reader
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:199:-- 본 policy 는 application 단 status='published' 만 통과 — DB CHECK 와 정합.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:200:CREATE POLICY public_reader_legal_document_select
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:201:  ON legal_document FOR SELECT TO app_public_reader
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:209:- (PSR-DATA-02 · cycle1 PSR-05) `app_public_reader` LOGIN — v0.1 단순화. production 단 NOLOGIN + MEMBERSHIP 분리 marker (PSR-DEFER-16 신설).
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:215:- (PSR-DATA-04) `app_public_reader` 는 audit_event INSERT 권한 없음 — 공개 페이지 access log 는 별도 (CDN / Vercel analytics · PSR-DEFER-10).
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:219:  - Spike A pgbouncer userlist 에 `app_public_reader` 추가 (PSR-CASCADE-05)
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:225:DB-level RLS policy 가 row-level filter 를 강제 (§ 3.1). application 단 SELECT 는 추가 WHERE 없음 — RLS 가 자동 처리.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:240:- 어드민 세션 보유 시 (별 별 helper, app_tenant_user) `?preview=true` query 로 draft 미리보기 가능 — v0.1 SCOPE 외, PSR-DEFER-08 합류.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:241:- LegalDocument 공개 노출은 **LL-DEFER-01 (compliance-assistant + ComplianceRecord legalCounsel 합류) 시점** 까지 차단. PSR-DEFER-13 = LL-DEFER-01 alias.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:256:- `apps/web/src/app/layout.tsx` (root · 본 plan acceptance commit 안 patch) — `<html lang="ko-KR" data-theme="light">` + `<body className="bg-canvas text-fg-default">`. **모든 segment 가 root layout 의 html/body 공유**.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:257:- **cycle2 PSR-28 patch (acceptance precondition · plan acceptance commit 동반)**: 현 root layout 의 `<body className="bg-slate-50 text-slate-900">` 임시 토큰 → DESIGN_TOKENS v1.0 semantic alias (`bg-canvas` · `text-fg-default`) 로 전환. § 8 작업 #14 Tailwind v0.2 patch + globals.css 안 CSS vars 적용 + root layout className 변경 모두 acceptance 직전 동시 적용.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:276:- (PSR-COMP-02 · cycle1 PSR-03) site layout 의 `<html>`/`<body>` 미반환. root layout 이 SoT. `<html lang="ko-KR">` 는 root layout 안.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:277:- (PSR-COMP-03 · cycle2 PSR-26 정정) Header: ClinicProfile.name + 네비 (Home · About · Doctors · Treatments · Contact · Locations · CTA primaryCtas[0]). Footer: 주소·전화·진료시간. **법적 페이지 5종 링크는 v0.1 단계 숨김** — LegalDocument 공개 노출이 PSR-DEFER-13 (= LL-DEFER-01 alias) 합류 시점까지 404 이므로 broken link 회피. 합류 후 Footer 에 동적 추가 (LegalDocument 가 published 상태 row 가 존재할 때만 렌더).
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:288:| ClinicProfile | `long_description` | C-01 `longDescription` | About 본문 |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:299:| DoctorProfile | `bio` | C-02 `bio` | Doctor body |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:303:| TreatmentPage | `body_markdown` | C-03 `bodyMarkdown` (contract `body`) | ArticleBody render |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:308:| Article | `body_markdown` | C-04 `bodyMarkdown` (contract `body`) | ArticleBody render |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:313:| LegalDocument | `body` | C-16 `body` (Markdown rendered) | Legal body |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:330:| P-006 Treatment Detail | `<TreatmentHero>` · `<ArticleBody markdown={treatment.body_markdown}>` · `<TreatmentSummary>` · `<ContactCta>` | TreatmentPage |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:331:| P-010 Article Detail (1샘플) | `<ArticleHero>` (title·summary·publishedAt·author) · `<ArticleBody markdown={article.body_markdown}>` | Article + author Doctor |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:340:  - v0.1 결정: `sanitize-html` (단순함). 향후 EAT_CONTENT plan 안 FAQ 도 같은 컴포넌트 재사용 시 `rehype-sanitize` 로 전환 marker (PSR-DEFER-17).
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:341:- 허용 태그: `h1`/`h2`/`h3`/`h4`/`p`/`ul`/`ol`/`li`/`a`/`strong`/`em`/`code`/`pre`/`blockquote`/`table`/`thead`/`tbody`/`tr`/`th`/`td`/`hr`/`br`
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:344:- LegalDocument 본문 (CONTENT_STANDARDS § 7.1.1.1 면제) 도 동일 컴포넌트 사용 — answer-first AST · 표현 검사 미적용은 어드민 저장 단계의 결정이지 렌더 단계와 무관.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:393:  - root layout 안 `<html data-theme="light">` 고정 v0.1. UI toggle 만 defer (PSR-DEFER-03).
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:437:- 응답: SEARCH_STANDARDIZATION § 4.2 형식 + § 4.3 changefreq/priority + § 4.4 lastmod SoT 정합.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:438:- **changefreq · priority (SEARCH_STANDARDIZATION § 4.3 그대로)**:
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:440:| 페이지 | changefreq | priority |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:469:- (PSR-SEO-09 · cycle1 PSR-04 + cycle2 PSR-22) v0.1 단계 ClinicProfile.metadata.aiCrawlerPolicy 컬럼 부재 — InstanceManifest 합류 (M0 v1.0 cascade · PSR-DEFER-10) 전까지는 fixed `disallowTraining` starter (enum 값 = `disallowTraining` · SoT 4종 `allow / disallowTraining / disallowAll / custom`):
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:532:> v0.1 단계 `{domain}` = `<host>/<instanceSlug>` path-based. M0 v1.0 도메인 매핑 합류 시 (PSR-DEFER-02) `<customDomain>` 으로 평면화. SEARCH_STANDARDIZATION § 3.3 footnote 의 `experimentalAiBots` flag 도 동일 cascade.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:534:- (PSR-SEO-10) M0 v1.0 InstanceManifest.aiCrawlerPolicy 합류 시 (PSR-DEFER-10) row-driven 출력:
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:557:| P-014 Location Detail | `[풀] Organization` · `[풀] MedicalClinic`(`#clinic` 단지점 main 의 entity @id 그대로 — SCHEMA_MAPPING § 1.4 정합) · `[풀] WebPage` · `[풀] BreadcrumbList` |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:560:- (PSR-SEO-12 · cycle1 PSR-08) v0.1 `@id` path-based 패턴 — `https://<host>/<instanceSlug>/#organization` · `/<instanceSlug>/#clinic` · `/<instanceSlug>/doctors/<slug>#physician` 등. SCHEMA_MAPPING § 1.2 SoT 의 `https://{domain}/#organization` 패턴은 도메인 매핑 후 (M0 v1.0) 적용. v0.1 path-based 변형의 entity continuity 가 중요 — M0 도메인 전환 시 redirect / 301 cascade 가 entity @id 까지 cascade 되도록 SCHEMA_MAPPING § 1.2 patch (PSR-CASCADE-02).
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:561:- (PSR-SEO-13) `inLanguage` 명시 정책: SCHEMA_MAPPING § 1.5 정합 — CreativeWork 계열 (Article · WebPage · FAQPage 등) 만 명시. Organization · MedicalClinic · Physician 등은 미명시.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:562:- (PSR-SEO-14 · cycle1 PSR-17) **자체 JSON-LD rule checker** (LOCAL_PASS 게이트): JSON parse + 필수 entity 존재 + `@id` 유일 + cross-reference 무결성 검증. Google Rich Results Test / schema.org validator 는 manual QA marker (PSR-DEFER-14) — CI 게이트 X.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:570:- v0.1 단계 동적 OG 이미지 생성 미지원 (PSR-DEFER-09).
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:579:| 1 | `D0011_public_reader.sql` 작성 + per-table policy 7개 (instance + 6 content table) | acceptance precondition |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:581:| 3 | `apps/web/src/lib/public-db.ts` 신규 — `app_public_reader` connection helper (singleton) | acceptance precondition |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:583:| 5 | pgbouncer userlist 에 `app_public_reader` 추가 (`apps/spike-a/...userlist.txt`) | PSR-CASCADE-05 acceptance precondition |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:584:| 6 | role membership / NOLOGIN 분리 production marker | PSR-DEFER-16 (M0 v1.0 본 구현 합류) |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:585:| 7 | `packages/migrations-runner/src/manifest.ts` v0.x — D0011 10단계 추가 (PSR-CASCADE-04) | acceptance precondition |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:601:| 6 | TreatmentPage `/<instanceSlug>/treatments/<slug>` 진입 시 body_markdown 렌더링 | `<h1>`·`<h2>`·`<p>` 표준 출력 |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:604:| 9 | tenant A 가 `/<tenantB>` 접근 — A 콘텐츠 미노출, B 콘텐츠만 | RLS app_public_reader USING `instance_id` 정합 |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:606:| 11 | `/<instanceSlug>/sitemap.xml` 응답 | XML sitemap (P-013 제외 9페이지 + 동적 slug) + SEARCH_STANDARDIZATION § 4.3 changefreq/priority 정확 |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:608:| 13 | XSS payload `<script>` 가 어드민에 저장된 bodyMarkdown 에 포함 시 렌더 단계에서 escape | `<script>` literal 출력 — execution X (sanitize-html) |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:609:| 14 | active=false instance → `/<instanceSlug>` 진입 시 404 | Next `notFound()` (instance lookup policy USING `active=true`) |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:613:| 18 | **자체 JSON-LD rule checker** 통과 (cycle1 PSR-17 정정) | JSON parse + 필수 entity 존재 + `@id` 유일 + cross-reference 무결성 — Google 외부 validator 는 manual QA marker (PSR-DEFER-14) |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:624:| 1 | D0011 migration — `app_public_reader` LOGIN + 7개 policy (instance + 6 content table) | packages/db/migrations/D0011_public_reader.sql |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:640:| 17 | docs/core/SCHEMA_MAPPING.md § 1.2 patch — v0.1 path-based `@id` marker + entity continuity note (PSR-CASCADE-02) | doc |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:642:| 19 | packages/migrations-runner manifest 10단계 (D0011 추가 — PSR-CASCADE-04) | manifest.ts |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:650:- `PSR-DEFER-01`: static export to Git — apps/worker + isomorphic-git/simple-git. v0.1 SSR 의 컴포넌트 트리 재사용 + `generateStaticParams` + `next export`.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:651:- `PSR-DEFER-02`: 도메인 매핑 — subdomain `<slug>.glitzy.co` + custom domain CNAME. Vercel/Cloud Run middleware host header → instanceSlug rewrite.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:652:- `PSR-DEFER-04`: CDN cache 정책 — Cloudflare · Vercel ISR fine-tune.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:653:- `PSR-DEFER-10`: AI 크롤러 인증 + InstanceManifest.aiCrawlerPolicy row-driven 출력 + 법무 승인 필드 3종 verify (SEARCH_STANDARDIZATION § 3.3.1 룰).
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:654:- `PSR-DEFER-13` (= LL-DEFER-01 alias · cycle1 PSR-06): LegalDocument 공개 노출 — compliance-assistant + ComplianceRecord legalCounsel/legalCounselAt 합류 시점.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:655:- `PSR-DEFER-16` (cycle1 PSR-05): `app_public_reader` NOLOGIN + MEMBERSHIP 분리 production 패턴.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:659:- `PSR-DEFER-03`: dark mode UI toggle (CSS vars 는 v0.1 부터 두 테마 출력 — DESIGN_TOKENS § 3.3 정합).
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:660:- `PSR-DEFER-05`: 검색 콘솔 sitemap submission 자동화.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:661:- `PSR-DEFER-08`: draft preview token (어드민 외).
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:662:- `PSR-DEFER-09`: 페이지별 OG 이미지 동적 생성 (`@vercel/og`).
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:663:- `PSR-DEFER-17` (cycle1 PSR-19): Markdown sanitizer 를 `sanitize-html` → `rehype-sanitize` (unified pipeline) 전환 — EAT_CONTENT plan v0.1 안 FAQ 합류 시.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:667:- `PSR-DEFER-11(부분)`: FAQ (P-011) 추가 — schema.org `FAQPage` JSON-LD.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:668:- `PSR-DEFER-15` (cycle1 PSR-11): Article `category` 컬럼 + URL 패턴 운영 — 현재 C-04 article.category 없음. v0.1 단일 fallback `general`.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:672:- `PSR-DEFER-14` (cycle1 PSR-17): Google Rich Results Test / schema.org validator 자동 게이트 — manual QA marker. CI 게이트 X.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:676:- `PSR-DEFER-06`: `/<lang>/<instanceSlug>/...` routing 변경.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:685:- `PSR-CASCADE-02` (cycle1 PSR-08 보강): `docs/core/SCHEMA_MAPPING.md` § 1.2 patch — v0.1 임시 path-based `@id` 패턴 + 도메인 매핑 후 (M0 v1.0) entity @id 전환 시 redirect/301/`sameAs` 처리 룰 추가 marker.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:687:- `PSR-CASCADE-04`: `packages/migrations-runner/src/manifest.ts` — D0011 10단계 추가 (현 9단계 → 10단계).
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:688:- `PSR-CASCADE-05` (cycle2 PSR-27 경로 정정): `apps/spike-a/pgbouncer/userlist.txt` — `app_public_reader` 추가 (실 PROVIDER_PASS 단계 cascade). 본 파일은 `apps/spike-a/docker-compose.yml` 의 pgbouncer 컨테이너에 mount 되는 정확 경로.
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:695:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 21 findings (6 blocking + 11 major + 4 minor) 전건 수용 patch**: (PSR-01) M0 페이지 9 + P-010 1샘플 (P-009 미합류 · P-014 합류). (PSR-02) 어드민 URL `/admin/<slug>/...` prefix 격상 — acceptance precondition + 코드 cascade. (PSR-03) site layout 은 fragment · root layout SoT. (PSR-04) robots.txt SEARCH_STANDARDIZATION § 3 `aiCrawlerPolicy` 정합 starter `disallowTraining` (학습 봇 Disallow + 답변/검색 봇 Allow). (PSR-05) D0011 안 instance lookup policy + per-table policy 7개 + LOGIN 결정 + production NOLOGIN marker (PSR-DEFER-16). (PSR-06) LegalDocument draft 공개 노출 차단 — v0.1 `/legal/<type>` 항상 404 + noindex. PSR-DEFER-13 (= LL-DEFER-01 alias) 합류. (PSR-07) JSON-LD graph 표 SoT (§ 2.5) 그대로 — P-012 WebPage+MedicalClinic 풀, P-014 합류. (PSR-08) v0.1 path-based `@id` 패턴 + M0 도메인 전환 entity continuity cascade. (PSR-09) sitemap changefreq/priority/lastmod = SEARCH_STANDARDIZATION § 4.3·§ 4.4 SoT 그대로. (PSR-10) themeColor 2값 + og:type P-004 profile · P-006/P-010 article. (PSR-11) Article URL `/insights/[category]/[slug]` · v0.1 단일 fallback category `general` · PSR-DEFER-15. (PSR-12) DB column → Core contract field mapping 표 추가 (TreatmentPage.title=name, Article.title=headline 등). (PSR-13) Tailwind alias 표 — semantic 22 round-trip 보장. (PSR-14) CSS vars light/dark 둘 다 출력 · UI toggle 만 defer. (PSR-15) D0011 안 per-table CREATE POLICY 7개 명시. (PSR-16) LegalDocument DB CHECK 정합 — published 만 RLS 허용 (DB 안 published row 0개 → 자동 404). (PSR-17) 자체 JSON-LD rule checker LOCAL_PASS · 외부 validator manual QA marker (PSR-DEFER-14). (PSR-18) 시나리오 #1 통과 기준 "보임". (PSR-19) `sanitize-html` SSR 채택 · `rehype-sanitize` 전환 marker (PSR-DEFER-17). (PSR-20) rel `nofollow noopener noreferrer`. (PSR-21) WEB_PUBLIC_DATABASE_URL + .env.example + pgbouncer + role membership cascade 분해 (§ 6 acceptance checklist). |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:698:| 2026-05-18 | v0.4 | **Codex 비평 cycle 3 2 findings (0 blocking + 1 major + 1 minor) 전건 수용 patch**: (PSR-29) acceptance scenario #21 themeColor 기대값 stale 정정 — `BrandTokens.colors.light.primary` default `#2563eb` (light) / `#60a5fa` (dark). (PSR-30) robots.txt starter SoT line-by-line 정합 — 헤더/일반 룰/C 계열/meta-externalagent 코멘트 + Sitemap placeholder `{domain}` 통일 (SEARCH_STANDARDIZATION § 3.3 그대로). 추가 cascade 실 적용: docs/admin/ARCHITECTURE.md § 3.12 신설 (PSR-CASCADE-01a — apps/web route group `(admin)` + `(site)` 분리). apps/spike-a/pgbouncer/userlist.txt 에 `app_public_reader` 추가 (PSR-CASCADE-05). 누계 cycle 1+2+3 = 30 findings 전건 수용. 5 cascade 중 4 PASS, 01b 는 별 code v1.0 cycle. |
..\..\docs\decisions\PUBLIC_SITE_RENDER_PLAN.md:699:| 2026-05-18 | v0.3 | **Codex 비평 cycle 2 7 findings (2 blocking + 4 major + 1 minor) 전건 수용 patch**: (PSR-22) robots.txt starter SEARCH_STANDARDIZATION § 3.1 4계열 + § 3.3 출력 예시 그대로 정합 — PerplexityBot → B Allow, PerplexityBot-User → Perplexity-User 정정, Googlebot/Bingbot 추가, Bytespider/cohere-ai/Diffbot 제거, `/admin//auth//api/` 차단 추가, Claude-User 추가. enum `allowAll` → `allow` 정정. (PSR-23) themeColor 출처 `color.surface.background` → `BrandTokens.colors.light/dark.primary` (= `color.brand.primary` 평면화 · SEARCH_STANDARDIZATION § 2.1 정합). (PSR-24) PSR-CASCADE-01 분리 — a(docs · plan acceptance commit) / b(코드 · 별 code v1.0 cycle). LOCATION_LEGAL plan/code 분리 패턴과 동일. (PSR-25) packages/migrations-runner manifest.ts 에 D0011 entry 추가 — 10단계 완성. (PSR-26) Footer 법적 페이지 링크 v0.1 단계 숨김 — LegalDocument 항상 404 회피, 합류 후 동적 추가. (PSR-27) pgbouncer 경로 정정 `apps/spike-a/pgbouncer/userlist.txt`. (PSR-28) root layout className `bg-slate-50 text-slate-900` → `bg-canvas text-fg-default` 전환 acceptance precondition 명시 (§ 4.1 + § 8 #14). 추가 cascade 적용: docs/core/SCHEMA_MAPPING.md § 1.2 v0.1 path-based `@id` 임시 표 + entity continuity 전환 룰 (PSR-CASCADE-02). docs/decisions/M0_BUILD_EXPORT_PLAN.md § 2.1 PUBLIC_SITE_RENDER SSR 컴포넌트 재사용 표 (PSR-CASCADE-03). 누계 cycle 1+2 = 28 findings 전건 수용. |
src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:1:// @glitzy/web/(site)/[instanceSlug]/insights/[category]/[slug] — P-010 Article Detail (1샘플)
src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:2:// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 2.1 (Article URL `/insights/[category]/[slug]` · v0.1 fallback `general`)
src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:18:export async function generateMetadata({ params }: { params: { instanceSlug: string; category: string; slug: string } }): Promise<Metadata> {
src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:19:  if (params.category !== "general") return {};
src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:24:      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, author_doctor_id, updated_at
src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:33:    canonicalPath: `/insights/${params.category}/${a.slug}`,
src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:42:  params: { instanceSlug: string; category: string; slug: string };
src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:44:  // v0.1 단일 fallback category `general` — PSR-DEFER-15
src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:45:  if (params.category !== "general") notFound();
src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:51:      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, author_doctor_id, updated_at
src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:75:    { siteBaseUrl: hostOrigin, pagePath: `/insights/${params.category}/${data.article.slug}` },
src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:79:    params.category,
src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx:106:          <ArticleBody markdown={data.article.body} hostOrigin={hostOrigin} />
src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:23:const RISK_LEVELS = ["Low", "Medium", "High"] as const;
src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:40:  bodyMarkdown: z
src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:41:    .string({ required_error: "본문은 필수입니다." })
src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:42:    .min(1, "본문은 1자 이상")
src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:43:    .max(100_000, "본문은 100000자를 넘을 수 없습니다."),
src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:53:      message: "위험도는 Low / Medium / High",
src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:141:                 body_markdown = ${parsed.data.bodyMarkdown},
src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:155:          instance_id, slug, title, summary, body_markdown, status, risk_level, hero_image_url, author_doctor_id, published_at
src\app\(admin)\admin\[instanceSlug]\articles\actions.ts:161:          ${parsed.data.bodyMarkdown},
..\..\docs\core\SEARCH_STANDARDIZATION.md:117:| P-011 FAQ | `website` |
..\..\docs\core\SEARCH_STANDARDIZATION.md:146:| **P-010 Article**: `Article.category` / `ArticleCategory.name` resolve 실패 (= `article:section` 누락) | **warning** | `Article.category`는 DATA_MODEL에서 required이므로 누락 가능 케이스는 ArticleCategory 참조 resolve 실패. 콘텐츠 분류 신호 약화 (콘텐츠 자체는 출력) |
..\..\docs\core\SEARCH_STANDARDIZATION.md:160:| **B. AI 검색 인덱싱·답변용** | `OAI-SearchBot` (ChatGPT 검색용) / `PerplexityBot` (Perplexity 검색용) / `Claude-SearchBot` (Anthropic 검색용) | AI 답변·검색에서 사이트를 발견·인용하기 위한 인덱싱 크롤러 | OpenAI publisher FAQ; Perplexity crawlers; Anthropic crawler help |
..\..\docs\core\SEARCH_STANDARDIZATION.md:162:| **D. AI 학습·모델 개선용** | `GPTBot` (OpenAI 학습) / `ClaudeBot` (Anthropic 학습/모델 개선) / `Google-Extended` (Google Gemini 학습) / `CCBot` (Common Crawl, LLM 학습 데이터) / `anthropic-ai` (Anthropic legacy·alias로 추정) / `meta-externalagent` (Meta — 외부 관측 기반, 공식 문서 재검증 필요) | 모델 학습 데이터 수집 | OpenAI publisher FAQ; Anthropic crawler help; **Google-Extended controls (overview-google-crawlers)**; Common Crawl; (meta-externalagent는 외부 관측 기반) |
..\..\docs\core\SEARCH_STANDARDIZATION.md:166:> - OpenAI publisher FAQ — https://help.openai.com/en/articles/12627856-publishers-and-developers-faq
..\..\docs\core\SEARCH_STANDARDIZATION.md:319:| 인스턴스 콘텐츠 (Articles·Treatments·Doctors·Conditions·FAQ·Locations) | **Allowed** — 발행된 모든 콘텐츠 |
..\..\docs\core\SEARCH_STANDARDIZATION.md:332:    <changefreq>weekly</changefreq>
..\..\docs\core\SEARCH_STANDARDIZATION.md:333:    <priority>1.0</priority>
..\..\docs\core\SEARCH_STANDARDIZATION.md:338:    <changefreq>monthly</changefreq>
..\..\docs\core\SEARCH_STANDARDIZATION.md:339:    <priority>0.8</priority>
..\..\docs\core\SEARCH_STANDARDIZATION.md:345:### 4.3 페이지별 changefreq·priority 기본값
..\..\docs\core\SEARCH_STANDARDIZATION.md:347:| 페이지 타입 | changefreq | priority |
..\..\docs\core\SEARCH_STANDARDIZATION.md:359:| P-011 FAQ | monthly | 0.5 |
..\..\docs\core\SEARCH_STANDARDIZATION.md:418:| 페이지 타입별 대표 URL 1개 (P-001·P-002·P-003·P-004·P-005·P-006·P-007·P-008·P-009·P-010·P-011·P-012·P-013·P-014) | 매 빌드 | 14개 — Core 페이지 타입 카탈로그 |
..\..\docs\core\SEARCH_STANDARDIZATION.md:539:| **content-gate** | 본문 표현 검수 | (본 문서는 메타·robots·sitemap 중심이라 content-gate 항목 적음. `CONTENT_STANDARDS.md`에서 다룸) |
..\..\docs\core\SEARCH_STANDARDIZATION.md:574:| 2026-05-14 | v0.1 | 최초 작성 — 메타 태그 표준(28종), robots.txt(AI 크롤러 화이트리스트), sitemap.xml(페이지별 changefreq/priority), canonical resolve 우선순위, 성능 기준(빌드 lab + 운영 field), Core 인터페이스 vs analytics-reporting 모듈 책임 분리, 빌드 검증 룰 레벨 |
..\..\docs\core\SEARCH_STANDARDIZATION.md:577:| 2026-05-14 | v0.4 | **AI 봇 분류 정확화** (피드백 8건): (1) **§ 0 요약 정정** — "Core 기본 allow" 잔재 제거, `required·미설정 fail`로 통일, (2) **Anthropic 봇 분류 정정** — `ClaudeBot`을 D 학습 계열로, `Claude-SearchBot`을 B 검색 인덱싱, `Claude-User`를 C user-triggered로. `anthropic-ai`는 legacy/alias 주석, (3) **OpenAI `ChatGPT-User` 추가** — C user-triggered 계열, (4) **3계열 → 4계열 재구성** — A 일반 검색 / B AI 검색 인덱싱 / **C User-triggered fetch** / D AI 학습. C 계열은 robots.txt 무시 가능성 주의, (5) **공식 출처 URL 명시** — 각 user-agent에 OpenAI publisher FAQ·Anthropic crawler help·Perplexity crawlers·Google robots-meta 참조. `meta-externalagent`는 외부 관측 기반 표기. 분기 1회 재검증 책임 명시, (6) **§ 0·§ 2.1 og:type 잔재 정정** — P-004 profile·P-006/P-008/P-010 article·나머지 website, (7) **SCHEMA_MAPPING § 1.5 `<html lang="ko">` → `<html lang="ko-KR">` cascade 정합**, (8) **법무 승인 플래그 룰 완화** — `allow`만 fail-gate, 다른 정책은 승인 기록 권장(warning 수준) |
..\..\docs\core\SEARCH_STANDARDIZATION.md:583:| 2026-05-14 | v0.10 | **잔재 정합 마감** (피드백 3건): (1) **§ 2.1 `article:modified_time` 출처 표** — "warning 수준" 잔재 제거. fallback 사용은 silent로 명시, (2) **v0.9 변경 이력 표현 정정** — warning은 명시 필드 도입 후 값 부재에만 적용. `@updatedAt` resolve 실패는 fail로 분리 (이전 표현이 둘을 warning에 모두 묶어서 모순), (3) **§ 2.3 `article:section` 룰 이름 정확화** — "누락 warning" → "**`Article.category` / `ArticleCategory.name` resolve 실패**" (Article.category는 required, 누락 가능 케이스는 참조 resolve 실패) |

codex
핵심 grep 결과만으로는 판단이 부족해서, 이제 plan의 각 결정 블록과 SoT의 대응 블록을 라인 번호 포함으로 읽겠습니다. 특히 DATA_MODEL의 C-22, SCHEMA_MAPPING의 P-011/P-010, D0011 정책 패턴을 대조합니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\docs\\decisions\\EAT_CONTENT_PLAN.md'; "'$i=0; Get-Content $p | ForEach-Object { $i++; if($i -ge 70 -and $i -le 340){ '"'{0}:{1}' -f "'$i,$_ } }' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\docs\\decisions\\EAT_CONTENT_PLAN.md'; "'$i=0; Get-Content $p | ForEach-Object { $i++; if($i -ge 348 -and $i -le 599){ '"'{0}:{1}' -f "'$i,$_ } }' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\docs\\core\\DATA_MODEL.md'; "'$i=0; Get-Content $p | ForEach-Object { $i++; if(($i -ge 48 -and $i -le 62) -or ($i -ge 430 -and $i -le 485) -or ($i -ge 913 -and $i -le 936)){ '"'{0}:{1}' -f "'$i,$_ } }' in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 640ms:
70:## 2. 데이터 모델 결정
71:
72:### 2.1 C-22 `article_category` 신규 table (EC-SCHEMA-01) — PSR-DEFER-15 해소
73:
74:```sql
75:-- packages/core-content/migrations/C0009_article_category.sql
76:
77:CREATE TABLE article_category (
78:  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
79:  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
80:  slug TEXT NOT NULL,
81:  name TEXT NOT NULL,
82:  description TEXT,
83:  display_order INTEGER NOT NULL DEFAULT 0,
84:  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
85:  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
86:  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
87:  CONSTRAINT article_category_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
88:  CONSTRAINT article_category_name_length CHECK (length(name) BETWEEN 1 AND 100),
89:  CONSTRAINT article_category_instance_slug_unique UNIQUE (instance_id, slug),
90:  CONSTRAINT article_category_instance_id_unique UNIQUE (instance_id, id)
91:);
92:
93:CREATE INDEX article_category_instance_idx ON article_category (instance_id);
94:CREATE INDEX article_category_order_idx ON article_category (instance_id, display_order, id);
95:
96:ALTER TABLE article_category ENABLE ROW LEVEL SECURITY;
97:ALTER TABLE article_category FORCE ROW LEVEL SECURITY;
98:
99:CREATE POLICY tenant_isolation ON article_category
100:  FOR ALL TO app_tenant_user
101:  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
102:  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
103:
104:GRANT SELECT, INSERT, UPDATE, DELETE ON article_category TO app_tenant_user;
105:```
106:
107:**결정**:
108:- (EC-SCHEMA-02) `article_category` 는 flat 1-level (parent_id 없음 v0.1 · EC-DEFER-10).
109:- (EC-SCHEMA-03) **default category seed** = `general` slug. seed 안 instance 별 자동 INSERT. Article 의 기존 fallback `general` URL 정합 (PUBLIC_SITE_RENDER PSR-DEFER-15).
110:- (EC-SCHEMA-04) `article.category_id` UUID FK 추가 (C0013_article_category_fk · 별도 migration · composite FK 같은 패턴) — Article URL `/insights/[category]/[slug]` 의 `[category]` 가 `article_category.slug` 와 매칭. v0.1 seed 안 모든 기존 article 의 category_id = default `general` row id (data migration).
111:
112:### 2.2 C-25 `publication` 신규 table (EC-SCHEMA-05)
113:
114:```sql
115:-- packages/core-content/migrations/C0010_publication.sql
116:
117:CREATE TABLE publication (
118:  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
119:  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
120:  slug TEXT NOT NULL,
121:  title TEXT NOT NULL,
122:  authors JSONB NOT NULL DEFAULT '[]'::jsonb,  -- array of strings (저자 이름 리스트 · 본 clinic Doctor 가 저자/공저자일 수도)
123:  journal TEXT,                                  -- 학술지명 (예: "JKM" · "Journal of Korean Medicine")
124:  published_date DATE NOT NULL,                  -- 학술지 게재일
125:  doi TEXT,                                       -- DOI (Digital Object Identifier) — optional
126:  pubmed_id TEXT,                                 -- PubMed ID — optional
127:  url TEXT NOT NULL,                              -- 학술지/저자 외부 인용 URL (필수 · 외부 dereferenceable URL)
128:  thumbnail_url TEXT,                             -- 학술지 cover/journal logo (optional)
129:  summary TEXT NOT NULL,                          -- 운영자 입력 요약 (한국어 50~300자)
130:  author_doctor_id UUID,                          -- 본 clinic doctor 가 저자 일 때 — optional FK
131:  status content_publication_status NOT NULL DEFAULT 'draft',  -- M0 9-state 재사용
132:  risk_level risk_level NOT NULL DEFAULT 'Low',   -- 외부 인용은 Low 고정
133:  published_at TIMESTAMPTZ,                       -- 본 사이트 노출 시점 (DB published_at — entity publication 학술 published_date 와 별개)
134:  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
135:  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
136:  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
137:  CONSTRAINT publication_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,99}$'),
138:  CONSTRAINT publication_title_length CHECK (length(title) BETWEEN 1 AND 300),
139:  CONSTRAINT publication_summary_length CHECK (length(summary) BETWEEN 50 AND 300),
140:  CONSTRAINT publication_url_format CHECK (url ~ '^https?://'),
141:  CONSTRAINT publication_doi_format CHECK (doi IS NULL OR doi ~ '^10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$'),
142:  CONSTRAINT publication_pubmed_id_format CHECK (pubmed_id IS NULL OR pubmed_id ~ '^[0-9]{1,9}$'),
143:  CONSTRAINT publication_authors_array CHECK (jsonb_typeof(authors) = 'array' AND jsonb_array_length(authors) >= 1),
144:  CONSTRAINT publication_risk_level_low_only CHECK (risk_level = 'Low'),  -- EC-DEFER-07: 외부 인용은 Low 고정
145:  CONSTRAINT publication_published_requires_at CHECK (status <> 'published' OR published_at IS NOT NULL),
146:  CONSTRAINT publication_instance_slug_unique UNIQUE (instance_id, slug),
147:  CONSTRAINT publication_instance_id_unique UNIQUE (instance_id, id),
148:  -- composite FK (same-tenant authorDoctorId · LL-SCHEMA-14 패턴)
149:  CONSTRAINT publication_author_doctor_fk FOREIGN KEY (instance_id, author_doctor_id)
150:    REFERENCES doctor_profile (instance_id, id) ON DELETE NO ACTION
151:);
152:
153:CREATE INDEX publication_instance_idx ON publication (instance_id);
154:CREATE INDEX publication_status_idx ON publication (instance_id, status);
155:CREATE INDEX publication_published_idx ON publication (instance_id, published_at)
156:  WHERE status = 'published' AND published_at IS NOT NULL;
157:CREATE INDEX publication_author_idx ON publication (instance_id, author_doctor_id)
158:  WHERE author_doctor_id IS NOT NULL;
159:
160:ALTER TABLE publication ENABLE ROW LEVEL SECURITY;
161:ALTER TABLE publication FORCE ROW LEVEL SECURITY;
162:CREATE POLICY tenant_isolation ON publication FOR ALL TO app_tenant_user
163:  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
164:  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
165:GRANT SELECT, INSERT, UPDATE, DELETE ON publication TO app_tenant_user;
166:```
167:
168:**결정**:
169:- (EC-SCHEMA-06) `authors[]` JSONB array — 학술지 저자 리스트. clinic Doctor 가 저자이면 별도 `author_doctor_id` FK 로 link.
170:- (EC-SCHEMA-07) `url` required — 외부 dereferenceable URL (학술지 abstract · PubMed · DOI resolve URL). schema.org `ScholarlyArticle.url` 출력 직접.
171:- (EC-SCHEMA-08) `risk_level='Low'` CHECK 고정 — 외부 인용 entity 자체는 검수 대상이 아님. **본 site 의 publication = clinic 의 학술 인용 카탈로그**. 임상 권고문 아님. (EC-DEFER-07: status 전이 검수 cascade.)
172:- (EC-SCHEMA-09) `published_date` (학술 게재일) vs `published_at` (site 노출 시점) 별도 column.
173:
174:### 2.3 C-26 `media_appearance` 신규 table (EC-SCHEMA-10)
175:
176:```sql
177:-- packages/core-content/migrations/C0011_media_appearance.sql
178:
179:CREATE TYPE media_channel_type AS ENUM ('broadcast', 'youtube', 'podcast', 'press');
180:
181:CREATE TABLE media_appearance (
182:  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
183:  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
184:  slug TEXT NOT NULL,
185:  title TEXT NOT NULL,                            -- 영상/방송 제목
186:  channel_name TEXT NOT NULL,                     -- 방송사/유튜브 채널명 (예: "MBN" · "정명원" 채널)
187:  channel_type media_channel_type NOT NULL,
188:  published_date DATE NOT NULL,                   -- 방송/업로드 일자
189:  duration_seconds INTEGER,                       -- 영상 길이 (optional · 표시용)
190:  url TEXT NOT NULL,                              -- 외부 URL (필수)
191:  thumbnail_url TEXT,                             -- 영상 썸네일
192:  summary TEXT NOT NULL,                          -- 운영자 요약 (50~300자)
193:  author_doctor_id UUID,                          -- 출연 clinic doctor 가 본 clinic 소속일 때 — optional FK
194:  status content_publication_status NOT NULL DEFAULT 'draft',
195:  risk_level risk_level NOT NULL DEFAULT 'Low',
196:  published_at TIMESTAMPTZ,
197:  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
198:  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
199:  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
200:  CONSTRAINT media_appearance_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,99}$'),
201:  CONSTRAINT media_appearance_title_length CHECK (length(title) BETWEEN 1 AND 300),
202:  CONSTRAINT media_appearance_summary_length CHECK (length(summary) BETWEEN 50 AND 300),
203:  CONSTRAINT media_appearance_url_format CHECK (url ~ '^https?://'),
204:  CONSTRAINT media_appearance_duration_positive CHECK (duration_seconds IS NULL OR duration_seconds > 0),
205:  CONSTRAINT media_appearance_risk_level_low_only CHECK (risk_level = 'Low'),
206:  CONSTRAINT media_appearance_published_requires_at CHECK (status <> 'published' OR published_at IS NOT NULL),
207:  CONSTRAINT media_appearance_instance_slug_unique UNIQUE (instance_id, slug),
208:  CONSTRAINT media_appearance_instance_id_unique UNIQUE (instance_id, id),
209:  CONSTRAINT media_appearance_author_doctor_fk FOREIGN KEY (instance_id, author_doctor_id)
210:    REFERENCES doctor_profile (instance_id, id) ON DELETE NO ACTION
211:);
212:
213:CREATE INDEX media_appearance_instance_idx ON media_appearance (instance_id);
214:CREATE INDEX media_appearance_status_idx ON media_appearance (instance_id, status);
215:CREATE INDEX media_appearance_published_idx ON media_appearance (instance_id, published_at)
216:  WHERE status = 'published' AND published_at IS NOT NULL;
217:CREATE INDEX media_appearance_author_idx ON media_appearance (instance_id, author_doctor_id)
218:  WHERE author_doctor_id IS NOT NULL;
219:
220:ALTER TABLE media_appearance ENABLE ROW LEVEL SECURITY;
221:ALTER TABLE media_appearance FORCE ROW LEVEL SECURITY;
222:CREATE POLICY tenant_isolation ON media_appearance FOR ALL TO app_tenant_user
223:  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
224:  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
225:GRANT SELECT, INSERT, UPDATE, DELETE ON media_appearance TO app_tenant_user;
226:```
227:
228:**결정**:
229:- (EC-SCHEMA-11) `media_channel_type` enum 4종 — `broadcast` · `youtube` · `podcast` · `press`. JSON-LD schema.org `VideoObject` (broadcast/youtube/podcast) vs `NewsArticle` (press) 매핑 분기.
230:- (EC-SCHEMA-12) `url` external dereferenceable — `<a href>` 클릭 시 외부 채널 (YouTube 등) 이동. v0.1 embed 미지원 (EC-DEFER-04).
231:
232:### 2.4 C-27 `faq` 신규 table (EC-SCHEMA-13)
233:
234:```sql
235:-- packages/core-content/migrations/C0012_faq.sql
236:
237:CREATE TABLE faq (
238:  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
239:  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
240:  slug TEXT NOT NULL,
241:  question TEXT NOT NULL,                         -- 질문 (10~200자)
242:  answer TEXT NOT NULL,                           -- 답변 (Markdown · 50~2000자)
243:  display_order INTEGER NOT NULL DEFAULT 0,
244:  category_id UUID,                               -- ArticleCategory FK (optional · 분류용)
245:  author_doctor_id UUID,                          -- 답변자 doctor (optional)
246:  status content_publication_status NOT NULL DEFAULT 'draft',
247:  risk_level risk_level NOT NULL DEFAULT 'Low',
248:  compliance_record_id UUID,                      -- 향후 compliance-assistant 합류 시 ComplianceRecord ref
249:  published_at TIMESTAMPTZ,
250:  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
251:  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
252:  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
253:  CONSTRAINT faq_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,99}$'),
254:  CONSTRAINT faq_question_length CHECK (length(question) BETWEEN 10 AND 200),
255:  CONSTRAINT faq_answer_length CHECK (length(answer) BETWEEN 50 AND 2000),
256:  CONSTRAINT faq_published_requires_at CHECK (status <> 'published' OR published_at IS NOT NULL),
257:  CONSTRAINT faq_instance_slug_unique UNIQUE (instance_id, slug),
258:  CONSTRAINT faq_instance_id_unique UNIQUE (instance_id, id),
259:  CONSTRAINT faq_category_fk FOREIGN KEY (instance_id, category_id)
260:    REFERENCES article_category (instance_id, id) ON DELETE NO ACTION,
261:  CONSTRAINT faq_author_doctor_fk FOREIGN KEY (instance_id, author_doctor_id)
262:    REFERENCES doctor_profile (instance_id, id) ON DELETE NO ACTION
263:);
264:
265:CREATE INDEX faq_instance_idx ON faq (instance_id);
266:CREATE INDEX faq_status_idx ON faq (instance_id, status);
267:CREATE INDEX faq_published_idx ON faq (instance_id, published_at, display_order)
268:  WHERE status = 'published' AND published_at IS NOT NULL;
269:CREATE INDEX faq_category_idx ON faq (instance_id, category_id)
270:  WHERE category_id IS NOT NULL;
271:
272:ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
273:ALTER TABLE faq FORCE ROW LEVEL SECURITY;
274:CREATE POLICY tenant_isolation ON faq FOR ALL TO app_tenant_user
275:  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
276:  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
277:GRANT SELECT, INSERT, UPDATE, DELETE ON faq TO app_tenant_user;
278:```
279:
280:**결정**:
281:- (EC-SCHEMA-14) Faq 의 `risk_level` 은 **자동 추론 대상** (RISK_LEVELS § 2 의 의료 질문 분류) — compliance-assistant 합류 시 inferredRiskLevel 자동 적용 (EC-DEFER-05). v0.1 단계 default 'Low'.
282:- (EC-SCHEMA-15) `answer` Markdown — public 페이지에서 `sanitize-html` 통과 후 렌더링. Article body 와 동일 처리.
283:- (EC-SCHEMA-16) `category_id` optional — 분류 안 한 FAQ 도 가능. v0.1 단계 분류 사용 X (모두 NULL) — `general` category 자동 할당 X. M1 cascade 에서 운영자가 분류 합류 (EC-DEFER-09).
284:
285:### 2.5 article.category_id 추가 — PSR-DEFER-15 해소 (EC-SCHEMA-17)
286:
287:```sql
288:-- packages/core-content/migrations/C0013_article_category_fk.sql
289:
290:ALTER TABLE article ADD COLUMN category_id UUID;
291:
292:ALTER TABLE article ADD CONSTRAINT article_category_fk
293:  FOREIGN KEY (instance_id, category_id)
294:  REFERENCES article_category (instance_id, id)
295:  ON DELETE NO ACTION;
296:
297:CREATE INDEX article_category_idx ON article (instance_id, category_id)
298:  WHERE category_id IS NOT NULL;
299:
300:-- v0.1 data migration: 기존 article row 가 있으면 default `general` category 로 backfill.
301:-- 본 마이그레이션은 idempotent — seed 안 default category 가 만들어진 후 별도 backfill 스크립트 (apps/web/scripts/backfill-article-category.sql).
302:-- 본 plan v0.1 의 acceptance 강도 = 마이그레이션 파일 작성. backfill 스크립트 작성은 같은 commit 안.
303:```
304:
305:### 2.6 D0011 GRANT 확장 (EC-SCHEMA-18) — PSR-CASCADE-04 cascade
306:
307:```sql
308:-- packages/db/migrations/D0014_public_reader_eat.sql (신규 · EC-CASCADE-05)
309:-- PUBLIC_SITE_RENDER PSR-CASCADE-04 의 D0011 의 GRANT 에 4 신규 table 추가 + per-table policy
310:
311:GRANT SELECT ON article_category, publication, media_appearance, faq TO app_public_reader;
312:
313:CREATE POLICY public_reader_article_category_select
314:  ON article_category FOR SELECT TO app_public_reader
315:  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
316:
317:CREATE POLICY public_reader_publication_select
318:  ON publication FOR SELECT TO app_public_reader
319:  USING (
320:    instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
321:    AND status = 'published'
322:    AND published_at IS NOT NULL
323:    AND published_at <= now()
324:  );
325:
326:CREATE POLICY public_reader_media_appearance_select
327:  ON media_appearance FOR SELECT TO app_public_reader
328:  USING (
329:    instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
330:    AND status = 'published'
331:    AND published_at IS NOT NULL
332:    AND published_at <= now()
333:  );
334:
335:CREATE POLICY public_reader_faq_select
336:  ON faq FOR SELECT TO app_public_reader
337:  USING (
338:    instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
339:    AND status = 'published'
340:    AND published_at IS NOT NULL

 succeeded in 657ms:
348:## 3. 어드민 폼 결정
349:
350:### 3.1 4 entity CRUD 구조 (EC-FORM-01)
351:
352:각 entity 별 admin route:
353:
354:| Entity | route prefix | 신규/편집/리스트 |
355:|---|---|---|
356:| ArticleCategory | `/admin/<slug>/categories` | list · new · edit (slug 별) |
357:| Publication | `/admin/<slug>/publications` | list · new · edit (slug 별) · author Doctor dropdown |
358:| MediaAppearance | `/admin/<slug>/media-appearances` | list · new · edit · author Doctor dropdown · channel_type select |
359:| Faq | `/admin/<slug>/faqs` | list · new · edit · category dropdown · author Doctor dropdown |
360:
361:**결정**:
362:- (EC-FORM-02) 4 entity 모두 M0 3-entity (Doctor/Treatment/Article) 폼 패턴 재사용 — zod schema · server action (withSkeletonTx + audit emit) · isNextControlFlowError · mapDbErrorToResult.
363:- (EC-FORM-03) 어드민 dashboard (`/admin/<slug>`) 에 4 entity card 추가 (count + 신규 추가 link).
364:- (EC-FORM-04) status 9-state 운영 — REVIEW_WORKFLOW 정합. compliance-assistant 합류 전까지 v0.1 단계 운영자가 직접 status 변경 가능 (draft/publishable/published — review-queued/in-review 는 차단 marker EC-DEFER-07).
365:- (EC-FORM-05) Faq displayOrder 입력 — Doctor 폼의 displayOrder 패턴 그대로.
366:
367:### 3.2 폼 validation zod schema (EC-FORM-06)
368:
369:`apps/web/src/lib/eat-content-schema.ts` 신설 — 4 entity 의 zod schema 통합 SoT.
370:
371:- **Publication**: title (1~300) · authors (string[]) · journal · publishedDate ISO · doi (`10\.[0-9]{4,9}/.+`) · pubmedId (`[0-9]{1,9}`) · url (http(s)://) · summary (50~300) · authorDoctorId UUID (optional · doctor list 안 매칭)
372:- **MediaAppearance**: title · channelName · channelType enum · publishedDate · durationSeconds (positive int) · url · summary · authorDoctorId
373:- **Faq**: question (10~200) · answer (50~2000) · displayOrder (int) · categoryId UUID? · authorDoctorId? · status · risk_level (Low default v0.1)
374:- **ArticleCategory**: slug regex · name (1~100) · description · displayOrder
375:
376:### 3.3 server action 패턴 (EC-FORM-07)
377:
378:각 entity 별 `actions.ts`:
379:- `saveX(instanceSlug, _prev, formData)` — withSkeletonTx · zod parse · INSERT/UPSERT · audit emit (eventType `content-saved` · payload shape `{contentType, slug, mode, status, originalSlug}` 통일).
380:- `deleteX(instanceSlug, slug)` — withSkeletonTx · DELETE · audit emit (`content-deleted`).
381:- isNextControlFlowError rethrow · mapDbErrorToResult · revalidatePath 패턴.
382:
383:### 3.4 dashboard cascade (EC-FORM-08)
384:
385:`/admin/<slug>/page.tsx` 안 4 신규 entity card 추가 (count + new link). 기존 ClinicProfile · 의료진 · 시술 · 아티클 4 card 옆에 분류 · 논문 · 미디어 · FAQ 4 card 합류 → 총 8 card.
386:
387:## 4. 공개 페이지 렌더 결정 (PUBLIC_SITE_RENDER code v1.0 cascade)
388:
389:### 4.1 신규 페이지 P-011 FAQ (EC-RENDER-01) — PSR-DEFER-11 부분 해소
390:
391:`apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx` 신설:
392:- 데이터: faq published row (RLS 자동), ORDER BY display_order ASC, id ASC
393:- 표시: Q&A 카드 list. `<details>` collapsible 또는 항상 펼친 상태.
394:- JSON-LD: schema.org `FAQPage` + `Question`/`Answer` array. SCHEMA_MAPPING § 3 P-011 정합.
395:- Breadcrumb 추가.
396:- sitemap.xml entry 추가 (changefreq monthly · priority 0.5).
397:- robots.txt 영향 없음 (전체 allow).
398:
399:**결정**:
400:- (EC-RENDER-02) FAQ display_order 정렬 — 운영자가 어드민에서 순서 조정.
401:- (EC-RENDER-03) Faq.answer Markdown 렌더 — Article body 와 동일 `renderMarkdownToHtml` 사용.
402:
403:### 4.2 Doctor Profile (P-004) 확장 (EC-RENDER-04)
404:
405:Doctor Profile 페이지 안 inline section 추가:
406:- **Publications** — author_doctor_id = 본 doctor.id 인 row (published only). 학술 논문 인용 카드 list. 각 카드 = title · journal · publishedDate · authors[] · external link.
407:- **MediaAppearances** — author_doctor_id = 본 doctor.id 인 row. 미디어 출연 카드 list. title · channelName · channelType badge · publishedDate · thumbnailUrl · external link.
408:
409:**결정**:
410:- (EC-RENDER-05) Doctor Profile 의 JSON-LD `Physician` entity 안 `subjectOf` 또는 `knownFor` 로 Publication/MediaAppearance ref. 또는 별도 graph entity (ScholarlyArticle · VideoObject) 추가.
411:- (EC-RENDER-06) JSON-LD entity SoT 매핑:
412:  - `Publication` → `ScholarlyArticle` (또는 `CreativeWork`). `Physician.knownFor` 에 reference.
413:  - `MediaAppearance` channel_type='broadcast' → `BroadcastEvent` · `youtube`/`podcast` → `VideoObject` · `press` → `NewsArticle`. `Physician.subjectOf` 에 reference.
414:
415:### 4.3 About (P-002) 확장 (EC-RENDER-07)
416:
417:About 페이지 안 inline section:
418:- **clinic Publications** — author_doctor_id IS NULL (clinic-level 인용) + author_doctor_id IS NOT NULL (모든 row, 또는 doctor list 와 함께 표시).
419:- **clinic MediaAppearances** — 동일 정책.
420:
421:**결정**:
422:- (EC-RENDER-08) v0.1 단계는 모든 published row 표시 — author_doctor_id 무관. 운영자가 어떤 row 를 About 에서 강조할지 결정 → 별도 `featured_on_about` flag column 은 metadata JSONB 에 v0.2+ (EC-DEFER-09 와 별개).
423:
424:### 4.4 sitemap.xml + robots.txt cascade (EC-RENDER-09)
425:
426:- sitemap.xml — P-011 `/<slug>/faq` 추가 (changefreq monthly · priority 0.5 · lastmod `MAX(faq.updated_at)` aggregate). Publication / MediaAppearance 별도 페이지 없음 (v0.1) — sitemap 미추가.
427:- robots.txt — 영향 없음.
428:
429:### 4.5 ItemList page caching (EC-RENDER-10)
430:
431:P-011 FAQ 페이지 + Doctor Profile 의 inline Publication/MediaAppearance 섹션 — `revalidate = 60` 유지.
432:
433:## 5. SCHEMA_MAPPING 결정 (EC-CASCADE-02)
434:
435:`docs/core/SCHEMA_MAPPING.md` § 2 entity 카탈로그 + § 3 P-011 FAQ 신규 추가 + Doctor Profile 안 인용 reference.
436:
437:### 5.1 ScholarlyArticle entity (Publication)
438:
439:```json
440:{
441:  "@type": "ScholarlyArticle",
442:  "@id": "{siteBaseUrl}/publications/{slug}#scholarly",
443:  "headline": "<title>",
444:  "author": [{ "@type": "Person", "name": "<authors[0]>" }, ...],
445:  "datePublished": "<publishedDate>",
446:  "isPartOf": { "@type": "Periodical", "name": "<journal>" },
447:  "identifier": { "@type": "PropertyValue", "propertyID": "DOI", "value": "<doi>" },
448:  "url": "<url>",
449:  "description": "<summary>",
450:  "image": "<thumbnailUrl>",
451:  "publisher": { "@id": "{siteBaseUrl}/#organization" }
452:}
453:```
454:
455:### 5.2 VideoObject / BroadcastEvent / NewsArticle (MediaAppearance)
456:
457:```json
458:{
459:  "@type": "VideoObject", // 또는 channel_type 분기
460:  "@id": "{siteBaseUrl}/media-appearances/{slug}#video",
461:  "name": "<title>",
462:  "description": "<summary>",
463:  "uploadDate": "<publishedDate>",
464:  "duration": "PT<durationSeconds>S",
465:  "thumbnailUrl": "<thumbnailUrl>",
466:  "contentUrl": "<url>",
467:  "publisher": { "@type": "Organization", "name": "<channelName>" }
468:}
469:```
470:
471:### 5.3 FAQPage (P-011)
472:
473:```json
474:{
475:  "@type": "FAQPage",
476:  "@id": "{siteBaseUrl}/faq#faqpage",
477:  "inLanguage": "ko-KR",
478:  "mainEntity": [
479:    {
480:      "@type": "Question",
481:      "name": "<faq.question>",
482:      "acceptedAnswer": {
483:        "@type": "Answer",
484:        "text": "<faq.answer markdown→text>"
485:      }
486:    },
487:    ...
488:  ]
489:}
490:```
491:
492:**결정**:
493:- (EC-SEO-01) P-011 FAQ graph: `Organization` 풀 · `WebPage` 풀 · `BreadcrumbList` 풀 · `FAQPage` 풀.
494:- (EC-SEO-02) Doctor Profile P-004 graph 확장: 기존 `Organization`·`Physician`·`WebPage`·`BreadcrumbList` + (선택) `ScholarlyArticle[]` · `VideoObject[]` array. v0.1 단계 inline 안 하고 `Physician.subjectOf` 에 `@id` ref 만 출력 (graph 안 풀 entity X — cross-page reference).
495:- (EC-SEO-03) About P-002 graph 확장: 동일 패턴. `Organization.subjectOf` 또는 `MedicalClinic.subjectOf`.
496:- (EC-SEO-04) **cross-page allowlist 확장** — rule checker (`validate.ts`) 안 `#faqpage` · `#scholarly` · `#video` 같은 fragment 도 cross-page allowlist 에 추가 — entity 가 graph 안에 없어도 통과 (PSR-DEFER-02 Publication/Media 별도 페이지 합류 시 entity 출현). 단 v0.1 단계 inline 출력은 graph 안 entity 로 출력 (allowlist 미사용).
497:
498:## 6. CONTENT_STANDARDS 결정 (EC-CASCADE-03)
499:
500:`docs/core/CONTENT_STANDARDS.md` § 7.1.1.x ContentType 예외 표 확장:
501:
502:| ContentType | answer-first AST | 표현 검사 | RiskRule | RiskInference |
503:|---|---|---|---|---|
504:| Publication | **면제** (외부 학술 인용 · clinic 자체 표현 아님) | **면제** | **면제** (Low fixed) | **면제** |
505:| MediaAppearance | **면제** | **면제** | **면제** | **면제** |
506:| Faq Q | **적용** (질문 — 답 첫 문장 구조) | **적용** (FAQ 답변에 의료법 광고 표현 금지) | **적용** | **적용** (Medium/High 자동 추론 — 의료 진단/처방 질문) |
507:| Faq A | **적용** | **적용** | **적용** | **적용** |
508:| ArticleCategory | (콘텐츠 자체 없음 · 분류 메타) | - | - | - |
509:
510:**결정**:
511:- (EC-CONTENT-01) Publication/MediaAppearance — clinic 의 "외부 인용 카탈로그". 클리닉의 임상 권고문 아님. 검수 적용 시 정보 부족 (운영자가 인용한 학술지 자체를 검수 못 함).
512:- (EC-CONTENT-02) Faq — 클리닉 자체 답변. 의료법 광고 표현 검수 적용 + 위험도 자동 추론 (RISK_LEVELS § 2 정합).
513:- (EC-CONTENT-03) ArticleCategory — 분류 메타. 별 룰 없음.
514:
515:## 7. 환경·precondition
516:
517:- `packages/db/migrations/D0014_public_reader_eat.sql` (신규 · EC-CASCADE-05)
518:- `packages/core-content/migrations/C0009_article_category.sql` (신규)
519:- `packages/core-content/migrations/C0010_publication.sql` (신규)
520:- `packages/core-content/migrations/C0011_media_appearance.sql` (신규)
521:- `packages/core-content/migrations/C0012_faq.sql` (신규)
522:- `packages/core-content/migrations/C0013_article_category_fk.sql` (신규 · article.category_id ALTER)
523:- `apps/web/scripts/backfill-article-category.sql` (기존 article row 의 category_id = default `general` row backfill)
524:- `packages/migrations-runner/src/manifest.ts` patch — 14 단계 (D0010~D0011 + C0001~C0008 + C0009~C0013 + D0014) → EC-CASCADE-06
525:
526:## 8. § 8.1 시나리오 cascade (PUBLIC_SITE_RENDER v1.0 § 7 + 본 plan 신규)
527:
528:| # | 시나리오 | 통과 기준 |
529:|---|---|---|
530:| 24 | publication published 1행 → Doctor Profile 안 인용 카드 1건 표시 | author_doctor_id 매칭 row · external link rel="noopener" |
531:| 25 | media_appearance youtube 1행 → Doctor Profile 안 thumbnail + duration 표시 | duration `PT123S` ISO 형식 + thumbnailUrl |
532:| 26 | Faq 5건 (published) + 3건 (draft) → `/<slug>/faq` 5건만 노출 | display_order ASC 정렬 |
533:| 27 | FAQPage JSON-LD graph 안 5 Question 출력 | self-rule-checker PASS · mainEntity.length=5 |
534:| 28 | article.category_id = `general` row → `/<slug>/insights/general/<article-slug>` 200 | PSR-DEFER-15 해소 |
535:| 29 | ScholarlyArticle JSON-LD doi → `identifier.propertyID="DOI"` | doi optional · pubmedId 도 동일 propertyValue |
536:| 30 | VideoObject `duration` ISO 8601 (PT<seconds>S) | duration_seconds=3720 → `PT3720S` |
537:| 31 | Publication risk_level='Medium' 시도 → DB CHECK 위반 | publication_risk_level_low_only CHECK |
538:| 32 | Faq draft → `/<slug>/faq` 미노출 | RLS public_reader_faq_select status='published' |
539:| 33 | category 미존재 article 접근 → 404 | article.category_id 가 매칭되는 category.slug 와 URL `[category]` 정합 |
540:
541:## 9. 작업 단위
542:
543:| # | 작업 | 산출물 |
544:|---|---|---|
545:| 1 | C0009 article_category migration | packages/core-content/migrations/C0009_article_category.sql |
546:| 2 | C0010 publication migration | C0010_publication.sql |
547:| 3 | C0011 media_appearance migration | C0011_media_appearance.sql |
548:| 4 | C0012 faq migration | C0012_faq.sql |
549:| 5 | C0013 article.category_id ALTER + backfill script | C0013_article_category_fk.sql + apps/web/scripts/backfill-article-category.sql |
550:| 6 | D0014 public_reader EAT GRANT + policy | packages/db/migrations/D0014_public_reader_eat.sql |
551:| 7 | Drizzle schema 확장 — packages/core-content/src/schema.ts v0.4 | 4 신규 table |
552:| 8 | zod schema 통합 SoT | apps/web/src/lib/eat-content-schema.ts |
553:| 9 | 4 admin form (Publication·MediaAppearance·Faq·ArticleCategory) | apps/web/src/components/forms/{Publication,MediaAppearance,Faq,ArticleCategory}Form.tsx |
554:| 10 | 4 admin route group | apps/web/src/app/(admin)/admin/[instanceSlug]/{publications,media-appearances,faqs,categories}/{page,new/page,[slug]/page,actions}.tsx |
555:| 11 | mapDbErrorToResult constraint 매핑 추가 | apps/web/src/lib/errors.ts (publication_* · media_appearance_* · faq_* · article_category_*) |
556:| 12 | DB → projection 확장 | apps/web/src/lib/db-projection.ts (normalizePublication · normalizeMediaAppearance · normalizeFaq · normalizeArticleCategory) |
557:| 13 | JSON-LD entity 추가 | apps/web/src/lib/json-ld/entities.ts (scholarlyArticleEntity · mediaAppearanceEntity (channel_type 분기) · faqPageEntity) |
558:| 14 | JSON-LD builders 확장 | apps/web/src/lib/json-ld/builders.ts (faqPageGraph · doctorProfileGraph 의 Physician.subjectOf 확장 · aboutGraph 의 MedicalClinic.subjectOf 확장) |
559:| 15 | rule checker cross-page allowlist 확장 | apps/web/src/lib/json-ld/__tests__/validate.ts (`#faqpage`·`#scholarly`·`#video` allowlist) |
560:| 16 | P-011 FAQ public page | apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx + metadata + JsonLdScript |
561:| 17 | Doctor Profile (P-004) 확장 — Publications + MediaAppearances inline | doctors/[slug]/page.tsx |
562:| 18 | About (P-002) 확장 | about/page.tsx |
563:| 19 | sitemap.xml 확장 — P-011 FAQ entry | (site)/[instanceSlug]/sitemap.xml/route.ts |
564:| 20 | dashboard cascade — 8 card | (admin)/admin/[instanceSlug]/page.tsx |
565:| 21 | seed 안 default `article_category` row 자동 INSERT | apps/web/src/seed.ts |
566:| 22 | manifest 14 단계 (PSR-CASCADE-04 cascade) | packages/migrations-runner/src/manifest.ts |
567:| 23 | vitest scenario 24~33 추가 (자동 검증 가능 부분) | apps/web/src/lib/json-ld/__tests__/validate.test.ts + db-projection.test.ts |
568:| 24 | docs cascade — DATA_MODEL C-25/26/27 (EC-CASCADE-01) · SCHEMA_MAPPING § 3 P-011 (EC-CASCADE-02) · CONTENT_STANDARDS § 7.1.1.x (EC-CASCADE-03) · PUBLIC_SITE_RENDER_PLAN PSR-DEFER-11/15 해소 marker (EC-CASCADE-07) · M0_BUILD_EXPORT_PLAN § 2 (EC-CASCADE-04) | doc patches |
569:
570:## 10. M0 v1.0 cascade markers (defer 정리)
571:
572:### 10.1 별 cycle 합류
573:- `EC-DEFER-01`: Inquiry (1:1 상담 게시판) — PIPA + 회원 인증 결정.
574:- `EC-DEFER-08`: Reviews/Pricing High-risk commercial 페이지.
575:
576:### 10.2 M1 Phase Alpha 합류
577:- `EC-DEFER-02`: Publication / MediaAppearance 별도 페이지.
578:- `EC-DEFER-03`: DOI 자동 메타데이터 fetch (CrossRef API).
579:- `EC-DEFER-04`: 동영상 embed (YouTube iframe + CSP).
580:- `EC-DEFER-06`: Faq 다국어.
581:- `EC-DEFER-09`: Faq.metadata.featuredOnHome (Home inline).
582:- `EC-DEFER-10`: ArticleCategory 트리 구조.
583:
584:### 10.3 compliance-assistant Feature 합류
585:- `EC-DEFER-05`: Faq 자동 검수 (compliance-assistant + RiskRule + RiskInference).
586:- `EC-DEFER-07`: 4 entity status='review-queued' 전이 + ComplianceRecord pre-publish.
587:
588:## 11. Cascade markers (다른 SoT 문서로 전파)
589:
590:- `EC-CASCADE-01`: `docs/core/DATA_MODEL.md` § 4 — C-25 Publication · C-26 MediaAppearance · C-27 Faq 풀명세 추가 + § 1.1 인벤토리 (23 → 26 contracts).
591:- `EC-CASCADE-02`: `docs/core/SCHEMA_MAPPING.md` § 2 ScholarlyArticle·VideoObject·BroadcastEvent·FAQPage·Question·Answer entity 카탈로그 + § 3 P-011 FAQ graph + § 1.2 `@id` 패턴 (publication/media-appearance/faq).
592:- `EC-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7.1.1.x ContentType 예외 표 — Publication/MediaAppearance 면제 + Faq Q/A 적용.
593:- `EC-CASCADE-04`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2.1 SSR 재사용 표 — 신규 4 entity 의 Git output 변환 marker.
594:- `EC-CASCADE-05`: `packages/db/migrations/D0014_public_reader_eat.sql` — D0011 의 per-table GRANT/policy 4 신규 table cascade.
595:- `EC-CASCADE-06`: `packages/migrations-runner/src/manifest.ts` — 14 단계 (10 → 14, +4: C0009/C0010/C0011/C0012 + C0013 + D0014).
596:- `EC-CASCADE-07`: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` — PSR-DEFER-11 (FAQ) 부분 해소 + PSR-DEFER-15 (Article category) 해소 marker.
597:- `EC-CASCADE-08`: `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ M0 column 합류 + § 3 P-011 본문 (질문 위계 + AEO 친화) 확장.
598:- `EC-CASCADE-09`: `docs/admin/ARCHITECTURE.md` § 3 Vertical Slice — Slice 포함 데이터 계약 확장 (C-22/25/26/27 추가) + § 3.11 게이트 #1 12페이지 (기존 10 + FAQ 1 + Article category prefix 화면 1 — 별 화면 없음).
599:

 succeeded in 610ms:
48:| C-14 | `MedicalSpecialty` | 의료 전문 분야 | L2 | Git | | C-01,02 참조 |
49:| C-15 | `SchemaInput` | JSON-LD 생성기 입력 | L1/L3 | 런타임 | ✅ | 전체 |
50:| C-16 | `LegalDocument` | 정책·약관 (Core 표준 템플릿 + 변수 자동 치환) | L3 | Git | ✅ (auto) | P-013 |
51:| C-17 | `PricingPage` | 가격 안내 | L3 | Git | | P-102 |
52:| C-18 | `FacilitiesPage` | 시설·장비 | L3 | Git | | P-103 |
53:| C-19 | `NewsItem` | 소식·이벤트 | L3 | Git | | P-104 |
54:| C-20 | `ReservationPage` | 예약 안내 | L3 | Git | | P-105 |
55:| C-21 | `LocationProfile` | 지점 정체성 (위치·시간·연락 마스터) | L3 | Git | ✅ | P-012, P-014 |
56:| C-22 | `ArticleCategory` | Article Pillar/Category 정의 | L2+L3 | Git | (사용) | P-009, P-010 |
57:| C-23 | `AdminUser` | 어드민 사용자 (권한·자격·알림 선호 SoT) | L3 | DB | ✅ (admin) | 어드민 전용 |
58:
59:### 1.2 공통 타입 (CT — Cross-cutting Type, 3개)
60:
61:| ID | 공통 타입 | 책임 | 소속 | 사용처 |
62:|---|---|---|:---:|---|
430:| `description` | `Markdown` | optional | |
431:| `durationMinutes` | `number` | optional | |
432:| `location` | `enum {clinic, remote, both}` | optional | |
433:
434:#### `ProgramVariant`
435:| 필드 | 타입 | required | 설명 |
436:|---|---|:---:|---|
437:| `@id` | `Slug` | ✅ | |
438:| `name` | `string` | ✅ | 변형명 (예: "1개월 집중") |
439:| `duration` | `string` | ✅ | 기간 |
440:| `sessionCount` | `string` | optional | 세션 수 |
441:| `targetSegment` | `string` | optional | 대상 분류 |
442:| `briefDescription` | `Markdown` | ✅ | |
443:| `includes` | `string[]` | optional | 포함 항목 |
444:| `priceRange` | `string` | optional | 가격 범위 (위험도 High 격상) |
445:| `riskLevelOverride` | `RiskLevel` | optional | 변형 단위 위험도 |
446:
447:#### `EvidenceNote` (v0.4 신규)
448:| 필드 | 타입 | required | 설명 |
449:|---|---|:---:|---|
450:| `label` | `string` | ✅ | 근거 라벨 (예: "한방비만학회지 2022 임상사례") |
451:| `summary` | `string` | optional | 간략 요약 |
452:| `url` | `URL` | optional | 외부 검증 링크 (논문·학회) |
453:| `publishedYear` | `number` | optional | |
454:| `verifiedBy` | `string` | optional | 검증자·기관 |
455:
456:#### `SlotRiskOverride`
457:| 필드 | 타입 | required | 설명 |
458:|---|---|:---:|---|
459:| `slot` | `enum {overview, mechanism, targetAudience, recommendedFor, treatmentComponents, visitFlow, process, duration, sessionCount, programVariants, precautions, aftercare, maintenancePlan, evidenceNotes, cta}` | ✅ | |
460:| `level` | `RiskLevel` | ✅ | 격상 등급 |
461:| `reason` | `string` | ✅ | 감사 추적용 |
462:
463:### C-04. `Article` — 인사이트·블로그 글 (v0.4 컨텍스트 필드 즉시 통합)
464:
465:| 필드 | 타입 | required | 설명 |
466:|---|---|:---:|---|
467:| `@id` | `Slug` | ✅ | |
468:| `headline` | `string` | ✅ | 1~120자 |
469:| `summary` | `string` | ✅ | 80~200자 |
470:| `body` | `Markdown` | ✅ | 최소 1,000자(공백 제외) 권장 — `CONTENT_STANDARDS.md` § 1.3 SoT |
471:| `author` | `Ref<C-02>` | ✅ | 저자 |
472:| `coAuthors` | `Ref<C-02>[]` | optional | |
473:| `authorType` | `enum {clinician, staff, guest, external}` | optional | **(v0.4)** 저자 유형 (default `clinician`) |
474:| `reviewedBy` | `Ref<C-02>` | optional | **(v0.4)** 의료진 검수자 (E-E-A-T 신호) |
475:| `reviewedAt` | `Date` | optional | **(v0.4)** 검수 일자 |
476:| `contentSource` | `enum {original, syndicated, republished, translated}` | optional | **(v0.4)** 콘텐츠 출처 (default `original`) |
477:| `externalUrl` | `URL` | optional | **(v0.4)** 외부 인용·재게재 시 원본 URL |
478:| `datePublished` | `Date` | ✅ | 최초 발행일 |
479:| `dateModified` | `Date` | ✅ | 최종 수정일 |
480:| `articleType` | `enum {notice, general-medical-info, treatment-explainer, condition-explainer, effect-result-related, review-case, event-price}` | ✅ | 유형 — 위험도 자동 추론 |
481:| `contentFormat` | `enum {article, video, column}` | ✅ | 형식 (default `article`) |
482:| `category` | `Ref<C-22>` | ✅ | ArticleCategory |
483:| `tags` | `string[]` | optional | |
484:| `readingTimeMinutes` | `number` | optional | 자동 계산 |
485:| `wordCount` | `number` | optional | 자동 계산 |
913:### C-22. `ArticleCategory` — Article Pillar 분류
914:
915:| 필드 | 타입 | required | 설명 |
916:|---|---|:---:|---|
917:| `@id` | `Slug` | ✅ | |
918:| `name` | `string` | ✅ | 1~50자 |
919:| `description` | `string` | optional | 80~200자 |
920:| `pillar` | `string` | optional | 상위 Pillar |
921:| `parentCategory` | `Ref<C-22>` | optional | 계층 구조 시 |
922:| `slug` | `Slug` | ✅ | URL용 (보통 `@id`와 동일) |
923:| `coverImageUrl` | `URL` | optional | |
924:| `seoMeta` | `Ref<C-06>` | optional | 카테고리 페이지 PageMeta |
925:| `displayOrder` | `number` | optional | |
926:| `articleTypeDefault` | `string` | optional | 기본 ArticleType (작성 시 자동 추천) |
927:
928:---
929:
930:## 5. M0 외 계약 — 간략 명세 (후속 풀명세 예정)
931:
932:### C-11. `MedicalConditionPage`
933:필드: `name`, `definition`, `symptoms[]`, `causes[]`, `diagnosis`, `treatmentOptions`, `prevention`, `relatedTreatments[]`, `relatedDoctors[]`, `pageRiskLevel` (default Medium). Schema: `MedicalCondition`.
934:
935:### C-12. `FAQ`
936:필드: `question`, `answer` (Markdown), `category`, `riskLevel` (답변 단위), `relatedTreatment?`, `relatedCondition?`. Schema: `FAQPage.mainEntity.Question`.

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\docs\\decisions\\EAT_CONTENT_PLAN.md'; "'$i=0; Get-Content $p | ForEach-Object { $i++; if($i -ge 335 -and $i -le 346){ '"'{0}:{1}' -f "'$i,$_ } }' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\packages\\db\\migrations\\D0011_public_reader.sql'; "'$i=0; Get-Content $p | ForEach-Object { $i++; if($i -ge 1 -and $i -le 220){ '"'{0}:{1}' -f "'$i,$_ } }' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\packages\\migrations-runner\\src\\manifest.ts'; "'$i=0; Get-Content $p | ForEach-Object { $i++; if($i -ge 95 -and $i -le 120){ '"'{0}:{1}' -f "'$i,$_ } }' in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 599ms:
95:    creates: [
96:      "location_profile.clinic_profile_id",
97:      "location_profile_clinic_fk",
98:      "location_profile_clinic_idx",
99:    ],
100:    dependsOn: ["clinic_profile", "location_profile"],
101:  },
102:  // (10) app_public_reader role + per-table SELECT policy 7개 (PUBLIC_SITE_RENDER_PLAN v0.x · PSR-25 / PSR-CASCADE-04 patch)
103:  // depends_on = instance + 6 content table 모두. policy 가 모든 table 에 걸리므로 manifest 마지막.
104:  {
105:    file: "packages/db/migrations/D0011_public_reader.sql",
106:    package: "@glitzy/db",
107:    creates: [
108:      "app_public_reader",
109:      "public_reader_instance_select",
110:      "public_reader_clinic_profile_select",
111:      "public_reader_location_profile_select",
112:      "public_reader_doctor_profile_select",
113:      "public_reader_treatment_page_select",
114:      "public_reader_article_select",
115:      "public_reader_legal_document_select",
116:    ],
117:    dependsOn: [
118:      "instance",
119:      "clinic_profile",
120:      "location_profile",

 succeeded in 607ms:
1:-- @glitzy/db — D0011 app_public_reader role + per-table SELECT policy
2:-- SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 3.1 PSR-DATA-01 + PSR-25 + PSR-15
3:--
4:-- 본 migration 은 공개 사이트 SSR 단계에서 사용하는 read-only role 을 생성하고,
5:-- instance lookup + 6 content table 의 per-table SELECT policy 를 명시한다.
6:--
7:-- M0 v1.0 production 단계에는 NOLOGIN + MEMBERSHIP 분리 합류 (PSR-DEFER-16).
8:
9:-- LOGIN role — v0.1 단순화 (production NOLOGIN/MEMBERSHIP cascade marker PSR-DEFER-16).
10:-- IF NOT EXISTS 처리는 raw SQL 외 (Postgres 는 CREATE ROLE IF NOT EXISTS 미지원) → migration runner 책임.
11:--
12:-- PSRC-04 patch: migration 안 password 하드코딩 금지. role/권한/policy 만 생성하고
13:-- password 는 환경별 provision 단계에서 별도 설정 (예: 로컬 dev `ALTER ROLE app_public_reader PASSWORD '...'`,
14:-- production secret manager). 본 migration 은 idempotent 한 GRANT/POLICY 만.
15:CREATE ROLE app_public_reader LOGIN;
16:
17:GRANT USAGE ON SCHEMA public TO app_public_reader;
18:
19:-- ===== instance lookup policy =====
20:-- public reader 가 처음 instance 테이블 SELECT 로 slug → id 매핑. 본 SELECT 는 RLS USING 검증 전이므로
21:-- 별도 policy (active=true 만 노출).
22:GRANT SELECT ON instance TO app_public_reader;
23:
24:CREATE POLICY public_reader_instance_select
25:  ON instance
26:  FOR SELECT
27:  TO app_public_reader
28:  USING (active = true);
29:
30:-- ===== 6 content table per-table policy =====
31:-- 모든 policy USING `instance_id = current_setting('app.current_instance_id')`
32:-- helper `withPublicTenantTransaction` 가 instance lookup 직후 SET LOCAL app.current_instance_id 수행.
33:
34:GRANT SELECT ON clinic_profile, location_profile, doctor_profile,
35:                treatment_page, article, legal_document
36:  TO app_public_reader;
37:
38:CREATE POLICY public_reader_clinic_profile_select
39:  ON clinic_profile FOR SELECT TO app_public_reader
40:  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
41:
42:CREATE POLICY public_reader_location_profile_select
43:  ON location_profile FOR SELECT TO app_public_reader
44:  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
45:
46:CREATE POLICY public_reader_doctor_profile_select
47:  ON doctor_profile FOR SELECT TO app_public_reader
48:  USING (
49:    instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
50:    AND active = true
51:  );
52:
53:-- TreatmentPage: published + 미래 발행 제외
54:CREATE POLICY public_reader_treatment_page_select
55:  ON treatment_page FOR SELECT TO app_public_reader
56:  USING (
57:    instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
58:    AND status = 'published'
59:    AND published_at IS NOT NULL
60:    AND published_at <= now()
61:  );
62:
63:CREATE POLICY public_reader_article_select
64:  ON article FOR SELECT TO app_public_reader
65:  USING (
66:    instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
67:    AND status = 'published'
68:    AND published_at IS NOT NULL
69:    AND published_at <= now()
70:  );
71:
72:-- LegalDocument: v0.1 단계 published row 0 개 (DB CHECK status='draft' 만 허용)
73:--   → SELECT 0 행 → 자동 404. published 합류는 LL-DEFER-01 (compliance-assistant + ComplianceRecord legalCounsel) cascade.
74:CREATE POLICY public_reader_legal_document_select
75:  ON legal_document FOR SELECT TO app_public_reader
76:  USING (
77:    instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
78:    AND status = 'published'
79:  );

 succeeded in 622ms:
335:CREATE POLICY public_reader_faq_select
336:  ON faq FOR SELECT TO app_public_reader
337:  USING (
338:    instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid
339:    AND status = 'published'
340:    AND published_at IS NOT NULL
341:    AND published_at <= now()
342:  );
343:```
344:
345:**결정**:
346:- (EC-SCHEMA-19) D0014 신규 migration — D0011 의 per-table policy 패턴 그대로. publication/media_appearance/faq 는 published 만, article_category 는 무조건 SELECT (분류 자체는 public).

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\packages\\migrations-runner\\src\\manifest.ts'; "'$i=0; Get-Content $p | ForEach-Object { $i++; if($i -ge 117 -and $i -le 133){ '"'{0}:{1}' -f "'$i,$_ } }' in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 568ms:
117:    dependsOn: [
118:      "instance",
119:      "clinic_profile",
120:      "location_profile",
121:      "doctor_profile",
122:      "treatment_page",
123:      "article",
124:      "legal_document",
125:    ],
126:  },
127:];
128:
129:/**
130: * validateManifest — runner 가 sequential apply 직전 호출.
131: * 각 entry 의 dependsOn 이 이전 entries 의 creates 안에 모두 존재함을 verify.
132: * 실 runner 합류 (LL-DEFER-20) 시점에 적용.
133: */

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\docs\\core\\PAGE_TYPES.md'; "'$i=0; Get-Content $p | ForEach-Object { $i++; if(($i -ge 20 -and $i -le 60) -or ($i -ge 180 -and $i -le 240)){ '"'{0}:{1}' -f "'$i,$_ } }' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\docs\\core\\SCHEMA_MAPPING.md'; "'$i=0; Get-Content $p | ForEach-Object { $i++; if(($i -ge 52 -and $i -le 82) -or ($i -ge 141 -and $i -le 155) -or ($i -ge 420 -and $i -le 445) -or ($i -ge 507 -and $i -le 520) -or ($i -ge 614 -and $i -le 635)){ '"'{0}:{1}' -f "'$i,$_ } }' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\docs\\core\\SEARCH_STANDARDIZATION.md'; "'$i=0; Get-Content $p | ForEach-Object { $i++; if($i -ge 345 -and $i -le 361){ '"'{0}:{1}' -f "'$i,$_ } }' in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 778ms:
52:### 1.2 `@id` 네이밍 규약
53:
54:| Entity | `@id` 패턴 | 예시 |
55:|---|---|---|
56:| `Organization` (ClinicProfile) | `https://{domain}/#organization` | `https://example.com/#organization` |
57:| `MedicalClinic` 본원 (LocationProfile main) | `https://{domain}/#clinic` | `https://example.com/#clinic` |
58:| `MedicalClinic` 지점 (LocationProfile main 외) | `https://{domain}/locations/{slug}#clinic` | `https://example.com/locations/gangnam#clinic` |
59:| `Physician` (DoctorProfile) | `https://{domain}/doctors/{slug}#physician` | |
60:| `MedicalProcedure` (TreatmentPage) | `https://{domain}/treatments/{slug}#procedure` | |
61:| `MedicalCondition` (MedicalConditionPage) | `https://{domain}/conditions/{slug}#condition` | |
62:| `Article` | `https://{domain}/insights/{category}/{slug}#article` | |
63:| `WebSite` | `https://{domain}/#website` | |
64:| `WebPage` | `https://{domain}{path}#webpage` | 본문 페이지 entity |
65:
66:> `@id`는 dereferenceable URL + fragment 형식. 같은 entity는 항상 같은 `@id`를 사용해 페이지 간 일관성 확보.
67:
68:#### v0.1 path-based `@id` 임시 패턴 (PSR-CASCADE-02 · PUBLIC_SITE_RENDER_PLAN v0.x)
69:
70:`PUBLIC_SITE_RENDER_PLAN.md` v0.x § 5.4 PSR-SEO-12 의 SSR + path-based routing 단계 (Phase 0) 에서는 도메인 매핑 (subdomain/custom domain) 합류 전이므로 **임시로 instanceSlug 가 path 에 들어간 `@id` 패턴** 을 사용한다:
71:
72:| Entity | v0.1 path-based 임시 패턴 | M0 v1.0 도메인 매핑 후 (SoT 표 위) |
73:|---|---|---|
74:| `Organization` | `https://<host>/<instanceSlug>/#organization` | `https://<customDomain>/#organization` |
75:| `MedicalClinic` (`#clinic` 본원) | `https://<host>/<instanceSlug>/#clinic` | `https://<customDomain>/#clinic` |
76:| `Physician` | `https://<host>/<instanceSlug>/doctors/<slug>#physician` | `https://<customDomain>/doctors/<slug>#physician` |
77:| `MedicalProcedure` | `https://<host>/<instanceSlug>/treatments/<slug>#procedure` | `https://<customDomain>/treatments/<slug>#procedure` |
78:| `Article` | `https://<host>/<instanceSlug>/insights/<category>/<slug>#article` | `https://<customDomain>/insights/<category>/<slug>#article` |
79:| `WebSite` | `https://<host>/<instanceSlug>/#website` | `https://<customDomain>/#website` |
80:| `WebPage` | `https://<host>/<instanceSlug><path>#webpage` | `https://<customDomain><path>#webpage` |
81:
82:**Entity continuity 전환 룰 (M0 v1.0 도메인 매핑 합류 시점)**:
141:| `WebPage` | 모든 페이지 — 본문 entity | PageMeta (C-06) |
142:| `BreadcrumbList` | Home 제외 모든 페이지 | (생성기 자동, 경로 기반) |
143:| `MedicalClinic` | 본원(`#clinic`) — § 2.5 정책에 따라 페이지별 풀/참조. 다지점 비본원 지점은 P-012·P-014에서 N개 entity | LocationProfile (C-21) |
144:| `LocalBusiness` | **별도 출력 안 함** — `MedicalClinic`이 LocalBusiness sub-class. LocalBusiness 계열 속성(`address`·`openingHoursSpecification`·`geo`·`hasMap`·`potentialAction.ReserveAction`)은 `MedicalClinic` entity 위에서 사용 | (해당 없음 — 데이터는 LocationProfile, 타입은 MedicalClinic) |
145:| `Physician` | P-004 Doctor Profile, Article의 author·reviewedBy | DoctorProfile (C-02) |
146:| `MedicalProcedure` | P-006 Treatment Detail | TreatmentPage (C-03) |
147:| `MedicalCondition` | P-008 Condition Detail | MedicalConditionPage (C-11) |
148:| `Article` | P-010 Article Detail | Article (C-04) |
149:| `NewsArticle` | (대체 — News 카테고리) | NewsItem (C-19) |
150:| `FAQPage` | P-011 FAQ, FAQ 블록 포함 페이지 | FAQ[] (C-12) |
151:| `Question` / `Answer` | FAQPage.mainEntity | FAQ |
152:| `ItemList` | List 페이지 (P-003·P-005·P-007·P-009·...) | (생성기 자동) |
153:| `Blog` | P-009 대체 (콘텐츠 운영 명확 시) | (선택) |
154:| `VideoObject` | Article.embeddedMedia[].type=youtube·video, P-010의 contentFormat=video | EmbeddedMedia |
155:| `ImageObject` | 이미지 자산 (사진·로고·OG 등) | (생성기 자동) |
420:
421:**Physician 필드 매핑**:
422:
423:| Schema 필드 | 출처 (DoctorProfile) |
424:|---|---|
425:| `@type` | `"Physician"` |
426:| `@id` | `https://{domain}/doctors/{slug}#physician` |
427:| `name` | `name` |
428:| `alternateName` | `alternateName` |
429:| `jobTitle` | `jobTitle` |
430:| `description` | `briefBio` |
431:| `image` | `photoUrl` → `ImageObject` |
432:| `medicalSpecialty` | `medicalSpecialty[]` |
433:| `hasCredential` | `credentials[]` → `EducationalOccupationalCredential` |
434:| `alumniOf` | `education[]` → `EducationalOrganization` |
435:| `worksFor` | `{"@id": "https://{domain}/#organization"}` |
436:| `affiliation` | `affiliations[]` → `Organization` |
437:| `memberOf` | `affiliations[]` (보조) |
438:| `email` | `email` |
439:| `sameAs` | `socialMedia.*` 배열 |
440:
441:**Note**: `personalStory`·`philosophy`는 본문에 표시되지만 schema에는 비매핑 (의료 schema에 적절한 표현 없음 — `description`에 일부 흡수 가능).
442:
443:---
444:
445:### P-005. Treatments List
507:**FAQPage** (해당 시):
508:
509:```json
510:{
511:  "@type": "FAQPage",
512:  "mainEntity": [
513:    {
514:      "@type": "Question",
515:      "name": "{faq.question}",
516:      "acceptedAnswer": {
517:        "@type": "Answer",
518:        "text": "{faq.answer (Markdown → 평문)}"
519:      }
520:    }
614:8. (Q&A 블록 포함 시) `FAQPage` — **[풀]** (Conditional)
615:9. (contentFormat=video 또는 embeddedMedia.type∈{youtube,vimeo,external-video} 시) `VideoObject` — **[풀, 최소 필드 충족]** (Conditional)
616:
617:**Article 필드 매핑**:
618:
619:| Schema 필드 | 출처 (Article) |
620:|---|---|
621:| `@type` | `"Article"` (또는 `"BlogPosting"`·`"NewsArticle"` 변형) |
622:| `@id` | `https://{domain}/insights/{cat}/{slug}#article` |
623:| `headline` | `headline` |
624:| `description` | `summary` |
625:| `articleBody` | `body` (Markdown → 평문 권장, schema validator 호환) |
626:| `articleSection` | ArticleCategory.name |
627:| `datePublished` | `datePublished` |
628:| `dateModified` | `dateModified` |
629:| `author` | `{"@id": "https://{domain}/doctors/{author.slug}#physician"}` |
630:| `editor` | `reviewedBy` (해당 시) → Physician @id |
631:| `publisher` | `{"@id": "https://{domain}/#organization"}` |
632:| `mainEntityOfPage` | `{"@id": "https://{domain}{path}#webpage"}` |
633:| `image` | `coverImageUrl`·`ogImageUrl` → `ImageObject` |
634:| `wordCount` | `wordCount` |
635:| `keywords` | `tags[]` (해당 시) |

 succeeded in 797ms:
20:## 0. 한 페이지 요약
21:
22:- 필수 14종 + 선택 7종 = **21종 페이지 타입**.
23:- M0 Slice: **9종 + Article 1샘플 = 10개 페이지** (P-001·P-002·P-003·P-004·P-005·P-006·P-012·P-013·P-014 + P-010 1샘플).
24:- **P-014 LocationProfile(main)·P-013 LegalDocument는 어드민 화면 추가 없이 ClinicProfile 화면의 기관 정체성 + 본원 위치·연락·시간 입력 + Core 표준 템플릿으로 자동 생성** (SoT: 위치·시간·연락은 LocationProfile이 마스터). 단지점·다지점 통일 처리.
25:- High-risk commercial pages (P-101 Reviews · P-102 Pricing · P-104 News/Event 이벤트)는 Add-on 정책 기반 활성화.
26:- P-106 Self-test는 **Feature-backed optional page** — 페이지 타입은 정의하되 Feature Module이 콘텐츠·로직을 제공.
27:
28:---
29:
30:## 1. 페이지 타입 분류
31:
32:### 1.1 필수 타입 (Core 표준 14종)
33:
34:| ID | 페이지 타입 | URL 패턴 | 주 데이터 계약 | M0 |
35:|---|---|---|---|:---:|
36:| P-001 | Home | `/` | `ClinicProfile` (요약) | ✅ |
37:| P-002 | About | `/about` | `ClinicProfile` (전체) | ✅ |
38:| P-003 | Doctors List | `/doctors` | `DoctorProfile[]` | ✅ |
39:| P-004 | Doctor Profile | `/doctors/{slug}` | `DoctorProfile` | ✅ |
40:| P-005 | Treatments List | `/treatments` | `TreatmentPage[]` | ✅ |
41:| P-006 | Treatment Detail | `/treatments/{slug}` | `TreatmentPage` | ✅ |
42:| P-007 | Conditions List | `/conditions` | `MedicalConditionPage[]` | |
43:| P-008 | Condition Detail | `/conditions/{slug}` | `MedicalConditionPage` | |
44:| P-009 | Articles List | `/insights` 또는 `/blog` | `Article[]` | |
45:| P-010 | Article Detail | `/insights/{cat}/{slug}` | `Article` | ✅ (1샘플) |
46:| P-011 | FAQ | `/faq` | `FAQ[]` | |
47:| P-012 | Contact / Visit (Conversion Hub) | `/contact` | `ClinicProfile` + `LocationProfile[]` | ✅ |
48:| P-013 | Legal / Policy | `/privacy`, `/terms` 등 | `LegalDocument` | ✅ (자동 생성) |
49:| P-014 | Location / Branch Detail | `/locations/{slug}` | `LocationProfile` | ✅ (main 자동) |
50:
51:### 1.2 선택 타입 (7종)
52:
53:| ID | 페이지 타입 | URL 패턴 | 활성화 방식 | 비고 |
54:|---|---|---|---|---|
55:| P-101 | Reviews (후기) | `/reviews` | Add-on + ReviewPolicy | **High-risk commercial** |
56:| P-102 | Pricing (가격 안내) | `/pricing` | Add-on | **High-risk commercial** |
57:| P-103 | Facilities / Equipment | `/facilities` | Instance 결정 | 시설 신뢰도 |
58:| P-104 | News / Event | `/news` | Instance 결정 (이벤트 카테고리는 Add-on) | 이벤트 카테고리 High-risk |
59:| P-105 | Reservation | `/reservation` | Instance 결정 (Contact 통합 가능) | 전환 추적 단위 |
60:| P-106 | Self-test / Quiz | `/self-test/{slug}` | **Feature Module(`compliance-assistant` 또는 신규 `self-test-module`)이 콘텐츠·로직 제공** | Feature-backed optional page |
180:7. 논문·기고
181:8. 미디어 노출
182:9. 진료 철학·인사말
183:10. 작성한 인사이트 (Articles 백링크)
184:11. 예약·문의 CTA (해당 시)
185:
186:**헤딩 위계**: H1 "{Doctor Name} {직책}" / H2 "자격", "경력", "스토리", "학회·연구", "논문", "미디어", "인사이트"
187:**필수 블록**: 자격 / 경력 / 진료 분야
188:**선택 블록**: 개인 스토리 / 논문 / 미디어 / 작성한 글 / 인사말
189:**레이아웃 변형**: 좌사진·우본문 / 풀폭 헤더+본문 / 매거진형
190:**위험도 기본값**: Low
191:**컴플라이언스 주의**: 검증 가능한 자격·논문. 최상급 표현 금지. 개인 스토리에 효과 단정 금지.
192:**내부 링크 권장**: → Doctors List / Treatments (분야 일치) / 작성한 Articles
193:
194:### P-005. Treatments List
195:
196:**목적**: 시술·진료 영역 전체 노출.
197:**URL**: `/treatments`
198:**주 데이터 계약**: `TreatmentPage[]`
199:**Schema 요약**: BreadcrumbList + ItemList.
200:
201:**정보 슬롯**: 시술 카드(이름·간략 설명·대상) / 진료 분야 그룹(선택)
202:**헤딩 위계**: H1 "진료 안내" / H2 분야 그룹명
203:**필수 블록**: 시술 카드 그리드
204:**선택 블록**: 분야 필터
205:**레이아웃 변형**: 카드 / 탭 / 아코디언 / 풀스크린 스크롤
206:**위험도 기본값**: Low
207:**컴플라이언스 주의**: 시술명·간략 설명에 효과 단정·최상급 금지.
208:**내부 링크 권장**: → 각 Treatment Detail / Conditions
209:
210:### P-006. Treatment Detail
211:
212:**목적**: 개별 시술의 구조화 정보. AEO 핵심 페이지. 다이어트 한의원에는 가장 중요한 페이지.
213:**URL**: `/treatments/{slug}`
214:**주 데이터 계약**: `TreatmentPage`
215:**Schema 요약**: `MedicalProcedure` + BreadcrumbList + (FAQ 블록 시) `FAQPage`.
216:
217:**정보 슬롯**:
218:1. 시술명·요약 (1~2문장 핵심 답변)
219:2. 개요 (정의·목적)
220:3. 원리 (어떻게 작동)
221:4. 대상 (`recommendedFor[]` — 누구에게 적합) ⭐
222:5. **구성 요소** (`treatmentComponents[]`) — 한약·약침·고주파·체성분 검사·식단 관리 등 ⭐
223:6. **방문 흐름** (`visitFlow[]`) — 검사 → 상담 → 처방 → 관리 ⭐
224:7. 과정 (단계별)
225:8. **프로그램 변형** (`programVariants[]`) — 1개월/3개월/유지 등 ⭐
226:9. 소요 시간·횟수
227:10. **비대면 진료 가능 여부** (`remoteCareAvailable`) ⭐
228:11. 주의사항·금기증
229:12. 시술 후 관리
230:13. **유지·요요 방지 계획** (`maintenancePlan`) ⭐
231:14. **근거·논문 노트** (`evidenceNotes[]`) — 외부 검증 가능 자료 ⭐
232:15. 자주 묻는 질문
233:16. 담당 의료진 (백링크)
234:17. 관련 질환 (백링크)
235:18. 예약·문의 CTA
236:
237:> ⭐ = v0.5 신규 슬롯 (DATA_MODEL v0.4 TreatmentPage 신규 필드 연동)
238:
239:**헤딩 위계**: H1 시술명 / H2 "개요", "원리", "대상", "구성", "과정", "프로그램 안내", "주의사항", "시술 후 관리", "유지·관리", "자주 묻는 질문", "관련 의료진"
240:**필수 블록**: 개요 / 원리 / 대상 / 구성 / 과정 / 주의사항

 succeeded in 721ms:
345:### 4.3 페이지별 changefreq·priority 기본값
346:
347:| 페이지 타입 | changefreq | priority |
348:|---|---|---|
349:| P-001 Home | weekly | 1.0 |
350:| P-002 About | monthly | 0.8 |
351:| P-003 Doctors List | monthly | 0.7 |
352:| P-004 Doctor Profile | monthly | 0.7 |
353:| P-005 Treatments List | monthly | 0.8 |
354:| P-006 Treatment Detail | monthly | 0.8 |
355:| P-007 Conditions List | monthly | 0.6 |
356:| P-008 Condition Detail | monthly | 0.6 |
357:| P-009 Articles List | weekly | 0.6 |
358:| P-010 Article Detail | monthly | 0.5 |
359:| P-011 FAQ | monthly | 0.5 |
360:| P-012 Contact | yearly | 0.6 |
361:| P-013 Legal | yearly | 0.3 |

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\docs\\core\\CONTENT_STANDARDS.md'; "'$i=0; Get-Content $p | ForEach-Object { $i++; if(($i -ge 500 -and $i -le 535) -or ($i -ge 760 -and $i -le 785)){ '"'{0}:{1}' -f "'$i,$_ } }' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\docs\\compliance\\RISK_LEVELS.md'; "'$i=0; Get-Content $p | ForEach-Object { $i++; if($i -ge 20 -and $i -le 85){ '"'{0}:{1}' -f "'$i,$_ } }' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\docs\\decisions\\LOCATION_LEGAL_PLAN.md'; "'$i=0; Get-Content $p | ForEach-Object { $i++; if($i -ge 120 -and $i -le 175){ '"'{0}:{1}' -f "'$i,$_ } }' in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 722ms:
500:  location: { start: number; end: number };  // 본문 내 위치 (오프셋). LLM 제안에서 오프셋 산정 실패 시 { start: 0, end: 0 } (메타 의미)
501:  suggestion?: string;        // 대체 표현 (§ 4.2 참조)
502:  requiredApproverRoles?: ApproverRole[];  // 룰 단위 검수자 요구 (gate 룰만)
503:  // (v1.3 +) 출처 추적 메타 — features/compliance-assistant.md § 4.6
504:  triggeredBy?: "static-rule" | "inferred" | "explicit" | "llm-assist";
505:  llmAssistMeta?: { modelId: string; promptVersion: string; confidence: number };  // triggeredBy="llm-assist" 시
506:};
507:```
508:
509:### 7.3 빌드 검증 vs 어드민 검수
510:
511:| 단계 | 도구 | 처리 |
512:|---|---|---|
513:| 빌드 게이트 (CI) | 자체 룰 checker (§ 7.4 RiskRule 스키마 기반 정규식·키워드 매칭) | `buildBlocked=true` 시 빌드 차단 |
514:| 어드민 검수 | compliance-assistant LLM 보조 + 사람 검수 | `gateRequired=true` 항목 검토. ComplianceRecord(C-10) 인간 검수 기록 누적 → 어드민 워크플로가 최종 발행 가능 여부 결정 |
515:
516:### 7.4 RiskRule 데이터 스키마
517:
518:§ 4.1 의료광고 표현 룰의 컴퓨팅 표현. 자체 룰 checker·compliance-assistant 모두 본 스키마를 입력으로 받는다.
519:
520:```ts
521:// 단일 패턴 룰
522:type SimpleRiskRule = {
523:  id: string;                  // 안정 식별자 (예: "supremacy-001", "guarantee-001")
524:  category: string;            // § 4.1 카테고리
525:  pattern: string;             // 매칭 패턴 — patternType에 따라 의미 해석
526:  patternType: "regex" | "keyword" | "phrase";
527:  severity: "info" | "warning" | "fail" | "content-gate";
528:  scope: ContentScope[];       // 적용 범위 — § 7.4.1
529:  requiredApproverRoles?: ApproverRole[];  // severity="content-gate" 시 1개 이상 필수 (배열 — § 7.1.3과 정합)
530:  suggestion?: string;
531:  rationale?: string;
532:  legalBasis?: string[];       // 법령 조문 인용 식별자 (예: "medical-law-art56-para2-no8"). canonical RiskRule 1개에 복수 조문 매핑. `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` § 3.0 패턴
533:  exceptions?: string[];       // 예외 어구 (false-positive 방지)
534:  contextExceptions?: ContextException[];  // 안전·주의·행정 문맥 예외 — § 4.4
535:  version: string;

 succeeded in 737ms:
20:- **본 문서가 단일 SoT**: (1) RiskLevel 자동 추론 알고리즘, (2) RiskRule 데이터 파일 포맷, (3) ApproverRole 통과 기준(content-gate 발행 조건), (4) inlineRiskFlags 자동 추출 규칙
21:- **RiskLevel 3종**: `Low` / `Medium` / `High` — DATA_MODEL C-05 enum 그대로 사용
22:- **자동 추론 = MAX 결합**: 페이지 타입 기본 + ArticleType 기본 + 슬롯 격상 + inlineRiskFlags 격상 + explicitRiskLevel override의 **최대값**으로 최종 등급 결정
23:- **RiskRule 데이터 파일**: `data/compliance-rules/` 디렉토리, YAML 포맷, JSON Schema 검증, 의료법 개정 시 MAJOR 버전
24:- **content-gate 발행 조건 = AND 3종**: (a) `operator` 공통 필수(C-10 peerReviewer required) + (b) 등급 기본 요구(Medium/High면 `medical`) + (c) 룰 추가 요구(`requiredApproverRoles[]`) — 세 조건 모두 충족 + 각 역할의 ComplianceRecord 슬롯 기록 완료 + 본 문서 § 4 통과 기준 충족
25:- **inlineRiskFlags 5종**: `includes-effect-claim`·`includes-pricing`·`includes-event`·`includes-before-after`·`includes-testimonial` (DATA_MODEL C-04 정합)
26:
27:---
28:
29:## 1. 일반 규약
30:
31:### 1.1 변경 정책
32:
33:| 변경 유형 | 버전 영향 | 비고 |
34:|---|---|---|
35:| RiskLevel enum 변경 | **MAJOR** | DATA_MODEL C-05 cascade 필수 |
36:| 자동 추론 알고리즘 변경 (강화) | **MAJOR** | 기존 콘텐츠의 위험도 격상 가능 — 마이그레이션 가이드 필수 |
37:| 자동 추론 완화 | MINOR | 기존 콘텐츠 영향 없음 |
38:| RiskRule 추가 (warning/content-gate) | MINOR | |
39:| RiskRule 추가 (fail) | **MAJOR** | 빌드 차단 가능 |
40:| RiskRule 패턴 정정 (false-positive 감소) | PATCH | |
41:| 의료법 개정 대응 룰 갱신 | **MAJOR** | 본 문서 § 7.1 의료법 개정 추적 표 동시 갱신 |
42:| ApproverRole 통과 기준 변경 | **MAJOR** | 운영 정책 영향 |
43:
44:### 1.2 SoT 원칙
45:
46:- 본 문서는 **운영·구현 SoT** — `compliance-assistant` Feature Module과 어드민 검수 워크플로가 본 문서를 입력으로 받음
47:- 의료광고 **표현 룰의 카탈로그 SoT**는 `core/CONTENT_STANDARDS.md` § 4 — 본 문서는 카탈로그를 RiskRule 데이터 파일로 변환·운영하는 책임만
48:- 의료법 조문·사례 풍부화·인용 가능 외부 도메인 화이트리스트는 `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` 후속
49:
50:---
51:
52:## 2. RiskLevel — 정의·자동 추론
53:
54:### 2.1 RiskLevel enum
55:
56:`Low | Medium | High` — DATA_MODEL C-05 정의. 본 문서는 등급간 비교를 위해 정수 사상을 사용:
57:
58:```ts
59:const RISK_ORDER = { Low: 0, Medium: 1, High: 2 } as const;
60:// max(level1, level2) — 등급 결합 시 더 높은 등급 채택
61:```
62:
63:### 2.2 자동 추론 입력
64:
65:```ts
66:type RiskInferenceInput = {
67:  pageTypeId: PageTypeId;             // PAGE_TYPES § 3 — 페이지 기본 등급
68:  articleType?: ArticleType;          // P-010 Article일 때만. DATA_MODEL C-04 enum
69:  inlineRiskFlags: InlineRiskFlag[];  // 본문에서 자동 추출 (§ 5)
70:  slotMatches: SlotMatch[];           // PAGE_TYPES § 3 슬롯 격상 조건 매칭 결과
71:  explicitRiskLevel?: RiskLevel;      // CONTENT_STANDARDS § 7.1 ComplianceCheckInput.metadata.explicitRiskLevel — 어드민이 본 입력 슬롯에 명시한 override. 자동 추론 결과(ComplianceRecord.pageRiskLevel 출력)를 다시 본 입력으로 받지 않음 (순환 금지). 저장 SoT는 어드민의 입력 메타데이터 슬롯이며, 자동 추론 출력은 별도 (§ 6)
72:};
73:
74:type SlotMatch = {
75:  pageTypeId: PageTypeId;
76:  slotId: string;                     // PAGE_TYPES § 3 슬롯 ID (예: "P-006-content-results")
77:  triggeredLevel: RiskLevel;
78:};
79:```
80:
81:### 2.3 자동 추론 알고리즘
82:
83:```
84:1. base = PAGE_TYPES § 3에서 정의된 pageTypeId 기본 등급
85:2. if articleType: base = max(base, CONTENT_STANDARDS § 6 articleType 기본 등급)

 succeeded in 704ms:
120:  -- cycle1 LL-12 patch: risk_level NOT NULL + skeleton 단계 'Low' 만 허용 (compliance-assistant cascade 까지)
121:  CONSTRAINT legal_document_risk_level_skeleton_limit CHECK (risk_level = 'Low'),
122:  CONSTRAINT legal_document_instance_slug_unique UNIQUE (instance_id, slug),
123:  -- cycle1 LL-08 patch: partial UNIQUE — closed 5종만 instance 당 1개 강제. cookie/other 는 미강제 (LL-DEFER-12)
124:  CONSTRAINT legal_document_instance_id_unique UNIQUE (instance_id, id)
125:);
126:
127:CREATE UNIQUE INDEX legal_document_instance_5type_unique
128:  ON legal_document (instance_id, document_type)
129:  WHERE document_type IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint');
130:
131:CREATE INDEX legal_document_instance_idx ON legal_document (instance_id);
132:
133:ALTER TABLE legal_document ENABLE ROW LEVEL SECURITY;
134:ALTER TABLE legal_document FORCE ROW LEVEL SECURITY;
135:
136:CREATE POLICY tenant_isolation ON legal_document
137:  FOR ALL TO app_tenant_user
138:  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
139:  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
140:
141:GRANT SELECT, INSERT, UPDATE, DELETE ON legal_document TO app_tenant_user;
142:```
143:
144:**결정 사항**:
145:- (LL-SCHEMA-02 · cycle1 LL-08·LL-09 patch) **partial UNIQUE** — closed 5종 (`privacy`/`terms`/`non-covered`/`refund`/`complaint`) per instance UNIQUE. `cookie`/`other` 는 instance 당 N개 허용 (skeleton v0.2 UI 미제공 — LL-DEFER-12).
146:- (LL-SCHEMA-03 · cycle1 LL-03 patch) `status` CHECK `= 'draft'` — skeleton 단계 단일 상태만. `review-queued` 전이는 ComplianceRecord pre-publish row + NotificationEvent 발송과 함께만 작동 (compliance-assistant cascade — LL-DEFER-01).
147:- (LL-SCHEMA-04) `published_at` CHECK NULL — 발행 자체가 LL-DEFER-01.
148:- (LL-SCHEMA-05 · cycle1 LL-22 patch) `template_version` autoGenerated=true 일 때 NOT NULL. autoGenerated=false (수동 작성) 은 NULL 허용 — custom `documentType=other` 진입 시 namespace 충돌 회피.
149:- (LL-SCHEMA-06 · cycle1 LL-12 patch) `risk_level` NOT NULL + CHECK `= 'Low'` — skeleton 단계 Low 만 (compliance-assistant 의 RiskLevel 자동 추론 cascade 까지 변경 불가).
150:- (LL-SCHEMA-07) `revisions[]` 은 v0.2 column 미추가 (LL-DEFER-02). `metadata JSONB` 확장 여지만 남김.
151:
152:### 2.2 `clinic_profile` 정책 변수 + primaryCtas 컬럼 (LL-SCHEMA-08)
153:
154:```sql
155:-- packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql
156:
157:ALTER TABLE clinic_profile
158:  ADD COLUMN policy_contact_person TEXT,
159:  ADD COLUMN policy_contact_email TEXT,
160:  ADD COLUMN policy_contact_phone TEXT,
161:  ADD COLUMN policy_effective_date DATE,
162:  -- cycle1 LL-02 patch: primaryCtas SoT (admin/ARCH § 3.8.1 상속 경로 보존)
163:  ADD COLUMN primary_ctas JSONB NOT NULL DEFAULT '[]'::jsonb;
164:
165:ALTER TABLE clinic_profile
166:  ADD CONSTRAINT clinic_profile_policy_email_regex CHECK (
167:    policy_contact_email IS NULL
168:    OR policy_contact_email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
169:  ),
170:  -- cycle1 LL-20 patch: phone regex — 한국 02-1234-5678 · 010-1234-5678 · +82-2-1234-5678 (국제) · '.' 구분 미허용 · 'ext.' 미허용 (LL-FORM-12 명시)
171:  ADD CONSTRAINT clinic_profile_policy_phone_format CHECK (
172:    policy_contact_phone IS NULL
173:    OR policy_contact_phone ~ '^(\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}$'
174:  ),
175:  ADD CONSTRAINT clinic_profile_primary_ctas_array CHECK (

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"7\\.1\\.1|ContentType|FAQ|ArticleCategory|LegalDocument|Feature|contentType\" ..\\..\\docs\\core\\CONTENT_STANDARDS.md" in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 544ms:
57:| FAQ.answer | 50~300자 권장 (Q&A 블록은 답변 우선 1~2문장) |
102:6. P-011 FAQ의 경우 각 Q&A 블록 단위로 동일 알고리즘 — `<dl>/<dt>` 다음 `<dd>` 또는 H3 다음 paragraph
129:| Q&A 블록 | `<dl>` 또는 FAQPage schema | FAQ 리치 결과 |
154:- JSON-LD schema — 본문 Q&A 블록을 추출하여 별도 FAQPage 그래프 출력 (`SCHEMA_MAPPING` § 3 P-011 FAQPage 매핑). 렌더링 마크업과 schema 출력은 독립
265:| 전후사진 | P-101 Reviews + `ReviewPolicy.beforeAfterPhotoAllowed` | **기본 차단** (의료광고 위반 리스크 강). `beforeAfterPhotoAllowed=true`는 **법무 승인 후 예외적 허용** 플래그로만 동작 — 설정 시 해당 콘텐츠에 대한 `ComplianceRecord`(C-10, `contentType=ReviewPolicy` 또는 후기 콘텐츠 단위) 발행 필수 (`legalCounsel`·`legalCounselAt`·`attachments` 기록). 별도 ReviewPolicy 필드로 승인자·일자를 중복 보관하지 않음 (SoT는 ComplianceRecord) |
309:### 5.5 P-011 FAQ — 답변 단위 위험도
358:## 7. compliance-assistant Feature Module 인터페이스
360:본 Core는 표현 룰의 단일 SoT를 제공. 실제 자동 검수·LLM 분석은 `compliance-assistant` Feature Module이 본 표를 입력받아 처리.
366:  contentType: ContentType;           // DATA_MODEL C-10 ComplianceRecord.contentType enum (Core 닫힌 enum 유지)
367:  featureContentType?: FeatureContentTypeId;  // Feature-backed 콘텐츠 시 사용 — § 7.1.1
381:// - Core 콘텐츠: contentType 사용, featureContentType 미지정
382:// - Feature 콘텐츠: contentType="Feature"(C-10 enum cascade 1개 추가) + featureContentType 지정
385:#### 7.1.1 Feature contentType 식별 — `FeatureContentTypeId`
387:DATA_MODEL C-10 `ComplianceRecord.contentType` enum은 닫힌 enum으로 유지하되, Feature-backed 콘텐츠 식별을 위해 enum에 `Feature` 하나만 추가(cascade)하고 실제 구분은 별도 `featureContentType` 필드로 한다.
390:type FeatureContentTypeId = `feature:${FeatureSlug}`;  // kebab-case slug
391:type FeatureSlug = string;  // DATA_MODEL Slug 규약 — kebab-case (예: "self-test"). 정규식: ^[a-z][a-z0-9-]*[a-z0-9]$
394:| 영역 | contentType 값 | featureContentType 값 | 예시 |
396:| Core | C-10 토큰 | — (미지정) | `contentType="Article"` |
397:| Feature | `"Feature"` (C-10 cascade 1개) | `feature:<slug>` | `contentType="Feature"` + `featureContentType="feature:self-test"` (P-106) |
399:> P-105 ReservationPage는 Core 계약 C-20 — Feature namespace 아님. 본 namespace는 Core 계약 ID 미존재인 Feature 전용.
401:#### 7.1.1.1 ContentType 예외 — LegalDocument 면제 (LL-CASCADE-03 · LOCATION_LEGAL_PLAN v1.0 § 5)
403:LegalDocument(C-16)는 Core 표준 템플릿 + 변수 치환으로 자동 생성되는 정책 문서이므로 일반 콘텐츠 검증 룰이 부합하지 않는다. 다음 영역은 명시적으로 면제한다.
405:| 검증 영역 | LegalDocument 면제 사유 | 대체 보장 |
412:**변수 화이트리스트 검증은 별도 룰**: LegalDocument body 안 `{{...}}` 변수는 Core 측 `renderTemplate` 가 strict whitelist (11개 변수)로 검증하며 (LL-ACTION-12), unknown key 는 build-time test (`packages/core-content/src/templates/__tests__.ts`) 와 server action runtime 양쪽에서 차단한다. compliance-assistant Feature 의 검증 input 으로 LegalDocument 를 보내지 않는 것이 본 면제의 운영적 결정이며, compliance-assistant 의 `check()` 진입 자체를 운영 단계에서 차단한다.
414:**ComplianceRecord 발행 게이트는 면제 아님**: LegalDocument 도 발행 단계에서 ComplianceRecord (`legalCounsel`/`legalCounselAt` 필수 · admin/ARCHITECTURE § 3.8.2) 가 별도로 요구된다. 본 절은 자동 검수 룰의 면제일 뿐 법무 검토 게이트는 그대로 유지.
576:  | { type: "feature"; featureContentType: FeatureContentTypeId }  // P-106 등 Feature-backed 콘텐츠 전용 룰 (예: featureContentType="feature:self-test")
645:| ~~CS-C~~ | Feature-backed 콘텐츠 contentType cascade | v0.5 — DATA_MODEL C-10 enum에 `Feature` 토큰 1개 cascade 추가 + `featureContentType: feature:<slug>` 별도 필드로 세부 식별 (§ 7.1.1). Core enum의 기존 콘텐츠 토큰은 변경 없이 유지 |
655:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1) § 0 SoT 참조 § 5→§ 4 정정, (2) § 1.3 본문 길이 산정 기준 "1,000자(공백 제외)" + Markdown 정규화 알고리즘 명시 → CS-A 미결정 신설, (3) § 3.1 Q&A 렌더링(HTML `<dl>`)과 JSON-LD FAQPage schema 책임 분리, (4) § 3.1 Q&A 룰 fail/content-gate 분리 적용 (§ 4.1 직접 참조), (5)·(6) § 4.1 보장 표현 통합 fail + 수치/기간 단정(보장어 미포함) content-gate 분리, 유인성 표현(시간·수량 압박)과 할인·이벤트 사실 안내(법무 판정 영역) 분리, (7) § 4.2 "100% 효과" 대체 표현 — 효과 진술을 인용·통계 출처 동반으로만 한정 (치료경험담 위험 제거), (8) § 4.3·§ 5.6 환자 후기 — 의료법 제56조 직접 인용, 사전심의(제57조) 단정 표현 제거, 매체·방식별 법무 판정 명시, (9) § 4.3·§ 5.6 전후사진 — ReviewPolicy.beforeAfterPhotoAllowed 의미를 "법무 승인 후 예외적 허용 플래그"로 명확화, 승인자·일자 필수 기록 (CS-B 신설), (10) § 7.1 ContentType을 DATA_MODEL C-10 ComplianceRecord.contentType과 동일 enum 명시, (11) § 7.2 ComplianceCheckResult 인터페이스 확장 — buildBlocked/gateRequired/publishable/requiredApproverRole 분리, (12) § 7.4 RiskRule 스키마 신설 (id/category/pattern/patternType/severity/scope/requiredApproverRole/suggestion/rationale/exceptions/version) + ContentScope 5종 + CS-01 해소 |
659:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 잔재 정리 마감 (7개 지적 전건 수용)**: (1) **DATA_MODEL C-10 cascade 누락 정정** — `contentType` enum에 `Feature` 토큰 추가. `featureContentType` 필드도 함께 추가 (`feature:<slug>` 정규식 명시), (2) ApproverRole 중복 정의 제거 — ComplianceCheckResult 코드 블록의 중복 type 삭제. 단일 SoT는 § 7.1.3, (3) SimpleRiskRule `requiredApproverRole` 단수 잔재 → `requiredApproverRoles?: ApproverRole[]` 배열로 통일 (§ 7.2와 정합), (4) § 6 effect-result-related 표 — 기본 승인 역할 `["medical"]` 명시. 후기·사례·금액 결합 시 `legal` 추가 (§ 7.1.2 override와 정합), (5) ContentScope union에 `feature` 변형 추가 — Feature-backed 콘텐츠 전용 RiskRule 적용 가능, (6) § 0 한 페이지 요약 content-gate 정의 — § 8·SCHEMA_MAPPING § 7.3과 동일 통일 정의로 갱신 (schema 출력 승인 게이트 포함), (7) § 9.1 CS-C 해소 설명 정정 — DATA_MODEL C-10 enum `Feature` 토큰 cascade 정확히 기술. **다음 단계**: compliance/RISK_LEVELS.md 후속 + 자체 룰 checker 실제 구현 (CS-A·CS-D 영역) + admin 검수 워크플로 명세 + 그 발견을 본 문서에 되먹이기 |
660:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (12개 지적 전건 수용)**: (A) § 7.1 `featureContentType` 별도 필드 도입 — C-10 enum은 `Feature` 토큰 1개만 cascade 추가, 실제 구분은 namespace 필드로. (B) § 7.1.1 Feature 예시를 P-106 self-test로 정정 — P-105 ReservationPage는 Core C-20임을 명시. slug kebab-case 정규식(`^[a-z][a-z0-9-]*[a-z0-9]$`) 확정. (C) § 7.2 `findingsBySeverity` 키를 severity enum과 동일(`"content-gate"`)로 통일. (D) ApproverRole enum에 `client` 포함. (E) `requiredApproverRole` → `requiredApproverRoles: ApproverRole[]` 배열로. `review-case`는 `["medical", "legal"]` 기본값. 어드민 워크플로는 AND 조건으로 발행 게이트. (F) CompositeRiskRule `logic` enum 정밀화 — `AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR` 3종. (G) § 7.4.3 composite severity 4종 모두 허용으로 운영 규칙 정정. (H) ContentScope에 `featureContentType` 검증 흐름 (Feature contentType 입력 시) — 추후 검증기 구현. (9) § 3.5 인용 면제는 § 3.5 content-gate에만 적용 — § 4.1 fail 룰은 절대 완화 안 됨 명시. (10) § 4.3 가격·할인·이벤트 — P-102·P-104·P-010(`articleType=event-price`) cross-reference 명시. (11) **DATA_MODEL cascade — C-04 Article.body 권장 길이 "최소 300단어" → "최소 1,000자(공백 제외). CONTENT_STANDARDS § 1.3 SoT"** 정정. (12) § 8 content-gate 정의를 SCHEMA_MAPPING § 7.3과 통일 — schema 출력 승인 게이트 포함 |
661:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
662:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (8개 지적 전건 수용)**: (A) § 5.7 P-102 룰 일관화 — 압박형 유인 표현 fail / 단순 할인·이벤트 사실 안내 content-gate, (B) § 4.1 전문성 단정 룰 분리 — 단독 어휘는 content-gate / 효과·결과·보장 결합은 fail. § 7.4.2 severity 우선순위 (fail > content-gate > warning > info) + § 7.4.3 문맥 결합 룰(composite) 신설, (C) § 4.3 전후사진 법무 승인 기록 — ReviewPolicy 별도 필드 대신 ComplianceRecord(C-10) 단일 SoT 책임 이관 (CS-B 해소), (D) § 6 ArticleType 표 — RiskLevel과 룰 severity 별도 축 명시. High = 어드민 검수 큐 강제 진입 트리거, (E) § 6 review-case "사전심의 대상" 단정 제거 — 의료법 제56조 + 매체·방식별 법무 판정 (§ 4.3·§ 5.6 정합), (F) § 7.2 ComplianceCheckResult — `publishable` 제거. 자동 검수는 `automatedDecision`(block/gate/warn/pass)·buildBlocked·gateRequired·hasWarnings·findingsBySeverity까지만 책임. 최종 발행 가능 여부는 어드민 워크플로 + ComplianceRecord(C-10) 결합 판정, (G) § 7.2 warning 검토 큐 표현 — hasWarnings·findingsBySeverity 추가, (H) § 7.1 contentType enum에 SelfTest 등 Feature-backed 콘텐츠 cascade 필요성 명시 (CS-C 신설) |

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\docs\\core\\CONTENT_STANDARDS.md'; "'$i=0; Get-Content $p | ForEach-Object { $i++; if(($i -ge 90 -and $i -le 110) -or ($i -ge 309 -and $i -le 330) -or ($i -ge 385 -and $i -le 414)){ '"'{0}:{1}' -f "'$i,$_ } }' in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 633ms:
90:```
91:
92:#### 2.1.1 answer-first 검사 대상 (Markdown AST)
93:
94:빌드 checker가 "본문 시작"을 판정하는 정확한 알고리즘:
95:
96:1. Frontmatter 영역 제외 (YAML/TOML 헤더)
97:2. 페이지의 `<main>` 또는 첫 H1 노드 이후 영역만 대상
98:3. 다음 노드 종류는 **스킵** (메타·구조 노드):
99:   - TOC(목차), 이미지 단독 블록(`<figure>`/`<img>` 단독), 콜아웃(`info`/`warning`/`disclaimer`), 인용·근거 블록, summary 필드 출력 영역, 임베디드 미디어, 표 단독
100:4. 첫 번째 **본문 텍스트 블록**(Markdown AST에서 `paragraph` 또는 `<p>` 노드)을 "본문 시작"으로 채택
101:5. 해당 블록의 첫 1~2 문장(KSS·문장 분리 기준) — 효과 단정 키워드 미포함 + 페이지 본질 질문과 관련된 텍스트 포함 여부 판정
102:6. P-011 FAQ의 경우 각 Q&A 블록 단위로 동일 알고리즘 — `<dl>/<dt>` 다음 `<dd>` 또는 H3 다음 paragraph
103:
104:> Markdown AST 파서는 remark/mdast 또는 동등 도구. 정확한 라이브러리 채택은 자체 룰 checker 구현 시 결정 (CS-A 영역).
105:
106:### 2.2 헤딩 위계 (`PAGE_TYPES.md` § 2.1 정합)
107:
108:- **H1 페이지당 1개**. 페이지 주제 명시
109:- H2는 주요 섹션 — 명사형 또는 **질문형** (AEO 친화)
110:- H3은 H2 하위 세부 단위
309:### 5.5 P-011 FAQ — 답변 단위 위험도
310:
311:- 답변마다 위험도 등급 부여 (`PAGE_TYPES.md` § 3 P-011)
312:- 효과·결과 관련 답변 → High → content-gate
313:
314:### 5.6 P-101 Reviews — High-risk commercial
315:
316:- 의료법 제56조 치료경험담 광고 금지 적용 — 사이트 게재 자체가 광고 해당 여부는 매체·방식별 법무 판정. 사전심의(제57조) 의무 여부도 별도 판정
317:- 후기 텍스트의 § 4.1 fail 표현은 자동 fail. content-gate 표현은 검수 큐 진입
318:- 전후사진은 기본 차단 — `ReviewPolicy.beforeAfterPhotoAllowed=true` + 법무 승인 기록 시에만 예외 발행
319:
320:### 5.7 P-102 Pricing — High-risk commercial
321:
322:- § 4.1 룰 일관 적용 — "최저가"·압박형 유인 표현(지금만·특가·한정·선착순)은 fail
323:- "할인·이벤트" 단순 사실 고지(예: "20% 할인 진행")는 content-gate — 법무 검수 후 발행
324:- 비급여 명시 필수
325:- 가격 변경 시 즉시 갱신
326:
327:### 5.8 P-104 News/Event — 이벤트 카테고리만 High
328:
329:- 일반 소식(휴진·이전·인사) Low
330:- 이벤트·할인 카테고리 → 자동 High → compliance-assistant 검수 필수
385:#### 7.1.1 Feature contentType 식별 — `FeatureContentTypeId`
386:
387:DATA_MODEL C-10 `ComplianceRecord.contentType` enum은 닫힌 enum으로 유지하되, Feature-backed 콘텐츠 식별을 위해 enum에 `Feature` 하나만 추가(cascade)하고 실제 구분은 별도 `featureContentType` 필드로 한다.
388:
389:```ts
390:type FeatureContentTypeId = `feature:${FeatureSlug}`;  // kebab-case slug
391:type FeatureSlug = string;  // DATA_MODEL Slug 규약 — kebab-case (예: "self-test"). 정규식: ^[a-z][a-z0-9-]*[a-z0-9]$
392:```
393:
394:| 영역 | contentType 값 | featureContentType 값 | 예시 |
395:|---|---|---|---|
396:| Core | C-10 토큰 | — (미지정) | `contentType="Article"` |
397:| Feature | `"Feature"` (C-10 cascade 1개) | `feature:<slug>` | `contentType="Feature"` + `featureContentType="feature:self-test"` (P-106) |
398:
399:> P-105 ReservationPage는 Core 계약 C-20 — Feature namespace 아님. 본 namespace는 Core 계약 ID 미존재인 Feature 전용.
400:
401:#### 7.1.1.1 ContentType 예외 — LegalDocument 면제 (LL-CASCADE-03 · LOCATION_LEGAL_PLAN v1.0 § 5)
402:
403:LegalDocument(C-16)는 Core 표준 템플릿 + 변수 치환으로 자동 생성되는 정책 문서이므로 일반 콘텐츠 검증 룰이 부합하지 않는다. 다음 영역은 명시적으로 면제한다.
404:
405:| 검증 영역 | LegalDocument 면제 사유 | 대체 보장 |
406:|---|---|---|
407:| answer-first AST | 정책 문서는 첫 문장 답 제시 구조가 아니라 조문·항목 구조 | 본문 자체는 법무 검토를 거친 Core 표준 템플릿 (LL-TEMPLATE-04) |
408:| 표현 검사 (recommend/best 등 광고 표현) | 정책 문서에는 광고 의도가 없음 | 동일 — Core 표준 템플릿 본문 |
409:| RiskRule 적용 (`riskRules: RiskRule[]`) | 정책 문서는 위험도 자동 추론 대상이 아님 | `risk_level='Low'` CHECK + 법무 검토 별도 게이트 (RISK_LEVELS § 4.3 의료법 광고 룰 우회) |
410:| RiskInference (`inferredRiskLevel`) | 위와 동일 | DB CHECK `risk_level='Low'` 강제 (LL-SCHEMA-06) |
411:
412:**변수 화이트리스트 검증은 별도 룰**: LegalDocument body 안 `{{...}}` 변수는 Core 측 `renderTemplate` 가 strict whitelist (11개 변수)로 검증하며 (LL-ACTION-12), unknown key 는 build-time test (`packages/core-content/src/templates/__tests__.ts`) 와 server action runtime 양쪽에서 차단한다. compliance-assistant Feature 의 검증 input 으로 LegalDocument 를 보내지 않는 것이 본 면제의 운영적 결정이며, compliance-assistant 의 `check()` 진입 자체를 운영 단계에서 차단한다.
413:
414:**ComplianceRecord 발행 게이트는 면제 아님**: LegalDocument 도 발행 단계에서 ComplianceRecord (`legalCounsel`/`legalCounselAt` 필수 · admin/ARCHITECTURE § 3.8.2) 가 별도로 요구된다. 본 절은 자동 검수 룰의 면제일 뿐 법무 검토 게이트는 그대로 유지.

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'src\\app\\(admin)\\admin\\[instanceSlug]\\articles\\actions.ts'; "'$i=0; Get-Content $p | ForEach-Object { $i++; if(($i -ge 1 -and $i -le 30) -or ($i -ge 90 -and $i -le 190)){ '"'{0}:{1}' -f "'$i,$_ } }' in C:\Users\assag\solution\website-exposure\apps\web
2026-05-18T06:23:07.559889Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.7 seconds
Output:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … min\[instanceSlug]\articles\actions.ts'; $i=0; [36;1mGet-Content $p[0m | ForEa …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                  ~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path src\app\(admin)\admin\[instanceSlug]\articles\actions.ts does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

 exited 1 in 670ms:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … min\[instanceSlug]\articles\actions.ts'; $i=0; [36;1mGet-Content $p[0m | ForEa …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                  ~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path src\app\(admin)\admin\[instanceSlug]\articles\actions.ts does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'src\\app\\(admin)\\admin\\[instanceSlug]\\articles\\actions.ts'; "'$i=0; Get-Content -LiteralPath $p | ForEach-Object { $i++; if(($i -ge 1 -and $i -le 30) -or ($i -ge 90 -and $i -le 190)){ '"'{0}:{1}' -f "'$i,$_ } }' in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 577ms:
1:// @glitzy/web/(admin)/[instanceSlug]/articles/actions
2:// cycle1-3entity patch: WEB-01·04·06·08·10·15
3:
4:"use server";
5:
6:import { revalidatePath } from "next/cache";
7:import { notFound, redirect } from "next/navigation";
8:import { z } from "zod";
9:import { emitAuditEvent, TenantResolveError } from "@glitzy/auth";
10:import { UUID_V4_REGEX } from "@glitzy/shared-types";
11:
12:import { getSqlBase } from "@/lib/db";
13:import { isNextControlFlowError, resolveActionContext, assertActionEligibility } from "@/lib/action-context";
14:import { withSkeletonTx } from "@/lib/tenant";
15:import { mapDbErrorToResult } from "@/lib/errors";
16:import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
17:import type { SaveResult } from "@/lib/save-result";
18:
19:const PUBLICATION_STATUSES = [
20:  "draft", "review-queued", "in-review", "approved", "publishable",
21:  "published", "blocked", "rejected", "stale",
22:] as const;
23:const RISK_LEVELS = ["Low", "Medium", "High"] as const;
24:
25:const InputSchema = z.object({
26:  slug: z
27:    .string({ required_error: "slug 는 필수입니다." })
28:    .transform((v) => v.trim())
29:    .refine((v) => /^[a-z0-9][a-z0-9-]{2,99}$/.test(v), {
30:      message: "slug 는 3~100자 (소문자/숫자/하이픈)",
90:      fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
91:    }
92:    return { ok: false, fieldErrors };
93:  }
94:
95:  const aCtx = await resolveActionContext(instanceSlug);
96:  const sqlBase = getSqlBase();
97:
98:  try {
99:    const txResult = await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
100:      assertActionEligibility(ctx, "operator-edit-content");
101:
102:      const isPublished = parsed.data.status === "published";
103:
104:      // cycle5-3entity WEB-49: edit path 는 article row 를 먼저 FOR UPDATE 로 잠근 뒤 currentAuthorId 추출
105:      let currentAuthorId: string | null = null;
106:      let beforePublishedAt: Date | null = null;
107:      if (originalSlug !== null) {
108:        const beforeRows = await tx<{ id: string; published_at: Date | null; author_doctor_id: string | null }[]>`
109:          SELECT id, published_at, author_doctor_id FROM article
110:           WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
111:           FOR UPDATE
112:        `;
113:        if (beforeRows.length === 0) return { ok: false as const, action: "notfound" as const };
114:        currentAuthorId = beforeRows[0]!.author_doctor_id;
115:        beforePublishedAt = beforeRows[0]!.published_at;
116:      }
117:
118:      // cycle2-3entity WEB-19 + cycle5 WEB-49: authorDoctorId 검증 (locked row 의 currentAuthorId 기준)
119:      if (parsed.data.authorDoctorId) {
120:        const doctorRows = await tx<{ id: string; active: boolean }[]>`
121:          SELECT id, active FROM doctor_profile
122:           WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${parsed.data.authorDoctorId}::uuid
123:           LIMIT 1
124:        `;
125:        if (doctorRows.length === 0) {
126:          return { ok: false as const, action: "author-not-found" as const };
127:        }
128:        const d = doctorRows[0]!;
129:        if (!d.active && d.id !== currentAuthorId) {
130:          return { ok: false as const, action: "author-inactive" as const };
131:        }
132:      }
133:
134:      if (originalSlug !== null) {
135:        const newPublishedAt = isPublished ? (beforePublishedAt ?? new Date()) : null;
136:        await tx`
137:          UPDATE article
138:             SET slug = ${parsed.data.slug},
139:                 title = ${parsed.data.title},
140:                 summary = ${parsed.data.summary},
141:                 body_markdown = ${parsed.data.bodyMarkdown},
142:                 status = ${parsed.data.status}::content_publication_status,
143:                 risk_level = ${parsed.data.riskLevel ? parsed.data.riskLevel : null}::risk_level,
144:                 hero_image_url = ${parsed.data.heroImageUrl ?? null},
145:                 author_doctor_id = ${parsed.data.authorDoctorId ?? null}::uuid,
146:                 published_at = ${newPublishedAt},
147:                 updated_at = now()
148:           WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${originalSlug}
149:        `;
150:        return { ok: true as const, ctx, slug: parsed.data.slug, mode: "update" as const };
151:      }
152:
153:      await tx`
154:        INSERT INTO article (
155:          instance_id, slug, title, summary, body_markdown, status, risk_level, hero_image_url, author_doctor_id, published_at
156:        ) VALUES (
157:          ${ctx.instanceId}::uuid,
158:          ${parsed.data.slug},
159:          ${parsed.data.title},
160:          ${parsed.data.summary},
161:          ${parsed.data.bodyMarkdown},
162:          ${parsed.data.status}::content_publication_status,
163:          ${parsed.data.riskLevel ? parsed.data.riskLevel : null}::risk_level,
164:          ${parsed.data.heroImageUrl ?? null},
165:          ${parsed.data.authorDoctorId ?? null}::uuid,
166:          ${isPublished ? new Date() : null}
167:        )
168:      `;
169:      return { ok: true as const, ctx, slug: parsed.data.slug, mode: "insert" as const };
170:    });
171:
172:    if (txResult.ok === false) {
173:      if (txResult.action === "notfound") notFound();
174:      if (txResult.action === "author-not-found") {
175:        return { ok: false, fieldErrors: { authorDoctorId: ["해당 의료진을 찾을 수 없습니다."] } };
176:      }
177:      if (txResult.action === "author-inactive") {
178:        return { ok: false, fieldErrors: { authorDoctorId: ["비활성 의료진은 신규 저자로 지정할 수 없습니다."] } };
179:      }
180:    }
181:    if (txResult.ok === true) {
182:      try {
183:        await emitAuditEvent(sqlBase, {
184:          eventType: "content-saved",
185:          actorUserId: txResult.ctx.userId,
186:          targetUserId: txResult.ctx.userId,
187:          toInstanceId: txResult.ctx.instanceId,
188:          payload: { contentType: "Article", slug: txResult.slug, mode: txResult.mode, status: parsed.data.status, originalSlug },
189:        });
190:      } catch (auditErr) {

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'src\\app\\(admin)\\admin\\[instanceSlug]\\articles\\actions.ts'; "'$i=0; Get-Content -LiteralPath $p | ForEach-Object { $i++; if($i -ge 190 -and $i -le 235){ '"'{0}:{1}' -f "'$i,$_ } }' in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 570ms:
190:      } catch (auditErr) {
191:        console.error("[saveArticle] audit emit failed", auditErr);
192:      }
193:      revalidatePath(`/admin/${instanceSlug}/articles`);
194:      revalidatePath(`/admin/${instanceSlug}/articles/${txResult.slug}`);
195:      if (originalSlug !== null && originalSlug !== txResult.slug) {
196:        revalidatePath(`/admin/${instanceSlug}/articles/${originalSlug}`);
197:      }
198:      revalidatePath(`/admin/${instanceSlug}`);
199:      if (originalSlug === null || originalSlug !== txResult.slug) {
200:        redirect(`/admin/${instanceSlug}/articles/${txResult.slug}`);
201:      }
202:      return { ok: true, slug: txResult.slug };
203:    }
204:    return { ok: false, fieldErrors: {}, formError: "저장에 실패했습니다." };
205:  } catch (err) {
206:    if (isNextControlFlowError(err)) throw err;
207:    const mapped = mapDbErrorToResult(err);
208:    if (mapped !== null) {
209:      if (mapped.kind === "field") return { ok: false, fieldErrors: mapped.errors };
210:      return { ok: false, fieldErrors: {}, formError: mapped.message };
211:    }
212:    if (err instanceof TenantResolveError) {
213:      const action = mapAuthDenyReasonToUi(err.reason);
214:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
215:      if (action.kind === "not-found") notFound();
216:      if (action.kind === "forbidden") return { ok: false, fieldErrors: {}, formError: action.message };
217:      // cycle5-3entity WEB-52: info branch 도 formError 로 처리 (doctor/treatment 와 일관)
218:      if (action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
219:    }
220:    console.error("[saveArticle] unexpected", err);
221:    return { ok: false, fieldErrors: {}, formError: "저장 중 알 수 없는 오류가 발생했습니다." };
222:  }
223:}
224:
225:export async function deleteArticle(instanceSlug: string, slug: string): Promise<DeleteResult> {
226:  const aCtx = await resolveActionContext(instanceSlug);
227:  const sqlBase = getSqlBase();
228:
229:  try {
230:    const result = await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (tx, ctx) => {
231:      assertActionEligibility(ctx, "operator-edit-content");
232:      const deleted = await tx<{ id: string }[]>`
233:        DELETE FROM article
234:         WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${slug}
235:         RETURNING id

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'src\\app\\(admin)\\admin\\[instanceSlug]\\articles\\actions.ts'; "'$i=0; Get-Content -LiteralPath $p | ForEach-Object { $i++; if($i -ge 235 -and $i -le 280){ '"'{0}:{1}' -f "'$i,$_ } }' in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 628ms:
235:         RETURNING id
236:      `;
237:      return { deleted: deleted.length };
238:    });
239:
240:    if (result.deleted === 0) {
241:      return { ok: false, formError: "해당 아티클이 이미 삭제되었습니다." };
242:    }
243:
244:    try {
245:      await emitAuditEvent(sqlBase, {
246:        eventType: "content-deleted",
247:        actorUserId: aCtx.userId,
248:        targetUserId: aCtx.userId,
249:        toInstanceId: aCtx.instanceId,
250:        payload: { contentType: "Article", slug },
251:      });
252:    } catch (err) {
253:      console.error("[deleteArticle] audit emit failed", err);
254:    }
255:
256:    revalidatePath(`/admin/${instanceSlug}/articles`);
257:    revalidatePath(`/admin/${instanceSlug}/articles/${slug}`);
258:    revalidatePath(`/admin/${instanceSlug}`);
259:    redirect(`/admin/${instanceSlug}/articles`);
260:  } catch (err) {
261:    if (isNextControlFlowError(err)) throw err;
262:    if (err instanceof TenantResolveError) {
263:      const action = mapAuthDenyReasonToUi(err.reason);
264:      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
265:      if (action.kind === "not-found") notFound();
266:      if (action.kind === "forbidden") return { ok: false, formError: action.message };
267:      // cycle5-3entity WEB-52: info branch 처리 (delete path)
268:      if (action.kind === "info") return { ok: false, formError: action.message };
269:    }
270:    const mapped = mapDbErrorToResult(err);
271:    if (mapped !== null && mapped.kind === "form") return { ok: false, formError: mapped.message };
272:    console.error("[deleteArticle] unexpected", err);
273:    return { ok: false, formError: "삭제 중 오류가 발생했습니다." };
274:  }
275:}

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'src\\lib\\json-ld\\__tests__\\validate.ts'; "'$i=0; Get-Content -LiteralPath $p | ForEach-Object { $i++; if($i -ge 1 -and $i -le 135){ '"'{0}:{1}' -f "'$i,$_ } }' in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 604ms:
1:// @glitzy/web/lib/json-ld/__tests__/validate — 자체 JSON-LD rule checker (LOCAL_PASS)
2:// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 5.4 PSR-SEO-14 (cycle1 PSR-17 — 외부 validator manual QA)
3://
4:// 통과 기준:
5://   1. JSON parse OK
6://   2. @context = "https://schema.org" + @graph 배열
7://   3. @id 유일 (graph 안 중복 없음)
8://   4. cross-reference 무결성 — `{ "@id": "..." }` 참조가 그래프 안 entity @id 또는 외부 dereferenceable URL
9://   5. 페이지 타입별 expected entities 존재 (SCHEMA_MAPPING § 2.5 정합)
10:
11:import type { JsonLdGraph, JsonLdEntity } from "../types";
12:
13:export type ValidationResult =
14:  | { ok: true }
15:  | { ok: false; errors: string[] };
16:
17:// PSRC-06 / PSRC-16 / PSRC-18 patch:
18://   1. inline minimal 객체 (`@id` + `@type` + 추가 필드) 는 self-contained inline 으로 인정 (검사 제외).
19://   2. pure ref (`@id` 만 있는 객체) 는 graph entity 또는 cross-page reference allowlist 또는 외부 origin URL.
20://   3. cross-page reference allowlist: `${siteBaseUrl}/#organization` · `/#website` · `/#clinic` —
21://      SCHEMA_MAPPING § 2.5 "참조만" 페이지의 cross-page ref 패턴 (PSRC-16 patch).
22:
23:const CROSS_PAGE_REF_FRAGMENTS = new Set(["organization", "website", "clinic"]);
24:
25:// PSRC-20 patch: tenant base path 까지 비교 — multi-tenant 환경에서 다른 path tenant 의 fragment 가 통과되지 않도록.
26://   v0.1 path-based SoT 의 `https://<host>/<instanceSlug>/#fragment` 패턴 정합.
27:function isCrossPageRef(ref: string, siteBaseUrl: string | null): boolean {
28:  if (!siteBaseUrl) return false;
29:  try {
30:    const u = new URL(ref);
31:    const base = new URL(siteBaseUrl);
32:    if (u.origin !== base.origin) return false;
33:    // base pathname (예: `/glitzy-clinic`) 와 ref pathname 의 tenant root 일치 검사.
34:    // ref 는 `<base.pathname>/#fragment` 또는 `<base.pathname><path>#fragment` 형태.
35:    const basePath = base.pathname.replace(/\/$/, "");
36:    const refPath = u.pathname.replace(/\/$/, "");
37:    if (refPath !== basePath && !refPath.startsWith(`${basePath}/`)) return false;
38:    if (!u.hash.startsWith("#")) return false;
39:    return CROSS_PAGE_REF_FRAGMENTS.has(u.hash.slice(1));
40:  } catch {
41:    return false;
42:  }
43:}
44:
45:// PSRC-20 patch: same-origin 검사도 tenant base path 까지 비교.
46:function isSameTenantUrl(ref: string, siteBaseUrl: string | null): boolean {
47:  if (!siteBaseUrl) return false;
48:  try {
49:    const u = new URL(ref);
50:    const base = new URL(siteBaseUrl);
51:    if (u.origin !== base.origin) return false;
52:    const basePath = base.pathname.replace(/\/$/, "");
53:    const refPath = u.pathname.replace(/\/$/, "");
54:    return refPath === basePath || refPath.startsWith(`${basePath}/`);
55:  } catch {
56:    return false;
57:  }
58:}
59:
60:export function validateJsonLdGraph(graph: unknown, opts: { siteBaseUrl?: string } = {}): ValidationResult {
61:  const errors: string[] = [];
62:
63:  // (1)(2) shape
64:  if (typeof graph !== "object" || graph === null) return { ok: false, errors: ["graph must be object"] };
65:  const g = graph as Record<string, unknown>;
66:  if (g["@context"] !== "https://schema.org") errors.push("@context must be https://schema.org");
67:  const arr = g["@graph"];
68:  if (!Array.isArray(arr)) {
69:    return { ok: false, errors: [...errors, "@graph must be array"] };
70:  }
71:
72:  const siteBaseUrl = opts.siteBaseUrl ?? null;
73:
74:  // (3) @id 유일
75:  const ids = new Set<string>();
76:  const idMap = new Map<string, JsonLdEntity>();
77:  for (const ent of arr) {
78:    if (typeof ent !== "object" || ent === null) {
79:      errors.push("entity must be object");
80:      continue;
81:    }
82:    const e = ent as Record<string, unknown>;
83:    if (typeof e["@type"] !== "string") errors.push(`entity missing @type`);
84:    if (typeof e["@id"] !== "string") errors.push(`entity missing @id`);
85:    if (typeof e["@id"] === "string") {
86:      if (ids.has(e["@id"])) errors.push(`duplicate @id: ${e["@id"]}`);
87:      ids.add(e["@id"]);
88:      idMap.set(e["@id"], e as JsonLdEntity);
89:    }
90:  }
91:
92:  // (4) cross-reference — pure ref `{ "@id": "..." }` 만 검사 (inline `{@id, @type, ...}` 객체는 self-contained).
93:  //   PSRC-18 patch: `@type` 존재 시 inline minimal entity 로 간주 (검사 제외, recurse 만).
94:  //   PSRC-16 patch: cross-page reference allowlist (`#organization`/`#website`/`#clinic`) 는 graph entity 미존재 OK.
95:  function checkRefs(value: unknown, path: string): void {
96:    if (typeof value !== "object" || value === null) return;
97:    if (Array.isArray(value)) {
98:      value.forEach((v, i) => checkRefs(v, `${path}[${i}]`));
99:      return;
100:    }
101:    const v = value as Record<string, unknown>;
102:    const hasId = typeof v["@id"] === "string";
103:    const hasType = typeof v["@type"] === "string";
104:    if (hasId && !hasType) {
105:      // pure ref
106:      const ref = v["@id"] as string;
107:      if (!ids.has(ref) && !isCrossPageRef(ref, siteBaseUrl)) {
108:        const refOrigin = tryOrigin(ref);
109:        const siteOrigin = siteBaseUrl ? tryOrigin(siteBaseUrl) : null;
110:        if (refOrigin === null) {
111:          errors.push(`unresolved reference at ${path}: ${ref}`);
112:        } else if (siteOrigin && refOrigin === siteOrigin) {
113:          // PSRC-21 patch: same-origin (cross-tenant 포함) 은 dereferenceable 예외에서 제외 — graph entity 또는 cross-page allowlist 필수.
114:          if (isSameTenantUrl(ref, siteBaseUrl)) {
115:            errors.push(`unresolved same-tenant reference at ${path}: ${ref}`);
116:          } else {
117:            errors.push(`cross-tenant reference forbidden at ${path}: ${ref}`);
118:          }
119:        }
120:        // 진짜 외부 origin URL → dereferenceable 예외 (통과)
121:      }
122:    }
123:    for (const [k, vv] of Object.entries(v)) {
124:      if (k === "@type" || k === "@id") continue;
125:      checkRefs(vv, `${path}.${k}`);
126:    }
127:  }
128:  arr.forEach((ent, i) => checkRefs(ent, `@graph[${i}]`));
129:
130:  return errors.length === 0 ? { ok: true } : { ok: false, errors };
131:}
132:
133:function tryOrigin(url: string): string | null {
134:  try {
135:    return new URL(url).origin;

codex
# EAT_CONTENT_PLAN v0.1 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=7 major=10 minor=5 (총 22)
- closeableAfterPatch: false

## blocking

- **ECP-01**: C-25/26/27 번호가 DATA_MODEL 인벤토리와 불일치
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:112`, `:174`, `:232`, `:590`
  - 근거(SoT): `docs/core/DATA_MODEL.md:19` “C-01~C-23”, `:56-57` C-22 ArticleCategory, C-23 AdminUser
  - 문제: plan은 C-25/26/27을 신설하면서 `23 → 26 contracts`라고 하지만 C-24가 정의되지 않았다. 신규 3개면 C-24/25/26이거나, C-24 예약 사유를 DATA_MODEL §1.1에 명시해야 한다.
  - 권장 patch: C-24 미사용/예약 여부를 결정하고, 인벤토리·본문 번호·cascade marker를 한 번에 정정.

- **ECP-02**: C-22 ArticleCategory를 “신규 table”로 재정의하면서 기존 C-22 풀명세와 충돌
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:72-110`
  - 근거(SoT): `docs/core/DATA_MODEL.md:56` C-22는 이미 ArticleCategory, `:917-926` 필드 `@id`, `name 1~50`, `pillar`, `parentCategory`, `coverImageUrl`, `seoMeta`, `articleTypeDefault`
  - 문제: plan의 DB 모델은 `name 1~100`, `metadata`만 두고 기존 C-22 필드 다수를 누락한다. `parent_id 없음` 결정도 SoT의 `parentCategory optional`과 충돌한다.
  - 권장 patch: EC-SCHEMA-01을 “C-22 DB 구현”으로 바꾸고, DATA_MODEL C-22를 flat 1-level로 정정할지 DB에 SoT 필드를 반영할지 결정.

- **ECP-03**: Article.category required SoT인데 DB는 nullable로 남음
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:290-302`
  - 근거(SoT): `docs/core/DATA_MODEL.md:480-482` Article `articleType`, `contentFormat`, `category Ref<C-22>` required
  - 문제: `ALTER TABLE article ADD COLUMN category_id UUID;` 뒤 `NOT NULL` 또는 publish-time CHECK가 없다. backfill 스크립트가 있어도 신규 row는 category 없이 저장 가능하다.
  - 권장 patch: backfill 후 `ALTER COLUMN category_id SET NOT NULL`을 같은 migration에 포함하거나, staged migration이면 acceptance에 `NOT NULL` 전환 단계를 명시.

- **ECP-04**: manifest “14 단계” 산술과 의존성 cascade가 틀림
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:524`, `:595`
  - 근거(SoT): `packages/migrations-runner/src/manifest.ts:102-126` 현 manifest는 D0011 포함 10단계, D0011은 마지막 정책 migration
  - 문제: plan은 C0009~C0013 5개 + D0014 1개를 추가하면서 “10 → 14, +4”라고 쓴다. 실제로는 10 → 16이다. D0014는 C0009~C0013 모두 이후여야 한다.
  - 권장 patch: manifest 목표를 16단계로 정정하고, D0014 `dependsOn`에 `article_category`, `publication`, `media_appearance`, `faq`, `article.category_id`를 명시.

- **ECP-05**: MediaAppearance JSON-LD 분기 결정이 서로 충돌
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:229`, `:412-413`, `:455-468`
  - 근거(SoT): `docs/core/SCHEMA_MAPPING.md:149-154` 현 카탈로그는 `NewsArticle`, `FAQPage`, `VideoObject`만 있고 BroadcastEvent는 미등록
  - 문제: EC-SCHEMA-11은 broadcast/youtube/podcast를 모두 `VideoObject`로 말하지만 EC-RENDER-06은 broadcast를 `BroadcastEvent`로 말한다. 예시 `@id`도 항상 `#video`라 press/NewsArticle, broadcast/BroadcastEvent와 맞지 않는다.
  - 권장 patch: channel_type별 `@type`·`@id` fragment·필수 필드 표를 단일화하고 SCHEMA_MAPPING §2 카탈로그에 BroadcastEvent 채택 여부를 명시.

- **ECP-06**: cross-page allowlist와 inline graph 출력 결정이 같은 절에서 모순
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:494-496`
  - 근거(SoT): `apps/web/src/lib/json-ld/__tests__/validate.ts:17-23` allowlist는 pure ref용, `:107-118` same-tenant unresolved ref는 실패
  - 문제: EC-SEO-02는 Doctor Profile에서 `subjectOf` ref만 출력하고 graph 안 풀 entity는 없다고 한다. 그런데 EC-SEO-04는 “v0.1 단계 inline 출력은 graph 안 entity”라고 한다. 둘 중 하나만 가능하다.
  - 권장 patch: v0.1에서 Publication/Media entity를 Doctor/About graph에 풀 출력할지, pure ref + allowlist로 둘지 결정하고 acceptance를 그 결정에 맞춘다.

- **ECP-07**: Publication/MediaAppearance ContentType cascade가 DATA_MODEL C-10 enum에 없음
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:500-508`, `:378-380`
  - 근거(SoT): `docs/core/DATA_MODEL.md:769-770` `contentType` enum에는 `FAQ`, `ArticleCategory`는 있으나 `Publication`, `MediaAppearance`가 없음. `docs/core/CONTENT_STANDARDS.md:366-397` ContentType은 DATA_MODEL C-10 enum 기반
  - 문제: plan은 Publication/MediaAppearance를 ContentType 예외와 audit payload에 넣지만 C-10 enum cascade를 요구하지 않는다. 또한 plan의 `Faq` 표기는 SoT enum `FAQ`와 대소문자도 다르다.
  - 권장 patch: DATA_MODEL C-10 enum 확장 여부를 EC-CASCADE-01에 포함하고, 토큰 표기를 `FAQ`처럼 SoT와 통일.

## major

- **ECP-08**: DOI validation이 DB와 zod에서 다름
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:141`, `:371`
  - 근거(SoT): plan DB는 `^10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$`, zod는 `10\.[0-9]{4,9}/.+`
  - 문제: 같은 plan 안에서 DB와 form 검증이 서로 다른 DOI를 허용한다.
  - 권장 patch: zod에도 DB와 동일한 anchored regex를 사용.

- **ECP-09**: ArticleCategory default seed 위치가 불명확
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:109`, `:300-302`, `:565`
  - 근거(SoT): `packages/migrations-runner/src/manifest.ts:130-132` runner는 dependsOn 검증만 명시
  - 문제: DB migration에서 instance별 seed가 자동 생성되는지, app seed에서만 생성되는지 갈린다. 기존 instance가 있으면 C0013 FK backfill 전에 `general` row가 보장되어야 한다.
  - 권장 patch: C0009 seed strategy를 migration SQL로 둘지 app seed로 둘지 하나로 고정하고, C0013 dependsOn/acceptance에 포함.

- **ECP-10**: FAQ risk 자동 추론 적용과 v0.1 직접 발행 정책이 약함
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:281`, `:364`, `:584-586`
  - 근거(SoT): `docs/compliance/RISK_LEVELS.md:20-24` 자동 추론과 content-gate 발행 조건은 SoT, `docs/core/CONTENT_STANDARDS.md:309-313` FAQ 답변 단위 위험도
  - 문제: FAQ는 자체 의료 답변이라 자동 추론 대상인데, v0.1에서 `risk_level Low default` + 운영자 직접 published 허용이면 Medium/High 질문이 Low로 발행될 수 있다.
  - 권장 patch: compliance-assistant 전까지 FAQ published 차단, 또는 최소한 `review-queued/in-review` 차단뿐 아니라 `published` 전이 제한을 명시.

- **ECP-11**: status 차단 marker가 zod/schema 작업 지시와 연결되지 않음
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:364`, `:371-374`
  - 근거(SoT): `apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:19-22` 현재 9-state enum 전체 존재
  - 문제: plan은 `review-queued/in-review` 차단이라고 하지만 zod schema 항목에는 status만 있고 허용 subset이 없다.
  - 권장 patch: v0.1 form 허용 상태를 `draft | publishable | published` 등으로 명시하고 server action에서 거부.

- **ECP-12**: P-011 M0 합류 cascade가 PAGE_TYPES 현 SoT와 아직 충돌
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:389-397`, `:597`
  - 근거(SoT): `docs/core/PAGE_TYPES.md:22-24` M0는 9종 + Article 1샘플 = 10개, `:46` P-011 FAQ M0 빈칸
  - 문제: plan은 P-011을 M0 합류시키지만 PAGE_TYPES cascade patch 전에는 acceptance 불가.
  - 권장 patch: EC-CASCADE-08에서 P-011 M0 ✅ 및 본문 §3 추가를 acceptance precondition으로 격상.

- **ECP-13**: Publication `@id`가 별도 페이지 없는 URL이라 dereferenceable 규약과 충돌 가능
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:442`, `:577`
  - 근거(SoT): `docs/core/SCHEMA_MAPPING.md:66` `@id`는 dereferenceable URL + fragment, `docs/decisions/EAT_CONTENT_PLAN.md:577` 별도 페이지는 defer
  - 문제: `/publications/{slug}` 페이지가 없는데 `@id`가 해당 경로를 가리킨다. allowlist로 validator만 통과시켜도 SoT의 dereferenceable 원칙은 깨진다.
  - 권장 patch: v0.1에는 Doctor/About 페이지 fragment 기반 full entity로 출력하거나, 별도 페이지를 최소 route로 포함한다.

- **ECP-14**: JSON-LD allowlist fragment가 media 분기를 커버하지 않음
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:496`, `:459-460`
  - 근거(SoT): `apps/web/src/lib/json-ld/__tests__/validate.ts:23` 현재 allowlist는 `organization`, `website`, `clinic`
  - 문제: plan은 `#faqpage`, `#scholarly`, `#video`만 추가한다. BroadcastEvent/NewsArticle을 쓰면 `#broadcast`, `#news` 등도 필요하거나 모든 MediaAppearance를 `#video`로 강제해야 한다.
  - 권장 patch: ECP-05의 type 결정과 함께 fragment allowlist를 확정.

- **ECP-15**: About graph 주체가 Organization인지 MedicalClinic인지 불명확
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:495`
  - 근거(SoT): `docs/core/SCHEMA_MAPPING.md:56-58` Organization과 MedicalClinic은 별도 entity, `:143-145` MedicalClinic/Physician 카탈로그 분리
  - 문제: EC-SEO-03은 `Organization.subjectOf` 또는 `MedicalClinic.subjectOf`라고 열어둔다. 구현자가 페이지마다 다르게 선택할 수 있다.
  - 권장 patch: P-002 About에서는 어느 entity에 `subjectOf`를 붙일지 단일 결정으로 고정.

- **ECP-16**: D0014 article_category public policy가 published 콘텐츠와 독립적으로 전량 노출
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:313-315`, `:346`
  - 근거(SoT): `packages/db/migrations/D0011_public_reader.sql:53-70` 공개 콘텐츠는 published + published_at 조건을 둠
  - 문제: ArticleCategory에는 status가 없어서 운영 중 생성한 미사용 카테고리가 즉시 public_reader에 노출된다. 의도일 수 있으나 D0011의 published-only 패턴과 다르다.
  - 권장 patch: ArticleCategory를 public taxonomy로 명시하거나 `active/is_public` 같은 최소 노출 제어를 추가.

- **ECP-17**: scenario #33의 통과 기준을 만족하는 query 조건이 작업 단위에 없음
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:539`, `:557-560`
  - 근거(SoT): 현재 Article page는 `params.category !== "general"`이면 404, SQL은 category join 없음: `apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx:44-52`
  - 문제: category slug와 article.category_id join 조건을 public render 작업에 명시하지 않으면 #33은 구현 누락될 가능성이 높다.
  - 권장 patch: Article detail query를 `article_category` join + `category.slug = params.category`로 바꾸는 작업을 명시.

## minor

- **ECP-18**: `authors JSONB DEFAULT []`와 min 1 CHECK가 insert ergonomics와 충돌
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:122`, `:143`
  - 근거(SoT): plan 자체에서 authors min 1 요구
  - 문제: default `[]`는 항상 CHECK 위반 값이다. 실질 default로 동작하지 않는다.
  - 권장 patch: default 제거 또는 `authors`를 명시 required로만 둔다.

- **ECP-19**: FAQ 렌더와 JSON-LD text 변환 순서가 더 구체적이어야 함
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:282`, `:484`
  - 근거(SoT): `docs/core/SCHEMA_MAPPING.md:518` FAQ answer는 Markdown → 평문
  - 문제: public HTML은 sanitize-html, JSON-LD는 평문 strip이어야 하는데 구현 지시가 분산되어 있다.
  - 권장 patch: `answerMarkdown -> html sanitize`와 `answerMarkdown -> plainText strip`을 별도 helper로 명시.

- **ECP-20**: external link rel 기준이 scenario에만 있고 렌더 결정에 없음
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:406-407`, `:530`
  - 근거(SoT): `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:695` PSR-20 rel `nofollow noopener noreferrer`
  - 문제: scenario #24는 `noopener`만 요구한다.
  - 권장 patch: Publication/Media external link는 `nofollow noopener noreferrer`로 통일.

- **ECP-21**: sitemap lastmod aggregate의 empty FAQ 처리 미정
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:426`
  - 근거(SoT): `docs/core/SEARCH_STANDARDIZATION.md:359` P-011 FAQ monthly 0.5
  - 문제: published FAQ 0건일 때 `/faq`를 sitemap에 넣을지, lastmod fallback을 instance updated_at으로 할지 미정.
  - 권장 patch: 0건이면 페이지 404/숨김 또는 빈 FAQ 페이지 200 중 하나를 정하고 lastmod fallback 명시.

- **ECP-22**: EC-CASCADE-09의 “12페이지” 산정이 불명확
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:598`
  - 근거(SoT): `docs/core/PAGE_TYPES.md:22-24` 현재 M0는 10개 페이지
  - 문제: “기존 10 + FAQ 1 + Article category prefix 화면 1”이라고 하지만 Article category prefix는 별 화면이 아니라고 같은 줄에 쓴다.
  - 권장 patch: page count와 route count를 분리해서 적는다.

## cascade marker / acceptance precondition 점검

- EC-CASCADE-01: FAIL — DATA_MODEL C-24 gap, C-22 충돌, C-10 ContentType enum 누락.
- EC-CASCADE-02: FAIL — MediaAppearance type/fragment 불일치, Publication dereferenceable `@id` 미해결.
- EC-CASCADE-03: FAIL — Publication/MediaAppearance ContentType이 DATA_MODEL enum에 없음.
- EC-CASCADE-04: TBD — M0_BUILD_EXPORT_PLAN에 신규 4 entity 변환 규칙이 아직 없음.
- EC-CASCADE-05: FAIL — D0014 정책 방향은 있으나 D0011 재현 + article_category 노출 정책 미정.
- EC-CASCADE-06: FAIL — 14단계 산술 오류. 현 10단계 + 6개 = 16단계.
- EC-CASCADE-07: FAIL — PSR-DEFER-11/15 해소는 PAGE_TYPES/Article query/category NOT NULL까지 필요.
- EC-CASCADE-08: FAIL — PAGE_TYPES 현 SoT에서 P-011은 M0 미합류.
- EC-CASCADE-09: TBD — ARCH §3 patch 내용과 page count 정의 확인 필요.
tokens used
71,649
# EAT_CONTENT_PLAN v0.1 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=7 major=10 minor=5 (총 22)
- closeableAfterPatch: false

## blocking

- **ECP-01**: C-25/26/27 번호가 DATA_MODEL 인벤토리와 불일치
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:112`, `:174`, `:232`, `:590`
  - 근거(SoT): `docs/core/DATA_MODEL.md:19` “C-01~C-23”, `:56-57` C-22 ArticleCategory, C-23 AdminUser
  - 문제: plan은 C-25/26/27을 신설하면서 `23 → 26 contracts`라고 하지만 C-24가 정의되지 않았다. 신규 3개면 C-24/25/26이거나, C-24 예약 사유를 DATA_MODEL §1.1에 명시해야 한다.
  - 권장 patch: C-24 미사용/예약 여부를 결정하고, 인벤토리·본문 번호·cascade marker를 한 번에 정정.

- **ECP-02**: C-22 ArticleCategory를 “신규 table”로 재정의하면서 기존 C-22 풀명세와 충돌
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:72-110`
  - 근거(SoT): `docs/core/DATA_MODEL.md:56` C-22는 이미 ArticleCategory, `:917-926` 필드 `@id`, `name 1~50`, `pillar`, `parentCategory`, `coverImageUrl`, `seoMeta`, `articleTypeDefault`
  - 문제: plan의 DB 모델은 `name 1~100`, `metadata`만 두고 기존 C-22 필드 다수를 누락한다. `parent_id 없음` 결정도 SoT의 `parentCategory optional`과 충돌한다.
  - 권장 patch: EC-SCHEMA-01을 “C-22 DB 구현”으로 바꾸고, DATA_MODEL C-22를 flat 1-level로 정정할지 DB에 SoT 필드를 반영할지 결정.

- **ECP-03**: Article.category required SoT인데 DB는 nullable로 남음
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:290-302`
  - 근거(SoT): `docs/core/DATA_MODEL.md:480-482` Article `articleType`, `contentFormat`, `category Ref<C-22>` required
  - 문제: `ALTER TABLE article ADD COLUMN category_id UUID;` 뒤 `NOT NULL` 또는 publish-time CHECK가 없다. backfill 스크립트가 있어도 신규 row는 category 없이 저장 가능하다.
  - 권장 patch: backfill 후 `ALTER COLUMN category_id SET NOT NULL`을 같은 migration에 포함하거나, staged migration이면 acceptance에 `NOT NULL` 전환 단계를 명시.

- **ECP-04**: manifest “14 단계” 산술과 의존성 cascade가 틀림
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:524`, `:595`
  - 근거(SoT): `packages/migrations-runner/src/manifest.ts:102-126` 현 manifest는 D0011 포함 10단계, D0011은 마지막 정책 migration
  - 문제: plan은 C0009~C0013 5개 + D0014 1개를 추가하면서 “10 → 14, +4”라고 쓴다. 실제로는 10 → 16이다. D0014는 C0009~C0013 모두 이후여야 한다.
  - 권장 patch: manifest 목표를 16단계로 정정하고, D0014 `dependsOn`에 `article_category`, `publication`, `media_appearance`, `faq`, `article.category_id`를 명시.

- **ECP-05**: MediaAppearance JSON-LD 분기 결정이 서로 충돌
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:229`, `:412-413`, `:455-468`
  - 근거(SoT): `docs/core/SCHEMA_MAPPING.md:149-154` 현 카탈로그는 `NewsArticle`, `FAQPage`, `VideoObject`만 있고 BroadcastEvent는 미등록
  - 문제: EC-SCHEMA-11은 broadcast/youtube/podcast를 모두 `VideoObject`로 말하지만 EC-RENDER-06은 broadcast를 `BroadcastEvent`로 말한다. 예시 `@id`도 항상 `#video`라 press/NewsArticle, broadcast/BroadcastEvent와 맞지 않는다.
  - 권장 patch: channel_type별 `@type`·`@id` fragment·필수 필드 표를 단일화하고 SCHEMA_MAPPING §2 카탈로그에 BroadcastEvent 채택 여부를 명시.

- **ECP-06**: cross-page allowlist와 inline graph 출력 결정이 같은 절에서 모순
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:494-496`
  - 근거(SoT): `apps/web/src/lib/json-ld/__tests__/validate.ts:17-23` allowlist는 pure ref용, `:107-118` same-tenant unresolved ref는 실패
  - 문제: EC-SEO-02는 Doctor Profile에서 `subjectOf` ref만 출력하고 graph 안 풀 entity는 없다고 한다. 그런데 EC-SEO-04는 “v0.1 단계 inline 출력은 graph 안 entity”라고 한다. 둘 중 하나만 가능하다.
  - 권장 patch: v0.1에서 Publication/Media entity를 Doctor/About graph에 풀 출력할지, pure ref + allowlist로 둘지 결정하고 acceptance를 그 결정에 맞춘다.

- **ECP-07**: Publication/MediaAppearance ContentType cascade가 DATA_MODEL C-10 enum에 없음
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:500-508`, `:378-380`
  - 근거(SoT): `docs/core/DATA_MODEL.md:769-770` `contentType` enum에는 `FAQ`, `ArticleCategory`는 있으나 `Publication`, `MediaAppearance`가 없음. `docs/core/CONTENT_STANDARDS.md:366-397` ContentType은 DATA_MODEL C-10 enum 기반
  - 문제: plan은 Publication/MediaAppearance를 ContentType 예외와 audit payload에 넣지만 C-10 enum cascade를 요구하지 않는다. 또한 plan의 `Faq` 표기는 SoT enum `FAQ`와 대소문자도 다르다.
  - 권장 patch: DATA_MODEL C-10 enum 확장 여부를 EC-CASCADE-01에 포함하고, 토큰 표기를 `FAQ`처럼 SoT와 통일.

## major

- **ECP-08**: DOI validation이 DB와 zod에서 다름
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:141`, `:371`
  - 근거(SoT): plan DB는 `^10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$`, zod는 `10\.[0-9]{4,9}/.+`
  - 문제: 같은 plan 안에서 DB와 form 검증이 서로 다른 DOI를 허용한다.
  - 권장 patch: zod에도 DB와 동일한 anchored regex를 사용.

- **ECP-09**: ArticleCategory default seed 위치가 불명확
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:109`, `:300-302`, `:565`
  - 근거(SoT): `packages/migrations-runner/src/manifest.ts:130-132` runner는 dependsOn 검증만 명시
  - 문제: DB migration에서 instance별 seed가 자동 생성되는지, app seed에서만 생성되는지 갈린다. 기존 instance가 있으면 C0013 FK backfill 전에 `general` row가 보장되어야 한다.
  - 권장 patch: C0009 seed strategy를 migration SQL로 둘지 app seed로 둘지 하나로 고정하고, C0013 dependsOn/acceptance에 포함.

- **ECP-10**: FAQ risk 자동 추론 적용과 v0.1 직접 발행 정책이 약함
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:281`, `:364`, `:584-586`
  - 근거(SoT): `docs/compliance/RISK_LEVELS.md:20-24` 자동 추론과 content-gate 발행 조건은 SoT, `docs/core/CONTENT_STANDARDS.md:309-313` FAQ 답변 단위 위험도
  - 문제: FAQ는 자체 의료 답변이라 자동 추론 대상인데, v0.1에서 `risk_level Low default` + 운영자 직접 published 허용이면 Medium/High 질문이 Low로 발행될 수 있다.
  - 권장 patch: compliance-assistant 전까지 FAQ published 차단, 또는 최소한 `review-queued/in-review` 차단뿐 아니라 `published` 전이 제한을 명시.

- **ECP-11**: status 차단 marker가 zod/schema 작업 지시와 연결되지 않음
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:364`, `:371-374`
  - 근거(SoT): `apps/web/src/app/(admin)/admin/[instanceSlug]/articles/actions.ts:19-22` 현재 9-state enum 전체 존재
  - 문제: plan은 `review-queued/in-review` 차단이라고 하지만 zod schema 항목에는 status만 있고 허용 subset이 없다.
  - 권장 patch: v0.1 form 허용 상태를 `draft | publishable | published` 등으로 명시하고 server action에서 거부.

- **ECP-12**: P-011 M0 합류 cascade가 PAGE_TYPES 현 SoT와 아직 충돌
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:389-397`, `:597`
  - 근거(SoT): `docs/core/PAGE_TYPES.md:22-24` M0는 9종 + Article 1샘플 = 10개, `:46` P-011 FAQ M0 빈칸
  - 문제: plan은 P-011을 M0 합류시키지만 PAGE_TYPES cascade patch 전에는 acceptance 불가.
  - 권장 patch: EC-CASCADE-08에서 P-011 M0 ✅ 및 본문 §3 추가를 acceptance precondition으로 격상.

- **ECP-13**: Publication `@id`가 별도 페이지 없는 URL이라 dereferenceable 규약과 충돌 가능
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:442`, `:577`
  - 근거(SoT): `docs/core/SCHEMA_MAPPING.md:66` `@id`는 dereferenceable URL + fragment, `docs/decisions/EAT_CONTENT_PLAN.md:577` 별도 페이지는 defer
  - 문제: `/publications/{slug}` 페이지가 없는데 `@id`가 해당 경로를 가리킨다. allowlist로 validator만 통과시켜도 SoT의 dereferenceable 원칙은 깨진다.
  - 권장 patch: v0.1에는 Doctor/About 페이지 fragment 기반 full entity로 출력하거나, 별도 페이지를 최소 route로 포함한다.

- **ECP-14**: JSON-LD allowlist fragment가 media 분기를 커버하지 않음
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:496`, `:459-460`
  - 근거(SoT): `apps/web/src/lib/json-ld/__tests__/validate.ts:23` 현재 allowlist는 `organization`, `website`, `clinic`
  - 문제: plan은 `#faqpage`, `#scholarly`, `#video`만 추가한다. BroadcastEvent/NewsArticle을 쓰면 `#broadcast`, `#news` 등도 필요하거나 모든 MediaAppearance를 `#video`로 강제해야 한다.
  - 권장 patch: ECP-05의 type 결정과 함께 fragment allowlist를 확정.

- **ECP-15**: About graph 주체가 Organization인지 MedicalClinic인지 불명확
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:495`
  - 근거(SoT): `docs/core/SCHEMA_MAPPING.md:56-58` Organization과 MedicalClinic은 별도 entity, `:143-145` MedicalClinic/Physician 카탈로그 분리
  - 문제: EC-SEO-03은 `Organization.subjectOf` 또는 `MedicalClinic.subjectOf`라고 열어둔다. 구현자가 페이지마다 다르게 선택할 수 있다.
  - 권장 patch: P-002 About에서는 어느 entity에 `subjectOf`를 붙일지 단일 결정으로 고정.

- **ECP-16**: D0014 article_category public policy가 published 콘텐츠와 독립적으로 전량 노출
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:313-315`, `:346`
  - 근거(SoT): `packages/db/migrations/D0011_public_reader.sql:53-70` 공개 콘텐츠는 published + published_at 조건을 둠
  - 문제: ArticleCategory에는 status가 없어서 운영 중 생성한 미사용 카테고리가 즉시 public_reader에 노출된다. 의도일 수 있으나 D0011의 published-only 패턴과 다르다.
  - 권장 patch: ArticleCategory를 public taxonomy로 명시하거나 `active/is_public` 같은 최소 노출 제어를 추가.

- **ECP-17**: scenario #33의 통과 기준을 만족하는 query 조건이 작업 단위에 없음
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:539`, `:557-560`
  - 근거(SoT): 현재 Article page는 `params.category !== "general"`이면 404, SQL은 category join 없음: `apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx:44-52`
  - 문제: category slug와 article.category_id join 조건을 public render 작업에 명시하지 않으면 #33은 구현 누락될 가능성이 높다.
  - 권장 patch: Article detail query를 `article_category` join + `category.slug = params.category`로 바꾸는 작업을 명시.

## minor

- **ECP-18**: `authors JSONB DEFAULT []`와 min 1 CHECK가 insert ergonomics와 충돌
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:122`, `:143`
  - 근거(SoT): plan 자체에서 authors min 1 요구
  - 문제: default `[]`는 항상 CHECK 위반 값이다. 실질 default로 동작하지 않는다.
  - 권장 patch: default 제거 또는 `authors`를 명시 required로만 둔다.

- **ECP-19**: FAQ 렌더와 JSON-LD text 변환 순서가 더 구체적이어야 함
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:282`, `:484`
  - 근거(SoT): `docs/core/SCHEMA_MAPPING.md:518` FAQ answer는 Markdown → 평문
  - 문제: public HTML은 sanitize-html, JSON-LD는 평문 strip이어야 하는데 구현 지시가 분산되어 있다.
  - 권장 patch: `answerMarkdown -> html sanitize`와 `answerMarkdown -> plainText strip`을 별도 helper로 명시.

- **ECP-20**: external link rel 기준이 scenario에만 있고 렌더 결정에 없음
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:406-407`, `:530`
  - 근거(SoT): `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md:695` PSR-20 rel `nofollow noopener noreferrer`
  - 문제: scenario #24는 `noopener`만 요구한다.
  - 권장 patch: Publication/Media external link는 `nofollow noopener noreferrer`로 통일.

- **ECP-21**: sitemap lastmod aggregate의 empty FAQ 처리 미정
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:426`
  - 근거(SoT): `docs/core/SEARCH_STANDARDIZATION.md:359` P-011 FAQ monthly 0.5
  - 문제: published FAQ 0건일 때 `/faq`를 sitemap에 넣을지, lastmod fallback을 instance updated_at으로 할지 미정.
  - 권장 patch: 0건이면 페이지 404/숨김 또는 빈 FAQ 페이지 200 중 하나를 정하고 lastmod fallback 명시.

- **ECP-22**: EC-CASCADE-09의 “12페이지” 산정이 불명확
  - 위치: `docs/decisions/EAT_CONTENT_PLAN.md:598`
  - 근거(SoT): `docs/core/PAGE_TYPES.md:22-24` 현재 M0는 10개 페이지
  - 문제: “기존 10 + FAQ 1 + Article category prefix 화면 1”이라고 하지만 Article category prefix는 별 화면이 아니라고 같은 줄에 쓴다.
  - 권장 patch: page count와 route count를 분리해서 적는다.

## cascade marker / acceptance precondition 점검

- EC-CASCADE-01: FAIL — DATA_MODEL C-24 gap, C-22 충돌, C-10 ContentType enum 누락.
- EC-CASCADE-02: FAIL — MediaAppearance type/fragment 불일치, Publication dereferenceable `@id` 미해결.
- EC-CASCADE-03: FAIL — Publication/MediaAppearance ContentType이 DATA_MODEL enum에 없음.
- EC-CASCADE-04: TBD — M0_BUILD_EXPORT_PLAN에 신규 4 entity 변환 규칙이 아직 없음.
- EC-CASCADE-05: FAIL — D0014 정책 방향은 있으나 D0011 재현 + article_category 노출 정책 미정.
- EC-CASCADE-06: FAIL — 14단계 산술 오류. 현 10단계 + 6개 = 16단계.
- EC-CASCADE-07: FAIL — PSR-DEFER-11/15 해소는 PAGE_TYPES/Article query/category NOT NULL까지 필요.
- EC-CASCADE-08: FAIL — PAGE_TYPES 현 SoT에서 P-011은 M0 미합류.
- EC-CASCADE-09: TBD — ARCH §3 patch 내용과 page count 정의 확인 필요.
