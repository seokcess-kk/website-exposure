# Core — 콘텐츠 작성 표준 (AEO·AI 스니펫·의료광고 표현)

> **상태**: **v1.3 구현 명세 안정판** (compliance-assistant v1.0 cascade — Finding 메타 확장)
> **작성일**: 2026-05-14
> **소유자**: Glitzy
> **상위 문서**: `docs/ARCHITECTURE.md` § 4, § 9
> **목적**: Core가 생성·관리하는 콘텐츠의 작성 표준. AEO·AI 스니펫 친화 구조, 콘텐츠 블록 표준, 의료광고법 표현 가이드(금지·대체), 페이지 타입·ArticleType별 룰, compliance-assistant 인터페이스, 빌드 검증을 단독 구현 가능한 명세로 정의.
> **외부 공유 시 주의**: 상위 문서와 동일. 표현 리스크 어휘 회피.
> **연관 문서**:
> - 페이지 타입 정의 → `core/PAGE_TYPES.md`
> - 데이터 계약 → `core/DATA_MODEL.md`
> - Schema 매핑 → `core/SCHEMA_MAPPING.md`
> - 메타·robots·sitemap·canonical·성능 → `core/SEARCH_STANDARDIZATION.md`
> - 위험도 등급·자동 추론 → `compliance/RISK_LEVELS.md` (후속)
> - 의료광고 준수 공통 가이드 → `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` (후속)

---

## 0. 한 페이지 요약

- **콘텐츠 작성 표준 = 5개 영역**: 일반 규약(톤·문체) / AEO·AI 스니펫 친화 구조 / 콘텐츠 블록 표준 / 의료광고 표현 / 페이지·ArticleType별 룰.
- **단일 SoT**: § 4 의료광고 표현 룰 (금지·대체·content-gate)이 본 문서의 진실의 원본. compliance-assistant 모듈이 본 표를 기준으로 자동 검수.
- **빌드 검증**: 자체 룰 checker가 본 문서의 fail/warning/content-gate 룰을 적용. 외부 LLM 검수(compliance-assistant)는 별도.
- **content-gate**: 빌드는 통과(자동 차단 X) + 사람 검수 큐 진입 — 본문 표현 검수 + schema 출력 승인 + 위험 콘텐츠 발행 전 인간 결재의 일반 의미 (`SCHEMA_MAPPING.md` § 7.3, § 8 일관 적용).
- 페이지 타입별 콘텐츠 슬롯·필수 블록은 `PAGE_TYPES.md`가 정의, 본 문서는 **각 슬롯에 들어가는 콘텐츠의 표현·구조 표준**을 다룬다.

---

## 1. 일반 규약

### 1.1 톤·문체

| 항목 | 표준 |
|---|---|
| 어조 | 정중·전문적·차분. 마케팅 과장형 X |
| 인칭 | 의료기관 = "저희"/"본원" / 환자 = "환자분"·"내원자" (3인칭은 신중) |
| 종결 | 평어체 금지. "-습니다·-입니다" 일관 |
| 감정 어휘 | 자제 ("기적·놀라운·혁신적" 등 X) |
| 의문문 | H2 헤딩으로만 사용 (AEO 친화), 본문에 빈번한 의문문 자제 |
| 영문 | 의료 전문 용어 영문 병기는 첫 등장 시 1회 (예: "비만(obesity)") |

### 1.2 언어

- 기본 `ko-KR` (SEARCH_STANDARDIZATION § 2.1 정합)
- 영문·중문 등 다국어는 `InternationalSupport.internationalLanguagePages[]` 활성화 시. 본 표준은 한국어 기준

### 1.3 콘텐츠 길이

| 페이지·블록 | 권장 길이 |
|---|---|
| PageMeta.description | 80~160자 (SEARCH_STANDARDIZATION § 2.1 정합) |
| PageMeta.title | 10~70자 |
| Article.headline | 1~120자 |
| Article.summary | 80~200자 |
| Article.body (P-010) | **최소 1,000자(공백 제외)** 권장 (warning 임계 — 미달 시 AI 스니펫·검색 노출 약화). 빌드 checker는 Markdown 원문에서 코드/링크/이미지 마크업·HTML 태그·공백·문장부호를 제거한 후 글자 수를 산정 (구현 알고리즘 [CS-A]) |
| TreatmentPage.summary | 50~160자 |
| FAQ.answer | 50~300자 권장 (Q&A 블록은 답변 우선 1~2문장) |

### 1.4 변경 정책

- 표현 룰(§ 4) 추가·완화: MINOR (기존 콘텐츠 영향 없음)
- 표현 룰 강화 (기존 콘텐츠 위반 가능): **MAJOR** (마이그레이션 가이드 필수)
- 페이지 타입별 룰 신설: MINOR
- 새 ArticleType 추가: MINOR

---

## 2. AEO·AI 스니펫 친화 구조

네이버 AI 사이트 브리핑·AI 스니펫·통합 랭킹 모델 시대의 핵심 — **답변 우선 배치 + 구조화 블록**.

### 2.1 답변 우선 배치 (Answer-First)

| 룰 | 레벨 | 적용 |
|---|---|---|
| 본문 시작 1~2문장 내에 핵심 답변 배치 (§ 2.1.1 AST 정의) | warning (검색 노출 약화) | P-006·P-008·P-010·P-011 답변 단위·블록 본문 |
| 페이지의 본질 질문 1개를 H1 또는 H2가 명시적으로 답변 | warning | P-006·P-008·P-010 |
| H2를 질문형으로 작성 (AEO 친화) | 권장 (silent) | P-010 Article, P-006/P-008 일부 섹션 |

**예시 (P-006 Treatment Detail 본문 시작)**:

```
[좋음]
한방 다이어트는 한약·약침·식이 상담을 결합한 4~12주의 비만 관리 프로그램입니다.
체질에 맞춘 한약 처방, 지방대사 약침, 1:1 식이 상담으로 구성되며, 평균 4주 단위로 진행 결과를 점검합니다.

[나쁨 — answer-first 위반]
다이어트는 누구에게나 어려운 과제입니다. 매년 새해마다 결심하지만 실패하는 경우가 많습니다. 그래서 본원은…
(답변이 한참 뒤로 밀림)
```

#### 2.1.1 answer-first 검사 대상 (Markdown AST)

빌드 checker가 "본문 시작"을 판정하는 정확한 알고리즘:

1. Frontmatter 영역 제외 (YAML/TOML 헤더)
2. 페이지의 `<main>` 또는 첫 H1 노드 이후 영역만 대상
3. 다음 노드 종류는 **스킵** (메타·구조 노드):
   - TOC(목차), 이미지 단독 블록(`<figure>`/`<img>` 단독), 콜아웃(`info`/`warning`/`disclaimer`), 인용·근거 블록, summary 필드 출력 영역, 임베디드 미디어, 표 단독
4. 첫 번째 **본문 텍스트 블록**(Markdown AST에서 `paragraph` 또는 `<p>` 노드)을 "본문 시작"으로 채택
5. 해당 블록의 첫 1~2 문장(KSS·문장 분리 기준) — 효과 단정 키워드 미포함 + 페이지 본질 질문과 관련된 텍스트 포함 여부 판정
6. P-011 FAQ의 경우 각 Q&A 블록 단위로 동일 알고리즘 — `<dl>/<dt>` 다음 `<dd>` 또는 H3 다음 paragraph

> Markdown AST 파서는 remark/mdast 또는 동등 도구. 정확한 라이브러리 채택은 자체 룰 checker 구현 시 결정 (CS-A 영역).

### 2.2 헤딩 위계 (`PAGE_TYPES.md` § 2.1 정합)

