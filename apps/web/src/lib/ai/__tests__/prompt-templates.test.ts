// @glitzy/web/lib/ai/__tests__/prompt-templates — CONTENT_AI_ASSIST_PLAN v1.0 § 8 task 8
// system/user prompt build · safeParseLlmJson · zod schema 검증.

import { describe, it, expect } from "vitest";
import {
  buildSeoMetaSystemPrompt,
  buildSeoMetaUserPrompt,
  buildKeywordMatchSystemPrompt,
  buildKeywordMatchUserPrompt,
  buildReviewCommentSystemPrompt,
  buildReviewCommentUserPrompt,
  safeParseLlmJson,
  seoMetaSuggestOutputSchema,
  keywordMatchSuggestOutputSchema,
  reviewCommentSuggestOutputSchema,
} from "../prompt-templates";

describe("SEO 메타 prompt template", () => {
  it("system prompt 안 의료광고법 주의 + JSON-only + 한국어 강제 표기", () => {
    const sys = buildSeoMetaSystemPrompt();
    expect(sys).toMatch(/의료광고법/);
    expect(sys).toMatch(/제56조/);
    expect(sys).toMatch(/JSON/);
    expect(sys).toMatch(/한국어/);
    // 금지 표현 명시
    expect(sys).toMatch(/최고/);
    expect(sys).toMatch(/완치/);
  });

  it("user prompt 안 clinicName + entityType + targetKeyword interpolation", () => {
    const user = buildSeoMetaUserPrompt({
      clinicName: "다이트한의원 부평점",
      entityType: "Article",
      currentTitle: "체질개선 다이어트",
      targetKeyword: "체질개선",
    });
    expect(user).toContain("다이트한의원 부평점");
    expect(user).toContain("Article");
    expect(user).toContain("체질개선 다이어트");
    expect(user).toContain("타깃 키워드: 체질개선");
  });

  it("output schema — title/metaDescription 길이 한정 + slug regex 검증", () => {
    const ok = seoMetaSuggestOutputSchema.safeParse({
      title: "체질개선 다이어트 안내",
      metaDescription: "본 한의원의 체질개선 다이어트 진료 안내. 의료광고법 정합 콘텐츠.",
      slug: "constitution-diet-guide",
    });
    expect(ok.success).toBe(true);
    const bad = seoMetaSuggestOutputSchema.safeParse({
      title: "짧",
      metaDescription: "x",
      slug: "Bad Slug!",
    });
    expect(bad.success).toBe(false);
  });
});

describe("keyword match prompt template", () => {
  it("user prompt 안 candidates entityId interpolation", () => {
    const user = buildKeywordMatchUserPrompt({
      clinicName: "다이트한의원",
      keywordLabel: "체질개선 다이어트",
      candidates: [
        { entityType: "Article", entityId: "a1", slug: "article-1", title: "체질 분석", summary: "사상체질 안내" },
        { entityType: "TreatmentPage", entityId: "t1", slug: "diet", title: "굿바이 다이어트" },
      ],
    });
    expect(user).toContain("타깃 키워드: \"체질개선 다이어트\"");
    expect(user).toContain("entityId=a1");
    expect(user).toContain("entityId=t1");
    expect(user).toContain("Candidates:");
  });

  it("output schema — 최대 3 추천 · confidence enum", () => {
    const ok = keywordMatchSuggestOutputSchema.safeParse({
      recommendations: [
        { entityId: "11111111-1111-1111-1111-111111111111", confidence: "high", reason: "이유1234567" },
      ],
    });
    expect(ok.success).toBe(true);
    const tooMany = keywordMatchSuggestOutputSchema.safeParse({
      recommendations: Array.from({ length: 4 }, (_, i) => ({
        entityId: `${i}1111111-1111-1111-1111-111111111111`,
        confidence: "low",
        reason: "이유1234567",
      })),
    });
    expect(tooMany.success).toBe(false);
    const badConfidence = keywordMatchSuggestOutputSchema.safeParse({
      recommendations: [
        { entityId: "11111111-1111-1111-1111-111111111111", confidence: "very-high", reason: "이유1234567" },
      ],
    });
    expect(badConfidence.success).toBe(false);
  });
});

describe("review comment prompt template", () => {
  it("user prompt 안 entity content + RiskRule fail list + reviewerShortNote 정합", () => {
    const user = buildReviewCommentUserPrompt({
      clinicName: "다이트한의원",
      entityType: "Article",
      entityTitle: "다이어트 효과",
      entityContent: "본 글은 1주 만에 10kg 감량을 보장합니다.",
      riskRuleFails: ["보장-금지: '보장' 표현 사용", "비교 광고: 1위 표현"],
      reviewerShortNote: "과장 표현 수정 필요",
    });
    expect(user).toContain("다이트한의원");
    expect(user).toContain("Entity 제목: 다이어트 효과");
    expect(user).toContain("의료광고법 검수 실패 RiskRule");
    expect(user).toContain("보장-금지");
    expect(user).toContain("과장 표현 수정 필요");
  });

  it("system prompt 안 검수자 어조 안내", () => {
    const sys = buildReviewCommentSystemPrompt();
    expect(sys).toMatch(/검수자/);
    expect(sys).toMatch(/존중/);
    expect(sys).toMatch(/JSON/);
  });

  it("output schema — comment 길이 20~1000", () => {
    expect(reviewCommentSuggestOutputSchema.safeParse({ comment: "x".repeat(50) }).success).toBe(true);
    expect(reviewCommentSuggestOutputSchema.safeParse({ comment: "짧" }).success).toBe(false);
    expect(reviewCommentSuggestOutputSchema.safeParse({ comment: "x".repeat(1001) }).success).toBe(false);
  });
});

describe("safeParseLlmJson", () => {
  it("plain JSON parse OK", () => {
    const r = safeParseLlmJson(
      '{"title":"체질개선 다이어트 안내","metaDescription":"본 한의원의 체질개선 다이어트 진료 안내 콘텐츠.","slug":"diet-guide"}',
      seoMetaSuggestOutputSchema,
    );
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.slug).toBe("diet-guide");
  });

  it("code fence (```json) 안 wrap — strip 후 parse OK", () => {
    const text = '```json\n{"title":"체질개선 다이어트 안내","metaDescription":"본 한의원의 체질개선 다이어트 진료 안내 콘텐츠.","slug":"diet-guide"}\n```';
    const r = safeParseLlmJson(text, seoMetaSuggestOutputSchema);
    expect(r.ok).toBe(true);
  });

  it("invalid JSON — 친절한 에러 메시지", () => {
    const r = safeParseLlmJson("{not json", seoMetaSuggestOutputSchema);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toMatch(/유효한 JSON/);
  });

  it("schema validation fail — issue 메시지 노출", () => {
    const r = safeParseLlmJson('{"title":"x","metaDescription":"y","slug":"BadSlug!"}', seoMetaSuggestOutputSchema);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toMatch(/형식 오류/);
  });
});
