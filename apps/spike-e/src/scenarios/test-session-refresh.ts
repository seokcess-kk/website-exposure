// Spike E — test-session-refresh (cycle2: next-auth column names)
import postgres from "postgres";
import { env } from "../env.js";
import { createSession } from "../session.js";
import { resolveTenantContext } from "../resolve-tenant-context.js";
import { INSTANCE_A_ID, USER_ALICE_EMAIL } from "../fixtures.js";

async function main(): Promise<void> {
  const sql = postgres(env.DATABASE_URL, { max: 1, prepare: false });
  try {
    const u = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_ALICE_EMAIL}`;
    await sql`UPDATE instance_membership SET active = true, deactivated_at = NULL, deactivated_by_user_id = NULL WHERE user_id = ${u[0]!.id}`;
    await sql`UPDATE admin_user SET active = true WHERE id = ${u[0]!.id}`;

    const { signedToken, row } = await createSession(sql, u[0]!.id);
    const initialLastRefreshed = row.lastRefreshedAt;

    // Case 1: immediate
    await resolveTenantContext(sql, signedToken, INSTANCE_A_ID);
    const afterFirst = await sql<{ lastRefreshedAt: Date }[]>`SELECT "lastRefreshedAt" FROM "session" WHERE "sessionToken" = ${row.sessionToken}`;
    if (afterFirst[0]!.lastRefreshedAt.getTime() !== initialLastRefreshed.getTime()) {
      throw new Error("first resolve should NOT trigger refresh");
    }
    console.log("[session-refresh] case-1 immediate: no refresh (PASS)");

    // Case 2: stale lastRefreshedAt → refresh
    await sql`UPDATE "session" SET "lastRefreshedAt" = now() - interval '1 hour' WHERE "sessionToken" = ${row.sessionToken}`;
    await resolveTenantContext(sql, signedToken, INSTANCE_A_ID);
    const afterRefresh = await sql<{ lastRefreshedAt: Date }[]>`SELECT "lastRefreshedAt" FROM "session" WHERE "sessionToken" = ${row.sessionToken}`;
    const sinceUpdate = Date.now() - afterRefresh[0]!.lastRefreshedAt.getTime();
    if (sinceUpdate > 5000) throw new Error(`refresh did not occur·sinceUpdate=${sinceUpdate}ms`);
    console.log(`[session-refresh] case-2 stale → refresh (${sinceUpdate}ms ago) (PASS)`);

    // Case 3: 5x consistency
    for (let i = 0; i < 5; i += 1) {
      const ctx = await resolveTenantContext(sql, signedToken, INSTANCE_A_ID);
      if (ctx.instanceId !== INSTANCE_A_ID) throw new Error(`resolve ${i} failed`);
    }
    console.log("[session-refresh] case-3 5x consistency: PASS");

    console.log("\n✅ test-session-refresh: 3 cases PASS");
  } finally { await sql.end({ timeout: 5 }); }
}

main().catch((err) => { console.error("[session-refresh] FAIL:", err); process.exit(1); });
