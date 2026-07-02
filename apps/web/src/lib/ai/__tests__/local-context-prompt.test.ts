// AI Full Draft 지역 문맥 자동 주입 — clinic.metadata.localKeywords → user prompt 라인
// 목표: 운영자가 키워드에 지역명을 안 넣어도 초안에 지역 시그널(부평·인천)이 실린다.

import { describe, it, expect } from "vitest";
import { buildArticleFullDraftUserPrompt } from "../prompt-templates";

const BASE = {
  clinicName: "다이트한의원 부평점",
  primaryKeyword: "다이어트 한약",
  secondaryKeywords: [],
  brief: "다이어트 한약의 원리와 주의사항을 일반 정보 제공 목적으로 정리하는 칼럼입니다.",
  candidatePublications: [],
};

describe("buildArticleFullDraftUserPrompt 지역 문맥 주입", () => {
  it("localKeywords 있으면 지역 문맥 라인 포함", () => {
    const prompt = buildArticleFullDraftUserPrompt({
      ...BASE,
      localKeywords: ["부평 다이어트 한의원", "인천 부평 다이어트 한약"],
    });
    expect(prompt).toContain("지역 문맥");
    expect(prompt).toContain("부평 다이어트 한의원");
    expect(prompt).toContain("과다 반복 금지");
  });

  it("localKeywords 미지정/빈 배열이면 지역 문맥 라인 없음", () => {
    expect(buildArticleFullDraftUserPrompt(BASE)).not.toContain("지역 문맥");
    expect(buildArticleFullDraftUserPrompt({ ...BASE, localKeywords: [] })).not.toContain("지역 문맥");
  });
});
