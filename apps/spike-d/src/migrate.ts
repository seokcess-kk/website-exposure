// Spike D — migration runner
// cycle2 patch:
//   - SPIKED1-001: 005 ledger IF NOT EXISTS·ensureLedger byte-for-byte 동등
//   - SPIKED1-002: audit_event bootstrap·1:1 강제 (silent 제거)
//   - SPIKED1-005: deploy mode (drift check 통합)
//   - SPIKED1-010: dedicated migration user (옵션·super-user URL reject)
//   - SPIKED1-012: migrationsDir 옵션 (test fixture isolation)
//   - SPIKED1-013: partial failure rollback (per-file transaction 이미·failure injection 시나리오 별도)

import postgres from "postgres";
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { env, type DbTarget, getDatabaseUrl } from "./env.js";
import {
  AdvisoryLockNotAcquiredError,
  MigrationChecksumMismatchError,
  MigrationAuditError,
  SchemaDriftError,
} from "./errors.js";
import {
  assertServiceRoleAllowed,
  assertForwardOnlyHotfixApproved,
  type ServiceRoleContext,
} from "./service-role.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_MIGRATIONS_DIR = resolve(__dirname, "../migrations");

export type MigrationFile = {
  readonly id: number;
  readonly filename: string;
  readonly content: string;
  readonly checksum: string;
  readonly isForwardOnly: boolean;
};

function detectForwardOnly(filename: string): boolean {
  return /_forward_only_/.test(filename);
}

export async function loadMigrations(migrationsDir: string = DEFAULT_MIGRATIONS_DIR): Promise<MigrationFile[]> {
  const files = (await readdir(migrationsDir))
    .filter((f) => /^\d{3,4}_.+\.sql$/.test(f))
    .sort();
  const result: MigrationFile[] = [];
  for (const filename of files) {
    const fullPath = join(migrationsDir, filename);
    const content = await readFile(fullPath, "utf-8");
    const idMatch = /^(\d{3,4})_/.exec(filename);
    if (!idMatch) throw new Error(`invalid migration filename: ${filename}`);
    const id = Number(idMatch[1]);
    const checksum = createHash("sha256").update(content).digest("hex");
    result.push({ id, filename, content, checksum, isForwardOnly: detectForwardOnly(filename) });
  }
  return result;
}

const ADVISORY_LOCK_KEY = BigInt(env.MIGRATION_ADVISORY_LOCK_KEY);

async function tryAcquireAdvisoryLock(sql: postgres.Sql): Promise<boolean> {
  const result = await sql<{ pg_try_advisory_lock: boolean }[]>`
    SELECT pg_try_advisory_lock(${ADVISORY_LOCK_KEY.toString()}::bigint) AS pg_try_advisory_lock
  `;
  return result[0]?.pg_try_advisory_lock === true;
}

async function releaseAdvisoryLock(sql: postgres.Sql): Promise<boolean> {
  const r = await sql<{ pg_advisory_unlock: boolean }[]>`
    SELECT pg_advisory_unlock(${ADVISORY_LOCK_KEY.toString()}::bigint) AS pg_advisory_unlock
  `;
  return r[0]?.pg_advisory_unlock === true;
}

/**
 * ensureLedger: 005와 byte-for-byte 동등 schema·IF NOT EXISTS로 idempotent.
 * SPIKED1-001 cycle2: 005 schema와 정확히 일치.
 */
