# CONTENT_AI_DRAFT_ENTITY_PLAN — treatment/condition/faq 본문 AI Draft (CAID-DEFER-02 본 구현)

> **상태**: v1.0 구현 (2026-06-01). 부모 plan `CONTENT_AI_DRAFT_PLAN.md` 의 **CAID-DEFER-02** (treatment_page · medical_condition_page · faq 본문 draft) 본 구현. article AI Full Draft panel 패턴 답습.

## SoT

- **사용자 결정 (2026-06-01)**: 다음 작업 = CAID-DEFER-02. scope = **treatment + condition + faq 3종 전부** · **full draft 만** (brief 2-stage mini button 미합류).
- 부모: `CONTENT_AI_DRAFT_PLAN.md` v1.2 (article full-draft · weight 7 · slug LLM 생성 · FAQ block · TL;DR).
- 실 코드 정합 SoT:
  - `apps/web/src/lib/ai/article-full-draft.ts` — 액션 패턴 (3 tx 아닌 단일 withSkeletonTx · callClaude · safeParseLlmJson · validateLlmOutput).
  - `apps/web/src/lib/ai/prompt-templates.ts` — `SHARED_MEDICAL_AD_NOTE` + article-full-draft prompt.
  - `apps/web/src/lib/ai/anthropic-client.ts:callClaude` — quota check (weight) + llm_call_log 기록.
  - `apps/web/src/lib/ai/llm-audit.ts:checkDailyQuota` — `LLM_DAILY_CAP_PER_INSTANCE` default 100.
  - form: `TreatmentPageForm.tsx` · `MedicalConditionForm.tsx` · `FaqForm.tsx`.
  - schema: `packages/core-content/src/schema.ts` treatment_page (summary 50~160) · medical_condition_page (summary 50~160) · faq (question 10~200 · answer 50~2000).

## 1. 범위

### 1.1 포함 (v1)

| 항목 | 내용 |
|---|---|
| **page full-draft** (treatment + condition) | 공통 모듈 `lib/ai/page-full-draft.ts` · entityKind 분기. output = `{ title, summary, bodyMarkdown, slug }`. **publication 추천 제거** (두 entity 에 publication FK 없음). weight 7. |
| **faq full-draft** | `lib/ai/faq-full-draft.ts`. output = `{ question, answer, slug }`. weight 3 (짧은 output). |
| **prompt** | `prompt-templates.ts` 안 page/faq full-draft system·user prompt + output zod. 의료광고법 강화 (시술 페이지 risk). |
| **migration** | C0049 (manifest 외) — llm_call_log CHECK 에 `treatment-page-full-draft` · `medical-condition-page-full-draft` · `faq-full-draft` 추가. |
| **UI** | `useEntityFullDraft` 제네릭 hook + `PageFullDraftPanel` (treatment/condition) + `FaqFullDraftPanel`. brief mini button·publication select 없음. PII banner 유지. |
| **form mount** | 3 form 안 `isNew` 일 때 panel mount + onApply → field 채움 + markSlugDirty. |
| **검증** | prompt schema/validator vitest · typecheck · web:build · 전체 vitest. |

### 1.2 비범위 (defer)

| 항목 | marker |
|---|---|
| brief 2-stage mini button (신규 entity) — full draft 만 (사용자 결정) | CAIDE-DEFER-01 |
| 기존 entity overwrite (edit form panel) — 신규 생성만 (CAID-DEFER-01 정합) | CAIDE-DEFER-02 |
| keyword 자동완성 (datalist) — v1 = free-text 입력 (form page.tsx plumbing 회피) | CAIDE-DEFER-03 |
| publication/citation 추천 (treatment/condition 에 FK 부재) | CAIDE-DEFER-04 |
| treatment principles / condition primaryTreatment 등 entity 고유 필드 AI 생성 — 운영자 수동 선택 | CAIDE-DEFER-05 |

## 2. 설계 결정

