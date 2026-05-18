# Feature — asset-ingestion

> **상태**: **v1.0 구현 명세 안정판** (codex 자동 비평 5차 사이클 마감 — 5개 지적 전건 수용)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 11.1 / `docs/features/compliance-assistant.md` v1.0
> **목적**: 클라이언트 기존 자료(웹사이트·SNS·업로드·CSV)를 수집·파싱·태깅·PII 처리·검수·promote(Core 데이터 계약 변환). 의료기관 신규 인스턴스 onboarding의 첫 단계.
> **연관 문서**: compliance-assistant § 3.3 check(), notifications notify() + REVIEW_WORKFLOW § 9.1·§ 10.2.1 (cascade 완료), DATA_MODEL C-08 v0.18 + AssetIngestionApprovedScope, CONTENT_STANDARDS § 7, MEDICAL_AD_COMPLIANCE_COMMON § 3·§ 4

---

## 0. 한 페이지 요약

- **Feature 식별자**: `asset-ingestion`
- **핵심 책임**: 외부 source 자료 수집 → 파싱 → PII 감지/redaction → 자동 태깅 → 검수 큐 → Core 데이터 계약 변환(promote)
- **vs content-migration 경계** (F-16): 본 Feature는 **외부 raw 자료 수집 · 파싱 · 태깅 · 검수 큐까지**. content-migration은 **대량 이관 계획 · URL 리다이렉트 · slug 보존 · 검수 이력 승계**. **promote는 본 Feature 책임** (Core 데이터 계약 row 생성). 두 Feature 보완 관계 (ARCHITECTURE § 11.1 cascade 검토 필요 — AI-14 신규)
- **source type 4종**: `web-crawl`·`sns-api`·`manual-upload`·`csv-import` (web-crawl·sns-api 법무 게이트 필수)
- **운영 모드**: v1.0은 `staged`만 (모든 asset 검수 필수). `auto-promote`는 v1.x (AI-11)
- **AutoApproveRiskLevel**: v1.0은 `null`만 (모든 asset 운영자 검수). Low 자동 approve는 v1.x (AI-15)
- **신호 흐름**: ingest → parse → pii-detect → tag(rule-based + compliance-assistant check + LLM 옵션) → review → rights/legal usage check → promote (Core 계약 변환)
- **DB 인벤토리**: **11 tables** — IngestionSource·IngestionLog·IngestionSourceAttempt·IngestionRetryQueue·IngestedAsset·ExtractedContent·**AssetPiiFinding(신설)**·AssetTag·AssetReviewRecord·AssetPromotionRecord·AssetIngestionNotificationOutbox + Blob storage 1종

---

## 1. 일반 규약

### 1.1 변경 정책 (F-22 cascade 컬럼 구체화)

| 변경 유형 | 패키지 SemVer | policyVersion | 동반 cascade |
|---|---|---|---|
| 입력/출력 인터페이스 변경 | **MAJOR** | 별개 | REVIEW_WORKFLOW § 9·§ 10 검토 |
| source type 추가 | MINOR | 별개 | DATA_MODEL C-08 AssetIngestionConfig 필드 추가 + adapter contract + legal gate + build validation 동시 |
| source type 제거 | **MAJOR** | 별개 | 기존 IngestionSource row migration |
| 태깅 카탈로그·promote 매핑 변경 | **MAJOR** | policyVersion 신규 | Core 계약 호환성 검토 |
| 운영 모드 추가 (`auto-promote` 등) | **MAJOR** | 별개 | Feature SemVer MAJOR + § 11 build fail 룰 갱신 + REVIEW_WORKFLOW 진입 지점 정의 |
| build/runtime/migration fail 룰 추가·강화 | **MAJOR** | 별개 | |
| **runtime invariant·reconcile 룰 추가·강화** | MINOR | 별개 | AI3-12 — § 13.4 신설 영역. 감지 룰은 운영 모니터링 영역. keyword-monitoring § 1.1 동등 |
| warning → fail 승격 | **MAJOR** | 별개 | |
| warning 룰 추가 | MINOR / PATCH | 별개 | |
| 지표 추가 | PATCH | 별개 | |

### 1.2 SoT 원칙

- 룰 매칭 SoT는 `features/compliance-assistant.md` § 3.3 `check()`
- 알림·audit SoT는 REVIEW_WORKFLOW § 9·§ 10.2.1 (cascade 완료)
- 자격증명·policyVersion·AssetIngestionApprovedScope SoT는 DATA_MODEL C-08 v0.18
- Core 데이터 계약 SoT는 DATA_MODEL C-01~C-22
- 본 문서 = 수집·파싱·PII·태깅·검수·promote SoT + 내부 데이터 구조 SoT (§ 16)

### 1.2.1 공통 retry taxonomy (search-visibility § 1.2.1 동일)

| 큐 | maxAttempts |
|---|---|
| IngestionRetryQueue | config(기본 3) — configurable |
| AssetIngestionNotificationOutbox | 상수 5 |

### 1.3 본 문서가 다루지 않는 영역

- 룰 매칭 자체 — compliance-assistant
- 알림 채널·재시도 — notifications
- 기존 솔루션 내 콘텐츠 이전·대량 이관 계획·URL 리다이렉트 — content-migration (후속)

---

## 2. Feature 정의

### 2.1 기본 메타

```yaml
name: "asset-ingestion"
specVersion: "1.0"
coreRequiresMin: "1.0.0"
implementationKind: "node-module"
activation: { scope: "instance", default: false }
```

### 2.2 의존성 (F-6 정합)

| 영역 | 의존 |
|---|---|
| compliance-assistant § 3.3 | `check()` — 자동 태깅에 활용. **의료기관 인스턴스에서 asset-ingestion 활성 시 compliance-assistant 활성 또는 `complianceAssistantExemptApproval` required** (build fail) |
| notifications | **notify() 필수** (본 Feature는 monitor-only 모드 없음 — AI2-09 정정). 검수 큐 진입·PII 감지 등 본 Feature의 핵심 흐름이 알림 의존. notifications 비활성 인스턴스는 본 Feature 활성 불가 |
| REVIEW_WORKFLOW § 9.1·§ 9.1.1 | 5종 NotificationEventType cascade 완료 |
| REVIEW_WORKFLOW § 10.2.1 | 5종 AuditAction cascade 완료 |
| DATA_MODEL C-08 v0.18 | assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope |
| DATA_MODEL C-23 | AdminUser (검수자·promote 권한) |
| DATA_MODEL C-01~C-22 | promote 대상 Core 데이터 계약 |

