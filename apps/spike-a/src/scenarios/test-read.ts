// Spike A — Scenario 1: SELECT 격리 (SPIKEA1-001 — fixtures.ts 분리)
import { sql } from "drizzle-orm";
import { fileURLToPath, pathToFileURL } from "node:url";
import { withTenantTransaction } from "../tenant.ts";
import { closeAll, dbServiceRole } from "../db.ts";
import { INSTANCE_A, INSTANCE_B } from "../fixtures.ts";
import { errorMessage } from "../errors.ts";

type Result = { passed: boolean; detail: string };

async function main(): Promise<void> {
  const results: Result[] = [];

  // A: instance-a context — A row 5건만
  const aRows = await withTenantTransaction(INSTANCE_A, async (tx) => {
    const r = await tx.execute(sql`SELECT instance_id, title FROM content_test ORDER BY title`);
    return r as unknown as Array<{ instance_id: string; title: string }>;
  });
  results.push({
    passed: aRows.length === 5 && aRows.every((r) => r.instance_id === INSTANCE_A),
    detail: `instance-a SELECT: ${aRows.length} rows (foreign: ${aRows.filter((r) => r.instance_id !== INSTANCE_A).length})`,
  });

  // B: instance-b context — B row 5건만
  const bRows = await withTenantTransaction(INSTANCE_B, async (tx) => {
    const r = await tx.execute(sql`SELECT instance_id, title FROM content_test ORDER BY title`);
    return r as unknown as Array<{ instance_id: string; title: string }>;
  });
  results.push({
    passed: bRows.length === 5 && bRows.every((r) => r.instance_id === INSTANCE_B),
    detail: `instance-b SELECT: ${bRows.length} rows (foreign: ${bRows.filter((r) => r.instance_id !== INSTANCE_B).length})`,
  });

  // C: service-role direct (RLS bypass) — 10건 모두
  const allRows = await dbServiceRole.execute(sql`SELECT count(*)::int AS c FROM content_test`);
  const total = (allRows as unknown as Array<{ c: number }>)[0]?.c ?? 0;
  results.push({ passed: total === 10, detail: `service-role total: ${total}` });

  for (const r of results) {
    console.log(`  ${r.passed ? "PASS" : "FAIL"}  ${r.detail}`);
  }
  const allPassed = results.every((r) => r.passed);
  console.log(`test-read: ${allPassed ? "PASS" : "FAIL"}`);
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
