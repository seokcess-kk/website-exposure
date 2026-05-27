// @glitzy/web/lib/admin/__tests__/conversion-improvements — MTL-DEFER-04
// loadConversionImprovements mock tx — 3 카테고리 분기 + threshold.

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { TransactionSql } from "postgres";

import { loadConversionImprovements } from "../conversion-improvements";

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
const MAX_DATE = new Date("2026-05-27T00:00:00Z");

describe("loadConversionImprovements", () => {
  const ENV_KEYS = [
    "MTL_LOW_CONVERSION_CLICK_THRESHOLD",
    "MTL_LOW_CTR_POSITION_TOP",
    "MTL_LOW_CTR_MIN_IMPRESSIONS",
    "MTL_NAVER_ONLY_WEAK_MAX_IMPRESSIONS",
  ];
  const originals: Record<string, string | undefined> = {};

  beforeEach(() => {
    for (const k of ENV_KEYS) {
      originals[k] = process.env[k];
      delete process.env[k];
    }
  });
  afterEach(() => {
    for (const k of ENV_KEYS) {
      if (originals[k] === undefined) delete process.env[k];
      else process.env[k] = originals[k];
    }
  });

  it("snapshot 0 row — empty overview 반환", async () => {
    const tx = makeTx([[{ max_date: null }]]);
    const out = await loadConversionImprovements(tx, INSTANCE);
    expect(out.totalItems).toBe(0);
    expect(out.lowConversionTraffic).toEqual([]);
    expect(out.lowCtr).toEqual([]);
    expect(out.naverOnlyWeak).toEqual([]);
  });

  it("low-conversion-traffic — clicks ≥ 10 + conversion = 0 시 표시", async () => {
    const tx = makeTx([
      [{ max_date: MAX_DATE }],
      [
        {
          page_url: "/demo/article-1",
          source: "google-search-console",
          impressions: "200",
          clicks: "15",
          weighted_position: "200",
          position_denom: "200",
        },
      ],
      [], // conversion_event empty
    ]);
    const out = await loadConversionImprovements(tx, INSTANCE);
    expect(out.lowConversionTraffic).toHaveLength(1);
    expect(out.lowConversionTraffic[0]?.pageUrl).toBe("/demo/article-1");
    expect(out.lowConversionTraffic[0]?.googleClicks).toBe(15);
    expect(out.lowConversionTraffic[0]?.conversions).toBe(0);
  });

  it("low-conversion-traffic — conversion > 0 이면 제외", async () => {
    const tx = makeTx([
      [{ max_date: MAX_DATE }],
      [
        {
          page_url: "/demo/article-1",
          source: "google-search-console",
          impressions: "200",
          clicks: "15",
          weighted_position: "200",
          position_denom: "200",
        },
      ],
      [{ page_path: "/demo/article-1", cnt: "3" }],
    ]);
    const out = await loadConversionImprovements(tx, INSTANCE);
    expect(out.lowConversionTraffic).toHaveLength(0);
  });

  it("low-ctr — 네이버 top 10 + impressions ≥ 5 + naver clicks = 0", async () => {
    const tx = makeTx([
      [{ max_date: MAX_DATE }],
      [
        {
          page_url: "/demo/treatment-x",
          source: "naver-searchadvisor",
          impressions: "20",
          clicks: "0",
          weighted_position: "100", // avg position = 5
          position_denom: "20",
        },
      ],
      [],
    ]);
    const out = await loadConversionImprovements(tx, INSTANCE);
    expect(out.lowCtr).toHaveLength(1);
    expect(out.lowCtr[0]?.naverClicks).toBe(0);
    expect(out.lowCtr[0]?.naverImpressions).toBe(20);
  });

  it("low-ctr — 평균 순위 > 10 이면 제외", async () => {
    const tx = makeTx([
      [{ max_date: MAX_DATE }],
      [
        {
          page_url: "/demo/treatment-x",
          source: "naver-searchadvisor",
          impressions: "20",
          clicks: "0",
          weighted_position: "300", // avg position = 15
          position_denom: "20",
        },
      ],
      [],
    ]);
    const out = await loadConversionImprovements(tx, INSTANCE);
    expect(out.lowCtr).toHaveLength(0);
  });

  it("naver-only-weak — Google 0 + naver imp < 20 시 표시", async () => {
    const tx = makeTx([
      [{ max_date: MAX_DATE }],
      [
        {
          page_url: "/demo/faq-x",
          source: "naver-searchadvisor",
          impressions: "5",
          clicks: "0",
          weighted_position: "100",
          position_denom: "5",
        },
      ],
      [],
    ]);
    const out = await loadConversionImprovements(tx, INSTANCE);
    expect(out.naverOnlyWeak).toHaveLength(1);
    expect(out.naverOnlyWeak[0]?.naverImpressions).toBe(5);
    expect(out.naverOnlyWeak[0]?.googleImpressions).toBe(0);
  });

  it("naver-only-weak — Google 노출 있으면 제외", async () => {
    const tx = makeTx([
      [{ max_date: MAX_DATE }],
      [
        {
          page_url: "/demo/faq-x",
          source: "naver-searchadvisor",
          impressions: "5",
          clicks: "0",
          weighted_position: "100",
          position_denom: "5",
        },
        {
          page_url: "/demo/faq-x",
          source: "google-search-console",
          impressions: "10",
          clicks: "1",
          weighted_position: "30",
          position_denom: "10",
        },
      ],
      [],
    ]);
    const out = await loadConversionImprovements(tx, INSTANCE);
    expect(out.naverOnlyWeak).toHaveLength(0);
  });

  it("threshold env override — MTL_LOW_CONVERSION_CLICK_THRESHOLD=20 시 15 clicks 도 미만으로 분류 안 됨", async () => {
    process.env.MTL_LOW_CONVERSION_CLICK_THRESHOLD = "20";
    const tx = makeTx([
      [{ max_date: MAX_DATE }],
      [
        {
          page_url: "/demo/x",
          source: "google-search-console",
          impressions: "200",
          clicks: "15",
          weighted_position: "200",
          position_denom: "200",
        },
      ],
      [],
    ]);
    const out = await loadConversionImprovements(tx, INSTANCE);
    expect(out.lowConversionTraffic).toHaveLength(0);
  });

  it("topLimit 적용 — 35 row 안 default 30 만 표시", async () => {
    const rows = Array.from({ length: 35 }, (_, i) => ({
      page_url: `/demo/p${i}`,
      source: "google-search-console",
      impressions: String(100 + i),
      clicks: String(15 + i),
      weighted_position: String(100 + i),
      position_denom: String(100 + i),
    }));
    const tx = makeTx([[{ max_date: MAX_DATE }], rows, []]);
    const out = await loadConversionImprovements(tx, INSTANCE);
    expect(out.lowConversionTraffic).toHaveLength(30);
    // 큰 sortKey (clicks) 가 먼저 — p34 (49 clicks) 가 0번
    expect(out.lowConversionTraffic[0]?.pageUrl).toBe("/demo/p34");
  });

  it("conversion 매칭 — page_url 안 host prefix 제거 후 page_path 와 매칭", async () => {
    const tx = makeTx([
      [{ max_date: MAX_DATE }],
      [
        {
          page_url: "https://glitzy.kr/demo/article-1",
          source: "google-search-console",
          impressions: "200",
          clicks: "15",
          weighted_position: "200",
          position_denom: "200",
        },
      ],
      [{ page_path: "/demo/article-1", cnt: "3" }],
    ]);
    const out = await loadConversionImprovements(tx, INSTANCE);
    // conversion 3 매칭됐으니 low-conversion 안 미포함
    expect(out.lowConversionTraffic).toHaveLength(0);
  });
});
