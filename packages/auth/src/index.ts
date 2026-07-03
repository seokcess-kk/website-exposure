// @glitzy/auth — Spike E LOCAL_PASS 패턴 production module (v0.2)

export type { AuthConfig } from "./config.js";
export { validateAuthConfig } from "./config.js";

export type { AuthDenyReason } from "./errors.js";
export { AuthDeniedError, TenantResolveError } from "./errors.js";

export { emitAuditEvent, type AuditEventInput } from "./audit.js";

export { normalizeIdentifier } from "./identifier.js";

export {
  hashPassword,
  verifyPassword,
  verifyPasswordOrDummy,
  validatePasswordStrength,
} from "./password.js";

export {
  createSession,
  getActiveSession,
  refreshSession,
  revokeSession,
  switchSuperAdminInstance,
  type SessionRow,
} from "./session.js";

export {
  resolveTenantContext,
  withResolvedTenantTransaction,
  assertActionEligibility,
  type TenantContext,
  type AdminUserRow,
  type ActionType,
} from "./resolve-tenant-context.js";
