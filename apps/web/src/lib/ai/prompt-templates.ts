// @glitzy/web/lib/ai/prompt-templates — CONTENT_AI_ASSIST_PLAN v1.0 § 4·5
// 3 hardcode prompt template — JSON-only output 강제 + 의료광고법 주의 한국어.
//
// 공통 system prompt 구조:
//  1. 역할 (의료기관 운영 보조)
//  2. 의료광고법 제56조 제2항 주의 (금지 표현)
//  3. 한국어 응답 강제
//  4. JSON-only · code fence 미사용 · 다른 텍스트 절대 X
//
// Haiku 4.5 의 prompt cache_control minimum prefix = 4096 tokens — 본 template 길이 short 하면 cache miss OK.
// 운영자 의료광고법 책임 = 본 LLM 결과 = "draft" 만 · 항상 final 승인 강제.

import { z } from "zod";

const SHARED_MEDICAL_AD_NOTE = `
당신은 한국 의료기관 (한의원·병원) 운영자를 보조하는 콘텐츠 AI 입니다.

[의료광고법 제56조 제2항 주의 — 금지 표현 절대 미생성]
- "최고", "최초", "유일", "완치", "100%" 등 단정·비교 광고 표현
- 의료진 비교 광고 ("가장 잘하는", "1위" 등)
- 부작용 미언급 광고
- 환자 의료진 체험·만족 비교 광고

[응답 규칙]
- 한국어만 응답. 영어/혼합 금지
- JSON 객체만 출력. code fence (\`\`\`json) 미사용. 다른 텍스트 절대 X
- 운영자가 final 승인 후 사용 — 책임은 운영자 안
`.trim();

// === #1 SEO 메타 자동 제안 ===

export type SeoMetaSuggestInput = {
  clinicName: string;
  entityType: "Article" | "TreatmentPage" | "FAQ";
  currentTitle?: string;
  currentDescription?: string;
  category?: string;
  targetKeyword?: string;
};

export const seoMetaSuggestOutputSchema = z.object({
  title: z.string().min(5).max(70),
  metaDescription: z.string().min(20).max(160),
  slug: z.string().regex(/^[a-z0-9][a-z0-9-]{2,63}$/),
});

export type SeoMetaSuggestOutput = z.infer<typeof seoMetaSuggestOutputSchema>;

export function buildSeoMetaSystemPrompt(): string {
  return `${SHARED_MEDICAL_AD_NOTE}

[작업: SEO 메타 자동 제안]
당신은 의료기관 콘텐츠의 SEO 메타 정보 (title · description · slug) 를 제안합니다.

규칙:
- title: 5~70자. 한국어 자연. targetKeyword 가 있으면 가능한 한 자연스럽게 포함.
- metaDescription: 20~160자. 검색 결과 안 표시되는 요약. 의료광고법 정합.
- slug: ^[a-z0-9][a-z0-9-]{2,63}$ regex. 영문 lowercase + hyphen. 한국어 음역 (hangul-romanization 권장).

[출력 형식]
{"title": "...", "metaDescription": "...", "slug": "..."}`;
}

export function buildSeoMetaUserPrompt(input: SeoMetaSuggestInput): string {
  const parts: string[] = [
    `의료기관: ${input.clinicName}`,
    `Entity 종류: ${input.entityType}`,
  ];
  if (input.currentTitle) parts.push(`현재 title: ${input.currentTitle}`);
  if (input.currentDescription) parts.push(`현재 설명: ${input.currentDescription}`);
  if (input.category) parts.push(`카테고리: ${input.category}`);
  if (input.targetKeyword) parts.push(`타깃 키워드: ${input.targetKeyword}`);
  parts.push("\n위 entity 의 SEO 메타 (title · metaDescription · slug) 를 JSON 으로 제안하세요.");
  return parts.join("\n");
}

// === #6 키워드 → 콘텐츠 매핑 제안 ===

export type KeywordMatchSuggestInput = {
  clinicName: string;
  keywordLabel: string;
  candidates: Array<{
    entityType: "Article" | "TreatmentPage" | "FAQ";
    entityId: string;
    slug: string;
    title: string;
    summary?: string;
  }>;
};

