// @glitzy/web/components/forms/ClinicMetadataEditor.test — serde round-trip + wipe-safety
// 핵심 회귀 가드: 어드민에서 의원정보 저장 시 metadata 의 localKeywords/naverPlace 가 소실되지 않는다.

import { describe, expect, it } from "vitest";

import { __clinicMetadataSerde } from "./ClinicMetadataEditor";

const { parseInitial, serialize, computeNaverPlaceWarning } = __clinicMetadataSerde;

describe("ClinicMetadataEditor serde — localKeywords / naverPlace wipe-safety", () => {
  it("기존 localKeywords + naverPlace 만 있는 metadata 를 round-trip 보존한다 (저장 시 wipe 방지)", () => {
    const raw = JSON.stringify({
      localKeywords: ["부평 다이어트 한의원", "인천 한방 비만"],
      naverPlace: { placeId: "1234567890", placeUrl: "https://map.naver.com/p/entry/place/1234567890" },
    });
    const state = parseInitial(raw);
    expect(state.localKeywords).toEqual(["부평 다이어트 한의원", "인천 한방 비만"]);
    expect(state.naverPlace).toEqual({ placeId: "1234567890", placeUrl: "https://map.naver.com/p/entry/place/1234567890" });

    const out = JSON.parse(serialize(state)) as Record<string, unknown>;
    expect(out.localKeywords).toEqual(["부평 다이어트 한의원", "인천 한방 비만"]);
    expect(out.naverPlace).toEqual({ placeId: "1234567890", placeUrl: "https://map.naver.com/p/entry/place/1234567890" });
  });

  it("5 페이지 컨텐츠 키와 지역 SEO 키가 공존해도 모두 보존한다", () => {
    const raw = JSON.stringify({
      treatmentPillars: [{ slug: "diet-treatment", icon: "mdi:x", title: "다이어트 치료", subtitle: "굿바이" }],
      localKeywords: ["부평"],
      naverPlace: { placeId: "999999", placeUrl: "https://naver.me/abcd" },
    });
    const out = JSON.parse(serialize(parseInitial(raw))) as Record<string, unknown>;
    expect((out.treatmentPillars as unknown[]).length).toBe(1);
    expect(out.localKeywords).toEqual(["부평"]);
    expect(out.naverPlace).toEqual({ placeId: "999999", placeUrl: "https://naver.me/abcd" });
  });

  it("빈 문자열 localKeywords 항목은 직렬화에서 제거된다", () => {
    const raw = JSON.stringify({ localKeywords: ["부평", "  ", ""] });
    const out = JSON.parse(serialize(parseInitial(raw))) as Record<string, unknown>;
    expect(out.localKeywords).toEqual(["부평"]);
  });

  it("naverPlace 는 placeId·placeUrl 둘 다 있을 때만 출력한다 (한쪽만이면 생략)", () => {
    // placeId 만 있고 다른 컨텐츠가 없으면 hasNaverPlace=false → 전체가 빈 string.
    expect(serialize(parseInitial(JSON.stringify({ naverPlace: { placeId: "123456", placeUrl: "" } })))).toBe("");
    // 다른 컨텐츠(localKeywords)가 있으면 출력되지만 naverPlace 키는 생략된다.
    const out = JSON.parse(
      serialize(parseInitial(JSON.stringify({ localKeywords: ["부평"], naverPlace: { placeId: "123456", placeUrl: "" } }))),
    ) as Record<string, unknown>;
    expect(out.localKeywords).toEqual(["부평"]);
    expect(out.naverPlace).toBeUndefined();
  });

  it("아무 키도 없으면 빈 string (server action fallback)", () => {
    expect(serialize(parseInitial("{}"))).toBe("");
    expect(serialize(parseInitial(""))).toBe("");
  });
});

describe("computeNaverPlaceWarning — db-projection.parseNaverPlace 정합 사전 경고", () => {
  it("둘 다 비면 경고 없음", () => {
    expect(computeNaverPlaceWarning("", "")).toBeNull();
  });

  it("한쪽만 입력 시 안내", () => {
    expect(computeNaverPlaceWarning("123456", "")).toMatch(/모두 입력/);
    expect(computeNaverPlaceWarning("", "https://naver.me/x")).toMatch(/모두 입력/);
  });

  it("placeId 형식 위반 경고", () => {
    expect(computeNaverPlaceWarning("12345", "https://naver.me/x")).toMatch(/placeId/);
    expect(computeNaverPlaceWarning("abc", "https://naver.me/x")).toMatch(/placeId/);
  });

  it("placeUrl 호스트 화이트리스트 위반 경고", () => {
    expect(computeNaverPlaceWarning("1234567", "https://evil.example.com/x")).toMatch(/호스트/);
  });

  it("유효한 placeId + 허용 호스트면 경고 없음", () => {
    expect(computeNaverPlaceWarning("1234567890", "https://map.naver.com/p/entry/place/1234567890")).toBeNull();
    expect(computeNaverPlaceWarning("123456", "https://pcmap.place.naver.com/place/123456")).toBeNull();
  });
});
