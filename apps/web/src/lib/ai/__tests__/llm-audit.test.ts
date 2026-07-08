// @glitzy/web/lib/ai/__tests__/llm-audit — CONTENT_AI_ASSIST_PLAN v1.0 § 8 task 8
// checkDailyQuota cap-exceeded 분기 + LLM_DAILY_CAP_PER_INSTANCE env override 정합.
// + insertLlmCallLog entity_id 파라미터 바인딩 회귀 (2026-07-08 실사고).

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { TransactionSql } from "postgres";

import { checkDailyQuota, insertLlmCallLog, type LlmCallLogInsert } from "../llm-audit";

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

// 2026-07-08 실사고: entity_id 에 JS 중첩 템플릿 `${id}::uuid` 문자열이 파라미터 값으로
// 바인딩되어 22P02 (invalid uuid) — 키워드 AI 추천 전면 실패. cast 는 SQL 텍스트에,
// 값은 raw uuid 로 들어가는지 고정.
describe("insertLlmCallLog", () => {
  type CapturedQuery = { values: unknown[] };

  function mockCapturingTx(captured: CapturedQuery[]): TransactionSql {
    const sql = vi.fn((_strings: TemplateStringsArray, ...values: unknown[]) => {
      captured.push({ values });
      return Promise.resolve([{ id: "00000000-0000-0000-0000-00000000aaaa" }] as any);
    });
    return sql as unknown as TransactionSql;
  }

  const baseRow: LlmCallLogInsert = {
    instanceId: "11111111-1111-1111-1111-111111111111",
    promptTemplate: "keyword-match-suggest",
    model: "claude-haiku-4-5-20251001",
    entityType: "Keyword",
    entityId: "22222222-2222-2222-2222-222222222222",
    inputTokens: 10,
    outputTokens: 20,
    cacheReadTokens: 0,
    cacheWriteTokens: 0,
    latencyMs: 100,
    costUsd: 0.0001,
    status: "success",
    errorMessage: null,
    triggeredBy: "33333333-3333-3333-3333-333333333333",
  };

  it("entity_id 는 raw uuid 문자열로 바인딩 — 값 안 '::uuid' 혼입 금지", async () => {
    const captured: CapturedQuery[] = [];
    const id = await insertLlmCallLog(mockCapturingTx(captured), baseRow);

    expect(id).toBe("00000000-0000-0000-0000-00000000aaaa");
    expect(captured).toHaveLength(1);
    for (const v of captured[0]!.values) {
      if (typeof v === "string") expect(v).not.toContain("::uuid");
    }
    expect(captured[0]!.values).toContain("22222222-2222-2222-2222-222222222222");
  });

  it("entityId null — null 그대로 바인딩", async () => {
    const captured: CapturedQuery[] = [];
    await insertLlmCallLog(mockCapturingTx(captured), { ...baseRow, entityId: null });
    expect(captured[0]!.values).toContain(null);
  });
});
