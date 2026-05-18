# Feature — compliance-assistant

> **상태**: **v1.0 구현 명세 안정판** (codex 자동 비평 5차 사이클 마감)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 4, § 9 / `docs/admin/REVIEW_WORKFLOW.md`
> **목적**: 콘텐츠 자동 검수를 담당하는 Feature Module의 단독 구현 명세 — RiskInference 자동 추론, RiskRule 카탈로그 로드, 정적 룰 checker, LLM 보조 인터페이스, ComplianceCheckResult 출력, 빌드·어드민 통합, 캐시·재실행 정책, 운영 지표를 정의.
> **외부 공유 시 주의**: 상위 문서와 동일. LLM API 키·민감 콘텐츠 처리 주의.
> **연관 문서**:
> - 입력·출력 인터페이스 SoT → `core/CONTENT_STANDARDS.md` § 7
> - 운영·룰 카탈로그·자동 추론 → `compliance/RISK_LEVELS.md`
> - 의료법 가이드 → `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md`
> - 어드민 워크플로 통합 → `docs/admin/REVIEW_WORKFLOW.md`
> - 데이터 계약 ComplianceRecord → `core/DATA_MODEL.md` C-10

---

## 0. 한 페이지 요약

- **Feature 식별자**: `compliance-assistant` (DATA_MODEL C-08 InstanceManifest.features[] 등록 — `name: "compliance-assistant"`)
- **핵심 책임**: (a) RiskInference 자동 추론 (RISK_LEVELS § 2), (b) RiskRule 카탈로그 로드 (RISK_LEVELS § 3), (c) 정적 룰 checker 실행 — 정규식/keyword/phrase/composite/contextExceptions, (d) LLM 보조 분석 (옵션·인스턴스 활성화 시), (e) ComplianceCheckResult 출력 (CONTENT_STANDARDS § 7.2)
- **2 모드 운영**: (a) **빌드 모드** — CI 빌드 시점에 빠른 정적 룰 검사 (LLM 미사용). 결과를 ComplianceRecord에 기록, (b) **어드민 모드** — 어드민에서 콘텐츠 저장 시점에 LLM 보조 분석 추가 가능 (인간 검수 보조)
- **출력 SoT**: ComplianceCheckResult 형식 (CONTENT_STANDARDS § 7.2). 본 Feature는 새 출력 타입 신설하지 않음
- **캐시·idempotency**: 동일 (콘텐츠 본문 hash + 룰 카탈로그 version) → 동일 결과. cache hit 시 LLM 미호출

---

## 1. 일반 규약

### 1.1 변경 정책

| 변경 유형 | 버전 영향 | 비고 |
|---|---|---|
| 입력/출력 인터페이스 변경 | **MAJOR** | CONTENT_STANDARDS § 7 cascade 동반 |
| RiskInference 알고리즘 변경 (강화) | **MAJOR** | RISK_LEVELS § 2 cascade |
| 정적 룰 checker 정정 (false-positive 감소) | PATCH | |
| LLM 보조 활성화 정책 변경 | MINOR | |
| LLM 프롬프트 템플릿 변경 | MINOR | (운영 정책 — 결과 결정성 영향 시 MAJOR) |
| 캐시 키 산정 로직 변경 | **MAJOR** | 기존 cache 무효화 |
| 운영 지표 항목 추가 | PATCH | |

### 1.2 SoT 원칙

- 입출력 인터페이스 SoT는 `CONTENT_STANDARDS.md` § 7 (본 문서는 구현)
- RiskRule 데이터·자동 추론 알고리즘 SoT는 `RISK_LEVELS.md` (본 문서는 적용)
- 의료법 카탈로그 SoT는 `MEDICAL_AD_COMPLIANCE_COMMON.md` (본 문서는 룰 로드만)
- 본 문서 = **구현·운영 SoT** (모드·캐시·LLM 보조·지표)

### 1.3 본 문서가 다루지 않는 영역

- 룰 데이터 자체 — `data/compliance-rules/` (RISK_LEVELS § 3 SoT)
- 검수자 화면·승인 흐름 — `admin/REVIEW_WORKFLOW.md`
- LLM 모델 선택·계약 — 운영 결정 (CA-01)

---

## 2. Feature 정의

### 2.1 기본 메타

```yaml
name: "compliance-assistant"      # DATA_MODEL C-08 features[].name과 동일
specVersion: "0.1"                # 본 문서 명세 버전 (안정판 도달 시 1.0)
coreRequiresMin: "1.0.0"          # Core 최소 버전
implementationKind: "node-module" # CI 빌드 + 어드민 통합 가능
activation:
  scope: "instance"               # 인스턴스별 활성화
  default: true                   # 기본 활성 — 의료기관 콘텐츠에 권장
  llmAssist:                      # LLM 보조 별도 활성화
    default: false
    requires: ["llm-api-key"]     # 구체 provider는 § 2.3 config.llmProvider로 명시
```

