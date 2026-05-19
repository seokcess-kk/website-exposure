# Compliance — 위험도 등급·룰 데이터·검수자 통과 기준

> **상태**: **v1.2 구현 명세 안정판** (compliance-assistant v1.0 cascade — § 2.3.1 RiskInferenceResult.steps 표준화)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 4, § 9
> **목적**: RiskLevel(Low/Medium/High) 자동 추론 알고리즘, RiskRule 데이터 파일 위치·포맷·버전 관리, ApproverRole(medical/legal/operator/client) 통과 기준, inlineRiskFlags 자동 추출, 위험도 자동 동작 매트릭스를 단독 구현 가능한 명세로 정의.
> **외부 공유 시 주의**: 상위 문서와 동일.
> **연관 문서**:
> - 콘텐츠 표현 룰 SoT → `core/CONTENT_STANDARDS.md` (§ 4·§ 7)
> - 데이터 계약 — RiskLevel·ComplianceRecord → `core/DATA_MODEL.md` (C-05·C-10)
> - 페이지 타입별 위험도 기본값 → `core/PAGE_TYPES.md` (§ 3)
> - ArticleType별 위험도 기본값 → `core/CONTENT_STANDARDS.md` (§ 6)
> - 의료광고 공통 가이드 → `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` (후속)

---

## 0. 한 페이지 요약

- **본 문서가 단일 SoT**: (1) RiskLevel 자동 추론 알고리즘, (2) RiskRule 데이터 파일 포맷, (3) ApproverRole 통과 기준(content-gate 발행 조건), (4) inlineRiskFlags 자동 추출 규칙
- **RiskLevel 3종**: `Low` / `Medium` / `High` — DATA_MODEL C-05 enum 그대로 사용
- **자동 추론 = MAX 결합**: 페이지 타입 기본 + ArticleType 기본 + 슬롯 격상 + inlineRiskFlags 격상 + explicitRiskLevel override의 **최대값**으로 최종 등급 결정
- **RiskRule 데이터 파일**: `data/compliance-rules/` 디렉토리, YAML 포맷, JSON Schema 검증, 의료법 개정 시 MAJOR 버전
- **content-gate 발행 조건 = AND 3종**: (a) `operator` 공통 필수(C-10 peerReviewer required) + (b) 등급 기본 요구(Medium/High면 `medical`) + (c) 룰 추가 요구(`requiredApproverRoles[]`) — 세 조건 모두 충족 + 각 역할의 ComplianceRecord 슬롯 기록 완료 + 본 문서 § 4 통과 기준 충족
- **inlineRiskFlags 5종**: `includes-effect-claim`·`includes-pricing`·`includes-event`·`includes-before-after`·`includes-testimonial` (DATA_MODEL C-04 정합)

---

## 1. 일반 규약

### 1.1 변경 정책

| 변경 유형 | 버전 영향 | 비고 |
|---|---|---|
| RiskLevel enum 변경 | **MAJOR** | DATA_MODEL C-05 cascade 필수 |
| 자동 추론 알고리즘 변경 (강화) | **MAJOR** | 기존 콘텐츠의 위험도 격상 가능 — 마이그레이션 가이드 필수 |
| 자동 추론 완화 | MINOR | 기존 콘텐츠 영향 없음 |
| RiskRule 추가 (warning/content-gate) | MINOR | |
| RiskRule 추가 (fail) | **MAJOR** | 빌드 차단 가능 |
| RiskRule 패턴 정정 (false-positive 감소) | PATCH | |
| 의료법 개정 대응 룰 갱신 | **MAJOR** | 본 문서 § 7.1 의료법 개정 추적 표 동시 갱신 |
| ApproverRole 통과 기준 변경 | **MAJOR** | 운영 정책 영향 |

### 1.2 SoT 원칙

- 본 문서는 **운영·구현 SoT** — `compliance-assistant` Feature Module과 어드민 검수 워크플로가 본 문서를 입력으로 받음
- 의료광고 **표현 룰의 카탈로그 SoT**는 `core/CONTENT_STANDARDS.md` § 4 — 본 문서는 카탈로그를 RiskRule 데이터 파일로 변환·운영하는 책임만
- 의료법 조문·사례 풍부화·인용 가능 외부 도메인 화이트리스트는 `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` 후속

---

## 2. RiskLevel — 정의·자동 추론

### 2.1 RiskLevel enum

`Low | Medium | High` — DATA_MODEL C-05 정의. 본 문서는 등급간 비교를 위해 정수 사상을 사용:

```ts
const RISK_ORDER = { Low: 0, Medium: 1, High: 2 } as const;
// max(level1, level2) — 등급 결합 시 더 높은 등급 채택
```

### 2.2 자동 추론 입력

```ts
type RiskInferenceInput = {
  pageTypeId: PageTypeId;             // PAGE_TYPES § 3 — 페이지 기본 등급
  articleType?: ArticleType;          // P-010 Article일 때만. DATA_MODEL C-04 enum
  inlineRiskFlags: InlineRiskFlag[];  // 본문에서 자동 추출 (§ 5)
  slotMatches: SlotMatch[];           // PAGE_TYPES § 3 슬롯 격상 조건 매칭 결과
  explicitRiskLevel?: RiskLevel;      // CONTENT_STANDARDS § 7.1 ComplianceCheckInput.metadata.explicitRiskLevel — 어드민이 본 입력 슬롯에 명시한 override. 자동 추론 결과(ComplianceRecord.pageRiskLevel 출력)를 다시 본 입력으로 받지 않음 (순환 금지). 저장 SoT는 어드민의 입력 메타데이터 슬롯이며, 자동 추론 출력은 별도 (§ 6)
};

type SlotMatch = {
  pageTypeId: PageTypeId;
  slotId: string;                     // PAGE_TYPES § 3 슬롯 ID (예: "P-006-content-results")
  triggeredLevel: RiskLevel;
};
```

### 2.3 자동 추론 알고리즘

```
1. base = PAGE_TYPES § 3에서 정의된 pageTypeId 기본 등급
2. if articleType: base = max(base, CONTENT_STANDARDS § 6 articleType 기본 등급)
3. for each inlineRiskFlag in inlineRiskFlags: base = max(base, FLAG_LEVEL[flag])
4. for each slotMatch: base = max(base, slotMatch.triggeredLevel)
5. if explicitRiskLevel: final = max(base, explicitRiskLevel)
6. else: final = base
7. return final
```

`explicitRiskLevel`은 격하 불가 — 항상 MAX 결합. ComplianceRecord 운영자가 명시 격상만 가능.

#### 2.3.1 RiskInferenceResult — evaluatedSteps + contributingSteps (v1.3 cascade · COMPLIANCE_ASSISTANT_PHASE_ALPHA v1.0 CAP-12)

```ts
type RiskInferenceResult = {
  inferredRiskLevel: RiskLevel;     // MAX 결합 결과 (단계 7 final)
  evaluatedSteps: InferenceStep[];   // 모든 source evaluation (audit 완전성)
  contributingSteps: InferenceStep[]; // base 갱신 source만 (triggeredBy 판정 핵심)
};

type InferenceStep = {
  source: "pageType" | "articleType" | "inlineRiskFlag" | "slotMatch" | "explicitRiskLevel";
  sourceValue: string;             // 예: "P-006", "review-case", "includes-pricing", "P-006-content-results"
  level: RiskLevel;                // 본 source가 기여한 등급
};
```