### 2.3 InstanceManifest

§ v0.1 § 2.3 유지 + 다음 정정:
- `webCrawl.approvedScope`는 **`AssetIngestionApprovedScope`**(C-08 v0.18) 타입 사용 — F-10 정합
- `snsApi.<platform>` 필드에 `legalApproved`·`legalApprovedBy`·`legalApprovedAt`·`approvedAccountIds[]`·`allowedContentTypes[]`·`consentEvidenceRef` 추가 — F-12 게이트
- `tagging.complianceAssistantInvocation` 옵션 (rule-based 외 compliance-assistant `check()` 호출 여부 — § 6.2)
- `review.autoApproveRiskLevel`: v1.0은 `null` 강제 (build fail 시 비-null 차단 — F-9)
- `promote.targetMapping` policyVersion: closed union 강제 — § 8

---

## 3. 입력·출력

### 3.1 엔트리포인트 + read API + 운영 command

v0.1 § 3.1 유지 + audit log contract (§ 3.1.1 신설).

### 3.1.1 audit log contract (F-4)

| AuditAction | contentRef | metadata 필수 필드 | 권한 |
|---|---|---|---|
| `asset-ingestion-source-registered` | `"ingestion-source:" + sourceId` | sourceType·configSummary·registeredBy | operator·super-admin |
| `asset-ingestion-source-unregistered` | `"ingestion-source:" + sourceId` | sourceType·activeBefore·activeAfter·unregisteredBy | operator·super-admin |
| `asset-ingestion-asset-promoted` | `"asset:" + assetId` | targetContentType·targetContentRef·targetMappingSummary·promotedBy | operator·super-admin |
| `asset-ingestion-asset-rejected` | `"asset:" + assetId` | rejectionReason·rejectedBy | operator·super-admin |
| `asset-ingestion-pii-redacted` | `"asset:" + assetId` | piiFindingIds[]·redactionMode·redactedBy(또는 system) | system·operator |

### 3.2 IngestionSource·RunIngestionInput·Result·queryIngestedAssets

§ v0.1 § 3.2~§ 3.5 유지.

---

## 4. 수집 파이프라인

### 4.1 실행 순서 — v0.1 § 4.1 유지

### 4.2 duplicate 감지 — canonicalization (F-17)

**canonicalization 알고리즘**:
- `rawBlobHash` = SHA-256(raw 본문 bytes) — 정확한 raw 동일성
- `normalizedTextHash` = SHA-256(text content 정규화 후) — HTML boilerplate·tracking parameter·whitespace 제거 후
- `sourceCanonicalKey` = sourceId + canonical URL path or filename — provenance 추적

UNIQUE 정책:
- `UNIQUE(instanceId, normalizedTextHash)` — duplicate 차단 기본
- `(instanceId, sourceId, sourceCanonicalKey)` index — provenance 조회

fuzzy matching은 AI-07 후속 (M2+). v1.0은 exact normalized hash만.

### 4.3 retry queue worker — search-visibility § 13.5 패턴 동일

---

## 5. source 어댑터

### 5.1 web-crawl (법무 게이트 — DATA_MODEL C-08 AssetIngestionApprovedScope SoT)

- `webCrawl.enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedScope` 누락 또는 `approvedScope.allowedDomains` 빈 배열 또는 `targetDomains` ⊄ `approvedScope.allowedDomains` 또는 `approvedScope.allowCaptchaBypass === true`) → build fail (F-10·F-11)
- crawler 실행 파라미터가 approvedScope 밖이면 `skipped-legal-out-of-scope`
- rate limit·robots.txt 준수

### 5.2 sns-api (법무 게이트 — F-12)

- `snsApi.<platform>.enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedAccountIds` 빈 배열 또는 `allowedContentTypes` 빈 배열) → build fail
- platform별 ToS 준수 (운영자 책임 — AI-01)
- 수집 대상은 `approvedAccountIds`에 명시된 계정만 — **adapter는 API 호출 파라미터 검증 + 응답 item별 `authorAccountId`·`ownerAccountId` 검증** (AI2-11): 공유글·리그램·인용·댓글·cross-post에서 실제 owner가 approved 외인 item은 `skipped-legal-out-of-scope`로 quarantine (asset 생성 안 함)
- `allowedContentTypes` (post·comment·story·reel 등) 검증 — 외 type item도 skip

### 5.3 manual-upload · 5.4 csv-import — v0.1 § 5.3·5.4 유지

---

## 6. 파싱·태깅

### 6.1 파싱 — v0.1 § 6.1 유지

### 6.2 태깅 — compliance-assistant check() 호출 정확화 (F-5)

**rule-based + compliance-assistant 호출**:

```ts
// asset → compliance-assistant check() 호출 (raw asset 단계)
const result: ComplianceCheckResult = await complianceAssistant.check({
  contentType: "Feature",                              // CONTENT_STANDARDS § 7.1.1 정합
  featureContentType: "feature:asset-ingestion",       // 신설 — DATA_MODEL C-10 v0.5 패턴
  contentRef: `asset:${assetId}`,
  body: extractedContent.body,                          // ExtractedContent.body
  metadata: {
    pageTypeId: undefined,                              // 아직 미산정 (promote 시 결정)
    articleType: undefined,
    explicitRiskLevel: undefined
  },
  riskRules: instanceRules                              // 인스턴스 로드된 RiskRule[]
});
// 결과 ComplianceCheckResult는 findings[]·findingsBySeverity·automatedDecision 포함
// inferredRiskLevel·inlineRiskFlags[]는 compliance-assistant 내부 산출 — finding의 metadata로 노출

// AI2-12 — Feature contentType의 raw asset check 동작:
//   - pageTypeId·articleType 미지정 허용 (compliance-assistant § 3.3 fail 예외)
//   - feature-scoped rules + global rules만 적용 (pageType-specific rules 적용 안 함)
//   - inferredRiskLevel은 finding severity 기반 보수적 산정 (Medium 기본)
//   - 정식 RiskLevel은 promote 시점 contentType=Article 등으로 재호출 시 결정
```

- **AssetTag 변환**: result.findings[]의 category·ruleId를 AssetTag.tagKind=`compliance-finding`로 저장
- **RiskLevel 추정**: result.findings 중 severity="content-gate" 또는 "fail" 존재 시 AssetTag.tagKind=`riskLevel` value=`High` (보수적). 정식 RiskLevel은 promote 시점에 결정
- **inlineRiskFlags**: result.findings[] metadata에서 추출하여 별도 AssetTag로 저장