### 2.2 Core 의존성

| Core 영역 | 의존 |
|---|---|
| `CONTENT_STANDARDS.md` § 7 | ComplianceCheckInput·Result 인터페이스 |
| `RISK_LEVELS.md` § 2 | RiskInference 알고리즘 |
| `RISK_LEVELS.md` § 3 | RiskRule 카탈로그 로드 |
| `RISK_LEVELS.md` § 5 | inlineRiskFlags 추출 |
| `DATA_MODEL.md` C-10 | ComplianceRecord 결과 기록 |
| `MEDICAL_AD_COMPLIANCE_COMMON.md` § 8 | 인용 가능 도메인 화이트리스트 |

### 2.3 InstanceManifest 통합

DATA_MODEL C-08 `features[]`에 본 Feature 등록 (v0.10 cascade로 `config` 필드 신설):

```yaml
features:
  - name: "compliance-assistant"
    version: "1.0.0"
    enabled: true
    config:
      llmAssist: true
      llmProvider: "anthropic"           # 권장 default. 다른 provider 사용 시 명시 (CA-01)
      llmModel: "claude-sonnet-4-6"
      llmApiKeySecretRef: "ANTHROPIC_API_KEY"  # 비밀 보관소 키 참조
      cacheEnabled: true
      cacheTtlSeconds: 86400
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

```
1. 룰 카탈로그 로드 — **meta.yaml 우선 로드** (`data/compliance-rules/meta.yaml`):
   - meta.yaml의 `loadOrder.rules[]` → rules 파일들 순차 로드·머지 (rules.core.yaml → rules.medical-ad.yaml → rules.preset-<presetSlug>.yaml)
   - meta.yaml의 `loadOrder.contextExceptions[]` → ContextException 파일 로드 (별도 컬렉션)
   - meta.yaml의 `loadOrder.tracking[]` → medical-law-tracking.yaml 등 추적 데이터 로드
   (RISK_LEVELS § 3.4 머지 알고리즘 정합. meta.yaml이 로드 계획의 기준)
2. JSON Schema 검증 — 룰 데이터 정합성 확인 (실패 시 fail)
3. ContextException[] 컬렉션 분리
4. RiskRule 매칭 실행:
   a. scope 일치 (pageType/articleType/block/field/feature/global)
   b. patternType별 매칭 (regex/keyword/phrase/composite — § 4.3·§ 4.4)
   c. contextExceptions 적용 (§ 4.4) — 예외 일치 finding 제거
   d. Finding[]은 **각 매칭 모두 보존** — 낮은 severity finding도 제거하지 않음 (감사 추적용)
5. inlineRiskFlags 추출 (RISK_LEVELS § 5.1) — **flag별 산출 방식 분리**:
   - `includes-effect-claim`: § 4 RiskRule 매칭 결과의 `category` 집합 기반 (RiskRule 매칭 후 실행 — 순서 중요)
   - `includes-pricing`·`includes-event`·`includes-before-after`·`includes-testimonial`: 본문 정규식·어휘 매칭 + 부가 입력 평가 (`ReviewPolicy.beforeAfterPhotoAllowed`·후기 미디어 첨부 등 — RISK_LEVELS § 5.1 표)
   - § 5.1.2 컨텍스트별 false-positive 완화 적용 — `LegalDocument.documentType`·`LocationProfile` 안내 필드·`Article articleType=notice` 등에서 RiskLevel 격상 제외
6. RiskInference 실행 (RISK_LEVELS § 2.3) — pageType·articleType·slot·inlineRiskFlags·explicitRiskLevel MAX 결합. § 5.1.2 컨텍스트별 false-positive 완화 적용
7. High 가상 finding 자동 주입 — 최종 `inferredRiskLevel === "High"` 시. Finding 채움 (CONTENT_STANDARDS § 7.1.2 / RISK_LEVELS § 6.1·§ 6.2 동기화):
   - `ruleId: "risk-level-high-gate"`
   - `category: "위험도 강제 검수"`
   - `pattern: "(RiskLevel=High)"`
   - `severity: "content-gate"`
   - `location: { start: 0, end: 0 }` (메타 — 콘텐츠 전체 의미)
   - `requiredApproverRoles`: ArticleType별 override (`effect-result-related` → `["medical"]`, `review-case` → `["medical", "legal"]`, `event-price` → `["legal"]`, 기타 High → `["medical"]`)
   - **`triggeredBy` 판정**: RiskInferenceResult.steps[] 검사 — High 등급에 가장 먼저 도달한 source 기준. `explicitRiskLevel === "High"`가 그 source이면 `triggeredBy="explicit"`, 그 외(pageType·articleType·slot·inlineRiskFlags 중 하나)이면 `triggeredBy="inferred"`. explicit이 High이지만 다른 source도 High면 우선순위는 explicit (운영자 의도 보존)
