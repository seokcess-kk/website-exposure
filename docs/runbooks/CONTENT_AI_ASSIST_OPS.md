# CONTENT_AI_ASSIST 운영 가이드

> 본 문서는 CONTENT_AI_ASSIST_PLAN v1.0 안 운영자·관리자가 LLM 보조 기능을 안전하게 운영하기 위한 가이드입니다.
> 모든 LLM 결과는 **운영자 final 승인 강제** — AI = "draft", 책임은 운영자에게 있습니다.

## 1. API key 발급 (Anthropic Claude)

### 1.1 Anthropic Console 안 key 발급

1. https://console.anthropic.com/ 에 운영 이메일 (예: ops@glitzy.kr) 안 가입/로그인
2. **Settings → API keys → Create Key** 클릭
3. key name = `glitzy-prod` (production) 또는 `glitzy-dev` (개발)
4. 발급된 `sk-ant-...` 토큰을 안전한 비밀 저장소에 보관
5. Anthropic Console 안 **Billing** 진입 후 결제 정보 등록 + 월 **$10** 한도 권장 (안전한 시작점)

### 1.2 환경 변수 설정

| env | 위치 | 값 |
|---|---|---|
| `ANTHROPIC_API_KEY` | Vercel Production · Preview · Development | `sk-ant-...` |
| `LLM_DAILY_CAP_PER_INSTANCE` | (선택) Vercel + .env | default 100. instance 별 일 호출 cap. |

**중요**: `ANTHROPIC_API_KEY` 미설정 시 — AI 제안 버튼 클릭 시 modal 안 "AI 서비스 미설정 — 관리자에게 문의하세요." 표시. API 호출 없이 즉시 안내.

## 2. 비용 모니터링

### 2.1 cost 추정 (Claude Haiku 4.5 default)

- 본 plan v1 default model = `claude-haiku-4-5-20251001`
- input $1/MTok · output $5/MTok · cache_read $0.1/MTok · cache_write (5min ephemeral) $1.25/MTok
- 1 call (SEO 메타) ≈ system 500t + input 200t + output 200t → **약 $0.0015 / call**
- 1 instance · 일 100 calls · 30일 = **$4.5/month** (Haiku 정합 · 한국어 양호)
- prompt cache 5분 TTL — 같은 system prompt 5분 안 재호출 시 cache_read 적용 → input cost 90% 절약

### 2.2 일 quota 정책

- 본 plan v1 = `LLM_DAILY_CAP_PER_INSTANCE` (default 100) — instance 별 일 호출 cap
- cap 초과 시 — `llm_call_log` 안 status='cap-exceeded' 한 row INSERT (API 미호출 · cost 0) + modal 안 "오늘 quota 초과 — 내일 다시 시도하세요." 안내
- 정확한 산식: 지난 24h 안 `success` · `error` · `rate-limited` status row 의 합 (cap-exceeded row 자체는 제외 — 재시도 차단 의도)

### 2.3 비용 추적 SQL

```sql
-- 오늘 호출 + cost (instance 별)
SELECT instance_id,
       count(*) AS total_calls,
       count(*) FILTER (WHERE status = 'success') AS success_calls,
       sum(cost_usd) AS total_cost_usd
  FROM llm_call_log
 WHERE created_at >= now() - INTERVAL '1 day'
 GROUP BY instance_id
 ORDER BY total_cost_usd DESC;

-- 이번 달 누적
SELECT prompt_template,
       count(*) AS calls,
       sum(cost_usd) AS cost,
       avg(latency_ms) AS avg_latency_ms,
       sum(cache_read_tokens) AS cache_hits
  FROM llm_call_log
 WHERE created_at >= date_trunc('month', now())
 GROUP BY prompt_template
 ORDER BY cost DESC;
```

## 3. 3 진입점 운영 안내

본 plan v1 = **3 진입점**. 운영자가 매일 작업하는 entity edit form / keyword list / review-queue 안 mount.

### 3.1 SEO 메타 자동 제안 (ArticleForm · TreatmentPageForm · FaqForm)

- 위치: entity edit form 안 SEO 메타 섹션 옆 "AI 제안 ✨"
- 입력: 현재 title + summary (있으면) + category + targetKeyword
- 출력: `{title, metaDescription, slug}` — 운영자 수락 시 form field 자동 채움
- **권장**: 현재 title 이 한국어로 작성된 상태에서 클릭 → AI 가 SEO 정합 title + 영문 slug 제안
- **주의**: 의료광고법 책임은 운영자. AI 가 금지 표현을 생성한 경우 즉시 수정 + 거절

### 3.2 키워드 → 콘텐츠 매핑 제안 (keywords page)

- 위치: `/admin/<slug>/keywords` 안 **primary 콘텐츠 미연결** keyword row 옆 "AI 추천 ✨"
- 입력: 키워드 label + instance 안 published Article/TreatmentPage/FAQ list (최대 30)
- 출력: 최대 3 추천 (entityType · slug · confidence · reason) — 운영자 1개 선택 후 수락 시 keyword_content_link UPSERT (is_primary=true)
- **권장**: 모든 키워드에 primary 콘텐츠 1개 연결 — readiness `title-has-target-keyword` check 통과
- **주의**: AI 가 추천한 콘텐츠가 진짜 해당 키워드를 대표하는지는 운영자 판단. 추천 신뢰도 (high/medium/low) 와 reason 참고

### 3.3 검수자 코멘트 보조 (review-queue detail)

