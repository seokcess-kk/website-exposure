// Spike D — test-forward-only-hotfix: fixture migrationsDir (SPIKED1-012)

import postgres from "postgres";
import { mkdir, writeFile, readdir, copyFile, rm } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

import { runMigrate } from "../migrate.js";
import { env } from "../env.js";
import { ForwardOnlyHotfixRejectedError } from "../errors.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCE_MIGRATIONS_DIR = join(__dirname, "..", "..", "migrations");
const HOTFIX_CONTENT = `-- TEST forward-only hotfix
ALTER TABLE content_test DROP COLUMN IF EXISTS legacy_drop_target;
`;

async function createFixtureMigrationsDir(): Promise<string> {
  const dir = join(tmpdir(), `spike-d-fixture-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  await mkdir(dir, { recursive: true });
  const files = await readdir(SOURCE_MIGRATIONS_DIR);
  for (const f of files) {
    if (!/^\d{3,4}_.+\.sql$/.test(f)) continue;
    await copyFile(join(SOURCE_MIGRATIONS_DIR, f), join(dir, f));
  }
  // 추가: hotfix file (forward-only)
  await writeFile(join(dir, "099_forward_only_drop_legacy_column.sql"), HOTFIX_CONTENT, "utf-8");
  return dir;
}

async function main(): Promise<void> {
  // reset dev DB·기본 schema apply
  const cleanSql = postgres(env.DATABASE_URL_DEV, { max: 1, prepare: false });
  try {
    await cleanSql`DROP TABLE IF EXISTS migration_ledger, audit_event, audit_log, instance_user, content_test CASCADE`;
    await cleanSql`DROP TYPE IF EXISTS content_status CASCADE`;
    await cleanSql`DROP VIEW IF EXISTS tenant_audit_log_view CASCADE`;
  } finally {
    await cleanSql.end({ timeout: 5 });
  }

  // 기본 schema apply (source dir로) — legacy_drop_target column 추가
  await runMigrate({ target: "dev" });
  const setupSql = postgres(env.DATABASE_URL_DEV, { max: 1, prepare: false });
  try {
    await setupSql`ALTER TABLE content_test ADD COLUMN IF NOT EXISTS legacy_drop_target TEXT`;
  } finally {
    await setupSql.end({ timeout: 5 });
  }

  // fixture migrationsDir 만들기 (source 변조 금지)
  const fixtureDir = await createFixtureMigrationsDir();

  try {
    // Case 1: no token
    let rejected = false;
    try {
      await runMigrate({ target: "dev", migrationsDir: fixtureDir });
    } catch (err) {
      if (err instanceof ForwardOnlyHotfixRejectedError) rejected = true;
      else throw err;
    }
    if (!rejected) throw new Error("[forward-only] case-1 should reject without token");
    console.log("[forward-only] case-1 no token: REJECTED (PASS)");

    // Case 2: wrong token
    let wrongRejected = false;
    try {
      await runMigrate({ target: "dev", migrationsDir: fixtureDir, forwardOnlyConfirmationToken: "WRONG_TOKEN" });
    } catch (err) {
      if (err instanceof ForwardOnlyHotfixRejectedError) wrongRejected = true;
    }
    if (!wrongRejected) throw new Error("[forward-only] case-2 should reject wrong token");
    console.log("[forward-only] case-2 wrong token: REJECTED (PASS)");

    // Case 3: correct token → apply
    const result = await runMigrate({
      target: "dev",
      migrationsDir: fixtureDir,
      forwardOnlyConfirmationToken: env.SUPER_ADMIN_CONFIRMATION_TOKEN,
    });
    const hotfixApplied = result.applied.find((a) => a.filename.startsWith("099"));
    if (!hotfixApplied) throw new Error("[forward-only] case-3 hotfix should be applied");
    console.log(`[forward-only] case-3 correct token: APPLIED (PASS, ${hotfixApplied.durationMs}ms)`);

    // Case 4: column dropped
    const verifySql = postgres(env.DATABASE_URL_DEV, { max: 1, prepare: false });
    try {
      const cols = await verifySql<{ column_name: string }[]>`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'content_test' AND column_name = 'legacy_drop_target'
      `;
      if (cols.length !== 0) throw new Error("[forward-only] column should be dropped");
    } finally {
      await verifySql.end({ timeout: 5 });
    }
    console.log("[forward-only] case-4 column dropped: PASS");

    // Case 5: source migrations 변조 없음 — source dir에 099 file 없는지 검증
    const sourceFiles = await readdir(SOURCE_MIGRATIONS_DIR);
    const sourceHas099 = sourceFiles.some((f) => f.startsWith("099"));
    if (sourceHas099) throw new Error("[forward-only] case-5 source migrations directory contains 099 — test variant should NOT touch source");
    console.log("[forward-only] case-5 source migrations unmodified: PASS");
  } finally {
    await rm(fixtureDir, { recursive: true, force: true }).catch(() => undefined);
  }

  console.log("\n✅ test-forward-only-hotfix: 5 cases PASS (fixture-isolated migrationsDir)");
}

main().catch((err) => {
  console.error("[forward-only] FAIL:", err);
  process.exit(1);
});
