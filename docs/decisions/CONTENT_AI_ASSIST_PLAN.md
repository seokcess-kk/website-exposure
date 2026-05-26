# CONTENT_AI_ASSIST_PLAN (v1.0·acceptance·2026-05-26)

> **상태**: **v1.0 (acceptance)** — cycle 1 (14건) + cycle 2 (7건) + cycle 3 (7건) + cycle 4 (3건) + cycle 5 (0건 · 수렴) self-critique 전건 흡수. **누계 31건 · 5 cycle 수렴**. acceptance 근거: (a) 3 진입점 통합 v1 (SEO 메타 · 키워드 매핑 · 검수 코멘트) · (b) Anthropic Claude Haiku 4.5 + C0043 `llm_call_log` + 일 quota 100 · (c) PII 미접근 entity 만 (메타·키워드·검수 사유) · (d) silent fallback (invalid JSON · API error · cap-exceeded) · (e) 운영자 final 승인 강제 · (f) CAI-DEFER 13건 · CAI-CASCADE 6건.

> **cycle 4 흡수 (3건)** + **cycle 5 (0건 수렴)**:
> (a) **#29** prompt template = 일반 의료기관 (instance name `${clinicName}` dynamic interpolation) ·
> (b) **#30** modal placement = entity edit form footer 위 (sticky 안 보이게) ·
> (c) **#31** AI JSON zod parse fail → modal 안 "AI 응답 형식 오류 — 다시 시도하시거나 직접 입력하세요" 안내 + llm_call_log 안 status='error' 갱신 ·
> **cycle 5 수렴** — plan 변경 0건. acceptance criteria #1 충족.

> **cycle 3 흡수 (7건 · 수렴기)**:
> (a) **#22** `ANTHROPIC_API_KEY` 미설정 시 — server 안 throw + UI 안 "AI 서비스 미설정 — 관리자 문의" 안내 분리 ·
> (b) **#23** prompt 안 한국어 응답 강제 — "한국어 응답만. 영어/혼합 금지" system prompt 안 명시 ·
> (c) **#24** prompt template `${변수}` interpolation — `prompt-templates.ts` 안 함수 형식 (예 `buildSeoMetaPrompt({title, description, category, targetKeyword})`) ·
> (d) **#25** review-queue `resolutionType` 안 'reject' 정확 (또는 'request-changes' · v1 = reject 만 보조 · request-changes 보조 v2+) ·
> (e) **#26** LlmUsageCard 표시 = 오늘 calls + 이번 달 calls + 이번 달 cost (USD) + 3 template 분포 ·
> (f) **#27** Anthropic SDK timeout 30s — 본 plan call 안 abortSignal 안 설정 (사용자 대기 UX 정합) ·
> (g) **#28** C0043 manifest 외 — `run-sql` 안 사용자 직접 적용 (NSA C0038 패턴 답습).

> **cycle 2 흡수 (7건)**:
> (a) **#15** operator+ 4 role 모두 가시 (별 RBAC 미적용) ·
> (b) **#16** `LlmUsageCard` 대시보드 카드 신규 (VisibilityOverviewSection 8번째 grid · 오늘/이번 달 calls + cost + prompt_template 분포) ·
> (c) **#17** system prompt 안 의료광고법 주의 한국어 명시 — "제56조 제2항 · 금지 표현: 최고/최초/유일/완치 등 · 비교 광고 금지 · 부작용 미언급 금지" ·
> (d) **#18** vitest Anthropic SDK mock 패턴 — `vi.mock('@anthropic-ai/sdk')` + 정형 messages.create response ·
> (e) **#19** `triggered_by` NOT NULL (admin route 안만 호출 보장) ·
> (f) **#20** runbook `docs/runbooks/CONTENT_AI_ASSIST_OPS.md` outline 4 part (API key 발급 · 비용 모니터링 · prompt template 의도 · 운영자 결정 책임) ·
> (g) **#21** prompt 안 "JSON 만 반환 · 다른 텍스트 절대 X" 강조 (Haiku 4.5 의 JSON adherence 보강).

