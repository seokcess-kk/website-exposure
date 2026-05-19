# compliance-assistant Phase Alpha plan (v1.0·acceptance·2026-05-19)

> **상태**: **v1.0 (acceptance)** — Codex 자동 비평 **7 cycle 54 finding 전건 수용** · cycle 7 0 finding 확정 acceptance · `ready_for_acceptance=true` · `recommendation: "acceptance 권장"`. 모든 acceptance precondition PASS (27 SoT 슬롯 + 27 활성 canonical 룰 · 5 inlineRiskFlags · RiskInference evaluatedSteps/contributingSteps · contextExceptions · High triggeredBy · CA-DEFER 5+12 신설 · CA-CASCADE 9종). 수렴 추세 36 → 11 → 3 → 2 → 1 → 1 → **0**. M0 stub `check()` → 실 9단계 빌드 파이프라인 + CA-DEFER-01·02·11·15 + EC-DEFER-05 5종 해소. Code cycle 분리 (별 cycle 안 compliance-assistant Phase Alpha code v1.0).

> **acceptance commit 구성** (M0_PLAN v1.0 패턴 정합) — 본 commit 안 docs cascade 동시 포함 marker: (1) 본 plan v1.0 · (2) CA-CASCADE-09 cascade (`docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` § 9.4 CA-DEFER-17·18·19·20·21·22·29·30·31·32·33·34 12종 신설 + CA-CASCADE-09 marker 신설 — cycle 2 안 실 patch 완료). 실 코드 cascade (data/compliance-rules/ 6 YAML + 1 schema.json · packages/compliance-rules/ 신규 + apps/web/src/lib/compliance/check.ts 재작성 + auto-gate.ts 신규 + action-errors.ts 신규 + C0017/C0018 migration + Drizzle schema v0.6 + manifest 21단계 · 7 docs cascade RISK_LEVELS § 3.3·§ 3.4.1·§ 2.3.1 + compliance-assistant § 4.3 + EAT_CONTENT_PLAN § 11 + REVIEW_WORKFLOW § 3·§ 3.3 + CONTENT_STANDARDS § 7.1·§ 7.2 + MEDICAL_AD_COMPLIANCE_COMMON § 3 + manifest)는 별 cycle (compliance-assistant Phase Alpha code v1.0).

> **scope marker** — **CA-DEFER-01 부분 해소** (CAP-01 정정 — KSS Phase Beta defer 안 composite/contextExceptions 정확도 한계 명시) · CA-DEFER-02 (RiskInference 자동 추론) · EC-DEFER-05 (FAQ 자동 검수 + RiskRule + RiskInference 통합 — FAQ workflow path 한정) · CA-DEFER-11 (autoCheckResult.findings 풀명세 영속) · CA-DEFER-15 (content-gate 자동 큐 진입 — `submitForReview` 트리거 한정 부분 해소). 캐시 (CA-DEFER-04) · LLM (CA-DEFER-03) · warning 큐 (CA-DEFER-05) · stale (CA-DEFER-06) · request-changes (CA-DEFER-07) 는 Phase Beta 합류. CA-DEFER-18 (P-006 slot 격상) · CA-DEFER-19 (의료법 개정 실 추적) · CA-DEFER-20 (field scope fieldPath 단위 매칭) · CA-DEFER-21 (block scope qa 외 5종) · CA-DEFER-22 (KSS v3+ 합류) 신설.

## SoT

- `docs/features/compliance-assistant.md` v1.0 — Feature spec 본 plan 의 구현 대상.
  - § 3 check() 단일 엔트리포인트
  - § 4.1 빌드 파이프라인 9단계 (룰 카탈로그 로드 → 매칭 → contextExceptions → inlineRiskFlags → RiskInference → High 가상 finding → 집계)
  - § 4.3 composite 평가 알고리즘 (KSS v3+ — Phase Alpha v0.1 안 fallback 정규식 만 · CA-DEFER-22)
  - § 4.4 contextExceptions 적용 알고리즘 (RISK_LEVELS § 3.4.3 "같은 위치" SoT — CAP-17 정정)
  - § 6 RiskInference 통합
  - § 7 룰 카탈로그 로드 순서·머지
- `docs/compliance/RISK_LEVELS.md` v1.2 — § 2 RiskInference (MAX 결합 + steps[] 추적) · § 3 RiskRule 데이터 파일 (6 YAML + JSON Schema 검증 표) · § 5 inlineRiskFlags 5종 추출 (5.1 알고리즘 + 5.1.1 카테고리 SoT + 5.1.2 false-positive 완화) · § 6 위험도 자동 동작 매트릭스 · § 7.1 의료법 개정 추적
- `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` v1.0 — § 3.0 canonical RiskRule + legalBasis[] 패턴 · § 3.1~3.14 의료법 제56조제2항 각 호 → RiskRule.id 매핑 + medical-law-tracking SoT revision (CAP-27 정정)
- `docs/core/CONTENT_STANDARDS.md` v1.3 — § 4.1 금지 표현 카탈로그 (rules.core.yaml 표현 SoT — CAP-28 정정) · § 4.4 문맥 예외 카탈로그 · § 7.1 ComplianceCheckInput · § 7.1.1.1 LegalDocument 면제 · § 7.1.1.2 Publication/MediaAppearance/FAQ 예외 매트릭스 · § 7.2 ComplianceCheckResult · § 7.4 RiskRule 스키마
- `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` v1.0 — Phase Alpha 가 대체하는 M0 stub 위치 (`apps/web/src/lib/compliance/check.ts`). CA-DEFER 13~16 marker
- `docs/decisions/EAT_CONTENT_PLAN.md` v1.0 — EC-DEFER-05 해소 (FAQ workflow path 한정) · EC-DEFER-12 부분 해소 (FAQ 만 — Publication/MediaAppearance 잔여)
- `docs/admin/REVIEW_WORKFLOW.md` — § 3 큐 3종 (manual-review · content-gate · warning) 안 **content-gate 큐 활성화** · § 3.3 priority·SLA 표 (CAP-33 정정) · § 6.2 stale 처리는 Phase Beta · § 9.1.1 알림 정책
- `docs/core/PAGE_TYPES.md` § 3 P-006 — slot 격상 조건 SoT (Phase Alpha 안 미구현 · CA-DEFER-18)
- 실 코드 — `apps/web/src/lib/compliance/{check,types,risk,server-actions,final-roles}.ts` · `apps/web/src/lib/eat-content-schema.ts` (CAP-31 정정) · `apps/web/src/components/forms/FaqForm.tsx` (이미 status field 제거됨 — CAP-08 정정)
- `packages/core-content/migrations/C0015_review_queue_entry.sql` (실 UNIQUE constraint 확인 — CAP-10 정정)
- `packages/core-content/migrations/C0016_status_unlock.sql` (FAQ DB CHECK 이미 해제 + sentinel backfill guard — CAP-32 정정)
- `packages/core-content/migrations/C0004_treatment_page.sql` (실 schema body_markdown 단일 필드 — CAP-09 정정)

> **표기 규칙 (M0_PLAN 계승)**: SQL/DB 컬럼 = snake_case · TypeScript 코드 = camelCase · 문서 본문 내 SoT 인용은 snake_case 우선.

---

## 1. 목적과 범위

### 1.1 목적 (CAP-07 정정)

- **CA-DEFER-01 부분 해소** (CAP-01 정정): M0 stub `check()` → **실 9단계 빌드 파이프라인** (compliance-assistant § 4.1). 룰 카탈로그 6 YAML + 1 schema.json 로드 + Ajv 검증 + RiskRule 매칭 + contextExceptions + composite (KSS fallback 정규식 만 — CA-DEFER-22 안 KSS v3+ 합류) + inlineRiskFlags 추출 + RiskInference + High 가상 finding + 집계. **잔여**: composite/contextExceptions 의 KSS 기준 "같은 문장" 정확도는 fallback 한계 — § 6.5 명세.
- **CA-DEFER-02 해소**: RiskInference 자동 추론 알고리즘 — pageType·articleType·slot·inlineRiskFlags·explicitRiskLevel MAX 결합 (RISK_LEVELS § 2.3). M0 stub 은 입력 MAX 만 처리. **slotMatches 입력은 v0.1 안 항상 빈 배열** — CA-DEFER-18 (P-006 slot 격상 Phase Beta 합류) cascade.
- **EC-DEFER-05 해소** (CAP-08 정정): FAQ 자동 검수 — RiskRule + RiskInference 적용. **FaqForm zod schema 변경 없음** (이미 compliance workflow integration v1.0 안 status field 제거 완료 · CWI-01 정합). 실 unlock 위치 = `apps/web/src/lib/eat-content-schema.ts` 안 FAQ status field 가 form schema 안 부재이므로 별도 zod patch 불필요. compliance check + status transition 은 **workflow action / publish path** 안 (submitForReview · approveContent · publishContent) 안 자동 호출.
- **CA-DEFER-11 해소**: `autoCheckResult.findings[]` 풀명세 영속 — M0 stub 은 빈 배열 또는 가상 finding 1개만. Phase Alpha 는 실 룰 매칭 결과 (각 finding `ruleId`·`category`·`pattern`·`severity`·`location`·`suggestion`·`requiredApproverRoles[]`·`triggeredBy`·`legalBasis[]`) 모두 `compliance_record.auto_check_result` 안 저장. **위치 통일** (CAP-18 정정): `auto_check_result.extensions.suppressedByContextExceptions[]` 단일 경로 (envelope 안은 별도 영역으로 분리 — § 14.1).
- **CA-DEFER-15 부분 해소** (CAP-07 정정): `gateRequired=true` + `automatedDecision !== 'block'` (CAP-06 정정) 인 경우 — **자동 큐 진입** (`review_queue_entry.queue_type='content-gate'`). **트리거 범위** = **`submitForReview` action 진입 시 만** (Phase Alpha). `saveArticle` 등 entity save 안 자동 호출 부재 — 운영자 명시 submit 시점 자동 enqueue + 빌드 시점 자동 큐 는 Phase Beta defer.
- **MEDICAL_AD_COMPLIANCE_COMMON § 3 룰 SoT 예시 ID → canonical 매핑** (CAP-04 정정): § 3.1~3.14 각 호의 SoT 예시 ID 17종 → § 2.3 안 "생성 / canonical 흡수 / 의도적 제외" 표 매핑. 흡수 시 대체 ruleId + legalBasis 명시.
- **운영 가설**: 자동 룰 + RiskInference 가 정확히 동작하면 (a) manual-review 큐 부담 감소 + (b) content-gate 큐 신뢰성 확보 + (c) FAQ 발행 정상화. composite/contextExceptions 정확도는 KSS fallback 한계로 운영 누적 후 강화.

### 1.2 범위 (포함) (CAP-36 정정 — CA-CASCADE-01~09 전체 명시)

| 항목 | 비고 |
|---|---|
| `data/compliance-rules/` **데이터 YAML 6개 + schema.json 1개** (CAP-02 정정 · CA-CASCADE-01) | `meta.yaml` · `rules.core.yaml` · `rules.medical-ad.yaml` · `context-exceptions.yaml` · `medical-law-tracking.yaml` · `slot-matches.yaml` (v0.0 placeholder — CAP-09 정정) · `schema.json`. preset 파일은 본 cycle 미포함 (§ 11 preset 부재 정책 · CA-DEFER-17) |
| RuleCatalog 로더 + JSON Schema 검증 (CA-LOADER-01) | `packages/compliance-rules/` 신규 패키지. Ajv (JSON Schema Draft-07) 검증. fail 시 throw. **field/block/feature scope 안 v0.1 미지원 룰은 loader skip+warning** (CAP-23 정정 — fail 보다 skip 권장) |
| RiskRule 매칭 엔진 (CA-MATCHER-01) | regex/keyword/phrase/composite patternType 매칭. scope 일치 (global/pageType/articleType). Finding 산출 — `ruleId`·`category`·`pattern`·`severity`·`location`·`suggestion`·`requiredApproverRoles`·`triggeredBy="static-rule"`·`legalBasis[]`. severity 우선순위 (fail > content-gate > warning > info) **집계만 적용** — Finding[] 안 보존 |
| **qa block scope Phase Alpha 부분 포함** (CAP-24 정정) | FAQ 자동 검수 정합 위해 `qa` block scope 만 v0.1 안 활성. matcher 안 `qa` 블록 metadata (question/answer 분리) 전달. 나머지 5종 (list/table/callout/citation/media) CA-DEFER-21 Phase Beta |
| composite 평가 알고리즘 + KSS fallback (CA-COMPOSITE-01 · CAP-01 정정) | AND_IN_SENTENCE (정규식 fallback · KSS Phase Beta CA-DEFER-22) · AND_IN_PARAGRAPH (빈 줄 분리) · AND_NEAR (window 거리). **NOT_IN_PARAGRAPH (negative operand) logic 은 schema 안 미정의** — `side-effect-missing-001` (§ 3.7) 는 Phase Beta defer (CAP-30 정정) |
| contextExceptions 적용 (CA-EXCEPTION-01 · CAP-17 정정) | OR 결합 (compliance-assistant § 4.4). **finding span 과 ContextException.pattern span overlap 또는 같은 문장 안 인접 (KSS fallback 시 정규식 분리 한계 명시)**. **`fail` composite 룰은 예외 미적용** (안전 보장). 적용 대상 = `전문성 단정 (단독 어휘)` 카테고리 등 단독 어휘 룰 한정. audit 보존 = `auto_check_result.extensions.suppressedByContextExceptions[]` 통일 위치 |
| inlineRiskFlags 추출 5종 (CA-FLAG-01) | RISK_LEVELS § 5.1 표. `includes-effect-claim` = § 4 RiskRule 매칭 category **SoT 7 문자열 정확 매칭** (CAP-05 정정). 나머지 4종 = 본문 정규식/어휘 (CAP-21 정정 — SoT regex 전건) + 부가 입력 (`ReviewPolicy.beforeAfterPhotoAllowed` · 후기 미디어 첨부). `includes-testimonial` = `testimonial-001` finding category 기반 추출 (CAP-20 정정 — 별도 composite matcher 없음). 5.1.2 컨텍스트별 false-positive 완화 = LocationProfile · Article articleType=notice 만 실 적용 (LegalDocument 완화 표는 dead code — check() 진입 차단되므로 — CAP-22 정정) |
| RiskInference 자동 추론 (CA-INFER-01) | RISK_LEVELS § 2.3 알고리즘 그대로. `RiskInferenceResult.steps[]` = **`evaluatedSteps[]` (모든 source evaluation) + `contributingSteps[]` (base 갱신 source) 분리** (CAP-12 정정). `triggeredBy` 판정 = `if explicit === 'High' return 'explicit'` 최우선 (CAP-13 정정) |
| High 가상 finding 주입 (CA-VIRTUAL-01) | 최종 `inferredRiskLevel === "High"` 시 — `ruleId="risk-level-high-gate"` · `category="위험도 강제 검수"` · `severity="content-gate"` · `requiredApproverRoles` ArticleType 별 override (RISK_LEVELS § 6.2) |
| pageMeta 기반 pageTypeId 자동 유도 (CA-PAGEMETA-01) | `metadata.pageTypeId` 미지정 시 `contentType` 매핑. 유도 불가 시 throw `ComplianceConfigError` |
| **`metadata.inferredRiskLevel` 외부 입력 처리** (CAP-11 정정) | compliance-assistant § 3.3 정합 — **항상 내부 재계산** + **외부 입력과 MAX 결합**. 불일치 시 `auto_check_result.extensions.inferredRiskLevelMismatch` 안 외부값/내부값/최종값 audit 보존 (운영자 모니터링). 외부 입력 신뢰 skip 모드는 본 cycle 미합류 (성능 최적화 Phase Beta) |
| `meta.yaml` catalogVersion + **catalogHash (데이터 파일 hash 한정)** (CAP-26 정정 · CA-VERSION-01) | `catalogVersion` = meta.yaml `catalogVersion` 필드. `catalogHash` = **6 YAML 파일 (rules.core·rules.medical-ad·context-exceptions·medical-law-tracking·slot-matches·meta) 의 정렬 후 SHA-256 concat hash**. **schema.json 미포함** (CAP-02 정정 — schema 변경은 별도 `schemaHash` metadata). **`kssAvailable` 미포함** (CAP-26 정정 — runtime capability 이므로 `engineVersion` 별도 metadata) |
| autoCheckResult 영속 풀명세 (CA-PERSIST-01 · CAP-18·19 정정) | M0 stub 의 `compliance_record.auto_check_result` = SoT 7 필드만. Phase Alpha = SoT 7 필드 + `extensions` 단일 키 안 `suppressedByContextExceptions[]` · `inlineRiskFlagsEvidence` · `riskInferenceEvaluatedSteps` · `riskInferenceContributingSteps` · `ruleMatchStats` · `inferredRiskLevelMismatch?` · `engineMetadata` (`{ catalogVersion, catalogHash, schemaHash, engineVersion, kssAvailable }`). **`ComplianceCheckEnvelope` 안 `result` 와 `extensions` 분리 영역** — `auto_check_result` 컬럼 저장 시 `{ ...envelope.result, extensions: envelope.extensions }` 합성 (CAP-19 정정). DB 컬럼 추가 없음 (JSONB) |
| content-gate 자동 큐 진입 (CA-AUTOGATE-01 · CAP-06·07 정정) | `review_queue_entry.queue_type` enum `'content-gate'` ADD VALUE. **enqueue 조건** = `gateRequired === true && automatedDecision !== 'block'` (CAP-06). **트리거 위치** = `submitForReview` action 만 (CAP-07). 동일 contentRef content-gate + manual-review 큐 동시 진입 가능. 발행 게이트 = 양 큐 모두 resolved 필요 (AND) |
| FAQ 자동 검수 unlock (CA-FAQ-01 = EC-DEFER-05 · CAP-08 정정) | **FaqForm zod schema 변경 없음** (이미 status field 제거됨 — CWI-01). FAQ 자동 검수 적용 위치 = submitForReview action 안 `contentType='FAQ'` 입력 흐름. body = Q + A 결합 + `qa` block scope (CAP-24). risk_level 자동 추론 = P-011 기본 Low + Q/A 본문 안 의료 어휘 → Medium/High 격상 가능. **EC-DEFER-12 부분 해소** (CAP-34 정정) = FAQ status='published' 발행만 정상화. Publication·MediaAppearance status='draft' 만 잔존 (외부 인용 entity 면제 — Phase Beta 별도 unlock 결정) |
| Drizzle schema v0.6 (CA-SCHEMA-01 · CAP-10 정정) | `reviewQueueType` enum 안 `'content-gate'` ADD VALUE + **partial UNIQUE 재정의** — 실 C0015 constraint `review_queue_entry_open_unique (instance_id, content_type, content_ref)` → `(instance_id, content_type, content_ref, queue_type)` partial UNIQUE (record version별 중복 허용 안 함 — 단일 active record_version 기준) |
| C0017 migration (CA-MIGRATION-01) | `ALTER TYPE review_queue_type ADD VALUE 'content-gate'` (single statement · COMMIT 분리) + partial UNIQUE DROP + CREATE (manifest 안 별 step 분리 — Postgres ALTER TYPE 트랜잭션 제약) |
| compliance lib 분리 (CA-LIB-01) | `apps/web/src/lib/compliance/` 안 `check.ts` 완전 재작성 + `auto-gate.ts` (content-gate 자동 큐 enqueue). 매칭 엔진·composite·inline-flags·risk-inference·slot-match·loader 는 `packages/compliance-rules/` 패키지 안 |
| **`calculateFinalRoles` 단일 경로 강제** (CAP-14 정정) | `apps/web/src/lib/compliance/final-roles.ts` 이미 존재 — Phase Alpha 안 별도 합집합 계산 안 함. High 가상 finding 의 `requiredApproverRoles` 만 입력으로 추가하여 기존 `calculateFinalRoles` 단일 호출. M0 patterns (operator + Medium/High medical + LegalDocument legal + finding roles 합집합) 그대로 유지 |
| **`ApproverRole='client'` 정책** (CAP-15 정정) | JSON Schema 안 `client` 허용 (RISK_LEVELS § 3.3 정합). loader 안 v0.1 안 `client` 등록 룰 = warning log (운영자 인지). runtime check() 안 finding 에 `client` role 포함 시 = `auto_check_result.extensions.clientRolePresent=true` 표시. content-gate 큐 enqueue 시 client role 큐 처리 불가 → operator + medical/legal 만 처리 후 client 슬롯 NULL 유지 (Phase Beta CA-DEFER-10 까지) |
| **`unreviewed-ad-001` 카탈로그 등록** (CAP-16 정정) | check() 별도 흐름 (M0 plan v0.1 안) 유지하되 **§ 2.3 룰 표 안 명시** — "카탈로그 미등록 (runtime-meta · § 7.3 별도 평가)" marker. `triggeredBy='static-rule'` 유지 (CONTENT_STANDARDS § 7.2 enum cascade 회피) |
| **`field` scope v0.1 미지원** (CAP-23 정정 · CA-DEFER-20 신설) | loader 안 `type="field"` 룰 발견 시 skip + warning log. fieldPath 단위 매칭 Phase Beta |
| vitest scenarios 40+ 건 (CA-TEST-01) | 룰 매칭 14 + composite KSS 4 + contextExceptions 5 (overlap + fail composite 제외 케이스 추가 — CAP-17) + inlineRiskFlags 5 + RiskInference 7 (외부 inferredRiskLevel MAX 결합 + steps 분리 — CAP-11·12) + auto-gate 4 (block 제외 추가 — CAP-06) + FAQ 3 + LegalDocument exempt 1 = 43 |
| docs cascade (CA-CASCADE-01~09) | CA-CASCADE-01 신규 패키지 + 데이터 파일 · CA-CASCADE-02 RISK_LEVELS § 3.3 slot-matches 검증 표 + § 2.3.1 evaluatedSteps/contributingSteps cascade · CA-CASCADE-03 compliance-assistant § 4.3 KSS fallback marker · CA-CASCADE-04 EAT_CONTENT_PLAN EC-DEFER-05/12 부분 해소 marker · CA-CASCADE-05 REVIEW_WORKFLOW § 3 큐 enum + § 3.3 priority/SLA · CA-CASCADE-06 CONTENT_STANDARDS § 7.1 metadata 신규 필드 + § 7.2 Finding extensions cascade · CA-CASCADE-07 MEDICAL_AD_COMPLIANCE_COMMON § 3 매핑 marker · CA-CASCADE-08 manifest 21단계 (M0 19 + C0017 + C0018) · CA-CASCADE-09 M0_PLAN § 9 CA-DEFER phase 분류 정정 + **CA-DEFER-17·18·19·20·21·22·29·30·31·32·33·34 12종 신설** (CAP2-05 cycle 3 통일) |

