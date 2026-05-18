// Spike B — Scenario 2: idempotency (v0.2 — SPIKEB1-003·007 정정)
//
// - 동일 sourceEventId 2회 enqueue → 1번만 active (full UNIQUE: completed 포함)
// - completed 후 same sourceEventId 재enqueue → reject (production-like)
// - 동시 enqueue race — Promise.all로 20개 동시 → enqueued=1
// - 동시 worker race — 같은 sourceEventId가 동시에 처리될 수 없음 (UNIQUE 차단)
// - external call accepted-success는 1번만 (provider_attempt_log 검증)

import { fileURLToPath, pathToFileURL } from "node:url";
import { sql } from "drizzle-orm";
import { enqueueOutbox, getOutboxStats } from "../outbox.ts";
import { runConcurrentWorkers } from "../worker.ts";
import { getExternalCallStats, getProviderAttemptStats } from "../fake-provider.ts";
import { closeAll, dbSuper } from "../db.ts";
import { INSTANCE_A } from "../fixtures.ts";
import { errorMessage } from "../errors.ts";
import { NO_INJECTION } from "../failure-injection.ts";

async function main(): Promise<void> {
  console.log(`idempotency test (v0.2)`);
  await dbSuper.execute(sql`TRUNCATE outbox, inbox, external_call_log, provider_attempt_log, permanent_alert`);

  // 1. sequential 2회 enqueue → 1번만 성공 (SPIKEB1-003: full UNIQUE)
  const e1 = await enqueueOutbox({ instanceId: INSTANCE_A, sourceEventId: "dup-evt-1", payload: { i: 1 } });
  const e2 = await enqueueOutbox({ instanceId: INSTANCE_A, sourceEventId: "dup-evt-1", payload: { i: 2 } });
  const t1Passed = e1.enqueued && !e2.enqueued;
  console.log(`  ${t1Passed ? "PASS" : "FAIL"}  sequential idempotency — first=${e1.enqueued} second=${e2.enqueued}`);

  // 2. 동시 enqueue race (SPIKEB1-007) — Promise.all로 20개 동시
  const racePromises = Array.from({ length: 20 }, (_, i) =>
    enqueueOutbox({ instanceId: INSTANCE_A, sourceEventId: "race-evt-1", payload: { i } })
  );
  const raceResults = await Promise.all(racePromises);
  const enqueuedCount = raceResults.filter((r) => r.enqueued).length;

  const outboxRaceR = await dbSuper.execute(sql`
    SELECT count(*)::int AS c FROM outbox WHERE source_event_id='race-evt-1'
  `);
  const outboxRaceN = ((outboxRaceR as unknown as Array<{ c: number }>)[0]?.c) ?? -1;
  const t2Passed = enqueuedCount === 1 && outboxRaceN === 1;
  console.log(`  ${t2Passed ? "PASS" : "FAIL"}  concurrent enqueue race — enqueued=${enqueuedCount}/20 outbox=${outboxRaceN}/1`);

  // 3. worker 처리
  await runConcurrentWorkers({
    workerCount: 2,
    maxRoundsPerWorker: 10,
    emptyConsecutiveStop: 2,
    configFactory: (idx) => ({
      workerId: `worker-${idx}`,
      staleAfterMs: 5 * 60 * 1000,
      backoffMs: [10],
      providerConfig: { failBeforeSuccessAttempts: 0, permanentSourceEventIds: new Set() },
      injection: NO_INJECTION,
    }),
  });

  const stats = await getOutboxStats();
  const ext = await getExternalCallStats();
  const pAttempt = await getProviderAttemptStats();
  const inboxR = await dbSuper.execute(sql`
    SELECT count(*)::int AS c FROM inbox WHERE source_event_id IN ('dup-evt-1', 'race-evt-1')
  `);
  const inboxN = ((inboxR as unknown as Array<{ c: number }>)[0]?.c) ?? -1;

  const t3Passed = stats.completed === 2 && inboxN === 2 && ext.successUnique === 2 && ext.duplicateSuccess === 0 && pAttempt.duplicateAcceptedSuccess === 0;
  console.log(`  ${t3Passed ? "PASS" : "FAIL"}  worker 처리 — outbox.completed=${stats.completed} inbox=${inboxN} extSuccess=${ext.successUnique} dup=${ext.duplicateSuccess} acceptedDup=${pAttempt.duplicateAcceptedSuccess}`);

  // 4. completed 후 same sourceEventId 재enqueue → reject (full UNIQUE)
  const e3 = await enqueueOutbox({ instanceId: INSTANCE_A, sourceEventId: "dup-evt-1", payload: { i: 3 } });
  const t4Passed = !e3.enqueued;
  console.log(`  ${t4Passed ? "PASS" : "FAIL"}  completed 후 same sourceEventId 재enqueue 차단 — enqueued=${e3.enqueued} (passed if false)`);

  const passed = t1Passed && t2Passed && t3Passed && t4Passed;
  console.log(`idempotency: ${passed ? "PASS" : "FAIL"}`);
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
