// Spike B — migration runner (Spike A 패턴 동일)

import { readFile, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createHash } from "node:crypto";
import { sqlSuper, closeAll } from "./db.ts";
import { errorMessage } from "./errors.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname, "..", "migrations");

const ADVISORY_LOCK_KEY = 4837273452848n;  // Spike A와 다른 key

async function main(): Promise<void> {
  const files = (await readdir(MIGRATIONS_DIR))
    .filter((f) => f.endsWith(".sql"))
    .sort();

  await sqlSuper.unsafe(`
    CREATE TABLE IF NOT EXISTS migrations_applied (
      filename TEXT PRIMARY KEY,
      checksum TEXT NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  console.log("acquiring migration advisory lock");
  await sqlSuper.unsafe(`SELECT pg_advisory_lock(${ADVISORY_LOCK_KEY})`);

  try {
    for (const file of files) {
      const content = await readFile(join(MIGRATIONS_DIR, file), "utf8");
      const checksum = createHash("sha256").update(content).digest("hex");

      const existing = await sqlSuper.unsafe(
        `SELECT checksum FROM migrations_applied WHERE filename = $1`,
        [file],
      );
      if (existing.length > 0) {
        const existingChecksum = (existing[0] as { checksum: string }).checksum;
        if (existingChecksum !== checksum) {
          throw new Error(`migration ${file} checksum mismatch — applied=${existingChecksum.slice(0, 8)} current=${checksum.slice(0, 8)}`);
        }
        console.log(`  skip  ${file} (checksum match)`);
        continue;
      }

      console.log(`apply ${file}`);
      await sqlSuper.begin(async (tx) => {
        await tx.unsafe(content);
        await tx`INSERT INTO migrations_applied (filename, checksum) VALUES (${file}, ${checksum})`;
      });
    }
    console.log("migrate: done");
  } finally {
    await sqlSuper.unsafe(`SELECT pg_advisory_unlock(${ADVISORY_LOCK_KEY})`);
  }

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
