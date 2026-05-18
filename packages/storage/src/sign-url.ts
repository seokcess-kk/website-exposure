// @glitzy/storage/sign-url — server-only signed URL issuer + RefreshPolicy

import {
  GetObjectCommand, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand,
  type S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { auditLog } from "./audit-log.js";
import { assertObjectKeyForInstance, type TenantContext } from "./tenant-context.js";
import { RefreshRejectedError } from "./errors.js";
import type { StorageConfig } from "./config.js";

export type SignedUrlMethod = "GET" | "PUT" | "DELETE" | "HEAD";

export type SignedUrlRequest = {
  readonly ctx: TenantContext;
  readonly objectKey: string;
  readonly method: SignedUrlMethod;
  readonly contentType?: string;
  readonly contentLength?: number;
  readonly ttlSeconds?: number;
};

export type SignedUrlResult = {
  readonly url: string;
  readonly method: SignedUrlMethod;
  readonly objectKey: string;
  readonly contentType: string | null;
  readonly contentLength: number | null;
  /** m2 cycle2: refresh 시 동일 TTL 재사용 위해 저장 */
  readonly ttlSeconds: number;
  readonly issuedAt: number;
  readonly expiresAt: number;
  readonly refreshAt: number;
};

function buildCommand(cfg: StorageConfig, req: SignedUrlRequest) {
  const Bucket = cfg.s3Bucket;
  const Key = req.objectKey;
  switch (req.method) {
    case "GET": return new GetObjectCommand({ Bucket, Key });
    case "PUT":
      if (!req.contentType || req.contentType.trim() === "") throw new Error("PUT requires contentType");
      if (req.contentLength === undefined || req.contentLength <= 0) throw new Error("PUT requires positive contentLength");
      return new PutObjectCommand({ Bucket, Key, ContentType: req.contentType, ContentLength: req.contentLength });
    case "DELETE": return new DeleteObjectCommand({ Bucket, Key });
    case "HEAD": return new HeadObjectCommand({ Bucket, Key });
    default: { const _e: never = req.method; throw new Error(`unexpected: ${String(_e)}`); }
  }
}

export async function issueSignedUrl(
  client: S3Client,
  cfg: StorageConfig,
  req: SignedUrlRequest,
): Promise<SignedUrlResult> {
  const ttl = req.ttlSeconds ?? cfg.signedUrlTtlSeconds;
  if (ttl <= 0 || ttl > cfg.signedUrlMaxTtlSeconds) {
    throw new Error(`ttlSeconds out of range: ${ttl} (max ${cfg.signedUrlMaxTtlSeconds})`);
  }
  if (cfg.signedUrlRefreshBeforeSeconds >= ttl) {
    throw new Error(`signedUrlRefreshBeforeSeconds must be < ttl`);
  }

  try { assertObjectKeyForInstance(req.ctx, req.objectKey); } catch (err) {
    auditLog.append({
      timestamp: Date.now(),
      instanceId: req.ctx.instanceId,
      actorId: req.ctx.actorId,
      actorRole: req.ctx.actorRole,
      action: "signed-url-rejected",
      objectKey: req.objectKey,
      method: req.method,
      contentType: req.contentType ?? null,
      ttlSeconds: ttl,
      result: "denied",
      reason: err instanceof Error ? err.name : String(err),
    });
    throw err;
  }

  const command = buildCommand(cfg, req);
  const url = await getSignedUrl(client, command as Parameters<typeof getSignedUrl>[1], {
    expiresIn: ttl,
    signableHeaders: req.method === "PUT" ? new Set(["content-type", "content-length"]) : undefined,
  });

  const now = Date.now();
  const result: SignedUrlResult = {
    url, method: req.method, objectKey: req.objectKey,
    contentType: req.contentType ?? null,
    contentLength: req.contentLength ?? null,
    ttlSeconds: ttl,
    issuedAt: now,
    expiresAt: now + ttl * 1000,
    refreshAt: now + (ttl - cfg.signedUrlRefreshBeforeSeconds) * 1000,
  };

  auditLog.append({
    timestamp: now,
    instanceId: req.ctx.instanceId,
    actorId: req.ctx.actorId,
    actorRole: req.ctx.actorRole,
    action: "signed-url-issued",
    objectKey: req.objectKey,
    method: req.method,
    contentType: req.contentType ?? null,
    ttlSeconds: ttl,
    result: "success",
    reason: null,
  });

  return result;
}

export type RefreshPolicy = {
  readonly graceMs: number;
  readonly requireRefreshAtReached: boolean;
};

export const MAX_REFRESH_GRACE_MS = 60 * 60 * 1000;

export const DEFAULT_REFRESH_POLICY: RefreshPolicy = {
  graceMs: 0,
  requireRefreshAtReached: false,
};

function validateRefreshPolicy(policy: unknown): asserts policy is RefreshPolicy {
  if (policy === null || typeof policy !== "object") {
    throw new RefreshRejectedError("invalid-policy", `policy must be non-null object`);
  }
  if (Array.isArray(policy)) throw new RefreshRejectedError("invalid-policy", `policy must be plain object`);
  const p = policy as Record<string, unknown>;
  if (!Number.isFinite(p.graceMs) || !Number.isInteger(p.graceMs as number)) {
    throw new RefreshRejectedError("invalid-policy", `graceMs must be finite integer`);
  }
  if ((p.graceMs as number) < 0) throw new RefreshRejectedError("invalid-policy", `graceMs must be non-negative`);
  if ((p.graceMs as number) > MAX_REFRESH_GRACE_MS) {
    throw new RefreshRejectedError("invalid-policy", `graceMs exceeds MAX_REFRESH_GRACE_MS`);
  }
  if (typeof p.requireRefreshAtReached !== "boolean") {
    throw new RefreshRejectedError("invalid-policy", `requireRefreshAtReached must be boolean`);
  }
}

export async function refreshSignedUrl(
  client: S3Client,
  cfg: StorageConfig,
  previous: SignedUrlResult,
  ctx: TenantContext,
  policy: RefreshPolicy = DEFAULT_REFRESH_POLICY,
): Promise<SignedUrlResult> {
  validateRefreshPolicy(policy);
  const now = Date.now();
  if (now > previous.expiresAt + policy.graceMs) {
    throw new RefreshRejectedError("expired", `cannot refresh: expired at ${new Date(previous.expiresAt).toISOString()}`);
  }
  if (policy.requireRefreshAtReached && now < previous.refreshAt) {
    throw new RefreshRejectedError("premature", `refresh too early: refreshAt=${new Date(previous.refreshAt).toISOString()}`);
  }
  // m2 cycle2: previous TTL 유지
  return issueSignedUrl(client, cfg, {
    ctx,
    objectKey: previous.objectKey,
    method: previous.method,
    contentType: previous.contentType ?? undefined,
    contentLength: previous.contentLength ?? undefined,
    ttlSeconds: previous.ttlSeconds,
  });
}