- **H1 페이지당 1개**. 페이지 주제 명시
- H2는 주요 섹션 — 명사형 또는 **질문형** (AEO 친화)
- H3은 H2 하위 세부 단위
- H4 이하 자제 (AI 스니펫 추출 난이도 ↑)

| 룰 | 레벨 |
|---|---|
| H1 누락 또는 2개 이상 | fail |
| H2 위계 건너뜀 (H1 → H3) | warning |
| H4 이하 5회 초과 사용 | warning |

### 2.3 구조화 블록 의도적 혼합

본문에 다음을 의도적으로 섞어 배치하면 AI 스니펫 채택률 ↑:

| 블록 종류 | 형식 | AI 스니펫 추출 친화 |
|---|---|---|
| 문단형 답변 (1~2문장) | 일반 텍스트, H2 직후 | 문장형 스니펫 |
| 불릿 리스트 | `<ul><li>` 3~10개 | 리스트형 스니펫 |
| 번호 리스트 (단계·순서) | `<ol><li>` 3~10개 | 단계형 스니펫 |
| 표 (비교·항목) | `<table>` 2~5컬럼 | 표형 스니펫 |
| Q&A 블록 | `<dl>` 또는 FAQPage schema | FAQ 리치 결과 |
| 인용·근거 | `<blockquote>` + 출처 | 신뢰도 신호 |

| 룰 | 레벨 |
|---|---|
| P-006·P-008·P-010 본문에 구조화 블록 0개 (장문 산문만) | warning (AI 스니펫 추출 약화) |
| 리스트 항목이 2개 이하인 `<ul>`/`<ol>` | warning (리스트 효과 약함) |
| 표가 1행만 있는 경우 | warning |

---

## 3. 콘텐츠 블록 표준

### 3.1 Q&A 블록

**구조**:
```markdown
**질문(Q)**: 한방 다이어트는 며칠 만에 효과가 나타나나요?

답변: 한방 다이어트의 효과 인지 시점은 개인의 체질·생활 습관·복약 순응도에 따라 다르며, 일반적으로 4주 단위로 변화를 점검합니다.
세부적으로는 한약 복용 1~2주차에 식욕 변화·소화 패턴 변화를, 4주차부터 체성분 변화 추세를 관찰합니다.
```

**책임 분리**:
- 본문 렌더링 — HTML `<dl><dt>질문</dt><dd>답변</dd></dl>` (또는 H3 질문 + 본문 답변 패턴)
- JSON-LD schema — 본문 Q&A 블록을 추출하여 별도 FAQPage 그래프 출력 (`SCHEMA_MAPPING` § 3 P-011 FAQPage 매핑). 렌더링 마크업과 schema 출력은 독립

| 룰 | 레벨 |
|---|---|
| Q&A 블록의 질문이 의문문 아닌 경우 | warning |
| 답변 첫 문장이 핵심 답변 아닌 경우 (answer-first 위반) | warning |
| 답변에 § 4.1 **fail 카테고리** 표현 (완치·100%·반드시·보장 등) 포함 | **fail** (§ 4.1 직접 적용) |
| 답변에 § 4.1 **content-gate 카테고리** 표현 (수치·기간 단정·체질 맞춤 등) 포함 | **content-gate** (§ 4.1 적용) |

### 3.2 리스트 (불릿·번호)

**용도별 선택**:
- 순서·인과 관계가 있으면 번호 리스트 (`<ol>`)
- 동등 항목 나열이면 불릿 리스트 (`<ul>`)

**룰**:
- 항목 길이 일관 (한 항목이 5줄 넘으면 별도 단락으로 분리 검토)
- 항목 시작 어휘 일관 (모두 명사형 또는 모두 동사형)

### 3.3 표 (Table)

**구조**: `<table>` + `<thead>` + `<tbody>`. 첫 행은 헤더.

**용도**:
- 비교 (시술별·프로그램별 차이)
- 수치·범위 (소요 시간·횟수)
- 시간표 (진료시간·휴진 안내)

**위험도 주의**:
- 효과 수치·기간 비교표는 **content-gate** (§ 4 적용)
- 가격 비교표는 **High 위험** (§ 4 + P-102 정책)

### 3.4 콜아웃 (Callout / Note)

**종류**:
- `info` — 일반 안내 (Low 위험)
- `warning` — 주의사항 (Medium 권장)
- `disclaimer` — 의료 면책 (의료 정보 페이지에 권장)

**예시**:
```
⚠️ 본 페이지의 의료 정보는 일반적인 안내이며, 개별 환자의 진료를 대체하지 않습니다. 정확한 진단·치료는 의료진과 상담하세요.
```

### 3.5 인용·근거 (Citation)

논문·학회·공식 자료 인용 시:
- 인용 출처 명시 (학회지·발행연도·저자)
- 외부 URL은 가능한 경우 첨부
- `Article.embeddedMedia[type: citation]` 또는 본문 `<blockquote>` + 출처

**룰**:
- "효과·통계 주장" 판정 — § 4.1의 "전문성 단정 (효과·결과·보장 결합)" composite 룰 매칭 텍스트, 또는 본문 내 수치(`%`, `kg`, `cm`, `주`, `일`, `회` 등 단위 동반 숫자) + 효과 어휘(효과·결과·개선·호전·변화) 동시 등장
- 위 판정 텍스트가 포함된 문단·블록에 다음 중 1개라도 동일/인접 단락(2단락 이내) 존재 시 본 § 3.5 룰의 **content-gate finding 미발생** — 인용 인정. **§ 4.1 fail 룰(완치·100%·보장 등)은 인용 존재 여부와 무관하게 항상 적용** (인용 면제 대상 아님):
  - `Article.embeddedMedia[type="citation"]` (DATA_MODEL C-04)
  - `<blockquote>` + 출처 텍스트 (학회·정부·논문명 패턴)
  - 외부 URL 링크 + 학술·정부 도메인 **화이트리스트** (`compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` § 8이 SoT — 와일드카드 자동 인정 없음, 검색 서비스 URL 불인정)
  - `TreatmentPage.evidenceNotes[]` (DATA_MODEL C-03)
- 위 판정 텍스트 + 인용 부재 → content-gate
- 인용 가능 출처 — 학회·정부 도메인 화이트리스트는 `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` 후속에서 정밀화

### 3.6 임베디드 미디어 (VideoObject 등)

- YouTube·Vimeo·외부 동영상 임베드
- `Article.embeddedMedia[]` (DATA_MODEL C-04)와 정합
- VideoObject schema 최소 필드 출력 (SCHEMA_MAPPING § 3 P-010)

---

## 4. 의료광고 표현 — 단일 SoT

본 문서의 **진실의 원본**. compliance-assistant 모듈이 본 표를 기준으로 자동 검수.

### 4.1 금지 표현 (fail / content-gate)