### 2.1 page (treatment/condition) output 제약
- `title` 1~200 · `summary` **50~160** (article 80~200 과 다름 — 두 entity 의 DB CHECK 정합) · `bodyMarkdown` **800~2500** (서비스 페이지 — article 1500~3000 보다 짧게 허용) · `slug` `^[a-z0-9][a-z0-9-]{2,99}$`.
- H2 count **3~6**. FAQ block 은 **권장이되 강제 X** (서비스 페이지라 article 처럼 FAQ 필수 아님). TL;DR 첫 문장 정의 패턴은 유지 (GEO).
- entityKind = `TreatmentPage` (시술/진료) vs `MedicalConditionPage` (증상) — prompt 안 용어·관점 분기.

### 2.2 faq output 제약
- `question` 10~200 · `answer` **50~2000** (faq.answer DB CHECK 정합) · `slug` regex 동일.
- answer 는 markdown 허용 (form 안 markdown). 단 짧아 H2 강제 X.
- 1 Q&A 쌍 생성 (운영자 keyword + 의도 1줄 → 질문 1 + 답변 1).

### 2.3 의료광고법 강화 (시술 페이지 risk)
시술/진료 페이지는 article 칼럼보다 광고성 risk 가 높음 (효과·시술 자체 홍보). page full-draft system prompt 안 `SHARED_MEDICAL_AD_NOTE` 외 추가 강제:
- 시술 효과 단정·완치·보장 표현 금지 (제56조 제2항).
- 시술 가격·이벤트·할인 표현 절대 미생성.
- 환자 유인 표현 ("지금 예약", "특별 혜택") 금지.
- 부작용·금기·주의사항을 균형 있게 포함 권장.

### 2.4 quota weight
- page = 7 (article 과 동일 long-form cost).
- faq = 3 (answer max 2000 · output ~1000t · article 의 절반 이하).

### 2.5 publication 제거
article 의 `loadPublicationCandidates` · `recommendedPublicationIds` · `[근거:]` placeholder 흐름은 신규 entity 에 **미적용** (treatment_page·medical_condition_page 에 publication FK 없음). citation 은 운영자 수동 EvidenceLinkPanel (기존).

## 3. 작업 manifest

| # | 작업 | gate |
|---|---|---|
| 1 | C0049 migration (llm_call_log CHECK 3종 추가 · manifest 외) | — |
| 2 | prompt-templates.ts: page/faq output schema + system/user prompt (의료광고법 강화) | — |
| 3 | lib/ai/entity-draft-helpers.ts: validatePageDraftOutput · validateFaqDraftOutput (countH2 재사용) | — |
| 4 | lib/ai/page-full-draft.ts (entityKind 분기 · weight 7) + lib/ai/faq-full-draft.ts (weight 3) | 1·2·3 |
| 5 | hooks/useEntityFullDraft.ts (제네릭) | 4 |
| 6 | components/ai/PageFullDraftPanel.tsx + FaqFullDraftPanel.tsx | 5 |
| 7 | TreatmentPageForm·MedicalConditionForm·FaqForm 안 panel mount (isNew) + onApply | 6 |
| 8 | vitest (prompt schema·validator) + typecheck + web:build | 1~7 |

## 4. 검증 시나리오

- CAIDE-V01 — migration C0049 후 llm_call_log 에 3 신규 template INSERT 가능.
- CAIDE-V02 — page output schema: title/summary/body/slug 경계값 zod PASS·FAIL.
- CAIDE-V03 — faq output schema: question/answer/slug 경계값.
- CAIDE-V04 — validatePageDraftOutput: summary 50~160 밖·body 800~2500 밖·H2 3~6 밖·slug 위반 reject.
- CAIDE-V05 — validateFaqDraftOutput: question 10~200·answer 50~2000·slug.
- CAIDE-V06 — typecheck 0 · 전체 vitest PASS · web:build PASS.

## 변경 이력

- **2026-06-01**: v1.0 — CAID-DEFER-02 본 구현. treatment+condition+faq full draft. 사용자 결정 (3종 전부·full only). publication 제거·free-text keyword·brief 미합류. 의료광고법 시술 페이지 강화.