### 1.3 비범위 (defer) — CAP-25 정정 + CAP2-05 cycle 3 통일 (CA-DEFER-17·18·19·20·21·22·29·30·31·32·33·34 12종 명시)

| 항목 | Defer to | marker |
|---|---|---|
| 캐시 2종 (영속 결과 캐시 · 운영 TTL 캐시) + cacheKey | Phase Beta | CA-DEFER-04 |
| LLM 보조 | Phase Beta | CA-DEFER-03 |
| warning 큐 + warningAcknowledgements | Phase Beta | CA-DEFER-05 |
| stale 큐 + StaleFlags 자동 갱신 + medical-law-revision 자동 큐 진입 | Phase Beta | CA-DEFER-06 |
| request-changes / delegate 액션 | Phase Beta | CA-DEFER-07 |
| priorReviewRequired 자동 산정 · 사전심의 외부 시스템 연동 | M2 | CA-DEFER-08 |
| client 검수자 (clientApprover 슬롯) | Phase Beta | CA-DEFER-10 |
| MediaThresholdAssessment | analytics-reporting 본 구현 | CA-DEFER-09 |
| attachments[] 법무 의견서 업로드 | M1 + storage Feature | CA-DEFER-12 |
| Feature contentType (P-106 self-test 등) | Feature Module 합류 시 | CA-DEFER-16 |
| preset 파일 (`rules.preset-<presetSlug>.yaml`) 카탈로그 + presets/ 디렉토리 운영 | Phase Beta (preset 부재 시 silent skip 정책 — § 11) | CA-DEFER-17 (신설) |
| **P-006 (및 다른 PAGE_TYPES § 3) 슬롯 격상 표** — slot-matches.yaml 실 데이터 | Phase Beta (slot 격상은 `entityFields` + `body-regex` matchCondition 합류 필요 · TreatmentPage 실 schema 안 single body_markdown 필드만 존재이므로 entity-level slot 평가 미지원) | CA-DEFER-18 (신설) |
| `medical-law-tracking.yaml` 안 실 의료법 개정 항목 — sourceUrl · checkedBy · 영향 룰 ID · stale 트리거 | 본 cycle 안 **MEDICAL_AD_COMPLIANCE_COMMON § 11.2 SoT revision (2026-04-07) seed 1건 포함** (CAP-27 정정). 추가 revision Phase Beta | CA-DEFER-19 (신설) |
| **`field` scope (fieldPath 단위 매칭)** — RiskRule.scope `type="field"` 의 fieldPath 단위 매칭 (현재 v0.1 안 body 전체 매칭 안 함 — skip+warning) | Phase Beta | CA-DEFER-20 (신설) |
| **`block` scope 5종 (list/table/callout/citation/media)** — `qa` 외 block scope | Phase Beta | CA-DEFER-21 (신설) |
| **KSS v3+ 합류** — composite AND_IN_SENTENCE + contextExceptions 같은 문장 분리 정확도 | Phase Beta (kss-js · @kss/kss-js · 자체 포팅 중 결정. v0.1 안 fallback 정규식 `[.!?](\s+\|$)` 한국어 종결 어미 분리 부정확) | CA-DEFER-22 (신설) |
| **`NOT_IN_PARAGRAPH` logic (negative operand)** — `side-effect-missing-001` (§ 3.7) 본 logic 필요 | Phase Beta (CONTENT_STANDARDS § 7.4 CompositeRiskRule.logic enum cascade — `side-effect-missing-001` 룰 자체도 Phase Beta 합류) | CA-DEFER-30 (CAP-30 정정 · 신설) |
| **`citationAbsence` evaluation contract** — `false-statement-001` (§ 3.3) 본 contract 필요 | Phase Beta (v0.1 안 단순 regex 매칭만 — citation block 검사 부재 한계 명시) | CA-DEFER-29 (CAP-29 정정 · 신설) |
| **pageMeta composite** — `foreign-patient-recruit-domestic-uncertain-001` (§ 3.12 불명확) 안 inLanguage/국내매체 evidence (v0.1 안 단순 regex) | Phase Beta | CA-DEFER-31 (cycle 2 CAP2-03 신설) |
| **numeric predicate** — `short-clinical-experience-001` (§ 3.2 6개월 이하) 안 6 이하 정확 매칭 (v0.1 안 1~99 모두 fail 보수 정책) | Phase Beta | CA-DEFER-32 (cycle 2 CAP2-04 신설) |
| **evidence absence** — `non-covered-discount-misleading-001` (§ 3.13) 안 기간/대상 명시 부재 검사 (v0.1 안 모든 % 할인 content-gate 보수 정책) | Phase Beta | CA-DEFER-33 (cycle 2 CAP2-04 신설) |
| **RiskRule.scope `excludeScopes[]` 필드** — NOT/except 표현 schema 지원 (v0.1 안 matcher allowlist pre-check · `event-fact-statement-001` 한정) | Phase Beta | CA-DEFER-34 (cycle 2 CAP2-02 신설) |

### 1.4 본 cycle 의 운영 가설 (CAP-32 정정)

1. **M0 stub → Phase Alpha 교체 시 기존 published 콘텐츠 영향 없음** — sentinel ComplianceRecord 안 `auto_check_result` 는 SoT 7 필드만이므로 풀명세 영역이 추가되어도 기존 row 영향 없음 (JSONB extensions key 추가 만).
2. **catalogHash 변경 시 자동 stale 미발생** (CA-DEFER-06 까지) — 본 cycle 안 `catalogHash` 가 변경되어도 기존 published record 의 staleFlags 는 갱신되지 않음. 운영자가 명시 재검수 액션 시 만 새 catalog 적용.
3. **FAQ sentinel guard** — FAQ 발행은 EC-DEFER-12 안 v0.1 차단되어 있었으므로 **기존 published FAQ 는 원칙적으로 0건**. 단, C0016 backfill 안 published FAQ 발견 시 sentinel ComplianceRecord 자동 생성하므로 (line 134~159) 예외 흐름은 안전.
4. **content-gate 큐 자동 진입 시 — operator 가 명시 submit 한 manual-review 큐 와 분리 운영**. 두 큐 동시 존재 시 — operator 가 둘 다 resolve 해야 발행 가능 (AND 게이트 정합).
5. **catalog 로드 실패 시 fail closed** (MA-Q10 결정 — § 12 미결정 안에서 본 cycle 결정) — `loadCatalog()` throw 시 `check()` 도 throw → `submitForReview` action 실패 → 운영자 콘솔 에러 표시. **운영 risk**: 카탈로그 손상 시 전체 발행 마비 가능성 — Phase Beta 안 명시 fallback 모드 (last-known-good catalog) 검토.
6. **외부 inferredRiskLevel 입력 MAX 결합** (CAP-11 정정) — compliance-assistant § 3.3 SoT 정합. 외부 입력 + 내부 재계산 결과 불일치 시 audit metadata 안 보존 (운영자가 외부 호출자 신뢰성 모니터링).

---

## 2. RuleCatalog 데이터 결정

### 2.1 `data/compliance-rules/` **데이터 YAML 6개 + schema.json 1개** 배치 (CAP-02 정정 · CA-CASCADE-01)

```
data/compliance-rules/
├── meta.yaml                       # catalogVersion · loadOrder · medicalLawRevisionRef · files[]
├── rules.core.yaml                  # CONTENT_STANDARDS § 4.1 표현 SoT 직접 변환 (CAP-28 정정)
├── rules.medical-ad.yaml             # MEDICAL_AD_COMPLIANCE_COMMON § 3.1~3.14 → legalBasis overlay (CAP-28 정정)
├── context-exceptions.yaml           # CONTENT_STANDARDS § 4.4 안전·주의·행정 문맥 예외
├── medical-law-tracking.yaml         # MEDICAL_AD § 11.2 SoT revision (2026-04-07) seed (CAP-27 정정)
├── slot-matches.yaml                 # v0.0 placeholder — slot 표 Phase Beta (CA-DEFER-18 · CAP-09 정정)
└── schema.json                       # JSON Schema (catalogHash 미포함 · schemaHash 별도 — CAP-02·CAP-26 정정)
```

위치 결정: **monorepo 루트 `data/compliance-rules/`** (특정 패키지 안 아님).

**catalogHash 정책** (CAP-02·CAP-26 정정):
- `catalogHash` = 6 YAML 파일 정렬 후 SHA-256 concat hash (데이터 한정)
- `schemaHash` = schema.json 단일 파일 SHA-256 hash (별도 metadata)
- `engineVersion` = `packages/compliance-rules/package.json` 의 version (별도 metadata)
- `kssAvailable` = runtime capability — metadata 안 (catalogHash 미포함)
- schema.json 변경 시 → `schemaHash` 변경, `catalogHash` 변경 안 됨 (룰 데이터 동일 시 영속 결과 동일)
- 검증 실패 시 throw → fail closed (§ 1.4 5번)

### 2.2 `meta.yaml` 구조 (CA-META-01)

```yaml
catalogVersion: "1.0.0"
medicalLawRevisionRef: "2026-04-07-reaffirmation"   # CAP-27 정정 — MEDICAL_AD § 11.2 SoT seed
loadOrder:
  rules:
    - rules.core.yaml
    - rules.medical-ad.yaml
  contextExceptions:
    - context-exceptions.yaml
  tracking:
    - medical-law-tracking.yaml
  slotMatches:                              # CA-SLOT-01 (CAP-09 정정 — v0.0 placeholder)
    - slot-matches.yaml
files:
  rules.core.yaml:
    version: "1.0.0"
    description: "Core 표현 룰 — CONTENT_STANDARDS § 4.1 표현 SoT 직접 변환"
  rules.medical-ad.yaml:
    version: "1.0.0"
    description: "MEDICAL_AD § 3.1~3.14 legalBasis overlay + 추가 의료법 룰"
  context-exceptions.yaml:
    version: "1.0.0"
    description: "문맥 예외 카탈로그 — CONTENT_STANDARDS § 4.4"
  medical-law-tracking.yaml:
    version: "1.0.0"
    description: "의료법 개정 추적 — MEDICAL_AD § 11.2 2026-04-07 reaffirmation seed (Phase Beta 추적 시작)"
  slot-matches.yaml:
    version: "0.0.0"
    description: "PAGE_TYPES § 3 slot 격상 조건 — v0.0 placeholder (CA-DEFER-18 Phase Beta)"
```

> RISK_LEVELS § 3.4.1 `meta.yaml` 구조 확장 — `loadOrder.slotMatches[]` 카테고리 신규. RISK_LEVELS § 3.3 JSON Schema 검증 표 cascade 안 본 카테고리 추가 (CA-CASCADE-02).

### 2.3 룰 카탈로그 분리 정책 (CAP-28 정정)

- **rules.core.yaml** = CONTENT_STANDARDS § 4.1 표현 SoT 직접 변환 (모든 의료광고 표현 룰 — 최상급/효과 단정/전문성 단정/보장 등). `sourceDoc: "core/CONTENT_STANDARDS.md#4.1"`. `legalBasis[]` 누락 또는 generic
- **rules.medical-ad.yaml** = MEDICAL_AD § 3.1~3.14 의료법 인용 overlay. `overrides[]` 사용하여 rules.core.yaml 의 canonical 룰에 `legalBasis[]` 정확 매핑 추가. 일부는 신규 룰 (의료법 특화 — 외국인환자·기사형 광고 등)
- 머지 결과 = 단일 RiskRule[] 컬렉션 안 canonical 룰별 `legalBasis[]` 정확 매핑

### 2.4 MEDICAL_AD SoT 예시 ID → canonical 매핑 표 (CAP-04 정정 · cycle 4 카운트 정확화)

