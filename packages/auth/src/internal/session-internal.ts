// @glitzy/auth/internal/session-internal — INTERNAL ONLY
// package.json exports에 노출 안 함·외부 consumer 접근 불가
// 본 module은 resolveTenantContext에서 ctx.sessionToken (DB-hashed) 직접 사용 위해

import type postgres from "postgres";

import type { AuthConfig } from "../config.js";
import { AuthDeniedError } from "../errors.js";
import { emitAuditEvent } from "../audit.js";

export async function refreshSessionByDbToken(sql: postgres.Sql, cfg: AuthConfig, dbSessionToken: string): Promise<void> {
  const newExpires = new Date(Date.now() + cfg.sessionTtlSeconds * 1000);
  await sql`
    UPDATE "session" SET "lastRefreshedAt" = now(), "expires" = ${newExpires}
    WHERE "sessionToken" = ${dbSessionToken}
  `;
}

export async function revokeSessionByDbToken(sql: postgres.Sql, dbSessionToken: string): Promise<void> {
  await sql`DELETE FROM "session" WHERE "sessionToken" = ${dbSessionToken}`;
}

export async function switchSuperAdminInstanceByDbToken(
  sql: postgres.Sql,
  dbSessionToken: string,
  actorUserId: string,
  toInstanceId: string,
): Promise<{ fromInstanceId: string | null; toInstanceId: string }> {
  let fromInstanceId: string | null = null;
  await sql.begin(async (tx) => {
    const rows = await tx<{ superAdminSelectedInstanceId: string | null }[]>`
      SELECT "superAdminSelectedInstanceId" FROM "session" WHERE "sessionToken" = ${dbSessionToken}
    `;
    if (rows.length === 0) throw new AuthDeniedError("session-not-found", "session not found for switch");
    fromInstanceId = rows[0]!.superAdminSelectedInstanceId;
    await tx`
      UPDATE "session" SET "superAdminSelectedInstanceId" = ${toInstanceId}
      WHERE "sessionToken" = ${dbSessionToken}
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
