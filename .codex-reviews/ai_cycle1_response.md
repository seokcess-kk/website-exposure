{
  "summary": "v0.1은 Feature의 큰 방향은 잡았지만, SoT cascade를 “필요”라고 표시한 뒤 실제 계약·enum·검증 규칙을 닫지 않은 부분이 많아 아직 구현 명세로는 불안정하다. 특히 compliance-assistant `check()` 입력/출력 오용, REVIEW_WORKFLOW 알림·감사 cascade 부재, DATA_MODEL C-08 미반영, promote의 Core 계약 매핑 부실, SNS/크롤링 법무 게이트와 PII 처리 의무가 가장 큰 리스크다.",
  "findings": [
    {
      "id": "F-1",
      "severity": "fail",
      "section": "§ 2.3, § 13.1",
      "location_quote": "assetIngestionConfig: # DATA_MODEL C-08 v0.18\nassetIngestionPolicyVersion: \"ai-2026-05-14\"",
      "issue": "DATA_MODEL C-08에 `assetIngestionConfig`와 `assetIngestionPolicyVersion`이 실제로 cascade되어 있지 않다.",
      "rationale": "현재 `docs/core/DATA_MODEL.md`는 v0.17까지이며 C-08에는 searchVisibilityConfig·keywordMonitoringConfig까지만 존재한다. 대상 문서는 존재하지 않는 v0.18 필드를 SoT처럼 참조하므로 manifest validator와 상위 문서가 불일치한다.",
      "suggested_fix": "DATA_MODEL C-08에 `AssetIngestionConfig`와 `assetIngestionPolicyVersion`을 정식 추가하고, 자격증명·식별자와 Feature config의 경계를 search-visibility/analytics 패턴처럼 명시하라. cascade 전까지는 대상 문서에서 “필수 SoT”가 아니라 “cascade 예정”으로 낮춰야 한다."
    },
    {
      "id": "F-2",
      "severity": "fail",
      "section": "§ 10.1",
      "location_quote": "### 10.1 NotificationEventType (REVIEW_WORKFLOW § 9.1.1 cascade 필요 — 5종)\n| `asset-ingestion-batch-completed` | info | inApp | normal |",
      "issue": "NotificationEventType 5종이 REVIEW_WORKFLOW § 9 enum 및 § 9.1.1 매트릭스에 반영되어 있지 않다.",
      "rationale": "notifications v1.0은 REVIEW_WORKFLOW § 9가 이벤트 enum·페이로드·정책 매트릭스의 SoT라고 못박는다. 대상 문서의 4컬럼 표는 수신자 산정, fallback 채널, digest 주기, quietHoursPolicy, optOutPolicy가 없어 notify() 라우팅 정책을 생성할 수 없다.",
      "suggested_fix": "REVIEW_WORKFLOW § 9 NotificationEventType union에 5종을 추가하고 § 9.1.1 canonical matrix에 전체 컬럼으로 cascade하라. 대상 문서에는 각 이벤트의 `contentRef`, `contentTitle`, `metadata`, `sourceEventId` 산식까지 추가하라."
    },
    {
      "id": "F-3",
      "severity": "major",
      "section": "§ 10.1",
      "location_quote": "| `asset-ingestion-pii-detected` | warning | email + inApp | high |",
      "issue": "`asset-ingestion-pii-detected`의 criticality가 개인정보·의료기관 온보딩 맥락에 비해 낮고, mandatory 여부가 정의되지 않았다.",
      "rationale": "PII 감지는 조치 지연 시 법적·평판 리스크가 크다. REVIEW_WORKFLOW 매트릭스는 criticality와 optOutPolicy가 실제 발송 우선순위와 quiet hours 우회 여부를 결정한다. `high`만 두면 야간 보류·opt-out 허용 여부가 불명확해진다.",
      "suggested_fix": "PII 이벤트는 수신자 `operator + legal`, 즉시 채널 `email + inApp`, fallback `inApp`, criticality `critical` 또는 최소 `high + mandatory`, quietHoursPolicy `bypass` 또는 별도 근거 있는 `respect`로 명시하라."
    },
    {
      "id": "F-4",
      "severity": "fail",
      "section": "§ 4.1, § 7, § 8, § 9.1",
      "location_quote": "9. envelopeState 산정 + audit log\n- PII 감지 시 `asset-ingestion-pii-detected` notifications",
      "issue": "REVIEW_WORKFLOW § 10.2.1 AuditAction cascade가 없다.",
      "rationale": "의뢰 범위의 `asset-ingestion-source-registered/unregistered`, `asset-promoted`, `asset-rejected`, `pii-redacted` 등 감사 액션이 REVIEW_WORKFLOW AuditAction enum에 존재하지 않는다. 대상 문서도 audit metadata shape, actorRole, contentRef를 정의하지 않아 append-only 감사 로그 구현이 불가능하다.",
      "suggested_fix": "REVIEW_WORKFLOW § 10.2.1에 최소 `asset-ingestion-source-registered`, `asset-ingestion-source-unregistered`, `asset-ingestion-asset-promoted`, `asset-ingestion-asset-rejected`, `asset-ingestion-pii-redacted`를 추가하고, 대상 문서에 각 action별 `contentRef`, actor 권한, metadata 필수 필드를 표로 명시하라."
    },
    {
      "id": "F-5",
      "severity": "critical",
      "section": "§ 6.2",
      "location_quote": "compliance-assistant `check()` 호출 → finding[]·inferredRiskLevel·inlineRiskFlags[] 결과를 AssetTag로 변환",
      "issue": "compliance-assistant `check()`의 입력·출력 계약을 잘못 사용한다.",
      "rationale": "SoT인 CONTENT_STANDARDS § 7.1/7.2와 compliance-assistant § 3.3에 따르면 `check(input)`은 `contentType`, `contentRef`, `body`, `metadata`, `riskRules`가 필요하고 출력은 `ComplianceCheckResult`이다. 출력에는 `inferredRiskLevel`·`inlineRiskFlags[]`가 top-level로 정의되어 있지 않다. 이 문장대로 구현하면 타입 불일치 또는 잘못된 태깅이 발생한다.",
      "suggested_fix": "AssetTag 변환 전에 asset을 임시 Feature 콘텐츠로 검사할지, Core 후보 타입별로 검사할지 결정하라. 예: raw asset 검사용이면 `contentType=\"Feature\"`, `featureContentType=\"feature:asset-ingestion\"`, `contentRef=\"asset:{assetId}\"`, `body=ExtractedContent.body`, `metadata`와 `riskRules`를 채워 호출한다. `inferredRiskLevel`·`inlineRiskFlags`는 별도 RiskInference 산출 또는 promote 후보 매핑 결과에서 얻는 것으로 분리하라."
    },
    {
      "id": "F-6",
      "severity": "major",
      "section": "§ 2.2, § 12.1",
      "location_quote": "| `features/compliance-assistant.md` § 3.3 | `check()` (자동 태깅에 룰 매칭 결과 활용 — 옵션) |\n# 3. compliance-assistant·notifications 활성 확인 (권장)",
      "issue": "compliance-assistant를 옵션/권장으로 두면서 의료 콘텐츠 발행 전 자동 검수 필수라고도 말한다.",
      "rationale": "§ 9.2는 수집된 의료 콘텐츠가 발행 전 compliance-assistant 자동 검수 필수라고 한다. 또한 DATA_MODEL에는 의료기관 인스턴스에서 compliance-assistant 비활성 시 예외 승인 필드가 존재한다. 그런데 대상 문서는 의존성을 권장 또는 옵션으로 낮춰 build fail 조건과 예외 승인 경로를 닫지 않았다.",
      "suggested_fix": "의료기관 인스턴스에서 asset-ingestion 활성 시 `compliance-assistant` 활성 또는 `complianceAssistantExemptApproval` 필수를 build-time fail로 추가하라. 자동 태깅 자체는 옵션이어도 promote 후 REVIEW_WORKFLOW 진입 시 compliance check는 필수로 분리하라."
    },
    {
      "id": "F-7",
      "severity": "critical",
      "section": "§ 8, § 13.2",
      "location_quote": "promoteAsset(assetId, targetContentType: \"Article\" | \"TreatmentPage\" | ..., targetMapping: {\n  title?: string,\n  body?: string,",
      "issue": "promote 매핑이 Core 데이터 계약과 호환되지 않는다.",
      "rationale": "Article은 `headline`, `summary`, `body`, `author`, `datePublished`, `dateModified`, `articleType`, `contentFormat`, `category`, `pageRiskLevel` 등이 필요하다. TreatmentPage도 `@id`, `name`, `summary`, `overview`, `mechanism`, `targetAudience`, `process`, `precautions`, `pageRiskLevel` 등 필수 필드가 많다. `title?: string` 같은 임의 필드는 Core 계약에 없고 필수 필드 누락 시 build/runtime fail 조건도 없다.",
      "suggested_fix": "`targetContentType`별 `TargetMapping` 타입을 닫힌 union으로 정의하고 DATA_MODEL C-01~C-22 필수 필드 검증을 build/runtime fail로 추가하라. Article은 `headline`, TreatmentPage는 `name` 등 실제 필드명만 허용하고 unknown field는 fail 처리하라."
    },
    {
      "id": "F-8",
      "severity": "major",
      "section": "§ 8",
      "location_quote": "- 결과: Core 데이터 계약 row 생성 (예: Article row) + AssetPromotionRecord 기록\n- promote 후 콘텐츠는 일반 REVIEW_WORKFLOW 진입",
      "issue": "promote 후 REVIEW_WORKFLOW 진입 지점과 ComplianceRecord 생성 규칙이 불명확하다.",
      "rationale": "REVIEW_WORKFLOW는 contentRef와 ComplianceRecord(pre-publish)를 중심으로 상태 전이를 관리한다. 대상 문서는 Core row 생성 뒤 어떤 workflow state로 생성되는지, `ComplianceRecord.contentType/contentRef/pageRiskLevel/articleType/inlineRiskFlags/autoCheckResult`를 누가 언제 채우는지 정의하지 않는다.",
      "suggested_fix": "promote 결과를 `draft` 또는 `review-queued` 중 하나로 고정하고, promote transaction에서 Core row + AssetPromotionRecord를 만든 뒤 compliance-assistant check 결과로 C-10 pre-publish ComplianceRecord를 생성/갱신하는 순서를 명시하라."
    },
    {
      "id": "F-9",
      "severity": "major",
      "section": "§ 2.3, § 7, § 13.1",
      "location_quote": "autoApproveRiskLevel: null # null | \"Low\" — Low는 자동 promote 가능. v1.0 기본 null\n- `mode=\"auto-promote\"` (v1.0 미지원)",
      "issue": "`autoApproveRiskLevel`, `auto-promote`, `autoMappingEnabled`의 의미가 섞여 있다.",
      "rationale": "§ 7은 `autoApproveRiskLevel=\"Low\"`가 자동 approved라고 하고, § 2.3 주석은 Low가 자동 promote 가능하다고 한다. 하지만 § 13.1은 `mode=\"auto-promote\"`와 `autoMappingEnabled=true`를 v1.0 build fail로 둔다. Low 자동 승인과 자동 promote가 분리되지 않아 v1.0 안전 기본값이 우회될 수 있다.",
      "suggested_fix": "v1.0에서는 `mode`를 `staged`만 허용하고 `review.autoApproveRiskLevel !== null`도 build fail로 추가하라. v1.x에서는 `auto-approve`와 `auto-promote`를 별도 플래그/모드로 분리하고, 자동 promote는 자동 매핑 검증 통과 후에만 허용하라."
    },
    {
      "id": "F-10",
      "severity": "major",
      "section": "§ 5.1, § 13.1",
      "location_quote": "approvedScope (SerpCrawlerApprovedScope 재사용 + asset-ingestion 추가 fields: `allowedDomains[]`·`maxPagesPerCrawl`·`maxAssetSizeMb`)",
      "issue": "SerpCrawlerApprovedScope 재사용 방식이 DATA_MODEL의 실제 타입과 맞지 않는다.",
      "rationale": "DATA_MODEL C-08의 SerpCrawlerApprovedScope는 `searchEngines`, `locales`, `devices`, `geo`, `allowLoginState`, `allowCaptchaBypass`, `artifactRetentionDaysMax`, `allowedPaths`를 가진 SERP용 타입이다. asset-ingestion은 도메인·페이지 수·asset 크기 제한이 핵심인데 이를 “추가 fields”라고만 해두고 C-08 타입 확장을 cascade하지 않았다.",
      "suggested_fix": "`AssetCrawlerApprovedScope extends SerpCrawlerApprovedScope`로 둘 것인지, 별도 `AssetIngestionApprovedScope`를 만들 것인지 결정하라. 웹사이트 크롤링에는 `allowedDomains[]`, `allowedPathPrefixes[]`, `maxPagesPerCrawl`, `maxAssetSizeMb`, `artifactRetentionDaysMax`, `allowLoginState=false`, `allowCaptchaBypass=false`를 정식 필드로 정의하라."
    },
    {
      "id": "F-11",
      "severity": "high",
      "section": "§ 5.1, § 13.1",
      "location_quote": "`webCrawl.enabled=true` + `approvedScope.artifactRetentionDaysMax` < `retentionDays.ingestedAssetRaw`",
      "issue": "`webCrawl.enabled=true`일 때 `approvedScope` 자체 누락을 build fail로 명시하지 않았다.",
      "rationale": "search-visibility는 `serpCrawler.enabled=true` + `approvedScope` 누락을 별도 build fail로 둔다. 대상 문서는 approvedScope가 null인 예시를 보여주면서 누락 fail은 없고 retention 비교만 둔다. null 상태에서 비교가 불가능하고 법무 승인 범위 밖 실행을 사전에 차단하지 못한다.",
      "suggested_fix": "`webCrawl.enabled=true` + `approvedScope` 누락, `allowedDomains[]` 빈 배열, `targetDomains`와 `approvedScope.allowedDomains` 불일치, `allowCaptchaBypass=true`를 모두 build-time fail로 추가하라."
    },
    {
      "id": "F-12",
      "severity": "high",
      "section": "§ 5.2, § 13.1",
      "location_quote": "- 각 platform ToS 준수 (운영자 책임 — AI-01)\n- `snsApi.<platform>.enabled=true` + `apiKeySecretRef`·`blogId`/`accountId` 누락",
      "issue": "SNS API는 요약에서 법무 승인 게이트 필수라고 했지만 실제 게이트는 없다.",
      "rationale": "§ 0은 web-crawl·sns-api 법무 승인 게이트 필수라고 한다. 그러나 § 5.2와 § 13.1은 SNS에 대해 API credential만 검증하고 platform별 ToS·계정 소유·콘텐츠 사용 동의·수집 범위 승인 필드를 요구하지 않는다.",
      "suggested_fix": "`snsApi.<platform>.legalApproved`, `legalApprovedBy`, `legalApprovedAt`, `approvedAccountIds[]`, `allowedContentTypes[]`, `consentEvidenceRef`를 추가하고 enabled=true 시 누락 build fail로 닫아라. AI-01은 책임 분리 미결정으로 남기더라도 v1.0 실행 게이트는 필요하다."
    },
    {
      "id": "F-13",
      "severity": "major",
      "section": "§ 9.1",
      "location_quote": "- regex 기반 탐지 (보수적 — false-positive 허용. 운영자 검수에서 확정)",
      "issue": "rrn(주민등록번호) 탐지·마스킹 계약이 구현 가능할 만큼 구체적이지 않다.",
      "rationale": "한국 RRN은 단순 숫자 패턴만으로는 오탐이 많고, 7번째 자리·생년월일·체크섬 등 검증 단계를 둬야 한다. 또한 원본 blob, ExtractedContent, redacted view 중 어디에 어떤 형태로 남는지 불명확하다.",
      "suggested_fix": "RRN 탐지는 `\\b\\d{6}-?[1-8]\\d{6}\\b` 후보 추출 + 생년월일 유효성 + checksum 검증 여부를 명시하고, 저장 정책을 `rawBlobEncryptedOnly`, `redactedTextForReview`, `piiFindings[]`로 분리하라. 마스킹 예시는 `######-*******`처럼 RRN 전용으로 제시하라."
    },
    {
      "id": "F-14",
      "severity": "major",
      "section": "§ 9.1, § 16.5",
      "location_quote": "| `piiDetected` | boolean | ✅ |\n| `piiRedacted` | boolean | ✅ |",
      "issue": "PII 발견 내역의 구조화 저장 모델이 없다.",
      "rationale": "boolean만으로는 어떤 PII 타입이 어디서 얼마나 발견됐고 어떤 redaction이 적용됐는지 감사·검수·재처리가 불가능하다. 특히 RRN·의료 관련 개인정보는 운영자가 확인한 false positive/true positive 기록이 필요하다.",
      "suggested_fix": "`AssetPiiFinding` 또는 `ExtractedContent.piiFindings[]`를 추가하라. 필드는 `type`, `offsetStart`, `offsetEnd`, `detector`, `confidence`, `redactionApplied`, `reviewStatus`, `reviewedBy`, `reviewedAt` 등을 포함해야 한다."
    },
    {
      "id": "F-15",
      "severity": "major",
      "section": "§ 9.2",
      "location_quote": "- 수집된 의료 콘텐츠는 발행 전 compliance-assistant 자동 검수 필수\n- 외부 사이트 콘텐츠 인용 시 저작권 검토 (운영자 책임 — AI-02)",
      "issue": "의료광고법 검수와 저작권/SNS 동의가 promote 게이트에 연결되어 있지 않다.",
      "rationale": "MEDICAL_AD_COMPLIANCE_COMMON은 환자 후기·전후사진·SNS 매체·사전심의·동의서가 발행 가능성을 직접 좌우한다고 본다. 대상 문서는 이를 주의사항으로만 두고 `promoteAsset` 또는 REVIEW_WORKFLOW에서 차단 조건으로 쓰지 않는다.",
      "suggested_fix": "asset review 단계에 `legalUsageStatus` 또는 `rightsReviewStatus`를 추가하고, 외부 URL/SNS/환자 후기/전후사진 감지 시 `requiredApproverRoles=[\"legal\"]` 또는 promote block을 명시하라. 동의·저작권 증빙은 ComplianceRecord.attachments 또는 AssetReviewRecord evidence 필드와 연결하라."
    },
    {
      "id": "F-16",
      "severity": "major",
      "section": "§ 0, § 1.3",
      "location_quote": "- **vs content-migration**: 본 Feature는 **외부 raw 자료 수집·정형화**. content-migration은 **기존 솔루션 내 콘텐츠를 새 인스턴스로 이전**",
      "issue": "content-migration과의 경계가 상위 ARCHITECTURE 정의와 충돌한다.",
      "rationale": "ARCHITECTURE는 content-migration을 “기존 사이트·블로그·카페 콘텐츠를 솔루션 데이터 모델로 이관”으로 설명한다. asset-ingestion도 기존 사이트·SNS·블로그를 수집해 Core 데이터 계약으로 promote하므로 책임이 겹친다.",
      "suggested_fix": "경계를 결과 책임 기준으로 다시 정의하라. 예: asset-ingestion은 raw asset 수집·파싱·태깅·검수 큐까지, content-migration은 대량 이관 계획·URL 리다이렉트·slug 보존·Core 콘텐츠 생성·검수 이력 승계까지. 또는 promote를 asset-ingestion에 남긴다면 content-migration은 내부 솔루션 간 데이터 이전으로 ARCHITECTURE를 cascade 정정하라."
    },
    {
      "id": "F-17",
      "severity": "major",
      "section": "§ 4.2, § 14",
      "location_quote": "`contentHash = SHA-256(canonical 본문)` — IngestedAsset.contentHash UNIQUE(instanceId, contentHash)\n| AI-07 | duplicate 감지 — exact hash 외 fuzzy matching | M2+ |",
      "issue": "exact hash만 v1.0 범위로 둔 것은 가능하지만 canonical 본문 정의가 없어 UNIQUE 안정성이 낮다.",
      "rationale": "HTML boilerplate, tracking parameter, whitespace, OCR 변동, SNS embed metadata가 조금만 바뀌어도 SHA-256이 달라진다. 반대로 서로 다른 source의 동일 문구가 같은 hash가 되어 source별 provenance를 잃을 수 있다.",
      "suggested_fix": "v1.0 exact hash를 유지하되 canonicalization 알고리즘을 정의하라. 최소 `normalizedTextHash`, `rawBlobHash`, `sourceCanonicalKey`를 분리하고 UNIQUE 정책을 `(instanceId, normalizedTextHash)`로 둘지 `(instanceId, sourceId, sourceCanonicalKey)`로 둘지 명확히 하라. fuzzy matching은 AI-07로 유지하되 warning metric으로 분리하라."
    },
    {
      "id": "F-18",
      "severity": "major",
      "section": "§ 10.2, § 16.9",
      "location_quote": "search-visibility § 7.2·keyword-monitoring § 6.2 동일 (SKIP LOCKED·attempts<5·permanent 전이).\n### 16.9 `AssetIngestionNotificationOutbox`",
      "issue": "outbox 테이블 계약이 이름만 있고 sourceKind/sourceId/eventType UNIQUE 및 notify 호출 매핑이 없다.",
      "rationale": "keyword-monitoring은 outbox `sourceKind/sourceId/eventType` 일반화와 UNIQUE를 명시한다. asset-ingestion은 outbox enqueue 대상 이벤트가 batch/source/asset/PII 중 무엇인지 정하지 않아 중복 발송과 재처리 idempotency가 깨질 수 있다.",
      "suggested_fix": "`AssetIngestionNotificationOutbox` 필드와 constraints를 § 16.9에 풀어라. 최소 `sourceKind`, `sourceId`, `eventType`, `payloadJson`, `claim`, `attempts`, `nextAttemptAt`, `notificationEventId`, `UNIQUE(sourceKind, sourceId, eventType)`가 필요하다."
    },
    {
      "id": "F-19",
      "severity": "major",
      "section": "§ 2.3, § 16.10",
      "location_quote": "blobStorage:\n  bucket: \"glitzy-ai-assets\"\nobject key format: `{keyPrefix}{instanceId}/{YYYY-MM-DD}/{assetId}.{ext}` — search-visibility § 13.7 IAM 패턴 재사용.",
      "issue": "blob storage IAM 재사용이 선언뿐이고 asset-ingestion 특화 접근 권한이 없다.",
      "rationale": "asset-ingestion blob은 PII·저작권 자료를 포함할 수 있어 search-visibility artifact보다 민감하다. 단순 IAM 패턴 재사용만으로는 cross-instance 차단, signed URL 발급 권한, redacted/raw 접근 분리, retention 삭제 권한이 정의되지 않는다.",
      "suggested_fix": "search-visibility § 13.7 수준으로 canonical key, PrincipalTag 조건, raw/redacted prefix 분리, signed URL TTL, reviewer 권한, deletion/retention worker 권한을 명시하라."
    },
    {
      "id": "F-20",
      "severity": "minor",
      "section": "§ 0, § 16",
      "location_quote": "- source type 4종: `web-crawl`·`sns-api`·`manual-upload`·`csv-import`\n## 16. 본 Feature 내부 데이터 구조 (admin DB 10 tables + blob storage)",
      "issue": "§ 0 한 페이지 요약과 § 16 인벤토리가 모델 수준에서 완전히 대응되지 않는다.",
      "rationale": "§ 0은 수집·파싱·태깅·검수·promote·PII·outbox까지 말하지만 § 16에는 PII finding, source credential/consent evidence, audit linkage, promote target validation 결과 같은 핵심 테이블/필드가 없다. 10 tables라는 숫자가 기능 책임을 과소 표현한다.",
      "suggested_fix": "§ 16 인벤토리를 실제 책임 기준으로 재산정하라. PII finding/evidence를 별도 테이블로 둘지 JSON 필드로 둘지 결정하고, § 0 요약의 책임마다 저장 위치를 1:1로 연결하라."
    },
    {
      "id": "F-21",
      "severity": "minor",
      "section": "§ 11.1",
      "location_quote": "| outbox 발송 성공율 | > 99% | |",
      "issue": "운영 지표 표의 컬럼 정합이 깨져 있다.",
      "rationale": "앞선 행들은 `지표 | 정의 | 목표` 구조인데 해당 행은 정의 칸에 목표가 들어가고 목표 칸이 비어 있다. 작은 오류지만 v0.1 명세 품질 신뢰를 낮춘다.",
      "suggested_fix": "`outbox 발송 성공율 | dispatched / enqueue 대상 | > 99%`처럼 정의와 목표를 분리하라."
    },
    {
      "id": "F-22",
      "severity": "minor",
      "section": "§ 1.1",
      "location_quote": "| source type 추가/제거 | MINOR / **MAJOR** | 별개 | C-08 cascade |\n| 운영 모드 변경 (staged ↔ auto-promote) | **MAJOR** | 별개 | |",
      "issue": "변경 정책이 다른 절의 build fail 및 v1.x 계획과 연결되지 않는다.",
      "rationale": "`auto-promote`는 v1.0 미지원으로 build fail인데 변경 정책은 staged ↔ auto-promote 변경을 단순 MAJOR로만 둔다. source type 추가도 C-08, IngestionSource enum, adapter contract, notification/audit 영향이 같이 발생한다.",
      "suggested_fix": "§ 1.1에 cascade 대상 컬럼을 구체화하라. 운영 모드 추가는 Feature SemVer MAJOR + DATA_MODEL C-08 config schema + REVIEW_WORKFLOW/audit 영향 검토로 명시하고, source type 추가는 IngestionSource enum·adapter result·legal gate·build validation 동시 변경으로 적어라."
    }
  ]
}