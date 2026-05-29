// @glitzy/web/lib/__tests__/slugify — SLUG_AUTOGEN_PLAN v0.3 § 8.1

import { describe, expect, it } from "vitest";

import { slugify } from "@/lib/slugify";

const SHORT = { maxLength: 64, fallbackPrefix: "doctor" } as const;
const LONG = { maxLength: 99, fallbackPrefix: "article" } as const;
const SLUG_REGEX_LONG = /^[a-z0-9][a-z0-9-]{2,99}$/;
const SLUG_REGEX_SHORT = /^[a-z0-9][a-z0-9-]{2,63}$/;

describe("slugify", () => {
  // SLG-01: 한글 → 로마자 변환 (revised romanization)
  it("SLG-01: 한글 입력 — slug regex 통과 + 영문/숫자/하이픈만", () => {
    const result = slugify("강남미용외과", SHORT);
    expect(SLUG_REGEX_SHORT.test(result)).toBe(true);
    expect(result).toMatch(/^[a-z]/); // 한글이 영문으로 변환됨
  });

  // SLG-02: 한글 포함 (숫자 섞여도) → fallback
  // slugify.ts 가 한글 포함 시 의미 없는 romanization 대신 fallback prefix + nanoid 반환
  // (2026-05-20 사용자 검수 결정 · df183af). 선행 "2024" 도 보존하지 않음 — 운영자가 영문 키워드 직접 입력 유도.
  it("SLG-02: 한글+숫자 mixed — 한글 포함 시 fallback (romanization 회피)", () => {
    const result = slugify("2024년 보톡스 효과 연구", LONG);
    expect(result).toMatch(/^article-[a-z0-9]{8}$/);
  });

  // SLG-03: 빈/공백 입력 → fallback
  it("SLG-03: 공백만 입력 → fallback prefix + nanoid", () => {
    const result = slugify("   ", LONG);
    expect(result).toMatch(/^article-[a-z0-9]{8}$/);
  });

  // SLG-04: 특수문자만 입력 → fallback
  it("SLG-04: 특수문자만 입력 → fallback", () => {
    const result = slugify("!!!@@@", LONG);
    expect(result).toMatch(/^article-[a-z0-9]{8}$/);
  });

  // SLG-05: 매우 긴 입력 — 길이 cap (suffix 여유 4자)
  it("SLG-05: 300자 입력 — 길이 ≤ maxLength - 4", () => {
    const longInput = "보톡스".repeat(100); // 300자 한글
    const result = slugify(longInput, LONG);
    expect(result.length).toBeLessThanOrEqual(LONG.maxLength - 4);
    expect(SLUG_REGEX_LONG.test(result)).toBe(true);
  });

  // SLG-06: 공백 포함 — 하이픈으로 변환
  it("SLG-06: 공백 포함 영문 — 하이픈으로 변환", () => {
    const result = slugify("hello world", SHORT);
    expect(result).toBe("hello-world");
  });

  // SLG-07: 양끝 하이픈 제거
  it("SLG-07: 양끝 하이픈 제거", () => {
    const result = slugify("---abc---", SHORT);
    expect(result).toBe("abc");
  });

  // SLG-08: 연속 하이픈 collapse
  it("SLG-08: 연속 하이픈 1개로 collapse", () => {
    const result = slugify("abc---def", SHORT);
    expect(result).toBe("abc-def");
  });

  // SLG-09: 숫자 첫글자 OK (regex `^[a-z0-9]` 통과)
  it("SLG-09: 숫자 첫글자 입력 — 그대로 통과", () => {
    const result = slugify("123 hello", SHORT);
    expect(result).toBe("123-hello");
  });

  // SLG-10: property-based — 100 random 한글 입력 모두 regex 통과
  it("SLG-10: 100개 random 한글 입력 — 모두 SLUG_REGEX 통과", () => {
    const syllables = ["가", "나", "다", "라", "마", "바", "사", "강", "남", "미", "용", "외", "과", "보", "톡", "효"];
    for (let i = 0; i < 100; i++) {
      const len = 1 + Math.floor(Math.random() * 50);
      const input = Array.from({ length: len }, () => syllables[Math.floor(Math.random() * syllables.length)]).join("");
      const result = slugify(input, LONG);
      expect(SLUG_REGEX_LONG.test(result), `input="${input}" result="${result}"`).toBe(true);
    }
  });

  // SLG-11: 결과 길이 ≥ 3 (fallback 작동) — `ab` 같은 짧은 입력
  it("SLG-11: 2자 미만 결과 → fallback", () => {
    const result = slugify("ab", LONG);
    expect(result).toMatch(/^article-[a-z0-9]{8}$/);
  });
});
