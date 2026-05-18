// Spike B — Scenario 8 신규 (SPIKEB1-005): RLS WITH CHECK 음성 경로 직접 검증
//
// worker bug 가정: tenant context는 instance A인데 inbox insert는 instance B로 시도 → RLS WITH CHECK reject

import { fileURLToPath, pathToFileURL } from "node:url";
import { sql } from "drizzle-orm";
import { withTenantTransaction } from "../tenant.ts";
import { closeAll, dbSuper } from "../db.ts";
import { INSTANCE_A, INSTANCE_B } from "../fixtures.ts";
import { errorMessage } from "../errors.ts";

type Result = { passed: boolean; detail: string };

async function main(): Promise<void> {
  console.log(`rls-mismatch test (SPIKEB1-005)`);
  await dbSuper.execute(sql`TRUNCATE outbox, inbox, external_call_log, provider_attempt_log, permanent_alert`);
  const results: Result[] = [];

  // 1. instance A context에서 instance B inbox insert 시도 → WITH CHECK reject
  let m1 = "";
  try {
    await withTenantTransaction(INSTANCE_A, async (tx) => {
      await tx.execute(sql`
        INSERT INTO inbox (instance_id, source_event_id, outbox_id, payload)
        VALUES (${INSTANCE_B}::uuid, 'mismatch-1', ${"00000000-0000-0000-0000-000000000000"}::uuid, '{}'::jsonb)
      `);
    });
  } catch (e) {
    m1 = errorMessage(e);
  }
  results.push({
    passed: /row-level security|policy|with check/i.test(m1),
    detail: `instance A context + instance B insert → reject: ${m1.slice(0, 80) || "no error (FAIL)"}`,
  });

  // 2. instance A context에서 정상 instance A insert → success
  let m2Success = false;
  await withTenantTransaction(INSTANCE_A, async (tx) => {
    await tx.execute(sql`
      INSERT INTO inbox (instance_id, source_event_id, outbox_id, payload)
      VALUES (${INSTANCE_A}::uuid, 'mismatch-2', ${"00000000-0000-0000-0000-000000000000"}::uuid, '{}'::jsonb)
    `);
    m2Success = true;
  });
  results.push({ passed: m2Success, detail: `instance A context + instance A insert → success: ${m2Success}` });

  // 3. UPDATE instance_id 변경 시도 → WITH CHECK reject
  let m3 = "";
  try {
    await withTenantTransaction(INSTANCE_A, async (tx) => {
      await tx.execute(sql`
        UPDATE inbox SET instance_id = ${INSTANCE_B}::uuid WHERE source_event_id = 'mismatch-2'
      `);
    });
  } catch (e) {
    m3 = errorMessage(e);
  }
  results.push({
    passed: /row-level security|policy|with check/i.test(m3),
    detail: `UPDATE change instance_id → reject: ${m3.slice(0, 80) || "no error (FAIL)"}`,
  });

  for (const r of results) {
    console.log(`  ${r.passed ? "PASS" : "FAIL"}  ${r.detail}`);
  }
  const allPassed = results.every((r) => r.passed);
  console.log(`rls-mismatch: ${allPassed ? "PASS" : "FAIL"}`);
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
