// @glitzy/web/lib/ai/llm-audit — CONTENT_AI_ASSIST_PLAN v1.0 § 4
// llm_call_log INSERT + 일 quota check + accept/reject UPDATE.

import type { TransactionSql } from "postgres";
import type { LlmPromptTemplate, LlmCallStatus } from "@glitzy/core-content";

const DEFAULT_DAILY_CAP = 100;

function getDailyCap(): number {
  const raw = process.env.LLM_DAILY_CAP_PER_INSTANCE;
  if (!raw) return DEFAULT_DAILY_CAP;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_DAILY_CAP;
}

/** 일 quota 검사 — 지난 24h 안 instance 의 successful + error call 합. cap-exceeded row 자체는 제외 (재시도 차단 의도). */
export async function checkDailyQuota(tx: TransactionSql, instanceId: string): Promise<boolean> {
  const cap = getDailyCap();
  const [row] = await tx<Array<{ cnt: string }>>`
    SELECT COUNT(*)::bigint AS cnt
    FROM llm_call_log
    WHERE instance_id = ${instanceId}::uuid
      AND status IN ('success', 'error', 'rate-limited')
      AND created_at >= now() - INTERVAL '1 day'
  `;
  const count = Number(row?.cnt ?? 0);
  return count < cap;
}

export type LlmCallLogInsert = {
  instanceId: string;
  promptTemplate: LlmPromptTemplate;
  model: string;
  entityType: string | null;
  entityId: string | null;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  latencyMs: number;
  costUsd: number;
  status: LlmCallStatus;
  errorMessage: string | null;
  triggeredBy: string;
};

export async function insertLlmCallLog(tx: TransactionSql, row: LlmCallLogInsert): Promise<string> {
  const [inserted] = await tx<Array<{ id: string }>>`
    INSERT INTO llm_call_log (
      instance_id, prompt_template, model, entity_type, entity_id,
      input_tokens, output_tokens, cache_read_tokens, cache_write_tokens,
      latency_ms, cost_usd, status, error_message, triggered_by
    ) VALUES (
      ${row.instanceId}::uuid,
      ${row.promptTemplate},
      ${row.model},
      ${row.entityType},
      ${row.entityId ? `${row.entityId}::uuid` : null},
      ${row.inputTokens},
      ${row.outputTokens},
      ${row.cacheReadTokens},
      ${row.cacheWriteTokens},
      ${row.latencyMs},
      ${row.costUsd.toFixed(6)},
      ${row.status},
      ${row.errorMessage},
      ${row.triggeredBy}::uuid
    )
    RETURNING id
  `;
  if (!inserted?.id) {
    throw new Error("[llm-audit] insert returned no id");
  }
  return inserted.id;
}

/** 운영자 accept/reject 응답 시 UPDATE. accepted true = accepted · false = rejected. */
export async function updateLlmCallAccepted(
  tx: TransactionSql,
  logId: string,
  accepted: boolean,
): Promise<void> {
  await tx`
    UPDATE llm_call_log
    SET accepted = ${accepted}
    WHERE id = ${logId}::uuid
  `;
}
