// @glitzy/auth — domain errors

import { AppError } from "@glitzy/shared-errors";

// M2 cycle2: physician/client/operator 분리·invalid-instance-id 명시
export type AuthDenyReason =
  | "session-not-found"
  | "session-expired"
  | "session-signature-invalid"
  | "user-inactive"
  | "membership-not-found"
  | "membership-inactive"
  | "instance-mismatch"
  | "legal-reviewer-ineligible"
  | "physician-reviewer-ineligible"
  | "client-approver-ineligible"
  | "operator-role-required"
  | "super-admin-required"
  | "invalid-instance-id"
  | "magic-link-expired"
  | "magic-link-consumed"
  | "magic-link-not-found"
  | "magic-link-invalid";

export class AuthDeniedError extends AppError {
  override readonly code = "AUTH_DENIED";
  override readonly httpStatus = 403;
  override readonly name = "AuthDeniedError";
  constructor(public readonly reason: AuthDenyReason, message: string) {
    super(message, { reason });
  }
}

export class TenantResolveError extends AppError {
  override readonly code = "TENANT_RESOLVE_DENIED";
  override readonly httpStatus = 403;
  override readonly name = "TenantResolveError";
  constructor(public readonly reason: AuthDenyReason, message: string) {
    super(message, { reason });
  }
}
