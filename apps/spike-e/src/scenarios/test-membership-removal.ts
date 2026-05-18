// Spike E — test-membership-removal (cycle2 patch)
//   - SPIKEE1-005: deactivated_at·deactivated_by_user_id 강제 (DATA_MODEL C-23 cascade)
import postgres from "postgres";
import { env } from "../env.js";
import { createSession } from "../session.js";
import { resolveTenantContext } from "../resolve-tenant-context.js";
import { TenantResolveError } from "../errors.js";
import { INSTANCE_A_ID, USER_ALICE_EMAIL, USER_CAROL_EMAIL } from "../fixtures.js";

async function main(): Promise<void> {
  const sql = postgres(env.DATABASE_URL, { max: 1, prepare: false });
  try {
    const u = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_ALICE_EMAIL}`;
    const uCarol = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_CAROL_EMAIL}`;
    const { signedToken } = await createSession(sql, u[0]!.id);

    // restore membership first (다른 시나리오 영향 회피)
    await sql`UPDATE instance_membership SET active = true, deactivated_at = NULL, deactivated_by_user_id = NULL WHERE user_id = ${u[0]!.id}`;

    // 1) 정상 resolve
    const ok = await resolveTenantContext(sql, signedToken, INSTANCE_A_ID);
    if (ok.instanceId !== INSTANCE_A_ID) throw new Error("initial resolve failed");
    console.log("[membership-removal] initial resolve: PASS");

    // 2) deactivate with deactivated_at·deactivated_by (Carol super-admin이 박탈)
    await sql`
      UPDATE instance_membership
      SET active = false, deactivated_at = now(), deactivated_by_user_id = ${uCarol[0]!.id}
      WHERE user_id = ${u[0]!.id} AND instance_id = ${INSTANCE_A_ID}::uuid
    `;
    console.log("[membership-removal] membership deactivated (deactivated_at + deactivated_by_user_id)");

    // 3) next request → reject
    let rejected = false;
    try { await resolveTenantContext(sql, signedToken, INSTANCE_A_ID); } catch (err) {
      if (err instanceof TenantResolveError && err.reason === "membership-not-found") rejected = true;
    }
    if (!rejected) throw new Error("next request should reject");
    console.log("[membership-removal] next request: REJECTED (PASS)");

    // 4) deactivated_at·deactivated_by row 검증
    const rows = await sql<{ deactivated_at: Date; deactivated_by_user_id: string }[]>`
      SELECT deactivated_at, deactivated_by_user_id FROM instance_membership
      WHERE user_id = ${u[0]!.id} AND instance_id = ${INSTANCE_A_ID}::uuid AND active = false
    `;
    if (rows.length !== 1 || rows[0]!.deactivated_at === null || rows[0]!.deactivated_by_user_id !== uCarol[0]!.id) {
      throw new Error("deactivated_at·deactivated_by_user_id should be persisted");
    }
    console.log("[membership-removal] deactivation metadata persisted: PASS");

    // 5) restore (CHECK constraint 정합: active=true·deactivated_* NULL)
    await sql`UPDATE instance_membership SET active = true, deactivated_at = NULL, deactivated_by_user_id = NULL WHERE user_id = ${u[0]!.id} AND instance_id = ${INSTANCE_A_ID}::uuid`;
    const restored = await resolveTenantContext(sql, signedToken, INSTANCE_A_ID);
    if (restored.instanceId !== INSTANCE_A_ID) throw new Error("restored failed");
    console.log("[membership-removal] restore: PASS");

    // 6) CHECK violation: deactivated_by_user_id NULL when active=false (SPIKEE1-005 cycle4)
    let v1 = false;
    try {
      await sql`UPDATE instance_membership SET active = false, deactivated_at = now(), deactivated_by_user_id = NULL WHERE user_id = ${u[0]!.id} AND instance_id = ${INSTANCE_A_ID}::uuid`;
    } catch (err) {
      if (err instanceof Error && /instance_membership_deactivated_consistency/.test(err.message)) v1 = true;
    }
    if (!v1) throw new Error("deactivate without deactivated_by_user_id should violate CHECK");
    console.log("[membership-removal] case-6 deactivate without deactivated_by_user_id: CHECK violation (PASS)");

    // 7) CHECK violation: active=true with deactivated_at NOT NULL
    let v2 = false;
    try {
      await sql`UPDATE instance_membership SET active = true, deactivated_at = now(), deactivated_by_user_id = ${uCarol[0]!.id} WHERE user_id = ${u[0]!.id} AND instance_id = ${INSTANCE_A_ID}::uuid`;
    } catch (err) {
      if (err instanceof Error && /instance_membership_deactivated_consistency/.test(err.message)) v2 = true;
    }
    if (!v2) throw new Error("active=true with deactivated_at should violate CHECK");
    console.log("[membership-removal] case-7 active=true with deactivated_at: CHECK violation (PASS)");

    console.log("\n✅ test-membership-removal: 7 cases PASS");
  } finally { await sql.end({ timeout: 5 }); }
}

main().catch((err) => { console.error("[membership-removal] FAIL:", err); process.exit(1); });
