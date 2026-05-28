// @glitzy/web/lib/ai/__tests__/article-full-draft — CONTENT_AI_DRAFT_PLAN v1.0 § 7 task 2·6
// pure helper unit test: countH2 · validateLlmOutput · filterRecommendedIds.
// server action (generateArticleFullDraftAction) 안 tx 의존성 복잡 — e2e/integration 위임.

import { describe, it, expect } from "vitest";
import { countH2, validateLlmOutput, filterRecommendedIds } from "../article-full-draft-helpers";

describe("countH2", () => {
  it("H2 0개", () => {
    expect(countH2("plain text 입니다. 두 줄.\n둘째 줄.")).toBe(0);
  });

  it("H2 3개 — 표준 구조", () => {
    const md = `intro 문단.

## 첫 소제목
첫 내용.

## 둘째 소제목
둘째 내용.

## 셋째 소제목
셋째 내용.

conclusion.`;
    expect(countH2(md)).toBe(3);
  });

  it("H2 4개 — 권장 max", () => {
    const md = `intro.\n## 1\nx\n## 2\nx\n## 3\nx\n## 4\nx\nconclusion.`;
    expect(countH2(md)).toBe(4);
  });

  it("H3 (`### `) 는 H2 로 count 안 함", () => {
    const md = `intro.\n## 1\n### 1.1\n내용.\n## 2\n### 2.1\n내용.`;
    expect(countH2(md)).toBe(2);
  });

  it("H1 (`# `) 도 H2 로 count 안 함 (prompt 안 금지 됐지만 hallucinate 시 안전)", () => {
    const md = `# 잘못된 H1\n## 진짜 H2\n내용.`;
    expect(countH2(md)).toBe(1);
  });
});

