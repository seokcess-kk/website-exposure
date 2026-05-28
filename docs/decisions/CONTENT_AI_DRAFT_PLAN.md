# CONTENT_AI_DRAFT_PLAN — Article 본문 AI Draft 생성 (CAI-DEFER-02 본 구현)

**상태**: v1.0 acceptance (2026-05-28 · cycle 5 수렴 0건)
**부모 plan**: `CONTENT_AI_ASSIST_PLAN.md` v1.0 (3 진입점 — SEO 메타·키워드 매핑·검수 코멘트)
**현 plan 흡수**: CAI-DEFER-02 (콘텐츠 초안 생성 · v3 marker · "큰 prompt + 의료광고법 책임 + 환각 risk")
**부분 흡수**: CAI-DEFER-05 (E-A-T citation 자동 추출) — publication entity 추천 한정
**유관 흡수**: CAI-DEFER-06 (PII mask) — full draft 진입 시 필수 marker

---

## 0. 의사결정 history

| 일자 | 결정 |
|---|---|
| 2026-05-28 | scope = **B (Full draft)** · AI 가 키워드 + 주제 1줄 입력 받아 800~1500자 본문 1회 생성. 운영자 검수 후 published. (옵션 A outline-only · C iterative section 미선택) |
| 2026-05-28 | citation 처리 = **AI 가 기존 publication entity 추천** · instance 안 publication 에서 keyword/topic 매칭 후 N 개 추천 → 운영자 select 후 content_entity_link 안 link |

본 plan 은 CAI plan 패턴 (cycle 5×31 self-critique 수렴 · 1 plan + 1 code) 답습. 본격 code 진입 전 self-critique cycle 안 수렴 확인 필수.

---

## 1.1 범위 (in-scope · v1)

### 진입점 (1종)
- **신규 article 생성 form 안 "AI draft 생성" panel** (기존 form 의 SEO 메타 옆 CAI v1 button 패턴 답습 · `/admin/<slug>/articles/new` 만 · `/articles/[id]/edit` 안 미합류 — CAID-DEFER-01 overwrite 정합).
  - 입력: primary keyword (`keyword_target` row 선택 또는 자유 입력) + 주제 1줄 (50~200자) + article category (기존 form 필드 활용).
  - 출력: title (1~200자) · summary (80~200자) · body_markdown (800~1500자) + 추천 publication N개 (0~5).
  - 운영자가 form 안 자동 채워진 값을 검수/수정 후 status='draft' 로 저장. **AI 출력 = 항상 draft · 직접 published 절대 X**.

### 권한
- **operator + super-admin 만** AI panel 접근. legal-reviewer · physician-reviewer · client-approver = read-only (panel 미렌더). CAI v1 의 권한 정합 답습 (생성·수정 action = operator).

### 출력 형식 강제
- body_markdown 구조: intro (1 문단 · 80~150자) + H2 3~4 개 (각 200~350자) + conclusion (1 문단 · 80~150자).
- **primary keyword** = H1 (title) + H2 첫 1개 안 1회 + intro 안 1회 = 최소 3회.
- **secondary keyword** = 0~N개 · 각 H2 안 1회 분산 (반복 X).
- citation 자리 = `[근거: <publication.title>]` 형태 markdown 안 inline placeholder. 운영자가 form 저장 시 publication 선택 → content_entity_link UPSERT.

### 데이터 모델 영향
- **DB 변경 = C0043 의 prompt_template CHECK constraint ALTER 1건** (manifest 외 patch · LL-DEFER-20 안 통합 marker). 기존 자산 활용:
  - `article` table (title · summary · body_markdown · status='draft')
  - `keyword_target` + `keyword_content_link` (primary + secondaries · CAI-DEFER-13 본 구현 정합)
  - `publication` table (instance 안 등록된 entity)
  - `content_entity_link` (article → publication · relation_type=`'cites'` · EVIDENCE_LINKING_PLAN v1.0 안 confirmed whitelist 3종 [`cites`·`related-to`·`derived-from`] 中 `cites` 정합 · source_type=`'Article'` · target_type=`'Publication'`)
  - `llm_call_log` (CAI v1 의 C0043 답습 · prompt_template CHECK 안 `'article-full-draft'` 추가)

### 흐름 정합
- CAI v1 의 `LLM_DAILY_CAP_PER_INSTANCE` (default 100) 안 합류 — full draft 는 **weight 5** (1 call = 5 quota 차감) 로 cost 정합 (Haiku 4.5 input ~500t · output ~1500t · cache ~4000t 기준 약 5x CAI v1 평균).
- CAI v1 의 `ANTHROPIC_API_KEY` env · silent fallback (미설정 시 button 미렌더) 답습.
- CAI v1 의 `safeParseLlmJson` (code fence strip + zod fallback) 답습.
- CAI v1 의 cache_control 1024t minimum prefix (Haiku 4.5) 답습 — system prompt + 의료광고법 reference 안 cache.

---

## 1.2 의도 (why now)

| # | 진단 |
|---|---|
| 1 | 사용자 SoT 안 "웹사이트별 칼럼 AI 작성 + 키워드 노출 정합" 명시 (2026-05-28). |
| 2 | CAI v1 (3 진입점) 안착 — `lib/ai/` · `components/ai/` · `llm_call_log` · prompt cache · daily cap 인프라 완비. **신규 entity X · DB 변경 X**. |
| 3 | `keyword_target` + `keyword_content_link` 완성 (SEO_KEYWORD_STRATEGY_PLAN v1.0) — readiness `title-has-target-keyword` check 가 AI 출력 안 즉시 pass 가능. |
| 4 | `publication` table + `content_entity_link` 완성 (EVIDENCE_LINKING_PLAN v1.0) — citation 추천 본 구현 가능. |
| 5 | improvement-queue 의 `relations-thin` · `seo-improve` 카테고리 = 본 plan 안 산출되는 article 가 자동 reduce. **개선큐 → 직접 fix 진입** 닫힘 (CAI-DEFER-01 readiness 개선 제안 본 구현 X · 본 plan 안 신규 article 만).

---

## 1.3 비범위 (defer · CAID-DEFER)

