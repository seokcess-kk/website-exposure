// Spike D — test-drift-check: shadow DB vs prod schema 비교
// D.2-4: production schema와 다르면 deploy fail (100% detect)

import postgres from "postgres";

import { runMigrate } from "../migrate.js";
import { checkDriftAgainstShadow } from "../drift-check.js";
import { env } from "../env.js";
import { SchemaDriftError } from "../errors.js";

async function resetAndApply(target: "shadow" | "prod"): Promise<void> {
  const url = target === "shadow" ? env.DATABASE_URL_SHADOW : env.DATABASE_URL_PROD;
  const sql = postgres(url, { max: 1, prepare: false });
  try {
    await sql`DROP TABLE IF EXISTS migration_ledger, audit_event, audit_log, instance_user, content_test CASCADE`;
    await sql`DROP TYPE IF EXISTS content_status CASCADE`;
    await sql`DROP VIEW IF EXISTS tenant_audit_log_view CASCADE`;
  } finally {
    await sql.end({ timeout: 5 });
  }
  await runMigrate({ target });
}

async function main(): Promise<void> {
  await resetAndApply("shadow");
  await resetAndApply("prod");

  // Case 1: shadow + prod 동일 schema → drift 0
  await checkDriftAgainstShadow("prod");
  console.log("[drift-check] case-1 shadow == prod: PASS (no drift)");

  // Case 2: prod에 schema drift 의도 주입 (column 추가)
  const prodSql = postgres(env.DATABASE_URL_PROD, { max: 1, prepare: false });
  try {
    await prodSql`ALTER TABLE content_test ADD COLUMN extra_drift_column TEXT`;
  } finally {
    await prodSql.end({ timeout: 5 });
  }

  let driftDetected = false;
  try {
    await checkDriftAgainstShadow("prod");
  } catch (err) {
    if (err instanceof SchemaDriftError) {
      driftDetected = true;
      console.log(`[drift-check] case-2 detected drift:\n${err.diff.split("\n").map((d) => "    " + d).join("\n")}`);
    } else {
      throw err;
    }
  }
  if (!driftDetected) {
    throw new Error("[drift-check] case-2 should detect drift after ADD COLUMN");
  }
  console.log("[drift-check] case-2 column-add drift: DETECTED (PASS)");

  // Case 3: revert drift·재검증 → no drift
  const revertSql = postgres(env.DATABASE_URL_PROD, { max: 1, prepare: false });
  try {
    await revertSql`ALTER TABLE content_test DROP COLUMN extra_drift_column`;
  } finally {
    await revertSql.end({ timeout: 5 });
  }
  await checkDriftAgainstShadow("prod");
  console.log("[drift-check] case-3 drift reverted: PASS (no drift)");

  // Case 4: index drift (extra index 추가) → DETECTED
  const idxSql = postgres(env.DATABASE_URL_PROD, { max: 1, prepare: false });
  try {
    await idxSql`CREATE INDEX content_test_drift_idx ON content_test (title)`;
  } finally {
    await idxSql.end({ timeout: 5 });
  }
  let idxDriftDetected = false;
  try {
    await checkDriftAgainstShadow("prod");
  } catch (err) {
    if (err instanceof SchemaDriftError) idxDriftDetected = true;
  }
  if (!idxDriftDetected) throw new Error("[drift-check] case-4 should detect index drift");
  console.log("[drift-check] case-4 index-add drift: DETECTED (PASS)");

  // revert
  const cleanSql = postgres(env.DATABASE_URL_PROD, { max: 1, prepare: false });
  try {
    await cleanSql`DROP INDEX content_test_drift_idx`;
  } finally {
    await cleanSql.end({ timeout: 5 });
  }

  // Case 5: RLS policy drift (extra policy) → DETECTED
  const polSql = postgres(env.DATABASE_URL_PROD, { max: 1, prepare: false });
  try {
    await polSql`CREATE POLICY extra_drift_policy ON content_test FOR SELECT TO app_tenant_user USING (true)`;
  } finally {
    await polSql.end({ timeout: 5 });
  }
  let polDriftDetected = false;
  try {
    await checkDriftAgainstShadow("prod");
  } catch (err) {
    if (err instanceof SchemaDriftError) polDriftDetected = true;
  }
  if (!polDriftDetected) throw new Error("[drift-check] case-5 should detect policy drift");
  console.log("[drift-check] case-5 policy-add drift: DETECTED (PASS)");

  console.log("\n✅ test-drift-check: 5 cases PASS");
}

main().catch((err) => {
  console.error("[drift-check] FAIL:", err);
  process.exit(1);
});
