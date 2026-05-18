// @glitzy/db/service-role — break-glass with pending audit + branded ServiceRoleTx
// cycle2 patch:
//   - PKG1-004: branded ServiceRoleTx·fn(tx) 강제·zero-arg fn() 제거
//   - PKG1-005: outcome update 실패 시 원본 error preserve·AuditMandatoryFailureError 양쪽 error 포함

import type postgres from "postgres";
import type { ServiceRoleFunction, InstanceId, AdminUserId } from "@glitzy/shared-types";

import { ServiceRoleGuardError, AuditMandatoryFailureError } from "./errors.js";

// PKG1-004 cycle3: module-local Symbol — globally non-discoverable
const SERVICE_ROLE_BRAND = Symbol("@glitzy/db/service-role");

export type ServiceRoleTx = postgres.TransactionSql & { [SERVICE_ROLE_BRAND]: true };

export function assertServiceRoleTx(tx: unknown): asserts tx is ServiceRoleTx {
  if (typeof tx !== "function" || (tx as any)[SERVICE_ROLE_BRAND] !== true) {
    throw new ServiceRoleGuardError("(unbranded)", []);
  }
}

export type ServiceRoleContext = {
  readonly function: ServiceRoleFunction;
  readonly actorUserId: AdminUserId;
  readonly instanceId?: InstanceId;
  readonly reason: string;
};

export function assertServiceRoleAllowed(
  ctx: ServiceRoleContext,
  allowedFunctions: ReadonlyArray<ServiceRoleFunction>,
): void {
  if (!allowedFunctions.includes(ctx.function)) {
    throw new ServiceRoleGuardError(ctx.function, allowedFunctions);
  }
}

/**
 * withServiceRole:
 *   1) assertServiceRoleAllowed
 *   2) pending audit insert (tx 밖·forensic 보장) — 실패 시 AuditMandatoryFailureError
 *   3) sql.begin → SET LOCAL ROLE postgres·branded tx → fn(tx)
 *   4) outcome update (success or failure) — failure 시 원본 error 우선·update error는 첨부
 */
export async function withServiceRole<T>(
  sql: postgres.Sql,
  ctx: ServiceRoleContext,
  allowedFunctions: ReadonlyArray<ServiceRoleFunction>,
  fn: (tx: ServiceRoleTx) => Promise<T>,
): Promise<T> {
  assertServiceRoleAllowed(ctx, allowedFunctions);

  let auditId: string;
  try {
    const rows = await sql<{ id: string }[]>`
      INSERT INTO audit_log (instance_id, actor_id, actor_role, action, metadata)
      VALUES (
        ${ctx.instanceId ?? null},
        ${ctx.actorUserId},
        'service_role',
        ${`service-role-invoked:${ctx.function}:pending`},
        ${sql.json({ function: ctx.function, reason: ctx.reason, status: "pending" }) as any}
      )
      RETURNING id
    `;
    auditId = rows[0]!.id;
  } catch (err) {
    throw new AuditMandatoryFailureError(
      `pre-insert audit failed: ${err instanceof Error ? err.message : String(err)}`,
      { phase: "pre-insert", originalError: err instanceof Error ? err.message : String(err) },
    );
  }

  let fnError: unknown = null;
  let result: T | undefined;
  try {
    result = await sql.begin(async (tx) => {
      await tx`SET LOCAL ROLE postgres`;
      Object.defineProperty(tx, SERVICE_ROLE_BRAND, { value: true, configurable: false, enumerable: false, writable: false });
      return fn(tx as ServiceRoleTx);
    }) as T;
  } catch (err) {
    fnError = err;
  }

  const outcome = fnError === null ? "success" : "failure";
  const outcomePayload = fnError === null
    ? { status: "success" }
    : { status: "failure", error: fnError instanceof Error ? fnError.message : String(fnError) };

  let updateError: unknown = null;
  try {
    await sql`
      UPDATE audit_log
      SET action = ${`service-role-invoked:${ctx.function}:${outcome}`},
          metadata = metadata || ${sql.json(outcomePayload) as any}
      WHERE id = ${auditId}::uuid
    `;
  } catch (err) {
    updateError = err;
  }

  if (fnError !== null) {
    if (updateError !== null && fnError instanceof Error) {
      (fnError as any).auditUpdateError = updateError instanceof Error ? updateError.message : String(updateError);
    }
    throw fnError;
  }
  if (updateError !== null) {
    throw new AuditMandatoryFailureError(
      `outcome update failed after success: ${updateError instanceof Error ? updateError.message : String(updateError)}`,
      { phase: "outcome-update", auditId, function: ctx.function },
    );
  }

  return result as T;
}
