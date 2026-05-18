// Spike B — seed (truncate all tables)
// 각 시나리오는 자체 enqueue로 outbox seed를 만들도록 — seed는 단순 truncate만

import { sql } from "drizzle-orm";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dbSuper, closeAll } from "./db.ts";
import { errorMessage } from "./errors.ts";

async function main(): Promise<void> {
  await dbSuper.execute(sql`
    TRUNCATE outbox, inbox, external_call_log, provider_attempt_log, permanent_alert, invariant_log RESTART IDENTITY
  `);
  console.log("seed: tables truncated");
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
