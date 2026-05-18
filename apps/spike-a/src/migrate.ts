// Spike A — migration runner (raw SQL, postgres super-user)
// 정정 (SPIKEA1-010): transaction wrapping·advisory lock·checksum

import { readFile, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createHash } from "node:crypto";
import { sql } from "drizzle-orm";
import { sqlSuper, closeAll } from "./db.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname, "..", "migrations");

// advisory lock key — hashtext('spike-a-migration-runner') 동등
const ADVISORY_LOCK_KEY = 4837273452847n;

async function main(): Promise<void> {
  const files = (await readdir(MIGRATIONS_DIR))
    .filter((f) => f.endsWith(".sql"))
    .sort();

  // migrations_applied tracking + checksum
  await sqlSuper.unsafe(`
    CREATE TABLE IF NOT EXISTS migrations_applied (
      filename TEXT PRIMARY KEY,
      checksum TEXT NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  // SPIKEA1-010: advisory lock (동시 migration 차단)
  console.log("acquiring migration advisory lock");
  await sqlSuper.unsafe(`SELECT pg_advisory_lock(${ADVISORY_LOCK_KEY})`);

  try {
    for (const file of files) {
      const content = await readFile(join(MIGRATIONS_DIR, file), "utf8");
      const checksum = createHash("sha256").update(content).digest("hex");

      // 이미 적용됐는지 확인
      const existing = await sqlSuper.unsafe(
        `SELECT checksum FROM migrations_applied WHERE filename = $1`,
        [file],
      );
      if (existing.length > 0) {
        const existingChecksum = (existing[0] as { checksum: string }).checksum;
        if (existingChecksum !== checksum) {
          throw new Error(
            `migration ${file} checksum mismatch — applied=${existingChecksum.slice(0, 8)} current=${checksum.slice(0, 8)}`,
          );
        }
        console.log(`  skip  ${file} (checksum match)`);
        continue;
      }

      // SPIKEA1-010: transaction으로 migration + record insert 묶기
      console.log(`apply ${file}`);
      await sqlSuper.begin(async (tx) => {
        await tx.unsafe(content);
        await tx`
          INSERT INTO migrations_applied (filename, checksum)
          VALUES (${file}, ${checksum})
        `;
      });
    }
    console.log("migrate: done");
  } finally {
    await sqlSuper.unsafe(`SELECT pg_advisory_unlock(${ADVISORY_LOCK_KEY})`);
  }

  await closeAll();
}

// CLI 직접 실행 시에만 (SPIKEA1-001 패턴 일관성)
const __filename = fileURLToPath(import.meta.url);
const argv1 = process.argv[1];
if (argv1 && pathToFileURL(argv1).href === pathToFileURL(__filename).href) {
  main().catch(async (e) => {
    console.error(e);
    await closeAll();
    process.exit(1);
  });
}