8. severity 집계 → ComplianceCheckResult 산출:
   - `findingsBySeverity` 카운트 (각 severity 그대로 보존)
   - `buildBlocked` = findings 중 fail 1+ 존재
   - `gateRequired` = findings 중 content-gate 1+ 존재
   - `hasWarnings` = findings 중 warning 1+ 존재
   - `automatedDecision` = block(fail) > gate(content-gate) > warn(warning) > pass (우선순위 흡수는 집계 수준에서만)
9. 결과를 어드민 또는 빌드 파이프라인에 반환 + ComplianceRecord(pre-publish)에 기록
```

### 4.6 Finding 메타 확장 (CONTENT_STANDARDS § 7.2 cascade)

CONTENT_STANDARDS § 7.2의 Finding 타입에 본 Feature 운영을 위한 메타 필드 cascade 추가:

```ts
type Finding = {
  // ... 기존 필드 (ruleId·category·pattern·severity·location·suggestion·requiredApproverRoles)
  triggeredBy?: "static-rule" | "inferred" | "explicit" | "llm-assist";  // 출처 추적
  llmAssistMeta?: { modelId: string; promptVersion: string; confidence: number };  // LLM 출처 시
};
```

> CONTENT_STANDARDS § 7.2의 Finding 타입에 `triggeredBy`·`llmAssistMeta` 필드 신설 cascade.

### 4.2 빌드 모드 vs 어드민 모드

| 영역 | 빌드 모드 (CI) | 어드민 모드 |
|---|---|---|
| 트리거 | CI 빌드 시 변경된 콘텐츠 + 전체 (옵션) | 어드민 콘텐츠 저장 시 |
| LLM 보조 | 미사용 (속도·결정성) | 옵션 활성화 시 사용 |
| 캐시 | 사용 (동일 hash + 룰 version → cache hit) | 사용 |
| 출력 | ComplianceCheckResult + ComplianceRecord(pre-publish) 갱신 | 동일 |
| SLO | 콘텐츠 1개당 50ms (정적 룰만) | 콘텐츠 1개당 5초 (LLM 포함 시) |

### 4.3 composite 룰 평가 알고리즘

CompositeRiskRule (CONTENT_STANDARDS § 7.4):

```
1. operands[] 각각의 매칭 위치 (start, end) 산출 — character offset 기준 (UTF-16 code unit)
2. logic별 평가:
   - AND_IN_SENTENCE: 문장 분리(KSS v3+) 결과 안에 모든 operand 매칭
   - AND_IN_PARAGRAPH: 빈 줄(`\n\n`+) 분리 단락 안에 모든 operand 매칭
   - AND_NEAR: 매칭 위치 간 거리 ≤ window (character offset 기준)
3. 만족 시 composite finding 생성 — location은 첫 매칭 start ~ 마지막 매칭 end
4. severity·requiredApproverRoles·suggestion은 CompositeRiskRule 정의 따름
```

**문장 분리기 고정** (CA-03 해소):
- 한국어 문장 분리 — **KSS (Korean Sentence Splitter) v3+** 채택. Python 또는 동등 포팅
- KSS 설치 실패·미지원 환경 fallback — 정규식 `[.!?][\s]+` (조잡한 fallback, warning 로깅)
- offset 기준 — 원본 본문의 UTF-16 code unit position

### 4.4 contextExceptions 적용 알고리즘 (RISK_LEVELS § 3.4.3 정합)

```
각 finding에 대해:
1. ContextException[]을 다음 조건으로 필터:
   a. appliesTo.categories[]에 finding.category 포함 OR
   b. appliesTo.ruleIds[]에 finding.ruleId 포함
2. 위 1에서 빈 결과면 본 finding은 예외 미적용 (그대로 유지)
3. 1에서 통과한 예외 각각에 대해:
   a. appliesTo.scopes[]가 명시되어 있으면, 본 finding의 scope와 매칭 검증 (미명시 시 전체 scope 적용)
   b. ContextException.pattern을 patternType(regex/keyword/phrase)별 평가
   c. 평가 대상 텍스트 — finding.location의 매칭 텍스트 + **주변 문맥 (같은 문장)**
   d. 매칭 성공 시 본 finding은 결과에서 제거 (로그·audit에는 보존)