**LLM 태깅** (`config.tagging.llmEnabled=true`):
- compliance-assistant llmAssist 패턴 차용 (synthetic ruleId 안정성·human-in-loop)
- 자동 분류: 추천 `contentType` (Article·TreatmentPage 등) + 신뢰도

---

## 7. 검수·promote 게이트 (F-15 의료광고·저작권·SNS 동의)

### 7.1 검수 워크플로

- **AssetReviewRecord 본체 상태** (`status` 필드 — asset content review): `pending` → `approved` / `rejected`
- **권한**: operator·super-admin (AI4-12 — asset content review 한정)
- SLA: `config.review.slaDays`(기본 7일)
- `autoApproveRiskLevel`: v1.0은 `null` 강제 — 모든 asset 운영자 검수
- **`rightsReview` 권한은 별도 legal gate** (AI4-12): § 16.9 권한 매트릭스 참조 — status 변경은 legal-reviewer·super-admin만. operator는 evidence-added만 가능

### 7.2 promote 게이트 (F-15)

운영자가 promote 액션 호출 전 다음 게이트 확인 필수:

| 게이트 | 조건 | 차단 동작 |
|---|---|---|
| 검수 상태 | `AssetReviewRecord.status === "approved"` | 미승인 시 runtime fail |
| **rightsReview 상태** (AI2-03 명칭 통일) | source가 외부 URL·SNS·환자 후기·전후사진 감지 → `AssetReviewRecord.rightsReview.status === "approved"` 필수 | 미승인 시 promote 차단 + `requiredApproverRoles=["legal"]` 명시 |
| **PII 처리 완료** (AI4-07 — AssetPiiFinding 기준) | **AssetPiiFinding 0건** 또는 모든 finding이 다음 중 하나: (a) `reviewStatus="false-positive"`, (b) `reviewStatus="true-positive" AND redactionApplied=true` | 미처리 시 차단 (`open` 또는 `true-positive AND redactionApplied=false`는 차단). `piiDetected` boolean은 표시용 denormalized summary만. § 13.4 reconcile invariant — `piiDetected != exists(AssetPiiFinding)` 감지 시 sink alert |
| **저작권·동의 증빙** | 외부 출처 자료 시 `AssetReviewRecord.rightsReview.evidenceAttachments[]` 또는 `consentEvidenceRef` 필수 | 미첨부 시 차단 |

v0.2 최종 결정: **AssetReviewRecord.rightsReview** embedded 객체 (별도 테이블 미신설). 단 변경 이력은 `rightsReview.history[]` append-only 배열 보존 (AI2-04).

---

## 8. promote (Core 데이터 계약 변환 — F-7·F-8)

### 8.1 closed union TargetMapping (F-7)

```ts
type PromoteAssetInput = {
  assetId: string;
  targetContentType: TargetContentType;
  targetMapping: TargetMapping;                         // contentType별 closed union
};

type TargetContentType = "Article" | "TreatmentPage" | "MedicalConditionPage" | "FAQ" | "NewsItem";
// AI2-05 — v1.0 promote 지원 5종 한정. ReviewPolicy·PricingPage·LocationProfile·ReservationPage·FacilitiesPage·ClinicProfile·DoctorProfile·ArticleCategory 등은
// v1.0에서 promote 미지원 → runtime fail. 해당 contentType 생성은 어드민 UI manual 처리. v1.x에서 contentType별 TargetMapping 추가 예정 (AI-17 신규)

type TargetMapping =
  | { kind: "Article"; mapping: ArticleTargetMapping }
  | { kind: "TreatmentPage"; mapping: TreatmentPageTargetMapping }
  | { kind: "MedicalConditionPage"; mapping: MedicalConditionPageTargetMapping }
  | { kind: "FAQ"; mapping: FaqTargetMapping }
  | { kind: "NewsItem"; mapping: NewsItemTargetMapping };

// Article은 DATA_MODEL C-04 v0.4 정합 (AI4-06 — 잔재 제거. closed union 전개)
type ArticleTargetMapping = {
  // required (C-04 SoT)
  headline: string;
  body: Markdown;
  author: Ref<C-02>;                                    // DoctorProfile @id
  datePublished: ISODateString;
  articleType: string;
  contentFormat: string;
  category: Ref<C-22>;
  pageRiskLevel: RiskLevel;
  // optional (C-04 v0.4 컨텍스트 필드)
  summary?: string;
  coAuthors?: Ref<C-02>[];
  reviewedBy?: Ref<C-02>;
  reviewedAt?: ISODateString;
  contentSource?: string;
  externalUrl?: URL;
  authorType?: string;
  dateModified?: ISODateString;
  embeddedMedia?: EmbeddedMedia[];
  // closed union — unknown field는 build/runtime fail
};

// TreatmentPage (DATA_MODEL C-03 v0.4 정합 — AI4-05 SoT 동등)
type TreatmentPageTargetMapping = {
  // required (C-03 SoT)
  name: string;
  overview: Markdown;
  mechanism: Markdown;
  targetAudience: Markdown;
  process: ProcessStep[];                  // C-03 하위 타입 재사용 (AI4-05 — Markdown 아님)
  precautions: Markdown;
  pageRiskLevel: RiskLevel;
  // optional (C-03 v0.4 컨텍스트 필드 — 하위 타입은 DATA_MODEL C-03 재사용)
  summary?: string;
  recommendedFor?: string[];
  treatmentComponents?: TreatmentComponent[];   // C-03 하위 타입
  visitFlow?: VisitFlowStep[];                   // C-03 하위 타입
  programVariants?: ProgramVariant[];            // AI4-05 — string[]이 아닌 ProgramVariant[]
  maintenancePlan?: string;
  remoteCareAvailable?: boolean;
  evidenceNotes?: EvidenceNote[];                // C-03 하위 타입
  cta?: Ref<CTAConfig>;
  relatedDoctors?: Ref<C-02>[];
  relatedConditions?: Ref<C-11>[];
  // closed union — unknown field는 runtime fail
};

// MedicalConditionPage
type MedicalConditionPageTargetMapping = {
  name: string;
  definition: Markdown;
  symptoms?: string[];
  causes?: string[];
  diagnosis?: Markdown;
  treatmentOptions?: Markdown;
  prevention?: Markdown;
  pageRiskLevel: RiskLevel;
  // closed union
};

// FAQ
type FaqTargetMapping = {
  question: string;
  answer: Markdown;
  category?: string;
  riskLevel: RiskLevel;
  // closed union
};

// NewsItem
type NewsItemTargetMapping = {
  headline: string;
  body: Markdown;
  category: string;                        // event-price 카테고리는 High RiskLevel 자동
  publishedDate: ISODateString;
  expirationDate?: ISODateString;
  riskLevel: RiskLevel;
  // closed union
};
```