| 카테고리 | 금지 표현 (예시) | 레벨 |
|---|---|---|
| **최상급** | "최고의·최저가·최대·최강·1위·국내 유일·세계 최초·세계 최고" | **fail** (콘텐츠 발행 차단) |
| **효과 단정** | "완치·100% 효과·반드시 효과·안전합니다·부작용 없음" | **fail** |
| **수치·기간 단정 (보장어 없음)** | "○○일 만에·○○주 만에·체중 ○○kg 감량 (수치·기간 단정, '보장'·'약속'·'반드시' 어휘 미포함)" | **content-gate** (의료진·법무 검수 필요) |
| **수치·기간 보장** | "○○kg 보장·○○일 안에 보장·○○주 약속" — 수치/기간 + 보장어 결합 | **fail** (보장 표현 통합 룰) |
| **비교 표현** | "타 병원보다·다른 의원보다·기존 ○○보다 우수" | **fail** |
| **유인성 표현** | "지금만·특가·한정·기간 한정·선착순·오늘까지" (시간·수량 압박형 환자 유인) | **fail** |
| **할인·이벤트 사실 안내** | "20% 할인 진행·○월 이벤트" (시간·수량 압박어 미포함, 사실 진술) | **content-gate** (의료광고법 환자 유인 해당 여부 법무 판정 필요. P-104·P-102에서만 허용) |
| **진단 단정** | "당신은 ○○병입니다·○○질환 확정" (자가 진단 유도 포함) | **fail** |
| **명의·권위 단정** | "최고의 명의·국내 1인자·전국 최다" | **fail** |
| **전문성 단정 (단독 어휘)** | "절대·반드시·확실히·100%" (효과·결과·보장 등 결과어와 결합되지 않은 단독 사용) | **content-gate** |
| **전문성 단정 (효과·결과·보장 결합)** | "100% 효과·반드시 효과·절대 안전·확실한 결과·반드시 호전" (단독 어휘 + 효과/결과/보장어 결합) | **fail** (룰 우선순위 — § 7.4.3) |
| **유명인 동원** | (의료법상 환자 유인) "○○○ 연예인이 받은" | **fail** |
| **보장 표현** | "효과 보장·결과 보장·만족 보장·재시술 무료" | **fail** |
| **체질·맞춤 과대 표현** | "당신만의 1:1 맞춤·당신의 체질에 완벽" | **content-gate** (한의 특유 표현 회색지대) |

> 본 표는 v0.1 최초 — 운영 누적으로 항목 확장. `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` 후속 문서에서 사례 풍부화.

### 4.2 대체 표현

| 금지 표현 | 대체 표현 |
|---|---|
| "최고의 다이어트 한약" | "체질 기반 다이어트 한약 처방" |
| "100% 효과" | "효과 인지 시점·정도는 환자 개인의 체질·생활 습관에 따라 다를 수 있습니다" (구체 효과 수치·사례 묘사는 본문 직접 진술 금지. § 3.5 인용·근거 또는 검증된 통계 출처 인용 형식으로만 기술) |
| "4주 만에 -10kg 보장" | "4주 단위로 진행 결과를 점검합니다. 변화 정도는 개인에 따라 다릅니다" |
| "타 병원보다 효과적" | (비교 자체 미사용) "본원의 진료 방식은 ○○입니다" |
| "지금 신청하시면 50% 할인" | (할인 미명시) "예약 안내는 ○○로 연락 바랍니다" |
| "유명인 ○○도 받은 시술" | (유명인 미언급) "본원 시술 사례는 ○○ 페이지에서 확인 가능합니다" — 단 후기·전후사진은 별도 ReviewPolicy 적용 |
| "효과 보장" | "효과 인지 시점·정도는 개인의 체질·생활 습관에 따라 다릅니다" |

### 4.3 후기·전후사진·가격 노출 — 별도 정책

| 요소 | 출처 | 표현 정책 |
|---|---|---|
| 환자 후기 (치료경험담) | P-101 Reviews (선택) + ReviewPolicy(C-13) | 의료법 제56조에 따른 치료경험담 광고 금지 항목 — **본문 직접 인용 원칙 금지**. 사이트 게재가 의료광고에 해당하는지·의료법 제57조 사전심의 대상인지 여부는 매체·방식별 법무 판정 필요. 본문 효과 단정 표현은 분리하여 § 4.1 룰 적용 |
| 전후사진 | P-101 Reviews + `ReviewPolicy.beforeAfterPhotoAllowed` | **기본 차단** (의료광고 위반 리스크 강). `beforeAfterPhotoAllowed=true`는 **법무 승인 후 예외적 허용** 플래그로만 동작 — 설정 시 해당 콘텐츠에 대한 `ComplianceRecord`(C-10, `contentType=ReviewPolicy` 또는 후기 콘텐츠 단위) 발행 필수 (`legalCounsel`·`legalCounselAt`·`attachments` 기록). 별도 ReviewPolicy 필드로 승인자·일자를 중복 보관하지 않음 (SoT는 ComplianceRecord) |
| 가격·할인·이벤트 안내 | P-102 Pricing / P-104 News·Event 카테고리=event / P-010 Article(`articleType=event-price`) | 본 페이지 타입·ArticleType 외 다른 페이지의 본문에는 가격·할인·이벤트 안내 텍스트 출현 시 content-gate. 압박형 유인 표현은 어디서나 fail (§ 4.1) |
| 의료진 자격·논문 | DoctorProfile (C-02) | 검증 가능 사실만. "최고의 명의" 등 단정 금지 |
| 누적 통계 (TrustMetric) | ClinicProfile.trustMetrics | 기준 기간·범위·증빙 동반 (DATA_MODEL CT-01). "국내 1위·최대" 등 단정 금지 |

### 4.4 문맥 예외 카탈로그 (false-positive 방지)

다음 안전·주의·행정 문맥은 § 4.1 단독 어휘 룰의 예외로 처리. RiskRule의 `contextExceptions[]`에 등록.

| 문맥 종류 | 인식 패턴 (예시) | 예외 대상 룰 | 의미 |
|---|---|---|---|
| **safety** (의료 안전 권유) | "(반드시\|꼭) (의료진과 )?(상담\|확인)하세요", "복용 전 (반드시 )?확인" | "전문성 단정 (단독 어휘)" | 안전 권유 표현은 의료광고 위반 아님 |
| **warning-message** (주의·금기 안내) | "(절대 )?금기", "(주의\|경고)\\s*[:：]", "복용 금지", "사용 금지" | "전문성 단정 (단독 어휘)" | 안전 정보 안내 |
| **administrative** (행정·약관) | "100%\\s*(환불 불가\|환불 보증\|예약 변경 불가)" 등 법적·약관 표현 | "전문성 단정 (단독 어휘)", "보장 표현" (행정 한정) | 약관·환불·결제 안내 |

> **운영 정책**: 본 표는 v0.4 최초 — 운영 누적으로 사례 확장. `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` 후속에서 풍부화.

---

## 5. 페이지 타입별 콘텐츠 룰

### 5.1 P-002 About — 정체성·신뢰도

- 의료기관 정식 명칭·설립일·연혁·인증 사실 기반
- "최고의·1위" 등 단정 금지
- 인증·수상은 검증 가능 출처 첨부 (Award.verificationUrl)
- 사회공헌·후원은 사실 안내

### 5.2 P-004 Doctor Profile

- 자격·학회·논문은 검증 가능 사실
- "명의·1인자" 등 단정 금지
- 개인 스토리 (`personalStory`)에 효과 단정 금지 (의료진 본인 스토리도 후기 위험도와 유사)

### 5.3 P-006 Treatment Detail — 가장 위험도 높음

- 슬롯별 위험도 격상 조건 (`PAGE_TYPES.md` § 3 P-006)
- 효과·기간·수치 단정 금지
- 후기·전후사진 포함 시 페이지 자동 High (`ReviewPolicy` 적용)
- 가격·이벤트 포함 시 자동 High
- 의료진 검토 필수

### 5.4 P-010 Article Detail — ArticleType별 차등 (§ 6)

### 5.5 P-011 FAQ — 답변 단위 위험도

- 답변마다 위험도 등급 부여 (`PAGE_TYPES.md` § 3 P-011)
- 효과·결과 관련 답변 → High → content-gate

### 5.6 P-101 Reviews — High-risk commercial

- 의료법 제56조 치료경험담 광고 금지 적용 — 사이트 게재 자체가 광고 해당 여부는 매체·방식별 법무 판정. 사전심의(제57조) 의무 여부도 별도 판정
- 후기 텍스트의 § 4.1 fail 표현은 자동 fail. content-gate 표현은 검수 큐 진입
- 전후사진은 기본 차단 — `ReviewPolicy.beforeAfterPhotoAllowed=true` + 법무 승인 기록 시에만 예외 발행

