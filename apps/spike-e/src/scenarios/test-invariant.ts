// Spike E — invariant: N users × M instances × X resolve attempts
// 모든 cross-instance resolve가 정확히 TenantResolveError로 reject·self resolve가 정확히 성공·audit count 정합

import postgres from "postgres";
import { randomUUID } from "node:crypto";

import { env } from "../env.js";
import { createSession } from "../session.js";
import { resolveTenantContext } from "../resolve-tenant-context.js";
import { TenantResolveError, InvariantViolationError } from "../errors.js";

const N_USERS = 5;
const M_INSTANCES = 4;
const X_CROSS_ATTEMPTS = 100;

async function main(): Promise<void> {
  const sql = postgres(env.DATABASE_URL, { max: 1, prepare: false });
  try {
    // setup: N users·M instances·user[i] member of instance[i % M]
    await sql`TRUNCATE TABLE audit_event, "verificationToken", "session", instance_membership, admin_user RESTART IDENTITY CASCADE`;

    const userIds: string[] = [];
    const instanceIds: string[] = Array.from({ length: M_INSTANCES }, () => randomUUID());

    for (let i = 0; i < N_USERS; i += 1) {
      const email = `invariant-user-${i}@example.com`;
      const r = await sql<{ id: string }[]>`
        INSERT INTO admin_user (email, display_name, active) VALUES (${email}, 'User '||${i}, true) RETURNING id
      `;
      const userId = r[0]!.id;
      userIds.push(userId);
      const ownInstance = instanceIds[i % M_INSTANCES]!;
      await sql`INSERT INTO instance_membership (user_id, instance_id, role) VALUES (${userId}, ${ownInstance}::uuid, 'operator')`;
    }

    const sessions: { userId: string; signedToken: string; ownInstance: string }[] = [];
    for (let i = 0; i < N_USERS; i += 1) {
      const { signedToken } = await createSession(sql, userIds[i]!);
      sessions.push({ userId: userIds[i]!, signedToken, ownInstance: instanceIds[i % M_INSTANCES]! });
    }

    // Phase 1: self resolve N times each (= N * resolves)
    let selfSuccess = 0;
    for (const s of sessions) {
      for (let j = 0; j < 5; j += 1) {
        const ctx = await resolveTenantContext(sql, s.signedToken, s.ownInstance);
        if (ctx.instanceId !== s.ownInstance) throw new InvariantViolationError("self resolve instance mismatch", { ctx, s });
        selfSuccess += 1;
      }
    }

    // Phase 2: cross-instance attempts
    let crossDenied = 0;
    let unexpected = 0;
    for (let i = 0; i < X_CROSS_ATTEMPTS; i += 1) {
      const s = sessions[Math.floor(Math.random() * sessions.length)]!;
      // pick instance that s does NOT belong to
      let target = instanceIds[Math.floor(Math.random() * instanceIds.length)]!;
      while (target === s.ownInstance) target = instanceIds[Math.floor(Math.random() * instanceIds.length)]!;
      try {
        await resolveTenantContext(sql, s.signedToken, target);
        throw new InvariantViolationError("cross resolve did NOT reject", { s, target });
      } catch (err) {
        if (err instanceof InvariantViolationError) throw err;
        if (err instanceof TenantResolveError && err.reason === "membership-not-found") crossDenied += 1;
        else unexpected += 1;
      }
    }

    if (unexpected !== 0) throw new InvariantViolationError("unexpected errors in cross attempts", { unexpected });

    // Audit invariants
    const audit = await sql<{ event_type: string; count: number }[]>`
      SELECT event_type, COUNT(*)::int AS count FROM audit_event GROUP BY event_type
    `;
    const auditMap = new Map(audit.map((r) => [r.event_type, r.count]));
    const resolvedCount = auditMap.get("tenant-resolved") ?? 0;
    const deniedCount = auditMap.get("tenant-resolve-denied") ?? 0;
    if (resolvedCount !== selfSuccess) throw new InvariantViolationError("audit tenant-resolved mismatch", { resolvedCount, selfSuccess });
    if (deniedCount !== crossDenied) throw new InvariantViolationError("audit tenant-resolve-denied mismatch", { deniedCount, crossDenied });

    console.log(`[invariant] users=${N_USERS} instances=${M_INSTANCES} selfSuccess=${selfSuccess} crossDenied=${crossDenied} unexpected=${unexpected}`);
    console.log(`[invariant] audit: tenant-resolved=${resolvedCount}, tenant-resolve-denied=${deniedCount}`);
    console.log("\n✅ test-invariant: PASS");
  } finally { await sql.end({ timeout: 5 }); }
}

main().catch((err) => { console.error("[invariant] FAIL:", err); process.exit(1); });
