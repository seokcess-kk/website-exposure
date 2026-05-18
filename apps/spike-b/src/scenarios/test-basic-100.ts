// Spike B — Scenario 1: 100 outbox·5 worker 정상 처리
// 통과: 100 outbox completed·100 inbox row·100 success external call·foreign instance 0·duplicate 0

import { fileURLToPath, pathToFileURL } from "node:url";
import { enqueueOutbox, getOutboxStats } from "../outbox.ts";
import { runConcurrentWorkers } from "../worker.ts";
import { getExternalCallStats } from "../fake-provider.ts";
import { closeAll, dbSuper } from "../db.ts";
import { INSTANCE_A, INSTANCE_B } from "../fixtures.ts";
import { errorMessage } from "../errors.ts";
import { NO_INJECTION } from "../failure-injection.ts";
import { sql } from "drizzle-orm";

const JOBS = Number(process.env.BASIC_JOBS ?? "100");
const WORKERS = Number(process.env.BASIC_WORKERS ?? "5");

async function main(): Promise<void> {
  console.log(`basic-100: JOBS=${JOBS} WORKERS=${WORKERS}`);

  // SPIKEB3-003: 단독 재실행 시 격리 보장
  await dbSuper.execute(sql`TRUNCATE outbox, inbox, external_call_log, provider_attempt_log, permanent_alert`);

  // outbox seed (절반 instance-a, 절반 instance-b)
  for (let i = 0; i < JOBS; i++) {
    const instanceId = i % 2 === 0 ? INSTANCE_A : INSTANCE_B;
    await enqueueOutbox({
      instanceId,
      sourceEventId: `evt-${i}`,
      payload: { i, label: `job-${i}` },
    });
  }

  const start = Date.now();
  const { perWorker } = await runConcurrentWorkers({
    workerCount: WORKERS,
    maxRoundsPerWorker: JOBS * 2,
    emptyConsecutiveStop: 3,
    configFactory: (idx) => ({
      workerId: `worker-${idx}`,
      staleAfterMs: 5 * 60 * 1000,
      backoffMs: [10, 50, 100, 500, 1000],
      providerConfig: { failBeforeSuccessAttempts: 0, permanentSourceEventIds: new Set() },
      injection: NO_INJECTION,
    }),
  });
  const elapsed = Date.now() - start;

  const stats = await getOutboxStats();
  const ext = await getExternalCallStats();

  // inbox 통계
  const inboxR = await dbSuper.execute(sql`
    SELECT
      count(*)::int AS total,
      count(DISTINCT (instance_id, source_event_id))::int AS unique_count,
      count(*) FILTER (WHERE instance_id NOT IN (${INSTANCE_A}::uuid, ${INSTANCE_B}::uuid))::int AS foreign_count
    FROM inbox
  `);
  const inb = (inboxR as unknown as Array<{ total: number; unique_count: number; foreign_count: number }>)[0];

  console.log("\n=== basic-100 result ===");
  console.log(`  per-worker:`);
  for (const w of perWorker) {
    console.log(`    ${w.workerId}: rounds=${w.rounds} results=${JSON.stringify(w.results)}`);
  }
  console.log(`  outbox: total=${stats.total} completed=${stats.completed} pending=${stats.pending}`);
  console.log(`  inbox: total=${inb?.total} unique=${inb?.unique_count} foreign=${inb?.foreign_count}`);
  console.log(`  external: total=${ext.total} successUnique=${ext.successUnique} duplicateSuccess=${ext.duplicateSuccess}`);
  console.log(`  elapsed: ${elapsed}ms`);

  const passed =
    stats.completed === JOBS &&
    stats.pending === 0 &&
    inb?.total === JOBS &&
    inb?.unique_count === JOBS &&
    (inb?.foreign_count ?? -1) === 0 &&
    ext.successUnique === JOBS &&
    ext.duplicateSuccess === 0;

  console.log(`basic-100: ${passed ? "PASS" : "FAIL"}`);
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