### 5.7 P-102 Pricing — High-risk commercial

- § 4.1 룰 일관 적용 — "최저가"·압박형 유인 표현(지금만·특가·한정·선착순)은 fail
- "할인·이벤트" 단순 사실 고지(예: "20% 할인 진행")는 content-gate — 법무 검수 후 발행
- 비급여 명시 필수
- 가격 변경 시 즉시 갱신

### 5.8 P-104 News/Event — 이벤트 카테고리만 High

- 일반 소식(휴진·이전·인사) Low
- 이벤트·할인 카테고리 → 자동 High → compliance-assistant 검수 필수

---

## 6. ArticleType별 콘텐츠 룰 (P-010)

`Article.articleType` (DATA_MODEL C-04 enum 7종) 기반 차등 적용:

RiskLevel(축 1)과 룰 severity(축 2)는 **별도 축**이며 본 표는 ArticleType의 **기본 위험도**를 정의한다. 본문 표현은 § 4.1 룰로 별도 평가된다. 위험도 High = 어드민 검수 큐 강제 진입(자동 content-gate 검수 트리거).

| ArticleType | 기본 위험도 | 콘텐츠 룰 |
|---|:---:|---|
| `notice` | Low | 휴진·이전·인사 — 사실 안내 |
| `general-medical-info` | Medium | 일반 의학 정보 — 진단·치료 단정 금지. 일반론 한정. **medical disclaimer 권장** |
| `treatment-explainer` | Medium | 특정 시술 설명 — 효과 단정 금지. 절차·원리·대상·주의사항 위주 |
| `condition-explainer` | Medium | 특정 질환 설명 — 진단 단정·자가 진단 유도 금지 |
| `effect-result-related` | **High** | 치료 효과·결과 관련 — 검수 큐 강제 진입. 기본 승인 역할 `["medical"]` (§ 7.1.2). 본문에 후기·사례·금액 표현 결합 시 § 4.1·§ 4.3 룰로 인해 `legal` 추가. 사례 묘사 시 "개인차 명시" |
| `review-case` | **High** | 환자 치료경험담 — 의료법 제56조 광고 금지 적용. 매체·방식별 법무 판정 필요 (§ 4.3·§ 5.6 정합). ReviewPolicy(C-13) 적용 |
| `event-price` | **High** | 이벤트·할인·가격 안내 — 의료광고법 환자 유인 금지 적용. § 5.7·§ 5.8 정합 |

### 6.1 ArticleType 자동 분류·검수

- 어드민에서 운영자가 직접 분류 (M0)
- compliance-assistant 모듈이 본문 분석 후 추천 분류 (M2+)
- `Article.inlineRiskFlags`로 본문 위험 요소 플래그 (`includes-effect-claim`·`includes-pricing`·`includes-event`·`includes-before-after`·`includes-testimonial`)

---

## 7. compliance-assistant Feature Module 인터페이스

본 Core는 표현 룰의 단일 SoT를 제공. 실제 자동 검수·LLM 분석은 `compliance-assistant` Feature Module이 본 표를 입력받아 처리.

### 7.1 입력

```ts
type ComplianceCheckInput = {
  contentType: ContentType;           // DATA_MODEL C-10 ComplianceRecord.contentType enum (Core 닫힌 enum 유지)
  featureContentType?: FeatureContentTypeId;  // Feature-backed 콘텐츠 시 사용 — § 7.1.1
  contentRef: string;                 // 대상 콘텐츠 @id
  body: Markdown;
  metadata: {
    pageTypeId?: PageTypeId;          // PAGE_TYPES (P-001~P-014, P-101~P-106)
    articleType?: ArticleType;        // DATA_MODEL C-04
    pageMeta?: PageMeta;              // DATA_MODEL C-06
    explicitRiskLevel?: RiskLevel;    // DATA_MODEL C-05. 어드민이 명시한 위험도 override (입력값 — 자동 추론 결과를 본 필드에 쓰지 않음)
    inferredRiskLevel?: RiskLevel;    // `RISK_LEVELS.md` § 2 자동 추론 결과 (운영 단계에서 compliance-assistant 호출 전 RiskInference로 산출). § 7.1.2 가상 finding 트리거 입력
  };
  riskRules: RiskRule[];              // § 7.4 RiskRule 스키마

  // v1.4 cascade · COMPLIANCE_ASSISTANT_PHASE_ALPHA v1.0 CAP-CASCADE-06 (Phase Alpha 안 metadata 7 신규 필드)
  // 모두 optional - 본 Feature 안 false-positive 완화 + auto-gate 부가 입력 + qa block scope + slot evaluation
  reviewPolicy?: { beforeAfterPhotoAllowed: boolean };
  mediaAttachments?: Array<{ kind: "image" | "video"; ref: string }>;
  legalDocumentType?: "privacy" | "terms" | "non-covered" | "refund" | "complaint" | "cookie" | "other";
  locationProfileField?: "branchDescription" | "transportInfo" | "parkingInfo";
  priorReviewRequired?: boolean;
  priorReviewPassed?: boolean;
  qaBlocks?: Array<{ question: string; answer: string; offsetStart: number }>;
  entityFields?: Record<string, unknown>;   // slot-matches evaluation - v0.1 미사용 (Phase Beta CA-DEFER-18)
};

// 둘 중 정확히 하나만 사용:
// - Core 콘텐츠: contentType 사용, featureContentType 미지정
// - Feature 콘텐츠: contentType="Feature"(C-10 enum cascade 1개 추가) + featureContentType 지정
```

#### 7.1.1 Feature contentType 식별 — `FeatureContentTypeId`

DATA_MODEL C-10 `ComplianceRecord.contentType` enum은 닫힌 enum으로 유지하되, Feature-backed 콘텐츠 식별을 위해 enum에 `Feature` 하나만 추가(cascade)하고 실제 구분은 별도 `featureContentType` 필드로 한다.

```ts
type FeatureContentTypeId = `feature:${FeatureSlug}`;  // kebab-case slug
type FeatureSlug = string;  // DATA_MODEL Slug 규약 — kebab-case (예: "self-test"). 정규식: ^[a-z][a-z0-9-]*[a-z0-9]$
```

| 영역 | contentType 값 | featureContentType 값 | 예시 |
|---|---|---|---|
| Core | C-10 토큰 | — (미지정) | `contentType="Article"` |
| Feature | `"Feature"` (C-10 cascade 1개) | `feature:<slug>` | `contentType="Feature"` + `featureContentType="feature:self-test"` (P-106) |

> P-105 ReservationPage는 Core 계약 C-20 — Feature namespace 아님. 본 namespace는 Core 계약 ID 미존재인 Feature 전용.

#### 7.1.1.1 ContentType 예외 — LegalDocument 면제 (LL-CASCADE-03 · LOCATION_LEGAL_PLAN v1.0 § 5)

LegalDocument(C-16)는 Core 표준 템플릿 + 변수 치환으로 자동 생성되는 정책 문서이므로 일반 콘텐츠 검증 룰이 부합하지 않는다. 다음 영역은 명시적으로 면제한다.

| 검증 영역 | LegalDocument 면제 사유 | 대체 보장 |
|---|---|---|
| answer-first AST | 정책 문서는 첫 문장 답 제시 구조가 아니라 조문·항목 구조 | 본문 자체는 법무 검토를 거친 Core 표준 템플릿 (LL-TEMPLATE-04) |
| 표현 검사 (recommend/best 등 광고 표현) | 정책 문서에는 광고 의도가 없음 | 동일 — Core 표준 템플릿 본문 |
| RiskRule 적용 (`riskRules: RiskRule[]`) | 정책 문서는 위험도 자동 추론 대상이 아님 | `risk_level='Low'` CHECK + 법무 검토 별도 게이트 (RISK_LEVELS § 4.3 의료법 광고 룰 우회) |
| RiskInference (`inferredRiskLevel`) | 위와 동일 | DB CHECK `risk_level='Low'` 강제 (LL-SCHEMA-06) |

