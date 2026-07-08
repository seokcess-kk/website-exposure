// publish-auto-link — 발행 시 키워드 자동 연결의 제목 포함 판정 고정.
// 제목에 없는 라벨을 primary 로 연결하면 title check 가 warn→fail 로 감점되므로
// "실제 포함된 것만·가장 긴 것" 규칙이 불변식이다 (2026-07-08 readiness uplift 교훈).

import { describe, it, expect } from "vitest";

import { pickLongestContainedLabel } from "./publish-auto-link";

describe("pickLongestContainedLabel", () => {
  it("제목에 포함된 라벨 중 가장 긴 것을 고른다", () => {
    const title = "부평다이어트한의원, 2026년 체중 관리 전략";
    expect(
      pickLongestContainedLabel(title, ["다이어트한의원", "부평다이어트한의원", "한의원"]),
    ).toBe("부평다이어트한의원");
  });

  it("포함된 라벨이 없으면 null — 억지 연결 금지", () => {
    expect(pickLongestContainedLabel("사상체질 이야기", ["부평다이어트한의원", "굿바이 다이어트"])).toBeNull();
  });

  it("공백 라벨·빈 라벨은 무시", () => {
    expect(pickLongestContainedLabel("체중 관리", ["", "  "])).toBeNull();
  });
});
