// Spike B — Scenario 6: foreign instance write 0건
// 100 outbox (50 A·50 B)·5 worker 동시 처리·inbox는 RLS WITH CHECK로 cross-instance write 차단

import { fileURLToPath, pathToFileURL } from "node:url";
import { sql } from "drizzle-orm";
import { enqueueOutbox, getOutboxStats } from "../outbox.ts";
import { runConcurrentWorkers } from "../worker.ts";
import { closeAll, dbSuper } from "../db.ts";
import { INSTANCE_A, INSTANCE_B } from "../fixtures.ts";
import { errorMessage } from "../errors.ts";
import { NO_INJECTION } from "../failure-injection.ts";

async function main(): Promise<void> {
  console.log(`no-cross-tenant test`);
  await dbSuper.execute(sql`TRUNCATE outbox, inbox, external_call_log, provider_attempt_log, permanent_alert`);

  const JOBS = 100;
  for (let i = 0; i < JOBS; i++) {
    await enqueueOutbox({
      instanceId: i % 2 === 0 ? INSTANCE_A : INSTANCE_B,
      sourceEventId: `cross-evt-${i}`,
      payload: { i },
    });
  }

  await runConcurrentWorkers({
    workerCount: 5,
    maxRoundsPerWorker: JOBS * 2,
    emptyConsecutiveStop: 3,
    configFactory: (idx) => ({
      workerId: `worker-cross-${idx}`,
      staleAfterMs: 5 * 60 * 1000,
      backoffMs: [10],
      providerConfig: { failBeforeSuccessAttempts: 0, permanentSourceEventIds: new Set() },
      injection: NO_INJECTION,
    }),
  });

  const r = await dbSuper.execute(sql`
    SELECT
      count(*) FILTER (WHERE instance_id = ${INSTANCE_A}::uuid)::int AS a_count,
      count(*) FILTER (WHERE instance_id = ${INSTANCE_B}::uuid)::int AS b_count,
      count(*) FILTER (WHERE instance_id NOT IN (${INSTANCE_A}::uuid, ${INSTANCE_B}::uuid))::int AS foreign_count
    FROM inbox
  `);
  const row = (r as unknown as Array<{ a_count: number; b_count: number; foreign_count: number }>)[0];

  console.log(`  inbox A: ${row?.a_count} (expected 50)`);
  console.log(`  inbox B: ${row?.b_count} (expected 50)`);
  console.log(`  inbox foreign: ${row?.foreign_count} (expected 0)`);

  const stats = await getOutboxStats();
  console.log(`  outbox completed: ${stats.completed}`);

  const passed =
    row?.a_count === 50 &&
    row?.b_count === 50 &&
    row?.foreign_count === 0 &&
    stats.completed === JOBS;

  console.log(`no-cross-tenant: ${passed ? "PASS" : "FAIL"}`);
  await closeAll();
  if (!passed) process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const argv1 = process.argv[1];
if (argv1 && pathToFileURL(argv1).href === pathToFileURL(__filename).href) {
  main().catch(async (e) => {
    console.error(errorMessage(e));
    await closeAll();
    process.exit(1);
  });
}