**변수 화이트리스트 검증은 별도 룰**: LegalDocument body 안 `{{...}}` 변수는 Core 측 `renderTemplate` 가 strict whitelist (11개 변수)로 검증하며 (LL-ACTION-12), unknown key 는 build-time test (`packages/core-content/src/templates/__tests__.ts`) 와 server action runtime 양쪽에서 차단한다. compliance-assistant Feature 의 검증 input 으로 LegalDocument 를 보내지 않는 것이 본 면제의 운영적 결정이며, compliance-assistant 의 `check()` 진입 자체를 운영 단계에서 차단한다.

**ComplianceRecord 발행 게이트는 면제 아님**: LegalDocument 도 발행 단계에서 ComplianceRecord (`legalCounsel`/`legalCounselAt` 필수 · admin/ARCHITECTURE § 3.8.2) 가 별도로 요구된다. 본 절은 자동 검수 룰의 면제일 뿐 법무 검토 게이트는 그대로 유지.

#### 7.1.1.2 ContentType 예외 — Publication / MediaAppearance / FAQ (EC-CASCADE-03 · EAT_CONTENT_PLAN v0.x)

EAT_CONTENT_PLAN v0.x (C-24 Publication · C-25 MediaAppearance 신규 · C-12 FAQ 풀명세 합류) 의 검수 룰 적용 매트릭스:

| ContentType | answer-first AST | 표현 검사 | RiskRule | RiskInference | 비고 |
|---|---|---|---|---|---|
| `Publication` | **면제** | **면제** | **면제** (DB CHECK `risk_level='Low'` 고정) | **면제** | 외부 학술 인용 — clinic 자체 권고/표현 아님. 검수 input 자체가 외부 자료 (학술지) 라 불가 |
| `MediaAppearance` | **면제** | **면제** | **면제** (DB CHECK Low fixed) | **면제** | 외부 미디어 출연 인용 — 동일 사유 |
| `FAQ` Q | **적용** | **적용** (의료법 광고 표현 검수 · MEDICAL_AD_COMPLIANCE_COMMON 정합) | **적용** (compliance-assistant 합류 시 — EC-DEFER-05) | **적용** (RISK_LEVELS § 2 자동 추론 — 의료 진단/처방 질문 = Medium/High 후보) | 클리닉 자체 답변 |
| `FAQ` A | **적용** | **적용** | **적용** | **적용** | 동일 |
| `ArticleCategory` | (콘텐츠 자체 없음 · 분류 메타) | — | — | — | EAT v0.x C-22 실 운영 합류 — 룰 미적용 |

**v0.1 단계 운영 결정 (EAT v0.x EC-DEFER-12)**: 4 신규 entity (Publication·MediaAppearance·FAQ·ArticleCategory) 모두 어드민 폼 `status='draft'` 만 허용. compliance-assistant + risk_level 자동 추론 합류 (EC-DEFER-05) 까지 published 발행 차단. FAQ 는 DB CHECK 로 강제 (`faq_status_v01_limit`), Publication/MediaAppearance 는 zod schema 만 (DB CHECK 없음 — 외부 인용 entity 의 published 자체는 안전).

#### 7.1.2 High → gateRequired 변환 규칙

`metadata.articleType` 또는 `metadata.explicitRiskLevel`로 결정된 콘텐츠 단위 위험도가 `High`인 경우 다음 가상 finding 1개가 자동 주입된다:

```ts
{
  ruleId: "risk-level-high-gate",
  category: "위험도 강제 검수",
  pattern: "(RiskLevel=High)",
  severity: "content-gate",
  location: { start: 0, end: 0 },   // 콘텐츠 전체 — 의미상 메타
  requiredApproverRoles: ["medical"]  // 기본값. ArticleType별 override (§ 7.1.3)
}
```

**트리거 조건**: `metadata.inferredRiskLevel === "High"` 또는 `metadata.explicitRiskLevel === "High"` (둘 중 하나라도 High이면 주입). 트리거 출처는 finding 메타에 기록(예: `triggeredBy: "inferred" | "explicit"`)하여 감사 추적성 유지.

- 결과적으로 `gateRequired=true` + `findingsBySeverity["content-gate"] += 1`
- ArticleType별 기본 approver roles override — **High ArticleType만 적용** (Medium ArticleType은 본 § 7.1.2 가상 finding 미발생):
  - `effect-result-related` → `["medical"]`
  - `review-case` → `["medical", "legal"]` (의료진 + 법무 동시 필요)
  - `event-price` → `["legal"]`
  - 기타 High explicitRiskLevel/inferredRiskLevel → `["medical"]`
- Medium ArticleType(`general-medical-info`·`condition-explainer`·`treatment-explainer`)은 본 가상 finding 미발생. `physicianApprover` 등급 기본 요구는 별도 흐름(`RISK_LEVELS.md` § 6 매트릭스)으로 처리

#### 7.1.3 ApproverRole → ComplianceRecord 필드 매핑

```ts
type ApproverRole = "medical" | "legal" | "operator" | "client";
```

ComplianceRecord(C-10) 인간 검수 기록 4개 슬롯에 매핑된다 — `findingsBySeverity["content-gate"]` 처리 시 어드민 워크플로가 본 매핑을 사용:

| ApproverRole | 매핑 ComplianceRecord 필드 | 의미 |
|---|---|---|
| `medical` | `physicianApprover` + `physicianApprovedAt` | 의료진 콘텐츠 승인 |
| `legal` | `legalCounsel` + `legalCounselAt` | 법무 자문·승인 |
| `operator` | `peerReviewer` + `peerReviewedAt` | 운영자/동료 검수 |
| `client` | `clientApprover` + `clientApprovedAt` | 클라이언트 측 승인 (운영 정책 시) |

- compliance-assistant는 ApproverRole 배열만 출력 — 실제 ComplianceRecord 기록 생성·갱신은 어드민 발행 워크플로
- 어드민 워크플로 발행 조건 — `requiredApproverRoles[]`의 **모든** 역할에 대해 ComplianceRecord 해당 필드 기록 완료 시에만 발행 허용 (AND 조건)

### 7.2 출력

