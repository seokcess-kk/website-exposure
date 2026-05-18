// @glitzy/notifications-outbox/outbox — cycle3 patch (Spike B 실 SQL 정합)
//   - B1: last_error·last_error_class·completed_at·exhausted_at 사용·permanent_failure_reason 제거
//   - claim 시 attempts 증가 (Spike B 패턴)·markRetry는 증가 안 함
//   - M3: status='processing' AND locked_by=workerId guard·OutboxClaimRaceError

import type postgres from "postgres";

import { OutboxAlreadyEnqueuedError, OutboxClaimRaceError } from "./errors.js";

export type OutboxStatus = "pending" | "processing" | "completed" | "exhausted" | "failed-permanent";
export type LastErrorClass = "transient" | "permanent";

export type OutboxRow = {
  readonly id: string;
  readonly instanceId: string;
  readonly sourceEventId: string;
  readonly status: OutboxStatus;
  readonly payload: Record<string, unknown>;
  readonly attempts: number;
  readonly maxAttempts: number;
  readonly nextAttemptAt: Date;
  readonly lockedAt: Date | null;
  readonly lockedBy: string | null;
  readonly lastError: string | null;
  readonly lastErrorClass: LastErrorClass | null;
};

export type EnqueueInput = {
  readonly instanceId: string;
  readonly sourceEventId: string;
  readonly payload: Record<string, unknown>;
};

export async function enqueue(sql: postgres.Sql, input: EnqueueInput): Promise<{ id: string }> {
  try {
    const rows = await sql<{ id: string }[]>`
      INSERT INTO outbox (instance_id, source_event_id, payload)
      VALUES (${input.instanceId}::uuid, ${input.sourceEventId}, ${sql.json(input.payload as any)})
      RETURNING id
    `;
    return { id: rows[0]!.id };
  } catch (err) {
    if (err instanceof Error && /outbox_idempotency|unique constraint/i.test(err.message)) {
      throw new OutboxAlreadyEnqueuedError(input.instanceId, input.sourceEventId);
    }
    throw err;
  }
}

/**
 * Claim — SKIP LOCKED·attempts++ atomic (Spike B 패턴)
 */
export async function claim(sql: postgres.Sql, workerId: string): Promise<OutboxRow | null> {
  const rows = await sql<OutboxRow[]>`
    UPDATE outbox
    SET status = 'processing',
        locked_at = now(),
        locked_by = ${workerId},
        attempts = attempts + 1
    WHERE id = (
      SELECT id FROM outbox
      WHERE status = 'pending' AND next_attempt_at <= now()
      ORDER BY next_attempt_at
      FOR UPDATE SKIP LOCKED LIMIT 1
    )
    RETURNING
      id,
      instance_id AS "instanceId",
      source_event_id AS "sourceEventId",
      status,
      payload,
      attempts,
      max_attempts AS "maxAttempts",
      next_attempt_at AS "nextAttemptAt",
      locked_at AS "lockedAt",
      locked_by AS "lockedBy",
      last_error AS "lastError",
      last_error_class AS "lastErrorClass"
  `;
  return rows[0] ?? null;
}

export async function markCompleted(sql: postgres.Sql, outboxId: string, workerId: string): Promise<void> {
  const r = await sql<{ id: string }[]>`
    UPDATE outbox
    SET status = 'completed', completed_at = now(), locked_at = NULL, locked_by = NULL
    WHERE id = ${outboxId}::uuid AND status = 'processing' AND locked_by = ${workerId}
    RETURNING id
  `;
  if (r.length !== 1) throw new OutboxClaimRaceError(`markCompleted: row not 'processing'/owned-by ${workerId}`);
}

/**
 * markRetry — transient failure·attempts >= max_attempts이면 exhausted로 전이
 * Spike B 패턴: attempts는 claim 시 이미 증가·markRetry는 status 전이만
 */
export async function markRetry(
  sql: postgres.Sql,
  outboxId: string,
  workerId: string,
  error: string,
  nextAttemptAt: Date,
): Promise<{ status: OutboxStatus }> {
  const r = await sql<{ status: OutboxStatus }[]>`
    UPDATE outbox
    SET status = CASE WHEN attempts >= max_attempts THEN 'exhausted' ELSE 'pending' END,
        locked_at = NULL,
        locked_by = NULL,
        last_error = ${error},
        last_error_class = 'transient',
        next_attempt_at = ${nextAttemptAt},
        exhausted_at = CASE WHEN attempts >= max_attempts THEN now() ELSE exhausted_at END
    WHERE id = ${outboxId}::uuid AND status = 'processing' AND locked_by = ${workerId}
    RETURNING status
  `;
  if (r.length !== 1) throw new OutboxClaimRaceError(`markRetry: row not 'processing'/owned-by ${workerId}`);
  return { status: r[0]!.status };
}

export async function markFailedPermanent(
  sql: postgres.Sql,
  outboxId: string,
  workerId: string,
  error: string,
): Promise<void> {
  const r = await sql<{ id: string }[]>`
    UPDATE outbox
    SET status = 'failed-permanent',
        locked_at = NULL,
        locked_by = NULL,
        last_error = ${error},
        last_error_class = 'permanent'
    WHERE id = ${outboxId}::uuid AND status = 'processing' AND locked_by = ${workerId}
    RETURNING id
  `;
  if (r.length !== 1) throw new OutboxClaimRaceError(`markFailedPermanent: row not 'processing'/owned-by ${workerId}`);
}

/**
 * Stale reclaim — locked_at older than threshold·status='processing'을 'pending'으로 복귀
 * locked_by 검사 안 함 (worker-agnostic)
 */
export async function reclaimStale(sql: postgres.Sql, staleAfterMs: number): Promise<number> {
  const r = await sql<{ id: string }[]>`
    UPDATE outbox
    SET status = 'pending', locked_at = NULL, locked_by = NULL
    WHERE status = 'processing'
      AND locked_at IS NOT NULL
      AND locked_at < now() - ${`${staleAfterMs} milliseconds`}::interval
    RETURNING id
  `;
  return r.length;
}
