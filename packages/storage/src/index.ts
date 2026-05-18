// @glitzy/storage — Spike C LOCAL_PASS 패턴 production module (v0.2)

export type { StorageConfig, S3Credentials } from "./config.js";
export { validateStorageConfig } from "./config.js";

export {
  TenantPrefixMismatchError,
  MalformedObjectKeyError,
  RefreshRejectedError,
  UrlLeakError,
} from "./errors.js";

export {
  isValidUuid,
  canonicalUuid,
  instancePrefix,
  parseObjectKey,
  assertObjectKeyForInstance,
  assertObjectKeyForServiceRole,
  type TenantContext,
} from "./tenant-context.js";

export {
  auditLog,
  type AuditEntry,
} from "./audit-log.js";

export { createS3Client } from "./storage-client.js";

export {
  issueSignedUrl,
  refreshSignedUrl,
  DEFAULT_REFRESH_POLICY,
  MAX_REFRESH_GRACE_MS,
  type SignedUrlMethod,
  type SignedUrlRequest,
  type SignedUrlResult,
  type RefreshPolicy,
} from "./sign-url.js";
