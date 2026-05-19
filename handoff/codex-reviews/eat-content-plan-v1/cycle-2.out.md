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
session id: 019e39ca-54c4-7cc0-b981-9cff1346f1e1
--------
user
You are reviewing **cycle 2** of `docs/decisions/EAT_CONTENT_PLAN.md` v0.2. Cycle 1 had 22 findings (7 blocking + 10 major + 5 minor). All 22 patched.

## Cycle 1 patch summary

| # | severity | title | patch |
|---|---|---|---|
| ECP-01 | blocking | C-25/26/27 번호 충돌 | C-24 Publication · C-25 MediaAppearance 신규 · C-12 FAQ 풀명세 합류 · C-22 ArticleCategory 실 운영 합류 · 25 contracts |
| ECP-02 | blocking | C-22 풀명세 컬럼 누락 | C-22 풀명세 전체 컬럼 DB 추가 (v0.1 UI minimal · EC-DEFER-10) |
| ECP-03 | blocking | Article.category_id nullable | staged 4-step migration (ADD nullable + seed + backfill + SET NOT NULL + FK) |
| ECP-04 | blocking | manifest 14단계 산술 오류 | 16단계 + 각 dependsOn 명시 |
| ECP-05 | blocking | MediaAppearance JSON-LD 분기 충돌 | 모든 channel_type → VideoObject 단일화 · fragment `#video-{slug}` · BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 |
| ECP-06 | blocking | allowlist vs inline graph 모순 | graph self-contained · 풀 entity inline · cross-page allowlist 미사용 |
| ECP-07 | blocking | C-10 ContentType enum cascade 누락 | +Publication +MediaAppearance · 17종 v0.6 |
| ECP-08 | major | DOI regex DB·zod 다름 | zod 도 동일 anchored regex |
| ECP-09 | major | default seed 위치 불명확 | seed.ts + C0013 backfill |
| ECP-10·11 | major | FAQ v0.1 published 차단 + zod status subset | DB CHECK status='draft' + zod enum subset + EC-DEFER-12 신설 |
| ECP-12 | major | P-011 M0 cascade | EC-CASCADE-08 acceptance precondition 격상 |
| ECP-13 | major | Publication @id dereferenceable | fragment-scoped @id (Doctor/About page URL + fragment) |
| ECP-14 | major | allowlist fragment | graph self-contained 결정 — allowlist 변경 X |
| ECP-15 | major | About subjectOf 결정 | MedicalClinic.subjectOf 단일 결정 |
| ECP-16 | major | article_category public policy | taxonomy public 의도 명시 + EC-DEFER-10 |
| ECP-17 | major | scenario #33 query 작업 단위 | Article detail SQL JOIN article_category 명시 |
| ECP-18 | minor | authors DEFAULT 충돌 | DEFAULT 제거 |
| ECP-19 | minor | FAQ helper 2종 | renderMarkdownToPlainText 신규 |
| ECP-20 | minor | rel 통일 | nofollow noopener noreferrer |
| ECP-21 | minor | sitemap empty FAQ | 빈 페이지 200 + sitemap 포함 + lastmod fallback |
| ECP-22 | minor | 12페이지 산정 불명확 | 11 페이지 (기존 9 + P-010 + P-011) |

## Re-review scope (cycle 2)

`docs/decisions/EAT_CONTENT_PLAN.md` v0.2 (대규모 재작성) + SoT 정합 재검증:
- `docs/core/DATA_MODEL.md` § 1.1 인벤토리 + § 4 C-10/C-12/C-22 + C-04 Article category
- `docs/core/PAGE_TYPES.md` § 1.1 P-011 M0 · § 3 P-011 본문
- `docs/core/SCHEMA_MAPPING.md` § 2 entity 카탈로그 · § 3 P-011 graph
- `docs/core/CONTENT_STANDARDS.md` § 7.1.1.x
- `docs/compliance/RISK_LEVELS.md` § 2 자동 추론
- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.1 LegalDocument 패턴 (status='draft' + RLS published only)
- `packages/db/migrations/D0011_public_reader.sql` D0014 cascade target
- `packages/migrations-runner/src/manifest.ts` 10 → 16단계 cascade
- `apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx` SQL JOIN target
- `apps/web/src/lib/json-ld/__tests__/validate.ts` (cycle 1 cascade — graph self-contained 결정 후 변경 불필요)

## What to check (cycle 2)

1. cycle 1 patch 가 SoT 와 일관
2. 회귀 — manifest 16단계 / 각 dependsOn 정합 / C0013 staged 4-step 안 conflict (예: seed 시점)
3. 신규 결정 (graph self-contained / fragment-scoped @id / VideoObject 단일화 / FAQ v0.1 차단)
4. 새 finding (ECP-23+)
5. closeableAfterPatch=true 신호 — blocking 0 + major 0 시

## Output format

```
# EAT_CONTENT_PLAN v0.2 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세: cycle1=22 (7+10+5) → cycle2=N

## cycle 1 patch 검증
- ECP-01 ~ ECP-22 각각 PASS / FAIL / PARTIAL + 한 줄 근거

## new findings (ECP-23+)

## cascade marker / acceptance precondition (EC-CASCADE-01~09) 점검
```

가능한 한 광범위하게 보고, SoT 파일을 line 단위로 인용. 한국어로 응답.

codex
검토 범위가 문서와 실제 코드/마이그레이션을 함께 가로지르므로, 먼저 해당 파일들의 관련 섹션과 현재 라인 번호를 모아 SoT 간 충돌 여부부터 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "C-10|C-12|C-22|C-24|C-25|MediaAppearance|Publication|ArticleCategory|article_category|FAQ|subjectOf|VideoObject|BroadcastEvent|NewsArticle|allowlist|self-contained|EC-CASCADE|EC-DEFER|C0013|D0014|16" docs/decisions/EAT_CONTENT_PLAN.md' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "P-011|M0|Publication|MediaAppearance|subjectOf|FAQ|About|MedicalClinic" docs/core/PAGE_TYPES.md docs/core/SCHEMA_MAPPING.md docs/core/CONTENT_STANDARDS.md docs/compliance/RISK_LEVELS.md' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "C-10|C-12|C-22|C-04|ArticleCategory|article_category|Publication|MediaAppearance|ContentType|FAQ|status|draft|published|DOI|doi|authors" docs/core/DATA_MODEL.md' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "D0014|C0013|dependsOn|Publication|MediaAppearance|article_category|faq|FAQ|content_type|ContentType|cascade|D0011|D0012|D0013|D0014|D0015|D0016" packages/migrations-runner/src/manifest.ts packages/db/migrations/D0011_public_reader.sql apps/web/src/app/(site)/[instanceSlug]/insights/[category]/[slug]/page.tsx apps/web/src/lib/json-ld/__tests__/validate.ts' in C:\Users\assag\solution\website-exposure\apps\web
2026-05-18T06:33:55.756480Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.7 seconds
Output:
rg: docs/core/PAGE_TYPES.md: 지정된 경로를 찾을 수 없습니다. (os error 3)
rg: docs/core/SCHEMA_MAPPING.md: 지정된 경로를 찾을 수 없습니다. (os error 3)
rg: docs/core/CONTENT_STANDARDS.md: 지정된 경로를 찾을 수 없습니다. (os error 3)
rg: docs/compliance/RISK_LEVELS.md: 지정된 경로를 찾을 수 없습니다. (os error 3)

 exited 1 in 672ms:
rg: docs/core/PAGE_TYPES.md: 지정된 경로를 찾을 수 없습니다. (os error 3)
rg: docs/core/SCHEMA_MAPPING.md: 지정된 경로를 찾을 수 없습니다. (os error 3)
rg: docs/core/CONTENT_STANDARDS.md: 지정된 경로를 찾을 수 없습니다. (os error 3)
rg: docs/compliance/RISK_LEVELS.md: 지정된 경로를 찾을 수 없습니다. (os error 3)

 exited 1 in 675ms:
rg: docs/decisions/EAT_CONTENT_PLAN.md: IO error for operation on docs/decisions/EAT_CONTENT_PLAN.md: 지정된 경로를 찾을 수 없습니다. (os error 3)

 exited 1 in 677ms:
rg: docs/core/DATA_MODEL.md: IO error for operation on docs/core/DATA_MODEL.md: 지정된 경로를 찾을 수 없습니다. (os error 3)

2026-05-18T06:33:55.769456Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.7 seconds
Output:
rg: docs/decisions/EAT_CONTENT_PLAN.md: IO error for operation on docs/decisions/EAT_CONTENT_PLAN.md: 지정된 경로를 찾을 수 없습니다. (os error 3)

2026-05-18T06:33:55.770151Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.7 seconds
Output:
rg: docs/core/DATA_MODEL.md: IO error for operation on docs/core/DATA_MODEL.md: 지정된 경로를 찾을 수 없습니다. (os error 3)