async function ensureLedger(sql: postgres.Sql): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS migration_ledger (
      id INTEGER PRIMARY KEY,
      filename TEXT NOT NULL UNIQUE,
      checksum TEXT NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      applied_by TEXT NOT NULL,
      service_role_function TEXT NOT NULL,
      target_db TEXT NOT NULL,
      duration_ms INTEGER
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS migration_ledger_applied_at_idx ON migration_ledger (applied_at DESC)`;
}

/**
 * ensureAuditEvent: 006과 byte-for-byte 동등·IF NOT EXISTS로 idempotent.
 * SPIKED1-002 cycle2: 001 이전 bootstrap·모든 migration이 1:1 audit emit 가능.
 */
async function ensureAuditEvent(sql: postgres.Sql): Promise<void> {
  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;
  await sql`
    CREATE TABLE IF NOT EXISTS audit_event (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      event_type TEXT NOT NULL,
      actor_id TEXT NOT NULL,
      actor_role TEXT NOT NULL,
      service_role_function TEXT,
      target_db TEXT,
      payload JSONB NOT NULL DEFAULT '{}'::jsonb,
      occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS audit_event_type_time_idx ON audit_event (event_type, occurred_at DESC)`;
}

async function getAppliedLedger(sql: postgres.Sql): Promise<Map<number, { filename: string; checksum: string }>> {
  const rows = await sql<{ id: number; filename: string; checksum: string }[]>`
    SELECT id, filename, checksum FROM migration_ledger ORDER BY id
  `;
  const map = new Map<number, { filename: string; checksum: string }>();
  for (const row of rows) map.set(row.id, { filename: row.filename, checksum: row.checksum });
  return map;
}

export type MigrateOptions = {
  readonly target: DbTarget;
  readonly migrationsDir?: string;
  readonly actorId?: string;
  readonly serviceRoleFunction?: string;
  readonly forwardOnlyConfirmationToken?: string;
  /** stopAfter: 지정된 migration id 까지만 apply (expand/contract phase별 검증용) */
  readonly stopAfter?: number;
};

export type MigrateResult = {
  readonly target: DbTarget;
  readonly applied: ReadonlyArray<{ id: number; filename: string; durationMs: number }>;
  readonly skipped: ReadonlyArray<{ id: number; filename: string; reason: string }>;
};

export async function runMigrate(opts: MigrateOptions): Promise<MigrateResult> {
  const ctx: ServiceRoleContext = {
    function: opts.serviceRoleFunction ?? "migrationRunner",
    actorId: opts.actorId ?? "migrate-cli",
    targetDb: opts.target,
  };
  assertServiceRoleAllowed(ctx);

  const migrationsDir = opts.migrationsDir ?? DEFAULT_MIGRATIONS_DIR;
  const url = getDatabaseUrl(opts.target);
  const sql = postgres(url, { max: 1, prepare: false });
  const applied: { id: number; filename: string; durationMs: number }[] = [];
  const skipped: { id: number; filename: string; reason: string }[] = [];
  let lockAcquired = false;

  try {
    // 1) Advisory lock
    const got = await tryAcquireAdvisoryLock(sql);
    if (!got) {
      throw new AdvisoryLockNotAcquiredError(String(ADVISORY_LOCK_KEY));
    }
    lockAcquired = true;

    // 2) Bootstrap: ledger + audit_event 동시에 ready (이후 모든 migration이 1:1 audit emit)
    await ensureLedger(sql);
    await ensureAuditEvent(sql);
    const ledger = await getAppliedLedger(sql);

    // 3) Load migration files
    const files = await loadMigrations(migrationsDir);

    for (const file of files) {
      if (opts.stopAfter !== undefined && file.id > opts.stopAfter) {
        skipped.push({ id: file.id, filename: file.filename, reason: "stop-after-reached" });
        continue;
      }

      const prior = ledger.get(file.id);
      if (prior) {
        if (prior.checksum !== file.checksum) {
          throw new MigrationChecksumMismatchError(file.filename, prior.checksum, file.checksum);
        }
        skipped.push({ id: file.id, filename: file.filename, reason: "already-applied" });
        continue;
      }

      // 4) Forward-only hotfix guard
      if (file.isForwardOnly) {
        assertForwardOnlyHotfixApproved(file.filename, opts.forwardOnlyConfirmationToken);
      }

      // 5) Per-file transaction: SQL + ledger insert + audit emit 모두 atomic
      // SPIKED1-002 cycle2: audit_event를 transaction 안에서 emit·실패 시 ledger·audit 모두 rollback
      const startedAt = Date.now();
      let durationMs = 0;
      await sql.begin(async (tx) => {
        await tx.unsafe(file.content);
        durationMs = Date.now() - startedAt;
        await tx`
          INSERT INTO migration_ledger (id, filename, checksum, applied_by, service_role_function, target_db, duration_ms)
          VALUES (${file.id}, ${file.filename}, ${file.checksum}, ${ctx.actorId}, ${ctx.function}, ${ctx.targetDb}, ${durationMs})
        `;
        // SPIKED1-002: 1:1 audit emit·migration 실패 시 함께 rollback
        await tx`
          INSERT INTO audit_event (event_type, actor_id, actor_role, service_role_function, target_db, payload)
          VALUES ('service-role-invoked', ${ctx.actorId}, 'service_role', ${ctx.function}, ${ctx.targetDb}, ${tx.json({
            migrationId: file.id,
            filename: file.filename,
            checksum: file.checksum,
            durationMs,
            isForwardOnly: file.isForwardOnly,
          })})
        `;
      });
      applied.push({ id: file.id, filename: file.filename, durationMs });
    }
  } finally {
    if (lockAcquired) {
      try { await releaseAdvisoryLock(sql); } catch { /* best-effort */ }
    }
    await sql.end({ timeout: 5 });
  }

  return { target: opts.target, applied, skipped };
}

/**
 * Deploy coordinator advisory lock — runDeploy 전체를 single critical section으로 보호.
 * SPIKED2-002 cycle3: shadow reset/apply 도 lock 안에서 실행되도록.
 * Key는 migration lock과 다른 값 사용 — namespace 분리.
 */
const DEPLOY_COORDINATOR_LOCK_KEY = ADVISORY_LOCK_KEY + BigInt(1);

async function tryAcquireDeployLock(sql: postgres.Sql): Promise<boolean> {
  const r = await sql<{ pg_try_advisory_lock: boolean }[]>`
    SELECT pg_try_advisory_lock(${DEPLOY_COORDINATOR_LOCK_KEY.toString()}::bigint) AS pg_try_advisory_lock
  `;
  return r[0]?.pg_try_advisory_lock === true;
}

async function releaseDeployLock(sql: postgres.Sql): Promise<void> {
  await sql`SELECT pg_advisory_unlock(${DEPLOY_COORDINATOR_LOCK_KEY.toString()}::bigint)`;
}

async function getTargetCurrentMaxMigrationId(target: DbTarget): Promise<number> {
  const url = getDatabaseUrl(target);
  const sql = postgres(url, { max: 1, prepare: false });
  try {
    // migration_ledger 존재 여부 먼저
    const hasLedger = await sql<{ exists: boolean }[]>`
      SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='migration_ledger') AS exists
    `;
    if (!hasLedger[0]?.exists) return 0;
    const r = await sql<{ max: number | null }[]>`SELECT COALESCE(MAX(id), 0)::int AS max FROM migration_ledger`;
    return r[0]?.max ?? 0;
  } finally {
    await sql.end({ timeout: 5 });
  }
}

/**
 * Schema-wide reset (SPIKED3-003 cycle4): public schema 자체 drop·재생성.
 * 새 migration이 어떤 object (table·type·view·sequence·function·trigger·matview·extension)을 만들어도
 * 다음 deploy 시 partial state 잔존 없이 clean slate 보장.
 * 단, custom role/extension은 schema-level 외 잔존 — 별도 explicit handling.
 */
async function resetShadow(): Promise<void> {
  const sql = postgres(getDatabaseUrl("shadow"), { max: 1, prepare: false });
  try {
    await sql`DROP SCHEMA IF EXISTS public CASCADE`;
    await sql`CREATE SCHEMA public`;
    await sql`GRANT ALL ON SCHEMA public TO postgres`;
    await sql`GRANT USAGE, CREATE ON SCHEMA public TO PUBLIC`;
  } finally {
    await sql.end({ timeout: 5 });
  }
}

/**
 * runDeploy: production-grade deploy wrapper.
 * SPIKED2-001 cycle3: pending migration 정상 deploy 지원 — target ledger 기준 stage shadow.
 * SPIKED2-002 cycle3: deploy coordinator lock — 전체 critical section.
 *
 * Flow:
 *   1. deploy coordinator lock (shadow DB에 보유 — deploy-wide)
 *   2. shadow reset
 *   3. shadow에 target current max id까지만 apply (stage shadow == 현재 target schema)
 *   4. checkDriftAgainstShadow(target) — pre-migrate drift 0 검증
 *   5. shadow에 나머지 migration 마저 apply (filesystem full set)
 *   6. target migrate
 *   7. checkDriftAgainstShadow(target) — post-migrate drift 0 재검증
 *   8. release deploy coordinator lock
 */
export async function runDeploy(opts: { target: DbTarget; migrationsDir?: string; forwardOnlyConfirmationToken?: string }): Promise<MigrateResult> {
  if (opts.target === "shadow") throw new Error("runDeploy(target=shadow) not allowed");

  const coordSql = postgres(getDatabaseUrl("shadow"), { max: 1, prepare: false });
  let coordHeld = false;
  try {
    coordHeld = await tryAcquireDeployLock(coordSql);
    if (!coordHeld) throw new AdvisoryLockNotAcquiredError(String(DEPLOY_COORDINATOR_LOCK_KEY));

    // Stage 1: target 현재 max migration id 파악
    const targetCurrent = await getTargetCurrentMaxMigrationId(opts.target);
    const files = await loadMigrations(opts.migrationsDir);
    if (files.length === 0) throw new Error("no migrations found");

    // Stage 2: shadow reset + target current id까지 apply
    await resetShadow();
    const { checkDriftAgainstShadow } = await import("./drift-check.js");

    // SPIKED3-001 cycle4·SPIKED4-001 cycle5: targetCurrent=0인 경우 empty-target deploy
    //   - 모든 public schema user-visible object를 검사 (BASE TABLE만 아니라 enum·view·matview·function·policy·trigger·sequence)
    //   - leftover object 있으면 reject — partial poison 회피
    if (targetCurrent === 0) {
      const tgtSql = postgres(getDatabaseUrl(opts.target), { max: 1, prepare: false });
      try {
        // 다양한 user-visible object 검사 (SPIKED5-001 cycle6: DOMAIN·foreign table·collation 추가)
        const counts = await tgtSql<{ obj_type: string; count: number }[]>`
          SELECT 'table' AS obj_type, COUNT(*)::int AS count FROM pg_class c JOIN pg_namespace n ON c.relnamespace=n.oid WHERE n.nspname='public' AND c.relkind IN ('r','p')
          UNION ALL
          SELECT 'view', COUNT(*)::int FROM pg_class c JOIN pg_namespace n ON c.relnamespace=n.oid WHERE n.nspname='public' AND c.relkind IN ('v','m')
          UNION ALL
          SELECT 'foreign_table', COUNT(*)::int FROM pg_class c JOIN pg_namespace n ON c.relnamespace=n.oid WHERE n.nspname='public' AND c.relkind='f'
          UNION ALL
          SELECT 'sequence', COUNT(*)::int FROM pg_class c JOIN pg_namespace n ON c.relnamespace=n.oid WHERE n.nspname='public' AND c.relkind='S'
          UNION ALL
          SELECT 'enum_or_composite_type', COUNT(*)::int FROM pg_type t JOIN pg_namespace n ON t.typnamespace=n.oid WHERE n.nspname='public' AND t.typtype IN ('e','c') AND NOT EXISTS (SELECT 1 FROM pg_class c WHERE c.relname=t.typname AND c.relnamespace=t.typnamespace)
          UNION ALL
          SELECT 'domain', COUNT(*)::int FROM pg_type t JOIN pg_namespace n ON t.typnamespace=n.oid WHERE n.nspname='public' AND t.typtype='d'
          UNION ALL
          SELECT 'range_type', COUNT(*)::int FROM pg_type t JOIN pg_namespace n ON t.typnamespace=n.oid WHERE n.nspname='public' AND t.typtype IN ('r','m')
          UNION ALL
          SELECT 'function', COUNT(*)::int FROM pg_proc p JOIN pg_namespace n ON p.pronamespace=n.oid WHERE n.nspname='public' AND p.prokind IN ('f','p','a')
          UNION ALL
          SELECT 'policy', COUNT(*)::int FROM pg_policy pol JOIN pg_class c ON pol.polrelid=c.oid JOIN pg_namespace n ON c.relnamespace=n.oid WHERE n.nspname='public'
          UNION ALL
          SELECT 'trigger', COUNT(*)::int FROM pg_trigger tr JOIN pg_class c ON tr.tgrelid=c.oid JOIN pg_namespace n ON c.relnamespace=n.oid WHERE n.nspname='public' AND NOT tr.tgisinternal
          UNION ALL
          SELECT 'collation', COUNT(*)::int FROM pg_collation co JOIN pg_namespace n ON co.collnamespace=n.oid WHERE n.nspname='public'
        `;
        const leftover = counts.filter((r) => r.count > 0);
        if (leftover.length > 0) {
          const summary = leftover.map((r) => `${r.obj_type}=${r.count}`).join(", ");
          throw new Error(`target ${opts.target} has no migration_ledger but public schema has leftover objects (${summary}) — manual cleanup required`);
        }
      } finally {
        await tgtSql.end({ timeout: 5 });
      }
      // skip pre-drift, proceed directly to shadow full apply + target migrate
    } else {
      // pending deploy: shadow stage at target current
      await runMigrate({
        target: "shadow",
        migrationsDir: opts.migrationsDir,
        forwardOnlyConfirmationToken: opts.forwardOnlyConfirmationToken,
        stopAfter: targetCurrent,
      });
      // Stage 3: pre-migrate drift check
      await checkDriftAgainstShadow(opts.target);
    }

    // Stage 4: shadow에 나머지 migration 모두 apply (post-deploy 예상 schema)
    const shadowResult = await runMigrate({
      target: "shadow",
      migrationsDir: opts.migrationsDir,
      forwardOnlyConfirmationToken: opts.forwardOnlyConfirmationToken,
    });
    const shadowApplied = new Set(
      shadowResult.applied.map((a) => a.id)
        .concat(shadowResult.skipped.filter((s) => s.reason === "already-applied").map((s) => s.id))
    );
    for (const f of files) {
      if (!shadowApplied.has(f.id)) {
        throw new MigrationAuditError(`shadow incomplete: ${f.filename} (id ${f.id}) not applied`);
      }
    }

    // Stage 5: target migrate
    const targetResult = await runMigrate({
      target: opts.target,
      migrationsDir: opts.migrationsDir,
      forwardOnlyConfirmationToken: opts.forwardOnlyConfirmationToken,
    });

    // Stage 6: post-migrate drift check (target now matches full shadow)
    await checkDriftAgainstShadow(opts.target);

    return targetResult;
  } finally {
    if (coordHeld) {
      try { await releaseDeployLock(coordSql); } catch { /* best-effort */ }
    }
    await coordSql.end({ timeout: 5 });
  }
}

// CLI entry
async function main(): Promise<void> {
  const arg = process.argv[2];
  if (!arg) {
    console.error("usage: tsx src/migrate.ts <dev|staging|shadow|prod|deploy-prod|deploy-staging|reset>");
    process.exit(1);
  }

  if (arg === "reset") {
    const targets: DbTarget[] = ["dev", "staging", "shadow", "prod"];
    for (const t of targets) {
      const url = getDatabaseUrl(t);
      const sql = postgres(url, { max: 1, prepare: false });
      try {
        await sql`DROP TABLE IF EXISTS migration_ledger, audit_event, audit_log, instance_user, content_test CASCADE`;
        await sql`DROP TYPE IF EXISTS content_status CASCADE`;
        await sql`DROP VIEW IF EXISTS tenant_audit_log_view CASCADE`;
        console.log(`[reset] ${t} cleaned`);
      } finally {
        await sql.end({ timeout: 5 });
      }
    }
    return;
  }

  if (arg === "deploy-prod" || arg === "deploy-staging") {
    const target = arg === "deploy-prod" ? "prod" : "staging";
    const token = process.env.FORWARD_ONLY_CONFIRMATION;
    const result = await runDeploy({ target, forwardOnlyConfirmationToken: token });
    console.log(`[deploy:${target}] applied=${result.applied.length} skipped=${result.skipped.length}`);
    for (const a of result.applied) console.log(`  + ${a.filename} (${a.durationMs}ms)`);
    return;
  }

  const target = arg as DbTarget;
  if (!(["dev", "staging", "shadow", "prod"] as const).includes(target)) {
    console.error(`invalid target: ${arg}`);
    process.exit(1);
  }

  const token = process.env.FORWARD_ONLY_CONFIRMATION;
  const result = await runMigrate({ target, forwardOnlyConfirmationToken: token });
  console.log(`[migrate:${target}] applied=${result.applied.length} skipped=${result.skipped.length}`);
  for (const a of result.applied) console.log(`  + ${a.filename} (${a.durationMs}ms)`);
  for (const s of result.skipped) console.log(`  = ${s.filename} (${s.reason})`);
}

const invoked = process.argv[1] && process.argv[1].endsWith("migrate.ts");
if (invoked) {
  main().catch((err) => {
    console.error("[migrate] failed:", err);
    process.exit(1);
  });
}