- `evaluatedSteps[]` — 단계 1~5 모든 source 가 평가되어 push (audit 완전성). 같은 등급 source 도 모두 보존.
- `contributingSteps[]` — base 갱신된 source 만 push (triggeredBy 판정 시 explicit High 최우선 단일 검사 후 fallback).
- 기존 단일 `steps[]` 표현은 deprecated — Phase Alpha v1.0 부터 두 배열 분리. 호환성 위해 readonly alias `steps = contributingSteps` 임시 제공 가능 (구현자 판단).

- 각 단계 1~5에서 base가 갱신될 때마다 steps[]에 항목 추가
- triggeredBy 판정에 사용 (admin/REVIEW_WORKFLOW·features/compliance-assistant § 4.1 7단계)

### 2.4 inlineRiskFlag별 등급 매트릭스 (`FLAG_LEVEL`)

| InlineRiskFlag | 격상 등급 | 의미 |
|---|---|---|
| `includes-effect-claim` | **High** | 본문에 § 4.1 fail/content-gate 효과 단정 표현 검출 |
| `includes-pricing` | **High** | 본문에 가격 정보(통화·숫자+원·달러 등) 검출 — 의료광고법 비급여 명시 의무 |
| `includes-event` | **High** | 본문에 할인·이벤트·기간 한정 어휘 검출 |
| `includes-before-after` | **High** | 본문에 전후사진 또는 "전후"·"비포어 애프터" 어휘 검출 |
| `includes-testimonial` | **High** | 본문에 환자 후기 인용·치료경험담 검출 |

> 단일 flag 발생만으로 High 격상. 페이지 타입 기본이 Low여도 본문이 위 항목 1개라도 포함하면 페이지 전체 High → 검수 큐 강제 진입(`CONTENT_STANDARDS.md` § 7.1.2).

### 2.5 페이지 타입 기본 등급 (참조 — PAGE_TYPES § 3 SoT)

| 페이지 | 기본 등급 |
|---|---|
| P-001 Home, P-002 About, P-003 Doctors List, P-004 Doctor Profile, P-005 Treatments List, P-007 Conditions List, P-009 Articles List, P-011 FAQ, P-012 Contact, P-013 Legal, P-014 Location, P-105 Reservation | Low |
| P-006 Treatment Detail, P-008 Condition Detail, P-103 Facilities, P-106 Self-test | Medium |
| P-010 Article Detail | ArticleType별 (§ 6 CONTENT_STANDARDS — Low~High) |
| P-101 Reviews, P-102 Pricing, P-104 News·Event(event 카테고리) | High |

> 본 표는 PAGE_TYPES § 3의 캐시 — PAGE_TYPES 변경 시 본 표 cascade.

---

## 3. RiskRule 데이터 파일

### 3.1 위치·디렉토리 구조

```
data/compliance-rules/
├── rules.core.yaml             # § 4.1 CONTENT_STANDARDS 표 → 데이터 변환 (Core 룰)
├── rules.medical-ad.yaml       # 의료법·시행령 기반 룰 (MEDICAL_AD_COMPLIANCE_COMMON 후속)
├── rules.preset-<presetSlug>.yaml     # preset별 특유 표현. <presetSlug>은 `presets/<presetSlug>/` 디렉토리명과 동일 (kebab-case, 예: `hanui-clinic`)
├── context-exceptions.yaml     # CONTENT_STANDARDS § 4.4 문맥 예외 카탈로그 (§ 3.4.3 스키마)
├── medical-law-tracking.yaml   # 의료법 개정 추적 (§ 7.1.2)
└── meta.yaml                   # 룰 카탈로그 메타데이터·버전 인덱스 (§ 3.4.1)
```

- 파일 단위 분리 — 변경 추적·diff 친화
- `meta.yaml`은 전체 카탈로그 버전·로드 순서·의존성을 인덱스

### 3.2 파일 포맷 — YAML + JSON Schema

YAML로 작성 (사람 가독·다중 라인 정규식 친화), 빌드 시 JSON Schema로 검증.

**예시 — `rules.core.yaml`**:

```yaml
version: "1.0.0"
sourceDoc: "core/CONTENT_STANDARDS.md#4.1"
sourceDocVersion: "1.0"

rules:
  - id: "supremacy-001"
    category: "최상급"
    pattern: '(최고의|최저가|최대|최강|1위|국내 유일|세계 최초|세계 최고)'
    patternType: "regex"
    severity: "fail"
    scope:
      - { type: "global" }
    rationale: "의료법 제56조 — 최상급 표현 금지"
    version: "1.0.0"
    createdAt: "2026-05-14T00:00:00Z"
    updatedAt: "2026-05-14T00:00:00Z"

  - id: "guarantee-composite-001"
    category: "보장 결합 강조"
    patternType: "composite"
    operands:
      - { pattern: '(100%|반드시|절대|확실히)', patternType: "regex" }
      - { pattern: '(효과|결과|호전|개선|치유|보장)', patternType: "regex" }
    logic: "AND_IN_SENTENCE"
    severity: "fail"
    scope:
      - { type: "global" }
    contextExceptions:
      - kind: "safety"
        pattern: '(반드시|꼭) (의료진과 )?(상담|확인)하세요'
    rationale: "의료법 제56조 + § 4.1 전문성 단정 + 보장 결합"
    version: "1.0.0"
    createdAt: "2026-05-14T00:00:00Z"
    updatedAt: "2026-05-14T00:00:00Z"
```

### 3.3 JSON Schema 검증 — `data/compliance-rules/schema.json`

빌드 시 다음 항목 검증. CONTENT_STANDARDS § 7.4 RiskRule(SimpleRiskRule + CompositeRiskRule) 전체 스키마를 검증할 수 있어야 한다.

**기본 식별·메타**
| 검증 항목 | 룰 레벨 |
|---|---|
| `id` 중복 (전체 파일 합집합) | **fail** |
| `id` 형식 (`^[a-z][a-z0-9-]*[a-z0-9]$`, kebab-case) | **fail** |
| `category` 비어 있음 | **fail** |
| `version` SemVer 형식 위반 | **fail** |
| `createdAt`·`updatedAt` ISO 8601 형식 위반 | **fail** |
| `sourceDoc` URL/경로 형식 위반 | warning |
| `sourceDocVersion` SemVer 형식 위반 | warning |

**Simple/Composite 구분**
| 검증 항목 | 룰 레벨 |
|---|---|
| `patternType` enum 외 값 (`regex`·`keyword`·`phrase`·`composite`) | **fail** |
| Simple — `pattern` 누락 | **fail** |
| Simple — `pattern` regex 컴파일 실패 (`patternType="regex"` 시) | **fail** |
| Composite — `operands[]` 길이 < 2 | **fail** |
| Composite — `logic` enum 외 값 (`AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR`) | **fail** |
| Composite — `logic="AND_NEAR"` + `window` 누락 또는 ≤ 0 | **fail** |
| Composite — 각 `operands[].pattern` regex 컴파일 실패 | **fail** |