export const keywordMatchSuggestOutputSchema = z.object({
  recommendations: z
    .array(
      z.object({
        entityId: z.string().uuid(),
        confidence: z.enum(["high", "medium", "low"]),
        reason: z.string().min(5).max(200),
      }),
    )
    .max(3),
});

export type KeywordMatchSuggestOutput = z.infer<typeof keywordMatchSuggestOutputSchema>;

export function buildKeywordMatchSystemPrompt(): string {
  return `${SHARED_MEDICAL_AD_NOTE}

[작업: 키워드 → 콘텐츠 매핑 제안]
당신은 운영자가 관리하는 타깃 키워드와 가장 잘 어울리는 콘텐츠 (Article/TreatmentPage/FAQ) 를 candidates 중에서 추천합니다.

규칙:
- candidates 중 최대 3개 추천 · 의미 일치 가장 높은 순.
- confidence: high (직접 일치) · medium (부분 일치) · low (간접 관련).
- reason: 5~200자. 왜 이 entity 가 이 키워드의 primary 후보인지.

[출력 형식]
{"recommendations": [{"entityId": "<uuid>", "confidence": "high"|"medium"|"low", "reason": "..."}]}`;
}

export function buildKeywordMatchUserPrompt(input: KeywordMatchSuggestInput): string {
  const candidateLines = input.candidates.map(
    (c) =>
      `- [${c.entityType}] entityId=${c.entityId} · slug=${c.slug} · title="${c.title}"${
        c.summary ? ` · summary="${c.summary.slice(0, 200)}"` : ""
      }`,
  );
  return [
    `의료기관: ${input.clinicName}`,
    `타깃 키워드: "${input.keywordLabel}"`,
    "",
    "Candidates:",
    ...candidateLines,
    "",
    "위 candidates 중 본 키워드와 가장 잘 어울리는 entity 를 최대 3개 추천하세요 (JSON).",
  ].join("\n");
}

// === #article-full-draft : 칼럼 본문 AI Draft 생성 (CONTENT_AI_DRAFT_PLAN v1.0) ===
//
// scope B (Full draft) — 운영자가 keyword + brief 입력 → AI 가 title · summary · body markdown +
// 추천 publication 출력. 운영자 검수 후 status='draft' 저장. direct published 절대 X.

export type ArticleFullDraftInput = {
  clinicName: string;
  categoryName?: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  brief: string;
  candidatePublications: Array<{
    id: string;
    title: string;
    publicationType: string;
  }>;
};

export const articleFullDraftOutputSchema = z.object({
  title: z.string().min(1).max(200),
  summary: z.string().min(80).max(200),
  // v1.1 — 1500~3000자 long-form (FAQ block + 정보형 H2 + citation 포함 max · LLM ranking 친화).
  bodyMarkdown: z.string().min(1500).max(3000),
  // v1.2 — slug LLM 안 직접 생성 (SEO 메타 panel 제거 보완 · article.slug regex 정합).
  slug: z.string().regex(/^[a-z0-9][a-z0-9-]{2,99}$/),
  recommendedPublicationIds: z.array(z.string().uuid()).max(5),
});

export type ArticleFullDraftOutput = z.infer<typeof articleFullDraftOutputSchema>;

