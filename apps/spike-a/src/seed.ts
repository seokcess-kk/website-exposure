// Spike A — seed 2 instance × 5 row + audit
// SPIKEA1-001 정정: CLI 직접 실행 시에만 main() 호출
//                  INSTANCE_A/B는 fixtures.ts로 이동

import { sql } from "drizzle-orm";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dbSuper, closeAll } from "./db.ts";
import { INSTANCE_A, INSTANCE_B } from "./fixtures.ts";

async function main(): Promise<void> {
  // 기존 데이터 정리
  await dbSuper.execute(sql`TRUNCATE content_test, audit_log, invariant_log RESTART IDENTITY`);

  // instance A 5건
  for (let i = 1; i <= 5; i++) {
    await dbSuper.execute(sql`
      INSERT INTO content_test (instance_id, title)
      VALUES (${INSTANCE_A}::uuid, ${"A-" + i})
    `);
  }
  // instance B 5건
  for (let i = 1; i <= 5; i++) {
    await dbSuper.execute(sql`
      INSERT INTO content_test (instance_id, title)
      VALUES (${INSTANCE_B}::uuid, ${"B-" + i})
    `);
  }

  // audit log seed (각 instance 1건)
  await dbSuper.execute(sql`
    INSERT INTO audit_log (instance_id, actor_id, actor_role, action, metadata)
    VALUES
      (${INSTANCE_A}::uuid, 'seed', 'system', 'seed-inserted', '{"items":5}'::jsonb),
      (${INSTANCE_B}::uuid, 'seed', 'system', 'seed-inserted', '{"items":5}'::jsonb)
  `);

  console.log("seed: done — instance-a 5, instance-b 5");
  await closeAll();
}

// CLI 직접 실행 시에만 — import 시 side effect 없음 (SPIKEA1-001)
const __filename = fileURLToPath(import.meta.url);
const argv1 = process.argv[1];
if (argv1 && pathToFileURL(argv1).href === pathToFileURL(__filename).href) {
  main().catch(async (e) => {
    console.error(e);
    await closeAll();
    process.exit(1);
  });
}