**v0.5 카운트 정확 산수** (CAP-04 잔존 cycle 4 정정):
- MEDICAL_AD § 3.0~3.14 안 **명시된 SoT 예시 ID 총 27 슬롯**: § 3.1 (1) · § 3.2 (3) · § 3.3 (2) · § 3.4 (1) · § 3.5 (1) · § 3.6 (2) · § 3.7 (1) · § 3.8 (5) · § 3.9 (2) · § 3.10 (1) · § 3.11 (1) · § 3.12 (2) · § 3.13 (2) · § 3.14 (3) · § 3.15 (0 — 시행령 미존재). 합계 1+3+2+1+1+2+1+5+2+1+1+2+2+3 = **27 슬롯**
- **unique ID = 26** (§ 3.3 · § 3.9 안 `false-credential-001` 중복 1 제외)
- **표 row = 28**: 27 SoT 슬롯 + plan 추가 row 1 (§ 3.8 `professional-assertion-standalone-001` "단독 어휘" — CONTENT_STANDARDS § 4.1 안 생성 룰 · MEDICAL_AD § 3.8 안 명시 ID 아님 · 비-SoT-count display row)
- **acceptance count 26** (unique ID 기준 — duplicate 1 제외 · 단독 어휘 비-SoT 제외)
- **Phase Alpha 활성 canonical 룰 = 25** = rules.core.yaml 14 표현 룰 (CONTENT_STANDARDS § 4.1 전건 · 단독 어휘 룰 포함) + rules.medical-ad.yaml 13 신규 룰
- **27 SoT 슬롯 처리 합계**: 생성 15 (직접 매칭 신설 — SoT 슬롯 안 ID 카탈로그 등록) · canonical 흡수 9 (다른 canonical 룰로 대체 — `§ 3.2 treatment-effect-assertion-001` + `§ 3.3 false-credential-001` + `§ 3.6 graphic-procedure-001` + `§ 3.8 exaggeration-001` + `§ 3.8 effect-claim-001` + `§ 3.8 guarantee-001` + `§ 3.9 false-title-001` + `§ 3.14 false-award-001` + `§ 3.14 false-endorsement-001`) · 카탈로그 미등록 1 (`unreviewed-ad-001` runtime-meta) · Phase Beta defer 1 (`side-effect-missing-001`) · **duplicate display row (비-count) 1** (`§ 3.9 false-credential-001` — 이미 § 3.3 흡수 처리 안 카운트 · 표 안 display 만) = 27 표현 · 26 acceptance count
- **acceptance precondition 통일** (CAP-04 cycle 4 정정): "**27 SoT 슬롯 표현 + 26 acceptance count (생성 15 + 흡수 9 + runtime-meta 1 + Phase Beta defer 1) + 27 활성 canonical 룰 + plan 추가 단독 어휘 1 (비-SoT-count)**" — cycle 3 "생성 16 + 흡수 9 = 25" 산수 오류 정정

| MEDICAL_AD § | SoT 예시 ID | Phase Alpha 처리 | 대체 canonical ruleId | legalBasis[] |
|---|---|---|---|---|
| § 3.1 | `new-medical-technology-unevaluated-001` | **생성** | `new-medical-technology-unevaluated-001` (rules.medical-ad.yaml) | `["medical-law-art56-para2-no1", "enforcement-decree-art23-para1-no1"]` |
| § 3.2 | `testimonial-001` | **생성** (composite) | `testimonial-001` | `["medical-law-art56-para2-no2", "enforcement-decree-art23-para1-no2"]` |
| § 3.2 | `short-clinical-experience-001` | **생성** | `short-clinical-experience-001` | 동일 |
| § 3.2 | `treatment-effect-assertion-001` | **canonical 흡수** → `guarantee-composite-001` (§ 3.8) | `guarantee-composite-001` | `["medical-law-art56-para2-no2", "medical-law-art56-para2-no8", "enforcement-decree-art23-para1-no2", "enforcement-decree-art23-para1-no8"]` (4 호 결합 · MEDICAL_AD § 3.0 canonical 패턴) |
| § 3.3 | `false-statement-001` | **생성** (단순 regex · CAP-29 한계 명시) | `false-statement-001` | `["medical-law-art56-para2-no3"]` |
| § 3.3 | `false-credential-001` | **canonical 흡수** → `false-credential-001` (§ 3.9) | `false-credential-001` | `["medical-law-art56-para2-no3", "medical-law-art56-para2-no9"]` |
| § 3.4 | `comparison-001` | **생성** | `comparison-001` | `["medical-law-art56-para2-no4", "enforcement-decree-art23-para1-no4"]` |
| § 3.5 | `defamation-001` | **생성** | `defamation-001` | `["medical-law-art56-para2-no5"]` |
| § 3.6 | `graphic-procedure-001` | **canonical 흡수** → `before-after-photo-001` (전후사진 운영 단순화 — 수술 장면도 본 룰 안 포함) | `before-after-photo-001` | `["medical-law-art56-para2-no6", "enforcement-decree-art23-para1-no6"]` |
| § 3.6 | `before-after-photo-001` | **생성** | 동일 | 동일 |
| § 3.7 | `side-effect-missing-001` | **Phase Beta defer** (CAP-30 — NOT_IN_PARAGRAPH logic 부재) | (미생성) | `["medical-law-art56-para2-no7"]` (Phase Beta) |
| § 3.8 | `exaggeration-001` | **canonical 흡수** → `guarantee-composite-001` (사실 과장 결합) | `guarantee-composite-001` | 동일 (§ 3.2 흡수와 같은 canonical) |
| § 3.8 | `effect-claim-001` | **canonical 흡수** → `guarantee-composite-001` | 동일 | 동일 |
| § 3.8 | `guarantee-001` | **canonical 흡수** → `guarantee-composite-001` | 동일 | 동일 |
| § 3.8 | `guarantee-composite-001` | **생성** (canonical) | 동일 | 동일 |
| § 3.8 | `supremacy-001` | **생성** | `supremacy-001` | `["medical-law-art56-para2-no8", "enforcement-decree-art23-para1-no8"]` |
| § 3.8 | (단독 어휘) | **생성** | `professional-assertion-standalone-001` | `["medical-law-art56-para2-no8", "enforcement-decree-art23-para1-no8"]` |
| § 3.9 | `false-credential-001` | (§ 3.3 흡수 처리) | (위 참조) | 위 |
| § 3.9 | `false-title-001` | **canonical 흡수** → `false-credential-001` | `false-credential-001` | 위 |
| § 3.10 | `editorial-format-ad-001` | **생성** | `editorial-format-ad-001` | `["medical-law-art56-para2-no10"]` |
| § 3.11 | `unreviewed-ad-001` | **카탈로그 미등록** (CAP-16 정정 — runtime-meta · § 7.3 별도 평가) | (미등록 · check() 별도 흐름) | `["medical-law-art56-para2-no11"]` (audit metadata 안) |
| § 3.12 | `foreign-patient-recruit-domestic-confirmed-001` | **생성** (composite — 한국어 + 외국인 환자 + 의료관광) | 동일 | `["medical-law-art56-para2-no12", "enforcement-decree-art23-para1-no12"]` |
| § 3.12 | `foreign-patient-recruit-domestic-uncertain-001` | **생성** (composite — 다국어 페이지 메타 + 외국인 환자) | 동일 | 동일 |
| § 3.13 | `non-covered-discount-misleading-001` | **생성** (canonical · 사실 고지 + 기간/대상 명시 부재) | 동일 | `["medical-law-art56-para2-no13", "enforcement-decree-art23-para1-no13"]` |
| § 3.13 | `non-covered-discount-pressure-001` | **생성** (canonical · 압박형 결합) | 동일 | 동일 |
| § 3.14 | `award-endorsement-001` | **생성** (canonical — 인증/보증/추천 단일 룰) | 동일 | `["medical-law-art56-para2-no14", "enforcement-decree-art23-para1-no14"]` |
| § 3.14 | `false-award-001` | **canonical 흡수** → `award-endorsement-001` | 동일 | 동일 |
| § 3.14 | `false-endorsement-001` | **canonical 흡수** → `award-endorsement-001` | 동일 | 동일 |

**SoT 27 슬롯 처리 합계 (cycle 4 정확)**: 생성 15 (직접 매칭 신설 · MEDICAL_AD SoT 안 명시 ID 카탈로그 등록) · canonical 흡수 9 (다른 룰로 대체 · `§ 3.2 treatment-effect-assertion-001` → `guarantee-composite-001` · `§ 3.3 false-credential-001` → `false-credential-001` (§ 3.9 unique 유지) · `§ 3.6 graphic-procedure-001` → `before-after-photo-001` · `§ 3.8 exaggeration-001` · `effect-claim-001` · `guarantee-001` → `guarantee-composite-001` · `§ 3.9 false-title-001` → `false-credential-001` · `§ 3.14 false-award-001` · `false-endorsement-001` → `award-endorsement-001`) · 카탈로그 미등록 1 (`unreviewed-ad-001` runtime-meta · § 7.3) · Phase Beta defer 1 (`side-effect-missing-001` · CA-DEFER-30) = 26 acceptance count. **duplicate display row 1** (`§ 3.9 false-credential-001` — § 3.3 안 흡수 처리 안 카운트 안 1회만 · 표 안 display row 만) = 27 표현 · **plan 추가 row 1** (§ 3.8 `professional-assertion-standalone-001` "단독 어휘" — CONTENT_STANDARDS § 4.1 생성 룰 · 비-SoT-count display row) = 28 표 row. **활성 canonical 룰** = rules.core.yaml 14 + rules.medical-ad.yaml 13 신규 = **27 활성 canonical 룰**.

### 2.5 `rules.core.yaml` (CA-CORE-01 · CAP-28 정정)

CONTENT_STANDARDS § 4.1 표현 SoT 직접 변환. **각 RiskRule.category 는 SoT § 4.1 카테고리 칸 그대로 사용** (CAP-05 정정).

| RiskRule.id | category (SoT 정확 매칭) | severity | patternType | scope | sourceDoc |
|---|---|---|---|---|---|
| `supremacy-001` | "최상급" | fail | regex (`(최고의\|최저가\|최대\|최강\|1위\|국내\s*유일\|세계\s*최초\|세계\s*최고)`) | global | core/CONTENT_STANDARDS.md#4.1 |
| `effect-assertion-001` | "효과 단정" | fail | regex (`(완치\|100\s*%\s*효과\|반드시\s*효과\|안전합니다\|부작용\s*없음)`) | global | 동일 |
| `numeric-period-standalone-001` | "수치·기간 단정 (보장어 없음)" | content-gate (`["medical", "legal"]`) | composite (`\d+\s*(일\|주\|개월)` + `(만에\|기간)` AND_NEAR window=15) | global | 동일 |
| `numeric-period-guarantee-001` | "수치·기간 보장" | fail | composite (`\d+\s*(kg\|일\|주)` + `(보장\|약속)` AND_IN_SENTENCE) | global | 동일 |
| `comparison-001` | "비교 표현" | fail | regex (`(타\|다른\|기존)\s*(병원\|의원\|치료법)\s*(보다\|대비)`) | global | 동일 |
| `inducement-pressure-001` | "유인성 표현" | fail | regex (`(지금만\|특가\|한정\|기간\s*한정\|선착순\|오늘까지)`) | global | 동일 |
| `event-fact-statement-001` | "할인·이벤트 사실 안내" | content-gate (`["legal"]`) | regex (`\d+\s*%\s*(할인\|세일)`) | global (CAP2-02 정정 — scope NOT 표현 불가이므로 matcher 안 **allowlist pre-check**: pageTypeId ∈ {P-102, P-104} 또는 articleType='event-price' 시 룰 매칭 skip · § 4.3·§ 4.4 안 명세) | 동일 |
| `diagnosis-assertion-001` | "진단 단정" | fail | composite (`(당신은\|당신의)` + `(병입니다\|확정\|확실)` AND_IN_SENTENCE) | global | 동일 |
| `authority-assertion-001` | "명의·권위 단정" | fail | regex (`(최고의\s*명의\|국내\s*1인자\|전국\s*최다)`) | global | 동일 |
| `professional-assertion-standalone-001` | "전문성 단정 (단독 어휘)" | content-gate (`["medical"]`) | regex (`(절대\|반드시\|확실히\|100\s*%)`) | global · contextExceptions 적용 대상 | 동일 |
| `guarantee-composite-001` | "전문성 단정 (효과·결과·보장 결합)" | fail | composite (`(100\s*%\|반드시\|절대\|확실히)` + `(효과\|결과\|호전\|개선\|치유\|보장)` AND_IN_SENTENCE) | global | 동일 |
| `celebrity-001` | "유명인 동원" (CAP-05 잔존 정정 — SoT § 4.1 정확 매칭) | fail | regex (`(연예인\|아이돌\|배우)\s*(이\|가)?\s*받은`) | global | 동일. legalBasis = `["medical-law-art27-para3"]` (환자 유인 — MEDICAL_AD § 3.0 cascade Phase Beta 매핑) |
| `guarantee-explicit-001` | "보장 표현" | fail | regex (`(효과\s*보장\|결과\s*보장\|만족\s*보장\|재시술\s*무료)`) | global | 동일 |
| `body-type-claim-001` | "체질·맞춤 과대 표현" | content-gate (`["medical"]`) | regex (`(당신만의\s*1\s*:\s*1\s*맞춤\|당신의\s*체질에\s*완벽)`) | global | 동일 |

> CONTENT_STANDARDS § 4.1 표 14 카테고리 모두 cover. SoT 카테고리 7 (effect-claim 7 카테고리 — RISK_LEVELS § 5.1) 안 매칭 정합 (§ 8.1 참조).

### 2.6 `rules.medical-ad.yaml` (CA-RULES-01 · CAP-28 정정)

rules.core.yaml 의 canonical 룰에 `overrides[]` 로 `legalBasis[]` 추가 + 의료법 특화 신규 룰 (외국인환자 · 기사형 광고 · 신의료기술 · 단기 임상경력 · 인증/보증 등).

