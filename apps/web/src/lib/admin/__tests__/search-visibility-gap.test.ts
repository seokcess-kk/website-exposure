// @glitzy/web/lib/admin/__tests__/search-visibility-gap — NSI-DEFER-07
// classifyGap pure function 분기 + loadVisibilityGap mock tx 안 합산 정합.

import { describe, it, expect, vi } from "vitest";
import type { TransactionSql } from "postgres";

import { classifyGap, loadVisibilityGap, normalizeQueryKey } from "../search-visibility-gap";

type Row = Record<string, unknown>;

function makeTx(responses: ReadonlyArray<ReadonlyArray<Row>>): TransactionSql {
  let i = 0;
  const fn = vi.fn((..._args: unknown[]) => {
    const next = responses[i] ?? [];
    i += 1;
    return Promise.resolve(next as any);
  });
  return fn as unknown as TransactionSql;
}

const INSTANCE = "00000000-0000-0000-0000-000000000001";

describe("classifyGap", () => {
  it("google 노출 + naver 0 = google-only", () => {
    expect(classifyGap(100, 0)).toBe("google-only");
  });

  it("naver 노출 + google 0 = naver-only", () => {
    expect(classifyGap(0, 50)).toBe("naver-only");
  });

  it("양쪽 모두 노출 = both", () => {
    expect(classifyGap(30, 20)).toBe("both");
  });

  it("0 / 0 = naver-only (fallthrough · loadVisibilityGap 안 totalImpressions filter 안 걸러짐)", () => {
    // pure 함수 안 fallthrough — caller 가 0 row 사전 제외 책임 (loadVisibilityGap 안 filter)
    expect(classifyGap(0, 0)).toBe("naver-only");
  });
});

describe("normalizeQueryKey", () => {
  it("띄어쓰기 제거 — 한글 검색어 변형 병합", () => {
    expect(normalizeQueryKey("다이어트 한의원")).toBe(normalizeQueryKey("다이어트한의원"));
  });
  it("대소문자 — lowercase 정규화", () => {
    expect(normalizeQueryKey("Diet Clinic")).toBe(normalizeQueryKey("diet  clinic"));
  });
  it("앞뒤 공백 trim 효과 (공백 전부 제거)", () => {
    expect(normalizeQueryKey("  체형관리  ")).toBe("체형관리");
  });
});

describe("loadVisibilityGap", () => {
  it("snapshot 0 row — null 반환", async () => {
    const tx = makeTx([[{ max_date: null }]]);
    const out = await loadVisibilityGap(tx, INSTANCE);
    expect(out).toBeNull();
  });

  it("query gap — 3 분류 정합", async () => {
    const maxDate = new Date("2026-05-27T00:00:00Z");
    const tx = makeTx([
      // 1st query — MAX(snapshot_date)
      [{ max_date: maxDate }],
      // 2nd query — query rows
      [
        { query: "체질개선", source: "google-search-console", impressions: "100", clicks: "10" },
        { query: "체질개선", source: "naver-searchadvisor", impressions: "50", clicks: "5" },
        { query: "다이어트", source: "google-search-console", impressions: "200", clicks: "20" },
        { query: "굿바이", source: "naver-searchadvisor", impressions: "80", clicks: "8" },
      ],
    ]);
    const out = await loadVisibilityGap(tx, INSTANCE, { days: 7, topLimit: 10 });
    expect(out).not.toBeNull();
    expect(out!.queryCounts).toEqual({ "google-only": 1, "naver-only": 1, both: 1 });
    expect(out!.topQueries).toHaveLength(3);
    expect(out!.topQueries[0]?.query).toBe("다이어트"); // 200 imp · 가장 큼
    expect(out!.topQueries[0]?.bucket).toBe("google-only");
    expect(out!.topQueries.find((r) => r.query === "체질개선")?.bucket).toBe("both");
    expect(out!.topQueries.find((r) => r.query === "굿바이")?.bucket).toBe("naver-only");
  });

  it("query 정규화 — 띄어쓰기/대소문자 차이를 같은 키워드로 병합 (both)", async () => {
    const maxDate = new Date("2026-05-27T00:00:00Z");
    const tx = makeTx([
      [{ max_date: maxDate }],
      [
        // GSC 는 띄어쓰기 포함 · NSA 는 붙여쓰기 — 원래라면 *-only 2건으로 과소계상.
        { query: "다이어트 한의원", source: "google-search-console", impressions: "100", clicks: "10" },
        { query: "다이어트한의원", source: "naver-searchadvisor", impressions: "40", clicks: "4" },
      ],
    ]);
    const out = await loadVisibilityGap(tx, INSTANCE);
    expect(out!.topQueries).toHaveLength(1); // 병합되어 1건
    expect(out!.queryCounts).toEqual({ "google-only": 0, "naver-only": 0, both: 1 });
    const row = out!.topQueries[0];
    expect(row?.bucket).toBe("both");
    expect(row?.googleImpressions).toBe(100);
    expect(row?.naverImpressions).toBe(40);
    expect(row?.query).toBe("다이어트 한의원"); // 표시는 first-seen 원본 보존
  });

  it("topLimit 적용 — 5 query 안 topLimit=3 시 3개만", async () => {
    const maxDate = new Date("2026-05-27T00:00:00Z");
    const tx = makeTx([
      [{ max_date: maxDate }],
      [
        { query: "q1", source: "google-search-console", impressions: "100", clicks: "10" },
        { query: "q2", source: "google-search-console", impressions: "90", clicks: "9" },
        { query: "q3", source: "google-search-console", impressions: "80", clicks: "8" },
        { query: "q4", source: "google-search-console", impressions: "70", clicks: "7" },
        { query: "q5", source: "google-search-console", impressions: "60", clicks: "6" },
      ],
    ]);
    const out = await loadVisibilityGap(tx, INSTANCE, { topLimit: 3 });
    expect(out!.topQueries).toHaveLength(3);
    expect(out!.topQueries[0]?.query).toBe("q1");
    expect(out!.topQueries[2]?.query).toBe("q3");
    expect(out!.queryCounts["google-only"]).toBe(5); // 분류 자체는 모든 query (filter 후 count)
  });

  it("bing source — gap 무시 (v1 google vs naver 만)", async () => {
    const maxDate = new Date("2026-05-27T00:00:00Z");
    const tx = makeTx([
      [{ max_date: maxDate }],
      [
        { query: "체질개선", source: "bing-webmaster", impressions: "100", clicks: "10" },
        { query: "체질개선", source: "google-search-console", impressions: "50", clicks: "5" },
      ],
      [],
    ]);
    const out = await loadVisibilityGap(tx, INSTANCE);
    const row = out!.topQueries[0];
    expect(row?.googleImpressions).toBe(50);
    expect(row?.naverImpressions).toBe(0);
    expect(row?.bucket).toBe("google-only");
  });

  it("totalImpressions=0 row 제외", async () => {
    const maxDate = new Date("2026-05-27T00:00:00Z");
    const tx = makeTx([
      [{ max_date: maxDate }],
      [
        { query: "유효", source: "google-search-console", impressions: "10", clicks: "1" },
        { query: "bing-only", source: "bing-webmaster", impressions: "20", clicks: "2" },
      ],
      [],
    ]);
    const out = await loadVisibilityGap(tx, INSTANCE);
    expect(out!.topQueries).toHaveLength(1);
    expect(out!.topQueries[0]?.query).toBe("유효");
  });
});
