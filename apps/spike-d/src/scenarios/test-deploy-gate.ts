// Spike D — test-deploy-gate: runDeploy with shadow-freshness + drift check (SPIKED1-005·011)

import postgres from "postgres";

import { runDeploy, runMigrate } from "../migrate.js";
import { env } from "../env.js";
import { SchemaDriftError } from "../errors.js";

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
  // === Case 0 (cycle3 SPIKED2-001): pending migration deploy ===
  // prod에 stopAfter=7 까지만 apply → runDeploy → 008·009·010 apply 정상
  await resetDb(env.DATABASE_URL_PROD);
  await resetDb(env.DATABASE_URL_SHADOW);
  await runMigrate({ target: "prod", stopAfter: 7 });

  const r0 = await runDeploy({ target: "prod" });
  const expectedNewApplied = r0.applied.filter((a) => a.id > 7);
  if (expectedNewApplied.length < 3) {
    throw new Error(`[deploy-gate] case-0 pending deploy: expected ≥3 new migrations (008·009·010), got ${expectedNewApplied.length}`);
  }
  console.log(`[deploy-gate] case-0 pending deploy: applied ${expectedNewApplied.length} new migrations (PASS — N-1 → N upgrade)`);

  // Case 1: clean deploy → idempotent (no new migrations)
  const r1 = await runDeploy({ target: "prod" });
  if (r1.applied.length !== 0) throw new Error(`[deploy-gate] case-1 clean idempotent should be 0 applied, got ${r1.applied.length}`);
  console.log(`[deploy-gate] case-1 clean deploy (idempotent): applied=${r1.applied.length}, skipped=${r1.skipped.length} (PASS)`);

  // Case 2: prod에 drift 의도 주입 (column 추가) → runDeploy 거부
  const driftSql = postgres(env.DATABASE_URL_PROD, { max: 1, prepare: false });
  try {
    await driftSql`ALTER TABLE content_test ADD COLUMN ext_drift TEXT`;
  } finally {
    await driftSql.end({ timeout: 5 });
  }

  let driftDetected = false;
  try {
    await runDeploy({ target: "prod" });
  } catch (err) {
    if (err instanceof SchemaDriftError) driftDetected = true;
  }
  if (!driftDetected) throw new Error("[deploy-gate] case-2 should reject with SchemaDriftError after drift");
  console.log("[deploy-gate] case-2 drift detected → deploy ABORTED (PASS)");

  // revert
  const revertSql = postgres(env.DATABASE_URL_PROD, { max: 1, prepare: false });
  try {
    await revertSql`ALTER TABLE content_test DROP COLUMN ext_drift`;
  } finally {
    await revertSql.end({ timeout: 5 });
  }

  // Case 3: CHECK constraint drift (definition-aware)
  const ckSql = postgres(env.DATABASE_URL_PROD, { max: 1, prepare: false });
  try {
    await ckSql`ALTER TABLE content_test DROP CONSTRAINT content_test_slug_regex`;
    await ckSql`ALTER TABLE content_test ADD CONSTRAINT content_test_slug_regex CHECK (slug ~ '^[a-z]')`; // 다른 regex
  } finally {
    await ckSql.end({ timeout: 5 });
  }
  let checkDriftDetected = false;
  try {
    await runDeploy({ target: "prod" });
  } catch (err) {
    if (err instanceof SchemaDriftError && /content_test_slug_regex/.test(err.diff)) checkDriftDetected = true;
  }
  if (!checkDriftDetected) throw new Error("[deploy-gate] case-3 should detect CHECK constraint definition drift");
  console.log("[deploy-gate] case-3 CHECK constraint definition drift → deploy ABORTED (PASS)");

  // revert
  const ckRevert = postgres(env.DATABASE_URL_PROD, { max: 1, prepare: false });
  try {
    await ckRevert`ALTER TABLE content_test DROP CONSTRAINT content_test_slug_regex`;
    await ckRevert`ALTER TABLE content_test ADD CONSTRAINT content_test_slug_regex CHECK (slug ~ '^[a-z0-9][a-z0-9-]{0,99}$')`;
  } finally {
    await ckRevert.end({ timeout: 5 });
  }

  // Case 4: RLS policy qual drift
  const polSql = postgres(env.DATABASE_URL_PROD, { max: 1, prepare: false });
  try {
    await polSql`DROP POLICY tenant_isolation ON content_test`;
    await polSql`CREATE POLICY tenant_isolation ON content_test FOR ALL TO app_tenant_user USING (true) WITH CHECK (true)`;
  } finally {
    await polSql.end({ timeout: 5 });
  }
  let polDriftDetected = false;
  try {
    await runDeploy({ target: "prod" });
  } catch (err) {
    if (err instanceof SchemaDriftError && /tenant_isolation/.test(err.diff)) polDriftDetected = true;
  }
  if (!polDriftDetected) throw new Error("[deploy-gate] case-4 should detect policy qual drift");
  console.log("[deploy-gate] case-4 RLS policy qual drift → deploy ABORTED (PASS)");

  // revert RLS policy
  const polRevert = postgres(env.DATABASE_URL_PROD, { max: 1, prepare: false });
  try {
    await polRevert`DROP POLICY tenant_isolation ON content_test`;
    await polRevert`CREATE POLICY tenant_isolation ON content_test FOR ALL TO app_tenant_user USING (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid) WITH CHECK (instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid)`;
  } finally {
    await polRevert.end({ timeout: 5 });
  }

  // Case 5 (SPIKED3-004 cycle4): view reloptions drift (security_invoker off)
  const viewSql = postgres(env.DATABASE_URL_PROD, { max: 1, prepare: false });
  try {
    await viewSql`DROP VIEW tenant_audit_log_view`;
    // recreate without security_invoker option
    await viewSql`CREATE VIEW tenant_audit_log_view AS SELECT id, instance_id, actor_id, actor_role, action, content_ref, occurred_at FROM audit_log WHERE instance_id = NULLIF(current_setting('app.current_instance_id', true), '')::uuid`;
    await viewSql`GRANT SELECT ON tenant_audit_log_view TO app_tenant_user`;
  } finally {
    await viewSql.end({ timeout: 5 });
  }
  let viewDriftDetected = false;
  let viewDriftDiff: string | null = null;
  try {
    await runDeploy({ target: "prod" });
  } catch (err) {
    if (err instanceof SchemaDriftError) {
      viewDriftDiff = err.diff;
      // SPIKED4-003 cycle5: assertion 강화 — view name AND reloptions 양쪽 명시
      if (/tenant_audit_log_view/.test(err.diff) && /reloptions/.test(err.diff)) {
        viewDriftDetected = true;
      }
    }
  }
  if (!viewDriftDetected) {
    throw new Error(`[deploy-gate] case-5 must detect both view name and reloptions in diff: ${viewDriftDiff}`);
  }
  console.log(`[deploy-gate] case-5 view security_invoker drift → ABORTED (diff contains view name + reloptions) (PASS)`);

  console.log("\n✅ test-deploy-gate: 6 cases PASS (pending + idempotent + column + CHECK + RLS qual + view reloptions)");
}

main().catch((err) => {
  console.error("[deploy-gate] FAIL:", err);
  process.exit(1);
});
