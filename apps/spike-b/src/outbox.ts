// Spike B — outbox enqueue·claim·complete·retry·exhausted·permanent
//
// SoT 패턴 (Spike 계획 § B.2):
// - SKIP LOCKED claim
// - control-plane connection (super-user — RLS 미적용)
// - 동일 (instance_id, source_event_id) 중복 enqueue 차단 (partial unique active)
// - stale lock reclaim (locked_at > timeout)

import { sql } from "drizzle-orm";
import type { Sql } from "postgres";
import { dbSuper, sqlSuper } from "./db.ts";

export type OutboxRow = {
  id: string;
  instance_id: string;
  source_event_id: string;
  payload: Record<string, unknown>;
  status: string;
  attempts: number;
  max_attempts: number;
  next_attempt_at: Date;
  locked_at: Date | null;
  locked_by: string | null;
  last_error: string | null;
  last_error_class: string | null;
};

export type EnqueueResult = {
  enqueued: boolean;        // false면 idempotency 중복 (no-op)
  outboxId: string | null;
};

/**
 * outbox에 enqueue. 동일 (instance_id, source_event_id) active state 중복은 no-op.
 */
export async function enqueueOutbox(input: {
  instanceId: string;
  sourceEventId: string;
  payload: Record<string, unknown>;
  maxAttempts?: number;
}): Promise<EnqueueResult> {
  const r = await dbSuper.execute(sql`
    INSERT INTO outbox (instance_id, source_event_id, payload, max_attempts)
    VALUES (
      ${input.instanceId}::uuid,
      ${input.sourceEventId},
      ${JSON.stringify(input.payload)}::jsonb,
      ${input.maxAttempts ?? 5}
    )
    ON CONFLICT DO NOTHING
    RETURNING id
  `);
  const rows = r as unknown as Array<{ id: string }>;
  if (rows.length === 0) {
    return { enqueued: false, outboxId: null };
  }
  return { enqueued: true, outboxId: rows[0]!.id };
}

/**
 * outbox에서 다음 작업 1건을 SKIP LOCKED claim.
 * claim 성공 시 status=processing, locked_at=now(), attempts++ 후 row 반환.
 * 작업 없으면 null.
 *
 * stale processing reclaim: locked_at > staleAfterMs → 다시 pending 취급.
 */
export async function claimNextOutbox(workerId: string, staleAfterMs: number = 5 * 60 * 1000): Promise<OutboxRow | null> {
  const result = await sqlSuper.begin(async (tx) => {
    // stale processing reclaim
    await tx`
      UPDATE outbox SET status='pending', locked_at=NULL, locked_by=NULL
      WHERE status='processing'
        AND locked_at IS NOT NULL
        AND locked_at < now() - ${`${staleAfterMs} milliseconds`}::interval
    `;

    // SKIP LOCKED claim
    const claimed = await tx<OutboxRow[]>`
      WITH next AS (
        SELECT id FROM outbox
        WHERE status='pending' AND next_attempt_at <= now()
        ORDER BY next_attempt_at
        FOR UPDATE SKIP LOCKED
        LIMIT 1
      )
      UPDATE outbox o
      SET status='processing',
          locked_at=now(),
          locked_by=${workerId},
          attempts=attempts+1
      FROM next
      WHERE o.id=next.id
      RETURNING o.*
    `;
    return claimed[0] ?? null;
  });

  return result;
}

/**
 * 처리 성공 → status=completed.
 */
export async function markCompleted(outboxId: string): Promise<void> {
  await dbSuper.execute(sql`
    UPDATE outbox SET status='completed', completed_at=now(), locked_at=NULL, locked_by=NULL
    WHERE id=${outboxId}::uuid
  `);
}

/**
 * 처리 실패 (transient) — backoff 후 재시도.
 * attempts >= max_attempts면 exhausted로 전이.
 */
export async function markTransientFail(outboxId: string, error: string, backoffMs: number): Promise<{ exhausted: boolean }> {
  const r = await dbSuper.execute(sql`
    UPDATE outbox
    SET status = CASE WHEN attempts >= max_attempts THEN 'exhausted' ELSE 'pending' END,
        locked_at = NULL,
        locked_by = NULL,
        last_error = ${error},
        last_error_class = 'transient',
        next_attempt_at = now() + (${backoffMs} || ' milliseconds')::interval,
        exhausted_at = CASE WHEN attempts >= max_attempts THEN now() ELSE exhausted_at END
    WHERE id=${outboxId}::uuid
    RETURNING status
  `);
  const status = (r as unknown as Array<{ status: string }>)[0]?.status;
  return { exhausted: status === 'exhausted' };
}

/**
 * 처리 실패 (permanent) — 즉시 failed-permanent 전이.
 */
export async function markFailedPermanent(outboxId: string, error: string): Promise<void> {
  await dbSuper.execute(sql`
    UPDATE outbox
    SET status='failed-permanent',
        locked_at=NULL,
        locked_by=NULL,
        last_error=${error},
        last_error_class='permanent'
    WHERE id=${outboxId}::uuid
  `);
}

/**
 * outbox 통계 — 시나리오 검증용
 */
export type OutboxStats = {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  exhausted: number;
  failedPermanent: number;
};

export async function getOutboxStats(): Promise<OutboxStats> {
  const r = await dbSuper.execute(sql`
    SELECT
      count(*)::int AS total,
      count(*) FILTER (WHERE status='pending')::int AS pending,
      count(*) FILTER (WHERE status='processing')::int AS processing,
      count(*) FILTER (WHERE status='completed')::int AS completed,
      count(*) FILTER (WHERE status='exhausted')::int AS exhausted,
      count(*) FILTER (WHERE status='failed-permanent')::int AS failed_permanent
    FROM outbox
  `);
  const row = (r as unknown as Array<{
    total: number; pending: number; processing: number;
    completed: number; exhausted: number; failed_permanent: number;
  }>)[0];
  return {
    total: row?.total ?? 0,
    pending: row?.pending ?? 0,
    processing: row?.processing ?? 0,
    completed: row?.completed ?? 0,
    exhausted: row?.exhausted ?? 0,
    failedPermanent: row?.failed_permanent ?? 0,
  };
}
