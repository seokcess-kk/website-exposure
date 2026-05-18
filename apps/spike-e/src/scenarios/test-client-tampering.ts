// Spike E — test-client-tampering: signature 위조·hash 변경·cookie injection 등 모두 server-side reject
import postgres from "postgres";
import { env } from "../env.js";
import { createSession } from "../session.js";
import { resolveTenantContext } from "../resolve-tenant-context.js";
import { getActiveSession } from "../session.js";
import { TenantResolveError, AuthDeniedError } from "../errors.js";
import { INSTANCE_B_ID, USER_ALICE_EMAIL } from "../fixtures.js";
import { randomBytes } from "node:crypto";

async function main(): Promise<void> {
  const sql = postgres(env.DATABASE_URL, { max: 1, prepare: false });
  try {
    const u = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_ALICE_EMAIL}`;
    const { signedToken } = await createSession(sql, u[0]!.id);

    type Tamper = { label: string; tampered: string };
    const cases: Tamper[] = [
      { label: "signature swap last byte", tampered: signedToken.slice(0, -1) + (signedToken.slice(-1) === "A" ? "B" : "A") },
      { label: "opaque swap (다른 random)", tampered: randomBytes(32).toString("base64url") + "." + signedToken.split(".")[1] },
      { label: "drop signature", tampered: signedToken.split(".")[0]! },
      { label: "empty token", tampered: "" },
      { label: "random bytes as token", tampered: randomBytes(48).toString("base64url") },
      { label: "different user crafted token (no signature key)", tampered: randomBytes(32).toString("base64url") + ".ANOTHER_USER_FAKE_SIG" },
    ];

    for (const c of cases) {
      let rejected = false;
      try {
        await resolveTenantContext(sql, c.tampered, INSTANCE_B_ID);
      } catch (err) {
        if (err instanceof TenantResolveError && err.reason === "session-not-found") rejected = true;
      }
      if (!rejected) throw new Error(`[client-tampering] '${c.label}' should reject`);
      console.log(`[client-tampering] '${c.label}': REJECTED (PASS)`);
    }

    // session row 자체를 DELETE 후 valid 서명으로 lookup → still rejected
    const session = await getActiveSession(sql, signedToken);
    await sql`DELETE FROM "session" WHERE "sessionToken" = ${session.sessionToken}`;
    let revokedRejected = false;
    try {
      await getActiveSession(sql, signedToken);
    } catch (err) {
      if (err instanceof AuthDeniedError && err.reason === "session-not-found") revokedRejected = true;
    }
    if (!revokedRejected) throw new Error("revoked session should reject");
    console.log("[client-tampering] revoked session (valid sig but DB row deleted): REJECTED (PASS)");

    console.log(`\n✅ test-client-tampering: ${cases.length + 1} cases PASS`);
  } finally { await sql.end({ timeout: 5 }); }
}

main().catch((err) => { console.error("[client-tampering] FAIL:", err); process.exit(1); });
