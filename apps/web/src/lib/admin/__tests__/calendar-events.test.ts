// @glitzy/web/lib/admin/__tests__/calendar-events — CONTENT_CALENDAR_PLAN v1.0 task #5
// pure helper 단위 검증: parseMonth · monthGridRange · formatKstDate · KST 자정 경계.

import { describe, it, expect } from "vitest";

import {
  formatKstDate,
  parseMonth,
  monthGridRange,
} from "../calendar-events";

describe("formatKstDate (KST date slice)", () => {
  it("UTC 03:00 KST 정오 → 같은 일자", () => {
    const d = new Date("2026-05-26T03:00:00Z");
    expect(formatKstDate(d)).toBe("2026-05-26");
  });

  it("KST 자정 직전 (UTC 14:59) → 같은 일자 5/26", () => {
    const d = new Date("2026-05-26T14:59:00Z");
    expect(formatKstDate(d)).toBe("2026-05-26");
  });

  it("KST 자정 (UTC 15:00) → 다음 일자 5/27 (cycle 3 #30)", () => {
    const d = new Date("2026-05-26T15:00:00Z");
    expect(formatKstDate(d)).toBe("2026-05-27");
  });
});

describe("parseMonth", () => {
  it("valid YYYY-MM 그대로 반환", () => {
    expect(parseMonth("2026-05")).toBe("2026-05");
    expect(parseMonth("2026-12")).toBe("2026-12");
    expect(parseMonth("1999-01")).toBe("1999-01");
  });

  it("invalid → KST 이번 달 fallback", () => {
    const result = parseMonth("invalid");
    expect(/^\d{4}-\d{2}$/.test(result)).toBe(true);
  });

  it("월 13 → fallback (regex 거부)", () => {
    const result = parseMonth("2026-13");
    expect(/^\d{4}-(0[1-9]|1[0-2])$/.test(result)).toBe(true);
    // 본 cycle 안 KST 이번 달 fallback — 정확 값은 환경 의존 (그러나 regex pass)
  });

  it("undefined → fallback", () => {
    const result = parseMonth(undefined);
    expect(/^\d{4}-(0[1-9]|1[0-2])$/.test(result)).toBe(true);
  });

  it("string[] → 첫 element 사용", () => {
    expect(parseMonth(["2026-03"])).toBe("2026-03");
  });
});

describe("monthGridRange (일요일 시작 padding · cycle 1 #11)", () => {
  it("2026-05 — 5월 1일 = 금요일 → 첫 주 시작 = 4월 26일 일요일", () => {
    const { startDate, endDate } = monthGridRange("2026-05");
    expect(startDate).toBe("2026-04-26");
    // 5월 31일 = 일요일 → 마지막 주 끝 = 6월 6일 토요일
    expect(endDate).toBe("2026-06-06");
  });

  it("2026-02 — 2월 1일 = 일요일 → 그 날 자체 첫 주 시작", () => {
    const { startDate, endDate } = monthGridRange("2026-02");
    expect(startDate).toBe("2026-02-01");
    // 2월 28일 = 토요일 → 그 날 자체 마지막 주 끝
    expect(endDate).toBe("2026-02-28");
  });

  it("2026-01 — 1월 1일 = 목요일 → 12월 28일 일요일 시작", () => {
    const { startDate, endDate } = monthGridRange("2026-01");
    expect(startDate).toBe("2025-12-28");
    expect(endDate).toBe("2026-01-31");  // 1월 31일 = 토요일
  });

  it("range 안 항상 7 의 배수 일수 (7×6 grid 정합)", () => {
    const { startDate, endDate } = monthGridRange("2026-05");
    const start = new Date(`${startDate}T00:00:00Z`);
    const end = new Date(`${endDate}T00:00:00Z`);
    const days = (end.getTime() - start.getTime()) / 86_400_000 + 1;
    expect(days % 7).toBe(0);
  });
});
