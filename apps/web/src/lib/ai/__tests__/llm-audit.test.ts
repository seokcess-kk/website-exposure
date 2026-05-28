// @glitzy/web/lib/ai/__tests__/llm-audit — CONTENT_AI_ASSIST_PLAN v1.0 § 8 task 8
// checkDailyQuota cap-exceeded 분기 + LLM_DAILY_CAP_PER_INSTANCE env override 정합.

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { TransactionSql } from "postgres";

import { checkDailyQuota } from "../llm-audit";

/** 단순 tx mock — 첫 호출 시 정해진 used (weighted) 반환. SQL template tag 안 인자 무시. */
function mockTxWithUsed(used: number): TransactionSql {
  const sql = vi.fn(() => Promise.resolve([{ used: String(used) }] as any));
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

  it("default cap 100 + weight 1 — used=99 → ok (99+1=100 ≤ 100)", async () => {
    const tx = mockTxWithUsed(99);
    const ok = await checkDailyQuota(tx, "00000000-0000-0000-0000-000000000001");
    expect(ok).toBe(true);
  });

  it("default cap 100 + weight 1 — used=100 → cap-exceeded (100+1=101 > 100)", async () => {
    const tx = mockTxWithUsed(100);
    const ok = await checkDailyQuota(tx, "00000000-0000-0000-0000-000000000001");
    expect(ok).toBe(false);
  });

  it("env LLM_DAILY_CAP_PER_INSTANCE override — 10 인 환경 안 used=10 → cap-exceeded", async () => {
    process.env.LLM_DAILY_CAP_PER_INSTANCE = "10";
    const tx = mockTxWithUsed(10);
    const ok = await checkDailyQuota(tx, "00000000-0000-0000-0000-000000000001");
    expect(ok).toBe(false);
  });

  it("env 안 invalid 값 — default 100 fallback", async () => {
    process.env.LLM_DAILY_CAP_PER_INSTANCE = "abc";
    const tx = mockTxWithUsed(50);
    const ok = await checkDailyQuota(tx, "00000000-0000-0000-0000-000000000001");
    expect(ok).toBe(true);
  });

  // CONTENT_AI_DRAFT_PLAN v1.1 — article-full-draft = weight 7 (long-form · cost ~1.5x).
  it("weight 7 — used=93 → ok (93+7=100 ≤ 100)", async () => {
    const tx = mockTxWithUsed(93);
    const ok = await checkDailyQuota(tx, "00000000-0000-0000-0000-000000000001", 7);
    expect(ok).toBe(true);
  });

  it("weight 7 — used=94 → cap-exceeded (94+7=101 > 100)", async () => {
    const tx = mockTxWithUsed(94);
    const ok = await checkDailyQuota(tx, "00000000-0000-0000-0000-000000000001", 7);
    expect(ok).toBe(false);
  });

  it("weight 7 — used=0 → ok (7 ≤ 100)", async () => {
    const tx = mockTxWithUsed(0);
    const ok = await checkDailyQuota(tx, "00000000-0000-0000-0000-000000000001", 7);
    expect(ok).toBe(true);
  });
});