```yaml
version: "1.0.0"
sourceDoc: "compliance/MEDICAL_AD_COMPLIANCE_COMMON.md#3"
sourceDocVersion: "1.0"

# rules.core.yaml canonical 룰 안 legalBasis[] 추가
overrides:
  - targetRuleId: "supremacy-001"
    patch:
      legalBasis: ["medical-law-art56-para2-no8", "enforcement-decree-art23-para1-no8"]
    rationale: "MEDICAL_AD § 3.8 사실 과장 광고"
    appliedAt: "2026-05-19T00:00:00Z"
  - targetRuleId: "effect-assertion-001"
    patch:
      legalBasis: ["medical-law-art56-para2-no8", "enforcement-decree-art23-para1-no8"]
    rationale: "MEDICAL_AD § 3.8 사실 과장 광고"
    appliedAt: "2026-05-19T00:00:00Z"
  - targetRuleId: "guarantee-composite-001"
    patch:
      legalBasis:
        - "medical-law-art56-para2-no2"
        - "medical-law-art56-para2-no8"
        - "enforcement-decree-art23-para1-no2"
        - "enforcement-decree-art23-para1-no8"
    rationale: "MEDICAL_AD § 3.0 canonical 패턴 — 치료효과 단정 + 사실 과장 결합 (§ 3.2 + § 3.8)"
    appliedAt: "2026-05-19T00:00:00Z"
  # ... (각 canonical 룰 안 legalBasis overlay)

# 의료법 특화 신규 룰
rules:
  - id: "new-medical-technology-unevaluated-001"
    category: "신의료기술 미평가 광고"
    pattern: '(신의료기술\|새로운\s*기술\|첨단\s*기술)\s*(효과\|안전)'
    patternType: "regex"
    severity: "content-gate"
    scope: [{ type: "global" }]
    requiredApproverRoles: ["medical", "legal"]
    legalBasis: ["medical-law-art56-para2-no1", "enforcement-decree-art23-para1-no1"]
    rationale: "MEDICAL_AD § 3.1"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
  - id: "testimonial-001"
    category: "치료경험담 광고"
    patternType: "composite"
    operands:
      - { pattern: '(저는\|환자분이\|내원자\s*후기\|체험기)', patternType: "regex" }
      - { pattern: '(효과\|결과\|변화\|호전\|개선)', patternType: "regex" }
    logic: "AND_IN_PARAGRAPH"
    severity: "fail"
    scope: [{ type: "global" }]
    legalBasis: ["medical-law-art56-para2-no2", "enforcement-decree-art23-para1-no2"]
    rationale: "MEDICAL_AD § 3.2"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
  - id: "short-clinical-experience-001"
    category: "단기 임상경력 광고"
    # CAP2-04 정정 - 6 이하 numeric predicate 부재 → 보수 정책: 1~99 모두 fail. 정상 7+ 케이스도 운영자 명시 통과 시 publishable
    # Phase Beta CA-DEFER-32 (numeric predicate) 안 1~6 만 매칭 정확화
    pattern: '(\d{1,2})\s*개월\s*(임상\|경력)'
    patternType: "regex"
    severity: "fail"
    scope: [{ type: "global" }]
    legalBasis: ["medical-law-art56-para2-no2", "enforcement-decree-art23-para1-no2"]
    rationale: "MEDICAL_AD § 3.2 - 6개월 이하 임상경력 광고 금지 (v0.1 보수 정책: 1~99 모두 fail · CA-DEFER-32 numeric predicate Phase Beta)"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
  - id: "false-statement-001"
    category: "거짓 진술"
    pattern: '(국내\|세계)\s*(1위\|최초\|유일)'   # CAP-29 한계 - citation absence 검사 부재
    patternType: "regex"
    severity: "content-gate"
    scope: [{ type: "global" }]
    requiredApproverRoles: ["medical", "legal"]
    legalBasis: ["medical-law-art56-para2-no3"]
    rationale: "MEDICAL_AD § 3.3 - 인용/출처 부재 시 거짓 우려"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
  - id: "false-credential-001"
    category: "법적 근거 없는 자격·명칭"
    patternType: "composite"
    operands:
      - { pattern: '(명의\|박사\|전문의)', patternType: "regex" }
      - { pattern: '(자격\|증명서\|면허)', patternType: "regex" }   # CAP-29 한계 - 인접 evidence 검사 부재
    logic: "AND_IN_PARAGRAPH"
    severity: "content-gate"
    scope: [{ type: "global" }]
    requiredApproverRoles: ["legal"]
    legalBasis: ["medical-law-art56-para2-no3", "medical-law-art56-para2-no9"]
    rationale: "MEDICAL_AD § 3.9 - 자격/명칭 거짓 표시"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
  - id: "defamation-001"
    category: "비방 광고"
    pattern: '(비효율\|구식\|낙후)'   # CAP-29 한계 - 타 기관 reference 검사 부재 (Phase Beta composite 강화)
    patternType: "regex"
    severity: "content-gate"
    scope: [{ type: "global" }]
    requiredApproverRoles: ["legal"]
    legalBasis: ["medical-law-art56-para2-no5"]
    rationale: "MEDICAL_AD § 3.5"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
  - id: "before-after-photo-001"
    category: "전후사진 노출"
    pattern: '(전후\|비포어\s*애프터\|before\s*/?\s*after\|B/A)'
    patternType: "regex"
    severity: "content-gate"
    scope: [{ type: "global" }]
    requiredApproverRoles: ["medical", "legal"]
    legalBasis: ["medical-law-art56-para2-no6", "enforcement-decree-art23-para1-no6"]
    rationale: "MEDICAL_AD § 3.6 - 수술 장면/환부 노출 흡수 (CAP-04 canonical 흡수)"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
  - id: "editorial-format-ad-001"
    category: "기사형 광고"
    patternType: "composite"
    operands:
      - { pattern: '(기자\|특파원\|취재)', patternType: "regex" }
      - { pattern: '(병원\|의원\|클리닉)', patternType: "regex" }
    logic: "AND_IN_PARAGRAPH"
    severity: "content-gate"
    scope: [{ type: "global" }]
    requiredApproverRoles: ["legal"]
    legalBasis: ["medical-law-art56-para2-no10"]
    rationale: "MEDICAL_AD § 3.10"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
  - id: "foreign-patient-recruit-domestic-confirmed-001"
    category: "외국인환자 유치 국내광고 (확정)"
    patternType: "composite"
    operands:
      - { pattern: '(외국인\s*환자\|foreign\s*patient)', patternType: "regex" }
      - { pattern: '(의료관광\|메디컬\s*투어\|유치)', patternType: "regex" }
    logic: "AND_IN_PARAGRAPH"
    severity: "fail"
    scope: [{ type: "global" }]
    legalBasis: ["medical-law-art56-para2-no12", "enforcement-decree-art23-para1-no12"]
    rationale: "MEDICAL_AD § 3.12 확정 케이스"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
  - id: "foreign-patient-recruit-domestic-uncertain-001"
    category: "외국인환자 유치 국내광고 (불명확)"
    # CAP2-03 정정 - v0.1 안 단순 regex (모든 "foreign patient" 어휘 content-gate). composite pageMeta.inLanguage/국내매체 검사는 Phase Beta CA-DEFER-31
    pattern: '(foreign\s*patient\|international\s*patient)'
    patternType: "regex"
    severity: "content-gate"
    scope: [{ type: "global" }]
    requiredApproverRoles: ["legal"]
    legalBasis: ["medical-law-art56-para2-no12", "enforcement-decree-art23-para1-no12"]
    rationale: "MEDICAL_AD § 3.12 불명확 케이스 - 법무 판단 (v0.1 단순 regex · CA-DEFER-31 pageMeta composite Phase Beta)"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
  - id: "non-covered-discount-pressure-001"
    category: "비급여 할인 압박형"
    patternType: "composite"
    operands:
      - { pattern: '(지금만\|특가\|한정\|선착순\|오늘까지)', patternType: "regex" }
      - { pattern: '(할인\|세일\|이벤트)', patternType: "regex" }
    logic: "AND_IN_SENTENCE"
    severity: "fail"
    scope: [{ type: "global" }]
    legalBasis: ["medical-law-art56-para2-no13", "enforcement-decree-art23-para1-no13"]
    rationale: "MEDICAL_AD § 3.13 압박형"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
  - id: "non-covered-discount-misleading-001"
    category: "비급여 할인 사실 고지"
    # CAP2-04 정정 - 모든 % 할인 보수적 content-gate. 기간/대상 명시된 정상 케이스도 법무 검수 통과 시 publishable
    # Phase Beta CA-DEFER-33 (evidence absence) 안 기간/대상/대상 명시 부재 검사 강화 - 명시된 정상 케이스 silent pass
    pattern: '\d+\s*%\s*할인'
    patternType: "regex"
    severity: "content-gate"
    scope: [{ type: "global" }]
    requiredApproverRoles: ["legal"]
    legalBasis: ["medical-law-art56-para2-no13", "enforcement-decree-art23-para1-no13"]
    rationale: "MEDICAL_AD § 3.13 사실 고지 (v0.1 보수 정책: 모든 % 할인 content-gate · CA-DEFER-33 evidence absence Phase Beta)"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
  - id: "award-endorsement-001"
    category: "상장·인증·보증·추천"
    patternType: "composite"
    operands:
      - { pattern: '(상장\|인증\|보증\|추천)', patternType: "regex" }
      - { pattern: '(받은\|보유\|획득)', patternType: "regex" }
    logic: "AND_IN_SENTENCE"
    severity: "content-gate"
    scope: [{ type: "global" }]
    requiredApproverRoles: ["legal"]
    legalBasis: ["medical-law-art56-para2-no14", "enforcement-decree-art23-para1-no14"]
    rationale: "MEDICAL_AD § 3.14 - 가~라목 예외 카탈로그 매칭 Phase Beta"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
```

> `side-effect-missing-001` (§ 3.7) 은 NOT_IN_PARAGRAPH logic 필요 — CONTENT_STANDARDS § 7.4 CompositeRiskRule.logic enum cascade 가 본 cycle 안 미합류이므로 Phase Beta defer (CA-DEFER-30 · CAP-30 정정).

### 2.7 `context-exceptions.yaml` (CA-EXCEPTION-DATA-01)

CONTENT_STANDARDS § 4.4 표를 그대로 변환. 5 contextException (safety 2 · warning-message 2 · administrative 1).

```yaml
version: "1.0.0"
sourceDoc: "core/CONTENT_STANDARDS.md#4.4"
sourceDocVersion: "1.3"

exceptions:
  - id: "safety-medical-consult-001"
    kind: "safety"
    pattern: '(반드시|꼭)\s*(의료진과\s*)?(상담|확인)하세요'
    patternType: "regex"
    appliesTo:
      categories: ["전문성 단정 (단독 어휘)"]   # CAP-17 정정 - 단독 어휘 카테고리 한정
      ruleIds: []
      scopes: [{ type: "global" }]
    rationale: "의료법 제56조 — 안전 권유 표현은 광고 아님"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
  - id: "safety-consult-before-001"
    kind: "safety"
    pattern: '복용\s*전\s*(반드시\s*)?확인'
    patternType: "regex"
    appliesTo:
      categories: ["전문성 단정 (단독 어휘)"]
      ruleIds: []
      scopes: [{ type: "global" }]
    rationale: "안전 권유"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
  - id: "warning-contraindication-001"
    kind: "warning-message"
    pattern: '(절대\s*)?금기|복용\s*금지|사용\s*금지'
    patternType: "regex"
    appliesTo:
      categories: ["전문성 단정 (단독 어휘)"]
      ruleIds: []
      scopes: [{ type: "global" }]
    rationale: "안전 정보 안내"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
  - id: "warning-caution-prefix-001"
    kind: "warning-message"
    pattern: '(주의|경고)\s*[:：]'
    patternType: "regex"
    appliesTo:
      categories: ["전문성 단정 (단독 어휘)"]
      ruleIds: []
      scopes: [{ type: "global" }]
    rationale: "주의·경고 안내"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
  - id: "administrative-refund-001"
    kind: "administrative"
    pattern: '100\s*%\s*(환불\s*불가|환불\s*보증|예약\s*변경\s*불가)'
    patternType: "regex"
    appliesTo:
      categories: ["전문성 단정 (단독 어휘)", "보장 표현"]
      ruleIds: []
      scopes: [{ type: "global" }]
    rationale: "약관·환불·결제 행정 표현"
    version: "1.0.0"
    createdAt: "2026-05-19T00:00:00Z"
    updatedAt: "2026-05-19T00:00:00Z"
```

> **CAP-17 정정**: contextExceptions 적용 시 — finding 안 카테고리가 `appliesTo.categories[]` 와 일치 + finding span 과 exception pattern span 이 같은 문장 (KSS fallback 시 정규식 한계) 안 overlap 또는 인접해야 함. `fail` composite 룰 (예: `guarantee-composite-001`) 은 안전 보장 위해 예외 미적용.

### 2.8 `medical-law-tracking.yaml` SoT seed (CAP-27 정정)

```yaml
version: "1.0.0"
sourceDoc: "compliance/MEDICAL_AD_COMPLIANCE_COMMON.md#11.2"
sourceDocVersion: "1.0"
revisions:
  - revisionId: "2026-04-07-reaffirmation"
    lawSource: "의료법"
    affectedArticles: ["제56조제2항제1호~제14호"]
    revisionEffectiveDate: "2026-04-07"
    revisionType: "reaffirmation"
    sourceUrl: "https://www.law.go.kr/법령/의료법"
    checkedAt: "2026-05-19T00:00:00Z"
    checkedBy: "operator:seokcess@glitzy.kr"
    affectedRuleIds: []   # reaffirmation - 모든 룰 변경 없음
    staleScope:
      kind: "all"
      contentTypes: []
    summary: "MEDICAL_AD § 11.2 SoT - 2026-04-07 의료법 본문 재확인 (변경 없음). Phase Alpha baseline."
```

### 2.9 `slot-matches.yaml` v0.0 placeholder (CAP-09 정정)

```yaml
version: "0.0.0"
sourceDoc: "core/PAGE_TYPES.md#3"
sourceDocVersion: "1.0"
slots: []   # CA-DEFER-18 - PAGE_TYPES § 3 P-006 slot 격상 표 Phase Beta 합류
# 실 slot 데이터 추가 시 - schema:
#   - slotId: string (kebab-case, P-XXX-content-yyy 형식)
#   - pageTypeId: PageTypeId enum
#   - triggeredLevel: RiskLevel
#   - matchCondition: { kind: "field-non-empty" | "body-regex" | "field-regex" | ... }
```

> Phase Alpha 안 P-006 slot 격상 미합류 — TreatmentPage 실 schema (C0004) 안 `results` · `pricing` 필드 부재. body_markdown 단일 필드 안에서 키워드 매칭 필요 — `body-regex` matchCondition kind 신설 후 Phase Beta 합류. v0.1 안 RiskInference 안 slotMatches 입력 항상 `[]` (빈 배열).

### 2.10 `schema.json` (CA-SCHEMA-JSON-01 · CAP-03 정정)

JSON Schema Draft-07. **slot-matches.yaml 검증 표 — RISK_LEVELS § 3.3 수준 확장** (CAP-03):

| 검증 항목 | 룰 레벨 |
|---|---|
| `slots[].slotId` 중복 (파일 내) | **fail** |
| `slots[].slotId` 형식 (`^[A-Z]-\d{3}-[a-z][a-z0-9-]*[a-z0-9]$` 또는 kebab-case) | **fail** |
| `slots[].pageTypeId` PAGE_TYPES § 3 미정의 | **fail** |
| `slots[].triggeredLevel` RiskLevel enum 외 값 | **fail** |
| `slots[].matchCondition.kind` enum 외 값 (`field-non-empty` · `body-regex` · `field-regex`) | **fail** |
| `kind="field-non-empty"` + `fieldPath` 누락 | **fail** |
| `kind="field-regex"` + (`fieldPath` 또는 `pattern` 누락) | **fail** |
| `kind="body-regex"` + `pattern` 누락 | **fail** |
| `pattern` regex 컴파일 실패 | **fail** |
| `slots[].fieldPath` PAGE_TYPES § 3 안 정의된 slot 필드 미존재 (v0.1 안 미실행 — slot-matches.yaml 비어 있으므로) | warning |
| `slots[].version` SemVer 위반 | **fail** |
| `slots[].createdAt`·`updatedAt` ISO 8601 위반 | **fail** |
| `slots[].rationale` 누락 | warning |
| `slots[].sourceDoc` 경로 위반 | warning |
| `meta.yaml.loadOrder.slotMatches[]` 안 참조 파일 부재 | **fail** |

기타 RISK_LEVELS § 3.3 SoT 표 (RiskRule · ContextException · medical-law-tracking · meta · overrides 검증) 모두 적용.

---

## 3. RuleCatalog 로더 결정

### 3.1 패키지 분리 (CA-PACKAGE-01)

```
packages/compliance-rules/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts           # 공개 API
│   ├── loader.ts          # 6 YAML + 1 schema.json + JSON Schema 검증
│   ├── matcher.ts         # RiskRule 매칭 엔진
│   ├── composite.ts       # AND_IN_SENTENCE/PARAGRAPH/NEAR
│   ├── kss.ts             # KSS wrapper + fallback (CA-DEFER-22 Phase Beta KSS 합류)
│   ├── exceptions.ts      # contextExceptions 적용 (CAP-17)
│   ├── inline-flags.ts    # 5종 inlineRiskFlag 추출
│   ├── risk-inference.ts  # MAX 결합 + evaluatedSteps + contributingSteps (CAP-12)
│   ├── slot-match.ts      # slot-matches.yaml 평가 (v0.1 빈 배열 반환)
│   ├── hash.ts            # catalogHash + schemaHash 분리 산정 (CAP-26)
│   └── types.ts
└── __tests__/
```

### 3.2 로더 동작 (CA-LOADER-02 · CAP-23 정정)

```typescript
type LoadedCatalog = {
  rules: RiskRule[];
  contextExceptions: ContextException[];
  slotMatches: SlotMatchDefinition[];
  medicalLawTracking: MedicalLawRevision[];
  catalogVersion: string;
  catalogHash: string;       // 6 YAML 데이터 hash만 (CAP-26)
  schemaHash: string;        // schema.json hash (별도)
  engineVersion: string;     // packages/compliance-rules/package.json version
  kssAvailable: boolean;     // runtime capability (metadata만)
  warnings: string[];        // field/block 미지원 룰 skip warning (CAP-23)
};

export async function loadCatalog(opts?: { rootDir?: string }): Promise<LoadedCatalog>;
```

- `field` scope 룰 발견 시 → skip + warnings.push (CAP-23 · CA-DEFER-20)
- `block` scope 안 `qa` 외 값 → skip + warnings.push (CAP-24 · CA-DEFER-21)
- `feature` scope 룰 → skip + warnings.push (CA-DEFER-16)
- `client` ApproverRole 등록 룰 → warning log + 그대로 carry (runtime check() 안 별도 처리 — CAP-15)
- `NOT_IN_PARAGRAPH` 또는 본 cycle 안 미지원 logic → skip + warnings.push (CA-DEFER-30)
- KSS 모듈 import 시도 → 실패 시 `kssAvailable=false` + warning log
- catalog 로드 실패 (검증 fail · 파일 부재) → throw `ComplianceCatalogError` (fail closed · § 1.4 5번)

### 3.3 빌드 시점 변환 (CA-BUILD-01)

`packages/compliance-rules/scripts/build.ts` — 6 YAML → 1 단일 JSON (`dist/catalog.json`) 사전 변환. dev 시 fs fallback.

### 3.4 catalogHash + schemaHash 분리 산정 (CAP-26 정정)

```typescript
function computeCatalogHash(yamlFiles: { name: string; content: string }[]): string {
  // 1. 6 YAML 파일 name 정렬 (schema.json 미포함)
  const sorted = yamlFiles.slice().sort((a, b) => a.name.localeCompare(b.name));
  // 2. 각 파일 content 정규화 - trim · 줄바꿈 LF 통일
  const normalized = sorted.map(f => `${f.name}\n${f.content.trim().replace(/\r\n/g, '\n')}`);
  // 3. concat
  const concat = normalized.join('\n---\n');
  // 4. SHA-256
  return sha256(concat);
}

function computeSchemaHash(schemaContent: string): string {
  return sha256(schemaContent.trim().replace(/\r\n/g, '\n'));
}
```

- `catalogHash` = 데이터 결정성 (동일 데이터 → 동일 hash)
- `schemaHash` = 검증 규칙 변경 추적 (별도 metadata)
- `engineVersion` = matcher/composite/inline-flags 알고리즘 버전 (별도 metadata)
- `kssAvailable` = runtime capability (별도 metadata)
- 환경 차이로 같은 catalog 가 다른 hash 갖지 않음 (CAP-26 운영 결정성 확보)