> **cycle 1 흡수 (14건)**:
> (a) **#1** model name = `claude-haiku-4-5-20251001` (CLAUDE.md 정합) ·
> (b) **#2** `@anthropic-ai/sdk` 신규 dependency apps/web/package.json 추가 ·
> (c) **#3·#4·#5** ArticleForm/TreatmentPageForm/FaqForm SEO 메타 필드 구조 — code cycle 안 grep 후 정확화 ·
> (d) **#6** review_queue_entry reject 사유 = `metadata` jsonb 자유 필드 (별 column 부재) — 본 plan v1 안 `metadata.notes` 안 LLM 코멘트 저장 ·
> (e) **#7** audit_event AuditAction 확장 — `packages/auth/src/audit.ts` 안 emit 패턴 정합 ·
> (f) **#8** ANTHROPIC_API_KEY env fail-fast — `anthropic-client.ts` module-level + missing 시 throw ·
> (g) **#9** quota default 100 calls/day 적정 ·
> (h) **#10** prompt template = TS const file (`prompt-templates.ts`) ·
> (i) **#11** claude-api skill code cycle 안 invoke 권장 (prompt caching + SDK 정합) ·
> (j) **#12** Haiku 4.5 의 prompt cache_control 의무 — input_tokens ≥ 1024 (작은 prompt 시 cache 미적용 OK · cost 영향 적음) ·
> (k) **#13** keyword_content_link primary/secondary — v1 = primary only (secondary 추천은 v2+ CAI-DEFER-13 신설) ·
> (l) **#14** LLM JSON 출력 zod safeParse + fallback (환각 대응 · invalid JSON 시 운영자 안내 modal). LLM 콘텐츠 보조 — 운영자 매일 작업 안 짧은 prompt 기반 자동 제안 3 진입점. v1 acceptance scope = **3 진입점 모두** (#1 SEO 메타 · #6 키워드 → 콘텐츠 매핑 · #8 검수자 코멘트). Anthropic Claude API (Haiku 4.5 default) + C0043 `llm_call_log` + 운영자 final 승인 강제.

## SoT

- 사용자 진단 (2026-05-26) — "(c) AI 보조" plan. 사용자 7항목 + (b) 완주 후 다음 우선순위.
- `docs/features/compliance-assistant.md` Phase Alpha v1.0 — CA-DEFER-22 (KSS Phase Beta · LLM 합류) marker. 본 plan 의 직접 cascade.
- `docs/decisions/MEANINGFUL_TRAFFIC_LOOP_PLAN.md` MTL-DEFER-05 (광고 시안 + Seed Kit 문구 의료광고법 검수 합류) marker.
- Anthropic Claude API 의 prompt caching (5분 TTL) · tool use · Haiku 4.5 ($0.80/MTok input · $4/MTok output) — 비용 효율 정합.
- `claude-api` skill 보유 (Anthropic SDK 안 prompt caching · tool use · model migration 가이드).
- 기존 packages 시그니처:
  - `packages/core-content/src/schema.ts` 안 keyword_target · keyword_content_link · review_queue_entry · article · treatment_page · faq · publication · media_appearance
  - `apps/web/src/components/forms/{ArticleForm,TreatmentPageForm,FaqForm,...}.tsx` — entity edit form (SEO 메타 입력 필드)
  - `apps/web/src/app/(admin)/admin/[instanceSlug]/keywords/page.tsx` — 키워드 list + edit
  - `apps/web/src/app/(admin)/admin/[instanceSlug]/review-queue/page.tsx` — 검수 큐
  - `audit_event` table — 본 plan 의 audit 정합 (단 token usage 자체는 별 table)

> **표기 규칙**: 사용자 표시 = "AI 제안", 내부 키 = "content ai assist" · "llm assist".

## 1. 목적과 범위

### 1.1 목적

- 운영자 매일 작업 안 짧은 prompt 자동 제안 3개 진입점 (SEO 메타·키워드 매핑·검수 코멘트)
- 모든 결과 = 운영자 final 승인 강제 (suggestions modal · accept/reject) — LLM 환각 + 의료광고법 책임 회피
- v1 = 짧은 prompt · 의료광고법 책임 적음 · PII 미접근 entity 만 (메타·키워드·검수 사유)
- Anthropic Claude Haiku 4.5 default — 비용 효율 + 한국어 품질 양호

### 1.2 범위 (v1 — 포함)

