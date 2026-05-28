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
  buildArticleFullDraftSystemPrompt,
  buildArticleFullDraftUserPrompt,
  buildArticleBriefDraftSystemPrompt,
  buildArticleBriefDraftUserPrompt,
  safeParseLlmJson,
  seoMetaSuggestOutputSchema,
  keywordMatchSuggestOutputSchema,
  reviewCommentSuggestOutputSchema,
  articleFullDraftOutputSchema,
  articleBriefDraftOutputSchema,
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

describe("article full draft prompt template (CONTENT_AI_DRAFT_PLAN v1.0)", () => {
  it("system prompt 안 의료광고법 + JSON-only + 한국어 + H1 금지 + markdown 구조 강제 표기", () => {
    const sys = buildArticleFullDraftSystemPrompt();
    expect(sys).toMatch(/의료광고법/);
    expect(sys).toMatch(/제56조/);
    expect(sys).toMatch(/JSON only/);
    expect(sys).toMatch(/100% 한국어/);
    // H1 금지
    expect(sys).toMatch(/H1.*절대 미사용/);
    // H2 구조 명시
    expect(sys).toMatch(/H2/);
    // 키워드 배치 규칙
    expect(sys).toMatch(/primary keyword/);
    // citation 규칙
    expect(sys).toMatch(/근거:/);
  });

  it("system prompt (v1.1) — GEO/SEO 강화 패턴 표기 (TL;DR + FAQ + long-form)", () => {
    const sys = buildArticleFullDraftSystemPrompt();
    // long-form 1500~3000자 (v1.1 max 3000 정합 · v1.2 안 확장)
    expect(sys).toMatch(/1500~3000/);
    // first sentence TL;DR + 정의 패턴
    expect(sys).toMatch(/TL;DR/);
    expect(sys).toMatch(/이란.*이다/);
    // FAQ block 강제
    expect(sys).toMatch(/자주 묻는 질문/);
    expect(sys).toMatch(/FAQ/);
    // Q&A 형식
    expect(sys).toMatch(/Q\. /);
    // list/table 적극 권장
    expect(sys).toMatch(/적극 권장/);
    // keyword 밀도
    expect(sys).toMatch(/1~2%/);
  });

  it("user prompt 안 brief + primary + secondary + candidate publications 정합", () => {
    const user = buildArticleFullDraftUserPrompt({
      clinicName: "다이트한의원 부평점",
      categoryName: "다이어트 인사이트",
      primaryKeyword: "체질개선 다이어트",
      secondaryKeywords: ["사상체질", "한방 다이어트"],
      brief: "체질에 따른 한방 다이어트 접근법 1줄 소개",
      candidatePublications: [
        { id: "11111111-1111-1111-1111-111111111111", title: "사상체질 임상 연구", publicationType: "academic-society" },
        { id: "22222222-2222-2222-2222-222222222222", title: "한약 부작용 보고서", publicationType: "government" },
      ],
    });
    expect(user).toContain("다이트한의원 부평점");
    expect(user).toContain("다이어트 인사이트");
    expect(user).toContain('primary keyword: "체질개선 다이어트"');
    expect(user).toContain('"사상체질"');
    expect(user).toContain('"한방 다이어트"');
    expect(user).toContain("체질에 따른 한방 다이어트");
    expect(user).toContain("11111111-1111-1111-1111-111111111111");
    expect(user).toContain("사상체질 임상 연구");
    expect(user).toContain("academic-society");
  });

  it("user prompt — secondary 0개 시 '없음' 출력", () => {
    const user = buildArticleFullDraftUserPrompt({
      clinicName: "다이트한의원",
      primaryKeyword: "체질개선",
      secondaryKeywords: [],
      brief: "체질 분석 안내 1줄",
      candidatePublications: [],
    });
    expect(user).toContain("secondary keywords: 없음");
  });

  it("user prompt — publication 0개 시 candidate 안 '없음' 명시", () => {
    const user = buildArticleFullDraftUserPrompt({
      clinicName: "다이트한의원",
      primaryKeyword: "체질개선",
      secondaryKeywords: [],
      brief: "체질 분석 안내 1줄",
      candidatePublications: [],
    });
    expect(user).toContain("[candidate publications]");
    expect(user).toContain("없음");
  });

  it("output schema (v1.1) — title/summary/bodyMarkdown 길이 + recommendedPublicationIds uuid array max 5", () => {
    const valid = articleFullDraftOutputSchema.safeParse({
      title: "체질개선 다이어트의 한방 접근 안내",
      summary: "체질 분석을 통한 맞춤 다이어트 접근법을 한방의학 관점에서 정리한 칼럼입니다. 본 칼럼은 일반 정보 제공 목적이며 의학적 진단이나 치료를 대체하지 않습니다. 상세 상담은 의료진과 진행하세요.",
      bodyMarkdown: "체질에 따라 다이어트 접근이 달라질 수 있다.\n\n".repeat(60).slice(0, 1800),
      slug: "constitution-diet-guide",
      recommendedPublicationIds: [
        "11111111-1111-1111-1111-111111111111",
        "22222222-2222-2222-2222-222222222222",
      ],
    });
    expect(valid.success).toBe(true);
  });

  it("output schema — title 200 초과 reject", () => {
    const bad = articleFullDraftOutputSchema.safeParse({
      title: "x".repeat(201),
      summary: "y".repeat(100),
      bodyMarkdown: "z".repeat(1800),
      slug: "constitution-diet-guide",
      recommendedPublicationIds: [],
    });
    expect(bad.success).toBe(false);
  });

  it("output schema — summary 79자 reject (80자 minimum)", () => {
    const bad = articleFullDraftOutputSchema.safeParse({
      title: "유효한 제목",
      summary: "y".repeat(79),
      bodyMarkdown: "z".repeat(1800),
      slug: "constitution-diet-guide",
      recommendedPublicationIds: [],
    });
    expect(bad.success).toBe(false);
  });

  it("output schema (v1.1) — bodyMarkdown 1499자 reject (1500자 minimum)", () => {
    const bad = articleFullDraftOutputSchema.safeParse({
      title: "유효한 제목",
      summary: "y".repeat(100),
      bodyMarkdown: "z".repeat(1499),
      slug: "constitution-diet-guide",
      recommendedPublicationIds: [],
    });
    expect(bad.success).toBe(false);
  });

  it("output schema (v1.1) — bodyMarkdown 3001자 reject (3000자 max)", () => {
    const bad = articleFullDraftOutputSchema.safeParse({
      title: "유효한 제목",
      summary: "y".repeat(100),
      bodyMarkdown: "z".repeat(3001),
      slug: "constitution-diet-guide",
      recommendedPublicationIds: [],
    });
    expect(bad.success).toBe(false);
  });

  it("output schema — recommendedPublicationIds 6개 reject (5 max)", () => {
    const bad = articleFullDraftOutputSchema.safeParse({
      title: "유효한 제목",
      summary: "y".repeat(100),
      bodyMarkdown: "z".repeat(1800),
      slug: "constitution-diet-guide",
      recommendedPublicationIds: Array.from({ length: 6 }, (_, i) =>
        `${i}1111111-1111-1111-1111-111111111111`,
      ),
    });
    expect(bad.success).toBe(false);
  });

  it("output schema — recommendedPublicationIds 안 non-uuid reject", () => {
    const bad = articleFullDraftOutputSchema.safeParse({
      title: "유효한 제목",
      summary: "y".repeat(100),
      bodyMarkdown: "z".repeat(1800),
      slug: "constitution-diet-guide",
      recommendedPublicationIds: ["not-a-uuid"],
    });
    expect(bad.success).toBe(false);
  });

  it("output schema (v1.2) — slug 한글 reject (regex 위반)", () => {
    const bad = articleFullDraftOutputSchema.safeParse({
      title: "유효한 제목",
      summary: "y".repeat(100),
      bodyMarkdown: "z".repeat(1800),
      slug: "체질개선-다이어트",
      recommendedPublicationIds: [],
    });
    expect(bad.success).toBe(false);
  });

  it("output schema (v1.2) — slug 대문자 reject", () => {
    const bad = articleFullDraftOutputSchema.safeParse({
      title: "유효한 제목",
      summary: "y".repeat(100),
      bodyMarkdown: "z".repeat(1800),
      slug: "Constitution-Diet",
      recommendedPublicationIds: [],
    });
    expect(bad.success).toBe(false);
  });

  it("output schema (v1.2) — slug 누락 reject (required)", () => {
    const bad = articleFullDraftOutputSchema.safeParse({
      title: "유효한 제목",
      summary: "y".repeat(100),
      bodyMarkdown: "z".repeat(1800),
      recommendedPublicationIds: [],
    });
    expect(bad.success).toBe(false);
  });

  it("output schema — recommendedPublicationIds 빈 배열 OK (publication 0개 instance)", () => {
    const ok = articleFullDraftOutputSchema.safeParse({
      title: "유효한 제목",
      summary: "y".repeat(100),
      bodyMarkdown: "z".repeat(1800),
      slug: "constitution-diet-guide",
      recommendedPublicationIds: [],
    });
    expect(ok.success).toBe(true);
  });
});