```ts
type ComplianceCheckResult = {
  // 자동 검수의 결정 — 빌드/검수 큐 트리거만. 최종 발행 가능 여부는 어드민 워크플로가 결정 (DATA_MODEL C-10 ComplianceRecord 인간 검수 기록과 결합)
  automatedDecision: "block" | "gate" | "warn" | "pass";
  // 세부 플래그 (편의)
  buildBlocked: boolean;        // findings 중 severity="fail" 1개 이상 시 true → CI 빌드 차단
  gateRequired: boolean;        // findings 중 severity="content-gate" 1개 이상 시 true → 어드민 검수 큐 진입
  hasWarnings: boolean;          // findings 중 severity="warning" 1개 이상 시 true → 어드민 경고 큐 진입
  // severity별 집계 — 키는 severity enum 값과 동일 ("content-gate" 그대로 사용)
  findingsBySeverity: {
    "fail": number;
    "content-gate": number;
    "warning": number;
    "info": number;
  };
  // 검수자 역할 요구 (gateRequired=true 시) — 매칭 룰의 requiredApproverRole 합집합. ArticleType High 트리거의 기본값(§ 7.1.2)과 룰 단위 요구를 union
  requiredApproverRoles?: ApproverRole[];
  // 상세 findings
  findings: Finding[];
};

// automatedDecision 결정 규칙
// - findings에 severity="fail" 1개 이상 → "block"
// - 위 아닌 경우 severity="content-gate" 1개 이상 → "gate"
// - 위 아닌 경우 severity="warning" 1개 이상 → "warn"
// - 아니면 "pass"
//
// 최종 발행 가능 여부 (publishable)은 본 인터페이스에 포함되지 않음 — 어드민 발행 워크플로가 다음을 종합 판정:
//   1) automatedDecision !== "block"
//   2) gateRequired=true 시 ComplianceRecord(C-10)의 인간 검수 완료
//   3) hasWarnings=true 시 운영 정책에 따라 검토 완료 또는 일괄 인정

// ApproverRole 정의는 § 7.1.3 참조 (medical | legal | operator | client)

type Finding = {
  ruleId: string;             // § 7.4 RiskRule.id (예: "supremacy-001"). High 가상 finding은 "risk-level-high-gate", LLM 제안은 "llm-suggestion-<UUID>"
  category: string;           // § 7.4 RiskRule.category (예: "최상급")
  pattern: string;             // 매칭된 패턴 텍스트 (예: "최고의"). LLM 제안에서 정규 패턴 산출 불가 시 빈 문자열 허용
  severity: "info" | "warning" | "fail" | "content-gate";
  location: { start: number; end: number };  // 본문 내 위치 (오프셋). LLM 제안에서 오프셋 산정 실패 시 { start: 0, end: 0 } (메타 의미)
  suggestion?: string;        // 대체 표현 (§ 4.2 참조)
  requiredApproverRoles?: ApproverRole[];  // 룰 단위 검수자 요구 (gate 룰만)
  // (v1.3 +) 출처 추적 메타 — features/compliance-assistant.md § 4.6
  triggeredBy?: "static-rule" | "inferred" | "explicit" | "llm-assist";
  llmAssistMeta?: { modelId: string; promptVersion: string; confidence: number };  // triggeredBy="llm-assist" 시
};
```

### 7.3 빌드 검증 vs 어드민 검수

| 단계 | 도구 | 처리 |
|---|---|---|
| 빌드 게이트 (CI) | 자체 룰 checker (§ 7.4 RiskRule 스키마 기반 정규식·키워드 매칭) | `buildBlocked=true` 시 빌드 차단 |
| 어드민 검수 | compliance-assistant LLM 보조 + 사람 검수 | `gateRequired=true` 항목 검토. ComplianceRecord(C-10) 인간 검수 기록 누적 → 어드민 워크플로가 최종 발행 가능 여부 결정 |

### 7.4 RiskRule 데이터 스키마

§ 4.1 의료광고 표현 룰의 컴퓨팅 표현. 자체 룰 checker·compliance-assistant 모두 본 스키마를 입력으로 받는다.

```ts
// 단일 패턴 룰
type SimpleRiskRule = {
  id: string;                  // 안정 식별자 (예: "supremacy-001", "guarantee-001")
  category: string;            // § 4.1 카테고리
  pattern: string;             // 매칭 패턴 — patternType에 따라 의미 해석
  patternType: "regex" | "keyword" | "phrase";
  severity: "info" | "warning" | "fail" | "content-gate";
  scope: ContentScope[];       // 적용 범위 — § 7.4.1
  requiredApproverRoles?: ApproverRole[];  // severity="content-gate" 시 1개 이상 필수 (배열 — § 7.1.3과 정합)
  suggestion?: string;
  rationale?: string;
  legalBasis?: string[];       // 법령 조문 인용 식별자 (예: "medical-law-art56-para2-no8"). canonical RiskRule 1개에 복수 조문 매핑. `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` § 3.0 패턴
  exceptions?: string[];       // 예외 어구 (false-positive 방지)
  contextExceptions?: ContextException[];  // 안전·주의·행정 문맥 예외 — § 4.4
  version: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

// 복합 룰 — § 7.4.3 문맥 결합 (composite)
type CompositeRiskRule = {
  id: string;
  category: string;
  patternType: "composite";
  operands: SimpleOperand[];   // 결합 대상 단일 패턴 (2개 이상)
  logic: "AND_IN_SENTENCE" | "AND_IN_PARAGRAPH" | "AND_NEAR";
  // - AND_IN_SENTENCE: 같은 문장 내 모두 등장
  // - AND_IN_PARAGRAPH: 같은 단락(빈 줄 분리 기준) 내 모두 등장
  // - AND_NEAR: window 거리 이내 모두 등장
  window?: number;             // logic="AND_NEAR" 시 char 거리. 기본 50. 다른 logic에서는 무시
  severity: "info" | "warning" | "fail" | "content-gate";  // 4종 모두 허용
  scope: ContentScope[];
  requiredApproverRoles?: ApproverRole[];
  suggestion?: string;
  rationale?: string;
  legalBasis?: string[];       // 법령 조문 인용 식별자 — SimpleRiskRule과 동일
  contextExceptions?: ContextException[];
  version: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

type SimpleOperand = {
  pattern: string;
  patternType: "regex" | "keyword" | "phrase";
};

type RiskRule = SimpleRiskRule | CompositeRiskRule;

// 적용 범위 — ID 타입 명시 (자유 문자열 금지)
type ContentScope =
  | { type: "pageType"; pageTypeId: PageTypeId }        // PAGE_TYPES (P-001~P-014, P-101~P-106)
  | { type: "articleType"; articleType: ArticleType }   // DATA_MODEL C-04 enum
  | { type: "block"; blockType: BlockType }              // qa | list | table | callout | citation | media
  | { type: "field"; contractId: ContractId; fieldPath: string }  // ContractId: C-01~C-22. fieldPath: dot notation (예: "summary", "reviewedBy.name")
  | { type: "feature"; featureContentType: FeatureContentTypeId }  // P-106 등 Feature-backed 콘텐츠 전용 룰 (예: featureContentType="feature:self-test")
  | { type: "global" };

// 문맥 예외 — § 4.4 안전·주의·행정 문맥
type ContextException = {
  kind: "safety" | "warning-message" | "administrative";  // 의료진 상담 권유·안전 주의·환불 약관 등
  pattern: string;             // 예외 인식 정규식 (예: "(상담하세요|금기|환불 불가)")
};
```

#### 7.4.1 스코프 일치 규칙

- `global` 룰은 모든 콘텐츠에 적용
- 여러 scope를 `OR`로 결합 — 1개 이상 일치하면 적용 대상
- pageType 룰과 articleType 룰이 모두 적용되는 경우 — 더 높은 severity 우선

#### 7.4.2 severity 우선순위

같은 텍스트 위치가 여러 룰에 매칭되는 경우 다음 우선순위로 최종 severity 결정 (높은 등급이 낮은 등급을 흡수):

```
fail > content-gate > warning > info
```

- 예: "100% 효과"는 `supremacy-001`(단독 어휘 content-gate)과 `guarantee-002`(효과 결합 fail)에 동시 매칭 → 최종 severity는 fail
- Finding[]에는 각 매칭 모두 보존 (감사 추적용). `ComplianceCheckResult`의 집계 결과(`buildBlocked`·`gateRequired`)만 우선순위로 흡수

#### 7.4.3 문맥 결합 룰 (composite rules)

- 단독 키워드(예: "100%") + 결과·효과·보장 어휘 결합 시 CompositeRiskRule로 표현
- 정규식 룰의 lookahead/lookbehind 또는 별도 CompositeRiskRule 사용 — 다중 패턴은 CompositeRiskRule 권장 (스코프·window 명시 가능)
- CompositeRiskRule의 `severity`는 4종(`info`/`warning`/`fail`/`content-gate`) 모두 허용 — § 4.1의 결합 의미 룰은 일반적으로 fail이나, 운영 정책에 따라 content-gate composite도 가능
- composite 룰 `category`는 결합 의미(예: "보장 결합 강조")로 명시