| § | 항목 | 비고 |
|---|---|---|
| 3 | C0043 `llm_call_log` table | instance_id RLS + entity_type/id + prompt_template + model + input/output tokens + latency + cost_estimate |
| 4 | `lib/ai/` Anthropic client + prompt templates | `callClaude()` + 3 wrapper (`suggestSeoMeta`·`suggestKeywordMatches`·`suggestReviewComment`) |
| 5 | 3 진입점 server actions + UI mount | entity edit form 안 "AI 제안" 버튼 + suggestions modal + accept/reject |
| 6 | API key env + rate limit + cost cap | `ANTHROPIC_API_KEY` + instance 별 일 quota (100 calls/day default) |
| 7 | 검증 시나리오 CAI-V01~V12 | 3 진입점 동작 + audit + rate limit + 운영자 final 승인 + PII 미전송 |
| 8 | 작업 manifest 8 task | C0043 + client + 3 wrapper + 3 server action + 3 UI mount + vitest + commit |
| 9 | CAI-CASCADE 6건 | compliance-assistant CA-DEFER-22 marker · NavMenu · audit_event · dashboard token usage 카드 · CLAUDE milestone · 사용자 (c) plan 완주 |

### 1.3 비범위 (defer · CAI-DEFER)

| 항목 | Defer | marker |
|---|---|---|
| #2 readiness 개선 제안 (improvement-queue 안 fix draft) | v2 — token cost 증가 + 콘텐츠 변경 안 의료광고법 책임 | CAI-DEFER-01 |
| #3 콘텐츠 초안 생성 (Article·Treatment body generate) | v3 — 큰 prompt + 의료광고법 책임 + 환각 risk | CAI-DEFER-02 |
| #4 의료광고법 검수 보조 (compliance-assistant Phase Beta · CA-DEFER-22) | compliance-assistant 본 cycle 안 합류 — 본 plan 미흡수 | CAI-DEFER-03 |
| #5 외부 자료 → 콘텐츠 변환 (asset-ingestion · CrossRef·PubMed·YouTube) | asset-ingestion Feature 본 구현 후 | CAI-DEFER-04 |
| #7 JSON-LD 자동 풍부화 (E-A-T citation 자동 추출) | v4+ — entity 별 다중 prompt | CAI-DEFER-05 |
| PII mask (환자 정보 LLM 안 전송 시 자동 mask) | v1 = PII 미접근 entity (메타·키워드·검수) 만 — 콘텐츠 초안 v3 안 합류 시 필수 | CAI-DEFER-06 |
| prompt template DB 기반 versioning + 운영자 편집 | v1 = hardcode 3 template · v2+ admin UI 안 편집 | CAI-DEFER-07 |
| tool use (multi-turn · function calling) | v1 = single-turn text completion 만 · v2+ tool use 안 entity link 자동 | CAI-DEFER-08 |
| streaming response (SSE) | v1 = full response 후 표시 · v2+ streaming UI | CAI-DEFER-09 |
| 다중 LLM provider abstraction (OpenAI · Gemini fallback) | v1 = Anthropic only · v2+ provider 분기 | CAI-DEFER-10 |
| 사용자 표시 token usage 한도 알림 | v1 = silent (cost cap 차단만) · v2+ "오늘 quota 80% 사용" 카드 | CAI-DEFER-11 |
| 운영자 prompt 자유 입력 (custom prompt) | v1 = hardcode 3 template · v2+ free-form 안 의료광고법 risk 큼 | CAI-DEFER-12 |
| #6 안 keyword_content_link secondary 추천 | v1 = primary only · v2+ 다중 후보 (cycle 1 #13) | CAI-DEFER-13 |

## 2. 결정 사항 reflection

| # | 결정 | 근거 |
|---|---|---|
| 1 | LLM provider = Anthropic Claude API | CLAUDE.md SDK 정합 + claude-api skill 보유 + prompt caching 5분 TTL + Haiku 한국어 양호 |
| 2 | default model = Haiku 4.5 | $0.80/MTok input + $4/MTok output · 짧은 prompt 정합 · 1000 회 호출 ≈ $2 추정 |
| 3 | audit = C0043 `llm_call_log` 신규 | token usage · cost 추적 + 향후 대시보드 카드 |
| 4 | v1 scope = 3 진입점 통합 1 cycle | 공통 `callClaude` helper · prompt template 만 별 wrapper |
| 5 | 검증 책임 | 모든 결과 = 운영자 final 승인. LLM = "draft" 만 |
| 6 | PII 처리 | v1 = 환자 정보 미접근 entity 만 (메타·키워드·검수 사유). 콘텐츠 body LLM 안 전송 X (v3 합류 시 mask) |
| 7 | 비용 통제 | instance 별 일 quota 100 calls default · 초과 시 차단 + log only |
| 8 | prompt cache | system prompt cache 5분 TTL — 1 instance 안 다회 호출 시 input token 90% 절약 |

