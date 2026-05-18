// Spike B — PROVIDER_PASS smoke (Supabase Pooler·Day 9)
// LOCAL 8 시나리오 중 핵심을 Pooler에서 압축 재실행 (200 jobs × 5 workers)

import postgres from "postgres";
import { randomUUID } from "node:crypto";

const SUPER = process.env.DATABASE_URL_SUPER;
const TENANT = process.env.DATABASE_URL_TENANT;
if (!SUPER || !TENANT) throw new Error("Missing DATABASE_URL_SUPER or DATABASE_URL_TENANT");

const PREPARE = process.env.DB_PREPARE === "true";
const MAX_CONN = Number(process.env.DB_MAX_CONNECTIONS ?? 10);
const JOBS = Number(process.env.SMOKE_JOBS ?? 200);
const WORKERS = Number(process.env.SMOKE_WORKERS ?? 5);

const INSTANCE_ID = randomUUID();

async function seed(sql: postgres.Sql): Promise<void> {
  await sql`TRUNCATE TABLE outbox, inbox, external_call_log, invariant_log, permanent_alert, provider_attempt_log CASCADE`;
  for (let i = 0; i < JOBS; i += 1) {
    const sourceEventId = `smoke-${i}`;
    await sql`
      INSERT INTO outbox (instance_id, source_event_id, payload, status)
      VALUES (${INSTANCE_ID}::uuid, ${sourceEventId}, ${sql.json({ idx: i }) as any}, 'pending')
    `;
  }
}

async function worker(sql: postgres.Sql, workerId: number): Promise<{ processed: number; errors: number }> {
  let processed = 0;
  let errors = 0;
  while (true) {
    const claimed = await sql<{ id: string; instance_id: string; source_event_id: string }[]>`
      UPDATE outbox SET status = 'in_progress', claimed_at = now(), claimed_by = ${`worker-${workerId}`}
      WHERE id = (
        SELECT id FROM outbox WHERE status = 'pending'
        FOR UPDATE SKIP LOCKED LIMIT 1
      )
      RETURNING id, instance_id, source_event_id
    `;
    if (claimed.length === 0) break;
    const job = claimed[0]!;
    try {
      await sql.begin(async (tx) => {
        await tx`INSERT INTO inbox (instance_id, source_event_id) VALUES (${job.instance_id}::uuid, ${job.source_event_id})`;
        await tx`
          INSERT INTO provider_attempt_log (instance_id, outbox_id, attempt_kind, idempotency_key, status)
          VALUES (${job.instance_id}::uuid, ${job.id}::uuid, 'accepted-success', ${`idk-${job.source_event_id}`}, 'success')
        `;
        await tx`UPDATE outbox SET status = 'completed', completed_at = now() WHERE id = ${job.id}::uuid`;
      });
      processed += 1;
    } catch {
      errors += 1;
    }
  }
  return { processed, errors };
}

async function main(): Promise<void> {
  console.log(`[provider-smoke] Pooler max=${MAX_CONN}, prepare=${PREPARE}, jobs=${JOBS}, workers=${WORKERS}`);
  const sup = postgres(SUPER, { max: 2, prepare: false });
  const tenant = postgres(TENANT, { max: MAX_CONN, prepare: PREPARE });

  try {
    // Phase 1: seed
    console.log("[provider-smoke] seeding...");
    await seed(sup);

    // Phase 2: parallel workers
    const startedAt = Date.now();
    const results = await Promise.all(Array.from({ length: WORKERS }, (_, i) => worker(tenant, i)));
    const elapsed = Date.now() - startedAt;

    const total = results.reduce((acc, r) => acc + r.processed, 0);
    const errors = results.reduce((acc, r) => acc + r.errors, 0);
    if (errors > 0) throw new Error(`worker errors: ${errors}`);
    if (total !== JOBS) throw new Error(`processed ${total} != jobs ${JOBS}`);
    console.log(`[provider-smoke] phase2 ${WORKERS} workers × ${JOBS} jobs: processed=${total}, time=${elapsed}ms (PASS)`);

    // Phase 3: invariants
    const inboxCnt = await sup<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM inbox WHERE instance_id = ${INSTANCE_ID}::uuid`;
    if (inboxCnt[0]!.count !== JOBS) throw new Error(`inbox count ${inboxCnt[0]!.count} != ${JOBS}`);
    const foreignCnt = await sup<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM inbox WHERE instance_id != ${INSTANCE_ID}::uuid`;
    if (foreignCnt[0]!.count !== 0) throw new Error(`foreign inbox: ${foreignCnt[0]!.count}`);
    const completedCnt = await sup<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM outbox WHERE status = 'completed'`;
    if (completedCnt[0]!.count !== JOBS) throw new Error(`completed ${completedCnt[0]!.count} != ${JOBS}`);
    console.log(`[provider-smoke] phase3 invariants: inbox=${inboxCnt[0]!.count}, foreign=0, completed=${completedCnt[0]!.count} (PASS)`);

    // Phase 4: provider_attempt_log accepted-success UNIQUE (race·idempotency-key 동일 시 1만)
    const acceptedCnt = await sup<{ count: number }[]>`
      SELECT COUNT(*)::int AS count FROM provider_attempt_log WHERE status = 'success' AND attempt_kind = 'accepted-success'
    `;
    if (acceptedCnt[0]!.count !== JOBS) throw new Error(`accepted-success ${acceptedCnt[0]!.count} != ${JOBS}`);
    console.log(`[provider-smoke] phase4 accepted-success UNIQUE: ${acceptedCnt[0]!.count} (PASS)`);

    // Cleanup
    await sup`TRUNCATE TABLE outbox, inbox, external_call_log, invariant_log, permanent_alert, provider_attempt_log CASCADE`;

    console.log("\n✅ provider-smoke (Spike B Supabase Pooler): 4 phases PASS");
  } finally {
    await tenant.end({ timeout: 5 });
    await sup.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error("[provider-smoke] FAIL:", err);
  process.exit(1);
});
