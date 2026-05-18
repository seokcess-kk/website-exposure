// Spike E — test-tenant-resolve-cross: A operator가 B 요청 → membership-not-found
import postgres from "postgres";
import { env } from "../env.js";
import { createSession } from "../session.js";
import { resolveTenantContext } from "../resolve-tenant-context.js";
import { TenantResolveError } from "../errors.js";
import { INSTANCE_A_ID, INSTANCE_B_ID, USER_ALICE_EMAIL } from "../fixtures.js";

async function main(): Promise<void> {
  const sql = postgres(env.DATABASE_URL, { max: 1, prepare: false });
  try {
    const u = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_ALICE_EMAIL}`;
    const { signedToken } = await createSession(sql, u[0]!.id);

    let rejected = false;
    try {
      await resolveTenantContext(sql, signedToken, INSTANCE_B_ID);
    } catch (err) {
      if (err instanceof TenantResolveError && err.reason === "membership-not-found") rejected = true;
      else throw err;
    }
    if (!rejected) throw new Error("cross-instance should reject");
    console.log("[tenant-resolve-cross] A→B: REJECTED membership-not-found (PASS)");

    // audit emit 검증
    const audit = await sql<{ count: number }[]>`
      SELECT COUNT(*)::int AS count FROM audit_event
      WHERE event_type = 'tenant-resolve-denied' AND actor_user_id = ${u[0]!.id} AND to_instance_id = ${INSTANCE_B_ID}::uuid
    `;
    if (audit[0]!.count < 1) throw new Error("tenant-resolve-denied audit missing");
    console.log(`[tenant-resolve-cross] denied audit: ${audit[0]!.count} (PASS)`);

    // 같은 user이 자기 instance(A) 요청은 정상
    const okCtx = await resolveTenantContext(sql, signedToken, INSTANCE_A_ID);
    if (okCtx.instanceId !== INSTANCE_A_ID) throw new Error("self instance should succeed");
    console.log("[tenant-resolve-cross] self instance: PASS");

    console.log("\n✅ test-tenant-resolve-cross: PASS");
  } finally { await sql.end({ timeout: 5 }); }
}

main().catch((err) => { console.error("[tenant-resolve-cross] FAIL:", err); process.exit(1); });