| # | 항목 | 사유 | marker |
|---|---|---|---|
| 1 | 기존 article 본문 overwrite (재생성) | v1 = 신규 article 만 · overwrite = 의료광고법 책임 + 운영자 검수 cost 큼 | CAID-DEFER-01 |
| 2 | treatment_page · medical_condition_page · faq 본문 draft | v1 = article (칼럼) 만 · 다른 entity = 별 cycle | CAID-DEFER-02 |
| 3 | 외부 source URL → 본문 변환 (asset-ingestion) | CAI-DEFER-04 (asset-ingestion Feature) 답습 · 본 plan 안 미흡수 | CAID-DEFER-03 |
| 4 | streaming response (SSE) | v1 = full response 후 form 채움 · v2+ streaming UI (CAI-DEFER-09) | CAID-DEFER-04 |
| 5 | tool use (function calling 안 publication 자동 link) | v1 = single-turn JSON 안 추천 list → 운영자 select · v2+ tool use (CAI-DEFER-08) | CAID-DEFER-05 |
| 6 | 다국어 (영어 칼럼) | v1 = 한국어 만 · 사용자 SoT 안 미요청 | CAID-DEFER-06 |
| 7 | 운영자 brief 안 환자 정보 PII 자동 mask | v1 = brief 안 PII 입력 금지 warning · v2+ 자동 mask | CAID-DEFER-07 |
| 8 | 본문 안 자동 JSON-LD MedicalArticle.about 추출 | v1 = 운영자 수동 link · v2+ tool use 안 자동 | CAID-DEFER-08 |
| 9 | 이전 article 안 paragraph 재사용 (style transfer) | v1 = 매 draft 독립 · v2+ style learning | CAID-DEFER-09 |
| 10 | A/B variant 생성 (제목 2개 안 1 select) | v1 = 1 안 출력 · v2+ multi-variant | CAID-DEFER-10 |
| 11 | 운영자 brief 자유 입력 없이 keyword 만 으로 자동 주제 생성 | v1 = brief 50자 minimum 필수 (의료광고법 책임 분산) · v2+ keyword-only mode | CAID-DEFER-11 |
| 12 | LLM 출력 형식 위반 시 자동 재 generation retry | v1 = 1회 call · reject 시 운영자 retry 결정 · v2+ exponential backoff retry | CAID-DEFER-12 |
| 13 | brief 200자 초과 longer brief mode (운영자가 본문 의도 더 상세히 입력) | v1 = 200자 max (책임 분산 · 운영자 본문 작성 회피) · v2+ longer brief 분리 mode | CAID-DEFER-13 |
| 14 | weight=5 추정치 실 measure 후 재조정 | v1 = 추정치 고정 · v2+ 운영 1주 후 token 측정 + weight 조정 | CAID-DEFER-14 |
| 15 | ConsumeQuota advisory lock race 회피 | v1 = SELECT COUNT + INSERT 비-atomic (CAI v1 답습 · race risk 미미) · v2+ pg_advisory_xact_lock 도입 | CAID-DEFER-15 |
| ~~16~~ | ~~brief 2-stage flow~~ | **v1 합류 완료** (2026-05-28 cycle) — opt-in mini button 안 textarea 옆 합류. C0048 (article-brief-draft CHECK 추가 · manifest 외) + lib/ai/article-brief-draft.ts + useArticleBriefDraft hook. weight 1 quota. 1-stage default 유지 + 2-stage opt-in. | ~~CAID-DEFER-16~~ |

---

## 2. 운영자 워크플로우

신규 article 생성 시점 1 entry point. 5 step.

### Step 1 — 신규 article form 진입
- `/admin/<slug>/articles/new` 페이지 안 form 상단에 "AI draft 생성" panel 합류 (CAI v1 의 SEO 메타 button 위치 답습).

### Step 2 — primary keyword + brief 입력
- panel 안 3 input:
  - primary keyword (select · `keyword_target` 안 active row 만 + 자유 입력 fallback · 자유 입력 시 keyword_target 자동 INSERT X — 운영자가 별도 등록)
  - secondary keywords (multi-select · **0~3** · primary 제외 · cycle 2 #3 = H2 4개 slot 정합)
  - brief (textarea · 50~200자 · placeholder "이 칼럼이 다룰 주제·논점·결론 1줄. 환자 정보 입력 금지")
- **brief validation 2 layer**: (a) client-side 안 textarea length 표시 + button disabled (50자 미만) (b) server action 안 zod safeParse (50~200 reject 시 에러 surface).
- **PII 정책 v1** = brief 안 자유 텍스트 입력 + placeholder warning + runbook 안 가이드. 자동 mask = CAID-DEFER-07 (v2+). regex 차단 (휴대폰·주민번호) v1 안 미합류 — false positive (의학 통계 안 숫자) risk 큼.
- **form 상단 banner 강화** (cycle 2 #8) = "이 panel 안 입력하신 브리프는 Anthropic API 안 전송됩니다. 환자 실명·연락처·진료기록·진단 정보 입력 시 PIPA 위반 + 의료법 위반 책임 = 운영자에게 있습니다." — red border + warning icon · CAI v1 의 banner 답습 강도.
- "AI draft 생성" button. 클릭 시 server action 안 LLM call. **연속 click 차단** = button 안 loading state + 5초 cooldown (race 회피 · cycle 1 #10 정합).

### Step 3 — LLM call (server action)
- `lib/ai/article-full-draft.ts` 안 `generateArticleFullDraft(input)`:
  - 1) **publication candidate 매칭 2 단계 + publicationType sort** (cycle 3 #6):
    - (a) **우선** = `keyword_content_link` 안 primary keyword 와 link 된 publication row (relevance desc · top 3).
    - (b) **fallback** = `publication.title` ILIKE `%{primary keyword}%` OR `publication.summary` ILIKE `%{primary keyword}%` (top 5 fill).
    - dedup.
    - **publicationType priority sort** = external-authority (1) → government (1) → academic-society (1) → statistics (2) → internal-research (3) — E-A-T 강도 정합. 동률 시 publishedDate desc.
    - 최종 top 5 안 trim.
  - 2) Haiku 4.5 call · prompt_template='article-full-draft' · cache_control prefix (system prompt + 의료광고법 reference + candidate publication metadata 만).
  - 3) LLM 출력 JSON parse · `safeParseLlmJson` (CAI v1 답습 · code fence strip + zod fallback) · zod schema (title · summary · bodyMarkdown · recommendedPublicationIds[]).
  - 4) **server-side filter** = recommendedPublicationIds 안 instance 의 publication.id whitelist 만 통과 (LLM hallucinate 차단 · cycle 1 #10).
  - 5) **server-side validation** (cycle 3 #4·#7):
    - title 1~200자 · summary 80~200자 · bodyMarkdown 800~1500자 CHECK.
    - bodyMarkdown 안 H2 (`^## `) count 3~5 (3~4 목표 + 1 tolerance).
    - **위반 시 LLM 결과 reject** = form 자동 채움 X + 운영자 안 banner ("AI 출력 형식 위반 — 사유: [구체] — 다시 시도하거나 직접 작성하세요") + retry CTA button + quota 차감 유지 (cost 발생함 · 사용자에게 transparent).
    - v2+ 자동 재 generation retry = CAID-DEFER-12 신설.
  - 6) `llm_call_log` 안 prompt_template · status · token usage · cost · weight=5 기록.
  - 7) daily cap 차감 atomicity = `UPDATE llm_call_log` 안 row-level lock 활용 (instance 별 daily count + 5 ≤ cap CHECK · 차감 fail 시 button "오늘 할당 부족" surface).