**runtime validation**: TargetMapping의 mapping 객체에 contentType별 SoT 필수 필드 누락 또는 unknown field → fail.

### 8.2 promote 흐름 (AI3-01·02·03·04 — 상태 머신·lock·reconcile·outbox atomicity)

**AssetPromotionRecord status 머신** (AI3-01 정정):

| status | 의미 |
|---|---|
| `checking` | 2단계 check() 진행 중 (외부 호출) |
| `pending-commit` | check() 성공·4단계 transaction 진입 직전 |
| `committed` | 4단계 transaction commit 성공 |
| `failed` | check() 실패·4단계 abort·게이트 재검증 실패 |

**forensic 필드** (AI3-01):
- `checkStartedAt`·`checkCompletedAt`·`commitStartedAt`·`commitCompletedAt`·`lastError`·`checkResultVersion`

**흐름**:

```
1. promote 게이트 사전 검증 (§ 7.2 — 미충족 시 runtime fail, AssetPromotionRecord 미생성)
2. **트랜잭션 외부 check()** (compliance-assistant):
   a. AssetPromotionRecord INSERT (status="checking", checkStartedAt=now())
   b. compliance-assistant.check() 호출 (외부 LLM·룰 로드·캐시 가능)
   c. 성공 → AssetPromotionRecord UPDATE status="pending-commit", checkCompletedAt, checkResultVersion
   d. 실패 → AssetPromotionRecord UPDATE status="failed", lastError + 외부 sink alert + early exit
3. **단일 DB transaction (짧음 — AI3-03 lock·재검증·AI3-04 outbox atomic + AI4-02 CAS)**:
   a. **AssetPromotionRecord row lock + status CAS** (AI4-02): `SELECT ... FOR UPDATE WHERE id=? AND status='pending-commit'` — 다른 worker가 이미 진입했거나 status 다르면 abort(idempotent duplicate). 성공 시 `UPDATE SET commitStartedAt=now()`
   b. **연관 row lock 획득** — `SELECT ... FOR UPDATE` on IngestedAsset, AssetReviewRecord, AssetPiiFinding(assetId 범위)
   c. **게이트 재평가** (AI3-03): § 7.2 모든 게이트 재검증 + AssetReviewRecord.reviewVersion compare-and-set
      - 게이트 재검증 실패 → transaction abort (Core row 미생성). **3.a의 `commitStartedAt` update도 abort와 함께 rollback** (AI5-02 정합). **별도 짧은 transaction에서 AssetPromotionRecord UPDATE status="failed", lastError="gate-race-failure", failedAt=now() WHERE status='pending-commit'** (WHERE 조건으로 race 방지. commitStartedAt은 채우지 않음 — abort로 rollback된 상태) — AI4-03
   d. Core 데이터 계약 row INSERT (status="draft", `@provenanceAssetId`=assetId — AI4-11)
   e. ComplianceRecord pre-publish row 생성 (recordPhase="pre-publish", recordVersion=1, contentRef=Core row @id, autoCheckResult=2단계 결과)
   f. 콘텐츠 상태 `review-queued` 설정 (REVIEW_WORKFLOW § 2.1)
   g. **AssetIngestionNotificationOutbox INSERT** (sourceKind="asset", sourceId=assetId, eventType="asset-ingestion-asset-promoted") — AI3-04 atomic
   h. AssetPromotionRecord UPDATE status="committed", commitCompletedAt=now(), targetContentRef=Core row @id
   i. commit
4. **post-commit (별도 작업 — 외부 시스템 호출만)**:
   - audit log `asset-ingestion-asset-promoted` 기록 — 실패 시 reconcile (audit는 외부 시스템)
   - notifications outbox는 이미 transaction 안에 insert됨 → 별도 worker가 dispatch
5. 이후 일반 REVIEW_WORKFLOW 흐름
```

**reconcile worker** (AI3-02 — SoT 명시. § 13.4 신설로 분리):

```
주기: 5분 간격
대상:
  - status="checking" + checkStartedAt < now() - 30분 → status="failed", lastError="checker-timeout"
  - status="pending-commit" + checkCompletedAt < now() - 10분 → status="failed", lastError="commit-stalled" (Core row·ComplianceRecord 미존재 시 — 존재 시 status="committed"로 수렴)
  - status="committed" + audit log 미존재 (24시간 내) → 재기록 시도. 재시도 3회 후 sink alert
```

---

## 9. PII 처리 (F-13·F-14)

### 9.1 PII 자동 감지·redaction

**탐지 알고리즘** (`config.pii.detectionTargets`):

- `email`: 표준 RFC 5322 regex
- `phone`: 한국 휴대전화 + 일반 전화 regex
- `ssn` (미국식): legacy 호환
- **`rrn` (한국 주민등록번호 — AI2-06 정확 알고리즘)**:
  - 후보 추출: `\b\d{6}-?[1-8]\d{6}\b` (하이픈 제거 후 13자리)
  - **생년월일·성별 코드 유효성**: 7번째 자리(성별 코드)로 세기 판정 — `1·2`=1900년대, `3·4`=2000년대, `5·6`=1900년대 외국인, `7·8`=2000년대 외국인. 앞 6자리는 YYMMDD 유효 일자
  - **checksum 검증 (정확 공식)**:
    ```
    가중치 W = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5]
    sum = Σ (digit[i] × W[i]) for i=0..11
    checkDigit = (11 - (sum % 11)) % 10
    valid = checkDigit === digit[12]
    ```
  - 검증 실패: PII 미분류 (regex 우연 일치 false-positive) — confidence=0
  - 검증 통과: PII 분류 confidence=1.0
  - 하이픈 처리: 입력 시 하이픈 유무 모두 허용. 정규화하여 검증

**redaction mode**:
- `mask`: RRN 전용 마스킹 `######-*******`. 일반 텍스트는 부분 마스킹
- `remove`: 해당 부분 제거