describe("validateLlmOutput (v1.1 — 1500~2500자 long-form + H2 4~6 FAQ 강제)", () => {
  // 정보형 H2 3개 + FAQ H2 1개 = 4 H2, 약 1900자
  const baseValid = {
    title: "체질개선 다이어트 안내",
    summary: "체질 분석을 통한 맞춤 다이어트 접근법을 한방의학 관점에서 정리. 본 칼럼은 정보 제공 목적이며 진단/치료를 대체하지 않습니다. 의료진 상담 권장.",
    bodyMarkdown:
      "체질개선 다이어트란 사상체질에 따른 맞춤 한방 다이어트 접근법이다. 본 칼럼은 한방의학 관점에서 체질 분석과 맞춤 접근법을 정리한다.\n\n## 첫 번째 소제목 — 체질 분석 개요\n" +
      "체질에 따라 신체 반응이 다르게 나타납니다. 한방 진료 안 체질 분석은 진맥과 문진을 종합합니다.\n".repeat(9) +
      "\n## 두 번째 소제목 — 맞춤 식이\n" +
      "체질별로 권장 식재료가 달라질 수 있습니다. 본 칼럼은 의료적 진단을 대체하지 않습니다.\n".repeat(9) +
      "\n## 세 번째 소제목 — 운동 처방\n" +
      "체질에 맞는 운동은 효과적인 다이어트의 한 축입니다. 상세 처방은 의료진과 상담하세요.\n".repeat(9) +
      "\n## 자주 묻는 질문\n### Q. 체질개선 다이어트는 얼마나 걸리나요?\n개인 체질에 따라 다르며 의료진 상담을 통해 결정됩니다.\n",
    slug: "constitution-diet-guide",
    recommendedPublicationIds: [],
  };

  it("정상 입력 — ok", () => {
    const r = validateLlmOutput(baseValid);
    expect(r.ok).toBe(true);
  });

  it("title 201자 — reject", () => {
    const r = validateLlmOutput({ ...baseValid, title: "x".repeat(201) });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("title-too-long");
  });

  it("summary 79자 — reject (summary-out-of-range)", () => {
    const r = validateLlmOutput({ ...baseValid, summary: "y".repeat(79) });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("summary-out-of-range");
  });

  it("summary 201자 — reject", () => {
    const r = validateLlmOutput({ ...baseValid, summary: "y".repeat(201) });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("summary-out-of-range");
  });

  it("bodyMarkdown 1499자 — reject (body-out-of-range · 1500 minimum)", () => {
    const r = validateLlmOutput({ ...baseValid, bodyMarkdown: "z".repeat(1499) });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("body-out-of-range");
  });

  it("bodyMarkdown 3001자 — reject (3000 max)", () => {
    const r = validateLlmOutput({ ...baseValid, bodyMarkdown: "## a\n" + "z".repeat(2990) + "\n## b\n" + "z".repeat(10) });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("body-out-of-range");
  });

  it("H2 0개 — reject (h2-count-out-of-range · 4~6 강제)", () => {
    const r = validateLlmOutput({ ...baseValid, bodyMarkdown: "intro.\n" + "x".repeat(1800) });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("h2-count-out-of-range");
  });

  it("H2 3개 — reject (4 minimum · 정보형 3 + FAQ 1)", () => {
    const r = validateLlmOutput({
      ...baseValid,
      bodyMarkdown:
        "intro.\n## 1\n" + "내용.\n".repeat(130) + "## 2\n" + "내용.\n".repeat(130) + "## 3\n" + "내용.\n".repeat(130),
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("h2-count-out-of-range");
  });

  it("slug 한글 — reject (slug-invalid-format)", () => {
    const r = validateLlmOutput({ ...baseValid, slug: "체질개선-다이어트" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("slug-invalid-format");
  });

  it("slug 대문자 — reject", () => {
    const r = validateLlmOutput({ ...baseValid, slug: "Constitution-Diet" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("slug-invalid-format");
  });

  it("slug 2자 — reject (3자 minimum)", () => {
    const r = validateLlmOutput({ ...baseValid, slug: "ab" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("slug-invalid-format");
  });

  it("slug hyphen start — reject (첫 character a-z|0-9)", () => {
    const r = validateLlmOutput({ ...baseValid, slug: "-diet-guide" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("slug-invalid-format");
  });

  it("slug 숫자 시작 OK", () => {
    const r = validateLlmOutput({ ...baseValid, slug: "2025-diet-guide" });
    expect(r.ok).toBe(true);
  });

  it("H2 7개 — reject (6 max)", () => {
    const r = validateLlmOutput({
      ...baseValid,
      bodyMarkdown:
        "intro.\n" +
        "## 1\n내용.\n## 2\n내용.\n## 3\n내용.\n## 4\n내용.\n## 5\n내용.\n## 6\n내용.\n## 7\n내용.\n" +
        "x".repeat(1700),
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("h2-count-out-of-range");
  });
});

describe("filterRecommendedIds", () => {
  const candidates = [
    { id: "11111111-1111-1111-1111-111111111111", title: "a", summary: "s", publicationType: "external-authority" },
    { id: "22222222-2222-2222-2222-222222222222", title: "b", summary: "s", publicationType: "academic-society" },
  ];

  it("whitelist 안 모두 있음 — 그대로 통과", () => {
    const r = filterRecommendedIds(
      ["11111111-1111-1111-1111-111111111111", "22222222-2222-2222-2222-222222222222"],
      candidates,
    );
    expect(r).toEqual([
      "11111111-1111-1111-1111-111111111111",
      "22222222-2222-2222-2222-222222222222",
    ]);
  });

  it("hallucinate id 제거", () => {
    const r = filterRecommendedIds(
      [
        "11111111-1111-1111-1111-111111111111",
        "99999999-9999-9999-9999-999999999999", // hallucinate
      ],
      candidates,
    );
    expect(r).toEqual(["11111111-1111-1111-1111-111111111111"]);
  });

  it("candidate 0개 시점 — 모든 id 제거", () => {
    const r = filterRecommendedIds(
      ["11111111-1111-1111-1111-111111111111"],
      [],
    );
    expect(r).toEqual([]);
  });

  it("input 빈 배열 — 빈 배열 반환", () => {
    const r = filterRecommendedIds([], candidates);
    expect(r).toEqual([]);
  });
});
