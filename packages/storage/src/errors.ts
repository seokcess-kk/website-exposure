// @glitzy/storage — domain errors

import { AppError } from "@glitzy/shared-errors";

export class TenantPrefixMismatchError extends AppError {
  override readonly code = "TENANT_PREFIX_MISMATCH";
  override readonly httpStatus = 403;
  override readonly name = "TenantPrefixMismatchError";
  constructor(public readonly instanceId: string, public readonly objectKey: string) {
    super(`object key '${objectKey}' does not belong to instance '${instanceId}'`);
  }
}

export class MalformedObjectKeyError extends AppError {
  override readonly code = "MALFORMED_OBJECT_KEY";
  override readonly httpStatus = 400;
  override readonly name = "MalformedObjectKeyError";
  constructor(public readonly objectKey: string) {
    super(`malformed object key '${objectKey}'`);
  }
}

export class RefreshRejectedError extends AppError {
  override readonly code = "REFRESH_REJECTED";
  override readonly httpStatus = 403;
  override readonly name = "RefreshRejectedError";
  constructor(public readonly reason: "expired" | "premature" | "invalid-policy", message: string) {
    super(message, { reason });
  }
}

export class UrlLeakError extends AppError {
  override readonly code = "AUDIT_URL_LEAK";
  override readonly httpStatus = 500;
  override readonly name = "UrlLeakError";
  constructor(public readonly field: string, public readonly pattern: string) {
    super(`audit field '${field}' contains forbidden pattern '${pattern}'`);
  }
}