**저장 분리** (AI3-06 정확화):
- **Raw blob** (`IngestedAsset.blobRef` — `raw/` prefix): 원본 보존. encrypted (aes-256-gcm). IAM으로 legal 검수자·super-admin만 접근
- **ExtractedContent.rawBody**: 파싱 후 raw text. AssetPiiFinding offset의 SoT. legal 검수자·super-admin만 read
- **ExtractedContent.body**: redacted view (운영자·검수자 일반 표시용)
- **AssetPiiFinding** (§ 16.7): 발견 내역 구조화 저장. offset은 rawBody 기준

### 9.2 의료법·저작권 게이트 — § 7.2 promote 게이트로 강제

---

## 10. 알림 (outbox 패턴)

### 10.1 NotificationEventType 매트릭스 (REVIEW_WORKFLOW § 9.1.1 cascade 완료 — 5종)

| eventType | criticality | 즉시 채널 | fallback | digest | quietHoursPolicy | optOutPolicy |
|---|---|---|---|---|---|---|
| `asset-ingestion-batch-completed` | normal | inApp | (없음) | (옵션) email 일일 | respect | digestOptOut 허용 |
| `asset-ingestion-batch-failed` | high | email + inApp | inApp | — | respect | mandatory |
| `asset-ingestion-review-required` | normal | inApp | (없음) | email 일일 | respect | digestOptOut 허용 |
| **`asset-ingestion-pii-detected`** | **critical** (F-3) | email + inApp | inApp | — | bypass | mandatory |
| `asset-ingestion-asset-promoted` | normal | inApp | (없음) | (옵션) email 일일 | respect | digestOptOut 허용 |

### 10.2 outbox 패턴

search-visibility § 7.2·keyword-monitoring § 6.2 동일 (SKIP LOCKED·attempts<5·permanent 전이).

### 10.3 NotificationEvent 필드 매핑 (F-2)

| eventType | outbox sourceKind | outbox sourceId | contentRef | contentTitle | metadata |
|---|---|---|---|---|---|
| `asset-ingestion-batch-completed` | `ingestion-log` | ingestionLogId | `"ingestion-log:" + ingestionLogId` | `"수집 완료 — ${date}"` | ingestionLogId·perSource summary |
| `asset-ingestion-batch-failed` | `ingestion-log` | ingestionLogId | `"ingestion-log:" + ingestionLogId` | `"수집 실패 — ${date}"` | ingestionLogId·failedSources[] |
| `asset-ingestion-review-required` | `asset` | assetId | `"asset:" + assetId` | `"검수 필요 — ${assetTitle}"` | assetId·sourceType·tags |
| `asset-ingestion-pii-detected` | `asset` | assetId | `"asset:" + assetId` | `"PII 감지 — ${assetTitle}"` | assetId·piiFindingIds[]·detectorSummary·redactionMode |
| `asset-ingestion-asset-promoted` | `asset` | assetId | `"asset:" + assetId` | `"Core 변환 완료 — ${targetContentType}"` | assetId·targetContentType·targetContentRef·assetPromotionRecordId |

**dedupe 단위** (AI2-10):
- `asset-ingestion-pii-detected`: asset 단위 1건만 발송 (한 asset에 multiple PII finding 발생해도 sourceId=assetId로 합산). piiFindingIds[] metadata로 상세 전달
- UNIQUE(sourceKind, sourceId, eventType) — 동일 asset에 pii-detected 이벤트 1건만 outbox row. asset에 PII가 추가 발견되면 새 outbox 생성 안 함 (기존 finding 수정/추가는 read API로 확인)

`sourceEventId = hash("asset-ingestion:" + sourceKind + ":" + sourceId + ":" + eventType)` (search-visibility 패턴).

---

## 11. 운영 지표

### 11.1 핵심 지표 (F-21 표 컬럼 정정)

| 지표 | 정의 | 목표 |
|---|---|---|
| 수집 cycle 성공율 | envelopeState="completed" / 전체 | > 99% |
| 자산 수집 건수 | per source per cycle | baseline |
| duplicate 비율 | assetsDeduped / 전체 | baseline |
| 검수 SLA 준수율 | slaDays 내 처리 / 전체 | > 95% |
| LLM 태깅 적용율 (활성 시) | LLM success / 전체 | > 95% |
| PII 감지 적중률 | 운영자 confirmed / 자동 감지 | > 80% (M2+ baseline) |
| promote율 | promoted / approved | baseline |
| outbox 발송 성공율 | dispatched / enqueue 대상 | > 99% |
| **RRN candidate count** (AI3-11) | regex 후보 수 / 전체 ingested asset 수 | baseline (운영 30일 누적) |
| **RRN checksum pass rate** | checksum 통과 / candidate count | baseline |
| **PII true-positive rate** | reviewStatus="true-positive" / 전체 finding | baseline (M2+) |
| **PII false-positive rate** | reviewStatus="false-positive" / 전체 finding | < 30% (M2+ baseline) |
| **redaction completion SLA** | promoteAsset 시점에 모든 finding redactionApplied or false-positive 비율 | > 99% |

### 11.2 alert — v0.1 § 11.2 유지

---

## 12. 설치·설정·운영 모드

### 12.1 빌드 단계 — v0.1 § 12.1 유지 + DB 11 tables

### 12.2 운영 모드

- **staged** (v1.0): 모든 asset 운영자 검수 필수. `autoApproveRiskLevel=null` 강제
- **auto-promote** (v1.x — AI-11): Low risk 자동 promote

---

## 13. 빌드·런타임·migration 검증 (3분리 — search-visibility 패턴)

### 13.1 build-time fail

- `enabled=true` + `assetIngestionConfig` 누락
- `assetIngestionPolicyVersion` 누락 또는 패키지 보관 버전 불일치
- **의료기관 인스턴스에서 `enabled=true` + `compliance-assistant` 비활성 + `complianceAssistantExemptApproval` 누락** (F-6)
- `webCrawl.enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedScope` 누락 또는 `approvedScope.allowedDomains` 빈 배열 또는 `targetDomains` ⊄ `approvedScope.allowedDomains` 또는 `approvedScope.allowCaptchaBypass === true`) (F-10·F-11)
- `snsApi.<platform>.enabled=true` + 법무 게이트 누락 (legalApproved·approvedAccountIds·allowedContentTypes 등) (F-12)
- `tagging.llmEnabled=true` + LLM credential 누락
- `tagging.tagCatalogVersion` 누락
- `pii.autoRedactEnabled=true` + `detectionTargets` 빈 배열
- **`review.autoApproveRiskLevel !== null`** (v1.0 한정 — F-9)
- `promote.autoMappingEnabled=true` (v1.0 미지원)
- `mode="auto-promote"` (v1.0 미지원)
- `blobStorage.provider !== "s3"` (v1.0)
- `blobStorage.bucket`·`signedUrlTtlSeconds` 누락
- `notifications` 비활성 + 본 Feature `enabled=true` (notifications는 본 Feature 필수)

