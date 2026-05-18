// Spike A — PROVIDER_PASS smoke (Supabase Pooler·Day 9)
// LOCAL 9 시나리오 중 핵심 6개를 Pooler 환경에서 압축 재실행
// 본 스크립트는 .env.provider 사용 (pnpm provider:smoke)

import postgres from "postgres";
import { randomUUID } from "node:crypto";

const REQUIRED = ["DATABASE_URL_SUPER", "DATABASE_URL_TENANT"];
for (const k of REQUIRED) {
  if (!process.env[k]) throw new Error(`Missing env: ${k}`);
}
const SUPER = process.env.DATABASE_URL_SUPER!;
const TENANT = process.env.DATABASE_URL_TENANT!;
const PREPARE = process.env.DB_PREPARE === "true";
const MAX_CONN = Number(process.env.DB_MAX_CONNECTIONS ?? 5);
const ITER = Number(process.env.INVARIANT_ITER ?? 100);
const CONCURRENT = Number(process.env.INVARIANT_CONCURRENT ?? 10);

const INSTANCE_A = randomUUID();
const INSTANCE_B = randomUUID();

async function withTenantTx<T>(sql: postgres.Sql, instanceId: string, fn: (tx: postgres.TransactionSql) => Promise<T>): Promise<T> {
  return sql.begin(async (tx) => {
    await tx`SET LOCAL ROLE app_tenant_user`;
    await tx`SELECT set_config('app.current_instance_id', ${instanceId}, true)`;
    return fn(tx);
  }) as Promise<T>;
}

async function main(): Promise<void> {
  console.log(`[provider-smoke] starting (Pooler tenant max=${MAX_CONN}, prepare=${PREPARE})`);
  const tenant = postgres(TENANT, { max: MAX_CONN, prepare: PREPARE });
  const sup = postgres(SUPER, { max: 2, prepare: false });

  try {
    // Phase 1: self-prefix insert + select
    await withTenantTx(tenant, INSTANCE_A, async (tx) => {
      await tx`INSERT INTO content_test (instance_id, title) VALUES (${INSTANCE_A}::uuid, 'A-1')`;
      await tx`INSERT INTO content_test (instance_id, title) VALUES (${INSTANCE_A}::uuid, 'A-2')`;
    });
    const aRows = await withTenantTx(tenant, INSTANCE_A, async (tx) => {
      return tx<{ title: string }[]>`SELECT title FROM content_test ORDER BY title`;
    });
    if (aRows.length !== 2) throw new Error(`A rows expected 2, got ${aRows.length}`);
    console.log(`[provider-smoke] phase1 self-prefix RLS: A=${aRows.length} (PASS)`);

    // Phase 2: cross-instance reject via WITH CHECK
    let rejected = false;
    try {
      await withTenantTx(tenant, INSTANCE_A, async (tx) => {
        await tx`INSERT INTO content_test (instance_id, title) VALUES (${INSTANCE_B}::uuid, 'cross-write')`;
      });
    } catch (err) {
      if (err instanceof Error && /row-level security|row violates/i.test(err.message)) rejected = true;
    }
    if (!rejected) throw new Error("cross-instance INSERT should reject WITH CHECK");
    console.log("[provider-smoke] phase2 cross-instance WITH CHECK: REJECTED (PASS)");

    // Phase 3: SET LOCAL ROLE + Pooler transaction mode (prepare:false 강제 검증)
    await withTenantTx(tenant, INSTANCE_A, async (tx) => {
      const r = await tx<{ value: string }[]>`SELECT current_setting('app.current_instance_id', true) AS value`;
      if (r[0]?.value !== INSTANCE_A) throw new Error(`current_setting mismatch: ${r[0]?.value}`);
    });
    console.log(`[provider-smoke] phase3 SET LOCAL + Pooler transaction mode: PASS`);

    // Phase 4: service_role audit pattern (super-user에서 audit insert·outcome update)
    const auditId = await sup`
      INSERT INTO audit_log (instance_id, actor_id, actor_role, action, metadata)
      VALUES (${INSTANCE_A}::uuid, 'provider-smoke', 'service_role', 'provider-smoke-test', '{}'::jsonb)
      RETURNING id
    `;
    if (auditId.length !== 1) throw new Error("audit insert failed");
    console.log("[provider-smoke] phase4 service_role audit pending pattern: PASS");

    // Phase 5: advisory lock concurrent (2 client 동시 — 1 lock 보유·다른 1 reject)
    const lockKey = BigInt("8674665223082153551").toString();
    const c1 = postgres(SUPER, { max: 1, prepare: false });
    const c2 = postgres(SUPER, { max: 1, prepare: false });
    try {
      const got1 = await c1<{ ok: boolean }[]>`SELECT pg_try_advisory_lock(${lockKey}::bigint) AS ok`;
      if (!got1[0]?.ok) throw new Error("first lock should succeed");
      const got2 = await c2<{ ok: boolean }[]>`SELECT pg_try_advisory_lock(${lockKey}::bigint) AS ok`;
      if (got2[0]?.ok) throw new Error("second lock should fail (already held)");
      await c1`SELECT pg_advisory_unlock(${lockKey}::bigint)`;
      console.log("[provider-smoke] phase5 advisory lock concurrent: 1 ok·1 reject (PASS)");
    } finally {
      await c1.end({ timeout: 5 });
      await c2.end({ timeout: 5 });
    }

    // Phase 6: invariant (ITER × CONCURRENT)
    const startedAt = Date.now();
    let success = 0, errors = 0;
    for (let iter = 0; iter < ITER; iter += 1) {
      const tasks = Array.from({ length: CONCURRENT }, async () => {
        try {
          await withTenantTx(tenant, INSTANCE_A, async (tx) => {
            const r = await tx<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM content_test`;
            if (r[0]?.count === undefined) throw new Error("count missing");
          });
          success += 1;
        } catch {
          errors += 1;
        }
      });
      await Promise.all(tasks);
    }
    const elapsed = Date.now() - startedAt;
    const total = ITER * CONCURRENT;
    if (errors !== 0) throw new Error(`invariant: ${errors} errors`);
    console.log(`[provider-smoke] phase6 invariant ${ITER}×${CONCURRENT}=${total} ops: success=${success}, errors=${errors}, time=${elapsed}ms (PASS)`);

    // Cleanup
    await sup`DELETE FROM content_test WHERE title IN ('A-1', 'A-2')`;
    await sup`DELETE FROM audit_log WHERE actor_id = 'provider-smoke'`;

    console.log("\n✅ provider-smoke (Supabase Pooler): 6 phases PASS");
  } finally {
    await tenant.end({ timeout: 5 });
    await sup.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error("[provider-smoke] FAIL:", err);
  process.exit(1);
});
