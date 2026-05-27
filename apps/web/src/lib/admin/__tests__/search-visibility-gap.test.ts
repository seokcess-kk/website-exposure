// @glitzy/web/lib/admin/__tests__/search-visibility-gap — NSI-DEFER-07
// classifyGap pure function 분기 + loadVisibilityGap mock tx 안 합산 정합.

import { describe, it, expect, vi } from "vitest";
import type { TransactionSql } from "postgres";

import { classifyGap, loadVisibilityGap } from "../search-visibility-gap";

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
      // 3rd query — page rows
      [],
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

  it("page gap — 합산 + topLimit 적용", async () => {
    const maxDate = new Date("2026-05-27T00:00:00Z");
    const tx = makeTx([
      [{ max_date: maxDate }],
      [], // query
      [
        { page_url: "/p1", source: "google-search-console", impressions: "100", clicks: "10" },
        { page_url: "/p1", source: "naver-searchadvisor", impressions: "20", clicks: "2" },
        { page_url: "/p2", source: "google-search-console", impressions: "50", clicks: "5" },
        { page_url: "/p3", source: "naver-searchadvisor", impressions: "30", clicks: "3" },
      ],
    ]);
    const out = await loadVisibilityGap(tx, INSTANCE, { topLimit: 10 });
    expect(out).not.toBeNull();
    expect(out!.pageCounts).toEqual({ "google-only": 1, "naver-only": 1, both: 1 });
    expect(out!.topPages.find((r) => r.pageUrl === "/p1")?.googleImpressions).toBe(100);
    expect(out!.topPages.find((r) => r.pageUrl === "/p1")?.naverImpressions).toBe(20);
    expect(out!.topPages.find((r) => r.pageUrl === "/p1")?.bucket).toBe("both");
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
      [],
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