2026-05-18T06:33:55.963738Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.9 seconds
Output:
[31;1msite: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … /db/migrations/D0011_public_reader.sql apps/web/src/app/([36;1msite[0m)/[insta …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                            ~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'site' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

 exited 1 in 853ms:
[31;1msite: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … /db/migrations/D0011_public_reader.sql apps/web/src/app/([36;1msite[0m)/[insta …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                            ~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mThe term 'site' is not recognized as a name of a cmdlet, function, script file, or executable program.[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m[31;1mCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.[0m

codex
현재 작업 디렉터리가 `apps/web`라서 문서 경로는 repo 루트 기준으로 올라가야 합니다. 경로와 PowerShell 괄호 이스케이프를 바로잡아 다시 읽겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"C-10|C-12|C-22|C-24|C-25|MediaAppearance|Publication|ArticleCategory|article_category|FAQ|subjectOf|VideoObject|BroadcastEvent|NewsArticle|allowlist|self-contained|EC-CASCADE|EC-DEFER|C0013|D0014|16\" ..\\..\\docs\\decisions\\EAT_CONTENT_PLAN.md" in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"C-10|C-12|C-22|C-04|ArticleCategory|article_category|Publication|MediaAppearance|ContentType|FAQ|status|draft|published|DOI|doi|authors\" ..\\..\\docs\\core\\DATA_MODEL.md" in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"P-011|M0|Publication|MediaAppearance|subjectOf|FAQ|About|MedicalClinic\" ..\\..\\docs\\core\\PAGE_TYPES.md ..\\..\\docs\\core\\SCHEMA_MAPPING.md ..\\..\\docs\\core\\CONTENT_STANDARDS.md ..\\..\\docs\\compliance\\RISK_LEVELS.md" in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"D0014|C0013|dependsOn|Publication|MediaAppearance|article_category|faq|FAQ|content_type|ContentType|cascade|D0011|D0012|D0013|D0014|D0015|D0016\" ..\\..\\packages\\migrations-runner\\src\\manifest.ts ..\\..\\packages\\db\\migrations\\D0011_public_reader.sql 'src\\app\\(site)\\[instanceSlug]\\insights\\[category]\\[slug]\\page.tsx' src\\lib\\json-ld\\__tests__\\validate.ts" in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 731ms:
38:| C-04 | `Article` | 인사이트·블로그 글 | L3 | Git | ✅ | P-009, P-010 |
44:| C-10 | `ComplianceRecord` | 컴플라이언스 게이트 통과 기록 | L1/L3 | DB+Git | ✅ | 발행 |
46:| C-12 | `FAQ` | 질문-답변 묶음 | L3 | Git | | P-011 |
56:| C-22 | `ArticleCategory` | Article Pillar/Category 정의 | L2+L3 | Git | (사용) | P-009, P-010 |
329:| `publications` | `Publication[]` | optional | |
363:#### `Publication`
396:| `faqs` | `Ref<C-12>[]` | optional | 관련 FAQ |
453:| `publishedYear` | `number` | optional | |
463:### C-04. `Article` — 인사이트·블로그 글 (v0.4 컨텍스트 필드 즉시 통합)
476:| `contentSource` | `enum {original, syndicated, republished, translated}` | optional | **(v0.4)** 콘텐츠 출처 (default `original`) |
482:| `category` | `Ref<C-22>` | ✅ | ArticleCategory |
489:| `relatedArticles` | `Ref<C-04>[]` | optional | |
520:- `contentSource: republished` 또는 `syndicated` 시 원본 권한·출처 표시 의무.
676:| `sources.snsApi.<platform>` | `{enabled: boolean, apiKeySecretRef: string, blogId/accountId: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedAccountIds: string[], allowedContentTypes: string[], consentEvidenceRef?: string}` | optional | platform=naverBlog·instagram·facebook·youtube. `enabled=true` + 법무 게이트 누락 → 빌드 fail (F-12) |
759:### C-10. `ComplianceRecord` — 컴플라이언스 게이트 통과 기록
769:| `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature}` | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1) |
770:| `featureContentType` | `string` (`feature:<slug>` 형식, 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$`) | conditional | `contentType="Feature"` 시 required — Feature 콘텐츠 세부 식별. 예: `feature:self-test` |
788:| `staleFlags` | `StaleFlags` | optional | (v0.7 +) 역할별 재검수 필요 상태 — `RISK_LEVELS.md` § 4 만료 정책에 따라 갱신. **published 이후에도 갱신 허용** (record 불변성의 예외 영역 — `admin/REVIEW_WORKFLOW.md` § 5.4) |
790:| `publishedAt` | `Date` | ✅ when `recordPhase="published"`, optional when `recordPhase="pre-publish"` | (v0.8 +) recordPhase별 required 분기 — 발행 전 누적 record는 본 필드 미기록 허용 |
791:| `publishedBy` | `string` | ✅ when `recordPhase="published"`, optional when `recordPhase="pre-publish"` | (v0.8 +) 위와 동일 |
792:| `recordPhase` | `enum {pre-publish, published}` | ✅ | (v0.8 +) 발행 생명주기 단계 (`admin/REVIEW_WORKFLOW.md` § 5.2). `pre-publish`는 검수 중 누적 record, `published`는 발행 완료 후 불변 record |
795:| `mediaThresholdOperationalInput` | `MediaThresholdAssessment` | optional | (v0.15 +) `features/analytics-reporting.md`이 제공한 rolling-90 operational snapshot — pre-publish record의 legal 판정 **입력 자료**. legal 검수자 calendar 산정 시 참고용. **published record에는 본 슬롯이 calendar로 대체되지 않고 그대로 보존됨** (감사 추적용) |
841:| `publishedAt` | `Date` | ✅ | schema datePublished |
875:- 발행 시 `ComplianceRecord(contentType=LegalDocument, legalCounsel=*, legalCounselAt=*)` 필수 — 위험도 Low 예외 게이트 (§ 4 C-10 참조).
913:### C-22. `ArticleCategory` — Article Pillar 분류
921:| `parentCategory` | `Ref<C-22>` | optional | 계층 구조 시 |
935:### C-12. `FAQ`
936:필드: `question`, `answer` (Markdown), `category`, `riskLevel` (답변 단위), `relatedTreatment?`, `relatedCondition?`. Schema: `FAQPage.mainEntity.Question`.
954:필드: `headline`, `body`, `category` (enum), `publishedDate`, `expirationDate?`, `riskLevel`. **event-price 카테고리는 High.**
1033:Article (C-04)
1037:   ├─ category → ArticleCategory (C-22)
1042:ComplianceRecord (C-10)
1043:   ├─ contentRef → 발행 콘텐츠 (C-01~C-22)
1067:| DM-09 | ~~ArticleCategory~~ | 해소 — C-22 |
1086:| 2026-05-13 | v0.2 | 레퍼런스 분석 반영 — C-21·C-22, 필드 추가 |
1089:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
1090:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
1092:| 2026-05-14 | v0.8 | **피드백 정정**: § 4 내 C-16 위치를 C-22 뒤 → C-10 다음(C-21 앞)으로 이동, 번호 순 가독성 확보. § 5 자리표시도 한 줄 링크로 간소화 |
1093:| 2026-05-14 | v0.9 | **피드백 정정**: (1) § 5 (M0 외 간략 명세)에서 C-16 자리표시 행 삭제 — 섹션 제목과 모순되는 잔존 제거. C-16은 § 4 M0 핵심에만 위치, (2) 헤더 작성일 설명 정정 — "번호순 정렬" → "M0 핵심 섹션 안에서 C-10 직후로 위치 이동" (C-11~C-15가 § 5에 있어 엄밀한 번호순은 아님) |
1106:| 2026-05-14 | v0.15 | **`features/analytics-reporting.md` 4차 사이클 cascade**: (1) **C-08 `analyticsPolicyVersion` 신설** — notifications policyVersion 패턴 동일 (필수, 패키지 병렬 보관), (2) **C-10 `mediaThresholdOperationalInput` 슬롯 분리** — rolling-90 operational snapshot은 본 슬롯, calendar 확정 판정은 `mediaThresholdAssessment` 슬롯. published record는 calendar 값만 (AR4-08) |
1107:| 2026-05-14 | v0.14 | **`features/analytics-reporting.md` 1차 사이클 cascade**: (1) **C-08 `analyticsConfig` 신설** — `AnalyticsConfig`(sources.gsc·naverSearchAdvisor·ga4·rum 자격증명·사이트 식별자만, 동작 옵션은 `features.analytics-reporting.config`로 분리), (2) **C-10 `mediaThresholdAssessment` 슬롯** — `MediaThresholdAssessment` 신설(assessmentBasisDate·windowStart/End·rollingAverageDailyUsers·thresholdReached·primarySource·sourceCompleteness·timezone·calendarPolicy·botFilteringPolicy·legalBasisNote). priorReviewRequired 산정 근거. ComplianceRecord 발행 시 snapshot으로 고정 |

 succeeded in 727ms:
..\..\docs\core\CONTENT_STANDARDS.md:57:| FAQ.answer | 50~300자 권장 (Q&A 블록은 답변 우선 1~2문장) |
..\..\docs\core\CONTENT_STANDARDS.md:76:| 본문 시작 1~2문장 내에 핵심 답변 배치 (§ 2.1.1 AST 정의) | warning (검색 노출 약화) | P-006·P-008·P-010·P-011 답변 단위·블록 본문 |
..\..\docs\core\CONTENT_STANDARDS.md:102:6. P-011 FAQ의 경우 각 Q&A 블록 단위로 동일 알고리즘 — `<dl>/<dt>` 다음 `<dd>` 또는 H3 다음 paragraph
..\..\docs\core\CONTENT_STANDARDS.md:129:| Q&A 블록 | `<dl>` 또는 FAQPage schema | FAQ 리치 결과 |
..\..\docs\core\CONTENT_STANDARDS.md:154:- JSON-LD schema — 본문 Q&A 블록을 추출하여 별도 FAQPage 그래프 출력 (`SCHEMA_MAPPING` § 3 P-011 FAQPage 매핑). 렌더링 마크업과 schema 출력은 독립
..\..\docs\core\CONTENT_STANDARDS.md:286:### 5.1 P-002 About — 정체성·신뢰도
..\..\docs\core\CONTENT_STANDARDS.md:309:### 5.5 P-011 FAQ — 답변 단위 위험도
..\..\docs\core\CONTENT_STANDARDS.md:311:- 답변마다 위험도 등급 부여 (`PAGE_TYPES.md` § 3 P-011)
..\..\docs\core\CONTENT_STANDARDS.md:352:- 어드민에서 운영자가 직접 분류 (M0)
..\..\docs\core\CONTENT_STANDARDS.md:655:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1) § 0 SoT 참조 § 5→§ 4 정정, (2) § 1.3 본문 길이 산정 기준 "1,000자(공백 제외)" + Markdown 정규화 알고리즘 명시 → CS-A 미결정 신설, (3) § 3.1 Q&A 렌더링(HTML `<dl>`)과 JSON-LD FAQPage schema 책임 분리, (4) § 3.1 Q&A 룰 fail/content-gate 분리 적용 (§ 4.1 직접 참조), (5)·(6) § 4.1 보장 표현 통합 fail + 수치/기간 단정(보장어 미포함) content-gate 분리, 유인성 표현(시간·수량 압박)과 할인·이벤트 사실 안내(법무 판정 영역) 분리, (7) § 4.2 "100% 효과" 대체 표현 — 효과 진술을 인용·통계 출처 동반으로만 한정 (치료경험담 위험 제거), (8) § 4.3·§ 5.6 환자 후기 — 의료법 제56조 직접 인용, 사전심의(제57조) 단정 표현 제거, 매체·방식별 법무 판정 명시, (9) § 4.3·§ 5.6 전후사진 — ReviewPolicy.beforeAfterPhotoAllowed 의미를 "법무 승인 후 예외적 허용 플래그"로 명확화, 승인자·일자 필수 기록 (CS-B 신설), (10) § 7.1 ContentType을 DATA_MODEL C-10 ComplianceRecord.contentType과 동일 enum 명시, (11) § 7.2 ComplianceCheckResult 인터페이스 확장 — buildBlocked/gateRequired/publishable/requiredApproverRole 분리, (12) § 7.4 RiskRule 스키마 신설 (id/category/pattern/patternType/severity/scope/requiredApproverRole/suggestion/rationale/exceptions/version) + ContentScope 5종 + CS-01 해소 |
..\..\docs\compliance\RISK_LEVELS.md:127:| P-001 Home, P-002 About, P-003 Doctors List, P-004 Doctor Profile, P-005 Treatments List, P-007 Conditions List, P-009 Articles List, P-011 FAQ, P-012 Contact, P-013 Legal, P-014 Location, P-105 Reservation | Low |
..\..\docs\compliance\RISK_LEVELS.md:500:- 그 외 모든 콘텐츠 (ClinicProfile·DoctorProfile·TreatmentPage·MedicalConditionPage·FAQ·ReviewPolicy 등) — `ComplianceRecord(C-10).inlineRiskFlags`에만 보관. Git 원본 데이터에는 inlineRiskFlags 필드 없음
..\..\docs\core\PAGE_TYPES.md:4:> **작성일**: 2026-05-14 (v0.7 → v0.8 — § 6 M0 표 P-013 비고 SoT 정합 / 잔존 버전 표기 정리)
..\..\docs\core\PAGE_TYPES.md:23:- M0 Slice: **9종 + Article 1샘플 = 10개 페이지** (P-001·P-002·P-003·P-004·P-005·P-006·P-012·P-013·P-014 + P-010 1샘플).
..\..\docs\core\PAGE_TYPES.md:34:| ID | 페이지 타입 | URL 패턴 | 주 데이터 계약 | M0 |
..\..\docs\core\PAGE_TYPES.md:37:| P-002 | About | `/about` | `ClinicProfile` (전체) | ✅ |
..\..\docs\core\PAGE_TYPES.md:46:| P-011 | FAQ | `/faq` | `FAQ[]` | |
..\..\docs\core\PAGE_TYPES.md:102:**Schema 요약**: `Organization` + `MedicalClinic` + `WebSite` (SearchAction). BreadcrumbList 미적용.
..\..\docs\core\PAGE_TYPES.md:108:4. 최신 인사이트 (M0에서 P-009 미합류 시 P-010 샘플로 직접 링크)
..\..\docs\core\PAGE_TYPES.md:118:**내부 링크 권장**: → About / Doctors List / Treatments List / Contact (P-009 미합류 시 Article 샘플 직접 링크)
..\..\docs\core\PAGE_TYPES.md:120:### P-002. About (병원 소개)
..\..\docs\core\PAGE_TYPES.md:125:**Schema 요약**: `Organization` + `MedicalClinic` (with founder, foundingDate, award, member) + BreadcrumbList.
..\..\docs\core\PAGE_TYPES.md:215:**Schema 요약**: `MedicalProcedure` + BreadcrumbList + (FAQ 블록 시) `FAQPage`.
..\..\docs\core\PAGE_TYPES.md:241:**선택 블록**: 프로그램 변형 / 소요 시간 / 시술 후 관리 / 유지 계획 / 근거 노트 / FAQ / 관련 의료진 / 관련 질환
..\..\docs\core\PAGE_TYPES.md:259:| FAQ | 답변별 가변 | 효과·결과 답변 → High |
..\..\docs\core\PAGE_TYPES.md:266:**내부 링크 권장**: → 담당 의료진 / 관련 질환 / 관련 시술 / FAQ
..\..\docs\core\PAGE_TYPES.md:289:**Schema 요약**: `MedicalCondition` (signOrSymptom, riskFactor, possibleTreatment) + BreadcrumbList + (해당 시) FAQPage.
..\..\docs\core\PAGE_TYPES.md:304:**선택 블록**: 진단 / FAQ / 관련 시술 / 관련 의료진
..\..\docs\core\PAGE_TYPES.md:308:**내부 링크 권장**: → 관련 Treatments / 관련 Articles / FAQ
..\..\docs\core\PAGE_TYPES.md:333:**Schema 요약**: `Article` (headline, datePublished, dateModified, author=Physician/Person, publisher, mainEntityOfPage, articleSection, wordCount, inLanguage) + BreadcrumbList + (Q&A 블록 시) FAQPage + (video 시) VideoObject.
..\..\docs\core\PAGE_TYPES.md:351:**선택 블록**: 임베디드 미디어 / 검수 정보 / 관련 글 / 관련 시술 / FAQ / CTA
..\..\docs\core\PAGE_TYPES.md:371:### P-011. FAQ
..\..\docs\core\PAGE_TYPES.md:375:**주 데이터 계약**: `FAQ[]`
..\..\docs\core\PAGE_TYPES.md:376:**Schema 요약**: `FAQPage` (mainEntity = Question[]) + BreadcrumbList.
..\..\docs\core\PAGE_TYPES.md:398:**목적**: 위치·진료시간·예약·상담 채널의 통합 전환 허브. 단순 안내 페이지가 아닌 **다중 CTA 채널 집결지**. M0 필수.
..\..\docs\core\PAGE_TYPES.md:401:**Schema 요약**: 단지점은 `MedicalClinic`/`LocalBusiness`. 다지점은 본원 + 각 지점 별도 LocalBusiness. BreadcrumbList.
..\..\docs\core\PAGE_TYPES.md:418:**내부 링크 권장**: → Home / About / Doctors List / Reservation(있을 시) / 각 Location Detail(다지점)
..\..\docs\core\PAGE_TYPES.md:420:### P-013. Legal / Policy — **M0 출시 게이트** ⭐ v0.5 격상
..\..\docs\core\PAGE_TYPES.md:422:**목적**: 개인정보처리방침·이용약관·비급여 진료 등 정책 페이지. **법적·규제 의무**. 폼·예약·분석 스크립트 운영 시 사실상 필수 (개인정보보호법·정통망법). M0 출시 게이트.
..\..\docs\core\PAGE_TYPES.md:427:**M0 자동 생성 규칙** (v0.5 신규, v0.6 SoT 정정):
..\..\docs\core\PAGE_TYPES.md:430:- **어드민 화면 추가 없음** — M0 어드민 화면 수 6개 유지. 운영자는 ClinicProfile 입력 시 정책 변수(개인정보 보호 책임자·시행일 등)만 추가 입력하거나, LegalDocument 파일을 Git에 수동 보강.
..\..\docs\core\PAGE_TYPES.md:457:**Schema 요약**: `MedicalClinic`/`LocalBusiness` (지점 단위 별도 entity) + BreadcrumbList. 본원·지점 각자.
..\..\docs\core\PAGE_TYPES.md:493:- **어드민 별도 LocationProfile 입력 화면 추가 불필요** (M0 어드민 화면 수 6개 유지).
..\..\docs\core\PAGE_TYPES.md:569:**Schema 요약**: `MedicalClinic`/`LocalBusiness`의 `potentialAction` ReserveAction. BreadcrumbList.
..\..\docs\core\PAGE_TYPES.md:583:**Schema 요약**: `WebPage` 또는 `MedicalWebPage` + `FAQPage` 일부.
..\..\docs\core\PAGE_TYPES.md:596:> **1호 클라이언트 적용 후보**: 다이어트 유형 체크, 요요 위험도 체크, 체질 기반 사전문진. **M0 외 — Phase Alpha~Beta 도입 검토**.
..\..\docs\core\PAGE_TYPES.md:602:| ID | 이름 | URL | 주 데이터 계약 | 주 Schema | 위험도 기본 | High-risk | M0 |
..\..\docs\core\PAGE_TYPES.md:604:| P-001 | Home | `/` | ClinicProfile | Organization + MedicalClinic + WebSite | Low | | ✅ |
..\..\docs\core\PAGE_TYPES.md:605:| P-002 | About | `/about` | ClinicProfile | Organization + MedicalClinic | Low | | ✅ |
..\..\docs\core\PAGE_TYPES.md:614:| P-011 | FAQ | `/faq` | FAQ[] | FAQPage | 답변 가변 | | |
..\..\docs\core\PAGE_TYPES.md:615:| P-012 | Contact / Visit (Conversion Hub) | `/contact` | ClinicProfile + LocationProfile[] | MedicalClinic/LocalBusiness | Low | | ✅ |
..\..\docs\core\PAGE_TYPES.md:617:| P-014 | Location / Branch Detail | `/locations/{slug}` | LocationProfile | MedicalClinic/LocalBusiness (지점) | Low | | ✅ (main) |
..\..\docs\core\PAGE_TYPES.md:627:## 6. Vertical Slice (M0) 페이지 타입 — 10개 페이지
..\..\docs\core\PAGE_TYPES.md:632:| 2 | P-002 About | ClinicProfile 노출 |
..\..\docs\core\PAGE_TYPES.md:642:**M0 어드민 화면 수: 6개 유지** (대시보드 / ClinicProfile / DoctorProfile / TreatmentPage / Article / 미리보기·발행). P-012·P-014·P-013은 모두 ClinicProfile·LocationProfile 입력값과 Core 표준 템플릿으로 자동 생성되므로 별도 화면 불필요.
..\..\docs\core\PAGE_TYPES.md:644:**M0 미합류 합류 우선순위**:
..\..\docs\core\PAGE_TYPES.md:646:2. P-011 FAQ
..\..\docs\core\PAGE_TYPES.md:671:| PT-09 | FAQ 답변 단위 위험도 UI | admin |
..\..\docs\core\PAGE_TYPES.md:685:| 2026-05-13 | v0.2 | P-013 격상, P-105 신설, P-103 명칭 확장, 위험도 격상 조건표, M0 Contact 추가 |
..\..\docs\core\PAGE_TYPES.md:686:| 2026-05-13 | v0.3 | 레퍼런스 분석 반영 — P-106 Location 신설(선택), About 슬롯 보강, programVariants, contentFormat |
..\..\docs\core\PAGE_TYPES.md:687:| 2026-05-13 | v0.4 | DEEP_DIVE 통합 1단계 — 번호 체계 재정렬(P-014 Location 필수, P-106 Self-test), Contact Conversion Hub, High-risk 묶음, M0 8+1=9 |
..\..\docs\core\PAGE_TYPES.md:688:| 2026-05-14 | v0.5 | **피드백 적용**: (1) **전체 본문 풀명세 재펼침** — "이전과 동일" 문구 전면 제거, 단독 구현 명세화, (2) **P-014 LocationProfile main 자동 생성 규칙 명시** (어드민 화면 추가 없음), (3) **P-006 TreatmentPage 정보 슬롯에 treatmentComponents·recommendedFor·visitFlow·remoteCareAvailable·maintenancePlan·evidenceNotes 즉시 통합**, (4) **P-010 Article 정보 슬롯에 reviewedBy·contentSource·externalUrl 즉시 통합**, (5) **P-106 Self-test를 "Feature-backed optional page"로 표현 변경** (PT-12 해소), (6) PT-14 LocationProfile 자동 생성 규칙 어드민 구현 세부 신규, (7) **v0.5.1 추가 정정**: **P-013 Legal/Policy를 M0 출시 게이트로 격상** — Core 표준 템플릿 + ClinicProfile 변수 자동 치환 생성. M0 페이지 수 9 → **10**. 어드민 화면 수 6개 그대로 (자동 생성). 법무 검토 필수 (ComplianceRecord 추적) |
..\..\docs\core\PAGE_TYPES.md:691:| 2026-05-14 | v0.8 | **피드백 정정**: § 6 M0 표 P-013 비고를 SoT 정합으로 정정 — "v0.5 격상 — ClinicProfile 변수 치환" → "ClinicProfile · LocationProfile(main) 변수 치환, 출시 게이트, 법무 검토 필수". 잔존 버전 표기(§ 6 제목 "(v0.5 갱신)" 등) 제거 |
..\..\docs\core\SCHEMA_MAPPING.md:20:- 핵심 schema: `Organization`·`MedicalClinic`·`Physician`·`MedicalProcedure`·`MedicalCondition`·`Article`·`FAQPage`·`BreadcrumbList`·`WebSite`. (`MedicalClinic`은 LocalBusiness sub-class이므로 별도 `LocalBusiness` 타입 출력 안 함)
..\..\docs\core\SCHEMA_MAPPING.md:21:- 단지점·다지점은 **`MedicalClinic` 지점 entity가 LocationProfile 1:1 매핑**. ClinicProfile은 `Organization`(상위 entity), 본원 LocationProfile은 본원 `MedicalClinic`(`#clinic`)으로 표현.
..\..\docs\core\SCHEMA_MAPPING.md:41:    { "@type": "MedicalClinic", "@id": "...", ... },
..\..\docs\core\SCHEMA_MAPPING.md:57:| `MedicalClinic` 본원 (LocationProfile main) | `https://{domain}/#clinic` | `https://example.com/#clinic` |
..\..\docs\core\SCHEMA_MAPPING.md:58:| `MedicalClinic` 지점 (LocationProfile main 외) | `https://{domain}/locations/{slug}#clinic` | `https://example.com/locations/gangnam#clinic` |
..\..\docs\core\SCHEMA_MAPPING.md:72:| Entity | v0.1 path-based 임시 패턴 | M0 v1.0 도메인 매핑 후 (SoT 표 위) |
..\..\docs\core\SCHEMA_MAPPING.md:75:| `MedicalClinic` (`#clinic` 본원) | `https://<host>/<instanceSlug>/#clinic` | `https://<customDomain>/#clinic` |
..\..\docs\core\SCHEMA_MAPPING.md:82:**Entity continuity 전환 룰 (M0 v1.0 도메인 매핑 합류 시점)**:
..\..\docs\core\SCHEMA_MAPPING.md:84:  - **HTTP 301 redirect**: v0.1 path-based URL → M0 도메인 매핑 URL (운영 트래픽 영향)
..\..\docs\core\SCHEMA_MAPPING.md:85:  - **`sameAs` 보조 marker**: M0 단계 Organization/MedicalClinic 의 `sameAs` 배열 에 v0.1 path-based URL 을 한시 (3~6 개월) 포함하여 entity identity 연속성 신호 제공
..\..\docs\core\SCHEMA_MAPPING.md:87:- 본 전환 작업은 M0 v1.0 본 구현 cascade (PSR-DEFER-02 도메인 매핑) 와 동반.
..\..\docs\core\SCHEMA_MAPPING.md:108:| 인스턴스 형태 | Organization | MedicalClinic |
..\..\docs\core\SCHEMA_MAPPING.md:110:| **단지점** | `Organization`(`#organization`) 1개 | **`MedicalClinic`(`#clinic`) 1개** — LocationProfile(slug=`main`)에 매핑. P-014 페이지(URL `/locations/main`)의 mainEntity도 같은 `#clinic` (URL ≠ entity @id) |
..\..\docs\core\SCHEMA_MAPPING.md:111:| **다지점** | `Organization`(`#organization`) 1개 | **본원: `MedicalClinic`(`#clinic`)** — LocationProfile(slug=`main`). **비본원 지점들: `MedicalClinic`(`/locations/{slug}#clinic`)** 각각 별도 entity. 모두 `parentOrganization` = Organization |
..\..\docs\core\SCHEMA_MAPPING.md:115:**`Organization` vs `MedicalClinic`의 책임 분리**:
..\..\docs\core\SCHEMA_MAPPING.md:117:- `MedicalClinic`: 지점 단위 의료기관 정체성 (LocationProfile의 `address`·`telephone`·`openingHours`·`geo`·`medicalSpecialty` 등). `parentOrganization`으로 `Organization` 참조.
..\..\docs\core\SCHEMA_MAPPING.md:125:| `Article`·`NewsArticle`·`BlogPosting`·`WebPage`·`FAQPage`·`Blog`·`VideoObject`·`ImageObject` 등 CreativeWork 계열 | `Organization`·`MedicalClinic`·`LocalBusiness`·`Physician`·`Person`·`ContactPoint` 등 — Schema.org 표준상 inLanguage 속성 부재 또는 부적합 |
..\..\docs\core\SCHEMA_MAPPING.md:127:> Organization·MedicalClinic·Physician 같은 entity에 inLanguage를 박으면 validator 노이즈. 보조 메타로 헤더의 `<html lang="ko-KR">`·meta inLanguage가 이미 표시함 (SEARCH_STANDARDIZATION § 2.1 정합).
..\..\docs\core\SCHEMA_MAPPING.md:143:| `MedicalClinic` | 본원(`#clinic`) — § 2.5 정책에 따라 페이지별 풀/참조. 다지점 비본원 지점은 P-012·P-014에서 N개 entity | LocationProfile (C-21) |
..\..\docs\core\SCHEMA_MAPPING.md:144:| `LocalBusiness` | **별도 출력 안 함** — `MedicalClinic`이 LocalBusiness sub-class. LocalBusiness 계열 속성(`address`·`openingHoursSpecification`·`geo`·`hasMap`·`potentialAction.ReserveAction`)은 `MedicalClinic` entity 위에서 사용 | (해당 없음 — 데이터는 LocationProfile, 타입은 MedicalClinic) |
..\..\docs\core\SCHEMA_MAPPING.md:150:| `FAQPage` | P-011 FAQ, FAQ 블록 포함 페이지 | FAQ[] (C-12) |
..\..\docs\core\SCHEMA_MAPPING.md:151:| `Question` / `Answer` | FAQPage.mainEntity | FAQ |
..\..\docs\core\SCHEMA_MAPPING.md:156:| `Person` | Author가 Physician이 아닌 경우 (`authorType` ≠ clinician) — **M0 외 후속** (현재 `Article.author: Ref<C-02>` 만 지원. authorType != clinician 케이스는 데이터 모델 확장 시 합류 — DM 추가) | (선택, M0 외) |
..\..\docs\core\SCHEMA_MAPPING.md:162:| `SearchAction` | WebSite.potentialAction **Conditional** — `/search` 라우트가 실제 구현된 경우에만 출력. M0 미출력 | (생성기 자동) |
..\..\docs\core\SCHEMA_MAPPING.md:163:| `ReserveAction` | **MedicalClinic.potentialAction** — Conditional: **(a) `#clinic` 풀 entity가 출력되는 페이지에서만** + **(b) `LocationProfile.reservationChannels` 중 예약 채널이 실제 존재하거나 페이지/시술 CTA가 예약 채널일 때**. LocalBusiness 별도 미사용 | ReservationPage, LocationProfile.reservationChannels |
..\..\docs\core\SCHEMA_MAPPING.md:177:| `HealthAndBeautyBusiness` (단독·병행) | **fail** | MedicalClinic만 사용 |
..\..\docs\core\SCHEMA_MAPPING.md:187:- `FAQPage` (Question/Answer) — FAQ 리치 결과
..\..\docs\core\SCHEMA_MAPPING.md:191:- `LocalBusiness` 계열 (`MedicalClinic` 포함) — 로컬 비즈니스 패널 (Google 비즈니스 프로필 연계)
..\..\docs\core\SCHEMA_MAPPING.md:194:> `HowTo`는 미사용 (M0 사용 계획 없음). 미래에 P-006 `visitFlow`·`process`를 HowTo로 매핑할 경우 카탈로그·결정표·의료 리스크 룰을 함께 추가해야 함 (SM 신규 필요).
..\..\docs\core\SCHEMA_MAPPING.md:198:- `MedicalClinic` 본원·지점 — 의료기관 entity
..\..\docs\core\SCHEMA_MAPPING.md:221:| `MedicalClinic` | **§ 2.5 정책에 따라 full 또는 ref** | 본원(`#clinic`) 풀/참조 위치는 § 2.5 SoT. 다지점 비본원 지점은 P-012·P-014에 풀 |
..\..\docs\core\SCHEMA_MAPPING.md:226:| `FAQPage` | Conditional | P-011 또는 FAQ 블록 포함 페이지 (P-006·P-008·P-010 등) |
..\..\docs\core\SCHEMA_MAPPING.md:229:| `ReserveAction` | Conditional | **(a) `#clinic` 풀 entity가 출력되는 페이지** + **(b) `LocationProfile.reservationChannels` 중 예약 채널(type∈{naver-reservation, video-consultation, external}) 있거나 페이지/시술 CTA가 예약 채널일 때** — 두 조건 모두 충족 시 `MedicalClinic.potentialAction`으로 출력 |
..\..\docs\core\SCHEMA_MAPPING.md:237:| `HealthAndBeautyBusiness` | **Blocked (fail)** | 의료기관 사이트는 `MedicalClinic`만 사용. 단독·병행 모두 미사용 |
..\..\docs\core\SCHEMA_MAPPING.md:241:| `Person` — Article.author (authorType != clinician) | M0 외 후속 | M0는 Physician만 지원. 데이터 모델 확장 시 합류 |
..\..\docs\core\SCHEMA_MAPPING.md:256:| `MedicalClinic` (`#clinic` 본원) | **풀 entity 출력** — 위치·시간·연락이 본문에 의미 있게 표시되거나 예약 action이 풀 entity로 필요한 페이지 | P-001(Home), P-002(About), P-006(Treatment Detail — 예약 CTA·담당 의료진 연계), P-012(Contact), P-014(Location main), P-105(Reservation — 예약 action 풀 필요) |
..\..\docs\core\SCHEMA_MAPPING.md:257:| `MedicalClinic` 참조 | **참조만** — 위치 정보가 페이지 본문에 표시되지 않는 페이지 | P-003(Doctors List), P-004(Doctor Profile), **P-005(Treatments List — 시술 카드 목록 위주, 위치 슬롯 없음)**, P-007/8(Conditions), P-009/10(Articles), P-011(FAQ), P-013(Legal), P-101(Reviews), P-102(Pricing), P-103(Facilities), P-104(News), P-106(Self-test) |
..\..\docs\core\SCHEMA_MAPPING.md:258:| `MedicalClinic` 지점 (`/locations/{slug}#clinic`) | 다지점만, P-012·P-014에 풀 entity | 다지점 P-012·P-014 |
..\..\docs\core\SCHEMA_MAPPING.md:261:| `Physician`, `MedicalProcedure`, `MedicalCondition`, `Article`, `FAQPage` | 상세 페이지에서 풀, 다른 페이지(목록·연관 참조)에서 참조 또는 inline 최소 | § 3 참조 |
..\..\docs\core\SCHEMA_MAPPING.md:267:## 3. 페이지 타입별 Schema 그래프 (M0 필수 14종)
..\..\docs\core\SCHEMA_MAPPING.md:275:2. `MedicalClinic` (LocationProfile main) — 본원
..\..\docs\core\SCHEMA_MAPPING.md:298:| `knowsAbout` | `medicalSpecialty[]` (보조) |
..\..\docs\core\SCHEMA_MAPPING.md:301:**MedicalClinic 필드 매핑 (본원, LocationProfile main)**:
..\..\docs\core\SCHEMA_MAPPING.md:305:| `@type` | `"MedicalClinic"` |
..\..\docs\core\SCHEMA_MAPPING.md:340:> PAGE_TYPES.md PT-03(Search 페이지)이 Phase Beta+ 미결정 상태이므로 M0에서는 SearchAction 미출력. 검색 기능 활성화 시 빌드 트리거.
..\..\docs\core\SCHEMA_MAPPING.md:350:### P-002. About
..\..\docs\core\SCHEMA_MAPPING.md:354:2. `MedicalClinic` (본원 — 주소·시간·연락 SoT)
..\..\docs\core\SCHEMA_MAPPING.md:358:**Organization**: P-001과 동일하되 **풀필드 노출** (about에서 가장 풍부) — `legalName`·`founder`·`foundingDate`·`award`·`memberOf`·`subOrganization`·`sameAs` 모두 포함. **`address`는 매핑하지 않음** — LocationProfile/MedicalClinic이 SoT.
..\..\docs\core\SCHEMA_MAPPING.md:371:    { "@type": "ListItem", "position": 2, "name": "About", "item": "https://{domain}/about" }
..\..\docs\core\SCHEMA_MAPPING.md:382:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
..\..\docs\core\SCHEMA_MAPPING.md:416:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
..\..\docs\core\SCHEMA_MAPPING.md:449:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5 — 시술 카드 목록 위주, 위치 정보 슬롯 없음)
..\..\docs\core\SCHEMA_MAPPING.md:479:2. `MedicalClinic` (본원) — **[풀]** (§ 2.5 — 예약 CTA·담당 의료진 연계로 풀 entity 필요)
..\..\docs\core\SCHEMA_MAPPING.md:483:6. (FAQ 블록 포함 시) `FAQPage` — **[풀]** (Conditional)
..\..\docs\core\SCHEMA_MAPPING.md:507:**FAQPage** (해당 시):
..\..\docs\core\SCHEMA_MAPPING.md:511:  "@type": "FAQPage",
..\..\docs\core\SCHEMA_MAPPING.md:531:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
..\..\docs\core\SCHEMA_MAPPING.md:540:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
..\..\docs\core\SCHEMA_MAPPING.md:544:6. (FAQ) `FAQPage` — **[풀]** (Conditional)
..\..\docs\core\SCHEMA_MAPPING.md:563:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
..\..\docs\core\SCHEMA_MAPPING.md:608:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
..\..\docs\core\SCHEMA_MAPPING.md:614:8. (Q&A 블록 포함 시) `FAQPage` — **[풀]** (Conditional)
..\..\docs\core\SCHEMA_MAPPING.md:664:### P-011. FAQ
..\..\docs\core\SCHEMA_MAPPING.md:668:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
..\..\docs\core\SCHEMA_MAPPING.md:669:3. `FAQPage` (Question/Answer) — **[풀]**
..\..\docs\core\SCHEMA_MAPPING.md:673:**FAQPage**: 위 P-006 FAQPage와 동일 구조. 페이지 전체가 Question 모음일 때 `mainEntity` 배열.
..\..\docs\core\SCHEMA_MAPPING.md:679:2. `MedicalClinic` (본원 `#clinic`) — **[풀]** (§ 2.5 — Conversion Hub 핵심 entity)
..\..\docs\core\SCHEMA_MAPPING.md:680:3. (다지점 시) `MedicalClinic` (비본원 지점 `/locations/{slug}#clinic`) — **[풀]** 각각
..\..\docs\core\SCHEMA_MAPPING.md:683:6. (다지점) `ItemList` — **[풀]** → 각 지점 `MedicalClinic` @id 참조
..\..\docs\core\SCHEMA_MAPPING.md:691:    { "@type": "MedicalClinic", "@id": "https://{domain}/#clinic", ... },      // 본원
..\..\docs\core\SCHEMA_MAPPING.md:692:    { "@type": "MedicalClinic", "@id": "https://{domain}/locations/gangnam#clinic", ... },
..\..\docs\core\SCHEMA_MAPPING.md:693:    { "@type": "MedicalClinic", "@id": "https://{domain}/locations/bundang#clinic", ... },
..\..\docs\core\SCHEMA_MAPPING.md:701:각 CTAConfig는 `MedicalClinic.potentialAction` 또는 `contactPoint`로 변환.
..\..\docs\core\SCHEMA_MAPPING.md:724:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
..\..\docs\core\SCHEMA_MAPPING.md:734:2. `MedicalClinic` (해당 지점 풀필드) — **[풀]** — `parentOrganization` Organization 참조
..\..\docs\core\SCHEMA_MAPPING.md:740:**MedicalClinic 필드 매핑 (지점 LocationProfile)**:
..\..\docs\core\SCHEMA_MAPPING.md:742:P-001의 본원 `MedicalClinic`과 동일 구조 + 다음:
..\..\docs\core\SCHEMA_MAPPING.md:750:> 본원(`@id: #clinic`)과 지점(`@id: /locations/{slug}#clinic`)은 다른 entity. `branchOf`는 Schema.org의 LocalBusiness 계열에서 더 적합 (MedicalClinic은 `parentOrganization`을 우선).
..\..\docs\core\SCHEMA_MAPPING.md:757:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀].
..\..\docs\core\SCHEMA_MAPPING.md:761:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀].
..\..\docs\core\SCHEMA_MAPPING.md:765:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀]. 사진은 본문 갤러리 또는 `WebPage.image: ImageObject[]`로 표현 (`ImageGallery`는 사용 안 함 — 카탈로그·결정표 미등재).
..\..\docs\core\SCHEMA_MAPPING.md:768:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage`[풀] + `BreadcrumbList`[풀] + (개별 News 항목) `NewsArticle` 또는 `Article`[풀].
..\..\docs\core\SCHEMA_MAPPING.md:772:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[**풀**, § 2.5 — 예약 action 풀 entity 필요] + `WebPage`[풀] + `BreadcrumbList`[풀].
..\..\docs\core\SCHEMA_MAPPING.md:773:`MedicalClinic.potentialAction`에 `ReserveAction` 상세 필드 포함 (P-012와 유사하되 예약 안내 페이지답게 채널·시간·절차 등 상세 명시). ReserveAction은 독립 풀 entity가 아닌 `MedicalClinic.potentialAction`에 중첩되는 구조.
..\..\docs\core\SCHEMA_MAPPING.md:776:**Graph 구성**: `Organization`[풀] + `MedicalClinic`(본원)[참조만, § 2.5] + `WebPage` 또는 `MedicalWebPage`[풀] + `BreadcrumbList`[풀]. **`Quiz`·`MedicalDiagnosis`·`MedicalRiskEstimator`는 fail** (§ 2.4·§ 8). 일반 정보 형태의 `MedicalWebPage` 또는 단순 `WebPage`만.
..\..\docs\core\SCHEMA_MAPPING.md:785:| C-02 `DoctorProfile` | `Physician` | M0는 `Article.author: Ref<C-02>`만 지원. 비의료인 author(`authorType` != `clinician`) → `Person` 매핑은 데이터 모델 확장 후 합류 (M0 외) |
..\..\docs\core\SCHEMA_MAPPING.md:795:| C-12 `FAQ` | `FAQPage.mainEntity[].Question/Answer` | |
..\..\docs\core\SCHEMA_MAPPING.md:803:| C-20 `ReservationPage` | `MedicalClinic.potentialAction.ReserveAction` (LocalBusiness 별도 출력 안 함) | |
..\..\docs\core\SCHEMA_MAPPING.md:804:| C-21 `LocationProfile` | `MedicalClinic` (지점 단위 별도 entity. LocalBusiness sub-class) | 본원·지점 각각 |
..\..\docs\core\SCHEMA_MAPPING.md:846:| `map` | `MedicalClinic.hasMap`: targetUrl |
..\..\docs\core\SCHEMA_MAPPING.md:883:| P-006 Treatment Detail | `treatment: TreatmentPage`, `relatedDoctors: DoctorProfile[]`, `relatedConditions: MedicalConditionPage[]`, `faqs: FAQ[]` |
..\..\docs\core\SCHEMA_MAPPING.md:884:| P-008 Condition Detail | `condition: MedicalConditionPage`, `relatedTreatments: TreatmentPage[]`, `faqs: FAQ[]` |
..\..\docs\core\SCHEMA_MAPPING.md:886:| P-011 FAQ | `faqs: FAQ[]` |
..\..\docs\core\SCHEMA_MAPPING.md:914:| P-001·P-002·P-006·P-012·P-014 (필수) / P-105 (활성화 시) | **`MedicalClinic` 풀** (§ 2.5 풀 지정) + `name`·`address`·`telephone`·`openingHoursSpecification` |
..\..\docs\core\SCHEMA_MAPPING.md:919:| P-011 | `FAQPage` + `mainEntity[]` 최소 1개 |
..\..\docs\core\SCHEMA_MAPPING.md:957:| `HealthAndBeautyBusiness` (단독·병행) | **fail** | 의료기관 사이트는 MedicalClinic만 |
..\..\docs\core\SCHEMA_MAPPING.md:983:| 2026-05-14 | v0.1 | 최초 작성 — 통합 graph 표준, M0 필수 14종 풀 graph 매핑, 선택 7종 간략 매핑, 데이터 계약↔schema 필드 매핑 인덱스, SchemaInput 정식 정의 (C-15), 빌드 검증, 금지·주의 schema 8종 |
..\..\docs\core\SCHEMA_MAPPING.md:984:| 2026-05-14 | v0.2 | **피드백 정합 정정**: (1) **C-15/CT-15 혼동 → C-15로 통일** (SchemaInput은 데이터 계약, CT 아님), (2) **inLanguage 정책 좁힘** — CreativeWork·페이지 entity에만, (3) **MedicalClinic 사용처 정합** — § 2.1 카탈로그 "전 페이지 본원 1개 포함" 명시 (그래프 정의와 일치), (4) **P-002 About 정정** — address 매핑 제거(LocationProfile SoT), mediaCoverage는 sameAs 또는 CreativeWork 보조로, (5) **ItemList inline 필드 추가** — P-003/P-005/P-007/P-009에 name·url·image·기타 최소 필드 + @id 참조 병행, (6) **List 페이지 그래프에 WebPage 추가** — § 7.1 검증 룰과 정합 (이전 누락), (7) **evidenceNotes 매핑 보수화** — `MedicalStudy` → `citation`/`CreativeWork` (EvidenceNote 필드로 MedicalStudy 구성 부족), (8) **§ 2.3 신규** — Schema Rich Results 실효 vs Entity 의미 전달 분류 |
..\..\docs\core\SCHEMA_MAPPING.md:985:| 2026-05-14 | v0.3 | **빌드 가능 규칙화** (피드백 10건): (1) **§ 1.1 Core 출력 범위 한정** — 외부 위젯 schema 충돌 가능성 명시, (2) **§ 1.4 본원 @id 일관성 (SM-05 해소)** — `/#clinic` 단일 entity, 다지점 비본원만 `/locations/{slug}#clinic`, alias 금지, (3) **§ 2.1 WebSite Home 전용** — 다른 페이지는 `isPartOf` 참조만, (4) **§ 2.1 Person M0 외 후속** — authorType != clinician은 데이터 모델 확장 후, (5) **§ 2.4 신규 — Allowed/Conditional/Blocked 3단계 분류**, (6) **§ 3 P-010 graph 구성 [풀]/[참조+inline]/[참조만] 표기 명확화** + VideoObject Google Rich Results 최소 필드 (name·description·thumbnailUrl·uploadDate·contentUrl/embedUrl), (7) **§ 5.1 dayOfWeek enum 변환표** + specialClosures 기본 미출력 정책, (8) **§ 7.2 빌드 게이트 vs 운영 모니터링 분리** — 공식 validator는 모니터링·수동 QA로, (9) **§ 7.3 룰 레벨 분류 (fail/warning/content-gate)** + **§ 8 표에 룰 레벨 명시** |
..\..\docs\core\SCHEMA_MAPPING.md:986:| 2026-05-14 | v0.4 | **잔재 정리·룰 충돌 해소** (피드백 8건): (1) **§ 2.3 A/B 카테고리 풀명세 재펼침** ("이전과 동일" 잔재 제거), (2) **inLanguage 잔재 4곳 제거** — Organization·MedicalClinic·Physician·MedicalProcedure 매핑 표, (3) **MedicalRiskFactor 룰 충돌 해소** — schema 출력은 **fail로 통일**, 본문 표현(원인·위험요인)은 별도 content-gate 분리, (4) **§ 9 미결정 정리** — SM-05·SM-07 "해소" 표시, (5) **P-106 Quiz 제거** — `WebPage`/`MedicalWebPage`만, (6) **P-103 ImageGallery 제거** — 본문 갤러리 또는 `WebPage.image: ImageObject[]`, (7) **§ 5 C-02 Person 후속** 명시 (M0 외), (8) **§ 7.3 warning 예시에서 MedicalRiskFactor 제거** (fail로 통일) — `MedicalIndication` 단정형·`HealthAndBeautyBusiness` 단독 사용 등으로 교체 |
..\..\docs\core\SCHEMA_MAPPING.md:987:| 2026-05-14 | v0.5 | **미세 잔재 해소·룰 단순화** (피드백 7건): (1) **P-008 riskFactor → MedicalRiskFactor 행 삭제** — fail 정책 정합. causes[]는 description 보조·본문 표현으로, (2) **P-008 주석 정정** — "신중" → "schema 출력 안 함, 본문은 content-gate", (3) **HealthAndBeautyBusiness fail로 통일** (§ 2.4·§ 8 모두) — 단독·병행 모두 미사용, (4) **MedicalIndication fail로 통일** — Schema 출력 금지, 본문 효능 표현만 content-gate, (5) **HowTo Rich Results A 목록에서 제거** — 미사용. 미래 확장 시 카탈로그·결정표·의료 리스크 룰 추가, (6) **§ 2.4에 Person 두 케이스 분리** — Organization.founder는 Allowed inline / Article.author (non-clinician)는 M0 외 후속, (7) **VideoObject 필수 필드 표현 명확화** — `name·description·thumbnailUrl·uploadDate` 4개 필수 + `contentUrl`/`embedUrl` 중 1개 |
..\..\docs\core\SCHEMA_MAPPING.md:988:| 2026-05-14 | v0.6 | **정책 표 정합화** (피드백 7건): (1) **§ 2.5 신설 — 공통 entity별 페이지 출력 정책 (단일 SoT)** — Organization/WebSite/MedicalClinic의 풀 entity vs 참조 위치 명시. § 7.1 룰 checker가 본 표 기준으로 검증, (2) "풀 entity vs 참조" 용어 정의 — graph[]에 entity 정의 여부 명확, (3) **§ 0 요약 일관화** — "신중하게" → fail로, validator 표현을 § 7.2와 일치 (자체 checker = 빌드, 공식 validator = 모니터링), (4) **LocalBusiness 별도 출력 제거** — § 2.1·§ 5 C-20 정정. `MedicalClinic`이 LocalBusiness sub-class이므로 `@type: "MedicalClinic"`만 사용, LocalBusiness 계열 속성 활용, (5) **SearchAction Conditional** — `/search` 라우트 부재 시 미출력 (M0 미출력, 검색 기능 활성화 시 합류), (6) **§ 7.3 warning 예시 교체** — MedicalIndication·HealthAndBeautyBusiness 제거(둘 다 fail). 비차단 항목(외부 위젯 @id 충돌·VideoObject 권장 필드 누락·본문 길이 미달 등)으로 교체 |
..\..\docs\core\SCHEMA_MAPPING.md:989:| 2026-05-14 | v0.7 | **§ 2.5 SoT 기준 일괄 동기화** (피드백 7건): (1) **§ 2.1 SearchAction Conditional 명시**, **ReserveAction을 LocalBusiness → MedicalClinic.potentialAction**으로 정정, (2) **§ 2.4 MedicalClinic 결정 변경** — "본원 1개 전 페이지" → "§ 2.5 정책에 따라 full 또는 ref", (3) **§ 2.5 P-105 Reservation 풀 entity로 재분류**, P-101~P-106 일괄 ref 거친 표현 세분화, (4) **§ 3·§ 4 페이지별 graph 구성 [풀]/[참조]/[참조+inline] 표기 일괄 적용** — P-003·P-004·P-007·P-008·P-009·P-010·P-011·P-013·P-101~P-106, (5) **§ 7.1 검증 룰 정정** — "PageMeta.canonical 필수" → "**resolved canonical URL 필수** (PageMeta.canonical 또는 SchemaInput.canonicalUrl로 결정)" |
..\..\docs\core\SCHEMA_MAPPING.md:990:| 2026-05-14 | v0.8 | **§ 2.5 cascade 마무리** (피드백 6건): (1) **P-005 MedicalClinic [참조만]로 변경** — PAGE_TYPES § 3 P-005에 위치 정보 슬롯 없음. § 2.5 풀 지정 페이지에서 제거, (2) **P-005·P-006·P-012·P-014 [풀]/[참조] 표기 적용** — v0.7 일괄 적용 시 누락된 페이지 보완, (3) **P-014 @id 분기 명시** — 단지점 main = `#clinic` (본원 entity와 동일), 다지점 비본원 = `/locations/{slug}#clinic` (별도 entity), (4) **§ 7.1 일반 검증 룰 추가** — "§ 2.5에서 풀로 지정된 entity는 해당 페이지 필수" (룰 checker의 일반 룰. 페이지별 명시는 보조), (5) **§ 7.1 MedicalClinic 풀 페이지 목록 확장** — P-001·P-002·P-006·P-012·P-014·P-105 (이전 P-012·P-014만), (6) **§ 2.1 ReserveAction Conditional 명확화** — "reservationChannels 또는 페이지 예약 CTA가 실제 있을 때만" |
..\..\docs\core\SCHEMA_MAPPING.md:992:| 2026-05-14 | v0.10 | **미세 표현 정합** (피드백 4건): (1) § 3 P-001 MedicalClinic potentialAction 행에 "페이지/시술 CTA가 예약 채널일 때"도 포함 명시, (2) § 4 P-105 — "ReserveAction 풀필드" → "**상세 필드 포함** (독립 entity 아닌 MedicalClinic.potentialAction 중첩 구조)", (3) § 7.1 선택 페이지 검증 기준에 **InstanceManifest 추가** — P-103·P-104·P-105는 Instance 결정·P-106은 Feature Module 기반 등 활성화 경로 다양화, (4) **§ 2.2 제목에 "룰 레벨 상세는 § 8" 명시** — fail/warning/content-gate 기조와 정합 |

 succeeded in 754ms:
3:> **상태**: **v0.2 (draft)** — Codex 자동 비평 cycle 1 (22 findings: 7 blocking + 10 major + 5 minor) 전건 수용 patch. PUBLIC_SITE_RENDER code v1.0 acceptance 직후 진입하는 첫 신규 콘텐츠 타입 plan. Lovable 사이트 (다이트한의원 부평점) 의 콘텐츠 종류 매핑에서 우리 명세에 누락된 부분 (논문·미디어·FAQ 풀명세 + ArticleCategory 실 운영) 을 Core 계약으로 확정한다. 1:1 상담 게시판은 본 plan 외 (EC-DEFER-01).
9:| Publication | **신규** | C-24 (현 인벤토리 빈 슬롯) |
10:| MediaAppearance | **신규** | C-25 (인벤토리 추가) |
11:| Faq | **C-12 풀명세 합류 + M0 합류** (기존 간략 명세 → 풀명세) | C-12 (기존) |
12:| ArticleCategory | **C-22 실 운영 합류 + M0 합류** (기존 풀명세 — v0.1 단계 flat 1-level minimal, parentCategory/pillar 등 optional 컬럼은 DB 추가하되 어드민 UI/공개 렌더는 v0.1 미사용) | C-22 (기존) |
14:모든 entity 는 schema.org JSON-LD 로 출력되어 P-004 Doctor Profile · P-002 About · P-011 FAQ 페이지에 합류한다.
16:> **scope limit (EC-INTRO-01)** — 본 plan 은 다음만 다룬다: (1) C-24 Publication · C-25 MediaAppearance 신규 + C-12 Faq · C-22 ArticleCategory 합류. (2) DATA_MODEL C-10 `contentType` enum cascade (+Publication +MediaAppearance). (3) PSR-DEFER-11(부분: FAQ P-011) · PSR-DEFER-15 (Article category required) 해소. (4) PUBLIC_SITE_RENDER code v1.0 의 D0011 GRANT cascade (D0014). **본 plan 외**: Inquiry (1:1 상담 게시판 — PIPA 큰 결정), Reviews/Pricing High-risk commercial, Publication/MediaAppearance 별도 페이지 (모두 EC-DEFER).
20:- `docs/core/DATA_MODEL.md` v0.9 — § 1.1 인벤토리 (23 → 25 contracts) · § 4 C-12 / C-22 풀명세 + C-24 Publication · C-25 MediaAppearance 신규 (EC-CASCADE-01) · § 4 C-10 `contentType` enum 확장 (+ Publication +MediaAppearance) · § 4 C-04 Article `category` required 정합
21:- `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ — M0 미합류 → 본 plan 합류 (EC-CASCADE-08)
22:- `docs/core/SCHEMA_MAPPING.md` § 1.2 `@id` 패턴 · § 2 entity 카탈로그 (+ ScholarlyArticle, VideoObject) · § 3 P-011 FAQ graph (EC-CASCADE-02)
24:- `docs/core/CONTENT_STANDARDS.md` v1.3 § 7.1.1.x — Publication/MediaAppearance 외부 인용 면제 · FAQ Q/A 광고 표현 검수 적용 (EC-CASCADE-03)
25:- `docs/compliance/RISK_LEVELS.md` v1.1 § 2 — FAQ 자동 추론 대상 (의료 질문 = Medium/High 후보), Publication/MediaAppearance Low fixed
26:- `docs/admin/ARCHITECTURE.md` § 3 — Vertical Slice 안 P-011 FAQ 페이지 합류 marker (EC-CASCADE-09)
27:- `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` v1.0 § 1.3 PSR-DEFER-11 (FAQ 부분 해소) + PSR-DEFER-15 (Article category 해소) (EC-CASCADE-07)
29:- `docs/decisions/M0_BUILD_EXPORT_PLAN.md` v0.1 § 2.1 — 신규 entity Git 출력 cascade (EC-CASCADE-04)
30:- `packages/db/migrations/D0011_public_reader.sql` — D0014 cascade target (EC-CASCADE-05)
31:- `packages/migrations-runner/src/manifest.ts` — 16 단계 (현 10 + C0009/10/11/12/13 + D0014) (EC-CASCADE-06)
37:  - `apps/web/src/lib/json-ld/__tests__/validate.ts` (cross-page allowlist + tenant base path)
44:- **E-A-T 시그널 강화** — Doctor Profile 의 학술 권위(Publication) 와 미디어 권위(MediaAppearance) 가 schema.org `ScholarlyArticle` / `VideoObject` 로 표현되어 검색 entity recognition 강화.
45:- **AEO 직접 매핑** — FAQ 의 `FAQPage` JSON-LD 는 네이버 스마트블록 · AI Overview · 답변 봇에 직접 인용 가능.
47:- **Article category 필수화 (PSR-DEFER-15 해소)** — C-04 Article `category Ref<C-22>` required SoT 정합 — DB NOT NULL 전환 + URL `[category]` 실 DB join.
53:| C-24 Publication 신규 entity | 외부 학술 자료 인용 · authors[]·journal·publishedDate·doi/pubmedId·url·summary·authorDoctorId(optional FK to doctor_profile). DATA_MODEL § 1.1 인벤토리 25 contracts (cycle 1 ECP-01 정정) |
54:| C-25 MediaAppearance 신규 entity | 미디어 출연 · channelName·channelType·publishedDate·durationSeconds·url·thumbnailUrl·summary·authorDoctorId(optional). 모든 channel_type 을 schema.org `VideoObject` 로 단일화 v0.1 (cycle 1 ECP-05 정합) — BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 신설 (M1 cascade) |
55:| C-12 Faq 풀명세 합류 | DATA_MODEL § 5 간략 명세를 풀명세로 (EC-CASCADE-01) + M0 합류 |
56:| C-22 ArticleCategory 실 운영 합류 (PSR-DEFER-15 해소) | DATA_MODEL § 4 기존 풀명세 (parentCategory·pillar·coverImageUrl·seoMeta·articleTypeDefault) — DB 컬럼은 모두 추가 (optional · v0.1 nullable). 어드민 UI/공개 렌더는 v0.1 minimal (slug·name·displayOrder만 노출 · 나머지 EC-DEFER-10 M1) |
58:| C-10 contentType enum cascade (cycle 1 ECP-07 정정) | 기존 enum 15종 + `Publication` + `MediaAppearance` = 17종. FAQ · ArticleCategory · LegalDocument · Feature 는 이미 enum 안 (토큰 그대로 사용 — `FAQ` 대문자) |
59:| 마이그레이션 5건 + D0014 | C0009 article_category · C0010 publication · C0011 media_appearance · C0012 faq · C0013 article_category_fk + backfill + SET NOT NULL · D0014 public_reader_eat |
60:| D0014 GRANT + per-table policy (cycle 1 ECP-16 정정) | D0011 패턴 정합 — publication/media_appearance/faq 는 published only · article_category 는 instance_id only (taxonomy public 의도 명시 — 분류 자체는 RLS instance scope · status 없음) |
61:| 어드민 폼 4종 (CRUD) | PublicationForm · MediaAppearanceForm · FaqForm · ArticleCategoryForm. 패턴 = M0 3-entity 폼 + REVIEW_WORKFLOW status 9-state |
62:| status zod enum subset (cycle 1 ECP-10·11 정정) | v0.1 단계 status zod = `z.enum(['draft'])` 만 — compliance-assistant 합류 (EC-DEFER-05) 전까지 모든 4 entity 어드민 폼에서 published 차단. **FAQ 도 published 차단** (위험도 자동 추론 합류 전 Medium/High 자동 발행 회피). LegalDocument 패턴 정합 |
63:| 공개 페이지 P-011 FAQ 신설 (cycle 1 ECP-12 정정 — PAGE_TYPES M0 합류 EC-CASCADE-08 acceptance precondition 격상) | `/<slug>/faq` route — FaqList + FAQPage JSON-LD |
64:| Doctor Profile (P-004) 확장 | Publications + MediaAppearances **graph 안 풀 entity 출력** (cycle 1 ECP-06·13 정정 — cross-page ref + allowlist 옵션 폐기). `@id` = fragment-scoped: `${doctorProfileUrl}#publication-{slug}` · `${doctorProfileUrl}#video-{slug}` |
65:| About (P-002) 확장 | Doctor 외 author_doctor_id IS NULL 인 clinic-level Publications + MediaAppearances. graph 안 풀 entity. `@id` = `${aboutUrl}#publication-{slug}` · `${aboutUrl}#video-{slug}` |
66:| MedicalClinic.subjectOf 통일 (cycle 1 ECP-15 정정) | About P-002 의 publication/media reference 는 `MedicalClinic.subjectOf` array (Organization 미사용 단일 결정) |
67:| Article URL category 실 join (PSR-DEFER-15 해소 · cycle 1 ECP-17 정정) | `insights/[category]/[slug]/page.tsx` 의 SQL 을 `article JOIN article_category ON article.category_id = article_category.id WHERE article_category.slug = ${params.category}` 로 patch |
68:| JSON-LD generator 추가 | ScholarlyArticle · VideoObject (모든 channel_type) · FAQPage · Question · Answer + graph 안 풀 entity 출력 |
69:| sitemap.xml 확장 | P-011 FAQ entry (changefreq monthly · priority 0.5 · lastmod `MAX(faq.updated_at)`) — published row 0건이어도 페이지 포함 (cycle 1 ECP-21 정정) |
70:| FAQ helper 2 종 (cycle 1 ECP-19 정정) | `renderMarkdownToHtml` (public HTML rendering · 기존) + 신규 `renderMarkdownToPlainText` (JSON-LD Answer text · strip + sanitize) |
71:| Markdown sanitize rel 통일 (cycle 1 ECP-20 정정) | 외부 링크 `nofollow noopener noreferrer` (PSR-20 정합 — Publication/Media external link 도 동일) |
72:| PSR-CASCADE-04 D0011 GRANT cascade | publication · media_appearance · faq · article_category 4 table — D0014 신규 migration |
73:| CONTENT_STANDARDS § 7.1.1.x 확장 | Publication/MediaAppearance 외부 인용 면제 · FAQ Q/A 광고 표현 검수 적용 |
81:| Inquiry (1:1 상담 게시판) 신규 entity | 별 cycle — 회원 가입 / 익명 처리 / PIPA 보관 정책 큰 결정 | EC-DEFER-01 |
82:| Publication / MediaAppearance 별도 페이지 (P-Publications · P-MediaAppearances) | M1 Phase Alpha — 학술 인용·미디어 출연 페이지 자체 색인 가치 평가 후 | EC-DEFER-02 |
83:| Publication PDF / DOI 자동 메타데이터 fetch (CrossRef API) | M1 Phase Alpha — 외부 API provider gate | EC-DEFER-03 |
84:| MediaAppearance 동영상 embed (YouTube iframe 등) | M1 Phase Alpha — CSP 결정 | EC-DEFER-04 |
85:| FAQ 자동 검수 (compliance-assistant + RiskRule + RiskInference) 완전 통합 | compliance-assistant Feature 본 구현 cascade | EC-DEFER-05 |
86:| FAQ 다국어 (`inLanguage`) | M3 다국어 cascade | EC-DEFER-06 |
87:| Publication / MediaAppearance 검수 워크플로우 (status='review-queued' 전이 + ComplianceRecord pre-publish) | LL-DEFER-01 patterns 동일 — compliance-assistant + ComplianceRecord 합류 | EC-DEFER-07 |
88:| Reviews (P-101 후기) · Pricing (P-102) High-risk commercial 페이지 | M1+ 별 plan — MEDICAL_AD_COMPLIANCE_COMMON 검토 후 | EC-DEFER-08 |
89:| FAQ.metadata.featuredOnHome — Home 안 inline 표시 | M1 Phase Alpha | EC-DEFER-09 |
90:| ArticleCategory 트리/계층 (parentCategory) · 메타 컬럼 (pillar · coverImageUrl · seoMeta · articleTypeDefault) 어드민 UI/공개 렌더 사용 | M1 Phase Alpha — v0.1 DB 컬럼은 추가하되 UI/렌더 미사용 | EC-DEFER-10 |
91:| MediaAppearance channel_type 별 schema.org `@type` 분기 (broadcast → BroadcastEvent · press → NewsArticle) | M1 Phase Alpha — v0.1 모두 VideoObject 단일화 | EC-DEFER-11 |
92:| 4 entity 어드민 published 발행 (status='published' 전이) | EC-DEFER-05 와 동일 시점 — compliance-assistant 합류 + Faq risk_level 자동 추론 후 | EC-DEFER-12 |
96:### 2.1 C-22 ArticleCategory 실 DB 구현 (EC-SCHEMA-01) — cycle 1 ECP-02 정정
98:DATA_MODEL § 4 C-22 풀명세 전체 컬럼을 DB 에 추가 (v0.1 단계 어드민 UI 는 minimal — slug·name·displayOrder 만 노출 · 나머지 EC-DEFER-10):
101:-- packages/core-content/migrations/C0009_article_category.sql
103:CREATE TABLE article_category (
109:  pillar TEXT,                                  -- DATA_MODEL C-22 풀명세 · v0.1 nullable (EC-DEFER-10)
110:  parent_category_id UUID,                       -- 계층 구조 · v0.1 nullable (EC-DEFER-10) · same-tenant composite FK
118:  CONSTRAINT article_category_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
119:  CONSTRAINT article_category_name_length CHECK (length(name) BETWEEN 1 AND 50),  -- C-22 SoT 1~50
120:  CONSTRAINT article_category_description_length CHECK (description IS NULL OR length(description) BETWEEN 80 AND 200),
121:  CONSTRAINT article_category_cover_image_url_format CHECK (cover_image_url IS NULL OR cover_image_url ~ '^https?://'),
122:  CONSTRAINT article_category_instance_slug_unique UNIQUE (instance_id, slug),
123:  CONSTRAINT article_category_instance_id_unique UNIQUE (instance_id, id),
124:  CONSTRAINT article_category_parent_fk FOREIGN KEY (instance_id, parent_category_id)
125:    REFERENCES article_category (instance_id, id) ON DELETE NO ACTION
128:CREATE INDEX article_category_instance_idx ON article_category (instance_id);
129:CREATE INDEX article_category_order_idx ON article_category (instance_id, display_order, id);
130:CREATE INDEX article_category_parent_idx ON article_category (instance_id, parent_category_id)
133:ALTER TABLE article_category ENABLE ROW LEVEL SECURITY;
134:ALTER TABLE article_category FORCE ROW LEVEL SECURITY;
135:CREATE POLICY tenant_isolation ON article_category FOR ALL TO app_tenant_user
138:GRANT SELECT, INSERT, UPDATE, DELETE ON article_category TO app_tenant_user;
142:- (EC-SCHEMA-02) C-22 풀명세 전체 컬럼 추가. v0.1 어드민 UI minimal — slug·name·displayOrder 만 노출. parentCategory·pillar·coverImageUrl·seoMeta·articleTypeDefault 는 DB 컬럼만 존재 + EC-DEFER-10 marker.
143:- (EC-SCHEMA-03 · cycle 1 ECP-09 정정) **default `general` ArticleCategory seed 위치 = `apps/web/src/seed.ts`** — instance 생성 시 자동 INSERT (`{slug: 'general', name: '일반', display_order: 0}`). 기존 instance 가 있을 때는 backfill 마이그레이션 (C0013 안에서 INSERT IF NOT EXISTS) 으로 보장. C0013 dependsOn = article_category + article.
149:-- packages/core-content/migrations/C0013_article_category_fk.sql
154:-- (2) instance 별 default `general` ArticleCategory row INSERT (기존 instance backfill — idempotent)
155:INSERT INTO article_category (instance_id, slug, name, display_order)
159:  SELECT 1 FROM article_category ac
163:-- (3) 기존 article row 의 category_id backfill (`general` ArticleCategory row 의 id)
166:FROM article_category ac
175:ALTER TABLE article ADD CONSTRAINT article_category_fk
177:  REFERENCES article_category (instance_id, id)
180:CREATE INDEX article_category_idx ON article (instance_id, category_id);
185:- (EC-SCHEMA-07) C-04 Article SoT `category Ref<C-22>` required 정합.
187:### 2.3 C-24 `publication` 신규 table (EC-SCHEMA-08)
244:- (EC-SCHEMA-10) `risk_level='Low'` CHECK 고정 — Publication 외부 인용 entity, Low 외 등급 불필요. EC-DEFER-07 까지.
246:### 2.4 C-25 `media_appearance` 신규 table (EC-SCHEMA-11) — cycle 1 ECP-05 정합
301:- (EC-SCHEMA-12 · cycle 1 ECP-05 정합) `media_channel_type` enum 4종 (broadcast/youtube/podcast/press) — DB column 자체는 4종 모두 허용. **JSON-LD `@type` 매핑은 v0.1 단계 모든 4종 → `VideoObject` 단일화**. fragment 도 `#video-{slug}` 단일. BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1 cascade).
303:### 2.5 C-12 `faq` 풀명세 합류 신규 table (EC-SCHEMA-13)
316:  related_treatment_id UUID,                    -- C-12 SoT 풀명세 · v0.1 nullable (EC-DEFER-09 와 함께 다음 cycle)
321:  compliance_record_id UUID,                     -- compliance-assistant 합류 시 ref (EC-DEFER-05)
334:    REFERENCES article_category (instance_id, id) ON DELETE NO ACTION,
358:- (EC-SCHEMA-14 · cycle 1 ECP-10·11 정정) v0.1 단계 `status='draft'` + `published_at IS NULL` CHECK 강제 — **published 자체 차단**. compliance-assistant + risk_level 자동 추론 합류 (EC-DEFER-05) 까지. LegalDocument LL-SCHEMA-03·LL-SCHEMA-04 패턴 정합.
359:- (EC-SCHEMA-15) C-12 SoT 의 `relatedTreatment` · `relatedCondition` 필드 — DB nullable column 추가. v0.1 어드민 UI 미노출 (EC-DEFER-09 와 함께 다음 cycle).
361:### 2.6 D0014 GRANT 확장 (EC-SCHEMA-16) — cycle 1 ECP-16 정정
364:-- packages/db/migrations/D0014_public_reader_eat.sql (EC-CASCADE-05)
366:-- article_category: taxonomy public 의도 — instance_id only USING (status 없음).
369:GRANT SELECT ON article_category, publication, media_appearance, faq TO app_public_reader;
371:CREATE POLICY public_reader_article_category_select
372:  ON article_category FOR SELECT TO app_public_reader
393:-- FAQ: v0.1 단계 DB CHECK 가 status='draft' 만 허용. RLS published 만 SELECT → 자동 0 row → /faq 빈 페이지.
404:- (EC-SCHEMA-17) ArticleCategory taxonomy public — instance_id only RLS. 분류 자체는 status 없음. 운영 중 추가한 카테고리는 즉시 public_reader 에 노출. **본 결정의 정당성**: 카테고리는 콘텐츠 카탈로그 (Article/Faq 의 분류) — 자체 콘텐츠 게시는 아님. URL `/<slug>/insights/<category>/...` 가 작동하려면 모든 카테고리가 lookup 가능해야. status 게이트는 분류 미사용 단계에서도 article URL routing 차단 → 운영 부담. EC-DEFER-10 phase 의 어드민 UI 합류 시 `active` flag 추가 cascade.
406:## 3. C-10 contentType enum cascade (EC-CASCADE-01 일부) — cycle 1 ECP-07 정정
408:DATA_MODEL § 4 C-10 `contentType` enum 확장:
412:| `ClinicProfile` · `DoctorProfile` · `TreatmentPage` · `MedicalConditionPage` · `Article` · `FAQ` · `ReviewPolicy` · `PricingPage` · `FacilitiesPage` · `NewsItem` · `ReservationPage` · `LocationProfile` · `ArticleCategory` · `LegalDocument` · `Feature` | + `Publication` + `MediaAppearance` |
415:- (EC-CONTENT-04 · cycle 1 ECP-07 정정) audit emit `content-saved` payload 의 `contentType` 토큰 = SoT enum 그대로. FAQ 는 대문자 `FAQ`. Publication/MediaAppearance 는 PascalCase. ArticleCategory 도 PascalCase 기존.
416:- (EC-CONTENT-05) ComplianceRecord (C-10) 의 `contentType` enum 확장 cascade.
424:| ArticleCategory | `/admin/<slug>/categories` |
425:| Publication | `/admin/<slug>/publications` |
426:| MediaAppearance | `/admin/<slug>/media-appearances` |
433:const statusSchema = z.enum(['draft']);  // EC-DEFER-12 까지 — compliance-assistant + risk 자동 추론 합류 시점
436:- mapDbErrorToResult 안 `faq_status_v01_limit` · `faq_published_at_null_v01` 매핑 — formError "FAQ 발행은 compliance-assistant + 위험도 자동 추론 합류 후 가능합니다 (EC-DEFER-05·12)".
437:- Publication / MediaAppearance 도 v0.1 단계 `status='draft'` 만 (DB CHECK 없이 form schema 만 — 향후 운영자가 직접 published 가능 marker EC-DEFER-12). 두 entity 의 외부 인용 자체는 risk Low fixed 이지만 v0.1 단계 통일 정책.
442:- **Publication**: title (1~300) · authors (string[] min 1) · journal · publishedDate ISO · doi (DB 와 동일 anchored regex `^10\.[0-9]{4,9}/[-._;()/:A-Z0-9a-z]+$`) · pubmedId (`^[0-9]{1,9}$`) · url (http(s)://) · summary (50~300) · authorDoctorId UUID (optional) · status `z.enum(['draft'])`
443:- **MediaAppearance**: title · channelName · channelType enum 4종 · publishedDate · durationSeconds (positive int · optional) · url · summary · authorDoctorId · status `z.enum(['draft'])`
445:- **ArticleCategory**: slug regex · name (1~50 — C-22 SoT) · description (80~200 optional) · displayOrder int. v0.1 미노출 컬럼 (pillar·parent_category_id·cover_image_url·seo_meta·article_type_default) 는 form schema 에 미포함.
450:- `saveX(instanceSlug, _prev, formData)` — withSkeletonTx · zod parse · INSERT/UPSERT · audit emit (eventType `content-saved` · payload `{contentType: 'Publication'|'MediaAppearance'|'FAQ'|'ArticleCategory', slug, mode, status, originalSlug}`).
456:`/admin/<slug>/page.tsx` 안 4 신규 entity card 추가 (count + new link). 기존 4 card (Clinic·Doctors·Treatments·Articles) + 4 신규 (Categories·Publications·Media·FAQs) = 총 8 card.
460:### 5.1 P-011 FAQ 신규 페이지 (EC-RENDER-01) — PSR-DEFER-11 부분 해소
466:- JSON-LD: schema.org `FAQPage` + `Question`/`Answer` array (cycle 1 ECP-19 정정 — `renderMarkdownToPlainText` helper 사용). 0 row 면 `mainEntity: []` 빈 array 출력.
473:- **Publications** — `author_doctor_id = doctor.id` AND `status='published'` row. 카드 list — title · journal · publishedDate · authors[] · external link.
474:- **MediaAppearances** — `author_doctor_id = doctor.id` AND `status='published'` row. 카드 list — title · channelName · channelType badge · publishedDate · thumbnailUrl · duration (HH:MM 형식) · external link.
477:- Doctor Profile 페이지 graph 안에 Publication 풀 entity (ScholarlyArticle) 와 MediaAppearance 풀 entity (VideoObject) 출력 — graph self-contained.
479:  - Publication: `${siteBaseUrl}/doctors/${doctor.slug}#publication-${publication.slug}`
480:  - MediaAppearance: `${siteBaseUrl}/doctors/${doctor.slug}#video-${media.slug}`
481:- Physician.subjectOf 에 fragment ref array 출력 (graph 안 entity 들과 cross-ref).
482:- cross-page allowlist 미사용 — 모든 ref 가 graph 안 entity 또는 외부 dereferenceable URL (publication.url / media.url).
484:### 5.3 About (P-002) 확장 — MedicalClinic.subjectOf 단일 결정 (EC-RENDER-03) — cycle 1 ECP-15 정정
487:- **All Publications** — published row (author_doctor_id 무관). 모두 표시. 카드 list 동일.
488:- **All MediaAppearances** — published row (author_doctor_id 무관). 모두 표시.
491:- About 페이지 graph 안에 풀 entity 출력 — `MedicalClinic.subjectOf` array (publication·media). Organization.subjectOf 미사용 (단일 결정).
493:  - Publication: `${siteBaseUrl}/about#publication-${publication.slug}`
494:  - MediaAppearance: `${siteBaseUrl}/about#video-${media.slug}`
504:    JOIN article_category ac ON a.category_id = ac.id AND a.instance_id = ac.instance_id
510:- sitemap.xml 안 article URL 생성 시 article + article_category join → `/insights/${category.slug}/${article.slug}` 출력 (현 `general` 하드코딩 → 실 category slug).
517:- FAQ rendering 분기:
519:  - JSON-LD `FAQPage.mainEntity.Question.acceptedAnswer.text`: `renderMarkdownToPlainText(answer)`
525:- Publication / MediaAppearance 별도 페이지 없음 — sitemap 미추가 (EC-DEFER-02).
530:Publication / MediaAppearance 카드의 external `<a>` — `rel="nofollow noopener noreferrer"` + `target="_blank"` 통일 (PSR-20 정합).
532:## 6. SCHEMA_MAPPING 결정 — cycle 1 ECP-05·06·13·14·15 정정 (EC-CASCADE-02)
534:### 6.1 ScholarlyArticle entity (Publication)
555:### 6.2 VideoObject entity (MediaAppearance — 4 channel_type 모두) — cycle 1 ECP-05·14 정정 (단일화)
559:  "@type": "VideoObject",
571:**결정 (cycle 1 ECP-05·14 정정)**: 모든 4 channel_type (broadcast/youtube/podcast/press) → `VideoObject` 단일. fragment `#video-{slug}` 일관. allowlist 미사용 (모든 entity graph 안). BroadcastEvent/NewsArticle 분기는 EC-DEFER-11 (M1 cascade).
573:### 6.3 FAQPage (P-011) — cycle 1 ECP-19 정합
577:  "@type": "FAQPage",
596:| 페이지 | graph entities (cycle 1 ECP-06·13·15 정정 — graph self-contained · cross-page allowlist 미사용) |
598:| P-002 About | `[풀] Organization` · `[풀] MedicalClinic` · `[풀] WebPage` (with `MedicalClinic.subjectOf` array) · `[풀] BreadcrumbList` · `[풀] ScholarlyArticle[]` (all clinic publications) · `[풀] VideoObject[]` (all clinic media) |
599:| P-004 Doctor Profile | `[풀] Organization` · `[풀] Physician` (with `subjectOf` array) · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] ScholarlyArticle[]` (author=doctor publications) · `[풀] VideoObject[]` (author=doctor media) |
600:| P-011 FAQ | `[풀] Organization` · `[풀] WebPage` · `[풀] BreadcrumbList` · `[풀] FAQPage` (with Question[] inline `mainEntity`) |
603:- (EC-SEO-02 · cycle 1 ECP-06 정정) 모든 page 의 graph 가 self-contained — Publication/Media 가 표시되는 페이지에 풀 entity 출력. cross-page allowlist 사용 안 함.
605:- (EC-SEO-04 · cycle 1 ECP-15 정정) About 페이지의 publication/media reference 는 단일 결정 — `MedicalClinic.subjectOf`. Organization 미사용.
607:## 7. CONTENT_STANDARDS 결정 — cycle 1 ECP-07 정합 (EC-CASCADE-03)
609:`docs/core/CONTENT_STANDARDS.md` § 7.1.1.x ContentType 예외 표 확장 (DATA_MODEL C-10 contentType enum cascade 정합):
613:| `Publication` | **면제** (외부 학술 인용 · clinic 자체 표현 아님) | **면제** | **면제** (DB CHECK Low fixed) | **면제** |
614:| `MediaAppearance` | **면제** | **면제** | **면제** (DB CHECK Low fixed) | **면제** |
615:| `FAQ` Q | **적용** | **적용** (의료법 광고 표현 검수) | **적용** (compliance-assistant 합류 시 · EC-DEFER-05) | **적용** (Medium/High 자동 추론) |
616:| `FAQ` A | **적용** | **적용** | **적용** | **적용** |
617:| `ArticleCategory` | (콘텐츠 자체 없음 · 분류 메타) | — | — | — |
620:- (EC-CONTENT-01) Publication/MediaAppearance 면제 — 외부 인용. 클리닉 자체 권고 아님.
621:- (EC-CONTENT-02) FAQ 적용 — 클리닉 자체 답변 → 의료법 광고 표현 검수. RiskInference Medium/High 자동 (RISK_LEVELS § 2 정합).
622:- (EC-CONTENT-03) ArticleCategory taxonomy — 룰 없음.
626:- `packages/db/migrations/D0014_public_reader_eat.sql` (신규 · EC-CASCADE-05)
627:- `packages/core-content/migrations/C0009_article_category.sql` (신규)
631:- `packages/core-content/migrations/C0013_article_category_fk.sql` (신규 · staged migration 4 step · cycle 1 ECP-03·09 정합)
632:- `apps/web/src/seed.ts` patch — instance 생성 시 default `general` ArticleCategory row 자동 INSERT (EC-SCHEMA-03)
633:- `packages/migrations-runner/src/manifest.ts` patch — **16 단계 (현 10 + 6 신규)** — cycle 1 ECP-04 정정:
635:  - 11~16 (신규): C0009 article_category → C0010 publication → C0011 media_appearance → C0012 faq → C0013 article_category_fk (article ALTER + backfill + SET NOT NULL) → D0014 public_reader_eat
636:  - dependsOn 정합: C0010/C0011/C0012 dependsOn = `instance` + `doctor_profile` (authorDoctorId FK) + `content_publication_status` + `risk_level`. C0013 dependsOn = `article` + `article_category`. D0014 dependsOn = `article_category` + `publication` + `media_appearance` + `faq` + `app_public_reader` (D0011 의 role · creates).
644:| 26 | FAQ — v0.1 단계 published 차단 검증 | `INSERT ... status='published'` 시도 → CHECK `faq_status_v01_limit` 위반 (cycle 1 ECP-10·11 정합) |
645:| 27 | FAQPage graph 안 `mainEntity` 0건 (v0.1 published 차단 → 0 row) | self-rule-checker PASS · 빈 array OK |
646:| 28 | article.category_id = `general` ArticleCategory.id · URL `/<slug>/insights/general/<article-slug>` → 200 (DB join) | PSR-DEFER-15 해소 (cycle 1 ECP-17 정합) |
648:| 30 | Publication risk_level='Medium' 시도 → DB CHECK 위반 | `publication_risk_level_low_only` |
650:| 32 | VideoObject `duration` ISO 8601 (PT<seconds>S) — 모든 4 channel_type | broadcast/youtube/podcast/press 모두 `#video-{slug}` |
651:| 33 | Article 의 SQL JOIN article_category — category 미존재 (instance 안 row 없음) → 404 | category lookup 0 row → notFound |
652:| 34 | FAQ Markdown answer 안 `<script>` payload → JSON-LD `Answer.text` 평문 strip | renderMarkdownToPlainText 정합 |
653:| 35 | Doctor Profile graph self-contained — ScholarlyArticle/VideoObject 모두 fragment-scoped `@id` | rule checker PASS — cross-page allowlist 미사용 |
654:| 36 | ArticleCategory 운영 중 신규 INSERT → public_reader 즉시 SELECT (status 게이트 없음) | EC-SCHEMA-17 결정 정합 |
660:| 1 | C0009 article_category migration (C-22 풀명세 컬럼 전체) | packages/core-content/migrations/C0009_article_category.sql |
664:| 5 | C0013 article.category_id staged migration 4 step (cycle 1 ECP-03·09) | C0013_article_category_fk.sql (ADD COLUMN nullable + default category seed + backfill + SET NOT NULL + FK) |
665:| 6 | D0014 public_reader_eat GRANT + per-table policy (cycle 1 ECP-16) | packages/db/migrations/D0014_public_reader_eat.sql |
668:| 9 | 4 admin form (Publication·MediaAppearance·Faq·ArticleCategory) | apps/web/src/components/forms/{Publication,MediaAppearance,Faq,ArticleCategory}Form.tsx |
670:| 11 | mapDbErrorToResult constraint 매핑 추가 | apps/web/src/lib/errors.ts (publication_* · media_appearance_* · faq_* · article_category_*) |
671:| 12 | DB → projection 확장 | apps/web/src/lib/db-projection.ts (normalizePublication · normalizeMediaAppearance · normalizeFaq · normalizeArticleCategory) |
673:| 14 | JSON-LD builders 확장 (graph self-contained · fragment-scoped `@id`) | apps/web/src/lib/json-ld/builders.ts (faqPageGraph 신규 · doctorProfileGraph · aboutGraph patch — ScholarlyArticle/VideoObject 풀 entity inline) |
674:| 15 | (rule checker 변경 없음 — graph self-contained · allowlist 확장 불필요 · cycle 1 ECP-06·14 정정 결과) | (validate.ts 변경 없음) |
675:| 16 | P-011 FAQ public page (cycle 1 ECP-21 — 빈 페이지도 200) | apps/web/src/app/(site)/[instanceSlug]/faq/page.tsx + metadata + JsonLdScript |
676:| 17 | Doctor Profile (P-004) 확장 — Publications + MediaAppearances inline + graph self-contained | doctors/[slug]/page.tsx |
677:| 18 | About (P-002) 확장 — MedicalClinic.subjectOf 단일 결정 | about/page.tsx |
678:| 19 | Article URL `[category]` 실 DB join (cycle 1 ECP-17 — PSR-DEFER-15 해소) | insights/[category]/[slug]/page.tsx — SQL JOIN article_category |
679:| 20 | sitemap.xml 확장 — P-011 FAQ entry + article URL 실 category slug | (site)/[instanceSlug]/sitemap.xml/route.ts |
681:| 22 | seed 안 default `general` article_category row 자동 INSERT (cycle 1 ECP-09) | apps/web/src/seed.ts |
682:| 23 | manifest **16 단계** patch (cycle 1 ECP-04 정정) | packages/migrations-runner/src/manifest.ts |
685:| 26 | docs cascade — DATA_MODEL § 1.1 인벤토리 25 contracts · § 4 C-10 enum +2 · C-12 풀명세 · C-22 풀명세 컬럼 정합 · C-24 Publication · C-25 MediaAppearance 풀명세 (EC-CASCADE-01) · SCHEMA_MAPPING § 2 entity 카탈로그 · § 3 P-011 (EC-CASCADE-02) · CONTENT_STANDARDS § 7.1.1.x (EC-CASCADE-03) · PSR-DEFER-11/15 해소 marker (EC-CASCADE-07) · M0_BUILD_EXPORT § 2.1 (EC-CASCADE-04) · PAGE_TYPES § 1.1 P-011 M0 ✅ + § 3 본문 (EC-CASCADE-08 acceptance precondition — cycle 1 ECP-12 격상) · ARCH § 3 Vertical Slice 정합 (EC-CASCADE-09 — 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ) | doc patches |
690:- `EC-DEFER-01`: Inquiry (1:1 상담 게시판) — PIPA + 회원 인증 결정.
691:- `EC-DEFER-08`: Reviews/Pricing High-risk commercial 페이지.
694:- `EC-DEFER-02`: Publication / MediaAppearance 별도 페이지.
695:- `EC-DEFER-03`: DOI 자동 메타데이터 fetch (CrossRef API).
696:- `EC-DEFER-04`: 동영상 embed (YouTube iframe + CSP).
697:- `EC-DEFER-06`: FAQ 다국어.
698:- `EC-DEFER-09`: FAQ.metadata.featuredOnHome + related Treatment/Condition UI.
699:- `EC-DEFER-10`: ArticleCategory 풀명세 column (parentCategory/pillar/coverImageUrl/seoMeta/articleTypeDefault) 어드민 UI/공개 렌더.
700:- `EC-DEFER-11` (cycle 1 ECP-05 정정): MediaAppearance channel_type 별 schema.org `@type` 분기 (broadcast → BroadcastEvent · press → NewsArticle).
703:- `EC-DEFER-05`: FAQ 자동 검수 (compliance-assistant + RiskRule + RiskInference).
704:- `EC-DEFER-07`: 4 entity status='review-queued' 전이 + ComplianceRecord pre-publish.
705:- `EC-DEFER-12` (cycle 1 ECP-10·11 정정): 4 entity 어드민 published 발행 — EC-DEFER-05 합류 시점.
709:- `EC-CASCADE-01`: `docs/core/DATA_MODEL.md` patches:
710:  - § 1.1 인벤토리 25 contracts (+ C-24 Publication, C-25 MediaAppearance) · C-12 FAQ M0 ✅ · C-22 ArticleCategory M0 ✅ · C-24/25 row 추가.
711:  - § 4 C-10 `contentType` enum +2 (Publication, MediaAppearance) v0.6.
712:  - § 4 C-12 FAQ 간략 명세 → 풀명세 (question 10~200, answer 50~2000 Markdown · category Ref<C-22> optional · relatedTreatment optional · authorDoctor optional · status content_publication_status · riskLevel C-05 default Low).
713:  - § 4 C-22 ArticleCategory — v0.1 DB 컬럼 정합 marker (parentCategory · pillar · coverImageUrl · seoMeta · articleTypeDefault 모두 optional · v0.1 UI 미사용 EC-DEFER-10).
714:  - § 4 C-24 Publication 풀명세 신규.
715:  - § 4 C-25 MediaAppearance 풀명세 신규.
717:- `EC-CASCADE-02`: `docs/core/SCHEMA_MAPPING.md` patches:
718:  - § 1.2 `@id` 패턴 (ScholarlyArticle · VideoObject — fragment-scoped 운영) v0.1.
719:  - § 2 entity 카탈로그 — ScholarlyArticle · VideoObject (모든 channel_type) · FAQPage · Question · Answer 추가.
720:  - § 3 P-011 FAQ graph + P-002/P-004 graph 확장 (ScholarlyArticle/VideoObject 풀 entity).
721:- `EC-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7.1.1.x ContentType 예외 표 — Publication/MediaAppearance 면제 · FAQ Q/A 적용.
722:- `EC-CASCADE-04`: `docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 2.1 SSR 재사용 표 — 신규 4 entity (article_category · publication · media_appearance · faq) Git output 변환 marker.
723:- `EC-CASCADE-05`: `packages/db/migrations/D0014_public_reader_eat.sql` 신규 — D0011 per-table GRANT/policy 패턴 정합.
724:- `EC-CASCADE-06`: `packages/migrations-runner/src/manifest.ts` — 16 단계 (cycle 1 ECP-04 정정) + 각 entry 의 dependsOn 명시.
725:- `EC-CASCADE-07`: `docs/decisions/PUBLIC_SITE_RENDER_PLAN.md` — PSR-DEFER-11 부분 (FAQ) + PSR-DEFER-15 (Article category) 해소 marker.
726:- `EC-CASCADE-08` (cycle 1 ECP-12 정정 — acceptance precondition 격상): `docs/core/PAGE_TYPES.md` § 1.1 P-011 FAQ M0 ✅ + § 3 P-011 본문 작성 (질문 위계 + AEO 친화).
727:- `EC-CASCADE-09` (cycle 1 ECP-22 정정): `docs/admin/ARCHITECTURE.md` § 3 Slice 페이지 합계 = **11페이지** (기존 9 + P-010 1샘플 + P-011 FAQ). ArticleCategory 는 어드민 운영 routing 추가지만 공개 페이지 count 에는 포함 안 됨 (Article URL prefix 만 변경).
734:| 2026-05-18 | v0.2 | **Codex 비평 cycle 1 22 findings (7 blocking + 10 major + 5 minor) 전건 수용 patch**: (ECP-01) C-24/25 Publication/MediaAppearance · C-12 FAQ 풀명세 합류 · C-22 ArticleCategory 실 운영 합류 — DATA_MODEL 인벤토리 25 contracts. (ECP-02) C-22 풀명세 컬럼 전체 DB 추가 (v0.1 UI minimal · EC-DEFER-10). (ECP-03) Article.category_id staged 4-step migration (ADD nullable + seed + backfill + SET NOT NULL). (ECP-04) manifest 16단계 + 각 dependsOn 명시. (ECP-05·14) MediaAppearance 모든 channel_type → VideoObject 단일화 · fragment `#video-{slug}` 단일 · BroadcastEvent/NewsArticle 분기는 EC-DEFER-11. (ECP-06) Doctor/About graph self-contained — Publication/Media 풀 entity 출력. cross-page allowlist 미사용. (ECP-07) C-10 contentType enum +Publication +MediaAppearance v0.6 cascade. FAQ 토큰 대문자 통일. (ECP-08) DOI regex DB·zod 동일 anchored. (ECP-09) default `general` ArticleCategory seed = seed.ts + C0013 마이그레이션 backfill. (ECP-10·11) v0.1 단계 4 entity 어드민 status='draft' 강제 — FAQ DB CHECK + zod enum subset. EC-DEFER-12 신설. (ECP-12) PAGE_TYPES P-011 M0 ✅ — EC-CASCADE-08 acceptance precondition 격상. (ECP-13) Publication/Media `@id` fragment-scoped (Doctor/About page URL + fragment). (ECP-15) About publication/media reference 는 MedicalClinic.subjectOf 단일 결정. (ECP-16) ArticleCategory taxonomy public 의도 명시 — status 게이트 없음 + EC-DEFER-10. (ECP-17) Article detail SQL JOIN article_category · category.slug 매칭 작업 명시. (ECP-18) `authors` DEFAULT 제거. (ECP-19) `renderMarkdownToPlainText` helper 신규 — JSON-LD Answer.text. (ECP-20) external link rel `nofollow noopener noreferrer` 통일. (ECP-21) FAQ 빈 페이지 200 + sitemap 포함 + lastmod fallback. (ECP-22) Slice 페이지 11 = 기존 9 + P-010 1샘플 + P-011 FAQ. |

 succeeded in 749ms:
..\..\packages\db\migrations\D0011_public_reader.sql:1:-- @glitzy/db — D0011 app_public_reader role + per-table SELECT policy
..\..\packages\db\migrations\D0011_public_reader.sql:9:-- LOGIN role — v0.1 단순화 (production NOLOGIN/MEMBERSHIP cascade marker PSR-DEFER-16).
..\..\packages\db\migrations\D0011_public_reader.sql:73:--   → SELECT 0 행 → 자동 404. published 합류는 LL-DEFER-01 (compliance-assistant + ComplianceRecord legalCounsel) cascade.
..\..\packages\migrations-runner\src\manifest.ts:2:// SoT cascade: LL-CASCADE-05 · LOCATION_LEGAL_PLAN v1.0 § 6 의존성 표
..\..\packages\migrations-runner\src\manifest.ts:19:  readonly dependsOn: ReadonlyArray<string>;
..\..\packages\migrations-runner\src\manifest.ts:23: * orderedMigrations — LOCATION_LEGAL_PLAN v1.1 § 6 의존성 9단계 + PUBLIC_SITE_RENDER_PLAN v0.x § 8/§ 10 의 D0011 (10단계 — PSR-25/PSR-CASCADE-04 patch).
..\..\packages\migrations-runner\src\manifest.ts:32:    dependsOn: [],
..\..\packages\migrations-runner\src\manifest.ts:39:    dependsOn: ["instance"],
..\..\packages\migrations-runner\src\manifest.ts:46:    dependsOn: ["instance"],
..\..\packages\migrations-runner\src\manifest.ts:53:    dependsOn: ["instance"],
..\..\packages\migrations-runner\src\manifest.ts:60:    dependsOn: ["instance"],
..\..\packages\migrations-runner\src\manifest.ts:67:    dependsOn: ["instance", "doctor_profile", "content_publication_status"],
..\..\packages\migrations-runner\src\manifest.ts:74:    dependsOn: ["instance", "content_publication_status", "risk_level"],
..\..\packages\migrations-runner\src\manifest.ts:89:    dependsOn: ["clinic_profile"],
..\..\packages\migrations-runner\src\manifest.ts:100:    dependsOn: ["clinic_profile", "location_profile"],
..\..\packages\migrations-runner\src\manifest.ts:105:    file: "packages/db/migrations/D0011_public_reader.sql",
..\..\packages\migrations-runner\src\manifest.ts:117:    dependsOn: [
..\..\packages\migrations-runner\src\manifest.ts:131: * 각 entry 의 dependsOn 이 이전 entries 의 creates 안에 모두 존재함을 verify.
..\..\packages\migrations-runner\src\manifest.ts:138:    for (const dep of m.dependsOn) {

codex
초기 검색에서 중요한 신호가 보입니다. `EAT_CONTENT_PLAN.md`는 v0.2 결정을 반영하고 있지만, 일부 SoT 파일은 아직 cycle 1 patch 내용과 동기화되지 않은 흔적이 있어 line 단위로 좁혀 보겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\docs\\core\\DATA_MODEL.md'; "'$lines=Get-Content $p; foreach($i in 30..60){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }; foreach($i in 760..772){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }; foreach($i in 912..942){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\docs\\core\\SCHEMA_MAPPING.md'; "'$lines=Get-Content $p; foreach($i in 140..156){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }; foreach($i in 664..674){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }; foreach($i in 785..805){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }; foreach($i in 914..920){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\docs\\core\\PAGE_TYPES.md'; "'$lines=Get-Content $p; foreach($i in 20..50){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }; foreach($i in 368..385){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }; foreach($i in 602..630){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\packages\\migrations-runner\\src\\manifest.ts'; "'$lines=Get-Content $p; foreach($i in 20..125){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }' in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 655ms:
21:
22:/**
23: * orderedMigrations — LOCATION_LEGAL_PLAN v1.1 § 6 의존성 9단계 + PUBLIC_SITE_RENDER_PLAN v0.x § 8/§ 10 의 D0011 (10단계 — PSR-25/PSR-CASCADE-04 patch).
24: * runner 는 이 배열 순서대로 sequential apply (fail-fast).
25: */
26:export const orderedMigrations: ReadonlyArray<MigrationDescriptor> = [
27:  // (1) instance (multi-tenant root)
28:  {
29:    file: "packages/db/migrations/D0010_instance.sql",
30:    package: "@glitzy/db",
31:    creates: ["instance"],
32:    dependsOn: [],
33:  },
34:  // (2) clinic_profile
35:  {
36:    file: "packages/core-content/migrations/C0001_clinic_profile.sql",
37:    package: "@glitzy/core-content",
38:    creates: ["clinic_profile"],
39:    dependsOn: ["instance"],
40:  },
41:  // (3) location_profile (base table — clinic_profile_id 미포함 · C0008 에서 ALTER)
42:  {
43:    file: "packages/core-content/migrations/C0002_location_profile.sql",
44:    package: "@glitzy/core-content",
45:    creates: ["location_profile"],
46:    dependsOn: ["instance"],
47:  },
48:  // (4) doctor_profile — article.author_doctor_id FK 의존성 (plan § 6 미언급 보강)
49:  {
50:    file: "packages/core-content/migrations/C0003_doctor_profile.sql",
51:    package: "@glitzy/core-content",
52:    creates: ["doctor_profile"],
53:    dependsOn: ["instance"],
54:  },
55:  // (5) treatment_page — content_publication_status enum 생성 (C0006 precondition)
56:  {
57:    file: "packages/core-content/migrations/C0004_treatment_page.sql",
58:    package: "@glitzy/core-content",
59:    creates: ["treatment_page", "content_publication_status"],
60:    dependsOn: ["instance"],
61:  },
62:  // (6) article — risk_level enum 생성 (C0006 precondition) + doctor_profile FK
63:  {
64:    file: "packages/core-content/migrations/C0005_article.sql",
65:    package: "@glitzy/core-content",
66:    creates: ["article", "risk_level"],
67:    dependsOn: ["instance", "doctor_profile", "content_publication_status"],
68:  },
69:  // (7) legal_document — content_publication_status + risk_level enum FK
70:  {
71:    file: "packages/core-content/migrations/C0006_legal_document.sql",
72:    package: "@glitzy/core-content",
73:    creates: ["legal_document", "legal_document_type"],
74:    dependsOn: ["instance", "content_publication_status", "risk_level"],
75:  },
76:  // (8) clinic_profile policy + primary_ctas (ALTER)
77:  {
78:    file: "packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql",
79:    package: "@glitzy/core-content",
80:    creates: [
81:      "clinic_profile.policy_contact_person",
82:      "clinic_profile.policy_contact_email",
83:      "clinic_profile.policy_contact_phone",
84:      "clinic_profile.policy_effective_date",
85:      "clinic_profile.primary_ctas",
86:      "clinic_profile_primary_ctas_validate",
87:      "clinic_profile_primary_ctas_trigger",
88:    ],
89:    dependsOn: ["clinic_profile"],
90:  },
91:  // (9) location_profile parentClinic composite FK (ALTER)
92:  {
93:    file: "packages/core-content/migrations/C0008_location_profile_parent_clinic.sql",
94:    package: "@glitzy/core-content",
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
121:      "doctor_profile",
122:      "treatment_page",
123:      "article",
124:      "legal_document",
125:    ],
126:  },

 succeeded in 694ms:
31:### 1.1 데이터 계약 (23개)
32:
33:| ID | 계약 이름 | 책임 | 소속 | 마스터 | M0 | 관련 페이지 타입 |
34:|---|---|---|:---:|:---:|:---:|---|
35:| C-01 | `ClinicProfile` | 의료기관 정체성 (브랜드·메타) | L3 | Git | ✅ | P-001, P-002 |
36:| C-02 | `DoctorProfile` | 의료진 권위·전문성 | L3 | Git | ✅ | P-003, P-004 |
37:| C-03 | `TreatmentPage` | 시술·치료 구조화 콘텐츠 | L3 | Git | ✅ | P-005, P-006 |
38:| C-04 | `Article` | 인사이트·블로그 글 | L3 | Git | ✅ | P-009, P-010 |
39:| C-05 | `RiskLevel` | 위험도 등급 (enum) | L1/L3 | Git+DB | ✅ | 전체 |
40:| C-06 | `PageMeta` | 페이지별 메타 데이터 | L1/L3 | Git | ✅ | 전체 |
41:| C-07 | `BrandTokens` | 디자인 토큰 최종값 | L3 | Git | ✅ | UI |
42:| C-08 | `InstanceManifest` | 버전 고정 명세 | L3 | Git | ✅ | 빌드 |
43:| C-09 | `FeatureModuleConfig` | Feature Module 설정 | L3 | Git | ✅ | 모듈 |
44:| C-10 | `ComplianceRecord` | 컴플라이언스 게이트 통과 기록 | L1/L3 | DB+Git | ✅ | 발행 |
45:| C-11 | `MedicalConditionPage` | 증상·질환 정보 | L3 | Git | | P-007, P-008 |
46:| C-12 | `FAQ` | 질문-답변 묶음 | L3 | Git | | P-011 |
47:| C-13 | `ReviewPolicy` | 후기 노출 정책 | L2+L3 | Git | | P-101 |
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
761:**마스터**: 어드민 DB 원본 + Git 사본 (가벼운 빌드 참조 메타)
762:
763:#### 어드민 DB 원본 (풀데이터)
764:
765:| 필드 | 타입 | required | 설명 |
766:|---|---|:---:|---|
767:| `@id` | `Slug` | ✅ | |
768:| `instanceId` | `Slug` | ✅ | |
769:| `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature}` | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1) |
770:| `featureContentType` | `string` (`feature:<slug>` 형식, 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$`) | conditional | `contentType="Feature"` 시 required — Feature 콘텐츠 세부 식별. 예: `feature:self-test` |
771:| `contentRef` | `string` | ✅ | 대상 콘텐츠 `@id` |
772:| `pageRiskLevel` | `RiskLevel` | ✅ | 최종 등급 |
773:| `articleType` | `string` | optional | (Article인 경우) |
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
937:
938:### C-13. `ReviewPolicy`
939:필드: `enabled`, `displayFormat`, `requireAnonymization`, `effectClaimAllowed`, `beforeAfterPhotoAllowed`, `celebrityMentionAllowed`, `disclaimerText`. **의료광고법 신중 필요.**
940:
941:### C-14. `MedicalSpecialty`
942:필드: `@id`, `name`, `description`, `parentSpecialty?`. Preset 1차 정의.
943:

 succeeded in 684ms:
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
156:| `Person` | Author가 Physician이 아닌 경우 (`authorType` ≠ clinician) — **M0 외 후속** (현재 `Article.author: Ref<C-02>` 만 지원. authorType != clinician 케이스는 데이터 모델 확장 시 합류 — DM 추가) | (선택, M0 외) |
157:| `EducationalOrganization` / `MedicalOrganization` | `affiliatedInstitutes`·`memberOf` 참조 entity | ResearchInstitute, Affiliation |
665:
666:**Graph 구성**:
667:1. `Organization` — **[풀]**
668:2. `MedicalClinic` (본원) — **[참조만]** (§ 2.5)
669:3. `FAQPage` (Question/Answer) — **[풀]**
670:4. `BreadcrumbList` — **[풀]**
671:5. `WebPage` — **[풀]**, `isPartOf: #website`
672:
673:**FAQPage**: 위 P-006 FAQPage와 동일 구조. 페이지 전체가 Question 모음일 때 `mainEntity` 배열.
674:
675:### P-012. Contact / Visit (Conversion Hub)
786:| C-03 `TreatmentPage` | `MedicalProcedure` | `programVariants`·`recommendedFor`·`visitFlow`는 비매핑 (본문) |
787:| C-04 `Article` | `Article` (또는 `BlogPosting`·`NewsArticle` 변형). VideoObject 동반 가능 | `contentSource` → `isBasedOn` |
788:| C-05 `RiskLevel` | (비매핑) | 운영 메타. 빌드 참조용. schema 출력 시 표현 신중성에만 영향 |
789:| C-06 `PageMeta` | `WebPage` 필드 일부 + head meta tag | 상세는 `SEARCH_STANDARDIZATION.md` |
790:| C-07 `BrandTokens` | (비매핑) | UI 렌더링 |
791:| C-08 `InstanceManifest` | (비매핑) | 빌드 메타 |
792:| C-09 `FeatureModuleConfig` | (비매핑) | |
793:| C-10 `ComplianceRecord` | (비매핑 — 운영 메타) | Git 사본의 `publishedAt`·`lastModifiedAt`은 Article.datePublished/dateModified로 사용됨 |
794:| C-11 `MedicalConditionPage` | `MedicalCondition` | |
795:| C-12 `FAQ` | `FAQPage.mainEntity[].Question/Answer` | |
796:| C-13 `ReviewPolicy` | (비매핑) | P-101 활성화 시 schema 정책 결정 |
797:| C-14 `MedicalSpecialty` | enum 문자열로 매핑 (Schema.org `MedicalSpecialty` enum 값) | |
798:| C-15 `SchemaInput` | **(인터페이스 — § 6에서 정식 정의)** | |
799:| C-16 `LegalDocument` | `WebPage`만 (정책 페이지는 검색 노출 우선순위 낮음) | |
800:| C-17 `PricingPage` | (Schema 비사용) | `Offer` 부적합 |
801:| C-18 `FacilitiesPage` | `WebPage` + 사진 갤러리 | |
802:| C-19 `NewsItem` | `Article` 또는 `NewsArticle` | event-price 카테고리는 schema 신중 |
803:| C-20 `ReservationPage` | `MedicalClinic.potentialAction.ReserveAction` (LocalBusiness 별도 출력 안 함) | |
804:| C-21 `LocationProfile` | `MedicalClinic` (지점 단위 별도 entity. LocalBusiness sub-class) | 본원·지점 각각 |
805:| C-22 `ArticleCategory` | (비매핑) — Article.articleSection 문자열 | |
806:
915:| P-004 | `Physician` + `name`·`jobTitle`·`medicalSpecialty`·`hasCredential` |
916:| P-006 | `MedicalProcedure` + `name`·`description`·`howPerformed` |
917:| P-008 | `MedicalCondition` + `name`·`description` |
918:| P-010 | `Article` + `headline`·`description`·`datePublished`·`author`·`publisher` |
919:| P-011 | `FAQPage` + `mainEntity[]` 최소 1개 |
920:
921:누락 시 **빌드 실패**.

 succeeded in 706ms:
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
369:**내부 링크 권장**: → 저자 프로필 / 관련 Articles / 관련 Treatments / 관련 Conditions
370:
371:### P-011. FAQ
372:
373:**목적**: 자주 묻는 질문. AI 스니펫·사이트 브리핑 직접 인용 후보.
374:**URL**: `/faq`
375:**주 데이터 계약**: `FAQ[]`
376:**Schema 요약**: `FAQPage` (mainEntity = Question[]) + BreadcrumbList.
377:
378:**정보 슬롯**: 카테고리 그룹별 Q&A 쌍
379:**헤딩 위계**: H1 "자주 묻는 질문" / H2 카테고리명 / H3 각 질문(또는 아코디언)
380:**필수 블록**: Q&A 쌍 모음
381:**선택 블록**: 카테고리 필터 / 검색
382:**레이아웃 변형**: 아코디언 / 평면 리스트 / 카드 / 탭
383:
384:**위험도 — 답변 단위 분류**:
385:
386:| 답변 주제 | 등급 |
603:|---|---|---|---|---|:---:|:---:|:---:|
604:| P-001 | Home | `/` | ClinicProfile | Organization + MedicalClinic + WebSite | Low | | ✅ |
605:| P-002 | About | `/about` | ClinicProfile | Organization + MedicalClinic | Low | | ✅ |
606:| P-003 | Doctors List | `/doctors` | DoctorProfile[] | ItemList | Low | | ✅ |
607:| P-004 | Doctor Profile | `/doctors/{slug}` | DoctorProfile | Physician | Low | | ✅ |
608:| P-005 | Treatments List | `/treatments` | TreatmentPage[] | ItemList | Low | | ✅ |
609:| P-006 | Treatment Detail | `/treatments/{slug}` | TreatmentPage | MedicalProcedure | Medium | | ✅ |
610:| P-007 | Conditions List | `/conditions` | MedicalConditionPage[] | ItemList | Low | | |
611:| P-008 | Condition Detail | `/conditions/{slug}` | MedicalConditionPage | MedicalCondition | Medium | | |
612:| P-009 | Articles List | `/insights` | Article[] | ItemList/Blog | Low | | |
613:| P-010 | Article Detail | `/insights/{cat}/{slug}` | Article | Article (+VideoObject) | ArticleType 가변 | | ✅ (1) |
614:| P-011 | FAQ | `/faq` | FAQ[] | FAQPage | 답변 가변 | | |
615:| P-012 | Contact / Visit (Conversion Hub) | `/contact` | ClinicProfile + LocationProfile[] | MedicalClinic/LocalBusiness | Low | | ✅ |
616:| P-013 | Legal / Policy | `/privacy` 등 | LegalDocument | WebPage | Low | | ✅ (자동) |
617:| P-014 | Location / Branch Detail | `/locations/{slug}` | LocationProfile | MedicalClinic/LocalBusiness (지점) | Low | | ✅ (main) |
618:| P-101 | Reviews | `/reviews` | ReviewPolicy + 후기 | (신중) | High | ✅ | |
619:| P-102 | Pricing | `/pricing` | PricingPage | (신중) | High | ✅ | |
620:| P-103 | Facilities / Equipment | `/facilities` | FacilitiesPage | WebPage | Medium | | |
621:| P-104 | News / Event | `/news` | NewsItem[]/Article[] | NewsArticle/Article | 가변 | ✅ (이벤트) | |
622:| P-105 | Reservation | `/reservation` | ReservationPage | LocalBusiness + ReserveAction | Low | | |
623:| P-106 | Self-test / Quiz | `/self-test/{slug}` | SelfTest (Feature-backed) | WebPage / MedicalWebPage | Medium | | |
624:
625:---
626:
627:## 6. Vertical Slice (M0) 페이지 타입 — 10개 페이지
628:
629:| 순서 | 페이지 타입 | 비고 |
630:|---|---|---|
631:| 1 | P-001 Home | 메인 |

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\packages\\migrations-runner\\src\\manifest.ts'; "'$lines=Get-Content $p; foreach($i in 126..155){ if($i -lt $lines.Length){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] } }' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-ChildItem ..\\..\\packages\\core-content\\migrations, ..\\..\\packages\\db\\migrations | Select-Object Name | Sort-Object Name" in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"article_category|publication|media_appearance|faq|Publication|MediaAppearance|FAQ|ArticleCategory\" ..\\..\\packages\\core-content\\migrations ..\\..\\packages\\db\\migrations" in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"article_category|category_id|JOIN|general|params\\.category|eq\\(|from\\(\" 'src\\app\\(site)\\[instanceSlug]\\insights\\[category]\\[slug]\\page.tsx'" in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 717ms:
2:// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 2.1 (Article URL `/insights/[category]/[slug]` · v0.1 fallback `general`)
19:  if (params.category !== "general") return {};
33:    canonicalPath: `/insights/${params.category}/${a.slug}`,
44:  // v0.1 단일 fallback category `general` — PSR-DEFER-15
45:  if (params.category !== "general") notFound();
75:    { siteBaseUrl: hostOrigin, pagePath: `/insights/${params.category}/${data.article.slug}` },
79:    params.category,

 succeeded in 754ms:
127:];
128:
129:/**
130: * validateManifest — runner 가 sequential apply 직전 호출.
131: * 각 entry 의 dependsOn 이 이전 entries 의 creates 안에 모두 존재함을 verify.
132: * 실 runner 합류 (LL-DEFER-20) 시점에 적용.
133: */
134:export function validateManifest(): ReadonlyArray<string> {
135:  const errors: string[] = [];
136:  const seen = new Set<string>();
137:  for (const [i, m] of orderedMigrations.entries()) {
138:    for (const dep of m.dependsOn) {
139:      if (!seen.has(dep)) {
140:        errors.push(`[${m.file}] depends on "${dep}" but it is not created by any earlier migration (orderIndex=${i})`);
141:      }
142:    }
143:    for (const c of m.creates) seen.add(c);
144:  }
145:  return errors;
146:}

 succeeded in 761ms:
..\..\packages\core-content\migrations\C0004_treatment_page.sql:6:CREATE TYPE content_publication_status AS ENUM (
..\..\packages\core-content\migrations\C0004_treatment_page.sql:20:  status content_publication_status NOT NULL DEFAULT 'draft',
..\..\packages\core-content\migrations\C0006_legal_document.sql:2:-- Precondition: D0010 instance · C0004 content_publication_status enum · C0005 risk_level enum
..\..\packages\core-content\migrations\C0006_legal_document.sql:24:  status content_publication_status NOT NULL DEFAULT 'draft',
..\..\packages\core-content\migrations\C0005_article.sql:12:  status content_publication_status NOT NULL DEFAULT 'draft',

 succeeded in 755ms:

[32;1mName[0m
[32;1m----[0m
C0001_clinic_profile.sql
C0002_location_profile.sql
C0003_doctor_profile.sql
C0004_treatment_page.sql
C0005_article.sql
C0006_legal_document.sql
C0007_clinic_profile_policy_vars.sql
C0008_location_profile_parent_clinic.sql
D0010_instance.sql
D0011_public_reader.sql


exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\docs\\core\\CONTENT_STANDARDS.md'; "'$lines=Get-Content $p; foreach($i in 600..635){ if($i -lt $lines.Length){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] } }; foreach($i in 309..318){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\docs\\compliance\\RISK_LEVELS.md'; "'$lines=Get-Content $p; foreach($i in 118..132){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }; foreach($i in 490..505){ '"'{0}:{1}' -f ("'$i+1), $lines[$i] }' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'..\\..\\docs\\decisions\\LOCATION_LEGAL_PLAN.md'; if(Test-Path "'$p){ rg -n "LegalDocument|status='"'draft'|published only|RLS|app_public_reader|LL-SCHEMA-03|LL-SCHEMA-04|draft\" "'$p }' in C:\Users\assag\solution\website-exposure\apps\web
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'src\\app\\(site)\\[instanceSlug]\\insights\\[category]\\[slug]\\page.tsx'; "'$lines=Get-Content $p; foreach($i in 1..90){ '"'{0}:{1}' -f "'$i, $lines[$i-1] }' in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 633ms:
119:| `includes-testimonial` | **High** | 본문에 환자 후기 인용·치료경험담 검출 |
120:
121:> 단일 flag 발생만으로 High 격상. 페이지 타입 기본이 Low여도 본문이 위 항목 1개라도 포함하면 페이지 전체 High → 검수 큐 강제 진입(`CONTENT_STANDARDS.md` § 7.1.2).
122:
123:### 2.5 페이지 타입 기본 등급 (참조 — PAGE_TYPES § 3 SoT)
124:
125:| 페이지 | 기본 등급 |
126:|---|---|
127:| P-001 Home, P-002 About, P-003 Doctors List, P-004 Doctor Profile, P-005 Treatments List, P-007 Conditions List, P-009 Articles List, P-011 FAQ, P-012 Contact, P-013 Legal, P-014 Location, P-105 Reservation | Low |
128:| P-006 Treatment Detail, P-008 Condition Detail, P-103 Facilities, P-106 Self-test | Medium |
129:| P-010 Article Detail | ArticleType별 (§ 6 CONTENT_STANDARDS — Low~High) |
130:| P-101 Reviews, P-102 Pricing, P-104 News·Event(event 카테고리) | High |
131:
132:> 본 표는 PAGE_TYPES § 3의 캐시 — PAGE_TYPES 변경 시 본 표 cascade.
133:
491:
492:---
493:
494:## 5. inlineRiskFlags 자동 추출 — DM-05 영역
495:
496:콘텐츠 본문에서 자동 추출하는 본문 위험 신호.
497:
498:**저장 위치**:
499:- C-04 `Article` 콘텐츠 — `Article.inlineRiskFlags`(필드 직접 보관) **및** `ComplianceRecord(C-10).inlineRiskFlags` (검수 기록 사본)
500:- 그 외 모든 콘텐츠 (ClinicProfile·DoctorProfile·TreatmentPage·MedicalConditionPage·FAQ·ReviewPolicy 등) — `ComplianceRecord(C-10).inlineRiskFlags`에만 보관. Git 원본 데이터에는 inlineRiskFlags 필드 없음
501:- compliance-assistant 빌드 시 양쪽 모두 갱신 — Article은 두 위치, 비 Article은 ComplianceRecord만
502:
503:### 5.1 추출 알고리즘 (RiskRule category 기반)
504:
505:각 flag는 RiskRule 매칭 결과의 `category` 집합 기준으로 추출 — 의미적 risk(semantic risk)가 아닌 카테고리 문자열 매칭으로 구현자가 결정 가능.
506:

 succeeded in 657ms:
601:- Finding[]에는 각 매칭 모두 보존 (감사 추적용). `ComplianceCheckResult`의 집계 결과(`buildBlocked`·`gateRequired`)만 우선순위로 흡수
602:
603:#### 7.4.3 문맥 결합 룰 (composite rules)
604:
605:- 단독 키워드(예: "100%") + 결과·효과·보장 어휘 결합 시 CompositeRiskRule로 표현
606:- 정규식 룰의 lookahead/lookbehind 또는 별도 CompositeRiskRule 사용 — 다중 패턴은 CompositeRiskRule 권장 (스코프·window 명시 가능)
607:- CompositeRiskRule의 `severity`는 4종(`info`/`warning`/`fail`/`content-gate`) 모두 허용 — § 4.1의 결합 의미 룰은 일반적으로 fail이나, 운영 정책에 따라 content-gate composite도 가능
608:- composite 룰 `category`는 결합 의미(예: "보장 결합 강조")로 명시
609:
610:#### 7.4.4 운영·관리
611:
612:- 룰 데이터의 원본은 본 문서 § 4.1 — 사람이 읽는 SoT
613:- 룰 데이터의 빌드용 표현은 별도 데이터 파일 (`compliance/rules.yaml` 또는 동등 포맷) — `compliance/RISK_LEVELS.md` 후속에서 파일 위치·포맷 확정
614:- 룰 변경은 § 1.4 변경 정책 적용 — 강화는 MAJOR
615:
616:---
617:
618:## 8. 빌드 검증 — 룰 레벨 (SCHEMA_MAPPING § 7.3·SEARCH_STANDARDIZATION § 8 정합)
619:
620:| 레벨 | 정의 | 조치 |
621:|---|---|---|
622:| **fail** | 빌드 실패 | § 4.1 fail 표현 검출, H1 누락 등 |
623:| **warning** | 경고 + 어드민 검토 큐 | answer-first 위반, 구조화 블록 부재, H 위계 건너뜀 등 |
624:| **content-gate** | **빌드는 통과(자동 차단 X) + 사람 검수 큐 진입** — 본문 표현 검수 + schema 출력 승인 + 위험 콘텐츠 발행 전 인간 결재의 일반 의미 (`SCHEMA_MAPPING.md` § 7.3 동일 의미) | § 4.1 content-gate 표현, ArticleType=High 케이스, 한의 특유 표현, SCHEMA_MAPPING의 SpecialAnnouncement 등 schema 발행 결재 |
625:
626:---
627:
628:## 9. 미결정 사항
629:
630:| ID | 항목 | 비고 |
631:|---|---|---|
632:| CS-03 | 사례·임상 데이터 인용 시 외부 검증 가능성 자동 판정 | 운영 누적 후 |
633:| CS-04 | 한의 특유 표현(체질·1:1 맞춤)의 회색지대 정밀 분류 | `presets/hanui-clinic/` 후속 |
634:| CS-05 | medical disclaimer 자동 삽입 정책 — 페이지 타입별 자동 출력 vs 운영자 명시 | UX 결정 |
635:| CS-06 | 다국어 콘텐츠에서 표현 룰 적용 — 영문·중문·일문 별도 사전 | M3 다국어 시 |
636:| CS-A | § 1.3 본문 글자 수 산정의 정확한 정규식 — Markdown 코드 블록·링크 URL·이미지 마크업·HTML 태그·공백·문장부호 제거 패턴 + § 2.1.1 answer-first AST 파서 라이브러리 선택 | 자체 룰 checker 구현 시 |
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

 succeeded in 655ms:
1:# LocationProfile(main) + LegalDocument 자동 생성 plan (v1.0·acceptance·2026-05-16)
7:본 문서는 `docs/admin/ARCHITECTURE.md` v0.7 § 3.8.1 (LocationProfile(main) 자동 생성 규칙) · § 3.8.2 (LegalDocument 자동 생성 규칙) 을 M0 어드민에서 구현하기 위한 plan이다. ClinicProfile 화면 한 화면에서 **3계약 동시 출력** (`ClinicProfile` + `LocationProfile`(slug=`main`) + `LegalDocument`(5종)) 을 단일 server action transaction 안에서 수행한다.
11:> **scope limit (LL-INTRO-01)** — cycle1 LL-03·LL-04 patch: 본 plan 은 LegalDocument **draft 저장만** 다룬다. `review-queued` 도 차단 — 그 전이는 ComplianceRecord pre-publish row + NotificationEvent envelope (REVIEW_WORKFLOW § 5.2 / § 3.1) 발송이 함께 작동해야 한다. 이 둘은 모두 compliance-assistant Feature + ComplianceRecord UI cascade 까지 defer. 본 plan 의 LegalDocument 는 `status='draft'` 강제 (CHECK). 발행 게이트 자체는 LL-DEFER-01.
16:- `docs/core/DATA_MODEL.md` v0.9 — C-01 ClinicProfile · C-16 LegalDocument · C-21 LocationProfile · CT-02 BusinessHours · CT-03 CTAConfig
18:- `docs/core/CONTENT_STANDARDS.md` v1.3 — cycle1 LL-13 patch: 경로 정정 (admin/CONTENT_STANDARDS 아님). Markdown 본문 검증 (answer-first AST · 표현 검사) 의 LegalDocument 면제 규약 (§ 7 ContentType 예외 표 — LegalDocument 면제 marker).
19:- `docs/compliance/RISK_LEVELS.md` v1.1 · `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0 — `LegalDocument: legalCounsel/legalCounselAt required` 의 위험도 Low 예외 게이트 (RL § 4.3)
20:- `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0 (ADMIN-UI-15·62 marker · § 5.5 audit matrix · § 6.2 actions · § 8.1 RLS 시나리오)
43:| `legal_document` 테이블 신설 (C-16 minimal) | packages/core-content C0006 migration · RLS · 5종 documentType partial UNIQUE (cycle1 LL-08) |
46:| `saveClinicProfile` actions 확장 | 단일 tx 안 ClinicProfile + LocationProfile(main) + 5종 LegalDocument upsert · 변수 치환 · audit 7 row 별도 emit (cycle1 LL-17 patch) |
50:| 5종 LegalDocument 별 effective_date input | cycle1 LL-15 patch — LL-DEFER-08 reversal. 5 record 별 individual input · default = policy_effective_date |
57:| LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제) · `review-queued` 전이 + ComplianceRecord pre-publish + NotificationEvent | compliance-assistant Feature + ComplianceRecord UI cascade | LL-INTRO-01 / LL-DEFER-01 |
58:| LegalDocument `status=published` 발행 자체 | apps/worker + Git commit cascade | LL-DEFER-01 |
62:| LegalDocument 수동 작성 모드 (autoGenerated=false) | M1 Phase Alpha — Markdown 에디터 합류 시점 | LL-DEFER-03 |
65:| LegalDocument body 직접 수동 override | M1 Phase Alpha | LL-DEFER-06 |
67:| ~~5종 LegalDocument 각각의 effective_date individual override~~ | cycle1 LL-15 patch — **v0.2 에서 합류** (form 에서 5 record 별 input) | (closed) |
70:| LegalDocument body 검증 (CONTENT_STANDARDS § 7 ContentType 예외 marker 명시 + 면제 범위 cascade) | cycle1 LL-13 patch — CONTENT_STANDARDS § 7 의 LegalDocument 면제 marker 가 plan SoT cascade. 본 plan 에서 추가 검증 룰 미정의 | LL-DEFER-11 |
98:  status content_publication_status NOT NULL DEFAULT 'draft',
117:  -- cycle1 LL-03·LL-19 patch: skeleton 단계 status='draft' 만 허용 (review-queued 도 차단)
118:  CONSTRAINT legal_document_status_skeleton_limit CHECK (status = 'draft'),
146:- (LL-SCHEMA-03 · cycle1 LL-03 patch) `status` CHECK `= 'draft'` — skeleton 단계 단일 상태만. `review-queued` 전이는 ComplianceRecord pre-publish row + NotificationEvent 발송과 함께만 작동 (compliance-assistant cascade — LL-DEFER-01).
147:- (LL-SCHEMA-04) `published_at` CHECK NULL — 발행 자체가 LL-DEFER-01.
230:- (LL-SCHEMA-09) 별도 column (metadata JSONB 가 아닌) — 폼 schema 검증 + LegalDocument 변수 치환의 필수 입력값.
232:- (LL-SCHEMA-11 · cycle1 LL-15 patch) `policy_effective_date` 는 form 안 5 LegalDocument record 의 default 만. 운영자가 각 record 별 override 가능 (LL-DEFER-08 closed).
308:### 3.1 ClinicProfileForm 3 섹션 + 5 LegalDocument record (LL-FORM-01)
315:| **(d) 5종 LegalDocument** (신규 보조 details — cycle1 LL-15 patch) | 5 record 별 effectiveDate override (optional · 미입력 시 policyEffectiveDate default) | `LegalDocument` × 5 |
318:- (LL-FORM-02) 한 화면 한 폼 (single `<form action>`) — server action 한 번 호출로 3계약 + 5 LegalDocument 동시 출력. 부분 저장 (섹션별 저장) 안 함.
320:- (LL-FORM-04 · cycle1 LL-14 patch) 섹션 (c) 는 LegalDocument 생성에 필수 — policyContactPerson · policyContactEmail · policyContactPhone · policyEffectiveDate **4 필드 모두 required**. (한국 PIPA 의 개인정보 보호책임자 필수 고지 항목 — 소속/부서 같은 추가 필드는 LL-DEFER 또는 자유 입력 textarea 로 처리. v0.2 는 4 필드만 minimal.)
323:- (LL-FORM-07 · cycle1 LL-23 + cycle2 LL-35 patch) businessHours UI: 7 요일 행. 각 행: `[휴진 ☐]` + `오픈 [HH:mm] 마감 [HH:mm]` + `[점심 ☐]` + `점심 시작 [HH:mm] 종료 [HH:mm]`. 휴진 checked 시 다른 입력 disabled. **a11y 요구**: 각 row 에 `aria-labelledby` (요일 헤더 link) + 각 input `aria-describedby` (요일 에러 메시지 id) + 휴진 toggle 의 `aria-controls` (해당 row 의 input group id). **5 LegalDocument override details a11y (LL-FORM-14)**: `<details>` `<summary>` 는 기본적으로 keyboard interaction (Space/Enter toggle) + `aria-expanded` 자동. 추가로 `<summary>` 안에 정책 이름 + `(시행일: <date>)` 시각 표시 + `aria-controls` (override 입력 group id) + override 입력에 `aria-labelledby` (summary id) 명시.
348:  // cycle1 LL-18 patch: LegalDocument 편집은 skeleton 단계 status=draft + risk_level=Low 의 CHECK 로 제한.
360:- (LL-ACTION-02) 3계약 + 5 LegalDocument 모두 같은 tx — RLS 정합 + atomic 출력. 하나 실패 = 전체 rollback.
361:- (LL-ACTION-03 · cycle1 LL-17 patch) audit `content-saved` 는 tx commit 후 **7 row 별도 emit** — ClinicProfile 1 + LocationProfile 1 + LegalDocument 5. 각 row 의 payload 는 기존 통일 shape `{contentType, slug, mode, status, originalSlug}`. `ClinicProfileBundle` outer 폐기. analytics/test 호환 보존.
364:- (LL-ACTION-06 · cycle1 LL-16 + cycle3 LL-46 patch) **자동 재렌더링 분기 제거** — v0.4 는 LegalDocument 본문 수동 편집 차단 (LL-DEFER-06) 이므로 모든 row 가 templateVersion=current. 매 저장 시 모든 LegalDocument body 재렌더링. **운영자 알림 marker (LL-FORM-15 · 폼 (d) 상단 안내문)**: "본원 정보(기관명·법인명·사업자번호·설립자·본원 주소·전화·이메일) 또는 정책 변수(담당자·이메일·전화·시행일)를 수정하면 5종 정책 문서 본문이 자동으로 다시 생성됩니다. 본문 직접 수정은 추후 단계에서 합류합니다." 향후 수동 override 도입 시 별도 `body_source` enum (`auto`/`manual`) 컬럼 cascade.
393:    effectiveDate: string;   // YYYY-MM-DD (LegalDocument 별 override 결과)
417:// row 3~7 (5종 LegalDocument)
418:{ "eventType": "content-saved", "payload": { "contentType": "LegalDocument",   "slug": "privacy", "mode": "...", "status": "draft", "originalSlug": "privacy",
434:- (LL-ACTION-19 · cycle1 LL-17 patch) ADMIN_UI_SKELETON_PLAN § 5.5 audit matrix cascade — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed 별도 row 추가 marker (LL-CASCADE-02). 기존 ClinicProfile row 와 동일 통일 shape.
441:  - `legal_document_status_skeleton_limit` → formError ("정책 문서 상태 변경(검수 진입·발행)은 후속 단계입니다. 본 화면에서는 draft 만 저장 가능하며, 검수 진입은 compliance-assistant Feature 합류(M0 v1.0 본 구현 완료 시점) 후 검수 큐 화면에서 가능합니다.")
469:export type LegalDocumentType =
473:  documentType: LegalDocumentType;
492:- (LL-TEMPLATE-07 · cycle1 LL-13 patch) **LegalDocument body 검증 면제 명시** — `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표에 LegalDocument 추가 (cascade marker LL-CASCADE-03). 면제 범위: (1) answer-first AST 미적용 (정책 문서는 첫 문장 답 제시 구조 아님) (2) 표현 검사 (recommend/best 등 광고 표현) 미적용 (3) 변수 화이트리스트 검증은 별도 룰 (LL-ACTION-12).
511:## 7. § 8.1 RLS 시나리오 cascade
519:| 16 | LegalDocument 행을 `app_tenant_user` 가 `status='published'` 로 UPDATE 시도 | CHECK 위반 → formError ("정책 문서는 현재 단계에서 발행 상태로 변경할 수 없습니다") — cycle1 LL-19 patch |
520:| 17 | LegalDocument 같은 documentType (closed 5종) 두 번 INSERT | partial UNIQUE 위반 (LL-SCHEMA-02) |
523:| 20 | location_profile main row 의 clinic_profile_id 가 다른 tenant 의 clinic.id 로 변조 | composite FK + RLS WITH CHECK 위반 (LL-SCHEMA-14) |
524:| 21 | LegalDocument risk_level='High' UPDATE 시도 | CHECK 위반 (LL-SCHEMA-06) → formError |
535:| 5 | zod schema (businessHours · primaryCtas · policy vars · 5 LegalDocument override) | apps/web/src/lib/clinic-profile-schema.ts |
536:| 6 | ClinicProfileForm 3 섹션 + 5 LegalDocument record 재구성 (a11y marker 적용) | apps/web/src/components/forms/ClinicProfileForm.tsx |
539:| 9 | content-saved audit matrix row 추가 (LocationProfile · LegalDocument) | ADMIN_UI_SKELETON_PLAN § 5.5 cascade marker (LL-CASCADE-02) |
541:| 11 | docs/core/CONTENT_STANDARDS.md § 7 LegalDocument 예외 marker 추가 | LL-CASCADE-03 |
548:- `LL-DEFER-01`: LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제 · review-queued 전이 + ComplianceRecord pre-publish + NotificationEvent envelope · status=published). compliance-assistant Feature + ComplianceRecord UI cascade.
549:- `LL-DEFER-09`: LegalDocument 편집 권한 분리 (operator-edit-legal ActionType — REVIEW_WORKFLOW 14 ActionType cascade).
550:- `LL-DEFER-11`: LegalDocument body 검증 — CONTENT_STANDARDS § 7 ContentType 예외 marker cascade (LL-CASCADE-03). 추가 검증 룰은 compliance-assistant Feature.
559:- `LL-DEFER-03`: LegalDocument 수동 작성 모드 (autoGenerated=false · Markdown 에디터).
560:- `LL-DEFER-06`: LegalDocument body 수동 override · `body_source` enum cascade.
586:- ~~`LL-DEFER-08`~~: cycle1 LL-15 patch — 5종 LegalDocument 별 effectiveDate override 합류 완료 (v0.2 acceptance).
593:- `LL-CASCADE-02`: `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` § 5.5 audit matrix — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed row 추가. **acceptance precondition**.
594:- `LL-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표 — LegalDocument 면제 marker 추가 (answer-first AST · 표현 검사 면제 · 변수 화이트리스트 별도 룰). **acceptance precondition**.
603:| 2026-05-16 | v0.2 | **Codex 비평 cycle1 25 findings (7 blocking + 12 major + 6 minor) 전건 수용 patch**: (LL-01) location_profile 에 clinic_profile_id composite FK + main row CHECK, ClinicProfile.locations[] Git 출력 빌드 시점 동적 구성. (LL-02) ClinicProfile.primary_ctas 컬럼 + LocationProfile.reservationChannels = primary_ctas 자동 상속 marker. (LL-03·04) status='draft' 만 허용 (review-queued 도 차단) — ComplianceRecord pre-publish + NotificationEvent 합류 시점까지 defer. (LL-05) businessHours SoT CT-02 형식 (openingHours[]·receptionHours[]·lunchBreaks[]·specialClosures[]) 변환 + server action 안 convertToOpeningHoursSpec 명시. (LL-06) policy.* 변수 정당화 + LL-CASCADE-01 cascade marker. (LL-07) 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha. (LL-08·09) partial UNIQUE — closed 5종만. cookie/other LL-DEFER-12. (LL-10) C-21 출력 매핑표 명시. (LL-11) representativeDoctors v0.2 빈 배열. (LL-12) risk_level NOT NULL + CHECK 'Low' 만. (LL-13) SoT 경로 정정 (docs/core/CONTENT_STANDARDS.md) + LL-CASCADE-03. (LL-14) policyContactPhone form 단계 required. (LL-15) effective_date individual override 합류 (LL-DEFER-08 closed). (LL-16) 자동 재렌더링 분기 제거 (모든 row 매 저장 시 재렌더링). (LL-17) audit 7 row 별도 emit (Bundle outer 폐기). (LL-18) RBAC 분리 marker LL-DEFER-09 명시. (LL-19) published CHECK 위반 시 운영자 메시지 + errors.ts 매핑. (LL-20) phone regex 한국 + 국제 표기 명시. (LL-21) effective_date timezone Asia/Seoul. (LL-22) template_version naming autoGenerated=true 일 때만 필수. (LL-23) businessHours a11y marker. (LL-24) detection 시점 server action runtime + build-time test cascade. (LL-25) LL-DEFER-08~10 본문 §1 비범위 표 반영. |
604:| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |

2026-05-18T06:34:49.057965Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.9 seconds
Output:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … ]\insights\[category]\[slug]\page.tsx'; $lines=[36;1mGet-Content $p[0m; foreac …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                  ~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx does not exist, or has been filtered by the -Include or -Exclude parameter.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m

 exited 1 in 918ms:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … ]\insights\[category]\[slug]\page.tsx'; $lines=[36;1mGet-Content $p[0m; foreac …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                                  ~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path src\app\(site)\[instanceSlug]\insights\[category]\[slug]\page.tsx does not exist, or has been filtered by the -Include or -Exclude parameter.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m
[31;1mInvalidOperation: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m … Get-Content $p; foreach($i in 1..90){ [36;1m'{0}:{1}' -f $i, $lines[$i-1][0m }[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mCannot index into a null array.[0m

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$p='"'src\\app\\(site)\\[instanceSlug]\\insights\\[category]\\[slug]\\page.tsx'; "'$lines=Get-Content -LiteralPath $p; foreach($i in 1..90){ '"'{0}:{1}' -f "'$i, $lines[$i-1] }' in C:\Users\assag\solution\website-exposure\apps\web
 succeeded in 618ms:
1:// @glitzy/web/(site)/[instanceSlug]/insights/[category]/[slug] — P-010 Article Detail (1샘플)
2:// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 2.1 (Article URL `/insights/[category]/[slug]` · v0.1 fallback `general`)
3:
4:import { notFound } from "next/navigation";
5:import type { Metadata } from "next";
6:import { withPublicTenantTransaction } from "@/lib/public-tenant";
7:import { normalizeArticle, normalizeDoctor, type ArticleRow, type DoctorProfileRow } from "@/lib/db-projection";
8:import { loadSiteInitial } from "@/lib/site-initial";
9:import { ArticleBody } from "@/components/site/ArticleBody";
10:import { Breadcrumb } from "@/components/site/Breadcrumb";
11:import { buildPageMetadata } from "@/lib/site-metadata";
12:import { JsonLdScript } from "@/lib/json-ld/JsonLdScript";
13:import { articleDetailGraph } from "@/lib/json-ld/builders";
14:import { siteBaseUrl } from "@/lib/site-url";
15:
16:export const revalidate = 60;
17:
18:export async function generateMetadata({ params }: { params: { instanceSlug: string; category: string; slug: string } }): Promise<Metadata> {
19:  if (params.category !== "general") return {};
20:  const initial = await loadSiteInitial(params.instanceSlug);
21:  if (!initial) return {};
22:  const a = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
23:    const rows = await tx<ArticleRow[]>`
24:      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, author_doctor_id, updated_at
25:        FROM article WHERE slug = ${params.slug} LIMIT 1
26:    `;
27:    return rows.length > 0 ? normalizeArticle(rows[0]!) : null;
28:  });
29:  if (!a) return {};
30:  return buildPageMetadata(initial.clinic, params.instanceSlug, {
31:    pageTitle: a.headline,
32:    description: a.summary,
33:    canonicalPath: `/insights/${params.category}/${a.slug}`,
34:    ogType: "article",
35:    imageUrl: a.heroImageUrl ?? undefined,
36:  });
37:}
38:
39:export default async function ArticleDetailPage({
40:  params,
41:}: {
42:  params: { instanceSlug: string; category: string; slug: string };
43:}) {
44:  // v0.1 단일 fallback category `general` — PSR-DEFER-15
45:  if (params.category !== "general") notFound();
46:  const initial = await loadSiteInitial(params.instanceSlug);
47:  if (!initial) notFound();
48:
49:  const data = await withPublicTenantTransaction(params.instanceSlug, async (tx) => {
50:    const rows = await tx<ArticleRow[]>`
51:      SELECT slug, title, summary, body_markdown, hero_image_url, published_at, author_doctor_id, updated_at
52:        FROM article
53:       WHERE slug = ${params.slug}
54:       LIMIT 1
55:    `;
56:    if (rows.length === 0) return null;
57:    const article = normalizeArticle(rows[0]!);
58:    let author = null;
59:    if (article.authorDoctorId) {
60:      const doctorRows = await tx<DoctorProfileRow[]>`
61:        SELECT slug, name, title, job_title, honorific, bio, photo_url, display_order, active, updated_at
62:          FROM doctor_profile
63:         WHERE id = ${article.authorDoctorId}::uuid
64:         LIMIT 1
65:      `;
66:      author = doctorRows.length > 0 ? normalizeDoctor(doctorRows[0]!) : null;
67:    }
68:    return { article, author };
69:  });
70:  if (!data) notFound();
71:
72:  const base = `/${params.instanceSlug}`;
73:  const hostOrigin = siteBaseUrl(params.instanceSlug);
74:  const graph = articleDetailGraph(
75:    { siteBaseUrl: hostOrigin, pagePath: `/insights/${params.category}/${data.article.slug}` },
76:    initial.clinic,
77:    data.article,
78:    data.author,
79:    params.category,
80:  );
81:
82:  return (
83:    <>
84:      <JsonLdScript graph={graph} />
85:      <Breadcrumb items={[
86:        { label: "홈", href: base },
87:        { label: "인사이트", href: null },
88:        { label: data.article.headline, href: null },
89:      ]} />
90:      <article className="mx-auto max-w-3xl px-4 py-12">

codex
# EAT_CONTENT_PLAN v0.2 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=4 major=4 minor=0 (총 8)
- closeableAfterPatch: false
- 수렴 추세: cycle1=22 (7+10+5) → cycle2=8

## cycle 1 patch 검증
- ECP-01: **FAIL** — EAT plan은 25 contracts를 말하지만, DATA_MODEL §1.1은 여전히 “23개”이고 C-24/C-25 row가 없음: `DATA_MODEL.md:31`, `DATA_MODEL.md:56-57`.
- ECP-02: **PARTIAL** — C-22 풀명세 필드는 DATA_MODEL에 존재하나 `article_category` migration 자체가 없음: `DATA_MODEL.md:913-926`.
- ECP-03: **FAIL** — C0013 staged migration 파일이 repo에 없음. 현재 migrations는 C0001~C0008 + D0010/D0011만 존재.
- ECP-04: **FAIL** — manifest는 여전히 10단계이고 D0011에서 끝남: `manifest.ts:23`, `manifest.ts:102-127`.
- ECP-05: **PARTIAL** — EAT plan 내부 결정은 VideoObject 단일화로 정리됨: `EAT_CONTENT_PLAN.md:555-571`; 그러나 SCHEMA_MAPPING SoT는 MediaAppearance용 VideoObject를 추가하지 않음: `SCHEMA_MAPPING.md:154`.
- ECP-06: **PARTIAL** — EAT plan 내부는 graph self-contained 결정: `EAT_CONTENT_PLAN.md:596-603`; SCHEMA_MAPPING P-002/P-004 graph에는 Publication/Media 풀 entity cascade가 없음.
- ECP-07: **FAIL** — DATA_MODEL C-10 enum은 여전히 Publication/MediaAppearance가 빠진 15종: `DATA_MODEL.md:769`.
- ECP-08: **PARTIAL** — EAT plan에 DB/Zod anchored DOI regex는 명시됨: `EAT_CONTENT_PLAN.md:442`; 실제 migration/form 파일 부재로 검증 불가.
- ECP-09: **PARTIAL** — EAT plan은 seed.ts + C0013 backfill을 명시: `EAT_CONTENT_PLAN.md:143-166`; C0013 migration 파일이 없음.
- ECP-10·11: **PARTIAL** — EAT plan은 FAQ draft-only DB CHECK/Zod subset 명시: `EAT_CONTENT_PLAN.md:358`, `EAT_CONTENT_PLAN.md:433-437`; 실제 faq migration/form 없음.
- ECP-12: **FAIL** — PAGE_TYPES는 P-011 M0 blank이고 M0 10개 유지: `PAGE_TYPES.md:46`, `PAGE_TYPES.md:627`.
- ECP-13: **PARTIAL** — EAT plan은 fragment-scoped @id 명시: `EAT_CONTENT_PLAN.md:477-480`, `EAT_CONTENT_PLAN.md:491-494`; SCHEMA_MAPPING cascade 없음.
- ECP-14: **PASS** — EAT plan에서 graph self-contained 및 allowlist 미사용으로 통일: `EAT_CONTENT_PLAN.md:571`, `EAT_CONTENT_PLAN.md:603`.
- ECP-15: **PARTIAL** — EAT plan은 MedicalClinic.subjectOf 단일 결정: `EAT_CONTENT_PLAN.md:484-493`; SCHEMA_MAPPING P-002에는 subjectOf cascade 없음.
- ECP-16: **PARTIAL** — EAT plan은 article_category public policy를 명시: `EAT_CONTENT_PLAN.md:366-404`; D0014 migration 없음.
- ECP-17: **FAIL** — 실제 Article detail route는 `params.category !== "general"`이면 404이고 SQL JOIN 없음: `page.tsx:44-55`.
- ECP-18: **PARTIAL** — EAT plan의 Publication SQL에는 authors DEFAULT 제거 의도는 반영된 것으로 보이나 실제 C0010 migration 없음.
- ECP-19: **PARTIAL** — EAT plan은 `renderMarkdownToPlainText` 명시: `EAT_CONTENT_PLAN.md:517-519`; 실제 helper 여부는 본 범위 파일에서 확인 불가.
- ECP-20: **PASS** — EAT plan은 rel을 `nofollow noopener noreferrer`로 통일: `EAT_CONTENT_PLAN.md:530`.
- ECP-21: **PARTIAL** — EAT plan은 빈 FAQ page 200 + sitemap 포함 명시: `EAT_CONTENT_PLAN.md:460-466`, `EAT_CONTENT_PLAN.md:69`; 실제 route/sitemap cascade는 확인 대상 파일 외이며 migrations 부재로 end-to-end 불가.
- ECP-22: **FAIL** — EAT plan은 11페이지라고 하나 PAGE_TYPES는 여전히 10개: `EAT_CONTENT_PLAN.md:727`, `PAGE_TYPES.md:23`, `PAGE_TYPES.md:627`.

## new findings (ECP-23+)
**ECP-23 — blocking — EC-CASCADE-01이 “acceptance precondition”인데 DATA_MODEL SoT가 미패치 상태**

EAT plan은 DATA_MODEL 인벤토리 25 contracts, C-10 enum +2, C-12 풀명세, C-24/C-25 신규를 acceptance precondition으로 둔다: `EAT_CONTENT_PLAN.md:709-715`. 실제 DATA_MODEL은 23개만 선언하고 `AdminUser`에서 끝남: `DATA_MODEL.md:31-57`. C-10 enum도 Publication/MediaAppearance가 없음: `DATA_MODEL.md:769`. FAQ는 여전히 M0 외 간략 명세에 남아 있음: `DATA_MODEL.md:930-936`.

**ECP-24 — blocking — migration cascade가 실제 repo에 없음**

EAT plan은 C0009~C0013 + D0014 및 manifest 16단계를 요구한다: `EAT_CONTENT_PLAN.md:626-636`. 실제 migration 디렉터리에는 C0001~C0008, D0010, D0011만 있고, `manifest.ts`도 D0011에서 종료된다: `manifest.ts:102-127`. 이 상태에서는 article_category FK, publication/media/faq 테이블, public_reader_eat policy가 모두 적용 불가다.

**ECP-25 — blocking — PAGE_TYPES P-011 M0 cascade 미적용**

EAT plan은 P-011 FAQ를 M0 합류 및 EC-CASCADE-08 acceptance precondition으로 둔다: `EAT_CONTENT_PLAN.md:63`, `EAT_CONTENT_PLAN.md:726`. 실제 PAGE_TYPES는 P-011 M0 칸이 비어 있고: `PAGE_TYPES.md:46`, summary도 M0 10개 유지: `PAGE_TYPES.md:23`, `PAGE_TYPES.md:627`.

**ECP-26 — blocking — Article category URL 실 JOIN이 실제 코드에 미적용**

EAT plan은 Article detail SQL이 `article JOIN article_category`로 category slug를 매칭해야 한다고 한다: `EAT_CONTENT_PLAN.md:504-510`. 실제 route는 `general` 외 category를 차단하고 article 단독 조회만 수행한다: `page.tsx:44-55`.

**ECP-27 — major — SCHEMA_MAPPING EC-CASCADE-02 미적용 및 FAQ empty graph 결정과 검증 룰 충돌**

EAT plan은 SCHEMA_MAPPING에 ScholarlyArticle, VideoObject, FAQPage, Question, Answer 추가를 요구한다: `EAT_CONTENT_PLAN.md:717-720`. 실제 entity catalog에는 ScholarlyArticle이 없고 VideoObject는 Article embedded media만 대상으로 남아 있다: `SCHEMA_MAPPING.md:148-155`. 또한 EAT plan은 FAQ 0 row면 `mainEntity: []`를 허용한다고 하나: `EAT_CONTENT_PLAN.md:466`, SCHEMA_MAPPING 검증 룰은 P-011 `FAQPage + mainEntity[] 최소 1개`를 요구한다: `SCHEMA_MAPPING.md:919`.

**ECP-28 — major — CONTENT_STANDARDS EC-CASCADE-03 미적용**

EAT plan은 Publication/MediaAppearance 면제와 FAQ Q/A 적용 표를 CONTENT_STANDARDS §7.1.1.x에 추가해야 한다고 한다: `EAT_CONTENT_PLAN.md:609-617`. 실제 CONTENT_STANDARDS에는 해당 표가 없고, FAQ 답변 위험도 단편만 존재한다: `CONTENT_STANDARDS.md:310-312`.

**ECP-29 — major — RISK_LEVELS FAQ 자동 추론 cascade가 불완전**

EAT plan은 FAQ를 자동 추론 대상으로, Publication/MediaAppearance는 Low fixed로 둔다: `EAT_CONTENT_PLAN.md:25`, `EAT_CONTENT_PLAN.md:620-621`. 실제 RISK_LEVELS는 P-011 FAQ 기본 등급을 Low로 캐시하고: `RISK_LEVELS.md:123-130`, FAQ inlineRiskFlags 저장 위치만 언급한다: `RISK_LEVELS.md:498-501`. FAQ 답변 단위 Medium/High 자동 추론 대상이라는 운영 규칙이 명확히 cascade되지 않았다.

**ECP-30 — major — D0014는 D0011 패턴을 따른다고 하나 실제 D0011 이후 역할/정책 확장이 없음**

EAT plan은 D0014에서 `article_category, publication, media_appearance, faq` GRANT/policy를 추가한다고 한다: `EAT_CONTENT_PLAN.md:361-404`. 실제 D0011은 LegalDocument draft-only 패턴까지만 있고 신규 4 table 정책은 없다: `D0011_public_reader.sql:73`; D0014 파일도 없음.

## cascade marker / acceptance precondition (EC-CASCADE-01~09) 점검
- EC-CASCADE-01: **FAIL** — DATA_MODEL 미동기화.
- EC-CASCADE-02: **FAIL** — SCHEMA_MAPPING 미동기화.
- EC-CASCADE-03: **FAIL** — CONTENT_STANDARDS 미동기화.
- EC-CASCADE-04: **미검증** — `M0_BUILD_EXPORT_PLAN.md`은 본 tool pass에서 직접 확인하지 않음.
- EC-CASCADE-05: **FAIL** — D0014 migration 없음.
- EC-CASCADE-06: **FAIL** — manifest 16단계 아님.
- EC-CASCADE-07: **미검증** — `PUBLIC_SITE_RENDER_PLAN.md`은 본 tool pass에서 직접 확인하지 않음.
- EC-CASCADE-08: **FAIL** — PAGE_TYPES P-011 M0 미합류.
- EC-CASCADE-09: **미검증/의심** — EAT plan은 11페이지를 요구하지만 PAGE_TYPES는 10개 유지. `ARCHITECTURE.md`는 직접 확인하지 않음.
tokens used
123,945
# EAT_CONTENT_PLAN v0.2 — cycle 2 review

## summary
- 본 cycle 지적 수: blocking=4 major=4 minor=0 (총 8)
- closeableAfterPatch: false
- 수렴 추세: cycle1=22 (7+10+5) → cycle2=8

## cycle 1 patch 검증
- ECP-01: **FAIL** — EAT plan은 25 contracts를 말하지만, DATA_MODEL §1.1은 여전히 “23개”이고 C-24/C-25 row가 없음: `DATA_MODEL.md:31`, `DATA_MODEL.md:56-57`.
- ECP-02: **PARTIAL** — C-22 풀명세 필드는 DATA_MODEL에 존재하나 `article_category` migration 자체가 없음: `DATA_MODEL.md:913-926`.
- ECP-03: **FAIL** — C0013 staged migration 파일이 repo에 없음. 현재 migrations는 C0001~C0008 + D0010/D0011만 존재.
- ECP-04: **FAIL** — manifest는 여전히 10단계이고 D0011에서 끝남: `manifest.ts:23`, `manifest.ts:102-127`.
- ECP-05: **PARTIAL** — EAT plan 내부 결정은 VideoObject 단일화로 정리됨: `EAT_CONTENT_PLAN.md:555-571`; 그러나 SCHEMA_MAPPING SoT는 MediaAppearance용 VideoObject를 추가하지 않음: `SCHEMA_MAPPING.md:154`.
- ECP-06: **PARTIAL** — EAT plan 내부는 graph self-contained 결정: `EAT_CONTENT_PLAN.md:596-603`; SCHEMA_MAPPING P-002/P-004 graph에는 Publication/Media 풀 entity cascade가 없음.
- ECP-07: **FAIL** — DATA_MODEL C-10 enum은 여전히 Publication/MediaAppearance가 빠진 15종: `DATA_MODEL.md:769`.
- ECP-08: **PARTIAL** — EAT plan에 DB/Zod anchored DOI regex는 명시됨: `EAT_CONTENT_PLAN.md:442`; 실제 migration/form 파일 부재로 검증 불가.
- ECP-09: **PARTIAL** — EAT plan은 seed.ts + C0013 backfill을 명시: `EAT_CONTENT_PLAN.md:143-166`; C0013 migration 파일이 없음.
- ECP-10·11: **PARTIAL** — EAT plan은 FAQ draft-only DB CHECK/Zod subset 명시: `EAT_CONTENT_PLAN.md:358`, `EAT_CONTENT_PLAN.md:433-437`; 실제 faq migration/form 없음.
- ECP-12: **FAIL** — PAGE_TYPES는 P-011 M0 blank이고 M0 10개 유지: `PAGE_TYPES.md:46`, `PAGE_TYPES.md:627`.
- ECP-13: **PARTIAL** — EAT plan은 fragment-scoped @id 명시: `EAT_CONTENT_PLAN.md:477-480`, `EAT_CONTENT_PLAN.md:491-494`; SCHEMA_MAPPING cascade 없음.
- ECP-14: **PASS** — EAT plan에서 graph self-contained 및 allowlist 미사용으로 통일: `EAT_CONTENT_PLAN.md:571`, `EAT_CONTENT_PLAN.md:603`.
- ECP-15: **PARTIAL** — EAT plan은 MedicalClinic.subjectOf 단일 결정: `EAT_CONTENT_PLAN.md:484-493`; SCHEMA_MAPPING P-002에는 subjectOf cascade 없음.
- ECP-16: **PARTIAL** — EAT plan은 article_category public policy를 명시: `EAT_CONTENT_PLAN.md:366-404`; D0014 migration 없음.
- ECP-17: **FAIL** — 실제 Article detail route는 `params.category !== "general"`이면 404이고 SQL JOIN 없음: `page.tsx:44-55`.
- ECP-18: **PARTIAL** — EAT plan의 Publication SQL에는 authors DEFAULT 제거 의도는 반영된 것으로 보이나 실제 C0010 migration 없음.
- ECP-19: **PARTIAL** — EAT plan은 `renderMarkdownToPlainText` 명시: `EAT_CONTENT_PLAN.md:517-519`; 실제 helper 여부는 본 범위 파일에서 확인 불가.
- ECP-20: **PASS** — EAT plan은 rel을 `nofollow noopener noreferrer`로 통일: `EAT_CONTENT_PLAN.md:530`.
- ECP-21: **PARTIAL** — EAT plan은 빈 FAQ page 200 + sitemap 포함 명시: `EAT_CONTENT_PLAN.md:460-466`, `EAT_CONTENT_PLAN.md:69`; 실제 route/sitemap cascade는 확인 대상 파일 외이며 migrations 부재로 end-to-end 불가.
- ECP-22: **FAIL** — EAT plan은 11페이지라고 하나 PAGE_TYPES는 여전히 10개: `EAT_CONTENT_PLAN.md:727`, `PAGE_TYPES.md:23`, `PAGE_TYPES.md:627`.

## new findings (ECP-23+)
**ECP-23 — blocking — EC-CASCADE-01이 “acceptance precondition”인데 DATA_MODEL SoT가 미패치 상태**

EAT plan은 DATA_MODEL 인벤토리 25 contracts, C-10 enum +2, C-12 풀명세, C-24/C-25 신규를 acceptance precondition으로 둔다: `EAT_CONTENT_PLAN.md:709-715`. 실제 DATA_MODEL은 23개만 선언하고 `AdminUser`에서 끝남: `DATA_MODEL.md:31-57`. C-10 enum도 Publication/MediaAppearance가 없음: `DATA_MODEL.md:769`. FAQ는 여전히 M0 외 간략 명세에 남아 있음: `DATA_MODEL.md:930-936`.

**ECP-24 — blocking — migration cascade가 실제 repo에 없음**

EAT plan은 C0009~C0013 + D0014 및 manifest 16단계를 요구한다: `EAT_CONTENT_PLAN.md:626-636`. 실제 migration 디렉터리에는 C0001~C0008, D0010, D0011만 있고, `manifest.ts`도 D0011에서 종료된다: `manifest.ts:102-127`. 이 상태에서는 article_category FK, publication/media/faq 테이블, public_reader_eat policy가 모두 적용 불가다.

**ECP-25 — blocking — PAGE_TYPES P-011 M0 cascade 미적용**

EAT plan은 P-011 FAQ를 M0 합류 및 EC-CASCADE-08 acceptance precondition으로 둔다: `EAT_CONTENT_PLAN.md:63`, `EAT_CONTENT_PLAN.md:726`. 실제 PAGE_TYPES는 P-011 M0 칸이 비어 있고: `PAGE_TYPES.md:46`, summary도 M0 10개 유지: `PAGE_TYPES.md:23`, `PAGE_TYPES.md:627`.

**ECP-26 — blocking — Article category URL 실 JOIN이 실제 코드에 미적용**

EAT plan은 Article detail SQL이 `article JOIN article_category`로 category slug를 매칭해야 한다고 한다: `EAT_CONTENT_PLAN.md:504-510`. 실제 route는 `general` 외 category를 차단하고 article 단독 조회만 수행한다: `page.tsx:44-55`.

**ECP-27 — major — SCHEMA_MAPPING EC-CASCADE-02 미적용 및 FAQ empty graph 결정과 검증 룰 충돌**

EAT plan은 SCHEMA_MAPPING에 ScholarlyArticle, VideoObject, FAQPage, Question, Answer 추가를 요구한다: `EAT_CONTENT_PLAN.md:717-720`. 실제 entity catalog에는 ScholarlyArticle이 없고 VideoObject는 Article embedded media만 대상으로 남아 있다: `SCHEMA_MAPPING.md:148-155`. 또한 EAT plan은 FAQ 0 row면 `mainEntity: []`를 허용한다고 하나: `EAT_CONTENT_PLAN.md:466`, SCHEMA_MAPPING 검증 룰은 P-011 `FAQPage + mainEntity[] 최소 1개`를 요구한다: `SCHEMA_MAPPING.md:919`.

**ECP-28 — major — CONTENT_STANDARDS EC-CASCADE-03 미적용**

EAT plan은 Publication/MediaAppearance 면제와 FAQ Q/A 적용 표를 CONTENT_STANDARDS §7.1.1.x에 추가해야 한다고 한다: `EAT_CONTENT_PLAN.md:609-617`. 실제 CONTENT_STANDARDS에는 해당 표가 없고, FAQ 답변 위험도 단편만 존재한다: `CONTENT_STANDARDS.md:310-312`.

**ECP-29 — major — RISK_LEVELS FAQ 자동 추론 cascade가 불완전**

EAT plan은 FAQ를 자동 추론 대상으로, Publication/MediaAppearance는 Low fixed로 둔다: `EAT_CONTENT_PLAN.md:25`, `EAT_CONTENT_PLAN.md:620-621`. 실제 RISK_LEVELS는 P-011 FAQ 기본 등급을 Low로 캐시하고: `RISK_LEVELS.md:123-130`, FAQ inlineRiskFlags 저장 위치만 언급한다: `RISK_LEVELS.md:498-501`. FAQ 답변 단위 Medium/High 자동 추론 대상이라는 운영 규칙이 명확히 cascade되지 않았다.

**ECP-30 — major — D0014는 D0011 패턴을 따른다고 하나 실제 D0011 이후 역할/정책 확장이 없음**

EAT plan은 D0014에서 `article_category, publication, media_appearance, faq` GRANT/policy를 추가한다고 한다: `EAT_CONTENT_PLAN.md:361-404`. 실제 D0011은 LegalDocument draft-only 패턴까지만 있고 신규 4 table 정책은 없다: `D0011_public_reader.sql:73`; D0014 파일도 없음.

## cascade marker / acceptance precondition (EC-CASCADE-01~09) 점검
- EC-CASCADE-01: **FAIL** — DATA_MODEL 미동기화.
- EC-CASCADE-02: **FAIL** — SCHEMA_MAPPING 미동기화.
- EC-CASCADE-03: **FAIL** — CONTENT_STANDARDS 미동기화.
- EC-CASCADE-04: **미검증** — `M0_BUILD_EXPORT_PLAN.md`은 본 tool pass에서 직접 확인하지 않음.
- EC-CASCADE-05: **FAIL** — D0014 migration 없음.
- EC-CASCADE-06: **FAIL** — manifest 16단계 아님.
- EC-CASCADE-07: **미검증** — `PUBLIC_SITE_RENDER_PLAN.md`은 본 tool pass에서 직접 확인하지 않음.
- EC-CASCADE-08: **FAIL** — PAGE_TYPES P-011 M0 미합류.
- EC-CASCADE-09: **미검증/의심** — EAT plan은 11페이지를 요구하지만 PAGE_TYPES는 10개 유지. `ARCHITECTURE.md`는 직접 확인하지 않음.