4. 1개라도 ContextException이 매칭하면 finding 제거 (OR 결합)
```

> "같은 위치" 조건은 **같은 문장 내**(KSS 분리 기준)에서 ContextException.pattern이 매칭하면 적용 — finding.location 정확히 일치할 필요 없음 (안전 권유 표현이 같은 문장에 있으면 룰 매칭 무력화).

---

## 5. LLM 보조 인터페이스

### 5.1 활성화 조건

- `features[name="compliance-assistant"].config.llmAssist === true` (DATA_MODEL C-08)
- 어드민 모드에서만 사용 (빌드 모드는 결정성 우선)
- API 키는 인스턴스별 비밀 보관소에 저장 (운영 정책)

### 5.2 LLM 호출 시점

다음 시점에서 LLM 보조 분석 호출:
- 정적 룰 매칭 결과 + 자동 추론 결과가 어드민 검수 큐 진입 트리거 (`gateRequired=true`)
- 어드민 검수자가 "LLM 분석 요청" 액션 명시
- 정적 룰의 false-negative 의심 — 운영자 수동 요청

### 5.3 프롬프트 구조

```
[시스템]
당신은 의료기관 콘텐츠의 의료광고법 준수를 검토하는 보조 분석기입니다.
의료법 제56조·제57조 + 시행령 제23조·제24조 + MEDICAL_AD_COMPLIANCE_COMMON.md § 3 카탈로그 기반.

[입력]
- 콘텐츠 본문 (Markdown)
- 페이지 타입·ArticleType·페이지 위험도
- 정적 룰 검수 결과 (findings[])

[요청]
1. 정적 룰이 놓친 표현 위험 항목 식별
2. 각 항목에 의료법 조문 매핑
3. severity 제안 (info | warning | fail | content-gate)
4. 대체 표현 제안

[출력 형식]
JSON — § 5.4
```

### 5.4 LLM 출력 형식

```ts
type LlmAssistResult = {
  additionalFindings: Finding[];        // 정적 룰이 놓친 finding (제안). § 5.4.1 규약 적용
  reanalyzedFindings: Array<{          // 정적 룰 finding의 재평가
    ruleId: string;
    suggestedSeverity?: Severity;
    reasoning: string;
  }>;
  overallAssessment: string;            // 자연어 종합 분석
  confidence: number;                   // 0~1, LLM의 분석 신뢰도
  modelId: string;                      // 호출 모델 ID
  promptVersion: string;
  invocationCost?: { inputTokens: number; outputTokens: number };
};
```

#### 5.4.1 LLM additionalFindings의 Finding 채움 규약

- **ruleId**: 정적 룰 카탈로그 미등록 항목 — **결정적 synthetic ID** 사용. `llm-suggestion-<hash>-<seq>` 형식.
  - hash = SHA-256(category + span.start + span.end + 매칭 텍스트) 8문자 prefix
  - seq = **canonical sort 후 동일 hash 내 순번** (0부터 시작). canonical sort 키 = (category 알파벳 순 → reasoning 텍스트 SHA-256 hash 사전순). LLM 출력 순서 변경에 영향받지 않음. offset 산정 실패(`location={0,0}`·`pattern=""`) 케이스에서도 안정 참조 보장
  - 동일 본문·동일 위치·동일 카테고리·동일 순번은 항상 같은 ID 생성 (LLM 비결정성 영향 없음). audit·warning acknowledgement·검수자 수락 등의 finding 참조 안정성 보장
- **category**: LLM이 분류한 의미적 카테고리 — 기존 카탈로그 카테고리와 일치하면 그대로, 새로운 카테고리는 자유 문자열 허용
- **pattern**: 매칭 텍스트 그대로 (offset 산정 가능 시) 또는 빈 문자열 (불가 시)
- **location**: 본문 내 정확한 offset 산정 가능 시 채움. 산정 실패 시 `{ start: 0, end: 0 }` (메타·콘텐츠 전체 의미)
- **triggeredBy**: `"llm-assist"` 명시 (CONTENT_STANDARDS § 7.2 Finding 메타)
- **llmAssistMeta**: 모델·프롬프트 버전·신뢰도 기록

### 5.5 LLM 결과 처리 — human-in-loop·저장 슬롯

- LLM 출력의 `additionalFindings`는 **자동 적용하지 않음** — 검수자에게 제안으로 노출
- 신뢰도(confidence) 0.7 미만은 검수자 화면에서 별도 강조 표시
- LLM 출력 자체는 audit log에 기록 (prompt·response·model·timestamp)

**저장 슬롯**:
- LLM 호출 결과 원본 — `ComplianceRecord.autoCheckResult.llmAssist`(DATA_MODEL C-10 cascade — autoCheckResult 객체 내 신규 영역. CA-08)
- 검수자가 명시 수락한 LLM finding — ComplianceCheckResult.findings[]에 정상 Finding으로 누적 (triggeredBy="llm-assist") + audit log에 수락 액션 기록 (actor·timestamp·메모)

---

## 6. RiskInference 통합

### 6.1 자동 추론 산출

RISK_LEVELS § 2.3 알고리즘 그대로 적용. 본 Feature가 구현 책임.

### 6.2 inlineRiskFlags 추출 (RISK_LEVELS § 5.1)

**inlineRiskFlag enum 5종** (RISK_LEVELS § 5.1):
- `includes-effect-claim`
- `includes-pricing`
- `includes-event`
- `includes-before-after`
- `includes-testimonial`

**추출 알고리즘** — `includes-effect-claim`은 § 4 RiskRule 매칭 결과의 `category` 집합(7개 카테고리: 효과 단정·전문성 단정 단독·전문성 단정 결합·보장·수치/기간 단정·수치/기간 보장·체질 맞춤) 중 1개 이상 매칭 시 활성. 나머지 4개 flag는 RISK_LEVELS § 5.1 표의 정규식·어휘 매칭. § 4.1 실행 순서 5단계.

### 6.3 컨텍스트별 false-positive 완화 (RISK_LEVELS § 5.1.2)

- LegalDocument.documentType별 제외
- LocationProfile 안내 필드 제외
- Article articleType=notice 제외
- 본 완화는 RiskLevel 격상 단계만 — `inlineRiskFlags[]` 출력에는 포함 (감사 정보)

---

## 7. 룰 카탈로그 로드

### 7.1 로드 순서 (RISK_LEVELS § 3.4)

```
0. **meta.yaml 우선 로드** — loadOrder 인덱스 읽음 (§ 4.1 단계 1과 동일)
1. meta.yaml.loadOrder.rules[] 순서로:
   rules.core.yaml → rules.medical-ad.yaml → rules.preset-<presetSlug>.yaml