#### 7.4.4 운영·관리

- 룰 데이터의 원본은 본 문서 § 4.1 — 사람이 읽는 SoT
- 룰 데이터의 빌드용 표현은 별도 데이터 파일 (`compliance/rules.yaml` 또는 동등 포맷) — `compliance/RISK_LEVELS.md` 후속에서 파일 위치·포맷 확정
- 룰 변경은 § 1.4 변경 정책 적용 — 강화는 MAJOR

---

## 8. 빌드 검증 — 룰 레벨 (SCHEMA_MAPPING § 7.3·SEARCH_STANDARDIZATION § 8 정합)

| 레벨 | 정의 | 조치 |
|---|---|---|
| **fail** | 빌드 실패 | § 4.1 fail 표현 검출, H1 누락 등 |
| **warning** | 경고 + 어드민 검토 큐 | answer-first 위반, 구조화 블록 부재, H 위계 건너뜀 등 |
| **content-gate** | **빌드는 통과(자동 차단 X) + 사람 검수 큐 진입** — 본문 표현 검수 + schema 출력 승인 + 위험 콘텐츠 발행 전 인간 결재의 일반 의미 (`SCHEMA_MAPPING.md` § 7.3 동일 의미) | § 4.1 content-gate 표현, ArticleType=High 케이스, 한의 특유 표현, SCHEMA_MAPPING의 SpecialAnnouncement 등 schema 발행 결재 |

---

## 9. 미결정 사항

| ID | 항목 | 비고 |
|---|---|---|
| CS-03 | 사례·임상 데이터 인용 시 외부 검증 가능성 자동 판정 | 운영 누적 후 |
| CS-04 | 한의 특유 표현(체질·1:1 맞춤)의 회색지대 정밀 분류 | `presets/hanui-clinic/` 후속 |
| CS-05 | medical disclaimer 자동 삽입 정책 — 페이지 타입별 자동 출력 vs 운영자 명시 | UX 결정 |
| CS-06 | 다국어 콘텐츠에서 표현 룰 적용 — 영문·중문·일문 별도 사전 | M3 다국어 시 |
| CS-A | § 1.3 본문 글자 수 산정의 정확한 정규식 — Markdown 코드 블록·링크 URL·이미지 마크업·HTML 태그·공백·문장부호 제거 패턴 + § 2.1.1 answer-first AST 파서 라이브러리 선택 | 자체 룰 checker 구현 시 |
| CS-D | § 3.5 인용 가능 외부 도메인 화이트리스트 (학회·정부 도메인 카탈로그) | `compliance/MEDICAL_AD_COMPLIANCE_COMMON.md` 후속 |

### 9.1 해소된 미결정

| ID | 항목 | 해소 |
|---|---|---|
| ~~CS-01~~ | § 4.1 금지 표현 룰의 정규식·패턴 데이터 형식 | v0.2 — § 7.4 RiskRule 스키마로 확정. 데이터 파일 위치·포맷은 RISK_LEVELS.md 후속에서 결정 (CS-02 영역) |
| ~~CS-B~~ | 전후사진 법무 승인 기록 데이터 모델 | v0.3 — ComplianceRecord(C-10)에 책임 단일 이관 (`legalCounsel`·`legalCounselAt`·`attachments`). ReviewPolicy 별도 필드 신설 불필요 |
| ~~CS-C~~ | Feature-backed 콘텐츠 contentType cascade | v0.5 — DATA_MODEL C-10 enum에 `Feature` 토큰 1개 cascade 추가 + `featureContentType: feature:<slug>` 별도 필드로 세부 식별 (§ 7.1.1). Core enum의 기존 콘텐츠 토큰은 변경 없이 유지 |
| ~~CS-02~~ | content-gate 통과 기준 — 의료진 검수자만 vs 법무 자문도 포함 | v1.0 — `compliance/RISK_LEVELS.md` § 4 ApproverRole 통과 기준 4종(medical·legal·operator·client) + § 4.5 multi-role AND 발행 게이트로 확정 |

---

## 10. 변경 이력

