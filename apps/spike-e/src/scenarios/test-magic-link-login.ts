// Spike E — test-magic-link-login: 발급·1회 consume·만료·재사용 거부
import postgres from "postgres";
import { env } from "../env.js";
import { issueMagicLink, consumeMagicLink, clearMockMailbox, getMockMailbox } from "../magic-link.js";
import { createSession, getActiveSession } from "../session.js";
import { AuthDeniedError } from "../errors.js";
import { USER_ALICE_EMAIL } from "../fixtures.js";

async function main(): Promise<void> {
  const sql = postgres(env.DATABASE_URL, { max: 1, prepare: false });
  try {
    clearMockMailbox();

    // Case 1: issue + consume
    const issued = await issueMagicLink(sql, USER_ALICE_EMAIL);
    if (issued.tokenPlain.length < 32) throw new Error("token too short");
    const mailbox = getMockMailbox();
    if (mailbox.length !== 1 || mailbox[0]!.to !== USER_ALICE_EMAIL) throw new Error("mock mailbox not populated");
    const identifier = await consumeMagicLink(sql, USER_ALICE_EMAIL, issued.tokenPlain);
    if (identifier !== USER_ALICE_EMAIL.toLowerCase()) throw new Error("identifier mismatch");
    console.log("[magic-link] case-1 issue+consume: PASS");

    // Case 2: replay (consume 후 재사용) → magic-link-consumed
    let replayCaught = false;
    try { await consumeMagicLink(sql, USER_ALICE_EMAIL, issued.tokenPlain); } catch (err) {
      if (err instanceof AuthDeniedError && err.reason === "magic-link-consumed") replayCaught = true;
    }
    if (!replayCaught) throw new Error("replay should reject");
    console.log("[magic-link] case-2 replay: REJECTED (PASS)");

    // Case 3: invalid token (signature mismatch / not in DB)
    let invalidCaught = false;
    try { await consumeMagicLink(sql, USER_ALICE_EMAIL, "WRONG_TOKEN_VALUE_xyz_xyz_xyz_xyz"); } catch (err) {
      if (err instanceof AuthDeniedError && err.reason === "magic-link-not-found") invalidCaught = true;
    }
    if (!invalidCaught) throw new Error("invalid token should reject");
    console.log("[magic-link] case-3 invalid token: REJECTED (PASS)");

    // Case 4: expired (manual UPDATE expires to past)
    const expired = await issueMagicLink(sql, USER_ALICE_EMAIL);
    await sql`UPDATE "verificationToken" SET "expires" = now() - interval '1 hour' WHERE "identifier" = ${USER_ALICE_EMAIL} AND "consumedAt" IS NULL`;
    let expiredCaught = false;
    try { await consumeMagicLink(sql, USER_ALICE_EMAIL, expired.tokenPlain); } catch (err) {
      if (err instanceof AuthDeniedError && err.reason === "magic-link-expired") expiredCaught = true;
    }
    if (!expiredCaught) throw new Error("expired should reject");
    console.log("[magic-link] case-4 expired: REJECTED (PASS)");

    // Case 5: session 생성 + lookup
    const userRows = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_ALICE_EMAIL}`;
    if (userRows.length === 0) throw new Error("alice not found");
    const { signedToken, row } = await createSession(sql, userRows[0]!.id);
    const session = await getActiveSession(sql, signedToken);
    if (session.sessionToken !== row.sessionToken) throw new Error("session lookup mismatch");
    console.log("[magic-link] case-5 session create+lookup: PASS");

    // Case 6: session signature tamper → reject
    const tamperedToken = signedToken.slice(0, -2) + "XX";
    let tamperCaught = false;
    try { await getActiveSession(sql, tamperedToken); } catch (err) {
      if (err instanceof AuthDeniedError && err.reason === "session-not-found") tamperCaught = true;
    }
    if (!tamperCaught) throw new Error("tampered session should reject");
    console.log("[magic-link] case-6 session signature tamper: REJECTED (PASS)");

    console.log("\n✅ test-magic-link-login: 6 cases PASS");
  } finally { await sql.end({ timeout: 5 }); }
}

main().catch((err) => { console.error("[magic-link] FAIL:", err); process.exit(1); });
