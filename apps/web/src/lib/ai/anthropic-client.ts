// @glitzy/web/lib/ai/anthropic-client — CONTENT_AI_ASSIST_PLAN v1.0 § 4
// Anthropic Claude API single-turn helper + prompt cache + llm_call_log audit + quota check.

import Anthropic from "@anthropic-ai/sdk";
import type { TransactionSql } from "postgres";
import type { LlmPromptTemplate } from "@glitzy/core-content";

import { checkDailyQuota, insertLlmCallLog, type LlmCallLogInsert } from "./llm-audit";

// === module-level env validation (§ 4.2.1 fail-fast 패턴 정합) ===
// production / dev 모두 미설정 시 첫 호출 시점 throw. test env 안 vi.mock 안 우회.
function getAnthropicClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY env required for CONTENT_AI_ASSIST");
  }
  return new Anthropic();
}

export const DEFAULT_MODEL = "claude-haiku-4-5-20251001";

// Haiku 4.5 pricing (cached 2026-04-29) — $1/MTok input · $5/MTok output.
// cache_read = ~0.1× input · cache_write (5min ephemeral) = ~1.25× input.
const HAIKU_INPUT_PRICE_PER_MTOK = 1.0;
const HAIKU_OUTPUT_PRICE_PER_MTOK = 5.0;
const HAIKU_CACHE_READ_PRICE_PER_MTOK = 0.1;
const HAIKU_CACHE_WRITE_PRICE_PER_MTOK = 1.25;

function calculateCost(usage: {
  input_tokens: number;
  output_tokens: number;
  cache_read_input_tokens?: number | null;
  cache_creation_input_tokens?: number | null;
}): number {
  const inputCost = (usage.input_tokens / 1_000_000) * HAIKU_INPUT_PRICE_PER_MTOK;
  const outputCost = (usage.output_tokens / 1_000_000) * HAIKU_OUTPUT_PRICE_PER_MTOK;
  const cacheReadCost = ((usage.cache_read_input_tokens ?? 0) / 1_000_000) * HAIKU_CACHE_READ_PRICE_PER_MTOK;
  const cacheWriteCost = ((usage.cache_creation_input_tokens ?? 0) / 1_000_000) * HAIKU_CACHE_WRITE_PRICE_PER_MTOK;
  return inputCost + outputCost + cacheReadCost + cacheWriteCost;
}

export type CallClaudeInput = {
  tx: TransactionSql;
  instanceId: string;
  triggeredBy: string;
  promptTemplate: LlmPromptTemplate;
  systemPrompt: string;
  userPrompt: string;
  entityType?: string;
  entityId?: string;
  maxTokens?: number;
  model?: string;
  /** 일 quota 차감 weight — default 1. article-full-draft = 5 (cost 정합). */
  quotaWeight?: number;
};

export type CallClaudeResult =
  | { ok: true; text: string; logId: string; usage: { inputTokens: number; outputTokens: number; cacheReadTokens: number; cacheWriteTokens: number } }
  | { ok: false; reason: "cap-exceeded" | "api-error" | "rate-limited"; message: string; logId?: string };

/**
 * Single-turn Claude API call + cache_control ephemeral system prompt + llm_call_log audit.
 *
 * v1 안 일 quota (default 100/instance) 검사 후 호출. 초과 시 cap-exceeded log 만 + return.
 * Haiku 4.5 의 cache_control minimum prefix = 4096 tokens — 짧은 system prompt 시 cache miss OK (성능 영향 적음).
 * JSON 출력 expected 시 caller 안 zod safeParse (환각 대응 · CAI-V11).
 */
export async function callClaude(input: CallClaudeInput): Promise<CallClaudeResult> {
  const model = input.model ?? DEFAULT_MODEL;
  const maxTokens = input.maxTokens ?? 1024;

  // 1. quota check (weight default 1 · article-full-draft = 5)
  const quotaOk = await checkDailyQuota(input.tx, input.instanceId, input.quotaWeight ?? 1);
  if (!quotaOk) {
    const logId = await insertLlmCallLog(input.tx, {
      instanceId: input.instanceId,
      promptTemplate: input.promptTemplate,
      model,
      entityType: input.entityType ?? null,
      entityId: input.entityId ?? null,
      inputTokens: 0,
      outputTokens: 0,
      cacheReadTokens: 0,
      cacheWriteTokens: 0,
      latencyMs: 0,
      costUsd: 0,
      status: "cap-exceeded",
      errorMessage: "Daily quota exceeded for this instance",
      triggeredBy: input.triggeredBy,
    });
    return {
      ok: false,
      reason: "cap-exceeded",
      message: "오늘 quota 초과 — 내일 다시 시도하세요.",
      logId,
    };
  }

  // 2. Anthropic SDK call
  const client = getAnthropicClient();
  const startedAt = Date.now();
  let baseInsert: Omit<LlmCallLogInsert, "status" | "errorMessage" | "inputTokens" | "outputTokens" | "cacheReadTokens" | "cacheWriteTokens" | "latencyMs" | "costUsd"> = {
    instanceId: input.instanceId,
    promptTemplate: input.promptTemplate,
    model,
    entityType: input.entityType ?? null,
    entityId: input.entityId ?? null,
    triggeredBy: input.triggeredBy,
  };

  try {
    const response = await client.messages.create({
      model,
      max_tokens: maxTokens,
      system: [
        {
          type: "text",
          text: input.systemPrompt,
          cache_control: { type: "ephemeral" },  // 5min TTL · Haiku 4.5 = 4096 token min
        },
      ],
      messages: [{ role: "user", content: input.userPrompt }],
    });

    const latencyMs = Date.now() - startedAt;
    const usage = response.usage;
    const cost = calculateCost(usage);

    // text block 안 응답 추출 (JSON 출력 — caller 안 parse)
    const textBlocks = response.content.filter((b): b is Anthropic.TextBlock => b.type === "text");
    const text = textBlocks.map((b) => b.text).join("");

    const logId = await insertLlmCallLog(input.tx, {
      ...baseInsert,
      inputTokens: usage.input_tokens,
      outputTokens: usage.output_tokens,
      cacheReadTokens: usage.cache_read_input_tokens ?? 0,
      cacheWriteTokens: usage.cache_creation_input_tokens ?? 0,
      latencyMs,
      costUsd: cost,
      status: "success",
      errorMessage: null,
    });

    return {
      ok: true,
      text,
      logId,
      usage: {
        inputTokens: usage.input_tokens,
        outputTokens: usage.output_tokens,
        cacheReadTokens: usage.cache_read_input_tokens ?? 0,
        cacheWriteTokens: usage.cache_creation_input_tokens ?? 0,
      },
    };
  } catch (err) {
    const latencyMs = Date.now() - startedAt;
    let reason: "rate-limited" | "api-error" = "api-error";
    let message = err instanceof Error ? err.message : String(err);

    if (err instanceof Anthropic.RateLimitError) {
      reason = "rate-limited";
      message = "Anthropic API rate limit — 잠시 후 다시 시도하세요.";
    } else if (err instanceof Anthropic.APIError) {
      message = `Anthropic API error ${err.status}: ${err.message}`;
    }

    const logId = await insertLlmCallLog(input.tx, {
      ...baseInsert,
      inputTokens: 0,
      outputTokens: 0,
      cacheReadTokens: 0,
      cacheWriteTokens: 0,
      latencyMs,
      costUsd: 0,
      status: reason === "rate-limited" ? "rate-limited" : "error",
      errorMessage: message.slice(0, 1000),
    });

    return { ok: false, reason, message, logId };
  }
}
