// Spike A — Scenario 8: performance baseline (p50·p95)
// SPIKEA2-004 정정: 동일 pgbouncer 경로에서 baseline 분리
//                  withTenantTransaction overhead 정확히 측정

import { sql } from "drizzle-orm";
import { fileURLToPath, pathToFileURL } from "node:url";
import { withTenantTransaction } from "../tenant.ts";
import { closeAll, dbSuper, dbTenant } from "../db.ts";
import { INSTANCE_A } from "../fixtures.ts";
import { errorMessage } from "../errors.ts";

const N = Number(process.env.PERF_N ?? "500");

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.min(sorted.length - 1, Math.floor((sorted.length * p) / 100));
  return sorted[idx]!;
}

function summarize(label: string, samples: number[]) {
  const sorted = [...samples].sort((a, b) => a - b);
  return { label, p50: percentile(sorted, 50), p95: percentile(sorted, 95) };
}

async function main(): Promise<void> {
  console.log(`perf baseline: N=${N}`);

  // Baseline 1: dbSuper direct (RLS bypass·no transaction) — 참고값
  const directBypass: number[] = [];
  for (let i = 0; i < N; i++) {
    const t0 = performance.now();
    await dbSuper.execute(sql`SELECT count(*) FROM content_test WHERE instance_id = ${INSTANCE_A}::uuid`);
    directBypass.push(performance.now() - t0);
  }

  // Baseline 2: dbTenant transaction (pgbouncer 경로·RLS deny) — RLS context 없음. 0 rows 반환
  // RLS overhead 자체 측정용
  const tenantNoCtx: number[] = [];
  for (let i = 0; i < N; i++) {
    const t0 = performance.now();
    await dbTenant.transaction(async (tx) => {
      await tx.execute(sql`SET LOCAL ROLE app_tenant_user`);
      await tx.execute(sql`SELECT count(*) FROM content_test`); // 0 rows by RLS
    });
    tenantNoCtx.push(performance.now() - t0);
  }

  // Baseline 3: dbTenant transaction with full SET LOCAL + RLS query — Hospital case (실제 운영 경로)
  const tenantWithCtx: number[] = [];
  for (let i = 0; i < N; i++) {
    const t0 = performance.now();
    await withTenantTransaction(INSTANCE_A, async (tx) => {
      await tx.execute(sql`SELECT count(*) FROM content_test`);
    });
    tenantWithCtx.push(performance.now() - t0);
  }

  const s1 = summarize("direct-bypass (참고)", directBypass);
  const s2 = summarize("tenant-no-context (RLS deny only)", tenantNoCtx);
  const s3 = summarize("tenant-with-context (실제 경로)", tenantWithCtx);

  console.log("\n=== perf result ===");
  for (const s of [s1, s2, s3]) {
    console.log(`  ${s.label.padEnd(40)} p50 ${s.p50.toFixed(2)}ms · p95 ${s.p95.toFixed(2)}ms`);
  }
  console.log(`  withTenantTransaction overhead vs tenant-no-context:`);
  console.log(`    p50 +${(s3.p50 - s2.p50).toFixed(2)}ms · p95 +${(s3.p95 - s2.p95).toFixed(2)}ms`);
  console.log(`test-perf: measured (correctness 평가 외 — fallback decision metric 참고용)`);

  await closeAll();
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
