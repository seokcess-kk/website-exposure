// @glitzy/web/lib/ai/llm-audit — CONTENT_AI_ASSIST_PLAN v1.0 § 4
// llm_call_log INSERT + 일 quota check + accept/reject UPDATE.

import type { TransactionSql } from "postgres";
import type { LlmPromptTemplate, LlmCallStatus } from "@glitzy/core-content";

// 일 quota 기본값. article-full-draft = weight 7 이므로 1000 = 하루 ~140편(재시도 포함 배치 여러 회 커버).
// env LLM_DAILY_CAP_PER_INSTANCE 로 인스턴스/환경별 override. ⚠️ llm-usage-summary.ts getDailyCap() 과 동기 유지.
const DEFAULT_DAILY_CAP = 1000;

function getDailyCap(): number {
  const raw = process.env.LLM_DAILY_CAP_PER_INSTANCE;
  if (!raw) return DEFAULT_DAILY_CAP;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_DAILY_CAP;
}

/** 일 quota 검사 — 지난 24h 안 instance 의 weighted call 합. cap-exceeded row 자체는 제외 (재시도 차단 의도).
 *
 * CONTENT_AI_DRAFT_PLAN v1.0 — Article full draft = weight 5 (cost 정합 추정 5x).
 * CAI v1 의 SEO 메타/키워드/검수 코멘트 = weight 1 (default).
 *
 * v1 안 race 회피 미합류 (CAID-DEFER-15) — SELECT COUNT + INSERT 비-atomic 패턴 답습.
 * weight=5 + cap=100 시 race 최대 5 quota 초과 (~5%) · 실 cost 영향 미미.
 */
export async function checkDailyQuota(
  tx: TransactionSql,
  instanceId: string,
  weight: number = 1,
): Promise<boolean> {
  const cap = getDailyCap();
  // article-full-draft v1.1 = weight 7 (long-form · cost ~1.5x) · 다른 template = 1.
  const [row] = await tx<Array<{ used: string }>>`
    SELECT COALESCE(SUM(CASE WHEN prompt_template = 'article-full-draft' THEN 7 ELSE 1 END), 0)::bigint AS used
    FROM llm_call_log
    WHERE instance_id = ${instanceId}::uuid
      AND status IN ('success', 'error', 'rate-limited')
      AND created_at >= now() - INTERVAL '1 day'
  `;
  const used = Number(row?.used ?? 0);
  return used + weight <= cap;
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
      ${row.entityId ?? null}::uuid,
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