---

## 4. RiskRule 매칭 엔진 결정 (CA-MATCHER-01)

### 4.1 진입 시그니처

```typescript
export type MatchResult = {
  findings: Finding[];
  suppressedFindings: Array<{ finding: Finding; suppressedBy: string; reason: ContextExceptionKind }>;  // CAP-17 · CAP-18
};

export function matchRules(
  body: string,
  rules: RiskRule[],
  contextExceptions: ContextException[],
  scope: ContentScopeInput,
  kssAvailable: boolean,
): MatchResult;

type ContentScopeInput = {
  contentType: ContentType;
  pageTypeId: PageTypeId;
  articleType?: ArticleType;
  contractId?: ContractId;
  featureContentType?: FeatureContentTypeId;
  // CAP-24 신규 - qa block scope 안 FAQ Q/A 분리
  qaBlocks?: Array<{ question: string; answer: string; offsetStart: number }>;
};
```

### 4.2 매칭 순서

```
for each rule in rules:
  1. scope 일치 검사 (§ 4.3)
  2. patternType 분기 - regex/keyword/phrase: simple · composite: § 6
  3. 매칭 시 Finding[] 산출 - location offset (UTF-16)
  4. ApproverRole · legalBasis · triggeredBy="static-rule" 메타 채움
after all rules:
  5. contextExceptions 적용 (§ 5) - 같은 문장 + finding span overlap (CAP-17)
  6. severity 우선순위 흡수 - 집계만 (Finding[] 안 모두 보존)
```

### 4.3 scope 일치 규칙

- `global` → 항상 적용
- `pageType` → input.pageTypeId === scope.pageTypeId
- `articleType` → input.articleType === scope.articleType
- `field` → **loader 안 skip+warning** (CAP-23 · CA-DEFER-20). matcher 진입 안 됨
- `block` → `qa` 만 활성 (CAP-24 · § 4.4) · 나머지 5종 loader skip (CA-DEFER-21)
- `feature` → loader 안 skip (CA-DEFER-16). matcher 진입 안 됨
- 여러 scope OR 결합

### 4.3.1 allowlist pre-check (CAP2-02 정정)

scope OR 결합만 지원 — NOT/except 표현 불가. **특정 룰은 matcher 안 allowlist pre-check 안 skip**:

```typescript
function shouldSkipRule(rule: RiskRule, scope: ContentScopeInput): boolean {
  // event-fact-statement-001 - CONTENT_STANDARDS § 5.7 정합 - 허용 페이지 안 skip
  if (rule.id === 'event-fact-statement-001') {
    if (scope.pageTypeId === 'P-102' || scope.pageTypeId === 'P-104') return true;
    if (scope.articleType === 'event-price') return true;
  }
  return false;
}
```

Phase Beta 안 schema 안 `excludeScopes[]` 필드 추가 검토 (CA-DEFER-34 신설).

### 4.4 qa block scope 안 FAQ 처리 (CAP-24 정정)

- FAQ check() 입력 시 — `qaBlocks` 입력 안 question/answer 분리
- `qa` block scope 룰은 각 qa block 안 단위로 매칭 (question OR answer 각 부분 매칭)
- finding.location 은 전체 body 안 offset (qaBlocks 안 offsetStart 더해 변환)
- v0.1 안 `qa` block scope 룰 등록 안 함 (rules.core/medical-ad.yaml 안 모두 global) — 단순히 qaBlocks 입력 지원만 활성 (Phase Beta 안 qa block 전용 룰 추가 가능)

### 4.5 simple 매칭

- `keyword` — case-insensitive substring
- `phrase` — word boundary (한국어 영향 미미)
- `regex` — `gu` flag 강제

### 4.6 severity 우선순위 (CONTENT_STANDARDS § 7.4.2)

`fail > content-gate > warning > info` — 집계만 우선순위. Finding[] 모두 보존.

### 4.7 Finding 메타 풀명세 (CONTENT_STANDARDS § 7.2 정합)

```typescript
type Finding = {
  ruleId: string;
  category: string;
  pattern: string;
  severity: "info" | "warning" | "fail" | "content-gate";
  location: { start: number; end: number };
  suggestion?: string;
  requiredApproverRoles?: ApproverRole[];
  triggeredBy: "static-rule" | "inferred" | "explicit" | "llm-assist";
  legalBasis?: string[];
  llmAssistMeta?: { modelId: string; promptVersion: string; confidence: number };
};
```

---

## 5. contextExceptions 적용 알고리즘 (CA-EXCEPTION-01 · CAP-17 정정)

### 5.1 매칭 동작

```
for each finding in findings:
  1. ContextException[] 필터:
     a. ex.appliesTo.categories[] 안 finding.category 포함 OR
     b. ex.appliesTo.ruleIds[] 안 finding.ruleId 포함
  2. 위 필터 비어 있으면 finding 유지
  3. **fail composite 룰 (severity=fail + patternType=composite) 인 경우 finding 유지** (CAP-17 - 안전 보장)
  4. 통과한 예외 각각:
     a. ex.appliesTo.scopes[] 명시 시 - finding scope 와 매칭 검증
     b. ex.pattern 을 patternType 별 평가
     c. **평가 대상 텍스트 = 같은 문장 (KSS 분리 또는 fallback) 안 + finding.location 과 exception span overlap 또는 인접 (within 30 chars)** (CAP-17)
     d. 매칭 성공 시 finding 제거 (suppressedFindings 안 이동)
  5. 1개라도 ContextException 매칭하면 제거 (OR 결합)
```

### 5.2 "같은 문장" 계산 (KSS fallback)

- KSS 가용 시 — body 전체 KSS 분리 → finding.location.start 포함 문장 추출
- KSS fallback 시 (v0.1) — 정규식 `[.!?](\s+|$)` 분리. **한국어 종결 어미 (`~다`·`~요`) 안 마침표 부재 케이스 부정확** — Phase Beta KSS 합류 시 정확도 강화 (CA-DEFER-22)
- 같은 문장 안 ContextException.pattern 매칭 + finding span overlap/인접 시 finding 제거

### 5.3 audit 보존 통일 위치 (CAP-18 정정)

`auto_check_result.extensions.suppressedByContextExceptions[]` (단일 경로). 각 항목:

```typescript
{
  finding: Finding,                                  // 제거된 finding 풀 데이터
  suppressedBy: string,                              // ContextException.id
  reason: "safety" | "warning-message" | "administrative",  // ContextException.kind
}
```

---

## 6. composite + KSS fallback 평가 (CA-COMPOSITE-01)

### 6.1 알고리즘

```typescript
function evaluateComposite(body: string, rule: CompositeRiskRule, kssAvailable: boolean): MatchSpan[] {
  const operandSpans = rule.operands.map(op => matchSimple(body, op));
  if (rule.logic === 'AND_IN_SENTENCE') return matchInSentence(body, operandSpans, kssAvailable);
  if (rule.logic === 'AND_IN_PARAGRAPH') return matchInParagraph(body, operandSpans);
  if (rule.logic === 'AND_NEAR') return matchNear(operandSpans, rule.window ?? 50);
  throw new ComplianceCatalogError(`unknown logic: ${rule.logic}`);
}
```

### 6.2~6.4 AND_IN_SENTENCE/PARAGRAPH/NEAR

(v0.1 기준 동일 — § 6.1 참조)

### 6.5 KSS Phase Beta defer 결정 (CAP-01 정정)

**v0.1 결정** — KSS npm 패키지 (kss-js · @kss/kss-js · 자체 포팅) **Phase Beta 합류** (CA-DEFER-22 신설). 이유:
1. KSS 패키지 선택·운영 risk 별도 cycle 필요
2. Phase Alpha 본 cycle 안 룰 카탈로그·매칭 엔진·자동 추론·persist·auto-gate 가 핵심 acceptance
3. M0 stub 대체 의도는 fallback 만으로 만족 (manualReview 모드 → 실 룰 매칭 + 자동 추론)

**Phase Alpha fallback 한계 명시**:
- `[.!?](\s+|$)` 정규식 — 한국어 종결 어미 (`~다`·`~요`) 안 마침표 부재 케이스 부정확
- composite AND_IN_SENTENCE 정확도 영향 (false-positive/false-negative 가능)
- contextExceptions "같은 문장" 정확도 영향 (안전 권유 false-suppress 가능)
- **운영 risk**: composite/contextExceptions 정확도는 KSS 합류 까지 보수적 운영 (운영자 모니터링 필요)

**CA-DEFER-01 부분 해소 표현**: 본 cycle 안 9단계 빌드 파이프라인 합류는 완료하나 composite/contextExceptions 정확도는 KSS fallback 한계 잔존. "해소" → "부분 해소" (CAP-01 정정).

---

## 7. check() 9단계 풀 흐름 (CA-CHECK-01)

### 7.1 새 시그니처 (CAP-06·11 정정)

```typescript
import { loadCatalog, matchRules, evaluateInline, inferRisk, evaluateSlots } from '@glitzy/compliance-rules';
import { calculateFinalRoles } from './final-roles';   // CAP-14 - 기존 helper 단일 경로

export async function check(input: ComplianceCheckInput): Promise<ComplianceCheckEnvelope> {
  // 1. LegalDocument 진입 차단 (M0 유지)
  if (input.contentType === 'LegalDocument') throw new ComplianceConfigError(/* ... */);

  // 2. pageTypeId 유도
  const pageTypeId = input.metadata.pageTypeId ?? derivePageTypeId(input.contentType);
  if (!pageTypeId) throw new ComplianceConfigError(`pageTypeId 유도 불가 contentType=${input.contentType}`);

  // 3. articleType 검증
  if (input.contentType === 'Article' && !input.metadata.articleType) {
    throw new ComplianceConfigError(`Article 은 articleType required`);
  }

  // 4. 카탈로그 로드
  const catalog = await loadCatalog();

  // 5. RiskRule 매칭
  const matchResult = matchRules(input.body, catalog.rules, catalog.contextExceptions, {
    contentType: input.contentType,
    pageTypeId,
    articleType: input.metadata.articleType,
    qaBlocks: input.metadata.qaBlocks,   // CAP-24 - FAQ 시
  }, catalog.kssAvailable);

  // 6. inlineRiskFlags 추출 (§ 8)
  const inlineFlagResult = evaluateInline(input.body, matchResult.findings, {
    contentType: input.contentType,
    pageTypeId,
    articleType: input.metadata.articleType,
    legalDocumentType: input.metadata.legalDocumentType,
    locationProfileField: input.metadata.locationProfileField,
  });

  // 7. slotMatches 계산 (v0.1 안 항상 빈 배열 - CAP-09)
  const slotMatches = evaluateSlots(input, catalog.slotMatches);  // [] returned

  // 8. RiskInference - 항상 내부 재계산 (CAP-11)
  const inference = inferRisk({
    pageTypeId,
    articleType: input.metadata.articleType,
    inlineRiskFlags: inlineFlagResult.inlineRiskFlags,
    slotMatches,
    explicitRiskLevel: input.metadata.explicitRiskLevel,
  });

  // 9. 외부 inferredRiskLevel 입력 MAX 결합 (CAP-11)
  let finalRiskLevel = inference.inferredRiskLevel;
  let inferredRiskLevelMismatch: { external?: RiskLevel; internal: RiskLevel; final: RiskLevel } | undefined;
  if (input.metadata.inferredRiskLevel) {
    finalRiskLevel = maxRisk(inference.inferredRiskLevel, input.metadata.inferredRiskLevel, 'Low');
    if (input.metadata.inferredRiskLevel !== inference.inferredRiskLevel) {
      inferredRiskLevelMismatch = {
        external: input.metadata.inferredRiskLevel,
        internal: inference.inferredRiskLevel,
        final: finalRiskLevel,
      };
    }
  }

  // 10. High 가상 finding 주입 (§ 11)
  const allFindings = [...matchResult.findings];
  if (finalRiskLevel === 'High') {
    allFindings.push(buildHighGateFinding(input, inference));
  }

  // 11. priorReviewRequired 메타 검사 (§ 7.3)
  if (input.metadata.priorReviewRequired === true && input.metadata.priorReviewPassed !== true) {
    allFindings.push(buildUnreviewedAdFinding());
  }

  // 12. severity 집계 + automatedDecision
  const aggregated = aggregate(allFindings);

  // 13. requiredApproverRoles - calculateFinalRoles 단일 경로 (CAP-14 잔존 + CAP3-01 boundary)
  //   final-roles.ts:14 positional 시그니처 정합
  //   client 분리 처리 (CAP-15) - extractFindingRoles 안 client 사전 분리
  //   CAP3-01 - calculateFinalRoles 안 unknown role throw 가능 → check() 자체는 throw bubble (호출자 책임)
  const findingRoles = extractFindingRoles(allFindings);   // CAP3-01 - § 7.1.1 helper 정의
  const clientRolePresent = findingRoles.includes('client');
  const findingRolesWithoutClient = findingRoles.filter(r => r !== 'client');
  // calculateFinalRoles throw 시 - check() 안 bubble (try/catch 없음). 호출자 (submitForReview 등)
  // 안 form-level error 변환 boundary (CAP3-01 - § 7.1.2 정책).
  const runtimeRoles = calculateFinalRoles(
    input.contentType,
    finalRiskLevel,
    input.metadata.priorReviewRequired ?? false,
    findingRolesWithoutClient,
  );
  // client 등록 시 - audit metadata 안 보존 + 큐 처리 불가 (CA-DEFER-10 까지)

  return {
    result: {
      automatedDecision: aggregated.automatedDecision,
      buildBlocked: aggregated.buildBlocked,
      gateRequired: aggregated.gateRequired,
      hasWarnings: aggregated.hasWarnings,
      findingsBySeverity: aggregated.bySeverity,
      requiredApproverRoles: runtimeRoles,
      findings: allFindings,
    },
    meta: {
      pageRiskLevel: finalRiskLevel,
      catalogVersion: catalog.catalogVersion,
      catalogHash: catalog.catalogHash,
      manualReview: false,
    },
    extensions: {                                              // CAP-19 - envelope.extensions 별도 영역
      suppressedByContextExceptions: matchResult.suppressedFindings,
      inlineRiskFlagsEvidence: inlineFlagResult.evidence,
      riskInferenceEvaluatedSteps: inference.evaluatedSteps,   // CAP-12 - 모든 source evaluation
      riskInferenceContributingSteps: inference.contributingSteps,   // base 갱신 source
      ruleMatchStats: { categoryCounts: countByCategory(matchResult.findings), elapsedMs: 0 },
      inferredRiskLevelMismatch,                               // CAP-11
      clientRolePresent,                                       // CAP-15
      engineMetadata: {                                        // CAP-26
        catalogVersion: catalog.catalogVersion,
        catalogHash: catalog.catalogHash,
        schemaHash: catalog.schemaHash,
        engineVersion: catalog.engineVersion,
        kssAvailable: catalog.kssAvailable,
      },
    },
  };
}
```

> **DB persist 시** (CAP-19 정정): `auto_check_result = { ...envelope.result, extensions: envelope.extensions }` 합성. SoT 7 필드 (CONTENT_STANDARDS § 7.2) 위치 안 침해 없음 — `extensions` 키는 result 안에 nested 되어 JSONB 단일 컬럼 안 모두 영속.

### 7.1.1 `extractFindingRoles` helper (CAP3-01 신설)

```typescript
// apps/web/src/lib/compliance/check.ts 안 helper 또는 별도 final-roles-helpers.ts
export function extractFindingRoles(findings: Finding[]): string[] {
  // flatten + stable dedupe + non-array guard
  const all: string[] = [];
  for (const f of findings) {
    const roles = f.requiredApproverRoles;
    if (!Array.isArray(roles)) continue;   // non-array guard - JSON 안 type mismatch 시 silent skip
    for (const r of roles) {
      if (typeof r === 'string' && r.length > 0) all.push(r);
    }
  }
  // stable dedupe - 첫 등장 순서 보존
  return Array.from(new Set(all));
}
```

- input.findings 안 각 finding 의 `requiredApproverRoles?: ApproverRole[]` flatten
- non-array (corrupted JSON) → silent skip (audit metadata 안 보존 가능 — Phase Beta)
- 빈 문자열·non-string → skip
- 결과 string[] — `calculateFinalRoles` 안 입력 (unknown role throw 검증 → ComplianceConfigError)

### 7.1.2 `calculateFinalRoles` throw boundary (CAP3-01 신설)

- **check() 안** — `calculateFinalRoles` throw bubble. try/catch 없음 (check() 자체는 fail closed)
- **호출자 안** — submitForReview · approveContent · rejectContent · publishContent action 안 try/catch ComplianceConfigError → form-level error 변환 (M0 pattern 정합 — server-actions.ts 안 ActionResult shape)
- ComplianceConfigError throw 시 envelope 생성 불가 → ComplianceRecord INSERT 안 됨 → 운영자 콘솔 안 "compliance config error" 표시 + 룰 카탈로그 또는 finding payload 점검 안내
- 일반 catch (Error) 는 unhandled → 500 (Next.js error boundary)

### 7.2 `derivePageTypeId` 매핑

(v0.1 동일 — § 7.2 v0.1 참조)

### 7.3 `priorReviewRequired` 메타 검사 (CAP-16 정정)

