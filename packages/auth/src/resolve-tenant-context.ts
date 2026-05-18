// @glitzy/auth/resolve-tenant-context — server-side 매 요청 재검증
// Spike E LOCAL_PASS 패턴 그대로·env 의존 제거·cfg 주입

import type postgres from "postgres";
import { UUID_V4_REGEX, type TenantRole, type EffectiveRole } from "@glitzy/shared-types";

import { TenantResolveError, AuthDeniedError } from "./errors.js";
import { getActiveSession, type SessionRow } from "./session.js";
import { refreshSessionByDbToken } from "./internal/session-internal.js";
import { emitAuditEvent } from "./audit.js";
import type { AuthConfig } from "./config.js";

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

type MembershipRow = { id: string; instance_id: string; role: TenantRole; active: boolean };

function validateInstanceId(value: unknown): string {
  if (typeof value !== "string") throw new TenantResolveError("invalid-instance-id", "requestedInstanceId not string");
  if (value.length !== 36) throw new TenantResolveError("invalid-instance-id", `UUID length must be 36, got ${value.length}`);
  if (!UUID_V4_REGEX.test(value)) throw new TenantResolveError("invalid-instance-id", `malformed UUID`);
  return value.toLowerCase();
}

export async function resolveTenantContext(
  sql: postgres.Sql,
  cfg: AuthConfig,
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

  // cycle3 major fix: session-expired·session-not-found·session-signature-invalid 구분 보존
  let session: SessionRow;
  try {
    session = await getActiveSession(sql, cfg, signedToken);
  } catch (err) {
    const reason = err instanceof AuthDeniedError ? err.reason : "session-not-found";
    await emitAuditEvent(sql, {
      eventType: "tenant-resolve-denied",
      reason,
      payload: { requestedInstanceId: normalized },
    });
    if (err instanceof AuthDeniedError) {
      // 동일 reason 유지·TenantResolveError로 변환
      throw new TenantResolveError(err.reason, err.message);
    }
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
    effectiveRole = "super-admin";
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
      throw new TenantResolveError("physician-reviewer-ineligible", "physician-reviewer role requires eligibility flag");
    }
    if (mem.role === "client-approver" && !user.client_approver_eligible) {
      await emitAuditEvent(sql, { eventType: "tenant-resolve-denied", actorUserId: user.id, toInstanceId: normalized, reason: "client-approver-ineligible" });
      throw new TenantResolveError("client-approver-ineligible", "client-approver role requires eligibility flag");
    }

    effectiveInstanceId = mem.instance_id;
  }

  const sinceRefresh = (Date.now() - session.lastRefreshedAt.getTime()) / 1000;
  if (sinceRefresh > cfg.sessionRefreshIntervalSeconds) {
    await refreshSessionByDbToken(sql, cfg, session.sessionToken);
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
 * withResolvedTenantTransaction — resolveTenantContext + SET LOCAL app.current_instance_id
 */
export async function withResolvedTenantTransaction<T>(
  sql: postgres.Sql,
  cfg: AuthConfig,
  signedToken: string,
  requestedInstanceId: string,
  fn: (tx: postgres.TransactionSql, ctx: TenantContext) => Promise<T>,
): Promise<{ ctx: TenantContext; result: T }> {
  const ctx = await resolveTenantContext(sql, cfg, signedToken, requestedInstanceId);
  const result = await sql.begin(async (tx) => {
    await tx`SELECT set_config('app.current_instance_id', ${ctx.instanceId}, true)`;
    return fn(tx, ctx);
  }) as T;
  return { ctx, result };
}

/**
 * Action eligibility — REVIEW_WORKFLOW 14 actions exhaustive
 */
export type ActionType =
  | "legal-review-approve" | "legal-review-reject" | "legal-review-request-changes" | "legal-review-delegate"
  | "physician-review-approve" | "physician-review-reject" | "physician-review-request-changes" | "physician-review-delegate"
  | "client-approval-approve" | "client-approval-reject" | "client-approval-request-changes"
  | "operator-publish" | "operator-unpublish" | "operator-edit-content";

export function assertActionEligibility(ctx: TenantContext, action: ActionType): void {
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
      if (!ctx.user.physician_reviewer_eligible) throw new TenantResolveError("physician-reviewer-ineligible", `${action} requires physician_reviewer_eligible`);
      return;
    case "client-approval-approve":
    case "client-approval-reject":
    case "client-approval-request-changes":
      if (!ctx.user.client_approver_eligible) throw new TenantResolveError("client-approver-ineligible", `${action} requires client_approver_eligible`);
      return;
    case "operator-publish":
    case "operator-unpublish":
    case "operator-edit-content":
      if (ctx.role === "operator" || ctx.role === "super-admin") return;
      throw new TenantResolveError("operator-role-required", `${action} requires operator/super-admin role`);
    default: {
      const _exhaustive: never = action;
      throw new Error(`unknown action: ${String(_exhaustive)}`);
    }
  }
}
