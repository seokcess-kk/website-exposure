// PUBLIC_SITE_RENDER_PLAN v1.0 § 7 시나리오 LOCAL_PASS — businessHours strict narrowing
// 시나리오 #22 round-trip + cycle 1 PSRC-11

import { describe, it, expect } from "vitest";
import { normalizeLocation, parseNaverPlace, type LocationProfileRow } from "./db-projection";

const BASE_ROW: LocationProfileRow = {
  slug: "main",
  name: "본원",
  street_address: "테스트로 1",
  address_locality: "강남구",
  address_region: "서울특별시",
  postal_code: "06000",
  address_country: "KR",
  latitude: null,
  longitude: null,
  phone: "02-1234-5678",
  email: null,
  metadata: {},
  updated_at: new Date(),
};

describe("businessHours strict narrowing", () => {
  it("정상 CT-02 SoT 형식은 그대로 통과", () => {
    const row: LocationProfileRow = {
      ...BASE_ROW,
      metadata: {
        businessHours: {
          openingHours: [{ dayOfWeek: ["Monday"], opens: "09:30", closes: "18:30" }],
          lunchBreaks: [{ dayOfWeek: ["Monday"], from: "13:00", to: "14:00" }],
          receptionHours: [],
          specialClosures: [],
        },
      },
    };
    const proj = normalizeLocation(row);
    expect(proj.businessHours.openingHours).toHaveLength(1);
    expect(proj.businessHours.openingHours[0]).toMatchObject({
      dayOfWeek: ["Monday"], opens: "09:30", closes: "18:30",
    });
    expect(proj.businessHours.lunchBreaks).toHaveLength(1);
  });

  it("잘못된 opens 형식 (HH:mm 아닌) 은 filter out", () => {
    const row: LocationProfileRow = {
      ...BASE_ROW,
      metadata: {
        businessHours: {
          openingHours: [
            { dayOfWeek: ["Monday"], opens: "9:30", closes: "18:30" }, // invalid: not zero-padded
            { dayOfWeek: ["Tuesday"], opens: "09:30", closes: "18:30" }, // valid
          ],
          lunchBreaks: [],
          receptionHours: [],
          specialClosures: [],
        },
      },
    };
    const proj = normalizeLocation(row);
    expect(proj.businessHours.openingHours).toHaveLength(1);
    expect(proj.businessHours.openingHours[0]!.dayOfWeek).toEqual(["Tuesday"]);
  });

  it("lunchBreaks 의 from/to 필드 누락 시 filter out", () => {
    const row: LocationProfileRow = {
      ...BASE_ROW,
      metadata: {
        businessHours: {
          openingHours: [],
          lunchBreaks: [
            { dayOfWeek: ["Monday"], from: "13:00" }, // invalid: missing to
            { dayOfWeek: ["Tuesday"], from: "13:00", to: "14:00" }, // valid
          ],
          receptionHours: [],
          specialClosures: [],
        },
      },
    };
    const proj = normalizeLocation(row);
    expect(proj.businessHours.lunchBreaks).toHaveLength(1);
  });

  it("specialClosures date 가 ISO date 형식 아니면 filter out", () => {
    const row: LocationProfileRow = {
      ...BASE_ROW,
      metadata: {
        businessHours: {
          openingHours: [],
          lunchBreaks: [],
          receptionHours: [],
          specialClosures: [
            { date: "2026-12-25" },
            { date: "12/25" }, // invalid
            { date: "2026-12-26", reason: "임시휴진" },
          ],
        },
      },
    };
    const proj = normalizeLocation(row);
    expect(proj.businessHours.specialClosures).toHaveLength(2);
    expect(proj.businessHours.specialClosures[0]!.date).toBe("2026-12-25");
    expect(proj.businessHours.specialClosures[1]).toMatchObject({ date: "2026-12-26", reason: "임시휴진" });
  });

  it("metadata 가 null/undefined 면 빈 businessHours 반환", () => {
    const row: LocationProfileRow = { ...BASE_ROW, metadata: null };
    const proj = normalizeLocation(row);
    expect(proj.businessHours.openingHours).toEqual([]);
    expect(proj.businessHours.lunchBreaks).toEqual([]);
  });
});

// NAVER_PLACE_PLAN v1.0 § 7 — parseNaverPlace silent fallback 시나리오
describe("parseNaverPlace", () => {
  it("정상 placeId + map.naver.com URL → 통과", () => {
    expect(parseNaverPlace({
      placeId: "1234567890",
      placeUrl: "https://map.naver.com/v5/entry/place/1234567890",
    })).toEqual({
      placeId: "1234567890",
      placeUrl: "https://map.naver.com/v5/entry/place/1234567890",
    });
  });

  it("pcmap.place.naver.com host 통과 (cycle 1 #3)", () => {
    expect(parseNaverPlace({
      placeId: "987654",
      placeUrl: "https://pcmap.place.naver.com/place/987654",
    })?.placeUrl).toBe("https://pcmap.place.naver.com/place/987654");
  });

  it("naver.me 단축 URL 통과", () => {
    expect(parseNaverPlace({
      placeId: "123456",
      placeUrl: "https://naver.me/xY3aBc",
    })?.placeId).toBe("123456");
  });

  it("placeId 영문 → null (regex fail)", () => {
    expect(parseNaverPlace({ placeId: "abc123", placeUrl: "https://map.naver.com/x" })).toBeNull();
  });

  it("placeId 너무 짧음 (5자) → null", () => {
    expect(parseNaverPlace({ placeId: "12345", placeUrl: "https://map.naver.com/x" })).toBeNull();
  });

  it("외부 host (example.com) → null", () => {
    expect(parseNaverPlace({
      placeId: "1234567890",
      placeUrl: "https://example.com/place/1234567890",
    })).toBeNull();
  });

  it("placeUrl 형식 자체 invalid → null", () => {
    expect(parseNaverPlace({ placeId: "1234567890", placeUrl: "not-a-url" })).toBeNull();
  });

  it("placeId 누락 → null", () => {
    expect(parseNaverPlace({ placeUrl: "https://map.naver.com/v5/entry/place/1" })).toBeNull();
  });

  it("placeUrl 누락 → null", () => {
    expect(parseNaverPlace({ placeId: "1234567890" })).toBeNull();
  });

  it("null/undefined/문자열 input → null", () => {
    expect(parseNaverPlace(null)).toBeNull();
    expect(parseNaverPlace(undefined)).toBeNull();
    expect(parseNaverPlace("string")).toBeNull();
  });
});