`unreviewed-ad-001` 룰은 카탈로그 안 미등록. § 2.4 표 안 "카탈로그 미등록 (runtime-meta · § 7.3 별도 평가)" 명시. 본 흐름 안 finding 추가:

```typescript
function buildUnreviewedAdFinding(): Finding {
  return {
    ruleId: 'unreviewed-ad-001',
    category: '미심의 광고',
    pattern: '(meta:priorReviewRequired)',
    severity: 'warning',
    location: { start: 0, end: 0 },
    requiredApproverRoles: ['legal'],
    triggeredBy: 'static-rule',   // CONTENT_STANDARDS § 7.2 enum cascade 회피 (CAP-16)
    legalBasis: ['medical-law-art56-para2-no11'],
  };
}
```

---

## 8. inlineRiskFlags 추출 5종 (CA-FLAG-01 · CAP-05·20·21·22 정정)

### 8.1 추출 표 (RISK_LEVELS § 5.1 SoT 정확 매칭)

| Flag | 추출 룰 |
|---|---|
| `includes-effect-claim` | matchResult.findings 안 **SoT 7 카테고리 문자열 정확 매칭** (CAP-05): `"효과 단정"`, `"전문성 단정 (단독 어휘)"`, `"전문성 단정 (효과·결과·보장 결합)"`, `"보장 표현"`, `"수치·기간 단정 (보장어 없음)"`, `"수치·기간 보장"`, `"체질·맞춤 과대 표현"` 중 1개 이상. `"최상급"`·`"보장 결합 강조"` 등은 **미포함** (CAP-05) |
| `includes-pricing` | body 정규식 (CAP-21 SoT 전건): **`[₩$￥]\s*\d`** OR **`\d{2,}\s*(원\|만원\|달러)`** OR 어휘 (`가격`·`비용`·`수가`·`비급여`·`총 비용`) |
| `includes-event` | body 어휘 — (`이벤트`·`할인`·`세일`·`프로모션`·`기간 한정`·`선착순`·`특가`·`프로모`) |
| `includes-before-after` | (a) body 어휘 (`전후`·`비포어 애프터`·`before\s*/?\s*after`·`B/A`) OR (b) `ReviewPolicy.beforeAfterPhotoAllowed=true` + 후기 콘텐츠 미디어 첨부 |
| `includes-testimonial` | matchResult.findings 안 `ruleId === 'testimonial-001'` 매칭 시 활성 (CAP-20 정정 — 별도 composite matcher 없음) |

### 8.2 false-positive 완화 (RISK_LEVELS § 5.1.2 · CAP-22 정정)

LegalDocument 는 check() 진입 자체 차단되므로 runtime 영향 없음 (dead code marker — CAP-22). 실 적용:

| 컨텍스트 | 제외 Flag |
|---|---|
| `LocationProfile.branchDescription`·`transportInfo`·`parkingInfo` 필드 (호출자가 `metadata.locationProfileField` 전달 시) | `includes-event` |
| `Article articleType=notice` | `includes-event` |

> LegalDocument 안 documentType별 완화 표 — **공용 inlineFlags extractor 직접 호출 시 만** 사용 (테스트/미래 경로). runtime check() 안 미실행 (CAP-22).

### 8.3 `includes-before-after` 부가 입력 (ComplianceCheckInput.metadata cascade)

```typescript
type ComplianceCheckInputMeta = {
  // ... 기존
  reviewPolicy?: { beforeAfterPhotoAllowed: boolean };
  mediaAttachments?: Array<{ kind: 'image' | 'video'; ref: string }>;
  legalDocumentType?: 'privacy' | 'terms' | 'non-covered' | 'refund' | 'complaint' | 'cookie' | 'other';
  locationProfileField?: 'branchDescription' | 'transportInfo' | 'parkingInfo';
  priorReviewRequired?: boolean;
  priorReviewPassed?: boolean;
  qaBlocks?: Array<{ question: string; answer: string; offsetStart: number }>;   // CAP-24
  entityFields?: Record<string, unknown>;   // v0.1 미사용 (slotMatches 빈 배열)
};
```

> CONTENT_STANDARDS § 7.1 cascade — metadata 안 7 신규 필드 (모두 optional). CA-CASCADE-06.

---

## 9. slotMatches 평가 (CA-SLOT-01 · CAP-09 정정 — v0.0 placeholder)

### 9.1 v0.1 동작

```typescript
function evaluateSlots(input: ComplianceCheckInput, slots: SlotMatchDefinition[]): SlotMatch[] {
  // v0.1 안 slot-matches.yaml 비어 있음 → 항상 빈 배열
  return [];
}
```

### 9.2 Phase Beta 합류 시 (CA-DEFER-18)

- `body-regex` matchCondition.kind 신설 — TreatmentPage 안 body_markdown 안 키워드 매칭
- `field-non-empty` matchCondition.kind 도 entityFields 입력 메타로 평가 (Publication.scholarlyArticleEntity 등 신규 entity 영역 가능)
- PAGE_TYPES § 3 P-006 slot 표 (대상·구성·프로그램 변형·유지 계획·근거 노트) 변환

---

## 10. RiskInference 자동 추론 (CA-INFER-01 · CAP-12·13 정정)

### 10.1 알고리즘 — evaluatedSteps + contributingSteps 분리 (CAP-12)

```typescript
type RiskInferenceResult = {
  inferredRiskLevel: RiskLevel;
  evaluatedSteps: Array<{ source: string; sourceValue: string; level: RiskLevel }>;     // 모든 source evaluation (CAP-12)
  contributingSteps: Array<{ source: string; sourceValue: string; level: RiskLevel }>;  // base 갱신 source만
};

export function inferRisk(input: RiskInferenceInput): RiskInferenceResult {
  const evaluatedSteps = [];
  const contributingSteps = [];
  let base: RiskLevel = pageTypeBaseLevel(input.pageTypeId);
  const baseStep = { source: 'pageType', sourceValue: input.pageTypeId, level: base };
  evaluatedSteps.push(baseStep);
  contributingSteps.push(baseStep);

  if (input.articleType) {
    const articleLevel = articleTypeBaseLevel(input.articleType);
    const step = { source: 'articleType', sourceValue: input.articleType, level: articleLevel };
    evaluatedSteps.push(step);
    if (riskHigher(articleLevel, base)) {
      base = articleLevel;
      contributingSteps.push(step);
    }
  }

  for (const flag of input.inlineRiskFlags) {
    const flagLevel = inlineFlagLevel(flag);
    const step = { source: 'inlineRiskFlag', sourceValue: flag, level: flagLevel };
    evaluatedSteps.push(step);
    if (riskHigher(flagLevel, base)) {
      base = flagLevel;
      contributingSteps.push(step);
    }
  }

  for (const slotMatch of input.slotMatches) {
    const step = { source: 'slotMatch', sourceValue: slotMatch.slotId, level: slotMatch.triggeredLevel };
    evaluatedSteps.push(step);
    if (riskHigher(slotMatch.triggeredLevel, base)) {
      base = slotMatch.triggeredLevel;
      contributingSteps.push(step);
    }
  }

  let final: RiskLevel = base;
  if (input.explicitRiskLevel) {
    const step = { source: 'explicitRiskLevel', sourceValue: input.explicitRiskLevel, level: input.explicitRiskLevel };
    evaluatedSteps.push(step);
    if (riskHigher(input.explicitRiskLevel, final)) {
      final = input.explicitRiskLevel;
      contributingSteps.push(step);
    }
  }

  return { inferredRiskLevel: final, evaluatedSteps, contributingSteps };
}
```

### 10.2 base 등급 표 (PAGE_TYPES § 3 cascade)

(v0.1 동일)

### 10.3 영속

`autoCheckResult.extensions.riskInferenceEvaluatedSteps` + `riskInferenceContributingSteps` 분리 영속.

---

## 11. High 가상 finding 주입 (CA-VIRTUAL-01 · CAP-13 정정)

### 11.1 finding 정의

```typescript
function buildHighGateFinding(input: ComplianceCheckInput, inference: RiskInferenceResult): Finding {
  const triggeredBy = determineTriggeredBy(input);   // CAP-13 - input 만 검사
  const requiredApproverRoles = articleTypeOverride(input.metadata.articleType);
  return {
    ruleId: 'risk-level-high-gate',
    category: '위험도 강제 검수',
    pattern: '(RiskLevel=High)',
    severity: 'content-gate',
    location: { start: 0, end: 0 },
    requiredApproverRoles,
    triggeredBy,
    legalBasis: [],
  };
}

function determineTriggeredBy(input: ComplianceCheckInput): 'explicit' | 'inferred' {
  // CAP-13 - explicit 우선 단일 검사
  if (input.metadata.explicitRiskLevel === 'High') return 'explicit';
  return 'inferred';
}

function articleTypeOverride(articleType?: ArticleType): ApproverRole[] {
  if (articleType === 'effect-result-related') return ['medical'];
  if (articleType === 'review-case') return ['medical', 'legal'];
  if (articleType === 'event-price') return ['legal'];
  return ['medical'];
}
```

### 11.2 requiredApproverRoles - calculateFinalRoles 단일 경로 (CAP-14)

`calculateFinalRoles` (apps/web/src/lib/compliance/final-roles.ts) 사용. M0 patterns:
- operator (전 콘텐츠 공통)
- + Medium/High → medical (등급 기본)
- + contentType==='LegalDocument' → legal (LegalDocument 면제이므로 본 cycle 안 적용 안 됨)
- + priorReviewRequired → legal
- + findings 안 requiredApproverRoles 합집합 (High 가상 finding 의 requiredApproverRoles 포함)

---

## 12. content-gate 자동 큐 진입 (CA-AUTOGATE-01 · CAP-06·07·33 정정)

### 12.1 동작 (CAP-06 + CAP2-01·06 정정)

```typescript
// CAP2-01 정정 - envelope.meta 안 contentType/contentRef 없음 → 명시 인자로 받음
// CAP2-06 정정 - event id 'content-gate-queued' (REVIEW_WORKFLOW § 9.1.1 정합) + source: "auto"
export async function enqueueContentGateIfNeeded(
  tx: TransactionSql, ctx: TenantContext,
  envelope: ComplianceCheckEnvelope, recordId: string,
  contentType: ContentType, contentRef: string,   // CAP2-01 - 호출자 명시 전달
): Promise<{ entryId: string | null }> {
  // CAP-06 - block 콘텐츠는 큐 진입 안 함 (blocked 정정 흐름)
  if (!envelope.result.gateRequired || envelope.result.automatedDecision === 'block') {
    return { entryId: null };
  }

  // partial UNIQUE 검사 - (instance_id, content_type, content_ref, queue_type) - C0018 재정의
  const existing = await tx`
    SELECT id FROM review_queue_entry
    WHERE instance_id = ${ctx.instanceId}
      AND content_type = ${contentType}
      AND content_ref = ${contentRef}
      AND queue_type = 'content-gate'
      AND status IN ('open', 'in-progress')
  `;
  if (existing.length > 0) return { entryId: existing[0].id };

  const entryId = uuid();
  await tx`
    INSERT INTO review_queue_entry (id, instance_id, content_type, content_ref, compliance_record_id, queue_type, status,
      priority, required_roles, sla_due_at, created_at, updated_at)
    VALUES (${entryId}, ${ctx.instanceId}, ${contentType}, ${contentRef}, ${recordId},
      'content-gate', 'open', 'P0', ${envelope.result.requiredApproverRoles ?? []},
      ${calculateContentGateSla()}, now(), now())
  `;
  // CAP2-06 - REVIEW_WORKFLOW § 9.1.1 event id 'content-gate-queued' 정합 + source: "auto" payload
  await emitAuditEvent('content-gate-queued', {
    recordId, entryId, contentType, contentRef,
    finalRoles: envelope.result.requiredApproverRoles,
    source: 'auto',   // CAP2-06 - manual submit vs auto-gate 구분
  });
  return { entryId };
}
```

### 12.2 호출 시점 (CAP-07 정정)

- **`submitForReview` action 안 만 통합** (Phase Alpha)
- `saveArticle` 등 entity save 안 자동 호출 — **Phase Beta defer** (빌드 시점 자동 큐 활성화 시)
- CA-DEFER-15 부분 해소 — "submitForReview 트리거 한정" marker

### 12.3 동시 큐 운영

- 동일 contentRef 안 manual-review 큐 + content-gate 큐 양쪽 open 가능
- 발행 게이트 — 양 큐 모두 resolved 필요 (AND)

### 12.4 priority · slaDueAt 정책 (CAP-33 정정 — REVIEW_WORKFLOW § 3.3 인용)

REVIEW_WORKFLOW § 3.3 표 그대로 인용:
- **content-gate 큐 priority = P0** (REVIEW_WORKFLOW § 3.3)
- **slaDueAt = `calculateContentGateSla()` = now + businessDays(3)** (영업일 3일)
- `calculateContentGateSla()` 산정 주체 = `apps/web/src/lib/sla.ts` (신규 helper)
- 알림 = `content-gate-queued` (REVIEW_WORKFLOW § 9.1.1)

---

## 13. FAQ 자동 검수 unlock (CA-FAQ-01 = EC-DEFER-05 부분 해소 · CAP-08·31·34 정정)

### 13.1 zod schema 변경 — 없음 (CAP-08 정정)

`apps/web/src/lib/eat-content-schema.ts` (CAP-31 정정 — 경로 정정) 안 — **FAQ 의 status field 는 이미 compliance workflow integration v1.0 안 form schema 안 제거되었음** (CWI-01). 본 cycle 안 zod patch 불필요.

### 13.2 FaqForm.tsx 변경 — 없음 (CAP-08 정정)

`FaqForm.tsx` 안 `name="status"` field 는 이미 제거됨 (CWI cycle). 본 cycle 안 추가 patch 없음.

### 13.3 FAQ unlock 위치 (CAP-08 정정)

- **workflow action / publish path 안** compliance check + status transition 허용
- `submitForReview` action 안 `contentType='FAQ'` 입력 흐름 안 자동 check() 호출
- DB CHECK `faq_status_v01_limit`·`faq_published_at_null_v01` 는 이미 C0016 안 해제됨

### 13.4 FAQ check() 입력

- `contentType='FAQ'`
- `body` = `${question}\n\n${answer}` 결합
- `qaBlocks` = `[{ question, answer, offsetStart: 0 }]` (CAP-24)
- `pageTypeId='P-011'` 자동 유도
- `articleType` 미지정 (FAQ N/A)
- risk_level 자동 추론 — P-011 기본 Low + Q/A 본문 안 의료 어휘 → Medium/High 격상 가능

### 13.5 EC-DEFER-12 부분 해소 (CAP-34 정정)

- **FAQ status='published' 발행만 본 cycle 안 정상화**
- Publication · MediaAppearance status='draft' 만 잔존 — 외부 인용 entity 면제 (CONTENT_STANDARDS § 7.1.1.2). Phase Beta 안 별도 unlock 결정 (EC-DEFER-12 잔여)

---

## 14. autoCheckResult 영속 (CA-PERSIST-01 = CA-DEFER-11 해소 · CAP-18·19 정정)

### 14.1 `auto_check_result` JSONB 구조 — 통일 위치 (CAP-18·19)

DB persist 시 `envelope.result` + `envelope.extensions` 합성:

```jsonc
{
  // SoT 7 필드 (CONTENT_STANDARDS § 7.2)
  "automatedDecision": "gate",
  "buildBlocked": false,
  "gateRequired": true,
  "hasWarnings": false,
  "findingsBySeverity": { "fail": 0, "content-gate": 1, "warning": 0, "info": 0 },
  "requiredApproverRoles": ["medical"],
  "findings": [
    {
      "ruleId": "supremacy-001",
      "category": "최상급",
      "pattern": "최고의",
      "severity": "fail",
      "location": { "start": 12, "end": 15 },
      "suggestion": "체질 기반 다이어트 한약 처방",
      "requiredApproverRoles": [],
      "triggeredBy": "static-rule",
      "legalBasis": ["medical-law-art56-para2-no8", "enforcement-decree-art23-para1-no8"]
    }
  ],
  // CA-PERSIST-01 (CAP-18 통일 위치 + CAP-19 단일 nested 구조)
  "extensions": {
    "suppressedByContextExceptions": [
      { "finding": { /* ... */ }, "suppressedBy": "safety-medical-consult-001", "reason": "safety" }
    ],
    "inlineRiskFlagsEvidence": { /* ... */ },
    "riskInferenceEvaluatedSteps": [ /* ... */ ],
    "riskInferenceContributingSteps": [ /* ... */ ],
    "ruleMatchStats": { "categoryCounts": { "최상급": 1 }, "elapsedMs": 23 },
    "inferredRiskLevelMismatch": null,
    "clientRolePresent": false,
    "engineMetadata": {
      "catalogVersion": "1.0.0",
      "catalogHash": "abc123...",
      "schemaHash": "def456...",
      "engineVersion": "1.0.0",
      "kssAvailable": false
    }
  }
}
```

### 14.2 ComplianceCheckEnvelope 타입 cascade (CAP-19)