## 3. C0043 `llm_call_log` 데이터 모델

### 3.1 schema

```sql
CREATE TABLE IF NOT EXISTS llm_call_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id     UUID NOT NULL REFERENCES instance(id) ON DELETE CASCADE,
  prompt_template TEXT NOT NULL,                  -- 'seo-meta-suggest' · 'keyword-match-suggest' · 'review-comment-suggest'
  model           TEXT NOT NULL,                  -- 'claude-haiku-4-5-20251001' 등
  entity_type     TEXT,                            -- 'Article'·'TreatmentPage'·'FAQ'·'Publication'·'MediaAppearance'·'Keyword'·'ReviewQueueEntry'
  entity_id       UUID,
  input_tokens    INTEGER NOT NULL,
  output_tokens   INTEGER NOT NULL,
  cache_read_tokens INTEGER NOT NULL DEFAULT 0,   -- prompt cache hit 안 read
  cache_write_tokens INTEGER NOT NULL DEFAULT 0,
  latency_ms      INTEGER NOT NULL,
  cost_usd        NUMERIC(10,6) NOT NULL,         -- input + output token rate 안 계산
  status          TEXT NOT NULL,                  -- 'success'·'error'·'rate-limited'·'cap-exceeded'
  error_message   TEXT,
  accepted        BOOLEAN,                         -- 운영자 final 승인 여부 (null = 미응답)
  triggered_by    UUID NOT NULL,                   -- admin_user.id · cycle 2 #19
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT llm_call_log_template_enum CHECK (prompt_template IN (
    'seo-meta-suggest','keyword-match-suggest','review-comment-suggest'
  )),
  CONSTRAINT llm_call_log_status_enum CHECK (status IN (
    'success','error','rate-limited','cap-exceeded'
  ))
);

CREATE INDEX llm_call_log_instance_template_ts_idx
  ON llm_call_log (instance_id, prompt_template, created_at DESC);
CREATE INDEX llm_call_log_instance_status_ts_idx
  ON llm_call_log (instance_id, status, created_at DESC);

ALTER TABLE llm_call_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE llm_call_log FORCE ROW LEVEL SECURITY;
CREATE POLICY llm_call_log_tenant_policy ON llm_call_log
  FOR ALL TO app_tenant_user
  USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)
  WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE ON llm_call_log TO app_tenant_user;
-- UPDATE = accepted 필드 운영자 응답 시 (suggestions modal accept/reject)
```

### 3.2 cost 추정 (Haiku 4.5)

- input $0.80/MTok · output $4/MTok
- cache read $0.08/MTok (90% 절약 · prompt cache hit 시)
- cache write $1/MTok (5분 TTL · 1회 작성)
- 예시 (SEO 메타 1 call) — system 500t cached + input 200t + output 100t → ≈ $0.0005 / call
- 1 instance · 일 100 calls · 30일 = $1.5/month (Haiku 정합)

### 3.3 instance 별 일 quota

- env `LLM_DAILY_CAP_PER_INSTANCE` default 100 (calls/day)
- 초과 시 — 본 plan call 시점 `llm_call_log` 안 status='cap-exceeded' INSERT (log only · API 미호출 · 비용 0)
- 운영자 UI 안 "오늘 quota 초과 — 내일 다시 시도" 안내

## 4. `lib/ai/` Anthropic client + prompt templates

### 4.1 구조

```
apps/web/src/lib/ai/
  ├── anthropic-client.ts       — Anthropic SDK 초기화 + callClaude() 단일 entry
  ├── prompt-templates.ts       — 3 hardcode template (system + user prompt)
  ├── llm-audit.ts              — llm_call_log INSERT + quota check
  ├── suggest-seo-meta.ts       — #1 wrapper (Article/Treatment/FAQ)
  ├── suggest-keyword-matches.ts — #6 wrapper
  └── suggest-review-comment.ts  — #8 wrapper
```

### 4.2 `callClaude()` 시그니처

