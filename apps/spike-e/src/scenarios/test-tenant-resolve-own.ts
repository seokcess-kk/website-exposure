// Spike E — test-tenant-resolve-own: authorized request → context + audit
import postgres from "postgres";
import { env } from "../env.js";
import { createSession } from "../session.js";
import { resolveTenantContext } from "../resolve-tenant-context.js";
import { INSTANCE_A_ID, USER_ALICE_EMAIL } from "../fixtures.js";

async function main(): Promise<void> {
  const sql = postgres(env.DATABASE_URL, { max: 1, prepare: false });
  try {
    const u = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_ALICE_EMAIL}`;
    if (u.length === 0) throw new Error("alice not seeded");
    const { signedToken } = await createSession(sql, u[0]!.id);

    const ctx = await resolveTenantContext(sql, signedToken, INSTANCE_A_ID);
    if (ctx.instanceId !== INSTANCE_A_ID) throw new Error(`instanceId mismatch: ${ctx.instanceId}`);
    if (ctx.role !== "operator") throw new Error(`role: ${ctx.role}`);
    if (ctx.isSuperAdmin !== false) throw new Error("isSuperAdmin should be false");
    console.log(`[tenant-resolve-own] ctx: user=${ctx.email} instance=${ctx.instanceId} role=${ctx.role} (PASS)`);

    // audit emit 검증
    const audit = await sql<{ count: number }[]>`
      SELECT COUNT(*)::int AS count FROM audit_event
      WHERE event_type = 'tenant-resolved' AND actor_user_id = ${ctx.userId}
    `;
    if (audit[0]!.count < 1) throw new Error("tenant-resolved audit missing");
    console.log(`[tenant-resolve-own] audit tenant-resolved emit: ${audit[0]!.count} (PASS)`);

    console.log("\n✅ test-tenant-resolve-own: PASS");
  } finally { await sql.end({ timeout: 5 }); }
}

main().catch((err) => { console.error("[tenant-resolve-own] FAIL:", err); process.exit(1); });
