// Spike D — test-failure-rollback: partial failure → rollback + recovery (SPIKED1-013)

import postgres from "postgres";
import { mkdir, writeFile, copyFile, readdir, rm } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

import { runMigrate } from "../migrate.js";
import { env } from "../env.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCE_MIGRATIONS_DIR = join(__dirname, "..", "..", "migrations");

async function resetDev(): Promise<void> {
  const sql = postgres(env.DATABASE_URL_DEV, { max: 1, prepare: false });
  try {
    await sql`DROP TABLE IF EXISTS migration_ledger, audit_event, audit_log, instance_user, content_test, broken_test CASCADE`;
    await sql`DROP TYPE IF EXISTS content_status CASCADE`;
    await sql`DROP VIEW IF EXISTS tenant_audit_log_view CASCADE`;
  } finally {
    await sql.end({ timeout: 5 });
  }
}

async function createFixtureWithBrokenMigration(brokenContent: string): Promise<string> {
  const dir = join(tmpdir(), `spike-d-broken-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  await mkdir(dir, { recursive: true });
  const files = await readdir(SOURCE_MIGRATIONS_DIR);
  for (const f of files) {
    if (!/^\d{3,4}_.+\.sql$/.test(f)) continue;
    await copyFile(join(SOURCE_MIGRATIONS_DIR, f), join(dir, f));
  }
  await writeFile(join(dir, "098_broken_migration.sql"), brokenContent, "utf-8");
  return dir;
}

async function main(): Promise<void> {
  await resetDev();

  // === Case 1: partial failure (CREATE TABLE OK + 잘못된 SQL) → rollback ===
  const brokenContent = `
    CREATE TABLE broken_test (id UUID PRIMARY KEY);
    SELECT * FROM nonexistent_table_intentional_fail;
  `;
  const brokenDir = await createFixtureWithBrokenMigration(brokenContent);

  let failed = false;
  try {
    await runMigrate({ target: "dev", migrationsDir: brokenDir });
  } catch {
    failed = true;
  }
  if (!failed) throw new Error("[failure-rollback] case-1 should throw on broken migration");
  console.log("[failure-rollback] case-1 broken migration: THROWN");

  // 검증: broken_test table은 rollback 되어야 함·098 ledger 없음
  const verifySql = postgres(env.DATABASE_URL_DEV, { max: 1, prepare: false });
  try {
    const tableExists = await verifySql<{ exists: boolean }[]>`
      SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='broken_test') AS exists
    `;
    if (tableExists[0]!.exists) throw new Error("[failure-rollback] case-1 broken_test should NOT exist after rollback");
    console.log("[failure-rollback] case-1 broken_test rolled back: PASS");

    const ledgerHas098 = await verifySql<{ exists: boolean }[]>`
      SELECT EXISTS(SELECT 1 FROM migration_ledger WHERE id=98) AS exists
    `;
    if (ledgerHas098[0]!.exists) throw new Error("[failure-rollback] case-1 ledger should NOT have 098");
    console.log("[failure-rollback] case-1 ledger does NOT have 098: PASS");

    // 1~10은 정상 apply (098 전에)
    const ledgerCnt = await verifySql<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM migration_ledger`;
    if (ledgerCnt[0]!.count < 10) throw new Error(`[failure-rollback] case-1 ledger pre-098 count expected >=10, got ${ledgerCnt[0]!.count}`);
    console.log(`[failure-rollback] case-1 ledger pre-098 count: ${ledgerCnt[0]!.count}`);

    // audit_event도 098 entry 없음
    const auditHas098 = await verifySql<{ exists: boolean }[]>`
      SELECT EXISTS(SELECT 1 FROM audit_event WHERE (payload->>'migrationId')::int = 98) AS exists
    `;
    if (auditHas098[0]!.exists) throw new Error("[failure-rollback] case-1 audit_event should NOT have 098");
    console.log("[failure-rollback] case-1 audit_event does NOT have 098: PASS");
  } finally {
    await verifySql.end({ timeout: 5 });
  }

  await rm(brokenDir, { recursive: true, force: true }).catch(() => undefined);

  // === Case 2: fixed migration 재시도 → 정상 apply ===
  const fixedDir = await createFixtureWithBrokenMigration(`
    CREATE TABLE broken_test (id UUID PRIMARY KEY);
  `);
  const result = await runMigrate({ target: "dev", migrationsDir: fixedDir });
  const fixed098 = result.applied.find((a) => a.id === 98);
  if (!fixed098) throw new Error("[failure-rollback] case-2 fixed 098 should apply");
  console.log(`[failure-rollback] case-2 fixed migration applied: ${fixed098.filename}`);

  // broken_test 존재
  const sql2 = postgres(env.DATABASE_URL_DEV, { max: 1, prepare: false });
  try {
    const tbl = await sql2<{ exists: boolean }[]>`
      SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='broken_test') AS exists
    `;
    if (!tbl[0]!.exists) throw new Error("[failure-rollback] case-2 broken_test should exist");
    console.log("[failure-rollback] case-2 broken_test created: PASS");
  } finally {
    await sql2.end({ timeout: 5 });
  }
  await rm(fixedDir, { recursive: true, force: true }).catch(() => undefined);

  console.log("\n✅ test-failure-rollback: 2 cases PASS (per-file transaction rollback + recovery)");
}

main().catch((err) => {
  console.error("[failure-rollback] FAIL:", err);
  process.exit(1);
});
