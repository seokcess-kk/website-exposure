// Spike A — Scenario 2: INSERT/UPDATE/DELETE WITH CHECK
// SPIKEA1-007 정정: UPDATE WITH CHECK reject (instance_id 변경 시도) 추가
// SPIKEA1-001: fixtures.ts 사용

import { sql } from "drizzle-orm";
import { fileURLToPath, pathToFileURL } from "node:url";
import { withTenantTransaction } from "../tenant.ts";
import { closeAll } from "../db.ts";
import { INSTANCE_A, INSTANCE_B } from "../fixtures.ts";
import { errorMessage } from "../errors.ts";

type Result = { passed: boolean; detail: string };

async function main(): Promise<void> {
  const results: Result[] = [];

  // INSERT 1: 자기 instance INSERT — 성공
  const r1 = await withTenantTransaction(INSTANCE_A, async (tx) => {
    const ret = await tx.execute(sql`
      INSERT INTO content_test (instance_id, title)
      VALUES (${INSTANCE_A}::uuid, 'A-self-insert')
      RETURNING id
    `);
    return (ret as unknown as Array<{ id: string }>).length;
  });
  results.push({ passed: r1 === 1, detail: `INSERT self-instance: ${r1} row` });

  // INSERT 2: cross-instance INSERT 시도 — WITH CHECK reject
  let r2Error = "";
  try {
    await withTenantTransaction(INSTANCE_A, async (tx) => {
      await tx.execute(sql`
        INSERT INTO content_test (instance_id, title)
        VALUES (${INSTANCE_B}::uuid, 'A-cross-insert')
      `);
    });
  } catch (e) {
    r2Error = errorMessage(e);
  }
  results.push({
    passed: r2Error.length > 0 && /row-level security|policy/i.test(r2Error),
    detail: `INSERT cross-instance reject: ${r2Error.slice(0, 80) || "no error (FAIL)"}`,
  });

  // SPIKEA1-007 신규: UPDATE WITH CHECK — 자기 row의 instance_id를 다른 tenant로 변경 시도
  let r3Error = "";
  try {
    await withTenantTransaction(INSTANCE_A, async (tx) => {
      await tx.execute(sql`
        UPDATE content_test SET instance_id = ${INSTANCE_B}::uuid
        WHERE instance_id = ${INSTANCE_A}::uuid AND title = 'A-1'
      `);
    });
  } catch (e) {
    r3Error = errorMessage(e);
  }
  results.push({
    passed: r3Error.length > 0 && /row-level security|policy|with check/i.test(r3Error),
    detail: `UPDATE change-tenant WITH CHECK reject: ${r3Error.slice(0, 80) || "no error (FAIL)"}`,
  });

  // UPDATE cross-instance (다른 instance row update 시도) — 0 rows affected (USING fail)
  await withTenantTransaction(INSTANCE_A, async (tx) => {
    await tx.execute(sql`
      UPDATE content_test SET title = 'hijacked'
      WHERE instance_id = ${INSTANCE_B}::uuid
    `);
  });
  const r4check = await withTenantTransaction(INSTANCE_B, async (tx) => {
    const ret = await tx.execute(sql`
      SELECT count(*)::int AS c FROM content_test WHERE title = 'hijacked'
    `);
    return ((ret as unknown as Array<{ c: number }>)[0]?.c) ?? -1;
  });
  results.push({
    passed: r4check === 0,
    detail: `UPDATE cross-instance — instance-b 'hijacked' rows: ${r4check} (passed if 0)`,
  });

  // DELETE cross-instance — 0 rows affected
  await withTenantTransaction(INSTANCE_A, async (tx) => {
    await tx.execute(sql`DELETE FROM content_test WHERE instance_id = ${INSTANCE_B}::uuid`);
  });
  const r5check = await withTenantTransaction(INSTANCE_B, async (tx) => {
    const ret = await tx.execute(sql`SELECT count(*)::int AS c FROM content_test`);
    return ((ret as unknown as Array<{ c: number }>)[0]?.c) ?? -1;
  });
  results.push({
    passed: r5check === 5,
    detail: `DELETE cross-instance — instance-b count: ${r5check} (passed if 5)`,
  });

  for (const r of results) {
    console.log(`  ${r.passed ? "PASS" : "FAIL"}  ${r.detail}`);
  }
  const allPassed = results.every((r) => r.passed);
  console.log(`test-write: ${allPassed ? "PASS" : "FAIL"}`);
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
