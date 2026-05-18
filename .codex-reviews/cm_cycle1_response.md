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
session id: 019e270b-a4ae-7fb3-8094-7b2854a184f8
--------
user
# 자동 비평 의뢰 — `docs/features/content-migration.md` v0.1 (1차 사이클)

## 컨텍스트

이전에 compliance-assistant·notifications·analytics-reporting·search-visibility·keyword-monitoring·asset-ingestion·crm-sync 7 Feature가 각각 5~7 사이클 비평을 거쳐 v1.0 안정판 도달. 본 비평은 **8번째 (마지막)** Feature `content-migration`의 v0.1 초안 1차 사이클.

본 Feature는 **솔루션 내부** 콘텐츠·데이터 마이그레이션:
- migration plan kind 5종: `schema-version-upgrade`·`feature-activation-backfill`·`instance-to-instance-copy`·`content-bulk-transform`·`policy-version-reevaluate`
- 모드: dry-run / apply
- step별 reverse-step 정의 시 rollback 지원
- legal-reviewer 승인 게이트 (instance-to-instance-copy는 PII 이동 가능)
- read-only window 운영
- compliance-assistant 재호출 (policy-version-reevaluate)

특징:
- application-level data migration (DB DDL은 인프라 책임)
- 영향 큼 — dry-run 강제·legal 게이트·rollback 가능성 필수
- asset-ingestion(외부 → 솔루션)과 경계 명확 — 본 Feature는 솔루션 내부

## 의뢰

`C:\Users\assag\solution\website-exposure\docs\features\content-migration.md` v0.1을 엄정하게 비평하라:

1. **SoT 정합**:
   - notifications v1.0 notify() + REVIEW_WORKFLOW § 9.1.1 매트릭스 cascade (신규 4종 이벤트)
   - REVIEW_WORKFLOW § 10.2.1 AuditAction cascade (6종)
   - DATA_MODEL C-08 cascade — `contentMigrationConfig`·`contentMigrationPolicyVersion`
   - compliance-assistant § 3.1 check() 호출 — policy-version-reevaluate 시 대량 호출 부하·dedupe

2. **migration plan kind 5종 적정성**:
   - 5종이 운영상 실제 필요한 모든 케이스를 커버하는가?
   - asset-ingestion과 경계가 충분히 명확한가?
   - DB DDL과 application data migration 경계는?

3. **rollback·dry-run·legal 게이트**:
   - reverse-step 강제·검증·실패 처리
   - dry-run 결과와 실제 apply 결과 차이 처리 (CAS expectedDryRunReportId만으로 충분?)
   - legal 게이트가 어떤 planKind에 필요한가? PII 이동 외에도?

4. **운영 안전성**:
   - read-only window 중 다른 Feature 운영 영향
   - 진행 중 pause/resume/cancel의 trade-off
   - retry exhausted 시 자동 pause vs 자동 rollback

5. **명세 자체의 정합성**:
   - § 0 한 페이지 요약 ↔ § 9 인벤토리 (9 tables) 일관성
   - § 1.1 변경 정책 cascade 컬럼 ↔ 실제 변경 영향
   - 미결정 (CM-01~CM-08) 분류
   - 다른 Feature와 패턴 정합 (DTO·DB schema·outbox·retry queue)

6. **이전 Feature와 패턴 정합성**:
   - crm-sync DB CHECK·partial unique·CAS·closed schema 패턴 재사용 정확성
   - notifications outbox·idempotency 패턴
   - compliance-assistant Feature contentType 예외 cascade 필요 여부

## 출력 형식

이전과 동일 JSON 스키마. 지적 ID 접두사 `CM1-`.

## 참고 SoT 경로

- `C:\Users\assag\solution\website-exposure\docs\features\content-migration.md` (대상)
- `C:\Users\assag\solution\website-exposure\docs\features\asset-ingestion.md` (경계 비교)
- `C:\Users\assag\solution\website-exposure\docs\features\crm-sync.md` (패턴 참고)
- `C:\Users\assag\solution\website-exposure\docs\features\compliance-assistant.md`
- `C:\Users\assag\solution\website-exposure\docs\features\notifications.md`
- `C:\Users\assag\solution\website-exposure\docs\admin\REVIEW_WORKFLOW.md`
- `C:\Users\assag\solution\website-exposure\docs\core\DATA_MODEL.md`
- `C:\Users\assag\solution\website-exposure\docs\ARCHITECTURE.md`
codex
대상 문서와 관련 SoT를 먼저 대조하겠습니다. 특히 이벤트/AuditAction/데이터 모델 cascade는 라인 단위로 근거를 잡아 지적하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"notify\\(|REVIEW_WORKFLOW|AuditAction|contentMigration|contentMigration|policy-version-reevaluate|migration|CM-|outbox|idempot|legal|dry-run|rollback|reverse|read-only|pause|resume|cancel\" docs/features/content-migration.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path docs\\features\\content-migration.md -TotalCount 260" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"notify\\(|AuditAction|contentMigration|contentMigration|migration|legal|PII|cascade|outbox|idempot|partial unique|CAS|CHECK|closed schema|contentType\" docs/features/asset-ingestion.md docs/features/crm-sync.md docs/features/compliance-assistant.md docs/features/notifications.md docs/admin/REVIEW_WORKFLOW.md docs/core/DATA_MODEL.md docs/ARCHITECTURE.md" in C:\Users\assag\solution\website-exposure
 succeeded in 716ms:
1:# Feature — content-migration
9:> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (cascade 필요 — 이벤트·AuditAction 신규)
10:> - 자격증명·식별자·policyVersion → DATA_MODEL C-08 (cascade 필요 — `contentMigrationConfig`·`contentMigrationPolicyVersion`)
12:> - 검수 워크플로 → REVIEW_WORKFLOW § 8 (re-evaluation 시 ComplianceRecord 새 lifecycle 진입)
19:- **Feature 식별자**: `content-migration`
20:- **핵심 책임**: (a) migration plan 정의·검증·dry-run, (b) plan 실행·진행 추적·step-level retry, (c) failure 시 rollback 또는 skip, (d) 운영 중 안전한 실행 (read-only window·partial cutover), (e) audit·legal 승인 게이트, (f) policyVersion 변경 시 ComplianceRecord 재평가
22:- **migration plan kind 5종 (v1.0)**: `schema-version-upgrade`·`feature-activation-backfill`·`instance-to-instance-copy`·`content-bulk-transform`·`policy-version-reevaluate`
23:- **운영 모드 2종**: `dry-run`(영향 보고만)·`apply`(실제 변경)
24:- **rollback 정책**: step별 reverse-step 정의 시 가능. reverse 불가능 step은 plan 정의 시 명시 + 운영자 승인
35:| 입력/출력 인터페이스 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9·§ 10 |
36:| migration plan kind 추가 | MINOR | 별개 | step type registry·build validation |
37:| migration plan kind 제거 | **MAJOR** | 별개 | |
38:| step type 추가 | MINOR | 별개 | reverse-step 정의 강제 |
41:| rollback 알고리즘 변경 | **MAJOR** | policyVersion 신규 | |
42:| build/runtime/migration fail 룰 추가·강화 | **MAJOR** | 별개 | |
48:- 알림·audit canonical SoT → notifications + REVIEW_WORKFLOW
51:- 재평가 워크플로 → REVIEW_WORKFLOW § 8 (lifecycle 진입)
52:- 본 문서 = migration plan·step·실행 파이프라인·rollback·dry-run·legal 게이트 SoT
65:- 운영자 검수 큐·상태 머신 → REVIEW_WORKFLOW (재평가 시 신규 ComplianceRecord lifecycle 진입)
67:- 인프라 DB migration (PostgreSQL DDL·schema change) → infra 인프라 책임. 본 Feature는 **application-level data migration**만
76:name: "content-migration"
87:| notifications | notify() 필수 |
88:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | NotificationEventType 신규 (cascade 필요) |
89:| REVIEW_WORKFLOW § 10.2.1 | AuditAction 신규 (cascade 필요) |
90:| DATA_MODEL C-08 | `contentMigrationConfig`·`contentMigrationPolicyVersion` (cascade 필요) |
92:| compliance-assistant | `policy-version-reevaluate` plan kind 실행 시 |
97:contentMigrationConfig:
98:  legalApproved: true
99:  legalApprovedBy: "legal@glitzy.kr"
100:  legalApprovedAt: "2026-05-10T00:00:00Z"
101:  defaultMode: "dry-run"                                # dry-run | apply
105:    instanceToInstanceCopy: super-admin + legal-reviewer
109:contentMigrationPolicyVersion: "cm-2026-05-15"
112:  - name: "content-migration"
120:        readOnlyWindowEnabled: false                    # apply 시 read-only window 강제 여부
124:      rollback:
125:        autoRollbackOnFailure: false                    # true면 step 실패 시 자동 rollback. false면 운영자 수동
126:        rollbackTimeoutSeconds: 7200
129:        impactSamplingSize: 100                         # dry-run 시 변경 영향 sample 개수
147:| 실행 | `definePlan(input)` | migration plan 정의·검증 | super-admin |
148:| 실행 | `validatePlan(planId)` | plan 정의 검증 (step 정합성·reverse-step·legal) | super-admin |
149:| 실행 | `runDryRun(planId)` | dry-run 실행·영향 보고 | super-admin |
150:| 실행 | `runApply(planId, options)` | 실제 plan 실행 | super-admin (legal 게이트 통과 시) |
151:| 실행 | `pauseRun(runId, reason)` | 진행 중 plan 일시 정지 | super-admin |
152:| 실행 | `resumeRun(runId)` | 정지된 plan 재개 | super-admin |
153:| 실행 | `cancelRun(runId, reason)` | 진행 중 plan 취소 | super-admin |
154:| 실행 | `rollbackRun(runId, scope)` | 완료·실패 plan rollback | super-admin |
155:| read | `queryPlans` | plan 목록·detail | operator·super-admin·legal-reviewer |
158:| 운영 | `approvePlanLegalGate(planId)` | legal 승인 게이트 | legal-reviewer |
162:| AuditAction | contentRef | metadata |
164:| `content-migration-plan-defined` | `"cm-plan:" + planId` | planKind·targetEntityCount·legalRequired·approvalChain |
165:| `content-migration-plan-legal-approved` | `"cm-plan:" + planId` | approvedBy·approvedAt·planFingerprint |
166:| `content-migration-run-started` | `"cm-run:" + runId` | mode·planId·estimatedDurationSeconds |
167:| `content-migration-run-completed` | `"cm-run:" + runId` | result·changedRecords·failedSteps·rollbackTriggered |
168:| `content-migration-run-cancelled` | `"cm-run:" + runId` | cancelledBy·reason·completedSteps |
169:| `content-migration-rollback-applied` | `"cm-run:" + runId` | scope·rolledBackSteps·result |
180:분원 신설 등 본원 콘텐츠 일괄 복제. PII 이동 시 legal-reviewer 승인 강제.
185:#### 3.2.5 policy-version-reevaluate
196:  | "policy-version-reevaluate";
206:  idempotencyKey: string;
213:  reverseStep?: MigrationStep;                          // rollback 시 실행. 없으면 reverse 불가
220:  expectedDryRunReportId: string;                       // CAS — 가장 최근 dry-run report 기반 실행
235:### 4.1 plan 정의 → validate → dry-run → legal 승인 → apply
239:2. validatePlan(planId) — step type 등록 확인·reverse-step 정합·targetSelector 유효
242:4. legal 게이트 요구 시 approvePlanLegalGate(planId) — ComplianceRecord 별도 lifecycle (REVIEW_WORKFLOW § 8)
244:   - read-only window (config) 적용 — 다른 admin write 차단
250:### 4.2 rollback
253:1. rollbackRun(runId, scope) — 완료된 step에서 reverse-step 역순 실행
254:2. reverse-step 없는 step → skip + 운영자 alert (수동 처리 필요)
255:3. rollback 자체 실패 → super-admin alert
258:### 4.3 read-only window
266:### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 cascade 필요)
270:| `content-migration-plan-approved` | high | email + inApp | super-admin |
271:| `content-migration-run-completed` | medium | inApp | super-admin |
272:| `content-migration-run-failed` | critical | email + inApp | super-admin |
273:| `content-migration-rollback-triggered` | high | email + inApp | super-admin |
275:### 5.2 outbox — search-visibility § 7.3 SQL 동일
284:| dry-run 정확도 | apply 결과와 일치 | > 95% |
285:| rollback 성공율 | rollback 호출 시 | > 99% |
287:| read-only window 평균 길이 | baseline | |
301:- `enabled=true` + `contentMigrationConfig` 누락
302:- `contentMigrationPolicyVersion` 누락
303:- `legalApproved !== true`
310:- legal 게이트 필요한 planKind인데 `approvePlanLegalGate` 미수행
312:- reverse-step 없는 step에 대해 rollback scope 지정 → runtime fail (운영자 명시적 skip 요구)
316:- 진행 중 run pausedAt > 24h → 운영자 alert
317:- step retry exhausted → run 자동 pause
318:- read-only window 적용 중 다른 admin write 시도 → 거부 + alert
325:plan 정의·status (draft·validated·dry-run-completed·legal-approved·apply-ready·archived).
328:dry-run 결과 — 영향 row 수·sample diff·예상 시간.
331:legal 게이트 승인 기록 — approvedBy·approvedAt·planFingerprint.
334:실행 envelope (status=pending·running·paused·completed·failed·cancelled·rollback-in-progress·rolled-back).
343:rollback 시 실행된 reverse-step 기록.
346:read-only window 적용 기간 추적.
357:| CM-01 | 외부 cluster 간 cross-instance migration 지원 (분원 신설 시 다른 region) |
358:| CM-02 | partial cutover (일부 row만 새 schema 적용) 지원 |
359:| CM-03 | dry-run sampling 알고리즘 — 단순 random vs stratified |
360:| CM-04 | read-only window 중 운영자 write 우회 권한 |
361:| CM-05 | rollback 시 일부 step만 부분 rollback 안전성 |
362:| CM-06 | policy-version-reevaluate 대량 batch 시 compliance-assistant 부하 관리 |
363:| CM-07 | instance-to-instance-copy의 PII 마스킹 정책 |
364:| CM-08 | DB DDL migration과 application-level data migration 경계 |

 succeeded in 713ms:
