// Spike A — Scenario 0 (pre-flight): pgbouncer auth smoke
// SPIKEA2-005 정정: app_tenant_user가 pgbouncer 경로(6433)로 로그인 가능한지 검증

import { sql } from "drizzle-orm";
import { fileURLToPath, pathToFileURL } from "node:url";
import { closeAll, dbTenant } from "../db.ts";
import { errorMessage } from "../errors.ts";

async function main(): Promise<void> {
  console.log("pgbouncer auth smoke (DATABASE_URL_TENANT)");

  const r = await dbTenant.execute(sql`SELECT current_user AS user_name, inet_server_port() AS port`);
  const meta = (r as unknown as Array<{ user_name: string; port: number }>)[0];

  console.log(`  current_user: ${meta?.user_name}`);
  console.log(`  port (server-side): ${meta?.port}`);

  const isAppTenant = meta?.user_name === "app_tenant_user";
  console.log(`pgbouncer-auth: ${isAppTenant ? "PASS" : "FAIL"}`);
  await closeAll();
  if (!isAppTenant) process.exit(1);
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
