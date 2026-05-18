// Spike E — test-inactive-user: admin_user.active=false 후 모든 요청 reject
import postgres from "postgres";
import { env } from "../env.js";
import { createSession } from "../session.js";
import { resolveTenantContext } from "../resolve-tenant-context.js";
import { TenantResolveError } from "../errors.js";
import { INSTANCE_A_ID, USER_ALICE_EMAIL } from "../fixtures.js";

async function main(): Promise<void> {
  const sql = postgres(env.DATABASE_URL, { max: 1, prepare: false });
  try {
    // restore alice membership first
    const u = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_ALICE_EMAIL}`;
    await sql`UPDATE instance_membership SET active = true WHERE user_id = ${u[0]!.id}`;
    await sql`UPDATE admin_user SET active = true WHERE id = ${u[0]!.id}`;

    const { signedToken } = await createSession(sql, u[0]!.id);
    await resolveTenantContext(sql, signedToken, INSTANCE_A_ID); // baseline OK
    console.log("[inactive-user] baseline resolve: PASS");

    // deactivate user
    await sql`UPDATE admin_user SET active = false WHERE id = ${u[0]!.id}`;
    let rejected = false;
    try {
      await resolveTenantContext(sql, signedToken, INSTANCE_A_ID);
    } catch (err) {
      if (err instanceof TenantResolveError && err.reason === "user-inactive") rejected = true;
    }
    if (!rejected) throw new Error("inactive user should reject");
    console.log("[inactive-user] deactivated user: REJECTED user-inactive (PASS)");

    // audit emit 검증
    const audit = await sql<{ count: number }[]>`
      SELECT COUNT(*)::int AS count FROM audit_event
      WHERE event_type = 'inactive-user-rejected' AND actor_user_id = ${u[0]!.id}
    `;
    if (audit[0]!.count < 1) throw new Error("inactive-user-rejected audit missing");
    console.log(`[inactive-user] audit inactive-user-rejected: ${audit[0]!.count} (PASS)`);

    // restore
    await sql`UPDATE admin_user SET active = true WHERE id = ${u[0]!.id}`;
    await resolveTenantContext(sql, signedToken, INSTANCE_A_ID);
    console.log("[inactive-user] restore + resolve: PASS");

    console.log("\n✅ test-inactive-user: 4 steps PASS");
  } finally { await sql.end({ timeout: 5 }); }
}

main().catch((err) => { console.error("[inactive-user] FAIL:", err); process.exit(1); });