**severity·scope·roles**
| 검증 항목 | 룰 레벨 |
|---|---|
| `severity` enum 외 값 (`info`·`warning`·`fail`·`content-gate`) | **fail** |
| `scope[]` 빈 배열 | **fail** |
| `scope[].pageTypeId` PAGE_TYPES § 3 미정의 | **fail** |
| `scope[].articleType` CONTENT_STANDARDS § 6 enum 미정의 | **fail** |
| `scope[].contractId` DATA_MODEL § 4·§ 5 미정의 | **fail** |
| `scope[].fieldPath` `contractId`가 가리키는 계약의 실제 필드 경로 미존재 (dot notation 검증) | **fail** |
| `scope[].blockType` enum 외 값 (`qa`·`list`·`table`·`callout`·`citation`·`media`) | **fail** |
| `scope[].featureContentType` 정규식 `^feature:[a-z][a-z0-9-]*[a-z0-9]$` 위반 | **fail** |
| `scope[].featureContentType` 존재 + `scope[].type != "feature"` | **fail** |
| `scope[].type = "feature"` + `featureContentType` 누락 | **fail** |
| `scope[].type = "pageType"` + `pageTypeId` 누락 / `type="articleType"` + `articleType` 누락 / `type="block"` + `blockType` 누락 / `type="field"` + (`contractId` 또는 `fieldPath` 누락) | **fail** |
| `severity="content-gate"` + `requiredApproverRoles[]` 누락 | **fail** |
| `requiredApproverRoles[]` 항목이 ApproverRole enum(`medical`·`legal`·`operator`·`client`) 외 | **fail** |
| `severity` ∈ {`info`·`warning`·`fail`} + `requiredApproverRoles[]` 명시 | warning (현재 운영상 무시되지만 향후 정책 변경 대비 — § 3.3.1 참조) |
| `contextExceptions[].kind` enum 외 값 (`safety`·`warning-message`·`administrative`) | **fail** |
| `contextExceptions[].pattern` regex 컴파일 실패 | **fail** |
| `suggestion` 1,000자 초과 | warning |
| `exceptions[]` 항목 빈 문자열 | **fail** |
| `exceptions[]` 항목 regex 패턴인 경우 컴파일 실패 | **fail** |
| `legalBasis[]` 항목 형식 위반 (`^[a-z][a-z0-9-]*[a-z0-9]$` 또는 `MEDICAL_AD_COMPLIANCE_COMMON § 3` 식별자) | warning |
| `legalBasis[]` 항목이 medical-law-tracking 카탈로그에 미존재 (활성화 후) | warning |

**context-exceptions.yaml** (§ 3.4.3 스키마)
| 검증 항목 | 룰 레벨 |
|---|---|
| `exceptions[].id` 중복 (파일 내 + 카탈로그 전체) | **fail** |
| `exceptions[].id` 형식 (`^[a-z][a-z0-9-]*[a-z0-9]$`, kebab-case) | **fail** |
| `exceptions[].kind` enum 외 값 (`safety`·`warning-message`·`administrative`) | **fail** |
| `exceptions[].pattern` 누락 또는 빈 문자열 | **fail** |
| `exceptions[].pattern` regex 컴파일 실패 | **fail** |
| `exceptions[].patternType` enum 외 값 (`regex`·`keyword`·`phrase`) | **fail** |
| `exceptions[].appliesTo.categories[]` + `appliesTo.ruleIds[]` 모두 빈 배열 | **fail** |
| `exceptions[].appliesTo.ruleIds[]` 항목이 카탈로그의 RiskRule.id 미존재 | **fail** |
| `exceptions[].appliesTo.scopes[]` 각 scope의 ContentScope 검증 (§ 3.3 scope 검증 동일 적용) | **fail** |
| `exceptions[].version` SemVer 형식 위반 | **fail** |
| `exceptions[].createdAt`·`updatedAt` ISO 8601 형식 위반 | **fail** |
| `exceptions[].rationale` 누락 또는 빈 문자열 | warning (감사·추적 약화) |

**overrides·meta·medical-law-tracking**
| 검증 항목 | 룰 레벨 |
|---|---|
| `overrides[].targetRuleId` 미존재 (다른 파일에 정의된 ID 참조) | **fail** |
| `overrides[].patch` 객체에 enum/타입 위반 (deep merge 결과 기준) | **fail** |
| 동일 `targetRuleId`에 대한 override 카탈로그 전체에서 2개 이상 | **fail** |
| `meta.yaml` 구조 위반 (§ 3.4.1 참조) | **fail** |
| `meta.yaml`의 `medicalLawRevisionRef`가 `medical-law-tracking.yaml`의 `revisions[].revisionId` 미존재 | **fail** |
| `medical-law-tracking.yaml` 파일 부재 | **fail** |
| `medical-law-tracking.yaml.revisions[]` 필수 필드 누락 (`revisionId`·`lawSource`·`revisionEffectiveDate`·`sourceUrl`·`checkedAt`·`checkedBy`·`affectedRuleIds`·`staleScope`) | **fail** |
| `medical-law-tracking.yaml.revisions[].affectedRuleIds`의 룰 ID가 카탈로그에 미존재 | **fail** |
| `medical-law-tracking.yaml.revisions[].revisionType` enum 외 값 (`amendment`·`reaffirmation`·`new`) | **fail** |
| `medical-law-tracking.yaml.revisions[].staleScope.kind` enum 외 값 (`all`·`rule-matched`·`content-type`) | **fail** |
| `staleScope.kind="content-type"` + `contentTypes[]` 빈 배열 또는 누락 | **fail** |
| `staleScope.kind="content-type"` + `contentTypes[]` 항목이 C-10 contentType enum 미존재 | **fail** |
| `staleScope.kind="rule-matched"` + `affectedRuleIds[]` 빈 배열 | **fail** |
| `medical-law-tracking.yaml.revisions[].sourceUrl` URL 형식 위반 | **fail** |

#### 3.3.1 severity별 `requiredApproverRoles` 처리 정책

| severity | requiredApproverRoles 처리 |
|---|---|
| `fail` | 무시 (빌드 차단이므로 검수자 불필요). 명시 시 schema warning |
| `warning` | 무시. 명시 시 schema warning. operator의 일괄 인정·정정만 |
| `content-gate` | **필수 명시** (§ 4.5 multi-role AND 조건) |
| `info` | 무시. 명시 시 schema warning |

### 3.4 로드 순서·머지 규칙

```
1. rules.core.yaml         (Core 룰 — 기본 카탈로그)
2. rules.medical-ad.yaml   (의료법 기반 룰)
3. rules.preset-<presetSlug>.yaml  (인스턴스의 preset)
4. context-exceptions.yaml (별도 ContextException[] 컬렉션)
```

- 동일 `id` 중복 시 빌드 fail
- preset 룰 파일은 새 룰 추가(`rules[]`) + 기존 룰 부분 갱신(`overrides[]`) 둘 다 가능
- 로드 결과는 단일 `RiskRule[]` 컬렉션 + `ContextException[]` 컬렉션

#### 3.4.1 `meta.yaml` 구조