```typescript
type ComplianceCheckEnvelope = {
  result: ComplianceCheckResult;  // SoT 7 필드 그대로
  meta: { pageRiskLevel, catalogVersion, catalogHash, manualReview, exemptReason? };
  extensions: ExtensionsRecord;    // 새 영역 (CAP-19 - envelope 안 별도)
};

type ExtensionsRecord = {
  suppressedByContextExceptions: Array<{ finding: Finding; suppressedBy: string; reason: ContextExceptionKind }>;
  inlineRiskFlagsEvidence: Record<InlineRiskFlag, Array<{ location, matchedText }>>;
  riskInferenceEvaluatedSteps: Array<InferenceStep>;
  riskInferenceContributingSteps: Array<InferenceStep>;
  ruleMatchStats: { categoryCounts: Record<string, number>; elapsedMs: number };
  inferredRiskLevelMismatch?: { external: RiskLevel; internal: RiskLevel; final: RiskLevel };
  clientRolePresent: boolean;
  engineMetadata: { catalogVersion: string; catalogHash: string; schemaHash: string; engineVersion: string; kssAvailable: boolean };
};
```

> CONTENT_STANDARDS § 7.2 SoT 침해 없음 (`ComplianceCheckResult` 안은 그대로 7 필드. `extensions` 는 envelope 외 영역). DB persist 시 합성하여 단일 `auto_check_result.extensions` 키 안 모두 영속.

### 14.3 DB 컬럼 영향

`compliance_record.auto_check_result` JSONB — 컬럼 ADD 없음. sentinel row 안 extensions 부재일 뿐 — 어드민 UI 안 기본값 처리.

---

## 15. content-gate 큐 enum 확장 (CA-SCHEMA-01 · CAP-10 잔존 정정 — acceptance blocker 명시)

> **CAP-10 잔존 acceptance blocker** (cycle 2): 실 C0015 unique = `(instance_id, content_type, content_ref)` partial. 본 cycle 안 content-gate + manual-review 동시 open 가능하려면 **C0018 unique 재정의 = acceptance blocker** — code cycle 안 manifest 단계 안 반드시 적용. C0017 (enum ADD VALUE) 단독 + C0018 (UNIQUE 재정의) 분리 — 합 manifest 21단계 고정.

### 15.1 C0017 migration (enum ADD VALUE 단독)

```sql
-- packages/core-content/migrations/C0017_content_gate_queue_enum.sql
-- SoT: COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN § 12 · CA-CASCADE-01

-- Postgres 제약 - ALTER TYPE ADD VALUE 는 single transaction 안 COMMIT 분리 필요
ALTER TYPE review_queue_type ADD VALUE IF NOT EXISTS 'content-gate';
```

### 15.2 C0018 migration (UNIQUE 재정의 — acceptance blocker)

```sql
-- packages/core-content/migrations/C0018_review_queue_unique_redefine.sql
-- SoT: COMPLIANCE_ASSISTANT_PHASE_ALPHA_PLAN § 12 · CA-CASCADE-01 · CAP-10 acceptance blocker

-- 기존 C0015 안 unique index: (instance_id, content_type, content_ref) partial WHERE status IN open/in-progress
-- 변경: queue_type 포함 4-tuple
DROP INDEX IF EXISTS review_queue_entry_open_unique;
CREATE UNIQUE INDEX review_queue_entry_open_unique
  ON review_queue_entry (instance_id, content_type, content_ref, queue_type)
  WHERE status IN ('open', 'in-progress');
```

> 단일 active record_version 안 동일 (contentType, contentRef) + queue_type 조합 1개 open entry 만 허용. record_version 별 중복 허용 안 함 (운영 가설 — 새 record_version 안 이전 entry resolved 상태).

### 15.3 Drizzle schema v0.6 변경

`packages/core-content/src/schema.ts` 안:
- `reviewQueueType` enum 안 `'content-gate'` 추가
- `reviewQueueEntry` table 안 unique index 변경 (`(instanceId, contentType, contentRef, queueType)` partial WHERE status open/in-progress)

### 15.4 manifest 21단계 (CAP-10 잔존 정정)

M0 19단계 + C0017 (enum ADD VALUE 단독) + C0018 (UNIQUE 재정의) = **21단계 고정**.

---

## 16. 시나리오 cascade (CA-TEST-01 · CAP-35 정정)

### 16.1 룰 매칭 (14건) — § 16.1 v0.1 동일 + 일부 정정

| # | 시나리오 | 통과 기준 |
|---|---|---|
| 1 | "최고의 다이어트 한약" 본문 → supremacy-001 매칭 (severity=fail) | findings 안 ruleId='supremacy-001' · severity='fail' · location 정확 |
| 2 | "100% 효과 보장" 본문 → guarantee-composite-001 매칭 (composite AND_IN_SENTENCE) | findings 안 ruleId='guarantee-composite-001' · severity='fail' |
| 3 | "절대 안심하세요. 의료진과 상담하세요." → professional-assertion-standalone-001 매칭하나 contextException safety 같은 문장 → suppress | findings=[] · suppressedFindings.length=1 |
| 4 | "절대 효과" → 단독 어휘 + 결합 어휘 동시 매칭 → 우선순위 fail (guarantee-composite-001) + content-gate (standalone) 둘 다 보존 | findings.length=2 · automatedDecision='block' |
| 5 | "타 병원보다 우수" → comparison-001 | severity='fail' |
| 6 | "20% 할인 진행" + Article articleType=event-price → event-fact-statement-001 미매칭 (scope 예외) | findings=[] |
| 7 | "20% 할인 진행" + Article articleType=general-medical-info → event-fact-statement-001 매칭 | severity='content-gate' · roles=['legal'] |
| 8 | "지금만 특가" → inducement-pressure-001 (fail) | severity='fail' |
| 9 | "당신은 비만입니다" → diagnosis-assertion-001 | severity='fail' |
| 10 | "전후사진" + ReviewPolicy.beforeAfterPhotoAllowed=false → before-after-photo-001 (content-gate) | severity='content-gate' |
| 11 | 외국인 환자 한국어 모집 → foreign-patient-recruit-domestic-confirmed-001 (fail) | severity='fail' |
| 12 | 다국어 페이지 메타 + "foreign patient" → foreign-patient-recruit-domestic-uncertain-001 (content-gate · legal) | roles=['legal'] |
| 13 | priorReviewRequired=true · priorReviewPassed=false → unreviewed-ad-001 warning finding 자동 추가 (카탈로그 외 별도 흐름 · CAP-16) | findings 안 unreviewed-ad-001 |
| 14 | "당신의 체질에 완벽" → body-type-claim-001 (content-gate · medical) | roles=['medical'] |

### 16.2~16.3 composite KSS · contextExceptions (CAP-17 정정 추가)

(v0.1 동일 + CAP-17 정정 시나리오)

| # | 시나리오 | 통과 기준 |
|---|---|---|
| 17a (CAP-17) | "100% 효과 보장. 반드시 의료진과 상담하세요." 같은 문장 안 fail composite + safety exception → guarantee-composite-001 finding 보존 (fail composite 예외 미적용) | findings.length=1 |
| 17b (CAP-17) | "절대 안전. 반드시 의료진과 상담하세요." 같은 문장 안 standalone + safety exception → finding 제거 | findings=[] |

### 16.4 inlineRiskFlags (5건 · CAP-05 정정)

| # | 시나리오 | 통과 기준 |
|---|---|---|
| 23 | "최고의" 매칭 → category "최상급" → SoT 7 카테고리 안 미포함 → includes-effect-claim 미활성 (CAP-05) | inlineRiskFlags=[] |
| 24 | "100% 효과" 매칭 (guarantee-composite-001) → category "전문성 단정 (효과·결과·보장 결합)" → 7 카테고리 안 포함 → includes-effect-claim 활성 | flag 활성 |
| 25 | "20% 할인" 본문 + Article articleType=notice → includes-event 추출 + RiskLevel 격상 제외 (§ 5.1.2) | flag 포함 · 격상 안 됨 |
| 26 | "전후" → includes-before-after | flag 활성 |
| 27 | testimonial-001 매칭 → includes-testimonial (CAP-20 - finding category 기반) | flag 활성 |

### 16.5 RiskInference (7건 · CAP-11·12 정정)

| # | 시나리오 | 통과 기준 |
|---|---|---|
| 28 | P-010 + articleType=notice → Low | inferredRiskLevel='Low' · contributingSteps 1건 |
| 29 | P-010 + articleType=effect-result-related → High | inferredRiskLevel='High' · contributingSteps 2건 · evaluatedSteps 2건 |
| 30 | P-002 + inlineRiskFlags=[includes-pricing] → High | flag MAX 결합 |
| 31 | P-002 + explicitRiskLevel='High' → High (explicit override) | contributingSteps 안 explicitRiskLevel source |
| 32 | P-002 + 모든 입력 Low → Low | contributingSteps 1건 (pageType) |
| 33 (CAP-11) | 외부 inferredRiskLevel='High' + 내부 추론 Medium → 최종 High + mismatch metadata | extensions.inferredRiskLevelMismatch 안 external='High' · internal='Medium' · final='High' |
| 34 (CAP-12) | P-010 + articleType=notice + inlineRiskFlags=[includes-event] + explicit=Low → inlineFlag High 격상 + explicit Low 영향 없음 | evaluatedSteps 4건 · contributingSteps 2건 (pageType + inlineRiskFlag) |

### 16.6 auto-gate (4건 · CAP-06 정정)

| # | 시나리오 | 통과 기준 |
|---|---|---|
| 35 | High 가상 finding 주입 (automatedDecision='gate') + gateRequired=true → content-gate 큐 1행 INSERT | queue_type='content-gate' · priority='P0' |
| 36 | 동일 contentRef 2회 enqueue 시도 → 두 번째는 idempotent | entryId 동일 |
| 37 | gateRequired=false → 큐 미생성 | entryId=null |
| 38 (CAP-06) | automatedDecision='block' (fail 1개) + gateRequired=true (High 가상 finding) → enqueue 안 함 | entryId=null · audit 안 finding 보존 |

### 16.7 FAQ unlock (3건 · CAP-35 정정)

| # | 시나리오 | 통과 기준 |
|---|---|---|
| 39 (CAP-35) | FAQ "한방 다이어트로 100% 효과를 보장합니다" → guarantee-composite-001 매칭 + includes-effect-claim flag + RiskInference High 가상 finding | findings 안 ruleId 안 'guarantee-composite-001' 포함 · 'risk-level-high-gate' 포함 · automatedDecision='block' · findings.length ≥ 2 (정확 count 안 고정 - "contains ruleIds" 검증) |
| 40 | FAQ 정상 본문 → findings=[] · automatedDecision='pass' · inferredRiskLevel='Low' | draft 가능 |
| 41 | FAQ status='published' 발행 (workflow action: submit → approve → publish) | DB CHECK 통과 · 발행 정상 |

### 16.8 LegalDocument exempt (1건)

| # | 시나리오 | 통과 기준 |
|---|---|---|
| 42 | contentType='LegalDocument' 입력 → check() throw ComplianceConfigError | buildLegalDocumentExemptEnvelope 호출 시 정상 envelope |

총 42 시나리오 (16.1 14 + 16.2 4 + 16.3 5 + 16.4 5 + 16.5 7 + 16.6 4 + 16.7 3 + 16.8 1).

---

## 17. 작업 단위

| # | 작업 | 산출물 |
|---|---|---|
| 1 | `data/compliance-rules/` 6 YAML + schema.json 작성 | meta · rules.core · rules.medical-ad · context-exceptions · medical-law-tracking · slot-matches (v0.0 placeholder) · schema.json |
| 2 | `packages/compliance-rules/` 신규 패키지 초기화 | package.json · tsconfig.json · src/ · build script |
| 3 | loader + JSON Schema 검증 (Ajv) + catalogHash/schemaHash 분리 산정 | loader.ts · hash.ts |
| 4 | RiskRule 매칭 엔진 (regex/keyword/phrase) + scope 일치 (field/block/feature skip+warning) | matcher.ts |
| 5 | composite 평가 + KSS fallback wrapper | composite.ts · kss.ts |
| 6 | contextExceptions 적용 (CAP-17 - 같은 문장 + span overlap + fail composite 예외) | exceptions.ts |
| 7 | inlineRiskFlags 5종 추출 (CAP-05 SoT 7 카테고리 · CAP-20 testimonial finding 기반 · CAP-21 SoT regex) | inline-flags.ts |
| 8 | RiskInference 자동 추론 + evaluatedSteps + contributingSteps 분리 (CAP-12) | risk-inference.ts |
| 9 | slot-matches evaluator (v0.1 빈 배열 반환) | slot-match.ts |
| 10 | check() 9단계 풀 흐름 (apps/web/src/lib/compliance/check.ts 완전 재작성) + 외부 inferredRiskLevel MAX 결합 (CAP-11) + priorReviewRequired runtime-meta (CAP-16) + calculateFinalRoles 단일 경로 (CAP-14) + client role 처리 (CAP-15) | check.ts |
| 11 | auto-gate 큐 자동 진입 + block 제외 (CAP-06) + REVIEW_WORKFLOW § 3.3 priority/SLA (CAP-33) | auto-gate.ts + sla.ts |
| 12 | server-actions submitForReview 안 auto-gate 호출 통합 (CAP-07 - submitForReview 만) | server-actions.ts patch |
| 13 | C0017 review_queue_type enum ADD VALUE 단독 step | C0017_content_gate_queue.sql |
| 14 | C0018 partial UNIQUE 재정의 (CAP-10 실 constraint 기준 - content_type/content_ref/queue_type 4-tuple) | C0018_review_queue_unique.sql |
| 15 | Drizzle schema v0.6 — reviewQueueType enum + unique index | packages/core-content/src/schema.ts |
| 16 | manifest 21단계 (M0 19 + C0017 + C0018) | packages/migrations-runner/src/manifest.ts |
| 17 | **types.ts cascade 풀명세** (CAP-19 잔존 정정): (a) `ComplianceCheckEnvelope` 안 `extensions: ExtensionsRecord` 신규 영역 추가 — types.ts:59 line 안 type 정정. (b) check.ts:108 안 반환 객체 안 `extensions` 키 채움 (M0 stub 안 미반환). (c) server-actions.ts:87 line 안 `JSON.stringify(envelope.result)` → `JSON.stringify({ ...envelope.result, extensions: envelope.extensions })` 합성 patch (auto_check_result JSONB 안 단일 저장). (d) C0016 sentinel backfill 안 `auto_check_result` JSON 안 `extensions` 키 부재일 뿐 — 어드민 UI 안 기본값 처리 (extensions=undefined 시 빈 객체 fallback). (e) approveContent · publishContent · rejectContent 안 envelope persist 안 자리 동일 (이미 reuse 패턴). ComplianceCheckInput.metadata 안 신규 7 필드 (reviewPolicy · mediaAttachments · legalDocumentType · locationProfileField · priorReviewRequired · priorReviewPassed · qaBlocks · entityFields) 동반. | types.ts + check.ts + server-actions.ts |
| **17.b** (CAP4-02 신설 · CAP5-01 정정 · CAP6-01 정정) | **4 server action wrapper 공통 try/catch boundary** (§ 7.1.2 CAP3-01 boundary 정책 구현 · M0_PLAN § 6.1 action 책임 분리 정합). **실 wrapper 위치** (CAP6-01 정정 — repo 안 실 export 정합): (a) **`submitForReviewAction`** (`apps/web/src/lib/compliance/entity-actions.ts:42`) — `submitForReview()` transitions helper 호출 + envelope persist + `enqueueContentGateIfNeeded` (auto-gate) 흐름 wrap. (b) **`publishContentAction`** (`apps/web/src/lib/compliance/entity-actions.ts:128`) — `publishContent()` transitions helper 호출 + `evaluatePublishable` + publish transition 흐름 wrap. (c) **`approveEntryAction`** (`apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/actions.ts:33`) — `approveContent()` transitions helper 호출 + `assertReviewerEligibility` + `calculateFinalRoles` + AND 게이트 평가 흐름 wrap. (d) **`rejectEntryAction`** (`apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/actions.ts:119`) — `rejectContent()` transitions helper 호출 + `assertTransitionAllowed` + transition validation 흐름 wrap. **공통 try/catch 패턴**: `catch (e: unknown) { const mapped = mapComplianceErrorToResult(e); if (mapped) return mapped; throw e; }` — `mapComplianceErrorToResult` 안 3 error type (ComplianceConfigError · ComplianceTransitionError · ReviewerEligibilityError) 매핑. 매핑 안 되면 throw bubble → Next.js error.tsx (500). **`mapComplianceErrorToResult` helper 위치** (CAP6-01 정정 — plan 시점 결정 · 실 파일 추가는 code cycle 안): `apps/web/src/lib/compliance/action-errors.ts` (신규 helper 파일 · code cycle 안 추가). **shape**: `(e: unknown) => SaveResult \| null` — repo 안 실 type `SaveResult` (`@/lib/save-result`) 사용 (CAP6-01 정정 — ActionResult 표현 폐기). M0_PLAN § 6.2 audit emit 패턴 (tx commit 후 base role) 정합. | entity-actions.ts + review-queue/actions.ts 안 4 wrapper patch + action-errors.ts 신규 |
| 18 | vitest 42 scenarios (cycle 1 정정 시나리오 17a/17b · 33 · 34 · 38 · 39 · 41 추가) | __tests__/ |
| 19 | docs cascade (CA-CASCADE-01~09) — RISK_LEVELS § 3.3 slot-matches 검증 + § 3.4.1 slotMatches 카테고리 + § 2.3.1 evaluatedSteps/contributingSteps 분리 · compliance-assistant § 4.3 KSS fallback marker (CA-DEFER-22) · EAT_CONTENT_PLAN § 11 EC-DEFER-05 해소 + EC-DEFER-12 부분 해소 · REVIEW_WORKFLOW § 3 content-gate 활성화 + § 3.3 priority/SLA 인용 · CONTENT_STANDARDS § 7.1 metadata 신규 필드 + § 7.2 Finding extensions cascade · MEDICAL_AD_COMPLIANCE_COMMON § 3 매핑 marker (CAP-04 표 · 27 SoT 슬롯) · M0_PLAN § 9 CA-DEFER phase 분류 정정 + **CA-DEFER-17·18·19·20·21·22·29·30·31·32·33·34 12종 신설** (CAP2-05 cycle 3 통일) | doc patches |

