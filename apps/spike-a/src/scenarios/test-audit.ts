// Spike A — Scenario 5: service-role + audit_log RLS·append-only
// SPIKEA1-009 정정: 1 invocation = 1 audit row 검증
// SPIKEA1-015: append-only 두 층 (permission denied + RLS no-policy)

import { sql } from "drizzle-orm";
import { fileURLToPath, pathToFileURL } from "node:url";
import { randomUUID } from "node:crypto";
import { withTenantTransaction } from "../tenant.ts";
import { withServiceRole } from "../service-role.ts";
import { closeAll, dbServiceRole } from "../db.ts";
import { INSTANCE_A, INSTANCE_B } from "../fixtures.ts";
import { errorMessage } from "../errors.ts";

type Result = { passed: boolean; detail: string };

async function main(): Promise<void> {
  const results: Result[] = [];

  // 1. service-role 사용 — audit log 1 invocation = 1 row (SPIKEA1-009)
  const correlationId = randomUUID();
  // seed audit row 제외 위해 service-role-invoked만 카운트
  const beforeCount = await dbServiceRole.execute(sql`
    SELECT count(*)::int AS c FROM audit_log WHERE action = 'service-role-invoked'
  `);
  const beforeN = (beforeCount as unknown as Array<{ c: number }>)[0]?.c ?? 0;

  await withServiceRole(
    {
      actorId: "test-admin",
      actorRole: "super-admin",
      reasonCode: "spike-a-test",
      ticketRef: "SPIKE-A-001",
      affectedInstanceIds: [INSTANCE_A, INSTANCE_B], // 2 instance
      readWriteClass: "read",
      dryRun: false,
      correlationId,
    },
    "testServiceRoleScenario",
    async () => {
      await dbServiceRole.execute(sql`SELECT count(*) FROM content_test`);
    },
  );

  const afterCount = await dbServiceRole.execute(sql`
    SELECT count(*)::int AS c FROM audit_log WHERE action = 'service-role-invoked'
  `);
  const afterN = (afterCount as unknown as Array<{ c: number }>)[0]?.c ?? 0;
  results.push({
    passed: afterN - beforeN === 1,
    detail: `1 invocation = ${afterN - beforeN} audit row (passed if 1)`,
  });

  // 2. instance-a context에서 자신의 audit만 보임 (representative instance를 A로 set)
  const auditA = await withTenantTransaction(INSTANCE_A, async (tx) => {
    const ret = await tx.execute(sql`
      SELECT instance_id FROM audit_log WHERE action = 'service-role-invoked'
    `);
    return ret as unknown as Array<{ instance_id: string }>;
  });
  const foreignFromA = auditA.filter((r) => r.instance_id !== INSTANCE_A).length;
  results.push({
    passed: foreignFromA === 0 && auditA.length >= 1,
    detail: `instance-a audit: ${auditA.length} rows, foreign: ${foreignFromA}`,
  });

  // 3. append-only layer 1: app_tenant_user GRANT 없음 → permission denied
  let updateError = "";
  try {
    await withTenantTransaction(INSTANCE_A, async (tx) => {
      await tx.execute(sql`UPDATE audit_log SET action = 'tampered' WHERE instance_id = ${INSTANCE_A}::uuid`);
    });
  } catch (e) {
    updateError = errorMessage(e);
  }
  results.push({
    passed: /permission denied|insufficient privilege/i.test(updateError),
    detail: `audit_log UPDATE → permission denied (layer 1): ${updateError.slice(0, 80) || "no error (FAIL)"}`,
  });

  let deleteError = "";
  try {
    await withTenantTransaction(INSTANCE_A, async (tx) => {
      await tx.execute(sql`DELETE FROM audit_log WHERE instance_id = ${INSTANCE_A}::uuid`);
    });
  } catch (e) {
    deleteError = errorMessage(e);
  }
  results.push({
    passed: /permission denied|insufficient privilege/i.test(deleteError),
    detail: `audit_log DELETE → permission denied (layer 1): ${deleteError.slice(0, 80) || "no error (FAIL)"}`,
  });

  // 4. append-only layer 2: super-user 권한 있어도 RLS policy 없으면 (RLS FORCE — super-user는 RLS bypass)
  //    super-user는 BYPASSRLS 기본 — UPDATE/DELETE 모두 가능. layer 2 검증은 super-user 외 role이 GRANT 있는 case.
  //    prototype에서는 layer 1 (GRANT denied)으로 충분 검증. layer 2 직접 검증은 별도 role 필요 (생략 — note만)
  console.log("  note  layer 2 (RLS no-policy)는 별도 role 시 검증 가능. 본 prototype은 layer 1 강제로 충분");

  // 5. cross-instance read 격리 (B context — service-role audit 자체는 A에 insert됐으니 B에서 안 보여야 함)
  const auditB = await withTenantTransaction(INSTANCE_B, async (tx) => {
    const ret = await tx.execute(sql`
      SELECT count(*)::int AS c FROM audit_log WHERE action = 'service-role-invoked'
    `);
    return ((ret as unknown as Array<{ c: number }>)[0]?.c) ?? -1;
  });
  results.push({
    passed: auditB === 0,
    detail: `instance-b audit cross-isolation: ${auditB} rows (passed if 0 — representative instance was A)`,
  });

  for (const r of results) {
    console.log(`  ${r.passed ? "PASS" : "FAIL"}  ${r.detail}`);
  }
  const allPassed = results.every((r) => r.passed);
  console.log(`test-audit: ${allPassed ? "PASS" : "FAIL"}`);
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