```yaml
catalogVersion: "1.0.0"                          # 카탈로그 전체 SemVer
medicalLawRevisionRef: "2026-Q1"                 # 의료법 개정 추적 (§ 7.1)
loadOrder:                                       # 파일 로드 순서 명시 — 모든 카탈로그 파일 포함
  rules:                                          # rules 파일 (순차 머지)
    - rules.core.yaml
    - rules.medical-ad.yaml
    - rules.preset-hanui-clinic.yaml
  contextExceptions:                              # ContextException 파일 (별도 컬렉션)
    - context-exceptions.yaml
  tracking:                                       # 추적 데이터 파일
    - medical-law-tracking.yaml
  slotMatches:                                    # slot 격상 조건 파일 (v1.3 cascade · COMPLIANCE_ASSISTANT_PHASE_ALPHA v1.0 CAP-09·CAP-CASCADE-02)
    - slot-matches.yaml
files:
  rules.core.yaml:
    version: "1.0.0"
    description: "Core 표현 룰 — CONTENT_STANDARDS § 4.1 변환"
  rules.medical-ad.yaml:
    version: "1.0.0"
    description: "의료법 제56조·제57조 룰"
  rules.preset-hanui-clinic.yaml:
    version: "1.0.0"
    description: "한의 특유 표현·체질 회색지대"
  context-exceptions.yaml:
    version: "1.0.0"
    description: "문맥 예외 카탈로그 — CONTENT_STANDARDS § 4.4"
  medical-law-tracking.yaml:
    version: "1.0.0"
    description: "의료법 개정 추적 — § 7.1.2"
```

#### 3.4.2 `overrides[]` 스키마·머지 규칙

```yaml
# preset 파일 내 예시
overrides:
  - targetRuleId: "supremacy-001"        # rules.core.yaml의 룰 ID
    patch:                                # 부분 갱신 — 명시된 필드만 교체 (deep merge)
      severity: "warning"                 # 한의 컨텍스트에서 완화 (단순 예시)
      contextExceptions:                  # 배열은 union 아니라 교체 — 기존 항목 유지하려면 모두 재기술
        - { kind: "safety", pattern: "기존 패턴" }
        - { kind: "safety", pattern: "추가 패턴" }
    rationale: "preset-hanui-clinic — 한의 진료 안내 문맥에서 안전 권유 다용"
    appliedAt: "2026-05-14T00:00:00Z"
```

**머지 알고리즘**:
1. `targetRuleId`의 원본 룰을 base로 복사
2. `patch` 객체를 base에 적용:
   - 스칼라 필드(`severity`·`category`·`pattern`·`logic` 등) — patch 값으로 교체
   - 객체 필드(`metadata`) — deep merge (재귀적 key별 교체)
   - **배열 필드(`scope[]`·`contextExceptions[]`·`operands[]`·`requiredApproverRoles[]`)** — patch 값으로 **전체 교체** (union 아님. 누적 의도 시 원본 값 모두 재기술)
3. `patch`에 명시되지 않은 필드는 원본 값 유지
4. 결과는 새 RiskRule으로 컬렉션에 추가 (원본은 제거) — 동일 `id` 1개만 최종 컬렉션에 존재

**제약**:
- override 결과의 `id`·`version`은 변경 안 됨 — 변경 필요 시 새 룰로 추가하고 원본 비활성화 (별도 deprecation)
- 동일 `targetRuleId`에 대한 override는 카탈로그 전체에서 **최대 1개** — 중복 발견 시 빌드 **fail** (last-wins 정책 없음)

#### 3.4.3 `context-exceptions.yaml` 스키마

CONTENT_STANDARDS § 4.4 문맥 예외 카탈로그의 데이터 표현. 빌드 로드 시 별도 `ContextException[]` 컬렉션으로 분리되고, 각 항목은 명시한 룰·카테고리·scope에 대해 매칭 검사 시 제외 단언(negative assertion)으로 작용.

```yaml
version: "1.0.0"
sourceDoc: "core/CONTENT_STANDARDS.md#4.4"
sourceDocVersion: "1.0"

exceptions:
  - id: "safety-medical-consult-001"
    kind: "safety"                         # safety | warning-message | administrative
    pattern: '(반드시|꼭) (의료진과 )?(상담|확인)하세요'
    patternType: "regex"
    appliesTo:                              # 본 예외가 적용되는 대상
      categories: ["전문성 단정 (단독 어휘)"]   # RiskRule.category 매칭 (1개 이상)
      ruleIds: []                            # 또는 특정 RiskRule.id 명시 (1개 이상). 둘 중 1개 이상 필수
      scopes:                                # 본 예외가 적용될 scope (선택 — 미지정 시 전체)
        - { type: "global" }
    rationale: "의료법 제56조 — 안전 권유 표현은 광고 아님"
    version: "1.0.0"
    createdAt: "2026-05-14T00:00:00Z"
    updatedAt: "2026-05-14T00:00:00Z"
```

- `appliesTo.categories`와 `appliesTo.ruleIds` 중 1개 이상 비어 있지 않아야 함 (빌드 fail)
- 매칭 시 — 본 예외의 `pattern`이 텍스트 매칭하면, 같은 위치의 해당 룰 finding을 결과에서 제거

### 3.5 버전 관리

- 각 룰의 `version` — 룰 단위 SemVer. 패턴·severity·scope 변경 시 MAJOR
- 파일 헤더의 `version` — 파일 단위 SemVer. 룰 추가/삭제 시 MINOR, 의료법 개정 시 MAJOR
- 의료법 개정 시 § 7.1 추적 표 동시 갱신 + `meta.yaml`에 `medicalLawRevisionRef` 기록

---

## 4. ApproverRole 통과 기준 — content-gate 발행 조건 (CS-02 해소)

`CONTENT_STANDARDS § 7.1.3`의 4역할 통과 기준 SoT.

### 4.1 medical (의료진 검수)

**검수 자격**:
- DoctorProfile(C-02) 등록 + `credentials[]`로 의료진 자격(면허·전문의 등) 검증 (DATA_MODEL 정합)
- 콘텐츠 도메인(전문 분야) 일치 권장 — 한의 콘텐츠는 한의사, 양방 콘텐츠는 의사

**통과 조건**:
- 콘텐츠 전체 사실 검증 — 효과·기간·부작용·금기 표현
- 의학 정보의 일반론 적합성 (특정 진단·치료 단정 금지)
- ComplianceRecord(C-10) `physicianApprover` + `physicianApprovedAt` 기록

**만료** — `staleFlags.medical=true`로 표기. 다음 이벤트에서 자동 설정:
- 콘텐츠 본문이 RiskRule 매칭 텍스트(`category` ∈ {`효과 단정`·`전문성 단정`·`보장 표현`·`수치·기간 단정`·`체질·맞춤 과대 표현`}) 영역에서 변경
- TreatmentPage의 `treatmentComponents[]`·`visitFlow[]`·`evidenceNotes[]` 변경 (의학 정보 영역)
- 의료진 자격·인증 변경 (DoctorProfile 검수자 자격 변동)
- 의료 정보 인용 외부 링크 변경 또는 만료 (§ 3.5 인용 검증)

### 4.2 legal (법무 자문·승인)

**검수 자격**:
- 사내 법무 또는 외부 법무법인 (변호사 자격)
- 의료광고법 자문 경력 권장

