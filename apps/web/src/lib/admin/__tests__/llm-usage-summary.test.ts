// @glitzy/web/lib/admin/__tests__/llm-usage-summary — CONTENT_AI_ASSIST_PLAN cycle 2 #16
// loadLlmUsageSummary tx mock 안 status 분기 누적 + dailyCap env override.

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { TransactionSql } from "postgres";

import { loadLlmUsageSummary } from "../llm-usage-summary";

type FakeRow = Record<string, unknown>;

function makeTx(responses: ReadonlyArray<ReadonlyArray<FakeRow>>): TransactionSql {
  let i = 0;
  const fn = vi.fn((..._args: unknown[]) => {
    const next = responses[i] ?? [];
    i += 1;
    return Promise.resolve(next as any);
  });
  return fn as unknown as TransactionSql;
}

const INSTANCE = "00000000-0000-0000-0000-000000000001";
const NOW = new Date("2026-05-27T04:00:00Z"); // KST 13:00 2026-05-27

describe("loadLlmUsageSummary", () => {
  const ORIGINAL = process.env.LLM_DAILY_CAP_PER_INSTANCE;

  beforeEach(() => {
    delete process.env.LLM_DAILY_CAP_PER_INSTANCE;
  });
  afterEach(() => {
    if (ORIGINAL === undefined) delete process.env.LLM_DAILY_CAP_PER_INSTANCE;
    else process.env.LLM_DAILY_CAP_PER_INSTANCE = ORIGINAL;
  });

  it("today/month 합산 + cost 누적 (success 만) + template 분포", async () => {
    const todayRows = [
      { status: "success", cnt: "8", cost: "0.012345" },
      { status: "error", cnt: "1", cost: "0" },
      { status: "cap-exceeded", cnt: "2", cost: "0" },
    ];
    const monthRows = [
      { status: "success", cnt: "50", cost: "0.45" },
      { status: "error", cnt: "3", cost: "0" },
      { status: "rate-limited", cnt: "1", cost: "0" },
      { status: "cap-exceeded", cnt: "10", cost: "0" },
    ];
    const templateRows = [
      { prompt_template: "seo-meta-suggest", cnt: "30" },
      { prompt_template: "keyword-match-suggest", cnt: "15" },
      { prompt_template: "review-comment-suggest", cnt: "5" },
    ];
    const tx = makeTx([todayRows, monthRows, templateRows]);
    const out = await loadLlmUsageSummary(tx, INSTANCE, { now: NOW });

    expect(out.today.totalCalls).toBe(11);
    expect(out.today.attemptedCalls).toBe(9); // success 8 + error 1
    expect(out.today.successCalls).toBe(8);
    expect(out.today.totalCostUsd).toBeCloseTo(0.012345, 6);

    expect(out.month.successCalls).toBe(50);
    expect(out.month.attemptedCalls).toBe(54); // success 50 + error 3 + rate-limited 1
    expect(out.month.totalCalls).toBe(64);
    expect(out.month.totalCostUsd).toBeCloseTo(0.45, 4);

    expect(out.byTemplate).toEqual({
      "seo-meta-suggest": 30,
      "keyword-match-suggest": 15,
      "review-comment-suggest": 5,
    });

    expect(out.dailyCap).toBe(100);
    expect(out.todayKst).toBe("2026-05-27");
    expect(out.monthStartKst).toBe("2026-05-01");
  });

  it("빈 응답 — 0 누적 + 0 분포", async () => {
    const tx = makeTx([[], [], []]);
    const out = await loadLlmUsageSummary(tx, INSTANCE, { now: NOW });
    expect(out.today).toEqual({ totalCalls: 0, attemptedCalls: 0, successCalls: 0, totalCostUsd: 0 });
    expect(out.month).toEqual({ totalCalls: 0, attemptedCalls: 0, successCalls: 0, totalCostUsd: 0 });
    expect(out.byTemplate).toEqual({
      "seo-meta-suggest": 0,
      "keyword-match-suggest": 0,
      "review-comment-suggest": 0,
    });
  });

  it("env LLM_DAILY_CAP_PER_INSTANCE override — 200 으로 적용", async () => {
    process.env.LLM_DAILY_CAP_PER_INSTANCE = "200";
    const tx = makeTx([[], [], []]);
    const out = await loadLlmUsageSummary(tx, INSTANCE, { now: NOW });
    expect(out.dailyCap).toBe(200);
  });

  it("env 안 invalid 값 — default 100 fallback", async () => {
    process.env.LLM_DAILY_CAP_PER_INSTANCE = "0";
    const tx = makeTx([[], [], []]);
    const out = await loadLlmUsageSummary(tx, INSTANCE, { now: NOW });
    expect(out.dailyCap).toBe(100);
  });

  it("KST 자정 경계 — UTC 15:00 → 다음 일자 todayKst", async () => {
    const tx = makeTx([[], [], []]);
    const out = await loadLlmUsageSummary(tx, INSTANCE, { now: new Date("2026-05-26T15:00:00Z") });
    expect(out.todayKst).toBe("2026-05-27");
    expect(out.monthStartKst).toBe("2026-05-01");
  });

  it("월 첫날 KST 자정 직전 — 같은 달 monthStart", async () => {
    const tx = makeTx([[], [], []]);
    const out = await loadLlmUsageSummary(tx, INSTANCE, { now: new Date("2026-05-31T14:59:00Z") });
    expect(out.todayKst).toBe("2026-05-31");
    expect(out.monthStartKst).toBe("2026-05-01");
  });

  it("월 경계 — UTC 15:00 → 다음 달 첫날", async () => {
    const tx = makeTx([[], [], []]);
    const out = await loadLlmUsageSummary(tx, INSTANCE, { now: new Date("2026-05-31T15:00:00Z") });
    expect(out.todayKst).toBe("2026-06-01");
    expect(out.monthStartKst).toBe("2026-06-01");
  });

  it("template 안 모르는 값 — 무시 (whitelist)", async () => {
    const tx = makeTx([
      [],
      [],
      [{ prompt_template: "unknown-template", cnt: "5" }],
    ]);
    const out = await loadLlmUsageSummary(tx, INSTANCE, { now: NOW });
    expect(out.byTemplate).toEqual({
      "seo-meta-suggest": 0,
      "keyword-match-suggest": 0,
      "review-comment-suggest": 0,
    });
  });
});