docs/ARCHITECTURE.md:20:- 코어의 직각 차원으로 **Feature Modules**(notifications · asset-ingestion · crm-sync · analytics-reporting · keyword-monitoring · **search-visibility** · compliance-assistant · content-migration)를 둔다. Instance가 선택 장착한다.
docs/ARCHITECTURE.md:138:   keyword-monitoring · search-visibility · compliance-assistant · content-migration
docs/ARCHITECTURE.md:200:| 기존 콘텐츠 이관 | | | | ✅ content-migration | 도구 |
docs/ARCHITECTURE.md:408:| Feature | `features/*` (8종) | notifications, asset-ingestion, crm-sync, analytics-reporting, keyword-monitoring, **search-visibility**, compliance-assistant, content-migration |
docs/ARCHITECTURE.md:531:| **content-migration** | 기존 사이트·블로그·카페 콘텐츠를 솔루션 데이터 모델로 이관 | Core 콘텐츠 저장소 인터페이스 | 이관 분량·복잡도 |
docs/ARCHITECTURE.md:562:| content-migration | 검토 | 기존 콘텐츠 이관 규모 |
docs/ARCHITECTURE.md:603:| 2026-05-14 | v0.6 | **피드백 정정 — 후속 동기화** (PAGE_TYPES v0.5.1 / DATA_MODEL v0.5 / admin v0.5): (1) **P-013 Legal/Policy를 M0 출시 게이트로 격상** — M0 9 → 10페이지 (Core 표준 템플릿 + ClinicProfile 변수 자동 치환), (2) C-10 ComplianceRecord.contentType enum에 `LegalDocument` 추가, (3) `CTAConfig.isFeatured: boolean` 신규 — LocationProfile.featuredCta `Ref<CTAConfig>` 표기 위반 정정, 필드 제거, (4) 관계 다이어그램 Article.author/reviewedBy 단일 참조 표기 정정. 본 문서 § 2.4 인벤토리는 영향 없음 (LegalDocument는 이미 등재된 C-16) | Glitzy (Claude 페어링) |
docs/ARCHITECTURE.md:604:| 2026-05-14 | v0.7 | **피드백 정정 — 후속 동기화** (PAGE_TYPES v0.6 / DATA_MODEL v0.6 / admin v0.6): (1) admin § 3.3 ClinicProfile 행 SoT 정합 분리, (2) **LegalDocument 변수 출처** ClinicProfile + LocationProfile(main) 명시, (3) **C-16 LegalDocument M0 ✅ (auto) 표시**, (4) **LegalDocument 법무 검토 강제 룰** — ComplianceRecord.legalCounsel/legalCounselAt required (위험도 Low 예외 게이트), (5) **CTAConfig.isFeatured 회귀 제거** (v0.5 도입 → v0.6 제거) + **LocationProfile.featuredChannelId: Slug 신규** (컨테이너에 두기 — 객체 재사용 시 의도 누수 방지). 본 문서 § 2.4 인벤토리는 영향 없음 | Glitzy (Claude 페어링) |
docs/core/DATA_MODEL.md:4:> **작성일**: 2026-05-14 (v0.20 — `features/crm-sync.md` 3차 사이클 cascade: C-08 CrmIntegrationEntry에 `genericRestApiAdapter` 추가 + manifest vs CrmCredentialVersion(admin DB) 경계 명시 — CS3-13)
docs/core/DATA_MODEL.md:20:- v0.13: `features/notifications.md` cascade — C-08 확장(`adminBaseUrl`·`timezone`·`NotificationChannelsConfig`) + **C-23 `AdminUser` 신설** (어드민 사용자·자격·알림 선호 SoT).
docs/core/DATA_MODEL.md:222:| `legalEntityName` | `string` | optional | 법인 정식 명칭 |
docs/core/DATA_MODEL.md:656:| `serpCrawler` | `{enabled: boolean, targetSearchEngines: ("naver"\|"google")[], siteDomain: string, userAgent: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedScope?: SerpCrawlerApprovedScope}` | optional | 자체 SERP 크롤러. `enabled=true` + (`legalApproved !== true` 또는 `legalApprovedBy`·`legalApprovedAt` 누락) → 빌드 fail (SV2-01 정정 — 자동 크롤링 ToS 위험 회피 — `features/search-visibility.md` § 5.2) |
docs/core/DATA_MODEL.md:665:| `serpCrawler` | `{enabled: boolean, ...}` | optional | **v1.0: `enabled=true` → 빌드 fail (regardless of legalApproved)** — `features/keyword-monitoring.md` § 5.2 v1.0 미지원 정책 (KM2-01). v1.x 활성화 시 search-visibility SerpCrawlerApprovedScope 게이트 패턴 재사용 (KM-14 후속 결정 후). v1.0 manifest validator는 enabled=true 단독으로 fail 처리, legalApproved/승인자/시각 검증은 v1.x 활성 시점부터 적용 |
docs/core/DATA_MODEL.md:673:| `sources.webCrawl` | `{enabled: boolean, targetDomains: string[], userAgent: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedScope?: AssetIngestionApprovedScope}` | optional | 외부 웹사이트 크롤링. `enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedScope` 누락) → 빌드 fail (F-11) |
docs/core/DATA_MODEL.md:674:| `sources.snsApi.<platform>` | `{enabled: boolean, apiKeySecretRef: string, blogId/accountId: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedAccountIds: string[], allowedContentTypes: string[], consentEvidenceRef?: string}` | optional | platform=naverBlog·instagram·facebook·youtube. `enabled=true` + 법무 게이트 누락 → 빌드 fail (F-12) |
docs/core/DATA_MODEL.md:710:| `legalApproved` | boolean | ✅ | **DPA(Data Processing Agreement) 체결 완료** — true 필수 (CS1-12) |
docs/core/DATA_MODEL.md:711:| `legalApprovedBy` | string | ✅ | |
docs/core/DATA_MODEL.md:712:| `legalApprovedAt` | Date | ✅ | |
docs/core/DATA_MODEL.md:720:법무가 승인한 SERP 크롤러 권한 범위. crawler 실행 파라미터가 본 범위 밖이면 `skipped-legal-out-of-scope` 처리:
docs/core/DATA_MODEL.md:751:| `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature}` | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1) |
docs/core/DATA_MODEL.md:752:| `featureContentType` | `string` (`feature:<slug>` 형식, 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$`) | conditional | `contentType="Feature"` 시 required — Feature 콘텐츠 세부 식별. 예: `feature:self-test` |
docs/core/DATA_MODEL.md:764:| `legalCounsel` | `string` | optional (**LegalDocument: required**, High recommended) | LegalDocument 발행 시 필수 — 위험도 Low 예외 룰. 어드민 발행 게이트가 누락 시 차단 |
docs/core/DATA_MODEL.md:765:| `legalCounselAt` | `Date` | optional (**LegalDocument: required**) | LegalDocument 발행 시 필수 |
docs/core/DATA_MODEL.md:776:| `mediaThresholdAssessment` | `MediaThresholdAssessment` | optional | (v0.14 +) 의료법 일평균 이용자 10만 매체 분류 **법무 확정 판정**. **`calendarPolicy="previous-3-months-calendar"`만 본 슬롯에 저장** (rolling-90 운영값 저장 금지 — v0.15 정정). legal 검수자가 채움. priorReviewRequired 산정 근거 |
docs/core/DATA_MODEL.md:777:| `mediaThresholdOperationalInput` | `MediaThresholdAssessment` | optional | (v0.15 +) `features/analytics-reporting.md`이 제공한 rolling-90 operational snapshot — pre-publish record의 legal 판정 **입력 자료**. legal 검수자 calendar 산정 시 참고용. **published record에는 본 슬롯이 calendar로 대체되지 않고 그대로 보존됨** (감사 추적용) |
docs/core/DATA_MODEL.md:793:| `legalBasisNote` | `Markdown` | optional | 법무 의견서 본문 (법정 산정의 경우 필수 권장 — `legalCounsel`·`legalCounselAt`과 함께) |
docs/core/DATA_MODEL.md:810:| `legal` | `boolean` | optional | `true`면 legalCounsel 재검수 필요 (의료법 개정·고리스크 변경 등) |
docs/core/DATA_MODEL.md:828:**목적**: 개인정보처리방침·이용약관·비급여 진료 안내 등 법적 정책 문서. **M0 출시 게이트**. Core 표준 템플릿 + ClinicProfile + LocationProfile(main) 변수 자동 치환으로 생성. 법무 검토 필수 (ComplianceRecord.legalCounsel/legalCounselAt required).
docs/core/DATA_MODEL.md:857:- 발행 시 `ComplianceRecord(contentType=LegalDocument, legalCounsel=*, legalCounselAt=*)` 필수 — 위험도 Low 예외 게이트 (§ 4 C-10 참조).
docs/core/DATA_MODEL.md:950:| `role` | `AdminUserRole` (단 `system` 제외) | ✅ | `admin/REVIEW_WORKFLOW.md` § 11.1 enum 6종 중 실제 사용자 역할 5종(`super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver`). **`system`은 audit log actorRole 표기 전용** — AdminUser DB row 미생성, 로그인 불가. C-23.`role` 및 `instanceMemberships[].role`에는 저장 금지 |
docs/core/DATA_MODEL.md:951:| `approverRoleEligibility` | `ApproverRole[]` | optional | 사용자가 승인할 수 있는 검수 역할(`operator`·`medical`·`legal`·`client`) — § 11.2 자격 검증 통과 결과 누적 |
docs/core/DATA_MODEL.md:952:| `eligibilityEvidence` | `Array<{role: ApproverRole, doctorProfileRef?: Ref<C-02>, legalCounselRef?: string, clientDelegationRef?: string, verifiedAt: Date, verifiedBy: string}>` | optional | 자격 인증 근거 — medical은 DoctorProfile·credentials[], legal/client는 후속 데이터 모델(RL-04/RL-05) |
docs/core/DATA_MODEL.md:1071:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
docs/core/DATA_MODEL.md:1072:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
docs/core/DATA_MODEL.md:1076:| 2026-05-14 | v0.10 | **SEARCH_STANDARDIZATION v0.2 cascade**: C-06 PageMeta `ogType` enum 확장 — `{website, article}` → **`{website, article, profile}`**. P-004 Doctor Profile 등 인물 페이지가 `profile` og:type을 사용 (SEARCH_STANDARDIZATION § 2.2 매핑 참조) |
docs/core/DATA_MODEL.md:1077:| 2026-05-14 | v0.11 | **SEARCH_STANDARDIZATION v0.5 cascade — C-08 InstanceManifest 확장**: `environment`·`aiCrawlerPolicy`(required)·`aiCrawlerLegalApproved`·`aiCrawlerApprovedBy/At`·`robotsOverrides`·`experimentalAiBots`·`performanceBudget`·`searchConsoleVerification` 8개 필드 추가. 하위 타입 `RobotsOverride`·`PerformanceBudget` 신설 |
docs/core/DATA_MODEL.md:1078:| 2026-05-14 | v0.12 | **SEARCH_STANDARDIZATION v0.6 cascade**: (1) **`aiCrawlerApprovedBy/At`을 `aiCrawlerPolicy: allow` 시 required로 격상** — 감사 추적 게이트 강화, (2) **`PerformanceBudget` 확장** — `imageWeightKbOverride`·`lighthouseSeoMinOverride`·`lighthouseAccessibilityMinOverride` 추가 (SEARCH_STANDARDIZATION § 6.1 budget 항목 정합) |
docs/core/DATA_MODEL.md:1079:| 2026-05-14 | v0.19 | **`features/crm-sync.md` 1차 사이클 cascade**: (1) **C-08 `crmSyncConfig` 신설** (CrmSyncConfig·CrmIntegrationEntry — provider 3종 한정, dpaEvidenceRef·patientConsentEvidenceRef 분리), (2) **C-08 `crmSyncPolicyVersion`** (7 Feature policyVersion 동일 패턴) |
docs/core/DATA_MODEL.md:1080:| 2026-05-14 | v0.20 | **`features/crm-sync.md` 3차·5차 사이클 cascade (CS3-13·CS5-01)**: (1) CrmIntegrationEntry에 `genericRestApiAdapter` 필드 추가 — provider=generic-rest-api 시 required. **5필드** (webhookSignatureHeader·webhookTimestampHeader·webhookEventIdHeader·canonicalStringFormat·`versionTokenJsonPath`) + `versionTokenType` enum, (2) manifest(secretRef) vs admin DB(`CrmCredentialVersion` — secretVersionId·rotation state) 경계 명시 |
docs/core/DATA_MODEL.md:1081:| 2026-05-14 | v0.18 | **`features/asset-ingestion.md` 1차 사이클 cascade**: (1) **C-08 `assetIngestionConfig` 신설** (AssetIngestionConfig — sources webCrawl/snsApi/manualUpload/csvImport), (2) **C-08 `assetIngestionPolicyVersion`** (6 Feature policyVersion 동일 패턴), (3) **`AssetIngestionApprovedScope` 신규** — SerpCrawlerApprovedScope의 SERP 특화 필드 제거·자산 수집 특화(allowedDomains·allowedPathPrefixes·maxPagesPerCrawl·maxAssetSizeMb·artifactRetentionDaysMax) |
docs/core/DATA_MODEL.md:1082:| 2026-05-14 | v0.17 | **`features/keyword-monitoring.md` 1차 사이클 cascade**: (1) **C-08 `keywordMonitoringConfig` 신설** (KeywordMonitoringConfig — search-visibility의 SerpCrawlerApprovedScope 게이트 패턴 재사용), (2) **C-08 `keywordMonitoringPolicyVersion`** (top-level, 4 Feature policyVersion 동일 패턴) |
docs/core/DATA_MODEL.md:1083:| 2026-05-14 | v0.16 | **`features/search-visibility.md` 1차 사이클 cascade**: (1) **C-08 `searchVisibilityConfig` 신설** (SearchVisibilityConfig — serpCrawler/backlinkSource, serpCrawler.enabled=true + legalApproved 게이트 fail-gate), (2) **C-08 `searchVisibilityPolicyVersion`** (top-level, notifications·analytics 패턴 동일) |
docs/core/DATA_MODEL.md:1084:| 2026-05-14 | v0.15 | **`features/analytics-reporting.md` 4차 사이클 cascade**: (1) **C-08 `analyticsPolicyVersion` 신설** — notifications policyVersion 패턴 동일 (필수, 패키지 병렬 보관), (2) **C-10 `mediaThresholdOperationalInput` 슬롯 분리** — rolling-90 operational snapshot은 본 슬롯, calendar 확정 판정은 `mediaThresholdAssessment` 슬롯. published record는 calendar 값만 (AR4-08) |
docs/core/DATA_MODEL.md:1085:| 2026-05-14 | v0.14 | **`features/analytics-reporting.md` 1차 사이클 cascade**: (1) **C-08 `analyticsConfig` 신설** — `AnalyticsConfig`(sources.gsc·naverSearchAdvisor·ga4·rum 자격증명·사이트 식별자만, 동작 옵션은 `features.analytics-reporting.config`로 분리), (2) **C-10 `mediaThresholdAssessment` 슬롯** — `MediaThresholdAssessment` 신설(assessmentBasisDate·windowStart/End·rollingAverageDailyUsers·thresholdReached·primarySource·sourceCompleteness·timezone·calendarPolicy·botFilteringPolicy·legalBasisNote). priorReviewRequired 산정 근거. ComplianceRecord 발행 시 snapshot으로 고정 |
docs/core/DATA_MODEL.md:1086:| 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `AdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`eligibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·digestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IANATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |
docs/features/notifications.md:7:> **목적**: 어드민(Control Plane)의 워크플로 이벤트·SLA 임박·운영 알람을 인스턴스별 채널(이메일·Slack·in-app)로 발송하는 Feature Module의 단독 구현 명세 — idempotent 발송, 채널 어댑터, digest 정책 AST, 보류 큐, 재시도·DLQ·suppression(autoRelease 포함), 운영 지표, 내부 데이터 구조 11 tables + Redis.
docs/features/notifications.md:22:- **idempotency 원자 선점**: 1단계 단일 트랜잭션에서 Log insert → Receipt insert(`unique(instanceId, sourceEventId)`). 트랜잭션 commit 후에야 NotificationEventReceipt 가시화. 동일 sourceEventId 동시 호출은 unique 위반으로 한 쪽만 진입, 다른 쪽은 기존 결과 재구성 반환 (§ 14.2)
docs/features/notifications.md:24:- **critical 우회 범위**: quietHours·businessHours·user opt-out **만**. inactive 사용자·인스턴스 채널 비활성·idempotency·dedupe·instance membership은 critical도 적용. hard-suppressed 시 fallback은 **REVIEW_WORKFLOW § 9.1.1 매트릭스 컬럼 SoT** — 임의 활성 채널 라우팅 금지
docs/features/notifications.md:38:| 입력/출력 인터페이스 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9 cascade |
docs/features/notifications.md:39:| `NotificationEventType` enum 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9.1 cascade |
docs/features/notifications.md:43:| 채널 enum 추가 | MINOR | 별개 | C-08 `NotificationChannelsConfig` cascade |
docs/features/notifications.md:89:| `admin/REVIEW_WORKFLOW.md` § 10.2.1 | AuditAction enum (`notification-dispatched`·`notification-resend-attempted`·`notification-read`) |
docs/features/notifications.md:123:        LegalDocument: "/admin/legal/{contentRef}"
docs/features/notifications.md:124:        default: "/admin/content/{contentType}/{contentRef}"
docs/features/notifications.md:143:- `sourceEventId` — idempotency key (필수)
docs/features/notifications.md:215:### 3.3 단일 엔트리포인트 — `notify()`
docs/features/notifications.md:218:async function notify(event: NotificationEvent): Promise<DeliveryResult>
docs/features/notifications.md:221:**idempotency 계약** (REVIEW_WORKFLOW § 9.2.1 — 트랜잭션 안전):
docs/features/notifications.md:227:  - `unique(instanceId, sourceEventId)` violation → idempotent duplicate. 기존 Log·Receipt 조인 → DeliveryResult 재구성 반환 (early exit)
docs/features/notifications.md:235:**resendDeadLetter** — § 7.2 별도 command (notify() 경로 우회)
docs/features/notifications.md:237:**ctaUrl 자동 합성**: `adminBaseUrl + ctaRouteTemplates[contentType].replace("{contentRef}", contentRef)` (default 사용)
docs/features/notifications.md:246:1. idempotency 원자 선점 (단일 DB 트랜잭션 — immediate FK):
docs/features/notifications.md:250:     - `unique(instanceId, sourceEventId)` violation → idempotent duplicate. 기존 NotificationLog·Receipt 조인으로 DeliveryResult 재구성 반환 (receiptState별 응답 — § 3.3 duplicate caller 계약)
docs/features/notifications.md:312:  - **deprecation 절차**: 새 policyVersion 추가 시 — 6개월 후 deprecation 마킹 + 모든 활성 인스턴스에 migration report 발송 (운영팀). 12개월 후 사용 0건 확인 시 제거 가능
docs/features/notifications.md:313:  - **archived/복구 인스턴스 처리**: 복구 인스턴스가 deprecated/removed version 참조 시 — build fail 메시지 "policyVersion <X> not found. Available: [<list>]. See migration report at <docs>" 표시
docs/features/notifications.md:446:**DigestConditionField 추가 cascade 정책** (N4-11): DigestConditionField에 새 metadata 필드를 추가하려면 (a) REVIEW_WORKFLOW § 9.2 NotificationEvent.metadata 타입에 해당 필드를 명시 cascade, (b) 본 enum 추가, (c) 본 Feature 패키지 새 policyVersion. metadata 필드의 enum 한정이 SoT.
docs/features/notifications.md:554:**resendDeadLetter(deadLetterId)** — notify() 우회 별도 command:
docs/features/notifications.md:559:- audit log: `notification-resend-attempted` (REVIEW_WORKFLOW § 10.2.1 — cascade 완료)
docs/features/notifications.md:584:- **command**: `unsuppressAdminUserChannel(adminUserId, channel, reason)` — notify() 우회 별도 command
docs/features/notifications.md:587:- **audit log**: `notification-suppression-unsuppressed` (REVIEW_WORKFLOW § 10.2.1 — cascade 완료). metadata: `{adminUserId, channel, reason, priorState}`
docs/features/notifications.md:596:- **digest 발송 시각**: **InstanceManifest.timezone 고정** (DATA_MODEL C-23 v0.13 cascade로 AdminUser.timezone 설명을 quietHours 한정으로 좁힘 — N3-20)
docs/features/notifications.md:624:  - **PublicHoliday 처리**: BusinessHours.dayOfWeek="PublicHoliday" 룰 평가 시 — **C-08 `holidayCalendar.region`** SoT의 한국 공휴일 캘린더 매칭 (`region: "KR"` → 본 Feature 패키지 embed 한국 공휴일 데이터, N3-13 cascade)
docs/features/notifications.md:634:- operator·physician·legal·super-admin: 본 정책 미적용
docs/features/notifications.md:711:| ~~NT-02~~ | AdminUser cascade | v0.2 — C-23 신설 |
docs/features/notifications.md:719:| ~~NT-15~~ | notification-read audit | v0.4 — REVIEW_WORKFLOW § 10.2.1 cascade |
docs/features/notifications.md:733:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (7개 지적 전건 수용)**: (1) **REVIEW_WORKFLOW § 9.1.1 매트릭스 정정** — `sla-imminent`·`sla-overdue` 즉시 채널을 `email + inApp`으로 변경. fallback=inApp이 immediateChannels 집합 안에 포함되도록 cascade (N5-01), (2) **§ 4.1 1단계 abort 원인 분기 명시** — unique violation만 idempotent path, 그 외 abort는 retryable internal error 반환. § 3.3과 정합 (N5-02), (3) **DeliveryAttemptStatus 별도 정의** — 내부 attempt-level "processing"을 외부 DeliveryStatus와 분리. `DeliveryAttemptStatus = "processing" | DeliveryStatus` 합 타입 (N5-03), (4) **§ 4.1 흐름에 invalid locationRef 분기 추가** — businessHours 평가 직전 (f-pre)에 `skipped-missing-location` 명시. critical 이벤트도 본 분기는 우회하지 않음 (N5-04), (5) **MySQL generated column unique schema 정정** — `activeKey INT GENERATED AS (CASE WHEN resolvedAt IS NULL THEN 1 ELSE NULL END)` + `UNIQUE(payloadId, failingChannel, activeKey)`. resolved DLQ 이력 다수 허용 (N5-05), (6) **DATA_MODEL C-23 AdminUser.role cascade 정정** — `system` enum 값은 audit log actorRole 표기 전용. C-23 `role` 및 `instanceMemberships[].role`에는 저장 금지 명시 (N5-06), (7) **specVersion 1.0 + 세 버전 의미 차이** — specVersion(명세)·패키지 SemVer·notificationPolicyVersion 구분 한 줄 설명 (N5-07) (1) **트랜잭션 abort 원인 분기** — unique violation만 idempotent path, 그 외 retryable error (N4-01·N4-03), (2) **duplicate caller receiptState별 응답 계약** (N4-02), (3) **DeliveryAttempt advisory lock SoT** — pg_advisory_xact_lock + provider 호출은 lock 밖 (N4-04·N4-06). NT-17, (4) **UNIQUE(payloadId, channel, attemptNumber)** — dedupeMode 제외 (N4-05), (5) **§ 4.1 fallback immediateChannels 제약** 명시 (N4-07), (6) **fallback 실패 두 attempt 기록** + fallbackExhausted 메타 (N4-08), (7) **두 축 분리 정책** — 패키지 SemVer ↔ policyVersion (N4-09), (8) **policyVersion 보관 정책** — 12개월 최소 지원·deprecation·build fail 메시지 (N4-10), (9) **DigestConditionField cascade 규칙** (N4-11), (10) **exists/notExists deep path 평가 규칙** (N4-12), (11) **default policy 유일성 검증** (N4-13), (12) **broadcast PayloadRecord envelope+channel 단위 1건** + broadcast-placeholder는 DB row 아님 + broadcastAttemptId = broadcast DeliveryAttempt.id (N4-14·N4-15·N4-16), (13) **holidayCalendar 갱신·배포 정책** — 연간 minor·임시공휴일 patch·external-api override (N4-17). NT-18, (14) **businessHours 90일 탐색 한계** + failed-permanent (N4-18), (15) **invalid locationRef → `skipped-missing-location`** DeliveryStatus 신규 (N4-19), (16) **운영자 수동 unsuppress command** + REVIEW_WORKFLOW § 10.2.1 `notification-suppression-unsuppressed` cascade (N4-20·N4-21), (17) **soft → hard 전이 정책** (N4-22), (18) **큐 worker 중복 발송 방지 SoT 쿼리** + partial index (N4-23), (19) **inApp 단일 transaction 원자성** (N4-24), (20) **DeadLetterAttempt UNIQUE(attemptId)** — 1 attempt 1 DLQ (N4-25), (21) **MySQL generated column 대체 schema** 구체 명시 (N4-26), (22) **notification-read actorRole = instanceMemberships 현재 instance role** (N4-27), (23) **AdminUserRole `system` 추가** — REVIEW_WORKFLOW § 11.1 cascade (N4-28), (24) **multi-location + main 부재 fail 격상** (N4-29), (25) **NT-16 해소** (N4-30) (20 finding + 3 residual = 23 지적 전건 수용)**: (1) **Receipt-Log 트랜잭션 순서** — 단일 DB 트랜잭션에서 Log insert → Receipt insert. abort 시 양쪽 롤백 (N3-01), (2) **테이블 인벤토리 재산정 — 11 tables + Redis 1** — Receipt·Log·PayloadRecord·DeliveryAttempt·Inbox·DigestBucket·DigestBucketPayload·QuietHoursQueue·BusinessHoursQueue·DeadLetter·**DeadLetterAttempt(신설)** + DedupeCache. `NotificationDelivery` 가상 참조 제거 (N3-02·N3-19), (3) **DeliveryAttempt attemptNumber 동시성** — payloadId+channel 범위 row lock 또는 advisory lock + processing 선점 (N3-03), (4) **PayloadRecord recipient-envelope unit 명확화** — channel 필드 제거, directSentAt/digestSentAt 제거. 채널별 sentAt 추적은 DeliveryAttempt status만 사용 (N3-04), (5) **fallback 채널 매트릭스 SoT** — REVIEW_WORKFLOW § 9.1.1 컬럼 cascade. 임의 활성 채널 라우팅 금지, fallback도 막히면 외부 sink alert만 (N3-05), (6) **dedupe Redis SET NX EX 원자** — 명시 (N3-06), (7) **receipt vs dedupe TTL 관계** — `receiptRetentionDays`(기본 365일) ≫ dedupeWindowSeconds. sourceEventId 재사용 금지 (N3-07), (8) **REVIEW_WORKFLOW § 9.3 cascade** — Slack 2가지 동작 모드·DeliveryResult 소비 규칙 명시 (N3-08), (9) **broadcast envelope 단위 1건** — broadcastAttemptId·sentinel dedupeKey·perRecipient placeholder broadcastAttemptId 참조 (N3-09), (10) **DigestPolicy AST 구조화** — DigestCondition({field, op, value}) + 허용 enum (N3-10), (11) **policyVersion 병렬 보관** — 패키지에 버전별 매트릭스 보관, manifest opt-in, 롤백은 manifest 변경만 (N3-11), (12) **DigestBucketPayload FK 분리** — bucketId CASCADE, payloadId RESTRICT (N3-12), (13) **C-08 holidayCalendar cascade** — region·source. PublicHoliday SoT 정합. CT-02 dayOfWeek enum과 분리 (N3-13), (14) **LocationProfile `@id="main"` 관례 정합** — C-21 SoT 정합 (N3-14), (15) **suppression autoReleaseAt + worker** — § 7.4 1시간 주기. DATA_MODEL C-23 cascade (N3-15), (16) **suppression atomic increment** — DB atomic + compare-and-set threshold 1회 alert (N3-16), (17) **REVIEW_WORKFLOW § 10.2.1 enum cascade** — `notification-resend-attempted`·`notification-read` (N3-17), (18) **DLQ SQL syntax PostgreSQL** — partial unique index 표기 (N3-18), (19) **DATA_MODEL C-23 timezone 설명 정정** — quietHours 한정 (N3-20), (20) **inactive 사용자 historical inbox 정책** — 기본 숨김 + 인스턴스 옵션 (NT-16) (Residual), (21) **cadenceWindow 포맷 명시** — daily `YYYY-MM-DD`, weekly `YYYY-Wnn` (Residual), (22) **instanceMemberships 검증** — recipient AdminUser.instanceMemberships에 본 인스턴스 미포함 시 `skipped-missing-user` (Residual) |
docs/features/notifications.md:745:### 14.2 `NotificationEventReceipt` (idempotency 선점)
docs/features/notifications.md:751:| `sourceEventId` | string | ✅ | idempotency key |
docs/features/notifications.md:872:| `bucketId` | UUID | ✅ — FK NotificationDigestBucket ON DELETE CASCADE |
docs/features/notifications.md:876:**Constraints**: `UNIQUE(bucketId, payloadId)`. bucketId CASCADE (bucket 삭제 시 join row만 삭제), payloadId RESTRICT (PayloadRecord 보존 — N3-12 정정).
docs/features/notifications.md:951:| `deadLetterId` | UUID | ✅ — FK NotificationDeadLetter ON DELETE CASCADE |
docs/features/notifications.md:963:PostgreSQL partial unique index 미지원 DBMS에서는 generated column + 일반 unique constraint로 대체:
docs/features/notifications.md:968:activeKey INT GENERATED ALWAYS AS (CASE WHEN resolvedAt IS NULL THEN 1 ELSE NULL END) STORED,
docs/features/compliance-assistant.md:24:- **캐시·idempotency**: 동일 (콘텐츠 본문 hash + 룰 카탈로그 version) → 동일 결과. cache hit 시 LLM 미호출
docs/features/compliance-assistant.md:34:| 입력/출력 인터페이스 변경 | **MAJOR** | CONTENT_STANDARDS § 7 cascade 동반 |
docs/features/compliance-assistant.md:35:| RiskInference 알고리즘 변경 (강화) | **MAJOR** | RISK_LEVELS § 2 cascade |
docs/features/compliance-assistant.md:87:DATA_MODEL C-08 `features[]`에 본 Feature 등록 (v0.10 cascade로 `config` 필드 신설):
docs/features/compliance-assistant.md:112:  contentType: ContentType;
docs/features/compliance-assistant.md:155:- `metadata.pageTypeId` 미지정 시 — check()가 `contentType` + `pageMeta` 기반으로 자동 유도 (예: `contentType="LegalDocument"` → P-013). 유도 불가 시 fail (§ 11 빌드 검증)
docs/features/compliance-assistant.md:156:- `metadata.articleType` 미지정 시 — `contentType="Article"`이면 fail. 그 외 콘텐츠는 articleType N/A로 처리
docs/features/compliance-assistant.md:157:- **`contentType="Feature"` 예외** (`features/asset-ingestion.md` AI3-10·AI4-10 cascade): `featureContentType="feature:asset-ingestion"` 인 raw asset check 호출 시 — pageTypeId·articleType 미지정 허용. feature-scoped + global rules만 적용 (pageType-specific rules 적용 안 함). inferredRiskLevel은 finding severity 기반 보수적 산정 (content-gate/fail 1+ 시 Medium·High)
docs/features/compliance-assistant.md:220:   - `requiredApproverRoles`: ArticleType별 override (`effect-result-related` → `["medical"]`, `review-case` → `["medical", "legal"]`, `event-price` → `["legal"]`, 기타 High → `["medical"]`)
docs/features/compliance-assistant.md:231:### 4.6 Finding 메타 확장 (CONTENT_STANDARDS § 7.2 cascade)
docs/features/compliance-assistant.md:233:CONTENT_STANDARDS § 7.2의 Finding 타입에 본 Feature 운영을 위한 메타 필드 cascade 추가:
docs/features/compliance-assistant.md:243:> CONTENT_STANDARDS § 7.2의 Finding 타입에 `triggeredBy`·`llmAssistMeta` 필드 신설 cascade.
docs/features/compliance-assistant.md:368:- LLM 호출 결과 원본 — `ComplianceRecord.autoCheckResult.llmAssist`(DATA_MODEL C-10 cascade — autoCheckResult 객체 내 신규 영역. CA-08)
docs/features/compliance-assistant.md:425:## 8. 캐시·idempotency·재실행
docs/features/compliance-assistant.md:432:  contentType,                          // CONTENT_STANDARDS § 7.1
docs/features/compliance-assistant.md:439:  ruleFileHashes,                       // 각 룰 파일의 개별 hash (cascade 추적용)
docs/features/compliance-assistant.md:454:| **영속 결과 캐시** (durable result cache) | 동일 cacheKey → 영구 동일 결과. idempotency 보장. cacheKey 변경 시 자연 무효화 | 무기한 (cacheKey가 입력 모두 포함하므로 자동 무효화) |
docs/features/compliance-assistant.md:460:### 8.3 idempotency 보장
docs/features/compliance-assistant.md:471:본 Feature는 룰 카탈로그 변경 이벤트를 수신하면 `staleScope.kind`별로 영향 published record의 `staleFlags.legal=true`를 갱신만 한다:
docs/features/compliance-assistant.md:472:- `kind="all"` — 전체 published record `staleFlags.legal=true`
docs/features/compliance-assistant.md:474:- `kind="content-type"` — `staleScope.contentTypes[]` 매칭 record만
docs/features/compliance-assistant.md:550:2. **예외 승인 트랙**: 클라이언트가 비활성 요청 시 — Glitzy 슈퍼 어드민 승인 + 책임 면제 합의서 첨부 후 인스턴스에 `complianceAssistantExemptApproval` 객체 설정 (DATA_MODEL C-08 v0.12 cascade 완료). 본 객체가 있을 때만 비활성 허용. 필드: `approvedBy`·`approvedAt`·`exemptionAgreementUrl`·`reason`
docs/features/compliance-assistant.md:556:     - `legal` — `contentType === "LegalDocument"` 시 자동 (C-10·C-16 required)
docs/features/compliance-assistant.md:557:     - `legal` — `priorReviewRequired === true` 시 자동 (legal 검수자의 매체 판정 단계)
docs/features/compliance-assistant.md:559:     - `review-case`·전후사진 노출 콘텐츠 → `["medical", "legal"]` (수동)
docs/features/compliance-assistant.md:560:     - `event-price` → `["legal"]` (수동)
docs/features/compliance-assistant.md:596:| ~~CA-02~~ | DATA_MODEL C-08 features[] config cascade | v0.2 — DATA_MODEL C-08 v0.10 cascade로 `features[].config` 필드 추가 |
docs/features/compliance-assistant.md:598:| ~~CA-08~~ | ComplianceRecord.autoCheckResult.llmAssist 영역 | v0.3 — DATA_MODEL C-10 v0.11 cascade로 `autoCheckResult.llmAssist.invocations[]` 구조 명시 (promptVersion·modelId·requestId·requestedAt·response·costTokens) |
docs/features/compliance-assistant.md:599:| ~~CA-10~~ | complianceAssistantExemptApproval 플래그 | v0.4 — DATA_MODEL C-08 v0.12 cascade로 `complianceAssistantExemptApproval` 필드 신설 (approvedBy·approvedAt·exemptionAgreementUrl·reason) |
docs/features/compliance-assistant.md:607:| 2026-05-14 | v0.1 | 최초 작성 — Feature 메타·Core 의존성·InstanceManifest 통합, 입력/출력(CONTENT_STANDARDS § 7 인터페이스 적용), 빌드 파이프라인 9단계 + 빌드 모드/어드민 모드 분리, composite 룰·contextExceptions 평가, LLM 보조 인터페이스·프롬프트·출력 형식·human-in-loop, RiskInference·inlineRiskFlags 통합, 룰 카탈로그 로드(RISK_LEVELS § 3.4 정합), 캐시·idempotency·재실행, 운영 지표 6종·SLO, 설치·설정, 빌드 검증 룰 |
docs/features/compliance-assistant.md:608:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5개 지적 전건 수용)**: (1) § 3.1·§ 3.3 inferredRiskLevel을 CONTENT_STANDARDS § 7.1 SoT 정합으로 — 외부 채워 전달은 신뢰 사용, 미지정 시 내부 자동. (2) **RISK_LEVELS § 2.3.1 cascade** — RiskInferenceResult.steps[] 표준화. triggeredBy 판정 근거를 SoT에 정식 정의, (3) § 3.3 내부 동작 순서에서 inlineRiskFlags 추출을 flag별 산출 방식 분리로 정정 (잔재 해소), (4) § 10.3 비활성 모드 finalRoles에 LegalDocument legal·priorReviewRequired legal 기본 게이트 자동 보존 명시 (REVIEW_WORKFLOW § 4.1 정합), (5) cacheKey에 `strictMode` 포함 — automatedDecision 산출에 영향 |
docs/features/compliance-assistant.md:609:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (7개 지적 전건 수용)**: (1) § 3.3 입력 보강 계약 — pageTypeId 미지정 시 contentType+pageMeta 유도, 유도 불가 시 fail. articleType은 contentType=Article 시 필수, (2) § 4.1 7단계 High 가상 finding `triggeredBy` 판정 — RiskInferenceResult.steps 기반. explicit 우선, (3) § 4.1 5단계 inlineRiskFlags 추출 정밀화 — flag별 산출 방식 분리. includes-effect-claim만 category 기반, 나머지 4종은 정규식·ReviewPolicy·미디어 입력, (4) § 5.4.1 LLM ruleId seq를 canonical sort 후 순번으로 — LLM 출력 순서 불변, (5) § 8.1 cacheKey에 `reviewPolicyHash`·`mediaAttachmentsHash` 추가, (6) § 10.3 "DATA_MODEL cascade 후속" 잔재 문구 정정 — v0.12 완료 명시, (7) § 10.3 비활성 모드 finalRoles 산정 정의 — 운영자 수동 결정·audit 기록 |
docs/features/compliance-assistant.md:610:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (7개 지적 전건 수용)**: (1) § 3.1 inferredRiskLevel 입력 주석을 "호환 입력 — 내부 재계산" 정합, (2) § 7.1 meta.yaml 우선 로드 정정 (§ 4.1과 일치), (3) § 4.1 High 가상 finding 단독 구현 정보 완전화 — ruleId·severity·requiredApproverRoles override 명시, (4) § 5.4.1 LLM ruleId 충돌 회피 — seq 순번 추가, (5) § 6.2 inlineRiskFlags enum 5종 vs extract category 7종 분리 표현, (6) § 8.1 cacheKey — inferredRiskLevel 제거, slotMatches 포함, (7) **DATA_MODEL C-08 v0.12 cascade** — `complianceAssistantExemptApproval` 필드 신설 (CA-10 해소) |
docs/features/compliance-assistant.md:611:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 3.3 check() 순서 설명을 § 4.1 실제 실행 순서와 일치시킴 (룰 매칭 → inlineRiskFlags → RiskInference), (2) inferredRiskLevel 외부 입력 처리 명확화 — check() 내부 항상 재계산. 외부 입력 신뢰 사용 안 함, (3) § 4.1 meta.yaml 우선 로드 — loadOrder가 로드 계획 기준임을 명시, (4) activeFeatures/id 잔재 정정 — `features[name=]` 통일, (5) § 5.4.1 LLM synthetic ruleId를 결정적 ID(SHA-256 hash)로 — finding 참조 안정성 보장, (6) **DATA_MODEL C-10 v0.11 cascade** — `autoCheckResult.llmAssist.invocations[]` 구조 명시 (CA-08 해소), (7)·(8) § 8.4 룰 카탈로그 변경 처리 — 본 Feature는 staleFlags만 갱신, 재호출은 어드민 재검수 큐 트리거 (REVIEW_WORKFLOW 정합), (9) § 10.3 비활성화를 예외 승인 인스턴스 한정으로 정정 — `complianceAssistantExemptApproval` 플래그 (CA-10), (10) § 11 룰 카탈로그 부재 fail 분기 명시 — enabled=true일 때만 |
docs/features/compliance-assistant.md:612:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (18개 지적 전건 수용)**: (1) **DATA_MODEL C-08 features[] 필드명 정합 + `config` cascade**(v0.10) — activeFeatures[] → features[]. CA-02 해소, (2) Feature 메타 specVersion 0.1 명시 (문서 상태와 분리), (3) LLM 의존성 — anthropic 권장 default + provider 옵션 명시, (4) § 3.3 단일 엔트리포인트 `check()` 명시 — RiskInference는 내부 자동, (5)·(7) § 4.1 실행 순서 재정렬 — RiskRule 매칭 후 inlineRiskFlags 추출. Finding[]은 모든 매칭 보존(우선순위는 집계만 흡수), (6) 룰 카탈로그 로드 파일 6개로 통일, (8) § 4.6 Finding 메타 확장 — `triggeredBy`·`llmAssistMeta` cascade (CONTENT_STANDARDS § 7.2 v1.3), (9) § 4.3 KSS v3+ 채택 명시 + UTF-16 offset (CA-03 해소), (10) § 4.4 contextExceptions 평가 알고리즘 강화 — patternType별 평가 + 같은 문장 내 적용, (11) § 5.4.1 LLM additionalFindings 채움 규약 — synthetic ruleId·offset 산정 실패 처리, (12) § 5.5 LLM 결과 저장 슬롯 — `ComplianceRecord.autoCheckResult.llmAssist`(CA-08 신설) + 검수자 수락 시 findings[]에 누적, (13)·(14) § 8.1·§ 8.2 cacheKey 완전화 + 영속 결과 캐시 vs 운영 TTL 캐시 2종 분리, (15) § 8.4 룰 카탈로그 변경 시 staleScope.kind별 분기 처리 + finding ruleId 역색인, (16) § 9.1 운영 지표 precision/recall 보조 지표로 명확화 (CA-09 ground truth 미결정), (17) § 11 빌드 검증 룰에서 운영 지표 항목 제거 — § 9 알림 영역으로 분리, (18) § 10.3 비활성화 시 REVIEW_WORKFLOW publishable 영향 + § 10.3.1 강제 활성 정책 명시 |
docs/admin/REVIEW_WORKFLOW.md:26:- **권한 5종**: `super-admin`·`operator`·`physician-reviewer`·`legal-reviewer`·`client-approver` — 역할별 검수 액션 한정
docs/admin/REVIEW_WORKFLOW.md:38:| ApproverRole·권한 enum 변경 | **MAJOR** | RISK_LEVELS § 4.5 cascade |
docs/admin/REVIEW_WORKFLOW.md:66:  | "in-review"       // 검수자(operator·medical·legal·client)가 검수 진행
docs/admin/REVIEW_WORKFLOW.md:138:| `approved → publishable` | § 7.1 publishable 6조건 모두 충족 — (1) automatedDecision !== "block", (2) finalRoles 슬롯 모두 기록, (3) priorReview 결과 정합, (4) staleFlags clear, (5) LegalDocument 시 legalCounsel·legalCounselAt 둘 다, (6) warning 강제 처리 정책 충족 (운영 정책 시) | (자동) |
docs/admin/REVIEW_WORKFLOW.md:164:- operator가 warning finding 각각을 **acknowledged**(인정) 또는 **resolved**(정정 후 재검수) 액션 — DATA_MODEL C-10의 `warningAcknowledgements[]` 필드(v0.8 cascade)로 기록 (findingId + action + operatorId + timestamp + note)
docs/admin/REVIEW_WORKFLOW.md:218:           ∪ (priorReviewRequired === true ? legal : ∅)                 // 사전심의 대상 시 legal 자동 추가 (사전심의 판정 자체가 legal 검수자의 책임이므로 finalRoles에 포함)
docs/admin/REVIEW_WORKFLOW.md:219:           ∪ (contentType === "LegalDocument" ? legal : ∅)              // LegalDocument 발행 시 legal 자동 추가 (C-10 required)
docs/admin/REVIEW_WORKFLOW.md:237:| **legal** (legalCounsel) | 의료법 제56조·제57조 적용 판단·치료경험담·전후사진·외국인환자 광고 (RISK_LEVELS § 4.2) |
docs/admin/REVIEW_WORKFLOW.md:254:- 동일 역할이 이미 approve된 콘텐츠에 재approve 시도 → no-op (idempotent)
docs/admin/REVIEW_WORKFLOW.md:269:| `legal` | `legalCounsel` (법무 ID 또는 외부 법무법인 식별자), `legalCounselAt`, `attachments[]` (법무 의견서 — 권장) |
docs/admin/REVIEW_WORKFLOW.md:272:### 5.2 ComplianceRecord 생명주기 — `recordPhase` 2단계 (DATA_MODEL C-10 v0.8 cascade 정합)
docs/admin/REVIEW_WORKFLOW.md:274:DATA_MODEL C-10에 `recordPhase: "pre-publish" | "published"` 필드를 cascade 추가하여 단일 ComplianceRecord 타입으로 두 단계 처리. PreComplianceRecord 별도 신설 없음.
docs/admin/REVIEW_WORKFLOW.md:299:- 발행된 (`recordPhase="published"`) record의 모든 필드 수정 불가 — **단 `staleFlags` 영역은 예외** (mutable, DATA_MODEL C-10 v0.8 cascade 명시)
docs/admin/REVIEW_WORKFLOW.md:313:| 의료법 개정 (`medical-law-tracking.yaml` revision 추가) | `legal=true` |
docs/admin/REVIEW_WORKFLOW.md:318:| 가격 정보 변경 (PricingPage·CTA 채널) | `legal=true` |
docs/admin/REVIEW_WORKFLOW.md:319:| ReviewPolicy 변경 | `legal=true` |
docs/admin/REVIEW_WORKFLOW.md:320:| 전후사진 미디어 첨부·교체 | `legal=true` |
docs/admin/REVIEW_WORKFLOW.md:342:legal > medical > client > operator
docs/admin/REVIEW_WORKFLOW.md:359:                  (each role: 매핑 필드 (peerReviewer/physicianApprover/legalCounsel/clientApprover)
docs/admin/REVIEW_WORKFLOW.md:360:                              + 매핑 timestamp 필드 (peerReviewedAt/physicianApprovedAt/legalCounselAt/clientApprovedAt) 둘 다 기록)
docs/admin/REVIEW_WORKFLOW.md:363:           ∧ (5) contentType === "LegalDocument"이면 legalCounsel ∧ legalCounselAt 둘 다 기록 (C-10·C-16 required)
docs/admin/REVIEW_WORKFLOW.md:394:**진입 경로**: 본 판정은 finalRoles의 legal 포함 여부와 **무관하게 모든 콘텐츠**에 적용. 다음 시점에서 자동 판정 단계 트리거:
docs/admin/REVIEW_WORKFLOW.md:396:1. compliance-assistant 자동 검수 직후 — 콘텐츠가 § 3 의료법 카탈로그 카테고리 매칭 시 자동으로 "priorReview 후보" 플래그 설정 → legal 검수자에게 알림
docs/admin/REVIEW_WORKFLOW.md:397:2. legal 검수자가 매체 판정 단계 수행 — finalRoles에 legal이 자동으로 임시 추가 (판정 책임 한정)
docs/admin/REVIEW_WORKFLOW.md:398:3. 판정 결과 `priorReviewRequired=true` 시 — legal이 finalRoles에 정식 포함 + § 8.2 사전심의 절차 진행 + **법무 판정 기록 필수** (`legalCounsel` + `legalCounselAt` + 판정 근거 attachments[])
docs/admin/REVIEW_WORKFLOW.md:399:4. 판정 결과 `priorReviewRequired=false` 시 — finalRoles에 legal 정식 포함되지 않음. 단 **판정 자체가 법무 행위**이므로 ComplianceRecord에 동일하게 `legalCounsel` + `legalCounselAt` + 판정 근거(법무 의견서) attachments[] 기록 필수 (MEDICAL_AD § 4.2 자사 사이트 사전심의 판정 감사 추적 요구사항 정합)
docs/admin/REVIEW_WORKFLOW.md:403:- 자사 사이트 일평균 이용자 측정 결과 (운영자 책임, MA-02 — 클라이언트 의료기관 책임). **operational rolling 측정 데이터는 `mediaThresholdOperationalInput` 슬롯 참조**(DATA_MODEL C-10 v0.15)·**법적 calendar 산정 확정값은 legal 검수자가 `mediaThresholdAssessment` 슬롯에 기록**(`calendarPolicy="previous-3-months-calendar"`). `features/analytics-reporting.md` § 8.2가 두 산정 모두의 데이터 source 제공
docs/admin/REVIEW_WORKFLOW.md:408:- `ComplianceRecord.legalCounsel`·`ComplianceRecord.legalCounselAt` (top-level 필드 — AR5-07)
docs/admin/REVIEW_WORKFLOW.md:409:- `mediaThresholdAssessment` 슬롯 (calendar 확정 판정만, `legalBasisNote` + 첨부 attachments[])
docs/admin/REVIEW_WORKFLOW.md:412:#### 8.1.1 일평균 이용자 임계 전이 시 legal 판정 큐 자동 트리거
docs/admin/REVIEW_WORKFLOW.md:414:`features/analytics-reporting.md`는 **명시 command API** `enqueueMediaThresholdReassessment(input)`를 호출하여 본 워크플로에 재평가를 요청한다. `notifications.notify()`는 결과 알림용으로만 사용 (워크플로 트리거 책임 분리 — `features/analytics-reporting.md` AR2-10 정정).
docs/admin/REVIEW_WORKFLOW.md:419:  transitionEventId: string;             // analytics-reporting의 결정적 sourceEventId — idempotency
docs/admin/REVIEW_WORKFLOW.md:429:3. 매체 분류 결과 변경 가능성 있는 콘텐츠는 `staleFlags.legal=true` 갱신 (§ 5.4 stale 흐름)
docs/admin/REVIEW_WORKFLOW.md:430:4. 어드민 "사전심의 재평가 큐"(§ 3.1.1과 별개) 생성 — legal 검수자가 priorReviewRequired 재판정
docs/admin/REVIEW_WORKFLOW.md:432:   - `mediaThresholdOperationalInput`(C-10 v0.15 cascade — 별도 audit 슬롯): analytics-reporting이 제공한 rolling-90 snapshot 그대로 저장. legal 판정 입력 자료
docs/admin/REVIEW_WORKFLOW.md:433:   - `mediaThresholdAssessment`(C-10 SoT 슬롯): **legal 검수자가 calendar 산정 후 채움**. rolling snapshot은 본 슬롯에 넣지 않음 (calendarPolicy 혼선 방지)
docs/admin/REVIEW_WORKFLOW.md:434:6. 판정 결과는 legal 검수자가 새 record에 `mediaThresholdAssessment.calendarPolicy="previous-3-months-calendar"`·`legalCounsel`·`legalCounselAt`·`legalBasisNote`·attachments 채움 후 publishable 흐름 진입
docs/admin/REVIEW_WORKFLOW.md:440:- 법정 산정(`calendarPolicy="previous-3-months-calendar"`)만 priorReviewRequired 판정 입력. legal 검수자가 record에 확정 기록
docs/admin/REVIEW_WORKFLOW.md:445:1. legal 검수자 priorReviewRequired=true 기록
docs/admin/REVIEW_WORKFLOW.md:478:  // `features/analytics-reporting.md` 1차 cycle cascade (F-2)
docs/admin/REVIEW_WORKFLOW.md:482:  // `features/search-visibility.md` 1차 cycle cascade (F-1)
docs/admin/REVIEW_WORKFLOW.md:488:  // `features/keyword-monitoring.md` 1차 cycle cascade (F-1)
docs/admin/REVIEW_WORKFLOW.md:497:  // `features/asset-ingestion.md` 1차 cycle cascade (F-2)
docs/admin/REVIEW_WORKFLOW.md:501:  | "asset-ingestion-pii-detected"            // PII 감지 (의료 도메인 critical)
docs/admin/REVIEW_WORKFLOW.md:503:  // `features/crm-sync.md` 1차 cycle cascade (CS1-01)
docs/admin/REVIEW_WORKFLOW.md:520:| `prior-review-result` | 사전심의 결과 도착 | 운영자 + legal 검수자 | email + inApp | inApp | — | **critical** | bypass | mandatory |
docs/admin/REVIEW_WORKFLOW.md:527:| `media-threshold-reached` | 일평균 이용자 10만 임계 도달 | operator + legal 검수자 + client-approver | email + inApp | inApp | — | **critical** | bypass | mandatory |
docs/admin/REVIEW_WORKFLOW.md:528:| `media-threshold-released` | 임계 해제 | operator + legal 검수자 + client-approver | email + inApp | inApp | — | high | respect | mandatory |
docs/admin/REVIEW_WORKFLOW.md:545:| `asset-ingestion-pii-detected` | PII 감지 | operator + legal 검수자 | email + inApp | inApp | — | **critical** | bypass | mandatory |
docs/admin/REVIEW_WORKFLOW.md:554:- **criticality**: `critical` 이벤트는 사용자 quietHours·opt-out·인스턴스 운영시간(LocationProfile.businessHours)을 우회. 단, **inactive 사용자·인스턴스 채널 비활성·idempotency·dedupe는 우회하지 않음** (`features/notifications.md` § 4.1·§ 8.3 필터 순서). `high`는 사용자 quietHours 보류, `normal`은 전체 정책 적용
docs/admin/REVIEW_WORKFLOW.md:562:- **NotificationEvent** — 워크플로 트리거(`features/notifications.md` notify() 입력)에서 발생한 envelope. 1 event → N recipients
docs/admin/REVIEW_WORKFLOW.md:567:  eventId: string;                                     // UUID — 본 envelope 고유 ID (notify() 생성 또는 호출자 제공)
docs/admin/REVIEW_WORKFLOW.md:568:  sourceEventId: string;                               // 워크플로 transition id 또는 호출자 idempotency key (필수 — § 9.2.1 idempotency 계약)
docs/admin/REVIEW_WORKFLOW.md:591:  ctaUrl: string;                                      // 어드민 검수 화면 URL (notify()가 채움)
docs/admin/REVIEW_WORKFLOW.md:598:#### 9.2.1 idempotency 계약
docs/admin/REVIEW_WORKFLOW.md:601:- `features/notifications.md` notify()는 동일 `sourceEventId` 재호출 시 기존 DeliveryResult 반환 (재발송 없음, 단 외부 강제 재시도 액션은 § 8 별도 흐름)
docs/admin/REVIEW_WORKFLOW.md:635:  action: AuditAction;          // § 10.2.1 enum
docs/admin/REVIEW_WORKFLOW.md:639:  metadata: object;             // 액션별 컨텍스트 (예: rejectReason·legalCounselNote·notificationEventId)
docs/admin/REVIEW_WORKFLOW.md:643:#### 10.2.1 AuditAction enum
docs/admin/REVIEW_WORKFLOW.md:646:type AuditAction =
docs/admin/REVIEW_WORKFLOW.md:656:  | "search-visibility-retroactive-enqueue-requested"   // 운영자가 search-visibility retroactive outbox enqueue 명시 액션 (`features/search-visibility.md` § 7.5)
docs/admin/REVIEW_WORKFLOW.md:657:  // `features/keyword-monitoring.md` 1차 cycle cascade (F-15)
docs/admin/REVIEW_WORKFLOW.md:661:  | "keyword-monitoring-retroactive-enqueue-requested"   // 운영자 retroactive outbox enqueue 명시 액션
docs/admin/REVIEW_WORKFLOW.md:662:  | "keyword-tracking-target-migrated-v02-v03"           // v0.2→v0.3 데이터 모델 migration (`features/keyword-monitoring.md` § 10.3)
docs/admin/REVIEW_WORKFLOW.md:663:  // `features/asset-ingestion.md` 1차 cycle cascade (F-4)
docs/admin/REVIEW_WORKFLOW.md:668:  | "asset-ingestion-pii-redacted"            // PII 자동·수동 redaction
docs/admin/REVIEW_WORKFLOW.md:669:  // `features/crm-sync.md` 1차 cycle cascade (CS1-01·16)
docs/admin/REVIEW_WORKFLOW.md:674:  // `features/crm-sync.md` 3차 cycle cascade (CS3-11)
docs/admin/REVIEW_WORKFLOW.md:699:  | "legal-reviewer"      // legal 역할 검수만
docs/admin/REVIEW_WORKFLOW.md:706:| 액션 | super-admin | operator | physician | legal | client |
docs/admin/REVIEW_WORKFLOW.md:712:| legal approve | ⚠️ (자격 충족 시) | | | ✅ | |
docs/admin/REVIEW_WORKFLOW.md:719:> ⚠️ **super-admin 자격 우회 금지**: super-admin이라도 medical/legal/client 역할의 approve 시도 시 **해당 역할 자격 검증 필수** — `RISK_LEVELS § 4.1·§ 4.2·§ 4.4`의 자격 요건:
docs/admin/REVIEW_WORKFLOW.md:721:> - legal: 사내 법무 또는 외부 법무법인 식별 (DATA_MODEL 후속 — RISK_LEVELS RL-04)
docs/admin/REVIEW_WORKFLOW.md:764:| ~~AW-10~~ | PreComplianceRecord vs C-10 publishedAt optional | v0.3 — DATA_MODEL C-10 v0.8 cascade로 `recordPhase: "pre-publish" \| "published"` 필드 신설. `publishedAt`·`publishedBy`는 recordPhase별 required 분기. 별도 PreComplianceRecord 신설 없음 |
docs/admin/REVIEW_WORKFLOW.md:765:| ~~AW-11~~ | StaleFlagsRegistry 데이터 모델 | v0.3 — DATA_MODEL C-10 staleFlags 정의 명시 cascade로 published record 내 staleFlags만 mutable. 별도 registry 신설 없음 |
docs/admin/REVIEW_WORKFLOW.md:766:| ~~AW-07~~ | InstanceManifest.notificationChannels 필드 | v1.0 — DATA_MODEL C-08 v0.9 cascade로 `notificationChannels` 필드 신설 (email·slack.webhookUrl·inApp) |
docs/admin/REVIEW_WORKFLOW.md:773:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) § 2.1·§ 4.1 `automatedDecision pass` 잔재 정정 — `!== "block"`로 통일, (2) **DATA_MODEL C-10 v0.8 cascade** — `warningAcknowledgements: WarningAcknowledgement[]` 필드 + 하위 타입 신설 (findingId·action·operatorId·timestamp·note). § 3.1.1 참조 정정, (3) § 8.1 `priorReviewRequired=false` 판정도 법무 기록 의무 명시 — `legalCounsel`·`legalCounselAt`·근거 attachments[] 모두 필수 (MEDICAL_AD § 4.2 정합), (4) **DATA_MODEL C-08 v0.9 cascade** — `notificationChannels` 필드 신설 (email·slack.webhookUrl·inApp). AW-07 해소 |
docs/admin/REVIEW_WORKFLOW.md:774:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (7개 지적 전건 수용)**: (1) § 2.3 `approved → publishable` 전이 조건을 § 7.1 6조건 모두 명시로 정정 — 표만 보고 publishable 과소 판정 회피, (2) warning 큐 진입 조건에서 "content-gate 미발생" 잔재 제거 — § 3.1.2 동시 진입과 정합, (3) § 3.3 SLA 표 분리 — blocked는 큐 아닌 정정 흐름. content-gate P0 일원화, (4) § 0 publishable "automatedDecision pass" → `!== "block"`로 통일 — gate/warn 콘텐츠도 사람 검수·정책 처리로 publishable 가능, (5) § 2.3 `blocked → review-queued` 전이 추가 — 사후 fail 작성자 정정 후 직접 재제출, 의료법 개정 트리거 자동 큐 진입 경로, (6) § 8.1 priorReviewRequired 판정 진입 경로 명시 — 모든 콘텐츠 대상 자동 후보 플래그 + legal 검수자 임시 추가로 매체 판정 → true 시 정식 finalRoles 포함·false 시 제거, (7) § 6.2 stale 해제 평가 기준 명확화 — active(현재 사이클) pre-publish record staleFlags 기준. 이전 published record는 audit 보존 |
docs/admin/REVIEW_WORKFLOW.md:775:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (6개 지적 전건 수용)**: (1) § 0 요약 multi-role AND 게이트(approved 전이) vs publishable 6조건 분리 명시. finalRoles 슬롯 완료만으로 publishable 우회 해석 회피, (2) § 5.2·§ 5.3 ComplianceRecord 생명주기 표현 단일화 — publish 시 동일 record의 `recordPhase`만 전환 (record ID 보존). 복사 없음, (3) **DATA_MODEL C-10 v0.8 cascade — `recordVersion: integer` 필드 신설**. 재검수 시 새 record(ID·version 증가) 생성. § 5.4 record version 모델 명시, (4) § 6.2 StaleFlagsRegistry 잔존 정정 — 기존 published record staleFlags 갱신 + 새 pre-publish record 생성으로 재검수 진행. publishable 산정은 새 record staleFlags 기준, (5) § 2.3 blocked > stale 우선순위 명시 — published → blocked 사후 fail 시 즉시 unpublish 우선 (의료광고 fail 사용자 노출 위험 회피). fail·stale 동시 발생 시 blocked 항상 우선, (6) § 3.1.2 content-gate + warning 동시 발생 처리 — 두 큐 독립 진입·publishable에서 양쪽 평가, (7) **RISK_LEVELS § 4.1 cascade** — `licenseNumber` → `credentials[]`로 정정 (DATA_MODEL 정합) |
docs/admin/REVIEW_WORKFLOW.md:776:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (6개 지적 전건 수용)**: (1) § 0·§ 3.1 content-gate 큐와 fail finding 분리 명확화 — fail은 `blocked` 정정 흐름, 큐 진입 아님, (2) § 4.1 AND 게이트 알고리즘 정정 — approved는 사람 검수 슬롯만 평가, priorReview·staleFlags 등은 publishable 조건으로 분리. 단계 분리 보장, (3) **DATA_MODEL C-10 v0.8 cascade** — `recordPhase: "pre-publish" \| "published"` 필드 신설. `publishedAt`·`publishedBy` recordPhase별 required 분기. 본 문서 § 5.2 PreComplianceRecord 별도 신설 제거 (AW-10 해소), (4) **DATA_MODEL C-10 staleFlags cascade** — published 후에도 갱신 허용 영역으로 명시. 별도 StaleFlagsRegistry 신설 제거 (AW-11 해소). § 5.4 record 불변성 + staleFlags 예외 명시, (5) § 11.2 super-admin 자격 검증 알고리즘 — DoctorProfile `credentials[]` 사용 명시 (licenseNumber 직접 필드 부재). RL-03·RL-04·RL-05 후속 영역 명시. v1.0에서는 수동 검증·기록, (6) § 3.1 검수 큐 표 구조 정리 — stale 행을 표 안으로 이동 |
docs/admin/REVIEW_WORKFLOW.md:777:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1)·(2) § 2.3 상태 전이 완전화 — `blocked → draft`·`rejected → draft`/`review-queued` 분리·`request-changes` 전이·`published → blocked` 사후 fail·`published → stale` 우선순위 추가, (3) § 3.1.1 warning 큐 이탈 조건·기록 슬롯 신설 (acknowledged·resolved). § 7.1 (6) publishable 조건 추가, (4) § 4.1 AND 게이트 평가 알고리즘 정밀화 — priorReview·LegalDocument legal 자동 추가 + approved vs publishable 시점 분리 명시, (5) § 4.1 riskLevel 출처 명시 — `ComplianceRecord.pageRiskLevel` (RiskInference MAX 결합 결과), (6) § 7.1 LegalDocument 조건 — `legalCounsel` + `legalCounselAt` 둘 다 필수. 각 역할 매핑 timestamp 필드도 모두 명시, (7) § 5.2 ComplianceRecord 생명주기 2단계 분리 — pre-publish(mutable) vs published(immutable). C-10 required 필드 충돌 해소(AW-10), (8) § 5.4 staleFlags를 별도 `StaleFlagsRegistry` 컬렉션으로 분리 — published record 불변성 보장(AW-11), (9) § 6.2 stale 처리 흐름 명확화 — published 표면 유지·재발행 명시 액션 필요·이전 record audit log 보존, (10) § 4.1·§ 8 사전심의와 publishable 결합 명시 — `priorReviewRequired=true` 시 finalRoles에 legal 자동 추가, (11) § 3.1·§ 9.1 content-gate 큐 처리자·알림 수신자를 `finalRoles[]` 기준으로 정정 — operator·등급 기본 medical 포함, (12) § 11.2 super-admin 자격 우회 금지 — medical/legal/client approve 시 RISK_LEVELS § 4 자격 검증 필수 |
docs/features/asset-ingestion.md:7:> **목적**: 클라이언트 기존 자료(웹사이트·SNS·업로드·CSV)를 수집·파싱·태깅·PII 처리·검수·promote(Core 데이터 계약 변환). 의료기관 신규 인스턴스 onboarding의 첫 단계.
docs/features/asset-ingestion.md:8:> **연관 문서**: compliance-assistant § 3.3 check(), notifications notify() + REVIEW_WORKFLOW § 9.1·§ 10.2.1 (cascade 완료), DATA_MODEL C-08 v0.18 + AssetIngestionApprovedScope, CONTENT_STANDARDS § 7, MEDICAL_AD_COMPLIANCE_COMMON § 3·§ 4
docs/features/asset-ingestion.md:15:- **핵심 책임**: 외부 source 자료 수집 → 파싱 → PII 감지/redaction → 자동 태깅 → 검수 큐 → Core 데이터 계약 변환(promote)
docs/features/asset-ingestion.md:16:- **vs content-migration 경계** (F-16): 본 Feature는 **외부 raw 자료 수집 · 파싱 · 태깅 · 검수 큐까지**. content-migration은 **대량 이관 계획 · URL 리다이렉트 · slug 보존 · 검수 이력 승계**. **promote는 본 Feature 책임** (Core 데이터 계약 row 생성). 두 Feature 보완 관계 (ARCHITECTURE § 11.1 cascade 검토 필요 — AI-14 신규)
docs/features/asset-ingestion.md:20:- **신호 흐름**: ingest → parse → pii-detect → tag(rule-based + compliance-assistant check + LLM 옵션) → review → rights/legal usage check → promote (Core 계약 변환)
docs/features/asset-ingestion.md:27:### 1.1 변경 정책 (F-22 cascade 컬럼 구체화)
docs/features/asset-ingestion.md:29:| 변경 유형 | 패키지 SemVer | policyVersion | 동반 cascade |
docs/features/asset-ingestion.md:32:| source type 추가 | MINOR | 별개 | DATA_MODEL C-08 AssetIngestionConfig 필드 추가 + adapter contract + legal gate + build validation 동시 |
docs/features/asset-ingestion.md:33:| source type 제거 | **MAJOR** | 별개 | 기존 IngestionSource row migration |
docs/features/asset-ingestion.md:36:| build/runtime/migration fail 룰 추가·강화 | **MAJOR** | 별개 | |
docs/features/asset-ingestion.md:45:- 알림·audit SoT는 REVIEW_WORKFLOW § 9·§ 10.2.1 (cascade 완료)
docs/features/asset-ingestion.md:48:- 본 문서 = 수집·파싱·PII·태깅·검수·promote SoT + 내부 데이터 구조 SoT (§ 16)
docs/features/asset-ingestion.md:61:- 기존 솔루션 내 콘텐츠 이전·대량 이관 계획·URL 리다이렉트 — content-migration (후속)
docs/features/asset-ingestion.md:82:| notifications | **notify() 필수** (본 Feature는 monitor-only 모드 없음 — AI2-09 정정). 검수 큐 진입·PII 감지 등 본 Feature의 핵심 흐름이 알림 의존. notifications 비활성 인스턴스는 본 Feature 활성 불가 |
docs/features/asset-ingestion.md:83:| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 5종 NotificationEventType cascade 완료 |
docs/features/asset-ingestion.md:84:| REVIEW_WORKFLOW § 10.2.1 | 5종 AuditAction cascade 완료 |
docs/features/asset-ingestion.md:93:- `snsApi.<platform>` 필드에 `legalApproved`·`legalApprovedBy`·`legalApprovedAt`·`approvedAccountIds[]`·`allowedContentTypes[]`·`consentEvidenceRef` 추가 — F-12 게이트
docs/features/asset-ingestion.md:108:| AuditAction | contentRef | metadata 필수 필드 | 권한 |
docs/features/asset-ingestion.md:147:- `webCrawl.enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedScope` 누락 또는 `approvedScope.allowedDomains` 빈 배열 또는 `targetDomains` ⊄ `approvedScope.allowedDomains` 또는 `approvedScope.allowCaptchaBypass === true`) → build fail (F-10·F-11)
docs/features/asset-ingestion.md:148:- crawler 실행 파라미터가 approvedScope 밖이면 `skipped-legal-out-of-scope`
docs/features/asset-ingestion.md:153:- `snsApi.<platform>.enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedAccountIds` 빈 배열 또는 `allowedContentTypes` 빈 배열) → build fail
docs/features/asset-ingestion.md:155:- 수집 대상은 `approvedAccountIds`에 명시된 계정만 — **adapter는 API 호출 파라미터 검증 + 응답 item별 `authorAccountId`·`ownerAccountId` 검증** (AI2-11): 공유글·리그램·인용·댓글·cross-post에서 실제 owner가 approved 외인 item은 `skipped-legal-out-of-scope`로 quarantine (asset 생성 안 함)
docs/features/asset-ingestion.md:173:  contentType: "Feature",                              // CONTENT_STANDARDS § 7.1.1 정합
docs/features/asset-ingestion.md:187:// AI2-12 — Feature contentType의 raw asset check 동작:
docs/features/asset-ingestion.md:191://   - 정식 RiskLevel은 promote 시점 contentType=Article 등으로 재호출 시 결정
docs/features/asset-ingestion.md:200:- 자동 분류: 추천 `contentType` (Article·TreatmentPage 등) + 신뢰도
docs/features/asset-ingestion.md:212:- **`rightsReview` 권한은 별도 legal gate** (AI4-12): § 16.9 권한 매트릭스 참조 — status 변경은 legal-reviewer·super-admin만. operator는 evidence-added만 가능
docs/features/asset-ingestion.md:221:| **rightsReview 상태** (AI2-03 명칭 통일) | source가 외부 URL·SNS·환자 후기·전후사진 감지 → `AssetReviewRecord.rightsReview.status === "approved"` 필수 | 미승인 시 promote 차단 + `requiredApproverRoles=["legal"]` 명시 |
docs/features/asset-ingestion.md:222:| **PII 처리 완료** (AI4-07 — AssetPiiFinding 기준) | **AssetPiiFinding 0건** 또는 모든 finding이 다음 중 하나: (a) `reviewStatus="false-positive"`, (b) `reviewStatus="true-positive" AND redactionApplied=true` | 미처리 시 차단 (`open` 또는 `true-positive AND redactionApplied=false`는 차단). `piiDetected` boolean은 표시용 denormalized summary만. § 13.4 reconcile invariant — `piiDetected != exists(AssetPiiFinding)` 감지 시 sink alert |
docs/features/asset-ingestion.md:237:  targetMapping: TargetMapping;                         // contentType별 closed union
docs/features/asset-ingestion.md:242:// v1.0에서 promote 미지원 → runtime fail. 해당 contentType 생성은 어드민 UI manual 처리. v1.x에서 contentType별 TargetMapping 추가 예정 (AI-17 신규)
docs/features/asset-ingestion.md:334:**runtime validation**: TargetMapping의 mapping 객체에 contentType별 SoT 필수 필드 누락 또는 unknown field → fail.
docs/features/asset-ingestion.md:336:### 8.2 promote 흐름 (AI3-01·02·03·04 — 상태 머신·lock·reconcile·outbox atomicity)
docs/features/asset-ingestion.md:359:3. **단일 DB transaction (짧음 — AI3-03 lock·재검증·AI3-04 outbox atomic + AI4-02 CAS)**:
docs/features/asset-ingestion.md:360:   a. **AssetPromotionRecord row lock + status CAS** (AI4-02): `SELECT ... FOR UPDATE WHERE id=? AND status='pending-commit'` — 다른 worker가 이미 진입했거나 status 다르면 abort(idempotent duplicate). 성공 시 `UPDATE SET commitStartedAt=now()`
docs/features/asset-ingestion.md:372:   - notifications outbox는 이미 transaction 안에 insert됨 → 별도 worker가 dispatch
docs/features/asset-ingestion.md:388:## 9. PII 처리 (F-13·F-14)
docs/features/asset-ingestion.md:390:### 9.1 PII 자동 감지·redaction
docs/features/asset-ingestion.md:407:  - 검증 실패: PII 미분류 (regex 우연 일치 false-positive) — confidence=0
docs/features/asset-ingestion.md:408:  - 검증 통과: PII 분류 confidence=1.0
docs/features/asset-ingestion.md:416:- **Raw blob** (`IngestedAsset.blobRef` — `raw/` prefix): 원본 보존. encrypted (aes-256-gcm). IAM으로 legal 검수자·super-admin만 접근
docs/features/asset-ingestion.md:417:- **ExtractedContent.rawBody**: 파싱 후 raw text. AssetPiiFinding offset의 SoT. legal 검수자·super-admin만 read
docs/features/asset-ingestion.md:425:## 10. 알림 (outbox 패턴)
docs/features/asset-ingestion.md:427:### 10.1 NotificationEventType 매트릭스 (REVIEW_WORKFLOW § 9.1.1 cascade 완료 — 5종)
docs/features/asset-ingestion.md:437:### 10.2 outbox 패턴
docs/features/asset-ingestion.md:443:| eventType | outbox sourceKind | outbox sourceId | contentRef | contentTitle | metadata |
docs/features/asset-ingestion.md:448:| `asset-ingestion-pii-detected` | `asset` | assetId | `"asset:" + assetId` | `"PII 감지 — ${assetTitle}"` | assetId·piiFindingIds[]·detectorSummary·redactionMode |
docs/features/asset-ingestion.md:452:- `asset-ingestion-pii-detected`: asset 단위 1건만 발송 (한 asset에 multiple PII finding 발생해도 sourceId=assetId로 합산). piiFindingIds[] metadata로 상세 전달
docs/features/asset-ingestion.md:453:- UNIQUE(sourceKind, sourceId, eventType) — 동일 asset에 pii-detected 이벤트 1건만 outbox row. asset에 PII가 추가 발견되면 새 outbox 생성 안 함 (기존 finding 수정/추가는 read API로 확인)
docs/features/asset-ingestion.md:470:| PII 감지 적중률 | 운영자 confirmed / 자동 감지 | > 80% (M2+ baseline) |
docs/features/asset-ingestion.md:472:| outbox 발송 성공율 | dispatched / enqueue 대상 | > 99% |
docs/features/asset-ingestion.md:475:| **PII true-positive rate** | reviewStatus="true-positive" / 전체 finding | baseline (M2+) |
docs/features/asset-ingestion.md:476:| **PII false-positive rate** | reviewStatus="false-positive" / 전체 finding | < 30% (M2+ baseline) |
docs/features/asset-ingestion.md:494:## 13. 빌드·런타임·migration 검증 (3분리 — search-visibility 패턴)
docs/features/asset-ingestion.md:501:- `webCrawl.enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedScope` 누락 또는 `approvedScope.allowedDomains` 빈 배열 또는 `targetDomains` ⊄ `approvedScope.allowedDomains` 또는 `approvedScope.allowCaptchaBypass === true`) (F-10·F-11)
docs/features/asset-ingestion.md:502:- `snsApi.<platform>.enabled=true` + 법무 게이트 누락 (legalApproved·approvedAccountIds·allowedContentTypes 등) (F-12)
docs/features/asset-ingestion.md:518:- **`promoteAsset` 게이트 미충족** (§ 7.2): 검수 미승인·rights 미승인·PII 미처리·증빙 미첨부
docs/features/asset-ingestion.md:519:- **`promoteAsset` targetMapping의 contentType별 필수 필드 누락 또는 unknown field** (F-7)
docs/features/asset-ingestion.md:521:- crawler 실행 파라미터가 approvedScope 밖 → `skipped-legal-out-of-scope`
docs/features/asset-ingestion.md:522:- SNS API 호출이 `approvedAccountIds` 밖 → `skipped-legal-out-of-scope`
docs/features/asset-ingestion.md:524:### 13.3 migration-time validation·migration 정책 (AI3-07 + AI5-04 backfill)
docs/features/asset-ingestion.md:527:- migration-time validation: `IngestedAsset.blobKeyVersion IS NULL` row 감지 시 자동 backfill 수행
docs/features/asset-ingestion.md:530:  - 양쪽 패턴 모두 미일치 → migration fail + sink alert (운영자 명시 정정 필요)
docs/features/asset-ingestion.md:533:**v0.2 → v0.3 blob key format migration**:
docs/features/asset-ingestion.md:538:  - **eager migration** (선택): 운영자 명시 액션 `migrateBlobKeysV02toV03(instanceId, dryRun)` — super-admin 전용. 모든 v0.2 blob을 v0.3 path로 copy + 기존 v0.2 삭제 (또는 별도 archive). audit log `asset-ingestion-blob-key-migrated-v02-v03` (AI-18 audit cascade 후속)
docs/features/asset-ingestion.md:539:  - v0.2 key 허용 기간: v1.x release까지. v2.0에서 v0.2 path read 제거 — manifest validator가 lazy rewrite 권고 → eager migration 강제
docs/features/asset-ingestion.md:556:- **outbox stale**: claimedAt > 5분 → 재claim (notifications 동등)
docs/features/asset-ingestion.md:573:| AI-06 | PII 감지 LLM 기반 정밀도 향상 | M2+ |
docs/features/asset-ingestion.md:581:| AI-14 | ARCHITECTURE § 11.1 content-migration 정의 cascade (F-16) | ARCHITECTURE 문서 후속 |
docs/features/asset-ingestion.md:584:| AI-17 | v1.x promote 지원 contentType 확장 (ReviewPolicy·PricingPage·LocationProfile 등) | v1.x |
docs/features/asset-ingestion.md:585:| AI-18 | `asset-ingestion-blob-key-migrated-v02-v03` audit cascade (eager migration 시) | v1.x patch (운영 시 운영자 명시 액션) |
docs/features/asset-ingestion.md:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
docs/features/asset-ingestion.md:625:- **`rawBody`** (Markdown — redaction 전 원본. AssetPiiFinding offset SoT. legal·super-admin만 read. IAM 정책으로 보호)
docs/features/asset-ingestion.md:630:  - worker는 sourceVersion 입력으로 idempotent 처리. 동일 sourceVersion 중복 enqueue는 1회만 처리. 결과는 body·bodyVersion(+1)·piiDetected·piiRedacted를 단일 transaction에서 원자 갱신
docs/features/asset-ingestion.md:646:| `detector` | enum (`regex`·`checksum`·`manual`) | ✅ — **v1.0은 llm detector 미지원** (AI2-07. v1.x에서 LLM 활성화 시 provider allowlist·promptVersion·data minimization·raw PII 외부 전송 금지 또는 명시 승인 예외·audit metadata 정의 — AI-06 cascade) |
docs/features/asset-ingestion.md:661:- promote transaction의 CAS 입력 (§ 8.2 3.a)
docs/features/asset-ingestion.md:670:  currentReviewedBy?: string,             // 마지막 reviewer (legal 검수자 자격 검증 — REVIEW_WORKFLOW § 11.2)
docs/features/asset-ingestion.md:694:**reviewer 자격 검증**: rightsReview.status 변경 시 currentReviewedBy의 AdminUser.approverRoleEligibility에 `"legal"` 포함 필수 (REVIEW_WORKFLOW § 11.2 정합). 미충족 시 403.
docs/features/asset-ingestion.md:700:| `status-changed` (approved/rejected) | legal-reviewer·super-admin | 검수 큐 detail panel |
docs/features/asset-ingestion.md:701:| `evidence-added` | operator·legal-reviewer·super-admin | 증빙 첨부 폼 (모두 가능) |
docs/features/asset-ingestion.md:702:| `evidence-superseded` | legal-reviewer·super-admin (operator 불가) | 활성 증빙 옆 "supersede" 버튼 (legal 자격만 노출) |
docs/features/asset-ingestion.md:705:UI 기본 표시: 최신 status + active(superseded=false) evidence. superseded evidence와 history는 **audit drawer**에서 legal-reviewer·super-admin에게만 노출.
docs/features/asset-ingestion.md:718:| `reviewVersionSnapshot` | integer | ✅ | promote 시점 AssetReviewRecord.reviewVersion (CAS 입력) |
docs/features/asset-ingestion.md:759:- `raw/` prefix는 legal 검수자·super-admin만 read 가능 (PII·민감 원본 보호)
docs/features/crm-sync.md:7:> **목적**: 클라이언트 의료기관 CRM과 솔루션 사이의 양방향 데이터 동기화. solution DB는 **raw PII 저장 금지**. webhook(실시간) + polling(배치).
docs/features/crm-sync.md:9:> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (7종 AuditAction)
docs/features/crm-sync.md:12:> - retry queue·outbox worker SQL → `features/search-visibility.md` § 13.5·§ 13.10
docs/features/crm-sync.md:19:- **핵심 책임**: (a) 외부 CRM 양방향 sync, (b) field-level mapping + record-level CAS 충돌 해결, (c) webhook(실시간) + polling(배치) idempotent dedupe 2층 (transport-level NonceLedger + record-level ChangeIdentityLedger), (d) solution DB raw PII 저장 금지 (closed-schema displayHints + privacy-sensitive operationalHints), (e) DPA·credential rotation·만료 알림, (f) 환자 동의 철회 tombstone
docs/features/crm-sync.md:24:- **PII 정책**: raw PII 저장 금지. operationalHints는 privacy-sensitive metadata로 분류 (CS4-05). liveRead v1.x (CS-14)
docs/features/crm-sync.md:25:- **RRN deny**: v1.0 강제. false positive 복구 + audit cascade
docs/features/crm-sync.md:34:| 변경 유형 | 패키지 SemVer | policyVersion | 동반 cascade |
docs/features/crm-sync.md:45:| build/runtime/migration fail 룰 추가·강화 | **MAJOR** | 별개 | |
docs/features/crm-sync.md:50:| displayHints column 제거·타입 변경 | **MAJOR** | policyVersion 신규 | DB migration |
docs/features/crm-sync.md:55:| DB table 추가 | MINOR | 별개 | migration + invariant 표 추가 |
docs/features/crm-sync.md:56:| DB table 제거·rename | **MAJOR** | policyVersion 신규 | migration |
docs/features/crm-sync.md:67:- retry queue·outbox worker SQL → `features/search-visibility.md` § 13.5·§ 13.10
docs/features/crm-sync.md:68:- 본 문서 = sync 파이프라인·field mapping·CAS·PII closed schema·privacy-sensitive operational hints·credential rotation·v1.0 entity canonical schema·consent withdrawal·ChangeIdentityLedger SoT
docs/features/crm-sync.md:83:- raw PII 실시간 조회 → v1.x (CS-14)
docs/features/crm-sync.md:103:| notifications | notify() 필수 |
docs/features/crm-sync.md:105:| REVIEW_WORKFLOW § 10.2.1 | 7종 AuditAction |
docs/features/crm-sync.md:109:| search-visibility § 13.5·§ 13.10 | retry queue·outbox SQL 패턴 |
docs/features/crm-sync.md:124:      legalApproved: true; legalApprovedBy: "..."; legalApprovedAt: "..."
docs/features/crm-sync.md:164:      purgeWorker: { cadenceMinutes: 60, batchSize: 500, legalHoldOverride: false }
docs/features/crm-sync.md:166:        piiHashPepperRef: "secretRef://CRM_PII_HASH_PEPPER"
docs/features/crm-sync.md:170:        idempotencyPepperRef: "secretRef://CRM_IDEMPOTENCY_PEPPER"   # CS5-02 — requestFingerprint
docs/features/crm-sync.md:178:| `piiHash` | raw PII (이름·전화·이메일·생년월일 정규화 후 concat) | HMAC-SHA256 | `HMAC(piiHashPepperRef, normalize(name) + ":" + normalize(phone) + ":" + normalize(email) + ":" + birthDate_iso)`. 결과 char(64) hex |
docs/features/crm-sync.md:183:| `requestFingerprint` (CS5-02) | applyConsentWithdrawal 요청 normalized | HMAC-SHA256 | `HMAC(idempotencyPepperRef, integrationId + ":" + keyType + ":" + canonicalKeyHash + ":" + scope + ":" + dryRun)`. char(64) hex |
docs/features/crm-sync.md:206:| read | `queryCrmRecords` | displayHints + operationalHints (privacy-sensitive masking 적용) | operator·super-admin·legal-reviewer | 허용 | 허용 |
docs/features/crm-sync.md:212:### 3.1.1 audit log contract (7종 AuditAction)
docs/features/crm-sync.md:214:| AuditAction | contentRef | metadata | 권한 |
docs/features/crm-sync.md:216:| `crm-integration-registered` | `"crm-integration:" + integrationId` | provider·apiUrl·legalApprovedBy·dpaEvidenceRefHash | super-admin |
docs/features/crm-sync.md:253:type ConversionEvent = {                                 // outbound-only entity. PII 없음
docs/features/crm-sync.md:272:#### 3.2.1 ContactDisplayHints — closed schema 6 column
docs/features/crm-sync.md:274:| 필드 | 타입 | DB CHECK (PostgreSQL) | application validator (canonical) |
docs/features/crm-sync.md:283:DB CHECK는 PostgreSQL canonical. 타 DB 이식 시 dialect 재정의.
docs/features/crm-sync.md:287:operationalHints는 raw PII 아니지만 **준식별자 결합 위험** (소규모 의료기관 환경 등):
docs/features/crm-sync.md:291:| `entityStatus` | non-sensitive | retentionDays.changeLog | operator·super-admin·legal-reviewer | 허용 |
docs/features/crm-sync.md:294:| `locationKey` | **준식별자** (소규모 분원 결합 위험) | operationalHintsRetentionDays (365) | operator·super-admin·legal-reviewer | masking (분원 코드만) |
docs/features/crm-sync.md:296:| `desiredVisitDate` | **준식별자** (날짜+분원+진료과 조합 식별 가능) | operationalHintsRetentionDays | super-admin·legal-reviewer | **export 금지** |
docs/features/crm-sync.md:297:| `guardianInvolved` | **민감** (미성년·고령 추정) | operationalHintsRetentionDays | super-admin·legal-reviewer | export 금지 |
docs/features/crm-sync.md:299:| `preferredChannelType` | non-sensitive | retentionDays.changeLog | operator·super-admin·legal-reviewer | 허용 |
docs/features/crm-sync.md:312:| threshold 변경 승인 | threshold 변경은 **legal-reviewer 승인 + policyVersion MAJOR** (CS5-05). 단순 PATCH 금지 |
docs/features/crm-sync.md:319:**nulling 정책** (CS4-06 precedence: legalHold > unregister > expiry > consent withdrawal):
docs/features/crm-sync.md:342:  idempotencyKey: string;                       // UNIQUE per instance
docs/features/crm-sync.md:378:  expectedResolution: "open";                   // CAS — 이미 resolved면 실패
docs/features/crm-sync.md:396:  expectedPriorStatus: "rejected-rrn-recoverable";  // CAS
docs/features/crm-sync.md:417:      idempotencyKey: string;                   // 중복 적용 방지
docs/features/crm-sync.md:426:      idempotencyKey: string;
docs/features/crm-sync.md:447:| webhook inbound | rawBody에서 piiHash 산정 (provider별 PII field path는 adapter config) → CrmConsentWithdrawalLedger lookup |
docs/features/crm-sync.md:460:  expectedIntegrationState: "reverted";         // CAS
docs/features/crm-sync.md:548:// CAS·FieldMapping·CrmRecord 갱신 단계에서 보는 공통 normalized
docs/features/crm-sync.md:553:  piiHash: string | null;                       // PII 없는 entity는 null
docs/features/crm-sync.md:562:webhook → polling 공통 처리는 **NormalizedInboundChange만 보는** CAS 단계로 수렴.
docs/features/crm-sync.md:584:3. PII Redaction Validator (closed displayHints + operationalHints schema 검증)
docs/features/crm-sync.md:589:8. CRM API call (idempotency-key)
docs/features/crm-sync.md:590:9. CrmRecord CAS — `WHERE id=? AND solution_version=? AND crm_version=?`
docs/features/crm-sync.md:602:4. CrmWebhookNonceLedger insert (deliveryKind별 partial unique):
docs/features/crm-sync.md:612:10. CAS 갱신
docs/features/crm-sync.md:620:5. CAS 갱신
docs/features/crm-sync.md:629:   - input.expectedPriorStatus CAS 검증 — 일치 안 함 → runtime fail
docs/features/crm-sync.md:639:   d. 통과 (false positive 확인) → 정상 inbound 처리 (NormalizedInboundChange 생성 + CAS):
docs/features/crm-sync.md:649:5. 동일 ledgerId 두 번째 호출 — ledger status가 이미 final이면 expectedPriorStatus CAS 실패
docs/features/crm-sync.md:652:### 4.3 field-level 충돌 해결 + CAS
docs/features/crm-sync.md:664:#### 4.3.2 CAS SQL
docs/features/crm-sync.md:746:-- 2. 현재 state 확인 (stable만 허용 — CAS)
docs/features/crm-sync.md:751:-- 5 rows affected 검증 (CAS)
docs/features/crm-sync.md:755:**DB partial unique 강제** (§ 13.11):
docs/features/crm-sync.md:760:→ 두 동시 rotateCredential 호출 시 partial unique 충돌로 두 번째 호출 실패. 첫 번째만 진행.
docs/features/crm-sync.md:768:§ 3.3.6 입력. CAS expectedIntegrationState="reverted". transition:
docs/features/crm-sync.md:788:-- 3. committed → grace-expired (CredentialVersion row) — DB partial unique constraint와 정합
docs/features/crm-sync.md:789:-- (`UNIQUE(integration_id) WHERE state='committed'`) 해제 + grace-expired는 partial unique 없음 (다수 허용)
docs/features/crm-sync.md:809:### 4.6 outbox SQL — search-visibility § 7.3 패턴 풀 전개
docs/features/crm-sync.md:814:  SELECT id FROM crm_sync_notification_outbox
docs/features/crm-sync.md:818:UPDATE crm_sync_notification_outbox o
docs/features/crm-sync.md:823:UPDATE crm_sync_notification_outbox SET status='sent', sent_at=now(), locked_at=null WHERE id=$id;
docs/features/crm-sync.md:826:UPDATE crm_sync_notification_outbox SET status='pending', locked_at=null, last_error=$err WHERE id=$id;
docs/features/crm-sync.md:829:UPDATE crm_sync_notification_outbox SET status='permanent' WHERE id=$id AND attempts >= 5;
docs/features/crm-sync.md:836:**precedence (CS4-06)**: `legalHold > unregister snapshot > retention purge`. legalHold=true row는 unregister·purge 모두 보존.
docs/features/crm-sync.md:838:| 대상 | 즉시 액션 | 보존 | legalHold default | FK ON DELETE |
docs/features/crm-sync.md:840:| CrmIntegration | `active=false` (soft delete) | legalHold (audit·tombstone) | true | — |
docs/features/crm-sync.md:850:| CrmConsentWithdrawalLedger | row 유지 (legal hold default) | retentionDays.consentWithdrawalLedger (legalHold=false 시) | **true** (CS4-06) | RESTRICT |
docs/features/crm-sync.md:856:`legalHold=false` 전환 command (CS4-06): `releaseLegalHold(ledgerId, reason)` — super-admin 전용. 별도 audit cascade는 v1.x (CS-21 신규).
docs/features/crm-sync.md:864:2. **requestFingerprint 산정** (CS5-02): `HMAC-SHA256(idempotencyPepperRef, integrationId + ":" + keyType + ":" + canonicalKeyHash + ":" + scope + ":" + dryRun)`. char(64) hex
docs/features/crm-sync.md:865:3. `(integrationId, idempotencyKey)` lookup:
docs/features/crm-sync.md:867:   - **존재 + requestFingerprint 불일치** → **409 idempotency-key-conflict** runtime fail + audit/sink alert + 본 요청 폐기 (CS5-02)
docs/features/crm-sync.md:870:5. CrmConsentWithdrawalLedger insert (requestFingerprint 포함) — UNIQUE(integrationId, idempotencyKey)
docs/features/crm-sync.md:904:### 6.2 outbox — § 4.6 SQL
docs/features/crm-sync.md:919:## 7. PII 처리 (CS4-05 강화)
docs/features/crm-sync.md:921:### 7.1 closed schema + privacy-sensitive operational hints
docs/features/crm-sync.md:923:- displayHints: 6 column closed schema (§ 3.2.1)
docs/features/crm-sync.md:926:- DB CHECK + application validator 양층
docs/features/crm-sync.md:944:### 7.3 raw PII 실시간 조회 — v1.x (CS-14)
docs/features/crm-sync.md:954:precedence: legalHold > unregister > expiry > consent withdrawal.
docs/features/crm-sync.md:958:- legalHold=true row는 skip
docs/features/crm-sync.md:978:| outbox 성공율 | > 99% | |
docs/features/crm-sync.md:979:| CAS lost-update 감지율 | baseline | |
docs/features/crm-sync.md:988:- legalApproved=false; korean-emr; appointment enabled; rawPiiStorageAllowed=true; ssnRrnHandling≠deny; dpaEvidenceRef 누락; outbound-only mode + 부정합 conflictResolution·FieldMapping; generic-rest-api adapter 누락·versionTokenJsonPath 누락; liveReadEnabled=true; fieldMappingPolicyVersion 누락; **providerVersionToken=null인 provider** → build fail (CS4-04)
docs/features/crm-sync.md:1024:- **두 rotateCredential 동시 호출 → 두 번째 partial unique 충돌 실패**
docs/features/crm-sync.md:1028:- resetCredentialRotation invalid expectedIntegrationState → CAS 실패
docs/features/crm-sync.md:1031:#### INV-CAS
docs/features/crm-sync.md:1036:#### INV-PII (closed schema)
docs/features/crm-sync.md:1037:- 자유 JSON insert → DB CHECK reject
docs/features/crm-sync.md:1053:- 중복 idempotencyKey → 기존 ledger 반환 (no-op)
docs/features/crm-sync.md:1060:- legalHold=true row 보존 (audit·credentialAuditLog·ConsentWithdrawalLedger)
docs/features/crm-sync.md:1061:- legalHold > unregister snapshot > retention purge
docs/features/crm-sync.md:1069:- retentionDays.consentWithdrawalLedger + legalHold=false → delete
docs/features/crm-sync.md:1070:- legalHold=true → skip
docs/features/crm-sync.md:1079:#### INV-CASCADE
docs/features/crm-sync.md:1080:- 7종 AuditAction insert 성공
docs/features/crm-sync.md:1082:- DATA_MODEL C-08 v0.20 `genericRestApiAdapter` 5필드 + `versionTokenType` cascade 동기화 build validator
docs/features/crm-sync.md:1087:§ 10 build-time / runtime / migration / invariant rule 각각이 INV fixture group에 매핑됨을 보장:
docs/features/crm-sync.md:1091:| § 10.1 legalApproved=false | INV-MANIFEST |
docs/features/crm-sync.md:1108:| § 10.2 resolveConflict expectedResolution CAS | INV-CAS |
docs/features/crm-sync.md:1110:| § 10.2 CAS WHERE 0 rows | INV-CAS |
docs/features/crm-sync.md:1111:| § 10.2 displayHints closed schema 위반 | INV-PII |
docs/features/crm-sync.md:1112:| § 10.2 recoverRrnFalsePositive expectedPriorStatus CAS | INV-RRN |
docs/features/crm-sync.md:1115:| § 10.2 resetCredentialRotation expectedIntegrationState CAS | INV-CREDENTIAL-ROTATION |
docs/features/crm-sync.md:1117:| § 10.2 CrmCredentialVersion partial unique 충돌 | INV-CREDENTIAL-ROTATION |
docs/features/crm-sync.md:1118:| § 10.3 v0.6 migration | INV-MIGRATION |
docs/features/crm-sync.md:1120:| § 10.4 ConflictRecord SLA 초과 | INV-CAS |
docs/features/crm-sync.md:1122:| § 10.4 PII drift 감지 | INV-PII |
docs/features/crm-sync.md:1137:## 10. 빌드·런타임·migration·invariant 검증
docs/features/crm-sync.md:1143:- integration `legalApproved !== true` 또는 승인자/시각 누락
docs/features/crm-sync.md:1171:- `resolveConflict` 시 conflictId 이미 resolved (`expectedResolution` CAS 실패)
docs/features/crm-sync.md:1174:- CAS WHERE 0 rows → ConflictRecord + alert
docs/features/crm-sync.md:1175:- displayHints closed schema 위반 → DB CHECK reject + validator alert
docs/features/crm-sync.md:1176:- `recoverRrnFalsePositive` 시 ledger status가 rejected-rrn-recoverable 아님 (또는 expectedPriorStatus CAS 실패)
docs/features/crm-sync.md:1177:- `applyConsentWithdrawal` idempotencyKey **same-request replay** (requestFingerprint 일치) → 기존 ledger 반환 (no-op·fail 아님)
docs/features/crm-sync.md:1178:- `applyConsentWithdrawal` idempotencyKey **mismatched collision** (requestFingerprint 불일치) → **409 idempotency-key-conflict** runtime fail + audit/sink alert (CS5-02)
docs/features/crm-sync.md:1179:- `resetCredentialRotation` expectedIntegrationState CAS 실패 → runtime fail
docs/features/crm-sync.md:1181:- CrmCredentialVersion partial unique 충돌 (동시 rotate) → runtime fail (한쪽만 진행 — CS4-02)
docs/features/crm-sync.md:1183:### 10.3 migration-time validation
docs/features/crm-sync.md:1185:- v0.5 cascade 신규:
docs/features/crm-sync.md:1187:  - CrmCredentialVersion partial unique 3종 추가 (active·rotating-target·committed 각 1개)
docs/features/crm-sync.md:1188:  - CrmConsentWithdrawalLedger CHECK + partial unique (CS4-08)
docs/features/crm-sync.md:1199:- PII drift 감지 → sink alert + 운영자 정리
docs/features/crm-sync.md:1202:- **CrmCredentialVersion invariant 위반** (active 2개 등) → runtime fail (partial unique로 사전 차단·문서적 fallback alert)
docs/features/crm-sync.md:1204:  - 우선순위: legalHold > unregister snapshot > retention purge
docs/features/crm-sync.md:1208:    | 테이블 | action | legal hold default |
docs/features/crm-sync.md:1218:    | CrmConsentWithdrawalLedger | legalHold=false 시 delete | **true** (CS4-06) |
docs/features/crm-sync.md:1249:| CS-15 | CONTENT_STANDARDS submission/event cascade — v1.0은 § 3.2 canonical |
docs/features/crm-sync.md:1253:| CS-21 | `releaseLegalHold` audit cascade (v1.x — CS4-06) |
docs/features/crm-sync.md:1272:| ~~CS-14 v1.0 cascade~~ | liveRead v1.x로 내림 |
docs/features/crm-sync.md:1277:- ContactDisplayHints는 6 column closed schema — 향후 column 추가는 § 1.1 SemVer 표 룰
docs/features/crm-sync.md:1288:| 2026-05-14 | v0.4 | codex 3차 17 지적 반영 + REVIEW_WORKFLOW·DATA_MODEL cascade |
docs/features/crm-sync.md:1292:| 2026-05-14 | **v1.0** | **codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정 — v1.0 안정판 도달**. 7 cycle 누계 지적 71건 (21+17+17+13+6+1+0) 전건 수용. blocking 0·major 0·minor 1(차단 외 — CS7-01 revoked_at column 의미는 CS-22 처리 시 검토). SoT cascade 동기화 완료: REVIEW_WORKFLOW (4종 NotificationEventType + 7종 AuditAction), DATA_MODEL v0.20 (genericRestApiAdapter 5필드 + versionTokenType). 의료법·개인정보보호법 운영 가능 |
docs/features/crm-sync.md:1312:| `legalApproved`·`legalApprovedBy`·`legalApprovedAt` | bool·string·Date | ✅ |
docs/features/crm-sync.md:1327:| `idempotencyKey` | string | ✅ |
docs/features/crm-sync.md:1339:**Constraints**: `UNIQUE(instanceId, idempotencyKey)`.
docs/features/crm-sync.md:1366:| `idempotencyKey` | string | ✅ |
docs/features/crm-sync.md:1377:**Constraints**: `UNIQUE(idempotencyKey) WHERE status IN (pending, processing)`.
docs/features/crm-sync.md:1415:UPDATE crm_sync_log SET envelope_state=CASE
docs/features/crm-sync.md:1434:-- 둘 다 sink alert + outbox 'crm-sync-batch-failed' emit
docs/features/crm-sync.md:1450:| `solutionVersion`·`crmVersion` | integer | ✅ — CAS |
docs/features/crm-sync.md:1454:| `displayHintsNameInitial` | varchar(8) | optional — CHECK |
docs/features/crm-sync.md:1455:| `displayHintsPhoneLast4` | char(4) | optional — CHECK |
docs/features/crm-sync.md:1456:| `displayHintsEmailDomain` | varchar(64) | optional — CHECK |
docs/features/crm-sync.md:1457:| `displayHintsCityName` | varchar(32) | optional — CHECK |
docs/features/crm-sync.md:1474:**CHECK**: PostgreSQL canonical 정규식 (§ 3.2.1).
docs/features/crm-sync.md:1555:### 13.11 `CrmCredentialVersion` (CS4-02 — partial unique 강제)
docs/features/crm-sync.md:1574:- `UNIQUE(integrationId) WHERE state='active'` — partial unique
docs/features/crm-sync.md:1575:- `UNIQUE(integrationId) WHERE state='rotating-target'` — partial unique
docs/features/crm-sync.md:1576:- `UNIQUE(integrationId) WHERE state='committed'` — partial unique
docs/features/crm-sync.md:1578:→ 동시 rotateCredential 시 partial unique 충돌로 두 번째 호출 자동 실패.
docs/features/crm-sync.md:1633:| `idempotencyKey` | string | ✅ |
docs/features/crm-sync.md:1643:| `legalHold` | boolean | ✅ default true (CS4-06) |
docs/features/crm-sync.md:1644:| `expiresAt` | Date | optional — legalHold=true 시 null |
docs/features/crm-sync.md:1647:- `CHECK ((key_type='piiHash' AND pii_hash IS NOT NULL AND crm_external_id_hash IS NULL) OR (key_type='crmExternalIdHash' AND crm_external_id_hash IS NOT NULL AND pii_hash IS NULL))`
docs/features/crm-sync.md:1650:- `UNIQUE(integration_id, idempotency_key)`
docs/features/crm-sync.md:1653:**Index**: `(integration_id, pii_hash) WHERE pii_hash IS NOT NULL`, `(integration_id, crm_external_id_hash) WHERE crm_external_id_hash IS NOT NULL`, `(expires_at) WHERE legal_hold=false`.
docs/features/crm-sync.md:1681:| 13.1 | CrmIntegration | partial unique active+integrationKey |
docs/features/crm-sync.md:1682:| 13.2 | CrmSyncLog | UNIQUE(instance, idempotencyKey) |
docs/features/crm-sync.md:1684:| 13.4 | CrmSyncRetryQueue | UNIQUE idempotencyKey 진행 중 |
docs/features/crm-sync.md:1685:| 13.5 | CrmRecord | CAS solution_version·crm_version + closed schema CHECK + hash UNIQUE |
docs/features/crm-sync.md:1691:| 13.11 | CrmCredentialVersion | **partial unique 3종** (active·rotating-target·committed) |
docs/features/crm-sync.md:1692:| 13.12 | CrmWebhookNonceLedger | deliveryKind별 3분기 partial unique |
docs/features/crm-sync.md:1694:| 13.14 | CrmConsentWithdrawalLedger | CHECK XOR + 3종 UNIQUE + legalHold default true |

 succeeded in 718ms:
# Feature — content-migration

> **상태**: Draft v0.1 (초안)
> **작성일**: 2026-05-15
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 11.1
> **목적**: 솔루션 **내부** 콘텐츠·데이터 마이그레이션. 스키마 버전 업그레이드 / Feature 활성화 시 backfill / 인스턴스 간 복제·이동 / 콘텐츠 일괄 변환 / policyVersion 변경 시 재평가. **외부 자료 수집은 asset-ingestion 책임**.
> **연관 SoT**:
> - 알림·audit → REVIEW_WORKFLOW § 9.1.1·§ 10.2.1 (cascade 필요 — 이벤트·AuditAction 신규)
> - 자격증명·식별자·policyVersion → DATA_MODEL C-08 (cascade 필요 — `contentMigrationConfig`·`contentMigrationPolicyVersion`)
> - 페이지·콘텐츠 schema → DATA_MODEL C-01·C-09·C-10·C-13·C-14
> - 검수 워크플로 → REVIEW_WORKFLOW § 8 (re-evaluation 시 ComplianceRecord 새 lifecycle 진입)
> - 외부 자료 수집 → asset-ingestion (별도 Feature)

---

## 0. 한 페이지 요약

- **Feature 식별자**: `content-migration`
- **핵심 책임**: (a) migration plan 정의·검증·dry-run, (b) plan 실행·진행 추적·step-level retry, (c) failure 시 rollback 또는 skip, (d) 운영 중 안전한 실행 (read-only window·partial cutover), (e) audit·legal 승인 게이트, (f) policyVersion 변경 시 ComplianceRecord 재평가
- **vs asset-ingestion**: asset-ingestion은 **외부 → 솔루션** raw sourcing + promote. 본 Feature는 **솔루션 내부**(instance ↔ instance·version ↔ version·schema ↔ schema)
- **migration plan kind 5종 (v1.0)**: `schema-version-upgrade`·`feature-activation-backfill`·`instance-to-instance-copy`·`content-bulk-transform`·`policy-version-reevaluate`
- **운영 모드 2종**: `dry-run`(영향 보고만)·`apply`(실제 변경)
- **rollback 정책**: step별 reverse-step 정의 시 가능. reverse 불가능 step은 plan 정의 시 명시 + 운영자 승인
- **DB 인벤토리**: 9 tables

---

## 1. 일반 규약

### 1.1 변경 정책

| 변경 유형 | 패키지 SemVer | policyVersion | 동반 cascade |
|---|---|---|---|
| 입력/출력 인터페이스 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9·§ 10 |
| migration plan kind 추가 | MINOR | 별개 | step type registry·build validation |
| migration plan kind 제거 | **MAJOR** | 별개 | |
| step type 추가 | MINOR | 별개 | reverse-step 정의 강제 |
| step type 제거 | **MAJOR** | 별개 | |
| 알림 매트릭스 변경 | **MAJOR** | policyVersion 신규 | |
| rollback 알고리즘 변경 | **MAJOR** | policyVersion 신규 | |
| build/runtime/migration fail 룰 추가·강화 | **MAJOR** | 별개 | |
| runtime invariant·reconcile 룰 추가·강화 | MINOR | 별개 | |
| warning·지표·acceptance test 추가 | PATCH | 별개 | |

### 1.2 SoT 원칙

- 알림·audit canonical SoT → notifications + REVIEW_WORKFLOW
- 자격증명·policyVersion → DATA_MODEL C-08
- 페이지·콘텐츠·ComplianceRecord schema → DATA_MODEL Core
- 재평가 워크플로 → REVIEW_WORKFLOW § 8 (lifecycle 진입)
- 본 문서 = migration plan·step·실행 파이프라인·rollback·dry-run·legal 게이트 SoT

### 1.2.1 retry taxonomy

| 큐 | maxAttempts | backoff |
|---|---|---|
| ContentMigrationStepRetryQueue | config(기본 3) | [60, 600, 3600]s |
| ContentMigrationNotificationOutbox | 5 | search-visibility § 7.3 패턴 |

### 1.3 본 문서가 다루지 않는 영역

- 외부 자료 수집·promote → asset-ingestion
- 알림 채널·재시도 → notifications
- 운영자 검수 큐·상태 머신 → REVIEW_WORKFLOW (재평가 시 신규 ComplianceRecord lifecycle 진입)
- 콘텐츠 schema 자체 → DATA_MODEL
- 인프라 DB migration (PostgreSQL DDL·schema change) → infra 인프라 책임. 본 Feature는 **application-level data migration**만

---

## 2. Feature 정의

### 2.1 기본 메타

```yaml
name: "content-migration"
specVersion: "0.1"
coreRequiresMin: "1.0.0"
implementationKind: "node-module"
activation: { scope: "instance", default: false }
```

### 2.2 의존성

| 영역 | 의존 |
|---|---|
| notifications | notify() 필수 |
| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | NotificationEventType 신규 (cascade 필요) |
| REVIEW_WORKFLOW § 10.2.1 | AuditAction 신규 (cascade 필요) |
| DATA_MODEL C-08 | `contentMigrationConfig`·`contentMigrationPolicyVersion` (cascade 필요) |
| DATA_MODEL Core | 페이지·콘텐츠·ComplianceRecord schema |
| compliance-assistant | `policy-version-reevaluate` plan kind 실행 시 |

### 2.3 InstanceManifest 통합

```yaml
contentMigrationConfig:
  legalApproved: true
  legalApprovedBy: "legal@glitzy.kr"
  legalApprovedAt: "2026-05-10T00:00:00Z"
  defaultMode: "dry-run"                                # dry-run | apply
  approvalRequired:
    schemaVersionUpgrade: super-admin
    featureActivationBackfill: super-admin
    instanceToInstanceCopy: super-admin + legal-reviewer
    contentBulkTransform: super-admin
    policyVersionReevaluate: super-admin

contentMigrationPolicyVersion: "cm-2026-05-15"

features:
  - name: "content-migration"
    version: "0.1.0"
    enabled: true
    requiresFeature: [notifications]
    config:
      execution:
        maxParallelSteps: 5
        stepTimeoutSeconds: 3600
        readOnlyWindowEnabled: false                    # apply 시 read-only window 강제 여부
      retry:
        maxAttempts: 3
        backoffSeconds: [60, 600, 3600]
      rollback:
        autoRollbackOnFailure: false                    # true면 step 실패 시 자동 rollback. false면 운영자 수동
        rollbackTimeoutSeconds: 7200
      dryRun:
        reportRetentionDays: 30
        impactSamplingSize: 100                         # dry-run 시 변경 영향 sample 개수
      retentionDays:
        plan: 1095                                       # plan 정의 보존
        run: 730                                         # run record 보존
        step: 730
        stepRetryQueueCompleted: 30
        notificationOutbox: 30
      externalMonitoringSink: { provider: "sentry", dsnSecretRef: "secretRef://MONITORING_DSN" }
```

---

## 3. 입력·출력

### 3.1 엔트리포인트 + read API + 운영 command

| 종류 | 함수 | 책임 | 권한 |
|---|---|---|---|
| 실행 | `definePlan(input)` | migration plan 정의·검증 | super-admin |
| 실행 | `validatePlan(planId)` | plan 정의 검증 (step 정합성·reverse-step·legal) | super-admin |
| 실행 | `runDryRun(planId)` | dry-run 실행·영향 보고 | super-admin |
| 실행 | `runApply(planId, options)` | 실제 plan 실행 | super-admin (legal 게이트 통과 시) |
| 실행 | `pauseRun(runId, reason)` | 진행 중 plan 일시 정지 | super-admin |
| 실행 | `resumeRun(runId)` | 정지된 plan 재개 | super-admin |
| 실행 | `cancelRun(runId, reason)` | 진행 중 plan 취소 | super-admin |
| 실행 | `rollbackRun(runId, scope)` | 완료·실패 plan rollback | super-admin |
| read | `queryPlans` | plan 목록·detail | operator·super-admin·legal-reviewer |
| read | `queryRuns` | run 진행·결과 | 동일 |
| read | `queryStepResults` | step 단위 결과·error | 동일 |
| 운영 | `approvePlanLegalGate(planId)` | legal 승인 게이트 | legal-reviewer |

### 3.1.1 audit log contract (cascade 필요)

| AuditAction | contentRef | metadata |
|---|---|---|
| `content-migration-plan-defined` | `"cm-plan:" + planId` | planKind·targetEntityCount·legalRequired·approvalChain |
| `content-migration-plan-legal-approved` | `"cm-plan:" + planId` | approvedBy·approvedAt·planFingerprint |
| `content-migration-run-started` | `"cm-run:" + runId` | mode·planId·estimatedDurationSeconds |
| `content-migration-run-completed` | `"cm-run:" + runId` | result·changedRecords·failedSteps·rollbackTriggered |
| `content-migration-run-cancelled` | `"cm-run:" + runId` | cancelledBy·reason·completedSteps |
| `content-migration-rollback-applied` | `"cm-run:" + runId` | scope·rolledBackSteps·result |

### 3.2 plan kind 정의 (v1.0 — 5종)

#### 3.2.1 schema-version-upgrade
DATA_MODEL 버전 업그레이드 시 backfill·column rename·default value 채움.

#### 3.2.2 feature-activation-backfill
신규 Feature 활성화 시 기존 row를 새 schema에 맞춰 변환 (예: notifications 활성화 시 기존 audit row에서 NotificationEvent 파생).

#### 3.2.3 instance-to-instance-copy
분원 신설 등 본원 콘텐츠 일괄 복제. PII 이동 시 legal-reviewer 승인 강제.

#### 3.2.4 content-bulk-transform
design token 변경·brand 변경 시 콘텐츠 일괄 재생성·재렌더링.

#### 3.2.5 policy-version-reevaluate
CONTENT_STANDARDS·RISK_LEVELS·MEDICAL_AD_COMPLIANCE_COMMON 변경 시 모든 ComplianceRecord 재평가 (compliance-assistant `check()` 재호출).

### 3.3 DTO

```ts
type MigrationPlanKind =
  | "schema-version-upgrade"
  | "feature-activation-backfill"
  | "instance-to-instance-copy"
  | "content-bulk-transform"
  | "policy-version-reevaluate";

type DefinePlanInput = {
  planKind: MigrationPlanKind;
  title: string;
  description: string;
  targetSelector: TargetSelector;                       // 어떤 row가 대상인지
  steps: MigrationStep[];                               // 순차 실행 step
  scheduledStart?: Date;
  readOnlyWindowMinutes?: number;
  idempotencyKey: string;
};

type MigrationStep = {
  stepKey: string;                                       // plan 내 unique
  stepType: string;                                      // registry 등록 타입
  inputs: Record<string, any>;
  reverseStep?: MigrationStep;                          // rollback 시 실행. 없으면 reverse 불가
  retryable: boolean;
};

type RunApplyInput = {
  planId: string;
  forceProceedDespiteWarnings?: boolean;
  expectedDryRunReportId: string;                       // CAS — 가장 최근 dry-run report 기반 실행
};

type RollbackInput = {
  runId: string;
  scope: "full" | "from-step";
  fromStepKey?: string;
  reason: string;
};
```

---

## 4. 실행 파이프라인

### 4.1 plan 정의 → validate → dry-run → legal 승인 → apply

```
1. definePlan(input) — ContentMigrationPlan row 생성 (status=draft)
2. validatePlan(planId) — step type 등록 확인·reverse-step 정합·targetSelector 유효
3. runDryRun(planId) — sampling + 영향 보고 (변경 row 수·sample diff·예상 시간)
   - DryRunReport 저장
4. legal 게이트 요구 시 approvePlanLegalGate(planId) — ComplianceRecord 별도 lifecycle (REVIEW_WORKFLOW § 8)
5. runApply(planId, { expectedDryRunReportId }) — 실제 실행
   - read-only window (config) 적용 — 다른 admin write 차단
   - step 순차 실행. 각 step ContentMigrationStepResult insert
   - retry queue 등록
6. 완료 → audit + 알림
```

### 4.2 rollback

```
1. rollbackRun(runId, scope) — 완료된 step에서 reverse-step 역순 실행
2. reverse-step 없는 step → skip + 운영자 alert (수동 처리 필요)
3. rollback 자체 실패 → super-admin alert
```

### 4.3 read-only window

`config.execution.readOnlyWindowEnabled=true`이면 apply 직전 instance의 모든 admin write 차단 (제한된 시간). plan 완료 후 자동 해제.

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path docs\\features\\content-migration.md | Select-Object -Skip 260 -First 180" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path docs\\admin\\REVIEW_WORKFLOW.md | Select-Object -Skip 0 -First 260" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path docs\\core\\DATA_MODEL.md | Select-Object -Skip 620 -First 170" in C:\Users\assag\solution\website-exposure
 succeeded in 668ms:

---

## 5. 알림

### 5.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 cascade 필요)

| eventType | criticality | 채널 | recipients |
|---|---|---|---|
| `content-migration-plan-approved` | high | email + inApp | super-admin |
| `content-migration-run-completed` | medium | inApp | super-admin |
| `content-migration-run-failed` | critical | email + inApp | super-admin |
| `content-migration-rollback-triggered` | high | email + inApp | super-admin |

### 5.2 outbox — search-visibility § 7.3 SQL 동일

---

## 6. 운영 지표

| 지표 | 정의 | 목표 |
|---|---|---|
| plan 성공율 | success / 전체 | > 99% |
| dry-run 정확도 | apply 결과와 일치 | > 95% |
| rollback 성공율 | rollback 호출 시 | > 99% |
| step 평균 시간 | baseline | |
| read-only window 평균 길이 | baseline | |

---

## 7. 설치·설정

InstanceManifest § 2.3 + DB 9 tables (§ 9).

---

## 8. 빌드·런타임·invariant 검증

### 8.1 build-time fail

- `enabled=true` + `contentMigrationConfig` 누락
- `contentMigrationPolicyVersion` 누락
- `legalApproved !== true`
- `requiresFeature: notifications` 충족 안 됨
- `approvalRequired.*` 5종 모두 누락

### 8.2 runtime fail

- `runApply`의 `expectedDryRunReportId`와 가장 최근 DryRunReport 불일치 → CAS 실패
- legal 게이트 필요한 planKind인데 `approvePlanLegalGate` 미수행
- step 실행 중 timeout 초과
- reverse-step 없는 step에 대해 rollback scope 지정 → runtime fail (운영자 명시적 skip 요구)

### 8.3 runtime invariant·reconcile

- 진행 중 run pausedAt > 24h → 운영자 alert
- step retry exhausted → run 자동 pause
- read-only window 적용 중 다른 admin write 시도 → 거부 + alert

---

## 9. DB 인벤토리 (9 tables)

### 9.1 `ContentMigrationPlan`
plan 정의·status (draft·validated·dry-run-completed·legal-approved·apply-ready·archived).

### 9.2 `ContentMigrationDryRunReport`
dry-run 결과 — 영향 row 수·sample diff·예상 시간.

### 9.3 `ContentMigrationLegalApproval`
legal 게이트 승인 기록 — approvedBy·approvedAt·planFingerprint.

### 9.4 `ContentMigrationRun`
실행 envelope (status=pending·running·paused·completed·failed·cancelled·rollback-in-progress·rolled-back).

### 9.5 `ContentMigrationStepResult`
step 단위 결과 — input·output·error·duration.

### 9.6 `ContentMigrationStepRetryQueue`
retry 등록·worker SoT SQL.

### 9.7 `ContentMigrationRollbackLog`
rollback 시 실행된 reverse-step 기록.

### 9.8 `ContentMigrationReadOnlyWindow`
read-only window 적용 기간 추적.

### 9.9 `ContentMigrationNotificationOutbox`
search-visibility § 13.10 패턴.

---

## 10. 미결정 사항

| ID | 항목 |
|---|---|
| CM-01 | 외부 cluster 간 cross-instance migration 지원 (분원 신설 시 다른 region) |
| CM-02 | partial cutover (일부 row만 새 schema 적용) 지원 |
| CM-03 | dry-run sampling 알고리즘 — 단순 random vs stratified |
| CM-04 | read-only window 중 운영자 write 우회 권한 |
| CM-05 | rollback 시 일부 step만 부분 rollback 안전성 |
| CM-06 | policy-version-reevaluate 대량 batch 시 compliance-assistant 부하 관리 |
| CM-07 | instance-to-instance-copy의 PII 마스킹 정책 |
| CM-08 | DB DDL migration과 application-level data migration 경계 |

---

## 11. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-15 | v0.1 | 최초 작성 |

 succeeded in 701ms:
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


 succeeded in 681ms:
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

codex
초안은 cascade “필요”라고만 적은 곳과 실제 SoT enum/매트릭스 반영이 갈라져 있습니다. 이제 REVIEW_WORKFLOW의 알림 매트릭스와 AuditAction 표, compliance-assistant check 계약을 좁혀서 확인하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"9\\.1\\.1|NotificationEventType|eventType|content-migration|crm-sync|asset-ingestion|AuditAction|10\\.2\\.1|type AuditAction|notification\" docs\\admin\\REVIEW_WORKFLOW.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"function check|check\\(|ComplianceCheckResult|contentType|featureContentType|idempot|dedupe|batch|rate|policyVersion|content-migration\" docs\\features\\compliance-assistant.md" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"external|promote|asset-ingestion|content-migration|manualUpload|csvImport|copy|migration|legal|PII|boundary|SoT\" docs\\features\\asset-ingestion.md" in C:\Users\assag\solution\website-exposure
 succeeded in 600ms:
25:- **알림·감사**: notifications Feature Module로 검수자에게 큐 진입 알림. 모든 승인·거부·재검수는 audit log 기록 (immutable)
194:| **blocked** 정정 (fail 흐름, 큐 아님) | 24시간 내 작성자 응답 | § 9.1.1 `blocked-correction-required` |
195:| content-gate 큐 P0 | 영업일 3일 내 처리 | § 9.1.1 `content-gate-queued` |
196:| stale 큐 P1 | 영업일 7일 내 처리 (의료법 개정은 영업일 5일) | § 9.1.1 `stale-queued` |
197:| warning 큐 P2 | 영업일 14일 또는 다음 발행 시 일괄 처리 | § 9.1.1 `warning-queued` |
199:SLA 미달 시 운영팀 에스컬레이션 — § 9.1.1 `sla-overdue` (criticality=critical, quietHours bypass).
201:> 본 표의 "처리 영역"은 검수 워크플로 SLA 영역이며, 채널·주기 등 알림 정책은 § 9.1.1 매트릭스를 SoT로 따른다.
414:`features/analytics-reporting.md`는 **명시 command API** `enqueueMediaThresholdReassessment(input)`를 호출하여 본 워크플로에 재평가를 요청한다. `notifications.notify()`는 결과 알림용으로만 사용 (워크플로 트리거 책임 분리 — `features/analytics-reporting.md` AR2-10 정정).
460:## 9. 알림 (notifications Feature Module 인터페이스)
462:본 문서는 알림 **인터페이스·정책 SoT** — 이벤트 enum·페이로드 타입·이벤트별 채널/우선순위 정책 정의. 실제 발송 구현·재시도·dedupe·digest 큐 등 구현 영역은 `features/notifications.md`.
464:### 9.1 NotificationEventType enum (canonical SoT)
467:type NotificationEventType =
497:  // `features/asset-ingestion.md` 1차 cycle cascade (F-2)
498:  | "asset-ingestion-batch-completed"         // 수집 완료
499:  | "asset-ingestion-batch-failed"            // 수집 실패
500:  | "asset-ingestion-review-required"         // 검수 큐 진입
501:  | "asset-ingestion-pii-detected"            // PII 감지 (의료 도메인 critical)
502:  | "asset-ingestion-asset-promoted"          // Core 데이터 계약 변환 완료
503:  // `features/crm-sync.md` 1차 cycle cascade (CS1-01)
504:  | "crm-sync-batch-failed"                   // sync cycle 실패
505:  | "crm-sync-conflict-detected"              // 양방향 sync 충돌
506:  | "crm-sync-credential-expired"             // CRM 자격증명 만료
507:  | "crm-sync-credential-expiring-soon";      // 만료 14일 전
510:### 9.1.1 이벤트 정책 매트릭스 (canonical SoT)
514:| eventType | 한국어 이벤트명 | 수신자 산정 | 즉시 채널 | fallback 채널 (hard-suppressed 시) | digest 주기 | criticality | quietHoursPolicy | optOutPolicy |
542:| `asset-ingestion-batch-completed` | 수집 완료 | operator | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
543:| `asset-ingestion-batch-failed` | 수집 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
544:| `asset-ingestion-review-required` | 검수 큐 진입 | operator | inApp | (없음) | email 일일 요약 | normal | respect | digestOptOut 허용 |
545:| `asset-ingestion-pii-detected` | PII 감지 | operator + legal 검수자 | email + inApp | inApp | — | **critical** | bypass | mandatory |
546:| `asset-ingestion-asset-promoted` | Core 변환 완료 | operator | inApp | (없음) | (옵션) email 일일 요약 | normal | respect | digestOptOut 허용 |
547:| `crm-sync-batch-failed` | CRM sync 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
548:| `crm-sync-conflict-detected` | CRM 충돌 감지 | operator | email + inApp | inApp | — | high | respect | mandatory |
549:| `crm-sync-credential-expired` | CRM 자격증명 만료 | operator + super-admin | email + inApp | inApp | — | **critical** | bypass | mandatory |
550:| `crm-sync-credential-expiring-soon` | 만료 14일 전 | operator + super-admin | email + inApp | inApp | — | high | respect | mandatory |
552:- **fallback 채널 컬럼**: 즉시 채널 중 일부가 `hard-suppressed` 상태일 때 본 컬럼의 채널로 자동 라우팅. **fallback 채널은 본 매트릭스의 정식 SoT** — 즉시 채널 외부의 임의 추가 금지. fallback도 hard-suppressed면 외부 monitoring sink alert만 발생 (recipient 발송 대체 아님, `features/notifications.md` § 7.3)
554:- **criticality**: `critical` 이벤트는 사용자 quietHours·opt-out·인스턴스 운영시간(LocationProfile.businessHours)을 우회. 단, **inactive 사용자·인스턴스 채널 비활성·idempotency·dedupe는 우회하지 않음** (`features/notifications.md` § 4.1·§ 8.3 필터 순서). `high`는 사용자 quietHours 보류, `normal`은 전체 정책 적용
555:- **수신자 산정 규칙**: `eventType` → eligible AdminUserRole (§ 11.1) → ApproverRole 자격 (§ 11.2 ⚠️ 자격 검증) → 인스턴스 멤버십 → AdminUser.notificationPreferences 필터 (`features/notifications.md` § 4.1)
557:- **multi-location 인스턴스의 locationRef**: NotificationEvent에 `metadata.locationRef`(LocationProfile @id) 권장. 호출자(REVIEW_WORKFLOW transition)가 콘텐츠 소속 location을 산정·전달. 미해결 시 LocationProfile `main=true` fallback (`features/notifications.md` § 8.4 client-approver businessHours 정책 입력)
562:- **NotificationEvent** — 워크플로 트리거(`features/notifications.md` notify() 입력)에서 발생한 envelope. 1 event → N recipients
569:  eventType: NotificationEventType;                    // § 9.1 enum
573:  criticality: "critical" | "high" | "normal";         // § 9.1.1 매트릭스에서 자동 산정 가능. 호출자가 override 가능
586:  eventType: NotificationEventType;
601:- `features/notifications.md` notify()는 동일 `sourceEventId` 재호출 시 기존 DeliveryResult 반환 (재발송 없음, 단 외부 강제 재시도 액션은 § 8 별도 흐름)
602:- 권장 패턴: `sourceEventId = hash(eventType + contentRef + workflowTransitionTimestamp)` (호출자 책임)
606:- 채널 활성화는 인스턴스별 (`InstanceManifest.notificationChannels` — DATA_MODEL C-08 v0.9 +)
607:- 이메일 발송 실패 시 재시도 정책은 `features/notifications.md` § 7.1 채널별 분류표 적용
608:- in-app 알림은 어드민 종 아이콘에 미확인 카운트 표시 (NotificationInbox — `features/notifications.md` § 5.3·§ 14)
611:  - **broadcast 모드** — slackUserId 미보유 시. workspace channel에 envelope 1건 게시 (per-recipient 추적 불가). `criticality=critical` 이벤트만 broadcast 허용. DeliveryResult 소비 규칙: `broadcastDeliveries[]`가 성공/실패 집계 SoT, `perRecipient[].deliveries[].status=skipped-broadcast-only`는 placeholder (성공/실패 집계 대상 아님). 상세: `features/notifications.md` § 5.2·§ 3.2
625:- **알림 발송 결과 요약** — `notification-dispatched`(전체 fan-out 결과 1건). 채널별 상세(attempts·provider response·delivery latency)는 `features/notifications.md` § 9.2 NotificationLog가 SoT. audit log는 비즈니스 액션 추적, NotificationLog는 운영 메트릭 추적
635:  action: AuditAction;          // § 10.2.1 enum
639:  metadata: object;             // 액션별 컨텍스트 (예: rejectReason·legalCounselNote·notificationEventId)
643:#### 10.2.1 AuditAction enum
646:type AuditAction =
652:  | "notification-dispatched"               // 알림 발송 envelope 종료 요약
653:  | "notification-resend-attempted"         // DLQ에서 운영자 수동 재발송 시도 (`features/notifications.md` § 7.2)
654:  | "notification-read"                      // 사용자가 inApp 알림 클릭·읽음 마킹 시 (`features/notifications.md` § 5.3)
655:  | "notification-suppression-unsuppressed"   // 운영자가 hard-suppressed AdminUser 채널을 수동 해제 (`features/notifications.md` § 7.4)
663:  // `features/asset-ingestion.md` 1차 cycle cascade (F-4)
664:  | "asset-ingestion-source-registered"       // IngestionSource 등록
665:  | "asset-ingestion-source-unregistered"     // soft delete
666:  | "asset-ingestion-asset-promoted"          // Core 데이터 계약 변환
667:  | "asset-ingestion-asset-rejected"          // 검수 거부
668:  | "asset-ingestion-pii-redacted"            // PII 자동·수동 redaction
669:  // `features/crm-sync.md` 1차 cycle cascade (CS1-01·16)
672:  | "crm-sync-conflict-resolved"              // 충돌 운영자 해결
674:  // `features/crm-sync.md` 3차 cycle cascade (CS3-11)
680:> 알림 발송의 channel별 attempt·재시도·DLQ·deduped 이력은 audit log에 누적하지 않는다 (운영 노이즈 회피). `features/notifications.md` § 9.2 NotificationLog가 운영 메트릭 SoT. audit log는 envelope 단위 요약·재발송 액션·읽음 액션만 기록.
766:| ~~AW-07~~ | InstanceManifest.notificationChannels 필드 | v1.0 — DATA_MODEL C-08 v0.9 cascade로 `notificationChannels` 필드 신설 (email·slack.webhookUrl·inApp) |
772:| 2026-05-14 | v0.1 | 최초 작성 — 상태 머신 9종(draft·review-queued·in-review·approved·publishable·published·blocked·rejected·stale), 검수 큐 3종(content-gate·warning·stale), multi-role AND 게이트(RISK_LEVELS § 4.5 정합), ComplianceRecord 슬롯 채움 흐름, StaleFlags 처리, publishable 산정 알고리즘, 사전심의 흐름, notifications 인터페이스, 감사 로그(append-only·7년 보존), 권한 매트릭스 5종, 빌드 검증 룰 |
773:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) § 2.1·§ 4.1 `automatedDecision pass` 잔재 정정 — `!== "block"`로 통일, (2) **DATA_MODEL C-10 v0.8 cascade** — `warningAcknowledgements: WarningAcknowledgement[]` 필드 + 하위 타입 신설 (findingId·action·operatorId·timestamp·note). § 3.1.1 참조 정정, (3) § 8.1 `priorReviewRequired=false` 판정도 법무 기록 의무 명시 — `legalCounsel`·`legalCounselAt`·근거 attachments[] 모두 필수 (MEDICAL_AD § 4.2 정합), (4) **DATA_MODEL C-08 v0.9 cascade** — `notificationChannels` 필드 신설 (email·slack.webhookUrl·inApp). AW-07 해소 |

 succeeded in 625ms:
7:> **목적**: 콘텐츠 자동 검수를 담당하는 Feature Module의 단독 구현 명세 — RiskInference 자동 추론, RiskRule 카탈로그 로드, 정적 룰 checker, LLM 보조 인터페이스, ComplianceCheckResult 출력, 빌드·어드민 통합, 캐시·재실행 정책, 운영 지표를 정의.
21:- **핵심 책임**: (a) RiskInference 자동 추론 (RISK_LEVELS § 2), (b) RiskRule 카탈로그 로드 (RISK_LEVELS § 3), (c) 정적 룰 checker 실행 — 정규식/keyword/phrase/composite/contextExceptions, (d) LLM 보조 분석 (옵션·인스턴스 활성화 시), (e) ComplianceCheckResult 출력 (CONTENT_STANDARDS § 7.2)
23:- **출력 SoT**: ComplianceCheckResult 형식 (CONTENT_STANDARDS § 7.2). 본 Feature는 새 출력 타입 신설하지 않음
24:- **캐시·idempotency**: 동일 (콘텐츠 본문 hash + 룰 카탈로그 version) → 동일 결과. cache hit 시 LLM 미호출
112:  contentType: ContentType;
113:  featureContentType?: FeatureContentTypeId;
121:    inferredRiskLevel?: RiskLevel;   // CONTENT_STANDARDS § 7.1 정식 입력 슬롯 — 호출자(어드민·빌드 파이프라인)가 RiskInference 결과를 채워서 전달. 본 Feature가 단일 엔트리포인트 `check()` 호출 전 외부에서 RiskInference 실행한 경우 사용. 미지정 시 본 Feature 내부에서 자동 추론 (§ 3.3 흐름)
127:### 3.2 출력 — ComplianceCheckResult (CONTENT_STANDARDS § 7.2)
130:type ComplianceCheckResult = {
146:### 3.3 단일 엔트리포인트 — `check()`
148:본 Feature는 **단일 엔트리포인트** `check(input)`를 노출. 호출자(어드민·빌드 파이프라인)는 RiskInference·inlineRiskFlags 추출 등을 별도 호출하지 않음.
151:async function check(input: ComplianceCheckInput): Promise<ComplianceCheckResult>
155:- `metadata.pageTypeId` 미지정 시 — check()가 `contentType` + `pageMeta` 기반으로 자동 유도 (예: `contentType="LegalDocument"` → P-013). 유도 불가 시 fail (§ 11 빌드 검증)
156:- `metadata.articleType` 미지정 시 — `contentType="Article"`이면 fail. 그 외 콘텐츠는 articleType N/A로 처리
157:- **`contentType="Feature"` 예외** (`features/asset-ingestion.md` AI3-10·AI4-10 cascade): `featureContentType="feature:asset-ingestion"` 인 raw asset check 호출 시 — pageTypeId·articleType 미지정 허용. feature-scoped + global rules만 적용 (pageType-specific rules 적용 안 함). inferredRiskLevel은 finding severity 기반 보수적 산정 (content-gate/fail 1+ 시 Medium·High)
173:본 Feature 내부에서 사용. § 3.3 `check()`가 자동 호출:
222:8. severity 집계 → ComplianceCheckResult 산출:
252:| 출력 | ComplianceCheckResult + ComplianceRecord(pre-publish) 갱신 | 동일 |
369:- 검수자가 명시 수락한 LLM finding — ComplianceCheckResult.findings[]에 정상 Finding으로 누적 (triggeredBy="llm-assist") + audit log에 수락 액션 기록 (actor·timestamp·메모)
425:## 8. 캐시·idempotency·재실행
432:  contentType,                          // CONTENT_STANDARDS § 7.1
433:  featureContentType,                   // (있을 때) Feature 콘텐츠 식별
454:| **영속 결과 캐시** (durable result cache) | 동일 cacheKey → 영구 동일 결과. idempotency 보장. cacheKey 변경 시 자연 무효화 | 무기한 (cacheKey가 입력 모두 포함하므로 자동 무효화) |
460:### 8.3 idempotency 보장
474:- `kind="content-type"` — `staleScope.contentTypes[]` 매칭 record만
479:- 본 Feature의 `check()` 호출 시 cacheKey 변경(ruleCatalogVersion·ruleFileHashes)으로 자동 miss → 새 결과 산출
506:- 모든 ComplianceCheckResult 호출에 timing 메트릭 기록
552:   - ComplianceCheckResult 미생성 → REVIEW_WORKFLOW § 7.1 (1) `automatedDecision !== "block"` 조건은 자동 통과로 간주
556:     - `legal` — `contentType === "LegalDocument"` 시 자동 (C-10·C-16 required)
607:| 2026-05-14 | v0.1 | 최초 작성 — Feature 메타·Core 의존성·InstanceManifest 통합, 입력/출력(CONTENT_STANDARDS § 7 인터페이스 적용), 빌드 파이프라인 9단계 + 빌드 모드/어드민 모드 분리, composite 룰·contextExceptions 평가, LLM 보조 인터페이스·프롬프트·출력 형식·human-in-loop, RiskInference·inlineRiskFlags 통합, 룰 카탈로그 로드(RISK_LEVELS § 3.4 정합), 캐시·idempotency·재실행, 운영 지표 6종·SLO, 설치·설정, 빌드 검증 룰 |
609:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (7개 지적 전건 수용)**: (1) § 3.3 입력 보강 계약 — pageTypeId 미지정 시 contentType+pageMeta 유도, 유도 불가 시 fail. articleType은 contentType=Article 시 필수, (2) § 4.1 7단계 High 가상 finding `triggeredBy` 판정 — RiskInferenceResult.steps 기반. explicit 우선, (3) § 4.1 5단계 inlineRiskFlags 추출 정밀화 — flag별 산출 방식 분리. includes-effect-claim만 category 기반, 나머지 4종은 정규식·ReviewPolicy·미디어 입력, (4) § 5.4.1 LLM ruleId seq를 canonical sort 후 순번으로 — LLM 출력 순서 불변, (5) § 8.1 cacheKey에 `reviewPolicyHash`·`mediaAttachmentsHash` 추가, (6) § 10.3 "DATA_MODEL cascade 후속" 잔재 문구 정정 — v0.12 완료 명시, (7) § 10.3 비활성 모드 finalRoles 산정 정의 — 운영자 수동 결정·audit 기록 |
611:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 3.3 check() 순서 설명을 § 4.1 실제 실행 순서와 일치시킴 (룰 매칭 → inlineRiskFlags → RiskInference), (2) inferredRiskLevel 외부 입력 처리 명확화 — check() 내부 항상 재계산. 외부 입력 신뢰 사용 안 함, (3) § 4.1 meta.yaml 우선 로드 — loadOrder가 로드 계획 기준임을 명시, (4) activeFeatures/id 잔재 정정 — `features[name=]` 통일, (5) § 5.4.1 LLM synthetic ruleId를 결정적 ID(SHA-256 hash)로 — finding 참조 안정성 보장, (6) **DATA_MODEL C-10 v0.11 cascade** — `autoCheckResult.llmAssist.invocations[]` 구조 명시 (CA-08 해소), (7)·(8) § 8.4 룰 카탈로그 변경 처리 — 본 Feature는 staleFlags만 갱신, 재호출은 어드민 재검수 큐 트리거 (REVIEW_WORKFLOW 정합), (9) § 10.3 비활성화를 예외 승인 인스턴스 한정으로 정정 — `complianceAssistantExemptApproval` 플래그 (CA-10), (10) § 11 룰 카탈로그 부재 fail 분기 명시 — enabled=true일 때만 |
612:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (18개 지적 전건 수용)**: (1) **DATA_MODEL C-08 features[] 필드명 정합 + `config` cascade**(v0.10) — activeFeatures[] → features[]. CA-02 해소, (2) Feature 메타 specVersion 0.1 명시 (문서 상태와 분리), (3) LLM 의존성 — anthropic 권장 default + provider 옵션 명시, (4) § 3.3 단일 엔트리포인트 `check()` 명시 — RiskInference는 내부 자동, (5)·(7) § 4.1 실행 순서 재정렬 — RiskRule 매칭 후 inlineRiskFlags 추출. Finding[]은 모든 매칭 보존(우선순위는 집계만 흡수), (6) 룰 카탈로그 로드 파일 6개로 통일, (8) § 4.6 Finding 메타 확장 — `triggeredBy`·`llmAssistMeta` cascade (CONTENT_STANDARDS § 7.2 v1.3), (9) § 4.3 KSS v3+ 채택 명시 + UTF-16 offset (CA-03 해소), (10) § 4.4 contextExceptions 평가 알고리즘 강화 — patternType별 평가 + 같은 문장 내 적용, (11) § 5.4.1 LLM additionalFindings 채움 규약 — synthetic ruleId·offset 산정 실패 처리, (12) § 5.5 LLM 결과 저장 슬롯 — `ComplianceRecord.autoCheckResult.llmAssist`(CA-08 신설) + 검수자 수락 시 findings[]에 누적, (13)·(14) § 8.1·§ 8.2 cacheKey 완전화 + 영속 결과 캐시 vs 운영 TTL 캐시 2종 분리, (15) § 8.4 룰 카탈로그 변경 시 staleScope.kind별 분기 처리 + finding ruleId 역색인, (16) § 9.1 운영 지표 precision/recall 보조 지표로 명확화 (CA-09 ground truth 미결정), (17) § 11 빌드 검증 룰에서 운영 지표 항목 제거 — § 9 알림 영역으로 분리, (18) § 10.3 비활성화 시 REVIEW_WORKFLOW publishable 영향 + § 10.3.1 강제 활성 정책 명시 |

 succeeded in 631ms:
1:# Feature — asset-ingestion
7:> **목적**: 클라이언트 기존 자료(웹사이트·SNS·업로드·CSV)를 수집·파싱·태깅·PII 처리·검수·promote(Core 데이터 계약 변환). 의료기관 신규 인스턴스 onboarding의 첫 단계.
14:- **Feature 식별자**: `asset-ingestion`
15:- **핵심 책임**: 외부 source 자료 수집 → 파싱 → PII 감지/redaction → 자동 태깅 → 검수 큐 → Core 데이터 계약 변환(promote)
16:- **vs content-migration 경계** (F-16): 본 Feature는 **외부 raw 자료 수집 · 파싱 · 태깅 · 검수 큐까지**. content-migration은 **대량 이관 계획 · URL 리다이렉트 · slug 보존 · 검수 이력 승계**. **promote는 본 Feature 책임** (Core 데이터 계약 row 생성). 두 Feature 보완 관계 (ARCHITECTURE § 11.1 cascade 검토 필요 — AI-14 신규)
18:- **운영 모드**: v1.0은 `staged`만 (모든 asset 검수 필수). `auto-promote`는 v1.x (AI-11)
20:- **신호 흐름**: ingest → parse → pii-detect → tag(rule-based + compliance-assistant check + LLM 옵션) → review → rights/legal usage check → promote (Core 계약 변환)
32:| source type 추가 | MINOR | 별개 | DATA_MODEL C-08 AssetIngestionConfig 필드 추가 + adapter contract + legal gate + build validation 동시 |
33:| source type 제거 | **MAJOR** | 별개 | 기존 IngestionSource row migration |
34:| 태깅 카탈로그·promote 매핑 변경 | **MAJOR** | policyVersion 신규 | Core 계약 호환성 검토 |
35:| 운영 모드 추가 (`auto-promote` 등) | **MAJOR** | 별개 | Feature SemVer MAJOR + § 11 build fail 룰 갱신 + REVIEW_WORKFLOW 진입 지점 정의 |
36:| build/runtime/migration fail 룰 추가·강화 | **MAJOR** | 별개 | |
42:### 1.2 SoT 원칙
44:- 룰 매칭 SoT는 `features/compliance-assistant.md` § 3.3 `check()`
45:- 알림·audit SoT는 REVIEW_WORKFLOW § 9·§ 10.2.1 (cascade 완료)
46:- 자격증명·policyVersion·AssetIngestionApprovedScope SoT는 DATA_MODEL C-08 v0.18
47:- Core 데이터 계약 SoT는 DATA_MODEL C-01~C-22
48:- 본 문서 = 수집·파싱·PII·태깅·검수·promote SoT + 내부 데이터 구조 SoT (§ 16)
61:- 기존 솔루션 내 콘텐츠 이전·대량 이관 계획·URL 리다이렉트 — content-migration (후속)
70:name: "asset-ingestion"
81:| compliance-assistant § 3.3 | `check()` — 자동 태깅에 활용. **의료기관 인스턴스에서 asset-ingestion 활성 시 compliance-assistant 활성 또는 `complianceAssistantExemptApproval` required** (build fail) |
82:| notifications | **notify() 필수** (본 Feature는 monitor-only 모드 없음 — AI2-09 정정). 검수 큐 진입·PII 감지 등 본 Feature의 핵심 흐름이 알림 의존. notifications 비활성 인스턴스는 본 Feature 활성 불가 |
86:| DATA_MODEL C-23 | AdminUser (검수자·promote 권한) |
87:| DATA_MODEL C-01~C-22 | promote 대상 Core 데이터 계약 |
93:- `snsApi.<platform>` 필드에 `legalApproved`·`legalApprovedBy`·`legalApprovedAt`·`approvedAccountIds[]`·`allowedContentTypes[]`·`consentEvidenceRef` 추가 — F-12 게이트
96:- `promote.targetMapping` policyVersion: closed union 강제 — § 8
110:| `asset-ingestion-source-registered` | `"ingestion-source:" + sourceId` | sourceType·configSummary·registeredBy | operator·super-admin |
111:| `asset-ingestion-source-unregistered` | `"ingestion-source:" + sourceId` | sourceType·activeBefore·activeAfter·unregisteredBy | operator·super-admin |
112:| `asset-ingestion-asset-promoted` | `"asset:" + assetId` | targetContentType·targetContentRef·targetMappingSummary·promotedBy | operator·super-admin |
113:| `asset-ingestion-asset-rejected` | `"asset:" + assetId` | rejectionReason·rejectedBy | operator·super-admin |
114:| `asset-ingestion-pii-redacted` | `"asset:" + assetId` | piiFindingIds[]·redactionMode·redactedBy(또는 system) | system·operator |
145:### 5.1 web-crawl (법무 게이트 — DATA_MODEL C-08 AssetIngestionApprovedScope SoT)
147:- `webCrawl.enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedScope` 누락 또는 `approvedScope.allowedDomains` 빈 배열 또는 `targetDomains` ⊄ `approvedScope.allowedDomains` 또는 `approvedScope.allowCaptchaBypass === true`) → build fail (F-10·F-11)
148:- crawler 실행 파라미터가 approvedScope 밖이면 `skipped-legal-out-of-scope`
153:- `snsApi.<platform>.enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedAccountIds` 빈 배열 또는 `allowedContentTypes` 빈 배열) → build fail
155:- 수집 대상은 `approvedAccountIds`에 명시된 계정만 — **adapter는 API 호출 파라미터 검증 + 응답 item별 `authorAccountId`·`ownerAccountId` 검증** (AI2-11): 공유글·리그램·인용·댓글·cross-post에서 실제 owner가 approved 외인 item은 `skipped-legal-out-of-scope`로 quarantine (asset 생성 안 함)
174:  featureContentType: "feature:asset-ingestion",       // 신설 — DATA_MODEL C-10 v0.5 패턴
178:    pageTypeId: undefined,                              // 아직 미산정 (promote 시 결정)
191://   - 정식 RiskLevel은 promote 시점 contentType=Article 등으로 재호출 시 결정
195:- **RiskLevel 추정**: result.findings 중 severity="content-gate" 또는 "fail" 존재 시 AssetTag.tagKind=`riskLevel` value=`High` (보수적). 정식 RiskLevel은 promote 시점에 결정
204:## 7. 검수·promote 게이트 (F-15 의료광고·저작권·SNS 동의)
212:- **`rightsReview` 권한은 별도 legal gate** (AI4-12): § 16.9 권한 매트릭스 참조 — status 변경은 legal-reviewer·super-admin만. operator는 evidence-added만 가능
214:### 7.2 promote 게이트 (F-15)
216:운영자가 promote 액션 호출 전 다음 게이트 확인 필수:
221:| **rightsReview 상태** (AI2-03 명칭 통일) | source가 외부 URL·SNS·환자 후기·전후사진 감지 → `AssetReviewRecord.rightsReview.status === "approved"` 필수 | 미승인 시 promote 차단 + `requiredApproverRoles=["legal"]` 명시 |
222:| **PII 처리 완료** (AI4-07 — AssetPiiFinding 기준) | **AssetPiiFinding 0건** 또는 모든 finding이 다음 중 하나: (a) `reviewStatus="false-positive"`, (b) `reviewStatus="true-positive" AND redactionApplied=true` | 미처리 시 차단 (`open` 또는 `true-positive AND redactionApplied=false`는 차단). `piiDetected` boolean은 표시용 denormalized summary만. § 13.4 reconcile invariant — `piiDetected != exists(AssetPiiFinding)` 감지 시 sink alert |
229:## 8. promote (Core 데이터 계약 변환 — F-7·F-8)
241:// AI2-05 — v1.0 promote 지원 5종 한정. ReviewPolicy·PricingPage·LocationProfile·ReservationPage·FacilitiesPage·ClinicProfile·DoctorProfile·ArticleCategory 등은
242:// v1.0에서 promote 미지원 → runtime fail. 해당 contentType 생성은 어드민 UI manual 처리. v1.x에서 contentType별 TargetMapping 추가 예정 (AI-17 신규)
253:  // required (C-04 SoT)
268:  externalUrl?: URL;
275:// TreatmentPage (DATA_MODEL C-03 v0.4 정합 — AI4-05 SoT 동등)
277:  // required (C-03 SoT)
334:**runtime validation**: TargetMapping의 mapping 객체에 contentType별 SoT 필수 필드 누락 또는 unknown field → fail.
336:### 8.2 promote 흐름 (AI3-01·02·03·04 — 상태 머신·lock·reconcile·outbox atomicity)
353:1. promote 게이트 사전 검증 (§ 7.2 — 미충족 시 runtime fail, AssetPromotionRecord 미생성)
367:   g. **AssetIngestionNotificationOutbox INSERT** (sourceKind="asset", sourceId=assetId, eventType="asset-ingestion-asset-promoted") — AI3-04 atomic
371:   - audit log `asset-ingestion-asset-promoted` 기록 — 실패 시 reconcile (audit는 외부 시스템)
376:**reconcile worker** (AI3-02 — SoT 명시. § 13.4 신설로 분리):
388:## 9. PII 처리 (F-13·F-14)
390:### 9.1 PII 자동 감지·redaction
407:  - 검증 실패: PII 미분류 (regex 우연 일치 false-positive) — confidence=0
408:  - 검증 통과: PII 분류 confidence=1.0
416:- **Raw blob** (`IngestedAsset.blobRef` — `raw/` prefix): 원본 보존. encrypted (aes-256-gcm). IAM으로 legal 검수자·super-admin만 접근
417:- **ExtractedContent.rawBody**: 파싱 후 raw text. AssetPiiFinding offset의 SoT. legal 검수자·super-admin만 read
421:### 9.2 의료법·저작권 게이트 — § 7.2 promote 게이트로 강제
431:| `asset-ingestion-batch-completed` | normal | inApp | (없음) | (옵션) email 일일 | respect | digestOptOut 허용 |
432:| `asset-ingestion-batch-failed` | high | email + inApp | inApp | — | respect | mandatory |
433:| `asset-ingestion-review-required` | normal | inApp | (없음) | email 일일 | respect | digestOptOut 허용 |
434:| **`asset-ingestion-pii-detected`** | **critical** (F-3) | email + inApp | inApp | — | bypass | mandatory |
435:| `asset-ingestion-asset-promoted` | normal | inApp | (없음) | (옵션) email 일일 | respect | digestOptOut 허용 |
445:| `asset-ingestion-batch-completed` | `ingestion-log` | ingestionLogId | `"ingestion-log:" + ingestionLogId` | `"수집 완료 — ${date}"` | ingestionLogId·perSource summary |
446:| `asset-ingestion-batch-failed` | `ingestion-log` | ingestionLogId | `"ingestion-log:" + ingestionLogId` | `"수집 실패 — ${date}"` | ingestionLogId·failedSources[] |
447:| `asset-ingestion-review-required` | `asset` | assetId | `"asset:" + assetId` | `"검수 필요 — ${assetTitle}"` | assetId·sourceType·tags |
448:| `asset-ingestion-pii-detected` | `asset` | assetId | `"asset:" + assetId` | `"PII 감지 — ${assetTitle}"` | assetId·piiFindingIds[]·detectorSummary·redactionMode |
449:| `asset-ingestion-asset-promoted` | `asset` | assetId | `"asset:" + assetId` | `"Core 변환 완료 — ${targetContentType}"` | assetId·targetContentType·targetContentRef·assetPromotionRecordId |
452:- `asset-ingestion-pii-detected`: asset 단위 1건만 발송 (한 asset에 multiple PII finding 발생해도 sourceId=assetId로 합산). piiFindingIds[] metadata로 상세 전달
453:- UNIQUE(sourceKind, sourceId, eventType) — 동일 asset에 pii-detected 이벤트 1건만 outbox row. asset에 PII가 추가 발견되면 새 outbox 생성 안 함 (기존 finding 수정/추가는 read API로 확인)
455:`sourceEventId = hash("asset-ingestion:" + sourceKind + ":" + sourceId + ":" + eventType)` (search-visibility 패턴).
470:| PII 감지 적중률 | 운영자 confirmed / 자동 감지 | > 80% (M2+ baseline) |
471:| promote율 | promoted / approved | baseline |
475:| **PII true-positive rate** | reviewStatus="true-positive" / 전체 finding | baseline (M2+) |
476:| **PII false-positive rate** | reviewStatus="false-positive" / 전체 finding | < 30% (M2+ baseline) |
477:| **redaction completion SLA** | promoteAsset 시점에 모든 finding redactionApplied or false-positive 비율 | > 99% |
490:- **auto-promote** (v1.x — AI-11): Low risk 자동 promote
494:## 13. 빌드·런타임·migration 검증 (3분리 — search-visibility 패턴)
501:- `webCrawl.enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedScope` 누락 또는 `approvedScope.allowedDomains` 빈 배열 또는 `targetDomains` ⊄ `approvedScope.allowedDomains` 또는 `approvedScope.allowCaptchaBypass === true`) (F-10·F-11)
502:- `snsApi.<platform>.enabled=true` + 법무 게이트 누락 (legalApproved·approvedAccountIds·allowedContentTypes 등) (F-12)
507:- `promote.autoMappingEnabled=true` (v1.0 미지원)
508:- `mode="auto-promote"` (v1.0 미지원)
518:- **`promoteAsset` 게이트 미충족** (§ 7.2): 검수 미승인·rights 미승인·PII 미처리·증빙 미첨부
519:- **`promoteAsset` targetMapping의 contentType별 필수 필드 누락 또는 unknown field** (F-7)
520:- **`promoteAsset` targetContentType이 v1.0 unsupported** (AI3-09 — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 외) → fail + AssetTag `manualProcessingRequired=true` 마킹 (asset 상태는 approved 유지. 어드민 UI manual Core editor 경로. manual 생성 Core row는 `provenanceAssetId` 필드 보존)
521:- crawler 실행 파라미터가 approvedScope 밖 → `skipped-legal-out-of-scope`
522:- SNS API 호출이 `approvedAccountIds` 밖 → `skipped-legal-out-of-scope`
524:### 13.3 migration-time validation·migration 정책 (AI3-07 + AI5-04 backfill)
527:- migration-time validation: `IngestedAsset.blobKeyVersion IS NULL` row 감지 시 자동 backfill 수행
528:  - blobRef path가 `asset-ingestion/{instanceId}/{YYYY-MM-DD}/{assetId}/{kind}.{ext}` 패턴 일치 → `blobKeyVersion="v0.2"`
529:  - blobRef path가 `asset-ingestion/{instanceId}/{kind}/{YYYY-MM-DD}/{assetId}.{ext}` 패턴 일치 → `blobKeyVersion="v0.3"`
530:  - 양쪽 패턴 모두 미일치 → migration fail + sink alert (운영자 명시 정정 필요)
533:**v0.2 → v0.3 blob key format migration**:
534:- v0.2 key: `asset-ingestion/{instanceId}/{YYYY-MM-DD}/{assetId}/{kind}.{ext}`
535:- v0.3 key: `asset-ingestion/{instanceId}/{kind}/{YYYY-MM-DD}/{assetId}.{ext}` (kind를 prefix로)
538:  - **eager migration** (선택): 운영자 명시 액션 `migrateBlobKeysV02toV03(instanceId, dryRun)` — super-admin 전용. 모든 v0.2 blob을 v0.3 path로 copy + 기존 v0.2 삭제 (또는 별도 archive). audit log `asset-ingestion-blob-key-migrated-v02-v03` (AI-18 audit cascade 후속)
539:  - v0.2 key 허용 기간: v1.x release까지. v2.0에서 v0.2 path read 제거 — manifest validator가 lazy rewrite 권고 → eager migration 강제
552:    - AssetIngestionNotificationOutbox: `WHERE sourceKind='asset' AND sourceId=assetPromotionRecord.assetId AND eventType='asset-ingestion-asset-promoted'`
573:| AI-06 | PII 감지 LLM 기반 정밀도 향상 | M2+ |
578:| AI-11 | auto-promote mode + LLM 자동 매핑 | v1.x |
580:| AI-13 | retroactive promote | M2+ |
581:| AI-14 | ARCHITECTURE § 11.1 content-migration 정의 cascade (F-16) | ARCHITECTURE 문서 후속 |
584:| AI-17 | v1.x promote 지원 contentType 확장 (ReviewPolicy·PricingPage·LocationProfile 등) | v1.x |
585:| AI-18 | `asset-ingestion-blob-key-migrated-v02-v03` audit cascade (eager migration 시) | v1.x patch (운영 시 운영자 명시 액션) |
598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
622:### 16.6 `ExtractedContent` (AI3-06·AI4-09 — rawBody SoT + body materialized view)
625:- **`rawBody`** (Markdown — redaction 전 원본. AssetPiiFinding offset SoT. legal·super-admin만 read. IAM 정책으로 보호)
646:| `detector` | enum (`regex`·`checksum`·`manual`) | ✅ — **v1.0은 llm detector 미지원** (AI2-07. v1.x에서 LLM 활성화 시 provider allowlist·promptVersion·data minimization·raw PII 외부 전송 금지 또는 명시 승인 예외·audit metadata 정의 — AI-06 cascade) |
661:- promote transaction의 CAS 입력 (§ 8.2 3.a)
670:  currentReviewedBy?: string,             // 마지막 reviewer (legal 검수자 자격 검증 — REVIEW_WORKFLOW § 11.2)
673:    kind: "copyright-license"|"consent-form"|"author-permission"|"public-domain"|"fair-use-note",
694:**reviewer 자격 검증**: rightsReview.status 변경 시 currentReviewedBy의 AdminUser.approverRoleEligibility에 `"legal"` 포함 필수 (REVIEW_WORKFLOW § 11.2 정합). 미충족 시 403.
700:| `status-changed` (approved/rejected) | legal-reviewer·super-admin | 검수 큐 detail panel |
701:| `evidence-added` | operator·legal-reviewer·super-admin | 증빙 첨부 폼 (모두 가능) |
702:| `evidence-superseded` | legal-reviewer·super-admin (operator 불가) | 활성 증빙 옆 "supersede" 버튼 (legal 자격만 노출) |
705:UI 기본 표시: 최신 status + active(superseded=false) evidence. superseded evidence와 history는 **audit drawer**에서 legal-reviewer·super-admin에게만 노출.
718:| `reviewVersionSnapshot` | integer | ✅ | promote 시점 AssetReviewRecord.reviewVersion (CAS 입력) |
719:| `promotedBy` | string | ✅ | AdminUser @id |
740:| `sourceEventId` | string | ✅ — `hash("asset-ingestion:" + sourceKind + ":" + sourceId + ":" + eventType)` |
753:object key format: `asset-ingestion/{instanceId}/{kind}/{YYYY-MM-DD}/{assetId}.{ext}` (kind=`raw`·`redacted`·`thumbnail`) — AI2-08 정정: kind를 path prefix로 두어 IAM condition `s3:prefix=asset-ingestion/{instanceId}/raw/*` 적용 가능.
755:**IAM 정책 SoT** (search-visibility § 13.7 패턴):
759:- `raw/` prefix는 legal 검수자·super-admin만 read 가능 (PII·민감 원본 보호)

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path docs\\admin\\REVIEW_WORKFLOW.md | Select-Object -Skip 460 -First 230" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "Get-Content -Path docs\\features\\compliance-assistant.md | Select-Object -Skip 100 -First 95; Get-Content -Path docs\\features\\compliance-assistant.md | Select-Object -Skip 425 -First 65" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"ContentMigration|contentMigrationConfig|contentMigrationPolicyVersion|content-migration\" docs\\core\\DATA_MODEL.md docs\\ARCHITECTURE.md" in C:\Users\assag\solution\website-exposure
 succeeded in 626ms:
docs\ARCHITECTURE.md:20:- 코어의 직각 차원으로 **Feature Modules**(notifications · asset-ingestion · crm-sync · analytics-reporting · keyword-monitoring · **search-visibility** · compliance-assistant · content-migration)를 둔다. Instance가 선택 장착한다.
docs\ARCHITECTURE.md:138:   keyword-monitoring · search-visibility · compliance-assistant · content-migration
docs\ARCHITECTURE.md:200:| 기존 콘텐츠 이관 | | | | ✅ content-migration | 도구 |
docs\ARCHITECTURE.md:408:| Feature | `features/*` (8종) | notifications, asset-ingestion, crm-sync, analytics-reporting, keyword-monitoring, **search-visibility**, compliance-assistant, content-migration |
docs\ARCHITECTURE.md:531:| **content-migration** | 기존 사이트·블로그·카페 콘텐츠를 솔루션 데이터 모델로 이관 | Core 콘텐츠 저장소 인터페이스 | 이관 분량·복잡도 |
docs\ARCHITECTURE.md:562:| content-migration | 검토 | 기존 콘텐츠 이관 규모 |

 succeeded in 680ms:
      strictMode: false
```

---

## 3. 입력·출력

### 3.1 입력 — ComplianceCheckInput (CONTENT_STANDARDS § 7.1)

```ts
type ComplianceCheckInput = {
  contentType: ContentType;
  featureContentType?: FeatureContentTypeId;
  contentRef: string;
  body: Markdown;
  metadata: {
    pageTypeId?: PageTypeId;
    articleType?: ArticleType;
    pageMeta?: PageMeta;
    explicitRiskLevel?: RiskLevel;
    inferredRiskLevel?: RiskLevel;   // CONTENT_STANDARDS § 7.1 정식 입력 슬롯 — 호출자(어드민·빌드 파이프라인)가 RiskInference 결과를 채워서 전달. 본 Feature가 단일 엔트리포인트 `check()` 호출 전 외부에서 RiskInference 실행한 경우 사용. 미지정 시 본 Feature 내부에서 자동 추론 (§ 3.3 흐름)
  };
  riskRules: RiskRule[];
};
```

### 3.2 출력 — ComplianceCheckResult (CONTENT_STANDARDS § 7.2)

```ts
type ComplianceCheckResult = {
  automatedDecision: "block" | "gate" | "warn" | "pass";
  buildBlocked: boolean;
  gateRequired: boolean;
  hasWarnings: boolean;
  findingsBySeverity: {
    "fail": number;
    "content-gate": number;
    "warning": number;
    "info": number;
  };
  requiredApproverRoles?: ApproverRole[];
  findings: Finding[];
};
```

### 3.3 단일 엔트리포인트 — `check()`

본 Feature는 **단일 엔트리포인트** `check(input)`를 노출. 호출자(어드민·빌드 파이프라인)는 RiskInference·inlineRiskFlags 추출 등을 별도 호출하지 않음.

```ts
async function check(input: ComplianceCheckInput): Promise<ComplianceCheckResult>
```

**입력 보강 계약**:
- `metadata.pageTypeId` 미지정 시 — check()가 `contentType` + `pageMeta` 기반으로 자동 유도 (예: `contentType="LegalDocument"` → P-013). 유도 불가 시 fail (§ 11 빌드 검증)
- `metadata.articleType` 미지정 시 — `contentType="Article"`이면 fail. 그 외 콘텐츠는 articleType N/A로 처리
- **`contentType="Feature"` 예외** (`features/asset-ingestion.md` AI3-10·AI4-10 cascade): `featureContentType="feature:asset-ingestion"` 인 raw asset check 호출 시 — pageTypeId·articleType 미지정 허용. feature-scoped + global rules만 적용 (pageType-specific rules 적용 안 함). inferredRiskLevel은 finding severity 기반 보수적 산정 (content-gate/fail 1+ 시 Medium·High)

**내부 동작 순서** (§ 4.1 실행 순서와 동일):
1. 룰 카탈로그 로드 (캐시)
2. RiskRule 매칭 (각 finding 산출)
3. inlineRiskFlags 추출 — flag별 산출 방식 분리 (§ 4.1 5단계 / RISK_LEVELS § 5.1): `includes-effect-claim`만 매칭 category 집합 기반, 나머지 4종은 정규식·ReviewPolicy·미디어 입력
4. RiskInference 실행 — pageType·articleType·slot·inlineRiskFlags·explicitRiskLevel MAX 결합 → `RiskInferenceResult` (RISK_LEVELS § 2.3.1)
5. High 가상 finding 주입·결과 집계·LLM 보조(어드민 모드)

**`metadata.inferredRiskLevel` 입력 처리** (CONTENT_STANDARDS § 7.1 SoT 정합):
- 외부에서 채워 전달된 경우 — 신뢰 입력으로 사용 (호출자 책임으로 일관성 보장). 본 Feature는 내부 재계산 생략 가능 (성능)
- 외부 미지정 시 — 본 Feature 내부에서 자동 추론 (§ 4.1 5~6단계)
- 호출자가 룰 카탈로그·slot 변경 후 stale 위험을 회피하려면 — `inferredRiskLevel` 미전달하여 내부 재계산 강제 또는 cacheKey 변경으로 자연 재계산

### 3.4 RiskInference 입력·출력 (RISK_LEVELS § 2)

본 Feature 내부에서 사용. § 3.3 `check()`가 자동 호출:

```ts
type RiskInferenceInput = {
  pageTypeId: PageTypeId;
  articleType?: ArticleType;
  inlineRiskFlags: InlineRiskFlag[];
  slotMatches: SlotMatch[];
  explicitRiskLevel?: RiskLevel;
};

type RiskInferenceResult = {
  inferredRiskLevel: RiskLevel;        // MAX 결합 결과
  steps: Array<{ source: string; level: RiskLevel }>;  // 산정 과정 추적
};
```

---

## 4. 빌드 파이프라인 (정적 룰 checker)

### 4.1 실행 순서


### 8.1 캐시 키 산정

```
cacheKey = hash(
  contentBody,                          // 본문 정규화(공백/줄바꿈 표준화) 후 hash (SHA-256)
  contentType,                          // CONTENT_STANDARDS § 7.1
  featureContentType,                   // (있을 때) Feature 콘텐츠 식별
  contentRef,                           // 대상 콘텐츠 @id
  inferenceInputs,                      // pageTypeId·articleType·pageMeta·**slotMatches**·explicitRiskLevel (inferredRiskLevel 제외 — 외부 입력은 무시되므로 cacheKey 영향 없음)
  reviewPolicyHash,                     // ReviewPolicy(C-13) 직렬화 hash — `beforeAfterPhotoAllowed` 등 inlineRiskFlags 산정 입력
  mediaAttachmentsHash,                 // 콘텐츠에 첨부된 미디어 파일 목록 hash — 후기·전후사진 미디어 변경 추적
  ruleCatalogVersion,                   // meta.yaml catalogVersion (6파일 통합)
  ruleFileHashes,                       // 각 룰 파일의 개별 hash (cascade 추적용)
  llmAssistEnabled,                     // true/false
  llmProvider,                          // anthropic·openai 등
  llmModel,                             // "claude-sonnet-4-6" 등
  promptVersion,                        // LLM 활성화 시
  strictMode                            // true 시 warning도 빌드 차단 — automatedDecision 산출에 영향
)
```

### 8.2 캐시 계층 — 2종 분리

본 Feature의 캐시는 2종으로 분리:

| 캐시 종류 | 목적 | TTL |
|---|---|---|
| **영속 결과 캐시** (durable result cache) | 동일 cacheKey → 영구 동일 결과. idempotency 보장. cacheKey 변경 시 자연 무효화 | 무기한 (cacheKey가 입력 모두 포함하므로 자동 무효화) |
| **운영 TTL 캐시** (operational TTL cache) | 동일 콘텐츠에 짧은 시간 내 반복 호출 시 LLM 비용 절약 | instance 설정 (기본 86400초) |

- **hit/miss 흐름**: 운영 TTL 캐시 hit → 결과 반환. miss → 영속 결과 캐시 조회. 영속 hit → 결과 반환 + TTL 캐시 채움. miss → 전체 실행 + 영속·TTL 모두 저장
- **TTL 만료**: 운영 TTL 캐시만 만료. 영속 결과 캐시는 cacheKey 입력 중 하나가 변경되어야 무효화 (예: 룰 카탈로그 갱신)

### 8.3 idempotency 보장

- 동일 cacheKey → 영속 결과 캐시로 항상 동일 결과
- LLM 결과의 비결정성도 영속 캐시로 안정화 (한 번 산출된 결과 보존)
- 동일 콘텐츠에 동시 호출 시 — 중복 LLM 호출 회피 (request deduplication — § 8.5 또는 CA-06)

### 8.4 강제 재실행 — 룰 카탈로그 변경 처리

본 Feature는 룰 카탈로그 변경 시 콘텐츠를 **즉시 일괄 재호출하지 않음** — 비용·워크플로 정합성 이유. 다음 분리된 흐름으로 처리:

**(a) 영향 published ComplianceRecord에 stale 표시 (RISK_LEVELS § 7.1.3)**:
본 Feature는 룰 카탈로그 변경 이벤트를 수신하면 `staleScope.kind`별로 영향 published record의 `staleFlags.legal=true`를 갱신만 한다:
- `kind="all"` — 전체 published record `staleFlags.legal=true`
- `kind="rule-matched"` — `affectedRuleIds[]`에 매칭된 finding을 보유한 record만 (finding ruleId 역색인 사용)
- `kind="content-type"` — `staleScope.contentTypes[]` 매칭 record만

**(b) 재검수 사이클 진입 (REVIEW_WORKFLOW § 6.2)**:
- staleFlags 갱신 → 콘텐츠 상태 `published → stale → review-queued` 자동 전이
- 어드민 재검수 큐가 새 pre-publish ComplianceRecord(recordVersion 증가) 생성하면서 본 Feature를 호출
- 본 Feature의 `check()` 호출 시 cacheKey 변경(ruleCatalogVersion·ruleFileHashes)으로 자동 miss → 새 결과 산출

**(c) 어드민 "재검수" 액션 — 캐시 무시·강제 실행**: 운영자가 명시 트리거 시 즉시 본 Feature 재호출 (큐 우회).

**(d) 의료법 개정 트리거**: medical-law-tracking.yaml revision 추가 → (a) staleFlags 갱신만 자동 수행. 이후 (b) 어드민 재검수 큐 처리.

---

## 9. 운영 지표 (SLO·관측성)

### 9.1 핵심 지표


 succeeded in 705ms:

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

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "ready_for_v1_0|findings|severity|blocking|major|minor|CM1-|CS1-|AI1-|N1-|cycle" docs -g "*.md"' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n '\"findings\"|\"ready_for_v1_0\"|\"id\"\\s*:\\s*\"[A-Z]+[0-9]+-' . -g \"*.json\" -g \"*.md\"" in C:\Users\assag\solution\website-exposure
 succeeded in 559ms:
docs\compliance\RISK_LEVELS.md:169:    severity: "fail"
docs\compliance\RISK_LEVELS.md:184:    severity: "fail"
docs\compliance\RISK_LEVELS.md:222:**severity·scope·roles**
docs\compliance\RISK_LEVELS.md:225:| `severity` enum 외 값 (`info`·`warning`·`fail`·`content-gate`) | **fail** |
docs\compliance\RISK_LEVELS.md:236:| `severity="content-gate"` + `requiredApproverRoles[]` 누락 | **fail** |
docs\compliance\RISK_LEVELS.md:238:| `severity` ∈ {`info`·`warning`·`fail`} + `requiredApproverRoles[]` 명시 | warning (현재 운영상 무시되지만 향후 정책 변경 대비 — § 3.3.1 참조) |
docs\compliance\RISK_LEVELS.md:281:#### 3.3.1 severity별 `requiredApproverRoles` 처리 정책
docs\compliance\RISK_LEVELS.md:283:| severity | requiredApproverRoles 처리 |
docs\compliance\RISK_LEVELS.md:342:      severity: "warning"                 # 한의 컨텍스트에서 완화 (단순 예시)
docs\compliance\RISK_LEVELS.md:353:   - 스칼라 필드(`severity`·`category`·`pattern`·`logic` 등) — patch 값으로 교체
docs\compliance\RISK_LEVELS.md:393:- 각 룰의 `version` — 룰 단위 SemVer. 패턴·severity·scope 변경 시 MAJOR
docs\compliance\RISK_LEVELS.md:589:  severity: "content-gate",
docs\compliance\RISK_LEVELS.md:664:- 빌드 시 룰 충돌(`id` 중복 또는 동일 패턴 + 다른 severity) 검출 시 fail
docs\compliance\RISK_LEVELS.md:719:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (14개 지적 전건 수용)**: (1) § 2.5 P-105 Reservation 기본 등급 PAGE_TYPES SoT Low로 정정, (2) § 6 explicitRiskLevel 격하 일괄 금지 명시 — DATA_MODEL C-04 ArticleType High 격하 금지와 정합, (3) **DATA_MODEL C-10 cascade — `StaleFlags` 하위 타입 + `priorReviewPassed` 필드 추가**. § 4 만료 정책에서 `staleFlags.medical/legal/operator/client` 일반화 사용, (4) § 4.5 multi-role 분리 — operator 전 콘텐츠 공통 필수(C-10 required) + physicianApprover Medium/High 기본 요구 + `requiredApproverRoles[]` 추가 요구를 모두 AND, (5) § 5.1 includes-effect-claim 카테고리 7종으로 확장 (수치·기간 단정·체질 맞춤 포함), (6) § 5.1 모든 flag를 RiskRule category 기반으로 정밀화 + § 5.1.1 카테고리 SoT cascade 규칙, (7) § 3.3 JSON Schema 검증 항목 완전화 — Simple/Composite 구분·operands·logic·window·ISO date·contextException kind·roles enum·overrides·meta.yaml 검증, (8) § 3.4.2 overrides 머지 규칙 + § 3.4.1 meta.yaml 구조 명세 (RL-02 해소), (9) § 3.3.1 severity별 requiredApproverRoles 처리 정책 — content-gate만 필수 명시, (10) § 4.2 legal 통과 조건에 `priorReviewRequired`·`priorReviewSubmissionId`·`priorReviewPassed` 연계 + 발행 차단 조건 명시, (11) § 7.1 의료법 개정 추적 데이터 모델 신설 — revisionId·시행일·sourceUrl·checkedAt/By·affectedRuleIds·staleScope, (12) § 6.1 High 가상 finding 본 문서에 동기화 SoT + § 6.2 ArticleType override 표, (13) § 5.1.2 페이지 컨텍스트별 false-positive 완화 — P-013·P-014·P-104 notice 제외 규칙. inlineRiskFlags 출력은 보존(감사용), (14) § 4.1·§ 4.2 만료 정책 확장 — 가격·ReviewPolicy·전후사진 미디어·법무 의견서 만료·근거 링크 만료 이벤트 추가 |
docs\features\asset-ingestion.md:184:// 결과 ComplianceCheckResult는 findings[]·findingsBySeverity·automatedDecision 포함
docs\features\asset-ingestion.md:190://   - inferredRiskLevel은 finding severity 기반 보수적 산정 (Medium 기본)
docs\features\asset-ingestion.md:194:- **AssetTag 변환**: result.findings[]의 category·ruleId를 AssetTag.tagKind=`compliance-finding`로 저장
docs\features\asset-ingestion.md:195:- **RiskLevel 추정**: result.findings 중 severity="content-gate" 또는 "fail" 존재 시 AssetTag.tagKind=`riskLevel` value=`High` (보수적). 정식 RiskLevel은 promote 시점에 결정
docs\features\asset-ingestion.md:196:- **inlineRiskFlags**: result.findings[] metadata에서 추출하여 별도 AssetTag로 저장
docs\features\asset-ingestion.md:465:| 수집 cycle 성공율 | envelopeState="completed" / 전체 | > 99% |
docs\features\asset-ingestion.md:466:| 자산 수집 건수 | per source per cycle | baseline |
docs\features\asset-ingestion.md:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
docs\features\compliance-assistant.md:135:  findingsBySeverity: {
docs\features\compliance-assistant.md:142:  findings: Finding[];
docs\features\compliance-assistant.md:157:- **`contentType="Feature"` 예외** (`features/asset-ingestion.md` AI3-10·AI4-10 cascade): `featureContentType="feature:asset-ingestion"` 인 raw asset check 호출 시 — pageTypeId·articleType 미지정 허용. feature-scoped + global rules만 적용 (pageType-specific rules 적용 안 함). inferredRiskLevel은 finding severity 기반 보수적 산정 (content-gate/fail 1+ 시 Medium·High)
docs\features\compliance-assistant.md:208:   d. Finding[]은 **각 매칭 모두 보존** — 낮은 severity finding도 제거하지 않음 (감사 추적용)
docs\features\compliance-assistant.md:218:   - `severity: "content-gate"`
docs\features\compliance-assistant.md:222:8. severity 집계 → ComplianceCheckResult 산출:
docs\features\compliance-assistant.md:223:   - `findingsBySeverity` 카운트 (각 severity 그대로 보존)
docs\features\compliance-assistant.md:224:   - `buildBlocked` = findings 중 fail 1+ 존재
docs\features\compliance-assistant.md:225:   - `gateRequired` = findings 중 content-gate 1+ 존재
docs\features\compliance-assistant.md:226:   - `hasWarnings` = findings 중 warning 1+ 존재
docs\features\compliance-assistant.md:237:  // ... 기존 필드 (ruleId·category·pattern·severity·location·suggestion·requiredApproverRoles)
docs\features\compliance-assistant.md:266:4. severity·requiredApproverRoles·suggestion은 CompositeRiskRule 정의 따름
docs\features\compliance-assistant.md:319:- 정적 룰 검수 결과 (findings[])
docs\features\compliance-assistant.md:324:3. severity 제안 (info | warning | fail | content-gate)
docs\features\compliance-assistant.md:369:- 검수자가 명시 수락한 LLM finding — ComplianceCheckResult.findings[]에 정상 Finding으로 누적 (triggeredBy="llm-assist") + audit log에 수락 액션 기록 (actor·timestamp·메모)
docs\features\compliance-assistant.md:610:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (7개 지적 전건 수용)**: (1) § 3.1 inferredRiskLevel 입력 주석을 "호환 입력 — 내부 재계산" 정합, (2) § 7.1 meta.yaml 우선 로드 정정 (§ 4.1과 일치), (3) § 4.1 High 가상 finding 단독 구현 정보 완전화 — ruleId·severity·requiredApproverRoles override 명시, (4) § 5.4.1 LLM ruleId 충돌 회피 — seq 순번 추가, (5) § 6.2 inlineRiskFlags enum 5종 vs extract category 7종 분리 표현, (6) § 8.1 cacheKey — inferredRiskLevel 제거, slotMatches 포함, (7) **DATA_MODEL C-08 v0.12 cascade** — `complianceAssistantExemptApproval` 필드 신설 (CA-10 해소) |
docs\features\compliance-assistant.md:612:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (18개 지적 전건 수용)**: (1) **DATA_MODEL C-08 features[] 필드명 정합 + `config` cascade**(v0.10) — activeFeatures[] → features[]. CA-02 해소, (2) Feature 메타 specVersion 0.1 명시 (문서 상태와 분리), (3) LLM 의존성 — anthropic 권장 default + provider 옵션 명시, (4) § 3.3 단일 엔트리포인트 `check()` 명시 — RiskInference는 내부 자동, (5)·(7) § 4.1 실행 순서 재정렬 — RiskRule 매칭 후 inlineRiskFlags 추출. Finding[]은 모든 매칭 보존(우선순위는 집계만 흡수), (6) 룰 카탈로그 로드 파일 6개로 통일, (8) § 4.6 Finding 메타 확장 — `triggeredBy`·`llmAssistMeta` cascade (CONTENT_STANDARDS § 7.2 v1.3), (9) § 4.3 KSS v3+ 채택 명시 + UTF-16 offset (CA-03 해소), (10) § 4.4 contextExceptions 평가 알고리즘 강화 — patternType별 평가 + 같은 문장 내 적용, (11) § 5.4.1 LLM additionalFindings 채움 규약 — synthetic ruleId·offset 산정 실패 처리, (12) § 5.5 LLM 결과 저장 슬롯 — `ComplianceRecord.autoCheckResult.llmAssist`(CA-08 신설) + 검수자 수락 시 findings[]에 누적, (13)·(14) § 8.1·§ 8.2 cacheKey 완전화 + 영속 결과 캐시 vs 운영 TTL 캐시 2종 분리, (15) § 8.4 룰 카탈로그 변경 시 staleScope.kind별 분기 처리 + finding ruleId 역색인, (16) § 9.1 운영 지표 precision/recall 보조 지표로 명확화 (CA-09 ground truth 미결정), (17) § 11 빌드 검증 룰에서 운영 지표 항목 제거 — § 9 알림 영역으로 분리, (18) § 10.3 비활성화 시 REVIEW_WORKFLOW publishable 영향 + § 10.3.1 강제 활성 정책 명시 |
docs\core\DATA_MODEL.md:710:| `legalApproved` | boolean | ✅ | **DPA(Data Processing Agreement) 체결 완료** — true 필수 (CS1-12) |
docs\core\DATA_MODEL.md:713:| `dpaEvidenceRef` | string | ✅ | DPA 계약 증빙 secretRef. **`patientConsentEvidenceRef`와 분리** (CS1-12) — DPA는 provider·기관 계약 증빙. 환자 단위 동의 증빙은 별도 (v1.0은 record-level 미저장 — CS-07 후속) |
docs\core\DATA_MODEL.md:800:| `findingId` | `string` | ✅ | ComplianceCheckResult.findings[].ruleId 참조 |
docs\core\DATA_MODEL.md:1086:| 2026-05-14 | v0.13 | **`features/notifications.md` cascade (1차+3차 사이클 통합)**: (1) **C-08 확장** — `adminBaseUrl`(URL, notifications 활성 시 required) + `timezone`(IANATimezone, notifications·SLA 활성 시 required) + `notificationChannels`를 `NotificationChannelsConfig`로 확장(email transport·secretRef·sender·rateLimit / slack webhookUrlSecretRef·rateLimit / inApp) + **`holidayCalendar`(region·source — 3차 cycle N3-13)**, (2) **C-23 `AdminUser` 신설** — 어드민 사용자·자격·알림 선호 SoT. `id`·`email`·`role`(AdminUserRole)·`approverRoleEligibility[]`·`eligibilityEvidence[]`·`slackUserId`·`timezone`(quietHours 한정 — 3차 cycle N3-20)·`notificationPreferences`(channels·digestOptOut·quietHours·**suppression with autoReleaseAt** — 3차 cycle N3-15)·`instanceMemberships[]`·`active`, (3) **`IANATimezone` 공통 타입 표기** (IANA Time Zone Database 식별자), (4) 인벤토리 22개 → 23개 |
docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:147:  - canonical RiskRule: `guarantee-composite-001` (CompositeRiskRule, severity=fail)
docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:233:| 단계 | RiskRule (예시 ID) | severity | requiredApproverRoles | 적용 조건 |
docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:608:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (9개 지적 전건 수용)**: (1) § 3.2 — 시행령 제23조제1항제2호의 **3유형 묶음** 명시 (치료경험담·6개월 이하 임상경력·치료효과 단정). RiskRule.id 별도 추적, (2) § 2.4 "1:1 대응" 표현 완화 — "대체로 대응하나 일부 시행령 호는 의미 확장·혼합". 시행령 제2호 묶음 예시 명시, (3) § 2.2 14호 + § 3.14 — **추천 표시는 예외 아님** 명확화 (가~라목 예외는 인증·보증 표시만), (4) § 3.14 다목 "자격" 제거 — 자격은 제9호 별도 축, (5) § 3.12 외국인환자 — `severity: content-gate` + `requiredApproverRoles: ["legal"]` 명시 + ComplianceRecord 기록 경로, (6) § 4.2 자사 웹사이트 사전심의 — `priorReviewRequired`·`legalCounsel`·`attachments[]` 운영 감사 추적 경로 명시, (7) § 5.2 P-101 — **차단 기준 우선** 명시 (치료 효과 오인은 검수로 치유 안 됨). CONTENT_STANDARDS § 4.3 본문 직접 인용 원칙 정합, (8) § 6.2 전후사진 — **2축 적법성** 분리 (의료광고법 + 환자 개인정보·초상권). 동의서 보유=발행 가능 오해 회피, (9) § 8.3 law.go.kr — 의료법 본문 한정 → 시행령·시행규칙·관련 법령 포함으로 확장 |
docs\core\CONTENT_STANDARDS.md:338:RiskLevel(축 1)과 룰 severity(축 2)는 **별도 축**이며 본 표는 ArticleType의 **기본 위험도**를 정의한다. 본문 표현은 § 4.1 룰로 별도 평가된다. 위험도 High = 어드민 검수 큐 강제 진입(자동 content-gate 검수 트리거).
docs\core\CONTENT_STANDARDS.md:410:  severity: "content-gate",
docs\core\CONTENT_STANDARDS.md:418:- 결과적으로 `gateRequired=true` + `findingsBySeverity["content-gate"] += 1`
docs\core\CONTENT_STANDARDS.md:432:ComplianceRecord(C-10) 인간 검수 기록 4개 슬롯에 매핑된다 — `findingsBySeverity["content-gate"]` 처리 시 어드민 워크플로가 본 매핑을 사용:
docs\core\CONTENT_STANDARDS.md:451:  buildBlocked: boolean;        // findings 중 severity="fail" 1개 이상 시 true → CI 빌드 차단
docs\core\CONTENT_STANDARDS.md:452:  gateRequired: boolean;        // findings 중 severity="content-gate" 1개 이상 시 true → 어드민 검수 큐 진입
docs\core\CONTENT_STANDARDS.md:453:  hasWarnings: boolean;          // findings 중 severity="warning" 1개 이상 시 true → 어드민 경고 큐 진입
docs\core\CONTENT_STANDARDS.md:454:  // severity별 집계 — 키는 severity enum 값과 동일 ("content-gate" 그대로 사용)
docs\core\CONTENT_STANDARDS.md:455:  findingsBySeverity: {
docs\core\CONTENT_STANDARDS.md:463:  // 상세 findings
docs\core\CONTENT_STANDARDS.md:464:  findings: Finding[];
docs\core\CONTENT_STANDARDS.md:468:// - findings에 severity="fail" 1개 이상 → "block"
docs\core\CONTENT_STANDARDS.md:469:// - 위 아닌 경우 severity="content-gate" 1개 이상 → "gate"
docs\core\CONTENT_STANDARDS.md:470:// - 위 아닌 경우 severity="warning" 1개 이상 → "warn"
docs\core\CONTENT_STANDARDS.md:484:  severity: "info" | "warning" | "fail" | "content-gate";
docs\core\CONTENT_STANDARDS.md:512:  severity: "info" | "warning" | "fail" | "content-gate";
docs\core\CONTENT_STANDARDS.md:514:  requiredApproverRoles?: ApproverRole[];  // severity="content-gate" 시 1개 이상 필수 (배열 — § 7.1.3과 정합)
docs\core\CONTENT_STANDARDS.md:536:  severity: "info" | "warning" | "fail" | "content-gate";  // 4종 모두 허용
docs\core\CONTENT_STANDARDS.md:575:- pageType 룰과 articleType 룰이 모두 적용되는 경우 — 더 높은 severity 우선
docs\core\CONTENT_STANDARDS.md:577:#### 7.4.2 severity 우선순위
docs\core\CONTENT_STANDARDS.md:579:같은 텍스트 위치가 여러 룰에 매칭되는 경우 다음 우선순위로 최종 severity 결정 (높은 등급이 낮은 등급을 흡수):
docs\core\CONTENT_STANDARDS.md:585:- 예: "100% 효과"는 `supremacy-001`(단독 어휘 content-gate)과 `guarantee-002`(효과 결합 fail)에 동시 매칭 → 최종 severity는 fail
docs\core\CONTENT_STANDARDS.md:592:- CompositeRiskRule의 `severity`는 4종(`info`/`warning`/`fail`/`content-gate`) 모두 허용 — § 4.1의 결합 의미 룰은 일반적으로 fail이나, 운영 정책에 따라 content-gate composite도 가능
docs\core\CONTENT_STANDARDS.md:640:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1) § 0 SoT 참조 § 5→§ 4 정정, (2) § 1.3 본문 길이 산정 기준 "1,000자(공백 제외)" + Markdown 정규화 알고리즘 명시 → CS-A 미결정 신설, (3) § 3.1 Q&A 렌더링(HTML `<dl>`)과 JSON-LD FAQPage schema 책임 분리, (4) § 3.1 Q&A 룰 fail/content-gate 분리 적용 (§ 4.1 직접 참조), (5)·(6) § 4.1 보장 표현 통합 fail + 수치/기간 단정(보장어 미포함) content-gate 분리, 유인성 표현(시간·수량 압박)과 할인·이벤트 사실 안내(법무 판정 영역) 분리, (7) § 4.2 "100% 효과" 대체 표현 — 효과 진술을 인용·통계 출처 동반으로만 한정 (치료경험담 위험 제거), (8) § 4.3·§ 5.6 환자 후기 — 의료법 제56조 직접 인용, 사전심의(제57조) 단정 표현 제거, 매체·방식별 법무 판정 명시, (9) § 4.3·§ 5.6 전후사진 — ReviewPolicy.beforeAfterPhotoAllowed 의미를 "법무 승인 후 예외적 허용 플래그"로 명확화, 승인자·일자 필수 기록 (CS-B 신설), (10) § 7.1 ContentType을 DATA_MODEL C-10 ComplianceRecord.contentType과 동일 enum 명시, (11) § 7.2 ComplianceCheckResult 인터페이스 확장 — buildBlocked/gateRequired/publishable/requiredApproverRole 분리, (12) § 7.4 RiskRule 스키마 신설 (id/category/pattern/patternType/severity/scope/requiredApproverRole/suggestion/rationale/exceptions/version) + ContentScope 5종 + CS-01 해소 |
docs\core\CONTENT_STANDARDS.md:645:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (12개 지적 전건 수용)**: (A) § 7.1 `featureContentType` 별도 필드 도입 — C-10 enum은 `Feature` 토큰 1개만 cascade 추가, 실제 구분은 namespace 필드로. (B) § 7.1.1 Feature 예시를 P-106 self-test로 정정 — P-105 ReservationPage는 Core C-20임을 명시. slug kebab-case 정규식(`^[a-z][a-z0-9-]*[a-z0-9]$`) 확정. (C) § 7.2 `findingsBySeverity` 키를 severity enum과 동일(`"content-gate"`)로 통일. (D) ApproverRole enum에 `client` 포함. (E) `requiredApproverRole` → `requiredApproverRoles: ApproverRole[]` 배열로. `review-case`는 `["medical", "legal"]` 기본값. 어드민 워크플로는 AND 조건으로 발행 게이트. (F) CompositeRiskRule `logic` enum 정밀화 — `AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR` 3종. (G) § 7.4.3 composite severity 4종 모두 허용으로 운영 규칙 정정. (H) ContentScope에 `featureContentType` 검증 흐름 (Feature contentType 입력 시) — 추후 검증기 구현. (9) § 3.5 인용 면제는 § 3.5 content-gate에만 적용 — § 4.1 fail 룰은 절대 완화 안 됨 명시. (10) § 4.3 가격·할인·이벤트 — P-102·P-104·P-010(`articleType=event-price`) cross-reference 명시. (11) **DATA_MODEL cascade — C-04 Article.body 권장 길이 "최소 300단어" → "최소 1,000자(공백 제외). CONTENT_STANDARDS § 1.3 SoT"** 정정. (12) § 8 content-gate 정의를 SCHEMA_MAPPING § 7.3과 통일 — schema 출력 승인 게이트 포함 |
docs\core\CONTENT_STANDARDS.md:647:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (8개 지적 전건 수용)**: (A) § 5.7 P-102 룰 일관화 — 압박형 유인 표현 fail / 단순 할인·이벤트 사실 안내 content-gate, (B) § 4.1 전문성 단정 룰 분리 — 단독 어휘는 content-gate / 효과·결과·보장 결합은 fail. § 7.4.2 severity 우선순위 (fail > content-gate > warning > info) + § 7.4.3 문맥 결합 룰(composite) 신설, (C) § 4.3 전후사진 법무 승인 기록 — ReviewPolicy 별도 필드 대신 ComplianceRecord(C-10) 단일 SoT 책임 이관 (CS-B 해소), (D) § 6 ArticleType 표 — RiskLevel과 룰 severity 별도 축 명시. High = 어드민 검수 큐 강제 진입 트리거, (E) § 6 review-case "사전심의 대상" 단정 제거 — 의료법 제56조 + 매체·방식별 법무 판정 (§ 4.3·§ 5.6 정합), (F) § 7.2 ComplianceCheckResult — `publishable` 제거. 자동 검수는 `automatedDecision`(block/gate/warn/pass)·buildBlocked·gateRequired·hasWarnings·findingsBySeverity까지만 책임. 최종 발행 가능 여부는 어드민 워크플로 + ComplianceRecord(C-10) 결합 판정, (G) § 7.2 warning 검토 큐 표현 — hasWarnings·findingsBySeverity 추가, (H) § 7.1 contentType enum에 SelfTest 등 Feature-backed 콘텐츠 cascade 필요성 명시 (CS-C 신설) |
docs\features\analytics-reporting.md:689:매일 측정 cycle:
docs\admin\REVIEW_WORKFLOW.md:478:  // `features/analytics-reporting.md` 1차 cycle cascade (F-2)
docs\admin\REVIEW_WORKFLOW.md:482:  // `features/search-visibility.md` 1차 cycle cascade (F-1)
docs\admin\REVIEW_WORKFLOW.md:483:  | "search-visibility-anomaly-critical"     // critical severity anomaly
docs\admin\REVIEW_WORKFLOW.md:484:  | "search-visibility-anomaly-warning"      // warning severity anomaly
docs\admin\REVIEW_WORKFLOW.md:485:  | "search-visibility-monitoring-failed"    // 모니터링 cycle 실패 (모든 source)
docs\admin\REVIEW_WORKFLOW.md:488:  // `features/keyword-monitoring.md` 1차 cycle cascade (F-1)
docs\admin\REVIEW_WORKFLOW.md:496:  | "keyword-monitoring-monitoring-failed"    // 모니터링 cycle 실패
docs\admin\REVIEW_WORKFLOW.md:497:  // `features/asset-ingestion.md` 1차 cycle cascade (F-2)
docs\admin\REVIEW_WORKFLOW.md:503:  // `features/crm-sync.md` 1차 cycle cascade (CS1-01)
docs\admin\REVIEW_WORKFLOW.md:504:  | "crm-sync-batch-failed"                   // sync cycle 실패
docs\admin\REVIEW_WORKFLOW.md:531:| `search-visibility-monitoring-failed` | 모니터링 cycle 실패 (전 source) | operator | email + inApp | inApp | — | high | respect | mandatory |
docs\admin\REVIEW_WORKFLOW.md:541:| `keyword-monitoring-monitoring-failed` | 키워드 모니터링 cycle 실패 | operator | email + inApp | inApp | — | high | respect | mandatory |
docs\admin\REVIEW_WORKFLOW.md:657:  // `features/keyword-monitoring.md` 1차 cycle cascade (F-15)
docs\admin\REVIEW_WORKFLOW.md:663:  // `features/asset-ingestion.md` 1차 cycle cascade (F-4)
docs\admin\REVIEW_WORKFLOW.md:669:  // `features/crm-sync.md` 1차 cycle cascade (CS1-01·16)
docs\admin\REVIEW_WORKFLOW.md:674:  // `features/crm-sync.md` 3차 cycle cascade (CS3-11)
docs\features\content-migration.md:12:> - 검수 워크플로 → REVIEW_WORKFLOW § 8 (re-evaluation 시 ComplianceRecord 새 lifecycle 진입)
docs\features\content-migration.md:51:- 재평가 워크플로 → REVIEW_WORKFLOW § 8 (lifecycle 진입)
docs\features\content-migration.md:65:- 운영자 검수 큐·상태 머신 → REVIEW_WORKFLOW (재평가 시 신규 ComplianceRecord lifecycle 진입)
docs\features\content-migration.md:242:4. legal 게이트 요구 시 approvePlanLegalGate(planId) — ComplianceRecord 별도 lifecycle (REVIEW_WORKFLOW § 8)
docs\features\crm-sync.md:3:> **상태**: **v1.0 (안정판)** — codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정. blocking 0·major 0·minor 1(차단 외)
docs\features\crm-sync.md:199:| 실행 | `runSync(input: RunSyncInput): RunSyncResult` | sync cycle | operator·super-admin | 허용 | direction="outbound"만. inbound/both → runtime fail |
docs\features\crm-sync.md:775:cadence: 10분. 매 cycle:
docs\features\crm-sync.md:801:-- 후속 (별도 cycle): 운영자 검토 후 또는 일정 지연 후 grace-expired → revoked로 정리
docs\features\crm-sync.md:805:실패 시: sink alert + 다음 cycle 재시도. 3회 실패 → super-admin alert + integration manual review 큐.
docs\features\crm-sync.md:1073:- failure → sink alert + 다음 cycle 재시도
docs\features\crm-sync.md:1076:- v0.4 → v0.5 운영 데이터 부재 전제. existing row 0건 cycle
docs\features\crm-sync.md:1222:  - failure → sink alert + 다음 cycle 재시도
docs\features\crm-sync.md:1292:| 2026-05-14 | **v1.0** | **codex 자동 비평 7차 사이클 후 `ready_for_v1_0=true` 확정 — v1.0 안정판 도달**. 7 cycle 누계 지적 71건 (21+17+17+13+6+1+0) 전건 수용. blocking 0·major 0·minor 1(차단 외 — CS7-01 revoked_at column 의미는 CS-22 처리 시 검토). SoT cascade 동기화 완료: REVIEW_WORKFLOW (4종 NotificationEventType + 7종 AuditAction), DATA_MODEL v0.20 (genericRestApiAdapter 5필드 + versionTokenType). 의료법·개인정보보호법 운영 가능 |
docs\features\keyword-monitoring.md:37:  - **매칭 키**: (instanceId, query 또는 page, date, severity 기준) — search-visibility AnomalyRecord 검색
docs\features\keyword-monitoring.md:38:  - **다건 매칭 시**: 최신 detectedAt + 가장 높은 severity 우선 (critical > warning > info)
docs\features\keyword-monitoring.md:195:| 실행 command | `runMonitoring(input)` | 모니터링 cycle |
docs\features\keyword-monitoring.md:200:| 운영 command | `enqueueOutboxForExistingAnomalies(window, severity, dryRun)` | retroactive enqueue. **권한: super-admin 전용**. audit `keyword-monitoring-retroactive-enqueue-requested` (§ 3.1.1) |
docs\features\keyword-monitoring.md:209:| `keyword-monitoring-retroactive-enqueue-requested` | `"instance:" + instanceId` (synthetic — search-visibility § 7.5 패턴 동일) | windowStart·windowEnd·severity·dryRun·matchedCount·enqueuedCount·retroactiveBatchId·actorRole="super-admin" |
docs\features\keyword-monitoring.md:264:    severity: "info" | "warning" | "critical";
docs\features\keyword-monitoring.md:298:  - `"first-observed"` (기본): baseline=0 + observed ≥ `firstObservedSpikeThresholdImpressions`(기본 100) → `direction="first-observed-spike"` (severity=info). deltaPercentage=null
docs\features\keyword-monitoring.md:308:  - observedCtr > baselineCtr + threshold → `ctr-up` (severity=info)
docs\features\keyword-monitoring.md:309:  - observedCtr < baselineCtr - threshold → `ctr-down` (severity=warning)
docs\features\keyword-monitoring.md:313:- `queryKeywordSignals` 응답의 `anomaliesInWindow[]`에 `direction="ctr-up"` anomaly도 포함 (severity=info)
docs\features\keyword-monitoring.md:315:- 운영자 filter: `severity=info AND signal=keywordCTR AND direction=ctr-up` 별도 필터 권장
docs\features\keyword-monitoring.md:390:> **anomalySeverity vs notificationCriticality 분리** (F-8): anomalySeverity는 AnomalyRecord 내부 severity (info·warning·critical). notificationCriticality는 NotificationEvent.criticality (normal·high·critical — notifications.md SoT). monitoring-failed는 anomaly 없음 — operationalSeverity로 분류
docs\features\keyword-monitoring.md:403:- `transitionDate`는 **logical date** (해당 cycle의 windowEnd ISO date, 실행 wall-clock 아님) — KMF3-02 deterministic 보장
docs\features\keyword-monitoring.md:408:1. **try advisory lock** acquire (hash(keywordTargetId, "rank-bucket")) — non-blocking
docs\features\keyword-monitoring.md:431:| `keyword-monitoring-monitoring-failed` | `"instance:" + instanceId` (synthetic) | `"키워드 모니터링 cycle 실패 (${date})"` | monitoringLogId·failedSources[]·detectedAt |
docs\features\keyword-monitoring.md:451:| keywordRank | **anomaly suppression ledger** | key=hash(instanceId+signal+keywordTargetId+severity+keywordMonitoringPolicyVersion) |
docs\features\keyword-monitoring.md:458:- severity escalation (warning → critical)은 별도 anomaly로 처리 (key에 severity 포함)
docs\features\keyword-monitoring.md:714:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4 minor 지적 전건 수용)**: (1) § 1.2 "4종" 잔재 → "5종" 정정 (KMF5-01), (2) § 3.1.1 audit log contract 표에 `keyword-tracking-target-migrated-v02-v03` 행 추가 (KMF5-02), (3) **decompositions[] 1:1 lossless 매핑** — `toTargets: Array<{targetId, searchEngine, inheritedOriginalId, activeAfter}>` 구조 변경 (KMF5-03), (4) **§ 11.3·§ 11.4 분류·용어 정정** — migration-time fail 명칭·outbox claimedAt vs retry queue lockedAt 분리 (KMF5-04): (1) **KeywordAnomalyNotificationOutbox sourceKind enum 정정** — `rank-bucket-state` → `rank-bucket-transition`. sourceId 타입 `UUID` → `string` (sourceKind별 typed) (KMF4-01), (2) **migration audit metadata decompositions[] 구조** — lossless 표현 (KMF4-02), (3) **AuditAction 4종 → 5종** 표기 정정 (KMF4-03), (4) **rank-bucket transition try advisory lock + idempotent no-op** semantics 명시 (KMF4-04), (5) **§ 11.4 runtime invariant·reconcile 분리** (§ 11.2와 별도) (KMF4-05), (6) **§ 1.1 migration-time validation·runtime invariant SemVer policy 추가** (KMF4-06): (1) **REVIEW_WORKFLOW § 10.2.1 cascade — `keyword-tracking-target-migrated-v02-v03` AuditAction 추가** + § 10.3 audit contract metadata shape 명시. KM-16 v1.0 cascade 완료 (KMF3-01), (2) **rank-bucket transition 원자성·deterministic transitionEventId** — logical transitionDate(windowEnd) 사용·advisory lock + compare-and-set + UNIQUE 3중 보호 (KMF3-02), (3) **reactivate 동시성 정책** — advisory lock + deterministic order(registeredAt DESC, id ASC). § 11.2 runtime fail 문구 정정 (KMF3-03), (4) **ctr-up read API notify=false contract** — queryKeywordSignals.anomaliesInWindow에 notify boolean·notificationSuppressionReason enum (KMF3-04), (5) **cross-Feature transaction boundary** — correlatedSearchVisibilityAnomalyId READ COMMITTED 별도 transaction (KMF3-05), (6) **canonical 검색엔진 enum SoT + cross-Feature build validation** — 3개 집합(KeywordTrackingTarget.searchEngine·SEARCH_ENGINE_TO_ANALYTICS_SOURCE·SerpCrawlerApprovedScope.searchEngines) drift 검증 (KMF3-06), (7) **§ 11 build/runtime/migration 3분리** — § 11.3 migration-time validation 신설 (KMF3-07): (1) **DATA_MODEL C-08 KeywordMonitoringConfig.serpCrawler v1.0 build fail** 정정 — enabled=true 자체로 fail (legalApproved 무관) (KM2-01), (2) **soft delete + partial unique** — `WHERE active=true` (PostgreSQL) 또는 generated column. `registerKeyword` 시 inactive 재등록은 reactivate로 처리 (KM2-02), (3) **rank-bucket outbox sourceId=transitionEventId** — 각 transition별 고유 ID로 UNIQUE 차단 회피 (KM2-03), (4) **migration v0.2→v0.3 정책 § 10.3** — targetSearchEngines 배열 분해·queryHash 재계산·FK 승계 (KM2-04), (5) **correlatedSearchVisibilityAnomalyId 매핑 정확화** — insert 직전 1회 lookup·다건 매칭 우선순위·실패 시 null·재시도 없음 (KM2-05), (6) **§ 3.1.1 audit log contract** — register/unregister/resolution-updated/retroactive 4종 contentRef·metadata shape 명시 (KM2-06), (7) **zeroBaselinePolicy enum** — first-observed·hold만 허용 (spike 제거) + build fail 추가 (KM2-07), (8) **ctr-up dashboard 표시 규칙** — queryKeywordSignals.anomaliesInWindow 포함·notify=false 시각 구분 (KM2-08), (9) **SEARCH_ENGINE_TO_ANALYTICS_SOURCE 명시 매핑 테이블** + exhaustive build validation (KM2-09): (1) NotificationEventType 8종 cascade 통일 — REVIEW_WORKFLOW § 9.1·§ 9.1.1 8행 추가 (F-1), (2) **DATA_MODEL C-08 v0.17 cascade** — keywordMonitoringConfig·keywordMonitoringPolicyVersion 신설 + SerpCrawlerApprovedScope 재사용 (F-2), (3) **locale/searchEngine dimension → country/source 매핑** — analytics-reporting QueryDimension 정합 (F-3), (4) device dimension/filter 추가 (F-4), (5) **KeywordTrackingTarget.searchEngine 단일 enum + UNIQUE 정규화** (F-5), (6) **outbox sourceKind/sourceId 일반화** — anomaly·monitoring-log·rank-bucket-state 3종 (F-6), (7) rank-bucket 이벤트 매핑 추가 (F-7), (8) **anomalySeverity vs notificationCriticality 컬럼 분리** (F-8), (9) keywordRank algorithm enum moving-average만 + EWMA는 KM-07 후속 (F-9), (10) **zero baseline·CTR direction·minBaselineDays·minVariance** 정확화 (F-10), (11) signal별 dedupe 주체 표 — ledger vs state machine (F-11), (12) **register/unregister 권한·soft delete·audit cascade** — REVIEW_WORKFLOW § 10.2.1 4종 cascade (F-12·F-15), (13) **serp-crawler v1.0 build fail** — KeywordMonitoringSerpArtifact 결정은 v1.x로 분리 (F-13), (14) **maxKeywordsPerInstance drift alert 분리** (F-14), (15) **§ 13 MonitoringSourceAttempt 중복 제거** (F-16), (16) KM-05·KM-06 재정의 (F-17), (17) **search-visibility 중복 정책 § 0.1 명시** — correlatedSearchVisibilityAnomalyId best-effort (F-18), (18) KM-08~KM-13 해소된 미결정으로 이동 |
docs\features\notifications.md:492:- missed run: ±10분 → 다음 cycle carry-over
docs\features\notifications.md:629:  - **연간 갱신**: 매년 12월 패키지 minor release에 차차년도 공휴일 추가
docs\features\notifications.md:733:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (7개 지적 전건 수용)**: (1) **REVIEW_WORKFLOW § 9.1.1 매트릭스 정정** — `sla-imminent`·`sla-overdue` 즉시 채널을 `email + inApp`으로 변경. fallback=inApp이 immediateChannels 집합 안에 포함되도록 cascade (N5-01), (2) **§ 4.1 1단계 abort 원인 분기 명시** — unique violation만 idempotent path, 그 외 abort는 retryable internal error 반환. § 3.3과 정합 (N5-02), (3) **DeliveryAttemptStatus 별도 정의** — 내부 attempt-level "processing"을 외부 DeliveryStatus와 분리. `DeliveryAttemptStatus = "processing" | DeliveryStatus` 합 타입 (N5-03), (4) **§ 4.1 흐름에 invalid locationRef 분기 추가** — businessHours 평가 직전 (f-pre)에 `skipped-missing-location` 명시. critical 이벤트도 본 분기는 우회하지 않음 (N5-04), (5) **MySQL generated column unique schema 정정** — `activeKey INT GENERATED AS (CASE WHEN resolvedAt IS NULL THEN 1 ELSE NULL END)` + `UNIQUE(payloadId, failingChannel, activeKey)`. resolved DLQ 이력 다수 허용 (N5-05), (6) **DATA_MODEL C-23 AdminUser.role cascade 정정** — `system` enum 값은 audit log actorRole 표기 전용. C-23 `role` 및 `instanceMemberships[].role`에는 저장 금지 명시 (N5-06), (7) **specVersion 1.0 + 세 버전 의미 차이** — specVersion(명세)·패키지 SemVer·notificationPolicyVersion 구분 한 줄 설명 (N5-07) (1) **트랜잭션 abort 원인 분기** — unique violation만 idempotent path, 그 외 retryable error (N4-01·N4-03), (2) **duplicate caller receiptState별 응답 계약** (N4-02), (3) **DeliveryAttempt advisory lock SoT** — pg_advisory_xact_lock + provider 호출은 lock 밖 (N4-04·N4-06). NT-17, (4) **UNIQUE(payloadId, channel, attemptNumber)** — dedupeMode 제외 (N4-05), (5) **§ 4.1 fallback immediateChannels 제약** 명시 (N4-07), (6) **fallback 실패 두 attempt 기록** + fallbackExhausted 메타 (N4-08), (7) **두 축 분리 정책** — 패키지 SemVer ↔ policyVersion (N4-09), (8) **policyVersion 보관 정책** — 12개월 최소 지원·deprecation·build fail 메시지 (N4-10), (9) **DigestConditionField cascade 규칙** (N4-11), (10) **exists/notExists deep path 평가 규칙** (N4-12), (11) **default policy 유일성 검증** (N4-13), (12) **broadcast PayloadRecord envelope+channel 단위 1건** + broadcast-placeholder는 DB row 아님 + broadcastAttemptId = broadcast DeliveryAttempt.id (N4-14·N4-15·N4-16), (13) **holidayCalendar 갱신·배포 정책** — 연간 minor·임시공휴일 patch·external-api override (N4-17). NT-18, (14) **businessHours 90일 탐색 한계** + failed-permanent (N4-18), (15) **invalid locationRef → `skipped-missing-location`** DeliveryStatus 신규 (N4-19), (16) **운영자 수동 unsuppress command** + REVIEW_WORKFLOW § 10.2.1 `notification-suppression-unsuppressed` cascade (N4-20·N4-21), (17) **soft → hard 전이 정책** (N4-22), (18) **큐 worker 중복 발송 방지 SoT 쿼리** + partial index (N4-23), (19) **inApp 단일 transaction 원자성** (N4-24), (20) **DeadLetterAttempt UNIQUE(attemptId)** — 1 attempt 1 DLQ (N4-25), (21) **MySQL generated column 대체 schema** 구체 명시 (N4-26), (22) **notification-read actorRole = instanceMemberships 현재 instance role** (N4-27), (23) **AdminUserRole `system` 추가** — REVIEW_WORKFLOW § 11.1 cascade (N4-28), (24) **multi-location + main 부재 fail 격상** (N4-29), (25) **NT-16 해소** (N4-30) (20 finding + 3 residual = 23 지적 전건 수용)**: (1) **Receipt-Log 트랜잭션 순서** — 단일 DB 트랜잭션에서 Log insert → Receipt insert. abort 시 양쪽 롤백 (N3-01), (2) **테이블 인벤토리 재산정 — 11 tables + Redis 1** — Receipt·Log·PayloadRecord·DeliveryAttempt·Inbox·DigestBucket·DigestBucketPayload·QuietHoursQueue·BusinessHoursQueue·DeadLetter·**DeadLetterAttempt(신설)** + DedupeCache. `NotificationDelivery` 가상 참조 제거 (N3-02·N3-19), (3) **DeliveryAttempt attemptNumber 동시성** — payloadId+channel 범위 row lock 또는 advisory lock + processing 선점 (N3-03), (4) **PayloadRecord recipient-envelope unit 명확화** — channel 필드 제거, directSentAt/digestSentAt 제거. 채널별 sentAt 추적은 DeliveryAttempt status만 사용 (N3-04), (5) **fallback 채널 매트릭스 SoT** — REVIEW_WORKFLOW § 9.1.1 컬럼 cascade. 임의 활성 채널 라우팅 금지, fallback도 막히면 외부 sink alert만 (N3-05), (6) **dedupe Redis SET NX EX 원자** — 명시 (N3-06), (7) **receipt vs dedupe TTL 관계** — `receiptRetentionDays`(기본 365일) ≫ dedupeWindowSeconds. sourceEventId 재사용 금지 (N3-07), (8) **REVIEW_WORKFLOW § 9.3 cascade** — Slack 2가지 동작 모드·DeliveryResult 소비 규칙 명시 (N3-08), (9) **broadcast envelope 단위 1건** — broadcastAttemptId·sentinel dedupeKey·perRecipient placeholder broadcastAttemptId 참조 (N3-09), (10) **DigestPolicy AST 구조화** — DigestCondition({field, op, value}) + 허용 enum (N3-10), (11) **policyVersion 병렬 보관** — 패키지에 버전별 매트릭스 보관, manifest opt-in, 롤백은 manifest 변경만 (N3-11), (12) **DigestBucketPayload FK 분리** — bucketId CASCADE, payloadId RESTRICT (N3-12), (13) **C-08 holidayCalendar cascade** — region·source. PublicHoliday SoT 정합. CT-02 dayOfWeek enum과 분리 (N3-13), (14) **LocationProfile `@id="main"` 관례 정합** — C-21 SoT 정합 (N3-14), (15) **suppression autoReleaseAt + worker** — § 7.4 1시간 주기. DATA_MODEL C-23 cascade (N3-15), (16) **suppression atomic increment** — DB atomic + compare-and-set threshold 1회 alert (N3-16), (17) **REVIEW_WORKFLOW § 10.2.1 enum cascade** — `notification-resend-attempted`·`notification-read` (N3-17), (18) **DLQ SQL syntax PostgreSQL** — partial unique index 표기 (N3-18), (19) **DATA_MODEL C-23 timezone 설명 정정** — quietHours 한정 (N3-20), (20) **inactive 사용자 historical inbox 정책** — 기본 숨김 + 인스턴스 옵션 (NT-16) (Residual), (21) **cadenceWindow 포맷 명시** — daily `YYYY-MM-DD`, weekly `YYYY-Wnn` (Residual), (22) **instanceMemberships 검증** — recipient AdminUser.instanceMemberships에 본 인스턴스 미포함 시 `skipped-missing-user` (Residual) |
docs\features\search-visibility.md:189:        sitemapSnapshotRefreshPolicy: "per-cycle"          # SV2-05 — per-cycle | weekly | on-publish-event
docs\features\search-visibility.md:225:| 실행 command | `runMonitoring(input)` | 모니터링 cycle |
docs\features\search-visibility.md:228:| 운영 command | `enqueueOutboxForExistingAnomalies(window, severity)` | SV2-14 — mode 변경 후 retroactive enqueue (운영자 명시) |
docs\features\search-visibility.md:290:  - `per-cycle` (기본): 매 monitoring cycle 시작 시 sitemap.xml fetch + hash 비교. 변경 시 universe 갱신
docs\features\search-visibility.md:313:severity:
docs\features\search-visibility.md:331:- 매 cycle SERP 크롤링 후 인용 여부 판정
docs\features\search-visibility.md:336:- 매 cycle 통합 영역 노출 query별 rank 추출 (serp-crawler)
docs\features\search-visibility.md:345:| `unknown` → `bucket:*` (첫 관측) | ✅ severity=info | (없음 — info는 outbox 미enqueue) | ❌ (SV4-04 rationale: query별 baseline initialization 성격이라 알림 제외. 첫 모니터링 cycle 다수 query에서 동시 발생 가능해 알림 noise 회피. 대비 — `ai-briefing-citation-first-detected`는 site-level 비즈니스 이벤트라 매트릭스에서 outbox enqueue) |
docs\features\search-visibility.md:346:| `bucket:a` → `bucket:b` (개선·악화) | ✅ severity=warning (b가 a보다 worse) / info (better) | `search-visibility-anomaly-warning` (worse일 때만) | ✅ (worse일 때) |
docs\features\search-visibility.md:347:| `bucket:*` → `absent` (SERP 결과에서 제거) | ✅ severity=critical | `search-visibility-anomaly-critical` | ✅ |
docs\features\search-visibility.md:348:| `absent` → `bucket:*` (복귀) | ✅ severity=info, direction="restored" | (없음) | ❌ |
docs\features\search-visibility.md:403:### 6.2 평가 cycle — v0.2 § 6.2 유지
docs\features\search-visibility.md:409:- **suppression key**: `hash(instanceId + signal + targetKind + targetId + severity + searchVisibilityPolicyVersion)`
docs\features\search-visibility.md:411:- **severity escalation 의도** (SV4-06): suppression key에 `severity`가 포함되어 동일 target의 warning → critical 상승 시 별도 anomaly 생성. critical 알림이 warning suppression에 막히지 않도록 한 의도된 동작. false-positive resolve(`resolutionStatus="false-positive"`) 후 재발생도 새 anomaly로 생성됨 (open 조건 미충족)
docs\features\search-visibility.md:436:| eventType | severity 매핑 | mode="alerting" | mode="monitor-only" |
docs\features\search-visibility.md:438:| `search-visibility-anomaly-critical` | severity="critical" anomaly | ✅ enqueue | ❌ |
docs\features\search-visibility.md:439:| `search-visibility-anomaly-warning` | severity="warning" anomaly | ✅ enqueue | ❌ |
docs\features\search-visibility.md:441:| `ai-briefing-citation-first-detected` | first-detected state transition | ✅ enqueue (severity=info여도) | ❌ |
docs\features\search-visibility.md:452:| `search-visibility-anomaly-critical`·`-warning` | `anomalyRecordId` | `"${signal} ${severity} — ${targetKind}/${targetDisplay}"` | signal·targetKind·targetId·detectedAt·detectorOutput·streakDays·qualityTier |
docs\features\search-visibility.md:468:- 운영자 명시 액션 `enqueueOutboxForExistingAnomalies(window, severity, dryRun)` (§ 3.1):
docs\features\search-visibility.md:472:- **입력**: `window: {start, end}`·`severity: ("warning"|"critical")[]`·`dryRun: boolean (default true)`
docs\features\search-visibility.md:474:- **dryRun=false**: window 내 AnomalyRecord 중 outbox 미존재(AnomalyNotificationOutbox.anomalyRecordId join 없음) + severity 조건 충족만 enqueue. UNIQUE(anomalyRecordId)로 중복 방지
docs\features\search-visibility.md:482:  - `metadata = { windowStart, windowEnd, severity: ("warning"|"critical")[], dryRun, matchedCount, enqueuedCount, retroactiveBatchId }`
docs\features\search-visibility.md:587:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) SV-13 해소된 미결정으로 이동 (SV5-01), (2) **retroactive audit metadata shape 명시** — contentRef="instance:{instanceId}" synthetic·metadata 필수 필드(windowStart·End·severity·dryRun·matchedCount·enqueuedCount·retroactiveBatchId)·actorRole="super-admin" (SV5-02), (3) **unifiedRankingPresence rank nullability** — previousRank/currentRank를 `number | null`로 변경. absent/restored 전이 시 null 규칙 (SV5-03), (4) **NotificationEvent 필드 매핑 표 복원** — eventType별 contentRef/contentTitle/metadata 명시. monitoring-failed는 synthetic contentRef + sourceEventId fallback (SV5-04), (5) 변경 이력 operations 잔재 → super-admin 전용으로 정정 (SV5-05): (1) **retroactive command 권한 super-admin 전용** — operations role 미존재 정정 (SV4-01), (2) **REVIEW_WORKFLOW § 10.2.1 cascade** — `search-visibility-retroactive-enqueue-requested` AuditAction 추가. SV-13 해소 (SV4-02), (3) **§ 3.3 exposureTrend detectorOutput shape § 4.1과 통일** — score·actualPercentile·thresholdPercentile (SV4-03), (4) **first-detected 정책 rationale** — unifiedRankingPresence는 query baseline initialization, AI briefing은 site-level business event (SV4-04), (5) **sourceEventId hash에서 policyVersion 제거** — 정책 변경 시 재발송 금지 의도. § 13.10 정합 (SV4-05), (6) **severity escalation 의도 명시** — warning → critical 상승은 별도 anomaly (SV4-06), (7) **v1.0 blobStorage.provider="s3"만 build-pass** — GCS/Azure는 SV-06b 후속 (SV4-07): (1) **exposureTrend percentile config 반영 + target aggregation SoT** — score 산식·detectorOutput에 actualPercentile/thresholdPercentile (SV3-01·02), (2) **SerpCrawlerApprovedScope boolean 정정** — allowLoginState/allowCaptchaBypass required=false + default=false (DATA_MODEL cascade·SV3-03), (3) **crawlerArtifact retention 평가 순서** — serpCrawler.enabled=false 시 skip (SV3-04), (4) **SearchVisibilityCollectionRetryQueue worker SoT 쿼리 복제** — analytics-reporting § 4.3 패턴(SKIP LOCKED·advisory lock·envelope 재계산·lock ordering invariant) (SV3-05), (5) **retroactive outbox command contract closure** — super-admin 전용 권한(v0.5에서 좁힘)·dryRun·sourceEventId hash·audit cascade SV-13 (SV3-06), (6) **unifiedRankingPresence state transition table** — 6종 전이별 AnomalyRecord·eventType·notify 매핑 (SV3-07), (7) **anomaly suppression ledger** — exposureTrend·backlinkChange state machine 없는 signal용 (SV3-08), (8) **blob isolation IAM 구체화** — canonical object key format·S3 IAM condition 예시·signed URL refresh SV-14 (SV3-09), (9) **SV-10 해소** + SV-06b 부분 분리 (SV3-10), (10) **SV-13·SV-14 신규** |

2026-05-14T15:12:54.023777Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.6 seconds
Output:

 exited 1 in 579ms:
codex
{
  "schema_version": "critique-v1",
  "cycle": 1,
  "target": "docs/features/content-migration.md",
  "version_reviewed": "v0.1",
  "ready_for_v1_0": false,
  "summary": {
    "blocking": 9,
    "major": 10,
    "minor": 5,
    "overall_assessment": "v0.1은 핵심 방향은 맞지만, SoT cascade가 실제 완료되지 않았고 rollback/dry-run/legal/read-only 경계가 운영 가능한 수준으로 닫혀 있지 않다. 특히 REVIEW_WORKFLOW, DATA_MODEL C-08, compliance-assistant 대량 재평가 계약이 미완이라 v1.0 후보로는 이르다."
  },
  "findings": [
    {
      "id": "CM1-01",
      "severity": "blocking",
      "category": "SoT-cascade",
      "title": "NotificationEventType 4종이 REVIEW_WORKFLOW canonical enum/매트릭스에 실제 반영되지 않았다",
      "evidence": [
        "content-migration.md §5.1은 `content-migration-plan-approved`, `content-migration-run-completed`, `content-migration-run-failed`, `content-migration-rollback-triggered` 4종을 정의한다.",
        "REVIEW_WORKFLOW.md §9.1 및 §9.1.1 canonical SoT에는 content-migration 이벤트가 없다."
      ],
      "impact": "notifications v1.0의 `notify()`는 REVIEW_WORKFLOW §9.1 enum과 §9.1.1 매트릭스를 SoT로 삼으므로, 현재 이벤트는 타입/라우팅/quietHours/fallback/digest 정책이 없는 비정상 이벤트다.",
      "recommendation": "REVIEW_WORKFLOW §9.1 enum과 §9.1.1 매트릭스에 4행을 cascade 완료로 반영하고, content-migration.md에는 `cascade 필요`가 아니라 `cascade 완료` 또는 명시 후속 상태를 일관되게 표기하라."
    },
    {
      "id": "CM1-02",
      "severity": "blocking",
      "category": "SoT-cascade",
      "title": "AuditAction 6종이 REVIEW_WORKFLOW §10.2.1 canonical enum에 없다",
      "evidence": [
        "content-migration.md §3.1.1은 `content-migration-plan-defined` 등 6종 AuditAction을 정의한다.",
        "REVIEW_WORKFLOW.md §10.2.1 canonical AuditAction enum은 content-migration 관련 값을 포함하지 않는다."
      ],
      "impact": "감사 로그 append-only 계약과 타입 검증이 깨진다. 특히 migration plan/apply/rollback은 고위험 운영 행위라 audit 누락은 v1.0 차단 사유다.",
      "recommendation": "REVIEW_WORKFLOW §10.2.1에 6종을 cascade하고, actorRole 권한 및 metadata required shape를 별도 표로 닫아라."
    },
    {
      "id": "CM1-03",
      "severity": "blocking",
      "category": "DATA_MODEL",
      "title": "DATA_MODEL C-08에 `contentMigrationConfig`와 `contentMigrationPolicyVersion`이 실제로 없다",
      "evidence": [
        "content-migration.md §2.2와 §2.3은 C-08 cascade 필요 및 manifest 필드를 전제한다.",
        "DATA_MODEL.md C-08에는 notifications, analytics, search-visibility, keyword-monitoring, asset-ingestion, crm-sync 설정만 있고 content-migration 설정이 없다."
      ],
      "impact": "InstanceManifest validator가 어떤 필드를 필수로 볼지 알 수 없고, build-time fail 규칙도 실행 불가능하다.",
      "recommendation": "DATA_MODEL C-08에 `ContentMigrationConfig` 타입과 `contentMigrationPolicyVersion` top-level 필드를 추가하고, `legalApprovedBy/At`, approvalRequired, read-only, retention, rollback 옵션의 required 여부를 명시하라."
    },
    {
      "id": "CM1-04",
      "severity": "blocking",
      "category": "compliance-assistant",
      "title": "`policy-version-reevaluate`의 compliance-assistant 대량 `check()` 호출 계약이 닫혀 있지 않다",
      "evidence": [
        "content-migration.md §3.2.5는 모든 ComplianceRecord 재평가 시 `check()` 재호출만 말한다.",
        "compliance-assistant.md §3.3은 `check(input)` 단일 엔트리포인트, §8은 cacheKey/durable cache/request deduplication을 정의한다."
      ],
      "impact": "대량 재평가에서 LLM/룰 엔진 호출 폭주, 동일 cacheKey 중복 실행, staleFlags와 새 pre-publish ComplianceRecord 생성 타이밍 불일치가 발생할 수 있다.",
      "recommendation": "`policy-version-reevaluate` 전용 batch contract를 추가하라: 대상 ComplianceRecord selection, cacheKey dedupe, concurrency/rate limit, durable cache hit 처리, `sourceEventId`, 새 ComplianceRecord(recordVersion 증가) 생성 또는 staleFlags-only 모드 분기."
    },
    {
      "id": "CM1-05",
      "severity": "blocking",
      "category": "scope-boundary",
      "title": "`schema-version-upgrade`가 DB DDL 책임과 충돌한다",
      "evidence": [
        "content-migration.md §1.3은 PostgreSQL DDL/schema change는 infra 책임이라고 한다.",
        "content-migration.md §3.2.1은 DATA_MODEL 버전 업그레이드 시 `column rename`을 예시로 든다."
      ],
      "impact": "application-level data migration과 DB schema migration의 소유권이 뒤섞인다. 실제 운영에서 DDL 배포 순서, app compatibility window, rollback 책임이 불명확해진다.",
      "recommendation": "`schema-version-upgrade`를 `application-data-version-upgrade`로 좁히거나, DDL은 precondition으로만 참조하라. 예: column 존재/nullable/default 검증은 읽기만 하고 DDL 실행은 금지."
    },
    {
      "id": "CM1-06",
      "severity": "blocking",
      "category": "rollback",
      "title": "reverse-step이 선택 필드라 rollback 가능성 필수 요구와 모순된다",
      "evidence": [
        "content-migration.md §0은 rollback 가능성 필수를 전제하지만 §3.3 `reverseStep?`는 optional이다.",
        "§4.2는 reverse-step 없는 step을 skip + alert로 처리한다."
      ],
      "impact": "고위험 apply가 사실상 되돌릴 수 없는 상태로 실행될 수 있다. 운영자 승인만으로 skip하면 데이터 정합성과 감사 추적을 복구할 수 없다.",
      "recommendation": "v1.0에서는 step별 `rollbackClass = reversible | compensating | irreversible`를 강제하고, irreversible step은 dry-run/apply 모두 별도 legal/super-admin 승인 + blast radius cap + backup/snapshot precondition을 요구하라."
    },
    {
      "id": "CM1-07",
      "severity": "blocking",
      "category": "dry-run",
      "title": "`expectedDryRunReportId`만으로 dry-run/apply drift를 막기 어렵다",
      "evidence": [
        "content-migration.md §3.3 `RunApplyInput`은 `expectedDryRunReportId`만 CAS로 둔다.",
        "§4.1 apply는 dry-run 이후 read-only window를 적용한다고만 한다."
      ],
      "impact": "dry-run 후 대상 row, source instance, policyVersion, step registry, plan body, content hash가 바뀌어도 report id만 맞으면 apply가 진행될 수 있다.",
      "recommendation": "DryRunReport에 `planFingerprint`, `targetSetDigest`, `sourceSnapshotWatermark`, `policyVersionSnapshot`, `stepRegistryVersion`, `contentHashDigest`를 저장하고 apply CAS가 전부 일치해야 진행되도록 하라."
    },
    {
      "id": "CM1-08",
      "severity": "blocking",
      "category": "legal-gate",
      "title": "legal 게이트 적용 대상이 PII 이동에만 좁게 잡혀 있다",
      "evidence": [
        "content-migration.md §2.3은 `instanceToInstanceCopy`만 legal-reviewer를 요구한다.",
        "§3.2.3도 PII 이동 시 legal 승인만 언급한다."
      ],
      "impact": "의료광고 정책 재평가, LegalDocument/ReviewPolicy/PricingPage 일괄 변환, 전후사진/후기 이동, priorReviewRequired 판정 변경 같은 법무 영향 migration이 legal gate 없이 실행될 수 있다.",
      "recommendation": "planKind 고정이 아니라 `legalImpactClassifier`를 두라. PII, LegalDocument, ReviewPolicy, PricingPage, before/after media, testimonial/review, priorReviewRequired 변경, cross-entity copy는 legal gate를 강제해야 한다."
    },
    {
      "id": "CM1-09",
      "severity": "blocking",
      "category": "operational-safety",
      "title": "read-only window가 모든 admin write 차단이라고만 되어 다른 Feature 영향이 정의되지 않았다",
      "evidence": [
        "content-migration.md §4.3은 instance의 모든 admin write 차단을 명시한다.",
        "notifications, compliance-assistant, asset-ingestion promote, crm-sync conflict resolution 등 admin DB write가 필요한 Feature와의 예외/큐잉 정책이 없다."
      ],
      "impact": "read-only 중 알림 읽음 처리, 검수 큐 상태 전이, asset promote, crm sync conflict resolution, ComplianceRecord stale 갱신이 실패하거나 교착될 수 있다.",
      "recommendation": "write class를 `content-mutating`, `workflow-state`, `notification-operational`, `audit-append`, `feature-operational`로 나누고 차단/허용/큐잉 정책을 표로 정의하라. audit append와 notification operational write는 보통 허용되어야 한다."
    },
    {
      "id": "CM1-10",
      "severity": "major",
      "category": "event-contract",
      "title": "알림 이벤트명과 audit 이벤트명이 서로 불일치한다",
      "evidence": [
        "§5.1 알림은 `content-migration-plan-approved`를 쓴다.",
        "§3.1.1 audit은 `content-migration-plan-legal-approved`를 쓴다."
      ],
      "impact": "plan approved가 validation approved인지 legal approved인지 모호하다. notify sourceEventId와 audit correlation도 흐려진다.",
      "recommendation": "`plan-validated`, `plan-legal-approved`, `run-completed`, `run-failed`, `rollback-triggered`처럼 상태 의미를 분리하고 event/audit naming을 맞춰라."
    },
    {
      "id": "CM1-11",
      "severity": "major",
      "category": "plan-kind",
      "title": "5종 plan kind가 asset-ingestion v1.0이 넘긴 경계 책임을 충분히 담지 못한다",
      "evidence": [
        "asset-ingestion.md §0은 content-migration 책임으로 대량 이관 계획, URL 리다이렉트, slug 보존, 검수 이력 승계를 명시한다.",
        "content-migration.md §3.2 5종에는 redirect/slug/review-history migration이 명시되지 않는다."
      ],
      "impact": "외부 자료 수집은 asset-ingestion이 담당하더라도, promote 후 기존 URL/slug/ComplianceRecord 승계 같은 내부 이관 핵심 작업이 빠진다.",
      "recommendation": "별도 planKind(`routing-slug-preservation` 등)를 추가하거나, step registry 필수 step family로 `redirect-map-apply`, `slug-preserve`, `compliance-history-link`를 정의하라."
    },
    {
      "id": "CM1-12",
      "severity": "major",
      "category": "boundary",
      "title": "ARCHITECTURE의 content-migration 설명과 본 문서의 내부-only 정의가 어긋난다",
      "evidence": [
        "ARCHITECTURE.md는 content-migration을 기존 사이트·블로그·카페 콘텐츠를 솔루션 데이터 모델로 이관하는 도구로 설명한다.",
        "content-migration.md §0과 §1.3은 솔루션 내부 migration만 대상으로 한다."
      ],
      "impact": "asset-ingestion과 content-migration 사이 handoff가 불분명해지고, onboarding migration 설계자가 어느 문서를 따라야 하는지 모호해진다.",
      "recommendation": "본 문서에 handoff boundary를 명시하라: external raw ingest/promote는 asset-ingestion, promote 이후 Core row 정렬·slug/redirect·검수 이력 승계·instance copy는 content-migration."
    },
    {
      "id": "CM1-13",
      "severity": "major",
      "category": "state-machine",
      "title": "pause/resume/cancel의 정확한 step boundary와 side effect 정책이 없다",
      "evidence": [
        "§3.1은 `pauseRun`, `resumeRun`, `cancelRun` command를 나열한다.",
        "§4 실행 파이프라인에는 pause/cancel이 실행 중 step, retry queue, read-only window, rollback과 어떻게 상호작용하는지 없다."
      ],
      "impact": "장시간 migration 중 cancel이 partial commit을 남길지 rollback을 요구할지, pause가 current step을 중단할지 다음 step부터 멈출지 구현마다 달라진다.",
      "recommendation": "상태 전이를 닫아라: pause는 step boundary에서만 effective, cancel은 `pending/running/paused`별 결과, running step은 cooperative cancellation만 허용, cancel 후 rollback 가능/불가능 상태를 명시."
    },
    {
      "id": "CM1-14",
      "severity": "major",
      "category": "retry-rollback",
      "title": "retry exhausted 시 자동 pause와 autoRollbackOnFailure 옵션의 우선순위가 충돌한다",
      "evidence": [
        "§2.3 config에는 `autoRollbackOnFailure`가 있다.",
        "§8.3은 step retry exhausted 시 run 자동 pause라고 한다."
      ],
      "impact": "autoRollbackOnFailure=true인 경우에도 pause가 먼저인지 rollback이 먼저인지 알 수 없다. 실패 step이 partial write를 남긴 경우 대응이 늦어진다.",
      "recommendation": "우선순위를 정의하라: non-compensated partial write 감지 시 rollback, retry exhausted는 기본 pause, autoRollbackOnFailure=true이면 rollback preflight 후 rollback-in-progress 전이 등."
    },
    {
      "id": "CM1-15",
      "severity": "major",
      "category": "db-schema",
      "title": "DB 인벤토리가 9 tables 이름만 있고 constraints/index/unique/CAS가 없다",
      "evidence": [
        "§9는 9개 테이블의 한 줄 설명만 제공한다.",
        "crm-sync v1.0은 partial unique, CHECK, CAS column, retry/outbox SQL을 구체화한다."
      ],
      "impact": "동시 `runApply`, 중복 idempotencyKey, step 중복 실행, outbox 중복 발송, retry queue 중복 claim을 DB 레벨에서 막을 수 없다.",
      "recommendation": "각 테이블에 required columns, state enum, unique constraints, partial unique, FK delete policy, indexes, CAS fields를 전개하라. 최소 `UNIQUE(instanceId,idempotencyKey)`, `UNIQUE(planId,stepKey)`, outbox `UNIQUE(sourceKind,sourceId,eventType)`가 필요하다."
    },
    {
      "id": "CM1-16",
      "severity": "major",
      "category": "idempotency",
      "title": "idempotencyKey가 정의만 있고 충돌 처리 계약이 없다",
      "evidence": [
        "§3.3 `DefinePlanInput`과 `MigrationStep`에는 idempotencyKey가 있다.",
        "same-request replay와 mismatched collision 처리 규칙이 없다."
      ],
      "impact": "중복 plan 생성, step 재실행, partial apply 중복 write를 막기 어렵다.",
      "recommendation": "crm-sync의 requestFingerprint 패턴을 재사용하라. 동일 idempotencyKey+동일 fingerprint는 기존 결과 반환, fingerprint 불일치는 409 runtime fail + audit/sink alert로 닫아라."
    },
    {
      "id": "CM1-17",
      "severity": "major",
      "category": "outbox",
      "title": "notification outbox가 `search-visibility §7.3 SQL 동일`이라고만 되어 notifications v1.0 idempotency 계약과 연결되지 않는다",
      "evidence": [
        "§5.2는 outbox SQL 동일이라고만 한다.",
        "REVIEW_WORKFLOW §9.2.1과 notifications.md §3.3은 `sourceEventId` idempotency를 요구한다."
      ],
      "impact": "outbox row가 notify()에 어떤 `sourceEventId`, `contentRef`, `contentTitle`, metadata로 들어가는지 없어 중복 발송과 누락을 검증할 수 없다.",
      "recommendation": "eventType별 NotificationEvent mapping 표를 추가하고 `sourceEventId = hash('content-migration:' + sourceKind + ':' + sourceId + ':' + eventType)` 같은 결정 규칙을 명시하라."
    },
    {
      "id": "CM1-18",
      "severity": "major",
      "category": "compliance-workflow",
      "title": "legal 승인 게이트를 ComplianceRecord lifecycle로 처리한다는 설명이 부정확하다",
      "evidence": [
        "§4.1 step 4는 `approvePlanLegalGate`가 ComplianceRecord 별도 lifecycle이라고 한다.",
        "DATA_MODEL C-10 ComplianceRecord는 콘텐츠 검수 기록이며 migration plan 자체는 contentType enum 대상이 아니다."
      ],
      "impact": "migration plan 승인과 콘텐츠 ComplianceRecord 검수 lifecycle이 섞인다. plan 자체를 ComplianceRecord로 만들려면 `contentType=Feature` 예외 cascade가 필요하다.",
      "recommendation": "plan legal approval은 `ContentMigrationLegalApproval` + AuditAction으로 처리하라. ComplianceRecord lifecycle은 `policy-version-reevaluate`가 개별 콘텐츠 재검수에 진입할 때만 사용하라."
    },
    {
      "id": "CM1-19",
      "severity": "major",
      "category": "content-type",
      "title": "compliance-assistant `contentType=\"Feature\"` 예외 cascade 필요 여부를 판단하지 않았다",
      "evidence": [
        "compliance-assistant.md §3.3의 Feature 예외는 현재 `feature:asset-ingestion` raw asset check에 한정되어 있다.",
        "content-migration.md는 plan 자체나 migration report를 compliance 대상 Feature 콘텐츠로 볼지 정의하지 않는다."
      ],
      "impact": "migration plan/report를 compliance-assistant나 REVIEW_WORKFLOW에 올리려는 순간 pageTypeId/articleType 유도 실패 또는 잘못된 룰 적용이 발생한다.",
      "recommendation": "content-migration plan은 ComplianceRecord 대상이 아니라고 명시하거나, `featureContentType=\"feature:content-migration\"` 예외를 compliance-assistant와 DATA_MODEL C-10에 cascade하라."
    },
    {
      "id": "CM1-20",
      "severity": "major",
      "category": "validation",
      "title": "§8 검증이 build/runtime/invariant만 있고 migration-time validation이 빠져 있다",
      "evidence": [
        "content-migration.md §8 제목은 빌드·런타임·invariant 검증이다.",
        "asset-ingestion/crm-sync는 build/runtime/migration/invariant를 분리한다."
      ],
      "impact": "마이그레이션 Feature인데 정작 기존 row의 상태, schema version watermark, dangling FK, rollback precondition, dry-run report retention 만료 등을 migration-time에 검증할 경로가 없다.",
      "recommendation": "§8에 migration-time validation을 분리해 추가하라. 예: target selector 0건/과다, dry-run report expired, reverse-step precondition missing, stale policyVersion, row lock 불가, orphan Core row 감지."
    },
    {
      "id": "CM1-21",
      "severity": "minor",
      "category": "spec-consistency",
      "title": "§0 핵심 책임의 `skip`과 rollback 정책이 본문에서 충분히 정의되지 않는다",
      "evidence": [
        "§0은 failure 시 rollback 또는 skip을 핵심 책임으로 둔다.",
        "본문에는 skip 승인권자, skip 가능 step class, skip audit metadata가 없다."
      ],
      "impact": "skip이 데이터 손실을 덮는 운영자 우회로가 될 수 있다.",
      "recommendation": "skip은 `irreversible/manual-remediation-required` step에서만 허용하고, reason, approver, affectedRows, remediationTicketRef를 필수 audit metadata로 하라."
    },
    {
      "id": "CM1-22",
      "severity": "minor",
      "category": "metrics",
      "title": "dry-run 정확도 목표 `>95%`는 고위험 migration 기준으로 느슨하고 정의도 모호하다",
      "evidence": [
        "§6은 dry-run 정확도 목표를 apply 결과와 일치 `>95%`로 둔다."
      ],
      "impact": "5% drift는 대량 콘텐츠 migration에서 치명적일 수 있다. row count, field diff, risk class별 정확도 중 무엇인지도 불명확하다.",
      "recommendation": "정확도 지표를 `targetSetDigest match`, `changedRowCount delta`, `fieldDiff delta`, `blockedDriftCount`로 분리하고, critical/legal/PII 대상은 100% 일치 요구로 올려라."
    },
    {
      "id": "CM1-23",
      "severity": "minor",
      "category": "open-decisions",
      "title": "CM-06, CM-07, CM-08은 v1.0 미결정으로 남기기에는 핵심 안전 조건이다",
      "evidence": [
        "§10은 대량 compliance-assistant 부하, PII 마스킹, DB DDL 경계를 미결정으로 둔다."
      ],
      "impact": "이 세 항목은 운영 안전성의 본체라 v1.x 후속으로 둘 수 없다.",
      "recommendation": "CM-06/07/08은 v1.0 blocking open issue로 격상하고, 해소 전 `ready_for_v1_0=false`를 유지하라."
    },
    {
      "id": "CM1-24",
      "severity": "minor",
      "category": "semver-policy",
      "title": "§1.1 변경 정책의 cascade 컬럼이 실제 영향과 맞지 않는다",
      "evidence": [
        "plan kind 추가는 MINOR/별개로 되어 있으나 NotificationEvent/AuditAction/DB step registry/validator 영향을 줄 수 있다.",
        "step type 추가는 reverse-step 정의 강제만 언급한다."
      ],
      "impact": "새 plan kind나 step type이 legal gate, read-only, rollback, dry-run report schema를 바꾸는 경우 MAJOR가 필요할 수 있다.",
      "recommendation": "plan kind/step type 변경을 영향 기반으로 재분류하라. legal gate/read-only/rollback/dry-run output 변경은 MAJOR 또는 policyVersion 신규로 처리해야 한다."
    },
    {
      "id": "CM1-25",
      "severity": "minor",
      "category": "permissions",
      "title": "read API가 legal-reviewer에게 모든 migration detail을 허용하지만 masking/export 정책이 없다",
      "evidence": [
        "§3.1 `queryPlans`, `queryRuns`, `queryStepResults`는 operator·super-admin·legal-reviewer 모두 허용이다.",
        "instance-to-instance-copy는 PII 이동 가능성이 있다."
      ],
      "impact": "step input/output/sample diff에 PII 또는 준식별자가 포함될 경우 권한별 masking이 필요하다.",
      "recommendation": "query 응답에 privacy class를 붙이고 operator/legal/super-admin별 sample diff masking, export 금지, retention을 정의하라."
    }
  ],
  "required_cascades": [
    {
      "target": "docs/admin/REVIEW_WORKFLOW.md §9.1, §9.1.1",
      "change": "content-migration NotificationEventType 4종 enum 및 정책 매트릭스 행 추가"
    },
    {
      "target": "docs/admin/REVIEW_WORKFLOW.md §10.2.1",
      "change": "content-migration AuditAction 6종 추가 및 metadata contract 명시"
    },
    {
      "target": "docs/core/DATA_MODEL.md C-08",
      "change": "`contentMigrationConfig`, `contentMigrationPolicyVersion`, `ContentMigrationConfig` 타입 추가"
    },
    {
      "target": "docs/features/compliance-assistant.md §3.3",
      "change": "`feature:content-migration` 예외가 필요한지 결정. 필요 없으면 content-migration 문서에서 plan legal approval은 ComplianceRecord 대상이 아님을 명시"
    }
  ],
  "recommended_next_cycle_focus": [
    "SoT cascade 실제 반영",
    "DB schema/constraints/outbox/retry queue 상세화",
    "dry-run fingerprint 및 apply CAS 강화",
    "rollback class와 irreversible step 승인 모델",
    "policy-version-reevaluate 대량 처리·dedupe·rate limit 설계",
    "asset-ingestion handoff: slug/redirect/review-history 승계 경계 확정"
  ]
}
tokens used
72,398
{
  "schema_version": "critique-v1",
  "cycle": 1,
  "target": "docs/features/content-migration.md",
  "version_reviewed": "v0.1",
  "ready_for_v1_0": false,
  "summary": {
    "blocking": 9,
    "major": 10,
    "minor": 5,
    "overall_assessment": "v0.1은 핵심 방향은 맞지만, SoT cascade가 실제 완료되지 않았고 rollback/dry-run/legal/read-only 경계가 운영 가능한 수준으로 닫혀 있지 않다. 특히 REVIEW_WORKFLOW, DATA_MODEL C-08, compliance-assistant 대량 재평가 계약이 미완이라 v1.0 후보로는 이르다."
  },
  "findings": [
    {
      "id": "CM1-01",
      "severity": "blocking",
      "category": "SoT-cascade",
      "title": "NotificationEventType 4종이 REVIEW_WORKFLOW canonical enum/매트릭스에 실제 반영되지 않았다",
      "evidence": [
        "content-migration.md §5.1은 `content-migration-plan-approved`, `content-migration-run-completed`, `content-migration-run-failed`, `content-migration-rollback-triggered` 4종을 정의한다.",
        "REVIEW_WORKFLOW.md §9.1 및 §9.1.1 canonical SoT에는 content-migration 이벤트가 없다."
      ],
      "impact": "notifications v1.0의 `notify()`는 REVIEW_WORKFLOW §9.1 enum과 §9.1.1 매트릭스를 SoT로 삼으므로, 현재 이벤트는 타입/라우팅/quietHours/fallback/digest 정책이 없는 비정상 이벤트다.",
      "recommendation": "REVIEW_WORKFLOW §9.1 enum과 §9.1.1 매트릭스에 4행을 cascade 완료로 반영하고, content-migration.md에는 `cascade 필요`가 아니라 `cascade 완료` 또는 명시 후속 상태를 일관되게 표기하라."
    },
    {
      "id": "CM1-02",
      "severity": "blocking",
      "category": "SoT-cascade",
      "title": "AuditAction 6종이 REVIEW_WORKFLOW §10.2.1 canonical enum에 없다",
      "evidence": [
        "content-migration.md §3.1.1은 `content-migration-plan-defined` 등 6종 AuditAction을 정의한다.",
        "REVIEW_WORKFLOW.md §10.2.1 canonical AuditAction enum은 content-migration 관련 값을 포함하지 않는다."
      ],
      "impact": "감사 로그 append-only 계약과 타입 검증이 깨진다. 특히 migration plan/apply/rollback은 고위험 운영 행위라 audit 누락은 v1.0 차단 사유다.",
      "recommendation": "REVIEW_WORKFLOW §10.2.1에 6종을 cascade하고, actorRole 권한 및 metadata required shape를 별도 표로 닫아라."
    },
    {
      "id": "CM1-03",
      "severity": "blocking",
      "category": "DATA_MODEL",
      "title": "DATA_MODEL C-08에 `contentMigrationConfig`와 `contentMigrationPolicyVersion`이 실제로 없다",
      "evidence": [
        "content-migration.md §2.2와 §2.3은 C-08 cascade 필요 및 manifest 필드를 전제한다.",
        "DATA_MODEL.md C-08에는 notifications, analytics, search-visibility, keyword-monitoring, asset-ingestion, crm-sync 설정만 있고 content-migration 설정이 없다."
      ],
      "impact": "InstanceManifest validator가 어떤 필드를 필수로 볼지 알 수 없고, build-time fail 규칙도 실행 불가능하다.",
      "recommendation": "DATA_MODEL C-08에 `ContentMigrationConfig` 타입과 `contentMigrationPolicyVersion` top-level 필드를 추가하고, `legalApprovedBy/At`, approvalRequired, read-only, retention, rollback 옵션의 required 여부를 명시하라."
    },
    {
      "id": "CM1-04",
      "severity": "blocking",
      "category": "compliance-assistant",
      "title": "`policy-version-reevaluate`의 compliance-assistant 대량 `check()` 호출 계약이 닫혀 있지 않다",
      "evidence": [
        "content-migration.md §3.2.5는 모든 ComplianceRecord 재평가 시 `check()` 재호출만 말한다.",
        "compliance-assistant.md §3.3은 `check(input)` 단일 엔트리포인트, §8은 cacheKey/durable cache/request deduplication을 정의한다."
      ],
      "impact": "대량 재평가에서 LLM/룰 엔진 호출 폭주, 동일 cacheKey 중복 실행, staleFlags와 새 pre-publish ComplianceRecord 생성 타이밍 불일치가 발생할 수 있다.",
      "recommendation": "`policy-version-reevaluate` 전용 batch contract를 추가하라: 대상 ComplianceRecord selection, cacheKey dedupe, concurrency/rate limit, durable cache hit 처리, `sourceEventId`, 새 ComplianceRecord(recordVersion 증가) 생성 또는 staleFlags-only 모드 분기."
    },
    {
      "id": "CM1-05",
      "severity": "blocking",
      "category": "scope-boundary",
      "title": "`schema-version-upgrade`가 DB DDL 책임과 충돌한다",
      "evidence": [
        "content-migration.md §1.3은 PostgreSQL DDL/schema change는 infra 책임이라고 한다.",
        "content-migration.md §3.2.1은 DATA_MODEL 버전 업그레이드 시 `column rename`을 예시로 든다."
      ],
      "impact": "application-level data migration과 DB schema migration의 소유권이 뒤섞인다. 실제 운영에서 DDL 배포 순서, app compatibility window, rollback 책임이 불명확해진다.",
      "recommendation": "`schema-version-upgrade`를 `application-data-version-upgrade`로 좁히거나, DDL은 precondition으로만 참조하라. 예: column 존재/nullable/default 검증은 읽기만 하고 DDL 실행은 금지."
    },
    {
      "id": "CM1-06",
      "severity": "blocking",
      "category": "rollback",
      "title": "reverse-step이 선택 필드라 rollback 가능성 필수 요구와 모순된다",
      "evidence": [
        "content-migration.md §0은 rollback 가능성 필수를 전제하지만 §3.3 `reverseStep?`는 optional이다.",
        "§4.2는 reverse-step 없는 step을 skip + alert로 처리한다."
      ],
      "impact": "고위험 apply가 사실상 되돌릴 수 없는 상태로 실행될 수 있다. 운영자 승인만으로 skip하면 데이터 정합성과 감사 추적을 복구할 수 없다.",
      "recommendation": "v1.0에서는 step별 `rollbackClass = reversible | compensating | irreversible`를 강제하고, irreversible step은 dry-run/apply 모두 별도 legal/super-admin 승인 + blast radius cap + backup/snapshot precondition을 요구하라."
    },
    {
      "id": "CM1-07",
      "severity": "blocking",
      "category": "dry-run",
      "title": "`expectedDryRunReportId`만으로 dry-run/apply drift를 막기 어렵다",
      "evidence": [
        "content-migration.md §3.3 `RunApplyInput`은 `expectedDryRunReportId`만 CAS로 둔다.",
        "§4.1 apply는 dry-run 이후 read-only window를 적용한다고만 한다."
      ],
      "impact": "dry-run 후 대상 row, source instance, policyVersion, step registry, plan body, content hash가 바뀌어도 report id만 맞으면 apply가 진행될 수 있다.",
      "recommendation": "DryRunReport에 `planFingerprint`, `targetSetDigest`, `sourceSnapshotWatermark`, `policyVersionSnapshot`, `stepRegistryVersion`, `contentHashDigest`를 저장하고 apply CAS가 전부 일치해야 진행되도록 하라."
    },
    {
      "id": "CM1-08",
      "severity": "blocking",
      "category": "legal-gate",
      "title": "legal 게이트 적용 대상이 PII 이동에만 좁게 잡혀 있다",
      "evidence": [
        "content-migration.md §2.3은 `instanceToInstanceCopy`만 legal-reviewer를 요구한다.",
        "§3.2.3도 PII 이동 시 legal 승인만 언급한다."
      ],
      "impact": "의료광고 정책 재평가, LegalDocument/ReviewPolicy/PricingPage 일괄 변환, 전후사진/후기 이동, priorReviewRequired 판정 변경 같은 법무 영향 migration이 legal gate 없이 실행될 수 있다.",
      "recommendation": "planKind 고정이 아니라 `legalImpactClassifier`를 두라. PII, LegalDocument, ReviewPolicy, PricingPage, before/after media, testimonial/review, priorReviewRequired 변경, cross-entity copy는 legal gate를 강제해야 한다."
    },
    {
      "id": "CM1-09",
      "severity": "blocking",
      "category": "operational-safety",
      "title": "read-only window가 모든 admin write 차단이라고만 되어 다른 Feature 영향이 정의되지 않았다",
      "evidence": [
        "content-migration.md §4.3은 instance의 모든 admin write 차단을 명시한다.",
        "notifications, compliance-assistant, asset-ingestion promote, crm-sync conflict resolution 등 admin DB write가 필요한 Feature와의 예외/큐잉 정책이 없다."
      ],
      "impact": "read-only 중 알림 읽음 처리, 검수 큐 상태 전이, asset promote, crm sync conflict resolution, ComplianceRecord stale 갱신이 실패하거나 교착될 수 있다.",
      "recommendation": "write class를 `content-mutating`, `workflow-state`, `notification-operational`, `audit-append`, `feature-operational`로 나누고 차단/허용/큐잉 정책을 표로 정의하라. audit append와 notification operational write는 보통 허용되어야 한다."
    },
    {
      "id": "CM1-10",
      "severity": "major",
      "category": "event-contract",
      "title": "알림 이벤트명과 audit 이벤트명이 서로 불일치한다",
      "evidence": [
        "§5.1 알림은 `content-migration-plan-approved`를 쓴다.",
        "§3.1.1 audit은 `content-migration-plan-legal-approved`를 쓴다."
      ],
      "impact": "plan approved가 validation approved인지 legal approved인지 모호하다. notify sourceEventId와 audit correlation도 흐려진다.",
      "recommendation": "`plan-validated`, `plan-legal-approved`, `run-completed`, `run-failed`, `rollback-triggered`처럼 상태 의미를 분리하고 event/audit naming을 맞춰라."
    },
    {
      "id": "CM1-11",
      "severity": "major",
      "category": "plan-kind",
      "title": "5종 plan kind가 asset-ingestion v1.0이 넘긴 경계 책임을 충분히 담지 못한다",
      "evidence": [
        "asset-ingestion.md §0은 content-migration 책임으로 대량 이관 계획, URL 리다이렉트, slug 보존, 검수 이력 승계를 명시한다.",
        "content-migration.md §3.2 5종에는 redirect/slug/review-history migration이 명시되지 않는다."
      ],
      "impact": "외부 자료 수집은 asset-ingestion이 담당하더라도, promote 후 기존 URL/slug/ComplianceRecord 승계 같은 내부 이관 핵심 작업이 빠진다.",
      "recommendation": "별도 planKind(`routing-slug-preservation` 등)를 추가하거나, step registry 필수 step family로 `redirect-map-apply`, `slug-preserve`, `compliance-history-link`를 정의하라."
    },
    {
      "id": "CM1-12",
      "severity": "major",
      "category": "boundary",
      "title": "ARCHITECTURE의 content-migration 설명과 본 문서의 내부-only 정의가 어긋난다",
      "evidence": [
        "ARCHITECTURE.md는 content-migration을 기존 사이트·블로그·카페 콘텐츠를 솔루션 데이터 모델로 이관하는 도구로 설명한다.",
        "content-migration.md §0과 §1.3은 솔루션 내부 migration만 대상으로 한다."
      ],
      "impact": "asset-ingestion과 content-migration 사이 handoff가 불분명해지고, onboarding migration 설계자가 어느 문서를 따라야 하는지 모호해진다.",
      "recommendation": "본 문서에 handoff boundary를 명시하라: external raw ingest/promote는 asset-ingestion, promote 이후 Core row 정렬·slug/redirect·검수 이력 승계·instance copy는 content-migration."
    },
    {
      "id": "CM1-13",
      "severity": "major",
      "category": "state-machine",
      "title": "pause/resume/cancel의 정확한 step boundary와 side effect 정책이 없다",
      "evidence": [
        "§3.1은 `pauseRun`, `resumeRun`, `cancelRun` command를 나열한다.",
        "§4 실행 파이프라인에는 pause/cancel이 실행 중 step, retry queue, read-only window, rollback과 어떻게 상호작용하는지 없다."
      ],
      "impact": "장시간 migration 중 cancel이 partial commit을 남길지 rollback을 요구할지, pause가 current step을 중단할지 다음 step부터 멈출지 구현마다 달라진다.",
      "recommendation": "상태 전이를 닫아라: pause는 step boundary에서만 effective, cancel은 `pending/running/paused`별 결과, running step은 cooperative cancellation만 허용, cancel 후 rollback 가능/불가능 상태를 명시."
    },
    {
      "id": "CM1-14",
      "severity": "major",
      "category": "retry-rollback",
      "title": "retry exhausted 시 자동 pause와 autoRollbackOnFailure 옵션의 우선순위가 충돌한다",
      "evidence": [
        "§2.3 config에는 `autoRollbackOnFailure`가 있다.",
        "§8.3은 step retry exhausted 시 run 자동 pause라고 한다."
      ],
      "impact": "autoRollbackOnFailure=true인 경우에도 pause가 먼저인지 rollback이 먼저인지 알 수 없다. 실패 step이 partial write를 남긴 경우 대응이 늦어진다.",
      "recommendation": "우선순위를 정의하라: non-compensated partial write 감지 시 rollback, retry exhausted는 기본 pause, autoRollbackOnFailure=true이면 rollback preflight 후 rollback-in-progress 전이 등."
    },
    {
      "id": "CM1-15",
      "severity": "major",
      "category": "db-schema",
      "title": "DB 인벤토리가 9 tables 이름만 있고 constraints/index/unique/CAS가 없다",
      "evidence": [
        "§9는 9개 테이블의 한 줄 설명만 제공한다.",
        "crm-sync v1.0은 partial unique, CHECK, CAS column, retry/outbox SQL을 구체화한다."
      ],
      "impact": "동시 `runApply`, 중복 idempotencyKey, step 중복 실행, outbox 중복 발송, retry queue 중복 claim을 DB 레벨에서 막을 수 없다.",
      "recommendation": "각 테이블에 required columns, state enum, unique constraints, partial unique, FK delete policy, indexes, CAS fields를 전개하라. 최소 `UNIQUE(instanceId,idempotencyKey)`, `UNIQUE(planId,stepKey)`, outbox `UNIQUE(sourceKind,sourceId,eventType)`가 필요하다."
    },
    {
      "id": "CM1-16",
      "severity": "major",
      "category": "idempotency",
      "title": "idempotencyKey가 정의만 있고 충돌 처리 계약이 없다",
      "evidence": [
        "§3.3 `DefinePlanInput`과 `MigrationStep`에는 idempotencyKey가 있다.",
        "same-request replay와 mismatched collision 처리 규칙이 없다."
      ],
      "impact": "중복 plan 생성, step 재실행, partial apply 중복 write를 막기 어렵다.",
      "recommendation": "crm-sync의 requestFingerprint 패턴을 재사용하라. 동일 idempotencyKey+동일 fingerprint는 기존 결과 반환, fingerprint 불일치는 409 runtime fail + audit/sink alert로 닫아라."
    },
    {
      "id": "CM1-17",
      "severity": "major",
      "category": "outbox",
      "title": "notification outbox가 `search-visibility §7.3 SQL 동일`이라고만 되어 notifications v1.0 idempotency 계약과 연결되지 않는다",
      "evidence": [
        "§5.2는 outbox SQL 동일이라고만 한다.",
        "REVIEW_WORKFLOW §9.2.1과 notifications.md §3.3은 `sourceEventId` idempotency를 요구한다."
      ],
      "impact": "outbox row가 notify()에 어떤 `sourceEventId`, `contentRef`, `contentTitle`, metadata로 들어가는지 없어 중복 발송과 누락을 검증할 수 없다.",
      "recommendation": "eventType별 NotificationEvent mapping 표를 추가하고 `sourceEventId = hash('content-migration:' + sourceKind + ':' + sourceId + ':' + eventType)` 같은 결정 규칙을 명시하라."
    },
    {
      "id": "CM1-18",
      "severity": "major",
      "category": "compliance-workflow",
      "title": "legal 승인 게이트를 ComplianceRecord lifecycle로 처리한다는 설명이 부정확하다",
      "evidence": [
        "§4.1 step 4는 `approvePlanLegalGate`가 ComplianceRecord 별도 lifecycle이라고 한다.",
        "DATA_MODEL C-10 ComplianceRecord는 콘텐츠 검수 기록이며 migration plan 자체는 contentType enum 대상이 아니다."
      ],
      "impact": "migration plan 승인과 콘텐츠 ComplianceRecord 검수 lifecycle이 섞인다. plan 자체를 ComplianceRecord로 만들려면 `contentType=Feature` 예외 cascade가 필요하다.",
      "recommendation": "plan legal approval은 `ContentMigrationLegalApproval` + AuditAction으로 처리하라. ComplianceRecord lifecycle은 `policy-version-reevaluate`가 개별 콘텐츠 재검수에 진입할 때만 사용하라."
    },
    {
      "id": "CM1-19",
      "severity": "major",
      "category": "content-type",
      "title": "compliance-assistant `contentType=\"Feature\"` 예외 cascade 필요 여부를 판단하지 않았다",
      "evidence": [
        "compliance-assistant.md §3.3의 Feature 예외는 현재 `feature:asset-ingestion` raw asset check에 한정되어 있다.",
        "content-migration.md는 plan 자체나 migration report를 compliance 대상 Feature 콘텐츠로 볼지 정의하지 않는다."
      ],
      "impact": "migration plan/report를 compliance-assistant나 REVIEW_WORKFLOW에 올리려는 순간 pageTypeId/articleType 유도 실패 또는 잘못된 룰 적용이 발생한다.",
      "recommendation": "content-migration plan은 ComplianceRecord 대상이 아니라고 명시하거나, `featureContentType=\"feature:content-migration\"` 예외를 compliance-assistant와 DATA_MODEL C-10에 cascade하라."
    },
    {
      "id": "CM1-20",
      "severity": "major",
      "category": "validation",
      "title": "§8 검증이 build/runtime/invariant만 있고 migration-time validation이 빠져 있다",
      "evidence": [
        "content-migration.md §8 제목은 빌드·런타임·invariant 검증이다.",
        "asset-ingestion/crm-sync는 build/runtime/migration/invariant를 분리한다."
      ],
      "impact": "마이그레이션 Feature인데 정작 기존 row의 상태, schema version watermark, dangling FK, rollback precondition, dry-run report retention 만료 등을 migration-time에 검증할 경로가 없다.",
      "recommendation": "§8에 migration-time validation을 분리해 추가하라. 예: target selector 0건/과다, dry-run report expired, reverse-step precondition missing, stale policyVersion, row lock 불가, orphan Core row 감지."
    },
    {
      "id": "CM1-21",
      "severity": "minor",
      "category": "spec-consistency",
      "title": "§0 핵심 책임의 `skip`과 rollback 정책이 본문에서 충분히 정의되지 않는다",
      "evidence": [
        "§0은 failure 시 rollback 또는 skip을 핵심 책임으로 둔다.",
        "본문에는 skip 승인권자, skip 가능 step class, skip audit metadata가 없다."
      ],
      "impact": "skip이 데이터 손실을 덮는 운영자 우회로가 될 수 있다.",
      "recommendation": "skip은 `irreversible/manual-remediation-required` step에서만 허용하고, reason, approver, affectedRows, remediationTicketRef를 필수 audit metadata로 하라."
    },
    {
      "id": "CM1-22",
      "severity": "minor",
      "category": "metrics",
      "title": "dry-run 정확도 목표 `>95%`는 고위험 migration 기준으로 느슨하고 정의도 모호하다",
      "evidence": [
        "§6은 dry-run 정확도 목표를 apply 결과와 일치 `>95%`로 둔다."
      ],
      "impact": "5% drift는 대량 콘텐츠 migration에서 치명적일 수 있다. row count, field diff, risk class별 정확도 중 무엇인지도 불명확하다.",
      "recommendation": "정확도 지표를 `targetSetDigest match`, `changedRowCount delta`, `fieldDiff delta`, `blockedDriftCount`로 분리하고, critical/legal/PII 대상은 100% 일치 요구로 올려라."
    },
    {
      "id": "CM1-23",
      "severity": "minor",
      "category": "open-decisions",
      "title": "CM-06, CM-07, CM-08은 v1.0 미결정으로 남기기에는 핵심 안전 조건이다",
      "evidence": [
        "§10은 대량 compliance-assistant 부하, PII 마스킹, DB DDL 경계를 미결정으로 둔다."
      ],
      "impact": "이 세 항목은 운영 안전성의 본체라 v1.x 후속으로 둘 수 없다.",
      "recommendation": "CM-06/07/08은 v1.0 blocking open issue로 격상하고, 해소 전 `ready_for_v1_0=false`를 유지하라."
    },
    {
      "id": "CM1-24",
      "severity": "minor",
      "category": "semver-policy",
      "title": "§1.1 변경 정책의 cascade 컬럼이 실제 영향과 맞지 않는다",
      "evidence": [
        "plan kind 추가는 MINOR/별개로 되어 있으나 NotificationEvent/AuditAction/DB step registry/validator 영향을 줄 수 있다.",
        "step type 추가는 reverse-step 정의 강제만 언급한다."
      ],
      "impact": "새 plan kind나 step type이 legal gate, read-only, rollback, dry-run report schema를 바꾸는 경우 MAJOR가 필요할 수 있다.",
      "recommendation": "plan kind/step type 변경을 영향 기반으로 재분류하라. legal gate/read-only/rollback/dry-run output 변경은 MAJOR 또는 policyVersion 신규로 처리해야 한다."
    },
    {
      "id": "CM1-25",
      "severity": "minor",
      "category": "permissions",
      "title": "read API가 legal-reviewer에게 모든 migration detail을 허용하지만 masking/export 정책이 없다",
      "evidence": [
        "§3.1 `queryPlans`, `queryRuns`, `queryStepResults`는 operator·super-admin·legal-reviewer 모두 허용이다.",
        "instance-to-instance-copy는 PII 이동 가능성이 있다."
      ],
      "impact": "step input/output/sample diff에 PII 또는 준식별자가 포함될 경우 권한별 masking이 필요하다.",
      "recommendation": "query 응답에 privacy class를 붙이고 operator/legal/super-admin별 sample diff masking, export 금지, retention을 정의하라."
    }
  ],
  "required_cascades": [
    {
      "target": "docs/admin/REVIEW_WORKFLOW.md §9.1, §9.1.1",
      "change": "content-migration NotificationEventType 4종 enum 및 정책 매트릭스 행 추가"
    },
    {
      "target": "docs/admin/REVIEW_WORKFLOW.md §10.2.1",
      "change": "content-migration AuditAction 6종 추가 및 metadata contract 명시"
    },
    {
      "target": "docs/core/DATA_MODEL.md C-08",
      "change": "`contentMigrationConfig`, `contentMigrationPolicyVersion`, `ContentMigrationConfig` 타입 추가"
    },
    {
      "target": "docs/features/compliance-assistant.md §3.3",
      "change": "`feature:content-migration` 예외가 필요한지 결정. 필요 없으면 content-migration 문서에서 plan legal approval은 ComplianceRecord 대상이 아님을 명시"
    }
  ],
  "recommended_next_cycle_focus": [
    "SoT cascade 실제 반영",
    "DB schema/constraints/outbox/retry queue 상세화",
    "dry-run fingerprint 및 apply CAS 강화",
    "rollback class와 irreversible step 승인 모델",
    "policy-version-reevaluate 대량 처리·dedupe·rate limit 설계",
    "asset-ingestion handoff: slug/redirect/review-history 승계 경계 확정"
  ]
}