**통과 조건**:
- 의료법 제56조 광고 금지 항목 위반 부재
- 의료법 제57조 사전심의 대상 여부 판정 — ComplianceRecord(C-10) `priorReviewRequired: boolean` 기록 필수
- 사전심의 대상 판정 시 — `priorReviewSubmissionId` 기록 + 심의 통과 후 `priorReviewPassed: true` 기록
- 환자 유인 표현·치료경험담·전후사진 등 특별 항목 별도 판정
- ComplianceRecord(C-10) `legalCounsel` + `legalCounselAt` 기록
- `attachments[]` — 법무 의견서·검토 보고서 첨부 권장

**발행 차단 조건** (어드민 워크플로):
- `priorReviewRequired=true` + (`priorReviewPassed≠true` 또는 `priorReviewSubmissionId` 누락) → 발행 차단

**만료** — `staleFlags.legal=true`로 표기. 다음 이벤트에서 자동 설정:
- 의료법 개정 시 전체 재검수 (§ 7.1 의료법 개정 추적 표 갱신 시 영향받은 룰의 ComplianceRecord 일괄 stale)
- 콘텐츠 본문에서 § 4.1 카테고리 추가 매칭 발생
- 가격 정보 변경 (price·pricing field 갱신)
- ReviewPolicy(C-13) 정책 변경
- 전후사진 미디어 첨부·교체
- 법무 의견서 첨부 만료 (의견서 작성일 기준 12개월 초과 — **RL-07 해소 후 자동 판정 활성화**. v1.0에서는 어드민 워크플로에 수동 갱신 큐 기능으로 대체)

### 4.3 operator (운영자·동료 검수)

**검수 자격**:
- 어드민 계정 + Glitzy 운영팀 또는 클라이언트 측 콘텐츠 담당자

**통과 조건**:
- 톤·문체 일관성 (CONTENT_STANDARDS § 1.1)
- 페이지 타입별 슬롯 충족 (PAGE_TYPES § 2)
- warning 항목 일괄 인정 또는 정정
- ComplianceRecord(C-10) `peerReviewer` + `peerReviewedAt` 기록

**만료**: 별도 만료 없음. 운영자 검수는 본문 변경 시 자동 재진입.

### 4.4 client (클라이언트 측 승인)

**검수 자격**:
- 클라이언트 의료기관의 대표 또는 위임된 의사 결정자

**통과 조건**:
- 기관 정체성 표현·로고·의료진 노출·가격 정책의 최종 확인
- 운영 정책상 요구되는 경우만 사용 — 모든 콘텐츠에 의무 아님
- ComplianceRecord(C-10) `clientApprover` + `clientApprovedAt` 기록

**사용 시점**:
- LegalDocument(C-16) 발행 — 사업자번호·법인명 정확성
- P-101 Reviews 신규 게재
- TrustMetric·Award 등 검증 가능 사실의 최초 등록

### 4.5 multi-role 조합 규칙

**전 콘텐츠 공통 필수**:
- `operator` (peerReviewer) — DATA_MODEL C-10에서 required. 모든 ComplianceRecord 발행 시 항상 기록 필요. `requiredApproverRoles[]`에 명시되지 않아도 기본 요구
- `physicianApprover` — DATA_MODEL C-10에서 Medium/High required. 자동 추론 등급이 Medium/High이면 기본 요구

**content-gate 추가 요구**:
- `requiredApproverRoles[]`는 위 기본 요구의 **추가** 역할 — 예: `["medical", "legal"]`이면 (전 콘텐츠 공통의) operator + (등급 기본 요구의) medical + (룰 추가 요구의) legal 모두 충족 시 발행 허용
- 모든 충족은 AND 조건 — 1개라도 누락 시 발행 차단

| ContentScope | 기본 requiredApproverRoles |
|---|---|
| `review-case` ArticleType | `["medical", "legal"]` |
| `event-price` ArticleType | `["legal"]` |
| `effect-result-related` ArticleType | `["medical"]` |
| 전후사진 노출 콘텐츠 | `["medical", "legal"]` |
| LegalDocument (C-16) 발행 | `["legal"]` (DATA_MODEL C-10·C-16 — legalCounsel 필수). 운영 정책에서 클라이언트 측 최종 확인을 요구하는 경우만 `client` 추가 |
| 기타 High 등급 (자동 추론) | `["medical"]` |

---

## 5. inlineRiskFlags 자동 추출 — DM-05 영역

콘텐츠 본문에서 자동 추출하는 본문 위험 신호.

**저장 위치**:
- C-04 `Article` 콘텐츠 — `Article.inlineRiskFlags`(필드 직접 보관) **및** `ComplianceRecord(C-10).inlineRiskFlags` (검수 기록 사본)
- 그 외 모든 콘텐츠 (ClinicProfile·DoctorProfile·TreatmentPage·MedicalConditionPage·FAQ·ReviewPolicy 등) — `ComplianceRecord(C-10).inlineRiskFlags`에만 보관. Git 원본 데이터에는 inlineRiskFlags 필드 없음
- compliance-assistant 빌드 시 양쪽 모두 갱신 — Article은 두 위치, 비 Article은 ComplianceRecord만

### 5.1 추출 알고리즘 (RiskRule category 기반)

각 flag는 RiskRule 매칭 결과의 `category` 집합 기준으로 추출 — 의미적 risk(semantic risk)가 아닌 카테고리 문자열 매칭으로 구현자가 결정 가능.

| Flag | 추출 룰 |
|---|---|
| `includes-effect-claim` | RiskRule 매칭 결과 중 `category` ∈ {`"효과 단정"`, `"전문성 단정 (단독 어휘)"`, `"전문성 단정 (효과·결과·보장 결합)"`, `"보장 표현"`, `"수치·기간 단정 (보장어 없음)"`, `"수치·기간 보장"`, `"체질·맞춤 과대 표현"`} 1개 이상 |
| `includes-pricing` | 본문 정규식 매칭 — (`[₩$￥]\s*\d`) 또는 (`\d{2,}\s*(원|만원|달러)`) 또는 어휘 (`가격`·`비용`·`수가`·`비급여`·`총 비용`) |
| `includes-event` | 본문 어휘 매칭 — (`이벤트`·`할인`·`세일`·`프로모션`·`기간 한정`·`선착순`·`특가`·`프로모`) |
| `includes-before-after` | (a) 본문 어휘 매칭 (`전후`·`비포어 애프터`·`before\s*/?\s*after`·`B/A`), 또는 (b) `ReviewPolicy.beforeAfterPhotoAllowed=true` + 후기 콘텐츠에 미디어 첨부 |
| `includes-testimonial` | RiskRule composite 매칭 — (1인칭/인용 패턴: `저는`·`환자분이`·`내원자 후기`·`치료받은`·`받은 후`·`상담받은`·`체험기`) + AND_IN_PARAGRAPH (효과 어휘: `효과`·`결과`·`변화`·`호전`·`개선`) |

### 5.1.1 카테고리 SoT

위 표의 모든 `category` 값은 `core/CONTENT_STANDARDS.md` § 4.1 표의 카테고리 칸과 일치해야 한다. 신규 카테고리 추가 시 본 § 5.1 매트릭스 동시 cascade.

### 5.1.2 컨텍스트별 false-positive 완화 정책

단어 매칭만으로 inlineRiskFlag 격상이 false-positive를 만들 수 있다. **콘텐츠 타입·필드 단위**의 정밀한 제외 규칙:

