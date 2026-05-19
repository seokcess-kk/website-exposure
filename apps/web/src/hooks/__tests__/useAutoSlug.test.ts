// @glitzy/web/hooks/__tests__/useAutoSlug — SLUG_AUTOGEN_PLAN v0.3 § 8.3
// hook 자체의 wiring (useRef·useEffect) 은 vitest node 환경에서 직접 테스트 불가.
// pure 함수 computeAutoSlugUpdate 를 단위 테스트.

import { describe, expect, it } from "vitest";

import { computeAutoSlugUpdate } from "@/hooks/useAutoSlug";

const OPTIONS = { maxLength: 99 as const, fallbackPrefix: "article" };

describe("computeAutoSlugUpdate", () => {
  // HK-01: pristine=true + source 변경 → slug 채움
  it("HK-01: pristine + source 변경 → slugify 결과 반환", () => {
    const result = computeAutoSlugUpdate({
      source: "hello world",
      lastSource: "",
      pristine: true,
      options: OPTIONS,
    });
    expect(result).toEqual({ next: "hello-world" });
  });

  // HK-02: pristine=false → null (수동 편집 후 source 변경 무시)
  it("HK-02: pristine=false → null (slug 안 채움)", () => {
    const result = computeAutoSlugUpdate({
      source: "hello world",
      lastSource: "",
      pristine: false,
      options: OPTIONS,
    });
    expect(result).toBeNull();
  });

  // HK-03: source 변화 없음 → null
  it("HK-03: source === lastSource → null (변화 없음)", () => {
    const result = computeAutoSlugUpdate({
      source: "hello",
      lastSource: "hello",
      pristine: true,
      options: OPTIONS,
    });
    expect(result).toBeNull();
  });

  // HK-04: source 가 빈 문자열 → slug 도 빈 문자열
  it("HK-04: source 빈 문자열 → next: ''", () => {
    const result = computeAutoSlugUpdate({
      source: "",
      lastSource: "previous",
      pristine: true,
      options: OPTIONS,
    });
    expect(result).toEqual({ next: "" });
  });

  // HK-05: source 가 공백만 → slug 도 빈 문자열 (slugify fallback 발동 안 함)
  it("HK-05: source 공백만 → next: '' (fallback 미발동)", () => {
    const result = computeAutoSlugUpdate({
      source: "   ",
      lastSource: "previous",
      pristine: true,
      options: OPTIONS,
    });
    expect(result).toEqual({ next: "" });
  });
});
