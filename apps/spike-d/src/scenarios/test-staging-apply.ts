// Spike D — test-staging-apply: dev/staging full snapshot equality (SPIKED1-007)

import postgres from "postgres";

import { runMigrate } from "../migrate.js";
import { env } from "../env.js";
import { snapshotForDebug, diffSnapshots } from "../drift-check.js";

async function resetDb(url: string): Promise<void> {
  const sql = postgres(url, { max: 1, prepare: false });
  try {
    await sql`DROP TABLE IF EXISTS migration_ledger, audit_event, audit_log, instance_user, content_test CASCADE`;
    await sql`DROP TYPE IF EXISTS content_status CASCADE`;
    await sql`DROP VIEW IF EXISTS tenant_audit_log_view CASCADE`;
  } finally {
    await sql.end({ timeout: 5 });
  }
}

async function main(): Promise<void> {
  await resetDb(env.DATABASE_URL_DEV);
  await resetDb(env.DATABASE_URL_STAGING);

  const [devR, stagingR] = await Promise.all([
    runMigrate({ target: "dev" }),
    runMigrate({ target: "staging" }),
  ]);

  if (devR.applied.length === 0 || stagingR.applied.length === 0) {
    throw new Error(`[staging-apply] apply failed: dev=${devR.applied.length}, staging=${stagingR.applied.length}`);
  }
  console.log(`[staging-apply] dev applied=${devR.applied.length}·staging applied=${stagingR.applied.length}`);

  // Full snapshot diff (column·constraint·index·policy·view·enum definitions)
  const [devSnap, stagingSnap] = await Promise.all([
    snapshotForDebug("dev"),
    snapshotForDebug("staging"),
  ]);
  const diffs = diffSnapshots(devSnap, stagingSnap);
  if (diffs.length !== 0) {
    throw new Error(`[staging-apply] dev vs staging full snapshot diff (${diffs.length}):\n${diffs.join("\n")}`);
  }
  console.log(`[staging-apply] full snapshot diff: 0 (tables=${devSnap.tables.length}, constraints=${devSnap.constraints.length}, indexes=${devSnap.indexes.length}, policies=${devSnap.policies.length}, views=${devSnap.views.length}, enums=${devSnap.enums.length})`);

  console.log("\n✅ test-staging-apply: PASS (full definition-aware snapshot)");
}

main().catch((err) => {
  console.error("[staging-apply] FAIL:", err);
  process.exit(1);
});
