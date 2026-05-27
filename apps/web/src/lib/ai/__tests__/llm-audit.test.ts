// @glitzy/web/lib/ai/__tests__/llm-audit — CONTENT_AI_ASSIST_PLAN v1.0 § 8 task 8
// checkDailyQuota cap-exceeded 분기 + LLM_DAILY_CAP_PER_INSTANCE env override 정합.

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { TransactionSql } from "postgres";

import { checkDailyQuota } from "../llm-audit";

/** 단순 tx mock — 첫 호출 시 정해진 count 반환. SQL template tag 안 인자 무시. */
function mockTxWithCount(cnt: number): TransactionSql {
  const sql = vi.fn(() => Promise.resolve([{ cnt: String(cnt) }] as any));
  // postgres template tag 호출 — 첫 strings argument 도 함수형 호출. 단순 cast.
  return sql as unknown as TransactionSql;
}

describe("checkDailyQuota", () => {
  const ORIGINAL = process.env.LLM_DAILY_CAP_PER_INSTANCE;

  beforeEach(() => {
    delete process.env.LLM_DAILY_CAP_PER_INSTANCE;
  });
  afterEach(() => {
    if (ORIGINAL === undefined) delete process.env.LLM_DAILY_CAP_PER_INSTANCE;
    else process.env.LLM_DAILY_CAP_PER_INSTANCE = ORIGINAL;
  });

  it("default cap 100 — count=99 → ok", async () => {
    const tx = mockTxWithCount(99);
    const ok = await checkDailyQuota(tx, "00000000-0000-0000-0000-000000000001");
    expect(ok).toBe(true);
  });

  it("default cap 100 — count=100 → cap-exceeded", async () => {
    const tx = mockTxWithCount(100);
    const ok = await checkDailyQuota(tx, "00000000-0000-0000-0000-000000000001");
    expect(ok).toBe(false);
  });

  it("env LLM_DAILY_CAP_PER_INSTANCE override — 10 인 환경 안 count=10 → cap-exceeded", async () => {
    process.env.LLM_DAILY_CAP_PER_INSTANCE = "10";
    const tx = mockTxWithCount(10);
    const ok = await checkDailyQuota(tx, "00000000-0000-0000-0000-000000000001");
    expect(ok).toBe(false);
  });

  it("env 안 invalid 값 — default 100 fallback", async () => {
    process.env.LLM_DAILY_CAP_PER_INSTANCE = "abc";
    const tx = mockTxWithCount(50);
    const ok = await checkDailyQuota(tx, "00000000-0000-0000-0000-000000000001");
    expect(ok).toBe(true);
  });
});
