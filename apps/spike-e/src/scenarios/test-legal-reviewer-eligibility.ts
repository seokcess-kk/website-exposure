// Spike E — test-legal-reviewer-eligibility (cycle2: role='legal-reviewer')
import postgres from "postgres";
import { env } from "../env.js";
import { createSession } from "../session.js";
import { resolveTenantContext } from "../resolve-tenant-context.js";
import { TenantResolveError } from "../errors.js";
import { INSTANCE_A_ID, USER_DAVE_EMAIL, USER_EVE_EMAIL } from "../fixtures.js";

async function main(): Promise<void> {
  const sql = postgres(env.DATABASE_URL, { max: 1, prepare: false });
  try {
    const ud = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_DAVE_EMAIL}`;
    const { signedToken: tDave } = await createSession(sql, ud[0]!.id);
    const ctxDave = await resolveTenantContext(sql, tDave, INSTANCE_A_ID);
    if (ctxDave.role !== "legal-reviewer") throw new Error(`Dave role: ${ctxDave.role}`);
    console.log(`[legal-eligibility] Dave eligible=true: role=${ctxDave.role} (PASS)`);

    const ue = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_EVE_EMAIL}`;
    const { signedToken: tEve } = await createSession(sql, ue[0]!.id);
    let rejected = false;
    try { await resolveTenantContext(sql, tEve, INSTANCE_A_ID); } catch (err) {
      if (err instanceof TenantResolveError && err.reason === "legal-reviewer-ineligible") rejected = true;
    }
    if (!rejected) throw new Error("Eve should reject");
    console.log("[legal-eligibility] Eve eligible=false: REJECTED (PASS)");

    await sql`UPDATE admin_user SET legal_reviewer_eligible = true WHERE id = ${ue[0]!.id}`;
    const ctxEve = await resolveTenantContext(sql, tEve, INSTANCE_A_ID);
    if (ctxEve.role !== "legal-reviewer") throw new Error(`Eve promoted: ${ctxEve.role}`);
    console.log("[legal-eligibility] Eve promoted: PASS");
    await sql`UPDATE admin_user SET legal_reviewer_eligible = false WHERE id = ${ue[0]!.id}`;

    const audit = await sql<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM audit_event WHERE event_type = 'tenant-resolve-denied' AND reason = 'legal-reviewer-ineligible'`;
    if (audit[0]!.count < 1) throw new Error("audit missing");
    console.log(`[legal-eligibility] audit: ${audit[0]!.count} (PASS)`);

    console.log("\n✅ test-legal-reviewer-eligibility: PASS");
  } finally { await sql.end({ timeout: 5 }); }
}

main().catch((err) => { console.error("[legal-eligibility] FAIL:", err); process.exit(1); });
