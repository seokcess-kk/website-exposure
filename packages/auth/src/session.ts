// @glitzy/auth/session — PUBLIC API (signed token only)
// cycle3: byDbToken 함수들은 ./internal/session-internal.ts로 이동·외부 접근 불가

import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type postgres from "postgres";

import { AuthDeniedError } from "./errors.js";
import type { AuthConfig } from "./config.js";
import {
  refreshSessionByDbToken,
  revokeSessionByDbToken,
  switchSuperAdminInstanceByDbToken,
} from "./internal/session-internal.js";

export type SessionRow = {
  readonly sessionToken: string;
  readonly userId: string;
  readonly expires: Date;
  readonly lastRefreshedAt: Date;
  readonly superAdminSelectedInstanceId: string | null;
};

const SESSION_TOKEN_SEPARATOR = ".";

function signSessionToken(opaque: string, authSecret: string): string {
  const sig = createHmac("sha256", authSecret).update(opaque).digest("base64url");
  return `${opaque}${SESSION_TOKEN_SEPARATOR}${sig}`;
}

function verifySessionTokenSignature(signedToken: string, authSecret: string): string | null {
  const idx = signedToken.lastIndexOf(SESSION_TOKEN_SEPARATOR);
  if (idx <= 0) return null;
  const opaque = signedToken.slice(0, idx);
  const sig = signedToken.slice(idx + 1);
  const expectedSig = createHmac("sha256", authSecret).update(opaque).digest("base64url");
  if (sig.length !== expectedSig.length) return null;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null;
  return opaque;
}

function hashOpaque(opaque: string): string {
  return createHash("sha256").update(opaque).digest("hex");
}

export async function createSession(
  sql: postgres.Sql,
  cfg: AuthConfig,
  userId: string,
): Promise<{ signedToken: string; row: SessionRow }> {
  const opaque = randomBytes(32).toString("base64url");
  const opaqueHashed = hashOpaque(opaque);
  const expires = new Date(Date.now() + cfg.sessionTtlSeconds * 1000);
  const rows = await sql<SessionRow[]>`
    INSERT INTO "session" ("sessionToken", "userId", "expires")
    VALUES (${opaqueHashed}, ${userId}, ${expires})
    RETURNING "sessionToken", "userId", "expires", "lastRefreshedAt", "superAdminSelectedInstanceId"
  `;
  return { signedToken: signSessionToken(opaque, cfg.authSecret), row: rows[0]! };
}

export async function getActiveSession(
  sql: postgres.Sql,
  cfg: AuthConfig,
  signedToken: string,
): Promise<SessionRow> {
  const opaque = verifySessionTokenSignature(signedToken, cfg.authSecret);
  if (opaque === null) throw new AuthDeniedError("session-signature-invalid", "session signature invalid");
  const opaqueHashed = hashOpaque(opaque);
  const rows = await sql<SessionRow[]>`
    SELECT "sessionToken", "userId", "expires", "lastRefreshedAt", "superAdminSelectedInstanceId"
    FROM "session" WHERE "sessionToken" = ${opaqueHashed}
  `;
  if (rows.length === 0) throw new AuthDeniedError("session-not-found", "session not found");
  const row = rows[0]!;
  if (row.expires.getTime() <= Date.now()) throw new AuthDeniedError("session-expired", "session expired");
  return row;
}

/** PUBLIC — signed token → verify+hash → refresh */
export async function refreshSession(sql: postgres.Sql, cfg: AuthConfig, signedToken: string): Promise<void> {
  const opaque = verifySessionTokenSignature(signedToken, cfg.authSecret);
  if (opaque === null) throw new AuthDeniedError("session-signature-invalid", "session signature invalid");
  await refreshSessionByDbToken(sql, cfg, hashOpaque(opaque));
}

/** PUBLIC — signed token → verify+hash → revoke */
export async function revokeSession(sql: postgres.Sql, cfg: AuthConfig, signedToken: string): Promise<void> {
  const opaque = verifySessionTokenSignature(signedToken, cfg.authSecret);
  if (opaque === null) throw new AuthDeniedError("session-signature-invalid", "session signature invalid");
  await revokeSessionByDbToken(sql, hashOpaque(opaque));
}

/** PUBLIC — signed token → verify+hash → switch */
export async function switchSuperAdminInstance(
  sql: postgres.Sql,
  cfg: AuthConfig,
  signedToken: string,
  actorUserId: string,
  toInstanceId: string,
): Promise<{ fromInstanceId: string | null; toInstanceId: string }> {
  const opaque = verifySessionTokenSignature(signedToken, cfg.authSecret);
  if (opaque === null) throw new AuthDeniedError("session-signature-invalid", "session signature invalid");
  return switchSuperAdminInstanceByDbToken(sql, hashOpaque(opaque), actorUserId, toInstanceId);
}
