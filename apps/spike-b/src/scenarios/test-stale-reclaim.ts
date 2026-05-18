// Spike B — Scenario 4: stale lock reclaim
// claim 후 worker가 죽었다 가정 → 다른 worker가 stale 후 reclaim → 처리

import { fileURLToPath, pathToFileURL } from "node:url";
import { sql } from "drizzle-orm";
import { enqueueOutbox, getOutboxStats, claimNextOutbox } from "../outbox.ts";
import { processOneJob } from "../worker.ts";
import { getExternalCallStats } from "../fake-provider.ts";
import { closeAll, dbSuper } from "../db.ts";
import { INSTANCE_A } from "../fixtures.ts";
import { errorMessage } from "../errors.ts";
import { NO_INJECTION } from "../failure-injection.ts";

type Result = { passed: boolean; detail: string };

async function main(): Promise<void> {
  console.log(`stale-reclaim test`);
  const results: Result[] = [];

  await dbSuper.execute(sql`TRUNCATE outbox, inbox, external_call_log, provider_attempt_log, permanent_alert`);
  await enqueueOutbox({ instanceId: INSTANCE_A, sourceEventId: "stale-evt-1", payload: {} });

  // 1. worker-A가 claim 후 crash 시뮬레이션 (markCompleted 안 함)
  const claimed = await claimNextOutbox("worker-stale-A", 10 * 60 * 1000); // stale threshold 10분
  results.push({
    passed: claimed !== null && claimed.status === "processing",
    detail: `worker-A claim: ${claimed ? `id=${claimed.id.slice(0, 8)} attempts=${claimed.attempts}` : "null"}`,
  });

  // 2. 즉시 다른 worker가 claim 시도 — 아직 stale threshold 미달 → no-job
  const r2 = await processOneJob({
    workerId: "worker-stale-B-too-early",
    staleAfterMs: 10 * 60 * 1000,
    backoffMs: [10],
    providerConfig: { failBeforeSuccessAttempts: 0, permanentSourceEventIds: new Set() },
    injection: NO_INJECTION,
  });
  results.push({
    passed: r2.outcome === "no-job",
    detail: `worker-B too early (10min threshold): ${r2.outcome}`,
  });

  // 3. stale threshold 0ms로 → 다른 worker reclaim 가능
  const r3 = await processOneJob({
    workerId: "worker-stale-C-reclaim",
    staleAfterMs: 0,
    backoffMs: [10],
    providerConfig: { failBeforeSuccessAttempts: 0, permanentSourceEventIds: new Set() },
    injection: NO_INJECTION,
  });
  results.push({
    passed: r3.outcome === "completed",
    detail: `worker-C reclaim (0ms threshold): ${r3.outcome}`,
  });

  // 4. 최종 invariant
  const stats = await getOutboxStats();
  const ext = await getExternalCallStats();
  const finalPassed = stats.completed === 1 && ext.successUnique === 1 && ext.duplicateSuccess === 0;
  results.push({
    passed: finalPassed,
    detail: `final: outbox.completed=${stats.completed} extSuccess=${ext.successUnique} dup=${ext.duplicateSuccess}`,
  });

  for (const r of results) {
    console.log(`  ${r.passed ? "PASS" : "FAIL"}  ${r.detail}`);
  }
  const allPassed = results.every((r) => r.passed);
  console.log(`stale-reclaim: ${allPassed ? "PASS" : "FAIL"}`);
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