export function buildArticleFullDraftSystemPrompt(): string {
  return `${SHARED_MEDICAL_AD_NOTE}

[작업: 의료기관 칼럼 본문 Full Draft 생성]
당신은 운영자가 검수할 칼럼 1편의 초안 (title · summary · bodyMarkdown · recommendedPublicationIds) 을 작성합니다.

[엄격 준수]
1. 의료법 제56조 (의료광고 금지 행위) · 시행령 제23·24조 준수.
   - 검증되지 않은 치료 효과·완치율·"국내 최초"·"부작용 없음" 표현 절대 X.
   - 환자 후기 인용·비교 광고·치료 보장 표현 절대 X.
2. E-A-T 정합 — 객관적·중립적 톤. 의학적 사실 + 가이드라인 인용 형태.
3. 환자 정보 (이름·연락처·진료기록·진단명 등 PII) 절대 본문 안 미포함.
4. 출력 = 100% 한국어. 의학 용어 만 영문 병기 허용 (예: "당뇨병 (Diabetes Mellitus)"). 다른 언어 단독 단어/문장 금지.

[출력 형식 강제]
JSON only — markdown code fence (\`\`\`json …\`\`\`) · \`\`\` 등 wrap 절대 X. 첫 character = "{" · 마지막 character = "}".

schema:
{
  "title": "1~200자 한국어 · primary keyword 포함",
  "summary": "80~200자 한국어 · primary keyword 포함 · plain text (markdown X)",
  "bodyMarkdown": "intro 1 문단 + H2 (\"## \") 4~5 개 (마지막 1개는 FAQ 강제) + conclusion 1 문단 · 1500~3000자 (목표 2000~2500)",
  "slug": "영문 lowercase + 숫자 + hyphen 만 · regex ^[a-z0-9][a-z0-9-]{2,99}$ · 3~100자 · primary keyword 영문 transliteration 또는 의미 있는 영문 keyword",
  "recommendedPublicationIds": ["uuid 0~5 · candidate 안 선택 · candidate 0개 시 빈 배열 []"]
}

[slug 작성 규칙]
- primary keyword 의 영문 의미 또는 transliteration 활용 (예: "체질개선 다이어트" → "constitution-diet" 또는 "body-type-diet").
- 영문 lowercase + 숫자 + hyphen 만 허용. 다른 character (한글·공백·_·.·/ 등) 절대 X.
- 3~100자 · 첫 character = a-z 또는 0-9.
- 의미 있는 단어 조합 (단순 nanoid 형식 X · "abc12345" 보다 "diet-guide" 권장).

[markdown 구조 강제]
- bodyMarkdown 안 H1 (\`# \`) 절대 미사용 — title 은 form 의 별 input. markdown 안 H2 (\`## \`) 부터 시작.
- 구조: intro 문단 → \`## <소제목>\` (3~4개 정보형) → \`## 자주 묻는 질문\` (FAQ 강제 · 마지막 H2) → conclusion 문단.
- H3 (\`### \`) = FAQ block 안 질문 (Q&A 쌍 의 Q) 에만 사용. 정보형 H2 안 H3 사용 X.
- bodyMarkdown 안 list (\`- \` · \`1. \`) · table (\`|\`) **적극 권장** (LLM 검색 안 chunking 친화).
- title · summary 안 markdown 금지 (plain text 만).

[GEO + SEO 강화 패턴 — 2026 검색 엔진/LLM 친화]
- **intro 첫 문장 = TL;DR 정의 패턴** = "○○ 이란 ~ 이다" 또는 "○○ 는 ~ 이다" 형식. 본 칼럼 한줄 요약. (LLM 첫 문장 추출 · Google Featured Snippet · 네이버 지식 카드 친화)
- **intro 두 번째 문장 = 핵심 요점 1~2개** — 본문 안 다룰 핵심 결론 미리 노출.
- **정보형 H2 (3~4개) 안 구조 권장**:
  - 첫 문장 = 해당 H2 의 핵심 정의 또는 요약.
  - 두 번째 단락 안 list (\`- \`) 3~5개 또는 table 활용 (LLM chunking).
  - 마지막 문장 = 다음 H2 와 연결 또는 의료적 주의 사항.
- **마지막 H2 = "## 자주 묻는 질문"** = FAQ block. 강제. Q&A 3~4쌍:
  - 형식: \`### Q. <질문>\` + 답변 문단 (50~150자).
  - 질문 = primary keyword + secondary keyword 안 자연 query 형태.
  - 답변 = 객관적·중립적 톤. "○○ 입니다" / "○○ 권장" 형식.

[키워드 배치 규칙]
- primary keyword = title 안 1회 + intro 첫 문장 안 1회 + 첫 정보형 H2 안 1회 + FAQ 안 1회 (최소 4회).
- secondary keywords (0~3) = 각각 다른 정보형 H2 안 1회 분산 (반복 X · 1 H2 안 1 secondary 만).
- keyword 밀도 = 본문 안 전체 1~2% 권장 (과다 X · 자연스러운 빈도).

[citation placeholder 규칙]
- candidate publication 안 관련 있는 것 만 \`[근거: <publication.title>]\` 안 inline 삽입.
- candidate 0개 (publication 미등록 instance) 시 placeholder 출력 강제 X — recommendedPublicationIds: [] + 본문 안 placeholder 0개.
- 본문 안 약 2~4개 placeholder 권장 (긴 long-form 정합 · 0 개 도 허용).`;
}