describe("article brief draft prompt template (CONTENT_AI_DRAFT_PLAN v1.0 CAID-DEFER-16)", () => {
  it("system prompt 안 의료광고법 + JSON-only + 한국어 + brief 작성 원칙 표기", () => {
    const sys = buildArticleBriefDraftSystemPrompt();
    expect(sys).toMatch(/의료광고법/);
    expect(sys).toMatch(/제56조/);
    expect(sys).toMatch(/JSON only/);
    expect(sys).toMatch(/100% 한국어/);
    // 4 요소 패턴 명시
    expect(sys).toMatch(/주제/);
    expect(sys).toMatch(/논점/);
    expect(sys).toMatch(/결론/);
    // 50~200 길이 강제
    expect(sys).toMatch(/50~200/);
  });

  it("user prompt 안 primary + secondary keyword + category 정합", () => {
    const user = buildArticleBriefDraftUserPrompt({
      clinicName: "다이트한의원 부평점",
      categoryName: "다이어트 인사이트",
      primaryKeyword: "체질개선 다이어트",
      secondaryKeywords: ["사상체질", "한방 다이어트"],
    });
    expect(user).toContain("다이트한의원 부평점");
    expect(user).toContain("다이어트 인사이트");
    expect(user).toContain('primary keyword: "체질개선 다이어트"');
    expect(user).toContain('"사상체질"');
    expect(user).toContain('"한방 다이어트"');
    expect(user).toContain("50~200자");
  });

  it("user prompt — secondary 0개 시 '없음' 명시", () => {
    const user = buildArticleBriefDraftUserPrompt({
      clinicName: "다이트한의원",
      primaryKeyword: "체질개선",
      secondaryKeywords: [],
    });
    expect(user).toContain("secondary keywords: 없음");
  });

  it("output schema — brief 50~200자 정합", () => {
    const ok = articleBriefDraftOutputSchema.safeParse({
      brief: "사상체질에 따른 한방 다이어트 접근법 정리. 본 한의원의 체질 분석 진료 흐름 소개. 정보 제공 목적이며 진단/치료 대체 X.",
    });
    expect(ok.success).toBe(true);
  });

  it("output schema — brief 49자 reject (50자 minimum)", () => {
    const bad = articleBriefDraftOutputSchema.safeParse({ brief: "x".repeat(49) });
    expect(bad.success).toBe(false);
  });

  it("output schema — brief 201자 reject (200자 max)", () => {
    const bad = articleBriefDraftOutputSchema.safeParse({ brief: "x".repeat(201) });
    expect(bad.success).toBe(false);
  });

  it("output schema — brief field 미존재 reject", () => {
    const bad = articleBriefDraftOutputSchema.safeParse({});
    expect(bad.success).toBe(false);
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
