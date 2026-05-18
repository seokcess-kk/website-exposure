// Spike A — Scenario 3: rollback 후 context 누설 검증

import { sql } from "drizzle-orm";
import { fileURLToPath, pathToFileURL } from "node:url";
import { withTenantTransaction } from "../tenant.ts";
import { closeAll, dbTenant } from "../db.ts";
import { INSTANCE_A, INSTANCE_B } from "../fixtures.ts";
import { errorMessage } from "../errors.ts";

type Result = { passed: boolean; detail: string };

async function main(): Promise<void> {
  const results: Result[] = [];

  // 의도적 rollback
  let rollbackThrown = false;
  try {
    await withTenantTransaction(INSTANCE_A, async (tx) => {
      await tx.execute(sql`SELECT * FROM content_test`);
      throw new Error("intentional rollback");
    });
  } catch (e) {
    rollbackThrown = errorMessage(e) === "intentional rollback";
  }
  results.push({ passed: rollbackThrown, detail: `intentional rollback caught` });

  // rollback 후 transaction 밖 direct query — RLS USING NULL → 0 rows
  // (위 SPIKEA1-006: missing context는 silent 0 rows. 별도 throw guard는 assertScopedDb)
  const directResult = await dbTenant.execute(sql`SELECT count(*)::int AS c FROM content_test`);
  const directCount = ((directResult as unknown as Array<{ c: number }>)[0]?.c) ?? -1;
  results.push({
    passed: directCount === 0,
    detail: `direct query (no tenant context): ${directCount} rows (passed if 0 — RLS silent deny)`,
  });

  // 새 transaction (instance-b) — context 누설 없이 정상
  const newTxRows = await withTenantTransaction(INSTANCE_B, async (tx) => {
    const ret = await tx.execute(sql`SELECT count(*)::int AS c FROM content_test`);
    return ((ret as unknown as Array<{ c: number }>)[0]?.c) ?? -1;
  });
  results.push({
    passed: newTxRows === 5,
    detail: `new tx instance-b after rollback: ${newTxRows} rows (passed if 5)`,
  });

  for (const r of results) {
    console.log(`  ${r.passed ? "PASS" : "FAIL"}  ${r.detail}`);
  }
  const allPassed = results.every((r) => r.passed);
  console.log(`test-rollback: ${allPassed ? "PASS" : "FAIL"}`);
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
