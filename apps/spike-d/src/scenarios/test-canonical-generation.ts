// Spike D — test-canonical-generation: drizzle-kit generate 실 실행 + 생성 SQL 검증 (SPIKED1-003)

import { execSync } from "node:child_process";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

import { getTableConfig } from "drizzle-orm/pg-core";
import { contentTest, instanceUser, auditLog, migrationLedger, auditEvent } from "../db/schema.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "..", "..");

// SPIKED5-002 cycle6: schema.ts contract — table·column names 명시 일치
const SCHEMA_CONTRACT: ReadonlyArray<{ name: string; table: any; expectedColumns: ReadonlyArray<string> }> = [
  {
    name: "content_test",
    table: contentTest,
    expectedColumns: ["id", "instance_id", "parent_id", "title", "slug", "status", "published_at", "created_at"],
  },
  {
    name: "instance_user",
    table: instanceUser,
    expectedColumns: ["id", "instance_id", "user_id", "role", "active", "created_at"],
  },
  {
    name: "audit_log",
    table: auditLog,
    expectedColumns: ["id", "instance_id", "actor_id", "actor_role", "action", "content_ref", "metadata", "occurred_at"],
  },
  {
    name: "migration_ledger",
    table: migrationLedger,
    expectedColumns: ["id", "filename", "checksum", "applied_at", "applied_by", "service_role_function", "target_db", "duration_ms"],
  },
  {
    name: "audit_event",
    table: auditEvent,
    expectedColumns: ["id", "event_type", "actor_id", "actor_role", "service_role_function", "target_db", "payload", "occurred_at"],
  },
];

function assertSchemaContract(): void {
  for (const c of SCHEMA_CONTRACT) {
    const cfg = getTableConfig(c.table);
    if (cfg.name !== c.name) {
      throw new Error(`[schema-contract] table name mismatch: schema.ts has '${cfg.name}', expected '${c.name}'`);
    }
    const actualCols = cfg.columns.map((col) => col.name).sort();
    const expectedCols = [...c.expectedColumns].sort();
    if (actualCols.length !== expectedCols.length) {
      throw new Error(`[schema-contract] ${c.name} column count: schema.ts=${actualCols.length}, expected=${expectedCols.length}. schema=[${actualCols.join(",")}]`);
    }
    for (let i = 0; i < expectedCols.length; i += 1) {
      if (actualCols[i] !== expectedCols[i]) {
        throw new Error(`[schema-contract] ${c.name} column at ${i}: schema.ts='${actualCols[i]}', expected='${expectedCols[i]}'`);
      }
    }
    console.log(`  [schema-contract] ✓ ${c.name}: ${actualCols.length} columns`);
  }
}

type Pattern = {
  readonly label: string;
  readonly regex: RegExp;
  readonly canonical: boolean;
  readonly note: string;
};