### 13.2 runtime validation fail

- `forceRefresh=true` + `refreshIntentId` 누락
- manual-upload `allowedMimeTypes` 외 또는 maxFileSizeMb 초과
- csv-import 행 수 > maxRowsPerImport
- **`promoteAsset` 게이트 미충족** (§ 7.2): 검수 미승인·rights 미승인·PII 미처리·증빙 미첨부
- **`promoteAsset` targetMapping의 contentType별 필수 필드 누락 또는 unknown field** (F-7)
- **`promoteAsset` targetContentType이 v1.0 unsupported** (AI3-09 — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 외) → fail + AssetTag `manualProcessingRequired=true` 마킹 (asset 상태는 approved 유지. 어드민 UI manual Core editor 경로. manual 생성 Core row는 `provenanceAssetId` 필드 보존)
- crawler 실행 파라미터가 approvedScope 밖 → `skipped-legal-out-of-scope`
- SNS API 호출이 `approvedAccountIds` 밖 → `skipped-legal-out-of-scope`

### 13.3 migration-time validation·migration 정책 (AI3-07 + AI5-04 backfill)

**`blobKeyVersion` null backfill** (AI5-04 — 기존 v0.1·v0.2 운영 데이터 환경):
- migration-time validation: `IngestedAsset.blobKeyVersion IS NULL` row 감지 시 자동 backfill 수행
  - blobRef path가 `asset-ingestion/{instanceId}/{YYYY-MM-DD}/{assetId}/{kind}.{ext}` 패턴 일치 → `blobKeyVersion="v0.2"`
  - blobRef path가 `asset-ingestion/{instanceId}/{kind}/{YYYY-MM-DD}/{assetId}.{ext}` 패턴 일치 → `blobKeyVersion="v0.3"`
  - 양쪽 패턴 모두 미일치 → migration fail + sink alert (운영자 명시 정정 필요)


**v0.2 → v0.3 blob key format migration**:
- v0.2 key: `asset-ingestion/{instanceId}/{YYYY-MM-DD}/{assetId}/{kind}.{ext}`
- v0.3 key: `asset-ingestion/{instanceId}/{kind}/{YYYY-MM-DD}/{assetId}.{ext}` (kind를 prefix로)
- **policy**:
  - **lazy rewrite** (기본): 신규 asset만 v0.3 format 사용. 기존 v0.2 blob은 그대로 두고 `IngestedAsset.blobKeyVersion` 필드(`"v0.2" | "v0.3"`)로 분기 — signed URL 발급 시 version별 path 사용
  - **eager migration** (선택): 운영자 명시 액션 `migrateBlobKeysV02toV03(instanceId, dryRun)` — super-admin 전용. 모든 v0.2 blob을 v0.3 path로 copy + 기존 v0.2 삭제 (또는 별도 archive). audit log `asset-ingestion-blob-key-migrated-v02-v03` (AI-18 audit cascade 후속)
  - v0.2 key 허용 기간: v1.x release까지. v2.0에서 v0.2 path read 제거 — manifest validator가 lazy rewrite 권고 → eager migration 강제

### 13.4 runtime invariant·reconcile (AI3-02 + AI3-12 SemVer 정책 — 별도 분리)

호출 입력 검증 아닌 운영 invariant — 감지 시 reconcile job + 외부 sink alert:

- **AssetPromotionRecord stale** (AI4-04 join key 명시):
  - status="checking" + checkStartedAt < now()-30분 → `UPDATE WHERE status='checking'` SET status="failed", lastError="checker-timeout"
  - status="pending-commit" + checkCompletedAt < now()-10분 → **3종 존재 검사 (AI4-04 + AI5-01 targetContentRef null 처리)**:
    - **Core row 조회 분기** (AI5-01):
      - targetContentRef 존재 시 → `WHERE @provenanceAssetId=assetId AND @id=targetContentRef`
      - targetContentRef IS NULL (crash 전 미채움) → `WHERE @provenanceAssetId=assetId` (해당 targetContentType 테이블). 정확히 1건이면 targetContentRef를 backfill 후 committed 후보. 0건 또는 2+건이면 → status="failed", lastError="commit-stalled-targetref-null" + sink alert
    - ComplianceRecord: `WHERE contentRef=targetContentRef AND recordPhase='pre-publish' AND recordVersion=1` (Core row 조회 후 확정된 targetContentRef 사용)
    - AssetIngestionNotificationOutbox: `WHERE sourceKind='asset' AND sourceId=assetPromotionRecord.assetId AND eventType='asset-ingestion-asset-promoted'`
    - **3종 모두 존재 → status="committed"**, commitCompletedAt=Core row @createdAt + targetContentRef backfill (필요 시)
    - **0건 또는 partial 존재 → status="failed"**, lastError="commit-stalled-partial" + 외부 sink alert (운영자가 partial row 정리)
  - status="committed" + audit log 미존재 (24h) → audit 재기록 3회. 실패 시 sink alert
- **outbox stale**: claimedAt > 5분 → 재claim (notifications 동등)
- **AssetIngestionNotificationOutbox dispatch-failed-permanent** 누적 임계 초과 → 운영팀 alert
- **`ExtractedContent.piiDetected` denormalized drift 감지** (AI4-07): `piiDetected != (exists AssetPiiFinding for assetId)` 감지 시 backfill + 외부 sink alert

### 13.5 warning — v0.1 § 13.3 유지 (변경 없음)

---

