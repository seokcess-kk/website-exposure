// Spike B — Scenario 7: invariant runner
// 1000 jobs × 10 workers × 5 runs — 누적 invariant 검증

import { fileURLToPath, pathToFileURL } from "node:url";
import { randomUUID } from "node:crypto";
import { sql } from "drizzle-orm";
import { enqueueOutbox, getOutboxStats } from "../outbox.ts";
import { runConcurrentWorkers } from "../worker.ts";
import { getExternalCallStats } from "../fake-provider.ts";
import { closeAll, dbSuper } from "../db.ts";
import { INSTANCE_A, INSTANCE_B } from "../fixtures.ts";
import { errorMessage } from "../errors.ts";
import { NO_INJECTION } from "../failure-injection.ts";

const JOBS = Number(process.env.INVARIANT_JOBS ?? "1000");
const WORKERS = Number(process.env.INVARIANT_WORKERS ?? "10");
const RUNS = Number(process.env.INVARIANT_RUNS ?? "5");

async function singleRun(runIdx: number, runId: string): Promise<{ passed: boolean; detail: string }> {
  await dbSuper.execute(sql`TRUNCATE outbox, inbox, external_call_log, provider_attempt_log, permanent_alert`);

  for (let i = 0; i < JOBS; i++) {
    await enqueueOutbox({
      instanceId: i % 2 === 0 ? INSTANCE_A : INSTANCE_B,
      sourceEventId: `inv-${runIdx}-${i}`,
      payload: { runIdx, i },
    });
  }

  const start = Date.now();
  await runConcurrentWorkers({
    workerCount: WORKERS,
    maxRoundsPerWorker: JOBS * 2,
    emptyConsecutiveStop: 3,
    configFactory: (idx) => ({
      workerId: `worker-${runIdx}-${idx}`,
      staleAfterMs: 5 * 60 * 1000,
      backoffMs: [10],
      providerConfig: { failBeforeSuccessAttempts: 0, permanentSourceEventIds: new Set() },
      injection: NO_INJECTION,
    }),
  });
  const elapsed = Date.now() - start;

  const stats = await getOutboxStats();
  const ext = await getExternalCallStats();
  const inboxR = await dbSuper.execute(sql`
    SELECT
      count(*)::int AS total,
      count(DISTINCT (instance_id, source_event_id))::int AS unique_count,
      count(*) FILTER (WHERE instance_id NOT IN (${INSTANCE_A}::uuid, ${INSTANCE_B}::uuid))::int AS foreign_count
    FROM inbox
  `);
  const inb = (inboxR as unknown as Array<{ total: number; unique_count: number; foreign_count: number }>)[0];

  const passed =
    stats.completed === JOBS &&
    stats.pending === 0 &&
    inb?.total === JOBS &&
    inb?.unique_count === JOBS &&
    (inb?.foreign_count ?? -1) === 0 &&
    ext.successUnique === JOBS &&
    ext.duplicateSuccess === 0;

  await dbSuper.execute(sql`
    INSERT INTO invariant_log (
      run_id, scenario, job_count, worker_count, processed,
      inbox_rows, external_success_calls, external_total_calls,
      foreign_instance_inbox, duplicate_inbox, duplicate_external_success,
      pending_outbox, exhausted_outbox, permanent_failed_outbox,
      passed, elapsed_ms
    ) VALUES (
      ${runId}::uuid, ${"invariant-run"}, ${JOBS}, ${WORKERS}, ${stats.completed},
      ${inb?.total ?? 0}, ${ext.successUnique}, ${ext.total},
      ${inb?.foreign_count ?? 0}, ${(inb?.total ?? 0) - (inb?.unique_count ?? 0)}, ${ext.duplicateSuccess},
      ${stats.pending}, ${stats.exhausted}, ${stats.failedPermanent},
      ${passed}, ${elapsed}
    )
  `);

  return {
    passed,
    detail: `run ${runIdx}: completed=${stats.completed}/${JOBS} inbox=${inb?.total} unique=${inb?.unique_count} foreign=${inb?.foreign_count} extSuccess=${ext.successUnique} dup=${ext.duplicateSuccess} elapsed=${elapsed}ms`,
  };
}

async function main(): Promise<void> {
  console.log(`invariant-runner: JOBS=${JOBS} WORKERS=${WORKERS} RUNS=${RUNS}`);
  const runId = randomUUID();

  const results: Array<{ passed: boolean; detail: string }> = [];
  for (let runIdx = 1; runIdx <= RUNS; runIdx++) {
    const r = await singleRun(runIdx, runId);
    console.log(`  ${r.passed ? "PASS" : "FAIL"}  ${r.detail}`);
    results.push(r);
  }

  const allPassed = results.every((r) => r.passed);
  console.log(`invariant-runner: ${allPassed ? "PASS" : "FAIL"}`);
  await closeAll();
  if (!allPassed) process.exit(1);
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
