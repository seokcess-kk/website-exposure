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
session id: 019e38fe-c9f3-7c22-83ff-658b6e690ee6
--------
user
You are reviewing the **code implementation** of `docs/decisions/LOCATION_LEGAL_PLAN.md v1.0` (acceptance · 6 cycle · 59 findings 전건 처리 완료). Your job: produce a strict critique on whether the code faithfully realizes the plan's decisions and is correct/secure/atomic/accessible. This is **cycle 1** of the LOCATION_LEGAL **code** review — assume nothing is sacred.

## SoT to read first

1. `docs/decisions/LOCATION_LEGAL_PLAN.md` — plan SoT (v1.0 acceptance). Decisions: LL-SCHEMA-01~20, LL-FORM-01~15, LL-ACTION-01~21, LL-TEMPLATE-01~07, LL-CASCADE-01~05.
2. `docs/admin/ARCHITECTURE.md` — § 3.2 화면 ② + § 3.8.1/§ 3.8.2 (LL-CASCADE-01 target)
3. `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` — § 5.5 audit matrix + § 8.1 시나리오 (LL-CASCADE-02 target)
4. `docs/core/CONTENT_STANDARDS.md` — § 7 ContentType 예외 (LL-CASCADE-03 target)
5. `docs/decisions/M0_BUILD_EXPORT_PLAN.md` — LL-CASCADE-04 placeholder

## Code under review

| # | File | 역할 |
|---|---|---|
| 1 | `packages/core-content/migrations/C0006_legal_document.sql` | LegalDocument table + RLS + 5종 partial unique |
| 2 | `packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql` | ClinicProfile policy_* + primary_ctas + trigger |
| 3 | `packages/core-content/migrations/C0008_location_profile_parent_clinic.sql` | LocationProfile composite FK |
| 4 | `packages/core-content/src/templates/index.ts` | TEMPLATES record + CLOSED_DOCUMENT_TYPES + alpha sort |
| 5 | `packages/core-content/src/templates/render.ts` | renderTemplate + variable whitelist + TemplateRenderError |
| 6 | `packages/core-content/src/templates/bodies.ts` | 5종 표준 템플릿 Markdown 본문 (PRIVACY/TERMS/NON-COVERED/REFUND/COMPLAINT) |
| 7 | `packages/core-content/src/templates/__tests__.ts` | build-time unknown-key 검증 |
| 8 | `packages/core-content/src/schema.ts` | drizzle schema v0.3 (LegalDocument + ClinicProfile + LocationProfile + content_publication_status enum) |
| 9 | `apps/web/src/lib/clinic-profile-schema.ts` | zod bundle schema (4 sections) + parser helpers + CT-02 변환 |
| 10 | `apps/web/src/lib/errors.ts` | mapDbErrorToResult + MainLocationMissingError |
| 11 | `apps/web/src/components/forms/ClinicProfileForm.tsx` | 3 섹션 + 5 LegalDocument override + a11y + URL scrape prefill |
| 12 | `apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/page.tsx` | initial DB read + round-trip render |
| 13 | `apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts` | saveClinicProfile server action (single tx + 7 audit row + 3단계 안전망) |

## What to check (review principles)

### Plan SoT 합치
- 모든 LL-SCHEMA / LL-FORM / LL-ACTION / LL-TEMPLATE / LL-CASCADE 결정이 코드에 반영됐는가
- 특히 cycle1~6의 patch 결정 (LL-01~LL-59) 이 모두 코드에 살아있는가
- LL-CASCADE-01 (ARCH § 3.8.2 변수 화이트리스트 reference), LL-CASCADE-02 (ADMIN_UI_SKELETON § 5.5 audit matrix), LL-CASCADE-03 (CONTENT_STANDARDS § 7 LegalDocument 면제), LL-CASCADE-04 (M0_BUILD_EXPORT_PLAN placeholder), LL-CASCADE-05 (migrations-runner manifest) 각각 실제 docs/패키지에 반영됐는가 — **반영 안 됐으면 blocking**

### 정합성 / 원자성
- single transaction 안 3계약 + 5 LegalDocument upsert 의 atomic 보장
- 잠금 순서 결정성 (clinic → location main → legal alpha 5종)
- assertHasMainLocationAfterTx 안전망 + MainLocationMissingError → tx rollback 흐름
- audit 7 row sequential emit + per-row try/catch + partial/failed fallback row + 3단계 안전망 (Sentry pre-integration)
- LL-ACTION-08 build-time reference 정합 (LocationProfile.metadata 에 reservationChannels 자체는 저장 안 함 — marker 만)

### 보안 / RLS / 권한
- withSkeletonTx (RLS app_tenant_user) 사용 정합
- clinic_profile_id composite FK 의 cross-tenant 방어
- variable whitelist strict (unknown key throw) · HTML escape 책임 분리
- URL scrape prefill 의 safeUrl(http/https only · max 2048)
- session cookie + cleanup redirect 패턴
- assertActionEligibility('operator-edit-content')

### 데이터 모델
- CHECK constraint: name 1~100, description 80~300, summary 50~160, body 1~200000, slug regex, phone/email regex
- partial UNIQUE 5종 (privacy/terms/non-covered/refund/complaint) — cookie/other 미강제
- status='draft' CHECK + risk_level='Low' CHECK + published_at NULL CHECK (skeleton 제한 3종)
- auto_generated=true → template_version NOT NULL CHECK
- composite FK (instance_id, clinic_profile_id) DEFERRABLE INITIALLY DEFERRED
- DEFAULT vs CHECK 충돌 가능성 (e.g. status DEFAULT 'draft' 와 CHECK status='draft' 의 미래 변경 marker 필요 여부)

### Form UX / 접근성
- a11y: businessHours row aria-labelledby / aria-describedby / aria-controls (LL-FORM-07)
- 5 LegalDocument <details> a11y (LL-FORM-14)
- featuredChannelId validation (primaryCtas[].id 중 하나 매칭)
- 평일 1일 이상 영업 필수 (LL-FORM-03)
- primaryCtas UI subset 3종 SoT token 정확성 (`phone`/`kakao-talk`/`naver-reservation` — 기존 `kakao`/`naver-booking` 잘못된 별명 흔적 없는지)
- 자동 재렌더링 안내문 (LL-FORM-15)
- URL scrape prefill 의 "비어 있는 필드만" 정책

### TypeScript / 코드 품질
- unknown narrowing (parsePrimaryCtas / parseBusinessHoursMetadata)
- enum 일관성 (DAY_TO_ENUM · primaryCtaTypeEnum · ClosedLegalDocumentType)
- error 처리: isNextControlFlowError rethrow · TenantResolveError mapAuthDenyReasonToUi · TemplateRenderError 분기 · MainLocationMissingError 분기
- revalidatePath 범위
- date timezone (Asia/Seoul 명시 LL-ACTION-07 — DB CURRENT_DATE 사용 여부 vs JS new Date)
- effective_date round-trip: page.tsx 의 override 추출 로직 (fallback 과 동일하면 빈 string 보존)

### 시나리오 (LOCATION_LEGAL § 7 + ADMIN_UI § 8.1 cascade)
시나리오 14~22 가 코드에서 실제로 보장되는지:
14. tenant A 본원 저장 → location main 1행 + legal 5행
15. tenant B 가 /A/clinic-profile 접근 → 403
16. legal_document status='published' UPDATE 시도 → CHECK 위반
17. 같은 documentType (closed 5종) 두 번 INSERT → partial UNIQUE 위반
18. businessHours monday.open > monday.close → zod 위반
19. 변수 화이트리스트 외 키 build-time test 실패
20. location_profile.clinic_profile_id 다른 tenant id 변조 → composite FK + RLS WITH CHECK 위반
21. legal_document risk_level='High' UPDATE 시도 → CHECK 위반
22. businessHours 7요일 → CT-02 round-trip 정합

## Output format (markdown — 반드시 이 형식)

```
# LOCATION_LEGAL code v1.0 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=N major=N minor=N (총 N)
- closeableAfterPatch: <true|false>
- 수렴 추세 추적: (이전 cycle 없음 — 본 cycle 이 첫)

## blocking
- **LLC-01**: <짧은 제목>
  - 위치: <file>:<line> 또는 <doc § ...>
  - 근거(plan SoT): LL-... §...
  - 문제: ...
  - 권장 patch: ...

## major
- **LLC-NN**: ...

## minor
- **LLC-NN**: ...

## cascade marker 누락 (있을 경우 blocking)
- ...

## acceptance precondition 위배 (LL-CASCADE-01~05) 점검
- LL-CASCADE-01 (ARCH § 3.8.2): <검증 결과>
- LL-CASCADE-02 (ADMIN_UI § 5.5): <검증 결과>
- LL-CASCADE-03 (CONTENT_STANDARDS § 7): <검증 결과>
- LL-CASCADE-04 (M0_BUILD_EXPORT_PLAN): <검증 결과>
- LL-CASCADE-05 (migrations-runner): <검증 결과>
```

closeableAfterPatch=true 의 정의: 본 cycle 지적 모두 patch 가능 + blocking=0 AND major=0 잔존 (minor 만 잔존 또는 0). 첫 cycle 이므로 보통 false.

가능한 한 광범위하게 보고, 추측이 아니라 파일을 실제로 읽고 line 단위로 인용하라. 한국어로 응답.

codex
요청하신 형식에 맞춰 코드 리뷰 관점으로 진행하겠습니다. 먼저 계획 SoT와 cascade 대상 문서, 그리고 구현 파일들을 실제 라인 단위로 읽어 결정 ID와 코드 반영 여부를 대조하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-Content -Path docs/decisions/LOCATION_LEGAL_PLAN.md | Select-Object -First 260' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"LL-CASCADE|3\\.8\\.2|variable|whitelist|audit matrix|LegalDocument|ContentType|migrations-runner|C000\" docs packages apps -g \"*.md\" -g \"*.ts\" -g \"*.tsx\" -g \"*.sql\"" in C:\Users\assag\solution\website-exposure
 succeeded in 668ms:
packages\core-content\src\templates\__tests__.ts:4:// 모든 표준 템플릿의 unknown variable key 부재 + render round-trip 검증.
packages\core-content\src\templates\__tests__.ts:28:  reason: "unknown-variable" | "render-error";
packages\core-content\src\templates\__tests__.ts:37:    const variables = listTemplateVariables(template.body);
packages\core-content\src\templates\__tests__.ts:38:    for (const v of variables) {
packages\core-content\src\templates\__tests__.ts:42:          reason: "unknown-variable",
packages\core-content\src\templates\__tests__.ts:43:          detail: `template contains unknown variable: ${v}`,
packages\core-content\src\templates\render.ts:6://   policy.* 변수 정당화 (admin/ARCH § 3.8.2 contactPerson 입력 섹션 SoT).
packages\core-content\src\templates\render.ts:51:    public readonly reason: "unknown-variable" | "missing-required-value",
packages\core-content\src\templates\render.ts:52:    public readonly variableKey: string,
packages\core-content\src\templates\render.ts:73:      throw new TemplateRenderError("unknown-variable", key, `unknown variable: ${key}`);
packages\core-content\src\templates\render.ts:93:      throw new TemplateRenderError("unknown-variable", key, `unknown variable: ${key}`);
packages\core-content\src\templates\index.ts:14:export type ClosedLegalDocumentType =
packages\core-content\src\templates\index.ts:21:export type LegalDocumentType = ClosedLegalDocumentType | "cookie" | "other";
packages\core-content\src\templates\index.ts:24:  readonly documentType: ClosedLegalDocumentType;
packages\core-content\src\templates\index.ts:31:export const TEMPLATES: Record<ClosedLegalDocumentType, Template> = {
packages\core-content\src\templates\index.ts:69:export const CLOSED_DOCUMENT_TYPES: readonly ClosedLegalDocumentType[] = [
packages\core-content\src\templates\index.ts:78:export const CLOSED_DOCUMENT_TYPES_ALPHA: readonly ClosedLegalDocumentType[] = [
packages\core-content\src\schema.ts:3:// v0.3: + legal_document (C-16) + clinic_profile policy/primary_ctas (C0007) + location_profile.clinic_profile_id (C0008)
packages\core-content\src\schema.ts:83:    // shape 검증 (CT-03 SoT 11종) 은 raw SQL trigger 로 (C0007 migration). Drizzle schema 안 표현 불가.
packages\core-content\src\schema.ts:245:// === LegalDocument (C-16·LOCATION_LEGAL_PLAN v1.0 § 2.1) ===
apps\spike-c-local\src\sign-url.ts:61:        ContentType: req.contentType,
packages\core-content\src\index.ts:26:  ClosedLegalDocumentType,
packages\core-content\src\index.ts:27:  LegalDocumentType,
apps\spike-c-local\src\seed.ts:40:      ContentType: "text/plain",
packages\storage\src\sign-url.ts:46:      return new PutObjectCommand({ Bucket, Key, ContentType: req.contentType, ContentLength: req.contentLength });
docs\features\notifications.md:123:        LegalDocument: "/admin/legal/{contentRef}"
docs\features\content-migration.md:378:  legalSensitiveEntityChanged: boolean;                  // CM4-08 — LegalDocument·ReviewPolicy·PricingPage·전후사진·후기 contentType class diff
docs\features\content-migration.md:694:| `legal-document` | targetEntityTypes에 `LegalDocument` ∈ entityFieldProjectionCatalogRef |
docs\features\content-migration.md:726:   - **legalSensitiveEntityChanged=true** (LegalDocument·ReviewPolicy·PricingPage·전후사진·후기 contentType class diff) → new-record-version 강제
docs\features\compliance-assistant.md:112:  contentType: ContentType;
docs\features\compliance-assistant.md:113:  featureContentType?: FeatureContentTypeId;
docs\features\compliance-assistant.md:155:- `metadata.pageTypeId` 미지정 시 — check()가 `contentType` + `pageMeta` 기반으로 자동 유도 (예: `contentType="LegalDocument"` → P-013). 유도 불가 시 fail (§ 11 빌드 검증)
docs\features\compliance-assistant.md:157:- **`contentType="Feature"` 예외** (`features/asset-ingestion.md` AI3-10·AI4-10 cascade): `featureContentType="feature:asset-ingestion"` 인 raw asset check 호출 시 — pageTypeId·articleType 미지정 허용. feature-scoped + global rules만 적용 (pageType-specific rules 적용 안 함). inferredRiskLevel은 finding severity 기반 보수적 산정 (content-gate/fail 1+ 시 Medium·High)
docs\features\compliance-assistant.md:212:   - § 5.1.2 컨텍스트별 false-positive 완화 적용 — `LegalDocument.documentType`·`LocationProfile` 안내 필드·`Article articleType=notice` 등에서 RiskLevel 격상 제외
docs\features\compliance-assistant.md:392:- LegalDocument.documentType별 제외
docs\features\compliance-assistant.md:433:  featureContentType,                   // (있을 때) Feature 콘텐츠 식별
docs\features\compliance-assistant.md:556:     - `legal` — `contentType === "LegalDocument"` 시 자동 (C-10·C-16 required)
docs\features\compliance-assistant.md:608:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5개 지적 전건 수용)**: (1) § 3.1·§ 3.3 inferredRiskLevel을 CONTENT_STANDARDS § 7.1 SoT 정합으로 — 외부 채워 전달은 신뢰 사용, 미지정 시 내부 자동. (2) **RISK_LEVELS § 2.3.1 cascade** — RiskInferenceResult.steps[] 표준화. triggeredBy 판정 근거를 SoT에 정식 정의, (3) § 3.3 내부 동작 순서에서 inlineRiskFlags 추출을 flag별 산출 방식 분리로 정정 (잔재 해소), (4) § 10.3 비활성 모드 finalRoles에 LegalDocument legal·priorReviewRequired legal 기본 게이트 자동 보존 명시 (REVIEW_WORKFLOW § 4.1 정합), (5) cacheKey에 `strictMode` 포함 — automatedDecision 산출에 영향 |
docs\features\asset-ingestion.md:93:- `snsApi.<platform>` 필드에 `legalApproved`·`legalApprovedBy`·`legalApprovedAt`·`approvedAccountIds[]`·`allowedContentTypes[]`·`consentEvidenceRef` 추가 — F-12 게이트
docs\features\asset-ingestion.md:112:| `asset-ingestion-asset-promoted` | `"asset:" + assetId` | targetContentType·targetContentRef·targetMappingSummary·promotedBy | operator·super-admin |
docs\features\asset-ingestion.md:153:- `snsApi.<platform>.enabled=true` + (`legalApproved !== true` 또는 승인자/시각 누락 또는 `approvedAccountIds` 빈 배열 또는 `allowedContentTypes` 빈 배열) → build fail
docs\features\asset-ingestion.md:156:- `allowedContentTypes` (post·comment·story·reel 등) 검증 — 외 type item도 skip
docs\features\asset-ingestion.md:174:  featureContentType: "feature:asset-ingestion",       // 신설 — DATA_MODEL C-10 v0.5 패턴
docs\features\asset-ingestion.md:236:  targetContentType: TargetContentType;
docs\features\asset-ingestion.md:240:type TargetContentType = "Article" | "TreatmentPage" | "MedicalConditionPage" | "FAQ" | "NewsItem";
docs\features\asset-ingestion.md:449:| `asset-ingestion-asset-promoted` | `asset` | assetId | `"asset:" + assetId` | `"Core 변환 완료 — ${targetContentType}"` | assetId·targetContentType·targetContentRef·assetPromotionRecordId |
docs\features\asset-ingestion.md:502:- `snsApi.<platform>.enabled=true` + 법무 게이트 누락 (legalApproved·approvedAccountIds·allowedContentTypes 등) (F-12)
docs\features\asset-ingestion.md:520:- **`promoteAsset` targetContentType이 v1.0 unsupported** (AI3-09 — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 외) → fail + AssetTag `manualProcessingRequired=true` 마킹 (asset 상태는 approved 유지. 어드민 UI manual Core editor 경로. manual 생성 Core row는 `provenanceAssetId` 필드 보존)
docs\features\asset-ingestion.md:550:      - targetContentRef IS NULL (crash 전 미채움) → `WHERE @provenanceAssetId=assetId` (해당 targetContentType 테이블). 정확히 1건이면 targetContentRef를 backfill 후 committed 후보. 0건 또는 2+건이면 → status="failed", lastError="commit-stalled-targetref-null" + sink alert
docs\features\asset-ingestion.md:598:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5 minor 지적 전건 수용)**: (1) **§ 13.4 reconcile targetContentRef null edge case** — targetContentRef IS NULL 시 `@provenanceAssetId` 기반 Core row 조회·backfill (AI5-01), (2) **§ 8.2 commitStartedAt rollback 명시** — 3.a update는 abort와 함께 rollback (AI5-02), (3) **§ 16.6 body materialized view rebuild trigger** — RedactionRebuildJob enqueue 규칙·sourceVersion idempotent (AI5-03), (4) **§ 13.3 blobKeyVersion null backfill** — blobRef path 패턴 기반 자동 backfill·미일치 시 migration fail (AI5-04), (5) **§ 16.9 AssetReviewRecord.reviewVersion integer required 추가** — promote CAS 입력 SoT (AI5-05): (1) **§ 16.10 AssetPromotionRecord 풀 스키마 전개** — 4상태 머신·forensic 필드·index (AI4-01), (2) **promote transaction 3.a AssetPromotionRecord row lock + status CAS** — `WHERE status='pending-commit'` (AI4-02), (3) **failed 분기 별도 transaction** — gate-race-failure 등 (AI4-03), (4) **reconcile join key 명시** — Core row(@provenanceAssetId·targetContentRef)·ComplianceRecord(contentRef)·outbox(sourceKind/sourceId/eventType) 3종 존재 검사 (AI4-04), (5) **TreatmentPageTargetMapping C-03 정합** — process: ProcessStep[]·programVariants: ProgramVariant[]·하위 타입 재사용 (AI4-05), (6) **ArticleTargetMapping closed union 전개** — `... 그 외 C-04` 잔재 제거. C-04 v0.4 required/optional 모두 명시 (AI4-06), (7) **PII gate AssetPiiFinding 기준** — piiDetected boolean은 표시용 summary. reconcile invariant 추가 (AI4-07), (8) **§ 16.5 blobKeyVersion enum 추가** — v0.2·v0.3 (AI4-08), (9) **body materialized view 정책** — rawBody + AssetPiiFinding redaction operations 자동 재생성. 직접 편집 금지·bodyVersion·detector="manual" finding으로만 수동 redaction (AI4-09), (10) **compliance-assistant § 3.3 Feature contentType 예외 cascade** (AI4-10), (11) **DATA_MODEL § 2.2 공통 메타 필드 `@provenanceAssetId` 추가** — Core 데이터 계약 모든 row에 보존 (AI4-11), (12) **§ 7.1 asset content review 권한 vs § 16.9 rightsReview 권한 분리** 명시 (AI4-12): (1) **AssetPromotionRecord 상태 머신 분리** — checking·pending-commit·committed·failed + forensic 필드(checkStartedAt 등) (AI3-01), (2) **§ 13.4 runtime invariant·reconcile worker SoT 신설** — promote stale·outbox stale 감지·정리 (AI3-02), (3) **promote transaction 내 row lock + 게이트 재평가** — AssetReviewRecord.reviewVersion CAS (AI3-03), (4) **AssetIngestionNotificationOutbox insert를 promote transaction 안으로** (AI3-04), (5) **PII gate enum 정확화** — true-positive AND redactionApplied=true OR false-positive만 허용. resolved enum 제거 (AI3-05), (6) **AssetPiiFinding offset SoT를 rawBody로** + ExtractedContent.rawBody 신설 + contextHash·redactedOffset 추가 (AI3-06), (7) **blob key v0.2 → v0.3 migration 정책** — lazy rewrite 기본 + eager migration command (AI3-07. AI-18 신설), (8) **TargetMapping 5종 closed union 펼침** — Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem 각 SoT 필드 (AI3-08), (9) **unsupported contentType manual hand-off** — AssetTag manualProcessingRequired·provenanceAssetId (AI3-09), (10) **rightsReview action별 권한 매트릭스 + UI 표시 정책** — operator·legal·super-admin (AI3-10), (11) **PII 운영 지표 추가** — candidate count·checksum pass rate·true/false-positive rate·redaction SLA (AI3-11), (12) **§ 1.1 runtime invariant·reconcile SemVer policy 행** — keyword-monitoring § 1.1 동등 (AI3-12): (1) **promote 트랜잭션 외부 호출 분리** — check()는 transaction 밖. AssetPromotionRecord status 머신(pending·committed·failed) (AI2-01·02), (2) **rightsReview embedded 객체 결정 통일 + history[] append-only + reviewer 자격 검증** (AI2-03·04), (3) **closed union 5종 외 contentType v1.0 미지원 명시** + AI-17 신규 (AI2-05), (4) **RRN checksum 정확 공식** — 가중치 [2,3,4,5,6,7,8,9,2,3,4,5] + `(11-(sum%11))%10` (AI2-06), (5) **PII LLM detector v1.0 금지** — enum 제거. v1.x 활성화 시 provider allowlist·promptVersion·data minimization 정의 (AI2-07), (6) **blob key format kind를 prefix로** — `asset-ingestion/{instanceId}/{kind}/{date}/{assetId}.{ext}` (AI2-08), (7) **monitor-only 모순 정리** — notifications 필수, monitor-only 모드 없음 (AI2-09), (8) **outbox sourceKind/sourceId 매핑 표** + PII는 asset 단위 1건 dedupe (AI2-10), (9) **SNS adapter authorAccountId·ownerAccountId 검증** — 공유글·리그램 quarantine (AI2-11), (10) **Feature contentType raw asset check 예외 명시** — pageTypeId/articleType 미지정 허용·feature-scoped/global rules만 (AI2-12), (11) **AI-16 누락 보완** + AI-17 신설 (AI2-13), (12) **§ 7.2 잔재 문구 제거** (AI2-14): (1) **DATA_MODEL C-08 v0.18 cascade** — assetIngestionConfig·assetIngestionPolicyVersion·AssetIngestionApprovedScope 신설 (F-1), (2) **REVIEW_WORKFLOW § 9.1·§ 9.1.1 cascade** — 5종 NotificationEventType + 매트릭스 5행 (F-2), (3) **`asset-ingestion-pii-detected` criticality=critical + quietHours bypass** (F-3), (4) **REVIEW_WORKFLOW § 10.2.1 cascade** — 5종 AuditAction + § 3.1.1 audit contract 표 (F-4), (5) **compliance-assistant check() 입력 정확화** — contentType="Feature"·featureContentType·contentRef·body·metadata (F-5), (6) **compliance-assistant 의존성 정합** — 의료기관 + 본 Feature 활성 시 build fail or 예외 승인 (F-6), (7) **promote closed union TargetMapping** — contentType별 SoT 필수 필드 (F-7), (8) **promote 흐름 — REVIEW_WORKFLOW 진입 지점 명세** — Core row + ComplianceRecord pre-publish + review-queued (F-8), (9) **autoApproveRiskLevel·auto-promote 분리** — v1.0 null 강제 (F-9), (10) **AssetIngestionApprovedScope 별도 정의** — SerpCrawlerApprovedScope SERP 특화 필드 제거·자산 수집 특화 (F-10), (11) webCrawl approvedScope null·targetDomains·allowCaptchaBypass build fail (F-11), (12) **SNS API 법무 게이트** — legalApproved·approvedAccountIds·allowedContentTypes·consentEvidenceRef (F-12), (13) **rrn 탐지 정밀화** — 후보 추출 + 생년월일 유효성 + checksum 검증 (F-13), (14) **AssetPiiFinding 테이블 신설** (10 → 11 tables) — 발견 내역 구조화 (F-14), (15) **§ 7.2 promote 게이트** — rightsReview·PII 처리·저작권 증빙 (F-15), (16) **content-migration 경계 정합** — promote는 본 Feature 책임. ARCHITECTURE cascade AI-14 (F-16), (17) **contentHash canonicalization** — rawBlobHash·normalizedTextHash·sourceCanonicalKey (F-17), (18) **AssetIngestionNotificationOutbox 구체화** — sourceKind/sourceId/eventType UNIQUE + NotificationEvent 매핑 표 (F-18), (19) blob storage IAM 정책 search-visibility § 13.7 패턴 명시 (F-19), (20) § 16 인벤토리 재산정 11 tables (F-20), (21) § 11.1 표 컬럼 정정 (F-21), (22) § 1.1 변경 정책 cascade 컬럼 구체화 (F-22) |
docs\features\asset-ingestion.md:713:| `targetContentType` | enum (Article·TreatmentPage·MedicalConditionPage·FAQ·NewsItem) | ✅ | v1.0 closed union 5종 |
apps\spike-c-local\src\scenarios\test-range-request.ts:20:    ContentType: "application/octet-stream",
packages\core-content\migrations\C0008_location_profile_parent_clinic.sql:1:-- @glitzy/core-content — C0008 LocationProfile parentClinic (LOCATION_LEGAL_PLAN v1.0)
packages\core-content\migrations\C0008_location_profile_parent_clinic.sql:2:-- Precondition: C0001 clinic_profile + clinic_profile_instance_id_unique · C0002 location_profile
packages\core-content\migrations\C0007_clinic_profile_policy_vars.sql:1:-- @glitzy/core-content — C0007 ClinicProfile policy vars + primaryCtas (LOCATION_LEGAL_PLAN v1.0)
packages\core-content\migrations\C0007_clinic_profile_policy_vars.sql:2:-- Precondition: C0001 clinic_profile
packages\core-content\migrations\C0006_legal_document.sql:1:-- @glitzy/core-content — C0006 LegalDocument (DATA_MODEL C-16·LOCATION_LEGAL_PLAN v1.0)
packages\core-content\migrations\C0006_legal_document.sql:2:-- Precondition: D0010 instance · C0004 content_publication_status enum · C0005 risk_level enum
apps\spike-d\src\env.ts:1:// Spike D — environment variable resolver
apps\spike-c-local\src\scenarios\provider-smoke.ts:48:    await client.send(new PutObjectCommand({ Bucket: env.S3_BUCKET, Key: key, Body: `instance=${instanceId} index=${i}`, ContentType: "text/plain" }));
apps\spike-c-local\src\scenarios\provider-smoke.ts:105:  await root.send(new PutObjectCommand({ Bucket: env.S3_BUCKET, Key: largeKey, Body: Buffer.alloc(100, 0x41), ContentType: "application/octet-stream" }));
packages\core-content\migrations\C0005_article.sql:1:-- @glitzy/core-content — C0005 Article (DATA_MODEL C-04·v0.2 patch)
packages\core-content\migrations\C0005_article.sql:3:-- M0-02·03 cycle2: enum 통합 (C0004에서 정의)
packages\core-content\migrations\C0004_treatment_page.sql:1:-- @glitzy/core-content — C0004 TreatmentPage (DATA_MODEL C-03·v0.2 patch)
packages\core-content\migrations\C0003_doctor_profile.sql:1:-- @glitzy/core-content — C0003 DoctorProfile (DATA_MODEL C-02·minimal v0.1)
packages\core-content\migrations\C0002_location_profile.sql:1:-- @glitzy/core-content — C0002 LocationProfile (DATA_MODEL C-21·minimal v0.1)
apps\spike-c-local\src\errors.ts:23:export class ContentTypeMismatchError extends Error {
apps\spike-c-local\src\errors.ts:24:  override readonly name = "ContentTypeMismatchError";
docs\decisions\PACKAGES_STRUCTURE.md:26:│   ├── migrations-runner/   (Spike D)
docs\decisions\PACKAGES_STRUCTURE.md:38:shared-types ← shared-errors ← db ← {auth, storage, notifications-outbox, migrations-runner}
docs\decisions\PACKAGES_STRUCTURE.md:45:- `auth`·`storage`·`notifications-outbox`·`migrations-runner`: `db` + 자체 외부 dep (R2 SDK·Resend·etc)
docs\decisions\PACKAGES_STRUCTURE.md:55:| D | `migrations-runner` | migrate.ts (advisory lock + deploy coordinator + drift check + forward-only + schema-wide reset + 11-class guard) |
docs\decisions\PACKAGES_STRUCTURE.md:92:  - `@glitzy/auth`·`@glitzy/storage`·`@glitzy/notifications-outbox`·`@glitzy/migrations-runner`
docs\decisions\PACKAGES_STRUCTURE.md:176:### migrations-runner integration
docs\decisions\PACKAGES_STRUCTURE.md:178:`@glitzy/migrations-runner`가 모든 package manifest를 topological sort·dependency 순서 보장·`migration_ledger`에 통합 기록:
docs\decisions\PACKAGES_STRUCTURE.md:183:apps/web·apps/worker는 단일 `pnpm migrate:apply` 명령으로 모든 package migration 통합 apply. cycle 2+에서 migrations-runner 실 구현.
docs\decisions\PACKAGES_STRUCTURE.md:192:본 문서는 **Phase 0 Week 2 시작 시점의 5 core package** (db·auth·storage·notifications-outbox·migrations-runner) + 2 supporting (shared-types·shared-errors) 만 다룬다. Week 4~6에 추가 packages 분리.
packages\core-content\migrations\C0001_clinic_profile.sql:1:-- @glitzy/core-content — C0001 ClinicProfile (DATA_MODEL C-01·minimal v0.1)
apps\spike-c-local\src\env.ts:1:// Spike C — environment variable resolver
docs\decisions\M0_SCHEMA_PLAN.md:76:| @glitzy/core-content | C | C0001~C0008 (M0 core) |
docs\decisions\M0_SCHEMA_PLAN.md:122:| **M0-07** migrations-runner manifest·depends_on | packages/migrations-runner v0.3 separate scope | Spike D LOCAL_PASS 패턴 (advisory lock·drift check 등)을 production module로 승격하는 별도 작업·M0 schema와 독립 |
docs\decisions\M0_BUILD_EXPORT_PLAN.md:3:> **상태**: **v0.1 (placeholder)** — `LOCATION_LEGAL_PLAN.md` v1.0 acceptance 의 LL-CASCADE-04 precondition 으로 신설. 실 plan content 는 M0 v1.0 본 구현 (`apps/worker` build/export 함수) 진입 시점에 합류.
docs\decisions\M0_BUILD_EXPORT_PLAN.md:9:- `docs/admin/ARCHITECTURE.md` v0.7 § 3 Vertical Slice · § 3.8.1·3.8.2 자동 생성 규칙 · § 3.11 완료 게이트 #1
docs\decisions\M0_BUILD_EXPORT_PLAN.md:11:- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.0 — LL-CASCADE-04 책임 명시 (본 문서 의 cascade target)
docs\decisions\M0_BUILD_EXPORT_PLAN.md:12:- `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0 — § 5.5 audit matrix · § 6 actions
docs\decisions\M0_BUILD_EXPORT_PLAN.md:22:### 1.2 LL-CASCADE-04 책임 (LOCATION_LEGAL_PLAN v1.0 cascade)
docs\decisions\M0_BUILD_EXPORT_PLAN.md:33:| LegalDocument body | `legal_document.body` (rendered Markdown · 변수 치환 완료) | `<documentType>.md` 본문 |
docs\decisions\M0_BUILD_EXPORT_PLAN.md:34:| LegalDocument metadata | documentType · title · effective_date · template_version · contact_person · contact_email | frontmatter YAML |
docs\decisions\M0_BUILD_EXPORT_PLAN.md:36:### 1.3 LL-CASCADE-04 외 (M0 v1.0 합류 시점에 확장)
docs\decisions\M0_BUILD_EXPORT_PLAN.md:61:| 2026-05-16 | v0.1 | LOCATION_LEGAL_PLAN v1.0 acceptance precondition 으로 placeholder 신설. LL-CASCADE-04 책임 명시 (ClinicProfile.locations / LocationProfile.parentClinic·reservationChannels / primary_ctas `id` → `@id` alias). |
docs\decisions\LOCATION_LEGAL_PLAN.md:1:# LocationProfile(main) + LegalDocument 자동 생성 plan (v1.0·acceptance·2026-05-16)
docs\decisions\LOCATION_LEGAL_PLAN.md:5:> **acceptance commit 구성 (cycle2 LL-33 · cycle5 LL-56 acceptance precondition)**: 본 commit 에 다음 5 cascade 동시 포함 — (1) LOCATION_LEGAL_PLAN.md v1.0 (본 문서), (2) LL-CASCADE-01 docs/admin/ARCHITECTURE.md § 3.8.2 patch, (3) LL-CASCADE-02 docs/decisions/ADMIN_UI_SKELETON_PLAN.md § 5.5 patch, (4) LL-CASCADE-03 docs/core/CONTENT_STANDARDS.md § 7 patch, (5) LL-CASCADE-04 docs/decisions/M0_BUILD_EXPORT_PLAN.md v0.1 placeholder (작성 완료). LL-CASCADE-05 (packages/migrations-runner manifest spec) 은 manifest 파일 신설 정도 — 실 runner 코드 acceptance 는 LL-DEFER-20 (M0 v1.0 본 구현).
docs\decisions\LOCATION_LEGAL_PLAN.md:7:본 문서는 `docs/admin/ARCHITECTURE.md` v0.7 § 3.8.1 (LocationProfile(main) 자동 생성 규칙) · § 3.8.2 (LegalDocument 자동 생성 규칙) 을 M0 어드민에서 구현하기 위한 plan이다. ClinicProfile 화면 한 화면에서 **3계약 동시 출력** (`ClinicProfile` + `LocationProfile`(slug=`main`) + `LegalDocument`(5종)) 을 단일 server action transaction 안에서 수행한다.
docs\decisions\LOCATION_LEGAL_PLAN.md:11:> **scope limit (LL-INTRO-01)** — cycle1 LL-03·LL-04 patch: 본 plan 은 LegalDocument **draft 저장만** 다룬다. `review-queued` 도 차단 — 그 전이는 ComplianceRecord pre-publish row + NotificationEvent envelope (REVIEW_WORKFLOW § 5.2 / § 3.1) 발송이 함께 작동해야 한다. 이 둘은 모두 compliance-assistant Feature + ComplianceRecord UI cascade 까지 defer. 본 plan 의 LegalDocument 는 `status='draft'` 강제 (CHECK). 발행 게이트 자체는 LL-DEFER-01.
docs\decisions\LOCATION_LEGAL_PLAN.md:15:- `docs/admin/ARCHITECTURE.md` v0.7 § 3.2 화면 ② · § 3.8.1 · § 3.8.2 — 자동 생성 규칙 SoT
docs\decisions\LOCATION_LEGAL_PLAN.md:16:- `docs/core/DATA_MODEL.md` v0.9 — C-01 ClinicProfile · C-16 LegalDocument · C-21 LocationProfile · CT-02 BusinessHours · CT-03 CTAConfig
docs\decisions\LOCATION_LEGAL_PLAN.md:18:- `docs/core/CONTENT_STANDARDS.md` v1.3 — cycle1 LL-13 patch: 경로 정정 (admin/CONTENT_STANDARDS 아님). Markdown 본문 검증 (answer-first AST · 표현 검사) 의 LegalDocument 면제 규약 (§ 7 ContentType 예외 표 — LegalDocument 면제 marker).
docs\decisions\LOCATION_LEGAL_PLAN.md:19:- `docs/compliance/RISK_LEVELS.md` v1.1 · `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0 — `LegalDocument: legalCounsel/legalCounselAt required` 의 위험도 Low 예외 게이트 (RL § 4.3)
docs\decisions\LOCATION_LEGAL_PLAN.md:20:- `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0 (ADMIN-UI-15·62 marker · § 5.5 audit matrix · § 6.2 actions · § 8.1 RLS 시나리오)
docs\decisions\LOCATION_LEGAL_PLAN.md:23:  - `packages/core-content/migrations/C0001_clinic_profile.sql` · `C0002_location_profile.sql` (location_profile 은 instance_id 만 FK · clinic_profile 직접 FK 없음 — cycle1 LL-01 patch 대상)
docs\decisions\LOCATION_LEGAL_PLAN.md:34:- ClinicProfile 화면을 § 3.2/§ 3.8.1/§ 3.8.2 정합으로 진화 — 한 화면, **3계약 동시 출력**.
docs\decisions\LOCATION_LEGAL_PLAN.md:43:| `legal_document` 테이블 신설 (C-16 minimal) | packages/core-content C0006 migration · RLS · 5종 documentType partial UNIQUE (cycle1 LL-08) |
docs\decisions\LOCATION_LEGAL_PLAN.md:46:| `saveClinicProfile` actions 확장 | 단일 tx 안 ClinicProfile + LocationProfile(main) + 5종 LegalDocument upsert · 변수 치환 · audit 7 row 별도 emit (cycle1 LL-17 patch) |
docs\decisions\LOCATION_LEGAL_PLAN.md:50:| 5종 LegalDocument 별 effective_date input | cycle1 LL-15 patch — LL-DEFER-08 reversal. 5 record 별 individual input · default = policy_effective_date |
docs\decisions\LOCATION_LEGAL_PLAN.md:57:| LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제) · `review-queued` 전이 + ComplianceRecord pre-publish + NotificationEvent | compliance-assistant Feature + ComplianceRecord UI cascade | LL-INTRO-01 / LL-DEFER-01 |
docs\decisions\LOCATION_LEGAL_PLAN.md:58:| LegalDocument `status=published` 발행 자체 | apps/worker + Git commit cascade | LL-DEFER-01 |
docs\decisions\LOCATION_LEGAL_PLAN.md:62:| LegalDocument 수동 작성 모드 (autoGenerated=false) | M1 Phase Alpha — Markdown 에디터 합류 시점 | LL-DEFER-03 |
docs\decisions\LOCATION_LEGAL_PLAN.md:65:| LegalDocument body 직접 수동 override | M1 Phase Alpha | LL-DEFER-06 |
docs\decisions\LOCATION_LEGAL_PLAN.md:67:| ~~5종 LegalDocument 각각의 effective_date individual override~~ | cycle1 LL-15 patch — **v0.2 에서 합류** (form 에서 5 record 별 input) | (closed) |
docs\decisions\LOCATION_LEGAL_PLAN.md:70:| LegalDocument body 검증 (CONTENT_STANDARDS § 7 ContentType 예외 marker 명시 + 면제 범위 cascade) | cycle1 LL-13 patch — CONTENT_STANDARDS § 7 의 LegalDocument 면제 marker 가 plan SoT cascade. 본 plan 에서 추가 검증 룰 미정의 | LL-DEFER-11 |
docs\decisions\LOCATION_LEGAL_PLAN.md:79:-- packages/core-content/migrations/C0006_legal_document.sql
docs\decisions\LOCATION_LEGAL_PLAN.md:155:-- packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql
docs\decisions\LOCATION_LEGAL_PLAN.md:201:    -- DB key = 'id' (Git 출력 시 '@id' alias 변환은 LL-CASCADE-04 build/export 책임)
docs\decisions\LOCATION_LEGAL_PLAN.md:230:- (LL-SCHEMA-09) 별도 column (metadata JSONB 가 아닌) — 폼 schema 검증 + LegalDocument 변수 치환의 필수 입력값.
docs\decisions\LOCATION_LEGAL_PLAN.md:232:- (LL-SCHEMA-11 · cycle1 LL-15 patch) `policy_effective_date` 는 form 안 5 LegalDocument record 의 default 만. 운영자가 각 record 별 override 가능 (LL-DEFER-08 closed).
docs\decisions\LOCATION_LEGAL_PLAN.md:242:-- packages/core-content/migrations/C0008_location_profile_parent_clinic.sql
docs\decisions\LOCATION_LEGAL_PLAN.md:308:### 3.1 ClinicProfileForm 3 섹션 + 5 LegalDocument record (LL-FORM-01)
docs\decisions\LOCATION_LEGAL_PLAN.md:315:| **(d) 5종 LegalDocument** (신규 보조 details — cycle1 LL-15 patch) | 5 record 별 effectiveDate override (optional · 미입력 시 policyEffectiveDate default) | `LegalDocument` × 5 |
docs\decisions\LOCATION_LEGAL_PLAN.md:318:- (LL-FORM-02) 한 화면 한 폼 (single `<form action>`) — server action 한 번 호출로 3계약 + 5 LegalDocument 동시 출력. 부분 저장 (섹션별 저장) 안 함.
docs\decisions\LOCATION_LEGAL_PLAN.md:320:- (LL-FORM-04 · cycle1 LL-14 patch) 섹션 (c) 는 LegalDocument 생성에 필수 — policyContactPerson · policyContactEmail · policyContactPhone · policyEffectiveDate **4 필드 모두 required**. (한국 PIPA 의 개인정보 보호책임자 필수 고지 항목 — 소속/부서 같은 추가 필드는 LL-DEFER 또는 자유 입력 textarea 로 처리. v0.2 는 4 필드만 minimal.)
docs\decisions\LOCATION_LEGAL_PLAN.md:323:- (LL-FORM-07 · cycle1 LL-23 + cycle2 LL-35 patch) businessHours UI: 7 요일 행. 각 행: `[휴진 ☐]` + `오픈 [HH:mm] 마감 [HH:mm]` + `[점심 ☐]` + `점심 시작 [HH:mm] 종료 [HH:mm]`. 휴진 checked 시 다른 입력 disabled. **a11y 요구**: 각 row 에 `aria-labelledby` (요일 헤더 link) + 각 input `aria-describedby` (요일 에러 메시지 id) + 휴진 toggle 의 `aria-controls` (해당 row 의 input group id). **5 LegalDocument override details a11y (LL-FORM-14)**: `<details>` `<summary>` 는 기본적으로 keyboard interaction (Space/Enter toggle) + `aria-expanded` 자동. 추가로 `<summary>` 안에 정책 이름 + `(시행일: <date>)` 시각 표시 + `aria-controls` (override 입력 group id) + override 입력에 `aria-labelledby` (summary id) 명시.
docs\decisions\LOCATION_LEGAL_PLAN.md:348:  // cycle1 LL-18 patch: LegalDocument 편집은 skeleton 단계 status=draft + risk_level=Low 의 CHECK 로 제한.
docs\decisions\LOCATION_LEGAL_PLAN.md:360:- (LL-ACTION-02) 3계약 + 5 LegalDocument 모두 같은 tx — RLS 정합 + atomic 출력. 하나 실패 = 전체 rollback.
docs\decisions\LOCATION_LEGAL_PLAN.md:361:- (LL-ACTION-03 · cycle1 LL-17 patch) audit `content-saved` 는 tx commit 후 **7 row 별도 emit** — ClinicProfile 1 + LocationProfile 1 + LegalDocument 5. 각 row 의 payload 는 기존 통일 shape `{contentType, slug, mode, status, originalSlug}`. `ClinicProfileBundle` outer 폐기. analytics/test 호환 보존.
docs\decisions\LOCATION_LEGAL_PLAN.md:364:- (LL-ACTION-06 · cycle1 LL-16 + cycle3 LL-46 patch) **자동 재렌더링 분기 제거** — v0.4 는 LegalDocument 본문 수동 편집 차단 (LL-DEFER-06) 이므로 모든 row 가 templateVersion=current. 매 저장 시 모든 LegalDocument body 재렌더링. **운영자 알림 marker (LL-FORM-15 · 폼 (d) 상단 안내문)**: "본원 정보(기관명·법인명·사업자번호·설립자·본원 주소·전화·이메일) 또는 정책 변수(담당자·이메일·전화·시행일)를 수정하면 5종 정책 문서 본문이 자동으로 다시 생성됩니다. 본문 직접 수정은 추후 단계에서 합류합니다." 향후 수동 override 도입 시 별도 `body_source` enum (`auto`/`manual`) 컬럼 cascade.
docs\decisions\LOCATION_LEGAL_PLAN.md:366:- (LL-ACTION-08 · cycle1 LL-02 + cycle3 LL-45 patch — LL-SCHEMA-12·LL-SCHEMA-18 통일) LocationProfile 자동 상속 = **build-time reference (deep clone)**. server action 안 DB 저장은 `metadata.reservationChannelsInheritedFrom = "clinic_profile.primary_ctas"` marker 만 (의도 명시용). 실제 출력 시점은 apps/worker · M0 v1.0 build/export 의 책임 (LL-CASCADE-04 marker 신설).
docs\decisions\LOCATION_LEGAL_PLAN.md:389:  policy: {                  // cycle1 LL-06 patch: admin/ARCH § 3.8.2 의 contactPerson 입력 섹션 = policy.* 변수 출처. SoT 정당화.
docs\decisions\LOCATION_LEGAL_PLAN.md:393:    effectiveDate: string;   // YYYY-MM-DD (LegalDocument 별 override 결과)
docs\decisions\LOCATION_LEGAL_PLAN.md:406:- (LL-ACTION-16 · cycle1 LL-06 + cycle2 LL-33 patch) `policy.*` 변수 정당화 — admin/ARCH § 3.8.2 의 `contactPerson` 필드 + § 3.8.2 결정 ("ClinicProfile 폼 '정책 변수' 보조 섹션") 이 SoT 출처. ARCH 본문에 `policy.*` 변수가 명시되지 않은 것은 ARCH 의 변수 사용 sample 일 뿐. **acceptance 전 순서 정합 (cycle2 LL-33)**: 본 plan v1.0 acceptance **와 동시 또는 직전에** ARCH § 3.8.2 patch (LL-CASCADE-01) 적용 — plan acceptance commit 안에 ARCH 패치 포함. plan 단독 acceptance 시 ARCH SoT 충돌 잔존하므로 cascade 가 acceptance precondition.
docs\decisions\LOCATION_LEGAL_PLAN.md:417:// row 3~7 (5종 LegalDocument)
docs\decisions\LOCATION_LEGAL_PLAN.md:418:{ "eventType": "content-saved", "payload": { "contentType": "LegalDocument",   "slug": "privacy", "mode": "...", "status": "draft", "originalSlug": "privacy",
docs\decisions\LOCATION_LEGAL_PLAN.md:434:- (LL-ACTION-19 · cycle1 LL-17 patch) ADMIN_UI_SKELETON_PLAN § 5.5 audit matrix cascade — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed 별도 row 추가 marker (LL-CASCADE-02). 기존 ClinicProfile row 와 동일 통일 shape.
docs\decisions\LOCATION_LEGAL_PLAN.md:469:export type LegalDocumentType =
docs\decisions\LOCATION_LEGAL_PLAN.md:473:  documentType: LegalDocumentType;
docs\decisions\LOCATION_LEGAL_PLAN.md:487:- (LL-TEMPLATE-05 · cycle1 LL-06 patch) 변수 화이트리스트 (admin/ARCH § 3.8.2 SoT cascade marker LL-CASCADE-01 — ARCH 본문에 본 표 reference 추가):
docs\decisions\LOCATION_LEGAL_PLAN.md:492:- (LL-TEMPLATE-07 · cycle1 LL-13 patch) **LegalDocument body 검증 면제 명시** — `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표에 LegalDocument 추가 (cascade marker LL-CASCADE-03). 면제 범위: (1) answer-first AST 미적용 (정책 문서는 첫 문장 답 제시 구조 아님) (2) 표현 검사 (recommend/best 등 광고 표현) 미적용 (3) 변수 화이트리스트 검증은 별도 룰 (LL-ACTION-12).
docs\decisions\LOCATION_LEGAL_PLAN.md:499:  2. `packages/core-content/migrations/C0001_clinic_profile.sql` (clinic_profile) — precondition
docs\decisions\LOCATION_LEGAL_PLAN.md:500:  3. `packages/core-content/migrations/C0002_location_profile.sql` (location_profile) — precondition
docs\decisions\LOCATION_LEGAL_PLAN.md:501:  4. `packages/core-content/migrations/C0004_treatment_page.sql` (content_publication_status enum 생성) — **C0006 의 precondition**
docs\decisions\LOCATION_LEGAL_PLAN.md:502:  5. `packages/core-content/migrations/C0005_article.sql` (risk_level enum 생성) — **C0006 의 precondition**
docs\decisions\LOCATION_LEGAL_PLAN.md:503:  6. `packages/core-content/migrations/C0006_legal_document.sql` — legal_document table (status::content_publication_status + risk_level::risk_level FK)
docs\decisions\LOCATION_LEGAL_PLAN.md:504:  7. `packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql` — clinic_profile ALTER (policy_* + primary_ctas)
docs\decisions\LOCATION_LEGAL_PLAN.md:505:  8. `packages/core-content/migrations/C0008_location_profile_parent_clinic.sql` — location_profile ALTER (clinic_profile_id composite FK)
docs\decisions\LOCATION_LEGAL_PLAN.md:506:- 부분 적용 환경에서 C0006 을 C0004/C0005 보다 먼저 시도하면 enum 없음 에러 — migration runner 가 sequential apply 보장.
docs\decisions\LOCATION_LEGAL_PLAN.md:518:| 16 | LegalDocument 행을 `app_tenant_user` 가 `status='published'` 로 UPDATE 시도 | CHECK 위반 → formError ("정책 문서는 현재 단계에서 발행 상태로 변경할 수 없습니다") — cycle1 LL-19 patch |
docs\decisions\LOCATION_LEGAL_PLAN.md:519:| 17 | LegalDocument 같은 documentType (closed 5종) 두 번 INSERT | partial UNIQUE 위반 (LL-SCHEMA-02) |
docs\decisions\LOCATION_LEGAL_PLAN.md:523:| 21 | LegalDocument risk_level='High' UPDATE 시도 | CHECK 위반 (LL-SCHEMA-06) → formError |
docs\decisions\LOCATION_LEGAL_PLAN.md:530:| 1 | C0006 legal_document migration | packages/core-content/migrations/C0006_legal_document.sql |
docs\decisions\LOCATION_LEGAL_PLAN.md:531:| 2 | C0007 clinic_profile policy + primaryCtas migration | packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql |
docs\decisions\LOCATION_LEGAL_PLAN.md:532:| 3 | C0008 location_profile clinic_profile_id migration | packages/core-content/migrations/C0008_location_profile_parent_clinic.sql |
docs\decisions\LOCATION_LEGAL_PLAN.md:534:| 5 | zod schema (businessHours · primaryCtas · policy vars · 5 LegalDocument override) | apps/web/src/lib/clinic-profile-schema.ts |
docs\decisions\LOCATION_LEGAL_PLAN.md:535:| 6 | ClinicProfileForm 3 섹션 + 5 LegalDocument record 재구성 (a11y marker 적용) | apps/web/src/components/forms/ClinicProfileForm.tsx |
docs\decisions\LOCATION_LEGAL_PLAN.md:538:| 9 | content-saved audit matrix row 추가 (LocationProfile · LegalDocument) | ADMIN_UI_SKELETON_PLAN § 5.5 cascade marker (LL-CASCADE-02) |
docs\decisions\LOCATION_LEGAL_PLAN.md:539:| 10 | admin/ARCHITECTURE.md § 3.8.2 변수 화이트리스트 reference 추가 | LL-CASCADE-01 |
docs\decisions\LOCATION_LEGAL_PLAN.md:540:| 11 | docs/core/CONTENT_STANDARDS.md § 7 LegalDocument 예외 marker 추가 | LL-CASCADE-03 |
docs\decisions\LOCATION_LEGAL_PLAN.md:547:- `LL-DEFER-01`: LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제 · review-queued 전이 + ComplianceRecord pre-publish + NotificationEvent envelope · status=published). compliance-assistant Feature + ComplianceRecord UI cascade.
docs\decisions\LOCATION_LEGAL_PLAN.md:548:- `LL-DEFER-09`: LegalDocument 편집 권한 분리 (operator-edit-legal ActionType — REVIEW_WORKFLOW 14 ActionType cascade).
docs\decisions\LOCATION_LEGAL_PLAN.md:549:- `LL-DEFER-11`: LegalDocument body 검증 — CONTENT_STANDARDS § 7 ContentType 예외 marker cascade (LL-CASCADE-03). 추가 검증 룰은 compliance-assistant Feature.
docs\decisions\LOCATION_LEGAL_PLAN.md:552:- `LL-DEFER-20` (cycle4 LL-53 patch): packages/migrations-runner 실 runner 코드 — manifest spec 작성 (plan v1.0 acceptance precondition) 후 sequential apply + fail-fast 구현. M0 v1.0 본 구현.
docs\decisions\LOCATION_LEGAL_PLAN.md:557:- `LL-DEFER-03`: LegalDocument 수동 작성 모드 (autoGenerated=false · Markdown 에디터).
docs\decisions\LOCATION_LEGAL_PLAN.md:558:- `LL-DEFER-06`: LegalDocument body 수동 override · `body_source` enum cascade.
docs\decisions\LOCATION_LEGAL_PLAN.md:584:- ~~`LL-DEFER-08`~~: cycle1 LL-15 patch — 5종 LegalDocument 별 effectiveDate override 합류 완료 (v0.2 acceptance).
docs\decisions\LOCATION_LEGAL_PLAN.md:588:> **acceptance 순서 정합 (cycle2 LL-33)**: LL-CASCADE-01 은 plan v1.0 acceptance 와 **동시 또는 직전** 에 ARCH patch 적용 (plan acceptance commit 안 포함). LL-CASCADE-02 · LL-CASCADE-03 · LL-CASCADE-04 도 동일 정책. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
docs\decisions\LOCATION_LEGAL_PLAN.md:590:- `LL-CASCADE-01`: `docs/admin/ARCHITECTURE.md` § 3.8.2 표 — body 변수 화이트리스트 11개 (clinic 4 + location 3 + policy 4) reference 추가. ARCH v0.8 patch. **acceptance precondition**.
docs\decisions\LOCATION_LEGAL_PLAN.md:591:- `LL-CASCADE-02`: `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` § 5.5 audit matrix — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed row 추가. **acceptance precondition**.
docs\decisions\LOCATION_LEGAL_PLAN.md:592:- `LL-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표 — LegalDocument 면제 marker 추가 (answer-first AST · 표현 검사 면제 · 변수 화이트리스트 별도 룰). **acceptance precondition**.
docs\decisions\LOCATION_LEGAL_PLAN.md:593:- `LL-CASCADE-04` (cycle3 LL-41 + cycle4 LL-49 + **cycle5 LL-56 patch — placeholder 실 파일 작성 완료**): **cascade target 정정** — ADMIN_UI_SKELETON_PLAN § 6 은 walking skeleton 의 actions 영역으로 build/export 부재 → **`docs/decisions/M0_BUILD_EXPORT_PLAN.md` (v0.1 placeholder · 2026-05-16 작성 완료)** + 본 plan 의 LL-CASCADE-04 marker reference. apps/worker · M0 v1.0 Git export 책임: LocationProfile.reservationChannels Git 출력 시 `clinic_profile.primary_ctas` deep clone, LocationProfile.@id = `"main"`, LocationProfile.parentClinic = ClinicProfile.@id reference, ClinicProfile.locations[] = SELECT 결과, primary_ctas DB key `id` → Git output `@id` alias 변환. **acceptance 강도 = placeholder 작성 완료** (`docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 1.2 LL-CASCADE-04 책임 표 명시). 실 구현은 M0 v1.0 본 구현.
docs\decisions\LOCATION_LEGAL_PLAN.md:594:- `LL-CASCADE-05` (cycle3 LL-42 + cycle4 LL-53 patch): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장. **acceptance 강도 명시** — plan v1.0 acceptance 는 **manifest spec 작성까지만 차단** (manifest 파일 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` 의 spec 작성 + 본 plan 의 8단계 의존성 표 cascade). 실 runner 코드 구현은 M0 v1.0 cascade (LL-DEFER-20 신설). 즉 plan v1.0 acceptance ≠ runner 코드 acceptance.
docs\decisions\LOCATION_LEGAL_PLAN.md:601:| 2026-05-16 | v0.2 | **Codex 비평 cycle1 25 findings (7 blocking + 12 major + 6 minor) 전건 수용 patch**: (LL-01) location_profile 에 clinic_profile_id composite FK + main row CHECK, ClinicProfile.locations[] Git 출력 빌드 시점 동적 구성. (LL-02) ClinicProfile.primary_ctas 컬럼 + LocationProfile.reservationChannels = primary_ctas 자동 상속 marker. (LL-03·04) status='draft' 만 허용 (review-queued 도 차단) — ComplianceRecord pre-publish + NotificationEvent 합류 시점까지 defer. (LL-05) businessHours SoT CT-02 형식 (openingHours[]·receptionHours[]·lunchBreaks[]·specialClosures[]) 변환 + server action 안 convertToOpeningHoursSpec 명시. (LL-06) policy.* 변수 정당화 + LL-CASCADE-01 cascade marker. (LL-07) 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha. (LL-08·09) partial UNIQUE — closed 5종만. cookie/other LL-DEFER-12. (LL-10) C-21 출력 매핑표 명시. (LL-11) representativeDoctors v0.2 빈 배열. (LL-12) risk_level NOT NULL + CHECK 'Low' 만. (LL-13) SoT 경로 정정 (docs/core/CONTENT_STANDARDS.md) + LL-CASCADE-03. (LL-14) policyContactPhone form 단계 required. (LL-15) effective_date individual override 합류 (LL-DEFER-08 closed). (LL-16) 자동 재렌더링 분기 제거 (모든 row 매 저장 시 재렌더링). (LL-17) audit 7 row 별도 emit (Bundle outer 폐기). (LL-18) RBAC 분리 marker LL-DEFER-09 명시. (LL-19) published CHECK 위반 시 운영자 메시지 + errors.ts 매핑. (LL-20) phone regex 한국 + 국제 표기 명시. (LL-21) effective_date timezone Asia/Seoul. (LL-22) template_version naming autoGenerated=true 일 때만 필수. (LL-23) businessHours a11y marker. (LL-24) detection 시점 server action runtime + build-time test cascade. (LL-25) LL-DEFER-08~10 본문 §1 비범위 표 반영. |
docs\decisions\LOCATION_LEGAL_PLAN.md:602:| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
docs\decisions\LOCATION_LEGAL_PLAN.md:603:| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
docs\decisions\LOCATION_LEGAL_PLAN.md:604:| 2026-05-16 | v0.5 | **Codex 비평 cycle4 8 findings (2 blocking + 4 major + 2 minor) 전건 수용 patch**: (LL-48) trigger RAISE EXCEPTION USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' 추가 — errors.ts mapDbErrorToResult 가 SQLSTATE 23514 + constraint name 으로 분기 가능. (LL-49) LL-CASCADE-04 target 정정 — ADMIN_UI_SKELETON_PLAN § 6 은 actions 영역으로 build/export 부재. 신규 `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 신설 + LL-CASCADE-04 책임 row 1건 cascade. acceptance 강도 = placeholder 작성. (LL-50) CT-03 enum SoT 정렬 — DB trigger 허용 11종 (phone/email/sms/kakao-talk/kakao-channel/naver-reservation/naver-talk/form/map/external/video-consultation) + UI subset 3종 분리. LL-DEFER-19 8종 UI 합류. (LL-51) form (b) UI copy 정정 — kakao → kakao-talk · naver-booking → naver-reservation 토큰. (LL-52) LL-DEFER-04/05 phase 충돌 정정 — §9.3 → M0 v1.0 본 구현 (LocationProfile 편집 화면) 으로 통일. M2 Phase Beta 표기 제거 (현재 비어 있음 — 외부 사용자 RBAC 가 M2). (LL-53) LL-CASCADE-05 강도 명시 — plan v1.0 acceptance = manifest spec 작성만 차단, 실 runner 코드는 LL-DEFER-20 (M0 v1.0). (LL-54) trigger function IMMUTABLE 마킹 제거 — VOLATILE 기본 (NEW 읽기 + row-specific RAISE 정합). (LL-55) Sentry pre-integration fallback 명시 — v0.5 단계 console/server stdout only, M0 v1.0 LL-DEFER-18 합류 후 Sentry capture. **누계 55 findings 전건 수용**. |
docs\decisions\LOCATION_LEGAL_PLAN.md:605:| 2026-05-16 | v0.6 | **Codex 비평 cycle5 3 findings (1 blocking + 0 major + 2 minor) 전건 수용 patch**: (LL-56) `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 실 파일 작성 완료 (v0.1 — §1.2 LL-CASCADE-04 책임 표 포함). (LL-57) LL-DEFER-19 phase 단일화 — §9.1 M0 v1.0 그룹 → §9.2 M1 Phase Alpha 그룹 으로 이동 ("M0 v1.0 또는 M1" 모호 표현 정정). M0 v0.5 의 3종 subset 으로 1호 클라이언트 출시 가능 명시. (LL-58) Sentry SDK 초기화 위치 = `apps/web/src/lib/observability.ts` (init + captureException + addBreadcrumb helper) 한 줄 명시 — LL-DEFER-18 내. **누계 58 findings 전건 수용**. |
docs\decisions\LOCATION_LEGAL_PLAN.md:606:| 2026-05-16 | **v1.0** | **Codex 비평 cycle6 1 minor finding (LL-59) 수용 + closeableAfterPatch=true 확정 acceptance**: (LL-59) §2.2 본문 "M0 v1.0 또는 M1 cascade" → "M1 Phase Alpha cascade" 단일화 (LL-DEFER-19 § 9.2 위치와 정합). **수렴 추세 25→12→10→8→3→1 · blocking 0 · major 0 · minor 0 잔존**. cycle6 결과 acceptance commit 5 cascade (LL-CASCADE-01~05) 동시 포함 결정. **누계 59 findings 전건 처리 완료**. |
apps\web\src\lib\errors.ts:3:// LOCATION_LEGAL_PLAN v1.0 (cycle3 LL-44 + cycle4 LL-48): LegalDocument + LocationProfile + clinic_profile policy/primary_ctas + MainLocationMissingError
apps\web\src\lib\errors.ts:22:  // ClinicProfile (C0001)
apps\web\src\lib\errors.ts:29:  // DoctorProfile (C0003)
apps\web\src\lib\errors.ts:34:  // TreatmentPage (C0004)
apps\web\src\lib\errors.ts:41:  // Article (C0005)
apps\web\src\lib\errors.ts:49:  // ClinicProfile policy + primary_ctas (C0007 · LOCATION_LEGAL_PLAN v1.0)
apps\web\src\lib\errors.ts:55:  // LocationProfile parentClinic (C0008 · LL-SCHEMA-14)
apps\web\src\lib\errors.ts:58:  // LegalDocument (C0006 · LOCATION_LEGAL_PLAN v1.0)
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:7:> **본 skeleton의 위상 명시**: 이 walking skeleton의 ClinicProfile 폼은 admin/ARCHITECTURE § 3.2 화면 ②의 **완성이 아닌 auth/RLS/form wiring proof**다. 화면 ② 완성은 ClinicProfile + LocationProfile(main) + LegalDocument 3계약 동시 출력을 요구하며 M0 v1.0 본 구현에서 합류한다 (ADMIN-UI-15).
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:17:- `docs/admin/ARCHITECTURE.md` v0.7 (§ 3 Vertical Slice · § 3.2 화면 ② 3계약 동시 출력 · § 3.8.1/3.8.2 자동 생성 규칙 · § 7 인증·권한 · § 10 미결정) — admin 위상 SoT
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:32:  - `packages/core-content/migrations/C0001_clinic_profile.sql` `GRANT SELECT,INSERT,UPDATE,DELETE ON clinic_profile TO app_tenant_user` + `USING/WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)` (cycle8 정정 ADMIN-UI-102 — NULLIF 패턴은 unset context 의 silent deny 를 보장하며 § 8.1 시나리오의 fail-closed 전제)
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:53:> **M0 화면 ② 축소판 marker (ADMIN-UI-15)**: skeleton의 ClinicProfile 폼은 single contract(ClinicProfile DB row) 만 저장하며, admin/ARCHITECTURE § 3.2의 "ClinicProfile + LocationProfile(main) + LegalDocument 3계약 동시 출력" 은 M0 v1.0 본 구현에서 합류한다.
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:60:| LegalDocument 자동 생성 (admin/ARCH § 3.8.2) — **skeleton 은 발행/출시 판단 없음**: P-013 Legal/Policy 는 admin/ARCH 의 출시 게이트지만 skeleton 에는 발행 자체가 없으므로 release readiness 의미 없음 (ADMIN-UI-62) | M0 v1.0 |
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:601:| `clinic_profile` · `location_profile` · `doctor_profile` · `treatment_page` · `article` | `packages/core-content/migrations/C0001~C0005.sql` | M0_SCHEMA v0.1 |
docs\decisions\ADMIN_UI_SKELETON_PLAN.md:703:| 2026-05-15 | v0.4 | **cycle3 patch (18 findings · major 12 · minor 6 · nit 0 전건 처리)**: (1) ADMIN-UI-45 § 5.4 audit reason taxonomy vs UI deny reason 분리 명시 — packages/auth audit internal reason 4종(user-not-found · super-admin-not-switched · super-admin-selected-mismatch · membership-not-found-or-inactive) 별도 마커, packages/auth v0.3 normalize cascade, (2) ADMIN-UI-46 peekSessionUserId → getActiveSession 사용으로 § 6.2 정정, (3) ADMIN-UI-47 admin_user upsert 를 withServiceRole(adminUserUpsert) 안에서 수행하도록 § 5.5 matrix 정정, (4) ADMIN-UI-48·58 seed audit_log direct INSERT 제거 → audit_event 사용 (audit_log 의 instance_id NOT NULL 회피) + § 7.1 migration precondition 표 정정, (5) ADMIN-UI-49 § 5.5 audit_log query ORDER BY occurred_at, (6) ADMIN-UI-50 § 5.1 cookie fixed window + DB session sliding window asymmetric refresh 보안 모델 명시, (7) ADMIN-UI-51 § 3.2 sign-out 흐름 getActiveSession → revokeSession → emit + tampered cookie 분기 (session-revoked-anonymous), (8) ADMIN-UI-52 § 12 shared-types cascade 중복 제거 — 선행 precondition 단일화, (9) ADMIN-UI-53 § 7 DATABASE_URL 권한을 'SET ROLE postgres 가능한 admin role' 로 좁힘, (10) ADMIN-UI-54 slug-lookup-not-found 를 audit_event 별도 emit 으로 명시 (slugResolver 책임), (11) ADMIN-UI-55 § 5.4 SignInReason union 별도 정의 (AuthDenyReason + no-active-membership + magic-link-rejected), (12) ADMIN-UI-56 redirect('/404') → notFound(), (13) ADMIN-UI-57 content-saved audit best-effort try/catch + gate happy-path 명시 + transactional outbox cascade marker, (14) ADMIN-UI-59 § 10 W-01~W-07 최종 결정 한 줄씩, (15) ADMIN-UI-60 PACKAGES_STRUCTURE cascade 'verify only' 로 정정, (16) ADMIN-UI-61 § 9 게이트 precondition 명시, (17) ADMIN-UI-62 deferred 표 LegalDocument 행에 'skeleton 은 발행/출시 판단 없음' 안전 문구 추가 |
apps\web\src\lib\clinic-profile-schema.ts:3:// ClinicProfile + LocationProfile(main) + 5 LegalDocument override 통합 zod schema SoT.
apps\web\src\lib\clinic-profile-schema.ts:9://   - 5종 LegalDocument effectiveDate override (LL-FORM-13 · cycle3 LL-39 flat key + parser helper)
apps\web\src\lib\clinic-profile-schema.ts:12:import { CLOSED_DOCUMENT_TYPES, type ClosedLegalDocumentType } from "@glitzy/core-content";
apps\web\src\lib\clinic-profile-schema.ts:231:// === Section (c) Policy variables ===
apps\web\src\lib\clinic-profile-schema.ts:253:// === Section (d) 5 LegalDocument effectiveDate override (cycle3 LL-39 flat key) ===
apps\web\src\lib\clinic-profile-schema.ts:256:  z.enum(CLOSED_DOCUMENT_TYPES as unknown as [ClosedLegalDocumentType, ...ClosedLegalDocumentType[]]),
apps\web\src\lib\clinic-profile-schema.ts:307:): Record<ClosedLegalDocumentType, string | undefined> {
apps\web\src\lib\clinic-profile-schema.ts:308:  const result: Partial<Record<ClosedLegalDocumentType, string | undefined>> = {};
apps\web\src\lib\clinic-profile-schema.ts:313:  return result as Record<ClosedLegalDocumentType, string | undefined>;
packages\migrations-runner\src\index.ts:1:// @glitzy/migrations-runner — Spike D LOCAL_PASS 승격 (placeholder·v0.1)
packages\core-content\dist\templates\__tests__.d.ts:3:    reason: "unknown-variable" | "render-error";
packages\core-content\dist\templates\render.d.ts:23:    readonly reason: "unknown-variable" | "missing-required-value";
packages\core-content\dist\templates\render.d.ts:24:    readonly variableKey: string;
packages\core-content\dist\templates\render.d.ts:26:    constructor(reason: "unknown-variable" | "missing-required-value", variableKey: string, message: string);
docs\core\SCHEMA_MAPPING.md:778:| C-16 `LegalDocument` | `WebPage`만 (정책 페이지는 검색 노출 우선순위 낮음) | |
packages\core-content\dist\templates\index.d.ts:1:export type ClosedLegalDocumentType = "privacy" | "terms" | "non-covered" | "refund" | "complaint";
packages\core-content\dist\templates\index.d.ts:2:export type LegalDocumentType = ClosedLegalDocumentType | "cookie" | "other";
packages\core-content\dist\templates\index.d.ts:4:    readonly documentType: ClosedLegalDocumentType;
packages\core-content\dist\templates\index.d.ts:10:export declare const TEMPLATES: Record<ClosedLegalDocumentType, Template>;
packages\core-content\dist\templates\index.d.ts:11:export declare const CLOSED_DOCUMENT_TYPES: readonly ClosedLegalDocumentType[];
packages\core-content\dist\templates\index.d.ts:12:export declare const CLOSED_DOCUMENT_TYPES_ALPHA: readonly ClosedLegalDocumentType[];
docs\core\PAGE_TYPES.md:24:- **P-014 LocationProfile(main)·P-013 LegalDocument는 어드민 화면 추가 없이 ClinicProfile 화면의 기관 정체성 + 본원 위치·연락·시간 입력 + Core 표준 템플릿으로 자동 생성** (SoT: 위치·시간·연락은 LocationProfile이 마스터). 단지점·다지점 통일 처리.
docs\core\PAGE_TYPES.md:48:| P-013 | Legal / Policy | `/privacy`, `/terms` 등 | `LegalDocument` | ✅ (자동 생성) |
docs\core\PAGE_TYPES.md:424:**주 데이터 계약**: `LegalDocument`
docs\core\PAGE_TYPES.md:429:- 빌드 시 `LegalDocument` 인스턴스 데이터 + **ClinicProfile 변수** (`{{clinic.name}}`·`{{clinic.legalEntityName}}`·`{{clinic.businessRegistrationNumber}}`·`{{clinic.founder}}`) + **LocationProfile(main) 변수** (`{{location.main.address}}`·`{{location.main.telephone}}`·`{{location.main.email}}`) — 출처 SoT 준수.
docs\core\PAGE_TYPES.md:430:- **어드민 화면 추가 없음** — M0 어드민 화면 수 6개 유지. 운영자는 ClinicProfile 입력 시 정책 변수(개인정보 보호 책임자·시행일 등)만 추가 입력하거나, LegalDocument 파일을 Git에 수동 보강.
docs\core\PAGE_TYPES.md:446:- 법적 의무 — **법무 검토 필수** (ComplianceRecord.contentType=LegalDocument로 추적).
docs\core\PAGE_TYPES.md:616:| P-013 | Legal / Policy | `/privacy` 등 | LegalDocument | WebPage | Low | | ✅ (자동) |
packages\core-content\dist\index.d.ts:3:export type { ClosedLegalDocumentType, LegalDocumentType, Template, RenderContext, } from "./templates/index.js";
docs\core\DATA_MODEL.md:50:| C-16 | `LegalDocument` | 정책·약관 (Core 표준 템플릿 + 변수 자동 치환) | L3 | Git | ✅ (auto) | P-013 |
docs\core\DATA_MODEL.md:676:| `sources.snsApi.<platform>` | `{enabled: boolean, apiKeySecretRef: string, blogId/accountId: string, legalApproved: boolean, legalApprovedBy?: string, legalApprovedAt?: Date, approvedAccountIds: string[], allowedContentTypes: string[], consentEvidenceRef?: string}` | optional | platform=naverBlog·instagram·facebook·youtube. `enabled=true` + 법무 게이트 누락 → 빌드 fail (F-12) |
docs\core\DATA_MODEL.md:730:| `legalImpactClassifierRef` | string | ✅ | legalImpactClassifier 구현 모듈 ref — 8 class 자동 분류 (PII·LegalDocument·ReviewPolicy·PricingPage·전후사진·후기·priorReviewRequired·cross-entity copy). LLM 분류 v1.0 금지 — deterministic rule SoT (CM2-03) |
docs\core\DATA_MODEL.md:769:| `contentType` | `enum {ClinicProfile, DoctorProfile, TreatmentPage, MedicalConditionPage, Article, FAQ, ReviewPolicy, PricingPage, FacilitiesPage, NewsItem, ReservationPage, LocationProfile, ArticleCategory, LegalDocument, Feature}` | ✅ | (v0.4 +) `LegalDocument` 추가. (v0.5 +) `Feature` 추가 — Feature-backed 콘텐츠(P-106 self-test 등) 통합 식별자. 세부 구분은 `featureContentType` 별도 필드 (`CONTENT_STANDARDS.md` § 7.1.1) |
docs\core\DATA_MODEL.md:770:| `featureContentType` | `string` (`feature:<slug>` 형식, 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$`) | conditional | `contentType="Feature"` 시 required — Feature 콘텐츠 세부 식별. 예: `feature:self-test` |
docs\core\DATA_MODEL.md:782:| `legalCounsel` | `string` | optional (**LegalDocument: required**, High recommended) | LegalDocument 발행 시 필수 — 위험도 Low 예외 룰. 어드민 발행 게이트가 누락 시 차단 |
docs\core\DATA_MODEL.md:783:| `legalCounselAt` | `Date` | optional (**LegalDocument: required**) | LegalDocument 발행 시 필수 |
docs\core\DATA_MODEL.md:844:### C-16. `LegalDocument` — 정책·약관 (M0 자동 생성)
docs\core\DATA_MODEL.md:861:| `revisions` | `LegalDocumentRevision[]` | optional | 개정 이력 |
docs\core\DATA_MODEL.md:867:#### `LegalDocumentRevision`
docs\core\DATA_MODEL.md:875:- 발행 시 `ComplianceRecord(contentType=LegalDocument, legalCounsel=*, legalCounselAt=*)` 필수 — 위험도 Low 예외 게이트 (§ 4 C-10 참조).
docs\core\DATA_MODEL.md:1089:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **`CTAConfig.isFeatured: boolean` 신규** (CT-03 § 3) — 강조 채널 표시. **`LocationProfile.featuredCta` 필드 제거** — `Ref<CTAConfig>` 표기가 `Ref<C-NN>` 규약 위반이었음, (2) **C-10 ComplianceRecord.contentType enum에 LegalDocument 추가** — 법무 검토·법적 정확성 추적 대상이므로, (3) **관계 다이어그램 (§ 6) author/reviewedBy 단일 참조로 정정** — `DoctorProfile[]` → 단일 `DoctorProfile`. coAuthors만 배열 |
docs\core\DATA_MODEL.md:1090:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **C-16 LegalDocument M0 컬럼 ✅ (auto)** — PAGE_TYPES/admin과 정합, (2) **C-10 ComplianceRecord `legalCounsel`/`legalCounselAt` required 룰 명시** — `contentType=LegalDocument` 시 위험도 Low여도 법무 검토 필수 (예외 게이트), (3) **CTAConfig.isFeatured 제거 (v0.5 회귀)** — 객체 재사용 시 의도 누수 위험. 대신 **LocationProfile에 `featuredChannelId: Slug` 신규** (컨테이너에 두기. reservationChannels[].@id 참조). CTAConfig는 컨텍스트 무관 데이터로 유지 |
docs\core\DATA_MODEL.md:1091:| 2026-05-14 | v0.7 | **피드백 정정**: **C-16 LegalDocument를 § 4 M0 핵심으로 이동 + 풀명세** — `documentType` enum, `body` 변수 치환 규약, `autoGenerated`·`templateVersion`, `revisions[]` 하위 타입, 발행 시 법무 검토 룰 명시. § 5 (M0 외 간략 명세)에는 자리 표시만 유지 |
docs\core\CONTENT_STANDARDS.md:366:  contentType: ContentType;           // DATA_MODEL C-10 ComplianceRecord.contentType enum (Core 닫힌 enum 유지)
docs\core\CONTENT_STANDARDS.md:367:  featureContentType?: FeatureContentTypeId;  // Feature-backed 콘텐츠 시 사용 — § 7.1.1
docs\core\CONTENT_STANDARDS.md:381:// - Core 콘텐츠: contentType 사용, featureContentType 미지정
docs\core\CONTENT_STANDARDS.md:382:// - Feature 콘텐츠: contentType="Feature"(C-10 enum cascade 1개 추가) + featureContentType 지정
docs\core\CONTENT_STANDARDS.md:385:#### 7.1.1 Feature contentType 식별 — `FeatureContentTypeId`
docs\core\CONTENT_STANDARDS.md:387:DATA_MODEL C-10 `ComplianceRecord.contentType` enum은 닫힌 enum으로 유지하되, Feature-backed 콘텐츠 식별을 위해 enum에 `Feature` 하나만 추가(cascade)하고 실제 구분은 별도 `featureContentType` 필드로 한다.
docs\core\CONTENT_STANDARDS.md:390:type FeatureContentTypeId = `feature:${FeatureSlug}`;  // kebab-case slug
docs\core\CONTENT_STANDARDS.md:394:| 영역 | contentType 값 | featureContentType 값 | 예시 |
docs\core\CONTENT_STANDARDS.md:397:| Feature | `"Feature"` (C-10 cascade 1개) | `feature:<slug>` | `contentType="Feature"` + `featureContentType="feature:self-test"` (P-106) |
docs\core\CONTENT_STANDARDS.md:561:  | { type: "feature"; featureContentType: FeatureContentTypeId }  // P-106 등 Feature-backed 콘텐츠 전용 룰 (예: featureContentType="feature:self-test")
docs\core\CONTENT_STANDARDS.md:630:| ~~CS-C~~ | Feature-backed 콘텐츠 contentType cascade | v0.5 — DATA_MODEL C-10 enum에 `Feature` 토큰 1개 cascade 추가 + `featureContentType: feature:<slug>` 별도 필드로 세부 식별 (§ 7.1.1). Core enum의 기존 콘텐츠 토큰은 변경 없이 유지 |
docs\core\CONTENT_STANDARDS.md:640:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1) § 0 SoT 참조 § 5→§ 4 정정, (2) § 1.3 본문 길이 산정 기준 "1,000자(공백 제외)" + Markdown 정규화 알고리즘 명시 → CS-A 미결정 신설, (3) § 3.1 Q&A 렌더링(HTML `<dl>`)과 JSON-LD FAQPage schema 책임 분리, (4) § 3.1 Q&A 룰 fail/content-gate 분리 적용 (§ 4.1 직접 참조), (5)·(6) § 4.1 보장 표현 통합 fail + 수치/기간 단정(보장어 미포함) content-gate 분리, 유인성 표현(시간·수량 압박)과 할인·이벤트 사실 안내(법무 판정 영역) 분리, (7) § 4.2 "100% 효과" 대체 표현 — 효과 진술을 인용·통계 출처 동반으로만 한정 (치료경험담 위험 제거), (8) § 4.3·§ 5.6 환자 후기 — 의료법 제56조 직접 인용, 사전심의(제57조) 단정 표현 제거, 매체·방식별 법무 판정 명시, (9) § 4.3·§ 5.6 전후사진 — ReviewPolicy.beforeAfterPhotoAllowed 의미를 "법무 승인 후 예외적 허용 플래그"로 명확화, 승인자·일자 필수 기록 (CS-B 신설), (10) § 7.1 ContentType을 DATA_MODEL C-10 ComplianceRecord.contentType과 동일 enum 명시, (11) § 7.2 ComplianceCheckResult 인터페이스 확장 — buildBlocked/gateRequired/publishable/requiredApproverRole 분리, (12) § 7.4 RiskRule 스키마 신설 (id/category/pattern/patternType/severity/scope/requiredApproverRole/suggestion/rationale/exceptions/version) + ContentScope 5종 + CS-01 해소 |
docs\core\CONTENT_STANDARDS.md:644:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 잔재 정리 마감 (7개 지적 전건 수용)**: (1) **DATA_MODEL C-10 cascade 누락 정정** — `contentType` enum에 `Feature` 토큰 추가. `featureContentType` 필드도 함께 추가 (`feature:<slug>` 정규식 명시), (2) ApproverRole 중복 정의 제거 — ComplianceCheckResult 코드 블록의 중복 type 삭제. 단일 SoT는 § 7.1.3, (3) SimpleRiskRule `requiredApproverRole` 단수 잔재 → `requiredApproverRoles?: ApproverRole[]` 배열로 통일 (§ 7.2와 정합), (4) § 6 effect-result-related 표 — 기본 승인 역할 `["medical"]` 명시. 후기·사례·금액 결합 시 `legal` 추가 (§ 7.1.2 override와 정합), (5) ContentScope union에 `feature` 변형 추가 — Feature-backed 콘텐츠 전용 RiskRule 적용 가능, (6) § 0 한 페이지 요약 content-gate 정의 — § 8·SCHEMA_MAPPING § 7.3과 동일 통일 정의로 갱신 (schema 출력 승인 게이트 포함), (7) § 9.1 CS-C 해소 설명 정정 — DATA_MODEL C-10 enum `Feature` 토큰 cascade 정확히 기술. **다음 단계**: compliance/RISK_LEVELS.md 후속 + 자체 룰 checker 실제 구현 (CS-A·CS-D 영역) + admin 검수 워크플로 명세 + 그 발견을 본 문서에 되먹이기 |
docs\core\CONTENT_STANDARDS.md:645:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (12개 지적 전건 수용)**: (A) § 7.1 `featureContentType` 별도 필드 도입 — C-10 enum은 `Feature` 토큰 1개만 cascade 추가, 실제 구분은 namespace 필드로. (B) § 7.1.1 Feature 예시를 P-106 self-test로 정정 — P-105 ReservationPage는 Core C-20임을 명시. slug kebab-case 정규식(`^[a-z][a-z0-9-]*[a-z0-9]$`) 확정. (C) § 7.2 `findingsBySeverity` 키를 severity enum과 동일(`"content-gate"`)로 통일. (D) ApproverRole enum에 `client` 포함. (E) `requiredApproverRole` → `requiredApproverRoles: ApproverRole[]` 배열로. `review-case`는 `["medical", "legal"]` 기본값. 어드민 워크플로는 AND 조건으로 발행 게이트. (F) CompositeRiskRule `logic` enum 정밀화 — `AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR` 3종. (G) § 7.4.3 composite severity 4종 모두 허용으로 운영 규칙 정정. (H) ContentScope에 `featureContentType` 검증 흐름 (Feature contentType 입력 시) — 추후 검증기 구현. (9) § 3.5 인용 면제는 § 3.5 content-gate에만 적용 — § 4.1 fail 룰은 절대 완화 안 됨 명시. (10) § 4.3 가격·할인·이벤트 — P-102·P-104·P-010(`articleType=event-price`) cross-reference 명시. (11) **DATA_MODEL cascade — C-04 Article.body 권장 길이 "최소 300단어" → "최소 1,000자(공백 제외). CONTENT_STANDARDS § 1.3 SoT"** 정정. (12) § 8 content-gate 정의를 SCHEMA_MAPPING § 7.3과 통일 — schema 출력 승인 게이트 포함 |
docs\core\CONTENT_STANDARDS.md:646:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
apps\web\README.md:41:- `packages/core-content/migrations/C0001~C0005.sql`
docs\compliance\RISK_LEVELS.md:232:| `scope[].featureContentType` 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$` 위반 | **fail** |
docs\compliance\RISK_LEVELS.md:233:| `scope[].featureContentType` 존재 + `scope[].type != "feature"` | **fail** |
docs\compliance\RISK_LEVELS.md:234:| `scope[].type = "feature"` + `featureContentType` 누락 | **fail** |
docs\compliance\RISK_LEVELS.md:469:- LegalDocument(C-16) 발행 — 사업자번호·법인명 정확성
docs\compliance\RISK_LEVELS.md:489:| LegalDocument (C-16) 발행 | `["legal"]` (DATA_MODEL C-10·C-16 — legalCounsel 필수). 운영 정책에서 클라이언트 측 최종 확인을 요구하는 경우만 `client` 추가 |
docs\compliance\RISK_LEVELS.md:525:| `LegalDocument` (C-16) `documentType ∈ {privacy, terms, non-covered, refund, complaint, cookie}` + `body` 필드 | `includes-pricing` | 비급여 안내·환불 정책·약관·민원 안내에 가격 어휘 합법적 등장 |
docs\compliance\RISK_LEVELS.md:526:| `LegalDocument` (C-16) `documentType ∈ {refund, terms}` + `body` 필드 | `includes-event` | 환불 정책·약관에 "이벤트" 어휘가 약관 의미로 등장 |
docs\compliance\RISK_LEVELS.md:528:> `LegalDocument.documentType = "other"`는 본 false-positive 완화 표에서 **의도적으로 제외** — 어떤 정책 문서인지 사전 명확화 불가하므로 보수적으로 일반 콘텐츠와 동일 격상 정책 적용. 운영 누적으로 `other` 사용 사례가 정형화되면 별도 documentType 신설 후 본 표 cascade.
docs\compliance\RISK_LEVELS.md:716:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (6개 지적 전건 수용)**: (1) **CONTENT_STANDARDS CS-02 해소 cascade** — CS-02를 § 9.1 해소된 미결정으로 이동. RISK_LEVELS § 4가 SoT임을 명시, (2) § 6.1 High 가상 finding 트리거 범위 명시 — RiskInference 자동 추론 단계(pageType·slot·inlineRiskFlags 포함)와 ComplianceCheckInput 인터페이스 단계의 흐름 연결. 본 문서 = 운영 SoT, CONTENT_STANDARDS § 7.1.2 = 인터페이스 SoT, (3) § 3.3 context-exceptions.yaml 검증 완전화 — patternType·version·createdAt·updatedAt·rationale·id kebab-case 6종 추가, (4) § 3.3 scope 검증 강화 — featureContentType은 type="feature"와만 결합. 각 type별 필수 필드 검증 추가, (5) § 3.4.1 meta.yaml loadOrder 확장 — rules/contextExceptions/tracking 카테고리별 명시. context-exceptions·medical-law-tracking 포함, (6) § 5.1.2 LegalDocument `other` documentType의 의도적 제외 명시 — 보수적으로 일반 격상 정책 적용 |
docs\compliance\RISK_LEVELS.md:717:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (6개 지적 전건 수용)**: (1) § 5.1.2 LegalDocument.documentType enum을 DATA_MODEL C-16 실제 값(`privacy`·`terms`·`non-covered`·`refund`·`complaint`·`cookie`·`other`)과 정합, (2) § 2.2 `explicitRiskLevel` 저장 SoT를 CONTENT_STANDARDS § 7.1 `metadata.explicitRiskLevel` 입력 슬롯으로 명시 — ComplianceRecord 출력과 분리, (3) § 6.2 표를 High 가상 finding 전용으로 분리 — Medium ArticleType 제거, § 6 매트릭스에 Medium의 physicianApprover 기본 요구 명시, (4) § 3.1 디렉토리 주석 정정 (`§ 4.4`→`CONTENT_STANDARDS § 4.4`) + § 3.4.3 context-exceptions.yaml 스키마 신설 (id·kind·pattern·appliesTo.categories/ruleIds/scopes·rationale), (5) § 3.3 JSON Schema 검증에 `suggestion`·`exceptions[]` + `context-exceptions.yaml` 검증 6종 추가, (6) § 3.3 medical-law-tracking 조건부 검증 추가 (`kind=content-type`/`rule-matched` 분기) + § 7.1.3 stale 처리 절차에 분기별 영향 콘텐츠 결정 명시 |
docs\compliance\RISK_LEVELS.md:718:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 2.2 `explicitRiskLevel` 입력 출처 명확화 — 어드민 메타데이터 입력. 자동 추론 결과 순환 입력 금지, (2) § 0 발행 조건 = AND 3종(operator + 등급 기본 + 룰 추가) 완전 표기, (3) § 6.2 ArticleType override가 "룰 추가 요구"임을 명시 — 총 발행 요구 = 합집합 표 추가, (4) § 4.5 LegalDocument 기본 역할 `["legal"]`만 — client는 운영 정책 시만, (5) § 3.3 scope 검증에 `fieldPath`·`blockType` 정합 검증 추가, (6) § 3.4.2 overrides 중복 정책 통일 — 최대 1개 강제, 중복 시 fail (last-wins 표현 제거), (7) § 4.2 법무 의견서 만료 자동 판정을 RL-07 해소 후로 명시. v1.0에서는 수동 갱신 큐로 대체, (8) § 5 inlineRiskFlags 저장 위치 분리 — Article은 양쪽, 비 Article은 ComplianceRecord만, (9) § 5.1.2 컨텍스트별 false-positive 완화를 페이지 단위 → LegalDocument.documentType + 필드 단위로 정밀화. 정책 페이지 false-negative 위험 회피, (10) § 3.1 디렉토리에 `medical-law-tracking.yaml` 추가 + § 3.3에 해당 파일 검증 7종 추가 |
apps\web\src\components\forms\ClinicProfileForm.tsx:2:// 3 섹션 + 5 LegalDocument override 재구성.
apps\web\src\components\forms\ClinicProfileForm.tsx:7:// (d) 5 LegalDocument override 보조 (신규 · LL-FORM-13)
apps\web\src\components\forms\ClinicProfileForm.tsx:73:  // (d) 5 LegalDocument effective date override
apps\web\src\components\forms\ClinicProfileForm.tsx:432:        {/* (d) 5 LegalDocument effective date override */}
docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:20:- **법무 자문 보완 의무**: 본 문서는 사람이 읽고 판단하는 운영 가이드. 법적 정확성 책임은 ComplianceRecord(C-10) 법무 기록 — `legalCounsel` 필수는 다음 경우만: **(a) LegalDocument(C-16) 발행** (DATA_MODEL C-10 required), **(b) 룰별 `requiredApproverRoles[]`에 `legal`이 포함된 경우** (예: `review-case`·`event-price` ArticleType, 전후사진 노출 콘텐츠). High 등급 자체는 `medical` 기본 요구이며 `legal`은 룰 요구에 따라 추가
docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:609:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (12개 지적 전건 수용)**: (1) § 0 High 등급 legalCounsel 필수 표현 정정 — LegalDocument 발행 + 룰별 `requiredApproverRoles`에 `legal` 포함 시만 필수. High 자체는 `medical` 기본 요구, (2) § 2.4 시행령 제23조제1항 1~13호 → **1~14호**까지 명시. 법 본문 호와 1:1 대응 명시, (3) § 2.4 시행령 제23조제3항 — 자사 홈페이지 광고에 대한 보건복지부장관 고시 근거 명시 (자사 사이트 판정 직결), (4) § 3.2 치료경험담 + 시행령 제23조제1항제2호 **6개월 이하 임상경력 광고** 결합 추가, (5) § 3.8 시행령 결합 — 제2호가 아닌 **제8호** 1:1 대응으로 정정, (6) § 2.2 14호 + § 3.14 — "자신이 받지 아니한"으로 좁힘 → **원칙 금지 + 가~라목 예외** 구조로 정정. 가목 의료기관 인증·나목 공공기관·다목 다른 법령·라목 WHO/ISQua 명시, (7) § 3.15 — 시행령 1~14호 외에 독립 기준 없음을 명시. 개정 추적 자리표시로 상태 명확화, (8) **CONTENT_STANDARDS § 3.5 cascade** — `scholar.google.com`·`*.go.kr`·`*.or.kr` 예시 제거. 본 문서 § 8을 SoT로 직접 참조, (9) § 8.4 nih.gov·cdc.gov — `www.nih.gov/`·`www.cdc.gov/` 슬래시 추가 (§ 8.1 path 매칭 정책과 정합), (10) § 11.2 의료법 `revisionEffectiveDate` — `2026-04-07` (법령 본문 시행일)로 정정, (11) § 11.2 시행령 `revisionEffectiveDate` — `2026-02-10`로 정정. `checkedAt`은 본 문서 확인 일자로 분리, (12) MA-01 미결정 해소 — § 12.1 "의도적 범위 외" 신설로 법문 전문 인용은 의도적 제외 표시. v1.0 진입 가능 |
docs\compliance\MEDICAL_AD_COMPLIANCE_COMMON.md:610:| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (14개 지적 전건 수용 — 호 번호 정확 정렬)**: (1)·(2)·(3)·(4) § 2.2 8~14호 정정 — 8호 사실 과장, 9호 자격·명칭(신설), 10호 기사형, 11호 미심의, 12호 외국인환자, 13호 비급여 할인·면제 오인, 14호 상장·인증·보증·추천 (가~라목 예외). § 3.8~§ 3.14 카탈로그 호 번호 전부 재정렬, (5) § 2.4 시행령 제23조 위임 구조 정정 — 제1항은 각 호 구체 기준, 제2항은 14호라목 WHO/ISQua 예외, (6) § 2.5 시행령 제24조 제3~6항 자율심의기구 신고 체계, 제7항 면제 추가 항목, (7) § 4.2 사전심의 매체 표 — 신문·인터넷신문·정기간행물, 옥외광고물(현수막·벽보·전단·교통시설·교통수단·전광판) 분리, (8) § 4.4 면제 항목 — 의료법 제57조제3항 본문 4종 + 시행령 제24조제7항 추가 항목(개설자·개설연도·홈페이지 주소·진료일·진료시간·전문병원 지정·의료기관 인증 등) 분리 명시, (9) § 5·§ 6·§ 7 조문 인용 정정 — 제56조 1항 → 제2항제N호 (제2호·제6호·제13호), (10) § 3.12 외국인환자 — InternationalSupport 회피 근거 표현 삭제, 법무 판단 명시, (11) § 3.13·§ 7 비급여 — "일괄 금지" → "압박형·허위·불명확 fail / 사실 고지 content-gate" 정합, (12) § 8 화이트리스트 — 도메인 매칭·path prefix 매칭 정책 분리. nih.gov·cdc.gov는 www.* path 매칭으로 좁힘, (13) § 0 legalCounsel 필수 표현 정정 — LegalDocument + High 등급 + requiredApproverRoles=legal 룰에만, (14) § 0 data/compliance-rules/·medical-law-tracking.yaml 미생성 vs 동시 갱신 충돌 명확화 — checker 활성화 전 검증 유보, 활성화 후 동시 갱신 |
docs\ARCHITECTURE.md:214:> 하위 문서 정합 동기화: `core/PAGE_TYPES.md`, `core/DATA_MODEL.md`, `admin/ARCHITECTURE.md` 기준. SoT 정리(ClinicProfile에서 위치·시간·연락 제거 → LocationProfile이 마스터), 공통 타입 3종 추가, C-21 LocationProfile·C-22 ArticleCategory 정식 등재. C-16 LegalDocument는 M0 자동 생성 대상으로 격상 (DATA_MODEL § 4 풀명세, C-10 다음 위치). CTAConfig 강조 채널은 LocationProfile.featuredChannelId(컨테이너 쪽)로 표현. **하위 문서 버전 숫자는 본 주석에서 추적하지 않는다** — 각 문서의 헤더와 변경 이력이 단일 진실 원본.
docs\ARCHITECTURE.md:235:| C-16 | `LegalDocument` | 정책·약관 | L3 | Git |
docs\ARCHITECTURE.md:603:| 2026-05-14 | v0.6 | **피드백 정정 — 후속 동기화** (PAGE_TYPES v0.5.1 / DATA_MODEL v0.5 / admin v0.5): (1) **P-013 Legal/Policy를 M0 출시 게이트로 격상** — M0 9 → 10페이지 (Core 표준 템플릿 + ClinicProfile 변수 자동 치환), (2) C-10 ComplianceRecord.contentType enum에 `LegalDocument` 추가, (3) `CTAConfig.isFeatured: boolean` 신규 — LocationProfile.featuredCta `Ref<CTAConfig>` 표기 위반 정정, 필드 제거, (4) 관계 다이어그램 Article.author/reviewedBy 단일 참조 표기 정정. 본 문서 § 2.4 인벤토리는 영향 없음 (LegalDocument는 이미 등재된 C-16) | Glitzy (Claude 페어링) |
docs\ARCHITECTURE.md:604:| 2026-05-14 | v0.7 | **피드백 정정 — 후속 동기화** (PAGE_TYPES v0.6 / DATA_MODEL v0.6 / admin v0.6): (1) admin § 3.3 ClinicProfile 행 SoT 정합 분리, (2) **LegalDocument 변수 출처** ClinicProfile + LocationProfile(main) 명시, (3) **C-16 LegalDocument M0 ✅ (auto) 표시**, (4) **LegalDocument 법무 검토 강제 룰** — ComplianceRecord.legalCounsel/legalCounselAt required (위험도 Low 예외 게이트), (5) **CTAConfig.isFeatured 회귀 제거** (v0.5 도입 → v0.6 제거) + **LocationProfile.featuredChannelId: Slug 신규** (컨테이너에 두기 — 객체 재사용 시 의도 누수 방지). 본 문서 § 2.4 인벤토리는 영향 없음 | Glitzy (Claude 페어링) |
docs\ARCHITECTURE.md:605:| 2026-05-14 | v0.8 | **피드백 정정 — 정합성 마무리** (PAGE_TYPES v0.7 / DATA_MODEL v0.7 / admin v0.7): (1) § 2.4 갱신 주석을 v0.7 기준으로 동기화 (이전 v0.5/v0.4 표기 잔존 제거), (2) C-16 LegalDocument를 DATA_MODEL § 4 M0 핵심으로 이동·풀명세화 명시, (3) PAGE_TYPES § 0/§ 3 SoT 표현 정합, admin § 3.2 입력/출력 정합. 본 문서 § 2.4 인벤토리 표 자체는 영향 없음 (주석만 갱신) | Glitzy (Claude 페어링) |
docs\admin\ARCHITECTURE.md:125:| ② | 사이트 기본 정보 | 의료기관 정체성 + 본원 위치·연락·시간 + 정책 변수 입력 (3 섹션) | `ClinicProfile` + `LocationProfile`(main) + `LegalDocument`(privacy·terms 등) | 3 계약 동시 출력 — § 3.8.1 / § 3.8.2 자동 생성 규칙 적용 |
docs\admin\ARCHITECTURE.md:139:| `LegalDocument` (C-16) | `documentType`·`title`·`effectiveDate`·`contactPerson` (`body`는 Core 표준 템플릿 + 변수 자동 치환) | ✅ (Core 표준 템플릿 + ClinicProfile + LocationProfile 변수) | ClinicProfile 화면 (정책 변수 보조 섹션) — § 3.8.2 |
docs\admin\ARCHITECTURE.md:144:| `ComplianceRecord` (C-10) | 위험도·자동 검수 결과·검수자·일자·발행자·발행일 (LegalDocument는 `legalCounsel`·`legalCounselAt` 필수 — § 3.8.2) | ✅ (어드민이 발행 시 기록) | 미리보기·발행 화면 |
docs\admin\ARCHITECTURE.md:185:| **9** | **P-013 Legal / Policy (자동 생성)** | **출시 게이트** — Core 표준 템플릿 + ClinicProfile 변수 치환. 법무 검토 필수 (§ 3.8.2 규칙) |
docs\admin\ARCHITECTURE.md:219:### 3.8.2 LegalDocument 자동 생성 규칙
docs\admin\ARCHITECTURE.md:223:| LegalDocument 필드 | 자동 생성 값 |
docs\admin\ARCHITECTURE.md:235:- LegalDocument는 위험도 기본 Low이지만, **법무 검토 필수**. 표준 위험도 룰(High일 때만 권장)과 별도 예외 게이트.
docs\admin\ARCHITECTURE.md:237:  - `contentType` = `LegalDocument`
docs\admin\ARCHITECTURE.md:332:| ClinicProfile 화면 | (a) 기관 정체성 / (b) 본원 위치·연락·시간 / (c) 정책 변수 (보조) | `ClinicProfile` + `LocationProfile`(main) + `LegalDocument`(privacy·terms 등 자동 생성) |
docs\admin\ARCHITECTURE.md:488:| 2026-05-14 | v0.5 | **피드백 정정**: (1) **§ 3.8.1 표현 정리** — 계약 필드(파일 출력)와 어드민 폼 입력 필드(UI 수집)의 구분 명시. ClinicProfile 폼은 두 섹션(기관 정체성 + 본원 위치·연락·시간)으로 출력은 ClinicProfile + LocationProfile main 두 파일, (2) **§ 3.8.2 LegalDocument 자동 생성 규칙 신규** — Core 표준 템플릿 + ClinicProfile 변수 치환, ComplianceRecord 추적, (3) **§ 3.8 Slice 9종+1샘플 → 10종+1샘플=10페이지** (P-013 격상 추가), (4) § 3.11 완료 게이트 #1 10종, (5) **§ 5.2 데이터 입력 영역** — 어드민 화면별 입력·출력 매핑 표 추가로 1:1이 아님 명시 | Glitzy (Claude 페어링) |
docs\admin\ARCHITECTURE.md:489:| 2026-05-14 | v0.6 | **피드백 정정**: (1) **§ 3.3 ClinicProfile 행 분리** — 이전 v0.3 잔존 표현(ClinicProfile에 주소·전화·시간)을 SoT 정합으로 정정. ClinicProfile/LocationProfile(main)/LegalDocument 3개 계약 행 + 자동 생성 표시, (2) **§ 3.8.2 LegalDocument body 변수 출처 정정** — ClinicProfile + LocationProfile(main) 두 SoT 명시 (`{{clinic.*}}`·`{{location.main.*}}` 네임스페이스), (3) **§ 3.8.2 법무 검토 강제 룰** — LegalDocument는 위험도 Low이지만 ComplianceRecord.legalCounsel·legalCounselAt 필수 (어드민 발행 게이트 차단) | Glitzy (Claude 페어링) |
docs\admin\ARCHITECTURE.md:490:| 2026-05-14 | v0.7 | **피드백 정정**: § 3.2 Slice 6개 화면 표 — ② 사이트 기본 정보의 입력 데이터 `ClinicProfile`만 → **`ClinicProfile` + `LocationProfile`(main) + `LegalDocument`** 3 계약 동시 출력로 정정. § 3.8.1/§ 3.8.2와 정합 | Glitzy (Claude 페어링) |
docs\admin\REVIEW_WORKFLOW.md:13:> - 데이터 계약 (ComplianceRecord C-10 · LegalDocument C-16) → `core/DATA_MODEL.md`
docs\admin\REVIEW_WORKFLOW.md:23:- **publishable 조건** (별도 단계): § 7.1 6조건 모두 충족 — automatedDecision !== "block" + finalRoles 슬롯 + priorReview 결과 + staleFlags clear + LegalDocument 필수 필드 + warning 정책별 처리. `approved`와 시점 차이 발생 가능. (content-gate·warn 결과는 사람 검수·정책 처리로 publishable 가능 — block만 영구 차단)
docs\admin\REVIEW_WORKFLOW.md:68:  | "publishable"     // 발행 가능 — § 7.1 6조건 충족 (automatedDecision !== "block" + finalRoles + priorReview 결과 + staleFlags clear + LegalDocument 필드 + warning 정책별 처리)
docs\admin\REVIEW_WORKFLOW.md:138:| `approved → publishable` | § 7.1 publishable 6조건 모두 충족 — (1) automatedDecision !== "block", (2) finalRoles 슬롯 모두 기록, (3) priorReview 결과 정합, (4) staleFlags clear, (5) LegalDocument 시 legalCounsel·legalCounselAt 둘 다, (6) warning 강제 처리 정책 충족 (운영 정책 시) | (자동) |
docs\admin\REVIEW_WORKFLOW.md:187:- LegalDocument 발행 의무(C-10 LegalDocument required)
docs\admin\REVIEW_WORKFLOW.md:219:           ∪ (contentType === "LegalDocument" ? legal : ∅)              // LegalDocument 발행 시 legal 자동 추가 (C-10 required)
docs\admin\REVIEW_WORKFLOW.md:228:> - `publishable` = 추가 게이트 모두 통과 (automatedDecision !== "block" + priorReview 결과 + staleFlags clear + LegalDocument 필드 + warning 정책 — § 7.1 6조건)
docs\admin\REVIEW_WORKFLOW.md:363:           ∧ (5) contentType === "LegalDocument"이면 legalCounsel ∧ legalCounselAt 둘 다 기록 (C-10·C-16 required)
docs\admin\REVIEW_WORKFLOW.md:812:| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1)·(2) § 2.3 상태 전이 완전화 — `blocked → draft`·`rejected → draft`/`review-queued` 분리·`request-changes` 전이·`published → blocked` 사후 fail·`published → stale` 우선순위 추가, (3) § 3.1.1 warning 큐 이탈 조건·기록 슬롯 신설 (acknowledged·resolved). § 7.1 (6) publishable 조건 추가, (4) § 4.1 AND 게이트 평가 알고리즘 정밀화 — priorReview·LegalDocument legal 자동 추가 + approved vs publishable 시점 분리 명시, (5) § 4.1 riskLevel 출처 명시 — `ComplianceRecord.pageRiskLevel` (RiskInference MAX 결합 결과), (6) § 7.1 LegalDocument 조건 — `legalCounsel` + `legalCounselAt` 둘 다 필수. 각 역할 매핑 timestamp 필드도 모두 명시, (7) § 5.2 ComplianceRecord 생명주기 2단계 분리 — pre-publish(mutable) vs published(immutable). C-10 required 필드 충돌 해소(AW-10), (8) § 5.4 staleFlags를 별도 `StaleFlagsRegistry` 컬렉션으로 분리 — published record 불변성 보장(AW-11), (9) § 6.2 stale 처리 흐름 명확화 — published 표면 유지·재발행 명시 액션 필요·이전 record audit log 보존, (10) § 4.1·§ 8 사전심의와 publishable 결합 명시 — `priorReviewRequired=true` 시 finalRoles에 legal 자동 추가, (11) § 3.1·§ 9.1 content-gate 큐 처리자·알림 수신자를 `finalRoles[]` 기준으로 정정 — operator·등급 기본 medical 포함, (12) § 11.2 super-admin 자격 우회 금지 — medical/legal/client approve 시 RISK_LEVELS § 4 자격 검증 필수 |
apps\web\src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:2:// 3계약 동시 출력: ClinicProfile + LocationProfile(slug=main) + 5종 LegalDocument
apps\web\src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:6://   LL-ACTION-06 (cycle1 LL-16 + cycle3 LL-46): 매 저장 시 5종 LegalDocument body 재렌더링 (수동 편집 차단)
apps\web\src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:60:  contentType: "ClinicProfile" | "LocationProfile" | "LegalDocument";
apps\web\src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:119:    // 3. tx 안 3계약 + 5 LegalDocument upsert
apps\web\src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:253:        // === (c) 5종 LegalDocument UPSERT (변수 치환 + alpha sort 잠금 순서) ===
apps\web\src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:317:            contentType: "LegalDocument",
apps\web\src\app\(admin)\[instanceSlug]\clinic-profile\actions.ts:418:        formError: `정책 문서 본문 생성 중 오류가 발생했습니다 (${err.reason}: ${err.variableKey}).`,
apps\web\src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:2:// 3계약 동시 출력 (ClinicProfile + LocationProfile(main) + LegalDocument × 5)
apps\web\src\app\(admin)\[instanceSlug]\clinic-profile\page.tsx:245:        한 화면에서 3계약(ClinicProfile + LocationProfile main + 5종 LegalDocument)을 동시 저장합니다. 5종 정책 문서 본문은 변수 치환으로 자동 생성됩니다.

 succeeded in 670ms:
# LocationProfile(main) + LegalDocument 자동 생성 plan (v1.0·acceptance·2026-05-16)

> **상태**: **v1.0 (acceptance)** — codex 자동 비평 **6 cycle 후 `closeableAfterPatch=true` 확정**. cycle6 finding 1 minor (LL-59) 잔재 정정 후 종료. blocking 0 · major 0 · minor 0 잔존. **59 findings 전건 처리 완료**. 수렴 추세 25→12→10→8→3→1.

> **acceptance commit 구성 (cycle2 LL-33 · cycle5 LL-56 acceptance precondition)**: 본 commit 에 다음 5 cascade 동시 포함 — (1) LOCATION_LEGAL_PLAN.md v1.0 (본 문서), (2) LL-CASCADE-01 docs/admin/ARCHITECTURE.md § 3.8.2 patch, (3) LL-CASCADE-02 docs/decisions/ADMIN_UI_SKELETON_PLAN.md § 5.5 patch, (4) LL-CASCADE-03 docs/core/CONTENT_STANDARDS.md § 7 patch, (5) LL-CASCADE-04 docs/decisions/M0_BUILD_EXPORT_PLAN.md v0.1 placeholder (작성 완료). LL-CASCADE-05 (packages/migrations-runner manifest spec) 은 manifest 파일 신설 정도 — 실 runner 코드 acceptance 는 LL-DEFER-20 (M0 v1.0 본 구현).

본 문서는 `docs/admin/ARCHITECTURE.md` v0.7 § 3.8.1 (LocationProfile(main) 자동 생성 규칙) · § 3.8.2 (LegalDocument 자동 생성 규칙) 을 M0 어드민에서 구현하기 위한 plan이다. ClinicProfile 화면 한 화면에서 **3계약 동시 출력** (`ClinicProfile` + `LocationProfile`(slug=`main`) + `LegalDocument`(5종)) 을 단일 server action transaction 안에서 수행한다.

> **본 plan 의 위상 명시**: 이 plan 은 ADMIN_UI_SKELETON_PLAN v1.0 의 ADMIN-UI-15 marker (M0 v1.0 본 구현 합류) 를 1차 해소하는 작업이다. walking skeleton 의 의도된 한계 (single contract 출력) 를 풀고 § 3.2 화면 ② 의 완성 형태로 진화시킨다.

> **scope limit (LL-INTRO-01)** — cycle1 LL-03·LL-04 patch: 본 plan 은 LegalDocument **draft 저장만** 다룬다. `review-queued` 도 차단 — 그 전이는 ComplianceRecord pre-publish row + NotificationEvent envelope (REVIEW_WORKFLOW § 5.2 / § 3.1) 발송이 함께 작동해야 한다. 이 둘은 모두 compliance-assistant Feature + ComplianceRecord UI cascade 까지 defer. 본 plan 의 LegalDocument 는 `status='draft'` 강제 (CHECK). 발행 게이트 자체는 LL-DEFER-01.

## SoT

- `docs/admin/ARCHITECTURE.md` v0.7 § 3.2 화면 ② · § 3.8.1 · § 3.8.2 — 자동 생성 규칙 SoT
- `docs/core/DATA_MODEL.md` v0.9 — C-01 ClinicProfile · C-16 LegalDocument · C-21 LocationProfile · CT-02 BusinessHours · CT-03 CTAConfig
- `docs/admin/REVIEW_WORKFLOW.md` v1.0 — content_publication_status 9 states · 14 ActionType · ComplianceRecord pre-publish (§ 5.2) · NotificationEvent envelope (§ 9.1)
- `docs/core/CONTENT_STANDARDS.md` v1.3 — cycle1 LL-13 patch: 경로 정정 (admin/CONTENT_STANDARDS 아님). Markdown 본문 검증 (answer-first AST · 표현 검사) 의 LegalDocument 면제 규약 (§ 7 ContentType 예외 표 — LegalDocument 면제 marker).
- `docs/compliance/RISK_LEVELS.md` v1.1 · `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0 — `LegalDocument: legalCounsel/legalCounselAt required` 의 위험도 Low 예외 게이트 (RL § 4.3)
- `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0 (ADMIN-UI-15·62 marker · § 5.5 audit matrix · § 6.2 actions · § 8.1 RLS 시나리오)
- `docs/decisions/M0_SCHEMA_PLAN.md` v0.1
- 기존 packages 실 시그니처 (cycle1 직접 확인):
  - `packages/core-content/migrations/C0001_clinic_profile.sql` · `C0002_location_profile.sql` (location_profile 은 instance_id 만 FK · clinic_profile 직접 FK 없음 — cycle1 LL-01 patch 대상)
  - `apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts` (현재 단일 ClinicProfile upsert)
  - `apps/web/src/components/forms/ClinicProfileForm.tsx`
  - `apps/web/src/lib/{action-context,page-context,errors,tenant,save-result}.ts` (cycle v1.2 acceptance 패턴)
  - `packages/db/src/{tenant,service-role}.ts`
  - `apps/spike-a/migrations/003_audit_log.sql` · `apps/spike-e/migrations/004_audit_event.sql`

## 1. 목적과 범위

### 1.1 목적

- ClinicProfile 화면을 § 3.2/§ 3.8.1/§ 3.8.2 정합으로 진화 — 한 화면, **3계약 동시 출력**.
- 운영자 UX: 화면 추가 없이 한 폼에서 본원 위치·연락·시간 + 정책 변수 (담당자·시행일) 까지 입력. 출력은 자동 분리.
- M0 vertical slice 의 게이트 #1 (사이트 측 페이지 타입 9종 + Article 1샘플) 중 P-012 Contact · P-013 Legal/Policy · P-014 Location Detail 의 데이터 원천 확보.

### 1.2 범위 (포함)

| 항목 | 비고 |
|---|---|
| ClinicProfileForm 3 섹션 재구성 | (a) 기관 정체성 (기존) / (b) 본원 위치·연락·시간 / (c) 정책 변수 (보조) |
| `legal_document` 테이블 신설 (C-16 minimal) | packages/core-content C0006 migration · RLS · 5종 documentType partial UNIQUE (cycle1 LL-08) |
| `clinic_profile` 정책 변수 + primaryCtas 컬럼 추가 | `policy_contact_person` · `policy_contact_email` · `policy_contact_phone` · `policy_effective_date` · `primary_ctas` (JSONB · cycle1 LL-02 patch) |
| `location_profile` clinic_profile_id 추가 | composite FK with instance_id — same-tenant parentClinic 보장 (cycle1 LL-01 patch) |
| `saveClinicProfile` actions 확장 | 단일 tx 안 ClinicProfile + LocationProfile(main) + 5종 LegalDocument upsert · 변수 치환 · audit 7 row 별도 emit (cycle1 LL-17 patch) |
| Core 표준 템플릿 5종 | packages/core-content/src/templates/ — `privacy.ts` · `terms.ts` · `non-covered.ts` · `refund.ts` · `complaint.ts` |
| 변수 치환 엔진 | `{{clinic.*}}` · `{{location.main.*}}` · `{{policy.*}}` 화이트리스트 strict — server action runtime 검증 (cycle1 LL-24 patch) |
| businessHours 입력 검증 + CT-02 SoT 변환 | 7 요일 partial → CT-02 `openingHours[]` · `receptionHours[]` · `lunchBreaks[]` · `specialClosures[]` SoT 형식 변환 후 metadata 저장 (cycle1 LL-05 patch) |
| 5종 LegalDocument 별 effective_date input | cycle1 LL-15 patch — LL-DEFER-08 reversal. 5 record 별 individual input · default = policy_effective_date |
| audit payload 통일 shape | cycle1 LL-17 patch — 7 row 별도 emit · 기존 `{contentType, slug, mode, status, originalSlug}` 보존 (Bundle outer 폐기) |

### 1.3 비범위 (defer)

| 항목 | Defer to | marker |
|---|---|---|
| LegalDocument 발행 게이트 (`legalCounsel`/`legalCounselAt` 강제) · `review-queued` 전이 + ComplianceRecord pre-publish + NotificationEvent | compliance-assistant Feature + ComplianceRecord UI cascade | LL-INTRO-01 / LL-DEFER-01 |
| LegalDocument `status=published` 발행 자체 | apps/worker + Git commit cascade | LL-DEFER-01 |
| ClinicProfile 화면의 미리보기 (3계약 합쳐 본 미리보기 페이지) | M0 v1.0 미리보기 화면 | LL-DEFER-01 |
| 다지점 (slug ≠ main) LocationProfile UI | Phase Beta (M2+) | DATA_MODEL DM-17 |
| 정책 개정 이력 (`revisions[]`) UI | M1 Phase Alpha | LL-DEFER-02 |
| LegalDocument 수동 작성 모드 (autoGenerated=false) | M1 Phase Alpha — Markdown 에디터 합류 시점 | LL-DEFER-03 |
| reservationChannels 풀세트 (LocationProfile 별도 입력 폼) | M0 v1.0 본 구현 — LocationProfile 편집 화면 합류 시점 (cycle1 LL-02 patch — v0.1/v0.2 는 primaryCtas 상속만) | LL-DEFER-04 |
| `representativeDoctors` · `doctorsAtLocation` · `availableTreatments` ref 입력 | M0 v1.0 다지점 입력 화면 또는 LocationProfile 편집 화면 | LL-DEFER-05 |
| LegalDocument body 직접 수동 override | M1 Phase Alpha | LL-DEFER-06 |
| `latitude`/`longitude` 지도 pinpoint UI | M1 Phase Alpha | LL-DEFER-07 |
| ~~5종 LegalDocument 각각의 effective_date individual override~~ | cycle1 LL-15 patch — **v0.2 에서 합류** (form 에서 5 record 별 input) | (closed) |
| `ClinicProfileBundle` audit contentType 권한 분리 | cycle1 LL-17 patch — audit shape 자체를 7 row 별도 emit 으로 변경 → `Bundle` outer 자체 제거. RBAC cascade 는 LL-DEFER-09 | LL-DEFER-09 |
| 템플릿 major 버전 변경 시 운영자 수동 확인 | M1 Phase Alpha | LL-DEFER-10 |
| LegalDocument body 검증 (CONTENT_STANDARDS § 7 ContentType 예외 marker 명시 + 면제 범위 cascade) | cycle1 LL-13 patch — CONTENT_STANDARDS § 7 의 LegalDocument 면제 marker 가 plan SoT cascade. 본 plan 에서 추가 검증 룰 미정의 | LL-DEFER-11 |
| `cookie` / `other` documentType 자동 생성 | cycle1 LL-08·LL-09 patch — partial UNIQUE 로 5종만 SoT 자동 생성. cookie/other 는 운영자 manual 입력 (단, v0.2 도 UI 미제공 — M1 Phase Alpha) | LL-DEFER-12 |
| custom (`documentType=other`) template_version namespace 규약 | cycle1 LL-22 patch — `other` 는 templateVersion null (autoGenerated=false). custom semver 는 M1 cascade | LL-DEFER-13 |

## 2. 데이터 모델 결정

### 2.1 `legal_document` 테이블 신설 (LL-SCHEMA-01)

```sql
-- packages/core-content/migrations/C0006_legal_document.sql

CREATE TYPE legal_document_type AS ENUM (
  'privacy', 'terms', 'non-covered', 'refund', 'complaint', 'cookie', 'other'
);

CREATE TABLE legal_document (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  document_type legal_document_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,                 -- Markdown
  auto_generated BOOLEAN NOT NULL DEFAULT true,
  template_version TEXT,              -- 'privacy@1.0.0' 등 (autoGenerated=true 시 필수)
  effective_date DATE NOT NULL,
  last_revised_date DATE,
  contact_person TEXT,
  contact_email TEXT,
  status content_publication_status NOT NULL DEFAULT 'draft',
  risk_level risk_level NOT NULL DEFAULT 'Low',
  published_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT legal_document_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
  CONSTRAINT legal_document_title_length CHECK (length(title) BETWEEN 1 AND 100),
  CONSTRAINT legal_document_body_length CHECK (length(body) BETWEEN 1 AND 200000),
  CONSTRAINT legal_document_email_regex CHECK (
    contact_email IS NULL OR contact_email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
  ),
  -- cycle1 LL-22 patch: autoGenerated=true 면 templateVersion 필수 (LL-SCHEMA-05). custom (autoGenerated=false) 은 null OK
  CONSTRAINT legal_document_template_version_format CHECK (
    template_version IS NULL OR template_version ~ '^[a-z0-9-]+@[0-9]+\.[0-9]+\.[0-9]+$'
  ),
  CONSTRAINT legal_document_auto_generated_template_ver CHECK (
    (auto_generated = false) OR (template_version IS NOT NULL)
  ),
  -- cycle1 LL-03·LL-19 patch: skeleton 단계 status='draft' 만 허용 (review-queued 도 차단)
  CONSTRAINT legal_document_status_skeleton_limit CHECK (status = 'draft'),
  CONSTRAINT legal_document_published_at_null CHECK (published_at IS NULL),
  -- cycle1 LL-12 patch: risk_level NOT NULL + skeleton 단계 'Low' 만 허용 (compliance-assistant cascade 까지)
  CONSTRAINT legal_document_risk_level_skeleton_limit CHECK (risk_level = 'Low'),
  CONSTRAINT legal_document_instance_slug_unique UNIQUE (instance_id, slug),
  -- cycle1 LL-08 patch: partial UNIQUE — closed 5종만 instance 당 1개 강제. cookie/other 는 미강제 (LL-DEFER-12)
  CONSTRAINT legal_document_instance_id_unique UNIQUE (instance_id, id)
);

CREATE UNIQUE INDEX legal_document_instance_5type_unique
  ON legal_document (instance_id, document_type)
  WHERE document_type IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint');

CREATE INDEX legal_document_instance_idx ON legal_document (instance_id);

ALTER TABLE legal_document ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_document FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON legal_document
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON legal_document TO app_tenant_user;
```

**결정 사항**:
- (LL-SCHEMA-02 · cycle1 LL-08·LL-09 patch) **partial UNIQUE** — closed 5종 (`privacy`/`terms`/`non-covered`/`refund`/`complaint`) per instance UNIQUE. `cookie`/`other` 는 instance 당 N개 허용 (skeleton v0.2 UI 미제공 — LL-DEFER-12).
- (LL-SCHEMA-03 · cycle1 LL-03 patch) `status` CHECK `= 'draft'` — skeleton 단계 단일 상태만. `review-queued` 전이는 ComplianceRecord pre-publish row + NotificationEvent 발송과 함께만 작동 (compliance-assistant cascade — LL-DEFER-01).
- (LL-SCHEMA-04) `published_at` CHECK NULL — 발행 자체가 LL-DEFER-01.
- (LL-SCHEMA-05 · cycle1 LL-22 patch) `template_version` autoGenerated=true 일 때 NOT NULL. autoGenerated=false (수동 작성) 은 NULL 허용 — custom `documentType=other` 진입 시 namespace 충돌 회피.
- (LL-SCHEMA-06 · cycle1 LL-12 patch) `risk_level` NOT NULL + CHECK `= 'Low'` — skeleton 단계 Low 만 (compliance-assistant 의 RiskLevel 자동 추론 cascade 까지 변경 불가).
- (LL-SCHEMA-07) `revisions[]` 은 v0.2 column 미추가 (LL-DEFER-02). `metadata JSONB` 확장 여지만 남김.

### 2.2 `clinic_profile` 정책 변수 + primaryCtas 컬럼 (LL-SCHEMA-08)

```sql
-- packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql

ALTER TABLE clinic_profile
  ADD COLUMN policy_contact_person TEXT,
  ADD COLUMN policy_contact_email TEXT,
  ADD COLUMN policy_contact_phone TEXT,
  ADD COLUMN policy_effective_date DATE,
  -- cycle1 LL-02 patch: primaryCtas SoT (admin/ARCH § 3.8.1 상속 경로 보존)
  ADD COLUMN primary_ctas JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE clinic_profile
  ADD CONSTRAINT clinic_profile_policy_email_regex CHECK (
    policy_contact_email IS NULL
    OR policy_contact_email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
  ),
  -- cycle1 LL-20 patch: phone regex — 한국 02-1234-5678 · 010-1234-5678 · +82-2-1234-5678 (국제) · '.' 구분 미허용 · 'ext.' 미허용 (LL-FORM-12 명시)
  ADD CONSTRAINT clinic_profile_policy_phone_format CHECK (
    policy_contact_phone IS NULL
    OR policy_contact_phone ~ '^(\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}$'
  ),
  ADD CONSTRAINT clinic_profile_primary_ctas_array CHECK (
    jsonb_typeof(primary_ctas) = 'array'
  );

-- cycle3 LL-38 patch: PostgreSQL CHECK 는 subquery 미지원 → trigger 가 매 row 검증.
-- cycle4 LL-54 patch: trigger function 은 NEW 읽고 row-specific RAISE 하므로 VOLATILE (기본). IMMUTABLE 마킹 제거.
-- cycle3 LL-40 + cycle4 LL-50 patch: CT-03 SoT 정렬 — DB trigger 는 CT-03 enum 11종 전체 허용 (subset 분리 — UI 입력은 phone/kakao-talk/naver-reservation 3종 minimal · LL-FORM-08 정렬).
-- cycle4 LL-48 patch: RAISE ... USING CONSTRAINT = '<name>' 으로 errors.ts mapDbErrorToResult 가 23514 + constraint name 으로 분기 가능.
CREATE OR REPLACE FUNCTION clinic_profile_primary_ctas_validate()
RETURNS TRIGGER AS $$
DECLARE
  elem JSONB;
  valid_types CONSTANT TEXT[] := ARRAY[
    -- DATA_MODEL CT-03 SoT 11종 (DB trigger 전체 허용)
    'phone', 'email', 'sms',
    'kakao-talk', 'kakao-channel',
    'naver-reservation', 'naver-talk',
    'form', 'map', 'external', 'video-consultation'
    -- 해외 채널 (line, whatsapp 등) 은 M3 다국어 cascade (DATA_MODEL DM-14)
  ];
BEGIN
  IF jsonb_typeof(NEW.primary_ctas) <> 'array' THEN
    RAISE EXCEPTION 'primary_ctas must be a JSON array'
      USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
  END IF;
  FOR elem IN SELECT * FROM jsonb_array_elements(NEW.primary_ctas) LOOP
    -- DB key = 'id' (Git 출력 시 '@id' alias 변환은 LL-CASCADE-04 build/export 책임)
    IF jsonb_typeof(elem -> 'id') <> 'string' OR length(elem ->> 'id') = 0 THEN
      RAISE EXCEPTION 'primary_ctas element missing id'
        USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
    END IF;
    IF NOT (elem ->> 'type' = ANY(valid_types)) THEN
      RAISE EXCEPTION 'primary_ctas element type invalid: %', elem ->> 'type'
        USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
    END IF;
    IF jsonb_typeof(elem -> 'label') <> 'string' OR length(elem ->> 'label') = 0 THEN
      RAISE EXCEPTION 'primary_ctas element missing label'
        USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
    END IF;
    IF jsonb_typeof(elem -> 'targetUrl') <> 'string' OR length(elem ->> 'targetUrl') = 0 THEN
      RAISE EXCEPTION 'primary_ctas element missing targetUrl'
        USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
    END IF;
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- cycle4 LL-54 patch: VOLATILE 기본 (마킹 생략). row-specific RAISE 에 정합.

CREATE TRIGGER clinic_profile_primary_ctas_trigger
  BEFORE INSERT OR UPDATE OF primary_ctas ON clinic_profile
  FOR EACH ROW EXECUTE FUNCTION clinic_profile_primary_ctas_validate();
```

**결정**:
- (LL-SCHEMA-09) 별도 column (metadata JSONB 가 아닌) — 폼 schema 검증 + LegalDocument 변수 치환의 필수 입력값.
- (LL-SCHEMA-10 · cycle1 LL-14 patch) `policy_contact_phone` 도 form 단계 required (DB NULL 허용은 유지 — 향후 cookie/other manual 입력 row 호환).
- (LL-SCHEMA-11 · cycle1 LL-15 patch) `policy_effective_date` 는 form 안 5 LegalDocument record 의 default 만. 운영자가 각 record 별 override 가능 (LL-DEFER-08 closed).
- (LL-SCHEMA-12 · cycle1 LL-02 + cycle2 LL-26 + cycle3 LL-38·LL-40·LL-45 + cycle4 LL-50·LL-51 patch) `primary_ctas` JSONB array — admin/ARCH § 3.8.1 의 `reservationChannels = primaryCtas 상속` SoT 보존. 각 원소는 **CT-03 SoT shape**: `{id: string, type: enum, label: string, targetUrl: string (required)}`. **type enum 정책 = DB trigger 전체 허용 + UI subset 분리** (cycle4 LL-50):
  - DB trigger 허용 11종 (CT-03 SoT 전체): `phone` · `email` · `sms` · `kakao-talk` · `kakao-channel` · `naver-reservation` · `naver-talk` · `form` · `map` · `external` · `video-consultation`.
  - **M0 v0.5 UI 입력 subset 3종** (LL-FORM-08): `phone` · `kakao-talk` · `naver-reservation`. UI form 의 select 옵션도 SoT 정확 token (cycle4 LL-51 — 기존 `kakao` / `naver-booking` 잘못된 별명 제거).
  - UI subset 외 type (sms/form/map/external 등) 은 M1 Phase Alpha cascade (LL-DEFER-19 · cycle5 LL-57 + cycle6 LL-59 단일화).
  - **DB 검증 = trigger** (CHECK subquery 불가 · cycle3 LL-38 patch) + form zod (UI subset 3종 enum) 양쪽. LocationProfile 자동 생성 시 **build-time reference (deep clone)** — DB metadata 복사 없음 (LL-SCHEMA-18 통일).

### 2.3 `location_profile` clinic_profile_id 추가 + businessHours CT-02 SoT 변환 (LL-SCHEMA-13)

```sql
-- packages/core-content/migrations/C0008_location_profile_parent_clinic.sql

-- cycle1 LL-01 + cycle2 LL-28 patch: parentClinic (C-21 required) 관계 모델 — same-tenant composite FK 보장.
-- 모든 row clinic_profile_id NOT NULL (C-21 SoT). v0.2 의 'main 만 NOT NULL' 정책은 cycle2 LL-28 에서 reversal.
ALTER TABLE location_profile
  ADD COLUMN clinic_profile_id UUID,
  ADD CONSTRAINT location_profile_clinic_fk
    FOREIGN KEY (instance_id, clinic_profile_id)
    REFERENCES clinic_profile (instance_id, id)
    ON DELETE CASCADE
    DEFERRABLE INITIALLY DEFERRED;

-- cycle2 LL-28 patch: NOT NULL CHECK 전 row 적용 (다지점도 parentClinic required SoT 정합)
-- 기존 row 가 있을 경우 backfill 후 NOT NULL — skeleton 단계 row 없음 가정. data migration 부담 marker LL-DEFER-14.
ALTER TABLE location_profile
  ALTER COLUMN clinic_profile_id SET NOT NULL;

CREATE INDEX location_profile_clinic_idx ON location_profile (instance_id, clinic_profile_id);


codex
초기 검색상 cascade 대상 문서 일부는 존재하지만, migrations-runner 쪽은 별도 manifest 실체를 더 확인해야 합니다. 이제 구현 파일을 라인 번호와 함께 읽어서 원자성, RLS, 폼 검증, 템플릿 처리의 실제 동작을 따로 대조하겠습니다.
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content packages/core-content/migrations/C0006_legal_document.sql | ForEach-Object { $i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content packages/core-content/migrations/C0007_clinic_profile_policy_vars.sql | ForEach-Object { $i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content packages/core-content/migrations/C0008_location_profile_parent_clinic.sql | ForEach-Object { $i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
 succeeded in 670ms:
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
  18:   effective_date DATE NOT NULL,
  19:   last_revised_date DATE,
  20:   contact_person TEXT,
  21:   contact_email TEXT,
  22:   status content_publication_status NOT NULL DEFAULT 'draft',
  23:   risk_level risk_level NOT NULL DEFAULT 'Low',
  24:   published_at TIMESTAMPTZ,
  25:   metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  26:   created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  27:   updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  28:   CONSTRAINT legal_document_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
  29:   CONSTRAINT legal_document_title_length CHECK (length(title) BETWEEN 1 AND 100),
  30:   CONSTRAINT legal_document_body_length CHECK (length(body) BETWEEN 1 AND 200000),
  31:   CONSTRAINT legal_document_email_regex CHECK (
  32:     contact_email IS NULL OR contact_email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
  33:   ),
  34:   -- LL-SCHEMA-05 + cycle1 LL-22: autoGenerated=true 시 templateVersion 필수
  35:   CONSTRAINT legal_document_template_version_format CHECK (
  36:     template_version IS NULL OR template_version ~ '^[a-z0-9-]+@[0-9]+\.[0-9]+\.[0-9]+$'
  37:   ),
  38:   CONSTRAINT legal_document_auto_generated_template_ver CHECK (
  39:     (auto_generated = false) OR (template_version IS NOT NULL)
  40:   ),
  41:   -- LL-SCHEMA-03 + cycle1 LL-03·LL-19: skeleton 단계 status='draft' 만
  42:   CONSTRAINT legal_document_status_skeleton_limit CHECK (status = 'draft'),
  43:   -- LL-SCHEMA-04: 발행 자체 차단
  44:   CONSTRAINT legal_document_published_at_null CHECK (published_at IS NULL),
  45:   -- LL-SCHEMA-06 + cycle1 LL-12: risk_level 'Low' 만
  46:   CONSTRAINT legal_document_risk_level_skeleton_limit CHECK (risk_level = 'Low'),
  47:   CONSTRAINT legal_document_instance_slug_unique UNIQUE (instance_id, slug),
  48:   CONSTRAINT legal_document_instance_id_unique UNIQUE (instance_id, id)
  49: );
  50: 
  51: -- LL-SCHEMA-02 + cycle1 LL-08·09: closed 5종 partial UNIQUE (cookie/other 미강제 — LL-DEFER-12)
  52: CREATE UNIQUE INDEX legal_document_instance_5type_unique
  53:   ON legal_document (instance_id, document_type)
  54:   WHERE document_type IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint');
  55: 
  56: CREATE INDEX legal_document_instance_idx ON legal_document (instance_id);
  57: 
  58: ALTER TABLE legal_document ENABLE ROW LEVEL SECURITY;
  59: ALTER TABLE legal_document FORCE ROW LEVEL SECURITY;
  60: 
  61: CREATE POLICY tenant_isolation ON legal_document
  62:   FOR ALL TO app_tenant_user
  63:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  64:   WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
  65: 
  66: GRANT SELECT, INSERT, UPDATE, DELETE ON legal_document TO app_tenant_user;

 succeeded in 672ms:
   1: -- @glitzy/core-content — C0007 ClinicProfile policy vars + primaryCtas (LOCATION_LEGAL_PLAN v1.0)
   2: -- Precondition: C0001 clinic_profile
   3: 
   4: -- LL-SCHEMA-07~12: 정책 변수 4 column + primary_ctas (CT-03 SoT JSONB array)
   5: ALTER TABLE clinic_profile
   6:   ADD COLUMN policy_contact_person TEXT,
   7:   ADD COLUMN policy_contact_email TEXT,
   8:   ADD COLUMN policy_contact_phone TEXT,
   9:   ADD COLUMN policy_effective_date DATE,
  10:   ADD COLUMN primary_ctas JSONB NOT NULL DEFAULT '[]'::jsonb;
  11: 
  12: ALTER TABLE clinic_profile
  13:   ADD CONSTRAINT clinic_profile_policy_email_regex CHECK (
  14:     policy_contact_email IS NULL
  15:     OR policy_contact_email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
  16:   ),
  17:   -- LL-SCHEMA-10 + cycle1 LL-20: 한국 02-1234-5678 · 010-1234-5678 · +82-2-1234-5678 (국제). 점 구분/extension 거절
  18:   ADD CONSTRAINT clinic_profile_policy_phone_format CHECK (
  19:     policy_contact_phone IS NULL
  20:     OR policy_contact_phone ~ '^(\+82-?[1-9][0-9]?|0[1-9][0-9]?)([- ]?[0-9]{3,4}){2}$'
  21:   ),
  22:   ADD CONSTRAINT clinic_profile_primary_ctas_array CHECK (
  23:     jsonb_typeof(primary_ctas) = 'array'
  24:   );
  25: 
  26: -- cycle3 LL-38 + cycle4 LL-48·LL-50·LL-54 patch:
  27: --   - PostgreSQL CHECK 는 subquery 미지원 → trigger 가 매 row 검증.
  28: --   - trigger function 은 NEW 읽고 row-specific RAISE 하므로 VOLATILE (IMMUTABLE 마킹 제거).
  29: --   - DB trigger 허용 11종 (CT-03 SoT 전체). UI subset 3종은 form zod 가 분리 검증.
  30: --   - RAISE EXCEPTION USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape' →
  31: --     errors.ts mapDbErrorToResult 가 SQLSTATE 23514 + constraint name 으로 분기 가능.
  32: CREATE OR REPLACE FUNCTION clinic_profile_primary_ctas_validate()
  33: RETURNS TRIGGER AS $$
  34: DECLARE
  35:   elem JSONB;
  36:   valid_types CONSTANT TEXT[] := ARRAY[
  37:     'phone', 'email', 'sms',
  38:     'kakao-talk', 'kakao-channel',
  39:     'naver-reservation', 'naver-talk',
  40:     'form', 'map', 'external', 'video-consultation'
  41:   ];
  42: BEGIN
  43:   IF jsonb_typeof(NEW.primary_ctas) <> 'array' THEN
  44:     RAISE EXCEPTION 'primary_ctas must be a JSON array'
  45:       USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
  46:   END IF;
  47:   FOR elem IN SELECT * FROM jsonb_array_elements(NEW.primary_ctas) LOOP
  48:     IF jsonb_typeof(elem -> 'id') <> 'string' OR length(elem ->> 'id') = 0 THEN
  49:       RAISE EXCEPTION 'primary_ctas element missing id'
  50:         USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
  51:     END IF;
  52:     IF NOT (elem ->> 'type' = ANY(valid_types)) THEN
  53:       RAISE EXCEPTION 'primary_ctas element type invalid: %', elem ->> 'type'
  54:         USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
  55:     END IF;
  56:     IF jsonb_typeof(elem -> 'label') <> 'string' OR length(elem ->> 'label') = 0 THEN
  57:       RAISE EXCEPTION 'primary_ctas element missing label'
  58:         USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
  59:     END IF;
  60:     IF jsonb_typeof(elem -> 'targetUrl') <> 'string' OR length(elem ->> 'targetUrl') = 0 THEN
  61:       RAISE EXCEPTION 'primary_ctas element missing targetUrl'
  62:         USING ERRCODE = 'check_violation', CONSTRAINT = 'clinic_profile_primary_ctas_shape';
  63:     END IF;
  64:   END LOOP;
  65:   RETURN NEW;
  66: END;
  67: $$ LANGUAGE plpgsql;
  68: 
  69: CREATE TRIGGER clinic_profile_primary_ctas_trigger
  70:   BEFORE INSERT OR UPDATE OF primary_ctas ON clinic_profile
  71:   FOR EACH ROW EXECUTE FUNCTION clinic_profile_primary_ctas_validate();

 succeeded in 672ms:
   1: -- @glitzy/core-content — C0008 LocationProfile parentClinic (LOCATION_LEGAL_PLAN v1.0)
   2: -- Precondition: C0001 clinic_profile + clinic_profile_instance_id_unique · C0002 location_profile
   3: 
   4: -- LL-SCHEMA-13~15 + cycle1 LL-01 + cycle2 LL-28 patch:
   5: --   parentClinic (C-21 required) 관계 모델. same-tenant composite FK 보장.
   6: --   모든 row clinic_profile_id NOT NULL (skeleton 가정: row 없음. backfill 부담은 LL-DEFER-14).
   7: ALTER TABLE location_profile
   8:   ADD COLUMN clinic_profile_id UUID,
   9:   ADD CONSTRAINT location_profile_clinic_fk
  10:     FOREIGN KEY (instance_id, clinic_profile_id)
  11:     REFERENCES clinic_profile (instance_id, id)
  12:     ON DELETE CASCADE
  13:     DEFERRABLE INITIALLY DEFERRED;
  14: 
  15: -- LL-SCHEMA-14: 전 row NOT NULL (C-21 parentClinic SoT 정합)
  16: ALTER TABLE location_profile
  17:   ALTER COLUMN clinic_profile_id SET NOT NULL;
  18: 
  19: CREATE INDEX location_profile_clinic_idx ON location_profile (instance_id, clinic_profile_id);
  20: 
  21: -- cycle2 LL-29 + cycle3 LL-44: main slug 1 row 강제는 server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15.
  22: -- 본 migration 은 composite FK 만 추가. DB trigger 합류는 M0 v1.0 본 구현 cascade.

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content '"'apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts' | ForEach-Object { "'$i++; if($i -le 470){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content apps/web/src/lib/clinic-profile-schema.ts | ForEach-Object { $i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content apps/web/src/lib/errors.ts | ForEach-Object { $i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
 succeeded in 590ms:
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
  57: 
  58:   // LegalDocument (C0006 · LOCATION_LEGAL_PLAN v1.0)
  59:   legal_document_instance_5type_unique: { field: null, message: "동일 정책 문서가 이미 존재합니다. 잠시 후 다시 시도하세요." },
  60:   legal_document_status_skeleton_limit: { field: null, message: "정책 문서 상태 변경(검수 진입·발행)은 후속 단계입니다. 본 화면에서는 draft 만 저장 가능하며, 검수 진입은 compliance-assistant Feature 합류(M0 v1.0 본 구현 완료 시점) 후 검수 큐 화면에서 가능합니다." },
  61:   legal_document_published_at_null: { field: null, message: "정책 문서 발행은 후속 단계입니다. 발행 게이트(compliance-assistant + ComplianceRecord UI) 합류 후 발행 화면에서 가능합니다." },
  62:   legal_document_risk_level_skeleton_limit: { field: null, message: "정책 문서 위험도는 현재 단계에서 Low 만 허용됩니다. 위험도 수동 분류는 위험도 분류 UI(M0 v1.0) 합류 후 가능합니다." },
  63:   legal_document_title_length: { field: null, message: "정책 문서 제목은 1~100자여야 합니다." },
  64:   legal_document_body_length: { field: null, message: "정책 문서 본문 길이가 허용 범위(1~200000자)를 벗어났습니다." },
  65:   legal_document_email_regex: { field: null, message: "정책 문서의 연락처 이메일 형식이 올바르지 않습니다." },
  66:   legal_document_slug_regex: { field: null, message: "정책 문서 slug 형식이 올바르지 않습니다." },
  67:   legal_document_instance_slug_unique: { field: null, message: "동일 slug 의 정책 문서가 이미 존재합니다." },
  68:   legal_document_template_version_format: { field: null, message: "정책 문서 템플릿 버전 형식이 올바르지 않습니다." },
  69:   legal_document_auto_generated_template_ver: { field: null, message: "자동 생성 정책 문서에는 템플릿 버전이 필요합니다." },
  70: };
  71: 
  72: export type DbErrorResult =
  73:   | { kind: "field"; errors: FieldErrors }
  74:   | { kind: "form"; message: string };
  75: 
  76: /**
  77:  * postgres-js error 의 `code` (SQLSTATE) 와 `constraint_name` 으로 field/form 매핑.
  78:  * 23514 = check_violation, 23505 = unique_violation, 23503 = foreign_key_violation
  79:  */
  80: export function mapDbErrorToResult(err: unknown): DbErrorResult | null {
  81:   if (typeof err !== "object" || err === null) return null;
  82:   const e = err as { code?: string; constraint_name?: string; constraint?: string };
  83:   const code = e.code;
  84:   const constraint = e.constraint_name ?? e.constraint;
  85:   if (!code || !constraint) return null;
  86:   if (code !== "23514" && code !== "23505" && code !== "23503") return null;
  87: 
  88:   const mapping = CONSTRAINT_MAP[constraint];
  89:   if (mapping) {
  90:     if (mapping.field === null) return { kind: "form", message: mapping.message };
  91:     return { kind: "field", errors: { [mapping.field]: [mapping.message] } };
  92:   }
  93: 
  94:   // unknown constraint — generic
  95:   if (code === "23505") return { kind: "form", message: "중복된 값이 있어 저장하지 못했습니다." };
  96:   if (code === "23503") return { kind: "form", message: "참조 무결성 오류 — 연결된 데이터가 없거나 삭제되었습니다." };
  97:   if (code === "23514") return { kind: "form", message: "입력값이 데이터 제약을 만족하지 못합니다." };
  98:   return null;
  99: }
 100: 
 101: /** 기존 호출처 호환 — FieldErrors 만 반환 (form 메시지는 null) */
 102: export function mapDbErrorToFieldErrors(err: unknown): FieldErrors | null {
 103:   const result = mapDbErrorToResult(err);
 104:   if (result === null) return null;
 105:   if (result.kind === "field") return result.errors;
 106:   return null;
 107: }

 succeeded in 650ms:
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

2026-05-18T02:51:46.935211Z ERROR codex_core::tools::router: error=Exit code: 1
Wall time: 0.7 seconds
Output:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m $i=0; [36;1mGet-Content 'apps/web/src/app/(admin)/[instanceSlug]/clinic-pro[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

 exited 1 in 702ms:
[31;1mGet-Content: [0m
[31;1m[36;1mLine |[0m
[31;1m[36;1m[36;1m   2 | [0m $i=0; [36;1mGet-Content 'apps/web/src/app/(admin)/[instanceSlug]/clinic-pro[0m …[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m     | [31;1m       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~[0m
[31;1m[36;1m[36;1m[0m[36;1m[0m[36;1m[31;1m[31;1m[36;1m     | [31;1mAn object at the specified path apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts does not exist, or has been filtered by the -Include or -Exclude parameter.[0m

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content -LiteralPath '"'apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/page.tsx' | ForEach-Object { "'$i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
 succeeded in 594ms:
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
 117: export default async function ClinicProfilePage({
 118:   params,
 119: }: {
 120:   params: { instanceSlug: string };
 121: }) {
 122:   let pageCtx;
 123:   try {
 124:     pageCtx = await requirePageContext(params.instanceSlug);
 125:   } catch (err) {
 126:     if (err instanceof TenantResolveError) {
 127:       const a = mapAuthDenyReasonToUi(err.reason);
 128:       if (a.kind === "forbidden" || a.kind === "info") {
 129:         return <main className="p-6"><p>{a.message}</p></main>;
 130:       }
 131:     }
 132:     throw err;
 133:   }
 134: 
 135:   let initial: ClinicProfileInitial | null = null;
 136:   try {
 137:     initial = await withSkeletonTx({ signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId }, async (tx, ctx) => {
 138:       assertActionEligibility(ctx, "operator-edit-content");
 139: 
 140:       const clinicRows = await tx<ClinicRow[]>`
 141:         SELECT name, description, logo_url, og_image_url,
 142:                business_registration_number, alternate_name, legal_entity_name,
 143:                slogan, long_description,
 144:                to_char(founding_date, 'YYYY-MM-DD') AS founding_date,
 145:                founder,
 146:                policy_contact_person, policy_contact_email, policy_contact_phone,
 147:                to_char(policy_effective_date, 'YYYY-MM-DD') AS policy_effective_date,
 148:                primary_ctas
 149:           FROM clinic_profile
 150:          WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'clinic'
 151:          LIMIT 1
 152:       `;
 153:       const clinic = clinicRows[0];
 154:       if (!clinic) return null;
 155: 
 156:       const locationRows = await tx<LocationRow[]>`
 157:         SELECT street_address, address_locality, address_region, postal_code, address_country,
 158:                phone, email, metadata
 159:           FROM location_profile
 160:          WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'main'
 161:          LIMIT 1
 162:       `;
 163:       const location = locationRows[0] ?? null;
 164: 
 165:       const legalRows = await tx<LegalRow[]>`
 166:         SELECT document_type::text AS document_type,
 167:                to_char(effective_date, 'YYYY-MM-DD') AS effective_date
 168:           FROM legal_document
 169:          WHERE instance_id = ${ctx.instanceId}::uuid
 170:            AND document_type IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint')
 171:       `;
 172: 
 173:       const overrides: Record<"privacy" | "terms" | "non-covered" | "refund" | "complaint", string> = {
 174:         privacy: "",
 175:         terms: "",
 176:         "non-covered": "",
 177:         refund: "",
 178:         complaint: "",
 179:       };
 180:       const fallback = clinic.policy_effective_date ?? "";
 181:       for (const row of legalRows) {
 182:         const t = row.document_type as keyof typeof overrides;
 183:         if (overrides[t] !== undefined && row.effective_date !== fallback) {
 184:           overrides[t] = row.effective_date;
 185:         }
 186:       }
 187: 
 188:       const businessHoursSpec = location ? parseBusinessHoursMetadata(location.metadata) : null;
 189:       const primaryCtas = parsePrimaryCtas(clinic.primary_ctas);
 190:       const featuredChannelId = location ? parseFeaturedChannelId(location.metadata) : "";
 191: 
 192:       return {
 193:         ...emptyInitial,
 194:         name: clinic.name,
 195:         description: clinic.description,
 196:         logoUrl: clinic.logo_url,
 197:         ogImageUrl: clinic.og_image_url,
 198:         businessRegistrationNumber: clinic.business_registration_number ?? "",
 199:         alternateName: clinic.alternate_name ?? "",
 200:         legalEntityName: clinic.legal_entity_name ?? "",
 201:         slogan: clinic.slogan ?? "",
 202:         longDescription: clinic.long_description ?? "",
 203:         foundingDate: clinic.founding_date ?? "",
 204:         founder: clinic.founder ?? "",
 205:         streetAddress: location?.street_address ?? "",
 206:         addressLocality: location?.address_locality ?? "",
 207:         addressRegion: location?.address_region ?? "",
 208:         postalCode: location?.postal_code ?? "",
 209:         addressCountry: location?.address_country ?? "KR",
 210:         locationTelephone: location?.phone ?? "",
 211:         locationEmail: location?.email ?? "",
 212:         businessHours: convertFromOpeningHoursSpec(businessHoursSpec),
 213:         primaryCtas,
 214:         featuredChannelId,
 215:         policyContactPerson: clinic.policy_contact_person ?? "",
 216:         policyContactEmail: clinic.policy_contact_email ?? "",
 217:         policyContactPhone: clinic.policy_contact_phone ?? "",
 218:         policyEffectiveDate: clinic.policy_effective_date ?? "",
 219:         legalDocEffectiveOverrides: overrides,
 220:       };
 221:     });
 222:   } catch (err) {
 223:     if (err instanceof TenantResolveError) {
 224:       const action = mapAuthDenyReasonToUi(err.reason);
 225:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
 226:       if (action.kind === "not-found") notFound();
 227:       if (action.kind === "forbidden") {
 228:         return (
 229:           <main className="flex flex-col gap-4">
 230:             <h1 className="text-2xl font-semibold">접근 거부</h1>
 231:             <p className="text-sm text-slate-700">{action.message}</p>
 232:           </main>
 233:         );
 234:       }
 235:     }
 236:     throw err;
 237:   }
 238: 
 239:   const boundSave = saveClinicProfile.bind(null, params.instanceSlug);
 240: 
 241:   return (
 242:     <main className="flex flex-col gap-6">
 243:       <h1 className="text-2xl font-semibold">사이트 기본 정보</h1>
 244:       <p className="text-sm text-slate-500">
 245:         한 화면에서 3계약(ClinicProfile + LocationProfile main + 5종 LegalDocument)을 동시 저장합니다. 5종 정책 문서 본문은 변수 치환으로 자동 생성됩니다.
 246:       </p>
 247:       <ClinicProfileForm action={boundSave} initial={initial} instanceSlug={params.instanceSlug} />
 248:     </main>
 249:   );
 250: }

 succeeded in 620ms:
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
 254:         const renderCtx: RenderContext = {
 255:           clinic: {
 256:             name: data.name,
 257:             legalEntityName: data.legalEntityName ?? null,
 258:             businessRegistrationNumber: data.businessRegistrationNumber ?? null,
 259:             founder: data.founder ?? null,
 260:           },
 261:           location: {
 262:             main: {
 263:               address: `${data.addressRegion} ${data.addressLocality} ${data.streetAddress} (${data.postalCode})`,
 264:               telephone: data.locationTelephone,
 265:               email: data.locationEmail ?? null,
 266:             },
 267:           },
 268:           policy: {
 269:             contactPerson: data.policyContactPerson,
 270:             contactEmail: data.policyContactEmail,
 271:             contactPhone: data.policyContactPhone,
 272:             effectiveDate: data.policyEffectiveDate,
 273:           },
 274:         };
 275: 
 276:         for (const docType of CLOSED_DOCUMENT_TYPES_ALPHA) {
 277:           const template = TEMPLATES[docType];
 278:           const renderedBody = renderTemplate(template.body, renderCtx);
 279:           const overrideValue = data.legalDocEffectiveOverrides[docType];
 280:           const effectiveDate = overrideValue && overrideValue !== ""
 281:             ? overrideValue
 282:             : data.policyEffectiveDate;
 283: 
 284:           const legalAfter = await tx<{ id: string; inserted: boolean }[]>`
 285:             INSERT INTO legal_document (
 286:               instance_id, slug, document_type, title, body,
 287:               auto_generated, template_version, effective_date,
 288:               contact_person, contact_email, status, risk_level
 289:             ) VALUES (
 290:               ${ctx.instanceId}::uuid,
 291:               ${template.slug},
 292:               ${docType}::legal_document_type,
 293:               ${template.title},
 294:               ${renderedBody},
 295:               true,
 296:               ${template.version},
 297:               ${effectiveDate},
 298:               ${data.policyContactPerson},
 299:               ${data.policyContactEmail},
 300:               'draft'::content_publication_status,
 301:               'Low'::risk_level
 302:             )
 303:             ON CONFLICT (instance_id, slug) DO UPDATE
 304:                SET title = EXCLUDED.title,
 305:                    body = EXCLUDED.body,
 306:                    auto_generated = EXCLUDED.auto_generated,
 307:                    template_version = EXCLUDED.template_version,
 308:                    effective_date = EXCLUDED.effective_date,
 309:                    contact_person = EXCLUDED.contact_person,
 310:                    contact_email = EXCLUDED.contact_email,
 311:                    updated_at = now()
 312:             RETURNING id, (xmax = 0) AS inserted
 313:           `;
 314:           const legal = legalAfter[0]!;
 315: 
 316:           auditEntries.push({
 317:             contentType: "LegalDocument",
 318:             slug: template.slug,
 319:             mode: legal.inserted ? "insert" : "update",
 320:             status: "draft",
 321:             originalSlug: template.slug,
 322:             documentType: docType,
 323:             templateVersion: template.version,
 324:           });
 325:         }
 326: 
 327:         // === (d) assertHasMainLocationAfterTx 안전망 (cycle3 LL-44) ===
 328:         const mainCheck = await tx<{ exists: boolean }[]>`
 329:           SELECT EXISTS (
 330:             SELECT 1 FROM location_profile
 331:              WHERE instance_id = ${ctx.instanceId}::uuid
 332:                AND clinic_profile_id = ${clinic.id}::uuid
 333:                AND slug = 'main'
 334:           ) AS exists
 335:         `;
 336:         if (!mainCheck[0]?.exists) {
 337:           throw new MainLocationMissingError();
 338:         }
 339: 
 340:         return { ctx, auditEntries };
 341:       },
 342:     );
 343: 
 344:     // 4. audit 7 row sequential emit + 3단계 안전망 (LL-ACTION-18 + cycle3 LL-43)
 345:     const emitted: string[] = [];
 346:     const failed: string[] = [];
 347:     for (const entry of txResult.auditEntries) {
 348:       try {
 349:         await emitAuditEvent(sqlBase, {
 350:           eventType: "content-saved",
 351:           actorUserId: txResult.ctx.userId,
 352:           targetUserId: txResult.ctx.userId,
 353:           toInstanceId: txResult.ctx.instanceId,
 354:           payload: {
 355:             contentType: entry.contentType,
 356:             slug: entry.slug,
 357:             mode: entry.mode,
 358:             status: entry.status,
 359:             originalSlug: entry.originalSlug,
 360:             ...(entry.documentType !== undefined ? { documentType: entry.documentType } : {}),
 361:             ...(entry.templateVersion !== undefined ? { templateVersion: entry.templateVersion } : {}),
 362:             ...(entry.updatedAtBefore !== undefined ? { updatedAtBefore: entry.updatedAtBefore } : {}),
 363:             ...(entry.updatedAtAfter !== undefined ? { updatedAtAfter: entry.updatedAtAfter } : {}),
 364:           },
 365:         });
 366:         emitted.push(`${entry.contentType}:${entry.slug}`);
 367:       } catch (auditErr) {
 368:         failed.push(`${entry.contentType}:${entry.slug}`);
 369:         console.error("[saveClinicProfile] audit row emit failed", {
 370:           contentType: entry.contentType,
 371:           slug: entry.slug,
 372:           error: auditErr,
 373:         });
 374:       }
 375:     }
 376: 
 377:     if (failed.length > 0) {
 378:       const eventType = emitted.length > 0 ? "content-saved-partial" : "content-saved-failed";
 379:       try {
 380:         await emitAuditEvent(sqlBase, {
 381:           eventType,
 382:           actorUserId: txResult.ctx.userId,
 383:           targetUserId: txResult.ctx.userId,
 384:           toInstanceId: txResult.ctx.instanceId,
 385:           payload: {
 386:             outcome: emitted.length > 0 ? "partial" : "failed",
 387:             emitted,
 388:             failed,
 389:           },
 390:         });
 391:       } catch (fallbackErr) {
 392:         // 3단계 안전망 의 최종: server stdout (v0.5 — Sentry SDK 미통합 · LL-DEFER-18 까지)
 393:         console.error("[saveClinicProfile] fallback audit emit failed", {
 394:           eventType,
 395:           emitted,
 396:           failed,
 397:           error: fallbackErr,
 398:         });
 399:       }
 400:     }
 401: 
 402:     revalidatePath(`/${instanceSlug}/clinic-profile`);
 403:     revalidatePath(`/${instanceSlug}`);
 404:     return { ok: true };
 405:   } catch (err) {
 406:     if (isNextControlFlowError(err)) throw err;
 407: 
 408:     // MainLocationMissingError (LL-ACTION-21)
 409:     if (err instanceof MainLocationMissingError) {
 410:       return { ok: false, fieldErrors: {}, formError: err.message };
 411:     }
 412: 
 413:     // TemplateRenderError (LL-ACTION-12 — 변수 화이트리스트 외 키)
 414:     if (err instanceof TemplateRenderError) {
 415:       return {
 416:         ok: false,
 417:         fieldErrors: {},
 418:         formError: `정책 문서 본문 생성 중 오류가 발생했습니다 (${err.reason}: ${err.variableKey}).`,
 419:       };
 420:     }
 421: 
 422:     // DB constraint violation
 423:     const mapped = mapDbErrorToResult(err);
 424:     if (mapped !== null) {
 425:       if (mapped.kind === "field") return { ok: false, fieldErrors: mapped.errors };
 426:       return { ok: false, fieldErrors: {}, formError: mapped.message };
 427:     }
 428: 
 429:     if (err instanceof TenantResolveError) {
 430:       const action = mapAuthDenyReasonToUi(err.reason);
 431:       if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
 432:       if (action.kind === "not-found") notFound();
 433:       if (action.kind === "forbidden") return { ok: false, fieldErrors: {}, formError: action.message };
 434:       if (action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
 435:     }
 436: 
 437:     console.error("[saveClinicProfile] unexpected error", err);
 438:     return { ok: false, fieldErrors: {}, formError: "저장 중 알 수 없는 오류가 발생했습니다." };
 439:   }
 440: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content apps/web/src/components/forms/ClinicProfileForm.tsx | ForEach-Object { $i++; if($i -le 260){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content apps/web/src/components/forms/ClinicProfileForm.tsx | ForEach-Object { $i++; if($i -gt 260){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
 succeeded in 617ms:
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

 succeeded in 621ms:
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
 321:                 return (
 322:                   <div key={day} aria-labelledby={dayHeaderId} className="flex flex-col gap-1 border-b border-slate-100 pb-2 last:border-0">
 323:                     <div className="flex items-center gap-3">
 324:                       <span id={dayHeaderId} className="w-16 text-sm">{DAY_LABEL[day]}</span>
 325:                       <label className="flex items-center gap-1 text-xs">
 326:                         <input
 327:                           type="checkbox"
 328:                           name={`businessHours_${day}_closed`}
 329:                           checked={d.closed}
 330:                           onChange={(e) => setDay(day, { closed: e.target.checked })}
 331:                         />
 332:                         휴진
 333:                       </label>
 334:                       {!d.closed && (
 335:                         <>
 336:                           <input
 337:                             type="time"
 338:                             name={`businessHours_${day}_open`}
 339:                             value={d.open ?? ""}
 340:                             onChange={(e) => setDay(day, { open: e.target.value })}
 341:                             className="rounded-md border border-slate-300 px-2 py-1 text-xs"
 342:                             aria-label={`${DAY_LABEL[day]} 오픈 시간`}
 343:                           />
 344:                           <span className="text-xs">~</span>
 345:                           <input
 346:                             type="time"
 347:                             name={`businessHours_${day}_close`}
 348:                             value={d.close ?? ""}
 349:                             onChange={(e) => setDay(day, { close: e.target.value })}
 350:                             className="rounded-md border border-slate-300 px-2 py-1 text-xs"
 351:                             aria-label={`${DAY_LABEL[day]} 마감 시간`}
 352:                           />
 353:                           <label className="ml-2 flex items-center gap-1 text-xs">
 354:                             <input
 355:                               type="checkbox"
 356:                               name={`businessHours_${day}_lunchEnabled`}
 357:                               checked={d.lunchEnabled}
 358:                               onChange={(e) => setDay(day, { lunchEnabled: e.target.checked })}
 359:                             />
 360:                             점심
 361:                           </label>
 362:                           {d.lunchEnabled && (
 363:                             <>
 364:                               <input
 365:                                 type="time"
 366:                                 name={`businessHours_${day}_lunchFrom`}
 367:                                 value={d.lunchFrom ?? ""}
 368:                                 onChange={(e) => setDay(day, { lunchFrom: e.target.value })}
 369:                                 className="rounded-md border border-slate-300 px-2 py-1 text-xs"
 370:                                 aria-label={`${DAY_LABEL[day]} 점심 시작`}
 371:                               />
 372:                               <span className="text-xs">~</span>
 373:                               <input
 374:                                 type="time"
 375:                                 name={`businessHours_${day}_lunchTo`}
 376:                                 value={d.lunchTo ?? ""}
 377:                                 onChange={(e) => setDay(day, { lunchTo: e.target.value })}
 378:                                 className="rounded-md border border-slate-300 px-2 py-1 text-xs"
 379:                                 aria-label={`${DAY_LABEL[day]} 점심 종료`}
 380:                               />
 381:                             </>
 382:                           )}
 383:                         </>
 384:                       )}
 385:                     </div>
 386:                   </div>
 387:                 );
 388:               })}
 389:             </div>
 390:           </div>
 391: 
 392:           <div className="flex flex-col gap-2">
 393:             <label className="text-sm font-medium">예약 채널 (최소 1개)</label>
 394:             {fieldErrors.primaryCtas && <span className="text-xs text-rose-700">{fieldErrors.primaryCtas.join(", ")}</span>}
 395:             <div className="flex flex-col gap-3 rounded-md border border-slate-200 p-3">
 396:               <CtaRow type="phone" label="전화 예약" enabled={ctaPhoneEnabled} setEnabled={setCtaPhoneEnabled} labelVal={ctaPhoneLabel} setLabelVal={setCtaPhoneLabel} urlVal={ctaPhoneUrl} setUrlVal={setCtaPhoneUrl} urlPlaceholder="tel:+82-2-1234-5678" />
 397:               <CtaRow type="kakao-talk" label="카카오톡 상담" enabled={ctaKakaoEnabled} setEnabled={setCtaKakaoEnabled} labelVal={ctaKakaoLabel} setLabelVal={setCtaKakaoLabel} urlVal={ctaKakaoUrl} setUrlVal={setCtaKakaoUrl} urlPlaceholder="https://pf.kakao.com/_..." />
 398:               <CtaRow type="naver-reservation" label="네이버 예약" enabled={ctaNaverEnabled} setEnabled={setCtaNaverEnabled} labelVal={ctaNaverLabel} setLabelVal={setCtaNaverLabel} urlVal={ctaNaverUrl} setUrlVal={setCtaNaverUrl} urlPlaceholder="https://booking.naver.com/booking/..." />
 399:             </div>
 400:           </div>
 401: 
 402:           {ctaOptions.length > 0 && (
 403:             <label className="flex flex-col gap-1 text-sm">
 404:               <span>강조 채널 <span className="ml-1 text-rose-600">*</span></span>
 405:               <select
 406:                 name="featuredChannelId"
 407:                 value={values.featuredChannelId}
 408:                 onChange={(e) => setField("featuredChannelId", e.target.value)}
 409:                 required
 410:                 className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
 411:               >
 412:                 <option value="">— 선택 —</option>
 413:                 {ctaOptions.map((o) => (
 414:                   <option key={o.value} value={o.value}>{o.label}</option>
 415:                 ))}
 416:               </select>
 417:               {fieldErrors.featuredChannelId && <span className="text-xs text-rose-700">{fieldErrors.featuredChannelId.join(", ")}</span>}
 418:             </label>
 419:           )}
 420:         </fieldset>
 421: 
 422:         {/* (c) 정책 변수 */}
 423:         <fieldset className="flex flex-col gap-4 rounded-md border border-slate-200 p-4">
 424:           <legend className="px-1 text-sm font-medium text-slate-900">정책 변수 (개인정보 보호책임자 등)</legend>
 425:           <p className="text-xs text-slate-600">5종 정책 문서(개인정보처리방침·이용약관·비급여·환불·민원)의 변수에 사용됩니다.</p>
 426:           <Field name="policyContactPerson" label="개인정보 보호책임자" required value={values.policyContactPerson} onChange={(v) => setField("policyContactPerson", v)} errors={fieldErrors.policyContactPerson} maxLength={100} />
 427:           <Field name="policyContactEmail" label="보호책임자 이메일" required type="email" value={values.policyContactEmail} onChange={(v) => setField("policyContactEmail", v)} errors={fieldErrors.policyContactEmail} maxLength={200} />
 428:           <Field name="policyContactPhone" label="보호책임자 전화" required value={values.policyContactPhone} onChange={(v) => setField("policyContactPhone", v)} errors={fieldErrors.policyContactPhone} placeholder="02-1234-5678" />
 429:           <Field name="policyEffectiveDate" label="기본 시행일 (5종 정책 공통 default)" required type="date" value={values.policyEffectiveDate} onChange={(v) => setField("policyEffectiveDate", v)} errors={fieldErrors.policyEffectiveDate} />
 430:         </fieldset>
 431: 
 432:         {/* (d) 5 LegalDocument effective date override */}
 433:         <fieldset className="flex flex-col gap-3 rounded-md border border-slate-200 p-4">
 434:           <legend className="px-1 text-sm font-medium text-slate-900">정책 문서 시행일 (선택 · 미입력 시 기본 시행일 사용)</legend>
 435:           <p className="text-xs text-amber-800">
 436:             본원 정보(기관명·법인명·사업자번호·설립자·본원 주소·전화·이메일) 또는 정책 변수(담당자·이메일·전화·시행일)를 수정하면 5종 정책 문서 본문이 자동으로 다시 생성됩니다. 본문 직접 수정은 추후 단계에서 합류합니다.
 437:           </p>
 438:           <div className="flex flex-col gap-2">
 439:             {CLOSED_DOC_TYPES.map((t) => {
 440:               const headerId = `legal-override-${t}`;
 441:               return (
 442:                 <details key={t} className="rounded-md border border-slate-200 bg-white p-2">
 443:                   <summary id={headerId} className="cursor-pointer text-sm">
 444:                     {DOC_TYPE_LABEL[t]} <span className="text-xs text-slate-500">(현재: {values.legalDocEffectiveOverrides[t] || values.policyEffectiveDate || "—"})</span>
 445:                   </summary>
 446:                   <div className="mt-2" aria-labelledby={headerId}>
 447:                     <Field
 448:                       name={`legalDocEffective_${t}`}
 449:                       label={`${DOC_TYPE_LABEL[t]} 시행일 override`}
 450:                       type="date"
 451:                       value={values.legalDocEffectiveOverrides[t]}
 452:                       onChange={(v) => setLegalDocOverride(t, v)}
 453:                       errors={fieldErrors[`legalDocEffectiveOverrides.${t}`]}
 454:                     />
 455:                   </div>
 456:                 </details>
 457:               );
 458:             })}
 459:           </div>
 460:         </fieldset>
 461: 
 462:         <SubmitButton />
 463:       </form>
 464:     </div>
 465:   );
 466: }
 467: 
 468: function CtaRow({
 469:   type,
 470:   label,
 471:   enabled,
 472:   setEnabled,
 473:   labelVal,
 474:   setLabelVal,
 475:   urlVal,
 476:   setUrlVal,
 477:   urlPlaceholder,
 478: }: {
 479:   type: "phone" | "kakao-talk" | "naver-reservation";
 480:   label: string;
 481:   enabled: boolean;
 482:   setEnabled: (v: boolean) => void;
 483:   labelVal: string;
 484:   setLabelVal: (v: string) => void;
 485:   urlVal: string;
 486:   setUrlVal: (v: string) => void;
 487:   urlPlaceholder: string;
 488: }) {
 489:   return (
 490:     <div className="flex flex-col gap-2 border-b border-slate-100 pb-2 last:border-0">
 491:       <label className="flex items-center gap-2 text-sm">
 492:         <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
 493:         {label}
 494:       </label>
 495:       {enabled && (
 496:         <div className="grid grid-cols-1 gap-2 pl-6 md:grid-cols-2">
 497:           <input
 498:             type="text"
 499:             name={`cta_${type}_label`}
 500:             value={labelVal}
 501:             onChange={(e) => setLabelVal(e.target.value)}
 502:             placeholder="표시 라벨"
 503:             className="rounded-md border border-slate-300 px-2 py-1 text-xs"
 504:           />
 505:           <input
 506:             type="text"
 507:             name={`cta_${type}_targetUrl`}
 508:             value={urlVal}
 509:             onChange={(e) => setUrlVal(e.target.value)}
 510:             placeholder={urlPlaceholder}
 511:             className="rounded-md border border-slate-300 px-2 py-1 text-xs"
 512:           />
 513:         </div>
 514:       )}
 515:     </div>
 516:   );
 517: }
 518: 
 519: function SubmitButton() {
 520:   const { pending } = useFormStatus();
 521:   return (
 522:     <button
 523:       type="submit"
 524:       disabled={pending}
 525:       className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
 526:     >
 527:       {pending ? "저장 중…" : "저장 (ClinicProfile + 본원 위치 + 정책 문서 5종)"}
 528:     </button>
 529:   );
 530: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content packages/core-content/src/templates/render.ts | ForEach-Object { $i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content packages/core-content/src/templates/index.ts | ForEach-Object { $i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content packages/core-content/src/templates/__tests__.ts | ForEach-Object { $i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg --files packages | rg "migrations|manifest|runner|package.json"' in C:\Users\assag\solution\website-exposure
 succeeded in 665ms:
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

 succeeded in 680ms:
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

 succeeded in 668ms:
packages\storage\package.json
packages\db\package.json
packages\migrations-runner\tsconfig.tsbuildinfo
packages\migrations-runner\tsconfig.json
packages\shared-types\package.json
packages\shared-errors\package.json
packages\notifications-outbox\package.json
packages\db\migrations\D0010_instance.sql
packages\migrations-runner\src\index.ts
packages\migrations-runner\package.json
packages\auth\package.json
packages\core-content\package.json
packages\migrations-runner\dist\index.js.map
packages\migrations-runner\dist\index.js
packages\migrations-runner\dist\index.d.ts.map
packages\migrations-runner\dist\index.d.ts
packages\core-content\migrations\C0004_treatment_page.sql
packages\core-content\migrations\C0003_doctor_profile.sql
packages\core-content\migrations\C0002_location_profile.sql
packages\core-content\migrations\C0001_clinic_profile.sql
packages\core-content\migrations\C0006_legal_document.sql
packages\core-content\migrations\C0005_article.sql
packages\core-content\migrations\C0007_clinic_profile_policy_vars.sql
packages\core-content\migrations\C0008_location_profile_parent_clinic.sql

 succeeded in 674ms:
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

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content packages/core-content/package.json | ForEach-Object { $i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content packages/migrations-runner/src/index.ts | ForEach-Object { $i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content packages/core-content/src/schema.ts | ForEach-Object { $i++; if($i -le 340){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
 succeeded in 633ms:
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
  12:     "build": "tsc -p tsconfig.json",
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

 succeeded in 637ms:
   1: // @glitzy/migrations-runner — Spike D LOCAL_PASS 승격 (placeholder·v0.1)
   2: // SoT: memory/milestone_spike_d_local_pass.md
   3: //
   4: // 향후 module:
   5: //   - runner.ts (loadMigrations·runMigrate·migrationsDir·stopAfter·forward-only guard·per-file tx)
   6: //   - deploy.ts (runDeploy·deploy coordinator lock·pending N-1·empty target 11-class guard·pre/post-drift)
   7: //   - drift-check.ts (snapshotSchema·diffSnapshots·checkDriftAgainstShadow — definition-aware)
   8: //   - schema-reset.ts (DROP SCHEMA public CASCADE)
   9: //   - service-role-emit.ts (audit_event 1:1 per migration)
  10: 
  11: export {};

 succeeded in 665ms:
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
 120:     // LL-SCHEMA-14: composite FK (DEFERRABLE INITIALLY DEFERRED 는 raw SQL · Drizzle 미지원)
 121:     clinicFk: foreignKey({
 122:       columns: [t.instanceId, t.clinicProfileId],
 123:       foreignColumns: [clinicProfile.instanceId, clinicProfile.id],
 124:       name: "location_profile_clinic_fk",
 125:     }).onDelete("cascade"),
 126:     instanceSlugUnique: unique("location_profile_instance_slug_unique").on(t.instanceId, t.slug),
 127:     instanceIdUnique: unique("location_profile_instance_id_unique").on(t.instanceId, t.id),
 128:     instanceIdx: index("location_profile_instance_idx").on(t.instanceId),
 129:     clinicIdx: index("location_profile_clinic_idx").on(t.instanceId, t.clinicProfileId),
 130:   }),
 131: );
 132: 
 133: // === DoctorProfile (C-02) ===
 134: 
 135: export const doctorProfile = pgTable(
 136:   "doctor_profile",
 137:   {
 138:     id: uuid("id").primaryKey().defaultRandom(),
 139:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
 140:     slug: text("slug").notNull(),
 141:     name: text("name").notNull(),
 142:     title: text("title"),
 143:     jobTitle: text("job_title"),
 144:     honorific: text("honorific"),
 145:     bio: text("bio"),
 146:     photoUrl: text("photo_url"),
 147:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
 148:     displayOrder: integer("display_order").notNull().default(0),
 149:     active: boolean("active").notNull().default(true),
 150:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
 151:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
 152:   },
 153:   (t) => ({
 154:     slugRegex: check("doctor_profile_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
 155:     nameLen: check("doctor_profile_name_length", sql`length(${t.name}) BETWEEN 1 AND 100`),
 156:     instanceSlugUnique: unique("doctor_profile_instance_slug_unique").on(t.instanceId, t.slug),
 157:     instanceIdUnique: unique("doctor_profile_instance_id_unique").on(t.instanceId, t.id),
 158:     instanceIdx: index("doctor_profile_instance_idx").on(t.instanceId),
 159:     activeOrderIdx: index("doctor_profile_active_order_idx")
 160:       .on(t.instanceId, t.active, t.displayOrder)
 161:       .where(sql`${t.active} = true`),
 162:   }),
 163: );
 164: 
 165: // === TreatmentPage (C-03·M0-02 9-state·M0-03 risk enum·M0-17 summary 50~160) ===
 166: 
 167: export const treatmentPage = pgTable(
 168:   "treatment_page",
 169:   {
 170:     id: uuid("id").primaryKey().defaultRandom(),
 171:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
 172:     slug: text("slug").notNull(),
 173:     title: text("title").notNull(),
 174:     summary: text("summary").notNull(),
 175:     bodyMarkdown: text("body_markdown").notNull(),
 176:     status: contentPublicationStatusEnum("status").notNull().default("draft"),
 177:     riskLevel: riskLevelEnum("risk_level"),
 178:     complianceRecordId: uuid("compliance_record_id"),
 179:     heroImageUrl: text("hero_image_url"),
 180:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
 181:     publishedAt: timestamp("published_at", { withTimezone: true }),
 182:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
 183:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
 184:   },
 185:   (t) => ({
 186:     slugRegex: check("treatment_page_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
 187:     titleLen: check("treatment_page_title_length", sql`length(${t.title}) BETWEEN 1 AND 200`),
 188:     summaryLen: check("treatment_page_summary_length", sql`length(${t.summary}) BETWEEN 50 AND 160`),
 189:     publishedRequiresAt: check("treatment_page_published_requires_at", sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`),
 190:     instanceSlugUnique: unique("treatment_page_instance_slug_unique").on(t.instanceId, t.slug),
 191:     instanceIdUnique: unique("treatment_page_instance_id_unique").on(t.instanceId, t.id),
 192:     instanceIdx: index("treatment_page_instance_idx").on(t.instanceId),
 193:     statusIdx: index("treatment_page_status_idx").on(t.instanceId, t.status),
 194:     publishedIdx: index("treatment_page_published_idx")
 195:       .on(t.instanceId, t.publishedAt)
 196:       .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
 197:   }),
 198: );
 199: 
 200: // === Article (C-04·M0-05 ON DELETE NO ACTION) ===
 201: 
 202: export const article = pgTable(
 203:   "article",
 204:   {
 205:     id: uuid("id").primaryKey().defaultRandom(),
 206:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
 207:     slug: text("slug").notNull(),
 208:     title: text("title").notNull(),
 209:     summary: text("summary").notNull(),
 210:     bodyMarkdown: text("body_markdown").notNull(),
 211:     status: contentPublicationStatusEnum("status").notNull().default("draft"),
 212:     riskLevel: riskLevelEnum("risk_level"),
 213:     complianceRecordId: uuid("compliance_record_id"),
 214:     heroImageUrl: text("hero_image_url"),
 215:     authorDoctorId: uuid("author_doctor_id"),
 216:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
 217:     publishedAt: timestamp("published_at", { withTimezone: true }),
 218:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
 219:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
 220:   },
 221:   (t) => ({
 222:     slugRegex: check("article_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,99}$'`),
 223:     titleLen: check("article_title_length", sql`length(${t.title}) BETWEEN 1 AND 200`),
 224:     summaryLen: check("article_summary_length", sql`length(${t.summary}) BETWEEN 80 AND 200`),
 225:     publishedRequiresAt: check("article_published_requires_at", sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`),
 226:     instanceSlugUnique: unique("article_instance_slug_unique").on(t.instanceId, t.slug),
 227:     instanceIdUnique: unique("article_instance_id_unique").on(t.instanceId, t.id),
 228:     instanceIdx: index("article_instance_idx").on(t.instanceId),
 229:     statusIdx: index("article_status_idx").on(t.instanceId, t.status),
 230:     publishedIdx: index("article_published_idx")
 231:       .on(t.instanceId, t.publishedAt)
 232:       .where(sql`${t.status} = 'published' AND ${t.publishedAt} IS NOT NULL`),
 233:     authorIdx: index("article_author_idx")
 234:       .on(t.instanceId, t.authorDoctorId)
 235:       .where(sql`${t.authorDoctorId} IS NOT NULL`),
 236:     // M0-05 cycle2: ON DELETE NO ACTION (Drizzle 기본·onDelete 미명시)
 237:     authorFk: foreignKey({
 238:       columns: [t.instanceId, t.authorDoctorId],
 239:       foreignColumns: [doctorProfile.instanceId, doctorProfile.id],
 240:       name: "article_author_fk",
 241:     }),
 242:   }),
 243: );
 244: 
 245: // === LegalDocument (C-16·LOCATION_LEGAL_PLAN v1.0 § 2.1) ===
 246: 
 247: export const legalDocument = pgTable(
 248:   "legal_document",
 249:   {
 250:     id: uuid("id").primaryKey().defaultRandom(),
 251:     instanceId: uuid("instance_id").notNull().references(() => instance.id, { onDelete: "cascade" }),
 252:     slug: text("slug").notNull(),
 253:     documentType: legalDocumentTypeEnum("document_type").notNull(),
 254:     title: text("title").notNull(),
 255:     body: text("body").notNull(),
 256:     autoGenerated: boolean("auto_generated").notNull().default(true),
 257:     templateVersion: text("template_version"),
 258:     effectiveDate: date("effective_date").notNull(),
 259:     lastRevisedDate: date("last_revised_date"),
 260:     contactPerson: text("contact_person"),
 261:     contactEmail: text("contact_email"),
 262:     status: contentPublicationStatusEnum("status").notNull().default("draft"),
 263:     riskLevel: riskLevelEnum("risk_level").notNull().default("Low"),
 264:     publishedAt: timestamp("published_at", { withTimezone: true }),
 265:     metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
 266:     createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
 267:     updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
 268:   },
 269:   (t) => ({
 270:     slugRegex: check("legal_document_slug_regex", sql`${t.slug} ~ '^[a-z0-9][a-z0-9-]{2,63}$'`),
 271:     titleLen: check("legal_document_title_length", sql`length(${t.title}) BETWEEN 1 AND 100`),
 272:     bodyLen: check("legal_document_body_length", sql`length(${t.body}) BETWEEN 1 AND 200000`),
 273:     emailRegex: check("legal_document_email_regex", sql`${t.contactEmail} IS NULL OR ${t.contactEmail} ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'`),
 274:     // LL-SCHEMA-05 + cycle1 LL-22
 275:     templateVersionFormat: check("legal_document_template_version_format", sql`${t.templateVersion} IS NULL OR ${t.templateVersion} ~ '^[a-z0-9-]+@[0-9]+\\.[0-9]+\\.[0-9]+$'`),
 276:     autoGenTemplateVer: check("legal_document_auto_generated_template_ver", sql`(${t.autoGenerated} = false) OR (${t.templateVersion} IS NOT NULL)`),
 277:     // LL-SCHEMA-03 + cycle1 LL-03·19: skeleton 단계 status='draft' 만
 278:     statusSkeletonLimit: check("legal_document_status_skeleton_limit", sql`${t.status} = 'draft'`),
 279:     publishedAtNull: check("legal_document_published_at_null", sql`${t.publishedAt} IS NULL`),
 280:     // LL-SCHEMA-06 + cycle1 LL-12: risk_level 'Low' 만
 281:     riskLevelSkeletonLimit: check("legal_document_risk_level_skeleton_limit", sql`${t.riskLevel} = 'Low'`),
 282:     instanceSlugUnique: unique("legal_document_instance_slug_unique").on(t.instanceId, t.slug),
 283:     instanceIdUnique: unique("legal_document_instance_id_unique").on(t.instanceId, t.id),
 284:     // LL-SCHEMA-02 + cycle1 LL-08·09: closed 5종 partial UNIQUE (cookie/other 미강제)
 285:     type5Unique: uniqueIndex("legal_document_instance_5type_unique")
 286:       .on(t.instanceId, t.documentType)
 287:       .where(sql`${t.documentType} IN ('privacy', 'terms', 'non-covered', 'refund', 'complaint')`),
 288:     instanceIdx: index("legal_document_instance_idx").on(t.instanceId),
 289:   }),
 290: );

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content apps/web/src/lib/tenant.ts | ForEach-Object { $i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"site-meta-fetch|safeUrl|fetch\\(\" apps/web/src -g \"*.ts\" -g \"*.tsx\"" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "LL-CASCADE-01|LL-CASCADE-02|LL-CASCADE-03|LL-CASCADE-04|LL-CASCADE-05|migrations-runner manifest|manifest" docs packages -g "*.md" -g "*.ts" -g "*.json"' in C:\Users\assag\solution\website-exposure
 succeeded in 629ms:
   1: // @glitzy/web/lib/tenant — withSkeletonTx 2단계 패턴 (Plan v1.0 § 5.3 ADMIN-UI-04·30)
   2: // packages/auth.withResolvedTenantTransaction 의 RLS role 누락 우회
   3: 
   4: import { resolveTenantContext, type TenantContext } from "@glitzy/auth";
   5: import { withTenantTransaction, type ScopedTx } from "@glitzy/db";
   6: import { asUuidV4, type InstanceId } from "@glitzy/shared-types";
   7: 
   8: import { getSqlBase } from "./db";
   9: import { getAuthCfg } from "./env";
  10: 
  11: /**
  12:  * Plan § 5.3: 2단계 패턴
  13:  *   1) resolveTenantContext (signature 검증 · TTL · membership · eligibility · audit)
  14:  *   2) withTenantTransaction (SET LOCAL ROLE app_tenant_user + SET LOCAL app.current_instance_id)
  15:  */
  16: export async function withSkeletonTx<T>(
  17:   args: { signedToken: string; instanceId: InstanceId },
  18:   fn: (tx: ScopedTx, ctx: TenantContext) => Promise<T>,
  19: ): Promise<T> {
  20:   const sql = getSqlBase();
  21:   const cfg = getAuthCfg();
  22:   const ctx = await resolveTenantContext(sql, cfg, args.signedToken, args.instanceId);
  23:   // ctx.instanceId 는 plain string · branded InstanceId 변환 (ADMIN-UI-30)
  24:   const brandedId = asUuidV4(ctx.instanceId) as InstanceId;
  25:   return withTenantTransaction(sql, { instanceId: brandedId }, (tx) => fn(tx, ctx));
  26: }

 succeeded in 633ms:
apps/web/src\components\forms\ClinicProfileForm.tsx:185:      const res = await fetch("/api/site-meta-fetch", {
apps/web/src\components\forms\ClinicProfileForm.tsx:197:      const safeUrl = (v: string | null): string | null => {
apps/web/src\components\forms\ClinicProfileForm.tsx:212:        const safeLogo = safeUrl(m.logoUrl);
apps/web/src\components\forms\ClinicProfileForm.tsx:214:        const safeOg = safeUrl(m.ogImageUrl);
apps/web/src\components\forms\ClinicProfileForm.tsx:220:      console.error("[site-meta-fetch] client fetch error", err);
apps/web/src\lib\site-meta-fetch.ts:1:// @glitzy/web/lib/site-meta-fetch — 외부 사이트 URL → meta scrape
apps/web/src\lib\site-meta-fetch.ts:162:      res = await fetch(current.toString(), {
apps/web/src\lib\site-meta-fetch.ts:166:          "user-agent": "GlitzyAdmin/0.1 site-meta-fetch",
apps/web/src\app\api\site-meta-fetch\route.ts:1:// @glitzy/web/api/site-meta-fetch — 외부 사이트 URL meta scrape
apps/web/src\app\api\site-meta-fetch\route.ts:22:import { fetchSiteMeta, sanitizeUrlForAudit, SiteMetaFetchError } from "@/lib/site-meta-fetch";
apps/web/src\app\api\site-meta-fetch\route.ts:36:    console.error("[site-meta-fetch] audit emit failed", err);
apps/web/src\app\api\site-meta-fetch\route.ts:81:      eventType: "site-meta-fetch-failed",
apps/web/src\app\api\site-meta-fetch\route.ts:119:      eventType: "site-meta-fetch-failed",
apps/web/src\app\api\site-meta-fetch\route.ts:131:      eventType: "site-meta-fetch-failed",
apps/web/src\app\api\site-meta-fetch\route.ts:143:      eventType: "site-meta-fetched",
apps/web/src\app\api\site-meta-fetch\route.ts:156:        eventType: "site-meta-fetch-failed",
apps/web/src\app\api\site-meta-fetch\route.ts:165:    console.error("[site-meta-fetch] unexpected", err);
apps/web/src\app\api\site-meta-fetch\route.ts:167:      eventType: "site-meta-fetch-failed",

 succeeded in 625ms:
docs\admin\REVIEW_WORKFLOW.md:166:- 미처리 warning이 있는 채로도 발행 가능 (P2 — 발행 비차단) — 단, publishable 조건 § 7.1 (6)에 운영 정책별 강제 처리 옵션 (instance manifest 설정 — AW-09)
docs\admin\REVIEW_WORKFLOW.md:791:| AW-09 | warning 강제 처리 정책 — instance manifest 옵션 (§ 3.1.1) | 운영 정책 |
docs\ARCHITECTURE.md:159:5. **버전 명시**: L3 인스턴스는 사용하는 L1·L2·Feature Module의 버전을 **instance manifest**에 명시. 자동 반영 금지.
docs\ARCHITECTURE.md:368:Instance manifest에 모듈 활성화 추가. 코드 변경 없음.
docs\admin\ARCHITECTURE.md:355:- 인스턴스 manifest 버전 표시
docs\decisions\PACKAGES_STRUCTURE.md:147:각 package는 자체 `migrations/` 디렉토리·**4-digit numbering으로 cross-package ordering** + **package-level dependency manifest** 병행:
docs\decisions\PACKAGES_STRUCTURE.md:152:  └── manifest.json (depends_on: ["<pkg-a>", "<pkg-b>"]·order: 1-N)
docs\decisions\PACKAGES_STRUCTURE.md:162:### Cross-package dependency manifest
docs\decisions\PACKAGES_STRUCTURE.md:164:각 package `migrations/manifest.json`:
docs\decisions\PACKAGES_STRUCTURE.md:178:`@glitzy/migrations-runner`가 모든 package manifest를 topological sort·dependency 순서 보장·`migration_ledger`에 통합 기록:
docs\decisions\M0_SCHEMA_PLAN.md:122:| **M0-07** migrations-runner manifest·depends_on | packages/migrations-runner v0.3 separate scope | Spike D LOCAL_PASS 패턴 (advisory lock·drift check 등)을 production module로 승격하는 별도 작업·M0 schema와 독립 |
docs\decisions\M0_BUILD_EXPORT_PLAN.md:3:> **상태**: **v0.1 (placeholder)** — `LOCATION_LEGAL_PLAN.md` v1.0 acceptance 의 LL-CASCADE-04 precondition 으로 신설. 실 plan content 는 M0 v1.0 본 구현 (`apps/worker` build/export 함수) 진입 시점에 합류.
docs\decisions\M0_BUILD_EXPORT_PLAN.md:11:- `docs/decisions/LOCATION_LEGAL_PLAN.md` v1.0 — LL-CASCADE-04 책임 명시 (본 문서 의 cascade target)
docs\decisions\M0_BUILD_EXPORT_PLAN.md:22:### 1.2 LL-CASCADE-04 책임 (LOCATION_LEGAL_PLAN v1.0 cascade)
docs\decisions\M0_BUILD_EXPORT_PLAN.md:36:### 1.3 LL-CASCADE-04 외 (M0 v1.0 합류 시점에 확장)
docs\decisions\M0_BUILD_EXPORT_PLAN.md:61:| 2026-05-16 | v0.1 | LOCATION_LEGAL_PLAN v1.0 acceptance precondition 으로 placeholder 신설. LL-CASCADE-04 책임 명시 (ClinicProfile.locations / LocationProfile.parentClinic·reservationChannels / primary_ctas `id` → `@id` alias). |
docs\decisions\LOCATION_LEGAL_PLAN.md:5:> **acceptance commit 구성 (cycle2 LL-33 · cycle5 LL-56 acceptance precondition)**: 본 commit 에 다음 5 cascade 동시 포함 — (1) LOCATION_LEGAL_PLAN.md v1.0 (본 문서), (2) LL-CASCADE-01 docs/admin/ARCHITECTURE.md § 3.8.2 patch, (3) LL-CASCADE-02 docs/decisions/ADMIN_UI_SKELETON_PLAN.md § 5.5 patch, (4) LL-CASCADE-03 docs/core/CONTENT_STANDARDS.md § 7 patch, (5) LL-CASCADE-04 docs/decisions/M0_BUILD_EXPORT_PLAN.md v0.1 placeholder (작성 완료). LL-CASCADE-05 (packages/migrations-runner manifest spec) 은 manifest 파일 신설 정도 — 실 runner 코드 acceptance 는 LL-DEFER-20 (M0 v1.0 본 구현).
docs\decisions\LOCATION_LEGAL_PLAN.md:201:    -- DB key = 'id' (Git 출력 시 '@id' alias 변환은 LL-CASCADE-04 build/export 책임)
docs\decisions\LOCATION_LEGAL_PLAN.md:366:- (LL-ACTION-08 · cycle1 LL-02 + cycle3 LL-45 patch — LL-SCHEMA-12·LL-SCHEMA-18 통일) LocationProfile 자동 상속 = **build-time reference (deep clone)**. server action 안 DB 저장은 `metadata.reservationChannelsInheritedFrom = "clinic_profile.primary_ctas"` marker 만 (의도 명시용). 실제 출력 시점은 apps/worker · M0 v1.0 build/export 의 책임 (LL-CASCADE-04 marker 신설).
docs\decisions\LOCATION_LEGAL_PLAN.md:406:- (LL-ACTION-16 · cycle1 LL-06 + cycle2 LL-33 patch) `policy.*` 변수 정당화 — admin/ARCH § 3.8.2 의 `contactPerson` 필드 + § 3.8.2 결정 ("ClinicProfile 폼 '정책 변수' 보조 섹션") 이 SoT 출처. ARCH 본문에 `policy.*` 변수가 명시되지 않은 것은 ARCH 의 변수 사용 sample 일 뿐. **acceptance 전 순서 정합 (cycle2 LL-33)**: 본 plan v1.0 acceptance **와 동시 또는 직전에** ARCH § 3.8.2 patch (LL-CASCADE-01) 적용 — plan acceptance commit 안에 ARCH 패치 포함. plan 단독 acceptance 시 ARCH SoT 충돌 잔존하므로 cascade 가 acceptance precondition.
docs\decisions\LOCATION_LEGAL_PLAN.md:434:- (LL-ACTION-19 · cycle1 LL-17 patch) ADMIN_UI_SKELETON_PLAN § 5.5 audit matrix cascade — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed 별도 row 추가 marker (LL-CASCADE-02). 기존 ClinicProfile row 와 동일 통일 shape.
docs\decisions\LOCATION_LEGAL_PLAN.md:487:- (LL-TEMPLATE-05 · cycle1 LL-06 patch) 변수 화이트리스트 (admin/ARCH § 3.8.2 SoT cascade marker LL-CASCADE-01 — ARCH 본문에 본 표 reference 추가):
docs\decisions\LOCATION_LEGAL_PLAN.md:492:- (LL-TEMPLATE-07 · cycle1 LL-13 patch) **LegalDocument body 검증 면제 명시** — `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표에 LegalDocument 추가 (cascade marker LL-CASCADE-03). 면제 범위: (1) answer-first AST 미적용 (정책 문서는 첫 문장 답 제시 구조 아님) (2) 표현 검사 (recommend/best 등 광고 표현) 미적용 (3) 변수 화이트리스트 검증은 별도 룰 (LL-ACTION-12).
docs\decisions\LOCATION_LEGAL_PLAN.md:538:| 9 | content-saved audit matrix row 추가 (LocationProfile · LegalDocument) | ADMIN_UI_SKELETON_PLAN § 5.5 cascade marker (LL-CASCADE-02) |
docs\decisions\LOCATION_LEGAL_PLAN.md:539:| 10 | admin/ARCHITECTURE.md § 3.8.2 변수 화이트리스트 reference 추가 | LL-CASCADE-01 |
docs\decisions\LOCATION_LEGAL_PLAN.md:540:| 11 | docs/core/CONTENT_STANDARDS.md § 7 LegalDocument 예외 marker 추가 | LL-CASCADE-03 |
docs\decisions\LOCATION_LEGAL_PLAN.md:549:- `LL-DEFER-11`: LegalDocument body 검증 — CONTENT_STANDARDS § 7 ContentType 예외 marker cascade (LL-CASCADE-03). 추가 검증 룰은 compliance-assistant Feature.
docs\decisions\LOCATION_LEGAL_PLAN.md:552:- `LL-DEFER-20` (cycle4 LL-53 patch): packages/migrations-runner 실 runner 코드 — manifest spec 작성 (plan v1.0 acceptance precondition) 후 sequential apply + fail-fast 구현. M0 v1.0 본 구현.
docs\decisions\LOCATION_LEGAL_PLAN.md:588:> **acceptance 순서 정합 (cycle2 LL-33)**: LL-CASCADE-01 은 plan v1.0 acceptance 와 **동시 또는 직전** 에 ARCH patch 적용 (plan acceptance commit 안 포함). LL-CASCADE-02 · LL-CASCADE-03 · LL-CASCADE-04 도 동일 정책. plan 단독 acceptance 는 SoT 충돌 잔존이므로 cascade 가 acceptance precondition.
docs\decisions\LOCATION_LEGAL_PLAN.md:590:- `LL-CASCADE-01`: `docs/admin/ARCHITECTURE.md` § 3.8.2 표 — body 변수 화이트리스트 11개 (clinic 4 + location 3 + policy 4) reference 추가. ARCH v0.8 patch. **acceptance precondition**.
docs\decisions\LOCATION_LEGAL_PLAN.md:591:- `LL-CASCADE-02`: `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` § 5.5 audit matrix — LocationProfile · LegalDocument · content-saved-partial · content-saved-failed row 추가. **acceptance precondition**.
docs\decisions\LOCATION_LEGAL_PLAN.md:592:- `LL-CASCADE-03`: `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표 — LegalDocument 면제 marker 추가 (answer-first AST · 표현 검사 면제 · 변수 화이트리스트 별도 룰). **acceptance precondition**.
docs\decisions\LOCATION_LEGAL_PLAN.md:593:- `LL-CASCADE-04` (cycle3 LL-41 + cycle4 LL-49 + **cycle5 LL-56 patch — placeholder 실 파일 작성 완료**): **cascade target 정정** — ADMIN_UI_SKELETON_PLAN § 6 은 walking skeleton 의 actions 영역으로 build/export 부재 → **`docs/decisions/M0_BUILD_EXPORT_PLAN.md` (v0.1 placeholder · 2026-05-16 작성 완료)** + 본 plan 의 LL-CASCADE-04 marker reference. apps/worker · M0 v1.0 Git export 책임: LocationProfile.reservationChannels Git 출력 시 `clinic_profile.primary_ctas` deep clone, LocationProfile.@id = `"main"`, LocationProfile.parentClinic = ClinicProfile.@id reference, ClinicProfile.locations[] = SELECT 결과, primary_ctas DB key `id` → Git output `@id` alias 변환. **acceptance 강도 = placeholder 작성 완료** (`docs/decisions/M0_BUILD_EXPORT_PLAN.md` § 1.2 LL-CASCADE-04 책임 표 명시). 실 구현은 M0 v1.0 본 구현.
docs\decisions\LOCATION_LEGAL_PLAN.md:594:- `LL-CASCADE-05` (cycle3 LL-42 + cycle4 LL-53 patch): `packages/migrations-runner` — cross-package depends_on manifest 또는 sequential apply 보장. **acceptance 강도 명시** — plan v1.0 acceptance 는 **manifest spec 작성까지만 차단** (manifest 파일 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` 의 spec 작성 + 본 plan 의 8단계 의존성 표 cascade). 실 runner 코드 구현은 M0 v1.0 cascade (LL-DEFER-20 신설). 즉 plan v1.0 acceptance ≠ runner 코드 acceptance.
docs\decisions\LOCATION_LEGAL_PLAN.md:601:| 2026-05-16 | v0.2 | **Codex 비평 cycle1 25 findings (7 blocking + 12 major + 6 minor) 전건 수용 patch**: (LL-01) location_profile 에 clinic_profile_id composite FK + main row CHECK, ClinicProfile.locations[] Git 출력 빌드 시점 동적 구성. (LL-02) ClinicProfile.primary_ctas 컬럼 + LocationProfile.reservationChannels = primary_ctas 자동 상속 marker. (LL-03·04) status='draft' 만 허용 (review-queued 도 차단) — ComplianceRecord pre-publish + NotificationEvent 합류 시점까지 defer. (LL-05) businessHours SoT CT-02 형식 (openingHours[]·receptionHours[]·lunchBreaks[]·specialClosures[]) 변환 + server action 안 convertToOpeningHoursSpec 명시. (LL-06) policy.* 변수 정당화 + LL-CASCADE-01 cascade marker. (LL-07) 잠금 순서 = ClinicProfile → LocationProfile → 5종 alpha. (LL-08·09) partial UNIQUE — closed 5종만. cookie/other LL-DEFER-12. (LL-10) C-21 출력 매핑표 명시. (LL-11) representativeDoctors v0.2 빈 배열. (LL-12) risk_level NOT NULL + CHECK 'Low' 만. (LL-13) SoT 경로 정정 (docs/core/CONTENT_STANDARDS.md) + LL-CASCADE-03. (LL-14) policyContactPhone form 단계 required. (LL-15) effective_date individual override 합류 (LL-DEFER-08 closed). (LL-16) 자동 재렌더링 분기 제거 (모든 row 매 저장 시 재렌더링). (LL-17) audit 7 row 별도 emit (Bundle outer 폐기). (LL-18) RBAC 분리 marker LL-DEFER-09 명시. (LL-19) published CHECK 위반 시 운영자 메시지 + errors.ts 매핑. (LL-20) phone regex 한국 + 국제 표기 명시. (LL-21) effective_date timezone Asia/Seoul. (LL-22) template_version naming autoGenerated=true 일 때만 필수. (LL-23) businessHours a11y marker. (LL-24) detection 시점 server action runtime + build-time test cascade. (LL-25) LL-DEFER-08~10 본문 §1 비범위 표 반영. |
docs\decisions\LOCATION_LEGAL_PLAN.md:602:| 2026-05-16 | v0.3 | **Codex 비평 cycle2 12 findings (2 blocking + 6 major + 4 minor) 전건 수용 patch**: (LL-26) primary_ctas CT-03 minimal shape DB CHECK + zod 양쪽 검증 — `{id, type, label, value?/targetUrl?}` enum-restricted. (LL-27) LocationProfile.reservationChannels Git 출력 시점 구성 규칙 명시 — build 시 primary_ctas deep clone 으로 출력. (LL-28) location_profile.clinic_profile_id NOT NULL 전 row 적용 (다지점 합류 시점에도 정합). (LL-29) ClinicProfile.locations[] >=1 보장 = server action assertHasMainLocationAfterTx 안전망 + LL-DEFER-15 DB trigger. (LL-30) receptionHours/specialClosures v0.3 빈 배열 + form (b) UI 미입력 + round-trip 보존 + LL-DEFER-16 form 추가. (LL-31) FormData naming = `legalDoc.<documentType>.effectiveDate` + zod Record schema 명시. (LL-32) audit 7 row sequential + per-row try/catch + 부분 실패 시 `content-saved-partial` + 전체 실패 시 `content-saved-failed` row. (LL-33) cascade acceptance precondition — LL-CASCADE-01~03 plan acceptance 와 동시 patch. (LL-34) CHECK 위반 운영자 메시지에 후속 책임 주체·화면·시점 명시. (LL-35) 5 LegalDocument details a11y marker. (LL-36) LL-DEFER-17 cookie/other 승격 시 partial unique cascade. (LL-37) migration 의존성 8단계 명시 (D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008). **누계 37 findings 전건 수용**. |
docs\decisions\LOCATION_LEGAL_PLAN.md:603:| 2026-05-16 | v0.4 | **Codex 비평 cycle3 10 findings (2 blocking + 5 major + 3 minor) 전건 수용 patch**: (LL-38) Postgres CHECK subquery 불가 → trigger + IMMUTABLE plpgsql function 으로 변경 (`clinic_profile_primary_ctas_validate`). (LL-39) FormData dotted key 회귀 — `legalDocEffective_<documentType>` flat underscore + `extractLegalDocEffectiveOverrides()` parser helper 명시. (LL-40) CT-03 SoT 정렬 — type enum 6종 (phone/email/kakao-talk/kakao-channel/naver-reservation/naver-talk) + targetUrl required. (LL-41) LL-CASCADE-04 신설 — apps/worker · M0 v1.0 build/export 책임 명시 (LocationProfile.reservationChannels deep clone · @id="main" · parentClinic · locations[] SELECT). (LL-42) LL-CASCADE-05 신설 — packages/migrations-runner cross-package depends_on manifest 또는 sequential apply 보장 (acceptance precondition). (LL-43) audit 3단계 안전망 — per-row try/catch + partial/failed row + Sentry capture (LL-DEFER-18). (LL-44) assertHasMainLocationAfterTx → `MainLocationMissingError` named class + errors.ts 별도 분기 (mapDbErrorToResult 와 독립). (LL-45) LL-ACTION-08 vs LL-SCHEMA-12 충돌 — build-time reference 로 통일 (DB metadata 복사 없음 · marker 만). (LL-46) 자동 재렌더링 운영자 알림 — form (d) 상단 안내문 (LL-FORM-15). (LL-47) LL-DEFER phase 별 그룹화 (M0 v1.0 / M1 / M2 / migration / closed). **누계 47 findings 전건 수용**. |
docs\decisions\LOCATION_LEGAL_PLAN.md:604:| 2026-05-16 | v0.5 | **Codex 비평 cycle4 8 findings (2 blocking + 4 major + 2 minor) 전건 수용 patch**: (LL-48) trigger RAISE EXCEPTION USING CONSTRAINT = 'clinic_profile_primary_ctas_shape' 추가 — errors.ts mapDbErrorToResult 가 SQLSTATE 23514 + constraint name 으로 분기 가능. (LL-49) LL-CASCADE-04 target 정정 — ADMIN_UI_SKELETON_PLAN § 6 은 actions 영역으로 build/export 부재. 신규 `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 신설 + LL-CASCADE-04 책임 row 1건 cascade. acceptance 강도 = placeholder 작성. (LL-50) CT-03 enum SoT 정렬 — DB trigger 허용 11종 (phone/email/sms/kakao-talk/kakao-channel/naver-reservation/naver-talk/form/map/external/video-consultation) + UI subset 3종 분리. LL-DEFER-19 8종 UI 합류. (LL-51) form (b) UI copy 정정 — kakao → kakao-talk · naver-booking → naver-reservation 토큰. (LL-52) LL-DEFER-04/05 phase 충돌 정정 — §9.3 → M0 v1.0 본 구현 (LocationProfile 편집 화면) 으로 통일. M2 Phase Beta 표기 제거 (현재 비어 있음 — 외부 사용자 RBAC 가 M2). (LL-53) LL-CASCADE-05 강도 명시 — plan v1.0 acceptance = manifest spec 작성만 차단, 실 runner 코드는 LL-DEFER-20 (M0 v1.0). (LL-54) trigger function IMMUTABLE 마킹 제거 — VOLATILE 기본 (NEW 읽기 + row-specific RAISE 정합). (LL-55) Sentry pre-integration fallback 명시 — v0.5 단계 console/server stdout only, M0 v1.0 LL-DEFER-18 합류 후 Sentry capture. **누계 55 findings 전건 수용**. |
docs\decisions\LOCATION_LEGAL_PLAN.md:605:| 2026-05-16 | v0.6 | **Codex 비평 cycle5 3 findings (1 blocking + 0 major + 2 minor) 전건 수용 patch**: (LL-56) `docs/decisions/M0_BUILD_EXPORT_PLAN.md` placeholder 실 파일 작성 완료 (v0.1 — §1.2 LL-CASCADE-04 책임 표 포함). (LL-57) LL-DEFER-19 phase 단일화 — §9.1 M0 v1.0 그룹 → §9.2 M1 Phase Alpha 그룹 으로 이동 ("M0 v1.0 또는 M1" 모호 표현 정정). M0 v0.5 의 3종 subset 으로 1호 클라이언트 출시 가능 명시. (LL-58) Sentry SDK 초기화 위치 = `apps/web/src/lib/observability.ts` (init + captureException + addBreadcrumb helper) 한 줄 명시 — LL-DEFER-18 내. **누계 58 findings 전건 수용**. |
docs\decisions\LOCATION_LEGAL_PLAN.md:606:| 2026-05-16 | **v1.0** | **Codex 비평 cycle6 1 minor finding (LL-59) 수용 + closeableAfterPatch=true 확정 acceptance**: (LL-59) §2.2 본문 "M0 v1.0 또는 M1 cascade" → "M1 Phase Alpha cascade" 단일화 (LL-DEFER-19 § 9.2 위치와 정합). **수렴 추세 25→12→10→8→3→1 · blocking 0 · major 0 · minor 0 잔존**. cycle6 결과 acceptance commit 5 cascade (LL-CASCADE-01~05) 동시 포함 결정. **누계 59 findings 전건 처리 완료**. |
docs\features\search-visibility.md:232:`runMonitoring` 호출 패턴은 analytics-reporting `runCollection`과 동일 (canonicalSources canonicalization·forceRefresh·refreshIntentId·manifestSnapshotVersion freeze). `canonicalSignals`도 동일 패턴 추가.
docs\features\search-visibility.md:609:| `manifestVersion` | string | ✅ |
docs\decisions\INFRA_DECISIONS_DRAFT.md:8:> **핵심 변경 (v0.3)**: RLS 실행 모델·service-role audit cascade·Phase 0 outbox 분류·tenant export manifest dependency class·Storage ADR 옵션·resolveTenantContext·Phase 0 spike gate·legal-reviewer contract·internal beta 범위 제한·customer domain ADR·사전심의 manual-assisted·PIPA+GDPR checklist·email transport/provider 분리
docs\decisions\INFRA_DECISIONS_DRAFT.md:164:### 1.5 tenant export/import manifest — dependency class (INFRA2-05 강화)
docs\decisions\INFRA_DECISIONS_DRAFT.md:284:| export | per-instance object key prefix scan → R2 manifest 생성 → signed URL list 출력 |
docs\decisions\INFRA_DECISIONS_DRAFT.md:440:| 1. Multi-tenant | Single DB + `app_tenant` role + RLS ON·`withTenantTransaction` 헬퍼·worker control/tenant plane 분리·composite FK 3등급·tenant export manifest dependency class·resolveTenantContext + instance-switched audit |
docs\decisions\INFRA_DECISIONS_DRAFT.md:471:| 2026-05-15 | (v0.3 비고 이전) | **codex 2차 15 지적 전건 수용 + cascade**: (1) **RLS 실행 모델** — withTenantTransaction 헬퍼·SET LOCAL·worker control/tenant plane 분리·pgBouncer transaction pooling·lint·runtime guard (INFRA2-01), (2) **REVIEW_WORKFLOW cascade — service-role-invoked·instance-switched AuditAction 2종 추가** (INFRA2-02·08), (3) **Phase 0 outbox 옵션 A** — P0에 notifications 최소 subset (Receipt·Log·PayloadRecord·DeliveryAttempt) 포함 (INFRA2-03), (4) **composite FK 3등급 분류** — tenant-plane hard FK·control-plane FK·polymorphic ref typed registry (INFRA2-04), (5) **tenant export/import manifest dependency class** — portable·rebind-required·rotate-required·legal-reapproval-required·external-provider-owned·blob-copy-required·audit-chain-preserved (INFRA2-05), (6) **rate limit taxonomy** — Postgres hard quota·Redis soft cache 분리 (INFRA2-06), (7) **Storage ADR — Cloudflare R2 reversal 권장** (INFRA2-07), (8) **resolveTenantContext** — server-side membership/role/legal eligibility 검증·instance-switched audit (INFRA2-08), (9) **Spike A·B·C gate Week 1** (INFRA2-09), (10) **legal-reviewer fixed-scope package → 시간당 → retainer 단계** (INFRA2-10), (11) **internal beta는 workflow technical validation 한정** (INFRA2-11), (12) **customer domain ADR 별도** (INFRA2-12), (13) **사전심의 manual-assisted workflow** — submission packet export·institutionType enum (INFRA2-13), (14) **PIPA + GDPR checklist** Phase 1 gate (INFRA2-14), (15) **DATA_MODEL C-08 v0.23 cascade — email transport/provider 분리** (INFRA2-15) |
docs\features\notifications.md:41:| **§ 9.1.1 매트릭스 의미 변경** (수신자·채널·criticality 등) | MINOR (append-only 시) / MAJOR (기존 version 의미 변경) | **policyVersion 신규 부여** | 패키지는 신규 + 기존 version 병렬 보관 (§ 4.2). 인스턴스 manifest opt-in |
docs\features\notifications.md:48:**매트릭스 정합 운영(병렬 보관 SoT)**: § 9.1.1 매트릭스가 변경되면 본 Feature 패키지에 **새 policyVersion을 추가하고 이전 버전도 병렬 보관**. 인스턴스는 InstanceManifest.config.`notificationPolicyVersion`이 명시한 버전을 사용. 롤백은 manifest의 version만 이전 값으로 변경 (§ 4.2). 운영 배포 순서: 매트릭스 SoT 갱신 → 패키지에 새 version 추가 + 이전 보관 → 인스턴스 manifest 갱신 (opt-in).
docs\features\notifications.md:233:- `sourceEventId` 재사용 금지: NotificationEventReceipt는 `receiptRetentionDays`(기본 365일) 보존. 보존 만료 후 동일 sourceEventId는 새 이벤트로 처리 가능하지만 운영자가 명시적으로 manifest나 호출자 정책에 합치하지 않으면 사용 자제
docs\features\notifications.md:305:- 인스턴스 manifest의 `notificationPolicyVersion`이 명시한 버전을 런타임에 라우팅
docs\features\notifications.md:306:- 빌드 검증(§ 11): manifest version이 본 Feature 패키지에 등록된 version 중 하나여야 함 (불일치 fail)
docs\features\notifications.md:308:  - REVIEW_WORKFLOW § 9.1.1 갱신 → 본 Feature 패키지에 새 policyVersion 추가 (이전 버전도 보관) → 인스턴스 manifest의 `notificationPolicyVersion` 갱신 (opt-in)
docs\features\notifications.md:309:  - 롤백: manifest version을 이전 값으로 변경 (패키지 변경 없음)
docs\features\notifications.md:733:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (7개 지적 전건 수용)**: (1) **REVIEW_WORKFLOW § 9.1.1 매트릭스 정정** — `sla-imminent`·`sla-overdue` 즉시 채널을 `email + inApp`으로 변경. fallback=inApp이 immediateChannels 집합 안에 포함되도록 cascade (N5-01), (2) **§ 4.1 1단계 abort 원인 분기 명시** — unique violation만 idempotent path, 그 외 abort는 retryable internal error 반환. § 3.3과 정합 (N5-02), (3) **DeliveryAttemptStatus 별도 정의** — 내부 attempt-level "processing"을 외부 DeliveryStatus와 분리. `DeliveryAttemptStatus = "processing" | DeliveryStatus` 합 타입 (N5-03), (4) **§ 4.1 흐름에 invalid locationRef 분기 추가** — businessHours 평가 직전 (f-pre)에 `skipped-missing-location` 명시. critical 이벤트도 본 분기는 우회하지 않음 (N5-04), (5) **MySQL generated column unique schema 정정** — `activeKey INT GENERATED AS (CASE WHEN resolvedAt IS NULL THEN 1 ELSE NULL END)` + `UNIQUE(payloadId, failingChannel, activeKey)`. resolved DLQ 이력 다수 허용 (N5-05), (6) **DATA_MODEL C-23 AdminUser.role cascade 정정** — `system` enum 값은 audit log actorRole 표기 전용. C-23 `role` 및 `instanceMemberships[].role`에는 저장 금지 명시 (N5-06), (7) **specVersion 1.0 + 세 버전 의미 차이** — specVersion(명세)·패키지 SemVer·notificationPolicyVersion 구분 한 줄 설명 (N5-07) (1) **트랜잭션 abort 원인 분기** — unique violation만 idempotent path, 그 외 retryable error (N4-01·N4-03), (2) **duplicate caller receiptState별 응답 계약** (N4-02), (3) **DeliveryAttempt advisory lock SoT** — pg_advisory_xact_lock + provider 호출은 lock 밖 (N4-04·N4-06). NT-17, (4) **UNIQUE(payloadId, channel, attemptNumber)** — dedupeMode 제외 (N4-05), (5) **§ 4.1 fallback immediateChannels 제약** 명시 (N4-07), (6) **fallback 실패 두 attempt 기록** + fallbackExhausted 메타 (N4-08), (7) **두 축 분리 정책** — 패키지 SemVer ↔ policyVersion (N4-09), (8) **policyVersion 보관 정책** — 12개월 최소 지원·deprecation·build fail 메시지 (N4-10), (9) **DigestConditionField cascade 규칙** (N4-11), (10) **exists/notExists deep path 평가 규칙** (N4-12), (11) **default policy 유일성 검증** (N4-13), (12) **broadcast PayloadRecord envelope+channel 단위 1건** + broadcast-placeholder는 DB row 아님 + broadcastAttemptId = broadcast DeliveryAttempt.id (N4-14·N4-15·N4-16), (13) **holidayCalendar 갱신·배포 정책** — 연간 minor·임시공휴일 patch·external-api override (N4-17). NT-18, (14) **businessHours 90일 탐색 한계** + failed-permanent (N4-18), (15) **invalid locationRef → `skipped-missing-location`** DeliveryStatus 신규 (N4-19), (16) **운영자 수동 unsuppress command** + REVIEW_WORKFLOW § 10.2.1 `notification-suppression-unsuppressed` cascade (N4-20·N4-21), (17) **soft → hard 전이 정책** (N4-22), (18) **큐 worker 중복 발송 방지 SoT 쿼리** + partial index (N4-23), (19) **inApp 단일 transaction 원자성** (N4-24), (20) **DeadLetterAttempt UNIQUE(attemptId)** — 1 attempt 1 DLQ (N4-25), (21) **MySQL generated column 대체 schema** 구체 명시 (N4-26), (22) **notification-read actorRole = instanceMemberships 현재 instance role** (N4-27), (23) **AdminUserRole `system` 추가** — REVIEW_WORKFLOW § 11.1 cascade (N4-28), (24) **multi-location + main 부재 fail 격상** (N4-29), (25) **NT-16 해소** (N4-30) (20 finding + 3 residual = 23 지적 전건 수용)**: (1) **Receipt-Log 트랜잭션 순서** — 단일 DB 트랜잭션에서 Log insert → Receipt insert. abort 시 양쪽 롤백 (N3-01), (2) **테이블 인벤토리 재산정 — 11 tables + Redis 1** — Receipt·Log·PayloadRecord·DeliveryAttempt·Inbox·DigestBucket·DigestBucketPayload·QuietHoursQueue·BusinessHoursQueue·DeadLetter·**DeadLetterAttempt(신설)** + DedupeCache. `NotificationDelivery` 가상 참조 제거 (N3-02·N3-19), (3) **DeliveryAttempt attemptNumber 동시성** — payloadId+channel 범위 row lock 또는 advisory lock + processing 선점 (N3-03), (4) **PayloadRecord recipient-envelope unit 명확화** — channel 필드 제거, directSentAt/digestSentAt 제거. 채널별 sentAt 추적은 DeliveryAttempt status만 사용 (N3-04), (5) **fallback 채널 매트릭스 SoT** — REVIEW_WORKFLOW § 9.1.1 컬럼 cascade. 임의 활성 채널 라우팅 금지, fallback도 막히면 외부 sink alert만 (N3-05), (6) **dedupe Redis SET NX EX 원자** — 명시 (N3-06), (7) **receipt vs dedupe TTL 관계** — `receiptRetentionDays`(기본 365일) ≫ dedupeWindowSeconds. sourceEventId 재사용 금지 (N3-07), (8) **REVIEW_WORKFLOW § 9.3 cascade** — Slack 2가지 동작 모드·DeliveryResult 소비 규칙 명시 (N3-08), (9) **broadcast envelope 단위 1건** — broadcastAttemptId·sentinel dedupeKey·perRecipient placeholder broadcastAttemptId 참조 (N3-09), (10) **DigestPolicy AST 구조화** — DigestCondition({field, op, value}) + 허용 enum (N3-10), (11) **policyVersion 병렬 보관** — 패키지에 버전별 매트릭스 보관, manifest opt-in, 롤백은 manifest 변경만 (N3-11), (12) **DigestBucketPayload FK 분리** — bucketId CASCADE, payloadId RESTRICT (N3-12), (13) **C-08 holidayCalendar cascade** — region·source. PublicHoliday SoT 정합. CT-02 dayOfWeek enum과 분리 (N3-13), (14) **LocationProfile `@id="main"` 관례 정합** — C-21 SoT 정합 (N3-14), (15) **suppression autoReleaseAt + worker** — § 7.4 1시간 주기. DATA_MODEL C-23 cascade (N3-15), (16) **suppression atomic increment** — DB atomic + compare-and-set threshold 1회 alert (N3-16), (17) **REVIEW_WORKFLOW § 10.2.1 enum cascade** — `notification-resend-attempted`·`notification-read` (N3-17), (18) **DLQ SQL syntax PostgreSQL** — partial unique index 표기 (N3-18), (19) **DATA_MODEL C-23 timezone 설명 정정** — quietHours 한정 (N3-20), (20) **inactive 사용자 historical inbox 정책** — 기본 숨김 + 인스턴스 옵션 (NT-16) (Residual), (21) **cadenceWindow 포맷 명시** — daily `YYYY-MM-DD`, weekly `YYYY-Wnn` (Residual), (22) **instanceMemberships 검증** — recipient AdminUser.instanceMemberships에 본 인스턴스 미포함 시 `skipped-missing-user` (Residual) |
docs\features\crm-sync.md:339:  manifestVersion: string;
docs\features\crm-sync.md:1190:  - hashSecrets 4종 manifest 누락 시 build fail
docs\features\crm-sync.md:1331:| `manifestVersion` | string | ✅ |
docs\features\content-migration.md:960:- cooperativeCancellation 미지원 step 1개 이상 (validate fail 전제이지만 manifest 단계 사전 경고)
docs\features\asset-ingestion.md:539:  - v0.2 key 허용 기간: v1.x release까지. v2.0에서 v0.2 path read 제거 — manifest validator가 lazy rewrite 권고 → eager migration 강제
docs\features\analytics-reporting.md:23:  - sources 입력 canonicalization — undefined는 manifest 활성 source sorted 전체 (AR2-01)
docs\features\analytics-reporting.md:134:analyticsPolicyVersion: "ar-2026-05-14"                # AR4-01 — C-08 v0.15 신규. 패키지 병렬 보관 + manifest opt-in. notifications policyVersion 패턴 동일
docs\features\analytics-reporting.md:248:// scheduled job 생성 시 manifest snapshot을 schedule payload에 freeze.
docs\features\analytics-reporting.md:253://     - manifestSnapshotVersion = hash(canonicalSources + sourceConfigSnapshotHash + analyticsPolicyVersion)
docs\features\analytics-reporting.md:255://   호출 시 idempotencyKey에 manifestSnapshotVersion 포함:
docs\features\analytics-reporting.md:256://     manifestVersion = manifestSnapshotVersion (scheduled job) 또는 current manifest hash (on-demand)
docs\features\analytics-reporting.md:257://   retry: CollectionLog.manifestVersion을 끝까지 따름 — 현재 manifest 변경 무시
docs\features\analytics-reporting.md:258://   → manifest 변경(ga4 비활성화·secretRef rotation 등) 시 새 scheduled job부터 새 lineage. 기존 in-flight job은 freeze 값 유지
docs\features\analytics-reporting.md:266://     idempotencyKey = hash(instanceId + canonicalSources.join(",") + windowStart + windowEnd + mode + manifestVersion + "force:" + refreshIntentId)
docs\features\analytics-reporting.md:268://     idempotencyKey = hash(instanceId + canonicalSources.join(",") + windowStart + windowEnd + mode + manifestVersion)
docs\features\analytics-reporting.md:492:- catch-up idempotencyKey = `hash(instanceId + canonicalSources + scheduledForDate + manifestVersion)` — date별 멱등
docs\features\analytics-reporting.md:955:| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (8개 지적 전건 수용)**: (1) **§ 1.1 변경 정책에 build/runtime/warning 룰 변경 항목 추가** (AR5-01), (2) **manifestSnapshotVersion에 sourceConfigSnapshotHash 포함** — secretRef·propertyId·siteUrl·bucket strategy 변경 시 새 lineage 보장 (AR5-02), (3) **outbox maxAttempts 상수 5 고정** + § 1.2.1 큐별 표 추가. § 11 build fail은 schema 필드 검증만 (AR5-03), (4) **outbox SQL stale 검사 강화** — attempts<5 항상 적용 + 별도 reconcile step으로 attempts>=5 → permanent 전이 (AR5-04), (5) **REVIEW_WORKFLOW § 8.1 본문 v0.15 cascade 정합** — operational/calendar 슬롯 분리 명시 (AR5-05), (6) **`queryDailyUserMeasurements()` calendar 산정 API** — legal 검수자용 read API. primarySource·botFilteringPolicy override 가능 (AR5-06), (7) **`ComplianceRecord.legalCounsel`·`legalCounselAt` top-level 필드 명시** — `mediaThresholdAssessment` nested 아님 (AR5-07), (8) **AnalyticsRedactionAudit.expiresAt 필드 + retention purge worker** — `processedAt + retentionDays.rawRedactionAuditTrail` 기준 (AR5-08): (1) **C-08 `analyticsPolicyVersion` cascade** — 패키지 병렬 보관 + manifest opt-in (AR4-01), (2) scheduled job manifestSnapshotVersion·sourceConfigSnapshot freeze (AR4-02), (3) lock ordering invariant — attempt lock 보유 중 envelope lock 금지 (AR4-03), (4) ReportInstance outbox dispatch-failed-retryable vs -permanent 분리 + 5회 한도 (AR4-04), (5) MediaThresholdReassessmentDispatchOutbox 동일 분리 (AR4-05), (6) outbox worker SoT claim SQL — SKIP LOCKED (AR4-06), (7) 공통 retry taxonomy § 1.2.1 (AR4-07), (8) **C-10 v0.15 cascade — mediaThresholdOperationalInput 슬롯 신설** + REVIEW_WORKFLOW § 8.1.1 정정. rolling은 operational 슬롯, calendar는 assessment 슬롯 (AR4-08), (9) sourceCompleteness 산식 — dailyUsers 존재 + dataCompleteness >= 0.9 일자만 (AR4-09), (10) AnalyticsRedactionAudit 모든 projection마다 생성 (AR4-10), (11) projection + DB writes 단일 transaction + crash recovery (AR4-11), (12) date QueryFilter window intersection + `YYYY-MM` startsWith 허용 (AR4-12), (13) joinMode="metric-columns" opt-in cross-source join (AR4-13), (14) status 명칭 cross-Feature 분리 가이드 (AR4-14), (15) § 0·§ 10.1 12 tables 정정 (AR4-15), (16) § 11 build/runtime/warning 3분리 (AR4-16): (1) CollectionSourceAttempt.status enum SoT — `processing` 포함 (AR3-01), (2) **retry worker attemptNumber 동시성 advisory lock** — (collectionLogId, source) 범위 (AR3-02), (3) retry exhausted → `failed-permanent` + envelope 재계산 우선순위 표 (AR3-03·04), (4) **canonicalSources + manifestVersion idempotencyKey 포함** — manifest 변경 시 새 lineage 명시 (AR3-05), (5) forceRefresh validation — `=== true` + non-empty refreshIntentId (AR3-06), (6) generateReport force refresh lineage 별도 row 생성 (AR3-07), (7) **ReportInstance outbox 패턴** — notificationDispatchClaim·outbox reconcile worker (AR3-08), (8) MediaThresholdState.currentState enum 통일 — `below-threshold`/`above-threshold` (AR3-09·23), (9) enterStreak/exitStreak reset 규칙 — 반대 streak 0 + 결측·dataCompleteness<0.9는 hold + basisKey 변경 시 reset (AR3-10), (10) transitionEventId hash에 basisKey·threshold 포함 (AR3-11), (11) **enqueueMediaThresholdReassessment outbox 재시도** — MediaThresholdReassessmentDispatchOutbox 신설 + 1분 주기 worker (AR3-12), (12) **measurementSnapshot 필드 매핑표** — DATA_MODEL C-10 MediaThresholdAssessment 필드별 산출 (AR3-13), (13) **multi-metric mixed source validation error** + `metricSourceMap` 응답 필드 (AR3-14), (14) dataCompletenessBreakdown에 `date` 필드 포함 (AR3-15), (15) **QueryFilter dimension별 최대 1개**·op 조합 truth table (AR3-16), (16) DST SoT — Temporal disambiguation `later`/`earlier` 매핑 (AR3-17), (17) missedRunCarryOverMaxDays 초과 → skipped-missed-run-expired + sink alert (AR3-18), (18) rate limit bucketKey 형식 `ar:quota:{provider}:{credentialHash}` (AR3-19), (19) **redaction memory-only projection** — provider 응답 직후 + projection 전 payload 어디에도 저장 금지 (AR3-20), (20) **AnalyticsRedactionAudit** 신설 — rawPayloadStorage.enabled=false 감사 증거 (AR3-21), (21) DSR reasonCode enum + reasonHumanMessage 분리 + subjectIdentifierHash optional (AR3-22), (22) § 14.7 참조 정정 — MediaThresholdState (AR3-23), (23) **CollectionLog manifestVersion 필드 추가**, ReportInstance에 notificationDispatchClaim·attempts 필드: (1) sources canonicalization — undefined는 활성 source sorted 전체 (AR2-01), (2) forceRefresh + refreshIntentId 입력 + 별도 idempotencyKey 산정 (AR2-02), (3) **CollectionSourceAttempt 신설** — envelope 1건 + per-source 상태 분리 (AR2-03), (4) ReportInstance UNIQUE 통일 — `(instanceId, idempotencyKey)` (AR2-04), (5) ReportInstance.notificationDispatchedAt 영구 저장 — notify receipt 만료 후 재발송 차단 (AR2-05), (6) **MediaThresholdState 테이블 신설** — currentState·streak·lastTransitionEventId (AR2-06), (7) DailyUserMeasurement basisKey — primarySource·botPolicy·calendarPolicy·algorithmVersion (AR2-07), (8) **operational vs 법정 분리 명확화** — rolling-90은 priorReviewRequired 산정 금지 (AR2-08), (9) **ComplianceRecord 갱신 주체 분리** — 본 Feature는 snapshot provider only, mutator 아님 (AR2-09), (10) **REVIEW_WORKFLOW.enqueueMediaThresholdReassessment() 명시 API cascade** — notify는 알림용으로만 (AR2-10), (11) ga4CustomFieldAllowlist — customDimensions·customMetrics·eventParameters 명시 등록 (AR2-11), (12) DSR subject-matching not-applicable — aggregated only (AR2-12), (13) rawPayloadStorage.enabled 분리 — allowlist는 항상 required (AR2-13), (14) rateLimit.bucketKeyStrategy — credential-global vs instance-isolated (AR2-14), (15) **CollectionRetryQueue worker claim** — status·lockedAt·lockedBy + SKIP LOCKED (AR2-15), (16) QueryFilter AST + AND/OR semantics (AR2-16), (17) dimensions=[] → single aggregate row (AR2-17), (18) sourceFilter 부재 — metric별 default source + sourceFilter 미지정 + dimensions에 source 없으면 default 단일 사용 (AR2-18), (19) dataCompletenessBreakdown — source/date/metric 단위 (AR2-19), (20) QueryDimension `source` 명칭 통일 (AR2-20), (21) dimensionKey "composite UNIQUE의 일부" 정정 (AR2-21), (22) DST·missed run grammar — dstNonexistentLocalTime·dstAmbiguousLocalTime·missedRunCarryOverMaxDays (AR2-22), (23) reportTemplates schedule grammar — type/dayOfWeek/dayOfMonth/time (AR2-23), (24) § 5.5 참조 정정 (AR2-24) |
docs\features\analytics-reporting.md:991:| `manifestVersion` | string | ✅ — analyticsConfig.sources enabled set + featurePolicyVersion hash (AR3-05) |
docs\core\DATA_MODEL.md:589:| `analyticsPolicyVersion` | `string` | conditional | (v0.14 +) `features.analytics-reporting` 매트릭스·정책 SoT 버전 (예: `"ar-2026-05-14"`). `features.analytics-reporting` 활성 시 required. notifications의 `notificationPolicyVersion` 패턴 동일 — 패키지가 버전별 병렬 보관 + manifest opt-in (`features/analytics-reporting.md` § 1.1·§ 4.2 동등) |
docs\core\DATA_MODEL.md:667:| `serpCrawler` | `{enabled: boolean, ...}` | optional | **v1.0: `enabled=true` → 빌드 fail (regardless of legalApproved)** — `features/keyword-monitoring.md` § 5.2 v1.0 미지원 정책 (KM2-01). v1.x 활성화 시 search-visibility SerpCrawlerApprovedScope 게이트 패턴 재사용 (KM-14 후속 결정 후). v1.0 manifest validator는 enabled=true 단독으로 fail 처리, legalApproved/승인자/시각 검증은 v1.x 활성 시점부터 적용 |
docs\core\DATA_MODEL.md:718:> 동작 옵션(`mode`·`syncSchedule`·`entities`·`fieldMappingPolicyVersion`·`retryQueue`·`credentialRotation`·`pii`·`retentionDays` 등)은 `features[name="crm-sync"].config` SoT (`features/crm-sync.md` § 2.3). **CrmCredentialVersion**(credential rotation 상태 머신·secretVersionId) 등 admin DB entity는 `features/crm-sync.md` § 13 SoT. manifest는 `apiKeySecretRef` 등 secretRef만 보유 — register/rotate 시 admin DB materialization (CS3-13).
docs\core\DATA_MODEL.md:1098:| 2026-05-14 | v0.20 | **`features/crm-sync.md` 3차·5차 사이클 cascade (CS3-13·CS5-01)**: (1) CrmIntegrationEntry에 `genericRestApiAdapter` 필드 추가 — provider=generic-rest-api 시 required. **5필드** (webhookSignatureHeader·webhookTimestampHeader·webhookEventIdHeader·canonicalStringFormat·`versionTokenJsonPath`) + `versionTokenType` enum, (2) manifest(secretRef) vs admin DB(`CrmCredentialVersion` — secretVersionId·rotation state) 경계 명시 |

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content apps/web/src/lib/site-meta-fetch.ts | ForEach-Object { $i++; if($i -le 240){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content apps/web/src/app/api/site-meta-fetch/route.ts | ForEach-Object { $i++; if($i -le 220){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/admin/ARCHITECTURE.md | ForEach-Object { $i++; if($i -ge 219 -and $i -le 244){ '"'{0,4}: {1}' -f "'$i, $_ }}; $i=0; Get-Content docs/decisions/ADMIN_UI_SKELETON_PLAN.md | ForEach-Object { $i++; if($i -ge 250 -and $i -le 290){ '"'{0,4}: {1}' -f "'$i, $_ }}; $i=0; Get-Content docs/core/CONTENT_STANDARDS.md | ForEach-Object { $i++; if($i -ge 300 -and $i -le 345){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
 succeeded in 652ms:
   1: // @glitzy/web/lib/site-meta-fetch — 외부 사이트 URL → meta scrape
   2: // cycle7-8-code (URL scrape patch) v0.3:
   3: //   - undici Agent connect.lookup override 로 매 connection lookup 결과 검증 → DNS rebinding TOCTOU 제거 (WEB-108)
   4: //   - redirect manual + 매 hop normalizeAndValidateUrl + 5회 strict (off-by-one 제거 · WEB-112)
   5: //   - URL userinfo 거부 (WEB-113)
   6: //   - 스크랩된 asset URL 도 validateAssetUrl
   7: //   - text/html only · 5MB body · 10s timeout
   8: 
   9: import { lookup as dnsLookup } from "node:dns/promises";
  10: import { lookup as dnsLookupCb } from "node:dns";
  11: import { load as loadHtml } from "cheerio";
  12: import ipaddr from "ipaddr.js";
  13: import { Agent } from "undici";
  14: 
  15: const FETCH_TIMEOUT_MS = 10_000;
  16: const MAX_BODY_BYTES = 5 * 1024 * 1024;
  17: const MAX_REDIRECTS = 5;
  18: 
  19: export type SiteMeta = {
  20:   name: string | null;
  21:   description: string | null;
  22:   logoUrl: string | null;
  23:   ogImageUrl: string | null;
  24:   themeColor: string | null;
  25:   resolvedUrl: string;
  26: };
  27: 
  28: export type SiteMetaFetchCode =
  29:   | "invalid-url"
  30:   | "blocked-host"
  31:   | "timeout"
  32:   | "non-html"
  33:   | "too-large"
  34:   | "http-error"
  35:   | "fetch-failed"
  36:   | "too-many-redirects"
  37:   | "dns-failed";
  38: 
  39: export class SiteMetaFetchError extends Error {
  40:   constructor(public readonly code: SiteMetaFetchCode, message: string) {
  41:     super(message);
  42:     this.name = "SiteMetaFetchError";
  43:   }
  44: }
  45: 
  46: function isBlockedIp(addr: string): boolean {
  47:   try {
  48:     const ip = ipaddr.parse(addr);
  49:     return ip.range() !== "unicast";
  50:   } catch {
  51:     return true;
  52:   }
  53: }
  54: 
  55: async function resolveAndAssertPublicHost(hostname: string): Promise<void> {
  56:   if (ipaddr.isValid(hostname)) {
  57:     if (isBlockedIp(hostname)) {
  58:       throw new SiteMetaFetchError("blocked-host", "내부 네트워크 주소는 분석할 수 없습니다.");
  59:     }
  60:     return;
  61:   }
  62:   const stripped = hostname.startsWith("[") && hostname.endsWith("]") ? hostname.slice(1, -1) : hostname;
  63:   if (stripped !== hostname && ipaddr.isValid(stripped)) {
  64:     if (isBlockedIp(stripped)) {
  65:       throw new SiteMetaFetchError("blocked-host", "내부 네트워크 주소는 분석할 수 없습니다.");
  66:     }
  67:     return;
  68:   }
  69:   const lower = hostname.toLowerCase();
  70:   if (
  71:     lower === "localhost" ||
  72:     lower.endsWith(".local") ||
  73:     lower.endsWith(".internal") ||
  74:     lower.endsWith(".lan") ||
  75:     lower.endsWith(".localhost")
  76:   ) {
  77:     throw new SiteMetaFetchError("blocked-host", "내부 네트워크 호스트는 분석할 수 없습니다.");
  78:   }
  79:   let records: { address: string; family: number }[];
  80:   try {
  81:     records = await dnsLookup(hostname, { all: true, verbatim: true });
  82:   } catch {
  83:     throw new SiteMetaFetchError("dns-failed", "호스트 이름을 해석할 수 없습니다.");
  84:   }
  85:   if (records.length === 0) {
  86:     throw new SiteMetaFetchError("dns-failed", "호스트 이름을 해석할 수 없습니다.");
  87:   }
  88:   for (const r of records) {
  89:     if (isBlockedIp(r.address)) {
  90:       throw new SiteMetaFetchError("blocked-host", "내부 네트워크 주소로 해석되어 차단됩니다.");
  91:     }
  92:   }
  93: }
  94: 
  95: // cycle8 WEB-108: undici Agent connect.lookup override — 매 connection lookup 결과 검증 (TOCTOU 제거)
  96: // Node 의 dns.lookup callback 시그니처 가변(2 또는 3 args) 처리를 위해 unsafe cast 사용 — 안전성은 isBlockedIp 로 보장
  97: type LookupCb = (err: NodeJS.ErrnoException | null, address: string, family: number) => void;
  98: 
  99: function ssrfGuardLookup(hostname: string, _opts: unknown, callback: LookupCb): void {
 100:   // eslint-disable-next-line @typescript-eslint/no-explicit-any
 101:   (dnsLookupCb as any)(hostname, { all: false }, (err: NodeJS.ErrnoException | null, address: string, family: number) => {
 102:     if (err) {
 103:       callback(err, "", 0);
 104:       return;
 105:     }
 106:     if (isBlockedIp(address)) {
 107:       callback(new Error(`blocked-host:${address}`) as NodeJS.ErrnoException, "", 0);
 108:       return;
 109:     }
 110:     callback(null, address, family);
 111:   });
 112: }
 113: 
 114: const ssrfGuardAgent = new Agent({
 115:   connect: {
 116:     timeout: 5_000,
 117:     // eslint-disable-next-line @typescript-eslint/no-explicit-any
 118:     lookup: ssrfGuardLookup as any,
 119:   },
 120: });
 121: 
 122: function normalizeAndValidateUrl(input: string): URL {
 123:   const trimmed = input.trim();
 124:   if (trimmed.length === 0 || trimmed.length > 2048) {
 125:     throw new SiteMetaFetchError("invalid-url", "URL 길이가 올바르지 않습니다.");
 126:   }
 127:   let withScheme = trimmed;
 128:   if (!/^https?:\/\//i.test(withScheme)) {
 129:     withScheme = `https://${withScheme}`;
 130:   }
 131:   let url: URL;
 132:   try {
 133:     url = new URL(withScheme);
 134:   } catch {
 135:     throw new SiteMetaFetchError("invalid-url", "URL 형식이 올바르지 않습니다.");
 136:   }
 137:   if (url.protocol !== "http:" && url.protocol !== "https:") {
 138:     throw new SiteMetaFetchError("invalid-url", "http/https URL 만 허용됩니다.");
 139:   }
 140:   // cycle8 WEB-113: URL userinfo 거부 (credentials leak 방지)
 141:   if (url.username !== "" || url.password !== "") {
 142:     throw new SiteMetaFetchError("invalid-url", "URL에 인증 정보를 포함할 수 없습니다.");
 143:   }
 144:   return url;
 145: }
 146: 
 147: async function safeCancel(body: ReadableStream<Uint8Array> | null | undefined): Promise<void> {
 148:   if (!body) return;
 149:   try { await body.cancel(); } catch { /* noop */ }
 150: }
 151: 
 152: async function fetchWithRedirects(initialUrl: URL): Promise<{ body: string; finalUrl: URL }> {
 153:   let current = initialUrl;
 154:   let redirectsFollowed = 0;
 155:   while (true) {
 156:     await resolveAndAssertPublicHost(current.hostname);
 157:     // cycle9 WEB-116: timeout 을 header + body read 통합 deadline 으로 적용
 158:     const controller = new AbortController();
 159:     const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
 160:     let res: Response;
 161:     try {
 162:       res = await fetch(current.toString(), {
 163:         signal: controller.signal,
 164:         redirect: "manual",
 165:         headers: {
 166:           "user-agent": "GlitzyAdmin/0.1 site-meta-fetch",
 167:           accept: "text/html",
 168:         },
 169:         // cycle8 WEB-108: undici Agent — 매 connection lookup 검증 (TOCTOU 제거)
 170:         // @ts-expect-error — Next.js fetch types 에 dispatcher 미정의 (undici 내부 지원)
 171:         dispatcher: ssrfGuardAgent,
 172:       });
 173:     } catch (err) {
 174:       clearTimeout(timeoutId);
 175:       if (err instanceof Error && err.name === "AbortError") {
 176:         throw new SiteMetaFetchError("timeout", "응답 시간이 초과되었습니다.");
 177:       }
 178:       if (err instanceof Error && /blocked-host:/.test(err.message)) {
 179:         throw new SiteMetaFetchError("blocked-host", "내부 네트워크 주소로 해석되어 차단됩니다.");
 180:       }
 181:       throw new SiteMetaFetchError("fetch-failed", "사이트 접근에 실패했습니다.");
 182:     }
 183: 
 184:     try {
 185:       if (res.status >= 300 && res.status < 400) {
 186:         // cycle8 WEB-112: MAX_REDIRECTS strict — 5회 초과 시 즉시 차단
 187:         if (redirectsFollowed >= MAX_REDIRECTS) {
 188:           await safeCancel(res.body);
 189:           throw new SiteMetaFetchError("too-many-redirects", "redirect 횟수가 한도를 초과했습니다.");
 190:         }
 191:         redirectsFollowed += 1;
 192:         const location = res.headers.get("location");
 193:         if (!location) {
 194:           await safeCancel(res.body);
 195:           throw new SiteMetaFetchError("http-error", "redirect Location 헤더가 없습니다.");
 196:         }
 197:         let next: URL;
 198:         try {
 199:           next = normalizeAndValidateUrl(new URL(location, current).toString());
 200:         } catch (err) {
 201:           await safeCancel(res.body);
 202:           if (err instanceof SiteMetaFetchError) throw err;
 203:           throw new SiteMetaFetchError("invalid-url", "redirect 대상 URL 형식 오류");
 204:         }
 205:         current = next;
 206:         await safeCancel(res.body);
 207:         clearTimeout(timeoutId);
 208:         continue;
 209:       }
 210: 
 211:       // cycle9 WEB-117: 실패 분기에도 body cancel cleanup
 212:       if (!res.ok) {
 213:         await safeCancel(res.body);
 214:         throw new SiteMetaFetchError("http-error", "사이트가 비정상 응답을 반환했습니다.");
 215:       }
 216:       const ct = (res.headers.get("content-type") ?? "").toLowerCase();
 217:       if (!ct.includes("text/html")) {
 218:         await safeCancel(res.body);
 219:         throw new SiteMetaFetchError("non-html", "HTML 응답이 아닙니다.");
 220:       }
 221:       const reader = res.body?.getReader();
 222:       if (!reader) {
 223:         throw new SiteMetaFetchError("fetch-failed", "응답 본문을 읽을 수 없습니다.");
 224:       }
 225:       const chunks: Uint8Array[] = [];
 226:       let total = 0;
 227:       // cycle9 WEB-116: body read 도 같은 controller deadline 안에서 실행
 228:       //   AbortController 가 abort 되면 reader.read() 가 reject 되어 try-catch 가 잡음
 229:       try {
 230:         while (true) {
 231:           const { done, value } = await reader.read();
 232:           if (done) break;
 233:           total += value.byteLength;
 234:           if (total > MAX_BODY_BYTES) {
 235:             await reader.cancel();
 236:             throw new SiteMetaFetchError("too-large", "응답 본문이 5MB를 초과합니다.");
 237:           }
 238:           chunks.push(value);
 239:         }
 240:       } catch (readErr) {

 succeeded in 648ms:
   1: // @glitzy/web/api/site-meta-fetch — 외부 사이트 URL meta scrape
   2: // cycle7-8-code (URL scrape patch) v0.3:
   3: //   - WEB-109: instanceSlug 받아서 slugResolver + resolveTenantContext + assertActionEligibility('operator-edit-content')
   4: //   - WEB-110: code 클라이언트 노출 제거 (audit reason 만)
   5: //   - WEB-111: body reader 직접 4KB 제한 (chunked 우회 차단)
   6: //   - WEB-113: audit payload sanitizeUrlForAudit (userinfo/query 제거)
   7: 
   8: import { NextResponse, type NextRequest } from "next/server";
   9: import { z } from "zod";
  10: import {
  11:   AuthDeniedError,
  12:   assertActionEligibility,
  13:   emitAuditEvent,
  14:   getActiveSession,
  15:   resolveTenantContext,
  16:   TenantResolveError,
  17: } from "@glitzy/auth";
  18: import { asUuidV4, type AdminUserId } from "@glitzy/shared-types";
  19: 
  20: import { getSqlBase } from "@/lib/db";
  21: import { getAuthCfg } from "@/lib/env";
  22: import { fetchSiteMeta, sanitizeUrlForAudit, SiteMetaFetchError } from "@/lib/site-meta-fetch";
  23: import { slugResolver } from "@/lib/slug-resolver";
  24: 
  25: const BodySchema = z.object({
  26:   url: z.string().min(1).max(2048),
  27:   instanceSlug: z.string().min(3).max(64),
  28: });
  29: 
  30: const MAX_REQUEST_BYTES = 4 * 1024;
  31: 
  32: async function emitBestEffort(sqlBase: ReturnType<typeof getSqlBase>, input: Parameters<typeof emitAuditEvent>[1]): Promise<void> {
  33:   try {
  34:     await emitAuditEvent(sqlBase, input);
  35:   } catch (err) {
  36:     console.error("[site-meta-fetch] audit emit failed", err);
  37:   }
  38: }
  39: 
  40: // cycle8 WEB-111: body reader 로 4KB strict (chunked content-length 우회 차단)
  41: async function readBodyWithLimit(req: NextRequest): Promise<string | null> {
  42:   const reader = req.body?.getReader();
  43:   if (!reader) return null;
  44:   let total = 0;
  45:   const chunks: Uint8Array[] = [];
  46:   while (true) {
  47:     const { done, value } = await reader.read();
  48:     if (done) break;
  49:     total += value.byteLength;
  50:     if (total > MAX_REQUEST_BYTES) {
  51:       await reader.cancel();
  52:       return null;
  53:     }
  54:     chunks.push(value);
  55:   }
  56:   return Buffer.concat(chunks.map((c) => Buffer.from(c))).toString("utf-8");
  57: }
  58: 
  59: export async function POST(req: NextRequest): Promise<NextResponse> {
  60:   // cycle3-3entity WEB-40: Origin 누락도 차단 (브라우저 전용 endpoint)
  61:   const origin = req.headers.get("origin");
  62:   if (!origin || origin !== req.nextUrl.origin) {
  63:     return NextResponse.json({ ok: false, error: "외부 도메인 요청은 차단됩니다." }, { status: 403 });
  64:   }
  65: 
  66:   const signedToken = req.cookies.get("glitzy_session")?.value ?? null;
  67:   if (!signedToken) {
  68:     return NextResponse.json({ ok: false, error: "로그인이 필요합니다." }, { status: 401 });
  69:   }
  70: 
  71:   const sqlBase = getSqlBase();
  72:   const cfg = getAuthCfg();
  73:   let userId: AdminUserId;
  74:   try {
  75:     const session = await getActiveSession(sqlBase, cfg, signedToken);
  76:     // cycle3-3entity WEB-34: branded UUID narrow
  77:     userId = asUuidV4(session.userId) as AdminUserId;
  78:   } catch (err) {
  79:     const reason = err instanceof AuthDeniedError ? err.reason : "session-not-found";
  80:     await emitBestEffort(sqlBase, {
  81:       eventType: "site-meta-fetch-failed",
  82:       reason,
  83:       payload: { origin: "auth" },
  84:     });
  85:     // cycle3-3entity WEB-42: invalid/tampered session — cookie clear 도 함께 (page 경로의 cleanup 과 동등 처리)
  86:     const res = NextResponse.json({ ok: false, error: "로그인이 필요합니다." }, { status: 401 });
  87:     res.cookies.delete("glitzy_session");
  88:     return res;
  89:   }
  90: 
  91:   // cycle8 WEB-111: body reader 직접 제한 (chunked content-length 무시 우회 차단)
  92:   const rawBody = await readBodyWithLimit(req);
  93:   if (rawBody === null) {
  94:     return NextResponse.json({ ok: false, error: "요청 본문이 너무 큽니다." }, { status: 413 });
  95:   }
  96:   let body: unknown;
  97:   try {
  98:     body = JSON.parse(rawBody);
  99:   } catch {
 100:     return NextResponse.json({ ok: false, error: "JSON 본문이 필요합니다." }, { status: 400 });
 101:   }
 102:   const parsed = BodySchema.safeParse(body);
 103:   if (!parsed.success) {
 104:     return NextResponse.json({ ok: false, error: "url 또는 instanceSlug 필드가 필요합니다." }, { status: 400 });
 105:   }
 106: 
 107:   // cycle8 WEB-109: slugResolver + resolveTenantContext + assertActionEligibility 재검증
 108:   const instanceId = await slugResolver(sqlBase, parsed.data.instanceSlug, userId);
 109:   if (instanceId === null) {
 110:     return NextResponse.json({ ok: false, error: "인스턴스를 찾을 수 없습니다." }, { status: 404 });
 111:   }
 112: 
 113:   let ctx;
 114:   try {
 115:     ctx = await resolveTenantContext(sqlBase, cfg, signedToken, instanceId);
 116:   } catch (err) {
 117:     const reason = err instanceof TenantResolveError ? err.reason : "tenant-resolve-failed";
 118:     await emitBestEffort(sqlBase, {
 119:       eventType: "site-meta-fetch-failed",
 120:       actorUserId: userId,
 121:       reason,
 122:       payload: { origin: "tenant-resolve", instanceSlug: parsed.data.instanceSlug },
 123:     });
 124:     return NextResponse.json({ ok: false, error: "접근 권한이 없습니다." }, { status: 403 });
 125:   }
 126:   try {
 127:     assertActionEligibility(ctx, "operator-edit-content");
 128:   } catch (err) {
 129:     const reason = err instanceof TenantResolveError ? err.reason : "operator-role-required";
 130:     await emitBestEffort(sqlBase, {
 131:       eventType: "site-meta-fetch-failed",
 132:       actorUserId: userId,
 133:       toInstanceId: ctx.instanceId,
 134:       reason,
 135:       payload: { origin: "eligibility", instanceSlug: parsed.data.instanceSlug },
 136:     });
 137:     return NextResponse.json({ ok: false, error: "운영자 권한이 필요합니다." }, { status: 403 });
 138:   }
 139: 
 140:   try {
 141:     const meta = await fetchSiteMeta(parsed.data.url);
 142:     await emitBestEffort(sqlBase, {
 143:       eventType: "site-meta-fetched",
 144:       actorUserId: userId,
 145:       toInstanceId: ctx.instanceId,
 146:       payload: {
 147:         // cycle8 WEB-113: audit payload sanitize
 148:         input: sanitizeUrlForAudit(parsed.data.url),
 149:         resolved: sanitizeUrlForAudit(meta.resolvedUrl),
 150:       },
 151:     });
 152:     return NextResponse.json({ ok: true, meta });
 153:   } catch (err) {
 154:     if (err instanceof SiteMetaFetchError) {
 155:       await emitBestEffort(sqlBase, {
 156:         eventType: "site-meta-fetch-failed",
 157:         actorUserId: userId,
 158:         toInstanceId: ctx.instanceId,
 159:         reason: err.code,
 160:         payload: { input: sanitizeUrlForAudit(parsed.data.url) },
 161:       });
 162:       // cycle8 WEB-110: code 응답 제거 — generic 메시지만
 163:       return NextResponse.json({ ok: false, error: "사이트 분석에 실패했습니다." }, { status: 400 });
 164:     }
 165:     console.error("[site-meta-fetch] unexpected", err);
 166:     await emitBestEffort(sqlBase, {
 167:       eventType: "site-meta-fetch-failed",
 168:       actorUserId: userId,
 169:       toInstanceId: ctx.instanceId,
 170:       reason: "unexpected",
 171:       payload: { input: sanitizeUrlForAudit(parsed.data.url) },
 172:     });
 173:     return NextResponse.json({ ok: false, error: "사이트 분석 중 오류가 발생했습니다." }, { status: 500 });
 174:   }
 175: }

 succeeded in 691ms:
 219: ### 3.8.2 LegalDocument 자동 생성 규칙
 220: 
 221: P-013 Legal/Policy는 출시 게이트이며 Core가 **표준 템플릿**(개인정보처리방침·이용약관·비급여 안내·환불·민원 처리)을 제공한다.
 222: 
 223: | LegalDocument 필드 | 자동 생성 값 |
 224: |---|---|
 225: | `@id` | 정책 종류별 slug (예: `"privacy"`, `"terms"`) |
 226: | `documentType` | enum 매칭 |
 227: | `title` | 표준 (예: "개인정보처리방침") |
 228: | `body` | Core 표준 템플릿 본문 + **ClinicProfile 변수** (`{{clinic.name}}`·`{{clinic.legalEntityName}}`·`{{clinic.businessRegistrationNumber}}`·`{{clinic.founder}}`) + **LocationProfile(main) 변수** (`{{location.main.email}}`·`{{location.main.address}}`·`{{location.main.telephone}}`) — 출처 SoT 준수 |
 229: | `effectiveDate` | 클라이언트 첫 발행 시 명시 입력 또는 발행 일자 |
 230: | `contactPerson` | 개인정보 보호 책임자 등 — 어드민에서 ClinicProfile 폼의 "정책 변수" 보조 섹션에 입력 |
 231: 
 232: **어드민 폼 처리**: ClinicProfile 폼에 "정책 변수" 보조 섹션 추가 (개인정보 보호 책임자명·연락처·정책 효력 발생일 등 입력). 별도 화면 추가 아닌 보조 섹션이므로 어드민 화면 수 6개 유지.
 233: 
 234: **법무 검토 (위험도 Low 예외 룰)**:
 235: - LegalDocument는 위험도 기본 Low이지만, **법무 검토 필수**. 표준 위험도 룰(High일 때만 권장)과 별도 예외 게이트.
 236: - 발행 시 ComplianceRecord에 다음을 **모두 기록 필수** (어드민 발행 게이트가 강제):
 237:   - `contentType` = `LegalDocument`
 238:   - `legalCounsel` = 법무 자문자 신원 (필수)
 239:   - `legalCounselAt` = 자문 일자 (필수)
 240: - `legalCounsel`/`legalCounselAt` 누락 시 발행 차단. (DATA_MODEL.md C-10 룰 명세 참조)
 241: 
 242: ### 3.9 Slice JSON-LD Schema (Core 자동 생성)
 243: 
 244: - Organization, MedicalClinic, Physician, MedicalProcedure, Article
 250: |---|---|
 251: | 이름 | `glitzy_session` |
 252: | 값 | HMAC signed token (packages/auth) |
 253: | 속성 | `HttpOnly` · `Secure` (prod) · `SameSite=Lax` · `Path=/` · `Max-Age = sessionTtlSeconds` |
 254: | 발급 | `/sign-in/consume` Route Handler 의 NextResponse |
 255: | 폐기 | `/sign-out` Route Handler |
 256: | **Refresh 정책 (walking skeleton)** | **Asymmetric refresh — cookie fixed window · DB session sliding window** (ADMIN-UI-50·83). cookie Max-Age 는 발급 시점부터 fixed (`sessionTtlSeconds`). 단 `resolveTenantContext` 내부의 `refreshSessionByDbToken` 이 DB row 의 **`expires` + `lastRefreshedAt` 두 컬럼을 함께 sliding** 갱신 (cycle5 정정 ADMIN-UI-83 — column 은 camelCase, `last_refreshed_at` 아님). 활성 사용자의 DB session 은 idle 동안에도 유지되지만 cookie Max-Age 만료 시 강제 logout. sliding refresh 의 cookie 측 합류는 packages/auth v0.3 `sessionRefreshed` 반환 (ADMIN-UI-03·38) + Server Action 응답 cookie 재발급 패턴 도입 후 M0 v1.0 또는 M2. |
 257: 
 258: `lib/session-cookie.ts` 는 read/set/clear 만 노출 (sync helper 제거).
 259: 
 260: ### 5.2 instance resolve 경로 (cycle4 정정 ADMIN-UI-63·68 — withServiceRole 미사용)
 261: 
 262: URL `[instanceSlug]` → `slugResolver(sqlBase, slug, actorUserId) → instanceId | null` (cycle9 정정 ADMIN-UI-105 — actorUserId 필수). **sqlBase 직접 SELECT** (withServiceRole 미사용 — instance scope 없는 control-plane lookup):
 263: 
 264: ```typescript
 265: // lib/slug-resolver.ts
 266: import { asUuidV4, type InstanceId, type AdminUserId } from "@glitzy/shared-types";
 267: import { emitAuditEvent } from "@glitzy/auth";
 268: 
 269: export async function slugResolver(
 270:   sqlBase: postgres.Sql,
 271:   slug: string,
 272:   actorUserId: AdminUserId,
 273: ): Promise<InstanceId | null> {
 274:   // instance table 은 control-plane scope RLS (D0010_instance.sql) — admin role 로 직접 SELECT 가능
 275:   const rows = await sqlBase<{ id: string }[]>`SELECT id FROM instance WHERE slug = ${slug} AND active = true LIMIT 1`;
 276:   if (rows.length === 0) {
 277:     await emitAuditEvent(sqlBase, {
 278:       eventType: "slug-lookup-not-found",
 279:       actorUserId,
 280:       reason: "instance-slug-not-found-or-inactive",
 281:       payload: { slug },
 282:     });
 283:     return null;
 284:   }
 285:   return asUuidV4(rows[0].id) as InstanceId;
 286: }
 287: ```
 288: 
 289: `ServiceRoleFunction` enum 신규 추가 (slugResolver · firstActiveMembershipResolver · adminUserUpsert) **precondition 제거**. M0 v1.0 instance-scoped service-role 작업 (예: contentMigrationApplier) 도입 시점에 enum 추가.
 290: 
 300: 
 301: - 슬롯별 위험도 격상 조건 (`PAGE_TYPES.md` § 3 P-006)
 302: - 효과·기간·수치 단정 금지
 303: - 후기·전후사진 포함 시 페이지 자동 High (`ReviewPolicy` 적용)
 304: - 가격·이벤트 포함 시 자동 High
 305: - 의료진 검토 필수
 306: 
 307: ### 5.4 P-010 Article Detail — ArticleType별 차등 (§ 6)
 308: 
 309: ### 5.5 P-011 FAQ — 답변 단위 위험도
 310: 
 311: - 답변마다 위험도 등급 부여 (`PAGE_TYPES.md` § 3 P-011)
 312: - 효과·결과 관련 답변 → High → content-gate
 313: 
 314: ### 5.6 P-101 Reviews — High-risk commercial
 315: 
 316: - 의료법 제56조 치료경험담 광고 금지 적용 — 사이트 게재 자체가 광고 해당 여부는 매체·방식별 법무 판정. 사전심의(제57조) 의무 여부도 별도 판정
 317: - 후기 텍스트의 § 4.1 fail 표현은 자동 fail. content-gate 표현은 검수 큐 진입
 318: - 전후사진은 기본 차단 — `ReviewPolicy.beforeAfterPhotoAllowed=true` + 법무 승인 기록 시에만 예외 발행
 319: 
 320: ### 5.7 P-102 Pricing — High-risk commercial
 321: 
 322: - § 4.1 룰 일관 적용 — "최저가"·압박형 유인 표현(지금만·특가·한정·선착순)은 fail
 323: - "할인·이벤트" 단순 사실 고지(예: "20% 할인 진행")는 content-gate — 법무 검수 후 발행
 324: - 비급여 명시 필수
 325: - 가격 변경 시 즉시 갱신
 326: 
 327: ### 5.8 P-104 News/Event — 이벤트 카테고리만 High
 328: 
 329: - 일반 소식(휴진·이전·인사) Low
 330: - 이벤트·할인 카테고리 → 자동 High → compliance-assistant 검수 필수
 331: 
 332: ---
 333: 
 334: ## 6. ArticleType별 콘텐츠 룰 (P-010)
 335: 
 336: `Article.articleType` (DATA_MODEL C-04 enum 7종) 기반 차등 적용:
 337: 
 338: RiskLevel(축 1)과 룰 severity(축 2)는 **별도 축**이며 본 표는 ArticleType의 **기본 위험도**를 정의한다. 본문 표현은 § 4.1 룰로 별도 평가된다. 위험도 High = 어드민 검수 큐 강제 진입(자동 content-gate 검수 트리거).
 339: 
 340: | ArticleType | 기본 위험도 | 콘텐츠 룰 |
 341: |---|:---:|---|
 342: | `notice` | Low | 휴진·이전·인사 — 사실 안내 |
 343: | `general-medical-info` | Medium | 일반 의학 정보 — 진단·치료 단정 금지. 일반론 한정. **medical disclaimer 권장** |
 344: | `treatment-explainer` | Medium | 특정 시술 설명 — 효과 단정 금지. 절차·원리·대상·주의사항 위주 |
 345: | `condition-explainer` | Medium | 특정 질환 설명 — 진단 단정·자가 진단 유도 금지 |

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command "rg -n \"content-saved-partial|content-saved-failed|LegalDocument|LocationProfile|5\\.5\" docs/decisions/ADMIN_UI_SKELETON_PLAN.md docs/core/CONTENT_STANDARDS.md docs/decisions/M0_BUILD_EXPORT_PLAN.md packages -g \"*.json\" -g \"*.ts\" -g \"*.md\"" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'Get-ChildItem -Recurse -Force packages | Where-Object { $_.Name -match '"'manifest' } | Select-Object -ExpandProperty FullName" in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/decisions/ADMIN_UI_SKELETON_PLAN.md | ForEach-Object { $i++; if($i -ge 320 -and $i -le 380){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
 succeeded in 619ms:
docs/decisions/M0_BUILD_EXPORT_PLAN.md:12:- `docs/decisions/ADMIN_UI_SKELETON_PLAN.md` v1.0 — § 5.5 audit matrix · § 6 actions
docs/decisions/M0_BUILD_EXPORT_PLAN.md:27:| ClinicProfile `locations[]` | `SELECT id FROM location_profile WHERE clinic_profile_id = ? ORDER BY slug` | `locations: [<ref to LocationProfile.@id>]` (1개 이상 — main 필수) |
docs/decisions/M0_BUILD_EXPORT_PLAN.md:28:| LocationProfile `@id` | `location_profile.slug` (보통 `main`) | `@id: main` |
docs/decisions/M0_BUILD_EXPORT_PLAN.md:29:| LocationProfile `parentClinic` | `clinic_profile.slug` (composite FK target) | `parentClinic: clinic` |
docs/decisions/M0_BUILD_EXPORT_PLAN.md:30:| LocationProfile `reservationChannels` | `clinic_profile.primary_ctas` deep clone (main 자동 상속 · cycle1 LL-02 SoT) | `reservationChannels: [...]` |
docs/decisions/M0_BUILD_EXPORT_PLAN.md:31:| LocationProfile `businessHours` | `location_profile.metadata.businessHours` (CT-02 SoT 형식 그대로) | `businessHours: {...}` |
docs/decisions/M0_BUILD_EXPORT_PLAN.md:33:| LegalDocument body | `legal_document.body` (rendered Markdown · 변수 치환 완료) | `<documentType>.md` 본문 |
docs/decisions/M0_BUILD_EXPORT_PLAN.md:34:| LegalDocument metadata | documentType · title · effective_date · template_version · contact_person · contact_email | frontmatter YAML |
docs/decisions/M0_BUILD_EXPORT_PLAN.md:61:| 2026-05-16 | v0.1 | LOCATION_LEGAL_PLAN v1.0 acceptance precondition 으로 placeholder 신설. LL-CASCADE-04 책임 명시 (ClinicProfile.locations / LocationProfile.parentClinic·reservationChannels / primary_ctas `id` → `@id` alias). |
docs/core/CONTENT_STANDARDS.md:309:### 5.5 P-011 FAQ — 답변 단위 위험도
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:7:> **본 skeleton의 위상 명시**: 이 walking skeleton의 ClinicProfile 폼은 admin/ARCHITECTURE § 3.2 화면 ②의 **완성이 아닌 auth/RLS/form wiring proof**다. 화면 ② 완성은 ClinicProfile + LocationProfile(main) + LegalDocument 3계약 동시 출력을 요구하며 M0 v1.0 본 구현에서 합류한다 (ADMIN-UI-15).
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:11:> **cycle4 핵심 결정 (ADMIN-UI-63·66·67·68·71 일괄 close)** — cycle5·7 표현 정정 ADMIN-UI-75·93: walking skeleton 의 control-plane operation (slug → id resolve · **admin_user upsert는 seed 단계 한정** (consume route는 lookup-only · allowlist 강제) · first active membership resolve · seed) 은 **모두 withServiceRole 미사용** 으로 변경한다. 이유: `withServiceRole` 의 pre-insert audit이 `audit_log.instance_id NOT NULL` 을 요구하는데, 이들 operation은 instance scope 가 없거나 (slug resolve) instance 가 아직 결정 안 됨 (admin_user upsert 시점). Spike A audit_log migration 의 NOT NULL 제약은 LOCAL_PASS 통과 SoT 이므로 reversal 위험. 대신 sqlBase 직접 SQL + audit_event 명시 emit. `ServiceRoleFunction` enum cascade 도 precondition 에서 제거 (M0 v1.0 instance-scoped service-role 작업 시점에 enum 추가). audit 일관성은 § 5.5 event matrix 가 명시.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:53:> **M0 화면 ② 축소판 marker (ADMIN-UI-15)**: skeleton의 ClinicProfile 폼은 single contract(ClinicProfile DB row) 만 저장하며, admin/ARCHITECTURE § 3.2의 "ClinicProfile + LocationProfile(main) + LegalDocument 3계약 동시 출력" 은 M0 v1.0 본 구현에서 합류한다.
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:59:| LocationProfile(main) 자동 생성 (admin/ARCH § 3.8.1) | M0 v1.0 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:60:| LegalDocument 자동 생성 (admin/ARCH § 3.8.2) — **skeleton 은 발행/출시 판단 없음**: P-013 Legal/Policy 는 admin/ARCH 의 출시 게이트지만 skeleton 에는 발행 자체가 없으므로 release readiness 의미 없음 (ADMIN-UI-62) | M0 v1.0 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:350:### 5.5 audit 통합 (cycle3 정정 ADMIN-UI-49·54·57)
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:637:| 7 | audit_event 기록 (ADMIN-UI-78 정정) | § 5.5 audit_event query 결과 행 존재 (`tenant-resolved`·`content-saved`·`session-created`). audit_log 는 skeleton 에서 **0건 허용** — M0 v1.0 instance-scoped service-role 작업 도입 시점에 audit_log row 검증 추가 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:700:| 2026-05-15 | v0.7 | **cycle6 patch (6 findings · major 2 · minor 3 · nit 1 전건 처리)**: (1) ADMIN-UI-87 seed reactivate CTE 가 `instance_membership_deactivated_consistency` CHECK 위반 — `deactivated_at = NULL · deactivated_by_user_id = NULL · updated_at = now()` 추가, (2) ADMIN-UI-88 DATABASE_URL 권한 (a) BYPASSRLS/owner + (b) `SET ROLE app_tenant_user` 가능 + (c) `SET ROLE postgres` 가능 3가지 명시 + 권장 GRANT 구성, (3) ADMIN-UI-89 first-active-membership-resolved emit 에 `targetUserId:userId` 추가 (matrix 와 일치), (4) ADMIN-UI-90 § 5.5 matrix 에 `session-revoked-anonymous` row 추가, (5) ADMIN-UI-91 PACKAGES_STRUCTURE cascade `verify only` → `v0.2 patch` (placeholder 분류 제거 + dependency arrow 갱신), (6) ADMIN-UI-92 루트 script patch 를 `구현 진입 precondition` 으로 분리 표기 (plan acceptance 와 분리) |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:702:| 2026-05-15 | v0.5 | **cycle4 patch (12 findings · major 7 · minor 5 · nit 0 전건 처리)**: (1) ADMIN-UI-63·66·67·68·71 일괄 — control-plane operation (slug resolve · admin_user upsert · first-active-membership resolve · seed) 모두 withServiceRole 미사용 + sqlBase 직접 + audit_event emit 으로 변경. ServiceRoleFunction enum precondition 제거 · audit_log instance_id NOT NULL 충돌 회피, (2) ADMIN-UI-64·65 admin_user.display_name NOT NULL — seed system actor='System' + operator=cli arg · consume route auto upsert=email prefix, (3) ADMIN-UI-67 A-03 skeleton-local 명시 + INFRA·SPIKE reversal follow-up cascade, (4) ADMIN-UI-69 § 8.1 시나리오 3 audit_event 로 정정, (5) ADMIN-UI-70 § 5.5 matrix seedRunner 행 제거 (audit_event 로 통일), (6) ADMIN-UI-71 게이트 #3 SEED before sign-in ordering · health check systemActorPresent 검증, (7) ADMIN-UI-72 typecheck:all scope 정의 — pkg:* (packages only) + apps/web 추가, (8) ADMIN-UI-73 RESEND_MODE env validation `mock | suppress-mock` 만, (9) ADMIN-UI-74 W-03 middleware 미사용 결정 명시 |
docs/decisions/ADMIN_UI_SKELETON_PLAN.md:703:| 2026-05-15 | v0.4 | **cycle3 patch (18 findings · major 12 · minor 6 · nit 0 전건 처리)**: (1) ADMIN-UI-45 § 5.4 audit reason taxonomy vs UI deny reason 분리 명시 — packages/auth audit internal reason 4종(user-not-found · super-admin-not-switched · super-admin-selected-mismatch · membership-not-found-or-inactive) 별도 마커, packages/auth v0.3 normalize cascade, (2) ADMIN-UI-46 peekSessionUserId → getActiveSession 사용으로 § 6.2 정정, (3) ADMIN-UI-47 admin_user upsert 를 withServiceRole(adminUserUpsert) 안에서 수행하도록 § 5.5 matrix 정정, (4) ADMIN-UI-48·58 seed audit_log direct INSERT 제거 → audit_event 사용 (audit_log 의 instance_id NOT NULL 회피) + § 7.1 migration precondition 표 정정, (5) ADMIN-UI-49 § 5.5 audit_log query ORDER BY occurred_at, (6) ADMIN-UI-50 § 5.1 cookie fixed window + DB session sliding window asymmetric refresh 보안 모델 명시, (7) ADMIN-UI-51 § 3.2 sign-out 흐름 getActiveSession → revokeSession → emit + tampered cookie 분기 (session-revoked-anonymous), (8) ADMIN-UI-52 § 12 shared-types cascade 중복 제거 — 선행 precondition 단일화, (9) ADMIN-UI-53 § 7 DATABASE_URL 권한을 'SET ROLE postgres 가능한 admin role' 로 좁힘, (10) ADMIN-UI-54 slug-lookup-not-found 를 audit_event 별도 emit 으로 명시 (slugResolver 책임), (11) ADMIN-UI-55 § 5.4 SignInReason union 별도 정의 (AuthDenyReason + no-active-membership + magic-link-rejected), (12) ADMIN-UI-56 redirect('/404') → notFound(), (13) ADMIN-UI-57 content-saved audit best-effort try/catch + gate happy-path 명시 + transactional outbox cascade marker, (14) ADMIN-UI-59 § 10 W-01~W-07 최종 결정 한 줄씩, (15) ADMIN-UI-60 PACKAGES_STRUCTURE cascade 'verify only' 로 정정, (16) ADMIN-UI-61 § 9 게이트 precondition 명시, (17) ADMIN-UI-62 deferred 표 LegalDocument 행에 'skeleton 은 발행/출시 판단 없음' 안전 문구 추가 |
packages\core-content\dist\index.d.ts:3:export type { ClosedLegalDocumentType, LegalDocumentType, Template, RenderContext, } from "./templates/index.js";
packages\core-content\src\index.ts:26:  ClosedLegalDocumentType,
packages\core-content\src\index.ts:27:  LegalDocumentType,
packages\core-content\src\schema.ts:90:// === LocationProfile (C-21·M0-18 country regex) ===
packages\core-content\src\schema.ts:245:// === LegalDocument (C-16·LOCATION_LEGAL_PLAN v1.0 § 2.1) ===
packages\core-content\src\templates\index.ts:14:export type ClosedLegalDocumentType =
packages\core-content\src\templates\index.ts:21:export type LegalDocumentType = ClosedLegalDocumentType | "cookie" | "other";
packages\core-content\src\templates\index.ts:24:  readonly documentType: ClosedLegalDocumentType;
packages\core-content\src\templates\index.ts:31:export const TEMPLATES: Record<ClosedLegalDocumentType, Template> = {
packages\core-content\src\templates\index.ts:69:export const CLOSED_DOCUMENT_TYPES: readonly ClosedLegalDocumentType[] = [
packages\core-content\src\templates\index.ts:78:export const CLOSED_DOCUMENT_TYPES_ALPHA: readonly ClosedLegalDocumentType[] = [
packages\core-content\dist\templates\index.d.ts:1:export type ClosedLegalDocumentType = "privacy" | "terms" | "non-covered" | "refund" | "complaint";
packages\core-content\dist\templates\index.d.ts:2:export type LegalDocumentType = ClosedLegalDocumentType | "cookie" | "other";
packages\core-content\dist\templates\index.d.ts:4:    readonly documentType: ClosedLegalDocumentType;
packages\core-content\dist\templates\index.d.ts:10:export declare const TEMPLATES: Record<ClosedLegalDocumentType, Template>;
packages\core-content\dist\templates\index.d.ts:11:export declare const CLOSED_DOCUMENT_TYPES: readonly ClosedLegalDocumentType[];
packages\core-content\dist\templates\index.d.ts:12:export declare const CLOSED_DOCUMENT_TYPES_ALPHA: readonly ClosedLegalDocumentType[];

 succeeded in 647ms:
 320: > **두 taxonomy 분리 명시 (ADMIN-UI-45)**:
 321: > - **UI deny reason** = `AuthDenyReason` union 17종 (packages/auth/src/errors.ts L6-L23). UI mapping/HTTP status/사용자 표시는 이 union 에 한정.
 322: > - **audit internal reason** = `AuthDenyReason` 17종 **+ packages/auth 내부 추가 문자열** (`user-not-found` · `super-admin-not-switched` · `super-admin-selected-mismatch` · `membership-not-found-or-inactive`). resolveTenantContext L83/L101/L110/L127 가 audit_event.reason 에 직접 기록하는 문자열들이며, UI 까지 노출되지 않고 운영 query·forensic 분석용. UI 노출 분기 시에는 `AuthDeniedError`/`TenantResolveError` 가 throw 한 `reason` 만 사용.
 323: > - 두 taxonomy 통합/normalize 는 packages/auth v0.3 cascade marker (audit reason 도 `AuthDenyReason` 으로 normalize 또는 별도 `AuthAuditReason` union 신설).
 324: 
 325: > **sign-in page query reason union 별도 정의 (ADMIN-UI-55)**:
 326: > ```typescript
 327: > type SignInReason =
 328: >   | AuthDenyReason  // 17 reasons
 329: >   | 'no-active-membership'   // postLoginRedirect → membership 없음
 330: >   | 'magic-link-rejected'    // consume 실패 reason 묶음 (magic-link-* 4종 별도 분기 안 할 때)
 331: > ```
 332: > `/sign-in?reason=<r>` 의 `r` 은 `SignInReason` 으로 검증. 미매핑 reason 은 generic 메시지로 fallback.
 333: 
 334: `AuthDenyReason` union 의 **실제 17 reasons** (packages/auth/src/errors.ts L6-L23) 기준 exhaustive 매핑. `assertNever` 로 build-time enforce.
 335: 
 336: | reason | UI 동작 |
 337: |---|---|
 338: | `session-not-found` · `session-expired` · `session-signature-invalid` | cookie clear · `/sign-in?reason=<r>` |
 339: | `user-inactive` | cookie clear · `/sign-in?reason=user-inactive` |
 340: | `invalid-instance-id` | 404 (페이지를 찾을 수 없습니다) |
 341: | `membership-not-found` | 403 (이 인스턴스에 접근 권한 없음) |
 342: | `membership-inactive` | **현재 코드 경로에서 unreachable** (ADMIN-UI-35) — resolveTenantContext L121-L129 가 `active=true` 조건만 조회해 always `membership-not-found` 로 collapse. mapping 은 future-proof 로 유지하되 마커 표시. packages/auth v0.3 에서 inactive 분기 추가 검토 (separate cycle). |
 343: | `instance-mismatch` · `super-admin-required` | 안내 페이지 (skeleton 범위 외) |
 344: | `legal-reviewer-ineligible` · `physician-reviewer-ineligible` · `client-approver-ineligible` | 403 (역할 자격 없음) |
 345: | `operator-role-required` | 403 (운영자 권한 필요) |
 346: | `magic-link-expired` · `magic-link-consumed` · `magic-link-not-found` · `magic-link-invalid` | `/sign-in?reason=<r>` + emitAuditEvent `magic-link-rejected` |
 347: 
 348: `assertNever` exhaustive 체크 → union 확장 시 컴파일 fail (게이트 #9).
 349: 
 350: ### 5.5 audit 통합 (cycle3 정정 ADMIN-UI-49·54·57)
 351: 
 352: **audit_event 단일 SoT 포기** (ADMIN-UI-26). 두 테이블 병존:
 353: 
 354: | 테이블 | 컬럼 | 작성 경로 |
 355: |---|---|---|
 356: | `audit_event` | `id, event_type, actor_user_id, target_user_id, from_instance_id, to_instance_id, reason, payload, occurred_at` (ADMIN-UI-25 — `occurred_at` 사용) | packages/auth.emitAuditEvent · base role connection (tx 밖) |
 357: | `audit_log` | `id, instance_id, actor_id, actor_role, action, metadata, ...` | packages/db.withServiceRole 자동 (pending → outcome) |
 358: 
 359: **emitAuditEvent 호출 위치 정책 (ADMIN-UI-36)**: `audit_event` 는 `app_tenant_user` 에 GRANT INSERT 가 없으므로 (`apps/spike-e/migrations/004_audit_event.sql`), **tx 밖 base role connection 에서만 호출**. tx 안 emit 금지. `content-saved` 는 tx commit **후** `emitAuditEvent(sqlBase, ...)`. tx와 audit dual-write race 는 skeleton 허용 — audit 누락 시 best-effort log + Sentry alert (M0 v1.0 cascade marker로 transactional outbox 패턴 검토).
 360: 
 361: 대안 — packages/auth/migrations 에 `GRANT INSERT ON audit_event TO app_tenant_user` + WITH CHECK 추가하는 patch — 는 별도 cascade marker (audit_event 가 현재 apps/spike-e/migrations 에만 있는 문제와 함께 packages/auth v0.3 으로 통합).
 362: 
 363: **walking skeleton event 매트릭스**:
 364: 
 365: | eventType | 테이블 | emit 위치 |
 366: |---|---|---|
 367: | `magic-link-issued` | audit_event | apps/web /sign-in Server Action |
 368: | `magic-link-consumed` · `magic-link-rejected` | audit_event | apps/web /sign-in/consume Route Handler |
 369: | `session-created` · `session-revoked` | audit_event | /sign-in/consume · /sign-out Route Handler |
 370: | `session-revoked-anonymous` (cycle3 ADMIN-UI-51 · cycle6 matrix 추가 ADMIN-UI-90) | audit_event | /sign-out — tampered/expired cookie 분기 (getActiveSession throw 시) · payload.reason = `AuthDenyReason` (`session-signature-invalid` · `session-expired` · `session-not-found`) · actorUserId NULL |
 371: | `tenant-resolved` · `tenant-resolve-denied` · `inactive-user-rejected` | audit_event | packages/auth.resolveTenantContext 자동 |
 372: | `content-saved` | audit_event | apps/web 의 save 액션 (ClinicProfile + 3 entity — tx commit 후 best-effort) · payload shape `{contentType, slug, mode, status, originalSlug}` 통일 (cycle2-3entity WEB-28) · ClinicProfile 한정 추가 필드 `updatedAtBefore/After` (single-row 동시 저장 race 분석용 · 3-entity N-row 추가는 M0 v1.0 cascade marker · cycle4-3entity WEB-47) |
 373: | `content-deleted` (cycle3-3entity WEB-43 추가) | audit_event | apps/web 의 delete 액션 (DoctorProfile · TreatmentPage · Article — tx commit 후 best-effort) · payload `{contentType, slug}` |
 374: | `session-cookie-cleared` (cycle2-3entity WEB-30 신규) | audit_event | `/sign-in/cleanup` route — cookie 존재 시에만 emit · payload.reason = `AuthDenyReason` |
 375: | `slug-lookup-not-found` | audit_event | `slugResolver` (sqlBase 직접 SELECT 후 null 시 emit · ADMIN-UI-54·63·69) |
 376: | ~~`admin-user-upserted`~~ (cycle5 제거 ADMIN-UI-75) | — | self-provision 방지 — consume route 자동 INSERT 제거 |
 377: | `user-not-allowlisted-on-consume` (cycle5 신규 ADMIN-UI-75) | audit_event | consume route — allowlist 미존재 사용자 시도 |
 378: | `magic-link-issue-denied` (cycle5 신규 ADMIN-UI-75) | audit_event | /sign-in Server Action — allowlist 미존재 사용자 토큰 발급 시도 |
 379: | `first-active-membership-resolved` | audit_event | consume route — instance_membership + instance JOIN SELECT 성공 (targetUserId · payload.slug — cycle5 ADMIN-UI-80 camelCase) |
 380: | `first-active-membership-missing` (cycle5 신규 ADMIN-UI-84) | audit_event | consume route — membership 없음 → session 미발급 + redirect |

 succeeded in 702ms:
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/decisions/ADMIN_UI_SKELETON_PLAN.md | ForEach-Object { $i++; if($i -ge 380 -and $i -le 420){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
 succeeded in 542ms:
 380: | `first-active-membership-missing` (cycle5 신규 ADMIN-UI-84) | audit_event | consume route — membership 없음 → session 미발급 + redirect |
 381: | `seed-completed` | audit_event | seed script — sqlBase 직접 INSERT 후 emit (§ 7.1) |
 382: 
 383: > cycle4 정정 (ADMIN-UI-63·66·67·70·71): walking skeleton 의 control-plane operation 은 모두 sqlBase 직접 호출 + audit_event emit 으로 통일. `withServiceRole` 사용 행 (slugResolver · firstActiveMembershipResolver · adminUserUpsert · seedRunner) 모두 제거.
 384: 
 385: **Gate verification query** (§ 9 #7) — 두 테이블 분리 검증:
 386: 
 387: ```sql
 388: -- audit_event
 389: SELECT event_type, actor_user_id, payload FROM audit_event
 390:  WHERE event_type IN ('tenant-resolved','content-saved','session-created')
 391:    AND occurred_at > $sinceTime
 392:  ORDER BY occurred_at;
 393: 
 394: -- audit_log: skeleton 에서는 비어 있음 (모든 control-plane operation 이 audit_event 사용 · cycle4)
 395: -- M0 v1.0 instance-scoped service-role 작업 도입 시점에 audit_log query 추가
 396: ```
 397: 
 398: **content-saved audit 실패 정책 (cycle3 결정 ADMIN-UI-57)**: tx commit 후 base-role `emitAuditEvent` 가 실패할 수 있다 (network·base-role connection issue 등). skeleton 정책:
 399: 1. `saveClinicProfile` 안에서 audit emit 호출을 `try/catch` 로 감싸 **저장은 성공으로 처리** (`return { ok: true }`)
 400: 2. catch 블록에서 `console.error` + Sentry alert (M0 v1.0 Sentry 합류 시)
 401: 3. **gate #7 은 happy-path 시나리오 기준** — DB 정상 상태에서 content-saved row 존재 검증. audit insert 실패 시나리오는 § 8.1 별도 항목으로 검증하되 gate 통과 조건 외.
 402: 4. **transactional outbox 패턴**으로 dual-write race 해소는 M0 v1.0 cascade marker — 그 시점부터 audit emit 실패 시 Server Action 도 실패 처리하는 정책으로 전환.
 403: 
 404: ## 6. ClinicProfile 폼 명세 (skeleton 범위)
 405: 
 406: ### 6.1 입력 필드 (cycle2 정정 ADMIN-UI-42)
 407: 
 408: | 필드 | 입력 | zod 검증 | DB 검증 |
 409: |---|---|---|---|
 410: | `name` | text | min 1, max 100 | CHECK `clinic_profile_name_length` |
 411: | `slug` | hidden fixed `clinic` | — | CHECK regex |
 412: | `description` | textarea (maxLength=300) | min 80, max 300 | CHECK `clinic_profile_description_length` |
 413: | `logoUrl` | text URL | z.string().url().max(2048) | not null (DB CHECK 없음 — core-content v0.3 cascade) |
 414: | `ogImageUrl` | text URL | 같음 | 같음 |
 415: | `businessRegistrationNumber` | text | optional · regex `^\d{3}-\d{2}-\d{5}$` | CHECK |
 416: | `alternateName` | text | optional · empty string → null normalize · max 100 | DB CHECK 없음 |
 417: | `legalEntityName` | text | optional · normalize · max 200 | DB CHECK 없음 |
 418: | `slogan` | text | optional · normalize · max 200 | DB CHECK 없음 |
 419: | `longDescription` | textarea | optional · normalize · max 2000 | DB CHECK 없음 |
 420: | `foundingDate` | date (YYYY-MM-DD) | optional · ISO 날짜 · normalize | DB type=date |

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command 'rg -n "LegalDocument|ContentType 예외|answer-first|표현 검사|면제" docs/core/CONTENT_STANDARDS.md' in C:\Users\assag\solution\website-exposure
 succeeded in 495ms:
87:[나쁨 — answer-first 위반]
92:#### 2.1.1 answer-first 검사 대상 (Markdown AST)
159:| 답변 첫 문장이 핵심 답변 아닌 경우 (answer-first 위반) | warning |
207:- 위 판정 텍스트가 포함된 문단·블록에 다음 중 1개라도 동일/인접 단락(2단락 이내) 존재 시 본 § 3.5 룰의 **content-gate finding 미발생** — 인용 인정. **§ 4.1 fail 룰(완치·100%·보장 등)은 인용 존재 여부와 무관하게 항상 적용** (인용 면제 대상 아님):
608:| **warning** | 경고 + 어드민 검토 큐 | answer-first 위반, 구조화 블록 부재, H 위계 건너뜀 등 |
621:| CS-A | § 1.3 본문 글자 수 산정의 정확한 정규식 — Markdown 코드 블록·링크 URL·이미지 마크업·HTML 태그·공백·문장부호 제거 패턴 + § 2.1.1 answer-first AST 파서 라이브러리 선택 | 자체 룰 checker 구현 시 |
639:| 2026-05-14 | v0.1 | 최초 작성 — 톤·문체·길이, AEO·AI 스니펫 친화 구조(answer-first·헤딩·구조화 블록), 콘텐츠 블록 표준(Q&A·리스트·표·콜아웃·인용·임베디드), 의료광고 표현 단일 SoT(금지 11종·대체 표현·후기/전후/가격 별도 정책), 페이지 타입별 룰 8종, ArticleType 7종, compliance-assistant 인터페이스, 빌드 검증 fail/warning/content-gate |
645:| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (12개 지적 전건 수용)**: (A) § 7.1 `featureContentType` 별도 필드 도입 — C-10 enum은 `Feature` 토큰 1개만 cascade 추가, 실제 구분은 namespace 필드로. (B) § 7.1.1 Feature 예시를 P-106 self-test로 정정 — P-105 ReservationPage는 Core C-20임을 명시. slug kebab-case 정규식(`^[a-z][a-z0-9-]*[a-z0-9]$`) 확정. (C) § 7.2 `findingsBySeverity` 키를 severity enum과 동일(`"content-gate"`)로 통일. (D) ApproverRole enum에 `client` 포함. (E) `requiredApproverRole` → `requiredApproverRoles: ApproverRole[]` 배열로. `review-case`는 `["medical", "legal"]` 기본값. 어드민 워크플로는 AND 조건으로 발행 게이트. (F) CompositeRiskRule `logic` enum 정밀화 — `AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR` 3종. (G) § 7.4.3 composite severity 4종 모두 허용으로 운영 규칙 정정. (H) ContentScope에 `featureContentType` 검증 흐름 (Feature contentType 입력 시) — 추후 검증기 구현. (9) § 3.5 인용 면제는 § 3.5 content-gate에만 적용 — § 4.1 fail 룰은 절대 완화 안 됨 명시. (10) § 4.3 가격·할인·이벤트 — P-102·P-104·P-010(`articleType=event-price`) cross-reference 명시. (11) **DATA_MODEL cascade — C-04 Article.body 권장 길이 "최소 300단어" → "최소 1,000자(공백 제외). CONTENT_STANDARDS § 1.3 SoT"** 정정. (12) § 8 content-gate 정의를 SCHEMA_MAPPING § 7.3과 통일 — schema 출력 승인 게이트 포함 |
646:| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/decisions/LOCATION_LEGAL_PLAN.md | ForEach-Object { $i++; if(($i -ge 340 -and $i -le 430) -or ($i -ge 470 -and $i -le 505)){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
 succeeded in 531ms:
 340: 
 341: ### 4.1 단일 transaction 동시 upsert (LL-ACTION-01)
 342: 
 343: ```typescript
 344: // apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts
 345: 
 346: await withSkeletonTx({ signedToken, instanceId }, async (tx, ctx) => {
 347:   assertActionEligibility(ctx, "operator-edit-content");
 348:   // cycle1 LL-18 patch: LegalDocument 편집은 skeleton 단계 status=draft + risk_level=Low 의 CHECK 로 제한.
 349:   // 별도 ActionType (operator-edit-legal) 분리는 LL-DEFER-09 (RBAC cascade).
 350: 
 351:   // cycle1 LL-07 patch: 잠금 순서 결정적 — instance 안 모든 entity 동일 순서
 352:   // (1) clinic_profile (FOR UPDATE) — UPSERT 한 번에 처리하므로 별도 SELECT 안 함
 353:   // (2) location_profile main (FOR UPDATE) — UPSERT
 354:   // (3) legal_document × 5 — documentType 사전 정렬 (alpha) 순서 UPSERT: complaint → non-covered → privacy → refund → terms
 355:   //     (cycle1 LL-07 patch — closed 5종 사전 알파벳 순)
 356: });
 357: ```
 358: 
 359: **결정**:
 360: - (LL-ACTION-02) 3계약 + 5 LegalDocument 모두 같은 tx — RLS 정합 + atomic 출력. 하나 실패 = 전체 rollback.
 361: - (LL-ACTION-03 · cycle1 LL-17 patch) audit `content-saved` 는 tx commit 후 **7 row 별도 emit** — ClinicProfile 1 + LocationProfile 1 + LegalDocument 5. 각 row 의 payload 는 기존 통일 shape `{contentType, slug, mode, status, originalSlug}`. `ClinicProfileBundle` outer 폐기. analytics/test 호환 보존.
 362: - (LL-ACTION-04 · cycle1 LL-07 patch) 잠금 순서 = (1) clinic_profile → (2) location_profile main → (3) legal_document 5종 (alpha sort: complaint → non-covered → privacy → refund → terms). 결정적 순서로 deadlock 회피.
 363: - (LL-ACTION-05) ClinicProfile UPSERT 의 `(xmax = 0)` 판별을 모든 entity 에 적용 — 각 audit row 별 `mode: "insert"|"update"`.
 364: - (LL-ACTION-06 · cycle1 LL-16 + cycle3 LL-46 patch) **자동 재렌더링 분기 제거** — v0.4 는 LegalDocument 본문 수동 편집 차단 (LL-DEFER-06) 이므로 모든 row 가 templateVersion=current. 매 저장 시 모든 LegalDocument body 재렌더링. **운영자 알림 marker (LL-FORM-15 · 폼 (d) 상단 안내문)**: "본원 정보(기관명·법인명·사업자번호·설립자·본원 주소·전화·이메일) 또는 정책 변수(담당자·이메일·전화·시행일)를 수정하면 5종 정책 문서 본문이 자동으로 다시 생성됩니다. 본문 직접 수정은 추후 단계에서 합류합니다." 향후 수동 override 도입 시 별도 `body_source` enum (`auto`/`manual`) 컬럼 cascade.
 365: - (LL-ACTION-07 · cycle1 LL-21 patch) `effective_date` default — DB `CURRENT_DATE AT TIME ZONE 'Asia/Seoul'` (Postgres) 사용. server `new Date()` 사용 금지. form 입력 시 ISO 형식 그대로.
 366: - (LL-ACTION-08 · cycle1 LL-02 + cycle3 LL-45 patch — LL-SCHEMA-12·LL-SCHEMA-18 통일) LocationProfile 자동 상속 = **build-time reference (deep clone)**. server action 안 DB 저장은 `metadata.reservationChannelsInheritedFrom = "clinic_profile.primary_ctas"` marker 만 (의도 명시용). 실제 출력 시점은 apps/worker · M0 v1.0 build/export 의 책임 (LL-CASCADE-04 marker 신설).
 367: - (LL-ACTION-09 · cycle1 LL-05 + cycle2 LL-30 patch) businessHours 변환 — form 의 7요일 단순 입력 → server action 안에서 `convertToOpeningHoursSpec()` 으로 CT-02 SoT 형식 (openingHours[] grouped by 동일 open/close) 변환 후 metadata 저장. `lunchBreaks[]` 도 동일 grouping. `receptionHours[]`/`specialClosures[]` 는 v0.3 빈 배열 + round-trip 시 빈 배열 보존 (form 재로딩 시 미표시 — 입력 필드 자체 없음).
 368: - (LL-ACTION-21 · cycle2 LL-29 + cycle3 LL-44 patch) **assertHasMainLocationAfterTx 안전망**: tx 안 마지막 단계에서 `SELECT 1 FROM location_profile WHERE instance_id=? AND clinic_profile_id=? AND slug='main'` — 0행이면 **`MainLocationMissingError` (apps/web/src/lib/errors.ts 신설 named Error class) throw** → tx rollback. server action outer catch 에서 `MainLocationMissingError` 별도 분기: `return { ok: false, fieldErrors: {}, formError: "본원 정보 저장에 실패했습니다. 페이지를 새로고침하고 다시 시도하세요." }`. mapDbErrorToResult 와는 별개 (DB error 가 아닌 application-level invariant). 정상 흐름에서는 LocationProfile main upsert 가 항상 수행되므로 trip 안 됨. DB trigger 합류 (LL-DEFER-15) 까지 임시 보호.
 369: 
 370: ### 4.2 변수 치환 엔진 (LL-ACTION-10 · cycle1 LL-06 patch)
 371: 
 372: ```typescript
 373: // packages/core-content/src/templates/render.ts
 374: 
 375: type RenderContext = {
 376:   clinic: {
 377:     name: string;
 378:     legalEntityName: string | null;
 379:     businessRegistrationNumber: string | null;
 380:     founder: string | null;
 381:   };
 382:   location: {
 383:     main: {
 384:       address: string;       // street + locality + region + postal 한 줄
 385:       telephone: string;
 386:       email: string | null;
 387:     };
 388:   };
 389:   policy: {                  // cycle1 LL-06 patch: admin/ARCH § 3.8.2 의 contactPerson 입력 섹션 = policy.* 변수 출처. SoT 정당화.
 390:     contactPerson: string;
 391:     contactEmail: string;
 392:     contactPhone: string;
 393:     effectiveDate: string;   // YYYY-MM-DD (LegalDocument 별 override 결과)
 394:   };
 395: };
 396: 
 397: export function renderTemplate(template: string, ctx: RenderContext): string;
 398: ```
 399: 
 400: **결정**:
 401: - (LL-ACTION-11) 변수 화이트리스트 strict — 등록되지 않은 키 (`{{foo.bar}}`) 는 build error throw (server action 안에서 catch → formError). 운영자 입력 본문이 아니라 Core 표준 템플릿만 처리하므로 XSS 위험 없음.
 402: - (LL-ACTION-12 · cycle1 LL-24 patch) **검출 시점 = server action runtime** — 매 저장 시 5종 template body 를 renderTemplate 호출 → unknown key throw → formError. build-time unit test 도 cascade (templates 자체 의 unknown key 부재 검증) — `packages/core-content` test runner.
 403: - (LL-ACTION-13) 변수 미정의 (NULL) — 템플릿 안에서 `{{?clinic.legalEntityName}}` 조건 블록 또는 `{{clinic.legalEntityName | default: clinic.name}}` 형식. 단순 fallback 만 지원.
 404: - (LL-ACTION-14) 변수 값 자체에 `{{` 포함 (운영자 입력) — 1차 치환 후 값에 포함된 `{{` 는 추가 치환하지 않음 (no recursive expansion).
 405: - (LL-ACTION-15) 출력 형식: Markdown plain text. HTML escape 없음 — DB body 컬럼은 Markdown SoT.
 406: - (LL-ACTION-16 · cycle1 LL-06 + cycle2 LL-33 patch) `policy.*` 변수 정당화 — admin/ARCH § 3.8.2 의 `contactPerson` 필드 + § 3.8.2 결정 ("ClinicProfile 폼 '정책 변수' 보조 섹션") 이 SoT 출처. ARCH 본문에 `policy.*` 변수가 명시되지 않은 것은 ARCH 의 변수 사용 sample 일 뿐. **acceptance 전 순서 정합 (cycle2 LL-33)**: 본 plan v1.0 acceptance **와 동시 또는 직전에** ARCH § 3.8.2 patch (LL-CASCADE-01) 적용 — plan acceptance commit 안에 ARCH 패치 포함. plan 단독 acceptance 시 ARCH SoT 충돌 잔존하므로 cascade 가 acceptance precondition.
 407: 
 408: ### 4.3 audit (LL-ACTION-17 · cycle1 LL-17 patch)
 409: 
 410: 7 row 별도 emit. 각 row 는 기존 통일 shape `{contentType, slug, mode, status, originalSlug}`:
 411: 
 412: ```jsonc
 413: // row 1
 414: { "eventType": "content-saved", "payload": { "contentType": "ClinicProfile",  "slug": "clinic", "mode": "...", "status": null,    "originalSlug": "clinic" } }
 415: // row 2
 416: { "eventType": "content-saved", "payload": { "contentType": "LocationProfile", "slug": "main",   "mode": "...", "status": null,    "originalSlug": "main" } }
 417: // row 3~7 (5종 LegalDocument)
 418: { "eventType": "content-saved", "payload": { "contentType": "LegalDocument",   "slug": "privacy", "mode": "...", "status": "draft", "originalSlug": "privacy",
 419:                                               "documentType": "privacy", "templateVersion": "privacy@1.0.0" } }
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
 470:   | "privacy" | "terms" | "non-covered" | "refund" | "complaint" | "cookie" | "other";
 471: 
 472: export type Template = {
 473:   documentType: LegalDocumentType;
 474:   slug: string;
 475:   title: string;
 476:   version: string;        // "privacy@1.0.0"
 477:   body: string;           // raw Markdown with {{...}} placeholders
 478: };
 479: 
 480: export const TEMPLATES: Record<"privacy" | "terms" | "non-covered" | "refund" | "complaint", Template>;
 481: ```
 482: 
 483: **결정**:
 484: - (LL-TEMPLATE-02) v0.2 는 5종 (`cookie`/`other` 제외) — M1 manual 입력 cascade (LL-DEFER-12).
 485: - (LL-TEMPLATE-03) 본문은 Markdown 원본 텍스트로 packages 안 보관. 빌드 시 dist 에 동봉. import 는 ESM `import { TEMPLATES } from "@glitzy/core-content/templates"`.
 486: - (LL-TEMPLATE-04) **법무 검토 필수 marker** — README/CHANGELOG 에 명시. Core 표준 템플릿 본문 자체는 본 plan 의 검토 범위 외. 별도 cascade 로 법무 검토 받은 본문으로 교체.
 487: - (LL-TEMPLATE-05 · cycle1 LL-06 patch) 변수 화이트리스트 (admin/ARCH § 3.8.2 SoT cascade marker LL-CASCADE-01 — ARCH 본문에 본 표 reference 추가):
 488:   - `{{clinic.name}}` · `{{clinic.legalEntityName}}` · `{{clinic.businessRegistrationNumber}}` · `{{clinic.founder}}`
 489:   - `{{location.main.address}}` · `{{location.main.telephone}}` · `{{location.main.email}}`
 490:   - `{{policy.contactPerson}}` · `{{policy.contactEmail}}` · `{{policy.contactPhone}}` · `{{policy.effectiveDate}}`
 491: - (LL-TEMPLATE-06) 템플릿 versioning — semver `major.minor.patch`. minor 이상 업그레이드 시 자동 재렌더링 (LL-ACTION-06 — v0.2 매 저장 시 무조건 재렌더링이므로 minor/major 분기 불필요). major 변경 시 운영자 수동 확인은 LL-DEFER-10.
 492: - (LL-TEMPLATE-07 · cycle1 LL-13 patch) **LegalDocument body 검증 면제 명시** — `docs/core/CONTENT_STANDARDS.md` § 7 ContentType 예외 표에 LegalDocument 추가 (cascade marker LL-CASCADE-03). 면제 범위: (1) answer-first AST 미적용 (정책 문서는 첫 문장 답 제시 구조 아님) (2) 표현 검사 (recommend/best 등 광고 표현) 미적용 (3) 변수 화이트리스트 검증은 별도 룰 (LL-ACTION-12).
 493: 
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

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content packages/core-content/migrations/C0002_location_profile.sql | ForEach-Object { $i++; if($i -le 90){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
 succeeded in 537ms:
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
  29:   CONSTRAINT location_profile_instance_slug_unique UNIQUE (instance_id, slug),
  30:   CONSTRAINT location_profile_instance_id_unique UNIQUE (instance_id, id)
  31: );
  32: 
  33: CREATE INDEX location_profile_instance_idx ON location_profile (instance_id);
  34: 
  35: ALTER TABLE location_profile ENABLE ROW LEVEL SECURITY;
  36: ALTER TABLE location_profile FORCE ROW LEVEL SECURITY;
  37: 
  38: CREATE POLICY tenant_isolation ON location_profile
  39:   FOR ALL TO app_tenant_user
  40:   USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  41:   WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);
  42: 
  43: GRANT SELECT, INSERT, UPDATE, DELETE ON location_profile TO app_tenant_user;

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/decisions/LOCATION_LEGAL_PLAN.md | ForEach-Object { $i++; if($i -ge 285 -and $i -le 335){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
 succeeded in 568ms:
 285:     ],
 286:     "lunchBreaks": [
 287:       { "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "from": "13:00", "to": "14:00" }
 288:     ],
 289:     "specialClosures": []
 290:     // v0.2 미입력 — M1 cascade
 291:   },
 292:   // cycle1 LL-02 patch: ClinicProfile.primaryCtas 자동 상속 결과
 293:   "reservationChannelsInheritedFrom": "clinic_profile.primary_ctas",
 294:   // v0.2 미입력 — LL-DEFER-05
 295:   "representativeDoctors": [],
 296:   "featuredChannelId": null
 297: }
 298: ```
 299: 
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
 331: - (LL-FORM-12 · cycle1 LL-20 patch) phone regex 정책 — 한국 (02-1234-5678 · 010-1234-5678) + 국제 (+82-2-1234-5678). 확장번호 (ext.) · '.' 구분자 (02.1234.5678) 거절. UX 힌트 명시.
 332: - (LL-FORM-13 · cycle1 LL-15 + cycle2 LL-31 + cycle3 LL-39 patch) form (d) 5 record effectiveDate FormData naming **고정 규약 + parser helper**:
 333:   - Field name (form 안 flat key) = `legalDocEffective_<documentType>` (5종: `legalDocEffective_privacy` · `legalDocEffective_terms` · `legalDocEffective_non-covered` · `legalDocEffective_refund` · `legalDocEffective_complaint`). cycle3 LL-39 patch: dotted key (`legalDoc.privacy.effectiveDate`) 회귀 — `Object.fromEntries(formData)` 가 nested object 자동 생성하지 않으므로 flat underscore key 로 변경.
 334:   - server action 안 **parsing helper `extractLegalDocEffectiveOverrides(formData)`** → `Record<DocumentType, string | undefined>` (apps/web/src/lib/clinic-profile-schema.ts 안 정의).
 335:   - zod schema: `z.object({ legalDocEffectiveOverrides: z.record(z.enum([5종]), z.string().optional().refine(ISO_DATE_REGEX or empty)) })` — helper 결과를 zod 안 nested object 로 wrapping 후 통일 validation.

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content package.json | ForEach-Object { $i++; '"'{0,4}: {1}' -f "'$i, $_ }' in C:\Users\assag\solution\website-exposure
 succeeded in 523ms:
   1: {
   2:   "name": "website-exposure",
   3:   "version": "0.1.0",
   4:   "private": true,
   5:   "description": "Glitzy 의료기관 웹사이트 노출 솔루션 — monorepo root",
   6:   "engines": {
   7:     "node": ">=20.10.0",
   8:     "pnpm": ">=10.0.0"
   9:   },
  10:   "scripts": {
  11:     "pkg:build": "pnpm --filter @glitzy/shared-types build && pnpm --filter @glitzy/shared-errors build && pnpm --filter @glitzy/db build && pnpm --filter @glitzy/auth build && pnpm --filter @glitzy/storage build && pnpm --filter @glitzy/notifications-outbox build && pnpm --filter @glitzy/migrations-runner build && pnpm --filter @glitzy/core-content build",
  12:     "pkg:typecheck": "pnpm pkg:build && pnpm --filter @glitzy/shared-types typecheck && pnpm --filter @glitzy/shared-errors typecheck && pnpm --filter @glitzy/db typecheck && pnpm --filter @glitzy/auth typecheck && pnpm --filter @glitzy/storage typecheck && pnpm --filter @glitzy/notifications-outbox typecheck && pnpm --filter @glitzy/migrations-runner typecheck && pnpm --filter @glitzy/core-content typecheck",
  13:     "web:dev": "pnpm --filter @glitzy/web dev",
  14:     "web:build": "pnpm --filter @glitzy/web build",
  15:     "web:seed": "pnpm --filter @glitzy/web seed",
  16:     "typecheck:all": "pnpm pkg:typecheck && pnpm --filter @glitzy/web typecheck",
  17:     "build:all": "pnpm pkg:build && pnpm --filter @glitzy/web build",
  18:     "spike-a": "pnpm --filter @glitzy/spike-a",
  19:     "spike-a:up": "pnpm --filter @glitzy/spike-a up",
  20:     "spike-a:down": "pnpm --filter @glitzy/spike-a down",
  21:     "spike-a:migrate": "pnpm --filter @glitzy/spike-a migrate",
  22:     "spike-a:seed": "pnpm --filter @glitzy/spike-a seed",
  23:     "spike-a:all": "pnpm --filter @glitzy/spike-a scenario:all",
  24:     "spike-b": "pnpm --filter @glitzy/spike-b",
  25:     "spike-b:up": "pnpm --filter @glitzy/spike-b up",
  26:     "spike-b:down": "pnpm --filter @glitzy/spike-b down",
  27:     "spike-b:migrate": "pnpm --filter @glitzy/spike-b migrate",
  28:     "spike-b:seed": "pnpm --filter @glitzy/spike-b seed",
  29:     "spike-b:all": "pnpm --filter @glitzy/spike-b scenario:all",
  30:     "spike-c": "pnpm --filter @glitzy/spike-c-local",
  31:     "spike-c:up": "pnpm --filter @glitzy/spike-c-local up",
  32:     "spike-c:down": "pnpm --filter @glitzy/spike-c-local down",
  33:     "spike-c:seed": "pnpm --filter @glitzy/spike-c-local seed",
  34:     "spike-c:all": "pnpm --filter @glitzy/spike-c-local scenario:all",
  35:     "spike-d": "pnpm --filter @glitzy/spike-d",
  36:     "spike-d:up": "pnpm --filter @glitzy/spike-d up",
  37:     "spike-d:down": "pnpm --filter @glitzy/spike-d down",
  38:     "spike-d:migrate": "pnpm --filter @glitzy/spike-d migrate:dev",
  39:     "spike-d:all": "pnpm --filter @glitzy/spike-d scenario:all",
  40:     "spike-e": "pnpm --filter @glitzy/spike-e",
  41:     "spike-e:up": "pnpm --filter @glitzy/spike-e up",
  42:     "spike-e:down": "pnpm --filter @glitzy/spike-e down",
  43:     "spike-e:migrate": "pnpm --filter @glitzy/spike-e migrate",
  44:     "spike-e:seed": "pnpm --filter @glitzy/spike-e seed",
  45:     "spike-e:all": "pnpm --filter @glitzy/spike-e scenario:all"
  46:   },
  47:   "packageManager": "pnpm@10.28.2"
  48: }

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content packages/core-content/dist/templates/render.js | ForEach-Object { $i++; if($i -le 130){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content packages/core-content/dist/templates/index.js | ForEach-Object { $i++; if($i -le 120){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
 succeeded in 549ms:
   1: // @glitzy/core-content/templates — LOCATION_LEGAL_PLAN v1.0 § 5
   2: //
   3: // LL-TEMPLATE-04 marker: 본 5종 표준 템플릿 본문은 본 plan 의 검토 범위 외.
   4: // 법무 검토 필수 — 별도 cascade 로 법무 검토 받은 본문으로 교체.
   5: import { PRIVACY_BODY, TERMS_BODY, NON_COVERED_BODY, REFUND_BODY, COMPLAINT_BODY, } from "./bodies.js";
   6: export const TEMPLATES = {
   7:     privacy: {
   8:         documentType: "privacy",
   9:         slug: "privacy",
  10:         title: "개인정보처리방침",
  11:         version: "privacy@1.0.0",
  12:         body: PRIVACY_BODY,
  13:     },
  14:     terms: {
  15:         documentType: "terms",
  16:         slug: "terms",
  17:         title: "이용약관",
  18:         version: "terms@1.0.0",
  19:         body: TERMS_BODY,
  20:     },
  21:     "non-covered": {
  22:         documentType: "non-covered",
  23:         slug: "non-covered",
  24:         title: "비급여 진료비 안내",
  25:         version: "non-covered@1.0.0",
  26:         body: NON_COVERED_BODY,
  27:     },
  28:     refund: {
  29:         documentType: "refund",
  30:         slug: "refund",
  31:         title: "환불 규정",
  32:         version: "refund@1.0.0",
  33:         body: REFUND_BODY,
  34:     },
  35:     complaint: {
  36:         documentType: "complaint",
  37:         slug: "complaint",
  38:         title: "민원 처리 안내",
  39:         version: "complaint@1.0.0",
  40:         body: COMPLAINT_BODY,
  41:     },
  42: };
  43: export const CLOSED_DOCUMENT_TYPES = [
  44:     "privacy",
  45:     "terms",
  46:     "non-covered",
  47:     "refund",
  48:     "complaint",
  49: ];
  50: // LL-ACTION-04 patch: alpha sort (deadlock 회피 순서) — server action 안 잠금 순서와 동일.
  51: export const CLOSED_DOCUMENT_TYPES_ALPHA = [
  52:     "complaint",
  53:     "non-covered",
  54:     "privacy",
  55:     "refund",
  56:     "terms",
  57: ];
  58: export { renderTemplate, listTemplateVariables, TemplateRenderError } from "./render.js";
  59: //# sourceMappingURL=index.js.map

 succeeded in 557ms:
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
  11: const VARIABLE_WHITELIST = new Set([
  12:     "clinic.name",
  13:     "clinic.legalEntityName",
  14:     "clinic.businessRegistrationNumber",
  15:     "clinic.founder",
  16:     "location.main.address",
  17:     "location.main.telephone",
  18:     "location.main.email",
  19:     "policy.contactPerson",
  20:     "policy.contactEmail",
  21:     "policy.contactPhone",
  22:     "policy.effectiveDate",
  23: ]);
  24: export class TemplateRenderError extends Error {
  25:     reason;
  26:     variableKey;
  27:     name = "TemplateRenderError";
  28:     constructor(reason, variableKey, message) {
  29:         super(message);
  30:         this.reason = reason;
  31:         this.variableKey = variableKey;
  32:     }
  33: }
  34: function resolveVariable(key, ctx) {
  35:     switch (key) {
  36:         case "clinic.name": return ctx.clinic.name;
  37:         case "clinic.legalEntityName": return ctx.clinic.legalEntityName;
  38:         case "clinic.businessRegistrationNumber": return ctx.clinic.businessRegistrationNumber;
  39:         case "clinic.founder": return ctx.clinic.founder;
  40:         case "location.main.address": return ctx.location.main.address;
  41:         case "location.main.telephone": return ctx.location.main.telephone;
  42:         case "location.main.email": return ctx.location.main.email;
  43:         case "policy.contactPerson": return ctx.policy.contactPerson;
  44:         case "policy.contactEmail": return ctx.policy.contactEmail;
  45:         case "policy.contactPhone": return ctx.policy.contactPhone;
  46:         case "policy.effectiveDate": return ctx.policy.effectiveDate;
  47:         default:
  48:             throw new TemplateRenderError("unknown-variable", key, `unknown variable: ${key}`);
  49:     }
  50: }
  51: // LL-ACTION-13: 단순 fallback `(미기재)` — 옵셔널 변수 NULL 시 표기.
  52: function nullFallback(key) {
  53:     if (key === "clinic.legalEntityName")
  54:         return "(법인명 미기재)";
  55:     if (key === "clinic.businessRegistrationNumber")
  56:         return "(사업자등록번호 미기재)";
  57:     if (key === "clinic.founder")
  58:         return "(대표자 미기재)";
  59:     if (key === "location.main.email")
  60:         return "(이메일 미기재)";
  61:     return "(미기재)";
  62: }
  63: // LL-ACTION-14: 1차 치환만 (no recursive expansion).
  64: const VARIABLE_PATTERN = /\{\{\s*([a-zA-Z][a-zA-Z0-9_.-]*)\s*\}\}/g;
  65: export function renderTemplate(template, ctx) {
  66:     return template.replace(VARIABLE_PATTERN, (_, key) => {
  67:         // 화이트리스트 검증 (strict)
  68:         if (!VARIABLE_WHITELIST.has(key)) {
  69:             throw new TemplateRenderError("unknown-variable", key, `unknown variable: ${key}`);
  70:         }
  71:         const value = resolveVariable(key, ctx);
  72:         if (value === null)
  73:             return nullFallback(key);
  74:         return value;
  75:     });
  76: }
  77: // build-time unit test cascade — packages/core-content test runner 가 모든 템플릿의 unknown key 부재 검증.
  78: export function listTemplateVariables(template) {
  79:     const keys = new Set();
  80:     let match;
  81:     const re = new RegExp(VARIABLE_PATTERN.source, "g");
  82:     while ((match = re.exec(template)) !== null) {
  83:         keys.add(match[1]);
  84:     }
  85:     return [...keys];
  86: }
  87: //# sourceMappingURL=render.js.map

exec
"C:\\Users\\assag\\AppData\\Local\\Microsoft\\WindowsApps\\pwsh.exe" -Command '$i=0; Get-Content docs/core/CONTENT_STANDARDS.md | ForEach-Object { $i++; if($i -ge 430 -and $i -le 590){ '"'{0,4}: {1}' -f "'$i, $_ }}' in C:\Users\assag\solution\website-exposure
 succeeded in 580ms:
 430: ```
 431: 
 432: ComplianceRecord(C-10) 인간 검수 기록 4개 슬롯에 매핑된다 — `findingsBySeverity["content-gate"]` 처리 시 어드민 워크플로가 본 매핑을 사용:
 433: 
 434: | ApproverRole | 매핑 ComplianceRecord 필드 | 의미 |
 435: |---|---|---|
 436: | `medical` | `physicianApprover` + `physicianApprovedAt` | 의료진 콘텐츠 승인 |
 437: | `legal` | `legalCounsel` + `legalCounselAt` | 법무 자문·승인 |
 438: | `operator` | `peerReviewer` + `peerReviewedAt` | 운영자/동료 검수 |
 439: | `client` | `clientApprover` + `clientApprovedAt` | 클라이언트 측 승인 (운영 정책 시) |
 440: 
 441: - compliance-assistant는 ApproverRole 배열만 출력 — 실제 ComplianceRecord 기록 생성·갱신은 어드민 발행 워크플로
 442: - 어드민 워크플로 발행 조건 — `requiredApproverRoles[]`의 **모든** 역할에 대해 ComplianceRecord 해당 필드 기록 완료 시에만 발행 허용 (AND 조건)
 443: 
 444: ### 7.2 출력
 445: 
 446: ```ts
 447: type ComplianceCheckResult = {
 448:   // 자동 검수의 결정 — 빌드/검수 큐 트리거만. 최종 발행 가능 여부는 어드민 워크플로가 결정 (DATA_MODEL C-10 ComplianceRecord 인간 검수 기록과 결합)
 449:   automatedDecision: "block" | "gate" | "warn" | "pass";
 450:   // 세부 플래그 (편의)
 451:   buildBlocked: boolean;        // findings 중 severity="fail" 1개 이상 시 true → CI 빌드 차단
 452:   gateRequired: boolean;        // findings 중 severity="content-gate" 1개 이상 시 true → 어드민 검수 큐 진입
 453:   hasWarnings: boolean;          // findings 중 severity="warning" 1개 이상 시 true → 어드민 경고 큐 진입
 454:   // severity별 집계 — 키는 severity enum 값과 동일 ("content-gate" 그대로 사용)
 455:   findingsBySeverity: {
 456:     "fail": number;
 457:     "content-gate": number;
 458:     "warning": number;
 459:     "info": number;
 460:   };
 461:   // 검수자 역할 요구 (gateRequired=true 시) — 매칭 룰의 requiredApproverRole 합집합. ArticleType High 트리거의 기본값(§ 7.1.2)과 룰 단위 요구를 union
 462:   requiredApproverRoles?: ApproverRole[];
 463:   // 상세 findings
 464:   findings: Finding[];
 465: };
 466: 
 467: // automatedDecision 결정 규칙
 468: // - findings에 severity="fail" 1개 이상 → "block"
 469: // - 위 아닌 경우 severity="content-gate" 1개 이상 → "gate"
 470: // - 위 아닌 경우 severity="warning" 1개 이상 → "warn"
 471: // - 아니면 "pass"
 472: //
 473: // 최종 발행 가능 여부 (publishable)은 본 인터페이스에 포함되지 않음 — 어드민 발행 워크플로가 다음을 종합 판정:
 474: //   1) automatedDecision !== "block"
 475: //   2) gateRequired=true 시 ComplianceRecord(C-10)의 인간 검수 완료
 476: //   3) hasWarnings=true 시 운영 정책에 따라 검토 완료 또는 일괄 인정
 477: 
 478: // ApproverRole 정의는 § 7.1.3 참조 (medical | legal | operator | client)
 479: 
 480: type Finding = {
 481:   ruleId: string;             // § 7.4 RiskRule.id (예: "supremacy-001"). High 가상 finding은 "risk-level-high-gate", LLM 제안은 "llm-suggestion-<UUID>"
 482:   category: string;           // § 7.4 RiskRule.category (예: "최상급")
 483:   pattern: string;             // 매칭된 패턴 텍스트 (예: "최고의"). LLM 제안에서 정규 패턴 산출 불가 시 빈 문자열 허용
 484:   severity: "info" | "warning" | "fail" | "content-gate";
 485:   location: { start: number; end: number };  // 본문 내 위치 (오프셋). LLM 제안에서 오프셋 산정 실패 시 { start: 0, end: 0 } (메타 의미)
 486:   suggestion?: string;        // 대체 표현 (§ 4.2 참조)
 487:   requiredApproverRoles?: ApproverRole[];  // 룰 단위 검수자 요구 (gate 룰만)
 488:   // (v1.3 +) 출처 추적 메타 — features/compliance-assistant.md § 4.6
 489:   triggeredBy?: "static-rule" | "inferred" | "explicit" | "llm-assist";
 490:   llmAssistMeta?: { modelId: string; promptVersion: string; confidence: number };  // triggeredBy="llm-assist" 시
 491: };
 492: ```
 493: 
 494: ### 7.3 빌드 검증 vs 어드민 검수
 495: 
 496: | 단계 | 도구 | 처리 |
 497: |---|---|---|
 498: | 빌드 게이트 (CI) | 자체 룰 checker (§ 7.4 RiskRule 스키마 기반 정규식·키워드 매칭) | `buildBlocked=true` 시 빌드 차단 |
 499: | 어드민 검수 | compliance-assistant LLM 보조 + 사람 검수 | `gateRequired=true` 항목 검토. ComplianceRecord(C-10) 인간 검수 기록 누적 → 어드민 워크플로가 최종 발행 가능 여부 결정 |
 500: 
 501: ### 7.4 RiskRule 데이터 스키마
 502: 
 503: § 4.1 의료광고 표현 룰의 컴퓨팅 표현. 자체 룰 checker·compliance-assistant 모두 본 스키마를 입력으로 받는다.
 504: 
 505: ```ts
 506: // 단일 패턴 룰
 507: type SimpleRiskRule = {
 508:   id: string;                  // 안정 식별자 (예: "supremacy-001", "guarantee-001")
 509:   category: string;            // § 4.1 카테고리
 510:   pattern: string;             // 매칭 패턴 — patternType에 따라 의미 해석
 511:   patternType: "regex" | "keyword" | "phrase";
 512:   severity: "info" | "warning" | "fail" | "content-gate";
 513:   scope: ContentScope[];       // 적용 범위 — § 7.4.1
 514:   requiredApproverRoles?: ApproverRole[];  // severity="content-gate" 시 1개 이상 필수 (배열 — § 7.1.3과 정합)
 515:   suggestion?: string;
 516:   rationale?: string;
 517:   legalBasis?: string[];       // 법령 조문 인용 식별자 (예: "medical-law-art56-para2-no8"). canonical RiskRule 1개에 복수 조문 매핑. `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` § 3.0 패턴
 518:   exceptions?: string[];       // 예외 어구 (false-positive 방지)
 519:   contextExceptions?: ContextException[];  // 안전·주의·행정 문맥 예외 — § 4.4
 520:   version: string;
 521:   createdAt: ISODateString;
 522:   updatedAt: ISODateString;
 523: };
 524: 
 525: // 복합 룰 — § 7.4.3 문맥 결합 (composite)
 526: type CompositeRiskRule = {
 527:   id: string;
 528:   category: string;
 529:   patternType: "composite";
 530:   operands: SimpleOperand[];   // 결합 대상 단일 패턴 (2개 이상)
 531:   logic: "AND_IN_SENTENCE" | "AND_IN_PARAGRAPH" | "AND_NEAR";
 532:   // - AND_IN_SENTENCE: 같은 문장 내 모두 등장
 533:   // - AND_IN_PARAGRAPH: 같은 단락(빈 줄 분리 기준) 내 모두 등장
 534:   // - AND_NEAR: window 거리 이내 모두 등장
 535:   window?: number;             // logic="AND_NEAR" 시 char 거리. 기본 50. 다른 logic에서는 무시
 536:   severity: "info" | "warning" | "fail" | "content-gate";  // 4종 모두 허용
 537:   scope: ContentScope[];
 538:   requiredApproverRoles?: ApproverRole[];
 539:   suggestion?: string;
 540:   rationale?: string;
 541:   legalBasis?: string[];       // 법령 조문 인용 식별자 — SimpleRiskRule과 동일
 542:   contextExceptions?: ContextException[];
 543:   version: string;
 544:   createdAt: ISODateString;
 545:   updatedAt: ISODateString;
 546: };
 547: 
 548: type SimpleOperand = {
 549:   pattern: string;
 550:   patternType: "regex" | "keyword" | "phrase";
 551: };
 552: 
 553: type RiskRule = SimpleRiskRule | CompositeRiskRule;
 554: 
 555: // 적용 범위 — ID 타입 명시 (자유 문자열 금지)
 556: type ContentScope =
 557:   | { type: "pageType"; pageTypeId: PageTypeId }        // PAGE_TYPES (P-001~P-014, P-101~P-106)
 558:   | { type: "articleType"; articleType: ArticleType }   // DATA_MODEL C-04 enum
 559:   | { type: "block"; blockType: BlockType }              // qa | list | table | callout | citation | media
 560:   | { type: "field"; contractId: ContractId; fieldPath: string }  // ContractId: C-01~C-22. fieldPath: dot notation (예: "summary", "reviewedBy.name")
 561:   | { type: "feature"; featureContentType: FeatureContentTypeId }  // P-106 등 Feature-backed 콘텐츠 전용 룰 (예: featureContentType="feature:self-test")
 562:   | { type: "global" };
 563: 
 564: // 문맥 예외 — § 4.4 안전·주의·행정 문맥
 565: type ContextException = {
 566:   kind: "safety" | "warning-message" | "administrative";  // 의료진 상담 권유·안전 주의·환불 약관 등
 567:   pattern: string;             // 예외 인식 정규식 (예: "(상담하세요|금기|환불 불가)")
 568: };
 569: ```
 570: 
 571: #### 7.4.1 스코프 일치 규칙
 572: 
 573: - `global` 룰은 모든 콘텐츠에 적용
 574: - 여러 scope를 `OR`로 결합 — 1개 이상 일치하면 적용 대상
 575: - pageType 룰과 articleType 룰이 모두 적용되는 경우 — 더 높은 severity 우선
 576: 
 577: #### 7.4.2 severity 우선순위
 578: 
 579: 같은 텍스트 위치가 여러 룰에 매칭되는 경우 다음 우선순위로 최종 severity 결정 (높은 등급이 낮은 등급을 흡수):
 580: 
 581: ```
 582: fail > content-gate > warning > info
 583: ```
 584: 
 585: - 예: "100% 효과"는 `supremacy-001`(단독 어휘 content-gate)과 `guarantee-002`(효과 결합 fail)에 동시 매칭 → 최종 severity는 fail
 586: - Finding[]에는 각 매칭 모두 보존 (감사 추적용). `ComplianceCheckResult`의 집계 결과(`buildBlocked`·`gateRequired`)만 우선순위로 흡수
 587: 
 588: #### 7.4.3 문맥 결합 룰 (composite rules)
 589: 
 590: - 단독 키워드(예: "100%") + 결과·효과·보장 어휘 결합 시 CompositeRiskRule로 표현

codex
# LOCATION_LEGAL code v1.0 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=4 major=8 minor=2 (총 14)
- closeableAfterPatch: false
- 수렴 추세 추적: (이전 cycle 없음 — 본 cycle 이 첫)

## blocking
- **LLC-01**: LL-CASCADE-01 ARCH 변수 화이트리스트 cascade 미반영
  - 위치: `docs/admin/ARCHITECTURE.md:223-230`
  - 근거(plan SoT): `LL-CASCADE-01`, `LL-TEMPLATE-05`, `LL-ACTION-16`
  - 문제: ARCH § 3.8.2 `body` 행은 `clinic.*` 4개 + `location.main.*` 3개만 명시하고, plan v1.0이 acceptance precondition으로 요구한 11개 변수 화이트리스트 reference 및 `policy.contactPerson/contactEmail/contactPhone/effectiveDate`가 없다.
  - 권장 patch: ARCH § 3.8.2에 plan § 5의 11개 whitelist를 그대로 추가하고, policy.* 출처가 ClinicProfile 정책 변수 섹션임을 명시.

- **LLC-02**: LL-CASCADE-02 ADMIN_UI audit matrix cascade 미반영
  - 위치: `docs/decisions/ADMIN_UI_SKELETON_PLAN.md:363-382`
  - 근거(plan SoT): `LL-CASCADE-02`, `LL-ACTION-18/19`
  - 문제: matrix에는 여전히 `content-saved`만 있고 `LocationProfile`, `LegalDocument`, `content-saved-partial`, `content-saved-failed` 행이 없다. 코드 `actions.ts:377-390`은 partial/failed event를 실제 emit하므로 문서 SoT와 구현이 갈라진다.
  - 권장 patch: § 5.5 matrix에 LocationProfile/LegalDocument row와 partial/failed event row, payload shape를 추가.

- **LLC-03**: LL-CASCADE-03 CONTENT_STANDARDS LegalDocument 면제 marker 미반영
  - 위치: `docs/core/CONTENT_STANDARDS.md:444-590` 및 `rg LegalDocument docs/core/CONTENT_STANDARDS.md` 결과 없음
  - 근거(plan SoT): `LL-CASCADE-03`, `LL-TEMPLATE-07`
  - 문제: § 7에 LegalDocument body의 answer-first AST/표현 검사 면제와 변수 whitelist 별도 검증 marker가 없다. acceptance precondition 위배다.
  - 권장 patch: CONTENT_STANDARDS § 7에 ContentType 예외 표를 추가하거나 기존 인터페이스 섹션에 LegalDocument 예외 행을 명시.

- **LLC-04**: LL-CASCADE-05 migrations-runner manifest spec 파일 없음
  - 위치: `packages/migrations-runner/src/index.ts:1-10`, `packages/**/manifest*` 검색 결과 없음
  - 근거(plan SoT): `LL-CASCADE-05`, plan § 10
  - 문제: plan은 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` spec 작성까지 acceptance 차단 조건으로 둔다. 현재 runner는 placeholder export뿐이고 manifest 파일이 없다.
  - 권장 patch: migration dependency 8단계(D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008)를 담은 manifest spec 파일을 추가.

## major
- **LLC-05**: LegalDocument별 effectiveDate override가 본문 렌더링에 반영되지 않음
  - 위치: `apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts:254-282`
  - 근거(plan SoT): `LL-ACTION-10`, `LL-ACTION-16`, render context의 `policy.effectiveDate`는 “LegalDocument 별 override 결과”
  - 문제: `renderCtx.policy.effectiveDate`를 `data.policyEffectiveDate`로 고정한 뒤 `renderTemplate()`을 먼저 호출하고, 그 다음에 override effectiveDate를 계산한다. 결과적으로 DB `effective_date`는 override인데 body 안 `{{policy.effectiveDate}}`는 기본 시행일로 남는다.
  - 권장 patch: docType 루프 내부에서 override 적용 후 doc별 renderCtx를 만들어 렌더링.

- **LLC-06**: LegalDocument upsert conflict target이 partial UNIQUE 결정과 맞지 않음
  - 위치: `apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts:284-313`
  - 근거(plan SoT): `LL-SCHEMA-02`, `LL-ACTION-04`, scenario 17
  - 문제: `ON CONFLICT (instance_id, slug)`만 사용한다. 같은 `document_type` closed 5종이 다른 slug로 이미 있으면 partial unique `(instance_id, document_type)` 위반으로 저장 전체가 실패한다.
  - 권장 patch: `ON CONFLICT (instance_id, document_type) WHERE document_type IN (...) DO UPDATE`로 closed type canonical upsert를 보장.

- **LLC-07**: build-time unknown variable 검증이 build gate에 연결되지 않음
  - 위치: `packages/core-content/src/templates/__tests__.ts:1-7`, `packages/core-content/package.json:11-15`, root `package.json:10-17`
  - 근거(plan SoT): `LL-ACTION-12`, scenario 19
  - 문제: `test:templates` script는 있지만 `pkg:build`, `pkg:typecheck`, `build:all`, `typecheck:all` 어느 곳에서도 실행되지 않는다. “build-time 실패”가 아니라 수동 실행 파일이다.
  - 권장 patch: root build/typecheck 또는 core-content build pipeline에 `pnpm --filter @glitzy/core-content test:templates`를 포함.

- **LLC-08**: businessHours/details a11y 요구 미충족
  - 위치: `ClinicProfileForm.tsx:320-386`, `ClinicProfileForm.tsx:440-455`
  - 근거(plan SoT): `LL-FORM-07`, `LL-FORM-14`
  - 문제: businessHours row는 `aria-labelledby`만 있고 각 input의 `aria-describedby`, 휴진 toggle의 `aria-controls`가 없다. LegalDocument `<summary>`에도 `aria-controls`가 없고 override input에 `aria-labelledby`가 직접 연결되지 않는다.
  - 권장 patch: row input group id/error id를 만들고 checkbox/input/details summary에 plan 요구 ARIA 속성을 연결.

- **LLC-09**: fallback audit payload에 reason 누락
  - 위치: `actions.ts:377-390`
  - 근거(plan SoT): `LL-ACTION-18`
  - 문제: plan은 partial fallback payload에 `reason: <error.code>`를 요구하지만 구현은 `{outcome, emitted, failed}`만 기록한다. 포렌식 원인 추적이 손실된다.
  - 권장 patch: per-row catch에서 code/name/message를 정규화해 `failedDetails[]` 또는 `reason`으로 fallback payload에 포함.

- **LLC-10**: LocationProfile phone DB constraint 없음
  - 위치: `packages/core-content/migrations/C0002_location_profile.sql:17-29`, `schema.ts:106-120`
  - 근거(plan SoT): `LL-FORM-11/12`, 데이터 모델 검증 원칙
  - 문제: form은 전화번호 regex를 검증하지만 DB는 `location_profile.phone`에 CHECK가 없다. RLS tenant 사용자가 직접 SQL 경로로 invalid phone을 저장할 수 있다.
  - 권장 patch: `location_profile_phone_format` CHECK를 추가하고 `errors.ts`에도 매핑.

- **LLC-11**: effective_date DB default Asia/Seoul 결정 미구현
  - 위치: `C0006_legal_document.sql:18`, `actions.ts:7`, `actions.ts:279-282`
  - 근거(plan SoT): `LL-ACTION-07`
  - 문제: 주석은 “DB CURRENT_DATE AT TIME ZONE”이라고 하지만 DB column에는 default가 없고 action은 form 값을 항상 요구한다. default 결정과 구현이 불일치한다.
  - 권장 patch: `effective_date DATE NOT NULL DEFAULT ((CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Seoul')::date)` 또는 plan에서 required input 정책으로 결정 변경.

- **LLC-12**: tenant B 접근 시 실제 HTTP 403 보장 불명확
  - 위치: `page.tsx:123-130`, `page.tsx:223-233`
  - 근거(plan SoT): scenario 15, ADMIN_UI § 8.1 cascade
  - 문제: forbidden/info 분기에서 `<main><p>...</p></main>`을 반환할 뿐 HTTP status 403을 설정하지 않는다. 시나리오가 “403”을 요구한다면 UI 메시지만으로는 부족하다.
  - 권장 patch: forbidden route segment/error boundary 또는 Next response path에서 403 status를 보장하는 패턴을 도입.

## minor
- **LLC-13**: C0008 migration은 기존 row 존재 시 실패 가능
  - 위치: `C0008_location_profile_parent_clinic.sql:7-17`
  - 근거(plan SoT): `LL-SCHEMA-13/14`
  - 문제: nullable column 추가 직후 backfill 없이 `SET NOT NULL`을 실행한다. plan 주석은 “skeleton 단계 row 없음 가정”이지만 실제 환경에 row가 있으면 migration이 중단된다.
  - 권장 patch: 기존 `main` row를 `clinic_profile.slug='clinic'` 기준으로 backfill하거나 preflight fail 메시지를 명시.

- **LLC-14**: Drizzle schema의 composite FK가 deferrable 정보를 표현하지 못함
  - 위치: `schema.ts:120-125`, `C0008_location_profile_parent_clinic.sql:9-13`
  - 근거(plan SoT): `LL-SCHEMA-14`
  - 문제: 실제 migration은 `DEFERRABLE INITIALLY DEFERRED`인데 Drizzle schema에는 non-deferrable FK 형태만 있다. 향후 schema diff/generation 시 FK 특성이 회귀할 수 있다.
  - 권장 patch: schema 주석만이 아니라 migration generation exclusion 또는 raw constraint source marker를 명확히 둔다.

## cascade marker 누락 (있을 경우 blocking)
- `LL-CASCADE-01`: 누락. ARCH § 3.8.2에 11개 변수 whitelist 및 `policy.*` reference 없음.
- `LL-CASCADE-02`: 누락. ADMIN_UI § 5.5 audit matrix에 LocationProfile/LegalDocument/partial/failed rows 없음.
- `LL-CASCADE-03`: 누락. CONTENT_STANDARDS § 7에 LegalDocument 면제 marker 없음.
- `LL-CASCADE-05`: 누락. migrations-runner manifest spec 파일 없음.
- `LL-CASCADE-04`: 존재. `docs/decisions/M0_BUILD_EXPORT_PLAN.md:22-34`에 placeholder 책임 표가 있음.

## acceptance precondition 위배 (LL-CASCADE-01~05) 점검
- LL-CASCADE-01 (ARCH § 3.8.2): 실패 — `policy.*` whitelist reference 없음.
- LL-CASCADE-02 (ADMIN_UI § 5.5): 실패 — audit matrix rows 미반영.
- LL-CASCADE-03 (CONTENT_STANDARDS § 7): 실패 — LegalDocument 면제 marker 없음.
- LL-CASCADE-04 (M0_BUILD_EXPORT_PLAN): 통과 — placeholder 파일과 책임 표 존재.
- LL-CASCADE-05 (migrations-runner): 실패 — manifest spec 파일 없음.
tokens used
151,576
# LOCATION_LEGAL code v1.0 — cycle 1 review

## summary
- 본 cycle 지적 수: blocking=4 major=8 minor=2 (총 14)
- closeableAfterPatch: false
- 수렴 추세 추적: (이전 cycle 없음 — 본 cycle 이 첫)

## blocking
- **LLC-01**: LL-CASCADE-01 ARCH 변수 화이트리스트 cascade 미반영
  - 위치: `docs/admin/ARCHITECTURE.md:223-230`
  - 근거(plan SoT): `LL-CASCADE-01`, `LL-TEMPLATE-05`, `LL-ACTION-16`
  - 문제: ARCH § 3.8.2 `body` 행은 `clinic.*` 4개 + `location.main.*` 3개만 명시하고, plan v1.0이 acceptance precondition으로 요구한 11개 변수 화이트리스트 reference 및 `policy.contactPerson/contactEmail/contactPhone/effectiveDate`가 없다.
  - 권장 patch: ARCH § 3.8.2에 plan § 5의 11개 whitelist를 그대로 추가하고, policy.* 출처가 ClinicProfile 정책 변수 섹션임을 명시.

- **LLC-02**: LL-CASCADE-02 ADMIN_UI audit matrix cascade 미반영
  - 위치: `docs/decisions/ADMIN_UI_SKELETON_PLAN.md:363-382`
  - 근거(plan SoT): `LL-CASCADE-02`, `LL-ACTION-18/19`
  - 문제: matrix에는 여전히 `content-saved`만 있고 `LocationProfile`, `LegalDocument`, `content-saved-partial`, `content-saved-failed` 행이 없다. 코드 `actions.ts:377-390`은 partial/failed event를 실제 emit하므로 문서 SoT와 구현이 갈라진다.
  - 권장 patch: § 5.5 matrix에 LocationProfile/LegalDocument row와 partial/failed event row, payload shape를 추가.

- **LLC-03**: LL-CASCADE-03 CONTENT_STANDARDS LegalDocument 면제 marker 미반영
  - 위치: `docs/core/CONTENT_STANDARDS.md:444-590` 및 `rg LegalDocument docs/core/CONTENT_STANDARDS.md` 결과 없음
  - 근거(plan SoT): `LL-CASCADE-03`, `LL-TEMPLATE-07`
  - 문제: § 7에 LegalDocument body의 answer-first AST/표현 검사 면제와 변수 whitelist 별도 검증 marker가 없다. acceptance precondition 위배다.
  - 권장 patch: CONTENT_STANDARDS § 7에 ContentType 예외 표를 추가하거나 기존 인터페이스 섹션에 LegalDocument 예외 행을 명시.

- **LLC-04**: LL-CASCADE-05 migrations-runner manifest spec 파일 없음
  - 위치: `packages/migrations-runner/src/index.ts:1-10`, `packages/**/manifest*` 검색 결과 없음
  - 근거(plan SoT): `LL-CASCADE-05`, plan § 10
  - 문제: plan은 `packages/migrations-runner/migrations-manifest.json` 또는 `manifest.ts` spec 작성까지 acceptance 차단 조건으로 둔다. 현재 runner는 placeholder export뿐이고 manifest 파일이 없다.
  - 권장 patch: migration dependency 8단계(D0010 → C0001/C0002/C0004/C0005 → C0006 → C0007 → C0008)를 담은 manifest spec 파일을 추가.

## major
- **LLC-05**: LegalDocument별 effectiveDate override가 본문 렌더링에 반영되지 않음
  - 위치: `apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts:254-282`
  - 근거(plan SoT): `LL-ACTION-10`, `LL-ACTION-16`, render context의 `policy.effectiveDate`는 “LegalDocument 별 override 결과”
  - 문제: `renderCtx.policy.effectiveDate`를 `data.policyEffectiveDate`로 고정한 뒤 `renderTemplate()`을 먼저 호출하고, 그 다음에 override effectiveDate를 계산한다. 결과적으로 DB `effective_date`는 override인데 body 안 `{{policy.effectiveDate}}`는 기본 시행일로 남는다.
  - 권장 patch: docType 루프 내부에서 override 적용 후 doc별 renderCtx를 만들어 렌더링.

- **LLC-06**: LegalDocument upsert conflict target이 partial UNIQUE 결정과 맞지 않음
  - 위치: `apps/web/src/app/(admin)/[instanceSlug]/clinic-profile/actions.ts:284-313`
  - 근거(plan SoT): `LL-SCHEMA-02`, `LL-ACTION-04`, scenario 17
  - 문제: `ON CONFLICT (instance_id, slug)`만 사용한다. 같은 `document_type` closed 5종이 다른 slug로 이미 있으면 partial unique `(instance_id, document_type)` 위반으로 저장 전체가 실패한다.
  - 권장 patch: `ON CONFLICT (instance_id, document_type) WHERE document_type IN (...) DO UPDATE`로 closed type canonical upsert를 보장.

- **LLC-07**: build-time unknown variable 검증이 build gate에 연결되지 않음
  - 위치: `packages/core-content/src/templates/__tests__.ts:1-7`, `packages/core-content/package.json:11-15`, root `package.json:10-17`
  - 근거(plan SoT): `LL-ACTION-12`, scenario 19
  - 문제: `test:templates` script는 있지만 `pkg:build`, `pkg:typecheck`, `build:all`, `typecheck:all` 어느 곳에서도 실행되지 않는다. “build-time 실패”가 아니라 수동 실행 파일이다.
  - 권장 patch: root build/typecheck 또는 core-content build pipeline에 `pnpm --filter @glitzy/core-content test:templates`를 포함.

- **LLC-08**: businessHours/details a11y 요구 미충족
  - 위치: `ClinicProfileForm.tsx:320-386`, `ClinicProfileForm.tsx:440-455`
  - 근거(plan SoT): `LL-FORM-07`, `LL-FORM-14`
  - 문제: businessHours row는 `aria-labelledby`만 있고 각 input의 `aria-describedby`, 휴진 toggle의 `aria-controls`가 없다. LegalDocument `<summary>`에도 `aria-controls`가 없고 override input에 `aria-labelledby`가 직접 연결되지 않는다.
  - 권장 patch: row input group id/error id를 만들고 checkbox/input/details summary에 plan 요구 ARIA 속성을 연결.

- **LLC-09**: fallback audit payload에 reason 누락
  - 위치: `actions.ts:377-390`
  - 근거(plan SoT): `LL-ACTION-18`
  - 문제: plan은 partial fallback payload에 `reason: <error.code>`를 요구하지만 구현은 `{outcome, emitted, failed}`만 기록한다. 포렌식 원인 추적이 손실된다.
  - 권장 patch: per-row catch에서 code/name/message를 정규화해 `failedDetails[]` 또는 `reason`으로 fallback payload에 포함.

- **LLC-10**: LocationProfile phone DB constraint 없음
  - 위치: `packages/core-content/migrations/C0002_location_profile.sql:17-29`, `schema.ts:106-120`
  - 근거(plan SoT): `LL-FORM-11/12`, 데이터 모델 검증 원칙
  - 문제: form은 전화번호 regex를 검증하지만 DB는 `location_profile.phone`에 CHECK가 없다. RLS tenant 사용자가 직접 SQL 경로로 invalid phone을 저장할 수 있다.
  - 권장 patch: `location_profile_phone_format` CHECK를 추가하고 `errors.ts`에도 매핑.

- **LLC-11**: effective_date DB default Asia/Seoul 결정 미구현
  - 위치: `C0006_legal_document.sql:18`, `actions.ts:7`, `actions.ts:279-282`
  - 근거(plan SoT): `LL-ACTION-07`
  - 문제: 주석은 “DB CURRENT_DATE AT TIME ZONE”이라고 하지만 DB column에는 default가 없고 action은 form 값을 항상 요구한다. default 결정과 구현이 불일치한다.
  - 권장 patch: `effective_date DATE NOT NULL DEFAULT ((CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Seoul')::date)` 또는 plan에서 required input 정책으로 결정 변경.

- **LLC-12**: tenant B 접근 시 실제 HTTP 403 보장 불명확
  - 위치: `page.tsx:123-130`, `page.tsx:223-233`
  - 근거(plan SoT): scenario 15, ADMIN_UI § 8.1 cascade
  - 문제: forbidden/info 분기에서 `<main><p>...</p></main>`을 반환할 뿐 HTTP status 403을 설정하지 않는다. 시나리오가 “403”을 요구한다면 UI 메시지만으로는 부족하다.
  - 권장 patch: forbidden route segment/error boundary 또는 Next response path에서 403 status를 보장하는 패턴을 도입.

## minor
- **LLC-13**: C0008 migration은 기존 row 존재 시 실패 가능
  - 위치: `C0008_location_profile_parent_clinic.sql:7-17`
  - 근거(plan SoT): `LL-SCHEMA-13/14`
  - 문제: nullable column 추가 직후 backfill 없이 `SET NOT NULL`을 실행한다. plan 주석은 “skeleton 단계 row 없음 가정”이지만 실제 환경에 row가 있으면 migration이 중단된다.
  - 권장 patch: 기존 `main` row를 `clinic_profile.slug='clinic'` 기준으로 backfill하거나 preflight fail 메시지를 명시.

- **LLC-14**: Drizzle schema의 composite FK가 deferrable 정보를 표현하지 못함
  - 위치: `schema.ts:120-125`, `C0008_location_profile_parent_clinic.sql:9-13`
  - 근거(plan SoT): `LL-SCHEMA-14`
  - 문제: 실제 migration은 `DEFERRABLE INITIALLY DEFERRED`인데 Drizzle schema에는 non-deferrable FK 형태만 있다. 향후 schema diff/generation 시 FK 특성이 회귀할 수 있다.
  - 권장 patch: schema 주석만이 아니라 migration generation exclusion 또는 raw constraint source marker를 명확히 둔다.

## cascade marker 누락 (있을 경우 blocking)
- `LL-CASCADE-01`: 누락. ARCH § 3.8.2에 11개 변수 whitelist 및 `policy.*` reference 없음.
- `LL-CASCADE-02`: 누락. ADMIN_UI § 5.5 audit matrix에 LocationProfile/LegalDocument/partial/failed rows 없음.
- `LL-CASCADE-03`: 누락. CONTENT_STANDARDS § 7에 LegalDocument 면제 marker 없음.
- `LL-CASCADE-05`: 누락. migrations-runner manifest spec 파일 없음.
- `LL-CASCADE-04`: 존재. `docs/decisions/M0_BUILD_EXPORT_PLAN.md:22-34`에 placeholder 책임 표가 있음.

## acceptance precondition 위배 (LL-CASCADE-01~05) 점검
- LL-CASCADE-01 (ARCH § 3.8.2): 실패 — `policy.*` whitelist reference 없음.
- LL-CASCADE-02 (ADMIN_UI § 5.5): 실패 — audit matrix rows 미반영.
- LL-CASCADE-03 (CONTENT_STANDARDS § 7): 실패 — LegalDocument 면제 marker 없음.
- LL-CASCADE-04 (M0_BUILD_EXPORT_PLAN): 통과 — placeholder 파일과 책임 표 존재.
- LL-CASCADE-05 (migrations-runner): 실패 — manifest spec 파일 없음.
