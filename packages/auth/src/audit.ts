// @glitzy/auth — audit_event insert helper

import type postgres from "postgres";

export type AuditEventInput = {
  readonly eventType: string;
  readonly actorUserId?: string;
  readonly targetUserId?: string;
  readonly fromInstanceId?: string;
  readonly toInstanceId?: string;
  readonly reason?: string;
  readonly payload?: Record<string, unknown>;
};

export async function emitAuditEvent(
  sqlOrTx: postgres.Sql | postgres.TransactionSql,
  input: AuditEventInput,
): Promise<void> {
  await sqlOrTx`
    INSERT INTO audit_event (event_type, actor_user_id, target_user_id, from_instance_id, to_instance_id, reason, payload)
    VALUES (
      ${input.eventType},
      ${input.actorUserId ?? null},
      ${input.targetUserId ?? null},
      ${input.fromInstanceId ?? null},
      ${input.toInstanceId ?? null},
      ${input.reason ?? null},
      ${sqlOrTx.json((input.payload ?? {}) as any)}
    )
  `;
}
