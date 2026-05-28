# CONTENT_AI_DRAFT_OPS — 칼럼 AI Draft 생성 운영자 매뉴얼

**관련 plan**: `docs/decisions/CONTENT_AI_DRAFT_PLAN.md` v1.0 (5 cycle 39건 self-critique 수렴)
**부모 runbook**: `docs/runbooks/CONTENT_AI_ASSIST_OPS.md` (CAI v1 — SEO 메타·키워드 매핑·검수 코멘트)

본 runbook 은 CAI-DEFER-02 본 구현 — Article 본문 AI Full Draft 생성 panel 의 운영 가이드.

---

## 1. AI Draft panel 사용 흐름

진입점 = `/admin/<slug>/articles/new` (신규 article 만 · `/articles/[slug]` 안 mount 안 됨 — CAID-DEFER-01).

### Step 1 — 신규 article form 진입
- 어드민 좌측 NavMenu 안 "콘텐츠 → 아티클" → "신규 추가" 또는 `/admin/<slug>/articles/new` 직접 진입.
- form 상단 안 brand-primary 색 box 안 "AI 칼럼 Draft 생성" panel 표시.

### Step 2 — Primary keyword + Secondary + Brief 입력
- "AI Draft 생성 ✨" 버튼 클릭 → modal open.
- **Primary keyword** = `keyword_target` active row 안 자동완성 dropdown 또는 자유 입력.
  - 등록된 keyword 안 선택 시 publication 매칭 정확도 높음 (keyword_content_link 우선).
- **Secondary keywords** = 0~3개 (chip select · primary 제외 자동 filter).
- **Brief** = 50~200자. 칼럼 주제·논점·결론 1줄.
  - 좋은 예: "사상체질에 따라 다이어트 접근이 어떻게 달라질 수 있는지 한방의학 관점에서 정리하고, 본 한의원의 진료 흐름을 소개."
  - 나쁜 예: "다이어트 좋은 칼럼 작성" (너무 추상적), "환자 김○○ 36세 비만 사례" (PII).

#### Brief 자동 생성 mini button (CAID-DEFER-16 v1 합류 · opt-in)
- Brief textarea 옆 "brief 자동 생성 ✨ (1 quota)" mini button.
- primary keyword 입력 후 enable. click → ~3초 안 brief 자동 채움 → 운영자 검수/수정 → 본문 "AI Draft 생성 (5 quota)" 진행 (총 6 quota 차감).
- 기존 brief 가 있으면 overwrite confirm dialog ("기존 brief 를 덮어쓰시겠습니까?").
- **운영자 검수 책임 = 1-stage 와 동일** — LLM 가 생성한 brief 도 의료광고법 정합 확인 책임은 운영자에게. brief 안 검증되지 않은 효과·비교 광고 표현 발견 시 직접 수정 후 본문 진행.
- 사용 권장 시점:
  - 키워드 만 알고 brief 작성 막힐 때
  - 평이한 outline 으로 충분한 칼럼 (차별점 깊게 필요 X)
- 사용 비추 시점:
  - 본 한의원만의 차별점·진료 흐름 깊게 반영 필요한 칼럼 (1-stage 직접 입력 권장)

### Step 3 — 생성 button (5 quota 차감)
- "AI Draft 생성 (5 quota 차감)" 클릭 → ~10초 대기.
- 결과 도착 시 modal Step B 자동 전환.

### Step 4 — 결과 검수 + Publication select
- title · summary · bodyMarkdown 표시. 운영자 검수.
- 추천 publication 0~5개 카드 — 본문 안 `[근거: <title>]` placeholder 와 link 할 항목 checkbox select.
- 추천 publication 0개 시 `/admin/<slug>/publications/new` deep link.

### Step 5 — form 에 적용
- "form 에 적용" 버튼 → modal close + form 의 title/summary/bodyMarkdown/slug 자동 채움.
- 운영자 form 안 직접 추가 검수/수정 (slug · category · author 등 별 input).
- "추가" button 클릭 → article INSERT (status='draft' · published 전이는 별도 WorkflowActionButtons).

---

## 2. Brief 작성 가이드

### 좋은 brief 특징
- **구체적**: 다룰 주제 + 결론/논점 명시 ("...를 정리", "...접근법을 소개").
- **운영자 의도 반영**: 본 한의원의 진료 흐름 또는 관점 포함.
- **검증 가능**: 의학적 사실 기반 (가이드라인·문헌 인용 가능 한 주제).
- **50~200자**: 짧으면 환각 risk · 길면 운영자가 본문 작성 시작 (의료광고법 책임 분산 X).