2. meta.yaml.loadOrder.contextExceptions[] — context-exceptions.yaml (별도 컬렉션)
3. meta.yaml.loadOrder.tracking[] — medical-law-tracking.yaml (개정 추적)
```

### 7.2 머지·overrides

- RISK_LEVELS § 3.4.1·§ 3.4.2 머지 알고리즘 그대로 적용
- 동일 `id` 중복 fail
- `overrides[]`는 최대 1개 (중복 fail)

### 7.3 로드 캐시

- 룰 카탈로그는 빌드 1회당 1회 로드. 메모리 캐시
- 카탈로그 변경 시 (meta.yaml `catalogVersion` 갱신) 캐시 무효화
- 어드민 핫리로드 — 어드민 콘솔에서 카탈로그 다시 로드 액션

---

## 8. 캐시·idempotency·재실행

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

| 지표 | 정의 | 목표 |
|---|---|---|
| **빌드 모드 처리 시간** (per content) | 정적 룰 checker만 | < 50ms (p95) |
| **어드민 모드 처리 시간** (per content, LLM 포함) | LLM 호출 포함 | < 5초 (p95) |
| **운영 TTL cache hit ratio** | TTL hit / (hit + miss) | > 70% (어드민 모드 운영 누적 후) |
| **영속 결과 cache hit ratio** | 영속 hit / (영속 hit + miss) | > 50% (운영 누적 후) |
| **LLM 호출 실패율** | LLM API 오류·타임아웃 | < 1% |
| **operator-acknowledged ratio** | warning 중 operator가 "acknowledged"(인정)로 종결한 비율. **false-positive 추정 보조 지표만** (acknowledged ≠ false-positive 직접) | < 30% (M2+ 운영 누적, 운영 감 추적용) |
| **operator-resolved ratio** | warning 중 operator가 "resolved"(본문 정정)로 종결한 비율 | M2+ 누적 후 baseline 산정 |
| **LLM-accepted finding ratio** | LLM 제안 중 검수자가 수락한 비율. **false-negative 추정 보조 지표만** (수락된 LLM finding이 정적 룰 false-negative 직접 지칭하지 않음) | < 10% (M2+, baseline 후 hard target) |

> ⚠️ **precision/recall 정확한 산정**: 본 Feature의 false-positive·false-negative 정확 산정은 **외부 정답지(ground truth)** 가 필요. v1.0에서는 operator/검수자 액션 기반 보조 지표만 제공. 정답지 운영은 M3+ 누적 후 결정 (CA-09).

### 9.2 측정·로깅

- 모든 ComplianceCheckResult 호출에 timing 메트릭 기록
- LLM 호출 — 모델·토큰·비용·결과 audit log
- false-positive/negative — 검수자 acknowledged 로그 기반 자동 집계 (M2+)

### 9.3 알림

- LLM API 실패율 1% 초과 — 운영팀 알림
- 처리 시간 SLO 미달 (p95 기준) — 일일 요약

---

## 10. 설치·설정

### 10.1 빌드 단계

```bash
# 1. Feature 활성화 (InstanceManifest.features[])
# 2. 룰 카탈로그 파일 작성 (data/compliance-rules/)
# 3. LLM 키 설정 (옵션 — .env 또는 비밀 보관소)
# 4. 빌드 시 자동 실행
```

### 10.2 InstanceManifest 설정 예시

```yaml
features:
  - name: "compliance-assistant"
    version: "1.0.0"
    enabled: true
    config:
      llmAssist: true
      llmProvider: "anthropic"
      llmModel: "claude-sonnet-4-6"
      llmApiKeySecretRef: "ANTHROPIC_API_KEY"
      cacheEnabled: true
      cacheTtlSeconds: 86400
      strictMode: false              # true 시 warning도 빌드 차단 (운영 정책)
