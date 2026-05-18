// Spike E — test-action-eligibility (cycle4: 14 action enumeration)
import postgres from "postgres";
import { env } from "../env.js";
import { createSession, switchSuperAdminInstance } from "../session.js";
import { resolveTenantContext, assertActionEligibility, type ActionType } from "../resolve-tenant-context.js";
import { TenantResolveError } from "../errors.js";
import { INSTANCE_A_ID, USER_CAROL_EMAIL, USER_DAVE_EMAIL, USER_ALICE_EMAIL } from "../fixtures.js";

const ALL_ACTIONS: ActionType[] = [
  "legal-review-approve", "legal-review-reject", "legal-review-request-changes", "legal-review-delegate",
  "physician-review-approve", "physician-review-reject", "physician-review-request-changes", "physician-review-delegate",
  "client-approval-approve", "client-approval-reject", "client-approval-request-changes",
  "operator-publish", "operator-unpublish", "operator-edit-content",
];

async function main(): Promise<void> {
  const sql = postgres(env.DATABASE_URL, { max: 1, prepare: false });
  try {
    const ua = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_ALICE_EMAIL}`;
    await sql`UPDATE instance_membership SET active = true, deactivated_at = NULL, deactivated_by_user_id = NULL WHERE user_id = ${ua[0]!.id}`;
    await sql`UPDATE admin_user SET active = true WHERE id = ${ua[0]!.id}`;

    const uc = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_CAROL_EMAIL}`;
    const { signedToken: tCarol, row: rCarol } = await createSession(sql, uc[0]!.id);
    await switchSuperAdminInstance(sql, rCarol.sessionToken, uc[0]!.id, INSTANCE_A_ID);
    const ctxCarol = await resolveTenantContext(sql, tCarol, INSTANCE_A_ID);

    // Case 1: Carol→reviewer actions: all reject (eligibility false)
    let carolRejects = 0;
    for (const action of ALL_ACTIONS) {
      if (action.startsWith("operator-")) continue;
      let rejected = false;
      try { assertActionEligibility(ctxCarol, action); } catch (err) {
        if (err instanceof TenantResolveError) rejected = true;
      }
      if (!rejected) throw new Error(`Carol should reject ${action}`);
      carolRejects += 1;
    }
    console.log(`[action-eligibility] case-1 Carol no-eligibility rejects ${carolRejects}/11 reviewer actions (PASS)`);

    // Case 2: Carol→operator actions: OK (super-admin role)
    for (const action of ALL_ACTIONS.filter((a) => a.startsWith("operator-"))) {
      assertActionEligibility(ctxCarol, action);
    }
    console.log("[action-eligibility] case-2 Carol→operator actions: 3 PASS");

    // Case 3: Dave (legal-reviewer eligible)
    const ud = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_DAVE_EMAIL}`;
    const { signedToken: tDave } = await createSession(sql, ud[0]!.id);
    const ctxDave = await resolveTenantContext(sql, tDave, INSTANCE_A_ID);

    for (const action of ALL_ACTIONS.filter((a) => a.startsWith("legal-review-"))) {
      assertActionEligibility(ctxDave, action);
    }
    console.log("[action-eligibility] case-3 Dave→legal-review-* (4): PASS");

    // Case 4: Dave→non-legal actions: all reject
    let daveRejects = 0;
    for (const action of ALL_ACTIONS) {
      if (action.startsWith("legal-review-")) continue;
      let rejected = false;
      try { assertActionEligibility(ctxDave, action); } catch (err) {
        if (err instanceof TenantResolveError) rejected = true;
      }
      if (!rejected) throw new Error(`Dave should reject ${action}`);
      daveRejects += 1;
    }
    console.log(`[action-eligibility] case-4 Dave rejects ${daveRejects} non-legal actions (PASS)`);

    // Case 5: Carol promoted (all eligibility true) → all 14 actions OK
    await sql`UPDATE admin_user SET legal_reviewer_eligible = true, physician_reviewer_eligible = true, client_approver_eligible = true WHERE id = ${uc[0]!.id}`;
    const ctxCarol2 = await resolveTenantContext(sql, tCarol, INSTANCE_A_ID);
    for (const action of ALL_ACTIONS) {
      assertActionEligibility(ctxCarol2, action);
    }
    console.log("[action-eligibility] case-5 Carol fully promoted: all 14 actions PASS");
    await sql`UPDATE admin_user SET legal_reviewer_eligible = false, physician_reviewer_eligible = false, client_approver_eligible = false WHERE id = ${uc[0]!.id}`;

    console.log("\n✅ test-action-eligibility: 5 case groups·14 actions enumerated PASS");
  } finally { await sql.end({ timeout: 5 }); }
}

main().catch((err) => { console.error("[action-eligibility] FAIL:", err); process.exit(1); });