export function buildArticleFullDraftUserPrompt(input: ArticleFullDraftInput): string {
  const candidateLines =
    input.candidatePublications.length === 0
      ? ["없음 — citation placeholder 생략 가능"]
      : input.candidatePublications.map(
          (p) => `- ${p.id} · "${p.title}" (${p.publicationType})`,
        );
  const parts: string[] = [
    `의료기관: ${input.clinicName}`,
  ];
  if (input.categoryName) parts.push(`카테고리: ${input.categoryName}`);
  parts.push(`primary keyword: "${input.primaryKeyword}"`);
  parts.push(
    `secondary keywords: ${
      input.secondaryKeywords.length === 0
        ? "없음"
        : input.secondaryKeywords.map((k) => `"${k}"`).join(", ")
    }`,
  );
  parts.push(`brief: ${input.brief}`);
  parts.push("");
  parts.push("[candidate publications]");
  parts.push(...candidateLines);
  parts.push("");
  parts.push("위 정보 기반으로 칼럼 1편의 초안을 JSON 으로 출력하세요.");
  return parts.join("\n");
}

// === #article-brief-draft : 칼럼 brief 1차 자동 생성 (CONTENT_AI_DRAFT_PLAN v1.0 CAID-DEFER-16 v1 합류) ===
//
// 2-stage flow 안 1단계 — 운영자가 keyword 만 입력 → AI 가 brief (50~200자) 1차 생성 →
// 운영자가 textarea 안 검수/수정 → 본문 LLM 2차 (article-full-draft) 진행.
//
// weight 1 quota (CAI v1 default 정합 · 짧은 output ~200t).

export type ArticleBriefDraftInput = {
  clinicName: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  categoryName?: string;
};

export const articleBriefDraftOutputSchema = z.object({
  brief: z.string().min(50).max(200),
});

export type ArticleBriefDraftOutput = z.infer<typeof articleBriefDraftOutputSchema>;

export function buildArticleBriefDraftSystemPrompt(): string {
  return `${SHARED_MEDICAL_AD_NOTE}

[작업: 의료기관 칼럼 brief 1차 자동 생성]
당신은 운영자가 입력한 키워드를 기반으로 칼럼이 다룰 주제·논점·결론을 50~200자의 brief 1줄로 작성합니다.

[엄격 준수]
1. 의료법 제56조 (의료광고 금지 행위) 준수 — 검증되지 않은 치료 효과·완치율·"최초"·"부작용 없음" 표현 절대 X.
2. 환자 정보 (이름·연락처·진료기록·진단명 등 PII) 절대 포함 X.
3. 출력 = 100% 한국어. 의학 용어 만 영문 병기 허용. 다른 언어 단독 단어/문장 금지.
4. brief = 칼럼의 outline 시드 — 운영자가 검수/수정 후 본문 LLM 2차 안 input 으로 사용.

[brief 작성 원칙]
- 4 요소 패턴 권장: [다룰 주제] + [핵심 논점/관점] + [결론 방향] + [의도 차별점 또는 진료 흐름].
- 50~200자 (운영자가 짧으면 LLM 본문 환각 risk · 길면 운영자 책임 분산 약화).
- 객관적·중립적 톤. 의료기관 자체 광고 표현 회피.

[출력 형식 강제]
JSON only — code fence (\`\`\`json …\`\`\`) · \`\`\` 등 wrap 절대 X. 첫 character = "{" · 마지막 character = "}".

schema:
{
  "brief": "50~200자 한국어 brief 1줄"
}`;
}

