// Spike C — domain errors

export class TenantPrefixMismatchError extends Error {
  override readonly name = "TenantPrefixMismatchError";
  constructor(
    public readonly instanceId: string,
    public readonly objectKey: string,
  ) {
    super(`object key '${objectKey}' does not belong to instance '${instanceId}'`);
  }
}

export class MethodNotAllowedError extends Error {
  override readonly name = "MethodNotAllowedError";
  constructor(
    public readonly requestedMethod: string,
    public readonly allowedMethod: string,
  ) {
    super(`signed URL was issued for ${allowedMethod}, got ${requestedMethod}`);
  }
}

export class ContentTypeMismatchError extends Error {
  override readonly name = "ContentTypeMismatchError";
  constructor(
    public readonly expected: string,
    public readonly actual: string | undefined,
  ) {
    super(`content-type mismatch: expected '${expected}', got '${actual ?? "<missing>"}'`);
  }
}

export class MalformedObjectKeyError extends Error {
  override readonly name = "MalformedObjectKeyError";
  constructor(public readonly objectKey: string) {
    super(`malformed object key '${objectKey}' — must match instances/{uuid}/...`);
  }
}

export class SignedUrlExpiredError extends Error {
  override readonly name = "SignedUrlExpiredError";
  constructor(public readonly issuedAt: number, public readonly ttlSeconds: number) {
    super(`signed URL expired (issued ${new Date(issuedAt).toISOString()}, ttl ${ttlSeconds}s)`);
  }
}

export class InvariantViolationError extends Error {
  override readonly name = "InvariantViolationError";
  constructor(message: string, public readonly details: Record<string, unknown>) {
    super(message);
  }
}

export class RefreshRejectedError extends Error {
  override readonly name = "RefreshRejectedError";
  constructor(public readonly code: "expired" | "premature" | "invalid-policy", message: string) {
    super(message);
  }
}