- 위치: `/admin/<slug>/review-queue/<entryId>` 안 거부 사유 textarea 옆 "AI 보조 ✨"
- 입력: 검수 대상 entity 본문 + RiskRule fail list + 운영자가 textarea 안 입력한 짧은 메모 (5단어 권장)
- 출력: 운영자 어조의 코멘트 초안 (20~1000자) — 수락 시 textarea 채움
- **권장**: 짧은 메모 ("과장 표현 수정 필요" 등) 를 먼저 textarea 안 입력 후 클릭하면 AI 가 어조 정합한 긴 코멘트로 확장
- **주의**: 검수 책임은 검수자. AI 코멘트를 그대로 제출하지 말고 반드시 확인 후 수정

## 4. 운영자 결정 책임 (의료광고법 정합)

본 plan v1 = **운영자 final 승인 강제** 패턴.

### 4.1 운영자 책임 (의료법 정합)

- LLM 결과 = "draft" 만. 모든 publish 결정은 운영자 안.
- AI 가 의료광고법 (제56조 제2항) 금지 표현 ("최고", "최초", "유일", "완치", "100%" 등) 을 생성하면 — **즉시 거절** + 직접 수정.
- prompt system 안 의료광고법 주의를 명시했으나 (`buildSeoMetaSystemPrompt` 등) — LLM 환각 가능성 있음. 항상 검토.
- `llm_call_log.accepted` 필드 안 수락/거절 기록 — 향후 운영 품질 분석 가능.

### 4.2 PII 처리 (v1 안 제한)

본 plan v1 안 LLM 안 전송되는 데이터는 **메타 · 키워드 · 검수 사유** 만.

- ❌ 환자 정보 (consultation_request) — 미접근
- ❌ 콘텐츠 body 자동 생성 — defer (CAI-DEFER-02 · v3)
- ✅ entity 메타 (title · summary · description) — 안전 (이미 공개 콘텐츠)
- ✅ 키워드 label + 발행된 콘텐츠 title — 안전
- ✅ 검수 entity body — 단순 검수 코멘트 보조 (LLM 안 응답은 본문 생성 X · 코멘트 만)

### 4.3 audit + observability

- 모든 호출 = `llm_call_log` row (instance_id · prompt_template · entity_type · entity_id · usage · cost · status · accepted · triggered_by · created_at)
- accept/reject = `audit_event` 안 `llm-suggestion-accepted` · `llm-suggestion-rejected` 신규 type — 본 plan 합류
- RLS — instance 별 격리 (다른 instance 의 log SELECT 불가)

## 5. 장애 대응

### 5.1 ANTHROPIC_API_KEY 만료

증상: 모든 AI 제안 modal 안 "AI 서비스 미설정" 또는 API 401 에러.
조치:
1. Anthropic Console 안 새 key 발급
2. Vercel env 안 `ANTHROPIC_API_KEY` 갱신 (Production · Preview · Development)
3. Vercel **Redeploy** 클릭 (env 변경 후 재배포 필요)

### 5.2 일 quota 초과 (정상 사용 패턴 아님)

증상: 운영자가 자주 "오늘 quota 초과" 메시지.
조치:
1. `llm_call_log` 안 어떤 prompt_template 이 많이 호출되는지 확인
2. 정상 사용 (운영자 1명 일 30~50 calls 정도 예상) 인데 초과면 — `LLM_DAILY_CAP_PER_INSTANCE` 환경변수 200으로 상향
3. 비정상 (1일 100+ calls) 이면 — 운영자에게 사용 의도 확인 + 로그 분석

### 5.3 prompt cache 미적용

증상: `cache_read_tokens` 가 항상 0 — prompt cache 미적용 + cost 비싸짐.
원인: Haiku 4.5 의 prompt cache_control minimum prefix = 4096 tokens. 본 plan 의 system prompt 가 짧으면 cache miss OK (성능 영향 적음).
조치: v2 안 system prompt 길이 확장 또는 model 을 Sonnet 으로 (cache minimum 1024).

### 5.4 LLM JSON 응답 형식 오류 (parse-error)

증상: modal 안 "AI 응답 형식 오류 — 다시 시도하시거나 직접 입력하세요"
원인: LLM 환각 (드물게 JSON 외 텍스트 포함). prompt 안 "JSON-only" 강조했으나 100% 보장은 아님.
조치: 다시 시도하면 대부분 정상. 반복되면 prompt-templates 안 system prompt 강화.

## 6. CAI-DEFER 후속 cycle 안내

본 plan v1 안 미합류된 13개 defer 항목 — 후속 plan 안 결정.

- CAI-DEFER-01 readiness 개선 제안 (v2)
- CAI-DEFER-02 콘텐츠 초안 생성 (v3 — PII mask 필수)
- CAI-DEFER-03 의료광고법 자동 검수 (compliance-assistant Phase Beta)
- CAI-DEFER-04 외부 자료 → 콘텐츠 변환 (asset-ingestion)
- CAI-DEFER-05 JSON-LD E-A-T 자동 풍부화 (v4+)
- CAI-DEFER-06 PII mask (콘텐츠 초안 시 필수)
- CAI-DEFER-07 prompt template DB 기반 versioning + UI 편집
- CAI-DEFER-08 tool use (multi-turn · function calling)
- CAI-DEFER-09 streaming response (SSE)
- CAI-DEFER-10 다중 LLM provider abstraction
- CAI-DEFER-11 사용자 표시 quota 한도 알림
- CAI-DEFER-12 운영자 prompt 자유 입력 (의료광고법 risk 큼)
- CAI-DEFER-13 keyword_content_link secondary 추천 (v1 = primary only)
