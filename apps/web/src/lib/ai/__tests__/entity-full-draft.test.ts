// @glitzy/web/lib/ai/__tests__/entity-full-draft — CONTENT_AI_DRAFT_ENTITY_PLAN v1.0 § 4 (CAID-DEFER-02)
// page (treatment/condition) · faq full-draft output schema + server-side validator + prompt 강제 패턴.

import { describe, it, expect } from "vitest";
import {
  pageFullDraftOutputSchema,
  buildPageFullDraftSystemPrompt,
  buildPageFullDraftUserPrompt,
} from "../prompt-templates";
import { validatePageDraftOutput } from "../entity-draft-helpers";

/** H2 count 개 · 총 length 자 본문 생성 (intro 정의 문장 + H2 블록). */
function makeBody(h2count: number, length: number): string {
  let s = "비만 약침이란 한방에서 체중 관리를 돕는 시술이다.\n\n";
  for (let i = 0; i < h2count; i++) {
    s += `## 소제목 ${i}\n해당 항목의 핵심 설명 문장입니다.\n\n`;
  }
  while (s.length < length) s += "추가적인 설명 문장을 덧붙입니다. ";
  return s.slice(0, length);
}

const validPage = {
  title: "비만 약침 치료 안내",
  summary: "가".repeat(60),
  bodyMarkdown: makeBody(4, 1000),
  slug: "obesity-pharmacopuncture",
};

describe("pageFullDraftOutputSchema", () => {
  it("정상 입력 PASS", () => {
    expect(pageFullDraftOutputSchema.safeParse(validPage).success).toBe(true);
  });
  it("summary 50 미만 FAIL", () => {
    expect(pageFullDraftOutputSchema.safeParse({ ...validPage, summary: "가".repeat(40) }).success).toBe(false);
  });
  it("summary 160 초과 FAIL", () => {
    expect(pageFullDraftOutputSchema.safeParse({ ...validPage, summary: "가".repeat(170) }).success).toBe(false);
  });
  it("body 800 미만 FAIL", () => {
    expect(pageFullDraftOutputSchema.safeParse({ ...validPage, bodyMarkdown: makeBody(3, 700) }).success).toBe(false);
  });
  it("slug regex 위반 FAIL", () => {
    expect(pageFullDraftOutputSchema.safeParse({ ...validPage, slug: "Bad_Slug" }).success).toBe(false);
  });
});

describe("validatePageDraftOutput", () => {
  it("정상 ok", () => {
    expect(validatePageDraftOutput(validPage).ok).toBe(true);
  });
  it("summary 범위 밖 reject", () => {
    const r = validatePageDraftOutput({ ...validPage, summary: "가".repeat(40) });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("summary-out-of-range");
  });
  it("body 범위 밖 reject", () => {
    const r = validatePageDraftOutput({ ...validPage, bodyMarkdown: makeBody(3, 2600) });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("body-out-of-range");
  });
  it("H2 2개 (3 미만) reject", () => {
    const r = validatePageDraftOutput({ ...validPage, bodyMarkdown: makeBody(2, 1000) });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("h2-count-out-of-range");
  });
  it("H2 7개 (6 초과) reject", () => {
    const r = validatePageDraftOutput({ ...validPage, bodyMarkdown: makeBody(7, 1500) });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("h2-count-out-of-range");
  });
  it("slug 위반 reject", () => {
    const r = validatePageDraftOutput({ ...validPage, slug: "Bad Slug" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("slug-invalid-format");
  });
});

describe("buildPageFullDraftSystemPrompt — entityKind 분기 + 의료광고법 강화", () => {
  it("TreatmentPage 는 시술 페이지 추가 강제 포함", () => {
    const p = buildPageFullDraftSystemPrompt("TreatmentPage");
    expect(p).toContain("시술/진료");
    expect(p).toContain("환자 유인 표현");
    expect(p).toContain("가격·이벤트");
  });
  it("MedicalConditionPage 는 시술 가격 강제 미포함", () => {
    const p = buildPageFullDraftSystemPrompt("MedicalConditionPage");
    expect(p).toContain("증상/질환");
    expect(p).not.toContain("시술 가격·이벤트");
  });
  it("공통 — 의료법 제56조 + JSON only + 한국어 강제", () => {
    const p = buildPageFullDraftSystemPrompt("TreatmentPage");
    expect(p).toContain("제56조");
    expect(p).toContain("JSON only");
    expect(p).toContain("100% 한국어");
  });
  it("userPrompt — entityKind 라벨 + keyword + brief 포함", () => {
    const u = buildPageFullDraftUserPrompt({
      clinicName: "다이트한의원",
      entityKind: "TreatmentPage",
      primaryKeyword: "비만 약침",
      secondaryKeywords: ["부작용"],
      brief: "비만 약침의 원리와 주의사항 정리",
    });
    expect(u).toContain("다이트한의원");
    expect(u).toContain("시술/진료");
    expect(u).toContain("비만 약침");
    expect(u).toContain("부작용");
  });
});