### Step 4 — form 안 자동 채움 + publication select
- form 의 title/summary/bodyMarkdown/slug 자동 입력. 운영자 검수/수정.
- **AI panel 미입력 field** (cycle 4 #2) = author_doctor_id · hero_image_url · category_id · status — 운영자가 form 안 별 선택. AI panel 안 category_id 만 입력 (publication 매칭 alg 안 미사용 · form 안 default 채움).
- **자동 채움 후 button 재클릭 = overwrite confirm** (cycle 2 #5) = `window.confirm("기존 내용을 덮어쓰시겠습니까?")` 차단. cancel 시 LLM call 안 일어남.
- **slug 자동 생성** = title 안 SLUG_AUTOGEN_PLAN v1 의 `generateSlug(title)` 활용 (한글 → 영문 transliteration 안 SLG-DEFER 마커이라 v1 안 fallback = title 기반 한글 검출 시 운영자 안 "slug 직접 입력 필요" surface). slug 한글 미지원 정합.
- recommended publication 카드 (0~5) — 각 row 안 checkbox + publication.title · summary preview. 운영자가 link 할 N 개 select.
- **publication candidate 0개 empty state** (cycle 2 #4·#12) = "추천 publication 없음 · 운영자가 publication 페이지 안 직접 등록 후 link" + `/admin/<slug>/publications/new` deep link. citation 없는 칼럼 허용 (강제 X).
- bodyMarkdown 안 `[근거: <title>]` placeholder 가 운영자 select 한 publication 정합:
  - **fuzzy match alg** (cycle 2 #10) = (a) 정확 매칭 우선 (b) 공백 제거 후 매칭 (c) levenshtein distance ≤ 5 (d) substring 매칭 (서로 prefix/suffix). false negative (예: "당뇨" vs "당뇨병") 운영자 manual link fallback (publication 카드 안 "특정 placeholder 와 link" 옵션).
  - **mismatch 시 inline warning badge** ("이 placeholder 와 매칭되는 publication 미선택"). 차단 X — 운영자 판단.
  - 자동 link X (CAID-DEFER-08 답습).

### Step 5 — 저장
- 운영자가 save action 클릭 시:
  - article INSERT (status='draft' · AI 출력 절대 published 진입 X)
  - keyword_content_link INSERT (primary + secondaries)
  - content_entity_link INSERT (article → publication relation_type='cites' · source_type='Article' · target_type='Publication' · 운영자 select 한 만큼)
  - readiness 재계산 (기존 흐름 답습)
- **save fail UX** (cycle 3 #9) = title duplicate (instance + slug unique) · category_id FK fail · CHECK fail 시:
  - form 안 자동 채워진 값 유지 (재 LLM call 회피 — quota 보호)
  - 에러 banner 안 구체 (예: "slug '○○' 이 이미 존재 — slug 수정 후 다시 저장하세요")
  - quota 차감 = 유지 (LLM call 안 완료된 cost · 환불 X)

---

## 3. 데이터 모델

### DB 변경 (0건)
DB 변경 X. 기존 자산 활용 (1.1 안 명시).

### llm_call_log enum 확장
- 기존 prompt_template CHECK whitelist 안 `'article-full-draft'` 추가. C0043 의 CHECK constraint ALTER (raw SQL · manifest 외 · LL-DEFER-20 안 통합 예정).

### weight 차감 모델
- CAI v1 의 daily cap = call 단위 차감 (1 call = 1 quota). 본 plan = full draft 1 call = **5 quota** 차감 (cost 정합 추정).
- weight=5 근거 추정: Haiku 4.5 input ~500t + output ~1500t + cache ~4000t (1회 cache miss 가정) = 약 $0.005/call · CAI v1 SEO 메타 (input ~200t + output ~150t) ≈ $0.001/call · ratio ~5x. **첫 운영 1주 후 실 token 측정 후 weight 재조정** marker (CAID-DEFER-14 안 추가).
- `llm-audit.ts` 안 `checkDailyQuota(tx, instanceId, weight=1)` 시그니처 확장. CAI v1 위치는 weight=1 default 답습. 본 plan 안 weight=5 호출.
- 5 quota 미달 시 silent fallback (button 안 "오늘 할당 부족" disabled state).
- **race 회피 = v1 안 미합류 (CAID-DEFER-15 신설)** = CAI v1 의 `checkDailyQuota` 도 SELECT COUNT + INSERT 비-atomic 패턴 답습. weight=5 + cap 100 안 race 시 최대 5 quota 초과 가능 (~5%) — 실 cost 영향 미미. v2+ advisory lock (cycle 4 #4).

### llm_call_log 저장 정책
- CAI v1 `insertLlmCallLog` 답습 = **input/output prompt 자체 저장 X · token count + status + cost + latency 만**. brief 안 운영자가 실수로 PII 입력해도 DB 안 저장되지 않음 (PII 누출 위험 최소).
- entity_type='Article' · entity_id=null (신규 article 안 아직 INSERT 전 — Step 5 안 article INSERT 후 별도 audit_event 안 link).
- triggered_by = 운영자 admin_user.id.

---

## 4. AI prompt template

### system prompt (cache_control prefix · 약 1500 tokens)
```
당신은 한국 의료기관 칼럼 작성을 보조하는 AI 도구이다.

[엄격 준수]
1. 의료법 제56조 (의료광고 금지 행위) · 시행령 제23·24조 (광고 심의 · 광고 금지 행위 세부) 준수.
   - 검증되지 않은 치료 효과·완치율·"국내 최초"·"부작용 없음" 표현 금지.
   - 환자 후기 인용·비교 광고·치료 보장 표현 금지.
2. E-A-T (Expertise·Authoritativeness·Trustworthiness) 정합.
   - 객관적·중립적 톤. 의학적 사실 + 가이드라인 인용 형태.
   - 본문 안 `[근거: <publication.title>]` placeholder 안 삽입 (운영자가 후에 link).
3. 환자 정보 (이름·연락처·진료기록·진단명 등 PII) 절대 본문 안 미포함.
4. **출력 = 100% 한국어**. 의학 용어 만 영문 병기 허용 (예: "당뇨병 (Diabetes Mellitus)"). 다른 언어 단독 단어/문장 금지.

[출력 형식 강제]
**JSON only** — markdown code fence (```json ... ```) · ``` 등 wrap 절대 금지. 첫 character = `{` · 마지막 character = `}`.

schema:
{
  "title": "1~200자 한국어 · primary keyword 포함",
  "summary": "80~200자 한국어 · primary keyword 포함",
  "bodyMarkdown": "intro 1 문단 + H2 3~4 개 (각 200~350자) + conclusion 1 문단 · 800~1500자",
  "recommendedPublicationIds": ["uuid 0~5 · candidate 안 선택 · candidate 0개 시 빈 배열 [] 출력"]
}

[markdown 구조 강제]
- bodyMarkdown 안 **H1 (`# `) 절대 미사용** — title 은 form 의 별 input · markdown 안 H2 (`## `) 부터 시작.
- 구조: intro 문단 → `## <소제목>` (3~4개) → conclusion 문단.
- H3 이하 (`### `) 사용 X (v1 단순화).
- bodyMarkdown 안 list (`- `) · table (`|`) 허용 (의학 정보 정리 자연스러움).
- title · summary 안 markdown 금지 (plain text 만 · marked.js 안 의도치 않은 렌더 회피).

[키워드 배치 규칙]
- primary keyword = title 안 1회 + intro 안 1회 + H2 첫 1개 안 1회 (최소 3회).
- secondary keywords (0~3) = 각각 다른 H2 안 1회 분산 (반복 X · 1 H2 안 1 secondary 만).

[citation placeholder 규칙]
- candidate publication 안 관련 있는 것 만 `[근거: <title>]` 안 inline 삽입.
- candidate 0개 (publication 미등록 instance) 시 placeholder 안 출력 강제 X — `recommendedPublicationIds: []` + 본문 안 placeholder 0개.
- 본문 안 약 1~3개 placeholder · 0 개 도 허용 (CAID-DEFER-08 안 자동 link 강제 X).
```

### user prompt (per-call · 약 500 tokens)
```
[primary keyword] {primaryKeyword}
[secondary keywords] {secondariesJoined or "없음"}
[article category] {categoryName}
[brief] {brief}

[candidate publications]
{candidates.map(p => `- ${p.id} · ${p.title} (${p.publicationType})`).join("\n")}

위 정보 기반으로 칼럼 1편을 JSON 으로 출력하라.
```

### cache_control 정합
- Haiku 4.5 minimum prefix 4096 tokens — system prompt 1500t + 의료광고법 reference 안 약 2500t 추가하여 cache 정합 (CAI v1 답습).
- **cache boundary** (cycle 3 #1) = 의료광고법 reference 까지 (instance 공통 · 4096t 충족). candidate publication metadata = user prompt 안 (instance 별 가변 · cache miss).
- 5분 TTL 안 동일 instance 안 연속 draft 시 cache hit (system + 의료광고법 reference).
- cache miss 비용 = system prompt 1500t + 의료광고법 reference 2500t = 약 4000t input (Haiku 4.5 ~$0.004). 운영 1주 후 실 cache hit rate 측정 후 weight 재조정 protocol (3 데이터 모델 안 명시 정합).

---

## 5. 검증 책임

| Layer | 검증 책임 |
|---|---|
| 1 | LLM = "draft" 라는 명시 — form 안 banner ("AI 가 생성한 초안입니다. 검수 후 저장하세요.") |
| 2 | 운영자 검수 = 의료법 책임 주체. 본 plan 안 자동 published X · WorkflowActionButtons 안 published 전이 시 sentinel ComplianceRecord 필수 (기존 흐름 답습) |
| 3 | review_queue_entry 진입 = 본 plan 안 강제 X (CAI v1 동일). 운영자 판단에 위임 |
| 4 | 의료광고법 자동 검수 = compliance-assistant Phase Beta (CA-DEFER-22 · CAI-DEFER-03) 안 — 본 plan 미흡수 |
| 5 | 환각 검증 = 운영자 final 책임. citation = 운영자 수동 link · 본 plan 안 자동 fact-check X (CAID-DEFER-08) |
| 6 | **published 전이 시 readiness 흐름** (cycle 4 #6) = WorkflowActionButtons 안 published 전이 안 readiness check 안 통과 필요 (기존 흐름 답습). AI draft 안 hero_image_url · author_doctor_id 미설정 시 readiness 가 published 차단 — 운영자 안 보강 책임. 본 plan 안 신규 흐름 X. |

---

## 6. 운영자 매뉴얼 outline

`docs/runbooks/CONTENT_AI_DRAFT_OPS.md` 신규 (CAI v1 의 CONTENT_AI_ASSIST_OPS.md 답습 6 part):

1. AI draft panel 사용 흐름 (Step 1~5)
2. brief 작성 가이드 (좋은 brief / 나쁜 brief · 환자 정보 입력 금지 강조 항목)
3. 비용 모니터링 (5 quota/draft · 일 cap 100/5=20 draft)
4. 의료법 책임 (운영자 final 승인 · 검증되지 않은 수치 hardcode 금지)
5. 장애 대응 (API key 누락 · LLM JSON parse 실패 · LLM 결과 reject · cap 초과 · publication 추천 0 · publication.id hallucinate)
6. CAID-DEFER 11건 안내 (overwrite · treatment 본문 · streaming · tool use 등 v2+ scope)

---

## 7. code task scope (참고 · code cycle 진입 시 분할)

| # | task | 검증 |
|---|---|---|
| 1 | `packages/core-content/src/migrations/C00XX_llm_call_log_prompt_template_alter.sql` 안 CHECK constraint 안 'article-full-draft' 추가 (manifest 외 patch) | psql 안 ALTER 적용 + 기존 row 안 영향 X 확인 |
| 2 | `apps/web/src/lib/ai/article-full-draft.ts` 안 `generateArticleFullDraft(input)` server-side 함수 | vitest 안 publication 매칭 alg · server-side filter · validation · safeParseLlmJson · weight 5 차감 = 약 15 tests. **Anthropic SDK mock 전략** = CAI v1 의 `vi.mock('@anthropic-ai/sdk')` 패턴 답습 — `lib/ai/anthropic-client.ts` 안 createMessages 함수 mock |
| 3 | `apps/web/src/lib/ai/prompt-templates.ts` 안 'article-full-draft' template export · cache_control 정합 | vitest 안 system prompt 안 의료광고법 reference · H1 금지 · 한국어 강제 · code fence X · keyword 배치 규칙 12 case |
| 4 | `apps/web/src/components/ai/article-draft-panel.tsx` 안 panel UI (form 상단 banner + 3 input + button + loading + confirm dialog) | e2e smoke 안 panel render · disabled state · button click · loading state |
| 5 | `apps/web/src/app/(admin)/admin/[instanceSlug]/articles/new/page.tsx` 안 panel mount | typecheck PASS · 시각 검수 (/admin/demo/articles/new) |
| 6 | server action 안 publication 추천 매칭 (keyword_content_link 우선 + ILIKE fallback · top 5) | vitest 안 매칭 alg case 6 (0 link · 1 link · 5 link · ILIKE 만 · dedup · empty publication instance) |
| 7 | `content_entity_link` relation_type 확인 (cycle 1 #5 · cycle 2 #7) — EVIDENCE_LINKING_PLAN 안 grep + plan 안 정합 cite | code cycle 안 grep 결과 plan 안 마커 update |
| 8 | `apps/web/src/lib/ai/llm-audit.ts` 안 `consumeQuota(instanceId, weight=1)` 시그니처 확장 + race 회피 (instance row-level lock) | vitest 안 weight 1 vs 5 · cap 차감 · race case 5 |
| 9 | `apps/web/e2e/smoke.spec.ts` 안 본 panel 시나리오 1 추가 (cycle 2 #9) | 누계 18 PASS 정합 |
| 10 | `docs/runbooks/CONTENT_AI_DRAFT_OPS.md` 신규 (6 part · CAI v1 답습) | 마크다운 lint X (수동 검수) |

---

## 7. self-critique cycle 1

### 발견 항목 (11건)

| # | 항목 | 처리 |
|---|---|---|
| 1 | **prompt_template enum 안 'article-full-draft' 추가** = C0043 의 CHECK constraint 가 raw SQL ALTER 필요. manifest 외 patch 추가 + LL-DEFER-20 안 통합 marker 필요. plan 안 명시 부족 | v0.2 안 데이터 모델 섹션 보강 |
| 2 | **publication 추천 매칭 로직** = "primary keyword text ∈ publication.title\|summary" 단순 LIKE 안 noise 큼 (예: "다이어트" 안 무관 publication 매칭). keyword_content_link 안 publication 가 link 된 것 우선 + LIKE fallback 안 분기 필요 | v0.2 안 매칭 alg 명시 |
| 3 | **brief 50자 minimum** = CAID-DEFER-11 안 keyword-only mode 차단인데, brief 50자 미만 시 button disabled 만으로 충분? server validation 별도 필요 | v0.2 안 validation 위치 명시 |
| 4 | **weight=5 cost 정합** = 추정 (input 500t + output 1500t + cache 4000t · Haiku 4.5 약 $0.005/draft · CAI v1 SEO 메타 약 $0.001/call). 실 token 측정 후 weight 조정 marker 필요 | v0.2 안 weight 조정 protocol marker |
| 5 | **content_entity_link 안 article → publication relation_type='cites'** = 기존 EVIDENCE_LINKING_PLAN 안 정의된 relation_type whitelist 확인 필요. 'citation' 외 'reference' 등 alias 가능성 | code cycle 안 확인 — plan 안 marker |
| 6 | **신규 article slug 자동 생성** = AI 출력 안 slug 미포함. SLUG_AUTOGEN_PLAN v1 (title → slug) 활용 가능? form 의 기존 slug 입력 흐름 답습? | v0.2 안 form 동작 명시 |
| 7 | **summary 80~200자 CHECK** = article table 의 article_summary_length CHECK 안 정합. AI 출력 안 보장 X 시 zod safeParse 안 fallback (재 generation 또는 trim) 정책 부족 | v0.2 안 fallback 명시 |
| 8 | **title 1~200자 CHECK** = 동일. AI 출력 안 200자 초과 시 어떻게? truncate? 재 generation? | v0.2 안 명시 |
| 9 | **운영자 brief 환자 정보 입력 금지** = warning placeholder 만으로 충분? brief textarea 안 input validation 안 일부 패턴 (휴대폰 번호 regex · 한국 이름 +환자 컨텍스트) 차단 필요? CAID-DEFER-07 (자동 mask) 안 마저 추가? | v0.2 안 PII 정책 명시 |
| 10 | **AI 가 추천한 publication.id 가 실제 instance 안 존재** = LLM hallucinate 가능성 (candidate 안 없는 uuid 출력). server action 안 instance 별 publication.id whitelist filter 필수 | v0.2 안 server-side filter 명시 |
| 11 | **본문 안 `[근거: <title>]` placeholder mismatch** = AI 가 title 변형해서 출력할 수 있음 (예: "○○ 한방 연구" → "한방 연구 (○○)"). 운영자 select 와 placeholder 매칭 안 fuzzy match? warning 만 띄움? | v0.2 안 mismatch 정책 명시 |

### 수렴 상태
cycle 1 = **11건 발견** · 전건 v0.2 안 흡수 또는 marker. cycle 2 진입.

### cycle 1 → v0.2 흡수 결과

| # | cycle 1 항목 | v0.2 안 흡수 위치 |
|---|---|---|
| 1 | prompt_template enum ALTER | 1.1 데이터 모델 영향 안 명시 (manifest 외 patch · LL-DEFER-20 통합 marker) |
| 2 | publication 매칭 alg | Step 3 의 (1) 안 2 단계 (keyword_content_link 우선 + ILIKE fallback) |
| 3 | brief 50자 validation | Step 2 안 client + server 2 layer |
| 4 | weight=5 추정 + 재조정 protocol | 3 데이터 모델 안 weight 차감 모델 안 명시 |
| 5 | content_entity_link relation_type='cites' | 1.1 데이터 모델 영향 안 code cycle 확인 marker |
| 6 | slug 자동 생성 | Step 4 안 SLUG_AUTOGEN_PLAN 활용 + 한글 fallback |
| 7 | summary 80~200자 fallback | Step 3 의 (5) 안 server-side validation + LLM 결과 reject 정책 |
| 8 | title 1~200자 fallback | 동일 (Step 3 의 (5)) |
| 9 | brief PII 정책 | Step 2 안 v1 = placeholder warning + runbook · v2+ 자동 mask (CAID-DEFER-07) |
| 10 | LLM 추천 publication.id whitelist filter | Step 3 의 (4) 안 server-side filter |
| 11 | placeholder mismatch 정책 | Step 4 안 fuzzy match (levenshtein ≤ 5) + warning badge · 차단 X |

---

## 8. self-critique cycle 2

### 발견 항목 (12건)

| # | 항목 | 처리 |
|---|---|---|
| 1 | **markdown header level 정합** = title 은 form 의 별 input · bodyMarkdown 안 H2 (`## `) 부터. prompt 안 "H1 (`# `) 절대 미사용" 강제 부족 | v0.3 안 prompt template 안 명시 |
| 2 | **JSON code fence wrap 강조** = safeParseLlmJson 답습 OK · prompt 안 "JSON only · ```json 등 wrap X" 강조 부족 | v0.3 안 prompt 강조 |
| 3 | **secondary keywords UI 5 max · H2 3~4 정합 X** = secondary 5 + primary 1 = 6 keyword · H2 4개 안 각 1회 분산 시 부족. UI max 를 secondary 0~3 (총 4 keyword ≤ H2 4 ≤ slot 정합) | v0.3 안 Step 2 max 조정 |
| 4 | **recommendedPublicationIds 0개 시 empty state** = "추천 publication 없음 · 운영자 안 publication 페이지 안 직접 등록 후 link" surface + deep link `/admin/<slug>/publications/new` | v0.3 안 Step 4 안 명시 |
| 5 | **form 안 자동 채움 후 button 재클릭 = 운영자 작업 overwrite** = confirm dialog ("기존 내용 덮어쓰시겠어요?") 필요 | v0.3 안 Step 4 안 confirm 명시 |
| 6 | **AI 출력 한국어 강제** = Haiku 4.5 multi-lingual model 안 일부 영어 혼입 가능. prompt 안 "출력 = 100% 한국어 (의학 용어 만 영문 병기 허용)" 명시 | v0.3 안 prompt 안 추가 |
| 7 | **content_entity_link relation_type whitelist** = EVIDENCE_LINKING_PLAN 안 정확 확인 마커 (v0.2 안 추가 됐지만 code cycle 안 grep + 위반 시 plan refactor) | v0.3 안 EVIDENCE_LINKING 확인 step 명시 |
| 8 | **brief 안 환자 정보 입력 → 의료광고법 위반 시 책임** = Section 5 부족? form 안 banner 안 강화 ("브리프 안 환자 정보·실명·연락처·진료기록 입력 시 PIPA 위반 + 의료법 위반 책임 = 운영자") + runbook 안 강조 항목 | v0.3 안 form banner 강화 |
| 9 | **e2e smoke 안 본 panel 합류** = Phase 1 smoke (17 PASS) 안 본 panel 미포함. code cycle 안 e2e 시나리오 추가 (button render · disabled state · loading state) | v0.3 안 code task list 안 e2e 합류 |
| 10 | **fuzzy match levenshtein ≤ 5 default false negative** = "췌장암" vs "췌장 암" (공백) · "당뇨" vs "당뇨병" · 운영자 manual link fallback 보강 | v0.3 안 fuzzy match alg detail 명시 |
| 11 | **vitest scope 명시** = 매칭 alg · server-side filter · validation 4 case + safeParseLlmJson reuse · publication 추천 unit test = 약 15 tests 추정 | v0.3 안 code task 안 vitest 합류 |
| 12 | **publication 0개 instance 시점** = candidate 0개 → prompt 안 "candidate publications: 없음" → LLM `recommendedPublicationIds: []` 자연. bodyMarkdown 안 placeholder 강제 X (citation 없는 칼럼 허용) | v0.3 안 prompt 안 명시 + Step 4 empty state 정합 |

### 수렴 상태
cycle 2 = **12건 발견** · 전건 v0.3 안 흡수 또는 marker. cycle 3 진입.

### cycle 2 → v0.3 흡수 결과

| # | cycle 2 항목 | v0.3 안 흡수 위치 |
|---|---|---|
| 1 | markdown H1 금지 | 4 prompt template 안 markdown 구조 강제 안 명시 |
| 2 | JSON code fence X 강조 | 4 prompt template 안 출력 형식 강제 강화 |
| 3 | secondary 5 → 3 max | Step 2 안 0~3 조정 + prompt 안 keyword 배치 정합 |
| 4 | recommended 0개 empty state | Step 4 안 명시 + deep link `/admin/<slug>/publications/new` |
| 5 | overwrite confirm | Step 4 안 window.confirm 명시 |
| 6 | 한국어 강제 | 4 prompt template 안 엄격 준수 #4 추가 |
| 7 | content_entity_link relation_type 확인 | 7 code task #7 안 EVIDENCE_LINKING grep step |
| 8 | brief 안 PII banner 강화 | Step 2 안 form 상단 banner 강화 |
| 9 | e2e smoke 시나리오 추가 | 7 code task #9 안 명시 |
| 10 | fuzzy match alg detail | Step 4 안 4 단계 alg 명시 + manual link fallback |
| 11 | vitest scope 명시 | 7 code task 안 각 task 별 vitest 명시 (#2 15 tests · #3 12 case · #6 6 case · #8 5 case) |
| 12 | publication 0개 instance 시점 | 4 prompt template citation 규칙 + Step 4 empty state 정합 |

---

## 9. self-critique cycle 3

### 발견 항목 (10건)

| # | 항목 | 처리 |
|---|---|---|
| 1 | **prompt cache_control prefix 가 instance 별 가변** = 의료광고법 reference + system prompt 는 모든 instance 공통이지만 candidate publication metadata 는 instance 별 가변. cache prefix = 의료광고법 reference 까지만 (4096t 충족) · candidate metadata 는 user prompt 안 — cache hit 정합 보강 | v0.4 안 cache_control boundary 명시 |
| 2 | **brief 200자 max 강제 이유** = 의료광고법 책임 분산 위해 brief 짧게 (운영자가 본문 안 미리 작성 X) vs 운영자 expressiveness. v1 = 200자 max + v2+ longer brief mode (CAID-DEFER-13 신설) | v0.4 안 CAID-DEFER-13 추가 |
| 3 | **vitest 안 fixture LLM mock** = Anthropic SDK call mock 필요. CAI v1 안 어떻게? vitest mock 패턴 확인 + 답습 | v0.4 안 vitest scope 안 mock 전략 명시 |
| 4 | **server action 안 zod safeParse 안 LLM 출력 reject 시 운영자 UX** = error toast? form 상단 banner? button 안 retry CTA? 명시 부족 | v0.4 안 Step 3 (5) 안 UX 명시 |
| 5 | **권한 (operator·legal-reviewer·physician-reviewer·client-approver) 안 본 panel 접근** = AI draft 생성 = content 수정 action · operator + super-admin 만. legal-reviewer/client-approver = read-only. 명시 부족 | v0.4 안 권한 명시 |
| 6 | **publication 추천 안 publicationType filter** = "external-authority"·"government"·"academic-society"·"statistics" 우선 (E-A-T 강함) vs "internal-research" (자체 콘텐츠) 후순위. 추천 alg 안 sort 반영 | v0.4 안 Step 3 (1) 안 sort 명시 |
| 7 | **AI 출력 안 H2 가 3개 미만 또는 5개 이상 경우** = "H2 3~4 개" 강제했지만 LLM hallucinate 가능. server-side validation 안 H2 count 안 포함? 또는 운영자 검수 위임? | v0.4 안 server-side validation 안 H2 count 추가 vs 위임 결정 |
| 8 | **본 plan 안 한 cycle 1 #5 (relation_type 확인) 가 code cycle 위임** = code cycle 안 EVIDENCE_LINKING_PLAN grep 후 plan 안 실제 cite 안 정합 X 시 plan refactor 비용 큼. plan v0.4 안 미리 grep + cite 안 정합 확인 | v0.4 진입 직전 grep 후 plan cite |
| 9 | **AI draft 생성 후 운영자 안 save 안 article INSERT 실패 시점** = title duplicate (instance + slug unique) · category_id FK fail · content CHECK fail 등. AI 출력 안 form 안 채워졌지만 save fail 시 운영자 안 어떻게 surface? quota 차감 = 차감 유지 (cost 발생) | v0.4 안 save fail UX 명시 |
| 10 | **panel mount 위치** = 신규 article form `/articles/new` 만 vs 기존 article form `/articles/[id]/edit` 안에도? CAID-DEFER-01 (overwrite) 안 후자 차단. 단, 운영자가 신규 article 안 draft 저장 후 AI panel 안 재호출 시점은 별 — `/articles/[id]/edit` 안 panel 미합류 | v0.4 안 명시 |

### 수렴 상태
cycle 3 = **10건 발견** · 전건 v0.4 안 흡수 또는 marker. cycle 4 진입.

### cycle 3 → v0.4 흡수 결과

| # | cycle 3 항목 | v0.4 안 흡수 위치 |
|---|---|---|
| 1 | cache_control boundary | 4 prompt template 안 cache_control 정합 안 boundary 명시 + miss cost 측정 protocol |
| 2 | brief 200자 max + longer brief 분리 | 1.3 CAID-DEFER-13 신설 |
| 3 | vitest LLM mock 전략 | 7 code task #2 안 mock 전략 명시 (CAI v1 답습) |
| 4 | LLM reject UX | Step 3 (5) 안 banner + retry CTA + transparent quota 차감 명시 |
| 5 | 권한 명시 | 1.1 안 권한 섹션 추가 (operator + super-admin) |
| 6 | publicationType filter sort | Step 3 (1) 안 sort 추가 (E-A-T 우선) |
| 7 | H2 count validation | Step 3 (5) 안 H2 3~5 count CHECK 추가 |
| 8 | relation_type pre-grep | 1.1 데이터 모델 안 `'cites'` confirmed 정합 cite + 전 plan 안 `'citation'` → `'cites'` 정정 |
| 9 | save fail UX | Step 5 안 form 값 유지 + 에러 banner + quota 유지 명시 |
| 10 | panel mount 위치 | 1.1 진입점 안 `/articles/new` 만 + `/edit` 미합류 명시 |

---

## 10. self-critique cycle 4

### 발견 항목 (6건)

| # | 항목 | 처리 |
|---|---|---|
| 1 | **AI 출력 안 markdown list/table 사용 가능성** = LLM 가 bullet list (`- `) 또는 table (`\|`) 출력 시 site SSR 안 marked.js 안 렌더 정상? title/summary 안 markdown 금지 명시 부족 | v0.5 안 prompt 안 명시 — bodyMarkdown 안 list/table 허용 · title/summary 안 plain text 만 |
| 2 | **categoryId · author_doctor_id 처리** = AI panel 안 카테고리 입력 받지만 author 는 입력 X. form 안 default 채움 (운영자 본인 doctor profile? 또는 form 안 default empty?) | v0.5 안 author_doctor_id = AI panel 미입력 (운영자가 form 안 별 선택) 명시 |
| 3 | **llm_call_log 안 input/output 저장 정책** = brief 안 PII 가능성 (운영자가 실수로 환자 정보 입력) — input prompt 저장 시 PII 누출. CAI v1 안 어떻게? — input prompt hash 만 저장? 또는 full 저장? plan 안 명시 부족 | v0.5 안 llm_call_log 저장 정책 명시 (CAI v1 답습 확인) |
| 4 | **ConsumeQuota race row-level lock** = `SELECT FROM instance WHERE id = ? FOR UPDATE` 안 lock 보유 후 cap check + llm_call_log INSERT? 또는 `pg_advisory_xact_lock(hashtext('llm-quota-' \|\| instance_id))` 패턴? CAI v1 안 어떻게 처리? 명시 부족 | v0.5 안 race 회피 strategy 명시 (CAI v1 답습 확인) |
| 5 | **신규 article published 후 ISR revalidate 60s** = AI panel 안 영향 없음 (draft 만 저장) — published 전이 시 기존 흐름. plan 안 명시 X 도 무관. 단 cycle 5 안 marker 가능성 | v0.5 안 명시 X (기존 흐름 답습) |
| 6 | **AI draft generation 후 운영자 안 검수 X 채 published 진입 시점** = WorkflowActionButtons 안 published 전이 시 readiness check 안 통과 필요 (기존 흐름). AI 출력 안 readiness 충족 안 할 수 있음 (예: hero image · author_doctor_id 미설정). 운영자 안 published 전 보강 — plan 안 명시 부족 | v0.5 안 5 검증 책임 안 readiness 흐름 추가 |

### 수렴 상태
cycle 4 = **6건 발견** · 전건 v0.5 안 흡수 또는 marker. cycle 5 안 0건 수렴 시도.

### cycle 4 → v0.5 흡수 결과

| # | cycle 4 항목 | v0.5 안 흡수 위치 |
|---|---|---|
| 1 | markdown list/table 허용 + title/summary plain text 강제 | 4 prompt template 안 markdown 구조 강제 안 명시 |
| 2 | categoryId · author_doctor_id 처리 | Step 4 안 AI panel 미입력 field 명시 |
| 3 | llm_call_log 저장 정책 | 3 데이터 모델 안 llm_call_log 저장 정책 섹션 추가 (CAI v1 답습 — input/output prompt 자체 저장 X) |
| 4 | ConsumeQuota race | 3 데이터 모델 안 race 회피 v1 미합류 명시 + CAID-DEFER-15 신설 |
| 5 | ISR revalidate 60s | 기존 흐름 답습 — plan 안 신규 명시 X (확인 OK) |
| 6 | published 전이 readiness 흐름 | 5 검증 책임 안 row 6 추가 (기존 흐름 답습) |

---

## 11. self-critique cycle 5

### 발견 항목 (0건)

| # | 항목 | 처리 |
|---|---|---|
| — | (cycle 5 안 신규 발견 없음 · v0.5 안 수렴 완료) | — |

### 수렴 상태
cycle 5 = **0건 발견** · **v1.0 acceptance 가능**. CAI plan 의 5 cycle 31건 수렴 패턴과 정합 (본 plan = 5 cycle 39건 수렴 [cycle1 11 + cycle2 12 + cycle3 10 + cycle4 6 + cycle5 0]).

### 누적 self-critique 분포

| cycle | 발견 | 흡수 | 누적 |
|---|---|---|---|
| 1 | 11 | 11 | 11 |
| 2 | 12 | 12 | 23 |
| 3 | 10 | 10 | 33 |
| 4 | 6 | 6 | 39 |
| 5 | 0 | 0 | 39 |

CAI plan cycle 4 = 3건 → cycle 5 = 0건 패턴과 정합 (cycle 4 부터 발견 가속 감소).

### v1.0 acceptance 진단

- **scope = v0.1 → v0.5 안 변동 X** (B Full draft + publication 추천 · 사용자 SoT 정합).
- **DB 변경** = 1건 (`C00XX_llm_call_log_prompt_template_alter.sql` · manifest 외 patch · LL-DEFER-20 통합).
- **CAID-DEFER** = 15건 (overwrite · treatment 본문 · asset-ingestion · streaming · tool use · 다국어 · PII mask · JSON-LD 자동 · style transfer · A/B variant · keyword-only · retry · longer brief · weight 재조정 · advisory lock).
- **CAID-CASCADE** = (v1.0 acceptance 시 도출 · 외부 plan 영향 marker).
- **code task** = 10건 (1 SQL · 6 lib/ai · 2 component/page · 1 e2e · 1 runbook).

---

## 변경 이력

- **2026-05-28**: v0.1 draft 작성 — 사용자 SoT 안 "웹사이트별 AI 칼럼 작성" 요청 (2026-05-28). scope 결정 (B Full draft + publication 추천). CAI-DEFER-02 본 plan 안 분리 · CAI-DEFER-05/06 부분 흡수. 11 CAID-DEFER (overwrite · treatment 본문 · asset-ingestion · streaming · tool use · 다국어 · PII mask · JSON-LD 자동 · style transfer · A/B variant · keyword-only mode). cycle 1 self-critique 11건.
- **2026-05-28**: v0.2 draft — cycle 1 11건 전건 흡수 (데이터 모델 안 enum ALTER + Step 2 brief validation + PII 정책 + Step 3 publication 매칭 alg + server-side filter + validation + Step 4 slug + fuzzy match · weight 5 근거 + race 회피). cycle 2 self-critique 12건.
- **2026-05-28**: v0.3 draft — cycle 2 12건 전건 흡수 (secondary 0~3 max · Step 2 banner 강화 · Step 4 overwrite confirm + publication 0개 empty state · Step 4 fuzzy match 4 단계 + manual link fallback · prompt template 안 H1 금지 + 한국어 강제 + code fence X 강화 + publication 0개 시점 명시 · code task 10 + vitest scope). cycle 3 self-critique 10건.
- **2026-05-28**: v0.4 draft — cycle 3 10건 전건 흡수 (cache_control boundary + miss cost protocol · CAID-DEFER-12 retry + CAID-DEFER-13 longer brief 신설 · vitest mock 전략 · LLM reject UX + retry CTA · operator 권한 명시 · publicationType E-A-T sort · H2 count CHECK · relation_type 'cites' confirmed cite + 전 plan 안 'citation' 정정 · save fail UX · panel mount 위치). cycle 4 self-critique 6건 (수렴 가속 — CAI plan cycle 4 = 3건 패턴 답습).
- **2026-05-28**: v0.5 draft — cycle 4 6건 전건 흡수 (prompt template 안 list/table 허용 + title/summary plain text 강제 · Step 4 안 AI panel 미입력 field · llm_call_log 저장 정책 (CAI v1 답습 — input/output prompt 자체 저장 X · PII 안전) · CAID-DEFER-14 weight 재조정 + CAID-DEFER-15 advisory lock 신설 · 검증 책임 안 readiness 흐름 추가). cycle 5 self-critique 0건.
- **2026-05-28**: **v1.0 acceptance** — 5 cycle 39건 self-critique 수렴 (cycle1 11 + cycle2 12 + cycle3 10 + cycle4 6 + cycle5 0). CAI plan 의 5 cycle 31건 수렴 패턴과 정합. scope 변동 X (v0.1 → v0.5 안 B Full draft + publication 추천). CAID-DEFER 15건 · code task 10건 · DB 변경 1건. code cycle 진입 가능.
- **2026-05-28**: CAID-DEFER-16 추가 — brief 2-stage flow (keyword 만 → brief 1차 LLM 생성 → 운영자 검수/수정 → 본문 2차 LLM 생성). 사용자 cycle 안 제안. v1 안 1-stage 유지 (의료광고법 책임 분산 안전 default) · v2+ opt-in mini button 합류 marker.
- **2026-05-28**: CAID-DEFER-16 **v1 합류** — 사용자 추가 cycle 안 즉시 합류 결정. opt-in mini button "brief 자동 생성 ✨ (1 quota)" panel 안 textarea 옆 mount. C0048 migration (article-brief-draft CHECK 추가 · manifest 외) + `lib/ai/article-brief-draft.ts` server action (weight 1) + `hooks/useArticleBriefDraft.ts` + ArticleFullDraftPanel 안 mount + brief overwrite confirm + error banner. 7 신규 vitest PASS (system prompt 안 의료광고법 + 4 요소 패턴 + 50~200 강제 · user prompt 안 secondary 0개 시점 · output schema 50/200 boundary). 누계 312 PASS. typecheck PASS · web:build PASS. CAID-DEFER 15건 남음.
- **2026-05-28**: **v1.1 SEO/GEO 강화 cycle** — 사용자 진단 ("SEO/GEO 정합?") 답변 시 70% 정합 진단 후 상위 3건 즉시 합류 결정. (1) bodyMarkdown 800~1500자 → **1500~2500자 long-form** + maxTokens 2048→3072 + weight 5→7 (cost ~1.5x 정합) (2) **first sentence TL;DR + 정의 패턴** prompt 강제 (LLM 첫 문장 추출 친화 · Google Featured Snippet · 네이버 지식 카드) (3) **마지막 H2 = "## 자주 묻는 질문" FAQ block** 강제 (Q&A 3~4쌍 · `### Q. <질문>` 형식 · Google FAQ rich snippet + GEO direct answer 친화). H2 count 3~5 → 4~6 (정보형 3~4 + FAQ 1). list/table "허용" → "적극 권장" (LLM chunking). 키워드 밀도 1~2% 명시. citation placeholder 1~3 → 2~4 권장. helper validateLlmOutput + zod schema + llm-audit weight + panel quota 표기 정합 update. vitest fixture 정합 (baseValid 9 repeat · H2 6→7 reject). 누계 314 PASS. typecheck PASS · web:build PASS.
- **2026-05-28**: **v1.2 slug LLM 직접 생성 + ArticleForm 안 SeoMetaSuggestionPanel 제거** — 사용자 진단 (SEO 메타 안 metaDescription 20~160 vs article.summary 80~200 mismatch). 변경 2건: (a) **SeoMetaSuggestionPanel mount 제거** = ArticleForm 안 import + render 제거 (FaqForm/TreatmentPageForm 는 유지 — 사용자 별도 확인 X). (b) **slug LLM 직접 생성** = articleFullDraftOutputSchema 안 slug 필드 추가 (regex `^[a-z0-9][a-z0-9-]{2,99}$`) + system prompt 안 slug 규칙 명시 (영문 lowercase + hyphen · primary keyword 영문 transliteration 또는 의미 있는 영문 keyword 권장) + helper validateLlmOutput 안 slug regex 검증 (slug-invalid-format 신규 reason) + onApply 안 setV 안 slug 추가 + markSlugDirty 호출 (useAutoSlug 안 title watch 안 overwrite 차단). 8 신규 vitest PASS (slug 한글/대문자/2자/hyphen-start reject · 숫자 시작 OK · output schema 한글/대문자/누락 reject). 누계 322 PASS. typecheck PASS · web:build PASS.
