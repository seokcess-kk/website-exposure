// Spike C — server-only signed URL issuer
// SPIKEC1 cycle2:
//   - 005 SoT 정합: TTL-bound bearer semantics·replay 차단 표현 제거
//   - 007 TTL default 600s·refresh 60s·max env.SIGNED_URL_MAX_TTL_SECONDS (24h)
//   - 006 content-type/length signedHeaders 명시·LOCAL/PROVIDER 한계 marker

import {
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  type S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { env } from "./env.js";
import { auditLog } from "./audit-log.js";
import { assertObjectKeyForInstance, type TenantContext } from "./tenant-context.js";
import { RefreshRejectedError } from "./errors.js";

export { RefreshRejectedError } from "./errors.js";

export type SignedUrlMethod = "GET" | "PUT" | "DELETE" | "HEAD";

export type SignedUrlRequest = {
  readonly ctx: TenantContext;
  readonly objectKey: string;
  readonly method: SignedUrlMethod;
  readonly contentType?: string;       // PUT 필수
  readonly contentLength?: number;     // PUT 필수
  readonly ttlSeconds?: number;        // 미지정 시 env.SIGNED_URL_TTL_SECONDS
};

export type SignedUrlResult = {
  readonly url: string;
  readonly method: SignedUrlMethod;
  readonly objectKey: string;
  readonly contentType: string | null;
  readonly contentLength: number | null;
  readonly issuedAt: number;
  readonly expiresAt: number;
  readonly refreshAt: number;
};

function buildCommand(req: SignedUrlRequest): GetObjectCommand | PutObjectCommand | DeleteObjectCommand | HeadObjectCommand {
  const Bucket = env.S3_BUCKET;
  const Key = req.objectKey;
  switch (req.method) {
    case "GET":
      return new GetObjectCommand({ Bucket, Key });
    case "PUT":
      if (!req.contentType || req.contentType.trim() === "") {
        throw new Error("PUT signed URL requires non-empty contentType");
      }
      if (req.contentLength === undefined || req.contentLength <= 0) {
        throw new Error("PUT signed URL requires positive contentLength");
      }
      return new PutObjectCommand({
        Bucket,
        Key,
        ContentType: req.contentType,
        ContentLength: req.contentLength,
      });
    case "DELETE":
      return new DeleteObjectCommand({ Bucket, Key });
    case "HEAD":
      return new HeadObjectCommand({ Bucket, Key });
    default: {
      const _exhaustive: never = req.method;
      throw new Error(`unexpected method: ${String(_exhaustive)}`);
    }
  }
}

/**
 * Issue a signed URL for `objectKey` under `ctx.instanceId` prefix.
 *
 * 본 함수는 LOCAL 강제:
 *   - tenant prefix isolation (canonical parsing)
 *   - PUT content-type/length signed header
 *   - audit emit (success + denied)
 *   - TTL bound (max env.SIGNED_URL_MAX_TTL_SECONDS)
 *
 * PROVIDER 의존:
 *   - content-type/length의 server-side 강제는 R2 응답 코드로 PROVIDER_PASS gate 검증
 *   - credential-level IAM Condition isolation은 R2 IAM PolicyDocument로 PROVIDER_PASS gate 검증
 */
export async function issueSignedUrl(
  client: S3Client,
  req: SignedUrlRequest,
): Promise<SignedUrlResult> {
  const ttl = req.ttlSeconds ?? env.SIGNED_URL_TTL_SECONDS;
  if (ttl <= 0 || ttl > env.SIGNED_URL_MAX_TTL_SECONDS) {
    throw new Error(
      `ttlSeconds out of range: ${ttl} (max ${env.SIGNED_URL_MAX_TTL_SECONDS})`,
    );
  }
  if (env.SIGNED_URL_REFRESH_BEFORE_SECONDS >= ttl) {
    throw new Error(
      `SIGNED_URL_REFRESH_BEFORE_SECONDS (${env.SIGNED_URL_REFRESH_BEFORE_SECONDS}) must be < ttl (${ttl})`,
    );
  }

  // Tenant guard — 실패 시 audit + throw
  try {
    assertObjectKeyForInstance(req.ctx, req.objectKey);
  } catch (err) {
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

  const command = buildCommand(req);
  const url = await getSignedUrl(client, command as Parameters<typeof getSignedUrl>[1], {
    expiresIn: ttl,
    signableHeaders: req.method === "PUT" ? new Set(["content-type", "content-length"]) : undefined,
  });

  const now = Date.now();
  const result: SignedUrlResult = {
    url,
    method: req.method,
    objectKey: req.objectKey,
    contentType: req.contentType ?? null,
    contentLength: req.contentLength ?? null,
    issuedAt: now,
    expiresAt: now + ttl * 1000,
    refreshAt: now + (ttl - env.SIGNED_URL_REFRESH_BEFORE_SECONDS) * 1000,
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
  /** 만료 후 grace window — 0이면 만료 즉시 reject. integer·non-negative·≤ MAX_GRACE_MS */
  readonly graceMs: number;
  /** premature refresh 차단 — false면 refreshAt 도래 전 호출도 허용 */
  readonly requireRefreshAtReached: boolean;
};

/** SPIKEC3-002 cycle4: grace window hard cap — 1 hour (운영 정책 SoT 후속 cascade 후보) */
export const MAX_REFRESH_GRACE_MS = 60 * 60 * 1000;

export const DEFAULT_REFRESH_POLICY: RefreshPolicy = {
  graceMs: 0,
  requireRefreshAtReached: false,
};

function validateRefreshPolicy(policy: unknown): asserts policy is RefreshPolicy {
  // SPIKEC4-002 cycle5: top-level null/non-object/primitive 차단 — graceMs deref 전
  if (policy === null || typeof policy !== "object") {
    throw new RefreshRejectedError("invalid-policy", `policy must be non-null object, got ${policy === null ? "null" : typeof policy}`);
  }
  if (Array.isArray(policy)) {
    throw new RefreshRejectedError("invalid-policy", `policy must be plain object, got Array`);
  }
  const p = policy as Record<string, unknown>;
  if (!Number.isFinite(p.graceMs) || !Number.isInteger(p.graceMs as number)) {
    throw new RefreshRejectedError("invalid-policy", `graceMs must be finite integer, got ${String(p.graceMs)}`);
  }
  if ((p.graceMs as number) < 0) {
    throw new RefreshRejectedError("invalid-policy", `graceMs must be non-negative, got ${p.graceMs}`);
  }
  if ((p.graceMs as number) > MAX_REFRESH_GRACE_MS) {
    throw new RefreshRejectedError(
      "invalid-policy",
      `graceMs ${p.graceMs} exceeds MAX_REFRESH_GRACE_MS ${MAX_REFRESH_GRACE_MS}`,
    );
  }
  if (typeof p.requireRefreshAtReached !== "boolean") {
    throw new RefreshRejectedError("invalid-policy", `requireRefreshAtReached must be boolean, got ${typeof p.requireRefreshAtReached}`);
  }
}

/**
 * Refresh helper — caller가 refreshAt 도래 시 호출.
 * SPIKEC2-002 cycle3·SPIKEC3-002 cycle4: refresh policy validation + grace cap.
 *   - 만료 + grace 경과 시 reject (expired)
 *   - requireRefreshAtReached=true면 refreshAt 도래 전 호출 reject (premature)
 *   - policy validation: graceMs finite·integer·non-negative·≤ MAX (NaN/Infinity 차단)
 *   - membership 재검증은 caller 책임 (ctx 재발급)
 */
export async function refreshSignedUrl(
  client: S3Client,
  previous: SignedUrlResult,
  ctx: TenantContext,
  policy: RefreshPolicy = DEFAULT_REFRESH_POLICY,
): Promise<SignedUrlResult> {
  validateRefreshPolicy(policy);
  const now = Date.now();
  if (now > previous.expiresAt + policy.graceMs) {
    throw new RefreshRejectedError(
      "expired",
      `cannot refresh: previous expired at ${new Date(previous.expiresAt).toISOString()} (grace ${policy.graceMs}ms)`,
    );
  }
  if (policy.requireRefreshAtReached && now < previous.refreshAt) {
    throw new RefreshRejectedError(
      "premature",
      `refresh too early: refreshAt=${new Date(previous.refreshAt).toISOString()}, now=${new Date(now).toISOString()}`,
    );
  }

  return issueSignedUrl(client, {
    ctx,
    objectKey: previous.objectKey,
    method: previous.method,
    contentType: previous.contentType ?? undefined,
    contentLength: previous.contentLength ?? undefined,
  });
}