```ts
// lib/ai/anthropic-client.ts
import Anthropic from "@anthropic-ai/sdk";

type CallClaudeInput = {
  instanceId: string;
  triggeredBy: string;            // admin_user.id
  promptTemplate: "seo-meta-suggest" | "keyword-match-suggest" | "review-comment-suggest";
  systemPrompt: string;            // cache_control: ephemeral (5 분 TTL)
  userPrompt: string;
  entityType?: string;
  entityId?: string;
  maxTokens?: number;              // default 512
  model?: string;                  // default Haiku 4.5
};

type CallClaudeResult =
  | { ok: true; text: string; logId: string }
  | { ok: false; reason: "cap-exceeded" | "rate-limited" | "api-error"; message: string };

export async function callClaude(input: CallClaudeInput): Promise<CallClaudeResult>;
```

### 4.3 흐름

1. 일 quota 검사 (`llm_call_log` 안 `instance_id + created_at >= now() - 1day` count) — 초과 시 cap-exceeded log + return
2. Anthropic SDK 호출 — system prompt 안 cache_control: ephemeral 적용
3. response → log INSERT (input/output tokens · cache read/write · latency · cost · status='success')
4. return {ok: true, text, logId}
5. error 시 — log INSERT (status='error' · error_message) · return

### 4.4 prompt cache (5분 TTL)

system prompt 안 `cache_control: { type: "ephemeral" }` 마킹 — 1 instance 안 5분 안 다회 호출 시 cache read (90% 절약).

## 5. 3 진입점 spec

### 5.1 #1 SEO 메타 자동 제안

- 위치: ArticleForm · TreatmentPageForm · FaqForm 안 SEO 메타 섹션 (title · description · slug input) 옆 "AI 제안 ✨" 버튼
- prompt input: entity 의 title/description draft + category + targetKeyword (있을 때) + 의료광고법 주의 (system prompt 안 명시)
- prompt output: JSON `{title, metaDescription, slug}` — 운영자 accept/reject modal
- accept 시 — form field 안 자동 채움 + form state 안 dirty 표시

### 5.2 #6 키워드 → 콘텐츠 매핑 제안

- 위치: `/admin/<slug>/keywords` 안 unlinked (primary 콘텐츠 없는) keyword row 옆 "AI 추천 ✨" 버튼
- prompt input: keyword label + instance 안 published Article/Treatment/FAQ list (title + slug + summary) + readiness score
- prompt output: JSON `[{entityType, entityId, slug, title, confidence: "high"|"medium"|"low", reason: string}]` — 최대 3 추천
- accept 시 — keyword_content_link 안 자동 link (primary 또는 secondary 선택)

### 5.3 #8 검수자 코멘트 보조 (cycle 1 #6)

- 위치: review-queue 안 entry detail 페이지 안 reject 시 입력하는 textarea 옆 "AI 보조 ✨" 버튼
- review_queue_entry 안 reject 사유 column 부재 → `metadata.notes` jsonb 안 저장 (운영자 form 안 입력 시점 동일)
- prompt input: 검수 entity 의 published content + 의료광고법 RiskRule fail list (compliance-assistant 안 검수 결과) + reviewer 의 short note (5단어 이내)
- prompt output: text — "다음 안 변경 권장: ..." 형식의 검수자 코멘트 초안
- accept 시 — textarea 안 자동 채움 (운영자 편집 가능) · 운영자 submit 시 `metadata.notes` 안 저장

## 6. UI 컴포넌트

### 6.1 `<AiSuggestionButton>` 공통

```tsx
// apps/web/src/components/ai/AiSuggestionButton.tsx
"use client";

export function AiSuggestionButton({
  onSuggest,
  label = "AI 제안 ✨",
  disabled,
}: {
  onSuggest: () => Promise<void>;
  label?: string;
  disabled?: boolean;
}) {
  const [pending, setPending] = useState(false);
  // ... disabled · pending state · click handler
}
```

### 6.2 `<AiSuggestionModal>` 공통

- header: "AI 제안 — {진입점 이름}"
- body: 제안 내용 (JSON 또는 text · 가독성 좋게 format)
- footer: [거절] / [수락]
- accept 시 — form field 채움 + llm_call_log.accepted = true UPDATE
- reject 시 — llm_call_log.accepted = false UPDATE

## 7. 검증 시나리오 (v1 — 12건)

