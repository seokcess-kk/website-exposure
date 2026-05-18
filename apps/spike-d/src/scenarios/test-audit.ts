// Spike D — test-audit: audit_event count == applied count (SPIKED1-002 cycle2)

import postgres from "postgres";

import { runMigrate } from "../migrate.js";
import { env } from "../env.js";

async function main(): Promise<void> {
  // reset dev
  const cleanSql = postgres(env.DATABASE_URL_DEV, { max: 1, prepare: false });
  try {
    await cleanSql`DROP TABLE IF EXISTS migration_ledger, audit_event, audit_log, instance_user, content_test CASCADE`;
    await cleanSql`DROP TYPE IF EXISTS content_status CASCADE`;
    await cleanSql`DROP VIEW IF EXISTS tenant_audit_log_view CASCADE`;
  } finally {
    await cleanSql.end({ timeout: 5 });
  }

  const result = await runMigrate({ target: "dev" });
  console.log(`[audit] applied ${result.applied.length} migrations`);

  const audSql = postgres(env.DATABASE_URL_DEV, { max: 1, prepare: false });
  try {
    // Case 1: 1:1 — audit_event count == applied count
    const cnt = await audSql<{ count: number }[]>`
      SELECT COUNT(*)::int AS count FROM audit_event WHERE event_type = 'service-role-invoked'
    `;
    const auditCount = cnt[0]!.count;
    if (auditCount !== result.applied.length) {
      throw new Error(`[audit] case-1 expected 1:1 audit (applied=${result.applied.length}, audit=${auditCount})`);
    }
    console.log(`[audit] case-1 1:1 audit count = applied count = ${auditCount} (PASS)`);

    // Case 2: migrationId set == ledger id set
    const auditRows = await audSql<{ payload: { migrationId: number; filename: string; checksum: string } }[]>`
      SELECT payload FROM audit_event WHERE event_type = 'service-role-invoked' ORDER BY (payload->>'migrationId')::int
    `;
    const auditIds = new Set(auditRows.map((r) => r.payload.migrationId));
    const appliedIds = new Set(result.applied.map((a) => a.id));
    if (auditIds.size !== appliedIds.size) {
      throw new Error(`[audit] case-2 migrationId set size mismatch: audit=${auditIds.size}, applied=${appliedIds.size}`);
    }
    for (const id of auditIds) {
      if (!appliedIds.has(id)) throw new Error(`[audit] case-2 audit has unknown migrationId ${id}`);
    }
    console.log(`[audit] case-2 migrationId set == applied set: PASS`);

    // Case 3: service_role_function == migrationRunner for all
    const fns = await audSql<{ service_role_function: string; count: number }[]>`
      SELECT service_role_function, COUNT(*)::int AS count
      FROM audit_event WHERE event_type = 'service-role-invoked'
      GROUP BY service_role_function
    `;
    if (fns.length !== 1 || fns[0]!.service_role_function !== "migrationRunner") {
      throw new Error(`[audit] case-3 expected single service_role_function='migrationRunner', got ${JSON.stringify(fns)}`);
    }
    console.log(`[audit] case-3 single service_role_function=migrationRunner (${fns[0]!.count}): PASS`);

    // Case 4: payload schema validation
    for (const r of auditRows.slice(0, 3)) {
      if (typeof r.payload.migrationId !== "number") throw new Error("audit payload missing migrationId");
      if (typeof r.payload.filename !== "string") throw new Error("audit payload missing filename");
      if (typeof r.payload.checksum !== "string") throw new Error("audit payload missing checksum");
    }
    console.log("[audit] case-4 payload schema (migrationId·filename·checksum): PASS");

    // Case 5: ledger count == applied count == audit count
    const ledgerCnt = await audSql<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM migration_ledger`;
    if (ledgerCnt[0]!.count !== result.applied.length || ledgerCnt[0]!.count !== auditCount) {
      throw new Error(`[audit] case-5 ledger/applied/audit count mismatch: ${ledgerCnt[0]!.count}/${result.applied.length}/${auditCount}`);
    }
    console.log(`[audit] case-5 ledger == applied == audit = ${ledgerCnt[0]!.count}: PASS`);
  } finally {
    await audSql.end({ timeout: 5 });
  }

  console.log("\n✅ test-audit: 5 cases PASS (1:1 audit_event per migration)");
}

main().catch((err) => {
  console.error("[audit] FAIL:", err);
  process.exit(1);
});
