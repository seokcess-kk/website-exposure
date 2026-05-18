// Spike D — service_role guard·forward-only hotfix 승인
// SPIKED2-007 cycle3: emitServiceRoleAuditEvent dead path 제거 — runMigrate가 per-file tx 안에서 직접 insert

import { env, type DbTarget } from "./env.js";
import { ServiceRoleGuardError, ForwardOnlyHotfixRejectedError } from "./errors.js";

export type ServiceRoleContext = {
  readonly function: string;
  readonly actorId: string;
  readonly targetDb: DbTarget;
};

export function assertServiceRoleAllowed(ctx: ServiceRoleContext): void {
  if (!env.SERVICE_ROLE_ALLOWED_FUNCTIONS.includes(ctx.function)) {
    throw new ServiceRoleGuardError(ctx.function, env.SERVICE_ROLE_ALLOWED_FUNCTIONS);
  }
}

export function assertForwardOnlyHotfixApproved(filename: string, providedToken: string | undefined): void {
  if (!providedToken) {
    throw new ForwardOnlyHotfixRejectedError(filename, "no super-admin confirmation token provided");
  }
  if (providedToken !== env.SUPER_ADMIN_CONFIRMATION_TOKEN) {
    throw new ForwardOnlyHotfixRejectedError(filename, "super-admin confirmation token mismatch");
  }
}
