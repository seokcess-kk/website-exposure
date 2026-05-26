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

// === #8 검수자 코멘트 보조 ===

export type ReviewCommentSuggestInput = {
  clinicName: string;
  entityType: string;
  entityTitle: string;
  entityContent: string;
  riskRuleFails: string[];
  reviewerShortNote?: string;
};

export const reviewCommentSuggestOutputSchema = z.object({
  comment: z.string().min(20).max(1000),
});

export type ReviewCommentSuggestOutput = z.infer<typeof reviewCommentSuggestOutputSchema>;

export function buildReviewCommentSystemPrompt(): string {
  return `${SHARED_MEDICAL_AD_NOTE}

[작업: 검수자 코멘트 보조]
당신은 의료기관 콘텐츠 검수자 (legal-reviewer · physician-reviewer) 가 reject 사유를 작성하는 것을 보조합니다.

규칙:
- 검수자의 short note + RiskRule fail list 를 종합하여 운영자에게 변경 권장 사항을 정리.
- 20~1000자 텍스트. 의료광고법 인용 가능 (제56조 제2항 등).
- "다음 변경을 권장합니다" 또는 동등 형식.
- 운영자 = entity 작성자 라 존중하는 어조.

[출력 형식]
{"comment": "..."}`;
}

export function buildReviewCommentUserPrompt(input: ReviewCommentSuggestInput): string {
  const parts: string[] = [
    `의료기관: ${input.clinicName}`,
    `Entity 종류: ${input.entityType}`,
    `Entity 제목: ${input.entityTitle}`,
    "",
    "Entity 본문 (요약):",
    input.entityContent.slice(0, 1500),
    "",
  ];
  if (input.riskRuleFails.length > 0) {
    parts.push("의료광고법 검수 실패 RiskRule:");
    parts.push(...input.riskRuleFails.map((r) => `- ${r}`));
    parts.push("");
  }
  if (input.reviewerShortNote) {
    parts.push(`검수자 short note: "${input.reviewerShortNote}"`);
    parts.push("");
  }
  parts.push("위 정보 종합하여 운영자에게 권장하는 변경 사항을 JSON 으로 작성하세요.");
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