### 나쁜 brief 특징
- 환자 정보 포함 (이름·연락처·진료기록·진단 등 PII) — **PIPA 위반 + 의료법 위반 책임 = 운영자**.
- 검증되지 않은 효과·완치율·"최초"·"부작용 없음" 등 의료광고법 위반 표현.
- 비교 광고 ("다른 곳 보다 효과적인" 등).
- 환자 후기·만족도 인용.

### PII 입력 절대 금지
- 본 panel 안 입력한 brief 는 Anthropic API 안 전송됩니다.
- `llm_call_log` 안 input/output prompt 자체 저장 X — DB 안 PII 누출 위험 X.
- 단, **외부 API call 시점 안 PII 전송 = PIPA 위반**. brief 안 PII 입력 금지.

---

## 3. 비용 모니터링

### Quota
- `LLM_DAILY_CAP_PER_INSTANCE` env (default 100) — instance 별 일 quota.
- **article-full-draft v1.1 = 7 quota** 차감 (long-form 1500~2500자 + FAQ block · cost ~1.5x).
- **article-brief-draft = 1 quota** 차감 (CAID-DEFER-16 v1 합류 · 짧은 output ~200t).
- CAI v1 의 SEO 메타·키워드·검수 = 1 quota.
- 예: cap 100 안 article draft 14회/day (또는 brief mini button + full draft 2-stage = 8 quota × 12회/day).

### v1.2 변경 (2026-05-28)
- **ArticleForm 안 SEO 메타 AI 제안 panel 제거** — metaDescription 20~160자 vs article.summary 80~200자 mismatch 정합 X 라 사용자 진단 후 제거. FAQ/Treatment form 의 SEO 메타 panel 은 유지.
- **slug 도 AI Draft 안 함께 생성** — LLM 가 영문 의미 slug 출력 (예: "constitution-diet-guide") → form 안 자동 채움. 운영자 별 입력 불필요. 한글 title 안 fallback `article-<nanoid>` 회피 → SEO 친화.

### v1.1 칼럼 구조 (SEO/GEO 강화)
- **본문 1500~2500자** long-form (2026 Google + 네이버 안 ranking 친화).
- **intro 첫 문장 = TL;DR 정의 패턴** — "○○ 이란 ~ 이다" 형식 강제. LLM 검색 (ChatGPT · Claude · Perplexity) 첫 문장 추출 + Google Featured Snippet + 네이버 지식 카드 친화.
- **정보형 H2 (3~4개)** — 각 H2 첫 문장 = 핵심 정의 + list/table 적극 권장 (LLM chunking).
- **마지막 H2 = "## 자주 묻는 질문"** = FAQ block 강제 (Q&A 3~4쌍 · `### Q. <질문>` 형식). Google FAQ rich snippet + 네이버 Q&A 카드 + GEO direct answer 동시 친화.
- 키워드 = primary 4회 이상 (title + intro 첫 문장 + 첫 정보형 H2 + FAQ) · 본문 안 키워드 밀도 1~2%.

### Quota status
- 어드민 대시보드 `/admin/<slug>` 안 LlmUsageCard 안 오늘 사용량/quota 게이지 + 80% 이상 시 warning badge.
- prompt_template 분포 안 "칼럼 Draft" label 노출.

### 추정 비용 (Haiku 4.5)
- input ~500t + output ~1500t + cache miss ~4000t = 약 $0.005/draft (cycle 4 추정 · 운영 1주 후 실측).
- 일 20 draft × 30일 = $3/month/instance.

---

## 4. 의료법 책임

### Layer 1 — LLM = "draft"
- modal 안 banner 안 "AI 가 생성한 초안입니다. 검수 후 저장하세요" 표시.
- form 안 status='draft' INSERT — direct published 절대 X.

### Layer 2 — 운영자 final 승인
- published 전이 = WorkflowActionButtons 안 별 action. sentinel ComplianceRecord 필수.
- 본문 안 검증되지 않은 수치 hardcode 금지 — `clinic.metadata.keyStats` 안 source 명시 정합.