| 컨텍스트 (콘텐츠 타입·필드) | 제외 Flag | 사유 |
|---|---|---|
| `LegalDocument` (C-16) `documentType ∈ {privacy, terms, non-covered, refund, complaint, cookie}` + `body` 필드 | `includes-pricing` | 비급여 안내·환불 정책·약관·민원 안내에 가격 어휘 합법적 등장 |
| `LegalDocument` (C-16) `documentType ∈ {refund, terms}` + `body` 필드 | `includes-event` | 환불 정책·약관에 "이벤트" 어휘가 약관 의미로 등장 |

> `LegalDocument.documentType = "other"`는 본 false-positive 완화 표에서 **의도적으로 제외** — 어떤 정책 문서인지 사전 명확화 불가하므로 보수적으로 일반 콘텐츠와 동일 격상 정책 적용. 운영 누적으로 `other` 사용 사례가 정형화되면 별도 documentType 신설 후 본 표 cascade.
| `LocationProfile` (C-21) `branchDescription`·`transportInfo`·`parkingInfo` 필드 | `includes-event` | 지점 안내·교통·주차 정보에 "이벤트" 어휘가 행사·시설 의미로 등장 가능 |
| `Article` (C-04) `articleType=notice` + `body` 필드 | `includes-event` | 일반 소식·휴진 안내 카테고리 |

- 위 외 컨텍스트에서는 단일 발생만으로 격상. evidence는 항상 기록 (검수자 판단용)
- 컨텍스트 제외는 inlineRiskFlag 자체를 빼는 것이 아니라 **RiskLevel 격상 단계만 제외** — `inlineRiskFlags[]` 출력에는 포함됨 (감사·운영 큐 정보 보존)
- 정책 페이지의 본문에 실제 프로모션성 문구가 섞이는 경우는 § 4.1 룰 매칭(category 기반)으로 별도 검출. 본 § 5.1.2는 inlineRiskFlag → RiskLevel 격상만 완화

### 5.2 출력

```ts
type InlineRiskExtractionResult = {
  inlineRiskFlags: InlineRiskFlag[];
  evidence: {
    [flag: InlineRiskFlag]: Array<{ location: { start: number; end: number }; matchedText: string }>;
  };
};
```

- 어드민 검수 UI는 `evidence`를 사용해 본문 위치를 하이라이트

### 5.3 책임

- 본 알고리즘 구현은 `compliance-assistant` Feature Module
- 본 문서는 추출 규칙의 SoT — 구현 일치 의무

---

## 6. 위험도 자동 동작 매트릭스

`RiskInferenceInput` 결과에 따라 자동 트리거되는 동작.

| 최종 등급 | 자동 동작 |
|---|---|
| Low | (특별 동작 없음) |
| Medium | `physicianApprover` 필수 (DATA_MODEL C-10 정합) + ComplianceRecord 기록. fail/content-gate 매칭은 룰 단위로 독립 처리 |
| High | § 6.1 가상 finding 자동 주입 → `gateRequired=true` + 어드민 검수 큐 강제 진입 |

- 자동 추론된 RiskLevel은 ComplianceRecord(C-10) `pageRiskLevel`에 기록
- High 자동 추론 + 인간 검수 미완료 = 발행 차단 (어드민 워크플로 게이트)

### 6.1 High 가상 finding 정의 (운영 SoT — CONTENT_STANDARDS § 7.1.2와 흐름 연결)

**트리거 범위** (본 문서가 운영 SoT — CONTENT_STANDARDS § 7.1.2보다 넓음):

본 문서 § 2.3의 RiskInferenceInput에서 자동 추론된 최종 등급이 High이면 compliance-assistant가 High 가상 finding을 주입한다. 자동 추론은 다음 모든 입력으로부터 High가 될 수 있다:
- `pageTypeId` 기본 등급 (P-101·P-102·P-104 event 등)
- `articleType` 기본 등급 (effect-result-related·review-case·event-price)
- `slotMatches[]` 격상 결과 (PAGE_TYPES § 3 슬롯 격상 조건 매칭)
- `inlineRiskFlags[]` 격상 (§ 2.4 매트릭스)
- `explicitRiskLevel` override (어드민 명시 입력)

**흐름**: RiskInference(자동 추론) → 결과 등급을 `ComplianceCheckInput.metadata.inferredRiskLevel`에 전달 (CONTENT_STANDARDS § 7.1 입력 슬롯). 어드민 명시 override는 `explicitRiskLevel`에 별도 전달. compliance-assistant는 둘 중 하나라도 High이면 가상 finding 주입. 트리거 출처(`inferred` 또는 `explicit`)는 finding 메타에 기록 — 감사·운영 추적성 보존. `explicitRiskLevel`에 자동 추론 결과를 다시 쓰지 않음 (입력 슬롯 의미 보호).

자동 주입 finding:

```ts
{
  ruleId: "risk-level-high-gate",
  category: "위험도 강제 검수",
  pattern: "(RiskLevel=High)",
  severity: "content-gate",
  location: { start: 0, end: 0 },              // 콘텐츠 전체 — 메타 의미
  requiredApproverRoles: ["medical"]            // 기본값. ArticleType별 override (§ 6.2)
}
```

### 6.2 ArticleType별 High 가상 finding requiredApproverRoles override

본 표는 **§ 6.1 가상 finding이 자동 주입되는 경우(High 등급)**의 `requiredApproverRoles[]` 값만 표시 — § 4.5의 **(c) 룰 추가 요구**. 등급 기본 요구(Medium/High면 `medical`)는 별도이며 본 표에 포함되지 않음.

| ArticleType (모두 High 등급 — 가상 finding 주입) | 가상 finding `requiredApproverRoles[]` | 총 발행 요구 역할 = operator ∪ 등급 기본 ∪ 룰 추가 |
|---|---|---|
| `effect-result-related` | `["medical"]` | `["operator", "medical"]` (medical 중복은 합집합으로 제거) |
| `review-case` | `["medical", "legal"]` | `["operator", "medical", "legal"]` |
| `event-price` | `["legal"]` | `["operator", "medical", "legal"]` (medical은 High 등급 기본 요구) |
| 기타 High explicitRiskLevel | `["medical"]` | `["operator", "medical"]` |

> Medium 등급 ArticleType(`general-medical-info`·`condition-explainer`·`treatment-explainer`)은 § 6.1 가상 finding 미발생 — 본 표에 포함되지 않음. 단, § 6 매트릭스에 따라 `physicianApprover` 등급 기본 요구는 자동 적용

- 본 표는 `CONTENT_STANDARDS § 7.1.2`와 동일 SoT — 둘 중 하나 변경 시 다른 하나도 cascade. 본 문서가 운영 SoT.
- 총 요구 역할은 `operator ∪ 등급 기본 ∪ 룰 추가` 합집합 (중복 제거). 어드민 워크플로는 합집합의 모든 역할에 대해 ComplianceRecord 슬롯 기록 완료 시에만 발행 허용
- **등급 격하 일괄 금지** — `explicitRiskLevel`은 MAX 결합으로만 동작 (격상만 허용). 운영자도 자동 추론보다 낮은 등급으로 격하 불가. ArticleType High 격하 금지 (DATA_MODEL C-04 정합)

---

