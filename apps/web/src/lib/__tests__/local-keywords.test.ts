import { describe, expect, it } from "vitest";
import { extractLocalModifier } from "../local-keywords";

describe("extractLocalModifier", () => {
  it("extracts a spaced locality", () => {
    expect(extractLocalModifier(["부평 다이어트 한의원"])).toBe("부평");
  });

  it("extracts a locality from a compact exact-match keyword", () => {
    expect(extractLocalModifier(["인천다이어트한의원"])).toBe("인천");
    expect(extractLocalModifier(["대전다이어트한의원"])).toBe("대전");
  });

  it("rejects a non-local long token", () => {
    expect(extractLocalModifier(["전국적인개인맞춤체중관리"])).toBeNull();
  });
});
