// Spike D — test-expand-contract: phase별 stopAfter + app_tenant_user RLS path (SPIKED1-008·009)

import postgres from "postgres";

import { runMigrate } from "../migrate.js";
import { env } from "../env.js";

const INSTANCE_ID = "aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa";

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

/**
 * withTenantTransaction helper — Spike A 패턴 reuse.
 * SET LOCAL ROLE app_tenant_user + SET LOCAL app.current_instance_id로 RLS 강제 path 검증.
 */
async function withTenantTx<T>(
  sql: postgres.Sql,
  instanceId: string,
  fn: (tx: postgres.TransactionSql) => Promise<T>,
): Promise<T> {
  return sql.begin(async (tx) => {
    await tx`SET LOCAL ROLE app_tenant_user`;
    await tx`SELECT set_config('app.current_instance_id', ${instanceId}, true)`;
    return fn(tx);
  }) as Promise<T>;
}

async function main(): Promise<void> {
  // === Phase 1: stopAfter=7 (008 미적용 — old writer 상태) ===
  await resetDev();
  const r1 = await runMigrate({ target: "dev", stopAfter: 7 });
  if (r1.applied.find((a) => a.id === 8)) throw new Error("[expand-contract] phase 1: 008 should not be applied");
  console.log(`[expand-contract] phase-1 stopAfter=7: applied ${r1.applied.length} (008 skipped)`);

  // phase 1에서는 published_at column 없음 — old writer는 normal insert 가능
  const sql = postgres(env.DATABASE_URL_DEV, { max: 2, prepare: false });
  try {
    await withTenantTx(sql, INSTANCE_ID, async (tx) => {
      await tx`INSERT INTO content_test (instance_id, title, slug, status) VALUES (${INSTANCE_ID}, 'phase1-draft', 'phase1-draft', 'draft')`;
      await tx`INSERT INTO content_test (instance_id, title, slug, status) VALUES (${INSTANCE_ID}, 'phase1-published', 'phase1-published', 'published')`;
    });
    console.log("[expand-contract] phase-1 RLS insert (draft + published, no published_at column): PASS");

    // === Phase 2: 008 apply (add nullable column) ===
    const r2 = await runMigrate({ target: "dev", stopAfter: 8 });
    if (!r2.applied.find((a) => a.id === 8)) throw new Error("[expand-contract] phase 2: 008 should be applied");
    console.log(`[expand-contract] phase-2 stopAfter=8: 008 applied (add nullable published_at)`);

    // published_at column이 nullable이고 기존 row는 NULL
    const phase2State = await sql<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM content_test WHERE published_at IS NULL`;
    if (phase2State[0]!.count !== 2) throw new Error(`[expand-contract] phase-2 existing rows should have NULL published_at, got ${phase2State[0]!.count}`);

    // dual-writer: new writer can set published_at·old writer still nullable insert
    await withTenantTx(sql, INSTANCE_ID, async (tx) => {
      await tx`INSERT INTO content_test (instance_id, title, slug, status, published_at) VALUES (${INSTANCE_ID}, 'phase2-new', 'phase2-new', 'published', now())`;
      await tx`INSERT INTO content_test (instance_id, title, slug, status) VALUES (${INSTANCE_ID}, 'phase2-old-style', 'phase2-old-style', 'published')`; // no published_at
    });
    console.log("[expand-contract] phase-2 dual-writer (new sets time, old leaves NULL): PASS");

    // === Phase 3: 009 backfill ===
    const r3 = await runMigrate({ target: "dev", stopAfter: 9 });
    if (!r3.applied.find((a) => a.id === 9)) throw new Error("[expand-contract] phase 3: 009 should be applied");
    const backfilled = await sql<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM content_test WHERE status = 'published' AND published_at IS NOT NULL`;
    const publishedTotal = await sql<{ count: number }[]>`SELECT COUNT(*)::int AS count FROM content_test WHERE status = 'published'`;
    if (backfilled[0]!.count !== publishedTotal[0]!.count) {
      throw new Error(`[expand-contract] phase-3 backfill failed: ${backfilled[0]!.count}/${publishedTotal[0]!.count}`);
    }
    console.log(`[expand-contract] phase-3 backfill: ${backfilled[0]!.count}/${publishedTotal[0]!.count} published with published_at`);

    // === Phase 4: 010 CHECK constraint ===
    const r4 = await runMigrate({ target: "dev", stopAfter: 10 });
    if (!r4.applied.find((a) => a.id === 10)) throw new Error("[expand-contract] phase 4: 010 should be applied");
    console.log("[expand-contract] phase-4 stopAfter=10: 010 applied (CHECK)");

    // 4a: draft·published with time → success
    await withTenantTx(sql, INSTANCE_ID, async (tx) => {
      await tx`INSERT INTO content_test (instance_id, title, slug, status, published_at) VALUES (${INSTANCE_ID}, 'phase4-draft', 'phase4-draft', 'draft', NULL)`;
      await tx`INSERT INTO content_test (instance_id, title, slug, status, published_at) VALUES (${INSTANCE_ID}, 'phase4-published', 'phase4-published', 'published', now())`;
    });
    console.log("[expand-contract] phase-4a draft + published-with-time: PASS");

    // 4b: published without published_at → CHECK violation
    let violated = false;
    try {
      await withTenantTx(sql, INSTANCE_ID, async (tx) => {
        await tx`INSERT INTO content_test (instance_id, title, slug, status, published_at) VALUES (${INSTANCE_ID}, 'phase4-bad', 'phase4-bad', 'published', NULL)`;
      });
    } catch (err) {
      if (err instanceof Error && /content_test_published_requires_published_at/.test(err.message)) violated = true;
      else throw err;
    }
    if (!violated) throw new Error("[expand-contract] phase-4b should violate CHECK");
    console.log("[expand-contract] phase-4b published without published_at: CHECK violation (PASS)");

    // 4c: update transition draft → published without time → violate
    let updateViolated = false;
    try {
      await withTenantTx(sql, INSTANCE_ID, async (tx) => {
        await tx`UPDATE content_test SET status='published' WHERE slug='phase4-draft'`;
      });
    } catch (err) {
      if (err instanceof Error && /content_test_published_requires_published_at/.test(err.message)) updateViolated = true;
      else throw err;
    }
    if (!updateViolated) throw new Error("[expand-contract] phase-4c update should violate CHECK");
    console.log("[expand-contract] phase-4c update draft→published without time: CHECK violation (PASS)");

    // 4d: normal transition with time
    await withTenantTx(sql, INSTANCE_ID, async (tx) => {
      await tx`UPDATE content_test SET status='published', published_at=now() WHERE slug='phase4-draft'`;
    });
    console.log("[expand-contract] phase-4d update draft→published with time: PASS");
  } finally {
    await sql.end({ timeout: 5 });
  }

  console.log("\n✅ test-expand-contract: phase 1/2/3/4 stopAfter·app_tenant_user RLS path 모두 PASS");
}

main().catch((err) => {
  console.error("[expand-contract] FAIL:", err);
  process.exit(1);
});