## 7. 운영 거버넌스

### 7.1 의료법 개정 대응

#### 7.1.1 추적 대상

| 추적 항목 | 출처 | 갱신 주기 |
|---|---|---|
| 의료법 제56조 (의료광고 금지) | 국가법령정보센터 | 분기 1회 + 개정 즉시 |
| 의료법 제57조 (사전심의) | 국가법령정보센터 | 분기 1회 + 개정 즉시 |
| 의료법 시행령 제23조 등 광고 관련 조항 | 국가법령정보센터 | 분기 1회 + 개정 즉시 |
| 의료광고 심의 운영규정 | 의료광고심의위원회 | 분기 1회 |

#### 7.1.2 추적 데이터 모델

```yaml
# data/compliance-rules/medical-law-tracking.yaml
revisions:
  - revisionId: "2026-Q1"                          # 분기 또는 개정 일자 기반 식별자
    lawSource: "의료법"                              # 의료법·시행령·심의 운영규정
    affectedArticles: ["제56조 제1항 제5호"]        # 개정 조문
    revisionEffectiveDate: "2026-03-01"             # 시행일
    revisionType: "amendment"                       # amendment | reaffirmation | new
    sourceUrl: "https://www.law.go.kr/..."           # 국가법령정보센터 URL
    checkedAt: "2026-05-14T00:00:00Z"
    checkedBy: "operator:seokcess@glitzy.kr"
    affectedRuleIds:                                # 본 개정으로 영향받은 RiskRule ID
      - "supremacy-001"
      - "guarantee-composite-001"
    staleScope:                                     # stale 처리 범위
      kind: "all"                                   # all | rule-matched | content-type
      contentTypes: []                              # kind="content-type"일 때만
    summary: "의료광고 사전심의 매체 범위 확대 — 자사 웹사이트 미디어 포함"
```

#### 7.1.3 개정 시 절차

1. `MEDICAL_AD_COMPLIANCE_COMMON.md` 본문 갱신
2. `rules.medical-ad.yaml` 룰 추가·갱신 (`version` MAJOR)
3. `meta.yaml`의 `medicalLawRevisionRef` 갱신
4. `medical-law-tracking.yaml`에 revision 항목 추가
5. `staleScope.kind`별 영향 콘텐츠 결정:
   - `kind="all"` — 전체 ComplianceRecord(C-10) 대상으로 일괄 `staleFlags.legal=true`
   - `kind="rule-matched"` — `affectedRuleIds[]`에 해당하는 룰을 매칭한 콘텐츠의 ComplianceRecord만 stale
   - `kind="content-type"` — `staleScope.contentTypes[]`에 속하는 contentType의 ComplianceRecord 일괄 stale
   - 모든 경우 `triggeredBy="medical-law-revision-<revisionId>"` 설정
6. 어드민 워크플로가 재검수 큐를 처리 — 통과 시 stale 해제

### 7.2 룰 충돌·중복 발견 시

- 빌드 시 룰 충돌(`id` 중복 또는 동일 패턴 + 다른 severity) 검출 시 fail
- 운영 누적으로 false-positive 발견 시 `contextExceptions[]` 또는 `exceptions[]` 추가 — PATCH 버전
- false-negative 발견 시 룰 추가 — MAJOR(fail 룰) 또는 MINOR(warning/content-gate)

### 7.3 RiskRule 변경 워크플로

```
1. 변경 제안 (PR) — 변경 사유·근거 의료법 조문·테스트 케이스 첨부
2. 자체 룰 checker 회귀 테스트 — 기존 콘텐츠 위반 가능 케이스 검출
3. 의료법 자문 — fail 룰 추가·강화 시 필수
4. 머지 + 인스턴스 재빌드 — 위반 콘텐츠 검출 시 ComplianceRecord 재진입
```

---

## 8. 빌드 검증 — 룰 레벨 정합 (CONTENT_STANDARDS § 8 동일 패턴)

| 레벨 | 본 문서 영역 적용 |
|---|---|
| **fail** | RiskRule 파일 JSON Schema 검증 실패, RiskLevel enum 위반, ApproverRole 매핑 누락 |
| **warning** | `sourceDoc` 경로 위반, RiskRule 만료 임박 (의료법 개정 6개월 이상 미반영 등) |
| **content-gate** | (본 문서는 메타 정의 영역이라 content-gate 직접 적용 없음. 실제 본문 검수 룰은 RiskRule이 발산) |

---

## 9. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| RL-03 | medical 검수자 도메인 자격 매칭 자동 검증 (한의 콘텐츠 → 한의사) | 어드민 워크플로 명세 시 |
| RL-04 | legal 검수의 외부 법무법인 vs 사내 법무 구분 데이터 모델 | DATA_MODEL 후속 사이클 |
| RL-05 | `clientApprover` 위임 권한 데이터 모델 (대표 vs 위임자) | 운영 정책 결정 |
| RL-06 | inlineRiskFlag 추출 알고리즘의 정확도 운영 지표 (precision/recall) 측정·운영 | M2+ 운영 누적 후 |
| RL-07 | `attachments[].metadata.expiresAt` 데이터 모델 — DATA_MODEL Attachment 확장 | DATA_MODEL 후속 사이클 |

### 9.1 해소된 미결정

| ID | 항목 | 해소 |
|---|---|---|
| ~~RL-01~~ | `rules.preset-<presetSlug>.yaml`의 preset slug 카탈로그 결정 | v1.0 — preset 파일명 규약 `rules.preset-<presetSlug>.yaml` 고정. `<presetSlug>`은 `presets/<presetSlug>/` 디렉토리명과 동일 kebab-case (예: `hanui-clinic`). 실제 preset 카탈로그는 `presets/` 추가 시 자연 확장 |
| ~~RL-02~~ | `overrides[]` 섹션의 정확한 머지 알고리즘 | v0.2 — § 3.4.2 명세. 스칼라/객체/배열별 머지 규칙 + 동일 targetRuleId 카탈로그 1개 제약 명시 |

---

