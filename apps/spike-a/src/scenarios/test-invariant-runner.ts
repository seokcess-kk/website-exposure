// Spike A — Scenario 6: invariant runner — 1000 iter × 20 concurrent
// SPIKEA1-004 정정: PASS 조건에 total_failures === 0 + processed === ITER * CONCURRENCY 포함
// SPIKEA1-001: fixtures.ts 사용

import { sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";
import { withTenantTransaction } from "../tenant.ts";
import { closeAll, dbSuper } from "../db.ts";
import { INSTANCE_A, INSTANCE_B } from "../fixtures.ts";
import { errorMessage } from "../errors.ts";

const ITER = Number(process.env.INVARIANT_ITER ?? "1000");
const CONCURRENCY = Number(process.env.INVARIANT_CONCURRENCY ?? "20");

type LogRow = {
  runId: string;
  iteration: number;
  workerIdx: number;
  expectedInstanceId: string;
  pgBackendPid: number;
  currentUserName: string;
  currentSettingValue: string | null;
  scenario: string;
  resultCount: number;
  foreignInstanceCount: number;
  passed: boolean;
  errorMessage: string | null;
};

async function runOneIteration(
  runId: string,
  iteration: number,
  workerIdx: number,
  expectedInstanceId: string,
): Promise<LogRow> {
  try {
    const r = await withTenantTransaction(expectedInstanceId, async (tx) => {
      const meta = await tx.execute(sql`
        SELECT
          pg_backend_pid() AS pid,
          current_user AS user_name,
          current_setting('app.current_instance_id', true) AS setting_value
      `);
      const m = (meta as unknown as Array<{
        pid: number;
        user_name: string;
        setting_value: string | null;
      }>)[0];

      const rows = await tx.execute(sql`SELECT instance_id FROM content_test`);
      const result = rows as unknown as Array<{ instance_id: string }>;
      const foreignCount = result.filter((r) => r.instance_id !== expectedInstanceId).length;

      return {
        pid: m?.pid ?? -1,
        userName: m?.user_name ?? "",
        settingValue: m?.setting_value ?? null,
        resultCount: result.length,
        foreignCount,
      };
    });

    return {
      runId,
      iteration,
      workerIdx,
      expectedInstanceId,
      pgBackendPid: r.pid,
      currentUserName: r.userName,
      currentSettingValue: r.settingValue,
      scenario: "select-isolation",
      resultCount: r.resultCount,
      foreignInstanceCount: r.foreignCount,
      passed: r.foreignCount === 0 && r.resultCount === 5,
      errorMessage: null,
    };
  } catch (e) {
    return {
      runId,
      iteration,
      workerIdx,
      expectedInstanceId,
      pgBackendPid: -1,
      currentUserName: "",
      currentSettingValue: null,
      scenario: "select-isolation",
      resultCount: 0,
      foreignInstanceCount: 0,
      passed: false,
      errorMessage: errorMessage(e),
    };
  }
}

async function persistBatch(rows: LogRow[]): Promise<void> {
  if (rows.length === 0) return;
  for (const r of rows) {
    await dbSuper.execute(sql`
      INSERT INTO invariant_log (
        run_id, iteration, worker_idx, expected_instance_id,
        pg_backend_pid, current_user_name, current_setting_value,
        scenario, result_count, foreign_instance_count, passed, error_message
      ) VALUES (
        ${r.runId}::uuid, ${r.iteration}, ${r.workerIdx}, ${r.expectedInstanceId}::uuid,
        ${r.pgBackendPid}, ${r.currentUserName}, ${r.currentSettingValue},
        ${r.scenario}, ${r.resultCount}, ${r.foreignInstanceCount}, ${r.passed}, ${r.errorMessage}
      )
    `);
  }
}

async function main(): Promise<void> {
  const runId = randomUUID();
  console.log(`invariant-runner: runId=${runId} iter=${ITER} concurrency=${CONCURRENCY}`);
  const start = Date.now();

  let processed = 0;
  let failures = 0;
  const buffer: LogRow[] = [];

  for (let iter = 1; iter <= ITER; iter++) {
    const promises: Promise<LogRow>[] = [];
    for (let w = 0; w < CONCURRENCY; w++) {
      const expected = w % 2 === 0 ? INSTANCE_A : INSTANCE_B;
      promises.push(runOneIteration(runId, iter, w, expected));
    }
    const results = await Promise.all(promises);
    for (const r of results) {
      if (!r.passed) failures++;
      buffer.push(r);
    }
    processed += CONCURRENCY;

    if (buffer.length >= 100) {
      await persistBatch(buffer);
      buffer.length = 0;
    }
    if (iter % 100 === 0) {
      console.log(`  iter ${iter}/${ITER} (processed=${processed} failures=${failures})`);
    }
  }
  await persistBatch(buffer);

  const elapsed = Date.now() - start;
  const expectedProcessed = ITER * CONCURRENCY;

  const summaryRows = await dbSuper.execute(sql`
    SELECT
      count(*)::int AS total_failures,
      count(*) FILTER (WHERE foreign_instance_count > 0)::int AS foreign_violations,
      count(*) FILTER (WHERE error_message IS NOT NULL)::int AS errors,
      count(*) FILTER (WHERE result_count <> 5)::int AS bad_result_count
    FROM invariant_log
    WHERE run_id = ${runId}::uuid AND passed = false
  `);
  const s = (summaryRows as unknown as Array<{
    total_failures: number;
    foreign_violations: number;
    errors: number;
    bad_result_count: number;
  }>)[0];

  console.log("\n=== invariant-runner result ===");
  console.log(`  processed: ${processed} (expected ${expectedProcessed})`);
  console.log(`  total failures: ${s?.total_failures ?? 0}`);
  console.log(`  foreign violations: ${s?.foreign_violations ?? 0}`);
  console.log(`  errors: ${s?.errors ?? 0}`);
  console.log(`  bad result_count: ${s?.bad_result_count ?? 0}`);
  console.log(`  elapsed: ${(elapsed / 1000).toFixed(1)}s`);

  // SPIKEA1-004 정정: 완전한 PASS 조건
  const passed =
    processed === expectedProcessed &&
    (s?.total_failures ?? 0) === 0 &&
    (s?.foreign_violations ?? 0) === 0 &&
    (s?.errors ?? 0) === 0 &&
    (s?.bad_result_count ?? 0) === 0;
  console.log(`invariant-runner: ${passed ? "PASS" : "FAIL"}`);
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