---

## 18. CA-CASCADE markers (CAP-36 정정 - 9종 전건)

- `CA-CASCADE-01`: `data/compliance-rules/` 6 YAML + schema.json + 신규 `packages/compliance-rules/` 패키지 추가
- `CA-CASCADE-02`: `docs/compliance/RISK_LEVELS.md` § 3.3 (slot-matches 검증 15종 신설) · § 3.4.1 (loadOrder.slotMatches[] 카테고리 신설) · **§ 2.3.1 RiskInferenceResult 타입 cascade — `evaluatedSteps` + `contributingSteps` 두 배열 공식 분리** (CAP-12 잔존 정정 · 기존 단일 `steps[]` 는 deprecated alias 또는 `contributingSteps` 별칭 처리)
- `CA-CASCADE-03`: `docs/features/compliance-assistant.md` § 4.3 (KSS fallback marker · CA-DEFER-22 안 KSS 합류) · § 7 (룰 카탈로그 로드 v0.1 6 YAML + 1 schema 실 배치) cascade
- `CA-CASCADE-04`: `docs/decisions/EAT_CONTENT_PLAN.md` § 11 EC-DEFER-05 해소 marker + EC-DEFER-12 FAQ 한정 부분 해소 marker (Publication/MediaAppearance 잔여 — CAP-34)
- `CA-CASCADE-05`: `docs/admin/REVIEW_WORKFLOW.md` § 3 (큐 enum 안 content-gate 활성화 marker) + § 3.3 (priority P0/SLA 영업일 3일 표 본 plan § 12.4 인용) + § 9.1.1 (auto-gate audit event · `content-gate-queued` 알림)
- `CA-CASCADE-06`: `docs/core/CONTENT_STANDARDS.md` § 7.1 metadata 신규 7 필드 cascade (reviewPolicy · mediaAttachments · legalDocumentType · locationProfileField · priorReviewRequired · priorReviewPassed · qaBlocks · entityFields · inferredRiskLevel 외부 입력 MAX 결합 정합) + § 7.2 Finding (`extensions` 키 신설은 envelope 영역만 — Finding 자체 변경 없음) + § 7.4 RiskRule (`legalBasis[]` 필드 v1.1 cascade 이미 완료)
- `CA-CASCADE-07`: `docs/compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` § 3 매핑 marker — § 2.4 표 안 **27 SoT 슬롯 → canonical 매핑** (생성 15 + 흡수 9 + runtime-meta 1 + Phase Beta defer 1 + duplicate display 1 = 27 표현 · 26 acceptance count · CAP-04 cycle 4 정정)
- `CA-CASCADE-08`: `packages/migrations-runner/src/manifest.ts` 21단계 (M0 19 + C0017 + C0018)
- `CA-CASCADE-09`: `docs/decisions/COMPLIANCE_ASSISTANT_M0_PLAN.md` § 9 CA-DEFER phase 분류 정정 marker + **CA-DEFER-17·18·19·20·21·22·29·30·31·32·33·34 12종 신설 marker** (CAP-25 + CAP2-05 cycle 3 통일)

---

## 19. § 12 미결정 (Codex 비평 입력)

| ID | 항목 | cycle 1 안 결정 |
|---|---|---|
| MA-Q01 | KSS v3+ 합류 시점 | **Phase Beta defer 채택** (CA-DEFER-22 · CAP-01) |
| MA-Q02 | includes-effect-claim 7 카테고리 안 supremacy / 보장 결합 강조 정합 | **SoT 7 문자열 정확 매칭** (CAP-05) — "최상급" 미포함 · "전문성 단정 (효과·결과·보장 결합)" 포함 |
| MA-Q03 | priorReviewRequired finding triggeredBy | **`static-rule` 유지** (CAP-16) — CONTENT_STANDARDS § 7.2 enum cascade 회피 |
| MA-Q04 | extensions 영역의 SoT 위치 | **envelope.extensions 별도 영역 + DB persist 시 result 안 nested 합성** (CAP-19) — CONTENT_STANDARDS § 7.2 SoT 7 필드 침해 없음 |
| MA-Q05 | slot-matches.yaml SoT 위치 | **RISK_LEVELS § 3 cascade** — PAGE_TYPES § 3 안 slot 표 SoT (Phase Beta 안 실 변환 시 PAGE_TYPES 정합 검증) |
| MA-Q06 | content-gate 큐 manual-review 와 분리 vs 통합 | **분리 채택** (CAP-07) — 동시 진입 가능, 발행 게이트 AND |
| MA-Q07 | unreviewed-ad-001 카탈로그 등록 vs 별도 흐름 | **별도 흐름 채택** (CAP-16) — § 2.4 표 안 미등록 명시 + triggeredBy='static-rule' 유지 |
| MA-Q08 | preset 부재 시 처리 | **silent skip** — InstanceManifest 안 preset 설정 안 되어 있으면 loader 안 preset 파일 미로드. warning 없음 (CA-DEFER-17 안 정책 명시) |
| MA-Q09 | medical-law-tracking baseline | **MEDICAL_AD § 11.2 SoT revision (2026-04-07) seed 1건 포함** (CAP-27) |
| MA-Q10 | catalog 로드 실패 시 정책 | **fail closed (throw)** (§ 1.4 5번) — Phase Beta 안 last-known-good 모드 검토 |

---

## 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-19 | v0.1 | 초안 작성. Phase Alpha scope — CA-DEFER-01·02·11·15 + EC-DEFER-05 해소. RuleCatalog 6 yaml + 신규 packages/compliance-rules/ + check() 9단계 풀 흐름 + auto-gate 큐 자동 진입. 18 canonical 룰 + 4 룰 + 5 contextExceptions + 2 slot-matches. KSS v0.1 fallback 만. CA-CASCADE 9종 · § 12 미결정 10종. |
| 2026-05-19 | **v1.0** | **Codex 비평 cycle 7 0 finding 확정 acceptance** — `ready_for_acceptance=true` · `recommendation: "acceptance 권장"`. closeable 100%. **모든 acceptance precondition PASS** (27 SoT 슬롯 + 27 활성 canonical 룰 + 5 inlineRiskFlags + RiskInference evaluatedSteps/contributingSteps + contextExceptions + High triggeredBy + CA-DEFER 5+12 신설 + CA-CASCADE 9종). 수렴 추세 36 → 11 → 3 → 2 → 1 → 1 → **0**. 누계 7 cycle 54 finding 전건 수용. blocking 0 (cycle 4~7) · major 0 (cycle 7) 잔존. acceptance commit 안 docs cascade 동시 포함 marker (CA-CASCADE-09 cycle 2 안 실 cascade 완료). 실 코드 cascade 는 별 cycle (compliance-assistant Phase Alpha code v1.0). |
| 2026-05-19 | v0.7 | **Codex 자동 비평 cycle 6 1 finding (blocking 0·major 1·minor 0·nit 0) 전건 수용**. closeable 100%. 수렴 추세 36 → 11 → 3 → 2 → 1 → 1. 누계 cycle 1~6 = 54 finding 전건 수용. 주요 patch: **CAP6-01** § 17.b 4 wrapper 명 정확화 — 실 repo 구조 정합: (a) `submitForReviewAction` `entity-actions.ts:42`, (b) `publishContentAction` `entity-actions.ts:128`, (c) `approveEntryAction` `review-queue/actions.ts:33`, (d) `rejectEntryAction` `review-queue/actions.ts:119`. `SaveResult` type 사용 (`@/lib/save-result`) — ActionResult 표현 폐기. action-errors.ts plan 시점 결정 · 실 파일 추가는 code cycle. mapComplianceErrorToResult shape `(e: unknown) => SaveResult \| null`. |
| 2026-05-19 | v0.6 | **Codex 자동 비평 cycle 5 1 finding (blocking 0·major 1·minor 0·nit 0) 전건 수용**. **모든 acceptance precondition PASS** (27 SoT 슬롯 · 5 inlineRiskFlags · RiskInference evaluatedSteps/contributingSteps · contextExceptions · High triggeredBy · CA-DEFER 12 신설 · CA-CASCADE 9종). 수렴 추세 36 → 11 → 3 → 2 → 1. 누계 cycle 1+2+3+4+5 = 53 finding 전건 수용. 주요 patch: **CAP5-01** § 17.b 안 4 action 책임 분리 명시 — M0_PLAN § 6.1 action 책임 정합 (submitForReviewAction = check + persist + auto-gate · approveContentAction = eligibility + calculateFinalRoles + evaluatePublishable · rejectContentAction = transition validation · publishContentAction = evaluatePublishable + publish transition). `mapComplianceErrorToResult` helper 위치 = `apps/web/src/lib/compliance/action-errors.ts` 신규 파일. ComplianceConfigError + ComplianceTransitionError + ReviewerEligibilityError 3 error type form-level 변환. |
| 2026-05-19 | v0.5 | **Codex 자동 비평 cycle 4 2 finding (blocking 0·major 2·minor 0·nit 0) 전건 수용**. blocking 0 도달 (acceptance precondition 근접). closeable 100%. 수렴 추세 36 → 11 → 3 → 2. 누계 cycle 1+2+3+4 = 52 finding 전건 수용. 주요 patch: **CAP4-01** § 2.4 산수 정정 — § 3.8 합계 6 → 5 (단독 어휘 별도 row 분리 처리) · 27 SoT 슬롯 = 15 생성 + 9 흡수 + 1 미등록 + 1 defer + 1 duplicate display = 27 표현 (26 acceptance count) · plan 추가 단독 어휘 row 1 (비-SoT-count) = 표 28 row. 흡수 9 목록 정확 명시 (§ 3.3 false-credential-001 포함 · § 3.9 duplicate display row 비-count). CA-CASCADE-07 안 "27 SoT 슬롯 매핑" 통일. **CAP4-02** § 17.b 신설 — server-actions.ts 4 action 공통 try/catch boundary step (ComplianceConfigError → ActionResult formError 변환 · 일반 Error 는 500 boundary 통과 · mapComplianceErrorToResult helper). |
| 2026-05-19 | v0.4 | **Codex 자동 비평 cycle 3 3 finding (blocking 1·major 2·minor 0·nit 0) 전건 수용**. closeable 100%. 수렴 추세 36 → 11 → 3. 누계 cycle 1+2+3 = 50 finding 전건 수용. 주요 patch: **CAP-04 cycle 3 정정** § 2.4 카운트 통일 — "22 슬롯" 표현 폐기 → "27 SoT 슬롯 (생성 16 + 흡수 9 + runtime-meta 1 + Phase Beta defer 1)" + § 3.9 false-credential-001 중복 행 § 3.3 흡수 처리 안 1회 카운트. 활성 canonical 25 룰 분리 명시. **CAP2-05 cycle 3 통일** § 1.2 + § 1.3 + § 17 step 19 + § 18 CA-CASCADE-09 안 CA-DEFER 12종 (17·18·19·20·21·22·29·30·31·32·33·34) 명시 통일. **CAP3-01 신설** § 7.1.1 extractFindingRoles helper 풀명세 (flatten + stable dedupe + non-array guard) + § 7.1.2 calculateFinalRoles throw boundary 정책 (check() bubble · 호출자 안 try/catch form-level error 변환). acceptance precondition 정정 — "27 SoT 슬롯 처리 완비 + 27 활성 canonical 룰". |
| 2026-05-19 | v0.3 | **Codex 자동 비평 cycle 2 11 finding (blocking 4·major 6·minor 1·nit 0) 전건 수용**. closeable 100%. 수렴 추세 36 → 11. 누계 cycle 1 + 2 = 47 finding 전건 수용. 주요 patch: **CAP-04 잔존** § 2.4 카운트 재정의 (SoT 22 슬롯 · 활성 canonical 25 · 보존 4) · **CAP-14 잔존** calculateFinalRoles positional 시그니처 정합 (final-roles.ts:14 그대로 사용 + extractFindingRoles 안 client 사전 분리) · **CAP2-01** auto-gate envelope.meta 안 contentType/contentRef 없음 → enqueueContentGateIfNeeded 인자 명시 전달 · **CAP-10 잔존** C0017 (enum ADD VALUE 단독) + C0018 (UNIQUE 재정의) acceptance blocker 명시 + manifest 21단계 · **CAP2-02** event-fact-statement-001 matcher allowlist pre-check (`shouldSkipRule` helper · § 4.3.1 신설 · CA-DEFER-34 schema 강화 Phase Beta) · **CAP-12 잔존** RISK_LEVELS § 2.3.1 cascade evaluatedSteps + contributingSteps 분리 공식 (CA-CASCADE-02 안 본 cascade 포함 명시) · **CAP-19 잔존** types.ts + check.ts + server-actions.ts 안 envelope.extensions 영역 추가 + persist 합성 풀명세 (작업 단위 step 17) · **CAP-05 잔존** celebrity-001.category="유명인 동원" 정정 + legalBasis cascade · **CAP2-03** foreign-patient-recruit-domestic-uncertain-001 v0.1 단순 regex + CA-DEFER-31 pageMeta composite Phase Beta · **CAP2-04** short-clinical-experience-001 (CA-DEFER-32 numeric predicate) + non-covered-discount-misleading-001 (CA-DEFER-33 evidence absence) v0.1 보수 정책 · **CAP2-05** M0_PLAN § 9.4 실 cascade (CA-DEFER-17~22·29·30·31·32·33·34 12종 신설) · **CAP2-06** event id `content-gate-queued` + source:"auto" payload. acceptance precondition 정정 — "18 canonical" 표현 폐기 → "25 활성 canonical + 1 runtime-meta + 1 Phase Beta defer = 27 SoT 처리 완비". |
| 2026-05-19 | v0.2 | **Codex 자동 비평 cycle 1 36 finding (blocking 10·major 20·minor 5·nit 1) 전건 수용**. closeable 97% (CAP-01 외 35건). 주요 patch: CAP-01 KSS Phase Beta defer + "부분 해소" 표현 · CAP-02 "6 YAML + 1 schema.json" 명명 통일 + catalogHash 데이터 한정 · CAP-03 slot-matches.yaml JSON Schema 검증 15종 신설 · CAP-04 MEDICAL_AD SoT 예시 ID 17종 → canonical 매핑 표 · CAP-05 includes-effect-claim SoT 7 카테고리 문자열 정확 매칭 · CAP-06 auto-gate block 제외 · CAP-07 submitForReview 트리거 한정 · CAP-08 FAQ unlock 위치 정정 (zod 변경 없음 · workflow action path) · CAP-09 P-006 slot Phase Beta defer (CA-DEFER-18) · CA-DEFER-17~22·29·30 신설 · CAP-10 partial UNIQUE 실 constraint (content_type, content_ref, queue_type) · CAP-11 외부 inferredRiskLevel MAX 결합 + mismatch audit · CAP-12 evaluatedSteps + contributingSteps 분리 · CAP-13 explicit High 최우선 단일 검사 · CAP-14 calculateFinalRoles 단일 경로 · CAP-15 client role schema 허용 + runtime 큐 처리 불가 · CAP-16 unreviewed-ad-001 카탈로그 미등록 marker + triggeredBy='static-rule' 유지 · CAP-17 contextExceptions span overlap + fail composite 예외 · CAP-18 extensions 위치 통일 (auto_check_result.extensions) · CAP-19 envelope.extensions 별도 영역 + persist 시 합성 · CAP-20 testimonial finding category 기반 추출 · CAP-21 includes-pricing SoT regex 전건 · CAP-22 LegalDocument 완화 dead code marker · CAP-23 field scope skip+warning · CAP-24 qa block scope 부분 포함 · CAP-25 CA-DEFER-20/21/22 § 1.3 defer 표 추가 · CAP-26 catalogHash 데이터 파일 한정 + engineVersion/kssAvailable 별도 metadata · CAP-27 medical-law-tracking 2026-04-07 reaffirmation seed · CAP-28 rules.core (표현 SoT) vs rules.medical-ad (legalBasis overlay) 책임 분리 · CAP-29 false-statement-001 단순 regex + citationAbsence Phase Beta defer · CAP-30 side-effect-missing-001 Phase Beta defer · CAP-31 경로 정정 (zod/ 제거) · CAP-32 FAQ sentinel guard 표현 정정 · CAP-33 REVIEW_WORKFLOW § 3.3 priority/SLA 인용 · CAP-34 Publication/MediaAppearance EC-DEFER-12 잔여 명시 · CAP-35 scenario findings count "contains ruleIds" 검증 · CAP-36 § 1.2 CA-CASCADE-01~09 전건 표기. 작업 단위 19 step · 시나리오 42건. 누계 cycle 1 = 36 findings 전건 수용. |