### Layer 3 — 의료광고법 자동 검수 X (CAI-DEFER-03)
- compliance-assistant Phase Beta 안 별 cycle. 본 plan 안 자동 검수 미합류.
- 운영자가 의료광고법 제56조 / 시행령 제23·24조 정합 확인 책임.

### Layer 4 — citation 운영자 수동 link
- placeholder mismatch 시 warning badge — 차단 X. 운영자 판단.
- fuzzy match (정확 → 공백 제거 → levenshtein ≤ 5 → substring) 알고리즘 안 false negative 가능 — manual link fallback.

### Layer 5 — 환각 검증
- AI 출력 안 publication.id hallucinate 차단 = server-side instance whitelist filter.
- 본문 안 검증되지 않은 의학적 주장 = 운영자 final 검증 책임.

---

## 5. 장애 대응

| 증상 | 원인 | 대응 |
|---|---|---|
| panel button 안 클릭 X (disabled) | `ANTHROPIC_API_KEY` env 미설정 | `.env` 안 ANTHROPIC_API_KEY 설정 + dev 서버 재시작 |
| "AI 출력 형식 위반 — 사유: ..." banner | LLM 출력 안 title/summary/body length 또는 H2 count 미달 | retry button 클릭 (quota 차감 유지 · cost 발생) · 또는 직접 작성 |
| "AI 응답이 유효한 JSON 형식이 아닙니다" | LLM 출력 안 code fence wrap 또는 JSON parse fail | retry · 반복 시 prompt template 안 "JSON only" 강조 검토 |
| "오늘 quota 초과" | 일 cap 5 quota 미달 | 다음 날 또는 cap env override (운영자 단독 결정 X · 슈퍼 관리자) |
| "추천 publication 없음" empty state | instance 안 publication.title/summary 안 keyword 매칭 X | publication 페이지 안 직접 등록 후 link · 또는 citation 없이 진행 |
| LLM 추천 publication.id 안 form 안 미반영 | server-side whitelist filter (hallucinate 차단) | 정상 동작 — modal 안 추천 list 안 실제 publication 만 노출 |
| save 시 "slug 이 이미 존재" | INSERT 안 unique 제약 위반 | slug 수정 후 다시 저장 · AI 자동 채움 값 유지 (재 LLM call 회피) · quota 차감 유지 |
| brief mini button 안 "primary keyword 입력 후 brief 자동 생성 가능" disabled | primary keyword 미입력 | primary keyword 먼저 입력 후 mini button enable |
| brief mini button 안 "AI 응답이 유효한 JSON 형식이 아닙니다" | LLM 출력 형식 위반 | mini button 재클릭 (1 quota 차감 유지) · 또는 직접 brief 작성 |

---

## 6. CAID-DEFER 15건 안내 (v2+ scope)

CAID-DEFER-16 (brief 2-stage flow) = v1 안 mini button 합류 완료.

본 plan v1 안 미합류 — 운영자 요청 시 별 cycle 진입 가능.

| # | 항목 | 사유 |
|---|---|---|
| 1 | 기존 article 본문 overwrite | 의료광고법 책임 + 운영자 검수 cost |
| 2 | treatment_page · condition · faq 본문 draft | v1 = article 만 |
| 3 | 외부 source URL → 본문 변환 | asset-ingestion Feature |
| 4 | streaming response (SSE) | v1 = full response 후 표시 |
| 5 | tool use (function calling 안 publication 자동 link) | v1 = single-turn |
| 6 | 다국어 (영어 칼럼) | 사용자 SoT 안 미요청 |
| 7 | brief 안 PII 자동 mask | v1 = warning + 운영자 책임 |
| 8 | 본문 안 JSON-LD MedicalArticle.about 자동 추출 | v2+ tool use |
| 9 | 이전 article paragraph style transfer | v2+ style learning |
| 10 | A/B variant 생성 (제목 2개 select) | v1 = 1 안 출력 |
| 11 | keyword-only mode (brief 없이) | v1 = brief 50자 minimum |
| 12 | LLM 결과 reject 시 자동 재 generation retry | v1 = 운영자 retry 결정 |
| 13 | longer brief mode (200자 초과) | v1 = 200자 max (책임 분산) |
| 14 | weight=5 실 token 측정 후 재조정 | v1 = 추정치 고정 · v2+ 운영 1주 후 |
| 15 | ConsumeQuota advisory lock race 회피 | v1 = SELECT COUNT + INSERT 비-atomic · race risk 미미 |