## 10. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 — RiskLevel 자동 추론(MAX 결합), RiskRule 데이터 파일(YAML+JSON Schema·로드 순서·버전), ApproverRole 통과 기준 4종(medical·legal·operator·client·multi-role AND), inlineRiskFlags 자동 추출 5종, 위험도 자동 동작 매트릭스, 운영 거버넌스(의료법 개정 대응·룰 충돌·변경 워크플로), 빌드 검증 룰 레벨 |
| 2026-05-14 | **v1.2** | **compliance-assistant v1.0 cascade**: § 2.3.1 RiskInferenceResult.steps[] 표준화 — `{ source, sourceValue, level }[]`. triggeredBy 판정 근거를 SoT에 정식화 |
| 2026-05-14 | **v1.1** | **MEDICAL_AD_COMPLIANCE_COMMON v1.0 cascade**: § 3.3 JSON Schema 검증에 `legalBasis[]` 2종 검증 추가 — 항목 형식 위반(warning) + medical-law-tracking 카탈로그 미존재(warning, 활성화 후). canonical RiskRule + 복수 법령 조문 인용 패턴 지원 |
| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 마감 (4개 지적 전건 수용)**: (1) **CONTENT_STANDARDS § 7.1 cascade — `inferredRiskLevel` 입력 필드 신설**. explicitRiskLevel은 어드민 명시 override만, 자동 추론 결과는 별도 필드. § 7.1.2 트리거 조건도 `inferredRiskLevel === High` ∨ `explicitRiskLevel === High` 명시 + `triggeredBy` 메타로 출처 기록, (2) CONTENT_STANDARDS § 7.1.2 ArticleType override 목록을 High 전용으로 정리 — Medium ArticleType은 본 가상 finding 미발생 (RISK_LEVELS § 6 매트릭스로 처리). RISK_LEVELS § 6.2 표와 정합, (3) § 5.1.2 LocationProfile false-positive 완화 — 존재하지 않는 `relocationNotice`·`businessHoursNotice` 제거. DATA_MODEL C-21 실제 필드(`branchDescription`·`transportInfo`·`parkingInfo`)로 교체, (4) preset 파일명 규약 통일 — `rules.preset-<presetSlug>.yaml`. `<presetSlug>`은 `presets/<presetSlug>/` 디렉토리명과 동일 kebab-case. RL-01 해소 |
| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (6개 지적 전건 수용)**: (1) **CONTENT_STANDARDS CS-02 해소 cascade** — CS-02를 § 9.1 해소된 미결정으로 이동. RISK_LEVELS § 4가 SoT임을 명시, (2) § 6.1 High 가상 finding 트리거 범위 명시 — RiskInference 자동 추론 단계(pageType·slot·inlineRiskFlags 포함)와 ComplianceCheckInput 인터페이스 단계의 흐름 연결. 본 문서 = 운영 SoT, CONTENT_STANDARDS § 7.1.2 = 인터페이스 SoT, (3) § 3.3 context-exceptions.yaml 검증 완전화 — patternType·version·createdAt·updatedAt·rationale·id kebab-case 6종 추가, (4) § 3.3 scope 검증 강화 — featureContentType은 type="feature"와만 결합. 각 type별 필수 필드 검증 추가, (5) § 3.4.1 meta.yaml loadOrder 확장 — rules/contextExceptions/tracking 카테고리별 명시. context-exceptions·medical-law-tracking 포함, (6) § 5.1.2 LegalDocument `other` documentType의 의도적 제외 명시 — 보수적으로 일반 격상 정책 적용 |
| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (6개 지적 전건 수용)**: (1) § 5.1.2 LegalDocument.documentType enum을 DATA_MODEL C-16 실제 값(`privacy`·`terms`·`non-covered`·`refund`·`complaint`·`cookie`·`other`)과 정합, (2) § 2.2 `explicitRiskLevel` 저장 SoT를 CONTENT_STANDARDS § 7.1 `metadata.explicitRiskLevel` 입력 슬롯으로 명시 — ComplianceRecord 출력과 분리, (3) § 6.2 표를 High 가상 finding 전용으로 분리 — Medium ArticleType 제거, § 6 매트릭스에 Medium의 physicianApprover 기본 요구 명시, (4) § 3.1 디렉토리 주석 정정 (`§ 4.4`→`CONTENT_STANDARDS § 4.4`) + § 3.4.3 context-exceptions.yaml 스키마 신설 (id·kind·pattern·appliesTo.categories/ruleIds/scopes·rationale), (5) § 3.3 JSON Schema 검증에 `suggestion`·`exceptions[]` + `context-exceptions.yaml` 검증 6종 추가, (6) § 3.3 medical-law-tracking 조건부 검증 추가 (`kind=content-type`/`rule-matched` 분기) + § 7.1.3 stale 처리 절차에 분기별 영향 콘텐츠 결정 명시 |
| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (10개 지적 전건 수용)**: (1) § 2.2 `explicitRiskLevel` 입력 출처 명확화 — 어드민 메타데이터 입력. 자동 추론 결과 순환 입력 금지, (2) § 0 발행 조건 = AND 3종(operator + 등급 기본 + 룰 추가) 완전 표기, (3) § 6.2 ArticleType override가 "룰 추가 요구"임을 명시 — 총 발행 요구 = 합집합 표 추가, (4) § 4.5 LegalDocument 기본 역할 `["legal"]`만 — client는 운영 정책 시만, (5) § 3.3 scope 검증에 `fieldPath`·`blockType` 정합 검증 추가, (6) § 3.4.2 overrides 중복 정책 통일 — 최대 1개 강제, 중복 시 fail (last-wins 표현 제거), (7) § 4.2 법무 의견서 만료 자동 판정을 RL-07 해소 후로 명시. v1.0에서는 수동 갱신 큐로 대체, (8) § 5 inlineRiskFlags 저장 위치 분리 — Article은 양쪽, 비 Article은 ComplianceRecord만, (9) § 5.1.2 컨텍스트별 false-positive 완화를 페이지 단위 → LegalDocument.documentType + 필드 단위로 정밀화. 정책 페이지 false-negative 위험 회피, (10) § 3.1 디렉토리에 `medical-law-tracking.yaml` 추가 + § 3.3에 해당 파일 검증 7종 추가 |
| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (14개 지적 전건 수용)**: (1) § 2.5 P-105 Reservation 기본 등급 PAGE_TYPES SoT Low로 정정, (2) § 6 explicitRiskLevel 격하 일괄 금지 명시 — DATA_MODEL C-04 ArticleType High 격하 금지와 정합, (3) **DATA_MODEL C-10 cascade — `StaleFlags` 하위 타입 + `priorReviewPassed` 필드 추가**. § 4 만료 정책에서 `staleFlags.medical/legal/operator/client` 일반화 사용, (4) § 4.5 multi-role 분리 — operator 전 콘텐츠 공통 필수(C-10 required) + physicianApprover Medium/High 기본 요구 + `requiredApproverRoles[]` 추가 요구를 모두 AND, (5) § 5.1 includes-effect-claim 카테고리 7종으로 확장 (수치·기간 단정·체질 맞춤 포함), (6) § 5.1 모든 flag를 RiskRule category 기반으로 정밀화 + § 5.1.1 카테고리 SoT cascade 규칙, (7) § 3.3 JSON Schema 검증 항목 완전화 — Simple/Composite 구분·operands·logic·window·ISO date·contextException kind·roles enum·overrides·meta.yaml 검증, (8) § 3.4.2 overrides 머지 규칙 + § 3.4.1 meta.yaml 구조 명세 (RL-02 해소), (9) § 3.3.1 severity별 requiredApproverRoles 처리 정책 — content-gate만 필수 명시, (10) § 4.2 legal 통과 조건에 `priorReviewRequired`·`priorReviewSubmissionId`·`priorReviewPassed` 연계 + 발행 차단 조건 명시, (11) § 7.1 의료법 개정 추적 데이터 모델 신설 — revisionId·시행일·sourceUrl·checkedAt/By·affectedRuleIds·staleScope, (12) § 6.1 High 가상 finding 본 문서에 동기화 SoT + § 6.2 ArticleType override 표, (13) § 5.1.2 페이지 컨텍스트별 false-positive 완화 — P-013·P-014·P-104 notice 제외 규칙. inlineRiskFlags 출력은 보존(감사용), (14) § 4.1·§ 4.2 만료 정책 확장 — 가격·ReviewPolicy·전후사진 미디어·법무 의견서 만료·근거 링크 만료 이벤트 추가 |