## 14. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| AI-01 | SNS platform별 ToS 위반 위험 — Glitzy vs 클라이언트 책임 분리 | 법무 검토 (게이트는 v1.0 fail로 강제) |
| AI-02 | 외부 사이트 인용 저작권 검토 | 법무 검토 |
| AI-03 | SNS 자료 사용 동의 절차 | 클라이언트 사전 협의 |
| AI-04 | 추가 source type (Notion·구글 드라이브 등) | v1.x |
| AI-05 | LLM 태깅 prompt 카탈로그·다국어 | M2+ |
| AI-06 | PII 감지 LLM 기반 정밀도 향상 | M2+ |
| AI-07 | duplicate fuzzy matching | M2+ |
| AI-08 | OCR 활성화 (LLM 기반) | v1.x |
| AI-09 | 의료광고 카탈로그 자동 매핑 | M2+ |
| AI-10 | 검수자 라운드로빈·assignment | M2+ |
| AI-11 | auto-promote mode + LLM 자동 매핑 | v1.x |
| AI-12 | 비디오 frame extraction | v1.x |
| AI-13 | retroactive promote | M2+ |
| AI-14 | ARCHITECTURE § 11.1 content-migration 정의 cascade (F-16) | ARCHITECTURE 문서 후속 |
| AI-15 | autoApproveRiskLevel="Low" 운영 정책·근거 | v1.x |
| AI-16 | signed URL refresh client SDK·blob signed URL renewal strategy | 인프라 결정 (search-visibility SV-14 동등) |
| AI-17 | v1.x promote 지원 contentType 확장 (ReviewPolicy·PricingPage·LocationProfile 등) | v1.x |
| AI-18 | `asset-ingestion-blob-key-migrated-v02-v03` audit cascade (eager migration 시) | v1.x patch (운영 시 운영자 명시 액션) |

---

## 15. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 |
| 2026-05-14 | v0.2 | codex 1차 (22 지적 전건 수용)
| 2026-05-14 | v0.3 | codex 2차 (14 지적 전건 수용)
| 2026-05-14 | v0.4 | codex 3차 (12 지적 전건 수용)
| 2026-05-14 | v0.5 | codex 4차 (12 지적 전건 수용)
| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |

---

## 16. 본 Feature 내부 데이터 구조 (admin DB 11 tables + blob storage)

### 16.1 `IngestionSource`·16.2 `IngestionLog`·16.3 `IngestionSourceAttempt`·16.4 `IngestionRetryQueue`

search-visibility 패턴 동일 (MonitoringLog·MonitoringSourceAttempt·SearchVisibilityCollectionRetryQueue 동등).

### 16.5 `IngestedAsset`

v0.1 § 16.4 유지 + canonicalization 필드 추가:

| 추가 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `rawBlobHash` | string | ✅ | SHA-256 raw bytes |
| `normalizedTextHash` | string | ✅ | SHA-256 정규화 후 text |
| `sourceCanonicalKey` | string | ✅ | sourceId + canonical URL/filename |
| `blobKeyVersion` | enum (`v0.2`·`v0.3`) | ✅ | (AI4-08) 신규 row default `v0.3`. v0.2 row는 lazy rewrite (§ 13.3). signed URL 발급 worker가 version별 path 분기 |

**Constraints**: `UNIQUE(instanceId, normalizedTextHash)` (duplicate 차단).
**Index**: `(instanceId, sourceId, sourceCanonicalKey)`, `(expiresAt)`.

### 16.6 `ExtractedContent` (AI3-06·AI4-09 — rawBody SoT + body materialized view)

v0.1 § 16.5 + 다음 정정:
- **`rawBody`** (Markdown — redaction 전 원본. AssetPiiFinding offset SoT. legal·super-admin만 read. IAM 정책으로 보호)
- **`body`** (Markdown — **materialized view**: rawBody + AssetPiiFinding(reviewStatus="true-positive" AND redactionApplied=true) redaction operations로 자동 재생성). **직접 편집 금지** (AI4-09). 수동 redaction은 detector="manual"인 AssetPiiFinding 추가로 수행 → body는 redaction worker가 재생성
- **rebuild trigger** (AI5-03): 다음 이벤트 발생 시 `RedactionRebuildJob(assetId, extractedContentId, sourceVersion)` enqueue:
  - `ExtractedContent.rawBody` update
  - `AssetPiiFinding` insert / update(reviewStatus·redactionApplied·redactionMode 변경) / delete
  - worker는 sourceVersion 입력으로 idempotent 처리. 동일 sourceVersion 중복 enqueue는 1회만 처리. 결과는 body·bodyVersion(+1)·piiDetected·piiRedacted를 단일 transaction에서 원자 갱신
- `piiDetected`·`piiRedacted` boolean — denormalized summary (AI4-07 reconcile invariant 적용)
- `bodyVersion` integer — rawBody·AssetPiiFinding 변경 시 1씩 증가 (caching·drift 추적)
- 상세는 § 16.7

### 16.7 `AssetPiiFinding` (신설 — F-14)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `assetId` | UUID | ✅ — FK IngestedAsset |
| `extractedContentId` | UUID | ✅ — FK ExtractedContent |
| `type` | enum (`email`·`phone`·`ssn`·`rrn`·`other`) | ✅ |
| `offsetStart`·`offsetEnd` | integer | ✅ — **`ExtractedContent.rawBody` 내 위치 (AI3-06 — redaction 전 원본 기준)**. redacted view 위치는 별도 `redactedOffsetStart`·`redactedOffsetEnd` 필드 또는 mapping 계산 |
| `redactedOffsetStart`·`redactedOffsetEnd` | integer | optional — redaction 적용 후 view 내 위치 (null = redaction으로 사라진 영역). 재검수·false-positive 복원에 사용 |
| `contextHash` | string | ✅ — SHA-256(rawBody의 finding 주변 ±50자 context). 원문 보존 없이도 재현성 확인 가능 |
| `detector` | enum (`regex`·`checksum`·`manual`) | ✅ — **v1.0은 llm detector 미지원** (AI2-07. v1.x에서 LLM 활성화 시 provider allowlist·promptVersion·data minimization·raw PII 외부 전송 금지 또는 명시 승인 예외·audit metadata 정의 — AI-06 cascade) |
| `confidence` | number (0~1) | optional |
| `redactionApplied` | boolean | ✅ |
| `redactionMode` | enum (`mask`·`remove`) | optional |
| `reviewStatus` | enum (`open`·`true-positive`·`false-positive`) | ✅ — AI3-05 단순화. `resolved`는 의미 모호로 제거 |
| `reviewedBy`·`reviewedAt` | string·Date | optional |
| `detectedAt` | Date | ✅ |

**Index**: `(assetId)`, `(reviewStatus, detectedAt)`.

### 16.8 `AssetTag` — v0.1 § 16.6 유지

### 16.9 `AssetReviewRecord` (F-15 rightsReview + AI5-05 reviewVersion)