export function buildArticleBriefDraftUserPrompt(input: ArticleBriefDraftInput): string {
  const parts: string[] = [
    `의료기관: ${input.clinicName}`,
  ];
  if (input.categoryName) parts.push(`카테고리: ${input.categoryName}`);
  parts.push(`primary keyword: "${input.primaryKeyword}"`);
  parts.push(
    `secondary keywords: ${
      input.secondaryKeywords.length === 0
        ? "없음"
        : input.secondaryKeywords.map((k) => `"${k}"`).join(", ")
    }`,
  );
  parts.push("");
  parts.push("위 키워드 기반으로 칼럼이 다룰 주제·논점·결론 brief 1줄 (50~200자) 을 JSON 으로 작성하세요.");
  return parts.join("\n");
}

// === #treatment-page-full-draft · #medical-condition-page-full-draft (CONTENT_AI_DRAFT_ENTITY_PLAN v1.0 CAID-DEFER-02) ===
//
// treatment_page (시술/진료) · medical_condition_page (증상/질환) 본문 Full Draft.
// article 과 동일 shape (title·summary·bodyMarkdown·slug) 이나 publication 추천 제거 + summary 50~160 +
// body 800~2500 (서비스 페이지) + entityKind 분기. 시술 페이지는 의료광고법 risk 강화.

export type PageEntityKind = "TreatmentPage" | "MedicalConditionPage";

export type PageFullDraftInput = {
  clinicName: string;
  entityKind: PageEntityKind;
  primaryKeyword: string;
  secondaryKeywords: string[];
  brief: string;
};

export const pageFullDraftOutputSchema = z.object({
  title: z.string().min(1).max(200),
  // treatment_page · medical_condition_page DB CHECK 정합 (article 80~200 과 다름).
  summary: z.string().min(50).max(160),
  // 서비스 페이지 long-form (article 1500~3000 보다 짧게 허용).
  bodyMarkdown: z.string().min(800).max(2500),
  slug: z.string().regex(/^[a-z0-9][a-z0-9-]{2,99}$/),
});

export type PageFullDraftOutput = z.infer<typeof pageFullDraftOutputSchema>;

function pageEntityLabel(kind: PageEntityKind): { noun: string; perspective: string } {
  return kind === "TreatmentPage"
    ? {
        noun: "시술/진료",
        perspective: "해당 시술·진료가 무엇이고 어떤 원리·과정·적용 대상·기대 범위·주의사항인지",
      }
    : {
        noun: "증상/질환",
        perspective: "해당 증상·질환이 무엇이고 원인·동반 증상·일상 관리·관련 진료 흐름인지",
      };
}