| # | 시나리오 | 기대 결과 |
|---|---|---|
| CAI-V01 | ArticleForm 안 "AI 제안" 클릭 (정상) | suggestions modal 안 title·metaDescription·slug 표시 + llm_call_log 안 success row + accept 시 form 안 자동 채움 |
| CAI-V02 | TreatmentPageForm 안 동일 | 동일 |
| CAI-V03 | FaqForm 안 동일 | 동일 |
| CAI-V04 | keywords 안 unlinked keyword "AI 추천" | modal 안 최대 3 추천 + confidence + reason · accept 시 keyword_content_link INSERT |
| CAI-V05 | review-queue detail 안 "AI 보조" | modal 안 검수 코멘트 초안 + accept 시 reject textarea 자동 채움 |
| CAI-V06 | 일 quota 초과 (101번째 call) | llm_call_log 안 cap-exceeded INSERT · modal 안 "오늘 quota 초과" 안내 · API 미호출 |
| CAI-V07 | API key env 미설정 시 fail-fast | callClaude 안 throw + UI 안 "AI 서비스 미설정" 안내 |
| CAI-V08 | accept 클릭 후 llm_call_log.accepted = true 업데이트 | DB row 확인 |
| CAI-V09 | reject 클릭 후 accepted = false 업데이트 | DB row 확인 |
| CAI-V10 | RLS 격리 — 다른 instance log 안 SELECT 시도 | tenant_policy 안 차단 |
| CAI-V11 | prompt cache hit — 5분 안 같은 system prompt 재호출 | llm_call_log.cache_read_tokens > 0 · cost 90% 절약 |
| CAI-V12 | PII 미전송 — entity 의 환자 정보 (consultation_request 등) LLM 안 미전송 | code review · suggestSeoMeta/etc 안 환자 데이터 access X |

vitest fixture:
- `apps/web/src/lib/ai/__tests__/llm-audit.test.ts` — quota check · cost 계산
- `apps/web/src/lib/ai/__tests__/prompt-templates.test.ts` — template snapshot · JSON 출력 parse
- mock Anthropic SDK (실 API 호출 X)

## 8. 작업 manifest (v1 — 8 task)

| # | 작업 | 산출물 | 의존 |
|---|---|---|---|
| 1 | C0043 migration — `llm_call_log` table + RLS + 2 index + `schema.ts` 안 llmCallLog | migration + schema | — |
| 2 | `lib/ai/anthropic-client.ts` (callClaude + prompt cache) + `prompt-templates.ts` (3 hardcode) + `llm-audit.ts` (quota check + cost 계산 + INSERT) | 3 file | 1 |
| 3 | 3 wrapper — `suggest-seo-meta.ts` + `suggest-keyword-matches.ts` + `suggest-review-comment.ts` (server actions) | 3 file | 2 |
| 4 | UI primitive — `AiSuggestionButton.tsx` + `AiSuggestionModal.tsx` | 2 file | — |
| 5 | mount #1 — ArticleForm + TreatmentPageForm + FaqForm 안 "AI 제안" 버튼 + accept handler | 3 file 변경 | 3·4 |
| 6 | mount #6 — `/admin/<slug>/keywords` page 안 unlinked row 옆 "AI 추천" + accept = keyword_content_link INSERT | page + action | 3·4 |
| 7 | mount #8 — review-queue detail 안 "AI 보조" + accept = reject textarea 채움 | page + action | 3·4 |
| 8 | vitest (llm-audit · prompt-templates) + `ANTHROPIC_API_KEY` env 안내 + `docs/runbooks/CONTENT_AI_ASSIST_OPS.md` 신규 + typecheck + 시각 검수 CAI-V01~V12 + commit + push | runbook + commit | 1·2·3·4·5·6·7 |

**추정**: 3~5일 (DB + LLM 통합 + UI + 3 진입점).

## 9. CAI-CASCADE markers

