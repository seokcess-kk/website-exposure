// Spike B — Scenario 5: retry backoff·exhausted·permanent

import { fileURLToPath, pathToFileURL } from "node:url";
import { sql } from "drizzle-orm";
import { enqueueOutbox, getOutboxStats } from "../outbox.ts";
import { runConcurrentWorkers } from "../worker.ts";
import { getExternalCallStats } from "../fake-provider.ts";
import { closeAll, dbSuper } from "../db.ts";
import { INSTANCE_A } from "../fixtures.ts";
import { errorMessage } from "../errors.ts";
import { NO_INJECTION } from "../failure-injection.ts";

type Result = { passed: boolean; detail: string };

async function main(): Promise<void> {
  console.log(`retry-permanent test`);
  const results: Result[] = [];

  // 1. transient → eventual success (3 fail 후 success, maxAttempts=5)
  await dbSuper.execute(sql`TRUNCATE outbox, inbox, external_call_log, provider_attempt_log, permanent_alert`);
  await enqueueOutbox({ instanceId: INSTANCE_A, sourceEventId: "retry-evt-1", payload: { case: "eventual-success" } });

  await runConcurrentWorkers({
    workerCount: 1,
    maxRoundsPerWorker: 10,
    emptyConsecutiveStop: 3,
    configFactory: () => ({
      workerId: "worker-retry-1",
      staleAfterMs: 0,
      backoffMs: [1, 1, 1, 1, 1], // 1ms backoff for test speed
      providerConfig: { failBeforeSuccessAttempts: 3, permanentSourceEventIds: new Set() },
      injection: NO_INJECTION,
    }),
  });

  const s1 = await getOutboxStats();
  const e1 = await getExternalCallStats();
  results.push({
    passed: s1.completed === 1 && e1.transientFail === 3 && e1.successUnique === 1,
    detail: `eventual-success: completed=${s1.completed} transient=${e1.transientFail} success=${e1.successUnique}`,
  });

  // 2. exhausted (maxAttempts 모두 transient fail)
  await dbSuper.execute(sql`TRUNCATE outbox, inbox, external_call_log, provider_attempt_log, permanent_alert`);
  await enqueueOutbox({
    instanceId: INSTANCE_A,
    sourceEventId: "retry-evt-2",
    payload: { case: "exhausted" },
    maxAttempts: 3,
  });

  await runConcurrentWorkers({
    workerCount: 1,
    maxRoundsPerWorker: 10,
    emptyConsecutiveStop: 3,
    configFactory: () => ({
      workerId: "worker-retry-2",
      staleAfterMs: 0,
      backoffMs: [1],
      providerConfig: { failBeforeSuccessAttempts: 999, permanentSourceEventIds: new Set() }, // 절대 success 안 함
      injection: NO_INJECTION,
    }),
  });

  const s2 = await getOutboxStats();
  const e2 = await getExternalCallStats();
  results.push({
    passed: s2.exhausted === 1 && s2.completed === 0 && e2.successUnique === 0 && e2.transientFail === 3,
    detail: `exhausted: outbox.exhausted=${s2.exhausted} transient=${e2.transientFail} success=${e2.successUnique}`,
  });

  // 3. permanent fail (즉시 failed-permanent)
  await dbSuper.execute(sql`TRUNCATE outbox, inbox, external_call_log, provider_attempt_log, permanent_alert`);
  await enqueueOutbox({ instanceId: INSTANCE_A, sourceEventId: "retry-evt-3", payload: { case: "permanent" } });

  await runConcurrentWorkers({
    workerCount: 1,
    maxRoundsPerWorker: 5,
    emptyConsecutiveStop: 2,
    configFactory: () => ({
      workerId: "worker-retry-3",
      staleAfterMs: 0,
      backoffMs: [1],
      providerConfig: { failBeforeSuccessAttempts: 0, permanentSourceEventIds: new Set(["retry-evt-3"]) },
      injection: NO_INJECTION,
    }),
  });

  const s3 = await getOutboxStats();
  const e3 = await getExternalCallStats();
  results.push({
    passed: s3.failedPermanent === 1 && s3.completed === 0 && e3.permanentFail === 1 && e3.successUnique === 0,
    detail: `permanent: outbox.failed-permanent=${s3.failedPermanent} permFail=${e3.permanentFail} success=${e3.successUnique}`,
  });

  for (const r of results) {
    console.log(`  ${r.passed ? "PASS" : "FAIL"}  ${r.detail}`);
  }
  const allPassed = results.every((r) => r.passed);
  console.log(`retry-permanent: ${allPassed ? "PASS" : "FAIL"}`);
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
