// @glitzy/db — domain errors

import { AppError } from "@glitzy/shared-errors";

export class TenantContextRequiredError extends AppError {
  override readonly code = "TENANT_CONTEXT_REQUIRED";
  override readonly httpStatus = 500;
  override readonly name = "TenantContextRequiredError";
}

export class AdvisoryLockNotAcquiredError extends AppError {
  override readonly code = "ADVISORY_LOCK_NOT_ACQUIRED";
  override readonly httpStatus = 503;
  override readonly name = "AdvisoryLockNotAcquiredError";
  constructor(public readonly lockKey: string) {
    super(`advisory lock ${lockKey} already held`);
  }
}

export class ServiceRoleGuardError extends AppError {
  override readonly code = "SERVICE_ROLE_GUARD";
  override readonly httpStatus = 403;
  override readonly name = "ServiceRoleGuardError";
  constructor(public readonly attempted: string, public readonly allowed: readonly string[]) {
    super(`service_role function '${attempted}' not allowed; allowed: ${allowed.join(",")}`);
  }
}

export class AuditMandatoryFailureError extends AppError {
  override readonly code = "AUDIT_MANDATORY_FAILURE";
  override readonly httpStatus = 500;
  override readonly name = "AuditMandatoryFailureError";
}

export class ScopedDbBrandError extends AppError {
  override readonly code = "SCOPED_DB_BRAND";
  override readonly httpStatus = 500;
  override readonly name = "ScopedDbBrandError";
}
