// Spike E — session (cycle2 patch)
//   - SPIKEE1-003: next-auth Drizzle adapter table·column names ("session"·"verificationToken")
//   - SPIKEE1-002 cascade: switchSuperAdminInstance API에서 audit invariant 강제 (별도 함수)

import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import postgres from "postgres";

import { env } from "./env.js";
import { AuthDeniedError } from "./errors.js";
import { emitAuditEvent } from "./audit.js";

export type SessionRow = {
  readonly sessionToken: string;
  readonly userId: string;
  readonly expires: Date;
  readonly lastRefreshedAt: Date;
  readonly superAdminSelectedInstanceId: string | null;
};

const SESSION_TOKEN_SEPARATOR = ".";

function signSessionToken(opaque: string): string {
  const sig = createHmac("sha256", env.AUTH_SECRET).update(opaque).digest("base64url");
  return `${opaque}${SESSION_TOKEN_SEPARATOR}${sig}`;
}

function verifySessionTokenSignature(signedToken: string): string | null {
  const idx = signedToken.lastIndexOf(SESSION_TOKEN_SEPARATOR);
  if (idx <= 0) return null;
  const opaque = signedToken.slice(0, idx);
  const sig = signedToken.slice(idx + 1);
  const expectedSig = createHmac("sha256", env.AUTH_SECRET).update(opaque).digest("base64url");
  if (sig.length !== expectedSig.length) return null;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null;
  return opaque;
}

function hashOpaque(opaque: string): string {
  return createHash("sha256").update(opaque).digest("hex");
}

export async function createSession(sql: postgres.Sql, userId: string): Promise<{ signedToken: string; row: SessionRow }> {
  const opaque = randomBytes(32).toString("base64url");
  const opaqueHashed = hashOpaque(opaque);
  const expires = new Date(Date.now() + env.SESSION_TTL_SECONDS * 1000);
  const rows = await sql<SessionRow[]>`
    INSERT INTO "session" ("sessionToken", "userId", "expires")
    VALUES (${opaqueHashed}, ${userId}, ${expires})
    RETURNING "sessionToken", "userId", "expires", "lastRefreshedAt", "superAdminSelectedInstanceId"
  `;
  return { signedToken: signSessionToken(opaque), row: rows[0]! };
}

export async function getActiveSession(sql: postgres.Sql, signedToken: string): Promise<SessionRow> {
  const opaque = verifySessionTokenSignature(signedToken);
  if (opaque === null) throw new AuthDeniedError("session-not-found", "session signature invalid");
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

export async function refreshSession(sql: postgres.Sql, sessionToken: string): Promise<void> {
  const newExpires = new Date(Date.now() + env.SESSION_TTL_SECONDS * 1000);
  await sql`
    UPDATE "session"
    SET "lastRefreshedAt" = now(), "expires" = ${newExpires}
    WHERE "sessionToken" = ${sessionToken}
  `;
}

export async function revokeSession(sql: postgres.Sql, sessionToken: string): Promise<void> {
  await sql`DELETE FROM "session" WHERE "sessionToken" = ${sessionToken}`;
}

/**
 * Super-admin instance switch — single API·audit invariant 강제 (SPIKEE1-002 cycle2).
 * 본 함수만 호출하면 instance-switched audit이 정확히 1건 insert 보장 (transaction atomic).
 */
export async function switchSuperAdminInstance(
  sql: postgres.Sql,
  sessionToken: string,  // hashed opaque (DB column)
  actorUserId: string,
  toInstanceId: string,
): Promise<{ fromInstanceId: string | null; toInstanceId: string }> {
  let fromInstanceId: string | null = null;
  await sql.begin(async (tx) => {
    const rows = await tx<{ superAdminSelectedInstanceId: string | null }[]>`
      SELECT "superAdminSelectedInstanceId" FROM "session" WHERE "sessionToken" = ${sessionToken}
    `;
    if (rows.length === 0) throw new AuthDeniedError("session-not-found", "session not found for switch");
    fromInstanceId = rows[0]!.superAdminSelectedInstanceId;
    await tx`
      UPDATE "session" SET "superAdminSelectedInstanceId" = ${toInstanceId}
      WHERE "sessionToken" = ${sessionToken}
    `;
    await emitAuditEvent(tx, {
      eventType: "instance-switched",
      actorUserId,
      fromInstanceId: fromInstanceId ?? undefined,
      toInstanceId,
    });
  });
  return { fromInstanceId, toInstanceId };
}
