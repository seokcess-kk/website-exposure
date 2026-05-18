// Spike E — test-invalid-instance-id (SPIKEE1-007 cycle2): malformed UUID 등 모두 reject
import postgres from "postgres";
import { env } from "../env.js";
import { createSession } from "../session.js";
import { resolveTenantContext } from "../resolve-tenant-context.js";
import { TenantResolveError } from "../errors.js";
import { USER_ALICE_EMAIL } from "../fixtures.js";

async function main(): Promise<void> {
  const sql = postgres(env.DATABASE_URL, { max: 1, prepare: false });
  try {
    const u = await sql<{ id: string }[]>`SELECT id FROM admin_user WHERE email = ${USER_ALICE_EMAIL}`;
    const { signedToken } = await createSession(sql, u[0]!.id);

    const cases = [
      { label: "empty string", value: "" },
      { label: "whitespace only", value: "   " },
      { label: "non-UUID 'abc'", value: "abc" },
      { label: "almost UUID (35 chars)", value: "aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaa" },
      { label: "UUID with extra chars", value: "aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaaX" },
      { label: "UUID with G", value: "gggggggg-gggg-4ggg-gggg-gggggggggggg" },
      { label: "UUID with newline", value: "aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa\n" },
      { label: "SQL injection attempt", value: "aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'; DROP TABLE admin_user; --" },
      // SPIKEE3-003 cycle4: nil·v1·v7·non-RFC variant
      { label: "nil UUID (all-zero)", value: "00000000-0000-0000-0000-000000000000" },
      { label: "v1 UUID (version=1)", value: "12345678-1234-1234-8123-123456789abc" },
      { label: "v7 UUID (version=7)", value: "12345678-1234-7234-8123-123456789abc" },
      { label: "non-RFC variant (c-nibble at pos 20)", value: "aaaaaaaa-aaaa-4aaa-caaa-aaaaaaaaaaaa" },
    ];

    for (const c of cases) {
      let rejected = false;
      try { await resolveTenantContext(sql, signedToken, c.value); } catch (err) {
        if (err instanceof TenantResolveError && err.reason === "instance-mismatch") rejected = true;
      }
      if (!rejected) throw new Error(`[invalid-instance-id] '${c.label}' should reject`);
      console.log(`[invalid-instance-id] '${c.label}': REJECTED (PASS)`);
    }

    // audit emit 검증
    const audit = await sql<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM audit_event WHERE event_type = 'tenant-resolve-denied' AND reason = 'invalid-instance-id'`;
    if (audit[0]!.count < cases.length) throw new Error(`audit count: ${audit[0]!.count}, expected ${cases.length}`);
    console.log(`[invalid-instance-id] audit invalid-instance-id: ${audit[0]!.count} (PASS)`);

    console.log(`\n✅ test-invalid-instance-id: ${cases.length} cases PASS`);
  } finally { await sql.end({ timeout: 5 }); }
}

main().catch((err) => { console.error("[invalid-instance-id] FAIL:", err); process.exit(1); });
