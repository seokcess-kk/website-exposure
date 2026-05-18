// Spike E — test-super-admin-switch (cycle2 patch)
//   - switchSuperAdminInstance API만 사용·audit invariant 강제 검증
//   - SPIKEE1-006: super-admin role은 'super-admin'
import postgres from "postgres";
import { env } from "../env.js";
import { createSession, switchSuperAdminInstance } from "../session.js";
import { resolveTenantContext } from "../resolve-tenant-context.js";
import { TenantResolveError } from "../errors.js";
import { INSTANCE_A_ID, INSTANCE_B_ID, USER_CAROL_EMAIL } from "../fixtures.js";

async function main(): Promise<void> {
  const sql = postgres(env.DATABASE_URL, { max: 1, prepare: false });
  try {
    const u = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_CAROL_EMAIL}`;
    const { signedToken, row } = await createSession(sql, u[0]!.id);

    // Case 1: not-switched → super-admin-required
    let pre = false;
    try { await resolveTenantContext(sql, signedToken, INSTANCE_A_ID); } catch (err) {
      if (err instanceof TenantResolveError && err.reason === "super-admin-required") pre = true;
    }
    if (!pre) throw new Error("super-admin without switch should reject");
    console.log("[super-admin-switch] case-1 not switched: REJECTED (PASS)");

    // Case 2: switch to A·audit invariant (switchSuperAdminInstance API)
    const beforeA = await sql<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM audit_event WHERE event_type = 'instance-switched'`;
    const sA = await switchSuperAdminInstance(sql, row.sessionToken, u[0]!.id, INSTANCE_A_ID);
    if (sA.fromInstanceId !== null) throw new Error("first switch from must be null");
    const afterA = await sql<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM audit_event WHERE event_type = 'instance-switched'`;
    if (afterA[0]!.count !== beforeA[0]!.count + 1) throw new Error("switch A must emit exactly 1 instance-switched audit");
    console.log("[super-admin-switch] case-2 switch A + audit +1: PASS");

    // Case 3: resolved A·role=super-admin
    const ctxA = await resolveTenantContext(sql, signedToken, INSTANCE_A_ID);
    if (ctxA.instanceId !== INSTANCE_A_ID || ctxA.role !== "super-admin") throw new Error(`ctxA: ${ctxA.instanceId} ${ctxA.role}`);
    console.log(`[super-admin-switch] case-3 resolved A role=super-admin (PASS)`);

    // Case 4: switch A→B·audit +1
    const sB = await switchSuperAdminInstance(sql, row.sessionToken, u[0]!.id, INSTANCE_B_ID);
    if (sB.fromInstanceId !== INSTANCE_A_ID) throw new Error("from must be A");
    const afterB = await sql<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM audit_event WHERE event_type = 'instance-switched'`;
    if (afterB[0]!.count !== afterA[0]!.count + 1) throw new Error("switch B must emit exactly 1 instance-switched audit");
    console.log("[super-admin-switch] case-4 switch A→B + audit +1: PASS");

    // Case 5: resolved B
    const ctxB = await resolveTenantContext(sql, signedToken, INSTANCE_B_ID);
    if (ctxB.instanceId !== INSTANCE_B_ID) throw new Error("ctxB instance mismatch");
    console.log("[super-admin-switch] case-5 resolved B: PASS");

    // Case 6: requested A while selected B → tampering reject
    let tampered = false;
    try { await resolveTenantContext(sql, signedToken, INSTANCE_A_ID); } catch (err) {
      if (err instanceof TenantResolveError && err.reason === "instance-mismatch") tampered = true;
    }
    if (!tampered) throw new Error("requested != selected should reject");
    console.log("[super-admin-switch] case-6 tampered: REJECTED (PASS)");

    // Case 7: total instance-switched = 2 (case2 + case4)
    if (afterB[0]!.count - beforeA[0]!.count !== 2) throw new Error("total switches != 2");
    console.log("[super-admin-switch] case-7 total instance-switched = 2 (PASS)");

    console.log("\n✅ test-super-admin-switch: 7 cases PASS");
  } finally { await sql.end({ timeout: 5 }); }
}

main().catch((err) => { console.error("[super-admin-switch] FAIL:", err); process.exit(1); });
