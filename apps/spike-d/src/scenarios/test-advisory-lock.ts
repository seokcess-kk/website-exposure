// Spike D — test-advisory-lock: 동시 runMigrate Promise.allSettled (SPIKED1-014)

import postgres from "postgres";

import { runMigrate, loadMigrations } from "../migrate.js";
import { env } from "../env.js";
import { AdvisoryLockNotAcquiredError } from "../errors.js";

async function resetDev(): Promise<void> {
  const sql = postgres(env.DATABASE_URL_DEV, { max: 1, prepare: false });
  try {
    await sql`DROP TABLE IF EXISTS migration_ledger, audit_event, audit_log, instance_user, content_test CASCADE`;
    await sql`DROP TYPE IF EXISTS content_status CASCADE`;
    await sql`DROP VIEW IF EXISTS tenant_audit_log_view CASCADE`;
  } finally {
    await sql.end({ timeout: 5 });
  }
}

async function main(): Promise<void> {
  // === Case A: concurrent two-runner race ===
  await resetDev();

  const [a, b] = await Promise.allSettled([
    runMigrate({ target: "dev" }),
    runMigrate({ target: "dev" }),
  ]);

  // 정확히 한 쪽만 fulfilled with applied > 0·다른 쪽은 AdvisoryLockNotAcquiredError
  const fulfilled = [a, b].filter((r) => r.status === "fulfilled");
  const rejected = [a, b].filter((r) => r.status === "rejected");

  if (fulfilled.length !== 1 || rejected.length !== 1) {
    throw new Error(`[advisory-lock] expected 1 fulfilled + 1 rejected, got fulfilled=${fulfilled.length}, rejected=${rejected.length}`);
  }
  const winnerResult = (fulfilled[0] as PromiseFulfilledResult<Awaited<ReturnType<typeof runMigrate>>>).value;
  const loserReason = (rejected[0] as PromiseRejectedResult).reason;

  if (!(loserReason instanceof AdvisoryLockNotAcquiredError)) {
    throw new Error(`[advisory-lock] loser should AdvisoryLockNotAcquiredError, got ${loserReason instanceof Error ? loserReason.name : loserReason}`);
  }
  console.log(`[advisory-lock] case-A winner applied=${winnerResult.applied.length}, loser=AdvisoryLockNotAcquiredError (PASS)`);

  // ledger row count == migration file count
  const verifySql = postgres(env.DATABASE_URL_DEV, { max: 1, prepare: false });
  try {
    const cnt = await verifySql<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM migration_ledger`;
    const files = await loadMigrations();
    if (cnt[0]!.count !== files.length) {
      throw new Error(`[advisory-lock] ledger count ${cnt[0]!.count} != file count ${files.length}`);
    }
    console.log(`[advisory-lock] case-A ledger count = file count = ${cnt[0]!.count} (no duplicate)`);
  } finally {
    await verifySql.end({ timeout: 5 });
  }

  // === Case B: external holder + reject + release + retry ===
  await resetDev();
  const LOCK_KEY = BigInt(env.MIGRATION_ADVISORY_LOCK_KEY);
  const holder = postgres(env.DATABASE_URL_DEV, { max: 1, prepare: false });
  try {
    const r = await holder<{ pg_try_advisory_lock: boolean }[]>`
      SELECT pg_try_advisory_lock(${LOCK_KEY.toString()}::bigint) AS pg_try_advisory_lock
    `;
    if (r[0]?.pg_try_advisory_lock !== true) throw new Error("holder failed to acquire");

    let rejectErr: unknown = null;
    try {
      await runMigrate({ target: "dev" });
    } catch (err) {
      rejectErr = err;
    }
    if (!(rejectErr instanceof AdvisoryLockNotAcquiredError)) {
      throw new Error("[advisory-lock] case-B should reject with AdvisoryLockNotAcquiredError");
    }
    console.log("[advisory-lock] case-B external holder: REJECTED (PASS)");

    const unlock = await holder<{ pg_advisory_unlock: boolean }[]>`
      SELECT pg_advisory_unlock(${LOCK_KEY.toString()}::bigint) AS pg_advisory_unlock
    `;
    if (unlock[0]?.pg_advisory_unlock !== true) throw new Error("holder unlock should true");
    console.log("[advisory-lock] case-B holder unlock: PASS");
  } finally {
    await holder.end({ timeout: 5 });
  }

  // post-release apply
  const post = await runMigrate({ target: "dev" });
  if (post.applied.length === 0) throw new Error("[advisory-lock] case-B post-release apply should succeed");
  console.log(`[advisory-lock] case-B post-release apply: ${post.applied.length} (PASS)`);

  console.log("\n✅ test-advisory-lock: 2 race cases PASS (concurrent + external holder)");
}

main().catch((err) => {
  console.error("[advisory-lock] FAIL:", err);
  process.exit(1);
});
