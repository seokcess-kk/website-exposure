// Spike E — minimal migration runner (advisory lock + checksum)

import postgres from "postgres";
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { env } from "./env.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = resolve(__dirname, "../migrations");
const LOCK_KEY = "8674665223082153600";

async function ensureLedger(sql: postgres.Sql): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS migration_ledger (
      id INTEGER PRIMARY KEY,
      filename TEXT NOT NULL UNIQUE,
      checksum TEXT NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}

async function main(reset: boolean): Promise<void> {
  const sql = postgres(env.DATABASE_URL, { max: 1, prepare: false });
  try {
    if (reset) {
      await sql`DROP TABLE IF EXISTS migration_ledger, audit_event, "verificationToken", "session", instance_membership, admin_user, tenant_data CASCADE`;
      await sql`DROP ROLE IF EXISTS app_tenant_user`;
      console.log("[migrate] reset done");
      return;
    }

    const got = await sql<{ ok: boolean }[]>`SELECT pg_try_advisory_lock(${LOCK_KEY}::bigint) AS ok`;
    if (!got[0]?.ok) throw new Error("advisory lock not acquired");
    try {
      await ensureLedger(sql);
      const applied = await sql<{ id: number; checksum: string }[]>`SELECT id, checksum FROM migration_ledger`;
      const appliedMap = new Map(applied.map((r) => [r.id, r.checksum]));

      const files = (await readdir(MIGRATIONS_DIR)).filter((f) => /^\d{3}_.+\.sql$/.test(f)).sort();
      for (const filename of files) {
        const content = await readFile(join(MIGRATIONS_DIR, filename), "utf-8");
        const id = Number(filename.slice(0, 3));
        const checksum = createHash("sha256").update(content).digest("hex");
        const prior = appliedMap.get(id);
        if (prior) {
          if (prior !== checksum) throw new Error(`checksum mismatch ${filename}`);
          continue;
        }
        const start = Date.now();
        await sql.begin(async (tx) => {
          await tx.unsafe(content);
          await tx`INSERT INTO migration_ledger (id, filename, checksum) VALUES (${id}, ${filename}, ${checksum})`;
        });
        console.log(`  + ${filename} (${Date.now() - start}ms)`);
      }
    } finally {
      await sql`SELECT pg_advisory_unlock(${LOCK_KEY}::bigint)`;
    }
  } finally {
    await sql.end({ timeout: 5 });
  }
}

const reset = process.argv[2] === "reset";
main(reset).catch((err) => {
  console.error("[migrate] failed:", err);
  process.exit(1);
});
