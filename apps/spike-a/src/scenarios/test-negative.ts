// Spike A — Scenario 7: negative tests (malformed UUID·scopedDb guard·SQL injection·env mistake·service-role guard)
// SPIKEA1-011·012·014 정정

import { sql } from "drizzle-orm";
import { fileURLToPath, pathToFileURL } from "node:url";
import { randomUUID } from "node:crypto";
import { withTenantTransaction, assertScopedDb, TenantContextError } from "../tenant.ts";
import { withServiceRole, BreakGlassError } from "../service-role.ts";
import { closeAll, dbTenant } from "../db.ts";
import { INSTANCE_A } from "../fixtures.ts";
import { errorMessage } from "../errors.ts";

type Result = { passed: boolean; detail: string };

async function main(): Promise<void> {
  const results: Result[] = [];

  // 1. malformed UUID input — TenantContextError (SPIKEA1-011)
  let m1 = "";
  try {
    await withTenantTransaction("not-a-uuid", async () => undefined);
  } catch (e) {
    m1 = errorMessage(e);
  }
  results.push({
    passed: /invalid instanceId/i.test(m1),
    detail: `malformed UUID → TenantContextError: ${m1.slice(0, 80) || "no error (FAIL)"}`,
  });

  // 2. raw SET via set_config — malformed UUID GUC → cast error
  let m2 = "";
  try {
    await dbTenant.transaction(async (tx) => {
      await tx.execute(sql`SET LOCAL ROLE app_tenant_user`);
      await tx.execute(sql`SELECT set_config('app.current_instance_id', 'bad-uuid', true)`);
      await tx.execute(sql`SELECT count(*) FROM content_test`);
    });
  } catch (e) {
    m2 = errorMessage(e);
  }
  results.push({
    passed: /invalid input syntax|uuid/i.test(m2),
    detail: `malformed GUC → cast error: ${m2.slice(0, 80) || "no error (FAIL)"}`,
  });

  // 3. assertScopedDb runtime guard (SPIKEA1-012)
  let m3 = "";
  try {
    assertScopedDb({});
  } catch (e) {
    m3 = errorMessage(e);
  }
  results.push({
    passed: /tenant table access outside/i.test(m3),
    detail: `assertScopedDb non-scoped → throw: ${m3.slice(0, 80) || "no error (FAIL)"}`,
  });

  // 4. assertScopedDb 안에서는 통과
  let m4Passed = false;
  await withTenantTransaction(INSTANCE_A, async (tx) => {
    try {
      assertScopedDb(tx);
      m4Passed = true;
    } catch {
      m4Passed = false;
    }
  });
  results.push({ passed: m4Passed, detail: `assertScopedDb on scoped tx → pass` });

  // 5. SQL injection 시도 — set_config는 parameterized → injection 차단
  // (현재 prototype은 sql template로 자동 parameterized)
  const injectionAttempt = `${INSTANCE_A}'); DROP TABLE content_test; --`;
  let m5 = "";
  try {
    await withTenantTransaction(injectionAttempt, async () => undefined);
  } catch (e) {
    m5 = errorMessage(e);
  }
  results.push({
    passed: /invalid instanceId/i.test(m5),
    detail: `SQL injection attempt blocked by UUID validation: ${m5.slice(0, 80) || "no error (FAIL)"}`,
  });

  // 6. service-role break-glass guard — disallowed function
  let m6 = "";
  try {
    await withServiceRole(
      {
        actorId: "x",
        actorRole: "super-admin",
        reasonCode: "test",
        ticketRef: "TK-1",
        affectedInstanceIds: [INSTANCE_A],
        readWriteClass: "read",
        dryRun: false,
        correlationId: randomUUID(),
      },
      "unknownFunction",
      async () => undefined,
    );
  } catch (e) {
    m6 = errorMessage(e);
  }
  results.push({
    passed: /not allowlisted/i.test(m6) && m6.includes("unknownFunction"),
    detail: `disallowed service-role function → BreakGlassError: ${m6.slice(0, 80) || "no error (FAIL)"}`,
  });

  // 7. service-role guard — disallowed actorRole
  let m7 = "";
  try {
    await withServiceRole(
      {
        actorId: "x",
        actorRole: "operator", // 비허용
        reasonCode: "test",
        ticketRef: "TK-1",
        affectedInstanceIds: [INSTANCE_A],
        readWriteClass: "read",
        dryRun: false,
        correlationId: randomUUID(),
      },
      "testServiceRoleScenario",
      async () => undefined,
    );
  } catch (e) {
    m7 = errorMessage(e);
  }
  results.push({
    passed: /actorRole not allowed/i.test(m7),
    detail: `disallowed actorRole → BreakGlassError: ${m7.slice(0, 80) || "no error (FAIL)"}`,
  });

  // 8. service-role guard — empty ticketRef
  let m8 = "";
  try {
    await withServiceRole(
      {
        actorId: "x",
        actorRole: "super-admin",
        reasonCode: "test",
        ticketRef: "",
        affectedInstanceIds: [INSTANCE_A],
        readWriteClass: "read",
        dryRun: false,
        correlationId: randomUUID(),
      },
      "testServiceRoleScenario",
      async () => undefined,
    );
  } catch (e) {
    m8 = errorMessage(e);
  }
  results.push({
    passed: /ticketRef required/i.test(m8),
    detail: `empty ticketRef → BreakGlassError: ${m8.slice(0, 80) || "no error (FAIL)"}`,
  });

  for (const r of results) {
    console.log(`  ${r.passed ? "PASS" : "FAIL"}  ${r.detail}`);
  }
  const allPassed = results.every((r) => r.passed);
  console.log(`test-negative: ${allPassed ? "PASS" : "FAIL"}`);
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
