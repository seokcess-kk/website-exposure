// internal-linkify — AI 초안 본문 첫-언급 내부링크 삽입 규칙 고정.
// scripts/insert-body-internal-links.ts 배치 로직의 제품 경로 이식판 (2026-07-08).

import { describe, it, expect } from "vitest";

import { linkifyFirstMentions, type InternalLinkTerm } from "./internal-linkify";

const TERMS: InternalLinkTerm[] = [
  { term: "굿바이 다이어트", url: "/demo/treatments/goodbye-diet" },
  { term: "다이어트 한약", url: "/demo/treatments/herbal-medicine" },
  { term: "다이어트한의원", url: "/demo" },
];

describe("linkifyFirstMentions", () => {
  it("첫 언급만 링크화 — 같은 용어 재등장은 그대로", () => {
    const body = "굿바이 다이어트는 시그니처입니다.\n\n굿바이 다이어트를 다시 언급합니다.";
    const r = linkifyFirstMentions(body, TERMS);
    expect(r.body).toContain("[굿바이 다이어트](/demo/treatments/goodbye-diet)는 시그니처입니다.");
    expect(r.body).toContain("굿바이 다이어트를 다시 언급합니다.");
    expect(r.added).toHaveLength(1);
  });

  it("한글 경계 가드 — 직전 문자가 한글이면 부분매칭 스킵 후 유효 위치 탐색", () => {
    const body = "부평다이어트한의원 이야기.\n\n다이어트한의원을 고르는 기준.";
    const r = linkifyFirstMentions(body, TERMS);
    expect(r.body).toContain("부평다이어트한의원 이야기."); // 부분매칭 안 됨
    expect(r.body).toContain("[다이어트한의원](/demo)을 고르는 기준.");
  });

  it("헤딩·인용·표·코드펜스·기존 링크 라인은 제외", () => {
    const body = [
      "## 굿바이 다이어트 개요",
      "> 굿바이 다이어트 인용",
      "| 굿바이 다이어트 | 표 |",
      "```",
      "굿바이 다이어트 코드",
      "```",
      "[기존](/demo/x) 굿바이 다이어트 링크 라인",
    ].join("\n");
    const r = linkifyFirstMentions(body, TERMS);
    expect(r.added).toHaveLength(0);
    expect(r.body).toBe(body);
  });

  it("긴 용어 우선 + 라인당 1링크 + maxLinks 상한", () => {
    const body = "다이어트 한약을 소개합니다.\n\n다이어트한의원 선택 기준과 굿바이 다이어트 안내.";
    const r = linkifyFirstMentions(body, TERMS, { maxLinks: 2 });
    // 길이 내림차순: 굿바이 다이어트(3행) → 다이어트 한약(1행). 다이어트한의원은 3행이
    // 이미 링크를 가져 제외 + maxLinks 도달.
    expect(r.added.map((a) => a.term)).toEqual(["굿바이 다이어트", "다이어트 한약"]);
    expect(r.body).toContain("[다이어트 한약](/demo/treatments/herbal-medicine)을 소개합니다.");
    expect(r.body).toContain("다이어트한의원 선택 기준과 [굿바이 다이어트](/demo/treatments/goodbye-diet) 안내.");
  });

  it("selfUrl 은 링크 대상에서 제외", () => {
    const body = "굿바이 다이어트를 소개합니다.";
    const r = linkifyFirstMentions(body, TERMS, { selfUrl: "/demo/treatments/goodbye-diet" });
    expect(r.added).toHaveLength(0);
  });
});
