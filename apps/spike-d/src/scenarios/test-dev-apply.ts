// Spike D — test-dev-apply: dev DB에 모든 migration apply 성공
// D.2-2: dev DB apply → 성공

import postgres from "postgres";

import { runMigrate } from "../migrate.js";
import { env } from "../env.js";

async function main(): Promise<void> {
  // reset dev DB first
  const sql = postgres(env.DATABASE_URL_DEV, { max: 1, prepare: false });
  try {
    await sql`DROP TABLE IF EXISTS migration_ledger, audit_event, audit_log, instance_user, content_test CASCADE`;
    await sql`DROP TYPE IF EXISTS content_status CASCADE`;
    await sql`DROP VIEW IF EXISTS tenant_audit_log_view CASCADE`;
  } finally {
    await sql.end({ timeout: 5 });
  }

  const result = await runMigrate({ target: "dev" });

  if (result.applied.length === 0) {
    throw new Error("[dev-apply] no migrations applied");
  }
  console.log(`[dev-apply] applied ${result.applied.length} migrations:`);
  for (const a of result.applied) {
    console.log(`  + ${a.filename} (${a.durationMs}ms)`);
  }

  // 2nd run — all skipped (idempotency)
  const result2 = await runMigrate({ target: "dev" });
  if (result2.applied.length !== 0) {
    throw new Error(`[dev-apply] re-run should skip all, got applied=${result2.applied.length}`);
  }
  if (result2.skipped.length !== result.applied.length) {
    throw new Error(`[dev-apply] re-run skipped count mismatch: applied=${result.applied.length} skipped=${result2.skipped.length}`);
  }
  console.log(`[dev-apply] 2nd run: skipped=${result2.skipped.length} (idempotent)`);

  console.log("\n✅ test-dev-apply: PASS");
}

main().catch((err) => {
  console.error("[dev-apply] FAIL:", err);
  process.exit(1);
});