| marker | 대상 | patch 디테일 |
|---|---|---|
| CAI-CASCADE-01 | `docs/features/compliance-assistant.md` | CA-DEFER-22 (KSS Phase Beta) marker · 본 plan #8 (검수 코멘트 보조) 는 compliance-assistant Phase Beta 의 KSS 합류와 별 cycle · false positive 자동 검증은 Phase Beta 안 (CAI-DEFER-03) |
| CAI-CASCADE-02 | `apps/web/src/components/admin/NavMenu.tsx` | (변경 없음) — 본 plan v1 안 별도 페이지 X. 모두 기존 entity form/keywords/review-queue 안 mount |
| CAI-CASCADE-03 | `audit_event` table | LLM call 자체는 `llm_call_log` 안. accept/reject 만 audit_event 안 (AuditAction 'llm-suggestion-accepted'/'llm-suggestion-rejected' 신규) |
| CAI-CASCADE-04 | `apps/web/src/components/admin/visibility/VisibilityOverviewSection.tsx` | 대시보드 안 token usage 카드 (`LlmUsageCard` 신규 · 8번째 grid · cycle 2 #16) — 오늘/이번 달 calls · cost · prompt_template 별 분포 |
| CAI-CASCADE-05 | `CLAUDE.md` 안 "현재 milestone" 행 | CONTENT_AI_ASSIST v1.0 acceptance 시 추가. 사용자 (c) plan 완주 + 사용자 7항목 + (a)(b)(c) 모두 도달 |
| CAI-CASCADE-06 | `docs/decisions/MEANINGFUL_TRAFFIC_LOOP_PLAN.md` | MTL-DEFER-05 (광고 시안 의료광고법 검수) 본 plan 미흡수 — 별 cycle (compliance-assistant Phase Beta 안) marker |

## 10. v1.0 acceptance criteria

### 10.1 plan + code 같은 cycle 합류

- CONTENT_IMPROVEMENT_QUEUE · CONTENT_CALENDAR · NAVER_PLACE 패턴 답습

### 10.2 acceptance 충족 조건

1. self-critique 수렴 cycle 1회 도달
2. § 8 manifest 8 task 완료
3. 검증 시나리오 CAI-V01~V12 사용자 환경 안 시각 검수 — `ANTHROPIC_API_KEY` env 설정 후 dev 안 3 진입점 모두 시연
4. typecheck PASS · vitest 전체 PASS (mock SDK 안 신규 fixture)
5. dev 안 1+ LLM call success — llm_call_log row 확인

### 10.3 v1.0 milestone marker

acceptance 시 — `memory/milestone_content_ai_assist_v1.md` 작성 + `CLAUDE.md` 안 "현재 milestone" 한 줄 + 변경 이력 추가 (CAI-CASCADE-05).

## 11. 변경 이력

- **2026-05-26**: v0.1 draft 작성 — 사용자 (c) plan. scope 결정 (3 진입점 모두 v1 · Anthropic Claude Haiku 4.5 · C0043 llm_call_log + DB 기반 audit). 12 CAI-DEFER (improvement-queue fix draft · 콘텐츠 초안 · 의료광고법 자동 검수 · 외부 자료 변환 · JSON-LD 자동 풍부화 · PII mask · prompt versioning · tool use · streaming · multi-provider · quota UI · custom prompt).
- **2026-05-26**: **v1.0 acceptance** — cycle 4 (3건) + cycle 5 (0건 수렴) 흡수:
  - **#29** prompt instance name interpolation · **#30** modal placement footer 위 · **#31** AI JSON parse fail 안내 · **cycle 5 수렴** acceptance.

- **2026-05-26**: v0.4 draft — cycle 3 self-critique (7건) 전건 흡수 (수렴기):
  - **#22** API key 미설정 UI/server 분리 · **#23** prompt 한국어 강제 · **#24** template ${변수} interpolation · **#25** resolutionType 'reject' · **#26** LlmUsageCard spec · **#27** SDK timeout 30s · **#28** C0043 manifest 외

- **2026-05-26**: v0.3 draft — cycle 2 self-critique (7건) 전건 흡수:
  - **#15** operator+ 가시 · **#16** LlmUsageCard 신규 (8번째 grid) · **#17** system prompt 안 의료광고법 한국어 명시 · **#18** vitest Anthropic SDK mock · **#19** triggered_by NOT NULL · **#20** runbook outline 4 part · **#21** JSON 출력 prompt 강조

- **2026-05-26**: v0.2 draft — cycle 1 self-critique (14건) 전건 흡수:
  - **#1·#2** model name + @anthropic-ai/sdk dep · **#3·#4·#5** entity form 구조 code cycle 검증 · **#6** reject 사유 = metadata.notes (별 column 부재) · **#7** AuditAction 확장 packages/auth · **#8** ANTHROPIC_API_KEY fail-fast · **#9·#10** quota + prompt template hardcode · **#11** claude-api skill invoke · **#12** Haiku cache_control 의무 1024 토큰 · **#13** keyword secondary v2+ (CAI-DEFER-13) · **#14** LLM JSON zod safeParse fallback
