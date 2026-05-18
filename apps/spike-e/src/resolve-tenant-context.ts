// Spike E — resolveTenantContext (cycle2 patch)
//   - SPIKEE1-001: withResolvedTenantTransaction wrapper로 SET LOCAL app.current_instance_id
//   - SPIKEE1-002 cascade: instance-switched audit은 switchSuperAdminInstance에서만 emit
//   - SPIKEE1-003 cascade: next-auth schema column names
//   - SPIKEE1-004: role enum SoT (operator·physician-reviewer·legal-reviewer·client-approver)
//   - SPIKEE1-006: super-admin은 tenant access만·action eligibility 별도 (assertActionEligibility)
//   - SPIKEE1-007: requestedInstanceId UUID validation·malformed reject

import postgres from "postgres";

import { env } from "./env.js";
import { TenantResolveError } from "./errors.js";
import { getActiveSession, refreshSession, type SessionRow } from "./session.js";
import { emitAuditEvent } from "./audit.js";

export type TenantRole = "operator" | "physician-reviewer" | "legal-reviewer" | "client-approver";
export type EffectiveRole = TenantRole | "super-admin";

export type AdminUserRow = {
  id: string;
  email: string;
  active: boolean;
  is_super_admin: boolean;
  legal_reviewer_eligible: boolean;
  physician_reviewer_eligible: boolean;
  client_approver_eligible: boolean;
};

export type TenantContext = {
  readonly userId: string;
  readonly email: string;
  readonly instanceId: string;
  readonly role: EffectiveRole;
  readonly isSuperAdmin: boolean;
  readonly sessionToken: string;
  readonly user: AdminUserRow;
};

type MembershipRow = {
  id: string;
  instance_id: string;
  role: TenantRole;
  active: boolean;
};

// SPIKEE1-007 cycle3: UUID v4 strict — version nibble=4·RFC variant nibble=[89ab]
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validateInstanceId(value: unknown): string {
  // SPIKEE1-007 cycle6: length === 36 추가 — JS regex `$` anchor가 trailing \n match 가능 회피
  if (typeof value !== "string") throw new TenantResolveError("instance-mismatch", "requestedInstanceId not string");
  if (value.length !== 36) throw new TenantResolveError("instance-mismatch", `UUID length must be 36, got ${value.length}`);
  if (!UUID_REGEX.test(value)) throw new TenantResolveError("instance-mismatch", `malformed UUID`);
  return value.toLowerCase();
}

export async function resolveTenantContext(
  sql: postgres.Sql,
  signedToken: string,
  requestedInstanceId: string,
): Promise<TenantContext> {
  let normalized: string;
  try {
    normalized = validateInstanceId(requestedInstanceId);
  } catch (err) {
    await emitAuditEvent(sql, {
      eventType: "tenant-resolve-denied",
      reason: "invalid-instance-id",
      payload: { requestedInstanceIdSample: String(requestedInstanceId).slice(0, 100) },
    });
    throw err;
  }

  let session: SessionRow;
  try {
    session = await getActiveSession(sql, signedToken);
  } catch (err) {
    await emitAuditEvent(sql, {
      eventType: "tenant-resolve-denied",
      reason: err instanceof Error ? err.name : "unknown",
      payload: { requestedInstanceId: normalized },
    });
    throw new TenantResolveError("session-not-found", "session invalid");
  }

  const userRows = await sql<AdminUserRow[]>`
    SELECT id, email, active, is_super_admin, legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible
    FROM admin_user WHERE id = ${session.userId}
  `;
  if (userRows.length === 0) {
    await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: session.userId, reason: "user-not-found" });
    throw new TenantResolveError("session-not-found", "user not found");
  }
  const user = userRows[0]!;
  if (!user.active) {
    await emitAuditEvent(sql, { eventType: "inactive-user-rejected", actorUserId: user.id, payload: { requestedInstanceId: normalized } });
    throw new TenantResolveError("user-inactive", "user inactive");
  }

  let effectiveInstanceId: string;
  let effectiveRole: EffectiveRole;

  if (user.is_super_admin) {
    if (session.superAdminSelectedInstanceId === null) {
      await emitAuditEvent(sql, {
        eventType: "tenant-resolve-denied",
        actorUserId: user.id,
        toInstanceId: normalized,
        reason: "super-admin-not-switched",
      });
      throw new TenantResolveError("super-admin-required", "super-admin must switch instance first");
    }
    if (session.superAdminSelectedInstanceId !== normalized) {
      await emitAuditEvent(sql, {
        eventType: "tenant-resolve-denied",
        actorUserId: user.id,
        fromInstanceId: session.superAdminSelectedInstanceId,
        toInstanceId: normalized,
        reason: "super-admin-selected-mismatch",
      });
      throw new TenantResolveError("instance-mismatch", "super-admin selected != requested");
    }
    effectiveInstanceId = session.superAdminSelectedInstanceId;
    effectiveRole = "super-admin";  // SPIKEE1-006: 별도 role·admin 자동 부여 안 함
  } else {
    const memRows = await sql<MembershipRow[]>`
      SELECT id, instance_id, role, active FROM instance_membership
      WHERE user_id = ${user.id} AND instance_id = ${normalized}::uuid AND active = true
    `;
    if (memRows.length === 0) {
      await emitAuditEvent(sql, {
        eventType: "tenant-resolve-denied",
        actorUserId: user.id,
        toInstanceId: normalized,
        reason: "membership-not-found-or-inactive",
      });
      throw new TenantResolveError("membership-not-found", "no active membership");
    }
    const mem = memRows[0]!;
    effectiveRole = mem.role;

    if (mem.role === "legal-reviewer" && !user.legal_reviewer_eligible) {
      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "legal-reviewer-ineligible" });
      throw new TenantResolveError("legal-reviewer-ineligible", "legal-reviewer role requires eligibility flag");
    }
    if (mem.role === "physician-reviewer" && !user.physician_reviewer_eligible) {
      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "physician-reviewer-ineligible" });
      throw new TenantResolveError("legal-reviewer-ineligible", "physician-reviewer role requires eligibility flag");
    }
    if (mem.role === "client-approver" && !user.client_approver_eligible) {
      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "client-approver-ineligible" });
      throw new TenantResolveError("legal-reviewer-ineligible", "client-approver role requires eligibility flag");
    }

    effectiveInstanceId = mem.instance_id;
  }

  const sinceRefresh = (Date.now() - session.lastRefreshedAt.getTime()) / 1000;
  if (sinceRefresh > env.SESSION_REFRESH_INTERVAL_SECONDS) {
    await refreshSession(sql, session.sessionToken);
  }

  await emitAuditEvent(sql, {
    eventType: "tenant-resolved",
    actorUserId: user.id,
    toInstanceId: effectiveInstanceId,
    payload: { role: effectiveRole, isSuperAdmin: user.is_super_admin },
  });

  return {
    userId: user.id,
    email: user.email,
    instanceId: effectiveInstanceId,
    role: effectiveRole,
    isSuperAdmin: user.is_super_admin,
    sessionToken: session.sessionToken,
    user,
  };
}

