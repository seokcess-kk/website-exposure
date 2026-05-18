// Spike A — service_role break-glass + audit
// 인프라 결정 v1.0 § 1.2 SoT
//
// SPIKEA2-002 정정: pending audit pattern — pre-insert + outcome update.
//                  audit insert 실패 시 throw (감사 필수 semantics 보장)
// SPIKEA2-003 정정 (prototype 한정): multi-instance invocation은 representative + 본 구현에서
//                  control-plane audit table 분리 예정 (별도 spec)

import { sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { dbServiceRole } from "./db.ts";
import { errorMessage } from "./errors.ts";

const ALLOWED_FUNCTIONS = new Set<string>([
  "testServiceRoleScenario",
  "serviceRoleMigrationRunner",
  "serviceRoleExportInstance",
  "serviceRoleImportInstance",
  "serviceRoleAdminBreakGlass",
]);

const ALLOWED_ACTOR_ROLES = new Set<string>(["super-admin", "system"]);

export type ServiceRoleContext = {
  reasonCode: string;
  ticketRef: string;
  actorId: string;
  actorRole: string;
  affectedInstanceIds: string[];
  readWriteClass: "read" | "write" | "both";
  dryRun: boolean;
  correlationId: string;
};

export class BreakGlassError extends Error {
  override readonly name = "BreakGlassError";
}

export class AuditMandatoryFailureError extends Error {
  override readonly name = "AuditMandatoryFailureError";
}

/**
 * service_role 함수의 표준 wrapper.
 *
 * 정책 (SPIKEA2-002):
 *  1. assertBreakGlassAllowed
 *  2. pending audit row insert (status="pending") — 실패 시 throw
 *  3. fn 실행
 *  4. outcome update (status="success" | "failure") — 실패 시 throw
 *  5. caller에 fn 결과 (또는 error) 전파
 *
 * 1 invocation = 1 audit row (id = auditRowId). multi-instance는 metadata.affectedInstanceIds[]에 기록.
 * audit_log row는 representative instance에 저장 (audit_log instance_id NOT NULL).
 * 본 구현 단계에서는 control-plane audit table 분리 예정 (SPIKEA2-003).
 */
export async function withServiceRole<T>(
  ctx: ServiceRoleContext,
  serviceRoleFunction: string,
  fn: () => Promise<T>,
): Promise<T> {
  assertBreakGlassAllowed(ctx, serviceRoleFunction);

  const auditRowId = randomUUID();
  const startedAt = new Date();
  const representativeInstance = ctx.affectedInstanceIds[0]!; // assertBreakGlassAllowed에서 non-empty 강제

  // 1. pending audit (pre-insert) — 실패 시 fn 실행 전 abort
  try {
    await dbServiceRole.execute(sql`
      INSERT INTO audit_log (id, instance_id, actor_id, actor_role, action, metadata)
      VALUES (
        ${auditRowId}::uuid,
        ${representativeInstance}::uuid,
        ${ctx.actorId},
        ${ctx.actorRole},
        'service-role-invoked',
        ${JSON.stringify({
          serviceRoleFunction,
          reasonCode: ctx.reasonCode,
          ticketRef: ctx.ticketRef,
          affectedInstanceIds: ctx.affectedInstanceIds,
          readWriteClass: ctx.readWriteClass,
          dryRun: ctx.dryRun,
          correlationId: ctx.correlationId,
          status: "pending",
          startedAt: startedAt.toISOString(),
        })}::jsonb
      )
    `);
  } catch (e) {
    throw new AuditMandatoryFailureError(`pending audit insert failed: ${errorMessage(e)}`);
  }

  let status: "success" | "failure" = "success";
  let errorClass: string | null = null;
  let errMsg: string | null = null;
  let result: T;
  let fnError: unknown;

  try {
    result = await fn();
  } catch (e) {
    status = "failure";
    errorClass = e instanceof Error ? e.name : "Unknown";
    errMsg = errorMessage(e);
    fnError = e;
  }

  // 2. outcome update — audit 실패는 critical
  const finishedAt = new Date();
  try {
    await dbServiceRole.execute(sql`
      UPDATE audit_log
      SET metadata = metadata || ${JSON.stringify({
        status,
        errorClass,
        errorMessage: errMsg,
        finishedAt: finishedAt.toISOString(),
      })}::jsonb
      WHERE id = ${auditRowId}::uuid
    `);
  } catch (e) {
    throw new AuditMandatoryFailureError(`outcome audit update failed: ${errorMessage(e)}`);
  }

  if (fnError !== undefined) throw fnError;
  return result!;
}

function assertBreakGlassAllowed(ctx: ServiceRoleContext, serviceRoleFunction: string): void {
  if (!ALLOWED_FUNCTIONS.has(serviceRoleFunction)) {
    throw new BreakGlassError(`service-role function not allowlisted: ${serviceRoleFunction}`);
  }
  if (!ALLOWED_ACTOR_ROLES.has(ctx.actorRole)) {
    throw new BreakGlassError(`actorRole not allowed for service-role: ${ctx.actorRole}`);
  }
  if (!ctx.ticketRef || ctx.ticketRef.length < 3) {
    throw new BreakGlassError(`ticketRef required (got: ${ctx.ticketRef || "empty"})`);
  }
  if (!ctx.reasonCode || ctx.reasonCode.length < 3) {
    throw new BreakGlassError(`reasonCode required`);
  }
  if (!ctx.affectedInstanceIds.length) {
    throw new BreakGlassError(`affectedInstanceIds required (at least 1)`);
  }
  if (!ctx.correlationId) {
    throw new BreakGlassError(`correlationId required`);
  }
}

// audit row update에서 audit_log RLS는 update policy 없음 → permission denied
// 그러나 service-role connection은 BYPASSRLS=true (postgres super-user) 또는 service-role role
// 본 prototype은 postgres super-user를 service-role로 사용 — outcome update 허용
// 본 구현에서는 audit_log에 service-role 전용 update policy 필요 (별도 spec)