```

### 10.3 비활성화 — 예외 승인 인스턴스 한정

본 Feature는 **의료기관 인스턴스에서 강제 활성이 기본**. 비활성은 다음 흐름으로만 허용:

1. **표준 정책**: 의료기관 인스턴스는 `features[name="compliance-assistant"].enabled=true` 의무. InstanceManifest 검증 시 비활성 인스턴스는 빌드 fail
2. **예외 승인 트랙**: 클라이언트가 비활성 요청 시 — Glitzy 슈퍼 어드민 승인 + 책임 면제 합의서 첨부 후 인스턴스에 `complianceAssistantExemptApproval` 객체 설정 (DATA_MODEL C-08 v0.12 cascade 완료). 본 객체가 있을 때만 비활성 허용. 필드: `approvedBy`·`approvedAt`·`exemptionAgreementUrl`·`reason`
3. **비활성 인스턴스의 REVIEW_WORKFLOW 영향**:
   - ComplianceCheckResult 미생성 → REVIEW_WORKFLOW § 7.1 (1) `automatedDecision !== "block"` 조건은 자동 통과로 간주
   - **finalRoles 산정** — 비활성 모드에서는 룰 매칭이 없으므로 `requiredApproverRoles[]`는 비어 있음. 다음 기본 게이트는 룰 매칭 없이도 자동 보존 (REVIEW_WORKFLOW § 4.1):
     - `operator` (peerReviewer) — 전 콘텐츠 공통 필수
     - `medical` — riskLevel ∈ {Medium, High} 시 (Medium/High 판정은 어드민 수동)
     - `legal` — `contentType === "LegalDocument"` 시 자동 (C-10·C-16 required)
     - `legal` — `priorReviewRequired === true` 시 자동 (legal 검수자의 매체 판정 단계)
   - **ArticleType 기반 추가 역할** — 어드민이 수동 명시:
     - `review-case`·전후사진 노출 콘텐츠 → `["medical", "legal"]` (수동)
     - `event-price` → `["legal"]` (수동)
   - 비활성 모드 finalRoles는 운영자/검수자가 수동 결정·기록 (audit log)
   - 어드민 발행 화면에 영구 경고 배너 표시 (비활성 사유·예외 승인 ID·일자)
4. **책임 한계**: 비활성 인스턴스의 의료광고법 위반 리스크는 운영자/클라이언트 자체 책임 (예외 승인 합의서에 명시)

---

## 11. 빌드 검증 — 룰 레벨

| 레벨 | 본 Feature 영역 |
|---|---|
| **fail** | 룰 카탈로그 JSON Schema 검증 실패, **본 Feature `enabled=true` + 룰 카탈로그 부재**(`data/compliance-rules/` 미생성·meta.yaml 없음), LLM 활성화 + API 키 부재 (어드민 모드), composite 룰 평가 오류, RiskInference 입력 누락 |
| **warning** | LLM 호출 타임아웃·재시도 후 실패 (어드민 모드만), KSS 미설치로 fallback 사용 시 |
| **content-gate** | (본 Feature는 결과만 산출 — content-gate 직접 적용 없음. 출력 결과로 어드민 워크플로가 큐 진입 결정) |

> § 9.1 운영 지표(cache hit ratio·처리 시간 SLO 등)는 빌드 검증 룰이 아닌 **운영 관측·알림 영역** — § 9.3 알림 처리.

> **룰 카탈로그 부재 fail 분기**: 본 Feature `enabled=false` (예외 승인 인스턴스, § 10.3) 시 룰 카탈로그 부재는 fail 아님. M0/M1 초기 구현 단계에서는 본 Feature 활성화 + 룰 카탈로그 작성 동시 진행이 표준. MEDICAL_AD_COMPLIANCE_COMMON § 0 "checker 활성화 이후 fail" 조건과 정합.

---

## 12. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| CA-01 | LLM 모델 선택·계약 — Anthropic Claude vs OpenAI GPT vs 자체 모델 | 운영 결정 |
| CA-04 | LLM 프롬프트 버전 관리·운영 — 본 문서 vs 별도 파일 | M2+ 운영 |
| CA-05 | LLM 비용 budget·인스턴스별 한도 | 운영 정책 |
| CA-06 | request deduplication 구현 — Redis vs 메모리 lock | 인프라 결정 |
| CA-07 | strictMode 정책 — 인스턴스별 vs Glitzy 표준 | 운영 정책 |
| CA-09 | precision/recall 정답지(ground truth) 운영 | M3+ 누적 |

### 12.1 해소된 미결정

| ID | 항목 | 해소 |
|---|---|---|
| ~~CA-02~~ | DATA_MODEL C-08 features[] config cascade | v0.2 — DATA_MODEL C-08 v0.10 cascade로 `features[].config` 필드 추가 |
| ~~CA-03~~ | 한국어 문장 분리 라이브러리 | v0.2 — KSS v3+ 채택. fallback은 정규식 |
| ~~CA-08~~ | ComplianceRecord.autoCheckResult.llmAssist 영역 | v0.3 — DATA_MODEL C-10 v0.11 cascade로 `autoCheckResult.llmAssist.invocations[]` 구조 명시 (promptVersion·modelId·requestId·requestedAt·response·costTokens) |
| ~~CA-10~~ | complianceAssistantExemptApproval 플래그 | v0.4 — DATA_MODEL C-08 v0.12 cascade로 `complianceAssistantExemptApproval` 필드 신설 (approvedBy·approvedAt·exemptionAgreementUrl·reason) |

---

## 13. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 — Feature 메타·Core 의존성·InstanceManifest 통합, 입력/출력(CONTENT_STANDARDS § 7 인터페이스 적용), 빌드 파이프라인 9단계 + 빌드 모드/어드민 모드 분리, composite 룰·contextExceptions 평가, LLM 보조 인터페이스·프롬프트·출력 형식·human-in-loop, RiskInference·inlineRiskFlags 통합, 룰 카탈로그 로드(RISK_LEVELS § 3.4 정합), 캐시·idempotency·재실행, 운영 지표 6종·SLO, 설치·설정, 빌드 검증 룰 |
| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (5개 지적 전건 수용)**: (1) § 3.1·§ 3.3 inferredRiskLevel을 CONTENT_STANDARDS § 7.1 SoT 정합으로 — 외부 채워 전달은 신뢰 사용, 미지정 시 내부 자동. (2) **RISK_LEVELS § 2.3.1 cascade** — RiskInferenceResult.steps[] 표준화. triggeredBy 판정 근거를 SoT에 정식 정의, (3) § 3.3 내부 동작 순서에서 inlineRiskFlags 추출을 flag별 산출 방식 분리로 정정 (잔재 해소), (4) § 10.3 비활성 모드 finalRoles에 LegalDocument legal·priorReviewRequired legal 기본 게이트 자동 보존 명시 (REVIEW_WORKFLOW § 4.1 정합), (5) cacheKey에 `strictMode` 포함 — automatedDecision 산출에 영향 |
| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (7개 지적 전건 수용)**: (1) § 3.3 입력 보강 계약 — pageTypeId 미지정 시 contentType+pageMeta 유도, 유도 불가 시 fail. articleType은 contentType=Article 시 필수, (2) § 4.1 7단계 High 가상 finding `triggeredBy` 판정 — RiskInferenceResult.steps 기반. explicit 우선, (3) § 4.1 5단계 inlineRiskFlags 추출 정밀화 — flag별 산출 방식 분리. includes-effect-claim만 category 기반, 나머지 4종은 정규식·ReviewPolicy·미디어 입력, (4) § 5.4.1 LLM ruleId seq를 canonical sort 후 순번으로 — LLM 출력 순서 불변, (5) § 8.1 cacheKey에 `reviewPolicyHash`·`mediaAttachmentsHash` 추가, (6) § 10.3 "DATA_MODEL cascade 후속" 잔재 문구 정정 — v0.12 완료 명시, (7) § 10.3 비활성 모드 finalRoles 산정 정의 — 운영자 수동 결정·audit 기록 |
| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (7개 지적 전건 수용)**: (1) § 3.1 inferredRiskLevel 입력 주석을 "호환 입력 — 내부 재계산" 정합, (2) § 7.1 meta.yaml 우선 로드 정정 (§ 4.1과 일치), (3) § 4.1 High 가상 finding 단독 구현 정보 완전화 — ruleId·severity·requiredApproverRoles override 명시, (4) § 5.4.1 LLM ruleId 충돌 회피 — seq 순번 추가, (5) § 6.2 inlineRiskFlags enum 5종 vs extract category 7종 분리 표현, (6) § 8.1 cacheKey — inferredRiskLevel 제거, slotMatches 포함, (7) **DATA_MODEL C-08 v0.12 cascade** — `complianceAssistantExemptApproval` 필드 신설 (CA-10 해소) |
| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 3.3 check() 순서 설명을 § 4.1 실제 실행 순서와 일치시킴 (룰 매칭 → inlineRiskFlags → RiskInference), (2) inferredRiskLevel 외부 입력 처리 명확화 — check() 내부 항상 재계산. 외부 입력 신뢰 사용 안 함, (3) § 4.1 meta.yaml 우선 로드 — loadOrder가 로드 계획 기준임을 명시, (4) activeFeatures/id 잔재 정정 — `features[name=]` 통일, (5) § 5.4.1 LLM synthetic ruleId를 결정적 ID(SHA-256 hash)로 — finding 참조 안정성 보장, (6) **DATA_MODEL C-10 v0.11 cascade** — `autoCheckResult.llmAssist.invocations[]` 구조 명시 (CA-08 해소), (7)·(8) § 8.4 룰 카탈로그 변경 처리 — 본 Feature는 staleFlags만 갱신, 재호출은 어드민 재검수 큐 트리거 (REVIEW_WORKFLOW 정합), (9) § 10.3 비활성화를 예외 승인 인스턴스 한정으로 정정 — `complianceAssistantExemptApproval` 플래그 (CA-10), (10) § 11 룰 카탈로그 부재 fail 분기 명시 — enabled=true일 때만 |
| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (18개 지적 전건 수용)**: (1) **DATA_MODEL C-08 features[] 필드명 정합 + `config` cascade**(v0.10) — activeFeatures[] → features[]. CA-02 해소, (2) Feature 메타 specVersion 0.1 명시 (문서 상태와 분리), (3) LLM 의존성 — anthropic 권장 default + provider 옵션 명시, (4) § 3.3 단일 엔트리포인트 `check()` 명시 — RiskInference는 내부 자동, (5)·(7) § 4.1 실행 순서 재정렬 — RiskRule 매칭 후 inlineRiskFlags 추출. Finding[]은 모든 매칭 보존(우선순위는 집계만 흡수), (6) 룰 카탈로그 로드 파일 6개로 통일, (8) § 4.6 Finding 메타 확장 — `triggeredBy`·`llmAssistMeta` cascade (CONTENT_STANDARDS § 7.2 v1.3), (9) § 4.3 KSS v3+ 채택 명시 + UTF-16 offset (CA-03 해소), (10) § 4.4 contextExceptions 평가 알고리즘 강화 — patternType별 평가 + 같은 문장 내 적용, (11) § 5.4.1 LLM additionalFindings 채움 규약 — synthetic ruleId·offset 산정 실패 처리, (12) § 5.5 LLM 결과 저장 슬롯 — `ComplianceRecord.autoCheckResult.llmAssist`(CA-08 신설) + 검수자 수락 시 findings[]에 누적, (13)·(14) § 8.1·§ 8.2 cacheKey 완전화 + 영속 결과 캐시 vs 운영 TTL 캐시 2종 분리, (15) § 8.4 룰 카탈로그 변경 시 staleScope.kind별 분기 처리 + finding ruleId 역색인, (16) § 9.1 운영 지표 precision/recall 보조 지표로 명확화 (CA-09 ground truth 미결정), (17) § 11 빌드 검증 룰에서 운영 지표 항목 제거 — § 9 알림 영역으로 분리, (18) § 10.3 비활성화 시 REVIEW_WORKFLOW publishable 영향 + § 10.3.1 강제 활성 정책 명시 |