/**
 * SPIKEE1-001 cycle2: RLS integration — Spike A withTenantTransaction 패턴 통합.
 * tx 안에서 SET LOCAL app.current_instance_id·이후 모든 query는 해당 instance scope.
 */
export async function withResolvedTenantTransaction<T>(
  sql: postgres.Sql,
  signedToken: string,
  requestedInstanceId: string,
  fn: (tx: postgres.TransactionSql, ctx: TenantContext) => Promise<T>,
): Promise<{ ctx: TenantContext; result: T }> {
  const ctx = await resolveTenantContext(sql, signedToken, requestedInstanceId);
  const result = await sql.begin(async (tx) => {
    await tx`SELECT set_config('app.current_instance_id', ${ctx.instanceId}, true)`;
    return fn(tx, ctx);
  });
  return { ctx, result: result as T };
}

/**
 * SPIKEE1-006 cycle3: action eligibility — REVIEW_WORKFLOW Action enum exhaustive.
 *
 * Action category 분류:
 *  - legal-review-*  → legal_reviewer_eligible
 *  - physician-review-* → physician_reviewer_eligible
 *  - client-approval-*  → client_approver_eligible
 *  - operator-*  → 모든 operator membership 가능 (eligibility flag 없음)
 *  - publish/unpublish/delegate → role 기반 (super-admin or admin or operator)
 *  - request-changes (모든 reviewer 가능)
 */
export type ActionType =
  // Legal reviewer actions
  | "legal-review-approve"
  | "legal-review-reject"
  | "legal-review-request-changes"
  | "legal-review-delegate"
  // Physician reviewer actions
  | "physician-review-approve"
  | "physician-review-reject"
  | "physician-review-request-changes"
  | "physician-review-delegate"
  // Client approver actions
  | "client-approval-approve"
  | "client-approval-reject"
  | "client-approval-request-changes"
  // Operator actions
  | "operator-publish"
  | "operator-unpublish"
  | "operator-edit-content";

export function assertActionEligibility(ctx: TenantContext, action: ActionType): void {
  // SPIKEE1-006 cycle5: switch/case exhaustive — strict tsc PASS
  switch (action) {
    case "legal-review-approve":
    case "legal-review-reject":
    case "legal-review-request-changes":
    case "legal-review-delegate":
      if (!ctx.user.legal_reviewer_eligible) throw new TenantResolveError("legal-reviewer-ineligible", `${action} requires legal_reviewer_eligible`);
      return;
    case "physician-review-approve":
    case "physician-review-reject":
    case "physician-review-request-changes":
    case "physician-review-delegate":
      if (!ctx.user.physician_reviewer_eligible) throw new TenantResolveError("legal-reviewer-ineligible", `${action} requires physician_reviewer_eligible`);
      return;
    case "client-approval-approve":
    case "client-approval-reject":
    case "client-approval-request-changes":
      if (!ctx.user.client_approver_eligible) throw new TenantResolveError("legal-reviewer-ineligible", `${action} requires client_approver_eligible`);
      return;
    case "operator-publish":
    case "operator-unpublish":
    case "operator-edit-content":
      if (ctx.role === "operator" || ctx.role === "super-admin") return;
      throw new TenantResolveError("legal-reviewer-ineligible", `${action} requires operator/super-admin role`);
    default: {
      const _exhaustive: never = action;
      throw new Error(`unknown action: ${String(_exhaustive)}`);
    }
  }
}