export function buildPageFullDraftSystemPrompt(kind: PageEntityKind): string {
  const { noun } = pageEntityLabel(kind);
  const treatmentExtra =
    kind === "TreatmentPage"
      ? `
[시술/진료 페이지 추가 강제 — 의료광고법 risk 高]
- 시술 효과 단정·완치·보장·"부작용 없음" 표현 절대 X.
- 시술 가격·이벤트·할인·사은품 표현 절대 미생성.
- 환자 유인 표현 ("지금 예약", "특별 혜택", "선착순") 절대 X.
- 부작용·금기·주의사항·시술 후 관리를 균형 있게 포함 (한쪽 홍보 X).`
      : "";
  return `${SHARED_MEDICAL_AD_NOTE}

[작업: 의료기관 ${noun} 페이지 본문 Full Draft 생성]
당신은 운영자가 검수할 ${noun} 페이지 1건의 초안 (title · summary · bodyMarkdown · slug) 을 작성합니다.

[엄격 준수]
1. 의료법 제56조 (의료광고 금지 행위) · 시행령 제23·24조 준수.
   - 검증되지 않은 치료 효과·완치율·"국내 최초"·"부작용 없음" 표현 절대 X.
   - 환자 후기 인용·비교 광고·치료 보장 표현 절대 X.
2. E-A-T 정합 — 객관적·중립적 톤. 의학적 사실 + 가이드라인 인용 형태.
3. 환자 정보 (이름·연락처·진료기록·진단명 등 PII) 절대 본문 안 미포함.
4. 출력 = 100% 한국어. 의학 용어 만 영문 병기 허용 (예: "당뇨병 (Diabetes Mellitus)"). 다른 언어 단독 단어/문장 금지.${treatmentExtra}

[출력 형식 강제]
JSON only — markdown code fence (\`\`\`json …\`\`\`) · \`\`\` 등 wrap 절대 X. 첫 character = "{" · 마지막 character = "}".

schema:
{
  "title": "1~200자 한국어 · primary keyword 포함",
  "summary": "50~160자 한국어 · primary keyword 포함 · plain text (markdown X)",
  "bodyMarkdown": "intro 1 문단 + H2 (\"## \") 3~6 개 + conclusion 1 문단 · 800~2500자 (목표 1200~1800)",
  "slug": "영문 lowercase + 숫자 + hyphen 만 · regex ^[a-z0-9][a-z0-9-]{2,99}$ · 3~100자 · primary keyword 영문 transliteration 또는 의미 있는 영문 keyword"
}

[markdown 구조 강제]
- bodyMarkdown 안 H1 (\`# \`) 절대 미사용 — title 은 form 의 별 input. H2 (\`## \`) 부터 시작.
- H2 3~6개 (정보형). list (\`- \`) · table (\`|\`) 적극 권장 (LLM chunking 친화).
- title · summary 안 markdown 금지 (plain text 만).

[GEO + SEO 강화 패턴]
- intro 첫 문장 = TL;DR 정의 패턴 = "○○ 란 ~ 이다" / "○○ 는 ~ 이다". ${noun} 한줄 정의. (Featured Snippet · 네이버 지식 카드 친화)
- 각 H2 첫 문장 = 해당 소제목의 핵심 정의/요약. 이어서 list 또는 table.
- "## 자주 묻는 질문" FAQ block 은 **권장** (강제 X) — 포함 시 \`### Q. <질문>\` + 답변 문단.

[키워드 배치]
- primary keyword = title 1회 + intro 첫 문장 1회 + 첫 H2 1회 (최소 3회).
- secondary keywords (0~3) = 각각 다른 H2 안 1회 분산.
- 키워드 밀도 1~2% (과다 X).`;
}

export function buildPageFullDraftUserPrompt(input: PageFullDraftInput): string {
  const { noun } = pageEntityLabel(input.entityKind);
  const parts: string[] = [`의료기관: ${input.clinicName}`, `페이지 종류: ${noun}`];
  parts.push(`primary keyword: "${input.primaryKeyword}"`);
  parts.push(
    `secondary keywords: ${
      input.secondaryKeywords.length === 0
        ? "없음"
        : input.secondaryKeywords.map((k) => `"${k}"`).join(", ")
    }`,
  );
  parts.push(`brief: ${input.brief}`);
  parts.push("");
  parts.push(`위 정보 기반으로 ${noun} 페이지 1건의 초안을 JSON 으로 출력하세요.`);
  return parts.join("\n");
}

/** LLM JSON 출력 안 zod safeParse + fallback. invalid 시 운영자 안내 modal. */
export function safeParseLlmJson<T>(
  text: string,
  schema: z.ZodSchema<T>,
): { ok: true; data: T } | { ok: false; reason: string } {
  // code fence 안 strip (Haiku 가 종종 ```json 안 wrap)
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "").trim();
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return { ok: false, reason: "AI 응답이 유효한 JSON 형식이 아닙니다 — 다시 시도하시거나 직접 입력하세요." };
  }
  const result = schema.safeParse(parsed);
  if (!result.success) {
    return {
      ok: false,
      reason: `AI 응답 형식 오류: ${result.error.issues.slice(0, 2).map((i) => i.message).join(" · ")}`,
    };
  }
  return { ok: true, data: result.data };
}
