// Spike A — Scenario 4: nested transaction (savepoint) context 유지

import { sql } from "drizzle-orm";
import { fileURLToPath, pathToFileURL } from "node:url";
import { withTenantTransaction } from "../tenant.ts";
import { closeAll } from "../db.ts";
import { INSTANCE_A, INSTANCE_B } from "../fixtures.ts";
import { errorMessage } from "../errors.ts";

type Result = { passed: boolean; detail: string };

async function main(): Promise<void> {
  const results: Result[] = [];

  await withTenantTransaction(INSTANCE_A, async (tx) => {
    const outer = await tx.execute(sql`SELECT count(*)::int AS c FROM content_test`);
    const outerCount = ((outer as unknown as Array<{ c: number }>)[0]?.c) ?? -1;
    results.push({ passed: outerCount === 5, detail: `outer tx: ${outerCount}` });

    await tx.transaction(async (innerTx) => {
      const inner = await innerTx.execute(sql`SELECT count(*)::int AS c FROM content_test`);
      const innerCount = ((inner as unknown as Array<{ c: number }>)[0]?.c) ?? -1;
      results.push({ passed: innerCount === 5, detail: `inner savepoint: ${innerCount}` });

      const cross = await innerTx.execute(sql`
        SELECT count(*)::int AS c FROM content_test WHERE instance_id = ${INSTANCE_B}::uuid
      `);
      const crossCount = ((cross as unknown as Array<{ c: number }>)[0]?.c) ?? -1;
      results.push({ passed: crossCount === 0, detail: `inner cross-instance read: ${crossCount}` });
    });

    const after = await tx.execute(sql`SELECT count(*)::int AS c FROM content_test`);
    const afterCount = ((after as unknown as Array<{ c: number }>)[0]?.c) ?? -1;
    results.push({ passed: afterCount === 5, detail: `outer after inner: ${afterCount}` });
  });

  for (const r of results) {
    console.log(`  ${r.passed ? "PASS" : "FAIL"}  ${r.detail}`);
  }
  const allPassed = results.every((r) => r.passed);
  console.log(`test-nested-tx: ${allPassed ? "PASS" : "FAIL"}`);
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
