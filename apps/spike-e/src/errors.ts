// Spike E — domain errors

export type AuthDenyReason =
  | "session-not-found"
  | "session-expired"
  | "user-inactive"
  | "membership-not-found"
  | "membership-inactive"
  | "instance-mismatch"
  | "legal-reviewer-ineligible"
  | "super-admin-required"
  | "magic-link-expired"
  | "magic-link-consumed"
  | "magic-link-not-found"
  | "magic-link-invalid";

export class AuthDeniedError extends Error {
  override readonly name = "AuthDeniedError";
  constructor(public readonly reason: AuthDenyReason, message: string) {
    super(message);
  }
}

export class TenantResolveError extends Error {
  override readonly name = "TenantResolveError";
  constructor(public readonly reason: AuthDenyReason, message: string) {
    super(message);
  }
}

export class InvariantViolationError extends Error {
  override readonly name = "InvariantViolationError";
  constructor(message: string, public readonly details: Record<string, unknown> = {}) {
    super(message);
  }
}