| 일자 | 버전 | 변경 |
|---|---|---|
| 2026-05-14 | v0.1 | 최초 작성 — 톤·문체·길이, AEO·AI 스니펫 친화 구조(answer-first·헤딩·구조화 블록), 콘텐츠 블록 표준(Q&A·리스트·표·콜아웃·인용·임베디드), 의료광고 표현 단일 SoT(금지 11종·대체 표현·후기/전후/가격 별도 정책), 페이지 타입별 룰 8종, ArticleType 7종, compliance-assistant 인터페이스, 빌드 검증 fail/warning/content-gate |
| 2026-05-14 | v0.2 | **codex 자동 비평 1차 반영 (12개 지적 전건 수용)**: (1) § 0 SoT 참조 § 5→§ 4 정정, (2) § 1.3 본문 길이 산정 기준 "1,000자(공백 제외)" + Markdown 정규화 알고리즘 명시 → CS-A 미결정 신설, (3) § 3.1 Q&A 렌더링(HTML `<dl>`)과 JSON-LD FAQPage schema 책임 분리, (4) § 3.1 Q&A 룰 fail/content-gate 분리 적용 (§ 4.1 직접 참조), (5)·(6) § 4.1 보장 표현 통합 fail + 수치/기간 단정(보장어 미포함) content-gate 분리, 유인성 표현(시간·수량 압박)과 할인·이벤트 사실 안내(법무 판정 영역) 분리, (7) § 4.2 "100% 효과" 대체 표현 — 효과 진술을 인용·통계 출처 동반으로만 한정 (치료경험담 위험 제거), (8) § 4.3·§ 5.6 환자 후기 — 의료법 제56조 직접 인용, 사전심의(제57조) 단정 표현 제거, 매체·방식별 법무 판정 명시, (9) § 4.3·§ 5.6 전후사진 — ReviewPolicy.beforeAfterPhotoAllowed 의미를 "법무 승인 후 예외적 허용 플래그"로 명확화, 승인자·일자 필수 기록 (CS-B 신설), (10) § 7.1 ContentType을 DATA_MODEL C-10 ComplianceRecord.contentType과 동일 enum 명시, (11) § 7.2 ComplianceCheckResult 인터페이스 확장 — buildBlocked/gateRequired/publishable/requiredApproverRole 분리, (12) § 7.4 RiskRule 스키마 신설 (id/category/pattern/patternType/severity/scope/requiredApproverRole/suggestion/rationale/exceptions/version) + ContentScope 5종 + CS-01 해소 |
| 2026-05-14 | **v1.3** | **compliance-assistant v1.0 cascade**: § 7.2 Finding 타입에 `triggeredBy: "static-rule"\|"inferred"\|"explicit"\|"llm-assist"` 메타 + `llmAssistMeta` 필드 신설 — 출처·LLM 모델·신뢰도 추적. ruleId 규약 명시(High 가상=`risk-level-high-gate`, LLM 제안=`llm-suggestion-<hash>-<seq>`) |
| 2026-05-14 | **v1.2** | **MEDICAL_AD_COMPLIANCE_COMMON v1.0 cascade**: (1) § 7.4 SimpleRiskRule·CompositeRiskRule에 **`legalBasis?: string[]` 필드** 신설 — canonical RiskRule + 복수 법령 조문 인용 (MEDICAL_AD § 3.0 패턴), (2) § 3.5 citation 화이트리스트 cascade — `scholar.google.com`·`*.go.kr`·`*.or.kr` 예시 제거. `MEDICAL_AD_COMPLIANCE_COMMON.md § 8` SoT 참조 |
| 2026-05-14 | **v1.1** | **RISK_LEVELS v1.0 cascade**: (1) § 7.1 ComplianceCheckInput.metadata에 `inferredRiskLevel` 필드 신설 — `RISK_LEVELS § 2` 자동 추론 결과 입력. `explicitRiskLevel`은 어드민 명시 override 입력만, 자동 추론과 의미 분리, (2) § 7.1.2 가상 finding 트리거 조건 명시 — `inferredRiskLevel===High` ∨ `explicitRiskLevel===High`. `triggeredBy: "inferred"|"explicit"` 메타로 출처 추적, (3) § 7.1.2 ArticleType override 목록을 High ArticleType 전용으로 정리 — Medium ArticleType(`general-medical-info`·`condition-explainer`·`treatment-explainer`)은 가상 finding 미발생. Medium 등급 기본 요구는 RISK_LEVELS § 6 매트릭스로 처리. (4) § 9 CS-02 미결정 해소 — content-gate 통과 기준은 RISK_LEVELS § 4·§ 4.5가 SoT |
| 2026-05-14 | **v1.0** | **codex 자동 비평 5차 사이클 잔재 정리 마감 (7개 지적 전건 수용)**: (1) **DATA_MODEL C-10 cascade 누락 정정** — `contentType` enum에 `Feature` 토큰 추가. `featureContentType` 필드도 함께 추가 (`feature:<slug>` 정규식 명시), (2) ApproverRole 중복 정의 제거 — ComplianceCheckResult 코드 블록의 중복 type 삭제. 단일 SoT는 § 7.1.3, (3) SimpleRiskRule `requiredApproverRole` 단수 잔재 → `requiredApproverRoles?: ApproverRole[]` 배열로 통일 (§ 7.2와 정합), (4) § 6 effect-result-related 표 — 기본 승인 역할 `["medical"]` 명시. 후기·사례·금액 결합 시 `legal` 추가 (§ 7.1.2 override와 정합), (5) ContentScope union에 `feature` 변형 추가 — Feature-backed 콘텐츠 전용 RiskRule 적용 가능, (6) § 0 한 페이지 요약 content-gate 정의 — § 8·SCHEMA_MAPPING § 7.3과 동일 통일 정의로 갱신 (schema 출력 승인 게이트 포함), (7) § 9.1 CS-C 해소 설명 정정 — DATA_MODEL C-10 enum `Feature` 토큰 cascade 정확히 기술. **다음 단계**: compliance/RISK_LEVELS.md 후속 + 자체 룰 checker 실제 구현 (CS-A·CS-D 영역) + admin 검수 워크플로 명세 + 그 발견을 본 문서에 되먹이기 |
| 2026-05-14 | v0.5 | **codex 자동 비평 4차 반영 (12개 지적 전건 수용)**: (A) § 7.1 `featureContentType` 별도 필드 도입 — C-10 enum은 `Feature` 토큰 1개만 cascade 추가, 실제 구분은 namespace 필드로. (B) § 7.1.1 Feature 예시를 P-106 self-test로 정정 — P-105 ReservationPage는 Core C-20임을 명시. slug kebab-case 정규식(`^[a-z][a-z0-9-]*[a-z0-9]$`) 확정. (C) § 7.2 `findingsBySeverity` 키를 severity enum과 동일(`"content-gate"`)로 통일. (D) ApproverRole enum에 `client` 포함. (E) `requiredApproverRole` → `requiredApproverRoles: ApproverRole[]` 배열로. `review-case`는 `["medical", "legal"]` 기본값. 어드민 워크플로는 AND 조건으로 발행 게이트. (F) CompositeRiskRule `logic` enum 정밀화 — `AND_IN_SENTENCE`·`AND_IN_PARAGRAPH`·`AND_NEAR` 3종. (G) § 7.4.3 composite severity 4종 모두 허용으로 운영 규칙 정정. (H) ContentScope에 `featureContentType` 검증 흐름 (Feature contentType 입력 시) — 추후 검증기 구현. (9) § 3.5 인용 면제는 § 3.5 content-gate에만 적용 — § 4.1 fail 룰은 절대 완화 안 됨 명시. (10) § 4.3 가격·할인·이벤트 — P-102·P-104·P-010(`articleType=event-price`) cross-reference 명시. (11) **DATA_MODEL cascade — C-04 Article.body 권장 길이 "최소 300단어" → "최소 1,000자(공백 제외). CONTENT_STANDARDS § 1.3 SoT"** 정정. (12) § 8 content-gate 정의를 SCHEMA_MAPPING § 7.3과 통일 — schema 출력 승인 게이트 포함 |
| 2026-05-14 | v0.4 | **codex 자동 비평 3차 반영 (8개 지적 전건 수용)**: (1) § 7.1 ComplianceCheckInput.metadata 구조화 — `pageTypeId`·`articleType`·`pageMeta`·`explicitRiskLevel` 명시 필드, (2) § 7.1.2 High → gateRequired 변환 규칙 신설 — 가상 finding `risk-level-high-gate` 자동 주입, ArticleType별 approver role override, (3) § 7.1.3 ApproverRole → ComplianceRecord 필드 매핑 표 — medical/legal/operator/client 4종을 physicianApprover/legalCounsel/peerReviewer/clientApprover에 직접 매핑, (4) § 7.1.1 ContentType 표 — Core enum + `feature:<FeatureSlug>` namespace로 P-106 SelfTest 등 Feature 콘텐츠 표현 (CS-C 해소), (5) § 7.4 RiskRule을 SimpleRiskRule + CompositeRiskRule 합집합으로 분리. CompositeRiskRule에 operands·logic(AND/AND_NEAR)·window 필드 추가. ContentScope ID 타입 명시(PageTypeId/ArticleType/BlockType/ContractId), (6) § 4.4 문맥 예외 카탈로그 신설 (safety·warning-message·administrative) — false-positive 방지. RiskRule.contextExceptions[] 필드 신설, (7) § 3.5 citation absence 검출 구현 정의 — 효과·통계 주장 판정 패턴 + 인용 인정 소스 4종(embeddedMedia·blockquote·외부 URL·evidenceNotes) (CS-D 신설), (8) § 2.1.1 answer-first AST 검사 알고리즘 — frontmatter 제외, 메타·구조 노드 스킵, 첫 paragraph 노드 1~2 문장 판정 (CS-A 통합)|
| 2026-05-14 | v0.3 | **codex 자동 비평 2차 반영 (8개 지적 전건 수용)**: (A) § 5.7 P-102 룰 일관화 — 압박형 유인 표현 fail / 단순 할인·이벤트 사실 안내 content-gate, (B) § 4.1 전문성 단정 룰 분리 — 단독 어휘는 content-gate / 효과·결과·보장 결합은 fail. § 7.4.2 severity 우선순위 (fail > content-gate > warning > info) + § 7.4.3 문맥 결합 룰(composite) 신설, (C) § 4.3 전후사진 법무 승인 기록 — ReviewPolicy 별도 필드 대신 ComplianceRecord(C-10) 단일 SoT 책임 이관 (CS-B 해소), (D) § 6 ArticleType 표 — RiskLevel과 룰 severity 별도 축 명시. High = 어드민 검수 큐 강제 진입 트리거, (E) § 6 review-case "사전심의 대상" 단정 제거 — 의료법 제56조 + 매체·방식별 법무 판정 (§ 4.3·§ 5.6 정합), (F) § 7.2 ComplianceCheckResult — `publishable` 제거. 자동 검수는 `automatedDecision`(block/gate/warn/pass)·buildBlocked·gateRequired·hasWarnings·findingsBySeverity까지만 책임. 최종 발행 가능 여부는 어드민 워크플로 + ComplianceRecord(C-10) 결합 판정, (G) § 7.2 warning 검토 큐 표현 — hasWarnings·findingsBySeverity 추가, (H) § 7.1 contentType enum에 SelfTest 등 Feature-backed 콘텐츠 cascade 필요성 명시 (CS-C 신설) |
