// Spike E — test-rls-integration (cycle3 patch SPIKEE1-001)
//   RLS-protected tenant_data + SET LOCAL ROLE app_tenant_user 실 검증
import postgres from "postgres";
import { env } from "../env.js";
import { createSession } from "../session.js";
import { withResolvedTenantTransaction } from "../resolve-tenant-context.js";
import { INSTANCE_A_ID, INSTANCE_B_ID, USER_ALICE_EMAIL, USER_BOB_EMAIL } from "../fixtures.js";

async function main(): Promise<void> {
  const sql = postgres(env.DATABASE_URL, { max: 4, prepare: false });
  try {
    await sql`UPDATE instance_membership SET active = true, deactivated_at = NULL, deactivated_by_user_id = NULL`;
    await sql`UPDATE admin_user SET active = true`;

    const uAlice = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_ALICE_EMAIL}`;
    const uBob = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_BOB_EMAIL}`;
    const { signedToken: tAlice } = await createSession(sql, uAlice[0]!.id);
    const { signedToken: tBob } = await createSession(sql, uBob[0]!.id);

    await sql`TRUNCATE TABLE tenant_data RESTART IDENTITY`;
    await sql`INSERT INTO tenant_data (instance_id, title) VALUES (${INSTANCE_A_ID}::uuid, 'A-1'), (${INSTANCE_A_ID}::uuid, 'A-2'), (${INSTANCE_B_ID}::uuid, 'B-1')`;

    // Case 1: Alice → A: 2 rows
    const { ctx: ctxA, result: rA } = await withResolvedTenantTransaction(sql, tAlice, INSTANCE_A_ID, async (tx) => {
      await tx`SET LOCAL ROLE app_tenant_user`;
      const rows = await tx<{ title: string; instance_id: string }[]>`SELECT title, instance_id FROM tenant_data ORDER BY title`;
      return rows;
    });
    if (rA.length !== 2) throw new Error(`Alice should see 2 A-rows, got ${rA.length}`);
    if (rA.some((r) => r.instance_id !== ctxA.instanceId)) throw new Error("Alice leaked B row");
    console.log(`[rls-integration] case-1 Alice→A: 2 rows (PASS)`);

    // Case 2: Bob → B: 1 row
    const { ctx: ctxB, result: rB } = await withResolvedTenantTransaction(sql, tBob, INSTANCE_B_ID, async (tx) => {
      await tx`SET LOCAL ROLE app_tenant_user`;
      const rows = await tx<{ title: string; instance_id: string }[]>`SELECT title, instance_id FROM tenant_data ORDER BY title`;
      return rows;
    });
    if (rB.length !== 1) throw new Error(`Bob should see 1 B-row, got ${rB.length}`);
    if (rB.some((r) => r.instance_id !== ctxB.instanceId)) throw new Error("Bob leaked A row");
    console.log(`[rls-integration] case-2 Bob→B: 1 row (PASS)`);

    // Case 3: Alice가 instance-B row INSERT → WITH CHECK reject
    let rejected = false;
    try {
      await withResolvedTenantTransaction(sql, tAlice, INSTANCE_A_ID, async (tx) => {
        await tx`SET LOCAL ROLE app_tenant_user`;
        await tx`INSERT INTO tenant_data (instance_id, title) VALUES (${INSTANCE_B_ID}::uuid, 'cross-write')`;
      });
    } catch (err) {
      if (err instanceof Error && /row-level security|row violates/i.test(err.message)) rejected = true;
    }
    if (!rejected) throw new Error("cross-tenant INSERT should violate RLS");
    console.log("[rls-integration] case-3 cross-tenant INSERT (WITH CHECK): REJECTED (PASS)");

    // Case 4: current_setting == ctx.instanceId
    const { ctx: ctxC, result: settingValue } = await withResolvedTenantTransaction(sql, tAlice, INSTANCE_A_ID, async (tx) => {
      const r = await tx<{ value: string }[]>`SELECT current_setting('app.current_instance_id', true) AS value`;
      return r[0]?.value ?? null;
    });
    if (settingValue !== ctxC.instanceId) throw new Error(`current_setting=${settingValue}, ctx=${ctxC.instanceId}`);
    console.log(`[rls-integration] case-4 current_setting == ctx.instanceId (PASS)`);

    console.log("\n✅ test-rls-integration: 4 cases PASS (실 RLS policy + SET LOCAL ROLE + WITH CHECK)");
  } finally { await sql.end({ timeout: 5 }); }
}

main().catch((err) => { console.error("[rls-integration] FAIL:", err); process.exit(1); });
