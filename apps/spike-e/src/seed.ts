// Spike E — seed (cycle2 patch: role enum SoT 정합)
// Alice: instance-A operator
// Bob: instance-B operator
// Carol: super-admin·membership 없음
// Dave: instance-A legal-reviewer·legal_reviewer_eligible=true
// Eve: instance-A legal-reviewer·legal_reviewer_eligible=false

import postgres from "postgres";

import { env } from "./env.js";
import { INSTANCE_A_ID, INSTANCE_B_ID, USER_ALICE_EMAIL, USER_BOB_EMAIL, USER_CAROL_EMAIL, USER_DAVE_EMAIL, USER_EVE_EMAIL } from "./fixtures.js";

async function main(): Promise<void> {
  const sql = postgres(env.DATABASE_URL, { max: 1, prepare: false });
  try {
    await sql`TRUNCATE TABLE audit_event, "verificationToken", "session", instance_membership, admin_user RESTART IDENTITY CASCADE`;

    const inserted = await sql<{ id: string; email: string }[]>`
      INSERT INTO admin_user (email, display_name, active, is_super_admin, legal_reviewer_eligible, physician_reviewer_eligible, client_approver_eligible)
      VALUES
        (${USER_ALICE_EMAIL}, 'Alice', true, false, false, false, false),
        (${USER_BOB_EMAIL}, 'Bob', true, false, false, false, false),
        (${USER_CAROL_EMAIL}, 'Carol Super', true, true, false, false, false),
        (${USER_DAVE_EMAIL}, 'Dave Legal', true, false, true, false, false),
        (${USER_EVE_EMAIL}, 'Eve Candidate', true, false, false, false, false)
      RETURNING id, email
    `;
    const userMap = new Map(inserted.map((r) => [r.email, r.id]));

    await sql`
      INSERT INTO instance_membership (user_id, instance_id, role) VALUES
        (${userMap.get(USER_ALICE_EMAIL)!}, ${INSTANCE_A_ID}::uuid, 'operator'),
        (${userMap.get(USER_BOB_EMAIL)!}, ${INSTANCE_B_ID}::uuid, 'operator'),
        (${userMap.get(USER_DAVE_EMAIL)!}, ${INSTANCE_A_ID}::uuid, 'legal-reviewer'),
        (${userMap.get(USER_EVE_EMAIL)!}, ${INSTANCE_A_ID}::uuid, 'legal-reviewer')
    `;

    console.log(`[seed] ${inserted.length} users + 4 memberships inserted`);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((err) => { console.error("[seed] failed:", err); process.exit(1); });