v0.1 § 16.7 + `rightsReview` 객체 + **`reviewVersion: integer required`** (AI5-05):
- promote transaction의 CAS 입력 (§ 8.2 3.a)
- 다음 변경 시 증가: asset content review status 변경(approved/rejected) · rightsReview 상태/evidence/history 변경 · AssetPiiFinding 변경(드물게)



```ts
rightsReview: {
  required: boolean,                      // 외부 URL·SNS·환자 후기·전후사진 감지 시 true
  status: "pending" | "approved" | "rejected" | "not-required",
  currentReviewedBy?: string,             // 마지막 reviewer (legal 검수자 자격 검증 — REVIEW_WORKFLOW § 11.2)
  currentReviewedAt?: Date,
  evidenceAttachments: Array<{
    kind: "copyright-license"|"consent-form"|"author-permission"|"public-domain"|"fair-use-note",
    blobRef: string,
    addedBy: string,
    addedAt: Date,
    superseded: boolean                   // 새 증빙으로 대체된 경우 true (삭제 금지 — append-only)
  }>,
  consentEvidenceRef?: string,
  history: Array<{                        // AI2-04 — append-only 변경 이력
    timestamp: Date,
    actorId: string,
    actorRole: string,
    action: "status-changed"|"evidence-added"|"evidence-superseded"|"reviewer-assigned",
    fromStatus?: string,
    toStatus?: string,
    note?: string
  }>
}
```

**증빙 삭제 금지** (AI2-04): evidenceAttachments는 append-only. 잘못 추가된 증빙은 `superseded: true` 마킹 + history에 evidence-superseded 기록. 물리 삭제 금지.

**reviewer 자격 검증**: rightsReview.status 변경 시 currentReviewedBy의 AdminUser.approverRoleEligibility에 `"legal"` 포함 필수 (REVIEW_WORKFLOW § 11.2 정합). 미충족 시 403.

**action별 권한 매트릭스 + UI 표시 정책** (AI3-10):

| action | 허용 권한 | UI 표시 |
|---|---|---|
| `status-changed` (approved/rejected) | legal-reviewer·super-admin | 검수 큐 detail panel |
| `evidence-added` | operator·legal-reviewer·super-admin | 증빙 첨부 폼 (모두 가능) |
| `evidence-superseded` | legal-reviewer·super-admin (operator 불가) | 활성 증빙 옆 "supersede" 버튼 (legal 자격만 노출) |
| `reviewer-assigned` | super-admin (operator 불가) | 검수자 배정 폼 |

UI 기본 표시: 최신 status + active(superseded=false) evidence. superseded evidence와 history는 **audit drawer**에서 legal-reviewer·super-admin에게만 노출.

### 16.10 `AssetPromotionRecord` (AI4-01 — 풀 스키마 전개)

| 필드 | 타입 | required | 설명 |
|---|---|:---:|---|
| `id` | UUID | ✅ | |
| `assetId` | UUID | ✅ — FK IngestedAsset | |
| `targetContentType` | enum (Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem) | ✅ | v1.0 closed union 5종 |
| `targetContentRef` | string | optional → ✅ when status="committed" | Core row @id. transaction 3.h에서 채움 |
| `status` | enum (`checking`·`pending-commit`·`committed`·`failed`) | ✅ | 4상태 머신 |
| `targetMappingJson` | JSON | ✅ | TargetMapping 결과 |
| `checkResultVersion` | string | optional | 2단계 check() 결과 식별자 |
| `reviewVersionSnapshot` | integer | ✅ | promote 시점 AssetReviewRecord.reviewVersion (CAS 입력) |
| `promotedBy` | string | ✅ | AdminUser @id |
| `checkStartedAt` | Date | ✅ | |
| `checkCompletedAt` | Date | optional | |
| `commitStartedAt` | Date | optional | transaction 3.a |
| `commitCompletedAt` | Date | optional | transaction 3.i commit |
| `failedAt` | Date | optional | |
| `lastError` | string | optional | gate-race-failure·checker-timeout·commit-stalled-partial 등 |
| `createdAt`·`updatedAt` | Date | ✅ | |

**Index**: `(status, checkStartedAt)` partial where status='checking' (reconcile worker query), `(status, checkCompletedAt)` partial where status='pending-commit', `(assetId)`.
**Constraints**: `FK assetId ON DELETE RESTRICT`. status committed 시 targetContentRef NOT NULL invariant — § 13.4 reconcile.

### 16.11 `AssetIngestionNotificationOutbox` (F-18 구체화 — keyword-monitoring § 13.8 패턴 동일)

| 필드 | 타입 | required |
|---|---|:---:|
| `id` | UUID | ✅ |
| `sourceKind` | enum (`ingestion-log`·`asset`·`pii-finding`) | ✅ |
| `sourceId` | string | ✅ |
| `eventType` | NotificationEventType | ✅ |
| `payloadJson` | JSON | ✅ |
| `sourceEventId` | string | ✅ — `hash("asset-ingestion:" + sourceKind + ":" + sourceId + ":" + eventType)` |
| `claim` | enum | ✅ — not-claimed·claimed-pending·dispatched·dispatch-failed-retryable·dispatch-failed-permanent |
| `claimedAt`·`dispatchedAt` | Date | optional |
| `attempts` | integer | ✅ |
| `lastError` | string | optional |
| `notificationEventId`·`notificationReceiptState` | string | optional |
| `createdAt` | Date | ✅ |

**Constraints**: `UNIQUE(sourceKind, sourceId, eventType)`.
**Index**: `(claim, claimedAt)`.

### 16.12 Blob storage (S3 — F-19)

object key format: `asset-ingestion/{instanceId}/{kind}/{YYYY-MM-DD}/{assetId}.{ext}` (kind=`raw`·`redacted`·`thumbnail`) — AI2-08 정정: kind를 path prefix로 두어 IAM condition `s3:prefix=asset-ingestion/{instanceId}/raw/*` 적용 가능.

**IAM 정책 SoT** (search-visibility § 13.7 패턴):
- canonical key format 강제
- signed URL 발급 API는 호출자 AdminUser.instanceMemberships 검증
- S3 IAM PrincipalTag condition으로 cross-instance access 차단
- `raw/` prefix는 legal 검수자·super-admin만 read 가능 (PII·민감 원본 보호)
- `redacted/` prefix는 operator·검수자 모두 read 가능
- signed URL TTL 600초 + dashboard refresh client SDK (AI-16 신규 — 인프라 결정)

---