const CANONICAL_PATTERNS: ReadonlyArray<Pattern> = [
  { label: "content_status enum CREATE TYPE", regex: /CREATE\s+TYPE\s+(?:["']?public["']?\.)?["']?content_status["']?\s+AS\s+ENUM/i, canonical: true, note: "pgEnum" },
  { label: "content_test CREATE TABLE", regex: /CREATE\s+TABLE\s+["']?content_test["']?/i, canonical: true, note: "pgTable" },
  { label: "title nonempty CHECK", regex: /CONSTRAINT\s+["']?content_test_title_nonempty["']?\s+CHECK/i, canonical: true, note: "check()" },
  { label: "slug regex CHECK", regex: /CONSTRAINT\s+["']?content_test_slug_regex["']?\s+CHECK/i, canonical: true, note: "check() with sql template" },
  { label: "published_at CHECK", regex: /content_test_published_requires_published_at/i, canonical: true, note: "complex CHECK" },
  { label: "composite FK", regex: /CONSTRAINT\s+["']?content_test_parent_fk["']?\s+FOREIGN\s+KEY/i, canonical: true, note: "foreignKey() multi-column" },
  { label: "partial unique instance_user", regex: /CREATE\s+UNIQUE\s+INDEX\s+["']?instance_user_active_unique["']?[^;]+WHERE/i, canonical: true, note: "uniqueIndex().where()" },
  { label: "partial index published_at", regex: /CREATE\s+INDEX\s+["']?content_test_published_at_idx["']?[^;]+WHERE/i, canonical: true, note: "index().where()" },
  { label: "migration_ledger table", regex: /CREATE\s+TABLE\s+["']?migration_ledger["']?/i, canonical: true, note: "pgTable" },
  { label: "audit_event table", regex: /CREATE\s+TABLE\s+["']?audit_event["']?/i, canonical: true, note: "pgTable" },
  { label: "audit_log JSONB metadata", regex: /["']?metadata["']?\s+jsonb/i, canonical: true, note: "jsonb()" },
];

const RAW_MIXIN_PATTERNS: ReadonlyArray<{ label: string; rawFile: string; mustContain: RegExp; note: string }> = [
  { label: "app_tenant_user role", rawFile: "001_roles_and_extensions.sql", mustContain: /CREATE\s+ROLE\s+app_tenant_user/i, note: "Drizzle Kit canonical 미지원" },
  { label: "RLS policy tenant_isolation", rawFile: "002_content_test.sql", mustContain: /CREATE\s+POLICY\s+tenant_isolation/i, note: "Drizzle Kit canonical 미지원·raw SQL mixin" },
  { label: "FORCE ROW LEVEL SECURITY", rawFile: "002_content_test.sql", mustContain: /FORCE\s+ROW\s+LEVEL\s+SECURITY/i, note: "raw SQL mixin" },
  { label: "tenant_audit_log_view security_invoker", rawFile: "007_tenant_audit_log_view.sql", mustContain: /security_invoker\s*=\s*on/i, note: "Drizzle Kit view 미지원·raw SQL mixin" },
  { label: "backfill UPDATE (data migration)", rawFile: "009_backfill_published_at.sql", mustContain: /UPDATE\s+content_test\s+SET\s+published_at/i, note: "data migration·raw SQL only" },
];

async function runDrizzleKitGenerate(): Promise<string> {
  const outDir = join(tmpdir(), `spike-d-drizzle-gen-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  await mkdir(outDir, { recursive: true });
  // 별도 config — out을 임시 dir로 redirect (drizzle.config.ts는 본 migrations/ 사용)
  const tempConfigPath = join(tmpdir(), `spike-d-drizzle-config-${Date.now()}.ts`);
  const schemaPath = join(APP_ROOT, "src", "db", "schema.ts").replace(/\\/g, "/");
  const tempConfig = `import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "${schemaPath}",
  out: "${outDir.replace(/\\/g, "/")}",
  dbCredentials: { url: "${(process.env.DATABASE_URL_DEV ?? "").replace(/\\/g, "/")}" },
  strict: true,
});`;
  await writeFile(tempConfigPath, tempConfig, "utf-8");
  try {
    execSync(`pnpm drizzle-kit generate --config="${tempConfigPath}"`, {
      cwd: APP_ROOT,
      stdio: "pipe",
      encoding: "utf-8",
      env: { ...process.env },
    });
  } catch (err: any) {
    if (!err.status || err.status === 0) {
      // ok
    } else {
      console.error("[canonical-generation] drizzle-kit stderr:", err.stderr?.toString());
      console.error("[canonical-generation] drizzle-kit stdout:", err.stdout?.toString());
      throw new Error(`drizzle-kit generate failed (exit ${err.status})`);
    }
  } finally {
    await rm(tempConfigPath, { force: true }).catch(() => undefined);
  }

  const files = await readdir(outDir);
  const sqlFiles = files.filter((f) => f.endsWith(".sql"));
  if (sqlFiles.length === 0) {
    await rm(outDir, { recursive: true, force: true }).catch(() => undefined);
    throw new Error(`drizzle-kit generated no SQL files in ${outDir}`);
  }
  let combined = "";
  for (const f of sqlFiles) {
    combined += `-- FILE: ${f}\n` + await readFile(join(outDir, f), "utf-8") + "\n\n";
  }
  await rm(outDir, { recursive: true, force: true }).catch(() => undefined);
  return combined;
}

async function main(): Promise<void> {
  console.log("[canonical-generation] (c) schema.ts contract assertion ...");
  assertSchemaContract();

  console.log("[canonical-generation] (a) running drizzle-kit generate ...");
  // SPIKED2-005 cycle3: hard fail — drizzle-kit 실패 시 PROVIDER_GATE fallback 제거
  const generated = await runDrizzleKitGenerate();
  if (generated.length === 0) {
    throw new Error("[canonical-generation] drizzle-kit generate produced no SQL");
  }

  let canonicalPass = 0;
  let canonicalFail = 0;
  for (const p of CANONICAL_PATTERNS) {
    if (p.regex.test(generated)) {
      canonicalPass += 1;
      console.log(`  [canonical] ✓ ${p.label} (${p.note})`);
    } else {
      canonicalFail += 1;
      console.log(`  [canonical] ✗ ${p.label} (${p.note}) — NOT FOUND in drizzle-kit output`);
    }
  }

  // raw-mixin 검증: 해당 raw SQL file 존재 + 패턴 매치
  let rawPass = 0;
  for (const p of RAW_MIXIN_PATTERNS) {
    const rawPath = join(APP_ROOT, "migrations", p.rawFile);
    const content = await readFile(rawPath, "utf-8");
    if (!p.mustContain.test(content)) {
      throw new Error(`[canonical-generation] raw-mixin ${p.label} not found in ${p.rawFile}`);
    }
    rawPass += 1;
    console.log(`  [raw-mixin] ✓ ${p.label} (${p.rawFile})`);
  }

  if (canonicalFail > 0) {
    throw new Error(`[canonical-generation] ${canonicalFail} canonical patterns not found in drizzle-kit output`);
  }

  console.log(`\n[canonical-generation] canonical=${canonicalPass}/${CANONICAL_PATTERNS.length}·raw-mixin=${rawPass}/${RAW_MIXIN_PATTERNS.length}`);
  console.log("\n✅ test-canonical-generation: PASS");
}

main().catch((err) => {
  console.error("[canonical-generation] FAIL:", err);
  process.exit(1);
});
